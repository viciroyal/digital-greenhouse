import type { TrackData } from '@/data/trackData';
import { GemstoneBodySvg } from './GemstoneIcons';
import DataQuadrant from './DataQuadrant';

interface BodyQuadrantProps {
  track: TrackData;
}

const BodyIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width={18} height={18}>
    <circle cx="12" cy="5" r="3" fill="none" stroke={`hsl(${color})`} strokeWidth="1.5" />
    <path d="M12 8 L12 16" stroke={`hsl(${color})`} strokeWidth="1.5" />
    <path d="M12 10 L8 14" stroke={`hsl(${color})`} strokeWidth="1.5" />
    <path d="M12 10 L16 14" stroke={`hsl(${color})`} strokeWidth="1.5" />
    <path d="M12 16 L9 22" stroke={`hsl(${color})`} strokeWidth="1.5" />
    <path d="M12 16 L15 22" stroke={`hsl(${color})`} strokeWidth="1.5" />
  </svg>
);

const BodyQuadrant = ({ track }: BodyQuadrantProps) => {
  return (
    <DataQuadrant
      title="The Body"
      label="ANATOMY"
      icon={<BodyIcon color={track.colorHsl} />}
      trackColor={track.colorHsl}
      delay={0.1}
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Body visualization - Gemstone chakra style */}
        <div className="flex items-center justify-center">
          <GemstoneBodySvg highlightArea={track.bodyArea} color={track.colorHsl} />
        </div>

        {/* Data points */}
        <div className="space-y-4">
          <div>
            <p 
              className="font-body text-[10px] uppercase tracking-wider mb-1"
              style={{ color: `hsl(${track.colorHsl} / 0.7)` }}
            >
              Organ Systems
            </p>
            <div className="space-y-1">
              {track.organs.map((organ, i) => (
                <p 
                  key={i} 
                  className="font-body text-sm"
                  style={{ color: 'hsl(40 50% 85%)' }}
                >
                  ◇ {organ}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p 
              className="font-body text-[10px] uppercase tracking-wider mb-1"
              style={{ color: `hsl(${track.colorHsl} / 0.7)` }}
            >
              Chakra
            </p>
            <p 
              className="font-body text-sm font-medium"
              style={{ color: `hsl(${track.colorHsl})` }}
            >
              {track.chakra}
            </p>
          </div>

          <div>
            <p 
              className="font-mono text-[10px] uppercase tracking-wider mb-1"
              style={{ color: `hsl(${track.colorHsl} / 0.7)` }}
            >
              Frequency
            </p>
            <p 
              className="font-mono text-lg"
              style={{ color: 'hsl(45 90% 60%)' }}
            >
              {track.frequency}
            </p>
          </div>
        </div>
      </div>
    </DataQuadrant>
  );
};

export default BodyQuadrant;
