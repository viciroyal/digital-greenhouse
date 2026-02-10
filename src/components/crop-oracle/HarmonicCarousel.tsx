import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Music, Radio } from 'lucide-react';
import { CHORD_RECIPES, type ChordRecipe } from '@/data/chordRecipes';
import { CSA_PHASES, getCurrentPhase } from '@/components/master-build/SeasonalMovements';

/* ─── Constants ─── */
const PAGE_SIZE = 5;

const NOTE_MAP: Record<number, string> = {
  396: 'C', 417: 'D', 528: 'E', 639: 'F', 741: 'G', 852: 'A', 963: 'B',
};

const FREQ_TO_ZONE: Record<number, number> = {
  396: 1, 417: 2, 528: 3, 639: 4, 741: 5, 852: 6, 963: 7,
};

/* ─── Row Resonance between two recipes ─── */
function getRowResonance(a: ChordRecipe, b: ChordRecipe): number {
  let score = 0;

  if (a.frequencyHz === b.frequencyHz) {
    score += 0.4;
  } else {
    const dist = Math.abs(a.frequencyHz - b.frequencyHz);
    if (dist <= 150) score += 0.25;
    else if (dist <= 300) score += 0.1;
  }

  const aCrops = new Set(a.intervals.map(i => i.cropName));
  const bCrops = new Set(b.intervals.map(i => i.cropName));
  let shared = 0;
  for (const c of aCrops) if (bCrops.has(c)) shared++;
  score += shared * 0.15;

  if (a.intervals.length === 7 && b.intervals.length === 7) {
    score += 0.1;
  }

  const aRoles = new Set(a.intervals.map(i => i.role));
  const bRoles = new Set(b.intervals.map(i => i.role));
  const combined = new Set([...aRoles, ...bRoles]);
  if (combined.size >= 5) score += 0.15;

  return Math.min(1, score);
}

function resonanceToStyle(score: number): { bg: string; border: string } {
  if (score >= 0.5) return { bg: 'hsl(120 25% 12%)', border: 'hsl(120 30% 25%)' };
  if (score >= 0.3) return { bg: 'hsl(45 20% 10%)', border: 'hsl(45 25% 22%)' };
  if (score > 0)    return { bg: 'hsl(30 15% 8%)', border: 'hsl(30 15% 16%)' };
  return { bg: 'hsl(0 0% 5%)', border: 'hsl(0 0% 9%)' };
}

/* ─── Component ─── */
const HarmonicCarousel = () => {
  const [page, setPage] = useState(0);
  const [resonanceDepth, setResonanceDepth] = useState(1);
  const [filterSeason, setFilterSeason] = useState(true);

  const activePhase = getCurrentPhase();

  // Sort recipes: in-season first, then the rest
  const sortedRecipes = useMemo(() => {
    if (!filterSeason || !activePhase) return CHORD_RECIPES;

    const inSeason: ChordRecipe[] = [];
    const outSeason: ChordRecipe[] = [];

    for (const recipe of CHORD_RECIPES) {
      const zone = FREQ_TO_ZONE[recipe.frequencyHz];
      if (zone && activePhase.zones.includes(zone)) {
        inSeason.push(recipe);
      } else {
        outSeason.push(recipe);
      }
    }

    return [...inSeason, ...outSeason];
  }, [filterSeason, activePhase]);

  const totalPages = Math.ceil(sortedRecipes.length / PAGE_SIZE);
  const pageRecipes = useMemo(() => sortedRecipes.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), [sortedRecipes, page]);

  // Cross-page shared crops
  const prevRecipes = useMemo(() => page > 0 ? sortedRecipes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [], [sortedRecipes, page]);
  const nextRecipes = useMemo(() => page < totalPages - 1 ? sortedRecipes.slice((page + 1) * PAGE_SIZE, (page + 2) * PAGE_SIZE) : [], [sortedRecipes, page, totalPages]);

  const crossDeps = useMemo(() => {
    const deps: { fromChord: string; dir: 'prev' | 'next'; cropName: string }[] = [];
    for (const recipe of pageRecipes) {
      const cropNames = new Set(recipe.intervals.map(i => i.cropName));
      for (const [adjRecipes, dir] of [[prevRecipes, 'prev'], [nextRecipes, 'next']] as const) {
        for (const adj of adjRecipes) {
          for (const iv of adj.intervals) {
            if (cropNames.has(iv.cropName)) {
              deps.push({ fromChord: recipe.chordName, dir, cropName: iv.cropName });
              break;
            }
          }
        }
      }
    }
    return deps.slice(0, 3);
  }, [pageRecipes, prevRecipes, nextRecipes]);

  // Resonance matrix for current page
  const matrix = useMemo(() => {
    return pageRecipes.map((a, i) =>
      pageRecipes.map((b, j) => i === j ? 1 : getRowResonance(a, b))
    );
  }, [pageRecipes]);

  const goPage = (dir: -1 | 1) => setPage(p => Math.max(0, Math.min(totalPages - 1, p + dir)));

  // Check if a recipe is in the active season
  const isInSeason = (recipe: ChordRecipe): boolean => {
    if (!activePhase) return false;
    const zone = FREQ_TO_ZONE[recipe.frequencyHz];
    return zone ? activePhase.zones.includes(zone) : false;
  };

  return (
    <div className="mx-4 mb-4 rounded-2xl overflow-hidden" style={{
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(20px)',
      border: '1px solid hsl(0 0% 12%)',
    }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Music className="w-4 h-4" style={{ color: 'hsl(45 80% 55%)' }} />
          <span className="text-[10px] font-mono font-bold tracking-[0.2em]" style={{ color: 'hsl(45 80% 55%)' }}>
            HARMONIC MATRIX
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
            {sortedRecipes.length} chords
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => goPage(-1)} disabled={page === 0}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity"
            style={{ background: 'hsl(0 0% 8%)', opacity: page === 0 ? 0.3 : 0.7 }}>
            <ChevronLeft className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 60%)' }} />
          </button>
          <span className="text-[9px] font-mono tabular-nums w-14 text-center" style={{ color: 'hsl(0 0% 40%)' }}>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sortedRecipes.length)}
          </span>
          <button onClick={() => goPage(1)} disabled={page === totalPages - 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity"
            style={{ background: 'hsl(0 0% 8%)', opacity: page === totalPages - 1 ? 0.3 : 0.7 }}>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 60%)' }} />
          </button>
        </div>
      </div>

      {/* Seasonal Phase Banner */}
      {activePhase && (
        <div className="mx-4 mb-2 rounded-lg px-3 py-2 flex items-center justify-between"
          style={{
            background: activePhase.gradient,
            border: `1px solid ${activePhase.borderColor}40`,
          }}
        >
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5" style={{ color: activePhase.borderColor }} />
            <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: activePhase.borderColor }}>
              {activePhase.name}
            </span>
            <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
              {activePhase.dateRange} • {activePhase.frequencyRange}
            </span>
          </div>
          <button
            onClick={() => { setFilterSeason(f => !f); setPage(0); }}
            className="text-[8px] font-mono px-2 py-0.5 rounded-full transition-all"
            style={{
              background: filterSeason ? `${activePhase.borderColor}20` : 'hsl(0 0% 8%)',
              border: `1px solid ${filterSeason ? activePhase.borderColor + '50' : 'hsl(0 0% 15%)'}`,
              color: filterSeason ? activePhase.borderColor : 'hsl(0 0% 40%)',
            }}
          >
            {filterSeason ? '● IN SEASON' : '○ ALL'}
          </button>
        </div>
      )}

      {/* Zone color strip */}
      <div className="flex h-1 mx-4 rounded-full overflow-hidden">
        {pageRecipes.map((recipe, i) => (
          <div key={i} className="flex-1" style={{
            background: recipe.zoneColor,
            opacity: isInSeason(recipe) ? 1 : 0.3,
          }} />
        ))}
      </div>

      {/* Chord Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-5 gap-2 p-3"
        >
          {pageRecipes.map((recipe) => {
            const note = NOTE_MAP[recipe.frequencyHz] || '?';
            const inSeason = isInSeason(recipe);

            return (
              <motion.div
                key={recipe.chordName}
                className="rounded-xl p-2.5 relative group cursor-default"
                style={{
                  background: inSeason ? `${recipe.zoneColor}12` : `${recipe.zoneColor}05`,
                  border: `1px solid ${inSeason ? `${recipe.zoneColor}40` : `${recipe.zoneColor}15`}`,
                  minHeight: 120,
                  opacity: inSeason ? 1 : 0.5,
                }}
                whileHover={{
                  borderColor: `${recipe.zoneColor}60`,
                  background: `${recipe.zoneColor}15`,
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
              >
                {/* In-season glow indicator */}
                {inSeason && activePhase && (
                  <motion.div
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ background: activePhase.borderColor }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Zone note — large */}
                <div className="text-center mb-1">
                  <span className="text-lg font-mono font-bold" style={{ color: recipe.zoneColor }}>
                    {note}
                  </span>
                </div>

                {/* Chord name — small */}
                <div className="text-center mb-1.5">
                  <span className="text-[7px] font-mono leading-tight block" style={{ color: 'hsl(0 0% 45%)' }}>
                    {recipe.chordName}
                  </span>
                </div>

                {/* Hz badge */}
                <div className="text-center mb-2">
                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded-full" style={{
                    background: `${recipe.zoneColor}15`,
                    color: `${recipe.zoneColor}CC`,
                  }}>
                    {recipe.frequencyHz}Hz
                  </span>
                </div>

                {/* 7 interval dots */}
                <div className="flex justify-center gap-0.5">
                  {recipe.intervals.map((iv, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 h-1.5 rounded-full"
                      title={`${iv.interval}: ${iv.cropName}`}
                      style={{
                        background: recipe.zoneColor,
                        opacity: 0.3 + (idx * 0.1),
                        boxShadow: inSeason ? `0 0 4px ${recipe.zoneColor}40` : 'none',
                      }}
                    />
                  ))}
                </div>

                {/* Voice count */}
                <div className="absolute bottom-1.5 right-2">
                  <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 25%)' }}>
                    {recipe.intervals.length}v
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Cross-chord dependencies */}
      {crossDeps.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {crossDeps.map((dep, i) => (
            <span key={i} className="text-[7px] font-mono px-2 py-0.5 rounded-full" style={{
              background: 'hsl(0 0% 5%)',
              border: '1px solid hsl(0 0% 12%)',
              color: 'hsl(0 0% 40%)',
            }}>
              {dep.cropName} {dep.dir === 'prev' ? '◂' : '▸'}
            </span>
          ))}
        </div>
      )}

      {/* ─── ROW RESONANCE ─── */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-3 rounded-full" style={{ background: 'hsl(45 60% 50%)' }} />
            <span className="text-[9px] font-mono tracking-[0.15em]" style={{ color: 'hsl(0 0% 40%)' }}>
              ROW RESONANCE
            </span>
            <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 22%)' }}>
              {resonanceDepth}/{Math.min(pageRecipes.length, 5)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {resonanceDepth > 1 && (
              <button
                onClick={() => setResonanceDepth(d => d - 1)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono"
                style={{ color: 'hsl(0 0% 40%)' }}
              >
                −
              </button>
            )}
            {resonanceDepth < Math.min(pageRecipes.length, 5) && (
              <motion.button
                onClick={() => setResonanceDepth(d => d + 1)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono"
                style={{
                  background: 'hsl(0 0% 8%)',
                  border: '1px solid hsl(0 0% 15%)',
                  color: 'hsl(45 60% 55%)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                +
              </motion.button>
            )}
          </div>
        </div>

        {/* Matrix */}
        <div className="space-y-1">
          <AnimatePresence>
            {Array.from({ length: resonanceDepth }).map((_, i) => (
              <motion.div
                key={`r-${i}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-5 gap-1"
              >
                {Array.from({ length: pageRecipes.length }).map((_, j) => {
                  const score = matrix[i]?.[j] ?? 0;
                  const isSelf = i === j;
                  const isVisible = j < resonanceDepth || j <= i;
                  const recipe = pageRecipes[isSelf ? i : j];

                  if (!isVisible || !recipe) {
                    return <div key={`${i}-${j}`} className="rounded-lg aspect-square" style={{ background: 'hsl(0 0% 3%)' }} />;
                  }

                  if (isSelf) {
                    return (
                      <div key={`${i}-${j}`} className="rounded-lg flex items-center justify-center aspect-square"
                        style={{ background: `${recipe.zoneColor}10`, border: `1px solid ${recipe.zoneColor}25` }}>
                        <span className="text-[9px] font-mono font-bold" style={{ color: recipe.zoneColor }}>
                          {NOTE_MAP[recipe.frequencyHz] || '?'}
                        </span>
                      </div>
                    );
                  }

                  const style = resonanceToStyle(score);
                  return (
                    <div key={`${i}-${j}`} className="rounded-lg flex items-center justify-center aspect-square"
                      style={{ background: style.bg, border: `1px solid ${style.border}`, opacity: j > i ? 0.4 : 1 }}>
                      <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                        {score > 0 ? `${Math.round(score * 100)}` : '·'}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2">
          {[
            { label: 'strong', bg: 'hsl(120 25% 12%)' },
            { label: 'moderate', bg: 'hsl(45 20% 10%)' },
            { label: 'weak', bg: 'hsl(30 15% 8%)' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: l.bg, border: '1px solid hsl(0 0% 15%)' }} />
              <span className="text-[7px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 32%)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Page dots */}
      <div className="flex items-center justify-center gap-1 pb-3">
        {Array.from({ length: totalPages }).map((_, i) => {
          const firstRecipe = sortedRecipes[i * PAGE_SIZE];
          const c = firstRecipe?.zoneColor || 'hsl(0 0% 15%)';
          return (
            <button key={i} onClick={() => setPage(i)}
              className="rounded-full transition-all"
              style={{
                width: page === i ? 14 : 4,
                height: 4,
                background: page === i ? c : 'hsl(0 0% 12%)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HarmonicCarousel;
