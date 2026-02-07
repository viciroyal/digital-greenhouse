import { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

// Artifact SVG components
const ConchShellArtifact = () => (
  <svg viewBox="0 0 120 80" className="w-full h-full">
    <defs>
      <linearGradient id="conchGhost" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(15 70% 50%)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="hsl(15 70% 30%)" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* Conch shell spiral */}
    <path
      d="M60 10 Q90 15, 95 40 Q100 65, 70 70 Q40 75, 30 55 Q20 35, 40 25 Q55 18, 60 30 Q65 42, 50 45 Q38 48, 42 38"
      stroke="url(#conchGhost)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Opening ridges */}
    <path d="M30 55 L15 60" stroke="hsl(15 70% 45% / 0.2)" strokeWidth="1.5" />
    <path d="M35 62 L22 70" stroke="hsl(15 70% 45% / 0.2)" strokeWidth="1.5" />
    <path d="M45 67 L35 78" stroke="hsl(15 70% 45% / 0.2)" strokeWidth="1.5" />
  </svg>
);

const IronShackleArtifact = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="ironGhost" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(0 0% 40%)" stopOpacity="0.25" />
        <stop offset="100%" stopColor="hsl(15 30% 25%)" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* Broken chain link */}
    <ellipse cx="35" cy="50" rx="20" ry="30" stroke="url(#ironGhost)" strokeWidth="6" fill="none" />
    <ellipse cx="65" cy="50" rx="20" ry="30" stroke="url(#ironGhost)" strokeWidth="6" fill="none" />
    {/* Break marks */}
    <path d="M55 25 L58 20 L52 18" stroke="hsl(15 50% 40% / 0.3)" strokeWidth="2" fill="none" />
    <path d="M55 75 L58 80 L52 82" stroke="hsl(15 50% 40% / 0.3)" strokeWidth="2" fill="none" />
  </svg>
);

const SpiralMoundArtifact = () => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <defs>
      <linearGradient id="moundGhost" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(25 50% 40%)" stopOpacity="0.25" />
        <stop offset="100%" stopColor="hsl(25 40% 25%)" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* Spiral mound pattern - Ocmulgee inspired */}
    <path
      d="M60 60 
         m0 -5 a5 5 0 1 1 0 10 a5 5 0 1 1 0 -10
         m0 -10 a15 15 0 1 1 0 30 a15 15 0 1 1 0 -30
         m0 -10 a25 25 0 1 1 0 50 a25 25 0 1 1 0 -50
         m0 -10 a35 35 0 1 1 0 70 a35 35 0 1 1 0 -70"
      stroke="url(#moundGhost)"
      strokeWidth="2"
      fill="none"
    />
    {/* Center dot */}
    <circle cx="60" cy="60" r="3" fill="hsl(25 50% 35% / 0.3)" />
  </svg>
);

const FlintArrowheadArtifact = () => (
  <svg viewBox="0 0 60 100" className="w-full h-full">
    <defs>
      <linearGradient id="flintGhost" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(25 40% 35%)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="hsl(25 30% 20%)" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* Arrowhead shape */}
    <path
      d="M30 5 L50 70 L30 60 L10 70 Z"
      stroke="url(#flintGhost)"
      strokeWidth="2"
      fill="hsl(25 40% 30% / 0.05)"
    />
    {/* Knapping marks */}
    <path d="M20 30 L25 35" stroke="hsl(25 40% 40% / 0.2)" strokeWidth="1" />
    <path d="M35 25 L40 30" stroke="hsl(25 40% 40% / 0.2)" strokeWidth="1" />
    <path d="M25 45 L30 50" stroke="hsl(25 40% 40% / 0.2)" strokeWidth="1" />
    {/* Stem notches */}
    <path d="M22 62 L15 75 L30 90 L45 75 L38 62" stroke="url(#flintGhost)" strokeWidth="1.5" fill="none" />
  </svg>
);

const GhostArtifacts = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setScrollPercent(value);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Determine which artifacts to show based on scroll position
  const inResistanceZone = scrollPercent >= 0.25 && scrollPercent <= 0.75;
  const inStewardshipZone = scrollPercent >= 0.65;

  // Calculate opacity for smooth transitions
  const resistanceOpacity = inResistanceZone
    ? Math.min(1, (scrollPercent - 0.25) * 4, (0.75 - scrollPercent) * 4) * 0.4
    : 0;

  const stewardshipOpacity = inStewardshipZone
    ? Math.min(1, (scrollPercent - 0.65) * 3) * 0.35
    : 0;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Resistance Zone Artifacts (1800s) */}
      <motion.div
        className="absolute top-1/4 left-[10%] w-32 h-24"
        animate={{ opacity: resistanceOpacity }}
        transition={{ duration: 0.5 }}
        style={{
          filter: 'blur(1px)',
          transform: 'rotate(-15deg)',
        }}
      >
        <ConchShellArtifact />
      </motion.div>

      <motion.div
        className="absolute top-[40%] right-[15%] w-24 h-24"
        animate={{ opacity: resistanceOpacity * 0.8 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          filter: 'blur(1.5px)',
          transform: 'rotate(10deg)',
        }}
      >
        <IronShackleArtifact />
      </motion.div>

      <motion.div
        className="absolute top-[55%] left-[5%] w-28 h-20"
        animate={{ opacity: resistanceOpacity * 0.6 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          filter: 'blur(2px)',
          transform: 'rotate(25deg)',
        }}
      >
        <ConchShellArtifact />
      </motion.div>

      {/* Stewardship Zone Artifacts (1500s) */}
      <motion.div
        className="absolute bottom-[30%] left-[8%] w-36 h-36"
        animate={{ opacity: stewardshipOpacity }}
        transition={{ duration: 0.5 }}
        style={{
          filter: 'blur(1px)',
        }}
      >
        <SpiralMoundArtifact />
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] right-[12%] w-20 h-32"
        animate={{ opacity: stewardshipOpacity * 0.8 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          filter: 'blur(1.5px)',
          transform: 'rotate(-5deg)',
        }}
      >
        <FlintArrowheadArtifact />
      </motion.div>

      <motion.div
        className="absolute bottom-[10%] left-[25%] w-28 h-28"
        animate={{ opacity: stewardshipOpacity * 0.6 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          filter: 'blur(2px)',
        }}
      >
        <SpiralMoundArtifact />
      </motion.div>

      <motion.div
        className="absolute bottom-[15%] right-[30%] w-16 h-28"
        animate={{ opacity: stewardshipOpacity * 0.5 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          filter: 'blur(2px)',
          transform: 'rotate(15deg)',
        }}
      >
        <FlintArrowheadArtifact />
      </motion.div>
    </div>
  );
};

export default GhostArtifacts;
