import { motion } from 'framer-motion';
import { Hammer, Droplets, Sun, Heart, Music, Eye, Sparkles } from 'lucide-react';

/**
 * GUARDIAN CHARACTERS - The AgroMajic Mascots
 * 
 * Each character guides children through their respective zone
 * with playful missions and simplified science.
 */

export interface GuardianCharacter {
  id: string;
  name: string;
  title: string;
  zone: number;
  color: string;
  missionTitle: string;
  adultTopic: string;
  description: string;
  catchphrase: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  missions: Mission[];
}

export interface Mission {
  id: string;
  task: string;
  action: string;
  reward: string;
  badgeEmoji: string;
}

// Icon components for each guardian
const RockyIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    <motion.g
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Rock body */}
      <ellipse cx="32" cy="40" rx="20" ry="16" fill="hsl(30 40% 35%)" />
      <ellipse cx="32" cy="38" rx="18" ry="14" fill="hsl(30 50% 45%)" />
      {/* Face */}
      <circle cx="26" cy="36" r="3" fill="hsl(30 20% 20%)" />
      <circle cx="38" cy="36" r="3" fill="hsl(30 20% 20%)" />
      <path d="M28 44 Q32 48 36 44" stroke="hsl(30 20% 20%)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Hard hat */}
      <ellipse cx="32" cy="28" rx="16" ry="8" fill="hsl(45 90% 55%)" />
      <rect x="18" y="24" width="28" height="6" fill="hsl(45 90% 55%)" rx="2" />
    </motion.g>
  </svg>
);

const RiverIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    <motion.g
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {/* Water drop body */}
      <path d="M32 10 Q48 28 48 40 Q48 54 32 54 Q16 54 16 40 Q16 28 32 10 Z" fill="hsl(195 70% 55%)" />
      <path d="M32 14 Q44 28 44 38 Q44 50 32 50 Q20 50 20 38 Q20 28 32 14 Z" fill="hsl(195 80% 65%)" />
      {/* Face */}
      <circle cx="26" cy="38" r="2.5" fill="hsl(195 30% 25%)" />
      <circle cx="38" cy="38" r="2.5" fill="hsl(195 30% 25%)" />
      <path d="M28 46 Q32 50 36 46" stroke="hsl(195 30% 25%)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Sparkle */}
      <circle cx="24" cy="26" r="3" fill="white" opacity="0.6" />
    </motion.g>
  </svg>
);

const SunnyIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    <motion.g
      animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.line
          key={i}
          x1="32" y1="8"
          x2="32" y2="14"
          stroke="hsl(45 100% 60%)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transformOrigin: '32px 32px', transform: `rotate(${angle}deg)` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
      {/* Sun body */}
      <circle cx="32" cy="32" r="14" fill="hsl(45 100% 55%)" />
      <circle cx="32" cy="32" r="12" fill="hsl(40 100% 65%)" />
      {/* Face */}
      <circle cx="27" cy="30" r="2" fill="hsl(30 80% 30%)" />
      <circle cx="37" cy="30" r="2" fill="hsl(30 80% 30%)" />
      <path d="M26 36 Q32 42 38 36" stroke="hsl(30 80% 30%)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </motion.g>
  </svg>
);

const LoveyIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    <motion.g
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      {/* Dragon body */}
      <ellipse cx="32" cy="38" rx="18" ry="14" fill="hsl(340 60% 50%)" />
      <ellipse cx="32" cy="36" rx="16" ry="12" fill="hsl(340 70% 60%)" />
      {/* Wings */}
      <path d="M14 30 Q8 20 18 28" fill="hsl(340 50% 45%)" />
      <path d="M50 30 Q56 20 46 28" fill="hsl(340 50% 45%)" />
      {/* Face */}
      <circle cx="26" cy="34" r="2.5" fill="hsl(340 30% 25%)" />
      <circle cx="38" cy="34" r="2.5" fill="hsl(340 30% 25%)" />
      <path d="M28 42 Q32 46 36 42" stroke="hsl(340 30% 25%)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Heart on chest */}
      <path d="M32 44 L30 42 Q28 40 30 38 Q32 36 32 38 Q32 36 34 38 Q36 40 34 42 Z" fill="hsl(0 80% 65%)" />
      {/* Little horns */}
      <path d="M24 24 L22 18 L26 22" fill="hsl(340 60% 50%)" />
      <path d="M40 24 L42 18 L38 22" fill="hsl(340 60% 50%)" />
    </motion.g>
  </svg>
);

const StarryIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    <motion.g
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      {/* Star body */}
      <path 
        d="M32 8 L36 24 L52 24 L40 34 L44 50 L32 40 L20 50 L24 34 L12 24 L28 24 Z" 
        fill="hsl(280 70% 60%)" 
      />
      <path 
        d="M32 12 L35 24 L48 24 L38 32 L41 46 L32 38 L23 46 L26 32 L16 24 L29 24 Z" 
        fill="hsl(280 80% 70%)" 
      />
      {/* Face */}
      <circle cx="28" cy="28" r="2" fill="hsl(280 30% 25%)" />
      <circle cx="36" cy="28" r="2" fill="hsl(280 30% 25%)" />
      <path d="M29 34 Q32 37 35 34" stroke="hsl(280 30% 25%)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Music notes */}
      <motion.text
        x="48" y="16"
        fontSize="10"
        fill="hsl(280 60% 70%)"
        animate={{ y: [16, 12, 16], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ♪
      </motion.text>
    </motion.g>
  </svg>
);

const SeerIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    <motion.g
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {/* Owl body */}
      <ellipse cx="32" cy="42" rx="16" ry="14" fill="hsl(35 40% 45%)" />
      <ellipse cx="32" cy="40" rx="14" ry="12" fill="hsl(35 50% 55%)" />
      {/* Big eyes */}
      <circle cx="25" cy="36" r="7" fill="white" />
      <circle cx="39" cy="36" r="7" fill="white" />
      <circle cx="25" cy="36" r="4" fill="hsl(35 30% 20%)" />
      <circle cx="39" cy="36" r="4" fill="hsl(35 30% 20%)" />
      <circle cx="26" cy="34" r="1.5" fill="white" />
      <circle cx="40" cy="34" r="1.5" fill="white" />
      {/* Beak */}
      <path d="M32 42 L30 46 L32 48 L34 46 Z" fill="hsl(30 70% 50%)" />
      {/* Ear tufts */}
      <path d="M20 28 L18 18 L24 26" fill="hsl(35 40% 45%)" />
      <path d="M44 28 L46 18 L40 26" fill="hsl(35 40% 45%)" />
      {/* Wings */}
      <ellipse cx="18" cy="44" rx="6" ry="10" fill="hsl(35 35% 40%)" />
      <ellipse cx="46" cy="44" rx="6" ry="10" fill="hsl(35 35% 40%)" />
    </motion.g>
  </svg>
);

const SpiritIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    <motion.g
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Dove body */}
      <ellipse cx="32" cy="36" rx="14" ry="10" fill="white" />
      <ellipse cx="32" cy="34" rx="12" ry="8" fill="hsl(0 0% 95%)" />
      {/* Head */}
      <circle cx="40" cy="28" r="8" fill="white" />
      <circle cx="40" cy="27" r="6" fill="hsl(0 0% 95%)" />
      {/* Eye */}
      <circle cx="42" cy="26" r="2" fill="hsl(0 0% 20%)" />
      {/* Beak */}
      <path d="M48 28 L54 30 L48 32" fill="hsl(40 70% 60%)" />
      {/* Wings */}
      <path d="M20 30 Q8 20 12 36 Q16 44 24 40" fill="white" />
      <path d="M22 32 Q12 24 14 36 Q17 42 23 39" fill="hsl(0 0% 95%)" />
      {/* Tail */}
      <path d="M18 36 Q10 38 8 44 Q12 42 20 40" fill="white" />
      {/* Olive branch */}
      <motion.path
        d="M52 32 Q58 34 60 38"
        stroke="hsl(120 50% 40%)"
        strokeWidth="1.5"
        fill="none"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '52px 32px' }}
      />
      <ellipse cx="58" cy="36" rx="3" ry="2" fill="hsl(120 50% 45%)" />
      {/* Sparkles */}
      <motion.circle
        cx="28" cy="24"
        r="2"
        fill="hsl(51 100% 70%)"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.g>
  </svg>
);

// The Guardian Characters data
export const guardianCharacters: GuardianCharacter[] = [
  {
    id: 'rocky',
    name: 'Rocky',
    title: 'The Builder',
    zone: 1,
    color: 'hsl(30 50% 45%)',
    missionTitle: 'Build the Bamboo Fort!',
    adultTopic: 'Plant Shelter / Structural Crops',
    description: 'Rocky loves to build things with sticks and stones! Help Rocky make homes for the worms.',
    catchphrase: '"Let\'s build something awesome!"',
    icon: RockyIcon,
    missions: [
      {
        id: 'rocky-1',
        task: 'Find a stick as tall as your knee',
        action: 'Poke 3 holes in the dirt to let the worms breathe',
        reward: 'Earth Badge',
        badgeEmoji: '🪨',
      },
      {
        id: 'rocky-2',
        task: 'Collect 5 fallen leaves',
        action: 'Make a cozy blanket for the soil bugs',
        reward: 'Leaf Keeper Badge',
        badgeEmoji: '🍂',
      },
      {
        id: 'rocky-3',
        task: 'Find a smooth stone',
        action: 'Place it near a plant as a "worm hotel sign"',
        reward: 'Stone Friend Badge',
        badgeEmoji: '🏠',
      },
    ],
  },
  {
    id: 'river',
    name: 'River',
    title: 'The Rower',
    zone: 2,
    color: 'hsl(195 70% 55%)',
    missionTitle: 'Make the Water Dance!',
    adultTopic: 'Hydration Dynamics / Water Retention',
    description: 'River flows through the garden bringing life to every plant! Help River find the thirsty spots.',
    catchphrase: '"Splish splash, let\'s make the garden laugh!"',
    icon: RiverIcon,
    missions: [
      {
        id: 'river-1',
        task: 'Find the driest spot in the garden',
        action: 'Give it a gentle drink of water',
        reward: 'Rain Dancer Badge',
        badgeEmoji: '💧',
      },
      {
        id: 'river-2',
        task: 'Look for a puddle or wet area',
        action: 'Draw the shape in your journal',
        reward: 'Puddle Spotter Badge',
        badgeEmoji: '🌊',
      },
      {
        id: 'river-3',
        task: 'Touch the soil with your finger',
        action: 'Is it wet, damp, or dry? Write it down!',
        reward: 'Soil Feeler Badge',
        badgeEmoji: '✋',
      },
    ],
  },
  {
    id: 'sunny',
    name: 'Sunny',
    title: 'The Spark',
    zone: 3,
    color: 'hsl(45 100% 55%)',
    missionTitle: 'Catch the Sunbeams!',
    adultTopic: 'Photosynthesis / Light Energy',
    description: 'Sunny brings warm rays to help plants grow tall! Help Sunny find where the sun likes to play.',
    catchphrase: '"Shine bright like the sun!"',
    icon: SunnyIcon,
    missions: [
      {
        id: 'sunny-1',
        task: 'Find the sunniest spot in the garden',
        action: 'Stand there and count to 10 with your eyes closed',
        reward: 'Sunshine Catcher Badge',
        badgeEmoji: '☀️',
      },
      {
        id: 'sunny-2',
        task: 'Look for a shadow',
        action: 'Draw where the sun and shadow meet',
        reward: 'Shadow Tracker Badge',
        badgeEmoji: '🌤️',
      },
      {
        id: 'sunny-3',
        task: 'Find a plant reaching toward light',
        action: 'Give it a gentle "good job" pat',
        reward: 'Plant Cheerleader Badge',
        badgeEmoji: '🌱',
      },
    ],
  },
  {
    id: 'lovey',
    name: 'Lovey',
    title: 'The Dragon',
    zone: 4,
    color: 'hsl(340 70% 55%)',
    missionTitle: 'Listen to the Green Hearts!',
    adultTopic: 'Plant Communication / Mycelial Networks',
    description: 'Lovey has a special heart that can feel what plants are feeling! Help Lovey send love to the garden.',
    catchphrase: '"Plants have feelings too!"',
    icon: LoveyIcon,
    missions: [
      {
        id: 'lovey-1',
        task: 'Find a plant that looks happy',
        action: 'Tell it 3 nice things',
        reward: 'Plant Whisperer Badge',
        badgeEmoji: '💚',
      },
      {
        id: 'lovey-2',
        task: 'Find a plant that looks droopy',
        action: 'Ask it what it needs (water? sun? friends?)',
        reward: 'Plant Doctor Badge',
        badgeEmoji: '🩺',
      },
      {
        id: 'lovey-3',
        task: 'Hug a tree (gently!)',
        action: 'Close your eyes and listen for 20 seconds',
        reward: 'Tree Hugger Badge',
        badgeEmoji: '🌳',
      },
    ],
  },
  {
    id: 'starry',
    name: 'Starry',
    title: 'The Singer',
    zone: 5,
    color: 'hsl(280 70% 60%)',
    missionTitle: 'Sing to the Seeds!',
    adultTopic: 'Sonic Bloom / Frequency Healing',
    description: 'Starry knows that plants love music! Help Starry make beautiful sounds for the garden.',
    catchphrase: '"La la la! The garden loves to dance!"',
    icon: StarryIcon,
    missions: [
      {
        id: 'starry-1',
        task: 'Hum your favorite song to a plant',
        action: 'Watch if the leaves wiggle!',
        reward: 'Garden Singer Badge',
        badgeEmoji: '🎵',
      },
      {
        id: 'starry-2',
        task: 'Clap a rhythm near the soil',
        action: 'The worms are dancing underground!',
        reward: 'Worm DJ Badge',
        badgeEmoji: '🪱',
      },
      {
        id: 'starry-3',
        task: 'Listen very quietly for 30 seconds',
        action: 'What garden sounds did you hear?',
        reward: 'Sound Hunter Badge',
        badgeEmoji: '👂',
      },
    ],
  },
  {
    id: 'seer',
    name: 'Seer',
    title: 'The Owl',
    zone: 6,
    color: 'hsl(35 50% 50%)',
    missionTitle: 'Find the Hidden Bugs!',
    adultTopic: 'Pest Management / Beneficial Insects',
    description: 'Seer has the biggest eyes and can spot tiny bugs everywhere! Help Seer protect the good bugs.',
    catchphrase: '"Whoo whoo! I spy something tiny!"',
    icon: SeerIcon,
    missions: [
      {
        id: 'seer-1',
        task: 'Find a bug in the garden',
        action: 'Draw it in your journal (don\'t touch!)',
        reward: 'Bug Spotter Badge',
        badgeEmoji: '🐛',
      },
      {
        id: 'seer-2',
        task: 'Look under a leaf',
        action: 'What\'s hiding there?',
        reward: 'Leaf Detective Badge',
        badgeEmoji: '🔍',
      },
      {
        id: 'seer-3',
        task: 'Find a spider web',
        action: 'The spider is a garden helper! Say thank you.',
        reward: 'Web Finder Badge',
        badgeEmoji: '🕸️',
      },
    ],
  },
  {
    id: 'spirit',
    name: 'Spirit',
    title: 'The Dove',
    zone: 7,
    color: 'hsl(0 0% 90%)',
    missionTitle: 'Taste the Rainbow!',
    adultTopic: 'Brix Testing / Nutrient Density',
    description: 'Spirit knows that the yummiest foods come from happy plants! Help Spirit find the sweetest treasures.',
    catchphrase: '"Peaceful gardens grow the tastiest food!"',
    icon: SpiritIcon,
    missions: [
      {
        id: 'spirit-1',
        task: 'Find something edible in the garden',
        action: 'Taste it! Is it sweet, sour, or bitter?',
        reward: 'Taste Tester Badge',
        badgeEmoji: '😋',
      },
      {
        id: 'spirit-2',
        task: 'Find 3 different colors of food',
        action: 'The more colors, the more magic!',
        reward: 'Rainbow Hunter Badge',
        badgeEmoji: '🌈',
      },
      {
        id: 'spirit-3',
        task: 'Thank the plant before you pick',
        action: 'Gratitude makes food taste better!',
        reward: 'Grateful Gardener Badge',
        badgeEmoji: '🙏',
      },
    ],
  },
];

export const getGuardianByZone = (zone: number): GuardianCharacter | undefined => {
  return guardianCharacters.find(g => g.zone === zone);
};

export default guardianCharacters;
