import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, AlertTriangle, CheckCircle, Shield, Droplets, Sprout, Sun, Crown, Ban, Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE HARMONIC PROTOCOL (Inter-Zone Dependency Engine)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CONCEPT: Like a musical root note supporting a chord, Soil Zones (396-417Hz)
 * must support Fruiting Zones (528-741Hz). The app ENFORCES these dependencies.
 * 
 * BIOLOGICAL RULES:
 * 1. Root Dependency (396Hz → 528Hz): "Nitrogen cannot be metabolized without Phosphorus"
 * 2. Flow Dependency (417Hz → 741Hz): "Fruit Swelling requires Consistent Hydration"
 * 3. Source Shield (963Hz → All): "The Crown Protects the Body"
 */

// Storage keys for persistent zone data
const STORAGE_KEY_ZONES = 'pharmer-zone-status';
const STORAGE_KEY_IRRIGATION = 'pharmer-irrigation-log';

// Event keys for cross-engine communication
const PEST_EVENT_KEY = 'pest-alert-triggered';
const ZONE_UPDATE_EVENT = 'zone-status-updated';

// ZONE STATUS INTERFACE
interface ZoneStatus {
  hz: number;
  name: string;
  element: string;
  nutrient: string;
  color: string;
  status: 'optimal' | 'warning' | 'critical' | 'no-data';
  metric: string;
  value: number;
  threshold: number;
  lastUpdated: string | null;
  icon: 'root' | 'flow' | 'solar' | 'heart' | 'voice' | 'vision' | 'crown';
}

// IRRIGATION LOG ENTRY
interface IrrigationLog {
  date: string;
  zoneHz: number;
  amount: number; // gallons
  method: 'drip' | 'overhead' | 'manual';
}

// HARMONIC DEPENDENCY RULE
interface HarmonicRule {
  id: string;
  name: string;
  biologicalRule: string;
  sourceHz: number;
  targetHz: number;
  sourceElement: string;
  targetElement: string;
  blockMessage: string;
  resolveAction: string;
  wisdomKey: string;
}

// THE THREE HARMONIC RULES
const HARMONIC_RULES: HarmonicRule[] = [
  {
    id: 'root-to-solar',
    name: 'THE ROOT DEPENDENCY',
    biologicalRule: 'Nitrogen (Vegetative Energy) cannot be metabolized without Phosphorus (Root Energy).',
    sourceHz: 396,
    targetHz: 528,
    sourceElement: 'Phosphorus/Root Health',
    targetElement: 'Solar Energy/Nitrogen',
    blockMessage: 'Harmonic Error: Solar Energy (528Hz) requires Strong Roots (396Hz). Verify Phosphorus/Root Health first.',
    resolveAction: 'Apply Bone Meal or Rock Phosphate to Zone 1 before proceeding.',
    wisdomKey: 'ingham-soil-food-web',
  },
  {
    id: 'flow-to-expression',
    name: 'THE FLOW DEPENDENCY',
    biologicalRule: 'Fruit Swelling (Potassium) requires Consistent Hydration (Water).',
    sourceHz: 417,
    targetHz: 741,
    sourceElement: 'Water Flow/Hydration',
    targetElement: 'Fruit Expression/Potassium',
    blockMessage: 'Harmonic Error: Fruit Expression (741Hz) is stalled. Stabilize Flow (417Hz) before feeding.',
    resolveAction: 'Establish consistent irrigation schedule (every 2-3 days) before fruit feeding.',
    wisdomKey: 'hermetic-vibration',
  },
  {
    id: 'source-shield',
    name: 'THE SOURCE SHIELD',
    biologicalRule: 'The Crown Protects the Body.',
    sourceHz: 963,
    targetHz: 0, // Applies to all
    sourceElement: 'Violet Shield (Garlic/Onion)',
    targetElement: 'All Zones',
    blockMessage: 'Defensive Maneuver Required.',
    resolveAction: 'Deploy the Violet Shield (Garlic/Onion Guild) to the affected area immediately.',
    wisdomKey: 'dogon-seed-lineage',
  },
];

// Initial zone statuses
const INITIAL_ZONES: ZoneStatus[] = [
  { hz: 396, name: 'ROOT', element: 'Earth', nutrient: 'Phosphorus', color: 'hsl(0 60% 50%)', status: 'no-data', metric: 'P-Level', value: 0, threshold: 60, lastUpdated: null, icon: 'root' },
  { hz: 417, name: 'SACRAL', element: 'Water', nutrient: 'Hydration', color: 'hsl(30 70% 50%)', status: 'no-data', metric: 'Moisture', value: 0, threshold: 50, lastUpdated: null, icon: 'flow' },
  { hz: 528, name: 'SOLAR', element: 'Fire', nutrient: 'Nitrogen', color: 'hsl(51 80% 50%)', status: 'no-data', metric: 'N-Level', value: 0, threshold: 60, lastUpdated: null, icon: 'solar' },
  { hz: 639, name: 'HEART', element: 'Air', nutrient: 'Calcium', color: 'hsl(120 50% 45%)', status: 'no-data', metric: 'Ca-Level', value: 0, threshold: 55, lastUpdated: null, icon: 'heart' },
  { hz: 741, name: 'THROAT', element: 'Ether', nutrient: 'Potassium', color: 'hsl(210 60% 50%)', status: 'no-data', metric: 'K-Level', value: 0, threshold: 50, lastUpdated: null, icon: 'voice' },
  { hz: 852, name: 'THIRD EYE', element: 'Light', nutrient: 'Trace Minerals', color: 'hsl(270 50% 50%)', status: 'no-data', metric: 'Trace', value: 0, threshold: 40, lastUpdated: null, icon: 'vision' },
  { hz: 963, name: 'SOURCE', element: 'Spirit', nutrient: 'Vitality', color: 'hsl(300 50% 50%)', status: 'no-data', metric: 'Vitality', value: 0, threshold: 70, lastUpdated: null, icon: 'crown' },
];

// Task definition
interface PlannedTask {
  hz: number;
  name: string;
  crop: string;
  action: string;
}

const PLANNABLE_TASKS: PlannedTask[] = [
  { hz: 528, name: 'SOLAR PLEXUS', crop: 'Corn/Beans/Sunflowers', action: 'Nitrogen Feeding' },
  { hz: 741, name: 'THROAT', crop: 'Blueberries/Grapes', action: 'Potassium Boost' },
  { hz: 639, name: 'HEART', crop: 'Kale/Broccoli', action: 'Calcium Application' },
  { hz: 852, name: 'THIRD EYE', crop: 'Eggplant/Herbs', action: 'Trace Mineral Spray' },
];

// Alert types
type AlertType = 'block' | 'shield' | 'success';

interface HarmonicAlert {
  type: AlertType;
  rule: HarmonicRule;
  sourceZone?: ZoneStatus;
  targetTask?: PlannedTask;
  irrigationIssue?: string;
}

const HarmonicEngine = () => {
  // Zone statuses (persisted)
  const [zones, setZones] = useState<ZoneStatus[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ZONES);
      return stored ? JSON.parse(stored) : INITIAL_ZONES;
    } catch { return INITIAL_ZONES; }
  });
  
  // Irrigation logs (persisted)
  const [irrigationLogs, setIrrigationLogs] = useState<IrrigationLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_IRRIGATION);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  
  // Selected task
  const [selectedTask, setSelectedTask] = useState<PlannedTask | null>(null);
  
  // Active alert
  const [alert, setAlert] = useState<HarmonicAlert | null>(null);
  
  // Task blocked state
  const [isBlocked, setIsBlocked] = useState(false);
  
  // Pest alert active (from other engines)
  const [pestAlertActive, setPestAlertActive] = useState(false);
  
  // Persist zone status
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ZONES, JSON.stringify(zones));
    window.dispatchEvent(new CustomEvent(ZONE_UPDATE_EVENT, { detail: zones }));
  }, [zones]);
  
  // Persist irrigation logs
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_IRRIGATION, JSON.stringify(irrigationLogs));
  }, [irrigationLogs]);
  
  // Listen for pest alerts from InterventionEngine
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setPestAlertActive(true);
      const shieldRule = HARMONIC_RULES.find(r => r.id === 'source-shield');
      if (shieldRule) {
        setAlert({
          type: 'shield',
          rule: shieldRule,
        });
      }
    };
    
    window.addEventListener(PEST_EVENT_KEY, handler as EventListener);
    return () => window.removeEventListener(PEST_EVENT_KEY, handler as EventListener);
  }, []);
  
  // Update zone status
  const updateZoneStatus = useCallback((hz: number, newValue: number) => {
    setZones(prev => prev.map(z => {
      if (z.hz !== hz) return z;
      const status: ZoneStatus['status'] = 
        newValue >= z.threshold ? 'optimal' :
        newValue >= z.threshold * 0.6 ? 'warning' : 'critical';
      return { 
        ...z, 
        value: newValue, 
        status,
        lastUpdated: new Date().toISOString(),
      };
    }));
  }, []);
  
  // Check irrigation regularity (last 7 days)
  const checkIrrigationRegularity = useCallback((zoneHz: number): { regular: boolean; issue: string | null } => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLogs = irrigationLogs.filter(log => 
      log.zoneHz === zoneHz && new Date(log.date) >= sevenDaysAgo
    );
    
    if (recentLogs.length === 0) {
      return { regular: false, issue: 'No irrigation data in the last 7 days.' };
    }
    
    if (recentLogs.length < 2) {
      return { regular: false, issue: 'Irregular irrigation: Only 1 watering in 7 days.' };
    }
    
    // Check for gaps > 3 days
    const sortedLogs = [...recentLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (let i = 1; i < sortedLogs.length; i++) {
      const gap = (new Date(sortedLogs[i].date).getTime() - new Date(sortedLogs[i-1].date).getTime()) / (1000 * 60 * 60 * 24);
      if (gap > 3) {
        return { regular: false, issue: `Irregular irrigation: ${Math.floor(gap)} day gap detected.` };
      }
    }
    
    return { regular: true, issue: null };
  }, [irrigationLogs]);
  
  // CORE LOGIC: Check dependencies and block if needed
  const checkDependenciesAndBlock = useCallback((task: PlannedTask): boolean => {
    setSelectedTask(task);
    setAlert(null);
    setIsBlocked(false);
    
    // RULE 1: 396Hz → 528Hz (Root Dependency)
    if (task.hz === 528) {
      const rootZone = zones.find(z => z.hz === 396);
      const rule = HARMONIC_RULES.find(r => r.id === 'root-to-solar')!;
      
      // Check for RED LIGHT or NO DATA
      if (!rootZone || rootZone.status === 'critical' || rootZone.status === 'no-data') {
        setAlert({
          type: 'block',
          rule,
          sourceZone: rootZone,
          targetTask: task,
        });
        setIsBlocked(true);
        return false; // BLOCKED
      }
    }
    
    // RULE 2: 417Hz → 741Hz (Flow Dependency)
    if (task.hz === 741) {
      const flowZone = zones.find(z => z.hz === 417);
      const rule = HARMONIC_RULES.find(r => r.id === 'flow-to-expression')!;
      
      // Check irrigation regularity
      const irrigationCheck = checkIrrigationRegularity(417);
      
      if (!flowZone || flowZone.status === 'critical' || flowZone.status === 'no-data' || !irrigationCheck.regular) {
        setAlert({
          type: 'block',
          rule,
          sourceZone: flowZone,
          targetTask: task,
          irrigationIssue: irrigationCheck.issue || undefined,
        });
        setIsBlocked(true);
        return false; // BLOCKED
      }
    }
    
    // Task approved
    setAlert({
      type: 'success',
      rule: { 
        id: 'approved', 
        name: 'HARMONIC ALIGNMENT', 
        biologicalRule: 'All dependencies satisfied.',
        sourceHz: 0, 
        targetHz: task.hz,
        sourceElement: '',
        targetElement: task.crop,
        blockMessage: '',
        resolveAction: `Proceed with ${task.action} on ${task.crop}.`,
        wisdomKey: 'hermetic-correspondence',
      },
      targetTask: task,
    });
    
    return true; // APPROVED
  }, [zones, checkIrrigationRegularity]);
  
  // Add irrigation log
  const addIrrigationLog = useCallback(() => {
    const newLog: IrrigationLog = {
      date: new Date().toISOString(),
      zoneHz: 417,
      amount: 2,
      method: 'drip',
    };
    setIrrigationLogs(prev => [newLog, ...prev.slice(0, 29)]);
    // Also update zone status
    updateZoneStatus(417, 75);
  }, [updateZoneStatus]);
  
  // Dismiss shield
  const dismissShield = () => {
    setPestAlertActive(false);
    setAlert(null);
  };
  
  // Reset for new check
  const resetCheck = () => {
    setSelectedTask(null);
    setAlert(null);
    setIsBlocked(false);
  };
  
  // Icon component
  const getZoneIcon = (icon: ZoneStatus['icon']) => {
    const props = { className: 'w-4 h-4' };
    switch (icon) {
      case 'root': return <Sprout {...props} />;
      case 'flow': return <Droplets {...props} />;
      case 'solar': return <Sun {...props} />;
      case 'crown': return <Crown {...props} />;
      default: return <Music {...props} />;
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(270 20% 12%), hsl(270 15% 8%))',
        border: `2px solid ${isBlocked ? 'hsl(0 60% 50%)' : 'hsl(270 40% 40%)'}`,
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: isBlocked 
            ? 'linear-gradient(135deg, hsl(0 30% 15%), hsl(0 25% 10%))'
            : 'linear-gradient(135deg, hsl(270 30% 18%), hsl(270 25% 12%))',
          borderBottom: `1px solid ${isBlocked ? 'hsl(0 40% 35%)' : 'hsl(270 30% 30%)'}`,
        }}
      >
        <div className="flex items-center gap-2">
          {isBlocked ? (
            <Lock className="w-5 h-5" style={{ color: 'hsl(0 70% 60%)' }} />
          ) : (
            <Music className="w-5 h-5" style={{ color: 'hsl(270 60% 65%)' }} />
          )}
          <h3
            className="text-lg tracking-wider"
            style={{ 
              fontFamily: "'Staatliches', sans-serif", 
              color: isBlocked ? 'hsl(0 70% 65%)' : 'hsl(270 60% 70%)' 
            }}
          >
            {isBlocked ? 'HARMONIC ERROR' : 'HARMONIC PROTOCOL'}
          </h3>
        </div>
        <p className="text-[10px] font-mono mt-1" style={{ color: isBlocked ? 'hsl(0 40% 50%)' : 'hsl(270 30% 50%)' }}>
          {isBlocked ? 'Task Blocked • Dependency Not Met' : 'Inter-Zone Dependency Engine'}
        </p>
      </div>

      {/* Zone Status Grid */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(270 50% 60%)' }}>
            ZONE STATUS MATRIX
          </span>
          <button
            onClick={() => {
              updateZoneStatus(396, 75);
              updateZoneStatus(417, 70);
            }}
            className="text-[9px] font-mono px-2 py-0.5 rounded"
            style={{ background: 'hsl(120 30% 20%)', color: 'hsl(120 50% 60%)', border: '1px solid hsl(120 40% 35%)' }}
          >
            SET OPTIMAL
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {zones.map((zone) => {
            const isSource = selectedTask && (
              (selectedTask.hz === 528 && zone.hz === 396) ||
              (selectedTask.hz === 741 && zone.hz === 417)
            );
            const isTarget = selectedTask?.hz === zone.hz;
            
            return (
              <button
                key={zone.hz}
                onClick={() => updateZoneStatus(zone.hz, zone.value > 50 ? 25 : 80)}
                className="relative flex flex-col items-center py-2 rounded-lg transition-all"
                style={{
                  background: isSource ? `${zone.color}40` : isTarget ? 'hsl(270 30% 20%)' : 'hsl(0 0% 10%)',
                  border: `2px solid ${
                    zone.status === 'critical' || zone.status === 'no-data' ? 'hsl(0 60% 50%)' :
                    zone.status === 'warning' ? 'hsl(35 60% 50%)' :
                    isSource ? zone.color : 'hsl(0 0% 20%)'
                  }`,
                  boxShadow: isSource ? `0 0 12px ${zone.color}50` : 'none',
                }}
              >
                {/* Status indicator */}
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{
                    background: zone.status === 'optimal' ? 'hsl(120 50% 45%)' :
                      zone.status === 'warning' ? 'hsl(35 60% 50%)' : 'hsl(0 60% 50%)',
                    boxShadow: `0 0 6px ${
                      zone.status === 'optimal' ? 'hsl(120 50% 45%)' :
                      zone.status === 'warning' ? 'hsl(35 60% 50%)' : 'hsl(0 60% 50%)'
                    }`,
                  }}
                />
                {isSource && (
                  <div className="absolute -top-2 -left-2">
                    <Zap className="w-3 h-3" style={{ color: zone.color }} />
                  </div>
                )}
                <span className="text-[10px] font-mono font-bold" style={{ color: zone.color }}>
                  {zone.hz}
                </span>
                <span className="text-[8px] font-mono mt-0.5" style={{ color: 'hsl(0 0% 50%)' }}>
                  {zone.status === 'no-data' ? '?' : `${zone.value}%`}
                </span>
              </button>
            );
          })}
        </div>
        
        <p className="text-[8px] font-mono text-center mt-2" style={{ color: 'hsl(0 0% 40%)' }}>
          Tap zone to toggle status • Red = Critical/No Data
        </p>
      </div>

      {/* Quick Irrigation Log */}
      <div className="px-4 pb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={addIrrigationLog}
          className="w-full text-xs"
          style={{
            background: 'hsl(210 25% 15%)',
            border: '1px solid hsl(210 40% 40%)',
            color: 'hsl(210 60% 65%)',
          }}
        >
          <Droplets className="w-3 h-3 mr-1.5" />
          Log Irrigation (417Hz)
          <span className="ml-2 text-[9px] opacity-60">
            ({irrigationLogs.filter(l => {
              const d = new Date(l.date);
              const week = new Date();
              week.setDate(week.getDate() - 7);
              return d >= week;
            }).length} this week)
          </span>
        </Button>
      </div>

      {/* Task Planner */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(51 60% 55%)' }}>
            PLAN TASK:
          </span>
          {selectedTask && (
            <button
              onClick={resetCheck}
              className="text-[9px] font-mono px-2 py-0.5 rounded ml-auto"
              style={{ background: 'hsl(0 0% 15%)', color: 'hsl(0 0% 50%)', border: '1px solid hsl(0 0% 25%)' }}
            >
              RESET
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          {PLANNABLE_TASKS.map((task) => {
            const zone = zones.find(z => z.hz === task.hz);
            const isSelected = selectedTask?.hz === task.hz;
            
            return (
              <Button
                key={task.hz}
                variant="outline"
                onClick={() => checkDependenciesAndBlock(task)}
                className="flex flex-col items-start p-3 h-auto text-left"
                style={{
                  background: isSelected ? `${zone?.color}20` : 'hsl(0 0% 10%)',
                  border: `2px solid ${isSelected ? zone?.color : 'hsl(0 0% 25%)'}`,
                }}
              >
                <span
                  className="text-sm font-mono font-bold"
                  style={{ color: isSelected ? zone?.color : 'hsl(0 0% 60%)' }}
                >
                  {task.hz}Hz
                </span>
                <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                  {task.crop}
                </span>
                <span className="text-[8px] font-mono mt-1" style={{ color: 'hsl(0 0% 40%)' }}>
                  → {task.action}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Pest Shield Trigger */}
      <div className="px-4 pb-4">
        <Button
          variant="outline"
          onClick={() => window.dispatchEvent(new CustomEvent(PEST_EVENT_KEY))}
          className="w-full text-xs"
          style={{
            background: pestAlertActive ? 'hsl(300 25% 15%)' : 'hsl(0 0% 10%)',
            border: `1px solid ${pestAlertActive ? 'hsl(300 50% 50%)' : 'hsl(0 0% 25%)'}`,
            color: pestAlertActive ? 'hsl(300 60% 65%)' : 'hsl(0 0% 50%)',
          }}
        >
          {pestAlertActive ? '🛡️ VIOLET SHIELD ACTIVE' : '🐛 Simulate Pest Alert'}
        </Button>
      </div>

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
              className="rounded-xl overflow-hidden"
              style={{
                background: alert.type === 'block' 
                  ? 'hsl(0 30% 10%)' 
                  : alert.type === 'shield'
                  ? 'hsl(300 25% 12%)'
                  : 'hsl(120 25% 10%)',
                border: `2px solid ${
                  alert.type === 'block' ? 'hsl(0 60% 50%)' 
                  : alert.type === 'shield' ? 'hsl(300 50% 50%)'
                  : 'hsl(120 50% 45%)'
                }`,
              }}
            >
              {/* Alert Header */}
              <div
                className="p-3 flex items-center gap-3"
                style={{
                  background: alert.type === 'block' 
                    ? 'linear-gradient(90deg, hsl(0 40% 18%), transparent)'
                    : alert.type === 'shield'
                    ? 'linear-gradient(90deg, hsl(300 30% 18%), transparent)'
                    : 'linear-gradient(90deg, hsl(120 25% 15%), transparent)',
                  borderBottom: `1px solid ${
                    alert.type === 'block' ? 'hsl(0 50% 35%)' 
                    : alert.type === 'shield' ? 'hsl(300 40% 35%)'
                    : 'hsl(120 40% 30%)'
                  }`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: alert.type === 'block'
                      ? 'radial-gradient(circle, hsl(0 60% 45%) 0%, hsl(0 50% 30%) 100%)'
                      : alert.type === 'shield'
                      ? 'radial-gradient(circle, hsl(300 50% 50%) 0%, hsl(300 40% 35%) 100%)'
                      : 'radial-gradient(circle, hsl(120 50% 40%) 0%, hsl(120 40% 28%) 100%)',
                    boxShadow: `0 0 25px ${
                      alert.type === 'block' ? 'hsl(0 60% 45% / 0.6)' 
                      : alert.type === 'shield' ? 'hsl(300 50% 50% / 0.5)'
                      : 'hsl(120 50% 40% / 0.5)'
                    }`,
                  }}
                >
                  {alert.type === 'block' ? (
                    <Ban className="w-6 h-6 text-white" />
                  ) : alert.type === 'shield' ? (
                    <Shield className="w-6 h-6 text-white" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <span
                    className="text-sm tracking-wider block"
                    style={{ 
                      fontFamily: "'Staatliches', sans-serif", 
                      color: alert.type === 'block' ? 'hsl(0 70% 65%)' 
                        : alert.type === 'shield' ? 'hsl(300 60% 70%)'
                        : 'hsl(120 60% 60%)'
                    }}
                  >
                    {alert.type === 'block' ? '⛔ TASK BLOCKED' : alert.type === 'shield' ? '🛡️ SHIELD DIRECTIVE' : '✓ APPROVED'}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 55%)' }}>
                    {alert.rule.name}
                  </span>
                </div>
                <LearnMoreButton wisdomKey={alert.rule.wisdomKey} size="sm" />
              </div>
              
              {/* Alert Content */}
              <div className="p-4">
                {/* Biological Rule */}
                <div
                  className="p-3 rounded-lg mb-3"
                  style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)' }}
                >
                  <span className="text-[9px] font-mono block mb-1" style={{ color: 'hsl(0 0% 45%)' }}>
                    BIOLOGICAL RULE:
                  </span>
                  <p className="text-xs font-mono italic" style={{ color: 'hsl(45 50% 65%)' }}>
                    "{alert.rule.biologicalRule}"
                  </p>
                </div>
                
                {/* Block Message */}
                {alert.type === 'block' && (
                  <>
                    <div
                      className="p-3 rounded-lg mb-3 flex items-start gap-3"
                      style={{ background: 'hsl(0 25% 12%)', border: '1px solid hsl(0 40% 35%)' }}
                    >
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'hsl(0 70% 60%)' }} />
                      <p className="text-xs font-mono" style={{ color: 'hsl(0 60% 70%)' }}>
                        {alert.rule.blockMessage}
                      </p>
                    </div>
                    
                    {/* Source Zone Status */}
                    {alert.sourceZone && (
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="px-3 py-2 rounded-lg flex items-center gap-2"
                          style={{
                            background: `${alert.sourceZone.color}15`,
                            border: `2px solid ${alert.sourceZone.color}`,
                          }}
                        >
                          {getZoneIcon(alert.sourceZone.icon)}
                          <span className="text-sm font-mono font-bold" style={{ color: alert.sourceZone.color }}>
                            {alert.sourceZone.hz}Hz
                          </span>
                          <span
                            className="text-xs font-mono px-1.5 py-0.5 rounded"
                            style={{
                              background: alert.sourceZone.status === 'no-data' ? 'hsl(0 50% 25%)' : 'hsl(0 40% 25%)',
                              color: 'hsl(0 70% 70%)',
                            }}
                          >
                            {alert.sourceZone.status === 'no-data' ? 'NO DATA' : `${alert.sourceZone.value}% (CRITICAL)`}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                          → blocks →
                        </span>
                        <span className="text-sm font-mono font-bold" style={{ color: 'hsl(51 80% 55%)' }}>
                          {alert.targetTask?.hz}Hz
                        </span>
                      </div>
                    )}
                    
                    {/* Irrigation Issue */}
                    {alert.irrigationIssue && (
                      <div
                        className="p-2 rounded mb-3 flex items-center gap-2"
                        style={{ background: 'hsl(30 30% 15%)', border: '1px solid hsl(30 50% 40%)' }}
                      >
                        <Droplets className="w-4 h-4" style={{ color: 'hsl(30 60% 60%)' }} />
                        <span className="text-[10px] font-mono" style={{ color: 'hsl(30 60% 65%)' }}>
                          {alert.irrigationIssue}
                        </span>
                      </div>
                    )}
                    
                    {/* Resolution Action */}
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: 'hsl(120 20% 12%)', border: '1px solid hsl(120 35% 30%)' }}
                    >
                      <span className="text-[9px] font-mono block mb-1" style={{ color: 'hsl(120 50% 55%)' }}>
                        ✓ RESOLVE BY:
                      </span>
                      <p className="text-xs font-mono" style={{ color: 'hsl(120 45% 65%)' }}>
                        {alert.rule.resolveAction}
                      </p>
                    </div>
                  </>
                )}
                
                {/* Shield Directive */}
                {alert.type === 'shield' && (
                  <>
                    <div
                      className="p-3 rounded-lg mb-3"
                      style={{ background: 'hsl(300 20% 15%)', border: '1px solid hsl(300 40% 40%)' }}
                    >
                      <p className="text-xs font-mono" style={{ color: 'hsl(300 60% 75%)' }}>
                        <Crown className="w-4 h-4 inline mr-2" />
                        {alert.rule.resolveAction}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {['Garlic', 'Onion', 'Chives', 'Shallot'].map((plant) => (
                        <div
                          key={plant}
                          className="px-2 py-1 rounded"
                          style={{
                            background: 'hsl(300 20% 18%)',
                            border: '1px solid hsl(300 40% 45%)',
                          }}
                        >
                          <span className="text-xs font-mono" style={{ color: 'hsl(300 50% 70%)' }}>
                            🧄 {plant}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={dismissShield}
                      className="w-full"
                      style={{
                        background: 'linear-gradient(135deg, hsl(300 40% 35%), hsl(300 35% 28%))',
                        border: '2px solid hsl(300 50% 50%)',
                        color: 'white',
                      }}
                    >
                      Shield Deployed ✓
                    </Button>
                  </>
                )}
                
                {/* Success */}
                {alert.type === 'success' && (
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: 'hsl(120 20% 12%)', border: '1px solid hsl(120 40% 35%)' }}
                  >
                    <p className="text-xs font-mono" style={{ color: 'hsl(120 50% 65%)' }}>
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      {alert.rule.resolveAction}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Harmonic Rules Reference */}
      {!alert && !selectedTask && (
        <div className="px-4 pb-4">
          <div className="rounded-lg p-3" style={{ background: 'hsl(0 0% 8%)', border: '1px dashed hsl(0 0% 20%)' }}>
            <span className="text-[10px] font-mono block mb-2" style={{ color: 'hsl(270 50% 60%)' }}>
              HARMONIC DEPENDENCY RULES:
            </span>
            <div className="space-y-2">
              {HARMONIC_RULES.slice(0, 2).map((rule) => (
                <div key={rule.id} className="flex items-start gap-2">
                  <span 
                    className="text-[10px] font-mono font-bold shrink-0 w-16"
                    style={{ color: rule.id === 'root-to-solar' ? 'hsl(0 60% 55%)' : 'hsl(30 60% 55%)' }}
                  >
                    {rule.sourceHz}→{rule.targetHz}
                  </span>
                  <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                    {rule.biologicalRule}
                  </span>
                </div>
              ))}
              <div className="flex items-start gap-2">
                <span 
                  className="text-[10px] font-mono font-bold shrink-0 w-16"
                  style={{ color: 'hsl(300 50% 60%)' }}
                >
                  963→ALL
                </span>
                <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                  {HARMONIC_RULES[2].biologicalRule}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HarmonicEngine;
