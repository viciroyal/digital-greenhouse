import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Sparkles } from 'lucide-react';

interface GoldenTicketCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  type: 'confetti' | 'sparkle' | 'drop';
}

/**
 * GOLDEN TICKET CELEBRATION
 * 
 * Triggered when Level 4 (Oshun/The Sweet Alchemy) is completed.
 * Features gold & water confetti explosion with reward modal.
 */
const GoldenTicketCelebration = ({ isVisible, onClose }: GoldenTicketCelebrationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const REWARD_CODE = "ALCHEMY20";

  // Gold & Water color palette
  const colors = [
    '#FFD700', // Gold
    '#FFF8DC', // Cornsilk
    '#DAA520', // Goldenrod
    '#B8860B', // Dark Goldenrod
    '#00CED1', // Dark Turquoise (water)
    '#48D1CC', // Medium Turquoise
    '#40E0D0', // Turquoise
    '#7FFFD4', // Aquamarine
  ];

  // Play triumphant celebration sound
  const playCelebrationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const now = audioContext.currentTime;

      // Master gain
      const masterGain = audioContext.createGain();
      masterGain.connect(audioContext.destination);
      masterGain.gain.setValueAtTime(0.25, now);

      // Triumphant ascending arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5 to G6
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        
        gain.gain.setValueAtTime(0, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.3, now + i * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.8);
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.8);
      });

      // Shimmer effect
      const shimmer = audioContext.createOscillator();
      const shimmerGain = audioContext.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(2093, now + 0.6);
      shimmerGain.gain.setValueAtTime(0, now + 0.6);
      shimmerGain.gain.linearRampToValueAtTime(0.15, now + 1);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 2);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(masterGain);
      shimmer.start(now + 0.6);
      shimmer.stop(now + 2);

      // Water drop sounds
      for (let i = 0; i < 5; i++) {
        const drop = audioContext.createOscillator();
        const dropGain = audioContext.createGain();
        drop.type = 'sine';
        const dropFreq = 800 + Math.random() * 400;
        drop.frequency.setValueAtTime(dropFreq, now + 1 + i * 0.15);
        drop.frequency.exponentialRampToValueAtTime(dropFreq * 0.6, now + 1.2 + i * 0.15);
        dropGain.gain.setValueAtTime(0.1, now + 1 + i * 0.15);
        dropGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4 + i * 0.15);
        drop.connect(dropGain);
        dropGain.connect(masterGain);
        drop.start(now + 1 + i * 0.15);
        drop.stop(now + 1.5 + i * 0.15);
      }
    } catch (e) {
      console.log('Audio not available');
    }
  }, []);

  // Create confetti particle
  const createParticle = useCallback((x: number, y: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 5 + Math.random() * 15;
    const types: Particle['type'][] = ['confetti', 'sparkle', 'drop'];
    
    return {
      id: Math.random(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      size: 4 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.4,
      life: 0,
      maxLife: 120 + Math.random() * 60,
      type: types[Math.floor(Math.random() * types.length)],
    };
  }, [colors]);

  // Canvas animation
  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    playCelebrationSound();

    // Initial explosion from multiple points
    const explosionPoints = [
      { x: canvas.width * 0.3, y: canvas.height * 0.3 },
      { x: canvas.width * 0.5, y: canvas.height * 0.2 },
      { x: canvas.width * 0.7, y: canvas.height * 0.3 },
    ];

    explosionPoints.forEach(point => {
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push(createParticle(point.x, point.y));
      }
    });

    // Show modal after initial explosion
    setTimeout(() => setShowModal(true), 500);

    let frameCount = 0;
    const maxFrames = 300;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Add continuous particles
      if (frameCount < 150 && frameCount % 5 === 0) {
        const x = Math.random() * canvas.width;
        particlesRef.current.push(createParticle(x, -20));
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.life < p.maxLife && alpha > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = alpha;

          if (p.type === 'confetti') {
            // Rectangle confetti
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else if (p.type === 'sparkle') {
            // Star sparkle
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
              const innerAngle = angle + Math.PI / 5;
              if (i === 0) {
                ctx.moveTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
              } else {
                ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
              }
              ctx.lineTo(Math.cos(innerAngle) * (p.size / 2), Math.sin(innerAngle) * (p.size / 2));
            }
            ctx.closePath();
            ctx.fill();
          } else {
            // Water drop
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.fill();
          }

          ctx.restore();
          return true;
        }
        return false;
      });

      if (frameCount < maxFrames || particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      particlesRef.current = [];
    };
  }, [isVisible, createParticle, playCelebrationSound]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(REWARD_CODE);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 40%, hsl(45 50% 12%), hsl(45 30% 5%))',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
          />

          {/* Confetti canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Modal */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                className="relative z-10 mx-4 max-w-md w-full"
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              >
                {/* Golden ticket card */}
                <div
                  className="relative p-8 rounded-3xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 80% 20%), hsl(35 70% 15%))',
                    border: '3px solid hsl(45 90% 55%)',
                    boxShadow: '0 0 60px hsl(45 90% 50% / 0.5), inset 0 0 40px hsl(45 80% 40% / 0.3)',
                  }}
                >
                  {/* Shimmer overlay */}
                  <motion.div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      background: 'linear-gradient(45deg, transparent 30%, hsl(45 90% 70% / 0.4) 50%, transparent 70%)',
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* Decorative corners */}
                  <div
                    className="absolute top-3 left-3 w-8 h-8"
                    style={{
                      borderTop: '3px solid hsl(45 90% 60%)',
                      borderLeft: '3px solid hsl(45 90% 60%)',
                    }}
                  />
                  <div
                    className="absolute top-3 right-3 w-8 h-8"
                    style={{
                      borderTop: '3px solid hsl(45 90% 60%)',
                      borderRight: '3px solid hsl(45 90% 60%)',
                    }}
                  />
                  <div
                    className="absolute bottom-3 left-3 w-8 h-8"
                    style={{
                      borderBottom: '3px solid hsl(45 90% 60%)',
                      borderLeft: '3px solid hsl(45 90% 60%)',
                    }}
                  />
                  <div
                    className="absolute bottom-3 right-3 w-8 h-8"
                    style={{
                      borderBottom: '3px solid hsl(45 90% 60%)',
                      borderRight: '3px solid hsl(45 90% 60%)',
                    }}
                  />

                  {/* Sparkle icon */}
                  <motion.div
                    className="flex justify-center mb-4"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-16 h-16" style={{ color: 'hsl(45 90% 60%)' }} />
                  </motion.div>

                  {/* Header */}
                  <motion.h2
                    className="text-3xl md:text-4xl text-center mb-2"
                    style={{
                      fontFamily: "'Staatliches', sans-serif",
                      color: 'hsl(45 90% 65%)',
                      letterSpacing: '0.15em',
                      textShadow: '0 0 20px hsl(45 90% 50% / 0.8)',
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    MASTER STEWARD RECOGNIZED
                  </motion.h2>

                  {/* Divider */}
                  <motion.div
                    className="h-0.5 mx-auto my-4"
                    style={{
                      width: 200,
                      background: 'linear-gradient(90deg, transparent, hsl(45 90% 55%), transparent)',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 }}
                  />

                  {/* Body text */}
                  <motion.p
                    className="text-center text-lg mb-6"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      color: 'hsl(40 60% 75%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    The Alchemy is complete.<br />
                    The Harvest is yours.
                  </motion.p>

                  {/* Reward code box */}
                  <motion.div
                    className="mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p
                      className="text-xs text-center mb-2 tracking-widest"
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        color: 'hsl(40 50% 50%)',
                      }}
                    >
                      YOUR REWARD CODE — 20% OFF CSA
                    </p>
                    <motion.button
                      className="w-full flex items-center justify-center gap-3 p-4 rounded-xl"
                      style={{
                        background: 'hsl(45 40% 12%)',
                        border: '2px dashed hsl(45 70% 50%)',
                      }}
                      onClick={handleCopyCode}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: '0 0 20px hsl(45 90% 50% / 0.3)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span
                        className="text-2xl tracking-[0.3em]"
                        style={{
                          fontFamily: "'Staatliches', sans-serif",
                          color: 'hsl(45 90% 65%)',
                        }}
                      >
                        {REWARD_CODE}
                      </span>
                      {codeCopied ? (
                        <Check className="w-5 h-5" style={{ color: 'hsl(140 60% 50%)' }} />
                      ) : (
                        <Copy className="w-5 h-5" style={{ color: 'hsl(45 70% 60%)' }} />
                      )}
                    </motion.button>
                    {codeCopied && (
                      <motion.p
                        className="text-xs text-center mt-2"
                        style={{ color: 'hsl(140 60% 50%)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        COPIED TO CLIPBOARD
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Close button */}
                  <motion.button
                    className="w-full py-3 rounded-xl text-sm tracking-widest"
                    style={{
                      fontFamily: "'Staatliches', sans-serif",
                      background: 'linear-gradient(135deg, hsl(45 80% 50%), hsl(35 70% 45%))',
                      color: 'hsl(45 20% 10%)',
                      boxShadow: '0 4px 20px hsl(45 80% 40% / 0.4)',
                    }}
                    onClick={onClose}
                    whileHover={{ scale: 1.02, boxShadow: '0 6px 30px hsl(45 80% 50% / 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    CONTINUE TO HARVEST
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoldenTicketCelebration;
