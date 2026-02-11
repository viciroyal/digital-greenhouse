import { useMemo } from 'react';
import { useMasterCrops } from '@/hooks/useMasterCrops';
import { Printer, Leaf, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CropRow from '@/components/crop-library/CropRow';
import { generateCsv } from '@/components/crop-library/csvExport';
import { ZONE_ORDER, TABLE_HEADERS } from '@/components/crop-library/constants';

const CropLibrary = () => {
  const { data: crops, isLoading, error } = useMasterCrops();
  const { toast } = useToast();

  const groupedByZone = useMemo(() =>
    ZONE_ORDER.map((hz) => {
      const zoneCrops = (crops || []).filter((c) => c.frequency_hz === hz);
      const sample = zoneCrops[0];
      return {
        hz,
        name: sample?.zone_name ?? `${hz}Hz`,
        color: sample?.zone_color ?? '#888',
        element: sample?.element ?? '',
        crops: zoneCrops,
      };
    }),
    [crops]
  );

  const totalCrops = crops?.length ?? 0;

  const handleDownloadCsv = () => {
    if (!crops || crops.length === 0) return;
    const csv = generateCsv(crops);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmboi-crop-registry-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `${crops.length} crops exported`, description: 'CSV downloaded with all connections.' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 print:p-2 print:bg-white print:text-black">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 no-print">
          <Link to="/crop-oracle" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-apothecary text-xs">Back to Crop Oracle</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              disabled={!crops || crops.length === 0}
              className="gem-button px-4 py-2 text-sm font-apothecary text-primary-foreground flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="gem-button px-4 py-2 text-sm font-apothecary text-primary-foreground flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print / Export PDF
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6 print:mb-3">
          <h1 className="text-3xl print:text-xl root-text flex items-center justify-center gap-2">
            <Leaf className="w-7 h-7 print:w-5 print:h-5" />
            PHARMBOI Master Crop Library
          </h1>
          <p className="font-apothecary text-xs text-muted-foreground mt-1">
            {totalCrops} Crops · 7 Solfeggio Frequency Zones · Complete Field Reference
          </p>
        </div>

        {isLoading && (
          <p className="text-center font-apothecary text-muted-foreground py-12">Loading crop library…</p>
        )}
        {error && (
          <p className="text-center text-destructive py-12">Error loading crops.</p>
        )}

        {/* Zone Sections */}
        {groupedByZone.map((zone) => (
          <section key={zone.hz} className="mb-6 print:mb-3 print-section break-inside-avoid-page">
            <div
              className="flex items-center gap-2 mb-2 px-2 py-1 rounded-lg print:rounded-none"
              style={{ background: `${zone.color}22`, borderLeft: `4px solid ${zone.color}` }}
            >
              <span
                className="w-3 h-3 rounded-full print:w-2 print:h-2"
                style={{ background: zone.color }}
              />
              <h2 className="text-lg print:text-sm font-bold" style={{ color: zone.color }}>
                {zone.name} — {zone.hz}Hz
              </h2>
              <span className="font-apothecary text-[10px] text-muted-foreground print:text-black/60">
                {zone.element} · {zone.crops.length} crops
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] font-apothecary uppercase tracking-wider text-muted-foreground print:text-black/60 border-b-2 border-border/50">
                    {TABLE_HEADERS.map((h) => (
                      <th key={h.label} className={`py-1 px-1.5 ${h.align}`}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {zone.crops.map((crop) => (
                    <CropRow key={crop.id} crop={crop} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {/* Footer */}
        <div className="text-center mt-8 print:mt-4 font-apothecary text-[10px] text-muted-foreground print:text-black/50">
          PHARMBOI Master Crop Library · Generated {new Date().toLocaleDateString()} · {totalCrops} Total Entries
        </div>
      </div>
    </div>
  );
};

export default CropLibrary;
