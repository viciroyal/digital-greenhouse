import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface LogicQuadrantProps {
  track: TrackData;
}

const LogicQuadrant = ({ track }: LogicQuadrantProps) => {
  return (
    <motion.div
      className="glass-card rounded-2xl p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🧪</span>
        <h3 className="font-display text-xl text-foreground">The Logic</h3>
        <span className="text-muted-foreground/60 font-mono text-xs ml-auto">PHARMER'S NOTE</span>
      </div>

      {/* Quote box */}
      <div 
        className="relative p-6 rounded-xl border"
        style={{ 
          borderColor: `hsl(${track.colorHsl} / 0.3)`,
          background: `linear-gradient(135deg, hsl(${track.colorHsl} / 0.05) 0%, transparent 100%)`
        }}
      >
        {/* Quote marks */}
        <span 
          className="absolute -top-2 left-4 text-4xl opacity-30"
          style={{ color: `hsl(${track.colorHsl})` }}
        >
          "
        </span>
        
        <p className="font-mono text-base text-foreground leading-relaxed italic pl-4">
          {track.pharmerNote}
        </p>

        <span 
          className="absolute -bottom-4 right-4 text-4xl opacity-30"
          style={{ color: `hsl(${track.colorHsl})` }}
        >
          "
        </span>
      </div>

      {/* Connection line */}
      <div className="mt-6 flex items-center gap-3">
        <div 
          className="h-px flex-1"
          style={{ background: `linear-gradient(90deg, hsl(${track.colorHsl} / 0.5), transparent)` }}
        />
        <p className="text-muted-foreground/60 font-mono text-xs">
          {track.mineral} → {track.chakra} → {track.frequency}
        </p>
        <div 
          className="h-px flex-1"
          style={{ background: `linear-gradient(90deg, transparent, hsl(${track.colorHsl} / 0.5)` }}
        />
      </div>
    </motion.div>
  );
};

export default LogicQuadrant;
