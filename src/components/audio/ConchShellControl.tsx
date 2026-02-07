import { motion, AnimatePresence } from 'framer-motion';
import { useAudioBiome } from '@/contexts/AudioBiomeContext';

const ConchShellControl = () => {
  const { isAudioEnabled, toggleAudio, currentZone, zoneVolumes } = useAudioBiome();

  // Zone colors
  const zoneColors = {
    ether: { primary: 'hsl(185 80% 50%)', glow: 'hsl(185 80% 40% / 0.6)' },
    labor: { primary: 'hsl(45 90% 50%)', glow: 'hsl(45 90% 40% / 0.6)' },
    roots: { primary: 'hsl(220 70% 50%)', glow: 'hsl(220 70% 40% / 0.6)' },
  };

  const activeColor = zoneColors[currentZone];

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.5, type: 'spring' }}
    >
      {/* Sound wave ripples when active */}
      <AnimatePresence>
        {isAudioEnabled && (
          <>
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ 
                  scale: [1, 1.8 + ring * 0.4],
                  opacity: [0.4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: ring * 0.4,
                  ease: 'easeOut',
                }}
                style={{
                  border: `2px solid ${activeColor.primary}`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={toggleAudio}
        className="relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: isAudioEnabled 
            ? `linear-gradient(135deg, ${activeColor.primary}, hsl(220 60% 30%))`
            : 'linear-gradient(135deg, hsl(220 30% 25%), hsl(220 40% 15%))',
          boxShadow: isAudioEnabled
            ? `0 0 30px ${activeColor.glow}, 0 0 60px ${activeColor.glow}`
            : '0 4px 20px rgba(0,0,0,0.4)',
          border: `2px solid ${isAudioEnabled ? activeColor.primary : 'hsl(220 30% 35%)'}`,
        }}
      >
        {/* Inner glow */}
        {isAudioEnabled && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              background: `radial-gradient(circle at 30% 30%, ${activeColor.primary}, transparent 60%)`,
            }}
          />
        )}

        {/* Conch Shell SVG */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-7 h-7 relative z-10"
          style={{ 
            fill: isAudioEnabled ? 'hsl(40 50% 90%)' : 'hsl(220 20% 50%)',
            filter: isAudioEnabled ? `drop-shadow(0 0 4px ${activeColor.primary})` : 'none',
          }}
        >
          {/* Stylized conch/ear shape */}
          <path d="M12 2C8.5 2 6 4.5 6 8c0 2 .5 4 2 6 1 1.5 2 3 2 4.5V20c0 1 .5 2 2 2s2-1 2-2v-1.5c0-1.5 1-3 2-4.5 1.5-2 2-4 2-6 0-3.5-2.5-6-6-6zm0 2c2.5 0 4 1.5 4 4 0 1.5-.5 3-1.5 4.5-.8 1.2-1.5 2.5-1.8 3.8-.2-.1-.4-.2-.7-.3-.3.1-.5.2-.7.3-.3-1.3-1-2.6-1.8-3.8C8.5 11 8 9.5 8 8c0-2.5 1.5-4 4-4z" />
          <circle cx="12" cy="8" r="1.5" />
          <path d="M12 11c-.8 0-1.5.5-1.8 1.2.5.8 1 1.5 1.3 2.3.2-.1.3-.1.5-.1s.3 0 .5.1c.3-.8.8-1.5 1.3-2.3-.3-.7-1-1.2-1.8-1.2z" />
        </svg>

        {/* Volume indicator bars */}
        {isAudioEnabled && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            {[zoneVolumes.ether, zoneVolumes.labor, zoneVolumes.roots].map((vol, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{
                  backgroundColor: i === 0 ? 'hsl(185 80% 60%)' : i === 1 ? 'hsl(45 90% 60%)' : 'hsl(220 70% 60%)',
                  height: `${4 + vol * 8}px`,
                }}
                animate={{
                  scaleY: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.5 + i * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}
      </motion.button>

      {/* Zone label */}
      <AnimatePresence>
        {isAudioEnabled && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap"
          >
            <div 
              className="px-3 py-1.5 rounded-lg text-[10px] tracking-[0.15em] uppercase font-mono"
              style={{
                background: 'hsl(220 40% 10% / 0.8)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${activeColor.primary}`,
                color: activeColor.primary,
                textShadow: `0 0 8px ${activeColor.glow}`,
              }}
            >
              {currentZone === 'ether' && '◇ THE ETHER'}
              {currentZone === 'labor' && '◈ THE LABOR'}
              {currentZone === 'roots' && '◆ THE ROOTS'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Muted hint */}
      <AnimatePresence>
        {!isAudioEnabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span 
              className="text-[9px] tracking-[0.1em] uppercase font-body px-2 py-1 rounded"
              style={{ 
                color: 'hsl(40 50% 60%)',
                background: 'hsl(220 40% 10% / 0.6)',
              }}
            >
              Sound
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConchShellControl;
