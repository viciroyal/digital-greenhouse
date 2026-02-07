import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import type { TrackData } from '@/data/trackData';
import FunctionSeal from './track-detail/FunctionSeal';
import WaveformPlayer from './track-detail/WaveformPlayer';
import RxPrescription from './track-detail/RxPrescription';
import LunarAgronomyModule from './track-detail/LunarAgronomyModule';
import BodyQuadrant from './track-detail/BodyQuadrant';
import SkyQuadrant from './track-detail/SkyQuadrant';
import EarthQuadrant from './track-detail/EarthQuadrant';
import CrystalQuadrant from './track-detail/CrystalQuadrant';
import LogicQuadrant from './track-detail/LogicQuadrant';
import ActivationQuadrant from './track-detail/ActivationQuadrant';

interface TrackDetailViewProps {
  track: TrackData | null;
  isOpen: boolean;
  onClose: () => void;
}

const TrackDetailView = ({ track, isOpen, onClose }: TrackDetailViewProps) => {
  const [isRxActivated, setIsRxActivated] = useState(false);
  
  if (!track) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background overlay with frequency color */}
          <motion.div
            className="fixed inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, hsl(${track.colorHsl} / 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, hsl(${track.colorHsl} / 0.2) 0%, transparent 40%),
                radial-gradient(ellipse at 50% 50%, hsl(${track.colorHsl} / 0.1) 0%, transparent 60%),
                linear-gradient(180deg, 
                  hsl(10 25% 12%) 0%, 
                  hsl(10 25% 8%) 50%,
                  hsl(0 100% 5%) 100%
                )
              `,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Noise texture overlay */}
          <div 
            className="fixed inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <motion.div
            className="relative min-h-screen px-4 py-8 md:py-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ delay: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-6xl mx-auto">
              {/* Close button */}
              <motion.button
                className="fixed top-4 right-4 md:top-8 md:right-8 z-50 w-12 h-12 rounded-full glass-card-strong flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                <X size={24} />
              </motion.button>

              {/* Lab Report Header */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p 
                  className="font-mono text-xs tracking-[0.3em] uppercase mb-2"
                  style={{ color: `hsl(${track.colorHsl} / 0.8)` }}
                >
                  FREQUENCY DASHBOARD
                </p>
                <h1 className="font-display text-2xl text-muted-foreground">
                  Lab Report #{String(track.row).padStart(2, '0')}
                </h1>
              </motion.div>

              {/* Function Seal - AgroMajic Protocol Designation */}
              <FunctionSeal track={track} />

              {/* Audio Player and Rx Prescription - Side by Side */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Audio Player */}
                <WaveformPlayer track={track} />
                
                {/* Rx Prescription Pad */}
                <RxPrescription track={track} onActivate={() => setIsRxActivated(true)} />

                {/* Lunar Agronomy Module */}
                <LunarAgronomyModule track={track} />
              </div>

              {/* Data Quadrants Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Quadrant A: The Body */}
                <BodyQuadrant track={track} />

                {/* Quadrant B: The Sky */}
                <SkyQuadrant track={track} />

                {/* Quadrant C: The Earth (Mineral) */}
                <EarthQuadrant track={track} />

                {/* Quadrant D: The Crystal */}
                <CrystalQuadrant track={track} />

                {/* Quadrant E: The Logic */}
                <LogicQuadrant track={track} />

                {/* Quadrant F: The Activation (The Ritual) */}
                <ActivationQuadrant track={track} />
              </div>

              {/* Footer with Producer Credits */}
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div 
                  className="inline-block px-8 py-3 rounded-full border"
                  style={{ 
                    borderColor: `hsl(${track.colorHsl} / 0.3)`,
                    background: `linear-gradient(90deg, hsl(${track.colorHsl} / 0.1), transparent, hsl(${track.colorHsl} / 0.1))`
                  }}
                >
                  <p className="font-mono text-sm text-muted-foreground">
                    <span style={{ color: `hsl(${track.colorHsl})` }}>{track.chakra}</span>
                    {' · '}
                    <span className="text-throne-gold">{track.frequency}</span>
                    {' · '}
                    <span style={{ color: `hsl(${track.colorHsl})` }}>{track.crystal}</span>
                  </p>
                </div>

                {/* Producer credits in footer */}
                <p className="mt-4 font-mono text-xs text-muted-foreground/60">
                  Produced by <strong className="text-throne-gold font-bold">Vici Royàl</strong> & <span className="text-throne-gold">Èks</span>
                </p>

                <p className="mt-4 font-mono text-xs text-muted-foreground/40">
                  Press ESC or click outside to close
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrackDetailView;
