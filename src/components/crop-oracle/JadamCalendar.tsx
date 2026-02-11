import { useMemo, useState } from 'react';
import BrewCard from './BrewCard';
import { motion } from 'framer-motion';
import { Calendar, Moon, Sun, Sprout, Leaf, AlertTriangle } from 'lucide-react';
import { getLunarPhase, type LunarPhaseData, type PlantingType } from '@/hooks/useLunarPhase';
import { JADAM_PROTOCOLS, type JadamProtocolId } from '@/data/jadamProtocols';

interface JadamCalendarProps {
  frequencyHz: number;
  zoneColor: string;
  zoneName: string;
}

interface JadamTiming {
  protocol: JadamProtocolId;
  priority: 'optimal' | 'good' | 'avoid';
  reason: string;
}

const LUNAR_JADAM_MAP: Record<PlantingType, JadamTiming[]> = {
  leaf: [
    { protocol: 'JMS', priority: 'optimal', reason: 'Microbial inoculant supports rapid leaf expansion — sap is rising' },
    { protocol: 'JLF', priority: 'good', reason: 'Foliar-applied JLF absorbed efficiently during upward sap flow' },
    { protocol: 'JNP', priority: 'good', reason: 'Preventive pest spray effective on young foliage' },
    { protocol: 'JWA', priority: 'good', reason: 'Carrier for foliar applications' },
    { protocol: 'JS', priority: 'avoid', reason: 'Sulfur can stress tender new growth — wait for root phase' },
  ],
  fruit: [
    { protocol: 'JLF', priority: 'optimal', reason: 'Peak nutrient demand — fruit set requires P, K, Ca delivery' },
    { protocol: 'JNP', priority: 'good', reason: 'Protect developing fruit from pest damage' },
    { protocol: 'JMS', priority: 'good', reason: 'Maintain rhizosphere during heavy fruiting' },
    { protocol: 'JWA', priority: 'good', reason: 'Carrier for pest sprays' },
    { protocol: 'JS', priority: 'avoid', reason: 'Sulfur can mark developing fruit — apply preventively during root phase' },
  ],
  root: [
    { protocol: 'JLF', priority: 'optimal', reason: 'Soil drench — downward sap pulls nutrients to root zone' },
    { protocol: 'JS', priority: 'optimal', reason: 'Best window for fungicide — soil is receptive, no fruit to mark' },
    { protocol: 'JMS', priority: 'optimal', reason: 'Inoculant colonizes rhizosphere fastest during root-dominant phase' },
    { protocol: 'JWA', priority: 'good', reason: 'Prepare wetting agent stock for upcoming sprays' },
    { protocol: 'JNP', priority: 'avoid', reason: 'Foliar sprays less effective — sap is descending' },
  ],
  harvest: [
    { protocol: 'JNP', priority: 'optimal', reason: 'Protect ripe crops — apply early AM before harvest' },
    { protocol: 'JWA', priority: 'good', reason: 'Carrier for protective sprays' },
    { protocol: 'JMS', priority: 'avoid', reason: 'Hold microbial inputs — focus on harvest, not growth' },
    { protocol: 'JLF', priority: 'avoid', reason: 'Fertilizer during harvest dilutes Brix — wait until root phase' },
    { protocol: 'JS', priority: 'avoid', reason: 'Sulfur residue on harvested crops — postpone' },
  ],
};

const CSA_JADAM_FOCUS: Record<number, { protocols: JadamProtocolId[]; note: string }> = {
  0: { protocols: ['JMS', 'JLF'], note: 'Off-season — prepare JMS & JLF stocks for spring' },
  1: { protocols: ['JMS', 'JLF'], note: 'Cool Octave — JMS soil inoculation + JLF root establishment' },
  2: { protocols: ['JLF', 'JNP'], note: 'Solar Peak — JLF nutrient loading + JNP pest defense' },
  3: { protocols: ['JNP', 'JS'], note: 'Harvest Signal — JNP crop protection + JS fungal prevention' },
};

const PRIORITY_META = {
  optimal: { emoji: '🟢', label: 'OPTIMAL', color: 'hsl(120 50% 45%)' },
  good:    { emoji: '🟡', label: 'GOOD',    color: 'hsl(45 80% 50%)'  },
  avoid:   { emoji: '🔴', label: 'AVOID',   color: 'hsl(0 55% 50%)'   },
};

const BREW_BUTTONS: { id: JadamProtocolId; gradient: [string, string]; borderColor: string; textColor: string }[] = [
  { id: 'JMS', gradient: ['hsl(120 45% 20%)', 'hsl(120 45% 30%)'], borderColor: 'hsl(120 45% 35%)', textColor: 'hsl(120 45% 70%)' },
  { id: 'JLF', gradient: ['hsl(35 50% 20%)', 'hsl(35 50% 30%)'], borderColor: 'hsl(35 50% 40%)', textColor: 'hsl(35 70% 65%)' },
  { id: 'JNP', gradient: ['hsl(0 40% 20%)', 'hsl(0 40% 28%)'], borderColor: 'hsl(0 40% 35%)', textColor: 'hsl(0 55% 65%)' },
];

const JadamCalendar = ({ frequencyHz, zoneColor, zoneName }: JadamCalendarProps) => {
  const [activeBrewId, setActiveBrewId] = useState<JadamProtocolId | null>(null);
  const lunar = useMemo(() => getLunarPhase(), []);
  const timings = LUNAR_JADAM_MAP[lunar.plantingType];
  const csaFocus = CSA_JADAM_FOCUS[lunar.seasonalMovement.phase];

  const activeProtocol = activeBrewId ? JADAM_PROTOCOLS.find(p => p.id === activeBrewId) : null;

  // Build a 7-day lookahead
  const lookahead = useMemo(() => {
    const days: { date: Date; lunar: LunarPhaseData; label: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const l = getLunarPhase(d);
      days.push({
        date: d,
        lunar: l,
        label: i === 0 ? 'TODAY' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      });
    }
    return days;
  }, []);

  return (
    <div className="space-y-3">
      {/* Current Status Banner */}
      <div
        className="rounded-lg p-3"
        style={{ background: `${zoneColor}08`, border: `1px solid ${zoneColor}20` }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{lunar.phaseEmoji}</span>
          <div className="flex-1">
            <span className="text-[10px] font-mono font-bold block" style={{ color: zoneColor }}>
              {lunar.phaseLabel.toUpperCase()} · {lunar.zodiacSymbol} {lunar.zodiacSign}
            </span>
            <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
              {lunar.plantingLabel}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-mono block" style={{ color: 'hsl(0 0% 40%)' }}>
              CSA PHASE {lunar.seasonalMovement.phase || '—'}
            </span>
            <span className="text-[9px] font-mono font-bold" style={{ color: zoneColor }}>
              {lunar.seasonalMovement.name}
            </span>
          </div>
        </div>

        {/* CSA Focus */}
        <div
          className="rounded px-2 py-1.5"
          style={{ background: 'hsl(0 0% 3%)', border: '1px solid hsl(0 0% 10%)' }}
        >
          <span className="text-[7px] font-mono tracking-wider block mb-0.5" style={{ color: zoneColor }}>
            SEASONAL FOCUS
          </span>
          <p className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 55%)' }}>
            {csaFocus.note}
          </p>
        </div>
      </div>

      {/* Today's Protocol Priorities */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Calendar className="w-3 h-3" style={{ color: zoneColor }} />
          <span className="text-[8px] font-mono tracking-wider" style={{ color: zoneColor }}>
            TODAY'S JADAM PRIORITIES
          </span>
        </div>
        <div className="space-y-1">
          {timings.map(timing => {
            const meta = PRIORITY_META[timing.priority];
            const protocol = JADAM_PROTOCOLS.find(p => p.id === timing.protocol);
            if (!protocol) return null;
            const isCsaPriority = csaFocus.protocols.includes(timing.protocol);
            return (
              <motion.div
                key={timing.protocol}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: timings.indexOf(timing) * 0.05 }}
                className="rounded-lg px-2.5 py-2 flex items-center gap-2"
                style={{
                  background: timing.priority === 'optimal' ? `${meta.color}08` : 'hsl(0 0% 4%)',
                  border: `1px solid ${timing.priority === 'optimal' ? `${meta.color}25` : 'hsl(0 0% 10%)'}`,
                }}
              >
                <span className="text-sm">{protocol.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold" style={{ color: protocol.color }}>
                      {protocol.id}
                    </span>
                    <span
                      className="text-[7px] font-mono px-1 py-0.5 rounded"
                      style={{ background: `${meta.color}18`, color: meta.color }}
                    >
                      {meta.emoji} {meta.label}
                    </span>
                    {isCsaPriority && (
                      <span
                        className="text-[7px] font-mono px-1 py-0.5 rounded"
                        style={{ background: `${zoneColor}15`, color: zoneColor }}
                      >
                        ★ CSA
                      </span>
                    )}
                  </div>
                  <p className="text-[8px] font-mono mt-0.5" style={{ color: 'hsl(0 0% 45%)' }}>
                    {timing.reason}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Lookahead */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Moon className="w-3 h-3" style={{ color: zoneColor }} />
          <span className="text-[8px] font-mono tracking-wider" style={{ color: zoneColor }}>
            7-DAY APPLICATION WINDOW
          </span>
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {lookahead.map((day, i) => {
            const bestProtocol = LUNAR_JADAM_MAP[day.lunar.plantingType]
              .find(t => t.priority === 'optimal');
            const prot = bestProtocol
              ? JADAM_PROTOCOLS.find(p => p.id === bestProtocol.protocol)
              : null;
            return (
              <div
                key={i}
                className="rounded-lg p-1.5 text-center"
                style={{
                  background: i === 0 ? `${zoneColor}10` : 'hsl(0 0% 4%)',
                  border: `1px solid ${i === 0 ? `${zoneColor}30` : 'hsl(0 0% 10%)'}`,
                }}
              >
                <span className="text-[7px] font-mono block" style={{ color: i === 0 ? zoneColor : 'hsl(0 0% 35%)' }}>
                  {day.label}
                </span>
                <span className="text-sm block my-0.5">{day.lunar.phaseEmoji}</span>
                <span className="text-[7px] font-mono block" style={{ color: 'hsl(0 0% 40%)' }}>
                  {day.lunar.plantingType.toUpperCase()}
                </span>
                {prot && (
                  <span
                    className="text-[7px] font-mono font-bold block mt-0.5"
                    style={{ color: prot.color }}
                  >
                    {prot.id}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lunar-JADAM Legend */}
      <div
        className="rounded-lg p-2.5"
        style={{ background: 'hsl(0 0% 3%)', border: '1px solid hsl(0 0% 10%)' }}
      >
        <span className="text-[7px] font-mono tracking-wider block mb-1.5" style={{ color: 'hsl(0 0% 35%)' }}>
          LUNAR PROTOCOL GUIDE
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {([
            { phase: '🌒 Leaf Phase', icon: <Leaf className="w-2.5 h-2.5" />, text: 'JMS inoculation + JLF foliar', key: 'leaf' },
            { phase: '🌔 Fruit Phase', icon: <Sun className="w-2.5 h-2.5" />, text: 'JLF nutrient loading + JNP defense', key: 'fruit' },
            { phase: '🌗 Root Phase', icon: <Sprout className="w-2.5 h-2.5" />, text: 'JLF drench + JS + JMS soil reset', key: 'root' },
            { phase: '🌕 Harvest', icon: <AlertTriangle className="w-2.5 h-2.5" />, text: 'JNP protection only — hold fertilizer', key: 'harvest' },
          ] as const).map(item => (
            <div
              key={item.key}
              className="rounded px-2 py-1.5"
              style={{ background: 'hsl(0 0% 5%)', border: '1px solid hsl(0 0% 8%)' }}
            >
              <span className="text-[8px] font-mono font-bold block" style={{ color: 'hsl(0 0% 55%)' }}>
                {item.phase}
              </span>
              <p className="text-[7px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Brew Now Buttons */}
      <div className="space-y-1.5">
        {BREW_BUTTONS.map(btn => {
          const protocol = JADAM_PROTOCOLS.find(p => p.id === btn.id)!;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveBrewId(btn.id)}
              className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-[10px] font-mono font-bold tracking-wider transition-all hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${btn.gradient[0]}, ${btn.gradient[1]})`,
                border: `1px solid ${btn.borderColor}`,
                color: btn.textColor,
              }}
            >
              {protocol.emoji} BREW {btn.id} NOW
              {protocol.variants.length > 1 && (
                <span className="text-[7px] font-normal opacity-70">
                  ({protocol.variants.length} variants)
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Brew Card Modal */}
      {activeProtocol && (
        <BrewCard
          protocol={activeProtocol}
          zoneColor={zoneColor}
          zoneName={zoneName}
          frequencyHz={frequencyHz}
          onClose={() => setActiveBrewId(null)}
        />
      )}
    </div>
  );
};

export default JadamCalendar;
