import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrishaBlessingCard, ProfileStats } from '@/components/profile';
import { useAncestralProgress } from '@/hooks/useAncestralProgress';

// Map module names to Orisha types
const moduleToOrisha: Record<string, 'ogun' | 'babalu-aye' | 'shango' | 'oshun'> = {
  'root-protocol': 'ogun',
  'magnetic-earth': 'babalu-aye',
  'thunder-signal': 'shango',
  'sweet-alchemy': 'oshun',
};

const PharmerProfile = () => {
  const navigate = useNavigate();
  const {
    modules,
    user,
    isLoading,
    isModuleCompleted,
    getLessonsForModule,
    getModuleCompletionPercent,
    getOverallProgress,
    lessonProgress,
    fieldJournal,
  } = useAncestralProgress();

  // Calculate stats
  const completedModules = modules.filter(m => isModuleCompleted(m.id)).length;
  const totalLessonsCount = modules.reduce((acc, m) => acc + getLessonsForModule(m.id).length, 0);
  const completedLessonsCount = lessonProgress.length;
  const uploadsCount = fieldJournal.length;
  const certifiedCount = fieldJournal.filter(j => j.status === 'certified').length;
  const overallProgress = getOverallProgress();

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
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/ancestral-path')}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Path
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, hsl(280 50% 25%), hsl(250 50% 15%))',
              border: '2px solid hsl(280 60% 55%)',
            }}
            animate={{
              boxShadow: [
                '0 0 20px hsl(280 60% 55% / 0.3)',
                '0 0 40px hsl(280 60% 55% / 0.5)',
                '0 0 20px hsl(280 60% 55% / 0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <User className="w-10 h-10 text-foreground" />
          </motion.div>
          <div>
            <h1
              className="text-4xl mb-1"
              style={{
                fontFamily: "'Chewy', cursive",
              }}
            >
              Pharmer's Journal
            </h1>
            <p className="text-muted-foreground" style={{ fontFamily: "'Space Mono', monospace" }}>
              {user ? 'Track your journey through the ancestral path' : 'Demo Mode - Sign in to save progress'}
            </p>
          </div>
        </div>

        {/* Auth prompt if not logged in */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-4 rounded-2xl"
            style={{
              background: 'linear-gradient(145deg, hsl(350 50% 15%), hsl(350 40% 10%))',
              border: '2px solid hsl(350 75% 50%)',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p
                  className="text-lg mb-1"
                  style={{
                    fontFamily: "'Staatliches', sans-serif",
                    color: 'hsl(350 75% 50%)',
                    letterSpacing: '0.05em',
                  }}
                >
                  THE THRESHOLD AWAITS
                </p>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Sign in to save your progress and earn Orisha blessings
                </p>
              </div>
              <Button
                onClick={() => navigate('/auth')}
                className="gap-2"
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
      <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Stats Panel */}
        <div className="lg:col-span-1">
          <ProfileStats
            overallProgress={overallProgress}
            modulesCompleted={completedModules}
            totalModules={modules.length}
            lessonsCompleted={completedLessonsCount}
            totalLessons={totalLessonsCount}
            uploadsCount={uploadsCount}
            certifiedCount={certifiedCount}
          />
        </div>

        {/* Orisha Blessings */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2
              className="text-2xl mb-4"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                letterSpacing: '0.1em',
              }}
            >
              ORISHA BLESSINGS
            </h2>
            <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: "'Space Mono', monospace" }}>
              Complete each level to earn the blessing of its guardian Orisha
            </p>
          </motion.div>

          <div className="space-y-4">
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
          </div>

          {/* Journey Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-6 rounded-3xl text-center"
            style={{
              background: 'linear-gradient(145deg, hsl(250 50% 12%), hsl(280 50% 10%))',
              border: '2px solid hsl(280 50% 25%)',
            }}
          >
            <p
              className="text-lg italic mb-2"
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
        </div>
      </div>
    </div>
  );
};

export default PharmerProfile;
