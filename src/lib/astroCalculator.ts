/**
 * Astronomical chart calculation utility using the Celestine ephemeris library.
 * Provides precise Sun, Moon, and Rising (Ascendant) sign calculations
 * validated against NASA, JPL Horizons & Swiss Ephemeris data.
 */
import { calculateChart } from 'celestine';
import { STATE_COORDINATES } from './stateCoordinates';
import { getTimezoneOffset } from './geocoding';

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
  const parts = formatted.split(' ');
  return parts[parts.length - 1] || 'Aries';
}

function buildSignData(formatted: string) {
  const sign = extractSignName(formatted);
  return {
    sign,
    symbol: SIGN_SYMBOLS[sign] || '♈',
    element: SIGN_ELEMENTS[sign] || 'Fire',
    formatted,
  };
}

/**
 * Calculate a precise birth chart using the Celestine ephemeris library.
 *
 * @param year   - Birth year
 * @param month  - Birth month (1-12)
 * @param day    - Birth day
 * @param hour   - Birth hour (0-23)
 * @param minute - Birth minute (0-59)
 * @param state  - US state name (for timezone + fallback coordinates)
 * @param lat    - Optional precise latitude (from geocoding)
 * @param lon    - Optional precise longitude (from geocoding)
 */
export function calculateBirthChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  state: string,
  lat?: number,
  lon?: number,
): ChartResult {
  const geo = STATE_COORDINATES[state];
  if (!geo) {
    throw new Error(`Unknown state: ${state}`);
  }

  // Use geocoded coordinates if available, otherwise fall back to state center
  const useLat = lat ?? geo.lat;
  const useLon = lon ?? geo.lon;

  // Calculate DST-aware timezone offset for the actual birth date
  const birthDate = new Date(year, month - 1, day, hour, minute);
  let tz: number;
  try {
    tz = getTimezoneOffset(geo.timezone, birthDate);
  } catch {
    // Fallback to static offset if IANA lookup fails
    tz = geo.tz;
  }

  const chart = calculateChart({
    year,
    month,
    day,
    hour,
    minute,
    second: 0,
    timezone: tz,
    latitude: useLat,
    longitude: useLon,
  });

  // Extract Sun
  const sunPlanet = chart.planets.find(p => p.name === 'Sun') || chart.planets[0];
  // Extract Moon
  const moonPlanet = chart.planets.find(p => p.name === 'Moon');
  // Extract Rising (Ascendant)
  const risingFormatted = chart.angles.ascendant.formatted;

  return {
    sun: buildSignData(sunPlanet.formatted),
    moon: buildSignData(moonPlanet?.formatted || sunPlanet.formatted),
    rising: buildSignData(risingFormatted),
    precise: true,
  };
}
