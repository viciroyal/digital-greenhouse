import { motion } from 'framer-motion';
import PharmerTooltip from './PharmerTooltip';

const CassettePlayer = () => {
  return (
    <div className="relative">
      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-radial from-crystal-violet/20 via-transparent to-transparent blur-3xl scale-150" />
      
      {/* Clear Player Shell */}
      <motion.div 
        className="relative float-slow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <PharmerTooltip 
          tip="Transparency. We test the soil and show the mechanics. No hidden algorithms."
          position="right"
        >
          <div className="cassette-shell rounded-2xl p-6 md:p-8 w-72 md:w-96 pulse-glow">
            {/* Player Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-root-red/80" />
                <div className="w-2 h-2 rounded-full bg-throne-gold/80" />
                <div className="w-2 h-2 rounded-full bg-chakra-heart/80" />
              </div>
              <span className="text-source-white/40 text-xs font-body tracking-widest">CLEAR-TECH™</span>
            </div>

            {/* Cassette Tape */}
            <PharmerTooltip 
              tip="The Tape is the Soil. Analog, magnetic, and physical."
              position="bottom"
            >
              <div className="glass-card rounded-xl p-4 mb-4">
                {/* Tape Reels */}
                <div className="flex justify-between items-center mb-3">
                  <motion.div 
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-source-white/30 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-soil-brown border border-source-white/20" />
                  </motion.div>
                  
                  {/* Tape window */}
                  <div className="flex-1 mx-3 h-6 bg-gradient-to-r from-soil-brown/50 via-root-red/30 to-soil-brown/50 rounded-sm border border-source-white/10" />
                  
                  <motion.div 
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-source-white/30 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-soil-brown border border-source-white/20" />
                  </motion.div>
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className="text-source-white/70 text-xs font-body tracking-wider">SIDE A</p>
                  <p className="text-throne-gold font-display text-lg">PHARMBOI</p>
                  <p className="text-source-white/50 text-xs font-body">Vici Royàl</p>
                </div>
              </div>
            </PharmerTooltip>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {['⏮', '▶', '⏭'].map((icon, i) => (
                <motion.button
                  key={i}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-source-white/70 hover:text-throne-gold transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>
        </PharmerTooltip>
      </motion.div>
    </div>
  );
};

export default CassettePlayer;
