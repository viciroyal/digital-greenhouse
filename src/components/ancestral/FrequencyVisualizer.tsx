import { motion } from 'framer-motion';

interface FrequencyVisualizerProps {
  level: number;
}

// Frequency data for each level - Solfeggio frequencies
const frequencyData: Record<number, {
  hz: string;
  label: string;
  color: string;
  glowColor: string;
}> = {
  1: {
    hz: '396 Hz',
    label: 'Root Pulse',
    color: 'hsl(0 70% 50%)', // Red
    glowColor: 'hsl(0 70% 50% / 0.6)',
  },
  2: {
    hz: '417 Hz',
    label: 'Stone Hum',
    color: 'hsl(35 80% 50%)', // Amber
    glowColor: 'hsl(35 80% 50% / 0.6)',
  },
  3: {
    hz: '528 Hz',
    label: 'The Songline', // Aboriginal method of singing to the land
    color: 'hsl(185 100% 50%)', // Cyan
    glowColor: 'hsl(185 100% 50% / 0.6)',
  },
  4: {
    hz: '639 Hz',
    label: 'Gold Flow',
    color: 'hsl(45 100% 50%)', // Gold
    glowColor: 'hsl(45 100% 50% / 0.6)',
  },
  5: {
    hz: '963 Hz',
    label: 'Source Code',
    color: 'hsl(0 0% 90%)', // Pearl/White
    glowColor: 'hsl(0 0% 90% / 0.6)',
  },
};

/**
 * Frequency Visualizer - Animated audio wave display
 * Shows the Solfeggio frequency associated with each level
 */
const FrequencyVisualizer = ({ level }: FrequencyVisualizerProps) => {
  const data = frequencyData[level] || frequencyData[1];
  const barCount = 7;

  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2 rounded-lg"
      style={{
        background: 'hsl(0 0% 5% / 0.8)',
        border: `1px solid ${data.color}40`,
        boxShadow: `0 0 20px ${data.glowColor}`,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      {/* Audio Wave Animation */}
      <div className="flex items-center gap-0.5 h-6">
        {[...Array(barCount)].map((_, i) => {
          // Different animation heights for each bar
          const heights = [0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.3];
          const delays = [0, 0.1, 0.05, 0.15, 0.08, 0.12, 0.03];
          
          return (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{ 
                background: data.color,
                boxShadow: `0 0 6px ${data.glowColor}`,
              }}
              animate={{
                height: [
                  `${4 + heights[i] * 12}px`,
                  `${8 + heights[i] * 16}px`,
                  `${4 + heights[i] * 12}px`,
                ],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 0.8 + (i * 0.1),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delays[i],
              }}
            />
          );
        })}
      </div>

      {/* Frequency Label */}
      <div className="flex flex-col items-end">
        <span 
          className="text-xs font-mono tracking-wide"
          style={{ 
            color: data.color,
            textShadow: `0 0 8px ${data.glowColor}`,
          }}
        >
          {data.hz}
        </span>
        <span 
          className="text-[10px] tracking-wider uppercase"
          style={{ 
            fontFamily: "'Staatliches', sans-serif",
            color: 'hsl(0 0% 60%)',
            letterSpacing: '0.1em',
          }}
        >
          {data.label}
        </span>
      </div>
    </motion.div>
  );
};

export default FrequencyVisualizer;
