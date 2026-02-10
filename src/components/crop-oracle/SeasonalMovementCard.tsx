import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { CSA_PHASES, getCurrentPhase } from '@/components/master-build/SeasonalMovements';
import type { MasterCrop } from '@/hooks/useMasterCrops';

/* ─── Zone-to-frequency mapping ─── */
const FREQ_TO_ZONE: Record<number, number> = {
  396: 1, 417: 2, 528: 3, 639: 4, 741: 5, 852: 6, 963: 7,
};

interface SeasonalMovementCardProps {
  crop: MasterCrop;
}

const SeasonalMovementCard = ({ crop }: SeasonalMovementCardProps) => {
  const zoneNum = FREQ_TO_ZONE[crop.frequency_hz];
  const activePhase = getCurrentPhase();

  // Find the phase this crop belongs to
  const cropPhase = CSA_PHASES.find(p => zoneNum && p.zones.includes(zoneNum));
  if (!cropPhase) return null;

  const isInSeason = activePhase?.id === cropPhase.id;
  const Icon = cropPhase.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: cropPhase.gradient,
        border: `1px solid ${isInSeason ? cropPhase.borderColor : cropPhase.borderColor.replace(')', ' / 0.3)')}`,
        boxShadow: isInSeason ? `0 0 20px ${cropPhase.glowColor}` : 'none',
      }}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4" style={{ color: cropPhase.borderColor }} />
            <span
              className="text-[10px] font-mono font-bold tracking-wider"
              style={{ color: cropPhase.borderColor }}
            >
              SEASONAL MOVEMENT
            </span>
          </div>
          {isInSeason && (
            <motion.span
              className="text-[8px] font-mono px-1.5 py-0.5 rounded-full"
              style={{
                background: `${cropPhase.borderColor}20`,
                border: `1px solid ${cropPhase.borderColor}`,
                color: cropPhase.borderColor,
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ● NOW
            </motion.span>
          )}
        </div>

        {/* Phase info */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: `${cropPhase.borderColor}15`,
              border: `1px solid ${cropPhase.borderColor}30`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: cropPhase.borderColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <span
              className="text-xs font-mono font-bold block"
              style={{ color: cropPhase.borderColor }}
            >
              Phase {cropPhase.id}: {cropPhase.name}
            </span>
            <span className="text-[9px] font-mono block" style={{ color: 'hsl(0 0% 50%)' }}>
              {cropPhase.dateRange} • {cropPhase.frequencyRange}
            </span>
            <span className="text-[9px] font-mono block mt-0.5" style={{ color: 'hsl(0 0% 45%)' }}>
              Focus: <span style={{ color: cropPhase.borderColor }}>{cropPhase.focusLabel}</span>
            </span>
          </div>
        </div>

        {/* Phase position bar */}
        <div className="flex gap-1 mt-3">
          {CSA_PHASES.map((p) => {
            const isCropPhase = p.id === cropPhase.id;
            return (
              <div
                key={p.id}
                className="flex-1 rounded-full"
                style={{
                  height: 4,
                  background: isCropPhase ? p.borderColor : 'hsl(0 0% 12%)',
                  opacity: isCropPhase ? 1 : 0.4,
                  boxShadow: isCropPhase ? `0 0 8px ${p.glowColor}` : 'none',
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          {CSA_PHASES.map(p => (
            <span key={p.id} className="text-[7px] font-mono flex-1 text-center" style={{ color: 'hsl(0 0% 35%)' }}>
              {p.name.replace('THE ', '')}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SeasonalMovementCard;
