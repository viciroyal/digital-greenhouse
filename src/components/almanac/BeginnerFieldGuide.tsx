import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Activity, Radio, Link2, ShieldAlert, Music, Star, Users, Scale, Package, Recycle, BookOpen, Sprout, Tractor } from 'lucide-react';
import { SovereigntyFooter } from '@/components/almanac';
import { 
  DynamicSoilEngine, 
  VitalityEngine, 
  ResonanceEngine, 
  CompanionEngine, 
  InterventionEngine, 
  HarmonicEngine, 
  CelestialEngine, 
  RolesEngine,
  ExtractionEngine,
  DistributionEngine,
  RegenerationEngine,
  FrequencyProtocolReference,
} from './engines';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE SILENT ENGINE PROTOCOL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PHILOSOPHY: Radical Efficiency. Input → Output is immediate.
 * 
 * TWELVE ENGINES (3 Sections + Reference):
 * 
 * INPUT ENGINES:
 * 1. SOIL CALCULATOR  → Bed dimensions → Scaled recipe
 * 2. VITALITY CHECK   → Brix value → Binary signal (RED/GREEN)
 * 3. ZONE FILTER      → Frequency → Filtered view + accent color
 * 4. COMPANION        → Crop selection → Auto-suggested companions
 * 
 * LOGIC ENGINES:
 * 5. INTERVENTION     → Task/Pest/Zone → Restraint alerts
 * 6. HARMONIC         → Zone dependencies → Musical logic alerts
 * 7. CELESTIAL        → Cosmic timing → Gate validation
 * 8. ROLES            → Scientific modes → Task/Asset filtering
 * 
 * OUTPUT ENGINES:
 * 9. EXTRACTION       → Harvest → Quality tag + Feedback loop
 * 10. DISTRIBUTION    → CSA shares → Fair division + Scarcity alerts
 * 11. REGENERATION    → Waste → Role assignment + Legacy tasks
 * 
 * REFERENCE:
 * 12. PROTOCOL MAP    → Frequency → Role → Mineral → Soil Focus
 */

type Engine = 'soil' | 'vitality' | 'zone' | 'companion' | 'intervene' | 'harmonic' | 'celestial' | 'roles' | 'extract' | 'distribute' | 'regen' | 'protocol';
type ScienceMode = 'beginner' | 'farmer';

interface EngineConfig {
  id: Engine;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

const BeginnerFieldGuide = () => {
  const [activeEngine, setActiveEngine] = useState<Engine>('soil');
  const [scienceMode, setScienceMode] = useState<ScienceMode>(() => {
    try {
      const stored = localStorage.getItem('pharmer-science-mode');
      return (stored === 'beginner' || stored === 'farmer') ? stored : 'farmer';
    } catch { return 'farmer'; }
  });

  const isBeginnerMode = scienceMode === 'beginner';

  const toggleMode = () => {
    const newMode = scienceMode === 'beginner' ? 'farmer' : 'beginner';
    setScienceMode(newMode);
    localStorage.setItem('pharmer-science-mode', newMode);
  };

  // Grouped engines for organized display
  const inputEngines: EngineConfig[] = [
    { id: 'soil', label: 'SOIL', icon: Calculator, color: 'hsl(35 70% 55%)' },
    { id: 'vitality', label: 'VITAL', icon: Activity, color: 'hsl(195 70% 55%)' },
    { id: 'zone', label: 'ZONE', icon: Radio, color: 'hsl(270 60% 55%)' },
    { id: 'companion', label: 'PAIR', icon: Link2, color: 'hsl(45 70% 55%)' },
  ];

  const logicEngines: EngineConfig[] = [
    { id: 'intervene', label: 'STOP', icon: ShieldAlert, color: 'hsl(0 60% 55%)' },
    { id: 'harmonic', label: 'CHORD', icon: Music, color: 'hsl(280 60% 60%)' },
    { id: 'celestial', label: 'SKY', icon: Star, color: 'hsl(45 80% 60%)' },
    { id: 'roles', label: 'ROLE', icon: Users, color: 'hsl(120 50% 50%)' },
  ];

  const outputEngines: EngineConfig[] = [
    { id: 'extract', label: 'YIELD', icon: Scale, color: 'hsl(120 50% 55%)' },
    { id: 'distribute', label: 'CSA', icon: Package, color: 'hsl(210 60% 55%)' },
    { id: 'regen', label: 'CYCLE', icon: Recycle, color: 'hsl(35 60% 55%)' },
    { id: 'protocol', label: 'MAP', icon: BookOpen, color: 'hsl(270 50% 60%)' },
  ];

  const renderEngineRow = (engines: EngineConfig[], label: string) => (
    <div className="mb-2">
      <span className="text-[8px] font-mono tracking-widest mb-1 block text-center" style={{ color: 'hsl(0 0% 35%)' }}>
        {label}
      </span>
      <div
        className="flex rounded-lg overflow-hidden"
        style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)' }}
      >
        {engines.map((engine) => {
          const Icon = engine.icon;
          const isActive = activeEngine === engine.id;
          return (
            <button
              key={engine.id}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all"
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
                className="text-[8px] font-mono tracking-wider"
                style={{ color: isActive ? engine.color : 'hsl(0 0% 45%)' }}
              >
                {engine.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 pb-32">
      {/* Header with Mode Toggle */}
      <motion.div
        className="text-center mb-4"
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
          INPUT → LOGIC → OUTPUT
        </p>
        
        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={toggleMode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
            style={{
              background: isBeginnerMode ? 'hsl(120 30% 15%)' : 'hsl(35 30% 15%)',
              border: `1px solid ${isBeginnerMode ? 'hsl(120 50% 40%)' : 'hsl(35 50% 40%)'}`,
            }}
          >
            {isBeginnerMode ? (
              <Sprout className="w-4 h-4" style={{ color: 'hsl(120 50% 55%)' }} />
            ) : (
              <Tractor className="w-4 h-4" style={{ color: 'hsl(35 60% 55%)' }} />
            )}
            <span
              className="text-[10px] font-mono tracking-wider"
              style={{ color: isBeginnerMode ? 'hsl(120 50% 60%)' : 'hsl(35 60% 60%)' }}
            >
              {isBeginnerMode ? 'BEGINNER' : 'FARMER'}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Engine Tabs - Three Rows */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {renderEngineRow(inputEngines, 'INPUT')}
        {renderEngineRow(logicEngines, 'LOGIC')}
        {renderEngineRow(outputEngines, 'OUTPUT')}
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
          {activeEngine === 'zone' && <ResonanceEngine isBeginnerMode={isBeginnerMode} />}
          {activeEngine === 'companion' && <CompanionEngine />}
          {activeEngine === 'intervene' && <InterventionEngine />}
          {activeEngine === 'harmonic' && <HarmonicEngine />}
          {activeEngine === 'celestial' && <CelestialEngine />}
          {activeEngine === 'roles' && <RolesEngine />}
          {activeEngine === 'extract' && <ExtractionEngine />}
          {activeEngine === 'distribute' && <DistributionEngine />}
          {activeEngine === 'regen' && <RegenerationEngine />}
          {activeEngine === 'protocol' && <FrequencyProtocolReference isBeginnerMode={isBeginnerMode} />}
        </motion.div>
      </AnimatePresence>

      <SovereigntyFooter />
    </div>
  );
};

export default BeginnerFieldGuide;
