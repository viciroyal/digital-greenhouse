import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Check, Lock, Zap, Droplets, Heart, 
  Footprints, Wind, Utensils, Sparkles, Volume2
} from 'lucide-react';

interface AvatarProtocolProps {
  level: number;
  color: string;
  onPhaseComplete: (phase: 'internal' | 'external') => void;
}

// Level data with Internal (Avatar) and External (Map) phases
const levelData: Record<number, {
  vibe: string;
  internal: {
    title: string;
    science: string;
    task: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  external: {
    title: string;
    lesson: string;
    culture: string;
  };
  chakraColor: string;
  statBoosts: { hydration: number; stamina: number; vibe: number };
}> = {
  1: {
    vibe: "Don't Break Your Back",
    internal: {
      title: 'THE HIP HINGE',
      science: 'Your spine is the antenna. If you bend it, you lose the signal.',
      task: 'Kick off your shoes (Earthing). Plant feet wide. Hinge at the hips. Prove you are grounded.',
      icon: Footprints,
    },
    external: {
      title: 'THE BROADFORK',
      lesson: "Now treat the soil the same way. Don't flip it. Just crack it open so it can breathe. Respect its spine.",
      culture: 'Muscogee',
    },
    chakraColor: 'hsl(0 70% 45%)',
    statBoosts: { hydration: 20, stamina: 40, vibe: 30 },
  },
  2: {
    vibe: 'Be Like Water',
    internal: {
      title: 'THE FASCIA FLUSH',
      science: 'You are 70% water. If you are stiff, your electrical signals get stuck.',
      task: 'Drink 16oz of water right now. Stretch your side-body. Lubricate your joints.',
      icon: Droplets,
    },
    external: {
      title: 'THE ROCK DUST',
      lesson: "Now feed the soil's battery. The Olmecs knew that stone + water = electricity. Dust the beds so the earth can hold the charge.",
      culture: 'Olmec',
    },
    chakraColor: 'hsl(25 80% 50%)',
    statBoosts: { hydration: 50, stamina: 25, vibe: 25 },
  },
  3: {
    vibe: 'Calm The Glitch',
    internal: {
      title: 'THE VAGUS RESET',
      science: 'If you are stressed (Sympathetic State), the plants feel your cortisol. They panic.',
      task: 'Box Breathe (4-4-4-4). Hum a low tone (Aboriginal Songline) to vibrate your chest. Switch to Game Mode: Calm.',
      icon: Wind,
    },
    external: {
      title: 'THE ANTENNA',
      lesson: 'Now that you are calm, set the copper antenna. You are the tuner; the copper is the receiver. Connect the sky to the ground.',
      culture: 'Dogon & Vedic',
    },
    chakraColor: 'hsl(45 90% 55%)',
    statBoosts: { hydration: 20, stamina: 30, vibe: 50 },
  },
  4: {
    vibe: 'High Octane Only',
    internal: {
      title: 'THE BIO-FEEDBACK',
      science: 'Your tongue is a chemical lab. Bitter = Poison/Lack. Sweet = Medicine/Gold.',
      task: 'Eat a leaf. Close your eyes. Does it taste like complex sugar or just water? Judge the fuel.',
      icon: Utensils,
    },
    external: {
      title: 'THE BRIX TEST',
      lesson: "Now verify it with the Refractometer. If it's not good enough for you, it's not good enough for the CSA. Raise the Gold.",
      culture: 'Kemit',
    },
    chakraColor: 'hsl(51 100% 50%)',
    statBoosts: { hydration: 25, stamina: 25, vibe: 40 },
  },
  5: {
    vibe: 'Become The Ancestor',
    internal: {
      title: 'THE STILLNESS',
      science: 'The seed saves itself in darkness. To become the keeper, you must first become still.',
      task: 'Sit in silence for 60 seconds. Close your eyes. Feel your heartbeat. You are the vessel.',
      icon: Sparkles,
    },
    external: {
      title: 'THE SEED SAVE',
      lesson: 'Now harvest the genetics. Select the strongest mother. Dry the seeds in shade. Label with lineage. You are now the Ancestor.',
      culture: 'Maroon Grandmothers',
    },
    chakraColor: 'hsl(0 0% 85%)',
    statBoosts: { hydration: 30, stamina: 30, vibe: 40 },
  },
};

/**
 * Player Stats Bar Component
 */
const PlayerStats = ({ 
  hydration, 
  stamina, 
  vibe, 
  isAnimating 
}: { 
  hydration: number; 
  stamina: number; 
  vibe: number; 
  isAnimating: boolean;
}) => {
  const stats = [
    { name: 'HYDRATION', value: hydration, color: 'hsl(200 80% 50%)', icon: Droplets },
    { name: 'STAMINA', value: stamina, color: 'hsl(140 60% 45%)', icon: Zap },
    { name: 'VIBE', value: vibe, color: 'hsl(280 60% 55%)', icon: Heart },
  ];
  
  return (
    <div 
      className="p-3 rounded-xl mb-4"
      style={{
        background: 'linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 6%))',
        border: '1px solid hsl(0 0% 20%)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <User className="w-4 h-4" style={{ color: 'hsl(0 0% 60%)' }} />
        <span
          className="text-[10px] font-mono tracking-[0.2em]"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: 'hsl(0 0% 60%)',
          }}
        >
          PLAYER STATS
        </span>
      </div>
      
      <div className="space-y-2">
        {stats.map(stat => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.name} className="flex items-center gap-2">
              <IconComponent 
                className="w-3 h-3 flex-shrink-0" 
                style={{ color: stat.color }} 
              />
              <span
                className="text-[9px] font-mono w-16 flex-shrink-0"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: 'hsl(0 0% 50%)',
                }}
              >
                {stat.name}
              </span>
              <div 
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: 'hsl(0 0% 15%)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: stat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }}
                  transition={{ 
                    duration: isAnimating ? 0.8 : 0.3,
                    ease: 'easeOut',
                  }}
                />
              </div>
              <span
                className="text-[9px] font-mono w-8 text-right flex-shrink-0"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: stat.value >= 50 ? stat.color : 'hsl(0 0% 40%)',
                }}
              >
                {stat.value}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Phase Card Component
 */
const PhaseCard = ({
  phase,
  title,
  content,
  culture,
  icon: IconComponent,
  isActive,
  isCompleted,
  isLocked,
  color,
  onActivate,
}: {
  phase: 'internal' | 'external';
  title: string;
  content: string;
  culture?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  color: string;
  onActivate: () => void;
}) => {
  const phaseLabel = phase === 'internal' ? 'THE AVATAR' : 'THE MAP';
  const PhaseIcon = phase === 'internal' ? User : MapPin;
  
  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{
        background: isCompleted 
          ? `linear-gradient(135deg, ${color}15, ${color}08)`
          : isLocked
            ? 'linear-gradient(135deg, hsl(0 0% 6%), hsl(0 0% 4%))'
            : 'linear-gradient(135deg, hsl(0 0% 10%), hsl(0 0% 7%))',
        border: isCompleted 
          ? `2px solid ${color}`
          : isActive
            ? `1px solid ${color}60`
            : '1px solid hsl(0 0% 18%)',
        opacity: isLocked ? 0.5 : 1,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLocked ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Phase Header */}
      <div 
        className="px-4 py-2 flex items-center gap-2"
        style={{
          background: isCompleted 
            ? `${color}20`
            : isActive 
              ? `${color}10`
              : 'hsl(0 0% 12%)',
          borderBottom: `1px solid ${isCompleted ? color : 'hsl(0 0% 15%)'}30`,
        }}
      >
        <PhaseIcon 
          className="w-4 h-4" 
          style={{ color: isCompleted || isActive ? color : 'hsl(0 0% 45%)' }} 
        />
        <span
          className="text-[10px] font-mono tracking-[0.15em] flex-1"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: isCompleted || isActive ? color : 'hsl(0 0% 50%)',
          }}
        >
          {phaseLabel}
        </span>
        {isCompleted && (
          <Check className="w-4 h-4" style={{ color }} />
        )}
        {isLocked && (
          <Lock className="w-3 h-3" style={{ color: 'hsl(0 0% 40%)' }} />
        )}
      </div>
      
      {/* Phase Content */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          {IconComponent && (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: isLocked ? 'hsl(0 0% 12%)' : `${color}20`,
                border: `1px solid ${isLocked ? 'hsl(0 0% 20%)' : color}50`,
                color: isLocked ? 'hsl(0 0% 35%)' : color,
              }}
            >
              <IconComponent className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1">
            <h4
              className="text-base mb-1"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: isLocked ? 'hsl(0 0% 40%)' : 'hsl(0 0% 90%)',
                letterSpacing: '0.08em',
              }}
            >
              {title}
            </h4>
            {culture && (
              <span
                className="text-[10px] font-mono"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: isLocked ? 'hsl(0 0% 30%)' : color,
                }}
              >
                Lineage: {culture}
              </span>
            )}
          </div>
        </div>
        
        <p
          className="text-sm leading-relaxed mb-4"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: isLocked ? 'hsl(0 0% 35%)' : 'hsl(40 30% 65%)',
            lineHeight: '1.6',
          }}
        >
          "{content}"
        </p>
        
        {/* Action Button */}
        {!isCompleted && !isLocked && (
          <motion.button
            className="w-full py-2.5 rounded-lg font-mono text-sm tracking-wide"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              background: `linear-gradient(135deg, ${color}30, ${color}15)`,
              border: `1px solid ${color}`,
              color,
              letterSpacing: '0.1em',
            }}
            onClick={onActivate}
            whileHover={{ 
              scale: 1.02,
              boxShadow: `0 0 20px ${color}40`,
            }}
            whileTap={{ scale: 0.98 }}
          >
            {phase === 'internal' ? 'I AM TUNED ⚡' : 'COMPLETE MISSION 🌱'}
          </motion.button>
        )}
        
        {isCompleted && (
          <div 
            className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}50`,
            }}
          >
            <Check className="w-4 h-4" style={{ color }} />
            <span
              className="text-sm tracking-wide"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color,
                letterSpacing: '0.1em',
              }}
            >
              {phase === 'internal' ? 'AVATAR CALIBRATED' : 'MISSION COMPLETE'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Avatar Protocol - The Player-First System
 * "As Within, So Without"
 */
const AvatarProtocol = ({ level, color, onPhaseComplete }: AvatarProtocolProps) => {
  const [internalComplete, setInternalComplete] = useState(false);
  const [externalComplete, setExternalComplete] = useState(false);
  const [isAnimatingStats, setIsAnimatingStats] = useState(false);
  
  const handleInternalComplete = useCallback(() => {
    setIsAnimatingStats(true);
    setInternalComplete(true);
    onPhaseComplete('internal');
    setTimeout(() => setIsAnimatingStats(false), 1000);
  }, [onPhaseComplete]);
  
  const handleExternalComplete = useCallback(() => {
    setIsAnimatingStats(true);
    setExternalComplete(true);
    onPhaseComplete('external');
    setTimeout(() => setIsAnimatingStats(false), 1000);
  }, [onPhaseComplete]);
  
  const data = levelData[level];
  if (!data) return null;
  
  // Calculate current stats based on completion
  const currentStats = {
    hydration: internalComplete ? data.statBoosts.hydration + (externalComplete ? 50 : 0) : 10,
    stamina: internalComplete ? data.statBoosts.stamina + (externalComplete ? 50 : 0) : 10,
    vibe: internalComplete ? data.statBoosts.vibe + (externalComplete ? 50 : 0) : 10,
  };
  
  return (
    <div className="space-y-4">
      {/* Level Vibe Header */}
      <motion.div
        className="text-center mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs tracking-[0.15em]"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            background: `linear-gradient(135deg, ${data.chakraColor}25, ${data.chakraColor}10)`,
            border: `1px solid ${data.chakraColor}60`,
            color: data.chakraColor,
            boxShadow: `0 0 15px ${data.chakraColor}20`,
          }}
        >
          THE VIBE: "{data.vibe}"
        </span>
      </motion.div>
      
      {/* Player Stats */}
      <PlayerStats 
        hydration={currentStats.hydration}
        stamina={currentStats.stamina}
        vibe={currentStats.vibe}
        isAnimating={isAnimatingStats}
      />
      
      {/* Phase Cards */}
      <div className="space-y-4">
        {/* Internal Phase - The Avatar */}
        <PhaseCard
          phase="internal"
          title={data.internal.title}
          content={`${data.internal.science}\n\n${data.internal.task}`}
          icon={data.internal.icon}
          isActive={!internalComplete}
          isCompleted={internalComplete}
          isLocked={false}
          color={data.chakraColor}
          onActivate={handleInternalComplete}
        />
        
        {/* External Phase - The Map */}
        <PhaseCard
          phase="external"
          title={data.external.title}
          content={data.external.lesson}
          culture={data.external.culture}
          icon={MapPin}
          isActive={internalComplete && !externalComplete}
          isCompleted={externalComplete}
          isLocked={!internalComplete}
          color={data.chakraColor}
          onActivate={handleExternalComplete}
        />
      </div>
      
      {/* Completion Message */}
      <AnimatePresence>
        {externalComplete && (
          <motion.div
            className="p-4 rounded-xl text-center"
            style={{
              background: `linear-gradient(135deg, ${data.chakraColor}20, ${data.chakraColor}10)`,
              border: `1px solid ${data.chakraColor}`,
              boxShadow: `0 0 30px ${data.chakraColor}30`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <span
              className="text-sm tracking-[0.1em]"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: data.chakraColor,
              }}
            >
              ⚡ AS WITHIN, SO WITHOUT — LEVEL {level} COMPLETE ⚡
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvatarProtocol;
