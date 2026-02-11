import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Leaf, Shield, Flower2, Check } from 'lucide-react';
import { MasterCrop } from '@/hooks/useMasterCrops';

interface ScentCorridorPanelProps {
  frequencyHz: number;
  zoneColor: string;
  zoneName: string;
  chordCrops: (MasterCrop | null)[];
  allCrops: MasterCrop[];
  onSwapRequest?: (crop: MasterCrop) => void;
}

interface AromaticSpecies {
  crop: MasterCrop;
  tier: 'culinary' | 'pest' | 'fragrance';
  roleTag: string;
  deterrentTarget: string | null;
  inRecipe: boolean;
}

const extractDeterrentTarget = (note: string | null): string | null => {
  if (!note) return null;
  const lower = note.toLowerCase();
  const targets: string[] = [];
  if (lower.includes('mosquito')) targets.push('Mosquito');
  if (lower.includes('aphid')) targets.push('Aphid');
  if (lower.includes('deer')) targets.push('Deer');
  if (lower.includes('beetle')) targets.push('Beetle');
  if (lower.includes('moth')) targets.push('Moth');
  if (lower.includes('fly') || lower.includes('flies')) targets.push('Flies');
  if (lower.includes('rabbit')) targets.push('Rabbit');
  if (lower.includes('pest')) targets.push('Pests');
  return targets.length > 0 ? targets.join(', ') : null;
};

const classifySpecies = (
  crop: MasterCrop,
  chordCropIds: Set<string>
): AromaticSpecies | null => {
  const note = (crop.library_note || '').toLowerCase();
  const category = (crop.category || '').toLowerCase();
  const role = (crop.guild_role || '').toLowerCase();

  let tier: 'culinary' | 'pest' | 'fragrance' | null = null;
  let roleTag = '';

  // Pest-Deterrent: library_note contains "Pest Barrier" OR guild_role = 'Sentinel'
  if (note.includes('pest barrier') || role === 'sentinel') {
    tier = 'pest';
    roleTag = 'Sentinel';
  }
  // Culinary: library_note contains "Aromatic" (not "Pest") AND guild_role = 'Enhancer'
  else if (note.includes('aromatic') && !note.includes('pest') && role === 'enhancer') {
    tier = 'culinary';
    roleTag = 'Enhancer';
  }
  // Fragrance: library_note contains "Fragrance" OR "Ground Cover" OR "Pollinator"
  else if (note.includes('fragrance') || note.includes('ground cover') || note.includes('pollinator')) {
    tier = 'fragrance';
    roleTag = note.includes('pollinator') ? 'Signal' : 'Fragrance';
  }
  // Fallback: category = 'Dye/Fiber/Aromatic'
  else if (category === 'dye/fiber/aromatic') {
    tier = 'fragrance';
    roleTag = 'Aromatic';
  }

  if (!tier) return null;

  return {
    crop,
    tier,
    roleTag,
    deterrentTarget: extractDeterrentTarget(crop.library_note),
    inRecipe: chordCropIds.has(crop.id),
  };
};

const TIERS = [
  { key: 'culinary' as const, label: 'CULINARY AROMATICS', icon: Leaf, description: 'Dual-purpose herbs: culinary + pest-confusing' },
  { key: 'pest' as const, label: 'PEST DETERRENT BARRIER', icon: Shield, description: 'Biological exclusion zone species' },
  { key: 'fragrance' as const, label: 'FRAGRANCE CORRIDOR', icon: Flower2, description: 'Pollinator-attracting fragrance species' },
];

const ScentCorridorPanel = ({
  frequencyHz,
  zoneColor,
  zoneName,
  chordCrops,
  allCrops,
  onSwapRequest,
}: ScentCorridorPanelProps) => {
  const [openTiers, setOpenTiers] = useState<Set<string>>(new Set(['culinary', 'pest', 'fragrance']));

  const toggleTier = (key: string) => {
    setOpenTiers(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const chordCropIds = useMemo(
    () => new Set(chordCrops.filter(Boolean).map(c => c!.id)),
    [chordCrops]
  );

  const aromatics = useMemo(() => {
    const zoneCrops = allCrops.filter(c => c.frequency_hz === frequencyHz);
    const classified: AromaticSpecies[] = [];
    for (const crop of zoneCrops) {
      const spec = classifySpecies(crop, chordCropIds);
      if (spec) classified.push(spec);
    }
    return classified;
  }, [allCrops, frequencyHz, chordCropIds]);

  const grouped = useMemo(() => ({
    culinary: aromatics.filter(a => a.tier === 'culinary'),
    pest: aromatics.filter(a => a.tier === 'pest'),
    fragrance: aromatics.filter(a => a.tier === 'fragrance'),
  }), [aromatics]);

  const totalRoles = 3;
  const filledRoles = [
    grouped.culinary.some(a => a.inRecipe),
    grouped.pest.some(a => a.inRecipe),
    grouped.fragrance.some(a => a.inRecipe),
  ].filter(Boolean).length;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(0 0% 5%)',
        border: `1px solid hsl(0 0% 12%)`,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: '1px solid hsl(0 0% 10%)' }}
      >
        <Shield className="w-4 h-4" style={{ color: `${zoneColor}90` }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: `${zoneColor}bb` }}>
          SCENT CORRIDOR — {zoneName.toUpperCase()} ZONE
        </span>
        <span
          className="text-[8px] font-mono px-1.5 py-0.5 rounded-full ml-auto"
          style={{
            background: `${zoneColor}15`,
            color: `${zoneColor}aa`,
            border: `1px solid ${zoneColor}25`,
          }}
        >
          {aromatics.length} species
        </span>
      </div>

      {/* Tiers */}
      <div className="px-4 pb-3 space-y-1 pt-2">
        {TIERS.map(tier => {
          const items = grouped[tier.key];
          const isOpen = openTiers.has(tier.key);
          const TierIcon = tier.icon;

          return (
            <div key={tier.key}>
              <button
                onClick={() => toggleTier(tier.key)}
                className="w-full flex items-center gap-2 py-2 text-left"
              >
                <TierIcon className="w-3.5 h-3.5" style={{ color: `${zoneColor}90` }} />
                <span className="text-[9px] font-mono tracking-wider font-bold" style={{ color: `${zoneColor}cc` }}>
                  {tier.label}
                </span>
                <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                  ({items.length})
                </span>
                <ChevronDown
                  className="w-3 h-3 ml-auto transition-transform"
                  style={{
                    color: 'hsl(0 0% 35%)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {items.length === 0 ? (
                      <p className="text-[9px] font-mono py-2 pl-6" style={{ color: 'hsl(0 0% 30%)' }}>
                        No {tier.label.toLowerCase()} in {zoneName} zone
                      </p>
                    ) : (
                      <div className="space-y-1 pb-2">
                        {items.map(item => (
                          <button
                            key={item.crop.id}
                            onClick={() => onSwapRequest?.(item.crop)}
                            className="w-full flex items-center gap-2 py-1.5 px-2 rounded-lg text-left transition-all hover:brightness-125"
                            style={{
                              background: item.inRecipe ? `${zoneColor}08` : 'transparent',
                              border: item.inRecipe ? `1px solid ${zoneColor}20` : '1px solid transparent',
                            }}
                          >
                            {/* Role badge */}
                            <span
                              className="text-[7px] font-mono px-1.5 py-0.5 rounded shrink-0"
                              style={{
                                background: tier.key === 'culinary'
                                  ? 'hsl(120 30% 15%)'
                                  : tier.key === 'pest'
                                    ? 'hsl(0 30% 15%)'
                                    : 'hsl(280 30% 15%)',
                                color: tier.key === 'culinary'
                                  ? 'hsl(120 50% 60%)'
                                  : tier.key === 'pest'
                                    ? 'hsl(0 50% 60%)'
                                    : 'hsl(280 50% 60%)',
                              }}
                            >
                              {item.roleTag}
                            </span>

                            {/* Species name */}
                            <span
                              className="text-[10px] font-mono flex-1 truncate"
                              style={{ color: item.inRecipe ? `${zoneColor}cc` : 'hsl(0 0% 55%)' }}
                            >
                              {item.crop.common_name || item.crop.name}
                            </span>

                            {/* Deterrent target */}
                            {item.deterrentTarget && (
                              <span
                                className="text-[7px] font-mono px-1.5 py-0.5 rounded shrink-0"
                                style={{
                                  background: 'hsl(0 0% 8%)',
                                  color: 'hsl(0 40% 55%)',
                                  border: '1px solid hsl(0 30% 20%)',
                                }}
                              >
                                🛡 {item.deterrentTarget}
                              </span>
                            )}

                            {/* In-recipe checkmark */}
                            {item.inRecipe && (
                              <Check className="w-3 h-3 shrink-0" style={{ color: zoneColor }} />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer coverage stats */}
      <div
        className="px-4 py-2 flex items-center gap-3"
        style={{ borderTop: '1px solid hsl(0 0% 10%)' }}
      >
        <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
          {filledRoles}/{totalRoles} aromatic layers covered
        </span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(0 0% 10%)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(filledRoles / totalRoles) * 100}%`,
              background: `linear-gradient(90deg, ${zoneColor}80, ${zoneColor})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScentCorridorPanel;
