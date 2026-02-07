import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CosmicResonanceButtonProps {
  onClick: () => void;
}

const CosmicResonanceButton = ({ onClick }: CosmicResonanceButtonProps) => {
  return (
    <section className="relative py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section intro */}
        <motion.p
          className="text-muted-foreground font-body text-sm tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Cosmic Compatibility Engine
        </motion.p>
        
        <motion.h3
          className="font-display text-2xl md:text-3xl text-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Are You a <span className="text-primary">Companion Plant</span>?
        </motion.h3>

        {/* The Button */}
        <motion.button
          onClick={onClick}
          className="cosmic-beacon glass-card-strong relative px-8 py-5 rounded-2xl font-body text-lg text-foreground hover:text-primary transition-colors group overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Pulsing violet glow layers */}
          <span className="absolute inset-0 rounded-2xl cosmic-pulse-glow" />
          <span className="absolute inset-0 rounded-2xl cosmic-pulse-glow-delayed" />
          
          {/* Inner glow */}
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Content */}
          <span className="relative z-10 flex items-center justify-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="tracking-wide">CHECK COSMIC RESONANCE</span>
            <span className="text-muted-foreground text-sm">(ENTER BIRTH DATA)</span>
          </span>
        </motion.button>

        <motion.p
          className="text-muted-foreground/60 font-body text-xs mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          The Vici Royàl Algorithm • Mapping Your Soil to the Stars
        </motion.p>
      </div>

      <style>{`
        @keyframes cosmic-pulse {
          0%, 100% {
            box-shadow: 
              0 0 20px hsl(280 80% 65% / 0.3),
              0 0 40px hsl(280 80% 65% / 0.15),
              0 0 60px hsl(280 80% 65% / 0.08);
          }
          50% {
            box-shadow: 
              0 0 30px hsl(280 80% 65% / 0.5),
              0 0 60px hsl(280 80% 65% / 0.25),
              0 0 90px hsl(280 80% 65% / 0.15);
          }
        }
        
        .cosmic-pulse-glow {
          animation: cosmic-pulse 2s ease-in-out infinite;
        }
        
        .cosmic-pulse-glow-delayed {
          animation: cosmic-pulse 2s ease-in-out infinite;
          animation-delay: 1s;
          opacity: 0.5;
        }
      `}</style>
    </section>
  );
};

export default CosmicResonanceButton;
