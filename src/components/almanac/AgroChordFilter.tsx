import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, Leaf, Filter } from 'lucide-react';
import { frequencies, type FrequencyData } from './VibrationalLegend';

/**
 * AGRO-CHORD FILTER
 * Frequency selector that filters crops by their resonant frequency
 * Field Almanac utility for precision planting
 */

const AgroChordFilter = () => {
  const [selectedHz, setSelectedHz] = useState<number | null>(null);

  const selectedFreq = frequencies.find((f) => f.hz === selectedHz);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'hsl(20 30% 8%)',
          border: selectedFreq
            ? `2px solid ${selectedFreq.color}`
            : '2px solid hsl(270 50% 40%)',
          boxShadow: selectedFreq
            ? `0 0 30px ${selectedFreq.color}30`
            : '0 0 25px hsl(270 50% 30% / 0.2)',
        }}
      >
        {/* Header */}
        <div
          className="p-4"
          style={{
            background: selectedFreq
              ? `linear-gradient(135deg, ${selectedFreq.color}20, ${selectedFreq.color}10)`
              : 'linear-gradient(135deg, hsl(270 40% 15%), hsl(280 35% 12%))',
            borderBottom: selectedFreq
              ? `1px solid ${selectedFreq.color}40`
              : '1px solid hsl(270 40% 25%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: selectedFreq ? `${selectedFreq.color}30` : 'hsl(270 50% 25%)',
                border: selectedFreq
                  ? `2px solid ${selectedFreq.color}`
                  : '2px solid hsl(270 60% 50%)',
              }}
            >
              <Music2
                className="w-5 h-5"
                style={{ color: selectedFreq?.color || 'hsl(270 80% 65%)' }}
              />
            </div>
            <div>
              <h3
                className="text-lg tracking-wider"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: selectedFreq?.color || 'hsl(270 70% 65%)',
                }}
              >
                AGRO-CHORD FILTER
              </h3>
              <p
                className="text-xs font-mono"
                style={{ color: 'hsl(270 40% 50%)' }}
              >
                Frequency-Based Crop Selector
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
            SELECT FREQUENCY
          </p>
          <div className="flex flex-wrap gap-2">
            {frequencies.map((freq) => (
              <motion.button
                key={freq.hz}
                className="px-4 py-2 rounded-lg font-mono text-sm transition-all"
                style={{
                  background:
                    selectedHz === freq.hz
                      ? `linear-gradient(135deg, ${freq.color}40, ${freq.color}20)`
                      : 'hsl(0 0% 12%)',
                  border:
                    selectedHz === freq.hz
                      ? `2px solid ${freq.color}`
                      : '1px solid hsl(0 0% 25%)',
                  color: selectedHz === freq.hz ? freq.color : 'hsl(0 0% 60%)',
                  boxShadow:
                    selectedHz === freq.hz ? `0 0 15px ${freq.color}40` : 'none',
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedHz(selectedHz === freq.hz ? null : freq.hz)}
              >
                {freq.hz}Hz
              </motion.button>
            ))}
          </div>
        </div>

        {/* Filtered Crops Display */}
        <AnimatePresence mode="wait">
          {selectedFreq && (
            <motion.div
              key={selectedFreq.hz}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className="p-4 mx-4 mb-4 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${selectedFreq.color}15, ${selectedFreq.color}08)`,
                  border: `1px solid ${selectedFreq.color}50`,
                }}
              >
                {/* Frequency Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-lg flex flex-col items-center justify-center"
                    style={{
                      background: `${selectedFreq.color}25`,
                      border: `2px solid ${selectedFreq.color}`,
                      boxShadow: `0 0 20px ${selectedFreq.color}30`,
                    }}
                  >
                    <span
                      className="text-xl font-bold"
                      style={{
                        fontFamily: "'Staatliches', sans-serif",
                        color: selectedFreq.color,
                      }}
                    >
                      {selectedFreq.hz}
                    </span>
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: selectedFreq.color }}
                    >
                      Hz
                    </span>
                  </div>
                  <div>
                    <h4
                      className="text-lg tracking-wider"
                      style={{
                        fontFamily: "'Staatliches', sans-serif",
                        color: selectedFreq.color,
                      }}
                    >
                      {selectedFreq.name}
                    </h4>
                    <p
                      className="text-xs"
                      style={{ color: 'hsl(40 40% 65%)' }}
                    >
                      {selectedFreq.description}
                    </p>
                  </div>
                </div>

                {/* Crops Grid */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4" style={{ color: selectedFreq.color }} />
                    <p
                      className="text-xs font-mono tracking-wider"
                      style={{ color: 'hsl(0 0% 55%)' }}
                    >
                      RESONANT CROPS
                    </p>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded ml-auto"
                      style={{
                        background: `${selectedFreq.color}20`,
                        color: selectedFreq.color,
                        border: `1px solid ${selectedFreq.color}50`,
                      }}
                    >
                      {selectedFreq.element}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedFreq.crops.map((crop, index) => (
                      <motion.div
                        key={crop}
                        className="flex items-center gap-2 p-2 rounded-lg"
                        style={{
                          background: 'hsl(0 0% 10%)',
                          border: '1px solid hsl(0 0% 20%)',
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Leaf
                          className="w-4 h-4 shrink-0"
                          style={{ color: selectedFreq.color }}
                        />
                        <span
                          className="text-sm font-mono"
                          style={{ color: 'hsl(0 0% 75%)' }}
                        >
                          {crop}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!selectedFreq && (
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
                Select a frequency to filter crops
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgroChordFilter;
