import { describe, it, expect } from 'vitest';
import { getLunarPhase, isCropLunarReady, isZoneInSeason } from '@/hooks/useLunarPhase';

describe('Lunar Phase Calculator', () => {
  it('returns a valid phase object for today', () => {
    const phase = getLunarPhase();
    expect(phase).toBeDefined();
    expect(phase.phase).toBeTruthy();
    expect(phase.phaseLabel).toBeTruthy();
    expect(phase.phaseEmoji).toBeTruthy();
    expect(phase.dayInCycle).toBeGreaterThanOrEqual(0);
    expect(phase.dayInCycle).toBeLessThan(30);
    expect(phase.illumination).toBeGreaterThanOrEqual(0);
    expect(phase.illumination).toBeLessThanOrEqual(1);
  });

  it('returns a valid zodiac sign', () => {
    const phase = getLunarPhase();
    const validSigns = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
    expect(validSigns).toContain(phase.zodiacSign);
    expect(phase.zodiacSymbol).toBeTruthy();
  });

  it('returns a valid planting type', () => {
    const phase = getLunarPhase();
    const validTypes = ['leaf', 'fruit', 'harvest', 'root'];
    expect(validTypes).toContain(phase.plantingType);
    expect(phase.plantingLabel).toBeTruthy();
  });

  it('seasonal movement has valid structure', () => {
    const phase = getLunarPhase();
    expect(phase.seasonalMovement).toBeDefined();
    expect([0, 1, 2, 3]).toContain(phase.seasonalMovement.phase);
    expect(phase.seasonalMovement.name).toBeTruthy();
  });

  it('returns consistent results for the same date', () => {
    const d = new Date(2025, 5, 15); // June 15, 2025
    const a = getLunarPhase(d);
    const b = getLunarPhase(d);
    expect(a.phase).toBe(b.phase);
    expect(a.dayInCycle).toBe(b.dayInCycle);
  });
});

describe('isCropLunarReady', () => {
  it('harvest phase accepts all crops', () => {
    expect(isCropLunarReady('Sustenance', 'Tomato', 'harvest')).toBe(true);
  });

  it('leaf phase matches leafy greens', () => {
    expect(isCropLunarReady('greens', 'Lettuce', 'leaf')).toBe(true);
  });

  it('root phase matches root crops', () => {
    expect(isCropLunarReady('root', 'Carrot', 'root')).toBe(true);
  });

  it('fruit phase matches nightshades', () => {
    expect(isCropLunarReady('nightshade', 'Tomato', 'fruit')).toBe(true);
  });
});

describe('isZoneInSeason', () => {
  const coolOctave = { phase: 1, name: 'Cool', dateRange: '', frequencyRange: '', focus: '', active: true };
  const solarPeak = { phase: 2, name: 'Solar', dateRange: '', frequencyRange: '', focus: '', active: true };

  it('cool octave allows 396Hz', () => {
    expect(isZoneInSeason(396, coolOctave)).toBe(true);
  });

  it('cool octave rejects 528Hz', () => {
    expect(isZoneInSeason(528, coolOctave)).toBe(false);
  });

  it('solar peak allows 639Hz', () => {
    expect(isZoneInSeason(639, solarPeak)).toBe(true);
  });

  it('inactive movement allows everything', () => {
    const inactive = { ...coolOctave, active: false };
    expect(isZoneInSeason(963, inactive)).toBe(true);
  });
});
