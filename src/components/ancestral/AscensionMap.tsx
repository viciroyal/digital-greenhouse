import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface LevelCardProps {
  level: number;
  title: string;
  isUnlocked: boolean;
  onSelect: () => void;
}

/**
 * Level Card - Glassmorphic card for each level in the Ascension Map
 */
const LevelCard = ({ level, title, isUnlocked, onSelect }: LevelCardProps) => {
  const [isShaking, setIsShaking] = useState(false);

  const handleClick = () => {
    if (isUnlocked) {
      onSelect();
    } else {
      // Trigger shake animation for locked cards
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Level-specific colors
  const levelColors: Record<number, { border: string; glow: string; bg: string }> = {
    1: { border: 'hsl(0 70% 50%)', glow: 'hsl(0 70% 40%)', bg: 'hsl(0 60% 35%)' },
    2: { border: 'hsl(30 60% 50%)', glow: 'hsl(30 60% 40%)', bg: 'hsl(30 50% 35%)' },
    3: { border: 'hsl(25 80% 55%)', glow: 'hsl(25 80% 45%)', bg: 'hsl(25 70% 40%)' },
    4: { border: 'hsl(45 90% 55%)', glow: 'hsl(45 90% 45%)', bg: 'hsl(45 80% 40%)' },
  };

  const colors = levelColors[level] || levelColors[1];

  return (
    <motion.button
      className="relative flex items-center gap-6 p-6 rounded-2xl w-full max-w-md cursor-pointer"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: isUnlocked 
          ? `2px solid ${colors.border}` 
          : '1px solid rgba(255, 255, 255, 0.2)',
        opacity: isUnlocked ? 1 : 0.5,
        boxShadow: isUnlocked 
          ? `0 0 30px ${colors.glow}80, 0 0 60px ${colors.glow}4D, inset 0 0 20px ${colors.glow}1A` 
          : 'none',
      }}
      onClick={handleClick}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: isUnlocked ? 1 : 0.5, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (4 - level) * 0.15 }}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      animate={isShaking ? {
        x: [0, -10, 10, -10, 10, -5, 5, 0],
        transition: { duration: 0.5 }
      } : {}}
    >
      {/* Icon Placeholder / Lock Icon */}
      <div 
        className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
        style={{
          background: isUnlocked 
            ? `linear-gradient(135deg, ${colors.bg}, ${colors.bg}99)`
            : 'hsl(0 0% 20%)',
          border: isUnlocked ? `1px solid ${colors.border}80` : '1px solid hsl(0 0% 30%)',
        }}
      >
        {isUnlocked ? (
          <div 
            className="w-8 h-8 rounded-full"
            style={{
              background: colors.border,
              boxShadow: `0 0 15px ${colors.glow}80`,
            }}
          />
        ) : (
          <Lock 
            className="w-8 h-8" 
            style={{ color: 'hsl(0 0% 45%)' }}
          />
        )}
      </div>

      {/* Title Text */}
      <div className="flex-1 text-left">
        <p 
          className="text-xs font-mono tracking-widest mb-1"
          style={{ 
            color: isUnlocked ? `${colors.border}` : 'hsl(0 0% 50%)',
          }}
        >
          LEVEL {level}
        </p>
        <h3 
          className="text-lg tracking-wide"
          style={{ 
            fontFamily: "'Staatliches', sans-serif",
            color: isUnlocked ? 'hsl(0 0% 95%)' : 'hsl(0 0% 50%)',
          }}
        >
          {title}
        </h3>
      </div>

      {/* Glowing border effect for unlocked cards */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: `2px solid ${colors.border}`,
          }}
          animate={{
            boxShadow: [
              `0 0 20px ${colors.glow}66`,
              `0 0 35px ${colors.glow}99`,
              `0 0 20px ${colors.glow}66`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Locked overlay with centered padlock */}
      {!isUnlocked && (
        <div 
          className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <Lock 
            className="w-10 h-10" 
            style={{ 
              color: 'hsl(0 0% 40%)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
            }}
          />
        </div>
      )}
    </motion.button>
  );
};

/**
 * Sap Rise Thermometer - Fixed progress bar on the right edge
 */
interface SapRiseThermometerProps {
  currentLevel: number;
}

const SapRiseThermometer = ({ currentLevel }: SapRiseThermometerProps) => {
  // Calculate fill percentage based on current level
  const fillPercent = currentLevel * 25;

  return (
    <motion.div
      className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {/* Label */}
      <div 
        className="text-xs font-mono tracking-widest text-center"
        style={{ 
          color: 'hsl(140 50% 55%)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
        }}
      >
        SAP RISE
      </div>

      {/* Thermometer Container */}
      <div 
        className="relative w-5 md:w-6 h-52 md:h-64 rounded-full overflow-hidden"
        style={{
          background: 'hsl(0 0% 8%)',
          border: '2px solid hsl(40 35% 25%)',
          boxShadow: 'inset 0 0 15px hsl(0 0% 5%), 0 0 15px hsl(140 40% 20% / 0.3)',
        }}
      >
        {/* Measurement marks */}
        {[0, 25, 50, 75, 100].map((mark) => (
          <div
            key={mark}
            className="absolute left-0 w-1.5 h-px"
            style={{
              bottom: `${mark}%`,
              background: 'hsl(40 35% 40%)',
            }}
          />
        ))}

        {/* Green Liquid Fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-full"
          style={{
            background: currentLevel >= 4 
              ? `linear-gradient(0deg,
                  hsl(120 70% 30%) 0%,
                  hsl(100 65% 40%) 50%,
                  hsl(80 70% 50%) 100%
                )`
              : `linear-gradient(0deg,
                  hsl(140 65% 25%) 0%,
                  hsl(120 55% 35%) 50%,
                  hsl(100 65% 45%) 100%
                )`,
            boxShadow: currentLevel >= 4
              ? `inset 0 5px 10px hsl(100 80% 55% / 0.3), 0 0 15px hsl(100 65% 45% / 0.5)`
              : `inset 0 5px 10px hsl(140 70% 50% / 0.25), 0 0 8px hsl(140 55% 40% / 0.4)`,
          }}
          animate={{ height: `${fillPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Bubbles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  background: 'hsl(140 75% 60% / 0.35)',
                  left: `${15 + Math.random() * 70}%`,
                }}
                animate={{
                  y: [0, -40],
                  opacity: [0.7, 0],
                }}
                transition={{
                  duration: 1.2 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Glass highlight */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(90deg,
              transparent 0%,
              hsl(0 0% 100% / 0.04) 30%,
              hsl(0 0% 100% / 0.08) 50%,
              hsl(0 0% 100% / 0.04) 70%,
              transparent 100%
            )`,
          }}
        />
      </div>

      {/* Bulb at bottom */}
      <div 
        className="w-8 h-8 md:w-10 md:h-10 rounded-full -mt-3"
        style={{
          background: currentLevel >= 4
            ? `radial-gradient(circle at 30% 30%, hsl(100 70% 40%), hsl(100 60% 25%))`
            : `radial-gradient(circle at 30% 30%, hsl(140 60% 35%), hsl(140 50% 20%))`,
          border: '2px solid hsl(40 35% 25%)',
          boxShadow: currentLevel >= 4
            ? '0 0 20px hsl(100 65% 40% / 0.5)'
            : '0 0 15px hsl(140 55% 30% / 0.4)',
        }}
      />

      {/* Percentage */}
      <div 
        className="text-sm font-mono"
        style={{ color: 'hsl(140 50% 55%)' }}
      >
        {fillPercent}%
      </div>
    </motion.div>
  );
};

/**
 * Mycelial Cord - Centered glowing vertical line
 */
const CentralCord = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 z-0">
      {/* Main glow line */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(180deg,
            hsl(45 50% 40%) 0%,
            hsl(35 45% 30%) 25%,
            hsl(40 50% 35%) 50%,
            hsl(35 45% 30%) 75%,
            hsl(45 50% 40%) 100%
          )`,
          boxShadow: '0 0 15px hsl(45 50% 40% / 0.5), 0 0 30px hsl(45 40% 30% / 0.3)',
        }}
      />
      
      {/* Pulsing nodes */}
      {[15, 35, 55, 75].map((position, i) => (
        <motion.div
          key={position}
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
          style={{
            top: `${position}%`,
            background: 'hsl(45 60% 50%)',
            boxShadow: '0 0 10px hsl(45 60% 50% / 0.6)',
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
};

// Level data
const levels = [
  { level: 4, title: 'THE SWEET ALCHEMY' },
  { level: 3, title: 'THE THUNDER SIGNAL' },
  { level: 2, title: 'THE MAGNETIC EARTH' },
  { level: 1, title: 'THE IRON ROOT' },
];

/**
 * Ascension Map - Phase 2 with State Management
 * Vertical timeline with 4 levels, bottom-to-top scroll
 */
const AscensionMap = () => {
  // State: Current level tracks user progress
  const [currentLevel, setCurrentLevel] = useState(1);

  // Handle card selection
  const handleCardSelect = (level: number) => {
    console.log(`OPEN LESSON DRAWER - Level ${level}`);
  };

  // Simulate level up for debugging
  const handleSimulateLevelUp = () => {
    setCurrentLevel(prev => Math.min(prev + 1, 4));
  };

  return (
    <section 
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: '#1a1a00',
      }}
    >
      {/* Organic texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Central Mycelial Cord */}
      <CentralCord />

      {/* Sap Rise Thermometer */}
      <SapRiseThermometer currentLevel={currentLevel} />

      {/* Level Cards Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-20 px-6">
        <div className="flex flex-col items-center gap-16">
          {levels.map((levelData) => (
            <LevelCard
              key={levelData.level}
              level={levelData.level}
              title={levelData.title}
              isUnlocked={currentLevel >= levelData.level}
              onSelect={() => handleCardSelect(levelData.level)}
            />
          ))}
        </div>

        {/* Bottom instruction */}
        <motion.p 
          className="mt-16 text-sm font-mono tracking-widest"
          style={{ color: 'hsl(45 40% 45%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ↑ SCROLL UP TO ASCEND ↑
        </motion.p>
      </div>

      {/* Debug Button - Simulate Level Up */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg font-mono text-xs"
        style={{
          background: 'hsl(280 50% 25%)',
          border: '1px solid hsl(280 60% 50%)',
          color: 'hsl(280 60% 75%)',
          boxShadow: '0 0 15px hsl(280 50% 30% / 0.5)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSimulateLevelUp}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        🧪 SIMULATE LEVEL UP (Current: {currentLevel})
      </motion.button>
    </section>
  );
};

export default AscensionMap;
