import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface EarthQuadrantProps {
  track: TrackData;
}

const EarthQuadrant = ({ track }: EarthQuadrantProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      {/* Floating Raw Stone / Crystal */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Ambient glow behind the stone */}
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            background: `radial-gradient(circle, hsl(${track.colorHsl} / 0.3) 0%, transparent 70%)`,
            transform: 'scale(1.8)',
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Raw Stone Shape - irregular organic mask */}
        <div
          className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden"
          style={{
            borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
            boxShadow: `
              0 0 30px hsl(${track.colorHsl} / 0.4),
              0 0 60px hsl(${track.colorHsl} / 0.2),
              inset 0 0 20px hsl(${track.colorHsl} / 0.3)
            `,
          }}
        >
          {/* Base mineral color gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, hsl(${track.colorHsl} / 0.9) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 70%, hsl(${track.colorHsl} / 0.6) 0%, transparent 40%),
                linear-gradient(135deg, 
                  hsl(${track.colorHsl} / 0.8) 0%, 
                  hsl(${track.colorHsl} / 0.4) 50%, 
                  hsl(${track.colorHsl} / 0.6) 100%
                )
              `,
            }}
          />

          {/* Crystal facet texture overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <defs>
              <pattern id="mineralPattern" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M0 12 L12 0 L24 12 L12 24 Z" fill="none" stroke="white" strokeWidth="0.5" />
                <path d="M12 0 L12 24 M0 12 L24 12" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mineralPattern)" />
          </svg>

          {/* Surface shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              x: ['-20%', '20%', '-20%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Inner highlight */}
          <div
            className="absolute top-2 left-3 w-8 h-4 rounded-full blur-sm"
            style={{
              background: `linear-gradient(135deg, white/60, transparent)`,
            }}
          />
        </div>
      </motion.div>

      {/* Mineral Name - clean monospace label */}
      <motion.div
        className="mt-8 text-center"
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
