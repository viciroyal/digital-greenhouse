import { motion } from 'framer-motion';
import { useState } from 'react';
import type { TrackData } from '@/data/trackData';

interface RxPrescriptionProps {
  track: TrackData;
  onActivate: () => void;
}

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

// Dreaming Spiral Symbol with animation
const DreamingSpiral = ({ color }: { color: string }) => (
  <motion.div
    animate={{
      rotate: [0, 360],
      scale: [1, 1.05, 1],
    }}
    transition={{
      rotate: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
      scale: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }}
  >
    <svg viewBox="0 0 60 60" className="w-14 h-14">
      {/* Outer dot ring */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = 30 + Math.cos(angle) * 26;
        const y = 30 + Math.sin(angle) * 26;
        return <circle key={`outer-${i}`} cx={x} cy={y} r="2" fill="#eaddca" opacity="0.7" />;
      })}
      
      {/* Inner dot ring */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.2;
        const x = 30 + Math.cos(angle) * 18;
        const y = 30 + Math.sin(angle) * 18;
        return <circle key={`inner-${i}`} cx={x} cy={y} r="1.5" fill="#d4a24e" opacity="0.8" />;
      })}
      
      {/* Spiral path */}
      <path
        d="M30 30 
           C 30 26, 34 26, 34 30
           C 34 36, 26 36, 26 30
           C 26 22, 38 22, 38 30
           C 38 40, 22 40, 22 30
           C 22 18, 42 18, 42 30
           C 42 44, 18 44, 18 30"
        fill="none"
        stroke="#eaddca"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Center dot - The Source with glow */}
      <motion.circle 
        cx="30" 
        cy="30" 
        r="4" 
        fill={`hsl(${color})`}
        animate={{
          opacity: [0.8, 1, 0.8],
          r: [4, 4.5, 4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <circle cx="30" cy="30" r="2" fill="#eaddca" />
    </svg>
  </motion.div>
);

// Dot painting border pattern
const DotBorder = ({ position }: { position: 'top' | 'bottom' | 'left' | 'right' }) => {
  const isHorizontal = position === 'top' || position === 'bottom';
  const dotCount = isHorizontal ? 20 : 12;
  
  return (
    <div 
      className={`absolute ${
        position === 'top' ? 'top-2 left-4 right-4' :
        position === 'bottom' ? 'bottom-2 left-4 right-4' :
        position === 'left' ? 'left-2 top-4 bottom-4' :
        'right-2 top-4 bottom-4'
      } flex ${isHorizontal ? 'flex-row justify-between' : 'flex-col justify-between'}`}
    >
      {[...Array(dotCount)].map((_, i) => (
        <div key={i} className="flex gap-0.5">
          <div 
            className="w-1.5 h-1.5 rounded-full"
            style={{ 
              backgroundColor: i % 3 === 0 ? '#d4a24e' : '#eaddca',
              opacity: 0.6 + (i % 2) * 0.2,
            }}
          />
          {i % 4 === 0 && (
            <div 
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: '#9c3c1a', opacity: 0.5 }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Ceremonial sound generator using Web Audio API
const playCeremonialSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create a deep resonant drone
  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Deep earth tone
  oscillator1.type = 'sine';
  oscillator1.frequency.setValueAtTime(60, audioContext.currentTime);
  oscillator1.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 1.5);
  
  // Harmonic overtone
  oscillator2.type = 'triangle';
  oscillator2.frequency.setValueAtTime(120, audioContext.currentTime);
  oscillator2.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 1.5);
  
  // Fade envelope
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
  
  // Add a brief chime/bell tone
  const chime = audioContext.createOscillator();
  const chimeGain = audioContext.createGain();
  chime.type = 'sine';
  chime.frequency.setValueAtTime(528, audioContext.currentTime); // 528Hz - healing frequency
  chime.frequency.exponentialRampToValueAtTime(264, audioContext.currentTime + 1);
  chimeGain.gain.setValueAtTime(0.15, audioContext.currentTime);
  chimeGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);
  chime.connect(chimeGain);
  chimeGain.connect(audioContext.destination);
  chime.start(audioContext.currentTime + 0.05);
  chime.stop(audioContext.currentTime + 1.5);
};

// Haptic vibration pattern for ritual initiation
const triggerHapticFeedback = () => {
  if ('vibrate' in navigator) {
    // Pattern: short pulse, pause, longer resonance
    navigator.vibrate([50, 100, 150, 100, 300]);
  }
};

const RxPrescription = ({ track, onActivate }: RxPrescriptionProps) => {
  const [isActivated, setIsActivated] = useState(false);
  const rx = prescriptionData[track.row];

  if (!rx) return null;

  const handleActivate = () => {
    setIsActivated(true);
    
    // Trigger ceremonial effects
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
        background: `
          linear-gradient(135deg, #9c3c1a 0%, #6d3319 40%, #4e342e 100%)
        `,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(234,221,202,0.1)',
      }}
    >
      {/* Bark/Hide texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='bark'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23bark)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Crack/fiber texture */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.3) 45%, transparent 50%),
            linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.2) 45%, transparent 50%)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Earth stain effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(78, 52, 46, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(156, 60, 26, 0.3) 0%, transparent 40%)
          `,
        }}
      />

      {/* Dot painting borders */}
      <DotBorder position="top" />
      <DotBorder position="bottom" />
      <DotBorder position="left" />
      <DotBorder position="right" />

      {/* Torn edge effect - top */}
      <div 
        className="absolute top-0 left-0 right-0 h-3 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(78,52,46,0.8), transparent)',
          maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0 Q5 8 10 2 T20 3 T30 1 T40 4 T50 2 T60 5 T70 1 T80 3 T90 2 T100 4 L100 10 L0 10 Z\' fill=\'white\'/%3E%3C/svg%3E")',
          WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0 Q5 8 10 2 T20 3 T30 1 T40 4 T50 2 T60 5 T70 1 T80 3 T90 2 T100 4 L100 10 L0 10 Z\' fill=\'white\'/%3E%3C/svg%3E")',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
      />

      <div className="relative p-6 pt-8">
        {/* Header with Dreaming Spiral */}
        <div className="flex items-start justify-between mb-5 border-b border-dashed pb-4" style={{ borderColor: 'rgba(234,221,202,0.2)' }}>
          <div className="flex items-center gap-3">
            <DreamingSpiral color={track.colorHsl} />
            <div>
              <p 
                className="text-sm tracking-[0.12em] uppercase font-bold"
                style={{ 
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: '#eaddca',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  letterSpacing: '0.15em',
                }}
              >
                SPIRIT INSTRUCTION
              </p>
              <p 
                className="text-xs tracking-wider uppercase mt-0.5"
                style={{ 
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: '#d4a24e',
                }}
              >
                VICI ROYÀL
              </p>
            </div>
          </div>
          <div className="text-right">
            <p 
              className="text-[10px] uppercase tracking-widest"
              style={{ color: 'rgba(234,221,202,0.5)' }}
            >
              TRACK {String(track.row).padStart(2, '0')}
            </p>
            <p 
              className="text-xs mt-0.5 font-semibold"
              style={{ 
                fontFamily: "'Cormorant Garamond', Georgia, serif",
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
            className="text-lg font-bold"
            style={{ 
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: '#eaddca',
              textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
            }}
          >
            {track.track}
          </p>
        </div>

        {/* Sacred Instruction Details */}
        <div 
          className="rounded-lg p-4 mb-5"
          style={{ 
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(234,221,202,0.15)',
          }}
        >
          {/* Spirit Action */}
          <div className="mb-4">
            <p 
              className="text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ color: '#d4a24e' }}
            >
              ◈ SACRED ACTION
            </p>
            <p 
              className="text-base font-bold"
              style={{ 
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: '#eaddca',
                textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
              }}
            >
              {rx.action}
            </p>
          </div>

          {/* Earth Medicine Dosage */}
          <div className="mb-4">
            <p 
              className="text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ color: '#d4a24e' }}
            >
              ◈ EARTH MEDICINE
            </p>
            <p 
              className="text-sm"
              style={{ 
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: 'rgba(234,221,202,0.9)',
              }}
            >
              {rx.dosage}
            </p>
          </div>

          {/* Spirit Journey Instructions */}
          <div>
            <p 
              className="text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ color: '#d4a24e' }}
            >
              ◈ THE DREAMING
            </p>
            <p 
              className="text-sm leading-relaxed italic"
              style={{ 
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: 'rgba(234,221,202,0.8)',
              }}
            >
              "{rx.instruction}"
            </p>
          </div>
        </div>

        {/* Decorative dot divider */}
        <div className="flex justify-center gap-2 mb-5">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i}
              className="rounded-full"
              style={{
                width: i === 3 ? '8px' : '4px',
                height: i === 3 ? '8px' : '4px',
                backgroundColor: i === 3 ? `hsl(${track.colorHsl})` : '#d4a24e',
                opacity: 0.7 + (i === 3 ? 0.3 : 0),
              }}
            />
          ))}
        </div>

        {/* Ritual Activation Button - Carved Stone Style */}
        <motion.button
          className="w-full py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase transition-all duration-300 relative overflow-hidden"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            background: isActivated 
              ? `linear-gradient(135deg, hsl(${track.colorHsl}), hsl(${track.colorHsl} / 0.7))`
              : 'linear-gradient(135deg, #5d4e3c 0%, #3d3229 50%, #2a2420 100%)',
            color: '#eaddca',
            border: '1px solid rgba(234,221,202,0.2)',
            boxShadow: isActivated 
              ? `0 4px 20px hsl(${track.colorHsl} / 0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
              : '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.3)',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleActivate}
          disabled={isActivated}
        >
          {/* Stone texture overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='stone'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.1' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23stone)'/%3E%3C/svg%3E")`,
            }}
          />
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isActivated ? (
              <>
                <span>✧</span> RITUAL ACTIVATED <span>✧</span>
              </>
            ) : (
              <>
                <span>◎</span> INITIATE RITUAL (BEGIN TRACK)
              </>
            )}
          </span>
        </motion.button>

        {/* Sacred footer text */}
        <p 
          className="text-center text-[9px] mt-3 uppercase tracking-widest"
          style={{ color: 'rgba(234,221,202,0.4)' }}
        >
          ✦ Earth Medicine for the Spirit ✦
        </p>
      </div>

      {/* Corner dot accents */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div 
          key={corner}
          className={`absolute w-6 h-6 ${
            corner === 'top-left' ? 'top-3 left-3' :
            corner === 'top-right' ? 'top-3 right-3' :
            corner === 'bottom-left' ? 'bottom-3 left-3' :
            'bottom-3 right-3'
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#d4a24e', opacity: 0.4 }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#eaddca', opacity: 0.6 }} />
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default RxPrescription;
