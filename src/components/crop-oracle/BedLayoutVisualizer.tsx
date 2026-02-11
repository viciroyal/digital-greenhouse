import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Printer, Layers } from 'lucide-react';
import type { MasterCrop } from '@/hooks/useMasterCrops';
import { getCropLayer, type GrowthLayer } from '@/lib/growthLayers';

/* ─── CONFIG ─── */
const BED_WIDTH_FT = 2.5;
const BED_LENGTH_FT = 10; // Show 10ft section (scalable)
const PX_PER_INCH = 3;    // SVG scale
const BED_W = BED_WIDTH_FT * 12 * PX_PER_INCH;
const BED_H = BED_LENGTH_FT * 12 * PX_PER_INCH;
const PAD = 40;

const LAYER_COLORS: Record<GrowthLayer, string> = {
  canopy:      'hsl(120 45% 40%)',
  understory:  'hsl(160 45% 42%)',
  herbaceous:  'hsl(90 50% 48%)',
  ground:      'hsl(130 40% 38%)',
  underground: 'hsl(30 50% 45%)',
  vine:        'hsl(200 50% 50%)',
};

const LAYER_ORDER: GrowthLayer[] = ['canopy', 'understory', 'vine', 'herbaceous', 'ground', 'underground'];

interface PlacedCrop {
  crop: MasterCrop;
  layer: GrowthLayer;
  emoji: string;
  color: string;
  spacing: number; // inches
  x: number; // SVG px
  y: number; // SVG px
  radius: number;
  label: string;
  slotLabel: string;
}

function parseSpacing(s: string | null): number {
  if (!s) return 12;
  // Handle ranges like "120-180" → take the lower number
  const num = parseInt(s);
  return isNaN(num) ? 12 : Math.min(num, 30); // Cap at 30" for bed display
}

interface BedLayoutVisualizerProps {
  crops: (MasterCrop | null)[];
  slotLabels: string[];
  zoneColor: string;
  bedLengthFt?: number;
  bedWidthFt?: number;
}

const BedLayoutVisualizer = ({
  crops,
  slotLabels,
  zoneColor,
  bedLengthFt = BED_LENGTH_FT,
  bedWidthFt = BED_WIDTH_FT,
}: BedLayoutVisualizerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const bedW = bedWidthFt * 12 * PX_PER_INCH;
  const bedH = bedLengthFt * 12 * PX_PER_INCH;
  const svgW = bedW + PAD * 2;
  const svgH = bedH + PAD * 2 + 80; // Extra space for legend

  // Place crops in the bed
  const placedCrops = useMemo((): PlacedCrop[] => {
    const validCrops = crops
      .map((c, i) => c ? { crop: c, slotLabel: slotLabels[i] || '' } : null)
      .filter((c): c is { crop: MasterCrop; slotLabel: string } => c !== null);

    if (validCrops.length === 0) return [];

    const placed: PlacedCrop[] = [];
    const bedWidthIn = bedWidthFt * 12;
    const bedLengthIn = bedLengthFt * 12;

    // Sort by layer order for visual stacking (underground first → canopy last)
    const sorted = [...validCrops].sort((a, b) => {
      const aLayer = getCropLayer(a.crop).layer;
      const bLayer = getCropLayer(b.crop).layer;
      return LAYER_ORDER.indexOf(bLayer) - LAYER_ORDER.indexOf(aLayer);
    });

    // Divide bed lengthwise into zones for each crop
    const zoneHeight = bedLengthIn / sorted.length;

    sorted.forEach((item, idx) => {
      const layerInfo = getCropLayer(item.crop);
      const spacing = parseSpacing(item.crop.spacing_inches);
      const color = LAYER_COLORS[layerInfo.layer];
      const radius = Math.max(4, Math.min(spacing * PX_PER_INCH * 0.35, 18));

      // Calculate how many plants fit across the bed width
      const plantsAcross = Math.max(1, Math.floor(bedWidthIn / spacing));
      // How many plants fit in this zone lengthwise
      const plantsDown = Math.max(1, Math.floor(zoneHeight / spacing));

      // Place plants in a grid within this crop's zone
      for (let row = 0; row < plantsDown; row++) {
        for (let col = 0; col < plantsAcross; col++) {
          const offsetX = (col + 0.5) * (bedWidthIn / plantsAcross);
          const offsetY = idx * zoneHeight + (row + 0.5) * (zoneHeight / plantsDown);
          // Stagger odd rows
          const stagger = row % 2 === 1 ? (bedWidthIn / plantsAcross) * 0.5 : 0;

          placed.push({
            crop: item.crop,
            layer: layerInfo.layer,
            emoji: layerInfo.emoji,
            color,
            spacing,
            x: PAD + (offsetX + stagger) * PX_PER_INCH,
            y: PAD + offsetY * PX_PER_INCH,
            radius,
            label: item.crop.common_name || item.crop.name,
            slotLabel: item.slotLabel,
          });
        }
      }
    });

    return placed;
  }, [crops, slotLabels, bedWidthFt, bedLengthFt]);

  // Unique layers for legend
  const usedLayers = useMemo(() => {
    const layers = new Map<GrowthLayer, { color: string; crops: string[] }>();
    for (const p of placedCrops) {
      if (!layers.has(p.layer)) layers.set(p.layer, { color: p.color, crops: [] });
      const entry = layers.get(p.layer)!;
      if (!entry.crops.includes(p.label)) entry.crops.push(p.label);
    }
    return [...layers.entries()].sort(
      (a, b) => LAYER_ORDER.indexOf(a[0]) - LAYER_ORDER.indexOf(b[0])
    );
  }, [placedCrops]);

  // Print handler
  const handlePrint = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html><html><head><title>Bed Layout — Field Card</title>
      <style>
        body { margin: 20px; font-family: monospace; background: white; }
        h1 { font-size: 14px; text-align: center; margin-bottom: 8px; }
        p { font-size: 10px; text-align: center; color: #666; margin-bottom: 16px; }
        svg { display: block; margin: 0 auto; max-width: 100%; }
        @media print { body { margin: 10px; } }
      </style>
      </head><body>
        <h1>🌱 PHARMBOI BED LAYOUT — ${bedLengthFt}ft × ${bedWidthFt}ft</h1>
        <p>${placedCrops.length} plants · ${usedLayers.length} growth layers · ${new Date().toLocaleDateString()}</p>
        ${svgData}
      </body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  if (placedCrops.length === 0) return null;

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: 'hsl(0 0% 5%)',
      border: `1px solid ${zoneColor}20`,
    }}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" style={{ color: zoneColor }} />
          <span className="text-[10px] font-mono tracking-wider" style={{ color: `${zoneColor}cc` }}>
            BED LAYOUT — {bedLengthFt}ft × {bedWidthFt}ft
          </span>
        </div>
        <button
          onClick={handlePrint}
          className="text-[8px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1 hover:opacity-80 transition-opacity"
          style={{
            background: 'hsl(0 0% 8%)',
            color: 'hsl(0 0% 50%)',
            border: '1px solid hsl(0 0% 15%)',
          }}
        >
          <Printer className="w-3 h-3" />
          PRINT CARD
        </button>
      </div>

      <div className="px-3 pb-4 overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full max-w-md mx-auto"
          style={{ background: 'hsl(0 0% 3%)' }}
        >
          {/* Bed outline (soil) */}
          <rect
            x={PAD} y={PAD}
            width={bedW} height={bedH}
            rx={8}
            fill="hsl(30 25% 12%)"
            stroke="hsl(30 20% 22%)"
            strokeWidth={2}
          />

          {/* Grid lines for spacing reference */}
          {Array.from({ length: Math.floor(bedLengthFt) }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={PAD} y1={PAD + (i + 1) * 12 * PX_PER_INCH}
              x2={PAD + bedW} y2={PAD + (i + 1) * 12 * PX_PER_INCH}
              stroke="hsl(30 15% 18%)" strokeWidth={0.5} strokeDasharray="4,4"
            />
          ))}

          {/* Foot markers */}
          {Array.from({ length: Math.floor(bedLengthFt) + 1 }).map((_, i) => (
            <text
              key={`ft-${i}`}
              x={PAD - 6} y={PAD + i * 12 * PX_PER_INCH + 4}
              fill="hsl(0 0% 30%)" fontSize={8} fontFamily="monospace" textAnchor="end"
            >
              {i}′
            </text>
          ))}

          {/* Width markers */}
          <text x={PAD + bedW / 2} y={PAD - 8} fill="hsl(0 0% 30%)" fontSize={8} fontFamily="monospace" textAnchor="middle">
            ← {bedWidthFt}ft →
          </text>

          {/* Zone dividers (crop sections) */}
          {(() => {
            const validCount = crops.filter(c => c !== null).length;
            if (validCount <= 1) return null;
            const zoneH = bedH / validCount;
            return Array.from({ length: validCount - 1 }).map((_, i) => (
              <line
                key={`zone-${i}`}
                x1={PAD + 4} y1={PAD + (i + 1) * zoneH}
                x2={PAD + bedW - 4} y2={PAD + (i + 1) * zoneH}
                stroke="hsl(0 0% 25%)" strokeWidth={1} strokeDasharray="6,3"
              />
            ));
          })()}

          {/* Plant circles */}
          {placedCrops.map((p, i) => (
            <g key={i}>
              {/* Glow */}
              <circle
                cx={p.x} cy={p.y} r={p.radius + 3}
                fill={`${p.color}`} opacity={0.08}
              />
              {/* Plant */}
              <motion.circle
                cx={p.x} cy={p.y} r={p.radius}
                fill={p.color}
                opacity={0.7}
                stroke={p.color}
                strokeWidth={1}
                initial={{ r: 0 }}
                animate={{ r: p.radius }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
              />
              {/* Emoji (only show for first occurrence of each crop) */}
              {i === placedCrops.findIndex(pp => pp.label === p.label) && p.radius >= 8 && (
                <text
                  x={p.x} y={p.y + 1}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={Math.min(p.radius, 10)} fontFamily="monospace"
                >
                  {p.emoji}
                </text>
              )}
            </g>
          ))}

          {/* Crop labels on the right side */}
          {(() => {
            const validCrops = crops.filter(c => c !== null);
            const zoneH = bedH / validCrops.length;
            let cropIdx = 0;
            return crops.map((crop, i) => {
              if (!crop) return null;
              const currentIdx = cropIdx++;
              const layerInfo = getCropLayer(crop);
              const color = LAYER_COLORS[layerInfo.layer];
              const yPos = PAD + currentIdx * zoneH + zoneH / 2;
              return (
                <g key={`label-${i}`}>
                  <text
                    x={PAD + bedW + 8} y={yPos - 5}
                    fill={color} fontSize={9} fontFamily="monospace" fontWeight="bold"
                  >
                    {(crop.common_name || crop.name).substring(0, 18)}
                  </text>
                  <text
                    x={PAD + bedW + 8} y={yPos + 6}
                    fill="hsl(0 0% 40%)" fontSize={7} fontFamily="monospace"
                  >
                    {slotLabels[i]} · {crop.spacing_inches || '?'}″ · {layerInfo.layer}
                  </text>
                </g>
              );
            });
          })()}

          {/* Legend */}
          <g transform={`translate(${PAD}, ${PAD + bedH + 16})`}>
            <text x={0} y={0} fill="hsl(0 0% 40%)" fontSize={8} fontFamily="monospace" fontWeight="bold">
              GROWTH LAYERS:
            </text>
            {usedLayers.map(([layer, { color, crops: cropNames }], i) => (
              <g key={layer} transform={`translate(${i * Math.floor((svgW - PAD * 2) / Math.max(usedLayers.length, 1))}, 14)`}>
                <circle cx={5} cy={4} r={4} fill={color} opacity={0.8} />
                <text x={14} y={7} fill={color} fontSize={7} fontFamily="monospace" fontWeight="bold">
                  {layer.toUpperCase()}
                </text>
                <text x={14} y={17} fill="hsl(0 0% 35%)" fontSize={6} fontFamily="monospace">
                  {cropNames.slice(0, 2).join(', ')}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default BedLayoutVisualizer;
