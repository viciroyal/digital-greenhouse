import { motion } from 'framer-motion';
import { useState } from 'react';
import type { TrackData } from '@/data/trackData';

interface RxPrescriptionProps {
  track: TrackData;
  onActivate: () => void;
}

// Master Prescription Data - exact copy from the specification
const prescriptionData: Record<number, {
  action: string;
  dosage: string;
  instruction: string;
}> = {
  1: {
    action: 'Hydrate & Ground',
    dosage: 'Drink 16oz of Spring Water immediately.',
    instruction: 'Remove shoes. Stand on bare earth or floor while listening. Reset the electrical anchor.',
  },
  2: {
    action: 'Fluid Movement',
    dosage: '1 Cup of Herbal Tea (Chamomile/Mint).',
    instruction: 'Do not sit still. Sway the hips to circulate the spinal fluid. Let the chemistry flow.',
  },
  3: {
    action: 'Solar Charging',
    dosage: '10 Minutes of Direct Sunlight.',
    instruction: 'Face the sun (or a warm light). Breathe fire (rapid exhale). Burn the old identity.',
  },
  4: {
    action: 'Journaling (The Manifesto)',
    dosage: '1 Page of Writing.',
    instruction: 'Write down your territory. Who is in your tribe? Define the borders while the bass plays.',
  },
  5: {
    action: 'Cacao / Heart Opener',
    dosage: '1 Piece of Dark Chocolate or Raw Cacao.',
    instruction: 'Place hand on chest. Feel the rhythm of your own heart syncing with the kick drum.',
  },
  6: {
    action: 'The Gift',
    dosage: '1 Act of Service.',
    instruction: 'Water a plant or send a kind text to a friend before the song ends. Circulate the energy.',
  },
  7: {
    action: 'Vocal Toning',
    dosage: '3 Deep Hums.',
    instruction: 'Hum a low tone against the roof of your mouth. Vibrate the pineal gland. Speak the new reality.',
  },
  8: {
    action: 'The Cleanse',
    dosage: 'Absolute Silence.',
    instruction: 'Sit in silence for 30 seconds before hitting play. Clear the static. Listen to the bone structure.',
  },
  9: {
    action: 'Dark Room Vision',
    dosage: '0 Lumens (Total Darkness).',
    instruction: 'Turn off all lights. Close eyes. Watch the colors that appear on the back of your eyelids.',
  },
  10: {
    action: 'The Candle Gaze',
    dosage: '1 Single Flame.',
    instruction: 'Light a candle. Stare at the wick without blinking. Pour your intention into the fire.',
  },
  11: {
    action: 'Deep Breath (Pranayama)',
    dosage: '4-7-8 Breathing Technique.',
    instruction: 'Inhale for 4. Hold for 7. Exhale for 8. Dissolve the ego into the frequency.',
  },
  12: {
    action: 'The Rest (Savasana)',
    dosage: 'Horizontal Stillness.',
    instruction: 'Lie on the floor. Palms up. Do absolutely nothing. Let the compost do the work.',
  },
};

// Rx Symbol with Sprouting Seed
const RxSeedIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 48 48" className="w-12 h-12">
    {/* Rx Symbol */}
    <text
      x="6"
      y="32"
      fontFamily="Georgia, serif"
      fontSize="24"
      fontWeight="bold"
      fill={`hsl(${color})`}
      opacity="0.9"
    >
      Rx
    </text>
    
    {/* Sprouting Seed */}
    <g transform="translate(28, 8)">
      {/* Seed body */}
      <ellipse cx="8" cy="28" rx="6" ry="4" fill="#8B4513" opacity="0.8" />
      {/* Stem */}
      <path
        d="M8 28 Q6 20 8 12 Q10 20 8 28"
        stroke="#228B22"
        strokeWidth="2"
        fill="none"
      />
      {/* Leaves */}
      <path
        d="M8 16 Q4 12 2 8 Q6 10 8 16"
        fill="#32CD32"
        opacity="0.9"
      />
      <path
        d="M8 14 Q12 10 16 8 Q12 12 8 14"
        fill="#228B22"
        opacity="0.9"
      />
      {/* Root dots */}
      <circle cx="6" cy="32" r="1" fill="#8B4513" opacity="0.5" />
      <circle cx="10" cy="33" r="1" fill="#8B4513" opacity="0.5" />
      <circle cx="8" cy="35" r="1" fill="#8B4513" opacity="0.4" />
    </g>
  </svg>
);

const RxPrescription = ({ track, onActivate }: RxPrescriptionProps) => {
  const [isActivated, setIsActivated] = useState(false);
  const rx = prescriptionData[track.row];

  if (!rx) return null;

  const handleActivate = () => {
    setIsActivated(true);
    onActivate();
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      style={{
        background: 'linear-gradient(135deg, #fefefe 0%, #f8f6f0 50%, #f4f1ea 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(139,69,19,0.1)',
      }}
    >
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Torn edge effect at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-2"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,69,19,0.1) 10%, transparent 20%, rgba(139,69,19,0.05) 40%, transparent 50%, rgba(139,69,19,0.1) 70%, transparent 80%, rgba(139,69,19,0.05) 90%, transparent 100%)',
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 border-b-2 border-dashed border-amber-800/20 pb-4">
          <div className="flex items-center gap-3">
            <RxSeedIcon color={track.colorHsl} />
            <div>
              <p 
                className="text-xs tracking-[0.15em] uppercase font-bold"
                style={{ 
                  fontFamily: "'Courier New', Courier, monospace",
                  color: '#8B4513',
                }}
              >
                LISTENER Rx
              </p>
              <p 
                className="text-[10px] tracking-wider uppercase mt-0.5"
                style={{ 
                  fontFamily: "'Courier New', Courier, monospace",
                  color: '#666',
                }}
              >
                OFFICIAL PRESCRIPTION
              </p>
            </div>
          </div>
          <div className="text-right">
            <p 
              className="text-xs font-bold"
              style={{ 
                fontFamily: "'Courier New', Courier, monospace",
                color: '#333',
              }}
            >
              DR. VICI ROYÀL
            </p>
            <p 
              className="text-[10px] mt-0.5"
              style={{ 
                fontFamily: "'Courier New', Courier, monospace",
                color: '#888',
              }}
            >
              Holistic Pharmacist
            </p>
          </div>
        </div>

        {/* Patient / Track Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="text-[10px] uppercase tracking-wider"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: '#666' }}
            >
              FOR:
            </span>
            <span 
              className="text-sm font-bold"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: '#222' }}
            >
              {track.track}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="text-[10px] uppercase tracking-wider"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: '#666' }}
            >
              FREQ:
            </span>
            <span 
              className="text-xs font-bold"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: `hsl(${track.colorHsl})` }}
            >
              {track.frequency}
            </span>
          </div>
        </div>

        {/* Prescription Details */}
        <div 
          className="rounded-lg p-4 mb-4"
          style={{ 
            background: 'rgba(139,69,19,0.05)',
            border: '1px solid rgba(139,69,19,0.1)',
          }}
        >
          {/* Rx Action */}
          <div className="mb-3">
            <p 
              className="text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: '#888' }}
            >
              Rx ACTION
            </p>
            <p 
              className="text-base font-bold"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: '#333' }}
            >
              {rx.action}
            </p>
          </div>

          {/* Dosage */}
          <div className="mb-3">
            <p 
              className="text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: '#888' }}
            >
              DOSAGE
            </p>
            <p 
              className="text-sm"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: '#444' }}
            >
              {rx.dosage}
            </p>
          </div>

          {/* Instructions */}
          <div>
            <p 
              className="text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: '#888' }}
            >
              INSTRUCTIONS
            </p>
            <p 
              className="text-sm leading-relaxed italic"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: '#555' }}
            >
              "{rx.instruction}"
            </p>
          </div>
        </div>

        {/* Signature Area */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p 
              className="text-[9px] uppercase tracking-wider mb-1"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: '#999' }}
            >
              AUTHORIZED BY
            </p>
            <p 
              className="text-sm italic"
              style={{ fontFamily: "Georgia, serif", color: '#333' }}
            >
              Vici Royàl
            </p>
            <div className="w-20 h-px bg-amber-800/30 mt-1" />
          </div>
          <div className="text-right">
            <p 
              className="text-[9px] uppercase tracking-wider"
              style={{ fontFamily: "'Courier New', Courier, monospace", color: '#999' }}
            >
              #{String(track.row).padStart(3, '0')}-{track.frequency.replace('Hz', '')}
            </p>
          </div>
        </div>

        {/* Activate Button */}
        <motion.button
          className="w-full py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition-all duration-300"
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            background: isActivated 
              ? `linear-gradient(135deg, hsl(${track.colorHsl}), hsl(${track.colorHsl} / 0.8))`
              : 'linear-gradient(135deg, #2d2d2d, #1a1a1a)',
            color: isActivated ? '#fff' : '#f0f0f0',
            border: isActivated ? 'none' : '2px solid #444',
            boxShadow: isActivated 
              ? `0 4px 20px hsl(${track.colorHsl} / 0.4)`
              : '0 2px 10px rgba(0,0,0,0.2)',
          }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleActivate}
          disabled={isActivated}
        >
          {isActivated ? (
            <span className="flex items-center justify-center gap-2">
              <span>✓</span> PRESCRIPTION ACTIVATED
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>⚡</span> I COMPLY (ACTIVATE TRACK)
            </span>
          )}
        </motion.button>

        {/* Disclaimer */}
        <p 
          className="text-center text-[8px] mt-3 uppercase tracking-wider"
          style={{ fontFamily: "'Courier New', Courier, monospace", color: '#aaa' }}
        >
          This prescription is for vibrational purposes only.
        </p>
      </div>

      {/* Perforated edge indicator on the side */}
      <div className="absolute left-0 top-8 bottom-8 w-1 flex flex-col justify-evenly">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="w-1 h-1 rounded-full"
            style={{ background: 'rgba(139,69,19,0.15)' }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default RxPrescription;
