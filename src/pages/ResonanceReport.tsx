import { motion } from 'framer-motion';
import { Droplet, Sun, Play, Activity } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ZodiacEntry {
  sign: string;
  dateRange: string;
  cellSalt: string;
  crop: string;
  frequency: string;
  prescription: string;
}

const zodiacData: ZodiacEntry[] = [
  {
    sign: "Aries",
    dateRange: "Mar 21 – Apr 19",
    cellSalt: "Potassium Phosphate",
    crop: "Cayenne",
    frequency: "396Hz",
    prescription: "Listen to ignite action."
  },
  {
    sign: "Taurus",
    dateRange: "Apr 20 – May 20",
    cellSalt: "Sodium Sulphate",
    crop: "Chard",
    frequency: "417Hz",
    prescription: "Listen to clear the throat chakra."
  },
  {
    sign: "Gemini",
    dateRange: "May 21 – Jun 20",
    cellSalt: "Potassium Chloride",
    crop: "Carrots",
    frequency: "528Hz",
    prescription: "Listen to connect complex ideas."
  },
  {
    sign: "Cancer",
    dateRange: "Jun 21 – Jul 22",
    cellSalt: "Calcium Fluoride",
    crop: "Watermelon",
    frequency: "639Hz",
    prescription: "Listen for emotional protection."
  },
  {
    sign: "Leo",
    dateRange: "Jul 23 – Aug 22",
    cellSalt: "Magnesium Phosphate",
    crop: "Sunflowers",
    frequency: "741Hz",
    prescription: "Listen to relieve heart tension."
  },
  {
    sign: "Virgo",
    dateRange: "Aug 23 – Sep 22",
    cellSalt: "Potassium Sulphate",
    crop: "Endive",
    frequency: "852Hz",
    prescription: "Listen to aid digestion/analysis."
  },
  {
    sign: "Libra",
    dateRange: "Sep 23 – Oct 22",
    cellSalt: "Sodium Phosphate",
    crop: "Strawberry",
    frequency: "639Hz",
    prescription: "Listen to restore pH balance."
  },
  {
    sign: "Scorpio",
    dateRange: "Oct 23 – Nov 21",
    cellSalt: "Calcium Sulphate",
    crop: "Garlic",
    frequency: "396Hz",
    prescription: "Listen for regeneration."
  },
  {
    sign: "Sagittarius",
    dateRange: "Nov 22 – Dec 21",
    cellSalt: "Silica",
    crop: "Asparagus",
    frequency: "963Hz",
    prescription: "Listen to strengthen vision."
  },
  {
    sign: "Capricorn",
    dateRange: "Dec 22 – Jan 19",
    cellSalt: "Calcium Phosphate",
    crop: "Kale",
    frequency: "417Hz",
    prescription: "Listen to build discipline."
  },
  {
    sign: "Aquarius",
    dateRange: "Jan 20 – Feb 18",
    cellSalt: "Sodium Chloride",
    crop: "Orchids",
    frequency: "741Hz",
    prescription: "Listen to circulate ideas."
  },
  {
    sign: "Pisces",
    dateRange: "Feb 19 – Mar 20",
    cellSalt: "Iron Phosphate",
    crop: "Seaweed",
    frequency: "852Hz",
    prescription: "Listen to boost immunity."
  }
];

const ResonanceReport = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f4f1ea' }}>
      {/* Sticky Header */}
      <header 
        className="sticky top-0 z-50 px-4 py-6 border-b"
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

                {/* Section 3: Listener Rx */}
                <motion.button
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
    </div>
  );
};

export default ResonanceReport;
