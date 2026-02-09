import { motion } from 'framer-motion';
import { Music, Zap } from 'lucide-react';

/**
 * VIBRATIONAL LEGEND
 * The Solfeggio Frequency Map (396Hz - 963Hz)
 * Spirit layer for the Ancestral Path
 */

interface FrequencyData {
  hz: number;
  name: string;
  color: string;
  description: string;
  crops: string[];
  element: string;
}

const frequencies: FrequencyData[] = [
  {
    hz: 396,
    name: 'ROOT PULSE',
    color: 'hsl(0 70% 50%)',
    description: 'Liberation from fear. Foundation crops that anchor the soil.',
    crops: ['Tomatoes', 'Peppers', 'Potatoes', 'Beets', 'Carrots'],
    element: 'Earth',
  },
  {
    hz: 417,
    name: 'STONE HUM',
    color: 'hsl(30 70% 50%)',
    description: 'Facilitating change. Mineral-rich crops that break stagnation.',
    crops: ['Squash', 'Melons', 'Pumpkins', 'Gourds', 'Cucumbers'],
    element: 'Stone',
  },
  {
    hz: 528,
    name: 'THE SONGLINE',
    color: 'hsl(120 60% 45%)',
    description: 'DNA repair. Transformation frequency for leafy abundance.',
    crops: ['Kale', 'Collards', 'Spinach', 'Lettuce', 'Swiss Chard'],
    element: 'Life',
  },
  {
    hz: 639,
    name: 'GOLD FLOW',
    color: 'hsl(51 100% 50%)',
    description: 'Harmonizing relationships. Sweet crops that connect communities.',
    crops: ['Corn', 'Sweet Potatoes', 'Sugarcane', 'Berries', 'Grapes'],
    element: 'Gold',
  },
  {
    hz: 741,
    name: 'VOICE CHANNEL',
    color: 'hsl(195 80% 50%)',
    description: 'Awakening intuition. Aromatic crops that speak to the senses.',
    crops: ['Basil', 'Mint', 'Lavender', 'Rosemary', 'Sage'],
    element: 'Air',
  },
  {
    hz: 852,
    name: 'THIRD EYE',
    color: 'hsl(270 70% 55%)',
    description: 'Spiritual order. Medicinal crops that open perception.',
    crops: ['Echinacea', 'Ginseng', 'Chamomile', 'Turmeric', 'Ginger'],
    element: 'Spirit',
  },
  {
    hz: 963,
    name: 'SOURCE CODE',
    color: 'hsl(0 0% 90%)',
    description: 'Divine connection. Seed-saving crops that carry the code forward.',
    crops: ['Heirloom Beans', 'Ancient Grains', 'Landrace Seeds', 'Heritage Corn', 'Sacred Tobacco'],
    element: 'Light',
  },
];

interface VibrationalLegendProps {
  onSelectFrequency?: (hz: number) => void;
  selectedFrequency?: number | null;
}

const VibrationalLegend = ({ onSelectFrequency, selectedFrequency }: VibrationalLegendProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Music className="w-6 h-6" style={{ color: 'hsl(51 100% 60%)' }} />
          <h2
            className="text-2xl md:text-3xl tracking-[0.15em]"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(51 100% 60%)',
              textShadow: '0 0 30px hsl(51 80% 40% / 0.5)',
            }}
          >
            THE VIBRATIONAL LEGEND
          </h2>
          <Music className="w-6 h-6" style={{ color: 'hsl(51 100% 60%)' }} />
        </div>
        <p
          className="text-sm font-mono"
          style={{ color: 'hsl(40 50% 60%)' }}
        >
          Solfeggio Frequencies • 396Hz to 963Hz
        </p>
      </motion.div>

      {/* Frequency Stack */}
      <div className="space-y-3">
        {frequencies.map((freq, index) => (
          <motion.button
            key={freq.hz}
            className="w-full text-left rounded-xl overflow-hidden transition-all"
            style={{
              background: selectedFrequency === freq.hz
                ? `linear-gradient(135deg, ${freq.color}30, ${freq.color}15)`
                : 'hsl(20 25% 10% / 0.9)',
              border: selectedFrequency === freq.hz
                ? `2px solid ${freq.color}`
                : '1px solid hsl(0 0% 20%)',
              boxShadow: selectedFrequency === freq.hz
                ? `0 0 25px ${freq.color}40, inset 0 0 15px ${freq.color}15`
                : 'none',
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectFrequency?.(freq.hz)}
          >
            <div className="p-4 flex items-center gap-4">
              {/* Frequency Badge */}
              <div
                className="w-16 h-16 rounded-lg flex flex-col items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(145deg, ${freq.color}40, ${freq.color}20)`,
                  border: `2px solid ${freq.color}`,
                  boxShadow: `0 0 15px ${freq.color}30`,
                }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: freq.color, fontFamily: "'Staatliches', sans-serif" }}
                >
                  {freq.hz}
                </span>
                <span className="text-[10px] font-mono" style={{ color: freq.color }}>Hz</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4" style={{ color: freq.color }} />
                  <h3
                    className="text-sm tracking-wider"
                    style={{
                      fontFamily: "'Staatliches', sans-serif",
                      color: freq.color,
                    }}
                  >
                    {freq.name}
                  </h3>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full ml-auto"
                    style={{
                      background: `${freq.color}20`,
                      color: freq.color,
                      border: `1px solid ${freq.color}50`,
                    }}
                  >
                    {freq.element}
                  </span>
                </div>
                <p
                  className="text-xs mb-2"
                  style={{ color: 'hsl(40 40% 65%)' }}
                >
                  {freq.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {freq.crops.slice(0, 3).map((crop) => (
                    <span
                      key={crop}
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{
                        background: 'hsl(0 0% 15%)',
                        color: 'hsl(0 0% 60%)',
                        border: '1px solid hsl(0 0% 25%)',
                      }}
                    >
                      {crop}
                    </span>
                  ))}
                  {freq.crops.length > 3 && (
                    <span
                      className="text-[10px] font-mono px-2 py-0.5"
                      style={{ color: 'hsl(0 0% 50%)' }}
                    >
                      +{freq.crops.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export { VibrationalLegend, frequencies };
export type { FrequencyData };
