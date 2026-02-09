import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, Leaf, Filter, Loader2 } from 'lucide-react';
import { useFrequencyZones, useCropsByFrequency } from '@/hooks/useMasterCrops';

/**
 * AGRO-CHORD FILTER
 * Frequency selector that filters crops by their resonant frequency
 * Now connected to the master_crops database table
 */

const AgroChordFilter = () => {
  const [selectedHz, setSelectedHz] = useState<number | null>(null);
  const { zones, isLoading: zonesLoading } = useFrequencyZones();
  const { data: filteredCrops, isLoading: cropsLoading } = useCropsByFrequency(selectedHz);

  const selectedZone = zones.find((z) => z.hz === selectedHz);
  const isLoading = zonesLoading || cropsLoading;

  // Fallback frequencies if database is empty
  const frequencyButtons = zones.length > 0 
    ? zones 
    : [
        { hz: 396, name: 'ROOT PULSE', color: 'hsl(0 70% 50%)', element: 'Earth', crops: [] },
        { hz: 417, name: 'STONE HUM', color: 'hsl(30 70% 50%)', element: 'Stone', crops: [] },
        { hz: 528, name: 'THE SONGLINE', color: 'hsl(120 60% 45%)', element: 'Life', crops: [] },
        { hz: 639, name: 'GOLD FLOW', color: 'hsl(51 100% 50%)', element: 'Gold', crops: [] },
        { hz: 741, name: 'VOICE CHANNEL', color: 'hsl(195 80% 50%)', element: 'Air', crops: [] },
        { hz: 852, name: 'THIRD EYE', color: 'hsl(270 70% 55%)', element: 'Spirit', crops: [] },
        { hz: 963, name: 'SOURCE CODE', color: 'hsl(0 0% 85%)', element: 'Light', crops: [] },
      ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'hsl(20 30% 8%)',
          border: selectedZone
            ? `2px solid ${selectedZone.color}`
            : '2px solid hsl(270 50% 40%)',
          boxShadow: selectedZone
            ? `0 0 30px ${selectedZone.color}30`
            : '0 0 25px hsl(270 50% 30% / 0.2)',
        }}
      >
        {/* Header */}
        <div
          className="p-4"
          style={{
            background: selectedZone
              ? `linear-gradient(135deg, ${selectedZone.color}20, ${selectedZone.color}10)`
              : 'linear-gradient(135deg, hsl(270 40% 15%), hsl(280 35% 12%))',
            borderBottom: selectedZone
              ? `1px solid ${selectedZone.color}40`
              : '1px solid hsl(270 40% 25%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: selectedZone ? `${selectedZone.color}30` : 'hsl(270 50% 25%)',
                border: selectedZone
                  ? `2px solid ${selectedZone.color}`
                  : '2px solid hsl(270 60% 50%)',
              }}
            >
              <Music2
                className="w-5 h-5"
                style={{ color: selectedZone?.color || 'hsl(270 80% 65%)' }}
              />
            </div>
            <div>
              <h3
                className="text-lg tracking-wider"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: selectedZone?.color || 'hsl(270 70% 65%)',
                }}
              >
                AGRO-CHORD FILTER
              </h3>
              <p
                className="text-xs font-mono"
                style={{ color: 'hsl(270 40% 50%)' }}
              >
                Frequency-Based Crop Selector • Database Synced
              </p>
            </div>
          </div>
        </div>

        {/* Frequency Selector */}
        <div className="p-4">
          <p
            className="text-[10px] font-mono tracking-wider mb-3"
            style={{ color: 'hsl(0 0% 50%)' }}
          >
            SELECT FREQUENCY ZONE
          </p>
          <div className="flex flex-wrap gap-2">
            {frequencyButtons.map((zone) => (
              <motion.button
                key={zone.hz}
                className="px-4 py-2 rounded-lg font-mono text-sm transition-all"
                style={{
                  background:
                    selectedHz === zone.hz
                      ? `linear-gradient(135deg, ${zone.color}40, ${zone.color}20)`
                      : 'hsl(0 0% 12%)',
                  border:
                    selectedHz === zone.hz
                      ? `2px solid ${zone.color}`
                      : '1px solid hsl(0 0% 25%)',
                  color: selectedHz === zone.hz ? zone.color : 'hsl(0 0% 60%)',
                  boxShadow:
                    selectedHz === zone.hz ? `0 0 15px ${zone.color}40` : 'none',
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedHz(selectedHz === zone.hz ? null : zone.hz)}
              >
                {zone.hz}Hz
              </motion.button>
            ))}
          </div>
        </div>

        {/* Filtered Crops Display */}
        <AnimatePresence mode="wait">
          {selectedZone && (
            <motion.div
              key={selectedZone.hz}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className="p-4 mx-4 mb-4 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${selectedZone.color}15, ${selectedZone.color}08)`,
                  border: `1px solid ${selectedZone.color}50`,
                }}
              >
                {/* Frequency Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-lg flex flex-col items-center justify-center"
                    style={{
                      background: `${selectedZone.color}25`,
                      border: `2px solid ${selectedZone.color}`,
                      boxShadow: `0 0 20px ${selectedZone.color}30`,
                    }}
                  >
                    <span
                      className="text-xl font-bold"
                      style={{
                        fontFamily: "'Staatliches', sans-serif",
                        color: selectedZone.color,
                      }}
                    >
                      {selectedZone.hz}
                    </span>
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: selectedZone.color }}
                    >
                      Hz
                    </span>
                  </div>
                  <div>
                    <h4
                      className="text-lg tracking-wider"
                      style={{
                        fontFamily: "'Staatliches', sans-serif",
                        color: selectedZone.color,
                      }}
                    >
                      {selectedZone.name}
                    </h4>
                    <p
                      className="text-xs font-mono"
                      style={{ color: 'hsl(0 0% 55%)' }}
                    >
                      Element: {selectedZone.element} • {filteredCrops?.length || 0} crops
                    </p>
                  </div>
                </div>

                {/* Crops Grid */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4" style={{ color: selectedZone.color }} />
                    <p
                      className="text-xs font-mono tracking-wider"
                      style={{ color: 'hsl(0 0% 55%)' }}
                    >
                      RESONANT CROPS
                    </p>
                    {isLoading && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" style={{ color: selectedZone.color }} />
                    )}
                  </div>
                  
                  {filteredCrops && filteredCrops.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {filteredCrops.map((crop, index) => (
                        <motion.div
                          key={crop.id}
                          className="flex flex-col p-2 rounded-lg"
                          style={{
                            background: 'hsl(0 0% 10%)',
                            border: '1px solid hsl(0 0% 20%)',
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <div className="flex items-center gap-2">
                            <Leaf
                              className="w-4 h-4 shrink-0"
                              style={{ color: selectedZone.color }}
                            />
                            <span
                              className="text-sm font-mono font-bold"
                              style={{ color: 'hsl(0 0% 80%)' }}
                            >
                              {crop.common_name || crop.name}
                            </span>
                          </div>
                          {crop.harvest_days && (
                            <span
                              className="text-[9px] font-mono mt-1 ml-6"
                              style={{ color: 'hsl(0 0% 45%)' }}
                            >
                              {crop.harvest_days} days to harvest
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : !isLoading ? (
                    <p className="text-xs font-mono text-center py-4" style={{ color: 'hsl(0 0% 40%)' }}>
                      No crops found for this frequency
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!selectedZone && (
          <div className="px-4 pb-4">
            <div
              className="p-4 rounded-lg text-center"
              style={{
                background: 'hsl(0 0% 10%)',
                border: '1px dashed hsl(0 0% 25%)',
              }}
            >
              <Music2
                className="w-8 h-8 mx-auto mb-2"
                style={{ color: 'hsl(0 0% 35%)' }}
              />
              <p
                className="text-sm font-mono"
                style={{ color: 'hsl(0 0% 45%)' }}
              >
                Select a frequency to filter crops from the master database
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgroChordFilter;
