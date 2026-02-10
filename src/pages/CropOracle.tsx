import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowLeft, Music, Leaf, Shield, Pickaxe, Sparkles, Zap,
  AlertTriangle, Clock, Users, Layers, Disc,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { INSTRUMENT_ICONS, InstrumentType, checkDissonance, getMasterMixSetting } from '@/hooks/useAutoGeneration';
import { CHORD_RECIPES } from '@/data/chordRecipes';
import LunarGateCard from '@/components/crop-oracle/LunarGateCard';
import SeasonalMovementCard from '@/components/crop-oracle/SeasonalMovementCard';

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
  const [query, setQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<MasterCrop | null>(null);

  /* ─── Search results ─── */
  const results = useMemo(() => {
    if (!allCrops || query.length < 2) return [];
    const q = query.toLowerCase();
    return allCrops
      .filter(c =>
        c.common_name?.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.zone_name.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [allCrops, query]);

  /* ─── Companion lookup ─── */
  const companionCrops = useMemo(() => {
    if (!selectedCrop?.companion_crops || !allCrops) return [];
    return selectedCrop.companion_crops.map(name => {
      const match = allCrops.find(c =>
        c.common_name?.toLowerCase() === name.toLowerCase() ||
        c.name.toLowerCase() === name.toLowerCase()
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
        <h1 className="text-sm font-mono font-bold tracking-wider" style={{ color: 'hsl(45 80% 55%)' }}>
          CROP ORACLE
        </h1>
      </div>

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

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {!selectedCrop && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mx-4 rounded-xl overflow-hidden mb-4"
            style={{
              background: 'hsl(0 0% 5%)',
              border: '1px solid hsl(0 0% 12%)',
              maxHeight: '50vh',
              overflowY: 'auto',
            }}
          >
            {results.map((crop) => {
              const c = ZONE_COLORS[crop.frequency_hz] || '#888';
              const inst = crop.instrument_type ? INSTRUMENT_ICONS[crop.instrument_type as InstrumentType] : null;
              return (
                <button
                  key={crop.id}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                  style={{ borderBottom: '1px solid hsl(0 0% 8%)' }}
                  onClick={() => {
                    setSelectedCrop(crop);
                    setQuery(crop.common_name || crop.name);
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `${c}10`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
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
                      {crop.zone_name} • {crop.frequency_hz}Hz • {crop.chord_interval || '—'}
                    </span>
                  </div>
                  <span className="text-sm shrink-0">{inst?.icon || '🌱'}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!selectedCrop && query.length < 2 && (
        <div className="px-4 pt-8 text-center">
          <Disc className="w-12 h-12 mx-auto mb-3" style={{ color: 'hsl(0 0% 15%)' }} />
          <p className="text-xs font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
            Type a crop name to reveal its full harmonic profile —<br />
            zone, chord role, companions, instrument, and conflicts.
          </p>
          <p className="text-[10px] font-mono mt-2" style={{ color: 'hsl(0 0% 20%)' }}>
            {isLoading ? 'Loading registry...' : `${allCrops?.length || 0} crops in registry`}
          </p>
        </div>
      )}

      {/* ─── CROP PROFILE CARD ─── */}
      <AnimatePresence>
        {selectedCrop && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="px-4 pb-8 space-y-3"
          >
            {/* Zone + Identity */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${zoneColor}12, hsl(0 0% 4%))`,
                border: `2px solid ${zoneColor}40`,
                boxShadow: `0 0 30px ${zoneColor}15`,
              }}
            >
              <div
                className="p-4"
                style={{ borderBottom: `1px solid ${zoneColor}25` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'hsl(0 0% 85%)' }}>
                      {selectedCrop.common_name || selectedCrop.name}
                    </h2>
                    <p className="text-[10px] font-mono italic" style={{ color: 'hsl(0 0% 40%)' }}>
                      {selectedCrop.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl">
                      {selectedCrop.instrument_type
                        ? INSTRUMENT_ICONS[selectedCrop.instrument_type as InstrumentType]?.icon || '🌱'
                        : '🌱'}
                    </span>
                    <p className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                      {selectedCrop.instrument_type || 'Unassigned'}
                    </p>
                  </div>
                </div>

                {selectedCrop.description && (
                  <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'hsl(0 0% 55%)' }}>
                    {selectedCrop.description}
                  </p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 divide-x" style={{ borderColor: `${zoneColor}20` }}>
                <StatCell label="ZONE" value={`${note} • ${selectedCrop.frequency_hz}Hz`} subtext={selectedCrop.zone_name} color={zoneColor} />
                <StatCell
                  label="CHORD INTERVAL"
                  value={selectedCrop.chord_interval ? INTERVAL_LABELS[selectedCrop.chord_interval]?.label || selectedCrop.chord_interval : '—'}
                  subtext={selectedCrop.category}
                  color={selectedCrop.chord_interval ? INTERVAL_LABELS[selectedCrop.chord_interval]?.color || 'hsl(0 0% 50%)' : 'hsl(0 0% 50%)'}
                />
                <StatCell
                  label="MINERAL"
                  value={selectedCrop.dominant_mineral || '—'}
                  subtext={mixSetting?.mixFocus || ''}
                  color="hsl(45 70% 55%)"
                />
              </div>
            </div>

            {/* Brix + Timing Row */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                icon={<Zap className="w-4 h-4" />}
                label="NIR / BRIX TARGET"
                value={selectedCrop.brix_target_min && selectedCrop.brix_target_max
                  ? `${selectedCrop.brix_target_min}° – ${selectedCrop.brix_target_max}°`
                  : '12° – 24°'}
                accent="hsl(120 50% 50%)"
              />
              <InfoCard
                icon={<Clock className="w-4 h-4" />}
                label="HARVEST DAYS"
                value={selectedCrop.harvest_days ? `${selectedCrop.harvest_days} days` : 'Not set'}
                accent="hsl(35 70% 55%)"
              />
            </div>

            {/* Lunar Gate Timing */}
            <LunarGateCard crop={selectedCrop} zoneColor={zoneColor} />
            {/* Seasonal Movement */}
            <SeasonalMovementCard crop={selectedCrop} />

            {/* Companion Guild */}
            <div
              className="rounded-xl p-3"
              style={{
                background: 'hsl(0 0% 5%)',
                border: '1px solid hsl(0 0% 12%)',
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <Users className="w-4 h-4" style={{ color: 'hsl(120 50% 50%)' }} />
                <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: 'hsl(120 50% 50%)' }}>
                  COMPANION GUILD ({companionCrops.length})
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
                        if (crop) {
                          setSelectedCrop(crop);
                          setQuery(crop.common_name || crop.name);
                        }
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          background: crop ? ZONE_COLORS[crop.frequency_hz] || '#888' : 'hsl(0 0% 25%)',
                        }}
                      />
                      <span className="text-xs font-mono flex-1" style={{ color: crop ? 'hsl(0 0% 70%)' : 'hsl(0 0% 35%)' }}>
                        {name}
                      </span>
                      {crop && (
                        <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                          {crop.frequency_hz}Hz • {crop.chord_interval || '—'}
                        </span>
                      )}
                      {!crop && (
                        <span className="text-[8px] font-mono" style={{ color: 'hsl(0 60% 45%)' }}>
                          NOT IN REGISTRY
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                  No companions assigned yet.
                </p>
              )}
            </div>

            {/* Chord Recipe Match */}
            {chordRecipe && (
              <div
                className="rounded-xl p-3"
                style={{
                  background: 'hsl(45 30% 6%)',
                  border: '1px solid hsl(45 50% 25%)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Music className="w-4 h-4" style={{ color: 'hsl(45 80% 55%)' }} />
                  <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: 'hsl(45 80% 55%)' }}>
                    JAZZ 13TH RECIPE MATCH
                  </span>
                </div>
                <p className="text-xs font-mono" style={{ color: 'hsl(45 60% 50%)' }}>
                  Part of <strong>{chordRecipe.chordName}</strong> ({chordRecipe.zoneName} • {chordRecipe.frequencyHz}Hz)
                </p>
                <div className="flex gap-1 mt-2">
                  {chordRecipe.intervals.map(iv => (
                    <div
                      key={iv.interval}
                      className="px-1.5 py-1 rounded text-center"
                      style={{
                        background: iv.cropName === (selectedCrop.common_name || selectedCrop.name)
                          ? `${zoneColor}30`
                          : 'hsl(0 0% 8%)',
                        border: iv.cropName === (selectedCrop.common_name || selectedCrop.name)
                          ? `1px solid ${zoneColor}60`
                          : '1px solid hsl(0 0% 12%)',
                      }}
                    >
                      <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 40%)' }}>
                        {iv.interval}
                      </span>
                      <span className="text-[10px]">{iv.emoji}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conflicts */}
            {conflicts.length > 0 && (
              <div
                className="rounded-xl p-3"
                style={{
                  background: 'hsl(0 30% 6%)',
                  border: '1px solid hsl(0 40% 25%)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(0 60% 55%)' }} />
                  <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: 'hsl(0 60% 55%)' }}>
                    SLOT COMPETITORS ({conflicts.length})
                  </span>
                </div>
                <p className="text-[9px] font-mono mb-2" style={{ color: 'hsl(0 0% 40%)' }}>
                  Same zone + interval + instrument — only one can occupy this slot per bed.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {conflicts.map(c => (
                    <button
                      key={c.id}
                      className="px-2 py-1 rounded-lg text-[10px] font-mono"
                      style={{
                        background: 'hsl(0 0% 8%)',
                        border: '1px solid hsl(0 0% 14%)',
                        color: 'hsl(0 0% 60%)',
                      }}
                      onClick={() => {
                        setSelectedCrop(c);
                        setQuery(c.common_name || c.name);
                      }}
                    >
                      {c.common_name || c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Footer */}
            <div
              className="rounded-xl p-3 grid grid-cols-2 gap-2"
              style={{
                background: 'hsl(0 0% 4%)',
                border: '1px solid hsl(0 0% 10%)',
              }}
            >
              {selectedCrop.spacing_inches && (
                <MetaItem label="SPACING" value={`${selectedCrop.spacing_inches}"`} />
              )}
              {selectedCrop.planting_season && selectedCrop.planting_season.length > 0 && (
                <MetaItem label="SEASON" value={selectedCrop.planting_season.join(', ')} />
              )}
              {selectedCrop.focus_tag && (
                <MetaItem label="FOCUS TAG" value={selectedCrop.focus_tag.replace('_', ' ')} />
              )}
              {selectedCrop.cultural_role && (
                <MetaItem label="CULTURAL ROLE" value={selectedCrop.cultural_role} />
              )}
              {selectedCrop.soil_protocol_focus && (
                <MetaItem label="SOIL PROTOCOL" value={selectedCrop.soil_protocol_focus} />
              )}
              {selectedCrop.guild_role && (
                <MetaItem label="GUILD ROLE" value={selectedCrop.guild_role} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
