import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Clock, Star } from 'lucide-react';

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

/**
 * Lesson Drawer - Side panel that opens when clicking an unlocked node
 */
const LessonDrawer = ({ isOpen, onClose, module }: LessonDrawerProps) => {
  if (!module) return null;

  const lessons = [
    { title: "Introduction to Soil Memory", duration: "12 min", status: "available" },
    { title: "The Language of Roots", duration: "18 min", status: "available" },
    { title: "Composting as Ceremony", duration: "25 min", status: "coming" },
    { title: "Reading the Earth Signs", duration: "20 min", status: "coming" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 overflow-y-auto"
            style={{
              background: `linear-gradient(180deg,
                hsl(0 0% 8%) 0%,
                hsl(20 20% 6%) 100%
              )`,
              borderLeft: `2px solid ${module.color}40`,
              boxShadow: `-10px 0 50px rgba(0,0,0,0.5), 0 0 30px ${module.color}20`,
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div 
              className="sticky top-0 p-6 border-b"
              style={{ 
                background: `linear-gradient(135deg, ${module.color}15, transparent)`,
                borderColor: `${module.color}30`,
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: module.color }} />
              </button>

              <div 
                className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-3"
                style={{
                  background: `${module.color}20`,
                  color: module.color,
                  border: `1px solid ${module.color}`,
                }}
              >
                {module.title}
              </div>

              <h2 
                className="text-2xl mb-2"
                style={{ 
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(0 0% 90%)',
                }}
              >
                {module.lineage}
              </h2>

              <p 
                className="text-lg italic"
                style={{ color: 'hsl(40 50% 70%)' }}
              >
                "{module.mission}"
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span 
                    className="text-sm font-mono"
                    style={{ color: 'hsl(40 40% 60%)' }}
                  >
                    MODULE PROGRESS
                  </span>
                  <span 
                    className="text-sm font-mono"
                    style={{ color: module.color }}
                  >
                    0%
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'hsl(0 0% 15%)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${module.color}, ${module.color}80)`,
                      width: '0%',
                    }}
                  />
                </div>
              </div>

              {/* Lessons List */}
              <h3 
                className="text-lg font-mono mb-4 flex items-center gap-2"
                style={{ color: 'hsl(0 0% 80%)' }}
              >
                <BookOpen className="w-5 h-5" style={{ color: module.color }} />
                LESSONS
              </h3>

              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: lesson.status === 'available' 
                        ? 'hsl(0 0% 12%)'
                        : 'hsl(0 0% 10%)',
                      border: lesson.status === 'available'
                        ? `1px solid ${module.color}30`
                        : '1px solid hsl(0 0% 20%)',
                      opacity: lesson.status === 'available' ? 1 : 0.5,
                    }}
                    whileHover={lesson.status === 'available' ? {
                      background: 'hsl(0 0% 15%)',
                      borderColor: `${module.color}60`,
                    } : {}}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 
                          className="font-medium mb-1"
                          style={{ 
                            color: lesson.status === 'available' 
                              ? 'hsl(0 0% 90%)' 
                              : 'hsl(0 0% 50%)',
                          }}
                        >
                          {lesson.title}
                        </h4>
                        <div 
                          className="flex items-center gap-2 text-sm"
                          style={{ color: 'hsl(0 0% 50%)' }}
                        >
                          <Clock className="w-3 h-3" />
                          {lesson.duration}
                        </div>
                      </div>
                      {lesson.status === 'coming' && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: 'hsl(40 40% 20%)',
                            color: 'hsl(40 50% 60%)',
                          }}
                        >
                          Coming Soon
                        </span>
                      )}
                      {lesson.status === 'available' && (
                        <Star 
                          className="w-5 h-5" 
                          style={{ color: module.color }}
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Start Learning CTA */}
              <motion.button
                className="w-full mt-8 py-4 rounded-xl font-mono tracking-wider"
                style={{
                  background: `linear-gradient(135deg, ${module.color}, ${module.color}80)`,
                  color: 'hsl(0 0% 5%)',
                  boxShadow: `0 0 30px ${module.color}40`,
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: `0 0 40px ${module.color}60`,
                }}
                whileTap={{ scale: 0.98 }}
              >
                BEGIN LEARNING
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LessonDrawer;
