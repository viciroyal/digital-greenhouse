import { motion, AnimatePresence } from 'framer-motion';
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
import SpectralVault from './track-detail/SpectralVault';
import SpectralVaultTrigger from './track-detail/SpectralVaultTrigger';
import { 
  BogolanPattern, 
  IncaStonePattern, 
  StarChartPattern, 
  FlowerOfLifePattern,
  SankofaBirdSvg 
} from './audio/CulturalTextures';

interface TrackDetailViewProps {
  track: TrackData | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Get civilization theming based on track number
 * Tracks 1-3: THE ROOT (Deep Red / 396Hz / Bogolan)
 * Tracks 4-6: THE FLOW (Warm Amber / 528Hz / Inca Stone)
 * Tracks 7-9: THE SIGNAL (Deep Indigo / 741Hz / Star Chart)
 * Tracks 10-12: THE CROWN (Royal Gold / 963Hz / Flower of Life)
 */
const getCivilizationTheme = (trackNumber: number) => {
  if (trackNumber >= 1 && trackNumber <= 3) {
    return {
      id: 'root',
      name: 'THE ROOT',
      frequency: '396Hz',
      baseColor: '0 60% 20%', // Deep Red
      accentColor: '0 70% 45%',
      pattern: BogolanPattern,
      patternOpacity: 0.05,
      concept: 'The woven earth of the Maroons and Mali.',
    };
  } else if (trackNumber >= 4 && trackNumber <= 6) {
    return {
      id: 'flow',
      name: 'THE FLOW',
      frequency: '528Hz',
      baseColor: '35 60% 20%', // Warm Amber/Brown
      accentColor: '45 90% 55%',
      pattern: IncaStonePattern,
      patternOpacity: 0.05,
      concept: 'The structure of the water and stone.',
    };
  } else if (trackNumber >= 7 && trackNumber <= 9) {
    return {
      id: 'signal',
      name: 'THE SIGNAL',
      frequency: '741Hz',
      baseColor: '220 50% 18%', // Deep Indigo
      accentColor: '210 70% 55%',
      pattern: StarChartPattern,
      patternOpacity: 0.08,
      concept: 'The Dogon map of the sky.',
    };
  } else {
    return {
      id: 'crown',
      name: 'THE CROWN',
      frequency: '963Hz',
      baseColor: '45 40% 18%', // Royal Gold/Brown
      accentColor: '45 80% 55%',
      pattern: FlowerOfLifePattern,
      patternOpacity: 0.10,
      concept: 'The Kemetic Grid of Alchemy.',
    };
  }
};

const TrackDetailView = ({ track, isOpen, onClose }: TrackDetailViewProps) => {
  const [isRxActivated, setIsRxActivated] = useState(false);
  const [isSpectralVaultOpen, setIsSpectralVaultOpen] = useState(false);
  
  if (!track) return null;

  // Get civilization theme based on track number
  const theme = getCivilizationTheme(track.row);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Civilization Background - Dynamic based on Track */}
          <motion.div
            className="fixed inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, hsl(${theme.accentColor} / 0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, hsl(${theme.accentColor} / 0.3) 0%, transparent 40%),
                radial-gradient(ellipse at 50% 50%, hsl(${theme.baseColor}) 0%, transparent 80%),
                linear-gradient(180deg, 
                  hsl(${theme.baseColor}) 0%, 
                  hsl(${theme.baseColor} / 0.95) 50%,
                  hsl(0 0% 5%) 100%
                )
              `,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Cultural Texture Overlay - THE VISUAL CONSTITUTION */}
          <div 
            className="fixed inset-0 pointer-events-none"
            style={{
              background: theme.pattern,
              backgroundSize: theme.id === 'signal' ? '100px 100px' : theme.id === 'crown' ? '80px 92px' : '60px 60px',
              opacity: theme.patternOpacity,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Darkroom Overlay for text legibility */}
          <div 
            className="fixed inset-0 pointer-events-none"
            style={{
              background: 'hsl(0 0% 0% / 0.20)',
              mixBlendMode: 'multiply',
            }}
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
              {/* Sankofa Return Button - "Go back and fetch it" */}
              <motion.button
                className="fixed top-4 right-4 md:top-8 md:right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-colors group"
                style={{
                  background: `hsl(${theme.baseColor} / 0.9)`,
                  border: `2px solid hsl(${theme.accentColor} / 0.5)`,
                  color: `hsl(${theme.accentColor})`,
                  backdropFilter: 'blur(10px)',
                }}
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: `0 0 25px hsl(${theme.accentColor} / 0.5)`,
                  rotate: -15 
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                title="Return to the Sound System"
              >
                <div className="w-8 h-8 transition-transform group-hover:scale-110">
                  <SankofaBirdSvg />
                </div>
              </motion.button>

              {/* Civilization Header Badge */}
              <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div 
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                  style={{
                    background: `hsl(${theme.accentColor} / 0.2)`,
                    border: `1px solid hsl(${theme.accentColor} / 0.4)`,
                  }}
                >
                  <span 
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ 
                      fontFamily: "'Staatliches', sans-serif",
                      color: `hsl(${theme.accentColor})`,
                      textShadow: `0 0 10px hsl(${theme.accentColor} / 0.5)`,
                    }}
                  >
                    {theme.name}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'hsl(40 50% 75%)' }}>
                    {theme.frequency}
                  </span>
                </div>
                <p 
                  className="text-[10px] font-mono mt-2 italic"
                  style={{ color: 'hsl(40 30% 65%)' }}
                >
                  "{theme.concept}"
                </p>
              </motion.div>

              {/* Lab Report Header with Song Title */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p 
                  className="font-mono text-xs tracking-[0.3em] uppercase mb-2"
                  style={{ color: `hsl(${theme.accentColor} / 0.9)` }}
                >
                  FREQUENCY DASHBOARD
                </p>
                {/* Song Title - Staatliches Header Font */}
                <h1 
                  className="text-3xl md:text-4xl mb-2"
                  style={{ 
                    fontFamily: "'Staatliches', sans-serif",
                    color: 'hsl(40 50% 95%)',
                    textShadow: `0 0 30px hsl(${theme.accentColor} / 0.4)`,
                    letterSpacing: '0.05em',
                  }}
                >
                  {track.track}
                </h1>
                {track.featuring && (
                  <p 
                    className="font-mono text-sm mb-2"
                    style={{ color: 'hsl(40 40% 75%)' }}
                  >
                    ft. {track.featuring}
                  </p>
                )}
                <p 
                  className="font-mono text-sm"
                  style={{ color: 'hsl(40 40% 65%)' }}
                >
                  Lab Report #{String(track.row).padStart(2, '0')}
                </p>
              </motion.div>

              {/* Function Seal - AgroMajic Protocol Designation */}
              <FunctionSeal track={track} />

              {/* Audio Player, Rx Prescription, Lunar Protocol, and Spectral Vault */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Audio Player */}
                <WaveformPlayer track={track} />
                
                {/* Rx Prescription Pad */}
                <RxPrescription track={track} onActivate={() => setIsRxActivated(true)} />

                {/* Lunar Agronomy Module */}
                <LunarAgronomyModule track={track} />

                {/* Spectral Vault Trigger */}
                <SpectralVaultTrigger track={track} onOpen={() => setIsSpectralVaultOpen(true)} />
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

              {/* Footer with Sankofa Return Prompt */}
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 opacity-40">
                    <SankofaBirdSvg />
                  </div>
                  <p 
                    className="font-body text-xs tracking-wide"
                    style={{ color: 'hsl(40 30% 55%)' }}
                  >
                    Click the Sankofa to return • ESC to close
                  </p>
                  <div className="w-6 h-6 opacity-40 transform scale-x-[-1]">
                    <SankofaBirdSvg />
                  </div>
                </div>
              </motion.div>

              {/* Spectral Vault Drawer */}
              <SpectralVault 
                track={track} 
                isOpen={isSpectralVaultOpen} 
                onClose={() => setIsSpectralVaultOpen(false)} 
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrackDetailView;
