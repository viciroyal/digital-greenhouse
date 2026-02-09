import { motion } from 'framer-motion';
import { GardenBed, BedPlanting, ChordInterval, CHORD_INTERVALS } from '@/hooks/useGardenBeds';
import { Music, Sparkles, AlertCircle, Loader2, Zap, Network } from 'lucide-react';

interface BedGridProps {
  beds: GardenBed[];
  selectedBedId: string | null;
  onSelectBed: (bed: GardenBed) => void;
  isAdmin: boolean;
  isLoading?: boolean;
  bedPlantingsMap?: Record<string, BedPlanting[]>;
}

// Check if a bed has a complete chord (all 4 intervals)
const isCompleteChord = (plantings: BedPlanting[] = []): boolean => {
  const hasInterval = (interval: ChordInterval) => 
    plantings.some(p => p.crop?.chord_interval === interval);
  
  return CHORD_INTERVALS.every(interval => hasInterval(interval));
};

// Check if bed has 11th Interval (Fungal Network) active
const hasNetworkActive = (bed: GardenBed): boolean => {
  return bed.inoculant_type !== null;
};

const BedGrid = ({ beds, selectedBedId, onSelectBed, isAdmin, isLoading, bedPlantingsMap = {} }: BedGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'hsl(45 80% 60%)' }} />
      </div>
    );
  }

  // Group beds by zone
  const zones = [
    { name: 'The Root', hz: 396, color: 'hsl(0 60% 50%)', beds: beds.filter(b => b.frequency_hz === 396) },
    { name: 'The Flow', hz: 417, color: 'hsl(30 70% 50%)', beds: beds.filter(b => b.frequency_hz === 417) },
    { name: 'The Solar', hz: 528, color: 'hsl(51 80% 50%)', beds: beds.filter(b => b.frequency_hz === 528) },
    { name: 'The Heart', hz: 639, color: 'hsl(120 50% 45%)', beds: beds.filter(b => b.frequency_hz === 639) },
    { name: 'The Voice', hz: 741, color: 'hsl(210 60% 50%)', beds: beds.filter(b => b.frequency_hz === 741) },
    { name: 'The Vision', hz: 852, color: 'hsl(270 50% 50%)', beds: beds.filter(b => b.frequency_hz === 852) },
    { name: 'The Shield', hz: 963, color: 'hsl(300 50% 50%)', beds: beds.filter(b => b.frequency_hz === 963) },
  ];

  const getVitalityIcon = (bed: GardenBed) => {
    const plantings = bedPlantingsMap[bed.id] || [];
    const isTuned = isCompleteChord(plantings);
    const hasNetwork = hasNetworkActive(bed);

    // Show Harmonically Tuned icon if complete chord
    if (isTuned) {
      return <Zap className="w-3 h-3" style={{ color: bed.zone_color }} />;
    }

    // Show Network Active icon if 11th Interval is active
    if (hasNetwork) {
      return (
        <motion.div
          animate={{ 
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Network className="w-3 h-3" style={{ color: 'hsl(180 60% 50%)' }} />
        </motion.div>
      );
    }

    if (isAdmin) {
      // Admin sees actual Brix value
      if (bed.internal_brix === null) return null;
      return (
        <span className="text-[10px] font-mono font-bold" style={{ color: bed.internal_brix >= 15 ? 'hsl(45 90% 60%)' : 'hsl(0 60% 55%)' }}>
          {bed.internal_brix}°
        </span>
      );
    } else {
      // Member sees vitality icon only
      if (bed.vitality_status === 'thriving') {
        return <Sparkles className="w-3 h-3" style={{ color: 'hsl(45 90% 60%)' }} />;
      }
      if (bed.vitality_status === 'needs_attention') {
        return <AlertCircle className="w-3 h-3" style={{ color: 'hsl(0 60% 55%)' }} />;
      }
      return null;
    }
  };

  return (
    <div className="space-y-4">
      {zones.map((zone) => (
        <div key={zone.hz} className="space-y-2">
          {/* Zone Header */}
          <div className="flex items-center gap-2 px-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: zone.color, boxShadow: `0 0 8px ${zone.color}` }}
            />
            <span className="text-xs font-mono tracking-wider" style={{ color: zone.color }}>
              {zone.name}
            </span>
            <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
              {zone.hz}Hz
            </span>
            <Music className="w-3 h-3 ml-auto" style={{ color: zone.color, opacity: 0.5 }} />
          </div>

          {/* Beds in Zone */}
          <div className="grid grid-cols-7 gap-2">
            {zone.beds.map((bed) => {
              const isSelected = selectedBedId === bed.id;
              const plantings = bedPlantingsMap[bed.id] || [];
              const isTuned = isCompleteChord(plantings);
              const hasNetwork = hasNetworkActive(bed);
              
              return (
                <motion.button
                  key={bed.id}
                  className="relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all"
                  style={{
                    background: isSelected 
                      ? `linear-gradient(135deg, ${zone.color}40, ${zone.color}20)`
                      : isTuned
                        ? `linear-gradient(135deg, ${zone.color}25, ${zone.color}10)`
                        : hasNetwork
                          ? 'linear-gradient(135deg, hsl(180 30% 15%), hsl(180 20% 10%))'
                          : 'hsl(0 0% 12%)',
                    border: isSelected 
                      ? `2px solid ${zone.color}` 
                      : isTuned
                        ? `2px solid ${zone.color}80`
                        : hasNetwork
                          ? '2px solid hsl(180 50% 40%)'
                          : '1px solid hsl(0 0% 20%)',
                    boxShadow: isSelected 
                      ? `0 0 20px ${zone.color}50` 
                      : isTuned
                        ? `0 0 15px ${zone.color}30`
                        : 'none',
                  }}
                  whileHover={{ 
                    scale: 1.08,
                    borderColor: zone.color,
                    boxShadow: `0 0 20px ${zone.color}40`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectBed(bed)}
                  animate={
                    isTuned && !isSelected 
                      ? {
                          boxShadow: [
                            `0 0 10px ${zone.color}20`,
                            `0 0 20px ${zone.color}40`,
                            `0 0 10px ${zone.color}20`,
                          ],
                        }
                      : hasNetwork && !isSelected
                        ? {
                            boxShadow: [
                              '0 0 8px hsl(180 50% 30%)',
                              '0 0 16px hsl(180 60% 40%)',
                              '0 0 8px hsl(180 50% 30%)',
                            ],
                          }
                        : {}
                  }
                  transition={{ duration: 3, repeat: (isTuned || hasNetwork) && !isSelected ? Infinity : 0 }}
                >
                  <span 
                    className="text-sm font-mono font-bold"
                    style={{ color: isSelected || isTuned ? zone.color : 'hsl(0 0% 60%)' }}
                  >
                    {bed.bed_number}
                  </span>
                  
                  {/* Vitality/Tuned Indicator */}
                  <div className="absolute top-1 right-1">
                    {getVitalityIcon(bed)}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BedGrid;
