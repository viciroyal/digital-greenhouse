import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Recycle,
  Leaf,
  Layers,
  Flame,
  Plus,
  Trash2,
  ArrowRight,
  CheckCircle,
  Zap,
  Sprout,
  Pickaxe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE REGENERATION ENGINE (Waste Logic)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CONCEPT: There is no waste, only "The Vortex of Return" (Pillar 1).
 * 
 * LOGIC:
 * - Green Waste (Nitrogen) → Assign to The Alchemist for "Hot Pile"
 * - Brown Waste (Carbon) → Assign to The Architect for "Mulch/Structure"
 * - When Compost is finished → Auto-generate "Legacy Task"
 */

// Storage key
const STORAGE_KEY = 'pharmer-compost-tracker';

type WasteType = 'green' | 'brown';
type CompostStatus = 'active' | 'curing' | 'finished';

interface WasteEntry {
  id: string;
  material: string;
  type: WasteType;
  weightLbs: number;
  assignedRole: 'alchemist' | 'architect';
  destination: string;
  timestamp: string;
}

interface CompostPile {
  id: string;
  name: string;
  greenLbs: number;
  brownLbs: number;
  ratio: number; // Carbon:Nitrogen ratio
  status: CompostStatus;
  startDate: string;
  entries: WasteEntry[];
}

interface LegacyTask {
  id: string;
  description: string;
  targetZone: string;
  hz: number;
  completed: boolean;
  createdAt: string;
}

interface CompostState {
  piles: CompostPile[];
  legacyTasks: LegacyTask[];
}

// Material presets
const GREEN_MATERIALS = [
  { name: 'Tomato Vines', defaultLbs: 5 },
  { name: 'Pepper Plants', defaultLbs: 3 },
  { name: 'Grass Clippings', defaultLbs: 10 },
  { name: 'Kitchen Scraps', defaultLbs: 5 },
  { name: 'Cover Crop', defaultLbs: 15 },
  { name: 'Coffee Grounds', defaultLbs: 2 },
];

const BROWN_MATERIALS = [
  { name: 'Straw', defaultLbs: 10 },
  { name: 'Dried Leaves', defaultLbs: 8 },
  { name: 'Cardboard', defaultLbs: 5 },
  { name: 'Wood Chips', defaultLbs: 15 },
  { name: 'Corn Stalks', defaultLbs: 12 },
  { name: 'Paper', defaultLbs: 3 },
];

const RegenerationEngine = () => {
  // State (persisted)
  const [state, setState] = useState<CompostState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    // Default state with one active pile
    return {
      piles: [{
        id: 'pile-1',
        name: 'Primary Pile',
        greenLbs: 0,
        brownLbs: 0,
        ratio: 0,
        status: 'active' as CompostStatus,
        startDate: new Date().toISOString(),
        entries: [],
      }],
      legacyTasks: [],
    };
  });
  
  // Selected pile
  const [selectedPileId, setSelectedPileId] = useState<string>(state.piles[0]?.id || '');
  
  // Custom input
  const [customMaterial, setCustomMaterial] = useState('');
  const [customWeight, setCustomWeight] = useState<number>(5);
  const [customType, setCustomType] = useState<WasteType>('green');
  
  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  
  // Current pile
  const currentPile = useMemo(() => 
    state.piles.find(p => p.id === selectedPileId) || state.piles[0],
    [state.piles, selectedPileId]
  );
  
  // Add waste to pile
  const addWaste = useCallback((material: string, weight: number, type: WasteType) => {
    const entry: WasteEntry = {
      id: `waste-${Date.now()}`,
      material,
      type,
      weightLbs: weight,
      assignedRole: type === 'green' ? 'alchemist' : 'architect',
      destination: type === 'green' ? 'Hot Pile' : 'Mulch/Structure',
      timestamp: new Date().toISOString(),
    };
    
    setState(prev => ({
      ...prev,
      piles: prev.piles.map(pile => {
        if (pile.id !== selectedPileId) return pile;
        
        const newGreen = pile.greenLbs + (type === 'green' ? weight : 0);
        const newBrown = pile.brownLbs + (type === 'brown' ? weight : 0);
        // C:N ratio approximation (browns ~30:1, greens ~15:1, target ~25-30:1)
        const ratio = newGreen > 0 ? (newBrown * 30) / (newGreen * 15) : 0;
        
        return {
          ...pile,
          greenLbs: newGreen,
          brownLbs: newBrown,
          ratio: Math.round(ratio * 10) / 10,
          entries: [...pile.entries, entry],
        };
      }),
    }));
  }, [selectedPileId]);
  
  // Update pile status
  const updatePileStatus = useCallback((pileId: string, newStatus: CompostStatus) => {
    setState(prev => {
      const updatedPiles = prev.piles.map(pile => 
        pile.id === pileId ? { ...pile, status: newStatus } : pile
      );
      
      // If finishing, generate legacy task
      let newTasks = prev.legacyTasks;
      if (newStatus === 'finished') {
        const pile = prev.piles.find(p => p.id === pileId);
        if (pile) {
          newTasks = [
            ...prev.legacyTasks,
            {
              id: `legacy-${Date.now()}`,
              description: `Apply Finished Compost (${pile.name}) to Zone 1`,
              targetZone: 'Zone 1 (The Beginning)',
              hz: 396,
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ];
        }
      }
      
      return { piles: updatedPiles, legacyTasks: newTasks };
    });
  }, []);
  
  // Complete legacy task
  const completeLegacyTask = useCallback((taskId: string) => {
    setState(prev => ({
      ...prev,
      legacyTasks: prev.legacyTasks.map(t => 
        t.id === taskId ? { ...t, completed: true } : t
      ),
    }));
  }, []);
  
  // Calculate ideal ratio status
  const ratioStatus = useMemo(() => {
    if (!currentPile) return { status: 'empty', message: 'Add materials to begin' };
    if (currentPile.ratio === 0) return { status: 'empty', message: 'Add materials to begin' };
    if (currentPile.ratio < 1.5) return { status: 'hot', message: 'Too much Nitrogen! Add browns.' };
    if (currentPile.ratio > 3.5) return { status: 'cold', message: 'Too much Carbon! Add greens.' };
    return { status: 'ideal', message: 'Ideal C:N ratio (25-30:1)' };
  }, [currentPile]);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(35 20% 10%), hsl(35 15% 6%))',
        border: '2px solid hsl(35 40% 35%)',
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: 'linear-gradient(135deg, hsl(35 25% 15%), hsl(35 20% 10%))',
          borderBottom: '1px solid hsl(35 30% 25%)',
        }}
      >
        <div className="flex items-center gap-2">
          <Recycle className="w-5 h-5" style={{ color: 'hsl(35 60% 55%)' }} />
          <h3
            className="text-lg tracking-wider"
            style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(35 60% 60%)' }}
          >
            REGENERATION ENGINE
          </h3>
        </div>
        <p className="text-[10px] font-mono mt-1" style={{ color: 'hsl(35 30% 50%)' }}>
          The Vortex of Return • No Waste, Only Cycles
        </p>
      </div>

      {/* Pile Status */}
      {currentPile && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(35 50% 55%)' }}>
              {currentPile.name.toUpperCase()}
            </span>
            <div className="flex gap-1">
              {(['active', 'curing', 'finished'] as CompostStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => updatePileStatus(currentPile.id, status)}
                  className="text-[9px] font-mono px-2 py-0.5 rounded"
                  style={{
                    background: currentPile.status === status 
                      ? status === 'active' ? 'hsl(35 40% 25%)' 
                      : status === 'curing' ? 'hsl(270 30% 25%)'
                      : 'hsl(120 30% 25%)'
                      : 'hsl(0 0% 12%)',
                    border: `1px solid ${
                      currentPile.status === status
                        ? status === 'active' ? 'hsl(35 50% 45%)'
                        : status === 'curing' ? 'hsl(270 40% 45%)'
                        : 'hsl(120 40% 45%)'
                        : 'hsl(0 0% 25%)'
                    }`,
                    color: currentPile.status === status
                      ? status === 'active' ? 'hsl(35 60% 60%)'
                      : status === 'curing' ? 'hsl(270 50% 65%)'
                      : 'hsl(120 50% 60%)'
                      : 'hsl(0 0% 50%)',
                  }}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          {/* Pile Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div
              className="p-3 rounded-lg text-center"
              style={{ background: 'hsl(120 20% 12%)', border: '1px solid hsl(120 40% 35%)' }}
            >
              <Leaf className="w-4 h-4 mx-auto mb-1" style={{ color: 'hsl(120 50% 55%)' }} />
              <span className="text-sm font-mono font-bold block" style={{ color: 'hsl(120 50% 60%)' }}>
                {currentPile.greenLbs.toFixed(1)}
              </span>
              <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>GREEN (N)</span>
            </div>
            <div
              className="p-3 rounded-lg text-center"
              style={{ background: 'hsl(35 20% 12%)', border: '1px solid hsl(35 40% 35%)' }}
            >
              <Layers className="w-4 h-4 mx-auto mb-1" style={{ color: 'hsl(35 50% 55%)' }} />
              <span className="text-sm font-mono font-bold block" style={{ color: 'hsl(35 50% 60%)' }}>
                {currentPile.brownLbs.toFixed(1)}
              </span>
              <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>BROWN (C)</span>
            </div>
            <div
              className="p-3 rounded-lg text-center"
              style={{ 
                background: ratioStatus.status === 'ideal' ? 'hsl(120 20% 12%)' 
                          : ratioStatus.status === 'hot' ? 'hsl(0 20% 12%)'
                          : 'hsl(210 20% 12%)',
                border: `1px solid ${
                  ratioStatus.status === 'ideal' ? 'hsl(120 40% 40%)'
                  : ratioStatus.status === 'hot' ? 'hsl(0 50% 45%)'
                  : 'hsl(210 40% 40%)'
                }`,
              }}
            >
              <Flame className="w-4 h-4 mx-auto mb-1" style={{ 
                color: ratioStatus.status === 'ideal' ? 'hsl(120 50% 55%)'
                     : ratioStatus.status === 'hot' ? 'hsl(0 60% 55%)'
                     : 'hsl(210 50% 55%)'
              }} />
              <span className="text-sm font-mono font-bold block" style={{ 
                color: ratioStatus.status === 'ideal' ? 'hsl(120 50% 60%)'
                     : ratioStatus.status === 'hot' ? 'hsl(0 60% 60%)'
                     : 'hsl(210 50% 60%)'
              }}>
                {currentPile.ratio > 0 ? `${currentPile.ratio}:1` : '—'}
              </span>
              <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>C:N RATIO</span>
            </div>
          </div>
          
          {/* Ratio Feedback */}
          <div
            className="p-2 rounded-lg text-center mb-3"
            style={{
              background: ratioStatus.status === 'ideal' ? 'hsl(120 20% 15%)' 
                        : ratioStatus.status === 'hot' ? 'hsl(0 20% 15%)'
                        : ratioStatus.status === 'cold' ? 'hsl(210 20% 15%)'
                        : 'hsl(0 0% 10%)',
              border: `1px dashed ${
                ratioStatus.status === 'ideal' ? 'hsl(120 40% 40%)'
                : ratioStatus.status === 'hot' ? 'hsl(0 50% 45%)'
                : ratioStatus.status === 'cold' ? 'hsl(210 40% 40%)'
                : 'hsl(0 0% 25%)'
              }`,
            }}
          >
            <span className="text-[10px] font-mono" style={{
              color: ratioStatus.status === 'ideal' ? 'hsl(120 50% 60%)'
                   : ratioStatus.status === 'hot' ? 'hsl(0 60% 60%)'
                   : ratioStatus.status === 'cold' ? 'hsl(210 50% 60%)'
                   : 'hsl(0 0% 50%)'
            }}>
              {ratioStatus.message}
            </span>
          </div>
        </div>
      )}

      {/* Quick Add - Green */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-4 h-4" style={{ color: 'hsl(120 50% 55%)' }} />
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(120 50% 55%)' }}>
            GREEN → THE ALCHEMIST (Hot Pile)
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {GREEN_MATERIALS.map((mat) => (
            <button
              key={mat.name}
              onClick={() => addWaste(mat.name, mat.defaultLbs, 'green')}
              className="text-[9px] font-mono px-2 py-1 rounded"
              style={{
                background: 'hsl(120 20% 15%)',
                border: '1px solid hsl(120 40% 35%)',
                color: 'hsl(120 50% 60%)',
              }}
            >
              + {mat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Add - Brown */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4" style={{ color: 'hsl(35 50% 55%)' }} />
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(35 50% 55%)' }}>
            BROWN → THE ARCHITECT (Mulch)
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {BROWN_MATERIALS.map((mat) => (
            <button
              key={mat.name}
              onClick={() => addWaste(mat.name, mat.defaultLbs, 'brown')}
              className="text-[9px] font-mono px-2 py-1 rounded"
              style={{
                background: 'hsl(35 20% 15%)',
                border: '1px solid hsl(35 40% 35%)',
                color: 'hsl(35 50% 60%)',
              }}
            >
              + {mat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Entry */}
      <div className="px-4 py-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Custom material..."
            value={customMaterial}
            onChange={(e) => setCustomMaterial(e.target.value)}
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
            className="w-16 px-2 py-2 rounded-lg text-sm font-mono text-center"
            style={{
              background: 'hsl(0 0% 10%)',
              border: '1px solid hsl(0 0% 25%)',
              color: 'hsl(0 0% 80%)',
            }}
          />
          <button
            onClick={() => setCustomType(customType === 'green' ? 'brown' : 'green')}
            className="px-2 py-2 rounded-lg"
            style={{
              background: customType === 'green' ? 'hsl(120 25% 20%)' : 'hsl(35 25% 20%)',
              border: `1px solid ${customType === 'green' ? 'hsl(120 40% 40%)' : 'hsl(35 40% 40%)'}`,
            }}
          >
            {customType === 'green' ? (
              <Leaf className="w-4 h-4" style={{ color: 'hsl(120 50% 60%)' }} />
            ) : (
              <Layers className="w-4 h-4" style={{ color: 'hsl(35 50% 60%)' }} />
            )}
          </button>
          <Button
            onClick={() => {
              if (customMaterial) {
                addWaste(customMaterial, customWeight, customType);
                setCustomMaterial('');
              }
            }}
            size="sm"
            style={{
              background: 'hsl(35 30% 25%)',
              border: '1px solid hsl(35 40% 40%)',
              color: 'hsl(35 50% 70%)',
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legacy Tasks */}
      <AnimatePresence>
        {state.legacyTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 pt-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" style={{ color: 'hsl(45 70% 55%)' }} />
              <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(45 70% 55%)' }}>
                LEGACY TASKS:
              </span>
            </div>
            <div className="space-y-2">
              {state.legacyTasks.filter(t => !t.completed).map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, hsl(0 20% 12%), hsl(0 15% 10%))',
                    border: '2px solid hsl(0 40% 40%)',
                  }}
                >
                  <ArrowRight className="w-4 h-4" style={{ color: 'hsl(0 50% 55%)' }} />
                  <div className="flex-1">
                    <span className="text-xs font-mono block" style={{ color: 'hsl(0 50% 65%)' }}>
                      {task.description}
                    </span>
                    <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                      {task.targetZone} • {task.hz}Hz
                    </span>
                  </div>
                  <button
                    onClick={() => completeLegacyTask(task.id)}
                    className="p-1 rounded"
                    style={{ background: 'hsl(120 25% 20%)', border: '1px solid hsl(120 40% 40%)' }}
                  >
                    <CheckCircle className="w-4 h-4" style={{ color: 'hsl(120 50% 55%)' }} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Assignment Reference */}
      <div className="px-4 pb-4">
        <div
          className="rounded-lg p-3"
          style={{ background: 'hsl(0 0% 8%)', border: '1px dashed hsl(0 0% 20%)' }}
        >
          <span className="text-[10px] font-mono block mb-2" style={{ color: 'hsl(35 50% 55%)' }}>
            THE CYCLE:
          </span>
          <div className="flex items-center gap-2 text-[9px] font-mono">
            <span style={{ color: 'hsl(120 50% 55%)' }}>Green (N)</span>
            <ArrowRight className="w-3 h-3" style={{ color: 'hsl(0 0% 40%)' }} />
            <span className="flex items-center gap-1" style={{ color: 'hsl(51 70% 55%)' }}>
              <Sprout className="w-3 h-3" /> Alchemist
            </span>
            <span style={{ color: 'hsl(0 0% 30%)' }}>|</span>
            <span style={{ color: 'hsl(35 50% 55%)' }}>Brown (C)</span>
            <ArrowRight className="w-3 h-3" style={{ color: 'hsl(0 0% 40%)' }} />
            <span className="flex items-center gap-1" style={{ color: 'hsl(0 50% 55%)' }}>
              <Pickaxe className="w-3 h-3" /> Architect
            </span>
          </div>
        </div>
      </div>

      {/* Wisdom Link */}
      <div className="px-4 pb-4">
        <LearnMoreButton wisdomKey="steiner-farm-organism" />
      </div>
    </div>
  );
};

export default RegenerationEngine;
