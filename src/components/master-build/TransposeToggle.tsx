import { motion } from 'framer-motion';
import { Music2, Leaf } from 'lucide-react';

export type TransposeMode = 'artist' | 'farmer';

interface TransposeToggleProps {
  mode: TransposeMode;
  onToggle: (mode: TransposeMode) => void;
}

/**
 * TRANSPOSE FREQUENCY TOGGLE
 * The fader that switches between Artist Mode (Music) and Farmer Mode (Agriculture)
 */
const TransposeToggle = ({ mode, onToggle }: TransposeToggleProps) => {
  const isArtist = mode === 'artist';

  return (
    <div className="flex flex-col items-center gap-3">
      <p
        className="text-[10px] font-mono tracking-[0.3em] uppercase"
        style={{ color: 'hsl(0 0% 45%)' }}
      >
        Transpose Frequency
      </p>

      <div
        className="relative flex items-center rounded-full p-1 cursor-pointer"
        style={{
          background: 'hsl(0 0% 8%)',
          border: '1px solid hsl(0 0% 20%)',
          boxShadow: 'inset 0 2px 8px hsl(0 0% 0% / 0.5)',
          width: 240,
        }}
        onClick={() => onToggle(isArtist ? 'farmer' : 'artist')}
      >
        {/* Sliding indicator */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-full"
          style={{
            width: '50%',
            background: isArtist
              ? 'linear-gradient(135deg, hsl(270 50% 35%), hsl(280 40% 25%))'
              : 'linear-gradient(135deg, hsl(120 40% 25%), hsl(90 35% 20%))',
            boxShadow: isArtist
              ? '0 0 20px hsl(270 50% 40% / 0.4)'
              : '0 0 20px hsl(120 40% 30% / 0.4)',
          }}
          animate={{ x: isArtist ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* Artist label */}
        <button
          className="relative z-10 flex items-center justify-center gap-2 py-2.5 flex-1"
          onClick={(e) => { e.stopPropagation(); onToggle('artist'); }}
        >
          <Music2 className="w-4 h-4" style={{ color: isArtist ? 'hsl(270 70% 75%)' : 'hsl(0 0% 40%)' }} />
          <span
            className="font-mono text-xs tracking-wider"
            style={{ color: isArtist ? 'hsl(270 70% 80%)' : 'hsl(0 0% 40%)' }}
          >
            ARTIST
          </span>
        </button>

        {/* Farmer label */}
        <button
          className="relative z-10 flex items-center justify-center gap-2 py-2.5 flex-1"
          onClick={(e) => { e.stopPropagation(); onToggle('farmer'); }}
        >
          <Leaf className="w-4 h-4" style={{ color: !isArtist ? 'hsl(120 60% 65%)' : 'hsl(0 0% 40%)' }} />
          <span
            className="font-mono text-xs tracking-wider"
            style={{ color: !isArtist ? 'hsl(120 60% 70%)' : 'hsl(0 0% 40%)' }}
          >
            FARMER
          </span>
        </button>
      </div>
    </div>
  );
};

export default TransposeToggle;
