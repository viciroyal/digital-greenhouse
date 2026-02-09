/**
 * CHROMATIC TONE MAPPING
 * Maps the 12-tone chromatic scale to frequencies, colors, and soil protocols
 * Each tone represents a musical note with corresponding agricultural function
 */

export interface ChromaticTone {
  note: string;
  semitone: number; // 0-11 (C=0, C#=1, etc.)
  frequencyHz: number;
  color: string; // HSL
  soilFocus: string;
  mineralBoost: string;
  masterMixModifier: string;
  elementalAffinity: string;
}

export const CHROMATIC_TONES: ChromaticTone[] = [
  {
    note: 'C',
    semitone: 0,
    frequencyHz: 396,
    color: 'hsl(0 70% 50%)',
    soilFocus: 'Root Anchoring',
    mineralBoost: 'Phosphorus (P)',
    masterMixModifier: 'Double Kelp',
    elementalAffinity: 'Earth',
  },
  {
    note: 'C#',
    semitone: 1,
    frequencyHz: 408,
    color: 'hsl(15 70% 50%)',
    soilFocus: 'Transition Zone',
    mineralBoost: 'Phosphorus/Carbon',
    masterMixModifier: 'Kelp + Humates',
    elementalAffinity: 'Earth/Water',
  },
  {
    note: 'D',
    semitone: 2,
    frequencyHz: 417,
    color: 'hsl(30 70% 50%)',
    soilFocus: 'Water Flow',
    mineralBoost: 'Hydrogen/Carbon (H/C)',
    masterMixModifier: 'High Humates',
    elementalAffinity: 'Water',
  },
  {
    note: 'D#',
    semitone: 3,
    frequencyHz: 456,
    color: 'hsl(45 70% 50%)',
    soilFocus: 'Carbon Bridge',
    mineralBoost: 'Carbon/Nitrogen',
    masterMixModifier: 'Humates + Alfalfa',
    elementalAffinity: 'Water/Fire',
  },
  {
    note: 'E',
    semitone: 4,
    frequencyHz: 528,
    color: 'hsl(51 80% 50%)',
    soilFocus: 'Solar Alchemy',
    mineralBoost: 'Nitrogen (N)',
    masterMixModifier: 'Alfalfa-Soybean Boost',
    elementalAffinity: 'Fire',
  },
  {
    note: 'F',
    semitone: 5,
    frequencyHz: 582,
    color: 'hsl(75 60% 45%)',
    soilFocus: 'Growth Bridge',
    mineralBoost: 'Nitrogen/Calcium',
    masterMixModifier: 'Alfalfa + Gypsum',
    elementalAffinity: 'Fire/Air',
  },
  {
    note: 'F#',
    semitone: 6,
    frequencyHz: 639,
    color: 'hsl(120 50% 45%)',
    soilFocus: 'Heart Integration',
    mineralBoost: 'Calcium (Ca)',
    masterMixModifier: 'High Calcium Reset',
    elementalAffinity: 'Air',
  },
  {
    note: 'G',
    semitone: 7,
    frequencyHz: 693,
    color: 'hsl(180 50% 45%)',
    soilFocus: 'Expression Bridge',
    mineralBoost: 'Calcium/Potassium',
    masterMixModifier: 'Gypsum + Harmony',
    elementalAffinity: 'Air/Ether',
  },
  {
    note: 'G#',
    semitone: 8,
    frequencyHz: 741,
    color: 'hsl(210 60% 50%)',
    soilFocus: 'Voice Expression',
    mineralBoost: 'Potassium (K)',
    masterMixModifier: 'Alfalfa Sugar Boost',
    elementalAffinity: 'Ether',
  },
  {
    note: 'A',
    semitone: 9,
    frequencyHz: 798,
    color: 'hsl(240 50% 50%)',
    soilFocus: 'Vision Bridge',
    mineralBoost: 'Potassium/Silica',
    masterMixModifier: 'Harmony + Sea Minerals',
    elementalAffinity: 'Ether/Light',
  },
  {
    note: 'A#',
    semitone: 10,
    frequencyHz: 852,
    color: 'hsl(270 50% 50%)',
    soilFocus: 'Third Eye Vision',
    mineralBoost: 'Silica (Si)',
    masterMixModifier: 'Master Mix Complexity',
    elementalAffinity: 'Light',
  },
  {
    note: 'B',
    semitone: 11,
    frequencyHz: 963,
    color: 'hsl(300 50% 50%)',
    soilFocus: 'Crown Shield',
    mineralBoost: 'Sulfur (S)',
    masterMixModifier: 'Calcium Rot Prevention',
    elementalAffinity: 'Spirit',
  },
];

/**
 * Maps the 7-frequency system to the nearest chromatic tone
 */
export const frequencyToTone = (hz: number): ChromaticTone => {
  // Find the closest matching tone
  const closest = CHROMATIC_TONES.reduce((prev, curr) => {
    return Math.abs(curr.frequencyHz - hz) < Math.abs(prev.frequencyHz - hz) ? curr : prev;
  });
  return closest;
};

/**
 * Get beds playing a specific tone
 */
export const getBedsForTone = (
  beds: { id: string; bed_number: number; frequency_hz: number }[],
  tone: ChromaticTone
): { id: string; bed_number: number }[] => {
  return beds.filter(bed => {
    const bedTone = frequencyToTone(bed.frequency_hz);
    return bedTone.note === tone.note;
  });
};

/**
 * Chord interval mapping for harmonic card
 */
export interface ChordVoicing {
  interval: string;
  role: string;
  semitoneOffset: number;
  description: string;
}

export const CHORD_VOICINGS: ChordVoicing[] = [
  { interval: 'Root', role: 'The Anchor', semitoneOffset: 0, description: 'Lead harvest crop' },
  { interval: '3rd', role: 'The Color', semitoneOffset: 4, description: 'Pest sentinel & miner' },
  { interval: '5th', role: 'The Stabilizer', semitoneOffset: 7, description: 'Nitrogen fixer' },
  { interval: '7th', role: 'The Signal', semitoneOffset: 11, description: 'Pollinator attractor' },
  { interval: '11th', role: 'The Network', semitoneOffset: 17, description: 'Fungal connection' },
  { interval: '13th', role: 'The Aerial', semitoneOffset: 21, description: 'Climate modulator' },
];

/**
 * Get the chromatic tone for a given interval from a root
 */
export const getIntervalTone = (rootTone: ChromaticTone, semitoneOffset: number): ChromaticTone => {
  const targetSemitone = (rootTone.semitone + semitoneOffset) % 12;
  return CHROMATIC_TONES[targetSemitone];
};

/**
 * 5-Quart Master Mix base recipe with tone-specific modifiers
 */
export interface MasterMixIngredient {
  name: string;
  baseQuantity: number; // quarts for 150 sq ft
  unit: string;
  toneMultipliers: Record<string, number>; // note -> multiplier
}

export const MASTER_MIX_RECIPE: MasterMixIngredient[] = [
  {
    name: 'Pro-Mix BX',
    baseQuantity: 5,
    unit: 'quarts',
    toneMultipliers: { C: 1, 'C#': 1, D: 1, 'D#': 1, E: 1, F: 1, 'F#': 1, G: 1, 'G#': 1, A: 1, 'A#': 1, B: 1 },
  },
  {
    name: 'Kelp Meal',
    baseQuantity: 0.5,
    unit: 'quarts',
    toneMultipliers: { C: 2, 'C#': 1.5, D: 1, 'D#': 1, E: 1, F: 1, 'F#': 1, G: 1, 'G#': 1, A: 1, 'A#': 1, B: 1 },
  },
  {
    name: 'Humates',
    baseQuantity: 0.5,
    unit: 'quarts',
    toneMultipliers: { C: 1, 'C#': 1.5, D: 2, 'D#': 1.5, E: 1, F: 1, 'F#': 1, G: 1, 'G#': 1, A: 1, 'A#': 1, B: 1 },
  },
  {
    name: 'Alfalfa Meal',
    baseQuantity: 0.5,
    unit: 'quarts',
    toneMultipliers: { C: 1, 'C#': 1, D: 1, 'D#': 1.5, E: 2, F: 1.5, 'F#': 1, G: 1, 'G#': 1.5, A: 1, 'A#': 1, B: 1 },
  },
  {
    name: 'Soybean Meal',
    baseQuantity: 0.25,
    unit: 'quarts',
    toneMultipliers: { C: 1, 'C#': 1, D: 1, 'D#': 1, E: 2, F: 1, 'F#': 1, G: 1, 'G#': 1, A: 1, 'A#': 1, B: 1 },
  },
  {
    name: 'Gypsum',
    baseQuantity: 0.5,
    unit: 'quarts',
    toneMultipliers: { C: 1, 'C#': 1, D: 1, 'D#': 1, E: 1, F: 1.5, 'F#': 2, G: 1.5, 'G#': 1, A: 1, 'A#': 1, B: 1.5 },
  },
  {
    name: 'Sea Minerals',
    baseQuantity: 0.25,
    unit: 'quarts',
    toneMultipliers: { C: 1, 'C#': 1, D: 1, 'D#': 1, E: 1, F: 1, 'F#': 1, G: 1, 'G#': 1, A: 1.5, 'A#': 2, B: 1 },
  },
  {
    name: 'Worm Castings',
    baseQuantity: 0.5,
    unit: 'quarts',
    toneMultipliers: { C: 1, 'C#': 1, D: 1, 'D#': 1, E: 1, F: 1, 'F#': 1, G: 1, 'G#': 1, A: 1, 'A#': 1, B: 1 },
  },
];

/**
 * Get the modified Master Mix recipe for a specific tone
 */
export const getToneMasterMix = (tone: ChromaticTone): { name: string; quantity: number; unit: string }[] => {
  return MASTER_MIX_RECIPE.map(ingredient => ({
    name: ingredient.name,
    quantity: ingredient.baseQuantity * (ingredient.toneMultipliers[tone.note] || 1),
    unit: ingredient.unit,
  }));
};
