import { motion } from 'framer-motion';
import { Music, Leaf, TreePine, Flower2, Network, Cloud, Check } from 'lucide-react';
import {
  ChromaticTone,
  CHORD_VOICINGS,
  getIntervalTone,
  getToneMasterMix,
} from '@/data/chromaticToneMapping';

/**
 * HARMONIC CARD
 * Displays the chord-pair engine for a selected tone
 * Shows Root + 3rd, 5th, 7th, 11th, 13th as action list
 * Includes soil-to-note Master Mix instructions
 */

interface HarmonicCardProps {
  tone: ChromaticTone;
  onClose: () => void;
}

const INTERVAL_ICONS: Record<string, React.ReactNode> = {
  Root: <Music className="w-4 h-4" />,
  '3rd': <Leaf className="w-4 h-4" />,
  '5th': <TreePine className="w-4 h-4" />,
  '7th': <Flower2 className="w-4 h-4" />,
  '11th': <Network className="w-4 h-4" />,
  '13th': <Cloud className="w-4 h-4" />,
};

const HarmonicCard = ({ tone, onClose }: HarmonicCardProps) => {
  const masterMix = getToneMasterMix(tone);
  
  // Calculate chord tones
  const chordTones = CHORD_VOICINGS.map((voicing) => ({
    ...voicing,
    tone: getIntervalTone(tone, voicing.semitoneOffset),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(220 20% 14%), hsl(220 20% 10%))',
        border: `2px solid ${tone.color}40`,
        boxShadow: `0 10px 40px ${tone.color}20`,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${tone.color}30, transparent)`,
          borderBottom: `1px solid ${tone.color}30`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
            style={{
              background: tone.color,
              boxShadow: `0 0 20px ${tone.color}60`,
            }}
          >
            {tone.note}
          </div>
          <div>
            <h3 className="font-bold text-white">{tone.soilFocus}</h3>
            <p className="text-xs text-white/60">{tone.frequencyHz}Hz • {tone.elementalAffinity}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Chord Action List */}
      <div className="px-4 py-3">
        <h4 className="text-xs text-white/50 uppercase tracking-wider mb-3">Harmonic Chord Stack</h4>
        <div className="space-y-2">
          {chordTones.map((voicing, idx) => (
            <motion.div
              key={voicing.interval}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-2 rounded-lg"
              style={{
                background: `${voicing.tone.color}15`,
                border: `1px solid ${voicing.tone.color}30`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: `${voicing.tone.color}40` }}
              >
                {INTERVAL_ICONS[voicing.interval]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm" style={{ color: voicing.tone.color }}>
                    {voicing.interval}
                  </span>
                  <span className="text-xs text-white/50">•</span>
                  <span className="text-xs text-white/70">{voicing.tone.note}</span>
                  <span className="text-[10px] text-white/40">({voicing.tone.frequencyHz}Hz)</span>
                </div>
                <p className="text-xs text-white/50">{voicing.role} — {voicing.description}</p>
              </div>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: `${voicing.tone.color}30` }}
              >
                <Check className="w-3 h-3 text-white/60" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Soil-to-Note Master Mix */}
      <div className="px-4 py-3 border-t" style={{ borderColor: `${tone.color}20` }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs text-white/50 uppercase tracking-wider">
            5-Quart Master Mix
          </h4>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${tone.color}30`, color: tone.color }}
          >
            {tone.masterMixModifier}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {masterMix.map((ingredient) => {
            const isModified = ingredient.quantity !== 
              (ingredient.name === 'Pro-Mix BX' ? 5 : 
               ingredient.name === 'Kelp Meal' ? 0.5 :
               ingredient.name === 'Humates' ? 0.5 :
               ingredient.name === 'Alfalfa Meal' ? 0.5 :
               ingredient.name === 'Soybean Meal' ? 0.25 :
               ingredient.name === 'Gypsum' ? 0.5 :
               ingredient.name === 'Sea Minerals' ? 0.25 :
               0.5);
            
            return (
              <div
                key={ingredient.name}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{
                  background: isModified ? `${tone.color}20` : 'hsl(220 20% 16%)',
                  border: isModified ? `1px solid ${tone.color}40` : '1px solid hsl(220 20% 22%)',
                }}
              >
                <span className="text-xs text-white/70">{ingredient.name}</span>
                <span
                  className={`text-xs font-bold ${isModified ? '' : 'text-white/50'}`}
                  style={{ color: isModified ? tone.color : undefined }}
                >
                  {ingredient.quantity < 1 
                    ? `${Math.round(ingredient.quantity * 4)} cups` 
                    : `${ingredient.quantity} qt`}
                  {isModified && ' ↑'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mineral Focus */}
      <div
        className="px-4 py-3"
        style={{ background: `${tone.color}10` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Mineral Focus</span>
            <p className="text-sm font-bold" style={{ color: tone.color }}>
              {tone.mineralBoost}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Element</span>
            <p className="text-sm font-bold text-white/70">
              {tone.elementalAffinity}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HarmonicCard;
