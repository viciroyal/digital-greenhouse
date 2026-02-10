import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Music, Leaf, Sparkles, Pickaxe, Zap, Link2, Layers } from 'lucide-react';
import { CHORD_RECIPES, type ChordRecipe } from '@/data/chordRecipes';

/* ─── Constants ─── */
const TOTAL_SLOTS = 50;
const PAGE_SIZE = 5;
const TOTAL_PAGES = Math.ceil(TOTAL_SLOTS / PAGE_SIZE); // 10

const ZONE_COLORS: Record<number, string> = {
  396: '#FF0000', 417: '#FF7F00', 528: '#FFFF00',
  639: '#00FF00', 741: '#0000FF', 852: '#4B0082', 963: '#8B00FF',
};

const NOTE_MAP: Record<number, string> = {
  396: 'C', 417: 'D', 528: 'E', 639: 'F', 741: 'G', 852: 'A', 963: 'B',
};

const FREQUENCIES = [396, 417, 528, 639, 741, 852, 963];

const INTERVAL_ICONS: Record<string, React.ReactNode> = {
  '1st':  <Leaf className="w-3 h-3" />,
  '3rd':  <Sparkles className="w-3 h-3" />,
  '5th':  <Pickaxe className="w-3 h-3" />,
  '7th':  <Zap className="w-3 h-3" />,
  '9th':  <Layers className="w-3 h-3" />,
  '11th': <Music className="w-3 h-3" />,
  '13th': <Link2 className="w-3 h-3" />,
};

/* ─── Build 50 slots from chord recipes ─── */
interface ChordSlot {
  index: number;
  recipe: ChordRecipe | null;
  frequencyHz: number;
  zoneColor: string;
  zoneName: string;
  label: string;
}

function buildSlots(): ChordSlot[] {
  const slots: ChordSlot[] = [];
  // Distribute recipes across slots, cycling through frequencies
  const recipesByFreq: Record<number, ChordRecipe[]> = {};
  for (const r of CHORD_RECIPES) {
    if (!recipesByFreq[r.frequencyHz]) recipesByFreq[r.frequencyHz] = [];
    recipesByFreq[r.frequencyHz].push(r);
  }

  // Fill 50 slots: 7 zones × ~7 slots each + 1 extra
  let slotIdx = 0;
  // First pass: assign real recipes
  for (const freq of FREQUENCIES) {
    const recipes = recipesByFreq[freq] || [];
    for (const recipe of recipes) {
      if (slotIdx >= TOTAL_SLOTS) break;
      slots.push({
        index: slotIdx,
        recipe,
        frequencyHz: freq,
        zoneColor: ZONE_COLORS[freq] || '#888',
        zoneName: recipe.zoneName,
        label: recipe.chordName,
      });
      slotIdx++;
    }
  }
  // Fill remaining with empty expansion slots
  while (slotIdx < TOTAL_SLOTS) {
    const freqIdx = slotIdx % FREQUENCIES.length;
    const freq = FREQUENCIES[freqIdx];
    slots.push({
      index: slotIdx,
      recipe: null,
      frequencyHz: freq,
      zoneColor: ZONE_COLORS[freq] || '#888',
      zoneName: `Zone ${freqIdx + 1}`,
      label: `Slot ${slotIdx + 1}`,
    });
    slotIdx++;
  }
  return slots;
}

/* ─── Resonance score between two chord slots ─── */
function getResonanceScore(a: ChordSlot, b: ChordSlot): number {
  if (!a.recipe || !b.recipe) return 0;
  // Check shared crop names across intervals
  const aCrops = new Set(a.recipe.intervals.map(i => i.cropName.toLowerCase()));
  const bCrops = new Set(b.recipe.intervals.map(i => i.cropName.toLowerCase()));
  let shared = 0;
  for (const c of aCrops) if (bCrops.has(c)) shared++;
  // Frequency proximity bonus
  const freqDist = Math.abs(a.frequencyHz - b.frequencyHz);
  const proximityBonus = freqDist <= 150 ? 0.3 : freqDist <= 300 ? 0.15 : 0;
  // Complementary interval coverage
  const aIntervals = new Set(a.recipe.intervals.map(i => i.interval));
  const bIntervals = new Set(b.recipe.intervals.map(i => i.interval));
  const coverage = new Set([...aIntervals, ...bIntervals]).size;
  const coverageBonus = coverage >= 6 ? 0.2 : 0;
  return Math.min(1, shared * 0.15 + proximityBonus + coverageBonus);
}

function resonanceToColor(score: number): string {
  if (score >= 0.5) return 'hsl(120 60% 40%)';
  if (score >= 0.3) return 'hsl(60 70% 45%)';
  if (score > 0) return 'hsl(30 60% 40%)';
  return 'hsl(0 0% 15%)';
}

/* ─── Component ─── */
const HarmonicCarousel = () => {
  const [page, setPage] = useState(0);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allSlots = useMemo(() => buildSlots(), []);
  const pageSlots = useMemo(() => allSlots.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), [allSlots, page]);

  // Adjacent page slots for cross-row dependency
  const prevPageSlots = useMemo(() => page > 0 ? allSlots.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [], [allSlots, page]);
  const nextPageSlots = useMemo(() => page < TOTAL_PAGES - 1 ? allSlots.slice((page + 1) * PAGE_SIZE, (page + 2) * PAGE_SIZE) : [], [allSlots, page]);

  // Resonance heatmap: pairwise scores within current page
  const resonanceMatrix = useMemo(() => {
    const matrix: number[][] = [];
    for (let i = 0; i < pageSlots.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < pageSlots.length; j++) {
        matrix[i][j] = i === j ? 1 : getResonanceScore(pageSlots[i], pageSlots[j]);
      }
    }
    return matrix;
  }, [pageSlots]);

  // Cross-row dependencies (shared crops between current and adjacent pages)
  const crossDeps = useMemo(() => {
    const deps: { from: number; to: number; direction: 'prev' | 'next'; cropName: string }[] = [];
    for (let i = 0; i < pageSlots.length; i++) {
      if (!pageSlots[i].recipe) continue;
      const crops = pageSlots[i].recipe!.intervals.map(iv => iv.cropName.toLowerCase());
      // Check adjacent pages
      for (const [adjSlots, dir] of [[prevPageSlots, 'prev'], [nextPageSlots, 'next']] as const) {
        for (let j = 0; j < adjSlots.length; j++) {
          if (!adjSlots[j].recipe) continue;
          for (const iv of adjSlots[j].recipe!.intervals) {
            if (crops.includes(iv.cropName.toLowerCase())) {
              deps.push({ from: i, to: j, direction: dir, cropName: iv.cropName });
              break;
            }
          }
        }
      }
    }
    return deps;
  }, [pageSlots, prevPageSlots, nextPageSlots]);

  const goPage = (dir: -1 | 1) => {
    setPage(p => Math.max(0, Math.min(TOTAL_PAGES - 1, p + dir)));
  };

  return (
    <div className="mx-4 mb-4 rounded-2xl overflow-hidden" style={{
      background: 'hsl(0 0% 4%)',
      border: '1px solid hsl(0 0% 12%)',
    }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid hsl(0 0% 10%)' }}>
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4" style={{ color: 'hsl(270 50% 60%)' }} />
          <span className="text-[10px] font-mono font-bold tracking-widest" style={{ color: 'hsl(270 50% 60%)' }}>
            HARMONIC MATRIX
          </span>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'hsl(0 0% 10%)', color: 'hsl(0 0% 45%)' }}>
            {TOTAL_SLOTS} CHORDS
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => goPage(-1)}
            disabled={page === 0}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity"
            style={{
              background: 'hsl(0 0% 8%)',
              border: '1px solid hsl(0 0% 15%)',
              opacity: page === 0 ? 0.3 : 1,
            }}
          >
            <ChevronLeft className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 60%)' }} />
          </button>
          <span className="text-[9px] font-mono w-14 text-center" style={{ color: 'hsl(0 0% 50%)' }}>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, TOTAL_SLOTS)} / {TOTAL_SLOTS}
          </span>
          <button
            onClick={() => goPage(1)}
            disabled={page === TOTAL_PAGES - 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity"
            style={{
              background: 'hsl(0 0% 8%)',
              border: '1px solid hsl(0 0% 15%)',
              opacity: page === TOTAL_PAGES - 1 ? 0.3 : 1,
            }}
          >
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 60%)' }} />
          </button>
        </div>
      </div>

      {/* Zone band indicator */}
      <div className="flex h-1.5">
        {pageSlots.map((slot, i) => (
          <div key={i} className="flex-1" style={{ background: slot.zoneColor, opacity: 0.7 }} />
        ))}
      </div>

      {/* Chord Cards Row */}
      <div ref={containerRef} className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-5 gap-2 p-3"
          >
            {pageSlots.map((slot, i) => {
              const isHovered = hoveredSlot === i;
              const recipe = slot.recipe;
              return (
                <motion.div
                  key={slot.index}
                  onMouseEnter={() => setHoveredSlot(i)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  className="rounded-xl p-2.5 cursor-pointer transition-all relative overflow-hidden"
                  style={{
                    background: isHovered ? `${slot.zoneColor}15` : 'hsl(0 0% 6%)',
                    border: `1px solid ${isHovered ? slot.zoneColor + '50' : 'hsl(0 0% 10%)'}`,
                    boxShadow: isHovered ? `0 0 20px ${slot.zoneColor}15` : 'none',
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Zone dot + number */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: slot.zoneColor, boxShadow: `0 0 6px ${slot.zoneColor}80` }} />
                    <span className="text-[8px] font-mono font-bold" style={{ color: slot.zoneColor }}>
                      {NOTE_MAP[slot.frequencyHz] || '?'}/{slot.frequencyHz}Hz
                    </span>
                  </div>

                  {/* Chord name */}
                  <span className="text-[9px] font-mono font-bold block mb-2 leading-tight truncate" style={{ color: 'hsl(0 0% 75%)' }}>
                    {slot.label}
                  </span>

                  {/* Intervals */}
                  {recipe ? (
                    <div className="space-y-1">
                      {recipe.intervals.map(iv => (
                        <div key={iv.interval} className="flex items-center gap-1">
                          <span className="text-[8px]">{iv.emoji}</span>
                          <span className="text-[7px] font-mono truncate" style={{ color: 'hsl(0 0% 50%)' }}>
                            {iv.cropName}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-4">
                      <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 25%)' }}>EMPTY SLOT</span>
                    </div>
                  )}

                  {/* Slot number badge */}
                  <div className="absolute top-1.5 right-1.5">
                    <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{ background: 'hsl(0 0% 10%)', color: 'hsl(0 0% 35%)' }}>
                      #{slot.index + 1}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Cross-row dependency indicators */}
        {crossDeps.length > 0 && (
          <div className="px-3 pb-2">
            <div className="flex flex-wrap gap-1">
              {crossDeps.slice(0, 4).map((dep, i) => (
                <span key={i} className="text-[7px] font-mono px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{
                  background: 'hsl(270 30% 15%)',
                  border: '1px solid hsl(270 30% 25%)',
                  color: 'hsl(270 50% 65%)',
                }}>
                  <Link2 className="w-2.5 h-2.5" />
                  {dep.cropName} → {dep.direction === 'prev' ? '◀' : '▶'} Row {dep.direction === 'prev' ? page : page + 2}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resonance Heatmap */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Layers className="w-3 h-3" style={{ color: 'hsl(45 70% 55%)' }} />
          <span className="text-[8px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 40%)' }}>
            ROW RESONANCE
          </span>
        </div>

        {/* Heatmap grid */}
        <div className="grid grid-cols-5 gap-1">
          {resonanceMatrix.map((row, i) =>
            row.map((score, j) => {
              if (j <= i) {
                // Lower triangle + diagonal
                const isself = i === j;
                return (
                  <div
                    key={`${i}-${j}`}
                    className="rounded-md flex items-center justify-center aspect-square"
                    style={{
                      background: isself ? `${pageSlots[i]?.zoneColor || '#888'}20` : resonanceToColor(score),
                      border: `1px solid ${isself ? pageSlots[i]?.zoneColor + '40' : 'hsl(0 0% 10%)'}`,
                    }}
                  >
                    <span className="text-[7px] font-mono font-bold" style={{
                      color: isself ? (pageSlots[i]?.zoneColor || '#888') : 'hsl(0 0% 70%)',
                    }}>
                      {isself ? (NOTE_MAP[pageSlots[i]?.frequencyHz] || '?') : (score > 0 ? `${Math.round(score * 100)}%` : '—')}
                    </span>
                  </div>
                );
              }
              // Upper triangle: mirror
              const mirrorScore = resonanceMatrix[j]?.[i] ?? 0;
              return (
                <div
                  key={`${i}-${j}`}
                  className="rounded-md flex items-center justify-center aspect-square"
                  style={{
                    background: `${resonanceToColor(mirrorScore)}`,
                    border: '1px solid hsl(0 0% 8%)',
                    opacity: 0.5,
                  }}
                />
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-2">
          {[
            { label: 'HIGH', color: 'hsl(120 60% 40%)' },
            { label: 'MED', color: 'hsl(60 70% 45%)' },
            { label: 'LOW', color: 'hsl(30 60% 40%)' },
            { label: 'NONE', color: 'hsl(0 0% 15%)' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
              <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Page dots */}
      <div className="flex items-center justify-center gap-1.5 pb-3">
        {Array.from({ length: TOTAL_PAGES }).map((_, i) => {
          // Color based on dominant zone in that page
          const pageStart = i * PAGE_SIZE;
          const dominantSlot = allSlots[pageStart];
          const dotColor = dominantSlot?.zoneColor || '#888';
          return (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="rounded-full transition-all"
              style={{
                width: page === i ? 16 : 6,
                height: 6,
                background: page === i ? dotColor : 'hsl(0 0% 15%)',
                boxShadow: page === i ? `0 0 8px ${dotColor}60` : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HarmonicCarousel;
