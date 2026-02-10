import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GrandCosmogram from '@/components/cosmogram/GrandCosmogram';
import RespiratorySystem from '@/components/bio-digital/RespiratorySystem';
import BioluminescentVeins from '@/components/bio-digital/BioluminescentVeins';
import CircadianOverlay from '@/components/bio-digital/CircadianOverlay';
import CassettePlayer from '@/components/CassettePlayer';
import GriotOracle from '@/components/GriotOracle';
import EshuLoader from '@/components/EshuLoader';
import albumArt from '@/assets/pharmboi-artwork.png';

const Index = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleInitiate = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/crop-oracle');
    }, 2800);
  }, [navigate]);

  return (
    <main className="fixed inset-0 bg-background overflow-hidden">
      {/* Eshu Loader Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: 'hsl(0 0% 2%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EshuLoader size="lg" message="Eshu is opening the gate..." />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Living Cosmogram Background */}
      <RespiratorySystem>
        <GrandCosmogram />
      </RespiratorySystem>
      <BioluminescentVeins />
      <CircadianOverlay />

      {/* Dark vignette for contrast */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, hsl(0 0% 0% / 0.6) 100%)',
        }}
      />

      {/* Center Content — Album Art + INITIATE */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4">
        {/* Album Art */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="relative group">
            <div
              className="absolute -inset-12 opacity-30 blur-[60px] group-hover:opacity-50 transition-opacity duration-1000"
              style={{
                background: 'radial-gradient(circle, hsl(350 75% 50%) 0%, hsl(280 60% 40%) 40%, transparent 70%)',
              }}
            />
            <img
              src={albumArt}
              alt="PHARMBOI"
              className="relative w-56 md:w-72 lg:w-80 rounded-3xl"
              style={{
                border: '3px solid hsl(20 40% 20% / 0.6)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 80px hsl(350 75% 50% / 0.2)',
              }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bubble mb-2 select-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            background: `url('/images/root-texture.png'), linear-gradient(180deg, hsl(20 30% 40%) 0%, hsl(20 40% 25%) 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(3px 4px 0 hsl(20 30% 12%)) drop-shadow(0 6px 12px rgba(0,0,0,0.6))',
          }}
        >
          PHARMBOI
        </motion.h1>

        <motion.p
          className="text-xs tracking-[0.4em] uppercase font-body mb-10"
          style={{ color: 'hsl(40 50% 75% / 0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          by Vici Royàl
        </motion.p>

        {/* INITIATE Button */}
        <motion.button
          onClick={handleInitiate}
          disabled={isTransitioning}
          className="relative px-12 py-5 rounded-full font-bubble text-lg md:text-xl tracking-[0.3em] uppercase overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(350 75% 45%) 0%, hsl(280 60% 35%) 50%, hsl(220 60% 35%) 100%)',
            border: '2px solid hsl(40 50% 75% / 0.3)',
            color: 'hsl(40 50% 95%)',
            boxShadow: '0 0 40px hsl(350 75% 50% / 0.3), 0 0 80px hsl(280 60% 40% / 0.15), inset 0 1px 0 hsl(40 50% 90% / 0.15)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 60px hsl(350 75% 50% / 0.5), 0 0 120px hsl(280 60% 40% / 0.25)' }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(40 50% 90%), transparent)',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
          <span className="relative z-10">Enter The Garden</span>
        </motion.button>
      </div>

      {/* Cassette Player — Docked Bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="scale-[0.85] md:scale-100"
        >
          <CassettePlayer />
        </motion.div>
      </div>

      {/* Griot Oracle — Floating Help */}
      <GriotOracle />
    </main>
  );
};

export default Index;
