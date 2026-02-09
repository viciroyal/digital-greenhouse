
-- Add spacing and library_note columns to master_crops
ALTER TABLE public.master_crops 
ADD COLUMN spacing_inches text,
ADD COLUMN library_note text;

-- Add comment for documentation
COMMENT ON COLUMN public.master_crops.spacing_inches IS 'Recommended planting spacing in inches';
COMMENT ON COLUMN public.master_crops.library_note IS 'Practical field wisdom for this crop';
