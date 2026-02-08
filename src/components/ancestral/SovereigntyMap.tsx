import { motion } from 'framer-motion';
import { Home, Utensils, Shirt, Beaker, Sparkles, Leaf } from 'lucide-react';

interface SovereigntyMapProps {
  counts: Record<string, number>;
}

// Module thresholds for visualization
const moduleConfig = {
  shelter: { 
    label: 'Shelter', 
    icon: Home, 
    color: 'hsl(0 70% 45%)',
    threshold: 3,
    visual: 'Bamboo Perimeter',
    description: 'Your shelter foundation is taking root.',
  },
  food: { 
    label: 'Food', 
    icon: Utensils, 
    color: 'hsl(30 50% 40%)',
    threshold: 5,
    visual: 'Sweet Potato Beds',
    description: 'The food garden is growing.',
  },
  clothing: { 
    label: 'Clothing', 
    icon: Shirt, 
    color: 'hsl(15 100% 50%)',
    threshold: 3,
    visual: 'Hemp Field',
    description: 'Fibers for sovereignty.',
  },
  nutrition: { 
    label: 'Nutrition', 
    icon: Beaker, 
    color: 'hsl(51 100% 50%)',
    threshold: 4,
    visual: 'Fermentation Station',
    description: 'The alchemy lab is active.',
  },
  seed: { 
    label: 'Seed', 
    icon: Sparkles, 
    color: 'hsl(280 60% 65%)',
    threshold: 5,
    visual: 'Seed Vault',
    description: 'The future is secured.',
  },
};

/**
 * SOVEREIGNTY MAP
 * 
 * A visual garden that grows as the user logs entries.
 * Replaces badges with meaningful progress visualization.
 */
const SovereigntyMap = ({ counts }: SovereigntyMapProps) => {
  const totalEntries = Object.values(counts).reduce((sum, c) => sum + c, 0);
  
  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(180deg, hsl(140 15% 8%), hsl(30 20% 6%))',
        border: '1px solid hsl(40 30% 20%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4" style={{ color: 'hsl(140 50% 50%)' }} />
          <h3
            className="text-sm font-mono tracking-[0.15em]"
            style={{ color: 'hsl(40 50% 60%)' }}
          >
            SOVEREIGNTY MAP
          </h3>
        </div>
        <span
          className="text-xs font-mono px-2 py-1 rounded-full"
          style={{
            background: 'hsl(140 30% 15%)',
            color: 'hsl(140 50% 60%)',
            border: '1px solid hsl(140 40% 25%)',
          }}
        >
          {totalEntries} Entries
        </span>
      </div>

      {/* Garden Visualization */}
      <div 
        className="relative h-40 mb-4 rounded-xl overflow-hidden"
        style={{
          background: `
            linear-gradient(180deg, 
              hsl(200 30% 12%) 0%, 
              hsl(200 20% 8%) 30%,
              hsl(30 30% 10%) 70%, 
              hsl(20 35% 8%) 100%
            )
          `,
          border: '1px solid hsl(0 0% 15%)',
        }}
      >
        {/* Ground Layer */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: 'linear-gradient(180deg, hsl(30 25% 12%) 0%, hsl(20 30% 8%) 100%)',
          }}
        />

        {/* Shelter - Bamboo Perimeter (Left) */}
        <motion.div
          className="absolute bottom-4 left-4"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: (counts.shelter || 0) >= 1 ? 1 : 0.2, 
            scale: 1 
          }}
          transition={{ delay: 0.1 }}
        >
          {[...Array(Math.min(counts.shelter || 0, 5))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: '4px',
                height: `${20 + i * 8}px`,
                background: `linear-gradient(180deg, hsl(100 40% 45%), hsl(100 35% 30%))`,
                borderRadius: '2px',
                left: `${i * 8}px`,
                bottom: 0,
                boxShadow: '0 0 8px hsl(100 50% 40% / 0.3)',
              }}
              initial={{ height: 0 }}
              animate={{ height: `${20 + i * 8}px` }}
              transition={{ delay: 0.2 + i * 0.1 }}
            />
          ))}
        </motion.div>

        {/* Food - Sweet Potato Mounds (Center-Left) */}
        <motion.div
          className="absolute bottom-4 left-1/4"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: (counts.food || 0) >= 1 ? 1 : 0.2 
          }}
        >
          {[...Array(Math.min(counts.food || 0, 4))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: '24px',
                height: '12px',
                background: `linear-gradient(180deg, hsl(30 50% 35%), hsl(25 45% 25%))`,
                left: `${i * 18}px`,
                bottom: 0,
                boxShadow: '0 2px 6px hsl(30 40% 20% / 0.5)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            />
          ))}
          {(counts.food || 0) >= 2 && (
            <motion.div
              className="absolute"
              style={{
                width: '8px',
                height: '16px',
                background: 'hsl(130 50% 40%)',
                borderRadius: '4px 4px 0 0',
                left: '20px',
                bottom: '10px',
              }}
              initial={{ height: 0 }}
              animate={{ height: '16px' }}
              transition={{ delay: 0.5 }}
            />
          )}
        </motion.div>

        {/* Clothing - Hemp Field (Center) */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: (counts.clothing || 0) >= 1 ? 1 : 0.2 
          }}
        >
          {[...Array(Math.min(counts.clothing || 0, 6))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: '3px',
                height: `${15 + Math.random() * 15}px`,
                background: `linear-gradient(180deg, hsl(80 45% 50%), hsl(80 40% 35%))`,
                borderRadius: '1px',
                left: `${i * 6}px`,
                bottom: 0,
              }}
              initial={{ height: 0 }}
              animate={{ height: `${15 + Math.random() * 15}px` }}
              transition={{ delay: 0.3 + i * 0.08 }}
            />
          ))}
        </motion.div>

        {/* Nutrition - Fermentation Jars (Center-Right) */}
        <motion.div
          className="absolute bottom-4 right-1/4"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: (counts.nutrition || 0) >= 1 ? 1 : 0.2 
          }}
        >
          {[...Array(Math.min(counts.nutrition || 0, 3))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-lg"
              style={{
                width: '14px',
                height: '20px',
                background: `linear-gradient(180deg, hsl(40 30% 25%), hsl(40 40% 15%))`,
                border: '1px solid hsl(51 60% 40%)',
                left: `${i * 18}px`,
                bottom: 0,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              {/* Bubbles */}
              <motion.div
                className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                style={{ background: 'hsl(51 70% 50% / 0.5)' }}
                animate={{ y: [-2, 0, -2], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Seed - Seed Vault (Right) */}
        <motion.div
          className="absolute bottom-4 right-4"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: (counts.seed || 0) >= 1 ? 1 : 0.2 
          }}
        >
          {(counts.seed || 0) >= 1 && (
            <motion.div
              className="relative"
              style={{
                width: '24px',
                height: '28px',
                background: `linear-gradient(180deg, hsl(280 30% 25%), hsl(280 25% 15%))`,
                borderRadius: '4px 4px 8px 8px',
                border: '1px solid hsl(280 50% 45%)',
                boxShadow: '0 0 15px hsl(280 60% 50% / 0.3)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Glow */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'radial-gradient(circle at center, hsl(280 60% 60% / 0.3), transparent)',
                }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Stars (if seed vault active) */}
        {(counts.seed || 0) >= 3 && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: '2px',
                  height: '2px',
                  background: 'hsl(0 0% 90%)',
                  top: `${10 + Math.random() * 30}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </>
        )}
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(moduleConfig).map(([key, config]) => {
          const count = counts[key] || 0;
          const progress = Math.min(count / config.threshold, 1);
          const Icon = config.icon;
          const isComplete = count >= config.threshold;

          return (
            <motion.div
              key={key}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className="w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center"
                style={{
                  background: isComplete ? `${config.color}30` : 'hsl(0 0% 12%)',
                  border: `2px solid ${isComplete ? config.color : 'hsl(0 0% 25%)'}`,
                  boxShadow: isComplete ? `0 0 12px ${config.color}40` : 'none',
                }}
              >
                <Icon 
                  className="w-4 h-4" 
                  style={{ color: isComplete ? config.color : 'hsl(0 0% 40%)' }} 
                />
              </div>
              
              {/* Progress bar */}
              <div
                className="h-1 rounded-full overflow-hidden mb-1"
                style={{ background: 'hsl(0 0% 15%)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: config.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              </div>
              
              <span
                className="text-[9px] font-mono"
                style={{ color: isComplete ? config.color : 'hsl(0 0% 50%)' }}
              >
                {count}/{config.threshold}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SovereigntyMap;
