import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PharmerTooltipProps {
  children: ReactNode;
  tip: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const PharmerTooltip = ({ children, tip, position = 'top' }: PharmerTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: '-top-3 left-1/2 -translate-x-1/2 -translate-y-full',
    bottom: '-bottom-3 left-1/2 -translate-x-1/2 translate-y-full',
    left: 'top-1/2 -left-3 -translate-y-1/2 -translate-x-full',
    right: 'top-1/2 -right-3 -translate-y-1/2 translate-x-full',
  };

  const arrowClasses = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-source-white/20',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-source-white/20',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-transparent border-b-transparent border-r-transparent border-l-source-white/20',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-transparent border-b-transparent border-l-transparent border-r-source-white/20',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute ${positionClasses[position]} z-50 pointer-events-none`}
          >
            <div className="glass-card-strong px-4 py-3 rounded-lg max-w-xs text-sm">
              <div className="flex items-start gap-2">
                <span className="text-throne-gold text-lg">🌱</span>
                <div>
                  <p className="text-source-white/90 font-body leading-relaxed">{tip}</p>
                  <p className="text-crystal-violet/70 text-xs mt-1 font-medium">— Pharmer Tip</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PharmerTooltip;
