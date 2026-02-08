import { motion } from 'framer-motion';

// Crossroads Symbol - Eshu's sacred intersection
const CrossroadsSymbol = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    {/* Horizontal road */}
    <motion.path 
      d="M4 32 L60 32" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
    {/* Vertical road */}
    <motion.path 
      d="M32 4 L32 60" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    />
    {/* Center point - the decision node */}
    <motion.circle 
      cx="32" 
      cy="32" 
      r="6" 
      fill="hsl(350 60% 50%)"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.5, delay: 0.6 }}
    />
    {/* Cardinal markers */}
    <motion.circle cx="12" cy="32" r="2" fill="hsl(45 70% 55%)" 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} />
    <motion.circle cx="52" cy="32" r="2" fill="hsl(45 70% 55%)" 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} />
    <motion.circle cx="32" cy="12" r="2" fill="hsl(45 70% 55%)" 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} />
    <motion.circle cx="32" cy="52" r="2" fill="hsl(45 70% 55%)" 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} />
  </svg>
);

// Eshu Silhouette - The Trickster leaning on staff
const EshuSilhouette = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 80 120" className={className} fill="currentColor">
    {/* Head with distinctive hat/crown */}
    <ellipse cx="40" cy="22" rx="10" ry="12" />
    <path d="M30 16 Q40 5, 50 16" /> {/* Hat point */}
    
    {/* Body - leaning pose */}
    <path d="M34 32 L28 75 L34 75 L38 45 L42 75 L48 75 L42 32 Z" />
    
    {/* Arms - one resting on staff */}
    <path d="M34 40 L20 55 L23 58 L34 48" />
    <path d="M46 40 L55 35 L56 40 L47 48" />
    
    {/* Legs - relaxed stance */}
    <path d="M28 75 L22 110 L28 110 L32 80" />
    <path d="M42 75 L48 110 L54 110 L46 80" />
    
    {/* Staff/walking stick */}
    <line x1="20" y1="55" x2="15" y2="115" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    
    {/* Staff ornament */}
    <circle cx="15" cy="50" r="4" fill="hsl(350 60% 50%)" />
  </svg>
);

interface EshuLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * EshuLoader - The Trickster Loading State
 * 
 * Instead of a generic spinner, we show Eshu's Crossroads symbol
 * pulsing with the message "Eshu is opening the gate..."
 */
const EshuLoader = ({ 
  message = "Eshu is opening the gate...", 
  size = 'md',
  className = "" 
}: EshuLoaderProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Animated Crossroads Symbol */}
      <motion.div
        className="relative"
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className={`absolute inset-0 rounded-full ${sizeClasses[size]}`}
          style={{
            background: 'radial-gradient(circle, hsl(350 50% 40% / 0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <CrossroadsSymbol className={`${sizeClasses[size]} text-amber-500/80`} />
      </motion.div>

      {/* Loading text */}
      <motion.p
        className="mt-6 text-sm tracking-wider italic text-center"
        style={{
          fontFamily: 'Space Mono, monospace',
          color: 'hsl(45 50% 65%)',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        {message}
      </motion.p>

      {/* Eshu attribution */}
      <motion.p
        className="mt-2 text-[10px] tracking-widest"
        style={{
          fontFamily: 'Staatliches, sans-serif',
          color: 'hsl(280 40% 50% / 0.5)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        ESHU-ELEGBA • YORUBA
      </motion.p>
    </div>
  );
};

// Export both components
export { EshuSilhouette, CrossroadsSymbol };
export default EshuLoader;
