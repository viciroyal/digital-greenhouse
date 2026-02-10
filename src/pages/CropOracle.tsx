import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Leaf, Sprout, Tractor, Home as HomeIcon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import GriotOracle from '@/components/GriotOracle';
import EshuLoader from '@/components/EshuLoader';

/* ─── Zone Data ─── */
const ZONES = [
  { hz: 396, name: 'Foundation', vibe: 'Grounding', color: '#FF0000', note: 'C', description: 'Root anchoring, phosphorus, deep stability' },
  { hz: 417, name: 'Flow', vibe: 'Flow', color: '#FF7F00', note: 'D', description: 'Water, hydration, fungal transit' },
  { hz: 528, name: 'Alchemy', vibe: 'Energy', color: '#FFFF00', note: 'E', description: 'Solar power, nitrogen, growth core' },
  { hz: 639, name: 'Heart', vibe: 'Heart', color: '#00FF00', note: 'F', description: 'Connection, mycorrhizal sync, calcium' },
  { hz: 741, name: 'Signal', vibe: 'Expression', color: '#0000FF', note: 'G', description: 'Potassium, Brix validation, alchemy' },
  { hz: 852, name: 'Vision', vibe: 'Vision', color: '#4B0082', note: 'A', description: 'Medicinal density, silica, insight' },
  { hz: 963, name: 'Source', vibe: 'Protection', color: '#8B00FF', note: 'B', description: 'Garlic shield, sulfur, seed sanctuary' },
];

/* ─── Environment Options ─── */
const ENVIRONMENTS = [
  { id: 'pot', label: 'Pot', icon: <Sprout className="w-6 h-6" />, subtitle: 'Container / Small Space', description: 'Compact crops for patios, balconies, and windowsills' },
  { id: 'raised-bed', label: 'Raised Bed', icon: <Leaf className="w-6 h-6" />, subtitle: 'Backyard / Garden', description: 'Standard guild planting in raised beds' },
  { id: 'farm', label: 'Farm', icon: <Tractor className="w-6 h-6" />, subtitle: 'Acreage / Row Crops', description: 'High-volume row cropping and field production' },
  { id: 'high-tunnel', label: 'High Tunnel', icon: <HomeIcon className="w-6 h-6" />, subtitle: 'Protected Culture', description: 'Season extension with climate control' },
];

/* ─── Chord interval display order ─── */
const INTERVAL_ORDER = [
  { key: 'Root (Lead)', label: 'The Star', role: 'Root (1st)', emoji: '🌟' },
  { key: '3rd (Triad)', label: 'The Companion', role: '3rd (Triad)', emoji: '🌿' },
  { key: '5th (Stabilizer)', label: 'The Stabilizer', role: '5th', emoji: '⚓' },
  { key: '7th (Signal)', label: 'The Signal', role: '7th', emoji: '🦋' },
  { key: '9th (Sub-bass)', label: 'The Underground', role: '9th', emoji: '🥔' },
  { key: '11th (Tension)', label: 'The Sentinel', role: '11th', emoji: '🍄' },
  { key: '13th (Top Note)', label: 'The Aerial', role: '13th', emoji: '🌻' },
];

/* ─── Spacing limits for containers ─── */
const POT_MAX_SPACING = 12; // inches — exclude crops needing more

const CropOracle = () => {
  const navigate = useNavigate();
  const { data: allCrops, isLoading } = useMasterCrops();
  const [step, setStep] = useState(1);
  const [environment, setEnvironment] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<typeof ZONES[0] | null>(null);

  /* ─── Filter crops by zone + environment ─── */
  const recipeCrops = useMemo(() => {
    if (!allCrops || !selectedZone) return [];

    let filtered = allCrops.filter(c => c.frequency_hz === selectedZone.hz);

    // Apply environment filters
    if (environment === 'pot') {
      filtered = filtered.filter(c => {
        const spacing = c.spacing_inches ? parseInt(c.spacing_inches) : 6;
        return spacing <= POT_MAX_SPACING;
      });
    }

    if (environment === 'high-tunnel') {
      // Prioritize heat-lovers and greens
      const priority = filtered.filter(c =>
        c.category === 'Nightshade' || c.category === 'Pepper' ||
        c.category === 'Green' || c.category === 'Herb' ||
        c.name.toLowerCase().includes('tomato') || c.name.toLowerCase().includes('pepper')
      );
      if (priority.length > 0) filtered = priority;
    }

    return filtered;
  }, [allCrops, selectedZone, environment]);

  /* ─── Build 7-voice chord card ─── */
  const chordCard = useMemo(() => {
    if (recipeCrops.length === 0) return [];

    return INTERVAL_ORDER.map(interval => {
      const match = recipeCrops.find(c => c.chord_interval === interval.key);
      // Fallback: find any crop in the zone for this interval
      const fallback = !match ? recipeCrops.find(c =>
        c.guild_role?.toLowerCase().includes(interval.role.split(' ')[0].toLowerCase())
      ) : null;
      const crop = match || fallback;

      return {
        ...interval,
        crop: crop || null,
      };
    });
  }, [recipeCrops]);

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
      {/* Back to Stage */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: 'hsl(0 0% 10%)',
          border: '1px solid hsl(0 0% 20%)',
        }}
      >
        <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(0 0% 60%)' }} />
      </button>

      {/* Step Indicator */}
      <div className="flex justify-center pt-6 pb-4 gap-3">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className="flex items-center gap-2"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all"
              style={{
                background: step >= s
                  ? (s === 3 && selectedZone ? selectedZone.color + '30' : 'hsl(45 80% 55% / 0.2)')
                  : 'hsl(0 0% 8%)',
                border: `2px solid ${step >= s ? (s === 3 && selectedZone ? selectedZone.color : 'hsl(45 80% 55%)') : 'hsl(0 0% 15%)'}`,
                color: step >= s ? 'hsl(45 80% 55%)' : 'hsl(0 0% 30%)',
                boxShadow: step === s ? `0 0 20px ${s === 3 && selectedZone ? selectedZone.color + '40' : 'hsl(45 80% 55% / 0.2)'}` : 'none',
              }}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className="w-8 h-0.5 rounded-full"
                style={{ background: step > s ? 'hsl(45 80% 55% / 0.4)' : 'hsl(0 0% 12%)' }}
              />
            )}
          </div>
        ))}
      </div>

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
              <h2
                className="text-center text-2xl md:text-3xl font-bubble mb-2"
                style={{ color: 'hsl(45 80% 55%)' }}
              >
                Where are you growing?
              </h2>
              <p className="text-center text-sm font-mono mb-8" style={{ color: 'hsl(0 0% 45%)' }}>
                STEP 1 — THE ENVIRONMENT
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ENVIRONMENTS.map(env => (
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
              <h2
                className="text-center text-2xl md:text-3xl font-bubble mb-2"
                style={{ color: 'hsl(45 80% 55%)' }}
              >
                What energy do you need?
              </h2>
              <p className="text-center text-sm font-mono mb-8" style={{ color: 'hsl(0 0% 45%)' }}>
                STEP 2 — THE VIBE
              </p>

              <div className="grid grid-cols-1 gap-3">
                {ZONES.map(zone => (
                  <motion.button
                    key={zone.hz}
                    onClick={() => { setSelectedZone(zone); setStep(3); }}
                    className="p-4 rounded-xl text-left transition-all flex items-center gap-4"
                    style={{
                      background: `linear-gradient(90deg, ${zone.color}08, hsl(0 0% 6%))`,
                      border: `2px solid ${zone.color}30`,
                    }}
                    whileHover={{
                      scale: 1.01,
                      borderColor: zone.color + '80',
                      boxShadow: `0 0 20px ${zone.color}20`,
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {/* Frequency orb */}
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
                      </div>
                      <p className="text-xs font-body" style={{ color: 'hsl(0 0% 50%)' }}>
                        {zone.description}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 shrink-0" style={{ color: zone.color + '60' }} />
                  </motion.button>
                ))}
              </div>

              {/* Back */}
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
              <h2
                className="text-center text-2xl md:text-3xl font-bubble mb-1"
                style={{ color: selectedZone.color }}
              >
                Your {selectedZone.vibe} Recipe
              </h2>
              <p className="text-center text-sm font-mono mb-2" style={{ color: 'hsl(0 0% 45%)' }}>
                STEP 3 — THE 13TH CHORD
              </p>
              <p className="text-center text-[10px] font-mono mb-8" style={{ color: 'hsl(0 0% 30%)' }}>
                ZONE {ZONES.indexOf(selectedZone) + 1} • {selectedZone.name.toUpperCase()} • {selectedZone.hz}Hz • KEY OF {selectedZone.note}
              </p>

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
                <div
                  className="px-5 py-3 flex items-center gap-3"
                  style={{
                    background: `linear-gradient(90deg, ${selectedZone.color}15, transparent)`,
                    borderBottom: `1px solid ${selectedZone.color}20`,
                  }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: selectedZone.color }} />
                  <span className="font-mono text-xs font-bold tracking-wider" style={{ color: selectedZone.color }}>
                    7-VOICE PLANTING CHORD
                  </span>
                </div>

                {/* Interval rows */}
                <div className="divide-y" style={{ borderColor: 'hsl(0 0% 10%)' }}>
                  {chordCard.map((slot, i) => (
                    <motion.div
                      key={slot.key}
                      className="px-5 py-4 flex items-center gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      {/* Emoji + Role */}
                      <div className="w-10 text-center text-lg">{slot.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bubble text-sm" style={{ color: 'hsl(40 50% 90%)' }}>
                            {slot.label}
                          </span>
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                            background: `${selectedZone.color}15`,
                            color: selectedZone.color,
                            border: `1px solid ${selectedZone.color}30`,
                          }}>
                            {slot.role}
                          </span>
                        </div>
                        {slot.crop ? (
                          <p className="text-xs font-body mt-0.5" style={{ color: 'hsl(0 0% 65%)' }}>
                            {slot.crop.common_name || slot.crop.name}
                            {slot.crop.spacing_inches && (
                              <span style={{ color: 'hsl(0 0% 35%)' }}> • {slot.crop.spacing_inches}" spacing</span>
                            )}
                          </p>
                        ) : (
                          <p className="text-xs font-mono italic mt-0.5" style={{ color: 'hsl(0 0% 25%)' }}>
                            No match in registry
                          </p>
                        )}
                      </div>
                      {/* Frequency badge */}
                      {slot.crop && (
                        <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                          {slot.crop.frequency_hz}Hz
                        </span>
                      )}
                    </motion.div>
                  ))}
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
                    {environment === 'pot' ? '🪴 CONTAINER' : environment === 'farm' ? '🚜 FARM' : environment === 'high-tunnel' ? '🏠 HIGH TUNNEL' : '🌱 RAISED BED'} MODE
                  </span>
                  <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                    {recipeCrops.length} CROPS IN ZONE
                  </span>
                </div>
              </div>

              {/* Companion Notes */}
              {chordCard[0]?.crop?.companion_crops && chordCard[0].crop.companion_crops.length > 0 && (
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
                    ★ STAR COMPANIONS
                  </p>
                  <p className="text-xs font-body" style={{ color: 'hsl(0 0% 55%)' }}>
                    {chordCard[0].crop.companion_crops.join(' • ')}
                  </p>
                </motion.div>
              )}

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
      </div>

      {/* Griot Oracle — Floating Help */}
      <GriotOracle />
    </div>
  );
};

export default CropOracle;
