import { motion } from 'framer-motion';
import { AlertTriangle, Droplets, Sun } from 'lucide-react';

interface BrixDiagnosticsProps {
  color?: string;
}

/**
 * Brix Diagnostics - Troubleshooting section for Level 4
 * The Clinic: What to do when Brix is low
 */
const BrixDiagnostics = ({ color = 'hsl(45 100% 50%)' }: BrixDiagnosticsProps) => {
  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(0 30% 8% / 0.9)',
        border: '2px dashed hsl(0 60% 45%)',
        boxShadow: '0 0 20px hsl(0 60% 40% / 0.2)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 border-b flex items-center gap-3"
        style={{
          background: 'linear-gradient(135deg, hsl(0 40% 15%), hsl(0 30% 10%))',
          borderColor: 'hsl(0 50% 30%)',
        }}
      >
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: 'hsl(0 60% 25%)',
            border: '1px solid hsl(0 70% 45%)',
          }}
        >
          <AlertTriangle 
            className="w-4 h-4" 
            style={{ color: 'hsl(0 70% 60%)' }} 
          />
        </div>
        <div>
          <h4 
            className="text-sm tracking-wider"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(0 70% 65%)',
            }}
          >
            THE CLINIC
          </h4>
          <p 
            className="text-[10px] font-mono"
            style={{ color: 'hsl(0 0% 50%)' }}
          >
            DIAGNOSTICS & TROUBLESHOOTING
          </p>
        </div>
      </div>

      {/* Diagnostic Content */}
      <div className="p-4 space-y-4">
        {/* Low Brix Warning */}
        <div 
          className="p-3 rounded-lg"
          style={{
            background: 'hsl(0 0% 8%)',
            border: '1px solid hsl(0 40% 35%)',
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-12 h-8 rounded flex items-center justify-center font-mono text-sm"
              style={{
                background: 'hsl(0 70% 25%)',
                color: 'hsl(0 80% 70%)',
                border: '1px solid hsl(0 60% 40%)',
              }}
            >
              &lt;8
            </div>
            <div className="flex-1">
              <p 
                className="text-xs font-mono mb-2"
                style={{ color: 'hsl(0 60% 65%)' }}
              >
                IF BRIX IS LOW (&lt;8):
              </p>
              <p 
                className="text-sm"
                style={{ 
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(0 0% 85%)',
                  letterSpacing: '0.03em',
                }}
              >
                You are lacking <span style={{ color: 'hsl(45 80% 60%)' }}>Calcium</span> or{' '}
                <span style={{ color: 'hsl(45 80% 60%)' }}>Sun</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Remedy */}
        <motion.div 
          className="p-3 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            border: `1px solid ${color}40`,
          }}
          animate={{
            boxShadow: [
              `0 0 10px ${color}20`,
              `0 0 20px ${color}30`,
              `0 0 10px ${color}20`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4" style={{ color }} />
            <span 
              className="text-xs font-mono tracking-wider"
              style={{ color }}
            >
              IMMEDIATE ACTION
            </span>
          </div>
          <p 
            className="text-sm"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(0 0% 90%)',
              letterSpacing: '0.02em',
            }}
          >
            Foliar spray with Sea Minerals immediately.
          </p>
          <div 
            className="mt-2 flex items-center gap-2 text-[10px] font-mono"
            style={{ color: 'hsl(0 0% 50%)' }}
          >
            <Sun className="w-3 h-3" style={{ color: 'hsl(45 80% 50%)' }} />
            <span>Also check for adequate sunlight exposure (6+ hours)</span>
          </div>
        </motion.div>

        {/* Optimal Range Reminder */}
        <div 
          className="text-center py-2"
          style={{ borderTop: '1px solid hsl(0 0% 20%)' }}
        >
          <p 
            className="text-xs font-mono"
            style={{ color: 'hsl(0 0% 45%)' }}
          >
            Target Brix: <span style={{ color: 'hsl(140 60% 50%)' }}>12+</span> for nutrient-dense crops
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BrixDiagnostics;
