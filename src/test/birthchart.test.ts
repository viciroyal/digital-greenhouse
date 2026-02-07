import { describe, it, expect } from 'vitest';
import { calculateBirthChart } from '../lib/astroCalculator';

describe('Birth chart calibration', () => {
  it('Oct 22 2003 1:30 PM Cheverly MD → Libra Sun, Virgo Moon, Capricorn Rising', () => {
    const chart = calculateBirthChart(
      2003, 10, 22, 13, 30, 'Maryland',
      38.9209, -76.9161
    );

    expect(chart.sun.sign).toBe('Libra');
    expect(chart.moon.sign).toBe('Virgo');
    expect(chart.rising.sign).toBe('Capricorn');
  });

  it('Oct 22 2003 1:30 AM Cheverly MD → Libra Sun, Virgo Moon, Leo Rising', () => {
    const chart = calculateBirthChart(
      2003, 10, 22, 1, 30, 'Maryland',
      38.9209, -76.9161
    );

    expect(chart.sun.sign).toBe('Libra');
    expect(chart.moon.sign).toBe('Virgo');
    expect(chart.rising.sign).toBe('Leo');
  });
});
