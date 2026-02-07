import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface FunctionSealProps {
  track: TrackData;
}

const FunctionSeal = ({ track }: FunctionSealProps) => {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
    >
      {/* Function Seal Container */}
      <div 
        className="relative inline-block"
      >
        {/* Outer stamp border */}
        <div 
          className="relative px-6 py-4 rounded-lg border-2 border-dashed"
          style={{ 
            borderColor: `hsl(${track.colorHsl} / 0.6)`,
            background: `linear-gradient(135deg, hsl(${track.colorHsl} / 0.08) 0%, hsl(${track.colorHsl} / 0.02) 100%)`
          }}
        >
          {/* Corner stamps */}
          <div 
            className="absolute -top-1 -left-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: `hsl(${track.colorHsl})` }}
          />
          <div 
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: `hsl(${track.colorHsl})` }}
          />
          <div 
            className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: `hsl(${track.colorHsl})` }}
          />
          <div 
            className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: `hsl(${track.colorHsl})` }}
          />

          {/* Main seal content */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            {/* Function and Input */}
            <div className="font-mono text-sm tracking-wider">
              <span className="text-muted-foreground/60">FUNC:</span>
              <span 
                className="ml-2 font-bold tracking-widest"
                style={{ color: `hsl(${track.colorHsl})` }}
              >
                {track.designation}
              </span>
              <span className="text-muted-foreground/40 mx-3">//</span>
              <span className="text-muted-foreground/60">INPUT:</span>
              <span className="ml-2 text-foreground font-medium">
                {track.soilInput}
              </span>
            </div>

            {/* Divider */}
            <div 
              className="hidden md:block w-px h-8"
              style={{ backgroundColor: `hsl(${track.colorHsl} / 0.3)` }}
            />

            {/* Context */}
            <p className="font-mono text-xs text-muted-foreground/80 italic max-w-md">
              "{track.designationContext}"
            </p>
          </div>

          {/* AgroMajic Protocol stamp */}
          <div className="absolute -bottom-2 right-4 px-2 py-0.5 bg-background">
            <span 
              className="font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: `hsl(${track.colorHsl} / 0.5)` }}
            >
              AGROMAJIC PROTOCOL
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FunctionSeal;
