import { motion } from 'framer-motion';

/**
 * PROTOCOL: STRUCTURAL CARBON (BAMBOO)
 * Level 1 - Ogun / Muscogee
 * 
 * Bamboo cultivation for shelter construction.
 * Science-first approach: C4 carbon sequestration & tensile strength.
 */

interface BambooStructuralProtocolProps {
  color: string;
}

// Bamboo Vascular Bundle Icon - Shows the strength structure
const BambooVascularIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    {/* Bamboo cross-section - vascular bundles */}
    <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2" fill="hsl(80 30% 15%)" />
    
    {/* Vascular bundles (the strength source) */}
    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
      const x = 32 + 12 * Math.cos((angle * Math.PI) / 180);
      const y = 32 + 12 * Math.sin((angle * Math.PI) / 180);
      return (
        <motion.g key={i}>
          <circle cx={x} cy={y} r="5" fill="hsl(90 50% 35%)" />
          <motion.circle 
            cx={x} cy={y} r="3" 
            fill="hsl(60 70% 50%)"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
          />
        </motion.g>
      );
    })}
    
    {/* Inner ring of bundles */}
    {[30, 90, 150, 210, 270, 330].map((angle, i) => {
      const x = 32 + 6 * Math.cos((angle * Math.PI) / 180);
      const y = 32 + 6 * Math.sin((angle * Math.PI) / 180);
      return (
        <motion.circle 
          key={`inner-${i}`}
          cx={x} cy={y} r="2.5" 
          fill="hsl(80 60% 45%)"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
        />
      );
    })}
    
    {/* Center pith */}
    <circle cx="32" cy="32" r="2" fill="hsl(45 40% 60%)" />
    
    {/* Outer fibers */}
    <motion.circle 
      cx="32" cy="32" r="20" 
      stroke="hsl(80 50% 40%)" 
      strokeWidth="1" 
      strokeDasharray="3 2"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

// Carbon sequestration indicator
const CarbonBadge = () => (
  <motion.div 
    className="flex items-center gap-2 px-3 py-1 rounded-full"
    style={{
      background: 'linear-gradient(90deg, hsl(120 40% 20%), hsl(90 30% 15%))',
      border: '1px solid hsl(120 50% 35%)',
    }}
    animate={{
      boxShadow: [
        '0 0 8px hsl(120 50% 30% / 0.3)',
        '0 0 15px hsl(120 50% 30% / 0.5)',
        '0 0 8px hsl(120 50% 30% / 0.3)',
      ],
    }}
    transition={{ duration: 3, repeat: Infinity }}
  >
    <span className="text-sm">🌿</span>
    <span className="text-xs font-mono font-bold" style={{ color: 'hsl(120 60% 60%)' }}>
      C4 GRASS • 4× CARBON
    </span>
  </motion.div>
);

const BambooStructuralProtocol = ({ color }: BambooStructuralProtocolProps) => {
  const tasks = [
    { step: 1, title: 'Plant the Rhizome Barrier', description: 'Install running bamboo rhizomes in trenched containment (prevent spread with HDPE barrier)' },
    { step: 2, title: 'Selective Cull at Year 2', description: 'Remove 30% of culms to increase diameter and wall thickness of remaining poles' },
    { step: 3, title: 'Harvest at Peak Lignin (3-5 Years)', description: 'Cut culms after lignification complete—tap test for hollow resonance' },
    { step: 4, title: 'Cure for Construction', description: 'Vertical dry cure for 8-12 weeks. Borate treat for insect resistance. Ready for Wattle & Daub' },
  ];

  return (
    <motion.div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'linear-gradient(135deg, hsl(80 25% 10%), hsl(60 20% 8%))',
        border: '2px solid hsl(80 50% 35%)',
        boxShadow: '0 0 30px hsl(80 50% 25% / 0.3)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header with Vascular Bundle Icon */}
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, hsl(80 40% 20%), hsl(60 30% 15%))',
            border: '2px solid hsl(80 60% 40%)',
            boxShadow: '0 0 20px hsl(80 50% 30% / 0.5)',
          }}
        >
          <BambooVascularIcon className="w-12 h-12 text-[hsl(80_70%_60%)]" />
        </div>
        <div>
          <h3 
            className="text-lg font-bold tracking-wider"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(80 80% 65%)',
            }}
          >
            PROTOCOL: STRUCTURAL CARBON
          </h3>
          <p className="text-xs font-mono" style={{ color: 'hsl(45 50% 55%)' }}>
            SHELTER • BAMBOO • 3-5 YEARS
          </p>
        </div>
      </div>

      {/* THE SCIENCE (Lead) */}
      <motion.div 
        className="p-4 rounded-xl space-y-3"
        style={{
          background: 'linear-gradient(135deg, hsl(200 30% 12%), hsl(220 25% 10%))',
          border: '1px solid hsl(200 40% 30%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🔬</span>
          <span className="text-xs font-mono font-bold tracking-wider" style={{ color: 'hsl(200 60% 60%)' }}>
            THE SCIENCE
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 80%)' }}>
          <span className="font-bold" style={{ color: 'hsl(80 70% 60%)' }}>Bamboo is a C4 Grass.</span> It sequesters{' '}
          <span className="font-bold" style={{ color: 'hsl(120 60% 55%)' }}>4× the carbon of timber</span> and possesses a tensile strength of{' '}
          <span className="font-bold" style={{ color: 'hsl(45 80% 60%)' }}>28,000 PSI</span> (higher than steel).
        </p>
        <p className="text-sm italic" style={{ color: 'hsl(200 40% 65%)' }}>
          To build shelter, you must grow the strongest molecule.
        </p>
        
        {/* Strength comparison */}
        <div className="flex gap-3 mt-3">
          <CarbonBadge />
          <motion.div 
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{
              background: 'hsl(30 30% 15%)',
              border: '1px solid hsl(30 50% 40%)',
            }}
          >
            <span className="text-sm">💪</span>
            <span className="text-xs font-mono font-bold" style={{ color: 'hsl(30 60% 60%)' }}>
              28,000 PSI TENSILE
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* THE WAY (Culture) */}
      <div 
        className="p-4 rounded-xl"
        style={{
          background: 'hsl(0 0% 5% / 0.6)',
          borderLeft: '3px solid hsl(0 60% 45%)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🏛️</span>
          <span className="text-xs font-mono font-bold tracking-wider" style={{ color: 'hsl(0 50% 60%)' }}>
            THE WAY (MUSCOGEE)
          </span>
        </div>
        <p 
          className="text-sm leading-relaxed italic"
          style={{ color: 'hsl(40 50% 70%)' }}
        >
          "The Muscogee were the engineers of this grass. They used the 'Green Iron' (River Cane) to reinforce the mounds and weave the walls (Wattle & Daub). We follow their blueprint to build our perimeter."
        </p>
      </div>

      {/* Vascular Bundle Diagram */}
      <motion.div 
        className="flex items-center justify-center p-4 rounded-xl"
        style={{ background: 'hsl(0 0% 8%)' }}
      >
        <div className="text-center">
          <BambooVascularIcon className="w-24 h-24 mx-auto text-[hsl(80_60%_50%)]" />
          <p className="text-xs font-mono mt-2" style={{ color: 'hsl(80 50% 55%)' }}>
            VASCULAR BUNDLES — Source of Strength
          </p>
          <p className="text-xs mt-1" style={{ color: 'hsl(0 0% 50%)' }}>
            Dense fiber arrangement = maximum tensile capacity
          </p>
        </div>
      </motion.div>

      {/* The Task Steps */}
      <div className="space-y-3">
        <h4 
          className="text-xs font-mono tracking-wider flex items-center gap-2"
          style={{ color: 'hsl(80 50% 50%)' }}
        >
          <span>⚒️</span> THE CONSTRUCTION PROTOCOL:
        </h4>
        {tasks.map((task, idx) => (
          <motion.div
            key={task.step}
            className="flex gap-3 p-3 rounded-lg"
            style={{ background: 'hsl(0 0% 8%)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, hsl(80 50% 30%), hsl(60 40% 25%))',
                color: 'hsl(80 80% 80%)',
                boxShadow: '0 0 10px hsl(80 50% 25% / 0.5)',
              }}
            >
              {task.step}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'hsl(80 60% 65%)' }}>
                {task.title}
              </p>
              <p className="text-xs mt-1" style={{ color: 'hsl(0 0% 60%)' }}>
                {task.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timeline Badge */}
      <motion.div 
        className="flex items-center justify-center gap-2 py-2 rounded-full"
        style={{
          background: 'hsl(80 30% 12%)',
          border: '1px solid hsl(80 50% 40%)',
        }}
        animate={{
          boxShadow: [
            '0 0 10px hsl(80 50% 30% / 0.3)',
            '0 0 20px hsl(80 50% 30% / 0.5)',
            '0 0 10px hsl(80 50% 30% / 0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-lg">🏠</span>
        <span 
          className="text-sm font-mono font-bold tracking-wider"
          style={{ color: 'hsl(80 70% 60%)' }}
        >
          TIMELINE: 3-5 YEARS (THE FORTRESS)
        </span>
      </motion.div>
    </motion.div>
  );
};

export default BambooStructuralProtocol;
