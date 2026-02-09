import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Eye, Settings } from 'lucide-react';
import { useGardenBeds } from '@/hooks/useGardenBeds';
import { useAdminRole } from '@/hooks/useAdminRole';
import ChromaticWheel from '@/components/piano-almanac/ChromaticWheel';
import UnifiedAlmanacCard from '@/components/piano-almanac/UnifiedAlmanacCard';
import { SovereigntyFooter } from '@/components/almanac';
import { ChromaticTone } from '@/data/chromaticToneMapping';

/**
 * AGROMAJIC PIANO ALMANAC
 * 12-Tone Chromatic Interface for garden bed management
 * Unified Field Almanac with Chord-Pair Database
 */

const PianoAlmanac = () => {
  const navigate = useNavigate();
  const [selectedTone, setSelectedTone] = useState<ChromaticTone | null>(null);
  const [brixValue, setBrixValue] = useState(12);
  
  const { data: beds = [], isLoading: bedsLoading } = useGardenBeds();
  const { isAdmin, loading: adminLoading } = useAdminRole();

  const handleSelectTone = (tone: ChromaticTone) => {
    setSelectedTone(tone);
  };

  const handleCloseToneDetail = () => {
    setSelectedTone(null);
  };

  const isLoading = bedsLoading || adminLoading;

  return (
    <main 
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: 'linear-gradient(180deg, hsl(220 20% 8%), hsl(220 25% 5%))' }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'linear-gradient(180deg, hsl(220 20% 12%), hsl(220 20% 8%))',
          borderBottom: '1px solid hsl(220 20% 20%)',
        }}
      >
        <motion.button
          className="flex items-center gap-2 px-3 py-2 rounded-full"
          style={{ background: 'hsl(220 20% 18%)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/ancestral-path')}
        >
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </motion.button>

        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-400" />
          <h1 className="text-lg font-bold text-white tracking-tight">
            Chromatic Almanac
          </h1>
        </div>

        {/* Admin/Member Badge */}
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
          style={{
            background: isAdmin ? 'hsl(45 80% 20%)' : 'hsl(210 60% 20%)',
            color: isAdmin ? 'hsl(45 80% 70%)' : 'hsl(210 60% 70%)',
            border: `1px solid ${isAdmin ? 'hsl(45 60% 40%)' : 'hsl(210 40% 40%)'}`,
          }}
        >
          {isAdmin ? (
            <>
              <Settings className="w-3 h-3" />
              ADMIN
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              VIEW
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Chromatic Wheel */}
        <ChromaticWheel
          beds={beds}
          selectedTone={selectedTone}
          onSelectTone={handleSelectTone}
          brixValue={brixValue}
          onBrixChange={setBrixValue}
          isLoading={isLoading}
        />

        {/* Unified Almanac Card for Selected Tone */}
        <AnimatePresence>
          {selectedTone && (
            <UnifiedAlmanacCard
              tone={selectedTone}
              beds={beds}
              brixValue={brixValue}
              onBrixChange={setBrixValue}
              onClose={handleCloseToneDetail}
            />
          )}
        </AnimatePresence>

        {/* Overview Stats (when no tone selected) */}
        {!selectedTone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-2xl text-center"
            style={{
              background: 'hsl(220 20% 12%)',
              border: '1px solid hsl(220 20% 20%)',
            }}
          >
            <p className="text-sm text-white/60">
              Select a tone to view its <span className="text-purple-400 font-bold">Unified Almanac Card</span>
            </p>
            <p className="text-xs text-white/40 mt-1">
              Each tone maps to an Instrument Group with Paired Plants, Soil Recipe, and Frequency Signal
            </p>
          </motion.div>
        )}
      </div>

      {/* Sovereignty Footer */}
      <SovereigntyFooter />
    </main>
  );
};

export default PianoAlmanac;
