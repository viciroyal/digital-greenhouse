import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, BookOpen, Leaf, Mountain, Zap, Droplet, Crown, X, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ChapterView, { chapterData } from './ChapterView';
import ScaleToggle, { AccessScale } from './ScaleToggle';

interface SyllabusChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  culture: string;
  crop: string;
  cropGoal: string;
  color: string;
  icon: typeof Leaf;
}

// The Living Almanac - Table of Contents (Roman Numerals)
const syllabusData: SyllabusChapter[] = [
  {
    id: 'intro',
    number: '◆',
    title: 'THE PHILOSOPHY',
    subtitle: 'Listen When The Soil Whispers',
    culture: 'The Soil Has a Memory',
    crop: '',
    cropGoal: '',
    color: 'hsl(40 50% 50%)',
    icon: BookOpen,
  },
  {
    id: 'chapter-1',
    number: 'I',
    title: 'THE FOUNDATION',
    subtitle: 'Shelter / Root',
    culture: 'Muscogee Science',
    crop: 'Bamboo',
    cropGoal: 'Shelter',
    color: 'hsl(0 70% 45%)',
    icon: Mountain,
  },
  {
    id: 'chapter-2',
    number: 'II',
    title: 'THE FLOW',
    subtitle: 'Food / Water',
    culture: 'Olmec Science',
    crop: 'Sweet Potato',
    cropGoal: 'Food',
    color: 'hsl(30 50% 40%)',
    icon: Droplet,
  },
  {
    id: 'chapter-3',
    number: 'III',
    title: 'THE SIGNAL',
    subtitle: 'Clothing / Atmosphere',
    culture: 'Dogon Science',
    crop: 'Hemp',
    cropGoal: 'Clothing',
    color: 'hsl(15 100% 50%)',
    icon: Zap,
  },
  {
    id: 'chapter-4',
    number: 'IV',
    title: 'THE ALCHEMY',
    subtitle: 'Nutrition / Gold',
    culture: 'Kemetic Science',
    crop: 'Indigo',
    cropGoal: 'Adornment',
    color: 'hsl(51 100% 50%)',
    icon: Crown,
  },
  {
    id: 'chapter-5',
    number: 'V',
    title: 'THE RETURN',
    subtitle: 'Sovereignty / Seed',
    culture: 'Maroon Science',
    crop: 'Rice (Carolina Gold)',
    cropGoal: 'Legacy',
    color: 'hsl(0 0% 85%)',
    icon: Sparkles,
  },
];

interface GrimoireViewProps {
  onEnterFieldLab?: (moduleLevel: number) => void;
}

/**
 * THE LIVING ALMANAC (2026 Edition)
 * 
 * A dynamic, interactive reference book for Sovereign Living.
 * The Almanac "reads" the user via the Scale Toggle.
 */
const GrimoireView = ({ onEnterFieldLab }: GrimoireViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [accessScale, setAccessScale] = useState<AccessScale>('sprout');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  // Filter syllabus based on search
  const filteredSyllabus = useMemo(() => {
    if (!searchQuery.trim()) return syllabusData;

    const query = searchQuery.toLowerCase();
    return syllabusData.filter(chapter => {
      const matchesTitle = chapter.title.toLowerCase().includes(query);
      const matchesSubtitle = chapter.subtitle.toLowerCase().includes(query);
      const matchesCulture = chapter.culture.toLowerCase().includes(query);
      const matchesCrop = chapter.crop.toLowerCase().includes(query);

      // Also search in chapter content
      const chapterContent = chapterData.find(c => c.id === chapter.id);
      const matchesWisdom = chapterContent?.wisdom.narrative.toLowerCase().includes(query);
      const matchesScience = chapterContent?.science.data.some(d => d.toLowerCase().includes(query));

      return matchesTitle || matchesSubtitle || matchesCulture || matchesCrop || matchesWisdom || matchesScience;
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

  const handleEnterFieldLab = (moduleLevel: number) => {
    if (onEnterFieldLab) {
      onEnterFieldLab(moduleLevel);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8">
      {/* Conditional: Chapter View or Table of Contents */}
      <AnimatePresence mode="wait">
        {selectedChapter ? (
          <motion.div
            key="chapter-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ChapterView
              chapterId={selectedChapter}
              onClose={() => setSelectedChapter(null)}
              onEnterFieldLab={handleEnterFieldLab}
              searchQuery={searchQuery}
              accessScale={accessScale}
            />
          </motion.div>
        ) : (
          <motion.div
            key="syllabus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                style={{
                  background: 'hsl(40 30% 12%)',
                  border: '1px solid hsl(40 50% 35%)',
                }}
              >
                <BookOpen className="w-4 h-4" style={{ color: 'hsl(40 60% 60%)' }} />
                <span
                  className="text-xs font-mono tracking-widest"
                  style={{ color: 'hsl(40 50% 65%)' }}
                >
                  2026 EDITION
                </span>
              </div>

              <h1
                className="text-3xl md:text-4xl mb-2 tracking-[0.15em]"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(40 70% 65%)',
                  textShadow: '0 0 30px hsl(40 60% 40% / 0.4)',
                }}
              >
                THE LIVING ALMANAC
              </h1>
              <p
                className="font-mono text-sm italic"
                style={{ color: 'hsl(40 40% 55%)' }}
              >
                "Listen when the soil whispers. Act when the stars signal."
              </p>
            </motion.div>

            {/* Global Scale Toggle (The "Living" Dynamic) */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <ScaleToggle
                value={accessScale}
                onChange={setAccessScale}
                color="hsl(40 60% 55%)"
              />
            </motion.div>

            {/* Study Mode Notice */}
            <motion.div
              className="mb-6 p-4 rounded-xl text-center"
              style={{
                background: 'linear-gradient(135deg, hsl(40 25% 10%), hsl(35 20% 8%))',
                border: '1px dashed hsl(40 40% 25%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p
                className="text-sm font-mono"
                style={{ color: 'hsl(40 40% 60%)' }}
              >
                All content is unlocked for study. Switch to <strong>The Path</strong> to record your fieldwork.
              </p>
            </motion.div>

            {/* ASK THE ALMANAC - Search Bar */}
            <motion.div
              className="relative mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4" style={{ color: 'hsl(40 50% 50%)' }} />
                <span 
                  className="text-xs font-mono tracking-[0.15em] uppercase"
                  style={{ color: 'hsl(40 50% 50%)' }}
                >
                  Ask the Almanac
                </span>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Brix, Indigo, Nitrogen, Panic Attack, Bamboo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-5 font-mono text-sm rounded-xl w-full"
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
              </div>
            </motion.div>

            {/* Search Results Count */}
            {searchQuery && (
              <motion.p
                className="text-sm font-mono mb-4"
                style={{ color: 'hsl(40 40% 50%)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredSyllabus.length} result{filteredSyllabus.length !== 1 ? 's' : ''} for "{searchQuery}"
              </motion.p>
            )}

            {/* TABLE OF CONTENTS */}
            <div className="space-y-3">
              {filteredSyllabus.map((chapter, index) => {
                const Icon = chapter.icon;
                const isIntro = chapter.id === 'intro';

                return (
                  <motion.button
                    key={chapter.id}
                    className="w-full p-4 md:p-5 rounded-xl text-left transition-all group"
                    style={{
                      background: isIntro
                        ? 'linear-gradient(135deg, hsl(40 30% 12%), hsl(40 20% 8%))'
                        : `linear-gradient(135deg, ${chapter.color}08, hsl(0 0% 6%))`,
                      border: `1px solid ${chapter.color}30`,
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{
                      scale: 1.01,
                      boxShadow: `0 0 25px ${chapter.color}20`,
                      borderColor: `${chapter.color}60`,
                    }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => !isIntro && setSelectedChapter(chapter.id)}
                    disabled={isIntro}
                  >
                    <div className="flex items-center gap-4">
                      {/* Chapter Number / Icon */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${chapter.color}20`,
                          border: `2px solid ${chapter.color}60`,
                        }}
                      >
                        {isIntro ? (
                          <Icon className="w-5 h-5" style={{ color: chapter.color }} />
                        ) : (
                          <span
                            className="text-lg font-bold"
                            style={{
                              fontFamily: "'Staatliches', sans-serif",
                              color: chapter.color,
                            }}
                          >
                            {chapter.number}
                          </span>
                        )}
                      </div>

                      {/* Chapter Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-lg tracking-wider mb-0.5"
                          style={{
                            fontFamily: "'Staatliches', sans-serif",
                            color: chapter.color,
                          }}
                        >
                          {highlightText(chapter.title, searchQuery)}
                        </h3>
                        <p
                          className="text-sm font-mono truncate"
                          style={{ color: 'hsl(40 40% 60%)' }}
                        >
                          {highlightText(chapter.culture, searchQuery)}
                        </p>

                        {/* Crop tag (if exists) */}
                        {chapter.crop && (
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono"
                              style={{
                                background: `${chapter.color}15`,
                                border: `1px solid ${chapter.color}40`,
                                color: chapter.color,
                              }}
                            >
                              <Leaf className="w-3 h-3" />
                              {highlightText(chapter.crop, searchQuery)}
                            </span>
                            <span
                              className="text-[10px] font-mono"
                              style={{ color: 'hsl(40 30% 50%)' }}
                            >
                              {chapter.cropGoal}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      {!isIntro && (
                        <ChevronRight
                          className="w-5 h-5 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"
                          style={{ color: chapter.color }}
                        />
                      )}
                    </div>

                    {/* Intro special content */}
                    {isIntro && (
                      <div
                        className="mt-4 pt-4 text-sm leading-relaxed"
                        style={{
                          borderTop: '1px dashed hsl(40 30% 25%)',
                          color: 'hsl(40 40% 70%)',
                        }}
                      >
                        <p className="italic">
                          "The soil has a memory. Every action you take echoes through seven generations.
                          This is not just agriculture — it is a return to the wisdom that fed nations
                          before the forgetting."
                        </p>
                        <p
                          className="mt-3 text-xs font-mono"
                          style={{ color: 'hsl(40 30% 50%)' }}
                        >
                          ◆ 5 Modules • Wisdom → Science → Protocol → Field Lab
                        </p>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredSyllabus.length === 0 && (
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
              style={{ borderColor: 'hsl(40 30% 20%)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p
                className="text-xs font-mono"
                style={{ color: 'hsl(40 30% 45%)' }}
              >
                THE LIVING ALMANAC • 2026 Edition • A Reference Guide for Sovereign Living
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GrimoireView;
