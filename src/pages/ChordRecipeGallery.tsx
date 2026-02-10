import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CHORD_RECIPES, ChordRecipe } from '@/data/chordRecipes';
import ChordRecipeCard from '@/components/conductor/ChordRecipeCard';

const ChordRecipeGallery = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<ChordRecipe | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'hsl(0 0% 3%)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'hsl(0 0% 3% / 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid hsl(0 0% 10%)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 15%)' }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: 'hsl(0 0% 50%)' }} />
        </button>
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5" style={{ color: 'hsl(45 80% 55%)' }} />
          <h1 className="text-sm font-mono font-bold tracking-wider" style={{ color: 'hsl(45 80% 55%)' }}>
            JAZZ 13TH CHORD RECIPES
          </h1>
        </div>
      </div>

      {/* Subtitle */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
          7 curated polyculture templates — one per frequency zone. Each chord voices 7 ecological intervals 
          from Root canopy to aerial vine. Select a chord to apply as a planting template.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="px-4 pb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CHORD_RECIPES.map((recipe, i) => (
          <motion.div
            key={recipe.frequencyHz}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <ChordRecipeCard
              recipe={recipe}
              isSelected={selectedRecipe?.frequencyHz === recipe.frequencyHz}
              onSelect={(r) =>
                setSelectedRecipe(
                  selectedRecipe?.frequencyHz === r.frequencyHz ? null : r
                )
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Selected Recipe Detail Bar */}
      {selectedRecipe && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 flex items-center justify-between"
          style={{
            background: 'hsl(0 0% 5% / 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: `2px solid ${selectedRecipe.zoneColor}60`,
            boxShadow: `0 -4px 30px ${selectedRecipe.zoneColor}20`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: selectedRecipe.zoneColor, boxShadow: `0 0 8px ${selectedRecipe.zoneColor}` }}
            />
            <span className="text-sm font-mono font-bold" style={{ color: selectedRecipe.zoneColor }}>
              {selectedRecipe.chordName}
            </span>
            <span className="text-xs font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
              {selectedRecipe.intervals.length} voices ready
            </span>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold"
            style={{
              background: `${selectedRecipe.zoneColor}20`,
              border: `1px solid ${selectedRecipe.zoneColor}60`,
              color: selectedRecipe.zoneColor,
            }}
            onClick={() => {
              // Future: apply template to a bed
              navigate('/conductor');
            }}
          >
            APPLY TO BED →
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ChordRecipeGallery;
