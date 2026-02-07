import { motion, useTransform, MotionValue } from 'framer-motion';

// Aboriginal Dot Painting Pattern
const DotField = () => {
  // Generate dot positions for songlines pattern
  const dots = [];
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 3 + 1;
    const colorIndex = Math.floor(Math.random() * 4);
    const colors = [
      'hsl(40 85% 55%)', // Gold/Ochre
      'hsl(280 60% 50%)', // Violet
      'hsl(350 75% 50%)', // Ruby
      'hsl(40 70% 70%)', // Light ochre
    ];
    const delay = Math.random() * 5;
    
    dots.push({ x, y, size, color: colors[colorIndex], delay });
  }
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            boxShadow: `0 0 ${dot.size * 2}px ${dot.color}`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: dot.delay,
          }}
        />
      ))}
    </div>
  );
};

// Flower of Life Sacred Geometry Grid
const FlowerOfLifeGrid = () => (
  <svg 
    className="absolute inset-0 w-full h-full opacity-20"
    viewBox="0 0 400 300"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <radialGradient id="crystalGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="hsl(280 60% 70%)" stopOpacity="0.6" />
        <stop offset="100%" stopColor="hsl(220 60% 50%)" stopOpacity="0" />
      </radialGradient>
      <filter id="crystalBlur">
        <feGaussianBlur stdDeviation="0.5" />
      </filter>
    </defs>
    
    {/* Flower of Life pattern - interlocking circles */}
    <g stroke="url(#crystalGlow)" strokeWidth="0.5" fill="none" filter="url(#crystalBlur)">
      {/* Central hexagon of circles */}
      <circle cx="200" cy="150" r="30" />
      <circle cx="170" cy="133" r="30" />
      <circle cx="230" cy="133" r="30" />
      <circle cx="170" cy="167" r="30" />
      <circle cx="230" cy="167" r="30" />
      <circle cx="200" cy="116" r="30" />
      <circle cx="200" cy="184" r="30" />
      
      {/* Outer ring */}
      <circle cx="140" cy="150" r="30" />
      <circle cx="260" cy="150" r="30" />
      <circle cx="155" cy="107" r="30" />
      <circle cx="245" cy="107" r="30" />
      <circle cx="155" cy="193" r="30" />
      <circle cx="245" cy="193" r="30" />
      
      {/* Extended pattern */}
      <circle cx="110" cy="133" r="30" opacity="0.5" />
      <circle cx="290" cy="133" r="30" opacity="0.5" />
      <circle cx="110" cy="167" r="30" opacity="0.5" />
      <circle cx="290" cy="167" r="30" opacity="0.5" />
      
      {/* Connecting lines - songlines */}
      <path d="M80 100 Q140 80, 200 90 Q260 100, 320 80" strokeWidth="1" opacity="0.4" />
      <path d="M60 150 Q120 130, 200 140 Q280 150, 340 130" strokeWidth="1" opacity="0.3" />
      <path d="M80 200 Q140 180, 200 190 Q260 200, 320 180" strokeWidth="1" opacity="0.4" />
    </g>
  </svg>
);

// Stardust particles
const StardustParticles = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: 4 + Math.random() * 4,
    delay: Math.random() * 3,
  }));

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, hsl(40 80% 90%) 0%, transparent 70%)',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </motion.div>
  );
};

interface CosmicVisionLayerProps {
  scrollYProgress: MotionValue<number>;
}

const CosmicVisionLayer = ({ scrollYProgress }: CosmicVisionLayerProps) => {
  // This layer is most visible at the top (hero section)
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      style={{ opacity, y }}
    >
      {/* Ether/Stardust base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, hsl(280 50% 20% / 0.8) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 30%, hsl(250 60% 25% / 0.6) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 20%, hsl(350 50% 20% / 0.5) 0%, transparent 40%)
          `,
        }}
      />
      
      {/* Aboriginal Dot Painting field */}
      <DotField />
      
      {/* Hermetic Flower of Life overlay */}
      <FlowerOfLifeGrid />
      
      {/* Stardust particles */}
      <StardustParticles scrollYProgress={scrollYProgress} />
      
      {/* Milky Way band */}
      <div 
        className="absolute top-[10%] left-0 right-0 h-[30%] opacity-30"
        style={{
          background: `
            linear-gradient(90deg, 
              transparent 0%, 
              hsl(280 40% 40% / 0.3) 20%,
              hsl(40 60% 50% / 0.2) 50%,
              hsl(280 40% 40% / 0.3) 80%,
              transparent 100%
            )
          `,
          transform: 'rotate(-5deg) scaleX(1.5)',
          filter: 'blur(20px)',
        }}
      />
    </motion.div>
  );
};

export default CosmicVisionLayer;
