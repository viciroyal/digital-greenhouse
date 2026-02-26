import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sprout, Leaf, Sun, SunMedium, CloudSun, TreePine, Tractor, Home as HomeIcon, Salad, CookingPot, Flower2, Check, MapPin, X } from 'lucide-react';
import EshuLoader from '@/components/EshuLoader';
import { STATE_HARDINESS_ZONES, US_STATES } from '@/data/stateHardinessZones';

/* ─── Types ─── */
type GoalOption = 'roots' | 'vines' | 'summer' | 'salads' | 'spice' | 'medicine' | 'shield';

/* ─── Environment mapping from space choice ─── */
const SPACE_OPTIONS = [
  { id: 'pot', label: 'Pots / Containers', desc: 'Patios, balconies, windowsills', icon: <Sprout className="w-6 h-6" /> },
  { id: 'raised-bed', label: 'Raised Bed', desc: 'A 4×4 or 4×8 raised bed', icon: <Leaf className="w-6 h-6" /> },
  { id: 'farm', label: 'Farm / Acreage', desc: 'Row crops and field production', icon: <Tractor className="w-6 h-6" />, pro: true },
  { id: 'high-tunnel', label: 'High Tunnel', desc: 'Protected season extension', icon: <HomeIcon className="w-6 h-6" />, pro: true },
  { id: 'food-forest', label: 'Food Forest', desc: 'Multi-layer perennial ecosystem', icon: <TreePine className="w-6 h-6" />, pro: true },
];

const SUN_OPTIONS = [
  { id: 'full', label: 'Full Sun', desc: '6+ hours direct sunlight', icon: <Sun className="w-6 h-6" /> },
  { id: 'partial', label: 'Partial Sun', desc: '3–6 hours direct sunlight', icon: <SunMedium className="w-6 h-6" /> },
  { id: 'shade', label: 'Mostly Shade', desc: 'Less than 3 hours direct', icon: <CloudSun className="w-6 h-6" /> },
];

/* ─── Goal options mapped to frequency zones ─── */
const GOAL_OPTIONS: { id: GoalOption; label: string; desc: string; icon: React.ReactNode; hz: number }[] = [
  { id: 'roots', label: 'Root Crops', desc: 'Potatoes, beets, carrots', icon: <Sprout className="w-5 h-5" />, hz: 396 },
  { id: 'vines', label: 'Vine Crops', desc: 'Squash, melons, cucumbers', icon: <Leaf className="w-5 h-5" />, hz: 417 },
  { id: 'summer', label: 'Summer Crops', desc: 'Tomatoes, corn, beans', icon: <Sun className="w-5 h-5" />, hz: 528 },
  { id: 'salads', label: 'Salad Crops', desc: 'Lettuce, greens, herbs', icon: <Salad className="w-5 h-5" />, hz: 639 },
  { id: 'spice', label: 'Spice & Flavor', desc: 'Peppers, herbs, aromatics', icon: <CookingPot className="w-5 h-5" />, hz: 741 },
  { id: 'medicine', label: 'Medicine Crops', desc: 'Medicinal herbs, teas', icon: <Flower2 className="w-5 h-5" />, hz: 852 },
  { id: 'shield', label: 'Shield Crops', desc: 'Garlic, onions, pest barriers', icon: <TreePine className="w-5 h-5" />, hz: 963 },
];

const StudioIntake = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0=space, 1=sun, 2=goals, 3=zone
  const [space, setSpace] = useState<string | null>(null);
  const [sun, setSun] = useState<string | null>(null);
  const [goals, setGoals] = useState<GoalOption[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hardinessZone, setHardinessZone] = useState<number | null>(null);
  const [hardinessSubZone, setHardinessSubZone] = useState<string | null>(null);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearch, setStateSearch] = useState('');

  const canAdvance = (step === 0 && space) || (step === 1 && sun) || (step === 2 && goals.length > 0) || step === 3;

  const stepTitles = [
    'Where are you growing?',
    'How much sun does your spot get?',
    'What do you want to grow?',
    'Where are you located?',
  ];

  const handleFinish = () => {
    // Map goals to zone hz values
    const selectedZoneHz = goals.map(g => GOAL_OPTIONS.find(opt => opt.id === g)!.hz);

    navigate('/crop-oracle', {
      state: {
        fromIntake: true,
        environment: space,
        zoneHz: selectedZoneHz,
        hardinessZone,
        hardinessSubZone,
        sun,
      },
    });
  };

  const handleNext = () => {
    if (step === 3) {
      handleFinish();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
    else navigate(-1);
  };

  const filteredStates = useMemo(() => {
    if (!stateSearch) return US_STATES;
    return US_STATES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));
  }, [stateSearch]);

  return (
    <div className="min-h-screen" style={{ background: 'hsl(260 20% 5%)' }}>
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
          <Sprout className="w-5 h-5" style={{ color: 'hsl(45 80% 55%)' }} />
          <span className="font-mono text-sm tracking-wider" style={{ color: 'hsl(45 80% 55%)' }}>
            ADVANCED STUDIO
          </span>
        </div>
        <div className="w-9" />
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              background: i <= step ? 'hsl(45 80% 55%)' : 'hsl(0 0% 15%)',
              boxShadow: i === step ? '0 0 8px hsl(45 80% 55% / 0.5)' : 'none',
            }}
          />
        ))}
      </div>

      <div className="max-w-lg mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {/* ─── STEP 0: Space / Environment ─── */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-center mb-2" style={{ color: 'hsl(0 0% 85%)' }}>
                {stepTitles[0]}
              </h2>
              <motion.p
                className="text-center text-xs mb-6 font-mono tracking-wide"
                style={{ color: 'hsl(45 80% 55% / 0.6)' }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                ↓ Tap your growing space
              </motion.p>

              <div className="grid gap-3">
                {SPACE_OPTIONS.map(opt => {
                  const isSelected = space === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSpace(opt.id)}
                      className="flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300"
                      style={{
                        background: isSelected ? 'hsl(45 30% 12%)' : 'hsl(0 0% 7%)',
                        border: `2px solid ${isSelected ? 'hsl(45 80% 45%)' : 'hsl(0 0% 12%)'}`,
                        boxShadow: isSelected ? '0 0 20px hsl(45 80% 45% / 0.25)' : 'none',
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                          background: isSelected ? 'hsl(45 80% 45% / 0.15)' : 'hsl(0 0% 10%)',
                          color: isSelected ? 'hsl(45 80% 55%)' : 'hsl(0 0% 40%)',
                        }}
                      >
                        {opt.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm" style={{ color: isSelected ? 'hsl(45 80% 70%)' : 'hsl(0 0% 70%)' }}>
                            {opt.label}
                          </span>
                          {opt.pro && (
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'hsl(280 60% 40% / 0.2)', color: 'hsl(280 60% 65%)' }}>
                              PRO
                            </span>
                          )}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: 'hsl(0 0% 40%)' }}>{opt.desc}</div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(45 80% 55%)' }} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 1: Sun ─── */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-center mb-2" style={{ color: 'hsl(0 0% 85%)' }}>
                {stepTitles[1]}
              </h2>
              <motion.p
                className="text-center text-xs mb-6 font-mono tracking-wide"
                style={{ color: 'hsl(45 80% 55% / 0.6)' }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                ☀ Select your sunlight level
              </motion.p>

              <div className="grid gap-3">
                {SUN_OPTIONS.map(opt => {
                  const isSelected = sun === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSun(opt.id)}
                      className="flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300"
                      style={{
                        background: isSelected ? 'hsl(45 30% 12%)' : 'hsl(0 0% 7%)',
                        border: `2px solid ${isSelected ? 'hsl(45 80% 45%)' : 'hsl(0 0% 12%)'}`,
                        boxShadow: isSelected ? '0 0 20px hsl(45 80% 45% / 0.25)' : 'none',
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                          background: isSelected ? 'hsl(45 80% 45% / 0.15)' : 'hsl(0 0% 10%)',
                          color: isSelected ? 'hsl(45 80% 55%)' : 'hsl(0 0% 40%)',
                        }}
                      >
                        {opt.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-sm" style={{ color: isSelected ? 'hsl(45 80% 70%)' : 'hsl(0 0% 70%)' }}>
                          {opt.label}
                        </span>
                        <div className="text-xs mt-0.5" style={{ color: 'hsl(0 0% 40%)' }}>{opt.desc}</div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(45 80% 55%)' }} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2: Goals (multi-select) ─── */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-center mb-2" style={{ color: 'hsl(0 0% 85%)' }}>
                {stepTitles[2]}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <motion.p
                  className="text-xs font-mono tracking-wide"
                  style={{ color: 'hsl(45 80% 55% / 0.6)' }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  🌱 Select all that apply
                </motion.p>
                {goals.length > 0 && (
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                    style={{ background: 'hsl(45 80% 55% / 0.15)', color: 'hsl(45 80% 55%)' }}
                  >
                    {goals.length} selected
                  </span>
                )}
              </div>

              <div className="grid gap-2.5">
                {GOAL_OPTIONS.map(opt => {
                  const isSelected = goals.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setGoals(prev =>
                          prev.includes(opt.id)
                            ? prev.filter(g => g !== opt.id)
                            : [...prev, opt.id]
                        );
                      }}
                      className="flex items-center gap-4 p-3.5 rounded-xl text-left transition-all duration-300"
                      style={{
                        background: isSelected ? 'hsl(45 30% 12%)' : 'hsl(0 0% 7%)',
                        border: `2px solid ${isSelected ? 'hsl(45 80% 45%)' : 'hsl(0 0% 12%)'}`,
                        boxShadow: isSelected ? '0 0 15px hsl(45 80% 45% / 0.2)' : 'none',
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: isSelected ? 'hsl(45 80% 45% / 0.15)' : 'hsl(0 0% 10%)',
                          color: isSelected ? 'hsl(45 80% 55%)' : 'hsl(0 0% 40%)',
                        }}
                      >
                        {opt.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-sm" style={{ color: isSelected ? 'hsl(45 80% 70%)' : 'hsl(0 0% 70%)' }}>
                          {opt.label}
                        </span>
                        <div className="text-xs mt-0.5" style={{ color: 'hsl(0 0% 40%)' }}>{opt.desc}</div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(45 80% 55%)' }} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: Zone / Location ─── */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-center mb-2" style={{ color: 'hsl(0 0% 85%)' }}>
                {stepTitles[3]}
              </h2>
              <motion.p
                className="text-center text-xs mb-6 font-mono tracking-wide"
                style={{ color: 'hsl(45 80% 55% / 0.6)' }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                📍 Optional — helps filter crops to your climate
              </motion.p>

              {/* State selector */}
              <div className="relative mb-4">
                <button
                  onClick={() => setShowStateDropdown(!showStateDropdown)}
                  className="w-full flex items-center justify-between p-4 rounded-xl transition-all"
                  style={{
                    background: selectedState ? 'hsl(45 30% 12%)' : 'hsl(0 0% 7%)',
                    border: `2px solid ${selectedState ? 'hsl(45 80% 45%)' : 'hsl(0 0% 12%)'}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" style={{ color: selectedState ? 'hsl(45 80% 55%)' : 'hsl(0 0% 40%)' }} />
                    <span className="text-sm" style={{ color: selectedState ? 'hsl(45 80% 70%)' : 'hsl(0 0% 50%)' }}>
                      {selectedState || 'Select your state'}
                    </span>
                  </div>
                  {selectedState && hardinessZone && (
                    <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'hsl(45 80% 55% / 0.15)', color: 'hsl(45 80% 55%)' }}>
                      Zone {hardinessZone}{hardinessSubZone || ''}
                    </span>
                  )}
                </button>

                {showStateDropdown && (
                  <div
                    className="absolute z-20 w-full mt-2 rounded-xl overflow-hidden"
                    style={{
                      background: 'hsl(0 0% 8%)',
                      border: '1px solid hsl(0 0% 15%)',
                      maxHeight: '240px',
                    }}
                  >
                    <div className="sticky top-0 p-2" style={{ background: 'hsl(0 0% 8%)' }}>
                      <div className="flex items-center gap-2">
                        <input
                          value={stateSearch}
                          onChange={e => setStateSearch(e.target.value)}
                          placeholder="Search state..."
                          autoFocus
                          className="flex-1 px-3 py-2 rounded-lg text-sm font-mono"
                          style={{
                            background: 'hsl(0 0% 5%)',
                            border: '1px solid hsl(0 0% 15%)',
                            color: 'hsl(0 0% 80%)',
                            outline: 'none',
                          }}
                        />
                        <button
                          onClick={() => { setShowStateDropdown(false); setStateSearch(''); }}
                          className="p-1.5 rounded"
                          style={{ color: 'hsl(0 0% 40%)' }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="overflow-y-auto" style={{ maxHeight: '180px' }}>
                      {filteredStates.map(state => {
                        const zoneData = STATE_HARDINESS_ZONES[state];
                        return (
                          <button
                            key={state}
                            onClick={() => {
                              setSelectedState(state);
                              if (zoneData) {
                                setHardinessZone(zoneData.zone);
                                setHardinessSubZone(zoneData.subZone || null);
                              }
                              setShowStateDropdown(false);
                              setStateSearch('');
                            }}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors"
                            style={{
                              color: 'hsl(0 0% 70%)',
                              borderBottom: '1px solid hsl(0 0% 10%)',
                            }}
                          >
                            <span>{state}</span>
                            {zoneData && (
                              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                                Zone {zoneData.zone}{zoneData.subZone || ''}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Skip note */}
              <p className="text-center text-[10px] font-mono mt-4" style={{ color: 'hsl(0 0% 35%)' }}>
                You can skip this step — tap "Launch Studio" below
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <motion.button
            onClick={handleNext}
            disabled={!canAdvance}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300"
            style={{
              background: canAdvance
                ? 'linear-gradient(135deg, hsl(45 80% 50%) 0%, hsl(35 80% 40%) 100%)'
                : 'hsl(0 0% 12%)',
              color: canAdvance ? 'hsl(0 0% 5%)' : 'hsl(0 0% 30%)',
              boxShadow: canAdvance ? '0 4px 25px hsl(45 80% 50% / 0.4)' : 'none',
              cursor: canAdvance ? 'pointer' : 'not-allowed',
            }}
            animate={canAdvance ? {
              boxShadow: [
                '0 4px 20px hsl(45 80% 50% / 0.3)',
                '0 4px 35px hsl(45 80% 50% / 0.55)',
                '0 4px 20px hsl(45 80% 50% / 0.3)',
              ],
            } : {}}
            transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
          >
            {step === 3 ? 'Launch Studio' : 'Next'}
            <motion.span
              animate={canAdvance ? { x: [0, 4, 0] } : {}}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.button>

          {!canAdvance && (
            <motion.p
              className="text-[10px] font-mono tracking-wider"
              style={{ color: 'hsl(0 0% 35%)' }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ↑ Select an option above to continue
            </motion.p>
          )}

          {/* Skip straight to studio */}
          <button
            onClick={() => navigate('/crop-oracle')}
            className="text-[11px] font-mono tracking-wider transition-colors hover:underline mt-2"
            style={{ color: 'hsl(0 0% 35%)' }}
          >
            Skip straight to Studio →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudioIntake;
