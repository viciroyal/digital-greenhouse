import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Leaf } from 'lucide-react';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE ADAPTIVE FILTER (Silent Engine Protocol)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * MECHANISM: Context-aware toggle. Zone focus.
 * 
 * INPUT: User selects a Frequency (e.g., 396Hz)
 * 
 * THE REACTION:
 *   - HIDE: All non-essential data
 *   - SHOW: Only relevant crops, tasks, and logic
 *   - VISUAL CUE: Shift interface accent color to match zone
 */

// THE 7-ZONE OCTAVE with Focus Tags
interface Zone {
  hz: number;
  name: string;
  color: string;
  focusTag: string;  // For database filtering
  focus: string;
  wisdomKey: string;
}

const ZONES: Zone[] = [
  { hz: 396, name: 'ROOT', color: 'hsl(0 60% 50%)', focusTag: 'ROOT_FOCUS', focus: 'Tomatoes • Peppers • Melons', wisdomKey: 'hermetic-vibration' },
  { hz: 417, name: 'SACRAL', color: 'hsl(30 70% 50%)', focusTag: 'FLOW_FOCUS', focus: 'Sweet Potato • Squash • Carrots', wisdomKey: 'hermetic-vibration' },
  { hz: 528, name: 'SOLAR', color: 'hsl(51 80% 50%)', focusTag: 'SOLAR_FOCUS', focus: 'Corn • Beans • Sunflowers', wisdomKey: 'three-sisters' },
  { hz: 639, name: 'HEART', color: 'hsl(120 50% 45%)', focusTag: 'HEART_FOCUS', focus: 'Kale • Broccoli • Apples', wisdomKey: 'hermetic-vibration' },
  { hz: 741, name: 'THROAT', color: 'hsl(210 60% 50%)', focusTag: 'EXPRESSION_FOCUS', focus: 'Blueberries • Grapes • Cucumbers', wisdomKey: 'hermetic-vibration' },
  { hz: 852, name: 'THIRD EYE', color: 'hsl(270 50% 50%)', focusTag: 'INTUITION_FOCUS', focus: 'Eggplant • Figs • Herbs', wisdomKey: 'hermetic-vibration' },
  { hz: 963, name: 'SOURCE', color: 'hsl(300 50% 50%)', focusTag: 'SOURCE_FOCUS', focus: 'Garlic • Onions • Flowers', wisdomKey: 'dogon-seed-lineage' },
];

// Cultural roles and minerals for each frequency
const FREQUENCY_METADATA: Record<number, { culturalRole: string; mineral: string; soilFocus: string }> = {
  396: { culturalRole: 'The Heat & Root', mineral: 'Phosphorus (P)', soilFocus: 'Double Kelp and Sea Minerals for root anchoring.' },
  417: { culturalRole: 'The Vine & Water', mineral: 'Hydrogen/Carbon (H/C)', soilFocus: 'High Humates to hold moisture for heavy vines.' },
  528: { culturalRole: 'The Solar Engine', mineral: 'Nitrogen (N)', soilFocus: 'Nitrogen-fixing legumes support the corn scaffold.' },
  639: { culturalRole: 'The Heart & Breath', mineral: 'Calcium (Ca)', soilFocus: 'Harmony Calcium for cell wall integrity.' },
  741: { culturalRole: 'The Voice & Expression', mineral: 'Potassium (K)', soilFocus: 'Potassium for fruit sugar transport.' },
  852: { culturalRole: 'The Vision & Intuition', mineral: 'Magnesium (Mg)', soilFocus: 'Magnesium as heart of chlorophyll.' },
  963: { culturalRole: 'The Source & Seed', mineral: 'Sulfur (S)', soilFocus: 'Sulfur compounds for pest resistance.' },
};

interface Props {
  isBeginnerMode?: boolean;
}

const ResonanceEngine = ({ isBeginnerMode = false }: Props) => {
  // INPUT: Selected frequency
  const [selectedHz, setSelectedHz] = useState<number | null>(null);
  
  // Fetch crops
  const { data: allCrops, isLoading } = useMasterCrops();
  
  // Selected zone
  const selectedZone = useMemo(() => 
    ZONES.find(z => z.hz === selectedHz) || null
  , [selectedHz]);
  
  // FILTER: Show only matching crops
  const filteredCrops = useMemo(() => {
    if (!selectedHz || !allCrops) return [];
    return allCrops.filter(c => c.frequency_hz === selectedHz);
  }, [selectedHz, allCrops]);
  
  // Crop counts per zone
  const zoneCounts = useMemo(() => {
    if (!allCrops) return {};
    return allCrops.reduce((acc, c) => {
      acc[c.frequency_hz] = (acc[c.frequency_hz] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }, [allCrops]);

  // VISUAL CUE: Dynamic accent
  const accent = selectedZone?.color || 'hsl(195 50% 50%)';

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: selectedHz ? `linear-gradient(180deg, ${accent}12, hsl(0 0% 8%))` : 'hsl(0 0% 10%)',
        border: `2px solid ${selectedHz ? accent : 'hsl(0 0% 20%)'}`,
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: selectedHz ? `${accent}15` : 'hsl(0 0% 12%)',
          borderBottom: `1px solid ${selectedHz ? accent : 'hsl(0 0% 20%)'}40`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5" style={{ color: accent }} />
            <h3
              className="text-lg tracking-wider"
              style={{ fontFamily: "'Staatliches', sans-serif", color: accent }}
            >
              ZONE FILTER
            </h3>
          </div>
          {selectedHz && (
            <button
              onClick={() => setSelectedHz(null)}
              className="text-[10px] font-mono px-2 py-1 rounded"
              style={{ background: 'hsl(0 0% 15%)', color: 'hsl(0 0% 55%)', border: '1px solid hsl(0 0% 25%)' }}
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* INPUT: Frequency Toggle */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono tracking-widest" style={{ color: accent }}>
            INPUT: SELECT FREQUENCY
          </span>
        </div>
        
        <div className="grid grid-cols-7 gap-1.5">
          {ZONES.map((zone) => {
            const isSelected = selectedHz === zone.hz;
            const count = zoneCounts[zone.hz] || 0;
            
            return (
              <motion.button
                key={zone.hz}
                className="relative flex flex-col items-center py-2 rounded-lg"
                style={{
                  background: isSelected ? `${zone.color}30` : 'hsl(0 0% 12%)',
                  border: `2px solid ${isSelected ? zone.color : 'hsl(0 0% 20%)'}`,
                  boxShadow: isSelected ? `0 0 15px ${zone.color}40` : 'none',
                }}
                onClick={() => setSelectedHz(isSelected ? null : zone.hz)}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: isSelected ? zone.color : 'hsl(0 0% 50%)' }}
                >
                  {zone.hz}
                </span>
                {count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-[8px] font-mono w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: zone.color, color: 'white' }}
                  >
                    {count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* OUTPUT: Filtered View */}
      <AnimatePresence mode="wait">
        {selectedHz && selectedZone && (
          <motion.div
            key={selectedHz}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            {/* Zone Focus Banner */}
            <div
              className="p-3 rounded-lg mb-3"
              style={{ background: `${accent}15`, border: `1px solid ${accent}40` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `radial-gradient(circle, ${accent} 0%, ${accent}60 100%)`,
                    boxShadow: `0 0 15px ${accent}50`,
                  }}
                >
                  <span className="text-white font-bold text-[10px]">{selectedZone.hz}</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-mono font-bold block" style={{ color: accent }}>
                    {selectedZone.name}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 55%)' }}>
                    {selectedZone.focus}
                  </span>
                </div>
                <LearnMoreButton wisdomKey={selectedZone.wisdomKey} size="sm" />
              </div>
              
              {/* Cultural Role & Mineral (Farmer Mode) */}
              {!isBeginnerMode && FREQUENCY_METADATA[selectedHz] && (
                <div className="pt-2 space-y-1" style={{ borderTop: `1px solid ${accent}30` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>Role:</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: accent }}>
                      {FREQUENCY_METADATA[selectedHz].culturalRole}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>Mineral:</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: 'hsl(35 60% 60%)' }}>
                      {FREQUENCY_METADATA[selectedHz].mineral}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[9px] font-mono shrink-0" style={{ color: 'hsl(0 0% 45%)' }}>Soil:</span>
                    <span className="text-[10px] font-mono" style={{ color: 'hsl(120 40% 55%)' }}>
                      {FREQUENCY_METADATA[selectedHz].soilFocus}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Filtered Crops */}
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4" style={{ color: accent }} />
              <span className="text-xs font-mono" style={{ color: accent }}>
                {filteredCrops.length} CROPS
              </span>
            </div>
            
            {isLoading ? (
              <div className="text-center py-4">
                <span className="text-sm font-mono" style={{ color: 'hsl(0 0% 50%)' }}>Loading...</span>
              </div>
            ) : filteredCrops.length > 0 ? (
              <div className="grid grid-cols-2 gap-1.5">
                {filteredCrops.map((crop) => (
                  <motion.div
                    key={crop.id}
                    className="p-2 rounded-lg"
                    style={{ background: 'hsl(0 0% 10%)', border: `1px solid ${accent}30` }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="text-sm font-mono truncate block" style={{ color: 'hsl(40 50% 70%)' }}>
                      {crop.common_name || crop.name}
                    </span>
                    <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                      {crop.category}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 rounded-lg" style={{ background: 'hsl(0 0% 10%)', border: '1px dashed hsl(0 0% 25%)' }}>
                <span className="text-sm font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                  No crops in this zone yet
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Default hint */}
      {!selectedHz && (
        <div className="px-4 pb-4">
          <p className="text-[10px] font-mono text-center" style={{ color: 'hsl(0 0% 40%)' }}>
            Select a frequency to focus your view
          </p>
        </div>
      )}
    </div>
  );
};

export default ResonanceEngine;
