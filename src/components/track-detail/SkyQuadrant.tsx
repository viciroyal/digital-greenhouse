import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface SkyQuadrantProps {
  track: TrackData;
}

const MoonPhaseIcon = ({ phase, color }: { phase: string; color: string }) => {
  const getMoonPath = () => {
    switch (phase) {
      case 'New Moon':
        return (
          <circle cx="30" cy="30" r="20" fill="hsl(112 64% 96% / 0.1)" stroke={`hsl(${color})`} strokeWidth="2" />
        );
      case 'Waxing Crescent':
        return (
          <>
            <circle cx="30" cy="30" r="20" fill="hsl(112 64% 96% / 0.1)" />
            <path d="M30 10 A20 20 0 0 1 30 50 A12 20 0 0 0 30 10" fill={`hsl(${color})`} />
          </>
        );
      case 'First Quarter':
        return (
          <>
            <circle cx="30" cy="30" r="20" fill="hsl(112 64% 96% / 0.1)" />
            <path d="M30 10 A20 20 0 0 1 30 50 L30 10" fill={`hsl(${color})`} />
          </>
        );
      case 'Waxing Gibbous':
        return (
          <>
            <circle cx="30" cy="30" r="20" fill={`hsl(${color})`} />
            <path d="M30 10 A20 20 0 0 0 30 50 A8 20 0 0 1 30 10" fill="hsl(10 25% 12%)" />
          </>
        );
      case 'Full Moon':
        return (
          <circle cx="30" cy="30" r="20" fill={`hsl(${color})`} />
        );
      case 'Waning Gibbous':
        return (
          <>
            <circle cx="30" cy="30" r="20" fill={`hsl(${color})`} />
            <path d="M30 10 A20 20 0 0 1 30 50 A8 20 0 0 0 30 10" fill="hsl(10 25% 12%)" />
          </>
        );
      case 'Last Quarter':
        return (
          <>
            <circle cx="30" cy="30" r="20" fill="hsl(112 64% 96% / 0.1)" />
            <path d="M30 10 A20 20 0 0 0 30 50 L30 10" fill={`hsl(${color})`} />
          </>
        );
      case 'Balsamic':
        return (
          <>
            <circle cx="30" cy="30" r="20" fill="hsl(112 64% 96% / 0.1)" />
            <path d="M30 10 A20 20 0 0 0 30 50 A12 20 0 0 1 30 10" fill={`hsl(${color})`} />
          </>
        );
      case 'Dark Moon':
        return (
          <>
            <circle cx="30" cy="30" r="20" fill="hsl(0 0% 5%)" stroke={`hsl(${color} / 0.3)`} strokeWidth="2" />
            {/* Subtle glow */}
            <circle cx="30" cy="30" r="22" fill="none" stroke={`hsl(${color} / 0.1)`} strokeWidth="4" />
          </>
        );
      default:
        return <circle cx="30" cy="30" r="20" fill={`hsl(${color})`} />;
    }
  };

  return (
    <svg viewBox="0 0 60 60" className="w-24 h-24">
      <defs>
        <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#moonGlow)">
        {getMoonPath()}
      </g>
    </svg>
  );
};

const getPlanetSymbol = (planet: string): string => {
  const symbols: Record<string, string> = {
    'Saturn': '♄',
    'Moon': '☽',
    'Mars': '♂',
    'Venus': '♀',
    'Mercury': '☿',
    'Jupiter': '♃',
    'Neptune': '♆',
    'Pluto': '♇',
    'Sun': '☉',
    'Uranus': '♅',
  };
  return symbols[planet] || '⭐';
};

const SkyQuadrant = ({ track }: SkyQuadrantProps) => {
  return (
    <motion.div
      className="glass-card rounded-2xl p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🌙</span>
        <h3 className="font-display text-xl text-foreground">The Sky</h3>
        <span className="text-muted-foreground/60 font-mono text-xs ml-auto">COSMOLOGY</span>
      </div>

      <div className="flex items-start gap-6">
        {/* Moon visualization */}
        <div className="flex-shrink-0">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <MoonPhaseIcon phase={track.moonPhase} color={track.colorHsl} />
          </motion.div>
        </div>

        {/* Data points */}
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-wider mb-1">
              Moon Phase
            </p>
            <p 
              className="font-mono text-lg font-bold"
              style={{ color: `hsl(${track.colorHsl})` }}
            >
              {track.moonPhase}
            </p>
            <p className="font-mono text-sm text-muted-foreground italic">
              "{track.moonDescription}"
            </p>
          </div>

          <div>
            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-wider mb-1">
              Planetary Ruler
            </p>
            <div className="flex items-center gap-2">
              <span 
                className="text-2xl"
                style={{ color: `hsl(${track.colorHsl})` }}
              >
                {getPlanetSymbol(track.planetaryRuler)}
              </span>
              <p className="font-mono text-sm text-foreground">
                {track.planetaryRuler}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zodiac Section - The Glyph */}
      <div className="mt-6 pt-6 border-t border-glass-border">
        <div className="flex items-center gap-4">
          {/* Glowing Zodiac Glyph */}
          <motion.div
            className="relative flex-shrink-0"
            animate={{
              textShadow: [
                `0 0 10px hsl(${track.colorHsl}), 0 0 20px hsl(${track.colorHsl}), 0 0 30px hsl(${track.colorHsl})`,
                `0 0 15px hsl(${track.colorHsl}), 0 0 30px hsl(${track.colorHsl}), 0 0 45px hsl(${track.colorHsl})`,
                `0 0 10px hsl(${track.colorHsl}), 0 0 20px hsl(${track.colorHsl}), 0 0 30px hsl(${track.colorHsl})`,
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span 
              className="text-5xl font-bold"
              style={{ 
                color: `hsl(${track.colorHsl})`,
                filter: `drop-shadow(0 0 8px hsl(${track.colorHsl}))`,
              }}
            >
              {track.zodiacGlyph}
            </span>
          </motion.div>

          {/* Zodiac Info */}
          <div className="flex-1">
            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-wider mb-1">
              Zodiac Sign
            </p>
            <p 
              className="font-mono text-lg font-bold"
              style={{ color: `hsl(${track.colorHsl})` }}
            >
              {track.zodiacSign}
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              {track.zodiacName}
            </p>
          </div>
        </div>

        {/* Zodiac Logic */}
        <p className="mt-3 font-mono text-xs text-muted-foreground/80 italic leading-relaxed">
          "{track.zodiacLogic}"
        </p>
      </div>
    </motion.div>
  );
};

export default SkyQuadrant;
