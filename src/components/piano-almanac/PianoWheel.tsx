import { motion } from 'framer-motion';
import { GardenBed, BedPlanting, ChordInterval, CHORD_INTERVALS } from '@/hooks/useGardenBeds';
import { Loader2 } from 'lucide-react';

/**
 * PIANO WHEEL UI
 * 7-segment circular wheel with beds as keys
 * White keys = Root (Lead)
 * Black keys = Extensions (3rd, 5th, 7th)
 * 3-Light Status: Blue (Maintenance), Green (Tuned), Gold (Harvest Ready)
 */

interface PianoWheelProps {
  beds: GardenBed[];
  selectedBedId: string | null;
  onSelectBed: (bed: GardenBed) => void;
  bedPlantingsMap: Record<string, BedPlanting[]>;
  isLoading?: boolean;
  simpleMode?: boolean;
}

// Frequency zone data with artistic names
const FREQUENCY_ZONES = [
  { hz: 396, name: 'Root', artisticName: 'The Foundation', color: '#FF0000', angle: 0 },
  { hz: 417, name: 'Flow', artisticName: 'The River', color: '#FF7F00', angle: 51.4 },
  { hz: 528, name: 'Solar', artisticName: 'The Sun', color: '#FFFF00', angle: 102.8 },
  { hz: 639, name: 'Heart', artisticName: 'The Heartbeat', color: '#00FF00', angle: 154.2 },
  { hz: 741, name: 'Voice', artisticName: 'The Song', color: '#0000FF', angle: 205.7 },
  { hz: 852, name: 'Vision', artisticName: 'The Third Eye', color: '#4B0082', angle: 257.1 },
  { hz: 963, name: 'Shield', artisticName: 'The Crown', color: '#8B00FF', angle: 308.5 },
];

// Get 3-light status for a bed
const getBedStatus = (bed: GardenBed, plantings: BedPlanting[]): 'blue' | 'green' | 'gold' => {
  // Gold = Harvest Ready (Brix >= 18)
  if (bed.internal_brix && bed.internal_brix >= 18) return 'gold';
  
  // Green = Tuned (Complete chord)
  const isComplete = CHORD_INTERVALS.every(interval => 
    plantings.some(p => p.crop?.chord_interval === interval)
  );
  if (isComplete) return 'green';
  
  // Blue = Maintenance needed
  return 'blue';
};

// Determine if bed should be white key (Root) or black key (Extension)
const isWhiteKey = (plantings: BedPlanting[]): boolean => {
  return plantings.some(p => p.crop?.chord_interval === 'Root (Lead)');
};

const STATUS_COLORS = {
  blue: { bg: '#3B82F6', glow: '#60A5FA', label: 'Maintenance' },
  green: { bg: '#22C55E', glow: '#4ADE80', label: 'Tuned' },
  gold: { bg: '#F59E0B', glow: '#FBBF24', label: 'Harvest Ready' },
};

const PianoWheel = ({ 
  beds, 
  selectedBedId, 
  onSelectBed, 
  bedPlantingsMap, 
  isLoading,
  simpleMode = true 
}: PianoWheelProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Status Legend */}
      <div className="flex justify-center gap-4 mb-4">
        {Object.entries(STATUS_COLORS).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: value.bg, boxShadow: `0 0 8px ${value.glow}` }}
            />
            <span className="text-xs font-medium text-gray-600">{value.label}</span>
          </div>
        ))}
      </div>

      {/* Circular Piano Wheel */}
      <div className="relative w-full max-w-sm mx-auto aspect-square">
        {/* Center Hub */}
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center z-10 shadow-2xl">
          <div className="text-center">
            <span className="text-2xl font-bold text-white">44</span>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Beds</p>
          </div>
        </div>

        {/* Zone Segments */}
        {FREQUENCY_ZONES.map((zone, zoneIdx) => {
          const zoneBeds = beds.filter(b => b.frequency_hz === zone.hz);
          const segmentAngle = 360 / 7;
          const startAngle = zone.angle - segmentAngle / 2;
          
          return (
            <div key={zone.hz} className="absolute inset-0">
              {/* Zone Arc Background */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                <path
                  d={describeArc(100, 100, 85, startAngle, startAngle + segmentAngle)}
                  fill={`${zone.color}15`}
                  stroke={zone.color}
                  strokeWidth="2"
                  strokeOpacity="0.3"
                />
              </svg>

              {/* Zone Label */}
              <div
                className="absolute text-[10px] font-bold uppercase tracking-wider"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `
                    translate(-50%, -50%) 
                    rotate(${zone.angle}deg) 
                    translateY(-42%) 
                    rotate(-${zone.angle}deg)
                  `,
                  color: zone.color,
                }}
              >
                {simpleMode ? zone.artisticName : `${zone.hz}Hz`}
              </div>

              {/* Bed Keys */}
              {zoneBeds.map((bed, bedIdx) => {
                const plantings = bedPlantingsMap[bed.id] || [];
                const status = getBedStatus(bed, plantings);
                const isWhite = isWhiteKey(plantings);
                const isSelected = selectedBedId === bed.id;
                
                // Position beds within the zone segment
                const bedAngle = startAngle + (segmentAngle / (zoneBeds.length + 1)) * (bedIdx + 1);
                const radius = 70; // Distance from center

                return (
                  <motion.button
                    key={bed.id}
                    className="absolute z-20"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `
                        translate(-50%, -50%) 
                        rotate(${bedAngle}deg) 
                        translateY(-${radius}px) 
                        rotate(-${bedAngle}deg)
                      `,
                    }}
                    onClick={() => onSelectBed(bed)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Piano Key */}
                    <div
                      className={`
                        relative flex items-center justify-center
                        ${isWhite 
                          ? 'w-8 h-10 rounded-b-lg' 
                          : 'w-6 h-7 rounded-b-md -mt-1'
                        }
                        ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
                      `}
                      style={{
                        background: isWhite 
                          ? 'linear-gradient(180deg, #FFFFFF 0%, #E5E5E5 100%)'
                          : 'linear-gradient(180deg, #1F1F1F 0%, #0A0A0A 100%)',
                        boxShadow: isWhite
                          ? '0 4px 6px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.1)'
                          : '0 4px 6px rgba(0,0,0,0.4)',
                        border: isWhite ? '1px solid #CCC' : '1px solid #333',
                      }}
                    >
                      {/* Bed Number */}
                      <span 
                        className={`text-[10px] font-bold ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}
                      >
                        {bed.bed_number}
                      </span>

                      {/* Status Light */}
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: STATUS_COLORS[status].bg,
                          boxShadow: `0 0 8px ${STATUS_COLORS[status].glow}`,
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: status === 'gold' ? [0.8, 1, 0.8] : 1,
                        }}
                        transition={{ 
                          duration: status === 'gold' ? 1.5 : 2, 
                          repeat: Infinity 
                        }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Zone Names (Outside Ring) */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {FREQUENCY_ZONES.map(zone => (
          <div 
            key={zone.hz}
            className="px-2 py-1 rounded-full text-[10px] font-bold"
            style={{ 
              backgroundColor: `${zone.color}20`,
              color: zone.color,
              border: `1px solid ${zone.color}40`,
            }}
          >
            {simpleMode ? zone.artisticName : `${zone.name} ${zone.hz}Hz`}
          </div>
        ))}
      </div>
    </div>
  );
};

// SVG Arc helper function
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  
  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', r, r, 0, largeArc, 0, end.x, end.y,
    'Z'
  ].join(' ');
}

export default PianoWheel;
