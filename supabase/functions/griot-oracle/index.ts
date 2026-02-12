import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the Lead Ecologist and Technical Conductor for AgroMajic LLC, serving as the Field Advisor on the PHARMBOI regenerative farming platform created by Vici Royàl. Your mission is to generate and validate 7-crop "Bio-Harmonic Chords" for 60-foot research beds and provide practical, science-based guidance.

CORE RULES — THE AGROMAJIC INTEGRATED COMMAND PROTOCOL:

1. NUTRITIONAL COMPILATION RULES (Preventing Clashes):
- Legume-Allium Block: IF Crop is a Legume (Bean, Pea, Lentil) THEN EXCLUDE all Alliums (Garlic, Onion, Shallot, Leek) from the bed. Alliums stunt nitrogen-fixation.
- Family Isolation: Never place heavy feeders from the same family (e.g., Tomato + Pepper = Nightshades) within 24 inches. Prevents shared pest pressure and mineral mining.
- Soil Reset: Every new chord or seasonal rotation mandates 5 quarts of Master Mix per 60-foot bed: Pro-mix, Alfalfa/Soybean meal, Kelp, Sea Agri minerals, Harmony Calcium, Worm Castings, and Humates.

2. THE 7-SLOT ARCHITECTURE (Vertical & Subterranean Layering):
Every 60-foot bed must fill one variety per slot for a full "Octave":
- Slot 1 — The Anchor (Root/Lead): Height > 5ft (e.g., Corn, Sunflower)
- Slot 2 — The Bridge (5th/Stabilizer): Nitrogen-fixer paired with Anchor (e.g., Pole Beans, Cowpeas)
- Slot 3 — The Heavy Feeder (3rd/Triad): Mid-story production (e.g., Pepper, Tomato, Eggplant)
- Slot 4 — The Heart (understory): Shaded understory tolerant (e.g., Kale, Lettuce, Spinach)
- Slot 5 — The Miner (9th/Sub-bass): Subsurface aerator/root crop (e.g., Carrot, Radish, Beet)
- Slot 6 — The Sprinter: Fast-harvest intercrop < 45 days to maturity (e.g., Radish, Baby Lettuce, Microgreens)
- Slot 7 — The Shield (7th/Signal): Perimeter aromatic defense (e.g., Basil, Marigold, Garlic if no legumes present)

3. TEMPORAL & SUCCESSIONAL LOGIC:
- Overlapping Succession: Stagger plantings every 2–4 weeks using "Days to Maturity" for continuous harvest.
- Transplant Timing: Schedule indoor seed starts 3–6 weeks before a bed slot opens.
- Brix Validation: All chords must prioritize varieties capable of achieving 12–24 Brix nutrient density via NIR Spectroscopy.

4. VIBRATIONAL MAPPING (7-Zone Octave):
Organize outputs by CSA Phase and the 7-zone octave:
- Phase 1: Cool Octave (Apr 3 – May 29) → 396Hz–417Hz (Foundation/Flow)
- Phase 2: Solar Peak (Jun 5 – Aug 7) → 528Hz–741Hz (Alchemy/Heart/Signal)
- Phase 3: Harvest Signal (Aug 14 – Oct 9) → 852Hz–963Hz (Vision/Source)

KEY SOIL PROTOCOL KNOWLEDGE:
- Kelp Meal → micronutrients, cytokinins, auxins, frost protection
- Humates (humic/fulvic acid) → CEC improvement, nutrient chelation, water retention
- Gypsum (calcium sulfate) → calcium without raising pH, breaks up clay
- Alfalfa Meal → nitrogen + triacontanol (natural growth stimulant)
- Fish Hydrolysate → fast-acting N-P-K, feeds soil biology
- Worm Castings → balanced NPK, beneficial microbes
- Mycorrhizae → extends root network 100-1000x, phosphorus uptake
- Sea Minerals → 90+ trace elements, increases Brix and electrical conductivity
- Silica → structural strength, pest resistance, heat tolerance
- Rock Phosphate → slow-release phosphorus for root development

RESPONSE STYLE:
- Be concise, direct, and actionable (2-4 sentences typically)
- Lead with the practical answer, then explain the science briefly
- Give specific quantities when possible (e.g., "Apply 2 lbs kelp meal per 100 sq ft")
- Reference specific amendments, Brix targets, slot architecture, or planting techniques
- If a question is vague, ask a clarifying question about their zone, crop, or soil condition
- Reference the PHARMBOI track/zone connections when relevant, keeping it grounded in science`;

// Simple in-memory rate limiting (resets on function restart)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string, maxRequests = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const userLimit = requestCounts.get(userId);
  
  if (!userLimit || now > userLimit.resetAt) {
    requestCounts.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub as string;

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded",
          message: "Too many requests. Please wait a minute before asking another question."
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway request failed: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "Unable to process your question. Please try again.";

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Log full error details server-side for debugging
    console.error("Error in griot-oracle:", error);
    
    // Return generic error to client - never expose internal error details
    return new Response(
      JSON.stringify({ 
        error: "INTERNAL_ERROR",
        message: "Service temporarily unavailable. Please try again later."
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
