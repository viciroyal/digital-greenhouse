/**
 * Predominant USDA Hardiness Zone for each US state.
 * These represent the most common zone across each state's populated areas.
 * Sub-zones (a/b) are included for accuracy.
 */

export interface StateZoneInfo {
  zone: number;      // Integer zone for filtering (e.g. 8)
  subZone: string;   // Display label (e.g. "8b")
  label: string;     // Full label (e.g. "Zone 8b")
}

export const STATE_HARDINESS_ZONES: Record<string, StateZoneInfo> = {
  'Alabama':        { zone: 8, subZone: '8a', label: 'Zone 8a' },
  'Alaska':         { zone: 4, subZone: '4a', label: 'Zone 4a' },
  'Arizona':        { zone: 9, subZone: '9b', label: 'Zone 9b' },
  'Arkansas':       { zone: 7, subZone: '7b', label: 'Zone 7b' },
  'California':     { zone: 9, subZone: '9b', label: 'Zone 9b' },
  'Colorado':       { zone: 5, subZone: '5b', label: 'Zone 5b' },
  'Connecticut':    { zone: 6, subZone: '6b', label: 'Zone 6b' },
  'Delaware':       { zone: 7, subZone: '7a', label: 'Zone 7a' },
  'Florida':        { zone: 9, subZone: '9b', label: 'Zone 9b' },
  'Georgia':        { zone: 8, subZone: '8b', label: 'Zone 8b' },
  'Hawaii':         { zone: 11, subZone: '11a', label: 'Zone 11a' },
  'Idaho':          { zone: 6, subZone: '6b', label: 'Zone 6b' },
  'Illinois':       { zone: 6, subZone: '6a', label: 'Zone 6a' },
  'Indiana':        { zone: 6, subZone: '6a', label: 'Zone 6a' },
  'Iowa':           { zone: 5, subZone: '5b', label: 'Zone 5b' },
  'Kansas':         { zone: 6, subZone: '6b', label: 'Zone 6b' },
  'Kentucky':       { zone: 6, subZone: '6b', label: 'Zone 6b' },
  'Louisiana':      { zone: 9, subZone: '9a', label: 'Zone 9a' },
  'Maine':          { zone: 5, subZone: '5a', label: 'Zone 5a' },
  'Maryland':       { zone: 7, subZone: '7a', label: 'Zone 7a' },
  'Massachusetts':  { zone: 6, subZone: '6b', label: 'Zone 6b' },
  'Michigan':       { zone: 6, subZone: '6a', label: 'Zone 6a' },
  'Minnesota':      { zone: 4, subZone: '4b', label: 'Zone 4b' },
  'Mississippi':    { zone: 8, subZone: '8a', label: 'Zone 8a' },
  'Missouri':       { zone: 6, subZone: '6b', label: 'Zone 6b' },
  'Montana':        { zone: 4, subZone: '4b', label: 'Zone 4b' },
  'Nebraska':       { zone: 5, subZone: '5b', label: 'Zone 5b' },
  'Nevada':         { zone: 7, subZone: '7a', label: 'Zone 7a' },
  'New Hampshire':  { zone: 5, subZone: '5b', label: 'Zone 5b' },
  'New Jersey':     { zone: 7, subZone: '7a', label: 'Zone 7a' },
  'New Mexico':     { zone: 7, subZone: '7a', label: 'Zone 7a' },
  'New York':       { zone: 6, subZone: '6a', label: 'Zone 6a' },
  'North Carolina': { zone: 7, subZone: '7b', label: 'Zone 7b' },
  'North Dakota':   { zone: 4, subZone: '4a', label: 'Zone 4a' },
  'Ohio':           { zone: 6, subZone: '6a', label: 'Zone 6a' },
  'Oklahoma':       { zone: 7, subZone: '7a', label: 'Zone 7a' },
  'Oregon':         { zone: 8, subZone: '8b', label: 'Zone 8b' },
  'Pennsylvania':   { zone: 6, subZone: '6b', label: 'Zone 6b' },
  'Rhode Island':   { zone: 6, subZone: '6b', label: 'Zone 6b' },
  'South Carolina': { zone: 8, subZone: '8a', label: 'Zone 8a' },
  'South Dakota':   { zone: 5, subZone: '5a', label: 'Zone 5a' },
  'Tennessee':      { zone: 7, subZone: '7a', label: 'Zone 7a' },
  'Texas':          { zone: 8, subZone: '8b', label: 'Zone 8b' },
  'Utah':           { zone: 6, subZone: '6b', label: 'Zone 6b' },
  'Vermont':        { zone: 5, subZone: '5a', label: 'Zone 5a' },
  'Virginia':       { zone: 7, subZone: '7a', label: 'Zone 7a' },
  'Washington':     { zone: 8, subZone: '8b', label: 'Zone 8b' },
  'West Virginia':  { zone: 6, subZone: '6b', label: 'Zone 6b' },
  'Wisconsin':      { zone: 5, subZone: '5a', label: 'Zone 5a' },
  'Wyoming':        { zone: 5, subZone: '5a', label: 'Zone 5a' },
};

/** Sorted state names for dropdown */
export const US_STATES = Object.keys(STATE_HARDINESS_ZONES).sort();
