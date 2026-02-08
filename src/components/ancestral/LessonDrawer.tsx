import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Leaf, CheckCircle, Check } from 'lucide-react';
import FileDropZone from './FileDropZone';
import HogonSeal from './HogonSeal';
import HazardWarning from './HazardWarning';
import VideoPlaceholder from './VideoPlaceholder';
import SoilScanningAnimation from './SoilScanningAnimation';
import GoldenTicketCelebration from './GoldenTicketCelebration';
import EthericAntennaModule from './EthericAntennaModule';
import EarthAcupunctureModule from './EarthAcupunctureModule';
import VedicFireModule from './VedicFireModule';
import FrequencyVisualizer from './FrequencyVisualizer';
import MasterRecipeCard from './MasterRecipeCard';
import SeasonalPriorityTag, { getSeasonalPhase } from './SeasonalPriorityTag';
import BrixDiagnostics from './BrixDiagnostics';
import CulturalProtocols from './CulturalProtocols';
import SignalCircuitBoard from './SignalCircuitBoard';
import AvatarProtocol from './AvatarProtocol';
import FiberProtocolCanvas from './FiberProtocolCanvas';
import FiberProtocolRobe from './FiberProtocolRobe';
import BambooStructuralProtocol from './BambooStructuralProtocol';
import BastFiberProtocol from './BastFiberProtocol';
import RedoxIndigoProtocol from './RedoxIndigoProtocol';
import ScaleToggle, { AccessScale } from './ScaleToggle';
import ScaledProtocolSteps from './ScaledProtocolSteps';
import ScavengerBadge from './ScavengerBadge';
import { getProtocolByLevel } from './scaleProtocolData';
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
  onModuleComplete?: (level: number) => void;
}

// Access Scale is now managed per-user for adaptive protocols

/**
 * Lesson Drawer - Enhanced with Phase 5 Features
 * Contains The Transmission (learning) and Field Journal (action)
 */
const LessonDrawer = ({ isOpen, onClose, module, onModuleComplete }: LessonDrawerProps) => {
  const [activeTab, setActiveTab] = useState<'transmission' | 'journal'>('transmission');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [honorCodeChecked, setHonorCodeChecked] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadApproved, setUploadApproved] = useState(false);
  const [showGoldenTicket, setShowGoldenTicket] = useState(false);
  const [isBodyTuned, setIsBodyTuned] = useState(false);
  const [accessScale, setAccessScale] = useState<AccessScale>('sprout');
  
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
        setHonorCodeChecked(false);
        setIsScanning(false);
        setUploadApproved(false);
        setIsBodyTuned(false); // Reset body check-in
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
  
  // Determine seal status
  const getSealStatus = (): 'pending' | 'reviewed' | 'certified' => {
    if (hasCertifiedUpload) return 'certified';
    if (hasReviewedUpload) return 'reviewed';
    return 'pending';
  };

  // Check if this level needs hazard warning
  const needsHazardWarning = module.level === 3 || module.level === 4;

  // Get scaled protocol config for this level
  const scaledProtocolConfig = getProtocolByLevel(module.level);
  const scaledSteps = scaledProtocolConfig?.steps[accessScale] || [];

  // Check for seasonal priority
  const seasonalData = getSeasonalPhase();
  const hasSeasonalPriority = seasonalData.levels.includes(module.level);

  // Check if this level needs Recipe Card (Level 2)
  const needsRecipeCard = module.level === 2;

  // Check if this level needs Brix Diagnostics (Level 4)
  const needsBrixDiagnostics = module.level === 4;

  const handleFileUpload = async (file: File) => {
    if (!currentLesson || !honorCodeChecked) return;
    
    // Start scanning animation
    setIsScanning(true);
    
    // Simulate 3-second scanning
    setTimeout(async () => {
      const success = await uploadToJournal(currentLesson.id, file);
      setIsScanning(false);
      
      if (success) {
        setUploadApproved(true);
        
        if (!isCurrentLessonCompleted) {
          await completeLesson(currentLesson.id);
        }
        
        // Check if this is Level 4 completion for Golden Ticket
        if (module.level === 4) {
          setTimeout(() => {
            setShowGoldenTicket(true);
            if (onModuleComplete) {
              onModuleComplete(module.level);
            }
          }, 500);
        } else if (onModuleComplete) {
          onModuleComplete(module.level);
        }
      }
    }, 3000);
  };

  const handleClose = () => {
    onClose();
  };

  // Check if this is a specialized module lesson
  const isEthericAntennaLesson = currentLesson?.name === 'etheric-antenna';
  const isEarthAcupunctureLesson = currentLesson?.name === 'earth-acupuncture';
  const isVedicFireLesson = currentLesson?.name === 'vedic-fire';

  const lessonContent = currentLesson ? {
    videoTitle: currentLesson.display_name,
    lore: currentLesson.description || 'The ancestors are preparing your transmission. This lesson contains the sacred knowledge of the lineage.',
  } : {
    videoTitle: 'Loading lesson...',
    lore: 'The ancestors are preparing your transmission.',
  };

  return (
    <>
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

            {/* Drawer Panel - Dark Soil Glass */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg z-50 overflow-y-auto"
              style={{
                background: 'hsl(60 100% 5% / 0.92)', // Dark Soil #1a1a00
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderLeft: `2px solid ${module.color}40`,
                boxShadow: `-10px 0 60px rgba(0,0,0,0.8), 0 0 40px ${module.color}15`,
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header with Frequency Visualizer */}
              <div 
                className="sticky top-0 z-10 p-6 border-b"
                style={{ 
                  background: `linear-gradient(180deg, hsl(60 100% 5% / 0.98), hsl(60 100% 5% / 0.85))`,
                  backdropFilter: 'blur(10px)',
                  borderColor: `${module.color}30`,
                }}
              >
                {/* Top Row: Frequency Visualizer (left) + Close Button (right) */}
                <div className="flex items-start justify-between mb-4">
                  {/* Frequency Visualizer - Top Right */}
                  <FrequencyVisualizer level={module.level} />
                  
                  {/* Close Button */}
                  <motion.button
                    onClick={handleClose}
                    className="p-2 rounded-full transition-colors ml-2"
                    style={{ background: 'hsl(0 0% 12%)' }}
                    whileHover={{ 
                      background: 'hsl(0 50% 30%)',
                      boxShadow: '0 0 15px hsl(0 70% 50% / 0.5)',
                    }}
                  >
                    <X className="w-5 h-5" style={{ color: 'hsl(0 0% 70%)' }} />
                  </motion.button>
                </div>

                {/* Title Badge */}
                <div 
                  className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-3"
                  style={{
                    fontFamily: "'Space Mono', monospace",
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

                {/* Lesson selector */}
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
                      className="space-y-6"
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
                          {/* Avatar Protocol - Player-First System */}
                          <AvatarProtocol
                            level={module.level}
                            color={module.color}
                            onPhaseComplete={(phase) => {
                              if (phase === 'internal') {
                                setIsBodyTuned(true);
                              }
                              console.log(`Avatar phase ${phase} completed`);
                            }}
                          />

                          {/* Additional Content - Only visible after internal phase */}
                          <AnimatePresence>
                            {isBodyTuned && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-6"
                              >
                                {/* ACCESS KEY - Scale Toggle */}
                                <ScaleToggle
                                  value={accessScale}
                                  onChange={setAccessScale}
                                  color={module.color}
                                />

                                {/* Seasonal Priority Tag */}
                                {hasSeasonalPriority && seasonalData.phase && (
                                  <SeasonalPriorityTag 
                                    phase={seasonalData.phase}
                                    color={module.color}
                                  />
                                )}

                                {/* 9:16 Video Placeholder */}
                                <VideoPlaceholder 
                                  color={module.color}
                                  title={lessonContent.videoTitle}
                                />

                                {/* Scale-Adaptive Protocol Steps */}
                                {scaledProtocolConfig && scaledSteps.length > 0 && (
                                  <ScaledProtocolSteps
                                    color={module.color}
                                    steps={scaledSteps}
                                    scale={accessScale}
                                    science={scaledProtocolConfig.science}
                                  />
                                )}

                                {/* Scavenger Badge - SEED mode completions */}
                                <ScavengerBadge 
                                  color={module.color} 
                                  isVisible={accessScale === 'seed' && uploadApproved} 
                                />

                                {/* Master Recipe Card - Level 2 Only */}
                                {needsRecipeCard && (
                                  <MasterRecipeCard color={module.color} />
                                )}

                                {/* Brix Diagnostics - Level 4 Only */}
                                {needsBrixDiagnostics && (
                                  <BrixDiagnostics color={module.color} />
                                )}

                                {/* Level 1: Bamboo Structural Protocol (Shelter) */}
                                {module.level === 1 && (
                                  <BambooStructuralProtocol color={module.color} />
                                )}

                                {/* Level 3: Signal Circuit Board (4-Step) + Bast Fiber Physics */}
                                {module.level === 3 && (
                                  <>
                                    <SignalCircuitBoard 
                                      color={module.color}
                                      onSwitchComplete={(switchId) => {
                                        console.log(`Circuit switch ${switchId} completed`);
                                      }}
                                    />
                                    {/* Bast Fiber Physics Protocol (Hemp) - Science First */}
                                    <BastFiberProtocol color={module.color} />
                                  </>
                                )}

                                {/* Level 4: Redox Chemistry Protocol (Indigo) - Science First */}
                                {module.level === 4 && (
                                  <RedoxIndigoProtocol color={module.color} />
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}

                      {/* Hazard Warning for Level 3 & 4 */}
                      {needsHazardWarning && (
                        <HazardWarning level={module.level as 3 | 4} />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="journal"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Auth warning */}
                      {!user && (
                        <div 
                          className="p-4 rounded-xl text-center"
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

                      {/* Scanning Animation */}
                      {isScanning ? (
                        <SoilScanningAnimation color={module.color} />
                      ) : uploadApproved ? (
                        /* Upload Approved State */
                        <motion.div
                          className="text-center py-8"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <motion.div
                            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
                            style={{
                              background: 'hsl(140 50% 25%)',
                              border: '3px solid hsl(140 60% 45%)',
                              boxShadow: '0 0 30px hsl(140 60% 40% / 0.5)',
                            }}
                            animate={{
                              boxShadow: [
                                '0 0 20px hsl(140 60% 40% / 0.3)',
                                '0 0 40px hsl(140 60% 40% / 0.6)',
                                '0 0 20px hsl(140 60% 40% / 0.3)',
                              ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Check className="w-10 h-10" style={{ color: 'hsl(140 70% 55%)' }} />
                          </motion.div>
                          <h3 
                            className="text-xl font-mono tracking-[0.2em] mb-2"
                            style={{ color: 'hsl(140 60% 55%)' }}
                          >
                            ANCESTRAL APPROVAL GRANTED
                          </h3>
                          <p 
                            className="text-sm font-mono opacity-70"
                            style={{ color: 'hsl(40 50% 60%)' }}
                          >
                            Your work has been verified. Proceed to the next level.
                          </p>
                        </motion.div>
                      ) : (
                        <>
                          {/* The Challenge */}
                          <div 
                            className="p-4 rounded-xl text-center"
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
                              COMPLETE: {currentLesson?.display_name?.toUpperCase() || 'LESSON'}
                            </p>
                          </div>

                          {/* Honor Code Checkbox */}
                          <motion.label
                            className="flex items-start gap-3 p-4 rounded-xl cursor-pointer"
                            style={{
                              background: honorCodeChecked 
                                ? `${module.color}15` 
                                : 'hsl(0 0% 10%)',
                              border: honorCodeChecked 
                                ? `1px solid ${module.color}60` 
                                : '1px solid hsl(0 0% 20%)',
                            }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div 
                              className="flex-shrink-0 w-6 h-6 mt-0.5 rounded flex items-center justify-center transition-all"
                              style={{
                                background: honorCodeChecked ? module.color : 'transparent',
                                border: `2px solid ${honorCodeChecked ? module.color : 'hsl(0 0% 40%)'}`,
                              }}
                            >
                              {honorCodeChecked && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', stiffness: 300 }}
                                >
                                  <Check className="w-4 h-4" style={{ color: 'hsl(0 0% 10%)' }} />
                                </motion.div>
                              )}
                            </div>
                            <input 
                              type="checkbox"
                              checked={honorCodeChecked}
                              onChange={(e) => setHonorCodeChecked(e.target.checked)}
                              className="sr-only"
                            />
                            <div>
                              <p 
                                className="text-sm font-mono leading-relaxed"
                                style={{ 
                                  color: honorCodeChecked ? module.color : 'hsl(40 50% 60%)',
                                }}
                              >
                                I certify on my Ancestors that this work is mine.
                              </p>
                              <p 
                                className="text-xs font-mono mt-1 opacity-50"
                                style={{ color: 'hsl(40 40% 50%)' }}
                              >
                                The Honor Code of the Soil Steward
                              </p>
                            </div>
                          </motion.label>

                          {/* The Drop Zone */}
                          <div className="mb-4">
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
                              disabled={!user || !honorCodeChecked}
                            />
                            {!honorCodeChecked && (
                              <p 
                                className="text-xs font-mono text-center mt-2 opacity-60"
                                style={{ color: 'hsl(0 50% 60%)' }}
                              >
                                ☝️ Accept the Honor Code to enable uploads
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {/* Previous uploads */}
                      {journalEntries.length > 0 && !isScanning && (
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

                      {/* The Hogon's Seal */}
                      {!isScanning && !uploadApproved && (
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
                          />
                        </motion.div>
                      )}

                      {/* Hazard Warning in Journal tab too */}
                      {needsHazardWarning && !isScanning && (
                        <HazardWarning level={module.level as 3 | 4} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Golden Ticket Celebration */}
      <GoldenTicketCelebration 
        isVisible={showGoldenTicket}
        onClose={() => setShowGoldenTicket(false)}
      />
    </>
  );
};

export default LessonDrawer;
