/**
 * CROP INSTRUMENT MAPPING
 * Maps crop categories to their musical instrument archetype and role in the garden "song"
 * Each crop category plays a specific role in the polyculture ensemble
 */

export type InstrumentType = 
  | 'Electric Guitar'
  | 'Percussion/Drums'
  | 'Horn Section'
  | 'Bass/Sub-Frequency'
  | 'Synthesizers/Keys';

export interface CropInstrumentRole {
  category: string;
  crops: string[];
  instrument: InstrumentType;
  role: string;
  description: string;
  icon: string; // Emoji representation
  color: string; // HSL color for UI
  frequencyAffinity: number[]; // Which Hz zones this category thrives in
}

export const CROP_INSTRUMENT_MAPPING: CropInstrumentRole[] = [
  {
    category: 'Nightshades',
    crops: ['Tomato', 'Eggplant', 'Pepper', 'Potato', 'Tomatillo'],
    instrument: 'Electric Guitar',
    role: 'Melodic Lead',
    description: 'Sustained, melodic, needs high "Voltage" (Calcium).',
    icon: '🎸',
    color: 'hsl(0 70% 55%)',
    frequencyAffinity: [396, 528], // Root & Solar zones
  },
  {
    category: 'Grains/Corn',
    crops: ['Corn', 'Wheat', 'Oats', 'Millet', 'Sorghum', 'Amaranth'],
    instrument: 'Percussion/Drums',
    role: 'Rhythmic Foundation',
    description: 'High vertical rhythm, sets the tempo for the bed.',
    icon: '🥁',
    color: 'hsl(45 80% 55%)',
    frequencyAffinity: [528, 639], // Solar & Heart zones
  },
  {
    category: 'Brassicas',
    crops: ['Kale', 'Broccoli', 'Cabbage', 'Collards', 'Cauliflower', 'Brussels Sprouts', 'Kohlrabi'],
    instrument: 'Horn Section',
    role: 'Structural Blast',
    description: 'Bold, structural, provides the "Blast" of chlorophyll.',
    icon: '🎺',
    color: 'hsl(120 50% 45%)',
    frequencyAffinity: [639, 741], // Heart & Voice zones
  },
  {
    category: 'Alliums',
    crops: ['Garlic', 'Onion', 'Leek', 'Shallot', 'Chives', 'Scallion'],
    instrument: 'Bass/Sub-Frequency',
    role: 'Grounding Shield',
    description: 'Grounding, defensive, stays low and provides the "Shield."',
    icon: '🎸', // Bass guitar
    color: 'hsl(270 50% 50%)',
    frequencyAffinity: [396, 963], // Root & Shield zones
  },
  {
    category: 'Herbs/Flowers',
    crops: ['Basil', 'Cilantro', 'Dill', 'Fennel', 'Marigold', 'Sunflower', 'Calendula', 'Lavender', 'Chamomile'],
    instrument: 'Synthesizers/Keys',
    role: 'Atmospheric Fill',
    description: 'Fills the gaps with "Atmosphere" (Scent/Signal).',
    icon: '🎹',
    color: 'hsl(300 60% 60%)',
    frequencyAffinity: [741, 852], // Voice & Vision zones
  },
];

/**
 * Get instrument role for a specific crop name
 */
export const getInstrumentForCrop = (cropName: string): CropInstrumentRole | undefined => {
  const cropLower = cropName.toLowerCase();
  return CROP_INSTRUMENT_MAPPING.find(mapping => 
    mapping.crops.some(crop => cropLower.includes(crop.toLowerCase()))
  );
};

/**
 * Get instrument role for a crop category
 */
export const getInstrumentForCategory = (category: string): CropInstrumentRole | undefined => {
  const categoryLower = category.toLowerCase();
  return CROP_INSTRUMENT_MAPPING.find(mapping => 
    mapping.category.toLowerCase().includes(categoryLower) ||
    categoryLower.includes(mapping.category.toLowerCase())
  );
};

/**
 * Check if a crop is in tune with a specific frequency zone
 */
export const isCropInTuneWithZone = (cropName: string, frequencyHz: number): boolean => {
  const instrument = getInstrumentForCrop(cropName);
  if (!instrument) return true; // Unknown crops are considered neutral
  return instrument.frequencyAffinity.includes(frequencyHz);
};

/**
 * Get all crops that resonate best with a frequency zone
 */
export const getCropsForFrequency = (frequencyHz: number): CropInstrumentRole[] => {
  return CROP_INSTRUMENT_MAPPING.filter(mapping => 
    mapping.frequencyAffinity.includes(frequencyHz)
  );
};

/**
 * ENSEMBLE COMPOSITION RULES
 * A complete "band" in a bed should have:
 * - 1 Lead (Electric Guitar/Nightshade OR Percussion/Grain)
 * - 1 Structure (Horn Section/Brassica)
 * - 1 Defense (Bass/Allium)
 * - 1 Signal (Synthesizer/Herbs)
 */
export interface EnsembleStatus {
  hasLead: boolean;
  hasStructure: boolean;
  hasDefense: boolean;
  hasSignal: boolean;
  isCompleteEnsemble: boolean;
  missingRoles: string[];
}

export const checkEnsembleComposition = (cropNames: string[]): EnsembleStatus => {
  const instruments = cropNames.map(getInstrumentForCrop).filter(Boolean) as CropInstrumentRole[];
  
  const hasLead = instruments.some(i => 
    i.instrument === 'Electric Guitar' || i.instrument === 'Percussion/Drums'
  );
  const hasStructure = instruments.some(i => i.instrument === 'Horn Section');
  const hasDefense = instruments.some(i => i.instrument === 'Bass/Sub-Frequency');
  const hasSignal = instruments.some(i => i.instrument === 'Synthesizers/Keys');
  
  const missingRoles: string[] = [];
  if (!hasLead) missingRoles.push('Lead (Nightshade or Grain)');
  if (!hasStructure) missingRoles.push('Structure (Brassica)');
  if (!hasDefense) missingRoles.push('Defense (Allium)');
  if (!hasSignal) missingRoles.push('Signal (Herbs/Flowers)');
  
  return {
    hasLead,
    hasStructure,
    hasDefense,
    hasSignal,
    isCompleteEnsemble: hasLead && hasStructure && hasDefense && hasSignal,
    missingRoles,
  };
};
