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

    const { data: crops, error: fetchErr } = await supabase
      .from("master_crops")
      .select("id, name, common_name, scientific_name, category, growth_habit")
      .is("harvest_days", null)
      .in("category", ["Sustenance", "Aromatic"])
      .order("name", { ascending: true })
      .limit(40);

    if (fetchErr) throw fetchErr;
    if (!crops || crops.length === 0) {
      return new Response(JSON.stringify({ message: "All crops already have harvest_days", remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const cropList = crops.map(c => {
      const name = c.common_name || c.name;
      const sci = c.scientific_name ? ` (${c.scientific_name})` : '';
      const habit = c.growth_habit ? `, ${c.growth_habit}` : '';
      return `- ${name}${sci} [${c.category}${habit}]`;
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
            content: `You are an expert horticulturist. Given a list of crops, return the typical number of days from planting/transplant to first harvest.

Rules:
- Return days as integers
- For perennials/trees, return days to first meaningful harvest from a transplant (not from seed)
- For annuals, return days from transplant or direct sow to harvest
- For herbs/aromatics, return days to first cutting
- Use standard horticultural references
- If a range exists, use the midpoint`,
          },
          {
            role: "user",
            content: `Provide harvest days for these plants:\n${cropList}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_harvest_days",
              description: "Set harvest days for a batch of plants",
              parameters: {
                type: "object",
                properties: {
                  entries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        common_name: { type: "string", description: "The plant common name as given in the input" },
                        harvest_days: { type: "integer", description: "Days from planting to first harvest" },
                      },
                      required: ["common_name", "harvest_days"],
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
        tool_choice: { type: "function", function: { name: "set_harvest_days" } },
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
      const matchingCrop = crops.find(
        c => (c.common_name || c.name).toLowerCase() === entry.common_name.toLowerCase()
      );
      if (matchingCrop && entry.harvest_days != null && entry.harvest_days > 0) {
        const { error: updateErr } = await supabase
          .from("master_crops")
          .update({ harvest_days: entry.harvest_days })
          .eq("id", matchingCrop.id);
        if (!updateErr) updated++;
        else console.error("Update error for", matchingCrop.id, updateErr);
      }
    }

    const { count } = await supabase
      .from("master_crops")
      .select("id", { count: "exact", head: true })
      .is("harvest_days", null)
      .in("category", ["Sustenance", "Aromatic"]);

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
