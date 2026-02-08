import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChainBreakingCelebrationProps {
  isVisible: boolean;
  onComplete: () => void;
  levelName?: string;
  color?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: 'chain' | 'spark' | 'glow';
  color: string;
  life: number;
  maxLife: number;
}

/**
 * Chain Breaking Celebration - "Liberation Effect"
 * Plays when a new level is unlocked after completing prerequisites
 * Features chain link particles breaking apart with golden sparks
 */
const ChainBreakingCelebration = ({ 
  isVisible, 
  onComplete, 
  levelName = "NEW LEVEL",
  color = "hsl(45 90% 55%)" // Golden default
}: ChainBreakingCelebrationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [showText, setShowText] = useState(false);

  // Play chain breaking sound effect
  const playChainBreakSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Initial metallic clang
      const clangOsc = audioContext.createOscillator();
      const clangGain = audioContext.createGain();
      const clangFilter = audioContext.createBiquadFilter();
      
      clangOsc.type = 'square';
      clangOsc.frequency.setValueAtTime(220, audioContext.currentTime);
      clangOsc.frequency.exponentialRampToValueAtTime(55, audioContext.currentTime + 0.15);
      
      clangFilter.type = 'bandpass';
      clangFilter.frequency.setValueAtTime(800, audioContext.currentTime);
      clangFilter.Q.setValueAtTime(5, audioContext.currentTime);
      
      clangGain.gain.setValueAtTime(0.3, audioContext.currentTime);
      clangGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      clangOsc.connect(clangFilter);
      clangFilter.connect(clangGain);
      clangGain.connect(audioContext.destination);
      clangOsc.start();
      clangOsc.stop(audioContext.currentTime + 0.3);

      // Chain rattling noise
      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioContext.sampleRate * 0.1));
      }
      
      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseFilter = audioContext.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(2000, audioContext.currentTime);
      const noiseGain = audioContext.createGain();
      noiseGain.gain.setValueAtTime(0.15, audioContext.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioContext.destination);
      noiseSource.start(audioContext.currentTime + 0.05);

      // Triumphant ascending arpeggio
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, audioContext.currentTime);
        
        gain.gain.setValueAtTime(0, audioContext.currentTime + 0.2 + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.25 + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8 + i * 0.08);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(audioContext.currentTime + 0.2 + i * 0.08);
        osc.stop(audioContext.currentTime + 1 + i * 0.08);
      });
    } catch (e) {
      console.log('Audio not available');
    }
  }, []);

  // Initialize particles
  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Chain link particles (breaking apart)
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      particles.push({
        id: i,
        x: centerX + Math.cos(angle) * 30,
        y: centerY + Math.sin(angle) * 30,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 2 - 2,
        size: 12 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        type: 'chain',
        color: `hsl(${30 + Math.random() * 20} ${40 + Math.random() * 20}% ${30 + Math.random() * 15}%)`,
        life: 1,
        maxLife: 1,
      });
    }

    // Golden sparks
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 10;
      particles.push({
        id: 100 + i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 2 + Math.random() * 4,
        rotation: 0,
        rotationSpeed: 0,
        type: 'spark',
        color: `hsl(${40 + Math.random() * 20} ${90 + Math.random() * 10}% ${50 + Math.random() * 30}%)`,
        life: 1,
        maxLife: 1,
      });
    }

    // Glowing orbs
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particles.push({
        id: 200 + i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 8 + Math.random() * 12,
        rotation: 0,
        rotationSpeed: 0,
        type: 'glow',
        color: color,
        life: 1,
        maxLife: 1,
      });
    }

    particlesRef.current = particles;
  }, [color]);

  // Draw chain link shape
  const drawChainLink = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number, 
    rotation: number, 
    color: string,
    alpha: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    
    // Outer oval
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.25;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Inner highlight
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.15, size * 0.7, size * 0.35, 0, 0, Math.PI);
    ctx.strokeStyle = `hsla(45 80% 70% / ${alpha * 0.5})`;
    ctx.lineWidth = size * 0.1;
    ctx.stroke();
    
    ctx.restore();
  };

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let aliveCount = 0;
    const gravity = 0.15;
    const friction = 0.98;

    particlesRef.current.forEach((p) => {
      if (p.life <= 0) return;

      // Update physics
      p.vy += gravity;
      p.vx *= friction;
      p.vy *= friction;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life -= p.type === 'spark' ? 0.025 : 0.015;

      if (p.life > 0) {
        aliveCount++;
        const alpha = Math.min(1, p.life * 2);

        if (p.type === 'chain') {
          drawChainLink(ctx, p.x, p.y, p.size, p.rotation, p.color, alpha);
        } else if (p.type === 'spark') {
          // Golden spark with trail
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * alpha);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        } else if (p.type === 'glow') {
          // Ethereal glow orb
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * alpha);
          gradient.addColorStop(0, `${p.color.replace(')', ` / ${alpha})`).replace('hsl', 'hsla')}`);
          gradient.addColorStop(0.5, `${p.color.replace(')', ` / ${alpha * 0.3})`).replace('hsl', 'hsla')}`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }
    });

    if (aliveCount > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete
      setTimeout(onComplete, 500);
    }
  }, [onComplete]);

  // Start animation when visible
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize and start
    initParticles(canvas);
    playChainBreakSound();
    
    // Show text after initial burst
    setTimeout(() => setShowText(true), 300);
    
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setShowText(false);
    };
  }, [isVisible, initParticles, playChainBreakSound, animate]);

  // Cleanup audio context
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(circle, transparent 20%, hsl(0 0% 0% / 0.7) 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Particle canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
          />

          {/* Level unlocked text */}
          <AnimatePresence>
            {showText && (
              <motion.div
                className="relative z-10 text-center"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              >
                {/* Broken chains icon */}
                <motion.div
                  className="text-6xl mb-4"
                  initial={{ rotateZ: -10 }}
                  animate={{ rotateZ: [10, -10, 5, -5, 0] }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  ⛓️‍💥
                </motion.div>

                {/* Main text */}
                <motion.h2
                  className="text-4xl md:text-5xl mb-2"
                  style={{
                    fontFamily: "'Staatliches', sans-serif",
                    color: 'hsl(45 90% 60%)',
                    textShadow: '0 0 30px hsl(45 90% 50% / 0.8), 0 0 60px hsl(45 90% 50% / 0.4)',
                    letterSpacing: '0.1em',
                  }}
                  initial={{ letterSpacing: '0.3em', opacity: 0 }}
                  animate={{ letterSpacing: '0.1em', opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  CHAINS BROKEN
                </motion.h2>

                {/* Level name */}
                <motion.p
                  className="text-xl md:text-2xl font-mono"
                  style={{
                    color: color,
                    textShadow: `0 0 20px ${color}`,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {levelName} UNLOCKED
                </motion.p>

                {/* Decorative line */}
                <motion.div
                  className="mt-4 h-0.5 mx-auto"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    width: 200,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChainBreakingCelebration;
