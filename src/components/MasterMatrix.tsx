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
    chakra: 'Root',
    track: 'Drugs',
    frequency: '417Hz',
    mineral: 'Carbon',
    mineralSymbol: 'C',
    crystal: 'Carnelian',
    color: 'chakra-sacral',
    featuring: 'Sistah Moon & Yamau',
  },
  {
    row: 3,
    chakra: 'Sacral',
    track: 'No Nouns',
    frequency: '528Hz',
    mineral: 'Nitrogen',
    mineralSymbol: 'N',
    crystal: 'Citrine',
    color: 'chakra-solar',
  },
  {
    row: 4,
    chakra: 'Sacral',
    track: 'Destined Nation',
    frequency: '528Hz',
    mineral: 'Nitrogen',
    mineralSymbol: 'N',
    crystal: "Tiger's Eye",
    color: 'chakra-solar',
    featuring: 'Briar Blakley',
  },
  {
    row: 5,
    chakra: 'Solar',
    track: 'Babe',
    frequency: '639Hz',
    mineral: 'Magnesium',
    mineralSymbol: 'Mg',
    crystal: 'Malachite',
    color: 'chakra-heart',
  },
  {
    row: 6,
    chakra: 'Heart',
    track: 'Allow Me',
    frequency: '639Hz',
    mineral: 'Oxygen',
    mineralSymbol: 'O',
    crystal: 'Rose Quartz',
    color: 'chakra-heart',
    featuring: 'Sarafina Ethereal & James Cambridge IV',
  },
  {
    row: 7,
    chakra: 'Heart',
    track: 'Quantum Love',
    frequency: '741Hz',
    mineral: 'Calcium',
    mineralSymbol: 'Ca',
    crystal: 'Lapis Lazuli',
    color: 'chakra-throat',
    featuring: 'Shellie Sweets',
  },
  {
    row: 8,
    chakra: 'Throat',
    track: 'No Nouns (Acoustic)',
    frequency: '741Hz',
    mineral: 'Calcium',
    mineralSymbol: 'Ca',
    crystal: 'Turquoise',
    color: 'chakra-throat',
  },
  {
    row: 9,
    chakra: 'Throat',
    track: 'LAFS',
    frequency: '852Hz',
    mineral: 'Silicon',
    mineralSymbol: 'Si',
    crystal: 'Amethyst',
    color: 'chakra-vision',
    featuring: 'Nichollé McKoy',
  },
  {
    row: 10,
    chakra: 'Vision',
    track: 'M.O.E.',
    frequency: '852Hz',
    mineral: 'Copper',
    mineralSymbol: 'Cu',
    crystal: 'Fluorite',
    color: 'chakra-vision',
  },
  {
    row: 11,
    chakra: 'Vision',
    track: 'Awaken',
    frequency: '963Hz',
    mineral: 'Phosphorus',
    mineralSymbol: 'P',
    crystal: 'Clear Quartz',
    color: 'chakra-source',
    featuring: 'Vitoria, Dara Carter & Briar Blakley',
  },
  {
    row: 12,
    chakra: 'Source',
    track: 'Lie To Me',
    frequency: '963Hz',
    mineral: 'Gold',
    mineralSymbol: 'Au',
    crystal: 'Selenite',
    color: 'chakra-source',
  },
];

// Helper to bold special names
const formatFeaturing = (featuring: string) => {
  const boldNames = ['Sistah Moon', 'Vici Royàl'];
  let result = featuring;
  
  return (
    <span>
      {featuring.split(/(\bSistah Moon\b|\bVici Royàl\b)/g).map((part, i) => 
        boldNames.includes(part) ? (
          <strong key={i} className="text-throne-gold font-bold">{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

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
        <p className="text-muted-foreground/60 text-sm mt-4 font-mono">
          Produced by <strong className="text-throne-gold">Vici Royàl</strong> & <span className="text-throne-gold">Èks</span>
        </p>
      </motion.div>

      {/* Matrix Grid */}
      <div className="max-w-7xl mx-auto">
        {/* Header Row */}
        <div className="hidden lg:grid grid-cols-7 gap-2 mb-4 px-4">
          {['#', 'Chakra', 'Track', 'Frequency', 'Mineral', 'Crystal', 'Featuring'].map((header) => (
            <p key={header} className="text-muted-foreground/60 text-xs font-mono tracking-wider uppercase text-center">
              {header}
            </p>
          ))}
        </div>

        {/* Matrix Rows */}
        <div className="space-y-2">
          {matrixData.map((element, index) => (
            <motion.div
              key={element.row}
              className="matrix-cell glass-card rounded-xl overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              {/* Mobile Layout */}
              <div className="lg:hidden p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center border"
                    style={{ 
                      backgroundColor: `hsl(var(--${element.color}) / 0.15)`,
                      borderColor: `hsl(var(--${element.color}) / 0.4)`
                    }}
                  >
                    <span className="font-mono text-sm font-bold" style={{ color: `hsl(var(--${element.color}))` }}>
                      {element.mineralSymbol}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground font-mono text-base">{element.track}</p>
                    <p className="text-muted-foreground text-xs font-mono">{element.chakra} • {element.frequency}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground font-mono">
                    {element.mineral}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground font-mono">
                    💎 {element.crystal}
                  </span>
                  {element.featuring && (
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-xs text-primary font-mono">
                      ft. {formatFeaturing(element.featuring)}
                    </span>
                  )}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid grid-cols-7 gap-2 p-3 items-center">
                {/* Row Number */}
                <div className="flex justify-center">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center border"
                    style={{ 
                      backgroundColor: `hsl(var(--${element.color}) / 0.15)`,
                      borderColor: `hsl(var(--${element.color}) / 0.4)`
                    }}
                  >
                    <span className="font-mono text-sm font-bold" style={{ color: `hsl(var(--${element.color}))` }}>
                      {String(element.row).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Chakra */}
                <div className="text-center">
                  <p 
                    className="font-mono text-xs uppercase tracking-wide"
                    style={{ color: `hsl(var(--${element.color}))` }}
                  >
                    {element.chakra}
                  </p>
                </div>

                {/* Track */}
                <div className="text-center">
                  <p className="text-foreground font-mono text-sm">{element.track}</p>
                </div>

                {/* Frequency */}
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full bg-muted/50 text-xs font-mono text-muted-foreground">
                    {element.frequency}
                  </span>
                </div>

                {/* Mineral */}
                <div className="flex items-center justify-center gap-2">
                  <span 
                    className="font-mono text-lg font-bold"
                    style={{ color: `hsl(var(--${element.color}))` }}
                  >
                    {element.mineralSymbol}
                  </span>
                  <span className="text-muted-foreground text-xs font-mono">{element.mineral}</span>
                </div>

                {/* Crystal */}
                <div className="text-center">
                  <p className="text-foreground/80 font-mono text-xs">💎 {element.crystal}</p>
                </div>

                {/* Featuring */}
                <div className="text-center">
                  {element.featuring ? (
                    <p className="text-primary/90 font-mono text-xs">
                      ft. {formatFeaturing(element.featuring)}
                    </p>
                  ) : (
                    <span className="text-muted-foreground/40 font-mono">—</span>
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
          <p className="text-muted-foreground font-mono text-sm">
            Guided by the <span className="text-throne-gold">Soil Spirits</span>: Spirit, Sunny, Rocky & River
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default MasterMatrix;
