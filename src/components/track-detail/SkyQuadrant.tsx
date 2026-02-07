import { motion } from 'framer-motion';
import { useState } from 'react';
import type { TrackData } from '@/data/trackData';

interface SkyQuadrantProps {
  track: TrackData;
}

// Dogon color palette - earth and cosmos
const DOGON_COLORS = {
  ebonyBlack: '#1a1410',
  mahogany: '#3d2317',
  rustClay: '#8b3a1d',
  milletYellow: '#d4b896',
  paleStraw: '#e8dcc8',
  deepIndigo: '#0f1628',
  siriusBlue: '#4a6fa5',
};

// Dogon-style geometric zodiac glyphs - angular, carved relief style
// Based on Kanaga masks and Granary Door relief carvings
const dogonZodiacPaths: Record<string, { paths: string[]; accentPaths?: string[] }> = {
  '♑': { // Capricorn - Walu (Antelope) mask style
    paths: [
      // Vertical body column
      'M50 75 L50 40',
      // Angular horns - sharp geometric
      'M50 40 L35 25 L30 30',
      'M50 40 L65 25 L70 30',
      // Square shoulders
      'M40 55 L60 55',
      'M38 60 L62 60',
      // Legs - angular
      'M45 75 L40 90',
      'M55 75 L60 90',
    ],
    accentPaths: [
      'M50 35 L50 30', // Crown mark
      'M45 45 L55 45', // Chest bar
    ],
  },
  '♏': { // Scorpio - Sharp triangular geometry (The Stinger)
    paths: [
      // Angular M shape
      'M25 60 L30 35 L40 55 L50 35 L60 55 L70 35 L75 60',
      // The stinger - sharp arrow
      'M75 60 L85 55 L90 45',
      'M85 55 L88 60 L85 55',
    ],
    accentPaths: [
      'M90 45 L95 40', // Stinger tip
      'M87 48 L92 43',
    ],
  },
  '♈': { // Aries - Ram horns angular
    paths: [
      // Central pillar
      'M50 85 L50 50',
      // Squared horns
      'M50 50 L50 40 L40 35 L30 40 L25 55 L30 60',
      'M50 50 L50 40 L60 35 L70 40 L75 55 L70 60',
    ],
    accentPaths: [
      'M45 55 L55 55',
      'M47 60 L53 60',
    ],
  },
  '♌': { // Leo - Stylized Dogon lion figure
    paths: [
      // Mane - radiating lines
      'M50 30 L50 20',
      'M50 30 L40 22',
      'M50 30 L60 22',
      'M50 30 L35 28',
      'M50 30 L65 28',
      // Square head
      'M40 30 L60 30 L60 45 L40 45 Z',
      // Body column
      'M50 45 L50 75',
      // Legs
      'M42 75 L38 90',
      'M58 75 L62 90',
    ],
    accentPaths: [
      'M45 37 L48 37', // Eyes
      'M52 37 L55 37',
    ],
  },
  '♉': { // Taurus - Bull with angular horns
    paths: [
      // Wide angular horns
      'M50 50 L35 35 L25 30 L20 35',
      'M50 50 L65 35 L75 30 L80 35',
      // Square head
      'M40 50 L60 50 L60 65 L40 65 Z',
      // Neck
      'M45 65 L45 80',
      'M55 65 L55 80',
    ],
    accentPaths: [
      'M47 55 L47 58', // Nostrils
      'M53 55 L53 58',
    ],
  },
  '♎': { // Libra - Two balanced geometric squares
    paths: [
      // Central pillar
      'M50 80 L50 45',
      // Horizontal balance beam
      'M25 45 L75 45',
      // Left square pan
      'M20 50 L35 50 L35 65 L20 65 Z',
      // Right square pan
      'M65 50 L80 50 L80 65 L65 65 Z',
      // Hanging lines
      'M27 45 L27 50',
      'M73 45 L73 50',
    ],
    accentPaths: [
      'M50 40 L50 35', // Crown
    ],
  },
  '♊': { // Gemini - Twin pillars Dogon style
    paths: [
      // Left pillar
      'M35 25 L35 75',
      'M30 25 L40 25',
      'M30 75 L40 75',
      // Right pillar  
      'M65 25 L65 75',
      'M60 25 L70 25',
      'M60 75 L70 75',
      // Connecting bars
      'M40 35 L60 35',
      'M40 50 L60 50',
      'M40 65 L60 65',
    ],
  },
  '♍': { // Virgo - Geometric maiden figure
    paths: [
      // Head circle simplified to diamond
      'M50 20 L55 25 L50 30 L45 25 Z',
      // Body column with arms
      'M50 30 L50 60',
      'M50 40 L35 50',
      'M50 40 L65 50',
      // Skirt - angular
      'M50 60 L35 85 L50 80 L65 85 Z',
    ],
    accentPaths: [
      'M45 45 L55 45',
    ],
  },
  '♐': { // Sagittarius - Arrow geometric
    paths: [
      // Arrow shaft
      'M25 80 L75 30',
      // Arrowhead
      'M75 30 L65 28 L75 30 L73 40',
      // Bow
      'M30 45 L25 55 L35 75',
    ],
    accentPaths: [
      'M70 35 L80 25', // Arrow tip accent
    ],
  },
  '♒': { // Aquarius - Water waves angular
    paths: [
      // Upper zigzag wave
      'M20 40 L30 35 L40 40 L50 35 L60 40 L70 35 L80 40',
      // Lower zigzag wave
      'M20 55 L30 50 L40 55 L50 50 L60 55 L70 50 L80 55',
      // Vertical connectors
      'M35 40 L35 55',
      'M65 40 L65 55',
    ],
  },
  '♓': { // Pisces - Two fish angular
    paths: [
      // Upper fish - angular
      'M30 30 L50 25 L70 30 L50 40 Z',
      // Lower fish - angular (reversed)
      'M30 70 L50 60 L70 70 L50 75 Z',
      // Connecting band
      'M50 40 L50 60',
      'M45 45 L55 55',
      'M55 45 L45 55',
    ],
  },
  '♋': { // Cancer - Kanaga (Double Cross) shape
    paths: [
      // Central vertical
      'M50 25 L50 75',
      // Upper Kanaga arms
      'M50 35 L30 25 L25 30',
      'M50 35 L70 25 L75 30',
      // Lower Kanaga arms (mirror)
      'M50 65 L30 75 L25 70',
      'M50 65 L70 75 L75 70',
    ],
    accentPaths: [
      'M45 50 L55 50', // Center bar
    ],
  },
};

// Sirius B Orbital Path Component
const SiriusOrbital = () => (
  <svg 
    viewBox="0 0 200 200" 
    className="absolute inset-0 w-full h-full opacity-20"
    style={{ transform: 'scale(1.5)' }}
  >
    {/* Sirius A - Center star */}
    <circle cx="100" cy="100" r="3" fill={DOGON_COLORS.siriusBlue} opacity="0.8" />
    
    {/* Sirius B elliptical orbit */}
    <ellipse 
      cx="100" 
      cy="100" 
      rx="60" 
      ry="35"
      fill="none"
      stroke={DOGON_COLORS.siriusBlue}
      strokeWidth="0.5"
      strokeDasharray="4 4"
      opacity="0.5"
      transform="rotate(-20 100 100)"
    />
    
    {/* Sirius B position */}
    <motion.circle 
      cx="160" 
      cy="90" 
      r="1.5" 
      fill={DOGON_COLORS.paleStraw}
      animate={{
        cx: [160, 100, 40, 100, 160],
        cy: [90, 70, 110, 130, 90],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    
    {/* Orbital markers */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
      const rad = (angle - 20) * Math.PI / 180;
      const x = 100 + Math.cos(rad) * 60;
      const y = 100 + Math.sin(rad) * 35;
      return (
        <circle 
          key={angle} 
          cx={x} 
          cy={y} 
          r="1" 
          fill={DOGON_COLORS.siriusBlue} 
          opacity="0.3" 
        />
      );
    })}
  </svg>
);

// Dogon Carved Wood Zodiac Glyph
const DogonCarvedGlyph = ({ glyph }: { glyph: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const pattern = dogonZodiacPaths[glyph] || dogonZodiacPaths['♈'];

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Deep indigo cosmos background */}
      <div 
        className="absolute -inset-8 rounded-full"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${DOGON_COLORS.deepIndigo} 0%, #080c14 100%)`,
        }}
      >
        <SiriusOrbital />
      </div>

      {/* Carved Wood Tablet */}
      <motion.div 
        className="relative w-48 h-56 md:w-56 md:h-64 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          boxShadow: isHovered 
            ? `0 12px 40px rgba(139, 58, 29, 0.4), inset 0 2px 4px rgba(232, 220, 200, 0.1)`
            : `0 8px 32px rgba(0,0,0,0.6), inset 0 2px 4px rgba(232, 220, 200, 0.05)`,
        }}
        transition={{ duration: 0.5 }}
        style={{
          background: `linear-gradient(145deg, ${DOGON_COLORS.mahogany} 0%, ${DOGON_COLORS.ebonyBlack} 100%)`,
          borderRadius: '8px',
        }}
      >
        {/* Wood grain texture */}
        <div 
          className="absolute inset-0 opacity-30 rounded-lg"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.1) 2px,
                rgba(0,0,0,0.1) 4px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 8px,
                rgba(0,0,0,0.05) 8px,
                rgba(0,0,0,0.05) 16px
              )
            `,
          }}
        />

        {/* Dusty patina overlay */}
        <div 
          className="absolute inset-0 rounded-lg opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='dust'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23dust)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Carved border frame */}
        <div 
          className="absolute inset-3 rounded border-2"
          style={{ 
            borderColor: DOGON_COLORS.rustClay,
            opacity: 0.4,
          }}
        />
        <div 
          className="absolute inset-5 rounded border"
          style={{ 
            borderColor: DOGON_COLORS.milletYellow,
            opacity: 0.2,
          }}
        />

        {/* The Carved Glyph */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-8">
          {/* Relief shadow layer (carved depth) */}
          {pattern.paths.map((path, i) => (
            <path
              key={`shadow-${i}`}
              d={path}
              fill="none"
              stroke={DOGON_COLORS.ebonyBlack}
              strokeWidth="6"
              strokeLinecap="square"
              strokeLinejoin="miter"
              opacity="0.8"
              transform="translate(1.5, 1.5)"
            />
          ))}

          {/* Main carved lines */}
          {pattern.paths.map((path, i) => (
            <motion.path
              key={`main-${i}`}
              d={path}
              fill="none"
              stroke={DOGON_COLORS.milletYellow}
              strokeWidth="4"
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            />
          ))}

          {/* Accent carved lines (rust color) */}
          {pattern.accentPaths?.map((path, i) => (
            <motion.path
              key={`accent-${i}`}
              d={path}
              fill="none"
              stroke={DOGON_COLORS.rustClay}
              strokeWidth="3"
              strokeLinecap="square"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
            />
          ))}

          {/* Highlight edges (light reflection on carving) */}
          {pattern.paths.map((path, i) => (
            <path
              key={`highlight-${i}`}
              d={path}
              fill="none"
              stroke={DOGON_COLORS.paleStraw}
              strokeWidth="1"
              strokeLinecap="square"
              strokeLinejoin="miter"
              opacity="0.3"
              transform="translate(-0.5, -0.5)"
            />
          ))}
        </svg>

        {/* Hover shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                135deg, 
                transparent 30%, 
                rgba(212, 184, 150, 0.1) 45%, 
                rgba(139, 58, 29, 0.15) 50%, 
                rgba(212, 184, 150, 0.1) 55%, 
                transparent 70%
              )`,
              backgroundSize: '200% 200%',
            }}
            animate={isHovered ? {
              backgroundPosition: ['200% 200%', '-100% -100%'],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Corner carvings - Dogon geometric */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
          <div 
            key={corner}
            className={`absolute w-4 h-4 ${
              corner === 'top-left' ? 'top-2 left-2' :
              corner === 'top-right' ? 'top-2 right-2' :
              corner === 'bottom-left' ? 'bottom-2 left-2' :
              'bottom-2 right-2'
            }`}
          >
            <svg viewBox="0 0 20 20" className="w-full h-full">
              <path
                d={
                  corner === 'top-left' ? 'M2 10 L10 2 L10 10 Z' :
                  corner === 'top-right' ? 'M18 10 L10 2 L10 10 Z' :
                  corner === 'bottom-left' ? 'M2 10 L10 18 L10 10 Z' :
                  'M18 10 L10 18 L10 10 Z'
                }
                fill={DOGON_COLORS.rustClay}
                opacity="0.4"
              />
            </svg>
          </div>
        ))}
      </motion.div>

      {/* Floating shadow */}
      <div 
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full blur-lg"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
};

const SkyQuadrant = ({ track }: SkyQuadrantProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* Quadrant Label - Dogon style */}
      <motion.p
        className="text-[10px] uppercase tracking-[0.3em] mb-4"
        style={{ 
          color: DOGON_COLORS.milletYellow,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
      >
        ◆ THE SKY • SIRIUS REALM ◆
      </motion.p>

      {/* Dogon Carved Zodiac Tablet */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -4, 0],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <DogonCarvedGlyph glyph={track.zodiacGlyph} />
      </motion.div>

      {/* Zodiac Details - Carved inscription style */}
      <motion.div
        className="mt-8 text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Sign Name */}
        <div>
          <p 
            className="carving-text text-2xl tracking-widest"
            style={{ 
              color: DOGON_COLORS.paleStraw,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {track.zodiacSign}
          </p>
          <p 
            className="text-xs tracking-[0.2em] uppercase mt-1"
            style={{ color: DOGON_COLORS.milletYellow }}
          >
            {track.zodiacName}
          </p>
        </div>

        {/* Planetary Ruler */}
        <div 
          className="pt-3 border-t"
          style={{ borderColor: `${DOGON_COLORS.rustClay}40` }}
        >
          <p 
            className="text-[10px] uppercase tracking-[0.2em] mb-1"
            style={{ color: DOGON_COLORS.rustClay }}
          >
            ◆ Celestial Ruler
          </p>
          <p 
            className="text-sm font-medium"
            style={{ 
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: DOGON_COLORS.paleStraw,
            }}
          >
            {track.planetaryRuler}
          </p>
        </div>

        {/* Moon Phase */}
        <div>
          <p 
            className="text-[10px] uppercase tracking-[0.2em] mb-1"
            style={{ color: DOGON_COLORS.siriusBlue }}
          >
            ◆ Moon Cycle
          </p>
          <p 
            className="text-sm"
            style={{ 
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: DOGON_COLORS.paleStraw,
            }}
          >
            {track.moonPhase}
          </p>
          <p 
            className="text-xs italic mt-1"
            style={{ color: `${DOGON_COLORS.milletYellow}90` }}
          >
            "{track.moonDescription}"
          </p>
        </div>

        {/* Zodiac Logic */}
        <div 
          className="pt-3 max-w-xs mx-auto"
          style={{ borderTop: `1px dashed ${DOGON_COLORS.rustClay}30` }}
        >
          <p 
            className="text-xs leading-relaxed italic"
            style={{ 
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: `${DOGON_COLORS.paleStraw}80`,
            }}
          >
            {track.zodiacLogic}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SkyQuadrant;
