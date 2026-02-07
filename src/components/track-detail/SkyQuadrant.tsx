import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface SkyQuadrantProps {
  track: TrackData;
}

const SkyQuadrant = ({ track }: SkyQuadrantProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      {/* Massive Floating Zodiac Glyph */}
      <motion.div
        className="relative"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, hsl(${track.colorHsl} / 0.4) 0%, transparent 70%)`,
            transform: 'scale(2)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* The Glyph */}
        <motion.span
          className="relative block text-[12rem] md:text-[16rem] font-bold leading-none"
          style={{
            color: `hsl(${track.colorHsl})`,
            textShadow: `
              0 0 20px hsl(${track.colorHsl}),
              0 0 40px hsl(${track.colorHsl}),
              0 0 60px hsl(${track.colorHsl}),
              0 0 80px hsl(${track.colorHsl} / 0.8),
              0 0 120px hsl(${track.colorHsl} / 0.6),
              0 0 200px hsl(${track.colorHsl} / 0.4)
            `,
            filter: `drop-shadow(0 0 30px hsl(${track.colorHsl}))`,
          }}
          animate={{
            textShadow: [
              `0 0 20px hsl(${track.colorHsl}), 0 0 40px hsl(${track.colorHsl}), 0 0 60px hsl(${track.colorHsl}), 0 0 80px hsl(${track.colorHsl} / 0.8), 0 0 120px hsl(${track.colorHsl} / 0.6), 0 0 200px hsl(${track.colorHsl} / 0.4)`,
              `0 0 30px hsl(${track.colorHsl}), 0 0 60px hsl(${track.colorHsl}), 0 0 90px hsl(${track.colorHsl}), 0 0 120px hsl(${track.colorHsl} / 0.9), 0 0 180px hsl(${track.colorHsl} / 0.7), 0 0 280px hsl(${track.colorHsl} / 0.5)`,
              `0 0 20px hsl(${track.colorHsl}), 0 0 40px hsl(${track.colorHsl}), 0 0 60px hsl(${track.colorHsl}), 0 0 80px hsl(${track.colorHsl} / 0.8), 0 0 120px hsl(${track.colorHsl} / 0.6), 0 0 200px hsl(${track.colorHsl} / 0.4)`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {track.zodiacGlyph}
        </motion.span>
      </motion.div>

      {/* Zodiac Name - subtle label below */}
      <motion.p
        className="mt-6 font-mono text-sm tracking-[0.3em] uppercase"
        style={{ color: `hsl(${track.colorHsl} / 0.7)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {track.zodiacSign}
      </motion.p>
    </motion.div>
  );
};

export default SkyQuadrant;
