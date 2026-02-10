import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowLeft, Music, Leaf, Shield, Pickaxe, Sparkles, Zap,
  AlertTriangle, Clock, Users, Layers, Disc, ToggleLeft, ToggleRight, X, Info, Plus,
  Moon, Sprout, Ruler,
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
import HarmonicCarousel from '@/components/crop-oracle/HarmonicCarousel';
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

const CropOracle = () => {
  const navigate = useNavigate();
  const { data: allCrops, isLoading } = useMasterCrops();
  const { isAdmin } = useAdminRole();
  const [query, setQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<MasterCrop | null>(null);
  const [hoveredCrop, setHoveredCrop] = useState<MasterCrop | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'guild' | 'harmony' | 'timing' | 'planting'>('profile');
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
      // Auto-populate: show a curated sample grouped by zone
      const seen = new Set<number>();
      const sample: MasterCrop[] = [];
      for (const crop of allCrops) {
        if (!seen.has(crop.frequency_hz)) {
          seen.add(crop.frequency_hz);
          sample.push(crop);
        }
      }
      // Add more popular crops
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
      // Exact match first, then partial (handles generic names like "Tomato" → "Tomato (Roma)")
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
    // Find crops in the same zone with same chord interval (competing for same slot)
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

  // Determine active frequency for Chord Composer (from selected crop or first result)
  const activeFrequency = selectedCrop?.frequency_hz || (results.length > 0 ? results[0].frequency_hz : null);

  const handleAddToChord = (crop: MasterCrop) => {
    setPendingCrop(crop);
    if (!composerOpen) setComposerOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'hsl(0 0% 3%)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'hsl(0 0% 3% / 0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid hsl(0 0% 10%)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 15%)' }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: 'hsl(0 0% 50%)' }} />
        </button>
        <Disc className="w-5 h-5" style={{ color: 'hsl(45 80% 55%)' }} />
        <h1 className="text-sm font-mono font-bold tracking-wider flex-1" style={{ color: 'hsl(45 80% 55%)' }}>
          CROP ORACLE
        </h1>
        {/* Easy / Pro Toggle */}
        <button
          onClick={() => { toggleProMode(); setShowHint(false); localStorage.setItem('oracle-hint-dismissed', 'true'); }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${showHint ? 'animate-[oracle-pulse_2s_ease-in-out_infinite]' : ''}`}
          style={{
            background: proMode ? 'hsl(45 80% 55% / 0.15)' : 'hsl(120 50% 50% / 0.12)',
            border: `1px solid ${proMode ? 'hsl(45 80% 55% / 0.4)' : 'hsl(120 50% 50% / 0.3)'}`,
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
        {/* Compose Chord Button — visible to all, functionality differs by role */}
        <button
          onClick={() => setComposerOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all"
          style={{
            background: composerOpen ? 'hsl(270 50% 40% / 0.25)' : 'hsl(270 30% 20% / 0.15)',
            border: `1px solid ${composerOpen ? 'hsl(270 50% 50% / 0.5)' : 'hsl(270 30% 30% / 0.3)'}`,
          }}
        >
          <Music className="w-4 h-4" style={{ color: 'hsl(270 50% 60%)' }} />
          <span className="text-[9px] font-mono font-bold" style={{ color: 'hsl(270 50% 60%)' }}>
            🎹
          </span>
        </button>
      </div>

      {/* Onboarding hint — first visit only */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            className="mx-4 mt-3 mb-1 rounded-xl p-3 flex items-start gap-2.5"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'hsl(45 80% 55%)' }} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 65%)' }}>
                <span className="font-bold" style={{ color: 'hsl(120 50% 50%)' }}>EASY</span> shows crop basics, companions & spacing.
                Switch to <span className="font-bold" style={{ color: 'hsl(45 80% 55%)' }}>PRO</span> to unlock frequencies, Brix targets, lunar timing, chord recipes, harmonic warnings & full placement guides.
              </p>
            </div>
            <button
              onClick={dismissHint}
              className="shrink-0 w-5 h-5 rounded flex items-center justify-center"
              style={{ background: 'hsl(0 0% 15%)' }}
            >
              <X className="w-3 h-3" style={{ color: 'hsl(0 0% 50%)' }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="px-4 pt-4 pb-2">
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{
            background: 'hsl(0 0% 6%)',
            border: `1px solid ${selectedCrop ? zoneColor + '40' : 'hsl(0 0% 14%)'}`,
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
            style={{ color: 'hsl(0 0% 80%)' }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setSelectedCrop(null); }}
              className="text-xs font-mono"
              style={{ color: 'hsl(0 0% 40%)' }}
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {!selectedCrop && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mx-4 rounded-xl overflow-hidden mb-4 relative"
            style={{
              background: 'hsl(0 0% 5%)',
              border: '1px solid hsl(0 0% 12%)',
              maxHeight: '60vh',
              overflowY: 'auto',
            }}
          >
            {!query && (
              <div className="px-3 py-2" style={{ borderBottom: '1px solid hsl(0 0% 10%)' }}>
                <span className="text-[9px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 35%)' }}>
                  POPULAR CROPS — TAP TO SELECT, HOVER FOR FACTS
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
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: c, boxShadow: `0 0 6px ${c}80` }}
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
                    {/* "+ Add" button when composer is open (admin only) */}
                    {composerOpen && isAdmin && crop.chord_interval && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddToChord(crop); }}
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors"
                        style={{
                          background: `${c}20`,
                          border: `1px solid ${c}40`,
                        }}
                        title={`Add to chord (${crop.chord_interval})`}
                      >
                        <Plus className="w-3 h-3" style={{ color: c }} />
                      </button>
                    )}
                  </button>

                  {/* Hover fact tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: 4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        className="absolute right-0 top-0 z-30 w-56 p-2.5 rounded-lg pointer-events-none"
                        style={{
                          background: 'rgba(0, 0, 0, 0.85)',
                          backdropFilter: 'blur(12px)',
                          border: `1px solid ${c}40`,
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CROP PROFILE CARD ─── */}
      <AnimatePresence>
        {selectedCrop && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="px-4 pb-8 space-y-3"
          >
            {/* Zone + Identity — always visible */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${zoneColor}12, hsl(0 0% 4%))`,
                border: `2px solid ${zoneColor}40`,
                boxShadow: `0 0 30px ${zoneColor}15`,
              }}
            >
              <div className="p-4" style={{ borderBottom: `1px solid ${zoneColor}25` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'hsl(0 0% 85%)' }}>
                      {selectedCrop.common_name || selectedCrop.name}
                    </h2>
                    {proMode && (
                      <p className="text-[10px] font-mono italic" style={{ color: 'hsl(0 0% 40%)' }}>
                        {selectedCrop.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl">
                      {selectedCrop.instrument_type
                        ? INSTRUMENT_ICONS[selectedCrop.instrument_type as InstrumentType]?.icon || '🌱'
                        : '🌱'}
                    </span>
                    {proMode && (
                      <p className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                        {selectedCrop.instrument_type || 'Unassigned'}
                      </p>
                    )}
                  </div>
                </div>

                {selectedCrop.description && (
                  <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'hsl(0 0% 55%)' }}>
                    {selectedCrop.description}
                  </p>
                )}

                {isAdmin && selectedCrop.chord_interval && (
                  <button
                    onClick={() => handleAddToChord(selectedCrop)}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono font-bold transition-colors"
                    style={{
                      background: composerOpen ? `${zoneColor}25` : `${zoneColor}12`,
                      border: `1px solid ${zoneColor}40`,
                      color: zoneColor,
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    ADD TO CHORD
                  </button>
                )}
              </div>

              {/* ─── Icon Toolbar ─── */}
              <div className="flex items-center justify-around py-2 px-2" style={{ background: 'hsl(0 0% 3%)' }}>
                {([
                  { id: 'profile' as const, icon: <Leaf className="w-4 h-4" />, label: 'Profile' },
                  { id: 'guild' as const, icon: <Users className="w-4 h-4" />, label: 'Guild' },
                  ...(proMode ? [
                    { id: 'harmony' as const, icon: <Music className="w-4 h-4" />, label: 'Harmony' },
                    { id: 'timing' as const, icon: <Moon className="w-4 h-4" />, label: 'Timing' },
                  ] : []),
                  { id: 'planting' as const, icon: <Ruler className="w-4 h-4" />, label: 'Planting' },
                ]).map(tab => {
                  const isActive = activeSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: isActive ? `${zoneColor}18` : 'transparent',
                        color: isActive ? zoneColor : 'hsl(0 0% 40%)',
                      }}
                    >
                      {tab.icon}
                      <span className="text-[7px] font-mono font-bold tracking-wider">
                        {tab.label.toUpperCase()}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="section-indicator"
                          className="w-4 h-0.5 rounded-full"
                          style={{ background: zoneColor }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── Section Content ─── */}
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
                      <div className="grid grid-cols-3 divide-x rounded-xl overflow-hidden" style={{ borderColor: `${zoneColor}20`, background: 'hsl(0 0% 5%)', border: `1px solid ${zoneColor}20` }}>
                        <StatCell label="ZONE" value={`${note} • ${selectedCrop.frequency_hz}Hz`} subtext={selectedCrop.zone_name} color={zoneColor} />
                        <StatCell
                          label="CHORD INTERVAL"
                          value={selectedCrop.chord_interval ? INTERVAL_LABELS[selectedCrop.chord_interval]?.label || selectedCrop.chord_interval : '—'}
                          subtext={selectedCrop.category}
                          color={selectedCrop.chord_interval ? INTERVAL_LABELS[selectedCrop.chord_interval]?.color || 'hsl(0 0% 50%)' : 'hsl(0 0% 50%)'}
                        />
                        <StatCell label="MINERAL" value={selectedCrop.dominant_mineral || '—'} subtext={mixSetting?.mixFocus || ''} color="hsl(45 70% 55%)" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 divide-x rounded-xl overflow-hidden" style={{ borderColor: `${zoneColor}20`, background: 'hsl(0 0% 5%)', border: `1px solid ${zoneColor}20` }}>
                        <StatCell label="ZONE" value={selectedCrop.zone_name} subtext={selectedCrop.category} color={zoneColor} />
                        <StatCell label="HARVEST" value={selectedCrop.harvest_days ? `${selectedCrop.harvest_days} days` : 'Not set'} subtext={selectedCrop.planting_season?.join(', ') || ''} color="hsl(35 70% 55%)" />
                      </div>
                    )}
                    {proMode && (
                      <div className="grid grid-cols-2 gap-3">
                        <InfoCard icon={<Zap className="w-4 h-4" />} label="NIR / BRIX TARGET" value={selectedCrop.brix_target_min && selectedCrop.brix_target_max ? `${selectedCrop.brix_target_min}° – ${selectedCrop.brix_target_max}°` : '12° – 24°'} accent="hsl(120 50% 50%)" />
                        <InfoCard icon={<Clock className="w-4 h-4" />} label="HARVEST DAYS" value={selectedCrop.harvest_days ? `${selectedCrop.harvest_days} days` : 'Not set'} accent="hsl(35 70% 55%)" />
                      </div>
                    )}
                    {proMode && (
                      <div className="rounded-xl p-3 grid grid-cols-2 gap-2" style={{ background: 'hsl(0 0% 4%)', border: '1px solid hsl(0 0% 10%)' }}>
                        {selectedCrop.spacing_inches && <MetaItem label="SPACING" value={`${selectedCrop.spacing_inches}"`} />}
                        {selectedCrop.planting_season && selectedCrop.planting_season.length > 0 && <MetaItem label="SEASON" value={selectedCrop.planting_season.join(', ')} />}
                        {selectedCrop.focus_tag && <MetaItem label="FOCUS TAG" value={selectedCrop.focus_tag.replace('_', ' ')} />}
                        {selectedCrop.cultural_role && <MetaItem label="CULTURAL ROLE" value={selectedCrop.cultural_role} />}
                        {selectedCrop.soil_protocol_focus && <MetaItem label="SOIL PROTOCOL" value={selectedCrop.soil_protocol_focus} />}
                        {selectedCrop.guild_role && <MetaItem label="GUILD ROLE" value={selectedCrop.guild_role} />}
                      </div>
                    )}
                  </>
                )}

                {/* GUILD */}
                {activeSection === 'guild' && (
                  <div className="rounded-xl p-3" style={{ background: 'hsl(0 0% 5%)', border: '1px solid hsl(0 0% 12%)' }}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Users className="w-4 h-4" style={{ color: 'hsl(120 50% 50%)' }} />
                      <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: 'hsl(120 50% 50%)' }}>
                        {proMode ? `COMPANION GUILD (${companionCrops.length})` : `PLANT WITH (${companionCrops.length})`}
                      </span>
                    </div>
                    {companionCrops.length > 0 ? (
                      <div className="space-y-1.5">
                        {companionCrops.map(({ name, crop }) => (
                          <button
                            key={name}
                            className="w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors"
                            style={{
                              background: crop ? `${ZONE_COLORS[crop.frequency_hz] || '#888'}08` : 'hsl(0 0% 7%)',
                              border: `1px solid ${crop ? `${ZONE_COLORS[crop.frequency_hz] || '#888'}20` : 'hsl(0 0% 10%)'}`,
                            }}
                            onClick={() => {
                              if (crop) { setSelectedCrop(crop); setQuery(crop.common_name || crop.name); }
                            }}
                          >
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: crop ? ZONE_COLORS[crop.frequency_hz] || '#888' : 'hsl(0 0% 25%)' }} />
                            <span className="text-xs font-mono flex-1" style={{ color: crop ? 'hsl(0 0% 70%)' : 'hsl(0 0% 35%)' }}>{name}</span>
                            {proMode && crop && (
                              <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                                {crop.frequency_hz}Hz • {crop.chord_interval || '—'}
                              </span>
                            )}
                            {!crop && <span className="text-[8px] font-mono" style={{ color: 'hsl(0 60% 45%)' }}>NOT IN REGISTRY</span>}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>No companions assigned yet.</p>
                    )}
                  </div>
                )}

                {/* HARMONY (Pro only) */}
                {activeSection === 'harmony' && proMode && (
                  <>
                    {chordRecipe && (
                      <div className="rounded-xl p-3" style={{ background: 'hsl(45 30% 6%)', border: '1px solid hsl(45 50% 25%)' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <Music className="w-4 h-4" style={{ color: 'hsl(45 80% 55%)' }} />
                          <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: 'hsl(45 80% 55%)' }}>JAZZ 13TH RECIPE MATCH</span>
                        </div>
                        <p className="text-xs font-mono" style={{ color: 'hsl(45 60% 50%)' }}>
                          Part of <strong>{chordRecipe.chordName}</strong> ({chordRecipe.zoneName} • {chordRecipe.frequencyHz}Hz)
                        </p>
                        <div className="flex gap-1 mt-2">
                          {chordRecipe.intervals.map(iv => (
                            <div key={iv.interval} className="px-1.5 py-1 rounded text-center" style={{
                              background: iv.cropName === (selectedCrop.common_name || selectedCrop.name) ? `${zoneColor}30` : 'hsl(0 0% 8%)',
                              border: iv.cropName === (selectedCrop.common_name || selectedCrop.name) ? `1px solid ${zoneColor}60` : '1px solid hsl(0 0% 12%)',
                            }}>
                              <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 40%)' }}>{iv.interval}</span>
                              <span className="text-[10px]">{iv.emoji}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <HarmonicWarningsCard crop={selectedCrop} />
                    {conflicts.length > 0 && (
                      <div className="rounded-xl p-3" style={{ background: 'hsl(0 30% 6%)', border: '1px solid hsl(0 40% 25%)' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(0 60% 55%)' }} />
                          <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: 'hsl(0 60% 55%)' }}>SLOT COMPETITORS ({conflicts.length})</span>
                        </div>
                        <p className="text-[9px] font-mono mb-2" style={{ color: 'hsl(0 0% 40%)' }}>Same zone + interval + instrument — only one can occupy this slot per bed.</p>
                        <div className="flex flex-wrap gap-1.5">
                          {conflicts.map(c => (
                            <button key={c.id} className="px-2 py-1 rounded-lg text-[10px] font-mono" style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 14%)', color: 'hsl(0 0% 60%)' }}
                              onClick={() => { setSelectedCrop(c); setQuery(c.common_name || c.name); }}
                            >{c.common_name || c.name}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* TIMING (Pro only) */}
                {activeSection === 'timing' && proMode && (
                  <>
                    <LunarGateCard crop={selectedCrop} zoneColor={zoneColor} />
                    <SeasonalMovementCard crop={selectedCrop} />
                  </>
                )}

                {/* PLANTING */}
                {activeSection === 'planting' && (
                  <>
                    <BedOrganizationCard crop={selectedCrop} zoneColor={zoneColor} />
                    {proMode && <BedStrumEmbed frequencyHz={selectedCrop.frequency_hz} zoneColor={zoneColor} />}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Harmonic Matrix Carousel — 50 chords, 5 at a time */}
      {proMode && <HarmonicCarousel />}

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

const StatCell = ({ label, value, subtext, color }: { label: string; value: string; subtext: string; color: string }) => (
  <div className="p-3 text-center">
    <span className="text-[8px] font-mono block mb-0.5" style={{ color: 'hsl(0 0% 40%)' }}>{label}</span>
    <span className="text-xs font-mono font-bold block" style={{ color }}>{value}</span>
    <span className="text-[8px] font-mono block mt-0.5 truncate" style={{ color: 'hsl(0 0% 35%)' }}>{subtext}</span>
  </div>
);

const InfoCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) => (
  <div
    className="rounded-xl p-3"
    style={{
      background: `${accent}08`,
      border: `1px solid ${accent}25`,
    }}
  >
    <div className="flex items-center gap-1.5 mb-1">
      <span style={{ color: accent }}>{icon}</span>
      <span className="text-[8px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 40%)' }}>{label}</span>
    </div>
    <span className="text-sm font-mono font-bold" style={{ color: accent }}>{value}</span>
  </div>
);

const MetaItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 30%)' }}>{label}</span>
    <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 55%)' }}>{value}</span>
  </div>
);

export default CropOracle;
