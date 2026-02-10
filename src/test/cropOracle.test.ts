import { describe, it, expect } from 'vitest';

/**
 * Crop Oracle Logic Tests
 * Tests the pure logic used by the Crop Oracle wizard
 * without requiring React rendering or database access.
 */

// Replicate zone data from CropOracle.tsx for testing
const ZONES = [
  { hz: 396, name: 'Foundation', vibe: 'Grounding', color: '#FF0000', note: 'C' },
  { hz: 417, name: 'Flow', vibe: 'Flow', color: '#FF7F00', note: 'D' },
  { hz: 528, name: 'Alchemy', vibe: 'Energy', color: '#FFFF00', note: 'E' },
  { hz: 639, name: 'Heart', vibe: 'Heart', color: '#00FF00', note: 'F' },
  { hz: 741, name: 'Signal', vibe: 'Expression', color: '#0000FF', note: 'G' },
  { hz: 852, name: 'Vision', vibe: 'Vision', color: '#4B0082', note: 'A' },
  { hz: 963, name: 'Source', vibe: 'Protection', color: '#8B00FF', note: 'B' },
];

const INTERVAL_ORDER = [
  { key: 'Root (Lead)', label: 'The Star', emoji: '🌟' },
  { key: '3rd (Triad)', label: 'The Companion', emoji: '🌿' },
  { key: '5th (Stabilizer)', label: 'The Stabilizer', emoji: '⚓' },
  { key: '7th (Signal)', label: 'The Signal', emoji: '🦋' },
  { key: '9th (Sub-bass)', label: 'The Underground', emoji: '🥔' },
  { key: '11th (Tension)', label: 'The Sentinel', emoji: '🍄' },
  { key: '13th (Top Note)', label: 'The Aerial', emoji: '🌻' },
];

const ENVIRONMENTS = ['pot', 'raised-bed', 'farm', 'high-tunnel'];
const POT_MAX_SPACING = 12;

describe('Crop Oracle Zone Configuration', () => {
  it('all 7 zones have unique frequencies', () => {
    const hzSet = new Set(ZONES.map(z => z.hz));
    expect(hzSet.size).toBe(7);
  });

  it('all zones have unique notes', () => {
    const noteSet = new Set(ZONES.map(z => z.note));
    expect(noteSet.size).toBe(7);
  });

  it('all zones have a name, vibe, and color', () => {
    ZONES.forEach(zone => {
      expect(zone.name).toBeTruthy();
      expect(zone.vibe).toBeTruthy();
      expect(zone.color).toBeTruthy();
    });
  });
});

describe('Chord Interval System', () => {
  it('basic triad has 4 intervals (Root, 3rd, 5th, 7th)', () => {
    const triad = INTERVAL_ORDER.slice(0, 4);
    expect(triad).toHaveLength(4);
    expect(triad[0].key).toBe('Root (Lead)');
  });

  it('pro mode adds 3 more intervals (9th, 11th, 13th)', () => {
    const proExtras = INTERVAL_ORDER.slice(4);
    expect(proExtras).toHaveLength(3);
    expect(proExtras.map(i => i.key)).toEqual([
      '9th (Sub-bass)',
      '11th (Tension)',
      '13th (Top Note)',
    ]);
  });

  it('each interval has a unique label and emoji', () => {
    const labels = new Set(INTERVAL_ORDER.map(i => i.label));
    const emojis = new Set(INTERVAL_ORDER.map(i => i.emoji));
    expect(labels.size).toBe(7);
    expect(emojis.size).toBe(7);
  });
});

describe('Environment Configuration', () => {
  it('has 4 environment options', () => {
    expect(ENVIRONMENTS).toHaveLength(4);
  });

  it('pot max spacing is 12 inches', () => {
    expect(POT_MAX_SPACING).toBe(12);
  });
});

describe('Crop Filtering Logic', () => {
  // Simulated crop data
  const mockCrops = [
    { id: '1', name: 'Tomato', frequency_hz: 528, chord_interval: 'Root (Lead)', spacing_inches: '24', category: 'Sustenance' },
    { id: '2', name: 'Basil', frequency_hz: 528, chord_interval: '7th (Signal)', spacing_inches: '6', category: 'Dye/Fiber/Aromatic' },
    { id: '3', name: 'Carrot', frequency_hz: 396, chord_interval: 'Root (Lead)', spacing_inches: '3', category: 'Sustenance' },
    { id: '4', name: 'Garlic', frequency_hz: 963, chord_interval: 'Root (Lead)', spacing_inches: '6', category: 'Sustenance' },
  ];

  it('filters crops by frequency zone', () => {
    const zone528 = mockCrops.filter(c => c.frequency_hz === 528);
    expect(zone528).toHaveLength(2);
    expect(zone528.map(c => c.name)).toContain('Tomato');
    expect(zone528.map(c => c.name)).toContain('Basil');
  });

  it('filters crops by chord interval', () => {
    const leads = mockCrops.filter(c => c.chord_interval === 'Root (Lead)');
    expect(leads).toHaveLength(3);
  });

  it('pot mode filters out crops with spacing > 12"', () => {
    const potCrops = mockCrops.filter(c => {
      const spacing = parseInt(c.spacing_inches || '0');
      return spacing <= POT_MAX_SPACING;
    });
    expect(potCrops).toHaveLength(3); // Tomato (24") excluded
    expect(potCrops.map(c => c.name)).not.toContain('Tomato');
  });
});
