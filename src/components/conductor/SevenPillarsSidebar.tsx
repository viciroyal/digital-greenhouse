import { motion } from 'framer-motion';
import { 
  Recycle, ShieldCheck, Sun, Music2, 
  Thermometer, Cpu, Flower, Loader2 
} from 'lucide-react';
import { SevenPillarStatus, useTogglePillar } from '@/hooks/useGardenBeds';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface SevenPillarsSidebarProps {
  pillars: SevenPillarStatus[];
  isAdmin: boolean;
  isLoading?: boolean;
}

const PILLAR_ICONS = [
  Recycle,      // Vortex - Compost
  ShieldCheck,  // Sirius Master - Security
  Sun,          // Solar Alchemist - Energy
  Music2,       // Toltec Heart - Sound/Stage
  Thermometer,  // Dogon Signal - Cold Chain
  Cpu,          // Aboriginal Vision - Tech
  Flower,       // Hermetic Source - Perimeter
];

const PILLAR_COLORS = [
  'hsl(0 60% 50%)',    // Red
  'hsl(30 70% 50%)',   // Orange
  'hsl(51 80% 50%)',   // Yellow
  'hsl(120 50% 45%)',  // Green
  'hsl(210 60% 50%)',  // Blue
  'hsl(270 50% 50%)',  // Indigo
  'hsl(300 50% 50%)',  // Violet
];

const SevenPillarsSidebar = ({ pillars, isAdmin, isLoading }: SevenPillarsSidebarProps) => {
  const togglePillar = useTogglePillar();

  const handleToggle = async (pillar: SevenPillarStatus) => {
    if (!isAdmin) {
      toast.error('Only admins can update infrastructure status');
      return;
    }

    try {
      await togglePillar.mutateAsync({ 
        pillarId: pillar.id, 
        isActive: !pillar.is_active 
      });
      toast.success(`${pillar.pillar_name} ${!pillar.is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update pillar status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'hsl(270 50% 60%)' }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(270 15% 10%), hsl(270 10% 6%))',
        border: '2px solid hsl(270 30% 30%)',
      }}
    >
      {/* Header */}
      <div
        className="p-3"
        style={{
          background: 'linear-gradient(135deg, hsl(270 20% 15%), hsl(270 15% 10%))',
          borderBottom: '1px solid hsl(270 20% 25%)',
        }}
      >
        <h3
          className="text-sm tracking-wider"
          style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(270 50% 65%)' }}
        >
          THE SEVEN PILLARS
        </h3>
        <p className="text-[9px] font-mono mt-0.5" style={{ color: 'hsl(270 30% 50%)' }}>
          Site Infrastructure Status
        </p>
      </div>

      {/* Pillars List */}
      <div className="p-2 space-y-1">
        {pillars.map((pillar, index) => {
          const Icon = PILLAR_ICONS[index] || Flower;
          const color = PILLAR_COLORS[index] || 'hsl(0 0% 50%)';
          
          return (
            <motion.div
              key={pillar.id}
              className="flex items-center gap-2 p-2 rounded-lg transition-all"
              style={{
                background: pillar.is_active ? `${color}10` : 'transparent',
                border: `1px solid ${pillar.is_active ? color + '40' : 'transparent'}`,
              }}
              whileHover={{ background: `${color}08` }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: pillar.is_active ? `${color}25` : 'hsl(0 0% 12%)',
                  border: `1px solid ${pillar.is_active ? color : 'hsl(0 0% 20%)'}`,
                }}
              >
                <Icon 
                  className="w-3.5 h-3.5" 
                  style={{ color: pillar.is_active ? color : 'hsl(0 0% 40%)' }} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <span 
                  className="text-[11px] font-mono font-bold block truncate"
                  style={{ color: pillar.is_active ? color : 'hsl(0 0% 55%)' }}
                >
                  {pillar.pillar_name}
                </span>
                <span 
                  className="text-[9px] font-mono block truncate"
                  style={{ color: 'hsl(0 0% 40%)' }}
                >
                  {pillar.site_name}
                </span>
              </div>

              {isAdmin ? (
                <Switch
                  checked={pillar.is_active}
                  onCheckedChange={() => handleToggle(pillar)}
                  className="shrink-0"
                />
              ) : (
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    background: pillar.is_active ? color : 'hsl(0 0% 25%)',
                    boxShadow: pillar.is_active ? `0 0 8px ${color}` : 'none',
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Status Summary */}
      <div 
        className="p-3 mt-1"
        style={{ borderTop: '1px solid hsl(270 15% 20%)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
            Active Systems
          </span>
          <span 
            className="text-sm font-mono font-bold"
            style={{ color: 'hsl(120 50% 55%)' }}
          >
            {pillars.filter(p => p.is_active).length}/7
          </span>
        </div>
      </div>
    </div>
  );
};

export default SevenPillarsSidebar;
