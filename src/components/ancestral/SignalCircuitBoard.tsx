import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Compass, AudioLines, Star, Lock, Check, Volume2 } from 'lucide-react';

interface SignalCircuitBoardProps {
  color: string;
  onSwitchComplete?: (switchId: string) => void;
}

// Solfeggio frequencies for each switch
const switchFrequencies: Record<string, number> = {
  A: 528, // Fire - Solar Plexus
  B: 639, // Flow - Heart
  C: 741, // Voice - Throat
  D: 852, // Receiver - Third Eye
};

// Switch configuration
const switchConfig = [
  {
    id: 'A',
    name: 'FIRE',
    culture: 'Vedic (Agnihotra)',
    task: 'Clear the Atmosphere',
    chakra: 'Solar Plexus',
    color: 'hsl(45 90% 55%)', // Yellow
    icon: Flame,
  },
  {
    id: 'B',
    name: 'FLOW',
    culture: 'Chinese (Feng Shui)',
    task: 'Unblock the Meridian',
    chakra: 'Heart',
    color: 'hsl(140 50% 45%)', // Green
    icon: Compass,
  },
  {
    id: 'C',
    name: 'VOICE',
    culture: 'Aboriginal (Songlines)',
    task: 'Sing to the Stomata',
    chakra: 'Throat',
    color: 'hsl(210 70% 55%)', // Blue
    icon: AudioLines,
  },
  {
    id: 'D',
    name: 'RECEIVER',
    culture: 'Dogon (Antenna)',
    task: 'Install the Coil',
    chakra: 'Third Eye',
    color: 'hsl(280 60% 55%)', // Indigo
    icon: Star,
  },
];

/**
 * Generate and play a sine wave at the specified frequency
 */
const playSineWave = (frequency: number, duration: number = 2) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Fade in/out envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + duration - 0.5);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    return audioContext;
  } catch (e) {
    console.warn('Audio playback not supported:', e);
    return null;
  }
};

/**
 * Circuit Switch Component
 */
const CircuitSwitch = ({
  config,
  isUnlocked,
  isActive,
  isCompleted,
  onActivate,
  index,
}: {
  config: typeof switchConfig[0];
  isUnlocked: boolean;
  isActive: boolean;
  isCompleted: boolean;
  onActivate: () => void;
  index: number;
}) => {
  const IconComponent = config.icon;
  const frequency = switchFrequencies[config.id];
  
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15 }}
    >
      {/* Switch Container */}
      <motion.button
        className="relative w-full p-4 rounded-xl overflow-hidden"
        style={{
          background: isCompleted 
            ? `linear-gradient(135deg, ${config.color}20, ${config.color}10)`
            : isUnlocked 
              ? 'linear-gradient(135deg, hsl(0 0% 10%), hsl(0 0% 8%))'
              : 'linear-gradient(135deg, hsl(0 0% 6%), hsl(0 0% 4%))',
          border: isCompleted 
            ? `2px solid ${config.color}`
            : isActive
              ? `2px solid ${config.color}80`
              : isUnlocked 
                ? '1px solid hsl(0 0% 25%)'
                : '1px solid hsl(0 0% 15%)',
          opacity: isUnlocked ? 1 : 0.5,
          cursor: isUnlocked && !isCompleted ? 'pointer' : isCompleted ? 'default' : 'not-allowed',
        }}
        onClick={() => isUnlocked && !isCompleted && onActivate()}
        whileHover={isUnlocked && !isCompleted ? { scale: 1.02 } : {}}
        whileTap={isUnlocked && !isCompleted ? { scale: 0.98 } : {}}
        disabled={!isUnlocked || isCompleted}
      >
        {/* Glow effect when active */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: `radial-gradient(circle at center, ${config.color}30, transparent 70%)`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}
        
        <div className="relative flex items-center gap-4">
          {/* Icon Circle */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: isCompleted 
                ? config.color 
                : isUnlocked 
                  ? `${config.color}20` 
                  : 'hsl(0 0% 15%)',
              border: `2px solid ${isUnlocked ? config.color : 'hsl(0 0% 25%)'}`,
              boxShadow: isCompleted ? `0 0 20px ${config.color}60` : 'none',
            }}
          >
            {isCompleted ? (
              <Check className="w-5 h-5" style={{ color: 'hsl(0 0% 10%)' }} />
            ) : !isUnlocked ? (
              <Lock className="w-4 h-4" style={{ color: 'hsl(0 0% 40%)' }} />
            ) : (
              <IconComponent 
                className="w-5 h-5" 
                style={{ color: config.color }}
              />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  background: isUnlocked ? `${config.color}20` : 'hsl(0 0% 15%)',
                  color: isUnlocked ? config.color : 'hsl(0 0% 40%)',
                }}
              >
                STEP {config.id}
              </span>
              {isActive && (
                <motion.div
                  className="flex items-center gap-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Volume2 className="w-3 h-3" style={{ color: config.color }} />
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: config.color }}
                  >
                    {frequency} Hz
                  </span>
                </motion.div>
              )}
            </div>
            
            <h4
              className="text-sm mb-0.5"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: isUnlocked ? config.color : 'hsl(0 0% 40%)',
                letterSpacing: '0.08em',
              }}
            >
              {config.name} ({config.culture})
            </h4>
            
            <p
              className="text-xs"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: isUnlocked ? 'hsl(40 30% 60%)' : 'hsl(0 0% 35%)',
              }}
            >
              Task: "{config.task}"
            </p>
          </div>
          
          {/* Frequency Badge */}
          <div
            className="text-right flex-shrink-0"
          >
            <span
              className="text-lg font-mono"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: isCompleted ? config.color : isUnlocked ? 'hsl(0 0% 50%)' : 'hsl(0 0% 30%)',
              }}
            >
              {frequency}
            </span>
            <span
              className="text-[10px] font-mono block"
              style={{
                color: isUnlocked ? 'hsl(0 0% 45%)' : 'hsl(0 0% 30%)',
              }}
            >
              Hz
            </span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};

/**
 * Copper Connection Line between switches
 */
const CopperLine = ({ isActive, index }: { isActive: boolean; index: number }) => (
  <div className="relative h-8 flex justify-center">
    <motion.div
      className="w-1 h-full rounded-full"
      style={{
        background: isActive 
          ? 'linear-gradient(180deg, hsl(25 70% 50%), hsl(35 80% 60%))'
          : 'linear-gradient(180deg, hsl(25 30% 25%), hsl(35 30% 20%))',
        boxShadow: isActive ? '0 0 10px hsl(30 70% 50% / 0.6)' : 'none',
      }}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ delay: 0.3 + index * 0.15 }}
    />
    {/* Energy pulse when active */}
    {isActive && (
      <motion.div
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: 'hsl(35 90% 60%)',
          boxShadow: '0 0 8px hsl(35 90% 60%)',
        }}
        animate={{
          top: ['0%', '100%'],
          opacity: [1, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    )}
  </div>
);

/**
 * Signal Circuit Board - Level 3 Interactive Component
 * 4 switches representing the ascension through chakras
 * Shango as the conductor of energy flow
 */
const SignalCircuitBoard = ({ color, onSwitchComplete }: SignalCircuitBoardProps) => {
  const [completedSwitches, setCompletedSwitches] = useState<Set<string>>(new Set());
  const [activeSwitch, setActiveSwitch] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const isSwitchUnlocked = useCallback((switchId: string) => {
    const index = switchConfig.findIndex(s => s.id === switchId);
    if (index === 0) return true; // First switch always unlocked
    const prevSwitch = switchConfig[index - 1];
    return completedSwitches.has(prevSwitch.id);
  }, [completedSwitches]);
  
  const handleActivate = useCallback((switchId: string) => {
    const config = switchConfig.find(s => s.id === switchId);
    if (!config) return;
    
    setActiveSwitch(switchId);
    
    // Play the frequency
    const frequency = switchFrequencies[switchId];
    audioContextRef.current = playSineWave(frequency, 2.5);
    
    // Complete the switch after audio plays
    setTimeout(() => {
      setActiveSwitch(null);
      setCompletedSwitches(prev => new Set([...prev, switchId]));
      onSwitchComplete?.(switchId);
    }, 2500);
  }, [onSwitchComplete]);
  
  const allCompleted = completedSwitches.size === switchConfig.length;
  
  return (
    <div className="space-y-4">
      {/* Header: Shango as Conductor */}
      <div className="text-center mb-6">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3"
          style={{
            background: 'linear-gradient(135deg, hsl(15 80% 25%), hsl(25 70% 20%))',
            border: '1px solid hsl(25 80% 45%)',
            boxShadow: '0 0 20px hsl(25 80% 40% / 0.3)',
          }}
          animate={{
            boxShadow: [
              '0 0 20px hsl(25 80% 40% / 0.3)',
              '0 0 30px hsl(25 80% 40% / 0.5)',
              '0 0 20px hsl(25 80% 40% / 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span
            className="text-xs tracking-[0.15em]"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(25 80% 60%)',
            }}
          >
            ⚡ SHANGO: THE CONDUCTOR ⚡
          </span>
        </motion.div>
        
        <p
          className="text-xs leading-relaxed max-w-sm mx-auto"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: 'hsl(40 30% 60%)',
          }}
        >
          Shango does not just strike; he <span style={{ color }}>conducts</span>. 
          You must clear the path (Fire/Flow) before you call the lightning (Dogon).
        </p>
      </div>
      
      {/* Circuit Board */}
      <div 
        className="relative p-4 rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 6%), hsl(0 0% 4%))',
          border: '1px solid hsl(25 40% 25%)',
          boxShadow: 'inset 0 0 40px hsl(0 0% 0% / 0.5)',
        }}
      >
        {/* Copper frame accent */}
        <div
          className="absolute inset-2 rounded-xl pointer-events-none"
          style={{
            border: '1px dashed hsl(25 50% 30%)',
          }}
        />
        
        <div className="relative space-y-0">
          {switchConfig.map((config, index) => (
            <div key={config.id}>
              <CircuitSwitch
                config={config}
                isUnlocked={isSwitchUnlocked(config.id)}
                isActive={activeSwitch === config.id}
                isCompleted={completedSwitches.has(config.id)}
                onActivate={() => handleActivate(config.id)}
                index={index}
              />
              
              {/* Copper connection line (except after last) */}
              {index < switchConfig.length - 1 && (
                <CopperLine 
                  isActive={completedSwitches.has(config.id)} 
                  index={index}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Circuit completion message */}
        <AnimatePresence>
          {allCompleted && (
            <motion.div
              className="mt-4 p-4 rounded-xl text-center"
              style={{
                background: 'linear-gradient(135deg, hsl(280 40% 15%), hsl(250 30% 12%))',
                border: '1px solid hsl(280 60% 50%)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <span
                className="text-sm tracking-[0.1em]"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(280 60% 70%)',
                }}
              >
                ⚡ CIRCUIT COMPLETE — THE SIGNAL IS LIVE ⚡
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Frequency Legend */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {switchConfig.map(config => (
          <div 
            key={config.id}
            className="flex items-center gap-1.5 text-[9px] font-mono"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: completedSwitches.has(config.id) ? config.color : 'hsl(0 0% 40%)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ 
                background: config.color,
                opacity: completedSwitches.has(config.id) ? 1 : 0.4,
                boxShadow: completedSwitches.has(config.id) ? `0 0 6px ${config.color}` : 'none',
              }}
            />
            <span>{switchFrequencies[config.id]} Hz</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignalCircuitBoard;
