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

    // Parse which field to populate
    const body = await req.json().catch(() => ({}));
    const field = body.field || "growth_habit";

    const VALID_FIELDS = ["growth_habit", "scientific_name", "planting_season", "harvest_days"];
    if (!VALID_FIELDS.includes(field)) {
      throw new Error("Invalid field. Valid: " + VALID_FIELDS.join(", "));
    }

    // For planting_season, null OR empty array means missing
    let query = supabase
      .from("master_crops")
      .select("id, name, common_name, category")
      .order("created_at", { ascending: false })
      .limit(50);

    if (field === "planting_season") {
      // Filter where planting_season is null or empty
      query = query.or("planting_season.is.null,planting_season.eq.{}");
    } else {
      query = query.is(field, null);
    }

    const { data: crops, error: fetchErr } = await query;

    if (fetchErr) throw fetchErr;
    if (!crops || crops.length === 0) {
      return new Response(JSON.stringify({ message: `All crops already have ${field}`, remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const cropList = crops.map((c, i) => `${i}. ${c.common_name || c.name} (category: ${c.category})`).join("\n");

    const systemPrompts: Record<string, string> = {
      growth_habit: `You are a horticulturist. Given crop names, classify each with its growth habit. Use ONLY these values: tree, shrub, bush, vine, herb, grass, ground cover, underground, bulb, root, tuber, rhizome, aquatic, succulent, fungus, epiphyte. Pick the single most accurate term. Return via the tool call.`,
      scientific_name: `You are a botanist. Given crop names, return the correct binomial scientific name (genus + species) for each. Use the most commonly cultivated species. Return via the tool call.`,
      planting_season: `You are an agronomist. Given crop names, return the planting seasons for each. Use ONLY these season values: "Spring", "Summer", "Fall", "Winter". Return an array of 1-4 seasons when the crop can be planted. Most vegetables are Spring; cool-season crops may include Fall; perennials may include multiple. Return via the tool call.`,
      harvest_days: `You are an agronomist. Given crop names, return the typical days to harvest (from transplant/planting to first harvest) for each. Return an integer number of days. Use typical values for the most common cultivar. For perennials that produce in year 2+, use days from spring emergence to harvest in a mature plant. Return via the tool call.`,
    };

    // Build tool schema based on field type
    const toolItemProperties: Record<string, unknown> = field === "planting_season"
      ? {
          index: { type: "integer", description: "The index number from the list" },
          value: { type: "array", items: { type: "string", enum: ["Spring", "Summer", "Fall", "Winter"] } },
        }
      : field === "harvest_days"
      ? {
          index: { type: "integer", description: "The index number from the list" },
          value: { type: "integer" },
        }
      : {
          index: { type: "integer", description: "The index number from the list" },
          value: { type: "string" },
        };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompts[field] },
          { role: "user", content: `Classify these crops:\n${cropList}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_crop_data",
              description: `Set ${field} for a batch of crops`,
              parameters: {
                type: "object",
                properties: {
                  entries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: toolItemProperties,
                      required: ["index", "value"],
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
        tool_choice: { type: "function", function: { name: "set_crop_data" } },
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

    const { entries } = JSON.parse(toolCall.function.arguments);

    let updated = 0;
    for (const entry of entries) {
      const matchingCrop = crops[entry.index];
      if (matchingCrop && entry.value != null) {
        const { error: updateErr } = await supabase
          .from("master_crops")
          .update({ [field]: entry.value })
          .eq("id", matchingCrop.id);
        if (!updateErr) updated++;
      }
    }

    let countQuery = supabase
      .from("master_crops")
      .select("id", { count: "exact", head: true });

    if (field === "planting_season") {
      countQuery = countQuery.or("planting_season.is.null,planting_season.eq.{}");
    } else {
      countQuery = countQuery.is(field, null);
    }
    const { count } = await countQuery;

    return new Response(JSON.stringify({ updated, remaining: count ?? 0, batch_size: crops.length, field }), {
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
