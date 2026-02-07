import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Era {
  id: string;
  year: string;
  label: string;
  depth: string;
  scrollRange: [number, number];
  color: string;
  glowColor: string;
}

const ERAS: Era[] = [
  {
    id: 'vision',
    year: '2026',
    label: 'THE VISION',
    depth: '0ft',
    scrollRange: [0, 0.3],
    color: 'hsl(45 90% 55%)',
    glowColor: 'hsl(45 90% 45% / 0.6)',
  },
  {
    id: 'resistance',
    year: '1800s',
    label: 'THE RESISTANCE',
    depth: '-3ft',
    scrollRange: [0.3, 0.7],
    color: 'hsl(15 70% 45%)',
    glowColor: 'hsl(15 70% 35% / 0.6)',
  },
  {
    id: 'stewardship',
    year: '1500s',
    label: 'THE STEWARDSHIP',
    depth: '-6ft',
    scrollRange: [0.7, 1],
    color: 'hsl(25 50% 30%)',
    glowColor: 'hsl(25 50% 25% / 0.6)',
  },
];

const SedimentRuler = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [currentEra, setCurrentEra] = useState<Era>(ERAS[0]);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setScrollPercent(value);
      
      // Determine current era
      const era = ERAS.find(
        (e) => value >= e.scrollRange[0] && value < e.scrollRange[1]
      ) || ERAS[ERAS.length - 1];
      setCurrentEra(era);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Interpolated position for the marker (0 to 100%)
  const markerPosition = scrollPercent * 100;

  // Calculate interpolated color
  const getInterpolatedColor = () => {
    if (scrollPercent <= 0.3) {
      return 'hsl(45 90% 55%)'; // Gold
    } else if (scrollPercent <= 0.7) {
      const t = (scrollPercent - 0.3) / 0.4;
      // Gold to Rust Red
      const h = 45 - t * 30;
      const s = 90 - t * 20;
      const l = 55 - t * 10;
      return `hsl(${h} ${s}% ${l}%)`;
    } else {
      const t = (scrollPercent - 0.7) / 0.3;
      // Rust Red to Clay Brown
      const h = 15 + t * 10;
      const s = 70 - t * 20;
      const l = 45 - t * 15;
      return `hsl(${h} ${s}% ${l}%)`;
    }
  };

  return (
    <motion.div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      {/* Main ruler container */}
      <div className="relative flex items-stretch" style={{ height: '60vh' }}>
        {/* Era labels on the left */}
        <div className="flex flex-col justify-between h-full mr-3 py-2">
          {ERAS.map((era) => (
            <motion.div
              key={era.id}
              className="text-right"
              animate={{
                opacity: currentEra.id === era.id ? 1 : 0.3,
                scale: currentEra.id === era.id ? 1 : 0.9,
              }}
              transition={{ duration: 0.3 }}
            >
              <p
                className="text-[10px] tracking-[0.15em] uppercase font-mono"
                style={{
                  color: era.color,
                  textShadow: currentEra.id === era.id ? `0 0 10px ${era.glowColor}` : 'none',
                }}
              >
                {era.depth}
              </p>
            </motion.div>
          ))}
        </div>

        {/* The ruler track */}
        <div
          className="relative w-1 rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, hsl(45 90% 55% / 0.2) 0%, hsl(15 70% 45% / 0.2) 50%, hsl(25 50% 30% / 0.2) 100%)',
            border: '1px solid hsl(40 40% 30% / 0.3)',
          }}
        >
          {/* Progress fill */}
          <motion.div
            className="absolute top-0 left-0 right-0 rounded-full"
            style={{
              height: `${markerPosition}%`,
              background: `linear-gradient(180deg, hsl(45 90% 55%) 0%, ${getInterpolatedColor()} 100%)`,
              boxShadow: `0 0 10px ${currentEra.glowColor}`,
            }}
          />

          {/* Era tick marks */}
          {[0, 30, 70, 100].map((tick, i) => (
            <div
              key={tick}
              className="absolute left-0 w-3 h-0.5"
              style={{
                top: `${tick}%`,
                transform: 'translateX(-50%)',
                background: i === 0 ? 'hsl(45 90% 55%)' : i === 1 || i === 2 ? 'hsl(15 70% 45%)' : 'hsl(25 50% 30%)',
              }}
            />
          ))}
        </div>

        {/* Current position marker */}
        <motion.div
          className="absolute left-0 right-0 flex items-center pointer-events-none"
          style={{
            top: `${markerPosition}%`,
          }}
        >
          {/* Marker line */}
          <div
            className="absolute right-0 w-6 h-0.5"
            style={{
              background: getInterpolatedColor(),
              boxShadow: `0 0 8px ${currentEra.glowColor}`,
            }}
          />
          
          {/* Current era info card */}
          <motion.div
            className="absolute right-8 whitespace-nowrap px-3 py-2 rounded-lg"
            style={{
              background: 'hsl(240 50% 8% / 0.9)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${currentEra.color}`,
              boxShadow: `0 0 20px ${currentEra.glowColor}`,
            }}
            key={currentEra.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p
              className="text-lg font-bold font-mono"
              style={{
                color: currentEra.color,
                textShadow: `0 0 10px ${currentEra.glowColor}`,
              }}
            >
              {currentEra.year}
            </p>
            <p
              className="text-[9px] tracking-[0.2em] uppercase"
              style={{ color: 'hsl(40 50% 70%)' }}
            >
              {currentEra.label}
            </p>
          </motion.div>
        </motion.div>

        {/* Depth labels on the right */}
        <div className="flex flex-col justify-between h-full ml-3 py-1">
          <span className="text-[8px] tracking-[0.1em] uppercase font-mono" style={{ color: 'hsl(45 90% 60%)' }}>
            PRESENT
          </span>
          <span className="text-[8px] tracking-[0.1em] uppercase font-mono" style={{ color: 'hsl(15 70% 50%)' }}>
            ANCESTRAL
          </span>
          <span className="text-[8px] tracking-[0.1em] uppercase font-mono" style={{ color: 'hsl(25 50% 40%)' }}>
            BEDROCK
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SedimentRuler;
