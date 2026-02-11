import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown, ChevronRight, Beaker, FlaskConical } from 'lucide-react';
import {
  JADAM_PROTOCOLS, getProtocolsForZone, ZONE_LABELS,
  type JadamProtocol, type JadamRecipeVariant,
} from '@/data/jadamProtocols';

interface JadamPanelProps {
  frequencyHz: number;
  zoneColor: string;
  zoneName: string;
}

/* ─── Zone-Mapped View ─── */
const ZoneMappedView = ({ frequencyHz, zoneColor }: { frequencyHz: number; zoneColor: string }) => {
  const mapped = useMemo(() => getProtocolsForZone(frequencyHz), [frequencyHz]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  if (mapped.length === 0) {
    return (
      <p className="text-[9px] font-mono text-center py-4" style={{ color: 'hsl(0 0% 35%)' }}>
        No JADAM protocols mapped to this zone yet.
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
        {mapped.length} JADAM RECIPE{mapped.length > 1 ? 'S' : ''} FOR THIS ZONE
      </p>
      {mapped.map(({ protocol, variant }, i) => {
        const isOpen = expandedIdx === i;
        return (
          <div
            key={`${protocol.id}-${i}`}
            className="rounded-lg overflow-hidden"
            style={{
              background: isOpen ? `${protocol.color}08` : 'hsl(0 0% 4%)',
              border: `1px solid ${isOpen ? `${protocol.color}30` : 'hsl(0 0% 10%)'}`,
            }}
          >
            <button
              onClick={() => setExpandedIdx(isOpen ? null : i)}
              className="w-full px-3 py-2 flex items-center gap-2 text-left"
            >
              <span className="text-sm">{protocol.emoji}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono font-bold" style={{ color: protocol.color }}>
                  {protocol.id}
                </span>
                <span className="text-[9px] font-mono ml-1.5" style={{ color: 'hsl(0 0% 55%)' }}>
                  {variant.name}
                </span>
              </div>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{
                background: `${zoneColor}15`, color: zoneColor,
              }}>
                {variant.primaryFunction.split(' — ')[0]}
              </span>
              <ChevronRight
                className="w-3 h-3 transition-transform"
                style={{
                  color: 'hsl(0 0% 35%)',
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <RecipeDetail variant={variant} protocol={protocol} zoneColor={zoneColor} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Full Reference View ─── */
const FullReferenceView = ({ zoneColor }: { zoneColor: string }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedVariant, setExpandedVariant] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {JADAM_PROTOCOLS.map(protocol => {
        const isOpen = expandedId === protocol.id;
        return (
          <div
            key={protocol.id}
            className="rounded-lg overflow-hidden"
            style={{
              background: isOpen ? `${protocol.color}06` : 'hsl(0 0% 4%)',
              border: `1px solid ${isOpen ? `${protocol.color}25` : 'hsl(0 0% 10%)'}`,
            }}
          >
            <button
              onClick={() => { setExpandedId(isOpen ? null : protocol.id); setExpandedVariant(null); }}
              className="w-full px-3 py-2.5 flex items-center gap-2 text-left"
            >
              <span className="text-base">{protocol.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold" style={{ color: protocol.color }}>
                    {protocol.name}
                  </span>
                  <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                    {protocol.fullName}
                  </span>
                </div>
                <p className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                  {protocol.koreanName} · {protocol.variants.length} variant{protocol.variants.length > 1 ? 's' : ''}
                </p>
              </div>
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform"
                style={{
                  color: 'hsl(0 0% 35%)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 space-y-2" style={{ borderTop: `1px solid ${protocol.color}15` }}>
                    {/* Description & Science */}
                    <p className="text-[9px] font-mono leading-relaxed pt-2" style={{ color: 'hsl(0 0% 55%)' }}>
                      {protocol.description}
                    </p>
                    <div
                      className="rounded-lg px-2.5 py-2"
                      style={{ background: 'hsl(0 0% 3%)', border: '1px solid hsl(0 0% 10%)' }}
                    >
                      <span className="text-[7px] font-mono tracking-wider block mb-1" style={{ color: protocol.color }}>
                        SCIENCE BASIS
                      </span>
                      <p className="text-[9px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 50%)' }}>
                        {protocol.scienceBasis}
                      </p>
                    </div>

                    {/* Variants */}
                    {protocol.variants.map((variant, vi) => {
                      const vOpen = expandedVariant === vi;
                      return (
                        <div
                          key={vi}
                          className="rounded-lg overflow-hidden"
                          style={{
                            background: vOpen ? `${protocol.color}08` : 'hsl(0 0% 5%)',
                            border: `1px solid ${vOpen ? `${protocol.color}20` : 'hsl(0 0% 10%)'}`,
                          }}
                        >
                          <button
                            onClick={() => setExpandedVariant(vOpen ? null : vi)}
                            className="w-full px-2.5 py-2 flex items-center gap-2 text-left"
                          >
                            <span className="text-[10px] font-mono font-bold flex-1" style={{ color: vOpen ? protocol.color : 'hsl(0 0% 65%)' }}>
                              {variant.name}
                            </span>
                            {/* Zone pills */}
                            <div className="flex gap-0.5">
                              {variant.frequencyAffinity.map(hz => (
                                <span
                                  key={hz}
                                  className="w-2 h-2 rounded-full"
                                  style={{ background: ZONE_LABELS[hz]?.color || '#888' }}
                                  title={`${ZONE_LABELS[hz]?.name || hz}Hz`}
                                />
                              ))}
                            </div>
                            <ChevronRight
                              className="w-2.5 h-2.5 transition-transform"
                              style={{ color: 'hsl(0 0% 30%)', transform: vOpen ? 'rotate(90deg)' : '' }}
                            />
                          </button>
                          <AnimatePresence>
                            {vOpen && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <RecipeDetail variant={variant} protocol={protocol} zoneColor={zoneColor} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}

                    {/* Safety Notes */}
                    {protocol.safetyNotes.length > 0 && (
                      <div
                        className="rounded-lg px-2.5 py-2"
                        style={{ background: 'hsl(0 50% 10% / 0.4)', border: '1px solid hsl(0 40% 25% / 0.4)' }}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <AlertTriangle className="w-3 h-3" style={{ color: 'hsl(0 60% 55%)' }} />
                          <span className="text-[7px] font-mono tracking-wider" style={{ color: 'hsl(0 60% 60%)' }}>
                            SAFETY
                          </span>
                        </div>
                        {protocol.safetyNotes.map((note, ni) => (
                          <p key={ni} className="text-[8px] font-mono leading-relaxed" style={{ color: 'hsl(0 40% 65%)' }}>
                            • {note}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Recipe Detail (shared) ─── */
const RecipeDetail = ({ variant, protocol, zoneColor }: {
  variant: JadamRecipeVariant;
  protocol: JadamProtocol;
  zoneColor: string;
}) => (
  <div className="px-3 pb-3 space-y-2" style={{ borderTop: `1px solid ${protocol.color}10` }}>
    {/* Function */}
    <div className="pt-2">
      <span className="text-[7px] font-mono tracking-wider" style={{ color: protocol.color }}>
        PRIMARY FUNCTION
      </span>
      <p className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 60%)' }}>
        {variant.primaryFunction}
      </p>
    </div>

    {/* Ingredients */}
    <div>
      <span className="text-[7px] font-mono tracking-wider block mb-1" style={{ color: protocol.color }}>
        INGREDIENTS
      </span>
      {variant.ingredients.map((ing, ii) => (
        <div
          key={ii}
          className="flex items-center gap-2 py-1 px-2 rounded"
          style={{ background: ii % 2 === 0 ? 'hsl(0 0% 4%)' : 'transparent' }}
        >
          <span className="text-[9px] font-mono flex-1" style={{ color: 'hsl(0 0% 60%)' }}>
            {ing.name}
          </span>
          <span className="text-[9px] font-mono font-bold" style={{ color: protocol.color }}>
            {ing.quantity}
          </span>
        </div>
      ))}
      {variant.ingredients.some(i => i.note) && (
        <div className="mt-1 space-y-0.5">
          {variant.ingredients.filter(i => i.note).map((ing, ni) => (
            <p key={ni} className="text-[8px] font-mono italic" style={{ color: 'hsl(0 0% 35%)' }}>
              ↳ {ing.name}: {ing.note}
            </p>
          ))}
        </div>
      )}
    </div>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-1.5">
      <StatPill label="RATIO" value={variant.ratio} color={protocol.color} />
      <StatPill
        label="FERMENT"
        value={
          typeof variant.fermentationDays === 'number'
            ? variant.fermentationDays === 0 ? 'Immediate' : `${variant.fermentationDays}d`
            : `${variant.fermentationDays[0]}–${variant.fermentationDays[1]}d`
        }
        color={protocol.color}
      />
      <StatPill
        label="METHOD"
        value={variant.applicationMethod === 'both' ? 'Foliar + Drench' : variant.applicationMethod === 'foliar' ? 'Foliar Spray' : 'Soil Drench'}
        color={protocol.color}
      />
    </div>

    {/* Application rate */}
    <div className="rounded-lg px-2.5 py-1.5" style={{ background: `${protocol.color}08`, border: `1px solid ${protocol.color}15` }}>
      <span className="text-[7px] font-mono tracking-wider" style={{ color: protocol.color }}>APPLICATION RATE</span>
      <p className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 60%)' }}>{variant.applicationRate}</p>
    </div>

    {/* Notes */}
    {variant.notes && (
      <p className="text-[8px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 45%)' }}>
        💡 {variant.notes}
      </p>
    )}

    {/* Zone affinity pills */}
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-[7px] font-mono tracking-wider mr-1" style={{ color: 'hsl(0 0% 30%)' }}>
        ZONES:
      </span>
      {variant.frequencyAffinity.map(hz => {
        const z = ZONE_LABELS[hz];
        return (
          <span
            key={hz}
            className="text-[7px] font-mono px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5"
            style={{ background: `${z?.color || '#888'}18`, color: z?.color || '#888', border: `1px solid ${z?.color || '#888'}30` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: z?.color || '#888' }} />
            {z?.name || hz}Hz
          </span>
        );
      })}
    </div>
  </div>
);

const StatPill = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div
    className="rounded-lg p-1.5 text-center"
    style={{ background: 'hsl(0 0% 4%)', border: '1px solid hsl(0 0% 10%)' }}
  >
    <span className="text-[6px] font-mono tracking-wider block" style={{ color: 'hsl(0 0% 30%)' }}>{label}</span>
    <span className="text-[8px] font-mono font-bold block mt-0.5 leading-tight" style={{ color }}>{value}</span>
  </div>
);

/* ─── Main Panel ─── */
const JadamPanel = ({ frequencyHz, zoneColor, zoneName }: JadamPanelProps) => {
  const [tab, setTab] = useState<'zone' | 'full'>('zone');

  return (
    <div className="space-y-2">
      {/* Tab Switcher */}
      <div className="flex gap-1">
        {[
          { id: 'zone' as const, label: 'ZONE RECIPES', icon: <Beaker className="w-3 h-3" /> },
          { id: 'full' as const, label: 'FULL REFERENCE', icon: <FlaskConical className="w-3 h-3" /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-mono tracking-wider transition-all flex-1 justify-center"
            style={{
              background: tab === t.id ? `${zoneColor}15` : 'hsl(0 0% 5%)',
              border: `1px solid ${tab === t.id ? `${zoneColor}40` : 'hsl(0 0% 12%)'}`,
              color: tab === t.id ? zoneColor : 'hsl(0 0% 40%)',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'zone' ? (
        <ZoneMappedView frequencyHz={frequencyHz} zoneColor={zoneColor} />
      ) : (
        <FullReferenceView zoneColor={zoneColor} />
      )}

      {/* Joseon (Morning Calm) attribution */}
      <p className="text-[7px] font-mono text-center pt-1" style={{ color: 'hsl(0 0% 25%)' }}>
        JADAM 자연농업 · Joseon (Morning Calm) Lineage · Ultra-Low-Cost Sovereignty
      </p>
    </div>
  );
};

export default JadamPanel;
