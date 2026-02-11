
-- Add yield and cost estimation columns to master_crops
ALTER TABLE public.master_crops
  ADD COLUMN est_yield_lbs_per_plant numeric NULL,
  ADD COLUMN seed_cost_cents integer NULL;

COMMENT ON COLUMN public.master_crops.est_yield_lbs_per_plant IS 'Estimated yield in pounds per plant over a season';
COMMENT ON COLUMN public.master_crops.seed_cost_cents IS 'Approximate seed/start cost per plant in cents (USD)';
