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
  category: 'root' | 'regeneration' | 'biology' | 'mineral' | 'frequency' | 'cosmic' | 'ancestral' | 'ecological';
}

export interface AmendmentRecommendation {
  id: string;
  name: string;
  type: 'biological' | 'mineral' | 'cover-crop' | 'biodynamic' | 'polyculture';
  description: string;
  zone?: number; // Solfeggio zone (396, 417, 528, etc.)
  moonPhase?: 'ascending' | 'descending' | 'full' | 'new';
}

/**
 * SEED LINEAGE INTERFACE
 * 
 * The Dogon Star Link: "The seed holds the pattern of the universe."
 * Track the sacred lineage of every seed.
 */
export interface SeedLineage {
  id: string;
  cropName: string;
  variety: string;
  sourceLineage: string; // Where did this seed come from?
  generationsGrown: number;
  isSaved: boolean; // Has this seed been saved (not purchased)?
  notes?: string;
}

/**
 * THE 7-ZONE OCTAVE
 * 
 * The Hermetic Law: "Nothing rests; everything moves; everything vibrates."
 * All crops are organized by their resonant frequency.
 */
export const solfeggioOctave = [
  { hz: 396, name: 'Root Pulse', element: 'Earth', color: 'hsl(0 60% 50%)', zone: 1 },
  { hz: 417, name: 'Stone Hum', element: 'Fire', color: 'hsl(30 60% 50%)', zone: 2 },
  { hz: 528, name: 'The Songline', element: 'Air', color: 'hsl(120 50% 45%)', zone: 3 },
  { hz: 639, name: 'Gold Flow', element: 'Water', color: 'hsl(51 80% 50%)', zone: 4 },
  { hz: 741, name: 'Voice Gate', element: 'Ether', color: 'hsl(180 50% 45%)', zone: 5 },
  { hz: 852, name: 'Third Eye', element: 'Light', color: 'hsl(270 50% 50%)', zone: 6 },
  { hz: 963, name: 'Source Code', element: 'Spirit', color: 'hsl(300 50% 50%)', zone: 7 },
] as const;

/**
 * THE CORE PROTOCOLS
 * 
 * These are the immutable laws that govern all recommendations.
 */
export const wisdomProtocols: WisdomProtocol[] = [
  // BATCH 1: The Microscopic Foundation
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
  
  // BATCH 2: The Cosmic & Vibrational
  {
    id: 'steiner-organism',
    name: 'The Steiner Principle',
    source: 'Rudolf Steiner (Biodynamics)',
    rule: 'The farm is a living organism with organs and a soul.',
    citation: 'The compost pile is the stomach of the farm.',
    category: 'cosmic',
  },
  {
    id: 'steiner-lunar',
    name: 'The Lunar Alignment',
    source: 'Rudolf Steiner (Biodynamics)',
    rule: 'Align foliar sprays with the Moon Phase — Silica in ascending, Horn in descending.',
    citation: 'The cosmos breathes through the soil.',
    category: 'cosmic',
  },
  {
    id: 'hermetic-vibration',
    name: 'The Hermetic Law of Vibration',
    source: 'The Kybalion',
    rule: 'Nothing rests; everything moves; everything vibrates.',
    citation: 'Every crop has its frequency. Tune the soil to the song.',
    category: 'frequency',
  },
  {
    id: 'hermetic-correspondence',
    name: 'The Hermetic Law of Correspondence',
    source: 'The Kybalion',
    rule: 'As above, so below; as below, so above.',
    citation: 'The stars guide the roots. The roots mirror the stars.',
    category: 'cosmic',
  },
  
  // BATCH 3: The Ancestral & Indigenous
  {
    id: 'three-sisters',
    name: 'The Three Sisters Protocol',
    source: 'Turtle Island (Haudenosaunee)',
    rule: 'Corn is the Ladder, Bean is the Giver, Squash is the Shelter.',
    citation: 'Plant in community. Monoculture is isolation.',
    category: 'ancestral',
  },
  {
    id: 'polyculture-priority',
    name: 'The Polyculture Imperative',
    source: 'Indigenous Agriculture',
    rule: 'In Zone 3 (528Hz), always suggest Polyculture over Monoculture.',
    citation: 'Diversity is resilience. Monoculture is vulnerability.',
    category: 'ancestral',
  },
  {
    id: 'dogon-seed-lineage',
    name: 'The Dogon Star Link',
    source: 'Dogon Cosmology (Sirius)',
    rule: 'The seed holds the pattern of the universe.',
    citation: 'Save the seed, save the stars.',
    category: 'ancestral',
  },
  {
    id: 'kemetic-nile',
    name: 'The Kemetic Flood Principle',
    source: 'Egyptian/Kemetic Agriculture',
    rule: 'The river brings the gift. Receive it with gratitude.',
    citation: 'What the water gives, the soil remembers.',
    category: 'ancestral',
  },
  {
    id: 'muscogee-mounds',
    name: 'The Muscogee Mound Builder',
    source: 'Muscogee/Creek Wisdom',
    rule: 'Build up, not down. The mound catches the blessing.',
    citation: 'Raise the bed. Honor the ancestors below.',
    category: 'ancestral',
  },
  
  // BATCH 4: The Ecological & Natural
  {
    id: 'fukuoka-do-nothing',
    name: 'The Fukuoka Method',
    source: 'Masanobu Fukuoka (One Straw Revolution)',
    rule: 'No plowing, no weeding, no chemicals.',
    citation: 'The ultimate goal is not to cultivate, but to allow.',
    category: 'ecological',
  },
  {
    id: 'fukuoka-no-till',
    name: 'The No-Till Imperative',
    source: 'Masanobu Fukuoka',
    rule: 'To plow is to wound. To till is to kill.',
    citation: 'Wait. Consider Occultation or Broadforking.',
    category: 'ecological',
  },
  {
    id: 'permaculture-zones',
    name: 'The Permaculture Zone System',
    source: 'Bill Mollison / David Holmgren',
    rule: 'Place the elements most used nearest to the center.',
    citation: 'Zone 1 is daily. Zone 5 is wild.',
    category: 'ecological',
  },
  {
    id: 'knf-imu',
    name: 'The JADAM/KNF Principle',
    source: 'Korean Natural Farming',
    rule: 'Cultivate Indigenous Microorganisms. The soil knows.',
    citation: 'The microbes of your land are your best teachers.',
    category: 'ecological',
  },
  {
    id: 'least-resistance',
    name: 'The Path of Least Resistance',
    source: 'Natural Farming Philosophy',
    rule: 'Nature does not force. It flows.',
    citation: 'Work with the land, not against it.',
    category: 'ecological',
  },
];

/**
 * BIODYNAMIC PREPARATIONS
 * 
 * Aligned with moon phases per Steiner Protocol.
 */
export const biodynamicPreparations: AmendmentRecommendation[] = [
  {
    id: 'bd-500',
    name: 'Horn Manure (BD 500)',
    type: 'biodynamic',
    description: 'Spray in evening. Stimulates root growth and soil biology.',
    moonPhase: 'descending',
  },
  {
    id: 'bd-501',
    name: 'Horn Silica (BD 501)',
    type: 'biodynamic',
    description: 'Spray at dawn. Enhances photosynthesis and light reception.',
    moonPhase: 'ascending',
  },
  {
    id: 'bd-502',
    name: 'Yarrow Preparation (BD 502)',
    type: 'biodynamic',
    description: 'For compost. Activates potassium and sulfur processes.',
    moonPhase: 'full',
  },
  {
    id: 'bd-503',
    name: 'Chamomile Preparation (BD 503)',
    type: 'biodynamic',
    description: 'For compost. Stabilizes nitrogen and calcium.',
    moonPhase: 'full',
  },
  {
    id: 'bd-507',
    name: 'Valerian Preparation (BD 507)',
    type: 'biodynamic',
    description: 'For compost. Protects from frost. Phosphorus activator.',
    moonPhase: 'full',
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
 * THE THREE SISTERS (Polyculture)
 * 
 * The Haudenosaunee Protocol: Corn, Bean, and Squash planted together.
 * Zone 3 (528Hz) - ALWAYS recommend polyculture over monoculture.
 */
export const threeSisters = {
  corn: {
    role: 'The Ladder',
    description: 'Provides structure for beans to climb.',
    zone: 528,
    emoji: '🌽',
  },
  bean: {
    role: 'The Giver',
    description: 'Fixes nitrogen for all three sisters.',
    zone: 528,
    emoji: '🫘',
  },
  squash: {
    role: 'The Shelter',
    description: 'Shades soil, retains moisture, deters pests.',
    zone: 528,
    emoji: '🎃',
  },
};

/**
 * SACRED SEED ZONES
 * 
 * Zone 7 (963Hz) is the Source Code - where seeds are saved.
 * Seed saving is a sacred act, not just a task.
 */
export const sacredSeedZone = {
  hz: 963,
  name: 'Source Code',
  protocol: 'dogon-seed-lineage',
  isSacred: true,
  citation: 'Save the seed, save the stars.',
};

/**
 * Get wisdom citation for a specific action type
 */
export const getWisdomCitation = (
  actionType: 'root' | 'check' | 'plant' | 'reset' | 'cosmic' | 'frequency' | 'polyculture' | 'seed' | 'notill' | 'natural'
): string => {
  switch (actionType) {
    case 'root':
    case 'reset':
      return wisdomProtocols.find(p => p.id === 'ingham-soil-food-web')?.citation || '';
    case 'check':
      return wisdomProtocols.find(p => p.id === 'carver-regeneration')?.citation || '';
    case 'plant':
      return wisdomProtocols.find(p => p.id === 'nitrogen-fixer-priority')?.citation || '';
    case 'cosmic':
      return wisdomProtocols.find(p => p.id === 'steiner-organism')?.citation || '';
    case 'frequency':
      return wisdomProtocols.find(p => p.id === 'hermetic-vibration')?.citation || '';
    case 'polyculture':
      return wisdomProtocols.find(p => p.id === 'three-sisters')?.citation || '';
    case 'seed':
      return wisdomProtocols.find(p => p.id === 'dogon-seed-lineage')?.citation || '';
    case 'notill':
      return wisdomProtocols.find(p => p.id === 'fukuoka-no-till')?.citation || '';
    case 'natural':
      return wisdomProtocols.find(p => p.id === 'fukuoka-do-nothing')?.citation || '';
    default:
      return '';
  }
};

/**
 * Get the Solfeggio zone info for a frequency
 */
export const getZoneInfo = (hz: number) => {
  return solfeggioOctave.find(z => z.hz === hz) || solfeggioOctave[0];
};

/**
 * Check if a zone should recommend polyculture (Three Sisters)
 */
export const shouldRecommendPolyculture = (hz: number): boolean => {
  // Zone 3 (528Hz) - Always recommend polyculture
  return hz === 528;
};

/**
 * Get Three Sisters recommendation for Zone 3
 */
export const getThreeSistersRecommendation = () => {
  return {
    protocol: threeSisters,
    citation: wisdomProtocols.find(p => p.id === 'three-sisters')?.citation || '',
    source: 'Turtle Island (Haudenosaunee)',
  };
};

/**
 * Check if this is a seed-saving zone (sacred)
 */
export const isSeedSavingZone = (hz: number): boolean => {
  return hz === 963;
};

/**
 * Get biodynamic spray recommendation based on moon phase
 */
export const getBiodynamicSpray = (phase: 'ascending' | 'descending' | 'full' | 'new'): {
  preparation: AmendmentRecommendation | undefined;
  citation: string;
} => {
  const prep = biodynamicPreparations.find(p => p.moonPhase === phase);
  return {
    preparation: prep,
    citation: wisdomProtocols.find(p => p.id === 'steiner-lunar')?.citation || '',
  };
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

/**
 * FORBIDDEN ACTIONS (Fukuoka Protocol)
 * 
 * Actions that trigger a STOP alert with alternatives.
 */
export interface ForbiddenAction {
  action: string;
  alternatives: string[];
  citation: string;
  source: string;
}

export const forbiddenActions: ForbiddenAction[] = [
  {
    action: 'tilling',
    alternatives: ['Occultation (tarping)', 'Broadforking', 'Sheet Mulching'],
    citation: 'Wait. Consider Occultation or Broadforking.',
    source: 'Masanobu Fukuoka',
  },
  {
    action: 'plowing',
    alternatives: ['No-till seeding', 'Chop and drop', 'Cover cropping'],
    citation: 'To plow is to wound. To till is to kill.',
    source: 'Masanobu Fukuoka',
  },
  {
    action: 'rototilling',
    alternatives: ['Broadforking', 'Deep mulching', 'Occultation'],
    citation: 'The soil is a living city. Would you rototill a city?',
    source: 'Elaine Ingham',
  },
  {
    action: 'weeding',
    alternatives: ['Chop and drop', 'Occultation', 'Living mulch'],
    citation: 'Weeds are the soil\'s attempt to heal itself.',
    source: 'Masanobu Fukuoka',
  },
];

/**
 * Check if an action is forbidden (Fukuoka Protocol)
 */
export const checkForbiddenAction = (actionText: string): ForbiddenAction | null => {
  const lowerAction = actionText.toLowerCase();
  return forbiddenActions.find(fa => 
    lowerAction.includes(fa.action)
  ) || null;
};

/**
 * PERMACULTURE ZONE PRIORITIZATION
 * 
 * Zone 1 (396Hz) = Daily attention
 * Zone 5 (741Hz+) = Weekly/seasonal attention
 */
export interface ZonePriority {
  hz: number;
  zone: number;
  frequency: 'daily' | 'weekly' | 'seasonal' | 'wild';
  alertPriority: number; // 1 = highest, 5 = lowest
}

export const zonePriorities: ZonePriority[] = [
  { hz: 396, zone: 1, frequency: 'daily', alertPriority: 1 },
  { hz: 417, zone: 2, frequency: 'daily', alertPriority: 2 },
  { hz: 528, zone: 3, frequency: 'weekly', alertPriority: 3 },
  { hz: 639, zone: 4, frequency: 'weekly', alertPriority: 4 },
  { hz: 741, zone: 5, frequency: 'seasonal', alertPriority: 5 },
  { hz: 852, zone: 6, frequency: 'seasonal', alertPriority: 6 },
  { hz: 963, zone: 7, frequency: 'wild', alertPriority: 7 },
];

/**
 * Get zone priority for task scheduling
 */
export const getZonePriority = (hz: number): ZonePriority => {
  return zonePriorities.find(z => z.hz === hz) || zonePriorities[0];
};

/**
 * Check if a zone needs daily attention
 */
export const isDailyZone = (hz: number): boolean => {
  const priority = getZonePriority(hz);
  return priority.frequency === 'daily';
};

/**
 * Get natural alternatives to conventional methods
 */
export const getNaturalAlternatives = () => {
  return {
    tillAlternatives: [
      { name: 'Occultation', description: 'Cover soil with tarp for 4-6 weeks. Kills weeds, preserves biology.' },
      { name: 'Broadforking', description: 'Gentle aeration without inversion. Preserves soil layers.' },
      { name: 'Sheet Mulching', description: 'Cardboard + compost + mulch. Builds soil while smothering weeds.' },
    ],
    weedAlternatives: [
      { name: 'Chop and Drop', description: 'Cut weeds at soil level. Leave as mulch. Free fertilizer.' },
      { name: 'Living Mulch', description: 'Plant clover between rows. Outcompetes weeds, fixes nitrogen.' },
      { name: 'Dense Planting', description: 'Close spacing shades out weeds. Intensive polyculture.' },
    ],
    fertilizerAlternatives: [
      { name: 'IMO (Indigenous Microorganisms)', description: 'Collect local microbes. JADAM/KNF method.' },
      { name: 'Compost Tea', description: 'Aerated compost extract. Living biology in liquid form.' },
      { name: 'Fermented Plant Juice', description: 'Lacto-fermented plant matter. Fast nutrient cycling.' },
    ],
  };
};
