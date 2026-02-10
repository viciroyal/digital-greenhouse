import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, ArrowLeft, Play, Pause } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CHORD_RECIPES, ChordRecipe } from '@/data/chordRecipes';

/**
 * Physical placement layers — maps chord intervals to vertical zones in the bed.
 * Think of "strumming" from underground → ground → canopy → aerial.
 */
interface PlacementLayer {
  interval: string;
  spatialZone: string;
  depth: string;        // description of vertical position
  placement: string;    // where in the bed (center, edge, border, etc.)
  spacing: string;      // rough spacing guidance
  yPercent: number;     // vertical position in the cross-section (0=top, 100=bottom)
  height: number;       // layer thickness in the visual
}

const PLACEMENT_LAYERS: PlacementLayer[] = [
  {
    interval: '13th',
    spatialZone: 'AERIAL CANOPY',
    depth: 'Above canopy (6–10 ft)',
    placement: 'Trellised along edges or overhead structure',
    spacing: '36–48" apart on trellis',
    yPercent: 2,
    height: 12,
  },
  {
    interval: '1st',
    spatialZone: 'PRIMARY CANOPY',
    depth: 'Full height (2–6 ft)',
    placement: 'Center rows — main harvest lanes',
    spacing: '18–24" in-row, 30" between rows',
    yPercent: 16,
    height: 18,
  },
  {
    interval: '7th',
    spatialZone: 'SIGNAL BORDER',
    depth: 'Mid-height (1–3 ft)',
    placement: 'Outer perimeter of bed — pollinator runway',
    spacing: '12–18" continuous border',
    yPercent: 36,
    height: 12,
  },
  {
    interval: '3rd',
    spatialZone: 'UNDERSTORY',
    depth: 'Low canopy (6–18 in)',
    placement: 'Interplanted between main rows',
    spacing: '8–12" tucked between leads',
    yPercent: 50,
    height: 12,
  },
  {
    interval: '5th',
    spatialZone: 'GROUND COVER',
    depth: 'Ground level (0–6 in)',
    placement: 'Living mulch beneath canopy',
    spacing: 'Broadcast or 6" scatter',
    yPercent: 64,
    height: 12,
  },
  {
    interval: '11th',
    spatialZone: 'SENTINEL SCATTER',
    depth: 'Ground to mid (6–18 in)',
    placement: 'Scattered every 4th position — allium shield',
    spacing: '1 per 4 sq ft, random scatter',
    yPercent: 78,
    height: 10,
  },
  {
    interval: '9th',
    spatialZone: 'SUBTERRANEAN',
    depth: 'Below soil (2–12 in deep)',
    placement: 'Between main rows — underground layer',
    spacing: '6–12" in-row, offset from leads',
    yPercent: 90,
    height: 10,
  },
];

interface BedStrumVisualizerProps {
  recipe?: ChordRecipe;
}

const BedStrumVisualizer = ({ recipe: propRecipe }: BedStrumVisualizerProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedZone, setSelectedZone] = useState(0);
  const [strumming, setStrumming] = useState(false);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  // Support ?freq=528 URL param to pre-select zone
  useEffect(() => {
    const freq = searchParams.get('freq');
    if (freq) {
      const idx = CHORD_RECIPES.findIndex(r => r.frequencyHz === parseInt(freq));
      if (idx >= 0) setSelectedZone(idx);
    }
  }, [searchParams]);

  const recipe = propRecipe || CHORD_RECIPES[selectedZone];
  const zoneColor = recipe.zoneColor;

  // Map interval name to recipe crop
  const getRecipeCrop = (interval: string) => {
    return recipe.intervals.find(iv => iv.interval === interval);
  };

  // Strum animation — light up layers sequentially from bottom to top
  const handleStrum = () => {
    if (strumming) return;
    setStrumming(true);

    const order = [6, 5, 4, 3, 2, 1, 0]; // bottom to top (9th → 13th)
    order.forEach((layerIdx, i) => {
      setTimeout(() => setActiveLayer(layerIdx), i * 300);
    });
    setTimeout(() => {
      setActiveLayer(null);
      setStrumming(false);
    }, order.length * 300 + 600);
  };

  return (
    <div className="min-h-screen" style={{ background: 'hsl(0 0% 3%)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'hsl(0 0% 3% / 0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid hsl(0 0% 10%)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 15%)' }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: 'hsl(0 0% 50%)' }} />
        </button>
        <Music className="w-5 h-5" style={{ color: 'hsl(45 80% 55%)' }} />
        <h1 className="text-sm font-mono font-bold tracking-wider" style={{ color: 'hsl(45 80% 55%)' }}>
          BED STRUM — PLACEMENT GUIDE
        </h1>
      </div>

      {/* Zone Selector */}
      {!propRecipe && (
        <div className="px-4 pt-4 flex gap-2 overflow-x-auto pb-2">
          {CHORD_RECIPES.map((r, i) => (
            <button
              key={r.frequencyHz}
              onClick={() => setSelectedZone(i)}
              className="shrink-0 px-3 py-2 rounded-xl text-[10px] font-mono font-bold transition-all"
              style={{
                background: selectedZone === i ? `${r.zoneColor}25` : 'hsl(0 0% 6%)',
                border: `1px solid ${selectedZone === i ? r.zoneColor : 'hsl(0 0% 12%)'}`,
                color: selectedZone === i ? r.zoneColor : 'hsl(0 0% 40%)',
                boxShadow: selectedZone === i ? `0 0 12px ${r.zoneColor}30` : 'none',
              }}
            >
              {r.frequencyHz}Hz
            </button>
          ))}
        </div>
      )}

      {/* Chord Name */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold" style={{ color: zoneColor }}>
            {recipe.chordName}
          </h2>
          <p className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
            {recipe.zoneName} Zone • 60-foot bed cross-section
          </p>
        </div>
        <button
          onClick={handleStrum}
          disabled={strumming}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all"
          style={{
            background: strumming ? `${zoneColor}30` : `${zoneColor}15`,
            border: `1px solid ${zoneColor}50`,
            color: zoneColor,
            boxShadow: strumming ? `0 0 20px ${zoneColor}40` : 'none',
          }}
        >
          {strumming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-mono font-bold">
            {strumming ? 'STRUMMING...' : 'STRUM'}
          </span>
        </button>
      </div>

      {/* Cross-Section Visualization */}
      <div className="px-4 pt-2 pb-4">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, hsl(210 40% 12%) 0%, hsl(30 30% 8%) 40%, hsl(25 40% 6%) 100%)',
            border: '1px solid hsl(0 0% 12%)',
            height: '480px',
          }}
        >
          {/* Sky gradient at top */}
          <div
            className="absolute top-0 left-0 right-0 h-16"
            style={{
              background: 'linear-gradient(180deg, hsl(210 30% 15%) 0%, transparent 100%)',
            }}
          />

          {/* Soil line */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: '72%',
              height: '2px',
              background: `linear-gradient(90deg, transparent, hsl(30 50% 30%), hsl(30 50% 30%), transparent)`,
            }}
          />
          <span
            className="absolute text-[8px] font-mono"
            style={{ top: '73%', right: '8px', color: 'hsl(30 40% 40%)' }}
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
                className="absolute left-3 right-3 rounded-xl px-3 py-2 cursor-pointer"
                style={{
                  top: `${layer.yPercent}%`,
                  height: `${layer.height}%`,
                  background: isActive
                    ? `${style.color}30`
                    : `${style.color}08`,
                  border: `1px solid ${isActive ? style.color : `${style.color}25`}`,
                  boxShadow: isActive ? `0 0 20px ${style.color}40, inset 0 0 20px ${style.color}15` : 'none',
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
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{crop?.emoji || '🌱'}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                          style={{ background: `${style.color}25`, color: style.color }}
                        >
                          {layer.interval}
                        </span>
                        <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                          {layer.spatialZone}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold block truncate" style={{ color: 'hsl(0 0% 80%)' }}>
                        {crop?.cropName || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 hidden sm:block">
                    <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 35%)' }}>
                      {layer.depth}
                    </span>
                    <span className="text-[8px] font-mono block" style={{ color: `${style.color}80` }}>
                      {layer.placement}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Strum line animation */}
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
      </div>

      {/* Placement Detail Cards */}
      <div className="px-4 pb-8 space-y-2">
        <h3 className="text-[10px] font-mono font-bold tracking-wider px-1" style={{ color: 'hsl(0 0% 40%)' }}>
          PLACEMENT DETAILS
        </h3>
        {PLACEMENT_LAYERS.map((layer) => {
          const crop = getRecipeCrop(layer.interval);
          const style = getIntervalStyle(layer.interval);
          return (
            <div
              key={layer.interval}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: 'hsl(0 0% 5%)',
                border: `1px solid ${style.color}20`,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${style.color}15`, border: `1px solid ${style.color}40` }}
              >
                <span className="text-sm">{crop?.emoji || '🌱'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-mono font-bold" style={{ color: style.color }}>
                    {layer.interval} — {layer.spatialZone}
                  </span>
                </div>
                <span className="text-xs font-bold block" style={{ color: 'hsl(0 0% 75%)' }}>
                  {crop?.cropName || '—'}
                </span>
                <span className="text-[9px] font-mono block mt-0.5" style={{ color: 'hsl(0 0% 45%)' }}>
                  {layer.placement}
                </span>
                <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                  Spacing: {layer.spacing} • Depth: {layer.depth}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Helpers ─── */
const getIntervalStyle = (interval: string): { color: string } => {
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

export default BedStrumVisualizer;
