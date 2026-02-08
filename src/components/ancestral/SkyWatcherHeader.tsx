import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';

interface SkyWatcherHeaderProps {
  currentOpenLevel: number | null;
}

// Level to Focus Name mapping
const levelToFocusName: Record<number, string> = {
  1: 'THE IRON ROOT',
  2: 'THE MAGNETIC EARTH',
  3: 'THE THUNDER SIGNAL',
  4: 'THE SWEET ALCHEMY',
  5: 'THE MAROON BRAID',
};

// Seasonal Octave Logic
// The year is divided into octaves based on agricultural rhythms
const getSeasonalResonance = () => {
  const month = new Date().getMonth(); // 0-11
  
  // Cool Octave (Roots) - Nov, Dec, Jan, Feb, Mar
  // This is preparation/root season - 396 Hz (Root)
  if (month >= 10 || month <= 2) {
    return {
      frequency: 396,
      name: 'ROOT PULSE',
      octave: 'COOL OCTAVE',
      spotlightLevels: [1, 2], // Spotlight Levels 1 & 2
      dimLevels: [3, 4], // Dim Levels 3 & 4
      color: 'hsl(0 70% 50%)', // Red
    };
  }
  
  // Warm Octave (Growth) - Apr, May, Jun
  // This is signal/growth season - 528 Hz (Solar)
  if (month >= 3 && month <= 5) {
    return {
      frequency: 528,
      name: 'GROWTH WAVE',
      octave: 'WARM OCTAVE',
      spotlightLevels: [2, 3],
      dimLevels: [1],
      color: 'hsl(45 90% 55%)', // Yellow
    };
  }
  
  // Hot Octave (Alchemy) - Jul, Aug
  // This is alchemy/fruiting season - 639 Hz (Heart)
  if (month >= 6 && month <= 7) {
    return {
      frequency: 639,
      name: 'ALCHEMY TONE',
      octave: 'HOT OCTAVE',
      spotlightLevels: [3, 4],
      dimLevels: [1, 2],
      color: 'hsl(140 50% 50%)', // Green
    };
  }
  
  // Harvest Octave (Return) - Sep, Oct
  // This is harvest/seed saving season - 852 Hz (Third Eye)
  return {
    frequency: 852,
    name: 'HARVEST SIGNAL',
    octave: 'HARVEST OCTAVE',
    spotlightLevels: [4, 5],
    dimLevels: [1, 2, 3],
    color: 'hsl(280 60% 55%)', // Indigo
  };
};

/**
 * Sky Watcher Header - Fixed lunar rhythm display
 * "Reading the Dreamtime Sky" - Aboriginal astronomy reference
 * The Emu in the Sky: reading the dark spaces between stars
 * 
 * Now includes seasonal resonance frequency badge
 */
const SkyWatcherHeader = ({ currentOpenLevel }: SkyWatcherHeaderProps) => {
  const resonance = getSeasonalResonance();
  
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 h-14"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{
        background: `linear-gradient(90deg,
          hsl(250 50% 6%) 0%,
          hsl(240 45% 10%) 30%,
          hsl(260 40% 8%) 70%,
          hsl(250 50% 6%) 100%
        )`,
        borderBottom: '1px solid hsl(260 40% 20% / 0.5)',
        boxShadow: '0 4px 30px hsl(250 50% 5% / 0.9)',
      }}
    >
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left: Moon Phase Icon */}
        <motion.div 
          className="flex items-center gap-2"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Waxing Gibbous Moon Icon */}
          <div className="relative w-6 h-6">
            <Moon 
              className="w-6 h-6" 
              style={{ 
                color: 'hsl(45 70% 70%)',
                filter: 'drop-shadow(0 0 6px hsl(45 70% 50% / 0.6))',
              }} 
            />
            {/* Waxing shadow overlay */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, hsl(250 50% 6%) 0%, transparent 40%)',
              }}
            />
          </div>
          <span 
            className="text-xs font-mono tracking-wide hidden sm:inline"
            style={{ color: 'hsl(45 50% 65%)' }}
          >
            WAXING
          </span>
        </motion.div>

        {/* Center: Seasonal Resonance Frequency Badge */}
        <motion.div
          className="flex flex-col items-center"
        >
          {/* Pulsing Frequency Badge */}
          <motion.div
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{
              background: `${resonance.color}20`,
              border: `1px solid ${resonance.color}60`,
              boxShadow: `0 0 15px ${resonance.color}30`,
            }}
            animate={{
              boxShadow: [
                `0 0 15px ${resonance.color}30`,
                `0 0 25px ${resonance.color}50`,
                `0 0 15px ${resonance.color}30`,
              ],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Frequency dot */}
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{
                background: resonance.color,
                boxShadow: `0 0 8px ${resonance.color}`,
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
            <span 
              className="text-xs sm:text-sm font-mono tracking-wide"
              style={{ 
                fontFamily: "'Space Mono', monospace",
                color: resonance.color,
              }}
            >
              {resonance.frequency} Hz
            </span>
            <span 
              className="text-[10px] font-mono tracking-wide hidden sm:inline"
              style={{ 
                color: 'hsl(0 0% 55%)',
              }}
            >
              {resonance.name}
            </span>
          </motion.div>
          
          {/* Octave Label */}
          <span 
            className="text-[9px] font-mono tracking-[0.1em] mt-0.5"
            style={{ 
              color: 'hsl(0 0% 45%)',
            }}
          >
            {resonance.octave}
          </span>
        </motion.div>

        {/* Right: Dynamic Level Focus */}
        <motion.div
          className="flex items-center gap-2"
          key={currentOpenLevel}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span 
            className="text-[10px] font-mono tracking-wide hidden sm:inline"
            style={{ color: 'hsl(0 0% 50%)' }}
          >
            FOCUS:
          </span>
          <span 
            className="text-xs font-mono tracking-wide"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: currentOpenLevel 
                ? 'hsl(45 80% 65%)' 
                : 'hsl(0 0% 45%)',
              textShadow: currentOpenLevel 
                ? '0 0 8px hsl(45 80% 50% / 0.5)'
                : 'none',
            }}
          >
            {currentOpenLevel 
              ? levelToFocusName[currentOpenLevel] || 'THE PATH'
              : '— — —'
            }
          </span>
          {/* Animated dot indicator */}
          {currentOpenLevel && (
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ 
                background: 'hsl(45 80% 60%)',
                boxShadow: '0 0 8px hsl(45 80% 60%)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Star sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${15 + Math.random() * 70}%`,
              width: i % 3 === 0 ? '2px' : '1px',
              height: i % 3 === 0 ? '2px' : '1px',
              background: i % 4 === 0 ? 'hsl(185 100% 70%)' : 'hsl(0 0% 80%)',
            }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </motion.header>
  );
};

// Export the resonance getter for use in other components
export { getSeasonalResonance };
export default SkyWatcherHeader;
