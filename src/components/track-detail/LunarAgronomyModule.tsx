import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface LunarAgronomyModuleProps {
  track: TrackData;
}

// Lunar phase data mapped by zodiac sign
interface LunarPhaseData {
  phase: string;
  phaseName: string;
  group: 'A' | 'B' | 'C' | 'D';
  task: string;
  plants: string;
  glowColor: string;
  backgroundColor: string;
  borderColor: string;
}

const ZODIAC_TO_LUNAR: Record<string, LunarPhaseData> = {
  // GROUP A: THE NEW MOON (Initiation & Leaf)
  // Aries (Track 3), Cancer (Track 12), Leo (Track 4)
  'Aries': {
    phase: 'WAXING CRESCENT',
    phaseName: 'The Sprout',
    group: 'A',
    task: 'Sow seeds that grow above ground. Set intentions.',
    plants: 'Leafy Greens, Basil, Spinach, Lettuce',
    glowColor: 'hsl(140 60% 45%)',
    backgroundColor: 'hsl(140 40% 12% / 0.6)',
    borderColor: 'hsl(140 60% 35% / 0.5)',
  },
  'Cancer': {
    phase: 'WAXING CRESCENT',
    phaseName: 'The Sprout',
    group: 'A',
    task: 'Sow seeds that grow above ground. Set intentions.',
    plants: 'Leafy Greens, Basil, Spinach, Lettuce',
    glowColor: 'hsl(140 60% 45%)',
    backgroundColor: 'hsl(140 40% 12% / 0.6)',
    borderColor: 'hsl(140 60% 35% / 0.5)',
  },
  'Leo': {
    phase: 'WAXING CRESCENT',
    phaseName: 'The Sprout',
    group: 'A',
    task: 'Sow seeds that grow above ground. Set intentions.',
    plants: 'Leafy Greens, Basil, Spinach, Lettuce',
    glowColor: 'hsl(140 60% 45%)',
    backgroundColor: 'hsl(140 40% 12% / 0.6)',
    borderColor: 'hsl(140 60% 35% / 0.5)',
  },

  // GROUP B: THE FIRST QUARTER (Structure & Fruit)
  // Taurus (Track 5), Virgo (Track 8), Capricorn (Track 1)
  'Taurus': {
    phase: 'WAXING GIBBOUS',
    phaseName: 'The Builder',
    group: 'B',
    task: 'Focus on structure. Trellising, pruning, and cloning.',
    plants: 'Beans, Peas, Peppers, Tomatoes (Inside-seed crops)',
    glowColor: 'hsl(210 70% 55%)',
    backgroundColor: 'hsl(210 40% 12% / 0.6)',
    borderColor: 'hsl(210 70% 40% / 0.5)',
  },
  'Virgo': {
    phase: 'WAXING GIBBOUS',
    phaseName: 'The Builder',
    group: 'B',
    task: 'Focus on structure. Trellising, pruning, and cloning.',
    plants: 'Beans, Peas, Peppers, Tomatoes (Inside-seed crops)',
    glowColor: 'hsl(210 70% 55%)',
    backgroundColor: 'hsl(210 40% 12% / 0.6)',
    borderColor: 'hsl(210 70% 40% / 0.5)',
  },
  'Capricorn': {
    phase: 'WAXING GIBBOUS',
    phaseName: 'The Builder',
    group: 'B',
    task: 'Focus on structure. Trellising, pruning, and cloning.',
    plants: 'Beans, Peas, Peppers, Tomatoes (Inside-seed crops)',
    glowColor: 'hsl(210 70% 55%)',
    backgroundColor: 'hsl(210 40% 12% / 0.6)',
    borderColor: 'hsl(210 70% 40% / 0.5)',
  },

  // GROUP C: THE FULL MOON (Energy & Harvest)
  // Gemini (Track 7), Libra (Track 6), Sagittarius (Track 9)
  'Gemini': {
    phase: 'FULL MOON',
    phaseName: 'The High Tide',
    group: 'C',
    task: 'Harvest now for highest moisture & Brix. Grafting.',
    plants: 'Melons, Squash, Cucumbers (High water crops)',
    glowColor: 'hsl(45 90% 70%)',
    backgroundColor: 'hsl(45 30% 12% / 0.6)',
    borderColor: 'hsl(45 80% 50% / 0.5)',
  },
  'Libra': {
    phase: 'FULL MOON',
    phaseName: 'The High Tide',
    group: 'C',
    task: 'Harvest now for highest moisture & Brix. Grafting.',
    plants: 'Melons, Squash, Cucumbers (High water crops)',
    glowColor: 'hsl(45 90% 70%)',
    backgroundColor: 'hsl(45 30% 12% / 0.6)',
    borderColor: 'hsl(45 80% 50% / 0.5)',
  },
  'Sagittarius': {
    phase: 'FULL MOON',
    phaseName: 'The High Tide',
    group: 'C',
    task: 'Harvest now for highest moisture & Brix. Grafting.',
    plants: 'Melons, Squash, Cucumbers (High water crops)',
    glowColor: 'hsl(45 90% 70%)',
    backgroundColor: 'hsl(45 30% 12% / 0.6)',
    borderColor: 'hsl(45 80% 50% / 0.5)',
  },

  // GROUP D: THE LAST QUARTER (Root & Soil)
  // Scorpio (Track 2), Aquarius (Track 10), Pisces (Track 11)
  'Scorpio': {
    phase: 'WANING MOON',
    phaseName: 'The Root',
    group: 'D',
    task: 'Focus on soil health. Weeding, composting, soil resets.',
    plants: 'Carrots, Beets, Onions, Garlic, Potatoes',
    glowColor: 'hsl(15 60% 45%)',
    backgroundColor: 'hsl(15 30% 12% / 0.6)',
    borderColor: 'hsl(15 50% 35% / 0.5)',
  },
  'Aquarius': {
    phase: 'WANING MOON',
    phaseName: 'The Root',
    group: 'D',
    task: 'Focus on soil health. Weeding, composting, soil resets.',
    plants: 'Carrots, Beets, Onions, Garlic, Potatoes',
    glowColor: 'hsl(15 60% 45%)',
    backgroundColor: 'hsl(15 30% 12% / 0.6)',
    borderColor: 'hsl(15 50% 35% / 0.5)',
  },
  'Pisces': {
    phase: 'WANING MOON',
    phaseName: 'The Root',
    group: 'D',
    task: 'Focus on soil health. Weeding, composting, soil resets.',
    plants: 'Carrots, Beets, Onions, Garlic, Potatoes',
    glowColor: 'hsl(15 60% 45%)',
    backgroundColor: 'hsl(15 30% 12% / 0.6)',
    borderColor: 'hsl(15 50% 35% / 0.5)',
  },
};

// Moon Phase SVG Icons
const MoonPhaseIcon = ({ group, color }: { group: 'A' | 'B' | 'C' | 'D'; color: string }) => {
  const renderPhase = () => {
    switch (group) {
      case 'A': // New Moon / Waxing Crescent
        return (
          <>
            <circle cx="30" cy="30" r="24" fill="hsl(220 20% 12%)" stroke={color} strokeWidth="1.5" />
            <path
              d="M30 6 A24 24 0 0 1 30 54 A18 24 0 0 0 30 6"
              fill={color}
              opacity="0.9"
            />
            {/* Stars around */}
            <circle cx="12" cy="14" r="1" fill={color} opacity="0.6" />
            <circle cx="48" cy="20" r="0.8" fill={color} opacity="0.5" />
            <circle cx="50" cy="40" r="1.2" fill={color} opacity="0.4" />
          </>
        );
      case 'B': // First Quarter / Waxing Gibbous
        return (
          <>
            <circle cx="30" cy="30" r="24" fill="hsl(220 20% 12%)" stroke={color} strokeWidth="1.5" />
            <path
              d="M30 6 A24 24 0 0 1 30 54 A8 24 0 0 0 30 6"
              fill={color}
              opacity="0.9"
            />
            {/* Structure lines */}
            <path d="M30 10 L30 50" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="2 3" />
            <path d="M20 30 L40 30" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="2 3" />
          </>
        );
      case 'C': // Full Moon
        return (
          <>
            {/* Outer glow */}
            <circle cx="30" cy="30" r="28" fill={`${color}20`} />
            <circle cx="30" cy="30" r="26" fill={`${color}30`} />
            <circle cx="30" cy="30" r="24" fill={color} stroke={color} strokeWidth="1.5" />
            {/* Crater details */}
            <circle cx="22" cy="24" r="4" fill="hsl(45 80% 80%)" opacity="0.3" />
            <circle cx="35" cy="32" r="6" fill="hsl(45 80% 80%)" opacity="0.2" />
            <circle cx="26" cy="38" r="3" fill="hsl(45 80% 80%)" opacity="0.25" />
          </>
        );
      case 'D': // Waning Moon / Last Quarter
        return (
          <>
            <circle cx="30" cy="30" r="24" fill="hsl(220 20% 12%)" stroke={color} strokeWidth="1.5" />
            <path
              d="M30 6 A24 24 0 0 0 30 54 A18 24 0 0 1 30 6"
              fill={color}
              opacity="0.9"
            />
            {/* Root tendrils */}
            <path d="M30 50 Q25 55 20 58" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
            <path d="M30 50 Q35 55 40 58" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
            <path d="M30 50 L30 58" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
          </>
        );
    }
  };

  return (
    <motion.svg
      viewBox="0 0 60 60"
      className="w-20 h-20"
      initial={{ rotate: 0, opacity: 0 }}
      animate={{ 
        rotate: group === 'C' ? [0, 5, -5, 0] : [0, 360],
        opacity: 1,
      }}
      transition={{
        rotate: {
          duration: group === 'C' ? 8 : 60,
          repeat: Infinity,
          ease: group === 'C' ? 'easeInOut' : 'linear',
        },
        opacity: { duration: 0.5 },
      }}
    >
      <defs>
        <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g filter="url(#moonGlow)">
        {renderPhase()}
      </g>
    </motion.svg>
  );
};

const LunarAgronomyModule = ({ track }: LunarAgronomyModuleProps) => {
  const lunarData = ZODIAC_TO_LUNAR[track.zodiacSign];
  
  if (!lunarData) return null;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: lunarData.backgroundColor,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${lunarData.borderColor}`,
        boxShadow: `0 0 40px ${lunarData.glowColor}20, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Moon dust texture */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Silver glow border effect */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px ${lunarData.glowColor}15`,
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          {/* Moon Phase Icon */}
          <div 
            className="flex-shrink-0"
            style={{ filter: `drop-shadow(0 0 10px ${lunarData.glowColor}60)` }}
          >
            <MoonPhaseIcon group={lunarData.group} color={lunarData.glowColor} />
          </div>

          <div className="flex-1">
            <p 
              className="font-body text-[10px] tracking-[0.2em] uppercase mb-1"
              style={{ color: 'hsl(220 20% 60%)' }}
            >
              LUNAR OPERATIONAL PROTOCOL
            </p>
            <h3 
              className="font-bubble text-xl mb-1"
              style={{ 
                color: lunarData.glowColor,
                textShadow: `0 0 20px ${lunarData.glowColor}60`,
              }}
            >
              {lunarData.phase}
            </h3>
            <p 
              className="font-body text-xs italic"
              style={{ color: 'hsl(40 50% 80%)' }}
            >
              "{lunarData.phaseName}"
            </p>
          </div>
        </div>

        {/* Divider */}
        <div 
          className="h-px mb-5"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${lunarData.glowColor}40, transparent)`,
          }}
        />

        {/* Section A: THE HANDS */}
        <motion.div 
          className="mb-5 p-4 rounded-xl"
          style={{
            background: 'hsl(220 20% 8% / 0.6)',
            border: `1px solid ${lunarData.glowColor}20`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            {/* Hand icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={lunarData.glowColor} strokeWidth="1.5">
              <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v6" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
              <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8V9a2 2 0 1 1 4 0" />
            </svg>
            <p 
              className="font-body text-[10px] tracking-[0.15em] uppercase"
              style={{ color: lunarData.glowColor }}
            >
              [MANUAL_OVERRIDE] — THE HANDS
            </p>
          </div>
          <p 
              className="font-body text-sm leading-relaxed"
            style={{ color: 'hsl(40 50% 85%)' }}
          >
            {lunarData.task}
          </p>
        </motion.div>

        {/* Section B: THE SEEDS */}
        <motion.div 
          className="p-4 rounded-xl"
          style={{
            background: 'hsl(220 20% 8% / 0.6)',
            border: `1px solid ${lunarData.glowColor}20`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-2">
            {/* Seed/sprout icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={lunarData.glowColor} strokeWidth="1.5">
              <path d="M12 22V12" />
              <path d="M12 12C12 12 8 9 8 6c0-2.5 2-4 4-4s4 1.5 4 4c0 3-4 6-4 6Z" />
              <path d="M12 12c-2 0-4-1.5-4-4" />
              <path d="M12 12c2 0 4-1.5 4-4" />
              <path d="M9 22h6" />
            </svg>
            <p 
              className="font-body text-[10px] tracking-[0.15em] uppercase"
              style={{ color: lunarData.glowColor }}
            >
              [GERMINATION_TARGET] — THE SEEDS
            </p>
          </div>
          <p 
            className="font-mono text-sm leading-relaxed"
            style={{ color: 'hsl(40 50% 85%)' }}
          >
            {lunarData.plants}
          </p>
        </motion.div>

        {/* Zodiac + Phase connection footer */}
        <motion.div 
          className="mt-5 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span 
            className="font-mono text-xs"
            style={{ color: `hsl(${track.colorHsl})` }}
          >
            {track.zodiacGlyph} {track.zodiacSign}
          </span>
          <span style={{ color: 'hsl(220 20% 40%)' }}>→</span>
          <span 
            className="font-mono text-xs"
            style={{ color: lunarData.glowColor }}
          >
            {lunarData.phase}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LunarAgronomyModule;
