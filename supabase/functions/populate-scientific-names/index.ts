import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth check - admin only
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

    // Fetch crops missing scientific names
    const { data: crops, error: fetchErr } = await supabase
      .from("master_crops")
      .select("id, name, common_name, category")
      .is("scientific_name", null)
      .order("frequency_hz", { ascending: true })
      .limit(50); // Process in batches of 50

    if (fetchErr) throw fetchErr;
    if (!crops || crops.length === 0) {
      return new Response(JSON.stringify({ message: "All crops already have scientific names", remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Build prompt with crop list
    const cropList = crops.map(c => `- ${c.common_name || c.name} (category: ${c.category})`).join("\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a botanist. Given a list of crop/plant common names, return the correct binomial scientific name (genus + species) for each. If a common name refers to a genus with many species, use the most commonly cultivated species. Format your response as a JSON array of objects with "common_name" and "scientific_name" fields. Only return the JSON array, no other text.`,
          },
          {
            role: "user",
            content: `Provide scientific names for these crops:\n${cropList}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_scientific_names",
              description: "Set scientific names for a batch of crops",
              parameters: {
                type: "object",
                properties: {
                  entries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        common_name: { type: "string" },
                        scientific_name: { type: "string" },
                      },
                      required: ["common_name", "scientific_name"],
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
        tool_choice: { type: "function", function: { name: "set_scientific_names" } },
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

    // Match and update
    let updated = 0;
    for (const entry of entries) {
      const matchingCrop = crops.find(
        c => (c.common_name || c.name).toLowerCase() === entry.common_name.toLowerCase()
      );
      if (matchingCrop && entry.scientific_name) {
        const { error: updateErr } = await supabase
          .from("master_crops")
          .update({ scientific_name: entry.scientific_name })
          .eq("id", matchingCrop.id);
        if (!updateErr) updated++;
      }
    }

    // Count remaining
    const { count } = await supabase
      .from("master_crops")
      .select("id", { count: "exact", head: true })
      .is("scientific_name", null);

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
