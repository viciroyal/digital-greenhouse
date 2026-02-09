import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Leaf, Pickaxe, Droplets } from 'lucide-react';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FREQUENCY PROTOCOL REFERENCE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * The complete mapping of Solfeggio frequencies to:
 * - Cultural Role
 * - Dominant Mineral
 * - Key Crop Guild
 * - Soil Protocol Focus
 */

export interface FrequencyProtocol {
  hz: number;
  color: string;
  culturalRole: string;
  dominantMineral: string;
  mineralSymbol: string;
  cropGuild: string[];
  soilProtocolFocus: string;
  soilProtocolDetail: string;
}

// THE MASTER FREQUENCY PROTOCOL MAP
const FREQUENCY_PROTOCOLS: FrequencyProtocol[] = [
  {
    hz: 396,
    color: 'hsl(0 60% 50%)',
    culturalRole: 'The Heat & Root',
    dominantMineral: 'Phosphorus',
    mineralSymbol: 'P',
    cropGuild: ['Tomatoes', 'Beets', 'Red Potatoes'],
    soilProtocolFocus: 'The Root',
    soilProtocolDetail: 'Double Kelp and Sea Minerals for root anchoring.',
  },
  {
    hz: 417,
    color: 'hsl(30 70% 50%)',
    culturalRole: 'The Vine & Water',
    dominantMineral: 'Hydrogen/Carbon',
    mineralSymbol: 'H/C',
    cropGuild: ['Watermelons', 'Sweet Potatoes'],
    soilProtocolFocus: 'The Vision',
    soilProtocolDetail: 'High Humates to hold moisture for the heavy vines.',
  },
  {
    hz: 528,
    color: 'hsl(51 80% 50%)',
    culturalRole: 'The Solar Engine',
    dominantMineral: 'Nitrogen',
    mineralSymbol: 'N',
    cropGuild: ['Corn', 'Beans', 'Squash'],
    soilProtocolFocus: 'The Three Sisters',
    soilProtocolDetail: 'Nitrogen-fixing legumes support the corn scaffold.',
  },
  {
    hz: 639,
    color: 'hsl(120 50% 45%)',
    culturalRole: 'The Heart & Breath',
    dominantMineral: 'Calcium',
    mineralSymbol: 'Ca',
    cropGuild: ['Kale', 'Broccoli', 'Cabbage'],
    soilProtocolFocus: 'The Structure',
    soilProtocolDetail: 'Harmony Calcium for cell wall integrity and photosynthesis.',
  },
  {
    hz: 741,
    color: 'hsl(210 60% 50%)',
    culturalRole: 'The Expression',
    dominantMineral: 'Potassium',
    mineralSymbol: 'K',
    cropGuild: ['Okra', 'Berries', 'Roselle'],
    soilProtocolFocus: 'The Alchemy',
    soilProtocolDetail: 'Alfalfa meal to boost microbial sugars for fruit set.',
  },
  {
    hz: 852,
    color: 'hsl(270 50% 50%)',
    culturalRole: 'The Vision',
    dominantMineral: 'Silica',
    mineralSymbol: 'Si',
    cropGuild: ['Indigo', 'Cotton', 'Medicinals'],
    soilProtocolFocus: 'The Master Mix',
    soilProtocolDetail: 'Lean heavier on Sea Minerals for trace element complexity.',
  },
  {
    hz: 963,
    color: 'hsl(300 50% 50%)',
    culturalRole: 'The Shield',
    dominantMineral: 'Sulfur',
    mineralSymbol: 'S',
    cropGuild: ['Garlic', 'Onions', 'Zinnias'],
    soilProtocolFocus: 'The Carry',
    soilProtocolDetail: 'Ensure sufficient Calcium to prevent bulb rot.',
  },
];

// Integration Protocol: How each layer is applied across the farm
export interface IntegrationLayer {
  layer: 'Science' | 'Action' | 'Theory' | 'Spirit';
  method: string;
  status: string;
  type: 'action' | 'theory' | 'spirit';
}

export const INTEGRATION_PROTOCOL: IntegrationLayer[] = [
  {
    layer: 'Science',
    method: 'Interplanting',
    status: 'Integrated into the 44-bed layout.',
    type: 'action',
  },
  {
    layer: 'Action',
    method: '5-Quart Reset',
    status: 'Applied to the full Guild footprint.',
    type: 'action',
  },
  {
    layer: 'Theory',
    method: 'Bio-Harmonic Guilds',
    status: 'Documented as "Standard Operating Procedure."',
    type: 'theory',
  },
  {
    layer: 'Spirit',
    method: 'Hz Broadcast',
    status: 'Scheduled via the Educational Pavilion PA.',
    type: 'spirit',
  },
];

// Hole/Plug Protocol: Infrastructure gaps mapped to frequency-aligned solutions
export interface HolePlugMapping {
  hole: string;
  plug: string;
  hz: number;
  hzLabel: string;
}

export const HOLE_PLUG_PROTOCOL: HolePlugMapping[] = [
  {
    hole: 'Nutrient Loss',
    plug: 'Vortex of Return (Compost)',
    hz: 396,
    hzLabel: 'Foundation',
  },
  {
    hole: 'Guesswork',
    plug: 'NIR Spectroscopy Scans',
    hz: 741,
    hzLabel: 'Signal',
  },
  {
    hole: 'Labor Leak',
    plug: 'Well-to-Irrigation Hookup',
    hz: 417,
    hzLabel: 'Flow',
  },
  {
    hole: 'Silence',
    plug: 'Resonant Stage PA System',
    hz: 963,
    hzLabel: 'Source',
  },
];

// Infrastructure Components: Missing elements mapped to vibrational alignment
export interface InfrastructureComponent {
  component: string;
  missingElement: string;
  vibrationalAlignment: string;
  hzRange?: string;
}

export const INFRASTRUCTURE_COMPONENTS: InfrastructureComponent[] = [
  {
    component: 'Irrigation',
    missingElement: 'Zone-Specific Drip Timers',
    vibrationalAlignment: '396Hz (Deep) to 963Hz (Mist)',
    hzRange: '396-963',
  },
  {
    component: 'Harvest',
    missingElement: 'Structured Water Wash Station',
    vibrationalAlignment: '528Hz (Solar/Cleaning)',
    hzRange: '528',
  },
  {
    component: 'Data',
    missingElement: 'NIR/Brix Digital Ledger',
    vibrationalAlignment: 'The "5th Agreement" Record',
    hzRange: '741',
  },
  {
    component: 'Security',
    missingElement: 'Perimeter "Garlic Shield" Expansion',
    vibrationalAlignment: '963Hz (Protection)',
    hzRange: '963',
  },
];

interface Props {
  isBeginnerMode?: boolean;
}

const FrequencyProtocolReference = ({ isBeginnerMode = false }: Props) => {
  const [expandedHz, setExpandedHz] = useState<number | null>(null);

  const toggleExpand = (hz: number) => {
    setExpandedHz(expandedHz === hz ? null : hz);
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(270 15% 10%), hsl(270 10% 6%))',
        border: '2px solid hsl(270 30% 30%)',
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: 'linear-gradient(135deg, hsl(270 20% 15%), hsl(270 15% 10%))',
          borderBottom: '1px solid hsl(270 20% 25%)',
        }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" style={{ color: 'hsl(270 50% 60%)' }} />
          <h3
            className="text-lg tracking-wider"
            style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(270 50% 65%)' }}
          >
            FREQUENCY PROTOCOL
          </h3>
        </div>
        <p className="text-[10px] font-mono mt-1" style={{ color: 'hsl(270 30% 50%)' }}>
          {isBeginnerMode ? 'Simple Guide • Tap to expand' : 'Cultural Role → Mineral → Soil Focus'}
        </p>
      </div>

      {/* Protocol List */}
      <div className="p-4 space-y-2">
        {FREQUENCY_PROTOCOLS.map((protocol) => {
          const isExpanded = expandedHz === protocol.hz;
          
          return (
            <motion.div
              key={protocol.hz}
              className="rounded-lg overflow-hidden"
              style={{
                background: isExpanded ? `${protocol.color}15` : 'hsl(0 0% 10%)',
                border: `1px solid ${isExpanded ? protocol.color : 'hsl(0 0% 18%)'}`,
              }}
            >
              {/* Header Row */}
              <button
                className="w-full flex items-center gap-3 p-3 text-left"
                onClick={() => toggleExpand(protocol.hz)}
              >
                {/* Frequency Badge */}
                <div
                  className="w-12 h-12 rounded-lg flex flex-col items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(145deg, ${protocol.color}40, ${protocol.color}20)`,
                    border: `2px solid ${protocol.color}`,
                  }}
                >
                  <span className="text-sm font-bold" style={{ color: protocol.color }}>
                    {protocol.hz}
                  </span>
                  <span className="text-[8px] font-mono" style={{ color: protocol.color }}>Hz</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-mono font-bold block truncate" style={{ color: protocol.color }}>
                    {protocol.culturalRole}
                  </span>
                  {isBeginnerMode ? (
                    <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                      {protocol.cropGuild.slice(0, 2).join(', ')}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                      {protocol.dominantMineral} ({protocol.mineralSymbol})
                    </span>
                  )}
                </div>

                {/* Expand Icon */}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 shrink-0" style={{ color: protocol.color }} />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'hsl(0 0% 40%)' }} />
                )}
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-3 pb-3"
                  >
                    <div className="space-y-2 pt-2" style={{ borderTop: `1px solid ${protocol.color}30` }}>
                      {/* Mineral */}
                      {!isBeginnerMode && (
                        <div className="flex items-center gap-2">
                          <Pickaxe className="w-4 h-4" style={{ color: 'hsl(35 50% 55%)' }} />
                          <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                            Mineral:
                          </span>
                          <span className="text-xs font-mono font-bold" style={{ color: 'hsl(35 60% 65%)' }}>
                            {protocol.dominantMineral}
                          </span>
                        </div>
                      )}

                      {/* Crop Guild */}
                      <div className="flex items-start gap-2">
                        <Leaf className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'hsl(120 50% 50%)' }} />
                        <div>
                          <span className="text-[10px] font-mono block" style={{ color: 'hsl(0 0% 50%)' }}>
                            Crop Guild:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {protocol.cropGuild.map((crop) => (
                              <span
                                key={crop}
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                                style={{
                                  background: `${protocol.color}20`,
                                  color: protocol.color,
                                  border: `1px solid ${protocol.color}40`,
                                }}
                              >
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Soil Protocol */}
                      <div className="flex items-start gap-2">
                        <Droplets className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'hsl(195 60% 50%)' }} />
                        <div>
                          <span className="text-[10px] font-mono block" style={{ color: 'hsl(0 0% 50%)' }}>
                            Soil Focus: <span style={{ color: protocol.color }}>{protocol.soilProtocolFocus}</span>
                          </span>
                          <p className="text-[10px] font-mono mt-0.5" style={{ color: 'hsl(0 0% 60%)' }}>
                            {protocol.soilProtocolDetail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Wisdom */}
      <div className="px-4 pb-4">
        <LearnMoreButton wisdomKey="hermetic-vibration" />
      </div>
    </div>
  );
};

export default FrequencyProtocolReference;

// Export the protocol data for use in other engines
export { FREQUENCY_PROTOCOLS };
