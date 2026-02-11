import { useRef, useCallback } from 'react';
import { X, Printer } from 'lucide-react';
import { getLunarPhase } from '@/hooks/useLunarPhase';
import { JADAM_PROTOCOLS } from '@/data/jadamProtocols';

interface BrewJmsCardProps {
  zoneColor: string;
  zoneName: string;
  frequencyHz: number;
  onClose: () => void;
}

const JMS = JADAM_PROTOCOLS.find(p => p.id === 'JMS')!;
const JMS_VARIANT = JMS.variants[0];

const BrewJmsCard = ({ zoneColor, zoneName, frequencyHz, onClose }: BrewJmsCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const lunar = getLunarPhase();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const fermentRange = JMS_VARIANT.fermentationDays as [number, number];
  const readyDate = new Date();
  readyDate.setDate(readyDate.getDate() + fermentRange[0]);
  const readyStr = readyDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const readyDateMax = new Date();
  readyDateMax.setDate(readyDateMax.getDate() + fermentRange[1]);
  const readyMaxStr = readyDateMax.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const handlePrint = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    const printWindow = window.open('', '_blank', 'width=600,height=800');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>JMS Brew Card — ${today}</title>
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
        @media print { body { padding: 0; } .card { border: 1px solid #ccc; } }
      </style></head><body>
      <div class="card">
        <div class="header">
          <div class="title">🦠 JMS BREW CARD</div>
          <div class="subtitle">JADAM MICROBIAL SOLUTION · 자닮미생물</div>
        </div>
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
          <div class="section-title">Ingredients</div>
          ${JMS_VARIANT.ingredients.map(ing => `
            <div class="ingredient">
              <span>${ing.name}</span>
              <strong>${ing.quantity}</strong>
            </div>
            ${ing.note ? `<div class="ingredient-note">↳ ${ing.note}</div>` : ''}
          `).join('')}
        </div>
        <div class="stats">
          <div class="stat">
            <div class="stat-label">Ratio</div>
            <div class="stat-value">${JMS_VARIANT.ratio}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Ferment</div>
            <div class="stat-value">${fermentRange[0]}–${fermentRange[1]} days</div>
          </div>
          <div class="stat">
            <div class="stat-label">Ready</div>
            <div class="stat-value">${readyStr} – ${readyMaxStr}</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Brew Steps</div>
          <ol class="steps">
            <li>Fill container with ${JMS_VARIANT.ingredients[0].quantity} non-chlorinated water</li>
            <li>Place leaf mold in mesh bag, submerge in water</li>
            <li>Add boiled potato (mashed) as carbon starter</li>
            <li>Dissolve sea salt and stir gently</li>
            <li>Cover loosely — allow gas exchange</li>
            <li>Store in shade at 70–85°F for ${fermentRange[0]}–${fermentRange[1]} days</li>
            <li>Ready when biofilm forms on surface and bubbles slow</li>
          </ol>
        </div>
        <div class="section">
          <div class="section-title">Application</div>
          <div class="ingredient">
            <span>Dilution</span>
            <strong>${JMS_VARIANT.applicationRate}</strong>
          </div>
          <div class="ingredient">
            <span>Method</span>
            <strong>Foliar + Soil Drench</strong>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Brew Log Checklist</div>
          <div class="checkbox-row"><div class="checkbox"></div> Water sourced (rain / well / dechlorinated)</div>
          <div class="checkbox-row"><div class="checkbox"></div> Leaf mold collected from diverse forest floor</div>
          <div class="checkbox-row"><div class="checkbox"></div> Potato boiled and mashed</div>
          <div class="checkbox-row"><div class="checkbox"></div> All ingredients combined</div>
          <div class="checkbox-row"><div class="checkbox"></div> Fermentation started — date: ___________</div>
          <div class="checkbox-row"><div class="checkbox"></div> Biofilm observed — date: ___________</div>
          <div class="checkbox-row"><div class="checkbox"></div> First application — date: ___________</div>
        </div>
        <div class="safety">
          <div class="safety-title">⚠️ Safety Notes</div>
          ${JMS.safetyNotes.map(n => `<div>• ${n}</div>`).join('')}
        </div>
        <div class="footer">
          JADAM 자연농업 · ${lunar.phaseEmoji} ${lunar.phaseLabel} · ${lunar.zodiacSymbol} ${lunar.zodiacSign} · PHARMBOI FIELD PROTOCOL
        </div>
      </div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  }, [today, lunar, frequencyHz, zoneName]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div
        ref={cardRef}
        className="rounded-xl w-full max-w-md max-h-[85vh] overflow-y-auto"
        style={{ background: 'hsl(0 0% 6%)', border: `1px solid ${zoneColor}30` }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between" style={{ background: 'hsl(0 0% 6%)', borderBottom: `1px solid ${zoneColor}20` }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">🦠</span>
            <div>
              <span className="text-[11px] font-mono font-bold block" style={{ color: JMS.color }}>
                JMS BREW CARD
              </span>
              <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                자닮미생물 · {today}
              </span>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[8px] font-mono tracking-wider"
              style={{ background: `${JMS.color}15`, border: `1px solid ${JMS.color}30`, color: JMS.color }}
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
            <span className="text-[7px] font-mono tracking-wider block mb-1" style={{ color: JMS.color }}>INGREDIENTS</span>
            {JMS_VARIANT.ingredients.map((ing, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 py-1.5 px-2 rounded" style={{ background: i % 2 === 0 ? 'hsl(0 0% 4%)' : 'transparent' }}>
                  <span className="text-[10px] font-mono flex-1" style={{ color: 'hsl(0 0% 60%)' }}>{ing.name}</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: JMS.color }}>{ing.quantity}</span>
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
              <span className="text-[9px] font-mono font-bold block mt-0.5" style={{ color: JMS.color }}>{JMS_VARIANT.ratio}</span>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: 'hsl(0 0% 4%)', border: '1px solid hsl(0 0% 10%)' }}>
              <span className="text-[6px] font-mono tracking-wider block" style={{ color: 'hsl(0 0% 30%)' }}>FERMENT</span>
              <span className="text-[9px] font-mono font-bold block mt-0.5" style={{ color: JMS.color }}>{fermentRange[0]}–{fermentRange[1]}d</span>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: `${JMS.color}08`, border: `1px solid ${JMS.color}20` }}>
              <span className="text-[6px] font-mono tracking-wider block" style={{ color: 'hsl(0 0% 30%)' }}>READY BY</span>
              <span className="text-[9px] font-mono font-bold block mt-0.5" style={{ color: JMS.color }}>{readyStr}</span>
            </div>
          </div>

          {/* Brew Steps */}
          <div>
            <span className="text-[7px] font-mono tracking-wider block mb-1.5" style={{ color: JMS.color }}>BREW STEPS</span>
            {[
              'Fill container with non-chlorinated water (rain or well)',
              'Place leaf mold in mesh bag, submerge fully',
              'Add boiled potato (mashed) as carbon starter',
              'Dissolve sea salt and stir gently',
              'Cover loosely — allow gas exchange',
              `Store in shade at 70–85°F for ${fermentRange[0]}–${fermentRange[1]} days`,
              'Ready when biofilm forms and bubbles slow',
            ].map((step, i) => (
              <div key={i} className="flex gap-2 py-1 px-2 rounded" style={{ background: i % 2 === 0 ? 'hsl(0 0% 4%)' : 'transparent' }}>
                <span className="text-[9px] font-mono font-bold" style={{ color: JMS.color }}>{i + 1}.</span>
                <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 55%)' }}>{step}</span>
              </div>
            ))}
          </div>

          {/* Safety */}
          <div className="rounded-lg px-2.5 py-2" style={{ background: 'hsl(0 50% 10% / 0.4)', border: '1px solid hsl(0 40% 25% / 0.4)' }}>
            <span className="text-[7px] font-mono tracking-wider block mb-1" style={{ color: 'hsl(0 60% 60%)' }}>⚠️ SAFETY</span>
            {JMS.safetyNotes.map((note, i) => (
              <p key={i} className="text-[8px] font-mono" style={{ color: 'hsl(0 40% 65%)' }}>• {note}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrewJmsCard;
