import type { MasterCrop } from '@/hooks/useMasterCrops';
import { isAntagonist, isExplicitCompanion } from './companionScoring';
import { cropFitsZone } from './frostDates';

/**
 * SUCCESSION ENGINE
 * After a crop finishes, suggests the best follow-up plant based on:
 * 1. Season timing — can it be planted NOW given the harvest date?
 * 2. Hardiness zone compatibility
 * 3. Crop rotation (different family/category avoids soil depletion)
 * 4. Companion compatibility with remaining bed crops
 * 5. Harvest staggering — prefer crops that fill the gap quickly
 */

export interface SuccessionCandidate {
  crop: MasterCrop;
  score: number;
  reasons: string[];
}

/** Map month index (0-11) to season keywords */
function getSeasonForMonth(month: number): string[] {
  if (month >= 2 && month <= 4) return ['spring'];
  if (month >= 5 && month <= 7) return ['summer'];
  if (month >= 8 && month <= 10) return ['fall', 'autumn'];
  return ['winter'];
}

/** Check if a crop can be planted in a given month */
function cropPlantableInMonth(crop: MasterCrop, month: number): boolean {
  if (!crop.planting_season || crop.planting_season.length === 0) return false;
  const seasonKws = getSeasonForMonth(month);
  const monthName = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
  ][month];
  const shortMonth = monthName.slice(0, 3);

  return crop.planting_season.some(s => {
    const lower = s.toLowerCase();
    return seasonKws.some(kw => lower.includes(kw)) ||
      lower.includes(monthName) ||
      lower.includes(shortMonth);
  });
}

/** Extract a rough "family" key from scientific name for rotation logic */
function getFamilyKey(crop: MasterCrop): string {
  const sci = crop.scientific_name?.toLowerCase() || '';
  // Use genus as a proxy for family
  const genus = sci.split(' ')[0];
  if (genus) return genus;
  // Fallback: use category
  return crop.category.toLowerCase();
}

/**
 * Suggest the best follow-up crops after a harvest.
 *
 * @param finishedCrop - The crop that just finished
 * @param allCrops - Full crop registry
 * @param hardinessZone - User's USDA zone (or null for unfiltered)
 * @param bedmates - Other crops currently in the same bed
 * @param harvestDate - When the crop finishes (defaults to now)
 * @param limit - Max suggestions to return
 */
export function suggestSuccession(
  finishedCrop: MasterCrop,
  allCrops: MasterCrop[],
  hardinessZone: number | null,
  bedmates: MasterCrop[] = [],
  harvestDate: Date = new Date(),
  limit = 3
): SuccessionCandidate[] {
  const plantMonth = harvestDate.getMonth();
  const finishedFamily = getFamilyKey(finishedCrop);

  const candidates: SuccessionCandidate[] = [];

  for (const candidate of allCrops) {
    // Skip self
    if (candidate.id === finishedCrop.id) continue;

    // Must be plantable in the harvest month (or next month)
    const plantableNow = cropPlantableInMonth(candidate, plantMonth);
    const plantableNext = cropPlantableInMonth(candidate, (plantMonth + 1) % 12);
    if (!plantableNow && !plantableNext) continue;

    // Must fit hardiness zone
    if (hardinessZone !== null && !cropFitsZone(candidate.hardiness_zone_min, candidate.hardiness_zone_max, hardinessZone)) continue;

    // Must not be antagonist to any bedmate
    const hasAntagonist = bedmates.some(bm => isAntagonist(candidate, bm));
    if (hasAntagonist) continue;

    let score = 0;
    const reasons: string[] = [];

    // 1. Rotation bonus: different family/genus = soil regeneration
    const candidateFamily = getFamilyKey(candidate);
    if (candidateFamily !== finishedFamily) {
      score += 8;
      reasons.push('Good rotation');
    } else {
      score -= 5; // Same family penalty
    }

    // 2. Season fit
    if (plantableNow) {
      score += 6;
      reasons.push('Plant now');
    } else {
      score += 3;
      reasons.push('Plant next month');
    }

    // 3. Quick harvest bonus (fills the gap fast)
    if (candidate.harvest_days) {
      if (candidate.harvest_days <= 45) {
        score += 4;
        reasons.push('Quick harvest');
      } else if (candidate.harvest_days <= 75) {
        score += 2;
      }
    }

    // 4. Companion synergy with bedmates
    for (const bm of bedmates) {
      if (isExplicitCompanion(candidate, bm)) {
        score += 5;
        reasons.push(`Companion of ${bm.common_name || bm.name}`);
        break; // Only count once
      }
    }

    // 5. Nitrogen fixer bonus after heavy feeders
    if (
      (finishedCrop.category === 'Sustenance') &&
      (candidate.category === 'Nitrogen/Bio-Mass')
    ) {
      score += 4;
      reasons.push('N-fixer after feeder');
    }

    // 6. Explicit companion of the finished crop (good sequential synergy)
    if (isExplicitCompanion(candidate, finishedCrop)) {
      score += 3;
      reasons.push('Follows well');
    }

    candidates.push({ crop: candidate, score, reasons });
  }

  // Sort by score descending, break ties by harvest_days (faster first)
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.crop.harvest_days || 999) - (b.crop.harvest_days || 999);
  });

  return candidates.slice(0, limit);
}
