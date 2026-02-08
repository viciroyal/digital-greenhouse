import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, BookOpen, Leaf, Mountain, Zap, Droplet, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

interface GrimoireChapter {
  id: string;
  number: number;
  title: string;
  topic: string;
  science: string;
  crop: string;
  cropGoal: string;
  color: string;
  icon: typeof Leaf;
  protocols: {
    name: string;
    description: string;
    steps: string[];
  }[];
  recipes?: {
    name: string;
    ingredients: string[];
  }[];
}

// The Grimoire chapters - aligned with the curriculum
const chapters: GrimoireChapter[] = [
  {
    id: 'chapter-1',
    number: 1,
    title: 'THE FOUNDATION',
    topic: 'Muscogee Mound Building & The Broadfork',
    science: 'Soil Physics & Aeration — Don\'t invert the layers. Aerobic life lives on top, anaerobic below.',
    crop: 'Bamboo',
    cropGoal: 'Shelter',
    color: 'hsl(0 70% 45%)',
    icon: Mountain,
    protocols: [
      {
        name: 'No-Till Broadforking',
        description: 'Break compaction without destroying the fungal network.',
        steps: [
          'Assess soil compaction at 3 depths using penetrometer or fork test',
          'Insert broadfork vertically, step on crossbar to drive tines deep',
          'Hinge backwards to crack hardpan — DO NOT flip the soil',
          'Move back 12 inches and repeat across the bed',
        ],
      },
      {
        name: 'Bio-Drill Planting (Daikon)',
        description: 'Use radish roots to break compaction naturally.',
        steps: [
          'Broadcast Daikon radish seed in fall at 10 lbs/acre',
          'Allow to grow through winter — roots drill 18+ inches deep',
          'Let winter-kill leave roots to rot in place',
          'Spring planting goes directly into the channels created',
        ],
      },
    ],
    recipes: [
      {
        name: 'Kelp Root Drench',
        ingredients: ['Kelp meal (1 cup)', 'Water (5 gallons)', 'Molasses (1 tbsp)'],
      },
    ],
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'THE FLOW',
    topic: 'Olmec Hydraulics & Paramagnetism',
    science: 'Mineralization & Rock Dust — Paramagnetism measures the soil\'s ability to attract atmospheric energy. Basalt adds 72 trace minerals.',
    crop: 'Sweet Potato',
    cropGoal: 'Food',
    color: 'hsl(30 50% 40%)',
    icon: Droplet,
    protocols: [
      {
        name: 'Paramagnetic Rock Dust Application',
        description: 'Remineralize with volcanic basalt for trace elements.',
        steps: [
          'Measure baseline with PCSM meter (target: 200+ CGS)',
          'Source volcanic basalt or Azomite from quarry/garden center',
          'Apply at 200-400 lbs/acre or 1 lb per 10 sq ft for beds',
          'Water in immediately to activate microbial bridging',
          'Retest paramagnetism at 30-day intervals',
        ],
      },
      {
        name: 'Sea Mineral Foliar',
        description: 'Ocean minerals contain the full periodic table.',
        steps: [
          'Dilute sea mineral concentrate per label (usually 1:100)',
          'Apply as foliar spray at dawn or dusk',
          'Repeat every 2 weeks during active growth',
        ],
      },
    ],
    recipes: [
      {
        name: 'Master Soil Mix',
        ingredients: ['Basalt rock dust (50 lbs)', 'Kelp meal (10 lbs)', 'Biochar (20 lbs)', 'Compost (cubic yard)'],
      },
    ],
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'THE ENERGY',
    topic: 'Dogon Cosmology & The Antenna',
    science: 'Electroculture & Atmospheric Nitrogen — Copper spirals collect atmospheric charge. The Fibonacci ratio (1.618) maximizes resonance.',
    crop: 'Hemp',
    cropGoal: 'Clothing',
    color: 'hsl(15 100% 50%)',
    icon: Zap,
    protocols: [
      {
        name: 'Electroculture Antenna',
        description: 'Build a Fibonacci spiral to collect atmospheric energy.',
        steps: [
          'Acquire 12-gauge copper wire and 6ft wooden dowel',
          'Wind wire in Fibonacci spiral (8-13-21 wraps) around dowel',
          'Point antenna to magnetic north',
          'Ground with 3ft copper rod driven into moist soil',
          'Connect ground wire from antenna base to grounding rod',
        ],
      },
      {
        name: 'Agnihotra (Vedic Fire Ritual)',
        description: 'Sunrise/sunset fire ceremony to purify the atmosphere.',
        steps: [
          'Prepare copper pyramid, dried cow dung, ghee, and rice',
          'At exact sunrise/sunset, light the fire in pyramid',
          'Chant the appropriate mantra at the precise moment',
          'Allow ash to cool — spread on soil as paramagnetic booster',
        ],
      },
      {
        name: 'Earth Acupuncture',
        description: 'Chinese geomancy applied to land healing.',
        steps: [
          'Identify ley lines and energy blockages on the land',
          'Insert copper or iron rods at strategic points',
          'Observe plant response in surrounding area',
        ],
      },
    ],
  },
  {
    id: 'chapter-4',
    number: 4,
    title: 'THE ALCHEMY',
    topic: 'Kemetic Chemistry & Fermentation',
    science: 'Redox Potential & Brix — Brix measures sugar content. Above 12 Brix = pest resistance. JADAM creates living biology.',
    crop: 'Indigo',
    cropGoal: 'Adornment',
    color: 'hsl(51 100% 50%)',
    icon: Leaf,
    protocols: [
      {
        name: 'Brix Testing Protocol',
        description: 'Measure plant health through sugar content.',
        steps: [
          'Collect leaf sample early morning from consistent plant',
          'Crush leaf to extract sap onto refractometer',
          'Close daylight plate and read Brix scale',
          'Record: Below 6 = poor, 8-10 = average, 12+ = excellent',
        ],
      },
      {
        name: 'JADAM Liquid Fertilizer (JLF)',
        description: 'Korean fermentation for biological soil activation.',
        steps: [
          'Fill 50-gallon barrel with water',
          'Add 2 lbs leaf mold from healthy forest floor',
          'Stir daily, ferment 7 days until bubbling stops',
          'Dilute 1:30 and apply as foliar at dawn',
        ],
      },
      {
        name: 'Indigo Vat (Redox Chemistry)',
        description: 'The reduction-oxidation reaction that creates true blue.',
        steps: [
          'Harvest Indigofera leaves at peak indican content',
          'Ferment in high-pH alkaline vat (target pH 9-10)',
          'Reduction removes oxygen — liquid turns yellow-green',
          'Dip fabric, expose to air — oxidation turns it blue',
          'Monitor the "flower" (coppery scum) as health indicator',
        ],
      },
    ],
    recipes: [
      {
        name: 'JADAM Sulfur',
        ingredients: ['Sulfur powder (1 lb)', 'Lye (1/2 cup)', 'Water (5 gallons)'],
      },
    ],
  },
  {
    id: 'chapter-5',
    number: 5,
    title: 'THE SOVEREIGNTY',
    topic: 'The Maroon Braid & Seed Keeping',
    science: 'Epigenetics & Landrace Breeding — Open-pollinated seeds adapt to your microclimate over generations. Seed sovereignty = food sovereignty.',
    crop: 'Rice (Carolina Gold)',
    cropGoal: 'Legacy',
    color: 'hsl(0 0% 85%)',
    icon: Leaf,
    protocols: [
      {
        name: 'Mother Plant Selection',
        description: 'Choose the genetics that will feed future generations.',
        steps: [
          'Mark the healthiest 10% of your crop with flagging tape',
          'DO NOT harvest from these plants',
          'Allow full maturation — seeds ripen on the stalk',
          'Observe resistance to pests, vigor, and fruit quality',
        ],
      },
      {
        name: 'Seed Processing & Storage',
        description: 'Preserve viability for years or decades.',
        steps: [
          'Thresh seeds from dried plant material',
          'Winnow to remove chaff (use wind or fan)',
          'Dry in shade for 14 days (below 50% humidity)',
          'Store in glass jars with silica gel desiccant',
          'Label with variety name, date, and source lineage',
          'Store cool (50°F) and dark — refrigerator works well',
        ],
      },
    ],
  },
];

interface GrimoireViewProps {
  onSelectChapter?: (chapterId: string) => void;
}

/**
 * THE GRIMOIRE - Textbook Mode
 * 
 * A searchable, linear view of all curriculum content.
 * Read-only mode — uploads are hidden.
 */
const GrimoireView = ({ onSelectChapter }: GrimoireViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openChapters, setOpenChapters] = useState<string[]>(['chapter-1']);

  // Filter chapters and content based on search
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;
    
    const query = searchQuery.toLowerCase();
    return chapters.filter(chapter => {
      const matchesTitle = chapter.title.toLowerCase().includes(query);
      const matchesTopic = chapter.topic.toLowerCase().includes(query);
      const matchesScience = chapter.science.toLowerCase().includes(query);
      const matchesCrop = chapter.crop.toLowerCase().includes(query);
      const matchesProtocols = chapter.protocols.some(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.steps.some(s => s.toLowerCase().includes(query))
      );
      const matchesRecipes = chapter.recipes?.some(r =>
        r.name.toLowerCase().includes(query) ||
        r.ingredients.some(i => i.toLowerCase().includes(query))
      );
      
      return matchesTitle || matchesTopic || matchesScience || matchesCrop || matchesProtocols || matchesRecipes;
    });
  }, [searchQuery]);

  // Highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-yellow-500/30 text-yellow-200 rounded px-0.5">{part}</mark>
        : part
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 
          className="text-3xl md:text-4xl mb-2 tracking-[0.15em]"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            color: 'hsl(280 60% 70%)',
            textShadow: '0 0 30px hsl(280 60% 50% / 0.4)',
          }}
        >
          THE GRIMOIRE
        </h1>
        <p 
          className="font-mono text-sm"
          style={{ color: 'hsl(40 40% 60%)' }}
        >
          The Complete Pharmacological Manuscript
        </p>
      </motion.div>

      {/* Study Mode Notice */}
      <motion.div
        className="mb-6 p-4 rounded-xl text-center"
        style={{
          background: 'linear-gradient(135deg, hsl(280 30% 15%), hsl(260 25% 12%))',
          border: '1px dashed hsl(280 50% 40%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <BookOpen className="w-5 h-5 mx-auto mb-2" style={{ color: 'hsl(280 60% 65%)' }} />
        <p 
          className="text-sm font-mono"
          style={{ color: 'hsl(280 50% 70%)' }}
        >
          You are in <strong>Study Mode</strong>. Switch to <strong>The Path</strong> to log your work.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Search 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: 'hsl(40 40% 50%)' }}
        />
        <Input
          type="text"
          placeholder="Search: Nitrogen, Bamboo, Oshun, Brix..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-10 py-6 font-mono text-sm rounded-xl"
          style={{
            background: 'hsl(0 0% 8%)',
            border: '1px solid hsl(40 30% 25%)',
            color: 'hsl(40 60% 80%)',
          }}
        />
        {searchQuery && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
            onClick={() => setSearchQuery('')}
          >
            <X className="w-4 h-4" style={{ color: 'hsl(0 50% 60%)' }} />
          </button>
        )}
      </motion.div>

      {/* Search Results Count */}
      {searchQuery && (
        <motion.p
          className="text-sm font-mono mb-4"
          style={{ color: 'hsl(40 40% 50%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredChapters.length} chapter{filteredChapters.length !== 1 ? 's' : ''} match "{searchQuery}"
        </motion.p>
      )}

      {/* Chapters Accordion */}
      <Accordion
        type="multiple"
        value={openChapters}
        onValueChange={setOpenChapters}
        className="space-y-4"
      >
        {filteredChapters.map((chapter, index) => {
          const Icon = chapter.icon;
          
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <AccordionItem
                value={chapter.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'hsl(0 0% 6%)',
                  border: `1px solid ${chapter.color}40`,
                }}
              >
                <AccordionTrigger
                  className="px-6 py-4 hover:no-underline group"
                  style={{ background: `linear-gradient(135deg, ${chapter.color}10, transparent)` }}
                >
                  <div className="flex items-center gap-4 text-left">
                    {/* Chapter Number */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-lg font-bold flex-shrink-0"
                      style={{
                        background: `${chapter.color}25`,
                        border: `2px solid ${chapter.color}`,
                        color: chapter.color,
                      }}
                    >
                      {chapter.number}
                    </div>
                    
                    <div>
                      <h3 
                        className="text-lg tracking-wider mb-1"
                        style={{ 
                          fontFamily: "'Staatliches', sans-serif",
                          color: chapter.color,
                        }}
                      >
                        {highlightText(`Chapter ${chapter.number}: ${chapter.title}`, searchQuery)}
                      </h3>
                      <p 
                        className="text-sm font-mono"
                        style={{ color: 'hsl(40 40% 60%)' }}
                      >
                        {highlightText(chapter.topic, searchQuery)}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 pt-4">
                    {/* Science Section */}
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        background: 'hsl(0 0% 10%)',
                        borderLeft: `3px solid ${chapter.color}`,
                      }}
                    >
                      <h4 
                        className="text-xs font-mono tracking-[0.2em] uppercase mb-2"
                        style={{ color: chapter.color }}
                      >
                        THE SCIENCE
                      </h4>
                      <p 
                        className="text-sm leading-relaxed"
                        style={{ color: 'hsl(40 50% 75%)' }}
                      >
                        {highlightText(chapter.science, searchQuery)}
                      </p>
                    </div>

                    {/* Keystone Crop */}
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" style={{ color: chapter.color }} />
                      <span 
                        className="text-sm font-mono"
                        style={{ color: 'hsl(40 40% 60%)' }}
                      >
                        <strong style={{ color: chapter.color }}>Keystone Crop:</strong>{' '}
                        {highlightText(chapter.crop, searchQuery)} ({chapter.cropGoal})
                      </span>
                    </div>

                    {/* Protocols */}
                    <div className="space-y-4">
                      <h4 
                        className="text-xs font-mono tracking-[0.2em] uppercase"
                        style={{ color: 'hsl(40 50% 60%)' }}
                      >
                        PROTOCOLS
                      </h4>
                      
                      {chapter.protocols.map((protocol, pIndex) => (
                        <div
                          key={pIndex}
                          className="p-4 rounded-lg"
                          style={{
                            background: 'hsl(0 0% 8%)',
                            border: '1px solid hsl(0 0% 20%)',
                          }}
                        >
                          <h5 
                            className="font-mono font-bold mb-1"
                            style={{ color: 'hsl(0 0% 85%)' }}
                          >
                            {highlightText(protocol.name, searchQuery)}
                          </h5>
                          <p 
                            className="text-sm mb-3"
                            style={{ color: 'hsl(40 40% 55%)' }}
                          >
                            {highlightText(protocol.description, searchQuery)}
                          </p>
                          <ol className="space-y-2 list-decimal list-inside">
                            {protocol.steps.map((step, sIndex) => (
                              <li
                                key={sIndex}
                                className="text-sm font-mono"
                                style={{ color: 'hsl(40 30% 65%)' }}
                              >
                                {highlightText(step, searchQuery)}
                              </li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>

                    {/* Recipes */}
                    {chapter.recipes && chapter.recipes.length > 0 && (
                      <div className="space-y-3">
                        <h4 
                          className="text-xs font-mono tracking-[0.2em] uppercase"
                          style={{ color: 'hsl(140 50% 50%)' }}
                        >
                          RECIPES
                        </h4>
                        
                        {chapter.recipes.map((recipe, rIndex) => (
                          <div
                            key={rIndex}
                            className="p-3 rounded-lg"
                            style={{
                              background: 'hsl(140 20% 10%)',
                              border: '1px solid hsl(140 30% 25%)',
                            }}
                          >
                            <h5 
                              className="font-mono text-sm font-bold mb-2"
                              style={{ color: 'hsl(140 50% 60%)' }}
                            >
                              {highlightText(recipe.name, searchQuery)}
                            </h5>
                            <ul className="list-disc list-inside">
                              {recipe.ingredients.map((ing, iIndex) => (
                                <li
                                  key={iIndex}
                                  className="text-xs font-mono"
                                  style={{ color: 'hsl(140 40% 55%)' }}
                                >
                                  {highlightText(ing, searchQuery)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          );
        })}
      </Accordion>

      {/* Empty State */}
      {filteredChapters.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'hsl(40 40% 50%)' }} />
          <p 
            className="font-mono"
            style={{ color: 'hsl(40 40% 50%)' }}
          >
            No chapters match "{searchQuery}"
          </p>
          <button
            className="mt-4 text-sm font-mono underline"
            style={{ color: 'hsl(280 50% 60%)' }}
            onClick={() => setSearchQuery('')}
          >
            Clear search
          </button>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div
        className="mt-12 text-center py-8 border-t"
        style={{ borderColor: 'hsl(0 0% 20%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p 
          className="text-xs font-mono"
          style={{ color: 'hsl(40 30% 40%)' }}
        >
          THE GRIMOIRE • A Living Document of Ancestral Agriculture
        </p>
      </motion.div>
    </div>
  );
};

export default GrimoireView;
