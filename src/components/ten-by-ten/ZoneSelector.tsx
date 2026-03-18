import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { STATE_HARDINESS_ZONES, US_STATES } from '@/data/stateHardinessZones';
import { LAST_FROST_BY_ZONE, FIRST_FROST_BY_ZONE } from '@/lib/frostDates';

interface ZoneSelectorProps {
  selectedState: string | null;
  onStateChange: (state: string | null) => void;
}

const ZoneSelector = ({ selectedState, onStateChange }: ZoneSelectorProps) => {
  const zoneInfo = selectedState ? STATE_HARDINESS_ZONES[selectedState] : null;
  const lastFrost = zoneInfo ? LAST_FROST_BY_ZONE[zoneInfo.zone] : null;
  const firstFrost = zoneInfo ? FIRST_FROST_BY_ZONE[zoneInfo.zone] : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-10"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4" style={{ color: 'hsl(200 60% 55%)' }} />
        <h2 className="text-lg font-bold" style={{ color: 'hsl(0 0% 85%)' }}>
          Your Growing Zone
        </h2>
      </div>

      <select
        value={selectedState ?? ''}
        onChange={(e) => onStateChange(e.target.value || null)}
        className="w-full text-sm font-mono px-4 py-3 rounded-xl appearance-none cursor-pointer"
        style={{
          background: 'hsl(0 0% 7%)',
          border: '1px solid hsl(0 0% 15%)',
          color: selectedState ? 'hsl(0 0% 85%)' : 'hsl(0 0% 45%)',
        }}
      >
        <option value="">Select your state…</option>
        {US_STATES.map((state) => {
          const info = STATE_HARDINESS_ZONES[state];
          return (
            <option key={state} value={state}>
              {info.abbr} — {state} ({info.label})
            </option>
          );
        })}
      </select>

      {zoneInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 rounded-xl px-4 py-3 grid grid-cols-3 gap-2"
          style={{
            background: 'hsl(200 20% 8%)',
            border: '1px solid hsl(200 40% 30% / 0.3)',
          }}
        >
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider block" style={{ color: 'hsl(0 0% 45%)' }}>
              Zone
            </span>
            <span className="text-lg font-bold font-mono" style={{ color: 'hsl(200 60% 65%)' }}>
              {zoneInfo.subZone}
            </span>
          </div>
          {lastFrost && (
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider block" style={{ color: 'hsl(0 0% 45%)' }}>
                Last Frost
              </span>
              <span className="text-sm font-mono font-semibold" style={{ color: 'hsl(130 50% 60%)' }}>
                {lastFrost.label}
              </span>
            </div>
          )}
          {firstFrost && (
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider block" style={{ color: 'hsl(0 0% 45%)' }}>
                First Frost
              </span>
              <span className="text-sm font-mono font-semibold" style={{ color: 'hsl(45 60% 60%)' }}>
                {firstFrost.label}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </motion.section>
  );
};

export default ZoneSelector;
