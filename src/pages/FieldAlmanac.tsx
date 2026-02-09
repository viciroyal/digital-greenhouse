import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Leaf, Compass, Zap } from 'lucide-react';
import {
  FiveQuartReset,
  BrixValidator,
  AgroChordFilter,
  SovereigntyFooter,
} from '@/components/almanac';

/**
 * THE FIELD ALMANAC
 * High-utility, mobile-responsive dashboard for in-bed operations
 * Layer Two: The Field Guide
 */

const FieldAlmanac = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'reset' | 'brix' | 'chord'>('reset');

  const sections = [
    { id: 'reset', label: 'BED RESET', icon: Leaf, color: 'hsl(35 80% 55%)' },
    { id: 'brix', label: 'BRIX CHECK', icon: Zap, color: 'hsl(195 70% 55%)' },
    { id: 'chord', label: 'CROP FILTER', icon: Compass, color: 'hsl(270 60% 55%)' },
  ] as const;

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* High-contrast background for outdoor visibility */}
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(20 30% 6%) 0%, hsl(25 35% 4%) 100%)',
        }}
      />

      {/* Subtle texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-4 flex items-center justify-between">
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'hsl(20 30% 12%)',
            border: '2px solid hsl(40 50% 40%)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/ancestral-path')}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(40 60% 65%)' }} />
          <span
            className="font-mono text-sm hidden sm:inline"
            style={{ color: 'hsl(40 60% 65%)' }}
          >
            RETURN
          </span>
        </motion.button>

        {/* Sun indicator for outdoor mode */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-full"
          style={{
            background: 'hsl(45 80% 50% / 0.15)',
            border: '2px solid hsl(45 80% 55%)',
          }}
        >
          <Sun className="w-5 h-5" style={{ color: 'hsl(45 90% 60%)' }} />
          <span
            className="text-xs font-mono tracking-wider"
            style={{ color: 'hsl(45 80% 65%)' }}
          >
            FIELD MODE
          </span>
        </div>
      </header>

      {/* Title */}
      <div className="relative z-10 text-center px-4 mb-6">
        <motion.h1
          className="text-3xl md:text-5xl tracking-[0.15em] mb-2"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            color: 'hsl(45 100% 60%)',
            textShadow: '0 0 30px hsl(45 80% 40% / 0.5), 2px 2px 0 hsl(20 40% 15%)',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          THE FIELD ALMANAC
        </motion.h1>
        <motion.p
          className="text-sm font-mono"
          style={{ color: 'hsl(40 50% 55%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Action Over Info • Utility Dashboard
        </motion.p>
      </div>

      {/* Section Navigation */}
      <div className="relative z-10 px-4 mb-6">
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
      <div className="relative z-10 px-4 pb-8">
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
      </div>

      {/* Quick Actions Footer */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-lg mx-auto">
          <p
            className="text-center text-[10px] font-mono tracking-wider mb-4"
            style={{ color: 'hsl(0 0% 40%)' }}
          >
            QUICK ACTIONS
          </p>
          <div className="grid grid-cols-3 gap-3">
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
        </div>
      </div>

      {/* Sovereignty Footer */}
      <SovereigntyFooter />
    </main>
  );
};

export default FieldAlmanac;
