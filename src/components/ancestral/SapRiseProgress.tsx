import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Sap Rise Progress Bar - A thermometer-style gauge
 * showing scroll progress through the Ancestral Path
 */
const SapRiseProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      // Invert because we scroll from bottom to top conceptually
      const progress = scrollHeight > 0 ? ((scrollHeight - scrolled) / scrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      {/* Label */}
      <div 
        className="text-xs font-mono tracking-wider text-center mb-2 px-2"
        style={{ 
          color: 'hsl(140 50% 60%)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
        }}
      >
        INITIATION PROGRESS
      </div>

      {/* Thermometer Container */}
      <div 
        className="relative w-6 md:w-8 h-48 md:h-64 rounded-full overflow-hidden"
        style={{
          background: 'hsl(0 0% 8%)',
          border: '2px solid hsl(40 40% 25%)',
          boxShadow: `
            inset 0 0 20px hsl(0 0% 5%),
            0 0 20px hsl(140 40% 20% / 0.3)
          `,
        }}
      >
        {/* Measurement marks */}
        {[0, 25, 50, 75, 100].map((mark) => (
          <div
            key={mark}
            className="absolute left-0 w-2 h-px"
            style={{
              bottom: `${mark}%`,
              background: 'hsl(40 40% 40%)',
            }}
          />
        ))}

        {/* Sap Fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-full"
          style={{
            background: `linear-gradient(0deg,
              hsl(140 70% 25%) 0%,
              hsl(100 60% 35%) 50%,
              hsl(80 70% 45%) 100%
            )`,
            boxShadow: `
              inset 0 5px 15px hsl(140 80% 50% / 0.3),
              0 0 10px hsl(140 60% 40% / 0.5)
            `,
          }}
          animate={{
            height: `${scrollProgress}%`,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
          }}
        >
          {/* Bubbles animation */}
          {scrollProgress > 10 && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${3 + Math.random() * 4}px`,
                    height: `${3 + Math.random() * 4}px`,
                    background: 'hsl(140 80% 60% / 0.4)',
                    left: `${10 + Math.random() * 80}%`,
                  }}
                  animate={{
                    y: [0, -50],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 1 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Glass highlight */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(90deg,
              transparent 0%,
              hsl(0 0% 100% / 0.05) 30%,
              hsl(0 0% 100% / 0.1) 50%,
              hsl(0 0% 100% / 0.05) 70%,
              transparent 100%
            )`,
          }}
        />
      </div>

      {/* Bulb at bottom */}
      <div 
        className="w-10 h-10 md:w-12 md:h-12 rounded-full -mt-4"
        style={{
          background: scrollProgress > 5 
            ? `radial-gradient(circle at 30% 30%, hsl(140 70% 35%), hsl(140 60% 20%))`
            : 'hsl(0 0% 15%)',
          border: '2px solid hsl(40 40% 25%)',
          boxShadow: scrollProgress > 5 
            ? '0 0 20px hsl(140 60% 30% / 0.5)' 
            : 'none',
        }}
      />

      {/* Percentage */}
      <div 
        className="text-sm font-mono mt-2"
        style={{ color: 'hsl(140 50% 60%)' }}
      >
        {Math.round(scrollProgress)}%
      </div>
    </motion.div>
  );
};

export default SapRiseProgress;
