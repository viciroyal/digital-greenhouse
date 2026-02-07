import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * The Respiratory System - "The Living Pulse"
 * 
 * A wrapper that applies a subtle breathing animation to its children.
 * Rhythm: 6-second cycle matching 4-7-8 Pranayama breath
 * - Inhale (expand): 4 seconds
 * - Hold: brief pause
 * - Exhale (contract): 4 seconds with vein glow
 */

interface RespiratorySystemProps {
  children: ReactNode;
}

const RespiratorySystem = ({ children }: RespiratorySystemProps) => {
  return (
    <motion.div
      className="respiratory-container"
      animate={{
        scale: [1, 1.02, 1.02, 1, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.4, 0.5, 0.9, 1], // 4s inhale, pause, 4s exhale, pause
      }}
      style={{
        transformOrigin: 'center center',
      }}
    >
      {children}
    </motion.div>
  );
};

export default RespiratorySystem;
