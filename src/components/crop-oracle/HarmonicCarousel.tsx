import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music } from 'lucide-react';
import { CHORD_RECIPES } from '@/data/chordRecipes';
import { HARMONIC_ZONES } from '@/data/harmonicZoneProtocol';

/* ─── Group recipes by frequency ─── */
const ZONE_FREQUENCIES = [396, 417, 528, 639, 741, 852, 963] as const;

const ZONE_META: Record<number, { note: string; name: string; color: string }> = {};
for (const z of HARMONIC_ZONES) {
  ZONE_META[z.frequencyHz] = { note: z.note, name: z.agroIdentity, color: z.colorHex };
}

const HarmonicCarousel = () => {
  const [expandedZone, setExpandedZone] = useState<number | null>(null);

  const recipesByZone = useMemo(() => {
    const map: Record<number, typeof CHORD_RECIPES> = {};
    for (const freq of ZONE_FREQUENCIES) map[freq] = [];
    for (const r of CHORD_RECIPES) {
      if (map[r.frequencyHz]) map[r.frequencyHz].push(r);
    }
    return map;
  }, []);

  return (
    <div
      className="mx-4 mb-4 rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(0 0% 6%), hsl(0 0% 4%))',
        border: '1px solid hsl(0 0% 12%)',
        boxShadow: 'inset 0 1px 0 hsl(0 0% 10%), 0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div className="px-3 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid hsl(0 0% 10%)' }}>
        <Music className="w-3.5 h-3.5" style={{ color: 'hsl(45 80% 55%)' }} />
        <span className="text-[9px] font-mono font-bold tracking-[0.2em]" style={{ color: 'hsl(45 80% 55%)' }}>
          HARMONIC MATRIX
        </span>
        <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
          7 ZONES • {CHORD_RECIPES.length} CHORDS
        </span>
      </div>

      {/* 7 Zone Key Blocks */}
      <div className="grid grid-cols-7 gap-px p-1.5" style={{ background: 'hsl(0 0% 4%)' }}>
        {ZONE_FREQUENCIES.map((freq) => {
          const meta = ZONE_META[freq];
          const recipes = recipesByZone[freq];
          const isExpanded = expandedZone === freq;

          return (
            <button
              key={freq}
              onClick={() => setExpandedZone(isExpanded ? null : freq)}
              className="rounded-lg flex flex-col items-center py-1.5 px-0.5 transition-all relative"
              style={{
                background: isExpanded
                  ? `${meta.color}18`
                  : `${meta.color}08`,
                border: `1px solid ${isExpanded ? `${meta.color}50` : `${meta.color}15`}`,
                boxShadow: isExpanded ? `0 0 12px ${meta.color}20, inset 0 0 8px ${meta.color}08` : 'none',
              }}
            >
              {/* Note */}
              <span
                className="text-sm font-mono font-bold leading-none"
                style={{ color: meta.color, textShadow: isExpanded ? `0 0 8px ${meta.color}60` : 'none' }}
              >
                {meta.note}
              </span>
              {/* Hz */}
              <span className="text-[7px] font-mono mt-0.5" style={{ color: `${meta.color}90` }}>
                {freq}
              </span>
              {/* Zone name */}
              <span className="text-[6px] font-mono mt-0.5 truncate w-full text-center" style={{ color: 'hsl(0 0% 40%)' }}>
                {meta.name}
              </span>
              {/* Recipe count dots */}
              <div className="flex gap-0.5 mt-1">
                {recipes.map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full"
                    style={{ background: meta.color, opacity: 0.6 }}
                  />
                ))}
              </div>
              {/* Active indicator */}
              {isExpanded && (
                <motion.div
                  layoutId="zone-indicator"
                  className="absolute -bottom-px left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
                  style={{ background: meta.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded Zone: Crop Cards */}
      <AnimatePresence mode="wait">
        {expandedZone && (
          <motion.div
            key={expandedZone}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 pt-1 space-y-1.5" style={{ borderTop: `1px solid ${ZONE_META[expandedZone].color}20` }}>
              {recipesByZone[expandedZone].map((recipe) => (
                <ZoneRecipeCard key={recipe.chordName} recipe={recipe} color={ZONE_META[expandedZone].color} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Compact Recipe Card ─── */
const ZoneRecipeCard = ({ recipe, color }: { recipe: typeof CHORD_RECIPES[0]; color: string }) => (
  <div
    className="rounded-lg px-2 py-1.5"
    style={{
      background: `${color}06`,
      border: `1px solid ${color}15`,
    }}
  >
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-[8px] font-mono font-bold tracking-wider" style={{ color }}>
        {recipe.chordName}
      </span>
    </div>
    <div className="grid grid-cols-7 gap-0.5">
      {recipe.intervals.map((iv) => (
        <div
          key={iv.interval}
          className="flex flex-col items-center py-0.5 rounded"
          style={{ background: `${color}08` }}
        >
          <span className="text-[10px] leading-none">{iv.emoji}</span>
          <span className="text-[5px] font-mono mt-0.5 truncate w-full text-center" style={{ color: 'hsl(0 0% 55%)' }}>
            {iv.cropName.split(' ')[0]}
          </span>
          <span className="text-[5px] font-mono" style={{ color: `${color}80` }}>
            {iv.interval}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default HarmonicCarousel;
