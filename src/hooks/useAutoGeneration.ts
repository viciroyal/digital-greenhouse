import { useMemo, useCallback } from 'react';
import { MasterCrop } from '@/hooks/useMasterCrops';
import { ChordInterval, InoculantType, calculatePlantCount, AERIAL_PLANT_COUNT } from '@/hooks/useGardenBeds';
import { getZoneRecommendation } from '@/data/jazzVoicingRecommendations';

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

    // Select best matches for each interval
    // Prefer crops with different instrument types for variety
    const usedInstruments = new Set<string>();
    if (rootCrop.instrument_type) {
      usedInstruments.add(rootCrop.instrument_type);
    }

    const selectBestCrop = (crops: MasterCrop[]): MasterCrop | null => {
      // First try to find a crop with a different instrument type
      const differentInstrument = crops.find(c => 
        c.instrument_type && !usedInstruments.has(c.instrument_type)
      );
      if (differentInstrument) {
        if (differentInstrument.instrument_type) {
          usedInstruments.add(differentInstrument.instrument_type);
        }
        return differentInstrument;
      }
      // Fallback to first available
      return crops[0] || null;
    };

    const third = selectBestCrop(cropsByInterval.third);
    const fifth = selectBestCrop(cropsByInterval.fifth);
    const seventh = selectBestCrop(cropsByInterval.seventh);

    // Get zone recommendation for 11th and 13th
    const zoneRec = getZoneRecommendation(frequencyHz);

    // Map the recommendation to an inoculant type
    let eleventh: InoculantType = null;
    if (zoneRec) {
      const recName = zoneRec.eleventh.name.toLowerCase();
      if (recName.includes('reishi')) eleventh = 'Reishi';
      else if (recName.includes('wine cap')) eleventh = 'Wine Cap';
      else if (recName.includes('oyster')) eleventh = 'Oyster';
      else if (recName.includes('lion') || recName.includes('mane')) eleventh = 'Mycorrhizae';
      else if (recName.includes('turkey')) eleventh = 'Mycorrhizae';
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
