import type { MasterCrop } from '@/hooks/useMasterCrops';

/**
 * COMPANION SCORING ENGINE
 * Evaluates crop compatibility based on:
 * 1. companion_crops database field (explicit companions)
 * 2. Water needs similarity (same planting_season overlap)
 * 3. Sun/spacing compatibility (growth habit complementarity)
 * 
 * Returns a soft-boost score (positive = synergy, negative = conflict)
 */

/** Known antagonist pairs — crops that should NOT be planted together */
export const ANTAGONIST_PAIRS = [
  { groupA: ['onion', 'garlic', 'shallot', 'leek', 'chive', 'scallion'], groupB: ['bean', 'pea', 'lentil', 'chickpea', 'lima'] },
  { groupA: ['tomato'], groupB: ['potato'] },
  { groupA: ['tomato'], groupB: ['corn'] },
  { groupA: ['tomato'], groupB: ['fennel'] },
  { groupA: ['cabbage', 'broccoli', 'kale', 'cauliflower', 'brussels'], groupB: ['tomato', 'pepper', 'strawberry'] },
  { groupA: ['fennel'], groupB: ['bean', 'pepper', 'eggplant', 'carrot'] },
  { groupA: ['walnut', 'black walnut'], groupB: ['tomato', 'pepper', 'eggplant', 'potato', 'blueberry'] },
  { groupA: ['dill', 'coriander', 'cilantro', 'parsnip'], groupB: ['carrot'] },
  { groupA: ['sage'], groupB: ['cucumber'] },
  { groupA: ['mint'], groupB: ['parsley'] },
  { groupA: ['sunflower'], groupB: ['potato'] },
  { groupA: ['potato'], groupB: ['squash', 'cucumber', 'zucchini', 'pumpkin'] },
  { groupA: ['bean'], groupB: ['pepper'] },
  { groupA: ['corn'], groupB: ['celery'] },
  { groupA: ['onion'], groupB: ['asparagus'] },
  { groupA: ['pepper'], groupB: ['fennel'] },
  { groupA: ['pepper'], groupB: ['kohlrabi'] },
  { groupA: ['squash', 'zucchini', 'pumpkin'], groupB: ['potato'] },
  { groupA: ['cucumber'], groupB: ['potato'] },
  { groupA: ['cucumber', 'squash', 'zucchini'], groupB: ['melon'] },
  { groupA: ['eggplant'], groupB: ['fennel'] },
  { groupA: ['eggplant'], groupB: ['pepper'] },
  { groupA: ['celery'], groupB: ['parsnip', 'parsley'] },
];

/** Growth habits that complement each other vertically */
const COMPLEMENTARY_HABITS: [string, string][] = [
  ['tree', 'ground cover'],
  ['vine', 'herb'],
  ['shrub', 'ground cover'],
  ['upright', 'spreading'],
  ['vine', 'upright'],
];

/** Check if candidate name matches any keyword in a list */
const nameMatches = (name: string, keywords: string[]): boolean =>
  keywords.some(k => name.includes(k));

/**
 * Check if two crops are antagonists
 */
export function isAntagonist(a: MasterCrop, b: MasterCrop): boolean {
  const aName = (a.common_name || a.name).toLowerCase();
  const bName = (b.common_name || b.name).toLowerCase();
  for (const rule of ANTAGONIST_PAIRS) {
    const aInA = nameMatches(aName, rule.groupA);
    const aInB = nameMatches(aName, rule.groupB);
    const bInA = nameMatches(bName, rule.groupA);
    const bInB = nameMatches(bName, rule.groupB);
    if ((aInA && bInB) || (aInB && bInA)) return true;
  }
  return false;
}

/**
 * Check if crop B is listed as a companion of crop A (or vice versa)
 */
export function isExplicitCompanion(a: MasterCrop, b: MasterCrop): boolean {
  const aName = (a.common_name || a.name).toLowerCase();
  const bName = (b.common_name || b.name).toLowerCase();
  
  const aCompanions = (a.companion_crops || []).map(c => c.toLowerCase());
  const bCompanions = (b.companion_crops || []).map(c => c.toLowerCase());
  
  const bMatchesA = aCompanions.some(comp => bName.includes(comp) || comp.includes(bName.split(' ')[0]));
  const aMatchesB = bCompanions.some(comp => aName.includes(comp) || comp.includes(aName.split(' ')[0]));
  
  return bMatchesA || aMatchesB;
}

/**
 * Score planting season overlap (water/timing compatibility)
 * Returns 0-3 based on shared seasons
 */
function seasonOverlapScore(a: MasterCrop, b: MasterCrop): number {
  const aSeasons = a.planting_season || [];
  const bSeasons = b.planting_season || [];
  if (!aSeasons.length || !bSeasons.length) return 1; // neutral if unknown
  let shared = 0;
  for (const s of aSeasons) {
    if (bSeasons.includes(s)) shared++;
  }
  return Math.min(shared, 3);
}

/**
 * Score growth habit complementarity (vertical stacking)
 * Returns 0-2 bonus for complementary habits
 */
function habitComplementScore(a: MasterCrop, b: MasterCrop): number {
  if (!a.growth_habit || !b.growth_habit) return 0;
  const aH = a.growth_habit.toLowerCase();
  const bH = b.growth_habit.toLowerCase();
  // Same habit = 0 bonus (no diversity)
  if (aH === bH) return 0;
  // Complementary pair = 2 bonus
  for (const [h1, h2] of COMPLEMENTARY_HABITS) {
    if ((aH.includes(h1) && bH.includes(h2)) || (aH.includes(h2) && bH.includes(h1))) return 2;
  }
  // Different habit = 1 bonus (some diversity)
  return 1;
}

/**
 * Comprehensive companion score for a candidate crop against already-placed crops.
 * 
 * Score breakdown:
 * - Explicit companion match: +5 per companion found
 * - Season overlap: +1 per shared season (max 3)
 * - Habit complement: +1-2 for vertical diversity
 * - Antagonist: -15 (heavy penalty)
 */
export function companionScore(candidate: MasterCrop, placed: MasterCrop[]): number {
  if (placed.length === 0) return 0;
  
  let score = 0;
  
  for (const other of placed) {
    // Antagonist check (heavy penalty)
    if (isAntagonist(candidate, other)) {
      score -= 15;
      continue;
    }
    
    // Explicit companion bonus
    if (isExplicitCompanion(candidate, other)) {
      score += 5;
    }
    
    // Season overlap
    score += seasonOverlapScore(candidate, other);
    
    // Growth habit complement
    score += habitComplementScore(candidate, other);
  }
  
  return score;
}

/**
 * Get synergy notes for display — returns companion names and conflict warnings
 */
export interface SynergyNote {
  type: 'companion' | 'antagonist';
  cropName: string;
  message: string;
}

export function getSynergyNotes(crop: MasterCrop, others: MasterCrop[]): SynergyNote[] {
  const notes: SynergyNote[] = [];
  
  for (const other of others) {
    if (other.id === crop.id) continue;
    const otherName = other.common_name || other.name;
    
    if (isAntagonist(crop, other)) {
      notes.push({
        type: 'antagonist',
        cropName: otherName,
        message: `Avoid planting near ${otherName}`,
      });
    } else if (isExplicitCompanion(crop, other)) {
      notes.push({
        type: 'companion',
        cropName: otherName,
        message: `Companion of ${otherName}`,
      });
    }
  }
  
  return notes;
}
