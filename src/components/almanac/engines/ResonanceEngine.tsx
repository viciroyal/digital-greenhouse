import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Filter, Leaf } from 'lucide-react';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { LearnMoreButton } from '@/components/almanac';
import { Badge } from '@/components/ui/badge';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE RESONANCE ENGINE (ZONE FILTER)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * GOAL: Context-aware focus. Filter the visible world by frequency.
 * 
 * LOGIC:
 * 1. INPUT: User selects a Frequency (e.g., 396Hz)
 * 2. REACTION: Interface filters to show ONLY that zone
 *    - HIDE: All crops/tasks NOT tagged with selected Hz
 *    - SHOW: Only matching crops, tasks, and logic
 * 3. VISUAL CUE: Interface accent color changes to match zone
 */

// Solfeggio frequency zones with colors
interface FrequencyZone {
  hz: number;
  name: string;
  color: string;
  element: string;
  priority: 'DAILY' | 'WEEKLY' | 'SEASONAL' | 'WILD';
  wisdomKey: string;
}

const FREQUENCY_ZONES: FrequencyZone[] = [
  { hz: 396, name: 'THE ROOT', color: 'hsl(0 60% 50%)', element: 'Earth', priority: 'DAILY', wisdomKey: 'hermetic-vibration' },
  { hz: 417, name: 'THE SACRAL', color: 'hsl(30 70% 50%)', element: 'Water', priority: 'DAILY', wisdomKey: 'hermetic-vibration' },
  { hz: 528, name: 'THE HEART', color: 'hsl(120 50% 45%)', element: 'Fire', priority: 'WEEKLY', wisdomKey: 'three-sisters' },
  { hz: 639, name: 'THE THROAT', color: 'hsl(51 80% 50%)', element: 'Air', priority: 'WEEKLY', wisdomKey: 'hermetic-vibration' },
  { hz: 741, name: 'THE VISION', color: 'hsl(180 50% 45%)', element: 'Ether', priority: 'SEASONAL', wisdomKey: 'hermetic-vibration' },
  { hz: 852, name: 'THE CROWN', color: 'hsl(270 50% 50%)', element: 'Spirit', priority: 'SEASONAL', wisdomKey: 'hermetic-vibration' },
  { hz: 963, name: 'THE SOURCE', color: 'hsl(300 50% 50%)', element: 'Void', priority: 'WILD', wisdomKey: 'dogon-seed-lineage' },
];

const ResonanceEngine = () => {
  // INPUT STATE: Selected frequency
  const [selectedHz, setSelectedHz] = useState<number | null>(null);
  
  // Fetch crops from database
  const { data: allCrops, isLoading } = useMasterCrops();
  
  // Get selected zone data
  const selectedZone = useMemo(() => 
    FREQUENCY_ZONES.find(z => z.hz === selectedHz) || null
  , [selectedHz]);
  
  // FILTER LOGIC: Show only crops matching selected Hz
  const filteredCrops = useMemo(() => {
    if (!selectedHz || !allCrops) return [];
    return allCrops.filter(crop => crop.frequency_hz === selectedHz);
  }, [selectedHz, allCrops]);
  
  // Group all crops by frequency for "ALL" view
  const cropsByZone = useMemo(() => {
    if (!allCrops) return {};
    return allCrops.reduce((acc, crop) => {
      if (!acc[crop.frequency_hz]) acc[crop.frequency_hz] = [];
      acc[crop.frequency_hz].push(crop);
      return acc;
    }, {} as Record<number, MasterCrop[]>);
  }, [allCrops]);

  // Dynamic accent color based on selection
  const accentColor = selectedZone?.color || 'hsl(195 50% 50%)';

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-500"
      style={{
        background: selectedHz 
          ? `linear-gradient(180deg, ${accentColor}15, hsl(0 0% 8%))`
          : 'hsl(0 0% 10%)',
        border: `2px solid ${selectedHz ? accentColor : 'hsl(0 0% 20%)'}`,
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: selectedHz 
            ? `linear-gradient(135deg, ${accentColor}25, ${accentColor}10)`
            : 'linear-gradient(135deg, hsl(0 0% 15%), hsl(0 0% 10%))',
          borderBottom: `1px solid ${selectedHz ? accentColor : 'hsl(0 0% 20%)'}50`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio 
              className="w-5 h-5" 
              style={{ color: accentColor }}
            />
            <h3
              className="text-lg tracking-wider"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: accentColor,
              }}
            >
              RESONANCE ENGINE
            </h3>
          </div>
          {selectedHz && (
            <button
              onClick={() => setSelectedHz(null)}
              className="text-xs font-mono px-2 py-1 rounded"
              style={{
                background: 'hsl(0 0% 15%)',
                border: '1px solid hsl(0 0% 30%)',
                color: 'hsl(0 0% 60%)',
              }}
            >
              CLEAR FILTER
            </button>
          )}
        </div>
        <p
          className="text-xs font-mono"
          style={{ color: 'hsl(0 0% 50%)' }}
        >
          INPUT: Select Frequency → OUTPUT: Filtered View
        </p>
      </div>

      {/* INPUT PANEL: Frequency Selector */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4" style={{ color: accentColor }} />
          <span
            className="text-sm font-mono tracking-widest font-bold"
            style={{ color: accentColor }}
          >
            INPUT: SELECT FREQUENCY
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
          {FREQUENCY_ZONES.map((zone) => {
            const isSelected = selectedHz === zone.hz;
            const cropCount = cropsByZone[zone.hz]?.length || 0;
            
            return (
              <motion.button
                key={zone.hz}
                className="relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
                style={{
                  background: isSelected 
                    ? `linear-gradient(180deg, ${zone.color}40, ${zone.color}20)`
                    : 'hsl(0 0% 12%)',
                  border: `2px solid ${isSelected ? zone.color : 'hsl(0 0% 20%)'}`,
                  boxShadow: isSelected ? `0 0 20px ${zone.color}40` : 'none',
                }}
                onClick={() => setSelectedHz(isSelected ? null : zone.hz)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Hz Value */}
                <span
                  className="text-sm font-mono font-bold"
                  style={{ color: isSelected ? zone.color : 'hsl(0 0% 55%)' }}
                >
                  {zone.hz}
                </span>
                
                {/* Zone Name (truncated) */}
                <span
                  className="text-[8px] font-mono tracking-wider truncate w-full text-center"
                  style={{ color: isSelected ? zone.color : 'hsl(0 0% 40%)' }}
                >
                  {zone.name.replace('THE ', '')}
                </span>
                
                {/* Crop count badge */}
                {cropCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-[9px] font-mono px-1.5 rounded-full"
                    style={{
                      background: zone.color,
                      color: 'white',
                    }}
                  >
                    {cropCount}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* OUTPUT PANEL: Filtered Crops */}
      <AnimatePresence mode="wait">
        {selectedHz && selectedZone && (
          <motion.div
            key={selectedHz}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            {/* Zone Info Banner */}
            <div
              className="p-3 rounded-lg mb-4 flex items-center justify-between"
              style={{
                background: `${accentColor}15`,
                border: `1px solid ${accentColor}50`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle, ${accentColor} 0%, ${accentColor}50 100%)`,
                    boxShadow: `0 0 20px ${accentColor}60`,
                  }}
                >
                  <span className="text-white font-bold text-sm">{selectedZone.hz}</span>
                </div>
                <div>
                  <span
                    className="text-sm font-mono font-bold block"
                    style={{ color: accentColor }}
                  >
                    {selectedZone.name}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                    Element: {selectedZone.element}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className="text-[10px] font-mono"
                  style={{
                    background: selectedZone.priority === 'DAILY' 
                      ? 'hsl(0 50% 25%)'
                      : selectedZone.priority === 'WEEKLY'
                      ? 'hsl(45 50% 25%)'
                      : selectedZone.priority === 'WILD'
                      ? 'hsl(270 40% 25%)'
                      : 'hsl(180 40% 25%)',
                    color: selectedZone.priority === 'DAILY' 
                      ? 'hsl(0 60% 65%)'
                      : selectedZone.priority === 'WEEKLY'
                      ? 'hsl(45 70% 65%)'
                      : selectedZone.priority === 'WILD'
                      ? 'hsl(270 50% 70%)'
                      : 'hsl(180 50% 65%)',
                    border: 'none',
                  }}
                >
                  {selectedZone.priority}
                </Badge>
                <LearnMoreButton wisdomKey={selectedZone.wisdomKey} size="sm" />
              </div>
            </div>
            
            {/* Filtered Crops List */}
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4" style={{ color: accentColor }} />
              <span
                className="text-sm font-mono tracking-widest font-bold"
                style={{ color: accentColor }}
              >
                OUTPUT: {filteredCrops.length} CROPS IN ZONE
              </span>
            </div>
            
            {isLoading ? (
              <div className="text-center py-4">
                <span className="text-sm font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                  Loading crops...
                </span>
              </div>
            ) : filteredCrops.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {filteredCrops.map((crop) => (
                  <motion.div
                    key={crop.id}
                    className="p-3 rounded-lg"
                    style={{
                      background: 'hsl(0 0% 10%)',
                      border: `1px solid ${accentColor}40`,
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span
                      className="text-sm font-mono block truncate"
                      style={{ color: 'hsl(40 50% 70%)' }}
                    >
                      {crop.common_name || crop.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          background: `${accentColor}20`,
                          color: accentColor,
                        }}
                      >
                        {crop.category}
                      </span>
                      {crop.brix_target_min && (
                        <span
                          className="text-[9px] font-mono"
                          style={{ color: 'hsl(0 0% 45%)' }}
                        >
                          Brix: {crop.brix_target_min}-{crop.brix_target_max}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-6 rounded-lg"
                style={{
                  background: 'hsl(0 0% 10%)',
                  border: '1px dashed hsl(0 0% 25%)',
                }}
              >
                <span className="text-sm font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                  No crops in database for this frequency yet.
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Default state: Show all zones summary */}
      {!selectedHz && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-sm font-mono tracking-widest"
              style={{ color: 'hsl(0 0% 50%)' }}
            >
              SELECT A ZONE TO FILTER
            </span>
          </div>
          <p
            className="text-xs font-mono"
            style={{ color: 'hsl(0 0% 40%)' }}
          >
            The Hermetic Law: "Everything vibrates." Choose a frequency to focus your attention.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResonanceEngine;
