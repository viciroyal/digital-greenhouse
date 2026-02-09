import { motion } from 'framer-motion';
import { Sun, Leaf, Snowflake, Radio } from 'lucide-react';
import { HARMONIC_ZONES } from '@/data/harmonicZoneProtocol';

/**
 * SEASONAL MOVEMENTS — Module 5
 * 2026 CSA Movement phases mapped to frequency zones.
 * 
 * Phase 1: The Cool Octave (Apr 3 – May 29) → 396Hz–417Hz (Foundation/Flow)
 * Phase 2: The Solar Peak (June 5 – Aug 7) → 528Hz–741Hz (Alchemy/Signal)
 * Phase 3: The Harvest Signal (Aug 14 – Oct 9) → 852Hz–963Hz (Vision/Source)
 */

export interface CSAPhase {
  id: number;
  name: string;
  dateRange: string;
  startDate: string; // ISO for comparison
  endDate: string;
  frequencyRange: string;
  focusLabel: string;
  zones: number[]; // zone numbers
  icon: typeof Sun;
  gradient: string;
  borderColor: string;
  glowColor: string;
}

export const CSA_PHASES: CSAPhase[] = [
  {
    id: 1,
    name: 'THE COOL OCTAVE',
    dateRange: 'Apr 3 – May 29',
    startDate: '2026-04-03',
    endDate: '2026-05-29',
    frequencyRange: '396Hz – 417Hz',
    focusLabel: 'Foundation / Flow',
    zones: [1, 2],
    icon: Snowflake,
    gradient: 'linear-gradient(135deg, hsl(210 40% 15%), hsl(200 30% 10%))',
    borderColor: 'hsl(210 60% 55%)',
    glowColor: 'hsl(210 60% 55% / 0.3)',
  },
  {
    id: 2,
    name: 'THE SOLAR PEAK',
    dateRange: 'June 5 – Aug 7',
    startDate: '2026-06-05',
    endDate: '2026-08-07',
    frequencyRange: '528Hz – 741Hz',
    focusLabel: 'Alchemy / Signal',
    zones: [3, 4, 5],
    icon: Sun,
    gradient: 'linear-gradient(135deg, hsl(45 50% 18%), hsl(35 40% 12%))',
    borderColor: 'hsl(45 80% 55%)',
    glowColor: 'hsl(45 80% 55% / 0.3)',
  },
  {
    id: 3,
    name: 'THE HARVEST SIGNAL',
    dateRange: 'Aug 14 – Oct 9',
    startDate: '2026-08-14',
    endDate: '2026-10-09',
    frequencyRange: '852Hz – 963Hz',
    focusLabel: 'Vision / Source',
    zones: [6, 7],
    icon: Leaf,
    gradient: 'linear-gradient(135deg, hsl(270 35% 18%), hsl(300 30% 12%))',
    borderColor: 'hsl(270 55% 60%)',
    glowColor: 'hsl(270 55% 60% / 0.3)',
  },
];

/**
 * Get the currently active CSA phase based on today's date
 */
export const getCurrentPhase = (): CSAPhase | null => {
  const today = new Date();
  // Use 2026 dates but compare month/day for demo purposes
  for (const phase of CSA_PHASES) {
    const start = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    // Adjust year to current for comparison
    start.setFullYear(today.getFullYear());
    end.setFullYear(today.getFullYear());
    if (today >= start && today <= end) return phase;
  }
  return null;
};

const SeasonalMovements = () => {
  const activePhase = getCurrentPhase();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />
        <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: 'hsl(0 0% 45%)' }}>
          2026 CSA MOVEMENTS — SEASONAL FREQUENCY MAP
        </span>
      </div>

      <div className="space-y-3">
        {CSA_PHASES.map((phase, i) => {
          const Icon = phase.icon;
          const isActive = activePhase?.id === phase.id;
          const phaseZones = HARMONIC_ZONES.filter(z => phase.zones.includes(z.zone));

          return (
            <motion.div
              key={phase.id}
              className="rounded-lg overflow-hidden relative"
              style={{
                background: phase.gradient,
                border: `2px solid ${isActive ? phase.borderColor : phase.borderColor.replace(')', ' / 0.25)')}`,
                boxShadow: isActive ? `0 0 25px ${phase.glowColor}` : 'none',
                opacity: isActive ? 1 : 0.7,
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: isActive ? 1 : 0.7, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-mono tracking-widest"
                  style={{
                    background: phase.borderColor.replace(')', ' / 0.2)'),
                    border: `1px solid ${phase.borderColor}`,
                    color: phase.borderColor,
                  }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ● NOW ACTIVE
                </motion.div>
              )}

              <div className="p-4 flex items-start gap-4">
                {/* Phase Icon */}
                <motion.div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `${phase.borderColor}20`,
                    border: `1px solid ${phase.borderColor}50`,
                  }}
                  animate={isActive ? {
                    boxShadow: [
                      `0 0 8px ${phase.glowColor}`,
                      `0 0 20px ${phase.glowColor}`,
                      `0 0 8px ${phase.glowColor}`,
                    ],
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Icon className="w-6 h-6" style={{ color: phase.borderColor }} />
                </motion.div>

                <div className="flex-1 min-w-0">
                  {/* Phase name & dates */}
                  <h3
                    className="text-lg tracking-wide mb-0.5"
                    style={{
                      fontFamily: "'Staatliches', sans-serif",
                      color: phase.borderColor,
                      textShadow: isActive ? `0 0 15px ${phase.glowColor}` : 'none',
                    }}
                  >
                    PHASE {phase.id}: {phase.name}
                  </h3>
                  <p className="text-[10px] font-mono mb-2" style={{ color: 'hsl(0 0% 50%)' }}>
                    {phase.dateRange} • {phase.frequencyRange}
                  </p>

                  {/* Focus */}
                  <p className="text-xs font-mono mb-3" style={{ color: 'hsl(0 0% 65%)' }}>
                    Focus: <span style={{ color: phase.borderColor }}>{phase.focusLabel}</span>
                  </p>

                  {/* Zone chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {phaseZones.map(zone => (
                      <div
                        key={zone.zone}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-mono"
                        style={{
                          background: zone.colorHsl.replace(')', ' / 0.12)'),
                          border: `1px solid ${zone.colorHsl.replace(')', ' / 0.35)')}`,
                          color: zone.colorHsl,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: zone.colorHsl }}
                        />
                        {zone.note}/{zone.frequencyHz}Hz — {zone.agroIdentity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* NIR Spectroscopy Note */}
      <div className="mt-4 px-3 py-2 rounded-lg" style={{ background: 'hsl(0 0% 5%)', border: '1px solid hsl(0 0% 12%)' }}>
        <p className="text-[9px] font-mono text-center" style={{ color: 'hsl(0 0% 35%)' }}>
          ALL NUTRIENT DENSITY DATA VALIDATED VIA NIR SPECTROSCOPY • BRIX REFRACTOMETER CALIBRATED
        </p>
      </div>
    </div>
  );
};

export default SeasonalMovements;
