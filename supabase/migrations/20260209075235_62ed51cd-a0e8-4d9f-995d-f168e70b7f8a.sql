-- Add chord_interval column for musical mapping
ALTER TABLE public.master_crops
ADD COLUMN chord_interval text;

-- Add comment explaining the column
COMMENT ON COLUMN public.master_crops.chord_interval IS 'Musical interval mapping: Root (Lead), 3rd (Triad), 5th (Stabilizer), 7th (Signal)';

-- Update existing crops to map guild_role to chord_interval
UPDATE public.master_crops
SET chord_interval = CASE 
  WHEN guild_role = 'Lead' THEN 'Root (Lead)'
  WHEN guild_role = 'Sentinel' THEN '3rd (Triad)'
  WHEN guild_role = 'Miner' THEN '5th (Stabilizer)'
  WHEN guild_role = 'Enhancer' THEN '7th (Signal)'
  ELSE NULL
END;

-- Update category values to new Chord Expansion categories
-- Map existing categories to new system
UPDATE public.master_crops
SET category = CASE 
  WHEN category IN ('vegetable', 'fruit', 'grain') THEN 'Sustenance'
  WHEN category IN ('herb', 'legume') THEN 'Nitrogen/Bio-Mass'
  WHEN category = 'flower' THEN 'Dye/Fiber/Aromatic'
  ELSE 'Sustenance'
END;