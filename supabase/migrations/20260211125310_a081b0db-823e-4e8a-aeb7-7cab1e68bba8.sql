
-- Store readiness checklist state per user
CREATE TABLE public.readiness_checklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  checked_items TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT readiness_checklist_user_unique UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.readiness_checklist ENABLE ROW LEVEL SECURITY;

-- Users can view their own checklist
CREATE POLICY "Users can view their own readiness checklist"
ON public.readiness_checklist FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own checklist
CREATE POLICY "Users can insert their own readiness checklist"
ON public.readiness_checklist FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own checklist
CREATE POLICY "Users can update their own readiness checklist"
ON public.readiness_checklist FOR UPDATE
USING (auth.uid() = user_id);
