import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Leaf,
  Calculator,
  Heart,
  Scale,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE DISTRIBUTION ENGINE (CSA Logic)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CONCEPT: The farm feeds 30 Families (The Community). The harvest must be
 * divided fairly.
 * 
 * LOGIC:
 * - Share Size = Total Yield / Member Count
 * - If Share Size < 2 lbs → "Scarcity Alert"
 * - Suggest supplementing with Zone 2 (Squash) or Zone 4 (Kale)
 */

// Storage key
const STORAGE_KEY = 'pharmer-csa-distribution';

interface YieldEntry {
  id: string;
  crop: string;
  weightLbs: number;
  zone: number;
  color: string;
}

interface DistributionState {
  memberCount: number;
  weeklyYields: YieldEntry[];
}

// Zone supplements for scarcity
const ZONE_SUPPLEMENTS = [
  { zone: 2, crop: 'Squash', hz: 417, color: 'hsl(30 70% 50%)', reason: 'High yield, filling' },
  { zone: 4, crop: 'Kale', hz: 639, color: 'hsl(120 50% 45%)', reason: 'Nutrient dense, abundant' },
  { zone: 3, crop: 'Beans', hz: 528, color: 'hsl(51 80% 50%)', reason: 'Protein, nitrogen fixer' },
  { zone: 1, crop: 'Potatoes', hz: 396, color: 'hsl(0 60% 50%)', reason: 'Calorie dense, stores well' },
];

// Quick add crops
const QUICK_CROPS = [
  { name: 'Tomatoes', zone: 5, color: 'hsl(210 60% 50%)' },
  { name: 'Squash', zone: 2, color: 'hsl(30 70% 50%)' },
  { name: 'Kale', zone: 4, color: 'hsl(120 50% 45%)' },
  { name: 'Cucumbers', zone: 2, color: 'hsl(30 70% 50%)' },
  { name: 'Peppers', zone: 5, color: 'hsl(210 60% 50%)' },
  { name: 'Beans', zone: 3, color: 'hsl(51 80% 50%)' },
  { name: 'Lettuce', zone: 4, color: 'hsl(120 50% 45%)' },
  { name: 'Carrots', zone: 1, color: 'hsl(0 60% 50%)' },
];

const DistributionEngine = () => {
  // State (persisted)
  const [state, setState] = useState<DistributionState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { memberCount: 30, weeklyYields: [] };
    } catch { return { memberCount: 30, weeklyYields: [] }; }
  });
  
  // Input state
  const [customCrop, setCustomCrop] = useState('');
  const [customWeight, setCustomWeight] = useState<number>(10);
  
  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  
  // Calculate totals and share size
  const { totalYield, shareSize, isScarcity, scarcityLevel } = useMemo(() => {
    const total = state.weeklyYields.reduce((sum, y) => sum + y.weightLbs, 0);
    const share = state.memberCount > 0 ? total / state.memberCount : 0;
    const scarcity = share < 2;
    const level = share < 1 ? 'critical' : share < 2 ? 'warning' : 'healthy';
    
    return { totalYield: total, shareSize: share, isScarcity: scarcity, scarcityLevel: level };
  }, [state]);
  
  // Add yield
  const addYield = useCallback((crop: string, weight: number, zone: number, color: string) => {
    setState(prev => ({
      ...prev,
      weeklyYields: [
        ...prev.weeklyYields,
        {
          id: `yield-${Date.now()}`,
          crop,
          weightLbs: weight,
          zone,
          color,
        },
      ],
    }));
  }, []);
  
  // Remove yield
  const removeYield = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      weeklyYields: prev.weeklyYields.filter(y => y.id !== id),
    }));
  }, []);
  
  // Clear week
  const clearWeek = useCallback(() => {
    setState(prev => ({ ...prev, weeklyYields: [] }));
  }, []);
  
  // Update member count
  const updateMemberCount = useCallback((delta: number) => {
    setState(prev => ({
      ...prev,
      memberCount: Math.max(1, prev.memberCount + delta),
    }));
  }, []);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(210 20% 10%), hsl(210 15% 6%))',
        border: `2px solid ${isScarcity ? 'hsl(30 60% 45%)' : 'hsl(210 40% 35%)'}`,
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: isScarcity 
            ? 'linear-gradient(135deg, hsl(30 25% 15%), hsl(30 20% 10%))'
            : 'linear-gradient(135deg, hsl(210 25% 15%), hsl(210 20% 10%))',
          borderBottom: `1px solid ${isScarcity ? 'hsl(30 30% 30%)' : 'hsl(210 30% 25%)'}`,
        }}
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" style={{ color: isScarcity ? 'hsl(30 60% 55%)' : 'hsl(210 50% 55%)' }} />
          <h3
            className="text-lg tracking-wider"
            style={{ fontFamily: "'Staatliches', sans-serif", color: isScarcity ? 'hsl(30 60% 60%)' : 'hsl(210 50% 60%)' }}
          >
            {isScarcity ? 'SCARCITY ALERT' : 'DISTRIBUTION ENGINE'}
          </h3>
        </div>
        <p className="text-[10px] font-mono mt-1" style={{ color: isScarcity ? 'hsl(30 30% 50%)' : 'hsl(210 30% 50%)' }}>
          CSA Logic • Fair Division for {state.memberCount} Families
        </p>
      </div>

      {/* Member Count & Share Calculator */}
      <div className="p-4 grid grid-cols-3 gap-3">
        {/* Member Count */}
        <div
          className="p-3 rounded-lg text-center"
          style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(210 30% 30%)' }}
        >
          <Heart className="w-5 h-5 mx-auto mb-1" style={{ color: 'hsl(350 60% 55%)' }} />
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => updateMemberCount(-1)}
              className="p-1 rounded"
              style={{ background: 'hsl(0 0% 15%)', color: 'hsl(0 0% 60%)' }}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-lg font-mono font-bold" style={{ color: 'hsl(350 60% 60%)' }}>
              {state.memberCount}
            </span>
            <button
              onClick={() => updateMemberCount(1)}
              className="p-1 rounded"
              style={{ background: 'hsl(0 0% 15%)', color: 'hsl(0 0% 60%)' }}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>FAMILIES</span>
        </div>
        
        {/* Total Yield */}
        <div
          className="p-3 rounded-lg text-center"
          style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(120 30% 30%)' }}
        >
          <Scale className="w-5 h-5 mx-auto mb-1" style={{ color: 'hsl(120 50% 55%)' }} />
          <span className="text-lg font-mono font-bold block" style={{ color: 'hsl(120 50% 60%)' }}>
            {totalYield.toFixed(1)}
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>TOTAL LBS</span>
        </div>
        
        {/* Share Size */}
        <div
          className="p-3 rounded-lg text-center"
          style={{ 
            background: scarcityLevel === 'critical' ? 'hsl(0 20% 12%)' : 
                        scarcityLevel === 'warning' ? 'hsl(30 20% 12%)' : 'hsl(0 0% 10%)',
            border: `2px solid ${
              scarcityLevel === 'critical' ? 'hsl(0 60% 50%)' :
              scarcityLevel === 'warning' ? 'hsl(30 60% 50%)' : 'hsl(120 40% 40%)'
            }`,
          }}
        >
          <Package className="w-5 h-5 mx-auto mb-1" style={{ 
            color: scarcityLevel === 'critical' ? 'hsl(0 60% 55%)' :
                   scarcityLevel === 'warning' ? 'hsl(30 60% 55%)' : 'hsl(120 50% 55%)'
          }} />
          <span className="text-lg font-mono font-bold block" style={{ 
            color: scarcityLevel === 'critical' ? 'hsl(0 60% 60%)' :
                   scarcityLevel === 'warning' ? 'hsl(30 60% 60%)' : 'hsl(120 50% 60%)'
          }}>
            {shareSize.toFixed(1)}
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>LBS/BOX</span>
        </div>
      </div>

      {/* Scarcity Alert */}
      <AnimatePresence>
        {isScarcity && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2"
          >
            <div
              className="rounded-lg p-3"
              style={{
                background: scarcityLevel === 'critical' 
                  ? 'linear-gradient(135deg, hsl(0 30% 15%), hsl(0 25% 10%))'
                  : 'linear-gradient(135deg, hsl(30 30% 15%), hsl(30 25% 10%))',
                border: `2px solid ${scarcityLevel === 'critical' ? 'hsl(0 60% 50%)' : 'hsl(30 60% 50%)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" style={{ color: scarcityLevel === 'critical' ? 'hsl(0 70% 55%)' : 'hsl(30 70% 55%)' }} />
                <span className="text-sm font-mono font-bold" style={{ color: scarcityLevel === 'critical' ? 'hsl(0 70% 60%)' : 'hsl(30 70% 60%)' }}>
                  {scarcityLevel === 'critical' ? 'CRITICAL SCARCITY' : 'SCARCITY WARNING'}
                </span>
              </div>
              <p className="text-xs font-mono mb-2" style={{ color: 'hsl(0 0% 60%)' }}>
                Share size is below 2 lbs. Supplement with:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ZONE_SUPPLEMENTS.slice(0, 2).map((supp) => (
                  <button
                    key={supp.zone}
                    onClick={() => addYield(supp.crop, 15, supp.zone, supp.color)}
                    className="flex items-center gap-2 p-2 rounded-lg text-left"
                    style={{
                      background: `${supp.color}15`,
                      border: `1px solid ${supp.color}50`,
                    }}
                  >
                    <Lightbulb className="w-4 h-4" style={{ color: supp.color }} />
                    <div>
                      <span className="text-[10px] font-mono font-bold block" style={{ color: supp.color }}>
                        Zone {supp.zone}: {supp.crop}
                      </span>
                      <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                        {supp.reason}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Add */}
      <div className="p-4">
        <span className="text-xs font-mono tracking-widest block mb-2" style={{ color: 'hsl(210 40% 55%)' }}>
          QUICK ADD YIELD:
        </span>
        <div className="flex flex-wrap gap-1">
          {QUICK_CROPS.map((crop) => (
            <button
              key={crop.name}
              onClick={() => addYield(crop.name, 10, crop.zone, crop.color)}
              className="text-[9px] font-mono px-2 py-1 rounded transition-all"
              style={{
                background: `${crop.color}15`,
                border: `1px solid ${crop.color}40`,
                color: crop.color,
              }}
            >
              + {crop.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Entry */}
      <div className="px-4 pb-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Custom crop..."
            value={customCrop}
            onChange={(e) => setCustomCrop(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-mono"
            style={{
              background: 'hsl(0 0% 10%)',
              border: '1px solid hsl(0 0% 25%)',
              color: 'hsl(0 0% 80%)',
            }}
          />
          <input
            type="number"
            value={customWeight}
            onChange={(e) => setCustomWeight(Math.max(0.1, parseFloat(e.target.value) || 0))}
            className="w-20 px-3 py-2 rounded-lg text-sm font-mono"
            style={{
              background: 'hsl(0 0% 10%)',
              border: '1px solid hsl(0 0% 25%)',
              color: 'hsl(0 0% 80%)',
            }}
          />
          <Button
            onClick={() => {
              if (customCrop) {
                addYield(customCrop, customWeight, 0, 'hsl(0 0% 50%)');
                setCustomCrop('');
              }
            }}
            size="sm"
            style={{
              background: 'hsl(210 30% 25%)',
              border: '1px solid hsl(210 40% 40%)',
              color: 'hsl(210 50% 70%)',
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Yield List */}
      {state.weeklyYields.length > 0 && (
        <div className="p-4 pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(0 0% 45%)' }}>
              THIS WEEK'S YIELD ({state.weeklyYields.length}):
            </span>
            <button
              onClick={clearWeek}
              className="text-[9px] font-mono px-2 py-0.5 rounded"
              style={{ background: 'hsl(0 25% 20%)', color: 'hsl(0 50% 60%)', border: '1px solid hsl(0 40% 35%)' }}
            >
              CLEAR WEEK
            </button>
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {state.weeklyYields.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(0 0% 18%)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-6 rounded-full" style={{ background: entry.color }} />
                  <span className="text-xs font-mono" style={{ color: entry.color }}>
                    {entry.crop}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono" style={{ color: 'hsl(0 0% 55%)' }}>
                    {entry.weightLbs} lbs
                  </span>
                  <button onClick={() => removeYield(entry.id)}>
                    <Minus className="w-3 h-3" style={{ color: 'hsl(0 40% 50%)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formula Display */}
      <div className="px-4 pb-4">
        <div
          className="rounded-lg p-3 text-center"
          style={{ background: 'hsl(0 0% 8%)', border: '1px dashed hsl(0 0% 20%)' }}
        >
          <div className="flex items-center justify-center gap-2 text-sm font-mono">
            <Calculator className="w-4 h-4" style={{ color: 'hsl(210 50% 55%)' }} />
            <span style={{ color: 'hsl(120 50% 60%)' }}>{totalYield.toFixed(1)}</span>
            <span style={{ color: 'hsl(0 0% 45%)' }}>÷</span>
            <span style={{ color: 'hsl(350 60% 60%)' }}>{state.memberCount}</span>
            <span style={{ color: 'hsl(0 0% 45%)' }}>=</span>
            <span style={{ color: isScarcity ? 'hsl(30 60% 60%)' : 'hsl(120 50% 60%)' }}>
              {shareSize.toFixed(1)} lbs/box
            </span>
          </div>
        </div>
      </div>

      {/* Wisdom Link */}
      <div className="px-4 pb-4">
        <LearnMoreButton wisdomKey="three-sisters-protocol" />
      </div>
    </div>
  );
};

export default DistributionEngine;
