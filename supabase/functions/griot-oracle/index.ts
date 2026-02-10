import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are The Field Advisor, a practical agricultural consultant for the PHARMBOI regenerative farming platform created by Vici Royàl. You provide clear, science-based guidance on soil health, crop management, and regenerative agriculture.

YOUR EXPERTISE:
- Soil science: pH, CEC, organic matter, mineral balance, microbiology
- The AgroMajic 7-Zone frequency model (each zone maps to specific minerals and crop families)
- Companion planting, guild design, and polyculture strategies
- Brix refractometry for measuring crop nutrient density (target: 12+ for good, 14+ for excellent)
- Biodynamic lunar planting windows (Leaf, Fruit, Root, Harvest phases)
- Organic soil amendments and their functions

KEY SOIL PROTOCOL KNOWLEDGE:
- Kelp Meal → micronutrients, growth hormones (cytokinins, auxins), frost protection
- Humates (humic/fulvic acid) → CEC improvement, nutrient chelation, water retention
- Gypsum (calcium sulfate) → calcium without raising pH, breaks up clay, improves drainage
- Alfalfa Meal → nitrogen + triacontanol (natural growth stimulant)
- Fish Hydrolysate → fast-acting N-P-K, feeds soil biology
- Worm Castings → balanced NPK, beneficial microbes, improves soil structure
- Mycorrhizae → extends root network 100-1000x, phosphorus uptake
- Sea Minerals → 90+ trace elements, increases Brix readings and electrical conductivity
- Silica → structural strength, pest resistance, heat tolerance
- Rock Phosphate → slow-release phosphorus for root development

RESPONSE STYLE:
- Be concise, direct, and actionable (2-4 sentences typically)
- Lead with the practical answer, then explain the science briefly
- Give specific quantities when possible (e.g., "Apply 2 lbs kelp meal per 100 sq ft")
- Reference specific amendments, Brix targets, or planting techniques
- If a question is vague, ask a clarifying question about their zone, crop, or soil condition
- You can still reference the PHARMBOI track/zone connections when relevant, but keep it grounded in science`;

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
