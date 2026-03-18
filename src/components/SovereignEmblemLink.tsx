import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDiscoveries, TOTAL_DISCOVERIES, onDiscovery } from '@/lib/discoveryEvents';
import sovereignEmblem from '@/assets/sovereign-emblem.png';
import collectivelySustainable from '@/assets/collectively-sustainable.png';

const RING_SIZE = 76;
const STROKE_WIDTH = 2.5;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CELEBRATION_KEY = 'pharmboi-celebration-shown';

/** Burst particle positions (angle in degrees, distance multiplier) */
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  angle: i * 30,
  delay: i * 0.04,
  size: i % 3 === 0 ? 6 : 4,
  distance: i % 2 === 0 ? 52 : 40,
}));

const SovereignEmblemLink = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(() => getDiscoveries().length / TOTAL_DISCOVERIES);
  const [celebrating, setCelebrating] = useState(false);
  const prevProgress = useRef(progress);

  useEffect(() => {
    setProgress(getDiscoveries().length / TOTAL_DISCOVERIES);
  }, [location.pathname]);

  useEffect(() => {
    return onDiscovery(() => {
      setProgress(getDiscoveries().length / TOTAL_DISCOVERIES);
    });
  }, []);

  // Trigger celebration when progress hits 1
  useEffect(() => {
    if (progress >= 1 && prevProgress.current < 1) {
      const alreadyShown = sessionStorage.getItem(CELEBRATION_KEY);
      if (!alreadyShown) {
        setCelebrating(true);
        sessionStorage.setItem(CELEBRATION_KEY, '1');
        const t = setTimeout(() => setCelebrating(false), 3500);
        return () => clearTimeout(t);
      }
    }
    prevProgress.current = progress;
  }, [progress]);

  const isComplete = progress >= 1;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-4">
      <div onClick={() => navigate('/stage')} role="link" className="group relative cursor-pointer">
      <AnimatePresence>
        {celebrating && (
          <>
            {/* Expanding glow ring */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              initial={{ width: 20, height: 20, opacity: 0.9 }}
              animate={{ width: 140, height: 140, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                background: 'radial-gradient(circle, hsl(45 80% 60% / 0.5) 0%, transparent 70%)',
              }}
            />

            {/* Particles */}
            {PARTICLES.map((p, i) => {
              const rad = (p.angle * Math.PI) / 180;
              const x = Math.cos(rad) * p.distance;
              const y = Math.sin(rad) * p.distance;
              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
                  style={{
                    width: p.size,
                    height: p.size,
                    background: i % 3 === 0
                      ? 'hsl(45 80% 60%)'
                      : i % 3 === 1
                        ? 'hsl(35 90% 55%)'
                        : 'hsl(55 70% 65%)',
                    marginLeft: -p.size / 2,
                    marginTop: -p.size / 2,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x, y, opacity: 0, scale: 0.3 }}
                  transition={{
                    duration: 0.9,
                    delay: p.delay,
                    ease: 'easeOut',
                  }}
                />
              );
            })}

            {/* "ALL DISCOVERED" label */}
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                color: 'hsl(45 80% 65%)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                fontFamily: 'Space Mono, monospace',
                textTransform: 'uppercase',
                textShadow: '0 0 12px hsl(45 80% 50% / 0.6)',
              }}
            >
              ✦ All Discovered ✦
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Progress ring */}
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          filter: isComplete
            ? 'drop-shadow(0 0 10px hsl(45 80% 55% / 0.5))'
            : 'drop-shadow(0 0 6px hsl(45 70% 50% / 0.25))',
          transition: 'filter 0.8s ease-out',
        }}
      >
        {/* Track */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="hsl(45 50% 30% / 0.15)"
          strokeWidth={STROKE_WIDTH}
        />
        {/* Fill */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={isComplete ? 'hsl(45 85% 60%)' : 'hsl(45 70% 55%)'}
          strokeWidth={isComplete ? 3 : STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
          style={{
            transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.5s, stroke-width 0.5s',
            opacity: progress > 0 ? (isComplete ? 1 : 0.85) : 0,
          }}
        />
      </svg>

      {/* Emblem image */}
      <motion.img
        src={sovereignEmblem}
        alt="Sovereign Emblem — Go to The Stage"
        className="w-16 opacity-75 hover:opacity-100 transition-all duration-500 cursor-pointer relative"
        animate={celebrating ? { scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] } : {}}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          filter: isComplete
            ? 'drop-shadow(0 0 18px hsl(45 80% 55% / 0.6)) drop-shadow(0 0 40px hsl(45 80% 50% / 0.2))'
            : 'drop-shadow(0 0 12px hsl(45 80% 50% / 0.4))',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.filter =
            'drop-shadow(0 0 25px hsl(45 80% 55% / 0.7)) drop-shadow(0 0 50px hsl(45 80% 50% / 0.3))')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.filter = isComplete
            ? 'drop-shadow(0 0 18px hsl(45 80% 55% / 0.6)) drop-shadow(0 0 40px hsl(45 80% 50% / 0.2))'
            : 'drop-shadow(0 0 12px hsl(45 80% 50% / 0.4))')
        }
      />

      {/* Tooltip */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
        style={{
          background: 'hsl(220 40% 10% / 0.9)',
          border: `1px solid ${isComplete ? 'hsl(45 80% 55%)' : 'hsl(45 70% 45%)'}`,
          color: 'hsl(45 70% 75%)',
          fontSize: '10px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontFamily: 'Space Mono, monospace',
        }}
      >
        {isComplete ? '✦ Fully Discovered' : 'The Stage — Home Base'}
      </div>
      </div>

      {/* Collectively Sustainable Logo */}
      <div
        onClick={() => navigate('/ten-by-ten')}
        role="link"
        className="block opacity-75 hover:opacity-100 transition-opacity duration-300 w-16 h-16 flex items-center justify-center cursor-pointer"
      >
        <img
          src={collectivelySustainable}
          alt="Collectively Sustainable"
          className="w-16 object-contain"
          style={{
            mixBlendMode: 'screen',
            filter: 'drop-shadow(0 0 8px hsl(45 60% 50% / 0.3))',
          }}
        />
      </div>
    </div>
  );
};

export default SovereignEmblemLink;
