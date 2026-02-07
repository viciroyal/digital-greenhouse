import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface EarthQuadrantProps {
  track: TrackData;
}

const EarthQuadrant = ({ track }: EarthQuadrantProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Floating Mineral Image */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Subtle ambient glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl -z-10"
          style={{
            background: `radial-gradient(circle, hsl(${track.colorHsl} / 0.2) 0%, transparent 70%)`,
            transform: 'scale(1.5)',
          }}
        />

        {/* Mineral Image */}
        <div
          className="relative w-36 h-36 md:w-44 md:h-44 overflow-hidden rounded-2xl"
          style={{
            boxShadow: `
              0 8px 32px hsl(${track.colorHsl} / 0.3),
              0 0 0 1px hsl(${track.colorHsl} / 0.2)
            `,
          }}
        >
          <img
            src={track.mineralImage}
            alt={`${track.mineral} mineral`}
            className="w-full h-full object-cover"
          />
          
          {/* Subtle overlay for color unity */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, hsl(${track.colorHsl} / 0.1) 0%, transparent 50%, hsl(${track.colorHsl} / 0.15) 100%)`,
            }}
          />
        </div>
      </motion.div>

      {/* Mineral Name & Symbol */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="font-mono text-lg md:text-xl font-bold text-foreground tracking-wide">
          {track.mineral}
        </p>
        <p 
          className="font-mono text-xs tracking-[0.2em] uppercase mt-1"
          style={{ color: `hsl(${track.colorHsl} / 0.6)` }}
        >
          {track.mineralSymbol}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EarthQuadrant;
