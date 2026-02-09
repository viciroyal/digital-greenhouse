-- Add inoculant_type column for the "11th Interval" (Fungal Network)
ALTER TABLE public.garden_beds
ADD COLUMN inoculant_type text DEFAULT NULL;

-- Add a comment explaining the column
COMMENT ON COLUMN public.garden_beds.inoculant_type IS 'The 11th Interval - Fungal Network inoculant type (Mycorrhizae, Wine Cap, Oyster, Reishi)';