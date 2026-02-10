-- Add customizable bed dimensions to garden_beds (defaults match current hardcoded values)
ALTER TABLE public.garden_beds
  ADD COLUMN bed_length_ft numeric NOT NULL DEFAULT 60,
  ADD COLUMN bed_width_ft numeric NOT NULL DEFAULT 4;