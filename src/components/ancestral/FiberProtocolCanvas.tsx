import { motion } from 'framer-motion';

/**
 * FIBER PROTOCOL: THE CANVAS (CLOTHING)
 * Level 3 - Shango / Dogon
 * 
 * Hemp fiber cultivation for textile sovereignty.
 * "The Dogon teach us that the universe is a woven fabric."
 */

interface FiberProtocolCanvasProps {
  color: string;
}

// Loom Icon SVG
const LoomIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    {/* Loom Frame */}
    <rect x="8" y="8" width="48" height="48" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
    
    {/* Warp Threads (Vertical) */}
    <motion.line x1="16" y1="12" x2="16" y2="52" stroke="currentColor" strokeWidth="1.5"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.1 }} />
    <motion.line x1="24" y1="12" x2="24" y2="52" stroke="currentColor" strokeWidth="1.5"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }} />
    <motion.line x1="32" y1="12" x2="32" y2="52" stroke="currentColor" strokeWidth="1.5"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3 }} />
    <motion.line x1="40" y1="12" x2="40" y2="52" stroke="currentColor" strokeWidth="1.5"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.4 }} />
    <motion.line x1="48" y1="12" x2="48" y2="52" stroke="currentColor" strokeWidth="1.5"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} />
    
    {/* Weft Threads (Horizontal - Weaving) */}
    <motion.line x1="12" y1="20" x2="52" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"
      initial={{ x1: 12 }} animate={{ x1: [12, 12] }} transition={{ duration: 2 }} />
    <motion.line x1="12" y1="28" x2="52" y2="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
    <motion.line x1="12" y1="36" x2="52" y2="36" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
    <motion.line x1="12" y1="44" x2="52" y2="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
    
    {/* Shuttle */}
    <motion.ellipse 
      cx="32" cy="32" rx="6" ry="3" 
      fill="currentColor" 
      opacity="0.6"
      animate={{ cy: [20, 44, 20] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);

const FiberProtocolCanvas = ({ color }: FiberProtocolCanvasProps) => {
  const tasks = [
    { step: 1, title: 'Sow for Density', description: 'Plant close spacing for tall, fiber-rich stalks (not branching seed crops)' },
    { step: 2, title: 'Ret the Fiber', description: 'Lay cut stalks in morning dew or running water (7-14 days) until bark peels easily' },
    { step: 3, title: 'Break the Herd', description: 'Use a brake or wooden mallet to separate bast fiber from woody core' },
    { step: 4, title: 'Hackle & Spin', description: 'Comb fibers through hackle pins, then spin into thread on a drop spindle' },
  ];

  return (
    <motion.div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'linear-gradient(135deg, hsl(200 30% 10%), hsl(180 20% 8%))',
        border: '2px solid hsl(180 40% 30%)',
        boxShadow: '0 0 30px hsl(180 40% 20% / 0.3)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header with Loom Icon */}
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, hsl(45 70% 25%), hsl(30 60% 20%))',
            border: '2px solid hsl(45 80% 40%)',
            boxShadow: '0 0 20px hsl(45 70% 30% / 0.5)',
          }}
        >
          <LoomIcon className="w-10 h-10 text-[hsl(45_90%_70%)]" />
        </div>
        <div>
          <h3 
            className="text-lg font-bold tracking-wider"
            style={{ 
              fontFamily: "'Staatliches', sans-serif",
              color: 'hsl(45 90% 70%)',
            }}
          >
            PROTOCOL: THE CANVAS
          </h3>
          <p className="text-xs font-mono" style={{ color: 'hsl(180 50% 60%)' }}>
            CLOTHING • HEMP FIBER • 120 DAYS
          </p>
        </div>
      </div>

      {/* Cultural Lore */}
      <div 
        className="p-4 rounded-xl italic text-center"
        style={{
          background: 'hsl(0 0% 5% / 0.6)',
          borderLeft: '3px solid hsl(270 50% 50%)',
        }}
      >
        <p 
          className="text-sm leading-relaxed"
          style={{ color: 'hsl(270 40% 75%)' }}
        >
          "The Dogon teach us that the universe is a woven fabric. Shango brings the lightning power. 
          We plant Hemp because it connects the sky to the earth and covers our bodies with strength."
        </p>
      </div>

      {/* The Task Steps */}
      <div className="space-y-3">
        <h4 
          className="text-xs font-mono tracking-wider"
          style={{ color: 'hsl(180 50% 50%)' }}
        >
          THE FIBER PROTOCOL:
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
                background: 'linear-gradient(135deg, hsl(45 60% 35%), hsl(30 50% 25%))',
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
          background: 'hsl(180 30% 15%)',
          border: '1px solid hsl(180 40% 35%)',
        }}
        animate={{
          boxShadow: [
            '0 0 10px hsl(180 40% 30% / 0.3)',
            '0 0 20px hsl(180 40% 30% / 0.5)',
            '0 0 10px hsl(180 40% 30% / 0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-lg">⏱</span>
        <span 
          className="text-sm font-mono font-bold tracking-wider"
          style={{ color: 'hsl(180 60% 65%)' }}
        >
          TIMELINE: 120 DAYS (SEASONAL ARMOR)
        </span>
      </motion.div>
    </motion.div>
  );
};

export default FiberProtocolCanvas;
