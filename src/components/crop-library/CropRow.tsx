import { memo } from 'react';
import type { MasterCrop } from '@/hooks/useMasterCrops';

const HABIT_EMOJI: Record<string, string> = {
  tree: '🌳', shrub: '🫐', bush: '🌿', vine: '🧗', herb: '🌱',
  grass: '🌾', 'ground cover': '🍀', underground: '⬇️', bulb: '🧄',
  root: '🥕', tuber: '🥔', rhizome: '🫚', aquatic: '💧',
  succulent: '🪴', fungus: '🍄', epiphyte: '🌺',
};

const formatSubZone = (val: number | null): string => {
  if (val === null) return '–';
  const base = Math.floor(val);
  const sub = val % 1 >= 0.5 ? 'b' : 'a';
  return `${base}${sub}`;
};

const CropRow = memo(({ crop }: { crop: MasterCrop }) => (
  <tr className="border-b border-border/30 text-[10px] leading-tight print:text-[9px]">
    <td className="py-1 px-1.5 font-bold">{crop.common_name || crop.name}</td>
    <td className="py-1 px-1.5 italic opacity-70">{crop.scientific_name || '–'}</td>
    <td className="py-1 px-1.5 text-center">{crop.frequency_hz}</td>
    <td className="py-1 px-1.5">{crop.zone_name}</td>
    <td className="py-1 px-1.5">{crop.element}</td>
    <td className="py-1 px-1.5">{crop.category}</td>
    <td className="py-1 px-1.5">
      {crop.growth_habit ? (
        <span className="inline-flex items-center gap-0.5">
          <span>{HABIT_EMOJI[crop.growth_habit.toLowerCase()] || '🌿'}</span>
          <span className="capitalize">{crop.growth_habit}</span>
        </span>
      ) : '–'}
    </td>
    <td className="py-1 px-1.5">{crop.chord_interval || '–'}</td>
    <td className="py-1 px-1.5">{crop.instrument_type || '–'}</td>
    <td className="py-1 px-1.5">{crop.dominant_mineral || '–'}</td>
    <td className="py-1 px-1.5 text-center">
      {crop.brix_target_min ?? '–'}–{crop.brix_target_max ?? '–'}
    </td>
    <td className="py-1 px-1.5 text-center">
      {crop.hardiness_zone_min !== null
        ? `${formatSubZone(crop.hardiness_zone_min)}–${formatSubZone(crop.hardiness_zone_max)}`
        : '–'}
    </td>
    <td className="py-1 px-1.5 text-center">{crop.harvest_days ?? '–'}</td>
    <td className="py-1 px-1.5">{crop.spacing_inches || '–'}</td>
    <td className="py-1 px-1.5 text-center">{crop.root_depth_inches ?? '–'}</td>
    <td className="py-1 px-1.5 text-center">{crop.min_container_gal ?? '–'}</td>
    <td className="py-1 px-1.5">{crop.planting_season?.join(', ') || '–'}</td>
    <td className="py-1 px-1.5">{crop.guild_role || '–'}</td>
    <td className="py-1 px-1.5">{crop.focus_tag?.replace('_FOCUS', '') || '–'}</td>
    <td className="py-1 px-1.5">{crop.companion_crops?.join(', ') || '–'}</td>
    <td className="py-1 px-1.5">{crop.crop_guild?.join(', ') || '–'}</td>
  </tr>
));

CropRow.displayName = 'CropRow';

export default CropRow;
