import { motion } from 'framer-motion';

/**
 * PROTOCOL: REDOX CHEMISTRY (INDIGO)
 * Level 4 - Oshun / Kemit
 * 
 * Science-first approach: Oxidation-Reduction reactions.
 * "True color is Chemistry. Indigo is insoluble until you master the Redox."
 */

interface RedoxIndigoProtocolProps {
  color: string;
}

// Indigo Molecule - Shows oxidation state change
const IndigoMoleculeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    {/* Reduced state (green/yellow - leuco-indigo) */}
    <motion.g
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <circle cx="20" cy="32" r="8" fill="hsl(80 50% 40%)" />
      <text x="20" y="35" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">-O</text>
    </motion.g>
    
    {/* Transition arrow */}
    <motion.path
      d="M30 32 L42 32"
      stroke="hsl(45 80% 55%)"
      strokeWidth="2"
      strokeLinecap="round"
      markerEnd="url(#arrowhead)"
    />
    <motion.text 
      x="36" y="26" 
      textAnchor="middle" 
      fontSize="5" 
      fill="hsl(45 70% 60%)"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      +O₂
    </motion.text>
    
    {/* Oxidized state (blue - indigo) */}
    <motion.g
      animate={{ 
        opacity: [0.3, 1, 0.3],
        scale: [0.95, 1.05, 0.95]
      }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <circle cx="50" cy="32" r="10" fill="hsl(220 70% 45%)" />
      <motion.circle 
        cx="50" cy="32" r="10" 
        fill="none"
        stroke="hsl(220 80% 60%)"
        strokeWidth="2"
        animate={{ 
          r: [10, 13, 10],
          opacity: [1, 0, 1]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <text x="50" y="35" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">BLUE</text>
    </motion.g>
    
    {/* pH indicator */}
    <rect x="10" y="50" width="44" height="8" rx="2" fill="hsl(0 0% 20%)" stroke="hsl(0 0% 40%)" />
    <motion.rect 
      x="12" y="52" 
      width="20" 
      height="4" 
      rx="1" 
      fill="hsl(120 60% 45%)"
      animate={{ width: [20, 35, 20] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <text x="32" y="56" textAnchor="middle" fontSize="4" fill="white">pH 9-10</text>
  </svg>
);

// Redox badge
const RedoxBadge = () => (
  <motion.div 
    className="flex items-center gap-2 px-3 py-1 rounded-full"
    style={{
      background: 'linear-gradient(90deg, hsl(80 40% 20%), hsl(220 50% 25%))',
      border: '1px solid hsl(180 50% 45%)',
    }}
    animate={{
      background: [
        'linear-gradient(90deg, hsl(80 40% 20%), hsl(220 50% 25%))',
        'linear-gradient(90deg, hsl(220 50% 25%), hsl(80 40% 20%))',
        'linear-gradient(90deg, hsl(80 40% 20%), hsl(220 50% 25%))',
      ],
    }}
    transition={{ duration: 4, repeat: Infinity }}
  >
    <span className="text-sm">⚗️</span>
    <span className="text-xs font-mono font-bold" style={{ color: 'hsl(180 70% 65%)' }}>
      REDUCTION → OXIDATION
    </span>
  </motion.div>
);

const RedoxIndigoProtocol = ({ color }: RedoxIndigoProtocolProps) => {
  const tasks = [
    { step: 1, title: 'Check the pH (Target 9-10)', description: 'Alkaline environment required for reduction. Use wood ash lye or lime water to raise pH' },
    { step: 2, title: 'Observe the "Flower"', description: 'Look for coppery metallic scum on vat surface—sign of successful reduction (oxygen removed)' },
    { step: 3, title: 'Dip the Fabric', description: 'Submerge cotton in yellow-green vat for 15-20 minutes. Fiber absorbs reduced (soluble) indigo' },
    { step: 4, title: 'Watch the Oxygen Turn It Blue', description: 'Remove fabric and expose to air. Oxidation traps indigotin inside cellulose fibers permanently' },
  ];

  return (
    <motion.div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'linear-gradient(135deg, hsl(230 30% 10%), hsl(280 20% 8%))',
        border: '2px solid hsl(220 60% 45%)',
        boxShadow: '0 0 30px hsl(220 60% 30% / 0.4)',
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
            background: 'linear-gradient(135deg, hsl(220 50% 25%), hsl(240 40% 20%))',
            border: '2px solid hsl(220 70% 50%)',
            boxShadow: '0 0 20px hsl(220 60% 40% / 0.5)',
          }}
        >
          <IndigoMoleculeIcon className="w-14 h-14" />
        </div>
        <div>
          <h3 
            className="text-lg font-bold tracking-wider"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(220 80% 70%)',
            }}
          >
            PROTOCOL: REDOX CHEMISTRY
          </h3>
          <p className="text-xs font-mono" style={{ color: 'hsl(51 70% 60%)' }}>
            ADORNMENT • INDIGO • 150 DAYS
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
          <span className="font-bold" style={{ color: 'hsl(220 80% 65%)' }}>True color is Chemistry.</span>{' '}
          <span className="font-bold" style={{ color: 'hsl(230 70% 60%)' }}>Indigo (Indigotin)</span> is{' '}
          <span className="italic">insoluble</span> in water.
        </p>
        <p className="text-sm" style={{ color: 'hsl(200 40% 70%)' }}>
          To adhere it to cotton, you must create a{' '}
          <span className="font-bold" style={{ color: 'hsl(80 60% 55%)' }}>Reduction Reaction</span> (remove oxygen) 
          using a high-pH alkaline fermentation. When the fiber hits the air, it{' '}
          <span className="font-bold" style={{ color: 'hsl(220 70% 60%)' }}>Oxidizes</span> and the color gets{' '}
          <span className="font-bold">trapped inside the cellulose</span>.
        </p>
        
        {/* Redox indicators */}
        <div className="flex flex-wrap gap-2 mt-3">
          <RedoxBadge />
          <motion.div 
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            style={{
              background: 'hsl(120 30% 15%)',
              border: '1px solid hsl(120 50% 40%)',
            }}
          >
            <span className="text-sm">🧪</span>
            <span className="text-xs font-mono font-bold" style={{ color: 'hsl(120 60% 60%)' }}>
              pH 9-10 ALKALINE
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* THE WAY (Culture - Kemit) */}
      <div 
        className="p-4 rounded-xl"
        style={{
          background: 'hsl(0 0% 5% / 0.6)',
          borderLeft: '3px solid hsl(51 90% 50%)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">👑</span>
          <span className="text-xs font-mono font-bold tracking-wider" style={{ color: 'hsl(51 80% 60%)' }}>
            THE WAY (KEMIT)
          </span>
        </div>
        <p 
          className="text-sm leading-relaxed italic"
          style={{ color: 'hsl(51 60% 70%)' }}
        >
          "This is the Kemetic Science of Transformation. Oshun guides the beauty, but the Alchemist manages the pH. 
          We maintain the 'Living Vat' to perform the miracle of turning Green to Blue."
        </p>
      </div>

      {/* Redox Diagram */}
      <motion.div 
        className="p-4 rounded-xl"
        style={{ background: 'hsl(0 0% 8%)' }}
      >
        <div className="flex items-center justify-around">
          {/* Reduced State */}
          <div className="text-center">
            <motion.div 
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
              style={{ background: 'hsl(80 50% 30%)' }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-2xl">🟢</span>
            </motion.div>
            <p className="text-xs font-mono mt-2" style={{ color: 'hsl(80 50% 60%)' }}>REDUCED</p>
            <p className="text-[10px]" style={{ color: 'hsl(0 0% 50%)' }}>Yellow-Green (Soluble)</p>
          </div>
          
          {/* Arrow */}
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-2xl" style={{ color: 'hsl(45 80% 55%)' }}>→ O₂ →</span>
          </motion.div>
          
          {/* Oxidized State */}
          <div className="text-center">
            <motion.div 
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
              style={{ 
                background: 'hsl(220 70% 40%)',
                boxShadow: '0 0 20px hsl(220 70% 50% / 0.5)'
              }}
              animate={{ 
                boxShadow: [
                  '0 0 15px hsl(220 70% 50% / 0.3)',
                  '0 0 30px hsl(220 70% 50% / 0.6)',
                  '0 0 15px hsl(220 70% 50% / 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl">🔵</span>
            </motion.div>
            <p className="text-xs font-mono mt-2" style={{ color: 'hsl(220 70% 65%)' }}>OXIDIZED</p>
            <p className="text-[10px]" style={{ color: 'hsl(0 0% 50%)' }}>Royal Blue (Locked)</p>
          </div>
        </div>
        <p className="text-xs font-mono text-center mt-3" style={{ color: 'hsl(220 50% 55%)' }}>
          INDIGOTIN MOLECULE — Color trapped by oxygen exposure
        </p>
      </motion.div>

      {/* The Task Steps */}
      <div className="space-y-3">
        <h4 
          className="text-xs font-mono tracking-wider flex items-center gap-2"
          style={{ color: 'hsl(220 60% 60%)' }}
        >
          <span>🎨</span> THE ALCHEMY PROTOCOL:
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
                background: idx < 2 
                  ? 'linear-gradient(135deg, hsl(80 50% 30%), hsl(60 40% 25%))' 
                  : 'linear-gradient(135deg, hsl(220 60% 40%), hsl(230 50% 30%))',
                color: 'white',
                boxShadow: idx < 2 
                  ? '0 0 10px hsl(80 50% 30% / 0.5)' 
                  : '0 0 10px hsl(220 60% 40% / 0.5)',
              }}
            >
              {task.step}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: idx < 2 ? 'hsl(80 60% 60%)' : 'hsl(220 70% 70%)' }}>
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
          background: 'linear-gradient(90deg, hsl(51 40% 15%), hsl(220 40% 15%))',
          border: '1px solid hsl(220 60% 50%)',
        }}
        animate={{
          boxShadow: [
            '0 0 10px hsl(220 60% 40% / 0.3)',
            '0 0 25px hsl(220 60% 40% / 0.6)',
            '0 0 10px hsl(220 60% 40% / 0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-lg">👑</span>
        <span 
          className="text-sm font-mono font-bold tracking-wider"
          style={{ color: 'hsl(220 80% 70%)' }}
        >
          TIMELINE: 150 DAYS (THE ROYAL BLUE)
        </span>
      </motion.div>
    </motion.div>
  );
};

export default RedoxIndigoProtocol;
