import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

// Eshu Crossroads Silhouette - The Divine Trickster
const EshuSilhouette = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 120 160" className={className} fill="currentColor">
    {/* Crossroads */}
    <path 
      d="M0 100 L120 100 M60 40 L60 160" 
      stroke="currentColor" 
      strokeWidth="4" 
      fill="none"
      opacity="0.3"
    />
    
    {/* Figure silhouette */}
    {/* Head with distinctive hat/crown */}
    <ellipse cx="60" cy="35" rx="12" ry="14" fill="currentColor" />
    <path d="M48 28 Q60 15, 72 28" fill="currentColor" /> {/* Hat point */}
    
    {/* Body */}
    <path d="M52 48 L48 95 L54 95 L56 60 L60 95 L66 95 L64 60 L68 95 L72 95 L68 48 Z" fill="currentColor" />
    
    {/* Arms - one raised with pipe */}
    <path d="M52 55 L35 70 L38 73 L52 62" fill="currentColor" />
    <path d="M68 55 L85 50 L87 55 L70 62" fill="currentColor" />
    
    {/* Pipe */}
    <rect x="82" y="45" width="18" height="4" rx="1" fill="currentColor" />
    <ellipse cx="98" cy="42" rx="4" ry="5" fill="currentColor" />
    
    {/* Smoke wisps from pipe */}
    <motion.path 
      d="M100 35 Q105 30, 102 25 Q108 20, 105 15" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="none"
      opacity="0.4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Staff/walking stick */}
    <line x1="38" y1="73" x2="30" y2="120" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
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
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, hsl(45 50% 50%) 1px, transparent 1px),
            linear-gradient(0deg, hsl(45 50% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: 'center center',
        }}
      />

      {/* Dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 text-center px-6">
        {/* Eshu silhouette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <EshuSilhouette className="w-32 h-44 mx-auto text-amber-600/60" />
        </motion.div>

        {/* 404 Number */}
        <motion.h1 
          className="text-7xl md:text-9xl mb-4 tracking-widest"
          style={{ 
            fontFamily: 'Staatliches, sans-serif',
            color: 'hsl(45 70% 55%)',
            textShadow: '0 0 30px hsl(45 60% 40% / 0.4)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          404
        </motion.h1>

        {/* Eshu's message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <p 
            className="text-2xl md:text-3xl mb-2 tracking-wide"
            style={{ 
              fontFamily: 'Staatliches, sans-serif',
              color: 'hsl(0 60% 55%)',
            }}
          >
            The Crossroads are closed.
          </p>
          <p 
            className="text-lg md:text-xl italic"
            style={{ 
              fontFamily: 'Space Mono, monospace',
              color: 'hsl(45 50% 70%)',
            }}
          >
            Eshu says: <span className="font-bold">Pivot.</span>
          </p>
        </motion.div>

        {/* Context */}
        <motion.p
          className="text-sm mb-8 max-w-md mx-auto"
          style={{ 
            fontFamily: 'Space Mono, monospace',
            color: 'hsl(40 30% 50%)',
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
            background: 'linear-gradient(135deg, hsl(350 60% 35%), hsl(350 50% 25%))',
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
          className="mt-12 text-xs tracking-widest"
          style={{ 
            fontFamily: 'Staatliches, sans-serif',
            color: 'hsl(280 40% 50% / 0.6)',
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
