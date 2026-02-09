import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE VITALITY CHECK (Silent Engine Protocol)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * MECHANISM: Binary status signal. No noise.
 * 
 * INPUT: User enters NIR Spectroscopy value (0-30)
 * 
 * THE LOGIC:
 *   IF < 12  → [RED ALERT] "Deficiency Detected. Intercept with Mineral Anchor."
 *   IF 12-24 → [GREEN SIGNAL] "Resonance High. Flow State."
 */

// Storage key
const STORAGE_KEY_BRIX_LOGS = 'pharmer-brix-logs';

// Binary logic states
type Signal = 'IDLE' | 'RED' | 'GREEN';

interface BrixLog {
  id: string;
  date: string;
  value: number;
  signal: 'RED' | 'GREEN';
}

// Cross-sync event
const dispatchJournalPrompt = (value: number) => {
  window.dispatchEvent(new CustomEvent('brix-needs-attention', {
    detail: { brixValue: value, date: new Date().toISOString() }
  }));
};

const VitalityEngine = () => {
  // INPUT
  const [inputValue, setInputValue] = useState('');
  
  // OUTPUT (Binary)
  const [signal, setSignal] = useState<Signal>('IDLE');
  
  // History
  const [logs, setLogs] = useState<BrixLog[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_BRIX_LOGS) || '[]');
    } catch { return []; }
  });
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BRIX_LOGS, JSON.stringify(logs));
  }, [logs]);

  // THE LOGIC
  const handleCheck = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0 || value > 30) return;
    
    // Binary threshold: 12
    const result: 'RED' | 'GREEN' = value < 12 ? 'RED' : 'GREEN';
    setSignal(result);
    
    // Log
    setLogs(prev => [{
      id: Date.now().toString(),
      date: new Date().toISOString(),
      value,
      signal: result,
    }, ...prev.slice(0, 9)]);
    
    // Cross-sync for deficiency
    if (result === 'RED') dispatchJournalPrompt(value);
  };

  const handleReset = () => {
    setInputValue('');
    setSignal('IDLE');
  };

  return (
    <div
      className="rounded-xl overflow-hidden transition-colors duration-300"
      style={{
        background: signal === 'RED' 
          ? 'linear-gradient(180deg, hsl(0 35% 12%), hsl(0 0% 8%))'
          : signal === 'GREEN'
          ? 'linear-gradient(180deg, hsl(120 25% 12%), hsl(0 0% 8%))'
          : 'hsl(195 20% 10%)',
        border: `2px solid ${
          signal === 'RED' ? 'hsl(0 70% 50%)' 
          : signal === 'GREEN' ? 'hsl(120 60% 45%)' 
          : 'hsl(195 50% 40%)'
        }`,
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
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-5 h-5" style={{ color: 'hsl(195 60% 60%)' }} />
          <h3
            className="text-lg tracking-wider"
            style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(195 60% 65%)' }}
          >
            VITALITY CHECK
          </h3>
          <LearnMoreButton wisdomKey="carver-regeneration" size="sm" />
        </div>
      </div>

      {/* INPUT */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(195 50% 60%)' }}>
            INPUT: BRIX VALUE
          </span>
        </div>
        
        <div className="flex gap-2">
          <Input
            type="number"
            min="0"
            max="30"
            step="0.1"
            placeholder="0-30"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (signal !== 'IDLE') setSignal('IDLE');
            }}
            className="font-mono text-2xl h-14 text-center"
            style={{
              background: 'hsl(0 0% 8%)',
              border: '2px solid hsl(195 40% 30%)',
              color: 'hsl(195 70% 70%)',
            }}
          />
          <Button
            onClick={handleCheck}
            disabled={!inputValue}
            className="h-14 px-6 text-lg"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              background: 'linear-gradient(135deg, hsl(195 60% 40%), hsl(210 50% 35%))',
              border: '2px solid hsl(195 50% 50%)',
              color: 'white',
            }}
          >
            CHECK
          </Button>
        </div>

        {/* Threshold Legend */}
        <div className="mt-3 flex justify-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(0 70% 50%)' }} />
            <span className="text-[10px] font-mono" style={{ color: 'hsl(0 60% 60%)' }}>
              {'<12 RED'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(120 60% 45%)' }} />
            <span className="text-[10px] font-mono" style={{ color: 'hsl(120 50% 60%)' }}>
              12+ GREEN
            </span>
          </div>
        </div>
      </div>

      {/* OUTPUT (Binary Signal) */}
      <AnimatePresence>
        {signal !== 'IDLE' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div
              className="p-4 rounded-xl flex items-center gap-4"
              style={{
                background: signal === 'RED' ? 'hsl(0 40% 12%)' : 'hsl(120 30% 12%)',
                border: `2px solid ${signal === 'RED' ? 'hsl(0 60% 45%)' : 'hsl(120 50% 45%)'}`,
              }}
            >
              {/* Signal Light */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: signal === 'RED' 
                    ? 'radial-gradient(circle, hsl(0 70% 50%) 0%, hsl(0 60% 35%) 100%)'
                    : 'radial-gradient(circle, hsl(120 60% 45%) 0%, hsl(120 50% 30%) 100%)',
                  boxShadow: signal === 'RED'
                    ? '0 0 30px hsl(0 70% 50% / 0.6)'
                    : '0 0 30px hsl(120 60% 45% / 0.6)',
                }}
              >
                {signal === 'RED' ? (
                  <AlertTriangle className="w-7 h-7 text-white" />
                ) : (
                  <CheckCircle className="w-7 h-7 text-white" />
                )}
              </div>
              
              {/* Message */}
              <div>
                <h4
                  className="text-lg tracking-wider"
                  style={{
                    fontFamily: "'Staatliches', sans-serif",
                    color: signal === 'RED' ? 'hsl(0 70% 65%)' : 'hsl(120 60% 65%)',
                  }}
                >
                  {signal === 'RED' ? 'DEFICIENCY DETECTED' : 'RESONANCE HIGH'}
                </h4>
                <p className="text-sm font-mono" style={{ color: 'hsl(0 0% 65%)' }}>
                  {signal === 'RED' 
                    ? 'Intercept with Mineral Anchor / Sea Agri.'
                    : 'Flow State. Maintain.'}
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleReset}
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
      
      {/* Recent (minimal) */}
      {logs.length > 0 && signal === 'IDLE' && (
        <div className="px-4 pb-4">
          <div className="flex gap-1.5 overflow-x-auto">
            {logs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="shrink-0 px-2 py-1 rounded text-center"
                style={{
                  background: log.signal === 'RED' ? 'hsl(0 30% 15%)' : 'hsl(120 25% 15%)',
                  border: `1px solid ${log.signal === 'RED' ? 'hsl(0 50% 40%)' : 'hsl(120 40% 40%)'}`,
                }}
              >
                <span
                  className="text-sm font-mono font-bold"
                  style={{ color: log.signal === 'RED' ? 'hsl(0 60% 60%)' : 'hsl(120 50% 60%)' }}
                >
                  {log.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalityEngine;
