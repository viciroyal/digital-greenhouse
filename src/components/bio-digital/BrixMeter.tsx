import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BrixMeterProps {
  value?: number; // 0-100 percentage, will be converted to 0-24 Brix scale
  isLoading?: boolean;
}

/**
 * Brix Meter - "The Loading State"
 * 
 * A refractometer-style loading indicator that shows "Nutrient Density"
 * Scale: 0 to 24 (High-Brix standard)
 */
const BrixMeter = ({ value = 0, isLoading = true }: BrixMeterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Convert percentage to Brix scale (0-24)
  const brixValue = isLoading ? displayValue : Math.round((value / 100) * 24);
  
  // Animate loading value
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDisplayValue((prev) => {
          if (prev >= 24) return 0;
          return prev + 0.5;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isLoading]);
  
  // Determine quality zone
  const getQualityZone = (brix: number) => {
    if (brix < 8) return { label: 'Low Density', color: 'hsl(0 60% 50%)' };
    if (brix < 14) return { label: 'Moderate', color: 'hsl(45 80% 50%)' };
    if (brix < 20) return { label: 'Good', color: 'hsl(120 50% 45%)' };
    return { label: 'High Brix!', color: 'hsl(140 70% 40%)' };
  };
  
  const quality = getQualityZone(brixValue);
  const fillPercentage = (brixValue / 24) * 100;
  
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* Refractometer View */}
      <div 
        className="relative w-48 h-48 rounded-full overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, hsl(220 20% 15%) 0%, hsl(220 30% 8%) 100%)',
          border: '4px solid hsl(40 30% 25%)',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Lens glass effect */}
        <div 
          className="absolute inset-2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, hsl(200 20% 25% / 0.3), transparent 60%)',
          }}
        />
        
        {/* Scale markings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Scale arc lines */}
            {[0, 4, 8, 12, 16, 20, 24].map((mark) => {
              const angle = -90 + (mark / 24) * 180;
              const x1 = 50 + Math.cos((angle * Math.PI) / 180) * 38;
              const y1 = 50 + Math.sin((angle * Math.PI) / 180) * 38;
              const x2 = 50 + Math.cos((angle * Math.PI) / 180) * 44;
              const y2 = 50 + Math.sin((angle * Math.PI) / 180) * 44;
              
              return (
                <g key={mark}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="hsl(40 50% 60%)"
                    strokeWidth="1"
                  />
                  <text
                    x={50 + Math.cos((angle * Math.PI) / 180) * 32}
                    y={50 + Math.sin((angle * Math.PI) / 180) * 32}
                    fill="hsl(40 50% 70%)"
                    fontSize="5"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {mark}
                  </text>
                </g>
              );
            })}
            
            {/* Sweet zone indicator (12-24) */}
            <path
              d={`M 50 50 L ${50 + Math.cos((-90 + (12/24) * 180) * Math.PI / 180) * 44} ${50 + Math.sin((-90 + (12/24) * 180) * Math.PI / 180) * 44} A 44 44 0 0 1 ${50 + Math.cos(90 * Math.PI / 180) * 44} ${50 + Math.sin(90 * Math.PI / 180) * 44} Z`}
              fill="hsl(140 60% 30% / 0.2)"
              stroke="hsl(140 60% 40%)"
              strokeWidth="0.5"
            />
          </svg>
        </div>
        
        {/* Blue line / fluid level */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{
            background: `linear-gradient(180deg, 
              ${quality.color} 0%, 
              hsl(200 80% 50%) 50%,
              hsl(220 60% 30%) 100%
            )`,
            transformOrigin: 'bottom',
          }}
          animate={{
            height: `${fillPercentage}%`,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        />
        
        {/* Refraction line */}
        <motion.div
          className="absolute left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(40 80% 70%), transparent)',
            boxShadow: '0 0 10px hsl(40 80% 60%)',
          }}
          animate={{
            bottom: `${fillPercentage}%`,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        />
        
        {/* Center reading */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.span 
              className="text-3xl font-bubble"
              style={{ 
                color: quality.color,
                textShadow: `0 0 20px ${quality.color}`,
              }}
              key={brixValue}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {brixValue.toFixed(1)}
            </motion.span>
            <p 
              className="text-xs font-body mt-1"
              style={{ color: 'hsl(40 50% 70%)' }}
            >
              °Brix
            </p>
          </div>
        </div>
      </div>
      
      {/* Status label */}
      <div className="text-center">
        <p 
          className="text-sm font-body tracking-wider"
          style={{ color: 'hsl(40 50% 75%)' }}
        >
          {isLoading ? 'Measuring Brix...' : quality.label}
        </p>
        
        {/* Quality indicator */}
        <motion.div
          className="mt-2 h-1 rounded-full overflow-hidden"
          style={{
            width: 120,
            background: 'hsl(220 20% 15%)',
          }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, hsl(0 60% 50%), hsl(45 80% 50%), hsl(120 50% 45%), hsl(140 70% 40%))`,
            }}
            animate={{
              width: `${fillPercentage}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default BrixMeter;
