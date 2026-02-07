import { motion, useTransform, MotionValue } from 'framer-motion';

// Mangrove/Forest Root System
const RootSystem = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const rootScale = useTransform(scrollYProgress, [0.5, 1], [0.8, 1.2]);
  
  return (
    <motion.svg
      viewBox="0 0 400 200"
      className="absolute bottom-0 left-0 w-full h-[40vh]"
      style={{ scale: rootScale }}
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        {/* Red Georgia Clay gradient */}
        <linearGradient id="clayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(15 50% 25%)" />
          <stop offset="50%" stopColor="hsl(10 55% 20%)" />
          <stop offset="100%" stopColor="hsl(8 45% 15%)" />
        </linearGradient>
        
        {/* Root bark texture */}
        <linearGradient id="rootBark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(20 40% 18%)" />
          <stop offset="50%" stopColor="hsl(25 35% 22%)" />
          <stop offset="100%" stopColor="hsl(20 40% 16%)" />
        </linearGradient>
        
        {/* Bioluminescent water - Nommo current */}
        <linearGradient id="nommoWater" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(200 80% 50% / 0)" />
          <stop offset="30%" stopColor="hsl(200 90% 60% / 0.6)" />
          <stop offset="50%" stopColor="hsl(180 85% 55% / 0.8)" />
          <stop offset="70%" stopColor="hsl(200 90% 60% / 0.6)" />
          <stop offset="100%" stopColor="hsl(200 80% 50% / 0)" />
        </linearGradient>
        
        <filter id="rootGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Clay earth base */}
      <rect x="0" y="150" width="400" height="50" fill="url(#clayGradient)" />
      
      {/* Main root network */}
      <g fill="url(#rootBark)" stroke="hsl(20 30% 12%)" strokeWidth="1">
        {/* Central thick root */}
        <path d="M200 200 Q180 180, 190 150 Q200 120, 180 100 Q160 80, 170 50" strokeWidth="8" fill="none" stroke="url(#rootBark)" />
        <path d="M200 200 Q220 175, 210 140 Q200 110, 220 90 Q240 70, 230 40" strokeWidth="7" fill="none" stroke="url(#rootBark)" />
        
        {/* Left root cluster - coiling into spiral mound (Muscogee) */}
        <path d="M50 200 Q40 170, 60 150 Q80 130, 70 100 Q60 70, 80 50" strokeWidth="6" fill="none" stroke="url(#rootBark)" />
        <path d="M80 200 Q70 180, 90 160 Q100 140, 85 120" strokeWidth="5" fill="none" stroke="url(#rootBark)" />
        {/* Spiral mound formation */}
        <path d="M60 90 Q50 80, 55 70 Q65 60, 60 50 Q55 40, 65 35 Q75 30, 70 25" strokeWidth="3" fill="none" stroke="hsl(25 40% 25%)" />
        
        {/* Right root cluster */}
        <path d="M350 200 Q360 175, 340 150 Q320 130, 340 100 Q360 70, 340 45" strokeWidth="6" fill="none" stroke="url(#rootBark)" />
        <path d="M320 200 Q330 180, 310 160 Q300 140, 320 115" strokeWidth="5" fill="none" stroke="url(#rootBark)" />
        {/* Another spiral mound */}
        <path d="M345 85 Q355 75, 350 65 Q340 55, 350 45 Q360 35, 350 28" strokeWidth="3" fill="none" stroke="hsl(25 40% 25%)" />
        
        {/* Interweaving smaller roots */}
        <path d="M120 200 Q140 165, 130 130 Q120 100, 140 75" strokeWidth="4" fill="none" stroke="url(#rootBark)" />
        <path d="M280 200 Q260 170, 270 135 Q280 105, 260 80" strokeWidth="4" fill="none" stroke="url(#rootBark)" />
        
        {/* Thin tendrils */}
        <path d="M150 200 Q160 175, 145 155" strokeWidth="2" fill="none" stroke="hsl(20 35% 20%)" />
        <path d="M250 200 Q240 180, 255 160" strokeWidth="2" fill="none" stroke="hsl(20 35% 20%)" />
      </g>
      
      {/* Conch Shell hidden in negative space (Maroon signal of freedom) */}
      <g transform="translate(100, 130) scale(0.4)" opacity="0.6">
        <path 
          d="M0 20 Q10 10, 25 15 Q40 20, 45 35 Q50 50, 40 55 Q30 60, 15 55 Q5 50, 0 35 Z"
          fill="hsl(40 30% 80%)"
          stroke="hsl(20 30% 40%)"
          strokeWidth="1"
        />
        <path d="M15 25 Q20 30, 18 40 Q16 48, 22 50" fill="none" stroke="hsl(350 40% 60%)" strokeWidth="2" />
        <ellipse cx="25" cy="35" rx="5" ry="8" fill="hsl(350 50% 40%)" opacity="0.5" />
      </g>
      
      {/* Machete shape hidden in roots (Maroon tool of liberation) */}
      <g transform="translate(290, 110) rotate(-25) scale(0.35)" opacity="0.4">
        <path 
          d="M0 0 L60 0 Q65 5, 65 15 L60 20 L5 20 Q0 15, 0 5 Z"
          fill="hsl(0 0% 70%)"
          stroke="hsl(20 30% 25%)"
          strokeWidth="1"
        />
        <rect x="60" y="5" width="20" height="10" fill="hsl(20 40% 25%)" rx="2" />
      </g>
      
      {/* Bioluminescent Nommo water current */}
      <motion.path
        d="M0 180 Q100 160, 200 175 Q300 190, 400 170"
        fill="none"
        stroke="url(#nommoWater)"
        strokeWidth="4"
        filter="url(#rootGlow)"
        animate={{
          d: [
            "M0 180 Q100 160, 200 175 Q300 190, 400 170",
            "M0 175 Q100 185, 200 170 Q300 160, 400 180",
            "M0 180 Q100 160, 200 175 Q300 190, 400 170",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Secondary water tendrils */}
      <motion.path
        d="M50 150 Q100 140, 150 155"
        fill="none"
        stroke="hsl(200 85% 55% / 0.4)"
        strokeWidth="2"
        filter="url(#rootGlow)"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.path
        d="M250 145 Q300 155, 350 140"
        fill="none"
        stroke="hsl(200 85% 55% / 0.4)"
        strokeWidth="2"
        filter="url(#rootGlow)"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
    </motion.svg>
  );
};

// Water bubbles - bioluminescent
const WaterBubbles = () => {
  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    x: 10 + Math.random() * 80,
    y: 70 + Math.random() * 25,
    size: 2 + Math.random() * 4,
    duration: 3 + Math.random() * 3,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            bottom: `${b.y}%`,
            width: b.size,
            height: b.size,
            background: 'radial-gradient(circle, hsl(200 90% 70%) 0%, hsl(180 80% 50% / 0.5) 100%)',
            boxShadow: `0 0 ${b.size * 2}px hsl(200 90% 60% / 0.6)`,
          }}
          animate={{
            y: [0, -30, -60],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.8],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
          }}
        />
      ))}
    </div>
  );
};

interface RootsResistanceLayerProps {
  scrollYProgress: MotionValue<number>;
}

const RootsResistanceLayer = ({ scrollYProgress }: RootsResistanceLayerProps) => {
  // This layer is most visible at the bottom (footer)
  const opacity = useTransform(scrollYProgress, [0.5, 0.7, 1], [0.2, 0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [-150, 0]);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      style={{ opacity, y }}
    >
      {/* Red clay earth gradient at bottom */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              transparent 0%,
              transparent 50%,
              hsl(15 45% 15% / 0.4) 70%,
              hsl(10 50% 12% / 0.7) 85%,
              hsl(8 45% 10% / 0.9) 100%
            )
          `,
        }}
      />
      
      {/* Root system SVG */}
      <RootSystem scrollYProgress={scrollYProgress} />
      
      {/* Bioluminescent water bubbles */}
      <WaterBubbles />
      
      {/* Emerald gem accents in the roots */}
      <motion.div
        className="absolute bottom-[25%] left-[20%] w-4 h-4"
        animate={{ 
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div 
          className="w-full h-full rounded-sm rotate-45"
          style={{
            background: 'radial-gradient(circle at 30% 30%, hsl(140 70% 50%), hsl(140 60% 30%))',
            boxShadow: '0 0 12px hsl(140 60% 40% / 0.6)',
          }}
        />
      </motion.div>
      
      <motion.div
        className="absolute bottom-[30%] right-[25%] w-3 h-3"
        animate={{ 
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
      >
        <div 
          className="w-full h-full rounded-sm rotate-45"
          style={{
            background: 'radial-gradient(circle at 30% 30%, hsl(350 70% 55%), hsl(350 60% 35%))',
            boxShadow: '0 0 10px hsl(350 60% 45% / 0.5)',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default RootsResistanceLayer;
