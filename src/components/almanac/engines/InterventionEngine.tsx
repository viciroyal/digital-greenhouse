import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Ban, Bug, MapPin, Droplets, Clock, Leaf } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE INTERVENTION PROTOCOL (Restraint Logic)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PHILOSOPHY: The "Do Nothing" Method (Fukuoka)
 * 
 * CONSTRAINT A (No-Till): Block "Rototill" → Suggest Broadfork/Occultation
 * CONSTRAINT B (Pest Balance): Aphids → Check Nitrogen → "Stop Feeding. Wait."
 * CONSTRAINT C (Zone Efficiency): 396Hz crops must be Zone 1 (closest)
 */

// FORBIDDEN ACTIONS (Constraint A)
interface ForbiddenAction {
  keywords: string[];
  name: string;
  alternatives: string[];
  citation: string;
}

const FORBIDDEN_ACTIONS: ForbiddenAction[] = [
  {
    keywords: ['rototill', 'roto-till', 'roto till', 'rotovate'],
    name: 'Rototilling',
    alternatives: ['Broadfork', 'Occultation (Tarping)', 'Sheet Mulching'],
    citation: 'The soil is a living city. Would you rototill a city?',
  },
  {
    keywords: ['till', 'tilling', 'plow', 'plowing', 'plough'],
    name: 'Tilling/Plowing',
    alternatives: ['No-till seeding', 'Chop and drop', 'Cover cropping'],
    citation: 'To plow is to wound. To till is to kill.',
  },
  {
    keywords: ['pesticide', 'herbicide', 'fungicide', 'insecticide', '-cide'],
    name: 'Chemical Application',
    alternatives: ['Companion planting', 'Beneficial insects', 'Neem oil (if needed)'],
    citation: 'The chemical path leads to dependency, not freedom.',
  },
  {
    keywords: ['synthetic fertilizer', 'miracle-gro', 'miracle gro', 'chemical fertilizer'],
    name: 'Synthetic Fertilizer',
    alternatives: ['Compost tea', 'Worm castings', 'Cover crops'],
    citation: 'Feed the soil, not the plant.',
  },
];

// PEST → CAUSE MAPPING (Constraint B)
interface PestDiagnosis {
  pest: string;
  keywords: string[];
  likelyCause: string;
  directive: string;
  actions: string[];
  icon: 'nitrogen' | 'water' | 'balance';
}

const PEST_DIAGNOSES: PestDiagnosis[] = [
  {
    pest: 'Aphids',
    keywords: ['aphid', 'aphids', 'greenfly', 'blackfly'],
    likelyCause: 'High Nitrogen Input',
    directive: 'Stop Feeding. Spray Water. Wait.',
    actions: ['Stop nitrogen applications', 'Spray with water only', 'Wait 7 days before reassessing'],
    icon: 'nitrogen',
  },
  {
    pest: 'Whiteflies',
    keywords: ['whitefly', 'whiteflies', 'white fly'],
    likelyCause: 'Nitrogen Imbalance / Stressed Plants',
    directive: 'Check watering. Reduce feeding. Introduce lacewings.',
    actions: ['Check soil moisture', 'Stop fertilizing', 'Consider beneficial insects'],
    icon: 'balance',
  },
  {
    pest: 'Powdery Mildew',
    keywords: ['powdery mildew', 'white powder', 'mildew'],
    likelyCause: 'Poor Air Circulation / Overwatering',
    directive: 'Increase spacing. Reduce watering. Wait.',
    actions: ['Thin plants for airflow', 'Water at soil level only', 'Remove affected leaves'],
    icon: 'water',
  },
  {
    pest: 'Slugs',
    keywords: ['slug', 'slugs', 'snail', 'snails'],
    likelyCause: 'Excess Moisture / Lack of Predators',
    directive: 'Reduce watering. Encourage ground beetles. Wait.',
    actions: ['Let soil surface dry', 'Add habitat for predators', 'Copper barriers if severe'],
    icon: 'water',
  },
];

// ZONE EFFICIENCY (Constraint C)
interface ZoneRule {
  hz: number;
  name: string;
  requiredZone: number;
  reason: string;
}

const ZONE_EFFICIENCY_RULES: ZoneRule[] = [
  { hz: 396, name: 'Root Crops (Tomatoes, Peppers)', requiredZone: 1, reason: 'High maintenance. Daily attention required.' },
  { hz: 417, name: 'Flow Crops (Sweet Potato, Squash)', requiredZone: 2, reason: 'Moderate attention. Weekly check-ins.' },
  { hz: 528, name: 'Solar Crops (Corn, Beans)', requiredZone: 3, reason: 'Self-sustaining polyculture. Occasional attention.' },
  { hz: 963, name: 'Source Crops (Garlic, Onions)', requiredZone: 4, reason: 'Set and forget. Seasonal attention only.' },
];

type ConstraintMode = 'task' | 'pest' | 'zone';

interface Alert {
  type: 'block' | 'warning' | 'info';
  title: string;
  message: string;
  alternatives?: string[];
  actions?: string[];
  wisdomKey?: string;
}

const InterventionEngine = () => {
  const [mode, setMode] = useState<ConstraintMode>('task');
  const [taskInput, setTaskInput] = useState('');
  const [pestInput, setPestInput] = useState('');
  const [selectedHz, setSelectedHz] = useState<number | null>(null);
  const [placementZone, setPlacementZone] = useState<number | null>(null);
  
  const [alert, setAlert] = useState<Alert | null>(null);

  // CONSTRAINT A: Check for forbidden actions
  const checkTask = () => {
    const input = taskInput.toLowerCase();
    
    for (const action of FORBIDDEN_ACTIONS) {
      if (action.keywords.some(kw => input.includes(kw))) {
        setAlert({
          type: 'block',
          title: `⛔ BLOCKED: ${action.name}`,
          message: action.citation,
          alternatives: action.alternatives,
          wisdomKey: 'fukuoka-no-till',
        });
        return;
      }
    }
    
    // Task is allowed
    setAlert({
      type: 'info',
      title: '✓ TASK APPROVED',
      message: 'This action aligns with regenerative principles.',
    });
  };

  // CONSTRAINT B: Diagnose pest issue
  const checkPest = () => {
    const input = pestInput.toLowerCase();
    
    for (const diagnosis of PEST_DIAGNOSES) {
      if (diagnosis.keywords.some(kw => input.includes(kw))) {
        setAlert({
          type: 'warning',
          title: `🔍 ${diagnosis.pest.toUpperCase()} DETECTED`,
          message: `Likely Cause: ${diagnosis.likelyCause}`,
          actions: [diagnosis.directive, ...diagnosis.actions],
          wisdomKey: 'fukuoka-do-nothing',
        });
        return;
      }
    }
    
    // Unknown pest
    setAlert({
      type: 'info',
      title: 'PEST NOT RECOGNIZED',
      message: 'Observe for 7 days before intervening. Most issues resolve naturally.',
      actions: ['Wait and observe', 'Check soil moisture', 'Review nitrogen inputs'],
    });
  };

  // CONSTRAINT C: Check zone efficiency
  const checkZone = () => {
    if (!selectedHz || !placementZone) return;
    
    const rule = ZONE_EFFICIENCY_RULES.find(r => r.hz === selectedHz);
    if (!rule) return;
    
    if (placementZone > rule.requiredZone) {
      setAlert({
        type: 'warning',
        title: '⚠️ EFFICIENCY ALERT',
        message: `${rule.name} placed in Zone ${placementZone}, but requires Zone ${rule.requiredZone} or closer.`,
        actions: [`Move to Zone ${rule.requiredZone}`, rule.reason],
        wisdomKey: 'permaculture-zones',
      });
    } else {
      setAlert({
        type: 'info',
        title: '✓ ZONE OPTIMAL',
        message: `${rule.name} correctly placed in Zone ${placementZone}.`,
      });
    }
  };

  const resetAlert = () => {
    setAlert(null);
    setTaskInput('');
    setPestInput('');
    setSelectedHz(null);
    setPlacementZone(null);
  };

  const modes = [
    { id: 'task' as const, label: 'TASK CHECK', icon: Ban },
    { id: 'pest' as const, label: 'PEST BALANCE', icon: Bug },
    { id: 'zone' as const, label: 'ZONE EFFICIENCY', icon: MapPin },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(0 15% 10%)',
        border: '2px solid hsl(0 40% 40%)',
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: 'linear-gradient(135deg, hsl(0 25% 15%), hsl(0 20% 10%))',
          borderBottom: '1px solid hsl(0 30% 25%)',
        }}
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" style={{ color: 'hsl(0 60% 60%)' }} />
          <h3
            className="text-lg tracking-wider"
            style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(0 60% 65%)' }}
          >
            INTERVENTION PROTOCOL
          </h3>
        </div>
        <p className="text-[10px] font-mono mt-1" style={{ color: 'hsl(0 30% 50%)' }}>
          The "Do Nothing" Method • Restraint Logic
        </p>
      </div>

      {/* Mode Selector */}
      <div className="p-4 pb-2">
        <div className="flex rounded-lg overflow-hidden" style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)' }}>
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 transition-all"
                style={{
                  background: isActive ? 'hsl(0 25% 18%)' : 'transparent',
                  borderBottom: isActive ? '2px solid hsl(0 50% 55%)' : '2px solid transparent',
                }}
                onClick={() => { setMode(m.id); resetAlert(); }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: isActive ? 'hsl(0 60% 60%)' : 'hsl(0 0% 45%)' }} />
                <span className="text-[9px] font-mono" style={{ color: isActive ? 'hsl(0 60% 60%)' : 'hsl(0 0% 45%)' }}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONSTRAINT A: Task Check */}
      <AnimatePresence mode="wait">
        {mode === 'task' && (
          <motion.div
            key="task"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 pt-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(0 50% 55%)' }}>
                INPUT: PLANNED TASK
              </span>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Rototill the garden bed"
                value={taskInput}
                onChange={(e) => { setTaskInput(e.target.value); if (alert) setAlert(null); }}
                className="font-mono text-sm"
                style={{
                  background: 'hsl(0 0% 8%)',
                  border: '2px solid hsl(0 30% 30%)',
                  color: 'hsl(0 0% 70%)',
                }}
              />
              <Button
                onClick={checkTask}
                disabled={!taskInput.trim()}
                className="px-4"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  background: 'linear-gradient(135deg, hsl(0 50% 40%), hsl(0 40% 30%))',
                  border: '2px solid hsl(0 50% 50%)',
                  color: 'white',
                }}
              >
                CHECK
              </Button>
            </div>
            
            <p className="text-[9px] font-mono mt-2 text-center" style={{ color: 'hsl(0 0% 40%)' }}>
              Validates against Fukuoka No-Till principles
            </p>
          </motion.div>
        )}

        {/* CONSTRAINT B: Pest Balance */}
        {mode === 'pest' && (
          <motion.div
            key="pest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 pt-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(30 60% 55%)' }}>
                INPUT: OBSERVED PEST
              </span>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Aphids on tomatoes"
                value={pestInput}
                onChange={(e) => { setPestInput(e.target.value); if (alert) setAlert(null); }}
                className="font-mono text-sm"
                style={{
                  background: 'hsl(0 0% 8%)',
                  border: '2px solid hsl(30 40% 30%)',
                  color: 'hsl(0 0% 70%)',
                }}
              />
              <Button
                onClick={checkPest}
                disabled={!pestInput.trim()}
                className="px-4"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  background: 'linear-gradient(135deg, hsl(30 50% 40%), hsl(30 40% 30%))',
                  border: '2px solid hsl(30 50% 50%)',
                  color: 'white',
                }}
              >
                DIAGNOSE
              </Button>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Aphids', 'Whiteflies', 'Mildew', 'Slugs'].map((pest) => (
                <button
                  key={pest}
                  onClick={() => setPestInput(pest)}
                  className="text-[9px] font-mono px-2 py-1 rounded"
                  style={{
                    background: 'hsl(0 0% 12%)',
                    border: '1px solid hsl(0 0% 25%)',
                    color: 'hsl(0 0% 55%)',
                  }}
                >
                  {pest}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* CONSTRAINT C: Zone Efficiency */}
        {mode === 'zone' && (
          <motion.div
            key="zone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 pt-2"
          >
            <div className="space-y-3">
              {/* Frequency Selection */}
              <div>
                <span className="text-[10px] font-mono block mb-1.5" style={{ color: 'hsl(210 50% 55%)' }}>
                  CROP FREQUENCY:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {ZONE_EFFICIENCY_RULES.map((rule) => (
                    <button
                      key={rule.hz}
                      onClick={() => { setSelectedHz(rule.hz); if (alert) setAlert(null); }}
                      className="py-2 rounded text-center"
                      style={{
                        background: selectedHz === rule.hz ? 'hsl(210 30% 20%)' : 'hsl(0 0% 10%)',
                        border: `2px solid ${selectedHz === rule.hz ? 'hsl(210 50% 50%)' : 'hsl(0 0% 20%)'}`,
                      }}
                    >
                      <span
                        className="text-sm font-mono font-bold block"
                        style={{ color: selectedHz === rule.hz ? 'hsl(210 60% 65%)' : 'hsl(0 0% 50%)' }}
                      >
                        {rule.hz}Hz
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Placement Zone */}
              <div>
                <span className="text-[10px] font-mono block mb-1.5" style={{ color: 'hsl(120 40% 50%)' }}>
                  PLACEMENT ZONE:
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((zone) => (
                    <button
                      key={zone}
                      onClick={() => { setPlacementZone(zone); if (alert) setAlert(null); }}
                      className="py-2 rounded text-center"
                      style={{
                        background: placementZone === zone ? 'hsl(120 25% 18%)' : 'hsl(0 0% 10%)',
                        border: `2px solid ${placementZone === zone ? 'hsl(120 40% 45%)' : 'hsl(0 0% 20%)'}`,
                      }}
                    >
                      <span
                        className="text-sm font-mono font-bold"
                        style={{ color: placementZone === zone ? 'hsl(120 50% 60%)' : 'hsl(0 0% 50%)' }}
                      >
                        Z{zone}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[8px] font-mono text-center mt-1" style={{ color: 'hsl(0 0% 40%)' }}>
                  Z1 = Closest to home • Z5 = Farthest
                </p>
              </div>
              
              <Button
                onClick={checkZone}
                disabled={!selectedHz || !placementZone}
                className="w-full"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  background: 'linear-gradient(135deg, hsl(210 50% 40%), hsl(210 40% 30%))',
                  border: '2px solid hsl(210 50% 50%)',
                  color: 'white',
                }}
              >
                CHECK EFFICIENCY
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ALERT OUTPUT */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div
              className="p-4 rounded-xl"
              style={{
                background: alert.type === 'block' 
                  ? 'hsl(0 35% 12%)' 
                  : alert.type === 'warning'
                  ? 'hsl(35 30% 12%)'
                  : 'hsl(120 25% 12%)',
                border: `2px solid ${
                  alert.type === 'block' 
                    ? 'hsl(0 60% 50%)' 
                    : alert.type === 'warning'
                    ? 'hsl(35 60% 50%)'
                    : 'hsl(120 50% 45%)'
                }`,
              }}
            >
              {/* Alert Header */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: alert.type === 'block'
                      ? 'radial-gradient(circle, hsl(0 60% 50%) 0%, hsl(0 50% 35%) 100%)'
                      : alert.type === 'warning'
                      ? 'radial-gradient(circle, hsl(35 60% 50%) 0%, hsl(35 50% 35%) 100%)'
                      : 'radial-gradient(circle, hsl(120 50% 45%) 0%, hsl(120 40% 30%) 100%)',
                    boxShadow: `0 0 20px ${
                      alert.type === 'block' ? 'hsl(0 60% 50% / 0.5)' 
                      : alert.type === 'warning' ? 'hsl(35 60% 50% / 0.5)'
                      : 'hsl(120 50% 45% / 0.5)'
                    }`,
                  }}
                >
                  {alert.type === 'block' ? (
                    <Ban className="w-5 h-5 text-white" />
                  ) : alert.type === 'warning' ? (
                    <Clock className="w-5 h-5 text-white" />
                  ) : (
                    <Leaf className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className="text-sm tracking-wider"
                    style={{
                      fontFamily: "'Staatliches', sans-serif",
                      color: alert.type === 'block' 
                        ? 'hsl(0 70% 65%)' 
                        : alert.type === 'warning'
                        ? 'hsl(35 70% 65%)'
                        : 'hsl(120 60% 60%)',
                    }}
                  >
                    {alert.title}
                  </h4>
                  <p className="text-xs font-mono" style={{ color: 'hsl(0 0% 60%)' }}>
                    {alert.message}
                  </p>
                </div>
                {alert.wisdomKey && (
                  <LearnMoreButton wisdomKey={alert.wisdomKey} size="sm" />
                )}
              </div>
              
              {/* Alternatives (for blocked actions) */}
              {alert.alternatives && (
                <div className="mb-3">
                  <span className="text-[10px] font-mono block mb-1.5" style={{ color: 'hsl(120 50% 55%)' }}>
                    ✓ ALTERNATIVES:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {alert.alternatives.map((alt) => (
                      <div
                        key={alt}
                        className="px-2 py-1 rounded"
                        style={{
                          background: 'hsl(120 20% 15%)',
                          border: '1px solid hsl(120 40% 40%)',
                        }}
                      >
                        <span className="text-xs font-mono" style={{ color: 'hsl(120 50% 60%)' }}>
                          {alt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Actions (for warnings) */}
              {alert.actions && (
                <div>
                  <span className="text-[10px] font-mono block mb-1.5" style={{ color: 'hsl(35 60% 60%)' }}>
                    DIRECTIVE:
                  </span>
                  <div className="space-y-1">
                    {alert.actions.map((action, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-2 py-1.5 rounded"
                        style={{ background: 'hsl(0 0% 10%)' }}
                      >
                        {i === 0 ? (
                          <Droplets className="w-3.5 h-3.5 shrink-0" style={{ color: 'hsl(195 60% 55%)' }} />
                        ) : (
                          <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>{i}.</span>
                          </div>
                        )}
                        <span
                          className="text-xs font-mono"
                          style={{ color: i === 0 ? 'hsl(195 60% 65%)' : 'hsl(0 0% 55%)' }}
                        >
                          {action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button
              onClick={resetAlert}
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
  );
};

export default InterventionEngine;
