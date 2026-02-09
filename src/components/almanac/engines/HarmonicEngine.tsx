import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, AlertTriangle, CheckCircle, Shield, Droplets, Sprout, Sun, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE HARMONIC PROTOCOL (Inter-Zone Logic)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CONCEPT: Like a musical root note supporting a chord, Soil Zones (396-417Hz)
 * must support Fruiting Zones (528-741Hz).
 * 
 * RULE 1: Root Dependency (396Hz → 528Hz) - "No Fruit without Root"
 * RULE 2: Flow Dependency (417Hz → 741Hz) - "Hydration Fuels Expression"
 * RULE 3: Source Shield (963Hz → All) - "The Crown Protects the Whole"
 */

// ZONE STATUS CONFIGURATION
interface ZoneStatus {
  hz: number;
  name: string;
  element: string;
  color: string;
  status: 'optimal' | 'warning' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  icon: 'root' | 'flow' | 'solar' | 'heart' | 'voice' | 'vision' | 'crown';
}

// HARMONIC DEPENDENCIES
interface HarmonicDependency {
  id: string;
  name: string;
  rule: string;
  sourceHz: number;
  targetHz: number;
  sourceElement: string;
  targetElement: string;
  alertTemplate: string;
  wisdomKey: string;
}

const HARMONIC_DEPENDENCIES: HarmonicDependency[] = [
  {
    id: 'root-to-solar',
    name: 'THE ROOT DEPENDENCY',
    rule: 'No Fruit without Root.',
    sourceHz: 396,
    targetHz: 528,
    sourceElement: 'Phosphorus',
    targetElement: 'Solar Energy',
    alertTemplate: 'Solar Energy (528Hz) requires Strong Roots (396Hz). Check Phosphorus first.',
    wisdomKey: 'ingham-soil-food-web',
  },
  {
    id: 'flow-to-expression',
    name: 'THE FLOW DEPENDENCY',
    rule: 'Hydration Fuels Expression.',
    sourceHz: 417,
    targetHz: 741,
    sourceElement: 'Water Flow',
    targetElement: 'Fruit Expression',
    alertTemplate: 'Fruit Expression (741Hz) is stalled. Stabilize Flow (417Hz) first.',
    wisdomKey: 'hermetic-vibration',
  },
  {
    id: 'source-shield',
    name: 'THE SOURCE SHIELD',
    rule: 'The Crown Protects the Whole.',
    sourceHz: 963,
    targetHz: 0, // Applies to all
    sourceElement: 'Violet Shield',
    targetElement: 'All Zones',
    alertTemplate: 'Deploy the Violet Shield (Garlic/Onion) to the affected area.',
    wisdomKey: 'dogon-seed-lineage',
  },
];

// Initial zone statuses (simulated - in production would come from user data)
const INITIAL_ZONES: ZoneStatus[] = [
  { hz: 396, name: 'ROOT', element: 'Phosphorus', color: 'hsl(0 60% 50%)', status: 'optimal', metric: 'P-Level', value: 85, threshold: 60, icon: 'root' },
  { hz: 417, name: 'SACRAL', element: 'Water', color: 'hsl(30 70% 50%)', status: 'optimal', metric: 'Moisture', value: 70, threshold: 50, icon: 'flow' },
  { hz: 528, name: 'SOLAR', element: 'Nitrogen', color: 'hsl(51 80% 50%)', status: 'optimal', metric: 'N-Level', value: 75, threshold: 60, icon: 'solar' },
  { hz: 639, name: 'HEART', element: 'Calcium', color: 'hsl(120 50% 45%)', status: 'optimal', metric: 'Ca-Level', value: 80, threshold: 55, icon: 'heart' },
  { hz: 741, name: 'THROAT', element: 'Potassium', color: 'hsl(210 60% 50%)', status: 'optimal', metric: 'K-Level', value: 65, threshold: 50, icon: 'voice' },
  { hz: 852, name: 'THIRD EYE', element: 'Trace', color: 'hsl(270 50% 50%)', status: 'optimal', metric: 'Trace', value: 60, threshold: 40, icon: 'vision' },
  { hz: 963, name: 'SOURCE', element: 'Spirit', color: 'hsl(300 50% 50%)', status: 'optimal', metric: 'Vitality', value: 90, threshold: 70, icon: 'crown' },
];

// Pest alert event listener key
const PEST_EVENT_KEY = 'pest-alert-triggered';

const HarmonicEngine = () => {
  // Zone statuses (mutable for simulation)
  const [zones, setZones] = useState<ZoneStatus[]>(INITIAL_ZONES);
  
  // Selected task zone
  const [selectedTaskHz, setSelectedTaskHz] = useState<number | null>(null);
  
  // Active alerts
  const [alerts, setAlerts] = useState<{ dependency: HarmonicDependency; sourceZone: ZoneStatus }[]>([]);
  
  // Pest alert active
  const [pestAlertActive, setPestAlertActive] = useState(false);
  
  // Listen for pest alerts from InterventionEngine
  useEffect(() => {
    const handler = () => {
      setPestAlertActive(true);
      // Auto-trigger Source Shield
      const shieldDep = HARMONIC_DEPENDENCIES.find(d => d.id === 'source-shield');
      const sourceZone = zones.find(z => z.hz === 963);
      if (shieldDep && sourceZone) {
        setAlerts(prev => {
          if (prev.some(a => a.dependency.id === 'source-shield')) return prev;
          return [...prev, { dependency: shieldDep, sourceZone }];
        });
      }
    };
    
    window.addEventListener(PEST_EVENT_KEY, handler);
    return () => window.removeEventListener(PEST_EVENT_KEY, handler);
  }, [zones]);
  
  // Update zone status (for simulation)
  const updateZoneStatus = (hz: number, newValue: number) => {
    setZones(prev => prev.map(z => {
      if (z.hz !== hz) return z;
      const status: ZoneStatus['status'] = 
        newValue >= z.threshold ? 'optimal' :
        newValue >= z.threshold * 0.6 ? 'warning' : 'critical';
      return { ...z, value: newValue, status };
    }));
  };
  
  // Check dependencies when task is selected
  const checkDependencies = (taskHz: number) => {
    setSelectedTaskHz(taskHz);
    setAlerts([]);
    
    const newAlerts: typeof alerts = [];
    
    // Rule 1: 396Hz → 528Hz
    if (taskHz === 528) {
      const rootZone = zones.find(z => z.hz === 396);
      if (rootZone && rootZone.status !== 'optimal') {
        const dep = HARMONIC_DEPENDENCIES.find(d => d.id === 'root-to-solar');
        if (dep) newAlerts.push({ dependency: dep, sourceZone: rootZone });
      }
    }
    
    // Rule 2: 417Hz → 741Hz
    if (taskHz === 741) {
      const flowZone = zones.find(z => z.hz === 417);
      if (flowZone && flowZone.status !== 'optimal') {
        const dep = HARMONIC_DEPENDENCIES.find(d => d.id === 'flow-to-expression');
        if (dep) newAlerts.push({ dependency: dep, sourceZone: flowZone });
      }
    }
    
    setAlerts(newAlerts);
  };
  
  // Trigger pest alert (for testing)
  const triggerPestAlert = () => {
    window.dispatchEvent(new CustomEvent(PEST_EVENT_KEY));
  };
  
  // Dismiss shield alert
  const dismissShield = () => {
    setPestAlertActive(false);
    setAlerts(prev => prev.filter(a => a.dependency.id !== 'source-shield'));
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
        border: '2px solid hsl(270 40% 40%)',
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: 'linear-gradient(135deg, hsl(270 30% 18%), hsl(270 25% 12%))',
          borderBottom: '1px solid hsl(270 30% 30%)',
        }}
      >
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5" style={{ color: 'hsl(270 60% 65%)' }} />
          <h3
            className="text-lg tracking-wider"
            style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(270 60% 70%)' }}
          >
            HARMONIC PROTOCOL
          </h3>
        </div>
        <p className="text-[10px] font-mono mt-1" style={{ color: 'hsl(270 30% 50%)' }}>
          Inter-Zone Dependency Engine • Musical Logic
        </p>
      </div>

      {/* Zone Status Grid */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(270 50% 60%)' }}>
            ZONE STATUS MATRIX
          </span>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {zones.map((zone) => {
            const isSelected = selectedTaskHz === zone.hz;
            return (
              <button
                key={zone.hz}
                onClick={() => updateZoneStatus(zone.hz, zone.value > 50 ? 30 : 80)}
                className="relative flex flex-col items-center py-2 rounded-lg transition-all"
                style={{
                  background: isSelected ? `${zone.color}30` : 'hsl(0 0% 10%)',
                  border: `2px solid ${
                    zone.status === 'critical' ? 'hsl(0 60% 50%)' :
                    zone.status === 'warning' ? 'hsl(35 60% 50%)' :
                    isSelected ? zone.color : 'hsl(0 0% 20%)'
                  }`,
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
                <span
                  className="text-[10px] font-mono font-bold"
                  style={{ color: zone.color }}
                >
                  {zone.hz}
                </span>
                <span
                  className="text-[8px] font-mono mt-0.5"
                  style={{ color: 'hsl(0 0% 50%)' }}
                >
                  {zone.value}%
                </span>
              </button>
            );
          })}
        </div>
        
        <p className="text-[8px] font-mono text-center mt-2" style={{ color: 'hsl(0 0% 40%)' }}>
          Tap zone to toggle status (simulation)
        </p>
      </div>

      {/* Task Zone Selector */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(51 60% 55%)' }}>
            PLAN TASK IN ZONE:
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { hz: 528, label: 'SOLAR (Corn)', color: 'hsl(51 80% 50%)' },
            { hz: 741, label: 'THROAT (Berry)', color: 'hsl(210 60% 50%)' },
            { hz: 639, label: 'HEART (Greens)', color: 'hsl(120 50% 45%)' },
            { hz: 852, label: 'VISION (Herbs)', color: 'hsl(270 50% 50%)' },
          ].map((task) => (
            <Button
              key={task.hz}
              variant="outline"
              onClick={() => checkDependencies(task.hz)}
              className="flex flex-col items-center py-3 h-auto"
              style={{
                background: selectedTaskHz === task.hz ? `${task.color}20` : 'hsl(0 0% 10%)',
                border: `2px solid ${selectedTaskHz === task.hz ? task.color : 'hsl(0 0% 25%)'}`,
              }}
            >
              <span
                className="text-sm font-mono font-bold"
                style={{ color: selectedTaskHz === task.hz ? task.color : 'hsl(0 0% 55%)' }}
              >
                {task.hz}Hz
              </span>
              <span
                className="text-[8px] font-mono mt-0.5"
                style={{ color: 'hsl(0 0% 45%)' }}
              >
                {task.label}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Pest Alert Trigger (for testing) */}
      <div className="px-4 pb-4">
        <Button
          variant="outline"
          onClick={triggerPestAlert}
          className="w-full text-xs"
          style={{
            background: pestAlertActive ? 'hsl(300 25% 15%)' : 'hsl(0 0% 10%)',
            border: `1px solid ${pestAlertActive ? 'hsl(300 50% 50%)' : 'hsl(0 0% 25%)'}`,
            color: pestAlertActive ? 'hsl(300 60% 65%)' : 'hsl(0 0% 50%)',
          }}
        >
          {pestAlertActive ? '🛡️ VIOLET SHIELD ACTIVE' : 'Simulate Pest Alert (Test Source Shield)'}
        </Button>
      </div>

      {/* Dependency Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div className="space-y-3">
              {alerts.map((alert) => {
                const isShield = alert.dependency.id === 'source-shield';
                const accentColor = isShield ? 'hsl(300 50% 55%)' : 
                  alert.sourceZone.status === 'critical' ? 'hsl(0 60% 55%)' : 'hsl(35 60% 55%)';
                
                return (
                  <motion.div
                    key={alert.dependency.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: isShield ? 'hsl(300 25% 12%)' : 'hsl(35 20% 12%)',
                      border: `2px solid ${accentColor}`,
                    }}
                  >
                    {/* Alert Header */}
                    <div
                      className="p-3 flex items-center gap-3"
                      style={{
                        background: `linear-gradient(90deg, ${accentColor}25, transparent)`,
                        borderBottom: `1px solid ${accentColor}40`,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: `radial-gradient(circle, ${accentColor} 0%, ${accentColor}60 100%)`,
                          boxShadow: `0 0 20px ${accentColor}50`,
                        }}
                      >
                        {isShield ? (
                          <Shield className="w-5 h-5 text-white" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span
                          className="text-sm tracking-wider block"
                          style={{ fontFamily: "'Staatliches', sans-serif", color: accentColor }}
                        >
                          {alert.dependency.name}
                        </span>
                        <span className="text-[10px] font-mono italic" style={{ color: 'hsl(0 0% 55%)' }}>
                          "{alert.dependency.rule}"
                        </span>
                      </div>
                      <LearnMoreButton wisdomKey={alert.dependency.wisdomKey} size="sm" />
                    </div>
                    
                    {/* Alert Content */}
                    <div className="p-3">
                      <div
                        className="p-3 rounded-lg flex items-start gap-3"
                        style={{ background: 'hsl(0 0% 8%)' }}
                      >
                        {isShield ? (
                          <Crown className="w-5 h-5 shrink-0" style={{ color: 'hsl(300 60% 65%)' }} />
                        ) : (
                          <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: accentColor }} />
                        )}
                        <div>
                          <p className="text-xs font-mono" style={{ color: 'hsl(0 0% 70%)' }}>
                            {isShield ? (
                              <>
                                <span style={{ color: 'hsl(300 60% 70%)' }}>Directive: </span>
                                {alert.dependency.alertTemplate}
                              </>
                            ) : (
                              <>
                                <span style={{ color: accentColor }}>Warning: </span>
                                {alert.dependency.alertTemplate}
                              </>
                            )}
                          </p>
                          
                          {!isShield && (
                            <div className="mt-2 flex items-center gap-2">
                              <div
                                className="px-2 py-1 rounded flex items-center gap-1.5"
                                style={{
                                  background: `${alert.sourceZone.color}20`,
                                  border: `1px solid ${alert.sourceZone.color}50`,
                                }}
                              >
                                {getZoneIcon(alert.sourceZone.icon)}
                                <span className="text-[10px] font-mono" style={{ color: alert.sourceZone.color }}>
                                  {alert.sourceZone.hz}Hz: {alert.sourceZone.value}%
                                </span>
                              </div>
                              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                                (needs {alert.sourceZone.threshold}%+)
                              </span>
                            </div>
                          )}
                          
                          {isShield && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {['Garlic', 'Onion', 'Chives'].map((plant) => (
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
                          )}
                        </div>
                      </div>
                      
                      {isShield && (
                        <Button
                          onClick={dismissShield}
                          variant="outline"
                          className="w-full mt-2 text-xs"
                          style={{
                            background: 'transparent',
                            border: '1px solid hsl(0 0% 25%)',
                            color: 'hsl(0 0% 55%)',
                          }}
                        >
                          Shield Deployed ✓
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Harmonic Rules Reference */}
      {!selectedTaskHz && alerts.length === 0 && (
        <div className="px-4 pb-4">
          <div className="rounded-lg p-3" style={{ background: 'hsl(0 0% 8%)', border: '1px dashed hsl(0 0% 20%)' }}>
            <span className="text-[10px] font-mono block mb-2" style={{ color: 'hsl(270 50% 60%)' }}>
              HARMONIC DEPENDENCIES:
            </span>
            <div className="space-y-1.5">
              {HARMONIC_DEPENDENCIES.map((dep) => (
                <div key={dep.id} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 55%)' }}>
                    {dep.sourceHz}Hz → {dep.targetHz === 0 ? 'ALL' : `${dep.targetHz}Hz`}
                  </span>
                  <span className="text-[9px] font-mono italic" style={{ color: 'hsl(0 0% 40%)' }}>
                    {dep.rule}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HarmonicEngine;
