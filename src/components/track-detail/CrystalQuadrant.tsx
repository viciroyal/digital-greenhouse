import { motion } from 'framer-motion';
import { useState } from 'react';
import type { TrackData } from '@/data/trackData';
import { CrystalGemIcon } from './GemstoneIcons';

interface CrystalQuadrantProps {
  track: TrackData;
}

// Crystal images mapped to crystal names
const crystalImages: Record<string, string> = {
  'Hematite': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Hematite.jpg/440px-Hematite.jpg',
  'Carnelian': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Carnelian_%28Brazil%29.jpg/440px-Carnelian_%28Brazil%29.jpg',
  'Citrine': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Citrine-sample.jpg/440px-Citrine-sample.jpg',
  "Tiger's Eye": 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Tiger%27s_Eye.jpg/440px-Tiger%27s_Eye.jpg',
  'Malachite': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Malachite_%28DR_Congo%29_1.jpg/440px-Malachite_%28DR_Congo%29_1.jpg',
  'Rose Quartz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Rose_quartz_crystal.jpg/440px-Rose_quartz_crystal.jpg',
  'Lapis Lazuli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Lapis_lazuli_block.jpg/440px-Lapis_lazuli_block.jpg',
  'Turquoise': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Turquoise_with_quartz.jpg/440px-Turquoise_with_quartz.jpg',
  'Amethyst': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Amethyst_2.jpg/440px-Amethyst_2.jpg',
  'Fluorite': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Fluorite_with_Iron_Pyrite.jpg/440px-Fluorite_with_Iron_Pyrite.jpg',
  'Clear Quartz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Quartz%2C_Tibet.jpg/440px-Quartz%2C_Tibet.jpg',
  'Selenite': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Selenite_-_AMNH_-_DSC06367.JPG/440px-Selenite_-_AMNH_-_DSC06367.JPG',
};

// Crystal properties/meanings
const crystalProperties: Record<string, string> = {
  'Hematite': 'Grounding, protection, and stability. Connects to Earth energy.',
  'Carnelian': 'Creativity, passion, and emotional warmth. Ignites the sacral fire.',
  'Citrine': 'Abundance, manifestation, and personal power. The merchant stone.',
  "Tiger's Eye": 'Courage, confidence, and willpower. The eye of the warrior.',
  'Malachite': 'Transformation, heart healing, and protection. The stone of change.',
  'Rose Quartz': 'Unconditional love, compassion, and emotional healing. The heart opener.',
  'Lapis Lazuli': 'Truth, wisdom, and inner vision. The stone of royalty.',
  'Turquoise': 'Communication, protection, and spiritual attunement. The master healer.',
  'Amethyst': 'Intuition, spiritual awareness, and psychic abilities. The third eye activator.',
  'Fluorite': 'Mental clarity, focus, and decision making. The genius stone.',
  'Clear Quartz': 'Amplification, clarity, and programmability. The master crystal.',
  'Selenite': 'Divine light, spiritual connection, and cleansing. The liquid light.',
};

const CrystalQuadrant = ({ track }: CrystalQuadrantProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const crystalImage = crystalImages[track.crystal] || crystalImages['Clear Quartz'];
  const crystalProperty = crystalProperties[track.crystal] || 'A powerful healing crystal.';

  return (
    <motion.div
      className="gem-card p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <CrystalGemIcon color={track.colorHsl} size={28} />
        <h3 className="font-bubble text-xl text-foreground">The Crystal</h3>
        <span className="text-muted-foreground/60 font-body text-xs ml-auto tracking-wider">AMPLIFIER</span>
      </div>

      <div className="flex flex-col items-center">
        {/* Crystal Image with Hover Glow */}
        <motion.div
          className="relative cursor-pointer mb-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl -z-10"
            style={{
              background: `radial-gradient(circle, hsl(${track.colorHsl} / ${isHovered ? 0.5 : 0.2}) 0%, transparent 70%)`,
              transform: 'scale(1.6)',
            }}
            animate={{
              opacity: isHovered ? 1 : 0.6,
              scale: isHovered ? 2 : 1.6,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Outer glow ring on hover */}
          <motion.div
            className="absolute -inset-3 rounded-2xl pointer-events-none"
            style={{
              boxShadow: `0 0 30px hsl(${track.colorHsl} / 0.4), 0 0 60px hsl(${track.colorHsl} / 0.2)`,
            }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Crystal Image */}
          <motion.div
            className="relative w-28 h-28 md:w-32 md:h-32 overflow-hidden rounded-2xl"
            style={{
              boxShadow: isHovered 
                ? `0 0 25px hsl(${track.colorHsl} / 0.6), 0 8px 24px hsl(${track.colorHsl} / 0.3)`
                : `0 6px 24px hsl(${track.colorHsl} / 0.2)`,
              border: `2px solid hsl(${track.colorHsl} / 0.3)`,
            }}
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={crystalImage}
              alt={`${track.crystal} crystal`}
              className="w-full h-full object-cover transition-all duration-300"
              style={{
                filter: isHovered ? 'brightness(1.2) saturate(1.1)' : 'brightness(1)',
              }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
              }}
              animate={{
                x: isHovered ? ['100%', '-100%'] : '100%',
              }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 1.5,
              }}
            />
          </motion.div>
        </motion.div>

        {/* Crystal Name */}
        <p 
          className="font-body text-lg font-bold tracking-wide text-center"
          style={{ color: `hsl(${track.colorHsl})` }}
        >
          {track.crystal}
        </p>

        {/* Crystal Properties */}
        <p className="font-body text-xs text-muted-foreground/70 text-center mt-2 leading-relaxed max-w-xs">
          {crystalProperty}
        </p>
      </div>
    </motion.div>
  );
};

export default CrystalQuadrant;
