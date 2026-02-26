import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Seed Growth Indicator
 * A living progress tracker that evolves from seed → sprout → sapling → tree
 * as the user explores different pages and features of the site.
 */

const DISCOVERY_PAGES: Record<string, { label: string; emoji: string }> = {
  '/': { label: 'First Garden', emoji: '🌱' },
  '/stage': { label: 'The Stage', emoji: '🎭' },
  '/crop-oracle': { label: 'Crop Oracle', emoji: '🔮' },
  '/crop-library': { label: 'Crop Library', emoji: '📚' },
  '/weekly-tasks': { label: 'Weekly Tasks', emoji: '📋' },
  '/profile': { label: 'Profile', emoji: '👤' },
  '/user-guide': { label: 'User Guide', emoji: '📖' },
};

const TOTAL_DISCOVERIES = Object.keys(DISCOVERY_PAGES).length;

const STORAGE_KEY = 'pharmboi-discoveries';

function getDiscoveries(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDiscoveries(pages: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
}

// Growth stages
function getStage(progress: number): { name: string; color: string } {
  if (progress < 15) return { name: 'Seed', color: 'hsl(30 50% 35%)' };
  if (progress < 30) return { name: 'Germinating', color: 'hsl(60 40% 40%)' };
  if (progress < 50) return { name: 'Sprout', color: 'hsl(100 45% 40%)' };
  if (progress < 70) return { name: 'Sapling', color: 'hsl(130 50% 40%)' };
  if (progress < 90) return { name: 'Growing', color: 'hsl(140 55% 38%)' };
  return { name: 'Flourishing', color: 'hsl(140 60% 45%)' };
}

const SeedGrowthIndicator = () => {
  const location = useLocation();
  const [discoveries, setDiscoveries] = useState<string[]>(getDiscoveries);
  const [showPanel, setShowPanel] = useState(false);
  const [justDiscovered, setJustDiscovered] = useState<string | null>(null);

  const progress = Math.round((discoveries.length / TOTAL_DISCOVERIES) * 100);
  const stage = getStage(progress);

  // Track page visits
  useEffect(() => {
    const path = location.pathname;
    const matchedKey = Object.keys(DISCOVERY_PAGES).find(
      (k) => k === path || (k !== '/' && path.startsWith(k))
    );
    if (matchedKey && !discoveries.includes(matchedKey)) {
      const next = [...discoveries, matchedKey];
      setDiscoveries(next);
      saveDiscoveries(next);
      setJustDiscovered(matchedKey);
      setTimeout(() => setJustDiscovered(null), 3000);
    }
  }, [location.pathname]);

  // Plant height based on progress (0 = seed, 100 = full tree)
  const stemHeight = useMemo(() => Math.max(0, (progress / 100) * 55), [progress]);
  const leafCount = useMemo(() => Math.floor(progress / 20), [progress]);
  const hasFlower = progress >= 90;

  return (
    <>
      {/* Fixed indicator button */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-1 cursor-pointer group"
        onClick={() => setShowPanel(!showPanel)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', damping: 12 }}
        aria-label="Growth progress"
        style={{ outline: 'none', border: 'none', background: 'none' }}
      >
        {/* Plant SVG */}
        <motion.div
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'hsl(0 0% 6% / 0.9)',
            border: `2px solid ${stage.color}`,
            backdropFilter: 'blur(8px)',
          }}
          animate={{
            boxShadow: [
              `0 0 8px ${stage.color.replace(')', ' / 0.2)')}`,
              `0 0 20px ${stage.color.replace(')', ' / 0.45)')}`,
              `0 0 8px ${stage.color.replace(')', ' / 0.2)')}`,
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.1 }}
        >
          <svg viewBox="0 0 60 80" className="w-10 h-10" aria-hidden="true">
            {/* Soil */}
            <ellipse cx="30" cy="72" rx="22" ry="5" fill="hsl(20 40% 18%)" />

            {/* Stem */}
            {progress > 10 && (
              <motion.line
                x1="30" y1="72" x2="30" y2={72 - stemHeight}
                stroke={stage.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            )}

            {/* Seed (always visible when small) */}
            {progress < 30 && (
              <motion.ellipse
                cx="30" cy="68" rx="5" ry="3.5"
                fill="hsl(30 55% 30%)"
                stroke="hsl(30 40% 45%)"
                strokeWidth="0.5"
                animate={progress > 10 ? { ry: [3.5, 2.5], opacity: [1, 0.5] } : {}}
                transition={{ duration: 1 }}
              />
            )}

            {/* Leaves */}
            {leafCount >= 1 && (
              <motion.path
                d="M30,55 Q20,48 18,42 Q24,46 30,52"
                fill={stage.color}
                opacity={0.85}
                initial={{ scale: 0, originX: '30px', originY: '55px' }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              />
            )}
            {leafCount >= 2 && (
              <motion.path
                d="M30,48 Q40,40 44,35 Q38,40 30,45"
                fill={stage.color}
                opacity={0.8}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              />
            )}
            {leafCount >= 3 && (
              <motion.path
                d="M30,38 Q18,30 15,24 Q22,30 30,35"
                fill="hsl(130 55% 45%)"
                opacity={0.75}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
              />
            )}
            {leafCount >= 4 && (
              <motion.path
                d="M30,30 Q42,22 46,16 Q38,24 30,28"
                fill="hsl(140 55% 48%)"
                opacity={0.8}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: 'spring' }}
              />
            )}

            {/* Flower / fruit */}
            {hasFlower && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 8, delay: 1 }}
              >
                <circle cx="30" cy={72 - stemHeight - 4} r="5" fill="hsl(45 80% 55%)" opacity={0.9} />
                <circle cx="30" cy={72 - stemHeight - 4} r="2.5" fill="hsl(45 90% 70%)" />
                {/* Glow */}
                <motion.circle
                  cx="30" cy={72 - stemHeight - 4} r="7"
                  fill="none"
                  stroke="hsl(45 80% 55% / 0.4)"
                  strokeWidth="1"
                  animate={{ r: [7, 10, 7], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.g>
            )}

            {/* Water droplets animation when growing */}
            {progress > 5 && progress < 100 && (
              <motion.circle
                cx="22" cy="30"
                r="1.5"
                fill="hsl(200 70% 65% / 0.6)"
                animate={{ y: [0, 40], opacity: [0.7, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 2, repeatDelay: 4 }}
              />
            )}
          </svg>
        </motion.div>

        {/* Percentage label */}
        <span
          className="text-[9px] font-mono tracking-wider"
          style={{ color: stage.color }}
        >
          {progress}%
        </span>
      </motion.button>

      {/* Discovery notification toast */}
      <AnimatePresence>
        {justDiscovered && DISCOVERY_PAGES[justDiscovered] && (
          <motion.div
            className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{
              background: 'hsl(0 0% 8% / 0.95)',
              border: `1px solid ${stage.color}`,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 0 20px ${stage.color.replace(')', ' / 0.3)')}`,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <motion.span
              className="text-lg"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.5 }}
            >
              💧
            </motion.span>
            <div>
              <p className="text-[10px] font-mono" style={{ color: stage.color }}>
                +WATER — Your seed grows!
              </p>
              <p className="text-[10px]" style={{ color: 'hsl(0 0% 50%)' }}>
                Discovered {DISCOVERY_PAGES[justDiscovered].emoji} {DISCOVERY_PAGES[justDiscovered].label}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            className="fixed bottom-24 right-4 z-50 w-64 rounded-2xl overflow-hidden"
            style={{
              background: 'hsl(0 0% 6% / 0.95)',
              border: '1px solid hsl(130 40% 25% / 0.3)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 40px hsl(0 0% 0% / 0.5)',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono tracking-wider" style={{ color: stage.color }}>
                  🌱 GROWTH JOURNAL
                </h3>
                <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                  {stage.name}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'hsl(0 0% 12%)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(30 50% 35%), ${stage.color})`,
                    boxShadow: `0 0 8px ${stage.color.replace(')', ' / 0.4)')}`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[10px] mt-1.5 font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                {discoveries.length}/{TOTAL_DISCOVERIES} areas explored
              </p>
            </div>

            {/* Discovery list */}
            <div className="px-4 pb-4 space-y-1.5">
              {Object.entries(DISCOVERY_PAGES).map(([path, info]) => {
                const found = discoveries.includes(path);
                return (
                  <motion.div
                    key={path}
                    className="flex items-center gap-2 text-[11px] px-2.5 py-1.5 rounded-lg"
                    style={{
                      background: found ? 'hsl(130 30% 10%)' : 'hsl(0 0% 8%)',
                      border: `1px solid ${found ? 'hsl(130 40% 25% / 0.3)' : 'hsl(0 0% 12%)'}`,
                      color: found ? 'hsl(130 50% 65%)' : 'hsl(0 0% 25%)',
                    }}
                    initial={false}
                    animate={found ? { opacity: 1 } : { opacity: 0.5 }}
                  >
                    <span>{found ? info.emoji : '🔒'}</span>
                    <span className="font-mono">{info.label}</span>
                    {found && (
                      <motion.span
                        className="ml-auto text-[9px]"
                        style={{ color: 'hsl(130 50% 50%)' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Hint */}
            {progress < 100 && (
              <div className="px-4 pb-3">
                <motion.p
                  className="text-[10px] text-center font-mono"
                  style={{ color: 'hsl(45 50% 55% / 0.6)' }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Visit more pages to water your seed 💧
                </motion.p>
              </div>
            )}

            {progress >= 100 && (
              <div className="px-4 pb-3">
                <p className="text-[10px] text-center font-mono" style={{ color: 'hsl(45 70% 60%)' }}>
                  🌳 Your garden knowledge is flourishing!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SeedGrowthIndicator;
