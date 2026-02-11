import { motion } from 'framer-motion';
import { AlertTriangle, XCircle, Music, Leaf, TreePine, Bug, Waves } from 'lucide-react';
import { DissonanceCheck, ConflictType } from '@/hooks/useAutoGeneration';

interface DissonanceWarningProps {
  check: DissonanceCheck;
  onDismiss?: () => void;
  onProceed?: () => void;
}

const CONFLICT_BADGE: Record<ConflictType, { icon: typeof Leaf; color: string; label: string }> = {
  Nutritional: { icon: Leaf, color: 'hsl(120 50% 45%)', label: 'NUTRITIONAL' },
  Structural: { icon: TreePine, color: 'hsl(30 70% 50%)', label: 'STRUCTURAL' },
  Pathological: { icon: Bug, color: 'hsl(0 60% 50%)', label: 'PATHOLOGICAL' },
  Vibrational: { icon: Waves, color: 'hsl(270 60% 55%)', label: 'VIBRATIONAL' },
};

const DissonanceWarning = ({ check, onDismiss, onProceed }: DissonanceWarningProps) => {
  if (!check.isDissonant) return null;

  const isError = check.severity === 'error';
  const bgColor = isError ? 'hsl(0 40% 12%)' : 'hsl(45 40% 12%)';
  const borderColor = isError ? 'hsl(0 60% 45%)' : 'hsl(45 70% 50%)';
  const textColor = isError ? 'hsl(0 70% 60%)' : 'hsl(45 80% 60%)';
  const Icon = isError ? XCircle : AlertTriangle;

  const badge = check.conflictType ? CONFLICT_BADGE[check.conflictType] : null;
  const BadgeIcon = badge?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: bgColor,
        border: `2px solid ${borderColor}`,
        boxShadow: `0 0 30px ${borderColor}40`,
      }}
    >
      {/* Header */}
      <div
        className="p-3 flex items-center gap-2"
        style={{ background: `${borderColor}30`, borderBottom: `1px solid ${borderColor}` }}
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <Icon className="w-5 h-5" style={{ color: textColor }} />
        </motion.div>
        <span className="text-sm font-mono font-bold tracking-wider" style={{ color: textColor }}>
          DISSONANCE DETECTED
        </span>

        {/* Conflict Type Badge */}
        {badge && BadgeIcon && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest"
            style={{
              background: `${badge.color}20`,
              border: `1px solid ${badge.color}80`,
              color: badge.color,
            }}
          >
            <BadgeIcon className="w-3 h-3" />
            {badge.label}
          </motion.span>
        )}
      </div>

      {/* Message */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Music className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(0 0% 50%)' }} />
          <p className="text-sm font-mono" style={{ color: 'hsl(0 0% 70%)' }}>
            {check.message}
          </p>
        </div>

        {/* Harmonic Interference Visual */}
        <div
          className="p-3 rounded-lg flex items-center justify-center gap-2"
          style={{ background: 'hsl(0 0% 8%)', border: '1px dashed hsl(0 0% 25%)' }}
        >
          <motion.div
            className="flex gap-1"
            animate={{ x: [-2, 2, -2] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ 
                  background: badge?.color || textColor,
                  height: `${10 + Math.random() * 20}px`,
                }}
                animate={{ 
                  height: [`${10 + i * 4}px`, `${20 + i * 3}px`, `${10 + i * 4}px`],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
              />
            ))}
          </motion.div>
          <span className="text-[10px] font-mono ml-2" style={{ color: 'hsl(0 0% 50%)' }}>
            {badge ? `${badge.label} CLASH` : 'FREQUENCY CLASH'}
          </span>
          <motion.div
            className="flex gap-1"
            animate={{ x: [2, -2, 2] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ 
                  background: 'hsl(0 60% 50%)',
                  height: `${10 + Math.random() * 20}px`,
                }}
                animate={{ 
                  height: [`${15 - i * 2}px`, `${25 - i * 3}px`, `${15 - i * 2}px`],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 0.4 + i * 0.1, repeat: Infinity }}
              />
            ))}
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onDismiss && (
            <motion.button
              className="flex-1 py-2 px-4 rounded-lg text-xs font-mono font-bold"
              style={{ 
                background: 'hsl(0 0% 15%)',
                border: '1px solid hsl(0 0% 30%)',
                color: 'hsl(0 0% 70%)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDismiss}
            >
              CANCEL
            </motion.button>
          )}
          {onProceed && (
            <motion.button
              className="flex-1 py-2 px-4 rounded-lg text-xs font-mono font-bold"
              style={{ 
                background: `${borderColor}30`,
                border: `1px solid ${borderColor}`,
                color: textColor,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onProceed}
            >
              PROCEED ANYWAY
            </motion.button>
          )}
        </div>

        <p className="text-[10px] font-mono text-center" style={{ color: 'hsl(0 0% 40%)' }}>
          Proceeding may affect soil balance and harmonic resonance
        </p>
      </div>
    </motion.div>
  );
};

export default DissonanceWarning;
