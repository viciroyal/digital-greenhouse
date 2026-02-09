import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Activity, 
  Award,
  Compass,
  Droplet,
  Sprout,
  Sparkles,
  User,
} from 'lucide-react';

// Storage keys matching the Almanac
const STORAGE_KEY_BRIX_LOGS = 'pharmer-brix-logs';
const STORAGE_KEY_BED_RESETS = 'pharmer-bed-reset-count';

interface BrixLog {
  id: string;
  date: string;
  value: number;
  status: 'low' | 'optimal';
}

// Current movement based on season
const getCurrentMovement = () => {
  const month = new Date().getMonth();
  if (month >= 11 || month <= 1) return { name: 'The Cool Octave', hz: 396, color: 'hsl(0 60% 50%)' };
  if (month >= 2 && month <= 4) return { name: 'The Rising Sap', hz: 528, color: 'hsl(120 50% 45%)' };
  if (month >= 5 && month <= 7) return { name: 'The Solar Peak', hz: 639, color: 'hsl(51 80% 50%)' };
  return { name: 'The Harvest Moon', hz: 741, color: 'hsl(30 60% 50%)' };
};

// Farm Team modes
const farmTeamModes = [
  { 
    id: 'rocky', 
    name: 'Rocky', 
    emoji: '🪨', 
    title: 'The Builder',
    filter: 'Infrastructure & Tools',
    color: 'hsl(30 40% 45%)',
    description: 'Focus on beds, paths, and structures',
  },
  { 
    id: 'river', 
    name: 'River', 
    emoji: '💧', 
    title: 'The Rower',
    filter: 'Irrigation & Foliar',
    color: 'hsl(195 60% 50%)',
    description: 'Focus on water and feeding schedules',
  },
  { 
    id: 'sunny', 
    name: 'Sunny', 
    emoji: '☀️', 
    title: 'The Spark',
    filter: 'Planting & Seeding',
    color: 'hsl(45 90% 55%)',
    description: 'Focus on what to plant and when',
  },
  { 
    id: 'spirit', 
    name: 'Spirit', 
    emoji: '🕊️', 
    title: 'The Vision',
    filter: 'Reflection & Journal',
    color: 'hsl(270 50% 60%)',
    description: 'Open the Ancestral Path for reflection',
  },
];

interface StewardDashboardProps {
  userName?: string;
  userTitle?: string;
  onModeSelect?: (mode: string) => void;
}

/**
 * STEWARD DASHBOARD
 * 
 * Dynamic profile that connects to Farm Data:
 * - User info with current movement/frequency
 * - Gamified stats from Field Almanac
 * - Farm Team mode selector
 */
const StewardDashboard = ({ 
  userName = 'Steward', 
  userTitle = 'Seed Tender',
  onModeSelect,
}: StewardDashboardProps) => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [songsSung, setSongsSung] = useState(0);
  const [weeklyBrix, setWeeklyBrix] = useState<number[]>([]);
  
  const movement = getCurrentMovement();

  // Load stats from localStorage (synced with Almanac)
  useEffect(() => {
    // Load bed reset count
    const resets = localStorage.getItem(STORAGE_KEY_BED_RESETS);
    if (resets) {
      setSongsSung(parseInt(resets, 10) || 0);
    }

    // Load Brix logs and filter for this week
    try {
      const logs = localStorage.getItem(STORAGE_KEY_BRIX_LOGS);
      if (logs) {
        const parsed: BrixLog[] = JSON.parse(logs);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weekLogs = parsed.filter(log => new Date(log.date) >= oneWeekAgo);
        setWeeklyBrix(weekLogs.map(l => l.value));
      }
    } catch (error) {
      console.error('Failed to load brix logs:', error);
    }

    // Listen for updates from Almanac
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_BED_RESETS) {
        setSongsSung(parseInt(e.newValue || '0', 10));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Calculate resonance score (average Brix)
  const resonanceScore = weeklyBrix.length > 0 
    ? (weeklyBrix.reduce((a, b) => a + b, 0) / weeklyBrix.length).toFixed(1)
    : '--';
  const isHighFidelity = weeklyBrix.length > 0 && parseFloat(resonanceScore) >= 12;

  const handleModeClick = (modeId: string) => {
    setSelectedMode(modeId);
    onModeSelect?.(modeId);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Profile Header */}
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${movement.color}20, hsl(0 0% 8%))`,
          border: `2px solid ${movement.color}50`,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-5">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <motion.div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(145deg, ${movement.color}30, ${movement.color}15)`,
                border: `2px solid ${movement.color}`,
              }}
              animate={{
                boxShadow: [
                  `0 0 15px ${movement.color}40`,
                  `0 0 30px ${movement.color}60`,
                  `0 0 15px ${movement.color}40`,
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <User className="w-8 h-8" style={{ color: movement.color }} />
            </motion.div>

            <div className="flex-1">
              <h1
                className="text-2xl tracking-wider"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(40 60% 80%)',
                }}
              >
                {userName}
              </h1>
              <p
                className="text-sm font-mono tracking-wider"
                style={{ color: movement.color }}
              >
                {userTitle}
              </p>
            </div>
          </div>

          {/* Current Movement */}
          <div
            className="mt-4 p-3 rounded-xl flex items-center justify-between"
            style={{
              background: `${movement.color}15`,
              border: `1px solid ${movement.color}40`,
            }}
          >
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4" style={{ color: movement.color }} />
              <span
                className="text-xs font-mono tracking-wider"
                style={{ color: 'hsl(0 0% 65%)' }}
              >
                2026 MOVEMENT
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-mono"
                style={{ color: movement.color }}
              >
                {movement.name}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-mono"
                style={{
                  background: movement.color,
                  color: 'hsl(0 0% 10%)',
                }}
              >
                {movement.hz}Hz
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gamified Stats */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Songs Sung */}
        <div
          className="p-4 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, hsl(270 30% 15%), hsl(270 25% 10%))',
            border: '2px solid hsl(270 50% 40%)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-4 h-4" style={{ color: 'hsl(270 60% 65%)' }} />
            <span
              className="text-[10px] font-mono tracking-wider"
              style={{ color: 'hsl(270 40% 60%)' }}
            >
              SONGS SUNG
            </span>
          </div>
          <motion.p
            className="text-3xl mb-1"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(270 60% 70%)',
              textShadow: '0 0 20px hsl(270 60% 50% / 0.5)',
            }}
            key={songsSung}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
          >
            {songsSung}
          </motion.p>
          <p
            className="text-[10px] font-mono"
            style={{ color: 'hsl(0 0% 50%)' }}
          >
            Bed resets completed
          </p>
        </div>

        {/* Resonance Score */}
        <div
          className="p-4 rounded-xl"
          style={{
            background: isHighFidelity 
              ? 'linear-gradient(135deg, hsl(120 25% 15%), hsl(120 20% 10%))'
              : 'linear-gradient(135deg, hsl(195 25% 15%), hsl(195 20% 10%))',
            border: `2px solid ${isHighFidelity ? 'hsl(120 50% 45%)' : 'hsl(195 50% 45%)'}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4" style={{ color: isHighFidelity ? 'hsl(120 60% 55%)' : 'hsl(195 60% 60%)' }} />
            <span
              className="text-[10px] font-mono tracking-wider"
              style={{ color: isHighFidelity ? 'hsl(120 40% 60%)' : 'hsl(195 40% 60%)' }}
            >
              RESONANCE
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <p
              className="text-3xl"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: isHighFidelity ? 'hsl(120 60% 60%)' : 'hsl(195 60% 65%)',
                textShadow: `0 0 20px ${isHighFidelity ? 'hsl(120 60% 40% / 0.5)' : 'hsl(195 60% 40% / 0.5)'}`,
              }}
            >
              {resonanceScore}
            </p>
            <span
              className="text-sm font-mono"
              style={{ color: 'hsl(0 0% 50%)' }}
            >
              Brix
            </span>
          </div>
          {isHighFidelity && (
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Award className="w-3 h-3" style={{ color: 'hsl(51 90% 55%)' }} />
              <span
                className="text-[10px] font-mono tracking-wider"
                style={{ color: 'hsl(51 80% 60%)' }}
              >
                HIGH FIDELITY
              </span>
            </motion.div>
          )}
          {!isHighFidelity && weeklyBrix.length > 0 && (
            <p
              className="text-[10px] font-mono"
              style={{ color: 'hsl(0 0% 50%)' }}
            >
              Target: 12+ Brix
            </p>
          )}
          {weeklyBrix.length === 0 && (
            <p
              className="text-[10px] font-mono"
              style={{ color: 'hsl(0 0% 50%)' }}
            >
              No readings this week
            </p>
          )}
        </div>
      </motion.div>

      {/* Farm Team Mode Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3
          className="text-sm font-mono tracking-wider mb-3 flex items-center gap-2"
          style={{ color: 'hsl(40 50% 55%)' }}
        >
          <Compass className="w-4 h-4" />
          SELECT YOUR MODE
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {farmTeamModes.map((mode, index) => (
            <motion.button
              key={mode.id}
              className="p-4 rounded-xl text-left transition-all"
              style={{
                background: selectedMode === mode.id 
                  ? `${mode.color}20`
                  : 'hsl(0 0% 8%)',
                border: `2px solid ${selectedMode === mode.id ? mode.color : 'hsl(0 0% 20%)'}`,
                boxShadow: selectedMode === mode.id 
                  ? `0 0 25px ${mode.color}30`
                  : 'none',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeClick(mode.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{mode.emoji}</span>
                <div>
                  <p
                    className="text-sm font-mono tracking-wider"
                    style={{ color: selectedMode === mode.id ? mode.color : 'hsl(40 50% 70%)' }}
                  >
                    {mode.name}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: 'hsl(0 0% 50%)' }}
                  >
                    {mode.title}
                  </p>
                </div>
              </div>
              <p
                className="text-xs font-mono"
                style={{ color: selectedMode === mode.id ? mode.color : 'hsl(0 0% 45%)' }}
              >
                {mode.filter}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Mode Description */}
        <AnimatePresence>
          {selectedMode && (
            <motion.div
              className="mt-4 p-3 rounded-xl"
              style={{
                background: `${farmTeamModes.find(m => m.id === selectedMode)?.color}15`,
                border: `1px solid ${farmTeamModes.find(m => m.id === selectedMode)?.color}40`,
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p
                className="text-sm font-mono"
                style={{ color: 'hsl(40 50% 70%)' }}
              >
                {farmTeamModes.find(m => m.id === selectedMode)?.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StewardDashboard;
