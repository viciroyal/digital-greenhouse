import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowLeft, Music, Leaf, Shield, Pickaxe, Sparkles, Zap,
  AlertTriangle, Clock, Users, Layers, Disc, ToggleLeft, ToggleRight, X, Info, Plus,
  Moon, Sprout, Ruler, Grid3X3, AudioWaveform,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { INSTRUMENT_ICONS, InstrumentType, checkDissonance, getMasterMixSetting } from '@/hooks/useAutoGeneration';
import { CHORD_RECIPES } from '@/data/chordRecipes';
import LunarGateCard, { getCurrentMoonPhase, getLunarPhase } from '@/components/crop-oracle/LunarGateCard';
import SeasonalMovementCard from '@/components/crop-oracle/SeasonalMovementCard';
import HarmonicWarningsCard from '@/components/crop-oracle/HarmonicWarningsCard';
import BedOrganizationCard from '@/components/crop-oracle/BedOrganizationCard';
import BedStrumEmbed from '@/components/crop-oracle/BedStrumEmbed';
// HarmonicCarousel removed — merged into Guild tab
import ChordComposer from '@/components/crop-oracle/ChordComposer';
import { useAdminRole } from '@/hooks/useAdminRole';

/* ─── Zone color helper ─── */
const ZONE_COLORS: Record<number, string> = {
  396: '#FF0000', 417: '#FF7F00', 528: '#FFFF00',
  639: '#00FF00', 741: '#0000FF', 852: '#4B0082', 963: '#8B00FF',
};

const NOTE_MAP: Record<number, string> = {
  396: 'C', 417: 'D', 528: 'E', 639: 'F', 741: 'G', 852: 'A', 963: 'B',
};

const INTERVAL_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  'Root (Lead)':       { label: 'ROOT (1st)', color: 'hsl(120 50% 50%)', icon: <Leaf className="w-3.5 h-3.5" /> },
  '3rd (Triad)':       { label: '3RD (Triad)', color: 'hsl(45 80% 55%)',  icon: <Sparkles className="w-3.5 h-3.5" /> },
  '5th (Stabilizer)':  { label: '5TH (Stab.)',  color: 'hsl(35 70% 55%)',  icon: <Pickaxe className="w-3.5 h-3.5" /> },
  '7th (Signal)':      { label: '7TH (Signal)', color: 'hsl(270 50% 60%)', icon: <Zap className="w-3.5 h-3.5" /> },
};

/* ─── Retro Synth Knob Component ─── */
const SynthKnob = ({ label, value, color, size = 48 }: { label: string; value: string; color: string; size?: number }) => {
  // Convert value to a rotation angle (aesthetic only)
  const numVal = parseFloat(value) || 0;
  const rotation = Math.min(numVal * 2.5, 270) - 135;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 35%, hsl(0 0% 22%), hsl(0 0% 8%))`,
          boxShadow: `inset 0 2px 4px rgba(255,255,255,0.08), inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4), 0 0 12px ${color}15`,
          border: '2px solid hsl(0 0% 15%)',
        }}
      >
        {/* Knob indicator line */}
        <div
          className="absolute w-0.5 rounded-full"
          style={{
            height: size * 0.3,
            top: '15%',
            background: color,
            boxShadow: `0 0 6px ${color}80`,
            transform: `rotate(${rotation}deg)`,
            transformOrigin: `50% ${size * 0.35}px`,
          }}
        />
        {/* Center cap */}
        <div
          className="rounded-full"
          style={{
            width: size * 0.35,
            height: size * 0.35,
            background: `radial-gradient(circle at 40% 40%, hsl(0 0% 18%), hsl(0 0% 6%))`,
            border: '1px solid hsl(0 0% 20%)',
          }}
        />
      </div>
      {/* Value readout */}
      <span
        className="text-[9px] font-mono font-bold tabular-nums"
        style={{ color }}
      >
        {value}
      </span>
      {/* Label */}
      <span
        className="text-[7px] font-mono tracking-[0.15em] uppercase"
        style={{ color: 'hsl(0 0% 45%)' }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Synth Panel Container ─── */
const SynthPanel = ({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div
    className={`rounded-xl ${className}`}
    style={{
      background: 'linear-gradient(180deg, hsl(0 0% 10%) 0%, hsl(0 0% 6%) 100%)',
      border: '2px solid hsl(0 0% 16%)',
      boxShadow: 'inset 0 1px 0 hsl(0 0% 18%), inset 0 -1px 0 hsl(0 0% 4%), 0 4px 16px rgba(0,0,0,0.5)',
      ...style,
    }}
  >
    {children}
  </div>
);

/* ─── Synth Display (LCD-style) ─── */
const SynthDisplay = ({ children, color = 'hsl(45 80% 55%)' }: { children: React.ReactNode; color?: string }) => (
  <div
    className="rounded-lg p-3"
    style={{
      background: 'linear-gradient(180deg, hsl(0 0% 3%) 0%, hsl(0 0% 5%) 100%)',
      border: '1px solid hsl(0 0% 12%)',
      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), 0 1px 0 hsl(0 0% 14%)',
    }}
  >
    {children}
  </div>
);

const CropOracle = () => {
  const navigate = useNavigate();
  const { data: allCrops, isLoading } = useMasterCrops();
  const { isAdmin } = useAdminRole();
  const [query, setQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<MasterCrop | null>(null);
  const [hoveredCrop, setHoveredCrop] = useState<MasterCrop | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'guild' | 'timing' | 'beds' | 'strum' | 'planting'>('profile');
  const [composerOpen, setComposerOpen] = useState(false);
  const [pendingCrop, setPendingCrop] = useState<MasterCrop | null>(null);
  const [proMode, setProMode] = useState(() => {
    try { return localStorage.getItem('oracle-pro-mode') === 'true'; } catch { return false; }
  });
  const hoverTimeout = useRef<ReturnType<typeof setTimeout>>();

  const toggleProMode = () => {
    setProMode(prev => {
      const next = !prev;
      localStorage.setItem('oracle-pro-mode', String(next));
      return next;
    });
  };

  const [showHint, setShowHint] = useState(() => {
    try { return !localStorage.getItem('oracle-hint-dismissed'); } catch { return true; }
  });
  const dismissHint = () => {
    setShowHint(false);
    localStorage.setItem('oracle-hint-dismissed', 'true');
  };

  /* ─── Search results (auto-populate when empty) ─── */
  const results = useMemo(() => {
    if (!allCrops) return [];
    if (query.length < 1) {
      const seen = new Set<number>();
      const sample: MasterCrop[] = [];
      for (const crop of allCrops) {
        if (!seen.has(crop.frequency_hz)) {
          seen.add(crop.frequency_hz);
          sample.push(crop);
        }
      }
      const popular = allCrops
        .filter(c => c.common_name && c.chord_interval === 'Root (Lead)')
        .slice(0, 14);
      const ids = new Set(sample.map(s => s.id));
      for (const p of popular) {
        if (!ids.has(p.id)) { sample.push(p); ids.add(p.id); }
      }
      return sample.slice(0, 21);
    }
    const q = query.toLowerCase();
    return allCrops
      .filter(c =>
        c.common_name?.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.zone_name.toLowerCase().includes(q)
      )
      .slice(0, 21);
  }, [allCrops, query]);

  /* ─── Companion lookup ─── */
  const companionCrops = useMemo(() => {
    if (!selectedCrop?.companion_crops || !allCrops) return [];
    return selectedCrop.companion_crops.map(name => {
      const lowerName = name.toLowerCase();
      const match = allCrops.find(c =>
        c.common_name?.toLowerCase() === lowerName ||
        c.name.toLowerCase() === lowerName
      ) || allCrops.find(c =>
        c.common_name?.toLowerCase().includes(lowerName) ||
        lowerName.includes(c.common_name?.toLowerCase() ?? '')
      );
      return { name, crop: match || null };
    });
  }, [selectedCrop, allCrops]);

  /* ─── Conflict detection ─── */
  const conflicts = useMemo(() => {
    if (!selectedCrop || !allCrops) return [];
    return allCrops
      .filter(c =>
        c.id !== selectedCrop.id &&
        c.frequency_hz === selectedCrop.frequency_hz &&
        c.chord_interval === selectedCrop.chord_interval &&
        c.instrument_type === selectedCrop.instrument_type
      )
      .slice(0, 5);
  }, [selectedCrop, allCrops]);

  /* ─── Chord recipe match ─── */
  const chordRecipe = useMemo(() => {
    if (!selectedCrop) return null;
    return CHORD_RECIPES.find(r =>
      r.frequencyHz === selectedCrop.frequency_hz &&
      r.intervals.some(iv => iv.cropName === selectedCrop.common_name)
    ) || null;
  }, [selectedCrop]);

  const zoneColor = selectedCrop ? (ZONE_COLORS[selectedCrop.frequency_hz] || '#888') : '#888';
  const note = selectedCrop ? (NOTE_MAP[selectedCrop.frequency_hz] || '?') : '?';
  const mixSetting = selectedCrop ? getMasterMixSetting(selectedCrop.frequency_hz) : null;

  const activeFrequency = selectedCrop?.frequency_hz || (results.length > 0 ? results[0].frequency_hz : null);

  const handleAddToChord = (crop: MasterCrop) => {
    setPendingCrop(crop);
    if (!composerOpen) setComposerOpen(true);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, hsl(30 15% 6%) 0%, hsl(0 0% 3%) 30%, hsl(0 0% 2%) 100%)',
      }}
    >
      {/* ═══ HEADER — Retro Synth Top Bar ═══ */}
      <div
        className="sticky top-0 z-20"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 12%) 0%, hsl(0 0% 7%) 100%)',
          borderBottom: '2px solid hsl(0 0% 16%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 hsl(0 0% 18%)',
        }}
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: 'radial-gradient(circle at 35% 35%, hsl(0 0% 20%), hsl(0 0% 8%))',
              border: '2px solid hsl(0 0% 18%)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.4)',
            }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: 'hsl(0 0% 55%)' }} />
          </button>

          {/* Title — retro stencil style */}
          <div className="flex-1">
            <h1
              className="text-base tracking-[0.3em] font-bold"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: 'hsl(45 80% 55%)',
                textShadow: '0 0 20px hsl(45 80% 55% / 0.3), 0 1px 0 hsl(0 0% 0%)',
              }}
            >
              CROP ORACLE
            </h1>
            <p className="text-[7px] font-mono tracking-[0.2em]" style={{ color: 'hsl(0 0% 35%)' }}>
              SAMPLE SCIENCE • 7-ZONE OCTAVE INTELLIGENCE
            </p>
          </div>

          {/* Easy / Pro Toggle — styled as hardware switch */}
          <button
            onClick={() => { toggleProMode(); setShowHint(false); localStorage.setItem('oracle-hint-dismissed', 'true'); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${showHint ? 'animate-[oracle-pulse_2s_ease-in-out_infinite]' : ''}`}
            style={{
              background: 'linear-gradient(180deg, hsl(0 0% 14%) 0%, hsl(0 0% 8%) 100%)',
              border: `2px solid ${proMode ? 'hsl(45 80% 55% / 0.5)' : 'hsl(120 50% 50% / 0.3)'}`,
              boxShadow: proMode
                ? '0 0 12px hsl(45 80% 55% / 0.15), inset 0 1px 0 hsl(0 0% 18%)'
                : 'inset 0 1px 0 hsl(0 0% 18%)',
            }}
          >
            {proMode
              ? <ToggleRight className="w-4 h-4" style={{ color: 'hsl(45 80% 55%)' }} />
              : <ToggleLeft className="w-4 h-4" style={{ color: 'hsl(120 50% 50%)' }} />
            }
            <span className="text-[9px] font-mono font-bold" style={{ color: proMode ? 'hsl(45 80% 55%)' : 'hsl(120 50% 50%)' }}>
              {proMode ? 'PRO' : 'EASY'}
            </span>
          </button>

          {/* Compose Chord — hardware button */}
          <button
            onClick={() => setComposerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all"
            style={{
              background: 'linear-gradient(180deg, hsl(0 0% 14%) 0%, hsl(0 0% 8%) 100%)',
              border: `2px solid ${composerOpen ? 'hsl(270 50% 50% / 0.5)' : 'hsl(0 0% 18%)'}`,
              boxShadow: composerOpen
                ? '0 0 12px hsl(270 50% 50% / 0.15), inset 0 1px 0 hsl(0 0% 18%)'
                : 'inset 0 1px 0 hsl(0 0% 18%)',
            }}
          >
            <Music className="w-4 h-4" style={{ color: 'hsl(270 50% 60%)' }} />
            <span className="text-[9px] font-mono font-bold" style={{ color: 'hsl(270 50% 60%)' }}>
              🎹
            </span>
          </button>
        </div>

        {/* Decorative screw dots */}
        <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(0 0% 20%)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }} />
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(0 0% 20%)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }} />
      </div>

      {/* Onboarding hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            className="mx-4 mt-3 mb-1"
          >
            <SynthDisplay>
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'hsl(45 80% 55%)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 65%)' }}>
                    <span className="font-bold" style={{ color: 'hsl(120 50% 50%)' }}>EASY</span> shows crop basics, companions & spacing.
                    Switch to <span className="font-bold" style={{ color: 'hsl(45 80% 55%)' }}>PRO</span> to unlock frequencies, Brix targets, lunar timing, chord recipes, harmonic warnings & full placement guides.
                  </p>
                </div>
                <button
                  onClick={dismissHint}
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, hsl(0 0% 20%), hsl(0 0% 8%))',
                    border: '1px solid hsl(0 0% 18%)',
                  }}
                >
                  <X className="w-3 h-3" style={{ color: 'hsl(0 0% 50%)' }} />
                </button>
              </div>
            </SynthDisplay>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SEARCH — Styled as preset selector ═══ */}
      <div className="px-4 pt-4 pb-2">
        <SynthPanel className="p-0.5">
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
            style={{
              background: 'linear-gradient(180deg, hsl(0 0% 3%) 0%, hsl(0 0% 5%) 100%)',
              border: `1px solid ${selectedCrop ? zoneColor + '30' : 'hsl(0 0% 10%)'}`,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
            }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: 'hsl(0 0% 40%)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (selectedCrop) setSelectedCrop(null);
              }}
              placeholder="Search by crop name, zone, or category..."
              className="flex-1 bg-transparent text-sm font-mono outline-none"
              style={{ color: 'hsl(45 80% 55%)' }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setSelectedCrop(null); }}
                className="text-[8px] font-mono font-bold px-2 py-1 rounded"
                style={{
                  background: 'hsl(0 0% 12%)',
                  color: 'hsl(0 0% 50%)',
                  border: '1px solid hsl(0 0% 18%)',
                }}
              >
                CLEAR
              </button>
            )}
          </div>
        </SynthPanel>
      </div>

      {/* ═══ SEARCH RESULTS — Preset list style ═══ */}
      <AnimatePresence>
        {!selectedCrop && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mx-4 mb-4"
          >
            <SynthPanel className="overflow-hidden" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {!query && (
                <div className="px-3 py-2" style={{ borderBottom: '1px solid hsl(0 0% 12%)', background: 'hsl(0 0% 5%)' }}>
                  <span className="text-[8px] font-mono tracking-[0.15em]" style={{ color: 'hsl(45 80% 55% / 0.6)' }}>
                    ◄ PRESET BANK — TAP TO LOAD ►
                  </span>
                </div>
              )}
              {results.map((crop) => {
                const c = ZONE_COLORS[crop.frequency_hz] || '#888';
                const inst = crop.instrument_type ? INSTRUMENT_ICONS[crop.instrument_type as InstrumentType] : null;
                const isHovered = hoveredCrop?.id === crop.id;
                return (
                  <div key={crop.id} className="relative">
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                      style={{
                        borderBottom: '1px solid hsl(0 0% 8%)',
                        background: isHovered ? `${c}12` : 'transparent',
                      }}
                      onClick={() => {
                        setSelectedCrop(crop);
                        setQuery(crop.common_name || crop.name);
                        setHoveredCrop(null);
                      }}
                      onMouseEnter={() => {
                        clearTimeout(hoverTimeout.current);
                        hoverTimeout.current = setTimeout(() => setHoveredCrop(crop), 200);
                      }}
                      onMouseLeave={() => {
                        clearTimeout(hoverTimeout.current);
                        hoverTimeout.current = setTimeout(() => setHoveredCrop(null), 150);
                      }}
                    >
                      {/* Zone LED */}
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          background: c,
                          boxShadow: `0 0 6px ${c}80, 0 0 12px ${c}30`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold block truncate" style={{ color: 'hsl(0 0% 80%)' }}>
                          {crop.common_name || crop.name}
                        </span>
                        <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                          {proMode
                            ? `${crop.zone_name} • ${crop.frequency_hz}Hz • ${crop.chord_interval || '—'}`
                            : `${crop.zone_name} • ${crop.category}`
                          }
                        </span>
                      </div>
                      <span className="text-sm shrink-0">{inst?.icon || '🌱'}</span>
                      {composerOpen && isAdmin && crop.chord_interval && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddToChord(crop); }}
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, hsl(0 0% 20%), hsl(0 0% 8%))`,
                            border: `2px solid ${c}50`,
                          }}
                          title={`Add to chord (${crop.chord_interval})`}
                        >
                          <Plus className="w-3 h-3" style={{ color: c }} />
                        </button>
                      )}
                    </button>

                    {/* Hover tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: 4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 4 }}
                          className="absolute right-0 top-0 z-30 w-56 p-2.5 rounded-lg pointer-events-none"
                          style={{
                            background: 'linear-gradient(180deg, hsl(0 0% 10%) 0%, hsl(0 0% 6%) 100%)',
                            border: `2px solid ${c}40`,
                            boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 15px ${c}15`,
                            transform: 'translateX(100%) translateX(8px)',
                          }}
                        >
                          <span className="text-[10px] font-mono font-bold block mb-1" style={{ color: c }}>
                            {crop.common_name || crop.name}
                          </span>
                          {crop.description ? (
                            <p className="text-[9px] font-mono leading-relaxed mb-1.5" style={{ color: 'hsl(0 0% 65%)' }}>
                              {crop.description.slice(0, 120)}{crop.description.length > 120 ? '…' : ''}
                            </p>
                          ) : (
                            <p className="text-[9px] font-mono mb-1.5" style={{ color: 'hsl(0 0% 45%)' }}>
                              <em>{crop.name}</em> — {crop.category}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {crop.dominant_mineral && (
                              <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{ background: 'hsl(0 0% 12%)', color: 'hsl(45 70% 55%)' }}>
                                {crop.dominant_mineral}
                              </span>
                            )}
                            {crop.spacing_inches && (
                              <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{ background: 'hsl(0 0% 12%)', color: 'hsl(0 0% 50%)' }}>
                                {crop.spacing_inches}" spacing
                              </span>
                            )}
                            {crop.harvest_days && (
                              <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{ background: 'hsl(0 0% 12%)', color: 'hsl(0 0% 50%)' }}>
                                {crop.harvest_days}d harvest
                              </span>
                            )}
                            {crop.guild_role && (
                              <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{ background: 'hsl(0 0% 12%)', color: 'hsl(120 40% 50%)' }}>
                                {crop.guild_role}
                              </span>
                            )}
                          </div>
                          {crop.library_note && (
                            <p className="text-[8px] font-mono mt-1.5 italic leading-relaxed" style={{ color: 'hsl(45 50% 50%)' }}>
                              💡 {crop.library_note.slice(0, 100)}{crop.library_note.length > 100 ? '…' : ''}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </SynthPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ CROP PROFILE — Synth Panel Layout ═══ */}
      <AnimatePresence>
        {selectedCrop && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="px-4 pb-8 space-y-3"
          >
            {/* ═══ MAIN SYNTH PANEL ═══ */}
            <SynthPanel className="overflow-hidden">
              {/* Top section: Knobs + Central Display */}
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Left knobs */}
                  <div className="flex flex-col items-center gap-3">
                    <SynthKnob
                      label="FREQ"
                      value={`${selectedCrop.frequency_hz}`}
                      color={zoneColor}
                    />
                    <SynthKnob
                      label="ZONE"
                      value={note}
                      color={zoneColor}
                      size={40}
                    />
                  </div>

                  {/* Central LCD Display */}
                  <div className="flex-1 min-w-0">
                    <SynthDisplay color={zoneColor}>
                      {/* Crop name — main readout */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0">
                          <h2
                            className="text-base font-bold tracking-wide truncate"
                            style={{
                              fontFamily: "'Staatliches', sans-serif",
                              color: zoneColor,
                              textShadow: `0 0 15px ${zoneColor}40`,
                            }}
                          >
                            {selectedCrop.common_name || selectedCrop.name}
                          </h2>
                          {proMode && (
                            <p className="text-[9px] font-mono italic truncate" style={{ color: 'hsl(0 0% 35%)' }}>
                              {selectedCrop.name}
                            </p>
                          )}
                        </div>
                        <span className="text-xl shrink-0 ml-2">
                          {selectedCrop.instrument_type
                            ? INSTRUMENT_ICONS[selectedCrop.instrument_type as InstrumentType]?.icon || '🌱'
                            : '🌱'}
                        </span>
                      </div>

                      {/* Metadata rows — key-value pairs like synth parameters */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <MetaRow label="Zone" value={selectedCrop.zone_name} color={zoneColor} />
                        <MetaRow label="Category" value={selectedCrop.category} color='hsl(0 0% 55%)' />
                        {proMode && (
                          <>
                            <MetaRow label="Interval" value={selectedCrop.chord_interval ? INTERVAL_LABELS[selectedCrop.chord_interval]?.label || selectedCrop.chord_interval : '—'} color={selectedCrop.chord_interval ? INTERVAL_LABELS[selectedCrop.chord_interval]?.color || 'hsl(0 0% 50%)' : 'hsl(0 0% 40%)'} />
                            <MetaRow label="Mineral" value={selectedCrop.dominant_mineral || '—'} color='hsl(45 70% 55%)' />
                            <MetaRow label="Guild" value={selectedCrop.guild_role || '—'} color='hsl(120 40% 50%)' />
                            <MetaRow label="Element" value={selectedCrop.element || '—'} color='hsl(0 0% 55%)' />
                          </>
                        )}
                        {selectedCrop.harvest_days && (
                          <MetaRow label="Harvest" value={`${selectedCrop.harvest_days} days`} color='hsl(35 70% 55%)' />
                        )}
                        {selectedCrop.spacing_inches && (
                          <MetaRow label="Spacing" value={`${selectedCrop.spacing_inches}"`} color='hsl(0 0% 55%)' />
                        )}
                      </div>

                      {selectedCrop.description && (
                        <p className="text-[9px] font-mono mt-2 leading-relaxed" style={{ color: 'hsl(0 0% 45%)' }}>
                          {selectedCrop.description.slice(0, 150)}{selectedCrop.description.length > 150 ? '…' : ''}
                        </p>
                      )}
                    </SynthDisplay>
                  </div>

                  {/* Right knobs */}
                  <div className="flex flex-col items-center gap-3">
                    {proMode && (
                      <SynthKnob
                        label="BRIX"
                        value={selectedCrop.brix_target_max ? `${selectedCrop.brix_target_min}–${selectedCrop.brix_target_max}` : '12–24'}
                        color="hsl(120 50% 50%)"
                      />
                    )}
                    <SynthKnob
                      label={proMode ? 'HARVEST' : 'DAYS'}
                      value={selectedCrop.harvest_days ? `${selectedCrop.harvest_days}d` : '—'}
                      color="hsl(35 70% 55%)"
                      size={40}
                    />
                  </div>
                </div>

                {/* Add to Chord button */}
                {isAdmin && selectedCrop.chord_interval && (
                  <button
                    onClick={() => handleAddToChord(selectedCrop)}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-colors"
                    style={{
                      background: `linear-gradient(180deg, hsl(0 0% 14%) 0%, hsl(0 0% 8%) 100%)`,
                      border: `2px solid ${zoneColor}50`,
                      color: zoneColor,
                      boxShadow: `0 0 12px ${zoneColor}10, inset 0 1px 0 hsl(0 0% 18%)`,
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    ADD TO CHORD
                  </button>
                )}
              </div>

              {/* ═══ SECTION TABS — ADSR-style knob row ═══ */}
              <div
                className="flex items-center justify-around py-2.5 px-3"
                style={{
                  background: 'linear-gradient(180deg, hsl(0 0% 8%) 0%, hsl(0 0% 5%) 100%)',
                  borderTop: '1px solid hsl(0 0% 14%)',
                  borderBottom: '1px solid hsl(0 0% 14%)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {([
                  { id: 'profile' as const, icon: <Leaf className="w-4 h-4" />, label: 'Profile' },
                  { id: 'guild' as const, icon: <Users className="w-4 h-4" />, label: 'Guild' },
                  ...(proMode ? [
                    { id: 'timing' as const, icon: <Moon className="w-4 h-4" />, label: 'Timing' },
                  ] : []),
                  { id: 'beds' as const, icon: <Grid3X3 className="w-4 h-4" />, label: 'Beds' },
                  ...(proMode ? [
                    { id: 'strum' as const, icon: <AudioWaveform className="w-4 h-4" />, label: 'Strum' },
                  ] : []),
                  { id: 'planting' as const, icon: <Ruler className="w-4 h-4" />, label: 'Place' },
                ]).map(tab => {
                  const isActive = activeSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: isActive
                          ? `linear-gradient(180deg, hsl(0 0% 14%) 0%, hsl(0 0% 10%) 100%)`
                          : 'transparent',
                        border: isActive ? `1px solid ${zoneColor}40` : '1px solid transparent',
                        boxShadow: isActive ? `0 0 8px ${zoneColor}10, inset 0 1px 0 hsl(0 0% 18%)` : 'none',
                        color: isActive ? zoneColor : 'hsl(0 0% 40%)',
                      }}
                    >
                      {tab.icon}
                      <span className="text-[7px] font-mono font-bold tracking-[0.1em]">
                        {tab.label.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SynthPanel>

            {/* ═══ SECTION CONTENT ═══ */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* PROFILE */}
                {activeSection === 'profile' && (
                  <>
                    {proMode ? (
                      <SynthPanel className="p-0">
                        <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'hsl(0 0% 12%)' }}>
                          <StatCell label="ZONE" value={`${note} • ${selectedCrop.frequency_hz}Hz`} subtext={selectedCrop.zone_name} color={zoneColor} />
                          <StatCell
                            label="INTERVAL"
                            value={selectedCrop.chord_interval ? INTERVAL_LABELS[selectedCrop.chord_interval]?.label || selectedCrop.chord_interval : '—'}
                            subtext={selectedCrop.category}
                            color={selectedCrop.chord_interval ? INTERVAL_LABELS[selectedCrop.chord_interval]?.color || 'hsl(0 0% 50%)' : 'hsl(0 0% 50%)'}
                          />
                          <StatCell label="MINERAL" value={selectedCrop.dominant_mineral || '—'} subtext={mixSetting?.mixFocus || ''} color="hsl(45 70% 55%)" />
                        </div>
                      </SynthPanel>
                    ) : (
                      <SynthPanel className="p-0">
                        <div className="grid grid-cols-2 divide-x" style={{ borderColor: 'hsl(0 0% 12%)' }}>
                          <StatCell label="ZONE" value={selectedCrop.zone_name} subtext={selectedCrop.category} color={zoneColor} />
                          <StatCell label="HARVEST" value={selectedCrop.harvest_days ? `${selectedCrop.harvest_days} days` : 'Not set'} subtext={selectedCrop.planting_season?.join(', ') || ''} color="hsl(35 70% 55%)" />
                        </div>
                      </SynthPanel>
                    )}
                    {proMode && (
                      <div className="grid grid-cols-2 gap-3">
                        <SynthPanel className="p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Zap className="w-4 h-4" style={{ color: 'hsl(120 50% 50%)' }} />
                            <span className="text-[8px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 40%)' }}>NIR / BRIX TARGET</span>
                          </div>
                          <span className="text-sm font-mono font-bold" style={{ color: 'hsl(120 50% 50%)' }}>
                            {selectedCrop.brix_target_min && selectedCrop.brix_target_max ? `${selectedCrop.brix_target_min}° – ${selectedCrop.brix_target_max}°` : '12° – 24°'}
                          </span>
                        </SynthPanel>
                        <SynthPanel className="p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Clock className="w-4 h-4" style={{ color: 'hsl(35 70% 55%)' }} />
                            <span className="text-[8px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 40%)' }}>HARVEST DAYS</span>
                          </div>
                          <span className="text-sm font-mono font-bold" style={{ color: 'hsl(35 70% 55%)' }}>
                            {selectedCrop.harvest_days ? `${selectedCrop.harvest_days} days` : 'Not set'}
                          </span>
                        </SynthPanel>
                      </div>
                    )}
                    {proMode && (
                      <SynthPanel className="p-3">
                        <div className="grid grid-cols-2 gap-2">
                          {selectedCrop.spacing_inches && <MetaItem label="SPACING" value={`${selectedCrop.spacing_inches}"`} />}
                          {selectedCrop.planting_season && selectedCrop.planting_season.length > 0 && <MetaItem label="SEASON" value={selectedCrop.planting_season.join(', ')} />}
                          {selectedCrop.focus_tag && <MetaItem label="FOCUS TAG" value={selectedCrop.focus_tag.replace('_', ' ')} />}
                          {selectedCrop.cultural_role && <MetaItem label="CULTURAL ROLE" value={selectedCrop.cultural_role} />}
                          {selectedCrop.soil_protocol_focus && <MetaItem label="SOIL PROTOCOL" value={selectedCrop.soil_protocol_focus} />}
                          {selectedCrop.guild_role && <MetaItem label="GUILD ROLE" value={selectedCrop.guild_role} />}
                        </div>
                      </SynthPanel>
                    )}
                  </>
                )}

                {/* GUILD — Unified Companion + Harmony View */}
                {activeSection === 'guild' && (() => {
                  // Organize companions by their chord interval
                  const INTERVALS = ['1st', '3rd', '5th', '7th', '9th', '11th', '13th'] as const;
                  const INTERVAL_LABELS_MAP: Record<string, { emoji: string; role: string }> = {
                    '1st': { emoji: '🌱', role: 'Root / Canopy' },
                    '3rd': { emoji: '🌿', role: 'Aromatic / Trap' },
                    '5th': { emoji: '🫘', role: 'Nitrogen / Stabilizer' },
                    '7th': { emoji: '🌼', role: 'Pollinator / Signal' },
                    '9th': { emoji: '🥕', role: 'Subterranean / Tuber' },
                    '11th': { emoji: '🍄', role: 'Fungi / Sentinel' },
                    '13th': { emoji: '🌺', role: 'Aerial / Vine' },
                  };

                  // Build a map: interval -> { recipe crop, companion crops }
                  const slotMap = INTERVALS.map(interval => {
                    const recipeMatch = chordRecipe?.intervals.find(iv => iv.interval === interval);
                    const slotCompanions = companionCrops.filter(({ crop }) =>
                      crop?.chord_interval?.includes(interval)
                    );
                    return { interval, recipeMatch, companions: slotCompanions };
                  });

                  // Unslotted companions (no interval match)
                  const slottedNames = new Set(
                    slotMap.flatMap(s => s.companions.map(c => c.name))
                  );
                  const unslotted = companionCrops.filter(({ name }) => !slottedNames.has(name));

                  return (
                    <div className="space-y-2">
                      {/* Recipe header (Pro) */}
                      {proMode && chordRecipe && (
                        <SynthPanel className="p-2.5">
                          <div className="flex items-center gap-2">
                            <Music className="w-3.5 h-3.5" style={{ color: 'hsl(45 80% 55%)' }} />
                            <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: 'hsl(45 80% 55%)' }}>
                              {chordRecipe.chordName}
                            </span>
                            <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                              {chordRecipe.zoneName} • {chordRecipe.frequencyHz}Hz
                            </span>
                          </div>
                        </SynthPanel>
                      )}

                      {/* 7 Interval Slots */}
                      <SynthPanel className="p-2">
                        <div className="flex items-center gap-2 px-1 mb-2">
                          <Users className="w-3.5 h-3.5" style={{ color: zoneColor }} />
                          <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: zoneColor }}>
                            {proMode ? 'CHORD GUILD' : 'PLANT WITH'} • {companionCrops.length} COMPANIONS
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          {slotMap.map(({ interval, recipeMatch, companions }) => {
                            const meta = INTERVAL_LABELS_MAP[interval];
                            const hasContent = recipeMatch || companions.length > 0;
                            const isSelectedSlot = selectedCrop.chord_interval?.includes(interval);

                            return (
                              <div
                                key={interval}
                                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                                style={{
                                  background: isSelectedSlot ? `${zoneColor}15` : hasContent ? 'hsl(0 0% 5%)' : 'hsl(0 0% 3%)',
                                  border: `1px solid ${isSelectedSlot ? `${zoneColor}40` : hasContent ? 'hsl(0 0% 10%)' : 'hsl(0 0% 6%)'}`,
                                }}
                              >
                                {/* Interval badge */}
                                <span className="text-[8px] font-mono font-bold w-7 text-center shrink-0" style={{ color: isSelectedSlot ? zoneColor : 'hsl(0 0% 40%)' }}>
                                  {interval}
                                </span>
                                {/* Emoji */}
                                <span className="text-xs shrink-0">{meta.emoji}</span>
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  {isSelectedSlot ? (
                                    <span className="text-[10px] font-mono font-bold truncate block" style={{ color: zoneColor }}>
                                      ★ {selectedCrop.common_name || selectedCrop.name}
                                    </span>
                                  ) : companions.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {companions.map(({ name, crop }) => (
                                        <button
                                          key={name}
                                          className="text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors truncate"
                                          style={{
                                            background: crop ? `${ZONE_COLORS[crop.frequency_hz] || '#888'}10` : 'hsl(0 0% 6%)',
                                            border: `1px solid ${crop ? `${ZONE_COLORS[crop.frequency_hz] || '#888'}25` : 'hsl(0 0% 10%)'}`,
                                            color: crop ? 'hsl(0 0% 65%)' : 'hsl(0 0% 35%)',
                                          }}
                                          onClick={() => {
                                            if (crop) { setSelectedCrop(crop); setQuery(crop.common_name || crop.name); }
                                          }}
                                        >
                                          {name}
                                        </button>
                                      ))}
                                    </div>
                                  ) : recipeMatch ? (
                                    <span className="text-[9px] font-mono truncate block" style={{ color: 'hsl(0 0% 35%)' }}>
                                      {recipeMatch.emoji} {recipeMatch.cropName}
                                      <span className="text-[7px] ml-1" style={{ color: 'hsl(0 0% 25%)' }}>recipe</span>
                                    </span>
                                  ) : (
                                    <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 20%)' }}>
                                      {proMode ? meta.role : '—'}
                                    </span>
                                  )}
                                </div>
                                {/* Pro: Hz badge for companions */}
                                {proMode && companions.length > 0 && (
                                  <span className="text-[7px] font-mono shrink-0" style={{ color: 'hsl(0 0% 30%)' }}>
                                    {companions.length}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Unslotted companions */}
                        {unslotted.length > 0 && (
                          <div className="mt-2 pt-2" style={{ borderTop: '1px solid hsl(0 0% 8%)' }}>
                            <span className="text-[8px] font-mono block mb-1 px-1" style={{ color: 'hsl(0 0% 30%)' }}>
                              UNASSIGNED ({unslotted.length})
                            </span>
                            <div className="flex flex-wrap gap-1 px-1">
                              {unslotted.map(({ name, crop }) => (
                                <button
                                  key={name}
                                  className="text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors"
                                  style={{
                                    background: crop ? `${ZONE_COLORS[crop.frequency_hz] || '#888'}08` : 'hsl(0 0% 5%)',
                                    border: `1px solid ${crop ? `${ZONE_COLORS[crop.frequency_hz] || '#888'}20` : 'hsl(0 0% 10%)'}`,
                                    color: crop ? 'hsl(0 0% 60%)' : 'hsl(0 0% 35%)',
                                  }}
                                  onClick={() => {
                                    if (crop) { setSelectedCrop(crop); setQuery(crop.common_name || crop.name); }
                                  }}
                                >
                                  {name}
                                  {!crop && <span className="text-[7px] ml-0.5" style={{ color: 'hsl(0 60% 45%)' }}>✗</span>}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </SynthPanel>

                      {/* Pro: Warnings + Conflicts */}
                      {proMode && (
                        <>
                          <HarmonicWarningsCard crop={selectedCrop} />
                          {conflicts.length > 0 && (
                            <SynthPanel className="p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(0 60% 55%)' }} />
                                <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: 'hsl(0 60% 55%)' }}>SLOT COMPETITORS ({conflicts.length})</span>
                              </div>
                              <p className="text-[9px] font-mono mb-2" style={{ color: 'hsl(0 0% 40%)' }}>Same zone + interval + instrument — only one can occupy this slot per bed.</p>
                              <div className="flex flex-wrap gap-1.5">
                                {conflicts.map(c => (
                                  <button key={c.id} className="px-2 py-1 rounded-lg text-[10px] font-mono"
                                    style={{
                                      background: 'hsl(0 0% 6%)',
                                      border: '1px solid hsl(0 0% 14%)',
                                      color: 'hsl(0 0% 60%)',
                                    }}
                                    onClick={() => { setSelectedCrop(c); setQuery(c.common_name || c.name); }}
                                  >{c.common_name || c.name}</button>
                                ))}
                              </div>
                            </SynthPanel>
                          )}
                        </>
                      )}
                    </div>
                  );
                })()}

                {/* TIMING (Pro only) */}
                {activeSection === 'timing' && proMode && (
                  <>
                    <LunarGateCard crop={selectedCrop} zoneColor={zoneColor} />
                    <SeasonalMovementCard crop={selectedCrop} />
                  </>
                )}

                {/* BEDS — Bed Organization */}
                {activeSection === 'beds' && (
                  <BedOrganizationCard crop={selectedCrop} zoneColor={zoneColor} />
                )}

                {/* STRUM — Bed Strum Visualizer (Pro only) */}
                {activeSection === 'strum' && proMode && (
                  <BedStrumEmbed frequencyHz={selectedCrop.frequency_hz} zoneColor={zoneColor} />
                )}

                {/* PLACE — Placement Details */}
                {activeSection === 'planting' && (
                  <SynthPanel className="p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Ruler className="w-4 h-4" style={{ color: zoneColor }} />
                      <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: zoneColor }}>
                        PLACEMENT DETAILS
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCrop.spacing_inches && <MetaItem label="IN-ROW SPACING" value={`${selectedCrop.spacing_inches}"`} />}
                      {selectedCrop.harvest_days && <MetaItem label="HARVEST DAYS" value={`${selectedCrop.harvest_days} days`} />}
                      {selectedCrop.planting_season && selectedCrop.planting_season.length > 0 && <MetaItem label="PLANTING SEASON" value={selectedCrop.planting_season.join(', ')} />}
                      {selectedCrop.chord_interval && <MetaItem label="INTERVAL SLOT" value={selectedCrop.chord_interval} />}
                      {selectedCrop.guild_role && <MetaItem label="GUILD ROLE" value={selectedCrop.guild_role} />}
                      {selectedCrop.soil_protocol_focus && <MetaItem label="SOIL PROTOCOL" value={selectedCrop.soil_protocol_focus} />}
                    </div>
                  </SynthPanel>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>




      {/* Chord Composer Drawer */}
      <ChordComposer
        open={composerOpen}
        onOpenChange={setComposerOpen}
        activeFrequency={activeFrequency}
        pendingCrop={pendingCrop}
        onClearPending={() => setPendingCrop(null)}
        allCrops={allCrops || []}
      />
    </div>
  );
};

/* ─── Sub-components ─── */

const MetaRow = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex items-center justify-between py-0.5">
    <span className="text-[8px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 35%)' }}>{label}:</span>
    <span className="text-[9px] font-mono font-bold" style={{ color }}>{value}</span>
  </div>
);

const StatCell = ({ label, value, subtext, color }: { label: string; value: string; subtext: string; color: string }) => (
  <div className="p-3 text-center">
    <span className="text-[8px] font-mono block mb-0.5" style={{ color: 'hsl(0 0% 40%)' }}>{label}</span>
    <span className="text-xs font-mono font-bold block" style={{ color }}>{value}</span>
    <span className="text-[8px] font-mono block mt-0.5 truncate" style={{ color: 'hsl(0 0% 35%)' }}>{subtext}</span>
  </div>
);

const MetaItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 30%)' }}>{label}</span>
    <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 55%)' }}>{value}</span>
  </div>
);

export default CropOracle;
