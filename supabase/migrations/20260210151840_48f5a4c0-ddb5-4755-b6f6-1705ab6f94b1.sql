
CREATE TABLE public.saved_soil_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Config',
  environment TEXT NOT NULL,
  bed_width NUMERIC,
  bed_length NUMERIC,
  container_size TEXT,
  custom_gallons NUMERIC,
  frequency_hz INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_soil_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own soil configs"
  ON public.saved_soil_configs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own soil configs"
  ON public.saved_soil_configs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own soil configs"
  ON public.saved_soil_configs FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own soil configs"
  ON public.saved_soil_configs FOR UPDATE
  USING (auth.uid() = user_id);
