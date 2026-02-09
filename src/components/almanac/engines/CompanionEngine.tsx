import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Sprout, Shield, Leaf, AlertTriangle } from 'lucide-react';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE COMPANION PROTOCOL (Ancestral Dependency Rules)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * MECHANISM: Auto-suggest based on ancestral grouping logic.
 * 
 * RULE 1 (The Triad): Corn (528Hz) → Auto-Suggest Pole Beans + Squash
 * RULE 2 (The Shield): Brassicas (639Hz) → Auto-Suggest Aromatics/Alliums (963Hz)
 * RULE 3 (The Nitrogen Fix): Low Nitrogen → Auto-Suggest Legumes/Clover
 */

// COMPANION RULES CONFIGURATION
interface CompanionRule {
  id: string;
  name: string;
  trigger: string;        // What triggers this rule
  triggerHz?: number;     // Frequency filter
  companions: string[];   // Suggested companions
  companionHz?: number;   // Companion frequency zone
  logic: string;          // The ancestral logic
  wisdomKey: string;      // For Learn More
  icon: 'triad' | 'shield' | 'nitrogen';
}

const COMPANION_RULES: CompanionRule[] = [
  {
    id: 'three-sisters',
    name: 'THE TRIAD',
    trigger: 'Corn',
    triggerHz: 528,
    companions: ['Pole Beans', 'Squash'],
    companionHz: 528,
    logic: 'Corn + Bean + Squash = Optimization. The Three Sisters Protocol.',
    wisdomKey: 'three-sisters',
    icon: 'triad',
  },
  {
    id: 'pest-shield',
    name: 'THE SHIELD',
    trigger: 'Brassicas',
    triggerHz: 639,
    companions: ['Aromatic Herbs', 'Garlic', 'Onions'],
    companionHz: 963,
    logic: 'Leafy + Aromatic = Pest Confusion. The Shield Protocol.',
    wisdomKey: 'polyculture-priority',
    icon: 'shield',
  },
  {
    id: 'nitrogen-fix',
    name: 'THE NITROGEN FIX',
    trigger: 'Low Nitrogen',
    companions: ['Crimson Clover', 'Cowpeas', 'Hairy Vetch', 'Austrian Winter Peas'],
    companionHz: 528,
    logic: 'Do not suggest chemical nitrogen. Suggest the Plant Solution.',
    wisdomKey: 'nitrogen-fixer-priority',
    icon: 'nitrogen',
  },
];

// Brassica crops for Rule 2 matching
const BRASSICA_NAMES = ['Kale', 'Broccoli', 'Cabbage', 'Cauliflower', 'Brussels Sprouts', 'Collards'];

// Allium crops (companions for brassicas)
const ALLIUM_NAMES = ['Garlic', 'Onion', 'Shallot', 'Chives', 'Leek'];

const CompanionEngine = () => {
  // Selected crop
  const [selectedCrop, setSelectedCrop] = useState<MasterCrop | null>(null);
  
  // Nitrogen alert state (from VitalityEngine)
  const [lowNitrogen, setLowNitrogen] = useState(false);
  
  // Fetch crops
  const { data: allCrops, isLoading } = useMasterCrops();
  
  // Listen for Brix deficiency events
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail?.brixValue < 12) {
        setLowNitrogen(true);
      }
    };
    
    window.addEventListener('brix-needs-attention', handler as EventListener);
    return () => window.removeEventListener('brix-needs-attention', handler as EventListener);
  }, []);
  
  // Determine active rules based on selection
  const activeRules = useMemo(() => {
    const rules: CompanionRule[] = [];
    
    // Rule 3: Nitrogen Fix (always show if low nitrogen detected)
    if (lowNitrogen) {
      rules.push(COMPANION_RULES.find(r => r.id === 'nitrogen-fix')!);
    }
    
    if (!selectedCrop) return rules;
    
    const cropName = (selectedCrop.common_name || selectedCrop.name).toLowerCase();
    
    // Rule 1: The Triad (Corn triggers Three Sisters)
    if (cropName.includes('corn') || cropName.includes('maize')) {
      rules.push(COMPANION_RULES.find(r => r.id === 'three-sisters')!);
    }
    
    // Rule 2: The Shield (Brassicas trigger Aromatics/Alliums)
    if (BRASSICA_NAMES.some(b => cropName.includes(b.toLowerCase()))) {
      rules.push(COMPANION_RULES.find(r => r.id === 'pest-shield')!);
    }
    
    return rules;
  }, [selectedCrop, lowNitrogen]);
  
  // Get companion crops from database
  const getCompanionCrops = (rule: CompanionRule): MasterCrop[] => {
    if (!allCrops) return [];
    
    if (rule.id === 'three-sisters') {
      // Get beans and squash from 528Hz zone
      return allCrops.filter(c => {
        const name = (c.common_name || c.name).toLowerCase();
        return (name.includes('bean') || name.includes('squash') || name.includes('pumpkin'));
      });
    }
    
    if (rule.id === 'pest-shield') {
      // Get alliums and herbs from 963Hz and 852Hz
      return allCrops.filter(c => {
        const name = (c.common_name || c.name).toLowerCase();
        return ALLIUM_NAMES.some(a => name.includes(a.toLowerCase())) ||
               c.category === 'herb';
      });
    }
    
    if (rule.id === 'nitrogen-fix') {
      // Get legumes from 528Hz
      return allCrops.filter(c => {
        const name = (c.common_name || c.name).toLowerCase();
        return name.includes('bean') || name.includes('pea') || 
               name.includes('clover') || name.includes('vetch') ||
               c.category === 'legume';
      });
    }
    
    return [];
  };
  
  // Crops grouped by frequency for selection
  const cropsByZone = useMemo(() => {
    if (!allCrops) return {};
    return allCrops.reduce((acc, crop) => {
      const hz = crop.frequency_hz;
      if (!acc[hz]) acc[hz] = [];
      acc[hz].push(crop);
      return acc;
    }, {} as Record<number, MasterCrop[]>);
  }, [allCrops]);
  
  // Icon for rule type
  const getRuleIcon = (icon: string) => {
    switch (icon) {
      case 'triad': return <Sprout className="w-5 h-5" />;
      case 'shield': return <Shield className="w-5 h-5" />;
      case 'nitrogen': return <AlertTriangle className="w-5 h-5" />;
      default: return <Link2 className="w-5 h-5" />;
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(45 20% 10%)',
        border: '2px solid hsl(45 40% 35%)',
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: 'linear-gradient(135deg, hsl(45 30% 15%), hsl(45 25% 10%))',
          borderBottom: '1px solid hsl(45 30% 25%)',
        }}
      >
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5" style={{ color: 'hsl(45 60% 60%)' }} />
          <h3
            className="text-lg tracking-wider"
            style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(45 60% 65%)' }}
          >
            COMPANION PROTOCOL
          </h3>
        </div>
        <p className="text-[10px] font-mono mt-1" style={{ color: 'hsl(45 30% 50%)' }}>
          Ancestral Grouping Logic
        </p>
      </div>

      {/* Low Nitrogen Alert */}
      <AnimatePresence>
        {lowNitrogen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pt-4"
          >
            <div
              className="p-3 rounded-lg flex items-center gap-3"
              style={{
                background: 'hsl(0 30% 12%)',
                border: '2px solid hsl(0 60% 45%)',
              }}
            >
              <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: 'hsl(0 70% 60%)' }} />
              <div className="flex-1">
                <span className="text-xs font-mono font-bold block" style={{ color: 'hsl(0 70% 65%)' }}>
                  LOW NITROGEN DETECTED
                </span>
                <span className="text-[10px] font-mono" style={{ color: 'hsl(0 40% 55%)' }}>
                  Plant solution recommended below
                </span>
              </div>
              <button
                onClick={() => setLowNitrogen(false)}
                className="text-[9px] font-mono px-2 py-1 rounded"
                style={{ background: 'hsl(0 0% 15%)', color: 'hsl(0 0% 50%)', border: '1px solid hsl(0 0% 25%)' }}
              >
                DISMISS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INPUT: Crop Selector */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(45 50% 55%)' }}>
            INPUT: SELECT CROP
          </span>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">
            <span className="text-sm font-mono" style={{ color: 'hsl(0 0% 50%)' }}>Loading crops...</span>
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto rounded-lg" style={{ background: 'hsl(0 0% 8%)' }}>
            {Object.entries(cropsByZone).map(([hz, crops]) => (
              <div key={hz} className="border-b border-white/5 last:border-0">
                <div
                  className="px-3 py-1.5 sticky top-0"
                  style={{ background: 'hsl(0 0% 12%)' }}
                >
                  <span className="text-[10px] font-mono font-bold" style={{ color: 'hsl(45 50% 55%)' }}>
                    {hz}Hz
                  </span>
                </div>
                <div className="p-2 grid grid-cols-2 gap-1">
                  {crops.map((crop) => {
                    const isSelected = selectedCrop?.id === crop.id;
                    return (
                      <button
                        key={crop.id}
                        onClick={() => setSelectedCrop(isSelected ? null : crop)}
                        className="px-2 py-1.5 rounded text-left transition-colors"
                        style={{
                          background: isSelected ? `${crop.zone_color}30` : 'transparent',
                          border: `1px solid ${isSelected ? crop.zone_color : 'transparent'}`,
                        }}
                      >
                        <span
                          className="text-xs font-mono truncate block"
                          style={{ color: isSelected ? crop.zone_color : 'hsl(0 0% 60%)' }}
                        >
                          {crop.common_name || crop.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OUTPUT: Active Companion Rules */}
      <AnimatePresence>
        {activeRules.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4" style={{ color: 'hsl(120 50% 50%)' }} />
              <span className="text-xs font-mono font-bold" style={{ color: 'hsl(120 50% 60%)' }}>
                AUTO-SUGGESTIONS
              </span>
            </div>
            
            <div className="space-y-3">
              {activeRules.map((rule) => {
                const companionCrops = getCompanionCrops(rule);
                const accentColor = rule.icon === 'nitrogen' 
                  ? 'hsl(0 60% 55%)'
                  : rule.icon === 'shield'
                  ? 'hsl(270 50% 55%)'
                  : 'hsl(51 80% 55%)';
                
                return (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-lg overflow-hidden"
                    style={{
                      background: 'hsl(0 0% 10%)',
                      border: `2px solid ${accentColor}40`,
                    }}
                  >
                    {/* Rule Header */}
                    <div
                      className="p-3 flex items-center gap-3"
                      style={{
                        background: `linear-gradient(90deg, ${accentColor}20, transparent)`,
                        borderBottom: `1px solid ${accentColor}30`,
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `${accentColor}25`, color: accentColor }}
                      >
                        {getRuleIcon(rule.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-sm font-mono font-bold block"
                          style={{ fontFamily: "'Staatliches', sans-serif", color: accentColor, letterSpacing: '0.1em' }}
                        >
                          {rule.name}
                        </span>
                        <span className="text-[9px] font-mono block truncate" style={{ color: 'hsl(0 0% 50%)' }}>
                          {rule.logic}
                        </span>
                      </div>
                      <LearnMoreButton wisdomKey={rule.wisdomKey} size="sm" />
                    </div>
                    
                    {/* Companion Suggestions */}
                    <div className="p-3">
                      <span className="text-[10px] font-mono block mb-2" style={{ color: 'hsl(0 0% 45%)' }}>
                        SUGGESTED COMPANIONS:
                      </span>
                      
                      {companionCrops.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {companionCrops.slice(0, 6).map((crop) => (
                            <div
                              key={crop.id}
                              className="px-2 py-1 rounded flex items-center gap-1.5"
                              style={{
                                background: `${crop.zone_color}20`,
                                border: `1px solid ${crop.zone_color}50`,
                              }}
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ background: crop.zone_color }}
                              />
                              <span
                                className="text-xs font-mono"
                                style={{ color: crop.zone_color }}
                              >
                                {crop.common_name || crop.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {rule.companions.map((name) => (
                            <div
                              key={name}
                              className="px-2 py-1 rounded"
                              style={{
                                background: `${accentColor}15`,
                                border: `1px solid ${accentColor}30`,
                              }}
                            >
                              <span className="text-xs font-mono" style={{ color: accentColor }}>
                                {name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Default hint */}
      {activeRules.length === 0 && (
        <div className="px-4 pb-4">
          <p className="text-[10px] font-mono text-center" style={{ color: 'hsl(0 0% 40%)' }}>
            Select a crop to see companion suggestions
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanionEngine;
