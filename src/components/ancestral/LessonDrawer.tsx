import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Leaf, Play, Scroll, CheckCircle } from 'lucide-react';
import FileDropZone from './FileDropZone';
import HogonSeal from './HogonSeal';
import EthericAntennaModule from './EthericAntennaModule';
import EarthAcupunctureModule from './EarthAcupunctureModule';
import VedicFireModule from './VedicFireModule';
import { useAncestralProgress } from '@/hooks/useAncestralProgress';

interface LessonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  module: {
    id: string;
    level: number;
    title: string;
    mission: string;
    lineage: string;
    color: string;
  } | null;
}

/**
 * Lesson Drawer - Enhanced with Database Integration
 * Contains The Transmission (learning) and Field Journal (action)
 */
const LessonDrawer = ({ isOpen, onClose, module }: LessonDrawerProps) => {
  const [activeTab, setActiveTab] = useState<'transmission' | 'journal'>('transmission');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  
  const {
    getLessonsForModule,
    isLessonCompleted,
    completeLesson,
    uploadToJournal,
    getJournalEntriesForLesson,
    user,
  } = useAncestralProgress();

  // Reset state when drawer closes or module changes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveTab('transmission');
        setSelectedLessonIndex(0);
      }, 300);
    }
  }, [isOpen]);

  if (!module) return null;

  const lessons = getLessonsForModule(module.id);
  const currentLesson = lessons[selectedLessonIndex];
  const isCurrentLessonCompleted = currentLesson ? isLessonCompleted(currentLesson.id) : false;
  const journalEntries = currentLesson ? getJournalEntriesForLesson(currentLesson.id) : [];
  const hasPendingUpload = journalEntries.some(e => e.status === 'pending');
  const hasReviewedUpload = journalEntries.some(e => e.status === 'reviewed');
  const hasCertifiedUpload = journalEntries.some(e => e.status === 'certified');
  
  // Determine seal status: certified > reviewed > pending
  const getSealStatus = (): 'pending' | 'reviewed' | 'certified' => {
    if (hasCertifiedUpload) return 'certified';
    if (hasReviewedUpload) return 'reviewed';
    return 'pending';
  };

  const handleFileUpload = async (file: File) => {
    if (!currentLesson) return;
    
    const success = await uploadToJournal(currentLesson.id, file);
    if (success && !isCurrentLessonCompleted) {
      // Auto-complete lesson when file is uploaded
      await completeLesson(currentLesson.id);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Fallback content if no lessons from database
  const fallbackContent = {
    videoTitle: "Loading lesson...",
    lore: "The ancestors are preparing your transmission. This lesson contains the sacred knowledge of the lineage.",
    task: "UPLOAD YOUR EVIDENCE",
  };

  // Check if this is a specialized module lesson
  const isEthericAntennaLesson = currentLesson?.name === 'etheric-antenna';
  const isEarthAcupunctureLesson = currentLesson?.name === 'earth-acupuncture';
  const isVedicFireLesson = currentLesson?.name === 'vedic-fire';

  const lessonContent = currentLesson ? {
    videoTitle: currentLesson.display_name,
    lore: currentLesson.description || fallbackContent.lore,
    task: `COMPLETE: ${currentLesson.display_name.toUpperCase()}`,
  } : fallbackContent;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'hsl(0 0% 0% / 0.7)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Drawer Panel - Glassmorphic with Dark Soil blur */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg z-50 overflow-y-auto"
            style={{
              background: 'hsl(20 20% 8% / 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderLeft: `2px solid ${module.color}40`,
              boxShadow: `-10px 0 60px rgba(0,0,0,0.7), 0 0 40px ${module.color}15`,
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div 
              className="sticky top-0 z-10 p-6 border-b"
              style={{ 
                background: `linear-gradient(180deg, hsl(20 20% 8% / 0.95), hsl(20 20% 8% / 0.8))`,
                backdropFilter: 'blur(10px)',
                borderColor: `${module.color}30`,
              }}
            >
              {/* Close Button */}
              <motion.button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full transition-colors"
                style={{ background: 'hsl(0 0% 15%)' }}
                whileHover={{ 
                  background: 'hsl(0 50% 30%)',
                  boxShadow: '0 0 15px hsl(0 70% 50% / 0.5)',
                }}
              >
                <X className="w-5 h-5" style={{ color: 'hsl(0 0% 70%)' }} />
              </motion.button>

              {/* Dynamic Title */}
              <div 
                className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-3"
                style={{
                  background: `${module.color}20`,
                  color: module.color,
                  border: `1px solid ${module.color}`,
                  boxShadow: `0 0 15px ${module.color}30`,
                }}
              >
                {module.title}
              </div>

              <h2 
                className="text-2xl mb-1"
                style={{ 
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(0 0% 90%)',
                  letterSpacing: '0.05em',
                }}
              >
                {module.lineage.split('—')[0].trim()}
              </h2>

              {/* Lesson selector (if multiple lessons) */}
              {lessons.length > 1 && (
                <div className="flex gap-2 mt-4 mb-2 overflow-x-auto pb-2">
                  {lessons.map((lesson, idx) => {
                    const completed = isLessonCompleted(lesson.id);
                    return (
                      <motion.button
                        key={lesson.id}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap"
                        style={{
                          background: idx === selectedLessonIndex 
                            ? `${module.color}30` 
                            : 'hsl(0 0% 12%)',
                          border: idx === selectedLessonIndex
                            ? `1px solid ${module.color}`
                            : '1px solid hsl(0 0% 25%)',
                          color: completed 
                            ? 'hsl(140 60% 50%)' 
                            : idx === selectedLessonIndex 
                              ? module.color 
                              : 'hsl(0 0% 60%)',
                        }}
                        onClick={() => setSelectedLessonIndex(idx)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {completed && <CheckCircle className="w-3 h-3" />}
                        Lesson {idx + 1}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-2 mt-4">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm"
                  style={{
                    background: activeTab === 'transmission' 
                      ? `${module.color}25` 
                      : 'hsl(0 0% 12%)',
                    border: activeTab === 'transmission'
                      ? `1px solid ${module.color}`
                      : '1px solid hsl(0 0% 25%)',
                    color: activeTab === 'transmission' 
                      ? module.color 
                      : 'hsl(0 0% 60%)',
                  }}
                  onClick={() => setActiveTab('transmission')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BookOpen className="w-4 h-4" />
                  THE TRANSMISSION
                </motion.button>

                <motion.button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm"
                  style={{
                    background: activeTab === 'journal' 
                      ? `${module.color}25` 
                      : 'hsl(0 0% 12%)',
                    border: activeTab === 'journal'
                      ? `1px solid ${module.color}`
                      : '1px solid hsl(0 0% 25%)',
                    color: activeTab === 'journal' 
                      ? module.color 
                      : 'hsl(0 0% 60%)',
                  }}
                  onClick={() => setActiveTab('journal')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Leaf className="w-4 h-4" />
                  FIELD JOURNAL
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'transmission' ? (
                  <motion.div
                    key="transmission"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Specialized Modules */}
                    {isEthericAntennaLesson ? (
                      <EthericAntennaModule 
                        color={module.color}
                        onUploadClick={() => setActiveTab('journal')}
                      />
                    ) : isEarthAcupunctureLesson ? (
                      <EarthAcupunctureModule 
                        color={module.color}
                        onUploadClick={() => setActiveTab('journal')}
                      />
                    ) : isVedicFireLesson ? (
                      <VedicFireModule 
                        color={module.color}
                        onUploadClick={() => setActiveTab('journal')}
                      />
                    ) : (
                      <>
                        {/* Video Player Placeholder */}
                        <div 
                          className="relative aspect-video rounded-xl overflow-hidden mb-6"
                          style={{
                            background: 'hsl(0 0% 5%)',
                            border: `1px solid ${module.color}30`,
                          }}
                        >
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.div
                              className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
                              style={{
                                background: `${module.color}30`,
                                border: `2px solid ${module.color}`,
                              }}
                              whileHover={{ 
                                scale: 1.1,
                                boxShadow: `0 0 30px ${module.color}60`,
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Play className="w-8 h-8 ml-1" style={{ color: module.color }} />
                            </motion.div>
                            <p 
                              className="mt-4 text-sm font-mono text-center px-4"
                              style={{ color: 'hsl(40 50% 60%)' }}
                            >
                              {lessonContent.videoTitle}
                            </p>
                          </div>
                          
                          {/* Film grain overlay */}
                          <div 
                            className="absolute inset-0 opacity-30 pointer-events-none"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                            }}
                          />
                        </div>
                      </>
                    )}

                    {/* Only show completion status and mission for non-specialized lessons */}
                    {!isEthericAntennaLesson && !isEarthAcupunctureLesson && !isVedicFireLesson && (
                      <>
                        {/* Completion status */}
                        {isCurrentLessonCompleted && (
                          <motion.div
                            className="mb-4 p-3 rounded-lg flex items-center gap-2"
                            style={{
                              background: 'hsl(140 40% 15%)',
                              border: '1px solid hsl(140 50% 30%)',
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <CheckCircle className="w-5 h-5" style={{ color: 'hsl(140 60% 50%)' }} />
                            <span className="text-sm font-mono" style={{ color: 'hsl(140 60% 60%)' }}>
                              LESSON COMPLETED
                            </span>
                          </motion.div>
                        )}

                        {/* The Scroll - Lore & Science */}
                        <div 
                          className="p-5 rounded-xl"
                          style={{
                            background: 'hsl(20 30% 10%)',
                            border: '1px solid hsl(40 40% 25%)',
                          }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Scroll className="w-5 h-5" style={{ color: 'hsl(40 60% 50%)' }} />
                            <h3 
                              className="text-sm font-mono tracking-wider"
                              style={{ color: 'hsl(40 60% 60%)' }}
                            >
                              THE SCROLL
                            </h3>
                          </div>
                          <p 
                            className="text-sm leading-relaxed font-mono"
                            style={{ color: 'hsl(40 40% 75%)' }}
                          >
                            {lessonContent.lore}
                          </p>
                        </div>

                        {/* Mission reminder */}
                        <div 
                          className="mt-6 p-4 rounded-lg text-center"
                          style={{
                            background: `${module.color}10`,
                            border: `1px dashed ${module.color}50`,
                          }}
                        >
                          <p 
                            className="text-xs font-mono mb-1"
                            style={{ color: 'hsl(40 40% 50%)' }}
                          >
                            YOUR MISSION
                          </p>
                          <p 
                            className="text-lg tracking-wide"
                            style={{ 
                              fontFamily: "'Staatliches', sans-serif",
                              color: module.color,
                            }}
                          >
                            "{module.mission}"
                          </p>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="journal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Auth warning */}
                    {!user && (
                      <div 
                        className="mb-6 p-4 rounded-xl text-center"
                        style={{
                          background: 'hsl(40 40% 15%)',
                          border: '1px solid hsl(40 50% 30%)',
                        }}
                      >
                        <p 
                          className="text-sm font-mono"
                          style={{ color: 'hsl(40 60% 60%)' }}
                        >
                          Sign in to track your progress and upload evidence
                        </p>
                      </div>
                    )}

                    {/* The Challenge */}
                    <div 
                      className="mb-6 p-4 rounded-xl text-center"
                      style={{
                        background: 'hsl(0 0% 10%)',
                        border: `1px solid ${module.color}40`,
                      }}
                    >
                      <p 
                        className="text-xs font-mono mb-2"
                        style={{ color: 'hsl(40 40% 50%)' }}
                      >
                        THE CHALLENGE
                      </p>
                      <p 
                        className="text-xl tracking-wider"
                        style={{ 
                          fontFamily: "'Staatliches', sans-serif",
                          color: module.color,
                          textShadow: `0 0 20px ${module.color}40`,
                        }}
                      >
                        {lessonContent.task}
                      </p>
                    </div>

                    {/* The Drop Zone */}
                    <div className="mb-8">
                      <h3 
                        className="text-sm font-mono mb-3 flex items-center gap-2"
                        style={{ color: 'hsl(40 50% 60%)' }}
                      >
                        <Leaf className="w-4 h-4" style={{ color: module.color }} />
                        THE SEED BED
                      </h3>
                      <FileDropZone 
                        color={module.color}
                        onFileUpload={handleFileUpload}
                        disabled={!user}
                      />
                    </div>

                    {/* Previous uploads */}
                    {journalEntries.length > 0 && (
                      <div className="mb-6">
                        <h3 
                          className="text-sm font-mono mb-3"
                          style={{ color: 'hsl(40 50% 60%)' }}
                        >
                          YOUR SUBMISSIONS
                        </h3>
                        <div className="space-y-2">
                          {journalEntries.map((entry) => (
                            <div
                              key={entry.id}
                              className="p-3 rounded-lg flex items-center justify-between"
                              style={{
                                background: 'hsl(0 0% 10%)',
                                border: entry.status === 'certified' 
                                  ? '1px solid hsl(51 100% 50%)' 
                                  : '1px solid hsl(0 0% 20%)',
                              }}
                            >
                              <span 
                                className="text-xs font-mono truncate max-w-[200px]"
                                style={{ color: 'hsl(40 50% 60%)' }}
                              >
                                {entry.file_name}
                              </span>
                              <span 
                                className="text-xs font-mono px-2 py-1 rounded"
                                style={{
                                  background: entry.status === 'certified' 
                                    ? 'hsl(51 80% 30%)' 
                                    : 'hsl(40 30% 20%)',
                                  color: entry.status === 'certified' 
                                    ? 'hsl(51 100% 70%)' 
                                    : 'hsl(40 40% 60%)',
                                }}
                              >
                                {entry.status.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* The Hogon's Seal - Always show for demo preview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 
                        className="text-sm font-mono mb-4 text-center"
                        style={{ color: 'hsl(40 50% 60%)' }}
                      >
                        THE HOGON'S SEAL
                      </h3>
                      <HogonSeal 
                        status={getSealStatus()}
                        color={module.color}
                        onApprove={() => {
                          // Demo only - triggers level up animation preview
                        }}
                      />
                    </motion.div>

                    {/* Instructions if not uploaded */}
                    {journalEntries.length === 0 && user && (
                      <div 
                        className="p-4 rounded-lg text-center"
                        style={{
                          background: 'hsl(0 0% 8%)',
                          border: '1px solid hsl(0 0% 20%)',
                        }}
                      >
                        <p 
                          className="text-sm font-mono"
                          style={{ color: 'hsl(0 0% 50%)' }}
                        >
                          Upload your evidence to receive the Hogon's judgment
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LessonDrawer;
