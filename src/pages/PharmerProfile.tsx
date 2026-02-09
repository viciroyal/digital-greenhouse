import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrishaBlessingCard, GreenCornCeremony, StewardDashboard } from '@/components/profile';
import { SovereigntyFooter } from '@/components/almanac';
import { useAncestralProgress } from '@/hooks/useAncestralProgress';

// Map module names to Orisha types
const moduleToOrisha: Record<string, 'ogun' | 'babalu-aye' | 'shango' | 'oshun'> = {
  'root-protocol': 'ogun',
  'magnetic-earth': 'babalu-aye',
  'thunder-signal': 'shango',
  'sweet-alchemy': 'oshun',
};

// Determine user title based on progress
const getUserTitle = (overallProgress: number) => {
  if (overallProgress >= 100) return 'Master Steward';
  if (overallProgress >= 75) return 'Grove Keeper';
  if (overallProgress >= 50) return 'Root Walker';
  if (overallProgress >= 25) return 'Seed Tender';
  return 'Seedling';
};

const PharmerProfile = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showBlessings, setShowBlessings] = useState(false);
  
  const {
    modules,
    user,
    isLoading,
    isModuleCompleted,
    getLessonsForModule,
    getModuleCompletionPercent,
    getOverallProgress,
    lessonProgress,
    refreshData,
  } = useAncestralProgress();

  // Handle reset from Green Corn Ceremony
  const handleSeasonReset = useCallback(() => {
    if (refreshData) {
      refreshData();
    }
    setRefreshKey(prev => prev + 1);
  }, [refreshData]);

  // Handle Farm Team mode selection
  const handleModeSelect = (mode: string) => {
    if (mode === 'spirit') {
      // Navigate to Journal view
      navigate('/ancestral-path');
    } else {
      // Navigate to Almanac with mode filter (future feature)
      navigate('/ancestral-path');
    }
  };

  // Check if user has Master Steward badge
  const hasMasterStewardBadge = modules.length >= 4 && 
    modules.filter(m => m.order_index <= 4).every(m => isModuleCompleted(m.id));

  const overallProgress = getOverallProgress();
  const userTitle = getUserTitle(overallProgress);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/ancestral-path')}
          className="mb-4 text-muted-foreground hover:text-foreground text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Path
        </Button>

        {/* Page Title */}
        <div className="text-center mb-6">
          <h1
            className="text-3xl tracking-wider"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(40 60% 70%)',
              textShadow: '0 0 30px hsl(40 50% 40% / 0.4)',
            }}
          >
            STEWARD'S DASHBOARD
          </h1>
          <p
            className="text-sm font-mono mt-1"
            style={{ color: 'hsl(0 0% 50%)' }}
          >
            Your farm data at a glance
          </p>
        </div>

        {/* Auth prompt if not logged in */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 p-4 rounded-xl"
            style={{
              background: 'linear-gradient(145deg, hsl(350 50% 15%), hsl(350 40% 10%))',
              border: '2px solid hsl(350 75% 50%)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p
                  className="text-base mb-1"
                  style={{
                    fontFamily: "'Staatliches', sans-serif",
                    color: 'hsl(350 75% 50%)',
                    letterSpacing: '0.05em',
                  }}
                >
                  THE THRESHOLD AWAITS
                </p>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Sign in to save your progress and sync across devices
                </p>
              </div>
              <Button
                onClick={() => navigate('/auth')}
                className="gap-2 w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(145deg, hsl(350 75% 50%), hsl(350 75% 35%))',
                  border: '2px solid hsl(350 75% 60%)',
                }}
              >
                <LogIn className="w-4 h-4" />
                Enter
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto space-y-6">
        {/* Steward Dashboard (new dynamic component) */}
        <StewardDashboard
          userName="Vincent McKoy"
          userTitle={userTitle}
          onModeSelect={handleModeSelect}
        />

        {/* Orisha Blessings (Collapsible) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className="w-full flex items-center justify-between p-4 rounded-xl"
            style={{
              background: showBlessings ? 'hsl(280 25% 15%)' : 'hsl(0 0% 8%)',
              border: `1px solid ${showBlessings ? 'hsl(280 50% 40%)' : 'hsl(0 0% 20%)'}`,
            }}
            onClick={() => setShowBlessings(!showBlessings)}
          >
            <div>
              <h2
                className="text-lg tracking-wider"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(280 60% 70%)',
                }}
              >
                ORISHA BLESSINGS
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                Complete levels to earn guardian blessings
              </p>
            </div>
            {showBlessings ? (
              <ChevronUp className="w-5 h-5" style={{ color: 'hsl(280 50% 60%)' }} />
            ) : (
              <ChevronDown className="w-5 h-5" style={{ color: 'hsl(0 0% 50%)' }} />
            )}
          </button>

          {showBlessings && (
            <motion.div
              className="space-y-3 mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {modules.map((module, index) => {
                const orisha = moduleToOrisha[module.name] || 'ogun';
                const moduleLessons = getLessonsForModule(module.id);
                const completionPercent = getModuleCompletionPercent(module.id);
                const isCompleted = isModuleCompleted(module.id);
                const lessonsCompleted = moduleLessons.filter(l => 
                  lessonProgress.some(p => p.lesson_id === l.id)
                ).length;

                return (
                  <OrishaBlessingCard
                    key={module.id}
                    orisha={orisha}
                    level={module.order_index}
                    isEarned={isCompleted}
                    completionPercent={completionPercent}
                    lessonsCompleted={lessonsCompleted}
                    totalLessons={moduleLessons.length}
                    index={index}
                  />
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Journey Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl text-center"
          style={{
            background: 'linear-gradient(145deg, hsl(250 50% 12%), hsl(280 50% 10%))',
            border: '2px solid hsl(280 50% 25%)',
          }}
        >
          <p
            className="text-sm italic mb-2"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: 'hsl(280 60% 70%)',
            }}
          >
            "From Seedling to Master Steward, the soil holds the memory of your journey."
          </p>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Space Mono', monospace" }}>
            — The Pharmer's Creed
          </p>
        </motion.div>

        {/* Green Corn Ceremony - Only show for logged in users */}
        {user && (
          <GreenCornCeremony
            userId={user.id}
            hasMasterStewardBadge={hasMasterStewardBadge}
            onReset={handleSeasonReset}
          />
        )}

        {/* Sovereignty Footer */}
        <SovereigntyFooter />
      </div>
    </div>
  );
};

export default PharmerProfile;
