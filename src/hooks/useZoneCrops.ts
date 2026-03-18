import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cropFitsZone } from '@/lib/frostDates';

export interface ZoneCropSuggestion {
  crop: string;
  spacing: string;
  plants: string;
  note?: string;
  season: string;
}

/** Categories ideal for a small 10×10 bed */
const PREFERRED_CATEGORIES = ['Vegetable', 'Leafy Green', 'Root Vegetable', 'Legume', 'Herb', 'Allium'];

/** Growth habits that fit a 10×10 space */
const PREFERRED_HABITS = ['bush', 'herbaceous', 'tuber', 'root', 'bulb', 'rosette', 'clumping'];

function estimatePlants(spacingStr: string | null): string {
  if (!spacingStr) return '~16 plants';
  const match = spacingStr.match(/(\d+)/);
  if (!match) return '~16 plants';
  const inches = parseInt(match[1], 10);
  if (inches <= 4) return '~40 plants';
  if (inches <= 8) return '~30 plants';
  if (inches <= 12) return '~24 plants';
  if (inches <= 18) return '~20 plants';
  return '~16 plants';
}

function formatSpacing(spacingStr: string | null): string {
  if (!spacingStr) return '12"';
  return spacingStr.includes('"') ? spacingStr : `${spacingStr}"`;
}

export function useZoneCrops(hardinessZone: number | null) {
  return useQuery({
    queryKey: ['zone-crops-10x10', hardinessZone],
    enabled: hardinessZone !== null,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_crops')
        .select('common_name, name, category, spacing_inches, planting_season, hardiness_zone_min, hardiness_zone_max, growth_habit, harvest_days')
        .order('common_name');

      if (error) throw error;
      if (!data) return { spring: [], fall: [] };

      // Filter to zone-compatible, small-garden-friendly crops
      const compatible = data.filter(crop => {
        if (!cropFitsZone(crop.hardiness_zone_min, crop.hardiness_zone_max, hardinessZone!)) return false;
        const cat = crop.category?.toLowerCase() ?? '';
        const habit = crop.growth_habit?.toLowerCase() ?? '';
        const isCategoryOk = PREFERRED_CATEGORIES.some(c => cat.includes(c.toLowerCase()));
        const isHabitOk = !habit || PREFERRED_HABITS.some(h => habit.includes(h));
        // Exclude trees/vines that don't fit a 10×10
        if (habit.includes('tree') || habit.includes('vine')) return false;
        return isCategoryOk || isHabitOk;
      });

      const springCrops: ZoneCropSuggestion[] = [];
      const fallCrops: ZoneCropSuggestion[] = [];

      for (const crop of compatible) {
        const name = crop.common_name || crop.name;
        const seasons = crop.planting_season ?? [];
        const suggestion: Omit<ZoneCropSuggestion, 'season'> = {
          crop: name,
          spacing: formatSpacing(crop.spacing_inches),
          plants: estimatePlants(crop.spacing_inches),
          note: crop.harvest_days ? `~${crop.harvest_days} days to harvest` : undefined,
        };

        if (seasons.some(s => s.toLowerCase().includes('spring'))) {
          springCrops.push({ ...suggestion, season: 'Spring' });
        }
        if (seasons.some(s => s.toLowerCase().includes('fall'))) {
          fallCrops.push({ ...suggestion, season: 'Fall' });
        }
      }

      // Return a curated mix (top picks per season, diversified by category)
      return {
        spring: diversifyPicks(springCrops, 6),
        fall: diversifyPicks(fallCrops, 6),
      };
    },
  });
}

/** Pick a diverse set of crops, avoiding duplicate categories */
function diversifyPicks(crops: ZoneCropSuggestion[], count: number): ZoneCropSuggestion[] {
  if (crops.length <= count) return crops;
  const picked: ZoneCropSuggestion[] = [];
  const seen = new Set<string>();
  // Shuffle for variety
  const shuffled = [...crops].sort(() => Math.random() - 0.5);
  for (const c of shuffled) {
    const key = c.crop.split(' ')[0].toLowerCase();
    if (!seen.has(key)) {
      picked.push(c);
      seen.add(key);
      if (picked.length >= count) break;
    }
  }
  return picked;
}
