import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Sun, Play, Pause, Activity, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ZodiacEntry {
  sign: string;
  dateRange: string;
  cellSalt: string;
  crop: string;
  frequency: string;
  prescription: string;
  trackTitle: string;
  sanskritName: string;
  englishPose: string;
  poseInstruction: string;
}

const zodiacData: ZodiacEntry[] = [
  {
    sign: "Aries",
    dateRange: "Mar 21 – Apr 19",
    cellSalt: "Potassium Phosphate",
    crop: "Cayenne",
    frequency: "396Hz",
    prescription: "Listen to ignite action.",
    trackTitle: "Track 01: The Spark",
    sanskritName: "Virabhadrasana I",
    englishPose: "Warrior I",
    poseInstruction: "Ground through the heel, lift the arms, and focus your gaze forward to channel the Aries fire."
  },
  {
    sign: "Taurus",
    dateRange: "Apr 20 – May 20",
    cellSalt: "Sodium Sulphate",
    crop: "Chard",
    frequency: "417Hz",
    prescription: "Listen to clear the throat chakra.",
    trackTitle: "Track 02: The Steward",
    sanskritName: "Setu Bandhasana",
    englishPose: "Bridge Pose",
    poseInstruction: "Lift the hips to open the throat chakra and release neck tension with Taurus stability."
  },
  {
    sign: "Gemini",
    dateRange: "May 21 – Jun 20",
    cellSalt: "Potassium Chloride",
    crop: "Carrots",
    frequency: "528Hz",
    prescription: "Listen to connect complex ideas.",
    trackTitle: "Track 03: The Twins",
    sanskritName: "Bhujangasana",
    englishPose: "Cobra Pose",
    poseInstruction: "Press into the palms and lift the chest to expand lung capacity and Gemini communication."
  },
  {
    sign: "Cancer",
    dateRange: "Jun 21 – Jul 22",
    cellSalt: "Calcium Fluoride",
    crop: "Watermelon",
    frequency: "639Hz",
    prescription: "Listen for emotional protection.",
    trackTitle: "Track 04: The Shell",
    sanskritName: "Balasana",
    englishPose: "Child's Pose",
    poseInstruction: "Curl inward to protect your soft center and nurture your Cancer intuition."
  },
  {
    sign: "Leo",
    dateRange: "Jul 23 – Aug 22",
    cellSalt: "Magnesium Phosphate",
    crop: "Sunflowers",
    frequency: "741Hz",
    prescription: "Listen to relieve heart tension.",
    trackTitle: "Track 05: The Crown",
    sanskritName: "Ustrasana",
    englishPose: "Camel Pose",
    poseInstruction: "Open your heart center wide to radiate Leo's solar power outward."
  },
  {
    sign: "Virgo",
    dateRange: "Aug 23 – Sep 22",
    cellSalt: "Potassium Sulphate",
    crop: "Endive",
    frequency: "852Hz",
    prescription: "Listen to aid digestion/analysis.",
    trackTitle: "Track 06: The Harvest",
    sanskritName: "Paschimottanasana",
    englishPose: "Seated Forward Bend",
    poseInstruction: "Fold forward to massage the digestive organs and refine Virgo's analytical clarity."
  },
  {
    sign: "Libra",
    dateRange: "Sep 23 – Oct 22",
    cellSalt: "Sodium Phosphate",
    crop: "Strawberry",
    frequency: "639Hz",
    prescription: "Listen to restore pH balance.",
    trackTitle: "Track 07: The Scale",
    sanskritName: "Vrksasana",
    englishPose: "Tree Pose",
    poseInstruction: "Find your center of gravity and cultivate Libra's perfect equilibrium."
  },
  {
    sign: "Scorpio",
    dateRange: "Oct 23 – Nov 21",
    cellSalt: "Calcium Sulphate",
    crop: "Garlic",
    frequency: "396Hz",
    prescription: "Listen for regeneration.",
    trackTitle: "Track 08: The Phoenix",
    sanskritName: "Malasana",
    englishPose: "Garland Pose",
    poseInstruction: "Squat deep to access the pelvic floor and Scorpio's transformative power."
  },
  {
    sign: "Sagittarius",
    dateRange: "Nov 22 – Dec 21",
    cellSalt: "Silica",
    crop: "Asparagus",
    frequency: "963Hz",
    prescription: "Listen to strengthen vision.",
    trackTitle: "Track 09: The Archer",
    sanskritName: "Dhanurasana",
    englishPose: "Bow Pose",
    poseInstruction: "Draw back like an arrow to expand Sagittarius's quest for higher truth."
  },
  {
    sign: "Capricorn",
    dateRange: "Dec 22 – Jan 19",
    cellSalt: "Calcium Phosphate",
    crop: "Kale",
    frequency: "417Hz",
    prescription: "Listen to build discipline.",
    trackTitle: "Track 10: The Summit",
    sanskritName: "Tadasana",
    englishPose: "Mountain Pose",
    poseInstruction: "Stand tall with unwavering Capricorn resolve—become the mountain."
  },
  {
    sign: "Aquarius",
    dateRange: "Jan 20 – Feb 18",
    cellSalt: "Sodium Chloride",
    crop: "Orchids",
    frequency: "741Hz",
    prescription: "Listen to circulate ideas.",
    trackTitle: "Track 11: The Current",
    sanskritName: "Matsyasana",
    englishPose: "Fish Pose",
    poseInstruction: "Open the throat and heart to let Aquarian innovation flow freely."
  },
  {
    sign: "Pisces",
    dateRange: "Feb 19 – Mar 20",
    cellSalt: "Iron Phosphate",
    crop: "Seaweed",
    frequency: "852Hz",
    prescription: "Listen to boost immunity.",
    trackTitle: "Track 12: The Deep",
    sanskritName: "Savasana",
    englishPose: "Corpse Pose",
    poseInstruction: "Surrender completely to merge with the infinite Piscean ocean."
  }
];

const ResonanceReport = () => {
  const [activePrescription, setActivePrescription] = useState<ZodiacEntry | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (entry: ZodiacEntry) => {
    setActivePrescription(entry);
    setIsPlaying(true);
  };

  const closePlayer = () => {
    setActivePrescription(null);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f4f1ea' }}>
      {/* Sticky Header */}
      <header 
        className="sticky top-0 z-40 px-4 py-6 border-b"
        style={{ 
          backgroundColor: '#f4f1ea',
          borderColor: '#d7ccc8'
        }}
      >
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Activity className="w-5 h-5" style={{ color: '#3e2723' }} />
            <h1 
              className="text-xl font-bold tracking-wide uppercase"
              style={{ color: '#3e2723' }}
            >
              Bio-Harmonic Resonance
            </h1>
            <Activity className="w-5 h-5" style={{ color: '#3e2723' }} />
          </div>
          <p 
            className="text-sm font-mono tracking-widest opacity-70"
            style={{ color: '#3e2723' }}
          >
            Your Mineral & Audio Prescription
          </p>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-6 max-w-md mx-auto space-y-4 pb-12">
          {zodiacData.map((entry, index) => (
            <motion.div
              key={entry.sign}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border overflow-hidden"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderColor: '#d7ccc8'
              }}
            >
              {/* Card Header - Zodiac Sign */}
              <div 
                className="px-4 py-3 border-b"
                style={{ 
                  backgroundColor: 'rgba(62, 39, 35, 0.05)',
                  borderColor: '#d7ccc8'
                }}
              >
                <h2 
                  className="text-lg font-bold tracking-wide"
                  style={{ color: '#3e2723' }}
                >
                  {entry.sign}
                </h2>
                <p 
                  className="text-xs font-mono opacity-60"
                  style={{ color: '#3e2723' }}
                >
                  {entry.dateRange}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Section 1: Mineral Anchor */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(62, 39, 35, 0.1)' }}
                  >
                    <Droplet className="w-4 h-4" style={{ color: '#3e2723' }} />
                  </div>
                  <div>
                    <p 
                      className="text-xs uppercase tracking-wider font-semibold opacity-50"
                      style={{ color: '#3e2723' }}
                    >
                      Mineral Anchor
                    </p>
                    <p 
                      className="text-sm font-medium"
                      style={{ color: '#3e2723' }}
                    >
                      {entry.cellSalt}
                    </p>
                  </div>
                </div>

                {/* Section 2: AgroMajic Crop */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(62, 39, 35, 0.1)' }}
                  >
                    <Sun className="w-4 h-4" style={{ color: '#3e2723' }} />
                  </div>
                  <div>
                    <p 
                      className="text-xs uppercase tracking-wider font-semibold opacity-50"
                      style={{ color: '#3e2723' }}
                    >
                      AgroMajic Crop
                    </p>
                    <p 
                      className="text-sm font-medium"
                      style={{ color: '#3e2723' }}
                    >
                      {entry.crop}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div 
                  className="border-t my-3"
                  style={{ borderColor: '#d7ccc8' }}
                />

                {/* Section 3: Listener Rx - Opens Modal */}
                <motion.button
                  onClick={() => handlePlay(entry)}
                  className="w-full p-3 rounded-lg border-2 border-dashed text-left transition-all duration-200"
                  style={{ 
                    borderColor: '#d7ccc8',
                    backgroundColor: 'rgba(255, 215, 0, 0.05)'
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                    borderColor: '#FFD700'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#FFD700' }}
                    >
                      <Play className="w-5 h-5 ml-0.5" style={{ color: '#3e2723' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs uppercase tracking-wider font-bold"
                          style={{ color: '#3e2723' }}
                        >
                          Listener Rx
                        </span>
                        <span 
                          className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                          style={{ 
                            backgroundColor: 'rgba(255, 215, 0, 0.3)',
                            color: '#3e2723'
                          }}
                        >
                          {entry.frequency}
                        </span>
                      </div>
                      <p 
                        className="text-sm mt-1 italic opacity-80"
                        style={{ color: '#3e2723' }}
                      >
                        "{entry.prescription}"
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* ===== THE YOGA MODAL (Now Playing / Movement Studio) ===== */}
      <AnimatePresence>
        {activePrescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(62, 39, 35, 0.92)', backdropFilter: 'blur(8px)' }}
            onClick={closePlayer}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative"
              style={{ 
                backgroundColor: '#fdfbf7',
                border: '2px solid #FFD700'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={closePlayer}
                className="absolute top-4 right-4 p-2 rounded-full z-10 transition-colors"
                style={{ backgroundColor: 'rgba(62, 39, 35, 0.1)' }}
              >
                <X className="w-5 h-5" style={{ color: '#3e2723' }} />
              </button>

              {/* Header: Track Info */}
              <div 
                className="p-6 text-center"
                style={{ backgroundColor: '#3e2723' }}
              >
                <p 
                  className="text-xs uppercase tracking-[0.25em] opacity-80"
                  style={{ color: '#FFD700' }}
                >
                  Now Vibrating
                </p>
                <h2 
                  className="text-xl font-bold mt-1"
                  style={{ color: '#FFD700' }}
                >
                  {activePrescription.trackTitle}
                </h2>
                <div className="flex justify-center items-center gap-2 mt-3">
                  <Activity className="w-4 h-4 animate-pulse" style={{ color: '#FFD700' }} />
                  <span 
                    className="text-sm font-mono"
                    style={{ color: '#FFD700' }}
                  >
                    {activePrescription.frequency}
                  </span>
                  <Activity className="w-4 h-4 animate-pulse" style={{ color: '#FFD700' }} />
                </div>

                {/* Waveform Visualizer */}
                <div className="flex items-end justify-center gap-1 mt-4 h-8">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full"
                      style={{ backgroundColor: '#FFD700' }}
                      animate={isPlaying ? {
                        height: [8, 16 + Math.random() * 16, 8],
                      } : { height: 8 }}
                      transition={{
                        duration: 0.4 + Math.random() * 0.3,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Body: The Yoga Pose */}
              <div className="p-8 text-center space-y-6">
                <div>
                  <p 
                    className="text-xs uppercase tracking-[0.25em] mb-4 opacity-60"
                    style={{ color: '#3e2723' }}
                  >
                    Prescribed Movement
                  </p>

                  {/* Visual Placeholder for the Pose */}
                  <motion.div 
                    className="w-28 h-28 rounded-full mx-auto flex items-center justify-center mb-5 border-2 border-dashed"
                    style={{ 
                      backgroundColor: '#efebe9',
                      borderColor: '#d7ccc8'
                    }}
                    animate={isPlaying ? { 
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(255, 215, 0, 0)',
                        '0 0 20px 5px rgba(255, 215, 0, 0.3)',
                        '0 0 0 0 rgba(255, 215, 0, 0)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-5xl">🧘‍♂️</span>
                  </motion.div>
                  
                  <h3 
                    className="text-3xl font-serif font-bold"
                    style={{ color: '#3e2723' }}
                  >
                    {activePrescription.sanskritName}
                  </h3>
                  <p 
                    className="text-lg italic font-serif mt-1"
                    style={{ color: '#5d4037' }}
                  >
                    "{activePrescription.englishPose}"
                  </p>
                </div>

                <div 
                  className="p-4 rounded-xl"
                  style={{ 
                    backgroundColor: '#f4f1ea',
                    border: '1px solid #d7ccc8'
                  }}
                >
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: '#5d4037' }}
                  >
                    <span className="font-bold">Instruction:</span> {activePrescription.poseInstruction}
                  </p>
                </div>
              </div>

              {/* Footer: Play Controls */}
              <div 
                className="p-6 flex justify-center"
                style={{ borderTop: '1px solid #d7ccc8' }}
              >
                <motion.button 
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: '#FFD700', color: '#3e2723' }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7" fill="#3e2723" />
                  ) : (
                    <Play className="w-7 h-7 ml-1" fill="#3e2723" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResonanceReport;
