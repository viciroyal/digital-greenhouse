import { motion } from 'framer-motion';
import { Sprout, Trophy, BookOpen, Upload, Star } from 'lucide-react';

interface ProfileStatsProps {
  overallProgress: number;
  modulesCompleted: number;
  totalModules: number;
  lessonsCompleted: number;
  totalLessons: number;
  uploadsCount: number;
  certifiedCount: number;
}

export const ProfileStats = ({
  overallProgress,
  modulesCompleted,
  totalModules,
  lessonsCompleted,
  totalLessons,
  uploadsCount,
  certifiedCount,
}: ProfileStatsProps) => {
  const stats = [
    {
      icon: Trophy,
      label: 'Levels Mastered',
      value: `${modulesCompleted}/${totalModules}`,
      color: 'hsl(45 90% 55%)',
    },
    {
      icon: BookOpen,
      label: 'Lessons Completed',
      value: `${lessonsCompleted}/${totalLessons}`,
      color: 'hsl(140 60% 45%)',
    },
    {
      icon: Upload,
      label: 'Evidence Submitted',
      value: uploadsCount.toString(),
      color: 'hsl(220 75% 55%)',
    },
    {
      icon: Star,
      label: 'Hogon Certified',
      value: certifiedCount.toString(),
      color: 'hsl(350 75% 50%)',
    },
  ];

  // Determine pharmer rank based on progress
  const getRank = () => {
    if (overallProgress >= 100) return { name: 'MASTER STEWARD', color: 'hsl(45 90% 55%)' };
    if (overallProgress >= 75) return { name: 'GROVE KEEPER', color: 'hsl(25 90% 55%)' };
    if (overallProgress >= 50) return { name: 'ROOT WALKER', color: 'hsl(140 60% 45%)' };
    if (overallProgress >= 25) return { name: 'SEED TENDER', color: 'hsl(220 75% 55%)' };
    return { name: 'SEEDLING', color: 'hsl(350 75% 50%)' };
  };

  const rank = getRank();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl sm:rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, hsl(20 40% 12%), hsl(20 30% 8%))',
        border: '2px solid hsl(20 40% 25%)',
      }}
    >
      {/* Header with Rank */}
      <div className="p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <motion.div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(145deg, ${rank.color}30, ${rank.color}10)`,
              border: `2px solid ${rank.color}`,
            }}
            animate={{ boxShadow: [`0 0 20px ${rank.color}40`, `0 0 40px ${rank.color}60`, `0 0 20px ${rank.color}40`] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sprout className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: rank.color }} />
          </motion.div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1" style={{ fontFamily: "'Space Mono', monospace" }}>
              PHARMER RANK
            </p>
            <motion.h2
              className="text-lg sm:text-2xl truncate"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: rank.color,
                letterSpacing: '0.1em',
                textShadow: `0 0 20px ${rank.color}50`,
              }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {rank.name}
            </motion.h2>
          </div>
        </div>

        {/* Overall Progress Ring */}
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              {/* Background circle */}
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="hsl(0 0% 20%)"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress circle */}
              <motion.circle
                cx="40"
                cy="40"
                r="35"
                stroke={rank.color}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 35}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 35 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 35 * (1 - overallProgress / 100) }}
                transition={{ duration: 1.5, delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-sm sm:text-lg font-bold"
                style={{ fontFamily: "'Staatliches', sans-serif", color: rank.color }}
              >
                {overallProgress}%
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
              Journey Progress
            </p>
            <div className="h-2 sm:h-3 rounded-full overflow-hidden bg-black/40">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, hsl(350 75% 50%), hsl(30 50% 50%), hsl(25 90% 55%), ${rank.color})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-px bg-white/5">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-3 sm:p-4"
            style={{
              background: 'hsl(20 30% 10%)',
            }}
          >
            <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2" style={{ color: stat.color }} />
            <p
              className="text-lg sm:text-xl mb-0.5 sm:mb-1"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: stat.color,
              }}
            >
              {stat.value}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight" style={{ fontFamily: "'Space Mono', monospace" }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProfileStats;
