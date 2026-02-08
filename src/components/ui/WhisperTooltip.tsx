import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhisperTooltipProps {
  children: ReactNode;
  whisper: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * THE WHISPER ENGINE
 * 
 * Custom glassmorphism tooltip with fade-in/slide-up animation.
 * Used for cultural context and ancestral wisdom throughout the portal.
 * 
 * Style: Glass effect, white 12px text, 0.2s ease-out animation
 */
const WhisperTooltip = ({ children, whisper, position = 'top' }: WhisperTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
    bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
    left: 'top-1/2 -left-2 -translate-y-1/2 -translate-x-full',
    right: 'top-1/2 -right-2 -translate-y-1/2 translate-x-full',
  };

  const slideVariants = {
    top: { initial: { opacity: 0, y: 8, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 } },
    bottom: { initial: { opacity: 0, y: -8, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 } },
    left: { initial: { opacity: 0, x: 8, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 } },
    right: { initial: { opacity: 0, x: -8, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 } },
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={slideVariants[position].initial}
            animate={slideVariants[position].animate}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute ${positionClasses[position]} z-[100] pointer-events-none`}
          >
            {/* Glassmorphism Container */}
            <div 
              className="px-3 py-2 rounded-lg whitespace-nowrap"
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              }}
            >
              <p 
                className="text-xs font-body tracking-wide"
                style={{ 
                  color: 'hsl(0 0% 100%)',
                  fontSize: '12px',
                  fontWeight: 400,
                }}
              >
                {whisper}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhisperTooltip;
