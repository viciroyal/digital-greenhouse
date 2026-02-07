import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { trackData, type TrackData } from '@/data/trackData';
import TrackDetailView from './TrackDetailView';

// Dogon colors
const DOGON = {
  ebony: '#1a1410',
  mahogany: '#3d2317',
  laterite: '#b7410e',
  millet: '#e6cca0',
  paleStraw: '#f5f0e6',
  indigo: '#1a237e',
  sirius: '#4a6fa5',
};

// Helper to bold special names
const formatFeaturing = (featuring: string) => {
  const boldNames = ['Sistah Moon', 'Vici Royàl'];
  
  return (
    <span>
      {featuring.split(/(\bSistah Moon\b|\bVici Royàl\b)/g).map((part, i) => 
        boldNames.includes(part) ? (
          <strong key={i} style={{ color: DOGON.millet }} className="font-bold">{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

// Geometric Angular Chakra Symbol (Dogon style - no curves)
const AngularChakraSymbol = ({ color, size = 32 }: { color: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    {/* Outer square */}
    <rect 
      x="2" y="2" 
      width="20" height="20" 
      fill="none" 
      stroke={`hsl(${color})`} 
      strokeWidth="1.5"
    />
    {/* Inner diamond */}
    <path 
      d="M12 4 L20 12 L12 20 L4 12 Z" 
      fill={`hsl(${color} / 0.3)`} 
      stroke={`hsl(${color})`} 
      strokeWidth="1"
    />
    {/* Center square */}
    <rect 
      x="9" y="9" 
      width="6" height="6" 
      fill={`hsl(${color})`}
    />
  </svg>
);

// Nommo Zigzag Waveform
const NommoWaveform = ({ color, isAnimating = false }: { color: string; isAnimating?: boolean }) => (
  <motion.svg 
    viewBox="0 0 80 20" 
    className="w-16 h-4"
    animate={isAnimating ? { opacity: [0.5, 1, 0.5] } : {}}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <motion.path 
      d="M0 10 L8 3 L16 10 L24 3 L32 10 L40 3 L48 10 L56 3 L64 10 L72 3 L80 10"
      fill="none"
      stroke={`hsl(${color})`}
      strokeWidth="2"
      strokeLinecap="square"
      animate={isAnimating ? {
        d: [
          "M0 10 L8 3 L16 10 L24 3 L32 10 L40 3 L48 10 L56 3 L64 10 L72 3 L80 10",
          "M0 10 L8 17 L16 10 L24 17 L32 10 L40 17 L48 10 L56 17 L64 10 L72 17 L80 10",
          "M0 10 L8 3 L16 10 L24 3 L32 10 L40 3 L48 10 L56 3 L64 10 L72 3 L80 10",
        ]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.svg>
);

// Carved Panel Border Pattern
const CarvedBorder = () => (
  <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
    <svg viewBox="0 0 200 4" className="w-full h-full" preserveAspectRatio="none">
      <path 
        d="M0 2 L5 0 L10 2 L15 0 L20 2 L25 0 L30 2 L35 0 L40 2 L45 0 L50 2 L55 0 L60 2 L65 0 L70 2 L75 0 L80 2 L85 0 L90 2 L95 0 L100 2 L105 0 L110 2 L115 0 L120 2 L125 0 L130 2 L135 0 L140 2 L145 0 L150 2 L155 0 L160 2 L165 0 L170 2 L175 0 L180 2 L185 0 L190 2 L195 0 L200 2"
        stroke={DOGON.millet}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
    </svg>
  </div>
);

// Fox Divination Grid Header
const GridHeader = () => (
  <motion.div
    className="max-w-6xl mx-auto text-center mb-16"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <p 
      className="text-sm tracking-[0.4em] uppercase mb-3"
      style={{ color: DOGON.laterite }}
    >
      The Fox Divination Grid
    </p>
    <h2 
      className="text-4xl md:text-6xl mb-4"
      style={{ 
        fontFamily: "'Staatliches', sans-serif",
        color: DOGON.paleStraw,
        letterSpacing: '0.1em',
      }}
    >
      THE MASTER MATRIX
    </h2>
    <p 
      className="max-w-2xl mx-auto"
      style={{ 
        color: 'rgba(230, 204, 160, 0.7)',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      Each track is carved into the granary door—tuned to a sacred frequency, 
      grounded in an essential soil mineral, and amplified through its corresponding crystal.
    </p>
    <div className="mt-4 space-y-1" style={{ color: 'rgba(230, 204, 160, 0.5)' }}>
      <p className="text-sm">
        Produced by <strong style={{ color: DOGON.millet }}>Vici Royàl</strong> & <span style={{ color: DOGON.laterite }}>Èks</span>
      </p>
      <p className="text-xs" style={{ color: 'rgba(230, 204, 160, 0.4)' }}>
        Mixed by: <span style={{ color: DOGON.laterite }}>Èks</span> • 
        Mastered at: Sampson Sound Studios by Kristofer Sampson
      </p>
    </div>
    <p className="text-xs mt-4" style={{ color: 'rgba(230, 204, 160, 0.3)' }}>
      ◆ Click any panel to view its Sirius Artifact ◆
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
      <section id="matrix" className="relative py-24 px-4 noise-texture">
        {/* Indigo night sky gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${DOGON.indigo}40 0%, transparent 30%, transparent 70%, ${DOGON.laterite}20 100%)`,
          }}
        />

        <GridHeader />

        {/* Matrix Grid - Fox Divination Style */}
        <div className="max-w-5xl mx-auto relative">

          {/* Matrix Rows - Compact with hover reveal */}
          <div className="space-y-2">
            {trackData.map((element, index) => (
              <motion.div
                key={element.row}
                className="relative cursor-pointer group overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${DOGON.mahogany} 0%, ${DOGON.ebony} 100%)`,
                  border: `2px solid ${hoveredRow === element.row ? DOGON.laterite : 'rgba(183, 65, 14, 0.3)'}`,
                  borderRadius: '4px',
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
                <CarvedBorder />

                {/* Wood grain texture */}
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 4px,
                        rgba(0,0,0,0.1) 4px,
                        rgba(0,0,0,0.1) 8px
                      )
                    `,
                  }}
                />

                {/* Mobile Layout - Always expanded */}
                <div className="lg:hidden p-5 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <AngularChakraSymbol color={element.colorHsl} size={40} />
                      <span 
                        className="font-mono text-lg font-bold"
                        style={{ color: `hsl(${element.colorHsl})` }}
                      >
                        {String(element.row).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p 
                        className="text-lg font-bold"
                        style={{ 
                          fontFamily: "'Staatliches', sans-serif",
                          color: DOGON.paleStraw,
                          letterSpacing: '0.05em',
                        }}
                      >
                        {element.track}
                      </p>
                      <p className="text-sm" style={{ color: `hsl(${element.colorHsl})` }}>
                        {element.chakra} • {element.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span 
                      className="px-3 py-1 text-xs font-mono"
                      style={{ 
                        border: `1px solid hsl(${element.colorHsl} / 0.4)`,
                        color: `hsl(${element.colorHsl})`,
                        background: `hsl(${element.colorHsl} / 0.1)`,
                      }}
                    >
                      {element.mineralSymbol} {element.mineral}
                    </span>
                    <span 
                      className="px-3 py-1 text-xs font-mono"
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
                        className="px-3 py-1 text-xs font-mono"
                        style={{ 
                          border: `1px solid ${DOGON.millet}40`,
                          color: DOGON.millet,
                        }}
                      >
                        ft. {formatFeaturing(element.featuring)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop Layout - Compact with hover scroll reveal */}
                <div className="hidden lg:block relative z-10 overflow-hidden">
                  <div className="flex items-center p-4">
                    {/* Always visible: Energy indicator + Track name */}
                    <div className="flex items-center gap-4 flex-shrink-0" style={{ minWidth: '320px' }}>
                      <div className="flex items-center gap-3">
                        <AngularChakraSymbol color={element.colorHsl} size={36} />
                        <span 
                          className="font-mono text-sm font-bold"
                          style={{ color: `hsl(${element.colorHsl})` }}
                        >
                          {String(element.row).padStart(2, '0')}
                        </span>
                      </div>
                      <div>
                        <p 
                          className="font-bold"
                          style={{ 
                            fontFamily: "'Staatliches', sans-serif",
                            color: DOGON.paleStraw,
                            letterSpacing: '0.05em',
                          }}
                        >
                          {element.track}
                        </p>
                        <div className="flex items-center gap-2">
                          <p 
                            className="font-mono text-xs uppercase"
                            style={{ color: `hsl(${element.colorHsl})` }}
                          >
                            {element.chakra}
                          </p>
                          <NommoWaveform 
                            color={element.colorHsl} 
                            isAnimating={hoveredRow === element.row}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sliding details panel - appears on hover */}
                    <motion.div 
                      className="flex items-center gap-6 ml-4"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ 
                        opacity: hoveredRow === element.row ? 1 : 0,
                        x: hoveredRow === element.row ? 0 : 100,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {/* Frequency */}
                      <div className="flex flex-col items-center">
                        <span 
                          className="text-[10px] uppercase tracking-wider mb-1"
                          style={{ color: 'rgba(230, 204, 160, 0.5)' }}
                        >
                          Freq
                        </span>
                        <span 
                          className="px-3 py-1 text-xs font-mono font-medium"
                          style={{ 
                            border: `1px solid hsl(${element.colorHsl} / 0.4)`,
                            color: `hsl(${element.colorHsl})`,
                            background: `hsl(${element.colorHsl} / 0.15)`,
                          }}
                        >
                          {element.frequency}
                        </span>
                      </div>

                      {/* Mineral */}
                      <div className="flex flex-col items-center">
                        <span 
                          className="text-[10px] uppercase tracking-wider mb-1"
                          style={{ color: 'rgba(230, 204, 160, 0.5)' }}
                        >
                          Mineral
                        </span>
                        <div className="flex items-center gap-1">
                          <span 
                            className="font-mono text-base font-bold"
                            style={{ color: `hsl(${element.colorHsl})` }}
                          >
                            {element.mineralSymbol}
                          </span>
                          <span 
                            className="text-xs font-mono"
                            style={{ color: 'rgba(230, 204, 160, 0.7)' }}
                          >
                            {element.mineral}
                          </span>
                        </div>
                      </div>

                      {/* Crystal */}
                      <div className="flex flex-col items-center">
                        <span 
                          className="text-[10px] uppercase tracking-wider mb-1"
                          style={{ color: 'rgba(230, 204, 160, 0.5)' }}
                        >
                          Crystal
                        </span>
                        <span 
                          className="text-xs font-mono"
                          style={{ color: 'rgba(230, 204, 160, 0.8)' }}
                        >
                          ◇ {element.crystal}
                        </span>
                      </div>

                      {/* Featuring */}
                      {element.featuring && (
                        <div className="flex flex-col items-center">
                          <span 
                            className="text-[10px] uppercase tracking-wider mb-1"
                            style={{ color: 'rgba(230, 204, 160, 0.5)' }}
                          >
                            Voices
                          </span>
                          <span 
                            className="text-xs font-mono"
                            style={{ color: DOGON.millet }}
                          >
                            ft. {formatFeaturing(element.featuring)}
                          </span>
                        </div>
                      )}

                      {/* View details arrow */}
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <span style={{ color: DOGON.laterite }}>→</span>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                {/* Gradient accent line */}
                <div 
                  className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
                  style={{ 
                    background: `linear-gradient(90deg, hsl(${element.colorHsl}) 0%, ${DOGON.laterite} 50%, transparent 100%)`
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Soil Spirits credit - Dogon inscription */}
        <motion.div
          className="max-w-6xl mx-auto mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div 
            className="inline-block px-8 py-4 rounded"
            style={{
              background: `linear-gradient(145deg, ${DOGON.mahogany} 0%, ${DOGON.ebony} 100%)`,
              border: `1px solid ${DOGON.laterite}40`,
            }}
          >
            <p 
              className="font-mono text-sm"
              style={{ color: 'rgba(230, 204, 160, 0.7)' }}
            >
              Guided by the <span style={{ color: DOGON.millet }}>Soil Spirits</span>: Spirit, Sunny, Rocky & River
            </p>
          </div>
        </motion.div>
      </section>

      {/* Track Detail Modal */}
      <TrackDetailView 
        track={selectedTrack} 
        isOpen={isDetailOpen} 
        onClose={handleClose} 
      />
    </>
  );
};

export default MasterMatrix;
