import { motion } from 'framer-motion';
import { Sprout, Star } from 'lucide-react';

interface ScavengerBadgeProps {
  color: string;
  isVisible: boolean;
}

/**
 * SCAVENGER BADGE
 * 
 * Special recognition for completing tasks in SEED mode.
 * Lore: "The Maroons built a nation with nothing but their hands.
 * You are walking the path of the Scavenger Scientist."
 */
const ScavengerBadge = ({ color, isVisible }: ScavengerBadgeProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="p-4 rounded-xl text-center"
      style={{
        background: 'linear-gradient(135deg, hsl(140 30% 12%), hsl(100 25% 10%))',
        border: '2px solid hsl(140 50% 35%)',
        boxShadow: '0 0 30px hsl(140 50% 30% / 0.3), inset 0 0 20px hsl(140 40% 20% / 0.2)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Badge Icon */}
      <motion.div
        className="relative w-16 h-16 mx-auto mb-3"
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Outer Ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px dashed hsl(140 50% 45%)',
          }}
        />
        
        {/* Inner Circle */}
        <div
          className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(140 40% 25%), hsl(120 35% 20%))',
            boxShadow: 'inset 0 2px 10px hsl(0 0% 0% / 0.5)',
          }}
        >
          <Sprout className="w-6 h-6" style={{ color: 'hsl(140 70% 55%)' }} />
        </div>

        {/* Stars */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: i === 0 ? '-4px' : i === 1 ? '50%' : '80%',
              left: i === 0 ? '50%' : i === 1 ? '-4px' : '85%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              repeat: Infinity,
            }}
          >
            <Star
              className="w-3 h-3"
              style={{ color: 'hsl(51 100% 60%)', fill: 'hsl(51 100% 50%)' }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Title */}
      <h3
        className="text-sm font-mono tracking-[0.3em] uppercase mb-2"
        style={{ color: 'hsl(140 60% 55%)' }}
      >
        ✦ SCAVENGER SCIENTIST ✦
      </h3>

      {/* Lore */}
      <p
        className="text-xs font-mono leading-relaxed opacity-80"
        style={{ color: 'hsl(100 40% 60%)' }}
      >
        The Maroons built a nation with nothing but their hands.
        You walk the path of the Resourceful.
      </p>

      {/* Earned Badge */}
      <motion.div
        className="mt-3 inline-block px-3 py-1 rounded-full"
        style={{
          background: 'hsl(140 40% 20%)',
          border: '1px solid hsl(140 50% 40%)',
        }}
        animate={{
          boxShadow: [
            '0 0 10px hsl(140 50% 40% / 0.3)',
            '0 0 20px hsl(140 50% 40% / 0.5)',
            '0 0 10px hsl(140 50% 40% / 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span
          className="text-[10px] font-mono tracking-wider"
          style={{ color: 'hsl(140 60% 60%)' }}
        >
          BADGE EARNED
        </span>
      </motion.div>
    </motion.div>
  );
};

export default ScavengerBadge;
