import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { trackData, type TrackData } from '@/data/trackData';

interface PlaybackContextType {
  currentTrack: TrackData | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (track: TrackData) => void;
  togglePlay: () => void;
  setIsPlaying: (v: boolean) => void;
  seek: (value: number[]) => void;
  setVolume: (v: number) => void;
  setIsMuted: (v: boolean) => void;
  toggleMute: () => void;
  skipPrev: () => void;
  skipNext: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(trackData[0] || null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null!);

  // Auto-start on first user interaction
  useEffect(() => {
    if (hasAutoStarted) return;
    const startPlayback = () => {
      setHasAutoStarted(true);
      const audio = audioRef.current;
      if (audio && currentTrack?.audioUrl) {
        audio.src = currentTrack.audioUrl;
        audio.load();
        audio.play().catch(console.error);
      }
    };
    document.addEventListener('click', startPlayback, { once: true });
    document.addEventListener('keydown', startPlayback, { once: true });
    if (currentTrack?.audioUrl && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => setHasAutoStarted(true)).catch(() => {});
    }
    return () => {
      document.removeEventListener('click', startPlayback);
      document.removeEventListener('keydown', startPlayback);
    };
  }, [hasAutoStarted, currentTrack]);

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

  // Load new track source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioUrl) return;
    audio.src = currentTrack.audioUrl;
    audio.load();
    if (isPlaying) audio.play().catch(console.error);
  }, [currentTrack?.audioUrl]);

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && currentTrack?.audioUrl) audio.play().catch(console.error);
    else audio.pause();
  }, [isPlaying, currentTrack]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const playTrack = useCallback((track: TrackData) => {
    if (currentTrack?.row === track.row) {
      setIsPlaying(prev => !prev);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const togglePlay = useCallback(() => {
    if (!currentTrack?.audioUrl) return;
    setIsPlaying(prev => !prev);
  }, [currentTrack]);

  const seek = useCallback((value: number[]) => {
    if (audioRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [duration]);

  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);

  const skipPrev = useCallback(() => {
    if (!currentTrack) return;
    const prev = currentTrack.row > 1 ? currentTrack.row - 1 : 12;
    const t = trackData.find(tr => tr.row === prev);
    if (t) { setCurrentTrack(t); setIsPlaying(true); }
  }, [currentTrack]);

  const skipNext = useCallback(() => {
    if (!currentTrack) return;
    const next = currentTrack.row < 12 ? currentTrack.row + 1 : 1;
    const t = trackData.find(tr => tr.row === next);
    if (t) { setCurrentTrack(t); setIsPlaying(true); }
  }, [currentTrack]);

  return (
    <PlaybackContext.Provider value={{
      currentTrack, isPlaying, currentTime, duration, volume, isMuted,
      playTrack, togglePlay, setIsPlaying, seek,
      setVolume: setVolumeState, setIsMuted, toggleMute,
      skipPrev, skipNext, audioRef,
    }}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => {
  const ctx = useContext(PlaybackContext);
  if (!ctx) throw new Error('usePlayback must be used within PlaybackProvider');
  return ctx;
};
