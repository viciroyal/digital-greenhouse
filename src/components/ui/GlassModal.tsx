import { ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * GLASS MODAL - Unified Glassmorphism Modal System
 * 
 * A standardized modal component following the Rooted Mosaic design system:
 * - Glassmorphism: rgba(0,0,0,0.7), backdrop-blur(20px), white border 0.1 opacity
 * - Heavy rounding: 25px+ borders
 * - Organic, cosmic aesthetic with gemstone accents
 * 
 * Variants:
 * - default: Standard glass dark modal
 * - cosmic: Deep space gradient background
 * - soil: Dark earthy tones with gold accents
 * - parchment: Aged paper for contract/sacred documents
 * - lab: Technical/scientific blue-tinted
 */

export type GlassModalVariant = 'default' | 'cosmic' | 'soil' | 'parchment' | 'lab';
export type GlassModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  
  /** Modal variant for different visual themes */
  variant?: GlassModalVariant;
  
  /** Modal size preset */
  size?: GlassModalSize;
  
  /** Show close button */
  showClose?: boolean;
  
  /** Custom close button style */
  closeVariant?: 'glass' | 'wax-seal' | 'gold';
  
  /** Allow clicking backdrop to close */
  closeOnBackdrop?: boolean;
  
  /** Additional classes for the modal container */
  className?: string;
  
  /** Additional classes for the backdrop */
  backdropClassName?: string;
  
  /** Custom header content */
  header?: ReactNode;
  
  /** Custom footer content */
  footer?: ReactNode;
  
  /** Disable scroll inside modal */
  noScroll?: boolean;
}

const sizeClasses: Record<GlassModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-full w-full h-full max-h-full m-0 rounded-none',
};

const variantStyles: Record<GlassModalVariant, {
  container: React.CSSProperties;
  containerClass: string;
  backdrop: React.CSSProperties;
}> = {
  default: {
    container: {
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    },
    containerClass: 'rounded-3xl',
    backdrop: {
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
    },
  },
  cosmic: {
    container: {
      background: 'linear-gradient(180deg, hsl(240 50% 8%) 0%, hsl(260 40% 6%) 50%, hsl(280 35% 8%) 100%)',
      border: '1px solid rgba(147, 112, 219, 0.2)',
      boxShadow: '0 20px 80px rgba(147, 112, 219, 0.15), inset 0 0 60px rgba(147, 112, 219, 0.05)',
    },
    containerClass: 'rounded-3xl',
    backdrop: {
      background: 'radial-gradient(ellipse at 50% 30%, hsl(280 50% 10%), hsl(250 40% 3%))',
    },
  },
  soil: {
    container: {
      background: 'linear-gradient(180deg, hsl(20 40% 12%) 0%, hsl(25 35% 10%) 50%, hsl(20 40% 12%) 100%)',
      border: '3px solid hsl(51 80% 45%)',
      boxShadow: '0 0 60px hsl(51 80% 40% / 0.3), 0 20px 60px rgba(0,0,0,0.6), inset 0 0 100px hsl(51 50% 20% / 0.1)',
    },
    containerClass: 'rounded-2xl',
    backdrop: {
      background: 'radial-gradient(ellipse at 50% 30%, hsl(280 50% 15%), hsl(250 40% 5%))',
    },
  },
  parchment: {
    container: {
      background: 'linear-gradient(135deg, hsl(35 40% 85%) 0%, hsl(30 35% 80%) 25%, hsl(35 45% 82%) 50%, hsl(28 38% 78%) 75%, hsl(32 42% 83%) 100%)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 100px hsl(30 30% 70% / 0.3)',
    },
    containerClass: 'rounded-lg',
    backdrop: {
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
    },
  },
  lab: {
    container: {
      background: 'linear-gradient(180deg, hsl(200 40% 8%) 0%, hsl(220 50% 6%) 50%, hsl(200 40% 8%) 100%)',
      borderLeft: '1px solid hsl(200 60% 30% / 0.3)',
      boxShadow: '-20px 0 60px rgba(0, 150, 200, 0.15)',
    },
    containerClass: 'rounded-none',
    backdrop: {
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
    },
  },
};

const CloseButton = ({ 
  variant, 
  onClick 
}: { 
  variant: 'glass' | 'wax-seal' | 'gold';
  onClick: () => void;
}) => {
  const styles: Record<typeof variant, { container: React.CSSProperties; icon: React.CSSProperties }> = {
    glass: {
      container: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      },
      icon: { color: 'hsl(0 0% 80%)' },
    },
    'wax-seal': {
      container: {
        background: 'radial-gradient(circle at 30% 30%, hsl(0 60% 45%), hsl(0 50% 30%))',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 2px hsl(0 60% 60%)',
      },
      icon: { color: 'rgba(255, 255, 255, 0.8)' },
    },
    gold: {
      container: {
        background: 'hsl(0 0% 15% / 0.8)',
        border: '1px solid hsl(51 80% 40% / 0.5)',
      },
      icon: { color: 'hsl(40 30% 70%)' },
    },
  };

  return (
    <motion.button
      className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center"
      style={styles[variant].container}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <X className="w-5 h-5" style={styles[variant].icon} />
    </motion.button>
  );
};

const GlassModal = ({
  isOpen,
  onClose,
  children,
  variant = 'default',
  size = 'md',
  showClose = true,
  closeVariant = 'glass',
  closeOnBackdrop = true,
  className,
  backdropClassName,
  header,
  footer,
  noScroll = false,
}: GlassModalProps) => {
  const variantStyle = variantStyles[variant];
  const sizeClass = sizeClasses[size];

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdrop) {
      onClose();
    }
  }, [closeOnBackdrop, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className={cn('absolute inset-0', backdropClassName)}
            style={variantStyle.backdrop}
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Container */}
          <motion.div
            className={cn(
              'relative w-full',
              noScroll ? '' : 'max-h-[90vh] overflow-y-auto',
              sizeClass,
              variantStyle.containerClass,
              className
            )}
            style={variantStyle.container}
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {showClose && (
              <CloseButton variant={closeVariant} onClick={onClose} />
            )}

            {/* Header */}
            {header && (
              <div className="relative px-6 pt-6 pb-4 border-b border-white/10">
                {header}
              </div>
            )}

            {/* Content */}
            <div className={cn('relative', !header && !footer ? 'p-6' : 'p-6')}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="relative px-6 pb-6 pt-4 border-t border-white/10">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Pre-styled modal header component
 */
export const GlassModalHeader = ({
  icon,
  title,
  subtitle,
  accentColor = 'hsl(51 100% 55%)',
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
}) => (
  <div className="text-center">
    {icon && (
      <motion.div
        className="mb-4 inline-block"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {icon}
      </motion.div>
    )}
    <h2
      className="text-2xl md:text-3xl tracking-[0.1em] mb-2"
      style={{
        fontFamily: "'Staatliches', serif",
        color: accentColor,
        textShadow: `0 0 30px ${accentColor}50`,
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        className="text-sm font-mono tracking-wider"
        style={{ color: 'hsl(40 50% 60%)' }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

/**
 * Decorative gold corner accents for soil/sacred modals
 */
export const GoldCornerAccents = () => (
  <>
    <div
      className="absolute top-0 left-0 w-12 h-12"
      style={{
        borderTop: '3px solid hsl(51 80% 50%)',
        borderLeft: '3px solid hsl(51 80% 50%)',
        borderTopLeftRadius: '12px',
      }}
    />
    <div
      className="absolute top-0 right-0 w-12 h-12"
      style={{
        borderTop: '3px solid hsl(51 80% 50%)',
        borderRight: '3px solid hsl(51 80% 50%)',
        borderTopRightRadius: '12px',
      }}
    />
    <div
      className="absolute bottom-0 left-0 w-12 h-12"
      style={{
        borderBottom: '3px solid hsl(51 80% 50%)',
        borderLeft: '3px solid hsl(51 80% 50%)',
        borderBottomLeftRadius: '12px',
      }}
    />
    <div
      className="absolute bottom-0 right-0 w-12 h-12"
      style={{
        borderBottom: '3px solid hsl(51 80% 50%)',
        borderRight: '3px solid hsl(51 80% 50%)',
        borderBottomRightRadius: '12px',
      }}
    />
  </>
);

/**
 * Floating particle effect for cosmic/mystical modals
 */
export const FloatingParticles = ({
  count = 30,
  color = 'hsl(51 80% 55%)',
}: {
  count?: number;
  color?: string;
}) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          background: color,
        }}
        animate={{
          y: [0, -100, 0],
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 3,
        }}
      />
    ))}
  </div>
);

/**
 * Star field background for cosmic modals
 */
export const StarField = ({ count = 100 }: { count?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-0.5 h-0.5 bg-white rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0.3 + Math.random() * 0.7,
        }}
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

export default GlassModal;
