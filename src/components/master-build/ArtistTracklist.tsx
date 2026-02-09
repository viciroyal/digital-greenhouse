import { motion } from 'framer-motion';
import { Music2, Disc } from 'lucide-react';
import { trackData } from '@/data/trackData';
import { getZoneByFrequency } from '@/data/harmonicZoneProtocol';

/**
 * ARTIST MODE — PharmBoi album tracklist
 * Each track maps to a Zone/Frequency
 */

const ArtistTracklist = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Disc className="w-4 h-4" style={{ color: 'hsl(270 60% 65%)' }} />
        <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: 'hsl(0 0% 45%)' }}>
          PHARMBOI — FULL TRACKLIST
        </span>
      </div>

      <div className="space-y-1.5">
        {trackData.map((track, i) => {
          const freqNum = parseInt(track.frequency.replace('Hz', ''));
          const zone = getZoneByFrequency(freqNum);
          const zoneColor = zone?.colorHsl || 'hsl(0 0% 50%)';

          return (
            <motion.div
              key={track.row}
              className="flex items-center gap-3 p-3 rounded-lg group cursor-default"
              style={{
                background: 'hsl(0 0% 5%)',
                border: `1px solid ${zoneColor.replace(')', ' / 0.15)')}`,
              }}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{
                background: zoneColor.replace(')', ' / 0.06)'),
                borderColor: zoneColor.replace(')', ' / 0.4)'),
              }}
            >
              {/* Track number */}
              <span className="w-6 text-right font-mono text-xs" style={{ color: 'hsl(0 0% 30%)' }}>
                {String(track.row).padStart(2, '0')}
              </span>

              {/* Zone color dot */}
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: zoneColor, boxShadow: `0 0 8px ${zoneColor.replace(')', ' / 0.4)')}` }}
              />

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-bold truncate" style={{ color: 'hsl(0 0% 80%)' }}>
                  {track.track}
                  {track.featuring && (
                    <span className="font-normal" style={{ color: 'hsl(0 0% 45%)' }}>
                      {' '}ft. {track.featuring}
                    </span>
                  )}
                </p>
              </div>

              {/* Zone / Frequency badge */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-mono" style={{ color: zoneColor }}>
                  {zone?.note || '?'}/{track.frequency}
                </span>
                <div
                  className="px-2 py-0.5 rounded-full text-[8px] font-mono"
                  style={{
                    background: zoneColor.replace(')', ' / 0.15)'),
                    border: `1px solid ${zoneColor.replace(')', ' / 0.3)')}`,
                    color: zoneColor,
                  }}
                >
                  Z{zone?.zone || '?'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ArtistTracklist;
