import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Beaker, Wrench, Heart, FlaskConical, ArrowRight, ChevronUp } from 'lucide-react';
import { AccessScale } from './ScaleToggle';
import ScaledProtocolSteps from './ScaledProtocolSteps';
import { getProtocolByLevel } from './scaleProtocolData';
import BodyCheckIn from './BodyCheckIn';
import { Button } from '@/components/ui/button';

interface ChapterContent {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  color: string;
  wisdom: {
    title: string;
    culture: string;
    narrative: string;
  };
  science: {
    principle: string;
    data: string[];
  };
  crop: {
    name: string;
    goal: string;
    keyFact: string;
  };
  somatic: {
    instruction: string;
    breath?: string;
    posture?: string;
  };
}

// The 5 Chapters aligned with the curriculum
const chapterData: ChapterContent[] = [
  {
    id: 'chapter-1',
    number: 1,
    title: 'THE ROOT',
    subtitle: 'Structure & Foundation',
    color: 'hsl(0 70% 45%)',
    wisdom: {
      title: 'The Muscogee Mounds',
      culture: 'Muscogee & Maroons — Stewardship & Survival',
      narrative: 'The Muscogee built mounds not to dominate the earth, but to work with it. These structures followed the natural contours of the land, creating microclimates and water management systems that sustained communities for millennia. The first lesson: the soil has memory. Every action you take echoes through generations.',
    },
    science: {
      principle: 'Soil Physics & Aeration',
      data: [
        'Don\'t invert the soil layers. Aerobic life lives on top (0-6"), anaerobic below (6"+).',
        'Mixing kills both communities. The broadfork cracks without flipping.',
        'Bamboo tensile strength: 28,000 PSI (stronger than steel per weight).',
        'Mycelium networks transfer nutrients up to 200 feet between plants.',
      ],
    },
    crop: {
      name: 'Bamboo',
      goal: 'Shelter',
      keyFact: 'Bamboo sequesters 35% more CO2 than equivalent trees. It\'s the fastest-growing plant on Earth (up to 35 inches/day).',
    },
    somatic: {
      instruction: 'Ground yourself before you touch the soil.',
      breath: 'Inhale 4 counts through nose. Hold 4 counts. Exhale 6 counts through mouth.',
      posture: 'Feel your feet on the earth. Imagine roots growing down from your soles.',
    },
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'THE FLOW',
    subtitle: 'Hydration & Mineralization',
    color: 'hsl(30 50% 40%)',
    wisdom: {
      title: 'Olmec Hydraulics',
      culture: 'Olmec (Xi) — The Mother Culture',
      narrative: 'The Olmec understood that water carries memory and minerals. Their sophisticated hydraulic systems moved water through volcanic stone channels, picking up paramagnetism along the way. The colossal heads they carved were not monuments of ego — they were markers of sacred water sources.',
    },
    science: {
      principle: 'Paramagnetism & Trace Minerals',
      data: [
        'Paramagnetism (CGS) measures soil\'s ability to attract atmospheric energy.',
        'Basalt rock dust contains 72 trace minerals essential for plant health.',
        'Target: 200+ CGS for optimal plant communication with atmosphere.',
        'Sea minerals contain the full periodic table in plant-available form.',
      ],
    },
    crop: {
      name: 'Sweet Potato',
      goal: 'Food',
      keyFact: 'Sweet potatoes are one of the most nutrient-dense foods on Earth. They\'re also nitrogen-fixers and soil-healers.',
    },
    somatic: {
      instruction: 'Water follows intention. Bless the water before you pour.',
      breath: 'Breathe like water — smooth, flowing, without breaks.',
      posture: 'Soften your spine. Let it ripple like a stream.',
    },
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'THE ENERGY',
    subtitle: 'Atmosphere & Signal',
    color: 'hsl(15 100% 50%)',
    wisdom: {
      title: 'Dogon Cosmology & The Antenna',
      culture: 'Dogon, Aboriginal, Chinese & Vedic',
      narrative: 'The Dogon knew about the Sirius binary star system thousands of years before Western telescopes. They understood that the Earth receives signals from the cosmos — and that copper spirals act as antennas. This is not mysticism. This is physics dressed in ceremony.',
    },
    science: {
      principle: 'Electroculture & Atmospheric Nitrogen',
      data: [
        'The atmosphere is 78% nitrogen — the most abundant nutrient.',
        'Plants can\'t access atmospheric nitrogen directly (except legumes via bacteria).',
        'Copper spirals in Fibonacci ratios (1.618) create resonance with atmospheric charge.',
        'Lightning strikes fix 250,000 tons of nitrogen annually. We mimic this on a micro-scale.',
      ],
    },
    crop: {
      name: 'Hemp',
      goal: 'Clothing',
      keyFact: 'Hemp fiber is 4x stronger than cotton, requires 50% less water, and needs no pesticides. It grows in 90 days.',
    },
    somatic: {
      instruction: 'Your spine is an antenna. Straighten it to receive.',
      breath: 'Quick inhales through the nose — like stoking a fire.',
      posture: 'Sit tall. Crown reaching to sky. Tailbone grounding to earth.',
    },
  },
  {
    id: 'chapter-4',
    number: 4,
    title: 'THE ALCHEMY',
    subtitle: 'Nutrition & Transformation',
    color: 'hsl(51 100% 50%)',
    wisdom: {
      title: 'Kemetic Chemistry',
      culture: 'Ancient Kemit — The Gold Masters',
      narrative: 'The word "Chemistry" comes from "Kemit" — the Black Land of the Nile. The Kemites understood that transformation happens through fermentation and fire. The turning of indigo from green to blue is the same redox chemistry that turns base metals into gold. As above, so below.',
    },
    science: {
      principle: 'Redox Potential & Brix',
      data: [
        'Brix measures sugar content in plant sap (degrees Brix).',
        'Above 12 Brix = natural pest resistance. Insects can\'t digest high-sugar plants.',
        'JADAM fermentation creates living microbe cultures for soil inoculation.',
        'Indigo dyeing is a redox reaction: reduction (green) → oxidation (blue).',
      ],
    },
    crop: {
      name: 'Indigo',
      goal: 'Adornment',
      keyFact: 'Indigo was more valuable than gold in ancient trade. It\'s also a nitrogen-fixer and medicine plant.',
    },
    somatic: {
      instruction: 'Fermentation is slow transformation. Slow your breath to match.',
      breath: 'Extended exhale. Longer than inhale. Let go completely.',
      posture: 'Hands on belly. Feel the furnace of digestion — your inner alchemy.',
    },
  },
  {
    id: 'chapter-5',
    number: 5,
    title: 'THE RETURN',
    subtitle: 'Sovereignty & Seed',
    color: 'hsl(0 0% 85%)',
    wisdom: {
      title: 'The Maroon Braid',
      culture: 'The Sovereign Return — Seed Keepers',
      narrative: 'When the Grandmothers were stolen from the coast of West Africa, they braided rice seeds into their hair. That act of defiance fed the Carolina colonies and created a new world. You do not own the harvest until you own the seed. The loop is not closed until the seed is saved.',
    },
    science: {
      principle: 'Epigenetics & Landrace Breeding',
      data: [
        'Open-pollinated seeds adapt to your specific microclimate over 3-7 generations.',
        'Hybrid seeds cannot be saved — they don\'t breed true.',
        'Epigenetic changes from stress become heritable in plants.',
        'Seed sovereignty = food sovereignty. He who controls the seed controls the nation.',
      ],
    },
    crop: {
      name: 'Rice (Carolina Gold)',
      goal: 'Legacy',
      keyFact: 'Carolina Gold rice was bred by enslaved Africans. It nearly went extinct. It\'s now being revived by seed savers.',
    },
    somatic: {
      instruction: 'You are now the Ancestor. What will you leave?',
      breath: 'Breathe for seven generations forward. And seven generations back.',
      posture: 'Stand tall. You carry the lineage in your spine.',
    },
  },
];

interface ChapterViewProps {
  chapterId: string;
  onClose: () => void;
  onEnterFieldLab: (chapterNumber: number) => void;
  searchQuery?: string;
  accessScale: AccessScale;
}

/**
 * CHAPTER VIEW - The Reading Mode
 * 
 * Structured content: Wisdom → Science → Protocol → Somatic → Field Notes
 * The accessScale is passed from the Almanac for dynamic content.
 */
const ChapterView = ({ chapterId, onClose, onEnterFieldLab, searchQuery = '', accessScale }: ChapterViewProps) => {
  const [isBodyTuned, setIsBodyTuned] = useState(false);

  const chapter = chapterData.find(c => c.id === chapterId);
  if (!chapter) return null;

  const scaledProtocolConfig = getProtocolByLevel(chapter.number);
  const scaledSteps = scaledProtocolConfig?.steps[accessScale] || [];

  // Highlight matching text
  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase()
        ? <mark key={i} className="bg-yellow-500/30 text-yellow-200 rounded px-0.5">{part}</mark>
        : part
    );
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Back to Table of Contents */}
      <motion.button
        className="flex items-center gap-2 text-sm font-mono"
        style={{ color: 'hsl(40 50% 60%)' }}
        onClick={onClose}
        whileHover={{ x: -5 }}
      >
        <ChevronUp className="w-4 h-4 rotate-[270deg]" />
        Back to Table of Contents
      </motion.button>

      {/* Chapter Header */}
      <motion.div
        className="text-center pb-6 border-b"
        style={{ borderColor: `${chapter.color}30` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="inline-block px-4 py-1 rounded-full text-xs font-mono tracking-widest mb-3"
          style={{
            background: `${chapter.color}20`,
            border: `1px solid ${chapter.color}`,
            color: chapter.color,
          }}
        >
          MODULE {chapter.number}
        </div>
        <h1
          className="text-3xl md:text-4xl tracking-[0.1em] mb-2"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            color: chapter.color,
            textShadow: `0 0 30px ${chapter.color}40`,
          }}
        >
          {chapter.title}
        </h1>
        <p
          className="font-mono text-sm"
          style={{ color: 'hsl(40 40% 60%)' }}
        >
          {chapter.subtitle}
        </p>
      </motion.div>

      {/* SECTION 1: THE WISDOM (Cultural History) */}
      <motion.section
        className="p-6 rounded-xl"
        style={{
          background: 'hsl(0 0% 6%)',
          border: `1px solid ${chapter.color}25`,
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: `${chapter.color}20`,
              border: `1px solid ${chapter.color}50`,
            }}
          >
            <BookOpen className="w-5 h-5" style={{ color: chapter.color }} />
          </div>
          <div>
            <h2
              className="text-xs font-mono tracking-[0.2em] uppercase"
              style={{ color: chapter.color }}
            >
              THE WISDOM
            </h2>
            <p className="text-sm" style={{ color: 'hsl(40 40% 60%)' }}>
              {highlightText(chapter.wisdom.title)}
            </p>
          </div>
        </div>
        <p
          className="text-xs font-mono tracking-wider mb-3"
          style={{ color: 'hsl(40 50% 50%)' }}
        >
          {highlightText(chapter.wisdom.culture)}
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'hsl(40 40% 75%)' }}
        >
          {highlightText(chapter.wisdom.narrative)}
        </p>
      </motion.section>

      {/* SECTION 2: THE SCIENCE (Hard Data) */}
      <motion.section
        className="p-6 rounded-xl"
        style={{
          background: 'hsl(195 30% 8%)',
          border: '1px solid hsl(195 40% 25%)',
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'hsl(195 40% 15%)',
              border: '1px solid hsl(195 50% 40%)',
            }}
          >
            <Beaker className="w-5 h-5" style={{ color: 'hsl(195 70% 60%)' }} />
          </div>
          <div>
            <h2
              className="text-xs font-mono tracking-[0.2em] uppercase"
              style={{ color: 'hsl(195 70% 60%)' }}
            >
              THE SCIENCE
            </h2>
            <p className="text-sm" style={{ color: 'hsl(195 40% 70%)' }}>
              {highlightText(chapter.science.principle)}
            </p>
          </div>
        </div>
        <ul className="space-y-2">
          {chapter.science.data.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm font-mono"
              style={{ color: 'hsl(195 30% 65%)' }}
            >
              <FlaskConical className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'hsl(195 50% 50%)' }} />
              <span>{highlightText(point)}</span>
            </li>
          ))}
        </ul>

        {/* Keystone Crop */}
        <div
          className="mt-4 p-3 rounded-lg"
          style={{
            background: `${chapter.color}10`,
            border: `1px solid ${chapter.color}30`,
          }}
        >
          <p className="text-xs font-mono tracking-wider mb-1" style={{ color: chapter.color }}>
            KEYSTONE CROP: {chapter.crop.name} ({chapter.crop.goal})
          </p>
          <p className="text-sm" style={{ color: 'hsl(40 40% 70%)' }}>
            {highlightText(chapter.crop.keyFact)}
          </p>
        </div>
      </motion.section>

      {/* SECTION 3: THE PROTOCOL (How-To) */}
      <motion.section
        className="p-6 rounded-xl"
        style={{
          background: 'hsl(140 20% 8%)',
          border: '1px solid hsl(140 30% 25%)',
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'hsl(140 30% 15%)',
              border: '1px solid hsl(140 40% 35%)',
            }}
          >
            <Wrench className="w-5 h-5" style={{ color: 'hsl(140 60% 55%)' }} />
          </div>
          <h2
            className="text-xs font-mono tracking-[0.2em] uppercase"
            style={{ color: 'hsl(140 60% 55%)' }}
          >
            THE PROTOCOL
          </h2>
        </div>

        {/* Scaled Protocol Steps */}
        {scaledProtocolConfig && scaledSteps.length > 0 && (
          <ScaledProtocolSteps
            color={chapter.color}
            steps={scaledSteps}
            scale={accessScale}
            science={scaledProtocolConfig.science}
          />
        )}
      </motion.section>

      {/* SECTION 4: THE SOMATIC CHECK (Body Tuning) */}
      <motion.section
        className="p-6 rounded-xl"
        style={{
          background: 'hsl(280 20% 8%)',
          border: '1px solid hsl(280 30% 25%)',
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'hsl(280 30% 15%)',
              border: '1px solid hsl(280 40% 40%)',
            }}
          >
            <Heart className="w-5 h-5" style={{ color: 'hsl(280 60% 65%)' }} />
          </div>
          <div>
            <h2
              className="text-xs font-mono tracking-[0.2em] uppercase"
              style={{ color: 'hsl(280 60% 65%)' }}
            >
              THE SOMATIC CHECK
            </h2>
            <p className="text-sm" style={{ color: 'hsl(280 40% 70%)' }}>
              Tune Your Body
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p
            className="text-lg italic"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(280 50% 75%)',
              letterSpacing: '0.02em',
            }}
          >
            "{chapter.somatic.instruction}"
          </p>

          {chapter.somatic.breath && (
            <div className="p-3 rounded-lg" style={{ background: 'hsl(280 20% 12%)' }}>
              <p className="text-xs font-mono tracking-wider mb-1" style={{ color: 'hsl(280 50% 60%)' }}>
                BREATH
              </p>
              <p className="text-sm" style={{ color: 'hsl(280 30% 70%)' }}>
                {chapter.somatic.breath}
              </p>
            </div>
          )}

          {chapter.somatic.posture && (
            <div className="p-3 rounded-lg" style={{ background: 'hsl(280 20% 12%)' }}>
              <p className="text-xs font-mono tracking-wider mb-1" style={{ color: 'hsl(280 50% 60%)' }}>
                POSTURE
              </p>
              <p className="text-sm" style={{ color: 'hsl(280 30% 70%)' }}>
                {chapter.somatic.posture}
              </p>
            </div>
          )}

          {/* Body Check-In Component */}
          <BodyCheckIn
            level={chapter.number}
            color={chapter.color}
            onTuned={() => setIsBodyTuned(true)}
            isTuned={isBodyTuned}
          />
        </div>
      </motion.section>

      {/* SECTION 5: OPEN FIELD NOTES (Game Layer) */}
      <motion.section
        className="p-6 rounded-xl text-center"
        style={{
          background: `linear-gradient(135deg, ${chapter.color}15, hsl(0 0% 6%))`,
          border: `2px solid ${chapter.color}40`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-mono tracking-widest mb-4"
          style={{
            background: 'hsl(0 0% 10%)',
            border: '1px dashed hsl(0 0% 30%)',
            color: 'hsl(0 0% 60%)',
          }}
        >
          FIELD NOTES
        </div>

        <h3
          className="text-xl mb-2"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            color: chapter.color,
          }}
        >
          Ready to Record Your Observation?
        </h3>

        <p
          className="text-sm font-mono mb-6"
          style={{ color: 'hsl(40 40% 60%)' }}
        >
          You have read the Almanac. Now log your work and earn your credentials.
        </p>

        <Button
          className="font-mono text-sm tracking-wider"
          style={{
            background: `linear-gradient(135deg, ${chapter.color}, ${chapter.color}cc)`,
            color: 'hsl(0 0% 5%)',
            border: 'none',
            boxShadow: `0 0 30px ${chapter.color}40`,
          }}
          onClick={() => onEnterFieldLab(chapter.number)}
        >
          OPEN FIELD NOTES
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <p
          className="text-xs font-mono mt-4 opacity-50"
          style={{ color: 'hsl(40 40% 50%)' }}
        >
          Upload your field evidence • Earn the Orisha blessing
        </p>
      </motion.section>
    </motion.div>
  );
};

export { chapterData };
export default ChapterView;
