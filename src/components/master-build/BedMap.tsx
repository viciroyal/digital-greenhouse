import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map } from 'lucide-react';
import { useGardenBeds, useAllBedPlantings } from '@/hooks/useGardenBeds';
import { HARMONIC_ZONES, getZoneByFrequency } from '@/data/harmonicZoneProtocol';
import BedMapPopup from './BedMapPopup';

/**
 * INTERACTIVE 44-BED MAP — Module 4
 * SVG layout of the 1.1-acre incubator, grouped by 7 frequency zones
 */

// Distribute 44 beds across 7 zones (roughly even, extras to middle zones)
const ZONE_BED_RANGES: { start: number; end: number; hz: number }[] = [
  { start: 1, end: 6, hz: 396 },    // Zone 1: beds 1-6
  { start: 7, end: 12, hz: 417 },    // Zone 2: beds 7-12
  { start: 13, end: 19, hz: 528 },   // Zone 3: beds 13-19
  { start: 20, end: 26, hz: 639 },   // Zone 4: beds 20-26
  { start: 27, end: 32, hz: 741 },   // Zone 5: beds 27-32
  { start: 33, end: 38, hz: 852 },   // Zone 6: beds 33-38
  { start: 39, end: 44, hz: 963 },   // Zone 7: beds 39-44
];

const BedMap = () => {
  const { data: beds = [] } = useGardenBeds();
  const { data: allPlantingsMap = {} } = useAllBedPlantings();
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);

  const selectedBed = beds.find(b => b.id === selectedBedId);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Map className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />
        <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: 'hsl(0 0% 45%)' }}>
          1.1-ACRE INCUBATOR — 44-BED FREQUENCY MAP
        </span>
      </div>

      {/* Muscogee (Creek) Heritage Watermark */}
      <div className="relative">
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none"
          style={{ fontFamily: "'Staatliches', sans-serif", fontSize: '4rem', color: 'hsl(30 40% 50%)' }}
        >
          MUSCOGEE (CREEK) TERRITORY
        </div>

        {/* Zone groups */}
        <div className="space-y-3">
          {ZONE_BED_RANGES.map(({ start, end, hz }) => {
            const zone = getZoneByFrequency(hz);
            if (!zone) return null;

            const zoneBeds = beds.filter(b => b.bed_number >= start && b.bed_number <= end);

            return (
              <div key={hz} className="flex items-stretch gap-2">
                {/* Zone label */}
                <div
                  className="w-20 shrink-0 rounded-lg flex flex-col items-center justify-center py-2"
                  style={{
                    background: zone.colorHsl.replace(')', ' / 0.08)'),
                    border: `1px solid ${zone.colorHsl.replace(')', ' / 0.25)')}`,
                  }}
                >
                  <span className="text-sm font-bold" style={{ fontFamily: "'Staatliches', sans-serif", color: zone.colorHsl }}>
                    {zone.note}
                  </span>
                  <span className="text-[8px] font-mono" style={{ color: zone.colorHsl }}>
                    {zone.frequencyHz}Hz
                  </span>
                  <span className="text-[7px] font-mono mt-0.5" style={{ color: 'hsl(0 0% 40%)' }}>
                    Z{zone.zone}
                  </span>
                </div>

                {/* Bed cells */}
                <div className="flex flex-wrap gap-1.5 flex-1 items-center">
                  {Array.from({ length: end - start + 1 }, (_, i) => {
                    const bedNum = start + i;
                    const bed = zoneBeds.find(b => b.bed_number === bedNum);
                    const plantings = bed ? (allPlantingsMap[bed.id] || []) : [];
                    const hasPlantings = plantings.length > 0;
                    const brix = bed?.internal_brix;

                    // Color intensity based on state
                    let fillOpacity = 0.15;
                    let borderOpacity = 0.3;
                    if (hasPlantings) { fillOpacity = 0.3; borderOpacity = 0.5; }
                    if (brix !== null && brix !== undefined && brix >= 12) { fillOpacity = 0.5; borderOpacity = 0.8; }

                    return (
                      <motion.button
                        key={bedNum}
                        className="relative rounded-md flex flex-col items-center justify-center"
                        style={{
                          width: 48,
                          height: 48,
                          background: zone.colorHsl.replace(')', ` / ${fillOpacity})`),
                          border: `1.5px solid ${zone.colorHsl.replace(')', ` / ${borderOpacity})`)}`,
                          boxShadow: brix !== null && brix !== undefined && brix >= 12
                            ? `0 0 10px ${zone.colorHsl.replace(')', ' / 0.3)')}`
                            : 'none',
                        }}
                        whileHover={{
                          scale: 1.15,
                          boxShadow: `0 0 20px ${zone.colorHsl.replace(')', ' / 0.5)')}`,
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => bed && setSelectedBedId(bed.id)}
                      >
                        <span className="text-xs font-mono font-bold" style={{ color: zone.colorHsl }}>
                          {bedNum}
                        </span>
                        {brix !== null && brix !== undefined && (
                          <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                            {brix}°
                          </span>
                        )}
                        {/* Activity dot */}
                        {hasPlantings && (
                          <div
                            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                            style={{ background: zone.colorHsl, boxShadow: `0 0 6px ${zone.colorHsl}` }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(0 0% 15%)', border: '1px solid hsl(0 0% 30%)' }} />
            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>Empty</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm relative" style={{ background: 'hsl(120 50% 45% / 0.3)', border: '1px solid hsl(120 50% 45% / 0.5)' }}>
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(120 50% 45%)' }} />
            </div>
            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>Planted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(45 70% 50% / 0.5)', border: '1px solid hsl(45 70% 50%)', boxShadow: '0 0 4px hsl(45 70% 50% / 0.3)' }} />
            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>In Tune (12+°)</span>
          </div>
        </div>
      </div>

      {/* Bed Popup */}
      <AnimatePresence>
        {selectedBed && (
          <BedMapPopup
            bed={selectedBed}
            plantings={allPlantingsMap[selectedBed.id] || []}
            onClose={() => setSelectedBedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BedMap;
