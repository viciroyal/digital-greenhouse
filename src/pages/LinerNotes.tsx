import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Disc, Signal, Headphones, Music2, Waves, Award } from 'lucide-react';
import { useGardenBeds, useAllBedPlantings, BedPlanting } from '@/hooks/useGardenBeds';
import LinerNotesTrack from '@/components/liner-notes/LinerNotesTrack';
import FidelityMeter from '@/components/liner-notes/FidelityMeter';

/**
 * LINER NOTES
 * CSA members scan their box QR code and arrive here.
 * Lab results presented as album liner notes.
 * Brix = Fidelity Rating (12 = Standard Def → 24 = Studio Master)
 */

const MOVEMENT_NAMES = [
  'The Root Awakening',
  'The Flow State',
  'The Solar Alchemy',
  'The Heart Integration',
  'The Signal Expression',
  'The Vision Quest',
  'The Source Shield',
];

const getMovementName = (): string => {
  const week = Math.floor(Date.now() / (7 * 86400000));
  return MOVEMENT_NAMES[week % MOVEMENT_NAMES.length];
};

const getSeasonLabel = (): string => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'Spring Movement';
  if (month >= 5 && month <= 7) return 'Summer Movement';
  if (month >= 8 && month <= 10) return 'Autumn Movement';
  return 'Winter Movement';
};

const LinerNotes = () => {
  const navigate = useNavigate();
  const { data: beds = [] } = useGardenBeds();
  const { data: allPlantingsMap = {} } = useAllBedPlantings();

  const movementName = getMovementName();
  const seasonLabel = getSeasonLabel();

  // Collect beds that have Brix readings (these are the "tracks" on this week's "album")
  const tracksWithData = beds
    .filter(bed => bed.internal_brix !== null)
    .sort((a, b) => (b.internal_brix || 0) - (a.internal_brix || 0));

  // Average fidelity across all measured beds
  const avgBrix = tracksWithData.length > 0
    ? tracksWithData.reduce((sum, b) => sum + (b.internal_brix || 0), 0) / tracksWithData.length
    : 0;

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Deep vinyl-black background */}
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(30 15% 4%) 0%, hsl(20 20% 3%) 50%, hsl(0 0% 2%) 100%)',
        }}
      />

      {/* Subtle vinyl groove texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `repeating-radial-gradient(circle at 50% 30%, transparent 0px, transparent 18px, hsl(0 0% 30%) 19px, transparent 20px)`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-3 flex items-center justify-between">
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'hsl(20 20% 10%)',
            border: '1px solid hsl(40 30% 25%)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: 'hsl(40 50% 55%)' }} />
          <span className="font-mono text-xs hidden sm:inline" style={{ color: 'hsl(40 50% 55%)' }}>
            BACK
          </span>
        </motion.button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: 'hsl(45 60% 50% / 0.08)',
            border: '1px solid hsl(45 60% 40% / 0.3)',
          }}
        >
          <Headphones className="w-4 h-4" style={{ color: 'hsl(45 70% 55%)' }} />
          <span className="font-mono text-[10px] tracking-wider" style={{ color: 'hsl(45 60% 55%)' }}>
            LINER NOTES
          </span>
        </div>
      </header>

      {/* Album Cover / Title Block */}
      <motion.div
        className="relative z-10 px-6 py-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Vinyl disc icon */}
        <motion.div
          className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, hsl(0 0% 15%) 30%, hsl(0 0% 8%) 70%, hsl(0 0% 4%) 100%)',
            border: '2px solid hsl(40 30% 20%)',
            boxShadow: '0 0 40px hsl(40 40% 15% / 0.3), inset 0 0 20px hsl(0 0% 0% / 0.5)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="w-6 h-6 rounded-full"
            style={{ background: 'hsl(45 60% 45%)', boxShadow: '0 0 10px hsl(45 60% 50% / 0.4)' }}
          />
        </motion.div>

        <p className="font-mono text-[10px] tracking-[0.3em] mb-1" style={{ color: 'hsl(40 40% 45%)' }}>
          {seasonLabel.toUpperCase()} • {new Date().getFullYear()}
        </p>
        <h1
          className="text-3xl md:text-4xl tracking-[0.12em] mb-2"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            color: 'hsl(45 80% 65%)',
            textShadow: '0 0 30px hsl(45 60% 30% / 0.5)',
          }}
        >
          {movementName.toUpperCase()}
        </h1>
        <p className="font-mono text-xs" style={{ color: 'hsl(30 30% 45%)' }}>
          Performed by <span style={{ color: 'hsl(45 60% 55%)' }}>AgroMajic Ensemble</span> • Recorded Live on Sovereign Soil
        </p>
      </motion.div>

      {/* Overall Fidelity Rating */}
      <div className="relative z-10 px-6 mb-6">
        <FidelityMeter brix={avgBrix} trackCount={tracksWithData.length} />
      </div>

      {/* Track Listing (Beds as Tracks) */}
      <div className="relative z-10 px-4 pb-4">
        <div className="max-w-xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center gap-2 mb-4 px-2">
            <Music2 className="w-4 h-4" style={{ color: 'hsl(0 0% 35%)' }} />
            <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: 'hsl(0 0% 40%)' }}>
              TRACKLIST — THIS WEEK'S HARVEST
            </span>
          </div>

          {tracksWithData.length === 0 ? (
            <motion.div
              className="text-center py-12 rounded-xl"
              style={{ background: 'hsl(0 0% 5%)', border: '1px solid hsl(0 0% 12%)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Disc className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(0 0% 20%)' }} />
              <p className="font-mono text-xs" style={{ color: 'hsl(0 0% 30%)' }}>
                This week's recordings are still in progress.
              </p>
              <p className="font-mono text-[10px] mt-1" style={{ color: 'hsl(0 0% 22%)' }}>
                Check back when the harvest drops.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {tracksWithData.map((bed, i) => (
                <LinerNotesTrack
                  key={bed.id}
                  bed={bed}
                  plantings={allPlantingsMap[bed.id] || []}
                  trackNumber={i + 1}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fidelity Legend */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-xl mx-auto">
          <div
            className="p-5 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, hsl(30 15% 8%), hsl(20 10% 6%))',
              border: '1px solid hsl(30 20% 18%)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />
              <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: 'hsl(40 40% 50%)' }}>
                FIDELITY GUIDE
              </span>
            </div>
            <div className="space-y-2">
              {[
                { range: '20–24', label: 'Studio Master', desc: 'Ultra high-fidelity. Peak nutrient density.', color: 'hsl(45 90% 60%)' },
                { range: '15–19', label: 'High Fidelity', desc: 'Rich, full-spectrum recording.', color: 'hsl(120 50% 50%)' },
                { range: '12–14', label: 'Standard Definition', desc: 'Clean signal. Room to grow.', color: 'hsl(51 70% 55%)' },
                { range: '< 12', label: 'Lo-Fi / Static', desc: 'Needs re-tuning. Apply the Master Mix.', color: 'hsl(0 50% 50%)' },
              ].map(tier => (
                <div key={tier.range} className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ background: tier.color, boxShadow: `0 0 6px ${tier.color}` }}
                  />
                  <div>
                    <span className="font-mono text-xs font-bold" style={{ color: tier.color }}>
                      {tier.range}° — {tier.label}
                    </span>
                    <p className="font-mono text-[10px]" style={{ color: 'hsl(0 0% 40%)' }}>
                      {tier.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Credits Footer */}
      <footer className="relative z-10 px-6 py-8 text-center">
        <div
          className="h-px max-w-xs mx-auto mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(40 30% 20%), transparent)' }}
        />
        <p className="font-mono text-[10px] tracking-wider" style={{ color: 'hsl(0 0% 25%)' }}>
          MASTERED ON SOVEREIGN SOIL
        </p>
        <p className="font-mono text-[9px] mt-1" style={{ color: 'hsl(0 0% 18%)' }}>
          © {new Date().getFullYear()} AGROMAJIC RECORDS • ALL FREQUENCIES RESERVED
        </p>
      </footer>
    </main>
  );
};

export default LinerNotes;
