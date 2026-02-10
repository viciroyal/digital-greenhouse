import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Moon, Check, X } from 'lucide-react';
import type { MasterCrop } from '@/hooks/useMasterCrops';

/* ─── Lunar Phase Protocol ───
   Maps crop categories to ideal moon phases based on biodynamic timing:
   - New/Waxing Crescent: Leaf crops (above-ground, leafy)
   - First Quarter/Waxing Gibbous: Fruit & structure crops (inside-seed)
   - Full Moon: Water-heavy crops, harvest window
   - Waning/Last Quarter: Root crops & soil work
─── */

type PhaseKey = 'leaf' | 'fruit' | 'harvest' | 'root';

interface LunarPhase {
  key: PhaseKey;
  phase: string;
  phaseName: string;
  icon: string;
  task: string;
  glowColor: string;
  bgColor: string;
  borderColor: string;
}

const LUNAR_PHASES: Record<PhaseKey, LunarPhase> = {
  leaf: {
    key: 'leaf',
    phase: 'WAXING CRESCENT',
    phaseName: 'The Sprout',
    icon: '🌒',
    task: 'Sow during the New Moon → First Quarter. Rising sap favors above-ground leaf growth.',
    glowColor: 'hsl(140 60% 45%)',
    bgColor: 'hsl(140 30% 8%)',
    borderColor: 'hsl(140 50% 25%)',
  },
  fruit: {
    key: 'fruit',
    phase: 'WAXING GIBBOUS',
    phaseName: 'The Builder',
    icon: '🌓',
    task: 'Plant during First Quarter → Full Moon. Rising energy fuels fruiting and internal seed development.',
    glowColor: 'hsl(210 70% 55%)',
    bgColor: 'hsl(210 30% 8%)',
    borderColor: 'hsl(210 50% 25%)',
  },
  harvest: {
    key: 'harvest',
    phase: 'FULL MOON',
    phaseName: 'The High Tide',
    icon: '🌕',
    task: 'Harvest at Full Moon for peak moisture and Brix. Ideal for grafting and water-heavy crops.',
    glowColor: 'hsl(45 90% 65%)',
    bgColor: 'hsl(45 25% 8%)',
    borderColor: 'hsl(45 60% 25%)',
  },
  root: {
    key: 'root',
    phase: 'WANING MOON',
    phaseName: 'The Root',
    icon: '🌘',
    task: 'Plant during Last Quarter → New Moon. Descending sap drives root anchoring and soil biology.',
    glowColor: 'hsl(15 60% 45%)',
    bgColor: 'hsl(15 25% 8%)',
    borderColor: 'hsl(15 45% 25%)',
  },
};

/* ─── Real-time moon phase calculator ───
   Uses a synodic month algorithm (lunation cycle = 29.53059 days)
   to determine the current moon phase from a known New Moon reference. */

const SYNODIC_MONTH = 29.53059;
const KNOWN_NEW_MOON = new Date('2024-01-11T11:57:00Z').getTime();

interface CurrentMoon {
  age: number;
  phaseName: string;
  icon: string;
  matchesKey: PhaseKey;
  illumination: number;
}

export function getCurrentMoonPhase(): CurrentMoon {
  const now = Date.now();
  const daysSinceRef = (now - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
  const age = ((daysSinceRef % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const illumination = Math.round((1 - Math.cos((age / SYNODIC_MONTH) * 2 * Math.PI)) / 2 * 100);

  if (age < 1.85)  return { age, phaseName: 'New Moon',        icon: '🌑', matchesKey: 'leaf',    illumination };
  if (age < 7.38)  return { age, phaseName: 'Waxing Crescent', icon: '🌒', matchesKey: 'leaf',    illumination };
  if (age < 9.23)  return { age, phaseName: 'First Quarter',   icon: '🌓', matchesKey: 'fruit',   illumination };
  if (age < 14.77) return { age, phaseName: 'Waxing Gibbous',  icon: '🌔', matchesKey: 'fruit',   illumination };
  if (age < 16.61) return { age, phaseName: 'Full Moon',        icon: '🌕', matchesKey: 'harvest', illumination };
  if (age < 22.15) return { age, phaseName: 'Waning Gibbous',  icon: '🌖', matchesKey: 'root',    illumination };
  if (age < 23.99) return { age, phaseName: 'Last Quarter',    icon: '🌗', matchesKey: 'root',    illumination };
  return            { age, phaseName: 'Waning Crescent',icon: '🌘', matchesKey: 'root',    illumination };
}

/** Map crop category to a lunar phase group */
export function getLunarPhase(crop: MasterCrop): LunarPhase {
  const cat = crop.category.toLowerCase();
  const name = crop.name.toLowerCase();
  const common = (crop.common_name || '').toLowerCase();

  if (
    cat.includes('root') || cat.includes('allium') || cat.includes('bulb') ||
    cat.includes('tuber') || name.includes('garlic') || name.includes('onion') ||
    name.includes('carrot') || name.includes('beet') || name.includes('potato') ||
    name.includes('radish') || name.includes('turnip') || name.includes('daikon') ||
    common.includes('garlic') || common.includes('onion')
  ) return LUNAR_PHASES.root;

  if (
    cat.includes('brassica') || cat.includes('leafy') || cat.includes('green') ||
    cat.includes('herb') || cat.includes('lettuce') || cat.includes('spinach') ||
    name.includes('basil') || name.includes('kale') || name.includes('chard') ||
    name.includes('lettuce') || name.includes('cabbage') || name.includes('collard')
  ) return LUNAR_PHASES.leaf;

  if (
    cat.includes('cucurbit') || cat.includes('melon') ||
    name.includes('watermelon') || name.includes('cucumber') ||
    name.includes('squash') || name.includes('pumpkin') || name.includes('melon')
  ) return LUNAR_PHASES.harvest;

  return LUNAR_PHASES.fruit;
}

interface LunarGateCardProps {
  crop: MasterCrop;
  zoneColor: string;
}

const LunarGateCard = ({ crop, zoneColor }: LunarGateCardProps) => {
  const lunar = getLunarPhase(crop);
  const currentMoon = useMemo(() => getCurrentMoonPhase(), []);
  const isGateOpen = currentMoon.matchesKey === lunar.key;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: lunar.bgColor,
        border: `1px solid ${isGateOpen ? lunar.glowColor : lunar.borderColor}`,
        boxShadow: isGateOpen ? `0 0 20px ${lunar.glowColor}25` : 'none',
      }}
    >
      <div className="p-3">
        {/* Header with live status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4" style={{ color: lunar.glowColor }} />
            <span
              className="text-[10px] font-mono font-bold tracking-wider"
              style={{ color: lunar.glowColor }}
            >
              LUNAR GATE — WHEN TO STRUM
            </span>
          </div>
          <motion.div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
            style={{
              background: isGateOpen ? 'hsl(140 50% 15%)' : 'hsl(0 30% 12%)',
              border: `1px solid ${isGateOpen ? 'hsl(140 60% 40%)' : 'hsl(0 40% 30%)'}`,
            }}
            animate={isGateOpen ? { opacity: [0.8, 1, 0.8] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isGateOpen
              ? <Check className="w-2.5 h-2.5" style={{ color: 'hsl(140 70% 55%)' }} />
              : <X className="w-2.5 h-2.5" style={{ color: 'hsl(0 50% 50%)' }} />
            }
            <span
              className="text-[7px] font-mono font-bold tracking-wider"
              style={{ color: isGateOpen ? 'hsl(140 70% 55%)' : 'hsl(0 50% 50%)' }}
            >
              {isGateOpen ? 'GATE OPEN' : 'GATE CLOSED'}
            </span>
          </motion.div>
        </div>

        {/* Current moon — live readout */}
        <div
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg mb-2.5"
          style={{
            background: 'hsl(0 0% 5%)',
            border: '1px solid hsl(0 0% 12%)',
          }}
        >
          <span className="text-lg">{currentMoon.icon}</span>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-mono block" style={{ color: 'hsl(0 0% 40%)' }}>
              CURRENT MOON
            </span>
            <span className="text-[11px] font-mono font-bold" style={{ color: 'hsl(0 0% 75%)' }}>
              {currentMoon.phaseName}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 35%)' }}>
              {currentMoon.illumination}% lit
            </span>
            <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 30%)' }}>
              Day {Math.floor(currentMoon.age)}/{Math.round(SYNODIC_MONTH)}
            </span>
          </div>
        </div>

        {/* Ideal phase display */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{lunar.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>IDEAL:</span>
              <span
                className="text-sm font-mono font-bold"
                style={{ color: lunar.glowColor }}
              >
                {lunar.phase}
              </span>
              <span
                className="text-[9px] font-mono italic"
                style={{ color: 'hsl(0 0% 45%)' }}
              >
                "{lunar.phaseName}"
              </span>
            </div>
            <p
              className="text-[10px] font-mono mt-1 leading-relaxed"
              style={{ color: 'hsl(0 0% 55%)' }}
            >
              {lunar.task}
            </p>
          </div>
        </div>

        {/* Phase bar with NOW marker */}
        <div className="relative mt-3">
          <div className="flex gap-1">
            {(['leaf', 'fruit', 'harvest', 'root'] as const).map((key) => {
              const p = LUNAR_PHASES[key];
              const isIdeal = p.key === lunar.key;
              const isNow = p.key === currentMoon.matchesKey;
              return (
                <div
                  key={key}
                  className="flex-1 rounded-full relative overflow-hidden"
                  style={{
                    height: 6,
                    background: isIdeal ? p.glowColor : isNow ? 'hsl(0 0% 25%)' : 'hsl(0 0% 12%)',
                    opacity: isIdeal || isNow ? 1 : 0.4,
                    boxShadow: isIdeal ? `0 0 8px ${p.glowColor}60` : 'none',
                  }}
                >
                  {isNow && (
                    <motion.div
                      className="absolute inset-y-0 w-1.5 rounded-full"
                      style={{ background: 'hsl(0 0% 90%)', left: '50%', marginLeft: -3 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            {(['leaf', 'fruit', 'harvest', 'root'] as const).map((key) => {
              const isNow = key === currentMoon.matchesKey;
              return (
                <span
                  key={key}
                  className="text-[8px] flex-1 text-center font-mono"
                  style={{
                    opacity: isNow ? 1 : 0.4,
                    color: isNow ? 'hsl(0 0% 70%)' : 'hsl(0 0% 35%)',
                  }}
                >
                  {LUNAR_PHASES[key].icon} {isNow ? '◄ NOW' : ''}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LunarGateCard;