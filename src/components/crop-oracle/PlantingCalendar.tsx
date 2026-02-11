import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar } from 'lucide-react';
import { MasterCrop } from '@/hooks/useMasterCrops';

interface PlantingCalendarProps {
  crops: (MasterCrop | null)[];
  labels: string[];
  zoneColor: string;
  hardinessZone: number | null;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SEASON_TO_MONTHS: Record<string, number[]> = {
  spring: [2, 3, 4],       // Mar, Apr, May
  'early spring': [1, 2],  // Feb, Mar
  'late spring': [3, 4],   // Apr, May
  summer: [5, 6, 7],       // Jun, Jul, Aug
  'early summer': [5, 6],  // Jun, Jul
  'late summer': [7, 8],   // Aug, Sep
  fall: [8, 9, 10],        // Sep, Oct, Nov
  'early fall': [8, 9],    // Sep, Oct
  winter: [11, 0, 1],      // Dec, Jan, Feb
  'year-round': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

const PlantingCalendar = ({ crops, labels, zoneColor, hardinessZone }: PlantingCalendarProps) => {
  const [open, setOpen] = useState(true);

  const rows = useMemo(() => {
    return crops
      .map((crop, i) => {
        if (!crop) return null;
        const seasons = crop.planting_season || [];
        const plantMonths = new Set<number>();
        for (const s of seasons) {
          const mapped = SEASON_TO_MONTHS[s.toLowerCase()];
          if (mapped) mapped.forEach(m => plantMonths.add(m));
        }
        // Harvest window: planting months + harvest_days
        const harvestMonths = new Set<number>();
        if (crop.harvest_days) {
          const harvestOffset = Math.round(crop.harvest_days / 30);
          for (const pm of plantMonths) {
            harvestMonths.add((pm + harvestOffset) % 12);
          }
        }
        return {
          name: crop.common_name || crop.name,
          label: labels[i],
          plantMonths,
          harvestMonths,
          harvestDays: crop.harvest_days,
          seasons,
        };
      })
      .filter((r): r is { name: string; label: string; plantMonths: Set<number>; harvestMonths: Set<number>; harvestDays: number | null; seasons: string[] } => r !== null);
  }, [crops, labels]);

  const currentMonth = new Date().getMonth();

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(0 0% 5%)',
        border: '1px solid hsl(0 0% 12%)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center gap-2 text-left"
      >
        <Calendar className="w-4 h-4" style={{ color: `${zoneColor}90` }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: `${zoneColor}bb` }}>
          PLANTING CALENDAR
        </span>
        {hardinessZone && (
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
            background: 'hsl(0 0% 8%)',
            color: 'hsl(0 0% 35%)',
          }}>
            ZONE {hardinessZone}
          </span>
        )}
        <ChevronDown
          className="w-3 h-3 ml-auto transition-transform"
          style={{
            color: 'hsl(0 0% 35%)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3" style={{ borderTop: '1px solid hsl(0 0% 10%)' }}>
              {/* Month header row */}
              <div className="grid gap-px pt-2 pb-1" style={{ gridTemplateColumns: '90px repeat(12, 1fr)' }}>
                <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>CROP</span>
                {MONTHS.map((m, i) => (
                  <span
                    key={m}
                    className="text-[7px] font-mono text-center"
                    style={{
                      color: i === currentMonth ? zoneColor : 'hsl(0 0% 30%)',
                      fontWeight: i === currentMonth ? 'bold' : 'normal',
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>

              {/* Crop rows */}
              {rows.map((row, ri) => (
                <div
                  key={ri}
                  className="grid gap-px py-0.5"
                  style={{ gridTemplateColumns: '90px repeat(12, 1fr)' }}
                >
                  <div className="flex flex-col pr-1">
                    <span className="text-[8px] font-mono truncate" style={{ color: 'hsl(0 0% 55%)' }}>
                      {row.name}
                    </span>
                    <span className="text-[6px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                      {row.label} {row.harvestDays ? `• ${row.harvestDays}d` : ''}
                    </span>
                  </div>
                  {MONTHS.map((_, mi) => {
                    const isPlant = row.plantMonths.has(mi);
                    const isHarvest = row.harvestMonths.has(mi);
                    const isCurrent = mi === currentMonth;
                    return (
                      <div
                        key={mi}
                        className="flex items-center justify-center h-5 rounded-sm"
                        style={{
                          background: isHarvest
                            ? 'hsl(45 80% 40% / 0.2)'
                            : isPlant
                              ? `${zoneColor}15`
                              : isCurrent
                                ? 'hsl(0 0% 8%)'
                                : 'transparent',
                          border: isCurrent ? `1px solid ${zoneColor}30` : '1px solid transparent',
                        }}
                      >
                        {isHarvest ? (
                          <span className="text-[8px]">🌾</span>
                        ) : isPlant ? (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: `${zoneColor}60` }}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Legend */}
              <div className="flex items-center gap-3 mt-2 pt-2" style={{ borderTop: '1px solid hsl(0 0% 8%)' }}>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: `${zoneColor}60` }} />
                  <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>PLANT</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px]">🌾</span>
                  <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>HARVEST</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm" style={{ border: `1px solid ${zoneColor}30`, background: 'hsl(0 0% 8%)' }} />
                  <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>NOW</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlantingCalendar;
