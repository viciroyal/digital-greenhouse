import { useMemo } from 'react';
import { DollarSign, Scale, TrendingUp, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { MasterCrop } from '@/hooks/useMasterCrops';

interface YieldCostEstimatorProps {
  crops: (MasterCrop | null)[];
  slotLabels: string[];
  zoneColor: string;
  bedLengthFt?: number;
  bedWidthFt?: number;
  environment: string;
}

interface CropEstimate {
  crop: MasterCrop;
  slotLabel: string;
  plantCount: number;
  yieldLbs: number | null;
  costCents: number | null;
}

function parseSpacing(s: string | null): number {
  if (!s) return 12;
  const num = parseInt(s);
  return isNaN(num) ? 12 : num;
}

const YieldCostEstimator = ({
  crops,
  slotLabels,
  zoneColor,
  bedLengthFt = 10,
  bedWidthFt = 2.5,
  environment,
}: YieldCostEstimatorProps) => {
  const estimates = useMemo((): CropEstimate[] => {
    const bedAreaSqIn = bedLengthFt * 12 * bedWidthFt * 12;

    return crops
      .map((crop, i) => {
        if (!crop) return null;
        const spacing = parseSpacing(crop.spacing_inches);
        // Approximate plant count from bed area / plant footprint
        const plantFootprint = spacing * spacing;
        const plantCount = Math.max(1, Math.floor(bedAreaSqIn / plantFootprint));

        return {
          crop,
          slotLabel: slotLabels[i] || '',
          plantCount,
          yieldLbs: crop.est_yield_lbs_per_plant != null
            ? Math.round(crop.est_yield_lbs_per_plant * plantCount * 10) / 10
            : null,
          costCents: crop.seed_cost_cents != null
            ? crop.seed_cost_cents * plantCount
            : null,
        };
      })
      .filter((e): e is CropEstimate => e !== null);
  }, [crops, slotLabels, bedLengthFt, bedWidthFt]);

  const totalYieldLbs = useMemo(() => {
    const withYield = estimates.filter(e => e.yieldLbs !== null);
    if (withYield.length === 0) return null;
    return Math.round(withYield.reduce((sum, e) => sum + (e.yieldLbs || 0), 0) * 10) / 10;
  }, [estimates]);

  const totalCostDollars = useMemo(() => {
    const withCost = estimates.filter(e => e.costCents !== null);
    if (withCost.length === 0) return null;
    return Math.round(withCost.reduce((sum, e) => sum + (e.costCents || 0), 0)) / 100;
  }, [estimates]);

  const roi = useMemo(() => {
    if (totalYieldLbs == null || totalCostDollars == null || totalCostDollars === 0) return null;
    // Approximate retail value at $3/lb average for organic produce
    const retailValue = totalYieldLbs * 3;
    return Math.round((retailValue / totalCostDollars) * 10) / 10;
  }, [totalYieldLbs, totalCostDollars]);

  if (estimates.length === 0) return null;

  const hasAnyData = estimates.some(e => e.yieldLbs !== null || e.costCents !== null);

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: 'hsl(0 0% 5%)',
      border: `1px solid ${zoneColor}20`,
    }}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4" style={{ color: zoneColor }} />
          <span className="text-[10px] font-mono tracking-wider" style={{ color: `${zoneColor}cc` }}>
            YIELD & COST ESTIMATOR — {bedLengthFt}ft × {bedWidthFt}ft {environment === 'pot' ? 'Container' : 'Bed'}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 35%)' }} />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px] text-[10px]">
              Estimates based on spacing, avg yield per plant, and seed costs. Actual results vary by climate, soil, and practice.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-3">
        <div className="rounded-lg p-2.5" style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 12%)' }}>
          <div className="flex items-center gap-1 mb-1">
            <Scale className="w-3 h-3" style={{ color: 'hsl(130 50% 55%)' }} />
            <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>EST. HARVEST</span>
          </div>
          <div className="text-sm font-mono font-bold" style={{ color: 'hsl(130 50% 55%)' }}>
            {totalYieldLbs != null ? `${totalYieldLbs} lbs` : '—'}
          </div>
        </div>

        <div className="rounded-lg p-2.5" style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 12%)' }}>
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="w-3 h-3" style={{ color: 'hsl(45 80% 55%)' }} />
            <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>INPUT COST</span>
          </div>
          <div className="text-sm font-mono font-bold" style={{ color: 'hsl(45 80% 55%)' }}>
            {totalCostDollars != null ? `$${totalCostDollars.toFixed(2)}` : '—'}
          </div>
        </div>

        <div className="rounded-lg p-2.5" style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 12%)' }}>
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3" style={{ color: 'hsl(200 60% 55%)' }} />
            <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>ROI</span>
          </div>
          <div className="text-sm font-mono font-bold" style={{ color: 'hsl(200 60% 55%)' }}>
            {roi != null ? `${roi}×` : '—'}
          </div>
        </div>
      </div>

      {/* Per-crop breakdown */}
      <div className="px-4 pb-4">
        <table className="w-full text-[9px] font-mono">
          <thead>
            <tr style={{ color: 'hsl(0 0% 40%)', borderBottom: '1px solid hsl(0 0% 12%)' }}>
              <th className="text-left py-1 font-normal">CROP</th>
              <th className="text-left py-1 font-normal">ROLE</th>
              <th className="text-center py-1 font-normal">PLANTS</th>
              <th className="text-right py-1 font-normal">YIELD</th>
              <th className="text-right py-1 font-normal">COST</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((est, i) => (
              <tr key={i} style={{ borderBottom: '1px solid hsl(0 0% 8%)' }}>
                <td className="py-1.5 text-left" style={{ color: 'hsl(0 0% 70%)' }}>
                  {(est.crop.common_name || est.crop.name).substring(0, 20)}
                </td>
                <td className="py-1.5 text-left" style={{ color: 'hsl(0 0% 40%)' }}>
                  {est.slotLabel.substring(0, 12)}
                </td>
                <td className="py-1.5 text-center" style={{ color: 'hsl(0 0% 50%)' }}>
                  ×{est.plantCount}
                </td>
                <td className="py-1.5 text-right" style={{ color: est.yieldLbs != null ? 'hsl(130 50% 55%)' : 'hsl(0 0% 25%)' }}>
                  {est.yieldLbs != null ? `${est.yieldLbs} lb` : '—'}
                </td>
                <td className="py-1.5 text-right" style={{ color: est.costCents != null ? 'hsl(45 80% 55%)' : 'hsl(0 0% 25%)' }}>
                  {est.costCents != null ? `$${(est.costCents / 100).toFixed(2)}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!hasAnyData && (
          <p className="text-[9px] font-mono text-center py-3" style={{ color: 'hsl(0 0% 30%)' }}>
            Yield & cost data not yet populated for these crops. Run the populate-crop-data function with field="est_yield_lbs_per_plant" or "seed_cost_cents".
          </p>
        )}
      </div>
    </div>
  );
};

export default YieldCostEstimator;
