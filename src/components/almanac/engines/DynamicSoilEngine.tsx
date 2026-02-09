import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ruler, RefreshCw, CheckCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useSoilAmendments } from '@/hooks/useMasterCrops';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE DYNAMIC SOIL ENGINE (BED RESET)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * GOAL: Eliminate mental math. Pure Input → Calculation → Output.
 * 
 * LOGIC:
 * 1. INPUT: User sets Bed Width (ft) and Bed Length (ft)
 * 2. CALCULATION: Area / 150 sq ft = Scaling Factor
 * 3. OUTPUT: Master Mix Protocol × Scaling Factor (instant)
 * 
 * CONSTRAINT: If result < 1 Quart → convert to Cups (1 quart = 4 cups)
 */

// Base reference: 60 ft x 2.5 ft = 150 sq ft
const BASE_AREA_SQ_FT = 150;

// Storage key for persistence
const STORAGE_KEY_BED_RESETS = 'pharmer-bed-reset-count';

// Master Mix Protocol (Parts-based for scaling)
interface MixComponent {
  id: string;
  name: string;
  role: string;
  baseQuarts: number; // Base quantity for 150 sq ft
}

const MASTER_MIX_PROTOCOL: MixComponent[] = [
  { id: 'promix', name: 'Pro-Mix (Peat Base)', role: 'VISION', baseQuarts: 5 },
  { id: 'alfalfa', name: 'Alfalfa Meal', role: 'ALCHEMY', baseQuarts: 2 },
  { id: 'soybean', name: 'Soybean Meal', role: 'ALCHEMY', baseQuarts: 1 },
  { id: 'kelp', name: 'Kelp Meal', role: 'ANCHOR', baseQuarts: 1 },
  { id: 'seamineral', name: 'Sea Minerals', role: 'ANCHOR', baseQuarts: 0.5 },
  { id: 'harmony', name: 'Harmony Calcium', role: 'STRUCTURE', baseQuarts: 1 },
  { id: 'wormcast', name: 'Worm Castings', role: 'BRIDGE', baseQuarts: 1 },
];

// Parse quantity from database and scale
const parseAndScale = (quantityStr: string, scaleFactor: number): { value: number; unit: string } => {
  const match = quantityStr.match(/^([\d.]+)\s*(.*)$/i);
  if (!match) return { value: 1 * scaleFactor, unit: 'quarts' };
  
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase().trim();
  const isQuarts = unit.includes('quart');
  const isCups = unit.includes('cup');
  
  let scaledQuarts = value * scaleFactor;
  if (isCups) scaledQuarts = (value / 4) * scaleFactor;
  
  // CONSTRAINT: Convert to cups if < 1 quart
  if (scaledQuarts < 1) {
    return { value: Math.round(scaledQuarts * 4 * 10) / 10, unit: 'cups' };
  }
  return { value: Math.round(scaledQuarts * 10) / 10, unit: 'quarts' };
};

// Format output with smart unit display
const formatQuantity = (value: number, unit: string): string => {
  const singular = unit.replace(/s$/, '');
  return `${value} ${value === 1 ? singular : unit}`;
};

const DynamicSoilEngine = () => {
  const { data: amendments, isLoading } = useSoilAmendments();
  
  // INPUT STATE
  const [bedWidth, setBedWidth] = useState(2.5);
  const [bedLength, setBedLength] = useState(60);
  
  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  // CALCULATION: Scaling Factor
  const { currentArea, scaleFactor, scalePercent } = useMemo(() => {
    const area = bedWidth * bedLength;
    const factor = area / BASE_AREA_SQ_FT;
    return {
      currentArea: Math.round(area * 10) / 10,
      scaleFactor: factor,
      scalePercent: Math.round(factor * 100),
    };
  }, [bedWidth, bedLength]);

  // Handle check toggle
  const toggleCheck = (id: string) => {
    const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newChecked);
    
    // Track bed reset completions
    if (amendments && Object.values(newChecked).filter(Boolean).length === amendments.length) {
      const current = parseInt(localStorage.getItem(STORAGE_KEY_BED_RESETS) || '0', 10);
      localStorage.setItem(STORAGE_KEY_BED_RESETS, (current + 1).toString());
    }
  };

  const resetChecklist = () => setCheckedItems({});
  
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalItems = amendments?.length || 0;
  const isComplete = checkedCount === totalItems && totalItems > 0;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(35 25% 10%)',
        border: '2px solid hsl(35 50% 35%)',
      }}
    >
      {/* Header */}
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
            🌱 DYNAMIC SOIL ENGINE
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
            Clear
          </Button>
        </div>

        {/* INPUT PANEL: Bed Dimensions */}
        <div
          className="p-4 rounded-lg space-y-4"
          style={{
            background: 'hsl(35 30% 12%)',
            border: '1px solid hsl(35 40% 25%)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="w-5 h-5" style={{ color: 'hsl(35 60% 55%)' }} />
            <span
              className="text-sm font-mono tracking-widest font-bold"
              style={{ color: 'hsl(35 50% 60%)' }}
            >
              INPUT: BED DIMENSIONS
            </span>
          </div>

          {/* Width Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'hsl(0 0% 55%)' }}>
                Width
              </span>
              <span
                className="text-lg font-mono font-bold px-3 py-1 rounded"
                style={{ 
                  background: 'hsl(51 50% 15%)',
                  color: 'hsl(51 80% 60%)',
                  border: '1px solid hsl(51 50% 30%)',
                }}
              >
                {bedWidth} ft
              </span>
            </div>
            <Slider
              value={[bedWidth]}
              onValueChange={([val]) => setBedWidth(val)}
              min={2}
              max={10}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
              <span>2 ft</span>
              <span>10 ft</span>
            </div>
          </div>

          {/* Length Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'hsl(0 0% 55%)' }}>
                Length
              </span>
              <span
                className="text-lg font-mono font-bold px-3 py-1 rounded"
                style={{ 
                  background: 'hsl(51 50% 15%)',
                  color: 'hsl(51 80% 60%)',
                  border: '1px solid hsl(51 50% 30%)',
                }}
              >
                {bedLength} ft
              </span>
            </div>
            <Slider
              value={[bedLength]}
              onValueChange={([val]) => setBedLength(val)}
              min={5}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
              <span>5 ft</span>
              <span>100 ft</span>
            </div>
          </div>

          {/* CALCULATION DISPLAY */}
          <div
            className="grid grid-cols-2 gap-3 mt-4"
            style={{
              background: 'hsl(120 20% 10%)',
              border: '2px solid hsl(120 30% 25%)',
              borderRadius: '8px',
              padding: '12px',
            }}
          >
            <div className="text-center">
              <span className="text-[10px] font-mono block uppercase tracking-wider" style={{ color: 'hsl(0 0% 50%)' }}>
                Total Area
              </span>
              <span className="text-xl font-mono font-bold" style={{ color: 'hsl(120 50% 60%)' }}>
                {currentArea} sq ft
              </span>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-mono block uppercase tracking-wider" style={{ color: 'hsl(0 0% 50%)' }}>
                Scale Factor
              </span>
              <span
                className="text-xl font-mono font-bold"
                style={{
                  color: scaleFactor === 1 
                    ? 'hsl(0 0% 60%)' 
                    : scaleFactor > 1 
                    ? 'hsl(51 70% 55%)' 
                    : 'hsl(195 60% 60%)',
                }}
              >
                {scaleFactor === 1 ? '1× (base)' : `${(Math.round(scaleFactor * 100) / 100)}×`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* OUTPUT: Scaled Recipe */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-sm font-mono tracking-widest font-bold"
            style={{ color: 'hsl(35 60% 60%)' }}
          >
            OUTPUT: MASTER MIX PROTOCOL
          </span>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <span className="text-sm font-mono" style={{ color: 'hsl(35 40% 50%)' }}>
              Loading protocol...
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {amendments?.map((amendment) => {
              const { value, unit } = parseAndScale(amendment.quantity_per_60ft, scaleFactor);
              const isChecked = checkedItems[amendment.id];
              
              return (
                <motion.button
                  key={amendment.id}
                  className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left"
                  style={{
                    background: isChecked ? 'hsl(120 30% 15%)' : 'hsl(0 0% 10%)',
                    border: `2px solid ${isChecked ? 'hsl(120 50% 40%)' : 'hsl(0 0% 20%)'}`,
                  }}
                  onClick={() => toggleCheck(amendment.id)}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Checkbox */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isChecked ? 'hsl(120 50% 40%)' : 'hsl(0 0% 20%)',
                      border: `2px solid ${isChecked ? 'hsl(120 60% 50%)' : 'hsl(0 0% 30%)'}`,
                    }}
                  >
                    {isChecked && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  
                  {/* Amendment Name */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="font-mono text-sm block truncate"
                      style={{
                        color: isChecked ? 'hsl(120 50% 65%)' : 'hsl(35 50% 70%)',
                        textDecoration: isChecked ? 'line-through' : 'none',
                      }}
                    >
                      {amendment.name}
                    </span>
                  </div>
                  
                  {/* Scaled Quantity - THE OUTPUT */}
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-mono font-bold shrink-0 px-2 py-1 rounded"
                      style={{ 
                        background: 'hsl(51 50% 15%)',
                        color: 'hsl(51 80% 60%)',
                        border: '1px solid hsl(51 50% 30%)',
                        minWidth: '80px',
                        textAlign: 'center',
                      }}
                    >
                      {formatQuantity(value, unit)}
                    </span>
                    <LearnMoreButton wisdomKey="ingham-soil-food-web" size="sm" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
        
        {/* Progress Bar */}
        {totalItems > 0 && (
          <div className="mt-4">
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: 'hsl(0 0% 15%)' }}
            >
              <motion.div
                className="h-full"
                style={{ 
                  background: isComplete 
                    ? 'hsl(120 50% 45%)' 
                    : 'linear-gradient(90deg, hsl(35 70% 50%), hsl(120 50% 45%))',
                }}
                animate={{ width: `${(checkedCount / totalItems) * 100}%` }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </div>
            <p
              className="text-xs font-mono text-center mt-2"
              style={{ color: isComplete ? 'hsl(120 50% 60%)' : 'hsl(0 0% 50%)' }}
            >
              {isComplete ? '✓ BED RESET COMPLETE' : `${checkedCount} of ${totalItems} ingredients`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicSoilEngine;
