import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, Clock, MapPin, User, Sparkles, Sun, Moon, ArrowUp, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateBirthChart, type ChartResult } from '@/lib/astroCalculator';
import { geocodeCity, type GeoResult } from '@/lib/geocoding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

const ZODIAC_SIGNS = [
  { sign: 'Capricorn', symbol: '♑', start: [12, 22], end: [1, 19], element: 'Earth' },
  { sign: 'Aquarius', symbol: '♒', start: [1, 20], end: [2, 18], element: 'Air' },
  { sign: 'Pisces', symbol: '♓', start: [2, 19], end: [3, 20], element: 'Water' },
  { sign: 'Aries', symbol: '♈', start: [3, 21], end: [4, 19], element: 'Fire' },
  { sign: 'Taurus', symbol: '♉', start: [4, 20], end: [5, 20], element: 'Earth' },
  { sign: 'Gemini', symbol: '♊', start: [5, 21], end: [6, 20], element: 'Air' },
  { sign: 'Cancer', symbol: '♋', start: [6, 21], end: [7, 22], element: 'Water' },
  { sign: 'Leo', symbol: '♌', start: [7, 23], end: [8, 22], element: 'Fire' },
  { sign: 'Virgo', symbol: '♍', start: [8, 23], end: [9, 22], element: 'Earth' },
  { sign: 'Libra', symbol: '♎', start: [9, 23], end: [10, 22], element: 'Air' },
  { sign: 'Scorpio', symbol: '♏', start: [10, 23], end: [11, 21], element: 'Water' },
  { sign: 'Sagittarius', symbol: '♐', start: [11, 22], end: [12, 21], element: 'Fire' },
];

const SIGN_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

/**
 * Determines Sun sign from month (1-12) and day.
 * Used as fallback if celestine calculation fails.
 */
const ZODIAC_RANGES: { sign: string; startMonth: number; startDay: number; endMonth: number; endDay: number }[] = [
  { sign: 'Aries',       startMonth: 3,  startDay: 21, endMonth: 4,  endDay: 19 },
  { sign: 'Taurus',      startMonth: 4,  startDay: 20, endMonth: 5,  endDay: 20 },
  { sign: 'Gemini',      startMonth: 5,  startDay: 21, endMonth: 6,  endDay: 20 },
  { sign: 'Cancer',      startMonth: 6,  startDay: 21, endMonth: 7,  endDay: 22 },
  { sign: 'Leo',         startMonth: 7,  startDay: 23, endMonth: 8,  endDay: 22 },
  { sign: 'Virgo',       startMonth: 8,  startDay: 23, endMonth: 9,  endDay: 22 },
  { sign: 'Libra',       startMonth: 9,  startDay: 23, endMonth: 10, endDay: 22 },
  { sign: 'Scorpio',     startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { sign: 'Capricorn',   startMonth: 12, startDay: 22, endMonth: 1,  endDay: 19 },
  { sign: 'Aquarius',    startMonth: 1,  startDay: 20, endMonth: 2,  endDay: 18 },
  { sign: 'Pisces',      startMonth: 2,  startDay: 19, endMonth: 3,  endDay: 20 },
];

const getZodiacSign = (month: number, day: number) => {
  for (const range of ZODIAC_RANGES) {
    if (range.startMonth > range.endMonth) {
      if (
        (month === range.startMonth && day >= range.startDay) ||
        (month === range.endMonth && day <= range.endDay)
      ) {
        return ZODIAC_SIGNS.find(z => z.sign === range.sign) || ZODIAC_SIGNS[0];
      }
    } else {
      const afterStart = month > range.startMonth || (month === range.startMonth && day >= range.startDay);
      const beforeEnd = month < range.endMonth || (month === range.endMonth && day <= range.endDay);
      if (afterStart && beforeEnd) {
        return ZODIAC_SIGNS.find(z => z.sign === range.sign) || ZODIAC_SIGNS[0];
      }
    }
  }
  return ZODIAC_SIGNS[0];
};

const getResonance = (elements: string[]) => {
  const fire = elements.filter(e => e === 'Fire').length;
  const earth = elements.filter(e => e === 'Earth').length;

  if (fire >= 2) return {
    type: 'HIGH RESONANCE', subtitle: 'COMPANION PLANT',
    description: 'Your fire feeds the vision. Claim your share of the harvest.',
    color: '#FFD700', glowColor: 'rgba(255, 215, 0, 0.5)',
    btnClass: 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-stone-900',
    btnText: 'JOIN THE 2026 CSA (YOU ARE A MATCH)',
  };
  if (earth >= 2) return {
    type: 'GROUNDING FORCE', subtitle: 'SOIL BUILDER',
    description: 'Your earth holds the roots. We need your stability.',
    color: '#4CAF50', glowColor: 'rgba(76, 175, 80, 0.5)',
    btnClass: 'bg-gradient-to-r from-green-800 via-green-700 to-green-800 text-white',
    btnText: 'ANCHOR THE HARVEST (SECURE YOUR SPOT)',
  };
  return {
    type: 'ALCHEMICAL MIX', subtitle: 'ESSENTIAL BALANCE',
    description: 'You bring the rain and the breath. Complete the ecosystem.',
    color: '#42A5F5', glowColor: 'rgba(66, 165, 245, 0.5)',
    btnClass: 'bg-gradient-to-r from-sky-600 via-blue-500 to-sky-600 text-white',
    btnText: 'BALANCE THE SOIL (JOIN THE MIX)',
  };
};

type Step = 'form' | 'calculating' | 'result';

interface UserChart {
  sun: { sign: string; symbol: string; element: string; formatted?: string };
  moon: { sign: string; symbol: string; element: string; formatted?: string };
  rising: { sign: string; symbol: string; element: string; formatted?: string };
  precise?: boolean;
}

const VICI_CHART = {
  sun: { sign: 'Aries', symbol: '♈', element: 'Fire' },
  moon: { sign: 'Capricorn', symbol: '♑', element: 'Earth' },
  rising: { sign: 'Sagittarius', symbol: '♐', element: 'Fire' },
};

const CALC_PHRASES = [
  'Mapping celestial coordinates...',
  'Aligning planetary positions...',
  'Calculating lunar phase at birth...',
  'Cross-referencing ephemeris tables...',
  'Extracting elemental signatures...',
  'Scanning for harmonic resonance...',
  'Comparing soil frequencies...',
  'Finalizing cosmic blueprint...',
];

const StarMapping = () => {
  const [step, setStep] = useState<Step>('form');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');
  const [birthAmPm, setBirthAmPm] = useState<'AM' | 'PM'>('AM');
  const [birthCity, setBirthCity] = useState('');
  const [birthState, setBirthState] = useState('');
  const [progress, setProgress] = useState(0);
  const [calcText, setCalcText] = useState('');
  const [userChart, setUserChart] = useState<UserChart | null>(null);
  const [isPrecise, setIsPrecise] = useState(false);
  const [geoResult, setGeoResult] = useState<GeoResult | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const hasAnyField = fullName.trim() !== '';
  const isTimeComplete = birthHour !== '' && birthMinute !== '';
  const isFormComplete = hasAnyField && birthDate !== undefined && isTimeComplete && birthState !== '';

  // Calculation animation
  useEffect(() => {
    if (step !== 'calculating') return;
    let phrase = 0;
    const phraseInt = setInterval(() => {
      setCalcText(CALC_PHRASES[phrase % CALC_PHRASES.length]);
      phrase++;
    }, 400);
    const progressInt = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInt);
          clearInterval(phraseInt);
          setTimeout(() => {
            setStep('result');
            setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => { clearInterval(phraseInt); clearInterval(progressInt); };
  }, [step]);

  // Debounced geocoding when city or state changes
  useEffect(() => {
    if (!birthCity.trim() || !birthState) {
      setGeoResult(null);
      return;
    }
    const timer = setTimeout(async () => {
      setIsGeocoding(true);
      try {
        const result = await geocodeCity(birthCity, birthState);
        setGeoResult(result);
      } catch {
        setGeoResult(null);
      } finally {
        setIsGeocoding(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [birthCity, birthState]);

  const handleCalculate = () => {
    if (!isFormComplete || !birthDate) return;
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    // Convert 12h to 24h
    let hours = parseInt(birthHour, 10);
    const minutes = parseInt(birthMinute, 10) || 0;
    if (birthAmPm === 'PM' && hours !== 12) hours += 12;
    if (birthAmPm === 'AM' && hours === 12) hours = 0;

    try {
      // Use precise celestine ephemeris calculations
      // Pass geocoded lat/lon if available for city-level precision
      const chart = calculateBirthChart(
        year, month, day, hours, minutes || 0, birthState,
        geoResult?.lat, geoResult?.lon
      );
      setUserChart({
        sun: chart.sun,
        moon: chart.moon,
        rising: chart.rising,
      });
      setIsPrecise(true);
    } catch (err) {
      console.warn('Celestine calculation failed, falling back to approximation:', err);
      // Fallback to basic zodiac lookup
      const sunSign = getZodiacSign(month, day);
      setUserChart({
        sun: { sign: sunSign.sign, symbol: sunSign.symbol, element: sunSign.element },
        moon: { sign: 'Unknown', symbol: '☽', element: 'Water' },
        rising: { sign: 'Unknown', symbol: '↑', element: 'Fire' },
      });
      setIsPrecise(false);
    }
    setProgress(0);
    setStep('calculating');
  };

  const handleReset = () => {
    setStep('form');
    setFullName('');
    setBirthDate(undefined);
    setBirthHour('');
    setBirthMinute('');
    setBirthAmPm('AM');
    setBirthCity('');
    setBirthState('');
    setUserChart(null);
    setIsPrecise(false);
    setGeoResult(null);
    setProgress(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resonance = userChart
    ? getResonance([userChart.sun.element, userChart.moon.element, userChart.rising.element])
    : null;

  const elementColors: Record<string, string> = {
    Fire: '#EF5350', Earth: '#8D6E63', Air: '#42A5F5', Water: '#26C6DA',
  };

  return (
    <div className="w-full overflow-y-auto scrollbar-hide" style={{ backgroundColor: '#f4f1ea' }}>
      {/* ===== SECTION 1: PARCHMENT FORM ===== */}
      <div className="min-h-screen relative">
        {/* Texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-start px-4 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" style={{ color: '#5D4037' }} />
              <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: '#8D6E63' }}>
                AgroMajic
              </span>
              <Sparkles className="w-5 h-5" style={{ color: '#5D4037' }} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ color: '#3E2723' }}>
              Star Mapping
            </h1>
            <p className="text-sm md:text-base max-w-xs mx-auto" style={{ color: '#6D4C41' }}>
              Initialize your cosmic coordinates for resonance calculation
            </p>
          </div>

          {/* Form Card */}
          <div
            className="w-full max-w-md rounded-2xl p-6 md:p-8 shadow-lg"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(93, 64, 55, 0.15)',
            }}
          >
            <div className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 sirius-text" style={{ color: '#5D4037' }}>
                  <User className="w-4 h-4" /> Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 rounded-xl border-2 bg-white/80 placeholder:text-stone-400 transition-all duration-200 sirius-text"
                  style={{ borderColor: '#D7CCC8', color: '#3E2723' }}
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 sirius-text" style={{ color: '#5D4037' }}>
                  <CalendarIcon className="w-4 h-4" /> Date of Birth
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal rounded-xl border-2 bg-white/80 transition-all duration-200",
                        !birthDate && "text-stone-400"
                      )}
                      style={{ borderColor: '#D7CCC8', color: birthDate ? '#3E2723' : undefined }}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" style={{ color: '#8D6E63' }} />
                      {birthDate ? format(birthDate, "PPP") : "Select your birth date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border-2 rounded-xl shadow-xl z-50"
                    align="start"
                    style={{ borderColor: '#D7CCC8' }}
                  >
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time of Birth — Hour / Minute / AM-PM */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 sirius-text" style={{ color: '#5D4037' }}>
                  <Clock className="w-4 h-4" /> Time of Birth
                </label>
                <div className="flex gap-2">
                  {/* Hour */}
                  <Select value={birthHour} onValueChange={setBirthHour}>
                    <SelectTrigger
                      className="h-12 rounded-xl border-2 bg-white/80 transition-all duration-200 flex-1"
                      style={{ borderColor: '#D7CCC8', color: birthHour ? '#3E2723' : '#a8a29e' }}
                    >
                      <SelectValue placeholder="Hr" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white border-2 rounded-xl shadow-xl z-50 max-h-60"
                      style={{ borderColor: '#D7CCC8' }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <SelectItem key={h} value={String(h)} style={{ color: '#3E2723' }}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="flex items-center text-xl font-bold" style={{ color: '#5D4037' }}>:</span>

                  {/* Minute */}
                  <Select value={birthMinute} onValueChange={setBirthMinute}>
                    <SelectTrigger
                      className="h-12 rounded-xl border-2 bg-white/80 transition-all duration-200 flex-1"
                      style={{ borderColor: '#D7CCC8', color: birthMinute ? '#3E2723' : '#a8a29e' }}
                    >
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white border-2 rounded-xl shadow-xl z-50 max-h-60"
                      style={{ borderColor: '#D7CCC8' }}
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                        <SelectItem key={m} value={String(m)} style={{ color: '#3E2723' }}>
                          {String(m).padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* AM/PM Toggle */}
                  <div
                    className="flex rounded-xl border-2 overflow-hidden h-12"
                    style={{ borderColor: '#D7CCC8' }}
                  >
                    <button
                      type="button"
                      onClick={() => setBirthAmPm('AM')}
                      className="px-3 text-sm font-bold transition-all duration-200"
                      style={{
                        backgroundColor: birthAmPm === 'AM' ? '#3E2723' : 'rgba(255,255,255,0.8)',
                        color: birthAmPm === 'AM' ? '#FFD700' : '#8D6E63',
                      }}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setBirthAmPm('PM')}
                      className="px-3 text-sm font-bold transition-all duration-200"
                      style={{
                        backgroundColor: birthAmPm === 'PM' ? '#3E2723' : 'rgba(255,255,255,0.8)',
                        color: birthAmPm === 'PM' ? '#FFD700' : '#8D6E63',
                      }}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              {/* Location of Birth - City */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 sirius-text" style={{ color: '#5D4037' }}>
                  <MapPin className="w-4 h-4" /> City of Birth
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="City (optional — improves precision)"
                    value={birthCity}
                    onChange={(e) => setBirthCity(e.target.value)}
                    className="h-12 rounded-xl border-2 bg-white/80 placeholder:text-stone-400 transition-all duration-200 pr-10 sirius-text"
                    style={{ borderColor: '#D7CCC8', color: '#3E2723' }}
                  />
                  {isGeocoding && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: '#8D6E63' }} />
                  )}
                  {!isGeocoding && geoResult && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-sm">✓</span>
                  )}
                </div>
                {geoResult && (
                  <p className="text-[10px] sirius-text" style={{ color: '#8D6E63' }}>
                    📍 {geoResult.lat.toFixed(4)}°, {geoResult.lon.toFixed(4)}°
                  </p>
                )}
              </div>

              {/* State Dropdown — directly under birth location */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 sirius-text" style={{ color: '#5D4037' }}>
                  <MapPin className="w-4 h-4" /> State
                </label>
                <Select value={birthState} onValueChange={setBirthState}>
                  <SelectTrigger
                    className="h-12 rounded-xl border-2 bg-white/80 transition-all duration-200"
                    style={{ borderColor: '#D7CCC8', color: birthState ? '#3E2723' : '#a8a29e' }}
                  >
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border-2 rounded-xl shadow-xl z-50 max-h-60"
                    style={{ borderColor: '#D7CCC8' }}
                  >
                    {US_STATES.map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                        className="cursor-pointer hover:bg-stone-100"
                        style={{ color: '#3E2723' }}
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calculate Button — highlights after first field (hasAnyField) */}
            <div className="mt-8">
              <button
                onClick={handleCalculate}
                disabled={!isFormComplete}
                className={cn(
                  "w-full h-14 rounded-xl font-bold text-lg tracking-wide",
                  "flex items-center justify-center gap-2",
                  "transition-all duration-700 ease-out transform"
                )}
                style={{
                  backgroundColor: isFormComplete
                    ? '#FFD700'
                    : hasAnyField
                      ? '#D4A017'
                      : '#BCAAA4',
                  color: isFormComplete || hasAnyField ? '#3E2723' : '#8D6E63',
                  opacity: isFormComplete ? 1 : hasAnyField ? 0.75 : 0.5,
                  boxShadow: isFormComplete
                    ? '0 0 35px rgba(255, 215, 0, 0.6), 0 4px 25px rgba(255, 215, 0, 0.35)'
                    : hasAnyField
                      ? '0 0 15px rgba(212, 160, 23, 0.3)'
                      : 'none',
                  transform: isFormComplete ? 'scale(1)' : 'scale(0.98)',
                  cursor: isFormComplete ? 'pointer' : 'not-allowed',
                }}
              >
                <Sparkles className={cn("w-5 h-5 transition-all duration-500", isFormComplete && "animate-pulse")} />
                CALCULATE RESONANCE
              </button>
              <p
                className="text-center text-xs mt-3 transition-opacity duration-500"
                style={{ color: '#8D6E63', opacity: isFormComplete ? 0 : 0.8 }}
              >
                {hasAnyField ? 'Almost there — complete all fields' : 'Complete all fields to activate resonance'}
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-xs text-center mt-8 max-w-xs" style={{ color: '#A1887F' }}>
            Your birth data is used to map your cosmic coordinates against the AgroMajic frequency grid.
          </p>

          {/* Scroll indicator */}
          {step === 'form' && (
            <motion.div
              className="mt-12 flex flex-col items-center gap-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: '#A1887F', opacity: 0.5 }}
            >
              <p className="text-xs tracking-widest uppercase">Scroll to explore</p>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4 L10 16 M4 10 L10 16 L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>

      {/* ===== TRANSITION: PARCHMENT → SPACE ===== */}
      <div
        className="h-[40vh] relative"
        style={{
          background: 'linear-gradient(to bottom, #f4f1ea 0%, #3E2723 30%, #1a0a00 70%, #050010 100%)',
        }}
      >
        {/* Fading stars appear in the gradient */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${30 + Math.random() * 70}%`,
              }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </div>
      </div>

      {/* ===== SECTION 2: DEEP SPACE (Calculation / Results) ===== */}
      <div
        ref={resultsRef}
        className="min-h-screen relative"
        style={{ backgroundColor: '#050010' }}
      >
        {/* Star field */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 80 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.5 + Math.random() * 1.5}px`,
                height: `${0.5 + Math.random() * 1.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        {/* Cosmic glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[180px]"
          style={{ backgroundColor: resonance?.glowColor || 'rgba(100, 50, 200, 0.15)' }}
        />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
          <AnimatePresence mode="wait">
            {/* CALCULATING STATE */}
            {step === 'calculating' && (
              <motion.div
                key="calc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-lg text-center"
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: 'rgba(255, 215, 0, 0.5)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: '#FFD700' }} />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">The AgroMajic Algorithm</h3>
                <p className="text-sm mb-8" style={{ color: '#8D6E63' }}>Processing celestial data...</p>

                <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Progress value={progress} className="h-3 mb-4" />
                  <p className="font-mono text-xs h-5" style={{ color: 'rgba(255, 215, 0, 0.8)' }}>{calcText}</p>
                  <div className="mt-4 h-16 overflow-hidden font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0, 1, 0], y: [-10, 0, 10] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      >
                        {`0x${Math.random().toString(16).slice(2, 10)} :: ${Math.random().toFixed(8)}`}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* RESULT STATE */}
            {step === 'result' && userChart && resonance && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl"
              >
                {/* Resonance Header */}
                <motion.div
                  className="text-center mb-10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#8D6E63' }}>
                    Analysis Complete
                  </p>
                  <h2 className="text-4xl md:text-6xl font-bold mb-1" style={{ color: resonance.color }}>
                    {resonance.type}
                  </h2>
                  <p className="text-xl font-semibold text-white">{resonance.subtitle}</p>
                </motion.div>

                {/* Chart Comparison */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {/* User Chart */}
                  <motion.div
                    className="rounded-2xl p-6"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="text-lg font-bold text-center text-white mb-1">
                      {fullName}'s Chart
                    </h4>
                    <p className="text-xs text-center mb-5" style={{ color: '#8D6E63' }}>
                      {birthState && `${birthCity ? birthCity + ', ' : ''}${birthState}`}
                    </p>
                    <div className="space-y-3">
                      <ChartRow icon={<Sun className="w-5 h-5" style={{ color: '#FFD700' }} />} label="Sun" metaphor="The Fruit" sign={userChart.sun.sign} symbol={userChart.sun.symbol} element={userChart.sun.element} elementColors={elementColors} formatted={userChart.sun.formatted} />
                      <ChartRow icon={<Moon className="w-5 h-5" style={{ color: '#B0BEC5' }} />} label="Moon" metaphor="The Root" sign={userChart.moon.sign} symbol={userChart.moon.symbol} element={userChart.moon.element} elementColors={elementColors} formatted={userChart.moon.formatted} />
                      <ChartRow icon={<ArrowUp className="w-5 h-5" style={{ color: '#CE93D8' }} />} label="Rising" metaphor="The Stalk" sign={userChart.rising.sign} symbol={userChart.rising.symbol} element={userChart.rising.element} elementColors={elementColors} formatted={userChart.rising.formatted} />
                    </div>
                  </motion.div>

                  {/* Vici's Chart */}
                  <motion.div
                    className="rounded-2xl p-6"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: `1px solid ${resonance.glowColor}` }}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="text-lg font-bold text-center mb-1" style={{ color: resonance.color }}>
                      Vici Royàl's Chart
                    </h4>
                    <p className="text-xs text-center mb-5" style={{ color: '#8D6E63' }}>
                      The Artist Baseline
                    </p>
                    <div className="space-y-3">
                      <ChartRow icon={<Sun className="w-5 h-5" style={{ color: '#FFD700' }} />} label="Sun" metaphor="The Fruit" sign={VICI_CHART.sun.sign} symbol={VICI_CHART.sun.symbol} element={VICI_CHART.sun.element} elementColors={elementColors} />
                      <ChartRow icon={<Moon className="w-5 h-5" style={{ color: '#B0BEC5' }} />} label="Moon" metaphor="The Root" sign={VICI_CHART.moon.sign} symbol={VICI_CHART.moon.symbol} element={VICI_CHART.moon.element} elementColors={elementColors} />
                      <ChartRow icon={<ArrowUp className="w-5 h-5" style={{ color: '#CE93D8' }} />} label="Rising" metaphor="The Stalk" sign={VICI_CHART.rising.sign} symbol={VICI_CHART.rising.symbol} element={VICI_CHART.rising.element} elementColors={elementColors} />
                    </div>
                  </motion.div>
                </div>

                {/* Accuracy Note */}
                <motion.div
                  className="text-center max-w-lg mx-auto mb-6 p-4 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  <p className="text-xs" style={{ color: '#8D6E63' }}>
                    {isPrecise ? (
                      <>
                        <strong className="text-white/60">✧ Precision Ephemeris Active</strong> — Your Sun, Moon &amp; Rising signs
                        are calculated using the Celestine astronomical engine, validated against NASA/JPL Horizons &amp; Swiss Ephemeris data.
                        {geoResult
                          ? ` City-level coordinates: ${geoResult.lat.toFixed(4)}°, ${geoResult.lon.toFixed(4)}°. DST-aware timezone applied.`
                          : " Coordinates based on your state's geographic center. Add a city for higher precision."}
                      </>
                    ) : (
                      <>
                        <strong className="text-white/60">☽ Moon &amp; ↑ Rising signs</strong> could not be calculated precisely.
                        Your Sun sign is accurate based on your birth date.
                      </>
                    )}
                  </p>
                </motion.div>

                {/* Description */}
                <motion.p
                  className="text-center max-w-xl mx-auto mb-10"
                  style={{ color: '#A1887F' }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {resonance.description}
                </motion.p>

                {/* CTA Button — floats up */}
                <motion.div
                  className="flex flex-col items-center gap-4"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, type: 'spring', stiffness: 80 }}
                >
                  <motion.div className="relative group" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                    {/* Glow behind */}
                    <motion.div
                      className="absolute inset-0 rounded-xl blur-xl"
                      style={{ backgroundColor: resonance.glowColor }}
                      animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <a href="#shop" className="relative block">
                      <Button className={cn("relative px-10 py-8 text-lg font-bold tracking-wide rounded-xl", resonance.btnClass)}>
                        <Sparkles className="w-5 h-5 mr-3" />
                        {resonance.btnText}
                      </Button>
                    </a>
                    {/* Hover detail */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="px-4 py-2 rounded-lg text-center whitespace-nowrap" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <p className="text-white text-sm font-medium">2026 CSA Share • Limited Availability</p>
                        <p className="text-xs" style={{ color: '#8D6E63' }}>Click to view pricing & details</p>
                      </div>
                    </div>
                  </motion.div>

                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-sm mt-6 transition-colors"
                    style={{ color: '#8D6E63' }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Calculate Again
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* IDLE SPACE STATE (before calculation) */}
            {step === 'form' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center px-4"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: 'rgba(255, 215, 0, 0.3)' }} />
                </motion.div>
                <h3 className="text-2xl font-bold text-white/30 mb-2">The Cosmos Awaits</h3>
                <p className="text-sm max-w-xs mx-auto" style={{ color: 'rgba(141, 110, 99, 0.5)' }}>
                  Complete the form above and calculate your resonance to see your cosmic profile here
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom fade */}
        <div className="h-20" style={{ background: 'linear-gradient(to bottom, transparent, #050010)' }} />
      </div>

      {/* Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        input:focus, button:focus {
          outline: none;
          border-color: #8D6E63 !important;
          box-shadow: 0 0 0 3px rgba(141, 110, 99, 0.2);
        }
      `}</style>
    </div>
  );
};

/* ── Chart Row Component ── */
interface ChartRowProps {
  icon: React.ReactNode;
  label: string;
  metaphor: string;
  sign: string;
  symbol: string;
  element: string;
  elementColors: Record<string, string>;
  formatted?: string;
}

const ChartRow = ({ icon, label, metaphor, sign, symbol, element, elementColors, formatted }: ChartRowProps) => (
  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1">
      <div className="flex items-baseline gap-2">
        <span className="text-white font-medium text-sm">{label}</span>
        <span className="text-xs" style={{ color: '#8D6E63' }}>({metaphor})</span>
      </div>
      {formatted && (
        <span className="text-[10px] font-mono block mt-0.5" style={{ color: 'rgba(255, 215, 0, 0.6)' }}>
          {formatted}
        </span>
      )}
    </div>
    <div className="text-right flex items-center gap-1">
      <span className="text-2xl">{symbol}</span>
      <span className="text-white text-sm">{sign}</span>
      <span className="text-xs ml-1" style={{ color: elementColors[element] || '#999' }}>{element}</span>
    </div>
  </div>
);

export default StarMapping;
