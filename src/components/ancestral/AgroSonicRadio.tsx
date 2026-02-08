import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Speaker Icon with Sound Waves
const SpeakerIcon = ({ isPlaying, className = "" }: { isPlaying: boolean; className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    {/* Speaker cone */}
    <path 
      d="M6 12 L10 12 L16 6 L16 26 L10 20 L6 20 Z" 
      fill="currentColor"
    />
    
    {/* Sound waves - animated when playing */}
    <motion.path 
      d="M20 11 Q24 16, 20 21" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      fill="none"
      initial={{ opacity: isPlaying ? 0.3 : 0.2 }}
      animate={{ 
        opacity: isPlaying ? [0.3, 1, 0.3] : 0.2,
        pathLength: isPlaying ? [0.8, 1, 0.8] : 1,
      }}
      transition={{ 
        duration: 1.2, 
        repeat: isPlaying ? Infinity : 0,
        ease: "easeInOut" 
      }}
    />
    <motion.path 
      d="M24 7 Q30 16, 24 25" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      fill="none"
      initial={{ opacity: isPlaying ? 0.2 : 0.15 }}
      animate={{ 
        opacity: isPlaying ? [0.2, 0.8, 0.2] : 0.15,
        pathLength: isPlaying ? [0.6, 1, 0.6] : 1,
      }}
      transition={{ 
        duration: 1.5, 
        repeat: isPlaying ? Infinity : 0,
        delay: 0.2,
        ease: "easeInOut" 
      }}
    />
  </svg>
);

interface AgroSonicRadioProps {
  className?: string;
}

/**
 * AGRO-SONIC RADIO
 * 
 * A 432Hz ambient sound toggle inspired by Jamaican Dub/Sound System culture.
 * Creates a lo-fi beat atmosphere for focused farming work.
 */
const AgroSonicRadio = ({ className = "" }: AgroSonicRadioProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize and manage audio
  const toggleAudio = () => {
    if (isPlaying) {
      // Stop audio
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContextRef.current.currentTime + 0.5
        );
        setTimeout(() => {
          oscillatorRef.current?.stop();
          oscillatorRef.current = null;
        }, 500);
      }
      setIsPlaying(false);
    } else {
      // Start audio - 432Hz ambient drone
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        
        // Create oscillator at 432Hz (the "natural" frequency)
        oscillatorRef.current = audioContextRef.current.createOscillator();
        oscillatorRef.current.type = 'sine';
        oscillatorRef.current.frequency.setValueAtTime(432, audioContextRef.current.currentTime);
        
        // Create gain node for volume control
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.setValueAtTime(0.0001, audioContextRef.current.currentTime);
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.08, audioContextRef.current.currentTime + 1);
        
        // Add subtle LFO for organic feel
        const lfo = audioContextRef.current.createOscillator();
        const lfoGain = audioContextRef.current.createGain();
        lfo.frequency.setValueAtTime(0.5, audioContextRef.current.currentTime);
        lfoGain.gain.setValueAtTime(2, audioContextRef.current.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscillatorRef.current.frequency);
        lfo.start();
        
        // Connect and start
        oscillatorRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(audioContextRef.current.destination);
        oscillatorRef.current.start();
        
        setIsPlaying(true);
      } catch (error) {
        console.error('Audio playback failed:', error);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscillatorRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          className={`relative flex items-center justify-center p-2 rounded-full transition-colors ${className}`}
          style={{
            background: isPlaying 
              ? 'linear-gradient(135deg, hsl(140 50% 20%), hsl(140 40% 15%))'
              : 'hsl(20 30% 12% / 0.9)',
            border: isPlaying 
              ? '1px solid hsl(140 60% 40%)'
              : '1px solid hsl(40 40% 30%)',
            boxShadow: isPlaying 
              ? '0 0 20px hsl(140 60% 35% / 0.4)'
              : 'none',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleAudio}
        >
          <div 
            className="w-5 h-5"
            style={{
              color: isPlaying ? 'hsl(140 70% 55%)' : 'hsl(40 30% 50%)',
            }}
          >
            <SpeakerIcon isPlaying={isPlaying} className="w-full h-full" />
          </div>
          
          {/* Pulse ring when playing */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '2px solid hsl(140 60% 50%)',
                }}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}
          </AnimatePresence>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className="font-body text-xs"
        style={{
          background: 'hsl(20 30% 15%)',
          border: '1px solid hsl(30 40% 35%)',
          color: 'hsl(40 50% 80%)',
        }}
      >
        <p className="font-bold">Tune the Frequency (432Hz)</p>
        <p className="text-[10px] opacity-60" style={{ fontFamily: 'Staatliches, sans-serif' }}>
          Jamaica (Dub / Sound System)
        </p>
        <p className="text-[10px] opacity-40 mt-1">
          {isPlaying ? 'Click to mute' : 'Click to play'}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AgroSonicRadio;
