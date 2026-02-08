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

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);
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
            {/* Outer ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 120,
                height: 120,
                left: -60,
                top: -60,
                border: '2px solid hsl(185 80% 55%)',
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            
            {/* Middle ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 80,
                height: 80,
                left: -40,
                top: -40,
                border: '2px solid hsl(185 70% 60%)',
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
            />
            
            {/* Inner ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 40,
                height: 40,
                left: -20,
                top: -20,
                border: '2px solid hsl(185 90% 65%)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            />
            
            {/* Center dot */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 8,
                height: 8,
                left: -4,
                top: -4,
                background: 'radial-gradient(circle, hsl(185 100% 70%), hsl(185 80% 50%))',
                boxShadow: '0 0 15px hsl(185 80% 55% / 0.6)',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TouchRipple;
