/**
 * CHORD-PAIR DATABASE
 * Unified 12-Tone Chromatic mapping with Instrument Groups
 * Each Tone is a 'Master Entry' consolidating soil, plants, and frequency
 */

export interface InstrumentGroup {
  name: string;
  crops: string[];
  nutrientFocus: string;
  masterMixBoosts: string[];
}

export interface ChromaticTone {
  note: string;
  semitone: number;
  frequencyHz: number;
  color: string;
  soilFocus: string;
  mineralBoost: string;
  masterMixModifier: string;
  elementalAffinity: string;
  instrumentGroup: InstrumentGroup;
  pairedPlants: {
    root: string;
    third: string;
    fifth: string;
    seventh: string;
    eleventh: string;
    thirteenth: string;
  };
  frequencySignal: {
    waveform: 'sine' | 'square' | 'triangle' | 'sawtooth';
    resonance: string;
    chakra: string;
  };
}

// Instrument Group definitions
const INSTRUMENT_GROUPS: Record<string, InstrumentGroup> = {
  nightshades: {
    name: 'Nightshades',
    crops: ['Tomato', 'Pepper', 'Eggplant', 'Potato'],
    nutrientFocus: 'Calcium & Phosphorus',
    masterMixBoosts: ['Gypsum', 'Kelp Meal'],
  },
  alliums: {
    name: 'Alliums',
    crops: ['Garlic', 'Onion', 'Leek', 'Shallot'],
    nutrientFocus: 'Sulfur & Potassium',
    masterMixBoosts: ['Sea Minerals', 'Humates'],
  },
  brassicas: {
    name: 'Brassicas',
    crops: ['Cabbage', 'Broccoli', 'Kale', 'Cauliflower'],
    nutrientFocus: 'Nitrogen & Calcium',
    masterMixBoosts: ['Alfalfa Meal', 'Gypsum'],
  },
  cucurbits: {
    name: 'Cucurbits',
    crops: ['Squash', 'Cucumber', 'Melon', 'Zucchini'],
    nutrientFocus: 'Potassium & Nitrogen',
    masterMixBoosts: ['Alfalfa Meal', 'Harmony'],
  },
  legumes: {
    name: 'Legumes',
    crops: ['Bean', 'Pea', 'Lentil', 'Cowpea'],
    nutrientFocus: 'Phosphorus & Molybdenum',
    masterMixBoosts: ['Kelp Meal', 'Soybean Meal'],
  },
  grains: {
    name: 'Grains',
    crops: ['Corn', 'Wheat', 'Oat', 'Sorghum'],
    nutrientFocus: 'Nitrogen & Silica',
    masterMixBoosts: ['Alfalfa Meal', 'Sea Minerals'],
  },
  roots: {
    name: 'Root Vegetables',
    crops: ['Carrot', 'Beet', 'Radish', 'Turnip'],
    nutrientFocus: 'Phosphorus & Boron',
    masterMixBoosts: ['Kelp Meal', 'Humates'],
  },
  leafy: {
    name: 'Leafy Greens',
    crops: ['Lettuce', 'Spinach', 'Chard', 'Arugula'],
    nutrientFocus: 'Nitrogen & Iron',
    masterMixBoosts: ['Alfalfa Meal', 'Worm Castings'],
  },
  herbs: {
    name: 'Herbs',
    crops: ['Basil', 'Cilantro', 'Parsley', 'Dill'],
    nutrientFocus: 'Potassium & Magnesium',
    masterMixBoosts: ['Harmony', 'Sea Minerals'],
  },
  fruiting: {
    name: 'Fruiting Shrubs',
    crops: ['Strawberry', 'Blueberry', 'Raspberry', 'Blackberry'],
    nutrientFocus: 'Calcium & Sulfur',
    masterMixBoosts: ['Gypsum', 'Sea Minerals'],
  },
  perennials: {
    name: 'Perennials',
    crops: ['Asparagus', 'Rhubarb', 'Artichoke', 'Horseradish'],
    nutrientFocus: 'Phosphorus & Potassium',
    masterMixBoosts: ['Kelp Meal', 'Harmony'],
  },
  fungal: {
    name: 'Fungal Network',
    crops: ['Reishi', 'Wine Cap', 'Oyster', 'Lions Mane'],
    nutrientFocus: 'Carbon & Humidity',
    masterMixBoosts: ['Humates', 'Worm Castings'],
  },
};

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
    instrumentGroup: INSTRUMENT_GROUPS.nightshades,
    pairedPlants: {
      root: 'Cherokee Purple Tomato',
      third: 'Basil (Genovese)',
      fifth: 'Bush Bean',
      seventh: 'Marigold',
      eleventh: 'Wine Cap Mushroom',
      thirteenth: 'Sunflower',
    },
    frequencySignal: { waveform: 'sine', resonance: 'Grounding', chakra: 'Root' },
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
    instrumentGroup: INSTRUMENT_GROUPS.roots,
    pairedPlants: {
      root: 'Dragon Carrot',
      third: 'Parsley',
      fifth: 'Radish',
      seventh: 'Chamomile',
      eleventh: 'Mycorrhizae',
      thirteenth: 'Dill',
    },
    frequencySignal: { waveform: 'triangle', resonance: 'Transition', chakra: 'Root/Sacral' },
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
    instrumentGroup: INSTRUMENT_GROUPS.cucurbits,
    pairedPlants: {
      root: 'Butternut Squash',
      third: 'Nasturtium',
      fifth: 'Corn',
      seventh: 'Borage',
      eleventh: 'Oyster Mushroom',
      thirteenth: 'Amaranth',
    },
    frequencySignal: { waveform: 'sine', resonance: 'Flowing', chakra: 'Sacral' },
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
    instrumentGroup: INSTRUMENT_GROUPS.legumes,
    pairedPlants: {
      root: 'Black-Eyed Pea',
      third: 'Carrot',
      fifth: 'Beet',
      seventh: 'Cosmos',
      eleventh: 'Rhizobium',
      thirteenth: 'Fennel',
    },
    frequencySignal: { waveform: 'triangle', resonance: 'Building', chakra: 'Sacral/Solar' },
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
    instrumentGroup: INSTRUMENT_GROUPS.grains,
    pairedPlants: {
      root: 'Glass Gem Corn',
      third: 'Pole Bean',
      fifth: 'Winter Squash',
      seventh: 'Zinnia',
      eleventh: 'Wine Cap',
      thirteenth: 'Golden Fennel',
    },
    frequencySignal: { waveform: 'sine', resonance: 'Transformation', chakra: 'Solar Plexus' },
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
    instrumentGroup: INSTRUMENT_GROUPS.brassicas,
    pairedPlants: {
      root: 'Lacinato Kale',
      third: 'Nasturtium',
      fifth: 'Onion',
      seventh: 'Yarrow',
      eleventh: 'Turkey Tail',
      thirteenth: 'Calendula',
    },
    frequencySignal: { waveform: 'square', resonance: 'Expansion', chakra: 'Solar/Heart' },
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
    instrumentGroup: INSTRUMENT_GROUPS.leafy,
    pairedPlants: {
      root: 'Red Romaine',
      third: 'Spinach',
      fifth: 'Chard',
      seventh: 'Sweet Alyssum',
      eleventh: 'Oyster Mushroom',
      thirteenth: 'Mammoth Dill',
    },
    frequencySignal: { waveform: 'sine', resonance: 'Harmony', chakra: 'Heart' },
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
    instrumentGroup: INSTRUMENT_GROUPS.herbs,
    pairedPlants: {
      root: 'Holy Basil',
      third: 'Cilantro',
      fifth: 'Chives',
      seventh: 'Lavender',
      eleventh: 'Lions Mane',
      thirteenth: 'Verbena',
    },
    frequencySignal: { waveform: 'triangle', resonance: 'Communication', chakra: 'Heart/Throat' },
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
    instrumentGroup: INSTRUMENT_GROUPS.alliums,
    pairedPlants: {
      root: 'Music Garlic',
      third: 'Leek',
      fifth: 'Shallot',
      seventh: "Bachelor's Button",
      eleventh: 'Turkey Tail',
      thirteenth: 'Blue Vervain',
    },
    frequencySignal: { waveform: 'sawtooth', resonance: 'Expression', chakra: 'Throat' },
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
    instrumentGroup: INSTRUMENT_GROUPS.fruiting,
    pairedPlants: {
      root: 'Alpine Strawberry',
      third: 'Borage',
      fifth: 'Thyme',
      seventh: 'Echinacea',
      eleventh: 'Reishi',
      thirteenth: 'Elderflower',
    },
    frequencySignal: { waveform: 'sine', resonance: 'Perception', chakra: 'Throat/Third Eye' },
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
    instrumentGroup: INSTRUMENT_GROUPS.perennials,
    pairedPlants: {
      root: 'Purple Asparagus',
      third: 'Rhubarb',
      fifth: 'Artichoke',
      seventh: 'Purple Coneflower',
      eleventh: 'Purple Woodear',
      thirteenth: 'Verbena Bonariensis',
    },
    frequencySignal: { waveform: 'triangle', resonance: 'Intuition', chakra: 'Third Eye' },
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
    instrumentGroup: INSTRUMENT_GROUPS.fungal,
    pairedPlants: {
      root: 'Reishi (Sacred Log)',
      third: 'Lions Mane',
      fifth: 'Turkey Tail',
      seventh: 'White Moonflower',
      eleventh: 'Ghost Fungus',
      thirteenth: 'White Sage',
    },
    frequencySignal: { waveform: 'sine', resonance: 'Connection', chakra: 'Crown' },
  },
];

/**
 * Maps the 7-frequency system to the nearest chromatic tone
 */
export const frequencyToTone = (hz: number): ChromaticTone => {
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
): { id: string; bed_number: number; frequency_hz: number }[] => {
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
 * 5-Quart Master Mix with tone-specific and instrument-specific modifiers
 */
export interface MasterMixIngredient {
  name: string;
  baseQuantity: number;
  unit: string;
  toneMultipliers: Record<string, number>;
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
    toneMultipliers: { C: 1, 'C#': 1.5, D: 2, 'D#': 1.5, E: 1, F: 1, 'F#': 1, G: 1, 'G#': 1, A: 1, 'A#': 1, B: 1.5 },
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
    toneMultipliers: { C: 1, 'C#': 1, D: 1, 'D#': 1.5, E: 2, F: 1, 'F#': 1, G: 1, 'G#': 1, A: 1, 'A#': 1, B: 1 },
  },
  {
    name: 'Gypsum',
    baseQuantity: 0.5,
    unit: 'quarts',
    toneMultipliers: { C: 1.5, 'C#': 1, D: 1, 'D#': 1, E: 1, F: 1.5, 'F#': 2, G: 1.5, 'G#': 1, A: 1, 'A#': 1, B: 1.5 },
  },
  {
    name: 'Sea Minerals',
    baseQuantity: 0.25,
    unit: 'quarts',
    toneMultipliers: { C: 1, 'C#': 1, D: 1, 'D#': 1, E: 1, F: 1, 'F#': 1, G: 1, 'G#': 1.5, A: 1.5, 'A#': 2, B: 1 },
  },
  {
    name: 'Worm Castings',
    baseQuantity: 0.5,
    unit: 'quarts',
    toneMultipliers: { C: 1, 'C#': 1, D: 1, 'D#': 1, E: 1, F: 1, 'F#': 1.5, G: 1, 'G#': 1, A: 1, 'A#': 1, B: 1.5 },
  },
  {
    name: 'Harmony',
    baseQuantity: 0.25,
    unit: 'quarts',
    toneMultipliers: { C: 1, 'C#': 1, D: 1.5, 'D#': 1, E: 1, F: 1, 'F#': 1, G: 1.5, 'G#': 1, A: 1.5, 'A#': 1, B: 1 },
  },
];

/**
 * Get the modified Master Mix recipe for a specific tone
 */
export const getToneMasterMix = (tone: ChromaticTone): { name: string; quantity: number; unit: string; boosted: boolean }[] => {
  return MASTER_MIX_RECIPE.map(ingredient => {
    const multiplier = ingredient.toneMultipliers[tone.note] || 1;
    // Additional boost if ingredient matches the instrument group's boosts
    const instrumentBoost = tone.instrumentGroup.masterMixBoosts.includes(ingredient.name) ? 1.25 : 1;
    const finalMultiplier = multiplier * instrumentBoost;
    
    return {
      name: ingredient.name,
      quantity: Math.round(ingredient.baseQuantity * finalMultiplier * 100) / 100,
      unit: ingredient.unit,
      boosted: finalMultiplier > 1,
    };
  });
};

/**
 * Calculate harmonic completion percentage based on Brix
 */
export const getHarmonicCompletion = (brix: number): number => {
  return Math.min(100, Math.max(0, ((brix - 12) / 12) * 100));
};
