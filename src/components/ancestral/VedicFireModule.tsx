import { motion } from 'framer-motion';
import { Flame, Sun, Sunrise, Upload, Sparkles, Clock } from 'lucide-react';

/**
 * VEDIC FIRE MODULE (AGNIHOTRA)
 * 
 * PROTOCOL: THE VEDIC FIRE
 * Homa Therapy curriculum for Level 3 (The Dogon Signal)
 * Teaching users about atmospheric purification through sacred fire
 * 
 * Visual Style: Saffron Powder + White Ash + Copper Pyramid
 * Colors: Saffron Orange (#FF6B35), Sacred Ash White (#F5F5F5), Copper (#B87333)
 */

interface VedicFireModuleProps {
  color: string;
  onUploadClick?: () => void;
}

// Copper Pyramid with Flame Icon
const CopperPyramidFlame = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      {/* Copper gradient */}
      <linearGradient id="pyramidCopper" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8B5A2B" />
        <stop offset="50%" stopColor="#B87333" />
        <stop offset="100%" stopColor="#DA8B47" />
      </linearGradient>
      
      {/* Fire gradient */}
      <linearGradient id="agniFlame" x1="50%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stopColor="#FF4500" />
        <stop offset="40%" stopColor="#FF6B35" />
        <stop offset="70%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FFFACD" />
      </linearGradient>
      
      {/* Glow effects */}
      <filter id="flameGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      
      <filter id="ashGlow">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    {/* Pyramid base */}
    <path
      d="M32 8 L56 52 L8 52 Z"
      fill="none"
      stroke="url(#pyramidCopper)"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    
    {/* Inner pyramid lines (depth) */}
    <path
      d="M32 8 L32 52"
      stroke="url(#pyramidCopper)"
      strokeWidth="1.5"
      opacity="0.5"
    />
    <path
      d="M20 35 L44 35"
      stroke="url(#pyramidCopper)"
      strokeWidth="1"
      opacity="0.3"
    />
    
    {/* Agni Flame */}
    <motion.path
      d="M32 48 
         Q 28 42, 30 38 
         Q 26 36, 29 30
         Q 27 28, 32 22
         Q 37 28, 35 30
         Q 38 36, 34 38
         Q 36 42, 32 48"
      fill="url(#agniFlame)"
      filter="url(#flameGlow)"
      animate={{
        d: [
          "M32 48 Q 28 42, 30 38 Q 26 36, 29 30 Q 27 28, 32 22 Q 37 28, 35 30 Q 38 36, 34 38 Q 36 42, 32 48",
          "M32 48 Q 27 43, 29 39 Q 25 35, 30 28 Q 28 26, 32 20 Q 36 26, 34 28 Q 39 35, 35 39 Q 37 43, 32 48",
          "M32 48 Q 28 42, 30 38 Q 26 36, 29 30 Q 27 28, 32 22 Q 37 28, 35 30 Q 38 36, 34 38 Q 36 42, 32 48",
        ],
      }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Inner flame core */}
    <motion.ellipse
      cx="32"
      cy="40"
      rx="3"
      ry="6"
      fill="#FFFACD"
      opacity="0.8"
      animate={{ ry: [6, 8, 6], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
    
    {/* Sacred ash particles rising */}
    {[...Array(5)].map((_, i) => (
      <motion.circle
        key={i}
        cx={28 + i * 2}
        cy={20}
        r="1"
        fill="#F5F5F5"
        filter="url(#ashGlow)"
        animate={{
          cy: [20, 5],
          opacity: [0.8, 0],
          x: [0, (i - 2) * 3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.3,
        }}
      />
    ))}
    
    {/* Sunrise rays behind */}
    <motion.g opacity="0.3">
      <line x1="32" y1="0" x2="32" y2="5" stroke="#FFD700" strokeWidth="1" />
      <line x1="20" y1="3" x2="23" y2="7" stroke="#FFD700" strokeWidth="1" />
      <line x1="44" y1="3" x2="41" y2="7" stroke="#FFD700" strokeWidth="1" />
    </motion.g>
  </svg>
);

// Saffron texture pattern
const SaffronPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
    <defs>
      <pattern id="saffronPattern" patternUnits="userSpaceOnUse" width="20" height="20">
        {/* Saffron threads */}
        <line x1="2" y1="5" x2="8" y2="5" stroke="#FF6B35" strokeWidth="0.5" />
        <line x1="12" y1="12" x2="18" y2="14" stroke="#FF6B35" strokeWidth="0.4" />
        <line x1="5" y1="16" x2="10" y2="18" stroke="#FF6B35" strokeWidth="0.3" />
        {/* Ash specks */}
        <circle cx="15" cy="8" r="0.5" fill="#E0E0E0" />
        <circle cx="8" cy="15" r="0.3" fill="#F5F5F5" />
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#saffronPattern)" />
  </svg>
);

// Sunrise/Sunset time indicator
const SunriseIndicator = ({ isSunrise = true }: { isSunrise?: boolean }) => (
  <motion.div
    className="flex items-center gap-2 px-3 py-1 rounded-full"
    style={{
      background: isSunrise 
        ? 'linear-gradient(90deg, #FF6B3520, #FFD70020)'
        : 'linear-gradient(90deg, #FF450020, #4B008220)',
      border: `1px solid ${isSunrise ? '#FF6B35' : '#FF4500'}50`,
    }}
    animate={{ opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <Sunrise className="w-4 h-4" style={{ color: isSunrise ? '#FFD700' : '#FF4500' }} />
    <span 
      className="text-xs font-mono uppercase"
      style={{ color: isSunrise ? '#FFD700' : '#FF4500' }}
    >
      {isSunrise ? 'SUNRISE' : 'SUNSET'}
    </span>
  </motion.div>
);

const VedicFireModule = ({ color, onUploadClick }: VedicFireModuleProps) => {
  return (
    <div className="space-y-6 relative">
      {/* Module Title */}
      <div className="text-center mb-4">
        <motion.div
          className="inline-block px-4 py-2 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #FF6B3520, #B8733310)',
            border: '1px solid #FF6B3560',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 
            className="text-lg tracking-widest uppercase"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: '#FF6B35',
              textShadow: '0 0 20px #FF6B3540',
            }}
          >
            PROTOCOL: THE VEDIC FIRE
          </h2>
          <p 
            className="text-xs font-mono mt-1"
            style={{ color: '#FFD700' }}
          >
            AGNIHOTRA
          </p>
        </motion.div>
      </div>

      {/* Hero Icon */}
      <div className="flex justify-center mb-6 relative">
        <motion.div
          className="relative w-36 h-36"
          animate={{ 
            filter: ['drop-shadow(0 0 15px #FF450040)', 'drop-shadow(0 0 30px #FF450070)', 'drop-shadow(0 0 15px #FF450040)']
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <CopperPyramidFlame className="w-full h-full" />
        </motion.div>
        
        {/* Prana energy particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 2 === 0 ? '#FFD700' : '#FF6B35',
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.25,
              }}
            />
          ))}
        </div>
      </div>

      {/* Section 1: THE LORE (Agni) */}
      <motion.div
        className="p-5 rounded-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2a1a10, #1a0f05)',
          border: '1px solid #FF6B3550',
          boxShadow: '0 0 40px #FF6B3515',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SaffronPattern />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5" style={{ color: '#FF6B35' }} />
            <h3 
              className="text-sm font-mono tracking-wider uppercase"
              style={{ color: '#FF6B35' }}
            >
              THE LORE — Agni, The Sacred Fire
            </h3>
          </div>
          
          <blockquote 
            className="text-base leading-relaxed italic mb-4 pl-4"
            style={{ 
              color: '#FFE4C4',
              borderLeft: '3px solid #FF6B35',
            }}
          >
            "The Vedas taught that{' '}
            <span style={{ color: '#FFD700', textShadow: '0 0 10px #FFD70060' }}>
              'Heal the atmosphere, and the atmosphere heals you.'
            </span>{' '}
            We use the{' '}
            <span style={{ color: '#B87333' }}>Copper Pyramid</span>{' '}
            and the{' '}
            <span style={{ color: '#FF4500' }}>Fire (Agni)</span>{' '}
            to cleanse the air of pollution and charge the soil with{' '}
            <span style={{ color: '#FFD700' }}>Prana</span>."
          </blockquote>
          
          {/* Agnihotra concept */}
          <div 
            className="p-4 rounded-lg"
            style={{ 
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px dashed #FFD70040',
            }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sun className="w-6 h-6" style={{ color: '#FFD700' }} />
              </motion.div>
              <div>
                <p 
                  className="text-sm font-mono font-bold mb-1"
                  style={{ color: '#FFD700' }}
                >
                  AGNIHOTRA — The Circadian Reset
                </p>
                <p 
                  className="text-sm font-mono leading-relaxed"
                  style={{ color: '#FFE4C4' }}
                >
                  Burning specific ingredients at{' '}
                  <strong style={{ color: '#FF6B35' }}>sunrise</strong>{' '}
                  and{' '}
                  <strong style={{ color: '#FF4500' }}>sunset</strong>{' '}
                  resets the farm's circadian rhythm and purifies the biosphere.
                </p>
              </div>
            </div>
            
            {/* Sunrise/Sunset indicators */}
            <div className="flex gap-3 mt-3 justify-center">
              <SunriseIndicator isSunrise={true} />
              <SunriseIndicator isSunrise={false} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 2: THE TECHNIQUE (The Ash) */}
      <motion.div
        className="p-5 rounded-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a, #0f0f0f)',
          border: '1px solid #F5F5F580',
          boxShadow: '0 0 30px #F5F5F510',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: '#F5F5F5' }} />
            <h3 
              className="text-sm font-mono tracking-wider uppercase"
              style={{ color: '#E0E0E0' }}
            >
              THE TECHNIQUE — The Sacred Ash
            </h3>
          </div>
          
          {/* Step-by-step instructions */}
          <div className="space-y-4">
            {/* Step 1: The Burning */}
            <div 
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: 'rgba(255, 107, 53, 0.1)' }}
            >
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono"
                style={{ 
                  background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                  color: '#FFF',
                  boxShadow: '0 0 10px #FF6B3550',
                }}
              >
                1
              </div>
              <div>
                <p className="text-sm font-mono" style={{ color: '#FFE4C4' }}>
                  Burn{' '}
                  <strong style={{ color: '#8B4513' }}>dried dung</strong>{' '}
                  and{' '}
                  <strong style={{ color: '#FFD700' }}>ghee</strong>{' '}
                  in a{' '}
                  <strong style={{ color: '#B87333' }}>copper pyramid</strong>
                </p>
                <div 
                  className="mt-2 flex items-center gap-2 p-2 rounded"
                  style={{ 
                    background: '#FFD70015',
                    border: '1px solid #FFD70040',
                  }}
                >
                  <Clock className="w-4 h-4" style={{ color: '#FFD700' }} />
                  <span className="text-xs font-mono" style={{ color: '#FFD700' }}>
                    AT THE EXACT SECOND OF SUNRISE
                  </span>
                </div>
              </div>
            </div>
            
            {/* Step 2: The Collection */}
            <div 
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: 'rgba(245, 245, 245, 0.05)' }}
            >
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono"
                style={{ 
                  background: 'linear-gradient(135deg, #E0E0E0, #BDBDBD)',
                  color: '#333',
                  boxShadow: '0 0 10px #F5F5F530',
                }}
              >
                2
              </div>
              <div className="flex-1">
                <p className="text-sm font-mono" style={{ color: '#E0E0E0' }}>
                  Collect the Ash — This is not waste, it is{' '}
                  <strong style={{ color: '#F5F5F5', textShadow: '0 0 5px #F5F5F560' }}>
                    Vibhuti
                  </strong>{' '}
                  <span style={{ color: '#BDBDBD' }}>(Sacred Ash)</span>
                </p>
              </div>
            </div>
            
            {/* Step 3: The Application */}
            <div 
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: 'rgba(139, 195, 74, 0.1)' }}
            >
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono"
                style={{ 
                  background: 'linear-gradient(135deg, #8BC34A, #689F38)',
                  color: '#FFF',
                  boxShadow: '0 0 10px #8BC34A50',
                }}
              >
                3
              </div>
              <div className="flex-1">
                <p className="text-sm font-mono" style={{ color: '#C5E1A5' }}>
                  <strong style={{ color: '#8BC34A' }}>Sprinkle on your seeds</strong>{' '}
                  to immunize them against disease
                </p>
              </div>
            </div>
          </div>

          {/* The Science */}
          <div 
            className="mt-5 p-4 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #1E88E510, #0D47A108)',
              border: '1px solid #64B5F640',
            }}
          >
            <p 
              className="text-xs font-mono uppercase tracking-wider mb-2"
              style={{ color: '#64B5F6' }}
            >
              ⚗️ THE SCIENCE — Homa Ash Properties
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              <span 
                className="px-2 py-1 rounded text-xs font-mono"
                style={{ background: '#F5F5F520', color: '#F5F5F5', border: '1px solid #F5F5F540' }}
              >
                HIGHLY ALKALINE
              </span>
              <span 
                className="px-2 py-1 rounded text-xs font-mono"
                style={{ background: '#FFD70020', color: '#FFD700', border: '1px solid #FFD70040' }}
              >
                RICH IN PHOSPHORUS
              </span>
            </div>
            <p 
              className="text-sm font-mono leading-relaxed"
              style={{ color: '#90CAF9' }}
            >
              Homa Ash acts as a{' '}
              <strong style={{ color: '#4CAF50' }}>"Vaccine" for plants</strong>{' '}
              — boosting immunity and accelerating germination.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section 3: THE ACTION ITEM (The Ritual) */}
      <motion.div
        className="p-5 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #1a1510, #0f0d0a)',
          border: '2px solid #FF6B3550',
          boxShadow: '0 0 50px #FF6B3515',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5" style={{ color: '#FF6B35' }} />
          <h3 
            className="text-sm font-mono tracking-wider uppercase"
            style={{ color: '#FF6B35' }}
          >
            THE ACTION ITEM — The Ritual
          </h3>
        </div>
        
        {/* Challenge */}
        <div 
          className="p-5 rounded-lg mb-4 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FF6B3510, #FFD70008)',
            border: '1px dashed #FF6B3550',
          }}
        >
          {/* Sunrise gradient overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(180deg, #FFD700, #FF6B35, #FF4500, transparent)',
            }}
          />
          
          <p 
            className="text-xs font-mono uppercase mb-2 relative z-10"
            style={{ color: '#FFE4C4' }}
          >
            THE CHALLENGE
          </p>
          <motion.p 
            className="text-3xl tracking-wider relative z-10"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: '#FF6B35',
              textShadow: '0 0 30px #FF6B3560',
            }}
            animate={{ textShadow: ['0 0 20px #FF6B3540', '0 0 40px #FF6B3570', '0 0 20px #FF6B3540'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            PERFORM THE HOMA
          </motion.p>
        </div>
        
        {/* Drop Zone description */}
        <div 
          className="flex items-center gap-3 p-4 rounded-lg"
          style={{ 
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid #B8733340',
          }}
        >
          <Upload className="w-6 h-6" style={{ color: '#B87333' }} />
          <p className="text-sm font-mono" style={{ color: '#FFE4C4' }}>
            Upload a photo of your{' '}
            <strong style={{ color: '#B87333' }}>Copper Pyramid ritual</strong>{' '}
            or your jar of collected{' '}
            <strong style={{ color: '#F5F5F5' }}>Agnihotra Ash</strong>.
          </p>
        </div>
        
        {/* Visual reference hint */}
        <div 
          className="mt-4 p-3 rounded-lg flex items-center justify-center gap-4"
          style={{
            background: 'linear-gradient(90deg, #FF450010, #FFD70015, #FF450010)',
            border: '1px solid #FFD70030',
          }}
        >
          <div className="flex items-center gap-2">
            <CopperPyramidFlame className="w-8 h-8" />
            <span 
              className="text-xs font-mono"
              style={{ color: '#B87333' }}
            >
              Copper Pyramid
            </span>
          </div>
          <span style={{ color: '#5D4037' }}>+</span>
          <div className="flex items-center gap-2">
            <Sunrise className="w-5 h-5" style={{ color: '#FFD700' }} />
            <span 
              className="text-xs font-mono"
              style={{ color: '#FFD700' }}
            >
              Sunrise
            </span>
          </div>
        </div>
        
        {/* Reward - Homa Keeper Badge */}
        <motion.div 
          className="mt-5 p-4 rounded-lg flex items-center justify-center gap-4"
          style={{
            background: 'linear-gradient(135deg, #FF6B3520, #F5F5F510)',
            border: '1px solid #FF6B3580',
          }}
          whileHover={{ 
            boxShadow: '0 0 40px #FF6B3530',
            borderColor: '#FF6B3560',
          }}
        >
          {/* Badge Icon */}
          <motion.div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #FFD700)',
              boxShadow: '0 0 20px #FF6B3540',
            }}
            animate={{ 
              boxShadow: ['0 0 15px #FF6B3530', '0 0 25px #FFD70050', '0 0 15px #FF6B3530']
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <CopperPyramidFlame className="w-10 h-10" />
          </motion.div>
          
          <div>
            <p 
              className="text-xs font-mono uppercase tracking-wider"
              style={{ color: '#FF6B35' }}
            >
              REWARD
            </p>
            <p 
              className="text-xl tracking-wide"
              style={{ 
                fontFamily: "'Staatliches', sans-serif",
                color: '#FFD700',
                textShadow: '0 0 15px #FFD70040',
              }}
            >
              HOMA KEEPER BADGE
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Visual Reference Note */}
      <motion.div
        className="p-3 rounded-xl text-center"
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px dashed #FF6B3530',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p 
          className="text-xs font-mono"
          style={{ color: '#FF6B3580' }}
        >
          VISUAL: Saffron Powder • White Ash (Vibhuti) • Copper Pyramid • Agni Flame (#FF4500)
        </p>
      </motion.div>
    </div>
  );
};

export default VedicFireModule;
