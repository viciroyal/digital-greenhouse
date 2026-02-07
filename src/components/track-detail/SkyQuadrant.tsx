import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface SkyQuadrantProps {
  track: TrackData;
}

// Aboriginal-style zodiac glyph with dot painting aesthetic
const AboriginalZodiacGlyph = ({ glyph, color }: { glyph: string; color: string }) => {
  // Generate concentric dot circles
  const dotRing = (cx: number, cy: number, radius: number, count: number, opacity: number, dotColor: string) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      dots.push(
        <motion.circle
          key={`ring-${radius}-${i}`}
          cx={x}
          cy={y}
          r="3"
          fill={dotColor}
          opacity={opacity}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 + (i * 0.02), duration: 0.3 }}
        />
      );
    }
    return dots;
  };

  return (
    <div className="relative">
      {/* SVG dot decoration around the glyph */}
      <svg 
        viewBox="0 0 200 200" 
        className="absolute inset-0 w-full h-full"
        style={{ transform: 'scale(1.3)' }}
      >
        {/* Outer ceremonial rings */}
        {dotRing(100, 100, 90, 32, 0.15, 'hsl(45 80% 55%)')}
        {dotRing(100, 100, 78, 28, 0.2, `hsl(${color})`)}
        {dotRing(100, 100, 66, 24, 0.25, 'hsl(112 64% 96%)')}
        
        {/* Inner energy rings */}
        {dotRing(100, 100, 54, 20, 0.3, `hsl(${color})`)}
        {dotRing(100, 100, 42, 16, 0.35, 'hsl(45 80% 55%)')}
        
        {/* Core rings */}
        {dotRing(100, 100, 30, 12, 0.4, `hsl(${color})`)}

        {/* Cardinal direction markers */}
        {[0, 90, 180, 270].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <g key={angle}>
              <circle 
                cx={100 + Math.cos(rad) * 95} 
                cy={100 + Math.sin(rad) * 95} 
                r="5" 
                fill={`hsl(${color})`} 
                opacity="0.5" 
              />
              <circle 
                cx={100 + Math.cos(rad) * 95} 
                cy={100 + Math.sin(rad) * 95} 
                r="2.5" 
                fill="hsl(45 80% 55%)" 
                opacity="0.8" 
              />
            </g>
          );
        })}

        {/* Connecting spirit lines */}
        {[45, 135, 225, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const dots = [];
          for (let i = 0; i < 5; i++) {
            const dist = 55 + i * 8;
            dots.push(
              <circle
                key={`spirit-${angle}-${i}`}
                cx={100 + Math.cos(rad) * dist}
                cy={100 + Math.sin(rad) * dist}
                r="2"
                fill="hsl(112 64% 96%)"
                opacity={0.2 - i * 0.03}
              />
            );
          }
          return <g key={angle}>{dots}</g>;
        })}
      </svg>

      {/* The Glyph - centered */}
      <motion.span
        className="relative block text-[7rem] md:text-[9rem] leading-none select-none text-center"
        style={{
          color: `hsl(${color})`,
          fontFamily: 'serif',
          textShadow: `0 0 20px hsl(${color} / 0.3)`,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {glyph}
      </motion.span>
    </div>
  );
};

const SkyQuadrant = ({ track }: SkyQuadrantProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* Aboriginal-styled Zodiac Glyph */}
      <motion.div
        className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center"
        animate={{
          rotate: [0, 1, -1, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <AboriginalZodiacGlyph glyph={track.zodiacGlyph} color={track.colorHsl} />
      </motion.div>

      {/* Zodiac Name & Details */}
      <motion.div
        className="mt-4 text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Sign Name */}
        <div>
          <p 
            className="font-mono text-lg font-bold tracking-wide"
            style={{ color: `hsl(${track.colorHsl})` }}
          >
            {track.zodiacSign}
          </p>
          <p className="font-mono text-xs text-muted-foreground/60 mt-0.5">
            {track.zodiacName}
          </p>
        </div>

        {/* Planetary Ruler */}
        <div className="pt-2 border-t border-muted/30">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-1">
            Planetary Ruler
          </p>
          <p 
            className="font-mono text-sm font-medium"
            style={{ color: `hsl(${track.colorHsl} / 0.8)` }}
          >
            {track.planetaryRuler}
          </p>
        </div>

        {/* Moon Phase */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-1">
            Moon Phase
          </p>
          <p className="font-mono text-sm text-foreground/80">
            {track.moonPhase}
          </p>
          <p className="font-mono text-xs text-muted-foreground/60 italic">
            "{track.moonDescription}"
          </p>
        </div>

        {/* Zodiac Logic */}
        <div className="pt-3 max-w-xs mx-auto">
          <p className="font-body text-xs text-muted-foreground/70 leading-relaxed italic">
            {track.zodiacLogic}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SkyQuadrant;
