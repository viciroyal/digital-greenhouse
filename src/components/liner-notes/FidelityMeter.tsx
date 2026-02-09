import { motion } from 'framer-motion';
import { Signal } from 'lucide-react';

interface FidelityMeterProps {
  brix: number;
  trackCount: number;
}

const getFidelityTier = (brix: number) => {
  if (brix >= 20) return { label: 'STUDIO MASTER', color: 'hsl(45 90% 60%)', glow: 'hsl(45 80% 40% / 0.5)' };
  if (brix >= 15) return { label: 'HIGH FIDELITY', color: 'hsl(120 50% 50%)', glow: 'hsl(120 40% 35% / 0.4)' };
  if (brix >= 12) return { label: 'STANDARD DEF', color: 'hsl(51 70% 55%)', glow: 'hsl(51 60% 40% / 0.3)' };
  return { label: 'LO-FI', color: 'hsl(0 50% 50%)', glow: 'hsl(0 40% 35% / 0.3)' };
};

/**
 * Overall fidelity rating for this week's "album"
 */
const FidelityMeter = ({ brix, trackCount }: FidelityMeterProps) => {
  const tier = getFidelityTier(brix);
  const fillPercent = Math.min((brix / 24) * 100, 100);

  if (trackCount === 0) return null;

  return (
    <motion.div
      className="max-w-xl mx-auto p-5 rounded-xl"
      style={{
        background: 'linear-gradient(135deg, hsl(0 0% 6%), hsl(0 0% 4%))',
        border: `1px solid ${tier.color}30`,
        boxShadow: `0 0 30px ${tier.glow}`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Signal className="w-4 h-4" style={{ color: tier.color }} />
          <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: 'hsl(0 0% 45%)' }}>
            OVERALL FIDELITY
          </span>
        </div>
        <span
          className="font-mono text-xs font-bold tracking-wider"
          style={{ color: tier.color }}
        >
          {tier.label}
        </span>
      </div>

      {/* Brix bar */}
      <div
        className="h-3 rounded-full overflow-hidden mb-2"
        style={{ background: 'hsl(0 0% 10%)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${tier.color}80, ${tier.color})`,
            boxShadow: `0 0 10px ${tier.color}`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${fillPercent}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px]" style={{ color: 'hsl(0 0% 35%)' }}>
          12° SD
        </span>
        <span className="font-mono text-lg font-bold" style={{ color: tier.color }}>
          {brix.toFixed(1)}°
        </span>
        <span className="font-mono text-[10px]" style={{ color: 'hsl(45 60% 45%)' }}>
          24° MASTER
        </span>
      </div>

      <p className="text-center font-mono text-[10px] mt-2" style={{ color: 'hsl(0 0% 30%)' }}>
        Averaged across {trackCount} track{trackCount !== 1 ? 's' : ''} this movement
      </p>
    </motion.div>
  );
};

export default FidelityMeter;
