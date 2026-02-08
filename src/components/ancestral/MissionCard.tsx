import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Camera, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mission, GuardianCharacter } from './GuardianCharacters';

interface MissionCardProps {
  mission: Mission;
  guardian: GuardianCharacter;
  isCompleted: boolean;
  onComplete: (missionId: string) => void;
  index: number;
}

/**
 * MISSION CARD - Scavenger Hunt Quest for Kids
 * 
 * Simplified task cards with fun rewards and
 * photo upload capability.
 */
const MissionCard = ({ mission, guardian, isCompleted, onComplete, index }: MissionCardProps) => {
  const [showReward, setShowReward] = useState(false);

  const handleComplete = () => {
    if (!isCompleted) {
      setShowReward(true);
      setTimeout(() => {
        onComplete(mission.id);
        setShowReward(false);
      }, 2000);
    }
  };

  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: isCompleted 
          ? `linear-gradient(135deg, ${guardian.color}30, ${guardian.color}15)`
          : 'hsl(0 0% 95%)',
        border: `3px solid ${isCompleted ? guardian.color : 'hsl(0 0% 85%)'}`,
        boxShadow: isCompleted 
          ? `0 8px 30px ${guardian.color}40`
          : '0 4px 20px hsl(0 0% 0% / 0.1)',
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      {/* Reward Celebration Overlay */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${guardian.color}, ${guardian.color}cc)`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              {mission.badgeEmoji}
            </motion.div>
            <motion.p
              className="text-2xl font-bold text-white text-center px-4"
              style={{ fontFamily: "'Chewy', cursive" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              You earned the {mission.reward}!
            </motion.p>
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Sparkles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -30],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    repeat: 2,
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5">
        {/* Mission Number & Status */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: isCompleted ? guardian.color : 'hsl(0 0% 90%)',
              color: isCompleted ? 'white' : 'hsl(0 0% 40%)',
            }}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
            <span 
              className="text-sm font-bold"
              style={{ fontFamily: "'Chewy', cursive" }}
            >
              Quest {index + 1}
            </span>
          </div>
          
          {isCompleted && (
            <motion.div 
              className="text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {mission.badgeEmoji}
            </motion.div>
          )}
        </div>

        {/* Task */}
        <div className="mb-4">
          <p 
            className="text-xs uppercase tracking-wider mb-1"
            style={{ 
              color: guardian.color,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            Your Mission:
          </p>
          <p 
            className="text-lg"
            style={{ 
              fontFamily: "'Chewy', cursive",
              color: 'hsl(0 0% 20%)',
              lineHeight: 1.3,
            }}
          >
            {mission.task}
          </p>
        </div>

        {/* Action */}
        <div 
          className="p-4 rounded-2xl mb-4"
          style={{
            background: `${guardian.color}15`,
            border: `2px dashed ${guardian.color}50`,
          }}
        >
          <p 
            className="text-xs uppercase tracking-wider mb-1"
            style={{ 
              color: guardian.color,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            Then do this:
          </p>
          <p 
            className="text-base"
            style={{ 
              fontFamily: "'Chewy', cursive",
              color: 'hsl(0 0% 30%)',
            }}
          >
            {mission.action}
          </p>
        </div>

        {/* Complete Button */}
        {!isCompleted && (
          <div className="flex gap-3">
            <Button
              className="flex-1 rounded-2xl py-6 text-lg font-bold"
              style={{
                fontFamily: "'Chewy', cursive",
                background: `linear-gradient(135deg, ${guardian.color}, ${guardian.color}dd)`,
                color: 'white',
                border: 'none',
                boxShadow: `0 4px 15px ${guardian.color}50`,
              }}
              onClick={handleComplete}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              I Did It!
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl py-6"
              style={{
                borderColor: guardian.color,
                color: guardian.color,
              }}
            >
              <Camera className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Completed State */}
        {isCompleted && (
          <div 
            className="text-center py-3 rounded-2xl"
            style={{
              background: `${guardian.color}20`,
            }}
          >
            <p 
              className="text-lg"
              style={{ 
                fontFamily: "'Chewy', cursive",
                color: guardian.color,
              }}
            >
              ✨ Quest Complete! ✨
            </p>
          </div>
        )}
      </div>

      {/* Reward Preview */}
      {!isCompleted && (
        <div 
          className="px-5 py-3 flex items-center justify-between"
          style={{
            background: 'hsl(0 0% 92%)',
            borderTop: '2px dashed hsl(0 0% 85%)',
          }}
        >
          <p 
            className="text-sm"
            style={{ 
              fontFamily: "'Space Mono', monospace",
              color: 'hsl(0 0% 50%)',
            }}
          >
            Reward: {mission.reward}
          </p>
          <span className="text-2xl">{mission.badgeEmoji}</span>
        </div>
      )}
    </motion.div>
  );
};

export default MissionCard;
