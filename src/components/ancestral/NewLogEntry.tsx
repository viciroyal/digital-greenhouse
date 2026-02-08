import { useState } from 'react';
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
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Moon phase calculation (simplified)
const getMoonPhase = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Simplified moon phase calculation
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

// Format date for display
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const formatDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
};

// Somatic states
const somaticStates = [
  { id: 'grounded', label: 'Grounded', emoji: '🌳', color: 'hsl(140 50% 45%)' },
  { id: 'anxious', label: 'Anxious', emoji: '⚡', color: 'hsl(0 60% 50%)' },
  { id: 'flowing', label: 'Flowing', emoji: '💧', color: 'hsl(200 60% 50%)' },
  { id: 'stiff', label: 'Stiff', emoji: '🪨', color: 'hsl(30 40% 45%)' },
];

// Module types
const moduleTypes = [
  { id: 'shelter', label: 'Shelter', icon: Home, color: 'hsl(0 70% 45%)' },
  { id: 'food', label: 'Food', icon: Utensils, color: 'hsl(30 50% 40%)' },
  { id: 'clothing', label: 'Clothing', icon: Shirt, color: 'hsl(15 100% 50%)' },
  { id: 'nutrition', label: 'Nutrition', icon: Beaker, color: 'hsl(51 100% 50%)' },
  { id: 'seed', label: 'Seed', icon: Sparkles, color: 'hsl(0 0% 85%)' },
];

interface NewLogEntryProps {
  onClose: () => void;
  onSubmit: (entry: {
    moon_phase: string;
    somatic_state: string;
    brix_score?: number;
    soil_temp?: number;
    ph_level?: number;
    reflection: string;
    photo_url?: string;
    module_type: 'shelter' | 'food' | 'clothing' | 'nutrition' | 'seed';
  }) => void;
}

/**
 * NEW LOG ENTRY - The Input Form
 * 
 * Guided entry form for recording field observations.
 */
const NewLogEntry = ({ onClose, onSubmit }: NewLogEntryProps) => {
  const today = new Date();
  
  const [date, setDate] = useState(formatDateForInput(today));
  const [moonPhase, setMoonPhase] = useState(getMoonPhase(today));
  const [somaticState, setSomaticState] = useState<string>('');
  const [moduleType, setModuleType] = useState<string>('');
  const [brixScore, setBrixScore] = useState('');
  const [soilTemp, setSoilTemp] = useState('');
  const [phLevel, setPhLevel] = useState('');
  const [reflection, setReflection] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Update moon phase when date changes
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setMoonPhase(getMoonPhase(new Date(newDate)));
  };

  const handleSubmit = () => {
    if (!somaticState || !moduleType || !reflection.trim()) {
      return; // Basic validation
    }

    onSubmit({
      moon_phase: moonPhase,
      somatic_state: somaticState,
      brix_score: brixScore ? parseFloat(brixScore) : undefined,
      soil_temp: soilTemp ? parseFloat(soilTemp) : undefined,
      ph_level: phLevel ? parseFloat(phLevel) : undefined,
      reflection: reflection.trim(),
      photo_url: photoUrl || undefined,
      module_type: moduleType as 'shelter' | 'food' | 'clothing' | 'nutrition' | 'seed',
    });
  };

  const isValid = somaticState && moduleType && reflection.trim();

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
          background: 'linear-gradient(180deg, hsl(140 20% 8%), hsl(0 0% 6%))',
          border: '1px solid hsl(140 40% 25%)',
          boxShadow: '0 0 60px hsl(140 50% 20% / 0.3)',
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-10 flex items-center justify-between p-4 border-b"
          style={{ 
            background: 'linear-gradient(180deg, hsl(140 20% 10%), hsl(140 15% 8%))',
            borderColor: 'hsl(140 30% 20%)' 
          }}
        >
          <h2
            className="text-xl tracking-wider"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(140 50% 60%)',
            }}
          >
            NEW FIELD ENTRY
          </h2>
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" style={{ color: 'hsl(0 50% 60%)' }} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Date & Moon */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
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

            {/* Moon Phase (Auto-filled) */}
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

          {/* Somatic State */}
          <div>
            <label className="flex items-center gap-2 text-xs font-mono tracking-wider mb-3" style={{ color: 'hsl(280 50% 60%)' }}>
              <Heart className="w-3 h-3" />
              THE SOMATIC CHECK
            </label>
            <div className="grid grid-cols-4 gap-2">
              {somaticStates.map((state) => (
                <button
                  key={state.id}
                  className="p-3 rounded-lg text-center transition-all"
                  style={{
                    background: somaticState === state.id ? `${state.color}25` : 'hsl(0 0% 10%)',
                    border: `2px solid ${somaticState === state.id ? state.color : 'hsl(0 0% 20%)'}`,
                    boxShadow: somaticState === state.id ? `0 0 15px ${state.color}30` : 'none',
                  }}
                  onClick={() => setSomaticState(state.id)}
                >
                  <span className="text-2xl block mb-1">{state.emoji}</span>
                  <span
                    className="text-[10px] font-mono tracking-wider"
                    style={{ color: somaticState === state.id ? state.color : 'hsl(0 0% 60%)' }}
                  >
                    {state.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Module Type */}
          <div>
            <label className="text-xs font-mono tracking-wider mb-3 block" style={{ color: 'hsl(40 50% 60%)' }}>
              CATEGORY
            </label>
            <div className="flex flex-wrap gap-2">
              {moduleTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                    style={{
                      background: moduleType === type.id ? `${type.color}25` : 'hsl(0 0% 10%)',
                      border: `1px solid ${moduleType === type.id ? type.color : 'hsl(0 0% 20%)'}`,
                    }}
                    onClick={() => setModuleType(type.id)}
                  >
                    <Icon className="w-4 h-4" style={{ color: moduleType === type.id ? type.color : 'hsl(0 0% 50%)' }} />
                    <span
                      className="text-xs font-mono"
                      style={{ color: moduleType === type.id ? type.color : 'hsl(0 0% 60%)' }}
                    >
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data Fields (Optional) */}
          <div>
            <label className="flex items-center gap-2 text-xs font-mono tracking-wider mb-3" style={{ color: 'hsl(51 60% 55%)' }}>
              <Beaker className="w-3 h-3" />
              THE DATA (Optional)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono mb-1 block" style={{ color: 'hsl(0 0% 50%)' }}>Brix °</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="12.5"
                  value={brixScore}
                  onChange={(e) => setBrixScore(e.target.value)}
                  className="font-mono text-sm"
                  style={{
                    background: 'hsl(0 0% 10%)',
                    border: '1px solid hsl(0 0% 25%)',
                    color: 'hsl(51 70% 70%)',
                  }}
                />
              </div>
              <div>
                <label className="text-[10px] font-mono mb-1 block" style={{ color: 'hsl(0 0% 50%)' }}>Soil Temp °F</label>
                <Input
                  type="number"
                  placeholder="68"
                  value={soilTemp}
                  onChange={(e) => setSoilTemp(e.target.value)}
                  className="font-mono text-sm"
                  style={{
                    background: 'hsl(0 0% 10%)',
                    border: '1px solid hsl(0 0% 25%)',
                    color: 'hsl(15 70% 65%)',
                  }}
                />
              </div>
              <div>
                <label className="text-[10px] font-mono mb-1 block" style={{ color: 'hsl(0 0% 50%)' }}>pH</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="6.8"
                  value={phLevel}
                  onChange={(e) => setPhLevel(e.target.value)}
                  className="font-mono text-sm"
                  style={{
                    background: 'hsl(0 0% 10%)',
                    border: '1px solid hsl(0 0% 25%)',
                    color: 'hsl(140 60% 55%)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Reflection */}
          <div>
            <label className="text-xs font-mono tracking-wider mb-2 block" style={{ color: 'hsl(40 50% 60%)' }}>
              THE REFLECTION
            </label>
            <p className="text-[10px] font-mono italic mb-2" style={{ color: 'hsl(40 30% 50%)' }}>
              "What did the soil whisper today?"
            </p>
            <Textarea
              placeholder="The morning dew held the scent of spring. I noticed..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
              className="font-mono text-sm resize-none"
              style={{
                background: 'hsl(0 0% 10%)',
                border: '1px solid hsl(40 30% 25%)',
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
              className="p-8 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all hover:border-solid"
              style={{
                background: 'hsl(0 0% 8%)',
                borderColor: 'hsl(0 0% 25%)',
              }}
            >
              <Camera className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: 'hsl(0 0% 50%)' }} />
              <p className="text-xs font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                Tap to add a photo
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
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
                ? 'linear-gradient(135deg, hsl(140 50% 35%), hsl(140 40% 25%))'
                : 'hsl(0 0% 20%)',
              color: isValid ? 'hsl(0 0% 95%)' : 'hsl(0 0% 50%)',
              border: 'none',
              boxShadow: isValid ? '0 0 20px hsl(140 60% 30% / 0.4)' : 'none',
            }}
            disabled={!isValid}
            onClick={handleSubmit}
          >
            <Send className="w-4 h-4 mr-2" />
            LOG ENTRY
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewLogEntry;
