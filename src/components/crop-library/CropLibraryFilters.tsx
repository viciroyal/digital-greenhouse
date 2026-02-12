import { Search, X, MapPin } from 'lucide-react';
import { ZONE_ORDER } from './constants';
import { STATE_HARDINESS_ZONES, US_STATES } from '@/data/stateHardinessZones';

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedZone: number | null;
  onZoneChange: (hz: number | null) => void;
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  selectedHabit: string | null;
  onHabitChange: (habit: string | null) => void;
  categories: string[];
  habits: string[];
  zoneNames: Record<number, string>;
  resultCount: number;
  totalCount: number;
  hardinessZone?: number | null;
  onHardinessZoneChange?: (hz: number | null) => void;
}

const CropLibraryFilters = ({
  searchQuery, onSearchChange,
  selectedZone, onZoneChange,
  selectedCategory, onCategoryChange,
  selectedHabit, onHabitChange,
  categories, habits, zoneNames,
  resultCount, totalCount,
  hardinessZone, onHardinessZoneChange,
}: Props) => {
  const hasFilters = searchQuery || selectedZone !== null || selectedCategory !== null || selectedHabit !== null || (hardinessZone !== null && hardinessZone !== undefined);

  const clearAll = () => {
    onSearchChange('');
    onZoneChange(null);
    onCategoryChange(null);
    onHabitChange(null);
    onHardinessZoneChange?.(null);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 no-print">
      {/* Search input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search crops…"
          className="w-full pl-8 pr-3 py-1.5 text-xs font-apothecary bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/60"
        />
        {searchQuery && (
          <button onClick={() => onSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Zone filter */}
      <select
        value={selectedZone ?? ''}
        onChange={(e) => onZoneChange(e.target.value ? Number(e.target.value) : null)}
        className="text-xs font-apothecary bg-background border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
      >
        <option value="">All Zones</option>
        {ZONE_ORDER.map((hz) => (
          <option key={hz} value={hz}>{zoneNames[hz] || `${hz}Hz`} — {hz}Hz</option>
        ))}
      </select>

      {/* Category filter */}
      <select
        value={selectedCategory ?? ''}
        onChange={(e) => onCategoryChange(e.target.value || null)}
        className="text-xs font-apothecary bg-background border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Growth Habit filter */}
      <select
        value={selectedHabit ?? ''}
        onChange={(e) => onHabitChange(e.target.value || null)}
        className="text-xs font-apothecary bg-background border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
      >
        <option value="">All Habits</option>
        {habits.map((h) => (
          <option key={h} value={h}>{h.charAt(0).toUpperCase() + h.slice(1)}</option>
        ))}
      </select>

      {/* Hardiness Zone filter (by state) */}
      {onHardinessZoneChange && (
        <select
          value={hardinessZone ?? ''}
          onChange={(e) => {
            if (e.target.value) {
              const state = e.target.value;
              const info = STATE_HARDINESS_ZONES[state];
              if (info) onHardinessZoneChange(info.zone);
            } else {
              onHardinessZoneChange(null);
            }
          }}
          className="text-xs font-apothecary bg-background border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">All Zones (USDA)</option>
          {US_STATES.map((state) => {
            const info = STATE_HARDINESS_ZONES[state];
            return (
              <option key={state} value={state}>{info.abbr} — Zone {info.subZone}</option>
            );
          })}
        </select>
      )}

      {/* Result count + clear */}
      {hasFilters && (
        <div className="flex items-center gap-2 text-[10px] font-apothecary text-muted-foreground">
          <span>{resultCount} / {totalCount} crops</span>
          <button onClick={clearAll} className="underline hover:text-foreground transition-colors">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CropLibraryFilters;
