import { motion } from 'framer-motion';
import { useState } from 'react';
import type { TrackData } from '@/data/trackData';

interface EarthQuadrantProps {
  track: TrackData;
}

const EarthQuadrant = ({ track }: EarthQuadrantProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Floating Mineral Image with Hover Glow */}
      <motion.div
        className="relative cursor-pointer"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ambient glow - intensifies on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl -z-10"
          style={{
            background: `radial-gradient(circle, hsl(${track.colorHsl} / ${isHovered ? 0.6 : 0.2}) 0%, transparent 70%)`,
            transform: 'scale(1.8)',
          }}
          animate={{
            opacity: isHovered ? 1 : 0.6,
            scale: isHovered ? 2.2 : 1.8,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Outer glow ring on hover */}
        <motion.div
          className="absolute -inset-4 rounded-3xl pointer-events-none"
          style={{
            boxShadow: `0 0 40px hsl(${track.colorHsl} / 0.5), 0 0 80px hsl(${track.colorHsl} / 0.3), 0 0 120px hsl(${track.colorHsl} / 0.2)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Mineral Image Container */}
        <motion.div
          className="relative w-36 h-36 md:w-44 md:h-44 overflow-hidden rounded-2xl transition-all duration-300"
          style={{
            boxShadow: isHovered 
              ? `0 0 30px hsl(${track.colorHsl} / 0.7), 0 0 60px hsl(${track.colorHsl} / 0.5), 0 8px 32px hsl(${track.colorHsl} / 0.4)`
              : `0 8px 32px hsl(${track.colorHsl} / 0.3), 0 0 0 1px hsl(${track.colorHsl} / 0.2)`,
          }}
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={track.mineralImage}
            alt={`${track.mineral} mineral`}
            className="w-full h-full object-cover transition-all duration-300"
            style={{
              filter: isHovered ? 'brightness(1.3) saturate(1.2)' : 'brightness(1)',
            }}
          />
          
          {/* Glowing overlay on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, hsl(${track.colorHsl} / 0.3) 0%, transparent 70%)`,
            }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
            }}
            animate={{
              x: isHovered ? ['100%', '-100%'] : '100%',
            }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut',
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 1,
            }}
          />
        </motion.div>
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
