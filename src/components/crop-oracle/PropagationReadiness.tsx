import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Lightbulb } from 'lucide-react';

interface SupplyItem {
  id: string;
  label: string;
  emoji: string;
  weight: number;
  tip: string;
  alternatives: string;
}

const SUPPLY_CHECKLIST: SupplyItem[] = [
  {
    id: 'trays',
    label: 'Seed Starting Trays',
    emoji: '🫘',
    weight: 15,
    tip: 'Cell trays give each seedling its own root space — less transplant shock.',
    alternatives: 'Egg cartons, yogurt cups, or toilet paper rolls work in a pinch.',
  },
  {
    id: 'mix',
    label: 'Seed Starting Mix',
    emoji: '🌱',
    weight: 20,
    tip: 'Lighter than garden soil — helps tiny roots breathe and prevents damping-off.',
    alternatives: 'Equal parts coco coir, perlite, and vermiculite is a solid DIY option.',
  },
  {
    id: 'dome',
    label: 'Humidity Dome / Cover',
    emoji: '💧',
    weight: 10,
    tip: 'Holds moisture during germination so seeds don\'t dry out.',
    alternatives: 'Plastic wrap or a clear bag over the tray does the same thing.',
  },
  {
    id: 'heat_mat',
    label: 'Heat Mat',
    emoji: '🔥',
    weight: 10,
    tip: 'Warm-season crops (tomatoes, peppers) germinate 30–50% faster with bottom heat.',
    alternatives: 'Top of a fridge or near a warm appliance can provide gentle warmth.',
  },
  {
    id: 'light',
    label: 'Grow Light or Sunny Window',
    emoji: '☀️',
    weight: 18,
    tip: '14–16 hrs of light prevents leggy seedlings. A south-facing window can work.',
    alternatives: 'A basic shop light with daylight bulbs (6500K) is affordable and effective.',
  },
  {
    id: 'labels',
    label: 'Labels & Markers',
    emoji: '🏷️',
    weight: 5,
    tip: 'You will forget what you planted. Trust us on this one.',
    alternatives: 'Popsicle sticks + permanent marker — simple and reliable.',
  },
  {
    id: 'spray',
    label: 'Spray Bottle / Bottom Tray',
    emoji: '💦',
    weight: 8,
    tip: 'Gentle watering prevents seed displacement. Bottom-watering is even better.',
    alternatives: 'Any shallow container that your trays can sit in works for bottom-watering.',
  },
  {
    id: 'fertilizer',
    label: 'Gentle Fertilizer (Fish Emulsion etc.)',
    emoji: '🐟',
    weight: 7,
    tip: 'Seedlings need a light feed after the 2nd true leaf set — 1/4 strength.',
    alternatives: 'Dilute compost tea or worm casting extract are great organic options.',
  },
  {
    id: 'seeds',
    label: 'Quality Seeds',
    emoji: '🌰',
    weight: 7,
    tip: 'Fresh, well-stored seeds = better germination rates. Check the packed date.',
    alternatives: 'Local seed libraries and swaps are free and offer locally-adapted varieties.',
  },
];

interface PropagationReadinessProps {
  zoneColor: string;
}

const PropagationReadiness = ({ zoneColor }: PropagationReadinessProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const toggle = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalWeight = SUPPLY_CHECKLIST.reduce((s, i) => s + i.weight, 0);
  const earnedWeight = SUPPLY_CHECKLIST.filter(i => checkedItems.has(i.id)).reduce((s, i) => s + i.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  const missing = SUPPLY_CHECKLIST.filter(i => !checkedItems.has(i.id));
  const topMissing = missing.sort((a, b) => b.weight - a.weight).slice(0, 3);

  const vibeLabel =
    score >= 90 ? 'Ready to Grow' :
    score >= 65 ? 'Solid Foundation' :
    score >= 40 ? 'Getting There' :
    score > 0 ? 'Just Starting Out' :
    'Check What You Have';

  const vibeColor =
    score >= 90 ? 'hsl(120 45% 50%)' :
    score >= 65 ? 'hsl(80 50% 50%)' :
    score >= 40 ? 'hsl(45 70% 55%)' :
    'hsl(0 0% 45%)';

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-3.5 h-3.5" style={{ color: 'hsl(45 70% 60%)' }} />
        <span className="text-[9px] font-mono tracking-widest" style={{ color: 'hsl(45 60% 55%)' }}>
          READINESS CHECK — WHAT DO YOU HAVE?
        </span>
      </div>

      <p className="text-[8px] font-mono mb-3 leading-relaxed" style={{ color: 'hsl(0 0% 45%)' }}>
        This is a guide, not a law — check off what you already have and we'll suggest what might help most. You can absolutely start with less.
      </p>

      {/* Checklist */}
      <div className="space-y-1 mb-3">
        {SUPPLY_CHECKLIST.map(item => {
          const checked = checkedItems.has(item.id);
          const isExpanded = expandedTip === item.id;

          return (
            <div key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all"
                style={{
                  background: checked ? `${zoneColor}10` : 'hsl(0 0% 7%)',
                  border: `1px solid ${checked ? `${zoneColor}40` : 'hsl(0 0% 13%)'}`,
                }}
              >
                {checked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: zoneColor }} />
                ) : (
                  <Circle className="w-3.5 h-3.5 shrink-0" style={{ color: 'hsl(0 0% 25%)' }} />
                )}
                <span className="text-sm shrink-0">{item.emoji}</span>
                <span
                  className="text-[9px] font-mono flex-1"
                  style={{ color: checked ? zoneColor : 'hsl(0 0% 55%)' }}
                >
                  {item.label}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedTip(isExpanded ? null : item.id);
                  }}
                  className="text-[8px] font-mono shrink-0 px-1.5 py-0.5 rounded"
                  style={{
                    color: 'hsl(0 0% 40%)',
                    background: 'hsl(0 0% 10%)',
                  }}
                >
                  {isExpanded ? 'less' : 'tips'}
                </button>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-6 mt-1 mb-1 px-2.5 py-2 rounded-lg"
                  style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 12%)' }}
                >
                  <p className="text-[8px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 50%)' }}>
                    {item.tip}
                  </p>
                  <p className="text-[8px] font-mono leading-relaxed mt-1" style={{ color: 'hsl(45 50% 50%)' }}>
                    💡 {item.alternatives}
                  </p>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score bar */}
      <div
        className="p-2.5 rounded-lg"
        style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 13%)' }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono font-bold" style={{ color: vibeColor }}>
            {vibeLabel}
          </span>
          <span className="text-[9px] font-mono font-bold" style={{ color: vibeColor }}>
            {score}%
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(0 0% 12%)' }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ background: vibeColor }}
          />
        </div>

        {/* Suggestions for missing high-impact items */}
        {topMissing.length > 0 && score < 90 && (
          <div className="mt-2 space-y-1">
            <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 40%)' }}>
              {score >= 65 ? 'Nice to have next:' : 'Would help most:'}
            </span>
            {topMissing.map(item => (
              <div key={item.id} className="flex items-center gap-1.5">
                <span className="text-[10px]">{item.emoji}</span>
                <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {score >= 90 && (
          <p className="text-[8px] font-mono mt-2 leading-relaxed" style={{ color: 'hsl(120 40% 50%)' }}>
            🌿 You're well-equipped — time to sow some seeds!
          </p>
        )}
      </div>
    </div>
  );
};

export default PropagationReadiness;
