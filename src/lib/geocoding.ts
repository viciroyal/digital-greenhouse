/**
 * Geocoding utility using OpenStreetMap Nominatim (free, no API key).
 * Returns precise lat/lon for a city + state combination.
 */

export interface GeoResult {
  lat: number;
  lon: number;
  displayName: string;
}

/**
 * Geocode a city + state query via Nominatim.
 * Falls back to null if the lookup fails or returns no results.
 */
export async function geocodeCity(
  city: string,
  state: string
): Promise<GeoResult | null> {
  if (!city.trim()) return null;

  const query = `${city.trim()}, ${state}, United States`;
  const url = `https://nominatim.openstreetmap.org/search?` +
    new URLSearchParams({
      q: query,
      format: 'json',
      limit: '1',
      countrycodes: 'us',
    });

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'PharmBoi-StarMapping/1.0' },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch {
    return null;
  }
}

/**
 * Calculate the UTC offset (in fractional hours) for a given IANA timezone
 * at a specific date. Handles DST automatically.
 */
export function getTimezoneOffset(timezone: string, date: Date): number {
  const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const tzStr = date.toLocaleString('en-US', { timeZone: timezone });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
}
