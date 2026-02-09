import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  Music, Leaf, TreePine, Flower2, Network, Cloud, 
  ChevronLeft, ChevronRight, Radio, Beaker, X
} from 'lucide-react';
import {
  ChromaticTone,
  getToneMasterMix,
  getBedsForTone,
  getHarmonicCompletion,
} from '@/data/chromaticToneMapping';
import { GardenBed } from '@/hooks/useGardenBeds';
import { Slider } from '@/components/ui/slider';

/**
 * UNIFIED ALMANAC CARD
 * Single-action UI showing Soil Recipe, Paired Plants, and Frequency Signal
 * With nested bed swiper and Brix glow validation
 */

interface UnifiedAlmanacCardProps {
  tone: ChromaticTone;
  beds: GardenBed[];
  brixValue: number;
  onBrixChange: (value: number) => void;
  onClose: () => void;
}

const PAIRED_PLANT_ICONS: Record<string, React.ReactNode> = {
  root: <Music className="w-4 h-4" />,
  third: <Leaf className="w-4 h-4" />,
  fifth: <TreePine className="w-4 h-4" />,
  seventh: <Flower2 className="w-4 h-4" />,
  eleventh: <Network className="w-4 h-4" />,
  thirteenth: <Cloud className="w-4 h-4" />,
};

const PAIRED_PLANT_LABELS: Record<string, string> = {
  root: 'Root (Lead)',
  third: '3rd (Color)',
  fifth: '5th (Stabilizer)',
  seventh: '7th (Signal)',
  eleventh: '11th (Network)',
  thirteenth: '13th (Aerial)',
};

const UnifiedAlmanacCard = ({ 
  tone, 
  beds, 
  brixValue, 
  onBrixChange, 
  onClose 
}: UnifiedAlmanacCardProps) => {
  const [activeBedIndex, setActiveBedIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<'plants' | 'soil' | 'signal'>('plants');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const toneBeds = getBedsForTone(beds, tone);
  const masterMix = getToneMasterMix(tone);
  const harmonicCompletion = getHarmonicCompletion(brixValue);
  
  // Swipe handlers for bed navigation
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && activeBedIndex > 0) {
      setActiveBedIndex(activeBedIndex - 1);
    } else if (info.offset.x < -threshold && activeBedIndex < toneBeds.length - 1) {
      setActiveBedIndex(activeBedIndex + 1);
    }
  };

  const currentBed = toneBeds[activeBedIndex];

  // Glow intensity based on Brix
  const glowIntensity = harmonicCompletion / 100;
  const glowColor = tone.color.replace('50%)', `${50 + glowIntensity * 30}%)`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="rounded-3xl overflow-hidden relative"
      style={{
        background: `linear-gradient(180deg, hsl(220 25% 12%), hsl(220 25% 8%))`,
        border: `2px solid ${tone.color}`,
        boxShadow: `
          0 0 ${20 + glowIntensity * 40}px ${tone.color}${Math.round(glowIntensity * 60).toString(16).padStart(2, '0')},
          0 20px 60px hsl(220 50% 5% / 0.8)
        `,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Harmonic Completion Glow Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center top, ${tone.color}${Math.round(glowIntensity * 25).toString(16).padStart(2, '0')}, transparent 70%)`,
        }}
        animate={{ opacity: glowIntensity }}
      />

      {/* Header with Tone Info */}
      <div
        className="relative px-4 py-3 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${tone.color}40, ${tone.color}10)`,
          borderBottom: `1px solid ${tone.color}40`,
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
            style={{
              background: `linear-gradient(135deg, ${tone.color}, ${glowColor})`,
              boxShadow: `0 0 ${15 + glowIntensity * 25}px ${tone.color}80`,
            }}
            animate={{ scale: [1, 1 + glowIntensity * 0.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {tone.note}
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">{tone.instrumentGroup.name}</h3>
            <p className="text-xs text-white/60">
              {tone.frequencyHz}Hz • {tone.soilFocus}
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b" style={{ borderColor: `${tone.color}30` }}>
        {[
          { id: 'plants', label: 'Paired Plants', icon: <Leaf className="w-4 h-4" /> },
          { id: 'soil', label: 'Soil Recipe', icon: <Beaker className="w-4 h-4" /> },
          { id: 'signal', label: 'Frequency', icon: <Radio className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
            style={{
              background: activeSection === tab.id ? `${tone.color}20` : 'transparent',
              color: activeSection === tab.id ? tone.color : 'rgba(255,255,255,0.5)',
              borderBottom: activeSection === tab.id ? `2px solid ${tone.color}` : '2px solid transparent',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeSection === 'plants' && (
            <motion.div
              key="plants"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-2"
            >
              {Object.entries(tone.pairedPlants).map(([key, plant], idx) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{
                    background: `linear-gradient(90deg, ${tone.color}15, transparent)`,
                    border: `1px solid ${tone.color}25`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${tone.color}30` }}
                  >
                    {PAIRED_PLANT_ICONS[key]}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-white/50">{PAIRED_PLANT_LABELS[key]}</span>
                    <p className="text-sm font-bold text-white">{plant}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeSection === 'soil' && (
            <motion.div
              key="soil"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {/* Master Mix Modifier */}
              <div
                className="p-3 rounded-xl text-center"
                style={{
                  background: `${tone.color}20`,
                  border: `1px solid ${tone.color}40`,
                }}
              >
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Protocol</span>
                <p className="text-sm font-bold" style={{ color: tone.color }}>
                  {tone.masterMixModifier}
                </p>
                <p className="text-[10px] text-white/40 mt-1">
                  {tone.instrumentGroup.nutrientFocus}
                </p>
              </div>

              {/* Ingredients Grid */}
              <div className="grid grid-cols-2 gap-2">
                {masterMix.map((ingredient) => (
                  <div
                    key={ingredient.name}
                    className="flex items-center justify-between p-2 rounded-lg"
                    style={{
                      background: ingredient.boosted ? `${tone.color}20` : 'hsl(220 25% 15%)',
                      border: ingredient.boosted ? `1px solid ${tone.color}40` : '1px solid hsl(220 25% 22%)',
                    }}
                  >
                    <span className="text-xs text-white/70 truncate">{ingredient.name}</span>
                    <span
                      className="text-xs font-bold ml-1"
                      style={{ color: ingredient.boosted ? tone.color : 'rgba(255,255,255,0.5)' }}
                    >
                      {ingredient.quantity < 1 
                        ? `${Math.round(ingredient.quantity * 4)}c` 
                        : `${ingredient.quantity}qt`}
                      {ingredient.boosted && ' ↑'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'signal' && (
            <motion.div
              key="signal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Frequency Visualization */}
              <div
                className="p-4 rounded-xl text-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${tone.color}20, ${tone.color}05)`,
                  border: `1px solid ${tone.color}30`,
                }}
              >
                {/* Animated waveform background */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `repeating-linear-gradient(
                      90deg,
                      ${tone.color}20 0px,
                      ${tone.color}40 2px,
                      transparent 2px,
                      transparent 10px
                    )`,
                  }}
                  animate={{ x: [-10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />

                <div className="relative">
                  <span className="text-4xl font-bold" style={{ color: tone.color }}>
                    {tone.frequencyHz}
                  </span>
                  <span className="text-lg text-white/50 ml-1">Hz</span>
                </div>
                
                <div className="mt-2 flex justify-center gap-4">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase">Waveform</span>
                    <p className="text-xs font-bold text-white/70 capitalize">
                      {tone.frequencySignal.waveform}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase">Resonance</span>
                    <p className="text-xs font-bold text-white/70">
                      {tone.frequencySignal.resonance}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase">Chakra</span>
                    <p className="text-xs font-bold text-white/70">
                      {tone.frequencySignal.chakra}
                    </p>
                  </div>
                </div>
              </div>

              {/* Element Affinity */}
              <div className="flex justify-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: `${tone.color}25`,
                    color: tone.color,
                    border: `1px solid ${tone.color}40`,
                  }}
                >
                  {tone.elementalAffinity} Element
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: 'hsl(220 25% 18%)',
                    color: 'rgba(255,255,255,0.6)',
                    border: '1px solid hsl(220 25% 25%)',
                  }}
                >
                  {tone.mineralBoost}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bed Swiper */}
      {toneBeds.length > 0 && (
        <div
          className="px-4 py-3 border-t"
          style={{ borderColor: `${tone.color}20` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">
              Beds Playing {tone.note}
            </span>
            <span className="text-xs text-white/50">
              {activeBedIndex + 1} / {toneBeds.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveBedIndex(Math.max(0, activeBedIndex - 1))}
              disabled={activeBedIndex === 0}
              className="p-1.5 rounded-full disabled:opacity-30"
              style={{ background: `${tone.color}20` }}
            >
              <ChevronLeft className="w-4 h-4 text-white/70" />
            </button>

            <motion.div
              ref={containerRef}
              className="flex-1 overflow-hidden"
              drag="x"
              dragConstraints={containerRef}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-2">
                {toneBeds.map((bed, idx) => (
                  <motion.button
                    key={bed.id}
                    onClick={() => setActiveBedIndex(idx)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={{
                      background: idx === activeBedIndex ? tone.color : `${tone.color}20`,
                      color: idx === activeBedIndex ? 'white' : tone.color,
                      border: `1px solid ${tone.color}50`,
                      boxShadow: idx === activeBedIndex 
                        ? `0 0 15px ${tone.color}60` 
                        : 'none',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    #{bed.bed_number}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <button
              onClick={() => setActiveBedIndex(Math.min(toneBeds.length - 1, activeBedIndex + 1))}
              disabled={activeBedIndex === toneBeds.length - 1}
              className="p-1.5 rounded-full disabled:opacity-30"
              style={{ background: `${tone.color}20` }}
            >
              <ChevronRight className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>
      )}

      {/* Brix Volume Slider with Glow */}
      <div
        className="px-4 py-4 relative"
        style={{
          background: `linear-gradient(180deg, ${tone.color}${Math.round(glowIntensity * 15).toString(16).padStart(2, '0')}, transparent)`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-white/50 uppercase tracking-wider">
            Brix Volume
          </span>
          <motion.span
            className="text-lg font-bold"
            style={{ color: tone.color }}
            animate={{ 
              textShadow: brixValue >= 18 
                ? [`0 0 10px ${tone.color}`, `0 0 20px ${tone.color}`, `0 0 10px ${tone.color}`]
                : 'none'
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {brixValue}°
          </motion.span>
        </div>

        {/* Custom styled slider */}
        <div className="relative">
          <Slider
            value={[brixValue]}
            onValueChange={([value]) => onBrixChange(value)}
            min={12}
            max={24}
            step={1}
            className="w-full"
          />
          
          {/* Glow track overlay */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full pointer-events-none"
            style={{
              width: `${harmonicCompletion}%`,
              background: `linear-gradient(90deg, ${tone.color}60, ${tone.color})`,
              boxShadow: `0 0 ${10 + glowIntensity * 15}px ${tone.color}80`,
            }}
          />
        </div>

        {/* Completion indicator */}
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-white/30">12</span>
          <motion.span
            className="text-[10px] font-bold"
            style={{ color: harmonicCompletion >= 50 ? tone.color : 'rgba(255,255,255,0.3)' }}
            animate={harmonicCompletion >= 100 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {harmonicCompletion >= 100 ? '✨ HARMONIC COMPLETION ✨' : `${Math.round(harmonicCompletion)}% Complete`}
          </motion.span>
          <span className="text-[10px] text-white/30">24</span>
        </div>
      </div>
    </motion.div>
  );
};

export default UnifiedAlmanacCard;
