import { motion } from 'framer-motion';

/**
 * PROTOCOL: BAST FIBER PHYSICS (HEMP)
 * Level 3 - Shango / Dogon
 * 
 * Science-first approach: Phloem anatomy & UV resistance.
 * "Clothing protects because Hemp Bast Fiber is high in cellulose, low in lignin."
 */

interface BastFiberProtocolProps {
  color: string;
}

// Bast Fiber Cross-Section - Shows cellulose bundles
const BastFiberIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    {/* Stem cross-section */}
    <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2" fill="hsl(100 20% 12%)" />
    
    {/* Bast fiber ring (phloem layer) */}
    <motion.circle 
      cx="32" cy="32" r="22" 
      stroke="hsl(45 70% 50%)" 
      strokeWidth="4"
      fill="none"
      strokeDasharray="8 3"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    />
    
    {/* Inner core (woody hurd) */}
    <circle cx="32" cy="32" r="16" fill="hsl(30 25% 20%)" />
    
    {/* Cellulose fiber bundles in bast layer */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
      const x = 32 + 19 * Math.cos((angle * Math.PI) / 180);
      const y = 32 + 19 * Math.sin((angle * Math.PI) / 180);
      return (
        <motion.circle 
          key={i}
          cx={x} cy={y} r="2.5" 
          fill="hsl(50 80% 55%)"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
        />
      );
    })}
    
    {/* Hollow pith center */}
    <circle cx="32" cy="32" r="6" fill="hsl(100 15% 8%)" />
    
    {/* Labels */}
    <text x="32" y="10" textAnchor="middle" fontSize="4" fill="hsl(45 60% 60%)" fontWeight="bold">
      BAST
    </text>
  </svg>
);

// Cellulose strength indicator
const CelluloseBadge = () => (
  <motion.div 
    className="flex items-center gap-2 px-3 py-1 rounded-full"
    style={{
      background: 'linear-gradient(90deg, hsl(45 40% 18%), hsl(30 30% 15%))',
      border: '1px solid hsl(45 60% 45%)',
    }}
    animate={{
      boxShadow: [
        '0 0 8px hsl(45 60% 35% / 0.3)',
        '0 0 15px hsl(45 60% 35% / 0.5)',
        '0 0 8px hsl(45 60% 35% / 0.3)',
      ],
    }}
    transition={{ duration: 3, repeat: Infinity }}
  >
    <span className="text-sm">🧬</span>
    <span className="text-xs font-mono font-bold" style={{ color: 'hsl(45 70% 60%)' }}>
      HIGH CELLULOSE • LOW LIGNIN
    </span>
  </motion.div>
);

const BastFiberProtocol = ({ color }: BastFiberProtocolProps) => {
  const tasks = [
    { step: 1, title: 'Ret the Stalks in Dew', description: 'Lay cut stalks in morning dew for 7-14 days to dissolve the pectin binding fiber to stem' },
    { step: 2, title: 'Break the Hurd', description: 'Use a brake or wooden mallet to shatter the woody core and free the bast fibers' },
    { step: 3, title: 'Hackle & Comb', description: 'Draw fibers through hackle pins to align cellulose strands and remove short tow' },
    { step: 4, title: 'Spin on the Spindle', description: 'Draft and twist aligned fibers into continuous thread for the Dogon Grid (Loom)' },
  ];

  return (
    <motion.div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'linear-gradient(135deg, hsl(200 30% 10%), hsl(180 20% 8%))',
        border: '2px solid hsl(45 60% 40%)',
        boxShadow: '0 0 30px hsl(45 50% 25% / 0.3)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, hsl(45 50% 22%), hsl(30 40% 18%))',
            border: '2px solid hsl(45 70% 45%)',
            boxShadow: '0 0 20px hsl(45 60% 30% / 0.5)',
          }}
        >
          <BastFiberIcon className="w-12 h-12 text-[hsl(45_80%_60%)]" />
        </div>
        <div>
          <h3 
            className="text-lg font-bold tracking-wider"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(45 90% 70%)',
            }}
          >
            PROTOCOL: BAST FIBER PHYSICS
          </h3>
          <p className="text-xs font-mono" style={{ color: 'hsl(180 50% 60%)' }}>
            CLOTHING • HEMP PHLOEM • 120 DAYS
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
          <span className="font-bold" style={{ color: 'hsl(45 80% 60%)' }}>Clothing protects</span> because the Hemp Bast Fiber is{' '}
          <span className="font-bold" style={{ color: 'hsl(120 60% 55%)' }}>high in cellulose</span> and{' '}
          <span className="font-bold" style={{ color: 'hsl(30 70% 55%)' }}>low in lignin</span>.
        </p>
        <p className="text-sm" style={{ color: 'hsl(200 40% 70%)' }}>
          It is the <span className="font-bold">Phloem</span> of the plant—designed by nature to transport energy and{' '}
          <span className="italic">resist UV radiation</span>. It is the ultimate shield.
        </p>
        
        {/* Cellulose indicators */}
        <div className="flex flex-wrap gap-2 mt-3">
          <CelluloseBadge />
          <motion.div 
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{
              background: 'hsl(280 30% 15%)',
              border: '1px solid hsl(280 50% 45%)',
            }}
          >
            <span className="text-sm">☀️</span>
            <span className="text-xs font-mono font-bold" style={{ color: 'hsl(280 60% 65%)' }}>
              UV RESISTANT
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* THE WAY (Culture - Dogon) */}
      <div 
        className="p-4 rounded-xl"
        style={{
          background: 'hsl(0 0% 5% / 0.6)',
          borderLeft: '3px solid hsl(270 50% 50%)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🕸️</span>
          <span className="text-xs font-mono font-bold tracking-wider" style={{ color: 'hsl(270 50% 65%)' }}>
            THE WAY (DOGON)
          </span>
        </div>
        <p 
          className="text-sm leading-relaxed italic"
          style={{ color: 'hsl(270 40% 75%)' }}
        >
          "The Dogon Elders teach us that to weave is to speak. The Loom organizes the chaotic fiber into the 'Grid of the Universe.' 
          We use Shango's energy to ret (separate) the fiber, and the Dogon Grid to weave the protection."
        </p>
      </div>

      {/* Fiber Anatomy Diagram */}
      <motion.div 
        className="flex items-center justify-center p-4 rounded-xl"
        style={{ background: 'hsl(0 0% 8%)' }}
      >
        <div className="text-center">
          <BastFiberIcon className="w-24 h-24 mx-auto text-[hsl(45_70%_55%)]" />
          <p className="text-xs font-mono mt-2" style={{ color: 'hsl(45 60% 60%)' }}>
            BAST FIBER ANATOMY — Cellulose Bundles
          </p>
          <p className="text-xs mt-1" style={{ color: 'hsl(0 0% 50%)' }}>
            Phloem layer = strongest fiber concentration
          </p>
        </div>
      </motion.div>

      {/* The Task Steps */}
      <div className="space-y-3">
        <h4 
          className="text-xs font-mono tracking-wider flex items-center gap-2"
          style={{ color: 'hsl(45 60% 55%)' }}
        >
          <span>🧵</span> THE FIBER PROTOCOL:
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
                background: 'linear-gradient(135deg, hsl(45 60% 35%), hsl(30 50% 28%))',
                color: 'hsl(45 90% 85%)',
                boxShadow: '0 0 10px hsl(45 60% 30% / 0.5)',
              }}
            >
              {task.step}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'hsl(45 70% 70%)' }}>
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
          background: 'hsl(180 30% 12%)',
          border: '1px solid hsl(180 50% 40%)',
        }}
        animate={{
          boxShadow: [
            '0 0 10px hsl(180 50% 30% / 0.3)',
            '0 0 20px hsl(180 50% 30% / 0.5)',
            '0 0 10px hsl(180 50% 30% / 0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-lg">👕</span>
        <span 
          className="text-sm font-mono font-bold tracking-wider"
          style={{ color: 'hsl(180 60% 60%)' }}
        >
          TIMELINE: 120 DAYS (THE SHIELD)
        </span>
      </motion.div>
    </motion.div>
  );
};

export default BastFiberProtocol;
