import { motion } from 'framer-motion';

/**
 * Chakra color mapping for cultural traditions
 * Each culture is mapped to its bio-energetic zone
 */
const chakraColorMap = {
  vedic: { hsl: 'hsl(45 90% 55%)', label: 'Solar Plexus', name: 'Yellow' },
  chinese: { hsl: 'hsl(140 50% 45%)', label: 'Heart', name: 'Green' },
  aboriginal: { hsl: 'hsl(210 70% 55%)', label: 'Throat', name: 'Blue' },
  dogon: { hsl: 'hsl(280 60% 55%)', label: 'Third Eye', name: 'Indigo' },
  kemit: { hsl: 'hsl(51 100% 50%)', label: 'Crown', name: 'Gold' },
  muscogee: { hsl: 'hsl(0 70% 45%)', label: 'Root', name: 'Red' },
  olmec: { hsl: 'hsl(30 60% 45%)', label: 'Structure', name: 'Amber' },
} as const;

type CultureType = keyof typeof chakraColorMap;

interface CulturalProtocol {
  culture: CultureType;
  protocolId: string;
  title: string;
  description: string;
}

interface CulturalProtocolsProps {
  level: number;
  color: string;
}

/**
 * Cultural protocol definitions mapped to each level
 * Each protocol is aligned to its correct bio-energetic zone (Chakra)
 */
const levelCulturalProtocols: Record<number, CulturalProtocol[]> = {
  1: [
    {
      culture: 'muscogee',
      protocolId: 'A',
      title: 'THE IRON ROOT (MUSCOGEE & MAROONS)',
      description: 'The first people understood the Iron Law: Do not break the fungal spine. Walk softly on the mycelium. The Maroons carried the seeds in their hair—survival encoded in their DNA.',
    },
  ],
  2: [
    {
      culture: 'olmec',
      protocolId: 'A',
      title: 'THE STONE BODY (OLMEC)',
      description: 'The Olmec built with basalt—the paramagnetic stone that hums with the Earth\'s frequency. The colossal heads are tuning forks for the soil. Apply rock dust to rebuild the magnetic skeleton.',
    },
    {
      culture: 'vedic',
      protocolId: 'B',
      title: 'THE SOLAR FIRE (VEDIC)',
      description: 'The Olmec builds the body (Stone), but the Vedic Rishis light the metabolism (Fire). Use Agnihotra to feed the Solar Plexus of the farm. The fire at sunrise and sunset calibrates the plant\'s inner clock.',
    },
  ],
  3: [
    {
      culture: 'dogon',
      protocolId: 'A',
      title: 'THE SIRIUS RECEIVER (DOGON)',
      description: 'The Dogon built the antenna before the telescope existed. The copper spiral catches the signal from Sirius B—the seed star. Point it north and ground it deep.',
    },
    {
      culture: 'aboriginal',
      protocolId: 'B',
      title: 'THE SONGLINE (ABORIGINAL)',
      description: 'The Dogon build the receiver, but the Aboriginals provide the voice. Sing the frequency to open the stomata (Throat). The Songline carries the water memory across the desert.',
    },
    {
      culture: 'chinese',
      protocolId: 'C',
      title: 'THE EARTH HEART (CHINESE)',
      description: 'Before you place the antenna, find the Meridian. Use Feng Shui to unblock the Heart Chakra of the soil so the Chi can flow. The dragon veins run through your field—locate the acupoints.',
    },
  ],
  4: [
    {
      culture: 'kemit',
      protocolId: 'A',
      title: 'THE GOLD ALCHEMY (KEMIT)',
      description: 'The priests of Kemit knew the secret: Sugar is stored sunlight. The Brix refractometer reveals what the ancients saw with their inner eye. 12+ Brix is the threshold of the Golden Harvest.',
    },
  ],
  5: [
    {
      culture: 'muscogee',
      protocolId: 'A',
      title: 'THE MAROON BRAID (SOVEREIGNTY)',
      description: 'The loop closes where it began—at the Root. The Grandmothers braided rice into their hair so we could eat today. The seed is the beginning and the end. You are now the Ancestor.',
    },
  ],
};

/**
 * Chakra Dot Component - Visual indicator for bio-energetic zone
 */
const ChakraDot = ({ culture }: { culture: CultureType }) => {
  const chakra = chakraColorMap[culture];
  
  return (
    <motion.div
      className="relative flex-shrink-0"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-sm"
        style={{
          background: chakra.hsl,
          opacity: 0.6,
        }}
      />
      {/* Inner dot */}
      <div
        className="relative w-3 h-3 rounded-full"
        style={{
          background: chakra.hsl,
          boxShadow: `0 0 8px ${chakra.hsl}, 0 0 12px ${chakra.hsl}`,
        }}
      />
    </motion.div>
  );
};

/**
 * Cultural Protocols Component
 * Displays chakra-aligned cultural lore with colored dot indicators
 */
const CulturalProtocols = ({ level, color }: CulturalProtocolsProps) => {
  const protocols = levelCulturalProtocols[level];
  
  if (!protocols || protocols.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <h3 
        className="text-xs font-mono tracking-[0.2em]"
        style={{ 
          fontFamily: "'Space Mono', monospace",
          color: 'hsl(40 50% 50%)' 
        }}
      >
        ANCESTRAL PROTOCOLS
      </h3>
      
      <div className="space-y-4">
        {protocols.map((protocol, index) => {
          const chakra = chakraColorMap[protocol.culture];
          
          return (
            <motion.div
              key={protocol.protocolId}
              className="p-4 rounded-xl"
              style={{
                background: 'hsl(0 0% 8% / 0.8)',
                border: `1px solid ${chakra.hsl}30`,
                backdropFilter: 'blur(8px)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              {/* Protocol Header with Chakra Dot */}
              <div className="flex items-center gap-3 mb-3">
                <ChakraDot culture={protocol.culture} />
                <div className="flex-1">
                  <span
                    className="text-xs font-mono"
                    style={{ 
                      fontFamily: "'Space Mono', monospace",
                      color: chakra.hsl,
                    }}
                  >
                    PROTOCOL {protocol.protocolId}
                  </span>
                  <h4
                    className="text-sm tracking-wide"
                    style={{ 
                      fontFamily: "'Staatliches', sans-serif",
                      color: 'hsl(0 0% 90%)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {protocol.title}
                  </h4>
                </div>
                {/* Chakra Zone Badge */}
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    background: `${chakra.hsl}20`,
                    color: chakra.hsl,
                    border: `1px solid ${chakra.hsl}40`,
                  }}
                >
                  {chakra.label}
                </span>
              </div>
              
              {/* Protocol Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ 
                  fontFamily: "'Space Mono', monospace",
                  color: 'hsl(40 30% 70%)',
                  lineHeight: '1.7',
                }}
              >
                {protocol.description}
              </p>
            </motion.div>
          );
        })}
      </div>
      
      {/* Chakra Alignment Legend (only show if multiple protocols) */}
      {protocols.length > 1 && (
        <motion.div
          className="flex flex-wrap gap-3 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {protocols.map(protocol => {
            const chakra = chakraColorMap[protocol.culture];
            return (
              <div 
                key={protocol.culture}
                className="flex items-center gap-1.5 text-[10px] font-mono"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: 'hsl(0 0% 50%)',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: chakra.hsl }}
                />
                <span>{chakra.name} = {chakra.label}</span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default CulturalProtocols;
