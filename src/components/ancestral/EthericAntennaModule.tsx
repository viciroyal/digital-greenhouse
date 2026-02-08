import { motion } from 'framer-motion';
import { Zap, Compass, Leaf, Star, Shell, Upload, Award, ArrowUp } from 'lucide-react';

/**
 * THE ETHERIC ANTENNA MODULE
 * 
 * PROTOCOL: THE ETHERIC ANTENNA
 * Electroculture curriculum for Level 3 (The Dogon Signal)
 * Teaching users to build Earth Antennas using copper spirals
 * 
 * Visual Style: Oxidized Copper (Green Verdigris) + Star Maps
 * Electric Color: #00FFFF (Cyan/Teal)
 */

interface EthericAntennaModuleProps {
  color: string;
  onUploadClick?: () => void;
}

// Copper Spiral Icon - Glowing with Teal/Electric Blue sparks (#00FFFF)
const CopperSpiralIcon = ({ className = "", glowing = true }: { className?: string; glowing?: boolean }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      {/* Oxidized Copper Gradient - Green Verdigris */}
      <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B87333" /> {/* Raw Copper */}
        <stop offset="40%" stopColor="#4A9B7F" /> {/* Verdigris Green */}
        <stop offset="100%" stopColor="#2D6A5D" /> {/* Deep Oxidized */}
      </linearGradient>
      <filter id="electricGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="cyanGlow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    {/* Fibonacci Spiral - The Copper Coil */}
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
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
      filter={glowing ? "url(#electricGlow)" : undefined}
    />
    
    {/* Electric arcs - Cyan (#00FFFF) */}
    {glowing && (
      <>
        {/* Top arc - reaching to sky */}
        <motion.path
          d="M32 2 L30 6 L34 8 L31 12"
          stroke="#00FFFF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          filter="url(#cyanGlow)"
          animate={{ opacity: [0.4, 1, 0.4], pathLength: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        {/* Right arc */}
        <motion.path
          d="M60 28 L56 30 L58 34 L54 32"
          stroke="#00FFFF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          filter="url(#cyanGlow)"
          animate={{ opacity: [0.5, 1, 0.5], pathLength: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        {/* Left arc */}
        <motion.path
          d="M4 32 L8 30 L6 26 L10 28"
          stroke="#00FFFF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          filter="url(#cyanGlow)"
          animate={{ opacity: [0.3, 0.9, 0.3], pathLength: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
        />
        {/* Spark particles */}
        <motion.circle
          cx="28" cy="4"
          r="1.5"
          fill="#00FFFF"
          filter="url(#cyanGlow)"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
        />
        <motion.circle
          cx="58" cy="36"
          r="1"
          fill="#00FFFF"
          filter="url(#cyanGlow)"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: 0.5 }}
        />
      </>
    )}
    
    {/* Ground stake - deep in clay */}
    <path
      d="M32 52 L32 62"
      stroke="#5D4037"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M26 62 L38 62"
      stroke="#5D4037"
      strokeWidth="2"
    />
    {/* Clay indication */}
    <ellipse cx="32" cy="62" rx="8" ry="2" fill="#8D6E63" opacity="0.5" />
  </svg>
);

// Star map background pattern
const StarMapPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
    <defs>
      <pattern id="starPattern" patternUnits="userSpaceOnUse" width="20" height="20">
        <circle cx="2" cy="2" r="0.5" fill="#00FFFF" />
        <circle cx="10" cy="8" r="0.3" fill="#4A9B7F" />
        <circle cx="18" cy="15" r="0.4" fill="#00FFFF" />
        <circle cx="5" cy="18" r="0.3" fill="#4A9B7F" />
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#starPattern)" />
  </svg>
);

const EthericAntennaModule = ({ color, onUploadClick }: EthericAntennaModuleProps) => {
  return (
    <div className="space-y-6 relative">
      {/* Module Title */}
      <div className="text-center mb-4">
        <motion.div
          className="inline-block px-4 py-2 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #4A9B7F20, #00FFFF10)',
            border: '1px solid #4A9B7F60',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 
            className="text-lg tracking-widest uppercase"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: '#4A9B7F',
              textShadow: '0 0 20px #00FFFF40',
            }}
          >
            PROTOCOL: THE ETHERIC ANTENNA
          </h2>
        </motion.div>
      </div>

      {/* Hero Icon with Star Map */}
      <div className="flex justify-center mb-6 relative">
        <motion.div
          className="relative w-36 h-36"
          animate={{ 
            filter: ['drop-shadow(0 0 15px #00FFFF40)', 'drop-shadow(0 0 30px #00FFFF70)', 'drop-shadow(0 0 15px #00FFFF40)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CopperSpiralIcon className="w-full h-full" />
          
          {/* Star map overlay */}
          <div 
            className="absolute -inset-4 opacity-40 pointer-events-none rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #00FFFF20, transparent 60%)',
            }}
          />
        </motion.div>
      </div>

      {/* Section 1: THE LORE */}
      <motion.div
        className="p-5 rounded-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a2f2a, #0f1f1c)',
          border: '1px solid #4A9B7F50',
          boxShadow: '0 0 40px #4A9B7F15',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StarMapPattern />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5" style={{ color: '#FFD700' }} />
            <h3 
              className="text-sm font-mono tracking-wider uppercase"
              style={{ color: '#FFD700' }}
            >
              THE LORE — The Why
            </h3>
          </div>
          
          <blockquote 
            className="text-base leading-relaxed italic mb-4 pl-4"
            style={{ 
              color: '#A8D5BA',
              borderLeft: '3px solid #4A9B7F',
            }}
          >
            "The Ancients did not force growth with chemicals; they invited it with{' '}
            <span style={{ color: '#00FFFF', textShadow: '0 0 10px #00FFFF60' }}>Frequency</span>. 
            The atmosphere is a{' '}
            <span className="font-mono" style={{ color: '#00FFFF' }}>300,000-volt battery</span>. 
            The Clay is a magnet. 
            We use <span style={{ color: '#B87333' }}>Copper</span> to bridge the two."
          </blockquote>
          
          <div 
            className="p-4 rounded-lg"
            style={{ 
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px dashed #00FFFF40',
            }}
          >
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#00FFFF' }} />
              <p 
                className="text-sm font-mono leading-relaxed"
                style={{ color: '#7EC8A3' }}
              >
                A copper spiral acts as a{' '}
                <strong style={{ color: '#00FFFF' }}>vortex</strong>, 
                pulling atmospheric nitrogen and "Chi" down into the root zone 
                to <strong style={{ color: '#4ADE80' }}>wake up the microbes</strong>.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 2: THE TECHNIQUE */}
      <motion.div
        className="p-5 rounded-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2a1f1a, #1f150f)',
          border: '1px solid #B8733380',
          boxShadow: '0 0 30px #B8733320',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5" style={{ color: '#B87333' }} />
          <h3 
            className="text-sm font-mono tracking-wider uppercase"
            style={{ color: '#D4A574' }}
          >
            THE TECHNIQUE — The How
          </h3>
        </div>
        
        {/* Step-by-step instructions */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div 
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono"
              style={{ 
                background: 'linear-gradient(135deg, #B87333, #8B5A2B)',
                color: '#FFF',
                boxShadow: '0 0 10px #B8733350',
              }}
            >
              1
            </div>
            <div>
              <p className="text-sm font-mono" style={{ color: '#D4A574' }}>
                Acquire materials:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span 
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{ background: '#B8733320', color: '#B87333', border: '1px solid #B8733350' }}
                >
                  12-GAUGE COPPER WIRE
                </span>
                <span 
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{ background: '#5D403720', color: '#8D6E63', border: '1px solid #5D403750' }}
                >
                  WOODEN DOWEL
                </span>
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div 
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono"
              style={{ 
                background: 'linear-gradient(135deg, #B87333, #8B5A2B)',
                color: '#FFF',
                boxShadow: '0 0 10px #B8733350',
              }}
            >
              2
            </div>
            <div className="flex-1">
              <p className="text-sm font-mono mb-2" style={{ color: '#D4A574' }}>
                Wind the wire in a{' '}
                <strong style={{ color: '#B87333' }}>Fibonacci Spiral</strong>
              </p>
              <div 
                className="flex items-center gap-2 p-2 rounded"
                style={{ 
                  background: 'linear-gradient(135deg, #4A9B7F15, #B8733310)',
                  border: '1px solid #4A9B7F40',
                }}
              >
                <Shell className="w-5 h-5" style={{ color: '#4A9B7F' }} />
                <span className="text-xs font-mono" style={{ color: '#7EC8A3' }}>
                  Mimic the Snail Shell or Galaxy spiral
                </span>
              </div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div 
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono"
              style={{ 
                background: 'linear-gradient(135deg, #B87333, #8B5A2B)',
                color: '#FFF',
                boxShadow: '0 0 10px #B8733350',
              }}
            >
              3
            </div>
            <div className="flex-1">
              <p className="text-sm font-mono" style={{ color: '#D4A574' }}>
                Plant the rod{' '}
                <strong style={{ color: '#00FFFF' }}>NORTH</strong>{' '}
                of your crop, rooted{' '}
                <strong style={{ color: '#8D6E63' }}>deep in the clay</strong>.
              </p>
              <div 
                className="mt-2 flex items-center gap-2 p-2 rounded"
                style={{ 
                  background: '#00FFFF10',
                  border: '1px solid #00FFFF30',
                }}
              >
                <ArrowUp className="w-4 h-4" style={{ color: '#00FFFF' }} />
                <span className="text-xs font-mono" style={{ color: '#00FFFF' }}>
                  THE SPIRAL MUST FACE THE SKY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fibonacci emphasis */}
        <div 
          className="mt-5 p-4 rounded-lg text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #4A9B7F15, #00FFFF08)',
            border: '1px solid #4A9B7F40',
          }}
        >
          <p 
            className="text-xs font-mono uppercase tracking-wider mb-2"
            style={{ color: '#4A9B7F' }}
          >
            THE FIBONACCI RULE
          </p>
          <p 
            className="text-sm font-mono italic"
            style={{ color: '#A8D5BA' }}
          >
            "The spiral must mimic nature — for it is nature's own blueprint for channeling energy."
          </p>
        </div>
      </motion.div>

      {/* Section 3: THE ACTION ITEM */}
      <motion.div
        className="p-5 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #0f1a1f, #0a1015)',
          border: '2px solid #00FFFF50',
          boxShadow: '0 0 50px #00FFFF15',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5" style={{ color: '#00FFFF' }} />
          <h3 
            className="text-sm font-mono tracking-wider uppercase"
            style={{ color: '#00FFFF' }}
          >
            THE ACTION ITEM — The Proof
          </h3>
        </div>
        
        {/* Challenge */}
        <div 
          className="p-5 rounded-lg mb-4 text-center"
          style={{
            background: 'linear-gradient(135deg, #00FFFF10, #4A9B7F08)',
            border: '1px dashed #00FFFF50',
          }}
        >
          <p 
            className="text-xs font-mono uppercase mb-2"
            style={{ color: '#7EC8A3' }}
          >
            THE CHALLENGE
          </p>
          <motion.p 
            className="text-3xl tracking-wider"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: '#00FFFF',
              textShadow: '0 0 30px #00FFFF60',
            }}
            animate={{ textShadow: ['0 0 20px #00FFFF40', '0 0 40px #00FFFF70', '0 0 20px #00FFFF40'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            INSTALL THE ROD
          </motion.p>
        </div>
        
        {/* Drop Zone description */}
        <div 
          className="flex items-center gap-3 p-4 rounded-lg"
          style={{ 
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid #4A9B7F40',
          }}
        >
          <Upload className="w-6 h-6" style={{ color: '#4A9B7F' }} />
          <p className="text-sm font-mono" style={{ color: '#A8D5BA' }}>
            Upload a photo of your{' '}
            <strong style={{ color: '#B87333' }}>Copper Antenna</strong>{' '}
            installed in a garden bed.
          </p>
        </div>
        
        {/* Reward - Frequency Tuner Badge */}
        <motion.div 
          className="mt-5 p-4 rounded-lg flex items-center justify-center gap-4"
          style={{
            background: 'linear-gradient(135deg, #B8733320, #00FFFF10)',
            border: '1px solid #B8733380',
          }}
          whileHover={{ 
            boxShadow: '0 0 40px #00FFFF30',
            borderColor: '#00FFFF60',
          }}
        >
          {/* Badge Icon - Glowing Copper Coil */}
          <motion.div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #B87333, #4A9B7F)',
              boxShadow: '0 0 20px #00FFFF40',
            }}
            animate={{ 
              boxShadow: ['0 0 15px #00FFFF30', '0 0 25px #00FFFF50', '0 0 15px #00FFFF30']
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <CopperSpiralIcon className="w-10 h-10" glowing={true} />
          </motion.div>
          
          <div>
            <p 
              className="text-xs font-mono uppercase tracking-wider"
              style={{ color: '#B87333' }}
            >
              REWARD
            </p>
            <p 
              className="text-xl tracking-wide"
              style={{ 
                fontFamily: "'Staatliches', sans-serif",
                color: '#00FFFF',
                textShadow: '0 0 15px #00FFFF40',
              }}
            >
              FREQUENCY TUNER BADGE
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Visual Reference Note */}
      <motion.div
        className="p-3 rounded-xl text-center"
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px dashed #4A9B7F30',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p 
          className="text-xs font-mono"
          style={{ color: '#4A9B7F80' }}
        >
          VISUAL: Oxidized Copper (Green Verdigris) • Star Maps • Electric Cyan (#00FFFF)
        </p>
      </motion.div>
    </div>
  );
};

export default EthericAntennaModule;
