-- Add cultural role, dominant mineral, crop guild, and soil protocol columns to master_crops
ALTER TABLE public.master_crops 
ADD COLUMN IF NOT EXISTS cultural_role TEXT,
ADD COLUMN IF NOT EXISTS dominant_mineral TEXT,
ADD COLUMN IF NOT EXISTS crop_guild TEXT[],
ADD COLUMN IF NOT EXISTS soil_protocol_focus TEXT;