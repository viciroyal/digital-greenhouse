import { useState } from 'react';
import { motion } from 'framer-motion';
import AncientContractModal from '@/components/shop/AncientContractModal';

const ShopSection = () => {
  const [isContractOpen, setIsContractOpen] = useState(false);

  return (
    <>
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
              The Dispensary
            </p>
            <h2 className="text-4xl md:text-6xl root-text font-bubble mb-4" data-text="The Source Formula">
              The Source Formula
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-body">
              Everything you need to administer PHARMBOI as it was compounded to heal.
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
                  <div className="relative w-64 h-64">
                    {/* Vinyl Record */}
                    <motion.div
                      className="absolute -left-6 top-0 z-0"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-40 h-40 rounded-full relative" style={{
                        background: 'radial-gradient(circle, hsl(0 0% 8%) 20%, hsl(0 0% 4%) 21%, hsl(0 0% 12%) 22%, hsl(0 0% 4%) 45%, hsl(0 0% 8%) 46%, hsl(0 0% 4%) 47%, hsl(0 0% 10%) 80%, hsl(0 0% 5%) 100%)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                      }}>
                        {/* Center label */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center" style={{
                          background: 'linear-gradient(135deg, hsl(350 60% 40%), hsl(280 50% 30%))',
                        }}>
                          <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(0 0% 8%)' }} />
                        </div>
                        {/* Grooves */}
                        <div className="absolute inset-3 rounded-full border border-white/5" />
                        <div className="absolute inset-6 rounded-full border border-white/5" />
                        <div className="absolute inset-9 rounded-full border border-white/5" />
                      </div>
                    </motion.div>

                    {/* Vinyl sleeve peeking behind */}
                    <div className="absolute -left-8 top-2 w-40 h-40 rounded-lg z-[-1]" style={{
                      background: 'linear-gradient(135deg, hsl(350 50% 25%), hsl(280 40% 20%))',
                      border: '1px solid hsl(350 40% 30% / 0.5)',
                    }}>
                      <p className="text-[8px] text-cream/30 font-body text-center mt-3 tracking-widest">7" SINGLE</p>
                    </div>

                    {/* Cassette */}
                    <motion.div
                      className="root-card w-44 h-28 rounded-organic p-3 absolute right-0 -top-2 z-10"
                      animate={{ rotate: [-2, 2, -2] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className="flex justify-between mb-1.5">
                        <div className="w-7 h-7 rounded-full border-2 border-cream/30" />
                        <div className="w-7 h-7 rounded-full border-2 border-cream/30" />
                      </div>
                      <div className="h-3 bg-root-brown/50 rounded-full" />
                      <p className="text-center text-[10px] text-cream/50 mt-1.5 font-body">PHARMBOI TAPE</p>
                    </motion.div>

                    {/* Player */}
                    <motion.div
                      className="root-card w-48 h-32 rounded-organic-lg p-4 relative z-20 mx-auto mt-24"
                      animate={{ rotate: [1, -1, 1] }}
                      transition={{ duration: 5, repeat: Infinity }}
                    >
                      <div className="text-center">
                        <p className="text-gem-topaz text-[10px] tracking-widest font-body">CLEAR-TECH™</p>
                        <div className="mt-3 flex justify-center gap-3">
                          <div className="w-9 h-9 rounded-full border-2 border-cream/30" />
                          <div className="w-9 h-9 rounded-full border-2 border-cream/30" />
                        </div>
                        <p className="text-cream/40 text-[10px] mt-2 font-body">TRANSPARENT PLAYER</p>
                      </div>
                    </motion.div>

                    {/* Map */}
                    <motion.div
                      className="root-card w-36 h-20 rounded-organic absolute -right-4 bottom-0 z-0 p-2"
                      animate={{ rotate: [3, -1, 3] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    >
                      <div className="h-full border-2 border-dashed border-cream/20 rounded-xl flex items-center justify-center">
                        <p className="text-cream/40 text-[10px] text-center font-body">COSMIC MAP</p>
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
                    The Source Formula
                  </h3>

                  <p className="text-muted-foreground font-body mb-6">
                    The complete PHARMBOI experience — physical music, art, and tools in one bundle.
                  </p>

                  {/* Bundle Contents */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gem-ruby/20 flex items-center justify-center text-gem-ruby">
                        📼
                      </div>
                      <div>
                        <p className="text-foreground font-body font-medium">PHARMBOI Cassette Tape</p>
                        <p className="text-muted-foreground text-sm font-body">Full 12-track album on clear cassette with printed J-card</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gem-sapphire/30 flex items-center justify-center text-gem-sapphire">
                        💿
                      </div>
                      <div>
                        <p className="text-foreground font-body font-medium">Signed Vinyl 7"</p>
                        <p className="text-muted-foreground text-sm font-body">Limited-press first single, hand-signed by Vici Royàl</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gem-topaz/20 flex items-center justify-center text-gem-topaz">
                        📖
                      </div>
                      <div>
                        <p className="text-foreground font-body font-medium">Clear-Tech™ Transparent Player</p>
                        <p className="text-muted-foreground text-sm font-body">See-through portable cassette player — no black boxes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gem-emerald/20 flex items-center justify-center text-gem-emerald">
                        🗺️
                      </div>
                      <div>
                        <p className="text-foreground font-body font-medium">Cosmic Frequency Map</p>
                        <p className="text-muted-foreground text-sm font-body">Fold-out poster mapping every track to its mineral & frequency</p>
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
                      onClick={() => setIsContractOpen(true)}
                    >
                      Secure Dosage
                    </motion.button>
                  </div>

                  {/* Certifications */}
                  <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap gap-4">
                    <span className="text-muted-foreground/60 text-xs font-body">🌱 Organically Sourced</span>
                    <span className="text-muted-foreground/60 text-xs font-body">✨ Hand-Compounded</span>
                    <span className="text-muted-foreground/60 text-xs font-body">💎 Crystal-Activated</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ancient Contract Checkout Modal */}
      <AncientContractModal
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
        productName="The Source Formula"
        price="$88.00"
      />
    </>
  );
};

export default ShopSection;
