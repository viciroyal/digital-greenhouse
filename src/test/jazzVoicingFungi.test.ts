import { describe, it, expect } from 'vitest';
import { getZoneRecommendation, JAZZ_VOICING_RECOMMENDATIONS } from '@/data/jazzVoicingRecommendations';
import { InoculantType } from '@/hooks/useGardenBeds';

/**
 * Test that the auto-generation mapping correctly resolves
 * each zone's Jazz Voicing recommendation to the matching InoculantType.
 */

// Replicate the mapping logic from useAutoGeneration
function mapToInoculant(frequencyHz: number): InoculantType {
  const zoneRec = getZoneRecommendation(frequencyHz);
  if (!zoneRec) return null;

  const recName = zoneRec.eleventh.name.toLowerCase();
  if (recName.includes('red reishi')) return 'Red Reishi';
  if (recName.includes('lion')) return "Lion's Mane";
  if (recName.includes('wine cap')) return 'Wine Cap';
  if (recName.includes('oyster')) return 'Oyster Mushrooms';
  if (recName.includes('turkey')) return 'Turkey Tail';
  if (recName.includes('purple spore') || recName.includes('woodear')) return 'Purple Spore Woodear';
  if (recName.includes('white ghost')) return 'White Ghost Fungus';
  return 'Mycorrhizae';
}

describe('Jazz Voicing Fungi → InoculantType mapping', () => {
  const expected: [number, string, InoculantType][] = [
    [396, 'Root',   'Red Reishi'],
    [417, 'Flow',   "Lion's Mane"],
    [528, 'Solar',  'Wine Cap'],
    [639, 'Heart',  'Oyster Mushrooms'],
    [741, 'Voice',  'Turkey Tail'],
    [852, 'Vision', 'Purple Spore Woodear'],
    [963, 'Shield', 'White Ghost Fungus'],
  ];

  it.each(expected)('%iHz (%s) → %s', (hz, _zone, expectedFungus) => {
    expect(mapToInoculant(hz)).toBe(expectedFungus);
  });

  it('all 7 zones have recommendations', () => {
    expect(JAZZ_VOICING_RECOMMENDATIONS).toHaveLength(7);
  });

  it('unknown frequency returns null', () => {
    expect(mapToInoculant(999)).toBeNull();
  });
});

describe('Jazz Voicing 13th Aerial Recommendations', () => {
  const expected13th: [number, string, string][] = [
    [396, 'Root',   'Tall Red Amaranth'],
    [417, 'Flow',   'Orange Mexican Sunflower'],
    [528, 'Solar',  'Golden Fennel'],
    [639, 'Heart',  'Dill (Mammoth Long Island)'],
    [741, 'Voice',  "Bachelor's Buttons"],
    [852, 'Vision', 'Purple Verbena Bonariensis'],
    [963, 'Shield', 'White Moonflower'],
  ];

  it.each(expected13th)('%iHz (%s) recommends %s', (hz, _zone, expectedAerial) => {
    const rec = getZoneRecommendation(hz);
    expect(rec).toBeDefined();
    expect(rec!.thirteenth.name).toBe(expectedAerial);
  });
});
