import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { useGardenBeds, useAllBedPlantings, type GardenBed, type BedPlanting } from '@/hooks/useGardenBeds';

/* ─── Constants ─── */
const PAGE_SIZE = 5;

const NOTE_MAP: Record<number, string> = {
  396: 'C', 417: 'D', 528: 'E', 639: 'F', 741: 'G', 852: 'A', 963: 'B',
};

/* ─── Bed slot type ─── */
interface BedSlot {
  bed: GardenBed | null;
  plantings: BedPlanting[];
  index: number;
}

/* ─── Resonance between two beds ─── */
function getBedResonance(a: BedSlot, b: BedSlot): number {
  if (!a.bed || !b.bed) return 0;

  let score = 0;

  // Same zone = high base resonance
  if (a.bed.frequency_hz === b.bed.frequency_hz) {
    score += 0.4;
  } else {
    // Frequency proximity bonus
    const dist = Math.abs(a.bed.frequency_hz - b.bed.frequency_hz);
    if (dist <= 150) score += 0.25;
    else if (dist <= 300) score += 0.1;
  }

  // Shared crops across beds
  if (a.plantings.length > 0 && b.plantings.length > 0) {
    const aCrops = new Set(a.plantings.map(p => p.crop_id));
    const bCrops = new Set(b.plantings.map(p => p.crop_id));
    let shared = 0;
    for (const c of aCrops) if (bCrops.has(c)) shared++;
    score += shared * 0.15;
  }

  // Both beds have plantings = active harmony
  if (a.plantings.length > 0 && b.plantings.length > 0) {
    score += 0.1;
  }

  // Complementary interval coverage
  if (a.plantings.length > 0 && b.plantings.length > 0) {
    const aIntervals = new Set(a.plantings.map(p => p.crop?.chord_interval).filter(Boolean));
    const bIntervals = new Set(b.plantings.map(p => p.crop?.chord_interval).filter(Boolean));
    const combined = new Set([...aIntervals, ...bIntervals]);
    if (combined.size >= 3) score += 0.15;
  }

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
  const { data: beds } = useGardenBeds();
  const { data: allPlantingsMap } = useAllBedPlantings();
  const [page, setPage] = useState(0);
  const [resonanceDepth, setResonanceDepth] = useState(1);

  // Build slots from live beds (up to 50)
  const slots = useMemo((): BedSlot[] => {
    if (!beds) return [];
    const result: BedSlot[] = beds.map((bed, i) => ({
      bed,
      plantings: allPlantingsMap?.[bed.id] || [],
      index: i,
    }));
    // Pad to 50
    while (result.length < 50) {
      result.push({ bed: null, plantings: [], index: result.length });
    }
    return result.slice(0, 50);
  }, [beds, allPlantingsMap]);

  const totalPages = Math.ceil(slots.length / PAGE_SIZE);
  const pageSlots = useMemo(() => slots.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), [slots, page]);

  // Cross-page shared crops
  const prevSlots = useMemo(() => page > 0 ? slots.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [], [slots, page]);
  const nextSlots = useMemo(() => page < totalPages - 1 ? slots.slice((page + 1) * PAGE_SIZE, (page + 2) * PAGE_SIZE) : [], [slots, page, totalPages]);

  const crossDeps = useMemo(() => {
    const deps: { fromBed: number; dir: 'prev' | 'next'; cropName: string }[] = [];
    for (const slot of pageSlots) {
      if (slot.plantings.length === 0) continue;
      const cropIds = new Set(slot.plantings.map(p => p.crop_id));
      for (const [adjSlots, dir] of [[prevSlots, 'prev'], [nextSlots, 'next']] as const) {
        for (const adj of adjSlots) {
          for (const p of adj.plantings) {
            if (cropIds.has(p.crop_id)) {
              deps.push({
                fromBed: slot.bed?.bed_number || 0,
                dir,
                cropName: p.crop?.common_name || p.crop?.name || '—',
              });
              break;
            }
          }
        }
      }
    }
    return deps.slice(0, 3);
  }, [pageSlots, prevSlots, nextSlots]);

  // Resonance matrix for current page
  const matrix = useMemo(() => {
    return pageSlots.map((a, i) =>
      pageSlots.map((b, j) => i === j ? 1 : getBedResonance(a, b))
    );
  }, [pageSlots]);

  const goPage = (dir: -1 | 1) => setPage(p => Math.max(0, Math.min(totalPages - 1, p + dir)));

  if (!beds) return null;

  return (
    <div className="mx-4 mb-4 rounded-2xl overflow-hidden" style={{
      background: 'hsl(0 0% 3%)',
      border: '1px solid hsl(0 0% 8%)',
    }}>
      {/* Header — minimal */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 rounded-full" style={{ background: 'hsl(45 60% 50%)' }} />
          <span className="text-[9px] font-mono tracking-[0.25em]" style={{ color: 'hsl(0 0% 50%)' }}>
            BED HARMONY
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 25%)' }}>
            {beds.length} beds
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => goPage(-1)} disabled={page === 0}
            className="w-6 h-6 rounded-md flex items-center justify-center transition-opacity"
            style={{ opacity: page === 0 ? 0.2 : 0.6 }}>
            <ChevronLeft className="w-3 h-3" style={{ color: 'hsl(0 0% 50%)' }} />
          </button>
          <span className="text-[8px] font-mono tabular-nums w-12 text-center" style={{ color: 'hsl(0 0% 30%)' }}>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, slots.length)}
          </span>
          <button onClick={() => goPage(1)} disabled={page === totalPages - 1}
            className="w-6 h-6 rounded-md flex items-center justify-center transition-opacity"
            style={{ opacity: page === totalPages - 1 ? 0.2 : 0.6 }}>
            <ChevronRight className="w-3 h-3" style={{ color: 'hsl(0 0% 50%)' }} />
          </button>
        </div>
      </div>

      {/* Zone line — ultra thin */}
      <div className="flex h-px mx-4">
        {pageSlots.map((slot, i) => (
          <div key={i} className="flex-1" style={{ background: slot.bed?.zone_color || 'hsl(0 0% 8%)' }} />
        ))}
      </div>

      {/* Bed Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-5 gap-1.5 p-3"
        >
          {pageSlots.map((slot) => {
            const bed = slot.bed;
            const plantCount = slot.plantings.length;
            const color = bed?.zone_color || 'hsl(0 0% 15%)';
            const isEmpty = !bed;

            return (
              <motion.div
                key={slot.index}
                className="rounded-xl p-2.5 relative group"
                style={{
                  background: 'hsl(0 0% 4%)',
                  border: `1px solid hsl(0 0% 8%)`,
                  minHeight: 88,
                }}
                whileHover={{
                  borderColor: color,
                  transition: { duration: 0.15 },
                }}
              >
                {isEmpty ? (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 15%)' }}>—</span>
                  </div>
                ) : (
                  <>
                    {/* Bed number — dominant, centered */}
                    <div className="text-center mb-1.5">
                      <span className="text-base font-mono font-bold" style={{ color }}>
                        {bed.bed_number}
                      </span>
                    </div>

                    {/* Note + Hz — whisper */}
                    <div className="text-center mb-2">
                      <span className="text-[7px] font-mono tracking-widest" style={{ color: 'hsl(0 0% 30%)' }}>
                        {NOTE_MAP[bed.frequency_hz] || '?'} · {bed.frequency_hz}
                      </span>
                    </div>

                    {/* Planting indicator — 4 dots for chord intervals */}
                    <div className="flex justify-center gap-1">
                      {['Root (Lead)', '3rd (Triad)', '5th (Stabilizer)', '7th (Signal)'].map(interval => {
                        const filled = slot.plantings.some(p => p.crop?.chord_interval === interval);
                        return (
                          <div
                            key={interval}
                            className="w-1.5 h-1.5 rounded-full transition-all"
                            style={{
                              background: filled ? color : 'hsl(0 0% 10%)',
                              boxShadow: filled ? `0 0 4px ${color}` : 'none',
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Plant count — bottom right whisper */}
                    {plantCount > 0 && (
                      <div className="absolute bottom-1.5 right-2">
                        <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 22%)' }}>
                          {plantCount}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Cross-bed dependencies */}
      {crossDeps.length > 0 && (
        <div className="px-4 pb-2 flex gap-1.5">
          {crossDeps.map((dep, i) => (
            <span key={i} className="text-[7px] font-mono px-2 py-0.5 rounded-full" style={{
              background: 'hsl(0 0% 5%)',
              border: '1px solid hsl(0 0% 10%)',
              color: 'hsl(0 0% 35%)',
            }}>
              Bed {dep.fromBed} · {dep.cropName} {dep.dir === 'prev' ? '◂' : '▸'}
            </span>
          ))}
        </div>
      )}

      {/* ─── BED RESONANCE ─── */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-3 rounded-full" style={{ background: 'hsl(45 40% 40%)' }} />
            <span className="text-[8px] font-mono tracking-[0.2em]" style={{ color: 'hsl(0 0% 35%)' }}>
              BED RESONANCE
            </span>
            <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 20%)' }}>
              {resonanceDepth}/5
            </span>
          </div>
          <div className="flex items-center gap-1">
            {resonanceDepth > 1 && (
              <button
                onClick={() => setResonanceDepth(d => d - 1)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono"
                style={{ color: 'hsl(0 0% 35%)' }}
              >
                −
              </button>
            )}
            {resonanceDepth < 5 && (
              <motion.button
                onClick={() => setResonanceDepth(d => d + 1)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono"
                style={{
                  background: 'hsl(0 0% 6%)',
                  border: '1px solid hsl(0 0% 12%)',
                  color: 'hsl(45 50% 55%)',
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
                {Array.from({ length: 5 }).map((_, j) => {
                  const score = matrix[i]?.[j] ?? 0;
                  const isSelf = i === j;
                  const isVisible = j < resonanceDepth || j <= i;
                  const slot = pageSlots[isSelf ? i : j];
                  const color = slot?.bed?.zone_color || 'hsl(0 0% 15%)';

                  if (!isVisible) {
                    return <div key={`${i}-${j}`} className="rounded-lg aspect-square" style={{ background: 'hsl(0 0% 3%)' }} />;
                  }

                  if (isSelf) {
                    return (
                      <div key={`${i}-${j}`} className="rounded-lg flex items-center justify-center aspect-square"
                        style={{ background: 'hsl(0 0% 5%)', border: `1px solid ${color}30` }}>
                        <span className="text-[8px] font-mono font-bold" style={{ color }}>
                          {slot?.bed?.bed_number || '—'}
                        </span>
                      </div>
                    );
                  }

                  const style = resonanceToStyle(score);
                  return (
                    <div key={`${i}-${j}`} className="rounded-lg flex items-center justify-center aspect-square"
                      style={{ background: style.bg, border: `1px solid ${style.border}`, opacity: j > i ? 0.4 : 1 }}>
                      <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                        {score > 0 ? `${Math.round(score * 100)}` : '·'}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Legend — ultra minimal */}
        <div className="flex items-center gap-4 mt-2">
          {[
            { label: 'strong', bg: 'hsl(120 25% 12%)' },
            { label: 'moderate', bg: 'hsl(45 20% 10%)' },
            { label: 'weak', bg: 'hsl(30 15% 8%)' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: l.bg, border: '1px solid hsl(0 0% 12%)' }} />
              <span className="text-[6px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 28%)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Page dots — minimal */}
      <div className="flex items-center justify-center gap-1 pb-3">
        {Array.from({ length: totalPages }).map((_, i) => {
          const dominantSlot = slots[i * PAGE_SIZE];
          const c = dominantSlot?.bed?.zone_color || 'hsl(0 0% 12%)';
          return (
            <button key={i} onClick={() => setPage(i)}
              className="rounded-full transition-all"
              style={{
                width: page === i ? 12 : 4,
                height: 4,
                background: page === i ? c : 'hsl(0 0% 10%)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HarmonicCarousel;
