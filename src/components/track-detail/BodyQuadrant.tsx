import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';
import { GemstoneBodySvg, GemstoneChakraIcon } from './GemstoneIcons';

interface BodyQuadrantProps {
  track: TrackData;
}

const BodyQuadrant = ({ track }: BodyQuadrantProps) => {
  return (
    <motion.div
      className="root-card p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <GemstoneChakraIcon color={track.colorHsl} size={28} />
        <h3 className="font-bubble text-xl text-foreground">The Body</h3>
        <span className="text-muted-foreground/60 font-body text-xs ml-auto tracking-wider">ANATOMY</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Body visualization - Gemstone chakra style */}
        <div className="flex items-center justify-center">
          <GemstoneBodySvg highlightArea={track.bodyArea} color={track.colorHsl} />
        </div>

        {/* Data points */}
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground/60 font-body text-xs uppercase tracking-wider mb-1">
              Organ Systems
            </p>
            <div className="space-y-1">
              {track.organs.map((organ, i) => (
                <p 
                  key={i} 
                  className="font-body text-sm"
                  style={{ color: `hsl(${track.colorHsl})` }}
                >
                  ◇ {organ}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground/60 font-body text-xs uppercase tracking-wider mb-1">
              Chakra
            </p>
            <p 
              className="font-body text-sm font-bold"
              style={{ color: `hsl(${track.colorHsl})` }}
            >
              {track.chakra}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground/60 font-body text-xs uppercase tracking-wider mb-1">
              Frequency
            </p>
            <p className="font-body text-lg text-gem-topaz">
              {track.frequency}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BodyQuadrant;
