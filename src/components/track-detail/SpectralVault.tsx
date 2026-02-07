import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Scan, Beaker, TrendingUp } from 'lucide-react';
import type { TrackData } from '@/data/trackData';

interface SpectralVaultProps {
  track: TrackData;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * THE SPECTRAL VAULT - NIR Data Visualizer
 * 
 * A "Lab Report" drawer showing spectroscopy data
 * that proves the nutrient density of the harvest.
 */
const SpectralVault = ({ track, isOpen, onClose }: SpectralVaultProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Brix score based on track (higher for "stronger" chakras)
  const brixScore = 14 + (track.row * 0.4) + Math.random() * 2;
  const storeBrix = 4.0;

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setShowResults(false);
      setScanProgress(0);
      
      const scanInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(scanInterval);
            setIsScanning(false);
            setShowResults(true);
            return 100;
          }
          return prev + 2;
        });
      }, 40);

      return () => clearInterval(scanInterval);
    }
  }, [isOpen]);

  // Generate spectroscopy wave points
  const generateWavePoints = () => {
    const points: string[] = [];
    const width = 300;
    const height = 100;
    const segments = 60;
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      // Create organic wave with peaks at nutrient wavelengths
      const baseWave = Math.sin(i * 0.3) * 20;
      const nutrientPeak1 = Math.exp(-Math.pow((i - 15) / 5, 2)) * 40;
      const nutrientPeak2 = Math.exp(-Math.pow((i - 35) / 4, 2)) * 55;
      const nutrientPeak3 = Math.exp(-Math.pow((i - 50) / 6, 2)) * 35;
      const noise = (Math.random() - 0.5) * 5;
      
      const y = height / 2 - baseWave - nutrientPeak1 - nutrientPeak2 - nutrientPeak3 + noise;
      points.push(`${x},${y}`);
    }
    
    return points.join(' ');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto"
            style={{
              background: `
                linear-gradient(180deg, 
                  hsl(200 40% 8%) 0%, 
                  hsl(220 50% 6%) 50%,
                  hsl(200 40% 8%) 100%
                )
              `,
              borderLeft: '1px solid hsl(200 60% 30% / 0.3)',
              boxShadow: '-20px 0 60px rgba(0, 150, 200, 0.15)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Scan line animation */}
            {isScanning && (
              <motion.div
                className="absolute left-0 right-0 h-1 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsl(180 100% 50%), transparent)',
                  boxShadow: '0 0 20px hsl(180 100% 50%)',
                }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Grid overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(hsl(200 60% 50%) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(200 60% 50%) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />

            {/* Content */}
            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Beaker className="w-5 h-5 text-cyan-400" />
                    <span className="font-mono text-xs tracking-[0.2em] text-cyan-400/80">
                      SPECTRAL VAULT
                    </span>
                  </div>
                  <h2 className="font-display text-2xl text-foreground">
                    NIR ANALYSIS
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    BRIX VALIDATION PROTOCOL
                  </p>
                </div>
                
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full glass-card text-muted-foreground hover:text-foreground"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Sample Image Section */}
              <motion.div
                className="mb-8 rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, hsl(120 30% 15% / 0.5), hsl(100 40% 10% / 0.5))',
                  border: '1px solid hsl(120 40% 30% / 0.3)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showResults ? 1 : 0.5, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative aspect-video">
                  {/* Simulated sample image */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `
                        radial-gradient(ellipse at 30% 40%, hsl(120 50% 25%) 0%, transparent 40%),
                        radial-gradient(ellipse at 70% 60%, hsl(0 60% 30%) 0%, transparent 35%),
                        linear-gradient(135deg, hsl(100 30% 15%), hsl(80 40% 10%))
                      `,
                    }}
                  />
                  
                  {/* Split line */}
                  <div 
                    className="absolute top-0 bottom-0 left-1/2 w-px"
                    style={{
                      background: 'linear-gradient(180deg, transparent, hsl(180 100% 50%), transparent)',
                      boxShadow: '0 0 10px hsl(180 100% 50%)',
                    }}
                  />
                  
                  {/* Labels */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/50 font-mono text-xs text-cyan-400">
                    STORE SAMPLE
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/50 font-mono text-xs text-throne-gold">
                    AGROMAJIC SAMPLE
                  </div>
                  
                  {/* Scan overlay */}
                  {isScanning && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'hsl(200 50% 10% / 0.7)' }}
                    >
                      <div className="text-center">
                        <Scan className="w-12 h-12 text-cyan-400 mx-auto mb-3 animate-pulse" />
                        <p className="font-mono text-sm text-cyan-400">
                          ANALYZING... {scanProgress}%
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Spectroscopy Graph */}
              <motion.div
                className="mb-8 p-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(220 40% 8% / 0.8), hsl(200 40% 6% / 0.8))',
                  border: '1px solid hsl(200 60% 30% / 0.3)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: showResults ? 1 : 0.3 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs tracking-wider text-cyan-400/80">
                    NIR SPECTRAL CURVE
                  </span>
                </div>
                
                <svg viewBox="0 0 300 120" className="w-full h-32">
                  {/* Grid */}
                  <defs>
                    <pattern id="specGrid" width="30" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 20" fill="none" stroke="hsl(200 60% 30%)" strokeWidth="0.3" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="300" height="120" fill="url(#specGrid)" />
                  
                  {/* Wavelength labels */}
                  <text x="10" y="115" fill="hsl(200 60% 60%)" fontSize="8" fontFamily="monospace">400nm</text>
                  <text x="135" y="115" fill="hsl(200 60% 60%)" fontSize="8" fontFamily="monospace">600nm</text>
                  <text x="265" y="115" fill="hsl(200 60% 60%)" fontSize="8" fontFamily="monospace">800nm</text>
                  
                  {/* The Spectral Line - "The 5th Agreement" */}
                  {showResults && (
                    <motion.polyline
                      points={generateWavePoints()}
                      fill="none"
                      stroke="url(#spectralGradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      style={{
                        filter: 'drop-shadow(0 0 8px hsl(180 100% 50%))',
                      }}
                    />
                  )}
                  
                  <defs>
                    <linearGradient id="spectralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(280 80% 60%)" />
                      <stop offset="25%" stopColor="hsl(200 90% 60%)" />
                      <stop offset="50%" stopColor="hsl(120 70% 50%)" />
                      <stop offset="75%" stopColor="hsl(60 90% 50%)" />
                      <stop offset="100%" stopColor="hsl(0 80% 50%)" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* BRIX Score Display */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: showResults ? 1 : 0.3, scale: showResults ? 1 : 0.95 }}
                transition={{ delay: 0.6 }}
              >
                <div 
                  className="p-6 rounded-2xl text-center"
                  style={{
                    background: showResults 
                      ? 'linear-gradient(135deg, hsl(140 40% 12%), hsl(120 50% 8%))'
                      : 'hsl(220 30% 10%)',
                    border: `1px solid ${showResults ? 'hsl(140 60% 40% / 0.4)' : 'hsl(200 30% 20% / 0.3)'}`,
                    boxShadow: showResults ? '0 0 40px hsl(140 60% 30% / 0.2)' : 'none',
                  }}
                >
                  <p className="font-mono text-xs tracking-[0.2em] text-cyan-400/80 mb-2">
                    BRIX SCORE
                  </p>
                  <motion.p 
                    className="font-display text-6xl"
                    style={{ 
                      color: showResults ? 'hsl(140 70% 50%)' : 'hsl(200 30% 40%)',
                      textShadow: showResults ? '0 0 30px hsl(140 70% 40%)' : 'none',
                    }}
                    key={showResults ? 'result' : 'loading'}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    {showResults ? brixScore.toFixed(1) : '--.-'}
                  </motion.p>
                  
                  {/* Comparison Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between font-mono text-xs text-muted-foreground mb-2">
                      <span>Standard Store: {storeBrix.toFixed(1)}</span>
                      <span className="text-throne-gold">AgroMajic: {brixScore.toFixed(1)}+</span>
                    </div>
                    <div 
                      className="h-3 rounded-full overflow-hidden"
                      style={{ background: 'hsl(220 20% 15%)' }}
                    >
                      {/* Store level */}
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, hsl(0 50% 40%), hsl(40 60% 50%), hsl(120 60% 40%))',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: showResults ? `${(brixScore / 24) * 100}%` : `${(storeBrix / 24) * 100}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-muted-foreground/60 mt-1">
                      <span>0</span>
                      <span>Low</span>
                      <span>Good</span>
                      <span>High Brix</span>
                      <span>24</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Analysis Notes */}
              <motion.div
                className="p-4 rounded-xl"
                style={{
                  background: 'hsl(220 30% 8% / 0.8)',
                  border: '1px solid hsl(200 40% 25% / 0.3)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: showResults ? 1 : 0 }}
                transition={{ delay: 1 }}
              >
                <p className="font-mono text-xs tracking-wider text-cyan-400/80 mb-2">
                  ANALYSIS NOTES
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Near-Infrared spectroscopy confirms elevated nutrient density. 
                  Sugar content correlates with{' '}
                  <span className="text-throne-gold">{track.chakra}</span> frequency alignment.
                  Mineral absorption rates exceed industry standard by{' '}
                  <span className="text-emerald-400">{((brixScore / storeBrix) * 100 - 100).toFixed(0)}%</span>.
                </p>
              </motion.div>

              {/* Track Reference */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="font-mono text-xs text-center text-muted-foreground/60">
                  Sample harvested under{' '}
                  <span style={{ color: `hsl(${track.colorHsl})` }}>{track.zodiacSign}</span> influence
                  {' · '}{track.frequency}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SpectralVault;
