import { motion } from 'framer-motion';
import CassettePlayer from './CassettePlayer';
import PharmerTooltip from './PharmerTooltip';
import albumArt from '@/assets/pharmboi-artwork.png';
import pharmboiLogo from '@/assets/pharmboi-logo-textured.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden noise-texture">
      {/* Background effects */}
      <div className="absolute inset-0 throne-glow opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-crystal-violet/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content - centered and spacious */}
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-8 lg:gap-12">
        
        {/* Album Artwork - Hero focal point */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <PharmerTooltip 
            tip="The song of the star is born in the deep hum of the earth. What shines above is but the celebration of the soil."
            position="bottom"
          >
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-conic from-crystal-violet via-throne-gold to-root-red opacity-20 blur-3xl group-hover:opacity-40 transition-opacity" />
              <img 
                src={albumArt} 
                alt="PHARMBOI Album Artwork" 
                className="relative w-56 md:w-72 lg:w-80 rounded-2xl shadow-2xl border border-source-white/10"
              />
            </div>
          </PharmerTooltip>
        </motion.div>

        {/* Title & Info - Clean centered layout */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-throne-gold/80 font-body text-xs tracking-[0.3em] uppercase mb-3">
            The Digital Greenhouse Presents
          </p>
          <img 
            src={pharmboiLogo} 
            alt="PHARMBOI" 
            className="w-full max-w-md mx-auto mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            style={{
              maskImage: 'radial-gradient(ellipse 85% 75% at center, black 30%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 70%, transparent 90%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at center, black 30%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 70%, transparent 90%)',
            }}
          />
          <p className="text-source-white/60 font-body text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            "To listen when the soil whispers, to act when the stars signal."
          </p>
        </motion.div>

        {/* Artist credit - Compact */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-muted-foreground font-body text-sm">
            by <strong className="text-foreground font-bold">Vici Royàl</strong>
            <span className="text-muted-foreground/40 mx-2">•</span>
            <span className="text-muted-foreground/60 text-xs">
              Produced by <strong className="text-throne-gold font-bold">Vici Royàl</strong> & <span className="text-throne-gold">Èks</span>
            </span>
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.a
            href="#matrix"
            className="glass-card-strong px-6 py-3 rounded-full font-body text-sm text-source-white hover:text-throne-gold transition-colors group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-2">
              Explore the Matrix
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </motion.a>
          <motion.a
            href="#shop"
            className="px-6 py-3 rounded-full font-body text-sm text-throne-gold border border-throne-gold/50 hover:bg-throne-gold/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get The Source Bundle
          </motion.a>
        </motion.div>

        {/* Cassette Player - Inline below CTAs */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <CassettePlayer />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-1">
          <p className="text-muted-foreground/40 text-[10px] font-body tracking-widest uppercase">Scroll</p>
          <div className="w-px h-8 bg-gradient-to-b from-crystal-violet/40 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
