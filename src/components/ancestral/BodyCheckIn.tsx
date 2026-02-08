import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Footprints, Droplets, Wind, Utensils, Sparkles } from 'lucide-react';

// Storage key for body check persistence
const STORAGE_KEY = 'pharmer-body-check-completed';

// Load completed body checks from localStorage
const loadCompletedChecks = (): Record<number, boolean> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load body checks:', error);
  }
  return {};
};

// Save completed body checks to localStorage
const saveCompletedChecks = (checks: Record<number, boolean>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
  } catch (error) {
    console.error('Failed to save body checks:', error);
  }
};

interface BodyCheckInProps {
  level: number;
  color: string;
  onTuned: () => void;
  isTuned: boolean;
}

// Body check-in data for each level
const bodyCheckData: Record<number, {
  title: string;
  culture: string;
  science: string;
  instruction: string;
  icon: React.ComponentType<{ className?: string }>;
  chakraColor: string;
  visualCue?: string;
}> = {
  1: {
    title: 'THE IRON STANCE',
    culture: 'Muscogee',
    science: 'Ergonomics — The Broadfork uses leverage, not lumbar strength.',
    instruction: 'Kick off your shoes (Earthing). Plant feet shoulder-width. Hinge at the hips, not the spine. Engage the glutes. Do not lift the soil; lean back and let gravity do the work.',
    icon: Footprints,
    chakraColor: 'hsl(0 70% 45%)', // Root Red
    visualCue: 'hip-hinge',
  },
  2: {
    title: 'THE LIVING WATER',
    culture: 'Olmec',
    science: 'Fascia Hydration — The connective tissue requires water to slide. The Olmecs are the "Rubber People" (Elasticity).',
    instruction: 'You are 70% water, just like the cucumber. Before you apply the Rock Dust, drink 16oz of water. If you are dry, you are brittle. Be elastic.',
    icon: Droplets,
    chakraColor: 'hsl(25 80% 50%)', // Sacral Orange
  },
  3: {
    title: 'THE BELLOWS BREATH',
    culture: 'Vedic & Aboriginal',
    science: 'Vagus Nerve Stimulation — Deep breathing switches the nervous system from Sympathetic (Fight/Flight) to Parasympathetic (Rest/Digest/Grow).',
    instruction: 'The plants breathe CO₂; you breathe O₂. Exchange with them. Inhale for 4 seconds (Solar Charge). Hold for 7. Exhale with a Hum (Aboriginal Sound) for 8 seconds. Reset your nervous system before you touch the antenna.',
    icon: Wind,
    chakraColor: 'hsl(45 90% 55%)', // Solar Yellow
  },
  4: {
    title: 'THE ALCHEMICAL TASTE',
    culture: 'Kemit',
    science: 'Cephalic Phase of Digestion — Tasting the food triggers the body to absorb nutrients.',
    instruction: 'Do not just harvest. Eat. Bite the leaf. If it is bitter, you are lacking minerals. If it is sweet (High Brix), it is medicine. Nourish yourself first.',
    icon: Utensils,
    chakraColor: 'hsl(51 100% 50%)', // Crown Gold
  },
  5: {
    title: 'THE SOVEREIGN REST',
    culture: 'Maroon Grandmothers',
    science: 'Circadian Rhythm — The seed saves itself in darkness. Honor the dormant phase.',
    instruction: 'Before you save the seed, save yourself. Sit in stillness for 60 seconds. Close your eyes. Feel the heartbeat. You are the vessel that carries the future. Rest is not weakness; it is preparation.',
    icon: Sparkles,
    chakraColor: 'hsl(0 0% 85%)', // Soul Star White
  },
};

/**
 * Hip Hinge Visual - Stick figure showing correct posture
 */
const HipHingeVisual = ({ color }: { color: string }) => (
  <div className="flex justify-center gap-8 py-4">
    {/* Incorrect: Curved Back */}
    <div className="text-center">
      <svg viewBox="0 0 60 80" className="w-12 h-16 mx-auto mb-2">
        {/* Head */}
        <circle cx="30" cy="10" r="8" fill="none" stroke="hsl(0 50% 50%)" strokeWidth="2" />
        {/* Curved spine (wrong) */}
        <path d="M30 18 Q45 45 30 65" fill="none" stroke="hsl(0 50% 50%)" strokeWidth="2" />
        {/* Arms */}
        <line x1="30" y1="30" x2="15" y2="50" stroke="hsl(0 50% 50%)" strokeWidth="2" />
        <line x1="30" y1="30" x2="45" y2="50" stroke="hsl(0 50% 50%)" strokeWidth="2" />
        {/* Legs */}
        <line x1="30" y1="65" x2="20" y2="78" stroke="hsl(0 50% 50%)" strokeWidth="2" />
        <line x1="30" y1="65" x2="40" y2="78" stroke="hsl(0 50% 50%)" strokeWidth="2" />
        {/* X mark */}
        <line x1="50" y1="5" x2="55" y2="10" stroke="hsl(0 70% 50%)" strokeWidth="2" />
        <line x1="55" y1="5" x2="50" y2="10" stroke="hsl(0 70% 50%)" strokeWidth="2" />
      </svg>
      <span className="text-[9px] font-mono" style={{ color: 'hsl(0 50% 50%)' }}>CURVED BACK</span>
    </div>
    
    {/* Correct: Hip Hinge */}
    <div className="text-center">
      <svg viewBox="0 0 60 80" className="w-12 h-16 mx-auto mb-2">
        {/* Head */}
        <circle cx="35" cy="15" r="8" fill="none" stroke={color} strokeWidth="2" />
        {/* Straight spine at angle (correct) */}
        <line x1="35" y1="23" x2="25" y2="55" stroke={color} strokeWidth="2" />
        {/* Arms forward */}
        <line x1="30" y1="35" x2="15" y2="40" stroke={color} strokeWidth="2" />
        <line x1="30" y1="35" x2="10" y2="45" stroke={color} strokeWidth="2" />
        {/* Legs - hip hinge */}
        <line x1="25" y1="55" x2="20" y2="78" stroke={color} strokeWidth="2" />
        <line x1="25" y1="55" x2="35" y2="78" stroke={color} strokeWidth="2" />
        {/* Check mark */}
        <path d="M48 5 L52 10 L58 2" fill="none" stroke="hsl(140 60% 50%)" strokeWidth="2" />
      </svg>
      <span className="text-[9px] font-mono" style={{ color }}>HIP HINGE</span>
    </div>
  </div>
);

/**
 * Breathing Pattern Visual for Level 3
 */
const BreathingVisual = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-2 py-3">
    <div className="flex flex-col items-center">
      <motion.div
        className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: color }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <span className="text-[10px] font-mono" style={{ color }}>4s</span>
      </motion.div>
      <span className="text-[8px] font-mono mt-1" style={{ color: 'hsl(0 0% 50%)' }}>INHALE</span>
    </div>
    <div className="text-lg" style={{ color: 'hsl(0 0% 40%)' }}>→</div>
    <div className="flex flex-col items-center">
      <motion.div
        className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: 'hsl(210 70% 55%)' }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <span className="text-[10px] font-mono" style={{ color: 'hsl(210 70% 55%)' }}>7s</span>
      </motion.div>
      <span className="text-[8px] font-mono mt-1" style={{ color: 'hsl(0 0% 50%)' }}>HOLD</span>
    </div>
    <div className="text-lg" style={{ color: 'hsl(0 0% 40%)' }}>→</div>
    <div className="flex flex-col items-center">
      <motion.div
        className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: 'hsl(280 60% 55%)' }}
        animate={{ scale: [1.3, 1, 1.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <span className="text-[10px] font-mono" style={{ color: 'hsl(280 60% 55%)' }}>8s</span>
      </motion.div>
      <span className="text-[8px] font-mono mt-1" style={{ color: 'hsl(0 0% 50%)' }}>HUM</span>
    </div>
  </div>
);

/**
 * Body Check-In Module
 * Somatic gate that must be acknowledged before farming protocol
 */
const BodyCheckIn = ({ level, color, onTuned, isTuned }: BodyCheckInProps) => {
  const checkData = bodyCheckData[level];
  
  // Persist tuned state to localStorage
  useEffect(() => {
    if (isTuned) {
      const currentChecks = loadCompletedChecks();
      currentChecks[level] = true;
      saveCompletedChecks(currentChecks);
    }
  }, [isTuned, level]);
  
  if (!checkData) return null;
  
  const IconComponent = checkData.icon;
  
  return (
    <motion.div
      className="rounded-2xl overflow-hidden mb-6"
      style={{
        background: `linear-gradient(135deg, ${checkData.chakraColor}15, ${checkData.chakraColor}08)`,
        border: `1px solid ${checkData.chakraColor}40`,
        boxShadow: `inset 0 0 30px ${checkData.chakraColor}10`,
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center gap-3"
        style={{
          background: `linear-gradient(90deg, ${checkData.chakraColor}25, ${checkData.chakraColor}10)`,
          borderBottom: `1px solid ${checkData.chakraColor}30`,
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: `${checkData.chakraColor}30`,
            border: `1px solid ${checkData.chakraColor}`,
            color: checkData.chakraColor,
          }}
        >
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <span
            className="text-[10px] font-mono tracking-[0.15em] block"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: 'hsl(0 0% 55%)',
            }}
          >
            TUNE THE INSTRUMENT
          </span>
          <h3
            className="text-sm tracking-wide"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: checkData.chakraColor,
              letterSpacing: '0.1em',
            }}
          >
            {checkData.title}
          </h3>
        </div>
        <span
          className="text-[9px] font-mono px-2 py-0.5 rounded-full"
          style={{
            fontFamily: "'Space Mono', monospace",
            background: 'hsl(0 0% 15%)',
            color: 'hsl(0 0% 50%)',
          }}
        >
          {checkData.culture}
        </span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Science Note */}
        <p
          className="text-[11px] leading-relaxed mb-3 pb-3"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: 'hsl(40 30% 55%)',
            borderBottom: `1px dashed ${checkData.chakraColor}20`,
          }}
        >
          <span style={{ color: checkData.chakraColor }}>◆</span> {checkData.science}
        </p>
        
        {/* Visual Cue for Level 1 */}
        {level === 1 && <HipHingeVisual color={checkData.chakraColor} />}
        
        {/* Breathing Visual for Level 3 */}
        {level === 3 && <BreathingVisual color={checkData.chakraColor} />}
        
        {/* Instruction */}
        <p
          className="text-sm leading-relaxed"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: 'hsl(0 0% 75%)',
            lineHeight: '1.7',
          }}
        >
          "{checkData.instruction}"
        </p>
        
        {/* Tune Button */}
        <AnimatePresence mode="wait">
          {!isTuned ? (
            <motion.button
              key="tune-button"
              className="w-full mt-4 py-3 rounded-xl font-mono text-sm tracking-wide"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                background: `linear-gradient(135deg, ${checkData.chakraColor}30, ${checkData.chakraColor}20)`,
                border: `1px solid ${checkData.chakraColor}`,
                color: checkData.chakraColor,
                letterSpacing: '0.15em',
              }}
              onClick={onTuned}
              whileHover={{ 
                scale: 1.02,
                boxShadow: `0 0 20px ${checkData.chakraColor}40`,
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
            >
              I AM TUNED
            </motion.button>
          ) : (
            <motion.div
              key="tuned-state"
              className="w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2"
              style={{
                background: `${checkData.chakraColor}20`,
                border: `1px solid ${checkData.chakraColor}60`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Check className="w-4 h-4" style={{ color: checkData.chakraColor }} />
              <span
                className="text-sm tracking-wide"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: checkData.chakraColor,
                  letterSpacing: '0.1em',
                }}
              >
                INSTRUMENT TUNED
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BodyCheckIn;
