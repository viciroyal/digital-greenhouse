import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sprout, Scissors, Beaker, Calendar, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMasterCrops, MasterCrop } from '@/hooks/useMasterCrops';
import { getCurrentSeasonalTasks } from '@/data/almanacData';
import { getLunarPhase } from '@/hooks/useLunarPhase';

interface HarvestItem {
  cropName: string;
  bedNumber: number;
  daysLeft: number;
  zoneColor: string;
}

interface PlantNowItem {
  crop: MasterCrop;
  reason: string;
}

const TwoWeekDashboard = () => {
  const [open, setOpen] = useState(false);
  const { data: allCrops } = useMasterCrops();
  const lunar = useMemo(() => getLunarPhase(), []);

  // Fetch bed plantings with their beds
  const { data: plantings } = useQuery({
    queryKey: ['two-week-plantings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bed_plantings')
        .select('*, crop:master_crops(*), bed:garden_beds(*)');
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Harvest countdown: beds with planted_at + harvest_days within 14 days
  const harvestItems = useMemo((): HarvestItem[] => {
    if (!plantings) return [];
    const now = Date.now();
    const twoWeeks = 14 * 24 * 60 * 60 * 1000;
    const items: HarvestItem[] = [];

    for (const p of plantings) {
      const crop = p.crop as any;
      const bed = p.bed as any;
      if (!crop?.harvest_days || !p.planted_at || !bed) continue;

      const plantedAt = new Date(p.planted_at).getTime();
      const harvestDate = plantedAt + crop.harvest_days * 24 * 60 * 60 * 1000;
      const daysLeft = Math.ceil((harvestDate - now) / (24 * 60 * 60 * 1000));

      if (daysLeft >= -3 && daysLeft <= 14) {
        items.push({
          cropName: crop.common_name || crop.name,
          bedNumber: bed.bed_number,
          daysLeft,
          zoneColor: bed.zone_color || '#888',
        });
      }
    }
    return items.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [plantings]);

  // Crops to plant now: match current month's planting_season
  const plantNowItems = useMemo((): PlantNowItem[] => {
    if (!allCrops) return [];
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const shortMonth = now.toLocaleString('en-US', { month: 'short' }).toLowerCase();
    const seasonKeywords = [month, shortMonth];
    // Also match season names
    const m = now.getMonth();
    if (m >= 2 && m <= 4) seasonKeywords.push('spring');
    if (m >= 5 && m <= 7) seasonKeywords.push('summer');
    if (m >= 8 && m <= 10) seasonKeywords.push('fall', 'autumn');
    if (m === 11 || m <= 1) seasonKeywords.push('winter');

    const matches = allCrops.filter(c => {
      if (!c.planting_season || c.planting_season.length === 0) return false;
      return c.planting_season.some(s =>
        seasonKeywords.some(kw => s.toLowerCase().includes(kw))
      );
    });

    // Deduplicate and limit
    const seen = new Set<string>();
    const items: PlantNowItem[] = [];
    for (const c of matches) {
      const key = c.common_name || c.name;
      if (seen.has(key.toLowerCase())) continue;
      seen.add(key.toLowerCase());
      items.push({
        crop: c,
        reason: `${lunar.plantingType} window`,
      });
      if (items.length >= 8) break;
    }
    return items;
  }, [allCrops, lunar]);

  // Seasonal soil/spray tasks
  const seasonalTasks = useMemo(() => getCurrentSeasonalTasks(), []);

  const totalItems = harvestItems.length + plantNowItems.length + seasonalTasks.length;

  if (totalItems === 0) return null;

  const priorityColor = harvestItems.some(h => h.daysLeft <= 3)
    ? 'hsl(0 60% 50%)'
    : harvestItems.length > 0
      ? 'hsl(45 70% 55%)'
      : 'hsl(140 50% 45%)';

  return (
    <div className="mx-auto max-w-2xl px-4 mt-2">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(0 0% 6%), hsl(0 0% 4%))',
          border: `1px solid ${open ? priorityColor + '40' : 'hsl(0 0% 12%)'}`,
          transition: 'border-color 0.3s',
        }}
      >
        {/* Header */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full px-4 py-3 flex items-center gap-3 text-left"
        >
          <Calendar className="w-4 h-4" style={{ color: priorityColor }} />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono tracking-widest block" style={{ color: priorityColor }}>
              2-WEEK FIELD WINDOW
            </span>
            <span className="text-[8px] font-mono block mt-0.5" style={{ color: 'hsl(0 0% 40%)' }}>
              {harvestItems.length > 0 && `${harvestItems.length} harvest`}
              {harvestItems.length > 0 && plantNowItems.length > 0 && ' · '}
              {plantNowItems.length > 0 && `${plantNowItems.length} to plant`}
              {(harvestItems.length > 0 || plantNowItems.length > 0) && seasonalTasks.length > 0 && ' · '}
              {seasonalTasks.length > 0 && `${seasonalTasks.length} tasks`}
            </span>
          </div>
          {harvestItems.some(h => h.daysLeft <= 3) && (
            <span
              className="text-[8px] font-mono px-2 py-0.5 rounded-full animate-pulse"
              style={{ background: 'hsl(0 60% 20%)', color: 'hsl(0 70% 70%)', border: '1px solid hsl(0 50% 35%)' }}
            >
              HARVEST NOW
            </span>
          )}
          <Link to="/weekly-tasks" className="text-[8px] font-mono px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
            style={{ background: 'hsl(140 30% 12%)', color: 'hsl(140 50% 55%)', border: '1px solid hsl(140 30% 25%)' }}
            onClick={(e) => e.stopPropagation()}>
            <ExternalLink className="w-2.5 h-2.5 inline mr-0.5" /> FULL CALENDAR
          </Link>
          <ChevronDown
            className="w-3.5 h-3.5 transition-transform"
            style={{
              color: 'hsl(0 0% 35%)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid hsl(0 0% 10%)' }}>

                {/* ─── Harvest Countdown ─── */}
                {harvestItems.length > 0 && (
                  <div className="pt-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Scissors className="w-3 h-3" style={{ color: 'hsl(45 70% 55%)' }} />
                      <span className="text-[9px] font-mono tracking-wider" style={{ color: 'hsl(45 60% 55%)' }}>
                        HARVEST WINDOW
                      </span>
                    </div>
                    <div className="space-y-1">
                      {harvestItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{
                            background: item.daysLeft <= 0
                              ? 'hsl(0 40% 10% / 0.5)'
                              : item.daysLeft <= 3
                                ? 'hsl(45 40% 10% / 0.3)'
                                : 'hsl(0 0% 6%)',
                            border: `1px solid ${item.daysLeft <= 0 ? 'hsl(0 50% 30% / 0.5)' : 'hsl(0 0% 10%)'}`,
                          }}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ background: item.zoneColor, boxShadow: `0 0 4px ${item.zoneColor}60` }} />
                          <span className="text-[10px] font-mono flex-1" style={{ color: 'hsl(0 0% 70%)' }}>
                            {item.cropName}
                          </span>
                          <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                            Bed {item.bedNumber}
                          </span>
                          <span
                            className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                            style={{
                              color: item.daysLeft <= 0
                                ? 'hsl(0 70% 65%)'
                                : item.daysLeft <= 3
                                  ? 'hsl(45 80% 60%)'
                                  : 'hsl(140 50% 55%)',
                              background: item.daysLeft <= 0
                                ? 'hsl(0 50% 15%)'
                                : item.daysLeft <= 3
                                  ? 'hsl(45 40% 12%)'
                                  : 'hsl(140 30% 10%)',
                            }}
                          >
                            {item.daysLeft <= 0 ? 'READY' : `${item.daysLeft}d`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Plant Now ─── */}
                {plantNowItems.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sprout className="w-3 h-3" style={{ color: 'hsl(140 50% 50%)' }} />
                      <span className="text-[9px] font-mono tracking-wider" style={{ color: 'hsl(140 45% 50%)' }}>
                        PLANT THIS WINDOW
                      </span>
                      <span className="text-[7px] font-mono px-1.5 py-0.5 rounded-full ml-auto"
                        style={{ background: 'hsl(270 30% 15%)', color: 'hsl(270 40% 60%)', border: '1px solid hsl(270 30% 25%)' }}>
                        {lunar.plantingType}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {plantNowItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                          style={{
                            background: `${item.crop.zone_color}08`,
                            border: `1px solid ${item.crop.zone_color}20`,
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.crop.zone_color }} />
                          <span className="text-[9px] font-mono" style={{ color: `${item.crop.zone_color}cc` }}>
                            {item.crop.common_name || item.crop.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Seasonal Tasks ─── */}
                {seasonalTasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Beaker className="w-3 h-3" style={{ color: 'hsl(200 50% 55%)' }} />
                      <span className="text-[9px] font-mono tracking-wider" style={{ color: 'hsl(200 45% 55%)' }}>
                        SOIL & FIELD TASKS
                      </span>
                    </div>
                    <div className="space-y-1">
                      {seasonalTasks.map(task => (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{
                            background: 'hsl(0 0% 6%)',
                            border: '1px solid hsl(0 0% 10%)',
                          }}
                        >
                          <Clock className="w-3 h-3" style={{
                            color: task.priority === 'high'
                              ? 'hsl(0 60% 55%)'
                              : task.priority === 'medium'
                                ? 'hsl(45 60% 55%)'
                                : 'hsl(0 0% 40%)',
                          }} />
                          <span className="text-[10px] font-mono flex-1" style={{ color: 'hsl(0 0% 65%)' }}>
                            {task.task}
                          </span>
                          <span
                            className="text-[8px] font-mono px-1.5 py-0.5 rounded uppercase"
                            style={{
                              background: task.priority === 'high' ? 'hsl(0 40% 12%)' : 'hsl(0 0% 8%)',
                              color: task.priority === 'high'
                                ? 'hsl(0 60% 60%)'
                                : task.priority === 'medium'
                                  ? 'hsl(45 50% 55%)'
                                  : 'hsl(0 0% 40%)',
                            }}
                          >
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TwoWeekDashboard;
