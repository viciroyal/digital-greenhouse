import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Module {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  lineage: string;
  chakra_color: string;
  icon_name: string | null;
  order_index: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  name: string;
  display_name: string;
  description: string | null;
  video_url: string | null;
  order_index: number;
}

export interface ModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  unlocked_at: string;
  completed_at: string | null;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
  notes: string | null;
}

export interface FieldJournalEntry {
  id: string;
  user_id: string;
  lesson_id: string;
  file_path: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  status: 'pending' | 'reviewed' | 'certified';
  uploaded_at: string;
}

export function useAncestralProgress() {
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [fieldJournal, setFieldJournal] = useState<FieldJournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { toast } = useToast();

  // Fetch all data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      // Fetch modules (public)
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true });

      if (modulesError) throw modulesError;
      setModules(modulesData || []);

      // Fetch lessons (public)
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // If user is authenticated, fetch their progress
      if (currentUser) {
        const { data: moduleProgressData } = await supabase
          .from('user_module_progress')
          .select('*');
        setModuleProgress(moduleProgressData || []);

        const { data: lessonProgressData } = await supabase
          .from('user_lesson_progress')
          .select('*');
        setLessonProgress(lessonProgressData || []);

        const { data: journalData } = await supabase
          .from('field_journal')
          .select('*');
        // Cast status to proper type
        setFieldJournal((journalData || []).map(j => ({
          ...j,
          status: j.status as 'pending' | 'reviewed' | 'certified'
        })));
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchData();
    });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  // Check if module is unlocked
  const isModuleUnlocked = useCallback((moduleId: string): boolean => {
    // First module is always unlocked for viewing (even if not logged in)
    const module = modules.find(m => m.id === moduleId);
    if (module?.order_index === 1) return true;
    
    // Check if user has progress for this module
    return moduleProgress.some(p => p.module_id === moduleId);
  }, [modules, moduleProgress]);

  // Check if module is completed
  const isModuleCompleted = useCallback((moduleId: string): boolean => {
    const progress = moduleProgress.find(p => p.module_id === moduleId);
    return !!progress?.completed_at;
  }, [moduleProgress]);

  // Check if lesson is completed
  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    return lessonProgress.some(p => p.lesson_id === lessonId);
  }, [lessonProgress]);

  // Get lessons for a module
  const getLessonsForModule = useCallback((moduleId: string): Lesson[] => {
    return lessons.filter(l => l.module_id === moduleId);
  }, [lessons]);

  // Get module completion percentage
  const getModuleCompletionPercent = useCallback((moduleId: string): number => {
    const moduleLessons = getLessonsForModule(moduleId);
    if (moduleLessons.length === 0) return 0;
    
    const completedCount = moduleLessons.filter(l => 
      isLessonCompleted(l.id)
    ).length;
    
    return Math.round((completedCount / moduleLessons.length) * 100);
  }, [getLessonsForModule, isLessonCompleted]);

  // Complete a lesson
  const completeLesson = useCallback(async (lessonId: string, notes?: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to track your progress",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_lesson_progress')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          notes: notes || null,
        });

      if (error) {
        if (error.code === '23505') {
          // Already completed
          return true;
        }
        throw error;
      }

      // Refresh data
      await fetchData();

      toast({
        title: "Lesson Completed",
        description: "Your progress has been recorded",
      });

      return true;
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive",
      });
      return false;
    }
  }, [user, fetchData, toast]);

  // Upload file to field journal
  const uploadToJournal = useCallback(async (
    lessonId: string, 
    file: File
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload evidence",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Upload file to storage
      // Path format: {user_id}/{lesson_id}/{timestamp}-{filename}
      const filePath = `${user.id}/${lessonId}/${Date.now()}-${file.name}`;
      
      console.log('Uploading file:', { filePath, fileName: file.name, fileSize: file.size, fileType: file.type });
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('field-journal')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        toast({
          title: "Upload Failed",
          description: uploadError.message || "Could not upload file to storage",
          variant: "destructive",
        });
        return false;
      }

      console.log('Upload successful:', uploadData);

      // Record in field_journal table
      const { error: dbError } = await supabase
        .from('field_journal')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          file_path: filePath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          status: 'pending',
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        toast({
          title: "Record Failed",
          description: dbError.message || "File uploaded but could not save record",
          variant: "destructive",
        });
        return false;
      }

      // Refresh data
      await fetchData();

      toast({
        title: "Evidence Submitted",
        description: "Awaiting Hogon's review",
      });

      return true;
    } catch (error) {
      console.error('Error uploading to journal:', error);
      toast({
        title: "Upload Failed",
        description: "Could not save your evidence",
        variant: "destructive",
      });
      return false;
    }
  }, [user, fetchData, toast]);

  // Get journal entries for a lesson
  const getJournalEntriesForLesson = useCallback((lessonId: string): FieldJournalEntry[] => {
    return fieldJournal.filter(j => j.lesson_id === lessonId);
  }, [fieldJournal]);

  // Get overall progress percentage
  const getOverallProgress = useCallback((): number => {
    if (lessons.length === 0) return 0;
    const completedCount = lessonProgress.length;
    return Math.round((completedCount / lessons.length) * 100);
  }, [lessons, lessonProgress]);

  // Initialize first module for new authenticated users
  const initializeProgress = useCallback(async () => {
    if (!user) return;
    
    const firstModule = modules.find(m => m.order_index === 1);
    if (!firstModule) return;
    
    // Check if already has progress
    const hasProgress = moduleProgress.some(p => p.module_id === firstModule.id);
    if (hasProgress) return;

    try {
      await supabase
        .from('user_module_progress')
        .insert({
          user_id: user.id,
          module_id: firstModule.id,
        });
      
      await fetchData();
    } catch (error) {
      console.error('Error initializing progress:', error);
    }
  }, [user, modules, moduleProgress, fetchData]);

  // Auto-initialize when user and modules are loaded
  useEffect(() => {
    if (user && modules.length > 0 && !isLoading) {
      initializeProgress();
    }
  }, [user, modules, isLoading, initializeProgress]);

  return {
    // Data
    modules,
    lessons,
    moduleProgress,
    lessonProgress,
    fieldJournal,
    user,
    isLoading,
    
    // Computed
    isModuleUnlocked,
    isModuleCompleted,
    isLessonCompleted,
    getLessonsForModule,
    getModuleCompletionPercent,
    getJournalEntriesForLesson,
    getOverallProgress,
    
    // Actions
    completeLesson,
    uploadToJournal,
    refreshData: fetchData,
  };
}
