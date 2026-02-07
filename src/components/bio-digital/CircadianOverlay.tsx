import { motion } from 'framer-motion';
import { useCircadian } from '@/contexts/CircadianContext';

/**
 * Circadian Overlay - "The Sun & Moon Mode"
 * 
 * Applies a color overlay based on time of day:
 * - Solar (6AM-6PM): Warm golds, emeralds, rubies
 * - Lunar (6PM-6AM): Cool indigos, violets, bioluminescent blues
 */
const CircadianOverlay = () => {
  const { isSolar, isLunar } = useCircadian();
  
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[2]"
      aria-hidden="true"
      initial={false}
      animate={{
        background: isSolar
          ? `
            radial-gradient(ellipse at 70% 20%, hsl(45 70% 50% / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 40%, hsl(350 60% 45% / 0.05) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 80%, hsl(140 50% 35% / 0.06) 0%, transparent 45%)
          `
          : `
            radial-gradient(ellipse at 30% 30%, hsl(260 60% 35% / 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 50%, hsl(220 70% 40% / 0.1) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 90%, hsl(200 80% 50% / 0.08) 0%, transparent 40%)
          `,
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
      }}
    >
      {/* Solar Mode: Subtle sun rays */}
      {isSolar && (
        <motion.div
          className="absolute top-0 right-0 w-96 h-96"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          style={{
            background: 'radial-gradient(circle at 100% 0%, hsl(45 80% 60% / 0.15) 0%, transparent 60%)',
          }}
        />
      )}
      
      {/* Lunar Mode: Subtle moon glow */}
      {isLunar && (
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1 }}
          style={{
            background: 'radial-gradient(circle, hsl(40 30% 85% / 0.2) 0%, transparent 70%)',
            boxShadow: '0 0 60px hsl(40 30% 85% / 0.1)',
          }}
        />
      )}
    </motion.div>
  );
};

export default CircadianOverlay;
