import { motion } from 'framer-motion';

interface MatrixElement {
  row: number;
  chakra: string;
  track: string;
  frequency: string;
  mineral: string;
  mineralSymbol: string;
  crystal: string;
  color: string;
  featuring?: string;
}

const matrixData: MatrixElement[] = [
  {
    row: 1,
    chakra: 'Root',
    track: 'Pulling Weeds',
    frequency: '396Hz',
    mineral: 'Iron',
    mineralSymbol: 'Fe',
    crystal: 'Hematite',
    color: 'chakra-root',
  },
  {
    row: 2,
    chakra: 'Sacral',
    track: 'Drugs',
    frequency: '417Hz',
    mineral: 'Carbon',
    mineralSymbol: 'C',
    crystal: 'Carnelian',
    color: 'chakra-sacral',
    featuring: 'Sistah Moon',
  },
  {
    row: 3,
    chakra: 'Solar',
    track: 'No Nouns',
    frequency: '528Hz',
    mineral: 'Nitrogen',
    mineralSymbol: 'N',
    crystal: 'Citrine',
    color: 'chakra-solar',
    featuring: 'Nichollé McKoy',
  },
  {
    row: 4,
    chakra: 'Heart',
    track: 'Allow Me',
    frequency: '639Hz',
    mineral: 'Magnesium',
    mineralSymbol: 'Mg',
    crystal: 'Malachite',
    color: 'chakra-heart',
    featuring: 'Sarafina Ethereal',
  },
  {
    row: 5,
    chakra: 'Throat',
    track: 'Quantum Love',
    frequency: '741Hz',
    mineral: 'Calcium',
    mineralSymbol: 'Ca',
    crystal: 'Lapis Lazuli',
    color: 'chakra-throat',
    featuring: 'Briar Blakley',
  },
  {
    row: 6,
    chakra: 'Vision',
    track: 'M.O.E.',
    frequency: '852Hz',
    mineral: 'Silicon',
    mineralSymbol: 'Si',
    crystal: 'Amethyst',
    color: 'chakra-vision',
    featuring: 'Tori Dara Carter & Shellie Sweets',
  },
  {
    row: 7,
    chakra: 'Source',
    track: 'Awaken',
    frequency: '963Hz',
    mineral: 'Phosphorus',
    mineralSymbol: 'P',
    crystal: 'Clear Quartz',
    color: 'chakra-source',
    featuring: 'Yamau',
  },
];

const MasterMatrix = () => {
  return (
    <section id="matrix" className="relative py-24 px-4 noise-texture">
      {/* Section header */}
      <motion.div
        className="max-w-6xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-throne-gold/80 font-body text-sm tracking-[0.3em] uppercase mb-3">
          The Pharmer Logic
        </p>
        <h2 className="font-display text-4xl md:text-6xl text-foreground mb-4">
          The Master Matrix
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-body">
          Each track is tuned to a sacred frequency, grounded in an essential soil mineral, 
          and amplified through its corresponding crystal. Music grown, not made.
        </p>
      </motion.div>

      {/* Matrix Grid */}
      <div className="max-w-6xl mx-auto">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-7 gap-2 mb-4 px-4">
          {['Row', 'Chakra', 'Track', 'Frequency', 'Mineral', 'Crystal', 'Featuring'].map((header) => (
            <p key={header} className="text-muted-foreground/60 text-xs font-body tracking-wider uppercase text-center">
              {header}
            </p>
          ))}
        </div>

        {/* Matrix Rows */}
        <div className="space-y-3">
          {matrixData.map((element, index) => (
            <motion.div
              key={element.row}
              className="matrix-cell glass-card rounded-xl overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Mobile Layout */}
              <div className="md:hidden p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-lg bg-${element.color}/20 border border-${element.color}/40 flex items-center justify-center`}>
                    <span className="font-display text-xl" style={{ color: `hsl(var(--${element.color}))` }}>
                      {element.mineralSymbol}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground font-display text-lg">{element.track}</p>
                    <p className="text-muted-foreground text-sm">{element.chakra} • {element.frequency}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                    {element.mineral}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                    {element.crystal}
                  </span>
                  {element.featuring && (
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-xs text-primary">
                      ft. {element.featuring}
                    </span>
                  )}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid grid-cols-7 gap-2 p-4 items-center">
                {/* Row Number */}
                <div className="flex justify-center">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center border"
                    style={{ 
                      backgroundColor: `hsl(var(--${element.color}) / 0.15)`,
                      borderColor: `hsl(var(--${element.color}) / 0.4)`
                    }}
                  >
                    <span className="font-display text-lg" style={{ color: `hsl(var(--${element.color}))` }}>
                      {element.row}
                    </span>
                  </div>
                </div>

                {/* Chakra */}
                <div className="text-center">
                  <p 
                    className="font-body font-medium"
                    style={{ color: `hsl(var(--${element.color}))` }}
                  >
                    {element.chakra}
                  </p>
                </div>

                {/* Track */}
                <div className="text-center">
                  <p className="text-foreground font-display text-lg">{element.track}</p>
                </div>

                {/* Frequency */}
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full bg-muted/50 text-sm font-body text-muted-foreground">
                    {element.frequency}
                  </span>
                </div>

                {/* Mineral */}
                <div className="flex items-center justify-center gap-2">
                  <span 
                    className="font-display text-xl font-bold"
                    style={{ color: `hsl(var(--${element.color}))` }}
                  >
                    {element.mineralSymbol}
                  </span>
                  <span className="text-muted-foreground text-sm">{element.mineral}</span>
                </div>

                {/* Crystal */}
                <div className="text-center">
                  <p className="text-foreground/80 font-body text-sm">💎 {element.crystal}</p>
                </div>

                {/* Featuring */}
                <div className="text-center">
                  {element.featuring ? (
                    <p className="text-primary/90 font-body text-sm">
                      ft. {element.featuring}
                    </p>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </div>
              </div>

              {/* Gradient accent line */}
              <div 
                className="h-0.5 w-full"
                style={{ 
                  background: `linear-gradient(90deg, hsl(var(--${element.color}) / 0.6) 0%, transparent 100%)`
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Soil Spirits credit */}
      <motion.div
        className="max-w-6xl mx-auto mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="glass-card inline-block px-8 py-4 rounded-full">
          <p className="text-muted-foreground font-body text-sm">
            Guided by the <span className="text-throne-gold">Soil Spirits</span>: Spirit, Sunny, Rocky & River
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default MasterMatrix;
