import { motion } from 'framer-motion';
import { useState } from 'react';
import type { TrackData } from '@/data/trackData';

interface SkyQuadrantProps {
  track: TrackData;
}

// Earth pigment color palette
const OCHRE_COLORS = {
  mustardYellow: '#c49a3d',
  burntOrange: '#b5541e',
  creamyClay: '#eaddca',
  charcoalBlack: '#1a1612',
  deepRust: '#8b3a1d',
  sandstone: '#d4a574',
};

// Dot painting glyph paths for each zodiac sign
const zodiacDotPatterns: Record<string, { points: [number, number][]; accent: [number, number][] }> = {
  '♑': { // Capricorn - Sea Goat curved horn
    points: [
      [30, 65], [35, 55], [40, 48], [48, 42], [56, 40], [64, 42], [72, 48],
      [75, 55], [76, 65], [74, 75], [70, 82], [64, 86], [56, 85], [50, 80],
      [46, 72], [44, 64], [44, 56], [46, 50], [52, 46], [60, 46], [66, 50],
      [70, 58], [68, 68], [62, 74], [54, 72], [52, 64], [56, 58], [62, 60],
    ],
    accent: [[40, 35], [45, 30], [52, 28], [60, 30], [65, 35], [50, 90], [55, 94], [60, 92]],
  },
  '♏': { // Scorpio - M with arrow tail
    points: [
      [25, 45], [28, 55], [32, 65], [35, 55], [38, 45], [42, 55], [46, 65],
      [50, 55], [54, 45], [58, 55], [62, 65], [66, 55], [70, 50], [74, 52],
      [78, 56], [82, 62], [80, 68], [76, 64], [72, 58],
    ],
    accent: [[82, 70], [78, 74], [74, 72], [85, 58], [88, 55]],
  },
  '♈': { // Aries - Ram horns
    points: [
      [50, 80], [50, 70], [50, 60], [50, 52], [48, 44], [44, 38], [38, 35],
      [32, 36], [28, 42], [26, 50], [28, 58], [32, 62],
      [52, 44], [56, 38], [62, 35], [68, 36], [72, 42], [74, 50], [72, 58], [68, 62],
    ],
    accent: [[50, 85], [45, 88], [55, 88], [24, 52], [76, 52]],
  },
  '♌': { // Leo - Lion's mane curl
    points: [
      [35, 70], [38, 60], [42, 52], [48, 46], [55, 44], [62, 46], [68, 52],
      [72, 60], [73, 70], [70, 78], [64, 82], [56, 80], [50, 74], [48, 66],
      [50, 58], [56, 54], [62, 56], [65, 62], [63, 70], [56, 72],
    ],
    accent: [[30, 75], [28, 65], [30, 55], [75, 55], [78, 65], [75, 75], [55, 85], [50, 88]],
  },
  '♉': { // Taurus - Bull circle with horns
    points: [
      [40, 65], [45, 58], [52, 54], [60, 54], [67, 58], [72, 65], [72, 74],
      [67, 81], [58, 84], [48, 81], [42, 74], [40, 65],
      [36, 50], [32, 42], [30, 34], [34, 28],
      [76, 50], [80, 42], [82, 34], [78, 28],
    ],
    accent: [[28, 26], [84, 26], [55, 68], [52, 72], [58, 72]],
  },
  '♎': { // Libra - Balanced scales
    points: [
      [25, 70], [35, 70], [45, 70], [55, 70], [65, 70], [75, 70],
      [50, 70], [50, 60], [50, 50], [50, 42],
      [30, 50], [35, 45], [42, 42], [58, 42], [65, 45], [70, 50],
    ],
    accent: [[25, 48], [30, 44], [70, 44], [75, 48], [50, 36], [46, 32], [54, 32]],
  },
  '♊': { // Gemini - Twin pillars
    points: [
      [35, 30], [35, 40], [35, 50], [35, 60], [35, 70], [35, 80],
      [65, 30], [65, 40], [65, 50], [65, 60], [65, 70], [65, 80],
      [40, 35], [45, 35], [50, 35], [55, 35], [60, 35],
      [40, 75], [45, 75], [50, 75], [55, 75], [60, 75],
    ],
    accent: [[30, 28], [70, 28], [30, 82], [70, 82], [50, 55]],
  },
  '♍': { // Virgo - M with loop
    points: [
      [25, 75], [28, 62], [32, 50], [36, 62], [40, 75],
      [40, 62], [44, 50], [48, 62], [52, 75],
      [52, 62], [56, 50], [60, 55], [64, 62], [66, 70], [64, 78], [58, 82],
      [68, 75], [72, 68], [76, 60], [78, 52],
    ],
    accent: [[80, 48], [82, 42], [78, 38], [72, 42], [74, 50]],
  },
  '♐': { // Sagittarius - Arrow
    points: [
      [25, 80], [32, 72], [40, 64], [48, 56], [56, 48], [64, 40], [72, 32],
      [65, 32], [58, 32], [72, 32], [72, 40], [72, 48],
    ],
    accent: [[22, 84], [78, 26], [55, 28], [76, 52], [80, 30], [74, 24]],
  },
  '♒': { // Aquarius - Water waves
    points: [
      [25, 45], [32, 40], [40, 45], [48, 40], [56, 45], [64, 40], [72, 45], [78, 40],
      [25, 60], [32, 55], [40, 60], [48, 55], [56, 60], [64, 55], [72, 60], [78, 55],
    ],
    accent: [[22, 45], [80, 40], [22, 60], [80, 55], [50, 72], [50, 32]],
  },
  '♓': { // Pisces - Two fish curves
    points: [
      [30, 50], [32, 42], [38, 36], [46, 34], [54, 36], [60, 42], [62, 50],
      [30, 50], [32, 58], [38, 64], [46, 66], [54, 64], [60, 58], [62, 50],
      [36, 50], [42, 50], [48, 50], [54, 50], [60, 50], [66, 50], [72, 50],
    ],
    accent: [[26, 50], [74, 50], [46, 30], [46, 70], [68, 44], [68, 56]],
  },
  '♋': { // Cancer - Crab claws (69 shape)
    points: [
      [35, 45], [40, 38], [48, 35], [55, 38], [58, 45], [55, 52], [48, 54],
      [42, 50], [40, 44], [44, 40], [50, 42], [52, 48],
      [65, 55], [60, 62], [52, 65], [45, 62], [42, 55], [45, 48], [52, 46],
      [58, 50], [60, 56], [56, 60], [50, 58], [48, 52],
    ],
    accent: [[32, 42], [68, 58], [35, 55], [65, 45], [50, 50]],
  },
};

// Aboriginal Dot Painting Zodiac Glyph Component
const DotPaintingZodiacGlyph = ({ glyph, signName }: { glyph: string; signName: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const pattern = zodiacDotPatterns[glyph] || zodiacDotPatterns['♈'];
  
  // Generate random variation for organic feel
  const jitter = (value: number, amount: number = 1.5) => {
    return value + (Math.random() - 0.5) * amount;
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Ceremonial Stone/Wood Disk Background */}
      <motion.div 
        className="relative w-52 h-52 md:w-64 md:h-64 rounded-full cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          boxShadow: isHovered 
            ? `0 12px 48px rgba(196, 154, 61, 0.3), 0 0 60px rgba(196, 154, 61, 0.15), inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -4px 8px rgba(0,0,0,0.5)`
            : `0 8px 32px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -4px 8px rgba(0,0,0,0.5)`,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          background: `
            radial-gradient(ellipse at 30% 30%, ${OCHRE_COLORS.charcoalBlack} 0%, #0d0b09 100%)
          `,
        }}
      >
        {/* Shimmer overlay on hover */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                135deg, 
                transparent 20%, 
                rgba(196, 154, 61, 0.15) 40%, 
                rgba(212, 165, 116, 0.2) 50%, 
                rgba(196, 154, 61, 0.15) 60%, 
                transparent 80%
              )`,
              backgroundSize: '200% 200%',
            }}
            animate={isHovered ? {
              backgroundPosition: ['200% 200%', '-100% -100%'],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Smoked wood/stone texture overlay */}
        <div 
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Rough edge texture */}
        <div 
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, transparent 45%, ${OCHRE_COLORS.charcoalBlack} 48%, transparent 52%)
            `,
          }}
        />

        {/* Outer ceremonial dot border ring */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          {/* Outermost ring - clay white */}
          {[...Array(36)].map((_, i) => {
            const angle = (i / 36) * Math.PI * 2;
            const x = 50 + Math.cos(angle) * 46;
            const y = 50 + Math.sin(angle) * 46;
            return (
              <motion.circle
                key={`outer1-${i}`}
                cx={jitter(x)}
                cy={jitter(y)}
                r={i % 3 === 0 ? 1.8 : 1.2}
                fill={i % 3 === 0 ? OCHRE_COLORS.mustardYellow : OCHRE_COLORS.creamyClay}
                opacity={0.7 + Math.random() * 0.3}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.01, duration: 0.3 }}
              />
            );
          })}

          {/* Second ring - burnt orange */}
          {[...Array(28)].map((_, i) => {
            const angle = (i / 28) * Math.PI * 2 + 0.1;
            const x = 50 + Math.cos(angle) * 40;
            const y = 50 + Math.sin(angle) * 40;
            return (
              <motion.circle
                key={`outer2-${i}`}
                cx={jitter(x)}
                cy={jitter(y)}
                r={i % 2 === 0 ? 1.5 : 1}
                fill={i % 2 === 0 ? OCHRE_COLORS.burntOrange : OCHRE_COLORS.deepRust}
                opacity={0.6 + Math.random() * 0.3}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.01, duration: 0.3 }}
              />
            );
          })}

          {/* Inner ring - sandstone */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2 - 0.15;
            const x = 50 + Math.cos(angle) * 34;
            const y = 50 + Math.sin(angle) * 34;
            return (
              <motion.circle
                key={`inner-${i}`}
                cx={jitter(x)}
                cy={jitter(y)}
                r={1.2}
                fill={OCHRE_COLORS.sandstone}
                opacity={0.5 + Math.random() * 0.3}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.01, duration: 0.3 }}
              />
            );
          })}
        </svg>

        {/* The Zodiac Glyph - Dot Painted */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-6">
          {/* Main glyph dots */}
          {pattern.points.map((point, i) => (
            <motion.circle
              key={`main-${i}`}
              cx={jitter(point[0] * 0.8 + 10)}
              cy={jitter(point[1] * 0.8 + 10)}
              r={2 + Math.random() * 0.8}
              fill={i % 3 === 0 ? OCHRE_COLORS.mustardYellow : 
                    i % 3 === 1 ? OCHRE_COLORS.creamyClay : OCHRE_COLORS.sandstone}
              opacity={0.85 + Math.random() * 0.15}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.85 + Math.random() * 0.15 }}
              transition={{ 
                delay: 0.6 + i * 0.02, 
                duration: 0.3,
                type: "spring",
                stiffness: 200,
              }}
            />
          ))}

          {/* Accent dots - burnt orange/rust */}
          {pattern.accent.map((point, i) => (
            <motion.circle
              key={`accent-${i}`}
              cx={jitter(point[0] * 0.8 + 10)}
              cy={jitter(point[1] * 0.8 + 10)}
              r={1.5 + Math.random() * 0.5}
              fill={i % 2 === 0 ? OCHRE_COLORS.burntOrange : OCHRE_COLORS.deepRust}
              opacity={0.7 + Math.random() * 0.2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.03, duration: 0.3 }}
            />
          ))}

          {/* Connecting spirit dots between main points */}
          {pattern.points.slice(0, -1).map((point, i) => {
            const nextPoint = pattern.points[i + 1];
            if (!nextPoint) return null;
            const midX = (point[0] + nextPoint[0]) / 2;
            const midY = (point[1] + nextPoint[1]) / 2;
            return (
              <motion.circle
                key={`connect-${i}`}
                cx={jitter(midX * 0.8 + 10, 2)}
                cy={jitter(midY * 0.8 + 10, 2)}
                r={0.8 + Math.random() * 0.4}
                fill={OCHRE_COLORS.creamyClay}
                opacity={0.3 + Math.random() * 0.2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 + i * 0.01, duration: 0.2 }}
              />
            );
          })}
        </svg>

        {/* Center spirit dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ 
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: OCHRE_COLORS.mustardYellow,
              boxShadow: `0 0 8px ${OCHRE_COLORS.mustardYellow}40`,
            }} 
          />
        </motion.div>

        {/* Subtle dust/patina overlay + enhanced glow on hover */}
        <motion.div 
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            background: isHovered
              ? `radial-gradient(ellipse at 70% 20%, rgba(196, 154, 61, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(181, 84, 30, 0.2) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(196, 154, 61, 0.1) 0%, transparent 60%)`
              : `radial-gradient(ellipse at 70% 20%, rgba(196, 154, 61, 0.1) 0%, transparent 40%), radial-gradient(ellipse at 20% 80%, rgba(139, 58, 29, 0.08) 0%, transparent 30%)`
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Floating artifact shadow */}
      <div 
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-4 rounded-full blur-lg"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
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
      {/* Quadrant Label */}
      <motion.p
        className="text-[10px] uppercase tracking-[0.3em] mb-4"
        style={{ color: OCHRE_COLORS.sandstone }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
      >
        ◈ THE SKY ◈
      </motion.p>

      {/* Dot Painting Zodiac Artifact */}
      <motion.div
        className="relative"
        animate={{
          rotate: [0, 0.5, -0.5, 0],
          y: [0, -3, 0],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <DotPaintingZodiacGlyph glyph={track.zodiacGlyph} signName={track.zodiacSign} />
      </motion.div>

      {/* Zodiac Name & Details - Earth Pigment Style */}
      <motion.div
        className="mt-6 text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Sign Name */}
        <div>
          <p 
            className="text-lg font-bold tracking-wider uppercase"
            style={{ 
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: OCHRE_COLORS.creamyClay,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {track.zodiacSign}
          </p>
          <p 
            className="text-xs tracking-widest uppercase mt-0.5"
            style={{ color: OCHRE_COLORS.sandstone }}
          >
            {track.zodiacName}
          </p>
        </div>

        {/* Planetary Ruler */}
        <div 
          className="pt-3 border-t"
          style={{ borderColor: `${OCHRE_COLORS.sandstone}30` }}
        >
          <p 
            className="text-[10px] uppercase tracking-[0.2em] mb-1"
            style={{ color: OCHRE_COLORS.mustardYellow }}
          >
            ◈ Celestial Ruler
          </p>
          <p 
            className="text-sm font-medium"
            style={{ 
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: OCHRE_COLORS.creamyClay,
            }}
          >
            {track.planetaryRuler}
          </p>
        </div>

        {/* Moon Phase */}
        <div>
          <p 
            className="text-[10px] uppercase tracking-[0.2em] mb-1"
            style={{ color: OCHRE_COLORS.burntOrange }}
          >
            ◈ Moon Cycle
          </p>
          <p 
            className="text-sm"
            style={{ 
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: OCHRE_COLORS.creamyClay,
            }}
          >
            {track.moonPhase}
          </p>
          <p 
            className="text-xs italic mt-1"
            style={{ color: `${OCHRE_COLORS.sandstone}90` }}
          >
            "{track.moonDescription}"
          </p>
        </div>

        {/* Zodiac Logic */}
        <div 
          className="pt-3 max-w-xs mx-auto"
          style={{ borderTop: `1px dashed ${OCHRE_COLORS.sandstone}20` }}
        >
          <p 
            className="text-xs leading-relaxed italic"
            style={{ 
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: `${OCHRE_COLORS.creamyClay}80`,
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
