import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface DataQuadrantProps {
  title: string;
  label: string;
  icon: ReactNode;
  trackColor: string;
  delay?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Unified DataQuadrant wrapper for consistent styling across all track detail quadrants.
 * Uses the track's individual color for theming while maintaining a cohesive dark glass aesthetic.
 */
const DataQuadrant = ({ 
  title, 
  label, 
  icon, 
  trackColor, 
  delay = 0.1, 
  className = '',
  children 
}: DataQuadrantProps) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-6 h-full ${className}`}
      style={{
        background: `linear-gradient(145deg, hsl(20 25% 10% / 0.95), hsl(20 20% 8% / 0.98))`,
        border: `1px solid hsl(${trackColor} / 0.25)`,
        boxShadow: `
          0 4px 24px hsl(0 0% 0% / 0.4),
          inset 0 1px 0 hsl(${trackColor} / 0.1),
          0 0 40px hsl(${trackColor} / 0.05)
        `,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {/* Subtle gradient accent at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(${trackColor} / 0.5), transparent)`,
        }}
      />

      {/* Corner accent */}
      <div 
        className="absolute top-0 right-0 w-20 h-20 opacity-10"
        style={{
          background: `radial-gradient(circle at top right, hsl(${trackColor}), transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-4">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: `hsl(${trackColor} / 0.15)`,
            border: `1px solid hsl(${trackColor} / 0.3)`,
          }}
        >
          {icon}
        </div>
        <h3 
          className="font-display text-lg tracking-wide"
          style={{ 
            color: 'hsl(40 50% 92%)',
          }}
        >
          {title}
        </h3>
        <span 
          className="font-mono text-[10px] ml-auto tracking-[0.15em] uppercase"
          style={{ color: `hsl(${trackColor} / 0.7)` }}
        >
          {label}
        </span>
      </div>

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
};

export default DataQuadrant;
