import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Gauge } from 'lucide-react';
import { GardenBed, useUpdateBedBrix } from '@/hooks/useGardenBeds';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

/**
 * BRIX VALIDATION PANEL
 * Science Core with:
 * - Brix Volume Slider (12-24 scale)
 * - Calibration Gate (White Reference checkbox)
 * - Hidden Internal Brix for Member View (shows "Vitality Note" instead)
 */

interface BrixValidationPanelProps {
  bed: GardenBed;
  isAdmin: boolean;
  simpleMode: boolean;
}

const BRIX_ZONES = [
  { min: 0, max: 11, label: 'Low', color: '#EF4444', note: 'Needs Intervention' },
  { min: 12, max: 15, label: 'Fair', color: '#F59E0B', note: 'Building' },
  { min: 16, max: 18, label: 'Good', color: '#22C55E', note: 'Healthy' },
  { min: 19, max: 24, label: 'Peak', color: '#8B5CF6', note: 'Harvest Ready' },
];

const getBrixZone = (brix: number) => {
  return BRIX_ZONES.find(z => brix >= z.min && brix <= z.max) || BRIX_ZONES[0];
};

const getVitalityNote = (brix: number | null) => {
  if (brix === null) return { text: 'Pending', icon: '⏳', color: '#9CA3AF' };
  if (brix >= 19) return { text: 'Thriving', icon: '✨', color: '#8B5CF6' };
  if (brix >= 16) return { text: 'Strong', icon: '💪', color: '#22C55E' };
  if (brix >= 12) return { text: 'Growing', icon: '🌱', color: '#F59E0B' };
  return { text: 'Needs Care', icon: '🩹', color: '#EF4444' };
};

const BrixValidationPanel = ({ bed, isAdmin, simpleMode }: BrixValidationPanelProps) => {
  const [brixValue, setBrixValue] = useState(bed.internal_brix || 12);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateBrix = useUpdateBedBrix();
  const brixZone = getBrixZone(brixValue);
  const vitalityNote = getVitalityNote(bed.internal_brix);

  // Member View: Show only Vitality Note
  if (!isAdmin) {
    return (
      <motion.div
        className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{vitalityNote.icon}</span>
            <div>
              <p className="text-sm text-gray-500">
                {simpleMode ? 'Plant Vitality' : 'Vitality Status'}
              </p>
              <p className="font-bold text-lg" style={{ color: vitalityNote.color }}>
                {vitalityNote.text}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Admin View: Full Brix Slider with Calibration Gate
  const handleSaveBrix = async () => {
    if (!isCalibrated) {
      toast.error('⚠️ Please confirm refractometer calibration first');
      return;
    }

    setIsSaving(true);
    try {
      await updateBrix.mutateAsync({ bedId: bed.id, brix: brixValue });
      toast.success(`Brix recorded: ${brixValue}°`);
    } catch (error) {
      toast.error('Failed to save Brix');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      className="p-4 rounded-2xl bg-white border-2 shadow-lg"
      style={{ borderColor: brixZone.color }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-5 h-5" style={{ color: brixZone.color }} />
        <h4 className="font-bold text-gray-900">
          {simpleMode ? 'Nutrient Density' : 'Brix Validation'}
        </h4>
      </div>

      {/* Brix Slider */}
      <div className="space-y-4">
        {/* Current Value Display */}
        <div className="text-center">
          <span 
            className="text-5xl font-bold"
            style={{ color: brixZone.color }}
          >
            {brixValue}°
          </span>
          <p className="text-sm text-gray-500 mt-1">{brixZone.note}</p>
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={[brixValue]}
            onValueChange={([val]) => setBrixValue(val)}
            min={0}
            max={24}
            step={1}
            className="w-full"
          />
          
          {/* Scale Labels */}
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">0</span>
            <span className="text-xs text-gray-400">12</span>
            <span className="text-xs text-gray-400">18</span>
            <span className="text-xs text-gray-400">24</span>
          </div>
        </div>

        {/* Zone Indicator */}
        <div className="flex justify-center gap-1">
          {BRIX_ZONES.map(zone => (
            <div
              key={zone.label}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                brixZone.label === zone.label 
                  ? 'scale-110 shadow-lg' 
                  : 'opacity-50'
              }`}
              style={{ 
                backgroundColor: `${zone.color}20`,
                color: zone.color,
                border: brixZone.label === zone.label ? `2px solid ${zone.color}` : 'none'
              }}
            >
              {zone.label}
            </div>
          ))}
        </div>

        {/* Calibration Gate */}
        <div 
          className={`p-3 rounded-xl flex items-center gap-3 ${
            isCalibrated ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
          }`}
        >
          <Checkbox
            id="calibration"
            checked={isCalibrated}
            onCheckedChange={(checked) => setIsCalibrated(checked as boolean)}
          />
          <label htmlFor="calibration" className="flex items-center gap-2 cursor-pointer">
            {isCalibrated ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span className={`text-sm font-medium ${isCalibrated ? 'text-green-700' : 'text-amber-700'}`}>
              {simpleMode ? 'Meter is zeroed' : 'White Reference Calibrated'}
            </span>
          </label>
        </div>

        {/* Save Button */}
        <motion.button
          className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
            isCalibrated 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={handleSaveBrix}
          disabled={!isCalibrated || isSaving}
          whileHover={isCalibrated ? { scale: 1.02 } : {}}
          whileTap={isCalibrated ? { scale: 0.98 } : {}}
        >
          {isSaving ? 'Saving...' : simpleMode ? 'Record Reading' : 'Save Brix Score'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BrixValidationPanel;
