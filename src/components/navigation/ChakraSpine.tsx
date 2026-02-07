import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

interface ChakraNode {
  id: string;
  name: string;
  bodyPart: string;
  farmZone: string;
  color: string;
  glowColor: string;
  position: number; // 0-100 percentage
}

const CHAKRA_NODES: ChakraNode[] = [
  {
    id: 'crown',
    name: 'SAHASRARA',
    bodyPart: 'Crown',
    farmZone: 'The Stars',
    color: 'hsl(280 70% 60%)',
    glowColor: 'hsl(280 70% 50% / 0.6)',
    position: 0,
  },
  {
    id: 'third-eye',
    name: 'AJNA',
    bodyPart: 'Third Eye',
    farmZone: 'The Vision',
    color: 'hsl(240 70% 55%)',
    glowColor: 'hsl(240 70% 45% / 0.6)',
    position: 14,
  },
  {
    id: 'throat',
    name: 'VISHUDDHA',
    bodyPart: 'Throat',
    farmZone: 'The Voice',
    color: 'hsl(195 80% 55%)',
    glowColor: 'hsl(195 80% 45% / 0.6)',
    position: 28,
  },
  {
    id: 'heart',
    name: 'ANAHATA',
    bodyPart: 'Heart',
    farmZone: 'The Leaves',
    color: 'hsl(140 60% 45%)',
    glowColor: 'hsl(140 60% 35% / 0.6)',
    position: 42,
  },
  {
    id: 'solar',
    name: 'MANIPURA',
    bodyPart: 'Solar Plexus',
    farmZone: 'The Stalk',
    color: 'hsl(45 90% 50%)',
    glowColor: 'hsl(45 90% 40% / 0.6)',
    position: 56,
  },
  {
    id: 'sacral',
    name: 'SVADHISTHANA',
    bodyPart: 'Sacral',
    farmZone: 'The Water',
    color: 'hsl(25 85% 55%)',
    glowColor: 'hsl(25 85% 45% / 0.6)',
    position: 70,
  },
  {
    id: 'root',
    name: 'MULADHARA',
    bodyPart: 'Root',
    farmZone: 'The Soil',
    color: 'hsl(0 70% 50%)',
    glowColor: 'hsl(0 70% 40% / 0.6)',
    position: 85,
  },
];

const ChakraSpine = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeChakra, setActiveChakra] = useState<ChakraNode>(CHAKRA_NODES[0]);
  const [hoveredChakra, setHoveredChakra] = useState<ChakraNode | null>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setScrollPercent(value * 100);

      // Find active chakra based on scroll
      const scrollPos = value * 100;
      let closest = CHAKRA_NODES[0];
      let minDist = Infinity;

      CHAKRA_NODES.forEach((node) => {
        const dist = Math.abs(node.position - scrollPos);
        if (dist < minDist) {
          minDist = dist;
          closest = node;
        }
      });

      setActiveChakra(closest);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  const handleChakraClick = (chakra: ChakraNode) => {
    const targetScroll = (chakra.position / 100) * (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <motion.div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
    >
      {/* Spine container */}
      <div className="relative" style={{ height: '55vh' }}>
        {/* The spine line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full rounded-full"
          style={{
            background: `linear-gradient(180deg, 
              hsl(280 70% 60% / 0.3) 0%, 
              hsl(240 70% 55% / 0.3) 15%, 
              hsl(195 80% 55% / 0.3) 30%, 
              hsl(140 60% 45% / 0.3) 45%, 
              hsl(45 90% 50% / 0.3) 60%, 
              hsl(25 85% 55% / 0.3) 75%, 
              hsl(0 70% 50% / 0.3) 100%
            )`,
          }}
        />

        {/* Energy flow indicator */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-1 rounded-full"
          style={{
            top: 0,
            height: `${scrollPercent}%`,
            background: `linear-gradient(180deg, 
              ${activeChakra.color} 0%, 
              ${activeChakra.color} 100%
            )`,
            boxShadow: `0 0 10px ${activeChakra.glowColor}`,
          }}
        />

        {/* Chakra nodes */}
        {CHAKRA_NODES.map((chakra) => {
          const isActive = activeChakra.id === chakra.id;
          const isHovered = hoveredChakra?.id === chakra.id;

          return (
            <motion.div
              key={chakra.id}
              className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
              style={{ top: `${chakra.position}%` }}
              onMouseEnter={() => setHoveredChakra(chakra)}
              onMouseLeave={() => setHoveredChakra(null)}
              onClick={() => handleChakraClick(chakra)}
            >
              {/* Node glow */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 24,
                  height: 24,
                  left: -12,
                  top: -12,
                  background: `radial-gradient(circle, ${chakra.glowColor} 0%, transparent 70%)`,
                }}
                animate={{
                  scale: isActive ? [1, 1.5, 1] : 1,
                  opacity: isActive ? [0.5, 0.8, 0.5] : 0.3,
                }}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              />

              {/* Node core */}
              <motion.div
                className="relative rounded-full"
                style={{
                  width: isActive ? 10 : 6,
                  height: isActive ? 10 : 6,
                  marginLeft: isActive ? -5 : -3,
                  marginTop: isActive ? -5 : -3,
                  background: chakra.color,
                  boxShadow: isActive ? `0 0 15px ${chakra.glowColor}` : 'none',
                }}
                animate={{
                  scale: isActive ? [1, 1.2, 1] : isHovered ? 1.3 : 1,
                }}
                transition={{
                  duration: isActive ? 1.5 : 0.2,
                  repeat: isActive ? Infinity : 0,
                }}
              />

              {/* Tooltip */}
              <motion.div
                className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-2 rounded-lg pointer-events-none"
                initial={{ opacity: 0, x: -5 }}
                animate={{
                  opacity: isHovered || isActive ? 1 : 0,
                  x: isHovered || isActive ? 0 : -5,
                }}
                style={{
                  background: 'hsl(240 50% 8% / 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${chakra.color}`,
                  boxShadow: `0 0 15px ${chakra.glowColor}`,
                }}
              >
                <p
                  className="text-[9px] tracking-[0.15em] uppercase font-mono"
                  style={{ color: chakra.color }}
                >
                  {chakra.name}
                </p>
                <p
                  className="text-[8px] tracking-[0.1em] uppercase mt-0.5"
                  style={{ color: 'hsl(40 50% 70%)' }}
                >
                  {chakra.bodyPart} ◇ {chakra.farmZone}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Current position label */}
      <motion.div
        className="mt-4 text-center"
        key={activeChakra.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p
          className="text-[10px] tracking-[0.2em] uppercase font-mono"
          style={{
            color: activeChakra.color,
            textShadow: `0 0 10px ${activeChakra.glowColor}`,
          }}
        >
          {activeChakra.farmZone}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ChakraSpine;
