import { motion } from 'framer-motion';
import { BookOpen, Compass } from 'lucide-react';

export type UnifiedViewMode = 'path' | 'almanac';

interface UnifiedViewToggleProps {
  value: UnifiedViewMode;
  onChange: (mode: UnifiedViewMode) => void;
}

/**
 * UNIFIED VIEW TOGGLE
 * 
 * Two Primary Pillars:
 * - THE ANCESTRAL PATH: The "Why" / Theory / Vision / Spirit
 * - THE FIELD ALMANAC: The "How" / Tools / Actions / Utility
 */
const UnifiedViewToggle = ({ value, onChange }: UnifiedViewToggleProps) => {
  return (
    <motion.div
      className="flex items-center justify-center gap-2 p-1.5 rounded-full"
      style={{
        background: 'hsl(20 30% 8% / 0.95)',
        border: '2px solid hsl(40 40% 25%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px hsl(0 0% 0% / 0.3)',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* THE ANCESTRAL PATH (Theory / Spirit / Why) */}
      <motion.button
        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-sm tracking-wider transition-all"
        style={{
          background: value === 'path' 
            ? 'linear-gradient(135deg, hsl(270 45% 25%), hsl(280 40% 18%))'
            : 'transparent',
          color: value === 'path' 
            ? 'hsl(270 80% 80%)' 
            : 'hsl(40 30% 50%)',
          boxShadow: value === 'path' 
            ? '0 0 25px hsl(270 60% 40% / 0.4), inset 0 1px 0 hsl(270 60% 60% / 0.2)' 
            : 'none',
        }}
        onClick={() => onChange('path')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <BookOpen className="w-4 h-4" />
        <span className="hidden sm:inline">THE PATH</span>
        <span className="sm:hidden">PATH</span>
      </motion.button>

      {/* THE FIELD ALMANAC (Action / Tools / How) */}
      <motion.button
        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-sm tracking-wider transition-all"
        style={{
          background: value === 'almanac' 
            ? 'linear-gradient(135deg, hsl(35 70% 35%), hsl(25 60% 28%))'
            : 'transparent',
          color: value === 'almanac' 
            ? 'hsl(45 100% 85%)' 
            : 'hsl(40 30% 50%)',
          boxShadow: value === 'almanac' 
            ? '0 0 25px hsl(35 70% 40% / 0.4), inset 0 1px 0 hsl(45 80% 70% / 0.2)' 
            : 'none',
        }}
        onClick={() => onChange('almanac')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Compass className="w-4 h-4" />
        <span className="hidden sm:inline">THE ALMANAC</span>
        <span className="sm:hidden">ALMANAC</span>
      </motion.button>
    </motion.div>
  );
};

export default UnifiedViewToggle;
