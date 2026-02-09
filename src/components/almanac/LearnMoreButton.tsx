import { useState } from 'react';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';
import WisdomOverlay from './WisdomOverlay';

interface LearnMoreButtonProps {
  wisdomKey: string;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * LEARN MORE BUTTON (ℹ️)
 * 
 * THE LINK: The only connection between Almanac (Action) and Path (Wisdom).
 * Clicking opens the WisdomOverlay with theory/spirit content.
 */
const LearnMoreButton = ({ wisdomKey, size = 'sm', className = '' }: LearnMoreButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  };

  return (
    <>
      <motion.button
        className={`p-1 rounded-full transition-colors hover:bg-white/10 ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Learn More from the Ancestral Path"
      >
        <Info className={sizeClasses[size]} style={{ color: 'hsl(270 50% 60%)' }} />
      </motion.button>

      <WisdomOverlay
        wisdomKey={wisdomKey}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default LearnMoreButton;
