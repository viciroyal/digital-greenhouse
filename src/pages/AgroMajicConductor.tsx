import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Shield, Eye, Settings, Loader2, Zap } from 'lucide-react';
import { BedGrid, BedDetailPanel, SevenPillarsSidebar, LiveFeed } from '@/components/conductor';
import { SovereigntyFooter } from '@/components/almanac';
import { 
  useGardenBeds, 
  useBedPlantings, 
  useSevenPillars, 
  useAllBedPlantings,
  GardenBed 
} from '@/hooks/useGardenBeds';
import { useAdminRole } from '@/hooks/useAdminRole';

/**
 * AGROMAJIC CONDUCTOR
 * 44-Bed Garden Management System with Frequency Filtering & Role-Based Access
 */

const AgroMajicConductor = () => {
  const navigate = useNavigate();
  const [selectedBed, setSelectedBed] = useState<GardenBed | null>(null);
  const [showPillars, setShowPillars] = useState(true);
  const [jazzMode, setJazzMode] = useState(false);
  
  const { data: beds = [], isLoading: bedsLoading } = useGardenBeds();
  const { data: plantings = [], isLoading: plantingsLoading } = useBedPlantings(selectedBed?.id || null);
  const { data: allPlantingsMap = {}, isLoading: allPlantingsLoading } = useAllBedPlantings();
  const { data: pillars = [], isLoading: pillarsLoading } = useSevenPillars();
  const { isAdmin, loading: adminLoading } = useAdminRole();

  const handleSelectBed = (bed: GardenBed) => {
    setSelectedBed(bed);
  };

  const handleCloseBedDetail = () => {
    setSelectedBed(null);
  };

  const isLoading = bedsLoading || adminLoading;

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Background */}
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(20 30% 4%) 0%, hsl(270 15% 3%) 100%)',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(0 0% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-4 flex items-center justify-between">
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'hsl(20 30% 12%)',
            border: '2px solid hsl(270 40% 40%)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/ancestral-path')}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(270 50% 65%)' }} />
          <span
            className="font-mono text-sm hidden sm:inline"
            style={{ color: 'hsl(270 50% 65%)' }}
          >
            RETURN
          </span>
        </motion.button>

        <div className="flex items-center gap-2">
          {/* Admin/Member Mode Indicator */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{
              background: isAdmin ? 'hsl(45 80% 50% / 0.15)' : 'hsl(210 60% 50% / 0.15)',
              border: `2px solid ${isAdmin ? 'hsl(45 80% 55%)' : 'hsl(210 60% 55%)'}`,
            }}
          >
            {isAdmin ? (
              <>
                <Settings className="w-4 h-4" style={{ color: 'hsl(45 90% 60%)' }} />
                <span className="text-[10px] font-mono tracking-wider" style={{ color: 'hsl(45 80% 65%)' }}>
                  ADMIN
                </span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" style={{ color: 'hsl(210 70% 60%)' }} />
                <span className="text-[10px] font-mono tracking-wider" style={{ color: 'hsl(210 60% 65%)' }}>
                  MEMBER
                </span>
              </>
            )}
          </div>

          {/* Jazz Mode Toggle */}
          <motion.button
            onClick={() => setJazzMode(!jazzMode)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full"
            style={{
              background: jazzMode ? 'hsl(45 70% 20%)' : 'hsl(0 0% 12%)',
              border: `2px solid ${jazzMode ? 'hsl(45 80% 55%)' : 'hsl(0 0% 25%)'}`,
              boxShadow: jazzMode ? '0 0 15px hsl(45 80% 50% / 0.3)' : 'none',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-4 h-4" style={{ color: jazzMode ? 'hsl(45 90% 65%)' : 'hsl(0 0% 45%)' }} />
            <span className="text-[10px] font-mono tracking-wider" style={{ color: jazzMode ? 'hsl(45 90% 65%)' : 'hsl(0 0% 50%)' }}>
              JAZZ
            </span>
          </motion.button>

          {/* Toggle Pillars */}
          <button
            onClick={() => setShowPillars(!showPillars)}
            className="p-2 rounded-lg transition-colors"
            style={{
              background: showPillars ? 'hsl(270 30% 25%)' : 'hsl(0 0% 15%)',
              border: '1px solid hsl(270 30% 35%)',
            }}
          >
            <Shield className="w-5 h-5" style={{ color: 'hsl(270 50% 60%)' }} />
          </button>
        </div>
      </header>

      {/* Title */}
      <div className="relative z-10 text-center px-4 mb-6">
        <motion.div
          className="flex items-center justify-center gap-3 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Music className="w-8 h-8" style={{ color: 'hsl(270 60% 60%)' }} />
          <h1
            className="text-3xl md:text-5xl tracking-[0.15em]"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(270 70% 70%)',
              textShadow: '0 0 30px hsl(270 60% 40% / 0.5), 2px 2px 0 hsl(20 40% 10%)',
            }}
          >
            AGROMAJIC CONDUCTOR
          </h1>
        </motion.div>
        <motion.p
          className="text-sm font-mono"
          style={{ color: 'hsl(270 40% 55%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          44-Bed Harmonic Farm Grid • Frequency-Locked Planting
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className={`grid gap-6 ${showPillars ? 'lg:grid-cols-[1fr_280px]' : 'grid-cols-1'}`}>
            {/* Left: Bed Grid + Detail Panel */}
            <div className="space-y-6">
              {/* Zone Legend */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { name: 'Root', hz: 396, color: 'hsl(0 60% 50%)' },
                  { name: 'Flow', hz: 417, color: 'hsl(30 70% 50%)' },
                  { name: 'Solar', hz: 528, color: 'hsl(51 80% 50%)' },
                  { name: 'Heart', hz: 639, color: 'hsl(120 50% 45%)' },
                  { name: 'Voice', hz: 741, color: 'hsl(210 60% 50%)' },
                  { name: 'Vision', hz: 852, color: 'hsl(270 50% 50%)' },
                  { name: 'Shield', hz: 963, color: 'hsl(300 50% 50%)' },
                ].map((zone) => (
                  <div
                    key={zone.hz}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                    style={{ background: `${zone.color}15`, border: `1px solid ${zone.color}40` }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: zone.color }}
                    />
                    <span className="text-[10px] font-mono" style={{ color: zone.color }}>
                      {zone.hz}Hz
                    </span>
                  </div>
                ))}
              </div>

              {/* Grid Container */}
              <div
                className="p-4 rounded-xl"
                style={{
                  background: 'hsl(0 0% 6%)',
                  border: '2px solid hsl(0 0% 15%)',
                }}
              >
                <BedGrid
                  beds={beds}
                  selectedBedId={selectedBed?.id || null}
                  onSelectBed={handleSelectBed}
                  isAdmin={isAdmin}
                  isLoading={isLoading}
                  bedPlantingsMap={allPlantingsMap}
                />
              </div>

              {/* THE LIVE FEED */}
              <LiveFeed
                beds={beds}
                bedPlantingsMap={allPlantingsMap}
              />

              {/* Bed Detail Panel */}
              <AnimatePresence>
                {selectedBed && (
                  <BedDetailPanel
                    bed={selectedBed}
                    plantings={plantings}
                    isAdmin={isAdmin}
                    jazzMode={jazzMode}
                    onClose={handleCloseBedDetail}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Right: Seven Pillars Sidebar */}
            {showPillars && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:sticky lg:top-4 h-fit"
              >
                <SevenPillarsSidebar
                  pillars={pillars}
                  isAdmin={isAdmin}
                  isLoading={pillarsLoading}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Yield Formula Reference */}
      <div className="relative z-10 px-4 py-6 max-w-2xl mx-auto">
        <div
          className="p-4 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, hsl(45 30% 10%), hsl(35 25% 8%))',
            border: '1px solid hsl(45 40% 25%)',
          }}
        >
          <h4 className="text-xs font-mono tracking-wider mb-2" style={{ color: 'hsl(45 60% 60%)' }}>
            📐 YIELD CALCULATOR FORMULA
          </h4>
          <p className="text-[11px] font-mono" style={{ color: 'hsl(45 40% 50%)' }}>
            Plant Count = (Length × Width) ÷ (Spacing² × 0.866)
          </p>
          <p className="text-[10px] font-mono mt-1" style={{ color: 'hsl(0 0% 45%)' }}>
            Hexagonal spacing optimization • Custom bed dimensions supported
          </p>
        </div>
      </div>

      {/* Sovereignty Footer */}
      <SovereigntyFooter />
    </main>
  );
};

export default AgroMajicConductor;
