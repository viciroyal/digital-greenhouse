import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import type { TrackData } from '@/data/trackData';
import { Slider } from '@/components/ui/slider';

interface WaveformPlayerProps {
  track: TrackData;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (value: number[]) => void;
  onPlayTrack?: (track: TrackData) => void;
}

const formatTime = (time: number) => {
  if (!time || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const WaveformPlayer = ({ 
  track, 
  isPlaying = false, 
  onTogglePlay,
  currentTime = 0,
  duration = 0,
  onSeek,
  onPlayTrack,
}: WaveformPlayerProps) => {
  // Generate waveform bars
  const bars = 48;
  const waveformData = Array.from({ length: bars }, (_, i) => {
    const position = i / bars;
    const wave1 = Math.sin(position * Math.PI * 4) * 0.3;
    const wave2 = Math.sin(position * Math.PI * 8) * 0.2;
    const wave3 = Math.sin(position * Math.PI * 2) * 0.4;
    const base = 0.3 + Math.random() * 0.2;
    return Math.min(1, Math.max(0.1, base + wave1 + wave2 + wave3));
  });

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const hasAudio = !!track.audioUrl;

  const handlePlay = () => {
    if (onPlayTrack) {
      onPlayTrack(track);
    } else if (onTogglePlay) {
      onTogglePlay();
    }
  };

  return (
    <motion.div
      className="rounded-2xl p-5 h-full"
      style={{
        background: 'hsl(20 25% 10% / 0.95)',
        border: `1px solid hsl(${track.colorHsl} / 0.3)`,
        boxShadow: `0 0 30px hsl(${track.colorHsl} / 0.1), inset 0 1px 0 hsl(40 50% 90% / 0.03)`,
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              background: hasAudio ? `hsl(${track.colorHsl})` : 'hsl(40 30% 40%)',
              boxShadow: hasAudio && isPlaying ? `0 0 8px hsl(${track.colorHsl})` : 'none',
            }}
          />
          <span 
            className="font-body text-[10px] tracking-widest uppercase"
            style={{ color: `hsl(${track.colorHsl})` }}
          >
            {isPlaying ? 'NOW PLAYING' : hasAudio ? 'VIBRATIONAL PLAYER' : 'NO AUDIO'}
          </span>
        </div>
        <span className="font-mono text-[10px]" style={{ color: 'hsl(40 30% 55%)' }}>
          {track.frequency}
        </span>
      </div>

      {/* Track Info */}
      <div className="mb-4">
        <h4 
          className="font-display text-lg mb-0.5"
          style={{ 
            color: 'hsl(40 50% 92%)',
            textShadow: isPlaying ? `0 0 15px hsl(${track.colorHsl} / 0.4)` : 'none',
          }}
        >
          {track.track}
        </h4>
        <p className="font-mono text-xs" style={{ color: 'hsl(40 40% 60%)' }}>
          {track.featuring ? `ft. ${track.featuring}` : 'Vici Royàl'}
        </p>
      </div>

      {/* Waveform Visualizer */}
      <div 
        className="relative h-16 rounded-lg overflow-hidden mb-4"
        style={{ background: 'hsl(0 0% 0% / 0.3)' }}
      >
        {/* Progress overlay */}
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ 
            width: `${progressPercent}%`,
            background: `linear-gradient(90deg, hsl(${track.colorHsl} / 0.4), hsl(${track.colorHsl} / 0.2))`,
          }}
        />

        {/* Waveform bars */}
        <div className="absolute inset-0 flex items-center justify-center gap-[1px] px-2">
          {waveformData.map((height, i) => {
            const isActive = (i / waveformData.length) * 100 < progressPercent;
            return (
              <motion.div
                key={i}
                className="rounded-full"
                style={{
                  width: '2px',
                  height: `${height * 80}%`,
                  backgroundColor: isActive ? `hsl(${track.colorHsl})` : `hsl(${track.colorHsl} / 0.3)`,
                }}
                animate={isPlaying ? {
                  scaleY: [1, 0.6 + Math.random() * 0.8, 1],
                } : { scaleY: 1 }}
                transition={{
                  duration: 0.2 + Math.random() * 0.3,
                  repeat: isPlaying ? Infinity : 0,
                  delay: i * 0.01,
                }}
              />
            );
          })}
        </div>

        {/* Time display */}
        <div className="absolute bottom-1 left-2 right-2 flex justify-between">
          <span className="text-[9px] font-mono" style={{ color: 'hsl(40 30% 50%)' }}>
            {formatTime(currentTime)}
          </span>
          <span className="text-[9px] font-mono" style={{ color: 'hsl(40 30% 50%)' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Progress Slider */}
      {hasAudio && onSeek && (
        <div className="mb-4">
          <Slider
            value={[progressPercent]}
            onValueChange={onSeek}
            max={100}
            step={0.1}
            className="cursor-pointer"
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <motion.button
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ 
            background: hasAudio 
              ? isPlaying 
                ? `linear-gradient(135deg, hsl(${track.colorHsl}), hsl(${track.colorHsl} / 0.7))`
                : 'hsl(20 30% 18%)'
              : 'hsl(20 30% 15%)',
            boxShadow: hasAudio && isPlaying ? `0 0 20px hsl(${track.colorHsl} / 0.4)` : 'none',
            opacity: hasAudio ? 1 : 0.5,
            cursor: hasAudio ? 'pointer' : 'not-allowed',
          }}
          whileHover={hasAudio ? { scale: 1.05 } : {}}
          whileTap={hasAudio ? { scale: 0.95 } : {}}
          onClick={hasAudio ? handlePlay : undefined}
          disabled={!hasAudio}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" style={{ color: 'hsl(20 25% 10%)' }} />
          ) : (
            <Play className="w-5 h-5 ml-0.5" style={{ color: hasAudio ? `hsl(${track.colorHsl})` : 'hsl(40 30% 40%)' }} />
          )}
        </motion.button>
      </div>

      {/* Resonance indicator */}
      {isPlaying && (
        <motion.div
          className="mt-4 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: `hsl(${track.colorHsl})` }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: 'hsl(40 30% 50%)' }}>
            RESONATING
          </span>
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: `hsl(${track.colorHsl})` }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default WaveformPlayer;
