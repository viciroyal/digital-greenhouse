import { motion } from 'framer-motion';
import { Map, BookOpen } from 'lucide-react';

export type ViewMode = 'path' | 'book';

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

/**
 * VIEW MODE TOGGLE
 * 
 * Switches between:
 * - THE PATH: Gamified totem with locked levels
 * - THE BOOK: Linear textbook layout (The Grimoire)
 */
const ViewModeToggle = ({ value, onChange }: ViewModeToggleProps) => {
  return (
    <motion.div
      className="flex items-center gap-1 p-1 rounded-full"
      style={{
        background: 'hsl(20 30% 10% / 0.95)',
        border: '1px solid hsl(40 40% 25%)',
        backdropFilter: 'blur(10px)',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* THE PATH Option */}
      <motion.button
        className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all"
        style={{
          background: value === 'path' 
            ? 'linear-gradient(135deg, hsl(51 60% 25%), hsl(40 50% 20%))'
            : 'transparent',
          color: value === 'path' 
            ? 'hsl(51 100% 70%)' 
            : 'hsl(40 30% 50%)',
          boxShadow: value === 'path' 
            ? '0 0 20px hsl(51 80% 40% / 0.3)' 
            : 'none',
        }}
        onClick={() => onChange('path')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Map className="w-4 h-4" />
        THE PATH
      </motion.button>

      {/* THE BOOK Option */}
      <motion.button
        className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all"
        style={{
          background: value === 'book' 
            ? 'linear-gradient(135deg, hsl(280 40% 25%), hsl(260 35% 20%))'
            : 'transparent',
          color: value === 'book' 
            ? 'hsl(280 70% 75%)' 
            : 'hsl(40 30% 50%)',
          boxShadow: value === 'book' 
            ? '0 0 20px hsl(280 60% 40% / 0.3)' 
            : 'none',
        }}
        onClick={() => onChange('book')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <BookOpen className="w-4 h-4" />
        THE BOOK
      </motion.button>
    </motion.div>
  );
};

export default ViewModeToggle;
