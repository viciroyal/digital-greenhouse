import { useRef, useCallback, useState } from 'react';
import { X, Printer, ChevronDown } from 'lucide-react';
import { getLunarPhase } from '@/hooks/useLunarPhase';
import { type JadamProtocol, type JadamRecipeVariant } from '@/data/jadamProtocols';

interface BrewCardProps {
  protocol: JadamProtocol;
  initialVariantIndex?: number;
  zoneColor: string;
  zoneName: string;
  frequencyHz: number;
  environment: string;
  onClose: () => void;
}

/**
 * Scales a quantity string by a factor, converting units for readability.
 * E.g. "30 gallons" at 1/30 → "1.0 qt", "10 lbs" at 1/30 → "5.3 oz"
 */
const scaleQuantity = (qty: string, isPot: boolean): string => {
  if (!isPot) return qty;
  const match = qty.match(/^([\d.]+)\s*(.*)/);
  if (!match) return qty;
  const num = parseFloat(match[1]);
  const unit = match[2].toLowerCase().trim();
  const scaleFactor = 1 / 30;
  const scaled = num * scaleFactor;

  if (unit.includes('gallon')) {
    const quarts = scaled * 4;
    if (quarts < 0.25) return `${(quarts * 4).toFixed(1)} tbsp`;
    if (quarts < 1) return `${(quarts * 2).toFixed(1)} cups`;
    return `${quarts.toFixed(1)} qt`;
  }
  if (unit.includes('liter')) {
    const ml = scaled * 1000;
    if (ml < 10) return `${ml.toFixed(1)} ml`;
    return `${Math.round(ml)} ml`;
  }
  if (unit.includes('lb')) {
    const oz = scaled * 16;
    if (oz < 1) return `${(oz * 28.35).toFixed(0)} g`;
    return `${oz.toFixed(1)} oz`;
  }
  if (unit.includes('kg')) {
    const g = scaled * 1000;
    return `${Math.round(g)} g`;
  }
  if (unit.match(/^g\b/) || unit.includes('gram')) {
    const g = scaled;
    return g < 1 ? `${(g * 1000).toFixed(0)} mg` : `${g.toFixed(1)} g`;
  }
  if (unit.includes('cup')) {
    const tbsp = scaled * 16;
    return tbsp < 1 ? `${(tbsp * 3).toFixed(1)} tsp` : `${tbsp.toFixed(1)} tbsp`;
  }
  if (unit.includes('tbsp')) {
    const tsp = scaled * 3;
    return tsp < 1 ? `${(tsp * 5).toFixed(1)} ml` : `${tsp.toFixed(1)} tsp`;
  }
  // Dimensionless counts (e.g. "1 medium") — keep as-is
  if (num <= 2 && !unit.match(/\d/)) return qty;
  return `${scaled.toFixed(1)} ${match[2]}`;
};

const BrewCard = ({ protocol, initialVariantIndex = 0, zoneColor, zoneName, frequencyHz, environment, onClose }: BrewCardProps) => {
  const isPot = environment === 'pot';
  const [variantIndex, setVariantIndex] = useState(initialVariantIndex);
  const variant = protocol.variants[variantIndex];
  const cardRef = useRef<HTMLDivElement>(null);
  const lunar = getLunarPhase();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const fermentRange = Array.isArray(variant.fermentationDays)
    ? variant.fermentationDays as [number, number]
    : [variant.fermentationDays, variant.fermentationDays] as [number, number];

  const readyDate = new Date();
  readyDate.setDate(readyDate.getDate() + fermentRange[0]);
  const readyStr = readyDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const readyDateMax = new Date();
  readyDateMax.setDate(readyDateMax.getDate() + fermentRange[1]);
  const readyMaxStr = readyDateMax.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const isInstant = fermentRange[0] === 0 && fermentRange[1] === 0;

  const buildBrewSteps = (v: JadamRecipeVariant): string[] => {
    switch (protocol.id) {
      case 'JMS':
        return [
          'Fill container with non-chlorinated water (rain or well)',
          'Place leaf mold in mesh bag, submerge fully',
          'Add boiled potato (mashed) as carbon starter',
          'Dissolve sea salt and stir gently',
          'Cover loosely — allow gas exchange',
          `Store in shade at 70–85°F for ${fermentRange[0]}–${fermentRange[1]} days`,
          'Ready when biofilm forms and bubbles slow',
        ];
      case 'JLF':
        return [
          `Fill container with ${v.ingredients[0].quantity} non-chlorinated water`,
          `Add ${v.ingredients[1].name.toLowerCase()} to mesh bag or directly`,
          'Add leaf mold starter (JMS inoculant) in mesh bag',
          v.ingredients[3] ? `Add ${v.ingredients[3].name.toLowerCase()} and stir` : 'Stir gently to combine',
          'Seal container — anaerobic fermentation',
          `Ferment ${fermentRange[0]}–${fermentRange[1]} days in shade`,
          'Ready when liquid is dark and odor stabilizes',
        ].filter(Boolean);
      case 'JNP':
        return [
          'Prepare JWA (wetting agent) first if not already made',
          `Add ${v.ingredients[0].quantity} JWA to spray tank`,
          ...v.ingredients.slice(1, -1).map(ing => `Add ${ing.quantity} ${ing.name.toLowerCase()}`),
          `Add ${v.ingredients[v.ingredients.length - 1].quantity} water and mix thoroughly`,
          'Strain through mesh before spraying',
          'Apply to coat all leaf surfaces — spray in evening',
          'Reapply every 5–7 days during pest pressure',
        ];
      default:
        return v.ingredients.map(ing => `Add ${ing.quantity} ${ing.name}`);
    }
  };

  const steps = buildBrewSteps(variant);

  const buildChecklist = (): string[] => {
    switch (protocol.id) {
      case 'JMS':
        return [
          'Water sourced (rain / well / dechlorinated)',
          'Leaf mold collected from diverse forest floor',
          'Potato boiled and mashed',
          'All ingredients combined',
          'Fermentation started — date: ___________',
          'Biofilm observed — date: ___________',
          'First application — date: ___________',
        ];
      case 'JLF':
        return [
          'Water sourced (non-chlorinated)',
          `${variant.ingredients[1].name} prepared`,
          'Leaf mold / JMS starter added',
          'Container sealed for anaerobic ferment',
          'Fermentation started — date: ___________',
          'Liquid darkened / odor stable — date: ___________',
          'First application — date: ___________',
        ];
      case 'JNP':
        return [
          'JWA stock prepared and ready',
          ...variant.ingredients.slice(1, -1).map(ing => `${ing.name} sourced and measured`),
          'All ingredients mixed in spray tank',
          'Test spray on sample leaves — no burn',
          'Full application — date: ___________',
        ];
      default:
        return ['All ingredients sourced', 'Mixed and applied'];
    }
  };

  const checklist = buildChecklist();

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank', 'width=600,height=800');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>${protocol.id} Brew Card — ${today}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; padding: 24px; background: #fff; color: #111; }
        .card { border: 2px solid #222; border-radius: 12px; padding: 24px; max-width: 500px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 12px; margin-bottom: 16px; }
        .title { font-size: 18px; font-weight: bold; letter-spacing: 2px; }
        .subtitle { font-size: 10px; color: #666; margin-top: 4px; letter-spacing: 1px; }
        .meta { display: flex; justify-content: space-between; font-size: 10px; color: #555; margin-bottom: 12px; }
        .meta-item { text-align: center; flex: 1; }
        .meta-label { font-size: 8px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .meta-value { font-size: 12px; font-weight: bold; margin-top: 2px; }
        .section { margin-bottom: 14px; }
        .section-title { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 6px; }
        .ingredient { display: flex; justify-content: space-between; padding: 4px 8px; font-size: 11px; }
        .ingredient:nth-child(even) { background: #f5f5f5; border-radius: 4px; }
        .ingredient-note { font-size: 9px; color: #888; padding-left: 12px; font-style: italic; margin-bottom: 2px; }
        .stats { display: flex; gap: 8px; margin-bottom: 14px; }
        .stat { flex: 1; text-align: center; border: 1px solid #ddd; border-radius: 8px; padding: 8px 4px; }
        .stat-label { font-size: 7px; text-transform: uppercase; letter-spacing: 1px; color: #999; }
        .stat-value { font-size: 11px; font-weight: bold; margin-top: 2px; }
        .steps { font-size: 10px; line-height: 1.8; color: #444; }
        .steps li { margin-bottom: 4px; }
        .safety { background: #fff5f5; border: 1px solid #fdd; border-radius: 8px; padding: 10px; font-size: 9px; color: #a44; }
        .safety-title { font-size: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .footer { text-align: center; font-size: 8px; color: #bbb; margin-top: 16px; letter-spacing: 1px; }
        .checkbox-row { display: flex; align-items: center; gap: 6px; font-size: 10px; padding: 3px 0; color: #444; }
        .checkbox { width: 12px; height: 12px; border: 1px solid #999; border-radius: 2px; }
        .env-badge { text-align: center; padding: 6px; border-radius: 6px; font-size: 10px; font-weight: bold; letter-spacing: 1px; margin-bottom: 12px; }
        @media print { body { padding: 0; } .card { border: 1px solid #ccc; } }
      </style></head><body>
      <div class="card">
        <div class="header">
          <div class="title">${protocol.emoji} ${protocol.id} BREW CARD</div>
          <div class="subtitle">${protocol.fullName} · ${protocol.koreanName}</div>
          <div class="subtitle" style="margin-top:2px">${variant.name}</div>
        </div>
        ${isPot ? '<div class="env-badge" style="background:#e8f5e9;color:#2e7d32;border:1px solid #a5d6a7">🪴 SCALED FOR 1-GAL CONTAINER</div>' : '<div class="env-badge" style="background:#e3f2fd;color:#1565c0;border:1px solid #90caf9">🌱 FULL BATCH (30-GAL)</div>'}
        <div class="meta">
          <div class="meta-item">
            <div class="meta-label">Brew Date</div>
            <div class="meta-value">${today}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Lunar Phase</div>
            <div class="meta-value">${lunar.phaseEmoji} ${lunar.phaseLabel}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Zone</div>
            <div class="meta-value">${frequencyHz}Hz ${zoneName}</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Ingredients${isPot ? ' (scaled 1/30)' : ''}</div>
          ${variant.ingredients.map(ing => `
            <div class="ingredient">
              <span>${ing.name}</span>
              <strong>${scaleQuantity(ing.quantity, isPot)}</strong>
            </div>
            ${ing.note ? `<div class="ingredient-note">↳ ${ing.note}</div>` : ''}
          `).join('')}
        </div>
        <div class="stats">
          <div class="stat">
            <div class="stat-label">Ratio</div>
            <div class="stat-value">${variant.ratio}</div>
          </div>
          <div class="stat">
            <div class="stat-label">${isInstant ? 'Prep' : 'Ferment'}</div>
            <div class="stat-value">${isInstant ? 'Immediate' : `${fermentRange[0]}–${fermentRange[1]} days`}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Ready</div>
            <div class="stat-value">${isInstant ? 'Now' : `${readyStr} – ${readyMaxStr}`}</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">${isInstant ? 'Preparation Steps' : 'Brew Steps'}</div>
          <ol class="steps">
            ${steps.map(s => `<li>${s}</li>`).join('')}
          </ol>
        </div>
        <div class="section">
          <div class="section-title">Application</div>
          <div class="ingredient">
            <span>Dilution</span>
            <strong>${variant.applicationRate}</strong>
          </div>
          <div class="ingredient">
            <span>Method</span>
            <strong>${variant.applicationMethod === 'both' ? 'Foliar + Soil Drench' : variant.applicationMethod === 'foliar' ? 'Foliar Spray' : 'Soil Drench'}</strong>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Brew Log Checklist</div>
          ${checklist.map(item => `
            <div class="checkbox-row"><div class="checkbox"></div> ${item}</div>
          `).join('')}
        </div>
        <div class="safety">
          <div class="safety-title">⚠️ Safety Notes</div>
          ${protocol.safetyNotes.map(n => `<div>• ${n}</div>`).join('')}
        </div>
        <div class="footer">
          JADAM 자연농업 · ${lunar.phaseEmoji} ${lunar.phaseLabel} · ${lunar.zodiacSymbol} ${lunar.zodiacSign} · PHARMBOI FIELD PROTOCOL
        </div>
      </div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  }, [today, lunar, frequencyHz, zoneName, variant, protocol, steps, checklist, fermentRange, isInstant, readyStr, readyMaxStr, isPot]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div
        ref={cardRef}
        className="rounded-xl w-full max-w-md max-h-[85vh] overflow-y-auto"
        style={{ background: 'hsl(0 0% 6%)', border: `1px solid ${protocol.color}30` }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between" style={{ background: 'hsl(0 0% 6%)', borderBottom: `1px solid ${protocol.color}20` }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{protocol.emoji}</span>
            <div>
              <span className="text-[11px] font-mono font-bold block" style={{ color: protocol.color }}>
                {protocol.id} BREW CARD
              </span>
              <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                {protocol.koreanName} · {today}
              </span>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[8px] font-mono tracking-wider"
              style={{ background: `${protocol.color}15`, border: `1px solid ${protocol.color}30`, color: protocol.color }}
            >
              <Printer className="w-3 h-3" /> PRINT
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg"
              style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(0 0% 15%)' }}
            >
              <X className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 45%)' }} />
            </button>
          </div>
        </div>

        <div className="px-4 pb-4 space-y-3 pt-3">
          {/* Variant Selector (if multiple variants) */}
          {protocol.variants.length > 1 && (
            <div>
              <span className="text-[7px] font-mono tracking-wider block mb-1" style={{ color: protocol.color }}>SELECT VARIANT</span>
              <div className="space-y-1">
                {protocol.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setVariantIndex(i)}
                    className="w-full text-left rounded-lg px-2.5 py-2 flex items-center gap-2 transition-all"
                    style={{
                      background: i === variantIndex ? `${protocol.color}12` : 'hsl(0 0% 4%)',
                      border: `1px solid ${i === variantIndex ? `${protocol.color}40` : 'hsl(0 0% 10%)'}`,
                    }}
                  >
                    <ChevronDown
                      className="w-3 h-3 transition-transform"
                      style={{
                        color: i === variantIndex ? protocol.color : 'hsl(0 0% 30%)',
                        transform: i === variantIndex ? 'rotate(0deg)' : 'rotate(-90deg)',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-mono font-bold block" style={{ color: i === variantIndex ? protocol.color : 'hsl(0 0% 50%)' }}>
                        {v.name}
                      </span>
                      <span className="text-[7px] font-mono block" style={{ color: 'hsl(0 0% 35%)' }}>
                        {v.primaryFunction}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Environment Badge */}
          <div
            className="rounded-lg px-2.5 py-1.5 text-center"
            style={{
              background: isPot ? 'hsl(120 30% 12%)' : 'hsl(200 30% 12%)',
              border: `1px solid ${isPot ? 'hsl(120 30% 25%)' : 'hsl(200 30% 25%)'}`,
            }}
          >
            <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: isPot ? 'hsl(120 45% 55%)' : 'hsl(200 45% 55%)' }}>
              {isPot ? '🪴 SCALED FOR 1-GAL CONTAINER' : '🌱 FULL BATCH (30-GAL)'}
            </span>
          </div>

          {/* Lunar + Zone Meta */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: 'LUNAR PHASE', value: `${lunar.phaseEmoji} ${lunar.phaseLabel}` },
              { label: 'ZODIAC', value: `${lunar.zodiacSymbol} ${lunar.zodiacSign}` },
              { label: 'ZONE', value: `${frequencyHz}Hz ${zoneName}` },
            ].map(m => (
              <div key={m.label} className="rounded-lg p-2 text-center" style={{ background: 'hsl(0 0% 4%)', border: '1px solid hsl(0 0% 10%)' }}>
                <span className="text-[6px] font-mono tracking-wider block" style={{ color: 'hsl(0 0% 30%)' }}>{m.label}</span>
                <span className="text-[9px] font-mono font-bold block mt-0.5" style={{ color: zoneColor }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div>
            <span className="text-[7px] font-mono tracking-wider block mb-1" style={{ color: protocol.color }}>
              INGREDIENTS{isPot ? ' (SCALED 1/30)' : ''}
            </span>
            {variant.ingredients.map((ing, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 py-1.5 px-2 rounded" style={{ background: i % 2 === 0 ? 'hsl(0 0% 4%)' : 'transparent' }}>
                  <span className="text-[10px] font-mono flex-1" style={{ color: 'hsl(0 0% 60%)' }}>{ing.name}</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: protocol.color }}>{scaleQuantity(ing.quantity, isPot)}</span>
                </div>
                {ing.note && (
                  <p className="text-[8px] font-mono italic px-2 pb-1" style={{ color: 'hsl(0 0% 35%)' }}>↳ {ing.note}</p>
                )}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className="rounded-lg p-2 text-center" style={{ background: 'hsl(0 0% 4%)', border: '1px solid hsl(0 0% 10%)' }}>
              <span className="text-[6px] font-mono tracking-wider block" style={{ color: 'hsl(0 0% 30%)' }}>RATIO</span>
              <span className="text-[9px] font-mono font-bold block mt-0.5" style={{ color: protocol.color }}>{variant.ratio}</span>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: 'hsl(0 0% 4%)', border: '1px solid hsl(0 0% 10%)' }}>
              <span className="text-[6px] font-mono tracking-wider block" style={{ color: 'hsl(0 0% 30%)' }}>{isInstant ? 'PREP' : 'FERMENT'}</span>
              <span className="text-[9px] font-mono font-bold block mt-0.5" style={{ color: protocol.color }}>
                {isInstant ? 'Immediate' : `${fermentRange[0]}–${fermentRange[1]}d`}
              </span>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: `${protocol.color}08`, border: `1px solid ${protocol.color}20` }}>
              <span className="text-[6px] font-mono tracking-wider block" style={{ color: 'hsl(0 0% 30%)' }}>READY BY</span>
              <span className="text-[9px] font-mono font-bold block mt-0.5" style={{ color: protocol.color }}>
                {isInstant ? 'Now' : readyStr}
              </span>
            </div>
          </div>

          {/* Brew Steps */}
          <div>
            <span className="text-[7px] font-mono tracking-wider block mb-1.5" style={{ color: protocol.color }}>
              {isInstant ? 'PREPARATION STEPS' : 'BREW STEPS'}
            </span>
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2 py-1 px-2 rounded" style={{ background: i % 2 === 0 ? 'hsl(0 0% 4%)' : 'transparent' }}>
                <span className="text-[9px] font-mono font-bold" style={{ color: protocol.color }}>{i + 1}.</span>
                <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 55%)' }}>{step}</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          {variant.notes && (
            <div className="rounded-lg px-2.5 py-2" style={{ background: `${protocol.color}06`, border: `1px solid ${protocol.color}15` }}>
              <span className="text-[7px] font-mono tracking-wider block mb-1" style={{ color: protocol.color }}>📝 NOTES</span>
              <p className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>{variant.notes}</p>
            </div>
          )}

          {/* Safety */}
          <div className="rounded-lg px-2.5 py-2" style={{ background: 'hsl(0 50% 10% / 0.4)', border: '1px solid hsl(0 40% 25% / 0.4)' }}>
            <span className="text-[7px] font-mono tracking-wider block mb-1" style={{ color: 'hsl(0 60% 60%)' }}>⚠️ SAFETY</span>
            {protocol.safetyNotes.map((note, i) => (
              <p key={i} className="text-[8px] font-mono" style={{ color: 'hsl(0 40% 65%)' }}>• {note}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrewCard;
