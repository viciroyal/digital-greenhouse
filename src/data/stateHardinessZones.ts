/**
 * Predominant USDA Hardiness Zone for each US state.
 * These represent the most common zone across each state's populated areas.
 * Sub-zones (a/b) are included for accuracy.
 */

export interface StateZoneInfo {
  zone: number;      // Integer zone for filtering (e.g. 8)
  subZone: string;   // Display label (e.g. "8b")
  label: string;     // Full label (e.g. "Zone 8b")
  abbr: string;      // Two-letter abbreviation (e.g. "GA")
}

export const STATE_HARDINESS_ZONES: Record<string, StateZoneInfo> = {
  'Alabama':        { zone: 8, subZone: '8a', label: 'Zone 8a', abbr: 'AL' },
  'Alaska':         { zone: 4, subZone: '4a', label: 'Zone 4a', abbr: 'AK' },
  'Arizona':        { zone: 9, subZone: '9b', label: 'Zone 9b', abbr: 'AZ' },
  'Arkansas':       { zone: 7, subZone: '7b', label: 'Zone 7b', abbr: 'AR' },
  'California':     { zone: 9, subZone: '9b', label: 'Zone 9b', abbr: 'CA' },
  'Colorado':       { zone: 5, subZone: '5b', label: 'Zone 5b', abbr: 'CO' },
  'Connecticut':    { zone: 6, subZone: '6b', label: 'Zone 6b', abbr: 'CT' },
  'Delaware':       { zone: 7, subZone: '7a', label: 'Zone 7a', abbr: 'DE' },
  'Florida':        { zone: 9, subZone: '9b', label: 'Zone 9b', abbr: 'FL' },
  'Georgia':        { zone: 8, subZone: '8b', label: 'Zone 8b', abbr: 'GA' },
  'Hawaii':         { zone: 11, subZone: '11a', label: 'Zone 11a', abbr: 'HI' },
  'Idaho':          { zone: 6, subZone: '6b', label: 'Zone 6b', abbr: 'ID' },
  'Illinois':       { zone: 6, subZone: '6a', label: 'Zone 6a', abbr: 'IL' },
  'Indiana':        { zone: 6, subZone: '6a', label: 'Zone 6a', abbr: 'IN' },
  'Iowa':           { zone: 5, subZone: '5b', label: 'Zone 5b', abbr: 'IA' },
  'Kansas':         { zone: 6, subZone: '6b', label: 'Zone 6b', abbr: 'KS' },
  'Kentucky':       { zone: 6, subZone: '6b', label: 'Zone 6b', abbr: 'KY' },
  'Louisiana':      { zone: 9, subZone: '9a', label: 'Zone 9a', abbr: 'LA' },
  'Maine':          { zone: 5, subZone: '5a', label: 'Zone 5a', abbr: 'ME' },
  'Maryland':       { zone: 7, subZone: '7a', label: 'Zone 7a', abbr: 'MD' },
  'Massachusetts':  { zone: 6, subZone: '6b', label: 'Zone 6b', abbr: 'MA' },
  'Michigan':       { zone: 6, subZone: '6a', label: 'Zone 6a', abbr: 'MI' },
  'Minnesota':      { zone: 4, subZone: '4b', label: 'Zone 4b', abbr: 'MN' },
  'Mississippi':    { zone: 8, subZone: '8a', label: 'Zone 8a', abbr: 'MS' },
  'Missouri':       { zone: 6, subZone: '6b', label: 'Zone 6b', abbr: 'MO' },
  'Montana':        { zone: 4, subZone: '4b', label: 'Zone 4b', abbr: 'MT' },
  'Nebraska':       { zone: 5, subZone: '5b', label: 'Zone 5b', abbr: 'NE' },
  'Nevada':         { zone: 7, subZone: '7a', label: 'Zone 7a', abbr: 'NV' },
  'New Hampshire':  { zone: 5, subZone: '5b', label: 'Zone 5b', abbr: 'NH' },
  'New Jersey':     { zone: 7, subZone: '7a', label: 'Zone 7a', abbr: 'NJ' },
  'New Mexico':     { zone: 7, subZone: '7a', label: 'Zone 7a', abbr: 'NM' },
  'New York':       { zone: 6, subZone: '6a', label: 'Zone 6a', abbr: 'NY' },
  'North Carolina': { zone: 7, subZone: '7b', label: 'Zone 7b', abbr: 'NC' },
  'North Dakota':   { zone: 4, subZone: '4a', label: 'Zone 4a', abbr: 'ND' },
  'Ohio':           { zone: 6, subZone: '6a', label: 'Zone 6a', abbr: 'OH' },
  'Oklahoma':       { zone: 7, subZone: '7a', label: 'Zone 7a', abbr: 'OK' },
  'Oregon':         { zone: 8, subZone: '8b', label: 'Zone 8b', abbr: 'OR' },
  'Pennsylvania':   { zone: 6, subZone: '6b', label: 'Zone 6b', abbr: 'PA' },
  'Rhode Island':   { zone: 6, subZone: '6b', label: 'Zone 6b', abbr: 'RI' },
  'South Carolina': { zone: 8, subZone: '8a', label: 'Zone 8a', abbr: 'SC' },
  'South Dakota':   { zone: 5, subZone: '5a', label: 'Zone 5a', abbr: 'SD' },
  'Tennessee':      { zone: 7, subZone: '7a', label: 'Zone 7a', abbr: 'TN' },
  'Texas':          { zone: 8, subZone: '8b', label: 'Zone 8b', abbr: 'TX' },
  'Utah':           { zone: 6, subZone: '6b', label: 'Zone 6b', abbr: 'UT' },
  'Vermont':        { zone: 5, subZone: '5a', label: 'Zone 5a', abbr: 'VT' },
  'Virginia':       { zone: 7, subZone: '7a', label: 'Zone 7a', abbr: 'VA' },
  'Washington':     { zone: 8, subZone: '8b', label: 'Zone 8b', abbr: 'WA' },
  'West Virginia':  { zone: 6, subZone: '6b', label: 'Zone 6b', abbr: 'WV' },
  'Wisconsin':      { zone: 5, subZone: '5a', label: 'Zone 5a', abbr: 'WI' },
  'Wyoming':        { zone: 5, subZone: '5a', label: 'Zone 5a', abbr: 'WY' },
};

/** Sorted state names for dropdown */
export const US_STATES = Object.keys(STATE_HARDINESS_ZONES).sort();
