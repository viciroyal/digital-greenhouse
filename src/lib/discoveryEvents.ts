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
  type: 'page' | 'feature';
  hint?: string;
  hintPages?: string[];
  /** Route to navigate to when the hint is tapped. For features, use a CSS selector action instead. */
  linkTo?: string;
  /** CSS selector to click when hint is tapped (for features that aren't pages) */
  clickSelector?: string;
}

/** All trackable discoveries — pages AND features */
export const ALL_DISCOVERIES: Record<string, DiscoveryItem> = {
  '/': { label: 'First Garden', emoji: '🌱', type: 'page',
    hint: 'Start your journey — tap here to enter the First Garden',
    hintPages: ['/stage'],
    linkTo: '/' },
  '/stage': { label: 'The Stage', emoji: '🎭', type: 'page',
    hint: 'Visit The Stage — tap here to go',
    hintPages: ['/', '/crop-oracle'],
    linkTo: '/stage' },
  '/crop-oracle': { label: 'Crop Oracle', emoji: '🔮', type: 'page',
    hint: 'Enter the Crop Oracle — tap here to explore',
    hintPages: ['/', '/stage'],
    linkTo: '/crop-oracle' },
  '/profile': { label: 'Profile', emoji: '👤', type: 'page',
    hint: 'Visit your Profile — tap here to view',
    hintPages: ['/stage', '/crop-oracle'],
    linkTo: '/profile' },
  '/user-guide': { label: 'User Guide', emoji: '📖', type: 'page',
    hint: 'Read the User Guide — tap here to learn more',
    hintPages: ['/stage', '/crop-oracle'],
    linkTo: '/user-guide' },

  'played-music': { label: 'Played Music', emoji: '🎵', type: 'feature',
    hint: 'Play some music — tap the glowing music icon in the bottom right',
    hintPages: ['/stage', '/crop-oracle', '/'] },
  'used-filter': { label: 'Used Filters', emoji: '🔍', type: 'feature',
    hint: 'Try the filters — tap here to open the Crop Library',
    hintPages: ['/crop-library', '/crop-oracle'],
    linkTo: '/crop-library' },
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
