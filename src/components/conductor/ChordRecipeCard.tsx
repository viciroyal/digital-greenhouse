import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Leaf, Shield, Pickaxe, Sparkles, Zap, Layers, ChevronDown, ChevronUp, CalendarCheck, AlertTriangle } from 'lucide-react';
import { ChordRecipe, ChordRecipeInterval } from '@/data/chordRecipes';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { getZoneAwarePlantingWindows, cropFitsZone } from '@/lib/frostDates';

const INTERVAL_STYLES: Record<string, { icon: React.ReactNode; accent: string }> = {
  '1st':  { icon: <Leaf className="w-3.5 h-3.5" />,     accent: 'hsl(120 50% 50%)' },
  '3rd':  { icon: <Sparkles className="w-3.5 h-3.5" />,  accent: 'hsl(45 80% 55%)' },
  '5th':  { icon: <Pickaxe className="w-3.5 h-3.5" />,   accent: 'hsl(35 70% 55%)' },
  '7th':  { icon: <Zap className="w-3.5 h-3.5" />,       accent: 'hsl(270 50% 60%)' },
  '9th':  { icon: <Layers className="w-3.5 h-3.5" />,    accent: 'hsl(15 60% 50%)' },
  '11th': { icon: <Shield className="w-3.5 h-3.5" />,    accent: 'hsl(180 60% 55%)' },
  '13th': { icon: <Music className="w-3.5 h-3.5" />,     accent: 'hsl(90 60% 55%)' },
};

interface ChordRecipeCardProps {
  recipe: ChordRecipe;
  isSelected?: boolean;
  onSelect?: (recipe: ChordRecipe) => void;
  hardinessZone?: number | null;
}

const ChordRecipeCard = ({ recipe, isSelected, onSelect, hardinessZone }: ChordRecipeCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { frequencyHz, zoneName, zoneColor, chordName, intervals } = recipe;
  const { data: allCrops } = useMasterCrops();

  // Build lookup: crop name (lowercased) -> MasterCrop
  const cropLookup = useMemo(() => {
    if (!allCrops) return new Map<string, MasterCrop>();
    const map = new Map<string, MasterCrop>();
    for (const c of allCrops) {
      if (c.common_name) map.set(c.common_name.toLowerCase(), c);
      map.set(c.name.toLowerCase(), c);
    }
    return map;
  }, [allCrops]);

  // Find the Star (1st) crop data
  const starInterval = intervals.find(iv => iv.interval === '1st');
  const starCrop = starInterval ? cropLookup.get(starInterval.cropName.toLowerCase()) : undefined;

  // Show first 4 intervals collapsed, all 7 expanded
  const visibleIntervals = expanded ? intervals : intervals.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        background: 'linear-gradient(135deg, hsl(0 0% 6%), hsl(0 0% 4%))',
        border: isSelected
          ? `2px solid ${zoneColor}`
          : '2px solid hsl(0 0% 12%)',
        boxShadow: isSelected
          ? `0 0 30px ${zoneColor}40, inset 0 1px 0 hsl(0 0% 12%)`
          : '0 4px 20px hsl(0 0% 0% / 0.4)',
      }}
      onClick={() => onSelect?.(recipe)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
    >
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${zoneColor}20, transparent)`,
          borderBottom: `1px solid ${zoneColor}30`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `${zoneColor}20`,
              border: `1px solid ${zoneColor}50`,
              boxShadow: `0 0 12px ${zoneColor}30`,
            }}
          >
            <Music className="w-5 h-5" style={{ color: zoneColor }} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide" style={{ color: zoneColor }}>
              {chordName}
            </h3>
            <p className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
              {zoneName} • {frequencyHz}Hz
            </p>
          </div>
        </div>

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-2.5 py-1 rounded-full"
            style={{
              background: `${zoneColor}25`,
              border: `1px solid ${zoneColor}60`,
            }}
          >
            <span className="text-[9px] font-mono font-bold" style={{ color: zoneColor }}>
              SELECTED
            </span>
          </motion.div>
        )}
      </div>

      {/* Intervals Grid */}
      <div className="p-3 space-y-1.5">
        <AnimatePresence initial={false}>
          {visibleIntervals.map((interval, i) => {
            const companionCrop = cropLookup.get(interval.cropName.toLowerCase());
            return (
              <IntervalRow
                key={interval.interval}
                interval={interval}
                index={i}
                zoneColor={zoneColor}
                starCrop={starCrop}
                companionCrop={companionCrop}
                hardinessZone={hardinessZone}
              />
            );
          })}
        </AnimatePresence>

        {/* Expand / Collapse Toggle */}
        <button
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg mt-2 transition-colors"
          style={{
            background: 'hsl(0 0% 8%)',
            border: '1px solid hsl(0 0% 14%)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 40%)' }} />
              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                COLLAPSE
              </span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: zoneColor }} />
              <span className="text-[10px] font-mono" style={{ color: zoneColor }}>
                +3 MORE INTERVALS
              </span>
            </>
          )}
        </button>
      </div>

      {/* Footer: Voicing density */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{
          background: 'hsl(0 0% 3%)',
          borderTop: '1px solid hsl(0 0% 10%)',
        }}
      >
        <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
          7-VOICE POLYCULTURE
        </span>
        <div className="flex gap-1">
          {intervals.map((iv) => {
            const style = INTERVAL_STYLES[iv.interval];
            return (
              <div
                key={iv.interval}
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: `${style?.accent || 'hsl(0 0% 30%)'}20`,
                  border: `1px solid ${style?.accent || 'hsl(0 0% 30%)'}50`,
                }}
                title={`${iv.interval} — ${iv.cropName}`}
              >
                <span className="text-[8px]">{iv.emoji}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Interval Row ─── */
interface IntervalRowProps {
  interval: ChordRecipeInterval;
  index: number;
  zoneColor: string;
  starCrop?: MasterCrop;
  companionCrop?: MasterCrop;
  hardinessZone?: number | null;
}

const IntervalRow = ({ interval, index, zoneColor, starCrop, companionCrop, hardinessZone }: IntervalRowProps) => {
  const style = INTERVAL_STYLES[interval.interval];
  const accent = style?.accent || 'hsl(0 0% 50%)';

  // Season overlap logic (skip for 1st interval — it IS the star)
  const isStar = interval.interval === '1st';
  const starSeasons = starCrop?.planting_season || [];
  const compSeasons = companionCrop?.planting_season || [];
  const sharedSeasons = starSeasons.filter(s => compSeasons.includes(s));
  const starHarvest = starCrop?.harvest_days ?? null;
  const compHarvest = companionCrop?.harvest_days ?? null;
  const harvestDiff = starHarvest !== null && compHarvest !== null ? compHarvest - starHarvest : null;

  const hasSeasonData = !isStar && starSeasons.length > 0 && compSeasons.length > 0;
  const companionMissingSeason = !isStar && compSeasons.length === 0;
  const starMissingSeason = !isStar && starSeasons.length === 0 && compSeasons.length > 0;
  const noSeasonData = !isStar && starSeasons.length === 0 && compSeasons.length === 0;
  const seasonMismatch = hasSeasonData && sharedSeasons.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-2.5 p-2 rounded-lg"
      style={{
        background: `${accent}08`,
        border: `1px solid ${accent}20`,
      }}
    >
      {/* Interval badge */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}40` }}
      >
        <span style={{ color: accent }}>{style?.icon}</span>
      </div>

      {/* Labels */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono font-bold" style={{ color: accent }}>
            {interval.interval}
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
            {interval.role}
          </span>
        </div>
        <span className="text-xs font-bold truncate block" style={{ color: 'hsl(0 0% 75%)' }}>
          {interval.cropName}
        </span>

        {/* Season/Harvest alignment badges */}
        {!isStar && (
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {hasSeasonData && sharedSeasons.length > 0 && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold"
                style={{
                  background: 'hsl(120 50% 20% / 0.4)',
                  border: '1px solid hsl(120 50% 40% / 0.5)',
                  color: 'hsl(120 50% 65%)',
                }}
                title={`Shared seasons: ${sharedSeasons.join(', ')}`}
              >
                <CalendarCheck className="w-2.5 h-2.5" />
                {hardinessZone
                  ? getZoneAwarePlantingWindows(sharedSeasons, hardinessZone).map(w => w.window).join(' · ')
                  : sharedSeasons.join(', ')}
              </span>
            )}
            {seasonMismatch && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold"
                style={{
                  background: 'hsl(0 60% 20% / 0.4)',
                  border: '1px solid hsl(0 60% 40% / 0.5)',
                  color: 'hsl(0 60% 65%)',
                }}
                title="No shared planting season with Star crop"
              >
                <AlertTriangle className="w-2.5 h-2.5" />
                No season overlap
              </span>
            )}
            {companionMissingSeason && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold"
                style={{
                  background: 'hsl(40 60% 20% / 0.3)',
                  border: '1px solid hsl(40 60% 40% / 0.4)',
                  color: 'hsl(40 60% 55%)',
                }}
                title="This companion has no planting season data — pairing is unverified"
              >
                <AlertTriangle className="w-2.5 h-2.5" />
                Unverified pairing
              </span>
            )}
            {starMissingSeason && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold"
                style={{
                  background: 'hsl(40 60% 20% / 0.3)',
                  border: '1px solid hsl(40 60% 40% / 0.4)',
                  color: 'hsl(40 60% 55%)',
                }}
              >
                ⚠ Star season pending
              </span>
            )}
            {noSeasonData && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold"
                style={{
                  background: 'hsl(40 60% 20% / 0.3)',
                  border: '1px solid hsl(40 60% 40% / 0.4)',
                  color: 'hsl(40 60% 55%)',
                }}
              >
                ⚠ Season data pending
              </span>
            )}
            {/* Zone compatibility warning */}
            {hardinessZone && companionCrop && companionCrop.hardiness_zone_min != null && companionCrop.hardiness_zone_max != null && !cropFitsZone(companionCrop.hardiness_zone_min, companionCrop.hardiness_zone_max, hardinessZone) && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold"
                style={{
                  background: 'hsl(0 50% 20% / 0.4)',
                  border: '1px solid hsl(0 50% 40% / 0.5)',
                  color: 'hsl(0 50% 65%)',
                }}
                title={`Not rated for Zone ${Math.floor(hardinessZone)}`}
              >
                ❄️ Not for your zone
              </span>
            )}
            {harvestDiff !== null && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold"
                style={{
                  background: Math.abs(harvestDiff) <= 15
                    ? 'hsl(120 50% 20% / 0.3)'
                    : Math.abs(harvestDiff) <= 30
                    ? 'hsl(45 60% 20% / 0.3)'
                    : 'hsl(0 0% 20% / 0.3)',
                  border: `1px solid ${
                    Math.abs(harvestDiff) <= 15
                      ? 'hsl(120 50% 40% / 0.4)'
                      : Math.abs(harvestDiff) <= 30
                      ? 'hsl(45 60% 40% / 0.4)'
                      : 'hsl(0 0% 30% / 0.4)'
                  }`,
                  color: Math.abs(harvestDiff) <= 15
                    ? 'hsl(120 50% 60%)'
                    : Math.abs(harvestDiff) <= 30
                    ? 'hsl(45 60% 60%)'
                    : 'hsl(0 0% 50%)',
                }}
                title={`Harvest: ${compHarvest}d vs Star ${starHarvest}d`}
              >
                🌾 {harvestDiff > 0 ? '+' : ''}{harvestDiff}d vs star
              </span>
            )}
          </div>
        )}
      </div>

      {/* Emoji */}
      <span className="text-base shrink-0">{interval.emoji}</span>
    </motion.div>
  );
};

export default ChordRecipeCard;
