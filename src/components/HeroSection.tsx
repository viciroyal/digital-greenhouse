import { motion } from 'framer-motion';
import CassettePlayer from './CassettePlayer';
import PharmerTooltip from './PharmerTooltip';
import albumArt from '@/assets/pharmboi-artwork.png';

// Organic Vine Frame
const VineFrame = ({ side }: { side: 'left' | 'right' }) => (
  <motion.svg 
    viewBox="0 0 60 120" 
    className="w-10 h-20 md:w-12 md:h-24"
    initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.6 }}
  >
    {/* Curving vine */}
    <path 
      d={side === 'left' 
        ? "M50 0 Q30 30, 40 60 Q50 90, 30 120" 
        : "M10 0 Q30 30, 20 60 Q10 90, 30 120"
      }
      stroke="hsl(140 60% 35%)" 
      strokeWidth="4" 
      fill="none"
      strokeLinecap="round"
    />
    
    {/* Leaves */}
    <ellipse 
      cx={side === 'left' ? 35 : 25} 
      cy="30" 
      rx="8" 
      ry="5" 
      fill="hsl(140 50% 40%)"
      transform={`rotate(${side === 'left' ? -30 : 30} ${side === 'left' ? 35 : 25} 30)`}
    />
    <ellipse 
      cx={side === 'left' ? 42 : 18} 
      cy="70" 
      rx="6" 
      ry="4" 
      fill="hsl(140 50% 35%)"
      transform={`rotate(${side === 'left' ? 20 : -20} ${side === 'left' ? 42 : 18} 70)`}
    />
    
    {/* Small gemstone accent */}
    <circle 
      cx={side === 'left' ? 40 : 20} 
      cy="50" 
      r="4" 
      fill="hsl(350 75% 50%)"
    />
  </motion.svg>
);

// Mosaic Bead Particle - individual floating gemstone bead
const MosaicBead = ({ 
  size, 
  color, 
  glow, 
  startX, 
  startY, 
  duration, 
  delay 
}: { 
  size: number; 
  color: string; 
  glow: string; 
  startX: number; 
  startY: number; 
  duration: number; 
  delay: number; 
}) => (
  <motion.div
    className="absolute"
    style={{
      left: `${startX}%`,
      top: `${startY}%`,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.8, 0.6, 0.9, 0],
      scale: [0.5, 1, 1.1, 0.9, 0.5],
      x: [0, 20, -15, 25, 0],
      y: [0, -30, -60, -90, -120],
      rotate: [0, 45, -30, 60, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, ${glow})`,
        boxShadow: `0 0 ${size * 2}px ${glow}, inset 0 0 ${size / 2}px rgba(255,255,255,0.3)`,
      }}
    />
  </motion.div>
);

// Mosaic Bead Particles - floating gemstone beads
const MosaicBeadParticles = () => {
  const beadConfigs = [
    // Ruby beads
    { size: 12, color: 'hsl(350 75% 55%)', glow: 'hsl(350 75% 40% / 0.6)', startX: 15, startY: 85, duration: 12, delay: 0 },
    { size: 8, color: 'hsl(350 80% 60%)', glow: 'hsl(350 75% 45% / 0.5)', startX: 25, startY: 90, duration: 14, delay: 2 },
    { size: 6, color: 'hsl(350 70% 50%)', glow: 'hsl(350 75% 35% / 0.4)', startX: 10, startY: 75, duration: 10, delay: 4 },
    // Sapphire beads
    { size: 10, color: 'hsl(220 75% 60%)', glow: 'hsl(220 75% 45% / 0.6)', startX: 75, startY: 80, duration: 13, delay: 1 },
    { size: 14, color: 'hsl(220 80% 55%)', glow: 'hsl(220 75% 40% / 0.5)', startX: 85, startY: 88, duration: 15, delay: 3 },
    { size: 7, color: 'hsl(220 70% 65%)', glow: 'hsl(220 75% 50% / 0.4)', startX: 90, startY: 70, duration: 11, delay: 5 },
    // Topaz beads
    { size: 9, color: 'hsl(45 90% 55%)', glow: 'hsl(45 90% 40% / 0.6)', startX: 45, startY: 92, duration: 11, delay: 0.5 },
    { size: 11, color: 'hsl(45 85% 60%)', glow: 'hsl(45 90% 45% / 0.5)', startX: 55, startY: 85, duration: 13, delay: 2.5 },
    { size: 5, color: 'hsl(45 80% 65%)', glow: 'hsl(45 90% 50% / 0.4)', startX: 50, startY: 78, duration: 9, delay: 4.5 },
    // Amethyst beads
    { size: 8, color: 'hsl(280 60% 55%)', glow: 'hsl(280 60% 40% / 0.6)', startX: 30, startY: 82, duration: 14, delay: 1.5 },
    { size: 13, color: 'hsl(280 65% 50%)', glow: 'hsl(280 60% 35% / 0.5)', startX: 70, startY: 95, duration: 16, delay: 3.5 },
    { size: 6, color: 'hsl(280 55% 60%)', glow: 'hsl(280 60% 45% / 0.4)', startX: 35, startY: 70, duration: 10, delay: 5.5 },
    // Emerald beads
    { size: 10, color: 'hsl(140 60% 45%)', glow: 'hsl(140 60% 30% / 0.6)', startX: 20, startY: 88, duration: 12, delay: 0.8 },
    { size: 7, color: 'hsl(140 55% 50%)', glow: 'hsl(140 60% 35% / 0.5)', startX: 80, startY: 75, duration: 11, delay: 2.8 },
    { size: 9, color: 'hsl(140 65% 40%)', glow: 'hsl(140 60% 25% / 0.4)', startX: 65, startY: 90, duration: 13, delay: 4.8 },
    // Extra scattered beads
    { size: 4, color: 'hsl(350 75% 60%)', glow: 'hsl(350 75% 45% / 0.3)', startX: 5, startY: 95, duration: 8, delay: 6 },
    { size: 5, color: 'hsl(220 75% 65%)', glow: 'hsl(220 75% 50% / 0.3)', startX: 95, startY: 85, duration: 9, delay: 7 },
    { size: 4, color: 'hsl(45 90% 60%)', glow: 'hsl(45 90% 45% / 0.3)', startX: 40, startY: 98, duration: 8, delay: 6.5 },
    { size: 5, color: 'hsl(280 60% 58%)', glow: 'hsl(280 60% 42% / 0.3)', startX: 60, startY: 80, duration: 9, delay: 7.5 },
    { size: 4, color: 'hsl(140 60% 48%)', glow: 'hsl(140 60% 32% / 0.3)', startX: 48, startY: 72, duration: 8, delay: 8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {beadConfigs.map((config, i) => (
        <MosaicBead key={i} {...config} />
      ))}
    </div>
  );
};

// Cosmic Swirl Background
const CosmicBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Swirling cosmic nebula gradients */}
    <div 
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsl(280 50% 25% / 0.6) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 60%, hsl(220 60% 30% / 0.5) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, hsl(20 40% 20% / 0.7) 0%, transparent 40%)
        `,
      }}
    />
    
    {/* Small twinkling star particles */}
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: Math.random() > 0.7 ? '2px' : '1px',
          height: Math.random() > 0.7 ? '2px' : '1px',
          backgroundColor: 'hsl(40 50% 90%)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [0.1, 0.6, 0.1],
          scale: [1, 1.3, 1],
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

// Organic Vine Border
const VineBorder = () => (
  <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-40">
    <svg viewBox="0 0 400 64" className="w-full h-full" preserveAspectRatio="none">
      <path 
        d="M0 32 Q50 16, 100 32 T200 32 T300 32 T400 32"
        stroke="hsl(140 50% 30%)"
        strokeWidth="3"
        fill="none"
      />
      <path 
        d="M0 40 Q50 24, 100 40 T200 40 T300 40 T400 40"
        stroke="hsl(20 40% 30%)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      {/* Small leaves along the vine */}
      {[40, 120, 200, 280, 360].map((x) => (
        <ellipse key={x} cx={x} cy={30} rx="6" ry="4" fill="hsl(140 50% 35%)" opacity="0.5" />
      ))}
    </svg>
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden starfield">
      {/* Deep cosmic blue/purple background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(250 60% 12%) 0%, hsl(280 50% 10%) 40%, hsl(250 50% 8%) 100%)',
        }}
      />
      <CosmicBackground />
      <MosaicBeadParticles />
      
      {/* Root/earth glow from bottom */}
      <div 
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, hsl(20 40% 20% / 0.6) 0%, transparent 70%)',
        }}
      />
      
      <VineBorder />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-8 lg:gap-12">
        
        {/* Album Artwork - floating in cosmic void */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <PharmerTooltip 
            tip="The roots run deep. The gems shine bright. The cosmos swirls eternal."
            position="bottom"
          >
            <div className="relative group">
              <div 
                className="absolute -inset-8 opacity-40 blur-3xl group-hover:opacity-60 transition-opacity"
                style={{
                  background: 'radial-gradient(circle, hsl(350 75% 50%) 0%, hsl(280 60% 40%) 50%, transparent 70%)',
                }}
              />
              <img 
                src={albumArt} 
                alt="PHARMBOI Album Artwork" 
                className="relative w-48 md:w-64 lg:w-72 rounded-3xl shadow-2xl"
                style={{
                  border: '4px solid hsl(20 40% 25%)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 60px hsl(350 75% 50% / 0.3)',
                }}
              />
            </div>
          </PharmerTooltip>
        </motion.div>

        {/* Title with Root-Textured Logo */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p 
            className="text-xs tracking-[0.4em] uppercase mb-4 font-body"
            style={{ color: 'hsl(40 50% 85%)' }}
          >
            The Cosmic Garden Awaits
          </p>
          
          {/* Logo with Vine Frames */}
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <VineFrame side="left" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative"
            >
              {/* Root-Textured PHARMBOI Logo */}
              <h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bubble relative"
                style={{
                  background: `url('/images/root-texture.png'), linear-gradient(180deg, hsl(20 30% 40%) 0%, hsl(20 40% 25%) 100%)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(3px 4px 0 hsl(20 30% 12%)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6))',
                  textShadow: 'none',
                }}
              >
                PHARMBOI
              </h1>
              {/* Organic outline layer */}
              <h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bubble absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  WebkitTextStroke: '3px hsl(20 30% 12%)',
                  WebkitTextFillColor: 'transparent',
                  opacity: 0.6,
                  zIndex: -1,
                }}
              >
                PHARMBOI
              </h1>
            </motion.div>
            
            <VineFrame side="right" />
          </div>
          
          <motion.p 
            className="mt-6 text-base md:text-lg max-w-lg mx-auto leading-relaxed italic font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ 
              color: 'hsl(40 50% 85% / 0.8)',
            }}
          >
            "From the roots below, through the gems within, to the stars above."
          </motion.p>
        </motion.div>

        {/* Artist credit - Organic style */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div 
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(20 40% 20% / 0.4), transparent)',
              border: '1px solid hsl(40 50% 75% / 0.2)',
            }}
          >
            <span className="text-sm font-body" style={{ color: 'hsl(40 50% 75% / 0.6)' }}>by</span>
            <strong className="font-bold font-body" style={{ color: 'hsl(40 50% 85%)' }}>Vici Royàl</strong>
            <span style={{ color: 'hsl(350 75% 50%)' }}>◆</span>
            <span className="text-xs font-body" style={{ color: 'hsl(40 50% 75% / 0.5)' }}>
              Produced by <strong style={{ color: 'hsl(40 50% 85%)' }}>Vici Royàl</strong> & <span style={{ color: 'hsl(350 75% 50%)' }}>Èks</span>
            </span>
          </div>
        </motion.div>

        {/* CTA Buttons - Gemstone style */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <motion.a
            href="#matrix"
            className="gem-button px-8 py-4 font-bold text-sm tracking-wider uppercase font-bubble"
            style={{ color: 'hsl(40 50% 95%)' }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-2">
              Enter The Garden
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </motion.a>
          <motion.a
            href="#shop"
            className="gem-button-sapphire px-8 py-4 font-bold text-sm tracking-wider uppercase font-bubble"
            style={{ color: 'hsl(40 50% 95%)' }}
            whileHover={{ scale: 1.02, y: -2 }}
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

      {/* Scroll indicator - Organic style */}
      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <p 
            className="text-[10px] tracking-[0.3em] uppercase font-body"
            style={{ color: 'hsl(40 50% 75% / 0.4)' }}
          >
            Descend
          </p>
          <svg viewBox="0 0 20 30" className="w-4 h-6">
            <path 
              d="M10 0 Q8 10, 10 15 Q12 20, 10 25" 
              stroke="hsl(140 50% 40%)" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="10" cy="28" r="2" fill="hsl(350 75% 50%)" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
