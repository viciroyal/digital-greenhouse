import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Activity, Radio, Sprout } from 'lucide-react';
import { SovereigntyFooter } from '@/components/almanac';
import { DynamicSoilEngine, VitalityEngine, ResonanceEngine } from './engines';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE FIELD GUIDE - AGROMAJIC SCIENCE CORE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * A high-efficiency, logic-driven dashboard with three engines:
 * 
 * 1. DYNAMIC SOIL ENGINE (Bed Reset)
 *    Input → Calculation → Output
 *    
 * 2. VITALITY ENGINE (Brix Check)
 *    Input → Threshold → Output
 *    
 * 3. RESONANCE ENGINE (Zone Filter)
 *    Input → Filter → Output
 * 
 * PHILOSOPHY: Action Over Info. Direct Input → Output.
 */

type EngineTab = 'soil' | 'vitality' | 'resonance';

const BeginnerFieldGuide = () => {
  const [activeEngine, setActiveEngine] = useState<EngineTab>('soil');

  const engines = [
    { 
      id: 'soil' as const, 
      label: 'SOIL ENGINE', 
      icon: RefreshCw, 
      color: 'hsl(35 70% 55%)',
      description: 'Bed Reset',
    },
    { 
      id: 'vitality' as const, 
      label: 'VITALITY', 
      icon: Activity, 
      color: 'hsl(195 70% 55%)',
      description: 'Brix Check',
    },
    { 
      id: 'resonance' as const, 
      label: 'RESONANCE', 
      icon: Radio, 
      color: 'hsl(270 60% 55%)',
      description: 'Zone Filter',
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
            SCIENCE CORE
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
          AGROMAJIC ENGINES
        </h1>
        <p
          className="text-sm font-mono"
          style={{ color: 'hsl(35 40% 55%)' }}
        >
          Input → Logic → Output
        </p>
      </motion.div>

      {/* Engine Tabs */}
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
        {engines.map((engine) => {
          const Icon = engine.icon;
          const isActive = activeEngine === engine.id;
          return (
            <button
              key={engine.id}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-all"
              style={{
                background: isActive ? `${engine.color}20` : 'transparent',
                borderBottom: isActive ? `3px solid ${engine.color}` : '3px solid transparent',
              }}
              onClick={() => setActiveEngine(engine.id)}
            >
              <Icon
                className="w-5 h-5"
                style={{
                  color: isActive ? engine.color : 'hsl(0 0% 45%)',
                  filter: isActive ? `drop-shadow(0 0 5px ${engine.color})` : 'none',
                }}
              />
              <span
                className="text-[10px] font-mono tracking-wider"
                style={{ color: isActive ? engine.color : 'hsl(0 0% 45%)' }}
              >
                {engine.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Active Engine */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeEngine}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeEngine === 'soil' && <DynamicSoilEngine />}
          {activeEngine === 'vitality' && <VitalityEngine />}
          {activeEngine === 'resonance' && <ResonanceEngine />}
        </motion.div>
      </AnimatePresence>

      {/* Sovereignty Footer */}
      <SovereigntyFooter />
    </div>
  );
};

export default BeginnerFieldGuide;
