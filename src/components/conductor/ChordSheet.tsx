import { motion } from 'framer-motion';
import { Music, Leaf, Shield, Pickaxe, Sparkles, Network, TreeDeciduous, Zap, AlertTriangle } from 'lucide-react';
import { ChordSheet as ChordSheetType, INSTRUMENT_ICONS, InstrumentType } from '@/hooks/useAutoGeneration';

interface ChordSheetProps {
  sheet: ChordSheetType;
  isAdmin: boolean;
}

const getInstrumentIcon = (instrumentType: string | null | undefined): string => {
  if (!instrumentType) return '🎵';
  return INSTRUMENT_ICONS[instrumentType as InstrumentType]?.icon || '🎵';
};

const ChordSheet = ({ sheet, isAdmin }: ChordSheetProps) => {
  const { tone, zoneName, masterMixSetting, voicingDensity, intervals, isCompleteChord, isJazz13th } = sheet;

  // Zone color mapping
  const getZoneColor = (hz: number): string => {
    switch (hz) {
      case 396: return 'hsl(0 60% 50%)';
      case 417: return 'hsl(30 70% 50%)';
      case 528: return 'hsl(51 80% 50%)';
      case 639: return 'hsl(120 50% 45%)';
      case 741: return 'hsl(210 60% 50%)';
      case 852: return 'hsl(270 50% 50%)';
      case 963: return 'hsl(300 50% 50%)';
      default: return 'hsl(0 0% 50%)';
    }
  };

  const zoneColor = getZoneColor(tone);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: isJazz13th
          ? 'linear-gradient(135deg, hsl(45 40% 12%), hsl(35 30% 8%))'
          : 'linear-gradient(135deg, hsl(270 20% 12%), hsl(270 15% 8%))',
        border: isJazz13th
          ? '2px solid hsl(45 80% 55%)'
          : `2px solid ${zoneColor}50`,
        boxShadow: isJazz13th
          ? '0 0 40px hsl(45 80% 50% / 0.3)'
          : `0 0 20px ${zoneColor}30`,
      }}
    >
      {/* Header */}
      <div
        className="p-3 flex items-center justify-between"
        style={{
          background: `linear-gradient(90deg, ${zoneColor}25, transparent)`,
          borderBottom: `1px solid ${zoneColor}40`,
        }}
      >
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5" style={{ color: zoneColor }} />
          <span className="text-sm font-mono font-bold tracking-wider" style={{ color: zoneColor }}>
            CHORD SHEET
          </span>
        </div>
        {isJazz13th && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{ background: 'hsl(45 60% 20%)', border: '1px solid hsl(45 80% 55%)' }}
          >
            <Zap className="w-3 h-3" style={{ color: 'hsl(45 90% 60%)' }} />
            <span className="text-[9px] font-mono font-bold" style={{ color: 'hsl(45 80% 65%)' }}>
              JAZZ 13th
            </span>
          </motion.div>
        )}
      </div>

      {/* Main Stats */}
      <div className="p-4 space-y-4">
        {/* Tone & Mix Setting */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-lg"
            style={{ background: `${zoneColor}15`, border: `1px solid ${zoneColor}40` }}
          >
            <span className="text-[10px] font-mono block mb-1" style={{ color: 'hsl(0 0% 50%)' }}>
              TONE
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-bold" style={{ color: zoneColor }}>
                {tone}
              </span>
              <span className="text-xs font-mono" style={{ color: 'hsl(0 0% 50%)' }}>Hz</span>
            </div>
            <span className="text-[10px] font-mono" style={{ color: zoneColor }}>
              {zoneName} Zone
            </span>
          </div>

          <div
            className="p-3 rounded-lg"
            style={{ background: 'hsl(45 30% 12%)', border: '1px solid hsl(45 50% 35%)' }}
          >
            <span className="text-[10px] font-mono block mb-1" style={{ color: 'hsl(0 0% 50%)' }}>
              MASTER MIX SETTING
            </span>
            <span className="text-sm font-mono font-bold block" style={{ color: 'hsl(45 70% 60%)' }}>
              {masterMixSetting.mixFocus}
            </span>
            <span className="text-[10px] font-mono" style={{ color: 'hsl(45 50% 50%)' }}>
              {masterMixSetting.harmonyType} • {masterMixSetting.primaryMineral}
            </span>
          </div>
        </div>

        {/* Voicing Density */}
        <div
          className="p-3 rounded-lg"
          style={{ 
            background: 'linear-gradient(90deg, hsl(120 30% 12%), hsl(90 25% 10%))',
            border: '1px solid hsl(120 40% 35%)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
              VOICING DENSITY
            </span>
            <span className="text-[10px] font-mono" style={{ color: 'hsl(120 50% 55%)' }}>
              All intervals combined
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-mono font-bold" style={{ color: 'hsl(120 60% 55%)' }}>
              {voicingDensity.toLocaleString()}
            </span>
            <span className="text-sm font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
              total plants
            </span>
          </div>
        </div>

        {/* Interval Breakdown */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 50%)' }}>
            INTERVAL BREAKDOWN
          </span>

          {/* Ground Intervals */}
          <div className="grid grid-cols-2 gap-2">
            {/* Root */}
            {intervals.root && (
              <IntervalCard
                icon={<Leaf className="w-3.5 h-3.5" />}
                label="ROOT"
                cropName={intervals.root.crop.name}
                plantCount={intervals.root.plantCount}
                instrument={intervals.root.crop.instrument_type}
                color="hsl(120 50% 50%)"
              />
            )}
            
            {/* 3rd */}
            {intervals.third && (
              <IntervalCard
                icon={<Shield className="w-3.5 h-3.5" />}
                label="3RD"
                cropName={intervals.third.crop.name}
                plantCount={intervals.third.plantCount}
                instrument={intervals.third.crop.instrument_type}
                color="hsl(0 60% 55%)"
              />
            )}
            
            {/* 5th */}
            {intervals.fifth && (
              <IntervalCard
                icon={<Pickaxe className="w-3.5 h-3.5" />}
                label="5TH"
                cropName={intervals.fifth.crop.name}
                plantCount={intervals.fifth.plantCount}
                instrument={intervals.fifth.crop.instrument_type}
                color="hsl(35 70% 55%)"
              />
            )}
            
            {/* 7th */}
            {intervals.seventh && (
              <IntervalCard
                icon={<Sparkles className="w-3.5 h-3.5" />}
                label="7TH"
                cropName={intervals.seventh.crop.name}
                plantCount={intervals.seventh.plantCount}
                instrument={intervals.seventh.crop.instrument_type}
                color="hsl(270 50% 60%)"
              />
            )}
          </div>

          {/* Biological Overlays */}
          <div className="grid grid-cols-2 gap-2 pt-2" style={{ borderTop: '1px dashed hsl(0 0% 20%)' }}>
            {/* 11th */}
            {intervals.eleventh && (
              <div
                className="p-2 rounded-lg flex items-center gap-2"
                style={{ background: 'hsl(180 30% 12%)', border: '1px solid hsl(180 40% 35%)' }}
              >
                <Network className="w-3.5 h-3.5" style={{ color: 'hsl(180 60% 55%)' }} />
                <div>
                  <span className="text-[9px] font-mono block" style={{ color: 'hsl(0 0% 50%)' }}>11TH</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: 'hsl(180 60% 60%)' }}>
                    {intervals.eleventh.name}
                  </span>
                </div>
              </div>
            )}
            
            {/* 13th */}
            {intervals.thirteenth && (
              <div
                className="p-2 rounded-lg flex items-center gap-2"
                style={{ background: 'hsl(90 30% 12%)', border: '1px solid hsl(90 40% 35%)' }}
              >
                <TreeDeciduous className="w-3.5 h-3.5" style={{ color: 'hsl(90 60% 55%)' }} />
                <div>
                  <span className="text-[9px] font-mono block" style={{ color: 'hsl(0 0% 50%)' }}>13TH</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: 'hsl(90 60% 60%)' }}>
                    {intervals.thirteenth.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completion Status */}
        <div 
          className="flex items-center justify-center gap-2 p-2 rounded-lg"
          style={{ 
            background: isCompleteChord ? 'hsl(120 30% 12%)' : 'hsl(45 30% 12%)',
            border: `1px solid ${isCompleteChord ? 'hsl(120 50% 40%)' : 'hsl(45 50% 40%)'}`,
          }}
        >
          {isCompleteChord ? (
            <>
              <Zap className="w-4 h-4" style={{ color: 'hsl(120 60% 55%)' }} />
              <span className="text-xs font-mono font-bold" style={{ color: 'hsl(120 60% 55%)' }}>
                CHORD COMPLETE • HARMONICALLY STABLE
              </span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(45 80% 55%)' }} />
              <span className="text-xs font-mono font-bold" style={{ color: 'hsl(45 80% 55%)' }}>
                BUILDING CHORD...
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Interval Card sub-component
interface IntervalCardProps {
  icon: React.ReactNode;
  label: string;
  cropName: string;
  plantCount: number;
  instrument: string | null;
  color: string;
}

const IntervalCard = ({ icon, label, cropName, plantCount, instrument, color }: IntervalCardProps) => {
  const instrumentIcon = instrument ? INSTRUMENT_ICONS[instrument as InstrumentType]?.icon : '🎵';
  
  return (
    <div
      className="p-2 rounded-lg"
      style={{ background: `${color}15`, border: `1px solid ${color}40` }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <span style={{ color }}>{icon}</span>
          <span className="text-[9px] font-mono font-bold" style={{ color }}>{label}</span>
        </div>
        <span className="text-sm">{instrumentIcon}</span>
      </div>
      <span className="text-[10px] font-mono font-bold block truncate" style={{ color }}>
        {cropName}
      </span>
      <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
        {plantCount} plants
      </span>
    </div>
  );
};

export default ChordSheet;
