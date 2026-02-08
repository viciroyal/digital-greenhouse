import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';

/**
 * FIBONACCI WRAP ANIMATION
 * 
 * Interactive step-by-step animation showing copper wire 
 * wrapping around a wooden dowel in a Fibonacci spiral pattern.
 */

interface FibonacciWrapAnimationProps {
  className?: string;
}

const TOTAL_STEPS = 8;

const stepDescriptions = [
  "Start with straight copper wire",
  "Begin the first loop at the base",
  "Expand outward — Fibonacci ratio 1:1",
  "Continue spiral — ratio 1:2",
  "Wider turn — ratio 2:3",
  "Golden expansion — ratio 3:5",
  "Approaching the Golden Ratio",
  "Complete Fibonacci Spiral — φ (1.618)"
];

const FibonacciWrapAnimation = ({ className = "" }: FibonacciWrapAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= TOTAL_STEPS - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (currentStep >= TOTAL_STEPS - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Generate spiral path based on current step
  const generateSpiralPath = (step: number): string => {
    if (step === 0) return "M 80 180 L 80 20";
    
    // Progressive Fibonacci spiral coordinates
    const spiralPoints = [
      "M 80 180 Q 80 160, 85 150",
      "M 80 180 Q 80 160, 85 150 Q 95 140, 80 130",
      "M 80 180 Q 80 160, 85 150 Q 95 140, 80 130 Q 60 120, 90 105",
      "M 80 180 Q 80 160, 85 150 Q 95 140, 80 130 Q 60 120, 90 105 Q 110 90, 70 80",
      "M 80 180 Q 80 160, 85 150 Q 95 140, 80 130 Q 60 120, 90 105 Q 110 90, 70 80 Q 45 70, 95 55",
      "M 80 180 Q 80 160, 85 150 Q 95 140, 80 130 Q 60 120, 90 105 Q 110 90, 70 80 Q 45 70, 95 55 Q 120 45, 65 35",
      "M 80 180 Q 80 160, 85 150 Q 95 140, 80 130 Q 60 120, 90 105 Q 110 90, 70 80 Q 45 70, 95 55 Q 120 45, 65 35 Q 40 25, 100 15",
      "M 80 180 Q 80 160, 85 150 Q 95 140, 80 130 Q 60 120, 90 105 Q 110 90, 70 80 Q 45 70, 95 55 Q 120 45, 65 35 Q 40 25, 100 15 Q 115 10, 80 5"
    ];
    
    return spiralPoints[Math.min(step, spiralPoints.length - 1)];
  };

  return (
    <div className={`relative ${className}`}>
      {/* Animation Container */}
      <div 
        className="relative rounded-xl p-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1510, #0f0d0a)',
          border: '1px solid #B8733340',
        }}
      >
        {/* SVG Animation Area */}
        <div className="flex justify-center mb-4">
          <svg 
            viewBox="0 0 160 200" 
            className="w-40 h-52"
            style={{ filter: 'drop-shadow(0 0 10px #00FFFF20)' }}
          >
            <defs>
              {/* Copper wire gradient */}
              <linearGradient id="copperWireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B87333" />
                <stop offset="50%" stopColor="#DA8B47" />
                <stop offset="100%" stopColor="#B87333" />
              </linearGradient>
              
              {/* Wood grain gradient */}
              <linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5D4037" />
                <stop offset="30%" stopColor="#6D4C41" />
                <stop offset="50%" stopColor="#5D4037" />
                <stop offset="70%" stopColor="#6D4C41" />
                <stop offset="100%" stopColor="#5D4037" />
              </linearGradient>
              
              {/* Electric glow */}
              <filter id="electricGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              
              {/* Cyan spark glow */}
              <filter id="cyanSparkGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Wooden Dowel */}
            <rect
              x="72"
              y="10"
              width="16"
              height="175"
              rx="4"
              fill="url(#woodGrain)"
              stroke="#4A3728"
              strokeWidth="1"
            />
            
            {/* Wood grain lines */}
            <g opacity="0.3">
              <line x1="76" y1="15" x2="76" y2="180" stroke="#8D6E63" strokeWidth="0.5" />
              <line x1="80" y1="15" x2="80" y2="180" stroke="#8D6E63" strokeWidth="0.5" />
              <line x1="84" y1="15" x2="84" y2="180" stroke="#8D6E63" strokeWidth="0.5" />
            </g>
            
            {/* Ground/Clay base */}
            <ellipse
              cx="80"
              cy="185"
              rx="35"
              ry="10"
              fill="#5D4037"
              opacity="0.6"
            />
            
            {/* Copper Wire - Animated */}
            <motion.path
              d={generateSpiralPath(currentStep)}
              stroke="url(#copperWireGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              filter={currentStep > 0 ? "url(#electricGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              key={currentStep}
            />
            
            {/* Electric sparks when complete */}
            <AnimatePresence>
              {currentStep >= TOTAL_STEPS - 1 && (
                <>
                  <motion.circle
                    cx="80"
                    cy="8"
                    r="3"
                    fill="#00FFFF"
                    filter="url(#cyanSparkGlow)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.circle
                    cx="100"
                    cy="15"
                    r="2"
                    fill="#00FFFF"
                    filter="url(#cyanSparkGlow)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                  />
                  <motion.circle
                    cx="60"
                    cy="35"
                    r="2"
                    fill="#00FFFF"
                    filter="url(#cyanSparkGlow)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: 0.6 }}
                  />
                  
                  {/* Electric arcs */}
                  <motion.path
                    d="M 80 2 L 78 6 L 82 8 L 79 12"
                    stroke="#00FFFF"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#cyanSparkGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3], pathLength: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                </>
              )}
            </AnimatePresence>
            
            {/* Direction indicator - showing spiral direction */}
            {currentStep > 0 && currentStep < TOTAL_STEPS - 1 && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
              >
                <text
                  x="130"
                  y="100"
                  fill="#4A9B7F"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  ↻
                </text>
              </motion.g>
            )}
          </svg>
        </div>
        
        {/* Step Description */}
        <motion.div
          className="text-center mb-4 px-2"
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p 
            className="text-sm font-mono"
            style={{ color: '#A8D5BA' }}
          >
            {stepDescriptions[currentStep]}
          </p>
          
          {/* Fibonacci numbers display */}
          {currentStep > 1 && (
            <motion.div
              className="mt-2 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span 
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ 
                  background: '#B8733330', 
                  color: '#B87333',
                  border: '1px solid #B8733350'
                }}
              >
                {[1, 1, 2, 3, 5, 8, 13][Math.min(currentStep - 1, 6)]}
              </span>
              <span className="text-xs" style={{ color: '#4A9B7F' }}>→</span>
              <span 
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ 
                  background: '#00FFFF20', 
                  color: '#00FFFF',
                  border: '1px solid #00FFFF40'
                }}
              >
                {[1, 2, 3, 5, 8, 13, 21][Math.min(currentStep - 1, 6)]}
              </span>
            </motion.div>
          )}
        </motion.div>
        
        {/* Progress Bar */}
        <div 
          className="h-1 rounded-full mb-4 overflow-hidden"
          style={{ background: '#2a2520' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ 
              background: 'linear-gradient(90deg, #B87333, #4A9B7F, #00FFFF)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="p-2 rounded-lg transition-all disabled:opacity-30"
            style={{ 
              background: '#B8733320',
              border: '1px solid #B8733350',
            }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: '#B87333' }} />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-lg transition-all"
            style={{ 
              background: isPlaying 
                ? 'linear-gradient(135deg, #00FFFF30, #4A9B7F20)'
                : 'linear-gradient(135deg, #4A9B7F30, #00FFFF20)',
              border: '1px solid #4A9B7F60',
              boxShadow: isPlaying ? '0 0 15px #00FFFF30' : 'none',
            }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" style={{ color: '#00FFFF' }} />
            ) : (
              <Play className="w-5 h-5" style={{ color: '#4A9B7F' }} />
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="p-2 rounded-lg transition-all"
            style={{ 
              background: '#5D403720',
              border: '1px solid #5D403750',
            }}
          >
            <RotateCcw className="w-4 h-4" style={{ color: '#8D6E63' }} />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentStep >= TOTAL_STEPS - 1}
            className="p-2 rounded-lg transition-all disabled:opacity-30"
            style={{ 
              background: '#B8733320',
              border: '1px solid #B8733350',
            }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: '#B87333' }} />
          </button>
        </div>
        
        {/* Step counter */}
        <div className="text-center mt-3">
          <span 
            className="text-xs font-mono"
            style={{ color: '#5D4037' }}
          >
            STEP {currentStep + 1} OF {TOTAL_STEPS}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FibonacciWrapAnimation;
