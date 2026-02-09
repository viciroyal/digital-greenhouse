import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Scissors, Leaf, Droplets, Check } from 'lucide-react';
import { differenceInDays, addDays, format } from 'date-fns';

/**
 * MAINTENANCE RIFFS
 * Auto-generated tasks (Pruning/Foliar) every 14 days post-planting
 */

interface MaintenanceRiffsProps {
  plantedAt: string | null;
  bedNumber: number;
}

interface MaintenanceTask {
  id: string;
  name: string;
  icon: React.ReactNode;
  daysAfterPlanting: number;
  color: string;
  description: string;
}

const MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    id: 'foliar-1',
    name: 'First Foliar Spray',
    icon: <Droplets className="w-4 h-4" />,
    daysAfterPlanting: 14,
    color: '#22C55E',
    description: 'Fish emulsion + sea minerals',
  },
  {
    id: 'prune-1',
    name: 'Initial Pruning',
    icon: <Scissors className="w-4 h-4" />,
    daysAfterPlanting: 21,
    color: '#F59E0B',
    description: 'Remove lower leaves, suckers',
  },
  {
    id: 'foliar-2',
    name: 'Second Foliar Spray',
    icon: <Droplets className="w-4 h-4" />,
    daysAfterPlanting: 28,
    color: '#22C55E',
    description: 'Calcium + boron boost',
  },
  {
    id: 'mulch',
    name: 'Mulch Application',
    icon: <Leaf className="w-4 h-4" />,
    daysAfterPlanting: 35,
    color: '#8B5CF6',
    description: 'Deep straw or wood chip layer',
  },
  {
    id: 'foliar-3',
    name: 'Third Foliar Spray',
    icon: <Droplets className="w-4 h-4" />,
    daysAfterPlanting: 42,
    color: '#22C55E',
    description: 'Potassium for fruiting',
  },
  {
    id: 'prune-2',
    name: 'Maintenance Pruning',
    icon: <Scissors className="w-4 h-4" />,
    daysAfterPlanting: 49,
    color: '#F59E0B',
    description: 'Shape and airflow',
  },
];

const MaintenanceRiffs = ({ plantedAt, bedNumber }: MaintenanceRiffsProps) => {
  const schedule = useMemo(() => {
    if (!plantedAt) return [];

    const plantDate = new Date(plantedAt);
    const today = new Date();
    const daysSincePlanting = differenceInDays(today, plantDate);

    return MAINTENANCE_TASKS.map(task => {
      const dueDate = addDays(plantDate, task.daysAfterPlanting);
      const daysUntilDue = differenceInDays(dueDate, today);
      const isComplete = daysSincePlanting > task.daysAfterPlanting + 7; // Assume done if 7 days past
      const isDue = daysUntilDue >= -3 && daysUntilDue <= 3;
      const isUpcoming = daysUntilDue > 3 && daysUntilDue <= 10;

      return {
        ...task,
        dueDate,
        daysUntilDue,
        isComplete,
        isDue,
        isUpcoming,
      };
    });
  }, [plantedAt]);

  if (!plantedAt || schedule.length === 0) {
    return null;
  }

  const dueTasks = schedule.filter(t => t.isDue && !t.isComplete);
  const upcomingTasks = schedule.filter(t => t.isUpcoming && !t.isComplete);

  return (
    <motion.div
      className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-amber-600" />
        <h4 className="font-bold text-gray-900">
          Maintenance Riffs
        </h4>
        <span className="text-xs text-gray-500">
          Bed #{bedNumber}
        </span>
      </div>

      {/* Due Now Tasks */}
      {dueTasks.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-xs font-bold text-red-600 uppercase">⚡ Due Now</p>
          {dueTasks.map(task => (
            <motion.div
              key={task.id}
              className="p-3 rounded-xl bg-white border-2 border-red-200 shadow-sm"
              animate={{ 
                borderColor: ['#FCA5A5', '#EF4444', '#FCA5A5'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${task.color}20`, color: task.color }}
                  >
                    {task.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{task.name}</p>
                    <p className="text-xs text-gray-500">{task.description}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-red-600">
                  {task.daysUntilDue === 0 ? 'TODAY' : `${Math.abs(task.daysUntilDue)}d ${task.daysUntilDue < 0 ? 'ago' : ''}`}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-amber-600 uppercase">📅 Upcoming</p>
          {upcomingTasks.map(task => (
            <div
              key={task.id}
              className="p-2 rounded-lg bg-white/50 border border-amber-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center opacity-60"
                    style={{ backgroundColor: `${task.color}20`, color: task.color }}
                  >
                    {task.icon}
                  </div>
                  <span className="text-sm text-gray-700">{task.name}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {format(task.dueDate, 'MMM d')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {schedule.filter(t => t.isComplete).length > 0 && (
        <div className="mt-4 pt-3 border-t border-amber-200">
          <div className="flex items-center gap-2 text-xs text-green-600">
            <Check className="w-4 h-4" />
            <span>{schedule.filter(t => t.isComplete).length} tasks completed</span>
          </div>
        </div>
      )}

      {/* No Tasks Due */}
      {dueTasks.length === 0 && upcomingTasks.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No maintenance tasks due</p>
        </div>
      )}
    </motion.div>
  );
};

export default MaintenanceRiffs;
