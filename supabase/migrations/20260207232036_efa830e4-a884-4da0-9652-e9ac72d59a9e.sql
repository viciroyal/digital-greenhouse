-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add UPDATE policy for field_journal so admins can certify submissions
CREATE POLICY "Admins can update any field journal entry"
  ON public.field_journal FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Add SELECT policy for field_journal so admins can view all submissions
CREATE POLICY "Admins can view all field journal entries"
  ON public.field_journal FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add UPDATE policy for regular users (just their own entries, for future use)
CREATE POLICY "Users can update their own field journal entries"
  ON public.field_journal FOR UPDATE
  USING (user_id = auth.uid());