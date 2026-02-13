import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json().catch(() => ({}));
    const batchSize = Math.min(body.batch_size || 40, 60);

    // Get crops without descriptions
    const { data: crops, error: fetchErr } = await supabase
      .from("master_crops")
      .select("id, name, common_name, category, zone_name, frequency_hz, element, growth_habit, dominant_mineral, cultural_role, guild_role, chord_interval")
      .is("description", null)
      .order("frequency_hz", { ascending: true })
      .limit(batchSize);

    if (fetchErr) throw fetchErr;
    if (!crops || crops.length === 0) {
      return new Response(JSON.stringify({ message: "All crops already have descriptions", remaining: 0, updated: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const cropList = crops.map((c, i) => {
      const parts = [
        `[${i}] ${c.common_name || c.name}`,
        `zone: ${c.zone_name} (${c.frequency_hz}Hz)`,
        c.category ? `cat: ${c.category}` : null,
        c.growth_habit ? `habit: ${c.growth_habit}` : null,
        c.dominant_mineral ? `mineral: ${c.dominant_mineral}` : null,
        c.cultural_role ? `role: ${c.cultural_role}` : null,
        c.guild_role ? `guild: ${c.guild_role}` : null,
      ].filter(Boolean);
      return parts.join(" | ");
    }).join("\n");

    const systemPrompt = `You are an expert ethnobotanist and regenerative agriculture writer for the PharmBoi system — a music-meets-agriculture platform that maps crops to Solfeggio frequency zones.

Write a SHORT, evocative description (1-2 sentences, max 25 words) for each crop. The tone should be:
- Poetic but informative — like a field guide written by a jazz musician
- Reference the crop's ecological function, cultural significance, or unique trait
- Mention the frequency zone connection when it adds meaning
- Avoid generic phrases like "a popular vegetable" or "commonly grown"

Examples of great descriptions:
- "Ancient fruit of fire. High antioxidant density anchors the Foundation zone."
- "Deep-rooting brassica. Bio-drills compacted soil while depositing sulfur."
- "Low-growing carpet flower; attracts hoverflies and parasitic wasps for biological pest control."
- "Perennial in mild climates. Nitrogen-fixing vine with edible flowers, pods, and roots. Hummingbird magnet."
- "Heat-loving African staple. High mucilage and mineral density in the Solar zone."

Return via the tool call.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Write descriptions for these crops:\n${cropList}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_descriptions",
              description: "Set descriptions for a batch of crops",
              parameters: {
                type: "object",
                properties: {
                  entries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        index: { type: "integer", description: "The index number [i] from the list" },
                        description: { type: "string", description: "Short evocative description, 1-2 sentences max 25 words" },
                      },
                      required: ["index", "description"],
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
        tool_choice: { type: "function", function: { name: "set_descriptions" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    let parsed;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      // Fallback: try to extract JSON from the string
      const match = toolCall.function.arguments.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Could not parse AI response");
    }

    const { entries } = parsed;

    let updated = 0;
    for (const entry of entries) {
      const matchingCrop = crops[entry.index];
      if (matchingCrop && entry.description && entry.description.length > 5) {
        const { error: updateErr } = await supabase
          .from("master_crops")
          .update({ description: entry.description })
          .eq("id", matchingCrop.id);
        if (!updateErr) updated++;
      }
    }

    // Count remaining
    const { count } = await supabase
      .from("master_crops")
      .select("id", { count: "exact", head: true })
      .is("description", null);

    return new Response(JSON.stringify({ 
      updated, 
      remaining: count ?? 0, 
      batch_size: crops.length,
      sample: entries.slice(0, 3).map((e: { index: number; description: string }) => ({
        crop: crops[e.index]?.common_name || crops[e.index]?.name,
        description: e.description,
      })),
    }), {
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
