import { motion } from 'framer-motion';
import { Scan, FlaskConical } from 'lucide-react';
import type { TrackData } from '@/data/trackData';

interface SpectralVaultTriggerProps {
  track: TrackData;
  onOpen: () => void;
}

/**
 * Trigger button for opening the Spectral Vault drawer
 */
const SpectralVaultTrigger = ({ track, onOpen }: SpectralVaultTriggerProps) => {
  return (
    <motion.div
      className="glass-card p-6 rounded-3xl"
      style={{
        background: 'linear-gradient(135deg, hsl(200 40% 10% / 0.8), hsl(220 40% 8% / 0.6))',
        border: '1px solid hsl(200 60% 30% / 0.3)',
        boxShadow: '0 0 30px hsl(200 60% 20% / 0.2)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(200 60% 30%), hsl(180 70% 25%))',
            boxShadow: '0 0 15px hsl(180 70% 40% / 0.4)',
          }}
        >
          <FlaskConical className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <p className="font-body text-xs tracking-wider text-cyan-400/80">
            PROOF PROTOCOL
          </p>
          <h3 className="font-display text-lg text-foreground">
            Spectral Vault
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="font-body text-sm text-muted-foreground mb-6">
        Near-Infrared analysis validates the nutrient density of harvest grown under{' '}
        <span style={{ color: `hsl(${track.colorHsl})` }}>{track.chakra}</span> frequency.
      </p>

      {/* Trigger Button */}
      <motion.button
        onClick={onOpen}
        className="w-full py-3 px-4 rounded-xl font-mono text-sm tracking-wider uppercase flex items-center justify-center gap-3"
        style={{
          background: 'linear-gradient(135deg, hsl(180 50% 25%), hsl(200 60% 20%))',
          border: '1px solid hsl(180 60% 40% / 0.4)',
          boxShadow: '0 0 20px hsl(180 60% 30% / 0.3)',
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: '0 0 30px hsl(180 60% 40% / 0.5)',
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Scan className="w-4 h-4 text-cyan-400" />
        <span className="text-foreground">VIEW SPECTROSCOPY DATA</span>
      </motion.button>

      {/* Mini preview indicator */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{
                height: 8 + Math.sin(i * 0.8) * 4,
                background: `hsl(${180 + i * 20} 70% 50%)`,
              }}
              animate={{
                height: [8 + Math.sin(i * 0.8) * 4, 12 + Math.cos(i * 0.8) * 6, 8 + Math.sin(i * 0.8) * 4],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] text-muted-foreground/60">
          NIR READY
        </span>
      </div>
    </motion.div>
  );
};

export default SpectralVaultTrigger;
