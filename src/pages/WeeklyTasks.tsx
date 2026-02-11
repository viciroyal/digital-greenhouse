import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { LAST_FROST_BY_ZONE, FIRST_FROST_BY_ZONE } from '@/lib/frostDates';
import { getCropLayer } from '@/lib/growthLayers';
import { getLunarPhase } from '@/hooks/useLunarPhase';
import { getCurrentSeasonalTasks } from '@/data/almanacData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Calendar, Sprout, Scissors, SunMedium, Droplets,
  Shovel, Leaf, ChevronDown, Clock, AlertTriangle, Moon, Thermometer,
} from 'lucide-react';

/* ─── TYPES ─── */
interface WeeklyTask {
  id: string;
  type: 'seed_start' | 'transplant' | 'direct_sow' | 'harvest' | 'soil' | 'maintenance';
  cropName: string;
  recipeName: string;
  environment: string;
  zoneColor: string;
  priority: 'urgent' | 'this_week' | 'upcoming';
  description: string;
  daysUntil: number;
  propagation?: string;
  icon: typeof Sprout;
}

const TASK_TYPE_META: Record<string, { label: string; color: string; icon: typeof Sprout }> = {
  seed_start:  { label: '🏠 SEED START',  color: 'hsl(270 50% 55%)', icon: Sprout },
  transplant:  { label: '🌱 TRANSPLANT',  color: 'hsl(140 50% 50%)', icon: Leaf },
  direct_sow:  { label: '🌰 DIRECT SOW',  color: 'hsl(90 50% 50%)',  icon: Shovel },
  harvest:     { label: '🌾 HARVEST',      color: 'hsl(45 70% 55%)',  icon: Scissors },
  soil:        { label: '🧪 SOIL PREP',    color: 'hsl(25 50% 50%)',  icon: Droplets },
  maintenance: { label: '🔧 FIELD TASK',   color: 'hsl(200 45% 55%)', icon: Clock },
};

/* ─── SEASON → MONTH MAPPING ─── */
const SEASON_MONTHS: Record<string, number[]> = {
  spring: [2, 3, 4], 'early spring': [1, 2], 'late spring': [3, 4],
  summer: [5, 6, 7], 'early summer': [5, 6], 'late summer': [7, 8],
  fall: [8, 9, 10], 'early fall': [8, 9], winter: [11, 0, 1],
  'year-round': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

const getPlantMonths = (seasons: string[]): Set<number> => {
  const months = new Set<number>();
  for (const s of seasons) {
    const mapped = SEASON_MONTHS[s.toLowerCase()];
    if (mapped) mapped.forEach(m => months.add(m));
  }
  return months;
};

/* ─── MAIN COMPONENT ─── */
const WeeklyTasks = () => {
  const { data: allCrops } = useMasterCrops();
  const lunar = useMemo(() => getLunarPhase(), []);
  const [hardinessZone] = useState<number>(8); // Default Zone 8, could be user-configured
  const [expandedType, setExpandedType] = useState<string | null>(null);

  // Fetch user's saved recipes
  const { data: savedRecipes, isLoading: recipesLoading } = useQuery({
    queryKey: ['saved-recipes-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch bed plantings for harvest tracking
  const { data: plantings } = useQuery({
    queryKey: ['weekly-plantings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bed_plantings')
        .select('*, crop:master_crops(*), bed:garden_beds(*)');
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Build crop lookup map
  const cropMap = useMemo(() => {
    if (!allCrops) return new Map<string, MasterCrop>();
    const map = new Map<string, MasterCrop>();
    for (const c of allCrops) {
      map.set(c.id, c);
      map.set((c.common_name || c.name).toLowerCase(), c);
      map.set(c.name.toLowerCase(), c);
    }
    return map;
  }, [allCrops]);

  // Generate weekly tasks from saved recipes + bed plantings
  const weeklyTasks = useMemo((): WeeklyTask[] => {
    const tasks: WeeklyTask[] = [];
    const now = new Date();
    const today = now.getTime();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    const baseZone = Math.floor(hardinessZone);
    const lastFrost = LAST_FROST_BY_ZONE[baseZone];
    const firstFrost = FIRST_FROST_BY_ZONE[baseZone];

    if (!lastFrost || !firstFrost) return tasks;

    const lastFrostDate = new Date(now.getFullYear(), lastFrost.month - 1, lastFrost.day);
    const firstFrostDate = new Date(now.getFullYear(), firstFrost.month - 1, firstFrost.day);

    // ─── RECIPE-DRIVEN TASKS ───
    if (savedRecipes && savedRecipes.length > 0) {
      for (const recipe of savedRecipes) {
        const chordData = recipe.chord_data as any;
        if (!chordData || !Array.isArray(chordData)) continue;

        for (const slot of chordData) {
          const cropName = slot?.cropName || slot?.crop_name;
          if (!cropName) continue;

          const crop = cropMap.get(cropName.toLowerCase());
          if (!crop) continue;

          const propMethod = (crop as any).propagation_method || 'both';
          const plantMonths = getPlantMonths(crop.planting_season || []);
          const isPlantingMonth = plantMonths.has(currentMonth);

          // Seed start: 4-6 weeks before planting month for transplants
          if (propMethod === 'transplant' || propMethod === 'both') {
            const seedStartMonth = (currentMonth + 1) % 12; // Next month = planting time?
            if (plantMonths.has(seedStartMonth)) {
              const daysUntil = Math.max(0, 28 - currentDay); // ~4 weeks before next month
              tasks.push({
                id: `seed-${recipe.id}-${crop.id}`,
                type: 'seed_start',
                cropName: crop.common_name || crop.name,
                recipeName: recipe.name || `${recipe.zone_name} Recipe`,
                environment: recipe.environment,
                zoneColor: crop.zone_color,
                priority: daysUntil <= 7 ? 'this_week' : 'upcoming',
                description: `Start ${crop.common_name || crop.name} seeds indoors. Transplant after ${lastFrost.label}.`,
                daysUntil,
                propagation: 'transplant',
                icon: Sprout,
              });
            }
          }

          // Direct sow: when planting month matches current month
          if ((propMethod === 'direct_sow' || propMethod === 'both') && isPlantingMonth) {
            const daysAfterFrost = Math.ceil((today - lastFrostDate.getTime()) / (24 * 60 * 60 * 1000));
            const safeToSow = daysAfterFrost >= 0 || baseZone >= 9;
            tasks.push({
              id: `sow-${recipe.id}-${crop.id}`,
              type: 'direct_sow',
              cropName: crop.common_name || crop.name,
              recipeName: recipe.name || `${recipe.zone_name} Recipe`,
              environment: recipe.environment,
              zoneColor: crop.zone_color,
              priority: safeToSow ? 'this_week' : 'upcoming',
              description: safeToSow
                ? `Direct sow ${crop.common_name || crop.name} outdoors. Spacing: ${crop.spacing_inches || '?'}″.`
                : `Wait until after last frost (${lastFrost.label}) to sow ${crop.common_name || crop.name}.`,
              daysUntil: safeToSow ? 0 : Math.max(0, Math.ceil((lastFrostDate.getTime() - today) / (24 * 60 * 60 * 1000))),
              propagation: 'direct_sow',
              icon: Shovel,
            });
          }

          // Transplant window: in planting month + after last frost
          if (propMethod === 'transplant' && isPlantingMonth) {
            const daysAfterFrost = Math.ceil((today - lastFrostDate.getTime()) / (24 * 60 * 60 * 1000));
            if (daysAfterFrost >= 14) {
              tasks.push({
                id: `trans-${recipe.id}-${crop.id}`,
                type: 'transplant',
                cropName: crop.common_name || crop.name,
                recipeName: recipe.name || `${recipe.zone_name} Recipe`,
                environment: recipe.environment,
                zoneColor: crop.zone_color,
                priority: 'this_week',
                description: `Transplant ${crop.common_name || crop.name} seedlings to ${recipe.environment}. Last frost passed ${daysAfterFrost}d ago.`,
                daysUntil: 0,
                propagation: 'transplant',
                icon: Leaf,
              });
            }
          }
        }
      }
    }

    // ─── BED PLANTING HARVEST TASKS ───
    if (plantings) {
      for (const p of plantings) {
        const crop = p.crop as any;
        const bed = p.bed as any;
        if (!crop?.harvest_days || !p.planted_at || !bed) continue;

        const plantedAt = new Date(p.planted_at).getTime();
        const harvestDate = plantedAt + crop.harvest_days * 24 * 60 * 60 * 1000;
        const daysLeft = Math.ceil((harvestDate - today) / (24 * 60 * 60 * 1000));

        if (daysLeft >= -7 && daysLeft <= 14) {
          tasks.push({
            id: `harvest-${p.id}`,
            type: 'harvest',
            cropName: crop.common_name || crop.name,
            recipeName: `Bed ${bed.bed_number}`,
            environment: 'garden',
            zoneColor: bed.zone_color || '#888',
            priority: daysLeft <= 0 ? 'urgent' : daysLeft <= 3 ? 'this_week' : 'upcoming',
            description: daysLeft <= 0
              ? `${crop.common_name || crop.name} is READY to harvest from Bed ${bed.bed_number}!`
              : `${crop.common_name || crop.name} harvest in ${daysLeft} days (Bed ${bed.bed_number}).`,
            daysUntil: daysLeft,
            propagation: undefined,
            icon: Scissors,
          });
        }
      }
    }

    // ─── SEASONAL SOIL & FIELD TASKS ───
    const seasonalTasks = getCurrentSeasonalTasks();
    for (const task of seasonalTasks) {
      tasks.push({
        id: `seasonal-${task.id}`,
        type: task.task.toLowerCase().includes('soil') || task.task.toLowerCase().includes('compost') ? 'soil' : 'maintenance',
        cropName: '',
        recipeName: '',
        environment: '',
        zoneColor: 'hsl(0 0% 40%)',
        priority: task.priority === 'high' ? 'urgent' : task.priority === 'medium' ? 'this_week' : 'upcoming',
        description: task.task,
        daysUntil: 0,
        propagation: undefined,
        icon: Clock,
      });
    }

    // ─── FROST WARNING TASK ───
    const daysToFrost = Math.ceil((firstFrostDate.getTime() - today) / (24 * 60 * 60 * 1000));
    if (daysToFrost > 0 && daysToFrost <= 30) {
      tasks.push({
        id: 'frost-warning',
        type: 'maintenance',
        cropName: '',
        recipeName: '',
        environment: '',
        zoneColor: 'hsl(200 60% 55%)',
        priority: daysToFrost <= 7 ? 'urgent' : 'this_week',
        description: `First frost expected in ~${daysToFrost} days (${firstFrost.label}). Prepare row covers, harvest tender crops.`,
        daysUntil: daysToFrost,
        propagation: undefined,
        icon: Thermometer,
      });
    }

    // Dedupe by id
    const seen = new Set<string>();
    return tasks
      .filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; })
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, this_week: 1, upcoming: 2 };
        return (priorityOrder[a.priority] - priorityOrder[b.priority]) || a.daysUntil - b.daysUntil;
      });
  }, [savedRecipes, plantings, cropMap, hardinessZone]);

  // Group tasks by type
  const grouped = useMemo(() => {
    const groups: Record<string, WeeklyTask[]> = {};
    for (const task of weeklyTasks) {
      if (!groups[task.type]) groups[task.type] = [];
      groups[task.type].push(task);
    }
    return groups;
  }, [weeklyTasks]);

  const urgentCount = weeklyTasks.filter(t => t.priority === 'urgent').length;
  const thisWeekCount = weeklyTasks.filter(t => t.priority === 'this_week').length;

  // Current week range
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/crop-oracle" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-apothecary text-xs">Back to Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Moon className="w-3 h-3" style={{ color: 'hsl(270 40% 60%)' }} />
            <span className="text-[9px] font-mono" style={{ color: 'hsl(270 40% 60%)' }}>
              {lunar.phase} · {lunar.plantingType}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-6 h-6" style={{ color: 'hsl(140 50% 50%)' }} />
            <h1 className="text-2xl root-text">THIS WEEK</h1>
          </div>
          <p className="font-apothecary text-xs text-muted-foreground">{weekLabel} · Zone {hardinessZone}</p>
        </div>

        {/* Summary badges */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {urgentCount > 0 && (
            <span className="text-[9px] font-mono px-3 py-1 rounded-full animate-pulse"
              style={{ background: 'hsl(0 50% 15%)', color: 'hsl(0 70% 65%)', border: '1px solid hsl(0 40% 30%)' }}>
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              {urgentCount} URGENT
            </span>
          )}
          {thisWeekCount > 0 && (
            <span className="text-[9px] font-mono px-3 py-1 rounded-full"
              style={{ background: 'hsl(140 30% 12%)', color: 'hsl(140 50% 55%)', border: '1px solid hsl(140 30% 25%)' }}>
              {thisWeekCount} THIS WEEK
            </span>
          )}
          <span className="text-[9px] font-mono px-3 py-1 rounded-full"
            style={{ background: 'hsl(0 0% 8%)', color: 'hsl(0 0% 40%)', border: '1px solid hsl(0 0% 15%)' }}>
            {weeklyTasks.length} TOTAL
          </span>
        </div>

        {/* Empty state */}
        {!recipesLoading && weeklyTasks.length === 0 && (
          <div className="text-center py-16 rounded-xl" style={{ background: 'hsl(0 0% 5%)', border: '1px solid hsl(0 0% 10%)' }}>
            <Sprout className="w-8 h-8 mx-auto mb-3" style={{ color: 'hsl(0 0% 20%)' }} />
            <p className="font-apothecary text-sm text-muted-foreground mb-1">No tasks this week</p>
            <p className="font-apothecary text-xs text-muted-foreground/60 mb-4">
              Save recipes in the Crop Oracle to generate weekly tasks
            </p>
            <Link to="/crop-oracle" className="gem-button px-4 py-2 text-xs font-apothecary text-primary-foreground inline-flex items-center gap-2">
              <SunMedium className="w-3 h-3" />
              Open Crop Oracle
            </Link>
          </div>
        )}

        {recipesLoading && (
          <p className="text-center font-apothecary text-muted-foreground py-12">Loading your field tasks…</p>
        )}

        {/* Task Groups */}
        <div className="space-y-3">
          {Object.entries(grouped).map(([type, tasks]) => {
            const meta = TASK_TYPE_META[type] || TASK_TYPE_META.maintenance;
            const isExpanded = expandedType === type || expandedType === null;
            const Icon = meta.icon;
            return (
              <div
                key={type}
                className="rounded-xl overflow-hidden"
                style={{ background: 'hsl(0 0% 5%)', border: `1px solid ${meta.color}20` }}
              >
                <button
                  onClick={() => setExpandedType(expandedType === type ? null : type)}
                  className="w-full px-4 py-3 flex items-center gap-2.5 text-left"
                >
                  <Icon className="w-4 h-4" style={{ color: meta.color }} />
                  <span className="text-[10px] font-mono tracking-wider flex-1" style={{ color: meta.color }}>
                    {meta.label}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                    style={{ background: `${meta.color}15`, color: meta.color }}>
                    {tasks.length}
                  </span>
                  <ChevronDown
                    className="w-3 h-3 transition-transform"
                    style={{ color: 'hsl(0 0% 30%)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-1.5" style={{ borderTop: `1px solid ${meta.color}10` }}>
                        {tasks.map(task => (
                          <div
                            key={task.id}
                            className="flex items-start gap-3 px-3 py-2.5 rounded-lg"
                            style={{
                              background: task.priority === 'urgent'
                                ? 'hsl(0 40% 8% / 0.6)'
                                : task.priority === 'this_week'
                                  ? 'hsl(0 0% 7%)'
                                  : 'hsl(0 0% 4%)',
                              border: `1px solid ${task.priority === 'urgent' ? 'hsl(0 40% 25% / 0.4)' : 'hsl(0 0% 10%)'}`,
                            }}
                          >
                            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                              style={{ background: task.zoneColor, boxShadow: `0 0 4px ${task.zoneColor}40` }} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                {task.cropName && (
                                  <span className="text-[10px] font-mono font-bold" style={{ color: 'hsl(0 0% 70%)' }}>
                                    {task.cropName}
                                  </span>
                                )}
                                {task.recipeName && (
                                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded"
                                    style={{ background: 'hsl(0 0% 8%)', color: 'hsl(0 0% 35%)' }}>
                                    {task.recipeName}
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] font-mono leading-relaxed" style={{ color: 'hsl(0 0% 50%)' }}>
                                {task.description}
                              </p>
                            </div>
                            <span
                              className="text-[8px] font-mono font-bold px-2 py-0.5 rounded flex-shrink-0"
                              style={{
                                color: task.priority === 'urgent'
                                  ? 'hsl(0 70% 65%)'
                                  : task.priority === 'this_week'
                                    ? 'hsl(140 50% 55%)'
                                    : 'hsl(0 0% 40%)',
                                background: task.priority === 'urgent'
                                  ? 'hsl(0 50% 12%)'
                                  : task.priority === 'this_week'
                                    ? 'hsl(140 30% 10%)'
                                    : 'hsl(0 0% 6%)',
                              }}
                            >
                              {task.priority === 'urgent' ? 'NOW' : task.daysUntil === 0 ? 'TODAY' : `${task.daysUntil}d`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {weeklyTasks.length > 0 && (
          <div className="text-center mt-8 font-apothecary text-[10px] text-muted-foreground/50">
            Tasks auto-generated from your saved recipes · {lunar.phase} · Zone {hardinessZone}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyTasks;
