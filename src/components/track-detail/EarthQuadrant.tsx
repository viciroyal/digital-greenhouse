import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface EarthQuadrantProps {
  track: TrackData;
}

const CrystalTexture = ({ crystal, color }: { crystal: string; color: string }) => {
  // Generate a procedural crystal/mineral texture
  return (
    <div className="relative w-24 h-24 rounded-xl overflow-hidden">
      {/* Base color layer */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `linear-gradient(135deg, 
            hsl(${color} / 0.8) 0%, 
            hsl(${color} / 0.4) 50%, 
            hsl(${color} / 0.6) 100%
          )`
        }}
      />
      
      {/* Crystal facet lines */}
      <svg className="absolute inset-0 w-full h-full opacity-40">
        <defs>
          <pattern id="crystalPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#crystalPattern)" />
      </svg>
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          x: ['-10%', '10%', '-10%'],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Crystal emoji overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-60">
        💎
      </div>
    </div>
  );
};

const EarthQuadrant = ({ track }: EarthQuadrantProps) => {
  return (
    <motion.div
      className="glass-card rounded-2xl p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🌍</span>
        <h3 className="font-display text-xl text-foreground">The Earth</h3>
        <span className="text-muted-foreground/60 font-mono text-xs ml-auto">MINERALS & CROPS</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Crystal visualization */}
        <div className="flex flex-col items-center gap-2">
          <CrystalTexture crystal={track.crystal} color={track.colorHsl} />
          <p className="font-mono text-xs text-muted-foreground text-center">
            {track.crystal}
          </p>
        </div>

        {/* Data points */}
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-wider mb-1">
              Soil Mineral
            </p>
            <div className="flex items-center gap-2">
              <span 
                className="font-mono text-2xl font-bold"
                style={{ color: `hsl(${track.colorHsl})` }}
              >
                {track.mineralSymbol}
              </span>
              <span className="font-mono text-sm text-foreground">
                {track.mineral}
              </span>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-wider mb-1">
              Crop Type
            </p>
            <p 
              className="font-mono text-sm font-bold"
              style={{ color: `hsl(${track.colorHsl})` }}
            >
              {track.cropType}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-wider mb-1">
              Examples
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {track.cropExamples}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EarthQuadrant;
