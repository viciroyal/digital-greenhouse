import { motion, AnimatePresence } from 'framer-motion';
import { useFieldMode } from '@/contexts/FieldModeContext';

/**
 * FIELD MODE OVERLAY
 * 
 * When Field Mode is active, this overlay strips away decorative
 * graphics and applies a high-contrast reading mode.
 */
const FieldModeOverlay = () => {
  const { isFieldMode } = useFieldMode();

  return (
    <AnimatePresence>
      {isFieldMode && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* High contrast overlay that desaturates and brightens */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'hsl(45 30% 95%)',
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* Desaturation layer */}
          <div 
            className="absolute inset-0"
            style={{
              backdropFilter: 'saturate(0.3) contrast(1.2) brightness(1.1)',
              WebkitBackdropFilter: 'saturate(0.3) contrast(1.2) brightness(1.1)',
            }}
          />
          
          {/* Subtle paper texture */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Field Mode indicator */}
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full"
            style={{
              background: 'hsl(45 90% 55%)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span 
              className="text-xs font-mono font-bold tracking-wider uppercase"
              style={{ color: 'hsl(20 40% 15%)' }}
            >
              ☀ FIELD MODE ACTIVE
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FieldModeOverlay;
