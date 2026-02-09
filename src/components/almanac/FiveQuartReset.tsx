import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Scale, Check, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSoilAmendments } from '@/hooks/useMasterCrops';

/**
 * THE 5-QUART RESET
 * Quick-action button for the Master Mix recipe
 * Now connected to the soil_amendments database table
 */

const FiveQuartReset = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const { data: amendments, isLoading } = useSoilAmendments();

  const toggleItem = (name: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(name)) {
      newChecked.delete(name);
    } else {
      newChecked.add(name);
    }
    setCheckedItems(newChecked);
  };

  const resetChecklist = () => {
    setCheckedItems(new Set());
  };

  const displayAmendments = amendments || [];
  const allChecked = displayAmendments.length > 0 && checkedItems.size === displayAmendments.length;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Trigger Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-16 text-lg font-bold gap-3 rounded-xl"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            background: isExpanded
              ? 'linear-gradient(135deg, hsl(35 80% 45%), hsl(25 70% 35%))'
              : 'linear-gradient(135deg, hsl(35 90% 50%), hsl(25 80% 40%))',
            border: '2px solid hsl(40 80% 60%)',
            color: 'hsl(20 20% 10%)',
            boxShadow: '0 4px 20px hsl(35 80% 40% / 0.4), inset 0 1px 0 hsl(45 100% 70% / 0.3)',
            letterSpacing: '0.1em',
          }}
        >
          <Beaker className="w-6 h-6" />
          RESET A BED
          <Scale className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Expanded Recipe Card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: 'hsl(20 30% 8%)',
                border: '2px solid hsl(35 60% 40%)',
                boxShadow: '0 0 30px hsl(35 60% 30% / 0.3)',
              }}
            >
              {/* Header */}
              <div
                className="p-4"
                style={{
                  background: 'linear-gradient(135deg, hsl(35 50% 20%), hsl(25 40% 15%))',
                  borderBottom: '1px solid hsl(35 50% 30%)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="text-xl tracking-wider"
                      style={{
                        fontFamily: "'Staatliches', sans-serif",
                        color: 'hsl(40 80% 60%)',
                      }}
                    >
                      THE MASTER MIX
                    </h3>
                    <p
                      className="text-xs font-mono"
                      style={{ color: 'hsl(40 50% 50%)' }}
                    >
                      SOIL RESET PROTOCOL • Database Synced
                    </p>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-lg"
                    style={{
                      background: 'hsl(35 60% 30%)',
                      border: '1px solid hsl(35 70% 50%)',
                    }}
                  >
                    <span
                      className="text-sm font-mono font-bold"
                      style={{ color: 'hsl(45 100% 70%)' }}
                    >
                      60-FT BED
                    </span>
                  </div>
                </div>
              </div>

              {/* The Rule */}
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{
                  background: 'hsl(45 50% 50% / 0.1)',
                  borderBottom: '1px solid hsl(35 40% 25%)',
                }}
              >
                <Scale className="w-5 h-5" style={{ color: 'hsl(45 80% 60%)' }} />
                <p
                  className="font-mono text-sm"
                  style={{ color: 'hsl(45 80% 65%)' }}
                >
                  <span
                    style={{
                      fontFamily: "'Staatliches', sans-serif",
                      fontSize: '1.1em',
                      letterSpacing: '0.05em',
                    }}
                  >
                    THE RULE:
                  </span>{' '}
                  5 Quarts Total per 60-foot Bed
                </p>
              </div>

              {/* Ingredients Checklist */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <p
                    className="text-xs font-mono tracking-wider"
                    style={{ color: 'hsl(0 0% 50%)' }}
                  >
                    INGREDIENTS
                  </p>
                  <div className="flex items-center gap-2">
                    {isLoading && (
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'hsl(40 60% 50%)' }} />
                    )}
                    <button
                      onClick={resetChecklist}
                      className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded"
                      style={{
                        color: 'hsl(0 0% 50%)',
                        background: 'hsl(0 0% 15%)',
                        border: '1px solid hsl(0 0% 25%)',
                      }}
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                </div>

                {displayAmendments.map((amendment, index) => {
                  const isChecked = checkedItems.has(amendment.name);
                  return (
                    <motion.button
                      key={amendment.id}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all"
                      style={{
                        background: isChecked ? 'hsl(120 40% 15%)' : 'hsl(0 0% 12%)',
                        border: isChecked
                          ? '1px solid hsl(120 50% 40%)'
                          : '1px solid hsl(0 0% 20%)',
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => toggleItem(amendment.name)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Checkbox */}
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                        style={{
                          background: isChecked ? 'hsl(120 50% 40%)' : 'transparent',
                          border: isChecked
                            ? '2px solid hsl(120 50% 40%)'
                            : '2px solid hsl(0 0% 35%)',
                        }}
                      >
                        {isChecked && (
                          <Check className="w-4 h-4" style={{ color: 'white' }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm font-mono"
                            style={{
                              color: isChecked ? 'hsl(120 50% 70%)' : 'hsl(0 0% 75%)',
                              textDecoration: isChecked ? 'line-through' : 'none',
                            }}
                          >
                            {amendment.name}
                          </span>
                          <span
                            className="text-sm font-mono font-bold px-2 py-0.5 rounded"
                            style={{
                              background: 'hsl(35 60% 25%)',
                              color: 'hsl(45 80% 65%)',
                              border: '1px solid hsl(35 60% 40%)',
                            }}
                          >
                            {amendment.quantity_per_60ft}
                          </span>
                        </div>
                        <p
                          className="text-[10px] font-mono"
                          style={{ color: 'hsl(0 0% 45%)' }}
                        >
                          {amendment.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Completion State */}
              <AnimatePresence>
                {allChecked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4"
                  >
                    <div
                      className="p-3 rounded-lg text-center"
                      style={{
                        background: 'linear-gradient(135deg, hsl(120 40% 20%), hsl(140 35% 15%))',
                        border: '2px solid hsl(120 50% 50%)',
                        boxShadow: '0 0 20px hsl(120 50% 40% / 0.3)',
                      }}
                    >
                      <p
                        className="text-lg tracking-wider"
                        style={{
                          fontFamily: "'Staatliches', sans-serif",
                          color: 'hsl(120 60% 70%)',
                        }}
                      >
                        ✓ BED RESET COMPLETE
                      </p>
                      <p
                        className="text-xs font-mono"
                        style={{ color: 'hsl(120 40% 55%)' }}
                      >
                        Mix dry ingredients first, then incorporate castings
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer Note */}
              <div
                className="px-4 py-3"
                style={{ borderTop: '1px solid hsl(0 0% 20%)' }}
              >
                <p
                  className="text-[10px] font-mono text-center italic"
                  style={{ color: 'hsl(0 0% 40%)' }}
                >
                  ◆ Apply evenly across bed surface, rake in lightly ◆
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FiveQuartReset;
