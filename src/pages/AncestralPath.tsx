import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, LogOut, User, Shield, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  ModuleNode,
  SapRiseProgress,
  MycelialCord,
  LessonDrawer,
  ChainBreakingCelebration,
  BlessingCeremony,
  SpiralMoundIcon,
  KanagaMaskIcon,
  DreamtimeCircleIcon,
  DjedPillarIcon,
  SkyWatcherHeader,
  SovereignIcon,
  GoldenTicketCelebration,
  EmergencySOSButton,
  ViewModeToggle,
  GrimoireView,
  StewardsLog,
  JuniorGuardians,
  StewardsUtilityBelt,
} from '@/components/ancestral';
import { ViewMode } from '@/components/ancestral/ViewModeToggle';
import { OgunIcon, BabaluAyeIcon, ShangoIcon, OshunIcon, OrishaBadge } from '@/components/ancestral/OrishaIcons';
import { useAncestralProgress, Module } from '@/hooks/useAncestralProgress';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';

// Icon mapping for module icons
const iconMap: Record<string, React.ComponentType<{ color?: string; className?: string; animated?: boolean }>> = {
  'spiral-mound': SpiralMoundIcon,
  'kanaga-mask': KanagaMaskIcon,
  'dot-circle': DreamtimeCircleIcon,
  'sun-disc': DjedPillarIcon,
  'sovereign': SovereignIcon,
};

// Orisha data for each level - matching the Grand Temple specifications
const orishaMap: Record<number, {
  name: string;
  title: string;
  orisha: 'ogun' | 'babalu-aye' | 'shango' | 'oshun' | 'sovereign';
  Icon: React.ComponentType<{ className?: string; animated?: boolean }>;
  lore: string;
  science: string;
  task: string;
  texture: string;
  category: string;
}> = {
  1: {
    name: 'OGUN',
    title: 'Lord of Iron & Labor',
    orisha: 'ogun',
    Icon: OgunIcon,
    lore: 'Ogun clears the path. Do not break the fungal spine.',
    science: 'No-Till Protocol (Broadforking) & The Bug Tax (Trap Crops)',
    task: 'Upload photo of Broadforking or Drill Radishes',
    texture: 'Red Clay + Iron Chain',
    category: 'BIOLOGY',
  },
  2: {
    name: 'BABALU AYE',
    title: 'Lord of Earth & Healing',
    orisha: 'babalu-aye',
    Icon: BabaluAyeIcon,
    lore: 'Babalu heals the sores of the soil. The Stone is alive.',
    science: 'Paramagnetism (Basalt Rock Dust) & Compost Screening',
    task: 'Upload photo of Rock Dust application',
    texture: 'Porous Stone + Grain Skep',
    category: 'GEOLOGY',
  },
  3: {
    name: 'SHANGO',
    title: 'Lord of Lightning & Fire',
    orisha: 'shango',
    Icon: ShangoIcon,
    lore: 'Shango strikes the copper. The signal is ancient.',
    science: 'Electroculture • Sonic Bloom • Earth Acupuncture • Agnihotra',
    task: 'Upload photo of Copper Antenna or Agnihotra Ritual',
    texture: 'Copper + Star Map',
    category: 'PHYSICS',
  },
  4: {
    name: 'OSHUN',
    title: 'Lady of Sweet Waters',
    orisha: 'oshun',
    Icon: OshunIcon,
    lore: 'Oshun brings the honey. Kemit brings the gold.',
    science: 'High Brix (Nutrient Density) & JADAM (Fermented Plant Juice)',
    task: 'Upload Refractometer Reading (12+ Brix) or Ferment Bucket',
    texture: 'Gold Leaf + Brass Mirror',
    category: 'CHEMISTRY',
  },
  5: {
    name: 'THE SOVEREIGN',
    title: 'Keeper of the Eternal Seed',
    orisha: 'sovereign',
    Icon: ({ className, animated }) => <SovereignIcon className={className} animated={animated} />,
    lore: 'The loop is not closed until the seed is saved. The Grandmothers braided the rice into their hair so we could eat today. You do not own the harvest until you own the seed.',
    science: 'Epigenetics & Landrace Breeding',
    task: 'Upload photo of Saved Seeds (Dried & Jars)',
    texture: 'Iridescent Pearl + Spirit Light',
    category: 'SOVEREIGNTY',
  },
};

// Fallback modules for display when loading
const fallbackModules = [
  { level: 1, title: "LEVEL 1: THE IRON ROOT", mission: "Ogun clears the path.", lineage: "Muscogee & Maroons — Stewardship & Survival", color: "hsl(0 70% 40%)", iconName: 'spiral-mound' },
  { level: 2, title: "LEVEL 2: THE MAGNETIC EARTH", mission: "Babalu heals the soil.", lineage: "Olmec (Xi) — The Mother Culture", color: "hsl(30 40% 35%)", iconName: 'kanaga-mask' },
  { level: 3, title: "LEVEL 3: THE THUNDER SIGNAL", mission: "Shango strikes the copper.", lineage: "Dogon, Aboriginal, Chinese & Vedic", color: "hsl(15 100% 50%)", iconName: 'dot-circle' },
  { level: 4, title: "LEVEL 4: THE SWEET ALCHEMY", mission: "Oshun brings the honey.", lineage: "Ancient Kemit — The Gold Masters", color: "hsl(51 100% 50%)", iconName: 'sun-disc' },
  { level: 5, title: "LEVEL 5: THE MAROON BRAID", mission: "The Grandmothers braided the rice.", lineage: "The Sovereign Return — Seed Keepers", color: "hsl(0 0% 90%)", iconName: 'sovereign' },
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
  const { isAdmin } = useAdminRole();

  // Track currently open level for Sky Watcher Header
  const [currentOpenLevel, setCurrentOpenLevel] = useState<number | null>(null);

  // View Mode: 'path' (gamified) or 'book' (textbook/grimoire)
  // Default to 'book' mode - Library First Architecture
  const [viewMode, setViewMode] = useState<ViewMode>('book');

  // Kids Mode (Junior Guardians)
  const [isKidsMode, setIsKidsMode] = useState(false);

  // Golden Ticket Celebration state (for completing Level 4 / all levels)
  const [showGoldenTicket, setShowGoldenTicket] = useState(false);
  const hasShownGoldenTicketRef = useRef(false);

  // Chain Breaking Celebration state (for unlocking)
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ name: string; color: string } | null>(null);
  const previousUnlockedRef = useRef<Set<string>>(new Set());

  // Blessing Ceremony state (for completion)
  const [showBlessing, setShowBlessing] = useState(false);
  const [blessingData, setBlessingData] = useState<{ 
    orisha: 'ogun' | 'babalu-aye' | 'shango' | 'oshun' | 'sovereign';
    moduleName: string;
  } | null>(null);
  const previousCompletedRef = useRef<Set<string>>(new Set());

  const {
    modules,
    moduleProgress,
    isLoading,
    user,
    isModuleUnlocked,
    isModuleCompleted,
    getModuleCompletionPercent,
    getOverallProgress,
  } = useAncestralProgress();

  // Detect newly unlocked modules and trigger celebration
  useEffect(() => {
    if (isLoading || !user || modules.length === 0) return;

    const currentUnlocked = new Set(
      modules.filter(m => isModuleUnlocked(m.id)).map(m => m.id)
    );

    // Check for newly unlocked modules (not in previous set)
    currentUnlocked.forEach(moduleId => {
      if (!previousUnlockedRef.current.has(moduleId) && previousUnlockedRef.current.size > 0) {
        // A new module was unlocked!
        const unlockedModule = modules.find(m => m.id === moduleId);
        if (unlockedModule && unlockedModule.order_index > 1) {
          // Trigger celebration for non-first modules
          setCelebrationData({
            name: unlockedModule.display_name,
            color: unlockedModule.chakra_color,
          });
          setShowCelebration(true);
        }
      }
    });

    previousUnlockedRef.current = currentUnlocked;
  }, [modules, moduleProgress, isLoading, user, isModuleUnlocked]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setCelebrationData(null);
  }, []);

  // Module name to Orisha mapping
  const moduleNameToOrisha: Record<string, 'ogun' | 'babalu-aye' | 'shango' | 'oshun' | 'sovereign'> = {
    'root-protocol': 'ogun',
    'magnetic-earth': 'babalu-aye',
    'thunder-signal': 'shango',
    'sweet-alchemy': 'oshun',
    'sovereign-return': 'sovereign',
  };

  // Detect newly completed modules and trigger blessing ceremony
  useEffect(() => {
    if (isLoading || !user || modules.length === 0) return;

    const currentCompleted = new Set(
      modules.filter(m => isModuleCompleted(m.id)).map(m => m.id)
    );

    // Check for newly completed modules
    currentCompleted.forEach(moduleId => {
      if (!previousCompletedRef.current.has(moduleId) && previousCompletedRef.current.size >= 0) {
        // A module was just completed!
        const completedModule = modules.find(m => m.id === moduleId);
        if (completedModule) {
          const orisha = moduleNameToOrisha[completedModule.name] || 'ogun';
          setBlessingData({
            orisha,
            moduleName: completedModule.display_name,
          });
          setShowBlessing(true);
        }
      }
    });

    previousCompletedRef.current = currentCompleted;
  }, [modules, moduleProgress, isLoading, user, isModuleCompleted]);

  const handleBlessingComplete = useCallback(() => {
    setShowBlessing(false);
    setBlessingData(null);
  }, []);

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
    setCurrentOpenLevel(module.level);
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

  // Check if Level 4 is complete to show Level 5
  const isLevel4Complete = displayModules.find(m => m.level === 4)?.isCompleted || false;

  // Build the final display modules list (add Level 5 if Level 4 is complete)
  const level5Data = {
    id: 'level-5-sovereign',
    level: 5,
    title: 'LEVEL 5: THE MAROON BRAID',
    mission: 'The Songline does not end; it loops. The Grandmothers braided the seed. You are now the Ancestor.',
    lineage: 'Sovereignty — The Seed Keepers',
    color: 'hsl(0 0% 85%)', // Iridescent Pearl
    iconName: 'sovereign',
    isUnlocked: isLevel4Complete,
    isCompleted: false,
    completionPercent: 0,
  };

  // Insert Level 5 at the top of the totem if Level 4 is complete
  const finalDisplayModules = isLevel4Complete 
    ? [level5Data, ...displayModules]
    : displayModules;

  // Detect Level 4 completion and trigger Golden Ticket celebration
  useEffect(() => {
    if (isLevel4Complete && !hasShownGoldenTicketRef.current && user) {
      hasShownGoldenTicketRef.current = true;
      // Small delay to allow blessing ceremony to complete first
      const timer = setTimeout(() => {
        setShowGoldenTicket(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isLevel4Complete, user]);

  // Handle opening Almanac from Kids Mode
  const handleOpenAlmanacFromKidsMode = (zoneNumber: number) => {
    setIsKidsMode(false);
    setViewMode('book');
    // Find the module for this zone and open the drawer
    const targetModule = displayModules.find(m => m.level === zoneNumber);
    if (targetModule) {
      handleModuleSelect(targetModule);
    }
  };

  // If Kids Mode is active, render the Junior Guardians interface
  if (isKidsMode) {
    return (
      <JuniorGuardians
        onExitKidsMode={() => setIsKidsMode(false)}
        onOpenAlmanac={handleOpenAlmanacFromKidsMode}
      />
    );
  }

  return (
    <main 
      ref={containerRef}
      className="min-h-[300vh] relative overflow-x-hidden"
    >
      {/* Sky Watcher Header - Lunar Rhythm Display */}
      <SkyWatcherHeader currentOpenLevel={currentOpenLevel} />

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
          className="fixed top-6 right-6 z-50"
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

      {/* User Menu when logged in */}
      {user && !isLoading && (
        <motion.div
          className="fixed top-6 right-6 z-50 flex items-center gap-3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* Admin Link */}
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 font-mono text-xs"
              style={{
                background: 'linear-gradient(135deg, hsl(51 40% 15%), hsl(40 30% 12%))',
                border: '1px solid hsl(51 100% 50%)',
                color: 'hsl(51 100% 60%)',
                boxShadow: '0 0 15px hsl(51 80% 40% / 0.3)',
              }}
              onClick={() => navigate('/hogon-review')}
            >
              <Shield className="w-3 h-3" />
              Hogon's Chamber
            </Button>
          )}
          
          {/* Profile Button */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 font-mono text-xs"
            style={{
              background: 'linear-gradient(135deg, hsl(280 40% 15%), hsl(250 30% 12%))',
              border: '1px solid hsl(280 60% 50%)',
              color: 'hsl(280 60% 70%)',
              boxShadow: '0 0 15px hsl(280 60% 40% / 0.3)',
            }}
            onClick={() => navigate('/pharmer-profile')}
          >
            <User className="w-3 h-3" />
            My Journal
          </Button>

          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-full font-mono text-xs"
            style={{
              background: 'hsl(20 30% 12% / 0.9)',
              border: '1px solid hsl(140 40% 30%)',
              color: 'hsl(140 50% 60%)',
            }}
          >
            <User className="w-3 h-3" />
            <span>Pharmer Active</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 font-mono text-xs"
            style={{
              background: 'hsl(20 30% 12% / 0.9)',
              border: '1px solid hsl(0 40% 30%)',
              color: 'hsl(0 50% 60%)',
            }}
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/');
            }}
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </Button>
        </motion.div>
      )}

      {/* Sap Rise Progress Bar */}
      <SapRiseProgress overallProgress={getOverallProgress()} />

      {/* Main Content - The Totem */}
      <div className="relative z-10 pt-36 pb-32">
        
        {/* Header */}
        <motion.div
          className="text-center mb-8 px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 
            className="text-3xl md:text-5xl lg:text-6xl mb-4 tracking-[0.1em]"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: viewMode === 'book' 
                ? 'hsl(40 70% 65%)' 
                : viewMode === 'log'
                ? 'hsl(140 50% 60%)'
                : 'hsl(51 100% 50%)',
              textShadow: viewMode === 'book'
                ? '0 0 40px hsl(40 60% 40% / 0.4)'
                : viewMode === 'log'
                ? '0 0 40px hsl(140 60% 35% / 0.4)'
                : `2px 2px 0 hsl(20 50% 10%), 0 0 40px hsl(51 80% 40% / 0.4)`,
            }}
          >
            {viewMode === 'book' 
              ? 'THE LIVING ALMANAC' 
              : viewMode === 'log'
              ? "THE STEWARD'S LOG"
              : 'THE ANCESTRAL PATH'}
          </h1>
          <p 
            className="text-lg md:text-xl font-mono mb-6"
            style={{ color: 'hsl(40 50% 65%)' }}
          >
            {viewMode === 'book' 
              ? 'Listen when the soil whispers. Act when the stars signal.'
              : viewMode === 'log'
              ? 'Record. Reflect. Remember.'
              : 'Ascend from Root to Crown'}
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex justify-center mb-4">
            <ViewModeToggle value={viewMode} onChange={setViewMode} showPath={true} />
          </div>

          {/* Junior Guardians (Kids Mode) Button */}
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              className="rounded-full px-6 py-3 text-lg font-bold gap-2"
              style={{
                fontFamily: "'Chewy', cursive",
                background: 'linear-gradient(135deg, hsl(120 60% 50%), hsl(195 70% 50%), hsl(45 90% 55%))',
                color: 'white',
                border: '3px solid white',
                boxShadow: '0 4px 20px hsl(120 60% 50% / 0.4)',
              }}
              onClick={() => setIsKidsMode(true)}
            >
              <Sparkles className="w-5 h-5" />
              JUNIOR GUARDIANS
              <span className="text-xl">🌱</span>
            </Button>
          </motion.div>

          {user && viewMode === 'path' && (
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

        {/* Conditional Content: Almanac, Log, or Path View */}
        <AnimatePresence mode="wait">
          {viewMode === 'book' ? (
            <motion.div
              key="grimoire"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GrimoireView
                onEnterFieldLab={(moduleLevel) => {
                  // Find the module for this level and open the drawer
                  const targetModule = displayModules.find(m => m.level === moduleLevel);
                  if (targetModule) {
                    handleModuleSelect(targetModule);
                  }
                }}
              />
            </motion.div>
          ) : viewMode === 'log' ? (
            <motion.div
              key="stewards-log"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StewardsLog userId={user?.id} />
            </motion.div>
          ) : (
            <motion.div
              key="path"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >

        {/* Skill Tree Container */}
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          
          {/* Module Nodes with Mycelial Cords and Orisha Guardians */}
          {finalDisplayModules.map((module, index) => {
            const IconComponent = module.level === 5 
              ? SovereignIcon 
              : (iconMap[module.iconName] || SpiralMoundIcon);
            const orishaData = orishaMap[module.level];
            const OrishaIcon = orishaData?.Icon;
            
            return (
              <div key={module.id} className="relative">
                {/* Mycelial Cord connector (except for last/top node) */}
                {index < finalDisplayModules.length - 1 && (
                  <div className="absolute left-10 md:left-14 top-full z-0">
                    <MycelialCord 
                      height="120px" 
                      isActive={module.isUnlocked || finalDisplayModules[index + 1]?.isUnlocked}
                    />
                  </div>
                )}

                {/* Module Node with Orisha */}
                <div className="relative z-10 py-8">
                  <div className="flex items-start gap-4">
                    {/* Orisha Guardian Icon (left side on desktop) */}
                    {orishaData && (
                      <motion.div
                        className="hidden md:flex flex-col items-center gap-2 min-w-[80px]"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: module.isUnlocked ? 1 : 0.4, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{
                            background: module.isCompleted 
                              ? `radial-gradient(circle at 30% 30%, ${module.color}40, ${module.color}20)`
                              : 'hsl(0 0% 12%)',
                            border: `2px solid ${module.isCompleted ? module.color : 'hsl(0 0% 25%)'}`,
                            boxShadow: module.isCompleted ? `0 0 20px ${module.color}40` : 'none',
                            filter: module.isUnlocked ? 'none' : 'grayscale(100%)',
                          }}
                        >
                          <OrishaIcon className="w-10 h-10" animated={module.isUnlocked} />
                        </div>
                        <p 
                          className="text-xs text-center tracking-wider"
                          style={{ 
                            fontFamily: "'Staatliches', sans-serif",
                            color: module.isCompleted ? module.color : 'hsl(0 0% 40%)',
                          }}
                        >
                          {orishaData.name}
                        </p>
                        {module.isCompleted && (
                          <motion.p
                            className="text-[10px] font-mono text-center"
                            style={{ color: module.color }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            ✦ BLESSED ✦
                          </motion.p>
                        )}
                      </motion.div>
                    )}
                    
                    {/* Main Module Node */}
                    <div className="flex-1">
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
                      
                      {/* Lore, Science & Task info (shown when unlocked) */}
                      {module.isUnlocked && orishaData && (
                        <motion.div
                          className="mt-3 ml-20 md:ml-24 space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          {/* Category Badge */}
                          <p 
                            className="text-[10px] font-mono tracking-widest"
                            style={{ color: module.color, opacity: 0.8 }}
                          >
                            ◆ {orishaData.category}
                          </p>
                          {/* Lore */}
                          <p 
                            className="text-xs italic"
                            style={{ 
                              fontFamily: "'Staatliches', sans-serif",
                              color: 'hsl(40 40% 70%)',
                              letterSpacing: '0.02em',
                            }}
                          >
                            "{orishaData.lore}"
                          </p>
                          {/* Science */}
                          <p 
                            className="text-xs font-mono"
                            style={{ color: 'hsl(195 60% 60%)' }}
                          >
                            ⚗ {orishaData.science}
                          </p>
                          {/* Task */}
                          <p 
                            className="text-xs font-mono"
                            style={{ color: 'hsl(40 50% 50%)' }}
                          >
                            📷 {orishaData.task}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lesson Drawer */}
      <LessonDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setCurrentOpenLevel(null);
        }}
        module={selectedModule}
      />

      {/* Chain Breaking Celebration (for unlocking) */}
      <ChainBreakingCelebration
        isVisible={showCelebration}
        onComplete={handleCelebrationComplete}
        levelName={celebrationData?.name || 'NEW LEVEL'}
        color={celebrationData?.color || 'hsl(45 90% 55%)'}
      />

      {/* Blessing Ceremony (for completion) */}
      {blessingData && (
        <BlessingCeremony
          isActive={showBlessing}
          orisha={blessingData.orisha}
          moduleName={blessingData.moduleName}
          onComplete={handleBlessingComplete}
        />
      )}

      {/* Golden Ticket Celebration (for completing Level 4) */}
      <GoldenTicketCelebration
        isVisible={showGoldenTicket}
        onClose={() => setShowGoldenTicket(false)}
      />

      {/* Emergency SOS Button - Always Visible Safety Feature */}
      <EmergencySOSButton />

      {/* Steward's Utility Belt - Fixed Bottom Navigation */}
      <StewardsUtilityBelt />
    </main>
  );
};

export default AncestralPath;
