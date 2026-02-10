import { motion } from 'framer-motion';
import { useState } from 'react';
import type { TrackData } from '@/data/trackData';
import DataQuadrant from './DataQuadrant';

interface EarthQuadrantProps {
  track: TrackData;
}

const EarthIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width={18} height={18}>
    <path d="M12 2 L12 8 M8 4 L8 6 M16 4 L16 6" stroke={`hsl(${color})`} strokeWidth="1.5" fill="none" />
    <ellipse cx="12" cy="10" rx="8" ry="3" fill="none" stroke={`hsl(${color})`} strokeWidth="1.5" />
    <path d="M4 10 L4 18 Q4 22 12 22 Q20 22 20 18 L20 10" stroke={`hsl(${color})`} strokeWidth="1.5" fill="none" />
  </svg>
);

const EarthQuadrant = ({ track }: EarthQuadrantProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <DataQuadrant
      title="The Earth"
      label="MINERAL"
      icon={<EarthIcon color={track.colorHsl} />}
      trackColor={track.colorHsl}
      delay={0.3}
    >
      <div className="flex flex-col items-center justify-center py-4">
        {/* Floating Mineral Image with Hover Glow */}
        <motion.div
          className="relative cursor-pointer"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl -z-10"
            style={{
              background: `radial-gradient(circle, hsl(${track.colorHsl} / ${isHovered ? 0.5 : 0.2}) 0%, transparent 70%)`,
              transform: 'scale(1.8)',
            }}
            animate={{ opacity: isHovered ? 1 : 0.6, scale: isHovered ? 2.2 : 1.8 }}
            transition={{ duration: 0.3 }}
          />

          {/* Outer glow ring on hover */}
          <motion.div
            className="absolute -inset-4 rounded-3xl pointer-events-none"
            style={{
              boxShadow: `0 0 40px hsl(${track.colorHsl} / 0.5), 0 0 80px hsl(${track.colorHsl} / 0.3)`,
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Mineral Image Container */}
          <motion.div
            className="relative w-32 h-32 md:w-36 md:h-36 overflow-hidden rounded-2xl transition-all duration-300"
            style={{
              boxShadow: isHovered 
                ? `0 0 30px hsl(${track.colorHsl} / 0.7), 0 8px 32px hsl(${track.colorHsl} / 0.4)`
                : `0 8px 32px hsl(0 0% 0% / 0.4), 0 0 0 1px hsl(${track.colorHsl} / 0.2)`,
            }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={track.mineralImage}
              alt={`${track.mineral} mineral`}
              className="w-full h-full object-cover transition-all duration-300"
              style={{ filter: isHovered ? 'brightness(1.3) saturate(1.2)' : 'brightness(1)' }}
            />
            
            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
              }}
              animate={{ x: isHovered ? ['100%', '-100%'] : '100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut', repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
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
          <p className="font-display text-lg tracking-wide" style={{ color: 'hsl(40 50% 92%)' }}>
            {track.mineral}
          </p>
          <p 
            className="font-body text-xs tracking-[0.2em] uppercase mt-1"
            style={{ color: `hsl(${track.colorHsl} / 0.6)` }}
          >
            {track.mineralSymbol}
          </p>
        </motion.div>
      </div>
    </DataQuadrant>
  );
};

export default EarthQuadrant;
