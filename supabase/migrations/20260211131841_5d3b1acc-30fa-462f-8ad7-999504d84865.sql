-- Add scientific_name column to master_crops
ALTER TABLE public.master_crops
ADD COLUMN scientific_name text DEFAULT NULL;

-- Add index for searching by scientific name
CREATE INDEX idx_master_crops_scientific_name ON public.master_crops (scientific_name);