import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Zap, Compass, Sun } from 'lucide-react';
import {
  FiveQuartReset,
  BrixValidator,
  AgroChordFilter,
} from '@/components/almanac';

/**
 * FIELD ALMANAC EMBED
 * 
 * Embedded version of the Field Almanac for the unified view.
 * High-utility, mobile-responsive dashboard for in-bed operations.
 */

type AlmanacSection = 'reset' | 'brix' | 'chord';

const FieldAlmanacEmbed = () => {
  const [activeSection, setActiveSection] = useState<AlmanacSection>('reset');

  const sections = [
    { id: 'reset' as const, label: 'BED RESET', icon: Leaf, color: 'hsl(35 80% 55%)' },
    { id: 'brix' as const, label: 'BRIX CHECK', icon: Zap, color: 'hsl(195 70% 55%)' },
    { id: 'chord' as const, label: 'CROP FILTER', icon: Compass, color: 'hsl(270 60% 55%)' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Field Mode Indicator */}
      <motion.div
        className="flex justify-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'hsl(45 80% 50% / 0.15)',
            border: '2px solid hsl(45 80% 55%)',
          }}
        >
          <Sun className="w-5 h-5" style={{ color: 'hsl(45 90% 60%)' }} />
          <span
            className="text-sm font-mono tracking-wider"
            style={{ color: 'hsl(45 80% 65%)' }}
          >
            FIELD MODE — ACTION OVER INFO
          </span>
        </div>
      </motion.div>

      {/* Section Navigation */}
      <div className="mb-6">
        <div
          className="max-w-lg mx-auto flex rounded-xl overflow-hidden"
          style={{
            background: 'hsl(0 0% 8%)',
            border: '2px solid hsl(0 0% 20%)',
          }}
        >
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <motion.button
                key={section.id}
                className="flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-all"
                style={{
                  background: isActive
                    ? `linear-gradient(180deg, ${section.color}25, ${section.color}10)`
                    : 'transparent',
                  borderBottom: isActive ? `3px solid ${section.color}` : '3px solid transparent',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon
                  className="w-5 h-5"
                  style={{
                    color: isActive ? section.color : 'hsl(0 0% 45%)',
                    filter: isActive ? `drop-shadow(0 0 5px ${section.color})` : 'none',
                  }}
                />
                <span
                  className="text-[10px] font-mono tracking-wider"
                  style={{
                    color: isActive ? section.color : 'hsl(0 0% 45%)',
                  }}
                >
                  {section.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'reset' && <FiveQuartReset />}
          {activeSection === 'brix' && <BrixValidator />}
          {activeSection === 'chord' && <AgroChordFilter />}
        </motion.div>
      </AnimatePresence>

      {/* Quick Actions */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p
          className="text-center text-[10px] font-mono tracking-wider mb-4"
          style={{ color: 'hsl(0 0% 40%)' }}
        >
          QUICK ACTIONS
        </p>
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {[
            { label: 'Water Schedule', emoji: '💧', color: 'hsl(195 70% 50%)' },
            { label: 'Moon Phase', emoji: '🌙', color: 'hsl(45 70% 55%)' },
            { label: 'Pest Alert', emoji: '🐛', color: 'hsl(0 60% 50%)' },
          ].map((action) => (
            <motion.button
              key={action.label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl"
              style={{
                background: 'hsl(0 0% 10%)',
                border: `1px solid ${action.color}40`,
              }}
              whileHover={{
                scale: 1.03,
                borderColor: action.color,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-2xl">{action.emoji}</span>
              <span
                className="text-[9px] font-mono tracking-wider text-center"
                style={{ color: 'hsl(0 0% 55%)' }}
              >
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FieldAlmanacEmbed;
