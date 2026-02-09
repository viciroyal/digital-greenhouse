-- Create garden_beds table for the 44-bed grid with zone assignments
CREATE TABLE public.garden_beds (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    bed_number integer NOT NULL UNIQUE CHECK (bed_number >= 1 AND bed_number <= 44),
    zone_name text NOT NULL,
    zone_color text NOT NULL,
    frequency_hz integer NOT NULL CHECK (frequency_hz IN (396, 417, 528, 639, 741, 852, 963)),
    notes text DEFAULT 'Apply 5-Quart Master Mix Reset before planting.',
    internal_brix integer DEFAULT NULL,
    vitality_status text DEFAULT 'pending' CHECK (vitality_status IN ('pending', 'thriving', 'needs_attention')),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.garden_beds ENABLE ROW LEVEL SECURITY;

-- Public can view beds (for Member Mode)
CREATE POLICY "Garden beds are publicly readable" 
ON public.garden_beds 
FOR SELECT 
USING (true);

-- Only admins can insert/update/delete beds
CREATE POLICY "Only admins can insert garden beds" 
ON public.garden_beds 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update garden beds" 
ON public.garden_beds 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete garden beds" 
ON public.garden_beds 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Create bed_plantings table to track crops in each bed
CREATE TABLE public.bed_plantings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    bed_id uuid NOT NULL REFERENCES public.garden_beds(id) ON DELETE CASCADE,
    crop_id uuid NOT NULL REFERENCES public.master_crops(id) ON DELETE CASCADE,
    guild_role text NOT NULL CHECK (guild_role IN ('Lead', 'Sentinel', 'Miner', 'Enhancer')),
    plant_count integer NOT NULL DEFAULT 0,
    planted_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (bed_id, crop_id)
);

-- Enable RLS
ALTER TABLE public.bed_plantings ENABLE ROW LEVEL SECURITY;

-- Public can view plantings
CREATE POLICY "Bed plantings are publicly readable" 
ON public.bed_plantings 
FOR SELECT 
USING (true);

-- Only admins can manage plantings
CREATE POLICY "Only admins can insert bed plantings" 
ON public.bed_plantings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update bed plantings" 
ON public.bed_plantings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete bed plantings" 
ON public.bed_plantings 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Create seven_pillars_status table for infrastructure tracking
CREATE TABLE public.seven_pillars_status (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pillar_number integer NOT NULL UNIQUE CHECK (pillar_number >= 1 AND pillar_number <= 7),
    pillar_name text NOT NULL,
    site_name text NOT NULL,
    resonant_function text NOT NULL,
    is_active boolean NOT NULL DEFAULT false,
    last_updated timestamp with time zone NOT NULL DEFAULT now(),
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seven_pillars_status ENABLE ROW LEVEL SECURITY;

-- Public can view pillars
CREATE POLICY "Seven pillars are publicly readable" 
ON public.seven_pillars_status 
FOR SELECT 
USING (true);

-- Only admins can manage pillars
CREATE POLICY "Only admins can update seven pillars" 
ON public.seven_pillars_status 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

-- Trigger to update updated_at
CREATE TRIGGER update_garden_beds_updated_at
BEFORE UPDATE ON public.garden_beds
FOR EACH ROW
EXECUTE FUNCTION public.update_master_crops_updated_at();

-- Insert the 44 beds with zone assignments
INSERT INTO public.garden_beds (bed_number, zone_name, zone_color, frequency_hz)
SELECT 
    n,
    CASE 
        WHEN n BETWEEN 1 AND 7 THEN 'The Root'
        WHEN n BETWEEN 8 AND 14 THEN 'The Flow'
        WHEN n BETWEEN 15 AND 21 THEN 'The Solar'
        WHEN n BETWEEN 22 AND 28 THEN 'The Heart'
        WHEN n BETWEEN 29 AND 34 THEN 'The Voice'
        WHEN n BETWEEN 35 AND 40 THEN 'The Vision'
        WHEN n BETWEEN 41 AND 44 THEN 'The Shield'
    END,
    CASE 
        WHEN n BETWEEN 1 AND 7 THEN 'hsl(0 60% 50%)'
        WHEN n BETWEEN 8 AND 14 THEN 'hsl(30 70% 50%)'
        WHEN n BETWEEN 15 AND 21 THEN 'hsl(51 80% 50%)'
        WHEN n BETWEEN 22 AND 28 THEN 'hsl(120 50% 45%)'
        WHEN n BETWEEN 29 AND 34 THEN 'hsl(210 60% 50%)'
        WHEN n BETWEEN 35 AND 40 THEN 'hsl(270 50% 50%)'
        WHEN n BETWEEN 41 AND 44 THEN 'hsl(300 50% 50%)'
    END,
    CASE 
        WHEN n BETWEEN 1 AND 7 THEN 396
        WHEN n BETWEEN 8 AND 14 THEN 417
        WHEN n BETWEEN 15 AND 21 THEN 528
        WHEN n BETWEEN 22 AND 28 THEN 639
        WHEN n BETWEEN 29 AND 34 THEN 741
        WHEN n BETWEEN 35 AND 40 THEN 852
        WHEN n BETWEEN 41 AND 44 THEN 963
    END
FROM generate_series(1, 44) AS n;

-- Insert the Seven Pillars
INSERT INTO public.seven_pillars_status (pillar_number, pillar_name, site_name, resonant_function) VALUES
(1, 'The Vortex', 'Compost Station', 'Waste-to-Soil (Master Mix Inventory)'),
(2, 'Sirius Master', 'Main Gate', 'Farm Entrance/Security'),
(3, 'Solar Alchemist', 'Well House', 'Irrigation / Solar Array'),
(4, 'Toltec Heart', 'Pavilion', 'Educational Stage / Frequency Playback'),
(5, 'Dogon Signal', 'Pack Shed', 'Wash/Pack & Cold Chain'),
(6, 'Aboriginal Vision', 'Tool Shed', 'Technology Hub (NIR Spectrometers)'),
(7, 'Hermetic Source', 'Perimeter', 'Shield (Garlic/Cotton Border)');