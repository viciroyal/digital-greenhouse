import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Activity, 
  Sprout, 
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSoilAmendments } from '@/hooks/useMasterCrops';
import { SovereigntyFooter } from '@/components/almanac';

// Storage keys for persistence (shared with Profile Dashboard)
const STORAGE_KEY_BRIX_LOGS = 'pharmer-brix-logs';
const STORAGE_KEY_BED_RESETS = 'pharmer-bed-reset-count';

interface BrixLog {
  id: string;
  date: string;
  value: number;
  status: 'low' | 'optimal';
  crop?: string;
}

// Cross-sync event for journal entries
const dispatchJournalPrompt = (brixValue: number) => {
  const event = new CustomEvent('brix-needs-attention', {
    detail: { brixValue, date: new Date().toISOString() }
  });
  window.dispatchEvent(event);
};

/**
 * BEGINNER'S FIELD GUIDE
 * 
 * Simplified checklist dashboard with:
 * - Reset Bed button (Master Mix recipe)
 * - Brix Check (Green/Red light)
 * - Simple crop list (no Hz jargon)
 */
const BeginnerFieldGuide = () => {
  const [activeSection, setActiveSection] = useState<'reset' | 'check' | 'crops'>('reset');
  const { data: amendments, isLoading: amendmentsLoading } = useSoilAmendments();

  // Master Mix checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Brix validator state
  const [brixValue, setBrixValue] = useState<string>('');
  const [brixStatus, setBrixStatus] = useState<'idle' | 'low' | 'optimal'>('idle');
  const [isValidating, setIsValidating] = useState(false);

  // Brix logs
  const [brixLogs, setBrixLogs] = useState<BrixLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRIX_LOGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save brix logs
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BRIX_LOGS, JSON.stringify(brixLogs));
  }, [brixLogs]);

  // Hz visibility toggle
  const [showHz, setShowHz] = useState(false);

  // Track bed reset completions
  const [bedResetCount, setBedResetCount] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BED_RESETS);
    return saved ? parseInt(saved, 10) : 0;
  });

  const toggleCheck = (id: string) => {
    const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newChecked);
    
    // Check if all items are now checked (bed reset complete)
    if (amendments && Object.values(newChecked).filter(Boolean).length === amendments.length) {
      const newCount = bedResetCount + 1;
      setBedResetCount(newCount);
      localStorage.setItem(STORAGE_KEY_BED_RESETS, newCount.toString());
    }
  };

  const resetChecklist = () => {
    setCheckedItems({});
  };

  const handleBrixValidate = () => {
    const value = parseFloat(brixValue);
    if (isNaN(value) || value < 0) return;

    setIsValidating(true);
    setTimeout(() => {
      const status = value < 12 ? 'low' : 'optimal';
      setBrixStatus(status);
      setIsValidating(false);

      // Log the reading
      const newLog: BrixLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        value,
        status,
      };
      setBrixLogs(prev => [newLog, ...prev.slice(0, 9)]);

      // If low, dispatch event for journal cross-sync
      if (status === 'low') {
        dispatchJournalPrompt(value);
      }
    }, 600);
  };

  const handleBrixReset = () => {
    setBrixValue('');
    setBrixStatus('idle');
  };

  // Simple crop categories (no Hz displayed by default)
  const cropCategories = [
    { 
      name: 'Root Vegetables', 
      hz: 396,
      crops: ['Tomatoes', 'Peppers', 'Potatoes', 'Carrots', 'Beets'],
      emoji: '🥕',
      color: 'hsl(0 60% 50%)',
    },
    { 
      name: 'Squash & Melons', 
      hz: 417,
      crops: ['Butternut Squash', 'Zucchini', 'Watermelon', 'Cantaloupe'],
      emoji: '🎃',
      color: 'hsl(30 60% 50%)',
    },
    { 
      name: 'Leafy Greens', 
      hz: 528,
      crops: ['Kale', 'Spinach', 'Lettuce', 'Collards', 'Swiss Chard'],
      emoji: '🥬',
      color: 'hsl(120 50% 45%)',
    },
    { 
      name: 'Sweet Crops', 
      hz: 639,
      crops: ['Corn', 'Sweet Potato', 'Strawberries', 'Blueberries'],
      emoji: '🌽',
      color: 'hsl(51 80% 50%)',
    },
    { 
      name: 'Herbs', 
      hz: 741,
      crops: ['Basil', 'Mint', 'Lavender', 'Rosemary', 'Thyme'],
      emoji: '🌿',
      color: 'hsl(180 50% 45%)',
    },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 pb-32">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
          style={{
            background: 'hsl(35 40% 15%)',
            border: '2px solid hsl(35 70% 50%)',
          }}
        >
          <Sprout className="w-4 h-4" style={{ color: 'hsl(35 80% 60%)' }} />
          <span
            className="text-xs font-mono tracking-widest"
            style={{ color: 'hsl(35 70% 65%)' }}
          >
            FIELD MODE
          </span>
        </div>

        <h1
          className="text-2xl md:text-3xl mb-2 tracking-[0.15em]"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            color: 'hsl(35 60% 60%)',
            textShadow: '0 0 20px hsl(35 50% 35% / 0.4)',
          }}
        >
          THE FIELD GUIDE
        </h1>
        <p
          className="text-sm font-mono"
          style={{ color: 'hsl(35 40% 55%)' }}
        >
          Quick tools for the busy steward
        </p>
      </motion.div>

      {/* Section Tabs */}
      <motion.div
        className="flex rounded-xl overflow-hidden mb-6"
        style={{
          background: 'hsl(0 0% 8%)',
          border: '2px solid hsl(0 0% 18%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { id: 'reset', label: 'RESET BED', icon: RefreshCw, color: 'hsl(35 70% 55%)' },
          { id: 'check', label: 'BRIX CHECK', icon: Activity, color: 'hsl(195 70% 55%)' },
          { id: 'crops', label: 'CROPS', icon: Leaf, color: 'hsl(120 50% 50%)' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-all"
              style={{
                background: isActive ? `${tab.color}20` : 'transparent',
                borderBottom: isActive ? `3px solid ${tab.color}` : '3px solid transparent',
              }}
              onClick={() => setActiveSection(tab.id as any)}
            >
              <Icon
                className="w-5 h-5"
                style={{
                  color: isActive ? tab.color : 'hsl(0 0% 45%)',
                }}
              />
              <span
                className="text-[10px] font-mono tracking-wider"
                style={{ color: isActive ? tab.color : 'hsl(0 0% 45%)' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        {activeSection === 'reset' && (
          <motion.div
            key="reset"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: 'hsl(35 25% 10%)',
                border: '2px solid hsl(35 50% 35%)',
              }}
            >
              {/* Header */}
              <div
                className="p-4 flex items-center justify-between"
                style={{
                  background: 'linear-gradient(135deg, hsl(35 40% 18%), hsl(35 35% 12%))',
                  borderBottom: '1px solid hsl(35 40% 30%)',
                }}
              >
                <div>
                  <h3
                    className="text-lg tracking-wider"
                    style={{
                      fontFamily: "'Staatliches', sans-serif",
                      color: 'hsl(35 70% 65%)',
                    }}
                  >
                    🌱 MASTER MIX RECIPE
                  </h3>
                  <p
                    className="text-xs font-mono"
                    style={{ color: 'hsl(35 40% 50%)' }}
                  >
                    For a 60-foot bed
                  </p>
                </div>
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

              {/* Checklist */}
              <div className="p-4 space-y-2">
                {amendmentsLoading ? (
                  <div className="text-center py-8">
                    <span className="text-sm font-mono" style={{ color: 'hsl(35 40% 50%)' }}>
                      Loading recipe...
                    </span>
                  </div>
                ) : (
                  amendments?.map((amendment) => (
                    <motion.button
                      key={amendment.id}
                      className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left"
                      style={{
                        background: checkedItems[amendment.id] 
                          ? 'hsl(120 30% 15%)' 
                          : 'hsl(0 0% 10%)',
                        border: `1px solid ${checkedItems[amendment.id] 
                          ? 'hsl(120 50% 40%)' 
                          : 'hsl(0 0% 20%)'}`,
                      }}
                      onClick={() => toggleCheck(amendment.id)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: checkedItems[amendment.id] 
                            ? 'hsl(120 50% 40%)' 
                            : 'hsl(0 0% 20%)',
                          border: `2px solid ${checkedItems[amendment.id] 
                            ? 'hsl(120 60% 50%)' 
                            : 'hsl(0 0% 30%)'}`,
                        }}
                      >
                        {checkedItems[amendment.id] && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span
                          className="font-mono text-sm"
                          style={{
                            color: checkedItems[amendment.id] 
                              ? 'hsl(120 50% 65%)' 
                              : 'hsl(35 50% 70%)',
                            textDecoration: checkedItems[amendment.id] ? 'line-through' : 'none',
                          }}
                        >
                          {amendment.name}
                        </span>
                      </div>
                      <span
                        className="text-sm font-mono font-bold shrink-0"
                        style={{ color: 'hsl(51 70% 60%)' }}
                      >
                        {amendment.quantity_per_60ft}
                      </span>
                    </motion.button>
                  ))
                )}
              </div>

              {/* Progress */}
              {amendments && amendments.length > 0 && (
                <div className="px-4 pb-4">
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'hsl(0 0% 15%)' }}
                  >
                    <motion.div
                      className="h-full"
                      style={{ background: 'linear-gradient(90deg, hsl(35 70% 50%), hsl(120 50% 45%))' }}
                      animate={{
                        width: `${(Object.values(checkedItems).filter(Boolean).length / amendments.length) * 100}%`
                      }}
                    />
                  </div>
                  <p
                    className="text-xs font-mono text-center mt-2"
                    style={{ color: 'hsl(0 0% 50%)' }}
                  >
                    {Object.values(checkedItems).filter(Boolean).length} of {amendments.length} ingredients added
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeSection === 'check' && (
          <motion.div
            key="check"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: brixStatus === 'low' 
                  ? 'linear-gradient(180deg, hsl(0 30% 12%), hsl(0 0% 8%))'
                  : brixStatus === 'optimal'
                  ? 'linear-gradient(180deg, hsl(120 25% 12%), hsl(0 0% 8%))'
                  : 'hsl(195 20% 10%)',
                border: `2px solid ${brixStatus === 'low' 
                  ? 'hsl(0 60% 45%)' 
                  : brixStatus === 'optimal' 
                  ? 'hsl(120 50% 45%)' 
                  : 'hsl(195 50% 40%)'}`,
              }}
            >
              {/* Header */}
              <div
                className="p-4 text-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(195 35% 15%), hsl(195 30% 10%))',
                  borderBottom: '1px solid hsl(195 30% 25%)',
                }}
              >
                <h3
                  className="text-lg tracking-wider"
                  style={{
                    fontFamily: "'Staatliches', sans-serif",
                    color: 'hsl(195 60% 65%)',
                  }}
                >
                  🔬 BRIX CHECK
                </h3>
                <p
                  className="text-xs font-mono"
                  style={{ color: 'hsl(195 40% 50%)' }}
                >
                  Is your food nutrient-dense?
                </p>
              </div>

              {/* Input */}
              <div className="p-4">
                <div className="flex gap-3">
                  <Input
                    type="number"
                    min="0"
                    max="32"
                    step="0.1"
                    placeholder="Enter Brix reading"
                    value={brixValue}
                    onChange={(e) => {
                      setBrixValue(e.target.value);
                      setBrixStatus('idle');
                    }}
                    className="font-mono text-lg h-14"
                    style={{
                      background: 'hsl(0 0% 10%)',
                      border: '2px solid hsl(195 40% 30%)',
                      color: 'hsl(195 70% 70%)',
                    }}
                  />
                  <Button
                    onClick={handleBrixValidate}
                    disabled={!brixValue || isValidating}
                    className="h-14 px-6"
                    style={{
                      fontFamily: "'Staatliches', sans-serif",
                      background: 'linear-gradient(135deg, hsl(195 60% 40%), hsl(210 50% 35%))',
                      border: '2px solid hsl(195 50% 50%)',
                      color: 'white',
                    }}
                  >
                    {isValidating ? '...' : 'CHECK'}
                  </Button>
                </div>

                {/* Simple Scale */}
                <div className="mt-4 flex items-center justify-between text-xs font-mono">
                  <span style={{ color: 'hsl(0 60% 55%)' }}>🔴 0-11 (Low)</span>
                  <span style={{ color: 'hsl(120 50% 55%)' }}>🟢 12+ (Good!)</span>
                </div>
              </div>

              {/* Result */}
              <AnimatePresence>
                {brixStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 pt-0"
                  >
                    <div
                      className="p-4 rounded-xl flex items-start gap-3"
                      style={{
                        background: brixStatus === 'low' 
                          ? 'hsl(0 40% 15%)' 
                          : 'hsl(120 30% 15%)',
                        border: `2px solid ${brixStatus === 'low' 
                          ? 'hsl(0 60% 45%)' 
                          : 'hsl(120 50% 45%)'}`,
                      }}
                    >
                      {brixStatus === 'low' ? (
                        <AlertTriangle className="w-8 h-8 shrink-0" style={{ color: 'hsl(45 100% 55%)' }} />
                      ) : (
                        <CheckCircle className="w-8 h-8 shrink-0" style={{ color: 'hsl(120 60% 55%)' }} />
                      )}
                      <div>
                        <h4
                          className="text-lg tracking-wider mb-1"
                          style={{
                            fontFamily: "'Staatliches', sans-serif",
                            color: brixStatus === 'low' ? 'hsl(0 70% 65%)' : 'hsl(120 60% 65%)',
                          }}
                        >
                          {brixStatus === 'low' ? '⚠️ NEEDS HELP' : '✓ LOOKING GOOD!'}
                        </h4>
                        <p
                          className="text-sm"
                          style={{ color: 'hsl(0 0% 65%)' }}
                        >
                          {brixStatus === 'low' 
                            ? 'The soil needs more minerals. Try adding sea minerals or kelp.'
                            : 'Great nutrient density! Your plants are thriving.'}
                        </p>
                        {brixStatus === 'low' && (
                          <p
                            className="text-xs mt-2 italic"
                            style={{ color: 'hsl(195 50% 60%)' }}
                          >
                            Tip: A journal prompt has been created for you.
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={handleBrixReset}
                      variant="outline"
                      className="w-full mt-3"
                      style={{
                        background: 'transparent',
                        border: '1px solid hsl(0 0% 25%)',
                        color: 'hsl(0 0% 55%)',
                      }}
                    >
                      Check Another
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeSection === 'crops' && (
          <motion.div
            key="crops"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {/* Hz Toggle */}
            <button
              className="w-full flex items-center justify-between p-3 rounded-lg"
              style={{
                background: 'hsl(0 0% 10%)',
                border: '1px solid hsl(0 0% 20%)',
              }}
              onClick={() => setShowHz(!showHz)}
            >
              <span
                className="text-xs font-mono"
                style={{ color: 'hsl(0 0% 55%)' }}
              >
                Show frequency data (Hz)
              </span>
              <div
                className="w-10 h-5 rounded-full relative transition-all"
                style={{
                  background: showHz ? 'hsl(270 50% 40%)' : 'hsl(0 0% 25%)',
                }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                  style={{
                    background: 'white',
                    left: showHz ? '22px' : '2px',
                  }}
                />
              </div>
            </button>

            {/* Crop Categories */}
            {cropCategories.map((category, index) => (
              <motion.div
                key={category.name}
                className="rounded-xl overflow-hidden"
                style={{
                  background: `${category.color}10`,
                  border: `1px solid ${category.color}40`,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className="p-3 flex items-center justify-between"
                  style={{
                    background: `${category.color}15`,
                    borderBottom: `1px solid ${category.color}30`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.emoji}</span>
                    <span
                      className="font-mono text-sm tracking-wider"
                      style={{ color: category.color }}
                    >
                      {category.name}
                    </span>
                  </div>
                  {showHz && (
                    <span
                      className="text-xs font-mono px-2 py-1 rounded"
                      style={{
                        background: `${category.color}25`,
                        color: category.color,
                      }}
                    >
                      {category.hz}Hz
                    </span>
                  )}
                </div>
                <div className="p-3 flex flex-wrap gap-2">
                  {category.crops.map((crop) => (
                    <span
                      key={crop}
                      className="text-xs font-mono px-2 py-1 rounded"
                      style={{
                        background: 'hsl(0 0% 12%)',
                        color: 'hsl(40 50% 70%)',
                        border: '1px solid hsl(0 0% 20%)',
                      }}
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sovereignty Footer */}
      <SovereigntyFooter />
    </div>
  );
};

export default BeginnerFieldGuide;
