import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';
import { WovenZodiacGlyph } from './GemstoneIcons';
import DataQuadrant from './DataQuadrant';

interface SkyQuadrantProps {
  track: TrackData;
}

const SkyIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width={18} height={18}>
    <circle cx="12" cy="12" r="8" fill="none" stroke={`hsl(${color})`} strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2" fill={`hsl(${color})`} />
    <circle cx="12" cy="5" r="1.5" fill={`hsl(${color})`} opacity="0.6" />
    <circle cx="19" cy="12" r="1" fill={`hsl(${color})`} opacity="0.6" />
    <circle cx="5" cy="12" r="1" fill={`hsl(${color})`} opacity="0.6" />
  </svg>
);

const SkyQuadrant = ({ track }: SkyQuadrantProps) => {
  return (
    <DataQuadrant
      title="The Sky"
      label="CELESTIAL"
      icon={<SkyIcon color={track.colorHsl} />}
      trackColor={track.colorHsl}
      delay={0.2}
    >
      <div className="flex flex-col items-center justify-center py-4">
        {/* Woven Vine Zodiac Glyph */}
        <motion.div
          className="relative"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <WovenZodiacGlyph glyph={track.zodiacGlyph} color={track.colorHsl} size={120} />
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
              className="font-display text-xl tracking-wider"
              style={{ 
                color: 'hsl(40 50% 92%)',
                textShadow: `0 0 20px hsl(${track.colorHsl} / 0.5)`,
              }}
            >
              {track.zodiacSign}
            </p>
            <p 
              className="font-mono text-[10px] tracking-[0.2em] uppercase mt-1"
              style={{ color: `hsl(${track.colorHsl})` }}
            >
              {track.zodiacName}
            </p>
          </div>

          {/* Planetary Ruler */}
          <div 
            className="pt-3 border-t"
            style={{ borderColor: `hsl(${track.colorHsl} / 0.2)` }}
          >
            <p 
              className="font-mono text-[10px] uppercase tracking-[0.15em] mb-1"
              style={{ color: `hsl(${track.colorHsl} / 0.7)` }}
            >
              ◇ Celestial Ruler
            </p>
            <p className="font-body text-sm" style={{ color: 'hsl(40 50% 85%)' }}>
              {track.planetaryRuler}
            </p>
          </div>

          {/* Moon Phase */}
          <div>
            <p 
              className="font-mono text-[10px] uppercase tracking-[0.15em] mb-1"
              style={{ color: `hsl(${track.colorHsl} / 0.7)` }}
            >
              ◇ Moon Cycle
            </p>
            <p className="font-body text-sm" style={{ color: 'hsl(40 50% 85%)' }}>
              {track.moonPhase}
            </p>
            <p className="font-body text-xs italic mt-1" style={{ color: 'hsl(40 30% 60%)' }}>
              "{track.moonDescription}"
            </p>
          </div>

          {/* Zodiac Logic */}
          <div 
            className="pt-3 max-w-xs mx-auto"
            style={{ borderTop: `1px dashed hsl(${track.colorHsl} / 0.15)` }}
          >
            <p className="font-body text-xs leading-relaxed italic" style={{ color: 'hsl(40 30% 55%)' }}>
              {track.zodiacLogic}
            </p>
          </div>
        </motion.div>
      </div>
    </DataQuadrant>
  );
};

export default SkyQuadrant;
