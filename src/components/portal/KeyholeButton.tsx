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
      {/* Keyhole SVG Icon */}
      <motion.svg
        viewBox="0 0 24 32"
        className="w-5 h-7"
        fill="none"
        animate={{
          filter: [
            'drop-shadow(0 0 4px hsl(200 80% 60%))',
            'drop-shadow(0 0 8px hsl(200 80% 70%))',
            'drop-shadow(0 0 4px hsl(200 80% 60%))',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Outer keyhole shape */}
        <path
          d="M12 2C7.58 2 4 5.58 4 10c0 2.85 1.5 5.35 3.75 6.75V26c0 1.1.9 2 2 2h4.5c1.1 0 2-.9 2-2V16.75C18.5 15.35 20 12.85 20 10c0-4.42-3.58-8-8-8z"
          fill="hsl(220 60% 8%)"
          stroke="hsl(200 70% 50%)"
          strokeWidth="1.5"
        />
        
        {/* Inner keyhole opening */}
        <ellipse
          cx="12"
          cy="10"
          rx="3"
          ry="3.5"
          fill="hsl(200 80% 15%)"
        />
        <rect
          x="10"
          y="12"
          width="4"
          height="8"
          rx="1"
          fill="hsl(200 80% 15%)"
        />
        
        {/* Bioluminescent glow center */}
        <motion.ellipse
          cx="12"
          cy="10"
          rx="1.5"
          ry="2"
          fill="hsl(200 80% 60%)"
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 1.5,
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
