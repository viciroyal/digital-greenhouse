import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Leaf, Droplets, Sun, Moon } from 'lucide-react';

interface MasterSoilMixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * THE MASTER SOIL MIX - Easter Egg Reward
 * 
 * A secret recipe revealed to those who know to seek it.
 * Unlocked by clicking the logo 5 times.
 */
const MasterSoilMixModal = ({ isOpen, onClose }: MasterSoilMixModalProps) => {
  const ingredients = [
    { icon: Leaf, name: "Forest Leaf Mold", ratio: "40%", note: "The memory of the canopy" },
    { icon: Droplets, name: "Worm Castings", ratio: "25%", note: "The alchemy of decomposition" },
    { icon: Sun, name: "Biochar", ratio: "15%", note: "Ancient carbon, activated" },
    { icon: Moon, name: "Rock Dust (Azomite)", ratio: "10%", note: "Mineral memory of mountains" },
    { icon: Sparkles, name: "Kelp Meal", ratio: "5%", note: "Ocean frequency transfer" },
    { icon: Leaf, name: "Neem Cake", ratio: "5%", note: "Protection and balance" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Mystical backdrop */}
          <motion.div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, hsl(280 50% 15%), hsl(250 40% 5%))',
            }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${2 + Math.random() * 4}px`,
                  height: `${2 + Math.random() * 4}px`,
                  background: `hsl(${40 + Math.random() * 20} 80% ${50 + Math.random() * 20}%)`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* The Sacred Scroll */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{
              background: `linear-gradient(180deg, 
                hsl(20 40% 12%) 0%, 
                hsl(25 35% 10%) 50%,
                hsl(20 40% 12%) 100%
              )`,
              border: '3px solid hsl(51 80% 45%)',
              borderRadius: '16px',
              boxShadow: `
                0 0 60px hsl(51 80% 40% / 0.3),
                0 20px 60px rgba(0,0,0,0.6),
                inset 0 0 100px hsl(51 50% 20% / 0.1)
              `,
            }}
            initial={{ scale: 0.8, y: 50, rotateY: -15 }}
            animate={{ scale: 1, y: 0, rotateY: 0 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Gold corner decorations */}
            <div 
              className="absolute top-0 left-0 w-12 h-12"
              style={{
                borderTop: '3px solid hsl(51 80% 50%)',
                borderLeft: '3px solid hsl(51 80% 50%)',
                borderTopLeftRadius: '12px',
              }}
            />
            <div 
              className="absolute top-0 right-0 w-12 h-12"
              style={{
                borderTop: '3px solid hsl(51 80% 50%)',
                borderRight: '3px solid hsl(51 80% 50%)',
                borderTopRightRadius: '12px',
              }}
            />
            <div 
              className="absolute bottom-0 left-0 w-12 h-12"
              style={{
                borderBottom: '3px solid hsl(51 80% 50%)',
                borderLeft: '3px solid hsl(51 80% 50%)',
                borderBottomLeftRadius: '12px',
              }}
            />
            <div 
              className="absolute bottom-0 right-0 w-12 h-12"
              style={{
                borderBottom: '3px solid hsl(51 80% 50%)',
                borderRight: '3px solid hsl(51 80% 50%)',
                borderBottomRightRadius: '12px',
              }}
            />

            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 p-2 rounded-full z-10"
              style={{
                background: 'hsl(20 30% 15%)',
                border: '1px solid hsl(51 60% 40%)',
              }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
            >
              <X className="w-5 h-5" style={{ color: 'hsl(51 80% 60%)' }} />
            </motion.button>

            {/* Content */}
            <div className="relative p-8 md:p-12">
              {/* Header */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Sparkles 
                    className="w-12 h-12 mx-auto mb-4" 
                    style={{ color: 'hsl(51 90% 55%)' }} 
                  />
                </motion.div>
                <h1 
                  className="text-3xl md:text-4xl tracking-[0.1em] mb-2"
                  style={{
                    fontFamily: "'Staatliches', serif",
                    color: 'hsl(51 100% 55%)',
                    textShadow: '0 0 30px hsl(51 80% 40% / 0.5)',
                  }}
                >
                  THE MASTER SOIL MIX
                </h1>
                <p 
                  className="text-sm font-mono tracking-wider"
                  style={{ color: 'hsl(40 50% 60%)' }}
                >
                  ANCESTRAL FORMULA · HIGH BRIX PROTOCOL
                </p>
              </motion.div>

              {/* Sacred intro text */}
              <motion.p
                className="text-center mb-10 italic leading-relaxed max-w-md mx-auto"
                style={{ 
                  color: 'hsl(40 40% 70%)',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '14px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                "The soil is not dirt. It is the living memory of every being 
                that has ever returned to it. This formula awakens that memory."
              </motion.p>

              {/* Ingredients Grid */}
              <div className="space-y-4 mb-10">
                {ingredients.map((ingredient, index) => (
                  <motion.div
                    key={ingredient.name}
                    className="flex items-center gap-4 p-4 rounded-lg"
                    style={{
                      background: 'hsl(25 30% 10% / 0.5)',
                      border: '1px solid hsl(40 40% 25%)',
                    }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, hsl(140 40% 25%), hsl(140 30% 15%))',
                        border: '1px solid hsl(140 50% 35%)',
                      }}
                    >
                      <ingredient.icon 
                        className="w-6 h-6" 
                        style={{ color: 'hsl(140 60% 55%)' }} 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 
                          className="font-bold"
                          style={{ color: 'hsl(40 60% 80%)' }}
                        >
                          {ingredient.name}
                        </h3>
                        <span 
                          className="font-mono text-lg"
                          style={{ color: 'hsl(51 90% 55%)' }}
                        >
                          {ingredient.ratio}
                        </span>
                      </div>
                      <p 
                        className="text-sm italic mt-1"
                        style={{ color: 'hsl(40 30% 55%)' }}
                      >
                        {ingredient.note}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Sacred instructions */}
              <motion.div
                className="p-6 rounded-xl text-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(280 40% 15% / 0.5), hsl(250 40% 12% / 0.5))',
                  border: '1px solid hsl(280 50% 30%)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <h3 
                  className="text-lg mb-3 tracking-wider"
                  style={{
                    fontFamily: "'Staatliches', serif",
                    color: 'hsl(280 60% 70%)',
                  }}
                >
                  THE ACTIVATION PROTOCOL
                </h3>
                <ol 
                  className="text-left text-sm space-y-2 max-w-md mx-auto"
                  style={{ 
                    color: 'hsl(280 30% 70%)',
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  <li>1. Mix ingredients under a waxing moon</li>
                  <li>2. Moisten with compost tea (aerated 24hrs)</li>
                  <li>3. Cover and let cook for 14 days</li>
                  <li>4. Turn twice, speak gratitude once</li>
                  <li>5. Administer when soil temp reaches 65°F</li>
                </ol>
              </motion.div>

              {/* Footer seal */}
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <div 
                  className="inline-block px-6 py-2 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, hsl(51 60% 25%), hsl(51 50% 18%))',
                    border: '1px solid hsl(51 70% 40%)',
                  }}
                >
                  <span 
                    className="text-xs font-mono tracking-[0.2em]"
                    style={{ color: 'hsl(51 80% 70%)' }}
                  >
                    ◈ PHARMBOI CERTIFIED ◈
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MasterSoilMixModal;
