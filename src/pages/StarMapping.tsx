import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
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

const StarMapping = () => {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [birthTime, setBirthTime] = useState('');
  const [birthLocation, setBirthLocation] = useState('');

  const isFormComplete = fullName.trim() !== '' && 
                         birthDate !== undefined && 
                         birthTime !== '' && 
                         birthLocation !== '';

  const handleCalculate = () => {
    if (isFormComplete) {
      console.log('Calculating resonance...', { fullName, birthDate, birthTime, birthLocation });
      // Future: Navigate to results or show modal
    }
  };

  return (
    <div 
      className="min-h-screen w-full overflow-y-auto scrollbar-hide"
      style={{ backgroundColor: '#f4f1ea' }}
    >
      {/* Subtle texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" style={{ color: '#5D4037' }} />
            <span 
              className="text-xs tracking-[0.3em] uppercase font-medium"
              style={{ color: '#8D6E63' }}
            >
              AgroMajic
            </span>
            <Sparkles className="w-5 h-5" style={{ color: '#5D4037' }} />
          </div>
          <h1 
            className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
            style={{ color: '#3E2723' }}
          >
            Star Mapping
          </h1>
          <p 
            className="text-sm md:text-base max-w-xs mx-auto"
            style={{ color: '#6D4C41' }}
          >
            Initialize your cosmic coordinates for resonance calculation
          </p>
        </div>

        {/* Form Card */}
        <div 
          className="w-full max-w-md rounded-2xl p-6 md:p-8 shadow-lg"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(93, 64, 55, 0.15)'
          }}
        >
          <div className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label 
                className="text-sm font-medium flex items-center gap-2"
                style={{ color: '#5D4037' }}
              >
                <User className="w-4 h-4" />
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 rounded-xl border-2 bg-white/80 placeholder:text-stone-400 transition-all duration-200"
                style={{ 
                  borderColor: '#D7CCC8',
                  color: '#3E2723'
                }}
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label 
                className="text-sm font-medium flex items-center gap-2"
                style={{ color: '#5D4037' }}
              >
                <CalendarIcon className="w-4 h-4" />
                Date of Birth
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal rounded-xl border-2 bg-white/80 transition-all duration-200",
                      !birthDate && "text-stone-400"
                    )}
                    style={{ 
                      borderColor: '#D7CCC8',
                      color: birthDate ? '#3E2723' : undefined
                    }}
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time of Birth */}
            <div className="space-y-2">
              <label 
                className="text-sm font-medium flex items-center gap-2"
                style={{ color: '#5D4037' }}
              >
                <Clock className="w-4 h-4" />
                Time of Birth
              </label>
              <Input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="h-12 rounded-xl border-2 bg-white/80 transition-all duration-200"
                style={{ 
                  borderColor: '#D7CCC8',
                  color: '#3E2723'
                }}
              />
            </div>

            {/* Location of Birth */}
            <div className="space-y-2">
              <label 
                className="text-sm font-medium flex items-center gap-2"
                style={{ color: '#5D4037' }}
              >
                <MapPin className="w-4 h-4" />
                Location of Birth (US State)
              </label>
              <Select value={birthLocation} onValueChange={setBirthLocation}>
                <SelectTrigger 
                  className="h-12 rounded-xl border-2 bg-white/80 transition-all duration-200"
                  style={{ 
                    borderColor: '#D7CCC8',
                    color: birthLocation ? '#3E2723' : '#a8a29e'
                  }}
                >
                  <SelectValue placeholder="Select your birth state" />
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

          {/* Calculate Button */}
          <div className="mt-8">
            <button
              onClick={handleCalculate}
              disabled={!isFormComplete}
              className={cn(
                "w-full h-14 rounded-xl font-bold text-lg tracking-wide",
                "flex items-center justify-center gap-2",
                "transition-all duration-500 ease-out",
                "transform",
                isFormComplete 
                  ? "scale-100 cursor-pointer" 
                  : "scale-[0.98] cursor-not-allowed"
              )}
              style={{
                backgroundColor: isFormComplete ? '#FFD700' : '#BCAAA4',
                color: isFormComplete ? '#3E2723' : '#8D6E63',
                opacity: isFormComplete ? 1 : 0.6,
                boxShadow: isFormComplete 
                  ? '0 0 30px rgba(255, 215, 0, 0.5), 0 4px 20px rgba(255, 215, 0, 0.3)' 
                  : 'none',
              }}
            >
              <Sparkles 
                className={cn(
                  "w-5 h-5 transition-all duration-500",
                  isFormComplete && "animate-pulse"
                )} 
              />
              CALCULATE RESONANCE
            </button>

            {/* Status indicator */}
            <p 
              className="text-center text-xs mt-3 transition-opacity duration-300"
              style={{ 
                color: '#8D6E63',
                opacity: isFormComplete ? 0 : 0.8
              }}
            >
              Complete all fields to activate resonance calculation
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p 
          className="text-xs text-center mt-8 max-w-xs"
          style={{ color: '#A1887F' }}
        >
          Your birth data is used to map your cosmic coordinates against the AgroMajic frequency grid.
        </p>
      </div>

      {/* Custom scrollbar hide styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(35%) sepia(20%) saturate(500%) hue-rotate(340deg);
        }
        
        input:focus, button:focus {
          outline: none;
          border-color: #8D6E63 !important;
          box-shadow: 0 0 0 3px rgba(141, 110, 99, 0.2);
        }
      `}</style>
    </div>
  );
};

export default StarMapping;
