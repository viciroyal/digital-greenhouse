import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Plus, Check, Crown, Leaf, Sparkles, Pickaxe, Zap, X, ChevronDown, Lock, CalendarDays, Users, Wand2, Loader2 } from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import {
  useGardenBeds, useAllBedPlantings, useAddPlanting, useRemovePlanting,
  type GardenBed, type BedPlanting, type ComplexityScore,
  calculateComplexityScore, type ChordInterval, CHORD_INTERVALS,
} from '@/hooks/useGardenBeds';
import { useAdminRole } from '@/hooks/useAdminRole';
import type { MasterCrop } from '@/hooks/useMasterCrops';
import { CHORD_RECIPES } from '@/data/chordRecipes';
import { CSA_PHASES, getCurrentPhase } from '@/components/master-build/SeasonalMovements';
import { toast } from 'sonner';

/* ─── Constants ─── */
const ZONE_COLORS: Record<number, string> = {
  396: '#FF0000', 417: '#FF7F00', 528: '#FFFF00',
  639: '#00FF00', 741: '#0000FF', 852: '#4B0082', 963: '#8B00FF',
};

const NOTE_MAP: Record<number, string> = {
  396: 'C', 417: 'D', 528: 'E', 639: 'F', 741: 'G', 852: 'A', 963: 'B',
};

const FREQ_TO_ZONE: Record<number, number> = {
  396: 1, 417: 2, 528: 3, 639: 4, 741: 5, 852: 6, 963: 7,
};

const INTERVAL_META: Record<string, { icon: React.ReactNode; shortLabel: string; color: string }> = {
  'Root (Lead)':      { icon: <Leaf className="w-3 h-3" />,     shortLabel: '1st',  color: 'hsl(120 50% 50%)' },
  '3rd (Triad)':      { icon: <Sparkles className="w-3 h-3" />, shortLabel: '3rd',  color: 'hsl(45 80% 55%)' },
  '5th (Stabilizer)': { icon: <Pickaxe className="w-3 h-3" />,  shortLabel: '5th',  color: 'hsl(35 70% 55%)' },
  '7th (Signal)':     { icon: <Zap className="w-3 h-3" />,      shortLabel: '7th',  color: 'hsl(270 50% 60%)' },
};

/** Map chord recipe interval labels to ChordInterval keys */
const RECIPE_INTERVAL_MAP: Record<string, ChordInterval> = {
  '1st': 'Root (Lead)',
  '3rd': '3rd (Triad)',
  '5th': '5th (Stabilizer)',
  '7th': '7th (Signal)',
};

interface SeasonalSuggestion {
  interval: ChordInterval;
  crop: MasterCrop;
  source: 'companion' | 'recipe';
  label: string;
}

interface ChordComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeFrequency: number | null;
  onAssignCrop?: (crop: MasterCrop) => void;
  pendingCrop: MasterCrop | null;
  onClearPending: () => void;
  allCrops?: MasterCrop[];
}

const ChordComposer = ({
  open, onOpenChange, activeFrequency,
  pendingCrop, onClearPending, allCrops,
}: ChordComposerProps) => {
  const { isAdmin } = useAdminRole();
  const { data: beds } = useGardenBeds();
  const { data: allPlantingsMap } = useAllBedPlantings();
  const addPlanting = useAddPlanting();
  const removePlanting = useRemovePlanting();
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [showBedPicker, setShowBedPicker] = useState(false);

  // Filter beds to active frequency zone
  const zoneBeds = useMemo(() => {
    if (!beds || !activeFrequency) return [];
    return beds.filter(b => b.frequency_hz === activeFrequency);
  }, [beds, activeFrequency]);

  // Auto-select first bed or emptiest
  const selectedBed = useMemo(() => {
    if (!zoneBeds.length) return null;
    if (selectedBedId) {
      const found = zoneBeds.find(b => b.id === selectedBedId);
      if (found) return found;
    }
    // Pick bed with fewest plantings
    if (allPlantingsMap) {
      const sorted = [...zoneBeds].sort((a, b) => {
        const aCount = allPlantingsMap[a.id]?.length || 0;
        const bCount = allPlantingsMap[b.id]?.length || 0;
        return aCount - bCount;
      });
      return sorted[0];
    }
    return zoneBeds[0];
  }, [zoneBeds, selectedBedId, allPlantingsMap]);

  // Get plantings for the selected bed
  const bedPlantings = useMemo(() => {
    if (!selectedBed || !allPlantingsMap) return [];
    return allPlantingsMap[selectedBed.id] || [];
  }, [selectedBed, allPlantingsMap]);

  // Build chord status
  const chordStatus = useMemo(() => {
    const status: Record<ChordInterval, BedPlanting | null> = {
      'Root (Lead)': null,
      '3rd (Triad)': null,
      '5th (Stabilizer)': null,
      '7th (Signal)': null,
    };
    for (const p of bedPlantings) {
      const interval = p.crop?.chord_interval as ChordInterval;
      if (interval && interval in status) {
        status[interval] = p;
      }
    }
    return status;
  }, [bedPlantings]);

  const has11th = selectedBed?.inoculant_type !== null && selectedBed?.inoculant_type !== undefined;
  const has13th = selectedBed?.aerial_crop_id !== null && selectedBed?.aerial_crop_id !== undefined;

  const complexityScore: ComplexityScore = useMemo(() => {
    const boolStatus: Record<ChordInterval, boolean> = {
      'Root (Lead)': !!chordStatus['Root (Lead)'],
      '3rd (Triad)': !!chordStatus['3rd (Triad)'],
      '5th (Stabilizer)': !!chordStatus['5th (Stabilizer)'],
      '7th (Signal)': !!chordStatus['7th (Signal)'],
    };
    return calculateComplexityScore(boolStatus, has11th, has13th);
  }, [chordStatus, has11th, has13th]);

  const zoneColor = activeFrequency ? ZONE_COLORS[activeFrequency] || '#888' : '#888';
  const note = activeFrequency ? NOTE_MAP[activeFrequency] || '?' : '?';

  // ─── Seasonal Picks Logic ───
  const currentPhase = useMemo(() => getCurrentPhase(), []);
  const zoneNum = activeFrequency ? FREQ_TO_ZONE[activeFrequency] : null;
  const isInSeason = currentPhase && zoneNum ? currentPhase.zones.includes(zoneNum) : false;

  const seasonalSuggestions = useMemo((): SeasonalSuggestion[] => {
    if (!activeFrequency || !allCrops || !selectedBed) return [];
    const suggestions: SeasonalSuggestion[] = [];
    const emptyIntervals = CHORD_INTERVALS.filter(iv => !chordStatus[iv]);
    if (emptyIntervals.length === 0) return [];

    const bedWidthInches = (selectedBed.bed_width_ft || 4) * 12;

    // Helper: check if a crop's spacing fits the bed width
    const fitsInBed = (crop: MasterCrop): boolean => {
      const spacing = parseFloat(crop.spacing_inches || '0');
      return spacing > 0 && spacing <= bedWidthInches;
    };

    // Get the Root crop's companion list (if Root is filled)
    const rootPlanting = chordStatus['Root (Lead)'];
    const rootCropData = rootPlanting?.crop;
    const rootFullCrop = rootCropData
      ? allCrops.find(c => c.id === rootCropData.id)
      : null;
    const companionNames = rootFullCrop?.companion_crops || [];

    // Get the chord recipe for this zone
    const recipe = CHORD_RECIPES.find(r => r.frequencyHz === activeFrequency);

    for (const interval of emptyIntervals) {
      let found: MasterCrop | undefined;
      let source: 'companion' | 'recipe' = 'companion';

      // 1. Try companion guild first (must fit bed width)
      if (companionNames.length > 0) {
        for (const name of companionNames) {
          const match = allCrops.find(c =>
            (c.common_name?.toLowerCase() === name.toLowerCase() ||
             c.name.toLowerCase() === name.toLowerCase()) &&
            c.chord_interval === interval &&
            fitsInBed(c)
          );
          if (match) { found = match; break; }
        }
      }

      // 2. Fallback to chord recipe (must fit bed width)
      if (!found && recipe) {
        const recipeInterval = recipe.intervals.find(
          ri => RECIPE_INTERVAL_MAP[ri.interval] === interval
        );
        if (recipeInterval) {
          const recipeMatch = allCrops.find(c =>
            (c.common_name?.toLowerCase() === recipeInterval.cropName.toLowerCase() ||
            c.name.toLowerCase() === recipeInterval.cropName.toLowerCase()) &&
            fitsInBed(c)
          );
          if (recipeMatch) {
            found = recipeMatch;
            source = 'recipe';
          }
        }
      }

      if (found) {
        suggestions.push({
          interval,
          crop: found,
          source,
          label: source === 'companion'
            ? `From ${rootFullCrop?.common_name || rootFullCrop?.name}'s guild`
            : `From ${recipe?.chordName || 'Recipe'}`,
        });
      }
    }
    return suggestions;
  }, [activeFrequency, allCrops, selectedBed, chordStatus]);

  const handleAssign = () => {
    if (!pendingCrop || !selectedBed || !isAdmin) return;
    const interval = pendingCrop.chord_interval as ChordInterval;
    if (!interval || !(interval in chordStatus)) {
      toast.error('This crop has no chord interval assignment.');
      onClearPending();
      return;
    }
    if (chordStatus[interval]) {
      toast.error(`${interval} slot is already filled. Remove the existing crop first.`);
      onClearPending();
      return;
    }

    const bedL = selectedBed.bed_length_ft || 60;
    const bedW = selectedBed.bed_width_ft || 4;
    const plantCount = pendingCrop.spacing_inches
      ? Math.floor((bedL * 12 * bedW * 12) / (parseFloat(pendingCrop.spacing_inches) ** 2 * 0.866)) || 1
      : 1;

    addPlanting.mutate({
      bedId: selectedBed.id,
      cropId: pendingCrop.id,
      guildRole: pendingCrop.guild_role || 'Lead',
      plantCount,
    }, {
      onSuccess: () => {
        toast.success(`${pendingCrop.common_name || pendingCrop.name} → ${interval}`);
        onClearPending();
      },
      onError: (err) => {
        toast.error(`Failed: ${(err as Error).message}`);
      },
    });
  };

  const handleRemove = (planting: BedPlanting) => {
    if (!selectedBed || !isAdmin) return;
    removePlanting.mutate({ plantingId: planting.id, bedId: selectedBed.id }, {
      onSuccess: () => toast.success(`Removed ${planting.crop?.common_name || planting.crop?.name}`),
    });
  };

  const handleSuggestionAssign = (suggestion: SeasonalSuggestion) => {
    if (!selectedBed || !isAdmin) return;
    const bedL = selectedBed.bed_length_ft || 60;
    const bedW = selectedBed.bed_width_ft || 4;
    const plantCount = suggestion.crop.spacing_inches
      ? Math.floor((bedL * 12 * bedW * 12) / (parseFloat(suggestion.crop.spacing_inches) ** 2 * 0.866)) || 1
      : 1;
    addPlanting.mutate({
      bedId: selectedBed.id,
      cropId: suggestion.crop.id,
      guildRole: suggestion.crop.guild_role || 'Lead',
      plantCount,
    }, {
      onSuccess: () => toast.success(`${suggestion.crop.common_name || suggestion.crop.name} → ${suggestion.interval}`),
      onError: (err) => toast.error(`Failed: ${(err as Error).message}`),
    });
  };

  const [autoComposing, setAutoComposing] = useState(false);

  const handleAutoComposeAll = async () => {
    if (!selectedBed || !isAdmin || seasonalSuggestions.length === 0) return;
    setAutoComposing(true);
    const bedL = selectedBed.bed_length_ft || 60;
    const bedW = selectedBed.bed_width_ft || 4;
    let successCount = 0;

    for (const suggestion of seasonalSuggestions) {
      const plantCount = suggestion.crop.spacing_inches
        ? Math.floor((bedL * 12 * bedW * 12) / (parseFloat(suggestion.crop.spacing_inches) ** 2 * 0.866)) || 1
        : 1;
      try {
        await addPlanting.mutateAsync({
          bedId: selectedBed.id,
          cropId: suggestion.crop.id,
          guildRole: suggestion.crop.guild_role || 'Lead',
          plantCount,
        });
        successCount++;
      } catch {
        // skip failed slots
      }
    }
    setAutoComposing(false);
    if (successCount > 0) {
      toast.success(`🎵 Auto-Composed ${successCount} slot${successCount > 1 ? 's' : ''}`);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[340px] sm:w-[380px] p-0 overflow-y-auto"
        style={{
          background: 'hsl(0 0% 4%)',
          borderLeft: `2px solid ${zoneColor}40`,
        }}
      >
        <SheetHeader className="p-4 pb-2" style={{ borderBottom: `1px solid ${zoneColor}20` }}>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5" style={{ color: zoneColor }} />
            <SheetTitle className="text-sm font-mono font-bold tracking-wider" style={{ color: zoneColor }}>
              CHORD COMPOSER
            </SheetTitle>
            {!isAdmin && (
              <span className="ml-auto flex items-center gap-1 text-[8px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: 'hsl(0 0% 10%)', color: 'hsl(0 0% 45%)', border: '1px solid hsl(0 0% 15%)' }}>
                <Lock className="w-2.5 h-2.5" /> VIEW ONLY
              </span>
            )}
          </div>
          <SheetDescription className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
            {isAdmin
              ? `Build a chord for ${note}/${activeFrequency}Hz beds`
              : `Viewing chord status for ${note}/${activeFrequency}Hz beds`
            }
          </SheetDescription>
        </SheetHeader>

        <div className="p-4 space-y-4">
          {/* ─── Bed Picker ─── */}
          <div>
            <span className="text-[8px] font-mono tracking-wider block mb-1.5" style={{ color: 'hsl(0 0% 35%)' }}>
              SELECT BED
            </span>
            <button
              onClick={() => setShowBedPicker(!showBedPicker)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left"
              style={{
                background: `${zoneColor}10`,
                border: `1px solid ${zoneColor}30`,
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ background: zoneColor, boxShadow: `0 0 6px ${zoneColor}60` }} />
                <span className="text-xs font-mono font-bold" style={{ color: 'hsl(0 0% 80%)' }}>
                {selectedBed ? `Bed ${selectedBed.bed_number}` : 'No beds in zone'}
                </span>
                {selectedBed && (
                  <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                    {selectedBed.zone_name} • {selectedBed.bed_length_ft || 60}×{selectedBed.bed_width_ft || 4}ft
                  </span>
                )}
              </div>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 40%)', transform: showBedPicker ? 'rotate(180deg)' : '' }} />
            </button>
            <AnimatePresence>
              {showBedPicker && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 rounded-lg overflow-hidden" style={{ border: '1px solid hsl(0 0% 12%)', background: 'hsl(0 0% 5%)' }}>
                    {zoneBeds.map(bed => {
                      const plantCount = allPlantingsMap?.[bed.id]?.length || 0;
                      const isSelected = selectedBed?.id === bed.id;
                      return (
                        <button
                          key={bed.id}
                          onClick={() => { setSelectedBedId(bed.id); setShowBedPicker(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left"
                          style={{
                            background: isSelected ? `${zoneColor}15` : 'transparent',
                            borderBottom: '1px solid hsl(0 0% 8%)',
                          }}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ background: zoneColor }} />
                          <span className="text-xs font-mono flex-1" style={{ color: isSelected ? 'hsl(0 0% 85%)' : 'hsl(0 0% 60%)' }}>
                            Bed {bed.bed_number}
                          </span>
                          <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                            {plantCount}/4 slots
                          </span>
                          {isSelected && <Check className="w-3 h-3" style={{ color: zoneColor }} />}
                        </button>
                      );
                    })}
                    {zoneBeds.length === 0 && (
                      <div className="px-3 py-4 text-center">
                        <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                          No beds in this frequency zone
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Complexity Score ─── */}
          {selectedBed && (
            <div className="rounded-xl p-3" style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 12%)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 40%)' }}>
                  VOICING COMPLEXITY
                </span>
                <div className="flex items-center gap-1.5">
                  {complexityScore.isMasterConductor && (
                    <Crown className="w-3.5 h-3.5" style={{ color: 'hsl(45 90% 55%)' }} />
                  )}
                  <span className="text-xs font-mono font-bold" style={{
                    color: complexityScore.percentage >= 80 ? 'hsl(45 90% 55%)'
                      : complexityScore.percentage >= 60 ? 'hsl(120 50% 50%)'
                      : 'hsl(0 0% 50%)',
                  }}>
                    {complexityScore.percentage}% — {complexityScore.label}
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(0 0% 10%)' }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${complexityScore.percentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{
                    background: complexityScore.percentage === 100
                      ? `linear-gradient(90deg, ${zoneColor}, hsl(45 90% 55%))`
                      : zoneColor,
                    boxShadow: `0 0 8px ${zoneColor}60`,
                  }}
                />
              </div>
            </div>
          )}

          {/* ─── Seasonal Picks Banner ─── */}
          {selectedBed && seasonalSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl overflow-hidden"
              style={{
                background: isInSeason
                  ? (currentPhase ? currentPhase.gradient : 'hsl(0 0% 6%)')
                  : 'hsl(0 0% 6%)',
                border: `1px solid ${isInSeason ? (currentPhase?.borderColor || 'hsl(0 0% 12%)') : 'hsl(0 0% 12%)'}`,
              }}
            >
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="w-4 h-4" style={{ color: isInSeason ? (currentPhase?.borderColor || zoneColor) : 'hsl(45 80% 55%)' }} />
                  <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: isInSeason ? (currentPhase?.borderColor || zoneColor) : 'hsl(45 80% 55%)' }}>
                    SEASONAL PICKS
                  </span>
                  {isInSeason && currentPhase && (
                    <motion.span
                      className="text-[7px] font-mono px-1.5 py-0.5 rounded-full ml-auto"
                      style={{
                        background: `${currentPhase.borderColor}20`,
                        border: `1px solid ${currentPhase.borderColor}`,
                        color: currentPhase.borderColor,
                      }}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ● IN SEASON
                    </motion.span>
                  )}
                  {!isInSeason && (
                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded-full ml-auto"
                      style={{ background: 'hsl(0 0% 10%)', color: 'hsl(0 0% 40%)', border: '1px solid hsl(0 0% 15%)' }}>
                      OFF SEASON
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {seasonalSuggestions.map((suggestion, i) => {
                    const meta = INTERVAL_META[suggestion.interval];
                    return (
                      <motion.div
                        key={suggestion.interval}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                        style={{
                          background: `${meta.color}10`,
                          border: `1px solid ${meta.color}25`,
                        }}
                      >
                        <span style={{ color: meta.color }}>{meta.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono font-bold block truncate" style={{ color: 'hsl(0 0% 75%)' }}>
                            {suggestion.crop.common_name || suggestion.crop.name}
                          </span>
                          <span className="text-[8px] font-mono flex items-center gap-1" style={{ color: 'hsl(0 0% 40%)' }}>
                            {suggestion.source === 'companion' ? <Users className="w-2.5 h-2.5 inline" /> : '🎵'}
                            {' '}{suggestion.label}
                          </span>
                        </div>
                        {isAdmin ? (
                          <button
                            onClick={() => handleSuggestionAssign(suggestion)}
                            disabled={addPlanting.isPending}
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{
                              background: `${meta.color}20`,
                              border: `1px solid ${meta.color}40`,
                            }}
                            title={`Add ${suggestion.crop.common_name || suggestion.crop.name} to ${suggestion.interval}`}
                          >
                            <Plus className="w-3 h-3" style={{ color: meta.color }} />
                          </button>
                        ) : (
                          <span className="text-[8px] font-mono" style={{ color: meta.color }}>
                            {meta.shortLabel}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                {/* Auto-Compose All Button */}
                {isAdmin && seasonalSuggestions.length > 1 && (
                  <motion.button
                    onClick={handleAutoComposeAll}
                    disabled={autoComposing || addPlanting.isPending}
                    className="w-full mt-2.5 flex items-center justify-center gap-2 py-2 rounded-lg font-mono text-[10px] font-bold tracking-wider"
                    style={{
                      background: `linear-gradient(135deg, ${zoneColor}25, ${zoneColor}15)`,
                      border: `1px solid ${zoneColor}50`,
                      color: zoneColor,
                      opacity: autoComposing ? 0.7 : 1,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {autoComposing ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> COMPOSING...</>
                    ) : (
                      <><Wand2 className="w-3.5 h-3.5" /> AUTO-COMPOSE ALL ({seasonalSuggestions.length})</>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── Chord Slots (Ground Layer) ─── */}
          {selectedBed && (
            <div>
              <span className="text-[8px] font-mono tracking-wider block mb-2" style={{ color: 'hsl(0 0% 35%)' }}>
                GROUND INTERVALS
              </span>
              <div className="space-y-1.5">
                {CHORD_INTERVALS.map(interval => {
                  const meta = INTERVAL_META[interval];
                  const planting = chordStatus[interval];
                  const crop = planting?.crop;
                  const isEmpty = !planting;

                  return (
                    <div
                      key={interval}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{
                        background: isEmpty ? 'hsl(0 0% 5%)' : `${meta.color}12`,
                        border: `1px solid ${isEmpty ? 'hsl(0 0% 10%)' : `${meta.color}35`}`,
                      }}
                    >
                      <span style={{ color: meta.color }}>{meta.icon}</span>
                      <span className="text-[9px] font-mono font-bold w-8" style={{ color: meta.color }}>
                        {meta.shortLabel}
                      </span>
                      {crop ? (
                        <span className="text-[10px] font-mono flex-1 truncate" style={{ color: 'hsl(0 0% 70%)' }}>
                          {crop.common_name || crop.name}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono flex-1 italic" style={{ color: 'hsl(0 0% 25%)' }}>
                          Empty
                        </span>
                      )}
                      {isAdmin && planting && (
                        <button
                          onClick={() => handleRemove(planting)}
                          className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                          style={{ background: 'hsl(0 30% 15%)', border: '1px solid hsl(0 30% 25%)' }}
                        >
                          <X className="w-3 h-3" style={{ color: 'hsl(0 50% 55%)' }} />
                        </button>
                      )}
                      {isEmpty && !isAdmin && (
                        <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 20%)' }}>—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Overlay Intervals (11th / 13th) ─── */}
          {selectedBed && (
            <div>
              <span className="text-[8px] font-mono tracking-wider block mb-2" style={{ color: 'hsl(0 0% 35%)' }}>
                BIOLOGICAL OVERLAYS
              </span>
              <div className="space-y-1.5">
                {/* 11th - Fungal */}
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    background: has11th ? 'hsl(180 15% 7%)' : 'hsl(0 0% 5%)',
                    border: `1px solid ${has11th ? 'hsl(180 30% 25%)' : 'hsl(0 0% 10%)'}`,
                  }}
                >
                  <span className="text-sm">🍄</span>
                  <span className="text-[9px] font-mono font-bold w-8" style={{ color: 'hsl(180 40% 50%)' }}>11th</span>
                  {has11th ? (
                    <span className="text-[10px] font-mono flex-1 truncate" style={{ color: 'hsl(0 0% 70%)' }}>
                      {selectedBed.inoculant_type}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono flex-1 italic" style={{ color: 'hsl(0 0% 25%)' }}>
                      No inoculant
                    </span>
                  )}
                  {has11th && <Check className="w-3 h-3" style={{ color: 'hsl(180 40% 50%)' }} />}
                </div>
                {/* 13th - Aerial */}
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    background: has13th ? 'hsl(300 15% 7%)' : 'hsl(0 0% 5%)',
                    border: `1px solid ${has13th ? 'hsl(300 30% 25%)' : 'hsl(0 0% 10%)'}`,
                  }}
                >
                  <span className="text-sm">🌿</span>
                  <span className="text-[9px] font-mono font-bold w-8" style={{ color: 'hsl(300 40% 55%)' }}>13th</span>
                  {has13th ? (
                    <span className="text-[10px] font-mono flex-1 truncate" style={{ color: 'hsl(0 0% 70%)' }}>
                      {(selectedBed as any).aerial_crop?.common_name || (selectedBed as any).aerial_crop?.name || 'Assigned'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono flex-1 italic" style={{ color: 'hsl(0 0% 25%)' }}>
                      No aerial crop
                    </span>
                  )}
                  {has13th && <Check className="w-3 h-3" style={{ color: 'hsl(300 40% 55%)' }} />}
                </div>
              </div>
              <p className="text-[8px] font-mono mt-1.5" style={{ color: 'hsl(0 0% 25%)' }}>
                11th &amp; 13th are set from the Conductor bed detail panel.
              </p>
            </div>
          )}

          {/* ─── Pending Crop Assignment ─── */}
          <AnimatePresence>
            {isAdmin && pendingCrop && selectedBed && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="rounded-xl p-3"
                style={{
                  background: `${zoneColor}10`,
                  border: `2px solid ${zoneColor}50`,
                  boxShadow: `0 0 20px ${zoneColor}15`,
                }}
              >
                <span className="text-[8px] font-mono tracking-wider block mb-2" style={{ color: zoneColor }}>
                  ASSIGN TO BED {selectedBed.bed_number}
                </span>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: ZONE_COLORS[pendingCrop.frequency_hz] || '#888' }} />
                  <span className="text-xs font-mono font-bold" style={{ color: 'hsl(0 0% 85%)' }}>
                    {pendingCrop.common_name || pendingCrop.name}
                  </span>
                  <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                    → {pendingCrop.chord_interval || 'No interval'}
                  </span>
                </div>
                {pendingCrop.frequency_hz !== activeFrequency && (
                  <div className="rounded-lg px-2 py-1.5 mb-2 flex items-center gap-1.5"
                    style={{ background: 'hsl(45 30% 10%)', border: '1px solid hsl(45 40% 25%)' }}>
                    <span className="text-[9px] font-mono" style={{ color: 'hsl(45 70% 55%)' }}>
                      ⚠ Cross-zone: {pendingCrop.frequency_hz}Hz → {activeFrequency}Hz bed
                    </span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleAssign}
                    disabled={addPlanting.isPending}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-bold"
                    style={{
                      background: zoneColor,
                      color: 'hsl(0 0% 3%)',
                      opacity: addPlanting.isPending ? 0.6 : 1,
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {addPlanting.isPending ? 'ASSIGNING...' : 'ASSIGN'}
                  </button>
                  <button
                    onClick={onClearPending}
                    className="px-3 py-2 rounded-lg text-xs font-mono"
                    style={{ background: 'hsl(0 0% 10%)', color: 'hsl(0 0% 50%)', border: '1px solid hsl(0 0% 15%)' }}
                  >
                    CANCEL
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── No Bed Selected ─── */}
          {!selectedBed && activeFrequency && (
            <div className="text-center py-8">
              <Music className="w-8 h-8 mx-auto mb-2" style={{ color: 'hsl(0 0% 15%)' }} />
              <p className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                No beds found in {note}/{activeFrequency}Hz zone.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChordComposer;
