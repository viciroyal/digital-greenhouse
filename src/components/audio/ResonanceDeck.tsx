import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Radio } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * THE RESONANCE DECK - Sticky Audio Player Footer
 * 
 * An analog frequency generator interface with:
 * - Rotary knobs (not sliders)
 * - Live waveform visualization
 * - Apothecary nomenclature
 */

interface KnobProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  size?: number;
}

const AnalogKnob = ({ value, onChange, label, min = 0, max = 100, size = 48 }: KnobProps) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startValue = useRef(0);

  const rotation = ((value - min) / (max - min)) * 270 - 135;

  const handleStart = (clientY: number) => {
    setIsDragging(true);
    startY.current = clientY;
    startValue.current = value;
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;
    const delta = startY.current - clientY;
    const range = max - min;
    const newValue = Math.max(min, Math.min(max, startValue.current + (delta / 100) * range));
    onChange(newValue);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);
    const onEnd = () => handleEnd();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        ref={knobRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{ width: size, height: size }}
        onMouseDown={(e) => handleStart(e.clientY)}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
      >
        {/* Knob body */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(145deg, hsl(20 30% 18%), hsl(20 25% 12%))',
            boxShadow: isDragging
              ? '0 0 15px hsl(45 80% 50% / 0.4), inset 0 2px 4px rgba(0,0,0,0.5)'
              : 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
            border: '2px solid hsl(20 30% 25%)',
          }}
        />
        
        {/* Knob indicator */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, hsl(20 25% 22%), hsl(20 20% 15%))',
          }}
          animate={{ rotate: rotation }}
        >
          <div
            className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-2 rounded-full"
            style={{ background: 'hsl(45 90% 60%)' }}
          />
        </motion.div>
        
        {/* Glow when active */}
        {isDragging && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: '0 0 20px hsl(45 80% 50% / 0.5)',
            }}
          />
        )}
      </div>
      <span className="text-[10px] font-mono text-cream-muted/60 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

const WaveformVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  const bars = 24;
  
  return (
    <div className="flex items-end gap-0.5 h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{
            background: 'linear-gradient(to top, hsl(45 80% 50%), hsl(350 70% 50%))',
          }}
          animate={isPlaying ? {
            height: [4, Math.random() * 28 + 4, 4],
          } : {
            height: 4,
          }}
          transition={{
            duration: 0.3 + Math.random() * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.02,
          }}
        />
      ))}
    </div>
  );
};

const ResonanceDeck = () => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [frequency, setFrequency] = useState(432);
  const [resonance, setResonance] = useState(50);

  // Show player after scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          {/* Backdrop blur */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, hsl(20 30% 8% / 0.98), hsl(20 25% 10% / 0.95))',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid hsl(45 50% 30% / 0.3)',
            }}
          />
          
          <div className="relative px-4 py-3 max-w-6xl mx-auto">
            <div className={`flex items-center ${isMobile ? 'flex-col gap-3' : 'justify-between'}`}>
              
              {/* Left: Track Info */}
              <div className={`flex items-center gap-3 ${isMobile ? 'w-full' : ''}`}>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(350 60% 35%), hsl(280 50% 30%))',
                    boxShadow: '0 0 20px hsl(350 70% 40% / 0.3)',
                  }}
                >
                  <Radio className="w-6 h-6 text-cream/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bubble text-gem-topaz truncate">
                    PHARMBOI - THE GARDEN
                  </p>
                  <p className="text-xs font-mono text-cream-muted/50">
                    DOSAGE IN PROGRESS
                  </p>
                </div>
              </div>

              {/* Center: Controls + Waveform */}
              <div className={`flex items-center gap-4 ${isMobile ? 'w-full justify-center' : ''}`}>
                {/* Transport Controls */}
                <div className="flex items-center gap-2">
                  <motion.button
                    className="p-2 rounded-full"
                    style={{ background: 'hsl(20 30% 15%)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SkipBack className="w-4 h-4 text-cream/70" />
                  </motion.button>
                  
                  <motion.button
                    className="p-3 rounded-full"
                    style={{
                      background: isPlaying 
                        ? 'linear-gradient(135deg, hsl(350 70% 45%), hsl(350 60% 35%))'
                        : 'linear-gradient(135deg, hsl(45 80% 50%), hsl(40 70% 40%))',
                      boxShadow: '0 0 20px hsl(45 80% 50% / 0.3)',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-background" />
                    ) : (
                      <Play className="w-5 h-5 text-background ml-0.5" />
                    )}
                  </motion.button>
                  
                  <motion.button
                    className="p-2 rounded-full"
                    style={{ background: 'hsl(20 30% 15%)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SkipForward className="w-4 h-4 text-cream/70" />
                  </motion.button>
                </div>

                {/* Waveform Visualizer */}
                {!isMobile && <WaveformVisualizer isPlaying={isPlaying} />}
              </div>

              {/* Right: Analog Knobs */}
              <div className={`flex items-center gap-4 ${isMobile ? 'w-full justify-center pt-2' : ''}`}>
                <AnalogKnob
                  value={volume}
                  onChange={setVolume}
                  label="POTENCY"
                  size={isMobile ? 40 : 48}
                />
                <AnalogKnob
                  value={frequency}
                  onChange={setFrequency}
                  label="FREQ"
                  min={400}
                  max={528}
                  size={isMobile ? 40 : 48}
                />
                {!isMobile && (
                  <AnalogKnob
                    value={resonance}
                    onChange={setResonance}
                    label="RESONANCE"
                    size={48}
                  />
                )}
                
                {/* Volume indicator */}
                <div className="flex items-center gap-1">
                  <Volume2 className="w-4 h-4 text-cream-muted/50" />
                  <span className="text-xs font-mono text-gem-topaz">
                    {Math.round(volume)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Mobile Waveform */}
            {isMobile && (
              <div className="flex justify-center pt-2">
                <WaveformVisualizer isPlaying={isPlaying} />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResonanceDeck;
