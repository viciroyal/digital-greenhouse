import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { HARMONIZATION_RULES, FREQUENCY_PROTOCOLS } from './soilConstants';

interface HarmonizationPanelProps {
  selectedHz: number | null;
}

const HarmonizationPanel = ({ selectedHz }: HarmonizationPanelProps) => {
  if (!selectedHz) return null;

  const relevantRules = HARMONIZATION_RULES.filter(
    (r) => r.requiredHz === selectedHz || r.dependsOnHz === selectedHz
  );

  if (relevantRules.length === 0) return null;

  return (
    <motion.div
      className="p-3 rounded-lg space-y-2"
      style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 18%)' }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
    >
      <span className="text-[10px] font-mono tracking-widest block" style={{ color: 'hsl(45 60% 55%)' }}>
        ⚡ HARMONIC RELATIONSHIPS
      </span>

      {relevantRules.map((rule) => {
        const isRequired = rule.requiredHz === selectedHz;
        const otherHz = isRequired ? rule.dependsOnHz : rule.requiredHz;
        const otherZone = FREQUENCY_PROTOCOLS[otherHz];
        const isSevere = rule.severity === 'warning';

        return (
          <div
            key={rule.id}
            className="flex items-start gap-2 p-2 rounded"
            style={{
              background: isSevere ? 'hsl(45 30% 10%)' : 'hsl(210 20% 10%)',
              border: `1px solid ${isSevere ? 'hsl(45 50% 30%)' : 'hsl(210 30% 25%)'}`,
            }}
          >
            {isSevere ? (
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'hsl(45 70% 55%)' }} />
            ) : (
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'hsl(210 50% 55%)' }} />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-mono font-bold" style={{ color: isSevere ? 'hsl(45 70% 60%)' : 'hsl(210 50% 65%)' }}>
                  {rule.name}
                </span>
                {isRequired && (
                  <span
                    className="text-[8px] font-mono px-1 py-0.5 rounded"
                    style={{ background: `${otherZone?.color || 'hsl(0 0% 30%)'}25`, color: otherZone?.color || 'hsl(0 0% 60%)' }}
                  >
                    NEEDS {otherHz}Hz
                  </span>
                )}
                {!isRequired && (
                  <span
                    className="text-[8px] font-mono px-1 py-0.5 rounded"
                    style={{ background: 'hsl(120 20% 15%)', color: 'hsl(120 50% 55%)' }}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 inline mr-0.5" />
                    SUPPORTS {rule.requiredHz}Hz
                  </span>
                )}
              </div>
              <span className="text-[9px] font-mono leading-relaxed block" style={{ color: 'hsl(0 0% 55%)' }}>
                {rule.message}
              </span>
            </div>
          </div>
        );
      })}

      {/* Mineral recommendation for selected zone */}
      {FREQUENCY_PROTOCOLS[selectedHz] && (
        <div
          className="p-2 rounded mt-1"
          style={{
            background: `${FREQUENCY_PROTOCOLS[selectedHz].color}10`,
            border: `1px solid ${FREQUENCY_PROTOCOLS[selectedHz].color}30`,
          }}
        >
          <span className="text-[9px] font-mono block mb-0.5" style={{ color: FREQUENCY_PROTOCOLS[selectedHz].color }}>
            🧪 {FREQUENCY_PROTOCOLS[selectedHz].mineral}
          </span>
          <span className="text-[9px] font-mono block" style={{ color: 'hsl(0 0% 55%)' }}>
            {FREQUENCY_PROTOCOLS[selectedHz].soilNote}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default HarmonizationPanel;
