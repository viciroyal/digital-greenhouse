import { describe, it, expect } from 'vitest';
import { suggestSuccession } from '@/lib/successionEngine';
import type { MasterCrop } from '@/hooks/useMasterCrops';

const baseCrop = (overrides: Partial<MasterCrop> = {}): MasterCrop => ({
  id: 'test-id',
  name: 'Test Crop',
  common_name: 'Test',
  frequency_hz: 528,
  zone_name: 'Solar',
  zone_color: '#FFFF00',
  element: 'Fire',
  category: 'Sustenance',
  chord_interval: null,
  focus_tag: null,
  guild_role: null,
  cultural_role: null,
  dominant_mineral: null,
  soil_protocol_focus: null,
  planting_season: ['Spring'],
  harvest_days: 60,
  companion_crops: [],
  crop_guild: null,
  spacing_inches: null,
  library_note: null,
  description: null,
  scientific_name: 'Solanum lycopersicum',
  brix_target_min: null,
  brix_target_max: null,
  instrument_type: null,
  hardiness_zone_min: 3,
  hardiness_zone_max: 10,
  growth_habit: 'herb',
  root_depth_inches: null,
  min_container_gal: null,
  propagation_method: null,
  est_yield_lbs_per_plant: null,
  seed_cost_cents: null,
  created_at: '',
  updated_at: '',
  ...overrides,
});

describe('suggestSuccession', () => {
  it('returns empty for empty crop list', () => {
    const finished = baseCrop();
    expect(suggestSuccession(finished, [], null)).toEqual([]);
  });

  it('excludes the finished crop itself', () => {
    const finished = baseCrop({ id: 'a' });
    const results = suggestSuccession(finished, [finished], null);
    expect(results.length).toBe(0);
  });

  it('prefers different family (rotation bonus)', () => {
    const finished = baseCrop({ id: 'a', scientific_name: 'Solanum lycopersicum', planting_season: ['Spring'] });
    const sameFamily = baseCrop({ id: 'b', scientific_name: 'Solanum melongena', common_name: 'Eggplant', planting_season: ['Spring'] });
    const diffFamily = baseCrop({ id: 'c', scientific_name: 'Phaseolus vulgaris', common_name: 'Bean', planting_season: ['Spring'], category: 'Nitrogen/Bio-Mass' });

    // Harvest in spring (month 3 = April)
    const harvestDate = new Date(2026, 3, 15);
    const results = suggestSuccession(finished, [sameFamily, diffFamily], null, [], harvestDate);

    // diffFamily should score higher (rotation + N-fixer bonus)
    expect(results.length).toBe(2);
    expect(results[0].crop.id).toBe('c');
    expect(results[0].reasons).toContain('Good rotation');
  });

  it('filters by hardiness zone', () => {
    const finished = baseCrop({ id: 'a', planting_season: ['Spring'] });
    const tropical = baseCrop({ id: 'b', common_name: 'Mango', scientific_name: 'Mangifera indica', planting_season: ['Spring'], hardiness_zone_min: 10, hardiness_zone_max: 13 });
    const temperate = baseCrop({ id: 'c', common_name: 'Lettuce', scientific_name: 'Lactuca sativa', planting_season: ['Spring'], hardiness_zone_min: 3, hardiness_zone_max: 10 });

    const harvestDate = new Date(2026, 3, 15);
    const results = suggestSuccession(finished, [tropical, temperate], 6, [], harvestDate);

    // Tropical mango should be filtered out
    expect(results.every(r => r.crop.id !== 'b')).toBe(true);
    expect(results.some(r => r.crop.id === 'c')).toBe(true);
  });

  it('excludes antagonists of bedmates', () => {
    const finished = baseCrop({ id: 'a', planting_season: ['Spring'] });
    const bean = baseCrop({ id: 'b', common_name: 'Bean', scientific_name: 'Phaseolus vulgaris', planting_season: ['Spring'] });
    const onion = baseCrop({ id: 'c', common_name: 'Onion', scientific_name: 'Allium cepa', planting_season: ['Spring'] });

    // Bean is a bedmate — onion should be excluded (antagonist)
    const harvestDate = new Date(2026, 3, 15);
    const results = suggestSuccession(finished, [onion], null, [bean], harvestDate);
    expect(results.every(r => r.crop.common_name !== 'Onion')).toBe(true);
  });

  it('limits results to requested count', () => {
    const finished = baseCrop({ id: 'a', planting_season: ['Spring'] });
    const candidates = Array.from({ length: 10 }, (_, i) =>
      baseCrop({ id: `c${i}`, common_name: `Crop ${i}`, scientific_name: `Genus${i} species`, planting_season: ['Spring'] })
    );
    const harvestDate = new Date(2026, 3, 15);
    const results = suggestSuccession(finished, candidates, null, [], harvestDate, 2);
    expect(results.length).toBe(2);
  });

  it('gives N-fixer bonus after Sustenance crops', () => {
    const finished = baseCrop({ id: 'a', category: 'Sustenance', planting_season: ['Spring'] });
    const nFixer = baseCrop({ id: 'b', common_name: 'Cowpea', scientific_name: 'Vigna unguiculata', planting_season: ['Spring'], category: 'Nitrogen/Bio-Mass' });
    const regular = baseCrop({ id: 'c', common_name: 'Lettuce', scientific_name: 'Lactuca sativa', planting_season: ['Spring'], category: 'Sustenance' });

    const harvestDate = new Date(2026, 3, 15);
    const results = suggestSuccession(finished, [nFixer, regular], null, [], harvestDate);
    expect(results[0].crop.id).toBe('b');
    expect(results[0].reasons).toContain('N-fixer after feeder');
  });
});
