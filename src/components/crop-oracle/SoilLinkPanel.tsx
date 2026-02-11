import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Beaker, Leaf } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import JadamPanel from './JadamPanel';

interface SoilLinkPanelProps {
  frequencyHz: number;
  environment: string;
  zoneColor: string;
  zoneName: string;
}

const SoilLinkPanel = ({ frequencyHz, environment, zoneColor, zoneName }: SoilLinkPanelProps) => {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'master-mix' | 'jadam'>('master-mix');

  const { data: amendments } = useQuery({
    queryKey: ['soil-amendments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('soil_amendments')
        .select('*')
        .order('category');
      if (error) throw error;
      return data;
    },
  });

  const soilRecipe = useMemo(() => {
    if (!amendments) return [];
    return amendments.map(a => {
      const hasAffinity = a.frequency_affinity?.includes(frequencyHz);
      const baseQty = parseFloat(a.quantity_per_60ft) || 0;
      // 2x boost when frequency matches
      const qty = hasAffinity ? baseQty * 2 : baseQty;
      let scaledQty = qty;
      if (environment === 'pot') {
        // Scale down to ~1 gallon container equivalent
        scaledQty = qty * 0.02;
      }
      return {
        ...a,
        displayQty: scaledQty,
        boosted: hasAffinity,
      };
    });
  }, [amendments, frequencyHz, environment]);

  const isPot = environment === 'pot';
  const unit = isPot ? 'tbsp' : 'qt';

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(0 0% 5%)',
        border: '1px solid hsl(0 0% 12%)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center gap-2 text-left"
      >
        <Beaker className="w-4 h-4" style={{ color: `${zoneColor}90` }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: `${zoneColor}bb` }}>
          SOIL PROTOCOL — {zoneName.toUpperCase()} ZONE
        </span>
        <ChevronDown
          className="w-3 h-3 ml-auto transition-transform"
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3" style={{ borderTop: '1px solid hsl(0 0% 10%)' }}>
              {/* Tab Switcher */}
              <div className="flex gap-1 pt-2 mb-3">
                {[
                  { id: 'master-mix' as const, label: '5-QUART MASTER MIX', icon: <Beaker className="w-3 h-3" /> },
                  { id: 'jadam' as const, label: 'JADAM 자연농업', icon: <Leaf className="w-3 h-3" /> },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-mono tracking-wider transition-all flex-1 justify-center"
                    style={{
                      background: activeTab === t.id ? `${zoneColor}15` : 'hsl(0 0% 4%)',
                      border: `1px solid ${activeTab === t.id ? `${zoneColor}40` : 'hsl(0 0% 10%)'}`,
                      color: activeTab === t.id ? zoneColor : 'hsl(0 0% 40%)',
                    }}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* Master Mix Tab */}
              {activeTab === 'master-mix' && (
                <div className="space-y-1.5">
                  <p className="text-[9px] font-mono mb-2" style={{ color: 'hsl(0 0% 40%)' }}>
                    5-QUART MASTER MIX • {isPot ? 'SCALED FOR CONTAINER' : '60-FT BED'} • ⚡ = ZONE BOOST (2×)
                  </p>
                  {soilRecipe.map(a => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 py-1.5 px-2 rounded-lg"
                      style={{
                        background: a.boosted ? `${zoneColor}08` : 'transparent',
                        border: a.boosted ? `1px solid ${zoneColor}15` : '1px solid transparent',
                      }}
                    >
                      {a.boosted && (
                        <span className="text-[10px]">⚡</span>
                      )}
                      <span
                        className="text-[10px] font-mono flex-1"
                        style={{ color: a.boosted ? `${zoneColor}cc` : 'hsl(0 0% 55%)' }}
                      >
                        {a.name}
                      </span>
                      <span
                        className="text-[10px] font-mono font-bold"
                        style={{ color: a.boosted ? zoneColor : 'hsl(0 0% 45%)' }}
                      >
                        {a.displayQty.toFixed(isPot ? 2 : 1)} {unit}
                      </span>
                      <span
                        className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          background: 'hsl(0 0% 8%)',
                          color: 'hsl(0 0% 35%)',
                        }}
                      >
                        {a.category}
                      </span>
                    </div>
                  ))}
                  <p className="text-[8px] font-mono pt-1" style={{ color: 'hsl(0 0% 30%)' }}>
                    Apply before planting to "tune the instrument" to {frequencyHz}Hz
                  </p>
                </div>
              )}

              {/* JADAM Tab */}
              {activeTab === 'jadam' && (
                <JadamPanel
                  frequencyHz={frequencyHz}
                  zoneColor={zoneColor}
                  zoneName={zoneName}
                  environment={environment}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoilLinkPanel;
