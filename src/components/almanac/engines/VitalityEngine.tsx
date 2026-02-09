import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE VITALITY ENGINE (BRIX CHECK)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * GOAL: Immediate course correction. Binary logic only.
 * 
 * LOGIC:
 * 1. INPUT: User enters NIR Spectroscopy value (0-30)
 * 2. THRESHOLD: 12.0 is the dividing line
 * 3. OUTPUT:
 *    - RED (< 12): "Low Energy. Apply Mineral Anchor / Sea Agri."
 *    - GREEN (≥ 12): "Optimal Flow. Maintain."
 */

// Storage key for Brix logs
const STORAGE_KEY_BRIX_LOGS = 'pharmer-brix-logs';

// Logic states - BINARY ONLY
type LogicState = 'IDLE' | 'RED' | 'GREEN';

interface BrixLog {
  id: string;
  date: string;
  value: number;
  state: 'RED' | 'GREEN';
}

// Cross-sync event for journal
const dispatchJournalPrompt = (brixValue: number) => {
  const event = new CustomEvent('brix-needs-attention', {
    detail: { brixValue, date: new Date().toISOString() }
  });
  window.dispatchEvent(event);
};

const VitalityEngine = () => {
  // INPUT STATE
  const [inputValue, setInputValue] = useState('');
  
  // OUTPUT STATE
  const [logicState, setLogicState] = useState<LogicState>('IDLE');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Brix history
  const [logs, setLogs] = useState<BrixLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRIX_LOGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  // Persist logs
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BRIX_LOGS, JSON.stringify(logs));
  }, [logs]);

  // THE LOGIC: Threshold check
  const handleValidate = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0 || value > 32) return;
    
    setIsProcessing(true);
    
    // Brief processing animation
    setTimeout(() => {
      // THRESHOLD LOGIC: 12.0 is the dividing line
      const state: 'RED' | 'GREEN' = value < 12 ? 'RED' : 'GREEN';
      setLogicState(state);
      setIsProcessing(false);
      
      // Log the reading
      const newLog: BrixLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        value,
        state,
      };
      setLogs(prev => [newLog, ...prev.slice(0, 9)]);
      
      // Cross-sync for low readings
      if (state === 'RED') {
        dispatchJournalPrompt(value);
      }
    }, 400);
  };

  const handleReset = () => {
    setInputValue('');
    setLogicState('IDLE');
  };

  // Dynamic border/background based on state
  const getStateStyles = () => {
    switch (logicState) {
      case 'RED':
        return {
          background: 'linear-gradient(180deg, hsl(0 35% 12%), hsl(0 0% 8%))',
          border: '3px solid hsl(0 70% 50%)',
        };
      case 'GREEN':
        return {
          background: 'linear-gradient(180deg, hsl(120 25% 12%), hsl(0 0% 8%))',
          border: '3px solid hsl(120 60% 45%)',
        };
      default:
        return {
          background: 'hsl(195 20% 10%)',
          border: '2px solid hsl(195 50% 40%)',
        };
    }
  };

  return (
    <div className="rounded-xl overflow-hidden" style={getStateStyles()}>
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
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(195 60% 65%)',
            }}
          >
            VITALITY ENGINE
          </h3>
          <LearnMoreButton wisdomKey="carver-regeneration" size="sm" />
        </div>
        <p
          className="text-xs font-mono mt-1"
          style={{ color: 'hsl(195 40% 50%)' }}
        >
          INPUT → THRESHOLD → OUTPUT
        </p>
      </div>

      {/* INPUT PANEL */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-sm font-mono tracking-widest font-bold"
            style={{ color: 'hsl(195 50% 60%)' }}
          >
            INPUT: BRIX VALUE (0-30)
          </span>
        </div>
        
        <div className="flex gap-3">
          <Input
            type="number"
            min="0"
            max="32"
            step="0.1"
            placeholder="Enter reading..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (logicState !== 'IDLE') setLogicState('IDLE');
            }}
            className="font-mono text-2xl h-16 text-center"
            style={{
              background: 'hsl(0 0% 8%)',
              border: '2px solid hsl(195 40% 30%)',
              color: 'hsl(195 70% 70%)',
            }}
          />
          <Button
            onClick={handleValidate}
            disabled={!inputValue || isProcessing}
            className="h-16 px-8 text-lg"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              letterSpacing: '0.1em',
              background: 'linear-gradient(135deg, hsl(195 60% 40%), hsl(210 50% 35%))',
              border: '2px solid hsl(195 50% 50%)',
              color: 'white',
            }}
          >
            {isProcessing ? '...' : 'CHECK'}
          </Button>
        </div>

        {/* Threshold Indicator */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: 'hsl(0 70% 50%)', boxShadow: '0 0 10px hsl(0 70% 50% / 0.5)' }}
            />
            <span className="text-xs font-mono" style={{ color: 'hsl(0 60% 60%)' }}>
              0-11 (DEFICIENT)
            </span>
          </div>
          <div
            className="w-px h-6"
            style={{ background: 'hsl(0 0% 30%)' }}
          />
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: 'hsl(120 60% 45%)', boxShadow: '0 0 10px hsl(120 60% 45% / 0.5)' }}
            />
            <span className="text-xs font-mono" style={{ color: 'hsl(120 50% 60%)' }}>
              12+ (RESONANT)
            </span>
          </div>
        </div>
      </div>

      {/* OUTPUT PANEL */}
      <AnimatePresence>
        {logicState !== 'IDLE' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 pt-0"
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-sm font-mono tracking-widest font-bold"
                style={{ 
                  color: logicState === 'RED' ? 'hsl(0 60% 60%)' : 'hsl(120 50% 60%)',
                }}
              >
                OUTPUT: {logicState === 'RED' ? 'DEFICIENCY DETECTED' : 'OPTIMAL FLOW'}
              </span>
            </div>
            
            <div
              className="p-4 rounded-xl flex items-start gap-4"
              style={{
                background: logicState === 'RED' ? 'hsl(0 40% 12%)' : 'hsl(120 30% 12%)',
                border: `2px solid ${logicState === 'RED' ? 'hsl(0 60% 45%)' : 'hsl(120 50% 45%)'}`,
              }}
            >
              {/* Status Icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: logicState === 'RED' 
                    ? 'radial-gradient(circle, hsl(0 70% 45%) 0%, hsl(0 60% 30%) 100%)'
                    : 'radial-gradient(circle, hsl(120 60% 40%) 0%, hsl(120 50% 25%) 100%)',
                  boxShadow: logicState === 'RED'
                    ? '0 0 30px hsl(0 70% 45% / 0.6)'
                    : '0 0 30px hsl(120 60% 40% / 0.6)',
                }}
              >
                {logicState === 'RED' ? (
                  <AlertTriangle className="w-8 h-8 text-white" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-white" />
                )}
              </div>
              
              {/* Message */}
              <div className="flex-1">
                <h4
                  className="text-xl tracking-wider mb-2"
                  style={{
                    fontFamily: "'Staatliches', sans-serif",
                    color: logicState === 'RED' ? 'hsl(0 70% 65%)' : 'hsl(120 60% 65%)',
                  }}
                >
                  {logicState === 'RED' ? 'LOW ENERGY' : 'OPTIMAL FLOW'}
                </h4>
                <p
                  className="text-sm font-mono"
                  style={{ color: 'hsl(0 0% 70%)' }}
                >
                  {logicState === 'RED' 
                    ? 'Apply Mineral Anchor / Sea Agri. Consider foliar spray with compost tea.'
                    : 'Maintain current protocol. Continue weekly observation.'}
                </p>
                
                {/* Action Task for RED state */}
                {logicState === 'RED' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-3 p-3 rounded-lg"
                    style={{
                      background: 'hsl(45 30% 12%)',
                      border: '1px solid hsl(45 50% 35%)',
                    }}
                  >
                    <span
                      className="text-xs font-mono tracking-wider block mb-1"
                      style={{ color: 'hsl(45 60% 60%)' }}
                    >
                      TASK OUTPUT:
                    </span>
                    <p
                      className="text-sm font-mono font-bold"
                      style={{ color: 'hsl(45 70% 70%)' }}
                    >
                      Apply foliar spray (Compost Tea + Kelp) within 3 days
                    </p>
                  </motion.div>
                )}
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
      
      {/* Recent Logs (collapsed) */}
      {logs.length > 0 && logicState === 'IDLE' && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-mono tracking-wider"
              style={{ color: 'hsl(0 0% 45%)' }}
            >
              RECENT READINGS
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {logs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="shrink-0 px-3 py-2 rounded-lg text-center"
                style={{
                  background: log.state === 'RED' ? 'hsl(0 30% 15%)' : 'hsl(120 25% 15%)',
                  border: `1px solid ${log.state === 'RED' ? 'hsl(0 50% 40%)' : 'hsl(120 40% 40%)'}`,
                }}
              >
                <span
                  className="text-lg font-mono font-bold block"
                  style={{ color: log.state === 'RED' ? 'hsl(0 60% 60%)' : 'hsl(120 50% 60%)' }}
                >
                  {log.value}
                </span>
                <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                  {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
