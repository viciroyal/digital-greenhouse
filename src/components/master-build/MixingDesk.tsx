import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { HARMONIC_ZONES, HarmonicZone } from '@/data/harmonicZoneProtocol';
import { useGardenBeds } from '@/hooks/useGardenBeds';
import { useCropsByFrequency } from '@/hooks/useMasterCrops';

/**
 * MIXING DESK — Module 3
 * 7-row "Mixing Console" showing Zone tuning status
 * Brix = Tuning bar. 12+ = In Tune (green glow). <8 = Dissonant (red pulse).
 */

const MASTER_MIX_INGREDIENTS = [
  { name: 'Pro-Mix (Peat/Perlite)', qty: '5 Quarts' },
  { name: 'Alfalfa Meal', qty: '5 Quarts' },
  { name: 'Soybean Meal', qty: '5 Quarts' },
  { name: 'Kelp Meal', qty: '5 Quarts' },
  { name: 'Sea Agri Minerals', qty: '5 Quarts' },
  { name: 'Harmony (Gypsum)', qty: '5 Quarts' },
  { name: 'Worm Castings', qty: '5 Quarts' },
  { name: 'Humates', qty: '5 Quarts' },
];

const getBrixStatus = (brix: number | null) => {
  if (brix === null) return { label: 'NO SIGNAL', color: 'hsl(0 0% 30%)', status: 'silent' as const };
  if (brix >= 18) return { label: 'HIGH FIDELITY', color: 'hsl(45 90% 55%)', status: 'highfidelity' as const };
  if (brix >= 12) return { label: 'IN TUNE', color: 'hsl(120 60% 45%)', status: 'tuned' as const };
  return { label: 'DISSONANT', color: 'hsl(0 65% 50%)', status: 'dissonant' as const };
};

interface ZoneRowProps {
  zone: HarmonicZone;
  avgBrix: number | null;
  bedCount: number;
}

const ZoneRow = ({ zone, avgBrix, bedCount }: ZoneRowProps) => {
  const [showReset, setShowReset] = useState(false);
  const { data: crops = [] } = useCropsByFrequency(zone.frequencyHz);
  const brixStatus = getBrixStatus(avgBrix);
  const brixPercent = avgBrix !== null ? Math.min((avgBrix / 24) * 100, 100) : 0;

  // Top 3 crops as the "Agro-Chord"
  const guildCrops = crops.slice(0, 3).map(c => c.common_name || c.name);

  return (
    <motion.div
      className="rounded-lg overflow-hidden"
      style={{
        background: 'hsl(0 0% 6%)',
        border: `1px solid ${zone.colorHsl.replace(')', ' / 0.25)')}`,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Note / Frequency badge */}
        <div
          className="w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0"
          style={{
            background: zone.colorHsl.replace(')', ' / 0.15)'),
            border: `2px solid ${zone.colorHsl}`,
            boxShadow: `0 0 15px ${zone.colorHsl.replace(')', ' / 0.2)')}`,
          }}
        >
          <span className="text-lg font-bold" style={{ fontFamily: "'Staatliches', sans-serif", color: zone.colorHsl }}>
            {zone.note}
          </span>
          <span className="text-[9px] font-mono" style={{ color: zone.colorHsl }}>
            {zone.frequencyHz}Hz
          </span>
        </div>

        {/* Middle: Guild & Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold truncate" style={{ color: zone.colorHsl }}>
              {zone.agroIdentity.toUpperCase()}
            </span>
            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
              {bedCount} beds
            </span>
          </div>

          {/* Agro-Chord (crop guild) */}
          <p className="text-[10px] font-mono truncate mb-2" style={{ color: 'hsl(0 0% 55%)' }}>
            {guildCrops.length > 0 ? guildCrops.join(' / ') : 'Awaiting assignment...'}
          </p>

          {/* Brix Tuning Bar */}
          <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'hsl(0 0% 12%)' }}>
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: brixStatus.color }}
              initial={{ width: 0 }}
              animate={{ width: `${brixPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            {/* Dissonant pulse */}
            {brixStatus.status === 'dissonant' && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'hsl(0 70% 50% / 0.3)' }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
            {/* High Fidelity gold shimmer */}
            {brixStatus.status === 'highfidelity' && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'hsl(45 80% 50% / 0.2)' }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            {/* Scale markers at 8 and 12 */}
            <div className="absolute top-0 bottom-0 w-px" style={{ left: '33.3%', background: 'hsl(0 0% 25%)' }} />
            <div className="absolute top-0 bottom-0 w-px" style={{ left: '50%', background: 'hsl(0 0% 25%)' }} />
          </div>
        </div>

        {/* Right: Status + Reset */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full"
            style={{
              color: brixStatus.color,
              background: brixStatus.color.replace(')', ' / 0.12)'),
              border: `1px solid ${brixStatus.color.replace(')', ' / 0.3)')}`,
            }}
          >
            {brixStatus.label}
          </span>

          {avgBrix !== null && (
            <span className="text-xs font-mono font-bold" style={{ color: brixStatus.color }}>
              {avgBrix.toFixed(1)}°
            </span>
          )}

          {brixStatus.status === 'dissonant' && (
            <motion.button
              className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono mt-1"
              style={{
                background: 'hsl(0 40% 15%)',
                border: '1px solid hsl(0 50% 35%)',
                color: 'hsl(0 60% 65%)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReset(!showReset)}
            >
              <RotateCcw className="w-3 h-3" />
              SOIL RESET
              {showReset ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </motion.button>
          )}
        </div>
      </div>

      {/* 5-Quart Master Mix Protocol (expanded) */}
      <AnimatePresence>
        {showReset && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 py-3 mx-3 mb-3 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, hsl(30 20% 8%), hsl(20 15% 6%))',
                border: '1px solid hsl(40 30% 20%)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3.5 h-3.5" style={{ color: 'hsl(45 60% 55%)' }} />
                <span className="text-[10px] font-mono tracking-wider font-bold" style={{ color: 'hsl(45 60% 55%)' }}>
                  5-QUART MASTER MIX — SOIL RESET PROTOCOL
                </span>
              </div>
              <p className="text-[9px] font-mono mb-2" style={{ color: 'hsl(0 0% 45%)' }}>
                Apply per 60ft bed (150 sq ft). Clears the static. Resets to Middle C (396Hz).
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {MASTER_MIX_INGREDIENTS.map(ing => (
                  <div
                    key={ing.name}
                    className="flex items-center justify-between px-2 py-1 rounded"
                    style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(0 0% 18%)' }}
                  >
                    <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 60%)' }}>
                      {ing.name}
                    </span>
                    <span className="text-[9px] font-mono font-bold" style={{ color: 'hsl(45 60% 55%)' }}>
                      {ing.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MixingDesk = () => {
  const { data: beds = [] } = useGardenBeds();

  // Compute avg brix and bed count per zone
  const zoneStats = HARMONIC_ZONES.map(zone => {
    const zoneBeds = beds.filter(b => b.frequency_hz === zone.frequencyHz);
    const brixBeds = zoneBeds.filter(b => b.internal_brix !== null);
    const avgBrix = brixBeds.length > 0
      ? brixBeds.reduce((s, b) => s + (b.internal_brix || 0), 0) / brixBeds.length
      : null;
    return { zone, avgBrix, bedCount: zoneBeds.length };
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />
        <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: 'hsl(0 0% 45%)' }}>
          MIXING DESK — ZONE STATUS MATRIX
        </span>
      </div>

      <div className="space-y-2">
        {zoneStats.map(({ zone, avgBrix, bedCount }, i) => (
          <ZoneRow key={zone.frequencyHz} zone={zone} avgBrix={avgBrix} bedCount={bedCount} />
        ))}
      </div>
    </div>
  );
};

export default MixingDesk;
