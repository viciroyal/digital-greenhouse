import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface VibrationalAudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  frequency?: string;
  colorHsl?: string;
  onPrevTrack?: () => void;
  onNextTrack?: () => void;
}

const VibrationalAudioPlayer = ({ 
  src, 
  title = "Pulling Weeds",
  artist = "Vici Royàl",
  frequency = "396Hz",
  colorHsl = "0 70% 50%"
}: VibrationalAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // Generate waveform visualization data
  useEffect(() => {
    const bars = 64;
    const data = Array.from({ length: bars }, (_, i) => {
      const position = i / bars;
      const wave1 = Math.sin(position * Math.PI * 6) * 0.3;
      const wave2 = Math.sin(position * Math.PI * 12) * 0.2;
      const wave3 = Math.sin(position * Math.PI * 3) * 0.4;
      const base = 0.3 + Math.random() * 0.2;
      return Math.min(1, Math.max(0.15, base + wave1 + wave2 + wave3));
    });
    setWaveformData(data);
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      await audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
    if (value[0] > 0) setIsMuted(false);
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(${colorHsl} / 0.15) 0%, hsl(20 25% 8%) 50%, hsl(${colorHsl} / 0.1) 100%)`,
        border: `1px solid hsl(${colorHsl} / 0.3)`,
        boxShadow: `0 0 40px hsl(${colorHsl} / 0.15), inset 0 1px 0 hsl(40 50% 90% / 0.05)`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Ambient glow effect */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, hsl(${colorHsl} / 0.2) 0%, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2"
              style={{
                background: `hsl(${colorHsl} / 0.2)`,
                border: `1px solid hsl(${colorHsl} / 0.4)`,
              }}
            >
              <span 
                className="text-[10px] font-mono tracking-widest uppercase"
                style={{ color: `hsl(${colorHsl})` }}
              >
                VIBRATIONAL PLAYER
              </span>
              <span className="text-[10px] font-mono" style={{ color: 'hsl(40 50% 75%)' }}>
                {frequency}
              </span>
            </motion.div>
            
            <h3 
              className="text-2xl md:text-3xl font-display"
              style={{ 
                color: 'hsl(40 50% 95%)',
                textShadow: `0 0 20px hsl(${colorHsl} / 0.4)`,
              }}
            >
              {title}
            </h3>
            <p className="text-sm font-mono" style={{ color: 'hsl(40 40% 65%)' }}>
              by <strong style={{ color: `hsl(${colorHsl})` }}>{artist}</strong>
            </p>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: `hsl(${colorHsl})` }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs font-mono" style={{ color: 'hsl(40 30% 55%)' }}>
                Loading...
              </span>
            </div>
          )}
        </div>

        {/* Waveform Visualizer */}
        <div 
          className="relative h-20 md:h-24 rounded-xl overflow-hidden mb-6"
          style={{ background: 'hsl(0 0% 0% / 0.3)' }}
        >
          {/* Progress overlay */}
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{ 
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, hsl(${colorHsl} / 0.4), hsl(${colorHsl} / 0.2))`,
            }}
          />

          {/* Waveform bars */}
          <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-2">
            {waveformData.map((height, i) => {
              const isActive = (i / waveformData.length) * 100 < progressPercent;
              return (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: '2px',
                    height: `${height * 85}%`,
                    backgroundColor: isActive ? `hsl(${colorHsl})` : `hsl(${colorHsl} / 0.3)`,
                  }}
                  animate={isPlaying ? {
                    scaleY: [1, 0.7 + Math.random() * 0.6, 1],
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
          <div className="absolute bottom-2 left-3 right-3 flex justify-between">
            <span className="text-[10px] font-mono" style={{ color: 'hsl(40 30% 55%)' }}>
              {formatTime(currentTime)}
            </span>
            <span className="text-[10px] font-mono" style={{ color: 'hsl(40 30% 55%)' }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Progress Slider */}
        <div className="mb-6">
          <Slider
            value={[progressPercent]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="cursor-pointer"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Left: Volume */}
          <div className="flex items-center gap-3 w-32">
            <motion.button
              className="p-2 rounded-full transition-colors"
              style={{ 
                color: isMuted ? 'hsl(40 30% 45%)' : `hsl(${colorHsl})`,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </motion.button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-20"
            />
          </div>

          {/* Center: Play controls */}
          <div className="flex items-center gap-4">
            <motion.button
              className="p-2 rounded-full transition-colors"
              style={{ color: 'hsl(40 30% 55%)' }}
              whileHover={{ scale: 1.1, color: `hsl(${colorHsl})` }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
            >
              <RotateCcw size={20} />
            </motion.button>

            <motion.button
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, hsl(${colorHsl}), hsl(${colorHsl} / 0.8))`,
                boxShadow: `0 0 30px hsl(${colorHsl} / 0.5)`,
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 0 40px hsl(${colorHsl} / 0.7)` }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              disabled={isLoading}
            >
              {isPlaying ? (
                <Pause size={28} color="hsl(20 25% 10%)" />
              ) : (
                <Play size={28} color="hsl(20 25% 10%)" style={{ marginLeft: 3 }} />
              )}
            </motion.button>

            {/* Placeholder for symmetry */}
            <div className="w-9" />
          </div>

          {/* Right: Frequency badge */}
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-mono"
            style={{
              background: 'hsl(0 0% 0% / 0.3)',
              color: `hsl(${colorHsl})`,
              border: `1px solid hsl(${colorHsl} / 0.3)`,
            }}
          >
            {frequency}
          </div>
        </div>

        {/* Resonance indicator */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              className="mt-6 flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: `hsl(${colorHsl})` }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'hsl(40 30% 55%)' }}>
                RESONATING
              </span>
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: `hsl(${colorHsl})` }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VibrationalAudioPlayer;
