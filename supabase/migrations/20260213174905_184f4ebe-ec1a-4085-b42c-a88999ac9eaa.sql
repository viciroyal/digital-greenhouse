-- Add missing UPDATE policy for saved_recipes so users can modify their own recipes
CREATE POLICY "Users can update their own recipes"
ON public.saved_recipes
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);