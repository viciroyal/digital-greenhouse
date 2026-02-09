/**
 * JAZZ VOICING RECOMMENDATIONS
 * Zone-specific 11th (Fungal) and 13th (Aerial) crop recommendations
 * Each frequency zone has an optimal pairing that creates harmonic resonance
 */

export interface JazzVoicingRecommendation {
  frequencyHz: number;
  zoneName: string;
  zoneColor: string;
  eleventh: {
    name: string;
    description: string;
  };
  thirteenth: {
    name: string;
    description: string;
  };
  jazzRationale: string;
}

export const JAZZ_VOICING_RECOMMENDATIONS: JazzVoicingRecommendation[] = [
  {
    frequencyHz: 396,
    zoneName: 'Root',
    zoneColor: 'hsl(0 60% 50%)',
    eleventh: {
      name: 'Red Reishi',
      description: 'Inoculated Logs',
    },
    thirteenth: {
      name: 'Tall Red Amaranth',
      description: 'Aerial Signal',
    },
    jazzRationale: 'Reishi grounds the soil; Amaranth signals the birds.',
  },
  {
    frequencyHz: 417,
    zoneName: 'Flow',
    zoneColor: 'hsl(30 70% 50%)',
    eleventh: {
      name: "Lion's Mane",
      description: 'Shaded Gaps',
    },
    thirteenth: {
      name: 'Orange Mexican Sunflower',
      description: 'Aerial Signal',
    },
    jazzRationale: 'Fungi for brain flow; Flowers for butterfly flow.',
  },
  {
    frequencyHz: 528,
    zoneName: 'Solar',
    zoneColor: 'hsl(51 80% 50%)',
    eleventh: {
      name: 'Wine Cap',
      description: 'In the Mulch',
    },
    thirteenth: {
      name: 'Golden Fennel',
      description: 'Aerial Signal',
    },
    jazzRationale: 'Wine caps build soil carbon; Fennel attracts predatory wasps.',
  },
  {
    frequencyHz: 639,
    zoneName: 'Heart',
    zoneColor: 'hsl(120 50% 45%)',
    eleventh: {
      name: 'Oyster Mushrooms',
      description: 'Vertical Stacks',
    },
    thirteenth: {
      name: 'Dill (Mammoth Long Island)',
      description: 'Aerial Signal',
    },
    jazzRationale: "Mushrooms process fiber; Dill provides the 'Heart' canopy.",
  },
  {
    frequencyHz: 741,
    zoneName: 'Voice',
    zoneColor: 'hsl(210 60% 50%)',
    eleventh: {
      name: 'Turkey Tail',
      description: 'Wood Borders',
    },
    thirteenth: {
      name: "Bachelor's Buttons",
      description: 'Aerial Signal',
    },
    jazzRationale: "Turkey Tail clears the 'Signal'; Flowers attract blue bees.",
  },
  {
    frequencyHz: 852,
    zoneName: 'Vision',
    zoneColor: 'hsl(270 50% 50%)',
    eleventh: {
      name: 'Purple Spore Woodear',
      description: 'Wood Borders',
    },
    thirteenth: {
      name: 'Purple Verbena Bonariensis',
      description: 'Aerial Signal',
    },
    jazzRationale: "Woodear for 'Vision' texture; Verbena floats on high stems.",
  },
  {
    frequencyHz: 963,
    zoneName: 'Shield',
    zoneColor: 'hsl(300 50% 50%)',
    eleventh: {
      name: 'White Ghost Fungus',
      description: 'Sacred Logs',
    },
    thirteenth: {
      name: 'White Moonflower',
      description: 'Aerial Signal',
    },
    jazzRationale: "The 'Source' connection; Moonflower blooms at the 'Star Signal'.",
  },
];

/**
 * Get the jazz voicing recommendation for a specific frequency zone
 */
export const getZoneRecommendation = (frequencyHz: number): JazzVoicingRecommendation | undefined => {
  return JAZZ_VOICING_RECOMMENDATIONS.find(rec => rec.frequencyHz === frequencyHz);
};

/**
 * Check if the selected 11th matches the zone recommendation
 */
export const isRecommended11th = (frequencyHz: number, inoculantName: string | null): boolean => {
  if (!inoculantName) return false;
  const rec = getZoneRecommendation(frequencyHz);
  if (!rec) return false;
  return rec.eleventh.name.toLowerCase().includes(inoculantName.toLowerCase()) ||
         inoculantName.toLowerCase().includes(rec.eleventh.name.split(' ')[0].toLowerCase());
};

/**
 * Check if the selected 13th matches the zone recommendation
 */
export const isRecommended13th = (frequencyHz: number, aerialCropName: string | null): boolean => {
  if (!aerialCropName) return false;
  const rec = getZoneRecommendation(frequencyHz);
  if (!rec) return false;
  // Check if the crop name contains key parts of the recommendation
  const recWords = rec.thirteenth.name.toLowerCase().split(' ');
  const cropLower = aerialCropName.toLowerCase();
  return recWords.some(word => word.length > 3 && cropLower.includes(word));
};
