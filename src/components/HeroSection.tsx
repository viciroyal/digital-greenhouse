import { motion } from 'framer-motion';
import CassettePlayer from './CassettePlayer';
import PharmerTooltip from './PharmerTooltip';
import albumArt from '@/assets/pharmboi-artwork.png';

// Dogon Kanaga Mask Symbol
const KanagaMask = ({ side }: { side: 'left' | 'right' }) => (
  <motion.svg 
    viewBox="0 0 60 80" 
    className="w-10 h-14 md:w-12 md:h-16"
    initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.6 }}
  >
    {/* Central vertical pillar */}
    <path 
      d="M30 10 L30 70" 
      stroke="#e6cca0" 
      strokeWidth="4" 
      strokeLinecap="square"
    />
    
    {/* Upper Kanaga arms */}
    <path 
      d="M30 20 L15 10 L8 18" 
      stroke="#e6cca0" 
      strokeWidth="3" 
      strokeLinecap="square"
      fill="none"
    />
    <path 
      d="M30 20 L45 10 L52 18" 
      stroke="#e6cca0" 
      strokeWidth="3" 
      strokeLinecap="square"
      fill="none"
    />
    
    {/* Lower Kanaga arms */}
    <path 
      d="M30 60 L15 70 L8 62" 
      stroke="#e6cca0" 
      strokeWidth="3" 
      strokeLinecap="square"
      fill="none"
    />
    <path 
      d="M30 60 L45 70 L52 62" 
      stroke="#e6cca0" 
      strokeWidth="3" 
      strokeLinecap="square"
      fill="none"
    />
    
    {/* Center accent square */}
    <rect 
      x="25" 
      y="35" 
      width="10" 
      height="10" 
      fill="#b7410e"
    />
  </motion.svg>
);

// Sirius Star Background
const SiriusBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Sirius A - bright star */}
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-white"
      style={{ top: '15%', left: '30%' }}
      animate={{
        opacity: [0.6, 1, 0.6],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    
    {/* Sirius B orbital path hint */}
    <motion.div
      className="absolute w-1 h-1 rounded-full"
      style={{ 
        top: '18%', 
        left: '33%',
        backgroundColor: '#4a6fa5',
      }}
      animate={{
        x: [0, 30, 0, -30, 0],
        y: [0, 15, 30, 15, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    />
    
    {/* Scattered stars */}
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: Math.random() > 0.7 ? '2px' : '1px',
          height: Math.random() > 0.7 ? '2px' : '1px',
          backgroundColor: i % 3 === 0 ? '#e6cca0' : '#ffffff',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 60}%`,
        }}
        animate={{
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// Mud Cloth Border Pattern
const MudClothBorder = () => (
  <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden opacity-30">
    <svg viewBox="0 0 400 48" className="w-full h-full" preserveAspectRatio="none">
      <path 
        d="M0 24 L20 8 L40 24 L60 8 L80 24 L100 8 L120 24 L140 8 L160 24 L180 8 L200 24 L220 8 L240 24 L260 8 L280 24 L300 8 L320 24 L340 8 L360 24 L380 8 L400 24"
        stroke="#e6cca0"
        strokeWidth="2"
        fill="none"
      />
      <path 
        d="M0 36 L20 20 L40 36 L60 20 L80 36 L100 20 L120 36 L140 20 L160 36 L180 20 L200 36 L220 20 L240 36 L260 20 L280 36 L300 20 L320 36 L340 20 L360 36 L380 20 L400 36"
        stroke="#b7410e"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
    </svg>
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden noise-texture">
      {/* Sirius night sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a237e] via-[#0f1628] to-[#0a0d14]" />
      <SiriusBackground />
      
      {/* Laterite earth glow from bottom */}
      <div 
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(183, 65, 14, 0.2) 0%, transparent 70%)',
        }}
      />
      
      <MudClothBorder />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-8 lg:gap-12">
        
        {/* Album Artwork - floating in void */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <PharmerTooltip 
            tip="The Dogon knew: Sirius B orbits unseen, just as the soil feeds unseen. What shines above echoes below."
            position="bottom"
          >
            <div className="relative group">
              <div 
                className="absolute -inset-6 opacity-30 blur-3xl group-hover:opacity-50 transition-opacity"
                style={{
                  background: 'radial-gradient(circle, #b7410e 0%, #1a237e 50%, transparent 70%)',
                }}
              />
              <img 
                src={albumArt} 
                alt="PHARMBOI Album Artwork" 
                className="relative w-48 md:w-64 lg:w-72 rounded-lg shadow-2xl"
                style={{
                  border: '3px solid rgba(183, 65, 14, 0.5)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(183, 65, 14, 0.2)',
                }}
              />
            </div>
          </PharmerTooltip>
        </motion.div>

        {/* Title with Kanaga Masks - Togu Na style */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p 
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: '#e6cca0' }}
          >
            The Granary Door Opens
          </p>
          
          {/* Title with Kanaga flanks */}
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <KanagaMask side="left" />
            
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl pillar-text"
              data-text="PHARMBOI"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              PHARMBOI
            </motion.h1>
            
            <KanagaMask side="right" />
          </div>
          
          <motion.p 
            className="mt-6 text-base md:text-lg max-w-lg mx-auto leading-relaxed italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ 
              color: 'rgba(230, 204, 160, 0.8)',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}
          >
            "The Fox traces patterns in the sand. The stars trace patterns in the sky. The Pharmer reads both."
          </motion.p>
        </motion.div>

        {/* Artist credit - Dogon inscription style */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div 
            className="inline-flex items-center gap-3 px-6 py-2 rounded"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(183, 65, 14, 0.2), transparent)',
              borderTop: '1px solid rgba(230, 204, 160, 0.2)',
              borderBottom: '1px solid rgba(230, 204, 160, 0.2)',
            }}
          >
            <span className="text-sm" style={{ color: 'rgba(230, 204, 160, 0.6)' }}>by</span>
            <strong className="font-bold" style={{ color: '#e6cca0' }}>Vici Royàl</strong>
            <span style={{ color: 'rgba(230, 204, 160, 0.3)' }}>◆</span>
            <span className="text-xs" style={{ color: 'rgba(230, 204, 160, 0.5)' }}>
              Produced by <strong style={{ color: '#e6cca0' }}>Vici Royàl</strong> & <span style={{ color: '#b7410e' }}>Èks</span>
            </span>
          </div>
        </motion.div>

        {/* CTA Buttons - Carved wood style */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <motion.a
            href="#matrix"
            className="px-6 py-3 rounded font-bold text-sm tracking-wider uppercase transition-all group"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              background: 'linear-gradient(145deg, #3d2317 0%, #1a1410 100%)',
              color: '#e6cca0',
              border: '2px solid rgba(183, 65, 14, 0.5)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-2">
              Enter The Grid
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </motion.a>
          <motion.a
            href="#shop"
            className="px-6 py-3 rounded font-bold text-sm tracking-wider uppercase transition-all"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: '#b7410e',
              border: '2px solid rgba(183, 65, 14, 0.4)',
              background: 'transparent',
            }}
            whileHover={{ scale: 1.02, y: -2, backgroundColor: 'rgba(183, 65, 14, 0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            Get The Source Bundle
          </motion.a>
        </motion.div>

        {/* Cassette Player */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <CassettePlayer />
        </motion.div>
      </div>

      {/* Scroll indicator - Geometric style */}
      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <p 
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(230, 204, 160, 0.4)' }}
          >
            Descend
          </p>
          <svg viewBox="0 0 20 30" className="w-4 h-6">
            <path 
              d="M10 0 L10 25 M5 20 L10 25 L15 20" 
              stroke="#b7410e" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="square"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
