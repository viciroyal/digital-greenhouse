import { motion } from 'framer-motion';
import { Music, Zap, Loader2 } from 'lucide-react';
import { useFrequencyZones, type MasterCrop } from '@/hooks/useMasterCrops';

/**
 * VIBRATIONAL LEGEND
 * The Solfeggio Frequency Map (396Hz - 963Hz)
 * Spirit layer for the Ancestral Path
 * Now connected to the master_crops database for synchronized data
 */

export interface FrequencyData {
  hz: number;
  name: string;
  color: string;
  description: string;
  element: string;
  crops: MasterCrop[];
}

// Fallback frequency data when database is empty
export const frequencies: FrequencyData[] = [
  { hz: 396, name: 'ROOT PULSE', color: 'hsl(0 70% 50%)', description: 'Liberation from fear. Foundation crops that anchor the soil.', element: 'Earth', crops: [] },
  { hz: 417, name: 'STONE HUM', color: 'hsl(30 70% 50%)', description: 'Facilitating change. Mineral-rich crops that break stagnation.', element: 'Stone', crops: [] },
  { hz: 528, name: 'THE SONGLINE', color: 'hsl(120 60% 45%)', description: 'DNA repair. Transformation frequency for leafy abundance.', element: 'Life', crops: [] },
  { hz: 639, name: 'GOLD FLOW', color: 'hsl(51 100% 50%)', description: 'Harmonizing relationships. Sweet crops that connect communities.', element: 'Gold', crops: [] },
  { hz: 741, name: 'VOICE CHANNEL', color: 'hsl(195 80% 50%)', description: 'Awakening intuition. Aromatic crops that speak to the senses.', element: 'Air', crops: [] },
  { hz: 852, name: 'THIRD EYE', color: 'hsl(270 70% 55%)', description: 'Spiritual order. Medicinal crops that open perception.', element: 'Spirit', crops: [] },
  { hz: 963, name: 'SOURCE CODE', color: 'hsl(0 0% 85%)', description: 'Divine connection. Seed-saving crops that carry the code forward.', element: 'Light', crops: [] },
];

const frequencyDescriptions: Record<number, string> = {
  396: 'Liberation from fear. Foundation crops that anchor the soil.',
  417: 'Facilitating change. Mineral-rich crops that break stagnation.',
  528: 'DNA repair. Transformation frequency for leafy abundance.',
  639: 'Harmonizing relationships. Sweet crops that connect communities.',
  741: 'Awakening intuition. Aromatic crops that speak to the senses.',
  852: 'Spiritual order. Medicinal crops that open perception.',
  963: 'Divine connection. Seed-saving crops that carry the code forward.',
};

interface VibrationalLegendProps {
  onSelectFrequency?: (hz: number) => void;
  selectedFrequency?: number | null;
}

const VibrationalLegend = ({ onSelectFrequency, selectedFrequency }: VibrationalLegendProps) => {
  const { zones, isLoading } = useFrequencyZones();

  // Use database zones or fallback
  const displayZones: FrequencyData[] = zones.length > 0 
    ? zones.map(zone => ({
        ...zone,
        description: frequencyDescriptions[zone.hz] || '',
      }))
    : frequencies;

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
          className="text-sm font-mono flex items-center justify-center gap-2"
          style={{ color: 'hsl(40 50% 60%)' }}
        >
          Solfeggio Frequencies • 396Hz to 963Hz
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        </p>
      </motion.div>

      {/* Frequency Stack */}
      <div className="space-y-3">
        {displayZones.map((freq, index) => {
          const cropCount = freq.crops?.length || 0;
          
          return (
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
                  
                  {/* Crop preview from database */}
                  {freq.crops && freq.crops.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {freq.crops.slice(0, 3).map((crop) => (
                        <span
                          key={crop.id}
                          className="text-[10px] font-mono px-2 py-0.5 rounded"
                          style={{
                            background: 'hsl(0 0% 15%)',
                            color: 'hsl(0 0% 60%)',
                            border: '1px solid hsl(0 0% 25%)',
                          }}
                        >
                          {crop.common_name || crop.name}
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
                  )}
                  
                  {cropCount === 0 && !isLoading && zones.length === 0 && (
                    <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                      Loading crops from database...
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export { VibrationalLegend };
