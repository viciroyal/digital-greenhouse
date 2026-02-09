import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Quote, Sparkles } from 'lucide-react';
import { getWisdomByKey, type WisdomEntry } from '@/data/ancestralPathData';

interface WisdomOverlayProps {
  wisdomKey: string | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * WISDOM OVERLAY
 * 
 * THE LINK between Almanac (Action) and Path (Wisdom).
 * Opens when user clicks the ℹ️ "Learn More" icon.
 * 
 * UI BEHAVIOR: Readable Typography, Warm Colors (Purple/Gold).
 */
const WisdomOverlay = ({ wisdomKey, isOpen, onClose }: WisdomOverlayProps) => {
  const wisdom = wisdomKey ? getWisdomByKey(wisdomKey) : null;

  if (!wisdom) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'hsl(270 40% 5% / 0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Overlay Panel */}
          <motion.div
            className="fixed inset-x-4 top-1/2 z-50 max-w-lg mx-auto overflow-hidden rounded-2xl"
            style={{
              background: 'linear-gradient(180deg, hsl(270 30% 12%), hsl(40 30% 8%))',
              border: '1px solid hsl(45 60% 40% / 0.4)',
              boxShadow: '0 0 60px hsl(270 50% 20% / 0.4), inset 0 1px 0 hsl(45 60% 50% / 0.1)',
            }}
            initial={{ opacity: 0, y: '-40%', scale: 0.95 }}
            animate={{ opacity: 1, y: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: '-40%', scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                background: 'linear-gradient(90deg, hsl(270 40% 20% / 0.5), hsl(45 40% 15% / 0.5))',
                borderBottom: '1px solid hsl(45 50% 35% / 0.3)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(270 50% 40%), hsl(45 60% 45%))',
                  }}
                >
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p
                    className="text-xs font-mono tracking-wider"
                    style={{ color: 'hsl(270 50% 70%)' }}
                  >
                    FROM THE ANCESTRAL PATH
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'hsl(45 70% 70%)' }}
                  >
                    {wisdom.civilizationOrigin}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors hover:bg-white/10"
              >
                <X className="w-5 h-5" style={{ color: 'hsl(45 50% 60%)' }} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-5">
              {/* Source */}
              <div className="text-center">
                <p
                  className="text-lg font-semibold"
                  style={{
                    color: 'hsl(45 80% 65%)',
                    fontFamily: "'Staatliches', sans-serif",
                    letterSpacing: '0.05em',
                  }}
                >
                  {wisdom.sourceTitle}
                </p>
                <p
                  className="text-xs font-mono"
                  style={{ color: 'hsl(270 40% 60%)' }}
                >
                  {wisdom.sourceAuthor}
                </p>
              </div>

              {/* Wisdom Quote */}
              <div
                className="relative p-4 rounded-xl"
                style={{
                  background: 'hsl(40 30% 10% / 0.6)',
                  border: '1px solid hsl(45 50% 35% / 0.3)',
                }}
              >
                <Quote
                  className="absolute -top-2 -left-2 w-6 h-6"
                  style={{ color: 'hsl(45 60% 50%)' }}
                />
                <p
                  className="text-sm leading-relaxed italic"
                  style={{
                    color: 'hsl(40 40% 75%)',
                    fontFamily: "'Merriweather', serif",
                  }}
                >
                  "{wisdom.wisdomQuote}"
                </p>
              </div>

              {/* Reflection Prompt */}
              <div
                className="p-4 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(270 30% 15% / 0.8), hsl(300 25% 12% / 0.6))',
                  border: '1px dashed hsl(270 50% 50% / 0.4)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" style={{ color: 'hsl(270 60% 65%)' }} />
                  <p
                    className="text-xs font-mono tracking-wider"
                    style={{ color: 'hsl(270 60% 65%)' }}
                  >
                    REFLECTION
                  </p>
                </div>
                <p
                  className="text-sm"
                  style={{
                    color: 'hsl(270 30% 80%)',
                    fontFamily: "'Merriweather', serif",
                  }}
                >
                  {wisdom.reflectionPrompt}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-3 text-center"
              style={{
                background: 'hsl(0 0% 0% / 0.3)',
                borderTop: '1px solid hsl(45 40% 30% / 0.2)',
              }}
            >
              <p
                className="text-[10px] font-mono tracking-wider"
                style={{ color: 'hsl(0 0% 40%)' }}
              >
                THE WISDOM FLOWS • THE ACTION FOLLOWS
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WisdomOverlay;
