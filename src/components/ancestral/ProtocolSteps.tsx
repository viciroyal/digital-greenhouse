import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ProtocolStep {
  step: number;
  title: string;
  description?: string;
}

interface ProtocolStepsProps {
  color: string;
  steps: ProtocolStep[];
  completedSteps?: number[];
}

/**
 * Protocol Steps - Numbered Recipe List
 * Renders the protocol as a visual numbered list
 */
const ProtocolSteps = ({ color, steps, completedSteps = [] }: ProtocolStepsProps) => {
  return (
    <div className="space-y-3">
      <h3 
        className="text-xs font-mono tracking-[0.2em] mb-4"
        style={{ color: 'hsl(40 50% 50%)' }}
      >
        THE PROTOCOL
      </h3>
      
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.step);
          
          return (
            <motion.div
              key={step.step}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: isCompleted 
                  ? `${color}15` 
                  : 'hsl(0 0% 8%)',
                border: isCompleted 
                  ? `1px solid ${color}60` 
                  : '1px solid hsl(0 0% 15%)',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Step number */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: isCompleted ? color : `${color}30`,
                  border: `2px solid ${color}`,
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 
                    className="w-4 h-4" 
                    style={{ color: 'hsl(0 0% 10%)' }} 
                  />
                ) : (
                  <span
                    className="text-sm font-mono font-bold"
                    style={{ color: isCompleted ? 'hsl(0 0% 10%)' : color }}
                  >
                    {step.step}
                  </span>
                )}
              </div>
              
              {/* Step content */}
              <div className="flex-1 pt-1">
                <p 
                  className="text-sm font-mono"
                  style={{ 
                    color: isCompleted ? color : 'hsl(0 0% 80%)',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    opacity: isCompleted ? 0.8 : 1,
                  }}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p 
                    className="text-xs font-mono mt-1 opacity-60"
                    style={{ color: 'hsl(40 40% 60%)' }}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProtocolSteps;
