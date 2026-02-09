import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Leaf, RotateCcw, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/**
 * ROTATION WARNING
 * Logic Gate: Prevents selecting the same 'Instrument Type' twice in a row
 * Suggests a 'Soil Builder' if the previous crop was a 'Heavy Feeder'
 */

interface RotationWarningProps {
  bedId: string;
  currentInstrumentType: string | null;
  frequencyHz: number;
}

// Heavy feeders by instrument type
const HEAVY_FEEDERS = ['Electric Guitar', 'Percussion']; // Nightshades, Grains

// Soil builders by frequency zone
const SOIL_BUILDERS: Record<number, { name: string; benefit: string }> = {
  396: { name: 'Crimson Clover', benefit: 'Nitrogen fixation for Root zone' },
  417: { name: 'Daikon Radish', benefit: 'Deep tap root breaks compaction' },
  528: { name: 'Buckwheat', benefit: 'Quick carbon for Solar zone' },
  639: { name: 'Austrian Winter Peas', benefit: 'Nitrogen + biomass' },
  741: { name: 'Oats', benefit: 'Allelopathic weed suppression' },
  852: { name: 'Tillage Radish', benefit: 'Scavenges deep minerals' },
  963: { name: 'Hairy Vetch', benefit: 'Heavy nitrogen for Shield zone' },
};

const RotationWarning = ({ bedId, currentInstrumentType, frequencyHz }: RotationWarningProps) => {
  const [previousInstrumentType, setPreviousInstrumentType] = useState<string | null>(null);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);

  // Check previous planting history
  useEffect(() => {
    const checkHistory = async () => {
      // In production, this would query planting history
      // For now, we'll simulate with random previous type
      const types = ['Electric Guitar', 'Percussion', 'Horn Section', 'Bass', 'Synthesizers'];
      const randomPrevious = types[Math.floor(Math.random() * types.length)];
      setPreviousInstrumentType(randomPrevious);
    };

    checkHistory();
  }, [bedId]);

  const showRotationWarning = currentInstrumentType && 
    previousInstrumentType && 
    currentInstrumentType === previousInstrumentType &&
    !isWarningDismissed;

  const showSoilBuilderSuggestion = previousInstrumentType && 
    HEAVY_FEEDERS.includes(previousInstrumentType) &&
    !isWarningDismissed;

  const soilBuilder = SOIL_BUILDERS[frequencyHz];

  if (!showRotationWarning && !showSoilBuilderSuggestion) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-3"
      >
        {/* Same Instrument Type Warning */}
        {showRotationWarning && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </motion.div>
                <div>
                  <p className="font-bold text-red-800">⚠️ Rotation Warning</p>
                  <p className="text-sm text-red-600 mt-1">
                    Same instrument type ({currentInstrumentType}) planted twice in a row!
                  </p>
                  <p className="text-xs text-red-500 mt-2">
                    This may deplete specific soil minerals. Consider rotating to a different family.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsWarningDismissed(true)}
                className="p-1 hover:bg-red-100 rounded"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        )}

        {/* Soil Builder Suggestion */}
        {showSoilBuilderSuggestion && soilBuilder && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-green-800">💡 Soil Builder Suggested</p>
                <p className="text-sm text-green-600 mt-1">
                  Previous crop was a <strong>Heavy Feeder</strong> ({previousInstrumentType})
                </p>
                <div className="mt-3 p-3 rounded-xl bg-white/80 border border-green-200">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-800">{soilBuilder.name}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">{soilBuilder.benefit}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default RotationWarning;
