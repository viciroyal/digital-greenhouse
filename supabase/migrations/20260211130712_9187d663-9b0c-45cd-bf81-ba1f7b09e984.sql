
-- Add root depth (inches) and minimum container size (gallons) to master_crops
ALTER TABLE public.master_crops
ADD COLUMN root_depth_inches integer DEFAULT NULL,
ADD COLUMN min_container_gal numeric DEFAULT NULL;

-- Add a comment for clarity
COMMENT ON COLUMN public.master_crops.root_depth_inches IS 'Typical root depth in inches — used for hole sizing and container recommendations';
COMMENT ON COLUMN public.master_crops.min_container_gal IS 'Minimum container size in gallons for pot culture';
