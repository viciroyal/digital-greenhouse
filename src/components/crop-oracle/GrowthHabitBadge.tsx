/**
 * GrowthHabitBadge — displays the growth_habit from the DB as a compact pill.
 * Shared by CropOracle chord cards, search results, star picker, and CropLibrary.
 */

const HABIT_META: Record<string, { emoji: string; label: string; color: string }> = {
  tree:          { emoji: '🌳', label: 'Tree',          color: 'hsl(120 40% 45%)' },
  shrub:         { emoji: '🫐', label: 'Shrub',         color: 'hsl(160 40% 45%)' },
  bush:          { emoji: '🌿', label: 'Bush',          color: 'hsl(140 45% 45%)' },
  vine:          { emoji: '🧗', label: 'Vine',          color: 'hsl(160 45% 50%)' },
  herb:          { emoji: '🌱', label: 'Herb',          color: 'hsl(100 45% 50%)' },
  grass:         { emoji: '🌾', label: 'Grass',         color: 'hsl(80 40% 50%)'  },
  'ground cover':{ emoji: '🍀', label: 'Ground Cover',  color: 'hsl(130 45% 45%)' },
  underground:   { emoji: '⬇️', label: 'Underground',   color: 'hsl(25 50% 50%)'  },
  bulb:          { emoji: '🧄', label: 'Bulb',          color: 'hsl(30 45% 50%)'  },
  root:          { emoji: '🥕', label: 'Root',          color: 'hsl(20 55% 50%)'  },
  tuber:         { emoji: '🥔', label: 'Tuber',         color: 'hsl(35 45% 50%)'  },
  rhizome:       { emoji: '🫚', label: 'Rhizome',       color: 'hsl(40 50% 50%)'  },
  aquatic:       { emoji: '💧', label: 'Aquatic',       color: 'hsl(200 50% 55%)' },
  succulent:     { emoji: '🪴', label: 'Succulent',     color: 'hsl(110 35% 50%)' },
  fungus:        { emoji: '🍄', label: 'Fungus',        color: 'hsl(270 35% 50%)' },
  epiphyte:      { emoji: '🌺', label: 'Epiphyte',      color: 'hsl(300 40% 55%)' },
};

const FALLBACK = { emoji: '🌿', label: '', color: 'hsl(0 0% 45%)' };

interface GrowthHabitBadgeProps {
  habit: string | null | undefined;
  /** 'sm' = 7px font (chord cards), 'md' = 8px (search results) */
  size?: 'sm' | 'md';
}

const GrowthHabitBadge = ({ habit, size = 'sm' }: GrowthHabitBadgeProps) => {
  if (!habit) return null;
  const key = habit.toLowerCase().trim();
  const meta = HABIT_META[key] || { ...FALLBACK, label: habit };
  const fontSize = size === 'sm' ? 'text-[7px]' : 'text-[8px]';

  return (
    <span
      className={`${fontSize} font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1`}
      style={{
        background: `${meta.color}15`,
        color: meta.color,
        border: `1px solid ${meta.color}25`,
      }}
    >
      {meta.emoji} {meta.label}
    </span>
  );
};

export default GrowthHabitBadge;
