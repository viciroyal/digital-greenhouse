import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Check, AlertTriangle, Leaf, Shield, 
  Pickaxe, Sparkles, Music, Loader2, Trash2, Zap 
} from 'lucide-react';
import { GardenBed, BedPlanting, calculatePlantCount, useAddPlanting, useRemovePlanting, useUpdateBedBrix, ChordInterval, CHORD_INTERVALS } from '@/hooks/useGardenBeds';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface BedDetailPanelProps {
  bed: GardenBed;
  plantings: BedPlanting[];
  isAdmin: boolean;
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

const BedDetailPanel = ({ bed, plantings, isAdmin, onClose }: BedDetailPanelProps) => {
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<ChordInterval>('Root (Lead)');
  const [brixInput, setBrixInput] = useState(bed.internal_brix?.toString() || '');
  
  const { data: allCrops = [], isLoading: cropsLoading } = useMasterCrops();
  const addPlanting = useAddPlanting();
  const removePlanting = useRemovePlanting();
  const updateBrix = useUpdateBedBrix();

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

  // Get chord name and vitality note for member view
  const chordName = getChordName(bed.frequency_hz);
  const vitalityNote = getVitalityNote(isCompleteChord, has5thBonus, bed.internal_brix);

  // Get missing intervals for smart suggestions
  const missingIntervals = CHORD_INTERVALS.filter(interval => !chordStatus[interval]);

  // Smart suggestion: When Root is planted, show 5th and 7th suggestions
  const showSmartSuggestions = chordStatus['Root (Lead)'] && !isCompleteChord && isAdmin && !isAddingCrop;

  const handleAddCrop = async (crop: MasterCrop) => {
    if (!isAdmin) {
      toast.error('Only admins can add crops');
      return;
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
    } catch (error) {
      toast.error('Failed to add crop');
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

      {/* ADMIN VIEW: Full Chord Conductor */}
      {isAdmin && (
        <>
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

          {/* Brix Section with Projection */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: 'hsl(45 80% 60%)' }}>
                  INTERNAL BRIX:
                </span>
                <Input
                  type="number"
                  value={brixInput}
                  onChange={(e) => setBrixInput(e.target.value)}
                  onBlur={handleUpdateBrix}
                  className="w-20 h-8 text-center font-mono text-sm rounded-lg"
                  style={{ 
                    background: 'hsl(0 0% 8%)', 
                    border: '1px solid hsl(45 50% 30%)',
                    color: 'hsl(45 80% 65%)',
                  }}
                  placeholder="—"
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
              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>Target: 15+</span>
            </div>
            
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>RISK LEVEL:</span>
              <div 
                className="px-2 py-0.5 rounded"
                style={{
                  background: hasPestMasking ? 'hsl(120 40% 15%)' : baseBrix >= 15 ? 'hsl(45 50% 15%)' : 'hsl(0 40% 15%)',
                  border: `1px solid ${hasPestMasking ? 'hsl(120 50% 40%)' : baseBrix >= 15 ? 'hsl(45 60% 45%)' : 'hsl(0 50% 45%)'}`,
                }}
              >
                <span 
                  className="text-[10px] font-mono font-bold"
                  style={{ color: hasPestMasking ? 'hsl(120 50% 50%)' : baseBrix >= 15 ? 'hsl(45 70% 55%)' : 'hsl(0 60% 55%)' }}
                >
                  {hasPestMasking ? 'LOW (Masked)' : baseBrix >= 15 ? 'MODERATE' : 'ELEVATED'}
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