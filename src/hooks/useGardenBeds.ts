import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GardenBed {
  id: string;
  bed_number: number;
  zone_name: string;
  zone_color: string;
  frequency_hz: number;
  notes: string | null;
  internal_brix: number | null;
  vitality_status: 'pending' | 'thriving' | 'needs_attention';
  created_at: string;
  updated_at: string;
}

export interface BedPlanting {
  id: string;
  bed_id: string;
  crop_id: string;
  guild_role: 'Lead' | 'Sentinel' | 'Miner' | 'Enhancer';
  plant_count: number;
  planted_at: string;
  created_at: string;
  crop?: {
    id: string;
    name: string;
    common_name: string | null;
    frequency_hz: number;
    guild_role: string | null;
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

// Fetch all garden beds
export const useGardenBeds = () => {
  return useQuery({
    queryKey: ['garden-beds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('garden_beds')
        .select('*')
        .order('bed_number');
      
      if (error) throw error;
      return data as GardenBed[];
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
            id, name, common_name, frequency_hz, guild_role, 
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
export const calculatePlantCount = (spacingInches: string | null): number => {
  if (!spacingInches) return 0;
  
  const spacing = parseFloat(spacingInches);
  if (isNaN(spacing) || spacing <= 0) return 0;
  
  // Formula: (60ft * 30in) / (SpacingInches^2 * 0.866)
  // 60ft = 720 inches, 30in width
  const bedLengthInches = 720; // 60 feet
  const bedWidthInches = 30;   // 30 inches
  
  const plantCount = (bedLengthInches * bedWidthInches) / (spacing * spacing * 0.866);
  return Math.floor(plantCount);
};
