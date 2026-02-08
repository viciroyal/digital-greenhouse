import { motion } from 'framer-motion';
import { BookOpen, PenTool, Map } from 'lucide-react';

export type ViewMode = 'book' | 'log' | 'path';

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  showPath?: boolean;
}

/**
 * VIEW MODE TOGGLE
 * 
 * Primary duality:
 * - THE ALMANAC: Living reference book (Read / Study / Reference)
 * - THE LOG: Personal journal (Write / Record / Reflect)
 * 
 * Secondary option (hidden by default):
 * - THE PATH: Gamified totem with locked levels
 */
const ViewModeToggle = ({ value, onChange, showPath = false }: ViewModeToggleProps) => {
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
      {/* THE ALMANAC Option (Read) */}
      <motion.button
        className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all"
        style={{
          background: value === 'book' 
            ? 'linear-gradient(135deg, hsl(40 45% 22%), hsl(35 40% 18%))'
            : 'transparent',
          color: value === 'book' 
            ? 'hsl(40 70% 70%)' 
            : 'hsl(40 30% 50%)',
          boxShadow: value === 'book' 
            ? '0 0 20px hsl(40 60% 35% / 0.3)' 
            : 'none',
        }}
        onClick={() => onChange('book')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <BookOpen className="w-4 h-4" />
        THE ALMANAC
      </motion.button>

      {/* THE LOG Option (Write) */}
      <motion.button
        className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all"
        style={{
          background: value === 'log' 
            ? 'linear-gradient(135deg, hsl(140 40% 22%), hsl(140 35% 18%))'
            : 'transparent',
          color: value === 'log' 
            ? 'hsl(140 60% 65%)' 
            : 'hsl(40 30% 50%)',
          boxShadow: value === 'log' 
            ? '0 0 20px hsl(140 50% 35% / 0.3)' 
            : 'none',
        }}
        onClick={() => onChange('log')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <PenTool className="w-4 h-4" />
        THE LOG
      </motion.button>

      {/* THE PATH Option (Game - Hidden by default) */}
      {showPath && (
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
      )}
    </motion.div>
  );
};

export default ViewModeToggle;
