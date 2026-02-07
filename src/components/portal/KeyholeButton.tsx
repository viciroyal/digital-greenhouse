import { motion } from 'framer-motion';

interface KeyholeButtonProps {
  onClick: () => void;
}

/**
 * The Keyhole Button - "The Initiation"
 * 
 * An ancient keyhole glowing with bioluminescent blue light
 * that serves as the entry point to the Pharmer's Portal.
 */
const KeyholeButton = ({ onClick }: KeyholeButtonProps) => {
  return (
    <motion.button
      className="relative flex items-center gap-2 px-4 py-2 rounded-full"
      style={{
        background: 'linear-gradient(135deg, hsl(20 40% 15%), hsl(280 40% 12%))',
        border: '1px solid hsl(200 80% 40% / 0.5)',
        boxShadow: `
          0 0 20px hsl(200 80% 50% / 0.3),
          inset 0 0 15px hsl(200 80% 40% / 0.1)
        `,
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: `
          0 0 30px hsl(200 80% 50% / 0.5),
          inset 0 0 20px hsl(200 80% 40% / 0.2)
        `,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-label="Enter The Initiation"
    >
      {/* Root-Intertwined Keyhole Icon */}
      <motion.svg
        viewBox="0 0 28 36"
        className="w-6 h-8"
        fill="none"
        animate={{
          filter: [
            'drop-shadow(0 0 4px hsl(200 80% 60%))',
            'drop-shadow(0 0 10px hsl(200 80% 70%))',
            'drop-shadow(0 0 4px hsl(200 80% 60%))',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Left root tendril forming keyhole */}
        <motion.path
          d="M6 32 C4 28, 2 24, 3 20 C4 16, 6 14, 8 12 C10 10, 11 8, 11 6 C11 4, 10 2, 14 2"
          stroke="hsl(200 70% 45%)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          animate={{
            strokeOpacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Right root tendril forming keyhole */}
        <motion.path
          d="M22 32 C24 28, 26 24, 25 20 C24 16, 22 14, 20 12 C18 10, 17 8, 17 6 C17 4, 18 2, 14 2"
          stroke="hsl(200 70% 45%)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          animate={{
            strokeOpacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
        
        {/* Small root tendrils branching off */}
        <path
          d="M4 22 C2 21, 1 19, 2 17"
          stroke="hsl(200 60% 40%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 22 C26 21, 27 19, 26 17"
          stroke="hsl(200 60% 40%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Central keyhole void */}
        <ellipse
          cx="14"
          cy="10"
          rx="4"
          ry="5"
          fill="hsl(220 80% 6%)"
        />
        <rect
          x="11"
          y="14"
          width="6"
          height="12"
          rx="2"
          fill="hsl(220 80% 6%)"
        />
        
        {/* Bioluminescent glow within keyhole */}
        <motion.ellipse
          cx="14"
          cy="10"
          rx="2"
          ry="2.5"
          fill="hsl(200 80% 55%)"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Inner glow trail down keyhole */}
        <motion.rect
          x="12.5"
          y="15"
          width="3"
          height="8"
          rx="1.5"
          fill="hsl(200 70% 50%)"
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>

      {/* Label */}
      <span 
        className="text-xs font-bubble tracking-wider hidden md:inline"
        style={{ 
          color: 'hsl(200 70% 75%)',
          textShadow: '0 0 10px hsl(200 80% 50% / 0.5)',
        }}
      >
        THE INITIATION
      </span>

      {/* Ambient pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: '1px solid hsl(200 80% 60%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.button>
  );
};

export default KeyholeButton;
