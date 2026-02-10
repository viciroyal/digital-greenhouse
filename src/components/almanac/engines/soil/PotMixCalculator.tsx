import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  CONTAINER_SIZES,
  POT_MIX_RECIPE,
  formatVolume,
  type ContainerSize,
} from './soilConstants';

const PotMixCalculator = () => {
  const [selectedSize, setSelectedSize] = useState<string>('5gal');
  const [customGallons, setCustomGallons] = useState(5);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const activeContainer = useMemo(() => {
    const found = CONTAINER_SIZES.find((c) => c.id === selectedSize);
    if (!found) return CONTAINER_SIZES[2]; // 5gal default
    if (found.id === 'custom') {
      return { ...found, gallons: customGallons, cubicFeet: customGallons * 0.1337 };
    }
    return found;
  }, [selectedSize, customGallons]);

  const toggleCheck = (id: string) =>
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const isComplete = checkedCount === POT_MIX_RECIPE.length;

  return (
    <div className="space-y-4">
      {/* Container Size Selector */}
      <div
        className="p-3 rounded-lg"
        style={{ background: 'hsl(35 30% 12%)', border: '1px solid hsl(35 40% 25%)' }}
      >
        <span className="text-[10px] font-mono tracking-widest block mb-2" style={{ color: 'hsl(35 50% 60%)' }}>
          CONTAINER SIZE
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CONTAINER_SIZES.map((size) => {
            const isSelected = selectedSize === size.id;
            return (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className="px-2.5 py-1.5 rounded text-[10px] font-mono"
                style={{
                  background: isSelected ? 'hsl(35 40% 22%)' : 'hsl(0 0% 12%)',
                  border: `1px solid ${isSelected ? 'hsl(35 60% 50%)' : 'hsl(0 0% 22%)'}`,
                  color: isSelected ? 'hsl(35 70% 65%)' : 'hsl(0 0% 50%)',
                }}
              >
                {size.label}
              </button>
            );
          })}
        </div>

        {selectedSize === 'custom' && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono" style={{ color: 'hsl(0 0% 55%)' }}>Gallons</span>
              <span className="text-lg font-mono font-bold px-2 py-0.5 rounded"
                style={{ background: 'hsl(51 50% 15%)', color: 'hsl(51 80% 60%)' }}>
                {customGallons} gal
              </span>
            </div>
            <Slider value={[customGallons]} onValueChange={([v]) => setCustomGallons(v)} min={1} max={50} step={1} />
          </div>
        )}

        {/* Best For hint */}
        <div className="mt-2 p-2 rounded" style={{ background: 'hsl(120 15% 12%)', border: '1px solid hsl(120 20% 25%)' }}>
          <span className="text-[9px] font-mono" style={{ color: 'hsl(120 40% 55%)' }}>
            BEST FOR: {activeContainer.bestFor}
          </span>
        </div>
      </div>

      {/* Volume Info */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center py-2 rounded" style={{ background: 'hsl(35 20% 12%)' }}>
          <span className="text-[10px] font-mono block" style={{ color: 'hsl(0 0% 50%)' }}>VOLUME</span>
          <span className="text-lg font-mono font-bold" style={{ color: 'hsl(35 60% 60%)' }}>
            {activeContainer.gallons} gal
          </span>
        </div>
        <div className="text-center py-2 rounded" style={{ background: 'hsl(35 20% 12%)' }}>
          <span className="text-[10px] font-mono block" style={{ color: 'hsl(0 0% 50%)' }}>SOIL NEEDED</span>
          <span className="text-lg font-mono font-bold" style={{ color: 'hsl(35 60% 60%)' }}>
            {Math.round(activeContainer.cubicFeet * 100) / 100} cu ft
          </span>
        </div>
      </div>

      {/* Recipe Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono tracking-widest" style={{ color: 'hsl(35 60% 60%)' }}>
          OMRI ORGANIC POT MIX
        </span>
        <button
          onClick={() => setCheckedItems({})}
          className="text-[9px] font-mono px-2 py-0.5 rounded flex items-center gap-1"
          style={{ background: 'transparent', border: '1px solid hsl(0 0% 30%)', color: 'hsl(0 0% 60%)' }}
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Pot Mix Ingredients */}
      <div className="space-y-1.5">
        {POT_MIX_RECIPE.map((item) => {
          const isChecked = checkedItems[item.id];
          const volume = formatVolume(activeContainer.cubicFeet, item.percentage);
          return (
            <motion.button
              key={item.id}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left"
              style={{
                background: isChecked ? 'hsl(120 30% 15%)' : 'hsl(0 0% 10%)',
                border: `1px solid ${isChecked ? 'hsl(120 50% 40%)' : 'hsl(0 0% 18%)'}`,
              }}
              onClick={() => toggleCheck(item.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: isChecked ? 'hsl(120 50% 40%)' : 'hsl(0 0% 18%)',
                  border: `2px solid ${isChecked ? 'hsl(120 60% 50%)' : 'hsl(0 0% 28%)'}`,
                }}
              >
                {isChecked && <CheckCircle className="w-3 h-3 text-white" />}
              </div>

              <span
                className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
                style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}
              >
                {item.role}
              </span>

              <div className="flex-1 min-w-0">
                <span
                  className="text-sm font-mono truncate block"
                  style={{
                    color: isChecked ? 'hsl(120 50% 65%)' : 'hsl(35 50% 70%)',
                    textDecoration: isChecked ? 'line-through' : 'none',
                  }}
                >
                  {item.name}
                </span>
                <span className="text-[9px] font-mono block" style={{ color: 'hsl(0 0% 45%)' }}>
                  {item.note}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span
                  className="text-sm font-mono font-bold px-2 py-0.5 rounded block"
                  style={{ background: 'hsl(51 50% 15%)', color: 'hsl(51 80% 60%)', border: '1px solid hsl(51 50% 30%)' }}
                >
                  {item.percentage}%
                </span>
                <span className="text-[9px] font-mono block mt-0.5" style={{ color: 'hsl(51 60% 50%)' }}>
                  {volume}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Progress */}
      <div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'hsl(0 0% 15%)' }}>
          <motion.div
            className="h-full"
            style={{ background: isComplete ? 'hsl(120 50% 45%)' : 'linear-gradient(90deg, hsl(35 70% 50%), hsl(120 50% 45%))' }}
            animate={{ width: `${(checkedCount / POT_MIX_RECIPE.length) * 100}%` }}
          />
        </div>
        <p className="text-[10px] font-mono text-center mt-1.5" style={{ color: isComplete ? 'hsl(120 50% 60%)' : 'hsl(0 0% 50%)' }}>
          {isComplete ? '✓ POT MIX READY' : `${checkedCount}/${POT_MIX_RECIPE.length}`}
        </p>
      </div>

      {/* Pot-Specific Soil Recommendation */}
      <div className="p-3 rounded-lg" style={{ background: 'hsl(120 15% 10%)', border: '1px solid hsl(120 25% 25%)' }}>
        <span className="text-[10px] font-mono tracking-widest block mb-1" style={{ color: 'hsl(120 50% 55%)' }}>
          💡 POT SOIL ADVISORY
        </span>
        <p className="text-[10px] font-mono leading-relaxed" style={{ color: 'hsl(120 30% 65%)' }}>
          Use <strong>OMRI-listed organic potting soil</strong> as your base — never garden soil in containers.
          Garden soil compacts, blocks drainage, and introduces pathogens. Add perlite for aeration.
          Top-dress with worm castings monthly. For containers over 7 gallons, add ½ cup kelp meal
          and ¼ cup rock dust at planting.
        </p>
      </div>
    </div>
  );
};

export default PotMixCalculator;
