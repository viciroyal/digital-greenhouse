import { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, X, GripVertical, Trash2, Sprout } from 'lucide-react';
import { MasterCrop } from '@/hooks/useMasterCrops';

interface PairingSlot {
  id: string;
  crop: MasterCrop | null;
}

interface CustomPairingPanelProps {
  zoneColor: string;
  zoneName: string;
  availableCrops: MasterCrop[];
}

const CustomPairingPanel = ({ zoneColor, zoneName, availableCrops }: CustomPairingPanelProps) => {
  const [slots, setSlots] = useState<PairingSlot[]>([
    { id: 'slot-1', crop: null },
    { id: 'slot-2', crop: null },
    { id: 'slot-3', crop: null },
  ]);
  const [searchSlotId, setSearchSlotId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const addSlot = () => {
    if (slots.length >= 13) return;
    setSlots(prev => [...prev, { id: `slot-${Date.now()}`, crop: null }]);
  };

  const removeSlot = (id: string) => {
    if (slots.length <= 2) return;
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  const assignCrop = (slotId: string, crop: MasterCrop) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, crop } : s));
    setSearchSlotId(null);
    setSearchQuery('');
  };

  const clearSlot = (slotId: string) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, crop: null } : s));
  };

  const usedCropIds = new Set(slots.filter(s => s.crop).map(s => s.crop!.id));

  const filteredCrops = availableCrops.filter(c => {
    if (usedCropIds.has(c.id)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.common_name || '').toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q)
    );
  }).slice(0, 30);

  const filledCount = slots.filter(s => s.crop).length;

  // Check companion synergies
  const getSynergyNote = useCallback((crop: MasterCrop): string | null => {
    const otherCrops = slots.filter(s => s.crop && s.crop.id !== crop.id).map(s => s.crop!);
    for (const other of otherCrops) {
      if (other.companion_crops?.some(c => c.toLowerCase() === crop.name.toLowerCase() || c.toLowerCase() === (crop.common_name || '').toLowerCase())) {
        return `Companion of ${other.common_name || other.name}`;
      }
    }
    return null;
  }, [slots]);

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: 'hsl(0 0% 5%)',
        border: `1px solid ${zoneColor}30`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={zoneColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            <circle cx="9" cy="9" r="2" />
            <circle cx="15" cy="15" r="2" />
            <path d="M9 15l6-6" />
          </svg>
          <span
            className="text-xs font-mono tracking-widest"
            style={{ color: zoneColor }}
          >
            CUSTOM PAIRINGS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
            {filledCount}/{slots.length} filled
          </span>
          <button
            onClick={addSlot}
            disabled={slots.length >= 13}
            className="p-1 rounded-md transition-all"
            style={{
              background: `${zoneColor}15`,
              border: `1px solid ${zoneColor}30`,
              color: zoneColor,
              opacity: slots.length >= 13 ? 0.3 : 1,
            }}
            title="Add slot (max 13)"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Drag-and-drop slot list */}
      <Reorder.Group
        axis="y"
        values={slots}
        onReorder={setSlots}
        className="space-y-1.5"
      >
        {slots.map((slot, index) => (
          <Reorder.Item
            key={slot.id}
            value={slot}
            className="flex items-center gap-2"
          >
            {/* Drag handle */}
            <div className="cursor-grab active:cursor-grabbing p-0.5" style={{ color: 'hsl(0 0% 25%)' }}>
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            {/* Slot number */}
            <span
              className="text-[9px] font-mono w-4 text-center"
              style={{ color: `${zoneColor}80` }}
            >
              {index + 1}
            </span>

            {/* Crop slot */}
            {slot.crop ? (
              <div
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  background: `${zoneColor}10`,
                  border: `1px solid ${zoneColor}25`,
                }}
              >
                <Sprout className="w-3.5 h-3.5" style={{ color: zoneColor }} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium truncate block" style={{ color: 'hsl(0 0% 80%)' }}>
                    {slot.crop.common_name || slot.crop.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                      {slot.crop.category}
                    </span>
                    {slot.crop.chord_interval && (
                      <span className="text-[8px] font-mono px-1 rounded" style={{ background: `${zoneColor}15`, color: zoneColor }}>
                        {slot.crop.chord_interval}
                      </span>
                    )}
                    {(() => {
                      const note = getSynergyNote(slot.crop);
                      return note ? (
                        <span className="text-[8px] font-mono px-1 rounded" style={{ background: 'hsl(130 40% 15%)', color: 'hsl(130 50% 60%)' }}>
                          ✦ {note}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>
                <button
                  onClick={() => clearSlot(slot.id)}
                  className="p-1 rounded-md transition-all hover:bg-red-900/20"
                  style={{ color: 'hsl(0 0% 35%)' }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSearchSlotId(searchSlotId === slot.id ? null : slot.id);
                  setSearchQuery('');
                }}
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                style={{
                  background: searchSlotId === slot.id ? `${zoneColor}10` : 'hsl(0 0% 8%)',
                  border: `1px dashed ${searchSlotId === slot.id ? zoneColor : 'hsl(0 0% 18%)'}`,
                  color: searchSlotId === slot.id ? zoneColor : 'hsl(0 0% 30%)',
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">
                  {searchSlotId === slot.id ? 'Searching...' : 'Add crop'}
                </span>
              </button>
            )}

            {/* Remove slot button */}
            {slots.length > 2 && (
              <button
                onClick={() => removeSlot(slot.id)}
                className="p-0.5 rounded transition-all hover:bg-red-900/20"
                style={{ color: 'hsl(0 0% 25%)' }}
                title="Remove slot"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Search dropdown */}
      <AnimatePresence>
        {searchSlotId && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-2"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search crops by name, category..."
              autoFocus
              className="w-full px-3 py-2 rounded-lg text-xs font-mono"
              style={{
                background: 'hsl(0 0% 8%)',
                border: `1px solid ${zoneColor}30`,
                color: 'hsl(0 0% 80%)',
                outline: 'none',
              }}
            />
            <div
              className="mt-1 max-h-40 overflow-y-auto rounded-lg"
              style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 15%)' }}
            >
              {filteredCrops.length === 0 ? (
                <div className="px-3 py-2 text-[10px] font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
                  No crops found
                </div>
              ) : (
                filteredCrops.map(crop => (
                  <button
                    key={crop.id}
                    onClick={() => assignCrop(searchSlotId, crop)}
                    className="w-full text-left px-3 py-1.5 flex items-center gap-2 transition-colors hover:bg-white/5"
                  >
                    <span className="text-xs truncate" style={{ color: 'hsl(0 0% 70%)' }}>
                      {crop.common_name || crop.name}
                    </span>
                    <span className="text-[8px] font-mono ml-auto flex-shrink-0" style={{ color: 'hsl(0 0% 40%)' }}>
                      {crop.category}
                    </span>
                    {crop.chord_interval && (
                      <span className="text-[8px] font-mono px-1 rounded flex-shrink-0" style={{ background: `${zoneColor}15`, color: `${zoneColor}90` }}>
                        {crop.chord_interval}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slot count controls */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 30%)' }}>
          Drag to reorder • {slots.length} slots (2–13)
        </span>
      </div>
    </div>
  );
};

export default CustomPairingPanel;
