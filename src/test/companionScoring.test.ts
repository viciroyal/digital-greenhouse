import { describe, it, expect } from 'vitest';
import {
  isAntagonist,
  isExplicitCompanion,
  companionScore,
  getSynergyNotes,
  ANTAGONIST_PAIRS,
} from '@/lib/companionScoring';
import type { MasterCrop } from '@/hooks/useMasterCrops';

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
    planting_season: null,
    harvest_days: null,
    companion_crops: null,
    crop_guild: null,
    spacing_inches: null,
    library_note: null,
    description: null,
    scientific_name: null,
    brix_target_min: null,
    brix_target_max: null,
    instrument_type: null,
    hardiness_zone_min: null,
    hardiness_zone_max: null,
    growth_habit: null,
    root_depth_inches: null,
    min_container_gal: null,
    propagation_method: null,
    est_yield_lbs_per_plant: null,
    seed_cost_cents: null,
    created_at: '',
    updated_at: '',
    ...overrides,
  };
}

const tomato = makeCrop({ name: 'Tomato', common_name: 'Tomato', planting_season: ['Spring', 'Summer'], growth_habit: 'vine', companion_crops: ['Basil', 'Carrot', 'Marigold'] });
const basil = makeCrop({ name: 'Basil', common_name: 'Basil', planting_season: ['Spring', 'Summer'], growth_habit: 'herb', companion_crops: ['Tomato'] });
const potato = makeCrop({ name: 'Potato', common_name: 'Potato', planting_season: ['Spring'], growth_habit: 'underground' });
const onion = makeCrop({ name: 'Onion', common_name: 'Onion', planting_season: ['Spring', 'Fall'], growth_habit: 'bulb' });
const bean = makeCrop({ name: 'Bean', common_name: 'Bean', planting_season: ['Spring', 'Summer'], growth_habit: 'vine' });
const fennel = makeCrop({ name: 'Fennel', common_name: 'Fennel', planting_season: ['Spring'], growth_habit: 'herb' });
const carrot = makeCrop({ name: 'Carrot', common_name: 'Carrot', planting_season: ['Spring', 'Fall'], growth_habit: 'underground', companion_crops: ['Tomato', 'Onion'] });
const marigold = makeCrop({ name: 'Marigold', common_name: 'Marigold', planting_season: ['Spring', 'Summer'], growth_habit: 'herb', category: 'Dye/Fiber/Aromatic' });
const lettuce = makeCrop({ name: 'Lettuce', common_name: 'Lettuce', planting_season: ['Spring', 'Fall'], growth_habit: 'herb' });
const corn = makeCrop({ name: 'Corn', common_name: 'Corn', planting_season: ['Spring', 'Summer'], growth_habit: 'upright' });
const cucumber = makeCrop({ name: 'Cucumber', common_name: 'Cucumber', planting_season: ['Spring', 'Summer'], growth_habit: 'vine' });
const sage = makeCrop({ name: 'Sage', common_name: 'Sage', planting_season: ['Spring'], growth_habit: 'herb' });
const mint = makeCrop({ name: 'Mint', common_name: 'Mint', planting_season: ['Spring', 'Summer'], growth_habit: 'herb' });
const parsley = makeCrop({ name: 'Parsley', common_name: 'Parsley', planting_season: ['Spring', 'Fall'], growth_habit: 'herb' });
const unknownCrop = makeCrop({ name: 'ZzUnknownPlant', common_name: 'ZzUnknownPlant' });

/* ─── isAntagonist ─── */

describe('isAntagonist', () => {
  it('detects Tomato ↔ Potato antagonism', () => {
    expect(isAntagonist(tomato, potato)).toBe(true);
  });

  it('is bidirectional (Potato ↔ Tomato)', () => {
    expect(isAntagonist(potato, tomato)).toBe(true);
  });

  it('detects Onion ↔ Bean antagonism (Allium vs Legume)', () => {
    expect(isAntagonist(onion, bean)).toBe(true);
  });

  it('detects Tomato ↔ Fennel antagonism', () => {
    expect(isAntagonist(tomato, fennel)).toBe(true);
  });

  it('detects Tomato ↔ Corn antagonism', () => {
    expect(isAntagonist(tomato, corn)).toBe(true);
  });

  it('detects Sage ↔ Cucumber antagonism', () => {
    expect(isAntagonist(sage, cucumber)).toBe(true);
  });

  it('detects Mint ↔ Parsley antagonism', () => {
    expect(isAntagonist(mint, parsley)).toBe(true);
  });

  it('returns false for compatible crops (Tomato + Basil)', () => {
    expect(isAntagonist(tomato, basil)).toBe(false);
  });

  it('returns false for neutral crops (Lettuce + Marigold)', () => {
    expect(isAntagonist(lettuce, marigold)).toBe(false);
  });

  it('returns false for unknown crops against anything', () => {
    expect(isAntagonist(unknownCrop, tomato)).toBe(false);
  });

  it('handles partial name matching (e.g., "Cherry Tomato" vs Potato)', () => {
    const cherryTomato = makeCrop({ name: 'Cherry Tomato', common_name: 'Cherry Tomato' });
    expect(isAntagonist(cherryTomato, potato)).toBe(true);
  });

  it('covers all antagonist rules have at least two groups', () => {
    for (const rule of ANTAGONIST_PAIRS) {
      expect(rule.groupA.length).toBeGreaterThan(0);
      expect(rule.groupB.length).toBeGreaterThan(0);
    }
  });
});

/* ─── isExplicitCompanion ─── */

describe('isExplicitCompanion', () => {
  it('detects Tomato → Basil companion (A lists B)', () => {
    expect(isExplicitCompanion(tomato, basil)).toBe(true);
  });

  it('detects Basil → Tomato companion (B lists A)', () => {
    expect(isExplicitCompanion(basil, tomato)).toBe(true);
  });

  it('detects bidirectional companion (Carrot ↔ Tomato)', () => {
    expect(isExplicitCompanion(carrot, tomato)).toBe(true);
    expect(isExplicitCompanion(tomato, carrot)).toBe(true);
  });

  it('returns false when neither lists the other', () => {
    expect(isExplicitCompanion(potato, bean)).toBe(false);
  });

  it('returns false for crops with no companion data', () => {
    expect(isExplicitCompanion(unknownCrop, tomato)).toBe(false);
  });

  it('returns false for same crop (should not self-match in practice)', () => {
    // Edge: if both lists contain nothing about themselves
    const isolated = makeCrop({ name: 'Isolated', companion_crops: [] });
    expect(isExplicitCompanion(isolated, isolated)).toBe(false);
  });
});

/* ─── companionScore ─── */

describe('companionScore', () => {
  it('returns 0 when placed list is empty', () => {
    expect(companionScore(tomato, [])).toBe(0);
  });

  it('returns positive score for explicit companion + season overlap', () => {
    const score = companionScore(basil, [tomato]);
    // +5 companion + 2 shared seasons + 1 habit complement (vine+herb) = 8
    expect(score).toBeGreaterThanOrEqual(7);
  });

  it('returns heavy negative for antagonist pair', () => {
    const score = companionScore(potato, [tomato]);
    expect(score).toBeLessThan(0);
    // Should include -15 penalty
    expect(score).toBeLessThanOrEqual(-10);
  });

  it('returns moderate positive for season overlap only (no companion data)', () => {
    const score = companionScore(lettuce, [bean]);
    // 1 shared season (Spring) + maybe habit bonus
    expect(score).toBeGreaterThan(0);
  });

  it('gives habit complement bonus for tree + ground cover', () => {
    const tree = makeCrop({ name: 'Apple Tree', growth_habit: 'tree', planting_season: ['Spring'] });
    const ground = makeCrop({ name: 'Clover', growth_habit: 'ground cover', planting_season: ['Spring'] });
    const score = companionScore(ground, [tree]);
    // +2 habit complement + 1 season overlap = 3+
    expect(score).toBeGreaterThanOrEqual(3);
  });

  it('gives no habit bonus for same growth habit', () => {
    const herb1 = makeCrop({ name: 'HerbA', growth_habit: 'herb', planting_season: ['Spring'] });
    const herb2 = makeCrop({ name: 'HerbB', growth_habit: 'herb', planting_season: ['Spring'] });
    const score = companionScore(herb1, [herb2]);
    // 1 season overlap + 0 habit = 1
    expect(score).toBe(1);
  });

  it('sums across multiple placed crops', () => {
    const score = companionScore(basil, [tomato, lettuce]);
    // Against tomato: companion(+5) + season(+2) + habit(+1) = 8
    // Against lettuce: season(+1) + habit(0, both herb) = 1
    expect(score).toBeGreaterThanOrEqual(8);
  });

  it('antagonist penalty outweighs companion bonus from others', () => {
    // Tomato is companion of basil but antagonist of potato
    const score = companionScore(tomato, [basil, potato]);
    // vs basil: +5 companion + 2 season + 1 habit = 8
    // vs potato: -15 antagonist (skips other scoring)
    expect(score).toBeLessThan(0);
  });

  it('gives neutral (1) score when season data is missing', () => {
    const noSeason = makeCrop({ name: 'NoSeasonCrop', planting_season: null, growth_habit: 'herb' });
    const score = companionScore(noSeason, [tomato]);
    // season: 1 (neutral) + habit complement(vine+herb): 1 = 2
    expect(score).toBeGreaterThanOrEqual(1);
  });
});

/* ─── getSynergyNotes ─── */

describe('getSynergyNotes', () => {
  it('returns companion note for explicit companions', () => {
    const notes = getSynergyNotes(basil, [tomato, lettuce]);
    const companionNotes = notes.filter(n => n.type === 'companion');
    expect(companionNotes.length).toBe(1);
    expect(companionNotes[0].cropName).toBe('Tomato');
    expect(companionNotes[0].message).toContain('Companion of');
  });

  it('returns antagonist note for conflicting crops', () => {
    const notes = getSynergyNotes(tomato, [potato, basil]);
    const antagonistNotes = notes.filter(n => n.type === 'antagonist');
    expect(antagonistNotes.length).toBe(1);
    expect(antagonistNotes[0].cropName).toBe('Potato');
    expect(antagonistNotes[0].message).toContain('Avoid');
  });

  it('skips self in synergy check', () => {
    const notes = getSynergyNotes(tomato, [tomato, basil]);
    // Should not report tomato as companion/antagonist of itself
    const selfNotes = notes.filter(n => n.cropName === 'Tomato');
    expect(selfNotes.length).toBe(0);
  });

  it('returns empty array when no synergies or conflicts', () => {
    const notes = getSynergyNotes(unknownCrop, [lettuce]);
    expect(notes.length).toBe(0);
  });

  it('returns both companion and antagonist notes in same recipe', () => {
    // Tomato is companion of basil, antagonist of potato
    const notes = getSynergyNotes(tomato, [basil, potato]);
    expect(notes.length).toBe(2);
    expect(notes.some(n => n.type === 'companion')).toBe(true);
    expect(notes.some(n => n.type === 'antagonist')).toBe(true);
  });
});
