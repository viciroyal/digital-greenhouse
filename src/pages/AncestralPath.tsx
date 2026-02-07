import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sprout } from 'lucide-react';

/**
 * THE ANCESTRAL PATH - Placeholder Page
 * 
 * The sacred gateway has been unlocked.
 * This is where the Pharmer's lessons will live.
 */
const AncestralPath = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Deep earth background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, hsl(200 60% 15% / 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, hsl(140 50% 10% / 0.4) 0%, transparent 40%),
            linear-gradient(180deg,
              hsl(250 50% 8%) 0%,
              hsl(220 45% 6%) 30%,
              hsl(20 40% 6%) 70%,
              hsl(140 40% 5%) 100%
            )
          `,
        }}
      />

      {/* Root texture */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Back button */}
      <motion.button
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: 'hsl(20 30% 15% / 0.9)',
          border: '1px solid hsl(40 40% 30%)',
        }}
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4 text-cream-muted" />
        <span className="text-sm font-body text-cream-muted">Return to Garden</span>
      </motion.button>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8">
        
        {/* Glowing sprout icon */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1.5, 
            type: 'spring',
            stiffness: 100,
          }}
        >
          <motion.div
            className="relative"
            animate={{
              filter: [
                'drop-shadow(0 0 20px hsl(140 60% 40%))',
                'drop-shadow(0 0 40px hsl(140 60% 50%))',
                'drop-shadow(0 0 20px hsl(140 60% 40%))',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sprout className="w-24 h-24 text-gem-emerald" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-6xl text-center mb-6 tracking-[0.15em] font-bubble"
          style={{
            color: 'hsl(140 50% 65%)',
            textShadow: `
              2px 2px 0 hsl(140 40% 15%),
              0 0 40px hsl(140 60% 40% / 0.4)
            `,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          THE ANCESTRAL PATH
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-center mb-12 font-body"
          style={{ color: 'hsl(40 50% 75%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          The Gateway Has Been Unlocked
        </motion.p>

        {/* Coming soon card */}
        <motion.div
          className="max-w-lg mx-auto p-8 rounded-3xl text-center"
          style={{
            background: 'hsl(20 30% 10% / 0.8)',
            border: '1px solid hsl(140 50% 30% / 0.5)',
            boxShadow: `
              0 0 40px hsl(140 50% 30% / 0.2),
              inset 0 0 30px hsl(140 50% 20% / 0.1)
            `,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <h2 
            className="text-2xl font-bubble mb-4 tracking-wider"
            style={{ color: 'hsl(40 60% 70%)' }}
          >
            THE PHARMER'S CURRICULUM
          </h2>
          
          <p className="font-body mb-6" style={{ color: 'hsl(40 40% 70%)' }}>
            The lessons of the ancestors are being prepared. 
            Return soon to begin your journey through the sacred knowledge of regenerative agriculture.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {['Soil Alchemy', 'Lunar Cycles', 'Seed Sovereignty', 'Water Memory'].map((topic, i) => (
              <motion.span
                key={topic}
                className="px-4 py-2 rounded-full text-sm font-body"
                style={{
                  background: 'hsl(140 40% 15% / 0.5)',
                  border: '1px solid hsl(140 50% 35% / 0.5)',
                  color: 'hsl(140 50% 70%)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + i * 0.1 }}
              >
                {topic}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Breathing roots animation at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: `
              linear-gradient(0deg,
                hsl(20 45% 10%) 0%,
                transparent 100%
              )
            `,
          }}
          animate={{
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </main>
  );
};

export default AncestralPath;
