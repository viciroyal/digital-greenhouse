import { motion } from 'framer-motion';

// Eshu Crossroads Silhouette - The Divine Trickster (Loading variant)
const EshuSilhouetteSmall = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 80 100" className={className} fill="currentColor">
    {/* Crossroads */}
    <path 
      d="M0 60 L80 60 M40 20 L40 100" 
      stroke="currentColor" 
      strokeWidth="2" 
      fill="none"
      opacity="0.2"
    />
    
    {/* Figure silhouette */}
    <ellipse cx="40" cy="22" rx="8" ry="10" fill="currentColor" />
    <path d="M32 17 Q40 8, 48 17" fill="currentColor" />
    
    {/* Body */}
    <path d="M34 30 L32 58 L36 58 L38 38 L40 58 L44 58 L42 38 L46 58 L48 58 L46 30 Z" fill="currentColor" />
    
    {/* Arms */}
    <path d="M34 35 L24 45 L26 48 L34 40" fill="currentColor" />
    <path d="M46 35 L56 32 L57 36 L47 40" fill="currentColor" />
    
    {/* Pipe */}
    <rect x="54" y="28" width="12" height="3" rx="1" fill="currentColor" />
    <ellipse cx="65" cy="26" rx="3" ry="4" fill="currentColor" />
  </svg>
);

interface EshuLoaderProps {
  message?: string;
  className?: string;
}

const EshuLoader = ({ 
  message = "Eshu is opening the gate...", 
  className = "" 
}: EshuLoaderProps) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center ${className}`}
    >
      {/* Animated Eshu silhouette */}
      <motion.div
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-6"
      >
        <EshuSilhouetteSmall className="w-16 h-20 text-amber-600/70" />
      </motion.div>

      {/* Gate opening animation */}
      <div className="relative w-48 h-1 mb-4 overflow-hidden rounded-full bg-amber-900/30">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, hsl(350 60% 45%), hsl(45 70% 55%), hsl(350 60% 45%))',
          }}
          animate={{
            width: ['0%', '100%', '0%'],
            left: ['0%', '0%', '100%'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading text */}
      <motion.p
        className="text-sm tracking-wider italic"
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

      {/* Smoke wisps */}
      <div className="absolute pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-500/30"
            style={{
              left: `${45 + i * 5}%`,
              top: '20%',
            }}
            animate={{
              y: [-10, -40, -70],
              x: [0, (i - 1) * 10, (i - 1) * 20],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 1.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EshuLoader;
