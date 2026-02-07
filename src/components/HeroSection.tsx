import { motion } from 'framer-motion';
import CassettePlayer from './CassettePlayer';
import PharmerTooltip from './PharmerTooltip';
import albumArt from '@/assets/pharmboi-artwork.png';

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

      <div className="relative z-10 max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left: Album Artwork */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <PharmerTooltip 
            tip="As Above, So Below. The party starts in the dirt so it can shine in the sky."
            position="right"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-conic from-crystal-violet via-throne-gold to-root-red opacity-30 blur-2xl group-hover:opacity-50 transition-opacity" />
              <img 
                src={albumArt} 
                alt="PHARMBOI Album Artwork" 
                className="relative w-64 md:w-80 lg:w-96 rounded-2xl shadow-2xl border border-source-white/10"
              />
            </div>
          </PharmerTooltip>
        </motion.div>

        {/* Center content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-throne-gold/80 font-body text-sm tracking-[0.3em] uppercase mb-2">
              The Digital Greenhouse Presents
            </p>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl gradient-root-throne-text mb-4">
              PHARMBOI
            </h1>
            <p className="text-source-white/60 font-body text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
              "To listen when the soil whispers, to act when the stars signal."
            </p>
          </motion.div>

          {/* Artist credit */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-muted-foreground font-body text-sm">
              by <span className="text-primary">Vici Royàl</span>
            </p>
            <p className="text-muted-foreground/60 font-body text-xs mt-1">
              Produced by Eks
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.a
              href="#matrix"
              className="glass-card-strong px-8 py-4 rounded-full font-body text-source-white hover:text-throne-gold transition-colors group"
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
              className="px-8 py-4 rounded-full font-body text-throne-gold border border-throne-gold/50 hover:bg-throne-gold/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get The Source Bundle
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Cassette Player - Floating */}
      <motion.div
        className="mt-16 lg:absolute lg:bottom-10 lg:right-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <CassettePlayer />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-muted-foreground/50 text-xs font-body tracking-wider">SCROLL TO DESCEND</p>
          <div className="w-px h-12 bg-gradient-to-b from-crystal-violet/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
