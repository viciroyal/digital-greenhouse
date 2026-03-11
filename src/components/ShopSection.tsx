import { motion } from 'framer-motion';

const EVENT_URL = 'https://partiful.com/e/2sCcLMfPWq8nRTYiNbs5?c=4q_yLdPt';

const ShopSection = () => {
  return (
    <section id="shop" className="relative py-24 px-4 cosmic-swirl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gem-ruby/80 font-body text-sm tracking-[0.3em] uppercase mb-3">
            Live Event
          </p>
          <h2 className="text-4xl md:text-6xl root-text font-bubble mb-4" data-text="ThEarlyShow">
            ThEarlyShow 11 Year Anniversary
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-body">
            11 years of sound. One vinyl drop. A birthday toast. Infinite Majic 🌀
          </p>
        </motion.div>

        {/* Event Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="gem-card rounded-organic-lg overflow-hidden">
            <div className="p-8 md:p-12 space-y-6">
              {/* Date & Location */}
              <div className="flex flex-wrap gap-4 text-sm font-body">
                <span className="px-4 py-1.5 rounded-full bg-gem-ruby/20 text-gem-ruby">
                  📅 Saturday, Apr 11
                </span>
                <span className="px-4 py-1.5 rounded-full bg-gem-sapphire/20 text-gem-sapphire">
                  🕣 8:30 PM
                </span>
                <span className="px-4 py-1.5 rounded-full bg-gem-emerald/20 text-gem-emerald">
                  📍 Atlanta, GA
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground font-body leading-relaxed">
                Join us for the 11th Anniversary of ThEarlyShow <span className="text-gem-topaz">#tesatl</span> featuring 
                the split 7" vinyl release from <span className="text-foreground">@gas_hound</span> & <span className="text-foreground">@officialpharmboi</span>. 
                Special guest frequencies provided by <span className="text-foreground">@sistah.moon</span> and <span className="text-foreground">@saraethereal</span>.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed">
                We're also raising a glass for Vici Royal's Birthday! 🥂 See you at Buteco on April 11th to play the season chord together.
              </p>

              {/* Suggested donation */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-muted-foreground/60 text-xs font-body">💰 $11 suggested</span>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <motion.a
                  href={EVENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block gem-button px-10 py-4 font-body text-cream hover:text-gem-topaz transition-colors text-center rounded-organic"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  RSVP on Partiful →
                </motion.a>
              </div>

              {/* Footer tags */}
              <div className="pt-6 border-t border-border/50 flex flex-wrap gap-4">
                <span className="text-muted-foreground/60 text-xs font-body">🎵 Vinyl Release</span>
                <span className="text-muted-foreground/60 text-xs font-body">🎂 Birthday Celebration</span>
                <span className="text-muted-foreground/60 text-xs font-body">🌀 Infinite Majic</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopSection;
