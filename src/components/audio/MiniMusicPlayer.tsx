import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Music, X, ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { trackData, type TrackData } from '@/data/trackData';
import { Slider } from '@/components/ui/slider';
import pharmbotArtwork from '@/assets/pharmboi-artwork.png';
import { usePlayback } from '@/contexts/PlaybackContext';

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
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    currentTrack, isPlaying, currentTime, duration, volume, isMuted,
    playTrack, togglePlay, seek, setVolume, toggleMute, skipPrev, skipNext, setIsMuted,
  } = usePlayback();

  const handleSeek = (value: number[]) => seek(value);
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
    if (value[0] > 0) setIsMuted(false);
  };

  const trackColor = currentTrack?.colorHsl || '270 60% 55%';

  return (
    <>
      {/* Floating Music Trigger — matches Stage aesthetic */}
      {!isOpen && (
        <motion.button
          className="fixed bottom-8 right-6 z-50 w-16 h-16 rounded-full overflow-hidden flex items-center justify-center group"
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, hsl(350 75% 45%) 0%, hsl(280 60% 35%) 50%, hsl(220 60% 35%) 100%)',
            border: '2px solid hsl(40 50% 75% / 0.3)',
            color: 'hsl(40 50% 95%)',
          }}
          animate={{
            boxShadow: [
              '0 0 20px hsl(350 75% 50% / 0.3), inset 0 1px 0 hsl(40 50% 90% / 0.15)',
              '0 0 40px hsl(280 60% 50% / 0.5), inset 0 1px 0 hsl(40 50% 90% / 0.15)',
              '0 0 20px hsl(350 75% 50% / 0.3), inset 0 1px 0 hsl(40 50% 90% / 0.15)',
            ],
          }}
          transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(40 50% 90%), transparent)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.5 }}
          />
          <Music className="w-7 h-7 relative z-10" />
          {/* Tooltip */}
          <div
            className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
            style={{
              background: 'hsl(220 40% 10% / 0.9)',
              border: '1px solid hsl(350 60% 45%)',
              color: 'hsl(350 60% 75%)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              fontFamily: 'Space Mono, monospace',
            }}
          >
            Sound System — Music Player
          </div>
        </motion.button>
      )}

      {/* Player Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-4 bottom-4 z-50 rounded-2xl overflow-hidden"
            style={{
              width: '340px',
              background: 'linear-gradient(180deg, hsl(20 30% 10% / 0.97) 0%, hsl(20 25% 6% / 0.99) 100%)',
              backdropFilter: 'blur(24px)',
              border: `1px solid hsl(${trackColor} / 0.3)`,
              boxShadow: `0 0 50px hsl(${trackColor} / 0.15), 0 25px 50px rgba(0,0,0,0.6)`,
            }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: `1px solid hsl(${trackColor} / 0.2)` }}
            >
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4" style={{ color: `hsl(${trackColor})` }} />
                <span className="font-mono text-xs tracking-wider uppercase" style={{ color: 'hsl(40 50% 85%)' }}>
                  PHARMBOI
                </span>
              </div>
              <div className="flex items-center gap-1">
                <motion.button onClick={() => setIsExpanded(!isExpanded)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-1.5 rounded-full" style={{ color: 'hsl(40 50% 60%)' }}>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </motion.button>
                <motion.button onClick={() => setIsOpen(false)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-1.5 rounded-full" style={{ color: 'hsl(40 50% 60%)' }}>
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Now Playing */}
            {currentTrack && (
              <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: `1px solid hsl(${trackColor} / 0.15)` }}>
                <motion.div
                  className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                  style={{
                    border: `2px solid hsl(${trackColor} / 0.5)`,
                    boxShadow: `0 0 20px hsl(${trackColor} / 0.3)`,
                  }}
                  animate={isPlaying ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <img src={pharmbotArtwork} alt="Album Art" className="w-full h-full object-cover" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm truncate" style={{ color: `hsl(${trackColor})` }}>{currentTrack.track}</p>
                  <p className="font-mono text-xs truncate" style={{ color: 'hsl(40 50% 60%)' }}>
                    {currentTrack.featuring ? `ft. ${currentTrack.featuring}` : 'Vici Royàl'}
                  </p>
                  <p className="font-mono text-[10px] mt-0.5" style={{ color: 'hsl(40 50% 45%)' }}>
                    {currentTrack.frequency}
                  </p>
                </div>

                {/* Waveform Visualizer */}
                <div className="flex items-center gap-0.5 h-8 flex-shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 rounded-full"
                      style={{ background: `hsl(${trackColor})` }}
                      animate={isPlaying ? { height: [4, Math.random() * 20 + 4, 4] } : { height: 4 }}
                      transition={{ duration: 0.3 + Math.random() * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Transport Controls */}
            <div className="px-4 py-3">
              {/* Progress */}
              {currentTrack && (
                <div className="mb-3">
                  <Slider value={[duration ? (currentTime / duration) * 100 : 0]} onValueChange={handleSeek} max={100} step={0.1} className="cursor-pointer" />
                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[10px]" style={{ color: 'hsl(40 50% 50%)' }}>{formatTime(currentTime)}</span>
                    <span className="font-mono text-[10px]" style={{ color: 'hsl(40 50% 50%)' }}>{formatTime(duration)}</span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-center gap-3">
                <motion.button onClick={toggleMute} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-1.5 rounded-full" style={{ color: isMuted ? 'hsl(40 30% 45%)' : `hsl(${trackColor})` }}>
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </motion.button>

                {/* Volume Slider */}
                <div className="w-14">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>

                <motion.button onClick={skipPrev} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2.5 rounded-full" style={{ background: 'hsl(20 30% 18%)', color: 'hsl(40 50% 70%)' }}>
                  <SkipBack className="w-5 h-5" />
                </motion.button>

                <motion.button
                  onClick={() => {
                    if (!currentTrack) {
                      const first = trackData[0];
                      if (first) playTrack(first);
                    } else {
                      togglePlay();
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3.5 rounded-full"
                  style={{
                    background: isPlaying
                      ? `linear-gradient(135deg, hsl(${trackColor}), hsl(${trackColor} / 0.7))`
                      : 'hsl(20 30% 18%)',
                    boxShadow: `0 0 20px hsl(${trackColor} / 0.3)`,
                  }}
                >
                  {isPlaying ? <Pause className="w-5 h-5" style={{ color: 'hsl(20 30% 8%)' }} /> : <Play className="w-5 h-5 ml-0.5" style={{ color: 'hsl(40 50% 85%)' }} />}
                </motion.button>

                <motion.button onClick={skipNext} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2.5 rounded-full" style={{ background: 'hsl(20 30% 18%)', color: 'hsl(40 50% 70%)' }}>
                  <SkipForward className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Expanded Track List */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-3 py-2 max-h-72 overflow-y-auto" style={{ borderTop: `1px solid hsl(${trackColor} / 0.15)` }}>
                    {trackData.map((track) => {
                      const isActive = currentTrack?.row === track.row;
                      return (
                        <motion.button
                          key={track.row}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors"
                          style={{
                            background: isActive ? `hsl(${track.colorHsl} / 0.15)` : 'transparent',
                            borderLeft: isActive ? `3px solid hsl(${track.colorHsl})` : '3px solid transparent',
                          }}
                          onClick={() => playTrack(track)}
                          whileHover={{ backgroundColor: `hsl(${track.colorHsl} / 0.08)` }}
                        >
                          <span className="font-mono text-xs w-6 text-center" style={{ color: `hsl(${track.colorHsl})` }}>
                            {String(track.row).padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate" style={{ color: isActive ? `hsl(${track.colorHsl})` : 'hsl(40 50% 80%)', fontFamily: "'Staatliches', cursive" }}>
                              {track.track}
                            </p>
                            {track.featuring && (
                              <p className="font-mono text-[10px] truncate" style={{ color: 'hsl(40 50% 50%)' }}>ft. {track.featuring}</p>
                            )}
                          </div>
                          {isActive && isPlaying && (
                            <div className="flex gap-0.5 items-center">
                              {[0, 1, 2].map(i => (
                                <motion.div key={i} className="w-0.5 rounded-full" style={{ background: `hsl(${track.colorHsl})` }} animate={{ height: [3, 12, 3] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
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
    </>
  );
};

export default MiniMusicPlayer;
