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
      .select("id, name, common_name, scientific_name, category, growth_habit, propagation_method")
      .is("seed_cost_cents", null)
      .order("frequency_hz", { ascending: true })
      .limit(40);

    if (fetchErr) throw fetchErr;
    if (!crops || crops.length === 0) {
      return new Response(JSON.stringify({ message: "All crops already have seed cost data", remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const cropList = crops.map((c, i) => {
      const name = c.common_name || c.name;
      const sci = c.scientific_name ? ` (${c.scientific_name})` : '';
      const habit = c.growth_habit ? `, ${c.growth_habit}` : '';
      const prop = c.propagation_method ? `, propagation: ${c.propagation_method}` : '';
      return `- [ID:${i}] ${name}${sci} [${c.category}${habit}${prop}]`;
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
            content: `You are an expert in agricultural economics and seed pricing. Given a list of crops, return the estimated cost per seed or per start in US cents.

Rules:
- Return cost in cents (integer) for a single seed or transplant start
- For common vegetables/herbs from seed: typically 5-50 cents per seed
- For specialty/rare varieties: can be higher (50-200 cents)
- For plants typically sold as starts/transplants (trees, perennials, shrubs): estimate cost of a small nursery start (200-2000 cents)
- For plants propagated by division/cutting: estimate cost of a single division or cutting (100-500 cents)
- Use typical retail prices from major seed suppliers (Johnny's, Baker Creek, Burpee)
- Round to nearest 5 cents for seeds, nearest 50 cents for starts`,
          },
          {
            role: "user",
            content: `Provide estimated seed/start cost in cents for these plants:\n${cropList}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_seed_costs",
              description: "Set seed cost in cents for a batch of plants",
              parameters: {
                type: "object",
                properties: {
                  entries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer", description: "The numeric ID from the input list (e.g., 0, 1, 2...)" },
                        cost_cents: { type: "integer", description: "Cost per seed or start in US cents" },
                      },
                      required: ["id", "cost_cents"],
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
        tool_choice: { type: "function", function: { name: "set_seed_costs" } },
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
      if (entry.cost_cents != null && entry.cost_cents > 0) {
        const { error: updateErr } = await supabase
          .from("master_crops")
          .update({ seed_cost_cents: entry.cost_cents })
          .eq("id", crop.id);
        if (!updateErr) updated++;
        else console.error("Update error for", crop.id, updateErr);
      }
    }

    const { count } = await supabase
      .from("master_crops")
      .select("id", { count: "exact", head: true })
      .is("seed_cost_cents", null);

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
