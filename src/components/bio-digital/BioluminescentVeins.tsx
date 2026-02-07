import { motion } from 'framer-motion';

/**
 * Bioluminescent Vein Overlay
 * 
 * Pulses brighter during the "exhale" phase of the respiratory cycle.
 * Uses a synchronized animation that glows on the exhale (second half of 6s cycle).
 */

const BioluminescentVeins = () => {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[1]"
      aria-hidden="true"
      animate={{
        opacity: [0.3, 0.3, 0.6, 0.6, 0.3],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.4, 0.5, 0.9, 1],
      }}
    >
      <svg 
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="veinPulseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(200 80% 60%)" stopOpacity="0.1" />
            <stop offset="30%" stopColor="hsl(180 70% 50%)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="hsl(200 90% 65%)" stopOpacity="0.6" />
            <stop offset="70%" stopColor="hsl(180 70% 50%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(220 60% 40%)" stopOpacity="0.1" />
          </linearGradient>
          
          <filter id="veinGlow">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Main flowing veins */}
        <motion.path 
          d="M10 0 Q15 20, 8 40 Q12 60, 5 80 Q10 90, 8 100"
          fill="none"
          stroke="url(#veinPulseGradient)"
          strokeWidth="0.3"
          filter="url(#veinGlow)"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path 
          d="M30 0 Q25 15, 32 35 Q28 55, 35 75 Q30 85, 33 100"
          fill="none"
          stroke="url(#veinPulseGradient)"
          strokeWidth="0.25"
          filter="url(#veinGlow)"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path 
          d="M50 0 Q55 25, 48 45 Q52 65, 47 85 Q53 92, 50 100"
          fill="none"
          stroke="url(#veinPulseGradient)"
          strokeWidth="0.35"
          filter="url(#veinGlow)"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path 
          d="M70 0 Q65 20, 72 40 Q68 60, 75 80 Q70 92, 73 100"
          fill="none"
          stroke="url(#veinPulseGradient)"
          strokeWidth="0.25"
          filter="url(#veinGlow)"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path 
          d="M90 0 Q85 18, 92 38 Q88 58, 95 78 Q90 88, 93 100"
          fill="none"
          stroke="url(#veinPulseGradient)"
          strokeWidth="0.3"
          filter="url(#veinGlow)"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Connecting capillaries */}
        <motion.path 
          d="M8 40 Q20 38, 32 35"
          fill="none"
          stroke="url(#veinPulseGradient)"
          strokeWidth="0.15"
          filter="url(#veinGlow)"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path 
          d="M35 75 Q42 72, 48 75"
          fill="none"
          stroke="url(#veinPulseGradient)"
          strokeWidth="0.15"
          filter="url(#veinGlow)"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path 
          d="M72 40 Q80 42, 92 38"
          fill="none"
          stroke="url(#veinPulseGradient)"
          strokeWidth="0.15"
          filter="url(#veinGlow)"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.div>
  );
};

export default BioluminescentVeins;
