import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrackData } from '@/data/trackData';
import { WovenZodiacGlyph } from './GemstoneIcons';
import DataQuadrant from './DataQuadrant';

interface SkyQuadrantProps {
  track: TrackData;
}

const SkyIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width={18} height={18}>
    <circle cx="12" cy="12" r="8" fill="none" stroke={`hsl(${color})`} strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2" fill={`hsl(${color})`} />
    <circle cx="12" cy="5" r="1.5" fill={`hsl(${color})`} opacity="0.6" />
    <circle cx="19" cy="12" r="1" fill={`hsl(${color})`} opacity="0.6" />
    <circle cx="5" cy="12" r="1" fill={`hsl(${color})`} opacity="0.6" />
  </svg>
);

/** Explains the planetary ruler pairing logic for each frequency zone */
const ZODIAC_PAIRING_LOGIC: Record<string, { pair: string; reason: string }> = {
  'Capricorn': { pair: '\u2651 Capricorn stands alone at 396Hz', reason: 'Saturn anchors the album\'s foundation \u2014 bones, hard labor, and the earth itself.' },
  'Scorpio': { pair: '\u264F Scorpio stands alone at 417Hz', reason: 'Pluto governs transformation and hidden waters \u2014 the alchemy of flow.' },
  'Aries': { pair: '\u2648 Aries & \u264C Leo share 528Hz', reason: 'Mars sparks identity ("I Am"), while the Sun rules royalty \u2014 both ignite the solar fire.' },
  'Leo': { pair: '\u264C Leo & \u2648 Aries share 528Hz', reason: 'The Sun rules royalty and heart-fire. Mars sparks new beginnings alongside it.' },
  'Taurus': { pair: '\u2649 Taurus & \u264E Libra share 639Hz', reason: 'Both are ruled by Venus \u2014 earthly sensuality and balanced partnership bridge the Heart.' },
  'Libra': { pair: '\u264E Libra & \u2649 Taurus share 639Hz', reason: 'Both are ruled by Venus \u2014 balance and physical connection unite in service.' },
  'Gemini': { pair: '\u264A Gemini & \u264D Virgo share 741Hz', reason: 'Both are ruled by Mercury \u2014 communication and analysis express the Signal.' },
  'Virgo': { pair: '\u264D Virgo & \u264A Gemini share 741Hz', reason: 'Both are ruled by Mercury \u2014 purity and duality decode the structure.' },
  'Sagittarius': { pair: '\u2650 Sagittarius & \u2652 Aquarius share 852Hz', reason: 'Jupiter\'s higher vision expands into Uranus\'s future sight \u2014 the Third Eye opens.' },
  'Aquarius': { pair: '\u2652 Aquarius & \u2650 Sagittarius share 852Hz', reason: 'Uranus innovates what Jupiter envisions \u2014 manifesting new realities.' },
  'Pisces': { pair: '\u2653 Pisces & \u264B Cancer share 963Hz', reason: 'Neptune dissolves into Source while the Moon returns to the womb \u2014 the cosmic compost.' },
  'Cancer': { pair: '\u264B Cancer & \u2653 Pisces share 963Hz', reason: 'The Moon governs the shell and home. Neptune carries the dream \u2014 together they close the cycle.' },
};

const SkyQuadrant = ({ track }: SkyQuadrantProps) => {
  const [showLegend, setShowLegend] = useState(false);
  const pairing = ZODIAC_PAIRING_LOGIC[track.zodiacSign];

  return (
    <DataQuadrant
      title="The Sky"
      label="CELESTIAL"
      icon={<SkyIcon color={track.colorHsl} />}
      trackColor={track.colorHsl}
      delay={0.2}
    >
      <div className="flex flex-col items-center justify-center py-4">
        {/* Woven Vine Zodiac Glyph */}
        <motion.div
          className="relative"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <WovenZodiacGlyph glyph={track.zodiacGlyph} color={track.colorHsl} size={120} />
        </motion.div>

        {/* Zodiac Details */}
        <motion.div
          className="mt-6 text-center space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Sign Name */}
          <div>
            <p 
              className="font-display text-xl tracking-wider"
              style={{ 
                color: 'hsl(40 50% 92%)',
                textShadow: `0 0 20px hsl(${track.colorHsl} / 0.5)`,
              }}
            >
              {track.zodiacSign}
            </p>
            <p 
              className="font-body text-[10px] tracking-[0.2em] uppercase mt-1"
              style={{ color: `hsl(${track.colorHsl})` }}
            >
              {track.zodiacName}
            </p>
          </div>

          {/* Planetary Ruler */}
          <div 
            className="pt-3 border-t"
            style={{ borderColor: `hsl(${track.colorHsl} / 0.2)` }}
          >
            <p 
              className="font-body text-[10px] uppercase tracking-[0.15em] mb-1"
              style={{ color: `hsl(${track.colorHsl} / 0.7)` }}
            >
              ◇ Celestial Ruler
            </p>
            <p className="font-body text-sm" style={{ color: 'hsl(40 50% 85%)' }}>
              {track.planetaryRuler}
            </p>
          </div>

          {/* Moon Phase */}
          <div>
            <p 
              className="font-body text-[10px] uppercase tracking-[0.15em] mb-1"
              style={{ color: `hsl(${track.colorHsl} / 0.7)` }}
            >
              ◇ Moon Cycle
            </p>
            <p className="font-body text-sm" style={{ color: 'hsl(40 50% 85%)' }}>
              {track.moonPhase}
            </p>
            <p className="font-body text-xs italic mt-1" style={{ color: 'hsl(40 30% 60%)' }}>
              "{track.moonDescription}"
            </p>
          </div>

          {/* Zodiac Logic */}
          <div 
            className="pt-3 max-w-xs mx-auto"
            style={{ borderTop: `1px dashed hsl(${track.colorHsl} / 0.15)` }}
          >
            <p className="font-body text-xs leading-relaxed italic" style={{ color: 'hsl(40 30% 55%)' }}>
              {track.zodiacLogic}
            </p>
          </div>

          {/* Why This Sign? — Collapsible Legend */}
          {pairing && (
            <div className="pt-2 max-w-xs mx-auto">
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="flex items-center justify-center gap-1.5 mx-auto px-3 py-1.5 rounded-full transition-all"
                style={{
                  background: showLegend
                    ? `hsl(${track.colorHsl} / 0.15)`
                    : 'hsl(0 0% 100% / 0.05)',
                  border: `1px solid hsl(${track.colorHsl} / ${showLegend ? 0.4 : 0.15})`,
                }}
              >
                <span
                  className="text-[9px] font-mono uppercase tracking-[0.15em]"
                  style={{ color: `hsl(${track.colorHsl} / 0.8)` }}
                >
                  {showLegend ? '▾' : '▸'} Why {track.zodiacSign}?
                </span>
              </button>

              <AnimatePresence>
                {showLegend && (
                  <motion.div
                    className="mt-2 p-3 rounded-lg"
                    style={{
                      background: `hsl(${track.colorHsl} / 0.08)`,
                      border: `1px solid hsl(${track.colorHsl} / 0.2)`,
                    }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p
                      className="font-body text-[10px] font-semibold tracking-wider mb-1.5"
                      style={{ color: `hsl(${track.colorHsl})` }}
                    >
                      {pairing.pair}
                    </p>
                    <p
                      className="font-body text-[11px] leading-relaxed"
                      style={{ color: 'hsl(40 30% 65%)' }}
                    >
                      {pairing.reason}
                    </p>
                    <p
                      className="font-body text-[9px] mt-2 italic"
                      style={{ color: 'hsl(40 20% 45%)' }}
                    >
                      Each frequency zone pairs signs by shared planetary rulers — creating a musical bridge across the chakra journey.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </DataQuadrant>
  );
};

export default SkyQuadrant;
