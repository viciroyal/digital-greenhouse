import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import { AccessScale } from './ScaleToggle';
import { ScaledProtocolStep } from './scaleProtocolData';

interface ScaledProtocolStepsProps {
  color: string;
  steps: ScaledProtocolStep[];
  scale: AccessScale;
  science: string;
}

/**
 * SCALED PROTOCOL STEPS
 * 
 * Renders protocol steps that adapt based on access scale.
 * Shows the universal science principle, then scale-specific tools/actions.
 */
const ScaledProtocolSteps = ({ color, steps, scale, science }: ScaledProtocolStepsProps) => {
  const scaleLabels: Record<AccessScale, string> = {
    seed: '🌱 SEED MODE',
    sprout: '🌿 SPROUT MODE',
    canopy: '🌳 CANOPY MODE',
  };

  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(0 0% 8%)',
        border: `1px solid ${color}40`,
      }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ 
          background: `linear-gradient(135deg, ${color}15, transparent)`,
          borderColor: `${color}30`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4" style={{ color }} />
            <span 
              className="text-xs font-mono tracking-[0.2em] uppercase"
              style={{ color }}
            >
              THE PROTOCOL
            </span>
          </div>
          <span 
            className="text-xs font-mono px-2 py-1 rounded-full"
            style={{ 
              background: `${color}20`,
              color,
              border: `1px solid ${color}50`,
            }}
          >
            {scaleLabels[scale]}
          </span>
        </div>

        {/* Science Principle - Universal */}
        <div 
          className="p-3 rounded-lg mt-3"
          style={{
            background: 'hsl(0 0% 5%)',
            border: '1px dashed hsl(40 40% 30%)',
          }}
        >
          <span 
            className="text-[10px] font-mono tracking-wider uppercase block mb-1"
            style={{ color: 'hsl(40 50% 50%)' }}
          >
            THE SCIENCE (UNIVERSAL)
          </span>
          <p 
            className="text-sm font-mono leading-relaxed"
            style={{ color: 'hsl(40 60% 70%)' }}
          >
            {science}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="p-4 space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={`${scale}-${step.step}`}
            className="flex gap-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Step Number */}
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm"
              style={{
                background: `${color}20`,
                border: `2px solid ${color}`,
                color,
              }}
            >
              {step.step}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <h4 
                className="text-sm font-mono font-bold mb-1"
                style={{ color: 'hsl(0 0% 85%)' }}
              >
                {step.title}
              </h4>

              {/* Tool */}
              {step.tool && (
                <div 
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono mb-2"
                  style={{
                    background: 'hsl(200 40% 15%)',
                    color: 'hsl(200 60% 65%)',
                    border: '1px solid hsl(200 40% 30%)',
                  }}
                >
                  <Wrench className="w-3 h-3" />
                  {step.tool}
                </div>
              )}

              {/* Source */}
              {step.source && (
                <span 
                  className="text-xs font-mono ml-2"
                  style={{ color: 'hsl(140 40% 50%)' }}
                >
                  ({step.source})
                </span>
              )}

              {/* Action */}
              {step.action && (
                <p 
                  className="text-xs font-mono leading-relaxed mt-1"
                  style={{ color: 'hsl(40 40% 60%)' }}
                >
                  {step.action}
                </p>
              )}

              {/* Description (legacy support) */}
              {step.description && !step.action && (
                <p 
                  className="text-xs font-mono opacity-70 mt-1"
                  style={{ color: 'hsl(0 0% 60%)' }}
                >
                  {step.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScaledProtocolSteps;
