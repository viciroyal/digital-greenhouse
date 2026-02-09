import { motion } from 'framer-motion';
import { Disc, Zap } from 'lucide-react';
import { GardenBed, BedPlanting } from '@/hooks/useGardenBeds';

const NOTE_MAP: Record<number, string> = {
  396: 'C', 417: 'D', 528: 'E', 639: 'F', 741: 'G', 852: 'A', 963: 'B',
};

const getFidelityLabel = (brix: number): { label: string; color: string } => {
  if (brix >= 20) return { label: 'Studio Master', color: 'hsl(45 90% 60%)' };
  if (brix >= 15) return { label: 'High Fidelity', color: 'hsl(120 50% 50%)' };
  if (brix >= 12) return { label: 'Standard Def', color: 'hsl(51 70% 55%)' };
  return { label: 'Lo-Fi', color: 'hsl(0 50% 50%)' };
};

interface BedWithAerial extends GardenBed {
  aerial_crop?: { id: string; name: string; common_name: string | null; frequency_hz: number } | null;
}

interface LinerNotesTrackProps {
  bed: BedWithAerial;
  plantings: BedPlanting[];
  trackNumber: number;
  index: number;
}

/**
 * Single track on the Liner Notes — one harvested bed rendered as a song credit.
 */
const LinerNotesTrack = ({ bed, plantings, trackNumber, index }: LinerNotesTrackProps) => {
  const note = NOTE_MAP[bed.frequency_hz] || '?';
  const brix = bed.internal_brix || 0;
  const fidelity = getFidelityLabel(brix);

  // Get the "lead" crop (Root interval) as the song title
  const rootPlanting = plantings.find(p => p.crop?.chord_interval === 'Root (Lead)');
  const trackTitle = rootPlanting?.crop?.common_name || rootPlanting?.crop?.name || bed.zone_name;

  // Supporting players (other intervals)
  const supportingCrops = plantings
    .filter(p => p.crop?.chord_interval !== 'Root (Lead)' && p.crop)
    .map(p => p.crop!.common_name || p.crop!.name);

  return (
    <motion.div
      className="flex items-start gap-3 p-3 rounded-lg"
      style={{
        background: index % 2 === 0 ? 'hsl(0 0% 5%)' : 'hsl(0 0% 4%)',
        border: '1px solid hsl(0 0% 10%)',
      }}
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
    >
      {/* Track Number */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: `${bed.zone_color}15`,
          border: `1px solid ${bed.zone_color}40`,
        }}
      >
        <span className="font-mono text-xs font-bold" style={{ color: bed.zone_color }}>
          {trackNumber}
        </span>
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        {/* Title + Key */}
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-bold truncate" style={{ color: 'hsl(0 0% 80%)' }}>
            {trackTitle}
          </span>
          <span
            className="font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0"
            style={{
              background: `${bed.zone_color}15`,
              color: bed.zone_color,
              border: `1px solid ${bed.zone_color}30`,
            }}
          >
            {note} • {bed.frequency_hz}Hz
          </span>
        </div>

        {/* Supporting Credits */}
        {supportingCrops.length > 0 && (
          <p className="text-[10px] font-mono mb-1.5" style={{ color: 'hsl(0 0% 40%)' }}>
            feat. {supportingCrops.join(', ')}
          </p>
        )}

        {/* Fidelity Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" style={{ color: fidelity.color }} />
            <span className="font-mono text-[10px] font-bold" style={{ color: fidelity.color }}>
              {brix}° — {fidelity.label}
            </span>
          </div>

          {/* Mini fidelity bar */}
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ background: 'hsl(0 0% 10%)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: fidelity.color,
                boxShadow: `0 0 4px ${fidelity.color}`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((brix / 24) * 100, 100)}%` }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.08 }}
            />
          </div>
        </div>
      </div>

      {/* Bed number */}
      <div className="text-right shrink-0">
        <span className="font-mono text-[9px]" style={{ color: 'hsl(0 0% 30%)' }}>
          BED
        </span>
        <p className="font-mono text-sm font-bold" style={{ color: 'hsl(0 0% 45%)' }}>
          {bed.bed_number}
        </p>
      </div>
    </motion.div>
  );
};

export default LinerNotesTrack;
