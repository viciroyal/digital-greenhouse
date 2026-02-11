import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Master Crop type from database
 * Includes focus_tag for 7-Zone Octave sorting protocol
 */
/**
 * Chord Interval types for Complete Chord validation
 */
export type ChordInterval = 
  | 'Root (Lead)'      // Main harvest crop
  | '3rd (Triad)'      // Pest defense support
  | '5th (Stabilizer)' // Deep mineral puller
  | '7th (Signal)';    // Pollinator/aromatic

/**
 * Chord Category types for crop classification
 */
export type ChordCategory = 
  | 'Sustenance'           // Food crops
  | 'Sentinel/Miner'       // Pest defense & minerals
  | 'Nitrogen/Bio-Mass'    // Nitrogen fixers, cover crops
  | 'Dye/Fiber/Aromatic';  // Pollinators, dyes, fibers

/**
 * Master Crop type from database
 * Includes focus_tag for 7-Zone Octave sorting protocol
 * and chord_interval for Complete Chord validation
 */
export interface MasterCrop {
  id: string;
  name: string;
  common_name: string | null;
  frequency_hz: number;
  zone_name: string;
  zone_color: string;
  element: string;
  category: string; // ChordCategory: Sustenance, Sentinel/Miner, Nitrogen/Bio-Mass, Dye/Fiber/Aromatic
  chord_interval: string | null; // ChordInterval: Root (Lead), 3rd (Triad), 5th (Stabilizer), 7th (Signal)
  focus_tag: string | null; // ROOT_FOCUS, FLOW_FOCUS, etc.
  guild_role: string | null; // Lead, Sentinel, Miner, Enhancer (legacy)
  cultural_role: string | null;
  dominant_mineral: string | null;
  soil_protocol_focus: string | null;
  planting_season: string[] | null;
  harvest_days: number | null;
  companion_crops: string[] | null;
  crop_guild: string[] | null;
  spacing_inches: string | null;
  library_note: string | null;
  description: string | null;
  scientific_name: string | null;
  brix_target_min: number | null;
  brix_target_max: number | null;
  instrument_type: string | null; // Musical instrument: Electric Guitar, Percussion, Horn Section, Bass, Synthesizers
  hardiness_zone_min: number | null;  // Sub-zone: 8.0 = 8a, 8.5 = 8b
  hardiness_zone_max: number | null;  // Sub-zone: 9.0 = 9a, 9.5 = 9b
  created_at: string;
  updated_at: string;
}

// Focus tag type for strict filtering
export type FocusTag = 
  | 'ROOT_FOCUS'      // 396Hz
  | 'FLOW_FOCUS'      // 417Hz
  | 'SOLAR_FOCUS'     // 528Hz
  | 'HEART_FOCUS'     // 639Hz
  | 'EXPRESSION_FOCUS'// 741Hz
  | 'INTUITION_FOCUS' // 852Hz
  | 'SOURCE_FOCUS';   // 963Hz

/**
 * Soil Amendment type from database
 */
export interface SoilAmendment {
  id: string;
  name: string;
  category: string;
  quantity_per_60ft: string;
  description: string | null;
  nutrient_contribution: string | null;
  frequency_affinity: number[] | null;
  created_at: string;
}

/**
 * Frequency zone data derived from crops
 */
export interface FrequencyZone {
  hz: number;
  name: string;
  color: string;
  element: string;
  crops: MasterCrop[];
}

/**
 * Hook to fetch all master crops from the database
 */
export const useMasterCrops = () => {
  return useQuery({
    queryKey: ['master-crops'],
    queryFn: async (): Promise<MasterCrop[]> => {
      const { data, error } = await supabase
        .from('master_crops')
        .select('*')
        .order('frequency_hz', { ascending: true })
        .order('common_name', { ascending: true });

      if (error) throw error;
      return (data as MasterCrop[]) || [];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

/**
 * Hook to fetch crops filtered by frequency
 */
export const useCropsByFrequency = (frequencyHz: number | null) => {
  return useQuery({
    queryKey: ['master-crops', 'frequency', frequencyHz],
    queryFn: async (): Promise<MasterCrop[]> => {
      if (!frequencyHz) return [];

      const { data, error } = await supabase
        .from('master_crops')
        .select('*')
        .eq('frequency_hz', frequencyHz)
        .order('common_name', { ascending: true });

      if (error) throw error;
      return (data as MasterCrop[]) || [];
    },
    enabled: !!frequencyHz,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to fetch all soil amendments (Master Mix components)
 */
export const useSoilAmendments = () => {
  return useQuery({
    queryKey: ['soil-amendments'],
    queryFn: async (): Promise<SoilAmendment[]> => {
      const { data, error } = await supabase
        .from('soil_amendments')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return (data as SoilAmendment[]) || [];
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
};

/**
 * Hook to get frequency zones with their crops
 */
export const useFrequencyZones = () => {
  const { data: crops, isLoading, error } = useMasterCrops();

  const zones: FrequencyZone[] = crops
    ? Object.values(
        crops.reduce(
          (acc, crop) => {
            if (!acc[crop.frequency_hz]) {
              acc[crop.frequency_hz] = {
                hz: crop.frequency_hz,
                name: crop.zone_name,
                color: crop.zone_color,
                element: crop.element,
                crops: [],
              };
            }
            acc[crop.frequency_hz].crops.push(crop);
            return acc;
          },
          {} as Record<number, FrequencyZone>
        )
      ).sort((a, b) => a.hz - b.hz)
    : [];

  return { zones, isLoading, error };
};
