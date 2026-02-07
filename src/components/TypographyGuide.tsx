import { motion } from 'framer-motion';

const TypographyGuide = () => {
  return (
    <section className="relative py-24 px-4 noise-texture">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary/80 font-body text-sm tracking-[0.3em] uppercase mb-3">
            Design System
          </p>
          <h2 className="text-4xl md:text-6xl pillar-text mb-4" data-text="Typography Guide">
            Typography Guide
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-body">
            The sacred fonts of the Digital Greenhouse—carved from ebony, mapped by starlight.
          </p>
        </motion.div>

        {/* Font Styles Grid */}
        <div className="space-y-12">
          
          {/* Pillar Text */}
          <motion.div
            className="glass-card rounded-xl p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="md:w-1/3">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-body">
                  .pillar-text
                </span>
                <h3 className="font-pillar text-xl text-foreground mt-3 tracking-wider">
                  PILLAR TEXT
                </h3>
                <p className="text-muted-foreground text-sm font-body mt-2">
                  Staatliches font with weathered wood gradient. Used for major headings and titles.
                </p>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground/60 font-body">
                  <p>Font: Staatliches</p>
                  <p>Letter-spacing: 0.1em</p>
                  <p>Animation: grain-sweep 1.2s</p>
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground/50 mb-2 font-body">Large (4xl-6xl)</p>
                  <h2 className="text-4xl md:text-5xl pillar-text" data-text="THE MASTER MATRIX">
                    THE MASTER MATRIX
                  </h2>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/50 mb-2 font-body">Medium (2xl-3xl)</p>
                  <h3 className="text-2xl md:text-3xl pillar-text" data-text="SIRIUS ARTIFACT">
                    SIRIUS ARTIFACT
                  </h3>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/50 mb-2 font-body">With delay classes</p>
                  <div className="flex flex-wrap gap-4">
                    <span className="text-xl pillar-text pillar-text-delay-1" data-text="DELAY-1">DELAY-1</span>
                    <span className="text-xl pillar-text pillar-text-delay-2" data-text="DELAY-2">DELAY-2</span>
                    <span className="text-xl pillar-text pillar-text-delay-3" data-text="DELAY-3">DELAY-3</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sirius Text */}
          <motion.div
            className="glass-card rounded-xl p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="md:w-1/3">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-body">
                  .sirius-text
                </span>
                <h3 className="font-pillar text-xl text-foreground mt-3 tracking-wider">
                  SIRIUS TEXT
                </h3>
                <p className="text-muted-foreground text-sm font-body mt-2">
                  Space Mono monospace font. Used for data, frequencies, and astronomical notation.
                </p>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground/60 font-body">
                  <p>Font: Space Mono</p>
                  <p>Letter-spacing: 0.02em</p>
                  <p>Style: Monospace</p>
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground/50 mb-2 font-body">Frequencies</p>
                  <p className="sirius-text text-2xl text-accent">432 Hz • 528 Hz • 639 Hz</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/50 mb-2 font-body">Mineral Symbols</p>
                  <p className="sirius-text text-xl text-foreground">Fe₂₄ • Mg₁₂ • K₁₉ • Ca₂₀</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/50 mb-2 font-body">Coordinates</p>
                  <p className="sirius-text text-lg text-muted-foreground">
                    RA 06h 45m 08.9s • Dec -16° 42′ 58″
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/50 mb-2 font-body">Timestamps</p>
                  <p className="sirius-text text-sm text-muted-foreground/70">
                    2026.02.07 :: 13:09:28 UTC
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Carving Text */}
          <motion.div
            className="glass-card rounded-xl p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="md:w-1/3">
                <span className="px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-body">
                  .carving-text
                </span>
                <h3 className="font-pillar text-xl text-foreground mt-3 tracking-wider">
                  CARVING TEXT
                </h3>
                <p className="text-muted-foreground text-sm font-body mt-2">
                  Kelly Slab serif font. Used for labels, categories, and ceremonial inscriptions.
                </p>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground/60 font-body">
                  <p>Font: Kelly Slab</p>
                  <p>Letter-spacing: 0.05em</p>
                  <p>Transform: uppercase</p>
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground/50 mb-2 font-body">Chakra Labels</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="carving-text text-lg text-chakra-root">ROOT</span>
                    <span className="carving-text text-lg text-chakra-sacral">SACRAL</span>
                    <span className="carving-text text-lg text-chakra-solar">SOLAR</span>
                    <span className="carving-text text-lg text-chakra-heart">HEART</span>
                    <span className="carving-text text-lg text-chakra-throat">THROAT</span>
                    <span className="carving-text text-lg text-chakra-vision">VISION</span>
                    <span className="carving-text text-lg text-chakra-source">SOURCE</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/50 mb-2 font-body">Section Labels</p>
                  <p className="carving-text text-xl text-foreground">THE FOX DIVINATION GRID</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground/50 mb-2 font-body">Inscriptions</p>
                  <p className="carving-text text-base text-muted-foreground">
                    WHERE EARTH MEETS SIRIUS
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Usage Code Block */}
          <motion.div
            className="glass-card rounded-xl p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-pillar text-xl text-foreground tracking-wider mb-4">
              USAGE
            </h3>
            <div className="bg-background/50 rounded-lg p-4 overflow-x-auto">
              <pre className="sirius-text text-sm text-muted-foreground">
{`/* Pillar Text - Major headings */
<h2 className="pillar-text" data-text="YOUR TITLE">
  YOUR TITLE
</h2>

/* With staggered animation */
<h2 className="pillar-text pillar-text-delay-2" data-text="DELAYED">
  DELAYED
</h2>

/* Sirius Text - Data & frequencies */
<span className="sirius-text">432 Hz</span>

/* Carving Text - Labels & inscriptions */
<span className="carving-text">ROOT CHAKRA</span>`}
              </pre>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TypographyGuide;
