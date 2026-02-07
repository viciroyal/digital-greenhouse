-- =============================================
-- ANCESTRAL PATH PROGRESS TRACKING SCHEMA
-- =============================================

-- 1. MODULES TABLE (The 4 chakra-aligned learning paths)
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  lineage TEXT NOT NULL,
  chakra_color TEXT NOT NULL,
  icon_name TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. LESSONS TABLE (Individual lessons within each module)
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(module_id, order_index)
);

-- 3. USER MODULE PROGRESS (Tracks which modules are unlocked/completed)
CREATE TABLE public.user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- 4. USER LESSON PROGRESS (Tracks which lessons are completed)
CREATE TABLE public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 5. FIELD JOURNAL (Uploaded evidence files)
CREATE TABLE public.field_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'certified')),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_journal ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Modules: Everyone can read (public curriculum)
CREATE POLICY "Modules are publicly readable"
  ON public.modules FOR SELECT
  USING (true);

-- Lessons: Everyone can read (public curriculum)
CREATE POLICY "Lessons are publicly readable"
  ON public.lessons FOR SELECT
  USING (true);

-- User Module Progress: Users can only access their own
CREATE POLICY "Users can view their own module progress"
  ON public.user_module_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own module progress"
  ON public.user_module_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own module progress"
  ON public.user_module_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own module progress"
  ON public.user_module_progress FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- User Lesson Progress: Users can only access their own
CREATE POLICY "Users can view their own lesson progress"
  ON public.user_lesson_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own lesson progress"
  ON public.user_lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own lesson progress"
  ON public.user_lesson_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own lesson progress"
  ON public.user_lesson_progress FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Field Journal: Users can only access their own uploads
CREATE POLICY "Users can view their own field journal entries"
  ON public.field_journal FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can upload to their own field journal"
  ON public.field_journal FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own field journal entries"
  ON public.field_journal FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================
-- STORAGE BUCKET FOR FIELD JOURNAL FILES
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('field-journal', 'field-journal', false);

-- Storage policies for field journal bucket
CREATE POLICY "Users can upload their own field journal files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'field-journal' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own field journal files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'field-journal' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own field journal files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'field-journal' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- =============================================
-- HELPER FUNCTION: Auto-unlock first module on signup
-- =============================================

CREATE OR REPLACE FUNCTION public.initialize_user_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  first_module_id UUID;
BEGIN
  -- Get the first module (Root Protocol)
  SELECT id INTO first_module_id FROM public.modules WHERE order_index = 1;
  
  -- Auto-unlock the first module for new users
  IF first_module_id IS NOT NULL THEN
    INSERT INTO public.user_module_progress (user_id, module_id, unlocked_at)
    VALUES (NEW.id, first_module_id, now())
    ON CONFLICT (user_id, module_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to initialize progress when user signs up
CREATE TRIGGER on_auth_user_created_init_progress
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_user_progress();

-- =============================================
-- HELPER FUNCTION: Check module completion and unlock next
-- =============================================

CREATE OR REPLACE FUNCTION public.check_module_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_module_id UUID;
  v_total_lessons INTEGER;
  v_completed_lessons INTEGER;
  v_current_order INTEGER;
  v_next_module_id UUID;
BEGIN
  -- Get the module for this lesson
  SELECT module_id INTO v_module_id FROM public.lessons WHERE id = NEW.lesson_id;
  
  -- Count total and completed lessons for this module
  SELECT COUNT(*) INTO v_total_lessons 
  FROM public.lessons WHERE module_id = v_module_id;
  
  SELECT COUNT(*) INTO v_completed_lessons 
  FROM public.user_lesson_progress ulp
  JOIN public.lessons l ON l.id = ulp.lesson_id
  WHERE ulp.user_id = NEW.user_id AND l.module_id = v_module_id;
  
  -- If all lessons completed, mark module as complete and unlock next
  IF v_completed_lessons >= v_total_lessons THEN
    -- Mark current module complete
    UPDATE public.user_module_progress 
    SET completed_at = now()
    WHERE user_id = NEW.user_id AND module_id = v_module_id;
    
    -- Get current module order
    SELECT order_index INTO v_current_order FROM public.modules WHERE id = v_module_id;
    
    -- Get next module
    SELECT id INTO v_next_module_id FROM public.modules 
    WHERE order_index = v_current_order + 1;
    
    -- Unlock next module if exists
    IF v_next_module_id IS NOT NULL THEN
      INSERT INTO public.user_module_progress (user_id, module_id, unlocked_at)
      VALUES (NEW.user_id, v_next_module_id, now())
      ON CONFLICT (user_id, module_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to check completion after lesson progress is inserted
CREATE TRIGGER on_lesson_completed
  AFTER INSERT ON public.user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.check_module_completion();

-- =============================================
-- SEED DATA: The 4 Ancestral Modules
-- =============================================

INSERT INTO public.modules (name, display_name, description, lineage, chakra_color, icon_name, order_index) VALUES
  ('root-protocol', 'ROOT PROTOCOL', 'Master the foundations of soil science and survival agriculture', 'Muscogee & Maroons', 'hsl(0 100% 50%)', 'spiral-mound', 1),
  ('star-structure', 'STAR STRUCTURE', 'Align your farming practice with cosmic cycles', 'Dogon', 'hsl(195 100% 50%)', 'kanaga-mask', 2),
  ('dream-vision', 'DREAM VISION', 'Connect to the Dreamlines and ancestral frequency', 'Aboriginal', 'hsl(275 100% 25%)', 'dot-circle', 3),
  ('gold-alchemy', 'GOLD ALCHEMY', 'Master the transmutation of soil into gold-tier nutrition', 'Kemetic', 'hsl(51 100% 50%)', 'sun-disc', 4);

-- SEED DATA: Sample lessons for each module
INSERT INTO public.lessons (module_id, name, display_name, description, order_index) VALUES
  -- Root Protocol (Module 1)
  ((SELECT id FROM public.modules WHERE name = 'root-protocol'), 'soil-memory', 'The Memory of Soil', 'Understanding how soil stores ancestral knowledge', 1),
  ((SELECT id FROM public.modules WHERE name = 'root-protocol'), 'compost-alchemy', 'Compost Alchemy', 'Building living soil through decomposition', 2),
  ((SELECT id FROM public.modules WHERE name = 'root-protocol'), 'root-network', 'The Root Network', 'Creating mycelial connections in your garden', 3),
  
  -- Star Structure (Module 2)
  ((SELECT id FROM public.modules WHERE name = 'star-structure'), 'lunar-planting', 'Lunar Planting Cycles', 'Timing your seeds with the moon', 1),
  ((SELECT id FROM public.modules WHERE name = 'star-structure'), 'sirius-alignment', 'Sirius Alignment', 'The Dogon calendar and agricultural timing', 2),
  ((SELECT id FROM public.modules WHERE name = 'star-structure'), 'zodiac-harvest', 'Zodiac Harvest', 'Matching crops to celestial patterns', 3),
  
  -- Dream Vision (Module 3)
  ((SELECT id FROM public.modules WHERE name = 'dream-vision'), 'songlines', 'Walking the Songlines', 'Navigating land through frequency', 1),
  ((SELECT id FROM public.modules WHERE name = 'dream-vision'), 'plant-dreaming', 'Plant Dreaming', 'Receiving guidance from plant spirits', 2),
  ((SELECT id FROM public.modules WHERE name = 'dream-vision'), 'frequency-farming', 'Frequency Farming', 'Using sound and vibration in agriculture', 3),
  
  -- Gold Alchemy (Module 4)
  ((SELECT id FROM public.modules WHERE name = 'gold-alchemy'), 'brix-mastery', 'Brix Mastery', 'Measuring and maximizing plant sugar content', 1),
  ((SELECT id FROM public.modules WHERE name = 'gold-alchemy'), 'mineral-gold', 'Mineral Gold', 'Trace elements and nutritional density', 2),
  ((SELECT id FROM public.modules WHERE name = 'gold-alchemy'), 'final-transmutation', 'The Final Transmutation', 'Achieving master steward status', 3);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_user_module_progress_user_id ON public.user_module_progress(user_id);
CREATE INDEX idx_user_lesson_progress_user_id ON public.user_lesson_progress(user_id);
CREATE INDEX idx_field_journal_user_id ON public.field_journal(user_id);
CREATE INDEX idx_field_journal_lesson_id ON public.field_journal(lesson_id);