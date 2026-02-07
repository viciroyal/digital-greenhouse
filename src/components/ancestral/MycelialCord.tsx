import { motion } from 'framer-motion';

interface MycelialCordProps {
  height: string;
  isActive?: boolean;
}

/**
 * Mycelial Cord - The connector between skill tree nodes
 * Looks like organic fungal network threads
 */
const MycelialCord = ({ height, isActive = true }: MycelialCordProps) => {
  return (
    <div 
      className="relative flex justify-center"
      style={{ height }}
    >
      {/* Main cord */}
      <motion.div
        className="w-1 rounded-full"
        style={{
          height: '100%',
          background: isActive 
            ? `linear-gradient(180deg,
                hsl(40 50% 35%) 0%,
                hsl(30 40% 25%) 50%,
                hsl(40 50% 35%) 100%
              )`
            : 'hsl(0 0% 20%)',
          boxShadow: isActive 
            ? '0 0 10px hsl(40 50% 40% / 0.5)' 
            : 'none',
        }}
      />

      {/* Branching tendrils */}
      {isActive && (
        <>
          {/* Left tendrils */}
          <motion.div
            className="absolute left-1/2 top-1/4"
            style={{
              width: '30px',
              height: '2px',
              background: 'linear-gradient(90deg, hsl(40 40% 30%), transparent)',
              transformOrigin: 'left center',
              transform: 'rotate(-30deg)',
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 0,
            }}
          />
          <motion.div
            className="absolute left-1/2 top-2/4"
            style={{
              width: '25px',
              height: '1.5px',
              background: 'linear-gradient(90deg, hsl(40 40% 30%), transparent)',
              transformOrigin: 'left center',
              transform: 'rotate(-20deg)',
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute left-1/2 top-3/4"
            style={{
              width: '20px',
              height: '1px',
              background: 'linear-gradient(90deg, hsl(40 40% 30%), transparent)',
              transformOrigin: 'left center',
              transform: 'rotate(-40deg)',
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 1,
            }}
          />

          {/* Right tendrils */}
          <motion.div
            className="absolute right-1/2 top-1/3"
            style={{
              width: '28px',
              height: '2px',
              background: 'linear-gradient(-90deg, hsl(40 40% 30%), transparent)',
              transformOrigin: 'right center',
              transform: 'rotate(25deg)',
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 0.3,
            }}
          />
          <motion.div
            className="absolute right-1/2 top-2/3"
            style={{
              width: '22px',
              height: '1.5px',
              background: 'linear-gradient(-90deg, hsl(40 40% 30%), transparent)',
              transformOrigin: 'right center',
              transform: 'rotate(35deg)',
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 0.7,
            }}
          />
        </>
      )}

      {/* Pulsing nodes along the cord */}
      {isActive && (
        <>
          {[20, 40, 60, 80].map((position, i) => (
            <motion.div
              key={position}
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{
                top: `${position}%`,
                background: 'hsl(40 60% 45%)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default MycelialCord;
