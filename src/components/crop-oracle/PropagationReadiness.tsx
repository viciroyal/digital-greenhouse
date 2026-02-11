import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Lightbulb, Cloud, Loader2, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SupplyItem {
  id: string;
  label: string;
  emoji: string;
  weight: number;
  tip: string;
  alternatives: string;
}

const SUPPLY_CHECKLIST: SupplyItem[] = [
  {
    id: 'seeds',
    label: 'Quality Seeds (Open-Pollinated / Heirloom)',
    emoji: '🌰',
    weight: 12,
    tip: 'Open-pollinated & heirloom varieties let you save seeds year after year — building sovereignty. Check packed date for viability.',
    alternatives: 'Seed libraries, swaps, and orgs like Southern Exposure Seed Exchange offer locally-adapted, heritage varieties for free or low cost.',
  },
  {
    id: 'trays',
    label: 'Seed Starting Trays / Soil Blocks',
    emoji: '🫘',
    weight: 12,
    tip: 'Soil blocks eliminate plastic waste and air-prune roots naturally. Cell trays work too — less transplant shock than open flats.',
    alternatives: 'A soil block maker pays for itself fast. DIY: newspaper pots, egg cartons, or toilet paper rolls.',
  },
  {
    id: 'mix',
    label: 'Living Seed Starting Mix',
    emoji: '🌱',
    weight: 15,
    tip: 'A biologically active mix with compost, worm castings & mycorrhizae gives seedlings a microbial head start — not just structure.',
    alternatives: 'DIY: 1 part sifted compost, 1 part coco coir, 1 part vermiculite + a handful of worm castings.',
  },
  {
    id: 'compost',
    label: 'Compost / Worm Castings',
    emoji: '🪱',
    weight: 18,
    tip: 'The foundation of regen ag. Feeds soil biology, builds structure, and holds moisture. Vermicompost is liquid gold for seedlings.',
    alternatives: 'Start a worm bin ($30) or compost pile. Many cities offer free compost — check Food Well Alliance in ATL.',
  },
  {
    id: 'cover_crop',
    label: 'Cover Crop Seed (Clover, Rye, Vetch)',
    emoji: '🌾',
    weight: 14,
    tip: 'Cover crops fix nitrogen, prevent erosion, and feed mycorrhizal networks between seasons. Never leave soil bare.',
    alternatives: 'Crimson clover is cheap and easy. Daikon radish breaks compacted soil. Mix species for maximum benefit.',
  },
  {
    id: 'inoculant',
    label: 'Mycorrhizal Inoculant',
    emoji: '🍄',
    weight: 12,
    tip: 'Mycorrhizae extend root reach 100–1000x, unlocking phosphorus and water. Apply at transplant directly on roots.',
    alternatives: 'Collect forest soil from under healthy trees for a free, diverse inoculant. Avoid tilling to preserve existing networks.',
  },
  {
    id: 'mulch',
    label: 'Organic Mulch (Straw, Leaves, Woodchips)',
    emoji: '🍂',
    weight: 14,
    tip: 'Mulch mimics the forest floor — suppresses weeds, retains moisture, feeds fungi, and moderates soil temperature.',
    alternatives: 'Free: fallen leaves, grass clippings, cardboard. Arborists often give away woodchips — check ChipDrop.',
  },
  {
    id: 'biochar',
    label: 'Biochar / Terra Preta Amendments',
    emoji: '🔥',
    weight: 8,
    tip: 'Charged biochar acts as a coral reef for soil microbes — holds nutrients and water for centuries. Charge it in compost tea first.',
    alternatives: 'DIY biochar from a top-lit updraft (TLUD) stove. Never apply raw — always charge with compost or urine first.',
  },
  {
    id: 'foliar',
    label: 'Foliar Spray (Compost Tea / Kelp / Fish)',
    emoji: '🐟',
    weight: 8,
    tip: 'Foliar feeds bypass root limitations. Kelp provides growth hormones, fish emulsion feeds biology, compost tea inoculates leaf surfaces.',
    alternatives: 'Brew aerated compost tea in a 5-gal bucket with an aquarium pump — costs under $15 to set up.',
  },
  {
    id: 'refractometer',
    label: 'Refractometer (Brix Meter)',
    emoji: '🔬',
    weight: 10,
    tip: 'Measures dissolved sugars (Brix) in plant sap — a direct indicator of nutrient density and pest resistance. Higher Brix = healthier plants.',
    alternatives: 'A basic optical refractometer costs ~$20 online. Essential tool for the regen steward.',
  },
  {
    id: 'soil_test',
    label: 'Soil Test Kit / Lab Access',
    emoji: '🧪',
    weight: 10,
    tip: 'Know your soil before amending. Test for pH, organic matter, CEC, and micronutrients. Retest annually to track improvement.',
    alternatives: 'Your local extension office often offers free or low-cost soil testing. DIY: jar test for texture, vinegar/baking soda for pH.',
  },
  {
    id: 'broadfork',
    label: 'Broadfork / No-Till Tools',
    emoji: '⛏️',
    weight: 8,
    tip: 'A broadfork aerates without inverting soil layers — preserving fungal networks, worm tunnels, and soil structure.',
    alternatives: 'Tarps and cardboard sheet-mulching can open new beds with zero tillage. A digging fork works in a pinch.',
  },
  {
    id: 'rain_harvest',
    label: 'Rain Barrel / Water Harvesting',
    emoji: '🌧️',
    weight: 7,
    tip: 'Rainwater is naturally soft, chlorine-free, and slightly acidic — perfect for soil biology. 1 inch of rain on 1,000 sq ft = 623 gallons.',
    alternatives: 'A single 55-gal barrel on a downspout is a great start. Swales and berms harvest rain passively on larger land.',
  },
];


interface PropagationReadinessProps {
  zoneColor: string;
}

const PropagationReadiness = ({ zoneColor }: PropagationReadinessProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load user session + saved checklist
  useEffect(() => {
    const loadChecklist = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setLoaded(true); return; }
      setUserId(session.user.id);

      const { data } = await supabase
        .from('readiness_checklist')
        .select('checked_items')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (data?.checked_items) {
        setCheckedItems(new Set(data.checked_items));
      }
      setLoaded(true);
    };
    loadChecklist();
  }, []);

  // Debounced save to database
  const saveToDb = useCallback((items: Set<string>) => {
    if (!userId) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSyncing(true);
      const arr = Array.from(items);
      const { data: existing } = await supabase
        .from('readiness_checklist')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('readiness_checklist')
          .update({ checked_items: arr, updated_at: new Date().toISOString() })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('readiness_checklist')
          .insert({ user_id: userId, checked_items: arr });
      }
      setSyncing(false);
    }, 800);
  }, [userId]);

  const toggle = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveToDb(next);
      return next;
    });
  };

  const resetAll = () => {
    const empty = new Set<string>();
    setCheckedItems(empty);
    saveToDb(empty);
  };

  const totalWeight = SUPPLY_CHECKLIST.reduce((s, i) => s + i.weight, 0);
  const earnedWeight = SUPPLY_CHECKLIST.filter(i => checkedItems.has(i.id)).reduce((s, i) => s + i.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  const missing = SUPPLY_CHECKLIST.filter(i => !checkedItems.has(i.id));
  const topMissing = missing.sort((a, b) => b.weight - a.weight).slice(0, 3);

  const vibeLabel =
    score >= 90 ? 'Ready to Grow' :
    score >= 65 ? 'Solid Foundation' :
    score >= 40 ? 'Getting There' :
    score > 0 ? 'Just Starting Out' :
    'Check What You Have';

  const vibeColor =
    score >= 90 ? 'hsl(120 45% 50%)' :
    score >= 65 ? 'hsl(80 50% 50%)' :
    score >= 40 ? 'hsl(45 70% 55%)' :
    'hsl(0 0% 45%)';

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-3.5 h-3.5" style={{ color: 'hsl(45 70% 60%)' }} />
        <span className="text-[9px] font-mono tracking-widest" style={{ color: 'hsl(45 60% 55%)' }}>
          READINESS CHECK — WHAT DO YOU HAVE?
        </span>
        {userId && (
          <span className="ml-auto flex items-center gap-1 text-[7px] font-mono" style={{ color: syncing ? 'hsl(45 60% 55%)' : 'hsl(120 35% 45%)' }}>
            {syncing ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Cloud className="w-2.5 h-2.5" />}
            {syncing ? 'saving…' : 'synced'}
          </span>
        )}
        {checkedItems.size > 0 && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1 text-[7px] font-mono px-1.5 py-0.5 rounded transition-colors hover:opacity-80"
            style={{ color: 'hsl(0 50% 55%)', background: 'hsl(0 30% 12%)', border: '1px solid hsl(0 25% 20%)' }}
          >
            <RotateCcw className="w-2.5 h-2.5" />
            reset
          </button>
        )}
      </div>

      <p className="text-[8px] font-mono mb-3 leading-relaxed" style={{ color: 'hsl(0 0% 45%)' }}>
        This is a guide, not a law — check off what you already have and we'll suggest what might help most. You can absolutely start with less.
      </p>

      {/* Checklist */}
      <div className="space-y-1 mb-3">
        {SUPPLY_CHECKLIST.map(item => {
          const checked = checkedItems.has(item.id);
          const isExpanded = expandedTip === item.id;

          return (
            <div key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all"
                style={{
                  background: checked ? `${zoneColor}10` : 'hsl(0 0% 7%)',
                  border: `1px solid ${checked ? `${zoneColor}40` : 'hsl(0 0% 13%)'}`,
                }}
              >
                {checked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: zoneColor }} />
                ) : (
                  <Circle className="w-3.5 h-3.5 shrink-0" style={{ color: 'hsl(0 0% 25%)' }} />
                )}
                <span className="text-sm shrink-0">{item.emoji}</span>
                <span
                  className="text-[9px] font-mono flex-1"
                  style={{ color: checked ? zoneColor : 'hsl(0 0% 55%)' }}
                >
                  {item.label}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedTip(isExpanded ? null : item.id);
                  }}
                  className="text-[8px] font-mono shrink-0 px-1.5 py-0.5 rounded"
                  style={{
                    color: 'hsl(0 0% 40%)',
                    background: 'hsl(0 0% 10%)',
                  }}
                >
                  {isExpanded ? 'less' : 'tips'}
                </button>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-6 mt-1 mb-1 px-2.5 py-2 rounded-lg"
                  style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 12%)' }}
                >
                  <p className="text-[8px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 50%)' }}>
                    {item.tip}
                  </p>
                  <p className="text-[8px] font-mono leading-relaxed mt-1" style={{ color: 'hsl(45 50% 50%)' }}>
                    💡 {item.alternatives}
                  </p>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score bar */}
      <div
        className="p-2.5 rounded-lg"
        style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 13%)' }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono font-bold" style={{ color: vibeColor }}>
            {vibeLabel}
          </span>
          <span className="text-[9px] font-mono font-bold" style={{ color: vibeColor }}>
            {score}%
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(0 0% 12%)' }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ background: vibeColor }}
          />
        </div>

        {/* Suggestions for missing high-impact items */}
        {topMissing.length > 0 && score < 90 && (
          <div className="mt-2 space-y-1">
            <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 40%)' }}>
              {score >= 65 ? 'Nice to have next:' : 'Would help most:'}
            </span>
            {topMissing.map(item => (
              <div key={item.id} className="flex items-center gap-1.5">
                <span className="text-[10px]">{item.emoji}</span>
                <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {score >= 90 && (
          <p className="text-[8px] font-mono mt-2 leading-relaxed" style={{ color: 'hsl(120 40% 50%)' }}>
            🌿 You're well-equipped — time to sow some seeds!
          </p>
        )}
      </div>
    </div>
  );
};

export default PropagationReadiness;
