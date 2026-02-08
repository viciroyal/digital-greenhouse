import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileImage, Check } from 'lucide-react';

interface LessonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  level: number | null;
}

// Content mapping for each level
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

/**
 * Lesson Drawer - Side panel for lesson content
 * Two tabs: THE TRANSMISSION and THE FIELD JOURNAL
 */
const LessonDrawer = ({ isOpen, onClose, level }: LessonDrawerProps) => {
  const [activeTab, setActiveTab] = useState<'transmission' | 'journal'>('transmission');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const content = level ? levelContent[level] : null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file.name);
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

                  {/* Upload Zone */}
                  <div
                    className="relative rounded-xl p-8 transition-all cursor-pointer"
                    style={{
                      background: uploadedFile ? `${content.color}15` : 'rgba(0, 0, 0, 0.3)',
                      border: uploadedFile 
                        ? `2px solid ${content.color}` 
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
                    />
                    
                    <div className="flex flex-col items-center gap-4 text-center">
                      {uploadedFile ? (
                        <>
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                              background: `${content.color}30`,
                              border: `2px solid ${content.color}`,
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
                              FILE RECEIVED
                            </p>
                            <p 
                              className="text-xs"
                              style={{ 
                                fontFamily: "'Space Mono', monospace",
                                color: 'hsl(0 0% 60%)',
                              }}
                            >
                              {uploadedFile}
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

                  {/* Submit Button (only shown when file uploaded) */}
                  {uploadedFile && (
                    <motion.button
                      className="w-full py-4 rounded-xl font-mono text-sm tracking-widest"
                      style={{
                        fontFamily: "'Staatliches', sans-serif",
                        background: `linear-gradient(135deg, ${content.color}40, ${content.color}20)`,
                        border: `1px solid ${content.color}`,
                        color: 'white',
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: `0 0 20px ${content.color}40`,
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        console.log('SUBMIT FIELD JOURNAL:', uploadedFile);
                        // TODO: Implement actual submission
                      }}
                    >
                      SUBMIT TO THE HOGON
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
