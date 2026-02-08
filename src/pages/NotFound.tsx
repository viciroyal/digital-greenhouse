import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

// Eshu Silhouette - The Trickster leaning on staff at the crossroads
const EshuSilhouette = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 120 160" className={className} fill="currentColor">
    {/* Crossroads background */}
    <path 
      d="M0 100 L120 100" 
      stroke="currentColor" 
      strokeWidth="3" 
      fill="none"
      opacity="0.15"
    />
    <path 
      d="M60 50 L60 160" 
      stroke="currentColor" 
      strokeWidth="3" 
      fill="none"
      opacity="0.15"
    />
    
    {/* Figure silhouette */}
    {/* Head with distinctive hat/crown */}
    <ellipse cx="60" cy="35" rx="12" ry="14" />
    <path d="M48 28 Q60 12, 72 28" /> {/* Pointed hat */}
    
    {/* Body - leaning pose */}
    <path d="M52 48 L44 95 L52 95 L56 60 L64 95 L72 95 L66 48 Z" />
    
    {/* Arms - one resting on staff, one with pipe */}
    <path d="M52 55 L32 75 L36 80 L52 65" />
    <path d="M68 55 L85 48 L87 54 L70 62" />
    
    {/* Pipe */}
    <rect x="83" y="44" width="16" height="4" rx="1" />
    <ellipse cx="97" cy="41" rx="4" ry="5" />
    
    {/* Animated smoke wisps */}
    <motion.g opacity="0.4">
      <motion.circle
        cx="100"
        cy="35"
        r="2"
        animate={{
          y: [-5, -20, -35],
          x: [0, 5, 10],
          opacity: [0, 0.6, 0],
          scale: [0.5, 1, 1.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 0,
        }}
      />
      <motion.circle
        cx="98"
        cy="32"
        r="1.5"
        animate={{
          y: [-5, -25, -40],
          x: [0, -3, -8],
          opacity: [0, 0.5, 0],
          scale: [0.5, 1.2, 1.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 0.5,
        }}
      />
    </motion.g>
    
    {/* Legs */}
    <path d="M44 95 L38 140 L46 140 L50 100" />
    <path d="M64 95 L70 140 L78 140 L72 100" />
    
    {/* Staff/walking stick with ornament */}
    <line x1="36" y1="80" x2="28" y2="145" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="32" cy="70" r="5" fill="hsl(350 60% 50%)" />
  </svg>
);

// Crossroads Symbol for emphasis
const CrossroadsDecor = () => (
  <svg viewBox="0 0 200 40" className="w-48 h-8 mx-auto opacity-30">
    <line x1="0" y1="20" x2="80" y2="20" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="20" r="4" fill="hsl(350 60% 50%)" />
    <line x1="120" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div 
      className="flex min-h-screen items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, 
          hsl(250 40% 8%) 0%, 
          hsl(20 30% 8%) 50%,
          hsl(15 40% 6%) 100%
        )`,
      }}
    >
      {/* Crossroads pattern background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, hsl(45 50% 50%) 1px, transparent 1px),
            linear-gradient(0deg, hsl(45 50% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          backgroundPosition: 'center center',
        }}
      />

      {/* Dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: 'hsl(45 60% 60%)',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Eshu silhouette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <EshuSilhouette className="w-28 h-40 mx-auto text-amber-600/50" />
        </motion.div>

        {/* 404 Number */}
        <motion.h1 
          className="text-6xl md:text-8xl mb-4 tracking-widest"
          style={{ 
            fontFamily: 'Staatliches, sans-serif',
            color: 'hsl(45 70% 55%)',
            textShadow: '0 0 40px hsl(45 60% 40% / 0.3)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          404
        </motion.h1>

        {/* Crossroads decoration */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-amber-500/60 mb-6"
        >
          <CrossroadsDecor />
        </motion.div>

        {/* Eshu's message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <p 
            className="text-xl md:text-2xl mb-3 tracking-wide"
            style={{ 
              fontFamily: 'Staatliches, sans-serif',
              color: 'hsl(0 55% 55%)',
            }}
          >
            The Path is blocked.
          </p>
          <p 
            className="text-base md:text-lg"
            style={{ 
              fontFamily: 'Space Mono, monospace',
              color: 'hsl(45 50% 70%)',
            }}
          >
            Eshu says: <span className="italic font-bold">Find another way (Pivot).</span>
          </p>
        </motion.div>

        {/* Context */}
        <motion.p
          className="text-xs mb-8 max-w-sm mx-auto leading-relaxed"
          style={{ 
            fontFamily: 'Space Mono, monospace',
            color: 'hsl(40 30% 45%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          The path you seek does not exist... yet. 
          Eshu, the Divine Trickster, guards all crossroads. 
          Choose another way.
        </motion.p>

        {/* Return button */}
        <motion.button
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-full font-mono text-sm tracking-wider transition-all"
          style={{
            background: 'linear-gradient(135deg, hsl(350 55% 35%), hsl(350 45% 25%))',
            border: '1px solid hsl(350 50% 45%)',
            color: 'hsl(45 80% 85%)',
            boxShadow: '0 4px 20px hsl(350 50% 30% / 0.3)',
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 6px 30px hsl(350 50% 40% / 0.5)',
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          Return to the Garden
        </motion.button>

        {/* Eshu attribution */}
        <motion.p
          className="mt-10 text-[10px] tracking-[0.2em]"
          style={{ 
            fontFamily: 'Staatliches, sans-serif',
            color: 'hsl(280 40% 50% / 0.5)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ESHU-ELEGBA • GUARDIAN OF THE CROSSROADS • YORUBA
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;
