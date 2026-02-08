import type { TrackData } from '@/data/trackData';
import DataQuadrant from './DataQuadrant';

interface LogicQuadrantProps {
  track: TrackData;
}

const LogicIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width={18} height={18}>
    <circle cx="12" cy="12" r="8" fill="none" stroke={`hsl(${color})`} strokeWidth="1.5" />
    <path d="M8 8 L16 16 M16 8 L8 16" stroke={`hsl(${color})`} strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2" fill={`hsl(${color})`} />
  </svg>
);

const LogicQuadrant = ({ track }: LogicQuadrantProps) => {
  return (
    <DataQuadrant
      title="The Logic"
      label="PHARMER'S NOTE"
      icon={<LogicIcon color={track.colorHsl} />}
      trackColor={track.colorHsl}
      delay={0.4}
    >
      {/* Quote box */}
      <div 
        className="relative p-6 rounded-xl"
        style={{ 
          border: `1px solid hsl(${track.colorHsl} / 0.2)`,
          background: `linear-gradient(135deg, hsl(${track.colorHsl} / 0.05) 0%, transparent 100%)`
        }}
      >
        {/* Quote marks */}
        <span 
          className="absolute -top-2 left-4 text-4xl opacity-30"
          style={{ color: `hsl(${track.colorHsl})` }}
        >
          "
        </span>
        
        <p 
          className="font-body text-base leading-relaxed italic pl-4"
          style={{ color: 'hsl(40 50% 88%)' }}
        >
          {track.pharmerNote}
        </p>

        <span 
          className="absolute -bottom-4 right-4 text-4xl opacity-30"
          style={{ color: `hsl(${track.colorHsl})` }}
        >
          "
        </span>
      </div>

      {/* Connection line */}
      <div className="mt-6 flex items-center gap-3">
        <div 
          className="h-px flex-1"
          style={{ background: `linear-gradient(90deg, hsl(${track.colorHsl} / 0.4), transparent)` }}
        />
        <p className="font-mono text-[10px]" style={{ color: 'hsl(40 30% 55%)' }}>
          {track.mineral} → {track.chakra} → {track.frequency}
        </p>
        <div 
          className="h-px flex-1"
          style={{ background: `linear-gradient(90deg, transparent, hsl(${track.colorHsl} / 0.4))` }}
        />
      </div>
    </DataQuadrant>
  );
};

export default LogicQuadrant;
