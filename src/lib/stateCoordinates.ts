/**
 * US State coordinates, timezone mapping, and IANA timezone names
 * for astronomical calculations.
 * Coordinates represent approximate state capital/major city locations.
 */

export interface StateGeo {
  lat: number;
  lon: number;
  tz: number;       // UTC offset (standard time, used as fallback)
  timezone: string;  // IANA timezone name for DST-aware offset calculation
}

export const STATE_COORDINATES: Record<string, StateGeo> = {
  'Alabama':        { lat: 32.3777, lon: -86.3006, tz: -6, timezone: 'America/Chicago' },
  'Alaska':         { lat: 64.2008, lon: -152.4937, tz: -9, timezone: 'America/Anchorage' },
  'Arizona':        { lat: 33.4484, lon: -112.0740, tz: -7, timezone: 'America/Phoenix' },
  'Arkansas':       { lat: 34.7465, lon: -92.2896, tz: -6, timezone: 'America/Chicago' },
  'California':     { lat: 36.7783, lon: -119.4179, tz: -8, timezone: 'America/Los_Angeles' },
  'Colorado':       { lat: 39.7392, lon: -104.9903, tz: -7, timezone: 'America/Denver' },
  'Connecticut':    { lat: 41.7658, lon: -72.6734, tz: -5, timezone: 'America/New_York' },
  'Delaware':       { lat: 39.1582, lon: -75.5244, tz: -5, timezone: 'America/New_York' },
  'Florida':        { lat: 30.4383, lon: -84.2807, tz: -5, timezone: 'America/New_York' },
  'Georgia':        { lat: 33.7490, lon: -84.3880, tz: -5, timezone: 'America/New_York' },
  'Hawaii':         { lat: 19.8968, lon: -155.5828, tz: -10, timezone: 'Pacific/Honolulu' },
  'Idaho':          { lat: 43.6150, lon: -116.2023, tz: -7, timezone: 'America/Boise' },
  'Illinois':       { lat: 39.7817, lon: -89.6501, tz: -6, timezone: 'America/Chicago' },
  'Indiana':        { lat: 39.7684, lon: -86.1581, tz: -5, timezone: 'America/Indiana/Indianapolis' },
  'Iowa':           { lat: 41.5868, lon: -93.6250, tz: -6, timezone: 'America/Chicago' },
  'Kansas':         { lat: 39.0119, lon: -98.4842, tz: -6, timezone: 'America/Chicago' },
  'Kentucky':       { lat: 38.2009, lon: -84.8733, tz: -5, timezone: 'America/New_York' },
  'Louisiana':      { lat: 30.4515, lon: -91.1871, tz: -6, timezone: 'America/Chicago' },
  'Maine':          { lat: 44.3106, lon: -69.7795, tz: -5, timezone: 'America/New_York' },
  'Maryland':       { lat: 39.0458, lon: -76.6413, tz: -5, timezone: 'America/New_York' },
  'Massachusetts':  { lat: 42.4072, lon: -71.3824, tz: -5, timezone: 'America/New_York' },
  'Michigan':       { lat: 42.7325, lon: -84.5555, tz: -5, timezone: 'America/Detroit' },
  'Minnesota':      { lat: 44.9778, lon: -93.2650, tz: -6, timezone: 'America/Chicago' },
  'Mississippi':    { lat: 32.2988, lon: -90.1848, tz: -6, timezone: 'America/Chicago' },
  'Missouri':       { lat: 38.5767, lon: -92.1736, tz: -6, timezone: 'America/Chicago' },
  'Montana':        { lat: 46.8797, lon: -110.3626, tz: -7, timezone: 'America/Denver' },
  'Nebraska':       { lat: 40.8136, lon: -96.7026, tz: -6, timezone: 'America/Chicago' },
  'Nevada':         { lat: 39.1638, lon: -119.7674, tz: -8, timezone: 'America/Los_Angeles' },
  'New Hampshire':  { lat: 43.1939, lon: -71.5724, tz: -5, timezone: 'America/New_York' },
  'New Jersey':     { lat: 40.0583, lon: -74.4057, tz: -5, timezone: 'America/New_York' },
  'New Mexico':     { lat: 35.6870, lon: -105.9378, tz: -7, timezone: 'America/Denver' },
  'New York':       { lat: 40.7128, lon: -74.0060, tz: -5, timezone: 'America/New_York' },
  'North Carolina': { lat: 35.7796, lon: -78.6382, tz: -5, timezone: 'America/New_York' },
  'North Dakota':   { lat: 46.8083, lon: -100.7837, tz: -6, timezone: 'America/Chicago' },
  'Ohio':           { lat: 39.9612, lon: -82.9988, tz: -5, timezone: 'America/New_York' },
  'Oklahoma':       { lat: 35.4676, lon: -97.5164, tz: -6, timezone: 'America/Chicago' },
  'Oregon':         { lat: 44.9429, lon: -123.0351, tz: -8, timezone: 'America/Los_Angeles' },
  'Pennsylvania':   { lat: 40.2732, lon: -76.8867, tz: -5, timezone: 'America/New_York' },
  'Rhode Island':   { lat: 41.8240, lon: -71.4128, tz: -5, timezone: 'America/New_York' },
  'South Carolina': { lat: 34.0007, lon: -81.0348, tz: -5, timezone: 'America/New_York' },
  'South Dakota':   { lat: 44.3683, lon: -100.3510, tz: -6, timezone: 'America/Chicago' },
  'Tennessee':      { lat: 36.1627, lon: -86.7816, tz: -6, timezone: 'America/Chicago' },
  'Texas':          { lat: 30.2672, lon: -97.7431, tz: -6, timezone: 'America/Chicago' },
  'Utah':           { lat: 40.7608, lon: -111.8910, tz: -7, timezone: 'America/Denver' },
  'Vermont':        { lat: 44.2601, lon: -72.5754, tz: -5, timezone: 'America/New_York' },
  'Virginia':       { lat: 37.5407, lon: -77.4360, tz: -5, timezone: 'America/New_York' },
  'Washington':     { lat: 47.6062, lon: -122.3321, tz: -8, timezone: 'America/Los_Angeles' },
  'West Virginia':  { lat: 38.3498, lon: -81.6326, tz: -5, timezone: 'America/New_York' },
  'Wisconsin':      { lat: 43.0731, lon: -89.4012, tz: -6, timezone: 'America/Chicago' },
  'Wyoming':        { lat: 41.1400, lon: -104.8202, tz: -7, timezone: 'America/Denver' },
};
