import type { MasterCrop } from '@/hooks/useMasterCrops';

const escapeCsvField = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes(';')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const generateCsv = (crops: MasterCrop[]): string => {
  const headers = [
    'common_name', 'scientific_name', 'frequency_hz', 'zone_name', 'element', 'category',
    'growth_habit', 'chord_interval', 'instrument_type', 'dominant_mineral', 'brix_min', 'brix_max',
    'hardiness_zone_min', 'hardiness_zone_max', 'harvest_days', 'spacing_inches',
    'root_depth_inches', 'min_container_gal', 'est_yield_lbs_per_plant', 'seed_cost_cents',
    'planting_season', 'guild_role', 'focus_tag', 'companion_crops', 'crop_guild',
    'soil_protocol_focus', 'cultural_role', 'description', 'library_note',
  ];

  const rows = crops.map(c => [
    c.common_name || c.name,
    c.scientific_name || '',
    String(c.frequency_hz),
    c.zone_name,
    c.element,
    c.category,
    c.growth_habit || '',
    c.chord_interval || '',
    c.instrument_type || '',
    c.dominant_mineral || '',
    c.brix_target_min != null ? String(c.brix_target_min) : '',
    c.brix_target_max != null ? String(c.brix_target_max) : '',
    c.hardiness_zone_min != null ? String(c.hardiness_zone_min) : '',
    c.hardiness_zone_max != null ? String(c.hardiness_zone_max) : '',
    c.harvest_days != null ? String(c.harvest_days) : '',
    c.spacing_inches || '',
    c.root_depth_inches != null ? String(c.root_depth_inches) : '',
    c.min_container_gal != null ? String(c.min_container_gal) : '',
    c.est_yield_lbs_per_plant != null ? String(c.est_yield_lbs_per_plant) : '',
    c.seed_cost_cents != null ? String(c.seed_cost_cents) : '',
    (c.planting_season || []).join('; '),
    c.guild_role || '',
    c.focus_tag || '',
    (c.companion_crops || []).join('; '),
    (c.crop_guild || []).join('; '),
    c.soil_protocol_focus || '',
    c.cultural_role || '',
    c.description || '',
    c.library_note || '',
  ].map(escapeCsvField));

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};
