import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Heart, 
  Sparkles, 
  Send,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Farm Team Characters
const farmTeam = [
  { id: 'spirit', name: 'Spirit', emoji: '🕊️', title: 'The Dove', gift: 'Peace & Stillness' },
  { id: 'sunny', name: 'Sunny', emoji: '☀️', title: 'The Spark', gift: 'Energy & Warmth' },
  { id: 'rocky', name: 'Rocky', emoji: '🪨', title: 'The Builder', gift: 'Structure & Strength' },
  { id: 'river', name: 'River', emoji: '💧', title: 'The Rower', gift: 'Flow & Adaptation' },
  { id: 'lovey', name: 'Lovey', emoji: '🐉', title: 'The Dragon', gift: 'Courage & Fire' },
  { id: 'starry', name: 'Starry', emoji: '⭐', title: 'The Singer', gift: 'Rhythm & Music' },
  { id: 'seer', name: 'Seer', emoji: '🦉', title: 'The Owl', gift: 'Wisdom & Vision' },
];

interface DailyReflectionCardProps {
  onSubmit?: (reflection: {
    observation: string;
    helper: string | null;
    gratitude: string;
  }) => void;
}

/**
 * DAILY REFLECTION CARD
 * 
 * A warm, beginner-friendly journaling experience.
 * Uses "The Garden Guardian" voice — encouraging and simple.
 */
const DailyReflectionCard = ({ onSubmit }: DailyReflectionCardProps) => {
  const [observation, setObservation] = useState('');
  const [selectedHelper, setSelectedHelper] = useState<string | null>(null);
  const [gratitude, setGratitude] = useState('');
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleSubmit = () => {
    if (observation.trim()) {
      onSubmit?.({
        observation: observation.trim(),
        helper: selectedHelper,
        gratitude: gratitude.trim(),
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setObservation('');
        setSelectedHelper(null);
        setGratitude('');
      }, 3000);
    }
  };

  const selectedHelperData = farmTeam.find(h => h.id === selectedHelper);

  return (
    <motion.div
      className="w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, hsl(140 25% 12%), hsl(140 20% 8%))',
          border: '1px solid hsl(140 40% 25%)',
          boxShadow: '0 0 40px hsl(140 40% 15% / 0.3)',
        }}
      >
        {/* Header */}
        <div
          className="p-5 text-center"
          style={{
            background: 'linear-gradient(180deg, hsl(140 30% 18%), hsl(140 25% 12%))',
            borderBottom: '1px solid hsl(140 30% 20%)',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sun className="w-5 h-5" style={{ color: 'hsl(45 90% 60%)' }} />
            <span
              className="text-sm font-mono tracking-wider"
              style={{ color: 'hsl(45 70% 65%)' }}
            >
              {today.toUpperCase()}
            </span>
          </div>
          <h2
            className="text-2xl tracking-wider"
            style={{
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(140 50% 65%)',
              textShadow: '0 0 20px hsl(140 50% 40% / 0.4)',
            }}
          >
            DAILY REFLECTION
          </h2>
          <p
            className="text-sm mt-1 italic"
            style={{ color: 'hsl(140 30% 55%)' }}
          >
            "Listen when the soil whispers..."
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              className="p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6 }}
              >
                🌱
              </motion.div>
              <h3
                className="text-xl mb-2"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(140 60% 60%)',
                }}
              >
                REFLECTION RECORDED
              </h3>
              <p
                className="text-sm font-mono"
                style={{ color: 'hsl(140 40% 55%)' }}
              >
                The soil remembers.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              className="p-5 space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Observation Prompt */}
              <div>
                <label
                  className="flex items-center gap-2 text-sm font-mono tracking-wider mb-3"
                  style={{ color: 'hsl(40 60% 65%)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  WHAT SONG IS THE SOIL SINGING TODAY?
                </label>
                <Textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="I noticed the leaves looked a little droopy this morning, but after the rain they perked right up..."
                  rows={3}
                  className="resize-none font-mono text-sm"
                  style={{
                    background: 'hsl(0 0% 8%)',
                    border: '1px solid hsl(140 30% 25%)',
                    color: 'hsl(40 50% 75%)',
                  }}
                />
                <p
                  className="text-xs mt-2 italic"
                  style={{ color: 'hsl(0 0% 45%)' }}
                >
                  Tip: What did you see, smell, or feel in the garden today?
                </p>
              </div>

              {/* Farm Team Helper */}
              <div>
                <button
                  className="w-full flex items-center justify-between p-3 rounded-lg transition-all"
                  style={{
                    background: selectedHelper ? `hsl(280 30% 15%)` : 'hsl(0 0% 10%)',
                    border: `1px solid ${selectedHelper ? 'hsl(280 50% 45%)' : 'hsl(0 0% 20%)'}`,
                  }}
                  onClick={() => setIsHelperOpen(!isHelperOpen)}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" style={{ color: 'hsl(330 60% 60%)' }} />
                    <span
                      className="text-sm font-mono tracking-wider"
                      style={{ color: 'hsl(330 50% 70%)' }}
                    >
                      WHICH FARM TEAM MEMBER HELPED YOU?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedHelperData && (
                      <span className="text-lg">{selectedHelperData.emoji}</span>
                    )}
                    <ChevronDown
                      className="w-4 h-4 transition-transform"
                      style={{
                        color: 'hsl(0 0% 50%)',
                        transform: isHelperOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isHelperOpen && (
                    <motion.div
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {farmTeam.map((helper) => (
                        <motion.button
                          key={helper.id}
                          className="flex flex-col items-center p-3 rounded-lg transition-all"
                          style={{
                            background: selectedHelper === helper.id 
                              ? 'hsl(280 35% 20%)' 
                              : 'hsl(0 0% 10%)',
                            border: `2px solid ${selectedHelper === helper.id 
                              ? 'hsl(280 60% 55%)' 
                              : 'hsl(0 0% 20%)'}`,
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedHelper(helper.id);
                            setIsHelperOpen(false);
                          }}
                        >
                          <span className="text-2xl mb-1">{helper.emoji}</span>
                          <span
                            className="text-[10px] font-mono tracking-wider"
                            style={{ color: 'hsl(280 50% 70%)' }}
                          >
                            {helper.name}
                          </span>
                          <span
                            className="text-[9px]"
                            style={{ color: 'hsl(0 0% 50%)' }}
                          >
                            {helper.title}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedHelperData && !isHelperOpen && (
                  <motion.p
                    className="text-xs mt-2 italic"
                    style={{ color: 'hsl(280 40% 60%)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {selectedHelperData.name} brings the gift of {selectedHelperData.gift}.
                  </motion.p>
                )}
              </div>

              {/* Gratitude (Optional) */}
              <div>
                <label
                  className="flex items-center gap-2 text-sm font-mono tracking-wider mb-2"
                  style={{ color: 'hsl(51 60% 60%)' }}
                >
                  <span>🙏</span>
                  ONE THING I'M GRATEFUL FOR (optional)
                </label>
                <Textarea
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  placeholder="The warm sun on my back..."
                  rows={2}
                  className="resize-none font-mono text-sm"
                  style={{
                    background: 'hsl(0 0% 8%)',
                    border: '1px solid hsl(51 30% 25%)',
                    color: 'hsl(51 50% 75%)',
                  }}
                />
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={!observation.trim()}
                className="w-full h-12 font-mono tracking-wider"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  background: observation.trim()
                    ? 'linear-gradient(135deg, hsl(140 50% 35%), hsl(160 45% 30%))'
                    : 'hsl(0 0% 15%)',
                  border: `2px solid ${observation.trim() ? 'hsl(140 60% 50%)' : 'hsl(0 0% 25%)'}`,
                  color: observation.trim() ? 'white' : 'hsl(0 0% 40%)',
                  boxShadow: observation.trim() ? '0 0 20px hsl(140 50% 35% / 0.3)' : 'none',
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                RECORD REFLECTION
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DailyReflectionCard;
