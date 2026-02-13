import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sprout, Sun, SunMedium, CloudSun, TreePine, Salad, CookingPot, Flower2, Leaf, Check, Printer, ChevronRight, MapPin, X } from 'lucide-react';
import { useMasterCrops, type MasterCrop } from '@/hooks/useMasterCrops';
import { companionScore, getSynergyNotes } from '@/lib/companionScoring';
import { STATE_HARDINESS_ZONES, US_STATES } from '@/data/stateHardinessZones';
import { getZoneAwarePlantingWindows, cropFitsZone } from '@/lib/frostDates';

/* ─── WIZARD OPTIONS ─── */
type SpaceOption = 'windowsill' | 'patio' | 'small-bed' | 'big-yard';
type SunOption = 'full' | 'partial' | 'shade';
type GoalOption = 'salads' | 'cooking' | 'herbs' | 'flowers';

const SPACE_OPTIONS: { id: SpaceOption; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'windowsill', label: 'Windowsill', desc: 'A few pots on a ledge', icon: <Sprout className="w-6 h-6" /> },
  { id: 'patio', label: 'Patio / Balcony', desc: '3–6 containers', icon: <Leaf className="w-6 h-6" /> },
  { id: 'small-bed', label: 'Small Bed', desc: 'A 4×4 or 4×8 raised bed', icon: <TreePine className="w-6 h-6" /> },
  { id: 'big-yard', label: 'Big Yard', desc: 'Multiple beds or in-ground rows', icon: <TreePine className="w-6 h-6" /> },
];

const SUN_OPTIONS: { id: SunOption; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'full', label: 'Full Sun', desc: '6+ hours of direct sunlight', icon: <Sun className="w-6 h-6" /> },
  { id: 'partial', label: 'Partial Sun', desc: '3–6 hours of direct sunlight', icon: <SunMedium className="w-6 h-6" /> },
  { id: 'shade', label: 'Mostly Shade', desc: 'Less than 3 hours direct', icon: <CloudSun className="w-6 h-6" /> },
];

const GOAL_OPTIONS: { id: GoalOption; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'salads', label: 'Fresh Salads', desc: 'Lettuce, tomatoes, cucumbers', icon: <Salad className="w-6 h-6" /> },
  { id: 'cooking', label: 'Cooking Staples', desc: 'Peppers, onions, beans', icon: <CookingPot className="w-6 h-6" /> },
  { id: 'herbs', label: 'Herbs & Tea', desc: 'Basil, mint, chamomile', icon: <Leaf className="w-6 h-6" /> },
  { id: 'flowers', label: 'Flowers & Color', desc: 'Pollinators and beauty', icon: <Flower2 className="w-6 h-6" /> },
];

/* ─── CROP SELECTION LOGIC ─── */

// Map goals to preferred categories/common names
const GOAL_CROPS: Record<GoalOption, string[]> = {
  salads: ['Lettuce', 'Tomato', 'Cucumber', 'Radish', 'Spinach', 'Arugula', 'Mesclun', 'Cherry Tomato', 'Snap Pea', 'Carrot'],
  cooking: ['Tomato', 'Pepper', 'Onion', 'Garlic', 'Bean', 'Squash', 'Eggplant', 'Potato', 'Sweet Potato', 'Okra'],
  herbs: ['Basil', 'Mint', 'Rosemary', 'Thyme', 'Cilantro', 'Parsley', 'Chamomile', 'Lavender', 'Oregano', 'Dill'],
  flowers: ['Marigold', 'Sunflower', 'Zinnia', 'Nasturtium', 'Calendula', 'Echinacea', 'Cosmos', 'Rose', 'Lavender', 'Bee Balm'],
};

const SHADE_FRIENDLY = ['Lettuce', 'Spinach', 'Arugula', 'Mint', 'Parsley', 'Cilantro', 'Radish', 'Mesclun', 'Kale', 'Chamomile', 'Calendula', 'Nasturtium'];

function pickRecipe(
  allCrops: MasterCrop[],
  space: SpaceOption,
  sun: SunOption,
  goals: GoalOption[],
): MasterCrop[] {
  const preferredNames = goals.flatMap(g => GOAL_CROPS[g]);
  const maxPlants = space === 'windowsill' ? 3 : space === 'patio' ? 4 : space === 'small-bed' ? 5 : 6;

  // Score and filter crops
  const scored = allCrops
    .filter(c => {
      const name = (c.common_name || c.name).toLowerCase();
      // For shade, only allow shade-friendly crops
      if (sun === 'shade' && !SHADE_FRIENDLY.some(s => name.includes(s.toLowerCase()))) return false;
      // For containers, only allow crops that fit (spacing ≤ 18")
      if ((space === 'windowsill' || space === 'patio') && c.spacing_inches) {
        const sp = parseInt(c.spacing_inches);
        if (!isNaN(sp) && sp > 18) return false;
      }
      return true;
    })
    .map(c => {
      const name = (c.common_name || c.name).toLowerCase();
      let score = 0;
      // Strong boost if name starts with a preferred crop keyword (word boundary)
      for (const pref of preferredNames) {
        const prefLower = pref.toLowerCase();
        // Match as whole word or at start of name
        const regex = new RegExp(`\\b${prefLower}\\b`);
        if (regex.test(name)) { score += 20; break; }
      }
      // Boost growth habit matching the goal
      if (goals.includes('herbs') && c.growth_habit === 'herb') score += 10;
      if (goals.includes('flowers') && (c.category === 'Dye/Fiber/Aromatic' || c.growth_habit === 'herb')) score += 8;
      // Boost easy-to-grow categories
      if (c.category === 'Sustenance') score += 2;
      // Boost shorter harvest days (beginner-friendly)
      if (c.harvest_days && c.harvest_days <= 60) score += 3;
      else if (c.harvest_days && c.harvest_days <= 90) score += 1;
      // Boost herbs for small spaces
      if ((space === 'windowsill' || space === 'patio') && c.growth_habit === 'herb') score += 3;
      return { crop: c, score };
    });

  // Sort by base score descending
  scored.sort((a, b) => b.score - a.score);

  // Greedy pick with companion soft-boost and diversity enforcement
  const picked: MasterCrop[] = [];
  const usedSpecies = new Set<string>();
  const usedCategories = new Map<string, number>();

  for (const entry of scored) {
    if (picked.length >= maxPlants) break;

    const { crop } = entry;

    // Deduplicate by scientific name (prevents 4 tomato varieties)
    const species = (crop.scientific_name || crop.name).toLowerCase().trim();
    if (usedSpecies.has(species)) continue;

    // Limit any single category to max 2 picks for variety
    const cat = crop.category || 'Other';
    const catCount = usedCategories.get(cat) || 0;
    if (catCount >= 2) continue;

    // Companion soft-boost: score against already-picked crops
    const compScore = companionScore(crop, picked);
    // Skip if heavy antagonist penalty
    if (compScore <= -10) continue;

    usedSpecies.add(species);
    usedCategories.set(cat, catCount + 1);
    picked.push(crop);
  }

  return picked;
}

/* ─── SIMPLE INSTRUCTIONS ─── */

function getPlainInstructions(crop: MasterCrop, space: SpaceOption): string[] {
  const instructions: string[] = [];
  const name = crop.common_name || crop.name;

  // Container size
  if (space === 'windowsill' || space === 'patio') {
    const gal = crop.min_container_gal;
    if (gal && gal <= 2) instructions.push(`Use a small pot (${gal}+ gallon)`);
    else if (gal && gal <= 5) instructions.push(`Use a medium pot (${gal}+ gallon)`);
    else if (gal) instructions.push(`Use a large pot (${gal}+ gallon)`);
    else instructions.push('Use a pot with drainage holes');
  } else {
    // Spacing
    if (crop.spacing_inches) instructions.push(`Space plants ${crop.spacing_inches}" apart`);
  }

  // Planting season
  if (crop.planting_season?.length) {
    instructions.push(`Plant in ${crop.planting_season.join(' or ')}`);
  }

  // Propagation
  if (crop.propagation_method === 'direct_sow') instructions.push('Sow seeds directly in soil');
  else if (crop.propagation_method === 'transplant') instructions.push('Start indoors or buy seedlings');
  else instructions.push('Sow seeds or buy seedlings');

  // Harvest
  if (crop.harvest_days) {
    if (crop.harvest_days <= 30) instructions.push(`Ready to pick in about ${crop.harvest_days} days — one of the fastest!`);
    else if (crop.harvest_days <= 60) instructions.push(`Ready to pick in about ${crop.harvest_days} days`);
    else if (crop.harvest_days <= 90) instructions.push(`Harvest in about ${Math.round(crop.harvest_days / 30)} months`);
    else instructions.push(`Harvest in about ${Math.round(crop.harvest_days / 30)} months — worth the wait!`);
  }

  // Watering tip
  instructions.push('Water when the top inch of soil feels dry');

  return instructions;
}

/* ─── COMPONENT ─── */

const FirstGarden = () => {
  const navigate = useNavigate();
  const { data: allCrops, isLoading } = useMasterCrops();
  const [step, setStep] = useState(0); // 0=space, 1=sun, 2=goal, 3=zone, 4=result
  const [space, setSpace] = useState<SpaceOption | null>(null);
  const [sun, setSun] = useState<SunOption | null>(null);
  const [goals, setGoals] = useState<GoalOption[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hardinessZone, setHardinessZone] = useState<number | null>(null);
  const [hardinessSubZone, setHardinessSubZone] = useState<string | null>(null);

  // Filter crops by hardiness zone before recipe generation
  const zonedCrops = useMemo(() => {
    if (!allCrops) return [];
    if (!hardinessZone) return allCrops;
    return allCrops.filter(c => cropFitsZone(c.hardiness_zone_min, c.hardiness_zone_max, hardinessZone));
  }, [allCrops, hardinessZone]);

  const recipe = useMemo(() => {
    if (!zonedCrops || zonedCrops.length === 0 || !space || !sun || goals.length === 0) return [];
    return pickRecipe(zonedCrops, space, sun, goals);
  }, [zonedCrops, space, sun, goals]);

  const handleNext = () => {
    if (step < 4) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
    else navigate(-1);
  };

  const handlePrint = () => {
    window.print();
  };

  const canAdvance = (step === 0 && space) || (step === 1 && sun) || (step === 2 && goals.length > 0) || step === 3;

  const stepTitles = [
    'How much space do you have?',
    'How much sun does your spot get?',
    'What do you want to grow?',
    'Where are you located?',
  ];

  return (
    <div className="min-h-screen" style={{ background: 'hsl(140 15% 5%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
        <button
          onClick={handleBack}
          className="p-2 rounded-full transition-colors"
          style={{ background: 'hsl(0 0% 10%)', color: 'hsl(0 0% 60%)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5" style={{ color: 'hsl(130 50% 55%)' }} />
          <span className="font-mono text-sm tracking-wider" style={{ color: 'hsl(130 50% 55%)' }}>
            MY FIRST GARDEN
          </span>
        </div>
        <div className="w-9" /> {/* spacer */}
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              background: i <= step ? 'hsl(130 50% 55%)' : 'hsl(0 0% 15%)',
              boxShadow: i === step ? '0 0 8px hsl(130 50% 55% / 0.5)' : 'none',
            }}
          />
        ))}
      </div>

      <div className="max-w-lg mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {/* ─── STEPS 0-3: Questions ─── */}
          {step < 4 && step < 3 && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-center mb-8" style={{ color: 'hsl(0 0% 85%)' }}>
                {stepTitles[step]}
              </h2>

              <div className="grid gap-3">
                {(step === 0 ? SPACE_OPTIONS : step === 1 ? SUN_OPTIONS : GOAL_OPTIONS).map((opt) => {
                  const isSelected =
                    (step === 0 && space === opt.id) ||
                    (step === 1 && sun === opt.id) ||
                    (step === 2 && goals.includes(opt.id as GoalOption));

                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (step === 0) setSpace(opt.id as SpaceOption);
                        else if (step === 1) setSun(opt.id as SunOption);
                        else {
                          const g = opt.id as GoalOption;
                          setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
                        }
                      }}
                      className="flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: isSelected ? 'hsl(130 30% 12%)' : 'hsl(0 0% 7%)',
                        border: `2px solid ${isSelected ? 'hsl(130 50% 45%)' : 'hsl(0 0% 12%)'}`,
                        boxShadow: isSelected ? '0 0 16px hsl(130 50% 45% / 0.15)' : 'none',
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                          background: isSelected ? 'hsl(130 50% 45% / 0.15)' : 'hsl(0 0% 10%)',
                          color: isSelected ? 'hsl(130 50% 55%)' : 'hsl(0 0% 40%)',
                        }}
                      >
                        {opt.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm" style={{ color: isSelected ? 'hsl(130 50% 70%)' : 'hsl(0 0% 70%)' }}>
                          {opt.label}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'hsl(0 0% 40%)' }}>
                          {opt.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(130 50% 55%)' }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleNext}
                  disabled={!canAdvance}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{
                    background: canAdvance ? 'hsl(130 50% 45%)' : 'hsl(0 0% 12%)',
                    color: canAdvance ? 'hsl(0 0% 5%)' : 'hsl(0 0% 30%)',
                    boxShadow: canAdvance ? '0 4px 20px hsl(130 50% 45% / 0.3)' : 'none',
                    cursor: canAdvance ? 'pointer' : 'not-allowed',
                  }}
                >
                  {step === 2 ? 'Next' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Skip to Advanced */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/crop-oracle')}
                  className="text-[11px] font-mono tracking-wider transition-colors hover:underline"
                  style={{ color: 'hsl(0 0% 35%)' }}
                >
                  Skip to Advanced Studio →
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: Zone Selection ─── */}
          {step === 3 && (
            <motion.div
              key="step-zone"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-center mb-2" style={{ color: 'hsl(0 0% 85%)' }}>
                {stepTitles[3]}
              </h2>
              <p className="text-xs text-center mb-6" style={{ color: 'hsl(0 0% 45%)' }}>
                Select your state to filter crops for your climate zone
              </p>

              <div
                className="grid grid-cols-4 gap-1.5 max-h-64 overflow-y-auto rounded-xl p-3"
                style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 12%)' }}
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
                      }}
                      className="text-left px-2 py-1.5 rounded-md font-mono text-[10px] transition-all truncate"
                      style={{
                        background: isActive ? 'hsl(130 30% 12%)' : 'hsl(0 0% 7%)',
                        border: `1.5px solid ${isActive ? 'hsl(130 50% 45%)' : 'hsl(0 0% 15%)'}`,
                        color: isActive ? 'hsl(130 50% 65%)' : 'hsl(0 0% 55%)',
                      }}
                    >
                      <span className="font-bold">{info.abbr}</span>
                      <span className="ml-1 opacity-60">{info.subZone}</span>
                    </button>
                  );
                })}
              </div>

              {selectedState && (
                <div
                  className="mt-3 px-3 py-2 rounded-xl flex items-center gap-2"
                  style={{ background: 'hsl(130 30% 10%)', border: '1px solid hsl(130 50% 30% / 0.4)' }}
                >
                  <MapPin className="w-3.5 h-3.5" style={{ color: 'hsl(130 50% 55%)' }} />
                  <span className="text-xs font-mono" style={{ color: 'hsl(130 50% 65%)' }}>
                    {selectedState} — USDA Zone {hardinessSubZone}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedState(null);
                      setHardinessZone(null);
                      setHardinessSubZone(null);
                    }}
                    className="ml-auto"
                  >
                    <X className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 45%)' }} />
                  </button>
                </div>
              )}

              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{
                    background: 'hsl(130 50% 45%)',
                    color: 'hsl(0 0% 5%)',
                    boxShadow: '0 4px 20px hsl(130 50% 45% / 0.3)',
                  }}
                >
                  {selectedState ? 'Show My Garden Plan' : 'Skip — Show All Crops'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 4: Result ─── */}
          {step === 4 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="print:bg-white"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3" style={{ background: 'hsl(130 30% 12%)', border: '1px solid hsl(130 50% 45% / 0.3)' }}>
                  <Sprout className="w-4 h-4" style={{ color: 'hsl(130 50% 55%)' }} />
                  <span className="text-xs font-mono" style={{ color: 'hsl(130 50% 65%)' }}>YOUR GARDEN PLAN</span>
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'hsl(0 0% 85%)' }}>
                  {goals.includes('salads') && goals.length === 1 ? '🥗 Fresh Salad Garden' :
                   goals.includes('cooking') && goals.length === 1 ? '🍳 Kitchen Garden' :
                   goals.includes('herbs') && goals.length === 1 ? '🌿 Herb & Tea Garden' :
                   goals.includes('flowers') && goals.length === 1 ? '🌸 Flower Garden' :
                   '🌱 Mixed Garden'}
                </h2>
                <p className="text-xs mt-1" style={{ color: 'hsl(0 0% 45%)' }}>
                  {space === 'windowsill' ? 'Windowsill' : space === 'patio' ? 'Patio containers' : space === 'small-bed' ? 'Small raised bed' : 'Yard beds'} · {sun === 'full' ? 'Full sun' : sun === 'partial' ? 'Partial sun' : 'Shade'} · {recipe.length} plants
                  {selectedState && hardinessSubZone && (
                    <span> · Zone {hardinessSubZone} ({STATE_HARDINESS_ZONES[selectedState]?.abbr})</span>
                  )}
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <Sprout className="w-8 h-8 mx-auto animate-pulse" style={{ color: 'hsl(130 50% 45%)' }} />
                  <p className="text-xs mt-3 font-mono" style={{ color: 'hsl(0 0% 40%)' }}>Finding the perfect plants...</p>
                </div>
              ) : recipe.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm" style={{ color: 'hsl(0 0% 50%)' }}>No crops matched your criteria. Try adjusting your selections.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {recipe.map((crop, i) => {
                    const instructions = getPlainInstructions(crop, space!);
                    const synergies = getSynergyNotes(crop, recipe);
                    return (
                      <div
                        key={crop.id}
                        className="rounded-xl p-4"
                        style={{
                          background: 'hsl(0 0% 7%)',
                          border: '1px solid hsl(0 0% 12%)',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                            style={{
                              background: 'hsl(130 30% 12%)',
                              color: 'hsl(130 50% 55%)',
                              border: '1px solid hsl(130 50% 45% / 0.2)',
                            }}
                          >
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm" style={{ color: 'hsl(0 0% 85%)' }}>
                              {crop.common_name || crop.name}
                            </h3>
                            {crop.scientific_name && (
                              <p className="text-[10px] italic" style={{ color: 'hsl(0 0% 35%)' }}>{crop.scientific_name}</p>
                            )}

                            {/* Yield, harvest & planting window badges */}
                            <div className="flex gap-2 mt-1.5 flex-wrap">
                              {crop.harvest_days && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'hsl(200 30% 12%)', color: 'hsl(200 50% 65%)' }}>
                                  ~{crop.harvest_days} days to harvest
                                </span>
                              )}
                              {crop.est_yield_lbs_per_plant != null && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'hsl(130 30% 12%)', color: 'hsl(130 50% 65%)' }}>
                                  ~{crop.est_yield_lbs_per_plant} lbs/plant
                                </span>
                              )}
                              {crop.hardiness_zone_min != null && crop.hardiness_zone_max != null && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-0.5" style={{ background: 'hsl(140 30% 12%)', color: 'hsl(140 50% 60%)', border: '1px solid hsl(140 40% 25% / 0.3)' }}>
                                  🌍 Zone {Math.floor(crop.hardiness_zone_min)}{crop.hardiness_zone_min % 1 >= 0.5 ? 'b' : 'a'}–{Math.floor(crop.hardiness_zone_max)}{crop.hardiness_zone_max % 1 >= 0.5 ? 'b' : 'a'}
                                </span>
                              )}
                              {hardinessZone && crop.planting_season && crop.planting_season.length > 0 && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-0.5" style={{ background: 'hsl(200 40% 12%)', color: 'hsl(200 60% 60%)', border: '1px solid hsl(200 40% 25% / 0.3)' }}>
                                  📅 {getZoneAwarePlantingWindows(crop.planting_season, hardinessZone).map(w => w.window).join(' · ')}
                                </span>
                              )}
                            </div>

                            {/* Companion synergy badges */}
                            {synergies.length > 0 && (
                              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                {synergies.map((note, k) => (
                                  <span
                                    key={k}
                                    className="text-[9px] font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                                    style={{
                                      background: note.type === 'companion' ? 'hsl(270 30% 12%)' : 'hsl(0 30% 12%)',
                                      color: note.type === 'companion' ? 'hsl(270 50% 70%)' : 'hsl(0 50% 65%)',
                                    }}
                                  >
                                    {note.type === 'companion' ? '✦' : '⚠'} {note.message}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Instructions */}
                            <ul className="mt-2.5 space-y-1">
                              {instructions.map((inst, j) => (
                                <li key={j} className="flex items-start gap-2 text-xs" style={{ color: 'hsl(0 0% 55%)' }}>
                                  <ChevronRight className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: 'hsl(130 50% 45%)' }} />
                                  {inst}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-6 justify-center print:hidden">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-colors"
                  style={{ background: 'hsl(0 0% 8%)', color: 'hsl(0 0% 50%)', border: '1px solid hsl(0 0% 15%)' }}
                >
                  <Printer className="w-3.5 h-3.5" />
                  PRINT
                </button>
                <button
                  onClick={() => navigate('/crop-oracle')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-colors"
                  style={{ background: 'hsl(130 30% 15%)', color: 'hsl(130 50% 65%)', border: '1px solid hsl(130 50% 45% / 0.3)' }}
                >
                  <Sprout className="w-3.5 h-3.5" />
                  ADVANCED PLANNER
                </button>
              </div>

              {/* Tip */}
              <div className="mt-6 p-3 rounded-xl text-center" style={{ background: 'hsl(45 30% 8%)', border: '1px solid hsl(45 40% 25% / 0.3)' }}>
                <p className="text-[11px]" style={{ color: 'hsl(45 40% 60%)' }}>
                  💡 <strong>Beginner tip:</strong> Start with just 2–3 plants. You can always add more once you see how they grow!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FirstGarden;
