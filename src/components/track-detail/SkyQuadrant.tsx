import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';
import { WovenZodiacGlyph } from './GemstoneIcons';

interface SkyQuadrantProps {
  track: TrackData;
}

// Cosmic Garden colors
const COSMIC = {
  cream: 'hsl(40 50% 95%)',
  creamMuted: 'hsl(40 50% 85%)',
  gemRuby: 'hsl(350 75% 50%)',
  gemSapphire: 'hsl(220 75% 55%)',
  gemTopaz: 'hsl(45 90% 60%)',
  gemAmethyst: 'hsl(280 60% 55%)',
  forestGreen: 'hsl(140 50% 35%)',
};

const SkyQuadrant = ({ track }: SkyQuadrantProps) => {
  return (
    <motion.div
      className="gem-card p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <svg viewBox="0 0 24 24" width={28} height={28} className="drop-shadow">
          <circle cx="12" cy="12" r="10" fill="hsl(250 50% 20%)" stroke={COSMIC.gemAmethyst} strokeWidth="1" />
          <circle cx="12" cy="12" r="2" fill={COSMIC.gemTopaz} />
          <circle cx="12" cy="5" r="1.5" fill="white" opacity="0.8" />
          <circle cx="19" cy="12" r="1" fill="white" opacity="0.6" />
          <circle cx="12" cy="19" r="1" fill="white" opacity="0.6" />
          <circle cx="5" cy="12" r="1" fill="white" opacity="0.6" />
        </svg>
        <h3 className="font-bubble text-xl text-foreground">The Sky</h3>
        <span className="text-muted-foreground/60 font-body text-xs ml-auto tracking-wider">CELESTIAL</span>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        {/* Woven Vine Zodiac Glyph */}
        <motion.div
          className="relative"
          animate={{
            y: [0, -4, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <WovenZodiacGlyph glyph={track.zodiacGlyph} color={track.colorHsl} size={140} />
        </motion.div>

        {/* Zodiac Details */}
        <motion.div
          className="mt-6 text-center space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Sign Name */}
          <div>
            <p 
              className="font-bubble text-2xl tracking-wider"
              style={{ 
                color: COSMIC.cream,
                textShadow: `0 0 20px hsl(${track.colorHsl} / 0.5)`,
              }}
            >
              {track.zodiacSign}
            </p>
            <p 
              className="font-body text-xs tracking-[0.2em] uppercase mt-1"
              style={{ color: `hsl(${track.colorHsl})` }}
            >
              {track.zodiacName}
            </p>
          </div>

          {/* Planetary Ruler */}
          <div 
            className="pt-3 border-t"
            style={{ borderColor: `hsl(${track.colorHsl} / 0.3)` }}
          >
            <p 
              className="font-body text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ color: COSMIC.gemTopaz }}
            >
              ◇ Celestial Ruler
            </p>
            <p 
              className="font-body text-sm"
              style={{ color: COSMIC.creamMuted }}
            >
              {track.planetaryRuler}
            </p>
          </div>

          {/* Moon Phase */}
          <div>
            <p 
              className="font-body text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ color: COSMIC.gemSapphire }}
            >
              ◇ Moon Cycle
            </p>
            <p 
              className="font-body text-sm"
              style={{ color: COSMIC.creamMuted }}
            >
              {track.moonPhase}
            </p>
            <p 
              className="font-body text-xs italic mt-1 text-muted-foreground/70"
            >
              "{track.moonDescription}"
            </p>
          </div>

          {/* Zodiac Logic */}
          <div 
            className="pt-3 max-w-xs mx-auto"
            style={{ borderTop: `1px dashed hsl(${track.colorHsl} / 0.2)` }}
          >
            <p className="font-body text-xs leading-relaxed italic text-muted-foreground/60">
              {track.zodiacLogic}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SkyQuadrant;
