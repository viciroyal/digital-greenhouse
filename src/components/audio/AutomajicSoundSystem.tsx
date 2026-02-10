import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackData, type TrackData } from '@/data/trackData';
import { Play, Pause, Radio, ChevronRight, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import pharmbotArtwork from '@/assets/pharmboi-artwork.png';
import { getCrateTexture, SpeakerMeshPattern, SankofaBirdSvg } from './CulturalTextures';
import WhisperTooltip from '@/components/ui/WhisperTooltip';
import TrackDetailView from '@/components/TrackDetailView';
import { Slider } from '@/components/ui/slider';
/**
 * THE AUTOMAJIC SOUND SYSTEM
 * 
 * Organizes the PHARMBOI album into 4 frequency crates:
 * - THE ROOT (396Hz) - Tracks 1-3 - Bogolan/Mud Cloth texture
 * - THE FLOW (528Hz) - Tracks 4-6 - Inca Stone Wall texture
 * - THE SIGNAL (741Hz) - Tracks 7-9 - Star Chart/Dogon texture
 * - THE CROWN (963Hz) - Tracks 10-12 - Flower of Life texture
 * 
 * PRESERVATION MODE: All track titles and colors remain unchanged.
 * CULTURAL WATERMARKS: Ancestral textures overlaid at subliminal opacity.
 */

interface CrateConfig {
  id: string;
  name: string;
  frequency: string;
  colorHsl: string;
  tracks: number[];
  whisper: string;
}

const CRATES: CrateConfig[] = [
  {
    id: 'root',
    name: 'THE ROOT',
    frequency: '396Hz',
    colorHsl: '0 60% 35%', // From Track 1: chakra-root - PRESERVED
    tracks: [1, 2, 3],
    whisper: 'The Root (396Hz) - Survival',
  },
  {
    id: 'flow',
    name: 'THE FLOW',
    frequency: '528Hz',
    colorHsl: '45 90% 55%', // From Track 3: chakra-solar (528Hz) - PRESERVED
    tracks: [4, 5, 6],
    whisper: 'The Flow (528Hz) - Healing',
  },
  {
    id: 'signal',
    name: 'THE SIGNAL',
    frequency: '741Hz',
    colorHsl: '210 70% 55%', // From Track 7: chakra-throat - PRESERVED
    tracks: [7, 8, 9],
    whisper: 'The Signal (741Hz) - Logic',
  },
  {
    id: 'crown',
    name: 'THE CROWN',
    frequency: '963Hz',
    colorHsl: '280 60% 55%', // From Track 9/10: chakra-vision - PRESERVED
    tracks: [10, 11, 12],
    whisper: 'The Crown (963Hz) - Alchemy',
  },
];

interface TrackItemProps {
  track: TrackData;
  crateColor: string;
  isPlaying: boolean;
  onPlay: () => void;
  onOpenDetail: () => void;
}

const TrackItem = ({ track, crateColor, isPlaying, onPlay, onOpenDetail }: TrackItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  // Use each track's individual color from trackData for the "garden" aesthetic
  const trackColor = track.colorHsl;

  return (
    <motion.div
      className="relative px-4 py-3 rounded-xl cursor-pointer transition-all duration-300"
      style={{
        background: isHovered 
          ? `linear-gradient(135deg, hsl(${trackColor} / 0.3), hsl(${trackColor} / 0.15))`
          : 'hsl(20 30% 12% / 0.5)',
        border: isHovered 
          ? `1px solid hsl(${trackColor} / 0.5)`
          : '1px solid hsl(20 30% 25% / 0.3)',
        boxShadow: isHovered 
          ? `0 0 20px hsl(${trackColor} / 0.3), inset 0 0 15px hsl(${trackColor} / 0.1)`
          : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpenDetail}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Track Number - Uses individual track color */}
          <span 
            className="font-mono text-sm w-6 text-center"
            style={{ color: `hsl(${trackColor})` }}
          >
            {String(track.row).padStart(2, '0')}
          </span>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <p 
              className="font-display text-base truncate"
              style={{ 
                color: isHovered ? `hsl(${trackColor})` : 'hsl(40 50% 90%)',
                textShadow: isHovered ? `0 0 10px hsl(${trackColor} / 0.5)` : 'none',
              }}
            >
              {track.track}
            </p>
            {track.featuring && (
              <p className="font-mono text-xs text-cream-muted/60 truncate">
                ft. {track.featuring}
              </p>
            )}
          </div>
        </div>

        {/* Play Button - Uses individual track color */}
        <motion.button
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: isPlaying 
              ? `linear-gradient(135deg, hsl(${trackColor}), hsl(${trackColor} / 0.7))`
              : 'hsl(20 30% 18%)',
          }}
          animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-background" />
          ) : (
            <Play className="w-4 h-4 text-cream/60 ml-0.5" />
          )}
        </motion.button>

        {/* Detail Arrow - Uses individual track color */}
        <motion.div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ 
            background: `hsl(${trackColor} / 0.2)`,
            opacity: isHovered ? 1 : 0,
          }}
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <ChevronRight className="w-4 h-4" style={{ color: `hsl(${trackColor})` }} />
        </motion.div>
      </div>

      {/* Frequency Badge - Uses individual track color */}
      <div 
        className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full font-mono text-[10px]"
        style={{
          background: `hsl(${trackColor} / 0.2)`,
          color: `hsl(${trackColor})`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      >
        {track.frequency}
      </div>
    </motion.div>
  );
};

interface CrateProps {
  config: CrateConfig;
  tracks: TrackData[];
  currentTrack: TrackData | null;
  onPlayTrack: (track: TrackData) => void;
  onOpenDetail: (track: TrackData) => void;
}

const Crate = ({ config, tracks, currentTrack, onPlayTrack, onOpenDetail }: CrateProps) => {
  const texture = getCrateTexture(config.id);
  
  return (
    <WhisperTooltip whisper={config.whisper} position="top" display="block">
      <motion.div
        className="relative rounded-2xl p-4 overflow-hidden"
        style={{
          background: `linear-gradient(145deg, hsl(${config.colorHsl} / 0.15), hsl(${config.colorHsl} / 0.05))`,
          border: `2px solid hsl(${config.colorHsl} / 0.3)`,
          boxShadow: `0 4px 20px hsl(${config.colorHsl} / 0.1), inset 0 1px 0 hsl(${config.colorHsl} / 0.1)`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
      {/* Cultural Texture Overlay - THE VISUAL CONSTITUTION */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: texture.pattern,
          backgroundRepeat: 'repeat',
          opacity: texture.opacity,
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Darkroom Overlay for legibility */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'hsl(0 0% 0% / 0.15)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Crate Header */}
      <div className="relative flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: `hsl(${config.colorHsl} / 0.2)` }}>
        <div>
          <h3 
            className="font-display text-lg"
            style={{ 
              color: `hsl(${config.colorHsl})`,
              textShadow: `0 0 15px hsl(${config.colorHsl} / 0.5)`,
            }}
          >
            {config.name}
          </h3>
          <p className="font-mono text-xs text-cream-muted/50">
            {config.frequency} · TRACKS {config.tracks[0]}-{config.tracks[config.tracks.length - 1]}
          </p>
          {/* Cultural concept tooltip on hover */}
          <p className="font-mono text-[9px] text-cream-muted/30 italic mt-1">
            "{texture.concept}"
          </p>
        </div>

        {/* Frequency Icon */}
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, hsl(${config.colorHsl} / 0.3), transparent)`,
            boxShadow: `0 0 20px hsl(${config.colorHsl} / 0.3)`,
          }}
        >
          <Radio 
            className="w-5 h-5" 
            style={{ color: `hsl(${config.colorHsl})` }} 
          />
        </div>
      </div>

      {/* Track List */}
      <div className="relative space-y-2">
        {tracks.map((track) => (
          <TrackItem
            key={track.row}
            track={track}
            crateColor={config.colorHsl}
            isPlaying={currentTrack?.row === track.row}
            onPlay={() => onPlayTrack(track)}
            onOpenDetail={() => onOpenDetail(track)}
          />
        ))}
      </div>

      {/* Ambient Glow */}
      <div 
        className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: `hsl(${config.colorHsl} / 0.15)` }}
      />
    </motion.div>
    </WhisperTooltip>
  );
};

interface NowPlayingProps {
  track: TrackData | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  currentTime: number;
  duration: number;
  onSeek: (value: number[]) => void;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
}

const formatTime = (time: number) => {
  if (!time || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const NowPlaying = ({ 
  track, 
  isPlaying, 
  onTogglePlay, 
  audioRef,
  currentTime,
  duration,
  onSeek,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  onPrevTrack,
  onNextTrack,
}: NowPlayingProps) => {
  const isMobile = useIsMobile();

  return (
    <AnimatePresence>
      {track && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, hsl(20 30% 8% / 0.98), hsl(20 25% 10% / 0.95))`,
              backdropFilter: 'blur(20px)',
              borderTop: `1px solid hsl(${track.colorHsl} / 0.3)`,
            }}
          />
          
          {/* Speaker Mesh Overlay - Sound System aesthetic */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: SpeakerMeshPattern,
              backgroundRepeat: 'repeat',
              opacity: 0.04,
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* Sankofa Bird Watermark - "Go back and fetch it" */}
          <div 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 pointer-events-none"
            style={{ 
              color: `hsl(${track.colorHsl} / 0.15)`,
            }}
          >
            <SankofaBirdSvg />
          </div>

          <div className={`relative px-4 py-3 max-w-6xl mx-auto ${isMobile ? 'flex-col' : 'flex items-center justify-between'} flex gap-4`}>
            {/* Album Art + Track Info */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <motion.div 
                className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                style={{
                  boxShadow: `0 0 20px hsl(${track.colorHsl} / 0.4)`,
                  border: `2px solid hsl(${track.colorHsl} / 0.5)`,
                }}
                animate={isPlaying ? { rotate: [0, 360] } : {}}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <img 
                  src={pharmbotArtwork} 
                  alt="PHARMBOI Album Art"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="min-w-0">
                <p 
                  className="font-display text-base truncate"
                  style={{ color: `hsl(${track.colorHsl})` }}
                >
                  {track.track}
                </p>
                <p className="font-mono text-xs text-cream-muted/60 truncate">
                  {track.featuring ? `ft. ${track.featuring}` : 'Vici Royàl'}
                </p>
                <p className="font-mono text-[10px] text-cream-muted/40">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </p>
              </div>
            </div>

            {/* Progress Bar + Waveform (Desktop) */}
            {!isMobile && (
              <div className="flex-1 flex items-center gap-3 max-w-md">
                {/* Waveform Visualizer */}
                <div className="flex items-center gap-0.5 h-8 flex-shrink-0">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full"
                      style={{ background: `hsl(${track.colorHsl})` }}
                      animate={isPlaying ? {
                        height: [4, Math.random() * 24 + 4, 4],
                      } : { height: 4 }}
                      transition={{
                        duration: 0.3 + Math.random() * 0.3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.03,
                      }}
                    />
                  ))}
                </div>

                {/* Progress Slider */}
                <div className="flex-1">
                  <Slider
                    value={[duration ? (currentTime / duration) * 100 : 0]}
                    onValueChange={onSeek}
                    max={100}
                    step={0.1}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Transport Controls */}
            <div className="flex items-center gap-2">
              {/* Volume (Desktop only) */}
              {!isMobile && (
                <div className="flex items-center gap-2 mr-2">
                  <motion.button
                    className="p-1.5 rounded-full"
                    style={{ color: isMuted ? 'hsl(40 30% 45%)' : `hsl(${track.colorHsl})` }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onToggleMute}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </motion.button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={onVolumeChange}
                    max={100}
                    step={1}
                    className="w-16"
                  />
                </div>
              )}

              {/* Skip Back */}
              <motion.button
                className="p-2 rounded-full"
                style={{ background: 'hsl(20 30% 18%)', color: 'hsl(40 50% 70%)' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPrevTrack}
              >
                <SkipBack className="w-4 h-4" />
              </motion.button>

              {/* Play/Pause */}
              <motion.button
                className="p-3 rounded-full"
                style={{
                  background: isPlaying 
                    ? `linear-gradient(135deg, hsl(${track.colorHsl}), hsl(${track.colorHsl} / 0.7))`
                    : 'hsl(20 30% 18%)',
                  boxShadow: `0 0 20px hsl(${track.colorHsl} / 0.3)`,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onTogglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-background" />
                ) : (
                  <Play className="w-6 h-6 text-cream ml-0.5" />
                )}
              </motion.button>

              {/* Skip Forward */}
              <motion.button
                className="p-2 rounded-full"
                style={{ background: 'hsl(20 30% 18%)', color: 'hsl(40 50% 70%)' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNextTrack}
              >
                <SkipForward className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AutomajicSoundSystem = () => {
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMobile = useIsMobile();

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      // Auto-play next track
      if (currentTrack) {
        const nextTrackNum = currentTrack.row < 12 ? currentTrack.row + 1 : 1;
        const nextTrack = trackData.find(t => t.row === nextTrackNum);
        if (nextTrack) {
          setCurrentTrack(nextTrack);
        } else {
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  // Play/pause when isPlaying or track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && currentTrack?.audioUrl) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioUrl) return;
    
    audio.src = currentTrack.audioUrl;
    audio.load();
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentTrack?.audioUrl]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleOpenDetail = (track: TrackData) => {
    setSelectedTrack(track);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handlePlayTrack = (track: TrackData) => {
    if (currentTrack?.row === track.row) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    if (!currentTrack?.audioUrl) return;
    setIsPlaying(!isPlaying);
  };

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

  const handlePrevTrack = () => {
    if (!currentTrack) return;
    const prevTrackNum = currentTrack.row > 1 ? currentTrack.row - 1 : 12;
    const prevTrack = trackData.find(t => t.row === prevTrackNum);
    if (prevTrack) {
      setCurrentTrack(prevTrack);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (!currentTrack) return;
    const nextTrackNum = currentTrack.row < 12 ? currentTrack.row + 1 : 1;
    const nextTrack = trackData.find(t => t.row === nextTrackNum);
    if (nextTrack) {
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
    }
  };

  // Get tracks for each crate
  const getTracksForCrate = (crate: CrateConfig): TrackData[] => {
    return crate.tracks
      .map((trackNum) => trackData.find((t) => t.row === trackNum))
      .filter((t): t is TrackData => t !== undefined);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-display text-3xl md:text-4xl text-gem-topaz mb-2">
          THE AUTOMAJIC SOUND SYSTEM
        </h2>
        <p className="font-mono text-sm text-cream-muted/60">
          PHARMBOI · 12 TRACKS · 4 FREQUENCY CRATES
        </p>
        <p className="font-mono text-[10px] text-cream-muted/40 mt-1 italic">
          "The Sound System of the Ancestors: Go back and fetch it."
        </p>
      </motion.div>

      {/* Speaker Mesh Background Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: SpeakerMeshPattern,
          backgroundRepeat: 'repeat',
          opacity: 0.02,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Crates Grid */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} pb-24`}>
        {CRATES.map((crate, index) => (
          <motion.div
            key={crate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Crate
              config={crate}
              tracks={getTracksForCrate(crate)}
              currentTrack={currentTrack}
              onOpenDetail={handleOpenDetail}
              onPlayTrack={handlePlayTrack}
            />
          </motion.div>
        ))}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Now Playing Footer */}
      <NowPlaying
        track={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        audioRef={audioRef}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={handleVolumeChange}
        onToggleMute={() => setIsMuted(!isMuted)}
        onPrevTrack={handlePrevTrack}
        onNextTrack={handleNextTrack}
      />

      {/* Track Detail View Modal */}
      <TrackDetailView
        track={selectedTrack}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onSwitchTrack={(track) => {
          setSelectedTrack(track);
          handlePlayTrack(track);
        }}
        isPlaying={isPlaying && currentTrack?.row === selectedTrack?.row}
        onTogglePlay={handleTogglePlay}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        onPlayTrack={handlePlayTrack}
      />
    </div>
  );
};

export default AutomajicSoundSystem;
