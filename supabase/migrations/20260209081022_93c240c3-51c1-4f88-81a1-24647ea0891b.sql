-- Add aerial_crop_id column for the "13th Interval" (Aerial Signal / Overstory)
ALTER TABLE public.garden_beds
ADD COLUMN aerial_crop_id uuid REFERENCES public.master_crops(id) DEFAULT NULL;

-- Add a comment explaining the column
COMMENT ON COLUMN public.garden_beds.aerial_crop_id IS 'The 13th Interval - Aerial Signal overstory crop (1 per 100 sq ft scattered pattern)';