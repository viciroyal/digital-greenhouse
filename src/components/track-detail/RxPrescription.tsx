import { motion } from 'framer-motion';
import { useState } from 'react';
import type { TrackData } from '@/data/trackData';

interface RxPrescriptionProps {
  track: TrackData;
  onActivate: () => void;
}

// Dogon/Bogolanfini color palette
const DOGON_COLORS = {
  ebonyBlack: '#1a1410',
  mudBrown: '#3d2a1a',
  fermentedMud: '#2a1f16',
  rustClay: '#8b3a1d',
  milletYellow: '#d4b896',
  paleStraw: '#e8dcc8',
  boneWhite: '#f5f0e6',
};

// Master Prescription Data - exact same logic retained
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

// Bogolanfini (Mud Cloth) geometric patterns
const MudClothPattern = ({ variant = 0 }: { variant?: number }) => {
  const patterns = [
    // Pattern 1: Zigzag rows
    <>
      <path d="M0 10 L10 0 L20 10 L30 0 L40 10" stroke={DOGON_COLORS.paleStraw} strokeWidth="2" fill="none" />
      <path d="M0 25 L10 15 L20 25 L30 15 L40 25" stroke={DOGON_COLORS.paleStraw} strokeWidth="2" fill="none" />
      <rect x="15" y="30" width="10" height="10" fill={DOGON_COLORS.paleStraw} opacity="0.8" />
    </>,
    // Pattern 2: Cross pattern
    <>
      <path d="M20 0 L20 40" stroke={DOGON_COLORS.paleStraw} strokeWidth="2" />
      <path d="M0 20 L40 20" stroke={DOGON_COLORS.paleStraw} strokeWidth="2" />
      <rect x="5" y="5" width="8" height="8" fill={DOGON_COLORS.rustClay} opacity="0.6" />
      <rect x="27" y="27" width="8" height="8" fill={DOGON_COLORS.rustClay} opacity="0.6" />
    </>,
    // Pattern 3: Diamond grid
    <>
      <path d="M20 0 L40 20 L20 40 L0 20 Z" stroke={DOGON_COLORS.paleStraw} strokeWidth="2" fill="none" />
      <path d="M20 10 L30 20 L20 30 L10 20 Z" stroke={DOGON_COLORS.milletYellow} strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="20" r="3" fill={DOGON_COLORS.paleStraw} />
    </>,
    // Pattern 4: Parallel lines with dots
    <>
      <path d="M0 8 L40 8" stroke={DOGON_COLORS.paleStraw} strokeWidth="2" />
      <path d="M0 20 L40 20" stroke={DOGON_COLORS.paleStraw} strokeWidth="2" />
      <path d="M0 32 L40 32" stroke={DOGON_COLORS.paleStraw} strokeWidth="2" />
      <circle cx="10" cy="14" r="2" fill={DOGON_COLORS.milletYellow} />
      <circle cx="30" cy="14" r="2" fill={DOGON_COLORS.milletYellow} />
      <circle cx="20" cy="26" r="2" fill={DOGON_COLORS.milletYellow} />
    </>,
  ];

  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      {patterns[variant % patterns.length]}
    </svg>
  );
};

// Kanaga Symbol (Dogon sacred symbol)
const KanagaSymbol = ({ color }: { color: string }) => (
  <motion.svg 
    viewBox="0 0 60 60" 
    className="w-14 h-14"
    animate={{ rotate: [0, 2, -2, 0] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
  >
    {/* Central vertical */}
    <path 
      d="M30 10 L30 50" 
      stroke={DOGON_COLORS.paleStraw} 
      strokeWidth="3" 
      strokeLinecap="square"
    />
    
    {/* Upper arms (Kanaga shape) */}
    <path 
      d="M30 18 L18 10 L12 16" 
      stroke={DOGON_COLORS.paleStraw} 
      strokeWidth="3" 
      strokeLinecap="square"
      fill="none"
    />
    <path 
      d="M30 18 L42 10 L48 16" 
      stroke={DOGON_COLORS.paleStraw} 
      strokeWidth="3" 
      strokeLinecap="square"
      fill="none"
    />
    
    {/* Lower arms (inverted) */}
    <path 
      d="M30 42 L18 50 L12 44" 
      stroke={DOGON_COLORS.paleStraw} 
      strokeWidth="3" 
      strokeLinecap="square"
      fill="none"
    />
    <path 
      d="M30 42 L42 50 L48 44" 
      stroke={DOGON_COLORS.paleStraw} 
      strokeWidth="3" 
      strokeLinecap="square"
      fill="none"
    />
    
    {/* Center accent */}
    <rect 
      x="26" 
      y="26" 
      width="8" 
      height="8" 
      fill={`hsl(${color})`} 
      opacity="0.8"
    />
  </motion.svg>
);

// Mud Cloth border pattern
const MudClothBorder = ({ position }: { position: 'top' | 'bottom' }) => {
  return (
    <div 
      className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 h-8 overflow-hidden`}
    >
      <svg viewBox="0 0 400 32" className="w-full h-full" preserveAspectRatio="none">
        {/* Zigzag pattern */}
        <path 
          d={position === 'top' 
            ? "M0 32 L20 8 L40 32 L60 8 L80 32 L100 8 L120 32 L140 8 L160 32 L180 8 L200 32 L220 8 L240 32 L260 8 L280 32 L300 8 L320 32 L340 8 L360 32 L380 8 L400 32"
            : "M0 0 L20 24 L40 0 L60 24 L80 0 L100 24 L120 0 L140 24 L160 0 L180 24 L200 0 L220 24 L240 0 L260 24 L280 0 L300 24 L320 0 L340 24 L360 0 L380 24 L400 0"
          }
          stroke={DOGON_COLORS.paleStraw}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        {/* Horizontal lines */}
        <line 
          x1="0" 
          y1={position === 'top' ? "4" : "28"} 
          x2="400" 
          y2={position === 'top' ? "4" : "28"} 
          stroke={DOGON_COLORS.milletYellow} 
          strokeWidth="1" 
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

// Ceremonial sound generator
const playCeremonialSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Deep resonant drone (Dogon drum-like)
  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator1.type = 'sine';
  oscillator1.frequency.setValueAtTime(55, audioContext.currentTime);
  oscillator1.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 1.5);
  
  oscillator2.type = 'triangle';
  oscillator2.frequency.setValueAtTime(110, audioContext.currentTime);
  oscillator2.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 1.5);
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
  
  oscillator1.connect(gainNode);
  oscillator2.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator1.start(audioContext.currentTime);
  oscillator2.start(audioContext.currentTime);
  oscillator1.stop(audioContext.currentTime + 2);
  oscillator2.stop(audioContext.currentTime + 2);
  
  // Kora-like tone
  const chime = audioContext.createOscillator();
  const chimeGain = audioContext.createGain();
  chime.type = 'sine';
  chime.frequency.setValueAtTime(440, audioContext.currentTime);
  chime.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 1);
  chimeGain.gain.setValueAtTime(0.15, audioContext.currentTime);
  chimeGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);
  chime.connect(chimeGain);
  chimeGain.connect(audioContext.destination);
  chime.start(audioContext.currentTime + 0.05);
  chime.stop(audioContext.currentTime + 1.5);
};

// Haptic vibration pattern
const triggerHapticFeedback = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 100, 150, 100, 300]);
  }
};

const RxPrescription = ({ track, onActivate }: RxPrescriptionProps) => {
  const [isActivated, setIsActivated] = useState(false);
  const rx = prescriptionData[track.row];

  if (!rx) return null;

  const handleActivate = () => {
    setIsActivated(true);
    
    try {
      playCeremonialSound();
    } catch (e) {
      console.log('Audio not available');
    }
    triggerHapticFeedback();
    
    onActivate();
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      style={{
        background: `linear-gradient(180deg, ${DOGON_COLORS.fermentedMud} 0%, ${DOGON_COLORS.ebonyBlack} 100%)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(232,220,200,0.05)',
      }}
    >
      {/* Mud cloth texture overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='mud'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23mud)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Woven fabric texture */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(232,220,200,0.1) 2px,
              rgba(232,220,200,0.1) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(232,220,200,0.1) 2px,
              rgba(232,220,200,0.1) 4px
            )
          `,
        }}
      />

      {/* Mud Cloth Border Patterns */}
      <MudClothBorder position="top" />
      <MudClothBorder position="bottom" />

      <div className="relative p-6 pt-12 pb-12">
        {/* Header with Kanaga Symbol */}
        <div className="flex items-start justify-between mb-5 border-b border-dashed pb-4" style={{ borderColor: `${DOGON_COLORS.paleStraw}20` }}>
          <div className="flex items-center gap-3">
            <KanagaSymbol color={track.colorHsl} />
            <div>
              <p 
                className="text-sm tracking-[0.12em] uppercase font-bold font-staatliches"
                style={{ 
                  color: DOGON_COLORS.paleStraw,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  letterSpacing: '0.15em',
                }}
              >
                SPIRIT INSTRUCTION
              </p>
              <p 
                className="text-xs tracking-wider uppercase mt-0.5 font-body"
                style={{ 
                  color: DOGON_COLORS.rustClay,
                }}
              >
                VICI ROYÀL
              </p>
            </div>
          </div>
          <div className="text-right">
            <p 
              className="text-[10px] uppercase tracking-widest"
              style={{ color: `${DOGON_COLORS.paleStraw}50` }}
            >
              TRACK {String(track.row).padStart(2, '0')}
            </p>
              <p 
                className="text-xs mt-0.5 font-semibold font-body"
                style={{ 
                  color: `hsl(${track.colorHsl})`,
                }}
              >
              {track.frequency}
            </p>
          </div>
        </div>

        {/* Track Name */}
        <div className="mb-4">
          <p 
            className="text-lg font-bold font-display"
            style={{ 
              color: DOGON_COLORS.paleStraw,
              textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
            }}
          >
            {track.track}
          </p>
        </div>

        {/* Sacred Instruction Details - Mud Cloth Panel */}
        <div 
          className="rounded-lg p-4 mb-5 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${DOGON_COLORS.mudBrown} 0%, ${DOGON_COLORS.fermentedMud} 100%)`,
            border: `1px solid ${DOGON_COLORS.paleStraw}15`,
          }}
        >
          {/* Geometric pattern decorations */}
          <div className="absolute top-2 right-2 opacity-30">
            <MudClothPattern variant={track.row % 4} />
          </div>
          <div className="absolute bottom-2 left-2 opacity-20">
            <MudClothPattern variant={(track.row + 2) % 4} />
          </div>

          {/* Spirit Action */}
          <div className="mb-4 relative z-10">
            <p 
              className="text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ color: DOGON_COLORS.rustClay }}
            >
              ◆ SACRED ACTION
            </p>
            <p 
              className="text-base font-bold"
              style={{ 
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: DOGON_COLORS.paleStraw,
                textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
              }}
            >
              {rx.action}
            </p>
          </div>

          {/* Earth Medicine Dosage */}
          <div className="mb-4 relative z-10">
            <p 
              className="text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ color: DOGON_COLORS.rustClay }}
            >
              ◆ EARTH MEDICINE
            </p>
            <p 
              className="text-sm sirius-text"
              style={{ 
                color: `${DOGON_COLORS.paleStraw}e6`,
              }}
            >
              {rx.dosage}
            </p>
          </div>

          {/* Spirit Journey Instructions */}
          <div className="relative z-10">
            <p 
              className="text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ color: DOGON_COLORS.rustClay }}
            >
              ◆ THE RITUAL
            </p>
            <p 
              className="text-sm leading-relaxed italic sirius-text"
              style={{ 
                color: `${DOGON_COLORS.paleStraw}cc`,
              }}
            >
              "{rx.instruction}"
            </p>
          </div>
        </div>

        {/* Decorative geometric divider */}
        <div className="flex justify-center items-center gap-3 mb-5">
          <div 
            className="h-px flex-1"
            style={{ background: `linear-gradient(to right, transparent, ${DOGON_COLORS.rustClay}40, transparent)` }}
          />
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path 
              d="M12 2 L22 12 L12 22 L2 12 Z" 
              fill="none" 
              stroke={DOGON_COLORS.rustClay} 
              strokeWidth="1.5"
              opacity="0.6"
            />
            <rect 
              x="9" 
              y="9" 
              width="6" 
              height="6" 
              fill={`hsl(${track.colorHsl})`}
              opacity="0.8"
            />
          </svg>
          <div 
            className="h-px flex-1"
            style={{ background: `linear-gradient(to left, transparent, ${DOGON_COLORS.rustClay}40, transparent)` }}
          />
        </div>

        {/* Ritual Activation Button - Carved Wood Style */}
        <motion.button
          className="w-full py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase transition-all duration-300 relative overflow-hidden"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            background: isActivated 
              ? `linear-gradient(135deg, hsl(${track.colorHsl}), hsl(${track.colorHsl} / 0.7))`
              : `linear-gradient(180deg, ${DOGON_COLORS.mudBrown} 0%, ${DOGON_COLORS.ebonyBlack} 100%)`,
            color: DOGON_COLORS.paleStraw,
            border: `2px solid ${isActivated ? `hsl(${track.colorHsl} / 0.5)` : DOGON_COLORS.rustClay}40`,
            boxShadow: isActivated 
              ? `0 4px 20px hsl(${track.colorHsl} / 0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
              : '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleActivate}
          disabled={isActivated}
        >
          {/* Wood grain texture */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 3px,
                  rgba(0,0,0,0.1) 3px,
                  rgba(0,0,0,0.1) 6px
                )
              `,
            }}
          />
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isActivated ? (
              <>
                <span>◆</span> RITUAL ACTIVATED <span>◆</span>
              </>
            ) : (
              <>
                <span>◇</span> INITIATE RITUAL (BEGIN TRACK)
              </>
            )}
          </span>
        </motion.button>

        {/* Sacred footer text */}
        <p 
          className="text-center text-[9px] mt-3 uppercase tracking-widest"
          style={{ color: `${DOGON_COLORS.paleStraw}40` }}
        >
          ◆ Earth Medicine from the Granary ◆
        </p>
      </div>

      {/* Corner geometric carvings */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div 
          key={corner}
          className={`absolute w-6 h-6 ${
            corner === 'top-left' ? 'top-9 left-3' :
            corner === 'top-right' ? 'top-9 right-3' :
            corner === 'bottom-left' ? 'bottom-9 left-3' :
            'bottom-9 right-3'
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d={
                corner === 'top-left' ? 'M4 12 L12 4 L12 12 Z' :
                corner === 'top-right' ? 'M20 12 L12 4 L12 12 Z' :
                corner === 'bottom-left' ? 'M4 12 L12 20 L12 12 Z' :
                'M20 12 L12 20 L12 12 Z'
              }
              fill={DOGON_COLORS.rustClay}
              opacity="0.3"
            />
          </svg>
        </div>
      ))}
    </motion.div>
  );
};

export default RxPrescription;
