import { motion } from 'framer-motion';
import { Flame, Sparkles, AudioLines, Star, Compass } from 'lucide-react';

/**
 * 8-Point Chakra Alignment Map
 * Each culture is mapped to its exact bio-energetic zone
 */
const chakraColorMap = {
  root: { hsl: 'hsl(0 70% 45%)', label: 'Root', name: 'Red' },
  sacral: { hsl: 'hsl(25 80% 50%)', label: 'Sacral', name: 'Orange' },
  solar: { hsl: 'hsl(45 90% 55%)', label: 'Solar Plexus', name: 'Yellow' },
  heart: { hsl: 'hsl(140 50% 45%)', label: 'Heart', name: 'Green' },
  throat: { hsl: 'hsl(210 70% 55%)', label: 'Throat', name: 'Blue' },
  thirdEye: { hsl: 'hsl(280 60% 55%)', label: 'Third Eye', name: 'Indigo' },
  crown: { hsl: 'hsl(51 100% 50%)', label: 'Crown', name: 'Gold' },
  soulStar: { hsl: 'hsl(0 0% 90%)', label: 'Soul Star', name: 'White' },
} as const;

type ChakraType = keyof typeof chakraColorMap;

interface CulturalProtocol {
  chakra: ChakraType;
  stepId: string;
  title: string;
  culture: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CulturalProtocolsProps {
  level: number;
  color: string;
}

/**
 * 8-Point Chakra Alignment Protocol Definitions
 * Strict mapping of Culture → Energy Center
 */
const levelCulturalProtocols: Record<number, CulturalProtocol[]> = {
  // LEVEL 1: THE ROOT
  1: [
    {
      chakra: 'root',
      stepId: 'ROOT',
      title: 'THE ROOT',
      culture: 'Muscogee & Maroons',
      description: 'We ask the Muscogee for permission to enter the Red Clay. We use the Broadfork to open the Base Chakra of the farm without breaking the spine.',
    },
  ],
  
  // LEVEL 2: THE SACRAL (THE WOMB)
  2: [
    {
      chakra: 'sacral',
      stepId: 'WOMB',
      title: 'THE WOMB',
      culture: 'Olmec (Xi)',
      description: 'The Olmecs knew the stone flows like water. We apply Basalt to magnetize the Sacral Chakra of the soil. The Mother Culture understood the womb of the Earth.',
    },
  ],
  
  // LEVEL 3: THE ASCENSION (4 STEPS)
  3: [
    {
      chakra: 'solar',
      stepId: 'A',
      title: 'THE FIRE',
      culture: 'Vedic (India)',
      description: 'Ignite the Agnihotra Fire to clear the atmosphere. The Rishis understood that fire at sunrise and sunset calibrates the Solar Plexus of the field.',
      icon: Flame,
    },
    {
      chakra: 'heart',
      stepId: 'B',
      title: 'THE FLOW',
      culture: 'Chinese (Tao)',
      description: 'Unblock the Meridians (Feng Shui) to let Chi flow. The Heart Chakra of the soil requires balanced dragon veins. Locate the acupoints.',
      icon: Compass,
    },
    {
      chakra: 'throat',
      stepId: 'C',
      title: 'THE VOICE',
      culture: 'Aboriginal',
      description: 'Sing the Songlines to open the stomata. The Throat Chakra of the plant receives the frequency. The land remembers the songs.',
      icon: AudioLines,
    },
    {
      chakra: 'thirdEye',
      stepId: 'D',
      title: 'THE SIGNAL',
      culture: 'Dogon',
      description: 'Align the Antenna to Sirius B for cosmic download. The Third Eye of the farm receives the star transmission. Point north, ground deep.',
      icon: Star,
    },
  ],
  
  // LEVEL 4: THE CROWN
  4: [
    {
      chakra: 'crown',
      stepId: 'GOLD',
      title: 'THE GOLD',
      culture: 'Ancient Kemit',
      description: 'We measure the light (Brix). Kemit teaches us that high nutrient density is the crystallization of consciousness. 12+ Brix is the threshold.',
      icon: Sparkles,
    },
  ],
  
  // LEVEL 5: THE SOUL STAR (THE RETURN)
  5: [
    {
      chakra: 'soulStar',
      stepId: 'RETURN',
      title: 'THE RETURN',
      culture: 'Maroon Grandmothers',
      description: 'The seed is the capsule of time. We braid the future into the present. You do not own the harvest until you own the seed. You are now the Ancestor.',
    },
  ],
};

/**
 * Chakra Dot Component - Glowing energy center indicator
 */
const ChakraDot = ({ chakra }: { chakra: ChakraType }) => {
  const chakraData = chakraColorMap[chakra];
  
  return (
    <motion.div
      className="relative flex-shrink-0"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Outer pulse glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: chakraData.hsl,
          filter: 'blur(4px)',
        }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Inner dot */}
      <div
        className="relative w-3 h-3 rounded-full"
        style={{
          background: chakraData.hsl,
          boxShadow: `0 0 8px ${chakraData.hsl}, 0 0 16px ${chakraData.hsl}`,
        }}
      />
    </motion.div>
  );
};

/**
 * Step Card Component for Level 3 Ascension
 */
const AscensionStepCard = ({ protocol, index }: { protocol: CulturalProtocol; index: number }) => {
  const chakraData = chakraColorMap[protocol.chakra];
  const IconComponent = protocol.icon;
  
  return (
    <motion.div
      className="relative p-4 rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(0 0% 6%), hsl(0 0% 10%))`,
        border: `1px solid ${chakraData.hsl}40`,
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12 }}
    >
      {/* Accent glow line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: `linear-gradient(180deg, ${chakraData.hsl}, ${chakraData.hsl}50)`,
          boxShadow: `0 0 12px ${chakraData.hsl}`,
        }}
      />
      
      <div className="pl-3">
        {/* Step Header */}
        <div className="flex items-center gap-3 mb-2">
          {/* Step Icon */}
          {IconComponent && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `${chakraData.hsl}20`,
                border: `1px solid ${chakraData.hsl}50`,
                color: chakraData.hsl,
              }}
            >
              <IconComponent className="w-4 h-4" />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  background: `${chakraData.hsl}25`,
                  color: chakraData.hsl,
                }}
              >
                STEP {protocol.stepId}
              </span>
              <ChakraDot chakra={protocol.chakra} />
              <span
                className="text-[10px] font-mono"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: 'hsl(0 0% 50%)',
                }}
              >
                {chakraData.label}
              </span>
            </div>
            <h4
              className="text-sm mt-1"
              style={{ 
                fontFamily: "'Staatliches', sans-serif",
                color: chakraData.hsl,
                letterSpacing: '0.08em',
              }}
            >
              {protocol.title} ({protocol.culture})
            </h4>
          </div>
        </div>
        
        {/* Description */}
        <p
          className="text-xs leading-relaxed"
          style={{ 
            fontFamily: "'Space Mono', monospace",
            color: 'hsl(40 30% 65%)',
            lineHeight: '1.6',
          }}
        >
          {protocol.description}
        </p>
      </div>
    </motion.div>
  );
};

/**
 * Standard Protocol Card (for Levels 1, 2, 4, 5)
 */
const ProtocolCard = ({ protocol, index }: { protocol: CulturalProtocol; index: number }) => {
  const chakraData = chakraColorMap[protocol.chakra];
  const IconComponent = protocol.icon;
  
  return (
    <motion.div
      className="p-5 rounded-xl"
      style={{
        background: 'hsl(0 0% 8% / 0.9)',
        border: `1px solid ${chakraData.hsl}35`,
        backdropFilter: 'blur(8px)',
        boxShadow: `inset 0 0 30px ${chakraData.hsl}08`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <ChakraDot chakra={protocol.chakra} />
        
        <div className="flex-1">
          <span
            className="text-[10px] font-mono tracking-widest"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: 'hsl(0 0% 50%)',
            }}
          >
            PROTOCOL: {protocol.stepId}
          </span>
          <h4
            className="text-lg"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: chakraData.hsl,
              letterSpacing: '0.1em',
            }}
          >
            {protocol.title}
          </h4>
        </div>
        
        {/* Chakra Badge */}
        <div
          className="flex flex-col items-end"
        >
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{
              fontFamily: "'Space Mono', monospace",
              background: `${chakraData.hsl}20`,
              color: chakraData.hsl,
              border: `1px solid ${chakraData.hsl}40`,
            }}
          >
            {chakraData.label}
          </span>
          <span
            className="text-[9px] font-mono mt-1"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: 'hsl(0 0% 45%)',
            }}
          >
            {protocol.culture}
          </span>
        </div>
      </div>
      
      {/* Culture Subheader */}
      <div 
        className="flex items-center gap-2 mb-3 pb-3"
        style={{ borderBottom: `1px dashed ${chakraData.hsl}20` }}
      >
      {IconComponent && (
        <span style={{ color: chakraData.hsl }}>
          <IconComponent className="w-4 h-4" />
        </span>
      )}
        <span
          className="text-xs font-mono"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: 'hsl(40 40% 55%)',
          }}
        >
          Lineage: {protocol.culture}
        </span>
      </div>
      
      {/* Description */}
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
};

/**
 * Cultural Protocols Component
 * Strict 8-Point Chakra Alignment Display
 */
const CulturalProtocols = ({ level, color }: CulturalProtocolsProps) => {
  const protocols = levelCulturalProtocols[level];
  
  if (!protocols || protocols.length === 0) return null;
  
  // Level 3 uses the Ascension layout (4 step cards)
  const isAscensionLevel = level === 3;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 
          className="text-xs font-mono tracking-[0.2em]"
          style={{ 
            fontFamily: "'Space Mono', monospace",
            color: 'hsl(40 50% 50%)' 
          }}
        >
          {isAscensionLevel ? 'THE ASCENSION PATH' : 'CHAKRA PROTOCOL'}
        </h3>
        
        {isAscensionLevel && (
          <span
            className="text-[10px] font-mono px-2 py-1 rounded-full"
            style={{
              fontFamily: "'Space Mono', monospace",
              background: 'linear-gradient(90deg, hsl(45 90% 55% / 0.2), hsl(280 60% 55% / 0.2))',
              color: 'hsl(0 0% 70%)',
              border: '1px solid hsl(0 0% 30%)',
            }}
          >
            SOLAR → THIRD EYE
          </span>
        )}
      </div>
      
      {isAscensionLevel ? (
        // Level 3: 4 Ascension Step Cards
        <div className="space-y-3">
          {protocols.map((protocol, index) => (
            <AscensionStepCard 
              key={protocol.stepId} 
              protocol={protocol} 
              index={index} 
            />
          ))}
          
          {/* Ascension Legend */}
          <motion.div
            className="flex flex-wrap gap-2 pt-3 border-t"
            style={{ borderColor: 'hsl(0 0% 20%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {protocols.map(protocol => {
              const chakraData = chakraColorMap[protocol.chakra];
              return (
                <div 
                  key={protocol.chakra}
                  className="flex items-center gap-1.5 text-[9px] font-mono"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    color: 'hsl(0 0% 50%)',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ 
                      background: chakraData.hsl,
                      boxShadow: `0 0 4px ${chakraData.hsl}`,
                    }}
                  />
                  <span>{chakraData.name}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      ) : (
        // Standard Protocol Card
        <div className="space-y-4">
          {protocols.map((protocol, index) => (
            <ProtocolCard 
              key={protocol.stepId} 
              protocol={protocol} 
              index={index} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CulturalProtocols;
