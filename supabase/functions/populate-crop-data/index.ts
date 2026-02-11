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

    // Parse which field to populate
    const body = await req.json().catch(() => ({}));
    const field = body.field || "growth_habit";

    if (field !== "growth_habit" && field !== "scientific_name") {
      throw new Error("Invalid field");
    }

    const { data: crops, error: fetchErr } = await supabase
      .from("master_crops")
      .select("id, name, common_name, category")
      .is(field, null)
      .order("frequency_hz", { ascending: true })
      .limit(50);

    if (fetchErr) throw fetchErr;
    if (!crops || crops.length === 0) {
      return new Response(JSON.stringify({ message: `All crops already have ${field}`, remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const cropList = crops.map(c => `- ${c.common_name || c.name} (category: ${c.category})`).join("\n");

    const systemPrompts: Record<string, string> = {
      growth_habit: `You are a horticulturist. Given crop names, classify each with its growth habit. Use ONLY these values: tree, shrub, bush, vine, herb, grass, ground cover, underground, bulb, root, tuber, rhizome, aquatic, succulent, fungus, epiphyte. Pick the single most accurate term. Return via the tool call.`,
      scientific_name: `You are a botanist. Given crop names, return the correct binomial scientific name (genus + species) for each. Use the most commonly cultivated species. Return via the tool call.`,
    };

    const valueField = field === "growth_habit" ? "value" : "scientific_name";

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
                      properties: {
                        common_name: { type: "string" },
                        value: { type: "string" },
                      },
                      required: ["common_name", "value"],
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
      const matchingCrop = crops.find(
        c => (c.common_name || c.name).toLowerCase() === entry.common_name.toLowerCase()
      );
      if (matchingCrop && entry.value) {
        const { error: updateErr } = await supabase
          .from("master_crops")
          .update({ [field]: entry.value })
          .eq("id", matchingCrop.id);
        if (!updateErr) updated++;
      }
    }

    const { count } = await supabase
      .from("master_crops")
      .select("id", { count: "exact", head: true })
      .is(field, null);

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
