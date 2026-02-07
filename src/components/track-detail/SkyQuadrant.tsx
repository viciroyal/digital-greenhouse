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
          className="block text-[8rem] md:text-[10rem] font-light leading-none select-none"
          style={{
            color: `hsl(${track.colorHsl})`,
            fontFamily: 'serif',
          }}
        >
          {track.zodiacGlyph}
        </span>
      </motion.div>

      {/* Zodiac Name & Details */}
      <motion.div
        className="mt-6 text-center space-y-3"
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
