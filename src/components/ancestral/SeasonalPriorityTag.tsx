import { motion } from 'framer-motion';
import { Calendar, Sprout, Leaf } from 'lucide-react';

interface SeasonalPriorityTagProps {
  phase: 'prepare' | 'harvest';
  color?: string;
}

/**
 * Seasonal Priority Tag - Dynamic calendar-based indicator
 * Shows current agricultural phase based on date
 */
const SeasonalPriorityTag = ({ phase, color = 'hsl(140 60% 50%)' }: SeasonalPriorityTagProps) => {
  const phaseData = {
    prepare: {
      label: 'SEASONAL PRIORITY',
      text: 'CURRENT PHASE: PREPARE THE BED',
      icon: Sprout,
      gradient: 'linear-gradient(135deg, hsl(140 50% 25%), hsl(100 40% 20%))',
      borderColor: 'hsl(140 60% 45%)',
      glowColor: 'hsl(140 60% 50% / 0.4)',
    },
    harvest: {
      label: 'SEASONAL PRIORITY',
      text: 'CURRENT PHASE: MEASURE THE HARVEST',
      icon: Leaf,
      gradient: 'linear-gradient(135deg, hsl(45 50% 25%), hsl(35 40% 20%))',
      borderColor: 'hsl(45 80% 50%)',
      glowColor: 'hsl(45 80% 50% / 0.4)',
    },
  };

  const data = phaseData[phase];
  const Icon = data.icon;

  return (
    <motion.div
      className="rounded-lg overflow-hidden"
      style={{
        background: data.gradient,
        border: `2px solid ${data.borderColor}`,
        boxShadow: `0 0 20px ${data.glowColor}`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Pulsing Calendar Icon */}
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: `${data.borderColor}30`,
            border: `1px solid ${data.borderColor}`,
          }}
          animate={{
            boxShadow: [
              `0 0 10px ${data.glowColor}`,
              `0 0 25px ${data.glowColor}`,
              `0 0 10px ${data.glowColor}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Icon 
            className="w-5 h-5" 
            style={{ color: data.borderColor }}
          />
        </motion.div>

        <div className="flex-1">
          {/* Label */}
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-3 h-3" style={{ color: data.borderColor }} />
            <span 
              className="text-[10px] font-mono tracking-widest"
              style={{ color: data.borderColor }}
            >
              {data.label}
            </span>
          </div>
          
          {/* Phase Text */}
          <p 
            className="text-sm tracking-wide"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(0 0% 90%)',
              textShadow: `0 0 10px ${data.glowColor}`,
            }}
          >
            {data.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Get current seasonal phase based on date
 * Feb-March: Prepare (Levels 1 & 2)
 * Aug-Oct: Harvest (Level 4)
 */
export const getSeasonalPhase = (): { phase: 'prepare' | 'harvest' | null; levels: number[] } => {
  const month = new Date().getMonth(); // 0-11
  
  // February (1) - March (2): Prepare the Bed
  if (month >= 1 && month <= 2) {
    return { phase: 'prepare', levels: [1, 2] };
  }
  
  // August (7) - October (9): Harvest / Alchemy
  if (month >= 7 && month <= 9) {
    return { phase: 'harvest', levels: [4] };
  }
  
  return { phase: null, levels: [] };
};

export default SeasonalPriorityTag;
