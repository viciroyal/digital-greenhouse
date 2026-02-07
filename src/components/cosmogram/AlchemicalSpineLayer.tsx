import { motion, useTransform, MotionValue } from 'framer-motion';

// Djed-Togu Na Fusion Pillar
const SacredPillar = ({ x, scrollYProgress }: { x: number; scrollYProgress: MotionValue<number> }) => {
  const pillarY = useTransform(scrollYProgress, [0.2, 0.8], [-50, 50]);
  
  return (
    <motion.svg
      viewBox="0 0 60 300"
      className="absolute h-[40vh]"
      style={{ 
        left: `${x}%`, 
        top: '30%',
        y: pillarY,
      }}
    >
      <defs>
        <linearGradient id={`ebonyGold-${x}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(20 40% 15%)" />
          <stop offset="30%" stopColor="hsl(40 60% 30%)" />
          <stop offset="50%" stopColor="hsl(40 80% 50%)" />
          <stop offset="70%" stopColor="hsl(40 60% 30%)" />
          <stop offset="100%" stopColor="hsl(20 40% 15%)" />
        </linearGradient>
        <pattern id={`woodGrain-${x}`} patternUnits="userSpaceOnUse" width="10" height="10">
          <path d="M0 5 Q5 3, 10 5" stroke="hsl(20 30% 10%)" strokeWidth="0.5" fill="none" opacity="0.3" />
        </pattern>
      </defs>
      
      {/* Main pillar body - Djed/Togu Na fusion */}
      <g>
        {/* Base segment */}
        <rect x="15" y="250" width="30" height="40" fill={`url(#ebonyGold-${x})`} rx="3" />
        <rect x="15" y="250" width="30" height="40" fill={`url(#woodGrain-${x})`} />
        
        {/* Middle segments - Djed spine segments */}
        <rect x="12" y="200" width="36" height="45" fill={`url(#ebonyGold-${x})`} rx="2" />
        <rect x="10" y="150" width="40" height="45" fill={`url(#ebonyGold-${x})`} rx="2" />
        <rect x="8" y="100" width="44" height="45" fill={`url(#ebonyGold-${x})`} rx="2" />
        <rect x="10" y="50" width="40" height="45" fill={`url(#ebonyGold-${x})`} rx="2" />
        
        {/* Top crown - Togu Na shelter shape */}
        <path 
          d="M5 50 Q30 20, 55 50 L50 55 L10 55 Z" 
          fill="hsl(40 70% 40%)"
          stroke="hsl(40 80% 55%)"
          strokeWidth="1"
        />
        
        {/* Kanaga Mask glyph - geometric lizard/man */}
        <g transform="translate(20, 110) scale(0.8)">
          <line x1="10" y1="0" x2="10" y2="30" stroke="hsl(40 80% 60%)" strokeWidth="2" />
          <line x1="0" y1="5" x2="20" y2="5" stroke="hsl(40 80% 60%)" strokeWidth="2" />
          <line x1="0" y1="25" x2="20" y2="25" stroke="hsl(40 80% 60%)" strokeWidth="2" />
          <line x1="0" y1="5" x2="0" y2="0" stroke="hsl(40 80% 60%)" strokeWidth="2" />
          <line x1="20" y1="5" x2="20" y2="0" stroke="hsl(40 80% 60%)" strokeWidth="2" />
          <line x1="0" y1="25" x2="0" y2="30" stroke="hsl(40 80% 60%)" strokeWidth="2" />
          <line x1="20" y1="25" x2="20" y2="30" stroke="hsl(40 80% 60%)" strokeWidth="2" />
        </g>
        
        {/* Lotus flower glyph - Kemetic rebirth */}
        <g transform="translate(30, 175)">
          <ellipse cx="0" cy="0" rx="8" ry="4" fill="hsl(350 70% 50%)" opacity="0.8" />
          <ellipse cx="-6" cy="-3" rx="5" ry="3" fill="hsl(350 60% 55%)" opacity="0.6" transform="rotate(-30)" />
          <ellipse cx="6" cy="-3" rx="5" ry="3" fill="hsl(350 60% 55%)" opacity="0.6" transform="rotate(30)" />
          <ellipse cx="0" cy="-6" rx="4" ry="3" fill="hsl(350 65% 60%)" opacity="0.7" />
          <circle cx="0" cy="0" r="3" fill="hsl(40 80% 60%)" />
        </g>
        
        {/* Toltec Step Fret - staircase of consciousness */}
        <g transform="translate(15, 220)">
          <path 
            d="M0 20 L5 20 L5 15 L10 15 L10 10 L15 10 L15 5 L20 5 L20 0 L25 0 L25 5 L30 5 L30 10 L25 10 L25 15 L20 15 L20 20 L15 20 L15 25 L10 25 L10 20 L5 20"
            fill="none"
            stroke="hsl(140 50% 40%)"
            strokeWidth="1.5"
          />
        </g>
      </g>
    </motion.svg>
  );
};

// Gold leaf texture overlay
const GoldLeafTexture = () => (
  <div 
    className="absolute inset-0 opacity-10 mix-blend-overlay"
    style={{
      backgroundImage: `
        repeating-linear-gradient(
          45deg,
          hsl(40 80% 50% / 0.1) 0px,
          hsl(40 80% 50% / 0.1) 2px,
          transparent 2px,
          transparent 10px
        ),
        repeating-linear-gradient(
          -45deg,
          hsl(40 70% 40% / 0.1) 0px,
          hsl(40 70% 40% / 0.1) 2px,
          transparent 2px,
          transparent 10px
        )
      `,
    }}
  />
);

interface AlchemicalSpineLayerProps {
  scrollYProgress: MotionValue<number>;
}

const AlchemicalSpineLayer = ({ scrollYProgress }: AlchemicalSpineLayerProps) => {
  // This layer is most visible in the middle
  const opacity = useTransform(scrollYProgress, [0.2, 0.4, 0.7, 0.9], [0.2, 1, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity, y }}
    >
      {/* Ebony wood and gold gradient base */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, 
              transparent 0%,
              hsl(20 40% 12% / 0.6) 30%,
              hsl(20 35% 15% / 0.8) 50%,
              hsl(20 40% 12% / 0.6) 70%,
              transparent 100%
            )
          `,
        }}
      />
      
      {/* Gold leaf texture */}
      <GoldLeafTexture />
      
      {/* Sacred pillars - backbone of the website */}
      <SacredPillar x={8} scrollYProgress={scrollYProgress} />
      <SacredPillar x={88} scrollYProgress={scrollYProgress} />
      
      {/* Horizontal connecting bands */}
      <div 
        className="absolute left-0 right-0 h-[2px] top-[35%]"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, hsl(40 70% 45% / 0.4) 20%, hsl(40 70% 45% / 0.4) 80%, transparent 95%)',
        }}
      />
      <div 
        className="absolute left-0 right-0 h-[2px] top-[55%]"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, hsl(40 70% 45% / 0.3) 20%, hsl(40 70% 45% / 0.3) 80%, transparent 95%)',
        }}
      />
      
      {/* Carved glyph accents floating */}
      <motion.div
        className="absolute left-[15%] top-[40%] w-16 h-16 opacity-30"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <svg viewBox="0 0 50 50" className="w-full h-full">
          {/* Kemetic Ankh */}
          <ellipse cx="25" cy="12" rx="8" ry="10" fill="none" stroke="hsl(40 80% 55%)" strokeWidth="2" />
          <line x1="25" y1="22" x2="25" y2="45" stroke="hsl(40 80% 55%)" strokeWidth="2" />
          <line x1="15" y1="32" x2="35" y2="32" stroke="hsl(40 80% 55%)" strokeWidth="2" />
        </svg>
      </motion.div>
      
      <motion.div
        className="absolute right-[15%] top-[50%] w-12 h-12 opacity-25"
        animate={{ 
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      >
        <svg viewBox="0 0 40 40" className="w-full h-full">
          {/* Spiral - universal symbol */}
          <path 
            d="M20 20 Q25 15, 25 20 Q25 28, 18 28 Q8 28, 8 18 Q8 5, 22 5 Q38 5, 38 22"
            fill="none"
            stroke="hsl(140 60% 45%)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default AlchemicalSpineLayer;
