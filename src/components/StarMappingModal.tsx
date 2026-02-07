import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Sun, Moon, ArrowUp } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface StarMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Zodiac date ranges for Sun sign calculation
const ZODIAC_SIGNS = [
  { sign: 'Capricorn', symbol: '♑', start: { month: 12, day: 22 }, end: { month: 1, day: 19 }, element: 'Earth' },
  { sign: 'Aquarius', symbol: '♒', start: { month: 1, day: 20 }, end: { month: 2, day: 18 }, element: 'Air' },
  { sign: 'Pisces', symbol: '♓', start: { month: 2, day: 19 }, end: { month: 3, day: 20 }, element: 'Water' },
  { sign: 'Aries', symbol: '♈', start: { month: 3, day: 21 }, end: { month: 4, day: 19 }, element: 'Fire' },
  { sign: 'Taurus', symbol: '♉', start: { month: 4, day: 20 }, end: { month: 5, day: 20 }, element: 'Earth' },
  { sign: 'Gemini', symbol: '♊', start: { month: 5, day: 21 }, end: { month: 6, day: 20 }, element: 'Air' },
  { sign: 'Cancer', symbol: '♋', start: { month: 6, day: 21 }, end: { month: 7, day: 22 }, element: 'Water' },
  { sign: 'Leo', symbol: '♌', start: { month: 7, day: 23 }, end: { month: 8, day: 22 }, element: 'Fire' },
  { sign: 'Virgo', symbol: '♍', start: { month: 8, day: 23 }, end: { month: 9, day: 22 }, element: 'Earth' },
  { sign: 'Libra', symbol: '♎', start: { month: 9, day: 23 }, end: { month: 10, day: 22 }, element: 'Air' },
  { sign: 'Scorpio', symbol: '♏', start: { month: 10, day: 23 }, end: { month: 11, day: 21 }, element: 'Water' },
  { sign: 'Sagittarius', symbol: '♐', start: { month: 11, day: 22 }, end: { month: 12, day: 21 }, element: 'Fire' },
];

// Vici Royàl's Chart (The Artist Baseline)
const VICI_CHART = {
  sun: { sign: 'Aries', symbol: '♈', element: 'Fire', metaphor: 'The Fruit' },
  moon: { sign: 'Capricorn', symbol: '♑', element: 'Earth', metaphor: 'The Root' },
  rising: { sign: 'Sagittarius', symbol: '♐', element: 'Fire', metaphor: 'The Stalk' },
};

// Rising sign simplified calculation (based on birth hour)
const RISING_BY_HOUR = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

type Step = 'input' | 'calculating' | 'result';

interface UserChart {
  sun: { sign: string; symbol: string; element: string };
  moon: { sign: string; symbol: string; element: string };
  rising: { sign: string; symbol: string; element: string };
}

const getZodiacSign = (month: number, day: number) => {
  for (const zodiac of ZODIAC_SIGNS) {
    if (zodiac.start.month === 12 && zodiac.end.month === 1) {
      // Handle Capricorn spanning year boundary
      if ((month === 12 && day >= zodiac.start.day) || (month === 1 && day <= zodiac.end.day)) {
        return zodiac;
      }
    } else if (
      (month === zodiac.start.month && day >= zodiac.start.day) ||
      (month === zodiac.end.month && day <= zodiac.end.day)
    ) {
      return zodiac;
    }
  }
  return ZODIAC_SIGNS[0]; // Default to Capricorn
};

const getMoonSign = (birthDate: Date) => {
  // Simplified: Moon moves through each sign every ~2.5 days
  const dayOfYear = Math.floor((birthDate.getTime() - new Date(birthDate.getFullYear(), 0, 0).getTime()) / 86400000);
  const moonIndex = Math.floor((dayOfYear * 12) / 365) % 12;
  return ZODIAC_SIGNS.find(z => z.sign === RISING_BY_HOUR[moonIndex]) || ZODIAC_SIGNS[0];
};

const getRisingSign = (hour: number) => {
  // Rising sign changes every 2 hours
  const risingIndex = Math.floor(hour / 2) % 12;
  const signName = RISING_BY_HOUR[risingIndex];
  return ZODIAC_SIGNS.find(z => z.sign === signName) || ZODIAC_SIGNS[0];
};

const getResonanceType = (elements: string[]) => {
  const fireCount = elements.filter(e => e === 'Fire').length;
  const earthCount = elements.filter(e => e === 'Earth').length;
  
  if (fireCount >= 2) {
    return {
      type: 'HIGH RESONANCE',
      subtitle: 'COMPANION PLANT',
      description: 'Your fire energy aligns with the creative spark of Vici Royàl. You are a natural growth partner in the Digital Greenhouse.',
      color: 'hsl(0 60% 50%)',
      showCTA: true,
    };
  } else if (earthCount >= 2) {
    return {
      type: 'GROUNDING FORCE',
      subtitle: 'SOIL BUILDER',
      description: 'Your earth energy provides the stable foundation that roots need to thrive. You are the mineral layer beneath the music.',
      color: 'hsl(25 50% 40%)',
      showCTA: true,
    };
  } else {
    return {
      type: 'ALCHEMICAL MIX',
      subtitle: 'NEEDS IRRIGATION',
      description: 'Your elemental blend brings unique moisture and movement to the ecosystem. With proper cultivation, rare compounds emerge.',
      color: 'hsl(210 60% 50%)',
      showCTA: false,
    };
  }
};

const StarMappingModal = ({ isOpen, onClose }: StarMappingModalProps) => {
  const [step, setStep] = useState<Step>('input');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [progress, setProgress] = useState(0);
  const [calculationText, setCalculationText] = useState('');
  const [userChart, setUserChart] = useState<UserChart | null>(null);

  const calculationPhrases = [
    'Mapping celestial coordinates...',
    'Aligning planetary positions...',
    'Calculating lunar phase at birth...',
    'Cross-referencing ephemeris tables...',
    'Extracting elemental signatures...',
    'Scanning for harmonic resonance...',
    'Comparing soil frequencies...',
    'Finalizing cosmic blueprint...',
  ];

  useEffect(() => {
    if (step === 'calculating') {
      let currentPhrase = 0;
      const phraseInterval = setInterval(() => {
        setCalculationText(calculationPhrases[currentPhrase % calculationPhrases.length]);
        currentPhrase++;
      }, 400);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            clearInterval(phraseInterval);
            setTimeout(() => setStep('result'), 300);
            return 100;
          }
          return prev + 2;
        });
      }, 60);

      return () => {
        clearInterval(phraseInterval);
        clearInterval(progressInterval);
      };
    }
  }, [step]);

  const handleSubmit = () => {
    if (!birthDate || !birthTime) return;

    const date = new Date(birthDate);
    const [hours] = birthTime.split(':').map(Number);
    
    const sunSign = getZodiacSign(date.getMonth() + 1, date.getDate());
    const moonSign = getMoonSign(date);
    const risingSign = getRisingSign(hours);

    setUserChart({
      sun: { sign: sunSign.sign, symbol: sunSign.symbol, element: sunSign.element },
      moon: { sign: moonSign.sign, symbol: moonSign.symbol, element: moonSign.element },
      rising: { sign: risingSign.sign, symbol: risingSign.symbol, element: risingSign.element },
    });

    setProgress(0);
    setStep('calculating');
  };

  const handleReset = () => {
    setStep('input');
    setBirthDate('');
    setBirthTime('');
    setBirthLocation('');
    setUserChart(null);
    setProgress(0);
  };

  const resonance = userChart 
    ? getResonanceType([userChart.sun.element, userChart.moon.element, userChart.rising.element])
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-full h-full max-h-full m-0 p-0 border-0 rounded-none bg-transparent">
        <DialogTitle className="sr-only">The Star Mapping</DialogTitle>
        
        {/* Deep space background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(240_50%_5%)] via-[hsl(260_40%_8%)] to-[hsl(10_25%_8%)]">
          {/* Stars */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.3 + Math.random() * 0.7,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Faint root structures floating among stars */}
          <svg 
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="rootFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(280 60% 50%)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(10 30% 20%)" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              d="M 500,0 C 520,150 480,300 500,450 C 520,600 450,750 500,900 C 480,1000 520,1100 500,1200"
              fill="none"
              stroke="url(#rootFade)"
              strokeWidth="3"
            />
            <path
              d="M 300,200 C 350,300 400,350 350,450 C 300,550 380,650 330,750"
              fill="none"
              stroke="url(#rootFade)"
              strokeWidth="2"
            />
            <path
              d="M 700,150 C 650,280 720,380 670,480 C 620,580 680,680 650,800"
              fill="none"
              stroke="url(#rootFade)"
              strokeWidth="2"
            />
          </svg>

          {/* Cosmic glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full glass-card flex items-center justify-center text-foreground hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md"
              >
                {/* Title */}
                <div className="text-center mb-10">
                  <motion.div
                    className="inline-block mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Sparkles className="w-12 h-12 text-primary mx-auto" />
                  </motion.div>
                  <h2 className="font-display text-4xl md:text-5xl gradient-root-throne-text mb-3">
                    THE STAR MAPPING
                  </h2>
                  <p className="text-muted-foreground font-body">
                    Enter your birth data to calculate cosmic resonance
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  <div className="glass-card-strong rounded-xl p-6 space-y-5">
                    <div>
                      <label className="block text-foreground font-body text-sm mb-2">
                        Date of Birth
                      </label>
                      <Input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="bg-background/50 border-border/50 text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-foreground font-body text-sm mb-2">
                        Time of Birth <span className="text-muted-foreground">(Essential for Rising Sign)</span>
                      </label>
                      <Input
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="bg-background/50 border-border/50 text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-foreground font-body text-sm mb-2">
                        Location of Birth <span className="text-muted-foreground">(City/Country)</span>
                      </label>
                      <Input
                        type="text"
                        value={birthLocation}
                        onChange={(e) => setBirthLocation(e.target.value)}
                        placeholder="e.g., New York, USA"
                        className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!birthDate || !birthTime}
                    className="w-full py-6 text-lg glass-card-strong border-primary/50 hover:bg-primary/20 text-foreground font-body tracking-wide"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    CALCULATE RESONANCE
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'calculating' && (
              <motion.div
                key="calculating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-lg text-center"
              >
                <div className="mb-8">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-primary/50 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-10 h-10 text-primary" />
                  </motion.div>
                  <h3 className="font-display text-2xl text-foreground mb-2">
                    The Vici Royàl Algorithm
                  </h3>
                  <p className="text-muted-foreground font-body text-sm">
                    Processing celestial data...
                  </p>
                </div>

                <div className="glass-card-strong rounded-xl p-6">
                  <Progress value={progress} className="h-3 mb-4" />
                  
                  <div className="font-mono text-xs text-primary/80 h-6">
                    {calculationText}
                  </div>

                  {/* Scrolling data effect */}
                  <div className="mt-4 h-20 overflow-hidden font-mono text-[10px] text-muted-foreground/40">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: [0, 1, 0], y: [-20, 0, 20] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      >
                        {`0x${Math.random().toString(16).slice(2, 10)} :: ${Math.random().toFixed(8)}`}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'result' && userChart && resonance && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-4xl"
              >
                {/* Resonance Type Header */}
                <motion.div
                  className="text-center mb-10"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-muted-foreground font-body text-sm tracking-[0.3em] uppercase mb-2">
                    Analysis Complete
                  </p>
                  <h2 
                    className="font-display text-4xl md:text-6xl mb-2"
                    style={{ color: resonance.color }}
                  >
                    {resonance.type}
                  </h2>
                  <p className="font-display text-xl text-foreground">
                    {resonance.subtitle}
                  </p>
                </motion.div>

                {/* Charts Comparison */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  {/* User Chart */}
                  <motion.div
                    className="glass-card-strong rounded-2xl p-6"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-display text-xl text-center text-foreground mb-6">
                      Your Chart
                    </h4>
                    <div className="space-y-4">
                      <ChartRow
                        icon={<Sun className="w-5 h-5 text-throne-gold" />}
                        label="Sun"
                        metaphor="The Fruit"
                        sign={userChart.sun.sign}
                        symbol={userChart.sun.symbol}
                        element={userChart.sun.element}
                      />
                      <ChartRow
                        icon={<Moon className="w-5 h-5 text-muted-foreground" />}
                        label="Moon"
                        metaphor="The Root"
                        sign={userChart.moon.sign}
                        symbol={userChart.moon.symbol}
                        element={userChart.moon.element}
                      />
                      <ChartRow
                        icon={<ArrowUp className="w-5 h-5 text-primary" />}
                        label="Rising"
                        metaphor="The Stalk"
                        sign={userChart.rising.sign}
                        symbol={userChart.rising.symbol}
                        element={userChart.rising.element}
                      />
                    </div>
                  </motion.div>

                  {/* Vici's Chart */}
                  <motion.div
                    className="glass-card-strong rounded-2xl p-6 border-primary/30"
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="font-display text-xl text-center gradient-root-throne-text mb-6">
                      Vici Royàl's Chart
                    </h4>
                    <div className="space-y-4">
                      <ChartRow
                        icon={<Sun className="w-5 h-5 text-throne-gold" />}
                        label="Sun"
                        metaphor={VICI_CHART.sun.metaphor}
                        sign={VICI_CHART.sun.sign}
                        symbol={VICI_CHART.sun.symbol}
                        element={VICI_CHART.sun.element}
                      />
                      <ChartRow
                        icon={<Moon className="w-5 h-5 text-muted-foreground" />}
                        label="Moon"
                        metaphor={VICI_CHART.moon.metaphor}
                        sign={VICI_CHART.moon.sign}
                        symbol={VICI_CHART.moon.symbol}
                        element={VICI_CHART.moon.element}
                      />
                      <ChartRow
                        icon={<ArrowUp className="w-5 h-5 text-primary" />}
                        label="Rising"
                        metaphor={VICI_CHART.rising.metaphor}
                        sign={VICI_CHART.rising.sign}
                        symbol={VICI_CHART.rising.symbol}
                        element={VICI_CHART.rising.element}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Description */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-muted-foreground font-body max-w-xl mx-auto">
                    {resonance.description}
                  </p>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {resonance.showCTA && (
                    <Button
                      className="px-8 py-6 text-lg glass-card-strong border-throne-gold/50 hover:bg-throne-gold/20 text-foreground font-body"
                    >
                      <Sparkles className="w-5 h-5 mr-2 text-throne-gold" />
                      JOIN THE 2026 CSA (YOU ARE A MATCH)
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Calculate Again
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ChartRowProps {
  icon: React.ReactNode;
  label: string;
  metaphor: string;
  sign: string;
  symbol: string;
  element: string;
}

const ChartRow = ({ icon, label, metaphor, sign, symbol, element }: ChartRowProps) => {
  const elementColors: Record<string, string> = {
    Fire: 'text-red-400',
    Earth: 'text-amber-600',
    Air: 'text-sky-400',
    Water: 'text-blue-400',
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-background/30">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-foreground font-body font-medium">{label}</span>
          <span className="text-muted-foreground/60 text-xs">({metaphor})</span>
        </div>
      </div>
      <div className="text-right">
        <span className="font-display text-2xl mr-2">{symbol}</span>
        <span className="text-foreground font-body">{sign}</span>
        <span className={`text-xs ml-2 ${elementColors[element]}`}>
          {element}
        </span>
      </div>
    </div>
  );
};

export default StarMappingModal;
