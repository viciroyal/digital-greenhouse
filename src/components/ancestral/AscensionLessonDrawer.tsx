import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Check, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LessonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  level: number | null;
  onLevelComplete?: () => void;
}

// Content mapping for each level (module_order -> content)
const levelContent: Record<number, {
  orisha: string;
  title: string;
  transmission: string;
  journalTask: string;
  color: string;
}> = {
  1: {
    orisha: 'OGUN',
    title: 'THE IRON ROOT',
    transmission: 'Protocol: No-Till Clay Management & Trap Crops.',
    journalTask: 'Upload photo of Broadforking or Drill Radishes.',
    color: '#ff0000',
  },
  2: {
    orisha: 'BABALU AYE',
    title: 'THE MAGNETIC EARTH',
    transmission: 'Protocol: Paramagnetism (Basalt Rock Dust).',
    journalTask: 'Upload photo of Rock Dust Application.',
    color: '#ffbf00',
  },
  3: {
    orisha: 'SHANGO',
    title: 'THE THUNDER SIGNAL',
    transmission: 'Protocol: Electroculture (Copper Spirals) & Agnihotra (Fire).',
    journalTask: 'Upload photo of Copper Antenna or Fire Ritual.',
    color: '#00bfff',
  },
  4: {
    orisha: 'OSHUN',
    title: 'THE SWEET ALCHEMY',
    transmission: 'Protocol: High Brix & JADAM Ferments.',
    journalTask: 'Upload Refractometer Reading (12+ Brix).',
    color: '#ffd700',
  },
};

interface Lesson {
  id: string;
  name: string;
  display_name: string;
  order_index: number;
}

/**
 * Lesson Drawer - Side panel for lesson content
 * Two tabs: THE TRANSMISSION and THE FIELD JOURNAL
 */
const LessonDrawer = ({ isOpen, onClose, level, onLevelComplete }: LessonDrawerProps) => {
  const [activeTab, setActiveTab] = useState<'transmission' | 'journal'>('transmission');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { toast } = useToast();

  const content = level ? levelContent[level] : null;

  // Fetch user and lessons when drawer opens
  useEffect(() => {
    if (isOpen && level) {
      // Reset state
      setSelectedFile(null);
      setUploadSuccess(false);
      setError(null);
      setActiveTab('transmission');
      
      // Get current user
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user ? { id: data.user.id } : null);
      });

      // Fetch lessons for this level (module)
      fetchLessonsForLevel(level);
    }
  }, [isOpen, level]);

  const fetchLessonsForLevel = async (moduleOrder: number) => {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        id,
        name,
        display_name,
        order_index,
        modules!inner(order_index)
      `)
      .eq('modules.order_index', moduleOrder)
      .order('order_index');

    if (error) {
      console.error('Error fetching lessons:', error);
      return;
    }

    if (data && data.length > 0) {
      setLessons(data);
      setSelectedLessonId(data[0].id); // Default to first lesson
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
    setUploadSuccess(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedLessonId || !user) {
      if (!user) {
        setError('Please sign in to submit your field journal');
        toast({
          title: "Authentication Required",
          description: "Please sign in to submit your field journal.",
          variant: "destructive",
        });
      }
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Generate unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${selectedLessonId}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('field-journal')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Create field_journal entry
      const { error: journalError } = await supabase
        .from('field_journal')
        .insert({
          user_id: user.id,
          lesson_id: selectedLessonId,
          file_path: fileName,
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          status: 'pending',
        });

      if (journalError) {
        throw new Error(`Journal entry failed: ${journalError.message}`);
      }

      // Mark lesson as complete (this triggers the module completion check)
      const { error: progressError } = await supabase
        .from('user_lesson_progress')
        .insert({
          user_id: user.id,
          lesson_id: selectedLessonId,
          notes: `Field journal submitted: ${selectedFile.name}`,
        });

      if (progressError && !progressError.message.includes('duplicate')) {
        throw new Error(`Progress update failed: ${progressError.message}`);
      }

      setUploadSuccess(true);
      toast({
        title: "Submission Received!",
        description: "Your field journal has been submitted to the Hogon for review.",
      });

      // Notify parent of potential level completion
      if (onLevelComplete) {
        onLevelComplete();
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast({
        title: "Submission Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && content && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md z-[95] overflow-y-auto"
            style={{
              background: 'rgba(20, 20, 15, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderLeft: `1px solid ${content.color}40`,
              boxShadow: `-10px 0 40px rgba(0, 0, 0, 0.5), 0 0 30px ${content.color}20`,
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-6 right-6 z-10 p-2 rounded-full"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid hsl(0 0% 30%)',
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
              }}
              onClick={onClose}
            >
              <X className="w-5 h-5 text-white hover:text-red-500 transition-colors" />
            </motion.button>

            {/* Header */}
            <div className="p-6 pt-8 border-b" style={{ borderColor: `${content.color}30` }}>
              <p 
                className="text-sm tracking-[0.3em] mb-2"
                style={{ 
                  fontFamily: "'Space Mono', monospace",
                  color: content.color,
                }}
              >
                {content.orisha}
              </p>
              <h2 
                className="text-2xl tracking-wide"
                style={{ 
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'white',
                  textShadow: `0 0 20px ${content.color}40`,
                }}
              >
                {content.title}
              </h2>
              {!user && (
                <p 
                  className="text-xs mt-2"
                  style={{ 
                    fontFamily: "'Space Mono', monospace",
                    color: 'hsl(0 60% 60%)',
                  }}
                >
                  ⚠ Sign in to track progress
                </p>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: `${content.color}20` }}>
              <button
                className="flex-1 py-4 px-4 text-sm tracking-widest transition-all"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: activeTab === 'transmission' ? content.color : 'hsl(0 0% 50%)',
                  background: activeTab === 'transmission' ? `${content.color}15` : 'transparent',
                  borderBottom: activeTab === 'transmission' ? `2px solid ${content.color}` : '2px solid transparent',
                }}
                onClick={() => setActiveTab('transmission')}
              >
                THE TRANSMISSION
              </button>
              <button
                className="flex-1 py-4 px-4 text-sm tracking-widest transition-all"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: activeTab === 'journal' ? content.color : 'hsl(0 0% 50%)',
                  background: activeTab === 'journal' ? `${content.color}15` : 'transparent',
                  borderBottom: activeTab === 'journal' ? `2px solid ${content.color}` : '2px solid transparent',
                }}
                onClick={() => setActiveTab('journal')}
              >
                THE FIELD JOURNAL
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'transmission' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  {/* Lore Section */}
                  <div className="space-y-3">
                    <h3 
                      className="text-xs tracking-[0.2em]"
                      style={{ 
                        fontFamily: "'Space Mono', monospace",
                        color: 'hsl(0 0% 50%)',
                      }}
                    >
                      PROTOCOL
                    </h3>
                    <p 
                      className="text-lg leading-relaxed"
                      style={{ 
                        fontFamily: "'Space Mono', monospace",
                        color: 'hsl(0 0% 85%)',
                      }}
                    >
                      {content.transmission}
                    </p>
                  </div>

                  {/* Lessons List */}
                  {lessons.length > 0 && (
                    <div className="space-y-3">
                      <h3 
                        className="text-xs tracking-[0.2em]"
                        style={{ 
                          fontFamily: "'Space Mono', monospace",
                          color: 'hsl(0 0% 50%)',
                        }}
                      >
                        LESSONS
                      </h3>
                      <div className="space-y-2">
                        {lessons.map((lesson, index) => (
                          <div
                            key={lesson.id}
                            className="p-3 rounded-lg"
                            style={{
                              background: 'rgba(0, 0, 0, 0.2)',
                              border: `1px solid ${content.color}20`,
                            }}
                          >
                            <p 
                              className="text-sm"
                              style={{ 
                                fontFamily: "'Space Mono', monospace",
                                color: 'hsl(0 0% 75%)',
                              }}
                            >
                              {index + 1}. {lesson.display_name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div 
                    className="h-px w-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${content.color}40, transparent)` }}
                  />

                  {/* Placeholder for video/content */}
                  <div 
                    className="aspect-video rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: `1px dashed ${content.color}40`,
                    }}
                  >
                    <p 
                      className="text-sm"
                      style={{ 
                        fontFamily: "'Space Mono', monospace",
                        color: 'hsl(0 0% 40%)',
                      }}
                    >
                      [VIDEO TRANSMISSION]
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  {/* Task Description */}
                  <div className="space-y-3">
                    <h3 
                      className="text-xs tracking-[0.2em]"
                      style={{ 
                        fontFamily: "'Space Mono', monospace",
                        color: 'hsl(0 0% 50%)',
                      }}
                    >
                      YOUR TASK
                    </h3>
                    <p 
                      className="text-lg leading-relaxed"
                      style={{ 
                        fontFamily: "'Space Mono', monospace",
                        color: 'hsl(0 0% 85%)',
                      }}
                    >
                      {content.journalTask}
                    </p>
                  </div>

                  {/* Lesson Selector */}
                  {lessons.length > 1 && (
                    <div className="space-y-2">
                      <label 
                        className="text-xs tracking-[0.2em]"
                        style={{ 
                          fontFamily: "'Space Mono', monospace",
                          color: 'hsl(0 0% 50%)',
                        }}
                      >
                        SELECT LESSON
                      </label>
                      <select
                        value={selectedLessonId || ''}
                        onChange={(e) => setSelectedLessonId(e.target.value)}
                        className="w-full p-3 rounded-lg text-sm"
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: `1px solid ${content.color}40`,
                          color: 'hsl(0 0% 85%)',
                        }}
                      >
                        {lessons.map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>
                            {lesson.display_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Upload Zone */}
                  <div
                    className="relative rounded-xl p-8 transition-all cursor-pointer"
                    style={{
                      background: uploadSuccess 
                        ? `${content.color}25` 
                        : selectedFile 
                          ? `${content.color}15` 
                          : 'rgba(0, 0, 0, 0.3)',
                      border: uploadSuccess
                        ? `2px solid ${content.color}`
                        : selectedFile 
                          ? `2px solid ${content.color}80` 
                          : `2px dashed ${content.color}40`,
                    }}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                      disabled={isUploading || uploadSuccess}
                    />
                    
                    <div className="flex flex-col items-center gap-4 text-center">
                      {uploadSuccess ? (
                        <>
                          <motion.div 
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                              background: `${content.color}40`,
                              border: `2px solid ${content.color}`,
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                          >
                            <Check className="w-8 h-8" style={{ color: content.color }} />
                          </motion.div>
                          <div>
                            <p 
                              className="text-sm mb-1"
                              style={{ 
                                fontFamily: "'Space Mono', monospace",
                                color: content.color,
                              }}
                            >
                              SUBMISSION RECEIVED
                            </p>
                            <p 
                              className="text-xs"
                              style={{ 
                                fontFamily: "'Space Mono', monospace",
                                color: 'hsl(0 0% 60%)',
                              }}
                            >
                              Awaiting Hogon's review...
                            </p>
                          </div>
                        </>
                      ) : selectedFile ? (
                        <>
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                              background: `${content.color}30`,
                              border: `2px solid ${content.color}80`,
                            }}
                          >
                            <Check className="w-8 h-8" style={{ color: content.color }} />
                          </div>
                          <div>
                            <p 
                              className="text-sm mb-1"
                              style={{ 
                                fontFamily: "'Space Mono', monospace",
                                color: content.color,
                              }}
                            >
                              FILE SELECTED
                            </p>
                            <p 
                              className="text-xs"
                              style={{ 
                                fontFamily: "'Space Mono', monospace",
                                color: 'hsl(0 0% 60%)',
                              }}
                            >
                              {selectedFile.name}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                              background: 'rgba(0, 0, 0, 0.3)',
                              border: `1px solid ${content.color}40`,
                            }}
                          >
                            <Upload className="w-8 h-8" style={{ color: content.color }} />
                          </div>
                          <div>
                            <p 
                              className="text-sm mb-1"
                              style={{ 
                                fontFamily: "'Space Mono', monospace",
                                color: 'hsl(0 0% 70%)',
                              }}
                            >
                              SEED BED DROP ZONE
                            </p>
                            <p 
                              className="text-xs"
                              style={{ 
                                fontFamily: "'Space Mono', monospace",
                                color: 'hsl(0 0% 45%)',
                              }}
                            >
                              Drag & drop or click to upload
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      className="flex items-center gap-2 p-3 rounded-lg"
                      style={{
                        background: 'rgba(255, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 0, 0, 0.3)',
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p 
                        className="text-xs"
                        style={{ 
                          fontFamily: "'Space Mono', monospace",
                          color: 'hsl(0 60% 70%)',
                        }}
                      >
                        {error}
                      </p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  {selectedFile && !uploadSuccess && (
                    <motion.button
                      className="w-full py-4 rounded-xl font-mono text-sm tracking-widest flex items-center justify-center gap-2"
                      style={{
                        fontFamily: "'Staatliches', sans-serif",
                        background: `linear-gradient(135deg, ${content.color}40, ${content.color}20)`,
                        border: `1px solid ${content.color}`,
                        color: 'white',
                        opacity: isUploading || !user ? 0.6 : 1,
                        cursor: isUploading || !user ? 'not-allowed' : 'pointer',
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={!isUploading && user ? { 
                        scale: 1.02,
                        boxShadow: `0 0 20px ${content.color}40`,
                      } : {}}
                      whileTap={!isUploading && user ? { scale: 0.98 } : {}}
                      onClick={handleSubmit}
                      disabled={isUploading || !user}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          SUBMITTING...
                        </>
                      ) : (
                        'SUBMIT TO THE HOGON'
                      )}
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LessonDrawer;
