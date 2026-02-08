import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useState, useMemo } from 'react';
import { getSeasonalResonance } from './SkyWatcherHeader';

interface ModuleNodeProps {
  level: number;
  title: string;
  mission: string;
  lineage: string;
  color: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  isCompleted?: boolean;
  completionPercent?: number;
  onSelect: () => void;
}

/**
 * Module Node - A skill tree node in the Ancestral Path
 */
const ModuleNode = ({ 
  level, 
  title, 
  mission, 
  lineage, 
  color, 
  icon, 
  isUnlocked,
  isCompleted = false,
  completionPercent = 0,
  onSelect 
}: ModuleNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Seasonal dimming logic
  const seasonalResonance = useMemo(() => getSeasonalResonance(), []);
  const isSeasonallyDimmed = seasonalResonance.dimLevels.includes(level);
  const isSeasonallySpotlit = seasonalResonance.spotlightLevels.includes(level);

  const handleClick = () => {
    if (isUnlocked) {
      onSelect();
    } else {
      // Shake animation and show tooltip
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2500);
    }
  };

  return (
    <motion.div
      className="relative flex items-center gap-6 md:gap-10"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: level * 0.1 }}
      style={{
        // Seasonal dimming: reduce opacity for out-of-season levels
        opacity: isSeasonallyDimmed && isUnlocked ? 0.6 : 1,
        filter: isSeasonallyDimmed && isUnlocked ? 'saturate(0.7)' : 'none',
      }}
    >
      {/* Seasonal Spotlight Indicator */}
      {isSeasonallySpotlit && isUnlocked && (
        <motion.div
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{
            background: seasonalResonance.color,
            boxShadow: `0 0 12px ${seasonalResonance.color}`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
      {/* Node Circle */}
      <motion.button
        className="relative flex-shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center"
        style={{
          background: isUnlocked 
            ? level === 5
              ? `radial-gradient(circle at 30% 30%, 
                  hsl(280 30% 85%), 
                  hsl(200 40% 80%), 
                  hsl(45 50% 85%), 
                  hsl(0 0% 20%)
                )` // Iridescent pearl for Level 5
              : `radial-gradient(circle at 30% 30%, ${color}, hsl(0 0% 10%))`
            : 'hsl(0 0% 15%)',
          border: isUnlocked 
            ? level === 5
              ? '3px solid' // Will be styled with borderImage
              : `3px solid ${color}` 
            : '3px solid hsl(0 0% 25%)',
          borderImage: isUnlocked && level === 5
            ? 'linear-gradient(135deg, hsl(280 50% 80%), hsl(200 60% 75%), hsl(45 70% 80%), hsl(320 50% 85%)) 1'
            : undefined,
          boxShadow: isUnlocked 
            ? level === 5
              ? `0 0 30px hsl(0 0% 80%), 0 0 60px hsl(280 30% 60% / 0.4), inset 0 0 20px hsl(0 0% 90% / 0.3)`
              : `0 0 30px ${color}, 0 0 60px ${color}40, inset 0 0 20px ${color}30`
            : 'none',
          cursor: isUnlocked ? 'pointer' : 'not-allowed',
        }}
        onClick={handleClick}
        whileHover={isUnlocked ? { scale: 1.1 } : {}}
        whileTap={isUnlocked ? { scale: 0.95 } : {}}
        animate={isUnlocked ? {
          boxShadow: level === 5 
            ? [
                `0 0 30px hsl(0 0% 80%), 0 0 60px hsl(280 30% 60% / 0.4)`,
                `0 0 50px hsl(0 0% 90%), 0 0 80px hsl(200 40% 70% / 0.6)`,
                `0 0 30px hsl(0 0% 80%), 0 0 60px hsl(45 50% 70% / 0.4)`,
              ]
            : [
                `0 0 30px ${color}, 0 0 60px ${color}40`,
                `0 0 50px ${color}, 0 0 80px ${color}60`,
                `0 0 30px ${color}, 0 0 60px ${color}40`,
              ],
        } : showTooltip ? {
          x: [0, -10, 10, -10, 10, 0],
        } : {}}
        transition={isUnlocked ? {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        } : {
          duration: 0.4,
        }}
      >
        {/* Icon */}
        <div 
          className="w-12 h-12 md:w-16 md:h-16"
          style={{ 
            opacity: isUnlocked ? 1 : 0.3,
            filter: isUnlocked ? `drop-shadow(0 0 10px ${color})` : 'none',
          }}
        >
          {icon}
        </div>

        {/* Lock overlay for locked nodes */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
        )}
      </motion.button>

      {/* Content Card */}
      <motion.div
        className="flex-1 p-4 md:p-6 rounded-2xl max-w-md"
        style={{
          background: isUnlocked 
            ? `linear-gradient(135deg, hsl(0 0% 12%), hsl(0 0% 8%))`
            : 'hsl(0 0% 10% / 0.5)',
          border: isUnlocked 
            ? `1px solid ${color}40` 
            : '1px solid hsl(0 0% 20%)',
          boxShadow: isUnlocked 
            ? `0 0 20px ${color}20` 
            : 'none',
        }}
      >
        {/* Level Badge with completion indicator */}
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="inline-block px-3 py-1 rounded-full text-xs font-mono"
            style={{
              background: isUnlocked ? `${color}20` : 'hsl(0 0% 20%)',
              color: isUnlocked ? color : 'hsl(0 0% 50%)',
              border: `1px solid ${isUnlocked ? color : 'hsl(0 0% 30%)'}`,
            }}
          >
            {title}
          </div>
          {isCompleted && (
            <div 
              className="px-2 py-0.5 rounded text-xs font-mono"
              style={{
                background: 'hsl(140 50% 25%)',
                color: 'hsl(140 70% 60%)',
                border: '1px solid hsl(140 50% 40%)',
              }}
            >
              ✓ COMPLETE
            </div>
          )}
          {!isCompleted && isUnlocked && completionPercent > 0 && (
            <div 
              className="px-2 py-0.5 rounded text-xs font-mono"
              style={{
                background: `${color}20`,
                color: color,
              }}
            >
              {completionPercent}%
            </div>
          )}
        </div>

        {/* Lineage */}
        <p 
          className="text-sm font-mono mb-1"
          style={{ 
            color: isUnlocked ? 'hsl(40 50% 70%)' : 'hsl(0 0% 40%)',
          }}
        >
          {lineage}
        </p>

        {/* Mission */}
        <p 
          className="text-lg md:text-xl tracking-wide"
          style={{ 
            fontFamily: "'Staatliches', sans-serif",
            color: isUnlocked ? 'hsl(0 0% 90%)' : 'hsl(0 0% 45%)',
          }}
        >
          "{mission}"
        </p>
      </motion.div>

      {/* Locked Tooltip */}
      {showTooltip && !isUnlocked && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -top-16 px-4 py-2 rounded-lg z-20 whitespace-nowrap"
          style={{
            background: 'hsl(20 40% 12%)',
            border: '1px solid hsl(40 50% 40%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <p 
            className="text-sm font-mono"
            style={{ color: 'hsl(40 60% 70%)' }}
          >
            ROOTS MUST ESTABLISH BEFORE THE FLOWER BLOOMS
          </p>
          <div 
            className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
            style={{
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid hsl(40 50% 40%)',
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ModuleNode;
