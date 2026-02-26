import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

const PARTICLE_COUNT = 24;
const CELEBRATION_KEY = 'pharmboi-flourish-celebrated';

/**
 * Golden particle burst celebration when the seed reaches 100% growth.
 * Shows once per session, then stores a flag so it doesn't replay.
 */
const FlourishingCelebration = ({ active }: { active: boolean }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) return;
    const already = sessionStorage.getItem(CELEBRATION_KEY);
    if (already) return;
    sessionStorage.setItem(CELEBRATION_KEY, '1');
    setShow(true);
    const t = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(t);
  }, [active]);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * 360;
        const dist = 60 + Math.random() * 80;
        const size = 3 + Math.random() * 5;
        const hue = 30 + Math.random() * 40; // gold-green range
        return { angle, dist, size, hue, delay: Math.random() * 0.4 };
      }),
    []
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Central flash */}
          <motion.div
            className="absolute top-[4.25rem] left-4 w-14 h-14 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(45 90% 70% / 0.6), transparent 70%)',
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 3, 4], opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Particles */}
          {particles.map((p, i) => {
            const rad = (p.angle * Math.PI) / 180;
            const x = Math.cos(rad) * p.dist;
            const y = Math.sin(rad) * p.dist;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  top: 'calc(4.25rem + 28px)',
                  left: 'calc(1rem + 28px)',
                  background: `hsl(${p.hue} 80% 60%)`,
                  boxShadow: `0 0 6px hsl(${p.hue} 80% 60% / 0.6)`,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: [0, x * 0.6, x],
                  y: [0, y * 0.6 - 20, y + 40],
                  opacity: [1, 1, 0],
                  scale: [1, 1.2, 0.3],
                }}
                transition={{
                  duration: 1.8 + p.delay,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
              />
            );
          })}

          {/* Emoji burst */}
          {['🌳', '✨', '🌿', '💛', '🌸', '🌞'].map((emoji, i) => {
            const angle = (i / 6) * 360;
            const rad = (angle * Math.PI) / 180;
            const dist = 100 + Math.random() * 40;
            return (
              <motion.span
                key={emoji}
                className="absolute text-lg"
                style={{
                  top: 'calc(4.25rem + 28px)',
                  left: 'calc(1rem + 28px)',
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: Math.cos(rad) * dist,
                  y: Math.sin(rad) * dist - 30,
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.3, 1, 0.5],
                }}
                transition={{
                  duration: 2.2,
                  delay: 0.3 + i * 0.1,
                  ease: 'easeOut',
                }}
              >
                {emoji}
              </motion.span>
            );
          })}

          {/* Banner text */}
          <motion.div
            className="absolute top-32 left-4 z-[61]"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10], scale: [0.8, 1, 1, 0.95] }}
            transition={{ duration: 3.5, times: [0, 0.15, 0.7, 1] }}
          >
            <div
              className="px-5 py-3 rounded-2xl"
              style={{
                background: 'hsl(0 0% 6% / 0.95)',
                border: '1px solid hsl(45 70% 50% / 0.5)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 30px hsl(45 80% 50% / 0.2)',
              }}
            >
              <p className="text-sm font-mono tracking-wider" style={{ color: 'hsl(45 80% 60%)' }}>
                🌳 YOUR GARDEN IS FLOURISHING!
              </p>
              <p className="text-[10px] font-mono mt-1" style={{ color: 'hsl(0 0% 50%)' }}>
                All areas explored — knowledge fully rooted
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlourishingCelebration;
