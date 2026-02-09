import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Leaf, Sparkles, Network, TreeDeciduous, 
  Wand2, ChevronDown, ChevronUp, Beaker 
} from 'lucide-react';
import { 
  GardenBed, BedPlanting, calculatePlantCount, useAddPlanting, 
  useUpdateBedInoculant, useUpdateBedAerialCrop, ChordInterval, CHORD_INTERVALS,
  InoculantType
} from '@/hooks/useGardenBeds';
import { MasterCrop } from '@/hooks/useMasterCrops';
import { useAutoGeneration, getMasterMixSetting, INSTRUMENT_ICONS, InstrumentType } from '@/hooks/useAutoGeneration';
import { getZoneRecommendation } from '@/data/jazzVoicingRecommendations';
import { toast } from 'sonner';

/**
 * PREPARATION CARD
 * Auto-generated single card for mobile showing:
 * - Master Mix recipe based on Instrument Type
 * - Jazz Voicing (3rd through 13th) auto-suggestions
 */

interface PreparationCardProps {
  bed: GardenBed;
  plantings: BedPlanting[];
  allCrops: MasterCrop[];
  isAdmin: boolean;
  simpleMode: boolean;
  onClose: () => void;
}

// Master Mix base recipe (5-Quart Rule for 150 sq ft)
const MASTER_MIX_BASE = [
  { name: 'Pro-Mix', amount: 5, unit: 'qt', category: 'base' },
  { name: 'Alfalfa Meal', amount: 2, unit: 'cups', category: 'nitrogen' },
  { name: 'Soybean Meal', amount: 2, unit: 'cups', category: 'nitrogen' },
  { name: 'Kelp Meal', amount: 1, unit: 'cup', category: 'mineral' },
  { name: 'Sea Minerals', amount: 0.5, unit: 'cup', category: 'mineral' },
  { name: 'Gypsum', amount: 1, unit: 'cup', category: 'calcium' },
  { name: 'Worm Castings', amount: 2, unit: 'cups', category: 'biology' },
  { name: 'Humates', amount: 1, unit: 'cup', category: 'carbon' },
];

// Instrument-specific boosts
const INSTRUMENT_BOOSTS: Record<string, { ingredient: string; boost: string }> = {
  'Electric Guitar': { ingredient: 'Gypsum', boost: '+1 cup (Calcium for Nightshades)' },
  'Percussion': { ingredient: 'Kelp Meal', boost: '+0.5 cup (Silica for Grains)' },
  'Horn Section': { ingredient: 'Alfalfa Meal', boost: '+1 cup (Nitrogen for Brassicas)' },
  'Bass': { ingredient: 'Sea Minerals', boost: '+0.5 cup (Sulfur for Alliums)' },
  'Synthesizers': { ingredient: 'Humates', boost: '+0.5 cup (Carbon for Herbs)' },
};

// Chord names based on frequency zone
const getChordName = (frequencyHz: number) => {
  const names: Record<number, string> = {
    396: 'The Foundation Chord',
    417: 'The Flow Chord',
    528: 'The Solar Chord',
    639: 'The Heart Chord',
    741: 'The Expression Chord',
    852: 'The Vision Chord',
    963: 'The Source Chord',
  };
  return names[frequencyHz] || 'The Resonance Chord';
};

const PreparationCard = ({ 
  bed, 
  plantings, 
  allCrops, 
  isAdmin, 
  simpleMode,
  onClose 
}: PreparationCardProps) => {
  const [showRecipe, setShowRecipe] = useState(true);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const addPlanting = useAddPlanting();
  const updateInoculant = useUpdateBedInoculant();
  const updateAerialCrop = useUpdateBedAerialCrop();

  // Get root crop for instrument-based boosts
  const rootPlanting = plantings.find(p => p.crop?.chord_interval === 'Root (Lead)');
  const rootCrop = rootPlanting ? allCrops.find(c => c.id === rootPlanting.crop_id) : null;

  // Auto-generation hook
  const { generateChord, zoneCrops } = useAutoGeneration(
    allCrops,
    bed.frequency_hz,
    rootCrop || null
  );

  const generatedChord = useMemo(() => {
    if (rootCrop) {
      return generateChord();
    }
    return null;
  }, [rootCrop, generateChord]);

  // Check chord completion status
  const hasInterval = (interval: ChordInterval) => 
    plantings.some(p => p.crop?.chord_interval === interval);
  
  const chordStatus = {
    'Root (Lead)': hasInterval('Root (Lead)'),
    '3rd (Triad)': hasInterval('3rd (Triad)'),
    '5th (Stabilizer)': hasInterval('5th (Stabilizer)'),
    '7th (Signal)': hasInterval('7th (Signal)'),
  };
  const isCompleteChord = Object.values(chordStatus).every(Boolean);
  const has11thInterval = bed.inoculant_type !== null;
  const has13thInterval = bed.aerial_crop_id !== null;

  // Get instrument type and boost
  const instrumentType = rootCrop?.instrument_type as InstrumentType | undefined;
  const instrumentBoost = instrumentType ? INSTRUMENT_BOOSTS[instrumentType] : null;
  const instrumentInfo = instrumentType ? INSTRUMENT_ICONS[instrumentType] : null;

  // Get zone recommendation for 11th/13th
  const zoneRec = getZoneRecommendation(bed.frequency_hz);
  const masterMixSetting = getMasterMixSetting(bed.frequency_hz);

  // Execute auto-fill chord
  const handleAutoFillChord = async () => {
    if (!isAdmin || !generatedChord) return;
    setIsAutoFilling(true);

    try {
      // Add 3rd
      if (generatedChord.third && !chordStatus['3rd (Triad)']) {
        const plantCount = calculatePlantCount(generatedChord.third.spacing_inches);
        await addPlanting.mutateAsync({
          bedId: bed.id,
          cropId: generatedChord.third.id,
          guildRole: '3rd (Triad)',
          plantCount,
        });
      }

      // Add 5th
      if (generatedChord.fifth && !chordStatus['5th (Stabilizer)']) {
        const plantCount = calculatePlantCount(generatedChord.fifth.spacing_inches);
        await addPlanting.mutateAsync({
          bedId: bed.id,
          cropId: generatedChord.fifth.id,
          guildRole: '5th (Stabilizer)',
          plantCount,
        });
      }

      // Add 7th
      if (generatedChord.seventh && !chordStatus['7th (Signal)']) {
        const plantCount = calculatePlantCount(generatedChord.seventh.spacing_inches);
        await addPlanting.mutateAsync({
          bedId: bed.id,
          cropId: generatedChord.seventh.id,
          guildRole: '7th (Signal)',
          plantCount,
        });
      }

      // Set 11th (inoculant)
      if (generatedChord.eleventh && !has11thInterval) {
        await updateInoculant.mutateAsync({ bedId: bed.id, inoculantType: generatedChord.eleventh });
      }

      // Set 13th (aerial crop)
      if (generatedChord.thirteenth && !has13thInterval) {
        await updateAerialCrop.mutateAsync({ bedId: bed.id, aerialCropId: generatedChord.thirteenth.id });
      }

      toast.success('🎵 Smooth Voicing Complete!');
    } catch (error) {
      toast.error('Failed to auto-fill chord');
    } finally {
      setIsAutoFilling(false);
    }
  };

  return (
    <motion.div
      className="rounded-3xl overflow-hidden bg-white border-2 shadow-xl"
      style={{ borderColor: bed.zone_color }}
    >
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${bed.zone_color}20, ${bed.zone_color}10)` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl text-white"
            style={{ backgroundColor: bed.zone_color }}
          >
            {bed.bed_number}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              {simpleMode ? getChordName(bed.frequency_hz) : `${bed.zone_name} Zone`}
            </h3>
            <p className="text-sm text-gray-500">
              {simpleMode ? 'Preparation Card' : `${bed.frequency_hz}Hz • ${masterMixSetting?.primaryMineral || ''}`}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Instrument Badge (if root selected) */}
      {instrumentInfo && (
        <div 
          className="mx-4 mt-4 p-3 rounded-xl flex items-center gap-3"
          style={{ backgroundColor: `${bed.zone_color}10` }}
        >
          <span className="text-2xl">{instrumentInfo.icon}</span>
          <div>
            <p className="font-bold text-gray-900">{instrumentInfo.role}</p>
            <p className="text-xs text-gray-500">{instrumentInfo.description}</p>
          </div>
        </div>
      )}

      {/* Master Mix Recipe */}
      <div className="p-4">
        <button 
          onClick={() => setShowRecipe(!showRecipe)}
          className="w-full flex items-center justify-between py-2"
        >
          <div className="flex items-center gap-2">
            <Beaker className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-gray-900">
              {simpleMode ? 'Soil Recipe' : 'Master Mix (5-Quart)'}
            </span>
          </div>
          {showRecipe ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {showRecipe && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 mt-2"
            >
              {MASTER_MIX_BASE.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                >
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-sm font-mono font-bold text-gray-900">
                    {item.amount} {item.unit}
                  </span>
                </div>
              ))}

              {/* Instrument Boost */}
              {instrumentBoost && (
                <div 
                  className="flex items-center justify-between p-3 rounded-lg border-2"
                  style={{ 
                    backgroundColor: `${bed.zone_color}10`,
                    borderColor: bed.zone_color 
                  }}
                >
                  <span className="text-sm font-bold" style={{ color: bed.zone_color }}>
                    ⚡ {instrumentBoost.ingredient}
                  </span>
                  <span className="text-sm font-mono" style={{ color: bed.zone_color }}>
                    {instrumentBoost.boost}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Jazz Voicing Status */}
      <div className="px-4 pb-4">
        <h4 className="font-bold text-gray-900 mb-3">
          {simpleMode ? '♪ Harmony Status' : 'Jazz Voicing (3rd–13th)'}
        </h4>

        <div className="grid grid-cols-3 gap-2">
          {/* Ground Intervals (Root, 3rd, 5th, 7th) */}
          {CHORD_INTERVALS.map(interval => {
            const hasIt = chordStatus[interval];
            const label = interval.split(' ')[0];
            
            return (
              <div 
                key={interval}
                className={`p-3 rounded-xl text-center ${
                  hasIt ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex justify-center mb-1">
                  {hasIt ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Leaf className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <span className={`text-xs font-bold ${hasIt ? 'text-green-700' : 'text-gray-500'}`}>
                  {label}
                </span>
              </div>
            );
          })}

          {/* 11th Interval */}
          <div 
            className={`p-3 rounded-xl text-center ${
              has11thInterval ? 'bg-cyan-50 border-2 border-cyan-300' : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex justify-center mb-1">
              {has11thInterval ? (
                <Network className="w-5 h-5 text-cyan-600" />
              ) : (
                <Network className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <span className={`text-xs font-bold ${has11thInterval ? 'text-cyan-700' : 'text-gray-500'}`}>
              11th
            </span>
            {zoneRec && !has11thInterval && (
              <p className="text-[8px] text-gray-400 mt-1">{zoneRec.eleventh.name}</p>
            )}
          </div>

          {/* 13th Interval */}
          <div 
            className={`p-3 rounded-xl text-center ${
              has13thInterval ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex justify-center mb-1">
              {has13thInterval ? (
                <TreeDeciduous className="w-5 h-5 text-emerald-600" />
              ) : (
                <TreeDeciduous className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <span className={`text-xs font-bold ${has13thInterval ? 'text-emerald-700' : 'text-gray-500'}`}>
              13th
            </span>
            {zoneRec && !has13thInterval && (
              <p className="text-[8px] text-gray-400 mt-1">{zoneRec.thirteenth.name}</p>
            )}
          </div>
        </div>

        {/* Auto-Fill Button */}
        {isAdmin && rootCrop && !isCompleteChord && (
          <motion.button
            className="w-full mt-4 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: bed.zone_color }}
            onClick={handleAutoFillChord}
            disabled={isAutoFilling}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAutoFilling ? (
              <span className="animate-pulse">Filling...</span>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                {simpleMode ? 'Complete Harmony' : 'Auto-Fill Smooth Voicing'}
              </>
            )}
          </motion.button>
        )}

        {/* Complete Chord Badge */}
        {isCompleteChord && has11thInterval && has13thInterval && (
          <motion.div
            className="mt-4 p-4 rounded-xl text-center bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Sparkles className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="font-bold text-amber-800">
              {simpleMode ? '✨ Perfect Harmony' : '🎷 Jazz 13th Complete'}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PreparationCard;
