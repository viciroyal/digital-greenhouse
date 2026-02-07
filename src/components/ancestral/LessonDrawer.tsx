import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Leaf, Play, Scroll } from 'lucide-react';
import FileDropZone from './FileDropZone';
import HogonSeal from './HogonSeal';

interface LessonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  module: {
    level: number;
    title: string;
    mission: string;
    lineage: string;
    color: string;
  } | null;
}

// Lesson content per level
const lessonContent: Record<number, {
  videoTitle: string;
  lore: string;
  task: string;
}> = {
  1: {
    videoTitle: "How to Build a Muscogee Mound",
    lore: "The Maroons survived by reading the soil. Today, we read the Brix. Your task is to build a compost pile that mimics the forest floor. Layer brown and green materials like leaves upon leaves of ancestral memory. The decomposition is not decay—it is transformation. The worms are your co-conspirators.",
    task: "UPLOAD COMPOST PHOTO",
  },
  2: {
    videoTitle: "Mapping Sirius to Your Garden Grid",
    lore: "The Dogon knew that Sirius B orbited the Dog Star before any telescope confirmed it. They mapped their granaries to the stars. Your garden is not random—it is a mirror of the cosmos. Align your beds to the cardinal directions. Plant your corn where the sunrise touches first.",
    task: "UPLOAD GARDEN GRID SKETCH",
  },
  3: {
    videoTitle: "The Frequency of Germination",
    lore: "The Aboriginal Elders sang the Dreamlines into being. Every plant has a frequency, a song that calls it from seed to fruit. Hum to your seedlings. Play them the sounds of the earth. Record yourself speaking to a seed and watch it respond.",
    task: "UPLOAD SINGING VIDEO",
  },
  4: {
    videoTitle: "Transmuting Light into Brix",
    lore: "The Kemetic Priests built pyramids to capture cosmic energy. You will do the same with your plants. High Brix farming is the alchemy of transforming sunlight into nutrient-dense, disease-resistant crops. Measure your Brix. Document the transformation.",
    task: "UPLOAD BRIX READING",
  },
};

/**
 * Lesson Drawer - Enhanced with Tabs
 * Contains The Transmission (learning) and Field Journal (action)
 */
const LessonDrawer = ({ isOpen, onClose, module }: LessonDrawerProps) => {
  const [activeTab, setActiveTab] = useState<'transmission' | 'journal'>('transmission');
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  if (!module) return null;

  const content = lessonContent[module.level] || lessonContent[1];

  const handleFileUpload = () => {
    setHasUploaded(true);
  };

  const handleApprove = () => {
    setIsApproved(true);
  };

  // Reset state when drawer closes
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setActiveTab('transmission');
      setHasUploaded(false);
      setIsApproved(false);
    }, 300);
  };

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

              {/* Tabs */}
              <div className="flex gap-2 mt-6">
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
                          {content.videoTitle}
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
                        {content.lore}
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="journal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
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
                        TASK: {content.task}
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
                      />
                    </div>

                    {/* The Hogon's Seal - Only show after upload */}
                    {hasUploaded && (
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
                          status={isApproved ? 'approved' : 'pending'}
                          color={module.color}
                          onApprove={handleApprove}
                        />
                      </motion.div>
                    )}

                    {/* Instructions if not uploaded */}
                    {!hasUploaded && (
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
