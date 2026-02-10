-- Standardize bed width to 30 inches (2.5 ft)
ALTER TABLE public.garden_beds ALTER COLUMN bed_width_ft SET DEFAULT 2.5;

-- Update all existing beds that still have the old 4ft default
UPDATE public.garden_beds SET bed_width_ft = 2.5 WHERE bed_width_ft = 4;