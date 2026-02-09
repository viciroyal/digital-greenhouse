import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Power } from 'lucide-react';
import { GardenBed, calculateWaterReduction } from '@/hooks/useGardenBeds';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

/**
 * WATER VALVE CONTROL
 * Irrigation Link - Toggle for each zone
 * Shows water reduction when 11th Interval (Fungal Network) is active
 */

interface WaterValveControlProps {
  bed: GardenBed;
  isAdmin: boolean;
}

const WaterValveControl = ({ bed, isAdmin }: WaterValveControlProps) => {
  // Local state for demo - in production this would connect to irrigation system
  const [isValveOpen, setIsValveOpen] = useState(false);

  const hasFungalNetwork = bed.inoculant_type !== null;
  const waterReduction = calculateWaterReduction(hasFungalNetwork);
  const reductionPercent = Math.round((1 - waterReduction) * 100);

  const handleToggle = (checked: boolean) => {
    if (!isAdmin) {
      toast.error('Only admins can control irrigation');
      return;
    }
    
    setIsValveOpen(checked);
    toast.success(checked 
      ? `💧 Valve OPEN - Bed #${bed.bed_number}` 
      : `🚫 Valve CLOSED - Bed #${bed.bed_number}`
    );
  };

  return (
    <motion.div
      className={`p-4 rounded-2xl border-2 ${
        isValveOpen 
          ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300' 
          : 'bg-gray-50 border-gray-200'
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isValveOpen ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            animate={isValveOpen ? {
              boxShadow: [
                '0 0 10px rgba(59, 130, 246, 0.5)',
                '0 0 25px rgba(59, 130, 246, 0.7)',
                '0 0 10px rgba(59, 130, 246, 0.5)',
              ]
            } : {}}
            transition={{ duration: 2, repeat: isValveOpen ? Infinity : 0 }}
          >
            <Droplets className={`w-6 h-6 ${isValveOpen ? 'text-white' : 'text-gray-500'}`} />
          </motion.div>
          <div>
            <p className="font-bold text-gray-900">
              Water Valve
            </p>
            <p className="text-xs text-gray-500">
              Zone {bed.zone_name} • Bed #{bed.bed_number}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Water Reduction Badge */}
          {hasFungalNetwork && (
            <div className="px-2 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold">
              -{reductionPercent}% 🍄
            </div>
          )}

          {/* Valve Toggle */}
          <Switch
            checked={isValveOpen}
            onCheckedChange={handleToggle}
            disabled={!isAdmin}
          />
        </div>
      </div>

      {/* Status Indicator */}
      <motion.div
        className={`mt-3 p-2 rounded-lg text-center text-sm font-medium ${
          isValveOpen 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-gray-100 text-gray-500'
        }`}
        animate={isValveOpen ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 1.5, repeat: isValveOpen ? Infinity : 0 }}
      >
        <div className="flex items-center justify-center gap-2">
          <Power className={`w-4 h-4 ${isValveOpen ? 'text-blue-600' : 'text-gray-400'}`} />
          {isValveOpen ? '💧 IRRIGATING...' : 'Valve Closed'}
        </div>
      </motion.div>

      {/* Fungal Network Benefit */}
      {hasFungalNetwork && (
        <div className="mt-3 p-2 rounded-lg bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200">
          <p className="text-xs text-cyan-700 text-center">
            🍄 <strong>{bed.inoculant_type}</strong> Network Active — {reductionPercent}% Water Savings
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default WaterValveControl;
