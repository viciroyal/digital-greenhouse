import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, ChevronDown } from 'lucide-react';
import { HARMONIC_ZONES } from '@/data/harmonicZoneProtocol';

const MODES = [
  {
    mode: 'Ionian',
    symbol: '♮',
    mood: 'Bright Stability',
    character: 'The natural major scale — sunny, resolved, complete.',
    interval: 'Natural 7th',
    agricultural: 'Foundation crops that anchor. Everything grows from this root.',
    scaleFormula: '1 2 3 4 5 6 7',
  },
  {
    mode: 'Dorian',
    symbol: '♭3',
    mood: 'Soulful Resilience',
    character: 'Minor with a raised 6th — bluesy warmth, inner strength.',
    interval: 'Raised 6th',
    agricultural: 'Water-loving crops that persist through drought. Adaptive flow.',
    scaleFormula: '1 2 ♭3 4 5 6 ♭7',
  },
  {
    mode: 'Phrygian',
    symbol: '♭2',
    mood: 'Alchemical Fire',
    character: 'Flat 2nd creates tension at the start — exotic, transformative.',
    interval: 'Flat 2nd',
    agricultural: 'Solar-powered nitrogen fixers. The chemistry of transformation.',
    scaleFormula: '1 ♭2 ♭3 4 5 ♭6 ♭7',
  },
  {
    mode: 'Lydian',
    symbol: '♯4',
    mood: 'Expansive Heart',
    character: 'Raised 4th lifts everything — dreamy, floating, ethereal.',
    interval: 'Raised 4th (♯11)',
    agricultural: 'Mycorrhizal bridge crops. Connection without boundaries.',
    scaleFormula: '1 2 3 ♯4 5 6 7',
  },
  {
    mode: 'Mixolydian',
    symbol: '♭7',
    mood: 'Bluesy Expression',
    character: 'Flat 7th adds edge to major — dominant, expressive, outward.',
    interval: 'Flat 7th',
    agricultural: 'Aromatic signal crops. Pollinator beacons and pest deterrents.',
    scaleFormula: '1 2 3 4 5 6 ♭7',
  },
  {
    mode: 'Aeolian',
    symbol: '♭6',
    mood: 'Deep Vision',
    character: 'The natural minor — introspective, ancient, meditative.',
    interval: 'Flat 6th',
    agricultural: 'Medicinal & alkaloid-dense crops. Plants that see inward.',
    scaleFormula: '1 2 ♭3 4 5 ♭6 ♭7',
  },
  {
    mode: 'Locrian',
    symbol: '♭5',
    mood: 'Transcendent Mystery',
    character: 'Diminished 5th — unstable, otherworldly, the edge of resolution.',
    interval: 'Diminished 5th',
    agricultural: 'Shield crops (garlic, onion). Protection at the threshold.',
    scaleFormula: '1 ♭2 ♭3 4 ♭5 ♭6 ♭7',
  },
];

const ModalReference = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="mx-4 mb-4 rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(0 0% 6%), hsl(0 0% 3%))',
        border: '1px solid hsl(0 0% 12%)',
        boxShadow: 'inset 0 1px 0 hsl(0 0% 10%), 0 4px 16px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header — clickable toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center gap-2 text-left"
      >
        <Music className="w-4 h-4" style={{ color: 'hsl(45 80% 55%)' }} />
        <span
          className="text-[10px] font-bold tracking-[0.2em]"
          style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(45 80% 55%)' }}
        >
          MODAL FIELD GUIDE
        </span>
        <span className="text-[8px] font-mono ml-auto mr-1" style={{ color: 'hsl(0 0% 30%)' }}>
          7 MODES • 7 ZONES
        </span>
        <ChevronDown
          className="w-3 h-3 transition-transform"
          style={{
            color: 'hsl(0 0% 35%)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Collapsible content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >

      {/* Mode Cards */}
      <div className="divide-y" style={{ borderColor: 'hsl(0 0% 8%)' }}>
        {MODES.map((m, i) => {
          const zone = HARMONIC_ZONES[i];
          return (
            <motion.div
              key={m.mode}
              className="px-4 py-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                background: `linear-gradient(135deg, ${zone.colorHex}06, transparent 60%)`,
              }}
            >
              {/* Top row: Note + Mode + Mood */}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold font-mono"
                  style={{
                    background: `${zone.colorHex}18`,
                    color: zone.colorHex,
                    border: `1px solid ${zone.colorHex}40`,
                    textShadow: `0 0 8px ${zone.colorHex}50`,
                  }}
                >
                  {zone.note}
                </span>
                <div className="flex flex-col">
                  <span
                    className="text-xs tracking-wider leading-none"
                    style={{ fontFamily: "'Staatliches', sans-serif", color: zone.colorHex }}
                  >
                    {m.mode} {m.symbol}
                  </span>
                  <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                    {zone.frequencyHz}Hz · {zone.agroIdentity}
                  </span>
                </div>
                <span
                  className="ml-auto text-[8px] font-mono italic"
                  style={{ color: `${zone.colorHex}aa` }}
                >
                  {m.mood}
                </span>
              </div>

              {/* Scale formula */}
              <div className="flex gap-1 mb-1.5">
                {m.scaleFormula.split(' ').map((degree, di) => {
                  const isAltered = degree.includes('♭') || degree.includes('♯');
                  return (
                    <span
                      key={di}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        background: isAltered ? `${zone.colorHex}15` : 'hsl(0 0% 8%)',
                        color: isAltered ? zone.colorHex : 'hsl(0 0% 40%)',
                        border: isAltered ? `1px solid ${zone.colorHex}30` : '1px solid hsl(0 0% 12%)',
                      }}
                    >
                      {degree}
                    </span>
                  );
                })}
              </div>

              {/* Character + Agricultural parallel */}
              <p className="text-[9px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 50%)' }}>
                <span style={{ color: 'hsl(0 0% 60%)' }}>{m.character}</span>
                {' · '}
                <span style={{ color: `${zone.colorHex}90` }}>{m.agricultural}</span>
              </p>

              {/* Characteristic interval tag */}
              <div className="mt-1.5 flex items-center gap-2">
                <span
                  className="text-[7px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: `${zone.colorHex}10`,
                    color: `${zone.colorHex}90`,
                    border: `1px solid ${zone.colorHex}20`,
                  }}
                >
                  CHARACTERISTIC: {m.interval}
                </span>
                <span
                  className="text-[7px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: 'hsl(0 0% 7%)',
                    color: 'hsl(0 0% 35%)',
                    border: '1px solid hsl(0 0% 12%)',
                  }}
                >
                  {zone.dominantMineral} ({zone.mineralSymbol})
                </span>
                <span
                  className="text-[7px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: 'hsl(0 0% 7%)',
                    color: 'hsl(0 0% 35%)',
                    border: '1px solid hsl(0 0% 12%)',
                  }}
                >
                  {zone.element}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModalReference;
