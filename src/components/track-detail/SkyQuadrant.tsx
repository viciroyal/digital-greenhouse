import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface SkyQuadrantProps {
  track: TrackData;
}

const SkyQuadrant = ({ track }: SkyQuadrantProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* Clean, Refined Zodiac Glyph */}
      <motion.div
        className="relative"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* The Glyph - clean and refined, no heavy glow */}
        <span
          className="block text-[10rem] md:text-[14rem] font-light leading-none select-none"
          style={{
            color: `hsl(${track.colorHsl})`,
            fontFamily: 'serif',
          }}
        >
          {track.zodiacGlyph}
        </span>
      </motion.div>

      {/* Zodiac Name - subtle label below */}
      <motion.p
        className="mt-4 font-mono text-xs tracking-[0.2em] uppercase"
        style={{ color: `hsl(${track.colorHsl} / 0.6)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {track.zodiacSign}
      </motion.p>
    </motion.div>
  );
};

export default SkyQuadrant;
