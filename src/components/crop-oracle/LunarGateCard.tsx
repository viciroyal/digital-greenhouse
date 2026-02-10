import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';
import type { MasterCrop } from '@/hooks/useMasterCrops';

/* ─── Lunar Phase Protocol ───
   Maps crop categories to ideal moon phases based on biodynamic timing:
   - New/Waxing Crescent: Leaf crops (above-ground, leafy)
   - First Quarter/Waxing Gibbous: Fruit & structure crops (inside-seed)
   - Full Moon: Water-heavy crops, harvest window
   - Waning/Last Quarter: Root crops & soil work
─── */

interface LunarPhase {
  phase: string;
  phaseName: string;
  icon: string;
  task: string;
  glowColor: string;
  bgColor: string;
  borderColor: string;
}

const LUNAR_PHASES: Record<string, LunarPhase> = {
  leaf: {
    phase: 'WAXING CRESCENT',
    phaseName: 'The Sprout',
    icon: '🌒',
    task: 'Sow during the New Moon → First Quarter. Rising sap favors above-ground leaf growth.',
    glowColor: 'hsl(140 60% 45%)',
    bgColor: 'hsl(140 30% 8%)',
    borderColor: 'hsl(140 50% 25%)',
  },
  fruit: {
    phase: 'WAXING GIBBOUS',
    phaseName: 'The Builder',
    icon: '🌓',
    task: 'Plant during First Quarter → Full Moon. Rising energy fuels fruiting and internal seed development.',
    glowColor: 'hsl(210 70% 55%)',
    bgColor: 'hsl(210 30% 8%)',
    borderColor: 'hsl(210 50% 25%)',
  },
  harvest: {
    phase: 'FULL MOON',
    phaseName: 'The High Tide',
    icon: '🌕',
    task: 'Harvest at Full Moon for peak moisture and Brix. Ideal for grafting and water-heavy crops.',
    glowColor: 'hsl(45 90% 65%)',
    bgColor: 'hsl(45 25% 8%)',
    borderColor: 'hsl(45 60% 25%)',
  },
  root: {
    phase: 'WANING MOON',
    phaseName: 'The Root',
    icon: '🌘',
    task: 'Plant during Last Quarter → New Moon. Descending sap drives root anchoring and soil biology.',
    glowColor: 'hsl(15 60% 45%)',
    bgColor: 'hsl(15 25% 8%)',
    borderColor: 'hsl(15 45% 25%)',
  },
};

/** Map crop category to a lunar phase group */
function getLunarPhase(crop: MasterCrop): LunarPhase {
  const cat = crop.category.toLowerCase();
  const name = crop.name.toLowerCase();
  const common = (crop.common_name || '').toLowerCase();

  // Root crops → Waning
  if (
    cat.includes('root') || cat.includes('allium') || cat.includes('bulb') ||
    cat.includes('tuber') || name.includes('garlic') || name.includes('onion') ||
    name.includes('carrot') || name.includes('beet') || name.includes('potato') ||
    name.includes('radish') || name.includes('turnip') || name.includes('daikon') ||
    common.includes('garlic') || common.includes('onion')
  ) {
    return LUNAR_PHASES.root;
  }

  // Leaf crops → Waxing Crescent
  if (
    cat.includes('brassica') || cat.includes('leafy') || cat.includes('green') ||
    cat.includes('herb') || cat.includes('lettuce') || cat.includes('spinach') ||
    name.includes('basil') || name.includes('kale') || name.includes('chard') ||
    name.includes('lettuce') || name.includes('cabbage') || name.includes('collard')
  ) {
    return LUNAR_PHASES.leaf;
  }

  // Water-heavy / harvest crops → Full Moon
  if (
    cat.includes('cucurbit') || cat.includes('melon') ||
    name.includes('watermelon') || name.includes('cucumber') ||
    name.includes('squash') || name.includes('pumpkin') || name.includes('melon')
  ) {
    return LUNAR_PHASES.harvest;
  }

  // Fruit / structure crops → Waxing Gibbous (default for nightshades, legumes, grains)
  return LUNAR_PHASES.fruit;
}

interface LunarGateCardProps {
  crop: MasterCrop;
  zoneColor: string;
}

const LunarGateCard = ({ crop, zoneColor }: LunarGateCardProps) => {
  const lunar = getLunarPhase(crop);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: lunar.bgColor,
        border: `1px solid ${lunar.borderColor}`,
      }}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Moon className="w-4 h-4" style={{ color: lunar.glowColor }} />
          <span
            className="text-[10px] font-mono font-bold tracking-wider"
            style={{ color: lunar.glowColor }}
          >
            LUNAR GATE — WHEN TO STRUM
          </span>
        </div>

        {/* Phase display */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{lunar.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
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

        {/* Phase bar visualization */}
        <div className="flex gap-1 mt-3">
          {(['leaf', 'fruit', 'harvest', 'root'] as const).map((key) => {
            const p = LUNAR_PHASES[key];
            const isActive = p.phase === lunar.phase;
            return (
              <div
                key={key}
                className="flex-1 rounded-full relative overflow-hidden"
                style={{
                  height: 4,
                  background: isActive ? p.glowColor : 'hsl(0 0% 12%)',
                  opacity: isActive ? 1 : 0.4,
                  boxShadow: isActive ? `0 0 8px ${p.glowColor}60` : 'none',
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          {['🌒', '🌓', '🌕', '🌘'].map((icon, i) => (
            <span key={i} className="text-[8px] flex-1 text-center" style={{ opacity: 0.5 }}>
              {icon}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LunarGateCard;
