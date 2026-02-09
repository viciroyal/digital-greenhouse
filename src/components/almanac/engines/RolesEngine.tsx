import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pickaxe,
  Droplets,
  Sprout,
  Eye,
  Wrench,
  Warehouse,
  Tent,
  Microscope,
  Hammer,
  Settings,
  Layers,
  Beaker,
  Scissors,
  Leaf,
  Binary,
  ClipboardList,
  Filter,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LearnMoreButton } from '@/components/almanac';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE ECOLOGICAL ROLES ENGINE (The Human Engine)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CONCEPT: The user operates in specific "Scientific Modes."
 * Each mode filters tasks and assets by their frequency domain.
 * 
 * FOUR MODES:
 * A. THE ARCHITECT (396Hz / Red) - Lithosphere: Soil, Infrastructure
 * B. THE HYDROLOGIST (417Hz / Orange) - Hydrosphere: Water, Circulation
 * C. THE ALCHEMIST (528Hz / Yellow) - Biosphere: Life, Photosynthesis
 * D. THE SURVEYOR (963Hz / Violet) - Noosphere: Data, Observation
 * 
 * INFRASTRUCTURE MAP: Every building is an "Organ" assigned to a Role.
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & DATA
// ═══════════════════════════════════════════════════════════════════════════

export type RoleMode = 'architect' | 'hydrologist' | 'alchemist' | 'surveyor';

interface EcologicalRole {
  id: RoleMode;
  name: string;
  title: string;
  hz: number;
  domain: string;
  sphere: string;
  color: string;
  glowColor: string;
  icon: 'pickaxe' | 'droplets' | 'sprout' | 'eye';
  assets: InfrastructureAsset[];
  taskTypes: string[];
  mantra: string;
}

interface InfrastructureAsset {
  id: string;
  name: string;
  description: string;
  hz: number;
  icon: 'wrench' | 'warehouse' | 'tent' | 'microscope' | 'hammer' | 'beaker' | 'settings' | 'layers';
}

interface TaskFilter {
  id: string;
  name: string;
  category: string;
  roleId: RoleMode;
  examples: string[];
}

// THE FOUR ECOLOGICAL ROLES
const ECOLOGICAL_ROLES: EcologicalRole[] = [
  {
    id: 'architect',
    name: 'ARCHITECT',
    title: 'THE ARCHITECT',
    hz: 396,
    domain: 'Lithosphere (Soil)',
    sphere: 'Structure',
    color: 'hsl(0 60% 50%)',
    glowColor: 'hsl(0 60% 50% / 0.4)',
    icon: 'pickaxe',
    assets: [
      { id: 'tool-shed', name: 'Tool Shed', description: 'Equipment storage & maintenance', hz: 396, icon: 'wrench' },
      { id: 'compost-system', name: 'Compost Systems', description: 'Decomposition management', hz: 396, icon: 'layers' },
      { id: 'bed-frames', name: 'Bed Frames', description: 'Growing bed infrastructure', hz: 396, icon: 'hammer' },
    ],
    taskTypes: ['Construction', 'Repair', 'Soil Building', 'Hardscape', 'Infrastructure'],
    mantra: '"The foundation determines the ceiling."',
  },
  {
    id: 'hydrologist',
    name: 'HYDROLOGIST',
    title: 'THE HYDROLOGIST',
    hz: 417,
    domain: 'Hydrosphere (Water)',
    sphere: 'Circulation',
    color: 'hsl(30 70% 50%)',
    glowColor: 'hsl(30 70% 50% / 0.4)',
    icon: 'droplets',
    assets: [
      { id: 'well', name: 'The Well', description: 'Water source & storage', hz: 417, icon: 'warehouse' },
      { id: 'irrigation', name: 'Irrigation Lines', description: 'Drip & overhead systems', hz: 417, icon: 'settings' },
      { id: 'wash-pack', name: 'Wash/Pack Station', description: 'Post-harvest cleaning', hz: 741, icon: 'beaker' },
    ],
    taskTypes: ['Watering', 'Flushing', 'Liquid Fertility', 'Foliar Sprays', 'Solutions'],
    mantra: '"Water is the vehicle of life."',
  },
  {
    id: 'alchemist',
    name: 'ALCHEMIST',
    title: 'THE ALCHEMIST',
    hz: 528,
    domain: 'Biosphere (Life)',
    sphere: 'Metabolism',
    color: 'hsl(51 80% 50%)',
    glowColor: 'hsl(51 80% 50% / 0.4)',
    icon: 'sprout',
    assets: [
      { id: 'high-tunnel', name: 'The High Tunnel', description: 'Controlled growth environment', hz: 528, icon: 'tent' },
      { id: 'trellising', name: 'Trellising Systems', description: 'Vertical growth support', hz: 528, icon: 'layers' },
      { id: 'propagation', name: 'Propagation House', description: 'Seed starting & cloning', hz: 528, icon: 'beaker' },
    ],
    taskTypes: ['Planting', 'Pruning', 'Harvesting', 'Transplants', 'Photosynthesis Support'],
    mantra: '"Transform light into life."',
  },
  {
    id: 'surveyor',
    name: 'SURVEYOR',
    title: 'THE SURVEYOR',
    hz: 963,
    domain: 'Noosphere (Data)',
    sphere: 'Vision',
    color: 'hsl(300 50% 50%)',
    glowColor: 'hsl(300 50% 50% / 0.4)',
    icon: 'eye',
    assets: [
      { id: 'pavilion', name: 'Educational Pavilion', description: 'Learning & planning center', hz: 963, icon: 'microscope' },
      { id: 'brix-station', name: 'NIR Spectroscopy', description: 'Brix & mineral analysis', hz: 963, icon: 'beaker' },
      { id: 'journal', name: 'Field Journals', description: 'Observation logs', hz: 963, icon: 'layers' },
    ],
    taskTypes: ['Data Entry', 'Analysis', 'Seed Inventory', 'Observation', 'Planning'],
    mantra: '"Measure twice, harvest once."',
  },
];

// TASK FILTERS BY ROLE
const TASK_FILTERS: TaskFilter[] = [
  // Architect tasks
  { id: 'construction', name: 'Construction', category: 'Build', roleId: 'architect', examples: ['Build raised beds', 'Install fence posts'] },
  { id: 'repair', name: 'Repair', category: 'Maintain', roleId: 'architect', examples: ['Fix irrigation leak', 'Replace broken trellis'] },
  { id: 'soil-building', name: 'Soil Building', category: 'Foundation', roleId: 'architect', examples: ['Apply compost', 'Add amendments', 'Till beds'] },
  // Hydrologist tasks
  { id: 'watering', name: 'Watering', category: 'Hydration', roleId: 'hydrologist', examples: ['Morning irrigation', 'Deep water trees'] },
  { id: 'flushing', name: 'Flushing', category: 'Cleanse', roleId: 'hydrologist', examples: ['Flush drip lines', 'Clear clogged emitters'] },
  { id: 'liquid-fertility', name: 'Liquid Fertility', category: 'Feed', roleId: 'hydrologist', examples: ['Compost tea application', 'Foliar spray'] },
  // Alchemist tasks
  { id: 'planting', name: 'Planting', category: 'Seed', roleId: 'alchemist', examples: ['Transplant tomatoes', 'Direct seed carrots'] },
  { id: 'pruning', name: 'Pruning', category: 'Shape', roleId: 'alchemist', examples: ['Sucker tomatoes', 'Thin fruit trees'] },
  { id: 'harvesting', name: 'Harvesting', category: 'Gather', roleId: 'alchemist', examples: ['Harvest greens', 'Pick ripe fruit'] },
  // Surveyor tasks
  { id: 'data-entry', name: 'Data Entry', category: 'Record', roleId: 'surveyor', examples: ['Log Brix readings', 'Record harvest weights'] },
  { id: 'analysis', name: 'Analysis', category: 'Study', roleId: 'surveyor', examples: ['Review growth patterns', 'Analyze soil test'] },
  { id: 'seed-inventory', name: 'Seed Inventory', category: 'Catalog', roleId: 'surveyor', examples: ['Count seed stock', 'Organize seed library'] },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const RolesEngine = () => {
  const [activeRole, setActiveRole] = useState<RoleMode>('architect');
  const [selectedAsset, setSelectedAsset] = useState<InfrastructureAsset | null>(null);
  
  // Current role data
  const currentRole = useMemo(() => 
    ECOLOGICAL_ROLES.find(r => r.id === activeRole)!,
    [activeRole]
  );
  
  // Filtered tasks for current role
  const filteredTasks = useMemo(() =>
    TASK_FILTERS.filter(t => t.roleId === activeRole),
    [activeRole]
  );
  
  // Icon component
  const getRoleIcon = (icon: EcologicalRole['icon'], className: string = 'w-5 h-5') => {
    const props = { className };
    switch (icon) {
      case 'pickaxe': return <Pickaxe {...props} />;
      case 'droplets': return <Droplets {...props} />;
      case 'sprout': return <Sprout {...props} />;
      case 'eye': return <Eye {...props} />;
    }
  };
  
  // Asset icon component
  const getAssetIcon = (icon: InfrastructureAsset['icon'], className: string = 'w-4 h-4') => {
    const props = { className };
    switch (icon) {
      case 'wrench': return <Wrench {...props} />;
      case 'warehouse': return <Warehouse {...props} />;
      case 'tent': return <Tent {...props} />;
      case 'microscope': return <Microscope {...props} />;
      case 'hammer': return <Hammer {...props} />;
      case 'beaker': return <Beaker {...props} />;
      case 'settings': return <Settings {...props} />;
      case 'layers': return <Layers {...props} />;
    }
  };
  
  // Task icon by category
  const getTaskIcon = (category: string) => {
    const props = { className: 'w-3.5 h-3.5' };
    switch (category) {
      case 'Build': return <Hammer {...props} />;
      case 'Maintain': return <Wrench {...props} />;
      case 'Foundation': return <Layers {...props} />;
      case 'Hydration': return <Droplets {...props} />;
      case 'Cleanse': return <Settings {...props} />;
      case 'Feed': return <Beaker {...props} />;
      case 'Seed': return <Sprout {...props} />;
      case 'Shape': return <Scissors {...props} />;
      case 'Gather': return <Leaf {...props} />;
      case 'Record': return <ClipboardList {...props} />;
      case 'Study': return <Binary {...props} />;
      case 'Catalog': return <Filter {...props} />;
      default: return <ChevronRight {...props} />;
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${currentRole.color}15, hsl(0 0% 6%))`,
        border: `2px solid ${currentRole.color}60`,
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{
          background: `linear-gradient(135deg, ${currentRole.color}20, ${currentRole.color}08)`,
          borderBottom: `1px solid ${currentRole.color}40`,
        }}
      >
        <div className="flex items-center gap-2">
          <div style={{ color: currentRole.color }}>
            {getRoleIcon(currentRole.icon)}
          </div>
          <h3
            className="text-lg tracking-wider"
            style={{ fontFamily: "'Staatliches', sans-serif", color: currentRole.color }}
          >
            {currentRole.title}
          </h3>
          <span
            className="ml-auto text-xs font-mono px-2 py-0.5 rounded"
            style={{ background: `${currentRole.color}25`, color: currentRole.color }}
          >
            {currentRole.hz}Hz
          </span>
        </div>
        <p className="text-[10px] font-mono mt-1" style={{ color: `${currentRole.color}90` }}>
          {currentRole.domain} • {currentRole.sphere}
        </p>
      </div>

      {/* Role Selector */}
      <div className="p-4">
        <span className="text-[10px] font-mono tracking-widest block mb-2" style={{ color: 'hsl(0 0% 50%)' }}>
          SCIENTIFIC MODE:
        </span>
        <div className="grid grid-cols-4 gap-2">
          {ECOLOGICAL_ROLES.map((role) => {
            const isActive = activeRole === role.id;
            return (
              <motion.button
                key={role.id}
                onClick={() => {
                  setActiveRole(role.id);
                  setSelectedAsset(null);
                }}
                className="relative flex flex-col items-center p-3 rounded-lg transition-all"
                style={{
                  background: isActive ? `${role.color}25` : 'hsl(0 0% 10%)',
                  border: `2px solid ${isActive ? role.color : 'hsl(0 0% 20%)'}`,
                  boxShadow: isActive ? `0 0 15px ${role.glowColor}` : 'none',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{ color: isActive ? role.color : 'hsl(0 0% 50%)' }}>
                  {getRoleIcon(role.icon, 'w-6 h-6')}
                </div>
                <span
                  className="text-[9px] font-mono mt-1 tracking-wide"
                  style={{ color: isActive ? role.color : 'hsl(0 0% 50%)' }}
                >
                  {role.name}
                </span>
                <span
                  className="text-[8px] font-mono"
                  style={{ color: isActive ? `${role.color}80` : 'hsl(0 0% 35%)' }}
                >
                  {role.hz}Hz
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Role Mantra */}
      <div className="px-4">
        <motion.div
          key={activeRole}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-3 rounded-lg"
          style={{
            background: `${currentRole.color}10`,
            border: `1px dashed ${currentRole.color}40`,
          }}
        >
          <p
            className="text-sm italic font-serif"
            style={{ color: `${currentRole.color}90` }}
          >
            {currentRole.mantra}
          </p>
        </motion.div>
      </div>

      {/* Infrastructure Assets */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Warehouse className="w-4 h-4" style={{ color: currentRole.color }} />
          <span className="text-xs font-mono tracking-widest" style={{ color: currentRole.color }}>
            INFRASTRUCTURE ORGANS
          </span>
        </div>
        
        <div className="space-y-2">
          {currentRole.assets.map((asset) => (
            <motion.button
              key={asset.id}
              onClick={() => setSelectedAsset(selectedAsset?.id === asset.id ? null : asset)}
              className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left"
              style={{
                background: selectedAsset?.id === asset.id ? `${currentRole.color}20` : 'hsl(0 0% 10%)',
                border: `1px solid ${selectedAsset?.id === asset.id ? currentRole.color : 'hsl(0 0% 20%)'}`,
              }}
              whileHover={{ x: 3 }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ background: `${currentRole.color}20` }}
              >
                {getAssetIcon(asset.icon, 'w-5 h-5')}
              </div>
              <div className="flex-1">
                <p className="text-sm font-mono font-bold" style={{ color: currentRole.color }}>
                  {asset.name}
                </p>
                <p className="text-[10px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
                  {asset.description}
                </p>
              </div>
              <span
                className="text-[9px] font-mono px-2 py-0.5 rounded"
                style={{ background: 'hsl(0 0% 15%)', color: 'hsl(0 0% 55%)' }}
              >
                {asset.hz}Hz
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Task Filters */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4" style={{ color: currentRole.color }} />
          <span className="text-xs font-mono tracking-widest" style={{ color: currentRole.color }}>
            TASK FILTER: {currentRole.name} ONLY
          </span>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid gap-2"
          >
            {filteredTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg overflow-hidden"
                style={{
                  background: 'hsl(0 0% 8%)',
                  border: `1px solid ${currentRole.color}30`,
                }}
              >
                <div
                  className="flex items-center gap-2 px-3 py-2"
                  style={{ background: `${currentRole.color}10` }}
                >
                  <div style={{ color: currentRole.color }}>
                    {getTaskIcon(task.category)}
                  </div>
                  <span className="text-sm font-mono font-bold" style={{ color: currentRole.color }}>
                    {task.name}
                  </span>
                  <span
                    className="ml-auto text-[8px] font-mono px-2 py-0.5 rounded"
                    style={{ background: `${currentRole.color}20`, color: `${currentRole.color}90` }}
                  >
                    {task.category.toUpperCase()}
                  </span>
                </div>
                <div className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {task.examples.map((ex, j) => (
                      <span
                        key={j}
                        className="text-[9px] font-mono px-2 py-0.5 rounded"
                        style={{ background: 'hsl(0 0% 12%)', color: 'hsl(0 0% 55%)' }}
                      >
                        • {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* All Task Types Summary */}
      <div className="px-4 pb-4">
        <div
          className="rounded-lg p-3"
          style={{ background: 'hsl(0 0% 8%)', border: '1px dashed hsl(0 0% 20%)' }}
        >
          <span className="text-[10px] font-mono block mb-2" style={{ color: 'hsl(0 0% 50%)' }}>
            {currentRole.name} TASK TYPES:
          </span>
          <div className="flex flex-wrap gap-1">
            {currentRole.taskTypes.map((type) => (
              <span
                key={type}
                className="text-[9px] font-mono px-2 py-1 rounded"
                style={{
                  background: `${currentRole.color}15`,
                  color: currentRole.color,
                  border: `1px solid ${currentRole.color}40`,
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Wisdom Link */}
      <div className="px-4 pb-4">
        <LearnMoreButton
          wisdomKey={
            activeRole === 'architect' ? 'ingham-soil-food-web' :
            activeRole === 'hydrologist' ? 'hermetic-vibration' :
            activeRole === 'alchemist' ? 'hermetic-correspondence' :
            'dogon-seed-lineage'
          }
        />
      </div>
    </div>
  );
};

export default RolesEngine;
