import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Pickaxe, Mountain, Zap, Sun, Droplets, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import InitiationModal from './InitiationModal';
import AscensionLessonDrawer from './AscensionLessonDrawer';
import ChainBreakingCelebration from './ChainBreakingCelebration';

// Level content data with cultural/scientific themes
interface LevelData {
  level: number;
  orisha: string;
  title: string;
  subtitle: string;
  statusColor: string;
  glowColor: string;
  bgColor: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const levelData: LevelData[] = [
  {
    level: 4,
    orisha: 'OSHUN',
    title: 'THE SWEET ALCHEMY',
    subtitle: 'Kemetic Chemistry & High Brix',
    statusColor: '#ffd700', // Gold
    glowColor: 'hsl(51 100% 50%)',
    bgColor: 'hsl(51 80% 35%)',
    Icon: ({ className, style }) => (
      <div className={className} style={style}>
        <Sun className="w-full h-full" />
        <Droplets className="w-3 h-3 absolute -bottom-0.5 -right-0.5" style={{ color: 'hsl(200 80% 60%)' }} />
      </div>
    ),
  },
  {
    level: 3,
    orisha: 'SHANGO',
    title: 'THE THUNDER SIGNAL',
    subtitle: 'Dogon Physics & Electroculture',
    statusColor: '#00bfff', // Cyan
    glowColor: 'hsl(195 100% 50%)',
    bgColor: 'hsl(195 70% 35%)',
    Icon: Zap,
  },
  {
    level: 2,
    orisha: 'BABALU AYE',
    title: 'THE MAGNETIC EARTH',
    subtitle: 'Olmec Geology & Paramagnetism',
    statusColor: '#ffbf00', // Amber
    glowColor: 'hsl(45 100% 50%)',
    bgColor: 'hsl(45 70% 35%)',
    Icon: Mountain,
  },
  {
    level: 1,
    orisha: 'OGUN',
    title: 'THE IRON ROOT',
    subtitle: 'Muscogee Biology & No-Till',
    statusColor: '#ff0000', // Red
    glowColor: 'hsl(0 100% 50%)',
    bgColor: 'hsl(0 70% 35%)',
    Icon: Pickaxe,
  },
];

interface LevelCardProps {
  data: LevelData;
  isUnlocked: boolean;
  onSelect: () => void;
  completedCount: number;
  totalCount: number;
}

/**
 * Level Card - Glassmorphic card for each level in the Ascension Map
 */
const LevelCard = ({ data, isUnlocked, onSelect, completedCount, totalCount }: LevelCardProps) => {
  const [isShaking, setIsShaking] = useState(false);
  const { level, orisha, title, subtitle, statusColor, glowColor, bgColor, Icon } = data;
  const isComplete = totalCount > 0 && completedCount >= totalCount;
  const handleClick = () => {
    if (isUnlocked) {
      onSelect();
    } else {
      // Trigger shake animation for locked cards
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <motion.button
      className="relative flex items-center gap-6 p-6 rounded-2xl w-full max-w-md cursor-pointer"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: isUnlocked 
          ? `2px solid ${statusColor}` 
          : '1px solid rgba(255, 255, 255, 0.2)',
        opacity: isUnlocked ? 1 : 0.5,
      }}
      onClick={handleClick}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: isUnlocked ? 1 : 0.5, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (4 - level) * 0.15 }}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      animate={isShaking ? {
        x: [0, -10, 10, -10, 10, -5, 5, 0],
        transition: { duration: 0.5 }
      } : {}}
    >
      {/* Icon Container */}
      <div 
        className="relative flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
        style={{
          background: isUnlocked 
            ? `linear-gradient(135deg, ${bgColor}, ${bgColor}99)`
            : 'hsl(0 0% 20%)',
          border: isUnlocked ? `1px solid ${statusColor}80` : '1px solid hsl(0 0% 30%)',
          boxShadow: isUnlocked ? `0 0 20px ${statusColor}40` : 'none',
        }}
      >
        {isUnlocked ? (
          <Icon 
            className="w-8 h-8" 
            style={{ 
              color: statusColor,
              filter: `drop-shadow(0 0 8px ${statusColor})`,
            }}
          />
        ) : (
          <Lock 
            className="w-8 h-8" 
            style={{ color: 'hsl(0 0% 45%)' }}
          />
        )}
      </div>

      {/* Text Content */}
      <div className="flex-1 text-left">
        {/* Orisha Name */}
        <p 
          className="text-xs tracking-[0.2em] mb-1"
          style={{ 
            fontFamily: "'Space Mono', monospace",
            color: isUnlocked ? statusColor : 'hsl(0 0% 50%)',
          }}
        >
          {orisha}
        </p>
        {/* Title */}
        <h3 
          className="text-lg md:text-xl tracking-wide uppercase mb-1"
          style={{ 
            fontFamily: "'Staatliches', sans-serif",
            color: isUnlocked ? 'hsl(0 0% 95%)' : 'hsl(0 0% 50%)',
            textShadow: isUnlocked ? `0 0 10px ${statusColor}40` : 'none',
          }}
        >
          {title}
        </h3>
        {/* Subtitle */}
        <p 
          className="text-xs tracking-wide"
          style={{ 
            fontFamily: "'Space Mono', monospace",
            color: isUnlocked ? 'hsl(0 0% 70%)' : 'hsl(0 0% 40%)',
          }}
        >
          {subtitle}
        </p>
        
        {/* Lesson Progress Count */}
        {isUnlocked && totalCount > 0 && (
          <div 
            className="flex items-center gap-2 mt-2"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <div 
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: isComplete ? `${statusColor}30` : 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${isComplete ? statusColor : 'rgba(255, 255, 255, 0.2)'}`,
                color: isComplete ? statusColor : 'hsl(0 0% 60%)',
              }}
            >
              {completedCount}/{totalCount} lessons
            </div>
            {isComplete && (
              <span style={{ color: statusColor }}>✓</span>
            )}
          </div>
        )}
      </div>

      {/* Pulsating Glow Effect for Unlocked Cards */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: `2px solid ${statusColor}`,
          }}
          animate={{
            boxShadow: [
              `0 0 15px ${statusColor}66, 0 0 30px ${statusColor}33`,
              `0 0 25px ${statusColor}99, 0 0 50px ${statusColor}66`,
              `0 0 15px ${statusColor}66, 0 0 30px ${statusColor}33`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Locked Overlay with Centered Padlock */}
      {!isUnlocked && (
        <div 
          className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <Lock 
            className="w-10 h-10" 
            style={{ 
              color: 'hsl(0 0% 40%)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
            }}
          />
        </div>
      )}
    </motion.button>
  );
};

/**
 * Sap Rise Thermometer - Fixed progress bar on the right edge
 */
interface SapRiseThermometerProps {
  currentLevel: number;
}

const SapRiseThermometer = ({ currentLevel }: SapRiseThermometerProps) => {
  // Calculate fill percentage based on current level
  const fillPercent = currentLevel * 25;

  return (
    <motion.div
      className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {/* Label */}
      <div 
        className="text-xs font-mono tracking-widest text-center"
        style={{ 
          color: 'hsl(140 50% 55%)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
        }}
      >
        SAP RISE
      </div>

      {/* Thermometer Container */}
      <div 
        className="relative w-5 md:w-6 h-52 md:h-64 rounded-full overflow-hidden"
        style={{
          background: 'hsl(0 0% 8%)',
          border: '2px solid hsl(40 35% 25%)',
          boxShadow: 'inset 0 0 15px hsl(0 0% 5%), 0 0 15px hsl(140 40% 20% / 0.3)',
        }}
      >
        {/* Measurement marks */}
        {[0, 25, 50, 75, 100].map((mark) => (
          <div
            key={mark}
            className="absolute left-0 w-1.5 h-px"
            style={{
              bottom: `${mark}%`,
              background: 'hsl(40 35% 40%)',
            }}
          />
        ))}

        {/* Green Liquid Fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-full"
          style={{
            background: currentLevel >= 4 
              ? `linear-gradient(0deg,
                  hsl(120 70% 30%) 0%,
                  hsl(100 65% 40%) 50%,
                  hsl(80 70% 50%) 100%
                )`
              : `linear-gradient(0deg,
                  hsl(140 65% 25%) 0%,
                  hsl(120 55% 35%) 50%,
                  hsl(100 65% 45%) 100%
                )`,
            boxShadow: currentLevel >= 4
              ? `inset 0 5px 10px hsl(100 80% 55% / 0.3), 0 0 15px hsl(100 65% 45% / 0.5)`
              : `inset 0 5px 10px hsl(140 70% 50% / 0.25), 0 0 8px hsl(140 55% 40% / 0.4)`,
          }}
          animate={{ height: `${fillPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Bubbles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  background: 'hsl(140 75% 60% / 0.35)',
                  left: `${15 + Math.random() * 70}%`,
                }}
                animate={{
                  y: [0, -40],
                  opacity: [0.7, 0],
                }}
                transition={{
                  duration: 1.2 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Glass highlight */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(90deg,
              transparent 0%,
              hsl(0 0% 100% / 0.04) 30%,
              hsl(0 0% 100% / 0.08) 50%,
              hsl(0 0% 100% / 0.04) 70%,
              transparent 100%
            )`,
          }}
        />
      </div>

      {/* Bulb at bottom */}
      <div 
        className="w-8 h-8 md:w-10 md:h-10 rounded-full -mt-3"
        style={{
          background: currentLevel >= 4
            ? `radial-gradient(circle at 30% 30%, hsl(100 70% 40%), hsl(100 60% 25%))`
            : `radial-gradient(circle at 30% 30%, hsl(140 60% 35%), hsl(140 50% 20%))`,
          border: '2px solid hsl(40 35% 25%)',
          boxShadow: currentLevel >= 4
            ? '0 0 20px hsl(100 65% 40% / 0.5)'
            : '0 0 15px hsl(140 55% 30% / 0.4)',
        }}
      />

      {/* Percentage */}
      <div 
        className="text-sm font-mono"
        style={{ color: 'hsl(140 50% 55%)' }}
      >
        {fillPercent}%
      </div>
    </motion.div>
  );
};

/**
 * Mycelial Cord - Centered glowing vertical line
 */
const CentralCord = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 z-0">
      {/* Main glow line */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(180deg,
            hsl(45 50% 40%) 0%,
            hsl(35 45% 30%) 25%,
            hsl(40 50% 35%) 50%,
            hsl(35 45% 30%) 75%,
            hsl(45 50% 40%) 100%
          )`,
          boxShadow: '0 0 15px hsl(45 50% 40% / 0.5), 0 0 30px hsl(45 40% 30% / 0.3)',
        }}
      />
      
      {/* Pulsing nodes */}
      {[15, 35, 55, 75].map((position, i) => (
        <motion.div
          key={position}
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
          style={{
            top: `${position}%`,
            background: 'hsl(45 60% 50%)',
            boxShadow: '0 0 10px hsl(45 60% 50% / 0.6)',
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Ascension Map - Phase 3 with Cultural Content
 * Vertical timeline with 4 levels, bottom-to-top scroll
 */

const AscensionMap = () => {
  const { toast } = useToast();
  
  // State: Current level tracks user progress (from database)
  const [currentLevel, setCurrentLevel] = useState(1);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const previousLevelRef = useRef(1);
  
  // Modal, Drawer, and Celebration states
  const [isInitiationOpen, setIsInitiationOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState<number | null>(null);
  
  // Lesson counts per level: { [level]: { completed: number, total: number } }
  const [lessonCounts, setLessonCounts] = useState<Record<number, { completed: number; total: number }>>({});

  // Fetch lesson counts for all levels
  const fetchLessonCounts = useCallback(async (userId?: string) => {
    // Get all modules with their lessons
    const { data: modules } = await supabase
      .from('modules')
      .select('id, order_index')
      .order('order_index');
    
    if (!modules) return;
    
    // Get all lessons grouped by module
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, module_id');
    
    if (!lessons) return;
    
    // Get user's completed lessons (field journal entries)
    let completedLessonIds: string[] = [];
    if (userId) {
      const { data: journalEntries } = await supabase
        .from('field_journal')
        .select('lesson_id')
        .eq('user_id', userId);
      
      completedLessonIds = journalEntries?.map(e => e.lesson_id) || [];
    }
    
    // Build counts per level
    const counts: Record<number, { completed: number; total: number }> = {};
    
    modules.forEach(module => {
      const moduleLessons = lessons.filter(l => l.module_id === module.id);
      const completedCount = moduleLessons.filter(l => completedLessonIds.includes(l.id)).length;
      
      counts[module.order_index] = {
        completed: completedCount,
        total: moduleLessons.length,
      };
    });
    
    setLessonCounts(counts);
  }, []);

  // Fetch user progress from database
  const fetchProgress = useCallback(async (userId: string) => {
    // Get highest unlocked module
    const { data: moduleProgress } = await supabase
      .from('user_module_progress')
      .select(`
        module_id,
        completed_at,
        modules!inner(order_index)
      `)
      .eq('user_id', userId)
      .order('modules(order_index)', { ascending: false })
      .limit(1);

    if (moduleProgress && moduleProgress.length > 0) {
      const highestUnlocked = (moduleProgress[0].modules as { order_index: number }).order_index;
      setCurrentLevel(highestUnlocked);
    }
    
    // Fetch lesson counts with user context
    fetchLessonCounts(userId);
  }, [fetchLessonCounts]);

  // Initialize: check auth and fetch progress
  useEffect(() => {
    // Always fetch lesson counts (even for non-logged-in users, shows totals)
    fetchLessonCounts();
    
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id });
        fetchProgress(data.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id });
        fetchProgress(session.user.id);
      } else {
        setUser(null);
        setCurrentLevel(1);
        fetchLessonCounts(); // Refresh without user context
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProgress, fetchLessonCounts]);

  // Handle card selection - opens Lesson Drawer
  const handleCardSelect = (level: number) => {
    console.log(`OPEN LESSON DRAWER - Level ${level}`);
    setSelectedLevel(level);
    setIsDrawerOpen(true);
  };

  // Handle level completion - refresh progress and check for level up
  const handleLevelComplete = useCallback(() => {
    if (user) {
      // Delay to allow database triggers to complete
      setTimeout(async () => {
        // Store previous level before fetching
        const prevLevel = currentLevel;
        
        // Fetch updated progress
        const { data: moduleProgress } = await supabase
          .from('user_module_progress')
          .select(`
            module_id,
            completed_at,
            modules!inner(order_index)
          `)
          .eq('user_id', user.id)
          .order('modules(order_index)', { ascending: false })
          .limit(1);

        if (moduleProgress && moduleProgress.length > 0) {
          const newLevel = (moduleProgress[0].modules as { order_index: number }).order_index;
          
          // If level increased, trigger celebration and toast!
          if (newLevel > prevLevel) {
            const unlockedLevelData = levelData.find(l => l.level === newLevel);
            setCelebrationLevel(newLevel);
            setShowCelebration(true);
            
            // Show toast notification
            toast({
              title: "🔓 Level Unlocked!",
              description: unlockedLevelData 
                ? `${unlockedLevelData.orisha}: ${unlockedLevelData.title} is now available.`
                : "A new level has been unlocked!",
            });
          }
          
          setCurrentLevel(newLevel);
          previousLevelRef.current = newLevel;
        }
        
        // Refresh lesson counts
        fetchLessonCounts(user.id);
      }, 1000);
    }
  }, [user, currentLevel, fetchLessonCounts, toast]);

  // Simulate level up for debugging (also triggers celebration)
  const handleSimulateLevelUp = () => {
    const newLevel = Math.min(currentLevel + 1, 4);
    if (newLevel > currentLevel) {
      setCelebrationLevel(newLevel);
      setShowCelebration(true);
      setCurrentLevel(newLevel);
    }
  };

  // Handle celebration complete
  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setCelebrationLevel(null);
  };

  // Get level data for celebration
  const getCelebrationLevelData = () => {
    if (!celebrationLevel) return { name: 'NEW LEVEL', color: 'hsl(45 90% 55%)' };
    const level = levelData.find(l => l.level === celebrationLevel);
    return {
      name: level?.title || 'NEW LEVEL',
      color: level?.glowColor || 'hsl(45 90% 55%)',
    };
  };

  return (
    <section 
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: '#1a1a00',
      }}
    >
      {/* Organic texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Keyhole Icon - Opens Initiation Modal */}
      <motion.button
        className="fixed top-6 left-6 z-50 p-3 rounded-full"
        style={{
          background: 'rgba(26, 26, 0, 0.9)',
          border: '1px solid hsl(45 50% 30%)',
          boxShadow: '0 0 20px hsl(45 50% 25% / 0.3)',
        }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 30px hsl(45 60% 40% / 0.5)',
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsInitiationOpen(true)}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <KeyRound 
          className="w-6 h-6" 
          style={{ 
            color: 'hsl(45 60% 55%)',
            filter: 'drop-shadow(0 0 8px hsl(45 60% 50% / 0.5))',
          }} 
        />
      </motion.button>

      {/* Central Mycelial Cord */}
      <CentralCord />

      {/* Sap Rise Thermometer */}
      <SapRiseThermometer currentLevel={currentLevel} />

      {/* Level Cards Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-20 px-6">
        <div className="flex flex-col items-center gap-16">
          {levelData.map((data) => (
            <LevelCard
              key={data.level}
              data={data}
              isUnlocked={currentLevel >= data.level}
              onSelect={() => handleCardSelect(data.level)}
              completedCount={lessonCounts[data.level]?.completed || 0}
              totalCount={lessonCounts[data.level]?.total || 0}
            />
          ))}
        </div>

        {/* Bottom instruction */}
        <motion.p 
          className="mt-16 text-sm font-mono tracking-widest"
          style={{ color: 'hsl(45 40% 45%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ↑ SCROLL UP TO ASCEND ↑
        </motion.p>
      </div>

      {/* Debug Button - Simulate Level Up */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg font-mono text-xs"
        style={{
          background: 'hsl(280 50% 25%)',
          border: '1px solid hsl(280 60% 50%)',
          color: 'hsl(280 60% 75%)',
          boxShadow: '0 0 15px hsl(280 50% 30% / 0.5)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSimulateLevelUp}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        🧪 SIMULATE LEVEL UP (Current: {currentLevel})
      </motion.button>

      {/* Initiation Modal */}
      <InitiationModal 
        isOpen={isInitiationOpen} 
        onClose={() => setIsInitiationOpen(false)} 
      />

      {/* Lesson Drawer */}
      <AscensionLessonDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        level={selectedLevel}
        onLevelComplete={handleLevelComplete}
      />

      {/* Chain Breaking Celebration */}
      <ChainBreakingCelebration
        isVisible={showCelebration}
        onComplete={handleCelebrationComplete}
        levelName={getCelebrationLevelData().name}
        color={getCelebrationLevelData().color}
      />
    </section>
  );
};

export default AscensionMap;
