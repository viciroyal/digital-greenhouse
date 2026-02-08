import { motion } from 'framer-motion';
import { OgunIcon, BabaluAyeIcon, ShangoIcon, OshunIcon } from '@/components/ancestral/OrishaIcons';
import { Lock, CheckCircle } from 'lucide-react';

interface OrishaBlessingCardProps {
  orisha: 'ogun' | 'babalu-aye' | 'shango' | 'oshun';
  level: number;
  isEarned: boolean;
  completionPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
  index: number;
}

const orishaData = {
  'ogun': {
    name: 'OGUN',
    title: 'Lord of Iron & Labor',
    blessing: 'THE IRON ROOT',
    category: 'BIOLOGY',
    lineage: 'Muscogee & Maroons',
    color: 'hsl(350 75% 50%)',
    bgGradient: 'linear-gradient(135deg, hsl(350 50% 20%), hsl(350 60% 12%))',
    glowColor: 'hsl(350 75% 50% / 0.5)',
    Icon: OgunIcon,
    texture: 'Red Clay',
  },
  'babalu-aye': {
    name: 'BABALU AYE',
    title: 'Lord of Earth & Healing',
    blessing: 'THE MAGNETIC EARTH',
    category: 'GEOLOGY',
    lineage: 'Olmec (Xi)',
    color: 'hsl(30 50% 50%)',
    bgGradient: 'linear-gradient(135deg, hsl(30 40% 22%), hsl(30 35% 12%))',
    glowColor: 'hsl(30 50% 50% / 0.5)',
    Icon: BabaluAyeIcon,
    texture: 'Basalt Stone',
  },
  'shango': {
    name: 'SHANGO',
    title: 'Lord of Lightning & Fire',
    blessing: 'THE THUNDER SIGNAL',
    category: 'PHYSICS',
    lineage: 'Dogon, Aboriginal, Chinese, Vedic',
    color: 'hsl(25 90% 55%)',
    bgGradient: 'linear-gradient(135deg, hsl(25 60% 25%), hsl(15 50% 15%))',
    glowColor: 'hsl(25 90% 55% / 0.5)',
    Icon: ShangoIcon,
    texture: 'Copper',
  },
  'oshun': {
    name: 'OSHUN',
    title: 'Lady of Sweet Waters',
    blessing: 'THE SWEET ALCHEMY',
    category: 'CHEMISTRY',
    lineage: 'Ancient Kemit',
    color: 'hsl(45 90% 55%)',
    bgGradient: 'linear-gradient(135deg, hsl(45 60% 25%), hsl(35 50% 15%))',
    glowColor: 'hsl(45 90% 55% / 0.5)',
    Icon: OshunIcon,
    texture: 'Gold Leaf',
  },
};

export const OrishaBlessingCard = ({
  orisha,
  level,
  isEarned,
  completionPercent,
  lessonsCompleted,
  totalLessons,
  index,
}: OrishaBlessingCardProps) => {
  const data = orishaData[orisha];
  const Icon = data.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="relative"
    >
      {/* Card Container */}
      <motion.div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6"
        style={{
          background: isEarned ? data.bgGradient : 'linear-gradient(135deg, hsl(0 0% 15%), hsl(0 0% 10%))',
          border: `2px solid ${isEarned ? data.color : 'hsl(0 0% 25%)'}`,
          filter: isEarned ? 'none' : 'grayscale(80%)',
        }}
        whileHover={isEarned ? { 
          scale: 1.02, 
          boxShadow: `0 0 40px ${data.glowColor}, 0 20px 60px rgba(0,0,0,0.4)` 
        } : undefined}
      >
        {/* Earned Glow Effect */}
        {isEarned && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${data.glowColor}, transparent 70%)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* Level Badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <div
            className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono"
            style={{
              background: isEarned ? data.color : 'hsl(0 0% 30%)',
              color: isEarned ? 'hsl(0 0% 10%)' : 'hsl(0 0% 60%)',
              fontFamily: "'Staatliches', sans-serif",
              letterSpacing: '0.1em',
            }}
          >
            LEVEL {level}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-start gap-3 sm:gap-5">
          {/* Icon Container */}
          <motion.div
            className="relative flex-shrink-0"
            animate={isEarned ? { 
              rotate: [0, 2, -2, 0],
            } : undefined}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: isEarned 
                  ? `linear-gradient(145deg, ${data.color}30, ${data.color}10)`
                  : 'hsl(0 0% 15%)',
                border: `2px solid ${isEarned ? data.color : 'hsl(0 0% 25%)'}`,
              }}
            >
              <Icon className="w-10 h-10 sm:w-16 sm:h-16" animated={isEarned} />
              
              {/* Lock Overlay */}
              {!isEarned && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl sm:rounded-2xl">
                  <Lock className="w-5 h-5 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Completion Check */}
            {isEarned && (
              <motion.div
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                style={{ background: data.color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.15, type: 'spring' }}
              >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </motion.div>
            )}
          </motion.div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pt-1">
            <h3
              className="text-base sm:text-xl mb-0.5 sm:mb-1 truncate pr-16 sm:pr-20"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: isEarned ? data.color : 'hsl(0 0% 50%)',
                letterSpacing: '0.05em',
              }}
            >
              {data.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 truncate" style={{ fontFamily: "'Space Mono', monospace" }}>
              {data.title}
            </p>
            
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span
                className="px-1.5 py-0.5 sm:px-2 rounded text-[10px] sm:text-xs"
                style={{
                  background: isEarned ? `${data.color}20` : 'hsl(0 0% 20%)',
                  color: isEarned ? data.color : 'hsl(0 0% 50%)',
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                ◆ {data.category}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate hidden sm:inline" style={{ fontFamily: "'Space Mono', monospace" }}>
                {data.lineage}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 sm:h-2 rounded-full overflow-hidden bg-black/30 mb-1.5 sm:mb-2">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: data.color }}
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ delay: 0.5 + index * 0.15, duration: 0.8 }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] sm:text-xs" style={{ fontFamily: "'Space Mono', monospace" }}>
              <span className="text-muted-foreground">
                {lessonsCompleted}/{totalLessons} lessons
              </span>
              <span style={{ color: isEarned ? data.color : 'hsl(0 0% 50%)' }}>
                {completionPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Blessing Banner (if earned) */}
        {isEarned && (
          <motion.div
            className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t"
            style={{ borderColor: `${data.color}30` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.15 }}
          >
            <p
              className="text-center text-xs sm:text-sm"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: data.color,
                letterSpacing: '0.15em',
                textShadow: `0 0 20px ${data.glowColor}`,
              }}
            >
              ✦ BLESSED BY {data.name} ✦
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OrishaBlessingCard;
