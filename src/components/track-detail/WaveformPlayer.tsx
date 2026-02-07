import { motion } from 'framer-motion';
import { useState } from 'react';
import type { TrackData } from '@/data/trackData';

interface WaveformPlayerProps {
  track: TrackData;
}

const WaveformPlayer = ({ track }: WaveformPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate waveform bars
  const bars = 48;
  const waveformData = Array.from({ length: bars }, (_, i) => {
    // Create a natural-looking waveform pattern
    const position = i / bars;
    const wave1 = Math.sin(position * Math.PI * 4) * 0.3;
    const wave2 = Math.sin(position * Math.PI * 8) * 0.2;
    const wave3 = Math.sin(position * Math.PI * 2) * 0.4;
    const base = 0.3 + Math.random() * 0.2;
    return Math.min(1, Math.max(0.1, base + wave1 + wave2 + wave3));
  });

  const formatFeaturing = (feat: string) => {
    const boldNames = ['Sistah Moon', 'Vici Royàl'];
    return feat.split(/(\bSistah Moon\b|\bVici Royàl\b)/g).map((part, i) => 
      boldNames.includes(part) ? (
        <strong key={i} className="text-throne-gold font-bold">{part}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <motion.div
      className="glass-card-strong rounded-2xl p-6 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Track info header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span 
              className="font-mono text-sm px-2 py-1 rounded"
              style={{ 
                backgroundColor: `hsl(${track.colorHsl} / 0.2)`,
                color: `hsl(${track.colorHsl})`
              }}
            >
              TRACK {String(track.row).padStart(2, '0')}
            </span>
            <span className="font-mono text-sm text-muted-foreground">
              {track.frequency}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            {track.track}
          </h2>
          {track.featuring && (
            <p className="font-mono text-sm text-muted-foreground mt-1">
              ft. {formatFeaturing(track.featuring)}
            </p>
          )}
        </div>

        {/* Artist & Producer credits */}
        <div className="text-right">
          <p className="font-mono text-sm text-muted-foreground">
            by <strong className="text-foreground font-bold">Vici Royàl</strong>
          </p>
          <p className="font-mono text-xs text-muted-foreground/60">
            Produced by <strong className="text-throne-gold font-bold">Vici Royàl</strong> & <span className="text-throne-gold">Èks</span>
          </p>
        </div>
      </div>

      {/* Waveform visualizer */}
      <div className="relative h-24 bg-muted/20 rounded-xl overflow-hidden mb-4">
        {/* Progress overlay */}
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ 
            width: isPlaying ? '100%' : '0%',
            background: `linear-gradient(90deg, hsl(${track.colorHsl} / 0.3), hsl(${track.colorHsl} / 0.1))`
          }}
          animate={isPlaying ? { width: ['0%', '100%'] } : { width: '0%' }}
          transition={{ duration: 180, ease: 'linear' }}
        />

        {/* Waveform bars */}
        <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-4">
          {waveformData.map((height, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: '3px',
                backgroundColor: `hsl(${track.colorHsl})`,
                height: `${height * 80}%`,
              }}
              animate={isPlaying ? {
                scaleY: [1, 0.6 + Math.random() * 0.8, 1],
                opacity: [0.6, 1, 0.6],
              } : {
                scaleY: 1,
                opacity: 0.6
              }}
              transition={{
                duration: 0.3 + Math.random() * 0.4,
                repeat: isPlaying ? Infinity : 0,
                delay: i * 0.02,
              }}
            />
          ))}
        </div>

        {/* Time stamps */}
        <div className="absolute bottom-2 left-4 right-4 flex justify-between">
          <span className="font-mono text-xs text-muted-foreground/60">0:00</span>
          <span className="font-mono text-xs text-muted-foreground/60">3:45</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ⏮
        </motion.button>

        <motion.button
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          style={{ 
            backgroundColor: `hsl(${track.colorHsl})`,
            color: track.colorKey === 'chakra-source' ? 'hsl(10 25% 12%)' : 'white'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸' : '▶'}
        </motion.button>

        <motion.button
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ⏭
        </motion.button>
      </div>
    </motion.div>
  );
};

export default WaveformPlayer;
