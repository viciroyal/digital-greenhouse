import { motion } from 'framer-motion';
import { Sprout, TreeDeciduous, Mountain } from 'lucide-react';

export type AccessScale = 'seed' | 'sprout' | 'canopy';

interface ScaleToggleProps {
  value: AccessScale;
  onChange: (scale: AccessScale) => void;
  color: string;
}

const scaleOptions: { id: AccessScale; label: string; description: string; icon: typeof Sprout }[] = [
  {
    id: 'seed',
    label: 'SEED',
    description: 'Pot/Balcony (Zero Cost)',
    icon: Sprout,
  },
  {
    id: 'sprout',
    label: 'SPROUT',
    description: 'Backyard Bed (Low Cost)',
    icon: TreeDeciduous,
  },
  {
    id: 'canopy',
    label: 'CANOPY',
    description: 'Farm (Pro Tools)',
    icon: Mountain,
  },
];

/**
 * SCALE TOGGLE - The Access Key
 * 
 * Adapts protocol content based on the user's access level:
 * - SEED: Zero cost, kitchen scavenger approach
 * - SPROUT: DIY garden center solutions
 * - CANOPY: Professional farm-scale tools
 */
const ScaleToggle = ({ value, onChange, color }: ScaleToggleProps) => {
  return (
    <motion.div
      className="p-4 rounded-xl mb-6"
      style={{
        background: 'hsl(0 0% 8%)',
        border: '1px solid hsl(0 0% 20%)',
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: color }}
        />
        <span
          className="text-xs font-mono tracking-[0.2em] uppercase"
          style={{ color: 'hsl(40 50% 60%)' }}
        >
          ACCESS KEY
        </span>
      </div>

      {/* Toggle Options */}
      <div className="flex gap-2">
        {scaleOptions.map((option) => {
          const isActive = value === option.id;
          const Icon = option.icon;

          return (
            <motion.button
              key={option.id}
              className="flex-1 p-3 rounded-lg text-center transition-all"
              style={{
                background: isActive
                  ? `${color}20`
                  : 'hsl(0 0% 12%)',
                border: isActive
                  ? `2px solid ${color}`
                  : '2px solid hsl(0 0% 25%)',
                boxShadow: isActive
                  ? `0 0 20px ${color}30`
                  : 'none',
              }}
              onClick={() => onChange(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon
                className="w-5 h-5 mx-auto mb-1"
                style={{
                  color: isActive ? color : 'hsl(0 0% 50%)',
                }}
              />
              <span
                className="block text-xs font-mono font-bold tracking-wider"
                style={{
                  color: isActive ? color : 'hsl(0 0% 60%)',
                }}
              >
                {option.label}
              </span>
              <span
                className="block text-[10px] font-mono mt-1 opacity-70"
                style={{
                  color: isActive ? color : 'hsl(0 0% 50%)',
                }}
              >
                {option.description}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Lore Text */}
      <motion.p
        key={value}
        className="text-xs font-mono text-center mt-3 italic"
        style={{ color: 'hsl(40 40% 50%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {value === 'seed' && '"The Maroons built nations with nothing but their hands."'}
        {value === 'sprout' && '"The backyard is the laboratory of the people."'}
        {value === 'canopy' && '"Scale the wisdom to feed the village."'}
      </motion.p>
    </motion.div>
  );
};

export default ScaleToggle;
