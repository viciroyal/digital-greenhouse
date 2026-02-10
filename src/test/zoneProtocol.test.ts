import { describe, it, expect } from 'vitest';
import { CROP_INSTRUMENT_MAPPING, type InstrumentType } from '@/data/cropInstrumentMapping';

describe('Zone Protocol Data Integrity', () => {
  const VALID_HZ = [396, 417, 528, 639, 741, 852, 963];
  const VALID_INSTRUMENTS: InstrumentType[] = [
    'Electric Guitar',
    'Percussion/Drums',
    'Horn Section',
    'Bass/Sub-Frequency',
    'Synthesizers/Keys',
  ];

  it('instrument mapping has entries for all major crop families', () => {
    expect(CROP_INSTRUMENT_MAPPING.length).toBeGreaterThanOrEqual(5);
  });

  it('each mapping has a valid instrument type', () => {
    CROP_INSTRUMENT_MAPPING.forEach(mapping => {
      expect(VALID_INSTRUMENTS).toContain(mapping.instrument);
    });
  });

  it('each mapping has frequency affinities within valid range', () => {
    CROP_INSTRUMENT_MAPPING.forEach(mapping => {
      mapping.frequencyAffinity.forEach(hz => {
        expect(VALID_HZ).toContain(hz);
      });
    });
  });

  it('each mapping has crops, a role, and a color', () => {
    CROP_INSTRUMENT_MAPPING.forEach(mapping => {
      expect(mapping.crops.length).toBeGreaterThan(0);
      expect(mapping.role).toBeTruthy();
      expect(mapping.color).toMatch(/^hsl\(/);
    });
  });
});

describe('7-Zone Octave Completeness', () => {
  const ZONES = [
    { hz: 396, name: 'Foundation', note: 'C' },
    { hz: 417, name: 'Flow', note: 'D' },
    { hz: 528, name: 'Alchemy', note: 'E' },
    { hz: 639, name: 'Heart', note: 'F' },
    { hz: 741, name: 'Signal', note: 'G' },
    { hz: 852, name: 'Vision', note: 'A' },
    { hz: 963, name: 'Source', note: 'B' },
  ];

  it('has exactly 7 zones', () => {
    expect(ZONES).toHaveLength(7);
  });

  it('frequencies increase monotonically', () => {
    for (let i = 1; i < ZONES.length; i++) {
      expect(ZONES[i].hz).toBeGreaterThan(ZONES[i - 1].hz);
    }
  });

  it('notes span C through B (the musical octave)', () => {
    const notes = ZONES.map(z => z.note);
    expect(notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });
});
