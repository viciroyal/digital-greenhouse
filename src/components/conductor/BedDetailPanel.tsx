import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Check, AlertTriangle, Leaf, Shield, 
  Pickaxe, Sparkles, Music, Loader2, Trash2 
} from 'lucide-react';
import { GardenBed, BedPlanting, calculatePlantCount, useAddPlanting, useRemovePlanting, useUpdateBedBrix } from '@/hooks/useGardenBeds';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface BedDetailPanelProps {
  bed: GardenBed;
  plantings: BedPlanting[];
  isAdmin: boolean;
  onClose: () => void;
}

const GUILD_ROLES = ['Lead', 'Sentinel', 'Miner', 'Enhancer'] as const;

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Lead': return Leaf;
    case 'Sentinel': return Shield;
    case 'Miner': return Pickaxe;
    case 'Enhancer': return Sparkles;
    default: return Leaf;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Lead': return 'hsl(120 50% 50%)';
    case 'Sentinel': return 'hsl(0 60% 55%)';
    case 'Miner': return 'hsl(35 70% 55%)';
    case 'Enhancer': return 'hsl(270 50% 60%)';
    default: return 'hsl(0 0% 50%)';
  }
};

const BedDetailPanel = ({ bed, plantings, isAdmin, onClose }: BedDetailPanelProps) => {
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('Lead');
  const [brixInput, setBrixInput] = useState(bed.internal_brix?.toString() || '');
  
  const { data: allCrops = [], isLoading: cropsLoading } = useMasterCrops();
  const addPlanting = useAddPlanting();
  const removePlanting = useRemovePlanting();
  const updateBrix = useUpdateBedBrix();

  // Filter crops by frequency
  const frequencyMatchedCrops = allCrops.filter(
    (crop) => crop.frequency_hz === bed.frequency_hz
  );

  // Check harmonic trio completion
  const hasRole = (role: string) => plantings.some(p => p.guild_role === role);
  const harmonicTrio = {
    Lead: hasRole('Lead'),
    Sentinel: hasRole('Sentinel'),
    Miner: hasRole('Miner'),
    Enhancer: hasRole('Enhancer'),
  };
  const isHarmonicComplete = Object.values(harmonicTrio).every(Boolean);

  const handleAddCrop = async (crop: MasterCrop) => {
    if (!isAdmin) {
      toast.error('Only admins can add crops');
      return;
    }

    const plantCount = calculatePlantCount(crop.spacing_inches);
    
    try {
      await addPlanting.mutateAsync({
        bedId: bed.id,
        cropId: crop.id,
        guildRole: selectedRole,
        plantCount,
      });
      toast.success(`Added ${crop.name} (${plantCount} plants)`);
      setIsAddingCrop(false);
    } catch (error) {
      toast.error('Failed to add crop');
    }
  };

  const handleRemovePlanting = async (planting: BedPlanting) => {
    if (!isAdmin) {
      toast.error('Only admins can remove crops');
      return;
    }

    try {
      await removePlanting.mutateAsync({ plantingId: planting.id, bedId: bed.id });
      toast.success('Crop removed');
    } catch (error) {
      toast.error('Failed to remove crop');
    }
  };

  const handleUpdateBrix = async () => {
    if (!isAdmin) return;
    
    const brixValue = brixInput ? parseInt(brixInput) : null;
    
    try {
      await updateBrix.mutateAsync({ bedId: bed.id, brix: brixValue });
      toast.success('Brix updated');
    } catch (error) {
      toast.error('Failed to update Brix');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(0 0% 10%), hsl(0 0% 6%))',
        border: `2px solid ${bed.zone_color}`,
      }}
    >
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${bed.zone_color}25, ${bed.zone_color}10)`,
          borderBottom: `1px solid ${bed.zone_color}40`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: `${bed.zone_color}30`,
              border: `2px solid ${bed.zone_color}`,
            }}
          >
            <span className="text-lg font-mono font-bold" style={{ color: bed.zone_color }}>
              {bed.bed_number}
            </span>
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold" style={{ color: bed.zone_color }}>
              {bed.zone_name}
            </h3>
            <div className="flex items-center gap-1">
              <Music className="w-3 h-3" style={{ color: 'hsl(0 0% 50%)' }} />
              <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                {bed.frequency_hz}Hz
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" style={{ color: 'hsl(0 0% 50%)' }} />
        </button>
      </div>

      {/* Harmonic Trio Checklist */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-wider" style={{ color: 'hsl(0 0% 55%)' }}>
            HARMONIC TRIO
          </span>
          {isHarmonicComplete && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" 
              style={{ background: 'hsl(120 50% 30%)', color: 'hsl(120 50% 70%)' }}>
              ✓ COMPLETE
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {GUILD_ROLES.map((role) => {
            const Icon = getRoleIcon(role);
            const hasIt = harmonicTrio[role];
            const color = getRoleColor(role);
            
            return (
              <div
                key={role}
                className="flex flex-col items-center gap-1 p-2 rounded-lg"
                style={{
                  background: hasIt ? `${color}15` : 'hsl(0 0% 8%)',
                  border: `1px solid ${hasIt ? color : 'hsl(0 0% 18%)'}`,
                }}
              >
                <Icon 
                  className="w-4 h-4" 
                  style={{ color: hasIt ? color : 'hsl(0 0% 35%)' }} 
                />
                <span 
                  className="text-[9px] font-mono"
                  style={{ color: hasIt ? color : 'hsl(0 0% 35%)' }}
                >
                  {role}
                </span>
                {hasIt && <Check className="w-3 h-3" style={{ color }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin: Brix Input */}
      {isAdmin && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono" style={{ color: 'hsl(45 80% 60%)' }}>
              INTERNAL BRIX:
            </span>
            <Input
              type="number"
              value={brixInput}
              onChange={(e) => setBrixInput(e.target.value)}
              onBlur={handleUpdateBrix}
              className="w-20 h-8 text-center font-mono text-sm"
              style={{ 
                background: 'hsl(0 0% 8%)', 
                border: '1px solid hsl(45 50% 30%)',
                color: 'hsl(45 80% 65%)',
              }}
              placeholder="—"
            />
            <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
              (Target: 15+)
            </span>
          </div>
        </div>
      )}

      {/* Current Plantings */}
      <div className="px-4 pb-4 space-y-2">
        <span className="text-xs font-mono tracking-wider" style={{ color: 'hsl(0 0% 55%)' }}>
          CURRENT PLANTINGS
        </span>
        
        {plantings.length === 0 ? (
          <p className="text-[11px] font-mono py-2" style={{ color: 'hsl(0 0% 40%)' }}>
            No crops planted yet
          </p>
        ) : (
          <div className="space-y-2">
            {plantings.map((planting) => {
              const Icon = getRoleIcon(planting.guild_role);
              const color = getRoleColor(planting.guild_role);
              
              return (
                <div
                  key={planting.id}
                  className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ background: 'hsl(0 0% 8%)', border: '1px solid hsl(0 0% 15%)' }}
                >
                  <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono block truncate" style={{ color: 'hsl(0 0% 75%)' }}>
                      {planting.crop?.name || 'Unknown'}
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                      {planting.plant_count} plants • {planting.guild_role}
                    </span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleRemovePlanting(planting)}
                      className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: 'hsl(0 50% 50%)' }} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Crop Section */}
      {isAdmin && (
        <div className="px-4 pb-4">
          {!isAddingCrop ? (
            <motion.button
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg"
              style={{
                background: `${bed.zone_color}15`,
                border: `1px dashed ${bed.zone_color}50`,
              }}
              whileHover={{ borderStyle: 'solid' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddingCrop(true)}
            >
              <Plus className="w-4 h-4" style={{ color: bed.zone_color }} />
              <span className="text-xs font-mono" style={{ color: bed.zone_color }}>
                Add Crop
              </span>
            </motion.button>
          ) : (
            <div className="space-y-3">
              {/* Role Selector */}
              <div className="flex gap-1">
                {GUILD_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className="flex-1 py-1.5 rounded text-[10px] font-mono transition-all"
                    style={{
                      background: selectedRole === role ? getRoleColor(role) + '30' : 'hsl(0 0% 10%)',
                      border: `1px solid ${selectedRole === role ? getRoleColor(role) : 'hsl(0 0% 20%)'}`,
                      color: selectedRole === role ? getRoleColor(role) : 'hsl(0 0% 50%)',
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Frequency-Matched Crops */}
              <div className="max-h-40 overflow-y-auto space-y-1 scrollbar-thin">
                {cropsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: bed.zone_color }} />
                  </div>
                ) : frequencyMatchedCrops.length === 0 ? (
                  <div className="flex items-center gap-2 py-3">
                    <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(45 70% 50%)' }} />
                    <span className="text-[11px] font-mono" style={{ color: 'hsl(45 70% 50%)' }}>
                      No {bed.frequency_hz}Hz crops in library
                    </span>
                  </div>
                ) : (
                  frequencyMatchedCrops.map((crop) => {
                    const plantCount = calculatePlantCount(crop.spacing_inches);
                    const alreadyPlanted = plantings.some(p => p.crop_id === crop.id);
                    
                    return (
                      <button
                        key={crop.id}
                        disabled={alreadyPlanted}
                        onClick={() => handleAddCrop(crop)}
                        className="w-full flex items-center justify-between p-2 rounded-lg transition-all disabled:opacity-40"
                        style={{
                          background: 'hsl(0 0% 8%)',
                          border: '1px solid hsl(0 0% 18%)',
                        }}
                      >
                        <div className="text-left">
                          <span className="text-xs font-mono block" style={{ color: 'hsl(0 0% 70%)' }}>
                            {crop.name}
                          </span>
                          <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                            {crop.spacing_inches}" spacing
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold" style={{ color: bed.zone_color }}>
                            {plantCount}
                          </span>
                          <span className="text-[10px] font-mono block" style={{ color: 'hsl(0 0% 45%)' }}>
                            plants
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <button
                onClick={() => setIsAddingCrop(false)}
                className="w-full py-2 text-xs font-mono rounded-lg"
                style={{ background: 'hsl(0 0% 12%)', color: 'hsl(0 0% 50%)' }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Master Mix Note */}
      <div className="px-4 pb-4">
        <div 
          className="p-3 rounded-lg"
          style={{ background: 'hsl(35 30% 10%)', border: '1px solid hsl(35 40% 25%)' }}
        >
          <p className="text-[10px] font-mono" style={{ color: 'hsl(35 50% 60%)' }}>
            📋 {bed.notes || 'Apply 5-Quart Master Mix Reset before planting.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BedDetailPanel;
