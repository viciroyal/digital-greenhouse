import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Music, X, ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { trackData, type TrackData } from '@/data/trackData';
import { Slider } from '@/components/ui/slider';
import pharmbotArtwork from '@/assets/pharmboi-artwork.png';

/**
 * MINI MUSIC PLAYER
 * A compact, collapsible album player for the Crop Oracle page.
 */

const CRATE_LABELS: Record<string, { name: string; colorHsl: string }> = {
  root: { name: 'THE ROOT', colorHsl: '0 60% 35%' },
  flow: { name: 'THE FLOW', colorHsl: '45 90% 55%' },
  signal: { name: 'THE SIGNAL', colorHsl: '210 70% 55%' },
  crown: { name: 'THE CROWN', colorHsl: '280 60% 55%' },
};

const getCrateForTrack = (row: number): string => {
  if (row <= 3) return 'root';
  if (row <= 6) return 'flow';
  if (row <= 9) return 'signal';
  return 'crown';
};

const formatTime = (time: number) => {
  if (!time || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const MiniMusicPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onMeta = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnd = () => {
      if (currentTrack) {
        const next = currentTrack.row < 12 ? currentTrack.row + 1 : 1;
        const nextTrack = trackData.find(t => t.row === next);
        if (nextTrack) setCurrentTrack(nextTrack);
        else setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
    };
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioUrl) return;
    audio.src = currentTrack.audioUrl;
    audio.load();
    if (isPlaying) audio.play().catch(console.error);
  }, [currentTrack?.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && currentTrack?.audioUrl) audio.play().catch(console.error);
    else audio.pause();
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const playTrack = (track: TrackData) => {
    if (currentTrack?.row === track.row) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipPrev = () => {
    if (!currentTrack) return;
    const prev = currentTrack.row > 1 ? currentTrack.row - 1 : 12;
    const t = trackData.find(tr => tr.row === prev);
    if (t) { setCurrentTrack(t); setIsPlaying(true); }
  };

  const skipNext = () => {
    if (!currentTrack) return;
    const next = currentTrack.row < 12 ? currentTrack.row + 1 : 1;
    const t = trackData.find(tr => tr.row === next);
    if (t) { setCurrentTrack(t); setIsPlaying(true); }
  };

  const trackColor = currentTrack?.colorHsl || '270 60% 55%';

  return (
    <>
      {/* Floating Music Trigger */}
      {!isOpen && (
        <motion.button
          className="fixed bottom-32 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 15px hsl(270 50% 35% / 0.3)',
              '0 0 30px hsl(270 50% 45% / 0.5)',
              '0 0 15px hsl(270 50% 35% / 0.3)',
            ],
          }}
          transition={{ boxShadow: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
          style={{
            background: 'linear-gradient(135deg, hsl(270 40% 18%), hsl(280 35% 12%))',
            border: '2px solid hsl(270 40% 35%)',
          }}
        >
          <Music className="w-5 h-5" style={{ color: 'hsl(270 60% 70%)' }} />
        </motion.button>
      )}

      {/* Player Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-4 bottom-4 z-50 rounded-2xl overflow-hidden"
            style={{
              width: '320px',
              background: 'linear-gradient(180deg, hsl(20 30% 10% / 0.97) 0%, hsl(20 25% 6% / 0.99) 100%)',
              backdropFilter: 'blur(20px)',
              border: `1px solid hsl(${trackColor} / 0.3)`,
              boxShadow: `0 0 40px hsl(${trackColor} / 0.15), 0 20px 40px rgba(0,0,0,0.5)`,
            }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: `1px solid hsl(${trackColor} / 0.2)` }}
            >
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4" style={{ color: `hsl(${trackColor})` }} />
                <span
                  className="font-mono text-xs tracking-wider uppercase"
                  style={{ color: 'hsl(40 50% 85%)' }}
                >
                  PHARMBOI
                </span>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-full"
                  style={{ color: 'hsl(40 50% 60%)' }}
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-full"
                  style={{ color: 'hsl(40 50% 60%)' }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Now Playing */}
            {currentTrack && (
              <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid hsl(${trackColor} / 0.15)` }}>
                <motion.div
                  className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                  style={{
                    border: `2px solid hsl(${trackColor} / 0.5)`,
                    boxShadow: `0 0 12px hsl(${trackColor} / 0.3)`,
                  }}
                  animate={isPlaying ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <img src={pharmbotArtwork} alt="Album Art" className="w-full h-full object-cover" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm truncate" style={{ color: `hsl(${trackColor})` }}>
                    {currentTrack.track}
                  </p>
                  <p className="font-mono text-[10px] truncate" style={{ color: 'hsl(40 50% 60%)' }}>
                    {currentTrack.featuring ? `ft. ${currentTrack.featuring}` : 'Vici Royàl'}
                  </p>
                </div>
              </div>
            )}

            {/* Transport Controls */}
            <div className="px-4 py-3">
              {/* Progress */}
              {currentTrack && (
                <div className="mb-2">
                  <Slider
                    value={[duration ? (currentTime / duration) * 100 : 0]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[9px]" style={{ color: 'hsl(40 50% 50%)' }}>{formatTime(currentTime)}</span>
                    <span className="font-mono text-[9px]" style={{ color: 'hsl(40 50% 50%)' }}>{formatTime(duration)}</span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-center gap-3">
                <motion.button
                  onClick={() => setIsMuted(!isMuted)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded-full"
                  style={{ color: isMuted ? 'hsl(40 30% 45%)' : `hsl(${trackColor})` }}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  onClick={skipPrev}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full"
                  style={{ background: 'hsl(20 30% 18%)', color: 'hsl(40 50% 70%)' }}
                >
                  <SkipBack className="w-4 h-4" />
                </motion.button>

                <motion.button
                  onClick={() => {
                    if (!currentTrack) {
                      const first = trackData[0];
                      if (first) { setCurrentTrack(first); setIsPlaying(true); }
                    } else {
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full"
                  style={{
                    background: isPlaying
                      ? `linear-gradient(135deg, hsl(${trackColor}), hsl(${trackColor} / 0.7))`
                      : 'hsl(20 30% 18%)',
                    boxShadow: `0 0 15px hsl(${trackColor} / 0.3)`,
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" style={{ color: 'hsl(20 30% 8%)' }} />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" style={{ color: 'hsl(40 50% 85%)' }} />
                  )}
                </motion.button>

                <motion.button
                  onClick={skipNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full"
                  style={{ background: 'hsl(20 30% 18%)', color: 'hsl(40 50% 70%)' }}
                >
                  <SkipForward className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Expanded Track List */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-3 py-2 max-h-64 overflow-y-auto"
                    style={{ borderTop: `1px solid hsl(${trackColor} / 0.15)` }}
                  >
                    {trackData.map((track) => {
                      const crate = getCrateForTrack(track.row);
                      const crateInfo = CRATE_LABELS[crate];
                      const isActive = currentTrack?.row === track.row;

                      return (
                        <motion.button
                          key={track.row}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors"
                          style={{
                            background: isActive ? `hsl(${track.colorHsl} / 0.15)` : 'transparent',
                            borderLeft: isActive ? `3px solid hsl(${track.colorHsl})` : '3px solid transparent',
                          }}
                          onClick={() => playTrack(track)}
                          whileHover={{ backgroundColor: `hsl(${track.colorHsl} / 0.08)` }}
                        >
                          <span className="font-mono text-[10px] w-5 text-center" style={{ color: `hsl(${track.colorHsl})` }}>
                            {String(track.row).padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs truncate"
                              style={{
                                color: isActive ? `hsl(${track.colorHsl})` : 'hsl(40 50% 80%)',
                                fontFamily: "'Staatliches', cursive",
                              }}
                            >
                              {track.track}
                            </p>
                          </div>
                          {isActive && isPlaying && (
                            <div className="flex gap-0.5 items-center">
                              {[0, 1, 2].map(i => (
                                <motion.div
                                  key={i}
                                  className="w-0.5 rounded-full"
                                  style={{ background: `hsl(${track.colorHsl})` }}
                                  animate={{ height: [3, 10, 3] }}
                                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                                />
                              ))}
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />
    </>
  );
};

export default MiniMusicPlayer;
