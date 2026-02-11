import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export interface SoilTestData {
  pH: number | null;
  N: number | null;    // ppm
  P: number | null;    // ppm
  K: number | null;    // ppm
  Ca: number | null;   // ppm
  Mg: number | null;   // ppm
  S: number | null;    // ppm
  Si: number | null;   // ppm
  Fe: number | null;   // ppm
  OM: number | null;   // organic matter %
  CEC: number | null;  // meq/100g
}

export const EMPTY_SOIL_TEST: SoilTestData = {
  pH: null, N: null, P: null, K: null, Ca: null, Mg: null,
  S: null, Si: null, Fe: null, OM: null, CEC: null,
};

// Optimal ranges (universal targets, overridden by zone-specific NIR when available)
const OPTIMAL_RANGES: Record<keyof SoilTestData, { min: number; max: number; unit: string; label: string; step: number; sliderMax: number }> = {
  pH:  { min: 6.0, max: 7.0, unit: '', label: 'pH', step: 0.1, sliderMax: 9 },
  N:   { min: 40, max: 80, unit: 'ppm', label: 'Nitrogen (N)', step: 1, sliderMax: 150 },
  P:   { min: 40, max: 80, unit: 'ppm', label: 'Phosphorus (P)', step: 1, sliderMax: 150 },
  K:   { min: 150, max: 300, unit: 'ppm', label: 'Potassium (K)', step: 5, sliderMax: 500 },
  Ca:  { min: 1500, max: 3000, unit: 'ppm', label: 'Calcium (Ca)', step: 50, sliderMax: 5000 },
  Mg:  { min: 200, max: 400, unit: 'ppm', label: 'Magnesium (Mg)', step: 10, sliderMax: 800 },
  S:   { min: 15, max: 40, unit: 'ppm', label: 'Sulfur (S)', step: 1, sliderMax: 80 },
  Si:  { min: 50, max: 150, unit: 'ppm', label: 'Silica (Si)', step: 5, sliderMax: 300 },
  Fe:  { min: 50, max: 200, unit: 'ppm', label: 'Iron (Fe)', step: 5, sliderMax: 400 },
  OM:  { min: 5, max: 12, unit: '%', label: 'Organic Matter', step: 0.5, sliderMax: 20 },
  CEC: { min: 12, max: 25, unit: 'meq', label: 'CEC', step: 1, sliderMax: 50 },
};

// Which amendments address which deficiency
export const NUTRIENT_TO_AMENDMENT: Record<string, { ids: string[]; boostLabel: string }> = {
  N:  { ids: ['alfalfa', 'soybean', 'neem'], boostLabel: 'Increase Alfalfa Meal, Soybean Meal, or Neem Cake' },
  P:  { ids: ['fishbone'], boostLabel: 'Increase Fish Bone Meal' },
  K:  { ids: ['kelp', 'langbeinite'], boostLabel: 'Increase Kelp Meal or Langbeinite' },
  Ca: { ids: ['harmony', 'gypsum'], boostLabel: 'Increase Harmony Calcium or Gypsum' },
  Mg: { ids: ['epsom', 'langbeinite'], boostLabel: 'Increase Epsom Salt or Langbeinite' },
  S:  { ids: ['gypsum', 'langbeinite'], boostLabel: 'Increase Gypsum or Langbeinite' },
  Si: { ids: ['diatomaceous'], boostLabel: 'Increase Diatomaceous Earth' },
  Fe: { ids: ['azomite'], boostLabel: 'Increase Azomite Rock Dust' },
  OM: { ids: ['humates', 'wormcast'], boostLabel: 'Increase Humates or Worm Castings' },
  CEC: { ids: ['humates', 'wormcast', 'cococoir'], boostLabel: 'Increase Humates, Worm Castings, or Coco Coir' },
};

export type NutrientStatus = 'deficient' | 'optimal' | 'excess' | 'unknown';

export interface NutrientDiagnosis {
  key: string;
  label: string;
  value: number;
  status: NutrientStatus;
  pctOfOptimal: number; // 0–200+ scale, 100 = middle of optimal
  recommendation: string;
  amendmentIds: string[];
  multiplier: number; // 0.5 = reduce by half, 1 = normal, 1.5 = increase 50%, 2 = double
}

export function diagnoseSoilTest(data: SoilTestData): NutrientDiagnosis[] {
  const results: NutrientDiagnosis[] = [];

  for (const [key, range] of Object.entries(OPTIMAL_RANGES)) {
    const value = data[key as keyof SoilTestData];
    if (value === null) continue;

    const midOptimal = (range.min + range.max) / 2;
    const pctOfOptimal = (value / midOptimal) * 100;

    let status: NutrientStatus = 'optimal';
    let recommendation = 'Within optimal range — maintain current protocol.';
    let multiplier = 1;

    if (key === 'pH') {
      if (value < range.min) {
        status = 'deficient';
        recommendation = `pH ${value} is too acidic. Add lime or Harmony Calcium to raise pH.`;
        multiplier = 1.5;
      } else if (value > range.max) {
        status = 'excess';
        recommendation = `pH ${value} is too alkaline. Add elemental sulfur or Gypsum to lower pH.`;
        multiplier = 1.5;
      }
    } else {
      if (value < range.min) {
        status = 'deficient';
        const deficit = Math.round(((range.min - value) / range.min) * 100);
        multiplier = value < range.min * 0.5 ? 2 : 1.5;
        recommendation = `${deficit}% below minimum — ${NUTRIENT_TO_AMENDMENT[key]?.boostLabel || 'increase amendment'}.`;
      } else if (value > range.max) {
        status = 'excess';
        const excess = Math.round(((value - range.max) / range.max) * 100);
        multiplier = value > range.max * 1.5 ? 0.25 : 0.5;
        recommendation = `${excess}% above maximum — reduce or skip related amendments.`;
      }
    }

    results.push({
      key,
      label: range.label,
      value,
      status,
      pctOfOptimal,
      recommendation,
      amendmentIds: NUTRIENT_TO_AMENDMENT[key]?.ids || [],
      multiplier,
    });
  }

  return results;
}

// Calculate amendment adjustment multipliers from soil test
export function getAmendmentAdjustments(diagnoses: NutrientDiagnosis[]): Record<string, { multiplier: number; reason: string }> {
  const adjustments: Record<string, { multiplier: number; reason: string }> = {};

  for (const d of diagnoses) {
    if (d.status === 'optimal') continue;

    for (const amendId of d.amendmentIds) {
      const existing = adjustments[amendId];
      if (!existing || (d.status === 'deficient' && d.multiplier > existing.multiplier) || (d.status === 'excess' && d.multiplier < existing.multiplier)) {
        adjustments[amendId] = {
          multiplier: d.multiplier,
          reason: d.status === 'deficient'
            ? `↑ ${d.label} deficient (${d.value} ${OPTIMAL_RANGES[d.key as keyof SoilTestData]?.unit || 'ppm'})`
            : `↓ ${d.label} excess (${d.value} ${OPTIMAL_RANGES[d.key as keyof SoilTestData]?.unit || 'ppm'})`,
        };
      }
    }
  }

  return adjustments;
}

interface SoilTestInputProps {
  soilTest: SoilTestData;
  onChange: (data: SoilTestData) => void;
}

const SoilTestInput = ({ soilTest, onChange }: SoilTestInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const diagnoses = diagnoseSoilTest(soilTest);
  const hasData = Object.values(soilTest).some(v => v !== null);
  const deficiencyCount = diagnoses.filter(d => d.status === 'deficient').length;
  const excessCount = diagnoses.filter(d => d.status === 'excess').length;

  const updateField = (key: keyof SoilTestData, val: number | null) => {
    onChange({ ...soilTest, [key]: val });
  };

  const clearAll = () => onChange({ ...EMPTY_SOIL_TEST });

  return (
    <div className="mt-4 rounded-lg overflow-hidden" style={{ border: '1px solid hsl(200 30% 25%)', background: 'hsl(200 20% 8%)' }}>
      {/* Toggle Header */}
      <button
        className="w-full p-3 flex items-center justify-between"
        style={{ background: 'hsl(200 20% 10%)' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Beaker className="w-4 h-4" style={{ color: 'hsl(200 60% 60%)' }} />
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(200 50% 65%)' }}>
            SOIL TEST DATA (Optional)
          </span>
          {hasData && (
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
              background: deficiencyCount > 0 ? 'hsl(0 40% 15%)' : 'hsl(120 30% 15%)',
              color: deficiencyCount > 0 ? 'hsl(0 60% 60%)' : 'hsl(120 50% 60%)',
            }}>
              {diagnoses.length} tested • {deficiencyCount} low • {excessCount} high
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" style={{ color: 'hsl(0 0% 40%)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'hsl(0 0% 40%)' }} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-3">
              <p className="text-[9px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 45%)' }}>
                Enter values from your soil lab report. The mix protocol will auto-adjust quantities based on your actual soil conditions.
                Leave fields blank for standard protocol.
              </p>

              {/* Input Fields */}
              <div className="space-y-2">
                {(Object.entries(OPTIMAL_RANGES) as [keyof SoilTestData, typeof OPTIMAL_RANGES[keyof SoilTestData]][]).map(([key, range]) => {
                  const value = soilTest[key];
                  const isSet = value !== null;
                  const diagnosis = diagnoses.find(d => d.key === key);

                  const statusColor = !diagnosis ? 'hsl(0 0% 30%)'
                    : diagnosis.status === 'deficient' ? 'hsl(0 60% 55%)'
                    : diagnosis.status === 'excess' ? 'hsl(45 70% 55%)'
                    : 'hsl(120 50% 50%)';

                  return (
                    <div key={key} className="p-2 rounded-lg" style={{ background: 'hsl(0 0% 6%)', border: `1px solid ${isSet ? statusColor + '40' : 'hsl(0 0% 15%)'}` }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono" style={{ color: isSet ? statusColor : 'hsl(0 0% 50%)' }}>
                            {range.label}
                          </span>
                          {diagnosis && (
                            <span className="flex items-center gap-0.5">
                              {diagnosis.status === 'deficient' && <ArrowDown className="w-2.5 h-2.5" style={{ color: statusColor }} />}
                              {diagnosis.status === 'excess' && <ArrowUp className="w-2.5 h-2.5" style={{ color: statusColor }} />}
                              {diagnosis.status === 'optimal' && <CheckCircle2 className="w-2.5 h-2.5" style={{ color: statusColor }} />}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isSet ? (
                            <span className="text-sm font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: `${statusColor}15`, color: statusColor }}>
                              {value}{range.unit ? ` ${range.unit}` : ''}
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>not set</span>
                          )}
                          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
                            opt: {range.min}–{range.max}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Slider
                          value={[value ?? 0]}
                          onValueChange={([v]) => updateField(key, v)}
                          min={key === 'pH' ? 4 : 0}
                          max={range.sliderMax}
                          step={range.step}
                          className="flex-1"
                        />
                        {isSet && (
                          <button
                            onClick={() => updateField(key, null)}
                            className="text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0"
                            style={{ background: 'hsl(0 0% 12%)', color: 'hsl(0 0% 40%)', border: '1px solid hsl(0 0% 20%)' }}
                          >
                            CLR
                          </button>
                        )}
                      </div>

                      {/* Recommendation */}
                      {diagnosis && diagnosis.status !== 'optimal' && (
                        <div className="mt-1 flex items-start gap-1">
                          <AlertTriangle className="w-2.5 h-2.5 shrink-0 mt-0.5" style={{ color: statusColor }} />
                          <span className="text-[8px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 45%)' }}>
                            {diagnosis.recommendation}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              {hasData && (
                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid hsl(0 0% 15%)' }}>
                  <div className="flex items-center gap-2">
                    {deficiencyCount > 0 && (
                      <span className="text-[9px] font-mono flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: 'hsl(0 30% 12%)', color: 'hsl(0 60% 60%)' }}>
                        <ArrowDown className="w-3 h-3" /> {deficiencyCount} deficient
                      </span>
                    )}
                    {excessCount > 0 && (
                      <span className="text-[9px] font-mono flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: 'hsl(45 30% 12%)', color: 'hsl(45 70% 60%)' }}>
                        <ArrowUp className="w-3 h-3" /> {excessCount} excess
                      </span>
                    )}
                    {deficiencyCount === 0 && excessCount === 0 && (
                      <span className="text-[9px] font-mono flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: 'hsl(120 20% 12%)', color: 'hsl(120 50% 55%)' }}>
                        <CheckCircle2 className="w-3 h-3" /> All within optimal range
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearAll}
                    className="text-[9px] font-mono px-2 py-0.5 rounded"
                    style={{ background: 'hsl(0 0% 12%)', color: 'hsl(0 0% 45%)', border: '1px solid hsl(0 0% 20%)' }}
                  >
                    CLEAR ALL
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoilTestInput;
