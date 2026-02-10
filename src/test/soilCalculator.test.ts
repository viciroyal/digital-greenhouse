import { describe, it, expect } from 'vitest';
import {
  MASTER_MIX_PROTOCOL,
  BASE_AREA_SQ_FT,
  FREQUENCY_PROTOCOLS,
  HARMONIZATION_RULES,
  POT_MIX_RECIPE,
  CONTAINER_SIZES,
  formatQuantity,
  formatVolume,
} from '@/components/almanac/engines/soil/soilConstants';

describe('Soil Calculator Constants', () => {
  it('Master Mix has exactly 8 components', () => {
    expect(MASTER_MIX_PROTOCOL).toHaveLength(8);
  });

  it('base reference area is 150 sq ft (60ft × 2.5ft)', () => {
    expect(BASE_AREA_SQ_FT).toBe(150);
  });

  it('all 7 frequency zones are defined', () => {
    const zones = Object.keys(FREQUENCY_PROTOCOLS).map(Number);
    expect(zones).toEqual([396, 417, 528, 639, 741, 852, 963]);
  });

  it('each frequency zone has a mineral and soil note', () => {
    Object.values(FREQUENCY_PROTOCOLS).forEach(zone => {
      expect(zone.mineral).toBeTruthy();
      expect(zone.soilNote).toBeTruthy();
      expect(zone.name).toBeTruthy();
      expect(zone.color).toBeTruthy();
    });
  });

  it('Pot Mix recipe totals 100%', () => {
    const total = POT_MIX_RECIPE.reduce((sum, c) => sum + c.percentage, 0);
    expect(total).toBe(100);
  });

  it('container sizes include standard 1-25 gallon + custom', () => {
    expect(CONTAINER_SIZES.length).toBeGreaterThanOrEqual(9);
    expect(CONTAINER_SIZES.find(c => c.id === 'custom')).toBeDefined();
    expect(CONTAINER_SIZES.find(c => c.id === '5gal')?.gallons).toBe(5);
  });
});

describe('Soil Mix Scaling', () => {
  it('scales Master Mix linearly by area ratio', () => {
    const scaleFactor = 75 / BASE_AREA_SQ_FT; // half-size bed
    expect(scaleFactor).toBeCloseTo(0.5, 1);

    const proMix = MASTER_MIX_PROTOCOL.find(c => c.id === 'promix')!;
    const scaledQuarts = proMix.baseQuarts * scaleFactor;
    expect(scaledQuarts).toBeCloseTo(2.5, 1);
  });

  it('frequency boost doubles specific components', () => {
    const boosted = MASTER_MIX_PROTOCOL.filter(c =>
      c.frequencyBoost?.includes(528)
    );
    // Alfalfa and Soybean get 2× for 528Hz Solar zone
    expect(boosted.length).toBe(2);
    expect(boosted.map(c => c.id)).toContain('alfalfa');
    expect(boosted.map(c => c.id)).toContain('soybean');
  });
});

describe('Harmonization Rules', () => {
  it('has at least 5 dependency rules', () => {
    expect(HARMONIZATION_RULES.length).toBeGreaterThanOrEqual(5);
  });

  it('each rule references valid frequency zones', () => {
    const validHz = Object.keys(FREQUENCY_PROTOCOLS).map(Number);
    HARMONIZATION_RULES.forEach(rule => {
      expect(validHz).toContain(rule.requiredHz);
      expect(validHz).toContain(rule.dependsOnHz);
    });
  });

  it('528Hz Solar depends on 396Hz Root', () => {
    const rule = HARMONIZATION_RULES.find(r => r.id === 'root_foundation');
    expect(rule).toBeDefined();
    expect(rule!.requiredHz).toBe(528);
    expect(rule!.dependsOnHz).toBe(396);
  });
});

describe('formatQuantity', () => {
  it('formats small amounts as tbsp', () => {
    const result = formatQuantity(0.1);
    expect(result).toContain('tbsp');
  });

  it('formats sub-quart as cups', () => {
    const result = formatQuantity(0.5);
    expect(result).toContain('cup');
  });

  it('formats 1+ as quarts', () => {
    expect(formatQuantity(1)).toBe('1 quart');
    expect(formatQuantity(2.5)).toBe('2.5 quarts');
  });
});

describe('formatVolume', () => {
  it('formats small volumes as cups', () => {
    const result = formatVolume(0.13, 10); // tiny pot, 10% share
    expect(result).toContain('cup');
  });

  it('formats larger volumes as gallons', () => {
    const result = formatVolume(2.67, 50); // 20gal pot, 50%
    expect(result).toContain('gal');
  });
});
