import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ruler, RefreshCw, CheckCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE DYNAMIC SOIL CALCULATOR (Silent Engine Protocol)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PHILOSOPHY: Radical Efficiency. Input → Output is immediate.
 * 
 * MECHANISM: Reactive slider interface
 * 
 * INPUT:
 *   - Bed Width: Range 2ft – 10ft (Default: 2.5ft)
 *   - Bed Length: Range 5ft – 100ft (Default: 60ft)
 * 
 * THE MATH (Hidden):
 *   - Total Area = Width × Length
 *   - Scaling Factor = Total Area / 150 sq ft
 * 
 * OUTPUT (Instant):
 *   Master Mix Protocol × Scaling Factor
 *   Unit Logic: If result < 1 Quart → auto-convert to Cups
 */

// Base reference: 60 ft × 2.5 ft = 150 sq ft
const BASE_AREA_SQ_FT = 150;

// Storage key for persistence
const STORAGE_KEY_BED_RESETS = 'pharmer-bed-reset-count';

// THE MASTER MIX PROTOCOL (8 Components)
interface MixComponent {
  id: string;
  name: string;
  role: 'VISION' | 'ALCHEMY' | 'ANCHOR' | 'STRUCTURE' | 'BRIDGE' | 'SHELTER';
  baseQuarts: number;
  roleColor: string;
  frequencyBoost?: number[]; // Hz values that double this component
}

const MASTER_MIX_PROTOCOL: MixComponent[] = [
  { id: 'promix', name: 'Pro-Mix (Peat Base)', role: 'VISION', baseQuarts: 5, roleColor: 'hsl(270 50% 55%)' },
  { id: 'alfalfa', name: 'Alfalfa Meal', role: 'ALCHEMY', baseQuarts: 2, roleColor: 'hsl(45 70% 55%)', frequencyBoost: [528] },
  { id: 'soybean', name: 'Soybean Meal', role: 'ALCHEMY', baseQuarts: 1, roleColor: 'hsl(45 70% 55%)', frequencyBoost: [528] },
  { id: 'kelp', name: 'Kelp Meal', role: 'ANCHOR', baseQuarts: 1, roleColor: 'hsl(180 50% 50%)', frequencyBoost: [396] },
  { id: 'seamineral', name: 'Sea Minerals', role: 'ANCHOR', baseQuarts: 0.5, roleColor: 'hsl(180 50% 50%)', frequencyBoost: [396] },
  { id: 'harmony', name: 'Harmony Calcium', role: 'STRUCTURE', baseQuarts: 1, roleColor: 'hsl(0 0% 70%)', frequencyBoost: [639] },
  { id: 'wormcast', name: 'Worm Castings', role: 'BRIDGE', baseQuarts: 1, roleColor: 'hsl(35 60% 50%)' },
  { id: 'humates', name: 'Humates', role: 'SHELTER', baseQuarts: 1, roleColor: 'hsl(25 40% 40%)', frequencyBoost: [417] },
];

// Frequency-specific soil protocols
const FREQUENCY_PROTOCOLS: Record<number, { name: string; color: string; focus: string }> = {
  396: { name: 'ROOT', color: 'hsl(0 60% 50%)', focus: '2× Kelp & Sea Minerals' },
  417: { name: 'VINE', color: 'hsl(30 70% 50%)', focus: '2× Humates for moisture' },
  528: { name: 'SOLAR', color: 'hsl(51 80% 50%)', focus: '2× Alfalfa & Soybean for N' },
  639: { name: 'HEART', color: 'hsl(120 50% 45%)', focus: '2× Harmony Calcium' },
  741: { name: 'THROAT', color: 'hsl(210 60% 50%)', focus: 'Standard Mix' },
  852: { name: 'VISION', color: 'hsl(270 50% 50%)', focus: 'Standard Mix' },
  963: { name: 'SOURCE', color: 'hsl(300 50% 50%)', focus: 'Standard Mix' },
};

// Unit conversion logic
const formatQuantity = (quarts: number): string => {
  // UNIT LOGIC: If result < 1 Quart → auto-convert to Cups
  if (quarts < 1) {
    const cups = Math.round(quarts * 4 * 10) / 10;
    return `${cups} ${cups === 1 ? 'cup' : 'cups'}`;
  }
  const rounded = Math.round(quarts * 10) / 10;
  return `${rounded} ${rounded === 1 ? 'quart' : 'quarts'}`;
};

const DynamicSoilEngine = () => {
  // INPUT STATE (with spec defaults)
  const [bedWidth, setBedWidth] = useState(2.5);   // Default: 2.5ft
  const [bedLength, setBedLength] = useState(60);  // Default: 60ft
  const [selectedHz, setSelectedHz] = useState<number | null>(null);
  
  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // THE MATH (Hidden but reactive)
  const { currentArea, scaleFactor } = useMemo(() => {
    const area = bedWidth * bedLength;
    return {
      currentArea: Math.round(area * 10) / 10,
      scaleFactor: area / BASE_AREA_SQ_FT,
    };
  }, [bedWidth, bedLength]);

  // OUTPUT: Scaled quantities with frequency boost
  const scaledProtocol = useMemo(() => {
    return MASTER_MIX_PROTOCOL.map(item => {
      const isBoosted = selectedHz && item.frequencyBoost?.includes(selectedHz);
      const baseAmount = isBoosted ? item.baseQuarts * 2 : item.baseQuarts;
      const scaled = baseAmount * scaleFactor;
      return {
        ...item,
        scaledQuarts: scaled,
        display: formatQuantity(scaled),
        isBoosted,
      };
    });
  }, [scaleFactor, selectedHz]);

  // Toggle check
  const toggleCheck = (id: string) => {
    const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newChecked);
    
    // Track completions
    if (Object.values(newChecked).filter(Boolean).length === MASTER_MIX_PROTOCOL.length) {
      const current = parseInt(localStorage.getItem(STORAGE_KEY_BED_RESETS) || '0', 10);
      localStorage.setItem(STORAGE_KEY_BED_RESETS, (current + 1).toString());
    }
  };

  const resetChecklist = () => setCheckedItems({});
  
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const isComplete = checkedCount === MASTER_MIX_PROTOCOL.length;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(35 25% 10%)',
        border: '2px solid hsl(35 50% 35%)',
      }}
    >
      {/* Header - Minimal */}
      <div
        className="p-4"
        style={{
          background: 'linear-gradient(135deg, hsl(35 40% 18%), hsl(35 35% 12%))',
          borderBottom: '1px solid hsl(35 40% 30%)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg tracking-wider"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(35 70% 65%)',
            }}
          >
            SOIL CALCULATOR
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={resetChecklist}
            className="text-xs font-mono"
            style={{
              background: 'transparent',
              border: '1px solid hsl(0 0% 30%)',
              color: 'hsl(0 0% 60%)',
            }}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>

        {/* INPUT: Reactive Sliders */}
        <div
          className="p-4 rounded-lg space-y-4"
          style={{
            background: 'hsl(35 30% 12%)',
            border: '1px solid hsl(35 40% 25%)',
          }}
        >
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4" style={{ color: 'hsl(35 60% 55%)' }} />
            <span
              className="text-xs font-mono tracking-widest"
              style={{ color: 'hsl(35 50% 60%)' }}
            >
              INPUT
            </span>
          </div>

          {/* Width Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono" style={{ color: 'hsl(0 0% 55%)' }}>Width</span>
              <span
                className="text-lg font-mono font-bold px-2 py-0.5 rounded"
                style={{ background: 'hsl(51 50% 15%)', color: 'hsl(51 80% 60%)' }}
              >
                {bedWidth}ft
              </span>
            </div>
            <Slider
              value={[bedWidth]}
              onValueChange={([val]) => setBedWidth(val)}
              min={2}
              max={10}
              step={0.5}
            />
          </div>

          {/* Length Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono" style={{ color: 'hsl(0 0% 55%)' }}>Length</span>
              <span
                className="text-lg font-mono font-bold px-2 py-0.5 rounded"
                style={{ background: 'hsl(51 50% 15%)', color: 'hsl(51 80% 60%)' }}
              >
                {bedLength}ft
              </span>
            </div>
            <Slider
              value={[bedLength]}
              onValueChange={([val]) => setBedLength(val)}
              min={5}
              max={100}
              step={5}
            />
          </div>

          {/* Hidden Math → Visible Result */}
          <div
            className="grid grid-cols-2 gap-2 pt-2"
            style={{ borderTop: '1px solid hsl(35 30% 20%)' }}
          >
            <div className="text-center py-2 rounded" style={{ background: 'hsl(120 20% 12%)' }}>
              <span className="text-[10px] font-mono block" style={{ color: 'hsl(0 0% 50%)' }}>AREA</span>
              <span className="text-lg font-mono font-bold" style={{ color: 'hsl(120 50% 60%)' }}>
                {currentArea} sq ft
              </span>
            </div>
            <div className="text-center py-2 rounded" style={{ background: 'hsl(51 20% 12%)' }}>
              <span className="text-[10px] font-mono block" style={{ color: 'hsl(0 0% 50%)' }}>SCALE</span>
              <span
                className="text-lg font-mono font-bold"
                style={{ color: scaleFactor === 1 ? 'hsl(0 0% 60%)' : 'hsl(51 70% 55%)' }}
              >
                {scaleFactor === 1 ? '1×' : `${(Math.round(scaleFactor * 100) / 100)}×`}
              </span>
            </div>
          </div>
        </div>
        
        {/* Frequency Selector for Zone-Specific Boost */}
        <div
          className="mt-4 p-3 rounded-lg"
          style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-widest" style={{ color: 'hsl(0 0% 50%)' }}>
              ZONE BOOST (Optional)
            </span>
            {selectedHz && (
              <button
                onClick={() => setSelectedHz(null)}
                className="text-[9px] font-mono px-2 py-0.5 rounded"
                style={{ background: 'hsl(0 0% 15%)', color: 'hsl(0 0% 55%)' }}
              >
                CLEAR
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(FREQUENCY_PROTOCOLS).map(([hz, protocol]) => {
              const hzNum = parseInt(hz);
              const isSelected = selectedHz === hzNum;
              return (
                <button
                  key={hz}
                  onClick={() => setSelectedHz(isSelected ? null : hzNum)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono"
                  style={{
                    background: isSelected ? `${protocol.color}25` : 'hsl(0 0% 12%)',
                    border: `1px solid ${isSelected ? protocol.color : 'hsl(0 0% 22%)'}`,
                    color: isSelected ? protocol.color : 'hsl(0 0% 50%)',
                  }}
                >
                  {protocol.name}
                </button>
              );
            })}
          </div>
          {selectedHz && FREQUENCY_PROTOCOLS[selectedHz] && (
            <div
              className="mt-2 p-2 rounded"
              style={{
                background: `${FREQUENCY_PROTOCOLS[selectedHz].color}15`,
                border: `1px solid ${FREQUENCY_PROTOCOLS[selectedHz].color}40`,
              }}
            >
              <span className="text-[10px] font-mono" style={{ color: FREQUENCY_PROTOCOLS[selectedHz].color }}>
                {FREQUENCY_PROTOCOLS[selectedHz].focus}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* OUTPUT: Master Mix Protocol (Instant) */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(35 60% 60%)' }}>
            OUTPUT: MASTER MIX {selectedHz && `(${selectedHz}Hz)`}
          </span>
          <LearnMoreButton wisdomKey="ingham-soil-food-web" size="sm" />
        </div>

        <div className="space-y-1.5">
          {scaledProtocol.map((item) => {
            const isChecked = checkedItems[item.id];
            return (
              <motion.button
                key={item.id}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left"
                style={{
                  background: isChecked ? 'hsl(120 30% 15%)' : item.isBoosted ? 'hsl(45 30% 12%)' : 'hsl(0 0% 10%)',
                  border: `1px solid ${isChecked ? 'hsl(120 50% 40%)' : item.isBoosted ? 'hsl(45 60% 40%)' : 'hsl(0 0% 18%)'}`,
                }}
                onClick={() => toggleCheck(item.id)}
                whileTap={{ scale: 0.98 }}
              >
                {/* Check Circle */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: isChecked ? 'hsl(120 50% 40%)' : 'hsl(0 0% 18%)',
                    border: `2px solid ${isChecked ? 'hsl(120 60% 50%)' : 'hsl(0 0% 28%)'}`,
                  }}
                >
                  {isChecked && <CheckCircle className="w-3 h-3 text-white" />}
                </div>

                {/* Role Badge */}
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: `${item.roleColor}20`,
                    color: item.roleColor,
                    border: `1px solid ${item.roleColor}40`,
                  }}
                >
                  {item.role}
                </span>

                {/* Name */}
                <div className="flex-1 flex items-center gap-1.5 min-w-0">
                  <span
                    className="text-sm font-mono truncate"
                    style={{
                      color: isChecked ? 'hsl(120 50% 65%)' : item.isBoosted ? 'hsl(45 70% 65%)' : 'hsl(35 50% 70%)',
                      textDecoration: isChecked ? 'line-through' : 'none',
                    }}
                  >
                    {item.name}
                  </span>
                  {item.isBoosted && (
                    <span
                      className="text-[8px] font-mono font-bold px-1 py-0.5 rounded shrink-0"
                      style={{ background: 'hsl(45 60% 30%)', color: 'hsl(45 80% 70%)' }}
                    >
                      2×
                    </span>
                  )}
                </div>

                {/* Quantity - THE OUTPUT */}
                <span
                  className="text-sm font-mono font-bold px-2 py-0.5 rounded shrink-0"
                  style={{
                    background: item.isBoosted ? 'hsl(45 50% 18%)' : 'hsl(51 50% 15%)',
                    color: item.isBoosted ? 'hsl(45 80% 65%)' : 'hsl(51 80% 60%)',
                    border: `1px solid ${item.isBoosted ? 'hsl(45 60% 40%)' : 'hsl(51 50% 30%)'}`,
                  }}
                >
                  {item.display}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'hsl(0 0% 15%)' }}>
            <motion.div
              className="h-full"
              style={{
                background: isComplete ? 'hsl(120 50% 45%)' : 'linear-gradient(90deg, hsl(35 70% 50%), hsl(120 50% 45%))',
              }}
              animate={{ width: `${(checkedCount / MASTER_MIX_PROTOCOL.length) * 100}%` }}
            />
          </div>
          <p
            className="text-[10px] font-mono text-center mt-1.5"
            style={{ color: isComplete ? 'hsl(120 50% 60%)' : 'hsl(0 0% 50%)' }}
          >
            {isComplete ? '✓ BED RESET COMPLETE' : `${checkedCount}/${MASTER_MIX_PROTOCOL.length}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DynamicSoilEngine;
