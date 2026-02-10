
-- Create saved_recipes table
CREATE TABLE public.saved_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  environment TEXT NOT NULL,
  zone_hz INTEGER NOT NULL,
  zone_name TEXT NOT NULL,
  zone_vibe TEXT NOT NULL,
  chord_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT
);

-- Enable RLS
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;

-- Users can view their own recipes
CREATE POLICY "Users can view their own recipes"
  ON public.saved_recipes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own recipes
CREATE POLICY "Users can insert their own recipes"
  ON public.saved_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own recipes
CREATE POLICY "Users can delete their own recipes"
  ON public.saved_recipes FOR DELETE
  USING (auth.uid() = user_id);
