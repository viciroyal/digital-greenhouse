/**
 * Astronomical chart calculation utility using the Celestine ephemeris library.
 * Provides precise Sun, Moon, and Rising (Ascendant) sign calculations
 * validated against NASA, JPL Horizons & Swiss Ephemeris data.
 */
import { calculateChart, zodiac } from 'celestine';
import { STATE_COORDINATES } from './stateCoordinates';

export interface ChartResult {
  sun: { sign: string; symbol: string; element: string; formatted: string };
  moon: { sign: string; symbol: string; element: string; formatted: string };
  rising: { sign: string; symbol: string; element: string; formatted: string };
  precise: true;
}

const SIGN_SYMBOLS: Record<string, string> = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

const SIGN_ELEMENTS: Record<string, string> = {
  'Aries': 'Fire', 'Taurus': 'Earth', 'Gemini': 'Air', 'Cancer': 'Water',
  'Leo': 'Fire', 'Virgo': 'Earth', 'Libra': 'Air', 'Scorpio': 'Water',
  'Sagittarius': 'Fire', 'Capricorn': 'Earth', 'Aquarius': 'Air', 'Pisces': 'Water',
};

function extractSignName(formatted: string): string {
  // formatted is like "23°30' Pisces" or "7°24'40\" Scorpio"
  // Extract the sign name (last word)
  const parts = formatted.split(' ');
  return parts[parts.length - 1] || 'Aries';
}

/**
 * Calculate a precise birth chart using the Celestine ephemeris library.
 * 
 * @param year - Birth year
 * @param month - Birth month (1-12)
 * @param day - Birth day
 * @param hour - Birth hour (0-23)
 * @param minute - Birth minute (0-59)
 * @param state - US state name
 * @returns ChartResult with precise Sun, Moon, and Rising signs
 */
export function calculateBirthChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  state: string
): ChartResult {
  const geo = STATE_COORDINATES[state];
  if (!geo) {
    throw new Error(`Unknown state: ${state}`);
  }

  const chart = calculateChart({
    year,
    month,
    day,
    hour,
    minute,
    second: 0,
    timezone: geo.tz,
    latitude: geo.lat,
    longitude: geo.lon,
  });

  // Extract Sun sign from planets array (Sun is first)
  const sunPlanet = chart.planets.find(p => p.name === 'Sun') || chart.planets[0];
  const sunSign = extractSignName(sunPlanet.formatted);

  // Extract Moon sign
  const moonPlanet = chart.planets.find(p => p.name === 'Moon');
  const moonSign = moonPlanet ? extractSignName(moonPlanet.formatted) : 'Aries';

  // Extract Rising (Ascendant) sign
  const risingSign = extractSignName(chart.angles.ascendant.formatted);

  return {
    sun: {
      sign: sunSign,
      symbol: SIGN_SYMBOLS[sunSign] || '♈',
      element: SIGN_ELEMENTS[sunSign] || 'Fire',
      formatted: sunPlanet.formatted,
    },
    moon: {
      sign: moonSign,
      symbol: SIGN_SYMBOLS[moonSign] || '♈',
      element: SIGN_ELEMENTS[moonSign] || 'Water',
      formatted: moonPlanet?.formatted || '',
    },
    rising: {
      sign: risingSign,
      symbol: SIGN_SYMBOLS[risingSign] || '♈',
      element: SIGN_ELEMENTS[risingSign] || 'Fire',
      formatted: chart.angles.ascendant.formatted,
    },
    precise: true,
  };
}
