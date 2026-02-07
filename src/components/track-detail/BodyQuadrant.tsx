import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface BodyQuadrantProps {
  track: TrackData;
}

// Aboriginal-style body figure with dot painting aesthetic
const AboriginalBodySvg = ({ highlightArea, color }: { highlightArea: string; color: string }) => {
  
  // Generate dots along a path for Aboriginal dot painting effect
  const dotPattern = (cx: number, cy: number, radius: number, count: number, opacity: number = 0.3) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      dots.push(
        <circle key={`${cx}-${cy}-${i}`} cx={x} cy={y} r="1.5" fill="hsl(112 64% 96%)" opacity={opacity} />
      );
    }
    return dots;
  };

  // Concentric dot circles for energy centers
  const energyCenter = (cx: number, cy: number, isActive: boolean, activeColor: string) => (
    <g>
      {/* Outer rings */}
      {dotPattern(cx, cy, 12, 16, 0.15)}
      {dotPattern(cx, cy, 8, 12, 0.25)}
      {dotPattern(cx, cy, 4, 8, 0.35)}
      {/* Center dot */}
      <circle 
        cx={cx} 
        cy={cy} 
        r="3" 
        fill={isActive ? `hsl(${activeColor})` : "hsl(112 64% 96% / 0.4)"} 
        opacity={isActive ? 1 : 0.5}
      />
      {isActive && (
        <>
          <circle cx={cx} cy={cy} r="6" fill={`hsl(${activeColor} / 0.3)`} />
          <circle cx={cx} cy={cy} r="10" fill={`hsl(${activeColor} / 0.15)`} />
        </>
      )}
    </g>
  );

  // Connection line made of dots
  const dottedLine = (x1: number, y1: number, x2: number, y2: number, count: number = 6) => {
    const dots = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      dots.push(
        <circle key={`line-${x1}-${y1}-${x2}-${y2}-${i}`} cx={x} cy={y} r="1" fill="hsl(112 64% 96%)" opacity="0.25" />
      );
    }
    return dots;
  };

  const isArea = (area: string) => highlightArea === area;

  return (
    <svg viewBox="0 0 100 160" className="w-full h-full max-h-52">
      {/* Background decoration - journey lines */}
      <g opacity="0.1">
        {/* Curved spirit journey paths */}
        <path 
          d="M20 150 Q 50 100 80 150" 
          stroke="hsl(45 80% 55%)" 
          strokeWidth="1" 
          fill="none" 
          strokeDasharray="2 4"
        />
        <path 
          d="M30 10 Q 50 60 70 10" 
          stroke="hsl(45 80% 55%)" 
          strokeWidth="1" 
          fill="none" 
          strokeDasharray="2 4"
        />
      </g>

      {/* Body outline with Aboriginal dot style */}
      <g>
        {/* Head - concentric dot circles */}
        {dotPattern(50, 18, 14, 20, 0.2)}
        {dotPattern(50, 18, 10, 14, 0.3)}
        
        {/* Neck dots */}
        {dottedLine(50, 30, 50, 38, 4)}
        
        {/* Shoulders - curved dot lines */}
        {dottedLine(50, 38, 30, 42, 8)}
        {dottedLine(50, 38, 70, 42, 8)}
        
        {/* Arms - dots flowing down */}
        {dottedLine(30, 42, 18, 65, 10)}
        {dottedLine(70, 42, 82, 65, 10)}
        
        {/* Hands - small dot clusters */}
        {dotPattern(15, 70, 5, 8, 0.2)}
        {dotPattern(85, 70, 5, 8, 0.2)}
        
        {/* Torso outline with dots */}
        {dottedLine(35, 40, 35, 80, 12)}
        {dottedLine(65, 40, 65, 80, 12)}
        {dottedLine(35, 80, 42, 85, 4)}
        {dottedLine(65, 80, 58, 85, 4)}
        
        {/* Legs */}
        {dottedLine(42, 85, 40, 140, 16)}
        {dottedLine(58, 85, 60, 140, 16)}
        
        {/* Feet */}
        {dotPattern(38, 145, 6, 10, 0.2)}
        {dotPattern(62, 145, 6, 10, 0.2)}
      </g>

      {/* Chakra/Energy Centers - Aboriginal style */}
      <g>
        {/* Crown */}
        {energyCenter(50, 8, isArea('crown'), color)}
        {/* Third Eye */}
        {energyCenter(50, 18, isArea('eyes'), color)}
        {/* Throat */}
        {energyCenter(50, 32, isArea('throat'), color)}
        {/* Heart */}
        {energyCenter(50, 48, isArea('heart'), color)}
        {/* Solar Plexus */}
        {energyCenter(50, 60, isArea('stomach'), color)}
        {/* Sacral */}
        {energyCenter(50, 75, isArea('sacral'), color)}
        {/* Root */}
        {energyCenter(50, 90, isArea('feet'), color)}
      </g>

      {/* Central spirit line - dots connecting all chakras */}
      <g opacity="0.4">
        {dottedLine(50, 8, 50, 90, 20)}
      </g>

      {/* Active area enhancement */}
      {highlightArea && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Radiating dots from active center */}
          {highlightArea === 'crown' && (
            <>
              {dotPattern(50, 8, 18, 24, 0.15)}
              {dotPattern(50, 8, 24, 32, 0.1)}
            </>
          )}
          {highlightArea === 'heart' && (
            <>
              {dotPattern(50, 48, 18, 20, 0.2)}
              {/* Arm connections */}
              {dottedLine(50, 48, 15, 70, 12).map((dot, i) => 
                <circle key={`left-${i}`} {...dot.props} fill={`hsl(${color})`} opacity="0.3" />
              )}
              {dottedLine(50, 48, 85, 70, 12).map((dot, i) => 
                <circle key={`right-${i}`} {...dot.props} fill={`hsl(${color})`} opacity="0.3" />
              )}
            </>
          )}
          {highlightArea === 'feet' && (
            <>
              {dotPattern(38, 145, 10, 14, 0.3)}
              {dotPattern(62, 145, 10, 14, 0.3)}
              {/* Ground connection */}
              {dottedLine(38, 150, 62, 150, 10).map((dot, i) => 
                <circle key={`ground-${i}`} {...dot.props} fill={`hsl(${color})`} opacity="0.4" />
              )}
            </>
          )}
        </motion.g>
      )}
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
        {/* Body visualization - Aboriginal style */}
        <div className="flex items-center justify-center">
          <AboriginalBodySvg highlightArea={track.bodyArea} color={track.colorHsl} />
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
