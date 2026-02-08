import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OgunIcon, BabaluAyeIcon, ShangoIcon, OshunIcon } from './OrishaIcons';

interface BlessingCeremonyProps {
  isActive: boolean;
  orisha: 'ogun' | 'babalu-aye' | 'shango' | 'oshun';
  moduleName: string;
  onComplete: () => void;
}

const orishaConfig = {
  'ogun': {
    name: 'OGUN',
    title: 'Lord of Iron & Labor',
    blessing: 'THE FORGE ACCEPTS YOUR LABOR',
    color: 'hsl(350 75% 50%)',
    glowColor: '#CD5C5C',
    bgGradient: 'radial-gradient(circle at 50% 50%, hsl(350 50% 15%), hsl(350 40% 5%))',
    Icon: OgunIcon,
    particleColors: ['#CD5C5C', '#8B0000', '#FF4444', '#4A4A4A', '#6B6B6B'],
  },
  'babalu-aye': {
    name: 'BABALU AYE',
    title: 'Lord of Earth & Healing',
    blessing: 'THE EARTH EMBRACES YOUR DEVOTION',
    color: 'hsl(30 50% 50%)',
    glowColor: '#8B7355',
    bgGradient: 'radial-gradient(circle at 50% 50%, hsl(30 40% 15%), hsl(30 30% 5%))',
    Icon: BabaluAyeIcon,
    particleColors: ['#8B7355', '#4A3728', '#8BC34A', '#4CAF50', '#5D4037'],
  },
  'shango': {
    name: 'SHANGO',
    title: 'Lord of Lightning & Fire',
    blessing: 'THE THUNDER CROWNS YOUR SPIRIT',
    color: 'hsl(25 90% 55%)',
    glowColor: '#FF4500',
    bgGradient: 'radial-gradient(circle at 50% 50%, hsl(25 60% 15%), hsl(15 40% 5%))',
    Icon: ShangoIcon,
    particleColors: ['#FF4500', '#FFD700', '#00FFFF', '#B87333', '#DA8B47'],
  },
  'oshun': {
    name: 'OSHUN',
    title: 'Lady of Sweet Waters',
    blessing: 'THE GOLDEN WATERS FLOW THROUGH YOU',
    color: 'hsl(45 90% 55%)',
    glowColor: '#FFD700',
    bgGradient: 'radial-gradient(circle at 50% 50%, hsl(45 50% 15%), hsl(35 40% 5%))',
    Icon: OshunIcon,
    particleColors: ['#FFD700', '#FFF8DC', '#DAA520', '#B8860B', '#FFFACD'],
  },
};

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  type: 'spark' | 'orb' | 'ring' | 'drop';
  life: number;
  maxLife: number;
}

/**
 * BLESSING CEREMONY
 * 
 * A sacred animation that plays when a module is completed,
 * featuring Orisha-specific particle effects and synthesized ceremonial sounds.
 */
const BlessingCeremony = ({ isActive, orisha, moduleName, onComplete }: BlessingCeremonyProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const config = orishaConfig[orisha];
  const Icon = config.Icon;

  // Synthesize Orisha-specific blessing sounds
  const playBlessingSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.3, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 4);

    if (orisha === 'ogun') {
      // Iron forge sounds - metallic strikes with reverb
      const playStrike = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + 0.3);
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.5);
      };
      playStrike(now, 220);
      playStrike(now + 0.3, 330);
      playStrike(now + 0.6, 440);
      // Deep drum
      const drum = ctx.createOscillator();
      const drumGain = ctx.createGain();
      drum.type = 'sine';
      drum.frequency.setValueAtTime(60, now + 1);
      drum.frequency.exponentialRampToValueAtTime(30, now + 2);
      drumGain.gain.setValueAtTime(0.5, now + 1);
      drumGain.gain.exponentialRampToValueAtTime(0.001, now + 2);
      drum.connect(drumGain);
      drumGain.connect(masterGain);
      drum.start(now + 1);
      drum.stop(now + 2);

    } else if (orisha === 'babalu-aye') {
      // Earth healing sounds - low rumble with rising chimes
      const rumble = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      rumble.type = 'sine';
      rumble.frequency.setValueAtTime(40, now);
      rumbleGain.gain.setValueAtTime(0.3, now);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2);
      rumble.connect(rumbleGain);
      rumbleGain.connect(masterGain);
      rumble.start(now);
      rumble.stop(now + 2);
      // Healing chimes ascending
      [523, 659, 784, 1047].forEach((freq, i) => {
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, now + 0.3 + i * 0.2);
        chimeGain.gain.setValueAtTime(0.2, now + 0.3 + i * 0.2);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5 + i * 0.2);
        chime.connect(chimeGain);
        chimeGain.connect(masterGain);
        chime.start(now + 0.3 + i * 0.2);
        chime.stop(now + 1.5 + i * 0.2);
      });

    } else if (orisha === 'shango') {
      // Thunder crack and fire crackle
      const noise = ctx.createBufferSource();
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = Math.random() * 2 - 1;
      }
      noise.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1000, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 0.5);
      noiseGain.gain.setValueAtTime(0.8, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(now);
      // Fire crackle
      for (let i = 0; i < 8; i++) {
        const crackle = ctx.createOscillator();
        const crackleGain = ctx.createGain();
        crackle.type = 'sawtooth';
        crackle.frequency.setValueAtTime(800 + Math.random() * 400, now + 0.6 + i * 0.1);
        crackleGain.gain.setValueAtTime(0.15, now + 0.6 + i * 0.1);
        crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7 + i * 0.1);
        crackle.connect(crackleGain);
        crackleGain.connect(masterGain);
        crackle.start(now + 0.6 + i * 0.1);
        crackle.stop(now + 0.8 + i * 0.1);
      }
      // Rising power chord
      [220, 277, 330].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + 1);
        gain.gain.setValueAtTime(0.1, now + 1);
        gain.gain.linearRampToValueAtTime(0.25, now + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + 1);
        osc.stop(now + 2.5);
      });

    } else if (orisha === 'oshun') {
      // Golden bells and water drops
      [880, 1109, 1319, 1760].forEach((freq, i) => {
        const bell = ctx.createOscillator();
        const bellGain = ctx.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(freq, now + i * 0.15);
        bellGain.gain.setValueAtTime(0.25, now + i * 0.15);
        bellGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5 + i * 0.15);
        bell.connect(bellGain);
        bellGain.connect(masterGain);
        bell.start(now + i * 0.15);
        bell.stop(now + 1.5 + i * 0.15);
      });
      // Water/honey drops
      for (let i = 0; i < 6; i++) {
        const drop = ctx.createOscillator();
        const dropGain = ctx.createGain();
        drop.type = 'sine';
        const dropFreq = 600 + Math.random() * 200;
        drop.frequency.setValueAtTime(dropFreq, now + 0.8 + i * 0.2);
        drop.frequency.exponentialRampToValueAtTime(dropFreq * 0.7, now + 1 + i * 0.2);
        dropGain.gain.setValueAtTime(0.15, now + 0.8 + i * 0.2);
        dropGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2 + i * 0.2);
        drop.connect(dropGain);
        dropGain.connect(masterGain);
        drop.start(now + 0.8 + i * 0.2);
        drop.stop(now + 1.3 + i * 0.2);
      }
      // Golden shimmer
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(2093, now + 1.5);
      shimmerGain.gain.setValueAtTime(0, now + 1.5);
      shimmerGain.gain.linearRampToValueAtTime(0.15, now + 2);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 3);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(masterGain);
      shimmer.start(now + 1.5);
      shimmer.stop(now + 3);
    }
  }, [orisha]);

  // Create Orisha-specific particles
  const createParticle = useCallback((centerX: number, centerY: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;
    const types: Particle['type'][] = ['spark', 'orb', 'ring', 'drop'];
    
    // Orisha-specific particle behavior
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;
    
    if (orisha === 'oshun') {
      // Honey drops fall slowly
      vy = Math.abs(vy) * 0.5 + 0.5;
      vx *= 0.5;
    } else if (orisha === 'shango') {
      // Lightning shoots upward
      vy = -Math.abs(vy) * 1.5;
    } else if (orisha === 'babalu-aye') {
      // Healing particles rise gently
      vy = -Math.abs(vy) * 0.7;
    }

    return {
      id: Math.random(),
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 100,
      vx,
      vy,
      size: 3 + Math.random() * 8,
      color: config.particleColors[Math.floor(Math.random() * config.particleColors.length)],
      alpha: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      type: types[Math.floor(Math.random() * types.length)],
      life: 0,
      maxLife: 80 + Math.random() * 60,
    };
  }, [orisha, config.particleColors]);

  // Canvas particle animation
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Play blessing sound
    playBlessingSound();

    // Initial burst of particles
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push(createParticle(centerX, centerY));
    }

    let frameCount = 0;
    const maxFrames = 240; // 4 seconds at 60fps

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Add more particles over time
      if (frameCount < 120 && frameCount % 3 === 0) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(createParticle(centerX, centerY));
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        
        // Orisha-specific physics
        if (orisha === 'shango') {
          p.vx *= 0.99;
          p.vy += 0.05; // Gravity after initial burst
        } else if (orisha === 'oshun') {
          p.vx *= 0.98;
          p.vy = Math.min(p.vy + 0.02, 2); // Slow fall
        } else if (orisha === 'babalu-aye') {
          p.vx *= 0.97;
          p.vy *= 0.97;
        } else {
          p.vx *= 0.98;
          p.vy *= 0.98;
        }

        const lifeRatio = p.life / p.maxLife;
        p.alpha = 1 - lifeRatio;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;

        if (p.type === 'spark') {
          // Elongated spark
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.ellipse(0, 0, p.size * 0.3, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
          // Glow
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
          ctx.fill();
        } else if (p.type === 'orb') {
          // Glowing orb
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(0.5, p.color + '80');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'ring') {
          // Expanding ring
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, p.size + p.life * 0.3, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.type === 'drop') {
          // Teardrop shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size * 0.8, 0, 0, p.size);
          ctx.quadraticCurveTo(-p.size * 0.8, 0, 0, -p.size);
          ctx.fill();
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
        }

        ctx.restore();

        return p.life < p.maxLife;
      });

      if (frameCount < maxFrames) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        particlesRef.current = [];
        onComplete();
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      particlesRef.current = [];
    };
  }, [isActive, orisha, createParticle, playBlessingSound, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0"
            style={{ background: config.bgGradient }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
          />

          {/* Particle canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Central blessing content */}
          <motion.div
            className="relative z-10 text-center px-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
          >
            {/* Orisha Icon */}
            <motion.div
              className="mx-auto mb-6 w-32 h-32"
              animate={{
                scale: [1, 1.1, 1],
                filter: [
                  `drop-shadow(0 0 20px ${config.glowColor})`,
                  `drop-shadow(0 0 60px ${config.glowColor})`,
                  `drop-shadow(0 0 20px ${config.glowColor})`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className="w-full h-full" animated />
            </motion.div>

            {/* Orisha Name */}
            <motion.h2
              className="text-4xl md:text-5xl mb-2"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: config.color,
                letterSpacing: '0.2em',
                textShadow: `0 0 30px ${config.glowColor}`,
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {config.name}
            </motion.h2>

            {/* Title */}
            <motion.p
              className="text-lg mb-6"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: 'hsl(0 0% 70%)',
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {config.title}
            </motion.p>

            {/* Blessing Text */}
            <motion.div
              className="py-4 px-8 rounded-2xl"
              style={{
                background: `${config.color}15`,
                border: `2px solid ${config.color}40`,
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p
                className="text-xl md:text-2xl"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: config.color,
                  letterSpacing: '0.1em',
                }}
              >
                ✦ {config.blessing} ✦
              </p>
            </motion.div>

            {/* Module Completed */}
            <motion.p
              className="mt-6 text-sm"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: 'hsl(0 0% 50%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {moduleName} Complete
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlessingCeremony;
