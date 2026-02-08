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

/**
 * Sky Watcher Header - Fixed lunar rhythm display
 * "Reading the Dreamtime Sky" - Aboriginal astronomy reference
 * The Emu in the Sky: reading the dark spaces between stars
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
            {/* Waxing shadow overlay - represents the dark spaces */}
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

        {/* Center: Current Rhythm - Dreamtime Reference */}
        <motion.div
          className="flex items-center gap-2 flex-wrap justify-center"
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
            className="text-xs sm:text-sm tracking-[0.12em] uppercase"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(280 50% 75%)',
            }}
          >
            CURRENT RHYTHM:
          </span>
          <span 
            className="text-xs sm:text-sm tracking-[0.08em]"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(185 80% 65%)', // Cyan for Aboriginal reference
              textShadow: '0 0 10px hsl(185 80% 50% / 0.5)',
            }}
          >
            READING THE DREAMTIME SKY
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

      {/* Star sparkles and dark spaces - Emu in the Sky */}
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

export default SkyWatcherHeader;
