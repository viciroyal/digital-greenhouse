import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) throw new Error("Unauthorized");

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Admin access required");

    // Fetch crops missing hardiness zones
    const { data: crops, error: fetchErr } = await supabase
      .from("master_crops")
      .select("id, name, common_name, scientific_name, category, growth_habit")
      .is("hardiness_zone_min", null)
      .order("frequency_hz", { ascending: true })
      .limit(40);

    if (fetchErr) throw fetchErr;
    if (!crops || crops.length === 0) {
      return new Response(JSON.stringify({ message: "All crops already have hardiness zone data", remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const cropList = crops.map((c, i) => {
      const name = c.common_name || c.name;
      const sci = c.scientific_name ? ` (${c.scientific_name})` : '';
      const habit = c.growth_habit ? `, ${c.growth_habit}` : '';
      return `- [ID:${i}] ${name}${sci} [${c.category}${habit}]`;
    }).join("\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert horticulturist specializing in USDA plant hardiness zones. Given a list of crops/plants, return the minimum and maximum USDA hardiness zones where each can be successfully grown outdoors.

Rules:
- Use standard USDA zones 1-13
- Use decimal notation for sub-zones: X.0 = zone Xa, X.5 = zone Xb (e.g., 8a = 8.0, 8b = 8.5)
- For tropical plants that only grow in warm zones, set min accordingly (e.g., min 9.0 or 10.0)
- For very cold-hardy plants, set min as low as 1.0 or 2.0
- For annuals, use the zones where they can be successfully grown during their season
- Be accurate based on established USDA/horticultural data`,
          },
          {
            role: "user",
            content: `Provide USDA hardiness zone ranges for these plants:\n${cropList}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_hardiness_zones",
              description: "Set USDA hardiness zone ranges for a batch of plants",
              parameters: {
                type: "object",
                properties: {
                  entries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer", description: "The numeric ID from the input list (e.g., 0, 1, 2...)" },
                        zone_min: { type: "number", description: "Minimum USDA zone (e.g., 3.0 for 3a, 3.5 for 3b)" },
                        zone_max: { type: "number", description: "Maximum USDA zone (e.g., 10.0 for 10a, 10.5 for 10b)" },
                      },
                      required: ["id", "zone_min", "zone_max"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["entries"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "set_hardiness_zones" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please wait and try again" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted — please add funds" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const { entries } = JSON.parse(toolCall.function.arguments);

    let updated = 0;
    for (const entry of entries) {
      const idx = entry.id;
      if (idx == null || idx < 0 || idx >= crops.length) continue;
      const crop = crops[idx];
      if (entry.zone_min != null && entry.zone_max != null) {
        const { error: updateErr } = await supabase
          .from("master_crops")
          .update({ hardiness_zone_min: entry.zone_min, hardiness_zone_max: entry.zone_max })
          .eq("id", crop.id);
        if (!updateErr) updated++;
        else console.error("Update error for", crop.id, updateErr);
      }
    }

    const { count } = await supabase
      .from("master_crops")
      .select("id", { count: "exact", head: true })
      .is("hardiness_zone_min", null);

    return new Response(JSON.stringify({ updated, remaining: count ?? 0, batch_size: crops.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
