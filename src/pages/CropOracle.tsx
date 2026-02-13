import { useState, useMemo, useEffect, useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Leaf, Sprout, Tractor, Home as HomeIcon, Sparkles, Save, Check, LogIn, Moon, Search, AlertTriangle, X, Undo2, Droplets, Trash2, ChevronDown, ChevronUp, Thermometer, CloudRain, User, MapPin, Navigation, Printer, Beaker, Calendar, Music, TreePine, Shield, Shuffle, Shovel, Lock, Unlock, Sun, CloudSun, Cloud } from 'lucide-react';
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
import CustomPairingPanel from '@/components/crop-oracle/CustomPairingPanel';


import TwoWeekDashboard from '@/components/crop-oracle/TwoWeekDashboard';
import { getZoneAwarePlantingWindows, cropFitsZone } from '@/lib/frostDates';
import { getCropLayer, getIdealSlotLayers, layerMatchScore, successionScore, checkShading, type ShadingWarning } from '@/lib/growthLayers';

/* ─── Zone Data ─── */
const ZONES = [
  { hz: 396, name: 'Foundation', vibe: 'Grounding', plainVibe: 'Root Crops', color: '#FF0000', note: 'C', description: 'Root anchoring, phosphorus, deep stability', plainDesc: 'Potatoes, beets, carrots — deep-rooting crops' },
  { hz: 417, name: 'Flow', vibe: 'Flow', plainVibe: 'Vine Crops', color: '#FF7F00', note: 'D', description: 'Water, hydration, fungal transit', plainDesc: 'Squash, melons, cucumbers — spreading crops' },
  { hz: 528, name: 'Alchemy', vibe: 'Energy', plainVibe: 'Summer Crops', color: '#FFFF00', note: 'E', description: 'Solar power, nitrogen, growth core', plainDesc: 'Tomatoes, corn, beans — heat-loving crops' },
  { hz: 639, name: 'Heart', vibe: 'Heart', plainVibe: 'Salad Crops', color: '#00FF00', note: 'F', description: 'Connection, mycorrhizal sync, calcium', plainDesc: 'Lettuce, greens, herbs — quick-harvest crops' },
  { hz: 741, name: 'Signal', vibe: 'Expression', plainVibe: 'Spice Crops', color: '#0000FF', note: 'G', description: 'Potassium, Brix validation, alchemy', plainDesc: 'Peppers, herbs, aromatics — flavor crops' },
  { hz: 852, name: 'Vision', vibe: 'Vision', plainVibe: 'Medicine Crops', color: '#9B59B6', note: 'A', description: 'Medicinal density, silica, insight', plainDesc: 'Medicinal herbs, teas, tincture plants' },
  { hz: 963, name: 'Source', vibe: 'Protection', plainVibe: 'Shield Crops', color: '#8B00FF', note: 'B', description: 'Garlic shield, sulfur, seed sanctuary', plainDesc: 'Garlic, onions, pest barriers' },
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
  { key: 'Root (Lead)', label: 'The Star', plainLabel: 'Main Crop', role: 'Root (1st)', emoji: '🌟', hint: 'Your main crop — the headliner of the bed.' },
  { key: '3rd (Triad)', label: 'The Companion', plainLabel: 'Pest Helper', role: '3rd (Triad)', emoji: '🌿', hint: 'A helpful neighbor that keeps pests away or adds nutrients.' },
  { key: '5th (Stabilizer)', label: 'The Stabilizer', plainLabel: 'Soil Builder', role: '5th', emoji: '⚓', hint: 'A ground-cover or nitrogen-fixer that feeds the soil.' },
  { key: '7th (Signal)', label: 'The Signal', plainLabel: 'Pollinator', role: '7th', emoji: '🦋', hint: 'Flowers & herbs that attract pollinators and beneficial insects.' },
  { key: '9th (Sub-bass)', label: 'The Underground', plainLabel: 'Root Veggie', role: '9th', emoji: '🥔', hint: 'Root vegetables growing beneath the surface.' },
  { key: '11th (Tension)', label: 'The Sentinel', plainLabel: 'Fungi Layer', role: '11th', emoji: '🍄', hint: 'Fungi that build an underground nutrient network.' },
  { key: '13th (Top Note)', label: 'The Aerial', plainLabel: 'Tall Cover', role: '13th', emoji: '🌻', hint: 'Tall plants that create shade and wind protection above.' },
];

/* ─── Antagonist & Synergy Rules ─── */
const ANTAGONIST_PAIRS: { groupA: string[]; groupB: string[]; reason: string }[] = [
  { groupA: ['onion', 'garlic', 'shallot', 'leek', 'chive', 'scallion'], groupB: ['bean', 'pea', 'lentil', 'chickpea', 'lima'], reason: 'Alliums stunt legume growth via chemical secretions' },
  { groupA: ['tomato'], groupB: ['potato'], reason: 'Both susceptible to the same blight — keep far apart' },
  { groupA: ['tomato'], groupB: ['corn'], reason: 'Corn earworm is identical to tomato fruitworm — proximity amplifies infestations' },
  { groupA: ['tomato'], groupB: ['fennel'], reason: 'Fennel secretes compounds that inhibit tomato growth' },
  { groupA: ['cabbage', 'broccoli', 'kale', 'cauliflower', 'brussels'], groupB: ['tomato', 'pepper', 'strawberry'], reason: 'Brassicas compete for calcium with these crops & attract shared pests' },
  { groupA: ['fennel'], groupB: ['bean', 'pepper', 'eggplant', 'carrot'], reason: 'Fennel secretes compounds that inhibit most neighbors' },
  { groupA: ['walnut', 'black walnut'], groupB: ['tomato', 'pepper', 'eggplant', 'potato', 'blueberry'], reason: 'Juglone toxicity from walnut roots' },
  { groupA: ['dill', 'coriander', 'cilantro', 'parsnip'], groupB: ['carrot'], reason: 'Umbellifers cross-pollinate with carrots, reducing yield and seed quality' },
  { groupA: ['sage'], groupB: ['cucumber'], reason: 'Sage inhibits cucumber growth' },
  { groupA: ['mint'], groupB: ['parsley'], reason: 'Mint overwhelms parsley through aggressive root competition' },
  { groupA: ['sunflower'], groupB: ['potato'], reason: 'Sunflowers release allelopathic compounds that inhibit potato growth' },
  { groupA: ['potato'], groupB: ['squash', 'cucumber', 'zucchini', 'pumpkin'], reason: 'Shared susceptibility to blight and competition for soil nutrients' },
  // Removed: bean vs pepper — actually compatible per USDA companion planting guides
  { groupA: ['corn'], groupB: ['celery'], reason: 'Corn shading stunts celery growth' },
  { groupA: ['lettuce'], groupB: ['parsley'], reason: 'Parsley can bolt lettuce prematurely when planted nearby' },
  { groupA: ['onion'], groupB: ['asparagus'], reason: 'Onions inhibit asparagus growth through root secretions' },
  // New: Pepper conflicts
  { groupA: ['pepper'], groupB: ['fennel'], reason: 'Fennel inhibits pepper growth through root secretions' },
  { groupA: ['pepper'], groupB: ['kohlrabi'], reason: 'Kohlrabi stunts pepper growth through nutrient competition' },
  // New: Squash/Cucumber conflicts
  { groupA: ['squash', 'zucchini', 'pumpkin'], groupB: ['potato'], reason: 'Squash and potatoes share blight susceptibility and compete for nutrients' },
  { groupA: ['cucumber'], groupB: ['potato'], reason: 'Potatoes spread blight to cucumbers; both attract similar pests' },
  { groupA: ['cucumber', 'squash', 'zucchini'], groupB: ['melon'], reason: 'Cucurbits cross-pollinate when planted too close, reducing fruit quality' },
  // New: Eggplant conflicts
  { groupA: ['eggplant'], groupB: ['fennel'], reason: 'Fennel root secretions inhibit eggplant growth' },
  { groupA: ['eggplant'], groupB: ['pepper'], reason: 'Both are solanaceous heavy feeders competing for the same nutrients' },
  // New: Celery conflicts
  { groupA: ['celery'], groupB: ['parsnip', 'parsley'], reason: 'Same family (Apiaceae) — shared pests and diseases amplify when adjacent' },
];

/** Bodyguard crops: pest-specific protectors to boost in scoring */
const BODYGUARD_MAP: Record<string, { guard: string[]; pest: string }> = {
  tomato: { guard: ['borage', 'marigold'], pest: 'Hornworms & Blight' },
  corn: { guard: ['dill'], pest: 'Corn Earworm (attracts parasitic wasps)' },
  potato: { guard: ['tansy', 'catnip'], pest: 'Potato Beetle' },
  bean: { guard: ['nasturtium'], pest: 'Aphids' },
  carrot: { guard: ['sage', 'rosemary', 'chive', 'leek'], pest: 'Carrot Fly' },
  broccoli: { guard: ['thyme', 'sage', 'nasturtium'], pest: 'Cabbage Moth' },
  lettuce: { guard: ['poached egg plant', 'alyssum', 'mint', 'calendula'], pest: 'Slugs & Snails' },
  onion: { guard: ['marigold'], pest: 'Onion Maggot' },
  pepper: { guard: ['basil', 'marigold', 'nasturtium'], pest: 'Aphids & Flea Beetles' },
  squash: { guard: ['nasturtium', 'marigold', 'radish'], pest: 'Squash Vine Borer & Cucumber Beetles' },
  cucumber: { guard: ['nasturtium', 'radish', 'tansy'], pest: 'Cucumber Beetles & Aphids' },
  zucchini: { guard: ['nasturtium', 'marigold', 'borage'], pest: 'Squash Vine Borer & Squash Bugs' },
  eggplant: { guard: ['marigold', 'nasturtium', 'catnip'], pest: 'Flea Beetles & Colorado Potato Beetle' },
  celery: { guard: ['nasturtium', 'marigold', 'cosmos'], pest: 'Aphids & Leaf Miners' },
  pumpkin: { guard: ['nasturtium', 'marigold', 'oregano'], pest: 'Squash Vine Borer & Squash Bugs' },
};

/** Placement rules: spatial guidance for bed layout */
const PLACEMENT_RULES: Record<string, string> = {
  tomato: 'Keep away from Corn/Potatoes (shared pests)',
  corn: 'North row; serves as trellis for beans',
  potato: 'Deep-root; separate from Tomatoes to avoid blight',
  bean: 'Nitrogen fixer; avoid Alliums (stunts growth)',
  carrot: 'Mid-root; use Onions to mask scent from flies',
  broccoli: 'Heavy feeder; pair with early Beets',
  lettuce: 'South row; benefits from shade of tall Corn',
  onion: 'Border plant; masks other crop scents',
  pepper: 'Sheltered center; pair with Basil for pest masking & flavor boost',
  squash: 'Spread outer edges; leaves shade soil as living mulch',
  cucumber: 'Trellis east side; pair with Dill & Nasturtium for beetle defense',
  zucchini: 'South-facing with space to sprawl; interplant with Borage for pollination',
  eggplant: 'Warm center bed; pair with Marigold border for flea beetle defense',
  celery: 'Partial shade; pair with Tomato or Leek for mutual pest masking',
  pumpkin: 'North end to sprawl; use Nasturtium border for vine borer defense',
};

const SYNERGY_PATTERNS: { keywords: string[]; badge: string; tip: string }[] = [
  { keywords: ['corn', 'bean', 'squash'], badge: '🌾 THREE SISTERS', tip: 'Corn provides a trellis for beans, beans fix nitrogen, squash shades soil & deters pests.' },
  { keywords: ['tomato', 'basil'], badge: '🍅 CLASSIC PAIR', tip: 'Basil repels whiteflies, mosquitoes, spider mites & aphids while improving tomato flavor and pollination.' },
  { keywords: ['tomato', 'garlic'], badge: '🧄 BLIGHT SHIELD', tip: 'Garlic\'s sulfur compounds deter spider mites and act as a natural fungicide against blight.' },
  { keywords: ['tomato', 'carrot'], badge: '🥕 ROOT HARMONY', tip: 'Carrots loosen soil for tomato roots; tomatoes provide shade for carrot shoulders.' },
  { keywords: ['tomato', 'marigold'], badge: '💛 BODYGUARD', tip: 'Marigolds repel hornworms, whiteflies, and nematodes — the classic tomato bodyguard.' },
  { keywords: ['carrot', 'onion'], badge: '🛡️ PEST SHIELD', tip: 'Carrots repel onion flies; onions repel carrot rust fly.' },
  { keywords: ['carrot', 'rosemary'], badge: '🛡️ CARROT FLY SHIELD', tip: 'Rosemary repels carrot fly with its aromatic oils.' },
  { keywords: ['carrot', 'sage'], badge: '🛡️ CARROT FLY SHIELD', tip: 'Sage repels carrot fly with its strong scent.' },
  { keywords: ['carrot', 'leek'], badge: '🛡️ MUTUAL GUARD', tip: 'Leeks repel carrot fly; carrots repel leek moth.' },
  { keywords: ['strawberry', 'borage'], badge: '🐝 POLLINATOR BOOST', tip: 'Borage attracts pollinators and is believed to improve strawberry yield.' },
  { keywords: ['tomato', 'asparagus'], badge: '🧬 NEMATODE SHIELD', tip: 'Asparagus repels root-knot nematodes that attack tomato roots.' },
  { keywords: ['tomato', 'borage'], badge: '🐛 HORNWORM GUARD', tip: 'Borage repels tomato hornworms and improves tomato vigor.' },
  { keywords: ['cucumber', 'nasturtium'], badge: '🪲 BEETLE TRAP', tip: 'Nasturtiums serve as trap crops for cucumber beetles, luring them away.' },
  { keywords: ['cucumber', 'dill'], badge: '🦟 APHID SHIELD', tip: 'Dill protects cucumbers against aphids and mites.' },
  { keywords: ['lettuce', 'chive'], badge: '🧅 SCENT MASK', tip: 'Chives mask lettuce scent, deterring aphids and other pests.' },
  { keywords: ['lettuce', 'basil'], badge: '🌿 SLUG REPEL', tip: 'Basil\'s strong scent deters slugs and aphids from lettuce.' },
  { keywords: ['lettuce', 'radish'], badge: '⚡ TRAP CROP', tip: 'Radishes lure flea beetles away from lettuce leaves.' },
  { keywords: ['potato', 'horseradish'], badge: '🪲 BEETLE WARD', tip: 'Horseradish planted at corners of potato patches wards off Colorado potato beetles.' },
  { keywords: ['potato', 'bean'], badge: '🤝 FEED & FIX', tip: 'Beans fix nitrogen for heavy-feeding potatoes; potatoes repel Mexican bean beetles.' },
  { keywords: ['bean', 'nasturtium'], badge: '🪤 APHID TRAP', tip: 'Nasturtiums act as trap plants, enticing aphids away from beans.' },
  { keywords: ['bean', 'rosemary'], badge: '🌿 BEAN GUARD', tip: 'Rosemary repels bean beetles with its aromatic oils.' },
  { keywords: ['corn', 'bean'], badge: '🌽 MILPA DUO', tip: 'Corn stalks trellis beans; beans fix nitrogen for corn — the core of Three Sisters.' },
  { keywords: ['corn', 'pea'], badge: '🫛 NITROGEN TRELLIS', tip: 'Peas fix nitrogen while climbing corn stalks — a cool-season Three Sisters variant.' },
  { keywords: ['broccoli', 'onion'], badge: '🧅 PEST MASK', tip: 'Onion scent masks brassica smell from cabbage moths and flea beetles.' },
  { keywords: ['broccoli', 'rosemary'], badge: '🌿 MOTH REPEL', tip: 'Rosemary repels cabbage moths with its strong aromatic oils.' },
  { keywords: ['onion', 'beet'], badge: '🫱 ROOT NEIGHBORS', tip: 'Beets and onions share space efficiently at different root depths without competition.' },
  { keywords: ['onion', 'carrot'], badge: '🛡️ PEST SHIELD', tip: 'Onions repel carrot rust fly; carrots repel onion flies.' },
  { keywords: ['cabbage', 'nasturtium'], badge: '🪤 PEST DECOY', tip: 'Nasturtiums deter beetles and aphids from brassicas.' },
  { keywords: ['spinach', 'strawberry'], badge: '🤝 SHADE FRIENDS', tip: 'Spinach and strawberries share similar growing conditions and benefit from proximity.' },
  // Pepper synergies
  { keywords: ['pepper', 'basil'], badge: '🌿 FLAVOR BOOST', tip: 'Basil repels aphids & thrips while improving pepper flavor through volatile oils.' },
  { keywords: ['pepper', 'tomato'], badge: '🔥 SOLANACEAE DUO', tip: 'Tomatoes and peppers thrive together — similar nutrient needs, shared pest defense.' },
  { keywords: ['pepper', 'carrot'], badge: '🥕 ROOT LOOSEN', tip: 'Carrots loosen soil for pepper roots and utilize different soil depths.' },
  { keywords: ['pepper', 'onion'], badge: '🧅 PEST MASK', tip: 'Onion scent masks pepper from aphids and flea beetles.' },
  // Squash & Cucumber synergies
  { keywords: ['squash', 'nasturtium'], badge: '🪤 BORER TRAP', tip: 'Nasturtiums lure squash vine borers and cucumber beetles away.' },
  { keywords: ['squash', 'borage'], badge: '🐝 POLLINATOR CALL', tip: 'Borage attracts bees critical for squash pollination.' },
  { keywords: ['cucumber', 'bean'], badge: '🫘 NITROGEN FEED', tip: 'Beans fix nitrogen that heavy-feeding cucumbers crave.' },
  { keywords: ['cucumber', 'sunflower'], badge: '🌻 TRELLIS & SHADE', tip: 'Sunflower stalks serve as natural trellises for cucumber vines.' },
  { keywords: ['zucchini', 'borage'], badge: '🐝 SQUASH SYNC', tip: 'Borage dramatically improves zucchini pollination and deters squash worms.' },
  { keywords: ['zucchini', 'nasturtium'], badge: '🪤 BUG DECOY', tip: 'Nasturtiums trap squash bugs and beetles away from zucchini.' },
  // Eggplant synergies
  { keywords: ['eggplant', 'basil'], badge: '🌿 FLEA SHIELD', tip: 'Basil repels flea beetles — the #1 eggplant pest.' },
  { keywords: ['eggplant', 'marigold'], badge: '💛 NEMATODE GUARD', tip: 'Marigolds repel root-knot nematodes that devastate eggplant.' },
  { keywords: ['eggplant', 'bean'], badge: '🫘 NITROGEN GIFT', tip: 'Beans fix nitrogen for heavy-feeding eggplant; eggplant repels Mexican bean beetles.' },
  // Celery synergies
  { keywords: ['celery', 'tomato'], badge: '🍅 MUTUAL MASK', tip: 'Celery repels tomato hornworms; tomatoes deter celery leaf miners.' },
  { keywords: ['celery', 'leek'], badge: '🧅 PEST CONFUSE', tip: 'Leeks and celery confuse each other\'s pests through scent masking.' },
  { keywords: ['celery', 'bean'], badge: '🫘 SHADE & FIX', tip: 'Beans provide light shade celery loves and fix nitrogen for its heavy appetite.' },
  // Pumpkin synergies
  { keywords: ['pumpkin', 'corn'], badge: '🌾 SISTERS PAIR', tip: 'Corn provides structure; pumpkin vines shade soil — Two Sisters combo.' },
  { keywords: ['pumpkin', 'nasturtium'], badge: '🪤 BORER DEFENSE', tip: 'Nasturtiums trap vine borers and attract predatory insects.' },
];

const cropMatchesGroup = (crop: MasterCrop, group: string[]): boolean => {
  const name = (crop.common_name || crop.name).toLowerCase();
  return group.some(k => name.includes(k));
};

const findAntagonisms = (crops: (MasterCrop | null)[]): { cropA: string; cropB: string; reason: string }[] => {
  const warnings: { cropA: string; cropB: string; reason: string }[] = [];
  const valid = crops.filter((c): c is MasterCrop => c !== null);
  for (const rule of ANTAGONIST_PAIRS) {
    const matchesA = valid.filter(c => cropMatchesGroup(c, rule.groupA));
    const matchesB = valid.filter(c => cropMatchesGroup(c, rule.groupB));
    for (const a of matchesA) {
      for (const b of matchesB) {
        if (a.id !== b.id) warnings.push({ cropA: a.common_name || a.name, cropB: b.common_name || b.name, reason: rule.reason });
      }
    }
  }
  return warnings;
};

const findSynergies = (crops: (MasterCrop | null)[]): { badge: string; tip: string }[] => {
  const valid = crops.filter((c): c is MasterCrop => c !== null);
  const names = valid.map(c => (c.common_name || c.name).toLowerCase());
  return SYNERGY_PATTERNS.filter(pat =>
    pat.keywords.every(k => names.some(n => n.includes(k)))
  );
};

const isAntagonistWith = (crop: MasterCrop, others: (MasterCrop | null)[]): string | null => {
  const valid = others.filter((c): c is MasterCrop => c !== null && c.id !== crop.id);
  for (const rule of ANTAGONIST_PAIRS) {
    if (cropMatchesGroup(crop, rule.groupA)) {
      const enemy = valid.find(c => cropMatchesGroup(c, rule.groupB));
      if (enemy) return `⚔️ ${rule.reason}`;
    }
    if (cropMatchesGroup(crop, rule.groupB)) {
      const enemy = valid.find(c => cropMatchesGroup(c, rule.groupA));
      if (enemy) return `⚔️ ${rule.reason}`;
    }
  }
  return null;
};

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

// Derive sun requirement from category and growth_habit
const getSunRequirement = (crop: { category?: string; growth_habit?: string | null; description?: string | null }): { label: string; level: 'full' | 'partial' | 'shade' } => {
  const habit = (crop.growth_habit || '').toLowerCase();
  const cat = (crop.category || '').toLowerCase();
  const desc = (crop.description || '').toLowerCase();
  if (['fern', 'moss', 'mushroom', 'fungi'].some(k => habit.includes(k) || cat.includes(k))) return { label: 'Shade', level: 'shade' };
  if (desc.includes('shade-loving') || desc.includes('deep shade')) return { label: 'Shade', level: 'shade' };
  if (['herb', 'leafy green', 'lettuce'].some(k => cat.includes(k)) || ['understory', 'ground cover', 'herbaceous shrub'].some(k => habit.includes(k))) return { label: 'Part Sun', level: 'partial' };
  if (habit === 'tuber' || habit === 'root') return { label: 'Part Sun', level: 'partial' };
  return { label: 'Full Sun', level: 'full' };
};

const CropOracle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: allCrops, isLoading } = useMasterCrops();
  const [step, setStep] = useState(1);
  const [environment, setEnvironment] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<typeof ZONES[0] | null>(null);
  const [selectedZones, setSelectedZones] = useState<typeof ZONES>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonalOverride, setSeasonalOverride] = useState(false);
  const [swapSlotIndex, setSwapSlotIndex] = useState<number | null>(null);
  const [manualOverrides, setManualOverrides] = useState<Record<number, MasterCrop>>({});
  const [preSwapCrops, setPreSwapCrops] = useState<Record<number, MasterCrop>>({});
  const [lockedSlots, setLockedSlots] = useState<Set<number>>(new Set());
  const [starCrop, setStarCrop] = useState<MasterCrop | null>(null);
  const [showStarPicker, setShowStarPicker] = useState(false);
  const [starSearchQuery, setStarSearchQuery] = useState('');
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  const [deletingRecipeId, setDeletingRecipeId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [proMode, setProMode] = useState(false);
  const [plainMode, setPlainMode] = useState(false);
  const [hardinessZone, setHardinessZone] = useState<number | null>(null);
  const [hardinessSubZone, setHardinessSubZone] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [modalInfoOpen, setModalInfoOpen] = useState(false);
  const [activeToolPanel, setActiveToolPanel] = useState<'soil' | 'calendar' | 'modal' | 'scent' | 'propagation' | 'suppliers' | 'hole' | 'pairing' | null>(null);
  const [recipeSeed, setRecipeSeed] = useState(0);
  // Track previously-used crop families per slot (last 2 shuffles) to ensure diversity
  const prevSlotFamilies = useRef<Record<string, string[][]>>({});
  const [showSeasonalCompanions, setShowSeasonalCompanions] = useState(false);
  const [seasonFilter, setSeasonFilter] = useState<string | null>(null);

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
    setPreSwapCrops({});
    setLockedSlots(new Set());
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

  /* ─── Current calendar season helper ─── */
  const currentSeason = useMemo(() => {
    const month = new Date().getMonth(); // 0-indexed
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }, []);

  const isInCurrentSeason = (c: MasterCrop): boolean => {
    const seasons = (c.planting_season || []).map(s => s.toLowerCase());
    if (seasons.length === 0) return true; // no data = don't exclude
    return seasons.includes(currentSeason) || seasons.includes('year-round');
  };

  /* ─── Filter crops by zone + environment (season used as preference, not hard gate) ─── */
  const recipeCrops = useMemo(() => {
    if (!allCrops || !selectedZone) return [];

    const activeHzSet = new Set(selectedZones.length > 0 ? selectedZones.map(z => z.hz) : [selectedZone.hz]);
    let filtered = allCrops.filter(c => activeHzSet.has(c.frequency_hz));

    // Trees only visible in food-forest mode
    if (environment !== 'food-forest') {
      filtered = filtered.filter(c => !c.growth_habit || c.growth_habit.toLowerCase() !== 'tree');
    }

    // Zone filter: strictly enforce — 100% zone compatibility
    if (hardinessZone) {
      filtered = filtered.filter(fitsHardinessZone);
    }

    // Season filter: if user selected a specific season, hard-gate to that season
    if (seasonFilter) {
      const sf = seasonFilter.toLowerCase();
      filtered = filtered.filter(c => {
        const seasons = (c.planting_season || []).map(s => s.toLowerCase());
        return seasons.length === 0 || seasons.includes(sf) || seasons.includes('year-round');
      });
    }

    // Season preference: sort in-season crops first, but don't exclude others
    filtered.sort((a, b) => {
      const aInSeason = isInCurrentSeason(a) ? 1 : 0;
      const bInSeason = isInCurrentSeason(b) ? 1 : 0;
      return bInSeason - aInSeason;
    });

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
  }, [allCrops, selectedZone, selectedZones, environment, hardinessZone, currentSeason, seasonFilter]);

  /* ─── Star crop candidates (ANY crop from ANY zone can be the Star) ─── */
  const starCandidates = useMemo(() => {
    if (!allCrops) return [];
    let candidates = [...allCrops];
    // Trees only visible in food-forest mode
    if (environment !== 'food-forest') {
      candidates = candidates.filter(c => !c.growth_habit || c.growth_habit.toLowerCase() !== 'tree');
    }
    if (hardinessZone) {
      candidates = candidates.filter(fitsHardinessZone);
    }
    // Season preference: sort in-season first but don't exclude
    candidates.sort((a, b) => {
      const aS = isInCurrentSeason(a) ? 1 : 0;
      const bS = isInCurrentSeason(b) ? 1 : 0;
      return bS - aS;
    });
    if (environment === 'pot') {
      candidates = candidates.filter(c => {
        const spacing = c.spacing_inches ? parseInt(c.spacing_inches) : 6;
        return spacing <= POT_MAX_SPACING;
      });
    }
    return candidates.sort((a, b) => (a.common_name || a.name).localeCompare(b.common_name || b.name));
  }, [allCrops, environment, hardinessZone, currentSeason]);

  /* ─── Family counts for star candidates ─── */
  const FAMILY_KEYWORDS = ['tomato', 'pepper', 'bean', 'squash', 'lettuce', 'kale', 'corn', 'cucumber', 'melon', 'onion', 'garlic', 'potato', 'carrot', 'beet', 'radish', 'pea', 'eggplant', 'cabbage', 'broccoli', 'spinach', 'chard', 'celery', 'turnip', 'okra', 'pumpkin', 'zucchini', 'basil', 'mint', 'thyme', 'sage', 'oregano', 'dill', 'parsley', 'cilantro', 'rosemary', 'lavender', 'sunflower', 'marigold', 'nasturtium', 'beetroot', 'fennel', 'leek', 'shallot', 'chive', 'strawberry', 'blueberry', 'raspberry', 'watermelon', 'cantaloupe', 'tomatillo', 'moringa', 'cassava', 'taro', 'yam', 'breadfruit', 'jackfruit', 'guava', 'mango', 'papaya', 'banana', 'cacao', 'vanilla', 'turmeric', 'ginger', 'lemongrass', 'cardamom', 'avocado', 'fig', 'pomegranate', 'passion fruit', 'dragon fruit', 'amaranth', 'quinoa', 'sorghum', 'millet', 'clover', 'comfrey', 'alfalfa'];
  const getCropFamilyKey = (c: MasterCrop): string => {
    const fullName = `${(c.common_name || '')} ${c.name}`.toLowerCase();
    const matched = FAMILY_KEYWORDS.find(f => fullName.includes(f));
    return matched || c.name.toLowerCase().split('_')[0];
  };
  const familyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of starCandidates) {
      const fam = getCropFamilyKey(c);
      counts[fam] = (counts[fam] || 0) + 1;
    }
    return counts;
  }, [starCandidates]);

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

  /* ─── Seasonal Companions for Star Crop ─── */
  const seasonalCompanions = useMemo(() => {
    if (!starCrop || !allCrops) return [];
    const sSeasons = (starCrop.planting_season || []).map(s => s.toLowerCase());
    const sHarvest = starCrop.harvest_days ?? null;
    const sCompanions = (starCrop.companion_crops || []).map(n => n.toLowerCase());
    const sName = (starCrop.common_name || starCrop.name).toLowerCase();

    return allCrops
      .filter(c => c.id !== starCrop.id && c.frequency_hz === starCrop.frequency_hz)
      .map(c => {
        const cSeasons = (c.planting_season || []).map(s => s.toLowerCase());
        const sharedSeasons = sSeasons.filter(s => cSeasons.includes(s));
        const cName = (c.common_name || c.name).toLowerCase();
        const starListsC = sCompanions.some(cn => cName.includes(cn) || cn.includes(cName.split('(')[0].trim()));
        const cListsStar = (c.companion_crops || []).map(n => n.toLowerCase()).some(cn => sName.includes(cn) || cn.includes(sName.split('(')[0].trim()));
        const isCompanionMatch = starListsC || cListsStar;
        let harvestAlign: 'close' | 'near' | 'none' = 'none';
        if (sHarvest !== null && c.harvest_days != null) {
          const diff = Math.abs(c.harvest_days - sHarvest);
          if (diff <= 15) harvestAlign = 'close';
          else if (diff <= 30) harvestAlign = 'near';
        }
        const lunarReady = isCropLunarReady(c.category, c.common_name || c.name, lunar.plantingType);
        const zoneOk = !hardinessZone || c.hardiness_zone_min == null || c.hardiness_zone_max == null ||
          (hardinessZone >= c.hardiness_zone_min && hardinessZone <= c.hardiness_zone_max);
        let score = sharedSeasons.length * 3;
        if (isCompanionMatch) score += 6;
        if (harvestAlign === 'close') score += 3;
        else if (harvestAlign === 'near') score += 1;
        if (lunarReady) score += 3;
        if (zoneOk) score += 2;
        else score -= 5;
        const maxScore = 23; // 9 season + 6 companion + 3 harvest + 3 lunar + 2 zone
        const compatibility = Math.min(100, Math.round((score / maxScore) * 100));
        return { crop: c, score, compatibility, sharedSeasons, isCompanionMatch, harvestAlign, lunarReady, zoneOk };
      })
      .filter(r => r.score > 0 && r.zoneOk)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [starCrop, allCrops, lunar.plantingType, hardinessZone]);

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

    const isInSeason = (c: MasterCrop): boolean => {
      const seasons = (c.planting_season || []).map(s => s.toLowerCase());
      if (seasons.length === 0) return true;
      return seasons.includes(currentSeason);
    };

    // Zone: strictly enforced (100%). Season: prefer in-season, fallback to zone-only
    const seasonGated = pool.filter(c => isZoneCompatible(c) && isSeasonCompatible(c) && isInSeason(c));
    const zoneGated = pool.filter(c => isZoneCompatible(c) && isSeasonCompatible(c));
    const zoneOnly = pool.filter(c => isZoneCompatible(c));
    pool = seasonGated.length >= 7 ? seasonGated : zoneGated.length >= 3 ? zoneGated : zoneOnly;

    const usedIds = new Set<string>();
    const placedCropsRef: MasterCrop[] = []; // Track placed crops for antagonist checking

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

    // Compute ideal slot layers based on Star crop's growth habit
    const idealLayers = starCrop ? getIdealSlotLayers(starCrop) : {};

    const harmonicScore = (c: MasterCrop, hasSentinelAlready: boolean = false, slotKey?: string): number => {
      let score = 0;
      // Season overlap with star crop (+3 per shared season)
      const cSeasons = (c.planting_season || []).map(s => s.toLowerCase());
      const sharedSeasons = starSeasons.filter(s => cSeasons.includes(s));
      score += sharedSeasons.length * 3;
      // Bonus if ANY season data exists (+1)
      if (cSeasons.length > 0) score += 1;
      // Current-season boost (+4 if plantable now)
      if (isInCurrentSeason(c)) score += 4;
      // Zone compatibility (+5 if crop fits user's zone, heavy penalty if not)
      if (hardinessZone && c.hardiness_zone_min != null && c.hardiness_zone_max != null) {
        if (hardinessZone >= c.hardiness_zone_min && hardinessZone <= c.hardiness_zone_max) score += 5;
        else score -= 8; // strong penalty for zone-incompatible crops
      }
      // USDA companion planting boost (+6 bidirectional, +4 one-way)
      if (isBidirectionalCompanion(c)) score += 6;
      else if (isCompanion(c)) score += 4;

      // ─── SUCCESSION PLANTING: reward harvest stagger ───
      score += successionScore(c, placedCropsRef);

      // Sentinel/trap crop boost: +4 base, +6 extra if recipe has no sentinel yet
      if (isSentinelOrTrap(c)) {
        score += 4;
        if (!hasSentinelAlready) score += 6;
      }

      // ─── VERTICAL LAYER MATCH: reward crops in ideal layer for this slot ───
      if (slotKey) {
        score += layerMatchScore(c, slotKey, idealLayers);
      }

      // ─── SHADING PENALTY: penalize sun-loving herbs placed with canopy trees ───
      if (starCrop) {
        const warning = checkShading(starCrop, c);
        if (warning?.severity === 'warning') score -= 3;
      }

      // Antagonist penalty: if candidate conflicts with star crop or already-placed crops
      const cName = (c.common_name || c.name).toLowerCase();
      const checkAgainst = [starCrop, ...placedCropsRef].filter((x): x is MasterCrop => x !== null && x.id !== c.id);
      for (const other of checkAgainst) {
        const oName = (other.common_name || other.name).toLowerCase();
        for (const rule of ANTAGONIST_PAIRS) {
          const cInA = rule.groupA.some(k => cName.includes(k));
          const cInB = rule.groupB.some(k => cName.includes(k));
          const oInA = rule.groupA.some(k => oName.includes(k));
          const oInB = rule.groupB.some(k => oName.includes(k));
          if ((cInA && oInB) || (cInB && oInA)) score -= 20; // Heavy penalty per conflict
        }
      }
      return score;
    };

    // Seeded rotation: pick from candidates using recipeSeed, preferring harmonically-scored crops
    // Family-diversity: penalize crops whose family appeared in the same slot last shuffle
    const KNOWN_FAMILIES = ['tomato', 'pepper', 'bean', 'squash', 'lettuce', 'kale', 'corn', 'cucumber', 'melon', 'onion', 'garlic', 'potato', 'carrot', 'beet', 'radish', 'pea', 'eggplant', 'cabbage', 'broccoli', 'spinach', 'chard', 'celery', 'turnip', 'okra', 'pumpkin', 'zucchini', 'basil', 'mint', 'thyme', 'sage', 'oregano', 'dill', 'parsley', 'cilantro', 'rosemary', 'lavender', 'sunflower', 'marigold', 'nasturtium', 'beetroot', 'fennel', 'leek', 'shallot', 'chive', 'strawberry', 'blueberry', 'raspberry', 'watermelon', 'cantaloupe', 'tomatillo'];
    const getCropFamily = (c: MasterCrop): string => {
      // Check common_name and internal name for known family keywords
      // Use word-boundary matching to avoid false positives like "peppermint" → "pepper"
      const fullName = `${(c.common_name || '')} ${c.name}`.toLowerCase();
      const matched = KNOWN_FAMILIES.find(f => {
        // Use regex word boundary to avoid substring false positives
        const regex = new RegExp(`\\b${f}\\b`);
        return regex.test(fullName);
      });
      if (matched) return matched;
      // Fallback: use the internal name's base (before underscore)
      return c.name.toLowerCase().split('_')[0];
    };
    let pickCounter = 0;
    let hasSentinelInRecipe = starCrop ? isSentinelOrTrap(starCrop) : false;
    let currentSlotKey = ''; // Track which slot we're filling for layer scoring
    const newSlotFamilies: Record<string, string[]> = {}; // Track families chosen this round
    const rotatedPick = (candidates: MasterCrop[]): MasterCrop | undefined => {
      if (candidates.length === 0) return undefined;
      const prevRounds = prevSlotFamilies.current[currentSlotKey] || [];
      // Sort by harmonic score descending, then apply family-diversity penalty
      const scored = candidates.map(c => {
        let score = harmonicScore(c, hasSentinelInRecipe, currentSlotKey);
        const family = getCropFamily(c);
        // Penalize if this family was used in the same slot in the last shuffle (-18)
        // or the shuffle before that (-10) — creates a 2-shuffle cooldown
        const lastRound = prevRounds[0] || [];
        const prevRound = prevRounds[1] || [];
        if (lastRound.includes(family)) score -= 18;
        else if (prevRound.includes(family)) score -= 10;
        // Also penalize if already used in this round's other slots (-10)
        const usedThisRound = Object.values(newSlotFamilies).flat();
        if (usedThisRound.includes(family)) score -= 10;
        return { crop: c, score, family };
      });
      scored.sort((a, b) => b.score - a.score);
      // Widen top-tier to 5 points for more diversity
      const bestScore = scored[0].score;
      const topTier = scored.filter(s => s.score >= bestScore - 5);
      // Deduplicate by family: pick the best representative from each family
      // so that pepper, tomato, chard, etc. each get equal rotation chance
      const familyBest = new Map<string, typeof scored[0]>();
      for (const entry of topTier) {
        if (!familyBest.has(entry.family) || entry.score > familyBest.get(entry.family)!.score) {
          familyBest.set(entry.family, entry);
        }
      }
      const familyPool = Array.from(familyBest.values()).sort((a, b) => b.score - a.score);
      const pickPool = familyPool.length > 1 ? familyPool : topTier;
      const idx = (recipeSeed + pickCounter++) % pickPool.length;
      const picked = pickPool[idx];
      if (picked.crop && isSentinelOrTrap(picked.crop)) hasSentinelInRecipe = true;
      // Record family for this slot
      if (!newSlotFamilies[currentSlotKey]) newSlotFamilies[currentSlotKey] = [];
      newSlotFamilies[currentSlotKey].push(picked.family);
      return picked.crop;
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

    const result = INTERVAL_ORDER.map(interval => {
      let crop: MasterCrop | null = null;
      let isCompanionFill = false;
      currentSlotKey = interval.key; // Set slot context for layer scoring
      const directCandidates = pool.filter(c => !usedIds.has(c.id) && c.chord_interval === interval.key);
      const directMatch = rotatedPick(directCandidates);

      const assign = (result: { crop: MasterCrop; companionMatch: boolean } | null) => {
        if (result) { crop = result.crop; isCompanionFill = result.companionMatch; placedCropsRef.push(result.crop); }
      };

      const isFF = environment === 'food-forest';

      switch (interval.key) {
        case 'Root (Lead)':
          if (starCrop && !usedIds.has(starCrop.id)) {
            usedIds.add(starCrop.id);
            crop = starCrop;
            isCompanionFill = false;
            placedCropsRef.push(starCrop);
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
          // Fallback: peppers are great understory companions — allow them in this slot
          if (!crop) {
            assign(pickCrop(undefined, c => {
              const n = (c.common_name || c.name).toLowerCase();
              return n.includes('pepper') && c.category === 'Sustenance';
            }));
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
            const sentinelFilter = (c: MasterCrop) =>
              c.guild_role?.toLowerCase().includes('sentinel') ||
              c.name.toLowerCase().includes('garlic') ||
              c.name.toLowerCase().includes('onion') ||
              c.name.toLowerCase().includes('chive') ||
              c.name.toLowerCase().includes('leek') ||
              c.name.toLowerCase().includes('shallot') ||
              c.category === 'Fungi';
            assign(pickCrop(undefined, sentinelFilter));
            // Cross-zone fallback: if no sentinel found in current frequency pool, search all crops
            if (!crop && allCrops) {
              const crossZoneSentinels = allCrops.filter(c =>
                !usedIds.has(c.id) && sentinelFilter(c) &&
                (hardinessZone == null || c.hardiness_zone_min == null || c.hardiness_zone_max == null ||
                  (hardinessZone >= c.hardiness_zone_min && hardinessZone <= c.hardiness_zone_max))
              );
              const picked = rotatedPick(crossZoneSentinels);
              if (picked) { usedIds.add(picked.id); crop = picked; isCompanionFill = false; }
            }
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

      const layer = crop ? getCropLayer(crop) : null;
      return { ...interval, crop, isCompanionFill, layer };
    }).map((slot, i) => manualOverrides[i] ? { ...slot, crop: manualOverrides[i], isCompanionFill: false, layer: getCropLayer(manualOverrides[i]) } : slot);

    // Store this round's families (keep last 2 rounds for cooldown window)
    const updated: Record<string, string[][]> = {};
    for (const key of Object.keys(newSlotFamilies)) {
      const prev = prevSlotFamilies.current[key] || [];
      updated[key] = [newSlotFamilies[key], ...(prev.length > 0 ? [prev[0]] : [])];
    }
    prevSlotFamilies.current = updated;

    return result;
  }, [recipeCrops, manualOverrides, starCrop, allCrops, selectedZone, environment, recipeSeed, hardinessZone]);

  /* ─── Shading Warnings ─── */
  const shadingWarnings = useMemo((): ShadingWarning[] => {
    const warnings: ShadingWarning[] = [];
    const filledSlots = chordCard.filter(s => s.crop);
    for (let i = 0; i < filledSlots.length; i++) {
      for (let j = i + 1; j < filledSlots.length; j++) {
        const a = filledSlots[i].crop!;
        const b = filledSlots[j].crop!;
        const w = checkShading(a, b) || checkShading(b, a);
        if (w && !warnings.some(existing => existing.message === w.message)) warnings.push(w);
      }
    }
    return warnings;
  }, [chordCard]);

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
    const currentCrop = chordCard[swapSlotIndex]?.crop;
    if (currentCrop) setPreSwapCrops(prev => ({ ...prev, [swapSlotIndex]: prev[swapSlotIndex] || currentCrop }));
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
            onClick={() => setPlainMode(!plainMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider transition-all"
            style={{
              background: plainMode
                ? 'linear-gradient(135deg, hsl(45 40% 18%), hsl(45 30% 12%))'
                : 'hsl(0 0% 10%)',
              border: `1px solid ${plainMode ? 'hsl(45 50% 40%)' : 'hsl(0 0% 20%)'}`,
              color: plainMode ? 'hsl(45 60% 75%)' : 'hsl(0 0% 50%)',
              boxShadow: plainMode ? '0 0 12px hsl(45 50% 30% / 0.3)' : 'none',
            }}
          >
            <span className="text-sm">{plainMode ? '📖' : '🎵'}</span>
            {plainMode ? 'PLAIN' : 'MAJIC'}
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
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{
                background: 'hsl(40 30% 18% / 0.4)',
                color: 'hsl(40 50% 65%)',
              }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </span>
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
                  setSelectedZones([zone]);
                  setSeasonalOverride(false);
                  setManualOverrides({});
                  setPreSwapCrops({});
                  setLockedSlots(new Set());
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
                        setSelectedZones(prev => {
                          const exists = prev.some(z => z.hz === zone.hz);
                          const next = exists ? prev.filter(z => z.hz !== zone.hz) : [...prev, zone];
                          if (next.length > 0) {
                            setSelectedZone(exists && selectedZone?.hz === zone.hz ? next[0] : (selectedZone || next[0]));
                          } else {
                            setSelectedZone(null);
                          }
                          return next;
                        });
                        setSeasonalOverride(false);
                      }}
                      className="p-4 rounded-xl text-left transition-all flex items-center gap-4"
                      style={{
                        background: selectedZones.some(z => z.hz === zone.hz)
                          ? `linear-gradient(90deg, ${zone.color}20, hsl(0 0% 6%))`
                          : `linear-gradient(90deg, ${zone.color}08, hsl(0 0% 6%))`,
                        border: `2px solid ${selectedZones.some(z => z.hz === zone.hz) ? zone.color + '80' : zone.color + '30'}`,
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
                          {plainMode ? '●' : zone.note}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bubble text-lg" style={{ color: zone.color }}>
                            {plainMode ? zone.plainVibe : zone.vibe}
                          </h3>
                          {!plainMode && (
                            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                              {zone.hz}Hz
                            </span>
                          )}
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
                          {plainMode ? zone.plainDesc : zone.description}
                        </p>
                      </div>

                      {selectedZones.some(z => z.hz === zone.hz) ? (
                        <Check className="w-4 h-4 shrink-0" style={{ color: zone.color }} />
                      ) : (
                        <ArrowRight className="w-4 h-4 shrink-0" style={{ color: zone.color + '60' }} />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Next button for multi-select */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-xs font-mono"
                  style={{ color: 'hsl(0 0% 40%)' }}
                >
                  <ArrowLeft className="w-3 h-3" /> BACK
                </button>
                <button
                  onClick={() => {
                    if (selectedZones.length > 0) {
                      setSelectedZone(selectedZones[0]);
                      setStep(3);
                    }
                  }}
                  disabled={selectedZones.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm tracking-wider transition-all"
                  style={{
                    background: selectedZones.length > 0 ? 'hsl(45 80% 55%)' : 'hsl(0 0% 12%)',
                    color: selectedZones.length > 0 ? 'hsl(0 0% 5%)' : 'hsl(0 0% 30%)',
                    boxShadow: selectedZones.length > 0 ? '0 4px 20px hsl(45 80% 55% / 0.3)' : 'none',
                    cursor: selectedZones.length > 0 ? 'pointer' : 'not-allowed',
                  }}
                >
                  {selectedZones.length > 1 ? `NEXT (${selectedZones.length} ZONES)` : 'NEXT'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
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
                Your {selectedZones.length > 1
                  ? (plainMode ? selectedZones.map(z => z.plainVibe || z.vibe).join(' + ') : selectedZones.map(z => z.vibe).join(' + '))
                  : (plainMode ? (selectedZone.plainVibe || selectedZone.vibe) : selectedZone.vibe)} Recipe
              </h2>
              <p className="text-center text-sm font-mono mb-2" style={{ color: 'hsl(0 0% 45%)' }}>
                STEP 3 — {plainMode ? (proMode ? 'FULL GARDEN PLAN' : 'SIMPLE PLAN') : (proMode ? 'THE 13TH CHORD' : 'THE TRIAD')}
              </p>
              {/* ═══ Shuffle / Reroll Button ═══ */}
              <div className="flex justify-center gap-2 mb-2">
                <button
                  onClick={() => {
                    // Preserve locked slots as manual overrides before shuffling
                    if (lockedSlots.size > 0) {
                      const newOverrides = { ...manualOverrides };
                      for (const idx of lockedSlots) {
                        const currentCrop = chordCard[idx]?.crop;
                        if (currentCrop) newOverrides[idx] = currentCrop;
                      }
                      setManualOverrides(newOverrides);
                    }
                    setRecipeSeed(s => s + 1);
                  }}
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
                  {lockedSlots.size > 0 && (
                    <span className="ml-1 text-[8px] opacity-70">({lockedSlots.size} locked)</span>
                  )}
                </button>
                {/* Lock All / Unlock All toggle */}
                {(() => {
                  const filledIndices = chordCard.map((s, i) => s.crop ? i : -1).filter(i => i >= 0);
                  const allLocked = filledIndices.length > 0 && filledIndices.every(i => lockedSlots.has(i));
                  return (
                    <button
                      onClick={() => {
                        if (allLocked) {
                          setLockedSlots(new Set());
                          setManualOverrides({});
                        } else {
                          setLockedSlots(new Set(filledIndices));
                        }
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all hover:scale-105"
                      style={{
                        background: allLocked ? `${selectedZone.color}20` : 'hsl(0 0% 8%)',
                        color: allLocked ? selectedZone.color : 'hsl(0 0% 45%)',
                        border: `1px solid ${allLocked ? `${selectedZone.color}40` : 'hsl(0 0% 20%)'}`,
                      }}
                      title={allLocked ? 'Unlock all slots' : 'Lock all slots'}
                    >
                      {allLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {allLocked ? 'UNLOCK ALL' : 'LOCK ALL'}
                    </button>
                  );
                })()}
              </div>

              {/* ═══ Season Filter Chips ═══ */}
              {(() => {
                // Compute base pool (zone + environment + hardiness, but NO season filter)
                const activeHzSet = new Set(selectedZones.length > 0 ? selectedZones.map(z => z.hz) : [selectedZone.hz]);
                let basePool = (allCrops || []).filter(c => activeHzSet.has(c.frequency_hz));
                if (environment !== 'food-forest') {
                  basePool = basePool.filter(c => !c.growth_habit || c.growth_habit.toLowerCase() !== 'tree');
                }
                if (hardinessZone) {
                  basePool = basePool.filter(fitsHardinessZone);
                }
                const countForSeason = (season: string | null) => {
                  if (!season) return basePool.length;
                  const sf = season.toLowerCase();
                  return basePool.filter(c => {
                    const seasons = (c.planting_season || []).map(s => s.toLowerCase());
                    return seasons.length === 0 || seasons.includes(sf) || seasons.includes('year-round');
                  }).length;
                };
                return (
                  <div className="flex items-center justify-center gap-1.5 mb-3 flex-wrap">
                    <span className="text-[9px] font-mono tracking-widest mr-1" style={{ color: 'hsl(0 0% 35%)' }}>
                      SEASON:
                    </span>
                    {[
                      { id: null, label: 'All', emoji: '🌍' },
                      { id: 'Spring', label: 'Spring', emoji: '🌸' },
                      { id: 'Summer', label: 'Summer', emoji: '☀️' },
                      { id: 'Fall', label: 'Fall', emoji: '🍂' },
                      { id: 'Winter', label: 'Winter', emoji: '❄️' },
                    ].map(s => {
                      const isActive = seasonFilter === s.id;
                      const count = countForSeason(s.id);
                      return (
                        <button
                          key={s.label}
                          onClick={() => {
                            setSeasonFilter(s.id);
                            setRecipeSeed(prev => prev + 1);
                          }}
                          className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all flex items-center gap-1"
                          style={{
                            background: isActive ? `${selectedZone.color}20` : 'hsl(0 0% 8%)',
                            border: `1.5px solid ${isActive ? selectedZone.color : 'hsl(0 0% 18%)'}`,
                            color: isActive ? selectedZone.color : 'hsl(0 0% 45%)',
                            boxShadow: isActive ? `0 0 8px ${selectedZone.color}15` : 'none',
                          }}
                        >
                          {s.emoji} {s.label}
                          <span
                            className="text-[8px] font-mono px-1 py-px rounded-full ml-0.5"
                            style={{
                              background: isActive ? `${selectedZone.color}30` : 'hsl(0 0% 14%)',
                              color: isActive ? selectedZone.color : 'hsl(0 0% 40%)',
                            }}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

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
                          setPreSwapCrops({});
                          setLockedSlots(new Set());
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
                    { id: 'pairing' as const, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/><circle cx="9" cy="9" r="2"/><circle cx="15" cy="15" r="2"/><path d="M9 15l6-6"/></svg>, tip: 'Custom Pairings' },
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
                {activeToolPanel === 'pairing' && (
                  <motion.div
                    key="pairing-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mb-2"
                  >
                    <CustomPairingPanel
                      zoneColor={selectedZone.color}
                      zoneName={selectedZone.name}
                      availableCrops={recipeCrops}
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
                  className="w-full py-4 rounded-2xl font-mono text-sm tracking-wider flex items-center justify-center gap-3 transition-all"
                  style={{
                    background: starCrop
                      ? `linear-gradient(135deg, ${selectedZone.color}18, hsl(45 80% 20% / 0.2), hsl(0 0% 6%))`
                      : 'linear-gradient(135deg, hsl(45 80% 20% / 0.15), hsl(0 0% 6%))',
                    border: `1.5px solid ${starCrop ? selectedZone.color + '50' : 'hsl(45 80% 40% / 0.3)'}`,
                    color: starCrop ? selectedZone.color : 'hsl(45 80% 55%)',
                    boxShadow: starCrop
                      ? `0 0 20px ${selectedZone.color}15, inset 0 1px 0 ${selectedZone.color}10`
                      : '0 0 15px hsl(45 80% 40% / 0.08), inset 0 1px 0 hsl(45 80% 55% / 0.05)',
                  }}
                >
                  <span className="text-xl">🌟</span>
                  <span className="flex flex-col items-start">
                    <span className="text-xs font-bold">
                      {starCrop
                        ? `STAR: ${(starCrop.common_name || starCrop.name).toUpperCase()}`
                        : 'CHOOSE YOUR STAR CROP'}
                    </span>
                    <span className="text-[9px] font-body opacity-50 tracking-normal">
                      {starCrop ? 'Tap to change · Recipe built around your star' : `${starCandidates.length.toLocaleString()} crops available · Search the full registry`}
                    </span>
                  </span>
                  {!starCrop && <Search className="w-4 h-4 ml-auto opacity-40" />}
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
                                setPreSwapCrops({});
                                setLockedSlots(new Set());
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
                                   setPreSwapCrops({});
                                   setLockedSlots(new Set());
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
                                    {(() => {
                                      const fam = getCropFamilyKey(crop);
                                      const count = familyCounts[fam] || 1;
                                      return count > 1 ? (
                                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full shrink-0" style={{
                                          background: 'hsl(45 60% 30% / 0.2)',
                                          color: 'hsl(45 60% 60%)',
                                        }}>
                                          {count} {fam}
                                        </span>
                                      ) : null;
                                    })()}
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

              {/* ─── Seasonal Companions Panel ─── */}
              {starCrop && seasonalCompanions.length > 0 && (
                <motion.div
                  className="mb-4 rounded-xl overflow-hidden"
                  style={{
                    background: 'hsl(0 0% 5%)',
                    border: `1px solid ${selectedZone?.color || 'hsl(45 80% 55%)'}20`,
                  }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={() => setShowSeasonalCompanions(!showSeasonalCompanions)}
                    className="w-full px-4 py-2.5 flex items-center gap-2 transition-all"
                    style={{ background: `${selectedZone?.color || 'hsl(45 80% 55%)'}08` }}
                  >
                    <Leaf className="w-3.5 h-3.5" style={{ color: 'hsl(120 50% 55%)' }} />
                    <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: 'hsl(120 50% 55%)' }}>
                      SEASONAL COMPANIONS
                    </span>
                    <span className="text-[9px] font-mono ml-1" style={{ color: 'hsl(0 0% 40%)' }}>
                      {seasonalCompanions.length} matches
                    </span>
                    <ChevronDown
                      className="w-3.5 h-3.5 ml-auto transition-transform"
                      style={{
                        color: 'hsl(0 0% 40%)',
                        transform: showSeasonalCompanions ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>
                  <AnimatePresence>
                    {showSeasonalCompanions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y max-h-64 overflow-y-auto" style={{ borderColor: 'hsl(0 0% 10%)' }}>
                          {seasonalCompanions.map(({ crop, compatibility, sharedSeasons, isCompanionMatch, harvestAlign, lunarReady }) => {
                            const cropZone = ZONES.find(z => z.hz === crop.frequency_hz);
                            return (
                              <button
                                key={crop.id}
                                className="px-4 py-2.5 w-full text-left flex items-center gap-3 transition-all"
                                style={{ borderColor: 'hsl(0 0% 10%)' }}
                                onClick={() => {
                                  if (swapSlotIndex !== null) {
                                    handleSwapCrop(crop);
                                  } else {
                                    setSearchQuery(crop.common_name || crop.name);
                                  }
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = `${cropZone?.color || 'hsl(120 50% 55%)'}08`; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                              >
                                {(() => {
                                  const ringColor = compatibility >= 70 ? 'hsl(120 55% 55%)' : compatibility >= 40 ? 'hsl(45 70% 55%)' : 'hsl(0 0% 45%)';
                                  const r = 14; const stroke = 3; const circ = 2 * Math.PI * r;
                                  const offset = circ - (compatibility / 100) * circ;
                                  return (
                                    <div className="flex flex-col items-center shrink-0" style={{ width: 36 }}>
                                      <svg width="36" height="36" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r={r} fill="none" stroke="hsl(0 0% 15%)" strokeWidth={stroke} />
                                        <circle cx="18" cy="18" r={r} fill="none" stroke={ringColor} strokeWidth={stroke}
                                          strokeDasharray={circ} strokeDashoffset={offset}
                                          strokeLinecap="round" transform="rotate(-90 18 18)"
                                          style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
                                        <text x="18" y="19" textAnchor="middle" dominantBaseline="central"
                                          fill={ringColor} fontSize="9" fontFamily="monospace" fontWeight="bold">
                                          {compatibility}
                                        </text>
                                      </svg>
                                    </div>
                                  );
                                })()}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-body truncate" style={{ color: 'hsl(0 0% 80%)' }}>
                                      {crop.common_name || crop.name}
                                    </span>
                                    {isCompanionMatch && (
                                      <span className="text-[7px] font-mono px-1 py-0.5 rounded shrink-0" style={{
                                        background: 'hsl(330 50% 30% / 0.3)',
                                        color: 'hsl(330 60% 65%)',
                                      }}>💚 COMPANION</span>
                                    )}
                                    {lunarReady && (
                                      <span className="text-[7px] font-mono px-1 py-0.5 rounded shrink-0" style={{
                                        background: 'hsl(120 50% 25% / 0.3)',
                                        color: 'hsl(120 60% 60%)',
                                      }}>{lunar.phaseEmoji} READY</span>
                                    )}
                                    <TrapCropBadge description={crop.description} guildRole={crop.guild_role} size="sm" />
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                    {sharedSeasons.length > 0 && (
                                      <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{
                                        background: 'hsl(120 40% 20% / 0.3)',
                                        color: 'hsl(120 40% 55%)',
                                      }}>
                                        📅 {sharedSeasons.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                      </span>
                                    )}
                                    {harvestAlign !== 'none' && (
                                      <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{
                                        background: 'hsl(45 50% 20% / 0.3)',
                                        color: 'hsl(45 60% 55%)',
                                      }}>
                                        🌾 {harvestAlign === 'close' ? '±15d' : '±30d'}
                                      </span>
                                    )}
                                    <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                                      {crop.chord_interval || crop.category}
                                    </span>
                                    <GrowthHabitBadge habit={crop.growth_habit} size="sm" />
                                  </div>
                                </div>
                                {swapSlotIndex !== null && (
                                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0" style={{
                                    background: `${selectedZone?.color || 'hsl(45 80% 55%)'}20`,
                                    color: selectedZone?.color || 'hsl(45 80% 55%)',
                                  }}>SWAP</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

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
                        {plainMode ? (proMode ? '7-PLANT GARDEN PLAN' : '3-PLANT GARDEN PLAN') : (proMode ? '7-VOICE PLANTING CHORD' : '3-VOICE TRIAD')}
                      </span>
                      <div className="ml-auto flex items-center gap-2">
                        {hasData && (
                          <TooltipProvider delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 cursor-help"
                                  style={{
                                    background: pctBg,
                                    color: pctColor,
                                    border: `1px solid ${pctBorder}`,
                                  }}
                                >
                                  📅 {pct}% SEASON SYNC
                                </span>
                              </TooltipTrigger>
                              <TooltipContent
                                side="bottom"
                                className="max-w-[280px] p-3"
                                style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 20%)', color: 'hsl(0 0% 75%)' }}
                              >
                                <p className="font-mono text-[10px] font-bold mb-2" style={{ color: pctColor }}>
                                  SEASON SYNC — {compatible.length}/{slotsWithCrops.length} voices aligned
                                </p>
                                <p className="text-[9px] font-mono mb-2 opacity-60">
                                  Star: {rootCrop?.common_name || rootCrop?.name} ({rootSeasons.join(', ') || 'N/A'})
                                </p>
                                <div className="space-y-1">
                                  {slotsWithCrops.map((s, idx) => {
                                    const cs = s.crop!.planting_season || [];
                                    const isMatch = rootSeasons.length > 0 && cs.length > 0 && rootSeasons.some(rs => cs.includes(rs));
                                    const cropName = s.crop!.common_name || s.crop!.name;
                                    const isFF = environment === 'food-forest';
                                    const layerInfo = isFF && FOOD_FOREST_LAYERS[s.key] ? FOOD_FOREST_LAYERS[s.key] : INTERVAL_ORDER.find(io => io.key === s.key);
                                    const slotLabel = layerInfo ? ('label' in layerInfo ? layerInfo.label : s.label) : s.label;
                                    return (
                                      <div key={idx} className="flex items-center gap-1.5 text-[9px] font-mono">
                                        <span>{isMatch ? '✅' : '⚠️'}</span>
                                        <span className="opacity-50 w-[60px] truncate">{slotLabel}</span>
                                        <span className="truncate" style={{ color: isMatch ? 'hsl(120 50% 60%)' : 'hsl(0 50% 60%)' }}>
                                          {cropName}
                                        </span>
                                        <span className="opacity-40 ml-auto text-[8px]">{cs.join(', ') || '—'}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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

                {/* Synergy, Antagonist, Bodyguard & Placement Summary */}
                {(() => {
                  const recipeCropsForCheck = chordCard.map(s => s.crop);
                  const antagonisms = findAntagonisms(recipeCropsForCheck);
                  const synergies = findSynergies(recipeCropsForCheck);
                  const validCrops = recipeCropsForCheck.filter((c): c is MasterCrop => c !== null);
                  const cropNames = validCrops.map(c => (c.common_name || c.name).toLowerCase());

                  // Find bodyguard matches
                  const bodyguardBadges: { crop: string; guard: string; pest: string }[] = [];
                  for (const name of cropNames) {
                    for (const [target, info] of Object.entries(BODYGUARD_MAP)) {
                      if (name.includes(target)) {
                        for (const g of info.guard) {
                          if (cropNames.some(n => n.includes(g))) {
                            bodyguardBadges.push({ crop: target, guard: g, pest: info.pest });
                          }
                        }
                      }
                    }
                  }

                  // Find placement rules for star crop
                  const starName = recipeCropsForCheck[0] ? (recipeCropsForCheck[0].common_name || recipeCropsForCheck[0].name).toLowerCase() : '';
                  const placementRule = Object.entries(PLACEMENT_RULES).find(([k]) => starName.includes(k));

                  if (antagonisms.length === 0 && synergies.length === 0 && bodyguardBadges.length === 0 && !placementRule) return null;
                  return (
                    <div className="px-5 py-2 flex flex-wrap gap-2 items-center" style={{ background: 'hsl(0 0% 3%)', borderBottom: '1px solid hsl(0 0% 10%)' }}>
                      {synergies.map((s, idx) => (
                        <Tooltip key={`syn-${idx}`}>
                          <TooltipTrigger asChild>
                            <span className="text-[8px] font-mono font-bold px-2 py-1 rounded cursor-help"
                              style={{ background: 'hsl(145 50% 18% / 0.4)', color: 'hsl(145 70% 55%)', border: '1px solid hsl(145 50% 35% / 0.3)' }}>
                              {s.badge}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs text-xs">
                            <p>{s.tip}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {bodyguardBadges.map((bg, idx) => (
                        <Tooltip key={`bg-${idx}`}>
                          <TooltipTrigger asChild>
                            <span className="text-[8px] font-mono font-bold px-2 py-1 rounded cursor-help"
                              style={{ background: 'hsl(45 60% 18% / 0.4)', color: 'hsl(45 80% 60%)', border: '1px solid hsl(45 50% 35% / 0.3)' }}>
                              🛡️ {bg.guard.toUpperCase()} guards {bg.crop.toUpperCase()}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs text-xs">
                            <p><strong>Natural Bodyguard:</strong> {bg.guard} protects {bg.crop} against {bg.pest}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {antagonisms.map((a, idx) => (
                        <Tooltip key={`ant-${idx}`}>
                          <TooltipTrigger asChild>
                            <span className="text-[8px] font-mono font-bold px-2 py-1 rounded cursor-help"
                              style={{ background: 'hsl(0 60% 15% / 0.5)', color: 'hsl(0 70% 60%)', border: '1px solid hsl(0 50% 35% / 0.4)' }}>
                              ⚔️ {a.cropA} vs {a.cropB}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs text-xs">
                            <p>{a.reason}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {placementRule && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-[8px] font-mono font-bold px-2 py-1 rounded cursor-help"
                              style={{ background: 'hsl(210 40% 18% / 0.4)', color: 'hsl(210 60% 65%)', border: '1px solid hsl(210 40% 35% / 0.3)' }}>
                              📐 {placementRule[1]}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs text-xs">
                            <p><strong>Placement Rule:</strong> {placementRule[1]}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  );
                })()}

                {/* Shading Warnings */}
                {shadingWarnings.length > 0 && (
                  <div className="mx-4 mb-3 rounded-lg px-3 py-2" style={{ background: 'hsl(35 60% 15% / 0.3)', border: '1px solid hsl(35 50% 30% / 0.3)' }}>
                    <p className="text-[9px] font-mono font-bold mb-1" style={{ color: 'hsl(35 60% 60%)' }}>☀️ SHADING ADVISORY</p>
                    {shadingWarnings.map((w, idx) => (
                      <p key={idx} className="text-[8px] font-mono leading-relaxed" style={{ color: w.severity === 'warning' ? 'hsl(35 50% 55%)' : 'hsl(0 0% 50%)' }}>
                        {w.severity === 'warning' ? '⚠️' : 'ℹ️'} {w.message}
                      </p>
                    ))}
                  </div>
                )}

                <TooltipProvider delayDuration={300}>
                <div className="divide-y" style={{ borderColor: 'hsl(0 0% 10%)' }}>
                  {chordCard.map((slot, i) => {
                    // Beginner mode: only show Triad (Root, 3rd, 5th)
                    if (!proMode && i >= 3) return null;
                    const isReady = slot.crop
                      ? isCropLunarReady(slot.crop.category, slot.crop.common_name || slot.crop.name, lunar.plantingType)
                      : false;
                    const outsideZone = !!(slot.crop && hardinessZone &&
                      slot.crop.hardiness_zone_min != null && slot.crop.hardiness_zone_max != null &&
                      !cropFitsZone(slot.crop.hardiness_zone_min, slot.crop.hardiness_zone_max, hardinessZone));
                    return (
                      <motion.button
                        key={slot.key}
                        className="px-5 py-4 flex items-center gap-4 w-full text-left transition-all"
                        style={{
                          background: outsideZone
                            ? 'hsl(0 40% 12% / 0.5)'
                            : swapSlotIndex === i
                              ? `${selectedZone.color}10`
                              : 'transparent',
                          outline: swapSlotIndex === i
                            ? `2px solid ${selectedZone.color}60`
                            : outsideZone
                              ? '2px solid hsl(0 50% 30% / 0.4)'
                              : 'none',
                          outlineOffset: '-2px',
                          borderRadius: (swapSlotIndex === i || outsideZone) ? '8px' : '0',
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
                              {environment === 'food-forest' && FOOD_FOREST_LAYERS[slot.key] ? FOOD_FOREST_LAYERS[slot.key].label : (plainMode && slot.plainLabel ? slot.plainLabel : slot.label)}
                            </span>
                            {!plainMode && (
                              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                                background: `${selectedZone.color}15`,
                                color: selectedZone.color,
                                border: `1px solid ${selectedZone.color}30`,
                              }}>
                                {slot.role}
                              </span>
                            )}
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
                                {(() => {
                                  const cropDesc = slot.crop.description
                                    || [
                                      slot.crop.scientific_name ? `${slot.crop.scientific_name}.` : '',
                                      slot.crop.category ? `${slot.crop.category.charAt(0).toUpperCase() + slot.crop.category.slice(1)}` : '',
                                      slot.crop.growth_habit ? `(${slot.crop.growth_habit})` : '',
                                      slot.crop.dominant_mineral ? `• Rich in ${slot.crop.dominant_mineral}` : '',
                                      slot.crop.cultural_role ? `• ${slot.crop.cultural_role}` : '',
                                    ].filter(Boolean).join(' ') || null;
                                  return cropDesc ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="cursor-help border-b border-dotted" style={{ borderColor: 'hsl(0 0% 30%)' }}>
                                          {slot.crop.common_name || slot.crop.name}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="top"
                                        className="max-w-[280px] text-[10px] font-mono leading-relaxed"
                                        style={{
                                          background: 'hsl(0 0% 8%)',
                                          color: 'hsl(0 0% 70%)',
                                          border: `1px solid ${selectedZone.color}30`,
                                        }}
                                      >
                                        {cropDesc}
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <span>{slot.crop.common_name || slot.crop.name}</span>
                                  );
                                })()}
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
                                {/* Sun requirement indicator */}
                                {(() => {
                                  const sun = getSunRequirement(slot.crop!);
                                  const styles = {
                                    full:    { bg: 'hsl(45 70% 20% / 0.3)', color: 'hsl(45 80% 60%)', border: 'hsl(45 60% 35% / 0.4)' },
                                    partial: { bg: 'hsl(35 50% 18% / 0.3)', color: 'hsl(35 60% 55%)', border: 'hsl(35 40% 30% / 0.3)' },
                                    shade:   { bg: 'hsl(210 30% 18% / 0.3)', color: 'hsl(210 40% 55%)', border: 'hsl(210 30% 30% / 0.3)' },
                                  }[sun.level];
                                  const SunIcon = sun.level === 'full' ? Sun : sun.level === 'partial' ? CloudSun : Cloud;
                                  return (
                                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                                      style={{ background: styles.bg, color: styles.color, border: `1px solid ${styles.border}` }}>
                                      <SunIcon className="w-2.5 h-2.5" />
                                      {sun.label}
                                    </span>
                                  );
                                })()}
                                {slot.layer && (
                                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"
                                    style={{ background: 'hsl(200 30% 18% / 0.3)', color: 'hsl(200 50% 60%)', border: '1px solid hsl(200 30% 30% / 0.3)' }}>
                                    📐 {slot.layer.layer} ~{slot.layer.heightFt}ft
                                  </span>
                                )}
                                {starCrop && slot.crop && i > 0 && (() => {
                                  const sName = (starCrop.common_name || starCrop.name).toLowerCase();
                                  const cName = (slot.crop!.common_name || slot.crop!.name).toLowerCase();
                                  const starLists = (starCrop.companion_crops || []).map(n => n.toLowerCase()).some(cn => cName.includes(cn) || cn.includes(cName.split('(')[0].trim()));
                                  const cLists = (slot.crop!.companion_crops || []).map(n => n.toLowerCase()).some(cn => sName.includes(cn) || cn.includes(sName.split('(')[0].trim()));
                                  return (starLists || cLists) ? (
                                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"
                                      style={{ background: 'hsl(330 50% 25% / 0.3)', color: 'hsl(330 60% 65%)', border: '1px solid hsl(330 40% 35% / 0.3)' }}>
                                      💚 USDA COMPANION
                                    </span>
                                  ) : null;
                                })()}
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
                                {/* In-season badge */}
                                {slot.crop && isInCurrentSeason(slot.crop) && (
                                  <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                                    style={{ background: 'hsl(145 50% 18% / 0.4)', color: 'hsl(145 70% 55%)', border: '1px solid hsl(145 50% 35% / 0.4)' }}>
                                    ✅ IN SEASON
                                  </span>
                                )}
                                {slot.crop && !isInCurrentSeason(slot.crop) && (slot.crop.planting_season?.length ?? 0) > 0 && (
                                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                                    style={{ background: 'hsl(0 40% 15% / 0.3)', color: 'hsl(0 50% 50%)', border: '1px solid hsl(0 30% 25% / 0.3)' }}>
                                    🕐 OFF SEASON
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
                                {/* Antagonist warning per crop */}
                                {slot.crop && (() => {
                                  const warning = isAntagonistWith(slot.crop!, chordCard.map(s => s.crop));
                                  if (!warning) return null;
                                  return (
                                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                                      style={{ background: 'hsl(0 60% 15% / 0.5)', color: 'hsl(0 70% 60%)', border: '1px solid hsl(0 50% 35% / 0.4)' }}>
                                      {warning}
                                    </span>
                                  );
                                })()}
                              </div>
                              {/* Inline companion swap suggestions */}
                              {slot.crop && slot.crop.companion_crops && slot.crop.companion_crops.length > 0 && (
                                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                                  <span className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>SWAP →</span>
                                  {slot.crop.companion_crops.slice(0, 4).map((compName) => {
                                    const matchedCrop = (allCrops || []).find(mc => {
                                      const cn = (mc.common_name || mc.name).toLowerCase();
                                      const target = compName.toLowerCase().trim();
                                      return cn === target || cn.includes(target) || target.includes(cn.split('(')[0].trim());
                                    });
                                    if (!matchedCrop || chordCard.some(s => s.crop?.id === matchedCrop.id)) return null;
                                    return (
                                      <button
                                        key={compName}
                                        className="text-[7px] font-mono px-1.5 py-0.5 rounded transition-all hover:scale-105"
                                        style={{
                                          background: `${selectedZone.color}12`,
                                          color: selectedZone.color,
                                          border: `1px solid ${selectedZone.color}30`,
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const currentCrop = chordCard[i]?.crop;
                                          if (currentCrop) setPreSwapCrops(prev => ({ ...prev, [i]: prev[i] || currentCrop }));
                                          setManualOverrides(prev => ({ ...prev, [i]: matchedCrop }));
                                          toast({
                                            title: `${slot.label} swapped`,
                                            description: `Now: ${matchedCrop.common_name || matchedCrop.name}`,
                                          });
                                        }}
                                      >
                                        🔄 {matchedCrop.common_name || matchedCrop.name}
                                      </button>
                                    );
                                  }).filter(Boolean).slice(0, 3)}
                                </div>
                              )}
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
                              const previousCrop = preSwapCrops[i];
                              if (previousCrop) {
                                setManualOverrides(prev => ({ ...prev, [i]: previousCrop }));
                              } else {
                                setManualOverrides(prev => {
                                  const next = { ...prev };
                                  delete next[i];
                                  return next;
                                });
                              }
                              setPreSwapCrops(prev => {
                                const next = { ...prev };
                                delete next[i];
                                return next;
                              });
                              setIsSaved(false);
                              toast({ title: `${slot.label} restored`, description: previousCrop ? `Reverted to ${previousCrop.common_name || previousCrop.name}` : 'Reverted to auto-selected crop.' });
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
                        {/* Lock/Unlock button */}
                        {slot.crop && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLockedSlots(prev => {
                                const next = new Set(prev);
                                if (next.has(i)) {
                                  next.delete(i);
                                  setManualOverrides(prev => {
                                    const updated = { ...prev };
                                    delete updated[i];
                                    return updated;
                                  });
                                } else {
                                  next.add(i);
                                }
                                return next;
                              });
                            }}
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110"
                            style={{
                              background: lockedSlots.has(i) ? `${selectedZone.color}20` : 'hsl(0 0% 12%)',
                              border: `1px solid ${lockedSlots.has(i) ? `${selectedZone.color}50` : 'hsl(0 0% 20%)'}`,
                            }}
                            title={lockedSlots.has(i) ? 'Unlock — this slot will shuffle' : 'Lock — keep this crop during shuffle'}
                          >
                            {lockedSlots.has(i) ? (
                              <Lock className="w-3 h-3" style={{ color: selectedZone.color }} />
                            ) : (
                              <Unlock className="w-3 h-3" style={{ color: 'hsl(0 0% 40%)' }} />
                            )}
                          </button>
                        )}
                        {slot.crop && !manualOverrides[i] && !lockedSlots.has(i) && (
                          <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                            {slot.crop.frequency_hz}Hz
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                </TooltipProvider>

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
                                const currentCrop = chordCard[bestSlot]?.crop;
                                if (currentCrop) setPreSwapCrops(prev => ({ ...prev, [bestSlot]: prev[bestSlot] || currentCrop }));
                                setManualOverrides(prev => ({ ...prev, [bestSlot]: matchedCrop }));
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
                      : `Search ${(allCrops?.length || 0).toLocaleString()} crops by name, family, mineral, season...`
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
                              {(() => {
                                const fam = getCropFamilyKey(crop);
                                const count = familyCounts[fam] || 1;
                                return count > 1 ? (
                                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full shrink-0" style={{
                                    background: 'hsl(45 60% 30% / 0.2)',
                                    color: 'hsl(45 60% 60%)',
                                  }}>
                                    {count} {fam}
                                  </span>
                                ) : null;
                              })()}
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
