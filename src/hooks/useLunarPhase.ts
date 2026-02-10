/**
 * Real-time Lunar Phase & Zodiac Calculator
 * 
 * Uses synodic month algorithm (29.53 days) anchored to known New Moon.
 * Maps moon phases to agricultural planting types per the biodynamic protocol.
 */

export interface LunarPhaseData {
  phase: LunarPhase;
  phaseLabel: string;
  phaseEmoji: string;
  dayInCycle: number;
  illumination: number; // 0-1
  zodiacSign: string;
  zodiacSymbol: string;
  zodiacElement: string;
  plantingType: PlantingType;
  plantingLabel: string;
  seasonalMovement: SeasonalMovement;
}

export type LunarPhase =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export type PlantingType = 'leaf' | 'fruit' | 'harvest' | 'root';

export interface SeasonalMovement {
  phase: number; // 1, 2, or 3
  name: string;
  dateRange: string;
  frequencyRange: string;
  focus: string;
  active: boolean;
}

// ── Constants ──

const SYNODIC_MONTH = 29.53058867; // days
// Known New Moon anchor: Jan 11, 2024 11:57 UTC
const NEW_MOON_ANCHOR = new Date(Date.UTC(2024, 0, 11, 11, 57, 0));

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire', start: [3, 21] },
  { name: 'Taurus', symbol: '♉', element: 'Earth', start: [4, 20] },
  { name: 'Gemini', symbol: '♊', element: 'Air', start: [5, 21] },
  { name: 'Cancer', symbol: '♋', element: 'Water', start: [6, 21] },
  { name: 'Leo', symbol: '♌', element: 'Fire', start: [7, 23] },
  { name: 'Virgo', symbol: '♍', element: 'Earth', start: [8, 23] },
  { name: 'Libra', symbol: '♎', element: 'Air', start: [9, 23] },
  { name: 'Scorpio', symbol: '♏', element: 'Water', start: [10, 23] },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', start: [11, 22] },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', start: [12, 22] },
  { name: 'Aquarius', symbol: '♒', element: 'Air', start: [1, 20] },
  { name: 'Pisces', symbol: '♓', element: 'Water', start: [2, 19] },
];

// Phase → planting type mapping (biodynamic protocol)
const PHASE_PLANTING: Record<LunarPhase, PlantingType> = {
  new_moon: 'leaf',
  waxing_crescent: 'leaf',
  first_quarter: 'fruit',
  waxing_gibbous: 'fruit',
  full_moon: 'harvest',
  waning_gibbous: 'harvest',
  last_quarter: 'root',
  waning_crescent: 'root',
};

const PLANTING_LABELS: Record<PlantingType, string> = {
  leaf: 'Leaf Crops — Greens, herbs, leafy vegetables',
  fruit: 'Fruit Crops — Tomatoes, peppers, squash, beans',
  harvest: 'Harvest Window — Peak Brix, seed saving, pruning',
  root: 'Root & Soil — Root vegetables, soil amendments, composting',
};

// ── 2026 CSA Seasonal Movements ──

function getSeasonalMovements(year: number): SeasonalMovement[] {
  const now = new Date();
  const movements: SeasonalMovement[] = [
    {
      phase: 1,
      name: 'The Cool Octave',
      dateRange: `Apr 3 – May 29, ${year}`,
      frequencyRange: '396Hz – 417Hz',
      focus: 'Foundation / Flow',
      active: now >= new Date(year, 3, 3) && now <= new Date(year, 4, 29),
    },
    {
      phase: 2,
      name: 'The Solar Peak',
      dateRange: `Jun 5 – Aug 7, ${year}`,
      frequencyRange: '528Hz – 741Hz',
      focus: 'Alchemy / Signal',
      active: now >= new Date(year, 5, 5) && now <= new Date(year, 7, 7),
    },
    {
      phase: 3,
      name: 'The Harvest Signal',
      dateRange: `Aug 14 – Oct 9, ${year}`,
      frequencyRange: '852Hz – 963Hz',
      focus: 'Vision / Source',
      active: now >= new Date(year, 7, 14) && now <= new Date(year, 9, 9),
    },
  ];
  return movements;
}

// ── Core calculations ──

function getMoonAge(date: Date): number {
  const diff = date.getTime() - NEW_MOON_ANCHOR.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
}

function getPhase(dayInCycle: number): LunarPhase {
  const normalized = dayInCycle / SYNODIC_MONTH;
  if (normalized < 0.0625) return 'new_moon';
  if (normalized < 0.1875) return 'waxing_crescent';
  if (normalized < 0.3125) return 'first_quarter';
  if (normalized < 0.4375) return 'waxing_gibbous';
  if (normalized < 0.5625) return 'full_moon';
  if (normalized < 0.6875) return 'waning_gibbous';
  if (normalized < 0.8125) return 'last_quarter';
  if (normalized < 0.9375) return 'waning_crescent';
  return 'new_moon';
}

const PHASE_LABELS: Record<LunarPhase, string> = {
  new_moon: 'New Moon',
  waxing_crescent: 'Waxing Crescent',
  first_quarter: 'First Quarter',
  waxing_gibbous: 'Waxing Gibbous',
  full_moon: 'Full Moon',
  waning_gibbous: 'Waning Gibbous',
  last_quarter: 'Last Quarter',
  waning_crescent: 'Waning Crescent',
};

const PHASE_EMOJIS: Record<LunarPhase, string> = {
  new_moon: '🌑',
  waxing_crescent: '🌒',
  first_quarter: '🌓',
  waxing_gibbous: '🌔',
  full_moon: '🌕',
  waning_gibbous: '🌖',
  last_quarter: '🌗',
  waning_crescent: '🌘',
};

function getSunSign(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (let i = ZODIAC_SIGNS.length - 1; i >= 0; i--) {
    const s = ZODIAC_SIGNS[i];
    if (month > s.start[0] || (month === s.start[0] && day >= s.start[1])) {
      return s;
    }
  }
  // Wrap: Capricorn for early Jan
  return ZODIAC_SIGNS[9]; // Capricorn
}

function getIllumination(dayInCycle: number): number {
  return (1 - Math.cos((2 * Math.PI * dayInCycle) / SYNODIC_MONTH)) / 2;
}

// ── Public API ──

export function getLunarPhase(date: Date = new Date()): LunarPhaseData {
  const dayInCycle = getMoonAge(date);
  const phase = getPhase(dayInCycle);
  const zodiac = getSunSign(date);
  const movements = getSeasonalMovements(date.getFullYear());
  const activeMovement = movements.find(m => m.active) || {
    phase: 0,
    name: 'Off-Season',
    dateRange: '',
    frequencyRange: '',
    focus: 'Preparation / Planning',
    active: false,
  };

  return {
    phase,
    phaseLabel: PHASE_LABELS[phase],
    phaseEmoji: PHASE_EMOJIS[phase],
    dayInCycle: Math.round(dayInCycle * 10) / 10,
    illumination: getIllumination(dayInCycle),
    zodiacSign: zodiac.name,
    zodiacSymbol: zodiac.symbol,
    zodiacElement: zodiac.element,
    plantingType: PHASE_PLANTING[phase],
    plantingLabel: PLANTING_LABELS[PHASE_PLANTING[phase]],
    seasonalMovement: activeMovement,
  };
}

/**
 * Check if a crop's category is compatible with the current lunar planting type
 */
export function isCropLunarReady(
  cropCategory: string,
  cropName: string,
  plantingType: PlantingType,
): boolean {
  const name = cropName.toLowerCase();
  const cat = cropCategory.toLowerCase();

  switch (plantingType) {
    case 'leaf':
      return cat.includes('green') || cat.includes('herb') || cat.includes('leafy') ||
        name.includes('lettuce') || name.includes('spinach') || name.includes('kale') ||
        name.includes('chard') || name.includes('basil') || name.includes('cilantro') ||
        name.includes('parsley') || name.includes('mint') || name.includes('collard');
    case 'fruit':
      return cat.includes('nightshade') || cat.includes('cucurbit') || cat.includes('legume') ||
        name.includes('tomato') || name.includes('pepper') || name.includes('squash') ||
        name.includes('bean') || name.includes('pea') || name.includes('cucumber') ||
        name.includes('melon') || name.includes('okra') || name.includes('corn');
    case 'harvest':
      // Everything is harvestable at full moon
      return true;
    case 'root':
      return cat.includes('root') || cat.includes('tuber') || cat.includes('allium') ||
        name.includes('carrot') || name.includes('beet') || name.includes('radish') ||
        name.includes('potato') || name.includes('onion') || name.includes('garlic') ||
        name.includes('turnip') || name.includes('ginger') || name.includes('turmeric');
  }
}

/**
 * Check if a frequency zone is compatible with the current seasonal movement
 */
export function isZoneInSeason(zoneHz: number, movement: SeasonalMovement): boolean {
  if (!movement.active) return true; // Off-season = everything allowed but flagged
  switch (movement.phase) {
    case 1: return zoneHz <= 417; // Cool Octave
    case 2: return zoneHz >= 528 && zoneHz <= 741; // Solar Peak
    case 3: return zoneHz >= 852; // Harvest Signal
    default: return true;
  }
}

/**
 * Get seasonal gating message for an out-of-season zone
 */
export function getSeasonalGateMessage(zoneHz: number, movement: SeasonalMovement): string | null {
  if (!movement.active) return null;
  if (isZoneInSeason(zoneHz, movement)) return null;
  
  return `This zone operates outside the current ${movement.name} (${movement.frequencyRange}). Planting may require season extension or protected culture.`;
}
