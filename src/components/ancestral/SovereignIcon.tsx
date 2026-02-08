import { motion } from 'framer-motion';

interface SovereignIconProps {
  className?: string;
  animated?: boolean;
}

/**
 * Sovereign Icon - Infinity symbol entwined with a seed pod
 * Represents the eternal loop of seed saving
 */
const SovereignIcon = ({ className = '', animated = true }: SovereignIconProps) => {
  return (
    <motion.svg
      viewBox="0 0 48 48"
      className={className}
      style={{ filter: 'drop-shadow(0 0 8px hsl(0 0% 80% / 0.5))' }}
    >
      {/* Infinity Symbol */}
      <motion.path
        d="M12 24c0-4 3-8 8-8s8 4 8 8-3 8-8 8-8-4-8-8z M28 24c0-4 3-8 8-8s8 4 8 8-3 8-8 8-8-4-8-8z"
        fill="none"
        stroke="url(#sovereignGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        animate={animated ? {
          strokeDasharray: ['0 100', '100 0'],
          opacity: [0.6, 1, 0.6],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Seed Pod in Center */}
      <motion.ellipse
        cx="24"
        cy="24"
        rx="4"
        ry="6"
        fill="url(#seedGradient)"
        stroke="hsl(45 60% 70%)"
        strokeWidth="1"
        animate={animated ? {
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Seed lines */}
      <motion.path
        d="M24 19 L24 29 M22 21 L24 24 L26 21"
        stroke="hsl(35 50% 40%)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Sparkle accents */}
      {[
        { cx: 8, cy: 20 },
        { cx: 40, cy: 20 },
        { cx: 24, cy: 12 },
      ].map((pos, i) => (
        <motion.circle
          key={i}
          cx={pos.cx}
          cy={pos.cy}
          r="1.5"
          fill="hsl(0 0% 90%)"
          animate={animated ? {
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
      
      {/* Gradients */}
      <defs>
        <linearGradient id="sovereignGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(280 30% 80%)" />
          <stop offset="50%" stopColor="hsl(0 0% 95%)" />
          <stop offset="100%" stopColor="hsl(200 30% 80%)" />
        </linearGradient>
        <radialGradient id="seedGradient" cx="30%" cy="30%">
          <stop offset="0%" stopColor="hsl(40 50% 60%)" />
          <stop offset="100%" stopColor="hsl(30 40% 35%)" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

export default SovereignIcon;
