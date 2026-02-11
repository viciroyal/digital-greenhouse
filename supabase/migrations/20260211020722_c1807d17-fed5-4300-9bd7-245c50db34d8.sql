-- Add USDA hardiness zone range to master_crops
ALTER TABLE public.master_crops
ADD COLUMN hardiness_zone_min integer DEFAULT NULL,
ADD COLUMN hardiness_zone_max integer DEFAULT NULL;

-- Add index for zone filtering
CREATE INDEX idx_master_crops_hardiness ON public.master_crops (hardiness_zone_min, hardiness_zone_max);

COMMENT ON COLUMN public.master_crops.hardiness_zone_min IS 'Minimum USDA hardiness zone (1-13)';
COMMENT ON COLUMN public.master_crops.hardiness_zone_max IS 'Maximum USDA hardiness zone (1-13)';