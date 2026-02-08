import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PharmersPledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Wampum Belt Icon - Haudenosaunee
const WampumBeltIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 32" className={className} fill="none">
    <rect x="2" y="8" width="60" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="10" cy="16" r="3" fill="hsl(280 60% 70%)" />
    <circle cx="20" cy="16" r="3" fill="hsl(45 80% 90%)" />
    <circle cx="30" cy="16" r="3" fill="hsl(280 60% 70%)" />
    <circle cx="40" cy="16" r="3" fill="hsl(45 80% 90%)" />
    <circle cx="50" cy="16" r="3" fill="hsl(280 60% 70%)" />
    <line x1="10" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="0.5" />
    <line x1="20" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="0.5" />
    <line x1="30" y1="16" x2="40" y2="16" stroke="currentColor" strokeWidth="0.5" />
    <line x1="40" y1="16" x2="50" y2="16" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

// Cowrie Shell Icon - Mali/Mandinka
const CowrieShellIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 48" className={className} fill="none">
    <ellipse cx="20" cy="24" rx="14" ry="20" fill="hsl(45 70% 85%)" stroke="currentColor" strokeWidth="1.5" />
    <path 
      d="M20 8 Q20 24, 20 40" 
      stroke="hsl(30 50% 40%)" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <path d="M12 14 Q20 18, 28 14" stroke="currentColor" strokeWidth="0.75" fill="none" />
    <path d="M10 20 Q20 24, 30 20" stroke="currentColor" strokeWidth="0.75" fill="none" />
    <path d="M10 28 Q20 24, 30 28" stroke="currentColor" strokeWidth="0.75" fill="none" />
    <path d="M12 34 Q20 30, 28 34" stroke="currentColor" strokeWidth="0.75" fill="none" />
  </svg>
);

// Interlinked Circle Icon - Bantu/Ubuntu
const UbuntuCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <circle cx="24" cy="14" r="10" stroke="hsl(350 70% 50%)" strokeWidth="2" fill="none" />
    <circle cx="16" cy="30" r="10" stroke="hsl(140 50% 45%)" strokeWidth="2" fill="none" />
    <circle cx="32" cy="30" r="10" stroke="hsl(220 70% 55%)" strokeWidth="2" fill="none" />
    <circle cx="24" cy="24" r="3" fill="hsl(45 80% 60%)" />
  </svg>
);

interface PillarProps {
  icon: React.ReactNode;
  tribe: string;
  subtitle: string;
  text: string;
  delay: number;
}

const Pillar = ({ icon, tribe, subtitle, text, delay }: PillarProps) => (
  <motion.div
    className="flex flex-col items-center text-center max-w-xs px-4"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    <motion.div 
      className="w-16 h-16 mb-4 text-cream-muted/80"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {icon}
    </motion.div>
    <h4 
      className="text-xl md:text-2xl tracking-wider mb-1"
      style={{ fontFamily: 'Staatliches, sans-serif', color: 'hsl(45 80% 70%)' }}
    >
      {tribe}
    </h4>
    <p className="text-gem-amethyst/80 font-bubble text-sm mb-3">
      {subtitle}
    </p>
    <p className="text-cream-muted/70 font-body text-sm leading-relaxed">
      "{text}"
    </p>
  </motion.div>
);

/**
 * The Pharmer's Pledge Modal - "The Manifesto Gateway"
 * 
 * Displays the three pillars of the Social Operating System:
 * - THE LAW (Haudenosaunee) - 7th Generation
 * - THE WEALTH (Mali/Mandinka) - Sacred Value
 * - THE BOND (Bantu/Ubuntu) - I Am Because We Are
 * 
 * Features stone door rumble audio and spore dissolution animation.
 */
const PharmersPledgeModal = ({ isOpen, onClose }: PharmersPledgeModalProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [sporeParticles, setSporeParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const navigate = useNavigate();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsReady(false);
      setIsUnlocking(false);
      setSporeParticles([]);
      // Enable button after pillars animate in
      const timer = setTimeout(() => setIsReady(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Heavy Stone Door Rumble
  const playStoneDoorRumble = useCallback(() => {
    if (audioContextRef.current) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 3, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(200, audioContext.currentTime);
    noiseFilter.frequency.linearRampToValueAtTime(80, audioContext.currentTime + 2.5);
    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0, audioContext.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.3);
    noiseGain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 1.5);
    noiseGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2.8);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    noiseSource.start(audioContext.currentTime);
    noiseSource.stop(audioContext.currentTime + 3);

    const bassOsc = audioContext.createOscillator();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(35, audioContext.currentTime);
    bassOsc.frequency.linearRampToValueAtTime(25, audioContext.currentTime + 2);
    const bassGain = audioContext.createGain();
    bassGain.gain.setValueAtTime(0, audioContext.currentTime);
    bassGain.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.2);
    bassGain.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 1);
    bassGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.8);
    bassOsc.connect(bassGain);
    bassGain.connect(audioContext.destination);
    bassOsc.start(audioContext.currentTime);
    bassOsc.stop(audioContext.currentTime + 3);

    setTimeout(() => {
      if (!audioContextRef.current) return;
      const thudOsc = audioContext.createOscillator();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(45, audioContext.currentTime);
      thudOsc.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 0.4);
      const thudGain = audioContext.createGain();
      thudGain.gain.setValueAtTime(0.5, audioContext.currentTime);
      thudGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
      thudOsc.connect(thudGain);
      thudGain.connect(audioContext.destination);
      thudOsc.start(audioContext.currentTime);
      thudOsc.stop(audioContext.currentTime + 0.8);
    }, 2200);
  }, []);

  const generateSpores = useCallback(() => {
    const newSpores = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }));
    setSporeParticles(newSpores);
  }, []);

  const handleEnter = () => {
    setIsUnlocking(true);
    playStoneDoorRumble();
    generateSpores();
    
    setTimeout(() => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      onClose();
      navigate('/ancestral-path');
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dark Soil Background */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, hsl(20 30% 6%) 0%, hsl(25 25% 8%) 50%, hsl(20 30% 6%) 100%)',
            }}
          />
          
          {/* Animated Mycelial Network */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${100 + Math.random() * 200}px`,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, hsl(40 30% 30%), transparent)`,
                  transformOrigin: 'left center',
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
                animate={{
                  opacity: [0.2, 0.6, 0.2],
                  scaleX: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Stars */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                  background: 'hsl(0 0% 90%)',
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random(),
                }}
              />
            ))}
          </div>

          {/* Gold Leaf Border */}
          <motion.div
            className="absolute inset-4 md:inset-8 pointer-events-none"
            style={{
              border: '3px solid transparent',
              borderImage: `linear-gradient(
                135deg,
                hsl(51 100% 50%) 0%,
                hsl(40 80% 35%) 20%,
                hsl(51 100% 50%) 40%,
                hsl(35 70% 30%) 60%,
                hsl(51 100% 50%) 80%,
                hsl(40 80% 35%) 100%
              ) 1`,
              filter: 'drop-shadow(0 0 10px hsl(51 80% 40% / 0.3))',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          />

          {/* Close Button */}
          <motion.button
            className="absolute top-8 right-8 md:top-12 md:right-12 p-3 rounded-full z-20"
            style={{
              background: 'hsl(0 0% 15% / 0.8)',
              border: '1px solid hsl(51 80% 40% / 0.5)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            <X className="w-5 h-5" style={{ color: 'hsl(40 30% 70%)' }} />
          </motion.button>

          {/* Content Container */}
          <div className="relative w-full max-w-5xl mx-auto px-4 py-16 md:py-20 flex flex-col items-center">
            
            {/* Title */}
            <motion.div 
              className="text-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 
                className="text-3xl md:text-5xl lg:text-6xl tracking-[0.1em] mb-4"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(51 100% 55%)',
                  textShadow: `
                    2px 2px 0 hsl(20 50% 10%),
                    4px 4px 8px rgba(0,0,0,0.8),
                    0 0 40px hsl(51 80% 40% / 0.4)
                  `,
                }}
              >
                THE MANIFESTO
              </h1>
              <p 
                className="text-cream-muted/60 font-mono text-sm tracking-wider"
              >
                The Social Operating System of AgroMajic
              </p>
            </motion.div>

            {/* Three Pillars - Triangle Layout */}
            <div className="flex flex-col items-center gap-10 md:gap-12 mb-12 md:mb-16">
              {/* TOP - THE LAW */}
              <Pillar
                icon={<WampumBeltIcon className="w-full h-full" />}
                tribe="HAUDENOSAUNEE"
                subtitle="THE LAW"
                text="We decide for the 7th Generation. Every seed we plant is a promise to the future."
                delay={0.3}
              />
              
              {/* BOTTOM ROW */}
              <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-16 lg:gap-24 w-full">
                {/* THE WEALTH */}
                <Pillar
                  icon={<CowrieShellIcon className="w-full h-full" />}
                  tribe="MALI (MANDINKA)"
                  subtitle="THE WEALTH"
                  text="We trade in Sacred Value. We use the Cowrie to measure not just price, but prosperity."
                  delay={0.5}
                />
                
                {/* THE BOND */}
                <Pillar
                  icon={<UbuntuCircleIcon className="w-full h-full" />}
                  tribe="BANTU (UBUNTU)"
                  subtitle="THE BOND"
                  text="We live by Ubuntu: 'I am because we are.' Your harvest is my harvest. We grow together."
                  delay={0.7}
                />
              </div>
            </div>

            {/* Connecting Triangle Lines */}
            <svg 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] pointer-events-none hidden md:block"
              style={{ zIndex: -1 }}
            >
              <defs>
                <linearGradient id="modalLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(45 80% 60% / 0.15)" />
                  <stop offset="50%" stopColor="hsl(280 60% 50% / 0.2)" />
                  <stop offset="100%" stopColor="hsl(45 80% 60% / 0.15)" />
                </linearGradient>
              </defs>
              <polygon 
                points="50%,20% 20%,80% 80%,80%" 
                stroke="url(#modalLineGradient)" 
                strokeWidth="1" 
                fill="none"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Enter Button */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.button
                className="relative px-12 py-5 rounded-xl font-bubble text-lg tracking-wider overflow-hidden"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  background: isReady 
                    ? 'linear-gradient(135deg, hsl(140 50% 35%), hsl(140 40% 25%))'
                    : 'hsl(0 0% 25%)',
                  border: isReady 
                    ? '2px solid hsl(140 60% 45%)'
                    : '2px solid hsl(0 0% 35%)',
                  color: isReady ? 'hsl(140 100% 95%)' : 'hsl(0 0% 50%)',
                  boxShadow: isReady 
                    ? '0 0 30px hsl(140 60% 40% / 0.4), inset 0 1px 0 hsl(140 80% 70% / 0.3)'
                    : 'none',
                  cursor: isReady ? 'pointer' : 'not-allowed',
                }}
                whileHover={isReady ? { scale: 1.05, boxShadow: '0 0 40px hsl(140 60% 40% / 0.6)' } : {}}
                whileTap={isReady ? { scale: 0.98 } : {}}
                onClick={isReady ? handleEnter : undefined}
                disabled={!isReady || isUnlocking}
              >
                {isUnlocking ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      ◈
                    </motion.span>
                    ENTERING THE PATH...
                  </span>
                ) : (
                  'I ACCEPT THE COVENANT'
                )}
              </motion.button>

              {/* Spore Particles */}
              {isUnlocking && sporeParticles.map((spore) => (
                <motion.div
                  key={spore.id}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: 'hsl(140 60% 50%)',
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: spore.x,
                    y: spore.y,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
              ))}
            </motion.div>

            {/* Footer Text */}
            <motion.p
              className="text-center text-cream-muted/40 font-mono text-xs mt-8 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              To enter this gate is to sign the contract with the Ancestors.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PharmersPledgeModal;
