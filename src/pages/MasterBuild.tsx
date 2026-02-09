import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio } from 'lucide-react';
import TransposeToggle, { TransposeMode } from '@/components/master-build/TransposeToggle';
import ArtistTracklist from '@/components/master-build/ArtistTracklist';
import MixingDesk from '@/components/master-build/MixingDesk';
import BedMap from '@/components/master-build/BedMap';

/**
 * AGROMAJIC MASTER BUILD
 * The unified frequency portal for the 1.1-acre research incubator & record label.
 * 
 * Module 1: Global 7-Zone Octave theme (396Hz–963Hz)
 * Module 2: "Transpose Frequency" toggle — Artist (Music) ↔ Farmer (Agriculture)
 * Module 3: Zone Status Matrix "Mixing Desk" (Brix tuning bars)
 * Module 4: Interactive 44-bed SVG map with Liner Notes popups
 */

const MasterBuild = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<TransposeMode>('artist');

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Background: Dark soil canvas */}
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(250 20% 4%) 0%, hsl(20 15% 4%) 50%, hsl(0 0% 3%) 100%)',
        }}
      />

      {/* Subtle frequency grid texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(0 0% 30%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(0 0% 30%) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Muscogee (Creek) Heritage Watermark — Foundation Layer */}
      <div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.025] whitespace-nowrap select-none"
        style={{ fontFamily: "'Staatliches', sans-serif", fontSize: '1.2rem', color: 'hsl(30 40% 50%)', letterSpacing: '0.3em' }}
      >
        MUSCOGEE (CREEK) NATION • ROCKDALE COUNTY • SOVEREIGN SOIL
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-2 flex items-center justify-between">
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'hsl(20 20% 10% / 0.9)',
            border: '1px solid hsl(40 30% 25%)',
            backdropFilter: 'blur(10px)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: 'hsl(40 50% 55%)' }} />
          <span className="font-mono text-xs hidden sm:inline" style={{ color: 'hsl(40 50% 55%)' }}>
            Return
          </span>
        </motion.button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: 'hsl(45 60% 50% / 0.08)',
            border: '1px solid hsl(45 60% 40% / 0.3)',
          }}
        >
          <Radio className="w-4 h-4" style={{ color: 'hsl(45 70% 55%)' }} />
          <span className="font-mono text-[10px] tracking-wider" style={{ color: 'hsl(45 60% 55%)' }}>
            MASTER BUILD
          </span>
        </div>
      </header>

      {/* Mission Statement */}
      <motion.div
        className="relative z-10 text-center px-6 pt-6 pb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1
          className="text-2xl md:text-3xl tracking-[0.1em] mb-2"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            color: 'hsl(45 80% 65%)',
            textShadow: '0 0 25px hsl(45 60% 30% / 0.4)',
          }}
        >
          AGROMAJIC
        </h1>
        <p
          className="text-[11px] font-mono leading-relaxed max-w-lg mx-auto"
          style={{ color: 'hsl(30 20% 50%)', fontStyle: 'italic' }}
        >
          "To listen when the soil whispers, to act when the stars signal, and to grow the 'Majic' until the whole world remembers how to sing along."
        </p>

        {/* 7-Zone Octave Bar */}
        <div className="flex justify-center gap-1 mt-4">
          {[
            'hsl(0 60% 50%)', 'hsl(30 70% 50%)', 'hsl(51 80% 50%)',
            'hsl(120 50% 45%)', 'hsl(210 60% 50%)', 'hsl(270 50% 50%)',
            'hsl(300 50% 50%)',
          ].map((c, i) => (
            <motion.div
              key={i}
              className="w-8 h-1.5 rounded-full"
              style={{ background: c, boxShadow: `0 0 8px ${c.replace(')', ' / 0.4)')}` }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Transpose Frequency Toggle */}
      <div className="relative z-10 py-6 flex justify-center">
        <TransposeToggle mode={mode} onToggle={setMode} />
      </div>

      {/* Content Area */}
      <div className="relative z-10 px-4 pb-16">
        <AnimatePresence mode="wait">
          {mode === 'artist' ? (
            <motion.div
              key="artist"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              <ArtistTracklist />
            </motion.div>
          ) : (
            <motion.div
              key="farmer"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* Module 3: Mixing Desk */}
              <MixingDesk />

              {/* Module 4: Interactive Bed Map */}
              <BedMap />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 text-center">
        <div
          className="h-px max-w-xs mx-auto mb-4"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(40 30% 20%), transparent)' }}
        />
        <p className="font-mono text-[9px] tracking-wider" style={{ color: 'hsl(0 0% 20%)' }}>
          1.1-ACRE RESEARCH INCUBATOR • ROCKDALE COUNTY, GA
        </p>
        <p className="font-mono text-[8px] mt-1" style={{ color: 'hsl(0 0% 15%)' }}>
          © {new Date().getFullYear()} AGROMAJIC RECORDS • ALL FREQUENCIES RESERVED
        </p>
      </footer>
    </main>
  );
};

export default MasterBuild;
