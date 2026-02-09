import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Activity, Radio, Link2, ShieldAlert, Music, Star, Users } from 'lucide-react';
import { SovereigntyFooter } from '@/components/almanac';
import { DynamicSoilEngine, VitalityEngine, ResonanceEngine, CompanionEngine, InterventionEngine, HarmonicEngine, CelestialEngine, RolesEngine } from './engines';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE SILENT ENGINE PROTOCOL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PHILOSOPHY: Radical Efficiency. Input → Output is immediate.
 * 
 * EIGHT ENGINES:
 * 1. SOIL CALCULATOR  → Bed dimensions → Scaled recipe
 * 2. VITALITY CHECK   → Brix value → Binary signal (RED/GREEN)
 * 3. ZONE FILTER      → Frequency → Filtered view + accent color
 * 4. COMPANION        → Crop selection → Auto-suggested companions
 * 5. INTERVENTION     → Task/Pest/Zone → Restraint alerts
 * 6. HARMONIC         → Zone dependencies → Musical logic alerts
 * 7. CELESTIAL        → Cosmic timing → Gate validation
 * 8. ROLES            → Scientific modes → Task/Asset filtering
 */

type Engine = 'soil' | 'vitality' | 'zone' | 'companion' | 'intervene' | 'harmonic' | 'celestial' | 'roles';

const BeginnerFieldGuide = () => {
  const [activeEngine, setActiveEngine] = useState<Engine>('soil');

  const engines = [
    { id: 'soil' as const, label: 'SOIL', icon: Calculator, color: 'hsl(35 70% 55%)' },
    { id: 'vitality' as const, label: 'VITAL', icon: Activity, color: 'hsl(195 70% 55%)' },
    { id: 'zone' as const, label: 'ZONE', icon: Radio, color: 'hsl(270 60% 55%)' },
    { id: 'companion' as const, label: 'PAIR', icon: Link2, color: 'hsl(45 70% 55%)' },
    { id: 'intervene' as const, label: 'STOP', icon: ShieldAlert, color: 'hsl(0 60% 55%)' },
    { id: 'harmonic' as const, label: 'CHORD', icon: Music, color: 'hsl(280 60% 60%)' },
    { id: 'celestial' as const, label: 'SKY', icon: Star, color: 'hsl(45 80% 60%)' },
    { id: 'roles' as const, label: 'ROLE', icon: Users, color: 'hsl(120 50% 50%)' },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 pb-32">
      {/* Header - Minimal */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1
          className="text-2xl md:text-3xl tracking-[0.2em]"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            color: 'hsl(35 60% 60%)',
            textShadow: '0 0 20px hsl(35 50% 35% / 0.4)',
          }}
        >
          SCIENCE CORE
        </h1>
        <p className="text-[10px] font-mono tracking-widest mt-1" style={{ color: 'hsl(0 0% 45%)' }}>
          INPUT → OUTPUT
        </p>
      </motion.div>

      {/* Engine Tabs - Compact */}
      <motion.div
        className="flex rounded-lg overflow-hidden mb-4"
        style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {engines.map((engine) => {
          const Icon = engine.icon;
          const isActive = activeEngine === engine.id;
          return (
            <button
              key={engine.id}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 transition-all"
              style={{
                background: isActive ? `${engine.color}20` : 'transparent',
                borderBottom: isActive ? `2px solid ${engine.color}` : '2px solid transparent',
              }}
              onClick={() => setActiveEngine(engine.id)}
            >
              <Icon
                className="w-4 h-4"
                style={{ color: isActive ? engine.color : 'hsl(0 0% 45%)' }}
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {activeEngine === 'soil' && <DynamicSoilEngine />}
          {activeEngine === 'vitality' && <VitalityEngine />}
          {activeEngine === 'zone' && <ResonanceEngine />}
          {activeEngine === 'companion' && <CompanionEngine />}
          {activeEngine === 'intervene' && <InterventionEngine />}
          {activeEngine === 'harmonic' && <HarmonicEngine />}
          {activeEngine === 'celestial' && <CelestialEngine />}
          {activeEngine === 'roles' && <RolesEngine />}
        </motion.div>
      </AnimatePresence>

      <SovereigntyFooter />
    </div>
  );
};

export default BeginnerFieldGuide;
