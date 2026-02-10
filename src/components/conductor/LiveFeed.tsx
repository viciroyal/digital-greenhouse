import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Activity, Clock, Disc, Signal, Waves } from 'lucide-react';
import { GardenBed, BedPlanting } from '@/hooks/useGardenBeds';
import { differenceInDays } from 'date-fns';

interface BedWithAerial extends GardenBed {
  aerial_crop?: { id: string; name: string; common_name: string | null; frequency_hz: number } | null;
}

interface LiveFeedProps {
  beds: BedWithAerial[];
  bedPlantingsMap: Record<string, BedPlanting[]>;
}

const NOTE_MAP: Record<number, string> = {
  396: 'C', 417: 'D', 528: 'E', 639: 'F', 741: 'G', 852: 'A', 963: 'B',
};

const getSignalStrength = (brix: number | null): { label: string; color: string; bars: number } => {
  if (brix === null) return { label: 'No Reading', color: 'hsl(0 0% 40%)', bars: 0 };
  if (brix >= 18) return { label: 'HIGH FIDELITY', color: 'hsl(45 90% 60%)', bars: 5 };
  if (brix >= 15) return { label: 'In Tune+', color: 'hsl(120 60% 50%)', bars: 4 };
  if (brix >= 12) return { label: 'In Tune', color: 'hsl(120 50% 45%)', bars: 3 };
  return { label: 'DISSONANT', color: 'hsl(0 60% 50%)', bars: 1 };
};

const getHarvestCountdown = (plantings: BedPlanting[]): { days: number | null; cropName: string | null } => {
  // Find the planted crop with harvest_days info (use Root/Lead as primary)
  const rootPlanting = plantings.find(p => p.crop?.chord_interval === 'Root (Lead)') || plantings[0];
  if (!rootPlanting?.planted_at || !rootPlanting.crop) return { days: null, cropName: null };

  const harvestDays = (rootPlanting.crop as any).harvest_days;
  if (!harvestDays) return { days: null, cropName: rootPlanting.crop.common_name || rootPlanting.crop.name };

  const planted = new Date(rootPlanting.planted_at);
  const harvestDate = new Date(planted.getTime() + harvestDays * 86400000);
  const remaining = differenceInDays(harvestDate, new Date());

  return {
    days: Math.max(0, remaining),
    cropName: rootPlanting.crop.common_name || rootPlanting.crop.name,
  };
};

/**
 * THE LIVE FEED
 * Treats each bed as a broadcasting station in a continuous, living radio network.
 */
const LiveFeed = ({ beds, bedPlantingsMap }: LiveFeedProps) => {
  // Get beds with activity (plantings or brix readings)
  const activeBeds = beds
    .filter(bed => {
      const plantings = bedPlantingsMap[bed.id] || [];
      return plantings.length > 0 || bed.internal_brix !== null;
    })
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 8);

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(0 0% 5%), hsl(0 0% 7%))',
        border: '1px solid hsl(0 0% 15%)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Broadcast Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: 'linear-gradient(90deg, hsl(0 60% 15%), hsl(0 50% 10%))',
          borderBottom: '1px solid hsl(0 40% 25%)',
        }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Radio className="w-4 h-4" style={{ color: 'hsl(0 70% 55%)' }} />
          </motion.div>
          <span
            className="font-mono text-xs tracking-[0.2em] font-bold"
            style={{ color: 'hsl(0 60% 65%)' }}
          >
            LIVE FEED
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: 'hsl(0 70% 50%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-mono text-[10px]" style={{ color: 'hsl(0 40% 50%)' }}>
            ON AIR
          </span>
        </div>
      </div>

      {/* Feed Items */}
      <div className="divide-y" style={{ borderColor: 'hsl(0 0% 12%)' }}>
        <AnimatePresence>
          {activeBeds.length === 0 ? (
            <EmptyFeed />
          ) : (
            activeBeds.map((bed, i) => (
              <FeedItem
                key={bed.id}
                bed={bed}
                plantings={bedPlantingsMap[bed.id] || []}
                index={i}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 flex items-center justify-center gap-2"
        style={{ background: 'hsl(0 0% 4%)' }}
      >
        <Waves className="w-3 h-3" style={{ color: 'hsl(0 0% 30%)' }} />
        <span className="font-mono text-[9px] tracking-wider" style={{ color: 'hsl(0 0% 30%)' }}>
          {activeBeds.length} STATION{activeBeds.length !== 1 ? 'S' : ''} BROADCASTING
        </span>
      </div>
    </motion.div>
  );
};

/** Single feed entry — one bed broadcasting */
const FeedItem = ({ bed, plantings, index }: { bed: BedWithAerial; plantings: BedPlanting[]; index: number }) => {
  const note = NOTE_MAP[bed.frequency_hz] || '?';
  const signal = getSignalStrength(bed.internal_brix);
  const { days, cropName } = getHarvestCountdown(plantings);

  return (
    <motion.div
      className="px-4 py-3 flex gap-3"
      style={{ background: index % 2 === 0 ? 'transparent' : 'hsl(0 0% 4% / 0.5)' }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      {/* Frequency Dial */}
      <div
        className="w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0"
        style={{
          background: `linear-gradient(135deg, ${bed.zone_color}30, ${bed.zone_color}10)`,
          border: `1px solid ${bed.zone_color}60`,
        }}
      >
        <span className="text-xs font-bold font-mono" style={{ color: bed.zone_color }}>
          {bed.bed_number}
        </span>
        <span className="text-[8px] font-mono" style={{ color: `${bed.zone_color}90` }}>
          {note}
        </span>
      </div>

      {/* Broadcast Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs leading-relaxed" style={{ color: 'hsl(0 0% 75%)' }}>
          <span className="font-bold" style={{ color: bed.zone_color }}>
            Bed {bed.bed_number}
          </span>{' '}
          is currently playing in{' '}
          <span className="font-bold" style={{ color: bed.zone_color }}>
            {note} ({bed.frequency_hz}Hz)
          </span>
          .{' '}
          {bed.internal_brix !== null && (
            <>
              Signal is{' '}
              <span className="font-bold" style={{ color: signal.color }}>
                {signal.label}
              </span>
              —Brix at{' '}
              <span className="font-bold" style={{ color: signal.color }}>
                {bed.internal_brix}°
              </span>
              .{' '}
            </>
          )}
          {cropName && (
            <>
              {days !== null ? (
                <>
                  This track will be ready for{' '}
                  <span style={{ color: 'hsl(45 70% 60%)' }}>harvest/download</span> in{' '}
                  <span className="font-bold" style={{ color: 'hsl(45 90% 65%)' }}>
                    {days} day{days !== 1 ? 's' : ''}
                  </span>
                  .
                </>
              ) : (
                <>
                  Now playing:{' '}
                  <span className="font-italic" style={{ color: 'hsl(45 60% 60%)' }}>
                    {cropName}
                  </span>
                  .
                </>
              )}
            </>
          )}
          {plantings.length === 0 && bed.internal_brix === null && (
            <span style={{ color: 'hsl(0 0% 40%)' }}>Tuning...</span>
          )}
        </p>

        {/* Signal Bars */}
        {bed.internal_brix !== null && (
          <div className="flex items-center gap-1 mt-1.5">
            <Signal className="w-3 h-3" style={{ color: signal.color }} />
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(bar => (
                <motion.div
                  key={bar}
                  className="w-1 rounded-sm"
                  style={{
                    height: 4 + bar * 2,
                    background: bar <= signal.bars ? signal.color : 'hsl(0 0% 18%)',
                  }}
                  animate={
                    bar <= signal.bars
                      ? { opacity: [0.7, 1, 0.7] }
                      : {}
                  }
                  transition={{ duration: 2, delay: bar * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
            {days !== null && (
              <div className="flex items-center gap-1 ml-auto">
                <Clock className="w-3 h-3" style={{ color: 'hsl(0 0% 40%)' }} />
                <span className="font-mono text-[10px]" style={{ color: 'hsl(0 0% 45%)' }}>
                  {days}d
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/** Empty state when no beds are broadcasting */
const EmptyFeed = () => (
  <div className="px-4 py-8 text-center">
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      className="inline-block mb-3"
    >
      <Disc className="w-8 h-8" style={{ color: 'hsl(0 0% 25%)' }} />
    </motion.div>
    <p className="font-mono text-xs" style={{ color: 'hsl(0 0% 35%)' }}>
      No stations broadcasting yet.
    </p>
    <p className="font-mono text-[10px] mt-1" style={{ color: 'hsl(0 0% 25%)' }}>
      Plant a bed to start the signal.
    </p>
  </div>
);

export default LiveFeed;
