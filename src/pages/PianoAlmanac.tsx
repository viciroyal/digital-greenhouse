import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Eye, Settings, Droplets, Leaf, Calendar } from 'lucide-react';
import { 
  useGardenBeds, 
  useBedPlantings, 
  useAllBedPlantings,
  GardenBed 
} from '@/hooks/useGardenBeds';
import { useAdminRole } from '@/hooks/useAdminRole';
import PianoWheel from '@/components/piano-almanac/PianoWheel';
import PreparationCard from '@/components/piano-almanac/PreparationCard';
import BrixValidationPanel from '@/components/piano-almanac/BrixValidationPanel';
import WaterValveControl from '@/components/piano-almanac/WaterValveControl';
import MaintenanceRiffs from '@/components/piano-almanac/MaintenanceRiffs';
import RotationWarning from '@/components/piano-almanac/RotationWarning';
import { useMasterCrops } from '@/hooks/useMasterCrops';
import { SovereigntyFooter } from '@/components/almanac';

/**
 * AGROMAJIC PIANO ALMANAC
 * Mobile-first circular wheel interface for garden bed management
 */

const PianoAlmanac = () => {
  const navigate = useNavigate();
  const [selectedBed, setSelectedBed] = useState<GardenBed | null>(null);
  const [simpleMode, setSimpleMode] = useState(true);
  
  const { data: beds = [], isLoading: bedsLoading } = useGardenBeds();
  const { data: plantings = [] } = useBedPlantings(selectedBed?.id || null);
  const { data: allPlantingsMap = {} } = useAllBedPlantings();
  const { data: allCrops = [] } = useMasterCrops();
  const { isAdmin, loading: adminLoading } = useAdminRole();

  const handleSelectBed = (bed: GardenBed) => {
    setSelectedBed(bed);
  };

  const handleCloseBedDetail = () => {
    setSelectedBed(null);
  };

  const isLoading = bedsLoading || adminLoading;

  // Get root crop for selected bed (for rotation warnings)
  const rootPlanting = plantings.find(p => p.crop?.chord_interval === 'Root (Lead)');
  const rootCrop = rootPlanting?.crop ? allCrops.find(c => c.id === rootPlanting.crop_id) : null;

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between bg-white border-b-2 border-gray-200">
        <motion.button
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/ancestral-path')}
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </motion.button>

        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-600" />
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Piano Almanac
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Simple/Farmer Mode Toggle */}
          <button
            onClick={() => setSimpleMode(!simpleMode)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              simpleMode 
                ? 'bg-green-100 text-green-700' 
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            {simpleMode ? '♪ SIMPLE' : '⚙ FARMER'}
          </button>

          {/* Admin/Member Badge */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
              isAdmin 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {isAdmin ? (
              <>
                <Settings className="w-3 h-3" />
                ADMIN
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                VIEW
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Piano Wheel */}
        <PianoWheel
          beds={beds}
          selectedBedId={selectedBed?.id || null}
          onSelectBed={handleSelectBed}
          bedPlantingsMap={allPlantingsMap}
          isLoading={isLoading}
          simpleMode={simpleMode}
        />

        {/* Selected Bed Details */}
        <AnimatePresence>
          {selectedBed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              {/* Rotation Warning */}
              {rootCrop && (
                <RotationWarning
                  bedId={selectedBed.id}
                  currentInstrumentType={rootCrop.instrument_type}
                  frequencyHz={selectedBed.frequency_hz}
                />
              )}

              {/* Preparation Card */}
              <PreparationCard
                bed={selectedBed}
                plantings={plantings}
                allCrops={allCrops}
                isAdmin={isAdmin}
                simpleMode={simpleMode}
                onClose={handleCloseBedDetail}
              />

              {/* Brix Validation Panel (Admin Only) */}
              {isAdmin && (
                <BrixValidationPanel
                  bed={selectedBed}
                  isAdmin={isAdmin}
                  simpleMode={simpleMode}
                />
              )}

              {/* Water Valve Control */}
              <WaterValveControl
                bed={selectedBed}
                isAdmin={isAdmin}
              />

              {/* Maintenance Riffs */}
              {rootPlanting && (
                <MaintenanceRiffs
                  plantedAt={rootPlanting.planted_at}
                  bedNumber={selectedBed.bed_number}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone Quick Stats */}
        {!selectedBed && (
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="text-sm font-bold text-green-800">Tuned Beds</span>
              </div>
              <span className="text-3xl font-bold text-green-600">
                {Object.values(allPlantingsMap).filter(p => 
                  ['Root (Lead)', '3rd (Triad)', '5th (Stabilizer)', '7th (Signal)'].every(
                    interval => p.some(pl => pl.crop?.chord_interval === interval)
                  )
                ).length}
              </span>
              <span className="text-sm text-green-600"> / {beds.length}</span>
            </motion.div>

            <motion.div 
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-blue-800">Network Active</span>
              </div>
              <span className="text-3xl font-bold text-blue-600">
                {beds.filter(b => b.inoculant_type !== null).length}
              </span>
              <span className="text-sm text-blue-600"> zones</span>
            </motion.div>
          </div>
        )}
      </div>

      {/* Sovereignty Footer */}
      <SovereigntyFooter />
    </main>
  );
};

export default PianoAlmanac;
