import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface HazardWarningProps {
  level: 3 | 4;
}

const hazardContent = {
  3: {
    title: 'FIRE PROTOCOL WARNING',
    description: 'This level involves Agnihotra fire rituals and electroculture installations. Proceed with caution and proper safety equipment.',
  },
  4: {
    title: 'FERMENTATION PROTOCOL WARNING',
    description: 'This level involves fermentation processes and JADAM preparations. Follow proper handling procedures.',
  },
};

/**
 * Hazard Warning Block
 * Displays safety warnings for Level 3 (Shango/Fire) and Level 4 (Oshun/Ferment)
 */
const HazardWarning = ({ level }: HazardWarningProps) => {
  const content = hazardContent[level];

  return (
    <motion.div
      className="p-4 rounded-xl"
      style={{
        background: 'hsl(0 50% 10% / 0.3)',
        border: '2px dashed hsl(0 70% 45%)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <AlertTriangle 
            className="w-5 h-5 flex-shrink-0 mt-0.5" 
            style={{ color: 'hsl(0 70% 55%)' }} 
          />
        </motion.div>
        
        <div>
          <p 
            className="text-xs font-mono tracking-wider mb-1"
            style={{ color: 'hsl(0 70% 60%)' }}
          >
            {content.title}
          </p>
          <p 
            className="text-xs font-mono leading-relaxed"
            style={{ color: 'hsl(0 40% 70%)' }}
          >
            {content.description}
          </p>
          <p 
            className="text-xs font-mono mt-2 opacity-70"
            style={{ color: 'hsl(0 50% 55%)' }}
          >
            AgroMajic is not liable for misuse of the elements.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HazardWarning;
