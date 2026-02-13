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
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired token — please re-login" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all crops with seasons, then filter in JS to those needing expansion
    const { data: allCropsRaw, error: fetchErr } = await supabase
      .from("master_crops")
      .select("id, name, common_name, scientific_name, category, growth_habit, planting_season, hardiness_zone_min, hardiness_zone_max, harvest_days")
      .not("planting_season", "is", null)
      .order("name", { ascending: true });

    // Filter to crops with < 3 seasons, then take first 80
    const crops = (allCropsRaw || [])
      .filter(c => (c.planting_season || []).length < 3)
      .slice(0, 200);

    if (fetchErr) throw fetchErr;

    if (crops.length === 0) {
      const { data: allCheck } = await supabase
        .from("master_crops")
        .select("planting_season")
        .not("planting_season", "is", null);
      const remaining = allCheck?.filter(c => (c.planting_season || []).length < 3).length || 0;
      return new Response(JSON.stringify({ message: "All crops have 3+ seasons", updated: 0, remaining }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const needsExpansion = crops;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const cropList = needsExpansion.map((c, i) => {
      const name = c.common_name || c.name;
      const sci = c.scientific_name ? ` (${c.scientific_name})` : '';
      const habit = c.growth_habit ? `, ${c.growth_habit}` : '';
      const zones = (c.hardiness_zone_min != null && c.hardiness_zone_max != null)
        ? `, Zones ${c.hardiness_zone_min}-${c.hardiness_zone_max}`
        : '';
      const days = c.harvest_days ? `, ${c.harvest_days}d harvest` : '';
      const current = (c.planting_season || []).join(', ');
      return `- [ID:${i}] ${name}${sci} [${c.category}${habit}${zones}${days}] Current: [${current}]`;
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
            content: `You are an expert horticulturist specializing in season-extension and multi-season planting strategies.

Given a list of crops with their current planting season assignments, expand each crop's planting seasons to include ALL biologically valid seasons.

Rules:
- Seasons are: Spring, Summer, Fall, Winter
- A crop can have 1-4 seasons
- Consider the crop's hardiness zones when assigning Winter/Summer
- Cool-season crops (lettuce, spinach, kale, peas, radish, beet, carrot, turnip, brassicas) typically grow in: Spring, Fall, and often Winter in zones 7+
- Warm-season crops (tomato, pepper, squash, corn, beans, melon, cucumber, eggplant) typically grow in: Spring, Summer
- Tropical/perennial crops in zones 9+ may grow year-round: Spring, Summer, Fall, Winter
- Herbs often span: Spring, Summer, Fall (some like parsley/cilantro also Winter in mild zones)
- Trees/shrubs with long establishment: Spring, Fall
- Cover crops and nitrogen fixers: often Spring, Fall, sometimes Winter
- Fast-maturing crops (under 45 days) can often squeeze into more seasons
- DO NOT remove any existing seasons — only ADD new valid ones
- Be practical and regionally accurate based on USDA zones provided`,
          },
          {
            role: "user",
            content: `Expand the planting seasons for these crops. Only add seasons that are biologically accurate:\n${cropList}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_planting_seasons",
              description: "Set expanded planting seasons for a batch of crops",
              parameters: {
                type: "object",
                properties: {
                  entries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer", description: "The numeric ID from the input list" },
                        seasons: {
                          type: "array",
                          items: { type: "string", enum: ["Spring", "Summer", "Fall", "Winter"] },
                          description: "Complete list of valid planting seasons for this crop",
                        },
                      },
                      required: ["id", "seasons"],
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
        tool_choice: { type: "function", function: { name: "set_planting_seasons" } },
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
    
    // Check if gateway returned an error in the body (HTTP 200 but error payload)
    if (aiData.error) {
      console.error("AI gateway returned error in body:", JSON.stringify(aiData.error));
      const msg = aiData.error.message || "AI gateway error";
      return new Response(JSON.stringify({ error: `AI service error: ${msg}. Please retry.` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let entries: any[];

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      entries = JSON.parse(toolCall.function.arguments).entries;
    } else {
      // Fallback: parse JSON from content when tool_calls missing
      const content = aiData.choices?.[0]?.message?.content || "";
      let cleaned = content.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        entries = parsed.entries;
      }
      if (!entries!) {
        console.error("AI response had no tool call or parseable content:", JSON.stringify(aiData).substring(0, 500));
        throw new Error("Could not extract structured data from AI response");
      }
    }

    let updated = 0;
    const validSeasons = new Set(["Spring", "Summer", "Fall", "Winter"]);

    for (const entry of entries) {
      const idx = entry.id;
      if (idx == null || idx < 0 || idx >= needsExpansion.length) continue;
      const crop = needsExpansion[idx];
      
      // Validate and merge: keep existing + add new valid seasons
      const existingSeasons = new Set(crop.planting_season || []);
      const newSeasons = (entry.seasons || []).filter((s: string) => validSeasons.has(s));
      
      // Merge existing + new
      for (const s of newSeasons) {
        existingSeasons.add(s);
      }
      
      const mergedSeasons = Array.from(existingSeasons).sort();
      
      // Only update if we actually added seasons
      if (mergedSeasons.length > (crop.planting_season || []).length) {
        const { error: updateErr } = await supabase
          .from("master_crops")
          .update({ planting_season: mergedSeasons })
          .eq("id", crop.id);
        if (!updateErr) updated++;
        else console.error("Update error for", crop.id, updateErr);
      }
    }

    // Count remaining crops with < 3 seasons
    const { data: allCrops2 } = await supabase
      .from("master_crops")
      .select("planting_season")
      .not("planting_season", "is", null);
    
    const remaining = allCrops2?.filter(c => (c.planting_season || []).length < 3).length || 0;

    return new Response(JSON.stringify({ updated, remaining, batch_size: needsExpansion.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
