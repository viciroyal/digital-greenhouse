import { useMasterCrops } from '@/hooks/useMasterCrops';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const CSV_HEADERS = [
  'name', 'common_name', 'category', 'chord_interval', 'frequency_hz', 'zone_name',
  'zone_color', 'element', 'instrument_type', 'guild_role', 'focus_tag',
  'dominant_mineral', 'companion_crops', 'crop_guild', 'cultural_role',
  'soil_protocol_focus', 'planting_season', 'harvest_days', 'spacing_inches',
  'brix_target_min', 'brix_target_max', 'description', 'library_note'
];

const escapeCsv = (val: unknown): string => {
  if (val === null || val === undefined) return '';
  const str = Array.isArray(val) ? val.join('; ') : String(val);
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"` : str;
};

const CropExport = () => {
  const { data: crops, isLoading } = useMasterCrops();

  const handleDownload = () => {
    if (!crops) return;
    const rows = crops.map(crop =>
      CSV_HEADERS.map(h => escapeCsv((crop as unknown as Record<string, unknown>)[h])).join(',')
    );
    const csv = [CSV_HEADERS.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'master_crops_registry.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Master Crop Registry Export</h1>
        <p className="text-muted-foreground">
          {isLoading ? 'Loading...' : `${crops?.length ?? 0} crops ready for download`}
        </p>
        <Button onClick={handleDownload} disabled={isLoading || !crops} size="lg" className="gap-2">
          <Download className="w-5 h-5" />
          Download CSV
        </Button>
      </div>
    </div>
  );
};

export default CropExport;
