import { motion } from 'framer-motion';
import { Ruler, Maximize, Grid3X3, TrendingUp } from 'lucide-react';
import type { MasterCrop } from '@/hooks/useMasterCrops';

/* ─── Bed Organization Card ───
   Calculates high-density planting layout for a 60-foot bed
   based on spacing, companion guild, and chord interval role.
─── */

// Dimensions now come from props (defaults preserved for standalone use)
const DEFAULT_BED_LENGTH_FT = 60;
const DEFAULT_BED_WIDTH_FT = 4;

interface PlantingLayout {
  plantsPerRow: number;
  rows: number;
  totalPlants: number;
  inRowSpacing: string;
  betweenRowSpacing: string;
  pattern: 'single-row' | 'double-row' | 'staggered' | 'broadcast' | 'triple-row';
  density: 'high' | 'standard' | 'wide';
  tip: string;
}

function calculateLayout(crop: MasterCrop, bedLengthFt: number, bedWidthFt: number): PlantingLayout {
  const spacingStr = crop.spacing_inches || '12';
  const spacing = parseInt(spacingStr) || 12;
  const interval = crop.chord_interval || '';

  // Determine pattern based on spacing and role
  let pattern: PlantingLayout['pattern'] = 'staggered';
  let rowMultiplier = 1;
  let density: PlantingLayout['density'] = 'standard';
  let tip = '';

  if (spacing <= 4) {
    pattern = 'broadcast';
    density = 'high';
    const plantsPerSqFt = Math.floor(144 / (spacing * spacing));
    const totalSqFt = bedLengthFt * bedWidthFt;
    tip = `Scatter-sow across full bed surface. Thin to ${spacing}" apart as seedlings emerge for maximum canopy coverage.`;
    return {
      plantsPerRow: plantsPerSqFt,
      rows: Math.round(bedWidthFt),
      totalPlants: plantsPerSqFt * totalSqFt,
      inRowSpacing: `${spacing}"`,
      betweenRowSpacing: `${spacing}"`,
      pattern,
      density,
      tip,
    };
  }

  if (spacing <= 8) {
    pattern = 'triple-row';
    density = 'high';
    rowMultiplier = Math.min(3, Math.floor((bedWidthFt * 12) / spacing));
    tip = `Plant ${rowMultiplier} staggered rows across the ${bedWidthFt}ft bed width. Offset every other plant by ${Math.floor(spacing/2)}" for light penetration and airflow.`;
  } else if (spacing <= 14) {
    pattern = 'staggered';
    density = 'standard';
    rowMultiplier = Math.min(2, Math.floor((bedWidthFt * 12) / spacing));
    tip = `Plant ${rowMultiplier} offset rows. Stagger plants in a zigzag pattern to maximize canopy fill and root zone coverage.`;
  } else if (spacing <= 24) {
    pattern = 'double-row';
    density = 'standard';
    rowMultiplier = Math.min(2, Math.floor((bedWidthFt * 12) / spacing));
    if (rowMultiplier < 1) rowMultiplier = 1;
    tip = `Use ${rowMultiplier === 1 ? 'single' : 'double'} rows with ${spacing}" between plants. Leave center path clear for airflow and harvest access.`;
  } else {
    pattern = 'single-row';
    density = 'wide';
    rowMultiplier = 1;
    tip = `Single center row at ${spacing}" spacing. This crop needs full sun exposure and airflow on all sides.`;
  }

  // 7th (Signal) and 3rd (Triad) crops go on borders
  if (interval.includes('7th') || interval.includes('Signal')) {
    pattern = 'single-row';
    rowMultiplier = 1;
    tip = `Plant as a perimeter border row. Signal crops attract pollinators and mask pest scent — place on bed edges for maximum coverage.`;
  }
  if (interval.includes('5th') || interval.includes('Stabilizer')) {
    tip += ` As a Stabilizer, interplant between Root crops to fix nitrogen and build biomass.`;
  }

  const plantsPerRow = Math.floor((bedLengthFt * 12) / spacing);
  const rows = rowMultiplier;
  const totalPlants = plantsPerRow * rows;
  const betweenRow = Math.floor((bedWidthFt * 12) / (rows + 1));

  return {
    plantsPerRow,
    rows,
    totalPlants,
    inRowSpacing: `${spacing}"`,
    betweenRowSpacing: `${betweenRow}"`,
    pattern,
    density,
    tip,
  };
}

const PATTERN_LABELS: Record<string, { label: string; visual: string }> = {
  'single-row':  { label: 'Single Row (Center)', visual: '· · · · · · · · ·' },
  'double-row':  { label: 'Double Row',          visual: '· · · · ·\n · · · · ·' },
  'triple-row':  { label: 'Triple Stagger',      visual: '· · · · ·\n  · · · ·\n· · · · ·' },
  'staggered':   { label: 'Offset Zigzag',       visual: '· · · · ·\n  · · · ·' },
  'broadcast':   { label: 'Broadcast Scatter',    visual: '· · · · · ·\n· · · · · ·\n· · · · · ·' },
};

const DENSITY_COLORS = {
  high:     { color: 'hsl(140 60% 50%)', bg: 'hsl(140 30% 10%)', label: 'HIGH DENSITY' },
  standard: { color: 'hsl(45 80% 55%)',  bg: 'hsl(45 25% 10%)',  label: 'STANDARD' },
  wide:     { color: 'hsl(210 60% 55%)', bg: 'hsl(210 25% 10%)', label: 'WIDE SPACING' },
};

interface BedOrganizationCardProps {
  crop: MasterCrop;
  zoneColor: string;
  bedLengthFt?: number;
  bedWidthFt?: number;
}

const BedOrganizationCard = ({ crop, zoneColor, bedLengthFt = DEFAULT_BED_LENGTH_FT, bedWidthFt = DEFAULT_BED_WIDTH_FT }: BedOrganizationCardProps) => {
  const layout = calculateLayout(crop, bedLengthFt, bedWidthFt);
  const patternInfo = PATTERN_LABELS[layout.pattern];
  const densityStyle = DENSITY_COLORS[layout.density];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${zoneColor}08, hsl(0 0% 4%))`,
        border: `1px solid ${zoneColor}30`,
      }}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" style={{ color: zoneColor }} />
            <span
              className="text-[10px] font-mono font-bold tracking-wider"
              style={{ color: zoneColor }}
            >
              BED ORGANIZATION — {bedLengthFt}ft × {bedWidthFt}ft
            </span>
          </div>
          <span
            className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded-full"
            style={{
              background: densityStyle.bg,
              color: densityStyle.color,
              border: `1px solid ${densityStyle.color}40`,
            }}
          >
            {densityStyle.label}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <LayoutStat
            icon={<Ruler className="w-3 h-3" />}
            label="IN-ROW"
            value={layout.inRowSpacing}
            color={zoneColor}
          />
          <LayoutStat
            icon={<Maximize className="w-3 h-3" />}
            label="ROW GAP"
            value={layout.betweenRowSpacing}
            color={zoneColor}
          />
          <LayoutStat
            icon={<Grid3X3 className="w-3 h-3" />}
            label="ROWS"
            value={`${layout.rows}`}
            color={zoneColor}
          />
          <LayoutStat
            icon={<TrendingUp className="w-3 h-3" />}
            label="TOTAL"
            value={`${layout.totalPlants}`}
            color="hsl(140 60% 50%)"
          />
        </div>

        {/* Visual pattern */}
        <div
          className="rounded-lg p-3 mb-3"
          style={{
            background: 'hsl(0 0% 3%)',
            border: '1px solid hsl(0 0% 10%)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
              PATTERN: {patternInfo.label.toUpperCase()}
            </span>
            <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
              ↕ {bedWidthFt}ft width
            </span>
          </div>
          {/* Bed cross-section visualization */}
          <div className="relative" style={{ height: 48 }}>
            <div
              className="absolute inset-0 rounded"
              style={{
                background: 'hsl(30 30% 10%)',
                border: '1px solid hsl(30 20% 18%)',
              }}
            />
            {/* Plant dots */}
            {layout.pattern === 'broadcast' ? (
              // Scatter pattern
              Array.from({ length: 18 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    background: zoneColor,
                    boxShadow: `0 0 4px ${zoneColor}60`,
                    left: `${8 + (i % 6) * 16 + (Math.floor(i / 6) % 2 === 0 ? 0 : 8)}%`,
                    top: `${15 + Math.floor(i / 6) * 28}%`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                />
              ))
            ) : (
              // Row-based patterns
              Array.from({ length: layout.rows }).map((_, row) => (
                <div key={row} className="absolute left-0 right-0 flex justify-around px-2" style={{
                  top: `${((row + 1) / (layout.rows + 1)) * 100}%`,
                  transform: 'translateY(-50%)',
                }}>
                  {Array.from({ length: Math.min(12, layout.plantsPerRow) }).map((_, col) => (
                    <motion.div
                      key={col}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: zoneColor,
                        boxShadow: `0 0 4px ${zoneColor}60`,
                        marginLeft: layout.pattern === 'staggered' && row % 2 === 1 ? 4 : 0,
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (row * 12 + col) * 0.02 }}
                    />
                  ))}
                </div>
              ))
            )}
            {/* Bed length label */}
            <span
              className="absolute bottom-0.5 right-1 text-[7px] font-mono"
              style={{ color: 'hsl(0 0% 25%)' }}
            >
              → {bedLengthFt}ft
            </span>
          </div>
        </div>

        {/* Tip */}
        <div
          className="rounded-lg p-2.5"
          style={{
            background: `${zoneColor}08`,
            border: `1px solid ${zoneColor}15`,
          }}
        >
          <div className="flex items-start gap-2">
            <TrendingUp className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: zoneColor }} />
            <p
              className="text-[10px] font-mono leading-relaxed"
              style={{ color: 'hsl(0 0% 55%)' }}
            >
              {layout.tip}
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

const LayoutStat = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <div
    className="rounded-lg p-2 text-center"
    style={{ background: 'hsl(0 0% 5%)', border: '1px solid hsl(0 0% 10%)' }}
  >
    <div className="flex justify-center mb-1">
      <span style={{ color }}>{icon}</span>
    </div>
    <span className="text-[7px] font-mono block" style={{ color: 'hsl(0 0% 35%)' }}>{label}</span>
    <span className="text-xs font-mono font-bold block" style={{ color }}>{value}</span>
  </div>
);

export default BedOrganizationCard;
