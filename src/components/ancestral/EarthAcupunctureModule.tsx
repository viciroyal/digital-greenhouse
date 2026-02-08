import { motion } from 'framer-motion';
import { Droplets, Wind, MapPin, Upload, Compass } from 'lucide-react';

/**
 * EARTH ACUPUNCTURE MODULE
 * 
 * PROTOCOL: EARTH ACUPUNCTURE
 * TCM/Feng Shui curriculum for Level 3 (The Dogon Signal)
 * Teaching users to map garden meridians and place copper "needles"
 * 
 * Visual Style: Bamboo Slats + Red Cinnabar Ink
 * Colors: Cinnabar Red (#E74C3C), Jade Green (#27AE60), Soil Brown
 */

interface EarthAcupunctureModuleProps {
  color: string;
  onUploadClick?: () => void;
}

// Yin-Yang Icon made of Soil and Water
const YinYangSoilWater = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      {/* Soil gradient (Yang - Earth) */}
      <linearGradient id="soilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5D4037" />
        <stop offset="50%" stopColor="#6D4C41" />
        <stop offset="100%" stopColor="#4E342E" />
      </linearGradient>
      
      {/* Water gradient (Yin - Water) */}
      <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E88E5" />
        <stop offset="50%" stopColor="#42A5F5" />
        <stop offset="100%" stopColor="#0D47A1" />
      </linearGradient>
      
      {/* Cinnabar glow */}
      <filter id="cinnabarGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      
      {/* Jade glow */}
      <filter id="jadeGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    {/* Outer circle - Cinnabar border */}
    <circle
      cx="32"
      cy="32"
      r="30"
      fill="none"
      stroke="#C0392B"
      strokeWidth="2"
      filter="url(#cinnabarGlow)"
    />
    
    {/* Yin (Water) - Right half */}
    <path
      d="M32 2 A30 30 0 0 1 32 62 A15 15 0 0 1 32 32 A15 15 0 0 0 32 2"
      fill="url(#waterGradient)"
    />
    
    {/* Yang (Soil) - Left half */}
    <path
      d="M32 2 A30 30 0 0 0 32 62 A15 15 0 0 0 32 32 A15 15 0 0 1 32 2"
      fill="url(#soilGradient)"
    />
    
    {/* Small circles - reversed colors */}
    <circle cx="32" cy="17" r="4" fill="url(#waterGradient)" />
    <circle cx="32" cy="47" r="4" fill="url(#soilGradient)" />
    
    {/* Copper needle in center */}
    <line
      x1="32"
      y1="26"
      x2="32"
      y2="38"
      stroke="#B87333"
      strokeWidth="2"
      strokeLinecap="round"
      filter="url(#jadeGlow)"
    />
    <circle cx="32" cy="25" r="2" fill="#B87333" />
  </svg>
);

// Bamboo texture pattern
const BambooPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
    <defs>
      <pattern id="bambooPattern" patternUnits="userSpaceOnUse" width="15" height="40">
        {/* Bamboo segments */}
        <rect x="5" y="0" width="5" height="38" fill="#8BC34A" opacity="0.3" rx="1" />
        <line x1="5" y1="10" x2="10" y2="10" stroke="#689F38" strokeWidth="0.5" />
        <line x1="5" y1="20" x2="10" y2="20" stroke="#689F38" strokeWidth="0.5" />
        <line x1="5" y1="30" x2="10" y2="30" stroke="#689F38" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#bambooPattern)" />
  </svg>
);

// Dragon Vein / Meridian line SVG
const MeridianLines = () => (
  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 200 100">
    <defs>
      <linearGradient id="meridianGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E74C3C" stopOpacity="0" />
        <stop offset="50%" stopColor="#E74C3C" stopOpacity="1" />
        <stop offset="100%" stopColor="#E74C3C" stopOpacity="0" />
      </linearGradient>
    </defs>
    <motion.path
      d="M0 50 Q 50 30, 100 50 T 200 50"
      stroke="url(#meridianGrad)"
      strokeWidth="2"
      fill="none"
      strokeDasharray="5,5"
      animate={{ strokeDashoffset: [0, -20] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
    <motion.path
      d="M0 70 Q 50 90, 100 70 T 200 70"
      stroke="url(#meridianGrad)"
      strokeWidth="1.5"
      fill="none"
      strokeDasharray="3,3"
      animate={{ strokeDashoffset: [0, -15] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

const EarthAcupunctureModule = ({ color, onUploadClick }: EarthAcupunctureModuleProps) => {
  return (
    <div className="space-y-6 relative">
      {/* Module Title */}
      <div className="text-center mb-4">
        <motion.div
          className="inline-block px-4 py-2 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #C0392B20, #27AE6010)',
            border: '1px solid #C0392B60',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 
            className="text-lg tracking-widest uppercase"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: '#E74C3C',
              textShadow: '0 0 20px #E74C3C40',
            }}
          >
            PROTOCOL: EARTH ACUPUNCTURE
          </h2>
        </motion.div>
      </div>

      {/* Hero Icon */}
      <div className="flex justify-center mb-6 relative">
        <motion.div
          className="relative w-32 h-32"
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <YinYangSoilWater className="w-full h-full" />
        </motion.div>
        
        {/* Qi flow particles */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ width: '8rem', height: '8rem' }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? '#27AE60' : '#E74C3C',
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * 60 * Math.PI / 180) * 50],
                y: [0, Math.sin(i * 60 * Math.PI / 180) * 50],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Section 1: THE LORE (The Yellow Emperor) */}
      <motion.div
        className="p-5 rounded-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2a1a1a, #1a0f0f)',
          border: '1px solid #C0392B50',
          boxShadow: '0 0 40px #C0392B15',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <BambooPattern />
        <MeridianLines />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5" style={{ color: '#E74C3C' }} />
            <h3 
              className="text-sm font-mono tracking-wider uppercase"
              style={{ color: '#E74C3C' }}
            >
              THE LORE — The Yellow Emperor
            </h3>
          </div>
          
          <blockquote 
            className="text-base leading-relaxed italic mb-4 pl-4"
            style={{ 
              color: '#F5D6C6',
              borderLeft: '3px solid #C0392B',
            }}
          >
            "The Yellow Emperor taught that the body has{' '}
            <span style={{ color: '#E74C3C', textShadow: '0 0 10px #E74C3C60' }}>Meridians</span>{' '}
            where <span style={{ color: '#27AE60' }}>Qi</span> flows. 
            The Land is a body. If the soil is compacted, the Qi is blocked. 
            We use{' '}
            <span style={{ color: '#B87333' }}>Copper Rods</span>{' '}
            as needles to open the flow."
          </blockquote>
          
          {/* Dragon Veins concept */}
          <div 
            className="p-4 rounded-lg"
            style={{ 
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px dashed #27AE6040',
            }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path
                    d="M12 2 Q 6 8, 12 12 T 12 22"
                    stroke="#27AE60"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 6 L12 2 L16 6"
                    stroke="#27AE60"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <div>
                <p 
                  className="text-sm font-mono font-bold mb-1"
                  style={{ color: '#27AE60' }}
                >
                  DRAGON VEINS (Telluric Currents)
                </p>
                <p 
                  className="text-sm font-mono leading-relaxed"
                  style={{ color: '#A8D5BA' }}
                >
                  A farm has energy lines just like a human body. 
                  These underground currents carry the Earth's vital force.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 2: THE TECHNIQUE (The Feng Shui) */}
      <motion.div
        className="p-5 rounded-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a2a1a, #0f1a0f)',
          border: '1px solid #27AE6080',
          boxShadow: '0 0 30px #27AE6020',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <BambooPattern />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Wind className="w-5 h-5" style={{ color: '#27AE60' }} />
            <h3 
              className="text-sm font-mono tracking-wider uppercase"
              style={{ color: '#8BC34A' }}
            >
              THE TECHNIQUE — The Feng Shui
            </h3>
          </div>
          
          {/* Main instruction */}
          <div 
            className="p-4 rounded-lg mb-4"
            style={{
              background: 'linear-gradient(135deg, #27AE6015, #1a2a1a)',
              border: '1px solid #27AE6040',
            }}
          >
            <p 
              className="text-sm font-mono leading-relaxed"
              style={{ color: '#C8E6C9' }}
            >
              "<strong style={{ color: '#E74C3C' }}>Do not place your Antennas at random.</strong>{' '}
              Observe the flow of{' '}
              <span className="inline-flex items-center gap-1">
                <Droplets className="w-4 h-4 inline" style={{ color: '#42A5F5' }} />
                <span style={{ color: '#42A5F5' }}>Water</span>
              </span>{' '}
              and{' '}
              <span className="inline-flex items-center gap-1">
                <Wind className="w-4 h-4 inline" style={{ color: '#90CAF9' }} />
                <span style={{ color: '#90CAF9' }}>Wind</span>
              </span>."
            </p>
          </div>
          
          {/* Stagnant Points instruction */}
          <div 
            className="flex items-start gap-3 p-4 rounded-lg mb-4"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <MapPin className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#E74C3C' }} />
            <div>
              <p 
                className="text-sm font-mono mb-2"
                style={{ color: '#F5D6C6' }}
              >
                Place your{' '}
                <span style={{ color: '#B87333' }}>Copper Spiral</span>{' '}
                at the{' '}
                <strong style={{ color: '#E74C3C' }}>"STAGNANT POINTS"</strong>:
              </p>
              <ul className="space-y-2 text-sm font-mono" style={{ color: '#A8D5BA' }}>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#42A5F5' }}>💧</span>
                  Where water pools or drains slowly
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#8D6E63' }}>🌱</span>
                  Where growth is slow or stunted
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: '#78909C' }}>🪨</span>
                  Where soil is compacted and hard
                </li>
              </ul>
            </div>
          </div>
          
          {/* The Science */}
          <div 
            className="p-4 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #0D47A115, #1a2a1a)',
              border: '1px solid #1E88E540',
            }}
          >
            <p 
              className="text-xs font-mono uppercase tracking-wider mb-2"
              style={{ color: '#64B5F6' }}
            >
              ⚡ THE SCIENCE — Galvanic Response
            </p>
            <p 
              className="text-sm font-mono leading-relaxed"
              style={{ color: '#90CAF9' }}
            >
              Copper creates a{' '}
              <strong style={{ color: '#00FFFF' }}>micro-voltage jumpstart</strong>{' '}
              in "dead zones" — reactivating dormant soil biology 
              through electrochemical stimulation.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section 3: THE ACTION ITEM (The Diagnosis) */}
      <motion.div
        className="p-5 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #1a1510, #0f0d0a)',
          border: '2px solid #C0392B50',
          boxShadow: '0 0 50px #C0392B15',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5" style={{ color: '#E74C3C' }} />
          <h3 
            className="text-sm font-mono tracking-wider uppercase"
            style={{ color: '#E74C3C' }}
          >
            THE ACTION ITEM — The Diagnosis
          </h3>
        </div>
        
        {/* Challenge */}
        <div 
          className="p-5 rounded-lg mb-4 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #C0392B10, #27AE6008)',
            border: '1px dashed #C0392B50',
          }}
        >
          {/* Meridian overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              <path
                d="M0 30 Q 50 10, 100 30 T 200 30"
                stroke="#E74C3C"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,4"
              />
            </svg>
          </div>
          
          <p 
            className="text-xs font-mono uppercase mb-2 relative z-10"
            style={{ color: '#A8D5BA' }}
          >
            THE CHALLENGE
          </p>
          <motion.p 
            className="text-3xl tracking-wider relative z-10"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: '#E74C3C',
              textShadow: '0 0 30px #E74C3C60',
            }}
            animate={{ textShadow: ['0 0 20px #E74C3C40', '0 0 40px #E74C3C70', '0 0 20px #E74C3C40'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            MAP THE MERIDIANS
          </motion.p>
        </div>
        
        {/* Drop Zone description */}
        <div 
          className="flex items-center gap-3 p-4 rounded-lg"
          style={{ 
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid #27AE6040',
          }}
        >
          <Upload className="w-6 h-6" style={{ color: '#27AE60' }} />
          <p className="text-sm font-mono" style={{ color: '#C8E6C9' }}>
            Upload a{' '}
            <strong style={{ color: '#F5D6C6' }}>sketch of your garden layout</strong>{' '}
            marking the{' '}
            <strong style={{ color: '#E74C3C' }}>"Stagnant Zones"</strong>{' '}
            where you will place your needles.
          </p>
        </div>
        
        {/* Visual reference hint */}
        <div 
          className="mt-4 p-3 rounded-lg flex items-center justify-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #1E88E515, #C0392B10)',
            border: '1px solid #64B5F640',
          }}
        >
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#42A5F5" strokeWidth="1.5" fill="none" />
              <path d="M12 2 Q 6 8, 12 12 T 12 22" stroke="#E74C3C" strokeWidth="1.5" fill="none" />
            </svg>
            <span 
              className="text-xs font-mono"
              style={{ color: '#90CAF9' }}
            >
              Acupuncture Chart
            </span>
          </div>
          <span style={{ color: '#5D4037' }}>+</span>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <rect x="2" y="2" width="20" height="20" stroke="#8BC34A" strokeWidth="1.5" fill="none" rx="2" />
              <line x1="2" y1="8" x2="22" y2="8" stroke="#8BC34A" strokeWidth="0.5" />
              <line x1="2" y1="14" x2="22" y2="14" stroke="#8BC34A" strokeWidth="0.5" />
              <line x1="8" y1="2" x2="8" y2="22" stroke="#8BC34A" strokeWidth="0.5" />
              <line x1="16" y1="2" x2="16" y2="22" stroke="#8BC34A" strokeWidth="0.5" />
            </svg>
            <span 
              className="text-xs font-mono"
              style={{ color: '#A5D6A7' }}
            >
              Garden Grid
            </span>
          </div>
        </div>
        
        {/* Reward - Earth Acupuncturist Badge */}
        <motion.div 
          className="mt-5 p-4 rounded-lg flex items-center justify-center gap-4"
          style={{
            background: 'linear-gradient(135deg, #C0392B20, #27AE6015)',
            border: '1px solid #C0392B80',
          }}
          whileHover={{ 
            boxShadow: '0 0 40px #E74C3C30',
            borderColor: '#E74C3C60',
          }}
        >
          {/* Badge Icon */}
          <motion.div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #C0392B, #27AE60)',
              boxShadow: '0 0 20px #E74C3C40',
            }}
            animate={{ 
              boxShadow: ['0 0 15px #E74C3C30', '0 0 25px #27AE6050', '0 0 15px #E74C3C30']
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <YinYangSoilWater className="w-10 h-10" />
          </motion.div>
          
          <div>
            <p 
              className="text-xs font-mono uppercase tracking-wider"
              style={{ color: '#C0392B' }}
            >
              REWARD
            </p>
            <p 
              className="text-xl tracking-wide"
              style={{ 
                fontFamily: "'Staatliches', sans-serif",
                color: '#E74C3C',
                textShadow: '0 0 15px #E74C3C40',
              }}
            >
              EARTH ACUPUNCTURIST BADGE
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Visual Reference Note */}
      <motion.div
        className="p-3 rounded-xl text-center"
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px dashed #27AE6030',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p 
          className="text-xs font-mono"
          style={{ color: '#27AE6080' }}
        >
          VISUAL: Bamboo Slats • Red Cinnabar Ink (#E74C3C) • Yin-Yang Soil/Water
        </p>
      </motion.div>
    </div>
  );
};

export default EarthAcupunctureModule;
