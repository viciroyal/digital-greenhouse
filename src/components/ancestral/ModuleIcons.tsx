import { motion } from 'framer-motion';

/**
 * Spiral Mound with Conch Shell - ROOT PROTOCOL
 * Muscogee & Maroons lineage
 */
export const SpiralMoundIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    {/* Mound base */}
    <motion.path
      d="M8 52 Q32 20, 56 52 L56 56 L8 56 Z"
      fill={color}
      fillOpacity="0.3"
    />
    {/* Spiral path on mound */}
    <motion.path
      d="M32 48 Q26 44, 28 38 Q30 32, 36 34 Q42 36, 40 42 Q38 48, 32 46 Q26 44, 30 38 Q34 32, 32 30"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      animate={{ pathLength: [0.5, 1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {/* Conch shell */}
    <motion.ellipse
      cx="32"
      cy="24"
      rx="10"
      ry="8"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <motion.path
      d="M24 24 Q28 20, 32 24 Q36 28, 40 24"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <motion.path
      d="M22 24 L20 20 M42 24 L44 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Kanaga Mask pointing to Sirius - STAR STRUCTURE
 * Dogon lineage
 */
export const KanagaMaskIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    {/* Kanaga mask base (lizard/man shape) */}
    <motion.path
      d="M32 16 L32 48"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Arms */}
    <motion.path
      d="M20 28 L32 28 L44 28"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Top arms pointing up (to stars) */}
    <motion.path
      d="M20 28 L16 20 M44 28 L48 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Bottom legs */}
    <motion.path
      d="M32 48 L24 56 M32 48 L40 56"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Head circle */}
    <motion.circle
      cx="32"
      cy="12"
      r="4"
      fill={color}
    />
    {/* Sirius star */}
    <motion.circle
      cx="48"
      cy="10"
      r="3"
      fill={color}
      animate={{
        opacity: [0.5, 1, 0.5],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* Star rays */}
    <motion.path
      d="M48 6 L48 4 M52 10 L54 10 M48 14 L48 16 M44 10 L42 10"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </svg>
);

/**
 * Dot Painting Circle (Waterhole/Dreamtime) - DREAM VISION
 * Aboriginal lineage
 */
export const DreamtimeCircleIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    {/* Outer concentric circles */}
    <motion.circle
      cx="32"
      cy="32"
      r="26"
      stroke={color}
      strokeWidth="1"
      strokeDasharray="2 4"
      fill="none"
    />
    <motion.circle
      cx="32"
      cy="32"
      r="20"
      stroke={color}
      strokeWidth="1.5"
      strokeDasharray="3 3"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    />
    <motion.circle
      cx="32"
      cy="32"
      r="14"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="4 2"
      fill="none"
      animate={{ rotate: -360 }}
      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
    />
    {/* Central waterhole */}
    <motion.circle
      cx="32"
      cy="32"
      r="6"
      fill={color}
      fillOpacity="0.6"
      animate={{
        scale: [1, 1.2, 1],
        fillOpacity: [0.4, 0.7, 0.4],
      }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {/* Dot pattern around */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <motion.circle
        key={angle}
        cx={32 + Math.cos((angle * Math.PI) / 180) * 24}
        cy={32 + Math.sin((angle * Math.PI) / 180) * 24}
        r="2"
        fill={color}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </svg>
);

/**
 * Djed Pillar with Sun Disc - GOLD ALCHEMY
 * Kemetic lineage
 */
export const DjedPillarIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    {/* Djed pillar base */}
    <motion.rect
      x="26"
      y="36"
      width="12"
      height="20"
      fill={color}
      fillOpacity="0.4"
    />
    {/* Pillar cross bars (stability) */}
    <motion.rect x="22" y="36" width="20" height="3" fill={color} />
    <motion.rect x="24" y="42" width="16" height="3" fill={color} />
    <motion.rect x="24" y="48" width="16" height="3" fill={color} />
    {/* Base */}
    <motion.rect x="20" y="54" width="24" height="4" rx="1" fill={color} />
    {/* Sun disc on top */}
    <motion.circle
      cx="32"
      cy="20"
      r="12"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="2"
    />
    {/* Sun rays */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
      <motion.line
        key={angle}
        x1={32 + Math.cos((angle * Math.PI) / 180) * 12}
        y1={20 + Math.sin((angle * Math.PI) / 180) * 12}
        x2={32 + Math.cos((angle * Math.PI) / 180) * 16}
        y2={20 + Math.sin((angle * Math.PI) / 180) * 16}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: angle / 360 }}
      />
    ))}
    {/* Inner sun */}
    <motion.circle
      cx="32"
      cy="20"
      r="4"
      fill={color}
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);
