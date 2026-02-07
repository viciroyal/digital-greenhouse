import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HogonSealProps {
  status: 'pending' | 'reviewed' | 'certified';
  color: string;
  onApprove?: () => void; // For demo purposes
}

/**
 * The Hogon's Seal - Validation Stamp
 * A Dogon Granary Door design that transforms from stone-grey to gold when certified
 * Status progression: pending (grey) → reviewed (silver) → certified (gold)
 */
const HogonSeal = ({ status, color, onApprove }: HogonSealProps) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const isCertified = status === 'certified';
  const isReviewed = status === 'reviewed';
  const isPending = status === 'pending';
  
  // Color states: stone-grey → silver → gold
  const sealColors = {
    primary: isCertified ? 'hsl(51 100% 50%)' : isReviewed ? 'hsl(0 0% 70%)' : 'hsl(0 0% 30%)',
    secondary: isCertified ? 'hsl(51 80% 40%)' : isReviewed ? 'hsl(0 0% 50%)' : 'hsl(0 0% 20%)',
    tertiary: isCertified ? 'hsl(51 100% 60%)' : isReviewed ? 'hsl(0 0% 60%)' : 'hsl(0 0% 40%)',
    text: isCertified ? 'hsl(51 100% 50%)' : isReviewed ? 'hsl(0 0% 70%)' : 'hsl(0 0% 50%)',
    background: isCertified 
      ? 'linear-gradient(135deg, hsl(51 50% 15%), hsl(40 40% 10%))'
      : isReviewed 
        ? 'linear-gradient(135deg, hsl(0 0% 15%), hsl(0 0% 10%))'
        : 'hsl(0 0% 10%)',
    border: isCertified ? 'hsl(51 100% 50%)' : isReviewed ? 'hsl(0 0% 50%)' : 'hsl(0 0% 25%)',
    glow: isCertified ? '0 0 30px hsl(51 80% 40% / 0.4)' : 'none',
  };

  // Play level up sound (ascending arpeggio)
  const playLevelUpSound = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    // Ascending arpeggio - C4, E4, G4, C5
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.4);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(audioContext.currentTime + i * 0.15);
      osc.stop(audioContext.currentTime + i * 0.15 + 0.5);
    });

    // Final shimmer
    setTimeout(() => {
      const shimmer = audioContext.createOscillator();
      const shimmerGain = audioContext.createGain();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(1046.5, audioContext.currentTime);
      shimmerGain.gain.setValueAtTime(0.15, audioContext.currentTime);
      shimmerGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(audioContext.destination);
      shimmer.start();
      shimmer.stop(audioContext.currentTime + 1);
    }, 600);
  }, []);

  const handleDemoApprove = () => {
    if (!isCertified && onApprove) {
      playLevelUpSound();
      setShowLevelUp(true);
      setTimeout(() => {
        onApprove();
        setTimeout(() => setShowLevelUp(false), 2000);
      }, 500);
    }
  };

  return (
    <div className="relative">
      {/* Level Up Animation Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <motion.h2
                className="text-4xl md:text-6xl tracking-wider"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(51 100% 50%)',
                  textShadow: '0 0 40px hsl(51 100% 50%), 0 0 80px hsl(51 80% 40%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2,
                }}
              >
                LEVEL UP!
              </motion.h2>
              
              {/* Particle explosion */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: 'hsl(51 100% 50%)',
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                    opacity: 0,
                    scale: [1, 0.5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Seal Container */}
      <motion.div
        className="flex flex-col items-center p-6 rounded-2xl cursor-pointer"
        style={{
          background: sealColors.background,
          border: `2px solid ${sealColors.border}`,
          boxShadow: sealColors.glow,
        }}
        onClick={handleDemoApprove}
        whileHover={!isCertified ? { scale: 1.02 } : {}}
        whileTap={!isCertified ? { scale: 0.98 } : {}}
      >
        {/* Dogon Granary Door Seal */}
        <motion.svg
          viewBox="0 0 100 100"
          className="w-24 h-24 md:w-32 md:h-32"
          animate={isCertified ? {
            filter: [
              'drop-shadow(0 0 10px hsl(51 100% 50%))',
              'drop-shadow(0 0 20px hsl(51 100% 60%))',
              'drop-shadow(0 0 10px hsl(51 100% 50%))',
            ],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Outer circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={sealColors.primary}
            strokeWidth="3"
            fill="none"
          />
          
          {/* Inner patterns - Dogon granary door design */}
          {/* Central cross */}
          <line
            x1="50"
            y1="15"
            x2="50"
            y2="85"
            stroke={sealColors.primary}
            strokeWidth="2"
          />
          <line
            x1="15"
            y1="50"
            x2="85"
            y2="50"
            stroke={sealColors.primary}
            strokeWidth="2"
          />
          
          {/* Ancestor figures in quadrants */}
          {/* Top left */}
          <rect
            x="22"
            y="22"
            width="8"
            height="16"
            rx="2"
            fill={sealColors.primary}
          />
          <circle
            cx="26"
            cy="20"
            r="4"
            fill={sealColors.primary}
          />
          
          {/* Top right */}
          <rect
            x="70"
            y="22"
            width="8"
            height="16"
            rx="2"
            fill={sealColors.primary}
          />
          <circle
            cx="74"
            cy="20"
            r="4"
            fill={sealColors.primary}
          />
          
          {/* Bottom left */}
          <rect
            x="22"
            y="62"
            width="8"
            height="16"
            rx="2"
            fill={sealColors.primary}
          />
          <circle
            cx="26"
            cy="60"
            r="4"
            fill={sealColors.primary}
          />
          
          {/* Bottom right */}
          <rect
            x="70"
            y="62"
            width="8"
            height="16"
            rx="2"
            fill={sealColors.primary}
          />
          <circle
            cx="74"
            cy="60"
            r="4"
            fill={sealColors.primary}
          />
          
          {/* Central granary symbol */}
          <motion.rect
            x="40"
            y="35"
            width="20"
            height="30"
            rx="3"
            fill={sealColors.secondary}
            stroke={sealColors.primary}
            strokeWidth="2"
          />
          {/* Granary door pattern */}
          <line
            x1="45"
            y1="40"
            x2="45"
            y2="60"
            stroke={sealColors.tertiary}
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="40"
            x2="50"
            y2="60"
            stroke={sealColors.tertiary}
            strokeWidth="1"
          />
          <line
            x1="55"
            y1="40"
            x2="55"
            y2="60"
            stroke={sealColors.tertiary}
            strokeWidth="1"
          />
        </motion.svg>

        {/* Status Text */}
        <motion.div className="mt-4 text-center">
          <AnimatePresence mode="wait">
            {isCertified ? (
              <motion.div
                key="certified"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p 
                  className="text-lg tracking-wider"
                  style={{ 
                    fontFamily: "'Staatliches', sans-serif",
                    color: 'hsl(51 100% 50%)',
                    textShadow: '0 0 10px hsl(51 80% 40%)',
                  }}
                >
                  CERTIFIED STEWARD
                </p>
                <p 
                  className="text-xs font-mono mt-1 opacity-70"
                  style={{ color: 'hsl(40 50% 60%)' }}
                >
                  The Ancestors Recognize You
                </p>
              </motion.div>
            ) : isReviewed ? (
              <motion.div
                key="reviewed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p 
                  className="text-sm font-mono tracking-wider"
                  style={{ color: 'hsl(0 0% 70%)' }}
                >
                  UNDER REVIEW
                </p>
                <p 
                  className="text-xs font-mono mt-1 opacity-60"
                  style={{ color: 'hsl(0 0% 60%)' }}
                >
                  The Hogon is Examining Your Work
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="pending"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p 
                  className="text-sm font-mono tracking-wider"
                  style={{ color: 'hsl(0 0% 50%)' }}
                >
                  AWAITING SUBMISSION
                </p>
                <p 
                  className="text-xs font-mono mt-1 opacity-50"
                  style={{ color: 'hsl(0 0% 40%)' }}
                >
                  Plant Your Evidence to Begin
                </p>
                {onApprove && (
                  <p 
                    className="text-xs font-mono mt-3 opacity-70"
                    style={{ color }}
                  >
                    (Click to preview certification)
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HogonSeal;