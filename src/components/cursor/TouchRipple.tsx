import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * TOUCH RIPPLE - Mobile Tap Feedback
 * 
 * Cyan concentric rings ripple out on tap.
 * Only active on touch devices.
 */

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const TouchRipple = () => {
  const isMobile = useIsMobile();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = { current: 0 };

  const createRipple = useCallback((x: number, y: number) => {
    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation (increased duration)
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1400);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        createRipple(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('touchstart', handleTouch, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [isMobile, createRipple]);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Outer ring - largest */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 200,
                height: 200,
                left: -100,
                top: -100,
                border: '3px solid hsl(185 80% 55%)',
                boxShadow: '0 0 20px hsl(185 80% 55% / 0.4)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            
            {/* Second ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 150,
                height: 150,
                left: -75,
                top: -75,
                border: '3px solid hsl(185 85% 60%)',
                boxShadow: '0 0 15px hsl(185 85% 60% / 0.5)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.05 }}
            />
            
            {/* Third ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 100,
                height: 100,
                left: -50,
                top: -50,
                border: '3px solid hsl(185 90% 65%)',
                boxShadow: '0 0 12px hsl(185 90% 65% / 0.6)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            />
            
            {/* Inner ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 60,
                height: 60,
                left: -30,
                top: -30,
                border: '2px solid hsl(185 95% 70%)',
                boxShadow: '0 0 10px hsl(185 95% 70% / 0.7)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            />
            
            {/* Center burst */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 20,
                height: 20,
                left: -10,
                top: -10,
                background: 'radial-gradient(circle, hsl(185 100% 80%), hsl(185 90% 55%))',
                boxShadow: '0 0 30px hsl(185 90% 60% / 0.8), 0 0 60px hsl(185 80% 50% / 0.4)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TouchRipple;
