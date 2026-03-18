import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sun, CloudSun, Sprout, ShoppingCart, Leaf } from 'lucide-react';
import collectivelySustainable from '@/assets/collectively-sustainable.png';
import ZoneSelector from '@/components/ten-by-ten/ZoneSelector';
import { STATE_HARDINESS_ZONES } from '@/data/stateHardinessZones';

/* ─── DATA ─── */

const SOIL_MATERIALS = [
  { name: 'Sphagnum Peat Moss', brand: 'Majestic Earth', desc: '3CF Organic Peat Moss — Moisture control', qty: 6, price: 23.98 },
  { name: 'Cow Manure', brand: 'Black Kow', desc: 'Premium 1 Cubic Foot Organic Manure — Provides organic nutrients', qty: 8, price: 6.48 },
  { name: 'Perlite', brand: 'Viagrow', desc: '1-Pack Horticultural 4 cu.ft / 113 liters — Drainage and aeration', qty: 2, price: 36.67 },
];

type PlantingPlan = { crop: string; spacing: string; plants: string; note?: string };
type SeasonOption = { season: string; plans: PlantingPlan[] };
type SunOption = { id: 'full' | 'partial'; label: string; icon: React.ReactNode; options: SeasonOption[] };

const SUN_OPTIONS: SunOption[] = [
  {
    id: 'full', label: 'Full Sun', icon: <Sun className="w-6 h-6" />,
    options: [
      { season: 'Spring Planting', plans: [
        { crop: 'Sweet Potato Slips', spacing: '12–18"', plants: '~20 plants' },
        { crop: 'Tomatoes (Roma)', spacing: '18–24"', plants: '~16 plants', note: 'Staked/trellised, north side' },
        { crop: 'Beans (Bush)', spacing: '4–6"', plants: '~20 plants' },
      ]},
      { season: 'Fall Planting', plans: [
        { crop: 'Collard Greens', spacing: '18"', plants: '~20 plants' },
        { crop: 'Cabbage', spacing: '18"', plants: '~20 plants' },
        { crop: 'Peas', spacing: '3–4"', plants: '~40 plants' },
      ]},
    ],
  },
  {
    id: 'partial', label: 'Partial Sun', icon: <CloudSun className="w-6 h-6" />,
    options: [
      { season: 'Spring Planting', plans: [
        { crop: 'Collard Greens', spacing: '18"', plants: '~20 plants' },
        { crop: 'Kale', spacing: '12–18"', plants: '~20 plants' },
        { crop: 'Beets', spacing: '3–4"', plants: '~40 plants' },
      ]},
      { season: 'Fall Planting', plans: [
        { crop: 'Lettuce', spacing: '8–10"', plants: '~24 plants' },
        { crop: 'Cabbage', spacing: '18"', plants: '~20 plants' },
        { crop: 'Carrots', spacing: '2–3"', plants: '~40 plants' },
      ]},
    ],
  },
];

/* ─── SUB-COMPONENTS ─── */

const MaterialCard = ({ mat }: { mat: typeof SOIL_MATERIALS[0] }) => (
  <div className="rounded-xl p-4 flex items-start gap-4" style={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 15%)' }}>
    <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg" style={{ background: 'hsl(130 50% 45% / 0.12)', color: 'hsl(130 50% 55%)' }}>
      ×{mat.qty}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-semibold text-sm" style={{ color: 'hsl(0 0% 85%)' }}>{mat.name}</span>
        <span className="text-xs font-mono" style={{ color: 'hsl(45 60% 55%)' }}>{mat.brand}</span>
      </div>
      <p className="text-xs mt-1" style={{ color: 'hsl(0 0% 45%)' }}>{mat.desc}</p>
      <p className="text-sm font-mono mt-2" style={{ color: 'hsl(130 50% 60%)' }}>${mat.price.toFixed(2)} each</p>
    </div>
  </div>
);

const PlantingTable = ({ plans }: { plans: PlantingPlan[] }) => (
  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(0 0% 15%)' }}>
    {plans.map((p, i) => (
      <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ background: i % 2 === 0 ? 'hsl(0 0% 6%)' : 'hsl(0 0% 8%)', borderBottom: i < plans.length - 1 ? '1px solid hsl(0 0% 13%)' : 'none' }}>
        <div className="w-28 flex-shrink-0">
          <span className="text-sm font-semibold" style={{ color: 'hsl(0 0% 85%)' }}>{p.crop}</span>
        </div>
        <div className="flex-1">
          <span className="text-sm font-mono" style={{ color: 'hsl(45 60% 65%)' }}>{p.spacing} apart</span>
          <span className="text-xs ml-2" style={{ color: 'hsl(0 0% 50%)' }}>· {p.plants}</span>
          {p.note && <p className="text-[10px] mt-0.5 italic" style={{ color: 'hsl(130 50% 55% / 0.6)' }}>{p.note}</p>}
        </div>
      </div>
    ))}
  </div>
);

/* ─── PAGE ─── */

const TenByTen = () => {
  const navigate = useNavigate();
  const [selectedSun, setSelectedSun] = useState<'full' | 'partial' | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const totalCost = SOIL_MATERIALS.reduce((sum, m) => sum + m.price * m.qty, 0);
  const activeSun = SUN_OPTIONS.find(s => s.id === selectedSun);

  return (
    <div className="min-h-screen" style={{ background: 'hsl(140 15% 5%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full transition-colors" style={{ background: 'hsl(0 0% 10%)', color: 'hsl(0 0% 60%)' }}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5" style={{ color: 'hsl(130 50% 55%)' }} />
          <span className="font-mono text-sm tracking-wider" style={{ color: 'hsl(130 50% 55%)' }}>10 × 10</span>
        </div>
        <div className="w-9" />
      </div>

      <div className="max-w-lg mx-auto px-4 pb-24">
        {/* Hero */}
        <motion.div className="flex flex-col items-center mt-6 mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <img src={collectivelySustainable} alt="Collectively Sustainable" className="w-20 mb-5" style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 12px hsl(45 60% 50% / 0.4))' }} />
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-1" style={{ color: 'hsl(0 0% 90%)' }}>10 × 10</h1>
          <p className="text-xs text-center font-mono tracking-wide" style={{ color: 'hsl(130 50% 55% / 0.6)' }}>by Collectively Sustainable</p>
        </motion.div>

        {/* ═══ ZONE SELECTOR ═══ */}
        <ZoneSelector selectedState={selectedState} onStateChange={setSelectedState} />

        {/* ═══ SOIL MATERIALS ═══ */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'hsl(0 0% 85%)' }}>Soil Materials</h2>
          </div>
          <div className="grid gap-3">
            {SOIL_MATERIALS.map((mat, i) => <MaterialCard key={i} mat={mat} />)}
          </div>
          <div className="mt-4 rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: 'hsl(130 30% 8%)', border: '1px solid hsl(130 50% 45% / 0.2)' }}>
            <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'hsl(0 0% 50%)' }}>Estimated Total</span>
            <span className="text-lg font-bold font-mono" style={{ color: 'hsl(130 50% 60%)' }}>${totalCost.toFixed(2)}</span>
          </div>
        </motion.section>

        {/* ═══ SUN SELECTION ═══ */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4" style={{ color: 'hsl(130 50% 55%)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'hsl(0 0% 85%)' }}>Choose Your Sun Exposure</h2>
          </div>
          {selectedState && (
            <p className="text-[11px] font-mono mb-4" style={{ color: 'hsl(200 50% 55%)' }}>
              ✦ Your zone: {STATE_HARDINESS_ZONES[selectedState]?.label}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {SUN_OPTIONS.map(opt => {
              const isActive = selectedSun === opt.id;
              return (
                <button key={opt.id} onClick={() => setSelectedSun(opt.id)} className="flex flex-col items-center gap-2 p-5 rounded-xl transition-all duration-300" style={{ background: isActive ? 'hsl(130 30% 12%)' : 'hsl(0 0% 7%)', border: `2px solid ${isActive ? 'hsl(130 50% 45%)' : 'hsl(0 0% 12%)'}`, boxShadow: isActive ? '0 0 20px hsl(130 50% 45% / 0.25)' : 'none', color: isActive ? 'hsl(130 50% 55%)' : 'hsl(0 0% 45%)' }}>
                  {opt.icon}
                  <span className="text-sm font-semibold" style={{ color: isActive ? 'hsl(130 50% 70%)' : 'hsl(0 0% 65%)' }}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* ═══ PLANTING OPTIONS ═══ */}
        <AnimatePresence mode="wait">
          {activeSun && (
            <motion.section key={activeSun.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {activeSun.options.map((opt, idx) => (
                <div key={idx} className="mb-8">
                  <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'hsl(45 60% 70%)' }}>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: 'hsl(45 60% 50% / 0.15)', color: 'hsl(45 60% 65%)' }}>
                      Option {selectedSun === 'full' ? 1 : 2}-{idx === 0 ? 'a' : 'b'}
                    </span>
                    {opt.season}
                  </h3>
                  <PlantingTable plans={opt.plans} />
                </div>
              ))}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Prompt if nothing selected */}
        {!selectedSun && (
          <motion.p className="text-center text-xs font-mono tracking-wider mt-4" style={{ color: 'hsl(0 0% 35%)' }} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
            ↑ Select your sun exposure to see planting options
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default TenByTen;
