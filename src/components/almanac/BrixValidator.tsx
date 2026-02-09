import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * BRIX VALIDATOR
 * NIR Spectroscopy input field with nutrient density alerts
 * Field Almanac utility for in-bed diagnostics
 */

type BrixStatus = 'idle' | 'low' | 'optimal';

const BrixValidator = () => {
  const [brixValue, setBrixValue] = useState<string>('');
  const [status, setStatus] = useState<BrixStatus>('idle');
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = () => {
    const value = parseFloat(brixValue);
    if (isNaN(value) || value < 0) {
      return;
    }

    setIsValidating(true);
    
    // Simulate validation delay
    setTimeout(() => {
      if (value < 12) {
        setStatus('low');
      } else if (value >= 12 && value <= 24) {
        setStatus('optimal');
      } else {
        setStatus('optimal'); // Anything above 24 is also optimal
      }
      setIsValidating(false);
    }, 800);
  };

  const handleReset = () => {
    setBrixValue('');
    setStatus('idle');
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'hsl(20 30% 8%)',
          border: status === 'low' 
            ? '2px solid hsl(0 70% 50%)'
            : status === 'optimal'
            ? '2px solid hsl(120 60% 45%)'
            : '2px solid hsl(195 60% 40%)',
          boxShadow: status === 'low'
            ? '0 0 30px hsl(0 70% 40% / 0.3)'
            : status === 'optimal'
            ? '0 0 30px hsl(120 60% 35% / 0.3)'
            : '0 0 25px hsl(195 60% 30% / 0.2)',
        }}
      >
        {/* Header */}
        <div
          className="p-4"
          style={{
            background: 'linear-gradient(135deg, hsl(195 40% 15%), hsl(210 35% 12%))',
            borderBottom: '1px solid hsl(195 40% 25%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'hsl(195 50% 25%)',
                border: '2px solid hsl(195 60% 50%)',
              }}
            >
              <Activity
                className="w-5 h-5"
                style={{ color: 'hsl(195 80% 65%)' }}
              />
            </div>
            <div>
              <h3
                className="text-lg tracking-wider"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(195 70% 65%)',
                }}
              >
                BRIX VALIDATOR
              </h3>
              <p
                className="text-xs font-mono"
                style={{ color: 'hsl(195 40% 50%)' }}
              >
                NIR Spectroscopy Input
              </p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label
                className="text-[10px] font-mono tracking-wider mb-2 block"
                style={{ color: 'hsl(0 0% 50%)' }}
              >
                ENTER BRIX READING
              </label>
              <Input
                type="number"
                min="0"
                max="32"
                step="0.1"
                placeholder="0.0 - 24.0"
                value={brixValue}
                onChange={(e) => {
                  setBrixValue(e.target.value);
                  setStatus('idle');
                }}
                className="font-mono text-lg h-12"
                style={{
                  background: 'hsl(0 0% 10%)',
                  border: '2px solid hsl(195 40% 30%)',
                  color: 'hsl(195 80% 70%)',
                }}
              />
            </div>
            <div className="flex gap-2 sm:self-end">
              <Button
                onClick={handleValidate}
                disabled={!brixValue || isValidating}
                className="h-12 px-6 font-mono tracking-wider"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  background: 'linear-gradient(135deg, hsl(195 70% 45%), hsl(210 60% 35%))',
                  border: '2px solid hsl(195 60% 55%)',
                  color: 'white',
                }}
              >
                {isValidating ? 'ANALYZING...' : 'VALIDATE'}
              </Button>
              {status !== 'idle' && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-12 px-4 font-mono"
                  style={{
                    background: 'transparent',
                    border: '1px solid hsl(0 0% 30%)',
                    color: 'hsl(0 0% 60%)',
                  }}
                >
                  RESET
                </Button>
              )}
            </div>
          </div>

          {/* Scale Reference */}
          <div className="mt-4">
            <div
              className="h-3 rounded-full overflow-hidden flex"
              style={{ background: 'hsl(0 0% 15%)' }}
            >
              <div
                className="w-1/2 h-full"
                style={{
                  background: 'linear-gradient(90deg, hsl(0 70% 40%), hsl(45 80% 50%))',
                }}
              />
              <div
                className="w-1/2 h-full"
                style={{
                  background: 'linear-gradient(90deg, hsl(80 60% 45%), hsl(120 60% 45%))',
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 60% 50%)' }}>0</span>
              <span className="text-[10px] font-mono" style={{ color: 'hsl(45 70% 55%)' }}>12</span>
              <span className="text-[10px] font-mono" style={{ color: 'hsl(120 50% 50%)' }}>24+</span>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        <AnimatePresence mode="wait">
          {status === 'low' && (
            <motion.div
              key="low"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="p-4 m-4 mt-0 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, hsl(0 50% 15%), hsl(15 40% 12%))',
                  border: '2px solid hsl(0 70% 45%)',
                  boxShadow: '0 0 20px hsl(0 70% 35% / 0.3)',
                }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className="w-6 h-6 shrink-0 mt-0.5"
                    style={{ color: 'hsl(45 100% 55%)' }}
                  />
                  <div>
                    <h4
                      className="text-lg tracking-wider mb-2"
                      style={{
                        fontFamily: "'Staatliches', sans-serif",
                        color: 'hsl(0 80% 65%)',
                      }}
                    >
                      ⚠ NUTRIENT DENSITY LOW
                    </h4>
                    <p
                      className="text-sm font-mono mb-3"
                      style={{ color: 'hsl(40 60% 70%)' }}
                    >
                      Brix reading of <strong>{brixValue}</strong> indicates mineral deficiency.
                    </p>
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        background: 'hsl(0 0% 10%)',
                        border: '1px solid hsl(0 0% 25%)',
                      }}
                    >
                      <p
                        className="text-xs font-mono tracking-wider mb-2"
                        style={{ color: 'hsl(0 0% 55%)' }}
                      >
                        RECOMMENDED ACTION:
                      </p>
                      <p
                        className="text-sm font-mono font-bold"
                        style={{ color: 'hsl(195 80% 65%)' }}
                      >
                        Apply Mineral Anchor / Sea Agri Minerals
                      </p>
                      <p
                        className="text-xs font-mono mt-2"
                        style={{ color: 'hsl(0 0% 50%)' }}
                      >
                        Foliar spray at 1 tbsp per gallon at dawn
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'optimal' && (
            <motion.div
              key="optimal"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="p-4 m-4 mt-0 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, hsl(120 35% 15%), hsl(140 30% 12%))',
                  border: '2px solid hsl(120 50% 45%)',
                  boxShadow: '0 0 20px hsl(120 50% 35% / 0.3)',
                }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle
                    className="w-6 h-6 shrink-0 mt-0.5"
                    style={{ color: 'hsl(120 60% 55%)' }}
                  />
                  <div>
                    <h4
                      className="text-lg tracking-wider mb-2"
                      style={{
                        fontFamily: "'Staatliches', sans-serif",
                        color: 'hsl(120 60% 65%)',
                      }}
                    >
                      ✓ OPTIMAL FREQUENCY ACHIEVED
                    </h4>
                    <p
                      className="text-sm font-mono mb-2"
                      style={{ color: 'hsl(120 40% 70%)' }}
                    >
                      Brix reading of <strong>{brixValue}</strong> indicates excellent nutrient density.
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-mono px-2 py-1 rounded"
                        style={{
                          background: 'hsl(120 40% 25%)',
                          color: 'hsl(120 50% 65%)',
                          border: '1px solid hsl(120 40% 40%)',
                        }}
                      >
                        HIGH BRIX
                      </span>
                      <span
                        className="text-[10px] font-mono px-2 py-1 rounded"
                        style={{
                          background: 'hsl(51 40% 25%)',
                          color: 'hsl(51 70% 65%)',
                          border: '1px solid hsl(51 50% 40%)',
                        }}
                      >
                        MINERAL RICH
                      </span>
                      <span
                        className="text-[10px] font-mono px-2 py-1 rounded"
                        style={{
                          background: 'hsl(195 40% 25%)',
                          color: 'hsl(195 60% 65%)',
                          border: '1px solid hsl(195 50% 40%)',
                        }}
                      >
                        PEST RESISTANT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BrixValidator;
