import { motion } from 'framer-motion';

const ShopSection = () => {
  return (
    <section id="shop" className="relative py-24 px-4 cosmic-swirl">
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
          <p className="text-gem-ruby/80 font-body text-sm tracking-[0.3em] uppercase mb-3">
            The Harvest
          </p>
          <h2 className="text-4xl md:text-6xl root-text font-bubble mb-4" data-text="The Source Bundle">
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
          <div className="gem-card rounded-organic-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Product Image */}
              <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-muted/50 to-muted/20 p-8 flex items-center justify-center">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 50%, hsl(280 60% 30% / 0.3) 0%, transparent 70%)',
                  }}
                />
                
                {/* Bundle visualization */}
                <div className="relative">
                  {/* Cassette */}
                  <motion.div
                    className="root-card w-48 h-32 rounded-organic p-4 absolute -left-4 -top-4 z-10"
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="flex justify-between mb-2">
                      <div className="w-8 h-8 rounded-full border-2 border-cream/30" />
                      <div className="w-8 h-8 rounded-full border-2 border-cream/30" />
                    </div>
                    <div className="h-4 bg-root-brown/50 rounded-full" />
                    <p className="text-center text-xs text-cream/50 mt-2 font-body">PHARMBOI TAPE</p>
                  </motion.div>

                  {/* Player */}
                  <motion.div
                    className="root-card w-52 h-36 rounded-organic-lg p-4 relative z-20 mx-auto mt-16"
                    animate={{ rotate: [1, -1, 1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <div className="text-center">
                      <p className="text-gem-topaz text-xs tracking-widest font-body">CLEAR-TECH™</p>
                      <div className="mt-4 flex justify-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-cream/30" />
                        <div className="w-10 h-10 rounded-full border-2 border-cream/30" />
                      </div>
                      <p className="text-cream/40 text-xs mt-3 font-body">TRANSPARENT PLAYER</p>
                    </div>
                  </motion.div>

                  {/* Map */}
                  <motion.div
                    className="root-card w-40 h-24 rounded-organic absolute -right-8 bottom-4 z-0 p-3"
                    animate={{ rotate: [3, -1, 3] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <div className="h-full border-2 border-dashed border-cream/20 rounded-xl flex items-center justify-center">
                      <p className="text-cream/40 text-xs text-center font-body">COSMIC MAP</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-gem-ruby/20 text-gem-ruby text-xs font-body">
                    LIMITED EDITION
                  </span>
                </div>

                <h3 className="font-bubble text-3xl md:text-4xl text-foreground mb-4">
                  The Source Bundle
                </h3>

                <p className="text-muted-foreground font-body mb-6">
                  A complete journey from roots to cosmos. This bundle includes everything 
                  grown in the Cosmic Garden.
                </p>

                {/* What's included */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gem-ruby/20 flex items-center justify-center text-gem-ruby">
                      📼
                    </div>
                    <div>
                      <p className="text-foreground font-body font-medium">Transparent Cassette Player</p>
                      <p className="text-muted-foreground text-sm font-body">Clear-Tech™ mechanics, no black boxes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gem-sapphire/30 flex items-center justify-center text-gem-sapphire">
                      🎵
                    </div>
                    <div>
                      <p className="text-foreground font-body font-medium">PHARMBOI Cassette Tape</p>
                      <p className="text-muted-foreground text-sm font-body">12 tracks, tuned to sacred frequencies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gem-topaz/20 flex items-center justify-center text-gem-topaz">
                      🗺️
                    </div>
                    <div>
                      <p className="text-foreground font-body font-medium">Digital Cosmic Map</p>
                      <p className="text-muted-foreground text-sm font-body">Navigate the mineral-frequency matrix</p>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm font-body">Starting at</p>
                    <p className="font-bubble text-3xl text-foreground">$88.00</p>
                  </div>
                  <motion.button
                    className="flex-1 sm:flex-none gem-button px-8 py-4 font-body text-cream hover:text-gem-topaz transition-colors text-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Pre-Order Now
                  </motion.button>
                </div>

                {/* Trust badges */}
                <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap gap-4">
                  <span className="text-muted-foreground/60 text-xs font-body">🌱 Sustainably sourced</span>
                  <span className="text-muted-foreground/60 text-xs font-body">✨ Hand-assembled</span>
                  <span className="text-muted-foreground/60 text-xs font-body">💎 Crystal-charged</span>
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
