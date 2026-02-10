import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Layers } from 'lucide-react';
import { CHORD_RECIPES } from '@/data/chordRecipes';

/**
 * Embeddable Bed Strum cross-section for the Crop Oracle.
 * Shows vertical placement layers mapped to chord intervals.
 */

interface PlacementLayer {
  interval: string;
  spatialZone: string;
  depth: string;
  placement: string;
  spacing: string;
  yPercent: number;
  height: number;
}

const PLACEMENT_LAYERS: PlacementLayer[] = [
  { interval: '13th', spatialZone: 'AERIAL CANOPY', depth: 'Above canopy (6–10 ft)', placement: 'Trellised along edges or overhead', spacing: '36–48" on trellis', yPercent: 2, height: 12 },
  { interval: '1st',  spatialZone: 'PRIMARY CANOPY', depth: 'Full height (2–6 ft)', placement: 'Center rows — main harvest lanes', spacing: '18–24" in-row', yPercent: 16, height: 18 },
  { interval: '7th',  spatialZone: 'SIGNAL BORDER', depth: 'Mid-height (1–3 ft)', placement: 'Outer perimeter — pollinator runway', spacing: '12–18" border', yPercent: 36, height: 12 },
  { interval: '3rd',  spatialZone: 'UNDERSTORY', depth: 'Low canopy (6–18 in)', placement: 'Interplanted between main rows', spacing: '8–12" tucked', yPercent: 50, height: 12 },
  { interval: '5th',  spatialZone: 'GROUND COVER', depth: 'Ground level (0–6 in)', placement: 'Living mulch beneath canopy', spacing: 'Broadcast or 6"', yPercent: 64, height: 12 },
  { interval: '11th', spatialZone: 'SENTINEL SCATTER', depth: '6–18 in', placement: 'Every 4th position — allium shield', spacing: '1 per 4 sq ft', yPercent: 78, height: 10 },
  { interval: '9th',  spatialZone: 'SUBTERRANEAN', depth: 'Below soil (2–12 in)', placement: 'Between rows — underground layer', spacing: '6–12" offset', yPercent: 90, height: 10 },
];

const getIntervalStyle = (interval: string) => {
  switch (interval) {
    case '1st':  return { color: 'hsl(120 50% 50%)' };
    case '3rd':  return { color: 'hsl(45 80% 55%)' };
    case '5th':  return { color: 'hsl(35 70% 55%)' };
    case '7th':  return { color: 'hsl(270 50% 60%)' };
    case '9th':  return { color: 'hsl(15 60% 50%)' };
    case '11th': return { color: 'hsl(180 60% 55%)' };
    case '13th': return { color: 'hsl(90 60% 55%)' };
    default:     return { color: 'hsl(0 0% 50%)' };
  }
};

interface BedStrumEmbedProps {
  frequencyHz: number;
  zoneColor: string;
}

const BedStrumEmbed = ({ frequencyHz, zoneColor }: BedStrumEmbedProps) => {
  const [strumming, setStrumming] = useState(false);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const recipe = CHORD_RECIPES.find(r => r.frequencyHz === frequencyHz) || CHORD_RECIPES[0];

  const getRecipeCrop = (interval: string) =>
    recipe.intervals.find(iv => iv.interval === interval);

  const handleStrum = () => {
    if (strumming) return;
    setStrumming(true);
    const order = [6, 5, 4, 3, 2, 1, 0];
    order.forEach((layerIdx, i) => {
      setTimeout(() => setActiveLayer(layerIdx), i * 300);
    });
    setTimeout(() => {
      setActiveLayer(null);
      setStrumming(false);
    }, order.length * 300 + 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${zoneColor}08, hsl(0 0% 4%))`,
        border: `1px solid ${zoneColor}30`,
      }}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: zoneColor }} />
            <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: zoneColor }}>
              BED STRUM — PLACEMENT GUIDE
            </span>
          </div>
          <button
            onClick={handleStrum}
            disabled={strumming}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all"
            style={{
              background: strumming ? `${zoneColor}30` : `${zoneColor}15`,
              border: `1px solid ${zoneColor}50`,
              color: zoneColor,
              boxShadow: strumming ? `0 0 15px ${zoneColor}30` : 'none',
            }}
          >
            {strumming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="text-[9px] font-mono font-bold">
              {strumming ? 'STRUMMING...' : 'STRUM'}
            </span>
          </button>
        </div>

        {/* Chord name */}
        <div className="mb-2">
          <span className="text-xs font-bold" style={{ color: zoneColor }}>
            {recipe.chordName}
          </span>
          <span className="text-[9px] font-mono ml-2" style={{ color: 'hsl(0 0% 40%)' }}>
            {recipe.zoneName} • 60ft bed cross-section
          </span>
        </div>

        {/* Cross-section */}
        <div
          className="relative rounded-xl overflow-hidden mb-3"
          style={{
            background: 'linear-gradient(180deg, hsl(210 40% 12%) 0%, hsl(30 30% 8%) 40%, hsl(25 40% 6%) 100%)',
            border: '1px solid hsl(0 0% 12%)',
            height: '340px',
          }}
        >
          {/* Sky */}
          <div
            className="absolute top-0 left-0 right-0 h-12"
            style={{ background: 'linear-gradient(180deg, hsl(210 30% 15%) 0%, transparent 100%)' }}
          />

          {/* Soil line */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: '72%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, hsl(30 50% 30%), hsl(30 50% 30%), transparent)',
            }}
          />
          <span
            className="absolute text-[7px] font-mono"
            style={{ top: '73%', right: '6px', color: 'hsl(30 40% 40%)' }}
          >
            ── SOIL LINE ──
          </span>

          {/* Layers */}
          {PLACEMENT_LAYERS.map((layer, i) => {
            const crop = getRecipeCrop(layer.interval);
            const isActive = activeLayer === i;
            const style = getIntervalStyle(layer.interval);

            return (
              <motion.div
                key={layer.interval}
                className="absolute left-2 right-2 rounded-lg px-2 py-1.5 cursor-pointer"
                style={{
                  top: `${layer.yPercent}%`,
                  height: `${layer.height}%`,
                  background: isActive ? `${style.color}30` : `${style.color}08`,
                  border: `1px solid ${isActive ? style.color : `${style.color}25`}`,
                  boxShadow: isActive ? `0 0 15px ${style.color}40, inset 0 0 15px ${style.color}15` : 'none',
                  zIndex: isActive ? 10 : 1,
                }}
                animate={{
                  scale: isActive ? 1.02 : 1,
                  borderColor: isActive ? style.color : `${style.color}25`,
                }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.01, borderColor: `${style.color}60` }}
              >
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm shrink-0">{crop?.emoji || '🌱'}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span
                          className="text-[8px] font-mono font-bold px-1 py-0.5 rounded"
                          style={{ background: `${style.color}25`, color: style.color }}
                        >
                          {layer.interval}
                        </span>
                        <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                          {layer.spatialZone}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold block truncate" style={{ color: 'hsl(0 0% 80%)' }}>
                        {crop?.cropName || '—'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <span className="text-[7px] font-mono block" style={{ color: 'hsl(0 0% 35%)' }}>
                      {layer.depth}
                    </span>
                    <span className="text-[7px] font-mono block" style={{ color: `${style.color}80` }}>
                      {layer.placement}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Strum line */}
          <AnimatePresence>
            {strumming && activeLayer !== null && (
              <motion.div
                key={activeLayer}
                className="absolute left-0 right-0 h-0.5"
                style={{
                  top: `${PLACEMENT_LAYERS[activeLayer].yPercent + PLACEMENT_LAYERS[activeLayer].height / 2}%`,
                  background: `linear-gradient(90deg, transparent, ${zoneColor}, ${zoneColor}, transparent)`,
                  boxShadow: `0 0 15px ${zoneColor}`,
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Placement detail cards */}
        <div className="space-y-1.5">
          <span className="text-[8px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 35%)' }}>
            PLACEMENT DETAILS
          </span>
          {PLACEMENT_LAYERS.map((layer) => {
            const crop = getRecipeCrop(layer.interval);
            const style = getIntervalStyle(layer.interval);
            return (
              <div
                key={layer.interval}
                className="flex items-start gap-2 p-2 rounded-lg"
                style={{
                  background: 'hsl(0 0% 5%)',
                  border: `1px solid ${style.color}15`,
                }}
              >
                <span className="text-sm shrink-0">{crop?.emoji || '🌱'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] font-mono font-bold" style={{ color: style.color }}>
                      {layer.interval} — {layer.spatialZone}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold block" style={{ color: 'hsl(0 0% 75%)' }}>
                    {crop?.cropName || '—'}
                  </span>
                  <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 45%)' }}>
                    {layer.placement}
                  </span>
                  <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                    Spacing: {layer.spacing} • {layer.depth}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default BedStrumEmbed;
