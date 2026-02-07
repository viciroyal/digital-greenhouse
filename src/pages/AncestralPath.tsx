import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import {
  ModuleNode,
  SapRiseProgress,
  MycelialCord,
  LessonDrawer,
  SpiralMoundIcon,
  KanagaMaskIcon,
  DreamtimeCircleIcon,
  DjedPillarIcon,
} from '@/components/ancestral';
import { useAncestralProgress, Module } from '@/hooks/useAncestralProgress';
import { Button } from '@/components/ui/button';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ color: string }>> = {
  'spiral-mound': SpiralMoundIcon,
  'kanaga-mask': KanagaMaskIcon,
  'dot-circle': DreamtimeCircleIcon,
  'sun-disc': DjedPillarIcon,
};

// Fallback modules for display when loading
const fallbackModules = [
  { level: 1, title: "LEVEL 1: SOIL & SURVIVAL", mission: "Heal the Clay. Save the Seed.", lineage: "Muscogee & Maroons — The Foundation", color: "hsl(0 100% 50%)", iconName: 'spiral-mound' },
  { level: 2, title: "LEVEL 2: COSMIC ALIGNMENT", mission: "Map the Garden to the Sky.", lineage: "Dogon — The Architecture", color: "hsl(195 100% 50%)", iconName: 'kanaga-mask' },
  { level: 3, title: "LEVEL 3: SONGLINES & FREQUENCY", mission: "Sing the Plant into Being.", lineage: "Aboriginal — The Song", color: "hsl(275 100% 25%)", iconName: 'dot-circle' },
  { level: 4, title: "LEVEL 4: HIGH BRIX ALCHEMY", mission: "Transmute Sunlight into Nutrient Density.", lineage: "Ancient Kemit — The Mastery", color: "hsl(51 100% 50%)", iconName: 'sun-disc' },
];

/**
 * THE ANCESTRAL PATH - The Learning Hub
 * 
 * A vertical skill tree mimicking plant growth.
 * User starts at the bottom (roots) and ascends to mastery.
 */
const AncestralPath = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<{
    id: string;
    level: number;
    title: string;
    mission: string;
    lineage: string;
    color: string;
  } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    modules,
    isLoading,
    user,
    isModuleUnlocked,
    isModuleCompleted,
    getModuleCompletionPercent,
    getOverallProgress,
  } = useAncestralProgress();

  // Scroll to bottom on mount (start at roots)
  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  // Transform database modules to display format
  const displayModules = modules.length > 0
    ? [...modules].reverse().map((m: Module) => ({
        id: m.id,
        level: m.order_index,
        title: `LEVEL ${m.order_index}: ${m.display_name}`,
        mission: m.description || '',
        lineage: m.lineage,
        color: m.chakra_color,
        iconName: m.icon_name || 'spiral-mound',
        isUnlocked: isModuleUnlocked(m.id),
        isCompleted: isModuleCompleted(m.id),
        completionPercent: getModuleCompletionPercent(m.id),
      }))
    : fallbackModules.map((m, i) => ({
        id: `fallback-${i}`,
        ...m,
        isUnlocked: i === 0,
        isCompleted: false,
        completionPercent: 0,
      }));

  const handleModuleSelect = (module: typeof displayModules[0]) => {
    setSelectedModule({
      id: module.id,
      level: module.level,
      title: module.title,
      mission: module.mission,
      lineage: module.lineage,
      color: module.color,
    });
    setIsDrawerOpen(true);
  };

  return (
    <main 
      ref={containerRef}
      className="min-h-[300vh] relative overflow-x-hidden"
    >
      {/* Background: Starry Sky (top) to Soil (bottom) */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg,
            hsl(250 50% 5%) 0%,
            hsl(240 40% 8%) 20%,
            hsl(220 35% 8%) 40%,
            hsl(30 30% 8%) 60%,
            hsl(20 40% 6%) 80%,
            hsl(15 45% 5%) 100%
          )`,
        }}
      />

      {/* Stars at top */}
      <div className="fixed top-0 left-0 right-0 h-1/3 pointer-events-none overflow-hidden">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: 'hsl(0 0% 90%)',
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Soil texture at bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-1/4 pointer-events-none"
        style={{
          background: `linear-gradient(0deg,
            hsl(20 50% 8%) 0%,
            transparent 100%
          )`,
        }}
      />
      <div 
        className="fixed bottom-0 left-0 right-0 h-40 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Darkroom overlay */}
      <div className="fixed inset-0 bg-black/30 pointer-events-none" />

      {/* Back button */}
      <motion.button
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: 'hsl(20 30% 12% / 0.9)',
          border: '1px solid hsl(40 40% 30%)',
          backdropFilter: 'blur(10px)',
        }}
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ArrowLeft className="w-4 h-4" style={{ color: 'hsl(40 50% 70%)' }} />
        <span 
          className="text-sm font-mono"
          style={{ color: 'hsl(40 50% 70%)' }}
        >
          Return to Garden
        </span>
      </motion.button>

      {/* Auth Status Indicator */}
      {!user && !isLoading && (
        <motion.div
          className="fixed top-6 right-20 z-50"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 font-mono text-xs"
            style={{
              background: 'hsl(20 30% 12% / 0.9)',
              border: '1px solid hsl(40 40% 30%)',
              color: 'hsl(40 50% 70%)',
            }}
            onClick={() => navigate('/auth')}
          >
            <LogIn className="w-3 h-3" />
            Sign In to Track Progress
          </Button>
        </motion.div>
      )}

      {/* Sap Rise Progress Bar */}
      <SapRiseProgress overallProgress={getOverallProgress()} />

      {/* Main Content - The Totem */}
      <div className="relative z-10 pt-24 pb-32">
        
        {/* Header */}
        <motion.div
          className="text-center mb-16 px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 
            className="text-3xl md:text-5xl lg:text-6xl mb-4 tracking-[0.1em]"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(51 100% 50%)',
              textShadow: `
                2px 2px 0 hsl(20 50% 10%),
                0 0 40px hsl(51 80% 40% / 0.4)
              `,
            }}
          >
            THE ANCESTRAL PATH
          </h1>
          <p 
            className="text-lg md:text-xl font-mono"
            style={{ color: 'hsl(40 50% 65%)' }}
          >
            Ascend from Root to Crown
          </p>
          {user && (
            <motion.p
              className="mt-2 text-sm font-mono"
              style={{ color: 'hsl(140 50% 50%)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Overall Progress: {getOverallProgress()}%
            </motion.p>
          )}
        </motion.div>

        {/* Skill Tree Container */}
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          
          {/* Module Nodes with Mycelial Cords */}
          {displayModules.map((module, index) => {
            const IconComponent = iconMap[module.iconName] || SpiralMoundIcon;
            
            return (
              <div key={module.id} className="relative">
                {/* Mycelial Cord connector (except for last/top node) */}
                {index < displayModules.length - 1 && (
                  <div className="absolute left-10 md:left-14 top-full z-0">
                    <MycelialCord 
                      height="120px" 
                      isActive={module.isUnlocked || displayModules[index + 1]?.isUnlocked}
                    />
                  </div>
                )}

                {/* Module Node */}
                <div className="relative z-10 py-8">
                  <ModuleNode
                    level={module.level}
                    title={module.title}
                    mission={module.mission}
                    lineage={module.lineage}
                    color={module.color}
                    icon={<IconComponent color={module.color} />}
                    isUnlocked={module.isUnlocked}
                    isCompleted={module.isCompleted}
                    completionPercent={module.completionPercent}
                    onSelect={() => handleModuleSelect(module)}
                  />
                </div>
              </div>
            );
          })}

          {/* Root symbol at the very bottom */}
          <motion.div
            className="flex flex-col items-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 30% 30%, hsl(20 50% 25%), hsl(20 40% 10%))',
                border: '2px solid hsl(20 40% 30%)',
                boxShadow: '0 0 30px hsl(20 50% 20% / 0.5)',
              }}
            >
              <svg viewBox="0 0 32 32" className="w-10 h-10">
                <motion.path
                  d="M16 4 L16 28 M16 12 L8 20 M16 12 L24 20 M16 18 L10 26 M16 18 L22 26"
                  stroke="hsl(20 50% 50%)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </svg>
            </div>
            <p 
              className="mt-4 text-sm font-mono tracking-wider"
              style={{ color: 'hsl(20 40% 50%)' }}
            >
              BEGIN HERE — SCROLL UP TO ASCEND
            </p>
          </motion.div>
        </div>
      </div>

      {/* Lesson Drawer */}
      <LessonDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        module={selectedModule}
      />
    </main>
  );
};

export default AncestralPath;
