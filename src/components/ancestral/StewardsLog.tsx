import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, 
  Calendar, 
  Moon, 
  Heart, 
  Beaker, 
  Camera, 
  FileDown,
  Leaf,
  Home,
  Shirt,
  Utensils,
  Sparkles,
  ChevronRight,
  Plus,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import NewLogEntry from './NewLogEntry';
import SovereigntyMap from './SovereigntyMap';

interface LogEntry {
  id: string;
  created_at: string;
  moon_phase: string;
  somatic_state: string;
  brix_score?: number;
  soil_temp?: number;
  ph_level?: number;
  reflection: string;
  photo_url?: string;
  module_type: 'shelter' | 'food' | 'clothing' | 'nutrition' | 'seed';
}

// Mock data for demonstration (will be replaced with Supabase data)
const mockEntries: LogEntry[] = [
  {
    id: '1',
    created_at: '2026-02-08T10:00:00Z',
    moon_phase: 'Waning Gibbous',
    somatic_state: 'Grounded',
    brix_score: 14,
    soil_temp: 68,
    reflection: 'The bamboo cuttings are taking root. I can feel the soil warming as spring approaches.',
    module_type: 'shelter',
  },
  {
    id: '2',
    created_at: '2026-02-05T14:30:00Z',
    moon_phase: 'Full Moon',
    somatic_state: 'Flowing',
    soil_temp: 65,
    ph_level: 6.8,
    reflection: 'Applied rock dust today. The paramagnetic reading jumped from 120 to 280 CGS.',
    module_type: 'food',
  },
  {
    id: '3',
    created_at: '2026-02-01T08:15:00Z',
    moon_phase: 'Waxing Crescent',
    somatic_state: 'Anxious',
    reflection: 'First time building a copper antenna. The spiral felt alive in my hands.',
    module_type: 'clothing',
  },
];

// Module type metadata
const moduleTypeMap: Record<string, { label: string; icon: typeof Leaf; color: string }> = {
  shelter: { label: 'Shelter', icon: Home, color: 'hsl(0 70% 45%)' },
  food: { label: 'Food', icon: Utensils, color: 'hsl(30 50% 40%)' },
  clothing: { label: 'Clothing', icon: Shirt, color: 'hsl(15 100% 50%)' },
  nutrition: { label: 'Nutrition', icon: Beaker, color: 'hsl(51 100% 50%)' },
  seed: { label: 'Seed', icon: Sparkles, color: 'hsl(0 0% 85%)' },
};

interface StewardsLogProps {
  userId?: string;
}

/**
 * THE STEWARD'S LOG
 * 
 * A personal journal system for recording observations, data, and reflections.
 * Replaces gamification with meaningful documentation.
 */
const StewardsLog = ({ userId }: StewardsLogProps) => {
  const [entries, setEntries] = useState<LogEntry[]>(mockEntries);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate module counts for Sovereignty Map
  const moduleCounts = entries.reduce((acc, entry) => {
    acc[entry.module_type] = (acc[entry.module_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter entries
  const filteredEntries = filterType 
    ? entries.filter(e => e.module_type === filterType)
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

  // Generate PDF export
  const handleExport = () => {
    // Create a simple text-based export for now
    const content = entries.map(entry => {
      const moduleInfo = moduleTypeMap[entry.module_type];
      return `
═══════════════════════════════════════
${formatDate(entry.created_at)}
Moon: ${entry.moon_phase} | State: ${entry.somatic_state}
Category: ${moduleInfo.label}
───────────────────────────────────────
${entry.brix_score ? `Brix: ${entry.brix_score}° | ` : ''}${entry.soil_temp ? `Soil Temp: ${entry.soil_temp}°F | ` : ''}${entry.ph_level ? `pH: ${entry.ph_level}` : ''}

REFLECTION:
${entry.reflection}
`;
    }).join('\n');

    const fullDocument = `
╔══════════════════════════════════════════╗
║        THE STEWARD'S LOG                ║
║        2026 Field Season                ║
╚══════════════════════════════════════════╝

"Listen when the soil whispers. Act when the stars signal."

Total Entries: ${entries.length}
───────────────────────────────────────────

${content}

───────────────────────────────────────────
Exported: ${new Date().toLocaleString()}
The Living Almanac • Sovereign Agriculture
`;

    // Create and download file
    const blob = new Blob([fullDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stewards-log-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewEntry = (entry: Omit<LogEntry, 'id' | 'created_at'>) => {
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
        <SovereigntyMap counts={moduleCounts} />
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
              background: !filterType ? 'hsl(140 40% 25%)' : 'hsl(0 0% 12%)',
              border: `1px solid ${!filterType ? 'hsl(140 50% 45%)' : 'hsl(0 0% 25%)'}`,
              color: !filterType ? 'hsl(140 60% 70%)' : 'hsl(0 0% 60%)',
            }}
            onClick={() => setFilterType(null)}
          >
            All
          </button>
          {Object.entries(moduleTypeMap).map(([key, { label, color }]) => (
            <button
              key={key}
              className="px-3 py-1.5 rounded-full text-xs font-mono transition-all"
              style={{
                background: filterType === key ? `${color}30` : 'hsl(0 0% 12%)',
                border: `1px solid ${filterType === key ? color : 'hsl(0 0% 25%)'}`,
                color: filterType === key ? color : 'hsl(0 0% 60%)',
              }}
              onClick={() => setFilterType(key)}
            >
              {label}
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
          Export Log
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
              {filterType ? `No ${moduleTypeMap[filterType].label} entries yet.` : 'No entries yet.'}
            </p>
            <p className="text-sm font-mono mt-2" style={{ color: 'hsl(40 30% 45%)' }}>
              Tap the pen to begin your log.
            </p>
          </motion.div>
        ) : (
          filteredEntries.map((entry, index) => {
            const moduleInfo = moduleTypeMap[entry.module_type];
            const Icon = moduleInfo.icon;

            return (
              <motion.div
                key={entry.id}
                className="p-5 rounded-xl"
                style={{
                  background: 'hsl(0 0% 6%)',
                  border: `1px solid ${moduleInfo.color}30`,
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
                        background: `${moduleInfo.color}20`,
                        border: `2px solid ${moduleInfo.color}`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: moduleInfo.color }} />
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
                        <span className="flex items-center gap-1 text-xs font-mono" style={{ color: 'hsl(280 50% 60%)' }}>
                          <Heart className="w-3 h-3" />
                          {entry.somatic_state}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className="px-2 py-1 rounded-full text-[10px] font-mono tracking-wider"
                    style={{
                      background: `${moduleInfo.color}15`,
                      border: `1px solid ${moduleInfo.color}40`,
                      color: moduleInfo.color,
                    }}
                  >
                    {moduleInfo.label.toUpperCase()}
                  </span>
                </div>

                {/* Data Row */}
                {(entry.brix_score || entry.soil_temp || entry.ph_level) && (
                  <div className="flex flex-wrap gap-3 mb-3 pb-3 border-b" style={{ borderColor: 'hsl(0 0% 15%)' }}>
                    {entry.brix_score && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono" style={{ background: 'hsl(51 30% 15%)', color: 'hsl(51 70% 60%)' }}>
                        <Beaker className="w-3 h-3" />
                        Brix: {entry.brix_score}°
                      </div>
                    )}
                    {entry.soil_temp && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono" style={{ background: 'hsl(15 30% 15%)', color: 'hsl(15 70% 60%)' }}>
                        Soil: {entry.soil_temp}°F
                      </div>
                    )}
                    {entry.ph_level && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono" style={{ background: 'hsl(140 30% 15%)', color: 'hsl(140 60% 55%)' }}>
                        pH: {entry.ph_level}
                      </div>
                    )}
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
