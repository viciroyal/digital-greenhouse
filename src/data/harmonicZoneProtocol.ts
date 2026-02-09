/**
 * HARMONIC ZONE PROTOCOL
 * 
 * The complete 7-Zone Frequency Mapping for the AgroMajic System.
 * Maps Solfeggio frequencies to musical notes, colors, identities, and operational signals.
 * 
 * This is the Single Source of Truth for all frequency-zone relationships.
 */

export interface HarmonicZone {
  zone: number;
  note: string;           // Musical note (C, D, E, F, G, A, B)
  frequencyHz: number;    // Solfeggio frequency
  color: string;          // Display color name
  colorHsl: string;       // HSL value for UI
  colorHex: string;       // Hex fallback
  agroIdentity: string;   // Primary identity label
  legacyName: string;     // Previous naming (The Root, The Flow, etc.)
  operationalSignal: string; // What this zone activates
  dominantMineral: string;   // Primary mineral focus
  mineralSymbol: string;     // Chemical symbol
  chakraAlignment: string;   // Energetic correspondence
  element: string;           // Classical element
  focusTag: string;          // Short operational focus
}

export const HARMONIC_ZONES: HarmonicZone[] = [
  {
    zone: 1,
    note: 'C',
    frequencyHz: 396,
    color: 'Red',
    colorHsl: 'hsl(0 60% 50%)',
    colorHex: '#FF0000',
    agroIdentity: 'Foundation',
    legacyName: 'The Root',
    operationalSignal: 'Rooting: Apply Phosphorus/Mineral Anchor.',
    dominantMineral: 'Phosphorus',
    mineralSymbol: 'P',
    chakraAlignment: 'Root',
    element: 'Earth',
    focusTag: 'Root anchoring / Double Kelp',
  },
  {
    zone: 2,
    note: 'D',
    frequencyHz: 417,
    color: 'Orange',
    colorHsl: 'hsl(30 70% 50%)',
    colorHex: '#FF7F00',
    agroIdentity: 'Flow',
    legacyName: 'The Flow',
    operationalSignal: 'Hydration: Manage water and fungal transit.',
    dominantMineral: 'Hydrogen/Carbon',
    mineralSymbol: 'H/C',
    chakraAlignment: 'Sacral',
    element: 'Water',
    focusTag: 'High Humates',
  },
  {
    zone: 3,
    note: 'E',
    frequencyHz: 528,
    color: 'Yellow',
    colorHsl: 'hsl(51 80% 50%)',
    colorHex: '#FFFF00',
    agroIdentity: 'Alchemy',
    legacyName: 'The Solar',
    operationalSignal: 'Solar: Apply Nitrogen/Growth Core.',
    dominantMineral: 'Nitrogen',
    mineralSymbol: 'N',
    chakraAlignment: 'Solar Plexus',
    element: 'Fire',
    focusTag: 'The Three Sisters / Alfalfa-Soybean boost',
  },
  {
    zone: 4,
    note: 'F',
    frequencyHz: 639,
    color: 'Green',
    colorHsl: 'hsl(120 50% 45%)',
    colorHex: '#00FF00',
    agroIdentity: 'Heart',
    legacyName: 'The Heart',
    operationalSignal: 'Connection: Bridge guilds/Mycorrhizal sync.',
    dominantMineral: 'Calcium',
    mineralSymbol: 'Ca',
    chakraAlignment: 'Heart',
    element: 'Air',
    focusTag: 'The Structure / Calcium boost',
  },
  {
    zone: 5,
    note: 'G',
    frequencyHz: 741,
    color: 'Blue',
    colorHsl: 'hsl(210 60% 50%)',
    colorHex: '#0000FF',
    agroIdentity: 'Signal',
    legacyName: 'The Voice',
    operationalSignal: 'Expression: Validate 12-24 Brix/NIR check.',
    dominantMineral: 'Potassium',
    mineralSymbol: 'K',
    chakraAlignment: 'Throat',
    element: 'Ether',
    focusTag: 'The Alchemy / Alfalfa sugar boost',
  },
  {
    zone: 6,
    note: 'A',
    frequencyHz: 852,
    color: 'Indigo',
    colorHsl: 'hsl(270 50% 50%)',
    colorHex: '#4B0082',
    agroIdentity: 'Vision',
    legacyName: 'The Vision',
    operationalSignal: 'Insight: Monitor medicinal/alkaloid density.',
    dominantMineral: 'Silica',
    mineralSymbol: 'Si',
    chakraAlignment: 'Third Eye',
    element: 'Light',
    focusTag: 'The Master Mix / Sea Mineral complexity',
  },
  {
    zone: 7,
    note: 'B',
    frequencyHz: 963,
    color: 'Violet',
    colorHsl: 'hsl(300 50% 50%)',
    colorHex: '#8B00FF',
    agroIdentity: 'Source',
    legacyName: 'The Shield',
    operationalSignal: 'Protection: Activate Garlic/Onion Shield.',
    dominantMineral: 'Sulfur',
    mineralSymbol: 'S',
    chakraAlignment: 'Crown',
    element: 'Spirit',
    focusTag: 'The Carry / Calcium for rot prevention',
  },
];

// ============= Utility Functions =============

/**
 * Get a zone by its frequency
 */
export const getZoneByFrequency = (frequencyHz: number): HarmonicZone | undefined => {
  return HARMONIC_ZONES.find(zone => zone.frequencyHz === frequencyHz);
};

/**
 * Get a zone by its number (1-7)
 */
export const getZoneByNumber = (zoneNumber: number): HarmonicZone | undefined => {
  return HARMONIC_ZONES.find(zone => zone.zone === zoneNumber);
};

/**
 * Get a zone by its musical note
 */
export const getZoneByNote = (note: string): HarmonicZone | undefined => {
  return HARMONIC_ZONES.find(zone => zone.note.toUpperCase() === note.toUpperCase());
};

/**
 * Get the HSL color for a frequency
 */
export const getZoneColor = (frequencyHz: number): string => {
  const zone = getZoneByFrequency(frequencyHz);
  return zone?.colorHsl || 'hsl(0 0% 50%)';
};

/**
 * Get the operational signal for a frequency
 */
export const getOperationalSignal = (frequencyHz: number): string => {
  const zone = getZoneByFrequency(frequencyHz);
  return zone?.operationalSignal || 'Unknown signal';
};

/**
 * Get all frequencies as an array
 */
export const ALL_FREQUENCIES = HARMONIC_ZONES.map(z => z.frequencyHz);

/**
 * Frequency to Zone mapping for quick lookup
 */
export const FREQUENCY_TO_ZONE: Record<number, HarmonicZone> = Object.fromEntries(
  HARMONIC_ZONES.map(zone => [zone.frequencyHz, zone])
);

/**
 * Musical Scale Reference
 * The 7 zones map to the C Major scale
 */
export const MUSICAL_SCALE = {
  C: 396,
  D: 417,
  E: 528,
  F: 639,
  G: 741,
  A: 852,
  B: 963,
} as const;

/**
 * Get the display label for a zone (combines note + identity)
 */
export const getZoneLabel = (frequencyHz: number, format: 'full' | 'short' | 'note' = 'full'): string => {
  const zone = getZoneByFrequency(frequencyHz);
  if (!zone) return `${frequencyHz}Hz`;
  
  switch (format) {
    case 'note':
      return zone.note;
    case 'short':
      return `${zone.note} - ${zone.agroIdentity}`;
    case 'full':
    default:
      return `${zone.note} (${zone.frequencyHz}Hz) - ${zone.agroIdentity}`;
  }
};
