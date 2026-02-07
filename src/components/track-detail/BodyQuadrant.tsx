import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface BodyQuadrantProps {
  track: TrackData;
}

const BodySvg = ({ highlightArea, color }: { highlightArea: string; color: string }) => {
  const getHighlightPath = () => {
    switch (highlightArea) {
      case 'feet':
        return (
          <>
            {/* Feet highlight */}
            <ellipse cx="42" cy="145" rx="8" ry="5" fill={`hsl(${color})`} opacity="0.6" />
            <ellipse cx="58" cy="145" rx="8" ry="5" fill={`hsl(${color})`} opacity="0.6" />
            {/* Lower legs glow */}
            <rect x="38" y="120" width="8" height="25" rx="4" fill={`hsl(${color})`} opacity="0.3" />
            <rect x="54" y="120" width="8" height="25" rx="4" fill={`hsl(${color})`} opacity="0.3" />
          </>
        );
      case 'sacral':
        return (
          <>
            {/* Sacral/pelvic region */}
            <ellipse cx="50" cy="75" rx="15" ry="10" fill={`hsl(${color})`} opacity="0.5" />
            <ellipse cx="50" cy="75" rx="10" ry="6" fill={`hsl(${color})`} opacity="0.7" />
          </>
        );
      case 'stomach':
        return (
          <>
            {/* Solar plexus / stomach area */}
            <ellipse cx="50" cy="58" rx="12" ry="10" fill={`hsl(${color})`} opacity="0.5" />
            <ellipse cx="50" cy="58" rx="8" ry="6" fill={`hsl(${color})`} opacity="0.7" />
          </>
        );
      case 'heart':
        return (
          <>
            {/* Heart/chest area */}
            <ellipse cx="50" cy="45" rx="14" ry="10" fill={`hsl(${color})`} opacity="0.5" />
            <circle cx="50" cy="45" r="6" fill={`hsl(${color})`} opacity="0.8" />
            {/* Arms/hands glow */}
            <ellipse cx="25" cy="55" rx="6" ry="4" fill={`hsl(${color})`} opacity="0.3" />
            <ellipse cx="75" cy="55" rx="6" ry="4" fill={`hsl(${color})`} opacity="0.3" />
          </>
        );
      case 'throat':
        return (
          <>
            {/* Throat area */}
            <ellipse cx="50" cy="30" rx="8" ry="5" fill={`hsl(${color})`} opacity="0.6" />
            <rect x="46" y="32" width="8" height="8" rx="4" fill={`hsl(${color})`} opacity="0.4" />
          </>
        );
      case 'eyes':
        return (
          <>
            {/* Third eye / forehead */}
            <ellipse cx="50" cy="18" rx="6" ry="4" fill={`hsl(${color})`} opacity="0.7" />
            {/* Eyes */}
            <circle cx="45" cy="20" r="2" fill={`hsl(${color})`} opacity="0.9" />
            <circle cx="55" cy="20" r="2" fill={`hsl(${color})`} opacity="0.9" />
          </>
        );
      case 'crown':
        return (
          <>
            {/* Crown / top of head */}
            <ellipse cx="50" cy="12" rx="10" ry="6" fill={`hsl(${color})`} opacity="0.5" />
            {/* Aura effect */}
            <ellipse cx="50" cy="10" rx="15" ry="8" fill={`hsl(${color})`} opacity="0.2" />
            <ellipse cx="50" cy="8" rx="20" ry="10" fill={`hsl(${color})`} opacity="0.1" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg viewBox="0 0 100 160" className="w-full h-full max-h-48">
      {/* Glow filter */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Body outline */}
      <g stroke="hsl(112 64% 96% / 0.3)" strokeWidth="1" fill="none">
        {/* Head */}
        <circle cx="50" cy="18" r="12" />
        {/* Neck */}
        <line x1="50" y1="30" x2="50" y2="35" />
        {/* Torso */}
        <path d="M35 35 L35 80 L65 80 L65 35 Z" />
        {/* Arms */}
        <path d="M35 38 L20 55 L15 70" />
        <path d="M65 38 L80 55 L85 70" />
        {/* Legs */}
        <path d="M40 80 L38 120 L40 145" />
        <path d="M60 80 L62 120 L60 145" />
      </g>

      {/* Highlight area with glow */}
      <g filter="url(#glow)">
        {getHighlightPath()}
      </g>

      {/* Chakra points */}
      <g fill="hsl(112 64% 96% / 0.15)">
        <circle cx="50" cy="145" r="2" /> {/* Root */}
        <circle cx="50" cy="75" r="2" /> {/* Sacral */}
        <circle cx="50" cy="58" r="2" /> {/* Solar */}
        <circle cx="50" cy="45" r="2" /> {/* Heart */}
        <circle cx="50" cy="30" r="2" /> {/* Throat */}
        <circle cx="50" cy="18" r="2" /> {/* Third Eye */}
        <circle cx="50" cy="8" r="2" /> {/* Crown */}
      </g>
    </svg>
  );
};

const BodyQuadrant = ({ track }: BodyQuadrantProps) => {
  return (
    <motion.div
      className="glass-card rounded-2xl p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🧬</span>
        <h3 className="font-display text-xl text-foreground">The Body</h3>
        <span className="text-muted-foreground/60 font-mono text-xs ml-auto">ANATOMY</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Body visualization */}
        <div className="flex items-center justify-center">
          <BodySvg highlightArea={track.bodyArea} color={track.colorHsl} />
        </div>

        {/* Data points */}
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-wider mb-1">
              Organ Systems
            </p>
            <div className="space-y-1">
              {track.organs.map((organ, i) => (
                <p 
                  key={i} 
                  className="font-mono text-sm text-foreground"
                  style={{ color: `hsl(${track.colorHsl})` }}
                >
                  • {organ}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-wider mb-1">
              Chakra
            </p>
            <p 
              className="font-mono text-sm font-bold"
              style={{ color: `hsl(${track.colorHsl})` }}
            >
              {track.chakra}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-wider mb-1">
              Frequency
            </p>
            <p className="font-mono text-lg text-throne-gold">
              {track.frequency}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BodyQuadrant;
