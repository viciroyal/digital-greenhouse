import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Leaf, Sprout, Tractor, Home as HomeIcon, Sparkles, Save, Check, LogIn, Moon, Search, AlertTriangle, X, Undo2, Droplets, Trash2, ChevronDown, ChevronUp, Thermometer, CloudRain, User, MapPin, Navigation, Printer, Beaker, Calendar, Music, TreePine, Shield, Shuffle, Shovel } from 'lucide-react';
import GrowthHabitBadge from '@/components/crop-oracle/GrowthHabitBadge';
import TrapCropBadge from '@/components/crop-oracle/TrapCropBadge';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { getLunarPhase, isCropLunarReady, isZoneInSeason, getSeasonalGateMessage } from '@/hooks/useLunarPhase';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GriotOracle from '@/components/GriotOracle';
import EshuLoader from '@/components/EshuLoader';
import { useWeatherAlert } from '@/hooks/useWeatherAlert';
import MiniMusicPlayer from '@/components/audio/MiniMusicPlayer';
import { STATE_HARDINESS_ZONES, US_STATES } from '@/data/stateHardinessZones';
import ModalReference from '@/components/crop-oracle/ModalReference';
import SoilLinkPanel from '@/components/crop-oracle/SoilLinkPanel';
import PlantingCalendar from '@/components/crop-oracle/PlantingCalendar';
import ScentCorridorPanel from '@/components/crop-oracle/ScentCorridorPanel';
import PropagationPanel from '@/components/crop-oracle/PropagationPanel';
import EcoParadigmCard from '@/components/community/EcoParadigmCard';
import ProSuppliersPanel from '@/components/crop-oracle/ProSuppliersPanel';
import FoodForestHoleProtocol from '@/components/crop-oracle/FoodForestHoleProtocol';
import TwoWeekDashboard from '@/components/crop-oracle/TwoWeekDashboard';
import { getZoneAwarePlantingWindows, cropFitsZone } from '@/lib/frostDates';

/* ─── Zone Data ─── */
const ZONES = [
  { hz: 396, name: 'Foundation', vibe: 'Grounding', color: '#FF0000', note: 'C', description: 'Root anchoring, phosphorus, deep stability' },
  { hz: 417, name: 'Flow', vibe: 'Flow', color: '#FF7F00', note: 'D', description: 'Water, hydration, fungal transit' },
  { hz: 528, name: 'Alchemy', vibe: 'Energy', color: '#FFFF00', note: 'E', description: 'Solar power, nitrogen, growth core' },
  { hz: 639, name: 'Heart', vibe: 'Heart', color: '#00FF00', note: 'F', description: 'Connection, mycorrhizal sync, calcium' },
  { hz: 741, name: 'Signal', vibe: 'Expression', color: '#0000FF', note: 'G', description: 'Potassium, Brix validation, alchemy' },
  { hz: 852, name: 'Vision', vibe: 'Vision', color: '#9B59B6', note: 'A', description: 'Medicinal density, silica, insight' },
  { hz: 963, name: 'Source', vibe: 'Protection', color: '#8B00FF', note: 'B', description: 'Garlic shield, sulfur, seed sanctuary' },
];

/* ─── Environment Options ─── */
const ENVIRONMENTS = [
  { id: 'pot', label: 'Pot', icon: <Sprout className="w-6 h-6" />, subtitle: 'Container / Small Space', description: 'Compact crops for patios, balconies, and windowsills' },
  { id: 'raised-bed', label: 'Raised Bed', icon: <Leaf className="w-6 h-6" />, subtitle: 'Backyard / Garden', description: 'Standard guild planting in raised beds' },
  { id: 'farm', label: 'Farm', icon: <Tractor className="w-6 h-6" />, subtitle: 'Acreage / Row Crops', description: 'High-volume row cropping and field production' },
  { id: 'high-tunnel', label: 'High Tunnel', icon: <HomeIcon className="w-6 h-6" />, subtitle: 'Protected Culture', description: 'Season extension with climate control' },
  { id: 'food-forest', label: 'Food Forest', icon: <TreePine className="w-6 h-6" />, subtitle: 'Perennial Polyculture', description: 'Multi-layer perennial food ecosystem with canopy, understory, and ground cover' },
];

/* ─── Chord interval display order ─── */
const INTERVAL_ORDER = [
  { key: 'Root (Lead)', label: 'The Star', role: 'Root (1st)', emoji: '🌟', hint: 'Your main crop — the headliner of the bed.' },
  { key: '3rd (Triad)', label: 'The Companion', role: '3rd (Triad)', emoji: '🌿', hint: 'A helpful neighbor that keeps pests away or adds nutrients.' },
  { key: '5th (Stabilizer)', label: 'The Stabilizer', role: '5th', emoji: '⚓', hint: 'A ground-cover or nitrogen-fixer that feeds the soil.' },
  { key: '7th (Signal)', label: 'The Signal', role: '7th', emoji: '🦋', hint: 'Flowers & herbs that attract pollinators and beneficial insects.' },
  { key: '9th (Sub-bass)', label: 'The Underground', role: '9th', emoji: '🥔', hint: 'Root vegetables growing beneath the surface.' },
  { key: '11th (Tension)', label: 'The Sentinel', role: '11th', emoji: '🍄', hint: 'Fungi that build an underground nutrient network.' },
  { key: '13th (Top Note)', label: 'The Aerial', role: '13th', emoji: '🌻', hint: 'Tall plants that create shade and wind protection above.' },
];

/* ─── Food Forest layer labels (override when environment === 'food-forest') ─── */
const FOOD_FOREST_LAYERS: Record<string, { label: string; emoji: string; hint: string }> = {
  'Root (Lead)': { label: 'Canopy Tree', emoji: '🌳', hint: 'The tallest layer — fruit or nut trees forming the forest ceiling.' },
  '3rd (Triad)': { label: 'Understory', emoji: '🫐', hint: 'Berry bushes and small trees beneath the canopy.' },
  '5th (Stabilizer)': { label: 'N-Fixer', emoji: '🌱', hint: 'Nitrogen-fixing plants that feed the whole ecosystem.' },
  '7th (Signal)': { label: 'Pollinator', emoji: '🐝', hint: 'Perennial flowers and herbs that attract beneficial insects.' },
  '9th (Sub-bass)': { label: 'Root Layer', emoji: '🫚', hint: 'Deep-rooted nutrient miners that bring minerals to the surface.' },
  '11th (Tension)': { label: 'Fungal Net', emoji: '🍄', hint: 'Mycelial networks connecting trees and cycling nutrients underground.' },
  '13th (Top Note)': { label: 'Vine Layer', emoji: '🍇', hint: 'Climbing vines that use vertical space in the canopy gaps.' },
};

/* ─── Spacing limits for containers ─── */
const POT_MAX_SPACING = 12;

const CropOracle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: allCrops, isLoading } = useMasterCrops();
  const [step, setStep] = useState(1);
  const [environment, setEnvironment] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<typeof ZONES[0] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonalOverride, setSeasonalOverride] = useState(false);
  const [swapSlotIndex, setSwapSlotIndex] = useState<number | null>(null);
  const [manualOverrides, setManualOverrides] = useState<Record<number, MasterCrop>>({});
  const [starCrop, setStarCrop] = useState<MasterCrop | null>(null);
  const [showStarPicker, setShowStarPicker] = useState(false);
  const [starSearchQuery, setStarSearchQuery] = useState('');
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  const [deletingRecipeId, setDeletingRecipeId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [proMode, setProMode] = useState(false);
  const [hardinessZone, setHardinessZone] = useState<number | null>(null);
  const [hardinessSubZone, setHardinessSubZone] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [modalInfoOpen, setModalInfoOpen] = useState(false);
  const [activeToolPanel, setActiveToolPanel] = useState<'soil' | 'calendar' | 'modal' | 'scent' | 'propagation' | 'suppliers' | 'hole' | null>(null);
  const [recipeSeed, setRecipeSeed] = useState(0);

  // Fetch saved recipes
  const { data: savedRecipes } = useQuery({
    queryKey: ['saved-recipes', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const handleDeleteRecipe = async (id: string) => {
    setDeletingRecipeId(id);
    try {
      const { error } = await supabase.from('saved_recipes').delete().eq('id', id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['saved-recipes', userId] });
      toast({ title: 'Recipe removed', description: 'Deleted from your collection.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setDeletingRecipeId(null);
    }
  };
  // Real-time celestial data
  const lunar = useMemo(() => getLunarPhase(), []);
  const weather = useWeatherAlert();

  // Check auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Reset saved state when recipe changes
  useEffect(() => {
    setIsSaved(false);
    setManualOverrides({});
    setSwapSlotIndex(null);
    setStarCrop(null);
    setShowStarPicker(false);
    setStarSearchQuery('');
  }, [selectedZone, environment]);

  const handleSaveRecipe = async () => {
    if (!userId || !selectedZone || !environment) return;
    setIsSaving(true);
    try {
      const chordData = chordCard.map(slot => ({
        interval: slot.key,
        label: slot.label,
        role: slot.role,
        crop_name: slot.crop?.common_name || slot.crop?.name || null,
        crop_id: slot.crop?.id || null,
      }));

      const { error } = await supabase.from('saved_recipes').insert({
        user_id: userId,
        environment: environment,
        zone_hz: selectedZone.hz,
        zone_name: selectedZone.name,
        zone_vibe: selectedZone.vibe,
        chord_data: chordData,
        name: `${selectedZone.vibe} ${environment} Recipe`,
      });

      if (error) throw error;

      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: ['saved-recipes', userId] });
      toast({
        title: "Recipe Saved 🌱",
        description: `Your ${selectedZone.vibe} chord has been stored.`,
      });
    } catch (error: any) {
      toast({
        title: "Could not save",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /* ─── Sub-zone formatting helper (8.0 → "8a", 8.5 → "8b") ─── */
  const formatSubZone = (val: number): string => {
    const base = Math.floor(val);
    const sub = val % 1 >= 0.5 ? 'b' : 'a';
    return `${base}${sub}`;
  };

  /* ─── Hardiness zone filter helper (now sub-zone aware) ─── */
  const fitsHardinessZone = (c: MasterCrop): boolean => {
    if (!hardinessZone) return true;
    if (c.hardiness_zone_min == null || c.hardiness_zone_max == null) return true;
    // Use sub-zone numeric value for precise filtering
    const filterVal = hardinessSubZone ? parseSubZoneValue(hardinessSubZone) : hardinessZone;
    return filterVal >= c.hardiness_zone_min && filterVal <= c.hardiness_zone_max;
  };

  /** Parse sub-zone string to numeric (e.g. "8b" → 8.5, "8a" → 8.0, "8" → 8.0) */
  const parseSubZoneValue = (sz: string): number => {
    const match = sz.match(/^(\d+)(a|b)?$/i);
    if (!match) return hardinessZone || 0;
    const base = parseInt(match[1]);
    return match[2]?.toLowerCase() === 'b' ? base + 0.5 : base;
  };

  /* ─── Food forest perennial detection helpers ─── */
  const FOOD_FOREST_PERENNIAL_KEYWORDS = [
    'berry', 'blueberry', 'blackberry', 'raspberry', 'strawberry', 'elderberry',
    'grape', 'fig', 'mulberry', 'persimmon', 'pawpaw', 'apple', 'pear', 'peach',
    'plum', 'cherry', 'avocado', 'jackfruit', 'coconut', 'cacao', 'mango',
    'guava', 'moringa', 'papaya', 'banana', 'pomegranate', 'citrus',
    'pecan', 'serviceberry', 'gooseberry', 'jostaberry', 'currant', 'goumi',
    'sea buckthorn', 'spicebush',
  ];
  const NITROGEN_FIXER_KEYWORDS = [
    'clover', 'vetch', 'bean', 'pea', 'cowpea', 'fava', 'pigeon', 'alfalfa',
    'soybean', 'peanut', 'lupin', 'locust', 'autumn olive', 'goumi',
    'sea buckthorn', 'siberian pea', 'scarlet runner',
  ];
  const VINE_LAYER_KEYWORDS = [
    'kiwi', 'grape', 'passion', 'hops', 'akebia', 'chocolate vine',
    'morning glory', 'moonflower', 'pole bean', 'runner bean',
    'hyacinth bean', 'scarlet runner',
  ];
  const GROUND_COVER_KEYWORDS = [
    'clover', 'comfrey', 'strawberry', 'mint', 'thyme', 'oregano', 'creeping',
  ];

  const isFoodForestPerennial = (c: MasterCrop): boolean => {
    const name = (c.common_name || c.name).toLowerCase();
    const note = (c.library_note || '').toLowerCase();
    // Exclude nightshades/peppers that false-match (e.g. "Sugar Rush Peach" matching "peach")
    const isNightshade = c.category === 'Nightshade' || name.includes('pepper') || name.includes('tomato') || name.includes('eggplant');
    if (isNightshade) return false;
    return c.category === 'fruit' ||
      note.includes('food forest') ||
      FOOD_FOREST_PERENNIAL_KEYWORDS.some(kw => name.includes(kw));
  };

  const isNitrogenFixer = (c: MasterCrop): boolean => {
    const name = (c.common_name || c.name).toLowerCase();
    return c.guild_role?.toLowerCase().includes('nitrogen') ||
      c.category === 'Nitrogen/Bio-Mass' ||
      c.chord_interval === '5th (Stabilizer)' ||
      NITROGEN_FIXER_KEYWORDS.some(kw => name.includes(kw));
  };

  const isVineLayer = (c: MasterCrop): boolean => {
    const name = (c.common_name || c.name).toLowerCase();
    const note = (c.library_note || '').toLowerCase();
    return VINE_LAYER_KEYWORDS.some(kw => name.includes(kw)) ||
      note.includes('vine layer');
  };

  const isGroundCover = (c: MasterCrop): boolean => {
    const name = (c.common_name || c.name).toLowerCase();
    return GROUND_COVER_KEYWORDS.some(kw => name.includes(kw));
  };

  /* ─── Filter crops by zone + environment ─── */
  const recipeCrops = useMemo(() => {
    if (!allCrops || !selectedZone) return [];

    let filtered = allCrops.filter(c => c.frequency_hz === selectedZone.hz);

    if (hardinessZone) {
      filtered = filtered.filter(fitsHardinessZone);
    }

    if (environment === 'pot') {
      filtered = filtered.filter(c => {
        const spacing = c.spacing_inches ? parseInt(c.spacing_inches) : 6;
        return spacing <= POT_MAX_SPACING;
      });
    }

    if (environment === 'high-tunnel') {
      const priority = filtered.filter(c =>
        c.category === 'Nightshade' || c.category === 'Pepper' ||
        c.category === 'Green' || c.category === 'Herb' ||
        c.name.toLowerCase().includes('tomato') || c.name.toLowerCase().includes('pepper')
      );
      if (priority.length > 0) filtered = priority;
    }

    if (environment === 'food-forest') {
      // Prioritize perennials, fruit trees, berry bushes, nitrogen-fixers, and vines
      const perennials = filtered.filter(c => isFoodForestPerennial(c) || isNitrogenFixer(c) || isGroundCover(c) || isVineLayer(c));
      if (perennials.length >= 3) {
        filtered = perennials;
      }
      // If not enough perennials in this zone, keep all but sort perennials first
      filtered.sort((a, b) => {
        const aScore = (isFoodForestPerennial(a) ? 3 : 0) + (isNitrogenFixer(a) ? 2 : 0) + (isVineLayer(a) ? 1.5 : 0) + (isGroundCover(a) ? 1 : 0);
        const bScore = (isFoodForestPerennial(b) ? 3 : 0) + (isNitrogenFixer(b) ? 2 : 0) + (isVineLayer(b) ? 1.5 : 0) + (isGroundCover(b) ? 1 : 0);
        return bScore - aScore;
      });
    }

    return filtered;
  }, [allCrops, selectedZone, environment, hardinessZone]);

  /* ─── Star crop candidates (ANY crop from ANY zone can be the Star) ─── */
  const starCandidates = useMemo(() => {
    if (!allCrops) return [];
    let candidates = [...allCrops];
    if (hardinessZone) {
      candidates = candidates.filter(fitsHardinessZone);
    }
    if (environment === 'pot') {
      candidates = candidates.filter(c => {
        const spacing = c.spacing_inches ? parseInt(c.spacing_inches) : 6;
        return spacing <= POT_MAX_SPACING;
      });
    }
    return candidates.sort((a, b) => (a.common_name || a.name).localeCompare(b.common_name || b.name));
  }, [allCrops, environment, hardinessZone]);

  /* ─── Total crops matching hardiness zone (across all frequency zones) ─── */
  const zoneMatchCount = useMemo(() => {
    if (!allCrops || !hardinessZone) return null;
    return allCrops.filter(fitsHardinessZone).length;
  }, [allCrops, hardinessZone, hardinessSubZone]);

  /* ─── Shared deep search helper ─── */
  const deepCropMatch = (c: MasterCrop, q: string): boolean => {
    const fields = [
      c.common_name, c.name, c.category, c.dominant_mineral,
      c.guild_role, c.element, c.zone_name, c.cultural_role,
      c.chord_interval, c.soil_protocol_focus, c.focus_tag,
      c.instrument_type, c.description,
    ];
    if (fields.some(f => f && f.toLowerCase().includes(q))) return true;
    if (c.companion_crops?.some(cc => cc.toLowerCase().includes(q))) return true;
    if (c.planting_season?.some(ps => ps.toLowerCase().includes(q))) return true;
    if (c.crop_guild?.some(cg => cg.toLowerCase().includes(q))) return true;
    if (String(c.frequency_hz).includes(q)) return true;
    return false;
  };

  /* ─── Filtered star search ─── */
  const filteredStarCandidates = useMemo(() => {
    if (!starSearchQuery || starSearchQuery.length < 1) return starCandidates.slice(0, 20);
    const q = starSearchQuery.toLowerCase();
    return starCandidates.filter(c => deepCropMatch(c, q)).slice(0, 20);
  }, [starCandidates, starSearchQuery]);

  /* ─── Crop search across entire registry ─── */
  const searchResults = useMemo(() => {
    if (!allCrops || !searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return allCrops.filter(c => deepCropMatch(c, q)).slice(0, 12);
  }, [allCrops, searchQuery]);

  /* ─── Build 7-voice chord card ─── */
  const chordCard = useMemo(() => {
    if (recipeCrops.length === 0 && !starCrop) return [];

    // When a Star is from a different zone, use the Star's zone as the pool
    const effectiveHz = starCrop ? starCrop.frequency_hz : selectedZone?.hz;
    const zoneCrops = allCrops?.filter(c => effectiveHz && c.frequency_hz === effectiveHz) || [];
    let pool = starCrop && starCrop.frequency_hz !== selectedZone?.hz ? zoneCrops : (recipeCrops.length > 0 ? recipeCrops : zoneCrops);
    // For pot mode, also filter the pool
    if (environment === 'pot') {
      pool = pool.filter(c => {
        const spacing = c.spacing_inches ? parseInt(c.spacing_inches) : 6;
        return spacing <= POT_MAX_SPACING;
      });
    }

    // ─── 90% Compatibility Gate ───
    // Pre-filter pool: only keep crops that fit the user's hardiness zone
    // AND share at least one planting season with the star crop (when data exists).
    const starSeasons = (starCrop?.planting_season || []).map(s => s.toLowerCase());
    const starHarvestDays = starCrop?.harvest_days ?? null;

    const isZoneCompatible = (c: MasterCrop): boolean => {
      if (!hardinessZone || c.hardiness_zone_min == null || c.hardiness_zone_max == null) return true;
      return hardinessZone >= c.hardiness_zone_min && hardinessZone <= c.hardiness_zone_max;
    };
    const isSeasonCompatible = (c: MasterCrop): boolean => {
      if (starSeasons.length === 0) return true;
      const cSeasons = (c.planting_season || []).map(s => s.toLowerCase());
      if (cSeasons.length === 0) return true; // no data = don't exclude
      return starSeasons.some(s => cSeasons.includes(s));
    };

    // Apply the gate — keep a fallback to the full pool if too few crops pass
    const gatedPool = pool.filter(c => isZoneCompatible(c) && isSeasonCompatible(c));
    pool = gatedPool.length >= 3 ? gatedPool : pool;

    const usedIds = new Set<string>();

    // Star crop's companion names for prioritization
    const companionNames = (starCrop?.companion_crops || []).map(n => n.toLowerCase());

    // Fuzzy match: does a crop match any companion name?
    const isCompanion = (c: MasterCrop): boolean => {
      const name = (c.common_name || c.name).toLowerCase();
      return companionNames.some(cn => name.includes(cn) || cn.includes(name.split('(')[0].trim()));
    };

    // Bidirectional USDA companion check: does the candidate also list the star crop?
    const isBidirectionalCompanion = (c: MasterCrop): boolean => {
      if (!starCrop) return false;
      const starName = (starCrop.common_name || starCrop.name).toLowerCase();
      const candidateCompanions = (c.companion_crops || []).map(n => n.toLowerCase());
      // candidate lists star crop
      const candidateListsStar = candidateCompanions.some(cn => starName.includes(cn) || cn.includes(starName.split('(')[0].trim()));
      // star lists candidate
      const starListsCandidate = isCompanion(c);
      return candidateListsStar || starListsCandidate;
    };

    // Helper: is this crop a sentinel/trap crop?
    const isSentinelOrTrap = (c: MasterCrop): boolean => {
      const role = (c.guild_role || '').toLowerCase();
      const desc = (c.description || '').toLowerCase();
      return role === 'sentinel' || ['trap crop', 'pest deterrent', 'pest-deterrent', 'repel', 'deterr'].some(k => desc.includes(k));
    };

    const harmonicScore = (c: MasterCrop, hasSentinelAlready: boolean = false): number => {
      let score = 0;
      // Season overlap with star crop (+3 per shared season)
      const cSeasons = (c.planting_season || []).map(s => s.toLowerCase());
      const sharedSeasons = starSeasons.filter(s => cSeasons.includes(s));
      score += sharedSeasons.length * 3;
      // Bonus if ANY season data exists (+1)
      if (cSeasons.length > 0) score += 1;
      // Zone compatibility (+5 if crop fits user's zone, heavy penalty if not)
      if (hardinessZone && c.hardiness_zone_min != null && c.hardiness_zone_max != null) {
        if (hardinessZone >= c.hardiness_zone_min && hardinessZone <= c.hardiness_zone_max) score += 5;
        else score -= 8; // strong penalty for zone-incompatible crops
      }
      // USDA companion planting boost (+6 bidirectional, +4 one-way)
      if (isBidirectionalCompanion(c)) score += 6;
      else if (isCompanion(c)) score += 4;
      // Harvest alignment bonus (+1 if within 30 days of star)
      if (starHarvestDays !== null && c.harvest_days != null) {
        const diff = Math.abs(c.harvest_days - starHarvestDays);
        if (diff <= 15) score += 2;
        else if (diff <= 30) score += 1;
      }
      // Sentinel/trap crop boost: +4 base, +6 extra if recipe has no sentinel yet
      if (isSentinelOrTrap(c)) {
        score += 4;
        if (!hasSentinelAlready) score += 6;
      }
      return score;
    };

    // Seeded rotation: pick from candidates using recipeSeed, preferring harmonically-scored crops
    let pickCounter = 0;
    let hasSentinelInRecipe = starCrop ? isSentinelOrTrap(starCrop) : false;
    const rotatedPick = (candidates: MasterCrop[]): MasterCrop | undefined => {
      if (candidates.length === 0) return undefined;
      // Sort by harmonic score descending, then use seed to rotate within top-tier
      const scored = candidates.map(c => ({ crop: c, score: harmonicScore(c, hasSentinelInRecipe) }));
      scored.sort((a, b) => b.score - a.score);
      // Pick from the top-scoring tier (all candidates within 1 point of best)
      const bestScore = scored[0].score;
      const topTier = scored.filter(s => s.score >= bestScore - 1);
      const idx = (recipeSeed + pickCounter++) % topTier.length;
      const picked = topTier[idx].crop;
      if (picked && isSentinelOrTrap(picked)) hasSentinelInRecipe = true;
      return picked;
    };

    const pickCrop = (
      primary: MasterCrop | undefined,
      fallbackFn?: (c: MasterCrop) => boolean
    ): { crop: MasterCrop; companionMatch: boolean } | null => {
      // If star crop has companions, prefer companions that match the role
      if (companionNames.length > 0 && fallbackFn) {
        const companionCandidates = pool.filter(c => !usedIds.has(c.id) && isCompanion(c) && fallbackFn(c));
        const companionMatch = rotatedPick(companionCandidates);
        if (companionMatch) { usedIds.add(companionMatch.id); return { crop: companionMatch, companionMatch: true }; }
      }
      if (primary && !usedIds.has(primary.id)) {
        usedIds.add(primary.id);
        return { crop: primary, companionMatch: isCompanion(primary) };
      }
      // Companion fallback (any role)
      if (companionNames.length > 0) {
        const anyCompanionCandidates = pool.filter(c => !usedIds.has(c.id) && isCompanion(c));
        const anyCompanion = rotatedPick(anyCompanionCandidates);
        if (anyCompanion) { usedIds.add(anyCompanion.id); return { crop: anyCompanion, companionMatch: true }; }
      }
      if (fallbackFn) {
        const fbCandidates = pool.filter(c => !usedIds.has(c.id) && fallbackFn(c));
        const fb = rotatedPick(fbCandidates);
        if (fb) { usedIds.add(fb.id); return { crop: fb, companionMatch: false }; }
      }
      return null;
    };

    return INTERVAL_ORDER.map(interval => {
      let crop: MasterCrop | null = null;
      let isCompanionFill = false;
      const directCandidates = pool.filter(c => !usedIds.has(c.id) && c.chord_interval === interval.key);
      const directMatch = rotatedPick(directCandidates);

      const assign = (result: { crop: MasterCrop; companionMatch: boolean } | null) => {
        if (result) { crop = result.crop; isCompanionFill = result.companionMatch; }
      };

      const isFF = environment === 'food-forest';

      switch (interval.key) {
        case 'Root (Lead)':
          if (starCrop && !usedIds.has(starCrop.id)) {
            usedIds.add(starCrop.id);
            crop = starCrop;
            isCompanionFill = false;
          } else if (isFF) {
            // Food Forest: prefer fruit trees / perennial canopy crops as the Star
            assign(pickCrop(undefined, c => isFoodForestPerennial(c) && c.chord_interval === 'Root (Lead)'));
            if (!crop) assign(pickCrop(directMatch, c => isFoodForestPerennial(c)));
            if (!crop) assign(pickCrop(directMatch, c => c.chord_interval === 'Root (Lead)'));
          } else {
            assign(pickCrop(directMatch, c => c.chord_interval === 'Root (Lead)'));
          }
          break;
        case '3rd (Triad)':
          if (isFF) {
            // Food Forest: understory berry bushes, small trees, perennial herbs
            assign(pickCrop(undefined, c => {
              const name = (c.common_name || c.name).toLowerCase();
              const note = (c.library_note || '').toLowerCase();
              return (name.includes('berry') || name.includes('serviceberry') ||
                name.includes('gooseberry') || name.includes('jostaberry') ||
                name.includes('currant') || name.includes('spicebush') ||
                name.includes('comfrey') || note.includes('shrub layer') ||
                note.includes('understory')) && !usedIds.has(c.id);
            }));
            if (!crop) assign(pickCrop(directMatch, c => c.chord_interval === '3rd (Triad)'));
          } else {
            assign(pickCrop(directMatch, c => c.chord_interval === '3rd (Triad)'));
          }
          break;
        case '5th (Stabilizer)':
          if (isFF) {
            // Food Forest: nitrogen-fixing understory (clover, beans, vetch)
            assign(pickCrop(undefined, c => isNitrogenFixer(c)));
            if (!crop) assign(pickCrop(directMatch, c => c.chord_interval === '5th (Stabilizer)'));
          } else {
            assign(pickCrop(directMatch, c => c.chord_interval === '5th (Stabilizer)'));
          }
          break;
        case '7th (Signal)':
          if (isFF) {
            // Food Forest: pollinator-attracting perennial flowers/herbs/ornamentals
            assign(pickCrop(undefined, c =>
              c.chord_interval === '7th (Signal)' ||
              c.category === 'Pollinator' || c.category === 'Dye/Fiber/Aromatic' ||
              c.category === 'Ornamental' || c.category === 'flower'
            ));
            if (!crop) assign(pickCrop(directMatch, c => c.chord_interval === '7th (Signal)'));
          } else {
            assign(pickCrop(directMatch, c => c.chord_interval === '7th (Signal)'));
          }
          break;
        case '9th (Sub-bass)':
          if (isFF) {
            // Food Forest: first try crops explicitly tagged as 9th (Sub-bass)
            assign(pickCrop(undefined, c => c.chord_interval === '9th (Sub-bass)'));
            // Then deep-rooted nutrient miners (comfrey, dandelion, burdock, turmeric)
            if (!crop) assign(pickCrop(undefined, c => {
              const name = (c.common_name || c.name).toLowerCase();
              return c.guild_role?.toLowerCase().includes('miner') ||
                name.includes('comfrey') || name.includes('dandelion') ||
                name.includes('burdock') || name.includes('turmeric') ||
                name.includes('ginger') || name.includes('sunchoke') ||
                name.includes('jerusalem artichoke');
            }));
            if (!crop) assign(pickCrop(undefined, c =>
              c.instrument_type === 'Bass' ||
              c.name.toLowerCase().includes('potato') ||
              c.name.toLowerCase().includes('carrot')
            ));
          } else {
            assign(pickCrop(undefined, c =>
              c.instrument_type === 'Bass' ||
              c.name.toLowerCase().includes('potato') ||
              c.name.toLowerCase().includes('carrot') ||
              c.name.toLowerCase().includes('beet') ||
              c.name.toLowerCase().includes('radish') ||
              c.name.toLowerCase().includes('turmeric') ||
              c.name.toLowerCase().includes('ginger') ||
              c.name.toLowerCase().includes('burdock')
            ));
          }
          break;
        case '11th (Tension)':
          if (isFF) {
            // Food Forest: mycelial network / fungi + perennial alliums
            assign(pickCrop(undefined, c => {
              const n = (c.common_name || c.name).toLowerCase();
              return c.category === 'substrate' || c.category === 'Fungi' ||
                c.guild_role?.toLowerCase().includes('sentinel') ||
                n.includes('mushroom') || n.includes('shiitake') ||
                n.includes('oyster') || n.includes('reishi') ||
                n.includes('turkey tail') || n.includes('wine cap') ||
                n.includes('woodear') || n.includes('lion') ||
                n.includes('garlic') || n.includes('chive');
            }));
            if (!crop) assign(pickCrop(undefined, c => {
              const n = (c.common_name || c.name).toLowerCase();
              return c.guild_role?.toLowerCase().includes('sentinel') ||
                n.includes('onion') || c.category === 'Fungi';
            }));
          } else {
            assign(pickCrop(undefined, c =>
              c.guild_role?.toLowerCase().includes('sentinel') ||
              c.name.toLowerCase().includes('garlic') ||
              c.name.toLowerCase().includes('onion') ||
              c.name.toLowerCase().includes('chive') ||
              c.name.toLowerCase().includes('leek') ||
              c.name.toLowerCase().includes('shallot') ||
              c.category === 'Fungi'
            ));
          }
          break;
        case '13th (Top Note)':
          if (isFF) {
            // Food Forest: canopy vines (grape, kiwi, passionflower, hops, akebia) or tall perennials
            assign(pickCrop(undefined, c => isVineLayer(c)));
            if (!crop) assign(pickCrop(undefined, c => {
              const name = (c.common_name || c.name).toLowerCase();
              return name.includes('sunflower') || name.includes('moringa') ||
                (c.category === 'Dye/Fiber/Aromatic' && c.instrument_type === 'Synthesizers');
            }));
          } else {
            assign(pickCrop(undefined, c =>
              c.name.toLowerCase().includes('sunflower') ||
              c.name.toLowerCase().includes('morning glory') ||
              c.name.toLowerCase().includes('moonflower') ||
              c.name.toLowerCase().includes('passion') ||
              c.name.toLowerCase().includes('nasturtium') ||
              c.name.toLowerCase().includes('cosmos') ||
              (c.category === 'Dye/Fiber/Aromatic' && c.instrument_type === 'Synthesizers')
            ));
          }
          break;
      }

      return { ...interval, crop, isCompanionFill };
    }).map((slot, i) => manualOverrides[i] ? { ...slot, crop: manualOverrides[i], isCompanionFill: false } : slot);
  }, [recipeCrops, manualOverrides, starCrop, allCrops, selectedZone, environment, recipeSeed, hardinessZone]);

  /* ─── Modal Signature: derive musical mode from filled intervals ─── */
  const modalSignature = useMemo(() => {
    if (!chordCard || chordCard.length === 0) return null;

    const visibleSlots = proMode ? chordCard : chordCard.slice(0, 3);
    const filled = new Set(
      visibleSlots
        .filter(s => s.crop)
        .map(s => s.key)
    );
    const voiceCount = filled.size;
    if (voiceCount === 0) return null;

    // Mode mapping based on which zone note the recipe is in + interval coverage
    // Each zone's note naturally aligns with a mode of the major scale
    const ZONE_MODES: Record<number, { mode: string; mood: string; symbol: string }> = {
      396: { mode: 'Ionian', mood: 'Bright Stability', symbol: '♮' },
      417: { mode: 'Dorian', mood: 'Soulful Resilience', symbol: '♭3' },
      528: { mode: 'Phrygian', mood: 'Alchemical Fire', symbol: '♭2' },
      639: { mode: 'Lydian', mood: 'Expansive Heart', symbol: '♯4' },
      741: { mode: 'Mixolydian', mood: 'Bluesy Expression', symbol: '♭7' },
      852: { mode: 'Aeolian', mood: 'Deep Vision', symbol: '♭6' },
      963: { mode: 'Locrian', mood: 'Transcendent Mystery', symbol: '♭5' },
    };

    const effectiveHz = starCrop ? starCrop.frequency_hz : selectedZone?.hz;
    const base = effectiveHz ? ZONE_MODES[effectiveHz] : null;
    if (!base) return null;

    // Complexity suffix based on voice count
    let complexity = '';
    if (voiceCount <= 2) complexity = 'Drone';
    else if (voiceCount === 3) complexity = 'Triad';
    else if (voiceCount === 4) complexity = '7th';
    else if (voiceCount === 5) complexity = '9th';
    else if (voiceCount === 6) complexity = '11th';
    else complexity = '13th';

    // Shift mood descriptor if certain intervals are present but base is missing
    let mood = base.mood;
    if (filled.has('11th (Tension)') && filled.has('7th (Signal)')) {
      mood = mood.replace(/Stability|Resilience|Fire|Heart|Expression|Vision|Mystery/,
        m => `${m} + Tension`);
    }

    return {
      mode: base.mode,
      mood,
      symbol: base.symbol,
      complexity,
      voiceCount,
    };
  }, [chordCard, selectedZone, starCrop]);

  const handleSwapCrop = (crop: MasterCrop) => {
    if (swapSlotIndex === null) return;
    setManualOverrides(prev => ({ ...prev, [swapSlotIndex]: crop }));
    setSwapSlotIndex(null);
    setSearchQuery('');
    setIsSaved(false);
    toast({
      title: `${INTERVAL_ORDER[swapSlotIndex].label} swapped`,
      description: `Now: ${crop.common_name || crop.name}`,
    });
  };

  /* ─── Seasonal gate check ─── */
  const seasonalGate = useMemo(() => {
    if (!selectedZone) return null;
    return getSeasonalGateMessage(selectedZone.hz, lunar.seasonalMovement);
  }, [selectedZone, lunar.seasonalMovement]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(0 0% 3%)' }}>
        <EshuLoader message="Loading the garden database..." />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{ background: 'linear-gradient(180deg, hsl(0 0% 4%) 0%, hsl(0 0% 2%) 100%)' }}
    >
      {/* Top Header Bar — unified to prevent mobile overlap */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 py-2 safe-area-top"
        style={{
          background: 'hsl(0 0% 3% / 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid hsl(0 0% 12%)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 shrink-0"
          style={{
            background: 'hsl(0 0% 10%)',
            border: '1px solid hsl(0 0% 20%)',
          }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: 'hsl(0 0% 60%)' }} />
        </button>

        {/* Step indicators — inline in header on mobile */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all"
              style={{
                background: step >= s
                  ? (s === 3 && selectedZone ? selectedZone.color + '30' : 'hsl(45 80% 55% / 0.2)')
                  : 'hsl(0 0% 8%)',
                border: `1.5px solid ${step >= s ? (s === 3 && selectedZone ? selectedZone.color : 'hsl(45 80% 55%)') : 'hsl(0 0% 15%)'}`,
                color: step >= s ? 'hsl(45 80% 55%)' : 'hsl(0 0% 30%)',
              }}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setProMode(!proMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider transition-all"
            style={{
              background: proMode
                ? 'linear-gradient(135deg, hsl(270 40% 18%), hsl(270 30% 12%))'
                : 'hsl(0 0% 10%)',
              border: `1px solid ${proMode ? 'hsl(270 50% 40%)' : 'hsl(0 0% 20%)'}`,
              color: proMode ? 'hsl(270 60% 75%)' : 'hsl(120 40% 60%)',
              boxShadow: proMode ? '0 0 12px hsl(270 50% 30% / 0.3)' : 'none',
            }}
          >
            <span className="text-sm">{proMode ? '🎛️' : '🌱'}</span>
            {proMode ? 'PRO' : 'AMATEUR'}
          </button>

          <button
            onClick={() => navigate(userId ? '/profile' : '/auth')}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'hsl(0 0% 10%)',
              border: userId ? '1px solid hsl(51 80% 50% / 0.4)' : '1px solid hsl(0 0% 20%)',
            }}
            title={userId ? 'Profile' : 'Sign In'}
          >
            {userId ? (
              <User className="w-4 h-4" style={{ color: 'hsl(51 80% 60%)' }} />
            ) : (
              <LogIn className="w-4 h-4" style={{ color: 'hsl(0 0% 60%)' }} />
            )}
          </button>
        </div>
      </div>

      {/* ═══ Celestial Banner ═══ */}
      <motion.div
        className="mx-auto max-w-2xl px-4 pt-14"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap"
          style={{
            background: 'linear-gradient(135deg, hsl(240 30% 8%), hsl(270 20% 6%))',
            border: '1px solid hsl(270 30% 20% / 0.5)',
            boxShadow: '0 0 20px hsl(270 40% 15% / 0.15)',
          }}
        >
          {/* Moon Phase — left */}
          <span className="text-xl">{lunar.phaseEmoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold" style={{ color: 'hsl(270 60% 75%)' }}>
                {lunar.phaseLabel}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                background: 'hsl(270 30% 20% / 0.5)',
                color: 'hsl(270 40% 60%)',
              }}>
                {lunar.zodiacSymbol} {lunar.zodiacSign}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                background: lunar.plantingType === 'harvest'
                  ? 'hsl(45 80% 50% / 0.15)'
                  : lunar.plantingType === 'leaf'
                    ? 'hsl(120 40% 30% / 0.2)'
                    : lunar.plantingType === 'fruit'
                      ? 'hsl(30 60% 40% / 0.2)'
                      : 'hsl(15 50% 35% / 0.2)',
                color: lunar.plantingType === 'harvest'
                  ? 'hsl(45 80% 65%)'
                  : lunar.plantingType === 'leaf'
                    ? 'hsl(120 50% 60%)'
                    : lunar.plantingType === 'fruit'
                      ? 'hsl(30 70% 60%)'
                      : 'hsl(15 60% 55%)',
              }}>
                {lunar.plantingType === 'leaf' ? '🌿' : lunar.plantingType === 'fruit' ? '🍅' : lunar.plantingType === 'harvest' ? '🌾' : '🥕'} {lunar.plantingType.toUpperCase()} WINDOW
              </span>
            </div>
            <p className="text-[10px] font-body mt-0.5 truncate" style={{ color: 'hsl(0 0% 45%)' }}>
              {lunar.plantingLabel}
            </p>
          </div>

          {/* Weather & Water — right */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Temperature */}
            {!weather.isLoading && !weather.error && (
              <div
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg"
                style={{
                  background: weather.currentTempF >= 90
                    ? 'hsl(0 60% 20% / 0.3)'
                    : weather.currentTempF <= 34
                      ? 'hsl(200 60% 20% / 0.3)'
                      : 'hsl(120 30% 15% / 0.2)',
                  border: `1px solid ${weather.currentTempF >= 90
                    ? 'hsl(0 50% 35% / 0.4)'
                    : weather.currentTempF <= 34
                      ? 'hsl(200 50% 40% / 0.4)'
                      : 'hsl(120 30% 25% / 0.3)'}`,
                }}
              >
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3" style={{
                    color: weather.currentTempF >= 90
                      ? 'hsl(0 70% 60%)'
                      : weather.currentTempF <= 34
                        ? 'hsl(200 70% 65%)'
                        : 'hsl(120 50% 55%)',
                  }} />
                  <span className="text-sm font-mono font-bold" style={{
                    color: weather.currentTempF >= 90
                      ? 'hsl(0 70% 65%)'
                      : weather.currentTempF <= 34
                        ? 'hsl(200 70% 70%)'
                        : 'hsl(40 50% 85%)',
                  }}>
                    {weather.currentTempF}°F
                  </span>
                </div>
                <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                  {weather.minTempF}° / {weather.maxTempF}°
                </span>
              </div>
            )}

            {/* Water Recommendation */}
            {!weather.isLoading && !weather.error && (
              <div
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg"
                style={{
                  background: weather.waterRec.level === 'high'
                    ? 'hsl(200 60% 18% / 0.3)'
                    : weather.waterRec.level === 'none'
                      ? 'hsl(0 0% 12% / 0.3)'
                      : 'hsl(200 40% 15% / 0.2)',
                  border: `1px solid ${weather.waterRec.level === 'high'
                    ? 'hsl(200 60% 40% / 0.4)'
                    : 'hsl(200 30% 25% / 0.3)'}`,
                }}
              >
                <span className="text-sm">{weather.waterRec.icon}</span>
                <span className="text-[8px] font-mono text-center leading-tight max-w-[80px]" style={{
                  color: weather.waterRec.level === 'high'
                    ? 'hsl(200 70% 65%)'
                    : weather.waterRec.level === 'none'
                      ? 'hsl(0 0% 50%)'
                      : 'hsl(200 50% 60%)',
                }}>
                  {weather.waterRec.message}
                </span>
              </div>
            )}

            {/* Seasonal Movement */}
            {lunar.seasonalMovement.active && (
              <div className="text-[8px] font-mono text-right" style={{ color: 'hsl(270 30% 50%)' }}>
                <div>{lunar.seasonalMovement.name}</div>
                <div>{lunar.seasonalMovement.frequencyRange}</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ═══ Zone Quick-Selector ═══ */}
      <motion.div
        className="mx-auto max-w-2xl px-4 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div
          className="rounded-xl px-3 py-2 flex items-center gap-2 overflow-x-auto"
          style={{
            background: 'hsl(0 0% 5% / 0.8)',
            border: '1px solid hsl(0 0% 12%)',
          }}
        >
          <span className="text-[8px] font-mono tracking-widest shrink-0" style={{ color: 'hsl(0 0% 35%)' }}>
            ZONE
          </span>
          {ZONES.map(zone => {
            const isActive = selectedZone?.hz === zone.hz;
            return (
              <button
                key={zone.hz}
                onClick={() => {
                  if (!environment) setEnvironment('raised-bed');
                  setSelectedZone(zone);
                  setSeasonalOverride(false);
                  setManualOverrides({});
                  setStarCrop(null);
                  setIsSaved(false);
                  setStep(3);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-full shrink-0 transition-all"
                style={{
                  background: isActive ? `${zone.color}20` : 'transparent',
                  border: `1.5px solid ${isActive ? zone.color : 'hsl(0 0% 15%)'}`,
                  boxShadow: isActive ? `0 0 10px ${zone.color}30` : 'none',
                }}
                title={`${zone.note} — ${zone.name} (${zone.hz}Hz)`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: zone.color,
                    boxShadow: `0 0 6px ${zone.color}60`,
                  }}
                />
                <span
                  className="text-[10px] font-mono font-bold"
                  style={{ color: isActive ? zone.color : 'hsl(0 0% 45%)' }}
                >
                  {zone.note}
                </span>
              </button>
            );
          })}
        </div>

        {/* USDA Hardiness Zone Picker */}
        <div
          className="rounded-xl px-3 py-2 mt-2 flex flex-col gap-2"
          style={{
            background: 'hsl(0 0% 5% / 0.8)',
            border: `1px solid ${hardinessZone ? 'hsl(140 40% 25%)' : 'hsl(0 0% 12%)'}`,
          }}
        >
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => { setShowZonePicker(!showZonePicker); setShowStateDropdown(false); }}
              className="flex items-center gap-1.5 shrink-0"
            >
              <MapPin className="w-3 h-3" style={{ color: hardinessZone ? 'hsl(140 60% 55%)' : 'hsl(0 0% 35%)' }} />
              <span className="text-[8px] font-mono tracking-widest" style={{ color: hardinessZone ? 'hsl(140 50% 60%)' : 'hsl(0 0% 35%)' }}>
                {hardinessZone
                  ? `USDA ${hardinessSubZone || hardinessZone}${selectedState ? ` · ${STATE_HARDINESS_ZONES[selectedState]?.abbr || selectedState}` : ''}`
                  : 'GROW ZONE'}
              </span>
              {zoneMatchCount !== null && (
                <span
                  className="text-[8px] font-mono px-1.5 py-0.5 rounded-full"
                  style={{
                    background: 'hsl(140 30% 15% / 0.6)',
                    color: 'hsl(140 50% 60%)',
                    border: '1px solid hsl(140 40% 25% / 0.4)',
                  }}
                >
                  {zoneMatchCount}
                </span>
              )}
              <ChevronDown className="w-2.5 h-2.5" style={{ color: 'hsl(0 0% 35%)', transform: showZonePicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Auto-detect by state button */}
            {!showZonePicker && !hardinessZone && (
              <button
                onClick={() => { setShowStateDropdown(!showStateDropdown); setShowZonePicker(false); }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0"
                style={{ background: 'hsl(200 30% 12%)', border: '1px solid hsl(200 40% 25%)' }}
              >
                <Navigation className="w-2.5 h-2.5" style={{ color: 'hsl(200 50% 55%)' }} />
                <span className="text-[8px] font-mono" style={{ color: 'hsl(200 50% 60%)' }}>BY STATE</span>
              </button>
            )}

            {!showZonePicker && hardinessZone && (
              <button
                onClick={() => {
                  setHardinessZone(null);
                  setHardinessSubZone(null);
                  setSelectedState(null);
                  toast({ title: 'Zone filter cleared', description: 'Showing all crops.' });
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0"
                style={{ background: 'hsl(0 30% 15%)', border: '1px solid hsl(0 40% 30%)' }}
              >
                <X className="w-2.5 h-2.5" style={{ color: 'hsl(0 50% 55%)' }} />
                <span className="text-[8px] font-mono" style={{ color: 'hsl(0 50% 60%)' }}>CLEAR</span>
              </button>
            )}

            {showZonePicker && (
              <div className="flex items-center gap-0.5 flex-wrap">
                {Array.from({ length: 13 }, (_, i) => i + 1).flatMap(z => 
                  ['a', 'b'].map(sub => {
                    const subZoneStr = `${z}${sub}`;
                    const isActive = hardinessSubZone === subZoneStr;
                    return (
                      <button
                        key={subZoneStr}
                        onClick={() => {
                          setHardinessZone(isActive ? null : z);
                          setHardinessSubZone(isActive ? null : subZoneStr);
                          setSelectedState(null);
                          setShowZonePicker(false);
                          toast({
                            title: isActive ? 'Zone filter cleared' : `🌍 USDA Zone ${subZoneStr} selected`,
                            description: isActive ? 'Showing all crops.' : `Crops filtered for hardiness zone ${subZoneStr}.`,
                          });
                        }}
                        className="px-1.5 py-1 rounded font-mono text-[9px] font-bold transition-all shrink-0"
                        style={{
                          background: isActive ? 'hsl(140 40% 20%)' : 'hsl(0 0% 8%)',
                          border: `1px solid ${isActive ? 'hsl(140 60% 45%)' : 'hsl(0 0% 18%)'}`,
                          color: isActive ? 'hsl(140 70% 65%)' : 'hsl(0 0% 50%)',
                          boxShadow: isActive ? '0 0 8px hsl(140 50% 35% / 0.3)' : 'none',
                        }}
                      >
                        {subZoneStr}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* State dropdown for auto-detect */}
          <AnimatePresence>
            {showStateDropdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className="grid grid-cols-3 sm:grid-cols-4 gap-1 max-h-48 overflow-y-auto rounded-lg p-2"
                  style={{ background: 'hsl(0 0% 3%)', border: '1px solid hsl(0 0% 12%)' }}
                >
                  {US_STATES.map(state => {
                    const info = STATE_HARDINESS_ZONES[state];
                    const isActive = selectedState === state;
                    return (
                      <button
                        key={state}
                        onClick={() => {
                          setSelectedState(state);
                          setHardinessZone(info.zone);
                          setHardinessSubZone(info.subZone);
                          setShowStateDropdown(false);
                          toast({
                            title: `🌍 ${state} — ${info.label}`,
                            description: `Crops filtered for USDA hardiness zone ${info.subZone}.`,
                          });
                        }}
                        className="text-left px-2 py-1.5 rounded-md font-mono text-[9px] transition-all truncate"
                        style={{
                          background: isActive ? 'hsl(140 40% 15%)' : 'hsl(0 0% 6%)',
                          border: `1px solid ${isActive ? 'hsl(140 50% 35%)' : 'hsl(0 0% 15%)'}`,
                          color: isActive ? 'hsl(140 60% 65%)' : 'hsl(0 0% 55%)',
                        }}
                        title={`${state} — ${info.label}`}
                      >
                        {info.abbr}
                        <span className="ml-1 opacity-60">{info.subZone}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ═══ Weather Alert Banners ═══ */}
      <AnimatePresence>
        {!weather.isLoading && weather.alerts.length > 0 && weather.alerts.map((alert, i) => (
          <motion.div
            key={alert.type + i}
            className="mx-auto max-w-2xl px-4 mt-2"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div
              className="rounded-xl px-4 py-3 flex items-start gap-3"
              style={{
                background: alert.type === 'frost'
                  ? 'linear-gradient(135deg, hsl(200 60% 12%), hsl(210 50% 8%))'
                  : alert.type === 'heat'
                    ? 'linear-gradient(135deg, hsl(0 60% 12%), hsl(15 50% 8%))'
                    : 'linear-gradient(135deg, hsl(45 60% 12%), hsl(30 50% 8%))',
                border: `1px solid ${alert.type === 'frost'
                  ? 'hsl(200 60% 40% / 0.5)'
                  : alert.type === 'heat'
                    ? 'hsl(0 60% 40% / 0.5)'
                    : 'hsl(45 60% 40% / 0.5)'}`,
                boxShadow: `0 0 20px ${alert.type === 'frost'
                  ? 'hsl(200 60% 30% / 0.2)'
                  : alert.type === 'heat'
                    ? 'hsl(0 60% 30% / 0.2)'
                    : 'hsl(45 60% 30% / 0.2)'}`,
              }}
            >
              <span className="text-xl shrink-0 mt-0.5">
                {alert.type === 'frost' ? '🥶' : alert.type === 'heat' ? '🔥' : '⛈️'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <AlertTriangle className="w-3.5 h-3.5" style={{
                    color: alert.type === 'frost'
                      ? 'hsl(200 70% 65%)'
                      : 'hsl(0 70% 60%)',
                  }} />
                  <span className="text-xs font-mono font-bold" style={{
                    color: alert.type === 'frost'
                      ? 'hsl(200 70% 70%)'
                      : 'hsl(0 70% 65%)',
                  }}>
                    {alert.message}
                  </span>
                </div>
                <p className="text-[10px] font-body mt-1 leading-relaxed" style={{
                  color: alert.type === 'frost'
                    ? 'hsl(200 40% 60%)'
                    : 'hsl(0 40% 60%)',
                }}>
                  {alert.actionNote}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 2-Week Task Dashboard */}
      <TwoWeekDashboard />

      {/* Spacer for fixed header */}
      <div className="h-2" />

      {/* Content Area */}
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {/* ═══ STEP 1: Environment ═══ */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-center text-2xl md:text-3xl font-bubble mb-2" style={{ color: 'hsl(45 80% 55%)' }}>
                Where are you growing?
              </h2>
              <p className="text-center text-sm font-mono mb-8" style={{ color: 'hsl(0 0% 45%)' }}>
                STEP 1 — THE ENVIRONMENT
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ENVIRONMENTS.filter(env => proMode || (env.id !== 'farm' && env.id !== 'high-tunnel' && env.id !== 'food-forest')).map(env => (
                  <motion.button
                    key={env.id}
                    onClick={() => { setEnvironment(env.id); setStep(2); }}
                    className="p-6 rounded-2xl text-left transition-all"
                    style={{
                      background: environment === env.id
                        ? 'linear-gradient(135deg, hsl(45 80% 55% / 0.1), hsl(0 0% 8%))'
                        : 'hsl(0 0% 6%)',
                      border: `2px solid ${environment === env.id ? 'hsl(45 80% 55% / 0.5)' : 'hsl(0 0% 12%)'}`,
                    }}
                    whileHover={{ scale: 1.02, borderColor: 'hsl(45 80% 55% / 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div style={{ color: 'hsl(45 80% 55%)' }}>{env.icon}</div>
                      <div>
                        <h3 className="font-bubble text-lg" style={{ color: 'hsl(40 50% 90%)' }}>{env.label}</h3>
                        <p className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>{env.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-xs font-body" style={{ color: 'hsl(0 0% 55%)' }}>{env.description}</p>
                    {env.id === 'high-tunnel' && (
                      <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                        <EcoParadigmCard variant="compact" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 2: Vibe / Zone ═══ */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-center text-2xl md:text-3xl font-bubble mb-2" style={{ color: 'hsl(45 80% 55%)' }}>
                What energy do you need?
              </h2>
              <p className="text-center text-sm font-mono mb-8" style={{ color: 'hsl(0 0% 45%)' }}>
                STEP 2 — THE VIBE
              </p>

              <div className="grid grid-cols-1 gap-3">
                {ZONES.map(zone => {
                  const inSeason = isZoneInSeason(zone.hz, lunar.seasonalMovement);
                  return (
                    <motion.button
                      key={zone.hz}
                      onClick={() => {
                        setSelectedZone(zone);
                        setSeasonalOverride(false);
                        setStep(3);
                      }}
                      className="p-4 rounded-xl text-left transition-all flex items-center gap-4"
                      style={{
                        background: `linear-gradient(90deg, ${zone.color}08, hsl(0 0% 6%))`,
                        border: `2px solid ${zone.color}30`,
                        opacity: inSeason ? 1 : 0.55,
                      }}
                      whileHover={{
                        scale: 1.01,
                        borderColor: zone.color + '80',
                        boxShadow: `0 0 20px ${zone.color}20`,
                      }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: `radial-gradient(circle at 35% 35%, ${zone.color}40, ${zone.color}15)`,
                          border: `2px solid ${zone.color}50`,
                          boxShadow: `0 0 15px ${zone.color}20`,
                        }}
                      >
                        <span className="text-xs font-mono font-bold" style={{ color: zone.color }}>
                          {zone.note}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bubble text-lg" style={{ color: zone.color }}>
                            {zone.vibe}
                          </h3>
                          <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                            {zone.hz}Hz
                          </span>
                          {!inSeason && (
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                              background: 'hsl(40 80% 45% / 0.15)',
                              color: 'hsl(40 80% 55%)',
                            }}>
                              OFF-SEASON
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-body" style={{ color: 'hsl(0 0% 50%)' }}>
                          {zone.description}
                        </p>
                      </div>

                      <ArrowRight className="w-4 h-4 shrink-0" style={{ color: zone.color + '60' }} />
                    </motion.button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-6 flex items-center gap-2 mx-auto text-xs font-mono"
                style={{ color: 'hsl(0 0% 40%)' }}
              >
                <ArrowLeft className="w-3 h-3" /> BACK
              </button>
            </motion.div>
          )}

          {/* ═══ STEP 3: The Recipe ═══ */}
          {step === 3 && selectedZone && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-center text-2xl md:text-3xl font-bubble mb-1" style={{ color: selectedZone.color }}>
                Your {selectedZone.vibe} Recipe
              </h2>
              <p className="text-center text-sm font-mono mb-2" style={{ color: 'hsl(0 0% 45%)' }}>
                STEP 3 — {proMode ? 'THE 13TH CHORD' : 'THE TRIAD'}
              </p>
              {/* ═══ Shuffle / Reroll Button ═══ */}
              <div className="flex justify-center mb-2">
                <button
                  onClick={() => setRecipeSeed(s => s + 1)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all hover:scale-105"
                  style={{
                    background: `${selectedZone.color}18`,
                    color: selectedZone.color,
                    border: `1px solid ${selectedZone.color}30`,
                  }}
                  title="Rotate crops — shuffle different species into each slot"
                >
                  <Shuffle className="w-3 h-3" />
                  SHUFFLE VOICING
                </button>
              </div>
              {/* ═══ Inline Key Changer ═══ */}
              <div className="flex items-center justify-center gap-1.5 mb-4 flex-wrap">
                <span className="text-[9px] font-mono tracking-widest mr-1" style={{ color: 'hsl(0 0% 35%)' }}>
                  KEY:
                </span>
                {ZONES.map(zone => {
                  const isActive = selectedZone.hz === zone.hz;
                  return (
                    <button
                      key={zone.hz}
                      onClick={() => {
                        if (zone.hz !== selectedZone.hz) {
                          setSelectedZone(zone);
                          setManualOverrides({});
                          setStarCrop(null);
                          setIsSaved(false);
                          setShowStarPicker(false);
                          toast({
                            title: `🎵 Key changed to ${zone.note} (${zone.hz}Hz)`,
                            description: `Recipe retuned to ${zone.vibe}.`,
                          });
                        }
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full font-mono text-[10px] tracking-wider transition-all"
                      style={{
                        background: isActive
                          ? `${zone.color}20`
                          : 'hsl(0 0% 8%)',
                        border: `1.5px solid ${isActive ? zone.color : 'hsl(0 0% 15%)'}`,
                        color: isActive ? zone.color : 'hsl(0 0% 40%)',
                        boxShadow: isActive ? `0 0 12px ${zone.color}25` : 'none',
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: isActive ? zone.color : `${zone.color}40`,
                          boxShadow: isActive ? `0 0 6px ${zone.color}50` : 'none',
                        }}
                      />
                      {zone.note}
                    </button>
                  );
                })}
                {/* Tool icons */}
                <div className="flex items-center gap-1 ml-2">
                  {[
                    { id: 'soil' as const, icon: <Beaker className="w-3.5 h-3.5" />, tip: 'Soil Protocol' },
                    { id: 'calendar' as const, icon: <Calendar className="w-3.5 h-3.5" />, tip: 'Planting Calendar' },
                    { id: 'modal' as const, icon: <Music className="w-3.5 h-3.5" />, tip: 'Modal Guide' },
                    ...((environment === 'food-forest' || proMode) ? [{ id: 'scent' as const, icon: <Shield className="w-3.5 h-3.5" />, tip: 'Scent Corridor' }] : []),
                    ...(environment === 'food-forest' ? [{ id: 'hole' as const, icon: <TreePine className="w-3.5 h-3.5" />, tip: 'Hole Protocol' }] : []),
                    { id: 'propagation' as const, icon: <Sprout className="w-3.5 h-3.5" />, tip: 'Seed Starting' },
                    ...(proMode ? [{ id: 'suppliers' as const, icon: <Shovel className="w-3.5 h-3.5" />, tip: 'Pro Suppliers' }] : []),
                  ].map(tool => {
                    const isActive = activeToolPanel === tool.id;
                    return (
                      <div key={tool.id} className="relative group">
                        <button
                          onClick={() => setActiveToolPanel(isActive ? null : tool.id)}
                          className="p-1.5 rounded-lg transition-all"
                          style={{
                            background: isActive ? `${selectedZone.color}20` : 'hsl(0 0% 8%)',
                            border: `1.5px solid ${isActive ? selectedZone.color : 'hsl(0 0% 15%)'}`,
                            color: isActive ? selectedZone.color : 'hsl(0 0% 40%)',
                            boxShadow: isActive ? `0 0 10px ${selectedZone.color}25` : 'none',
                          }}
                          title={tool.tip}
                        >
                          {tool.icon}
                        </button>
                        {/* Tooltip */}
                        <span
                          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] font-mono tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                          style={{ color: 'hsl(0 0% 40%)' }}
                        >
                          {tool.tip}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ═══ Inline Tool Panels ═══ */}
              <AnimatePresence mode="wait">
                {activeToolPanel === 'soil' && (
                  <motion.div
                    key="soil-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mb-2"
                  >
                    <SoilLinkPanel
                      frequencyHz={selectedZone.hz}
                      environment={environment!}
                      zoneColor={selectedZone.color}
                      zoneName={selectedZone.name}
                    />
                  </motion.div>
                )}
                {activeToolPanel === 'calendar' && chordCard.length > 0 && (
                  <motion.div
                    key="calendar-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mb-2"
                  >
                    <PlantingCalendar
                      crops={chordCard.map(s => s.crop || null)}
                      labels={chordCard.map(s => s.label)}
                      zoneColor={selectedZone.color}
                      hardinessZone={hardinessZone}
                    />
                  </motion.div>
                )}
                {activeToolPanel === 'modal' && (
                  <motion.div
                    key="modal-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mb-2"
                  >
                    <ModalReference />
                  </motion.div>
                )}
                {activeToolPanel === 'scent' && allCrops && (
                  <motion.div
                    key="scent-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mb-2"
                  >
                    <ScentCorridorPanel
                      frequencyHz={selectedZone.hz}
                      zoneColor={selectedZone.color}
                      zoneName={selectedZone.name}
                      chordCrops={chordCard.map(s => s.crop || null)}
                      allCrops={allCrops}
                    />
                  </motion.div>
                )}
                {activeToolPanel === 'propagation' && (
                  <motion.div
                    key="propagation-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mb-2"
                  >
                    <PropagationPanel
                      zoneColor={selectedZone.color}
                      zoneName={selectedZone.name}
                      environment={environment || undefined}
                      hardinessZone={hardinessZone}
                    />
                  </motion.div>
                )}
                {activeToolPanel === 'hole' && (
                  <motion.div
                    key="hole-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mb-2"
                  >
                    <FoodForestHoleProtocol zoneColor={selectedZone.color} />
                  </motion.div>
                )}
                {activeToolPanel === 'suppliers' && (
                  <motion.div
                    key="suppliers-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mb-2"
                  >
                    <ProSuppliersPanel
                      zoneColor={selectedZone.color}
                      zoneName={selectedZone.name}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {<motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <button
                  onClick={() => { setShowStarPicker(!showStarPicker); setStarSearchQuery(''); }}
                  className="w-full py-3 rounded-xl font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: starCrop
                      ? `linear-gradient(135deg, ${selectedZone.color}12, hsl(0 0% 6%))`
                      : 'hsl(0 0% 6%)',
                    border: `1px solid ${starCrop ? selectedZone.color + '40' : 'hsl(0 0% 12%)'}`,
                    color: starCrop ? selectedZone.color : 'hsl(45 80% 55%)',
                  }}
                >
                  <span className="text-base">🌟</span>
                  {starCrop
                    ? `STAR: ${(starCrop.common_name || starCrop.name).toUpperCase()}`
                    : 'CHOOSE YOUR STAR CROP'}
                </button>

                <AnimatePresence>
                  {showStarPicker && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2">
                        <div
                          className="flex items-center gap-2 px-4 py-3 rounded-xl mb-2"
                          style={{
                            background: 'hsl(0 0% 6%)',
                            border: `1px solid ${selectedZone.color}20`,
                          }}
                        >
                          <Search className="w-4 h-4 shrink-0" style={{ color: selectedZone.color + '60' }} />
                          <input
                            type="text"
                            value={starSearchQuery}
                            onChange={e => setStarSearchQuery(e.target.value)}
                            placeholder={`Search by name, mineral, guild role, season...`}
                            className="bg-transparent flex-1 text-sm font-body outline-none"
                            style={{ color: 'hsl(0 0% 80%)' }}
                            autoFocus
                          />
                          {starSearchQuery && (
                            <button onClick={() => setStarSearchQuery('')}>
                              <X className="w-4 h-4" style={{ color: 'hsl(0 0% 35%)' }} />
                            </button>
                          )}
                        </div>

                        <div
                          className="rounded-xl overflow-hidden divide-y max-h-64 overflow-y-auto"
                          style={{
                            background: 'hsl(0 0% 5%)',
                            border: `1px solid ${selectedZone.color}15`,
                          }}
                        >
                          {/* Clear star option */}
                          {starCrop && (
                            <button
                              className="px-4 py-3 w-full text-left flex items-center gap-3 transition-all"
                              style={{ borderColor: 'hsl(0 0% 10%)' }}
                              onClick={() => {
                                setStarCrop(null);
                                setManualOverrides({});
                                setShowStarPicker(false);
                                setIsSaved(false);
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'hsl(0 60% 30% / 0.1)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <X className="w-3 h-3" style={{ color: 'hsl(0 60% 60%)' }} />
                              <span className="text-xs font-mono" style={{ color: 'hsl(0 60% 60%)' }}>
                                CLEAR STAR — USE AUTO-SELECT
                              </span>
                            </button>
                          )}

                          {filteredStarCandidates.map(crop => {
                            const isSelected = starCrop?.id === crop.id;
                            const ready = isCropLunarReady(crop.category, crop.common_name || crop.name, lunar.plantingType);
                            const cropZone = ZONES.find(z => z.hz === crop.frequency_hz);
                            return (
                              <button
                                key={crop.id}
                                className="px-4 py-3 w-full text-left flex items-center gap-3 transition-all"
                                style={{
                                  borderColor: 'hsl(0 0% 10%)',
                                  background: isSelected ? `${(cropZone?.color || selectedZone.color)}10` : 'transparent',
                                }}
                                onClick={() => {
                                  setStarCrop(crop);
                                  setManualOverrides({});
                                  setShowStarPicker(false);
                                  setIsSaved(false);
                                  toast({
                                    title: `🌟 ${crop.common_name || crop.name}`,
                                    description: crop.frequency_hz === selectedZone.hz
                                      ? 'Chord rebuilt around your Star.'
                                      : `Cross-zone Star! Chord now tuned to ${crop.frequency_hz}Hz (${cropZone?.name || crop.zone_name}).`,
                                  });
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = `${(cropZone?.color || selectedZone.color)}08`; }}
                                onMouseLeave={e => { e.currentTarget.style.background = isSelected ? `${(cropZone?.color || selectedZone.color)}10` : 'transparent'; }}
                              >
                                <div
                                  className="w-3 h-3 rounded-full shrink-0"
                                  style={{ background: isSelected ? (cropZone?.color || selectedZone.color) : `${(cropZone?.color || selectedZone.color)}50` }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-body truncate" style={{ color: isSelected ? (cropZone?.color || selectedZone.color) : 'hsl(0 0% 80%)' }}>
                                      {crop.common_name || crop.name}
                                    </span>
                                    {isSelected && <span className="text-[8px]">🌟</span>}
                                    {crop.frequency_hz !== selectedZone.hz && (
                                      <span className="text-[8px] font-mono px-1 py-0.5 rounded shrink-0" style={{
                                        background: `${cropZone?.color || 'hsl(0 0% 50%)'}15`,
                                        color: cropZone?.color || 'hsl(0 0% 60%)',
                                      }}>
                                        {crop.frequency_hz}Hz
                                      </span>
                                    )}
                                    {ready && (
                                      <span className="text-[8px] font-mono px-1 py-0.5 rounded shrink-0" style={{
                                        background: 'hsl(120 50% 25% / 0.3)',
                                        color: 'hsl(120 60% 60%)',
                                      }}>
                                        {lunar.phaseEmoji} READY
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 flex-wrap mt-0.5">
                                    <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                                      {crop.frequency_hz}Hz • {cropZone?.name || crop.zone_name} • {crop.category}
                                      {crop.chord_interval ? ` • ${crop.chord_interval}` : ''}
                                      {crop.dominant_mineral ? ` • ${crop.dominant_mineral}` : ''}
                                    </span>
                                    <GrowthHabitBadge habit={crop.growth_habit} size="sm" />
                                    <TrapCropBadge description={crop.description} guildRole={crop.guild_role} size="sm" />
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>}

              {/* ─── Seasonal Gate Warning ─── */}
              {seasonalGate && !seasonalOverride && (
                <motion.div
                  className="mb-4 p-4 rounded-xl flex items-start gap-3"
                  style={{
                    background: 'hsl(40 80% 20% / 0.15)',
                    border: '1px solid hsl(40 80% 45% / 0.3)',
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'hsl(40 80% 55%)' }} />
                  <div className="flex-1">
                    <p className="text-xs font-mono font-bold mb-1" style={{ color: 'hsl(40 80% 55%)' }}>
                      SEASONAL ADVISORY
                    </p>
                    <p className="text-xs font-body" style={{ color: 'hsl(40 50% 65%)' }}>
                      {seasonalGate}
                    </p>
                    <button
                      onClick={() => setSeasonalOverride(true)}
                      className="mt-2 text-[10px] font-mono px-3 py-1 rounded"
                      style={{
                        background: 'hsl(40 60% 30% / 0.2)',
                        color: 'hsl(40 60% 60%)',
                        border: '1px solid hsl(40 60% 40% / 0.3)',
                      }}
                    >
                      PROCEED ANYWAY →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Chord Card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'hsl(0 0% 5%)',
                  border: `2px solid ${selectedZone.color}30`,
                  boxShadow: `0 0 40px ${selectedZone.color}10`,
                }}
              >
                {/* Header strip */}
                {(() => {
                  // Compute season compatibility % across ALL 7 voices
                  const rootCrop = chordCard[0]?.crop;
                  const rootSeasons = rootCrop?.planting_season || [];
                  const allCompanions = chordCard.slice(1);
                  const slotsWithCrops = allCompanions.filter(s => s.crop);
                  const compatible = slotsWithCrops.filter(s => {
                    const cs = s.crop!.planting_season || [];
                    if (rootSeasons.length === 0 || cs.length === 0) return false;
                    return rootSeasons.some(rs => cs.includes(rs));
                  });
                  const pct = slotsWithCrops.length > 0
                    ? Math.round((compatible.length / slotsWithCrops.length) * 100)
                    : 0;
                  const hasData = rootSeasons.length > 0 && slotsWithCrops.length > 0;
                  const pctColor = pct >= 80 ? 'hsl(120 50% 55%)' : pct >= 50 ? 'hsl(45 70% 55%)' : 'hsl(0 50% 55%)';
                  const pctBg = pct >= 80 ? 'hsl(120 50% 20% / 0.3)' : pct >= 50 ? 'hsl(45 60% 20% / 0.3)' : 'hsl(0 50% 20% / 0.3)';
                  const pctBorder = pct >= 80 ? 'hsl(120 50% 35% / 0.4)' : pct >= 50 ? 'hsl(45 60% 35% / 0.4)' : 'hsl(0 50% 35% / 0.4)';

                  // Zone compatibility calculation
                  const zoneFit = slotsWithCrops.filter(s => {
                    const c = s.crop!;
                    return c.hardiness_zone_min != null && c.hardiness_zone_max != null &&
                      hardinessZone >= c.hardiness_zone_min && hardinessZone <= c.hardiness_zone_max;
                  });
                  const zPct = slotsWithCrops.length > 0 ? Math.round((zoneFit.length / slotsWithCrops.length) * 100) : 0;
                  const zColor = zPct >= 80 ? 'hsl(120 50% 55%)' : zPct >= 50 ? 'hsl(45 70% 55%)' : 'hsl(0 50% 55%)';
                  const zBg = zPct >= 80 ? 'hsl(120 50% 20% / 0.3)' : zPct >= 50 ? 'hsl(45 60% 20% / 0.3)' : 'hsl(0 50% 20% / 0.3)';
                  const zBorder = zPct >= 80 ? 'hsl(120 50% 35% / 0.4)' : zPct >= 50 ? 'hsl(45 60% 35% / 0.4)' : 'hsl(0 50% 35% / 0.4)';
                  const hasZoneData = slotsWithCrops.length > 0 && hardinessZone > 0;

                  return (
                    <div
                      className="px-5 py-3 flex items-center gap-3"
                      style={{
                        background: `linear-gradient(90deg, ${selectedZone.color}15, transparent)`,
                        borderBottom: `1px solid ${selectedZone.color}20`,
                      }}
                    >
                      <Sparkles className="w-4 h-4" style={{ color: selectedZone.color }} />
                      <span className="font-mono text-xs font-bold tracking-wider" style={{ color: selectedZone.color }}>
                        {proMode ? '7-VOICE PLANTING CHORD' : '3-VOICE TRIAD'}
                      </span>
                      <div className="ml-auto flex items-center gap-2">
                        {hasData && (
                          <span
                            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                            style={{
                              background: pctBg,
                              color: pctColor,
                              border: `1px solid ${pctBorder}`,
                            }}
                            title={`${compatible.length}/${slotsWithCrops.length} companions share a planting season with the star crop`}
                          >
                            📅 {pct}% SEASON SYNC
                          </span>
                        )}
                        {hasZoneData && (
                          <span
                            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                            style={{
                              background: zBg,
                              color: zColor,
                              border: `1px solid ${zBorder}`,
                            }}
                            title={`${zoneFit.length}/${slotsWithCrops.length} crops rated for Zone ${hardinessZone % 1 === 0.5 ? Math.floor(hardinessZone) + 'b' : Math.floor(hardinessZone) + 'a'}`}
                          >
                            🌡️ {zPct}% ZONE FIT
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Modal Signature Badge — expandable */}
                {modalSignature && (
                  <div
                    className="cursor-pointer select-none"
                    onClick={() => setModalInfoOpen(prev => !prev)}
                  >
                    <div
                      className="px-5 py-2 flex items-center gap-2"
                      style={{
                        background: `linear-gradient(90deg, ${selectedZone.color}08, transparent)`,
                        borderBottom: modalInfoOpen ? 'none' : '1px solid hsl(0 0% 8%)',
                      }}
                    >
                      <span
                        className="text-[9px] font-mono px-2 py-0.5 rounded-full inline-flex items-center gap-1.5"
                        style={{
                          background: `${selectedZone.color}10`,
                          color: `${selectedZone.color}cc`,
                          border: `1px solid ${selectedZone.color}25`,
                        }}
                      >
                        <span style={{ fontSize: '11px' }}>🎵</span>
                        {modalSignature.mode} {modalSignature.symbol}
                      </span>
                      <span className="text-[8px] font-mono italic" style={{ color: 'hsl(0 0% 40%)' }}>
                        {modalSignature.mood}
                      </span>
                      <span
                        className="text-[7px] font-mono ml-auto px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                        style={{
                          background: 'hsl(0 0% 8%)',
                          color: 'hsl(0 0% 35%)',
                        }}
                      >
                        {modalSignature.voiceCount}-VOICE {modalSignature.complexity.toUpperCase()}
                        <ChevronDown
                          className="w-2.5 h-2.5 transition-transform"
                          style={{
                            transform: modalInfoOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: 'hsl(0 0% 35%)',
                          }}
                        />
                      </span>
                    </div>
                    <AnimatePresence>
                      {modalInfoOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-5 pb-3 pt-1 space-y-2"
                            style={{ borderBottom: '1px solid hsl(0 0% 8%)' }}
                          >
                            <p className="text-[10px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 55%)' }}>
                              <span style={{ color: `${selectedZone.color}bb` }}>
                                {modalSignature.mode} mode
                              </span>{' '}
                              {modalSignature.mode === 'Ionian' && 'is the natural major scale — the brightest, most resolved sound. Your garden radiates stable, confident energy. Every crop has a clear role, like a sunny day with no clouds.'}
                              {modalSignature.mode === 'Dorian' && 'blends minor warmth with a raised 6th — soulful resilience. Your garden has depth and perseverance, like crops that thrive through adversity and come back stronger.'}
                              {modalSignature.mode === 'Phrygian' && 'starts with a flat 2nd — immediate tension and transformation. Your garden channels alchemical fire, converting raw elements into gold through intense metabolic energy.'}
                              {modalSignature.mode === 'Lydian' && 'floats on a raised 4th — dreamy, expansive, ethereal. Your garden breathes connection, with mycorrhizal networks bridging every plant into a unified, heartfelt ecosystem.'}
                              {modalSignature.mode === 'Mixolydian' && 'adds a flat 7th to major — dominant and expressive. Your garden projects outward like a beacon, with aromatic signals drawing pollinators and repelling pests.'}
                              {modalSignature.mode === 'Aeolian' && 'is the natural minor — introspective and ancient. Your garden turns inward, cultivating medicinal density and alkaloid richness that requires patience and vision.'}
                              {modalSignature.mode === 'Locrian' && 'holds a diminished 5th — the most unstable, mysterious mode. Your garden guards the threshold with sulfur shields and allium sentinels, protecting the source code of seeds.'}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                                style={{
                                  background: `${selectedZone.color}10`,
                                  color: `${selectedZone.color}90`,
                                  border: `1px solid ${selectedZone.color}20`,
                                }}
                              >
                                CHARACTERISTIC: {modalSignature.symbol}
                              </span>
                              <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                                {modalSignature.voiceCount === 7 ? 'Full ensemble — all 7 voices singing' :
                                 modalSignature.voiceCount >= 5 ? 'Rich voicing — add more voices for full harmony' :
                                 modalSignature.voiceCount >= 3 ? 'Core triad established — expand for deeper resonance' :
                                 'Sparse voicing — add crops to build harmonic depth'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="divide-y" style={{ borderColor: 'hsl(0 0% 10%)' }}>
                  {chordCard.map((slot, i) => {
                    // Beginner mode: only show Triad (Root, 3rd, 5th)
                    if (!proMode && i >= 3) return null;
                    const isReady = slot.crop
                      ? isCropLunarReady(slot.crop.category, slot.crop.common_name || slot.crop.name, lunar.plantingType)
                      : false;
                    return (
                      <motion.button
                        key={slot.key}
                        className="px-5 py-4 flex items-center gap-4 w-full text-left transition-all"
                        style={{
                          background: swapSlotIndex === i
                            ? `${selectedZone.color}10`
                            : 'transparent',
                          outline: swapSlotIndex === i
                            ? `2px solid ${selectedZone.color}60`
                            : 'none',
                          outlineOffset: '-2px',
                          borderRadius: swapSlotIndex === i ? '8px' : '0',
                        }}
                        onClick={() => {
                          if (swapSlotIndex === i) {
                            setSwapSlotIndex(null);
                          } else {
                            setSwapSlotIndex(i);
                            setSearchQuery('');
                          }
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="w-10 text-center text-lg">{environment === 'food-forest' && FOOD_FOREST_LAYERS[slot.key] ? FOOD_FOREST_LAYERS[slot.key].emoji : slot.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bubble text-sm" style={{ color: 'hsl(40 50% 90%)' }}>
                              {environment === 'food-forest' && FOOD_FOREST_LAYERS[slot.key] ? FOOD_FOREST_LAYERS[slot.key].label : slot.label}
                            </span>
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                              background: `${selectedZone.color}15`,
                              color: selectedZone.color,
                              border: `1px solid ${selectedZone.color}30`,
                            }}>
                              {slot.role}
                            </span>
                            {slot.crop && isReady && (
                              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                                background: 'hsl(120 50% 25% / 0.3)',
                                color: 'hsl(120 60% 60%)',
                                border: '1px solid hsl(120 50% 40% / 0.3)',
                              }}>
                                {lunar.phaseEmoji} READY NOW
                              </span>
                            )}
                            {starCrop && slot.isCompanionFill && !manualOverrides[i] && (
                              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                                background: 'hsl(45 80% 40% / 0.15)',
                                color: 'hsl(45 80% 55%)',
                                border: '1px solid hsl(45 80% 40% / 0.25)',
                              }}>
                                🤝 COMPANION
                              </span>
                            )}
                            {starCrop && slot.crop && !slot.isCompanionFill && i > 0 && !manualOverrides[i] && (
                              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                                background: 'hsl(0 0% 15% / 0.5)',
                                color: 'hsl(0 0% 40%)',
                              }}>
                                AUTO
                              </span>
                            )}
                            {swapSlotIndex === i && (
                              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded animate-pulse" style={{
                                background: `${selectedZone.color}20`,
                                color: selectedZone.color,
                              }}>
                                ↕ TAP A SEARCH RESULT TO SWAP
                              </span>
                            )}
                          </div>
                          {slot.crop ? (
                            <>
                              <p className="text-xs font-body mt-0.5 flex items-center gap-1 flex-wrap" style={{ color: 'hsl(0 0% 65%)' }}>
                                {slot.crop.common_name || slot.crop.name}
                                {slot.crop.spacing_inches && (
                                  <span style={{ color: 'hsl(0 0% 35%)' }}> • {slot.crop.spacing_inches}" spacing</span>
                                )}
                                {slot.crop.hardiness_zone_min != null && slot.crop.hardiness_zone_max != null && (
                                  <span
                                    className="text-[8px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"
                                    style={{
                                      background: 'hsl(140 30% 15% / 0.4)',
                                      color: 'hsl(140 50% 60%)',
                                      border: '1px solid hsl(140 40% 30% / 0.3)',
                                    }}
                                  >
                                    🌍 Zone {formatSubZone(slot.crop.hardiness_zone_min)}–{formatSubZone(slot.crop.hardiness_zone_max)}
                                  </span>
                                )}
                              </p>
                              {/* Growth Habit & Harvest Indicators */}
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                <GrowthHabitBadge habit={slot.crop!.growth_habit} size="sm" />
                                <TrapCropBadge description={slot.crop!.description} guildRole={slot.crop!.guild_role} size="sm" />
                                {(() => {
                                  const habit = (slot.crop!.growth_habit || '').toLowerCase();
                                  const needsTrellis = habit === 'vine' || habit === 'epiphyte';
                                  return needsTrellis ? (
                                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                                      style={{ background: 'hsl(270 40% 20% / 0.3)', color: 'hsl(270 50% 65%)', border: '1px solid hsl(270 40% 35% / 0.3)' }}>
                                      🪜 Trellis
                                    </span>
                                  ) : null;
                                })()}
                                {slot.crop!.harvest_days && (
                                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                                    style={{ background: 'hsl(45 40% 18% / 0.3)', color: 'hsl(45 60% 60%)', border: '1px solid hsl(45 40% 30% / 0.3)' }}>
                                    🌾 {slot.crop!.harvest_days}d harvest
                                  </span>
                                )}
                                {/* Zone-aware planting window */}
                                {slot.crop!.planting_season && slot.crop!.planting_season.length > 0 && hardinessZone && (
                                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                                    style={{ background: 'hsl(200 40% 18% / 0.3)', color: 'hsl(200 60% 60%)', border: '1px solid hsl(200 40% 30% / 0.3)' }}>
                                    📅 {getZoneAwarePlantingWindows(slot.crop!.planting_season, hardinessZone).map(w => w.window).join(' · ')}
                                  </span>
                                )}
                                {/* Zone incompatibility warning */}
                                {hardinessZone && slot.crop!.hardiness_zone_min != null && slot.crop!.hardiness_zone_max != null && !cropFitsZone(slot.crop!.hardiness_zone_min, slot.crop!.hardiness_zone_max, hardinessZone) && (
                                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                                    style={{ background: 'hsl(0 50% 15% / 0.4)', color: 'hsl(0 60% 60%)', border: '1px solid hsl(0 40% 30% / 0.3)' }}>
                                    ❄️ Not rated for Zone {hardinessSubZone || hardinessZone}
                                  </span>
                                )}
                                {/* Season mismatch warning */}
                                {i > 0 && slot.crop && (() => {
                                  const rootCropCard = chordCard[0]?.crop;
                                  if (!rootCropCard) return null;
                                  const rootSeasons = rootCropCard.planting_season || [];
                                  const slotSeasons = slot.crop!.planting_season || [];
                                  if (rootSeasons.length === 0 && slotSeasons.length === 0) return null;
                                  const hasOverlap = rootSeasons.some(s => slotSeasons.includes(s));
                                  if (!hasOverlap && rootSeasons.length > 0 && slotSeasons.length > 0) return (
                                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                                      style={{ background: 'hsl(0 50% 15% / 0.4)', color: 'hsl(0 60% 60%)', border: '1px solid hsl(0 40% 30% / 0.3)' }}>
                                      ⚠️ Season mismatch
                                    </span>
                                  );
                                  return null;
                                })()}
                              </div>
                            </>
                          ) : (
                            <p className="text-xs font-mono italic mt-0.5" style={{ color: 'hsl(0 0% 25%)' }}>
                              No match in registry
                            </p>
                          )}
                          {!proMode && (environment === 'food-forest' ? FOOD_FOREST_LAYERS[slot.key]?.hint : slot.hint) && (
                            <p className="text-[10px] mt-1 leading-snug" style={{ color: 'hsl(40 30% 50% / 0.6)' }}>
                              💡 {environment === 'food-forest' && FOOD_FOREST_LAYERS[slot.key] ? FOOD_FOREST_LAYERS[slot.key].hint : slot.hint}
                            </p>
                          )}
                        </div>
                        {manualOverrides[i] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setManualOverrides(prev => {
                                const next = { ...prev };
                                delete next[i];
                                return next;
                              });
                              setIsSaved(false);
                              toast({ title: `${slot.label} restored`, description: 'Reverted to auto-selected crop.' });
                            }}
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110"
                            style={{
                              background: 'hsl(0 0% 12%)',
                              border: '1px solid hsl(0 0% 20%)',
                            }}
                            title="Undo swap"
                          >
                            <Undo2 className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 55%)' }} />
                          </button>
                        )}
                        {slot.crop && !manualOverrides[i] && (
                          <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                            {slot.crop.frequency_hz}Hz
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Footer */}
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{
                    background: 'hsl(0 0% 4%)',
                    borderTop: `1px solid ${selectedZone.color}15`,
                  }}
                >
                  <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                    {environment === 'pot' ? '🪴 CONTAINER' : environment === 'farm' ? '🚜 FARM' : environment === 'high-tunnel' ? '🏠 HIGH TUNNEL' : environment === 'food-forest' ? '🌳 FOOD FOREST' : '🌱 RAISED BED'} MODE
                  </span>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                      style={{
                        background: 'hsl(200 50% 25% / 0.15)',
                        border: '1px solid hsl(200 40% 35% / 0.2)',
                      }}
                      title={
                        environment === 'pot' ? 'Bottom watering or hand-water daily'
                          : environment === 'farm' ? 'Center-pivot or flood irrigation'
                          : environment === 'high-tunnel' ? 'Inline drip tape, 12" emitter spacing'
                          : 'Drip irrigation, 6-8" emitter spacing'
                      }
                    >
                      <Droplets className="w-3 h-3" style={{ color: 'hsl(200 60% 55%)' }} />
                      <span className="text-[8px] font-mono" style={{ color: 'hsl(200 40% 55%)' }}>
                        {environment === 'pot' ? 'HAND WATER'
                          : environment === 'farm' ? 'FLOOD / PIVOT'
                          : environment === 'high-tunnel' ? 'DRIP TAPE 12"'
                          : 'DRIP LINE 6-8"'}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                      {recipeCrops.length} CROPS IN ZONE
                    </span>
                  </div>
                </div>
              </div>

              {/* Companion Notes — clickable to swap into chord slots */}
              {starCrop?.companion_crops && starCrop.companion_crops.length > 0 && (
                <motion.div
                  className="mt-4 p-4 rounded-xl"
                  style={{
                    background: 'hsl(0 0% 5%)',
                    border: '1px solid hsl(0 0% 12%)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-[9px] font-mono tracking-wider mb-2" style={{ color: 'hsl(45 80% 55% / 0.6)' }}>
                    ★ STAR COMPANIONS — {swapSlotIndex !== null ? 'TAP TO SWAP' : 'TAP A SLOT FIRST, THEN TAP A NAME'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {starCrop.companion_crops.map((name, ci) => {
                      // Find matching crop in registry
                      const matchedCrop = allCrops?.find(c => {
                        const cn = (c.common_name || c.name).toLowerCase();
                        const target = name.toLowerCase();
                        return cn.includes(target) || target.includes(cn.split('(')[0].trim());
                      });
                      const isSwappable = swapSlotIndex !== null && !!matchedCrop;
                      return (
                        <button
                          key={ci}
                          onClick={() => {
                            if (!matchedCrop) {
                              toast({ title: `"${name}" not found`, description: 'No match in the crop registry.' });
                              return;
                            }
                            if (swapSlotIndex !== null) {
                              handleSwapCrop(matchedCrop);
                            } else {
                              // Auto-pick the best non-root slot to swap
                              const bestSlot = chordCard.findIndex((s, idx) => idx > 0 && s.crop?.id !== matchedCrop.id);
                              if (bestSlot > 0) {
                                setManualOverrides(prev => ({ ...prev, [bestSlot]: matchedCrop }));
                                setIsSaved(false);
                                toast({
                                  title: `${INTERVAL_ORDER[bestSlot].label} swapped`,
                                  description: `Now: ${matchedCrop.common_name || matchedCrop.name}`,
                                });
                              }
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-body transition-all"
                          style={{
                            background: isSwappable
                              ? 'hsl(45 80% 40% / 0.15)'
                              : matchedCrop ? 'hsl(0 0% 8%)' : 'hsl(0 0% 6%)',
                            border: `1px solid ${isSwappable ? 'hsl(45 80% 40% / 0.3)' : matchedCrop ? 'hsl(0 0% 16%)' : 'hsl(0 0% 10%)'}`,
                            color: isSwappable
                              ? 'hsl(45 80% 65%)'
                              : matchedCrop ? 'hsl(0 0% 60%)' : 'hsl(0 0% 30%)',
                            cursor: matchedCrop ? 'pointer' : 'not-allowed',
                          }}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ═══ Unified Crop Search (below Star Picker) ═══ */}
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl"
                  style={{
                    background: 'hsl(0 0% 6%)',
                    border: `1px solid ${swapSlotIndex !== null ? selectedZone.color + '30' : 'hsl(0 0% 15%)'}`,
                  }}
                >
                  <Search className="w-4 h-4 shrink-0" style={{ color: swapSlotIndex !== null ? selectedZone.color + '60' : 'hsl(0 0% 35%)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={swapSlotIndex !== null
                      ? `Search to swap ${INTERVAL_ORDER[swapSlotIndex].label}...`
                      : 'Search by name, category, mineral, guild role, element, season...'
                    }
                    className="bg-transparent flex-1 text-sm font-body outline-none"
                    style={{ color: 'hsl(0 0% 80%)' }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-4 h-4" style={{ color: 'hsl(0 0% 35%)' }} />
                    </button>
                  )}
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div
                    className="mt-2 rounded-xl overflow-hidden divide-y max-h-64 overflow-y-auto"
                    style={{
                      background: 'hsl(0 0% 5%)',
                      border: '1px solid hsl(0 0% 12%)',
                    }}
                  >
                    {searchResults.map(crop => {
                      const zoneData = ZONES.find(z => z.hz === crop.frequency_hz);
                      const ready = isCropLunarReady(crop.category, crop.common_name || crop.name, lunar.plantingType);
                      return (
                        <button
                          key={crop.id}
                          className="px-4 py-3 flex items-center gap-3 w-full text-left transition-all"
                          style={{
                            borderColor: 'hsl(0 0% 10%)',
                            cursor: swapSlotIndex !== null ? 'pointer' : 'default',
                          }}
                          onClick={() => swapSlotIndex !== null && handleSwapCrop(crop)}
                          onMouseEnter={e => {
                            if (swapSlotIndex !== null) e.currentTarget.style.background = 'hsl(45 80% 55% / 0.05)';
                          }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ background: zoneData?.color || 'hsl(0 0% 30%)' }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-body truncate" style={{ color: 'hsl(0 0% 80%)' }}>
                                {crop.common_name || crop.name}
                              </span>
                              {ready && (
                                <span className="text-[8px] font-mono px-1 py-0.5 rounded shrink-0" style={{
                                  background: 'hsl(120 50% 25% / 0.3)',
                                  color: 'hsl(120 60% 60%)',
                                }}>
                                  {lunar.phaseEmoji} READY
                                </span>
                              )}
                              {swapSlotIndex !== null && (
                                <span className="text-[8px] font-mono px-1 py-0.5 rounded shrink-0" style={{
                                  background: `${selectedZone?.color || 'hsl(45 80% 55%)'}20`,
                                  color: selectedZone?.color || 'hsl(45 80% 55%)',
                                }}>
                                  TAP TO SWAP
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-wrap mt-0.5">
                              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                                {crop.frequency_hz}Hz • {zoneData?.name || crop.zone_name} • {crop.category}
                                {crop.chord_interval && ` • ${crop.chord_interval}`}
                              </span>
                              <GrowthHabitBadge habit={crop.growth_habit} size="sm" />
                              <TrapCropBadge description={crop.description} guildRole={crop.guild_role} size="sm" />
                            </div>
                          </div>
                          {crop.spacing_inches && (
                            <span className="text-[9px] font-mono shrink-0" style={{ color: 'hsl(0 0% 30%)' }}>
                              {crop.spacing_inches}"
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <p className="text-center text-xs font-mono mt-3" style={{ color: 'hsl(0 0% 30%)' }}>
                    No crops found for "{searchQuery}"
                  </p>
                )}
              </motion.div>

              {/* Save Recipe Button */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {userId ? (
                  <motion.button
                    onClick={handleSaveRecipe}
                    disabled={isSaving || isSaved}
                    className="w-full py-4 rounded-xl font-mono text-sm tracking-wider flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: isSaved
                        ? `linear-gradient(135deg, hsl(120 40% 25%), hsl(120 30% 18%))`
                        : `linear-gradient(135deg, ${selectedZone.color}25, hsl(0 0% 8%))`,
                      border: `2px solid ${isSaved ? 'hsl(120 50% 40%)' : selectedZone.color + '50'}`,
                      color: isSaved ? 'hsl(120 50% 70%)' : selectedZone.color,
                      boxShadow: isSaved ? '0 0 20px hsl(120 50% 30% / 0.2)' : `0 0 20px ${selectedZone.color}15`,
                    }}
                    whileHover={!isSaved ? { scale: 1.02, boxShadow: `0 0 30px ${selectedZone.color}30` } : {}}
                    whileTap={!isSaved ? { scale: 0.98 } : {}}
                  >
                    {isSaving ? (
                      <motion.div
                        className="w-4 h-4 border-2 rounded-full"
                        style={{ borderColor: `${selectedZone.color}40`, borderTopColor: selectedZone.color }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : isSaved ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'SAVING...' : isSaved ? 'RECIPE SAVED' : 'SAVE MY RECIPE'}
                  </motion.button>
                ) : (
                  <button
                    onClick={() => navigate('/auth')}
                    className="w-full py-4 rounded-xl font-mono text-sm tracking-wider flex items-center justify-center gap-2"
                    style={{
                      background: 'hsl(0 0% 8%)',
                      border: '2px solid hsl(0 0% 20%)',
                      color: 'hsl(0 0% 50%)',
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    SIGN IN TO SAVE RECIPE
                  </button>
                )}
              </motion.div>

              {/* Print Button */}
              <motion.div
                className="mt-6 print-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
              >
                <button
                  onClick={() => window.print()}
                  className="w-full py-3 rounded-xl font-mono text-[10px] tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.01] no-print"
                  style={{
                    background: 'hsl(0 0% 6%)',
                    border: '1px solid hsl(0 0% 15%)',
                    color: 'hsl(0 0% 45%)',
                  }}
                >
                  <Printer className="w-3.5 h-3.5" />
                  PRINT RECIPE CARD
                </button>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-xs font-mono"
                  style={{ color: 'hsl(0 0% 40%)' }}
                >
                  <ArrowLeft className="w-3 h-3" /> CHANGE VIBE
                </button>
                <button
                  onClick={() => { setStep(1); setEnvironment(null); setSelectedZone(null); }}
                  className="flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-full"
                  style={{
                    background: 'hsl(0 0% 10%)',
                    color: 'hsl(45 80% 55%)',
                    border: '1px solid hsl(45 80% 55% / 0.3)',
                  }}
                >
                  START OVER
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Saved Recipes ═══ */}
        {userId && savedRecipes && savedRecipes.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setShowSavedRecipes(!showSavedRecipes)}
              className="w-full py-3 rounded-xl font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all"
              style={{
                background: 'hsl(0 0% 6%)',
                border: '1px solid hsl(45 80% 55% / 0.15)',
                color: 'hsl(45 80% 55% / 0.7)',
              }}
            >
              <Leaf className="w-3.5 h-3.5" />
              MY RECIPES ({savedRecipes.length})
              {showSavedRecipes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showSavedRecipes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    {savedRecipes.map(recipe => {
                      const zone = ZONES.find(z => z.hz === recipe.zone_hz);
                      const chordSlots = Array.isArray(recipe.chord_data) ? recipe.chord_data as Array<{ label?: string; crop_name?: string | null; role?: string }> : [];
                      const filledCount = chordSlots.filter(s => s.crop_name).length;
                      const envLabel = recipe.environment === 'pot' ? '🪴' : recipe.environment === 'farm' ? '🚜' : recipe.environment === 'high-tunnel' ? '🏠' : recipe.environment === 'food-forest' ? '🌳' : '🌱';

                      return (
                        <motion.div
                          key={recipe.id}
                          className="rounded-xl overflow-hidden"
                          style={{
                            background: 'hsl(0 0% 5%)',
                            border: `1px solid ${zone?.color || 'hsl(0 0% 15%)'}20`,
                          }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {/* Recipe header */}
                          <div
                            className="px-4 py-3 flex items-center gap-3"
                            style={{
                              background: `linear-gradient(90deg, ${zone?.color || 'hsl(0 0% 30%)'}10, transparent)`,
                              borderBottom: `1px solid ${zone?.color || 'hsl(0 0% 15%)'}15`,
                            }}
                          >
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                              style={{
                                background: `${zone?.color || 'hsl(0 0% 30%)'}20`,
                                border: `1px solid ${zone?.color || 'hsl(0 0% 30%)'}40`,
                              }}
                            >
                              <span className="text-[10px] font-mono font-bold" style={{ color: zone?.color || 'hsl(0 0% 60%)' }}>
                                {zone?.note || '?'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bubble text-sm" style={{ color: zone?.color || 'hsl(0 0% 70%)' }}>
                                  {recipe.zone_vibe}
                                </span>
                                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                                  background: 'hsl(0 0% 10%)',
                                  color: 'hsl(0 0% 45%)',
                                }}>
                                  {envLabel} {recipe.environment?.toUpperCase()}
                                </span>
                                <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                                  {filledCount}/7 voices
                                </span>
                              </div>
                              <p className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                                {new Date(recipe.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {confirmDeleteId === recipe.id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    handleDeleteRecipe(recipe.id);
                                    setConfirmDeleteId(null);
                                  }}
                                  disabled={deletingRecipeId === recipe.id}
                                  className="px-2 py-1 rounded-lg text-[9px] font-mono font-bold transition-all hover:scale-105"
                                  style={{
                                    background: 'hsl(0 50% 20%)',
                                    color: 'hsl(0 60% 70%)',
                                    border: '1px solid hsl(0 40% 30%)',
                                  }}
                                >
                                  {deletingRecipeId === recipe.id ? '...' : 'DELETE'}
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-1 rounded-lg text-[9px] font-mono transition-all hover:scale-105"
                                  style={{
                                    background: 'hsl(0 0% 12%)',
                                    color: 'hsl(0 0% 45%)',
                                    border: '1px solid hsl(0 0% 18%)',
                                  }}
                                >
                                  KEEP
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(recipe.id)}
                                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110"
                                style={{
                                  background: 'hsl(0 0% 10%)',
                                  border: '1px solid hsl(0 0% 18%)',
                                }}
                                title="Delete recipe"
                              >
                                <Trash2 className="w-3 h-3" style={{ color: 'hsl(0 40% 50%)' }} />
                              </button>
                            )}
                          </div>

                          {/* Crop slots */}
                          <div className="px-4 py-2 space-y-1">
                            {chordSlots.map((slot, j) => (
                              <div key={j} className="flex items-center gap-2">
                                <span className="text-[9px] font-mono w-20 shrink-0" style={{ color: 'hsl(0 0% 30%)' }}>
                                  {slot.role || slot.label}
                                </span>
                                <span className="text-[10px] font-body truncate" style={{
                                  color: slot.crop_name ? 'hsl(0 0% 60%)' : 'hsl(0 0% 20%)',
                                  fontStyle: slot.crop_name ? 'normal' : 'italic',
                                }}>
                                  {slot.crop_name || '—'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Add New Recipe shortcut */}
                    <button
                      onClick={() => {
                        setStep(1);
                        setEnvironment(null);
                        setSelectedZone(null);
                        setShowSavedRecipes(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-3 rounded-xl font-mono text-[10px] tracking-wider flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: 'hsl(0 0% 6%)',
                        border: '1px dashed hsl(45 80% 55% / 0.2)',
                        color: 'hsl(45 80% 55% / 0.5)',
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      CREATE NEW RECIPE
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Griot Oracle — Floating Help */}
      <GriotOracle />

      {/* Mini Music Player */}
      <MiniMusicPlayer />
    </div>
  );
};

export default CropOracle;
