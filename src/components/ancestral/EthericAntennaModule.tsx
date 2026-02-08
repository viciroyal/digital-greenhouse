import { motion } from 'framer-motion';
import { Zap, Compass, Leaf, Star, Shell, Upload, Award } from 'lucide-react';

/**
 * THE ETHERIC ANTENNA MODULE
 * 
 * Electroculture curriculum for Level 3 (The Dogon Signal)
 * Teaching users to build Earth Antennas using copper spirals
 */

interface EthericAntennaModuleProps {
  color: string;
  onUploadClick?: () => void;
}

// Copper Spiral Icon - Glowing with electricity
const CopperSpiralIcon = ({ className = "", glowing = true }: { className?: string; glowing?: boolean }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(25 80% 55%)" />
        <stop offset="50%" stopColor="hsl(165 60% 45%)" />
        <stop offset="100%" stopColor="hsl(175 50% 35%)" />
      </linearGradient>
      <filter id="electricGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    {/* Fibonacci Spiral */}
    <path
      d="M32 8 
         C 44 8, 56 20, 56 32
         C 56 44, 44 52, 36 52
         C 28 52, 20 44, 20 36
         C 20 28, 28 24, 32 24
         C 36 24, 40 28, 40 32
         C 40 36, 36 38, 34 38
         C 32 38, 30 36, 30 34"
      stroke="url(#copperGradient)"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      filter={glowing ? "url(#electricGlow)" : undefined}
    />
    
    {/* Electric arcs */}
    {glowing && (
      <>
        <motion.path
          d="M32 4 L30 8 L34 10 L31 14"
          stroke="hsl(200 100% 70%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          animate={{ opacity: [0.3, 1, 0.3], pathLength: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.path
          d="M58 30 L54 32 L56 36 L52 34"
          stroke="hsl(200 100% 70%)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          animate={{ opacity: [0.5, 1, 0.5], pathLength: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
        />
      </>
    )}
    
    {/* Ground stake */}
    <path
      d="M32 52 L32 60"
      stroke="hsl(20 40% 35%)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M28 60 L36 60"
      stroke="hsl(20 40% 35%)"
      strokeWidth="2"
    />
  </svg>
);

const EthericAntennaModule = ({ color, onUploadClick }: EthericAntennaModuleProps) => {
  return (
    <div className="space-y-6">
      {/* Hero Icon */}
      <div className="flex justify-center mb-6">
        <motion.div
          className="relative w-32 h-32"
          animate={{ 
            filter: ['drop-shadow(0 0 10px hsl(200 80% 50% / 0.3))', 'drop-shadow(0 0 25px hsl(200 80% 50% / 0.6))', 'drop-shadow(0 0 10px hsl(200 80% 50% / 0.3))']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CopperSpiralIcon className="w-full h-full" />
          
          {/* Star map overlay */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, hsl(200 50% 60% / 0.2), transparent 50%)',
            }}
          />
        </motion.div>
      </div>

      {/* Section 1: THE LORE */}
      <motion.div
        className="p-5 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, hsl(165 30% 12%), hsl(175 25% 10%))',
          border: '1px solid hsl(165 40% 30%)',
          boxShadow: '0 0 30px hsl(165 50% 25% / 0.2)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5" style={{ color: 'hsl(45 80% 60%)' }} />
          <h3 
            className="text-sm font-mono tracking-wider uppercase"
            style={{ color: 'hsl(45 70% 65%)' }}
          >
            THE LORE — The Why
          </h3>
        </div>
        
        <blockquote 
          className="text-base leading-relaxed italic mb-4 pl-4"
          style={{ 
            color: 'hsl(165 40% 75%)',
            borderLeft: '3px solid hsl(165 50% 40%)',
          }}
        >
          "The Ancients did not use chemical fertilizer; they used <span style={{ color: 'hsl(200 80% 70%)' }}>Frequency</span>. 
          The atmosphere is a battery. The Soil is a magnet. 
          We use <span style={{ color: 'hsl(25 70% 60%)' }}>Copper</span> to bridge the two."
        </blockquote>
        
        <div 
          className="p-4 rounded-lg"
          style={{ 
            background: 'hsl(0 0% 8%)',
            border: '1px dashed hsl(200 40% 30%)',
          }}
        >
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: 'hsl(200 90% 65%)' }} />
            <p 
              className="text-sm font-mono leading-relaxed"
              style={{ color: 'hsl(200 30% 70%)' }}
            >
              A copper spiral acts as a <strong style={{ color: 'hsl(200 80% 70%)' }}>vortex</strong>, 
              pulling the "Chi" or "Prana" — atmospheric nitrogen — down into the root zone 
              to stimulate <strong style={{ color: 'hsl(140 60% 60%)' }}>microbial activity</strong>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section 2: THE TECHNIQUE */}
      <motion.div
        className="p-5 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, hsl(25 30% 12%), hsl(20 25% 10%))',
          border: '1px solid hsl(25 40% 35%)',
          boxShadow: '0 0 30px hsl(25 50% 25% / 0.2)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5" style={{ color: 'hsl(25 70% 60%)' }} />
          <h3 
            className="text-sm font-mono tracking-wider uppercase"
            style={{ color: 'hsl(25 60% 65%)' }}
          >
            THE TECHNIQUE — The How
          </h3>
        </div>
        
        {/* Step-by-step instructions */}
        <div className="space-y-4">
          <div 
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: 'hsl(0 0% 10%)' }}
          >
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ 
                background: 'hsl(25 60% 40%)',
                color: 'hsl(0 0% 95%)',
              }}
            >
              1
            </div>
            <p className="text-sm font-mono" style={{ color: 'hsl(25 30% 75%)' }}>
              Wind <strong style={{ color: 'hsl(25 70% 65%)' }}>12-gauge Copper Wire</strong> around a wooden dowel.
            </p>
          </div>
          
          <div 
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: 'hsl(0 0% 10%)' }}
          >
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ 
                background: 'hsl(25 60% 40%)',
                color: 'hsl(0 0% 95%)',
              }}
            >
              2
            </div>
            <div className="flex-1">
              <p className="text-sm font-mono mb-2" style={{ color: 'hsl(25 30% 75%)' }}>
                Follow the <strong style={{ color: 'hsl(25 70% 65%)' }}>Fibonacci Spiral</strong> — the Shell Shape.
              </p>
              <div 
                className="flex items-center gap-2 p-2 rounded"
                style={{ 
                  background: 'hsl(25 40% 15%)',
                  border: '1px solid hsl(25 50% 35%)',
                }}
              >
                <Shell className="w-4 h-4" style={{ color: 'hsl(25 60% 55%)' }} />
                <span className="text-xs font-mono" style={{ color: 'hsl(25 40% 60%)' }}>
                  Mimic nature: Snail Shells / Galaxies / Hurricane Eyes
                </span>
              </div>
            </div>
          </div>
          
          <div 
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: 'hsl(0 0% 10%)' }}
          >
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ 
                background: 'hsl(25 60% 40%)',
                color: 'hsl(0 0% 95%)',
              }}
            >
              3
            </div>
            <p className="text-sm font-mono" style={{ color: 'hsl(25 30% 75%)' }}>
              Place the rod <strong style={{ color: 'hsl(200 70% 65%)' }}>North</strong> of your plant, 
              rooted <strong style={{ color: 'hsl(20 50% 50%)' }}>deep in the clay</strong>.
            </p>
          </div>
        </div>

        {/* Fibonacci emphasis */}
        <div 
          className="mt-4 p-4 rounded-lg text-center"
          style={{
            background: 'linear-gradient(135deg, hsl(275 30% 15%), hsl(200 30% 12%))',
            border: '1px solid hsl(275 40% 35%)',
          }}
        >
          <p 
            className="text-xs font-mono uppercase tracking-wider mb-2"
            style={{ color: 'hsl(275 50% 60%)' }}
          >
            THE FIBONACCI RULE
          </p>
          <p 
            className="text-sm font-mono italic"
            style={{ color: 'hsl(275 40% 75%)' }}
          >
            "The spiral must mimic nature — for it is nature's own blueprint for channeling energy."
          </p>
        </div>
      </motion.div>

      {/* Section 3: THE ACTION ITEM */}
      <motion.div
        className="p-5 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, hsl(200 30% 12%), hsl(210 25% 10%))',
          border: `2px solid ${color}60`,
          boxShadow: `0 0 40px ${color}20`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5" style={{ color }} />
          <h3 
            className="text-sm font-mono tracking-wider uppercase"
            style={{ color }}
          >
            THE ACTION ITEM — The Proof
          </h3>
        </div>
        
        {/* Task */}
        <div 
          className="p-4 rounded-lg mb-4 text-center"
          style={{
            background: `${color}15`,
            border: `1px dashed ${color}50`,
          }}
        >
          <p 
            className="text-xs font-mono uppercase mb-2"
            style={{ color: 'hsl(0 0% 60%)' }}
          >
            YOUR TASK
          </p>
          <p 
            className="text-2xl tracking-wider"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color,
              textShadow: `0 0 20px ${color}40`,
            }}
          >
            INSTALL THE ROD
          </p>
        </div>
        
        {/* Upload requirement */}
        <div 
          className="flex items-center gap-3 p-3 rounded-lg"
          style={{ 
            background: 'hsl(0 0% 8%)',
            border: '1px solid hsl(0 0% 20%)',
          }}
        >
          <Upload className="w-5 h-5" style={{ color: 'hsl(0 0% 60%)' }} />
          <p className="text-sm font-mono" style={{ color: 'hsl(0 0% 70%)' }}>
            Upload a photo of your <strong style={{ color }}>Copper Antenna</strong> installed in a bed.
          </p>
        </div>
        
        {/* Reward */}
        <motion.div 
          className="mt-4 p-4 rounded-lg flex items-center justify-center gap-3"
          style={{
            background: 'linear-gradient(135deg, hsl(45 50% 15%), hsl(40 40% 12%))',
            border: '1px solid hsl(45 60% 40%)',
          }}
          whileHover={{ 
            boxShadow: '0 0 30px hsl(45 70% 50% / 0.3)',
          }}
        >
          <Award className="w-6 h-6" style={{ color: 'hsl(45 80% 60%)' }} />
          <div>
            <p 
              className="text-xs font-mono uppercase"
              style={{ color: 'hsl(45 40% 50%)' }}
            >
              REWARD
            </p>
            <p 
              className="text-lg tracking-wide"
              style={{ 
                fontFamily: "'Staatliches', sans-serif",
                color: 'hsl(45 80% 65%)',
              }}
            >
              FREQUENCY TUNER BADGE
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Visual Reference Note */}
      <motion.div
        className="p-4 rounded-xl text-center"
        style={{
          background: 'hsl(0 0% 8%)',
          border: '1px dashed hsl(0 0% 25%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p 
          className="text-xs font-mono"
          style={{ color: 'hsl(0 0% 50%)' }}
        >
          VISUAL TEXTURE: Oxidized Copper (Green/Teal) • Star Maps
        </p>
      </motion.div>
    </div>
  );
};

export default EthericAntennaModule;
