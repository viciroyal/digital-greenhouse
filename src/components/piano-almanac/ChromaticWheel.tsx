import { motion } from 'framer-motion';
import { GardenBed } from '@/hooks/useGardenBeds';
import { Loader2 } from 'lucide-react';
import { CHROMATIC_TONES, ChromaticTone, frequencyToTone } from '@/data/chromaticToneMapping';

/**
 * 12-TONE CHROMATIC WHEEL
 * Circular dial with 12 segments representing musical notes
 * Shows bed distribution across tones with radial Brix slider
 */

interface ChromaticWheelProps {
  beds: GardenBed[];
  selectedTone: ChromaticTone | null;
  onSelectTone: (tone: ChromaticTone) => void;
  brixValue: number;
  onBrixChange: (value: number) => void;
  isLoading?: boolean;
}

const ChromaticWheel = ({
  beds,
  selectedTone,
  onSelectTone,
  brixValue,
  onBrixChange,
  isLoading,
}: ChromaticWheelProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  // Calculate bed counts per tone
  const bedCountsByTone = CHROMATIC_TONES.reduce((acc, tone) => {
    acc[tone.note] = beds.filter(bed => {
      const bedTone = frequencyToTone(bed.frequency_hz);
      return bedTone.note === tone.note;
    }).length;
    return acc;
  }, {} as Record<string, number>);

  // Get beds for selected tone
  const selectedToneBeds = selectedTone
    ? beds.filter(bed => frequencyToTone(bed.frequency_hz).note === selectedTone.note)
    : [];

  const segmentAngle = 360 / 12;
  const wheelRadius = 140;
  const innerRadius = 50;
  const brixRadius = wheelRadius + 20;

  return (
    <div className="relative flex flex-col items-center">
      {/* Radial Brix Slider */}
      <div className="relative w-full max-w-[360px] aspect-square mx-auto">
        {/* Brix Track Ring */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 360">
          {/* Outer Brix ring background */}
          <circle
            cx="180"
            cy="180"
            r={brixRadius}
            fill="none"
            stroke="hsl(220 15% 20%)"
            strokeWidth="16"
            strokeOpacity="0.5"
          />
          
          {/* Brix value arc */}
          <circle
            cx="180"
            cy="180"
            r={brixRadius}
            fill="none"
            stroke={`hsl(${((brixValue - 12) / 12) * 120} 70% 50%)`}
            strokeWidth="16"
            strokeDasharray={`${((brixValue - 12) / 12) * 2 * Math.PI * brixRadius} ${2 * Math.PI * brixRadius}`}
            strokeLinecap="round"
            transform="rotate(-90 180 180)"
            style={{ transition: 'stroke-dasharray 0.3s ease' }}
          />
          
          {/* Brix tick marks */}
          {[12, 15, 18, 21, 24].map((tick) => {
            const tickAngle = ((tick - 12) / 12) * 360 - 90;
            const tickRad = (tickAngle * Math.PI) / 180;
            const x1 = 180 + (brixRadius - 12) * Math.cos(tickRad);
            const y1 = 180 + (brixRadius - 12) * Math.sin(tickRad);
            const x2 = 180 + (brixRadius + 12) * Math.cos(tickRad);
            const y2 = 180 + (brixRadius + 12) * Math.sin(tickRad);
            return (
              <g key={tick}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(220 10% 40%)"
                  strokeWidth="2"
                />
                <text
                  x={180 + (brixRadius + 22) * Math.cos(tickRad)}
                  y={180 + (brixRadius + 22) * Math.sin(tickRad)}
                  fill="hsl(220 10% 60%)"
                  fontSize="10"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {tick}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Chromatic Wheel */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 360">
          {CHROMATIC_TONES.map((tone, idx) => {
            const startAngle = idx * segmentAngle - 90;
            const endAngle = startAngle + segmentAngle;
            const isSelected = selectedTone?.note === tone.note;
            const bedCount = bedCountsByTone[tone.note] || 0;

            // Calculate segment path
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 180 + wheelRadius * Math.cos(startRad);
            const y1 = 180 + wheelRadius * Math.sin(startRad);
            const x2 = 180 + wheelRadius * Math.cos(endRad);
            const y2 = 180 + wheelRadius * Math.sin(endRad);
            const x3 = 180 + innerRadius * Math.cos(endRad);
            const y3 = 180 + innerRadius * Math.sin(endRad);
            const x4 = 180 + innerRadius * Math.cos(startRad);
            const y4 = 180 + innerRadius * Math.sin(startRad);

            // Label position
            const labelAngle = startAngle + segmentAngle / 2;
            const labelRad = (labelAngle * Math.PI) / 180;
            const labelRadius = (wheelRadius + innerRadius) / 2;
            const labelX = 180 + labelRadius * Math.cos(labelRad);
            const labelY = 180 + labelRadius * Math.sin(labelRad);

            // Bed count position (closer to outer edge)
            const countRadius = wheelRadius - 20;
            const countX = 180 + countRadius * Math.cos(labelRad);
            const countY = 180 + countRadius * Math.sin(labelRad);

            return (
              <g key={tone.note}>
                <motion.path
                  d={`M ${x1} ${y1} A ${wheelRadius} ${wheelRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`}
                  fill={tone.color}
                  fillOpacity={isSelected ? 0.9 : 0.6}
                  stroke={isSelected ? 'white' : 'hsl(220 10% 20%)'}
                  strokeWidth={isSelected ? 3 : 1}
                  style={{ cursor: 'pointer' }}
                  whileHover={{ fillOpacity: 0.85 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectTone(tone)}
                />
                
                {/* Note Label */}
                <text
                  x={labelX}
                  y={labelY}
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  {tone.note}
                </text>

                {/* Bed Count */}
                {bedCount > 0 && (
                  <text
                    x={countX}
                    y={countY}
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {bedCount}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Center Hub */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-24 h-24 rounded-full flex flex-col items-center justify-center"
            style={{
              background: selectedTone
                ? `radial-gradient(circle, ${selectedTone.color}, hsl(220 20% 10%))`
                : 'radial-gradient(circle, hsl(220 30% 20%), hsl(220 20% 10%))',
              boxShadow: '0 0 30px hsl(220 50% 20% / 0.5)',
            }}
            animate={{ scale: selectedTone ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTone ? (
              <>
                <span className="text-2xl font-bold text-white">{selectedTone.note}</span>
                <span className="text-[10px] text-white/70">{selectedTone.frequencyHz}Hz</span>
              </>
            ) : (
              <>
                <span className="text-xl font-bold text-white">44</span>
                <span className="text-[10px] text-white/70 uppercase tracking-wider">Beds</span>
              </>
            )}
          </motion.div>
        </div>

        {/* Brix Slider Thumb (draggable) */}
        <input
          type="range"
          min={12}
          max={24}
          value={brixValue}
          onChange={(e) => onBrixChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ cursor: 'grab' }}
        />
      </div>

      {/* Brix Display */}
      <div className="mt-4 text-center">
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${selectedTone?.color || 'hsl(220 30% 20%)'}, hsl(220 20% 15%))`,
            border: '1px solid hsl(220 20% 30%)',
          }}
        >
          <span className="text-xs text-white/70 uppercase tracking-wider">Brix Volume</span>
          <span 
            className="text-lg font-bold"
            style={{ color: `hsl(${((brixValue - 12) / 12) * 120} 70% 60%)` }}
          >
            {brixValue}°
          </span>
        </div>
      </div>

      {/* Selected Tone Beds */}
      {selectedTone && selectedToneBeds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl"
          style={{
            background: 'hsl(220 20% 12%)',
            border: `1px solid ${selectedTone.color}40`,
          }}
        >
          <div className="text-xs text-white/60 uppercase tracking-wider mb-2">
            Beds Playing <span style={{ color: selectedTone.color }}>{selectedTone.note}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedToneBeds.map((bed) => (
              <span
                key={bed.id}
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: `${selectedTone.color}30`,
                  color: selectedTone.color,
                  border: `1px solid ${selectedTone.color}50`,
                }}
              >
                #{bed.bed_number}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChromaticWheel;
