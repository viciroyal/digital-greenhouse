import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Sparkles, 
  ChevronRight,
  Heart,
  Moon,
  AlertCircle,
} from 'lucide-react';
import DailyReflectionCard from './DailyReflectionCard';
import { SevenPillars, SovereigntyFooter } from '@/components/almanac';

// Storage key for reflections
const STORAGE_KEY_REFLECTIONS = 'pharmer-daily-reflections';

interface Reflection {
  id: string;
  date: string;
  observation: string;
  helper: string | null;
  gratitude: string;
}

// Farm Team names for display
const farmTeamNames: Record<string, { name: string; emoji: string }> = {
  spirit: { name: 'Spirit', emoji: '🕊️' },
  sunny: { name: 'Sunny', emoji: '☀️' },
  rocky: { name: 'Rocky', emoji: '🪨' },
  river: { name: 'River', emoji: '💧' },
  lovey: { name: 'Lovey', emoji: '🐉' },
  starry: { name: 'Starry', emoji: '⭐' },
  seer: { name: 'Seer', emoji: '🦉' },
};

// Load reflections from localStorage
const loadReflections = (): Reflection[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_REFLECTIONS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load reflections:', error);
  }
  return [];
};

// Save reflections to localStorage
const saveReflections = (reflections: Reflection[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_REFLECTIONS, JSON.stringify(reflections));
  } catch (error) {
    console.error('Failed to save reflections:', error);
  }
};

interface JournalViewProps {
  userId?: string;
}

/**
 * JOURNAL VIEW
 * 
 * The Ancestral Path's main interface:
 * - Daily Reflection Card (warm, beginner-friendly prompts)
 * - Recent reflections timeline
 * - The 7 Pillars (wisdom, not data)
 */
const JournalView = ({ userId }: JournalViewProps) => {
  const [reflections, setReflections] = useState<Reflection[]>(() => loadReflections());
  const [showPillars, setShowPillars] = useState(false);
  const [brixPrompt, setBrixPrompt] = useState<{ value: number; date: string } | null>(null);

  // Persist reflections
  useEffect(() => {
    saveReflections(reflections);
  }, [reflections]);

  // Listen for Brix low alerts from Field Almanac (cross-sync)
  useEffect(() => {
    const handleBrixAlert = (event: CustomEvent<{ brixValue: number; date: string }>) => {
      setBrixPrompt({ value: event.detail.brixValue, date: event.detail.date });
    };
    
    window.addEventListener('brix-needs-attention', handleBrixAlert as EventListener);
    return () => {
      window.removeEventListener('brix-needs-attention', handleBrixAlert as EventListener);
    };
  }, []);

  const dismissBrixPrompt = useCallback(() => {
    setBrixPrompt(null);
  }, []);

  const handleNewReflection = (reflection: {
    observation: string;
    helper: string | null;
    gratitude: string;
  }) => {
    const newReflection: Reflection = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...reflection,
    };
    setReflections([newReflection, ...reflections]);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-32">
      {/* Mission Statement */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
          style={{
            background: 'hsl(270 30% 15%)',
            border: '1px solid hsl(270 40% 35%)',
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: 'hsl(270 60% 65%)' }} />
          <span
            className="text-xs font-mono tracking-widest"
            style={{ color: 'hsl(270 50% 70%)' }}
          >
            THE GARDEN GUARDIAN
          </span>
        </div>

        <h1
          className="text-3xl md:text-4xl mb-3 tracking-[0.15em]"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            color: 'hsl(140 50% 60%)',
            textShadow: '0 0 30px hsl(140 60% 35% / 0.4)',
          }}
        >
          THE STEWARD'S JOURNAL
        </h1>
        
        <p
          className="max-w-md mx-auto text-sm leading-relaxed"
          style={{ color: 'hsl(40 40% 60%)' }}
        >
          This is your sacred space for reflection. 
          No charts, no numbers—just you and the land.
        </p>
      </motion.div>

      {/* Brix Alert Cross-Sync Prompt */}
      <AnimatePresence>
        {brixPrompt && (
          <motion.div
            className="mb-6 p-4 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, hsl(0 35% 15%), hsl(30 30% 12%))',
              border: '2px solid hsl(0 60% 45%)',
              boxShadow: '0 0 30px hsl(0 60% 30% / 0.3)',
            }}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 shrink-0" style={{ color: 'hsl(45 100% 55%)' }} />
              <div className="flex-1">
                <h4
                  className="text-sm font-mono tracking-wider mb-1"
                  style={{ color: 'hsl(0 60% 65%)' }}
                >
                  🌱 THE SOIL NEEDS ATTENTION
                </h4>
                <p
                  className="text-sm mb-3"
                  style={{ color: 'hsl(40 50% 70%)' }}
                >
                  A Brix reading of <strong>{brixPrompt.value}</strong> was recorded. 
                  The soil is asking for help.
                </p>
                <p
                  className="text-xs italic mb-3"
                  style={{ color: 'hsl(195 50% 60%)' }}
                >
                  "What does the soil need to heal?"
                </p>
                <button
                  className="text-xs font-mono px-3 py-1 rounded"
                  style={{
                    background: 'hsl(0 0% 15%)',
                    border: '1px solid hsl(0 0% 30%)',
                    color: 'hsl(0 0% 60%)',
                  }}
                  onClick={dismissBrixPrompt}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Reflection Card */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DailyReflectionCard onSubmit={handleNewReflection} />
      </motion.div>

      {/* Wisdom Toggle */}
      <motion.button
        className="w-full flex items-center justify-between p-4 rounded-xl mb-6"
        style={{
          background: showPillars ? 'hsl(270 25% 15%)' : 'hsl(0 0% 8%)',
          border: `1px solid ${showPillars ? 'hsl(270 50% 40%)' : 'hsl(0 0% 20%)'}`,
        }}
        onClick={() => setShowPillars(!showPillars)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5" style={{ color: 'hsl(270 60% 65%)' }} />
          <div className="text-left">
            <span
              className="block text-sm font-mono tracking-wider"
              style={{ color: 'hsl(270 50% 70%)' }}
            >
              THE SEVEN PILLARS
            </span>
            <span
              className="text-xs"
              style={{ color: 'hsl(0 0% 50%)' }}
            >
              The wisdom of Sovereign Agriculture
            </span>
          </div>
        </div>
        <ChevronRight
          className="w-5 h-5 transition-transform"
          style={{
            color: 'hsl(270 50% 60%)',
            transform: showPillars ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        />
      </motion.button>

      <AnimatePresence>
        {showPillars && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <SevenPillars />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Reflections */}
      {reflections.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3
            className="text-sm font-mono tracking-wider mb-4 flex items-center gap-2"
            style={{ color: 'hsl(40 50% 55%)' }}
          >
            <Moon className="w-4 h-4" />
            RECENT REFLECTIONS
          </h3>

          <div className="space-y-3">
            {reflections.slice(0, 5).map((reflection, index) => {
              const helper = reflection.helper ? farmTeamNames[reflection.helper] : null;
              return (
                <motion.div
                  key={reflection.id}
                  className="p-4 rounded-xl"
                  style={{
                    background: 'hsl(0 0% 6%)',
                    border: '1px solid hsl(0 0% 15%)',
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-mono"
                      style={{ color: 'hsl(40 50% 55%)' }}
                    >
                      {formatDate(reflection.date)}
                    </span>
                    {helper && (
                      <span
                        className="text-xs flex items-center gap-1"
                        style={{ color: 'hsl(280 50% 65%)' }}
                      >
                        {helper.emoji} {helper.name}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'hsl(40 40% 70%)' }}
                  >
                    {reflection.observation}
                  </p>
                  {reflection.gratitude && (
                    <div
                      className="mt-2 pt-2 flex items-start gap-2"
                      style={{ borderTop: '1px solid hsl(0 0% 15%)' }}
                    >
                      <Heart className="w-3 h-3 mt-0.5" style={{ color: 'hsl(330 50% 60%)' }} />
                      <p
                        className="text-xs italic"
                        style={{ color: 'hsl(51 40% 60%)' }}
                      >
                        {reflection.gratitude}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Sovereignty Footer */}
      <SovereigntyFooter />
    </div>
  );
};

export default JournalView;
