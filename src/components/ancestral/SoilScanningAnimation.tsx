import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface SoilScanningAnimationProps {
  color: string;
}

/**
 * Soil Scanning Animation
 * Displays "Scanning Soil..." with animated effects during upload verification
 */
const SoilScanningAnimation = ({ color }: SoilScanningAnimationProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {/* Scanning circles */}
      <div className="relative w-24 h-24 mb-6">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${color}40`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Middle ring */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            border: `2px solid ${color}60`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.2, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />
        
        {/* Inner circle with icon */}
        <motion.div
          className="absolute inset-4 rounded-full flex items-center justify-center"
          style={{
            background: `${color}20`,
            border: `2px solid ${color}`,
          }}
          animate={{
            boxShadow: [
              `0 0 20px ${color}40`,
              `0 0 40px ${color}60`,
              `0 0 20px ${color}40`,
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-8 h-8" style={{ color }} />
          </motion.div>
        </motion.div>
        
        {/* Scanning line */}
        <motion.div
          className="absolute inset-x-0 h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            top: '50%',
          }}
          animate={{
            top: ['0%', '100%', '0%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Text */}
      <motion.p
        className="text-lg font-mono tracking-[0.3em] mb-2"
        style={{ color }}
        animate={{
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        SCANNING SOIL...
      </motion.p>
      
      <motion.p
        className="text-xs font-mono opacity-60"
        style={{ color: 'hsl(40 50% 60%)' }}
      >
        Verifying ancestral connection
      </motion.p>

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: color,
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SoilScanningAnimation;
