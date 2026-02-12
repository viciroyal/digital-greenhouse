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

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Admin access required");

    // Fetch crops missing companion_crops (null or empty array)
    const { data: crops, error: fetchErr } = await supabase
      .from("master_crops")
      .select("id, name, common_name, category, zone_name, scientific_name, growth_habit, planting_season")
      .or("companion_crops.is.null,companion_crops.eq.{}")
      .order("frequency_hz", { ascending: true })
      .limit(25); // Smaller batches for richer AI output

    if (fetchErr) throw fetchErr;
    if (!crops || crops.length === 0) {
      return new Response(JSON.stringify({ message: "All crops already have companion data", remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Build prompt with crop details for context
    const cropList = crops.map((c, i) => {
      const name = c.common_name || c.name;
      const sci = c.scientific_name ? ` (${c.scientific_name})` : '';
      const habit = c.growth_habit ? `, ${c.growth_habit}` : '';
      const seasons = c.planting_season?.length ? `, seasons: ${c.planting_season.join('/')}` : '';
      return `- [ID:${i}] ${name}${sci} [${c.category}${habit}${seasons}]`;
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
            content: `You are an expert agricultural companion planting specialist. Given a list of crops, return the best companion plants for each crop based on established companion planting science (pest deterrence, nutrient sharing, growth habit complementarity, pollinator attraction).

Rules:
- Return 3-8 companions per crop as common names (lowercase)
- Only suggest companions that are real, well-documented beneficial pairings
- Consider allelopathic effects, root depth compatibility, and pest/disease management
- Include nitrogen fixers where appropriate
- Do NOT include known antagonists (e.g., don't pair onions with beans)
- Use simple common names: "basil", "tomato", "marigold" (not "Sweet Basil" or "Roma Tomato")`,
          },
          {
            role: "user",
            content: `Provide companion crops for each of these plants:\n${cropList}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_companion_crops",
              description: "Set companion crops for a batch of plants",
              parameters: {
                type: "object",
                properties: {
                  entries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer", description: "The numeric ID from the input list (e.g., 0, 1, 2...)" },
                        companions: {
                          type: "array",
                          items: { type: "string" },
                          description: "Array of companion plant common names (lowercase, 3-8 items)",
                        },
                      },
                      required: ["id", "companions"],
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
        tool_choice: { type: "function", function: { name: "set_companion_crops" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please wait a moment and try again" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted — please add funds" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const { entries } = JSON.parse(toolCall.function.arguments);

    // Match and update
    let updated = 0;
    for (const entry of entries) {
      const idx = entry.id;
      if (idx == null || idx < 0 || idx >= crops.length) continue;
      const crop = crops[idx];
      if (entry.companions && entry.companions.length > 0) {
        const { error: updateErr } = await supabase
          .from("master_crops")
          .update({ companion_crops: entry.companions })
          .eq("id", crop.id);
        if (!updateErr) updated++;
        else console.error("Update error for", crop.id, updateErr);
      }
    }

    // Count remaining
    const { count } = await supabase
      .from("master_crops")
      .select("id", { count: "exact", head: true })
      .or("companion_crops.is.null,companion_crops.eq.{}");

    return new Response(JSON.stringify({ updated, remaining: count ?? 0, batch_size: crops.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
