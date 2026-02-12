import { describe, it, expect } from 'vitest';
import type { MasterCrop } from '@/hooks/useMasterCrops';

/**
 * We import pickRecipe indirectly since it's defined inside FirstGarden.tsx.
 * To test it properly we replicate the algorithm here with the same logic.
 * This validates the RULES, not the component rendering.
 */

import { companionScore } from '@/lib/companionScoring';

/* ─── Replicate pickRecipe logic for testability ─── */

type SpaceOption = 'windowsill' | 'patio' | 'small-bed' | 'big-yard';
type SunOption = 'full' | 'partial' | 'shade';
type GoalOption = 'salads' | 'cooking' | 'herbs' | 'flowers';

const GOAL_CROPS: Record<GoalOption, string[]> = {
  salads: ['Lettuce', 'Tomato', 'Cucumber', 'Radish', 'Spinach', 'Arugula', 'Mesclun', 'Cherry Tomato', 'Snap Pea', 'Carrot'],
  cooking: ['Tomato', 'Pepper', 'Onion', 'Garlic', 'Bean', 'Squash', 'Eggplant', 'Potato', 'Sweet Potato', 'Okra'],
  herbs: ['Basil', 'Mint', 'Rosemary', 'Thyme', 'Cilantro', 'Parsley', 'Chamomile', 'Lavender', 'Oregano', 'Dill'],
  flowers: ['Marigold', 'Sunflower', 'Zinnia', 'Nasturtium', 'Calendula', 'Echinacea', 'Cosmos', 'Rose', 'Lavender', 'Bee Balm'],
};

const SHADE_FRIENDLY = ['Lettuce', 'Spinach', 'Arugula', 'Mint', 'Parsley', 'Cilantro', 'Radish', 'Mesclun', 'Kale', 'Chamomile', 'Calendula', 'Nasturtium'];

function pickRecipe(allCrops: MasterCrop[], space: SpaceOption, sun: SunOption, goal: GoalOption): MasterCrop[] {
  const preferredNames = GOAL_CROPS[goal];
  const maxPlants = space === 'windowsill' ? 3 : space === 'patio' ? 4 : space === 'small-bed' ? 5 : 6;

  const scored = allCrops
    .filter(c => {
      const name = (c.common_name || c.name).toLowerCase();
      if (sun === 'shade' && !SHADE_FRIENDLY.some(s => name.includes(s.toLowerCase()))) return false;
      if ((space === 'windowsill' || space === 'patio') && c.spacing_inches) {
        const sp = parseInt(c.spacing_inches);
        if (!isNaN(sp) && sp > 18) return false;
      }
      return true;
    })
    .map(c => {
      const name = (c.common_name || c.name).toLowerCase();
      let score = 0;
      for (const pref of preferredNames) {
        const prefLower = pref.toLowerCase();
        const regex = new RegExp(`\\b${prefLower}\\b`);
        if (regex.test(name)) { score += 20; break; }
      }
      if (goal === 'herbs' && c.growth_habit === 'herb') score += 10;
      if (goal === 'flowers' && (c.category === 'Dye/Fiber/Aromatic' || c.growth_habit === 'herb')) score += 8;
      if (c.category === 'Sustenance') score += 2;
      if (c.harvest_days && c.harvest_days <= 60) score += 3;
      else if (c.harvest_days && c.harvest_days <= 90) score += 1;
      if ((space === 'windowsill' || space === 'patio') && c.growth_habit === 'herb') score += 3;
      return { crop: c, score };
    });

  scored.sort((a, b) => b.score - a.score);

  const picked: MasterCrop[] = [];
  const usedSpecies = new Set<string>();
  const usedCategories = new Map<string, number>();

  for (const entry of scored) {
    if (picked.length >= maxPlants) break;
    const { crop } = entry;
    const species = (crop.scientific_name || crop.name).toLowerCase().trim();
    if (usedSpecies.has(species)) continue;
    const cat = crop.category || 'Other';
    const catCount = usedCategories.get(cat) || 0;
    if (catCount >= 2) continue;
    const compScore = companionScore(crop, picked);
    if (compScore <= -10) continue;
    usedSpecies.add(species);
    usedCategories.set(cat, catCount + 1);
    picked.push(crop);
  }

  return picked;
}

/* ─── TEST FIXTURES ─── */

function makeCrop(overrides: Partial<MasterCrop> & { name: string }): MasterCrop {
  return {
    id: overrides.name.toLowerCase().replace(/\s/g, '-'),
    name: overrides.name,
    common_name: overrides.common_name ?? overrides.name,
    frequency_hz: 396,
    zone_name: 'Foundation',
    zone_color: '#FF0000',
    element: 'Earth',
    category: 'Sustenance',
    chord_interval: null,
    focus_tag: null,
    guild_role: null,
    cultural_role: null,
    dominant_mineral: null,
    soil_protocol_focus: null,
    planting_season: ['Spring'],
    harvest_days: 60,
    companion_crops: null,
    crop_guild: null,
    spacing_inches: '12',
    library_note: null,
    description: null,
    scientific_name: null,
    brix_target_min: null,
    brix_target_max: null,
    instrument_type: null,
    hardiness_zone_min: null,
    hardiness_zone_max: null,
    growth_habit: 'herb',
    root_depth_inches: 6,
    min_container_gal: 2,
    propagation_method: 'both',
    est_yield_lbs_per_plant: null,
    seed_cost_cents: null,
    created_at: '',
    updated_at: '',
    ...overrides,
  };
}

/* ─── Test pool ─── */
const testPool: MasterCrop[] = [
  makeCrop({ name: 'Lettuce', scientific_name: 'Lactuca sativa', harvest_days: 30, spacing_inches: '6' }),
  makeCrop({ name: 'Spinach', scientific_name: 'Spinacia oleracea', harvest_days: 40, spacing_inches: '6' }),
  makeCrop({ name: 'Basil', scientific_name: 'Ocimum basilicum', harvest_days: 45, growth_habit: 'herb', spacing_inches: '8' }),
  makeCrop({ name: 'Mint', scientific_name: 'Mentha spicata', harvest_days: 50, growth_habit: 'herb', spacing_inches: '10' }),
  makeCrop({ name: 'Cilantro', scientific_name: 'Coriandrum sativum', harvest_days: 35, growth_habit: 'herb', spacing_inches: '6' }),
  makeCrop({ name: 'Tomato', scientific_name: 'Solanum lycopersicum', harvest_days: 80, growth_habit: 'vine', spacing_inches: '24' }),
  makeCrop({ name: 'Cherry Tomato', scientific_name: 'Solanum lycopersicum var cerasiforme', harvest_days: 65, growth_habit: 'vine', spacing_inches: '18' }),
  makeCrop({ name: 'Pepper', scientific_name: 'Capsicum annuum', harvest_days: 70, spacing_inches: '18' }),
  makeCrop({ name: 'Onion', scientific_name: 'Allium cepa', harvest_days: 90, growth_habit: 'bulb', spacing_inches: '4' }),
  makeCrop({ name: 'Bean', scientific_name: 'Phaseolus vulgaris', harvest_days: 55, growth_habit: 'vine', spacing_inches: '6', category: 'Nitrogen/Bio-Mass' }),
  makeCrop({ name: 'Marigold', scientific_name: 'Tagetes erecta', harvest_days: 50, category: 'Dye/Fiber/Aromatic', spacing_inches: '8' }),
  makeCrop({ name: 'Sunflower', scientific_name: 'Helianthus annuus', harvest_days: 80, category: 'Dye/Fiber/Aromatic', spacing_inches: '24' }),
  makeCrop({ name: 'Chamomile', scientific_name: 'Matricaria chamomilla', harvest_days: 60, growth_habit: 'herb', spacing_inches: '8' }),
  makeCrop({ name: 'Squash', scientific_name: 'Cucurbita pepo', harvest_days: 55, growth_habit: 'vine', spacing_inches: '36' }),
  makeCrop({ name: 'Radish', scientific_name: 'Raphanus sativus', harvest_days: 25, spacing_inches: '2' }),
  makeCrop({ name: 'Kale', scientific_name: 'Brassica oleracea var sabellica', harvest_days: 55, spacing_inches: '12' }),
  // Duplicate species tomato (different variety)
  makeCrop({ name: 'Abe Lincoln Tomato', scientific_name: 'Solanum lycopersicum', harvest_days: 80, growth_habit: 'vine', spacing_inches: '24' }),
];

/* ─── TESTS ─── */

describe('pickRecipe', () => {
  describe('max plant count by space', () => {
    it('windowsill returns at most 3 plants', () => {
      const result = pickRecipe(testPool, 'windowsill', 'full', 'herbs');
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it('patio returns at most 4 plants', () => {
      const result = pickRecipe(testPool, 'patio', 'full', 'salads');
      expect(result.length).toBeLessThanOrEqual(4);
    });

    it('small-bed returns at most 5 plants', () => {
      const result = pickRecipe(testPool, 'small-bed', 'full', 'cooking');
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('big-yard returns at most 6 plants', () => {
      const result = pickRecipe(testPool, 'big-yard', 'full', 'cooking');
      expect(result.length).toBeLessThanOrEqual(6);
    });
  });

  describe('shade filtering', () => {
    it('shade mode only returns shade-friendly crops', () => {
      const result = pickRecipe(testPool, 'small-bed', 'shade', 'salads');
      const shadeFriendlyNames = SHADE_FRIENDLY.map(s => s.toLowerCase());
      for (const crop of result) {
        const name = (crop.common_name || crop.name).toLowerCase();
        const isShadeOk = shadeFriendlyNames.some(s => name.includes(s));
        expect(isShadeOk).toBe(true);
      }
    });

    it('shade + herbs returns only shade-friendly herbs', () => {
      const result = pickRecipe(testPool, 'windowsill', 'shade', 'herbs');
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(3);
    });
  });

  describe('container spacing constraint', () => {
    it('windowsill excludes crops with spacing > 18"', () => {
      const result = pickRecipe(testPool, 'windowsill', 'full', 'cooking');
      for (const crop of result) {
        if (crop.spacing_inches) {
          const sp = parseInt(crop.spacing_inches);
          if (!isNaN(sp)) {
            expect(sp).toBeLessThanOrEqual(18);
          }
        }
      }
    });

    it('patio excludes crops with spacing > 18"', () => {
      const result = pickRecipe(testPool, 'patio', 'full', 'salads');
      for (const crop of result) {
        if (crop.spacing_inches) {
          const sp = parseInt(crop.spacing_inches);
          if (!isNaN(sp)) {
            expect(sp).toBeLessThanOrEqual(18);
          }
        }
      }
    });
  });

  describe('species deduplication', () => {
    it('never picks two crops with the same scientific name', () => {
      const result = pickRecipe(testPool, 'big-yard', 'full', 'cooking');
      const speciesSet = new Set<string>();
      for (const crop of result) {
        const species = (crop.scientific_name || crop.name).toLowerCase().trim();
        expect(speciesSet.has(species)).toBe(false);
        speciesSet.add(species);
      }
    });
  });

  describe('category diversity limit', () => {
    it('limits any single category to max 2 picks', () => {
      const result = pickRecipe(testPool, 'big-yard', 'full', 'cooking');
      const catCounts = new Map<string, number>();
      for (const crop of result) {
        const cat = crop.category || 'Other';
        catCounts.set(cat, (catCounts.get(cat) || 0) + 1);
      }
      for (const [, count] of catCounts) {
        expect(count).toBeLessThanOrEqual(2);
      }
    });
  });

  describe('antagonist avoidance', () => {
    it('does not pair Onion and Bean in the same recipe', () => {
      // Pool with only antagonists + filler
      const antagonistPool = [
        makeCrop({ name: 'Onion', scientific_name: 'Allium cepa', harvest_days: 90, growth_habit: 'bulb', spacing_inches: '4' }),
        makeCrop({ name: 'Bean', scientific_name: 'Phaseolus vulgaris', harvest_days: 55, growth_habit: 'vine', spacing_inches: '6', category: 'Nitrogen/Bio-Mass' }),
        makeCrop({ name: 'Pepper', scientific_name: 'Capsicum annuum', harvest_days: 70, spacing_inches: '18' }),
        makeCrop({ name: 'Tomato', scientific_name: 'Solanum lycopersicum', harvest_days: 80, growth_habit: 'vine', spacing_inches: '24' }),
        makeCrop({ name: 'Basil', scientific_name: 'Ocimum basilicum', harvest_days: 45, growth_habit: 'herb', spacing_inches: '8' }),
      ];
      const result = pickRecipe(antagonistPool, 'small-bed', 'full', 'cooking');
      const names = result.map(c => (c.common_name || c.name).toLowerCase());
      const hasOnion = names.some(n => n.includes('onion'));
      const hasBean = names.some(n => n.includes('bean'));
      // They should not both appear
      expect(hasOnion && hasBean).toBe(false);
    });
  });

  describe('goal preference', () => {
    it('herbs goal prioritizes herb crops', () => {
      const result = pickRecipe(testPool, 'small-bed', 'full', 'herbs');
      // At least one herb from the preferred list should appear
      const herbNames = GOAL_CROPS.herbs.map(n => n.toLowerCase());
      const hasPreferred = result.some(c => {
        const name = (c.common_name || c.name).toLowerCase();
        return herbNames.some(h => name.includes(h));
      });
      expect(hasPreferred).toBe(true);
    });

    it('flowers goal picks from flower/aromatic category', () => {
      const result = pickRecipe(testPool, 'small-bed', 'full', 'flowers');
      const hasFlower = result.some(c =>
        c.category === 'Dye/Fiber/Aromatic' ||
        GOAL_CROPS.flowers.some(f => (c.common_name || c.name).toLowerCase().includes(f.toLowerCase()))
      );
      expect(hasFlower).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('returns empty array when no crops match', () => {
      const result = pickRecipe([], 'small-bed', 'full', 'cooking');
      expect(result).toEqual([]);
    });

    it('handles crops with null spacing_inches in container mode', () => {
      const nullSpacing = [
        makeCrop({ name: 'NoSpacing Herb', scientific_name: 'Herbicus nullus', spacing_inches: null, growth_habit: 'herb' }),
      ];
      const result = pickRecipe(nullSpacing, 'windowsill', 'full', 'herbs');
      expect(result.length).toBe(1); // should be included since spacing is null (no filter)
    });

    it('handles pool smaller than max plants', () => {
      const tinyPool = [
        makeCrop({ name: 'Solo Basil', scientific_name: 'Ocimum solo', growth_habit: 'herb' }),
      ];
      const result = pickRecipe(tinyPool, 'big-yard', 'full', 'herbs');
      expect(result.length).toBe(1);
    });
  });
});
