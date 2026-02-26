import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ALL_DISCOVERIES, getDiscoveries } from '@/lib/discoveryEvents';
import { Compass } from 'lucide-react';

const DISMISS_KEY = 'pharmboi-hint-dismissed';

/**
 * Floating directional hint that appears on pages,
 * nudging users toward their next undiscovered area or feature.
 * Shows one hint at a time, dismissible, and auto-hides after 12s.
 */
const DiscoveryHint = () => {
  const location = useLocation();
  const [dismissed, setDismissed] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(DISMISS_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [visible, setVisible] = useState(true);

  const hint = useMemo(() => {
    const discoveries = getDiscoveries();
    const currentPath = location.pathname;

    // Find the first undiscovered item that has a hint for this page
    for (const [key, item] of Object.entries(ALL_DISCOVERIES)) {
      if (discoveries.includes(key)) continue; // already discovered
      if (dismissed.includes(key)) continue; // dismissed this session
      if (!item.hint || !item.hintPages) continue;
      if (item.hintPages.some((p) => p === currentPath || (p !== '/' && currentPath.startsWith(p)))) {
        return { key, ...item };
      }
    }
    return null;
  }, [location.pathname, dismissed]);

  // Auto-hide after 12 seconds, re-show on route change
  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 12000);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const dismiss = () => {
    if (!hint) return;
    const next = [...dismissed, hint.key];
    setDismissed(next);
    sessionStorage.setItem(DISMISS_KEY, JSON.stringify(next));
  };

  const activeHint = hint && visible ? hint : null;

  return (
    <AnimatePresence>
      {activeHint && (
        <motion.div
          key={activeHint.key}
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 max-w-xs w-[calc(100%-2rem)]"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 18, stiffness: 200 }}
        >
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-2xl cursor-pointer"
            onClick={dismiss}
            style={{
              background: 'hsl(0 0% 8% / 0.92)',
              border: '1px solid hsl(45 50% 40% / 0.25)',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 8px 32px hsl(0 0% 0% / 0.5), 0 0 16px hsl(45 60% 50% / 0.08)',
            }}
          >
            <motion.div
              className="mt-0.5 flex-shrink-0"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <Compass className="w-4 h-4" style={{ color: 'hsl(45 70% 55%)' }} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono tracking-widest mb-0.5" style={{ color: 'hsl(45 60% 55%)' }}>
                {activeHint.emoji} NEXT DISCOVERY
              </p>
              <p className="text-[11px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 60%)' }}>
                {activeHint.hint}
              </p>
            </div>
            <button
              className="text-[9px] font-mono flex-shrink-0 mt-1 px-2 py-0.5 rounded-md"
              style={{
                color: 'hsl(0 0% 35%)',
                background: 'hsl(0 0% 12%)',
                border: '1px solid hsl(0 0% 15%)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiscoveryHint;
