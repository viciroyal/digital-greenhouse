import { motion } from 'framer-motion';

/**
 * FIBER PROTOCOL: THE ROBE (ADORNMENT)
 * Level 4 - Oshun / Kemit
 * 
 * Cotton & Indigo cultivation for royal textile alchemy.
 * "Kemit wrapped the Kings in linen. Oshun brings the beauty."
 */

interface FiberProtocolRobeProps {
  color: string;
}

// Cotton Boll Icon
const CottonBollIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    {/* Boll Petals */}
    <motion.ellipse 
      cx="32" cy="20" rx="10" ry="12" 
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    />
    <motion.ellipse 
      cx="20" cy="30" rx="10" ry="12" 
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
    <motion.ellipse 
      cx="44" cy="30" rx="10" ry="12" 
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    />
    <motion.ellipse 
      cx="26" cy="42" rx="10" ry="12" 
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    />
    <motion.ellipse 
      cx="38" cy="42" rx="10" ry="12" 
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    />
    
    {/* Stem */}
    <line x1="32" y1="52" x2="32" y2="62" stroke="hsl(120 30% 35%)" strokeWidth="3" strokeLinecap="round" />
    
    {/* Leaves */}
    <path d="M32 56 Q22 52 18 58" stroke="hsl(120 40% 40%)" strokeWidth="2" fill="none" />
    <path d="M32 56 Q42 52 46 58" stroke="hsl(120 40% 40%)" strokeWidth="2" fill="none" />
  </svg>
);

// Indigo Vat Icon
const IndigoVatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    {/* Vat */}
    <motion.path 
      d="M12 24 L12 52 Q12 58 20 58 L44 58 Q52 58 52 52 L52 24"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    
    {/* Vat rim */}
    <ellipse cx="32" cy="24" rx="20" ry="6" stroke="currentColor" strokeWidth="2" fill="hsl(220 60% 20%)" />
    
    {/* Liquid surface - Deep Blue */}
    <motion.ellipse 
      cx="32" cy="26" 
      rx="18" ry="5" 
      fill="hsl(230 70% 30%)"
      animate={{
        fill: ['hsl(230 70% 30%)', 'hsl(210 80% 25%)', 'hsl(230 70% 30%)'],
      }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    
    {/* Bubbles */}
    <motion.circle 
      cx="26" cy="35" r="2" 
      fill="hsl(200 60% 50%)"
      animate={{ cy: [35, 28], opacity: [1, 0] }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
    />
    <motion.circle 
      cx="38" cy="40" r="1.5" 
      fill="hsl(200 60% 50%)"
      animate={{ cy: [40, 28], opacity: [1, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
    />
    
    {/* Dipping cloth */}
    <motion.path
      d="M28 10 L28 30 Q28 35 32 35 Q36 35 36 30 L36 10"
      stroke="hsl(0 0% 80%)"
      strokeWidth="2"
      fill="none"
      animate={{
        stroke: ['hsl(0 0% 80%)', 'hsl(220 70% 40%)', 'hsl(230 80% 30%)'],
      }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </svg>
);

const FiberProtocolRobe = ({ color }: FiberProtocolRobeProps) => {
  const tasks = [
    { step: 1, title: 'Harvest the Bolls', description: 'Pick cotton when bolls fully open and fiber is bright white (morning dew evaporated)' },
    { step: 2, title: 'Prepare the Indigo Vat', description: 'Ferment leaves in high-pH solution (wood ash lye) for 7 days until "flower" forms' },
    { step: 3, title: 'Build the Reduction', description: 'Add organic matter (dates/honey) to remove oxygen and turn vat yellow-green' },
    { step: 4, title: 'Dip the Cloth', description: 'Submerge for 15 minutes, oxidize in air until blue appears. Repeat for depth.' },
  ];

  return (
    <motion.div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'linear-gradient(135deg, hsl(230 30% 10%), hsl(280 20% 8%))',
        border: '2px solid hsl(51 80% 40%)',
        boxShadow: '0 0 30px hsl(51 80% 30% / 0.3)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header with Icons */}
      <div className="flex items-center gap-4">
        <div className="flex -space-x-4">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center z-10"
            style={{ 
              background: 'linear-gradient(135deg, hsl(0 0% 95%), hsl(0 0% 85%))',
              border: '2px solid hsl(51 80% 50%)',
              boxShadow: '0 0 15px hsl(51 70% 40% / 0.5)',
            }}
          >
            <CottonBollIcon className="w-10 h-10 text-[hsl(0_0%_95%)]" />
          </div>
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, hsl(230 60% 25%), hsl(240 50% 20%))',
              border: '2px solid hsl(220 70% 50%)',
              boxShadow: '0 0 15px hsl(220 70% 40% / 0.5)',
            }}
          >
            <IndigoVatIcon className="w-10 h-10 text-[hsl(220_60%_70%)]" />
          </div>
        </div>
        <div>
          <h3 
            className="text-lg font-bold tracking-wider"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(51 100% 70%)',
            }}
          >
            PROTOCOL: THE ROBE
          </h3>
          <p className="text-xs font-mono" style={{ color: 'hsl(220 60% 65%)' }}>
            ADORNMENT • COTTON & INDIGO • 150 DAYS
          </p>
        </div>
      </div>

      {/* Cultural Lore */}
      <div 
        className="p-4 rounded-xl italic text-center"
        style={{
          background: 'hsl(0 0% 5% / 0.6)',
          borderLeft: '3px solid hsl(51 90% 50%)',
        }}
      >
        <p 
          className="text-sm leading-relaxed"
          style={{ color: 'hsl(51 70% 75%)' }}
        >
          "Kemit wrapped the Kings in linen. Oshun brings the beauty. 
          We grow Cotton for the cloud and Indigo for the mystery. We ferment the leaf to find the blue."
        </p>
      </div>

      {/* Alchemy Note */}
      <motion.div 
        className="flex items-center gap-3 p-3 rounded-lg"
        style={{
          background: 'linear-gradient(90deg, hsl(220 40% 15%), hsl(280 30% 12%))',
          border: '1px solid hsl(220 50% 35%)',
        }}
        animate={{
          borderColor: ['hsl(220 50% 35%)', 'hsl(280 50% 40%)', 'hsl(220 50% 35%)'],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <span className="text-2xl">🧪</span>
        <p className="text-xs font-mono" style={{ color: 'hsl(220 50% 70%)' }}>
          <span className="font-bold">THE BLUE GOLD:</span> Turning a green leaf into blue dye is pure Chemical Alchemy. 
          The color only appears when oxygen meets the cloth.
        </p>
      </motion.div>

      {/* The Task Steps */}
      <div className="space-y-3">
        <h4 
          className="text-xs font-mono tracking-wider"
          style={{ color: 'hsl(51 70% 55%)' }}
        >
          THE ADORNMENT PROTOCOL:
        </h4>
        {tasks.map((task, idx) => (
          <motion.div
            key={task.step}
            className="flex gap-3 p-3 rounded-lg"
            style={{ background: 'hsl(0 0% 8%)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm"
              style={{
                background: idx < 2 
                  ? 'linear-gradient(135deg, hsl(0 0% 90%), hsl(0 0% 80%))' 
                  : 'linear-gradient(135deg, hsl(220 60% 35%), hsl(230 50% 25%))',
                color: idx < 2 ? 'hsl(30 40% 30%)' : 'hsl(200 60% 85%)',
                boxShadow: idx < 2 
                  ? '0 0 10px hsl(0 0% 70% / 0.5)' 
                  : '0 0 10px hsl(220 60% 40% / 0.5)',
              }}
            >
              {task.step}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: idx < 2 ? 'hsl(40 50% 70%)' : 'hsl(220 60% 75%)' }}>
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
          border: '1px solid hsl(51 70% 45%)',
        }}
        animate={{
          boxShadow: [
            '0 0 10px hsl(51 70% 40% / 0.3)',
            '0 0 25px hsl(51 70% 40% / 0.6)',
            '0 0 10px hsl(51 70% 40% / 0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-lg">👑</span>
        <span 
          className="text-sm font-mono font-bold tracking-wider"
          style={{ color: 'hsl(51 90% 65%)' }}
        >
          TIMELINE: 150 DAYS (THE ART)
        </span>
      </motion.div>
    </motion.div>
  );
};

export default FiberProtocolRobe;
