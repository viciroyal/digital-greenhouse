/**
 * WISDOM PROTOCOLS
 * 
 * The Sacred Laws of Regenerative Agriculture
 * These are the foundational principles that guide all recommendations.
 */

export interface WisdomProtocol {
  id: string;
  name: string;
  source: string;
  rule: string;
  citation: string;
  category: 'root' | 'regeneration' | 'biology' | 'mineral' | 'frequency';
}

export interface AmendmentRecommendation {
  id: string;
  name: string;
  type: 'biological' | 'mineral' | 'cover-crop';
  description: string;
  zone?: number; // Solfeggio zone (396, 417, 528, etc.)
}

/**
 * THE CORE PROTOCOLS
 * 
 * These are the immutable laws that govern all recommendations.
 */
export const wisdomProtocols: WisdomProtocol[] = [
  {
    id: 'ingham-soil-food-web',
    name: 'The Law of the Soil Food Web',
    source: 'Ingham',
    rule: 'The plant controls the soil biology via root exudates.',
    citation: 'Feed the soil, not the plant.',
    category: 'root',
  },
  {
    id: 'carver-regeneration',
    name: 'The Carver Protocol',
    source: 'George Washington Carver',
    rule: 'Anything will give up its secrets if you love it enough.',
    citation: 'The soil is the great connector of lives.',
    category: 'regeneration',
  },
  {
    id: 'biological-priority',
    name: 'The Biological Priority',
    source: 'Soil Food Web Institute',
    rule: 'Biology before chemistry. Microbes before minerals.',
    citation: 'Life creates the conditions for more life.',
    category: 'biology',
  },
  {
    id: 'cover-crop-law',
    name: 'The Cover Crop Imperative',
    source: 'Regenerative Agriculture',
    rule: 'When soil is depleted, plant — do not fertilize.',
    citation: 'Cover crops heal; fertilizers mask.',
    category: 'regeneration',
  },
  {
    id: 'nitrogen-fixer-priority',
    name: 'The Nitrogen Fixer Law',
    source: 'Carver/Fukuoka',
    rule: 'Prioritize legumes and beans in Zone 3 (528Hz).',
    citation: 'Let the plants do the work of feeding themselves.',
    category: 'biology',
  },
];

/**
 * BIOLOGICAL AMENDMENTS
 * 
 * These are the ONLY amendments we recommend.
 * NEVER recommend synthetic fertilizers.
 */
export const biologicalAmendments: AmendmentRecommendation[] = [
  {
    id: 'worm-castings',
    name: 'Worm Castings',
    type: 'biological',
    description: 'The gold of the soil. Complete microbial inoculant.',
  },
  {
    id: 'compost-tea',
    name: 'Compost Tea',
    type: 'biological',
    description: 'Living biology in liquid form. Brew for 24-48 hours.',
  },
  {
    id: 'kelp-meal',
    name: 'Kelp Meal',
    type: 'biological',
    description: 'Full spectrum trace minerals from the ocean.',
  },
  {
    id: 'alfalfa-meal',
    name: 'Alfalfa Meal',
    type: 'biological',
    description: 'Natural nitrogen source. Triacontanol growth hormone.',
  },
  {
    id: 'fish-emulsion',
    name: 'Fish Emulsion',
    type: 'biological',
    description: 'Quick nitrogen boost. Foliar or soil drench.',
  },
];

/**
 * COVER CROPS BY ZONE
 * 
 * Prioritized by nitrogen-fixing ability and zone affinity.
 */
export const coverCropsByZone: AmendmentRecommendation[] = [
  // Zone 3 (528Hz) - Nitrogen Fixers (PRIORITY)
  {
    id: 'crimson-clover',
    name: 'Crimson Clover',
    type: 'cover-crop',
    description: 'Fast-growing nitrogen fixer. Beautiful blooms.',
    zone: 528,
  },
  {
    id: 'cowpeas',
    name: 'Cowpeas (Black-Eyed Peas)',
    type: 'cover-crop',
    description: 'Heat-loving nitrogen fixer. Southern heritage.',
    zone: 528,
  },
  {
    id: 'hairy-vetch',
    name: 'Hairy Vetch',
    type: 'cover-crop',
    description: 'Winter nitrogen fixer. Can fix 100+ lbs N/acre.',
    zone: 528,
  },
  {
    id: 'austrian-winter-peas',
    name: 'Austrian Winter Peas',
    type: 'cover-crop',
    description: 'Cold-hardy nitrogen fixer. Great for early spring.',
    zone: 528,
  },
  // Other zones
  {
    id: 'daikon-radish',
    name: 'Daikon Radish',
    type: 'cover-crop',
    description: 'Deep taproot breaks compaction. "Tillage radish."',
    zone: 396,
  },
  {
    id: 'buckwheat',
    name: 'Buckwheat',
    type: 'cover-crop',
    description: 'Fast biomass. Phosphorus scavenger. Pollinator magnet.',
    zone: 417,
  },
  {
    id: 'winter-rye',
    name: 'Winter Rye',
    type: 'cover-crop',
    description: 'Hardy carbon builder. Excellent weed suppression.',
    zone: 396,
  },
];

/**
 * Get wisdom citation for a specific action type
 */
export const getWisdomCitation = (actionType: 'root' | 'check' | 'plant' | 'reset'): string => {
  switch (actionType) {
    case 'root':
    case 'reset':
      return wisdomProtocols.find(p => p.id === 'ingham-soil-food-web')?.citation || '';
    case 'check':
      return wisdomProtocols.find(p => p.id === 'carver-regeneration')?.citation || '';
    case 'plant':
      return wisdomProtocols.find(p => p.id === 'nitrogen-fixer-priority')?.citation || '';
    default:
      return '';
  }
};

/**
 * Get appropriate recommendation for depleted soil
 * NEVER returns synthetic fertilizer. ALWAYS returns cover crop or biological.
 */
export const getDepletionRecommendation = (brixValue: number): {
  type: 'cover-crop' | 'biological';
  primary: AmendmentRecommendation;
  secondary: AmendmentRecommendation[];
  citation: string;
} => {
  // Low Brix = depleted soil = COVER CROP, not fertilizer
  if (brixValue < 8) {
    // Severely depleted - prioritize nitrogen fixers
    return {
      type: 'cover-crop',
      primary: coverCropsByZone.find(c => c.id === 'crimson-clover')!,
      secondary: coverCropsByZone.filter(c => c.zone === 528).slice(0, 3),
      citation: 'Cover crops heal; fertilizers mask.',
    };
  } else if (brixValue < 12) {
    // Moderately depleted - biological boost
    return {
      type: 'biological',
      primary: biologicalAmendments.find(a => a.id === 'compost-tea')!,
      secondary: [
        biologicalAmendments.find(a => a.id === 'worm-castings')!,
        biologicalAmendments.find(a => a.id === 'kelp-meal')!,
      ],
      citation: 'Feed the soil, not the plant.',
    };
  }
  
  // Optimal - maintain with biology
  return {
    type: 'biological',
    primary: biologicalAmendments.find(a => a.id === 'worm-castings')!,
    secondary: [],
    citation: 'The soil is the great connector of lives.',
  };
};

/**
 * FORBIDDEN AMENDMENTS
 * 
 * These are NEVER recommended under any circumstances.
 */
export const forbiddenAmendments = [
  'Synthetic NPK',
  'Miracle-Gro',
  'Ammonium Nitrate',
  'Urea (synthetic)',
  'Superphosphate',
  'Muriate of Potash',
  'Any "-cide" (pesticide, herbicide, fungicide)',
];
