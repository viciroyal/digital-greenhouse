import { motion } from 'framer-motion';
import { Sun, Leaf } from 'lucide-react';
import { useFieldMode } from '@/contexts/FieldModeContext';

/**
 * FIELD MODE TOGGLE - The Sun Toggle
 * 
 * Strips decorative graphics for high-contrast field reading.
 * Perfect for checking data under bright sunlight.
 */
const FieldModeToggle = () => {
  const { isFieldMode, toggleFieldMode } = useFieldMode();

  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full"
      style={{
        background: isFieldMode 
          ? 'linear-gradient(135deg, hsl(45 90% 55%), hsl(40 85% 45%))'
          : 'linear-gradient(135deg, hsl(140 40% 20%), hsl(120 35% 15%))',
        border: isFieldMode 
          ? '2px solid hsl(45 100% 70%)'
          : '2px solid hsl(140 50% 30%)',
        boxShadow: isFieldMode 
          ? '0 0 30px hsl(45 90% 50% / 0.5), inset 0 2px 10px hsl(45 100% 80% / 0.3)'
          : '0 4px 20px rgba(0,0,0,0.4)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleFieldMode}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      aria-label={isFieldMode ? 'Exit Field Mode' : 'Enter Field Mode'}
    >
      <motion.div
        animate={{ rotate: isFieldMode ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isFieldMode ? (
          <Sun 
            className="w-5 h-5" 
            style={{ color: 'hsl(20 30% 15%)' }} 
          />
        ) : (
          <Leaf 
            className="w-5 h-5" 
            style={{ color: 'hsl(140 60% 50%)' }} 
          />
        )}
      </motion.div>
      
      <span 
        className="text-xs font-mono tracking-wider uppercase"
        style={{ 
          color: isFieldMode ? 'hsl(20 30% 15%)' : 'hsl(140 50% 60%)' 
        }}
      >
        {isFieldMode ? 'FIELD MODE' : 'STANDARD'}
      </span>
      
      {/* Animated sun rays when active */}
      {isFieldMode && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, hsl(45 100% 70% / 0.3), transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.button>
  );
};

export default FieldModeToggle;
