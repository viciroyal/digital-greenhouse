-- Add admin-only INSERT policy for modules table
CREATE POLICY "Only admins can insert modules"
ON public.modules
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add admin-only UPDATE policy for modules table
CREATE POLICY "Only admins can update modules"
ON public.modules
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin-only DELETE policy for modules table
CREATE POLICY "Only admins can delete modules"
ON public.modules
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin-only INSERT policy for lessons table (same vulnerability pattern)
CREATE POLICY "Only admins can insert lessons"
ON public.lessons
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add admin-only UPDATE policy for lessons table
CREATE POLICY "Only admins can update lessons"
ON public.lessons
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin-only DELETE policy for lessons table
CREATE POLICY "Only admins can delete lessons"
ON public.lessons
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));