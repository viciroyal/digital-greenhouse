/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE ANCESTRAL PATH DATABASE (THEORY & SPIRIT)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * STRICT PROTOCOL: This database contains the "Soul" and "Knowledge."
 * 
 * ALLOWED FIELDS:
 * - Source_Title (e.g., "Teaming with Microbes")
 * - Wisdom_Quote (e.g., "The microbe is the bridge...")
 * - Civilization_Origin (e.g., "Dogon", "Indigenous")
 * - Reflection_Prompt (e.g., "What did the soil say today?")
 * 
 * UI BEHAVIOR: Readable Typography, Warm Colors (Purple/Gold), Images.
 * 
 * THE LINK: Accessed via `wisdomKey` from Almanac's ℹ️ icon.
 */

// ============================================================================
// WISDOM ENTRY INTERFACE
// ============================================================================

export interface WisdomEntry {
  key: string; // Matches wisdomKey in almanacData
  sourceTitle: string;
  sourceAuthor: string;
  civilizationOrigin: string;
  wisdomQuote: string;
  reflectionPrompt: string;
  deeperReading?: string; // Optional link to full chapter/text
  imageUrl?: string; // Optional illustration
}

// ============================================================================
// THE WISDOM DATABASE
// ============================================================================

export const wisdomDatabase: Record<string, WisdomEntry> = {
  // ─────────────────────────────────────────────────────────────────────────
  // BATCH 1: THE MICROSCOPIC & ALCHEMICAL
  // ─────────────────────────────────────────────────────────────────────────
  'ingham-soil-food-web': {
    key: 'ingham-soil-food-web',
    sourceTitle: 'Teaming with Microbes',
    sourceAuthor: 'Jeff Lowenfels & Wayne Lewis',
    civilizationOrigin: 'Soil Food Web Institute',
    wisdomQuote: 'The plant controls the soil biology via root exudates. It sends sugars down to call bacteria and fungi to its aid. Feed the soil, not the plant.',
    reflectionPrompt: 'When you add amendments to your bed, imagine billions of microbes waking up. What are they hungry for?',
  },

  'carver-regeneration': {
    key: 'carver-regeneration',
    sourceTitle: 'The Legacy of George Washington Carver',
    sourceAuthor: 'George Washington Carver',
    civilizationOrigin: 'Tuskegee Institute',
    wisdomQuote: 'Anything will give up its secrets if you love it enough. I have found that when I talk to the little flower or to the little peanut they will give up their secrets.',
    reflectionPrompt: 'What secret is your garden trying to tell you today? Sit with one plant and listen.',
  },

  'biological-priority': {
    key: 'biological-priority',
    sourceTitle: 'Soil Food Web Science',
    sourceAuthor: 'Dr. Elaine Ingham',
    civilizationOrigin: 'Modern Regenerative Science',
    wisdomQuote: 'Biology before chemistry. Microbes before minerals. The soil is not a machine—it is a living city. Would you fertilize a city?',
    reflectionPrompt: 'Before reaching for an amendment, ask: Is there life in my soil that can do this work for me?',
  },

  'cover-crop-law': {
    key: 'cover-crop-law',
    sourceTitle: 'Regenerative Agriculture Principles',
    sourceAuthor: 'Gabe Brown / Ray Archuleta',
    civilizationOrigin: 'Modern Regenerative',
    wisdomQuote: 'When soil is depleted, plant—do not fertilize. Cover crops heal; fertilizers mask. The land knows how to recover if you let it.',
    reflectionPrompt: 'Your soil is tired. Instead of feeding it like a patient, let it grow its own medicine.',
  },

  'nitrogen-fixer-priority': {
    key: 'nitrogen-fixer-priority',
    sourceTitle: 'Natural Farming Synthesis',
    sourceAuthor: 'Carver / Fukuoka',
    civilizationOrigin: 'Cross-Cultural Wisdom',
    wisdomQuote: 'Let the plants do the work of feeding themselves. The bean fixes nitrogen not for you, but for its neighbors.',
    reflectionPrompt: 'Where in your life can you let something natural do the work you have been forcing?',
  },

  'mineral-balance': {
    key: 'mineral-balance',
    sourceTitle: 'The Albrecht Papers',
    sourceAuthor: 'Dr. William Albrecht',
    civilizationOrigin: 'University of Missouri',
    wisdomQuote: 'The mineral content of the soil determines the mineral content of the plant. Health begins in the soil.',
    reflectionPrompt: 'What is missing from your foundation? Calcium, magnesium, or something deeper?',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BATCH 2: THE COSMIC & VIBRATIONAL
  // ─────────────────────────────────────────────────────────────────────────
  'steiner-organism': {
    key: 'steiner-organism',
    sourceTitle: 'Spiritual Foundations for the Renewal of Agriculture',
    sourceAuthor: 'Rudolf Steiner',
    civilizationOrigin: 'Biodynamics (Austria/Germany)',
    wisdomQuote: 'The farm is a living organism with organs and a soul. The compost pile is the stomach, digesting the cosmos. Align your sprays with the moon—ascending for leaves, descending for roots.',
    reflectionPrompt: 'If your farm has a soul, what is it trying to tell you during the full moon?',
  },

  'hermetic-vibration': {
    key: 'hermetic-vibration',
    sourceTitle: 'The Kybalion',
    sourceAuthor: 'Three Initiates',
    civilizationOrigin: 'Hermetic / Egyptian',
    wisdomQuote: 'Nothing rests; everything moves; everything vibrates. The difference between matter and spirit is the rate of vibration. Your crops resonate at specific frequencies—396Hz for roots, 528Hz for life.',
    reflectionPrompt: 'What frequency is your garden humming at today? Can you feel it?',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BATCH 3: THE ANCESTRAL & INDIGENOUS
  // ─────────────────────────────────────────────────────────────────────────
  'three-sisters': {
    key: 'three-sisters',
    sourceTitle: 'Braiding Sweetgrass',
    sourceAuthor: 'Robin Wall Kimmerer',
    civilizationOrigin: 'Haudenosaunee (Iroquois)',
    wisdomQuote: 'Corn is the Ladder—she stands tall so Bean can climb. Bean is the Giver—she fixes nitrogen for her sisters. Squash is the Shelter—her broad leaves shade the soil and keep the water. They are stronger together than alone.',
    reflectionPrompt: 'Who are your Three Sisters? Who in your community holds you up, gives you nutrients, and shelters your roots?',
  },

  'dogon-seed-lineage': {
    key: 'dogon-seed-lineage',
    sourceTitle: 'The Pale Fox',
    sourceAuthor: 'Marcel Griaule & Germaine Dieterlen',
    civilizationOrigin: 'Dogon (Mali, West Africa)',
    wisdomQuote: 'The seed holds the pattern of the universe. The Dogon say the star Sirius gave humanity the first seeds. When you save a seed, you save a star.',
    reflectionPrompt: 'What lineage does your seed carry? When you save it, you join an unbroken chain stretching back to the stars.',
  },

  'kemetic-flood': {
    key: 'kemetic-flood',
    sourceTitle: 'Egyptian Agricultural Wisdom',
    sourceAuthor: 'Kemet / Nile Valley',
    civilizationOrigin: 'Kemetic (Ancient Egypt)',
    wisdomQuote: 'The Nile flood brought the gift of black soil. The Egyptians called it Kemet—the black land. Your bed is your Nile. Sea minerals are the memory of that ancient flood.',
    reflectionPrompt: 'What ancient waters flow through your garden? How can you honor the flood that feeds you?',
  },

  'muscogee-mound': {
    key: 'muscogee-mound',
    sourceTitle: 'Creek/Muscogee Oral Tradition',
    sourceAuthor: 'Muscogee Nation',
    civilizationOrigin: 'Muscogee/Creek (Southeast US)',
    wisdomQuote: 'Build up, not down. The mound catches the blessing. The ancestors are below; the sun is above. Raise the bed to meet them both.',
    reflectionPrompt: 'When you raise your bed, you are building a small mountain. What will you grow on this sacred ground?',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BATCH 4: THE ECOLOGICAL & NATURAL
  // ─────────────────────────────────────────────────────────────────────────
  'fukuoka-do-nothing': {
    key: 'fukuoka-do-nothing',
    sourceTitle: 'The One-Straw Revolution',
    sourceAuthor: 'Masanobu Fukuoka',
    civilizationOrigin: 'Japanese Natural Farming',
    wisdomQuote: 'The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings. No plowing, no weeding, no chemicals. Let nature lead.',
    reflectionPrompt: 'What work are you doing that nature would do for free if you stepped back?',
  },

  'fukuoka-no-till': {
    key: 'fukuoka-no-till',
    sourceTitle: 'The One-Straw Revolution',
    sourceAuthor: 'Masanobu Fukuoka',
    civilizationOrigin: 'Japanese Natural Farming',
    wisdomQuote: 'To plow is to wound. To till is to kill. The soil is a living city with streets and homes. Broadforking aerates; tilling destroys. Consider occultation—tarping kills weeds without killing microbes.',
    reflectionPrompt: 'Before you disturb the soil, ask: Is there a gentler way? What would Fukuoka do?',
  },

  'permaculture-zones': {
    key: 'permaculture-zones',
    sourceTitle: 'Permaculture: A Designers Manual',
    sourceAuthor: 'Bill Mollison',
    civilizationOrigin: 'Australian Permaculture',
    wisdomQuote: 'Place the elements most used nearest to the center. Zone 1 is your kitchen garden—daily attention. Zone 5 is the wild—let it be. Design your farm like ripples from a stone.',
    reflectionPrompt: 'What in your life needs daily attention? What needs to be left wild?',
  },

  'least-resistance': {
    key: 'least-resistance',
    sourceTitle: 'Natural Farming Philosophy',
    sourceAuthor: 'Synthesized Wisdom',
    civilizationOrigin: 'Cross-Cultural',
    wisdomQuote: 'Nature does not force. It flows. Water finds the path of least resistance. Your garden asks: Where are you forcing, and where are you flowing?',
    reflectionPrompt: 'Where are you fighting your garden? How can you surrender to its wisdom?',
  },

  'knf-imu': {
    key: 'knf-imu',
    sourceTitle: 'Korean Natural Farming',
    sourceAuthor: 'Master Cho Han-Kyu',
    civilizationOrigin: 'Korean / JADAM',
    wisdomQuote: 'Cultivate Indigenous Microorganisms. The microbes of YOUR land are your best teachers. Go to the forest, collect the white mold under the leaves—this is your IMO.',
    reflectionPrompt: 'Have you met the indigenous microbes of your land? They have been waiting for you.',
  },
};

// ============================================================================
// WISDOM LOOKUP FUNCTION
// ============================================================================

/**
 * Get wisdom entry by key (called when user clicks ℹ️)
 */
export const getWisdomByKey = (wisdomKey: string): WisdomEntry | null => {
  return wisdomDatabase[wisdomKey] || null;
};

/**
 * Get all wisdom entries for a specific civilization
 */
export const getWisdomByCivilization = (civilization: string): WisdomEntry[] => {
  return Object.values(wisdomDatabase).filter(
    (entry) => entry.civilizationOrigin.toLowerCase().includes(civilization.toLowerCase())
  );
};

/**
 * Get a random reflection prompt for daily practice
 */
export const getDailyReflection = (): WisdomEntry => {
  const entries = Object.values(wisdomDatabase);
  return entries[Math.floor(Math.random() * entries.length)];
};
