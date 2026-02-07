/**
 * US State coordinates and timezone mapping for astronomical calculations.
 * Coordinates represent approximate state capital/major city locations.
 */

interface StateGeo {
  lat: number;
  lon: number;
  tz: number; // UTC offset (standard time)
}

export const STATE_COORDINATES: Record<string, StateGeo> = {
  'Alabama': { lat: 32.3777, lon: -86.3006, tz: -6 },
  'Alaska': { lat: 64.2008, lon: -152.4937, tz: -9 },
  'Arizona': { lat: 33.4484, lon: -112.0740, tz: -7 },
  'Arkansas': { lat: 34.7465, lon: -92.2896, tz: -6 },
  'California': { lat: 36.7783, lon: -119.4179, tz: -8 },
  'Colorado': { lat: 39.7392, lon: -104.9903, tz: -7 },
  'Connecticut': { lat: 41.7658, lon: -72.6734, tz: -5 },
  'Delaware': { lat: 39.1582, lon: -75.5244, tz: -5 },
  'Florida': { lat: 30.4383, lon: -84.2807, tz: -5 },
  'Georgia': { lat: 33.7490, lon: -84.3880, tz: -5 },
  'Hawaii': { lat: 19.8968, lon: -155.5828, tz: -10 },
  'Idaho': { lat: 43.6150, lon: -116.2023, tz: -7 },
  'Illinois': { lat: 39.7817, lon: -89.6501, tz: -6 },
  'Indiana': { lat: 39.7684, lon: -86.1581, tz: -5 },
  'Iowa': { lat: 41.5868, lon: -93.6250, tz: -6 },
  'Kansas': { lat: 39.0119, lon: -98.4842, tz: -6 },
  'Kentucky': { lat: 38.2009, lon: -84.8733, tz: -5 },
  'Louisiana': { lat: 30.4515, lon: -91.1871, tz: -6 },
  'Maine': { lat: 44.3106, lon: -69.7795, tz: -5 },
  'Maryland': { lat: 39.0458, lon: -76.6413, tz: -5 },
  'Massachusetts': { lat: 42.4072, lon: -71.3824, tz: -5 },
  'Michigan': { lat: 42.7325, lon: -84.5555, tz: -5 },
  'Minnesota': { lat: 44.9778, lon: -93.2650, tz: -6 },
  'Mississippi': { lat: 32.2988, lon: -90.1848, tz: -6 },
  'Missouri': { lat: 38.5767, lon: -92.1736, tz: -6 },
  'Montana': { lat: 46.8797, lon: -110.3626, tz: -7 },
  'Nebraska': { lat: 40.8136, lon: -96.7026, tz: -6 },
  'Nevada': { lat: 39.1638, lon: -119.7674, tz: -8 },
  'New Hampshire': { lat: 43.1939, lon: -71.5724, tz: -5 },
  'New Jersey': { lat: 40.0583, lon: -74.4057, tz: -5 },
  'New Mexico': { lat: 35.6870, lon: -105.9378, tz: -7 },
  'New York': { lat: 40.7128, lon: -74.0060, tz: -5 },
  'North Carolina': { lat: 35.7796, lon: -78.6382, tz: -5 },
  'North Dakota': { lat: 46.8083, lon: -100.7837, tz: -6 },
  'Ohio': { lat: 39.9612, lon: -82.9988, tz: -5 },
  'Oklahoma': { lat: 35.4676, lon: -97.5164, tz: -6 },
  'Oregon': { lat: 44.9429, lon: -123.0351, tz: -8 },
  'Pennsylvania': { lat: 40.2732, lon: -76.8867, tz: -5 },
  'Rhode Island': { lat: 41.8240, lon: -71.4128, tz: -5 },
  'South Carolina': { lat: 34.0007, lon: -81.0348, tz: -5 },
  'South Dakota': { lat: 44.3683, lon: -100.3510, tz: -6 },
  'Tennessee': { lat: 36.1627, lon: -86.7816, tz: -6 },
  'Texas': { lat: 30.2672, lon: -97.7431, tz: -6 },
  'Utah': { lat: 40.7608, lon: -111.8910, tz: -7 },
  'Vermont': { lat: 44.2601, lon: -72.5754, tz: -5 },
  'Virginia': { lat: 37.5407, lon: -77.4360, tz: -5 },
  'Washington': { lat: 47.6062, lon: -122.3321, tz: -8 },
  'West Virginia': { lat: 38.3498, lon: -81.6326, tz: -5 },
  'Wisconsin': { lat: 43.0731, lon: -89.4012, tz: -6 },
  'Wyoming': { lat: 41.1400, lon: -104.8202, tz: -7 },
};
