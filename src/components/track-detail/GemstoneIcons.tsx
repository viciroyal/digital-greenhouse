import { motion } from 'framer-motion';

// Organic Gemstone Chakra Symbol - matching the MasterMatrix style
export const GemstoneChakraIcon = ({ color, size = 48, delay = 0 }: { color: string; size?: number; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, rotate: -180 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ 
      duration: 0.6, 
      delay,
      type: "spring",
      stiffness: 200,
      damping: 15
    }}
  >
    <motion.svg 
      viewBox="0 0 40 40" 
      width={size} 
      height={size} 
      className="drop-shadow-lg"
      whileHover={{ scale: 1.1, rotate: 15 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <defs>
        <radialGradient id={`gem-icon-${color.replace(/\s/g, '')}`} cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 75%)`} />
          <stop offset="50%" stopColor={`hsl(${color})`} />
          <stop offset="100%" stopColor={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 25%)`} />
        </radialGradient>
        <radialGradient id={`glow-icon-${color.replace(/\s/g, '')}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`hsl(${color} / 0.6)`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      
      <motion.circle 
        cx="20" 
        cy="20" 
        r="18" 
        fill={`url(#glow-icon-${color.replace(/\s/g, '')})`}
        initial={{ r: 0 }}
        animate={{ r: 18 }}
        transition={{ duration: 0.4, delay: delay + 0.2 }}
      />
      
      {/* Vine tendrils */}
      <motion.g 
        stroke="hsl(140 50% 35%)" 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.4, delay: delay + 0.4 }}
      >
        <path d="M20 2 Q24 6, 20 10 Q16 14, 18 18" />
        <path d="M38 20 Q34 24, 30 20 Q26 16, 22 18" />
        <path d="M20 38 Q16 34, 20 30 Q24 26, 22 22" />
        <path d="M2 20 Q6 16, 10 20 Q14 24, 18 22" />
      </motion.g>
      
      {/* Leaf accents */}
      <motion.g 
        fill="hsl(140 50% 40%)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.5 }}
      >
        <ellipse cx="22" cy="5" rx="2" ry="1.2" transform="rotate(45 22 5)" />
        <ellipse cx="35" cy="22" rx="2" ry="1.2" transform="rotate(-45 35 22)" />
        <ellipse cx="18" cy="35" rx="2" ry="1.2" transform="rotate(45 18 35)" />
        <ellipse cx="5" cy="18" rx="2" ry="1.2" transform="rotate(-45 5 18)" />
      </motion.g>
      
      {/* Main gemstone */}
      <motion.polygon 
        points="20,8 28,14 28,26 20,32 12,26 12,14" 
        fill={`url(#gem-icon-${color.replace(/\s/g, '')})`}
        stroke={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 65%)`}
        strokeWidth="0.8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          delay: delay + 0.3 
        }}
        style={{ transformOrigin: "center" }}
      />
      
      {/* Facet lines */}
      <motion.g 
        stroke={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 80% / 0.4)`} 
        strokeWidth="0.4" 
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.6 }}
      >
        <line x1="20" y1="8" x2="20" y2="20" />
        <line x1="28" y1="14" x2="20" y2="20" />
        <line x1="28" y1="26" x2="20" y2="20" />
        <line x1="20" y1="32" x2="20" y2="20" />
        <line x1="12" y1="26" x2="20" y2="20" />
        <line x1="12" y1="14" x2="20" y2="20" />
      </motion.g>
      
      {/* Highlight */}
      <motion.ellipse 
        cx="16" 
        cy="14" 
        rx="2.5" 
        ry="1.5" 
        fill="white" 
        transform="rotate(-30 16 14)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.3, delay: delay + 0.7 }}
      />
      
      {/* Mosaic bead accents */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.5, staggerChildren: 0.1 }}
      >
        <circle cx="20" cy="4" r="1.5" fill={`hsl(${color})`} opacity="0.7" />
        <circle cx="32" cy="12" r="1" fill="hsl(45 90% 60%)" opacity="0.5" />
        <circle cx="32" cy="28" r="1" fill="hsl(220 75% 55%)" opacity="0.5" />
        <circle cx="20" cy="36" r="1.5" fill={`hsl(${color})`} opacity="0.7" />
        <circle cx="8" cy="28" r="1" fill="hsl(280 60% 55%)" opacity="0.5" />
        <circle cx="8" cy="12" r="1" fill="hsl(350 75% 50%)" opacity="0.5" />
      </motion.g>
    </motion.svg>
  </motion.div>
);

// Woven Vine Zodiac Glyph - organic mosaic style
export const WovenZodiacGlyph = ({ glyph, color, size = 120 }: { glyph: string; color: string; size?: number }) => {
  // Zodiac paths redrawn as organic vine patterns
  const zodiacVinePaths: Record<string, { mainPath: string; accentPaths: string[] }> = {
    '♑': { 
      mainPath: 'M50 75 Q48 60 50 40 Q45 30 35 25 Q28 28 30 35 M50 40 Q55 30 65 25 Q72 28 70 35 M45 55 Q40 75 40 90 M55 55 Q60 75 60 90',
      accentPaths: ['M48 35 Q50 30 52 35', 'M43 45 Q50 42 57 45']
    },
    '♏': { 
      mainPath: 'M25 60 Q28 40 35 35 Q42 50 50 35 Q58 50 65 35 Q72 40 75 55 Q80 50 88 45',
      accentPaths: ['M85 48 Q90 42 92 38', 'M75 55 Q78 58 82 55']
    },
    '♈': { 
      mainPath: 'M50 85 Q50 60 50 45 Q45 35 35 35 Q25 40 25 55 Q28 62 35 58 M50 45 Q55 35 65 35 Q75 40 75 55 Q72 62 65 58',
      accentPaths: ['M45 55 Q50 52 55 55', 'M48 48 Q50 45 52 48']
    },
    '♌': { 
      mainPath: 'M50 25 Q45 18 50 15 Q55 18 50 25 M50 25 Q50 45 50 75 M42 75 Q38 85 38 92 M58 75 Q62 85 62 92 M50 30 Q42 22 38 25 M50 30 Q58 22 62 25',
      accentPaths: ['M45 35 Q50 33 55 35', 'M35 28 L32 26', 'M65 28 L68 26']
    },
    '♉': { 
      mainPath: 'M50 50 Q40 40 30 32 Q22 35 25 42 M50 50 Q60 40 70 32 Q78 35 75 42 M40 50 Q40 62 45 75 M60 50 Q60 62 55 75',
      accentPaths: ['M45 55 Q50 52 55 55', 'M47 58 L47 62', 'M53 58 L53 62']
    },
    '♎': { 
      mainPath: 'M50 80 Q50 60 50 45 M25 45 Q50 42 75 45 M28 48 Q27 58 32 65 Q24 60 22 52 M72 48 Q73 58 68 65 Q76 60 78 52',
      accentPaths: ['M50 40 L50 35', 'M35 55 Q35 60 40 58', 'M65 55 Q65 60 60 58']
    },
    '♊': { 
      mainPath: 'M35 25 Q35 50 35 75 M65 25 Q65 50 65 75 M38 35 Q50 32 62 35 M38 50 Q50 48 62 50 M38 65 Q50 62 62 65',
      accentPaths: ['M32 25 Q35 22 38 25', 'M32 75 Q35 78 38 75', 'M62 25 Q65 22 68 25', 'M62 75 Q65 78 68 75']
    },
    '♍': { 
      mainPath: 'M50 22 Q55 25 50 30 Q45 25 50 22 M50 30 Q50 45 50 60 M50 40 Q40 48 35 52 M50 40 Q60 48 65 52 M50 60 Q40 75 38 85 Q50 80 62 85 Q60 75 50 60',
      accentPaths: ['M45 45 Q50 43 55 45']
    },
    '♐': { 
      mainPath: 'M25 80 Q45 55 75 30 M75 30 Q68 28 70 35 M75 30 Q72 38 68 35 M28 50 Q25 62 35 75',
      accentPaths: ['M70 32 Q78 25 82 22']
    },
    '♒': { 
      mainPath: 'M20 40 Q30 32 40 40 Q50 48 60 40 Q70 32 80 40 M20 55 Q30 48 40 55 Q50 62 60 55 Q70 48 80 55',
      accentPaths: ['M35 40 Q35 48 35 55', 'M65 40 Q65 48 65 55']
    },
    '♓': { 
      mainPath: 'M30 30 Q50 22 70 30 Q55 35 50 38 Q45 35 30 30 M30 70 Q50 78 70 70 Q55 65 50 62 Q45 65 30 70 M50 38 Q48 50 50 62 Q52 50 50 38',
      accentPaths: ['M45 48 Q50 45 55 52', 'M45 52 Q50 55 55 48']
    },
    '♋': { 
      mainPath: 'M50 25 Q50 50 50 75 M50 35 Q35 25 28 30 M50 35 Q65 25 72 30 M50 65 Q35 75 28 70 M50 65 Q65 75 72 70',
      accentPaths: ['M45 50 Q50 48 55 50']
    },
  };

  const pattern = zodiacVinePaths[glyph] || zodiacVinePaths['♈'];

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Cosmic background disc */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, hsl(280 50% 20%) 0%, hsl(250 50% 10%) 100%)`,
          boxShadow: `0 0 30px hsl(${color} / 0.3), inset 0 0 20px hsl(${color} / 0.1)`,
        }}
      />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3,
            height: 3,
            backgroundColor: ['hsl(350 75% 55%)', 'hsl(220 75% 60%)', 'hsl(45 90% 55%)', 'hsl(280 60% 55%)'][i % 4],
            left: `${20 + Math.cos(i * 0.8) * 35}%`,
            top: `${20 + Math.sin(i * 0.8) * 35}%`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Main zodiac glyph */}
      <svg viewBox="0 0 100 100" width={size} height={size} className="relative z-10">
        {/* Glow background */}
        <circle cx="50" cy="50" r="45" fill={`hsl(${color} / 0.1)`} />
        
        {/* Vine/root main path */}
        <motion.path
          d={pattern.mainPath}
          fill="none"
          stroke={`hsl(${color})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            filter: `drop-shadow(0 0 4px hsl(${color} / 0.5))`,
          }}
        />
        
        {/* Accent vine paths */}
        {pattern.accentPaths.map((path, i) => (
          <motion.path
            key={i}
            d={path}
            fill="none"
            stroke="hsl(140 50% 45%)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
          />
        ))}
        
        {/* Gemstone beads along the path */}
        <g>
          <circle cx="50" cy="25" r="4" fill={`hsl(${color})`}>
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="45" r="3" fill="hsl(45 90% 55%)" opacity="0.8" />
          <circle cx="65" cy="45" r="3" fill="hsl(220 75% 55%)" opacity="0.8" />
          <circle cx="50" cy="75" r="4" fill={`hsl(${color})`}>
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="1s" />
          </circle>
        </g>
        
        {/* Small leaf accents */}
        <g fill="hsl(140 50% 40%)" opacity="0.7">
          <ellipse cx="40" cy="35" rx="3" ry="1.5" transform="rotate(-45 40 35)" />
          <ellipse cx="60" cy="35" rx="3" ry="1.5" transform="rotate(45 60 35)" />
          <ellipse cx="45" cy="65" rx="2.5" ry="1.2" transform="rotate(-30 45 65)" />
          <ellipse cx="55" cy="65" rx="2.5" ry="1.2" transform="rotate(30 55 65)" />
        </g>
      </svg>
    </motion.div>
  );
};

// Organic Body Silhouette with Gemstone Chakras
export const GemstoneBodySvg = ({ highlightArea, color }: { highlightArea: string; color: string }) => {
  const isArea = (area: string) => highlightArea === area;

  const ChakraGem = ({ cx, cy, isActive, gemColor, index }: { cx: number; cy: number; isActive: boolean; gemColor: string; index: number }) => (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: 0.3 + index * 0.1,
        type: "spring",
        stiffness: 200 
      }}
    >
      {/* Outer glow */}
      <motion.circle 
        cx={cx} 
        cy={cy} 
        r={isActive ? 10 : 6} 
        fill={`hsl(${gemColor} / ${isActive ? 0.4 : 0.15})`}
        animate={isActive ? { 
          r: [10, 12, 10],
          opacity: [0.4, 0.6, 0.4] 
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Gemstone shape */}
      <motion.polygon
        points={`${cx},${cy-5} ${cx+4},${cy-2} ${cx+4},${cy+3} ${cx},${cy+6} ${cx-4},${cy+3} ${cx-4},${cy-2}`}
        fill={isActive ? `hsl(${gemColor})` : `hsl(${gemColor} / 0.4)`}
        stroke={`hsl(${gemColor} / 0.8)`}
        strokeWidth="0.5"
        whileHover={{ scale: 1.2 }}
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* Highlight */}
      {isActive && (
        <motion.ellipse 
          cx={cx-1} 
          cy={cy-2} 
          rx="1.5" 
          ry="1" 
          fill="white" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        />
      )}
    </motion.g>
  );

  return (
    <svg viewBox="0 0 100 160" className="w-full h-full max-h-52">
      {/* Organic body outline - flowing vine curves */}
      <g stroke="hsl(40 50% 75% / 0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round">
        {/* Head */}
        <ellipse cx="50" cy="18" rx="12" ry="14" />
        {/* Neck */}
        <path d="M44 30 Q50 35 56 30" />
        {/* Shoulders & Arms */}
        <path d="M38 38 Q30 42 22 55 Q18 65 15 72" />
        <path d="M62 38 Q70 42 78 55 Q82 65 85 72" />
        {/* Torso */}
        <path d="M38 38 Q35 55 38 75 Q42 85 50 90" />
        <path d="M62 38 Q65 55 62 75 Q58 85 50 90" />
        {/* Legs */}
        <path d="M42 88 Q40 110 38 140 Q36 148 35 152" />
        <path d="M58 88 Q60 110 62 140 Q64 148 65 152" />
      </g>

      {/* Vine connecting line through chakras */}
      <motion.path
        d="M50 8 Q52 20 50 32 Q48 45 50 60 Q52 75 50 90"
        stroke="hsl(140 50% 35%)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="3 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Chakra gemstones */}
      <ChakraGem cx={50} cy={8} isActive={isArea('crown')} gemColor="280 60% 60%" index={0} />
      <ChakraGem cx={50} cy={18} isActive={isArea('eyes')} gemColor="250 60% 55%" index={1} />
      <ChakraGem cx={50} cy={32} isActive={isArea('throat')} gemColor="220 75% 55%" index={2} />
      <ChakraGem cx={50} cy={48} isActive={isArea('heart')} gemColor="140 60% 45%" index={3} />
      <ChakraGem cx={50} cy={60} isActive={isArea('stomach')} gemColor="45 90% 55%" index={4} />
      <ChakraGem cx={50} cy={75} isActive={isArea('sacral')} gemColor="25 85% 55%" index={5} />
      <ChakraGem cx={50} cy={90} isActive={isArea('feet')} gemColor={color} index={6} />

      {/* Active area enhancement - floating beads */}
      {highlightArea && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(6)].map((_, i) => {
            const cy = highlightArea === 'crown' ? 8 :
                       highlightArea === 'eyes' ? 18 :
                       highlightArea === 'throat' ? 32 :
                       highlightArea === 'heart' ? 48 :
                       highlightArea === 'stomach' ? 60 :
                       highlightArea === 'sacral' ? 75 : 90;
            return (
              <motion.circle
                key={i}
                cx={50 + Math.cos(i * 1.05) * 18}
                cy={cy + Math.sin(i * 1.05) * 8}
                r="2"
                fill={`hsl(${color})`}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0.5, 1, 0.5],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            );
          })}
        </motion.g>
      )}
    </svg>
  );
};

// Crystal Gem Icon with entrance animation
export const CrystalGemIcon = ({ color, size = 32, delay = 0 }: { color: string; size?: number; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotate: -45 }}
    animate={{ opacity: 1, y: 0, rotate: 0 }}
    transition={{ 
      duration: 0.5, 
      delay,
      type: "spring",
      stiffness: 150
    }}
  >
    <motion.svg 
      viewBox="0 0 32 32" 
      width={size} 
      height={size}
      whileHover={{ scale: 1.15, rotate: 10 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <defs>
        <linearGradient id={`crystal-grad-${color.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 70%)`} />
          <stop offset="50%" stopColor={`hsl(${color})`} />
          <stop offset="100%" stopColor={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 35%)`} />
        </linearGradient>
      </defs>
      
      {/* Glow */}
      <motion.circle 
        cx="16" 
        cy="16" 
        r="14" 
        fill={`hsl(${color} / 0.2)`}
        initial={{ r: 0, opacity: 0 }}
        animate={{ r: 14, opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.1 }}
      />
      
      {/* Crystal shape */}
      <motion.polygon 
        points="16,2 24,10 24,22 16,30 8,22 8,10" 
        fill={`url(#crystal-grad-${color.replace(/\s/g, '')})`}
        stroke={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 60%)`}
        strokeWidth="0.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          delay: delay + 0.2 
        }}
        style={{ transformOrigin: "center" }}
      />
      
      {/* Facets */}
      <motion.g 
        stroke={`hsl(${color.split(' ')[0]} ${color.split(' ')[1]} 80% / 0.5)`} 
        strokeWidth="0.3" 
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.4 }}
      >
        <line x1="16" y1="2" x2="16" y2="16" />
        <line x1="24" y1="10" x2="16" y2="16" />
        <line x1="24" y1="22" x2="16" y2="16" />
        <line x1="16" y1="30" x2="16" y2="16" />
        <line x1="8" y1="22" x2="16" y2="16" />
        <line x1="8" y1="10" x2="16" y2="16" />
      </motion.g>
      
      {/* Highlight */}
      <motion.ellipse 
        cx="12" 
        cy="8" 
        rx="2" 
        ry="1.5" 
        fill="white" 
        transform="rotate(-30 12 8)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.3, delay: delay + 0.5 }}
      />
    </motion.svg>
  </motion.div>
);

// Mineral Earth Icon with entrance animation
export const MineralEarthIcon = ({ color, size = 32, delay = 0 }: { color: string; size?: number; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: 180 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ 
      duration: 0.6, 
      delay,
      type: "spring",
      stiffness: 120
    }}
  >
    <motion.svg 
      viewBox="0 0 32 32" 
      width={size} 
      height={size}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Earth base */}
      <motion.circle 
        cx="16" 
        cy="16" 
        r="12" 
        fill="hsl(20 40% 20%)" 
        stroke="hsl(20 40% 30%)" 
        strokeWidth="1"
        initial={{ r: 0 }}
        animate={{ r: 12 }}
        transition={{ duration: 0.4, delay: delay + 0.1 }}
      />
      
      {/* Mineral veins */}
      <motion.g
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.3 }}
      >
        <motion.path 
          d="M8 16 Q12 12 16 16 Q20 20 24 16" 
          stroke={`hsl(${color})`} 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: delay + 0.3 }}
        />
        <motion.path 
          d="M12 8 Q16 14 12 24" 
          stroke={`hsl(${color} / 0.6)`} 
          strokeWidth="1" 
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.4 }}
        />
        <motion.path 
          d="M20 8 Q16 14 20 24" 
          stroke={`hsl(${color} / 0.6)`} 
          strokeWidth="1" 
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
        />
      </motion.g>
      
      {/* Gem deposits */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.6 }}
      >
        <motion.circle 
          cx="14" 
          cy="12" 
          r="2" 
          fill={`hsl(${color})`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle 
          cx="18" 
          cy="20" 
          r="2" 
          fill={`hsl(${color})`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <circle cx="10" cy="18" r="1.5" fill="hsl(45 90% 55%)" opacity="0.8" />
        <circle cx="22" cy="14" r="1.5" fill="hsl(220 75% 55%)" opacity="0.8" />
      </motion.g>
    </motion.svg>
  </motion.div>
);
