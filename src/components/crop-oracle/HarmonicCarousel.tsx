import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Music, Radio, Sprout, Leaf } from 'lucide-react';
import { CHORD_RECIPES, type ChordRecipe } from '@/data/chordRecipes';
import { CSA_PHASES, getCurrentPhase } from '@/components/master-build/SeasonalMovements';

/* ─── Constants ─── */
const PAGE_SIZE = 3;

const NOTE_MAP: Record<number, string> = {
  396: 'C', 417: 'D', 528: 'E', 639: 'F', 741: 'G', 852: 'A', 963: 'B',
};

const FREQ_TO_ZONE: Record<number, number> = {
  396: 1, 417: 2, 528: 3, 639: 4, 741: 5, 852: 6, 963: 7,
};

const INTERVAL_ROLE_ICONS: Record<string, string> = {
  '1st': '🌱', '3rd': '🌿', '5th': '🫘', '7th': '🌼',
  '9th': '🥕', '11th': '🍄', '13th': '🌺',
};

/* ─── Component ─── */
const HarmonicCarousel = () => {
  const [page, setPage] = useState(0);
  const [filterSeason, setFilterSeason] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const activePhase = getCurrentPhase();

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
  const pageRecipes = useMemo(
    () => sortedRecipes.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [sortedRecipes, page]
  );

  const goPage = (dir: -1 | 1) =>
    setPage((p) => Math.max(0, Math.min(totalPages - 1, p + dir)));

  const isInSeason = (recipe: ChordRecipe): boolean => {
    if (!activePhase) return false;
    const zone = FREQ_TO_ZONE[recipe.frequencyHz];
    return zone ? activePhase.zones.includes(zone) : false;
  };

  return (
    <div
      className="mx-4 mb-4 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid hsl(0 0% 12%)',
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Music className="w-4 h-4" style={{ color: 'hsl(45 80% 55%)' }} />
          <span
            className="text-[10px] font-mono font-bold tracking-[0.2em]"
            style={{ color: 'hsl(45 80% 55%)' }}
          >
            HARMONIC MATRIX
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
            {sortedRecipes.length} chords
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goPage(-1)}
            disabled={page === 0}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity"
            style={{
              background: 'hsl(0 0% 8%)',
              opacity: page === 0 ? 0.3 : 0.7,
            }}
          >
            <ChevronLeft className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 60%)' }} />
          </button>
          <span
            className="text-[9px] font-mono tabular-nums w-14 text-center"
            style={{ color: 'hsl(0 0% 40%)' }}
          >
            {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, sortedRecipes.length)}
          </span>
          <button
            onClick={() => goPage(1)}
            disabled={page === totalPages - 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity"
            style={{
              background: 'hsl(0 0% 8%)',
              opacity: page === totalPages - 1 ? 0.3 : 0.7,
            }}
          >
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 60%)' }} />
          </button>
        </div>
      </div>

      {/* Seasonal Phase Banner */}
      {activePhase && (
        <div
          className="mx-4 mb-2 rounded-lg px-3 py-2 flex items-center justify-between"
          style={{
            background: activePhase.gradient,
            border: `1px solid ${activePhase.borderColor}40`,
          }}
        >
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5" style={{ color: activePhase.borderColor }} />
            <span
              className="text-[9px] font-mono font-bold tracking-wider"
              style={{ color: activePhase.borderColor }}
            >
              {activePhase.name}
            </span>
            <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
              {activePhase.dateRange} • {activePhase.frequencyRange}
            </span>
          </div>
          <button
            onClick={() => {
              setFilterSeason((f) => !f);
              setPage(0);
            }}
            className="text-[8px] font-mono px-2 py-0.5 rounded-full transition-all"
            style={{
              background: filterSeason
                ? `${activePhase.borderColor}20`
                : 'hsl(0 0% 8%)',
              border: `1px solid ${
                filterSeason ? activePhase.borderColor + '50' : 'hsl(0 0% 15%)'
              }`,
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
          <div
            key={i}
            className="flex-1"
            style={{
              background: recipe.zoneColor,
              opacity: isInSeason(recipe) ? 1 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Chord Cards — expanded with crop slots */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-2 p-3"
        >
          {pageRecipes.map((recipe) => {
            const note = NOTE_MAP[recipe.frequencyHz] || '?';
            const inSeason = isInSeason(recipe);
            const isExpanded = expandedCard === recipe.chordName;

            return (
              <motion.div
                key={recipe.chordName}
                className="rounded-xl overflow-hidden cursor-pointer"
                style={{
                  background: inSeason
                    ? `${recipe.zoneColor}10`
                    : `${recipe.zoneColor}05`,
                  border: `1px solid ${
                    inSeason ? `${recipe.zoneColor}40` : `${recipe.zoneColor}15`
                  }`,
                  opacity: inSeason ? 1 : 0.5,
                }}
                onClick={() =>
                  setExpandedCard(isExpanded ? null : recipe.chordName)
                }
                whileHover={{ opacity: 1 }}
              >
                {/* Card Header */}
                <div className="flex items-center gap-3 px-3 py-2.5">
                  {/* In-season glow */}
                  {inSeason && activePhase && (
                    <motion.div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: activePhase.borderColor }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  {!inSeason && (
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: recipe.zoneColor, opacity: 0.3 }}
                    />
                  )}

                  {/* Note */}
                  <span
                    className="text-lg font-mono font-bold shrink-0"
                    style={{ color: recipe.zoneColor }}
                  >
                    {note}
                  </span>

                  {/* Name & Hz */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[10px] font-mono font-bold block truncate"
                      style={{ color: 'hsl(0 0% 70%)' }}
                    >
                      {recipe.chordName}
                    </span>
                    <span
                      className="text-[8px] font-mono"
                      style={{ color: 'hsl(0 0% 40%)' }}
                    >
                      {recipe.frequencyHz}Hz • {recipe.zoneName} •{' '}
                      {recipe.intervals.length}v
                    </span>
                  </div>

                  {/* Season badge */}
                  {inSeason && (
                    <span
                      className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{
                        background: `${recipe.zoneColor}20`,
                        color: recipe.zoneColor,
                        border: `1px solid ${recipe.zoneColor}40`,
                      }}
                    >
                      IN SEASON
                    </span>
                  )}

                  {/* Interval dots summary */}
                  <div className="flex gap-0.5 shrink-0">
                    {recipe.intervals.map((iv, idx) => (
                      <div
                        key={idx}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: recipe.zoneColor,
                          opacity: 0.3 + idx * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Expanded: Auto Crop Slots */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-3 pb-3 pt-1"
                        style={{
                          borderTop: `1px solid ${recipe.zoneColor}15`,
                        }}
                      >
                        {/* Auto-tuned label */}
                        <div className="flex items-center gap-2 mb-2">
                          <Sprout
                            className="w-3 h-3"
                            style={{
                              color: inSeason
                                ? 'hsl(120 50% 50%)'
                                : 'hsl(0 0% 35%)',
                            }}
                          />
                          <span
                            className="text-[8px] font-mono tracking-wider"
                            style={{
                              color: inSeason
                                ? 'hsl(120 50% 50%)'
                                : 'hsl(0 0% 35%)',
                            }}
                          >
                            {inSeason
                              ? '● AUTO CROPS — TUNED TO SEASON'
                              : '○ CROP SLOTS — OFF SEASON'}
                          </span>
                        </div>

                        {/* 7 interval slots */}
                        <div className="space-y-1">
                          {recipe.intervals.map((iv, idx) => (
                            <div
                              key={iv.interval}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                              style={{
                                background: inSeason
                                  ? `${recipe.zoneColor}08`
                                  : 'hsl(0 0% 4%)',
                                border: `1px solid ${
                                  inSeason
                                    ? `${recipe.zoneColor}20`
                                    : 'hsl(0 0% 8%)'
                                }`,
                              }}
                            >
                              {/* Interval badge */}
                              <span
                                className="text-[8px] font-mono font-bold w-8 shrink-0 text-center"
                                style={{ color: recipe.zoneColor }}
                              >
                                {iv.interval}
                              </span>

                              {/* Emoji */}
                              <span className="text-sm shrink-0">
                                {iv.emoji ||
                                  INTERVAL_ROLE_ICONS[iv.interval] ||
                                  '🌱'}
                              </span>

                              {/* Crop name */}
                              <div className="flex-1 min-w-0">
                                <span
                                  className="text-[10px] font-mono font-bold block truncate"
                                  style={{
                                    color: inSeason
                                      ? 'hsl(0 0% 80%)'
                                      : 'hsl(0 0% 45%)',
                                  }}
                                >
                                  {iv.cropName}
                                </span>
                                <span
                                  className="text-[7px] font-mono"
                                  style={{ color: 'hsl(0 0% 35%)' }}
                                >
                                  {iv.role}
                                </span>
                              </div>

                              {/* Season indicator */}
                              {inSeason && (
                                <Leaf
                                  className="w-3 h-3 shrink-0"
                                  style={{ color: 'hsl(120 50% 50%)' }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Page dots */}
      <div className="flex items-center justify-center gap-1 pb-3">
        {Array.from({ length: totalPages }).map((_, i) => {
          const firstRecipe = sortedRecipes[i * PAGE_SIZE];
          const c = firstRecipe?.zoneColor || 'hsl(0 0% 15%)';
          return (
            <button
              key={i}
              onClick={() => setPage(i)}
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
