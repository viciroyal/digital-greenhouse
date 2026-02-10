import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Check, AlertTriangle, Leaf, Shield, 
  Pickaxe, Sparkles, Music, Loader2, Trash2, Zap, Network, Droplets, TreeDeciduous, Crown, Lightbulb, Wand2,
  Activity, Target, Radio
} from 'lucide-react';
import { 
  GardenBed, BedPlanting, calculatePlantCount, useAddPlanting, useRemovePlanting, 
  useUpdateBedBrix, useUpdateBedInoculant, useUpdateBedAerialCrop, calculateWaterReduction,
  calculateComplexityScore, ChordInterval, CHORD_INTERVALS, InoculantType, INOCULANT_OPTIONS, AERIAL_PLANT_COUNT 
} from '@/hooks/useGardenBeds';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getZoneRecommendation } from '@/data/jazzVoicingRecommendations';
import { useAutoGeneration, checkDissonance, getMasterMixSetting, INSTRUMENT_ICONS, InstrumentType } from '@/hooks/useAutoGeneration';
import ChordSheet from './ChordSheet';
import DissonanceWarning from './DissonanceWarning';
import { getZoneAreaMapping, getStatusIndicators, getActionTriggers } from '@/data/zoneStatusMatrix';
import { getZoneByFrequency } from '@/data/harmonicZoneProtocol';

// Extended bed type with aerial crop data
interface BedWithAerial extends GardenBed {
  aerial_crop?: { id: string; name: string; common_name: string | null; frequency_hz: number } | null;
}

interface BedDetailPanelProps {
  bed: BedWithAerial;
  plantings: BedPlanting[];
  isAdmin: boolean;
  jazzMode?: boolean;
  onClose: () => void;
}

// Map chord intervals to icons and colors
const getIntervalIcon = (interval: string) => {
  switch (interval) {
    case 'Root (Lead)': return Leaf;
    case '3rd (Triad)': return Shield;
    case '5th (Stabilizer)': return Pickaxe;
    case '7th (Signal)': return Sparkles;
    default: return Leaf;
  }
};

const getIntervalColor = (interval: string) => {
  switch (interval) {
    case 'Root (Lead)': return 'hsl(120 50% 50%)';
    case '3rd (Triad)': return 'hsl(0 60% 55%)';
    case '5th (Stabilizer)': return 'hsl(35 70% 55%)';
    case '7th (Signal)': return 'hsl(270 50% 60%)';
    default: return 'hsl(0 0% 50%)';
  }
};

const getIntervalLabel = (interval: string) => {
  switch (interval) {
    case 'Root (Lead)': return 'Root';
    case '3rd (Triad)': return '3rd';
    case '5th (Stabilizer)': return '5th';
    case '7th (Signal)': return '7th';
    default: return interval;
  }
};

const getIntervalDescription = (interval: string) => {
  switch (interval) {
    case 'Root (Lead)': return 'The Anchor • Main Harvest';
    case '3rd (Triad)': return 'Triad Support • Pest Defense';
    case '5th (Stabilizer)': return 'Stabilizer • Deep Minerals';
    case '7th (Signal)': return 'Signal Note • Pollinators';
    default: return '';
  }
};

// Chord names based on frequency zone
const getChordName = (frequencyHz: number) => {
  switch (frequencyHz) {
    case 396: return 'The Foundation Chord';
    case 417: return 'The Flow Chord';
    case 528: return 'The Solar Chord';
    case 639: return 'The Heart Chord';
    case 741: return 'The Expression Chord';
    case 852: return 'The Vision Chord';
    case 963: return 'The Source Chord';
    default: return 'The Resonance Chord';
  }
};

// Vitality note based on chord completion and Brix
const getVitalityNote = (isCompleteChord: boolean, has5th: boolean, brix: number | null) => {
  if (isCompleteChord && brix && brix >= 15) {
    return { text: 'Thriving', color: 'hsl(120 60% 50%)' };
  }
  if (isCompleteChord) {
    return { text: 'Harmonized', color: 'hsl(45 80% 55%)' };
  }
  if (has5th) {
    return { text: 'Growing Strong', color: 'hsl(35 70% 55%)' };
  }
  return { text: 'In Progress', color: 'hsl(0 0% 50%)' };
};

const BedDetailPanel = ({ bed, plantings, isAdmin, jazzMode = false, onClose }: BedDetailPanelProps) => {
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<ChordInterval>('Root (Lead)');
  const [brixInput, setBrixInput] = useState(bed.internal_brix?.toString() || '');
  const [showChordSheet, setShowChordSheet] = useState(false);
  const [whiteRefCalibrated, setWhiteRefCalibrated] = useState(false);
  const [dissonanceCheck, setDissonanceCheck] = useState<{ crop: MasterCrop; interval: ChordInterval } | null>(null);
  const [pendingCrop, setPendingCrop] = useState<MasterCrop | null>(null);
  
  const { data: allCrops = [], isLoading: cropsLoading } = useMasterCrops();
  const addPlanting = useAddPlanting();
  const removePlanting = useRemovePlanting();
  const updateBrix = useUpdateBedBrix();
  const updateInoculant = useUpdateBedInoculant();
  const updateAerialCrop = useUpdateBedAerialCrop();

  // Get the Root crop from current plantings
  const rootPlanting = plantings.find(p => p.crop?.chord_interval === 'Root (Lead)');
  const rootCrop = rootPlanting?.crop ? allCrops.find(c => c.id === rootPlanting.crop_id) : null;

  // Auto-generation hook
  const { zoneCrops, cropsByInterval, generateChord, checkDissonance: checkCropDissonance } = useAutoGeneration(
    allCrops,
    bed.frequency_hz,
    rootCrop || null
  );

  // Generate chord when root is selected
  const generatedChord = useMemo(() => {
    if (rootCrop) {
      return generateChord();
    }
    return null;
  }, [rootCrop, generateChord]);

  // 13th Interval: Get available aerial/overstory crops (trees, tall perennials)
  const aerialCrops = allCrops.filter(crop => 
    crop.category === 'tree' || crop.category === 'perennial' || crop.guild_role === 'Enhancer'
  );
  const has13thInterval = bed.aerial_crop_id !== null || bed.aerial_crop !== null;

  // Filter crops by frequency AND chord interval
  const frequencyMatchedCrops = allCrops.filter(
    (crop) => crop.frequency_hz === bed.frequency_hz && crop.chord_interval === selectedInterval
  );

  // Check Complete Chord status (Root + 3rd + 5th + 7th)
  const hasInterval = (interval: ChordInterval) => 
    plantings.some(p => p.crop?.chord_interval === interval);
  
  const chordStatus = {
    'Root (Lead)': hasInterval('Root (Lead)'),
    '3rd (Triad)': hasInterval('3rd (Triad)'),
    '5th (Stabilizer)': hasInterval('5th (Stabilizer)'),
    '7th (Signal)': hasInterval('7th (Signal)'),
  };
  const isCompleteChord = Object.values(chordStatus).every(Boolean);

  // 5th Bonus: +15% Brix projection when 5th is present
  const has5thBonus = chordStatus['5th (Stabilizer)'];
  const baseBrix = bed.internal_brix || 0;
  const projectedBrix = has5thBonus ? Math.round(baseBrix * 1.15) : baseBrix;

  // 7th Mask: Pest masking when 7th is present
  const hasPestMasking = chordStatus['7th (Signal)'];

  // 11th Interval: Fungal Network status
  const has11thInterval = bed.inoculant_type !== null;
  const waterReductionMultiplier = calculateWaterReduction(has11thInterval);

  // Jazz Voicing Complexity Score
  const complexityScore = calculateComplexityScore(chordStatus, has11thInterval, has13thInterval);

  // Get chord name and vitality note for member view
  const chordName = getChordName(bed.frequency_hz);
  const vitalityNote = getVitalityNote(isCompleteChord, has5thBonus, bed.internal_brix);

  // Get missing intervals for smart suggestions
  const missingIntervals = CHORD_INTERVALS.filter(interval => !chordStatus[interval]);

  // Smart suggestion: When Root is planted, show 5th and 7th suggestions
  const showSmartSuggestions = chordStatus['Root (Lead)'] && !isCompleteChord && isAdmin && !isAddingCrop;

  // Get master mix setting for this zone
  const masterMixSetting = getMasterMixSetting(bed.frequency_hz);

  const handleInoculantChange = async (value: string) => {
    if (!isAdmin) {
      toast.error('Only admins can update inoculant');
      return;
    }
    
    const inoculantType = value === 'none' ? null : value as InoculantType;
    
    try {
      await updateInoculant.mutateAsync({ bedId: bed.id, inoculantType });
      toast.success(inoculantType ? `${inoculantType} Network Activated` : 'Fungal Network Deactivated');
    } catch (error) {
      toast.error('Failed to update inoculant');
    }
  };

  const handleAerialCropChange = async (value: string) => {
    if (!isAdmin) {
      toast.error('Only admins can update aerial crops');
      return;
    }
    
    const aerialCropId = value === 'none' ? null : value;
    
    try {
      await updateAerialCrop.mutateAsync({ bedId: bed.id, aerialCropId });
      toast.success(aerialCropId ? '13th Interval Activated - Aerial Signal Set' : '13th Interval Deactivated');
    } catch (error) {
      toast.error('Failed to update aerial crop');
    }
  };

  const handleAddCrop = async (crop: MasterCrop, skipDissonanceCheck = false) => {
    if (!isAdmin) {
      toast.error('Only admins can add crops');
      return;
    }

    // Check for dissonance (frequency mismatch)
    if (!skipDissonanceCheck) {
      const dissonance = checkDissonance(crop, bed.frequency_hz, selectedInterval, jazzMode);
      if (dissonance.isDissonant) {
        setDissonanceCheck({ crop, interval: selectedInterval });
        setPendingCrop(crop);
        return;
      }
    }

    const plantCount = calculatePlantCount(crop.spacing_inches);
    
    try {
      await addPlanting.mutateAsync({
        bedId: bed.id,
        cropId: crop.id,
        guildRole: selectedInterval,
        plantCount,
      });
      toast.success(`Added ${crop.name} (${plantCount} plants)`);
      setIsAddingCrop(false);
      setDissonanceCheck(null);
      setPendingCrop(null);
    } catch (error) {
      toast.error('Failed to add crop');
    }
  };

  // Handle proceeding despite dissonance
  const handleProceedWithDissonance = () => {
    if (pendingCrop) {
      handleAddCrop(pendingCrop, true);
    }
  };

  // Handle dismissing dissonance warning
  const handleDismissDissonance = () => {
    setDissonanceCheck(null);
    setPendingCrop(null);
  };

  // Auto-fill all intervals when Root is selected
  const handleAutoFillChord = async () => {
    if (!isAdmin || !generatedChord) {
      toast.error('Select a Root crop first to auto-fill');
      return;
    }

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

      toast.success('🎵 Chord Auto-Generated! All intervals filled based on frequency zone.');
    } catch (error) {
      toast.error('Failed to auto-fill chord');
    }
  };

  const handleRemovePlanting = async (planting: BedPlanting) => {
    if (!isAdmin) {
      toast.error('Only admins can remove crops');
      return;
    }

    try {
      await removePlanting.mutateAsync({ plantingId: planting.id, bedId: bed.id });
      toast.success('Crop removed');
    } catch (error) {
      toast.error('Failed to remove crop');
    }
  };

  const handleUpdateBrix = async () => {
    if (!isAdmin) return;
    
    const brixValue = brixInput ? parseInt(brixInput) : null;
    
    try {
      await updateBrix.mutateAsync({ bedId: bed.id, brix: brixValue });
      toast.success('Brix updated');
    } catch (error) {
      toast.error('Failed to update Brix');
    }
  };

  const handleSuggestionClick = (interval: ChordInterval) => {
    setSelectedInterval(interval);
    setIsAddingCrop(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded-[25px] overflow-hidden"
      style={{
        background: isCompleteChord 
          ? `linear-gradient(180deg, ${bed.zone_color}15, hsl(0 0% 6%))`
          : 'linear-gradient(180deg, hsl(0 0% 10%), hsl(0 0% 6%))',
        border: `2px solid ${bed.zone_color}`,
        boxShadow: isCompleteChord 
          ? `0 0 30px ${bed.zone_color}40, 0 0 60px ${bed.zone_color}20`
          : 'none',
      }}
    >
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${bed.zone_color}25, ${bed.zone_color}10)`,
          borderBottom: `1px solid ${bed.zone_color}40`,
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `${bed.zone_color}30`,
              border: `2px solid ${bed.zone_color}`,
              boxShadow: isCompleteChord ? `0 0 15px ${bed.zone_color}60` : 'none',
            }}
            animate={isCompleteChord ? { 
              boxShadow: [
                `0 0 15px ${bed.zone_color}60`,
                `0 0 25px ${bed.zone_color}80`,
                `0 0 15px ${bed.zone_color}60`,
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xl font-mono font-bold" style={{ color: bed.zone_color }}>
              {bed.bed_number}
            </span>
          </motion.div>
          <div>
            <h3 className="font-mono text-sm font-bold" style={{ color: bed.zone_color }}>
              {isAdmin ? bed.zone_name : chordName}
            </h3>
            {isAdmin ? (
              <div className="flex items-center gap-1">
                <Music className="w-3 h-3" style={{ color: 'hsl(0 0% 50%)' }} />
                <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                  {bed.frequency_hz}Hz
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span 
                  className="text-[10px] font-mono font-bold"
                  style={{ color: vitalityNote.color }}
                >
                  ♪ {vitalityNote.text}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {isCompleteChord && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${bed.zone_color}40, ${bed.zone_color}20)`,
                  border: `1px solid ${bed.zone_color}`,
                  boxShadow: `0 0 20px ${bed.zone_color}50`,
                }}
              >
                <Zap className="w-3.5 h-3.5" style={{ color: bed.zone_color }} />
                <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: bed.zone_color }}>
                  {isAdmin ? 'HARMONICALLY TUNED' : 'TUNED'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'hsl(0 0% 50%)' }} />
          </button>
        </div>
      </div>

      {/* ZONE STATUS INDICATORS - from Zone Status Matrix */}
      {(() => {
        const zoneMapping = getZoneAreaMapping(bed.frequency_hz);
        const harmonicZone = getZoneByFrequency(bed.frequency_hz);
        
        if (!zoneMapping || !harmonicZone) return null;
        
        return (
          <div className="px-4 py-3">
            <div 
              className="p-3 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${bed.zone_color}08, hsl(0 0% 6%))`,
                border: `1px solid ${bed.zone_color}25`,
              }}
            >
              {/* Zone Identity Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: `${bed.zone_color}25`, border: `1px solid ${bed.zone_color}40` }}
                  >
                    <span className="text-xs font-mono font-bold" style={{ color: bed.zone_color }}>
                      {harmonicZone.note}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: bed.zone_color }}>
                      {harmonicZone.agroIdentity.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-mono ml-2" style={{ color: 'hsl(0 0% 45%)' }}>
                      → {zoneMapping.pillar.pillarName}
                    </span>
                  </div>
                </div>
                <Radio className="w-3.5 h-3.5" style={{ color: bed.zone_color, opacity: 0.6 }} />
              </div>

              {/* Operational Signal */}
              <div 
                className="px-3 py-2 rounded-lg mb-3"
                style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 15%)' }}
              >
                <p className="text-[11px] font-mono" style={{ color: bed.zone_color }}>
                  ⚡ {harmonicZone.operationalSignal}
                </p>
              </div>

              {/* Status Indicators */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <Activity className="w-3 h-3" style={{ color: 'hsl(0 0% 50%)' }} />
                  <span className="text-[9px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 50%)' }}>
                    STATUS INDICATORS
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {zoneMapping.statusIndicators.map((indicator, idx) => (
                    <div
                      key={idx}
                      className="px-2 py-1 rounded-md"
                      style={{ 
                        background: `${bed.zone_color}10`,
                        border: `1px solid ${bed.zone_color}20`,
                      }}
                    >
                      <span className="text-[9px] font-mono" style={{ color: `${bed.zone_color}cc` }}>
                        {indicator}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Triggers - Admin Only */}
              {isAdmin && (
                <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid hsl(0 0% 12%)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Target className="w-3 h-3" style={{ color: 'hsl(45 70% 55%)' }} />
                    <span className="text-[9px] font-mono tracking-wider" style={{ color: 'hsl(45 70% 55%)' }}>
                      ACTION TRIGGERS
                    </span>
                  </div>
                  <div className="space-y-1">
                    {zoneMapping.actionTriggers.map((trigger, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-1.5 rounded-md flex items-start gap-2"
                        style={{ 
                          background: 'hsl(45 30% 8%)',
                          border: '1px solid hsl(45 40% 20%)',
                        }}
                      >
                        <span className="text-[10px]" style={{ color: 'hsl(45 70% 55%)' }}>→</span>
                        <span className="text-[10px] font-mono" style={{ color: 'hsl(45 50% 65%)' }}>
                          {trigger}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* MEMBER VIEW: Simplified Chord Display */}
      {!isAdmin && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-center gap-2 py-4">
            {CHORD_INTERVALS.map((interval, idx) => {
              const hasIt = chordStatus[interval];
              const color = getIntervalColor(interval);
              
              return (
                <motion.div
                  key={interval}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: hasIt ? `${color}30` : 'hsl(0 0% 12%)',
                    border: `2px solid ${hasIt ? color : 'hsl(0 0% 20%)'}`,
                    boxShadow: hasIt ? `0 0 12px ${color}40` : 'none',
                  }}
                  animate={hasIt ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                >
                  <span 
                    className="text-xs font-mono font-bold"
                    style={{ color: hasIt ? color : 'hsl(0 0% 30%)' }}
                  >
                    {hasIt ? '♪' : '○'}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div 
            className="text-center p-4 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${vitalityNote.color}10, hsl(0 0% 8%))`,
              border: `1px solid ${vitalityNote.color}30`,
            }}
          >
            <p className="text-sm font-mono" style={{ color: vitalityNote.color }}>
              {isCompleteChord 
                ? `✦ ${chordName} is complete and resonating!`
                : `Building ${chordName}... ${Object.values(chordStatus).filter(Boolean).length}/4 notes`
              }
            </p>
          </div>
        </div>
      )}

      {/* Dissonance Warning Modal */}
      <AnimatePresence>
        {dissonanceCheck && pendingCrop && (
          <div className="p-4">
            <DissonanceWarning
              check={checkDissonance(pendingCrop, bed.frequency_hz, dissonanceCheck.interval, jazzMode)}
              onDismiss={handleDismissDissonance}
              onProceed={handleProceedWithDissonance}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN VIEW: Full Chord Conductor */}
      {isAdmin && (
        <>
          {/* Auto-Fill Button - Shows when Root is planted but chord is incomplete */}
          {chordStatus['Root (Lead)'] && !isCompleteChord && generatedChord && (
            <div className="px-4 pb-2">
              <motion.button
                className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, hsl(270 50% 25%), hsl(280 40% 20%))',
                  border: '2px solid hsl(270 60% 50%)',
                  boxShadow: '0 0 20px hsl(270 60% 40% / 0.3)',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px hsl(270 60% 50% / 0.5)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAutoFillChord}
              >
                <Wand2 className="w-5 h-5" style={{ color: 'hsl(270 70% 70%)' }} />
                <span className="text-sm font-mono font-bold tracking-wider" style={{ color: 'hsl(270 70% 75%)' }}>
                  AUTO-FILL CHORD
                </span>
                <span className="text-[10px] font-mono ml-2 px-2 py-0.5 rounded" style={{ background: 'hsl(270 50% 35%)', color: 'hsl(270 60% 80%)' }}>
                  3rd + 5th + 7th + 11th + 13th
                </span>
              </motion.button>
            </div>
          )}

          {/* Chord Sheet Toggle */}
          <div className="px-4 pb-2">
            <motion.button
              className="w-full py-2 px-4 rounded-lg flex items-center justify-between"
              style={{
                background: showChordSheet ? 'hsl(45 40% 15%)' : 'hsl(0 0% 10%)',
                border: showChordSheet ? '1px solid hsl(45 60% 45%)' : '1px solid hsl(0 0% 25%)',
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowChordSheet(!showChordSheet)}
            >
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4" style={{ color: showChordSheet ? 'hsl(45 70% 60%)' : 'hsl(0 0% 50%)' }} />
                <span className="text-xs font-mono font-bold" style={{ color: showChordSheet ? 'hsl(45 70% 60%)' : 'hsl(0 0% 60%)' }}>
                  VIEW CHORD SHEET
                </span>
              </div>
              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                {showChordSheet ? '▼' : '▶'}
              </span>
            </motion.button>
          </div>

          {/* Chord Sheet Display */}
          <AnimatePresence>
            {showChordSheet && generatedChord && (
              <div className="px-4 pb-4">
                <ChordSheet sheet={generatedChord.chordSheet} isAdmin={isAdmin} />
              </div>
            )}
          </AnimatePresence>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono tracking-wider" style={{ color: 'hsl(0 0% 55%)' }}>
                CHORD CONDUCTOR
              </span>
              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                {Object.values(chordStatus).filter(Boolean).length}/4 Notes
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {CHORD_INTERVALS.map((interval) => {
                const Icon = getIntervalIcon(interval);
                const hasIt = chordStatus[interval];
                const color = getIntervalColor(interval);
                const label = getIntervalLabel(interval);
                
                return (
                  <motion.button
                    key={interval}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl cursor-pointer"
                    style={{
                      background: hasIt ? `${color}20` : 'hsl(0 0% 8%)',
                      border: `2px solid ${hasIt ? color : 'hsl(0 0% 18%)'}`,
                      boxShadow: hasIt ? `0 0 12px ${color}30` : 'none',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestionClick(interval)}
                  >
                    <Icon className="w-5 h-5" style={{ color: hasIt ? color : 'hsl(0 0% 35%)' }} />
                    <span className="text-[10px] font-mono font-bold" style={{ color: hasIt ? color : 'hsl(0 0% 35%)' }}>
                      {label}
                    </span>
                    {hasIt ? (
                      <Check className="w-3 h-3" style={{ color }} />
                    ) : (
                      <Plus className="w-3 h-3" style={{ color: 'hsl(0 0% 30%)' }} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* JAZZ VOICING COMPLEXITY SCORE */}
          <div className="px-4 pb-4">
            <div 
              className="p-4 rounded-xl"
              style={{ 
                background: complexityScore.isMasterConductor 
                  ? 'linear-gradient(135deg, hsl(45 60% 15%), hsl(35 50% 10%))'
                  : 'linear-gradient(135deg, hsl(270 20% 12%), hsl(270 15% 8%))',
                border: complexityScore.isMasterConductor 
                  ? '2px solid hsl(45 80% 55%)'
                  : '1px solid hsl(270 30% 30%)',
                boxShadow: complexityScore.isMasterConductor 
                  ? '0 0 30px hsl(45 80% 50% / 0.3)'
                  : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4" style={{ color: complexityScore.isMasterConductor ? 'hsl(45 80% 60%)' : 'hsl(270 50% 60%)' }} />
                  <span className="text-[10px] font-mono tracking-wider" style={{ color: complexityScore.isMasterConductor ? 'hsl(45 80% 60%)' : 'hsl(270 50% 60%)' }}>
                    JAZZ VOICING COMPLEXITY
                  </span>
                </div>
                {complexityScore.isMasterConductor && (
                  <motion.div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ 
                      background: 'linear-gradient(135deg, hsl(45 70% 45%), hsl(35 60% 35%))',
                      border: '2px solid hsl(45 90% 60%)',
                      boxShadow: '0 0 20px hsl(45 80% 50% / 0.5)',
                    }}
                    animate={{
                      boxShadow: [
                        '0 0 15px hsl(45 80% 50% / 0.4)',
                        '0 0 25px hsl(45 80% 55% / 0.6)',
                        '0 0 15px hsl(45 80% 50% / 0.4)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-4 h-4" style={{ color: 'hsl(45 100% 90%)' }} />
                    <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: 'hsl(45 100% 95%)' }}>
                      MASTER CONDUCTOR
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Complexity Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold" style={{ color: complexityScore.isMasterConductor ? 'hsl(45 80% 65%)' : 'hsl(270 50% 65%)' }}>
                    {complexityScore.label}
                  </span>
                  <span className="text-sm font-mono font-bold" style={{ color: complexityScore.isMasterConductor ? 'hsl(45 90% 65%)' : 'hsl(0 0% 60%)' }}>
                    {complexityScore.percentage}%
                  </span>
                </div>
                <div 
                  className="h-3 rounded-full overflow-hidden"
                  style={{ background: 'hsl(0 0% 15%)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${complexityScore.percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      background: complexityScore.isMasterConductor
                        ? 'linear-gradient(90deg, hsl(45 70% 50%), hsl(35 80% 55%))'
                        : complexityScore.level === 'seventh'
                          ? 'linear-gradient(90deg, hsl(270 50% 50%), hsl(280 60% 55%))'
                          : complexityScore.level === 'triad'
                            ? 'linear-gradient(90deg, hsl(120 40% 45%), hsl(90 50% 50%))'
                            : 'linear-gradient(90deg, hsl(0 0% 40%), hsl(0 0% 50%))',
                    }}
                  />
                </div>

                {/* Complexity Breakdown */}
                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px dashed hsl(0 0% 20%)' }}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>GROUND:</span>
                      <span className="text-[10px] font-mono font-bold" style={{ color: isCompleteChord ? 'hsl(120 50% 55%)' : 'hsl(0 0% 55%)' }}>
                        {Object.values(chordStatus).filter(Boolean).length}/4
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>OVERLAYS:</span>
                      <span className="text-[10px] font-mono font-bold" style={{ color: (has11thInterval && has13thInterval) ? 'hsl(90 50% 55%)' : 'hsl(0 0% 55%)' }}>
                        {[has11thInterval, has13thInterval].filter(Boolean).length}/2
                      </span>
                    </div>
                  </div>
                </div>

                {/* Overlay Explanation */}
                <p className="text-[9px] font-mono pt-1" style={{ color: 'hsl(0 0% 40%)' }}>
                  11th & 13th are biological overlays — they add to yield without subtracting ground space.
                </p>
              </div>
            </div>
          </div>

          {/* 11th Interval - Fungal Network */}
          {(() => {
            const zoneRec = getZoneRecommendation(bed.frequency_hz);
            return (
              <div className="px-4 pb-4">
                <div 
                  className="p-3 rounded-xl space-y-3"
                  style={{ 
                    background: has11thInterval 
                      ? 'linear-gradient(135deg, hsl(180 30% 12%), hsl(180 20% 8%))'
                      : 'hsl(0 0% 8%)', 
                    border: has11thInterval 
                      ? '2px solid hsl(180 50% 40%)'
                      : '1px solid hsl(0 0% 18%)',
                    boxShadow: has11thInterval ? '0 0 20px hsl(180 50% 30% / 0.3)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={has11thInterval ? { 
                          scale: [1, 1.15, 1],
                          opacity: [0.8, 1, 0.8],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Network className="w-4 h-4" style={{ color: has11thInterval ? 'hsl(180 60% 55%)' : 'hsl(0 0% 40%)' }} />
                      </motion.div>
                      <span className="text-[10px] font-mono tracking-wider" style={{ color: has11thInterval ? 'hsl(180 60% 55%)' : 'hsl(0 0% 45%)' }}>
                        11th INTERVAL • FUNGAL NETWORK
                      </span>
                    </div>
                    {has11thInterval && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                        style={{ background: 'hsl(180 50% 20%)', border: '1px solid hsl(180 50% 40%)' }}
                      >
                        <span className="text-[9px] font-mono font-bold" style={{ color: 'hsl(180 60% 60%)' }}>
                          NETWORK ACTIVE
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Zone-Specific Recommendation */}
                  {zoneRec && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 p-2 rounded-lg cursor-help"
                            style={{ 
                              background: `${zoneRec.zoneColor}10`, 
                              border: `1px dashed ${zoneRec.zoneColor}50`,
                            }}
                          >
                            <Lightbulb className="w-3.5 h-3.5" style={{ color: zoneRec.zoneColor }} />
                            <div className="flex-1">
                              <span className="text-[10px] font-mono block" style={{ color: zoneRec.zoneColor }}>
                                RECOMMENDED: {zoneRec.eleventh.name}
                              </span>
                              <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                                {zoneRec.eleventh.description}
                              </span>
                            </div>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="top" 
                          className="max-w-xs p-3"
                          style={{ 
                            background: 'hsl(0 0% 10%)', 
                            border: `1px solid ${zoneRec.zoneColor}`,
                          }}
                        >
                          <p className="text-xs font-mono" style={{ color: zoneRec.zoneColor }}>
                            🎷 WHY IT PLAYS JAZZ
                          </p>
                          <p className="text-[11px] mt-1" style={{ color: 'hsl(0 0% 70%)' }}>
                            {zoneRec.jazzRationale}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                      INOCULANT TYPE:
                    </span>
                    <Select
                      value={bed.inoculant_type || 'none'}
                      onValueChange={handleInoculantChange}
                      disabled={!isAdmin}
                    >
                      <SelectTrigger 
                        className="w-40 h-8 text-xs font-mono"
                        style={{ 
                          background: 'hsl(0 0% 10%)', 
                          border: '1px solid hsl(180 30% 30%)',
                          color: has11thInterval ? 'hsl(180 60% 60%)' : 'hsl(0 0% 60%)',
                        }}
                      >
                        <SelectValue placeholder="Select inoculant" />
                      </SelectTrigger>
                      <SelectContent 
                        className="z-[100]"
                        style={{ 
                          background: 'hsl(0 0% 10%)', 
                          border: '1px solid hsl(180 30% 30%)',
                        }}
                      >
                        <SelectItem value="none" className="text-xs font-mono" style={{ color: 'hsl(0 0% 60%)' }}>
                          None
                        </SelectItem>
                        {INOCULANT_OPTIONS.map((type) => (
                          <SelectItem 
                            key={type} 
                            value={type!} 
                            className="text-xs font-mono"
                            style={{ color: 'hsl(180 60% 60%)' }}
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Water Reduction Display */}
                  {has11thInterval && chordStatus['Root (Lead)'] && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 mt-2"
                    >
                      <Droplets className="w-4 h-4" style={{ color: 'hsl(200 70% 55%)' }} />
                      <span className="text-[10px] font-mono" style={{ color: 'hsl(200 70% 55%)' }}>
                        WATER EFFICIENCY: <span className="font-bold">-10%</span> (Fungal Retention)
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 13th Interval - Aerial Signal (Overstory Layer) */}
          {(() => {
            const zoneRec = getZoneRecommendation(bed.frequency_hz);
            return (
              <div className="px-4 pb-4">
                <div 
                  className="p-3 rounded-xl space-y-3"
                  style={{ 
                    background: has13thInterval 
                      ? 'linear-gradient(135deg, hsl(90 30% 12%), hsl(90 20% 8%))'
                      : 'hsl(0 0% 8%)', 
                    border: has13thInterval 
                      ? '2px solid hsl(90 50% 40%)'
                      : '1px solid hsl(0 0% 18%)',
                    boxShadow: has13thInterval ? '0 0 20px hsl(90 50% 30% / 0.3)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={has13thInterval ? { 
                          y: [-2, 2, -2],
                          opacity: [0.7, 1, 0.7],
                        } : {}}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <TreeDeciduous className="w-4 h-4" style={{ color: has13thInterval ? 'hsl(90 60% 55%)' : 'hsl(0 0% 40%)' }} />
                      </motion.div>
                      <span className="text-[10px] font-mono tracking-wider" style={{ color: has13thInterval ? 'hsl(90 60% 55%)' : 'hsl(0 0% 45%)' }}>
                        13th INTERVAL • AERIAL SIGNAL
                      </span>
                    </div>
                    {has13thInterval && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, y: [-1, 1, -1] }}
                        transition={{ y: { duration: 2, repeat: Infinity } }}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                        style={{ background: 'hsl(90 40% 20%)', border: '1px solid hsl(90 50% 40%)' }}
                      >
                        <span className="text-[9px] font-mono font-bold" style={{ color: 'hsl(90 60% 60%)' }}>
                          OVERSTORY ACTIVE
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Zone-Specific Recommendation */}
                  {zoneRec && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 p-2 rounded-lg cursor-help"
                            style={{ 
                              background: `${zoneRec.zoneColor}10`, 
                              border: `1px dashed ${zoneRec.zoneColor}50`,
                            }}
                          >
                            <Lightbulb className="w-3.5 h-3.5" style={{ color: zoneRec.zoneColor }} />
                            <div className="flex-1">
                              <span className="text-[10px] font-mono block" style={{ color: zoneRec.zoneColor }}>
                                RECOMMENDED: {zoneRec.thirteenth.name}
                              </span>
                              <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                                {zoneRec.thirteenth.description}
                              </span>
                            </div>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="top" 
                          className="max-w-xs p-3"
                          style={{ 
                            background: 'hsl(0 0% 10%)', 
                            border: `1px solid ${zoneRec.zoneColor}`,
                          }}
                        >
                          <p className="text-xs font-mono" style={{ color: zoneRec.zoneColor }}>
                            🎷 WHY IT PLAYS JAZZ
                          </p>
                          <p className="text-[11px] mt-1" style={{ color: 'hsl(0 0% 70%)' }}>
                            {zoneRec.jazzRationale}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                      AERIAL CROP:
                    </span>
                    <Select
                      value={bed.aerial_crop_id || 'none'}
                      onValueChange={handleAerialCropChange}
                      disabled={!isAdmin}
                    >
                      <SelectTrigger 
                        className="w-44 h-8 text-xs font-mono"
                        style={{ 
                          background: 'hsl(0 0% 10%)', 
                          border: '1px solid hsl(90 30% 30%)',
                          color: has13thInterval ? 'hsl(90 60% 60%)' : 'hsl(0 0% 60%)',
                        }}
                      >
                        <SelectValue placeholder="Select aerial crop" />
                      </SelectTrigger>
                      <SelectContent 
                        className="z-[100] max-h-60"
                        style={{ 
                          background: 'hsl(0 0% 10%)', 
                          border: '1px solid hsl(90 30% 30%)',
                        }}
                      >
                        <SelectItem value="none" className="text-xs font-mono" style={{ color: 'hsl(0 0% 60%)' }}>
                          None
                        </SelectItem>
                        {allCrops.map((crop) => (
                          <SelectItem 
                            key={crop.id} 
                            value={crop.id} 
                            className="text-xs font-mono"
                            style={{ color: 'hsl(90 60% 60%)' }}
                          >
                            {crop.name} {crop.common_name ? `(${crop.common_name})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Spacing Info */}
                  {has13thInterval && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between mt-2 pt-2"
                      style={{ borderTop: '1px dashed hsl(90 30% 25%)' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono" style={{ color: 'hsl(90 50% 50%)' }}>
                          SCATTERED PATTERN
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                          1 per 100 sq ft →
                        </span>
                        <span 
                          className="px-2 py-0.5 rounded font-mono text-xs font-bold"
                          style={{ background: 'hsl(90 40% 20%)', color: 'hsl(90 60% 60%)' }}
                        >
                          {AERIAL_PLANT_COUNT} plants
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Current Aerial Crop Display */}
                  {bed.aerial_crop && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 mt-2 p-2 rounded-lg"
                      style={{ background: 'hsl(90 30% 15%)', border: '1px solid hsl(90 40% 30%)' }}
                    >
                      <TreeDeciduous className="w-4 h-4" style={{ color: 'hsl(90 60% 55%)' }} />
                      <div className="flex-1">
                        <span className="text-xs font-mono block" style={{ color: 'hsl(90 60% 65%)' }}>
                          {bed.aerial_crop.name}
                        </span>
                        {bed.aerial_crop.common_name && (
                          <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                            {bed.aerial_crop.common_name}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 5th Bonus & 7th Mask Indicators */}
          {(has5thBonus || hasPestMasking) && (
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              {has5thBonus && (
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: 'hsl(35 50% 15%)', border: '1px solid hsl(35 70% 45%)' }}
                >
                  <Pickaxe className="w-3.5 h-3.5" style={{ color: 'hsl(35 70% 55%)' }} />
                  <span className="text-[10px] font-mono font-bold" style={{ color: 'hsl(35 70% 55%)' }}>
                    5th BONUS: +15% Brix
                  </span>
                </div>
              )}
              {hasPestMasking && (
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: 'hsl(270 30% 15%)', border: '1px solid hsl(270 50% 50%)' }}
                >
                  <Shield className="w-3.5 h-3.5" style={{ color: 'hsl(270 50% 60%)' }} />
                  <span className="text-[10px] font-mono font-bold" style={{ color: 'hsl(270 50% 60%)' }}>
                    PEST MASKING
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Brix Section with Projection & Calibration Guardrail */}
          <div className="px-4 pb-4 space-y-3">
            {/* Brix Status Badge */}
            {baseBrix > 0 && (
              <div className="flex items-center gap-2">
                <motion.div
                  className="px-3 py-1.5 rounded-full flex items-center gap-2"
                  style={{
                    background: baseBrix >= 18 ? 'hsl(45 80% 50% / 0.15)' : baseBrix >= 12 ? 'hsl(120 50% 45% / 0.15)' : 'hsl(0 60% 50% / 0.15)',
                    border: `1px solid ${baseBrix >= 18 ? 'hsl(45 80% 55%)' : baseBrix >= 12 ? 'hsl(120 50% 50%)' : 'hsl(0 60% 55%)'}`,
                  }}
                  animate={baseBrix < 12 ? { opacity: [0.7, 1, 0.7] } : {}}
                  transition={{ duration: 1, repeat: baseBrix < 12 ? Infinity : 0 }}
                >
                  <span className="text-[10px] font-mono font-bold tracking-wider" style={{
                    color: baseBrix >= 18 ? 'hsl(45 90% 65%)' : baseBrix >= 12 ? 'hsl(120 60% 55%)' : 'hsl(0 65% 60%)',
                  }}>
                    {baseBrix >= 18 ? '✦ HIGH FIDELITY' : baseBrix >= 12 ? '♪ IN TUNE' : '⚠ DISSONANT'}
                  </span>
                </motion.div>
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: 'hsl(45 80% 60%)' }}>
                  NIR BRIX READING:
                </span>
                <Input
                  type="number"
                  value={brixInput}
                  onChange={(e) => setBrixInput(e.target.value)}
                  className="w-20 h-8 text-center font-mono text-sm rounded-lg"
                  style={{ 
                    background: 'hsl(0 0% 8%)', 
                    border: '1px solid hsl(45 50% 30%)',
                    color: 'hsl(45 80% 65%)',
                  }}
                  placeholder="—"
                  min={0}
                  max={24}
                />
              </div>
              {has5thBonus && baseBrix > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>→</span>
                  <span className="text-sm font-mono font-bold" style={{ color: 'hsl(120 60% 50%)' }}>
                    {projectedBrix}°
                  </span>
                  <span className="text-[9px] font-mono" style={{ color: 'hsl(35 70% 55%)' }}>(projected)</span>
                </div>
              )}
              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                {baseBrix >= 18 ? '18-24 = High Fidelity' : baseBrix >= 12 ? '12-17 = In Tune' : '<12 = Dissonant'}
              </span>
            </div>

            {/* White Reference Calibration Guardrail */}
            <div 
              className="p-3 rounded-xl space-y-2"
              style={{
                background: whiteRefCalibrated ? 'hsl(120 30% 8%)' : 'hsl(0 0% 8%)',
                border: `1px solid ${whiteRefCalibrated ? 'hsl(120 40% 30%)' : 'hsl(0 0% 18%)'}`,
              }}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id="white-ref"
                  checked={whiteRefCalibrated}
                  onCheckedChange={(checked) => setWhiteRefCalibrated(checked === true)}
                  className="border-amber-600 data-[state=checked]:bg-amber-600"
                />
                <label htmlFor="white-ref" className="text-[10px] font-mono tracking-wider cursor-pointer" style={{ color: whiteRefCalibrated ? 'hsl(120 50% 55%)' : 'hsl(45 60% 55%)' }}>
                  WHITE REFERENCE CALIBRATED
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle className="w-3.5 h-3.5 cursor-help" style={{ color: 'hsl(45 70% 55%)' }} />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px] text-xs">
                      The 5th Agreement requires precision calibration before data entry. Calibrate your refractometer with distilled water before logging.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <motion.button
                className="w-full py-2 px-4 rounded-lg font-mono text-xs font-bold tracking-wider"
                style={{
                  background: whiteRefCalibrated ? 'hsl(120 40% 25%)' : 'hsl(0 0% 15%)',
                  border: `1px solid ${whiteRefCalibrated ? 'hsl(120 50% 40%)' : 'hsl(0 0% 25%)'}`,
                  color: whiteRefCalibrated ? 'hsl(120 60% 70%)' : 'hsl(0 0% 35%)',
                  cursor: whiteRefCalibrated ? 'pointer' : 'not-allowed',
                  opacity: whiteRefCalibrated ? 1 : 0.5,
                }}
                disabled={!whiteRefCalibrated}
                whileHover={whiteRefCalibrated ? { scale: 1.02 } : {}}
                whileTap={whiteRefCalibrated ? { scale: 0.98 } : {}}
                onClick={handleUpdateBrix}
              >
                {whiteRefCalibrated ? 'SAVE BRIX READING' : '⚠ CALIBRATE FIRST TO SAVE'}
              </motion.button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>RISK LEVEL:</span>
              <div 
                className="px-2 py-0.5 rounded"
                style={{
                  background: hasPestMasking ? 'hsl(120 40% 15%)' : baseBrix >= 12 ? 'hsl(120 30% 15%)' : 'hsl(0 40% 15%)',
                  border: `1px solid ${hasPestMasking ? 'hsl(120 50% 40%)' : baseBrix >= 12 ? 'hsl(120 40% 40%)' : 'hsl(0 50% 45%)'}`,
                }}
              >
                <span 
                  className="text-[10px] font-mono font-bold"
                  style={{ color: hasPestMasking ? 'hsl(120 50% 50%)' : baseBrix >= 18 ? 'hsl(45 80% 55%)' : baseBrix >= 12 ? 'hsl(120 50% 50%)' : 'hsl(0 60% 55%)' }}
                >
                  {hasPestMasking ? 'LOW (Masked)' : baseBrix >= 18 ? 'HIGH FIDELITY' : baseBrix >= 12 ? 'IN TUNE' : 'DISSONANT'}
                </span>
              </div>
            </div>
          </div>

          {/* Smart Suggestions */}
          <AnimatePresence>
            {showSmartSuggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4"
              >
                <div 
                  className="p-3 rounded-xl space-y-2"
                  style={{ background: `linear-gradient(135deg, ${bed.zone_color}10, hsl(0 0% 8%))`, border: `1px dashed ${bed.zone_color}40` }}
                >
                  <span className="text-[10px] font-mono tracking-wider" style={{ color: bed.zone_color }}>
                    ♪ COMPLETE YOUR CHORD
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {missingIntervals.map((interval) => {
                      const Icon = getIntervalIcon(interval);
                      const color = getIntervalColor(interval);
                      const label = getIntervalLabel(interval);
                      const desc = getIntervalDescription(interval);
                      
                      return (
                        <motion.button
                          key={interval}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{ background: `${color}15`, border: `1px solid ${color}50` }}
                          whileHover={{ scale: 1.02, borderColor: color }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSuggestionClick(interval)}
                        >
                          <Icon className="w-4 h-4" style={{ color }} />
                          <div className="text-left">
                            <span className="text-[11px] font-mono font-bold block" style={{ color }}>
                              Add {label}
                            </span>
                            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                              {desc}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Plantings */}
          <div className="px-4 pb-4 space-y-2">
            <span className="text-xs font-mono tracking-wider" style={{ color: 'hsl(0 0% 55%)' }}>
              CURRENT PLANTINGS
            </span>
            
            {plantings.length === 0 ? (
              <p className="text-[11px] font-mono py-2" style={{ color: 'hsl(0 0% 40%)' }}>
                No crops planted yet
              </p>
            ) : (
              <div className="space-y-2">
                {plantings.map((planting) => {
                  const interval = planting.crop?.chord_interval || planting.guild_role;
                  const Icon = getIntervalIcon(interval);
                  const color = getIntervalColor(interval);
                  
                  return (
                    <div
                      key={planting.id}
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 15%)' }}
                    >
                      <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-mono block truncate" style={{ color: 'hsl(0 0% 75%)' }}>
                          {planting.crop?.name || 'Unknown'}
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                          {planting.plant_count} plants • {getIntervalLabel(interval)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemovePlanting(planting)}
                        className="p-1.5 rounded hover:bg-destructive/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" style={{ color: 'hsl(0 50% 50%)' }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Crop Section */}
          <div className="px-4 pb-4">
            {!isAddingCrop ? (
              <motion.button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg"
                style={{ background: `${bed.zone_color}15`, border: `1px dashed ${bed.zone_color}50` }}
                whileHover={{ borderStyle: 'solid' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddingCrop(true)}
              >
                <Plus className="w-4 h-4" style={{ color: bed.zone_color }} />
                <span className="text-xs font-mono" style={{ color: bed.zone_color }}>Add Crop</span>
              </motion.button>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-1">
                  {CHORD_INTERVALS.map((interval) => {
                    const label = getIntervalLabel(interval);
                    const color = getIntervalColor(interval);
                    return (
                      <button
                        key={interval}
                        onClick={() => setSelectedInterval(interval)}
                        className="flex-1 py-1.5 rounded text-[10px] font-mono transition-all"
                        style={{
                          background: selectedInterval === interval ? `${color}30` : 'hsl(0 0% 10%)',
                          border: `1px solid ${selectedInterval === interval ? color : 'hsl(0 0% 20%)'}`,
                          color: selectedInterval === interval ? color : 'hsl(0 0% 50%)',
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1 scrollbar-thin">
                  {cropsLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: bed.zone_color }} />
                    </div>
                  ) : frequencyMatchedCrops.length === 0 ? (
                    <div className="flex items-center gap-2 py-3">
                      <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(45 70% 50%)' }} />
                      <span className="text-[11px] font-mono" style={{ color: 'hsl(45 70% 50%)' }}>
                        No {bed.frequency_hz}Hz {getIntervalLabel(selectedInterval)} crops in library
                      </span>
                    </div>
                  ) : (
                    frequencyMatchedCrops.map((crop) => {
                      const plantCount = calculatePlantCount(crop.spacing_inches);
                      const alreadyPlanted = plantings.some(p => p.crop_id === crop.id);
                      
                      return (
                        <button
                          key={crop.id}
                          disabled={alreadyPlanted}
                          onClick={() => handleAddCrop(crop)}
                          className="w-full flex items-center justify-between p-2 rounded-lg transition-all disabled:opacity-40"
                          style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)' }}
                        >
                          <div className="text-left">
                            <span className="text-xs font-mono block" style={{ color: 'hsl(0 0% 70%)' }}>
                              {crop.name}
                            </span>
                            <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                              {crop.spacing_inches}" spacing
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold" style={{ color: bed.zone_color }}>
                              {plantCount}
                            </span>
                            <span className="text-[10px] font-mono block" style={{ color: 'hsl(0 0% 45%)' }}>
                              plants
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                <button
                  onClick={() => setIsAddingCrop(false)}
                  className="w-full py-2 text-xs font-mono rounded-lg"
                  style={{ background: 'hsl(0 0% 12%)', color: 'hsl(0 0% 50%)' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Master Mix Note */}
      <div className="px-4 pb-4">
        <div 
          className="p-3 rounded-lg"
          style={{ background: 'hsl(35 30% 10%)', border: '1px solid hsl(35 40% 25%)' }}
        >
          <p className="text-[10px] font-mono" style={{ color: 'hsl(35 50% 60%)' }}>
            📋 {bed.notes || 'Apply 5-Quart Master Mix Reset before planting.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BedDetailPanel;