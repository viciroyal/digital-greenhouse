import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Zone definitions for the 7-Zone Octave
const ZONES = [
  { hz: 396, name: "Grounding", color: "hsl(0 100% 50%)", element: "Earth", mineral: "P", focus: "ROOT_FOCUS" },
  { hz: 417, name: "Flow", color: "hsl(30 100% 50%)", element: "Water", mineral: "H", focus: "FLOW_FOCUS" },
  { hz: 528, name: "Solar", color: "hsl(60 100% 50%)", element: "Fire", mineral: "N", focus: "SOLAR_FOCUS" },
  { hz: 639, name: "Heart", color: "hsl(120 100% 50%)", element: "Air", mineral: "Ca", focus: "HEART_FOCUS" },
  { hz: 741, name: "Signal", color: "hsl(210 60% 50%)", element: "Ether", mineral: "K", focus: "EXPRESSION_FOCUS" },
  { hz: 852, name: "Vision", color: "hsl(275 100% 26%)", element: "Light", mineral: "Si", focus: "INTUITION_FOCUS" },
  { hz: 963, name: "Shield", color: "hsl(280 100% 27%)", element: "Spirit", mineral: "S", focus: "SOURCE_FOCUS" },
];

const CATEGORIES = ["Sustenance", "Sentinel/Miner", "Nitrogen/Bio-Mass", "Dye/Fiber/Aromatic"];
const CHORD_INTERVALS = ["Root (Lead)", "3rd (Triad)", "5th (Stabilizer)", "7th (Signal)", "9th (Sub-bass)"];
const GUILD_ROLES = ["Lead", "Sentinel", "Miner", "Enhancer"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify admin role from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) throw new Error("Unauthorized");
    
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const batchNum = body.batch || 1;

    // Get existing crop names to avoid duplicates
    const { data: existing } = await supabase
      .from("master_crops")
      .select("name");
    const existingNames = new Set((existing || []).map(c => c.name.toLowerCase()));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Pick a zone subset for this batch to ensure even distribution
    const zoneForBatch = ZONES[batchNum % ZONES.length];
    const secondZone = ZONES[(batchNum + 1) % ZONES.length];
    const thirdZone = ZONES[(batchNum + 2) % ZONES.length];

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
            content: `You are an ethnobotanist and tropical agronomist. Generate unique tropical, subtropical, and indigenous crop varieties for a regenerative agriculture database. 

IMPORTANT RULES:
- Focus on crops from Africa, Caribbean, Southeast Asia, Pacific Islands, Central/South America, India, and indigenous traditions worldwide
- Include food crops, medicinal plants, fiber crops, dye plants, nitrogen fixers, and aromatic/pollinator plants
- Each crop MUST have a unique internal name in snake_case format (e.g., "breadfruit_hawaiian", "moringa_oleifera_741")
- Distribute across these 3 frequency zones for this batch:
  Zone 1: ${zoneForBatch.hz}Hz (${zoneForBatch.name}) - Element: ${zoneForBatch.element}, Mineral: ${zoneForBatch.mineral}
  Zone 2: ${secondZone.hz}Hz (${secondZone.name}) - Element: ${secondZone.element}, Mineral: ${secondZone.mineral}  
  Zone 3: ${thirdZone.hz}Hz (${thirdZone.name}) - Element: ${thirdZone.element}, Mineral: ${thirdZone.mineral}
- Assign chord_interval from: ${CHORD_INTERVALS.join(", ")}
- Assign category from: ${CATEGORIES.join(", ")}
- Assign guild_role from: ${GUILD_ROLES.join(", ")}
- Include realistic hardiness zones (as decimals: 8.0 = 8a, 8.5 = 8b, etc.)
- Include realistic brix targets, harvest days, spacing
- Generate 30 crops total (10 per zone)

DO NOT include these crops that already exist: ${Array.from(existingNames).slice(0, 200).join(", ")}

Return via the tool call.`,
          },
          {
            role: "user",
            content: `Generate batch #${batchNum} of 30 tropical/subtropical/indigenous crops. Make them unique and culturally significant. Include crops like: breadfruit, taro, cassava varieties, moringa, baobab, African yam, ube, jackfruit, rambutan, dragonfruit, soursop, guanabana, cacao, vanilla, cardamom, turmeric, galangal, lemongrass, pandan, neem, vetiver, indigo, kenaf, roselle, pigeon pea, winged bean, chaya, jicama, nopal, epazote, huauzontle, chayote, amaranth varieties, quinoa varieties, maca, lucuma, cherimoya, sapote, mamey, guava varieties, passion fruit, açaí, cupuaçu, camu camu, sacha inchi, yacon, oca, mashua, ulluco, arracacha, etc.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "insert_tropical_crops",
              description: "Insert a batch of tropical/subtropical/indigenous crops",
              parameters: {
                type: "object",
                properties: {
                  crops: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Internal snake_case name with frequency suffix" },
                        common_name: { type: "string", description: "Human-readable common name" },
                        scientific_name: { type: "string", description: "Binomial scientific name" },
                        frequency_hz: { type: "integer", description: "Solfeggio frequency" },
                        zone_name: { type: "string" },
                        element: { type: "string" },
                        category: { type: "string" },
                        chord_interval: { type: "string" },
                        guild_role: { type: "string" },
                        dominant_mineral: { type: "string" },
                        brix_target_min: { type: "integer" },
                        brix_target_max: { type: "integer" },
                        hardiness_zone_min: { type: "number" },
                        hardiness_zone_max: { type: "number" },
                        harvest_days: { type: "integer" },
                        spacing_inches: { type: "string" },
                        growth_habit: { type: "string" },
                        planting_season: { type: "array", items: { type: "string" } },
                        library_note: { type: "string", description: "Cultural and ecological significance" },
                      },
                      required: ["name", "common_name", "scientific_name", "frequency_hz", "zone_name", "element", "category", "chord_interval", "guild_role"],
                    },
                  },
                },
                required: ["crops"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "insert_tropical_crops" } },
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

    const { crops } = JSON.parse(toolCall.function.arguments);

    let inserted = 0;
    let skipped = 0;

    for (const crop of crops) {
      // Skip duplicates
      if (existingNames.has(crop.name.toLowerCase())) {
        skipped++;
        continue;
      }

      // Find the zone config for color and focus_tag
      const zoneConfig = ZONES.find(z => z.hz === crop.frequency_hz);
      if (!zoneConfig) {
        skipped++;
        continue;
      }

      const { error: insertErr } = await supabase.from("master_crops").insert({
        name: crop.name,
        common_name: crop.common_name,
        scientific_name: crop.scientific_name,
        frequency_hz: crop.frequency_hz,
        zone_name: crop.zone_name || zoneConfig.name,
        zone_color: zoneConfig.color,
        element: crop.element || zoneConfig.element,
        category: crop.category || "Sustenance",
        chord_interval: crop.chord_interval,
        guild_role: crop.guild_role,
        dominant_mineral: crop.dominant_mineral || zoneConfig.mineral,
        focus_tag: zoneConfig.focus,
        brix_target_min: crop.brix_target_min || 12,
        brix_target_max: crop.brix_target_max || 24,
        hardiness_zone_min: crop.hardiness_zone_min,
        hardiness_zone_max: crop.hardiness_zone_max,
        harvest_days: crop.harvest_days,
        spacing_inches: crop.spacing_inches,
        growth_habit: crop.growth_habit,
        planting_season: crop.planting_season,
        library_note: crop.library_note,
      });

      if (!insertErr) {
        inserted++;
        existingNames.add(crop.name.toLowerCase());
      } else {
        console.error("Insert error for", crop.name, insertErr.message);
        skipped++;
      }
    }

    // Get total count
    const { count } = await supabase
      .from("master_crops")
      .select("id", { count: "exact", head: true });

    return new Response(
      JSON.stringify({ inserted, skipped, total_crops: count, batch: batchNum, generated: crops.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
