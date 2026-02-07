import { motion } from 'framer-motion';

const ShopSection = () => {
  return (
    <section id="shop" className="relative py-24 px-4 noise-texture">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-throne-gold/80 font-body text-sm tracking-[0.3em] uppercase mb-3">
            The Harvest
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mb-4">
            The Source Bundle
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-body">
            Everything you need to experience PHARMBOI as it was meant to be heard.
          </p>
        </motion.div>

        {/* Product Card */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-card-strong rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Product Image */}
              <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-muted/50 to-muted/20 p-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-radial from-crystal-violet/10 via-transparent to-transparent" />
                
                {/* Bundle visualization */}
                <div className="relative">
                  {/* Cassette */}
                  <motion.div
                    className="glass-card w-48 h-32 rounded-lg p-4 absolute -left-4 -top-4 z-10"
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="flex justify-between mb-2">
                      <div className="w-8 h-8 rounded-full border border-source-white/30" />
                      <div className="w-8 h-8 rounded-full border border-source-white/30" />
                    </div>
                    <div className="h-4 bg-soil-brown/50 rounded-sm" />
                    <p className="text-center text-xs text-source-white/50 mt-2">PHARMBOI TAPE</p>
                  </motion.div>

                  {/* Player */}
                  <motion.div
                    className="cassette-shell w-52 h-36 rounded-xl p-4 relative z-20 mx-auto mt-16"
                    animate={{ rotate: [1, -1, 1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <div className="text-center">
                      <p className="text-throne-gold text-xs tracking-widest">CLEAR-TECH™</p>
                      <div className="mt-4 flex justify-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-source-white/30" />
                        <div className="w-10 h-10 rounded-full border border-source-white/30" />
                      </div>
                      <p className="text-source-white/40 text-xs mt-3">TRANSPARENT PLAYER</p>
                    </div>
                  </motion.div>

                  {/* Map */}
                  <motion.div
                    className="glass-card w-40 h-24 rounded-lg absolute -right-8 bottom-4 z-0 p-3"
                    animate={{ rotate: [3, -1, 3] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <div className="h-full border border-dashed border-source-white/20 rounded flex items-center justify-center">
                      <p className="text-source-white/40 text-xs text-center">SOIL MAP</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <span className="px-3 py-1 rounded-full bg-throne-gold/20 text-throne-gold text-xs font-body">
                    LIMITED EDITION
                  </span>
                </div>

                <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  The Source Bundle
                </h3>

                <p className="text-muted-foreground font-body mb-6">
                  A complete journey from soil to sound. This bundle includes everything 
                  grown in the Digital Greenhouse.
                </p>

                {/* What's included */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      📼
                    </div>
                    <div>
                      <p className="text-foreground font-body font-medium">Transparent Cassette Player</p>
                      <p className="text-muted-foreground text-sm">Clear-Tech™ mechanics, no black boxes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/30 flex items-center justify-center text-secondary-foreground">
                      🎵
                    </div>
                    <div>
                      <p className="text-foreground font-body font-medium">PHARMBOI Cassette Tape</p>
                      <p className="text-muted-foreground text-sm">7 tracks, tuned to sacred frequencies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-throne-gold/20 flex items-center justify-center text-throne-gold">
                      🗺️
                    </div>
                    <div>
                      <p className="text-foreground font-body font-medium">Digital Soil Map</p>
                      <p className="text-muted-foreground text-sm">Navigate the mineral-frequency matrix</p>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Starting at</p>
                    <p className="font-display text-3xl text-foreground">$88.00</p>
                  </div>
                  <motion.button
                    className="flex-1 sm:flex-none glass-card-strong px-8 py-4 rounded-full font-body text-source-white hover:text-throne-gold transition-colors text-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Pre-Order Now
                  </motion.button>
                </div>

                {/* Trust badges */}
                <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap gap-4">
                  <span className="text-muted-foreground/60 text-xs">🌱 Sustainably sourced</span>
                  <span className="text-muted-foreground/60 text-xs">✨ Hand-assembled</span>
                  <span className="text-muted-foreground/60 text-xs">🔮 Crystal-charged</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopSection;
