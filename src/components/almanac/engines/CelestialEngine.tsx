import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Star, Calendar, Droplets, Flame, Wind, Sprout, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE CELESTIAL PROTOCOL (Cosmic Timing Validation Engine)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CONCEPT: Action is only effective when the Window of Time is open.
 * The app validates the "When" as strictly as the "What."
 * 
 * THREE GATES:
 * 1. THE LUNAR GATE - Moon phase + zodiac validation
 * 2. THE SIRIUS GATE - Seed saving on dry/fire days only
 * 3. THE SEASONAL CHORD - No summer notes in a spring song
 */

// ═══════════════════════════════════════════════════════════════════════════
// LUNAR CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

type MoonPhase = 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
type MoonCategory = 'new' | 'waxing' | 'full' | 'waning';

interface LunarData {
  phase: MoonPhase;
  category: MoonCategory;
  illumination: number;
  dayInCycle: number;
  zodiacSign: string;
  element: 'fire' | 'earth' | 'air' | 'water';
}

// Zodiac signs and their elements
const ZODIAC_SIGNS = [
  { sign: 'Aries', element: 'fire' as const, symbol: '♈' },
  { sign: 'Taurus', element: 'earth' as const, symbol: '♉' },
  { sign: 'Gemini', element: 'air' as const, symbol: '♊' },
  { sign: 'Cancer', element: 'water' as const, symbol: '♋' },
  { sign: 'Leo', element: 'fire' as const, symbol: '♌' },
  { sign: 'Virgo', element: 'earth' as const, symbol: '♍' },
  { sign: 'Libra', element: 'air' as const, symbol: '♎' },
  { sign: 'Scorpio', element: 'water' as const, symbol: '♏' },
  { sign: 'Sagittarius', element: 'fire' as const, symbol: '♐' },
  { sign: 'Capricorn', element: 'earth' as const, symbol: '♑' },
  { sign: 'Aquarius', element: 'air' as const, symbol: '♒' },
  { sign: 'Pisces', element: 'water' as const, symbol: '♓' },
];

// Calculate current lunar data
const calculateLunarData = (date: Date = new Date()): LunarData => {
  // Known new moon: January 6, 2000
  const knownNewMoon = new Date(2000, 0, 6, 18, 14);
  const lunarCycle = 29.53058867; // days
  
  const daysSinceKnown = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const currentCycleDay = daysSinceKnown % lunarCycle;
  const dayInCycle = currentCycleDay < 0 ? currentCycleDay + lunarCycle : currentCycleDay;
  
  // Determine phase
  let phase: MoonPhase;
  let category: MoonCategory;
  
  if (dayInCycle < 1.85) {
    phase = 'new';
    category = 'new';
  } else if (dayInCycle < 7.38) {
    phase = 'waxing-crescent';
    category = 'waxing';
  } else if (dayInCycle < 9.23) {
    phase = 'first-quarter';
    category = 'waxing';
  } else if (dayInCycle < 14.77) {
    phase = 'waxing-gibbous';
    category = 'waxing';
  } else if (dayInCycle < 16.61) {
    phase = 'full';
    category = 'full';
  } else if (dayInCycle < 22.15) {
    phase = 'waning-gibbous';
    category = 'waning';
  } else if (dayInCycle < 23.99) {
    phase = 'last-quarter';
    category = 'waning';
  } else {
    phase = 'waning-crescent';
    category = 'waning';
  }
  
  // Illumination percentage
  const illumination = Math.round(
    (1 - Math.cos(2 * Math.PI * dayInCycle / lunarCycle)) / 2 * 100
  );
  
  // Approximate zodiac sign (Moon moves through zodiac in ~27.3 days)
  const zodiacCycle = 27.32166;
  const zodiacDay = daysSinceKnown % zodiacCycle;
  const zodiacIndex = Math.floor((zodiacDay / zodiacCycle) * 12) % 12;
  const zodiac = ZODIAC_SIGNS[zodiacIndex];
  
  return {
    phase,
    category,
    illumination,
    dayInCycle: Math.floor(dayInCycle),
    zodiacSign: zodiac.sign,
    element: zodiac.element,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// SEASONAL MOVEMENTS (2026)
// ═══════════════════════════════════════════════════════════════════════════

interface SeasonalMovement {
  id: string;
  name: string;
  octave: string;
  startDate: string; // MM-DD
  endDate: string;
  hz: number;
  color: string;
  allowedCrops: string[];
  blockedCrops: string[];
  blockMessage: string;
}

const SEASONAL_MOVEMENTS: SeasonalMovement[] = [
  {
    id: 'root-whisper',
    name: 'THE ROOT WHISPER',
    octave: 'Deep Octave',
    startDate: '01-15',
    endDate: '03-15',
    hz: 396,
    color: 'hsl(0 60% 50%)',
    allowedCrops: ['Carrots', 'Beets', 'Radish', 'Turnips', 'Potatoes'],
    blockedCrops: ['Tomatoes', 'Peppers', 'Okra', 'Watermelon', 'Corn'],
    blockMessage: 'The Soil is still sleeping. Heat crops require warmer soil temps.',
  },
  {
    id: 'cool-octave',
    name: 'THE COOL OCTAVE',
    octave: 'Cool Octave',
    startDate: '03-15',
    endDate: '05-29',
    hz: 417,
    color: 'hsl(30 70% 50%)',
    allowedCrops: ['Lettuce', 'Spinach', 'Kale', 'Peas', 'Broccoli', 'Cabbage'],
    blockedCrops: ['Okra', 'Watermelon', 'Cantaloupe', 'Sweet Potato', 'Eggplant'],
    blockMessage: 'The Soil is singing the Cool Octave. Heat crops will stall.',
  },
  {
    id: 'solar-peak',
    name: 'THE SOLAR PEAK',
    octave: 'Hot Octave',
    startDate: '05-29',
    endDate: '08-15',
    hz: 528,
    color: 'hsl(51 80% 50%)',
    allowedCrops: ['Tomatoes', 'Peppers', 'Okra', 'Watermelon', 'Corn', 'Beans', 'Squash'],
    blockedCrops: ['Lettuce', 'Spinach', 'Peas'],
    blockMessage: 'The Fire is too strong. Cool crops will bolt to seed.',
  },
  {
    id: 'harvest-return',
    name: 'THE HARVEST RETURN',
    octave: 'Harvest Octave',
    startDate: '08-15',
    endDate: '11-01',
    hz: 639,
    color: 'hsl(120 50% 45%)',
    allowedCrops: ['Fall Greens', 'Garlic', 'Onions', 'Cover Crops', 'Brassicas'],
    blockedCrops: ['Watermelon', 'Cantaloupe', 'Corn'],
    blockMessage: 'The energy is descending. Summer crops will not mature.',
  },
  {
    id: 'seed-sanctuary',
    name: 'THE SEED SANCTUARY',
    octave: 'Rest Octave',
    startDate: '11-01',
    endDate: '01-15',
    hz: 963,
    color: 'hsl(300 50% 50%)',
    allowedCrops: ['Cover Crops', 'Garlic', 'Planning'],
    blockedCrops: ['Most crops - rest period'],
    blockMessage: 'The soil is resting. Honor the fallow period.',
  },
];

// Get current movement based on date
const getCurrentMovement = (date: Date = new Date()): SeasonalMovement => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
  for (const movement of SEASONAL_MOVEMENTS) {
    const [startMonth, startDay] = movement.startDate.split('-').map(Number);
    const [endMonth, endDay] = movement.endDate.split('-').map(Number);
    
    const start = startMonth * 100 + startDay;
    const end = endMonth * 100 + endDay;
    const current = month * 100 + day;
    
    // Handle year wrap (e.g., Nov - Jan)
    if (start > end) {
      if (current >= start || current <= end) return movement;
    } else {
      if (current >= start && current <= end) return movement;
    }
  }
  
  return SEASONAL_MOVEMENTS[1]; // Default to cool octave
};

// ═══════════════════════════════════════════════════════════════════════════
// CELESTIAL GATES
// ═══════════════════════════════════════════════════════════════════════════

interface CelestialTask {
  id: string;
  name: string;
  hz: number;
  crop: string;
  gate: 'lunar' | 'sirius' | 'seasonal';
  action: string;
}

const CELESTIAL_TASKS: CelestialTask[] = [
  // Lunar Gate - Root (396Hz) - Waning Moon or Earth Signs
  { id: 'root-carrots', name: 'Plant Carrots', hz: 396, crop: 'Carrots', gate: 'lunar', action: 'Root Planting' },
  { id: 'root-beets', name: 'Plant Beets', hz: 396, crop: 'Beets', gate: 'lunar', action: 'Root Planting' },
  { id: 'root-potatoes', name: 'Plant Potatoes', hz: 396, crop: 'Potatoes', gate: 'lunar', action: 'Root Planting' },
  // Lunar Gate - Leaf/Heart (639Hz) - Waxing Moon or Water Signs
  { id: 'leaf-kale', name: 'Plant Kale', hz: 639, crop: 'Kale', gate: 'lunar', action: 'Leaf Planting' },
  { id: 'leaf-lettuce', name: 'Plant Lettuce', hz: 639, crop: 'Lettuce', gate: 'lunar', action: 'Leaf Planting' },
  { id: 'leaf-spinach', name: 'Plant Spinach', hz: 639, crop: 'Spinach', gate: 'lunar', action: 'Leaf Planting' },
  // Lunar Gate - Fruit/Signal (741Hz) - Full Moon Approach or Fire Signs
  { id: 'fruit-tomato', name: 'Feed Tomatoes', hz: 741, crop: 'Tomatoes', gate: 'lunar', action: 'Fruit Feeding' },
  { id: 'fruit-berry', name: 'Feed Blueberries', hz: 741, crop: 'Blueberries', gate: 'lunar', action: 'Fruit Feeding' },
  { id: 'fruit-peppers', name: 'Feed Peppers', hz: 741, crop: 'Peppers', gate: 'lunar', action: 'Fruit Feeding' },
  // Sirius Gate - Seed (963Hz) - Surveyor Mode Only - Dry/Fire Windows
  { id: 'seed-save', name: 'Harvest for Seed', hz: 963, crop: 'Seeds', gate: 'sirius', action: 'Seed Saving' },
  { id: 'seed-tomato', name: 'Save Tomato Seed', hz: 963, crop: 'Tomato Seeds', gate: 'sirius', action: 'Seed Saving' },
  { id: 'seed-pepper', name: 'Save Pepper Seed', hz: 963, crop: 'Pepper Seeds', gate: 'sirius', action: 'Seed Saving' },
  // Seasonal Gate
  { id: 'heat-okra', name: 'Plant Okra', hz: 528, crop: 'Okra', gate: 'seasonal', action: 'Heat Crop Planting' },
  { id: 'heat-melon', name: 'Plant Watermelon', hz: 528, crop: 'Watermelon', gate: 'seasonal', action: 'Heat Crop Planting' },
  { id: 'heat-eggplant', name: 'Plant Eggplant', hz: 528, crop: 'Eggplant', gate: 'seasonal', action: 'Heat Crop Planting' },
];

// Gate validation result
interface GateResult {
  passed: boolean;
  gate: string;
  message: string;
  resolution?: string;
  waitUntil?: string;
}

// Validate Lunar Gate
const validateLunarGate = (task: CelestialTask, lunar: LunarData): GateResult => {
  // Root crops (396Hz) - Need waning moon OR earth signs
  // Biological: "As above, so below. The water moves with the moon."
  // Root energy is strong when moon pulls downward (waning)
  if (task.hz === 396) {
    const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
    const isWaning = lunar.category === 'waning';
    const isEarthSign = earthSigns.includes(lunar.zodiacSign);
    
    if (isWaning || isEarthSign) {
      return {
        passed: true,
        gate: 'LUNAR GATE',
        message: `Root Window OPEN: ${isWaning ? 'Waning Moon (energy descending)' : `Moon in ${lunar.zodiacSign} (Earth Sign)`}`,
      };
    }
    
    return {
      passed: false,
      gate: 'LUNAR GATE',
      message: `Cosmic Drag: Root energy is weak today. Wait for the Waning Phase.`,
      resolution: `Current: ${lunar.phase}, Moon in ${lunar.zodiacSign}. Root crops need descending energy.`,
      waitUntil: 'Next waning moon or Earth sign (Taurus/Virgo/Capricorn)',
    };
  }
  
  // Leaf/Heart crops (639Hz) - Need waxing moon OR water signs
  // Biological: Leaf energy needs rising water (waxing moon pulls upward)
  if (task.hz === 639) {
    const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];
    const isWaxing = lunar.category === 'waxing' || lunar.category === 'new';
    const isWaterSign = waterSigns.includes(lunar.zodiacSign);
    
    if (isWaxing || isWaterSign) {
      return {
        passed: true,
        gate: 'LUNAR GATE',
        message: `Leaf Window OPEN: ${isWaxing ? 'Waxing Moon (energy rising)' : `Moon in ${lunar.zodiacSign} (Water Sign)`}`,
      };
    }
    
    return {
      passed: false,
      gate: 'LUNAR GATE',
      message: `Cosmic Drag: Leaf energy needs rising water. Wait for the Waxing Phase.`,
      resolution: `Current: ${lunar.phase}, Moon in ${lunar.zodiacSign}. Leaf crops need ascending energy.`,
      waitUntil: 'Next waxing moon or Water sign (Cancer/Scorpio/Pisces)',
    };
  }
  
  // Fruit/Signal crops (741Hz) - Need full moon approach OR fire signs
  // Biological: Fruit swelling peaks with maximum lunar light (full moon)
  if (task.hz === 741) {
    const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
    const isFullApproach = lunar.category === 'full' || lunar.phase === 'waxing-gibbous';
    const isFireSign = fireSigns.includes(lunar.zodiacSign);
    
    if (isFullApproach || isFireSign) {
      return {
        passed: true,
        gate: 'LUNAR GATE',
        message: `Fruit Window OPEN: ${isFullApproach ? 'Full Moon Approach (maximum light)' : `Moon in ${lunar.zodiacSign} (Fire Sign)`}`,
      };
    }
    
    return {
      passed: false,
      gate: 'LUNAR GATE',
      message: `Cosmic Drag: Fruit energy needs fire/full moon. Wait for Full Moon Approach.`,
      resolution: `Current: ${lunar.phase}, Moon in ${lunar.zodiacSign}. Fruit crops need peak energy.`,
      waitUntil: 'Next full moon or Fire sign (Aries/Leo/Sagittarius)',
    };
  }
  
  return { passed: true, gate: 'LUNAR GATE', message: 'Gate Open' };
};

// Validate Sirius Gate (Seed Saving - Surveyor Mode Constraint)
// Rule: "The Seed holds the Pattern of the Universe" (Dogon)
// Constraint: ONLY allow during Dry/Fire Days to prevent mold
const validateSiriusGate = (task: CelestialTask, lunar: LunarData): GateResult => {
  if (task.gate !== 'sirius') return { passed: true, gate: 'SIRIUS GATE', message: 'Not applicable' };
  
  // Fire/Air days are dry days (low humidity favorable for seed drying)
  const dryElements = ['fire', 'air'];
  const isDryDay = dryElements.includes(lunar.element);
  
  // High energy windows: waning (descending energy for preservation) or full (peak vitality)
  const isHighEnergy = lunar.category === 'waning' || lunar.category === 'full';
  
  // Both conditions must be met for seed saving
  if (isDryDay && isHighEnergy) {
    return {
      passed: true,
      gate: 'SIRIUS GATE',
      message: `Seed Window OPEN: Dry Day (Moon in ${lunar.zodiacSign} / ${lunar.element}) + ${lunar.category} energy`,
    };
  }
  
  if (!isDryDay) {
    return {
      passed: false,
      gate: 'SIRIUS GATE',
      message: `Warning: Moisture/Humidity High. The Seed will not sleep.`,
      resolution: `Moon in ${lunar.zodiacSign} (${lunar.element} element). Seeds require Fire or Air days to dry properly and prevent mold.`,
      waitUntil: 'Wait for Dry Signal: Fire sign (Aries/Leo/Sagittarius) or Air sign (Gemini/Libra/Aquarius)',
    };
  }
  
  return {
    passed: false,
    gate: 'SIRIUS GATE',
    message: `Low energy window for seed preservation.`,
    resolution: `Current: ${lunar.phase}. Seeds prefer waning (descending energy for dormancy) or full moon (peak vitality capture).`,
    waitUntil: 'Next waning or full moon phase',
  };
};

// Validate Seasonal Chord
const validateSeasonalChord = (task: CelestialTask, movement: SeasonalMovement): GateResult => {
  if (task.gate !== 'seasonal') return { passed: true, gate: 'SEASONAL CHORD', message: 'Not applicable' };
  
  // Check if crop is blocked in current movement
  const isBlocked = movement.blockedCrops.some(crop => 
    task.crop.toLowerCase().includes(crop.toLowerCase())
  );
  
  if (!isBlocked) {
    return {
      passed: true,
      gate: 'SEASONAL CHORD',
      message: `Seasonal Window OPEN: ${task.crop} aligns with ${movement.name}`,
    };
  }
  
  // Find when this crop is allowed
  const allowedMovement = SEASONAL_MOVEMENTS.find(m => 
    m.allowedCrops.some(crop => task.crop.toLowerCase().includes(crop.toLowerCase()))
  );
  
  return {
    passed: false,
    gate: 'SEASONAL CHORD',
    message: `Frequency Mismatch: The Soil is singing the ${movement.octave}. ${task.crop} will stall.`,
    resolution: movement.blockMessage,
    waitUntil: allowedMovement ? `Wait for ${allowedMovement.name} (${allowedMovement.startDate})` : 'Check planting calendar',
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const CelestialEngine = () => {
  const [selectedTask, setSelectedTask] = useState<CelestialTask | null>(null);
  const [gateResults, setGateResults] = useState<GateResult[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  
  // Current cosmic data
  const lunar = useMemo(() => calculateLunarData(), []);
  const movement = useMemo(() => getCurrentMovement(), []);
  
  // Simulate different moon phases for testing
  const [simulatedPhase, setSimulatedPhase] = useState<MoonCategory | null>(null);
  const [simulatedElement, setSimulatedElement] = useState<'fire' | 'earth' | 'air' | 'water' | null>(null);
  
  // Active lunar data (real or simulated)
  const activeLunar = useMemo((): LunarData => {
    if (simulatedPhase || simulatedElement) {
      return {
        ...lunar,
        category: simulatedPhase || lunar.category,
        phase: simulatedPhase === 'waning' ? 'waning-gibbous' : 
               simulatedPhase === 'waxing' ? 'waxing-crescent' :
               simulatedPhase === 'full' ? 'full' : 'new',
        element: simulatedElement || lunar.element,
        zodiacSign: simulatedElement === 'fire' ? 'Aries' :
                    simulatedElement === 'earth' ? 'Taurus' :
                    simulatedElement === 'water' ? 'Cancer' :
                    simulatedElement === 'air' ? 'Gemini' : lunar.zodiacSign,
      };
    }
    return lunar;
  }, [lunar, simulatedPhase, simulatedElement]);
  
  // Validate task through all gates
  const validateTask = (task: CelestialTask) => {
    setSelectedTask(task);
    
    const results: GateResult[] = [];
    let blocked = false;
    
    // Gate 1: Lunar
    if (task.gate === 'lunar' || task.hz === 396 || task.hz === 639 || task.hz === 741) {
      const lunarResult = validateLunarGate(task, activeLunar);
      results.push(lunarResult);
      if (!lunarResult.passed) blocked = true;
    }
    
    // Gate 2: Sirius (Seed Saving)
    if (task.gate === 'sirius') {
      const siriusResult = validateSiriusGate(task, activeLunar);
      results.push(siriusResult);
      if (!siriusResult.passed) blocked = true;
    }
    
    // Gate 3: Seasonal
    if (task.gate === 'seasonal') {
      const seasonalResult = validateSeasonalChord(task, movement);
      results.push(seasonalResult);
      if (!seasonalResult.passed) blocked = true;
    }
    
    setGateResults(results);
    setIsBlocked(blocked);
  };
  
  const resetCheck = () => {
    setSelectedTask(null);
    setGateResults([]);
    setIsBlocked(false);
  };
  
  // Zodiac symbol lookup
  const getZodiacSymbol = (sign: string) => {
    return ZODIAC_SIGNS.find(z => z.sign === sign)?.symbol || '★';
  };
  
  // Element icon
  const getElementIcon = (element: string) => {
    switch (element) {
      case 'fire': return <Flame className="w-4 h-4" style={{ color: 'hsl(15 80% 55%)' }} />;
      case 'earth': return <Sprout className="w-4 h-4" style={{ color: 'hsl(120 40% 45%)' }} />;
      case 'water': return <Droplets className="w-4 h-4" style={{ color: 'hsl(210 70% 55%)' }} />;
      case 'air': return <Wind className="w-4 h-4" style={{ color: 'hsl(180 40% 60%)' }} />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(240 25% 12%), hsl(240 20% 8%))',
        border: `2px solid ${isBlocked ? 'hsl(0 60% 50%)' : 'hsl(240 40% 40%)'}`,
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: isBlocked 
            ? 'linear-gradient(135deg, hsl(0 30% 15%), hsl(0 25% 10%))'
            : 'linear-gradient(135deg, hsl(240 30% 18%), hsl(240 25% 12%))',
          borderBottom: `1px solid ${isBlocked ? 'hsl(0 40% 35%)' : 'hsl(240 30% 30%)'}`,
        }}
      >
        <div className="flex items-center gap-2">
          {isBlocked ? (
            <Lock className="w-5 h-5" style={{ color: 'hsl(0 70% 60%)' }} />
          ) : (
            <Star className="w-5 h-5" style={{ color: 'hsl(45 80% 65%)' }} />
          )}
          <h3
            className="text-lg tracking-wider"
            style={{ 
              fontFamily: "'Staatliches', sans-serif", 
              color: isBlocked ? 'hsl(0 70% 65%)' : 'hsl(45 80% 70%)' 
            }}
          >
            {isBlocked ? 'COSMIC DRAG' : 'CELESTIAL PROTOCOL'}
          </h3>
        </div>
        <p className="text-[10px] font-mono mt-1" style={{ color: isBlocked ? 'hsl(0 40% 50%)' : 'hsl(240 30% 55%)' }}>
          {isBlocked ? 'Window Closed • Wait for Alignment' : 'Cosmic Timing Validation Engine'}
        </p>
      </div>

      {/* Current Cosmic Status */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(45 60% 60%)' }}>
            CURRENT SKY
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {/* Moon Phase */}
          <div
            className="p-3 rounded-lg text-center"
            style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(45 40% 35%)' }}
          >
            <Moon className="w-6 h-6 mx-auto mb-1" style={{ color: 'hsl(45 70% 65%)' }} />
            <span className="text-xs font-mono font-bold block" style={{ color: 'hsl(45 70% 65%)' }}>
              {activeLunar.category.toUpperCase()}
            </span>
            <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
              {activeLunar.illumination}% lit
            </span>
          </div>
          
          {/* Zodiac Sign */}
          <div
            className="p-3 rounded-lg text-center"
            style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(270 40% 40%)' }}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-xl">{getZodiacSymbol(activeLunar.zodiacSign)}</span>
              {getElementIcon(activeLunar.element)}
            </div>
            <span className="text-xs font-mono font-bold block" style={{ color: 'hsl(270 60% 70%)' }}>
              {activeLunar.zodiacSign.toUpperCase().slice(0, 3)}
            </span>
            <span className="text-[9px] font-mono capitalize" style={{ color: 'hsl(0 0% 50%)' }}>
              {activeLunar.element}
            </span>
          </div>
          
          {/* Seasonal Movement */}
          <div
            className="p-3 rounded-lg text-center"
            style={{ background: 'hsl(0 0% 10%)', border: `1px solid ${movement.color}60` }}
          >
            <Calendar className="w-6 h-6 mx-auto mb-1" style={{ color: movement.color }} />
            <span className="text-[10px] font-mono font-bold block" style={{ color: movement.color }}>
              {movement.hz}Hz
            </span>
            <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
              {movement.octave}
            </span>
          </div>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
            SIMULATE:
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {(['waning', 'waxing', 'full', 'new'] as MoonCategory[]).map((phase) => (
            <button
              key={phase}
              onClick={() => setSimulatedPhase(simulatedPhase === phase ? null : phase)}
              className="text-[9px] font-mono px-2 py-1 rounded"
              style={{
                background: simulatedPhase === phase ? 'hsl(45 40% 25%)' : 'hsl(0 0% 12%)',
                border: `1px solid ${simulatedPhase === phase ? 'hsl(45 60% 50%)' : 'hsl(0 0% 25%)'}`,
                color: simulatedPhase === phase ? 'hsl(45 70% 70%)' : 'hsl(0 0% 55%)',
              }}
            >
              {phase}
            </button>
          ))}
          <span className="text-[9px] font-mono px-1" style={{ color: 'hsl(0 0% 35%)' }}>|</span>
          {(['fire', 'earth', 'water', 'air'] as const).map((elem) => (
            <button
              key={elem}
              onClick={() => setSimulatedElement(simulatedElement === elem ? null : elem)}
              className="text-[9px] font-mono px-2 py-1 rounded flex items-center gap-1"
              style={{
                background: simulatedElement === elem ? 'hsl(270 30% 25%)' : 'hsl(0 0% 12%)',
                border: `1px solid ${simulatedElement === elem ? 'hsl(270 50% 50%)' : 'hsl(0 0% 25%)'}`,
                color: simulatedElement === elem ? 'hsl(270 60% 70%)' : 'hsl(0 0% 55%)',
              }}
            >
              {elem}
            </button>
          ))}
        </div>
      </div>

      {/* Task Selector */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(195 50% 55%)' }}>
            VALIDATE TASK:
          </span>
          {selectedTask && (
            <button
              onClick={resetCheck}
              className="text-[9px] font-mono px-2 py-0.5 rounded"
              style={{ background: 'hsl(0 0% 15%)', color: 'hsl(0 0% 50%)', border: '1px solid hsl(0 0% 25%)' }}
            >
              RESET
            </button>
          )}
        </div>
        
        <div className="space-y-2">
          {/* Lunar Gate Tasks */}
          <div>
            <span className="text-[9px] font-mono block mb-1" style={{ color: 'hsl(45 50% 50%)' }}>
              LUNAR GATE:
            </span>
            <div className="flex flex-wrap gap-1">
              {CELESTIAL_TASKS.filter(t => t.gate === 'lunar').map((task) => (
                <Button
                  key={task.id}
                  variant="outline"
                  size="sm"
                  onClick={() => validateTask(task)}
                  className="text-[10px] h-7"
                  style={{
                    background: selectedTask?.id === task.id ? 'hsl(45 30% 20%)' : 'hsl(0 0% 10%)',
                    border: `1px solid ${selectedTask?.id === task.id ? 'hsl(45 50% 50%)' : 'hsl(0 0% 25%)'}`,
                    color: selectedTask?.id === task.id ? 'hsl(45 60% 65%)' : 'hsl(0 0% 55%)',
                  }}
                >
                  {task.crop}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Sirius Gate Tasks */}
          <div>
            <span className="text-[9px] font-mono block mb-1" style={{ color: 'hsl(300 50% 55%)' }}>
              SIRIUS GATE (Seed):
            </span>
            <div className="flex flex-wrap gap-1">
              {CELESTIAL_TASKS.filter(t => t.gate === 'sirius').map((task) => (
                <Button
                  key={task.id}
                  variant="outline"
                  size="sm"
                  onClick={() => validateTask(task)}
                  className="text-[10px] h-7"
                  style={{
                    background: selectedTask?.id === task.id ? 'hsl(300 25% 20%)' : 'hsl(0 0% 10%)',
                    border: `1px solid ${selectedTask?.id === task.id ? 'hsl(300 50% 50%)' : 'hsl(0 0% 25%)'}`,
                    color: selectedTask?.id === task.id ? 'hsl(300 60% 70%)' : 'hsl(0 0% 55%)',
                  }}
                >
                  {task.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Seasonal Gate Tasks */}
          <div>
            <span className="text-[9px] font-mono block mb-1" style={{ color: 'hsl(30 60% 55%)' }}>
              SEASONAL CHORD:
            </span>
            <div className="flex flex-wrap gap-1">
              {CELESTIAL_TASKS.filter(t => t.gate === 'seasonal').map((task) => (
                <Button
                  key={task.id}
                  variant="outline"
                  size="sm"
                  onClick={() => validateTask(task)}
                  className="text-[10px] h-7"
                  style={{
                    background: selectedTask?.id === task.id ? 'hsl(30 30% 20%)' : 'hsl(0 0% 10%)',
                    border: `1px solid ${selectedTask?.id === task.id ? 'hsl(30 50% 50%)' : 'hsl(0 0% 25%)'}`,
                    color: selectedTask?.id === task.id ? 'hsl(30 60% 65%)' : 'hsl(0 0% 55%)',
                  }}
                >
                  {task.crop}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gate Results */}
      <AnimatePresence>
        {gateResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div className="space-y-2">
              {gateResults.map((result, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-lg overflow-hidden"
                  style={{
                    background: result.passed ? 'hsl(120 25% 12%)' : 'hsl(0 25% 12%)',
                    border: `2px solid ${result.passed ? 'hsl(120 50% 40%)' : 'hsl(0 55% 45%)'}`,
                  }}
                >
                  {/* Gate Header */}
                  <div
                    className="px-3 py-2 flex items-center gap-2"
                    style={{
                      background: result.passed 
                        ? 'linear-gradient(90deg, hsl(120 30% 18%), transparent)'
                        : 'linear-gradient(90deg, hsl(0 35% 18%), transparent)',
                    }}
                  >
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5" style={{ color: 'hsl(120 60% 55%)' }} />
                    ) : (
                      <Lock className="w-5 h-5" style={{ color: 'hsl(0 70% 60%)' }} />
                    )}
                    <span
                      className="text-sm font-mono font-bold"
                      style={{ color: result.passed ? 'hsl(120 55% 60%)' : 'hsl(0 65% 65%)' }}
                    >
                      {result.gate}: {result.passed ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                  
                  {/* Gate Content */}
                  <div className="px-3 py-2">
                    <p className="text-xs font-mono" style={{ color: 'hsl(0 0% 65%)' }}>
                      {result.message}
                    </p>
                    
                    {!result.passed && result.resolution && (
                      <div
                        className="mt-2 p-2 rounded"
                        style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 20%)' }}
                      >
                        <span className="text-[9px] font-mono block mb-1" style={{ color: 'hsl(45 60% 60%)' }}>
                          RESOLUTION:
                        </span>
                        <p className="text-[11px] font-mono" style={{ color: 'hsl(45 50% 70%)' }}>
                          {result.resolution}
                        </p>
                        {result.waitUntil && (
                          <p className="text-[10px] font-mono mt-1" style={{ color: 'hsl(0 0% 50%)' }}>
                            ⏱ {result.waitUntil}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gate Reference */}
      {!selectedTask && gateResults.length === 0 && (
        <div className="px-4 pb-4">
          <div className="rounded-lg p-3" style={{ background: 'hsl(0 0% 8%)', border: '1px dashed hsl(0 0% 20%)' }}>
            <span className="text-[10px] font-mono block mb-2" style={{ color: 'hsl(45 50% 60%)' }}>
              THE THREE GATES:
            </span>
            <div className="space-y-1.5 text-[9px] font-mono">
              <div style={{ color: 'hsl(0 0% 55%)' }}>
                <span style={{ color: 'hsl(45 60% 60%)' }}>🌙 LUNAR:</span> Root=Waning/Earth • Leaf=Waxing/Water • Fruit=Full/Fire
              </div>
              <div style={{ color: 'hsl(0 0% 55%)' }}>
                <span style={{ color: 'hsl(300 50% 60%)' }}>✦ SIRIUS:</span> Seeds only on Dry/Fire days (prevent mold)
              </div>
              <div style={{ color: 'hsl(0 0% 55%)' }}>
                <span style={{ color: 'hsl(30 60% 60%)' }}>🎵 CHORD:</span> No summer notes in spring song
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CelestialEngine;
