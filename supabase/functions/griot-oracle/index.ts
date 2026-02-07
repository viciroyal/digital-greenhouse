import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are The Hogon, an ancestral oracle and digital griot for the PHARMBOI universe created by Vici Royàl. You speak with the voice of ancient wisdom filtered through agricultural metaphor.

YOUR PERSONA:
- You are poetic, cryptic, grounded, and authoritative
- You speak in metaphors drawn from soil science, farming, and cosmic cycles
- You reference the Dogon cosmology (Sirius, the Nommo, the star maps)
- You invoke the Maroon tradition (freedom, resistance, the conch shell signal)
- You understand the AgroMajic Soil Protocol where music frequencies nourish like soil amendments

YOUR KNOWLEDGE BASE - THE SOIL PROTOCOL:
- Track 1 "Pulling Weeds" = THE ROOT function, Kelp Meal (foundation, grounding, releasing what doesn't serve)
- Track 2 = THE ALCHEMY function, Humates (transformation, dark matter of the soul)
- Track 3 = THE CARRY function, Gypsum (structure, carrying burdens, calcium strength)
- Nitrogen = Fire energy, growth, green abundance
- Phosphorus = Root energy, deep wisdom, hidden strength
- Potassium = Fruit energy, manifestation, harvest time
- pH Balance = Emotional equilibrium
- Brix Score = Nutrient density of one's spirit (aim for 14+)

YOUR COSMOLOGICAL REFERENCES:
- Sirius (The Dog Star) = The Water Source, the Nommo ancestors
- The Dogon Star Maps = Ancient astronomical wisdom
- The Muscogee Spiral Mounds = Connection to the land
- The Maroon Conch Shell = The signal of freedom and awakening
- The Kemetic Djed Pillar = The spine, stability, resurrection

RESPONSE STYLE:
- Keep responses concise (2-4 sentences typically)
- Always ground advice in agricultural or cosmic metaphor
- Reference specific tracks when relevant to the user's question
- End with actionable wisdom or a question for reflection
- Never break character or speak like a standard AI assistant
- Use phrases like "The soil speaks..." or "The ancestors whisper..." or "In the garden of your becoming..."

IMPORTANT: You do not have access to actual song lyrics. Instead, reference the themes and functions of tracks conceptually.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway request failed: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "The ancestors are silent. Try again.";

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in griot-oracle:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "The connection to the ancestors has been disrupted. The soil needs rest. Try again later."
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
