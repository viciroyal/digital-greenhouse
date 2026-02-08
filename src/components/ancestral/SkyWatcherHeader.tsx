import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';

interface SkyWatcherHeaderProps {
  currentOpenLevel: number | null;
}

// Level to Lunar Day mapping
const levelToLunarDay: Record<number, string> = {
  1: 'ROOT DAYS',
  2: 'EARTH DAYS',
  3: 'SIGNAL DAYS',
  4: 'ALCHEMY DAYS',
  5: 'SEED DAYS',
};

/**
 * Sky Watcher Header - Fixed lunar rhythm display
 * Shows current moon phase and dynamic level indicator
 */
const SkyWatcherHeader = ({ currentOpenLevel }: SkyWatcherHeaderProps) => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 h-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{
        background: `linear-gradient(90deg,
          hsl(250 50% 8%) 0%,
          hsl(240 45% 12%) 30%,
          hsl(260 40% 10%) 70%,
          hsl(250 50% 8%) 100%
        )`,
        borderBottom: '1px solid hsl(260 40% 25% / 0.5)',
        boxShadow: '0 4px 20px hsl(250 50% 5% / 0.8)',
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
                background: 'linear-gradient(90deg, hsl(250 50% 8%) 0%, transparent 35%)',
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

        {/* Center: Current Rhythm Text */}
        <motion.div
          className="flex items-center gap-2"
          animate={{
            textShadow: [
              '0 0 10px hsl(280 60% 50% / 0.3)',
              '0 0 20px hsl(280 60% 50% / 0.5)',
              '0 0 10px hsl(280 60% 50% / 0.3)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span 
            className="text-xs sm:text-sm tracking-[0.15em] uppercase"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(280 50% 75%)',
            }}
          >
            CURRENT RHYTHM:
          </span>
          <span 
            className="text-xs sm:text-sm tracking-[0.1em]"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(45 80% 65%)',
              textShadow: '0 0 10px hsl(45 80% 50% / 0.5)',
            }}
          >
            SOW THE INTENTION
          </span>
        </motion.div>

        {/* Right: Dynamic Level Indicator */}
        <motion.div
          className="flex items-center gap-2"
          key={currentOpenLevel}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span 
            className="text-xs font-mono tracking-wide"
            style={{ 
              color: currentOpenLevel 
                ? 'hsl(140 50% 60%)' 
                : 'hsl(0 0% 50%)',
            }}
          >
            {currentOpenLevel 
              ? levelToLunarDay[currentOpenLevel] || 'COSMIC DAYS'
              : '— — —'
            }
          </span>
          {/* Animated dot indicator */}
          {currentOpenLevel && (
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ 
                background: 'hsl(140 60% 50%)',
                boxShadow: '0 0 8px hsl(140 60% 50%)',
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

      {/* Star sparkles in header */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${8 + Math.random() * 84}%`,
              top: `${20 + Math.random() * 60}%`,
              width: '1px',
              height: '1px',
              background: 'hsl(0 0% 80%)',
            }}
            animate={{
              opacity: [0, 0.8, 0],
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

export default SkyWatcherHeader;
