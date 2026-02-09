import { motion } from 'framer-motion';
import { Hexagon, Leaf, Mountain, Zap, Droplets, Sun, Wind, Crown } from 'lucide-react';

/**
 * THE SEVEN PILLARS
 * The foundational wisdom pillars of AgroMajic
 * Spirit layer for the Ancestral Path
 */

interface PillarData {
  number: number;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  principle: string;
  practice: string;
}

const pillars: PillarData[] = [
  {
    number: 1,
    name: 'BIOLOGY',
    subtitle: 'The Fungal Spine',
    icon: Leaf,
    color: 'hsl(0 70% 50%)',
    principle: 'Do not break the mycelial network. The soil is alive.',
    practice: 'No-Till, Broadforking, Cover Crops, Trap Crops (The Bug Tax)',
  },
  {
    number: 2,
    name: 'GEOLOGY',
    subtitle: 'The Magnetic Earth',
    icon: Mountain,
    color: 'hsl(30 60% 45%)',
    principle: 'The stone is alive. Paramagnetism is the key.',
    practice: 'Basalt Rock Dust, Volcanic Minerals, Paramagnetic Compost',
  },
  {
    number: 3,
    name: 'PHYSICS',
    subtitle: 'The Thunder Signal',
    icon: Zap,
    color: 'hsl(35 100% 55%)',
    principle: 'The copper carries the signal. The fire transforms.',
    practice: 'Electroculture, Sonic Bloom, Earth Acupuncture, Agnihotra',
  },
  {
    number: 4,
    name: 'CHEMISTRY',
    subtitle: 'The Sweet Alchemy',
    icon: Droplets,
    color: 'hsl(51 100% 50%)',
    principle: 'Brix is the measure. Nutrient density is the goal.',
    practice: 'High Brix Growing, JADAM, Fermented Plant Juice, Foliar Feeding',
  },
  {
    number: 5,
    name: 'ASTRONOMY',
    subtitle: 'The Celestial Calendar',
    icon: Sun,
    color: 'hsl(195 80% 55%)',
    principle: 'Plant by the Moon. Harvest by the Stars.',
    practice: 'Biodynamic Calendar, Lunar Planting, Stellar Alignments',
  },
  {
    number: 6,
    name: 'ATMOSPHERIC',
    subtitle: 'The Breath of Life',
    icon: Wind,
    color: 'hsl(170 60% 50%)',
    principle: 'The atmosphere feeds the plant. CO2 is food.',
    practice: 'Atmospheric Nitrogen Fixation, Carbonic Acid, Ozone Applications',
  },
  {
    number: 7,
    name: 'SOVEREIGNTY',
    subtitle: 'The Eternal Seed',
    icon: Crown,
    color: 'hsl(0 0% 85%)',
    principle: 'The loop is not closed until the seed is saved.',
    practice: 'Seed Saving, Landrace Breeding, Epigenetic Imprinting',
  },
];

const SevenPillars = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Hexagon className="w-6 h-6" style={{ color: 'hsl(40 70% 60%)' }} />
          <h2
            className="text-2xl md:text-3xl tracking-[0.15em]"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(40 70% 60%)',
              textShadow: '0 0 30px hsl(40 60% 40% / 0.5)',
            }}
          >
            THE SEVEN PILLARS
          </h2>
          <Hexagon className="w-6 h-6" style={{ color: 'hsl(40 70% 60%)' }} />
        </div>
        <p
          className="text-sm font-mono"
          style={{ color: 'hsl(40 50% 55%)' }}
        >
          The Foundational Sciences of Vibrational Stewardship
        </p>
      </motion.div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.name}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'hsl(20 25% 10% / 0.9)',
                border: `1px solid ${pillar.color}40`,
                boxShadow: `0 0 20px ${pillar.color}10`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                borderColor: pillar.color,
                boxShadow: `0 0 30px ${pillar.color}25`,
              }}
            >
              {/* Header */}
              <div
                className="p-4 flex items-center gap-3"
                style={{
                  background: `linear-gradient(135deg, ${pillar.color}20, transparent)`,
                  borderBottom: `1px solid ${pillar.color}30`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${pillar.color}20`,
                    border: `2px solid ${pillar.color}`,
                  }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: pillar.color, filter: `drop-shadow(0 0 5px ${pillar.color})` }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{
                        background: `${pillar.color}30`,
                        color: pillar.color,
                      }}
                    >
                      PILLAR {pillar.number}
                    </span>
                  </div>
                  <h3
                    className="text-lg tracking-wider"
                    style={{
                      fontFamily: "'Staatliches', sans-serif",
                      color: pillar.color,
                    }}
                  >
                    {pillar.name}
                  </h3>
                  <p
                    className="text-xs font-mono"
                    style={{ color: 'hsl(0 0% 55%)' }}
                  >
                    {pillar.subtitle}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Principle */}
                <div>
                  <p
                    className="text-[10px] font-mono tracking-wider mb-1"
                    style={{ color: 'hsl(0 0% 50%)' }}
                  >
                    THE PRINCIPLE
                  </p>
                  <p
                    className="text-sm italic"
                    style={{
                      color: 'hsl(40 50% 70%)',
                      fontFamily: "'Staatliches', sans-serif",
                      letterSpacing: '0.02em',
                    }}
                  >
                    "{pillar.principle}"
                  </p>
                </div>

                {/* Practice */}
                <div>
                  <p
                    className="text-[10px] font-mono tracking-wider mb-1"
                    style={{ color: 'hsl(0 0% 50%)' }}
                  >
                    THE PRACTICE
                  </p>
                  <p
                    className="text-xs font-mono"
                    style={{ color: 'hsl(195 60% 60%)' }}
                  >
                    ⚗ {pillar.practice}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export { SevenPillars, pillars };
export type { PillarData };
