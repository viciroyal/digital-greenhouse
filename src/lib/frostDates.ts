/**
 * Frost date approximations by USDA hardiness zone.
 * Used to compute zone-aware planting windows.
 */

export interface FrostDate {
  month: number;
  day: number;
  label: string;
}

/** Last frost date (spring) by base zone */
export const LAST_FROST_BY_ZONE: Record<number, FrostDate> = {
  3:  { month: 5, day: 15, label: 'May 15' },
  4:  { month: 5, day: 1,  label: 'May 1' },
  5:  { month: 4, day: 15, label: 'Apr 15' },
  6:  { month: 4, day: 1,  label: 'Apr 1' },
  7:  { month: 3, day: 15, label: 'Mar 15' },
  8:  { month: 3, day: 1,  label: 'Mar 1' },
  9:  { month: 2, day: 15, label: 'Feb 15' },
  10: { month: 1, day: 31, label: 'Jan 31' },
  11: { month: 1, day: 1,  label: 'Year-round' },
  12: { month: 1, day: 1,  label: 'Year-round' },
  13: { month: 1, day: 1,  label: 'Year-round' },
};

/** First frost date (fall) by base zone */
export const FIRST_FROST_BY_ZONE: Record<number, FrostDate> = {
  3:  { month: 9, day: 15, label: 'Sep 15' },
  4:  { month: 10, day: 1,  label: 'Oct 1' },
  5:  { month: 10, day: 15, label: 'Oct 15' },
  6:  { month: 11, day: 1,  label: 'Nov 1' },
  7:  { month: 11, day: 15, label: 'Nov 15' },
  8:  { month: 11, day: 15, label: 'Nov 15' },
  9:  { month: 12, day: 1,  label: 'Dec 1' },
  10: { month: 12, day: 15, label: 'Dec 15' },
  11: { month: 12, day: 31, label: 'Year-round' },
  12: { month: 12, day: 31, label: 'Year-round' },
  13: { month: 12, day: 31, label: 'Year-round' },
};

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * Get zone-aware planting month range for a given season.
 * Returns a human-readable string like "Mar–May" for Spring in Zone 8.
 */
export function getPlantingWindow(
  season: string,
  hardinessZone: number
): string {
  const baseZone = Math.floor(hardinessZone);
  const lastFrost = LAST_FROST_BY_ZONE[baseZone];
  const firstFrost = FIRST_FROST_BY_ZONE[baseZone];

  if (!lastFrost || !firstFrost) return season;

  // Year-round zones
  if (baseZone >= 11) return 'Year-round';

  const s = season.toLowerCase();

  if (s === 'spring') {
    // Start: 2 weeks after last frost → end: ~8 weeks after
    const startMonth = lastFrost.month - 1; // month index
    const endMonth = Math.min(startMonth + 2, 11);
    return `${MONTH_ABBR[startMonth]}–${MONTH_ABBR[endMonth]}`;
  }

  if (s === 'fall') {
    // Start: ~10 weeks before first frost → end: ~4 weeks before
    const frostMonth = firstFrost.month - 1;
    const startMonth = Math.max(frostMonth - 3, 0);
    const endMonth = Math.max(frostMonth - 1, 0);
    return `${MONTH_ABBR[startMonth]}–${MONTH_ABBR[endMonth]}`;
  }

  if (s === 'summer') {
    // After last frost + 6 weeks through summer
    const startMonth = Math.min((lastFrost.month - 1) + 2, 11);
    const endMonth = Math.min(startMonth + 2, 8); // cap at Aug
    return `${MONTH_ABBR[startMonth]}–${MONTH_ABBR[endMonth]}`;
  }

  if (s === 'winter') {
    // After first frost for overwintering / cold frame crops
    const startMonth = firstFrost.month - 1;
    return `${MONTH_ABBR[startMonth]}–Feb`;
  }

  return season;
}

/**
 * Get all planting windows for a crop's seasons in a given zone.
 * Returns array of { season, window } objects.
 */
export function getZoneAwarePlantingWindows(
  plantingSeasons: string[] | null,
  hardinessZone: number
): { season: string; window: string }[] {
  if (!plantingSeasons || plantingSeasons.length === 0) return [];
  return plantingSeasons.map(season => ({
    season,
    window: getPlantingWindow(season, hardinessZone),
  }));
}

/**
 * Check if a crop fits within a hardiness zone range.
 */
export function cropFitsZone(
  cropZoneMin: number | null,
  cropZoneMax: number | null,
  hardinessZone: number
): boolean {
  if (cropZoneMin == null || cropZoneMax == null) return true; // no data = assume compatible
  return hardinessZone >= cropZoneMin && hardinessZone <= cropZoneMax;
}
