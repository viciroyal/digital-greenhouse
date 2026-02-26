import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import FlourishingCelebration from './seed-growth/FlourishingCelebration';
import {
  ALL_DISCOVERIES,
  TOTAL_DISCOVERIES,
  getDiscoveries,
  saveDiscoveries,
  onDiscovery,
  emitDiscovery,
} from '@/lib/discoveryEvents';

/**
 * Seed Growth Indicator
 * A living progress tracker that evolves from seed → sprout → sapling → tree
 * as the user explores pages AND interacts with features.
 */

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

  // Centralised add-discovery helper
  const addDiscovery = useCallback(
    (key: string) => {
      if (!ALL_DISCOVERIES[key]) return;
      setDiscoveries((prev) => {
        if (prev.includes(key)) return prev;
        const next = [...prev, key];
        saveDiscoveries(next);
        setJustDiscovered(key);
        setTimeout(() => setJustDiscovered(null), 3000);
        return next;
      });
    },
    []
  );

  // Track page visits
  useEffect(() => {
    const path = location.pathname;
    const matchedKey = Object.keys(ALL_DISCOVERIES).find(
      (k) =>
        ALL_DISCOVERIES[k].type === 'page' &&
        (k === path || (k !== '/' && path.startsWith(k)))
    );
    if (matchedKey) addDiscovery(matchedKey);
  }, [location.pathname, addDiscovery]);

  // Listen for feature discovery events
  useEffect(() => onDiscovery(addDiscovery), [addDiscovery]);

  // Track opening the growth journal itself
  useEffect(() => {
    if (showPanel) emitDiscovery('opened-growth-journal');
  }, [showPanel]);

  const stemHeight = useMemo(() => Math.max(0, (progress / 100) * 55), [progress]);
  const leafCount = useMemo(() => Math.floor(progress / 20), [progress]);
  const hasFlower = progress >= 90;

  // Split discoveries into pages and features for the panel
  const pageEntries = useMemo(
    () => Object.entries(ALL_DISCOVERIES).filter(([, v]) => v.type === 'page'),
    []
  );
  const featureEntries = useMemo(
    () => Object.entries(ALL_DISCOVERIES).filter(([, v]) => v.type === 'feature'),
    []
  );

  return (
    <>
      <FlourishingCelebration active={progress >= 100} />

      {/* Fixed indicator button */}
      <motion.button
        className="fixed top-[4.25rem] left-4 z-50 flex flex-col items-center gap-1 cursor-pointer group"
        onClick={() => setShowPanel(!showPanel)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', damping: 12 }}
        aria-label="Growth progress"
        style={{ outline: 'none', border: 'none', background: 'none' }}
      >
        <motion.div
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: progress >= 100
              ? 'radial-gradient(circle, hsl(45 60% 12% / 0.95), hsl(0 0% 6% / 0.9))'
              : 'hsl(0 0% 6% / 0.9)',
            border: `2px solid ${progress >= 100 ? 'hsl(45 80% 55%)' : stage.color}`,
            backdropFilter: 'blur(8px)',
          }}
          animate={progress >= 100
            ? {
                boxShadow: [
                  '0 0 12px hsl(45 80% 55% / 0.3), 0 0 30px hsl(45 70% 50% / 0.15), inset 0 0 12px hsl(45 80% 55% / 0.1)',
                  '0 0 20px hsl(45 80% 55% / 0.5), 0 0 50px hsl(45 70% 50% / 0.25), inset 0 0 20px hsl(45 80% 55% / 0.15)',
                  '0 0 12px hsl(45 80% 55% / 0.3), 0 0 30px hsl(45 70% 50% / 0.15), inset 0 0 12px hsl(45 80% 55% / 0.1)',
                ],
                borderColor: ['hsl(45 80% 55%)', 'hsl(45 90% 65%)', 'hsl(45 80% 55%)'],
              }
            : {
                boxShadow: [
                  `0 0 8px ${stage.color.replace(')', ' / 0.2)')}`,
                  `0 0 20px ${stage.color.replace(')', ' / 0.45)')}`,
                  `0 0 8px ${stage.color.replace(')', ' / 0.2)')}`,
                ],
              }
          }
          transition={{ duration: progress >= 100 ? 3 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.1 }}
        >
          {/* Golden shimmer ring overlay for 100% */}
          {progress >= 100 && (
            <motion.div
              className="absolute inset-[-3px] rounded-full pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, hsl(45 90% 65% / 0.4) 10%, transparent 20%, transparent 50%, hsl(45 80% 55% / 0.3) 60%, transparent 70%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          )}
          <svg viewBox="0 0 60 80" className="w-10 h-10" aria-hidden="true">
            <ellipse cx="30" cy="72" rx="22" ry="5" fill="hsl(20 40% 18%)" />
            {progress > 10 && (
              <motion.line
                x1="30" y1="72" x2="30" y2={72 - stemHeight}
                stroke={stage.color} strokeWidth="2.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            )}
            {progress < 30 && (
              <motion.ellipse
                cx="30" cy="68" rx="5" ry="3.5"
                fill="hsl(30 55% 30%)" stroke="hsl(30 40% 45%)" strokeWidth="0.5"
                animate={progress > 10 ? { ry: [3.5, 2.5], opacity: [1, 0.5] } : {}}
                transition={{ duration: 1 }}
              />
            )}
            {leafCount >= 1 && (
              <motion.path d="M30,55 Q20,48 18,42 Q24,46 30,52" fill={stage.color} opacity={0.85}
                initial={{ scale: 0, originX: '30px', originY: '55px' }} animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }} />
            )}
            {leafCount >= 2 && (
              <motion.path d="M30,48 Q40,40 44,35 Q38,40 30,45" fill={stage.color} opacity={0.8}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} />
            )}
            {leafCount >= 3 && (
              <motion.path d="M30,38 Q18,30 15,24 Q22,30 30,35" fill="hsl(130 55% 45%)" opacity={0.75}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }} />
            )}
            {leafCount >= 4 && (
              <motion.path d="M30,30 Q42,22 46,16 Q38,24 30,28" fill="hsl(140 55% 48%)" opacity={0.8}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring' }} />
            )}
            {hasFlower && (
              <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 8, delay: 1 }}>
                <circle cx="30" cy={72 - stemHeight - 4} r="5" fill="hsl(45 80% 55%)" opacity={0.9} />
                <circle cx="30" cy={72 - stemHeight - 4} r="2.5" fill="hsl(45 90% 70%)" />
                <motion.circle cx="30" cy={72 - stemHeight - 4} r="7"
                  fill="none" stroke="hsl(45 80% 55% / 0.4)" strokeWidth="1"
                  animate={{ r: [7, 10, 7], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }} />
              </motion.g>
            )}
            {progress > 5 && progress < 100 && (
              <motion.circle cx="22" cy="30" r="1.5" fill="hsl(200 70% 65% / 0.6)"
                animate={{ y: [0, 40], opacity: [0.7, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 2, repeatDelay: 4 }} />
            )}
          </svg>
        </motion.div>
        <span className="text-[9px] font-mono tracking-wider" style={{ color: stage.color }}>
          {progress}%
        </span>
      </motion.button>

      {/* Discovery notification toast */}
      <AnimatePresence>
        {justDiscovered && ALL_DISCOVERIES[justDiscovered] && (
          <motion.div
            className="fixed top-32 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl"
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
            <motion.span className="text-lg" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5 }}>
              {ALL_DISCOVERIES[justDiscovered].type === 'feature' ? '☀️' : '💧'}
            </motion.span>
            <div>
              <p className="text-[10px] font-mono" style={{ color: stage.color }}>
                {ALL_DISCOVERIES[justDiscovered].type === 'feature'
                  ? '+SUNLIGHT — Feature unlocked!'
                  : '+WATER — Your seed grows!'}
              </p>
              <p className="text-[10px]" style={{ color: 'hsl(0 0% 50%)' }}>
                Discovered {ALL_DISCOVERIES[justDiscovered].emoji} {ALL_DISCOVERIES[justDiscovered].label}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            className="fixed top-32 left-4 z-50 w-72 rounded-2xl overflow-hidden"
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
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono tracking-wider" style={{ color: stage.color }}>
                  🌱 GROWTH JOURNAL
                </h3>
                <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                  {stage.name}
                </span>
              </div>
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
                {discoveries.length}/{TOTAL_DISCOVERIES} discoveries
              </p>
            </div>

            {/* Pages section */}
            <div className="px-4 pb-2">
              <p className="text-[9px] font-mono tracking-widest mb-1.5" style={{ color: 'hsl(200 50% 50%)' }}>
                💧 PAGES EXPLORED
              </p>
              <div className="space-y-1">
                {pageEntries.map(([key, info]) => {
                  const found = discoveries.includes(key);
                  return (
                    <DiscoveryRow key={key} found={found} emoji={info.emoji} label={info.label} />
                  );
                })}
              </div>
            </div>

            {/* Features section */}
            <div className="px-4 pb-4 pt-2">
              <p className="text-[9px] font-mono tracking-widest mb-1.5" style={{ color: 'hsl(45 60% 55%)' }}>
                ☀️ FEATURES DISCOVERED
              </p>
              <div className="space-y-1">
                {featureEntries.map(([key, info]) => {
                  const found = discoveries.includes(key);
                  return (
                    <DiscoveryRow key={key} found={found} emoji={info.emoji} label={info.label} />
                  );
                })}
              </div>
            </div>

            {progress < 100 && (
              <div className="px-4 pb-3">
                <motion.p
                  className="text-[10px] text-center font-mono"
                  style={{ color: 'hsl(45 50% 55% / 0.6)' }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Explore pages & features to grow your seed 🌱
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

/** Small row component used in the panel */
const DiscoveryRow = ({ found, emoji, label }: { found: boolean; emoji: string; label: string }) => (
  <motion.div
    className="flex items-center gap-2 text-[11px] px-2.5 py-1.5 rounded-lg"
    style={{
      background: found ? 'hsl(130 30% 10%)' : 'hsl(0 0% 8%)',
      border: `1px solid ${found ? 'hsl(130 40% 25% / 0.3)' : 'hsl(0 0% 12%)'}`,
      color: found ? 'hsl(130 50% 65%)' : 'hsl(0 0% 25%)',
    }}
    initial={false}
    animate={found ? { opacity: 1 } : { opacity: 0.5 }}
  >
    <span>{found ? emoji : '🔒'}</span>
    <span className="font-mono">{label}</span>
    {found && (
      <motion.span className="ml-auto text-[9px]" style={{ color: 'hsl(130 50% 50%)' }}
        initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>
    )}
  </motion.div>
);

export default SeedGrowthIndicator;
