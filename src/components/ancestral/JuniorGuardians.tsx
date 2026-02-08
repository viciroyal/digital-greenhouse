import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { guardianCharacters, GuardianCharacter } from './GuardianCharacters';
import MissionCard from './MissionCard';

interface JuniorGuardiansProps {
  onExitKidsMode: () => void;
  onOpenAlmanac: (chapterNumber: number) => void;
}

/**
 * JUNIOR GUARDIANS - Kids Mode
 * 
 * A playful, simplified version of the Almanac featuring
 * mascot-guided scavenger hunt missions for young farmers.
 */
const JuniorGuardians = ({ onExitKidsMode, onOpenAlmanac }: JuniorGuardiansProps) => {
  const [selectedGuardian, setSelectedGuardian] = useState<GuardianCharacter | null>(null);
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());

  const handleCompleteMission = (missionId: string) => {
    setCompletedMissions(prev => new Set([...prev, missionId]));
  };

  const getGuardianProgress = (guardian: GuardianCharacter): number => {
    const completed = guardian.missions.filter(m => completedMissions.has(m.id)).length;
    return Math.round((completed / guardian.missions.length) * 100);
  };

  const getTotalBadges = (): number => {
    return completedMissions.size;
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        background: `linear-gradient(180deg,
          hsl(195 70% 85%) 0%,
          hsl(120 50% 85%) 30%,
          hsl(45 80% 85%) 60%,
          hsl(35 60% 80%) 100%
        )`,
      }}
    >
      {/* Floating Clouds Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${-20 + i * 25}%`,
              top: `${5 + i * 8}%`,
            }}
            animate={{
              x: [0, 100, 0],
            }}
            transition={{
              duration: 30 + i * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg width="200" height="80" viewBox="0 0 200 80">
              <ellipse cx="60" cy="50" rx="40" ry="25" fill="white" opacity="0.8" />
              <ellipse cx="100" cy="45" rx="50" ry="30" fill="white" opacity="0.9" />
              <ellipse cx="150" cy="50" rx="35" ry="22" fill="white" opacity="0.8" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 pt-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            className="flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              background: 'white',
              boxShadow: '0 4px 15px hsl(0 0% 0% / 0.1)',
            }}
            onClick={onExitKidsMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(195 70% 45%)' }} />
            <span 
              className="text-sm font-bold"
              style={{ 
                fontFamily: "'Chewy', cursive",
                color: 'hsl(195 70% 45%)',
              }}
            >
              Exit Kids Mode
            </span>
          </motion.button>

          {/* Title */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-block mb-2"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-5xl">🌱</span>
            </motion.div>
            <h1 
              className="text-4xl md:text-5xl mb-2"
              style={{
                fontFamily: "'Chewy', cursive",
                color: 'hsl(120 60% 35%)',
                textShadow: '3px 3px 0 white, 4px 4px 0 hsl(120 40% 70%)',
              }}
            >
              Junior Guardians!
            </h1>
            <p 
              className="text-lg"
              style={{
                fontFamily: "'Chewy', cursive",
                color: 'hsl(35 60% 40%)',
              }}
            >
              Help our magical friends take care of the garden! 🌻
            </p>

            {/* Badge Counter */}
            <motion.div 
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, hsl(45 100% 55%), hsl(35 90% 50%))',
                boxShadow: '0 4px 20px hsl(45 100% 50% / 0.4)',
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-6 h-6 text-white" />
              <span 
                className="text-xl text-white font-bold"
                style={{ fontFamily: "'Chewy', cursive" }}
              >
                {getTotalBadges()} Badges Earned!
              </span>
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedGuardian ? (
              /* Character Selection Grid */
              <motion.div
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <p 
                  className="text-center text-xl mb-6"
                  style={{
                    fontFamily: "'Chewy', cursive",
                    color: 'hsl(35 50% 35%)',
                  }}
                >
                  Choose your guide! 👇
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {guardianCharacters.map((guardian, index) => {
                    const GuardianIcon = guardian.icon;
                    const progress = getGuardianProgress(guardian);
                    
                    return (
                      <motion.button
                        key={guardian.id}
                        className="relative p-4 rounded-3xl text-center"
                        style={{
                          background: 'white',
                          border: `4px solid ${guardian.color}`,
                          boxShadow: `0 8px 25px ${guardian.color}30`,
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedGuardian(guardian)}
                      >
                        {/* Progress Ring */}
                        {progress > 0 && (
                          <div 
                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              background: guardian.color,
                              color: 'white',
                              fontFamily: "'Chewy', cursive",
                            }}
                          >
                            {progress}%
                          </div>
                        )}

                        {/* Character Icon */}
                        <div className="w-20 h-20 mx-auto mb-2">
                          <GuardianIcon className="w-full h-full" />
                        </div>

                        {/* Name */}
                        <h3 
                          className="text-xl mb-1"
                          style={{
                            fontFamily: "'Chewy', cursive",
                            color: guardian.color,
                          }}
                        >
                          {guardian.name}
                        </h3>
                        <p 
                          className="text-sm"
                          style={{
                            fontFamily: "'Chewy', cursive",
                            color: 'hsl(0 0% 50%)',
                          }}
                        >
                          {guardian.title}
                        </p>

                        {/* Mission Title */}
                        <div 
                          className="mt-3 px-3 py-2 rounded-xl"
                          style={{
                            background: `${guardian.color}15`,
                          }}
                        >
                          <p 
                            className="text-xs"
                            style={{
                              fontFamily: "'Chewy', cursive",
                              color: guardian.color,
                            }}
                          >
                            {guardian.missionTitle}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* Guardian Mission View */
              <motion.div
                key="missions"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
              >
                {/* Guardian Header */}
                <motion.div 
                  className="text-center mb-6 p-6 rounded-3xl"
                  style={{
                    background: 'white',
                    border: `4px solid ${selectedGuardian.color}`,
                    boxShadow: `0 8px 30px ${selectedGuardian.color}30`,
                  }}
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                >
                  <button
                    className="flex items-center gap-2 text-sm mb-4 mx-auto"
                    style={{ color: selectedGuardian.color }}
                    onClick={() => setSelectedGuardian(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span style={{ fontFamily: "'Chewy', cursive" }}>
                      Back to Friends
                    </span>
                  </button>

                  <div className="w-24 h-24 mx-auto mb-3">
                    <selectedGuardian.icon className="w-full h-full" />
                  </div>
                  
                  <h2 
                    className="text-3xl mb-1"
                    style={{
                      fontFamily: "'Chewy', cursive",
                      color: selectedGuardian.color,
                    }}
                  >
                    {selectedGuardian.name} {selectedGuardian.title}
                  </h2>
                  
                  <p 
                    className="text-lg mb-3"
                    style={{
                      fontFamily: "'Chewy', cursive",
                      color: 'hsl(0 0% 40%)',
                    }}
                  >
                    {selectedGuardian.description}
                  </p>

                  <motion.p 
                    className="text-xl italic"
                    style={{
                      fontFamily: "'Chewy', cursive",
                      color: selectedGuardian.color,
                    }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {selectedGuardian.catchphrase}
                  </motion.p>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div 
                      className="h-4 rounded-full overflow-hidden"
                      style={{ background: 'hsl(0 0% 90%)' }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: selectedGuardian.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${getGuardianProgress(selectedGuardian)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p 
                      className="text-sm mt-1"
                      style={{ 
                        fontFamily: "'Chewy', cursive",
                        color: 'hsl(0 0% 50%)',
                      }}
                    >
                      {selectedGuardian.missions.filter(m => completedMissions.has(m.id)).length} of {selectedGuardian.missions.length} quests complete!
                    </p>
                  </div>
                </motion.div>

                {/* Mission Title */}
                <motion.h3 
                  className="text-2xl text-center mb-4"
                  style={{
                    fontFamily: "'Chewy', cursive",
                    color: 'hsl(35 50% 35%)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  🎯 {selectedGuardian.missionTitle}
                </motion.h3>

                {/* Mission Cards */}
                <div className="space-y-4 mb-6">
                  {selectedGuardian.missions.map((mission, index) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      guardian={selectedGuardian}
                      isCompleted={completedMissions.has(mission.id)}
                      onComplete={handleCompleteMission}
                      index={index}
                    />
                  ))}
                </div>

                {/* Link to Adult Almanac */}
                <motion.div 
                  className="p-4 rounded-2xl text-center"
                  style={{
                    background: 'hsl(0 0% 100% / 0.7)',
                    border: '2px dashed hsl(0 0% 70%)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p 
                    className="text-sm mb-2"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      color: 'hsl(0 0% 50%)',
                    }}
                  >
                    FOR THE GUIDE (ADULT):
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    style={{
                      borderColor: 'hsl(40 50% 50%)',
                      color: 'hsl(40 50% 40%)',
                    }}
                    onClick={() => onOpenAlmanac(selectedGuardian.zone)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span style={{ fontFamily: "'Space Mono', monospace" }}>
                      Open: {selectedGuardian.adultTopic}
                    </span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grass Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-16 pointer-events-none">
        <svg 
          viewBox="0 0 1200 80" 
          preserveAspectRatio="none" 
          className="w-full h-full"
        >
          <path 
            d="M0 80 L0 40 Q100 20 200 40 Q300 60 400 40 Q500 20 600 40 Q700 60 800 40 Q900 20 1000 40 Q1100 60 1200 40 L1200 80 Z" 
            fill="hsl(120 50% 40%)" 
          />
          <path 
            d="M0 80 L0 50 Q100 30 200 50 Q300 70 400 50 Q500 30 600 50 Q700 70 800 50 Q900 30 1000 50 Q1100 70 1200 50 L1200 80 Z" 
            fill="hsl(120 60% 35%)" 
          />
        </svg>
      </div>
    </div>
  );
};

export default JuniorGuardians;
