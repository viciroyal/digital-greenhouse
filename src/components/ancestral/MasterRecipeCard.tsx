import { motion } from 'framer-motion';
import { Beaker, Scale } from 'lucide-react';

interface MasterRecipeCardProps {
  color?: string;
}

/**
 * Master Recipe Card - THE MASTER MIX (SOIL RESET)
 * Level 2 specific dosage recipe for soil amendment
 */
const MasterRecipeCard = ({ color = 'hsl(35 80% 50%)' }: MasterRecipeCardProps) => {
  const ingredients = [
    { name: 'Alfalfa Meal', qty: '2 qt' },
    { name: 'Soybean Meal', qty: '1 qt' },
    { name: 'Kelp Meal', qty: '1 qt' },
    { name: 'Sea Agri Minerals', qty: '1 qt' },
    { name: 'Harmony Calcium', qty: '1 qt' },
    { name: 'Worm Castings', qty: '1 qt' },
    { name: 'Humates', qty: '1 qt' },
  ];

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(30 30% 8% / 0.9)',
        border: `2px solid ${color}60`,
        boxShadow: `0 0 30px ${color}20, inset 0 0 20px ${color}10`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{
          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
          borderColor: `${color}40`,
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: `${color}30`,
              border: `1px solid ${color}`,
            }}
          >
            <Beaker 
              className="w-5 h-5" 
              style={{ color, filter: `drop-shadow(0 0 4px ${color})` }} 
            />
          </div>
          <div>
            <h3 
              className="text-lg tracking-wider"
              style={{ 
                fontFamily: "'Staatliches', sans-serif",
                color,
                textShadow: `0 0 10px ${color}50`,
              }}
            >
              THE MASTER MIX
            </h3>
            <p 
              className="text-xs font-mono"
              style={{ color: 'hsl(0 0% 60%)' }}
            >
              SOIL RESET PROTOCOL
            </p>
          </div>
        </div>
      </div>

      {/* The Rule */}
      <div 
        className="px-4 py-3 border-b flex items-center gap-3"
        style={{ 
          background: 'hsl(45 50% 50% / 0.1)',
          borderColor: `${color}30`,
        }}
      >
        <Scale className="w-4 h-4" style={{ color: 'hsl(45 80% 60%)' }} />
        <p 
          className="text-sm font-mono tracking-wide"
          style={{ color: 'hsl(45 80% 65%)' }}
        >
          <span style={{ fontFamily: "'Staatliches', sans-serif", fontSize: '1.1em' }}>
            THE RULE:
          </span>{' '}
          5 Quarts per 60-foot Bed
        </p>
      </div>

      {/* Ingredients Grid */}
      <div className="p-4">
        <p 
          className="text-xs font-mono mb-3 tracking-wider"
          style={{ color: 'hsl(0 0% 50%)' }}
        >
          INGREDIENTS
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ingredients.map((item, i) => (
            <motion.div
              key={item.name}
              className="flex items-center justify-between p-2 rounded-lg"
              style={{
                background: 'hsl(0 0% 10%)',
                border: '1px solid hsl(0 0% 20%)',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
            >
              <span 
                className="text-xs font-mono"
                style={{ color: 'hsl(0 0% 70%)' }}
              >
                {item.name}
              </span>
              <span 
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ 
                  background: `${color}20`,
                  color,
                  border: `1px solid ${color}50`,
                }}
              >
                {item.qty}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div 
        className="px-4 py-3 border-t"
        style={{ borderColor: `${color}30` }}
      >
        <p 
          className="text-[10px] font-mono text-center italic"
          style={{ color: 'hsl(0 0% 45%)' }}
        >
          ◆ Mix dry ingredients first, then incorporate castings ◆
        </p>
      </div>
    </motion.div>
  );
};

export default MasterRecipeCard;
