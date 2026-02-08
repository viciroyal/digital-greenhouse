import { motion } from 'framer-motion';

/**
 * ORISHA GUARDIAN ICONS
 * 
 * Afro-Indigenous Futurism iconography for the four levels:
 * - OGUN: Lord of Iron & Labor (Level 1)
 * - BABALU AYE: Lord of Earth & Compost (Level 2)
 * - SHANGO: Lord of Lightning & Fire (Level 3)
 * - OSHUN: Lady of Sweet Waters (Level 4)
 */

interface OrishaIconProps {
  className?: string;
  animated?: boolean;
}

// LEVEL 1: OGUN - Iron Chain / Machete Icon
export const OgunIcon = ({ className = "", animated = true }: OrishaIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="ironGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A4A4A" />
        <stop offset="50%" stopColor="#6B6B6B" />
        <stop offset="100%" stopColor="#3D3D3D" />
      </linearGradient>
      <linearGradient id="redClayGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#8B0000" />
        <stop offset="100%" stopColor="#CD5C5C" />
      </linearGradient>
      <filter id="ironGlow">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    {/* Machete blade */}
    <motion.path
      d="M12 48 L28 12 L32 10 L36 12 L20 52 L12 48 Z"
      fill="url(#ironGradient)"
      stroke="#8B0000"
      strokeWidth="1"
      filter="url(#ironGlow)"
      animate={animated ? { opacity: [0.8, 1, 0.8] } : undefined}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Handle */}
    <rect x="18" y="48" width="8" height="12" rx="2" fill="#5D4037" />
    <rect x="20" y="50" width="4" height="8" fill="#3E2723" />
    
    {/* Iron chain links */}
    <motion.g
      animate={animated ? { opacity: [0.6, 1, 0.6] } : undefined}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <ellipse cx="44" cy="20" rx="6" ry="4" stroke="#6B6B6B" strokeWidth="2" fill="none" />
      <ellipse cx="50" cy="28" rx="6" ry="4" stroke="#6B6B6B" strokeWidth="2" fill="none" transform="rotate(45 50 28)" />
      <ellipse cx="52" cy="38" rx="6" ry="4" stroke="#6B6B6B" strokeWidth="2" fill="none" />
    </motion.g>
    
    {/* Red clay base */}
    <ellipse cx="32" cy="60" rx="20" ry="4" fill="url(#redClayGradient)" opacity="0.5" />
  </svg>
);

// LEVEL 2: BABALU AYE - Grain Skep / Earth Healer Icon
export const BabaluAyeIcon = ({ className = "", animated = true }: OrishaIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="stoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5D4E37" />
        <stop offset="50%" stopColor="#8B7355" />
        <stop offset="100%" stopColor="#4A3C2A" />
      </linearGradient>
      <linearGradient id="compostGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#2D1F14" />
        <stop offset="50%" stopColor="#4A3728" />
        <stop offset="100%" stopColor="#5D4037" />
      </linearGradient>
      <filter id="earthGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    {/* Grain Skep (beehive shape) */}
    <motion.path
      d="M32 8 
         Q 48 12, 52 24
         Q 54 36, 48 46
         Q 44 54, 32 56
         Q 20 54, 16 46
         Q 10 36, 12 24
         Q 16 12, 32 8 Z"
      fill="url(#stoneGradient)"
      stroke="#8B7355"
      strokeWidth="1.5"
      animate={animated ? { scale: [1, 1.02, 1] } : undefined}
      transition={{ duration: 3, repeat: Infinity }}
    />
    
    {/* Woven texture lines */}
    <g stroke="#6B5344" strokeWidth="0.5" opacity="0.6">
      <path d="M18 20 Q 32 18, 46 20" fill="none" />
      <path d="M15 28 Q 32 26, 49 28" fill="none" />
      <path d="M14 36 Q 32 34, 50 36" fill="none" />
      <path d="M16 44 Q 32 42, 48 44" fill="none" />
    </g>
    
    {/* Entrance hole */}
    <ellipse cx="32" cy="48" rx="6" ry="4" fill="#2D1F14" />
    
    {/* Healing particles rising */}
    <motion.g
      animate={animated ? { 
        y: [0, -5, 0],
        opacity: [0.4, 0.8, 0.4],
      } : undefined}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      <circle cx="26" cy="6" r="2" fill="#8BC34A" opacity="0.6" />
      <circle cx="38" cy="4" r="1.5" fill="#4CAF50" opacity="0.5" />
      <circle cx="32" cy="2" r="1" fill="#8BC34A" opacity="0.7" />
    </motion.g>
    
    {/* Compost base */}
    <ellipse cx="32" cy="58" rx="18" ry="4" fill="url(#compostGradient)" opacity="0.6" />
  </svg>
);

// LEVEL 3: SHANGO - Double Axe (Oshe) / Thunder Icon
export const ShangoIcon = ({ className = "", animated = true }: OrishaIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="copperGradientShango" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B87333" />
        <stop offset="50%" stopColor="#DA8B47" />
        <stop offset="100%" stopColor="#8B5A2B" />
      </linearGradient>
      <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FFFF" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FF4500" />
      </linearGradient>
      <filter id="thunderGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    {/* Handle */}
    <rect x="30" y="24" width="4" height="36" rx="2" fill="#5D4037" />
    
    {/* Double Axe Heads (Oshe Shango) */}
    <motion.g
      animate={animated ? { 
        filter: ['drop-shadow(0 0 3px #FF4500)', 'drop-shadow(0 0 8px #FFD700)', 'drop-shadow(0 0 3px #FF4500)']
      } : undefined}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {/* Left axe head */}
      <path
        d="M32 8 L12 18 L16 26 L32 20 Z"
        fill="url(#copperGradientShango)"
        stroke="#8B5A2B"
        strokeWidth="1"
      />
      {/* Right axe head */}
      <path
        d="M32 8 L52 18 L48 26 L32 20 Z"
        fill="url(#copperGradientShango)"
        stroke="#8B5A2B"
        strokeWidth="1"
      />
    </motion.g>
    
    {/* Lightning bolt */}
    <motion.path
      d="M32 2 L28 10 L34 12 L30 22"
      stroke="url(#lightningGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      filter="url(#thunderGlow)"
      animate={animated ? {
        opacity: [0.5, 1, 0.5],
        pathLength: [0.7, 1, 0.7],
      } : undefined}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
    
    {/* Electric sparks */}
    <motion.g
      animate={animated ? { opacity: [0, 1, 0] } : undefined}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
    >
      <circle cx="24" cy="12" r="1.5" fill="#00FFFF" filter="url(#thunderGlow)" />
      <circle cx="40" cy="14" r="1" fill="#FFD700" filter="url(#thunderGlow)" />
    </motion.g>
    
    {/* Fire base */}
    <motion.ellipse
      cx="32"
      cy="60"
      rx="14"
      ry="4"
      fill="#FF4500"
      opacity="0.4"
      animate={animated ? { opacity: [0.3, 0.5, 0.3] } : undefined}
      transition={{ duration: 1, repeat: Infinity }}
    />
  </svg>
);

// LEVEL 4: OSHUN - Brass Mirror / Sweet Waters Icon
export const OshunIcon = ({ className = "", animated = true }: OrishaIconProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="50%" stopColor="#FFF8DC" />
        <stop offset="100%" stopColor="#DAA520" />
      </linearGradient>
      <linearGradient id="honeyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
      <radialGradient id="mirrorReflection" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFFACD" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </radialGradient>
      <filter id="goldGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    {/* Mirror frame */}
    <motion.circle
      cx="32"
      cy="28"
      r="22"
      fill="none"
      stroke="url(#goldGradient)"
      strokeWidth="4"
      filter="url(#goldGlow)"
      animate={animated ? {
        filter: ['drop-shadow(0 0 5px #FFD700)', 'drop-shadow(0 0 15px #FFD700)', 'drop-shadow(0 0 5px #FFD700)']
      } : undefined}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Mirror surface */}
    <circle cx="32" cy="28" r="18" fill="url(#mirrorReflection)" />
    
    {/* Reflection highlight */}
    <ellipse cx="26" cy="22" rx="6" ry="4" fill="#FFFACD" opacity="0.6" />
    
    {/* Handle */}
    <rect x="29" y="48" width="6" height="14" rx="2" fill="url(#goldGradient)" />
    
    {/* Decorative patterns on handle */}
    <g fill="#B8860B">
      <circle cx="32" cy="52" r="1" />
      <circle cx="32" cy="56" r="1" />
      <circle cx="32" cy="60" r="1" />
    </g>
    
    {/* Honey drops */}
    <motion.g
      animate={animated ? {
        y: [0, 3, 0],
        opacity: [0.6, 1, 0.6],
      } : undefined}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <path
        d="M22 44 Q 20 48, 22 52 Q 24 48, 22 44"
        fill="url(#honeyGradient)"
        opacity="0.8"
      />
      <path
        d="M42 46 Q 40 50, 42 54 Q 44 50, 42 46"
        fill="url(#honeyGradient)"
        opacity="0.7"
      />
    </motion.g>
    
    {/* Sweet water ripples */}
    <motion.ellipse
      cx="32"
      cy="62"
      rx="16"
      ry="2"
      stroke="#FFD700"
      strokeWidth="0.5"
      fill="none"
      opacity="0.5"
      animate={animated ? { rx: [14, 18, 14], opacity: [0.3, 0.6, 0.3] } : undefined}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

// Orisha Badge Component - Displayed when level is completed
interface OrishaBadgeProps {
  orisha: 'ogun' | 'babalu-aye' | 'shango' | 'oshun';
  isEarned: boolean;
  className?: string;
}

export const OrishaBadge = ({ orisha, isEarned, className = "" }: OrishaBadgeProps) => {
  const orishaData = {
    'ogun': {
      name: 'OGUN',
      title: 'Lord of Iron & Labor',
      blessing: 'BLESSED BY OGUN',
      color: '#CD5C5C',
      bgColor: '#8B0000',
      Icon: OgunIcon,
    },
    'babalu-aye': {
      name: 'BABALU AYE',
      title: 'Lord of Earth & Healing',
      blessing: 'BLESSED BY BABALU',
      color: '#8B7355',
      bgColor: '#4A3728',
      Icon: BabaluAyeIcon,
    },
    'shango': {
      name: 'SHANGO',
      title: 'Lord of Lightning & Fire',
      blessing: 'BLESSED BY SHANGO',
      color: '#FF4500',
      bgColor: '#8B2500',
      Icon: ShangoIcon,
    },
    'oshun': {
      name: 'OSHUN',
      title: 'Lady of Sweet Waters',
      blessing: 'BLESSED BY OSHUN',
      color: '#FFD700',
      bgColor: '#B8860B',
      Icon: OshunIcon,
    },
  };

  const data = orishaData[orisha];
  const Icon = data.Icon;

  return (
    <motion.div
      className={`flex items-center gap-3 p-3 rounded-xl ${className}`}
      style={{
        background: isEarned 
          ? `linear-gradient(135deg, ${data.bgColor}40, ${data.bgColor}20)`
          : 'hsl(0 0% 15%)',
        border: `2px solid ${isEarned ? data.color : 'hsl(0 0% 25%)'}`,
        opacity: isEarned ? 1 : 0.5,
        filter: isEarned ? 'none' : 'grayscale(100%)',
      }}
      whileHover={isEarned ? { scale: 1.02, boxShadow: `0 0 20px ${data.color}40` } : undefined}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: isEarned 
            ? `linear-gradient(135deg, ${data.bgColor}, ${data.color}40)`
            : 'hsl(0 0% 20%)',
        }}
      >
        <Icon className="w-8 h-8" animated={isEarned} />
      </div>
      <div>
        <p 
          className="text-sm font-mono"
          style={{ 
            fontFamily: "'Staatliches', sans-serif",
            color: isEarned ? data.color : 'hsl(0 0% 50%)',
            letterSpacing: '0.1em',
          }}
        >
          {data.name}
        </p>
        {isEarned && (
          <motion.p
            className="text-xs font-mono"
            style={{ color: data.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✦ {data.blessing} ✦
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default {
  OgunIcon,
  BabaluAyeIcon,
  ShangoIcon,
  OshunIcon,
  OrishaBadge,
};
