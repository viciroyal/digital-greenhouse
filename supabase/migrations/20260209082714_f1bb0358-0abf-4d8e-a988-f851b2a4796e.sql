-- Add instrument_type column to master_crops for categorizing crops by musical role
ALTER TABLE public.master_crops 
ADD COLUMN IF NOT EXISTS instrument_type text;

-- Add comment explaining the column
COMMENT ON COLUMN public.master_crops.instrument_type IS 'Musical instrument categorization: Electric Guitar (Nightshades), Percussion (Grains), Horn Section (Brassicas), Bass (Alliums), Synthesizers (Herbs/Flowers)';

-- Update existing crops with their instrument types based on category
UPDATE public.master_crops SET instrument_type = 'Electric Guitar' 
WHERE category IN ('vegetable') AND (
  LOWER(name) LIKE '%tomato%' OR 
  LOWER(name) LIKE '%eggplant%' OR 
  LOWER(name) LIKE '%pepper%' OR 
  LOWER(name) LIKE '%potato%' OR
  LOWER(name) LIKE '%tomatillo%'
);

UPDATE public.master_crops SET instrument_type = 'Percussion' 
WHERE category IN ('grain', 'vegetable') AND (
  LOWER(name) LIKE '%corn%' OR 
  LOWER(name) LIKE '%wheat%' OR 
  LOWER(name) LIKE '%oat%' OR 
  LOWER(name) LIKE '%millet%' OR
  LOWER(name) LIKE '%sorghum%' OR
  LOWER(name) LIKE '%amaranth%'
);

UPDATE public.master_crops SET instrument_type = 'Horn Section' 
WHERE category IN ('vegetable') AND (
  LOWER(name) LIKE '%kale%' OR 
  LOWER(name) LIKE '%broccoli%' OR 
  LOWER(name) LIKE '%cabbage%' OR 
  LOWER(name) LIKE '%collard%' OR
  LOWER(name) LIKE '%cauliflower%' OR
  LOWER(name) LIKE '%brussels%' OR
  LOWER(name) LIKE '%kohlrabi%'
);

UPDATE public.master_crops SET instrument_type = 'Bass' 
WHERE category IN ('vegetable') AND (
  LOWER(name) LIKE '%garlic%' OR 
  LOWER(name) LIKE '%onion%' OR 
  LOWER(name) LIKE '%leek%' OR 
  LOWER(name) LIKE '%shallot%' OR
  LOWER(name) LIKE '%chive%' OR
  LOWER(name) LIKE '%scallion%'
);

UPDATE public.master_crops SET instrument_type = 'Synthesizers' 
WHERE category IN ('herb', 'flower', 'vegetable') AND (
  LOWER(name) LIKE '%basil%' OR 
  LOWER(name) LIKE '%cilantro%' OR 
  LOWER(name) LIKE '%dill%' OR 
  LOWER(name) LIKE '%fennel%' OR
  LOWER(name) LIKE '%marigold%' OR
  LOWER(name) LIKE '%sunflower%' OR
  LOWER(name) LIKE '%calendula%' OR
  LOWER(name) LIKE '%lavender%' OR
  LOWER(name) LIKE '%chamomile%'
);