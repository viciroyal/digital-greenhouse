import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopSection from '@/components/ShopSection';
import { motion, AnimatePresence } from 'framer-motion';
import GrandCosmogram from '@/components/cosmogram/GrandCosmogram';
import RespiratorySystem from '@/components/bio-digital/RespiratorySystem';
import BioluminescentVeins from '@/components/bio-digital/BioluminescentVeins';
import CircadianOverlay from '@/components/bio-digital/CircadianOverlay';
import AutomajicSoundSystem from '@/components/audio/AutomajicSoundSystem';
import GriotOracle from '@/components/GriotOracle';
import EshuLoader from '@/components/EshuLoader';
import albumArt from '@/assets/pharmboi-artwork.png';

/* ─── Production Credits ─── */
const CREDITS = [
  { role: 'Artist', name: 'Vici Royàl' },
  { role: 'Produced by', name: 'Vici Royàl & Èks' },
  { role: 'Mixed by', name: 'Vici Royàl at Atlanta Sound Factory' },
  { role: 'Mastered by', name: 'Kristofer Sampson at Sampson Sound Studios' },
  { role: 'Album Artwork', name: 'Vici Royàl' },
  { role: 'Featuring', name: 'Sistah Moon, Yamau, Briar Blakley, Sarafina Ethereal, James Cambridge IV, Shellie Sweets, Nichollé McKoy, Victoria, Dara Carter, Benjamin J. Davidow' },
];

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
    <main className="min-h-screen bg-background overflow-x-hidden relative">
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

      {/* Content */}
      <div className="relative z-10">
        {/* ═══ HERO — Full Screen ═══ */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
          {/* Dark vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, hsl(0 0% 0% / 0.6) 100%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
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
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(40 50% 90%), transparent)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
              <span className="relative z-10">Enter The Garden</span>
            </motion.button>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase font-body" style={{ color: 'hsl(40 50% 75% / 0.3)' }}>
              Scroll to listen
            </p>
          </motion.div>
        </section>

        {/* ═══ SOUND SYSTEM — Track Listings + Player ═══ */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <AutomajicSoundSystem />
        </section>

        {/* ═══ SHOP — The Source Formula ═══ */}
        <ShopSection />

        {/* ═══ PRODUCTION CREDITS ═══ */}
        <section className="py-16 px-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2
              className="text-2xl md:text-3xl font-bubble mb-8"
              style={{ color: 'hsl(40 50% 85%)' }}
            >
              Production Credits
            </h2>

            <div
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: 'hsl(20 25% 8% / 0.8)',
                border: '1px solid hsl(20 30% 20% / 0.4)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {CREDITS.map((credit, i) => (
                <div
                  key={i}
                  className="py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
                  style={{
                    borderBottom: i < CREDITS.length - 1 ? '1px solid hsl(20 30% 20% / 0.3)' : 'none',
                  }}
                >
                  <span
                    className="text-xs font-mono tracking-wider uppercase shrink-0"
                    style={{ color: 'hsl(40 50% 55% / 0.6)' }}
                  >
                    {credit.role}
                  </span>
                  <span
                    className="text-sm font-body"
                    style={{ color: 'hsl(40 50% 90%)' }}
                  >
                    {credit.name}
                  </span>
                </div>
              ))}

              {/* Copyright */}
              <div className="mt-6 pt-4" style={{ borderTop: '1px solid hsl(20 30% 20% / 0.3)' }}>
                <p className="text-[10px] font-mono" style={{ color: 'hsl(40 50% 55% / 0.4)' }}>
                  © 2025 PHARMBOI · ALL RIGHTS RESERVED
                </p>
                <p className="text-[9px] font-mono mt-1 italic" style={{ color: 'hsl(40 50% 55% / 0.3)' }}>
                  "From the roots below, through the gems within, to the stars above."
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Griot Oracle — Floating Help */}
      <GriotOracle />
    </main>
  );
};

export default Index;
