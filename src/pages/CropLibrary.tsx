import { useMasterCrops, type MasterCrop } from '@/hooks/useMasterCrops';
import { Printer, Leaf, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatSubZone = (val: number | null): string => {
  if (val === null) return '–';
  const base = Math.floor(val);
  const sub = val % 1 >= 0.5 ? 'b' : 'a';
  return `${base}${sub}`;
};

const ZONE_ORDER = [396, 417, 528, 639, 741, 852, 963];

const CropRow = ({ crop }: { crop: MasterCrop }) => (
  <tr className="border-b border-border/30 text-[10px] leading-tight print:text-[9px]">
    <td className="py-1 px-1.5 font-bold">{crop.common_name || crop.name}</td>
    <td className="py-1 px-1.5 italic opacity-70">{crop.name !== crop.common_name ? crop.name : ''}</td>
    <td className="py-1 px-1.5 text-center">{crop.frequency_hz}</td>
    <td className="py-1 px-1.5">{crop.zone_name}</td>
    <td className="py-1 px-1.5">{crop.element}</td>
    <td className="py-1 px-1.5">{crop.category}</td>
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
    <td className="py-1 px-1.5">{crop.planting_season?.join(', ') || '–'}</td>
    <td className="py-1 px-1.5">{crop.guild_role || '–'}</td>
    <td className="py-1 px-1.5">{crop.focus_tag?.replace('_FOCUS', '') || '–'}</td>
    <td className="py-1 px-1.5">{crop.companion_crops?.join(', ') || '–'}</td>
    <td className="py-1 px-1.5">{crop.crop_guild?.join(', ') || '–'}</td>
  </tr>
);

const CropLibrary = () => {
  const { data: crops, isLoading, error } = useMasterCrops();

  const groupedByZone = ZONE_ORDER.map((hz) => {
    const zoneCrops = (crops || []).filter((c) => c.frequency_hz === hz);
    const sample = zoneCrops[0];
    return {
      hz,
      name: sample?.zone_name ?? `${hz}Hz`,
      color: sample?.zone_color ?? '#888',
      element: sample?.element ?? '',
      crops: zoneCrops,
    };
  });

  const totalCrops = crops?.length ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 print:p-2 print:bg-white print:text-black">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-4 no-print">
          <Link to="/crop-oracle" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-apothecary text-xs">Back to Crop Oracle</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="gem-button px-4 py-2 text-sm font-apothecary text-primary-foreground flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF
          </button>
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
                    <th className="py-1 px-1.5">Common Name</th>
                    <th className="py-1 px-1.5">Latin</th>
                    <th className="py-1 px-1.5 text-center">Hz</th>
                    <th className="py-1 px-1.5">Zone</th>
                    <th className="py-1 px-1.5">Element</th>
                    <th className="py-1 px-1.5">Category</th>
                    <th className="py-1 px-1.5">Chord</th>
                    <th className="py-1 px-1.5">Instrument</th>
                    <th className="py-1 px-1.5">Mineral</th>
                    <th className="py-1 px-1.5 text-center">Brix</th>
                    <th className="py-1 px-1.5 text-center">Hardiness</th>
                    <th className="py-1 px-1.5 text-center">Days</th>
                    <th className="py-1 px-1.5">Spacing</th>
                    <th className="py-1 px-1.5">Season</th>
                    <th className="py-1 px-1.5">Guild</th>
                    <th className="py-1 px-1.5">Focus</th>
                    <th className="py-1 px-1.5">Companions</th>
                    <th className="py-1 px-1.5">Crop Guild</th>
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
