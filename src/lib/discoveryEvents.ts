/**
 * Discovery Event System
 *
 * Lightweight custom-event bus for feature-interaction tracking.
 * Any component can call `emitDiscovery('feature-key')` and the
 * SeedGrowthIndicator will pick it up without tight coupling.
 */

export interface DiscoveryItem {
  label: string;
  emoji: string;
  /** 'page' = auto-tracked by route, 'feature' = tracked via event */
  type: 'page' | 'feature';
}

/** All trackable discoveries — pages AND features */
export const ALL_DISCOVERIES: Record<string, DiscoveryItem> = {
  // Pages (tracked automatically by route)
  '/': { label: 'First Garden', emoji: '🌱', type: 'page' },
  '/stage': { label: 'The Stage', emoji: '🎭', type: 'page' },
  '/crop-oracle': { label: 'Crop Oracle', emoji: '🔮', type: 'page' },
  '/profile': { label: 'Profile', emoji: '👤', type: 'page' },
  '/user-guide': { label: 'User Guide', emoji: '📖', type: 'page' },

  // Features (tracked via emitDiscovery)
  'played-music': { label: 'Played Music', emoji: '🎵', type: 'feature' },
  'used-filter': { label: 'Used Filters', emoji: '🔍', type: 'feature' },
  'opened-growth-journal': { label: 'Growth Journal', emoji: '📓', type: 'feature' },
};

export const TOTAL_DISCOVERIES = Object.keys(ALL_DISCOVERIES).length;

const EVENT_NAME = 'pharmboi:discovery';

/** Emit a discovery event. Safe to call from anywhere — no-ops if key is unknown. */
export function emitDiscovery(key: string) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: key }));
}

/** Subscribe to discovery events. Returns an unsubscribe function. */
export function onDiscovery(handler: (key: string) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent).detail);
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}

const STORAGE_KEY = 'pharmboi-discoveries';

export function getDiscoveries(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDiscoveries(items: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
