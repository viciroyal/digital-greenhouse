-- =====================================================
-- MASTER CROP DATABASE - Single Source of Truth
-- =====================================================

-- Create master_crops table with frequency zones
CREATE TABLE public.master_crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  common_name TEXT,
  frequency_hz INTEGER NOT NULL CHECK (frequency_hz IN (396, 417, 528, 639, 741, 852, 963)),
  zone_name TEXT NOT NULL,
  zone_color TEXT NOT NULL,
  element TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'vegetable',
  planting_season TEXT[],
  harvest_days INTEGER,
  companion_crops TEXT[],
  description TEXT,
  brix_target_min INTEGER DEFAULT 12,
  brix_target_max INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create soil_amendments table for Master Mix components
CREATE TABLE public.soil_amendments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity_per_60ft TEXT NOT NULL,
  description TEXT,
  nutrient_contribution TEXT,
  frequency_affinity INTEGER[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.master_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_amendments ENABLE ROW LEVEL SECURITY;

-- Public read access for both tables (reference data)
CREATE POLICY "Master crops are publicly readable"
  ON public.master_crops FOR SELECT
  USING (true);

CREATE POLICY "Soil amendments are publicly readable"
  ON public.soil_amendments FOR SELECT
  USING (true);

-- Only admins can modify
CREATE POLICY "Only admins can insert master crops"
  ON public.master_crops FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update master crops"
  ON public.master_crops FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete master crops"
  ON public.master_crops FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can insert soil amendments"
  ON public.soil_amendments FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update soil amendments"
  ON public.soil_amendments FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete soil amendments"
  ON public.soil_amendments FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_master_crops_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_master_crops_updated_at
  BEFORE UPDATE ON public.master_crops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_master_crops_updated_at();