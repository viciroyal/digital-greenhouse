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
  /** Directional hint shown on relevant pages to guide users */
  hint?: string;
  /** Which route(s) this hint should appear on (if any) */
  hintPages?: string[];
}

/** All trackable discoveries — pages AND features */
export const ALL_DISCOVERIES: Record<string, DiscoveryItem> = {
  // Pages (tracked automatically by route)
  '/': { label: 'First Garden', emoji: '🌱', type: 'page',
    hint: 'Start your journey — tap "Enter The Garden" on The Stage',
    hintPages: ['/stage'] },
  '/stage': { label: 'The Stage', emoji: '🎭', type: 'page',
    hint: 'Visit The Stage — tap the sovereign emblem in the bottom left',
    hintPages: ['/', '/crop-oracle'] },
  '/crop-oracle': { label: 'Crop Oracle', emoji: '🔮', type: 'page',
    hint: 'Enter the Crop Oracle — tap "Enter The Garden" then skip to Advanced Studio',
    hintPages: ['/', '/stage'] },
  '/profile': { label: 'Profile', emoji: '👤', type: 'page',
    hint: 'Visit your Profile — tap the person icon in the top right',
    hintPages: ['/stage', '/crop-oracle'] },
  '/user-guide': { label: 'User Guide', emoji: '📖', type: 'page',
    hint: 'Read the User Guide — find it in the top navigation',
    hintPages: ['/stage', '/crop-oracle'] },

  // Features (tracked via emitDiscovery)
  'played-music': { label: 'Played Music', emoji: '🎵', type: 'feature',
    hint: 'Play some music — tap the glowing music icon in the bottom right',
    hintPages: ['/stage', '/crop-oracle', '/'] },
  'used-filter': { label: 'Used Filters', emoji: '🔍', type: 'feature',
    hint: 'Try the filters — use zone or category selects in the Crop Library',
    hintPages: ['/crop-library', '/crop-oracle'] },
  'opened-growth-journal': { label: 'Growth Journal', emoji: '📓', type: 'feature',
    hint: 'Open your Growth Journal — tap the seed icon in the top left',
    hintPages: ['/stage', '/', '/crop-oracle'] },
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
