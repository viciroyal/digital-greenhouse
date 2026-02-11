import { useMemo, useCallback } from 'react';
import { MasterCrop } from '@/hooks/useMasterCrops';
import { ChordInterval, InoculantType, calculatePlantCount, AERIAL_PLANT_COUNT } from '@/hooks/useGardenBeds';
import { getZoneRecommendation } from '@/data/jazzVoicingRecommendations';
import { checkShading, layerMatchScore, getIdealSlotLayers, successionScore, verticalDiversityScore } from '@/lib/growthLayers';

/**
 * INSTRUMENT-BASED AUTO-GENERATION ENGINE
 * When a Root crop is selected, automatically fills remaining chord intervals
 * based on shared frequency zone and optimal instrument pairings
 */

export type InstrumentType = 'Electric Guitar' | 'Percussion' | 'Horn Section' | 'Bass' | 'Synthesizers';

export interface InstrumentInfo {
  type: InstrumentType;
  icon: string;
  role: string;
  description: string;
}

export const INSTRUMENT_ICONS: Record<InstrumentType, InstrumentInfo> = {
  'Electric Guitar': {
    type: 'Electric Guitar',
    icon: '🎸',
    role: 'Melodic Lead',
    description: 'Sustained, melodic, needs high "Voltage" (Calcium)',
  },
  'Percussion': {
    type: 'Percussion',
    icon: '🥁',
    role: 'Rhythmic Foundation',
    description: 'High vertical rhythm, sets the tempo',
  },
  'Horn Section': {
    type: 'Horn Section',
    icon: '🎺',
    role: 'Structural Blast',
    description: 'Bold, provides the "Blast" of chlorophyll',
  },
  'Bass': {
    type: 'Bass',
    icon: '🎸',
    role: 'Grounding Shield',
    description: 'Defensive, provides the "Shield"',
  },
  'Synthesizers': {
    type: 'Synthesizers',
    icon: '🎹',
    role: 'Atmospheric Fill',
    description: 'Fills gaps with "Atmosphere" (Scent/Signal)',
  },
};

/**
 * Master Mix Settings by frequency zone
 */
export interface MasterMixSetting {
  frequencyHz: number;
  zoneName: string;
  mixFocus: string;
  primaryMineral: string;
  harmonyType: string;
}

export const MASTER_MIX_SETTINGS: MasterMixSetting[] = [
  { frequencyHz: 396, zoneName: 'Root', mixFocus: 'High Phosphorus/Anchor', primaryMineral: 'P', harmonyType: 'Foundation' },
  { frequencyHz: 417, zoneName: 'Flow', mixFocus: 'High Humates/Flow', primaryMineral: 'H/C', harmonyType: 'Movement' },
  { frequencyHz: 528, zoneName: 'Solar', mixFocus: 'High Nitrogen/Alchemy', primaryMineral: 'N', harmonyType: 'Transformation' },
  { frequencyHz: 639, zoneName: 'Heart', mixFocus: 'High Calcium/Harmony', primaryMineral: 'Ca', harmonyType: 'Integration' },
  { frequencyHz: 741, zoneName: 'Voice', mixFocus: 'High Potassium/Expression', primaryMineral: 'K', harmonyType: 'Vibration' },
  { frequencyHz: 852, zoneName: 'Vision', mixFocus: 'High Silica/Clarity', primaryMineral: 'Si', harmonyType: 'Perception' },
  { frequencyHz: 963, zoneName: 'Shield', mixFocus: 'High Sulfur/Protection', primaryMineral: 'S', harmonyType: 'Guardian' },
];

export const getMasterMixSetting = (frequencyHz: number): MasterMixSetting | undefined => {
  return MASTER_MIX_SETTINGS.find(mix => mix.frequencyHz === frequencyHz);
};

/**
 * Chord Sheet - comprehensive bed composition display
 */
export interface ChordSheet {
  tone: number; // Frequency in Hz
  zoneName: string;
  masterMixSetting: MasterMixSetting;
  voicingDensity: number; // Total plant count for all intervals
  intervals: {
    root?: { crop: MasterCrop; plantCount: number };
    third?: { crop: MasterCrop; plantCount: number };
    fifth?: { crop: MasterCrop; plantCount: number };
    seventh?: { crop: MasterCrop; plantCount: number };
    eleventh?: { name: string; type: string };
    thirteenth?: { name: string; type: string };
  };
  isCompleteChord: boolean;
  isJazz13th: boolean;
}

/**
 * Auto-generation result for filling intervals
 */
export interface AutoGenerationResult {
  third: MasterCrop | null;
  fifth: MasterCrop | null;
  seventh: MasterCrop | null;
  eleventh: InoculantType;
  thirteenth: MasterCrop | null;
  chordSheet: ChordSheet;
}

/**
 * Check for dissonance - frequency mismatch warning
 * Jazz Mode: allows inter-zone planting if crops share the same guild/category
 */
export interface DissonanceCheck {
  isDissonant: boolean;
  message: string;
  severity: 'warning' | 'error';
}

export const checkDissonance = (
  crop: MasterCrop,
  bedFrequencyHz: number,
  interval: ChordInterval,
  jazzMode: boolean = false
): DissonanceCheck => {
  if (crop.frequency_hz !== bedFrequencyHz) {
    // Jazz Mode: allow inter-zone if crop has a structural/support role
    if (jazzMode) {
      const supportRoles = ['Enhancer', 'Builder', 'Sentinel', 'Miner'];
      const isSupportRole = crop.guild_role && supportRoles.includes(crop.guild_role);
      const isStructuralInterval = interval === '3rd (Triad)' || interval === '5th (Stabilizer)' || interval === '7th (Signal)';
      
      if (isSupportRole || isStructuralInterval) {
        return {
          isDissonant: false,
          message: `♪ Jazz Mode: "${crop.name}" (${crop.frequency_hz}Hz) permitted as inter-zone voicing in this bed (${bedFrequencyHz}Hz).`,
          severity: 'warning',
        };
      }
    }
    
    return {
      isDissonant: true,
      message: `⚠️ DISSONANCE WARNING: "${crop.name}" (${crop.frequency_hz}Hz) is out of tune with this bed (${bedFrequencyHz}Hz). This ${interval} may cause harmonic interference.`,
      severity: jazzMode ? 'warning' : 'warning',
    };
  }
  return {
    isDissonant: false,
    message: '',
    severity: 'warning',
  };
};

/**
 * Hook for auto-generating bed composition when Root is selected
 */
export const useAutoGeneration = (
  allCrops: MasterCrop[],
  frequencyHz: number,
  rootCrop: MasterCrop | null
) => {
  // Get crops that match this frequency zone
  const zoneCrops = useMemo(() => {
    return allCrops.filter(crop => crop.frequency_hz === frequencyHz);
  }, [allCrops, frequencyHz]);

  // Get crops by chord interval for this zone
  const cropsByInterval = useMemo(() => {
    return {
      root: zoneCrops.filter(c => c.chord_interval === 'Root (Lead)'),
      third: zoneCrops.filter(c => c.chord_interval === '3rd (Triad)'),
      fifth: zoneCrops.filter(c => c.chord_interval === '5th (Stabilizer)'),
      seventh: zoneCrops.filter(c => c.chord_interval === '7th (Signal)'),
    };
  }, [zoneCrops]);

  // Auto-generate remaining intervals based on root selection
  const generateChord = useCallback((): AutoGenerationResult | null => {
    if (!rootCrop) return null;

    const rootSeasons = rootCrop.planting_season || [];
    const rootHarvest = rootCrop.harvest_days ?? null;

    /** Score a candidate crop for seasonal/harvest compatibility with the root */
    const compatibilityScore = (crop: MasterCrop): number => {
      let score = 0;
      // +2 per shared planting season
      const cropSeasons = crop.planting_season || [];
      for (const s of cropSeasons) {
        if (rootSeasons.includes(s)) score += 2;
      }
      // +1 if harvest_days within ±30 of root, +2 if within ±15
      if (rootHarvest !== null && crop.harvest_days !== null) {
        const diff = Math.abs(crop.harvest_days - rootHarvest);
        if (diff <= 15) score += 2;
        else if (diff <= 30) score += 1;
      }
      return score;
    };

    // Select best matches for each interval
    // Prefer crops with similar seasons, close harvest times, and different instruments
    const usedInstruments = new Set<string>();
    const usedIds = new Set<string>();
    if (rootCrop.instrument_type) usedInstruments.add(rootCrop.instrument_type);
    usedIds.add(rootCrop.id);

    // Track placed crops for antagonist checking
    const placedCrops: MasterCrop[] = [rootCrop];

    // Pre-compute ideal slot layers based on root crop's growth layer
    const idealLayers = getIdealSlotLayers(rootCrop);

    // Antagonist pairs for filtering
    const ANTAGONIST_PAIRS = [
      { groupA: ['onion', 'garlic', 'shallot', 'leek', 'chive', 'scallion'], groupB: ['bean', 'pea', 'lentil', 'chickpea', 'lima'] },
      { groupA: ['tomato'], groupB: ['potato'] },
      { groupA: ['tomato'], groupB: ['corn'] },
      { groupA: ['tomato'], groupB: ['fennel'] },
      { groupA: ['cabbage', 'broccoli', 'kale', 'cauliflower', 'brussels'], groupB: ['tomato', 'pepper', 'strawberry'] },
      { groupA: ['fennel'], groupB: ['bean', 'pepper', 'eggplant', 'carrot'] },
      { groupA: ['walnut', 'black walnut'], groupB: ['tomato', 'pepper', 'eggplant', 'potato', 'blueberry'] },
      { groupA: ['dill', 'coriander', 'cilantro', 'parsnip'], groupB: ['carrot'] },
      { groupA: ['sage'], groupB: ['cucumber'] },
      { groupA: ['mint'], groupB: ['parsley'] },
      { groupA: ['sunflower'], groupB: ['potato'] },
      { groupA: ['potato'], groupB: ['squash', 'cucumber', 'zucchini', 'pumpkin'] },
      { groupA: ['bean'], groupB: ['pepper'] },
      { groupA: ['corn'], groupB: ['celery'] },
      { groupA: ['onion'], groupB: ['asparagus'] },
      { groupA: ['pepper'], groupB: ['fennel'] },
      { groupA: ['pepper'], groupB: ['kohlrabi'] },
      { groupA: ['squash', 'zucchini', 'pumpkin'], groupB: ['potato'] },
      { groupA: ['cucumber'], groupB: ['potato'] },
      { groupA: ['cucumber', 'squash', 'zucchini'], groupB: ['melon'] },
      { groupA: ['eggplant'], groupB: ['fennel'] },
      { groupA: ['eggplant'], groupB: ['pepper'] },
      { groupA: ['celery'], groupB: ['parsnip', 'parsley'] },
    ];

    const isAntagonist = (candidate: MasterCrop, placed: MasterCrop[]): boolean => {
      const cName = (candidate.common_name || candidate.name).toLowerCase();
      for (const other of placed) {
        const oName = (other.common_name || other.name).toLowerCase();
        for (const rule of ANTAGONIST_PAIRS) {
          const cInA = rule.groupA.some(k => cName.includes(k));
          const cInB = rule.groupB.some(k => cName.includes(k));
          const oInA = rule.groupA.some(k => oName.includes(k));
          const oInB = rule.groupB.some(k => oName.includes(k));
          if ((cInA && oInB) || (cInB && oInA)) return true;
        }
      }
      return false;
    };

    const selectBestCrop = (crops: MasterCrop[], slotKey: string): MasterCrop | null => {
      // Filter out antagonist conflicts and shading problems with already-placed crops
      const scored = crops
        .filter(c => {
          if (usedIds.has(c.id)) return false;
          if (isAntagonist(c, placedCrops)) return false;
          // Reject if any placed crop would severely shade this candidate
          for (const placed of placedCrops) {
            const warning = checkShading(placed, c);
            if (warning?.severity === 'warning') return false; // heavy shading → skip
          }
          return true;
        })
        .map(c => ({
          crop: c,
          compat: compatibilityScore(c),
          newInstrument: c.instrument_type && !usedInstruments.has(c.instrument_type) ? 1 : 0,
          layerBonus: layerMatchScore(c, slotKey, idealLayers),
          succession: successionScore(c, placedCrops),
        }))
        .sort((a, b) =>
          (b.compat + b.newInstrument + b.layerBonus + b.succession) -
          (a.compat + a.newInstrument + a.layerBonus + a.succession)
        );

      const best = scored[0];
      if (!best) return null;
      if (best.crop.instrument_type) usedInstruments.add(best.crop.instrument_type);
      usedIds.add(best.crop.id);
      placedCrops.push(best.crop);
      return best.crop;
    };

    const third = selectBestCrop(cropsByInterval.third, '3rd (Triad)');
    const fifth = selectBestCrop(cropsByInterval.fifth, '5th (Stabilizer)');
    const seventh = selectBestCrop(cropsByInterval.seventh, '7th (Signal)');

    // Get zone recommendation for 11th and 13th
    const zoneRec = getZoneRecommendation(frequencyHz);

    // Map the recommendation to an inoculant type
    let eleventh: InoculantType = null;
    if (zoneRec) {
      const recName = zoneRec.eleventh.name.toLowerCase();
      if (recName.includes('red reishi')) eleventh = 'Red Reishi';
      else if (recName.includes('lion')) eleventh = "Lion's Mane";
      else if (recName.includes('wine cap')) eleventh = 'Wine Cap';
      else if (recName.includes('oyster')) eleventh = 'Oyster Mushrooms';
      else if (recName.includes('turkey')) eleventh = 'Turkey Tail';
      else if (recName.includes('purple spore') || recName.includes('woodear')) eleventh = 'Purple Spore Woodear';
      else if (recName.includes('white ghost')) eleventh = 'White Ghost Fungus';
      else eleventh = 'Mycorrhizae'; // Default
    }

    // For 13th, try to find a matching crop
    const thirteenth = zoneCrops.find(c => 
      zoneRec && c.name.toLowerCase().includes(zoneRec.thirteenth.name.split(' ')[0].toLowerCase())
    ) || null;

    // Calculate voicing density
    const rootCount = rootCrop.spacing_inches ? calculatePlantCount(rootCrop.spacing_inches) : 0;
    const thirdCount = third?.spacing_inches ? calculatePlantCount(third.spacing_inches) : 0;
    const fifthCount = fifth?.spacing_inches ? calculatePlantCount(fifth.spacing_inches) : 0;
    const seventhCount = seventh?.spacing_inches ? calculatePlantCount(seventh.spacing_inches) : 0;
    const aerialCount = thirteenth ? AERIAL_PLANT_COUNT : 0;
    
    const voicingDensity = rootCount + thirdCount + fifthCount + seventhCount + aerialCount;

    const masterMixSetting = getMasterMixSetting(frequencyHz) || MASTER_MIX_SETTINGS[0];
    const zoneName = masterMixSetting.zoneName;

    const chordSheet: ChordSheet = {
      tone: frequencyHz,
      zoneName,
      masterMixSetting,
      voicingDensity,
      intervals: {
        root: rootCrop ? { crop: rootCrop, plantCount: rootCount } : undefined,
        third: third ? { crop: third, plantCount: thirdCount } : undefined,
        fifth: fifth ? { crop: fifth, plantCount: fifthCount } : undefined,
        seventh: seventh ? { crop: seventh, plantCount: seventhCount } : undefined,
        eleventh: zoneRec ? { name: zoneRec.eleventh.name, type: zoneRec.eleventh.description } : undefined,
        thirteenth: zoneRec ? { name: zoneRec.thirteenth.name, type: zoneRec.thirteenth.description } : undefined,
      },
      isCompleteChord: Boolean(rootCrop && third && fifth && seventh),
      isJazz13th: Boolean(rootCrop && third && fifth && seventh && eleventh && thirteenth),
    };

    return {
      third,
      fifth,
      seventh,
      eleventh,
      thirteenth,
      chordSheet,
    };
  }, [rootCrop, cropsByInterval, zoneCrops, frequencyHz]);

  return {
    zoneCrops,
    cropsByInterval,
    generateChord,
    checkDissonance: (crop: MasterCrop, interval: ChordInterval) => 
      checkDissonance(crop, frequencyHz, interval),
  };
};

export default useAutoGeneration;
