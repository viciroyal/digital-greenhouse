import { motion } from 'framer-motion';
import PharmerTooltip from './PharmerTooltip';

const CassettePlayer = () => {
  return (
    <div className="relative">
      {/* Outer glow - cosmic gemstone colors */}
      <div 
        className="absolute inset-0 blur-3xl scale-150"
        style={{
          background: 'radial-gradient(circle, hsl(280 60% 40% / 0.3) 0%, hsl(350 75% 50% / 0.2) 50%, transparent 70%)',
        }}
      />
      
      {/* Clear Player Shell */}
      <motion.div 
        className="relative float-organic"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <PharmerTooltip 
          tip="Transparency. We test the soil and show the mechanics. No hidden algorithms."
          position="right"
        >
          <div className="root-card rounded-organic-lg p-6 md:p-8 w-72 md:w-96 pulse-gem">
            {/* Player Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gem-ruby" />
                <div className="w-2.5 h-2.5 rounded-full bg-gem-topaz" />
                <div className="w-2.5 h-2.5 rounded-full bg-gem-emerald" />
              </div>
              <span className="text-cream/40 text-xs font-body tracking-widest">CLEAR-TECH™</span>
            </div>

            {/* Cassette Tape */}
            <PharmerTooltip 
              tip="The Tape is the Root. Analog, magnetic, and physical."
              position="bottom"
            >
              <div className="gem-card rounded-organic p-4 mb-4">
                {/* Tape Reels */}
                <div className="flex justify-between items-center mb-3">
                  <motion.div 
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-cream/30 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-root-brown border border-cream/20" />
                  </motion.div>
                  
                  {/* Tape window */}
                  <div 
                    className="flex-1 mx-3 h-6 rounded-full border border-cream/10"
                    style={{
                      background: 'linear-gradient(90deg, hsl(20 40% 15% / 0.5), hsl(350 75% 40% / 0.3), hsl(20 40% 15% / 0.5))',
                    }}
                  />
                  
                  <motion.div 
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-cream/30 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-root-brown border border-cream/20" />
                  </motion.div>
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className="text-cream/70 text-xs font-body tracking-wider">SIDE A</p>
                  <p className="text-gem-topaz font-bubble text-lg">PHARMBOI</p>
                  <p className="text-cream/50 text-xs font-body">Vici Royàl</p>
                </div>
              </div>
            </PharmerTooltip>

            {/* Controls - Apothecary: "ADMINISTER FREQUENCY" */}
            <div className="flex justify-center gap-4">
              {[
                { icon: '⏮', label: 'Previous Dose' },
                { icon: '▶', label: 'Administer' },
                { icon: '⏭', label: 'Next Dose' }
              ].map((control, i) => (
                <motion.button
                  key={i}
                  className="w-10 h-10 rounded-full root-card flex items-center justify-center text-cream/70 hover:text-gem-topaz transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={control.label}
                >
                  {control.icon}
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
