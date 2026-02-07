import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const RootThroneScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform values based on scroll
  const rootOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.8, 0.2]);
  const throneOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.2, 0.8]);
  const rootY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const throneY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[150vh] overflow-hidden"
    >
      {/* Underground/Root Layer */}
      <motion.div 
        className="absolute inset-0 roots-pattern"
        style={{ opacity: rootOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-soil-brown via-root-red/20 to-transparent" />
        
        {/* Root tendrils SVG */}
        <motion.svg
          className="absolute bottom-0 left-0 w-full h-[60%]"
          style={{ y: rootY }}
          viewBox="0 0 1200 400"
          fill="none"
          preserveAspectRatio="xMidYMax slice"
        >
          <path
            d="M600 0 C600 100 400 150 300 200 C200 250 150 350 100 400"
            stroke="hsl(15 60% 25% / 0.6)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M600 0 C600 80 700 120 800 180 C900 240 950 320 1000 400"
            stroke="hsl(15 60% 25% / 0.5)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M600 0 C580 120 500 180 450 280 C400 380 380 400 350 400"
            stroke="hsl(0 60% 35% / 0.4)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M600 0 C620 100 680 150 750 250 C820 350 860 400 900 400"
            stroke="hsl(0 60% 35% / 0.3)"
            strokeWidth="2"
            fill="none"
          />
        </motion.svg>
      </motion.div>

      {/* Sky/Throne Layer */}
      <motion.div 
        className="absolute inset-0 throne-glow"
        style={{ opacity: throneOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-crystal-violet/20 via-transparent to-transparent" />
        
        {/* Celestial elements */}
        <motion.div
          className="absolute top-20 left-[20%]"
          style={{ y: throneY }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-source-white rounded-full blur-sm" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-[30%]"
          style={{ y: throneY }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          <div className="w-2 h-2 bg-throne-gold rounded-full blur-sm" />
        </motion.div>
        <motion.div
          className="absolute top-32 right-[15%]"
          style={{ y: throneY }}
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.5, 0.9, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        >
          <div className="w-2 h-2 bg-crystal-violet rounded-full blur-sm" />
        </motion.div>
      </motion.div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[150vh] px-4">
        {/* Root wisdom */}
        <motion.div
          className="sticky top-[40%] text-center max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="mb-32"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1, 0]) }}
          >
            <h3 className="font-display text-3xl md:text-5xl text-throne-gold mb-4">
              The Throne
            </h3>
            <p className="text-source-white/70 font-body text-lg">
              "Where frequency meets royalty. The crown is grown from the ground up."
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <span className="px-4 py-2 glass-card rounded-full text-sm text-muted-foreground">
                ☀️ Light
              </span>
              <span className="px-4 py-2 glass-card rounded-full text-sm text-muted-foreground">
                🔮 Source
              </span>
              <span className="px-4 py-2 glass-card rounded-full text-sm text-muted-foreground">
                ✨ Vision
              </span>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.5, 0.7, 1], [0, 1, 1]) }}
          >
            <h3 className="font-display text-3xl md:text-5xl text-root-red mb-4">
              The Roots
            </h3>
            <p className="text-source-white/70 font-body text-lg">
              "Every empire begins underground. The soil holds the secrets of the stars."
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <span className="px-4 py-2 glass-card rounded-full text-sm text-muted-foreground">
                🌱 Growth
              </span>
              <span className="px-4 py-2 glass-card rounded-full text-sm text-muted-foreground">
                💎 Minerals
              </span>
              <span className="px-4 py-2 glass-card rounded-full text-sm text-muted-foreground">
                🌍 Earth
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Transition indicator */}
        <motion.div
          className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2"
          style={{ opacity: useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.5, 1, 0.5]) }}
        >
          <div className="w-1 h-32 rounded-full gradient-root-throne" />
          <p className="text-muted-foreground/50 text-xs font-body [writing-mode:vertical-lr] rotate-180 tracking-widest">
            AS ABOVE · SO BELOW
          </p>
          <div className="w-1 h-32 rounded-full gradient-root-throne rotate-180" />
        </motion.div>
      </div>
    </section>
  );
};

export default RootThroneScroll;
