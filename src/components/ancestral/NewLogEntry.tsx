import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Moon, 
  Heart, 
  Beaker, 
  Camera,
  Home,
  Utensils,
  Shirt,
  Sparkles,
  Send,
  Flame,
  Droplet,
  Mountain,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

// Moon phase calculation (simplified)
const getMoonPhase = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month);
  const jd = c + e + day - 694039.09;
  const phase = jd / 29.5305882;
  const phaseIndex = Math.floor((phase - Math.floor(phase)) * 8);
  
  const phases = [
    'New Moon',
    'Waxing Crescent',
    'First Quarter',
    'Waxing Gibbous',
    'Full Moon',
    'Waning Gibbous',
    'Last Quarter',
    'Waning Crescent'
  ];
  
  return phases[phaseIndex] || 'Waxing Crescent';
};

const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * ZONE-SPECIFIC CONFIGURATION
 * 
 * Each zone has unique somatic states, science data fields, and reflection prompts.
 * This creates context-aware journaling based on the Almanac chapter.
 */
const zoneConfig = {
  root: {
    id: 'root',
    number: 1,
    label: 'ROOT / MUSCOGEE',
    subtitle: 'Structure & Foundation',
    icon: Mountain,
    color: 'hsl(0 70% 45%)',
    somaticQuestion: 'How was your stance?',
    somaticStates: [
      { id: 'iron', label: 'Iron', emoji: '⚙️', description: 'Strong, grounded, unmovable' },
      { id: 'grounded', label: 'Grounded', emoji: '🌳', description: 'Stable, connected to earth' },
      { id: 'bent', label: 'Bent', emoji: '🌿', description: 'Flexible but strained' },
      { id: 'strained', label: 'Strained', emoji: '😣', description: 'Tension, resistance' },
    ],
    scienceLabel: 'SOIL COMPACTION RATING',
    scienceUnit: '(1-10)',
    scienceType: 'slider' as const,
    scienceMin: 1,
    scienceMax: 10,
    reflectionPrompt: 'Did the Earth accept the tool, or resist it?',
    reflectionPlaceholder: 'The broadfork sank easily into the first six inches, but I felt resistance at the hardpan. The soil cracked like old bread...',
  },
  flow: {
    id: 'flow',
    number: 2,
    label: 'FLOW / OLMEC',
    subtitle: 'Hydration & Minerals',
    icon: Droplet,
    color: 'hsl(30 50% 40%)',
    somaticQuestion: 'Hydration Level?',
    somaticStates: [
      { id: 'fluid', label: 'Fluid', emoji: '💧', description: 'Flowing, well-hydrated' },
      { id: 'balanced', label: 'Balanced', emoji: '⚖️', description: 'Neither wet nor dry' },
      { id: 'parched', label: 'Parched', emoji: '🏜️', description: 'Thirsty, needing water' },
      { id: 'dry', label: 'Dry', emoji: '🍂', description: 'Dehydrated, cracked' },
    ],
    scienceLabel: 'MOISTURE RETENTION',
    scienceUnit: '(%)',
    scienceType: 'number' as const,
    scienceMin: 0,
    scienceMax: 100,
    reflectionPrompt: 'How is the magnetism? Did the water settle or run off?',
    reflectionPlaceholder: 'The water pooled on the surface for a moment before slowly being absorbed. The rock dust application seems to be improving the soil structure...',
  },
  fire: {
    id: 'fire',
    number: 3,
    label: 'FIRE / VEDIC',
    subtitle: 'Atmosphere & Signal',
    icon: Flame,
    color: 'hsl(15 100% 50%)',
    somaticQuestion: 'Breath Quality?',
    somaticStates: [
      { id: 'bellows', label: 'Bellows', emoji: '🔥', description: 'Deep, powerful, stoking fire' },
      { id: 'deep', label: 'Deep', emoji: '🌬️', description: 'Full, nourishing breaths' },
      { id: 'shallow', label: 'Shallow', emoji: '😮‍💨', description: 'Quick, surface-level' },
      { id: 'restricted', label: 'Restricted', emoji: '😰', description: 'Tight, unable to expand' },
    ],
    scienceLabel: 'ATMOSPHERIC CLARITY',
    scienceUnit: '(Pest Pressure 1-10)',
    scienceType: 'slider' as const,
    scienceMin: 1,
    scienceMax: 10,
    reflectionPrompt: 'Is the metabolic fire clean or smoky?',
    reflectionPlaceholder: 'The Agnihotra smoke rose straight up into the air without wavering. I noticed fewer aphids on the tomato leaves this morning...',
  },
  gold: {
    id: 'gold',
    number: 4,
    label: 'GOLD / KEMIT',
    subtitle: 'Nutrition & Alchemy',
    icon: Crown,
    color: 'hsl(51 100% 50%)',
    somaticQuestion: 'Taste Sensitivity?',
    somaticStates: [
      { id: 'sweet', label: 'Sweet', emoji: '🍯', description: 'Rich, complex, satisfying' },
      { id: 'balanced', label: 'Balanced', emoji: '✨', description: 'Harmonious flavors' },
      { id: 'bland', label: 'Bland', emoji: '😐', description: 'Lacking depth' },
      { id: 'bitter', label: 'Bitter', emoji: '🍋', description: 'Sharp, astringent' },
    ],
    scienceLabel: 'BRIX SCORE',
    scienceUnit: '(° Refractometer)',
    scienceType: 'number' as const,
    scienceMin: 0,
    scienceMax: 32,
    reflectionPrompt: 'What did the leaf taste like? Describe the Gold.',
    reflectionPlaceholder: 'The kale leaf had an unexpectedly sweet finish, almost nutty. The refractometer showed 14 Brix — we are above the pest resistance threshold...',
  },
  seed: {
    id: 'seed',
    number: 5,
    label: 'SEED / MAROON',
    subtitle: 'Sovereignty & Legacy',
    icon: Sparkles,
    color: 'hsl(280 60% 65%)',
    somaticQuestion: 'Ancestral Connection?',
    somaticStates: [
      { id: 'sovereign', label: 'Sovereign', emoji: '👑', description: 'Complete, self-reliant' },
      { id: 'connected', label: 'Connected', emoji: '🔗', description: 'Linked to lineage' },
      { id: 'seeking', label: 'Seeking', emoji: '🔍', description: 'Searching for roots' },
      { id: 'untethered', label: 'Untethered', emoji: '🍃', description: 'Disconnected, adrift' },
    ],
    scienceLabel: 'SEED VIABILITY',
    scienceUnit: '(% Germination)',
    scienceType: 'number' as const,
    scienceMin: 0,
    scienceMax: 100,
    reflectionPrompt: 'What will you leave for the seventh generation?',
    reflectionPlaceholder: 'I saved the seeds from the most vigorous tomato plant today. These are now the third generation adapted to this specific plot of earth...',
  },
};

type ZoneKey = keyof typeof zoneConfig;

interface NewLogEntryProps {
  onClose: () => void;
  onSubmit: (entry: {
    zone: ZoneKey;
    moon_phase: string;
    somatic_state: string;
    science_value?: number;
    reflection: string;
    photo_url?: string;
  }) => void;
}

/**
 * NEW LOG ENTRY - The Smart Entry Form
 * 
 * Context-aware journaling with zone-specific prompts.
 */
const NewLogEntry = ({ onClose, onSubmit }: NewLogEntryProps) => {
  const today = new Date();
  
  const [date, setDate] = useState(formatDateForInput(today));
  const [moonPhase, setMoonPhase] = useState(getMoonPhase(today));
  const [selectedZone, setSelectedZone] = useState<ZoneKey | null>(null);
  const [somaticState, setSomaticState] = useState<string>('');
  const [scienceValue, setScienceValue] = useState<number | ''>('');
  const [sliderValue, setSliderValue] = useState<number[]>([5]);
  const [reflection, setReflection] = useState('');

  // Get current zone config
  const currentZone = selectedZone ? zoneConfig[selectedZone] : null;

  // Update moon phase when date changes
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setMoonPhase(getMoonPhase(new Date(newDate)));
  };

  // Reset fields when zone changes
  const handleZoneChange = (zone: ZoneKey) => {
    setSelectedZone(zone);
    setSomaticState('');
    setScienceValue('');
    setSliderValue([5]);
    setReflection('');
  };

  const handleSubmit = () => {
    if (!selectedZone || !somaticState || !reflection.trim()) {
      return;
    }

    const finalScienceValue = currentZone?.scienceType === 'slider' 
      ? sliderValue[0] 
      : (typeof scienceValue === 'number' ? scienceValue : undefined);

    onSubmit({
      zone: selectedZone,
      moon_phase: moonPhase,
      somatic_state: somaticState,
      science_value: finalScienceValue,
      reflection: reflection.trim(),
    });
  };

  const isValid = selectedZone && somaticState && reflection.trim();

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: currentZone 
            ? `linear-gradient(180deg, ${currentZone.color}15, hsl(0 0% 6%))`
            : 'linear-gradient(180deg, hsl(140 20% 8%), hsl(0 0% 6%))',
          border: `1px solid ${currentZone?.color || 'hsl(140 40% 25%)'}50`,
          boxShadow: `0 0 60px ${currentZone?.color || 'hsl(140 50% 20%)'}30`,
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-10 flex items-center justify-between p-4 border-b"
          style={{ 
            background: currentZone 
              ? `linear-gradient(180deg, ${currentZone.color}20, ${currentZone.color}10)`
              : 'linear-gradient(180deg, hsl(140 20% 10%), hsl(140 15% 8%))',
            borderColor: `${currentZone?.color || 'hsl(140 30% 20%)'}40`,
          }}
        >
          <div>
            <h2
              className="text-xl tracking-wider"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: currentZone?.color || 'hsl(140 50% 60%)',
              }}
            >
              {currentZone ? `ZONE ${currentZone.number}: ${currentZone.label}` : 'SELECT FOCUS ZONE'}
            </h2>
            {currentZone && (
              <p className="text-xs font-mono" style={{ color: 'hsl(40 40% 55%)' }}>
                {currentZone.subtitle}
              </p>
            )}
          </div>
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" style={{ color: 'hsl(0 50% 60%)' }} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Zone Selection */}
          {!selectedZone ? (
            <div className="space-y-3">
              <p className="text-xs font-mono text-center mb-4" style={{ color: 'hsl(40 40% 55%)' }}>
                Which chapter of the Almanac are you practicing today?
              </p>
              {Object.entries(zoneConfig).map(([key, zone]) => {
                const Icon = zone.icon;
                return (
                  <motion.button
                    key={key}
                    className="w-full p-4 rounded-xl text-left transition-all"
                    style={{
                      background: `${zone.color}10`,
                      border: `1px solid ${zone.color}40`,
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      borderColor: zone.color,
                      boxShadow: `0 0 20px ${zone.color}30`,
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleZoneChange(key as ZoneKey)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: `${zone.color}25`,
                          border: `2px solid ${zone.color}`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: zone.color }} />
                      </div>
                      <div>
                        <p
                          className="font-mono text-sm tracking-wider"
                          style={{ color: zone.color }}
                        >
                          ZONE {zone.number}: {zone.label}
                        </p>
                        <p className="text-xs" style={{ color: 'hsl(40 40% 55%)' }}>
                          {zone.subtitle}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <>
              {/* Date & Moon */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-mono tracking-wider mb-2" style={{ color: 'hsl(40 50% 60%)' }}>
                    <Calendar className="w-3 h-3" />
                    DATE
                  </label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="font-mono text-sm"
                    style={{
                      background: 'hsl(0 0% 10%)',
                      border: '1px solid hsl(0 0% 25%)',
                      color: 'hsl(40 60% 80%)',
                    }}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-mono tracking-wider mb-2" style={{ color: 'hsl(200 50% 60%)' }}>
                    <Moon className="w-3 h-3" />
                    MOON PHASE
                  </label>
                  <div
                    className="px-3 py-2 rounded-md font-mono text-sm"
                    style={{
                      background: 'hsl(200 30% 12%)',
                      border: '1px solid hsl(200 40% 30%)',
                      color: 'hsl(200 60% 70%)',
                    }}
                  >
                    {moonPhase}
                  </div>
                </div>
              </div>

              {/* Somatic Check - Zone Specific */}
              <div>
                <label className="flex items-center gap-2 text-xs font-mono tracking-wider mb-2" style={{ color: currentZone.color }}>
                  <Heart className="w-3 h-3" />
                  {currentZone.somaticQuestion.toUpperCase()}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {currentZone.somaticStates.map((state) => (
                    <button
                      key={state.id}
                      className="p-3 rounded-lg text-left transition-all"
                      style={{
                        background: somaticState === state.id ? `${currentZone.color}25` : 'hsl(0 0% 10%)',
                        border: `2px solid ${somaticState === state.id ? currentZone.color : 'hsl(0 0% 20%)'}`,
                        boxShadow: somaticState === state.id ? `0 0 15px ${currentZone.color}30` : 'none',
                      }}
                      onClick={() => setSomaticState(state.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{state.emoji}</span>
                        <div>
                          <span
                            className="block text-xs font-mono tracking-wider"
                            style={{ color: somaticState === state.id ? currentZone.color : 'hsl(0 0% 70%)' }}
                          >
                            {state.label}
                          </span>
                          <span className="text-[10px]" style={{ color: 'hsl(0 0% 50%)' }}>
                            {state.description}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Science Data - Zone Specific */}
              <div>
                <label className="flex items-center gap-2 text-xs font-mono tracking-wider mb-2" style={{ color: 'hsl(51 60% 55%)' }}>
                  <Beaker className="w-3 h-3" />
                  {currentZone.scienceLabel} {currentZone.scienceUnit}
                </label>
                
                {currentZone.scienceType === 'slider' ? (
                  <div className="space-y-3">
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      min={currentZone.scienceMin}
                      max={currentZone.scienceMax}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                      <span>{currentZone.scienceMin} (Low)</span>
                      <span 
                        className="text-lg font-bold"
                        style={{ color: currentZone.color }}
                      >
                        {sliderValue[0]}
                      </span>
                      <span>{currentZone.scienceMax} (High)</span>
                    </div>
                  </div>
                ) : (
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Enter value..."
                    value={scienceValue}
                    onChange={(e) => setScienceValue(e.target.value ? parseFloat(e.target.value) : '')}
                    className="font-mono text-sm"
                    style={{
                      background: 'hsl(0 0% 10%)',
                      border: '1px solid hsl(0 0% 25%)',
                      color: 'hsl(51 70% 70%)',
                    }}
                  />
                )}
              </div>

              {/* Reflection - Zone Specific Prompt */}
              <div>
                <label className="text-xs font-mono tracking-wider mb-1 block" style={{ color: 'hsl(40 50% 60%)' }}>
                  THE REFLECTION
                </label>
                <p className="text-sm font-mono italic mb-3" style={{ color: currentZone.color }}>
                  "{currentZone.reflectionPrompt}"
                </p>
                <Textarea
                  placeholder={currentZone.reflectionPlaceholder}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  rows={5}
                  className="font-mono text-sm resize-none"
                  style={{
                    background: 'hsl(0 0% 10%)',
                    border: `1px solid ${currentZone.color}30`,
                    color: 'hsl(40 50% 80%)',
                  }}
                />
              </div>

              {/* Photo Upload Placeholder */}
              <div>
                <label className="flex items-center gap-2 text-xs font-mono tracking-wider mb-2" style={{ color: 'hsl(0 0% 50%)' }}>
                  <Camera className="w-3 h-3" />
                  THE PROOF (Optional)
                </label>
                <div
                  className="p-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all hover:border-solid"
                  style={{
                    background: 'hsl(0 0% 8%)',
                    borderColor: `${currentZone.color}40`,
                  }}
                >
                  <Camera className="w-8 h-8 mx-auto mb-2" style={{ color: `${currentZone.color}50` }} />
                  <p className="text-xs font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                    Tap to add field evidence
                  </p>
                </div>
              </div>

              {/* Change Zone Button */}
              <button
                className="w-full py-2 text-xs font-mono tracking-wider rounded-lg transition-all hover:bg-white/5"
                style={{
                  border: '1px dashed hsl(0 0% 25%)',
                  color: 'hsl(0 0% 50%)',
                }}
                onClick={() => setSelectedZone(null)}
              >
                ← Change Focus Zone
              </button>
            </>
          )}
        </div>

        {/* Submit */}
        {selectedZone && (
          <div 
            className="sticky bottom-0 p-4 border-t"
            style={{ 
              background: 'hsl(0 0% 6%)',
              borderColor: 'hsl(0 0% 15%)' 
            }}
          >
            <Button
              className="w-full font-mono text-sm tracking-wider"
              style={{
                background: isValid 
                  ? `linear-gradient(135deg, ${currentZone?.color}, ${currentZone?.color}cc)`
                  : 'hsl(0 0% 20%)',
                color: isValid ? 'hsl(0 0% 5%)' : 'hsl(0 0% 50%)',
                border: 'none',
                boxShadow: isValid ? `0 0 20px ${currentZone?.color}40` : 'none',
              }}
              disabled={!isValid}
              onClick={handleSubmit}
            >
              <Send className="w-4 h-4 mr-2" />
              LOG OBSERVATION
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default NewLogEntry;
