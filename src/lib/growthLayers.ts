import type { MasterCrop } from '@/hooks/useMasterCrops';

/**
 * GROWTH LAYER SYSTEM
 * Maps growth_habit to vertical layers for polyculture design.
 * Used for shading validation, vertical layering in chord recipes,
 * and Star-centered guild building.
 */

/** Vertical layer tiers, ordered tallest → shortest */
export type GrowthLayer = 'canopy' | 'understory' | 'herbaceous' | 'ground' | 'underground' | 'vine';

/** Estimated height tier per growth habit (feet) */
export const GROWTH_LAYER_MAP: Record<string, { layer: GrowthLayer; heightFt: number; emoji: string }> = {
  tree:          { layer: 'canopy',      heightFt: 25, emoji: '🌳' },
  shrub:         { layer: 'understory',  heightFt: 6,  emoji: '🫐' },
  bush:          { layer: 'understory',  heightFt: 5,  emoji: '🌿' },
  vine:          { layer: 'vine',        heightFt: 12, emoji: '🧗' },
  epiphyte:      { layer: 'vine',        heightFt: 8,  emoji: '🌺' },
  herb:          { layer: 'herbaceous',  heightFt: 2,  emoji: '🌱' },
  grass:         { layer: 'herbaceous',  heightFt: 3,  emoji: '🌾' },
  succulent:     { layer: 'herbaceous',  heightFt: 1,  emoji: '🪴' },
  'ground cover':{ layer: 'ground',      heightFt: 0.5,emoji: '🍀' },
  fungus:        { layer: 'ground',      heightFt: 0.3,emoji: '🍄' },
  aquatic:       { layer: 'ground',      heightFt: 0.5,emoji: '💧' },
  root:          { layer: 'underground', heightFt: 0.5,emoji: '🥕' },
  tuber:         { layer: 'underground', heightFt: 0.5,emoji: '🥔' },
  bulb:          { layer: 'underground', heightFt: 1,  emoji: '🧄' },
  rhizome:       { layer: 'underground', heightFt: 1,  emoji: '🫚' },
  underground:   { layer: 'underground', heightFt: 0.5,emoji: '⬇️' },
};

/** Get the growth layer info for a crop */
export const getCropLayer = (crop: MasterCrop) => {
  const habit = (crop.growth_habit || 'herb').toLowerCase();
  return GROWTH_LAYER_MAP[habit] || GROWTH_LAYER_MAP['herb'];
};

/** Height in feet for sorting/comparison */
export const getCropHeightFt = (crop: MasterCrop): number => getCropLayer(crop).heightFt;

/**
 * SHADING CHECK
 * Returns a warning if a shorter crop is placed adjacent to a much taller one
 * that would likely shade it out.
 */
export interface ShadingWarning {
  severity: 'info' | 'warning';
  message: string;
  tallerCrop: string;
  shorterCrop: string;
}

export const checkShading = (
  tallerCrop: MasterCrop,
  shorterCrop: MasterCrop
): ShadingWarning | null => {
  const tallerH = getCropHeightFt(tallerCrop);
  const shorterH = getCropHeightFt(shorterCrop);
  const diff = tallerH - shorterH;

  // Only warn when height difference is significant (>4ft) AND
  // the shorter crop is a sun-loving type (not shade-tolerant fungi/ground cover)
  if (diff <= 4) return null;
  
  const shorterLayer = getCropLayer(shorterCrop).layer;
  // Shade-tolerant layers don't trigger warnings
  if (shorterLayer === 'underground' || shorterLayer === 'ground') return null;

  const tallerName = tallerCrop.common_name || tallerCrop.name;
  const shorterName = shorterCrop.common_name || shorterCrop.name;
  
  if (diff > 10) {
    return {
      severity: 'warning',
      message: `${tallerName} (~${tallerH}ft) may heavily shade ${shorterName} (~${shorterH}ft). Consider placing ${shorterName} on the sun-facing side.`,
      tallerCrop: tallerName,
      shorterCrop: shorterName,
    };
  }
  return {
    severity: 'info',
    message: `${tallerName} is taller than ${shorterName}. Ensure adequate sun exposure.`,
    tallerCrop: tallerName,
    shorterCrop: shorterName,
  };
};

/**
 * VERTICAL LAYERING SCORE
 * Rewards recipes that have good vertical diversity (multiple layers used).
 * Used as a bonus in the harmonicScore function.
 */
export const verticalDiversityScore = (crops: MasterCrop[]): number => {
  const layers = new Set(crops.map(c => getCropLayer(c).layer));
  // Bonus points per unique layer (max 5 layers = 10 points)
  return layers.size * 2;
};

/**
 * LAYER COMPATIBILITY
 * Given a Star crop, returns which growth layers are ideal for each chord slot.
 * E.g., if Star is a tree → 3rd should be understory, 5th ground cover, etc.
 */
export const getIdealSlotLayers = (starCrop: MasterCrop): Record<string, GrowthLayer[]> => {
  const starLayer = getCropLayer(starCrop).layer;

  // Default layer preferences per interval (works for most star types)
  const base: Record<string, GrowthLayer[]> = {
    'Root (Lead)':      [starLayer],                          // Star's own layer
    '3rd (Triad)':      ['understory', 'herbaceous'],         // Pest defense nearby
    '5th (Stabilizer)': ['ground', 'herbaceous'],             // Ground cover / nitrogen
    '7th (Signal)':     ['herbaceous', 'vine'],               // Pollinator flowers
    '9th (Sub-bass)':   ['underground'],                      // Root layer
    '11th (Tension)':   ['ground', 'underground'],            // Fungal / sentinel
    '13th (Top Note)':  ['vine', 'canopy'],                   // Aerial layer
  };

  // Adjust based on star's layer
  if (starLayer === 'canopy') {
    base['3rd (Triad)'] = ['understory'];
    base['13th (Top Note)'] = ['vine'];
  } else if (starLayer === 'herbaceous' || starLayer === 'ground') {
    // Star is short → don't put canopy trees as companions
    base['13th (Top Note)'] = ['vine', 'herbaceous'];
    base['7th (Signal)'] = ['herbaceous'];
  } else if (starLayer === 'vine') {
    base['3rd (Triad)'] = ['herbaceous', 'understory'];
    base['13th (Top Note)'] = ['vine', 'herbaceous'];
  }

  return base;
};

/**
 * LAYER MATCH SCORE
 * Bonus points when a candidate's growth layer matches the ideal for its slot.
 */
export const layerMatchScore = (
  candidate: MasterCrop,
  slotKey: string,
  idealLayers: Record<string, GrowthLayer[]>
): number => {
  const ideal = idealLayers[slotKey];
  if (!ideal) return 0;
  const candidateLayer = getCropLayer(candidate).layer;
  if (ideal.includes(candidateLayer)) return 4;
  return 0;
};

/**
 * SUCCESSION PLANTING SCORE
 * Rewards candidates whose harvest_days create good stagger from already-placed crops.
 * Goal: spread harvests across the season for continuous yield.
 */
export const successionScore = (
  candidate: MasterCrop,
  placedCrops: MasterCrop[],
  targetStagger: number = 20 // ideal days between harvests
): number => {
  if (candidate.harvest_days == null) return 0;
  if (placedCrops.length === 0) return 0;

  const placedHarvests = placedCrops
    .map(c => c.harvest_days)
    .filter((d): d is number => d != null)
    .sort((a, b) => a - b);

  if (placedHarvests.length === 0) return 0;

  // Find minimum distance to any already-placed harvest
  const minDist = Math.min(...placedHarvests.map(d => Math.abs(candidate.harvest_days! - d)));

  // Reward stagger: best score when harvest is ~targetStagger days from nearest
  if (minDist >= targetStagger - 5 && minDist <= targetStagger + 10) return 4;
  if (minDist >= 10 && minDist < targetStagger) return 2;
  if (minDist < 5) return -2; // penalty for overlapping harvests
  return 1; // distant is okay but not ideal
};
