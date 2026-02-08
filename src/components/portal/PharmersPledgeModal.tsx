import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PharmersPledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// The Civilization Contract - Full 12-Tribe Harmonic Pledge
const pledgeLines = [
  { text: "", color: "transparent", glow: false },
  { 
    text: "We stand on the ROOTS of the Xingu & Muscogee.", 
    color: "hsl(0 70% 55%)", 
    glow: true,
    glowColor: "hsl(0 70% 55%)"
  },
  { text: "", color: "transparent", glow: false },
  { 
    text: "We build on the STONE of the Olmec & Inca.", 
    color: "hsl(35 85% 55%)", 
    glow: true,
    glowColor: "hsl(35 85% 55%)"
  },
  { text: "", color: "transparent", glow: false },
  { 
    text: "We align with the STARS of the Dogon & Maya.", 
    color: "hsl(190 90% 55%)", 
    glow: true,
    glowColor: "hsl(190 90% 55%)"
  },
  { text: "", color: "transparent", glow: false },
  { 
    text: "We refine the GOLD of Kemit & Joseon.", 
    color: "hsl(51 100% 55%)", 
    glow: true,
    glowColor: "hsl(51 100% 55%)"
  },
  { text: "", color: "transparent", glow: false },
  { 
    text: "We are bound by the LAW of the Haudenosaunee.", 
    color: "hsl(140 70% 50%)", 
    glow: true,
    glowColor: "hsl(140 70% 50%)",
    subtext: "(The 7th Generation)"
  },
  { text: "", color: "transparent", glow: false },
  { 
    text: "We live by the BOND of Ubuntu.", 
    color: "hsl(0 0% 95%)", 
    glow: true,
    glowColor: "hsl(0 0% 95%)",
    subtext: "(I Am Because We Are)"
  },
  { text: "", color: "transparent", glow: false },
  { text: "", color: "transparent", glow: false },
  { 
    text: "To enter this gate is to sign the contract with the Ancestors.", 
    color: "hsl(45 60% 70%)", 
    glow: false 
  },
];

/**
 * The Pharmer's Pledge Modal - "The Soil Chamber"
 * 
 * A sacred scroll experience with Chakra-aligned ancestral colors,
 * Shepard Tone audio, and spore dissolution animation.
 */
const PharmersPledgeModal = ({ isOpen, onClose }: PharmersPledgeModalProps) => {
  const [scrollComplete, setScrollComplete] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [sporeParticles, setSporeParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const navigate = useNavigate();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScrollComplete(false);
      setIsUnlocking(false);
      setSporeParticles([]);
    }
  }, [isOpen]);

  // Auto-scroll completion timer
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setScrollComplete(true);
    }, 14000); // 14 seconds for the full scroll

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Heavy Stone Door Rumble - Deep grinding stone with reverberant echoes
  const playStoneDoorRumble = useCallback(() => {
    if (audioContextRef.current) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    // Create noise buffer for stone grinding texture
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 3, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.5;
    }

    // Stone grinding noise layer
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

    // Deep resonant bass rumble (stone mass)
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

    // Mid-frequency grinding resonance
    const grindOsc = audioContext.createOscillator();
    grindOsc.type = 'sawtooth';
    grindOsc.frequency.setValueAtTime(55, audioContext.currentTime);
    grindOsc.frequency.setValueAtTime(48, audioContext.currentTime + 0.5);
    grindOsc.frequency.setValueAtTime(52, audioContext.currentTime + 1);
    grindOsc.frequency.linearRampToValueAtTime(40, audioContext.currentTime + 2.5);
    const grindFilter = audioContext.createBiquadFilter();
    grindFilter.type = 'lowpass';
    grindFilter.frequency.value = 150;
    const grindGain = audioContext.createGain();
    grindGain.gain.setValueAtTime(0, audioContext.currentTime);
    grindGain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.3);
    grindGain.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 1.5);
    grindGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);
    grindOsc.connect(grindFilter);
    grindFilter.connect(grindGain);
    grindGain.connect(audioContext.destination);
    grindOsc.start(audioContext.currentTime);
    grindOsc.stop(audioContext.currentTime + 3);

    // Final thud impact when door settles
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

  // Generate spore particles for dissolution effect
  const generateSpores = useCallback(() => {
    const newSpores = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }));
    setSporeParticles(newSpores);
  }, []);

  const handleRemember = () => {
    setIsUnlocking(true);
    playStoneDoorRumble();
    generateSpores();
    
    // Delay navigation for the full experience
    setTimeout(() => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      onClose();
      navigate('/ancestral-path');
    }, 3000);
  };

  // Cleanup audio context on unmount
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
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* The Soil Chamber Background - Dark Soil #1a1a00 */}
          <div 
            className="absolute inset-0"
            style={{
              background: '#1a1a00',
            }}
          />
          
          {/* Animated Mycelial Network Texture */}
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

          {/* Stars at the top (where text disappears into) */}
          <div className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none">
            {[...Array(30)].map((_, i) => (
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

          {/* Gold Leaf Border - Ancient & Chipped */}
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
          >
            {/* Chipped corner effects */}
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-[hsl(0_0%_10%)]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(0_0%_10%)]" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-[hsl(0_0%_10%)]" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
            <div className="absolute -bottom-1 -right-1 w-8 h-3 bg-[hsl(0_0%_10%)]" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
          </motion.div>

          {/* Close button */}
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
          <div className="relative w-full max-w-4xl mx-auto px-8 h-full flex flex-col items-center justify-center overflow-hidden">
            
            {/* The Title - Staatliches Carved Wood Style */}
            <motion.h1
              className="text-2xl md:text-4xl lg:text-5xl text-center mb-4 tracking-[0.1em] z-10 px-4"
              style={{
                fontFamily: "'Staatliches', 'Chewy', sans-serif",
                color: 'hsl(51 100% 55%)',
                textShadow: `
                  2px 2px 0 hsl(20 50% 10%),
                  4px 4px 8px rgba(0,0,0,0.8),
                  0 0 40px hsl(51 80% 40% / 0.4)
                `,
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              WE DO NOT JUST GROW FOOD.
            </motion.h1>
            <motion.h2
              className="text-2xl md:text-4xl lg:text-5xl text-center mb-8 tracking-[0.1em] z-10 px-4"
              style={{
                fontFamily: "'Staatliches', 'Chewy', sans-serif",
                color: 'hsl(140 60% 55%)',
                textShadow: `
                  2px 2px 0 hsl(20 50% 10%),
                  4px 4px 8px rgba(0,0,0,0.8),
                  0 0 40px hsl(140 60% 40% / 0.5)
                `,
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              WE GROW CIVILIZATION.
            </motion.h2>

            {/* Star Wars style scrolling text container */}
            <div 
              className="relative w-full h-[45vh] overflow-hidden"
              style={{
                perspective: '350px',
                perspectiveOrigin: 'center top',
              }}
            >
              {/* Top fade into stars */}
              <div 
                className="absolute inset-x-0 top-0 h-24 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, hsl(0 0% 10%) 0%, transparent 100%)',
                }}
              />
              {/* Bottom fade */}
              <div 
                className="absolute inset-x-0 bottom-0 h-24 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(0deg, hsl(0 0% 10%) 0%, transparent 100%)',
                }}
              />

              {/* Scrolling text */}
              <motion.div
                className="absolute inset-x-0 text-center px-4"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(20deg)',
                }}
                initial={{ y: '120%' }}
                animate={{ y: '-120%' }}
                transition={{
                  duration: 14,
                  ease: 'linear',
                }}
              >
                {pledgeLines.map((line, index) => (
                  <div key={index} className="mb-4">
                    <p
                      className="text-base md:text-lg lg:text-xl leading-relaxed"
                      style={{
                        fontFamily: "'Staatliches', sans-serif",
                        letterSpacing: '0.06em',
                        color: line.text ? line.color : 'transparent',
                        textShadow: line.text && line.glow 
                          ? `0 0 15px ${line.glowColor || line.color}, 0 0 30px ${line.glowColor || line.color}, 0 0 50px ${line.glowColor || line.color}` 
                          : line.text 
                            ? '0 0 8px hsl(0 0% 70% / 0.3)' 
                            : 'none',
                      }}
                    >
                      {line.text || '\u00A0'}
                    </p>
                    {line.subtext && (
                      <p
                        className="text-sm md:text-base lg:text-lg mt-1 italic"
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          letterSpacing: '0.02em',
                          color: line.color,
                          opacity: 0.75,
                          textShadow: `0 0 12px ${line.glowColor || line.color}`,
                        }}
                      >
                        {line.subtext}
                      </p>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* The Blood Oath Button */}
            <motion.div
              className="mt-8 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.button
                className="relative px-14 py-5 rounded-lg font-bubble text-lg tracking-wider overflow-hidden"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  background: scrollComplete 
                    ? 'linear-gradient(135deg, hsl(0 70% 40%), hsl(0 80% 30%))'
                    : 'hsl(0 0% 25%)',
                  border: scrollComplete
                    ? '2px solid hsl(0 60% 50%)'
                    : '2px solid hsl(0 0% 35%)',
                  color: scrollComplete ? 'hsl(0 0% 95%)' : 'hsl(0 0% 50%)',
                  boxShadow: scrollComplete 
                    ? '0 0 30px hsl(0 70% 40% / 0.5), inset 0 2px 10px hsl(0 80% 60% / 0.2)'
                    : 'none',
                  cursor: scrollComplete ? 'pointer' : 'not-allowed',
                }}
                disabled={!scrollComplete || isUnlocking}
                whileHover={scrollComplete && !isUnlocking ? { 
                  scale: 1.05,
                  boxShadow: '0 0 50px hsl(0 70% 50% / 0.7), inset 0 2px 15px hsl(0 80% 60% / 0.3)',
                } : {}}
                whileTap={scrollComplete && !isUnlocking ? { scale: 0.98 } : {}}
                onClick={handleRemember}
                animate={isUnlocking ? { scale: [1, 1.1, 0], opacity: [1, 1, 0] } : {}}
                transition={isUnlocking ? { duration: 1.5, ease: 'easeOut' } : {}}
              >
                {/* Spore dissolution particles */}
                <AnimatePresence>
                  {isUnlocking && sporeParticles.map((spore) => (
                    <motion.div
                      key={spore.id}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: 'hsl(51 100% 50%)',
                        left: '50%',
                        top: '50%',
                      }}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{
                        x: spore.x * 3,
                        y: spore.y * 3,
                        opacity: 0,
                        scale: [1, 0.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </AnimatePresence>
                
                <span className="relative z-10" style={{ opacity: isUnlocking ? 0 : 1 }}>
                  I SIGN FOR THE 7TH GENERATION
                </span>
              </motion.button>
              
              {!scrollComplete && !isUnlocking && (
                <motion.p
                  className="text-center mt-4 text-sm"
                  style={{ 
                    fontFamily: "'Space Mono', monospace",
                    color: 'hsl(40 30% 50%)' 
                  }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Read the sacred text...
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Ascending light effect when unlocking */}
          <AnimatePresence>
            {isUnlocking && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 3 }}
                style={{
                  background: `radial-gradient(
                    ellipse at center bottom,
                    hsl(51 100% 50% / 0.3) 0%,
                    transparent 70%
                  )`,
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PharmersPledgeModal;
