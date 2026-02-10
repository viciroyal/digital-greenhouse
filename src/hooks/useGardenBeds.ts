import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Inoculant types for the 11th Interval (Fungal Network)
 */
export type InoculantType = 
  | 'Mycorrhizae' 
  | 'Red Reishi' 
  | "Lion's Mane" 
  | 'Wine Cap' 
  | 'Oyster Mushrooms' 
  | 'Turkey Tail' 
  | 'Purple Spore Woodear' 
  | 'White Ghost Fungus' 
  | null;

export const INOCULANT_OPTIONS: InoculantType[] = [
  'Mycorrhizae',
  'Red Reishi',
  "Lion's Mane",
  'Wine Cap',
  'Oyster Mushrooms',
  'Turkey Tail',
  'Purple Spore Woodear',
  'White Ghost Fungus',
];

export interface GardenBed {
  id: string;
  bed_number: number;
  zone_name: string;
  zone_color: string;
  frequency_hz: number;
  notes: string | null;
  internal_brix: number | null;
  vitality_status: 'pending' | 'thriving' | 'needs_attention';
  inoculant_type: InoculantType;
  aerial_crop_id: string | null; // 13th Interval - Aerial Signal overstory crop
  bed_length_ft: number; // Customizable bed length (default 60)
  bed_width_ft: number;  // Customizable bed width (default 4)
  created_at: string;
  updated_at: string;
}

/**
 * 13th Interval - Aerial Signal (Overstory Layer)
 * Scattered pattern: 1 plant per 100 sq ft
 * For a 60ft x 2.5ft bed (150 sq ft), this means ~1-2 plants per bed
 */
export const AERIAL_PLANT_COUNT = 2; // Per 60ft bed (scattered pattern)

/**
 * JAZZ VOICING COMPLEXITY ENGINE
 * 
 * Complexity Levels:
 * - Triad (Root + 3rd + 5th) = 60%
 * - 7th Chord (Root + 3rd + 5th + 7th) = 80%
 * - 13th Jazz Chord (complete chord + 11th + 13th) = 100%
 * 
 * The 11th (Fungal Network) and 13th (Aerial Signal) are BIOLOGICAL OVERLAYS.
 * They do NOT subtract from ground crop space - they exist in different ecological niches:
 * - 11th operates in the sub-soil layer (mycorrhizal network)
 * - 13th operates in the overstory layer (aerial canopy)
 */
export type ComplexityLevel = 'incomplete' | 'triad' | 'seventh' | 'jazz_13th';

export interface ComplexityScore {
  level: ComplexityLevel;
  percentage: number;
  label: string;
  isMasterConductor: boolean;
}

export const calculateComplexityScore = (
  chordStatus: Record<ChordInterval, boolean>,
  has11thInterval: boolean,
  has13thInterval: boolean
): ComplexityScore => {
  const hasRoot = chordStatus['Root (Lead)'];
  const has3rd = chordStatus['3rd (Triad)'];
  const has5th = chordStatus['5th (Stabilizer)'];
  const has7th = chordStatus['7th (Signal)'];

  // Check for complete 7th chord (ground layer complete)
  const isComplete7th = hasRoot && has3rd && has5th && has7th;
  
  // Check for triad (Root + 3rd + 5th)
  const isTriad = hasRoot && has3rd && has5th;

  // 13th Jazz Chord: Complete ground chord + both biological overlays
  if (isComplete7th && has11thInterval && has13thInterval) {
    return {
      level: 'jazz_13th',
      percentage: 100,
      label: 'Jazz 13th',
      isMasterConductor: true,
    };
  }

  // 7th Chord: All ground intervals
  if (isComplete7th) {
    return {
      level: 'seventh',
      percentage: 80,
      label: '7th Chord',
      isMasterConductor: false,
    };
  }

  // Triad: Root + 3rd + 5th
  if (isTriad) {
    return {
      level: 'triad',
      percentage: 60,
      label: 'Triad',
      isMasterConductor: false,
    };
  }

  // Incomplete - calculate partial progress
  const groundIntervalCount = [hasRoot, has3rd, has5th, has7th].filter(Boolean).length;
  const overlayCount = [has11thInterval, has13thInterval].filter(Boolean).length;
  
  // Ground intervals are worth 80% total (20% each), overlays are worth 20% total (10% each)
  const groundPercentage = groundIntervalCount * 20;
  const overlayPercentage = overlayCount * 10;
  
  return {
    level: 'incomplete',
    percentage: Math.min(groundPercentage + overlayPercentage, 59), // Cap at 59% if not a full triad
    label: 'Building...',
    isMasterConductor: false,
  };
};

/**
 * Chord Interval types for Complete Chord validation
 */
export type ChordInterval = 
  | 'Root (Lead)'      // Main harvest crop
  | '3rd (Triad)'      // Pest defense support
  | '5th (Stabilizer)' // Deep mineral puller
  | '7th (Signal)';    // Pollinator/aromatic

export const CHORD_INTERVALS: ChordInterval[] = [
  'Root (Lead)',
  '3rd (Triad)',
  '5th (Stabilizer)',
  '7th (Signal)',
];

export interface BedPlanting {
  id: string;
  bed_id: string;
  crop_id: string;
  guild_role: string; // Legacy: Lead, Sentinel, Miner, Enhancer
  plant_count: number;
  planted_at: string;
  created_at: string;
  crop?: {
    id: string;
    name: string;
    common_name: string | null;
    frequency_hz: number;
    guild_role: string | null;
    chord_interval: string | null; // Root (Lead), 3rd (Triad), 5th (Stabilizer), 7th (Signal)
    spacing_inches: string | null;
    brix_target_min: number | null;
    brix_target_max: number | null;
  };
}

export interface SevenPillarStatus {
  id: string;
  pillar_number: number;
  pillar_name: string;
  site_name: string;
  resonant_function: string;
  is_active: boolean;
  last_updated: string;
}

// Fetch all garden beds with aerial crop data
export const useGardenBeds = () => {
  return useQuery({
    queryKey: ['garden-beds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('garden_beds')
        .select(`
          *,
          aerial_crop:master_crops!garden_beds_aerial_crop_id_fkey(
            id, name, common_name, frequency_hz
          )
        `)
        .order('bed_number');
      
      if (error) throw error;
      return data as (GardenBed & { aerial_crop?: { id: string; name: string; common_name: string | null; frequency_hz: number } | null })[];
    },
  });
};

// Fetch plantings for a specific bed
export const useBedPlantings = (bedId: string | null) => {
  return useQuery({
    queryKey: ['bed-plantings', bedId],
    queryFn: async () => {
      if (!bedId) return [];
      
      const { data, error } = await supabase
        .from('bed_plantings')
        .select(`
          *,
          crop:master_crops(
            id, name, common_name, frequency_hz, guild_role, chord_interval,
            spacing_inches, brix_target_min, brix_target_max
          )
        `)
        .eq('bed_id', bedId);
      
      if (error) throw error;
      return data as BedPlanting[];
    },
    enabled: !!bedId,
  });
};

// Fetch ALL plantings for chord status display on grid
export const useAllBedPlantings = () => {
  return useQuery({
    queryKey: ['all-bed-plantings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bed_plantings')
        .select(`
          *,
          crop:master_crops(
            id, name, common_name, frequency_hz, guild_role, chord_interval,
            spacing_inches, brix_target_min, brix_target_max
          )
        `);
      
      if (error) throw error;
      
      // Group by bed_id for easy lookup
      const plantingsMap: Record<string, BedPlanting[]> = {};
      (data as BedPlanting[]).forEach(planting => {
        if (!plantingsMap[planting.bed_id]) {
          plantingsMap[planting.bed_id] = [];
        }
        plantingsMap[planting.bed_id].push(planting);
      });
      
      return plantingsMap;
    },
  });
}

// Fetch Seven Pillars status
export const useSevenPillars = () => {
  return useQuery({
    queryKey: ['seven-pillars-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seven_pillars_status')
        .select('*')
        .order('pillar_number');
      
      if (error) throw error;
      return data as SevenPillarStatus[];
    },
  });
};

// Update bed internal_brix (Admin only)
export const useUpdateBedBrix = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bedId, brix }: { bedId: string; brix: number | null }) => {
      const vitality = brix === null ? 'pending' : brix >= 15 ? 'thriving' : 'needs_attention';
      
      const { data, error } = await supabase
        .from('garden_beds')
        .update({ 
          internal_brix: brix, 
          vitality_status: vitality 
        })
        .eq('id', bedId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garden-beds'] });
    },
  });
};

// Update bed inoculant_type (11th Interval - Admin only)
export const useUpdateBedInoculant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bedId, inoculantType }: { bedId: string; inoculantType: InoculantType }) => {
      const { data, error } = await supabase
        .from('garden_beds')
        .update({ inoculant_type: inoculantType })
        .eq('id', bedId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garden-beds'] });
    },
  });
};

/**
 * Calculate water requirement reduction when 11th Interval is active
 * @returns The percentage of original water needed (90% = 10% reduction)
 */
export const calculateWaterReduction = (hasInoculant: boolean): number => {
  return hasInoculant ? 0.90 : 1.0; // 10% reduction when fungal network is active
};

// Update bed aerial_crop_id (13th Interval - Admin only)
export const useUpdateBedAerialCrop = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bedId, aerialCropId }: { bedId: string; aerialCropId: string | null }) => {
      const { data, error } = await supabase
        .from('garden_beds')
        .update({ aerial_crop_id: aerialCropId })
        .eq('id', bedId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garden-beds'] });
    },
  });
};

// Add planting to bed
export const useAddPlanting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      bedId, 
      cropId, 
      guildRole, 
      plantCount 
    }: { 
      bedId: string; 
      cropId: string; 
      guildRole: string; 
      plantCount: number;
    }) => {
      const { data, error } = await supabase
        .from('bed_plantings')
        .insert({
          bed_id: bedId,
          crop_id: cropId,
          guild_role: guildRole,
          plant_count: plantCount,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bed-plantings', variables.bedId] });
    },
  });
};

// Remove planting from bed
export const useRemovePlanting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ plantingId, bedId }: { plantingId: string; bedId: string }) => {
      const { error } = await supabase
        .from('bed_plantings')
        .delete()
        .eq('id', plantingId);
      
      if (error) throw error;
      return { plantingId, bedId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bed-plantings', variables.bedId] });
    },
  });
};

// Toggle pillar status
export const useTogglePillar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pillarId, isActive }: { pillarId: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('seven_pillars_status')
        .update({ 
          is_active: isActive,
          last_updated: new Date().toISOString(),
        })
        .eq('id', pillarId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seven-pillars-status'] });
    },
  });
};

// Calculate plant count using hexagonal spacing formula
// Accepts optional bed dimensions; defaults to 60ft x 4ft
export const calculatePlantCount = (
  spacingInches: string | null,
  bedLengthFt: number = 60,
  bedWidthFt: number = 4,
): number => {
  if (!spacingInches) return 0;
  
  const spacing = parseFloat(spacingInches);
  if (isNaN(spacing) || spacing <= 0) return 0;
  
  // Convert feet to inches
  const bedLengthInches = bedLengthFt * 12;
  const bedWidthInches = bedWidthFt * 12;
  
  const plantCount = (bedLengthInches * bedWidthInches) / (spacing * spacing * 0.866);
  return Math.floor(plantCount);
};

// Update bed dimensions (Admin only)
export const useUpdateBedDimensions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bedId, lengthFt, widthFt }: { bedId: string; lengthFt: number; widthFt: number }) => {
      const { data, error } = await supabase
        .from('garden_beds')
        .update({ bed_length_ft: lengthFt, bed_width_ft: widthFt })
        .eq('id', bedId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garden-beds'] });
    },
  });
};
