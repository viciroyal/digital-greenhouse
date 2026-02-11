-- Add propagation method column to master_crops
-- Values: 'direct_sow', 'transplant', 'both'
ALTER TABLE public.master_crops 
ADD COLUMN propagation_method text DEFAULT 'both';

-- Populate based on growth_habit and known horticultural patterns
-- Trees, shrubs, vines → transplant (started from nursery stock / cuttings)
UPDATE public.master_crops SET propagation_method = 'transplant' 
WHERE growth_habit IN ('tree', 'shrub', 'bush', 'vine', 'epiphyte');

-- Root crops, tubers, bulbs → direct sow (planted in place)
UPDATE public.master_crops SET propagation_method = 'direct_sow' 
WHERE growth_habit IN ('root', 'tuber', 'bulb', 'rhizome', 'underground');

-- Ground cover, grass → direct sow
UPDATE public.master_crops SET propagation_method = 'direct_sow' 
WHERE growth_habit IN ('ground cover', 'grass');

-- Fungus → direct sow (inoculate in place)
UPDATE public.master_crops SET propagation_method = 'direct_sow' 
WHERE growth_habit = 'fungus';

-- Aquatic → transplant
UPDATE public.master_crops SET propagation_method = 'transplant' 
WHERE growth_habit = 'aquatic';

-- Herbs and succulents → both (many can go either way)
UPDATE public.master_crops SET propagation_method = 'both' 
WHERE growth_habit IN ('herb', 'succulent');

-- Override specific crops known to be DIRECT SOW ONLY
UPDATE public.master_crops SET propagation_method = 'direct_sow' 
WHERE lower(common_name) IN (
  'carrot', 'radish', 'beet', 'turnip', 'parsnip',
  'beans', 'peas', 'corn', 'okra', 'squash', 'cucumber',
  'melon', 'watermelon', 'pumpkin', 'zucchini',
  'lettuce', 'spinach', 'arugula', 'cilantro', 'dill',
  'garlic', 'onion sets'
);

-- Override specific crops known to be TRANSPLANT PREFERRED
UPDATE public.master_crops SET propagation_method = 'transplant' 
WHERE lower(common_name) IN (
  'tomato', 'pepper', 'eggplant', 'broccoli', 'cauliflower',
  'cabbage', 'kale', 'brussels sprouts', 'celery',
  'artichoke', 'asparagus', 'strawberry', 'sweet potato'
);

-- Override crops that truly work BOTH ways
UPDATE public.master_crops SET propagation_method = 'both' 
WHERE lower(common_name) IN (
  'basil', 'oregano', 'thyme', 'sage', 'rosemary',
  'chard', 'collard greens', 'kohlrabi', 'leek'
);