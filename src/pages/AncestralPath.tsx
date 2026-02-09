import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, LogOut, User, Shield, Sparkles, Music } from 'lucide-react';
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
  JuniorGuardians,
  StewardsUtilityBelt,
  AgroSonicRadio,
  BannekerAlmanac,
  UnifiedViewToggle,
  FieldAlmanacEmbed,
  PathContentView,
} from '@/components/ancestral';
import { UnifiedViewMode } from '@/components/ancestral/UnifiedViewToggle';
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
 * THE ANCESTRAL PATH - Unified Learning Hub
 * 
 * Two Primary Pillars:
 * - THE PATH: The "Why" / Theory / Vision / Spirit (with sub-tabs: Almanac, Spirit, Log)
 * - THE ALMANAC: The "How" / Tools / Actions / Utility (Field Mode)
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

  // Unified View Mode: 'path' (Theory/Spirit) or 'almanac' (Field/Action)
  const [unifiedView, setUnifiedView] = useState<UnifiedViewMode>('path');

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
    setUnifiedView('path');
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
      className="min-h-screen relative overflow-x-hidden"
      style={{ cursor: 'default' }}
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

      {/* Darkroom overlay */}
      <div className="fixed inset-0 bg-black/30 pointer-events-none" />

      {/* Back button + Banneker Almanac (Left Side) */}
      <motion.div
        className="fixed top-6 left-6 z-50 flex items-center gap-3"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'hsl(20 30% 12% / 0.9)',
            border: '1px solid hsl(40 40% 30%)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
          }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: 'hsl(40 50% 70%)' }} />
          <span 
            className="text-sm font-mono hidden sm:inline"
            style={{ color: 'hsl(40 50% 70%)' }}
          >
            Return
          </span>
        </motion.button>
        
        {/* Banneker Almanac - Weather Display */}
        <BannekerAlmanac />
      </motion.div>

      {/* Auth Status Indicator */}
      {!user && !isLoading && (
        <motion.div
          className="fixed top-6 right-6 z-50 flex items-center gap-3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          {/* Agro-Sonic Radio - 432Hz Toggle (available to all) */}
          <AgroSonicRadio />
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 font-mono text-xs"
            style={{
              background: 'hsl(20 30% 12% / 0.9)',
              border: '1px solid hsl(40 40% 30%)',
              color: 'hsl(40 50% 70%)',
              cursor: 'pointer',
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
          {/* Agro-Sonic Radio - 432Hz Toggle */}
          <AgroSonicRadio />
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
                cursor: 'pointer',
              }}
              onClick={() => navigate('/hogon-review')}
            >
              <Shield className="w-3 h-3" />
              Hogon's Chamber
            </Button>
          )}
          
          {/* Piano Almanac Button */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 font-mono text-xs"
            style={{
              background: 'linear-gradient(135deg, hsl(270 40% 15%), hsl(300 30% 12%))',
              border: '1px solid hsl(270 60% 50%)',
              color: 'hsl(270 60% 70%)',
              boxShadow: '0 0 15px hsl(270 60% 40% / 0.3)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/piano-almanac')}
          >
            <Music className="w-3 h-3" />
            Piano Almanac
          </Button>
          
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
              cursor: 'pointer',
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
              cursor: 'pointer',
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

      {/* Main Content */}
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
              color: unifiedView === 'path' 
                ? 'hsl(270 60% 70%)' 
                : 'hsl(45 100% 60%)',
              textShadow: unifiedView === 'path'
                ? '0 0 40px hsl(270 50% 40% / 0.5)'
                : '0 0 40px hsl(45 80% 40% / 0.4)',
            }}
          >
            {unifiedView === 'path' 
              ? 'THE ANCESTRAL PATH' 
              : 'THE FIELD ALMANAC'}
          </h1>
          <p 
            className="text-lg md:text-xl font-mono mb-6"
            style={{ color: 'hsl(40 50% 65%)' }}
          >
            {unifiedView === 'path' 
              ? 'The "Why" — Theory • Vision • Spirit'
              : 'The "How" — Tools • Actions • Utility'}
          </p>
          
          {/* Unified View Toggle - Two Pillars */}
          <div className="flex justify-center mb-6">
            <UnifiedViewToggle value={unifiedView} onChange={setUnifiedView} />
          </div>

          {/* Junior Guardians (Kids Mode) Button */}
          <motion.div
            className="flex justify-center"
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
                cursor: 'pointer',
              }}
              onClick={() => setIsKidsMode(true)}
            >
              <Sparkles className="w-5 h-5" />
              JUNIOR GUARDIANS
              <span className="text-xl">🌱</span>
            </Button>
          </motion.div>

          {user && unifiedView === 'path' && (
            <motion.p
              className="mt-4 text-sm font-mono"
              style={{ color: 'hsl(140 50% 50%)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Overall Progress: {getOverallProgress()}%
            </motion.p>
          )}
        </motion.div>

        {/* Conditional Content: Path (Theory) or Almanac (Action) */}
        <AnimatePresence mode="wait">
          {unifiedView === 'path' ? (
            <motion.div
              key="path-content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PathContentView
                userId={user?.id}
                displayModules={displayModules}
                onModuleSelect={handleModuleSelect}
                onEnterKidsMode={() => setIsKidsMode(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="almanac-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FieldAlmanacEmbed />
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
