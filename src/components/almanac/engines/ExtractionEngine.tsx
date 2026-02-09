import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Zap,
  Trophy,
  AlertTriangle,
  Droplets,
  Plus,
  Trash2,
  TrendingUp,
  Medal,
  Beaker,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE EXTRACTION ENGINE (Harvest Logic)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CONCEPT: Every harvest is a data point. It must be linked back to the Zone
 * to prove the method worked.
 * 
 * LOGIC:
 * - Brix ≥ 12 → Tag as "Premium/Medicine"
 * - Brix < 12 → Tag as "Standard/Processing"
 * - High Yield + Low Brix → "Dilution Error" alert for The Hydrologist
 */

// Storage key
const STORAGE_KEY = 'pharmer-harvest-log';

// Crop zones for linking back
const CROP_ZONES: Record<string, { hz: number; zone: string; color: string }> = {
  'Tomatoes': { hz: 741, zone: 'Throat', color: 'hsl(210 60% 50%)' },
  'Peppers': { hz: 741, zone: 'Throat', color: 'hsl(210 60% 50%)' },
  'Blueberries': { hz: 741, zone: 'Throat', color: 'hsl(210 60% 50%)' },
  'Corn': { hz: 528, zone: 'Solar', color: 'hsl(51 80% 50%)' },
  'Beans': { hz: 528, zone: 'Solar', color: 'hsl(51 80% 50%)' },
  'Squash': { hz: 417, zone: 'Sacral', color: 'hsl(30 70% 50%)' },
  'Cucumbers': { hz: 417, zone: 'Sacral', color: 'hsl(30 70% 50%)' },
  'Kale': { hz: 639, zone: 'Heart', color: 'hsl(120 50% 45%)' },
  'Lettuce': { hz: 639, zone: 'Heart', color: 'hsl(120 50% 45%)' },
  'Spinach': { hz: 639, zone: 'Heart', color: 'hsl(120 50% 45%)' },
  'Carrots': { hz: 396, zone: 'Root', color: 'hsl(0 60% 50%)' },
  'Beets': { hz: 396, zone: 'Root', color: 'hsl(0 60% 50%)' },
  'Potatoes': { hz: 396, zone: 'Root', color: 'hsl(0 60% 50%)' },
  'Garlic': { hz: 963, zone: 'Crown', color: 'hsl(300 50% 50%)' },
  'Onions': { hz: 963, zone: 'Crown', color: 'hsl(300 50% 50%)' },
};

interface HarvestEntry {
  id: string;
  crop: string;
  weightLbs: number;
  brix: number;
  quality: 'premium' | 'standard';
  zone: string;
  hz: number;
  timestamp: string;
  dilutionError?: boolean;
}

type SelectedCrop = keyof typeof CROP_ZONES;

const ExtractionEngine = () => {
  // Harvest log (persisted)
  const [harvests, setHarvests] = useState<HarvestEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  
  // Input state
  const [selectedCrop, setSelectedCrop] = useState<SelectedCrop>('Tomatoes');
  const [weight, setWeight] = useState<number>(5);
  const [brix, setBrix] = useState<number>(12);
  
  // Dilution error alert
  const [showDilutionAlert, setShowDilutionAlert] = useState(false);
  
  // Persist harvests
  const saveHarvests = useCallback((newHarvests: HarvestEntry[]) => {
    setHarvests(newHarvests);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHarvests));
  }, []);
  
  // Calculate quality and log harvest
  const logHarvest = useCallback(() => {
    const quality: 'premium' | 'standard' = brix >= 12 ? 'premium' : 'standard';
    const cropInfo = CROP_ZONES[selectedCrop];
    
    // Check for Dilution Error: High Yield (>10 lbs) but Low Brix (<12)
    const dilutionError = weight > 10 && brix < 12;
    
    const entry: HarvestEntry = {
      id: `harvest-${Date.now()}`,
      crop: selectedCrop,
      weightLbs: weight,
      brix,
      quality,
      zone: cropInfo.zone,
      hz: cropInfo.hz,
      timestamp: new Date().toISOString(),
      dilutionError,
    };
    
    saveHarvests([entry, ...harvests.slice(0, 49)]);
    
    if (dilutionError) {
      setShowDilutionAlert(true);
    }
  }, [selectedCrop, weight, brix, harvests, saveHarvests]);
  
  // Delete entry
  const deleteEntry = useCallback((id: string) => {
    saveHarvests(harvests.filter(h => h.id !== id));
  }, [harvests, saveHarvests]);
  
  // Stats
  const stats = useMemo(() => {
    const totalWeight = harvests.reduce((sum, h) => sum + h.weightLbs, 0);
    const premiumCount = harvests.filter(h => h.quality === 'premium').length;
    const avgBrix = harvests.length > 0 
      ? harvests.reduce((sum, h) => sum + h.brix, 0) / harvests.length 
      : 0;
    const dilutionErrors = harvests.filter(h => h.dilutionError).length;
    
    return { totalWeight, premiumCount, avgBrix, dilutionErrors };
  }, [harvests]);
  
  const cropOptions = Object.keys(CROP_ZONES) as SelectedCrop[];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(120 20% 10%), hsl(120 15% 6%))',
        border: '2px solid hsl(120 40% 35%)',
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: 'linear-gradient(135deg, hsl(120 25% 15%), hsl(120 20% 10%))',
          borderBottom: '1px solid hsl(120 30% 25%)',
        }}
      >
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5" style={{ color: 'hsl(120 50% 55%)' }} />
          <h3
            className="text-lg tracking-wider"
            style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(120 50% 60%)' }}
          >
            EXTRACTION ENGINE
          </h3>
        </div>
        <p className="text-[10px] font-mono mt-1" style={{ color: 'hsl(120 30% 50%)' }}>
          Harvest Logic • Every Harvest is a Data Point
        </p>
      </div>

      {/* Stats Row */}
      <div className="p-4 grid grid-cols-4 gap-2">
        <div
          className="p-2 rounded-lg text-center"
          style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(120 30% 30%)' }}
        >
          <TrendingUp className="w-4 h-4 mx-auto mb-1" style={{ color: 'hsl(120 50% 55%)' }} />
          <span className="text-xs font-mono font-bold block" style={{ color: 'hsl(120 50% 60%)' }}>
            {stats.totalWeight.toFixed(1)}
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>TOTAL LBS</span>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(45 50% 40%)' }}
        >
          <Medal className="w-4 h-4 mx-auto mb-1" style={{ color: 'hsl(45 70% 55%)' }} />
          <span className="text-xs font-mono font-bold block" style={{ color: 'hsl(45 70% 60%)' }}>
            {stats.premiumCount}
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>PREMIUM</span>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(195 50% 40%)' }}
        >
          <Beaker className="w-4 h-4 mx-auto mb-1" style={{ color: 'hsl(195 60% 55%)' }} />
          <span className="text-xs font-mono font-bold block" style={{ color: 'hsl(195 60% 60%)' }}>
            {stats.avgBrix.toFixed(1)}
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>AVG BRIX</span>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ 
            background: stats.dilutionErrors > 0 ? 'hsl(30 30% 15%)' : 'hsl(0 0% 10%)', 
            border: `1px solid ${stats.dilutionErrors > 0 ? 'hsl(30 60% 50%)' : 'hsl(0 0% 25%)'}` 
          }}
        >
          <Droplets className="w-4 h-4 mx-auto mb-1" style={{ color: stats.dilutionErrors > 0 ? 'hsl(30 70% 55%)' : 'hsl(0 0% 45%)' }} />
          <span className="text-xs font-mono font-bold block" style={{ color: stats.dilutionErrors > 0 ? 'hsl(30 70% 60%)' : 'hsl(0 0% 50%)' }}>
            {stats.dilutionErrors}
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>DILUTION</span>
        </div>
      </div>

      {/* Dilution Alert */}
      <AnimatePresence>
        {showDilutionAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2"
          >
            <div
              className="rounded-lg p-3"
              style={{
                background: 'linear-gradient(135deg, hsl(30 30% 15%), hsl(30 25% 10%))',
                border: '2px solid hsl(30 60% 50%)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" style={{ color: 'hsl(30 70% 55%)' }} />
                <span className="text-sm font-mono font-bold" style={{ color: 'hsl(30 70% 60%)' }}>
                  DILUTION ERROR DETECTED
                </span>
              </div>
              <p className="text-xs font-mono mb-2" style={{ color: 'hsl(0 0% 60%)' }}>
                High Yield but Low Brix. Feedback for <span style={{ color: 'hsl(30 70% 55%)' }}>THE HYDROLOGIST</span>:
              </p>
              <p className="text-[11px] font-mono" style={{ color: 'hsl(30 60% 70%)' }}>
                "Too much water? Reduce irrigation frequency. Quality over quantity."
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDilutionAlert(false)}
                className="mt-2 text-[10px]"
                style={{ background: 'hsl(0 0% 12%)', borderColor: 'hsl(30 40% 40%)', color: 'hsl(30 50% 60%)' }}
              >
                ACKNOWLEDGE
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <div className="p-4">
        <span className="text-xs font-mono tracking-widest block mb-3" style={{ color: 'hsl(120 40% 55%)' }}>
          THE SURVEYOR'S LOG:
        </span>
        
        {/* Crop Selection */}
        <div className="mb-3">
          <label className="text-[10px] font-mono block mb-1" style={{ color: 'hsl(0 0% 50%)' }}>
            CROP:
          </label>
          <div className="flex flex-wrap gap-1">
            {cropOptions.map((crop) => {
              const info = CROP_ZONES[crop];
              const isActive = selectedCrop === crop;
              return (
                <button
                  key={crop}
                  onClick={() => setSelectedCrop(crop)}
                  className="text-[9px] font-mono px-2 py-1 rounded transition-all"
                  style={{
                    background: isActive ? `${info.color}30` : 'hsl(0 0% 12%)',
                    border: `1px solid ${isActive ? info.color : 'hsl(0 0% 25%)'}`,
                    color: isActive ? info.color : 'hsl(0 0% 55%)',
                  }}
                >
                  {crop}
                </button>
              );
            })}
          </div>
          <span className="text-[9px] font-mono mt-1 block" style={{ color: CROP_ZONES[selectedCrop].color }}>
            Zone: {CROP_ZONES[selectedCrop].zone} ({CROP_ZONES[selectedCrop].hz}Hz)
          </span>
        </div>
        
        {/* Weight & Brix Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-[10px] font-mono block mb-1" style={{ color: 'hsl(0 0% 50%)' }}>
              WEIGHT (lbs):
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0))}
              step="0.5"
              min="0.1"
              className="w-full px-3 py-2 rounded-lg text-sm font-mono"
              style={{
                background: 'hsl(0 0% 10%)',
                border: '1px solid hsl(0 0% 25%)',
                color: 'hsl(0 0% 80%)',
              }}
            />
          </div>
          <div>
            <label className="text-[10px] font-mono block mb-1" style={{ color: 'hsl(0 0% 50%)' }}>
              BRIX AT HARVEST:
            </label>
            <input
              type="number"
              value={brix}
              onChange={(e) => setBrix(Math.max(0, Math.min(30, parseFloat(e.target.value) || 0)))}
              step="0.5"
              min="0"
              max="30"
              className="w-full px-3 py-2 rounded-lg text-sm font-mono"
              style={{
                background: 'hsl(0 0% 10%)',
                border: `1px solid ${brix >= 12 ? 'hsl(120 50% 40%)' : 'hsl(0 50% 40%)'}`,
                color: brix >= 12 ? 'hsl(120 50% 60%)' : 'hsl(0 50% 60%)',
              }}
            />
          </div>
        </div>
        
        {/* Quality Preview */}
        <div
          className="flex items-center justify-between p-3 rounded-lg mb-3"
          style={{
            background: brix >= 12 ? 'hsl(45 30% 12%)' : 'hsl(0 0% 10%)',
            border: `2px solid ${brix >= 12 ? 'hsl(45 60% 50%)' : 'hsl(0 0% 30%)'}`,
          }}
        >
          <div className="flex items-center gap-2">
            {brix >= 12 ? (
              <Trophy className="w-5 h-5" style={{ color: 'hsl(45 70% 55%)' }} />
            ) : (
              <Beaker className="w-5 h-5" style={{ color: 'hsl(0 0% 50%)' }} />
            )}
            <span className="text-sm font-mono font-bold" style={{ color: brix >= 12 ? 'hsl(45 70% 60%)' : 'hsl(0 0% 55%)' }}>
              {brix >= 12 ? 'PREMIUM / MEDICINE' : 'STANDARD / PROCESSING'}
            </span>
          </div>
          <Zap className="w-4 h-4" style={{ color: brix >= 12 ? 'hsl(45 70% 55%)' : 'hsl(0 0% 40%)' }} />
        </div>
        
        {/* Log Button */}
        <Button
          onClick={logHarvest}
          className="w-full"
          style={{
            background: 'linear-gradient(135deg, hsl(120 40% 30%), hsl(120 35% 25%))',
            border: '2px solid hsl(120 50% 40%)',
            color: 'hsl(120 50% 70%)',
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          LOG HARVEST
        </Button>
      </div>

      {/* Harvest Log */}
      {harvests.length > 0 && (
        <div className="p-4 pt-0">
          <span className="text-xs font-mono tracking-widest block mb-2" style={{ color: 'hsl(0 0% 45%)' }}>
            RECENT HARVESTS ({harvests.length}):
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {harvests.slice(0, 5).map((entry) => {
              const cropInfo = CROP_ZONES[entry.crop as SelectedCrop] || { color: 'hsl(0 0% 50%)' };
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 p-2 rounded-lg"
                  style={{
                    background: entry.dilutionError ? 'hsl(30 20% 12%)' : 'hsl(0 0% 10%)',
                    border: `1px solid ${entry.dilutionError ? 'hsl(30 50% 45%)' : entry.quality === 'premium' ? 'hsl(45 50% 40%)' : 'hsl(0 0% 20%)'}`,
                  }}
                >
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ background: cropInfo.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold" style={{ color: cropInfo.color }}>
                        {entry.crop}
                      </span>
                      <span
                        className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          background: entry.quality === 'premium' ? 'hsl(45 40% 20%)' : 'hsl(0 0% 15%)',
                          color: entry.quality === 'premium' ? 'hsl(45 60% 60%)' : 'hsl(0 0% 50%)',
                        }}
                      >
                        {entry.quality.toUpperCase()}
                      </span>
                      {entry.dilutionError && (
                        <Droplets className="w-3 h-3" style={{ color: 'hsl(30 70% 55%)' }} />
                      )}
                    </div>
                    <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                      {entry.weightLbs} lbs • Brix {entry.brix}
                    </span>
                  </div>
                  <button onClick={() => deleteEntry(entry.id)}>
                    <Trash2 className="w-4 h-4" style={{ color: 'hsl(0 40% 50%)' }} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wisdom Link */}
      <div className="px-4 pb-4">
        <LearnMoreButton wisdomKey="carver-protocol" />
      </div>
    </div>
  );
};

export default ExtractionEngine;
