
-- Add guild_role column for crop ecological roles
ALTER TABLE public.master_crops 
ADD COLUMN guild_role text;

COMMENT ON COLUMN public.master_crops.guild_role IS 'Ecological role: Lead, Sentinel, Miner, or Enhancer';
