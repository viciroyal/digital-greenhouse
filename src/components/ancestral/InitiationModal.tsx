import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface InitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Scrolling text content with color mapping
const scrollingText = [
  { text: 'We do not just grow food.', color: 'hsl(0 0% 80%)' },
  { text: 'We grow frequency.', color: 'hsl(0 0% 90%)', bold: true },
  { text: '', color: 'transparent' }, // Spacer
  { text: '(ROOT)', color: '#ff0000', label: 'Of the MUSCOGEE & MAROONS.' },
  { text: '(STRUCTURE)', color: '#ffbf00', label: 'Of the OLMEC.' },
  { text: '(SIGNAL)', color: '#00bfff', label: 'Of the DOGON, ABORIGINAL, CHINESE & VEDIC.' },
  { text: '(ALCHEMY)', color: '#ffd700', label: 'Of the KEMETIC PRIESTS.' },
  { text: '', color: 'transparent' }, // Spacer
  { text: 'To enter this school is to remember them.', color: 'hsl(0 0% 85%)', italic: true },
];

const SCROLL_DURATION = 18; // seconds for full scroll

/**
 * Initiation Modal - The Pharmer's Pledge
 * Star Wars style scrolling text with ancestral lineages
 */
const InitiationModal = ({ isOpen, onClose }: InitiationModalProps) => {
  const [scrollComplete, setScrollComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setScrollComplete(false);
      const timer = setTimeout(() => {
        setScrollComplete(true);
      }, (SCROLL_DURATION - 2) * 1000); // Enable button slightly before scroll ends
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleRemember = () => {
    // Play door unlock sound effect (if available)
    try {
      const audio = new Audio('/sounds/door-unlock.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {}); // Silently fail if no audio
    } catch {
      // Audio not available
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dark Soil Background */}
          <div 
            className="absolute inset-0"
            style={{ background: '#1a1a00' }}
          />
          
          {/* Organic texture overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Vignette effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          {/* Close button */}
          <motion.button
            className="absolute top-6 right-6 z-10 p-2 rounded-full"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid hsl(0 0% 30%)',
            }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
            }}
            onClick={onClose}
          >
            <X className="w-6 h-6 text-white hover:text-red-500 transition-colors" />
          </motion.button>

          {/* Scrolling Text Container - Star Wars Perspective */}
          <div 
            className="relative w-full h-full overflow-hidden"
            style={{
              perspective: '400px',
              perspectiveOrigin: '50% 40%',
            }}
          >
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-full max-w-2xl px-8"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(25deg)',
                top: '100%',
              }}
              animate={{
                top: '-150%',
              }}
              transition={{
                duration: SCROLL_DURATION,
                ease: 'linear',
              }}
            >
              <div className="space-y-8 text-center py-20">
                {scrollingText.map((item, index) => (
                  <motion.div
                    key={index}
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {item.label ? (
                      <>
                        {/* Category with glow */}
                        <p 
                          className="text-2xl md:text-3xl tracking-[0.3em]"
                          style={{
                            fontFamily: "'Staatliches', sans-serif",
                            color: item.color,
                            textShadow: `0 0 30px ${item.color}, 0 0 60px ${item.color}`,
                          }}
                        >
                          {item.text}
                        </p>
                        {/* Lineage description */}
                        <p 
                          className="text-lg md:text-xl tracking-wide"
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            color: 'hsl(0 0% 70%)',
                          }}
                        >
                          {item.label}
                        </p>
                      </>
                    ) : item.text ? (
                      <p 
                        className={`text-xl md:text-2xl tracking-wide ${item.italic ? 'italic' : ''}`}
                        style={{
                          fontFamily: item.bold ? "'Staatliches', sans-serif" : "'Space Mono', monospace",
                          color: item.color,
                          textShadow: item.bold ? '0 0 20px rgba(255,255,255,0.3)' : 'none',
                        }}
                      >
                        {item.text}
                      </p>
                    ) : (
                      <div className="h-16" /> // Spacer
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* I REMEMBER Button */}
          <motion.button
            className="absolute bottom-16 left-1/2 -translate-x-1/2 px-8 py-4 rounded-xl font-mono text-lg tracking-widest"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              background: scrollComplete 
                ? 'linear-gradient(135deg, hsl(0 70% 35%), hsl(0 60% 25%))'
                : 'hsl(0 0% 20%)',
              border: scrollComplete 
                ? '2px solid hsl(0 70% 50%)'
                : '2px solid hsl(0 0% 30%)',
              color: scrollComplete ? 'white' : 'hsl(0 0% 50%)',
              cursor: scrollComplete ? 'pointer' : 'not-allowed',
              boxShadow: scrollComplete 
                ? '0 0 30px hsl(0 70% 40% / 0.5), 0 0 60px hsl(0 70% 30% / 0.3)'
                : 'none',
            }}
            whileHover={scrollComplete ? { 
              scale: 1.05,
              boxShadow: '0 0 40px hsl(0 70% 50% / 0.6), 0 0 80px hsl(0 70% 40% / 0.4)',
            } : {}}
            whileTap={scrollComplete ? { scale: 0.98 } : {}}
            onClick={scrollComplete ? handleRemember : undefined}
            animate={scrollComplete ? {
              boxShadow: [
                '0 0 30px hsl(0 70% 40% / 0.5), 0 0 60px hsl(0 70% 30% / 0.3)',
                '0 0 40px hsl(0 70% 50% / 0.6), 0 0 80px hsl(0 70% 40% / 0.4)',
                '0 0 30px hsl(0 70% 40% / 0.5), 0 0 60px hsl(0 70% 30% / 0.3)',
              ],
            } : {}}
            transition={scrollComplete ? {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            } : {}}
          >
            I REMEMBER
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitiationModal;
