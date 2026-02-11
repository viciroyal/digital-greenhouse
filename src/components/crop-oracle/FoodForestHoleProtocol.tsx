import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreePine, Shovel, ChevronDown, ChevronUp, Ruler, Droplets, Leaf } from 'lucide-react';

/* ─── Food Forest Layers with hole sizing + soil recipes ─── */
interface LayerProtocol {
  layer: string;
  emoji: string;
  label: string;
  holeWidth: number;   // feet
  holeDepth: number;   // feet
  backfillRatio: { native: number; amendment: number };
  soilRecipe: { ingredient: string; amount: string; purpose: string }[];
  tips: string;
  minContainerGal: number | null;
}

const LAYER_PROTOCOLS: LayerProtocol[] = [
  {
    layer: 'Canopy',
    emoji: '🌳',
    label: 'Canopy Tree (Fruit / Nut)',
    holeWidth: 3,
    holeDepth: 2,
    backfillRatio: { native: 70, amendment: 30 },
    soilRecipe: [
      { ingredient: 'Aged Compost', amount: '5 gal', purpose: 'Biological foundation' },
      { ingredient: 'Mycorrhizal Inoculant', amount: '2 tbsp', purpose: 'Root network extension — apply directly on roots' },
      { ingredient: 'Biochar (charged)', amount: '1 gal', purpose: 'Long-term carbon sponge for microbes' },
      { ingredient: 'Rock Phosphate', amount: '1 cup', purpose: 'Root establishment & fruit set' },
      { ingredient: 'Kelp Meal', amount: '½ cup', purpose: 'Growth hormones & trace minerals' },
    ],
    tips: 'Dig wide, not deep — 3× the root ball width. Score the sides of the hole to prevent glazing. Backfill with 70% native soil to encourage roots to push outward into native ground. Water deeply, mulch 4–6" out to the drip line.',
    minContainerGal: 25,
  },
  {
    layer: 'Understory',
    emoji: '🫐',
    label: 'Understory Shrub (Berry / Small Tree)',
    holeWidth: 2,
    holeDepth: 1.5,
    backfillRatio: { native: 60, amendment: 40 },
    soilRecipe: [
      { ingredient: 'Compost', amount: '3 gal', purpose: 'Biology & structure' },
      { ingredient: 'Worm Castings', amount: '1 qt', purpose: 'Microbial inoculant & gentle nutrition' },
      { ingredient: 'Mycorrhizal Inoculant', amount: '1 tbsp', purpose: 'Hyphal network connection to canopy' },
      { ingredient: 'Sulfur (for blueberries)', amount: '½ cup', purpose: 'Acidify to pH 4.5–5.5 if needed' },
      { ingredient: 'Pine Bark Mulch', amount: '2 gal', purpose: 'Slow acidification & fungal food' },
    ],
    tips: 'Understory shrubs benefit from the canopy\'s leaf litter. Plant at the drip line of canopy trees, not directly under. Blueberries need acidic soil — test pH first.',
    minContainerGal: 15,
  },
  {
    layer: 'Nitrogen Fixer',
    emoji: '🌿',
    label: 'Nitrogen Fixer (Support Species)',
    holeWidth: 1.5,
    holeDepth: 1.5,
    backfillRatio: { native: 50, amendment: 50 },
    soilRecipe: [
      { ingredient: 'Compost', amount: '2 gal', purpose: 'Kickstart biology' },
      { ingredient: 'Rhizobium Inoculant', amount: '1 tbsp', purpose: 'Ensure nodulation for N-fixation' },
      { ingredient: 'Rock Dust (Azomite)', amount: '½ cup', purpose: 'Trace minerals for robust fixation' },
    ],
    tips: 'N-fixers are the guild\'s engine — they feed the whole system. Chop-and-drop prunings as mulch to release nitrogen. Plant 1 fixer for every 2–3 productive plants.',
    minContainerGal: 10,
  },
  {
    layer: 'Pollinator',
    emoji: '🌸',
    label: 'Pollinator / Herb Layer',
    holeWidth: 1,
    holeDepth: 1,
    backfillRatio: { native: 50, amendment: 50 },
    soilRecipe: [
      { ingredient: 'Compost', amount: '1 gal', purpose: 'Light feeding — herbs prefer lean soil' },
      { ingredient: 'Sand / Perlite', amount: '1 qt', purpose: 'Drainage for Mediterranean herbs' },
      { ingredient: 'Worm Castings', amount: '1 cup', purpose: 'Gentle biology boost' },
    ],
    tips: 'Many herbs and pollinators prefer well-drained, less fertile soil. Lavender, rosemary, and thyme thrive in lean conditions. Don\'t over-amend.',
    minContainerGal: 3,
  },
  {
    layer: 'Root Layer',
    emoji: '🥕',
    label: 'Root / Tuber Layer (Subterranean)',
    holeWidth: 1,
    holeDepth: 1.5,
    backfillRatio: { native: 40, amendment: 60 },
    soilRecipe: [
      { ingredient: 'Compost', amount: '2 gal', purpose: 'Loose structure for root expansion' },
      { ingredient: 'Sand', amount: '1 gal', purpose: 'Prevent compaction around tubers' },
      { ingredient: 'Wood Ash', amount: '¼ cup', purpose: 'Potassium for tuber development' },
      { ingredient: 'Kelp Meal', amount: '¼ cup', purpose: 'Trace minerals & growth regulators' },
    ],
    tips: 'Comfrey and daikon radish are dynamic accumulators — they mine deep minerals and bring them to the surface. Plant these between trees as nutrient pumps.',
    minContainerGal: 5,
  },
  {
    layer: 'Fungal Net',
    emoji: '🍄',
    label: 'Fungal Network / Mycelial Layer',
    holeWidth: 1,
    holeDepth: 0.5,
    backfillRatio: { native: 30, amendment: 70 },
    soilRecipe: [
      { ingredient: 'Hardwood Woodchips', amount: '3 gal', purpose: 'Primary fungal food source' },
      { ingredient: 'Mushroom Spawn (King Stropharia)', amount: '1 qt', purpose: 'Establish saprophytic network' },
      { ingredient: 'Aged Leaf Mold', amount: '2 gal', purpose: 'Fungal-dominant biology' },
      { ingredient: 'Cardboard (wetted)', amount: '2–3 layers', purpose: 'Moisture retention & fungal substrate' },
    ],
    tips: 'Don\'t dig a traditional hole — create a layered bed on the surface. Woodchips → spawn → leaf mold → cardboard → more woodchips. King Stropharia connects to tree roots and breaks down mulch into humus.',
    minContainerGal: null,
  },
  {
    layer: 'Vine Layer',
    emoji: '🍇',
    label: 'Vine / Aerial Layer (Climbing)',
    holeWidth: 1.5,
    holeDepth: 1.5,
    backfillRatio: { native: 60, amendment: 40 },
    soilRecipe: [
      { ingredient: 'Compost', amount: '3 gal', purpose: 'Rich feeding for vigorous growth' },
      { ingredient: 'Mycorrhizal Inoculant', amount: '1 tbsp', purpose: 'Connect to canopy network' },
      { ingredient: 'Bone Meal', amount: '½ cup', purpose: 'Phosphorus for fruiting' },
      { ingredient: 'Calcium (Gypsum)', amount: '½ cup', purpose: 'Cell wall strength for climbing stems' },
    ],
    tips: 'Plant vines at the base of established trees or on dedicated trellises. Kiwi and grape need strong support — don\'t let them strangle young trees. Passionflower is vigorous but frost-tender below Zone 7.',
    minContainerGal: 15,
  },
];

/* ─── Custom Hole Calculator ─── */
interface HoleDimensions {
  width: number;
  depth: number;
}

function calcHoleVolumeCuFt(w: number, d: number): number {
  // Assume circular hole: π × (w/2)² × d
  return Math.PI * Math.pow(w / 2, 2) * d;
}

function calcHoleVolumeGal(w: number, d: number): number {
  return calcHoleVolumeCuFt(w, d) * 7.48; // 1 cu ft ≈ 7.48 gal
}

interface FoodForestHoleProtocolProps {
  zoneColor: string;
}

const FoodForestHoleProtocol = ({ zoneColor }: FoodForestHoleProtocolProps) => {
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [customHole, setCustomHole] = useState<HoleDimensions>({ width: 3, depth: 2 });
  const [showCalculator, setShowCalculator] = useState(false);

  const customVolume = useMemo(() => ({
    cuFt: calcHoleVolumeCuFt(customHole.width, customHole.depth),
    gal: calcHoleVolumeGal(customHole.width, customHole.depth),
  }), [customHole]);

  // Estimate backfill for a 70/30 split on the custom hole
  const customBackfill = useMemo(() => ({
    native: (customVolume.gal * 0.7).toFixed(1),
    amendment: (customVolume.gal * 0.3).toFixed(1),
  }), [customVolume]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <TreePine className="w-3.5 h-3.5" style={{ color: 'hsl(120 35% 45%)' }} />
        <span className="text-[9px] font-mono tracking-widest" style={{ color: 'hsl(120 30% 50%)' }}>
          FOOD FOREST — HOLE PROTOCOL
        </span>
      </div>

      <p className="text-[8px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 45%)' }}>
        Each layer of the food forest needs a different hole size, backfill ratio, and soil recipe. 
        Tree holes get more native soil to encourage outward root growth. Surface layers get more amendment.
      </p>

      {/* Custom Hole Calculator */}
      <button
        onClick={() => setShowCalculator(!showCalculator)}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left"
        style={{
          background: showCalculator ? `${zoneColor}10` : 'hsl(0 0% 7%)',
          border: `1px solid ${showCalculator ? `${zoneColor}30` : 'hsl(0 0% 13%)'}`,
        }}
      >
        <Ruler className="w-3 h-3" style={{ color: zoneColor }} />
        <span className="text-[9px] font-mono font-bold flex-1" style={{ color: showCalculator ? zoneColor : 'hsl(0 0% 55%)' }}>
          CUSTOM HOLE CALCULATOR
        </span>
        {showCalculator ? <ChevronUp className="w-3 h-3" style={{ color: 'hsl(0 0% 40%)' }} /> : <ChevronDown className="w-3 h-3" style={{ color: 'hsl(0 0% 40%)' }} />}
      </button>

      <AnimatePresence>
        {showCalculator && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-2.5 rounded-lg space-y-2" style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 12%)' }}>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[7px] font-mono block mb-1" style={{ color: 'hsl(0 0% 40%)' }}>HOLE WIDTH (ft)</label>
                  <input
                    type="number"
                    min={0.5}
                    max={10}
                    step={0.5}
                    value={customHole.width}
                    onChange={e => setCustomHole(prev => ({ ...prev, width: parseFloat(e.target.value) || 1 }))}
                    className="w-full px-2 py-1 rounded text-[9px] font-mono bg-transparent"
                    style={{ border: '1px solid hsl(0 0% 18%)', color: 'hsl(0 0% 65%)' }}
                  />
                </div>
                <div>
                  <label className="text-[7px] font-mono block mb-1" style={{ color: 'hsl(0 0% 40%)' }}>HOLE DEPTH (ft)</label>
                  <input
                    type="number"
                    min={0.5}
                    max={6}
                    step={0.5}
                    value={customHole.depth}
                    onChange={e => setCustomHole(prev => ({ ...prev, depth: parseFloat(e.target.value) || 1 }))}
                    className="w-full px-2 py-1 rounded text-[9px] font-mono bg-transparent"
                    style={{ border: '1px solid hsl(0 0% 18%)', color: 'hsl(0 0% 65%)' }}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-1.5 rounded" style={{ background: 'hsl(0 0% 8%)' }}>
                  <span className="text-[7px] font-mono block" style={{ color: 'hsl(0 0% 40%)' }}>VOLUME</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: zoneColor }}>{customVolume.cuFt.toFixed(1)} ft³</span>
                </div>
                <div className="p-1.5 rounded" style={{ background: 'hsl(0 0% 8%)' }}>
                  <span className="text-[7px] font-mono block" style={{ color: 'hsl(0 0% 40%)' }}>≈ GALLONS</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: zoneColor }}>{customVolume.gal.toFixed(1)} gal</span>
                </div>
                <div className="p-1.5 rounded" style={{ background: 'hsl(0 0% 8%)' }}>
                  <span className="text-[7px] font-mono block" style={{ color: 'hsl(0 0% 40%)' }}>BACKFILL (70/30)</span>
                  <span className="text-[9px] font-mono" style={{ color: 'hsl(45 50% 55%)' }}>
                    {customBackfill.native}g native · {customBackfill.amendment}g amend
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer-by-layer protocols */}
      <div className="space-y-1">
        {LAYER_PROTOCOLS.map(layer => {
          const isExpanded = expandedLayer === layer.layer;
          const vol = calcHoleVolumeGal(layer.holeWidth, layer.holeDepth);

          return (
            <div key={layer.layer}>
              <button
                onClick={() => setExpandedLayer(isExpanded ? null : layer.layer)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all"
                style={{
                  background: isExpanded ? `${zoneColor}08` : 'hsl(0 0% 7%)',
                  border: `1px solid ${isExpanded ? `${zoneColor}30` : 'hsl(0 0% 13%)'}`,
                }}
              >
                <span className="text-base shrink-0">{layer.emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-mono font-bold block" style={{ color: isExpanded ? zoneColor : 'hsl(0 0% 55%)' }}>
                    {layer.label}
                  </span>
                  <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                    {layer.holeWidth}ft × {layer.holeDepth}ft deep · {layer.backfillRatio.native}/{layer.backfillRatio.amendment} backfill
                    {layer.minContainerGal && ` · Min pot: ${layer.minContainerGal} gal`}
                  </span>
                </div>
                {isExpanded ? <ChevronUp className="w-3 h-3 shrink-0" style={{ color: 'hsl(0 0% 40%)' }} /> : <ChevronDown className="w-3 h-3 shrink-0" style={{ color: 'hsl(0 0% 40%)' }} />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-1 mb-1 p-2.5 rounded-lg space-y-2" style={{ background: 'hsl(0 0% 5%)', border: '1px solid hsl(0 0% 11%)' }}>
                      {/* Hole stats */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Shovel className="w-2.5 h-2.5" style={{ color: 'hsl(30 50% 50%)' }} />
                          <span className="text-[8px] font-mono" style={{ color: 'hsl(30 45% 55%)' }}>
                            Hole: {layer.holeWidth}′W × {layer.holeDepth}′D = {vol.toFixed(1)} gal
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="w-2.5 h-2.5" style={{ color: 'hsl(200 50% 50%)' }} />
                          <span className="text-[8px] font-mono" style={{ color: 'hsl(200 40% 55%)' }}>
                            {layer.backfillRatio.native}% native soil · {layer.backfillRatio.amendment}% amendment
                          </span>
                        </div>
                        {layer.minContainerGal && (
                          <div className="flex items-center gap-1">
                            <Leaf className="w-2.5 h-2.5" style={{ color: 'hsl(120 35% 50%)' }} />
                            <span className="text-[8px] font-mono" style={{ color: 'hsl(120 30% 55%)' }}>
                              Min container: {layer.minContainerGal} gal
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Soil recipe table */}
                      <div>
                        <span className="text-[7px] font-mono tracking-wider block mb-1" style={{ color: 'hsl(0 0% 35%)' }}>
                          AMENDMENT RECIPE
                        </span>
                        <div className="space-y-0.5">
                          {layer.soilRecipe.map((r, i) => (
                            <div key={i} className="flex items-start gap-2 px-2 py-1 rounded" style={{ background: i % 2 === 0 ? 'hsl(0 0% 7%)' : 'transparent' }}>
                              <span className="text-[8px] font-mono font-bold shrink-0 w-20" style={{ color: 'hsl(45 50% 55%)' }}>
                                {r.amount}
                              </span>
                              <span className="text-[8px] font-mono font-bold shrink-0 w-36" style={{ color: 'hsl(0 0% 55%)' }}>
                                {r.ingredient}
                              </span>
                              <span className="text-[7px] font-mono flex-1" style={{ color: 'hsl(0 0% 40%)' }}>
                                {r.purpose}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Planting tip */}
                      <div className="p-2 rounded" style={{ background: 'hsl(120 20% 8%)', border: '1px solid hsl(120 15% 15%)' }}>
                        <span className="text-[8px] font-mono leading-relaxed" style={{ color: 'hsl(120 25% 50%)' }}>
                          🌱 {layer.tips}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Backfill philosophy note */}
      <div className="p-2.5 rounded-lg" style={{ background: 'hsl(30 20% 7%)', border: '1px solid hsl(30 15% 15%)' }}>
        <span className="text-[7px] font-mono tracking-wider block mb-1" style={{ color: 'hsl(30 45% 50%)' }}>
          WHY BACKFILL RATIOS MATTER
        </span>
        <p className="text-[8px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 45%)' }}>
          Trees planted in 100% amended soil often develop "container syndrome" — roots circle within the rich pocket and never reach native ground. 
          Using 60–70% native soil forces roots outward, building long-term resilience. Amendments go in the top 6 inches where biology is most active.
          Think of it as <span style={{ color: 'hsl(45 50% 55%)' }}>tuning the landing zone</span>, not replacing the soil.
        </p>
      </div>
    </div>
  );
};

export default FoodForestHoleProtocol;
