import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { trackData, type TrackData } from '@/data/trackData';
import TrackDetailView from './TrackDetailView';

// Cosmic Garden colors
const COSMIC = {
  cream: 'hsl(40 50% 95%)',
  creamMuted: 'hsl(40 50% 85%)',
  rootBrown: 'hsl(20 40% 15%)',
  rootDark: 'hsl(20 30% 10%)',
  cosmicBlue: 'hsl(250 60% 15%)',
  amethyst: 'hsl(280 50% 25%)',
  gemRuby: 'hsl(350 75% 50%)',
  gemSapphire: 'hsl(220 75% 55%)',
  gemEmerald: 'hsl(140 60% 45%)',
  gemTopaz: 'hsl(45 90% 60%)',
};

// Helper to bold special names
const formatFeaturing = (featuring: string) => {
  const boldNames = ['Sistah Moon', 'Vici Royàl'];
  
  return (
    <span>
      {featuring.split(/(\bSistah Moon\b|\bVici Royàl\b)/g).map((part, i) => 
        boldNames.includes(part) ? (
          <strong key={i} style={{ color: COSMIC.creamMuted }} className="font-bold">{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

// Organic Gemstone Chakra Symbol - Woven mosaic bead style
const GemstoneChakra = ({ color, size = 32 }: { color: string; size?: number }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} className="drop-shadow-lg">
    <defs>
      {/* Gemstone gradient */}
      <radialGradient id={`gem-${color.replace(/\s/g, '')}`} cx="35%" cy="35%" r="60%">
        <stop offset="0%" stopColor={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 75%)`} />
        <stop offset="50%" stopColor={`hsl(${color})`} />
        <stop offset="100%" stopColor={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 25%)`} />
      </radialGradient>
      {/* Inner glow */}
      <radialGradient id={`glow-${color.replace(/\s/g, '')}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={`hsl(${color} / 0.6)`} />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      {/* Vine gradient */}
      <linearGradient id="vine-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(140 50% 35%)" />
        <stop offset="100%" stopColor="hsl(140 40% 25%)" />
      </linearGradient>
    </defs>
    
    {/* Outer glow */}
    <circle cx="20" cy="20" r="18" fill={`url(#glow-${color.replace(/\s/g, '')})`} />
    
    {/* Vine tendrils wrapping around - organic curving paths */}
    <g stroke="url(#vine-grad)" strokeWidth="2" fill="none" strokeLinecap="round">
      {/* Top tendril */}
      <path d="M20 2 Q25 6, 20 10 Q15 14, 18 18" opacity="0.8" />
      {/* Right tendril */}
      <path d="M38 20 Q34 25, 30 20 Q26 15, 22 18" opacity="0.8" />
      {/* Bottom tendril */}
      <path d="M20 38 Q15 34, 20 30 Q25 26, 22 22" opacity="0.8" />
      {/* Left tendril */}
      <path d="M2 20 Q6 15, 10 20 Q14 25, 18 22" opacity="0.8" />
    </g>
    
    {/* Small leaf accents on vines */}
    <g fill="hsl(140 50% 40%)">
      <ellipse cx="22" cy="5" rx="2.5" ry="1.5" transform="rotate(45 22 5)" />
      <ellipse cx="35" cy="22" rx="2.5" ry="1.5" transform="rotate(-45 35 22)" />
      <ellipse cx="18" cy="35" rx="2.5" ry="1.5" transform="rotate(45 18 35)" />
      <ellipse cx="5" cy="18" rx="2.5" ry="1.5" transform="rotate(-45 5 18)" />
    </g>
    
    {/* Main gemstone - faceted hexagonal shape */}
    <polygon 
      points="20,8 28,14 28,26 20,32 12,26 12,14" 
      fill={`url(#gem-${color.replace(/\s/g, '')})`}
      stroke={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 65%)`}
      strokeWidth="1"
    />
    
    {/* Facet lines for gem effect */}
    <g stroke={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 80% / 0.5)`} strokeWidth="0.5" fill="none">
      <line x1="20" y1="8" x2="20" y2="20" />
      <line x1="28" y1="14" x2="20" y2="20" />
      <line x1="28" y1="26" x2="20" y2="20" />
      <line x1="20" y1="32" x2="20" y2="20" />
      <line x1="12" y1="26" x2="20" y2="20" />
      <line x1="12" y1="14" x2="20" y2="20" />
    </g>
    
    {/* Inner highlight - light reflection */}
    <ellipse 
      cx="16" 
      cy="14" 
      rx="3" 
      ry="2" 
      fill="white" 
      opacity="0.4"
      transform="rotate(-30 16 14)"
    />
    
    {/* Small mosaic bead accents around gem */}
    <g>
      <circle cx="20" cy="4" r="2" fill={`hsl(${color})`} opacity="0.7" />
      <circle cx="32" cy="12" r="1.5" fill="hsl(45 90% 60%)" opacity="0.6" />
      <circle cx="32" cy="28" r="1.5" fill="hsl(220 75% 55%)" opacity="0.6" />
      <circle cx="20" cy="36" r="2" fill={`hsl(${color})`} opacity="0.7" />
      <circle cx="8" cy="28" r="1.5" fill="hsl(280 60% 55%)" opacity="0.6" />
      <circle cx="8" cy="12" r="1.5" fill="hsl(350 75% 50%)" opacity="0.6" />
    </g>
  </svg>
);

// Organic Waveform
const OrganicWaveform = ({ color, isAnimating = false }: { color: string; isAnimating?: boolean }) => (
  <motion.svg 
    viewBox="0 0 80 20" 
    className="w-16 h-4"
    animate={isAnimating ? { opacity: [0.5, 1, 0.5] } : {}}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <motion.path 
      d="M0 10 Q10 2, 20 10 T40 10 T60 10 T80 10"
      fill="none"
      stroke={`hsl(${color})`}
      strokeWidth="2"
      strokeLinecap="round"
      animate={isAnimating ? {
        d: [
          "M0 10 Q10 2, 20 10 T40 10 T60 10 T80 10",
          "M0 10 Q10 18, 20 10 T40 10 T60 10 T80 10",
          "M0 10 Q10 2, 20 10 T40 10 T60 10 T80 10",
        ]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.svg>
);

// Vine Accent Border
const VineAccent = () => (
  <div className="absolute inset-x-0 top-0 h-2 overflow-hidden">
    <svg viewBox="0 0 200 8" className="w-full h-full" preserveAspectRatio="none">
      <path 
        d="M0 4 Q25 1, 50 4 T100 4 T150 4 T200 4"
        stroke={COSMIC.gemEmerald}
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
    </svg>
  </div>
);

// Grid Header
const GridHeader = () => (
  <motion.div
    className="max-w-6xl mx-auto text-center mb-16"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <p 
      className="text-sm tracking-[0.4em] uppercase mb-3 font-body"
      style={{ color: COSMIC.gemRuby }}
    >
      The Cosmic Garden Grid
    </p>
    <h2 
      className="text-4xl md:text-6xl mb-4 root-text font-bubble"
      data-text="THE MASTER MATRIX"
    >
      THE MASTER MATRIX
    </h2>
    <p 
      className="max-w-2xl mx-auto font-body"
      style={{ color: 'hsl(40 50% 85% / 0.7)' }}
    >
      Each track is woven into the tapestry—tuned to a sacred frequency, 
      grounded in an essential mineral, and amplified through its corresponding gemstone.
    </p>
    <div className="mt-4 space-y-1" style={{ color: 'hsl(40 50% 85% / 0.5)' }}>
      <p className="text-sm font-body">
        Produced by <strong style={{ color: COSMIC.creamMuted }}>Vici Royàl</strong> & <span style={{ color: COSMIC.gemRuby }}>Èks</span>
      </p>
      <p className="text-xs font-body" style={{ color: 'hsl(40 50% 85% / 0.4)' }}>
        Mixed by: <span style={{ color: COSMIC.gemRuby }}>Èks</span> • 
        Mastered at: Sampson Sound Studios by Kristofer Sampson
      </p>
    </div>
    <p className="text-xs mt-4 font-body" style={{ color: 'hsl(40 50% 85% / 0.3)' }}>
      ◆ Click any panel to view its Cosmic Artifact ◆
    </p>
  </motion.div>
);

const MasterMatrix = () => {
  const [selectedTrack, setSelectedTrack] = useState<TrackData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleTrackClick = (track: TrackData) => {
    setSelectedTrack(track);
    setIsDetailOpen(true);
  };

  const handleClose = () => {
    setIsDetailOpen(false);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    if (isDetailOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isDetailOpen]);

  return (
    <>
      <section id="matrix" className="relative py-24 px-4 cosmic-swirl">
        {/* Cosmic gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, hsl(280 50% 15% / 0.4) 0%, transparent 30%, transparent 70%, hsl(20 40% 15% / 0.3) 100%)`,
          }}
        />

        <GridHeader />

        {/* Matrix Grid - Organic Mosaic Style */}
        <div className="max-w-5xl mx-auto relative">

          {/* Matrix Rows */}
          <div className="space-y-3">
            {trackData.map((element, index) => (
              <motion.div
                key={element.row}
                className="relative cursor-pointer group overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${COSMIC.rootBrown} 0%, ${COSMIC.rootDark} 100%)`,
                  border: `3px solid ${hoveredRow === element.row ? `hsl(${element.colorHsl})` : 'hsl(20 40% 25% / 0.5)'}`,
                  borderRadius: '1.5rem',
                  boxShadow: hoveredRow === element.row 
                    ? `0 8px 32px rgba(0,0,0,0.4), 0 0 30px hsl(${element.colorHsl} / 0.2)` 
                    : '0 4px 16px rgba(0,0,0,0.3)',
                }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                onClick={() => handleTrackClick(element)}
                onMouseEnter={() => setHoveredRow(element.row)}
                onMouseLeave={() => setHoveredRow(null)}
                whileHover={{ scale: 1.005 }}
              >
                <VineAccent />

                {/* Mobile Layout */}
                <div className="lg:hidden p-5 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <GemstoneChakra color={element.colorHsl} size={40} />
                      <span 
                        className="font-body text-lg font-bold"
                        style={{ color: `hsl(${element.colorHsl})` }}
                      >
                        {String(element.row).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p 
                        className="text-lg font-bold font-bubble"
                        style={{ 
                          color: COSMIC.cream,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {element.track}
                      </p>
                      <p className="text-sm font-body" style={{ color: `hsl(${element.colorHsl})` }}>
                        {element.chakra} • {element.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span 
                      className="px-4 py-1.5 text-xs font-body rounded-full"
                      style={{ 
                        border: `1px solid hsl(${element.colorHsl} / 0.4)`,
                        color: `hsl(${element.colorHsl})`,
                        background: `hsl(${element.colorHsl} / 0.1)`,
                      }}
                    >
                      {element.mineralSymbol} {element.mineral}
                    </span>
                    <span 
                      className="px-4 py-1.5 text-xs font-body rounded-full"
                      style={{ 
                        border: `1px solid hsl(${element.colorHsl} / 0.4)`,
                        color: `hsl(${element.colorHsl})`,
                        background: `hsl(${element.colorHsl} / 0.1)`,
                      }}
                    >
                      ◇ {element.crystal}
                    </span>
                    {element.featuring && (
                      <span 
                        className="px-4 py-1.5 text-xs font-body rounded-full"
                        style={{ 
                          border: `1px solid hsl(40 50% 75% / 0.3)`,
                          color: COSMIC.creamMuted,
                        }}
                      >
                        ft. {formatFeaturing(element.featuring)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block relative z-10 overflow-hidden">
                  <div className="flex items-center p-4">
                    {/* Left: Energy indicator */}
                    <div className="flex items-center gap-3 flex-shrink-0 w-20">
                      <GemstoneChakra color={element.colorHsl} size={36} />
                      <span 
                        className="font-body text-sm font-bold"
                        style={{ color: `hsl(${element.colorHsl})` }}
                      >
                        {String(element.row).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Center: Content area */}
                    <div className="flex-1 relative h-14 flex items-center justify-center">
                      {/* Track Name */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: hoveredRow === element.row ? 0 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p 
                          className="font-bold text-xl tracking-wider font-bubble"
                          style={{ color: COSMIC.cream }}
                        >
                          {element.track}
                        </p>
                      </motion.div>

                      {/* Details on hover */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredRow === element.row ? 1 : 0 }}
                        transition={{ duration: 0.2, delay: hoveredRow === element.row ? 0.1 : 0 }}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] uppercase tracking-wider mb-0.5 font-body" style={{ color: 'hsl(40 50% 75% / 0.4)' }}>
                            Energy
                          </span>
                          <span className="font-body text-sm font-medium uppercase" style={{ color: `hsl(${element.colorHsl})` }}>
                            {element.chakra}
                          </span>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-[9px] uppercase tracking-wider mb-0.5 font-body" style={{ color: 'hsl(40 50% 75% / 0.4)' }}>
                            Frequency
                          </span>
                          <span className="font-body text-sm font-medium" style={{ color: `hsl(${element.colorHsl})` }}>
                            {element.frequency}
                          </span>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-[9px] uppercase tracking-wider mb-0.5 font-body" style={{ color: 'hsl(40 50% 75% / 0.4)' }}>
                            Mineral
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="font-body text-sm font-bold" style={{ color: `hsl(${element.colorHsl})` }}>
                              {element.mineralSymbol}
                            </span>
                            <span className="text-xs font-body" style={{ color: 'hsl(40 50% 85% / 0.7)' }}>
                              {element.mineral}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-[9px] uppercase tracking-wider mb-0.5 font-body" style={{ color: 'hsl(40 50% 75% / 0.4)' }}>
                            Crystal
                          </span>
                          <span className="text-sm font-body" style={{ color: 'hsl(40 50% 85% / 0.8)' }}>
                            {element.crystal}
                          </span>
                        </div>

                        {element.featuring && (
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] uppercase tracking-wider mb-0.5 font-body" style={{ color: 'hsl(40 50% 75% / 0.4)' }}>
                              Featuring
                            </span>
                            <span className="text-sm font-body" style={{ color: COSMIC.creamMuted }}>
                              {formatFeaturing(element.featuring)}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Right: Waveform indicator */}
                    <div className="flex-shrink-0 w-20 flex justify-end">
                      <OrganicWaveform 
                        color={element.colorHsl} 
                        isAnimating={hoveredRow === element.row}
                      />
                    </div>
                  </div>
                </div>

                {/* Gradient accent line */}
                <div 
                  className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
                  style={{ 
                    background: `linear-gradient(90deg, hsl(${element.colorHsl}) 0%, ${COSMIC.gemRuby} 50%, transparent 100%)`,
                    borderRadius: '0 0 1.5rem 1.5rem',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vine Divider */}
        <div className="vine-divider mt-16" />
      </section>

      {/* Detail View Modal */}
      {selectedTrack && (
        <TrackDetailView
          track={selectedTrack}
          isOpen={isDetailOpen}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default MasterMatrix;
