-- Change hardiness zone columns from integer to numeric for sub-zone precision
-- Sub-zone encoding: "a" = X.0, "b" = X.5 (e.g., 8a = 8.0, 8b = 8.5)
ALTER TABLE public.master_crops 
  ALTER COLUMN hardiness_zone_min TYPE numeric USING hardiness_zone_min::numeric,
  ALTER COLUMN hardiness_zone_max TYPE numeric USING hardiness_zone_max::numeric;

-- Set sub-zone defaults: min zones get "a" (X.0), max zones get "b" (X.5)
-- This is the most inclusive interpretation
UPDATE public.master_crops 
SET hardiness_zone_max = hardiness_zone_max + 0.5
WHERE hardiness_zone_max IS NOT NULL;