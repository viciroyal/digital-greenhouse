import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sprout, Droplets, Thermometer, Sun, Clock, Leaf, Snowflake, CalendarDays } from 'lucide-react';
import EcoParadigmCard from '@/components/community/EcoParadigmCard';
import GACommunityResources from '@/components/community/GACommunityResources';
import PropagationReadiness from '@/components/crop-oracle/PropagationReadiness';

interface PropagationPanelProps {
  zoneColor: string;
  zoneName: string;
  environment?: string;
  hardinessZone?: number | null;
}

/* ─── Last frost date approximations by USDA zone (month, day) ─── */
const LAST_FROST_BY_ZONE: Record<number, { month: number; day: number; label: string }> = {
  3:  { month: 5, day: 15, label: 'May 15' },
  4:  { month: 5, day: 1,  label: 'May 1' },
  5:  { month: 4, day: 15, label: 'Apr 15' },
  6:  { month: 4, day: 1,  label: 'Apr 1' },
  7:  { month: 3, day: 15, label: 'Mar 15' },
  8:  { month: 3, day: 1,  label: 'Mar 1' },
  9:  { month: 2, day: 15, label: 'Feb 15' },
  10: { month: 1, day: 31, label: 'Jan 31' },
  11: { month: 1, day: 1,  label: 'Year-round' },
  12: { month: 1, day: 1,  label: 'Year-round' },
  13: { month: 1, day: 1,  label: 'Year-round' },
};

/* ─── Seed starting timeline entries (weeks before last frost) ─── */
const SEED_TIMING = [
  { crop: 'Peppers & Eggplant', weeksBefore: 10, icon: '🫑', tray: '50-cell', category: 'warm' },
  { crop: 'Tomatoes', weeksBefore: 8, icon: '🍅', tray: '50-cell', category: 'warm' },
  { crop: 'Broccoli & Cabbage', weeksBefore: 8, icon: '🥦', tray: '72-cell', category: 'cool' },
  { crop: 'Lettuce & Greens', weeksBefore: 6, icon: '🥬', tray: '72-cell', category: 'cool' },
  { crop: 'Squash & Cucumbers', weeksBefore: 4, icon: '🥒', tray: '50-cell', category: 'warm' },
  { crop: 'Herbs (Basil, Cilantro)', weeksBefore: 6, icon: '🌿', tray: '72-cell', category: 'warm' },
  { crop: 'Onions & Leeks', weeksBefore: 12, icon: '🧅', tray: '128-cell', category: 'cool' },
  { crop: 'Flowers & Pollinators', weeksBefore: 8, icon: '🌸', tray: '128-cell', category: 'warm' },
];

const TRAY_SIZES = [
  {
    cells: 50,
    label: '50-Cell',
    cellSize: '2"×2"',
    bestFor: 'Large transplants — tomatoes, peppers, eggplant, squash. Ideal for farm & high tunnel.',
    weeksInTray: '4–6 weeks',
    rootDepth: 'Deep taproot crops',
    icon: '🫑',
  },
  {
    cells: 72,
    label: '72-Cell',
    cellSize: '1.5"×1.5"',
    bestFor: 'Standard transplants — brassicas, herbs, lettuce, chard. Great all-around choice.',
    weeksInTray: '3–5 weeks',
    rootDepth: 'Medium root crops',
    icon: '🥬',
  },
  {
    cells: 128,
    label: '128-Cell',
    cellSize: '1"×1"',
    bestFor: 'Micro starts — onions, leeks, flowers, microgreens. Perfect for containers & windowsills.',
    weeksInTray: '2–4 weeks',
    rootDepth: 'Shallow / fibrous roots',
    icon: '🌿',
  },
];

const PROPAGATION_STEPS = [
  {
    step: 1,
    label: 'FILL & MOISTEN',
    desc: 'Fill trays with OMRI seed-starting mix. Pre-moisten until it holds shape when squeezed — no dripping.',
    icon: <Droplets className="w-3 h-3" />,
    color: 'hsl(200 55% 50%)',
  },
  {
    step: 2,
    label: 'SOW AT DEPTH',
    desc: 'Rule of thumb: plant 2× the seed diameter deep. Tiny seeds (lettuce, basil) surface-sow with light press.',
    icon: <Sprout className="w-3 h-3" />,
    color: 'hsl(120 45% 45%)',
  },
  {
    step: 3,
    label: 'DOME & WARM',
    desc: 'Cover with humidity dome. Keep 70–80°F for warm crops (peppers, tomatoes) or 60–70°F for cool crops (brassicas).',
    icon: <Thermometer className="w-3 h-3" />,
    color: 'hsl(0 50% 55%)',
  },
  {
    step: 4,
    label: 'LIGHT ON EMERGENCE',
    desc: 'Remove dome at first sprout. Provide 14–16hrs light. Keep 2–4" from seedlings to prevent leggy growth.',
    icon: <Sun className="w-3 h-3" />,
    color: 'hsl(45 70% 55%)',
  },
  {
    step: 5,
    label: 'HARDEN OFF',
    desc: '7–10 days before transplant: move trays outside 2hrs/day, increasing daily. Builds wind and UV tolerance.',
    icon: <Leaf className="w-3 h-3" />,
    color: 'hsl(160 45% 45%)',
  },
  {
    step: 6,
    label: 'TRANSPLANT',
    desc: 'Water tray 1hr before. Transplant in evening or overcast day. Bury to first true leaves for tomatoes.',
    icon: <Clock className="w-3 h-3" />,
    color: 'hsl(270 40% 55%)',
  },
];

const SEED_SOURCES = [
  { name: 'Baker Creek Heirloom', type: 'Heirloom / Open-Pollinated', note: 'Non-GMO, rare varieties' },
  { name: 'Johnny\'s Selected Seeds', type: 'Professional / Organic', note: 'Trialed for performance' },
  { name: 'High Mowing Organic', type: '100% Organic', note: 'Northeast-adapted varieties' },
  { name: 'Seed Savers Exchange', type: 'Heritage / Community', note: 'Preservation-focused' },
  { name: 'Southern Exposure', type: 'Regional / Heat-adapted', note: 'Southern climate varieties' },
  { name: 'Local Seed Library', type: 'Community', note: 'Locally-adapted, free exchange' },
];

const PropagationPanel = ({ zoneColor, zoneName, environment, hardinessZone }: PropagationPanelProps) => {
  const [open, setOpen] = useState(true);
  const defaultTray = environment === 'pot' ? 2 : (environment === 'farm' || environment === 'high-tunnel') ? 0 : 1;
  const [selectedTray, setSelectedTray] = useState(defaultTray);

  /* ─── Compute seed starting dates from frost date ─── */
  const frostData = useMemo(() => {
    if (!hardinessZone) return null;
    const baseZone = Math.floor(hardinessZone);
    const frost = LAST_FROST_BY_ZONE[baseZone];
    if (!frost) return null;

    const currentYear = new Date().getFullYear();
    const lastFrostDate = new Date(currentYear, frost.month - 1, frost.day);
    
    const timings = SEED_TIMING.map(entry => {
      const startDate = new Date(lastFrostDate);
      startDate.setDate(startDate.getDate() - entry.weeksBefore * 7);
      const now = new Date();
      const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...entry,
        startDate,
        startLabel: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        daysUntil,
        status: daysUntil < -14 ? 'passed' as const : daysUntil < 0 ? 'now' as const : daysUntil <= 14 ? 'soon' as const : 'upcoming' as const,
      };
    }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    return { frostLabel: frost.label, lastFrostDate, timings };
  }, [hardinessZone]);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(0 0% 5%)',
        border: '1px solid hsl(0 0% 12%)',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center gap-2 text-left"
      >
        <Sprout className="w-4 h-4" style={{ color: `${zoneColor}90` }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: `${zoneColor}bb` }}>
          SEED STARTING & PROPAGATION — {zoneName.toUpperCase()}
        </span>
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
            <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid hsl(0 0% 10%)' }}>

              {/* ─── TRAY SIZE SELECTOR ─── */}
              <div className="pt-3">
                <span className="text-[9px] font-mono tracking-widest block mb-2" style={{ color: 'hsl(0 0% 40%)' }}>
                  SELECT TRAY SIZE
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {TRAY_SIZES.map((tray, i) => {
                    const isActive = selectedTray === i;
                    return (
                      <button
                        key={tray.cells}
                        onClick={() => setSelectedTray(i)}
                        className="p-3 rounded-xl text-left transition-all"
                        style={{
                          background: isActive ? `${zoneColor}12` : 'hsl(0 0% 7%)',
                          border: `1.5px solid ${isActive ? zoneColor : 'hsl(0 0% 15%)'}`,
                          boxShadow: isActive ? `0 0 12px ${zoneColor}15` : 'none',
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-lg">{tray.icon}</span>
                          <span className="text-xs font-mono font-bold" style={{ color: isActive ? zoneColor : 'hsl(0 0% 60%)' }}>
                            {tray.label}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 40%)' }}>
                          {tray.cellSize} cells
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected tray detail */}
                <div
                  className="mt-2 p-3 rounded-lg"
                  style={{ background: `${zoneColor}08`, border: `1px solid ${zoneColor}20` }}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold" style={{ color: zoneColor }}>
                        BEST FOR:
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 65%)' }}>
                        {TRAY_SIZES[selectedTray].bestFor}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" style={{ color: 'hsl(0 0% 40%)' }} />
                        <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 55%)' }}>
                          {TRAY_SIZES[selectedTray].weeksInTray}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sprout className="w-3 h-3" style={{ color: 'hsl(0 0% 40%)' }} />
                        <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 55%)' }}>
                          {TRAY_SIZES[selectedTray].rootDepth}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── SEED STARTING TIMELINE (frost-date based) ─── */}
              {frostData && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Snowflake className="w-3.5 h-3.5" style={{ color: 'hsl(200 70% 65%)' }} />
                    <span className="text-[9px] font-mono tracking-widest" style={{ color: 'hsl(200 60% 60%)' }}>
                      SEED STARTING TIMELINE
                    </span>
                  </div>
                  <div
                    className="p-2.5 rounded-lg mb-2"
                    style={{ background: 'hsl(200 30% 8%)', border: '1px solid hsl(200 30% 18%)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarDays className="w-3 h-3" style={{ color: 'hsl(200 60% 60%)' }} />
                      <span className="text-[9px] font-mono font-bold" style={{ color: 'hsl(200 60% 65%)' }}>
                        Last Frost: ~{frostData.frostLabel}
                      </span>
                      <span className="text-[8px] font-mono ml-auto" style={{ color: 'hsl(0 0% 40%)' }}>
                        Zone {Math.floor(hardinessZone!)}
                      </span>
                    </div>
                    <p className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                      Dates are approximate — check local extension office for precise frost dates.
                    </p>
                  </div>

                  <div className="space-y-1">
                    {frostData.timings.map(t => {
                      const statusColor =
                        t.status === 'now' ? 'hsl(45 80% 55%)' :
                        t.status === 'soon' ? 'hsl(30 70% 55%)' :
                        t.status === 'passed' ? 'hsl(0 0% 35%)' :
                        'hsl(0 0% 50%)';
                      const statusBg =
                        t.status === 'now' ? 'hsl(45 60% 55% / 0.12)' :
                        t.status === 'soon' ? 'hsl(30 50% 50% / 0.08)' :
                        'transparent';
                      const statusLabel =
                        t.status === 'now' ? '🔥 START NOW' :
                        t.status === 'soon' ? '⏳ COMING UP' :
                        t.status === 'passed' ? '⏪ WINDOW PASSED' :
                        `${t.daysUntil}d away`;

                      return (
                        <div
                          key={t.crop}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                          style={{
                            background: statusBg || 'hsl(0 0% 7%)',
                            border: `1px solid ${t.status === 'now' ? 'hsl(45 60% 40%)' : 'hsl(0 0% 12%)'}`,
                            opacity: t.status === 'passed' ? 0.5 : 1,
                          }}
                        >
                          <span className="text-sm shrink-0">{t.icon}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-mono font-bold block" style={{ color: statusColor }}>
                              {t.crop}
                            </span>
                            <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                              {t.weeksBefore}wk before frost · {t.tray}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[9px] font-mono font-bold block" style={{ color: statusColor }}>
                              {t.startLabel}
                            </span>
                            <span className="text-[7px] font-mono" style={{ color: statusColor }}>
                              {statusLabel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!frostData && (
                <div className="p-2.5 rounded-lg" style={{ background: 'hsl(200 20% 8%)', border: '1px solid hsl(200 20% 15%)' }}>
                  <div className="flex items-center gap-2">
                    <Snowflake className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 30%)' }} />
                    <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                      Set your USDA Hardiness Zone above to see personalized seed starting dates
                    </span>
                  </div>
                </div>
              )}

              {/* ─── PROPAGATION STEPS ─── */}
              <div>
                <span className="text-[9px] font-mono tracking-widest block mb-2" style={{ color: 'hsl(0 0% 40%)' }}>
                  PROPAGATION PROTOCOL
                </span>
                <div className="space-y-0">
                  {PROPAGATION_STEPS.map((s, i) => (
                    <div key={s.step} className="flex items-stretch gap-0">
                      <div className="flex flex-col items-center w-7 shrink-0">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `${s.color}25`, color: s.color, border: `1px solid ${s.color}40` }}
                        >
                          {s.icon}
                        </div>
                        {i < PROPAGATION_STEPS.length - 1 && (
                          <div className="w-px flex-1 min-h-[8px]" style={{ background: 'hsl(0 0% 15%)' }} />
                        )}
                      </div>
                      <div className="flex-1 pb-1.5">
                        <div className="px-2 py-1.5 rounded-lg" style={{ background: `${s.color}06`, border: `1px solid ${s.color}15` }}>
                          <span className="text-[9px] font-mono font-bold tracking-wide block" style={{ color: s.color }}>
                            {s.label}
                          </span>
                          <p className="text-[8px] font-mono leading-relaxed mt-0.5" style={{ color: 'hsl(0 0% 50%)' }}>
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── SEED SOURCING ─── */}
              <div>
                <span className="text-[9px] font-mono tracking-widest block mb-2" style={{ color: 'hsl(0 0% 40%)' }}>
                  TRUSTED SEED SOURCES
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {SEED_SOURCES.map(src => (
                    <div
                      key={src.name}
                      className="px-2.5 py-2 rounded-lg"
                      style={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 14%)' }}
                    >
                      <span className="text-[9px] font-mono font-bold block" style={{ color: 'hsl(120 40% 60%)' }}>
                        {src.name}
                      </span>
                      <span className="text-[7px] font-mono block mt-0.5" style={{ color: 'hsl(0 0% 45%)' }}>
                        {src.type}
                      </span>
                      <span className="text-[7px] font-mono block" style={{ color: 'hsl(0 0% 35%)' }}>
                        {src.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── QUICK TIPS ─── */}
              <div className="p-2.5 rounded-lg" style={{ background: 'hsl(45 20% 8%)', border: '1px solid hsl(45 30% 18%)' }}>
                <span className="text-[9px] font-mono tracking-widest block mb-1.5" style={{ color: 'hsl(45 60% 55%)' }}>
                  💡 KEY CONSIDERATIONS
                </span>
                <ul className="space-y-1">
                  {[
                    'Bottom heat mats speed germination 30–50% for warm crops',
                    'Label every tray: variety, date sown, expected transplant date',
                    'Water from below (bottom-watering) to prevent damping-off disease',
                    'Thin to 1 seedling per cell once first true leaves appear',
                    'Feed with dilute fish emulsion (1/4 strength) after 2nd true leaf set',
                    'Keep a propagation journal — track germination rates by variety',
                  ].map((tip, i) => (
                    <li key={i} className="text-[8px] font-mono leading-relaxed flex items-start gap-1.5" style={{ color: 'hsl(0 0% 50%)' }}>
                      <span style={{ color: 'hsl(45 60% 55%)' }}>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ─── READINESS CHECK ─── */}
              <PropagationReadiness zoneColor={zoneColor} />

              {/* ─── ECO-PARADIGM & GA COMMUNITY ─── */}
              <EcoParadigmCard variant="inline" />
              <GACommunityResources variant="compact" />

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropagationPanel;
