import { motion } from 'framer-motion';
import { Sparkles, Leaf, Droplets, Sun, Moon } from 'lucide-react';
import GlassModal, { 
  GlassModalHeader, 
  GoldCornerAccents, 
  FloatingParticles 
} from '@/components/ui/GlassModal';

interface MasterSoilMixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * THE MASTER SOIL MIX - Easter Egg Reward
 * 
 * A secret recipe revealed to those who know to seek it.
 * Unlocked by clicking the logo 5 times.
 * 
 * Refactored to use unified GlassModal system.
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
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      variant="soil"
      size="xl"
      closeVariant="gold"
      className="relative"
    >
      {/* Floating Particles */}
      <FloatingParticles count={30} color="hsl(51 80% 55%)" />
      
      {/* Gold Corner Accents */}
      <GoldCornerAccents />

      {/* Header */}
      <GlassModalHeader
        icon={
          <Sparkles 
            className="w-12 h-12" 
            style={{ color: 'hsl(51 90% 55%)' }} 
          />
        }
        title="THE MASTER SOIL MIX"
        subtitle="ANCESTRAL FORMULA · HIGH BRIX PROTOCOL"
        accentColor="hsl(51 100% 55%)"
      />

      {/* Sacred intro text */}
      <motion.p
        className="text-center my-8 italic leading-relaxed max-w-md mx-auto"
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
    </GlassModal>
  );
};

export default MasterSoilMixModal;
