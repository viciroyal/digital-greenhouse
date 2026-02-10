import { motion } from 'framer-motion';
import { ENVIRONMENTS, type EnvironmentType } from './soilConstants';

interface EnvironmentSelectorProps {
  selected: EnvironmentType;
  onChange: (env: EnvironmentType) => void;
}

const EnvironmentSelector = ({ selected, onChange }: EnvironmentSelectorProps) => {
  return (
    <div className="space-y-2">
      <span
        className="text-[10px] font-mono tracking-widest block"
        style={{ color: 'hsl(0 0% 50%)' }}
      >
        ENVIRONMENT
      </span>
      <div className="grid grid-cols-2 gap-2">
        {ENVIRONMENTS.map((env) => {
          const isSelected = selected === env.id;
          return (
            <motion.button
              key={env.id}
              onClick={() => onChange(env.id)}
              className="flex items-center gap-2 p-3 rounded-lg text-left"
              style={{
                background: isSelected ? 'hsl(35 30% 18%)' : 'hsl(0 0% 10%)',
                border: `2px solid ${isSelected ? 'hsl(35 60% 50%)' : 'hsl(0 0% 18%)'}`,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-xl">{env.icon}</span>
              <div className="min-w-0">
                <span
                  className="text-xs font-mono font-bold block truncate"
                  style={{ color: isSelected ? 'hsl(35 70% 65%)' : 'hsl(0 0% 60%)' }}
                >
                  {env.label}
                </span>
                <span
                  className="text-[9px] font-mono block truncate"
                  style={{ color: isSelected ? 'hsl(35 40% 55%)' : 'hsl(0 0% 40%)' }}
                >
                  {env.description}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default EnvironmentSelector;
