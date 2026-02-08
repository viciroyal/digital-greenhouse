import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, 
  Calendar, 
  Moon, 
  Heart, 
  Beaker, 
  FileDown,
  Mountain,
  Droplet,
  Flame,
  Crown,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewLogEntry from './NewLogEntry';
import SovereigntyMap from './SovereigntyMap';

// Zone type for entries
type ZoneKey = 'root' | 'flow' | 'fire' | 'gold' | 'seed';

interface LogEntry {
  id: string;
  created_at: string;
  zone: ZoneKey;
  moon_phase: string;
  somatic_state: string;
  science_value?: number;
  reflection: string;
  photo_url?: string;
}

// Storage keys for persistence
const STORAGE_KEY_ENTRIES = 'pharmer-stewards-log-entries';

// Default entries for first-time users
const defaultEntries: LogEntry[] = [
  {
    id: '1',
    created_at: '2026-02-08T10:00:00Z',
    zone: 'root',
    moon_phase: 'Waning Gibbous',
    somatic_state: 'grounded',
    science_value: 4,
    reflection: 'The broadfork sank easily into the first six inches. I felt the soil crack like old bread. The earth accepted the tool.',
  },
  {
    id: '2',
    created_at: '2026-02-05T14:30:00Z',
    zone: 'flow',
    moon_phase: 'Full Moon',
    somatic_state: 'fluid',
    science_value: 72,
    reflection: 'Applied rock dust today. The water settled slowly into the soil — no runoff. The magnetism is improving.',
  },
  {
    id: '3',
    created_at: '2026-02-01T08:15:00Z',
    zone: 'fire',
    moon_phase: 'Waxing Crescent',
    somatic_state: 'deep',
    science_value: 3,
    reflection: 'First Agnihotra ceremony at sunrise. The smoke rose straight and true. The metabolic fire feels clean.',
  },
  {
    id: '4',
    created_at: '2026-01-28T16:00:00Z',
    zone: 'gold',
    moon_phase: 'New Moon',
    somatic_state: 'sweet',
    science_value: 14.2,
    reflection: 'The kale leaf had an unexpectedly sweet finish. Refractometer confirmed 14 Brix — above the pest resistance threshold.',
  },
];

// Load entries from localStorage
const loadEntries = (): LogEntry[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ENTRIES);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load entries:', error);
  }
  return defaultEntries;
};

// Save entries to localStorage
const saveEntries = (entries: LogEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save entries:', error);
  }
};

// Zone metadata
const zoneMap: Record<ZoneKey, { label: string; sublabel: string; icon: typeof Mountain; color: string; scienceLabel: string; scienceUnit: string }> = {
  root: { label: 'ROOT', sublabel: 'Muscogee', icon: Mountain, color: 'hsl(0 70% 45%)', scienceLabel: 'Compaction', scienceUnit: '/10' },
  flow: { label: 'FLOW', sublabel: 'Olmec', icon: Droplet, color: 'hsl(30 50% 40%)', scienceLabel: 'Moisture', scienceUnit: '%' },
  fire: { label: 'FIRE', sublabel: 'Vedic', icon: Flame, color: 'hsl(15 100% 50%)', scienceLabel: 'Clarity', scienceUnit: '/10' },
  gold: { label: 'GOLD', sublabel: 'Kemit', icon: Crown, color: 'hsl(51 100% 50%)', scienceLabel: 'Brix', scienceUnit: '°' },
  seed: { label: 'SEED', sublabel: 'Maroon', icon: Sparkles, color: 'hsl(280 60% 65%)', scienceLabel: 'Viability', scienceUnit: '%' },
};

// Somatic state labels
const somaticLabels: Record<string, string> = {
  // Root
  iron: 'Iron',
  grounded: 'Grounded',
  bent: 'Bent',
  strained: 'Strained',
  // Flow
  fluid: 'Fluid',
  balanced: 'Balanced',
  parched: 'Parched',
  dry: 'Dry',
  // Fire
  bellows: 'Bellows',
  deep: 'Deep',
  shallow: 'Shallow',
  restricted: 'Restricted',
  // Gold
  sweet: 'Sweet',
  bland: 'Bland',
  bitter: 'Bitter',
  // Seed
  sovereign: 'Sovereign',
  connected: 'Connected',
  seeking: 'Seeking',
  untethered: 'Untethered',
};

interface StewardsLogProps {
  userId?: string;
  userName?: string;
}

/**
 * THE STEWARD'S LOG - The Harmonized Journal
 * 
 * Context-aware journaling with zone-specific prompts.
 */
const StewardsLog = ({ userId, userName = 'Steward' }: StewardsLogProps) => {
  const [entries, setEntries] = useState<LogEntry[]>(() => loadEntries());
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  // Persist entries to localStorage whenever they change
  useEffect(() => {
    saveEntries(entries);
  }, [entries]);
  const [filterZone, setFilterZone] = useState<ZoneKey | null>(null);

  // Calculate zone counts for Sovereignty Map
  const zoneCounts = entries.reduce((acc, entry) => {
    acc[entry.zone] = (acc[entry.zone] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter entries
  const filteredEntries = filterZone 
    ? entries.filter(e => e.zone === filterZone)
    : entries;

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate scientific manuscript export
  const handleExport = () => {
    const year = new Date().getFullYear();
    
    const content = entries.map((entry, idx) => {
      const zone = zoneMap[entry.zone];
      return `
══════════════════════════════════════════════════════════════
OBSERVATION #${entries.length - idx}
══════════════════════════════════════════════════════════════

DATE:           ${formatDate(entry.created_at)}
LUNAR PHASE:    ${entry.moon_phase}
FOCUS ZONE:     ${zone.label} (${zone.sublabel})

─────────────────────────────────────────────────────────────
METHODOLOGY
─────────────────────────────────────────────────────────────

Somatic State:  ${somaticLabels[entry.somatic_state] || entry.somatic_state}
${entry.science_value !== undefined ? `${zone.scienceLabel}:    ${entry.science_value}${zone.scienceUnit}` : ''}

─────────────────────────────────────────────────────────────
OBSERVATION
─────────────────────────────────────────────────────────────

${entry.reflection}

─────────────────────────────────────────────────────────────
CONCLUSION
─────────────────────────────────────────────────────────────

[To be synthesized at season's end]

`;
    }).join('\n');

    const fullDocument = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          THE ${year} ALMANAC OF ${userName.toUpperCase()}            
║                                                              ║
║              A Scientific Field Journal                      ║
║         of Sovereign Agricultural Practice                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

"Listen when the soil whispers. Act when the stars signal."

═══════════════════════════════════════════════════════════════
ABSTRACT
═══════════════════════════════════════════════════════════════

This manuscript documents ${entries.length} field observations
conducted during the ${year} growing season. Each observation
follows the Five-Zone Framework: Root (Structure), Flow 
(Hydration), Fire (Atmosphere), Gold (Nutrition), and Seed 
(Sovereignty).

Observations are recorded with lunar phase correlation,
somatic state assessment, quantitative measurements, and
qualitative reflection.

═══════════════════════════════════════════════════════════════
OBSERVATIONS
═══════════════════════════════════════════════════════════════

${content}

═══════════════════════════════════════════════════════════════
APPENDIX: ZONE SUMMARY
═══════════════════════════════════════════════════════════════

ROOT (Muscogee):    ${zoneCounts.root || 0} observations
FLOW (Olmec):       ${zoneCounts.flow || 0} observations
FIRE (Vedic):       ${zoneCounts.fire || 0} observations
GOLD (Kemit):       ${zoneCounts.gold || 0} observations
SEED (Maroon):      ${zoneCounts.seed || 0} observations

───────────────────────────────────────────────────────────────

Exported: ${new Date().toLocaleString()}
The Living Almanac • Sovereign Agriculture

"The soil has a memory. Every action echoes through seven generations."
`;

    // Create and download file
    const blob = new Blob([fullDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `almanac-of-${userName.toLowerCase().replace(/\s+/g, '-')}-${year}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewEntry = (entry: {
    zone: ZoneKey;
    moon_phase: string;
    somatic_state: string;
    science_value?: number;
    reflection: string;
    photo_url?: string;
  }) => {
    const newEntry: LogEntry = {
      ...entry,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setEntries([newEntry, ...entries]);
    setIsNewEntryOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pb-32">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
          style={{
            background: 'hsl(140 30% 12%)',
            border: '1px solid hsl(140 50% 35%)',
          }}
        >
          <PenTool className="w-4 h-4" style={{ color: 'hsl(140 60% 60%)' }} />
          <span
            className="text-xs font-mono tracking-widest"
            style={{ color: 'hsl(140 50% 65%)' }}
          >
            WRITE MODE
          </span>
        </div>

        <h1
          className="text-3xl md:text-4xl mb-2 tracking-[0.15em]"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            color: 'hsl(140 50% 60%)',
            textShadow: '0 0 30px hsl(140 60% 35% / 0.4)',
          }}
        >
          THE STEWARD'S LOG
        </h1>
        <p
          className="font-mono text-sm italic"
          style={{ color: 'hsl(40 40% 55%)' }}
        >
          "Record. Reflect. Remember."
        </p>
      </motion.div>

      {/* Sovereignty Map */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <SovereigntyMap counts={zoneCounts} />
      </motion.div>

      {/* Action Bar */}
      <motion.div
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1.5 rounded-full text-xs font-mono transition-all"
            style={{
              background: !filterZone ? 'hsl(140 40% 25%)' : 'hsl(0 0% 12%)',
              border: `1px solid ${!filterZone ? 'hsl(140 50% 45%)' : 'hsl(0 0% 25%)'}`,
              color: !filterZone ? 'hsl(140 60% 70%)' : 'hsl(0 0% 60%)',
            }}
            onClick={() => setFilterZone(null)}
          >
            All
          </button>
          {(Object.entries(zoneMap) as [ZoneKey, typeof zoneMap[ZoneKey]][]).map(([key, zone]) => (
            <button
              key={key}
              className="px-3 py-1.5 rounded-full text-xs font-mono transition-all"
              style={{
                background: filterZone === key ? `${zone.color}30` : 'hsl(0 0% 12%)',
                border: `1px solid ${filterZone === key ? zone.color : 'hsl(0 0% 25%)'}`,
                color: filterZone === key ? zone.color : 'hsl(0 0% 60%)',
              }}
              onClick={() => setFilterZone(key)}
            >
              {zone.label}
            </button>
          ))}
        </div>

        {/* Export Button */}
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs"
          style={{
            background: 'hsl(40 30% 12%)',
            border: '1px solid hsl(40 40% 30%)',
            color: 'hsl(40 50% 65%)',
          }}
          onClick={handleExport}
        >
          <FileDown className="w-3 h-3 mr-2" />
          Print My Almanac
        </Button>
      </motion.div>

      {/* Timeline Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <PenTool className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'hsl(140 40% 50%)' }} />
            <p className="font-mono" style={{ color: 'hsl(40 40% 50%)' }}>
              {filterZone ? `No ${zoneMap[filterZone].label} observations yet.` : 'No observations yet.'}
            </p>
            <p className="text-sm font-mono mt-2" style={{ color: 'hsl(40 30% 45%)' }}>
              Tap the pen to begin your log.
            </p>
          </motion.div>
        ) : (
          filteredEntries.map((entry, index) => {
            const zone = zoneMap[entry.zone];
            const Icon = zone.icon;

            return (
              <motion.div
                key={entry.id}
                className="p-5 rounded-xl"
                style={{
                  background: 'hsl(0 0% 6%)',
                  border: `1px solid ${zone.color}30`,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                {/* Entry Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: `${zone.color}20`,
                        border: `2px solid ${zone.color}`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: zone.color }} />
                    </div>
                    <div>
                      <p
                        className="text-sm font-mono"
                        style={{ color: 'hsl(40 50% 70%)' }}
                      >
                        {formatDate(entry.created_at)}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-xs font-mono" style={{ color: 'hsl(200 50% 60%)' }}>
                          <Moon className="w-3 h-3" />
                          {entry.moon_phase}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-mono" style={{ color: zone.color }}>
                          <Heart className="w-3 h-3" />
                          {somaticLabels[entry.somatic_state] || entry.somatic_state}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className="px-2 py-1 rounded-full text-[10px] font-mono tracking-wider"
                    style={{
                      background: `${zone.color}15`,
                      border: `1px solid ${zone.color}40`,
                      color: zone.color,
                    }}
                  >
                    {zone.label}
                  </span>
                </div>

                {/* Science Data */}
                {entry.science_value !== undefined && (
                  <div className="flex flex-wrap gap-3 mb-3 pb-3 border-b" style={{ borderColor: 'hsl(0 0% 15%)' }}>
                    <div 
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono" 
                      style={{ background: `${zone.color}15`, color: zone.color }}
                    >
                      <Beaker className="w-3 h-3" />
                      {zone.scienceLabel}: {entry.science_value}{zone.scienceUnit}
                    </div>
                  </div>
                )}

                {/* Reflection */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'hsl(40 40% 70%)' }}
                >
                  {entry.reflection}
                </p>

                {/* Photo thumbnail */}
                {entry.photo_url && (
                  <div className="mt-3">
                    <img 
                      src={entry.photo_url} 
                      alt="Field evidence" 
                      className="w-full max-w-xs rounded-lg border"
                      style={{ borderColor: 'hsl(0 0% 20%)' }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Floating New Entry Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50"
        style={{
          background: 'linear-gradient(135deg, hsl(140 50% 35%), hsl(140 40% 25%))',
          border: '2px solid hsl(140 60% 50%)',
          boxShadow: '0 0 30px hsl(140 60% 40% / 0.4)',
        }}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsNewEntryOpen(true)}
      >
        <PenTool className="w-6 h-6" style={{ color: 'hsl(0 0% 95%)' }} />
      </motion.button>

      {/* New Entry Modal */}
      <AnimatePresence>
        {isNewEntryOpen && (
          <NewLogEntry
            onClose={() => setIsNewEntryOpen(false)}
            onSubmit={handleNewEntry}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StewardsLog;
