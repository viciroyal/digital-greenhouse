import { motion } from 'framer-motion';
import { Mountain, Droplet, Flame, Crown, Sparkles, Layers } from 'lucide-react';

interface SovereigntyMapProps {
  counts: Record<string, number>;
}

// Zone layer configuration
const layerConfig = {
  root: { 
    label: 'ROOT', 
    sublabel: 'Soil Structure',
    icon: Mountain, 
    color: 'hsl(25 45% 35%)',
    layerColor: 'hsl(25 50% 25%)',
    threshold: 3,
    position: 'bottom',
    height: 20,
  },
  flow: { 
    label: 'FLOW', 
    sublabel: 'Water & Minerals',
    icon: Droplet, 
    color: 'hsl(200 60% 45%)',
    layerColor: 'hsl(200 50% 35%)',
    threshold: 3,
    position: 'lower-mid',
    height: 15,
  },
  fire: { 
    label: 'FIRE', 
    sublabel: 'Atmosphere',
    icon: Flame, 
    color: 'hsl(15 90% 55%)',
    layerColor: 'hsl(15 70% 45%)',
    threshold: 3,
    position: 'upper-mid',
    height: 15,
  },
  gold: { 
    label: 'GOLD', 
    sublabel: 'Harvest',
    icon: Crown, 
    color: 'hsl(45 100% 50%)',
    layerColor: 'hsl(45 80% 45%)',
    threshold: 3,
    position: 'top',
    height: 12,
  },
  seed: { 
    label: 'SEED', 
    sublabel: 'Legacy',
    icon: Sparkles, 
    color: 'hsl(280 60% 65%)',
    layerColor: 'hsl(280 50% 50%)',
    threshold: 3,
    position: 'crown',
    height: 10,
  },
};

type LayerKey = keyof typeof layerConfig;

/**
 * SOVEREIGNTY MAP - The Growth Visualization
 * 
 * A layered visualization that fills in as the user logs observations.
 * Each zone represents a layer of the sovereign ecosystem.
 */
const SovereigntyMap = ({ counts }: SovereigntyMapProps) => {
  const totalEntries = Object.values(counts).reduce((sum, c) => sum + c, 0);
  
  // Calculate layer opacities based on entry counts
  const getLayerOpacity = (key: LayerKey): number => {
    const count = counts[key] || 0;
    const threshold = layerConfig[key].threshold;
    return Math.min(count / threshold, 1);
  };

  // Check if layer is complete
  const isLayerComplete = (key: LayerKey): boolean => {
    return (counts[key] || 0) >= layerConfig[key].threshold;
  };

  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(180deg, hsl(220 20% 8%), hsl(30 20% 6%))',
        border: '1px solid hsl(40 30% 20%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" style={{ color: 'hsl(40 50% 50%)' }} />
          <h3
            className="text-sm font-mono tracking-[0.15em]"
            style={{ color: 'hsl(40 50% 60%)' }}
          >
            THE GROWTH MAP
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
          {totalEntries} Observations
        </span>
      </div>

      {/* Layered Visualization */}
      <div 
        className="relative h-64 mb-6 rounded-xl overflow-hidden"
        style={{
          background: `linear-gradient(180deg, 
            hsl(220 30% 8%) 0%, 
            hsl(240 20% 6%) 100%
          )`,
          border: '1px solid hsl(0 0% 15%)',
        }}
      >
        {/* Stars in sky */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + Math.random()}px`,
              height: `${1 + Math.random()}px`,
              background: 'hsl(0 0% 90%)',
              top: `${5 + Math.random() * 25}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        {/* SEED Layer (Crown/Stars) */}
        <motion.div
          className="absolute top-0 left-0 right-0"
          style={{ height: '15%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: getLayerOpacity('seed') }}
        >
          {isLayerComplete('seed') && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: '8px',
                    height: '8px',
                    background: `radial-gradient(circle, ${layerConfig.seed.color}, transparent)`,
                    top: `${20 + Math.random() * 60}%`,
                    left: `${15 + i * 18}%`,
                    borderRadius: '50%',
                    boxShadow: `0 0 12px ${layerConfig.seed.color}`,
                  }}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* GOLD Layer (Harvest/Canopy) */}
        <motion.div
          className="absolute left-0 right-0"
          style={{ 
            top: '15%',
            height: '20%',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: getLayerOpacity('gold') * 0.9 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, 
                ${layerConfig.gold.layerColor}${Math.floor(getLayerOpacity('gold') * 60).toString(16).padStart(2, '0')}, 
                transparent
              )`,
            }}
          />
          {/* Golden fruits */}
          {(counts.gold || 0) >= 1 && [...Array(Math.min(counts.gold || 0, 5))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: '10px',
                height: '10px',
                background: `radial-gradient(circle at 30% 30%, ${layerConfig.gold.color}, hsl(40 80% 35%))`,
                borderRadius: '50%',
                top: '40%',
                left: `${15 + i * 18}%`,
                boxShadow: `0 0 8px ${layerConfig.gold.color}50`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            />
          ))}
        </motion.div>

        {/* FIRE Layer (Atmosphere/Air) */}
        <motion.div
          className="absolute left-0 right-0"
          style={{ 
            top: '35%',
            height: '20%',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: getLayerOpacity('fire') * 0.7 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, 
                ${layerConfig.fire.layerColor}${Math.floor(getLayerOpacity('fire') * 40).toString(16).padStart(2, '0')}, 
                transparent
              )`,
            }}
          />
          {/* Flame particles */}
          {(counts.fire || 0) >= 1 && [...Array(Math.min(counts.fire || 0, 4))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: '6px',
                height: '12px',
                background: `linear-gradient(180deg, ${layerConfig.fire.color}, transparent)`,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                bottom: '20%',
                left: `${20 + i * 20}%`,
              }}
              animate={{ 
                y: [-2, 2, -2],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>

        {/* FLOW Layer (Water/Blue) */}
        <motion.div
          className="absolute left-0 right-0"
          style={{ 
            top: '55%',
            height: '20%',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: getLayerOpacity('flow') * 0.8 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, 
                transparent,
                ${layerConfig.flow.layerColor}${Math.floor(getLayerOpacity('flow') * 50).toString(16).padStart(2, '0')}
              )`,
            }}
          />
          {/* Water ripples */}
          {(counts.flow || 0) >= 1 && (
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <motion.path
                d={`M0,${50} Q${25},${40} ${50},${50} T${100},${50}`}
                fill="none"
                stroke={layerConfig.flow.color}
                strokeWidth="2"
                strokeOpacity={getLayerOpacity('flow') * 0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
              />
            </svg>
          )}
        </motion.div>

        {/* ROOT Layer (Soil/Brown) - Base */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ 
            height: '25%',
          }}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.3 + getLayerOpacity('root') * 0.7 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, 
                ${layerConfig.root.layerColor}${Math.floor((0.3 + getLayerOpacity('root') * 0.7) * 99).toString(16).padStart(2, '0')}, 
                hsl(20 40% 12%)
              )`,
            }}
          />
          {/* Soil texture */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Root lines */}
          {(counts.root || 0) >= 1 && [...Array(Math.min(counts.root || 0, 5))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: '2px',
                height: `${20 + i * 10}%`,
                background: `linear-gradient(180deg, ${layerConfig.root.color}, transparent)`,
                top: '10%',
                left: `${15 + i * 18}%`,
                borderRadius: '1px',
              }}
              initial={{ height: 0 }}
              animate={{ height: `${20 + i * 10}%` }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            />
          ))}
        </motion.div>

        {/* Center Plant (grows as layers fill) */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: '20%' }}
        >
          {/* Stem */}
          <motion.div
            className="w-1 mx-auto rounded-full"
            style={{
              background: 'linear-gradient(180deg, hsl(120 40% 40%), hsl(120 35% 30%))',
              height: `${Math.min(totalEntries * 8, 80)}px`,
              transformOrigin: 'bottom',
            }}
            initial={{ height: 0 }}
            animate={{ height: `${Math.min(totalEntries * 8, 80)}px` }}
            transition={{ duration: 0.5 }}
          />
          {/* Leaves */}
          {totalEntries >= 3 && (
            <>
              <motion.div
                className="absolute -left-3"
                style={{
                  width: '12px',
                  height: '8px',
                  background: 'hsl(120 45% 35%)',
                  borderRadius: '50% 0 50% 50%',
                  bottom: '40%',
                  transform: 'rotate(-30deg)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              />
              <motion.div
                className="absolute -right-3"
                style={{
                  width: '12px',
                  height: '8px',
                  background: 'hsl(120 45% 35%)',
                  borderRadius: '0 50% 50% 50%',
                  bottom: '50%',
                  transform: 'rotate(30deg)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
              />
            </>
          )}
          {/* Flower/Fruit at top */}
          {totalEntries >= 8 && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 -top-3"
              style={{
                width: '12px',
                height: '12px',
                background: `radial-gradient(circle at 30% 30%, ${layerConfig.gold.color}, hsl(40 80% 40%))`,
                borderRadius: '50%',
                boxShadow: `0 0 10px ${layerConfig.gold.color}60`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
            />
          )}
        </motion.div>
      </div>

      {/* Layer Progress Indicators */}
      <div className="space-y-2">
        {(Object.entries(layerConfig) as [LayerKey, typeof layerConfig[LayerKey]][]).map(([key, config]) => {
          const count = counts[key] || 0;
          const progress = Math.min(count / config.threshold, 1);
          const Icon = config.icon;
          const isComplete = count >= config.threshold;

          return (
            <motion.div
              key={key}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: isComplete ? `${config.color}30` : 'hsl(0 0% 12%)',
                  border: `1px solid ${isComplete ? config.color : 'hsl(0 0% 25%)'}`,
                }}
              >
                <Icon 
                  className="w-4 h-4" 
                  style={{ color: isComplete ? config.color : 'hsl(0 0% 40%)' }} 
                />
              </div>

              {/* Label & Progress */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs font-mono tracking-wider"
                    style={{ color: isComplete ? config.color : 'hsl(0 0% 60%)' }}
                  >
                    {config.label}
                  </span>
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: 'hsl(0 0% 50%)' }}
                  >
                    {count}/{config.threshold}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'hsl(0 0% 15%)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${config.color}80, ${config.color})`,
                      boxShadow: isComplete ? `0 0 8px ${config.color}60` : 'none',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SovereigntyMap;
