import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Globe, Wifi, Users } from 'lucide-react';

interface NetworkNode {
  id: number;
  lat: number;
  lng: number;
  delay: number;
}

/**
 * THE RESONANT CHAMBER - The Mycelial Network
 * 
 * A 3D community map showing the global network of listeners
 * connected to the Source (Rockdale County, GA).
 */
const ResonantChamber = () => {
  const [activeNodes, setActiveNodes] = useState(1243);
  const [isPlanting, setIsPlanting] = useState(false);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([]);
  const [userNode, setUserNode] = useState<{ x: number; y: number } | null>(null);
  const globeRef = useRef<HTMLDivElement>(null);

  // Generate random network nodes on mount
  useEffect(() => {
    const nodes: NetworkNode[] = [];
    for (let i = 0; i < 24; i++) {
      nodes.push({
        id: i,
        lat: Math.random() * 140 - 70, // -70 to 70
        lng: Math.random() * 360 - 180, // -180 to 180
        delay: Math.random() * 2,
      });
    }
    setNetworkNodes(nodes);
  }, []);

  // Source location: Rockdale County, GA (approximately 33.6°N, 84.0°W)
  const sourceLocation = { lat: 33.6, lng: -84.0 };

  // Convert lat/lng to 3D sphere position
  const latLngToPosition = (lat: number, lng: number, radius: number = 42) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return { x, y, z };
  };

  const handlePlantFrequency = (e: React.MouseEvent) => {
    if (globeRef.current) {
      const rect = globeRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setUserNode({ x, y });
    }
    
    setIsPlanting(true);
    setActiveNodes(prev => prev + 1);
    
    setTimeout(() => {
      setIsPlanting(false);
    }, 2000);
  };

  const sourcePos = latLngToPosition(sourceLocation.lat, sourceLocation.lng);

  return (
    <section 
      id="network" 
      className="relative py-24 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, hsl(250 50% 15% / 0.5) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, hsl(40 60% 15% / 0.3) 0%, transparent 40%),
          linear-gradient(180deg, hsl(10 25% 8%) 0%, hsl(250 40% 8%) 50%, hsl(10 25% 8%) 100%)
        `,
      }}
    >
      {/* Section Header */}
      <motion.div
        className="text-center mb-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-cyan-400/80 mb-2">
          PROOF OF RESONANCE
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
          THE MYCELIAL NETWORK
        </h2>
        <p className="font-body text-muted-foreground max-w-xl mx-auto">
          Every frequency planted creates a thread in the Wood Wide Web.
          Your vibration joins the global chorus.
        </p>
      </motion.div>

      {/* Globe Container */}
      <div className="relative max-w-4xl mx-auto px-4">
        <motion.div
          ref={globeRef}
          className="relative aspect-square max-w-lg mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* CSS 3D Globe */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, hsl(250 50% 25%) 0%, hsl(250 60% 8%) 50%, hsl(250 70% 5%) 100%)
              `,
              boxShadow: `
                inset -20px -20px 60px rgba(0,0,0,0.5),
                inset 10px 10px 40px rgba(100, 150, 255, 0.1),
                0 0 80px rgba(100, 150, 255, 0.2),
                0 0 120px rgba(100, 150, 255, 0.1)
              `,
            }}
          >
            {/* Globe Grid Lines */}
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full opacity-20"
              style={{ transform: 'rotateX(20deg)' }}
            >
              {/* Latitude lines */}
              {[20, 35, 50, 65, 80].map((y) => (
                <ellipse
                  key={`lat-${y}`}
                  cx="50"
                  cy={y}
                  rx={Math.sin((y / 100) * Math.PI) * 48}
                  ry={5}
                  fill="none"
                  stroke="hsl(200 80% 60%)"
                  strokeWidth="0.3"
                />
              ))}
              {/* Longitude lines */}
              {[0, 30, 60, 90, 120, 150].map((angle) => (
                <ellipse
                  key={`lng-${angle}`}
                  cx="50"
                  cy="50"
                  rx={2}
                  ry={48}
                  fill="none"
                  stroke="hsl(200 80% 60%)"
                  strokeWidth="0.3"
                  transform={`rotate(${angle} 50 50)`}
                />
              ))}
            </svg>

            {/* Continents (simplified shapes) */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-40">
              {/* North America */}
              <path
                d="M 20 25 Q 25 20 35 22 L 38 30 Q 35 38 28 40 L 22 35 Z"
                fill="hsl(250 40% 20%)"
                stroke="hsl(200 60% 40%)"
                strokeWidth="0.3"
              />
              {/* South America */}
              <path
                d="M 28 52 Q 32 48 35 50 L 34 65 Q 30 70 28 65 Z"
                fill="hsl(250 40% 20%)"
                stroke="hsl(200 60% 40%)"
                strokeWidth="0.3"
              />
              {/* Europe/Africa */}
              <path
                d="M 48 28 Q 55 25 58 30 L 56 45 Q 52 55 48 50 L 46 35 Z"
                fill="hsl(250 40% 20%)"
                stroke="hsl(200 60% 40%)"
                strokeWidth="0.3"
              />
              {/* Asia */}
              <path
                d="M 60 22 Q 75 18 80 28 L 78 40 Q 70 45 62 38 Z"
                fill="hsl(250 40% 20%)"
                stroke="hsl(200 60% 40%)"
                strokeWidth="0.3"
              />
              {/* Australia */}
              <path
                d="M 75 55 Q 82 52 85 58 L 82 65 Q 76 66 75 60 Z"
                fill="hsl(250 40% 20%)"
                stroke="hsl(200 60% 40%)"
                strokeWidth="0.3"
              />
            </svg>

            {/* Network Lines (Hyphae) */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              {networkNodes.map((node) => {
                // Source point (GA)
                const sourceX = 28;
                const sourceY = 35;
                // Random destination
                const destX = 50 + node.lng / 5;
                const destY = 50 - node.lat / 3;
                
                return (
                  <motion.line
                    key={node.id}
                    x1={sourceX}
                    y1={sourceY}
                    x2={destX}
                    y2={destY}
                    stroke="url(#hyphaGradient)"
                    strokeWidth="0.3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{
                      duration: 2,
                      delay: node.delay,
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: 3,
                    }}
                  />
                );
              })}
              <defs>
                <linearGradient id="hyphaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(40 80% 60%)" stopOpacity="1" />
                  <stop offset="100%" stopColor="hsl(200 80% 60%)" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>

            {/* THE SOURCE - Rockdale County, GA */}
            <motion.div
              className="absolute"
              style={{
                left: '28%',
                top: '35%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{
                  background: 'radial-gradient(circle, hsl(40 90% 60%) 0%, hsl(40 80% 40%) 100%)',
                  boxShadow: `
                    0 0 20px hsl(40 90% 50%),
                    0 0 40px hsl(40 80% 40% / 0.5),
                    0 0 60px hsl(40 70% 30% / 0.3)
                  `,
                }}
              />
            </motion.div>

            {/* User planted node ripple */}
            <AnimatePresence>
              {userNode && isPlanting && (
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    left: userNode.x,
                    top: userNode.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  <div 
                    className="w-8 h-8 rounded-full border-2"
                    style={{
                      borderColor: 'hsl(40 80% 60%)',
                      boxShadow: '0 0 20px hsl(40 80% 50%)',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ambient glow */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, transparent 40%, hsl(200 60% 20% / 0.2) 100%)',
            }}
          />
        </motion.div>

        {/* Stats Panel */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {/* Active Nodes Counter */}
          <div 
            className="glass-card px-8 py-6 text-center"
            style={{
              background: 'linear-gradient(135deg, hsl(200 40% 10% / 0.8), hsl(250 40% 10% / 0.6))',
              border: '1px solid hsl(200 60% 40% / 0.3)',
              boxShadow: '0 0 30px hsl(200 60% 30% / 0.2)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="font-mono text-xs tracking-wider text-cyan-400/80">
                ACTIVE NODES
              </span>
            </div>
            <motion.p 
              className="font-display text-4xl text-foreground"
              key={activeNodes}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              {activeNodes.toLocaleString()}
            </motion.p>
          </div>

          {/* Signal Strength */}
          <div 
            className="glass-card px-8 py-6 text-center"
            style={{
              background: 'linear-gradient(135deg, hsl(40 40% 10% / 0.8), hsl(30 40% 10% / 0.6))',
              border: '1px solid hsl(40 60% 40% / 0.3)',
              boxShadow: '0 0 30px hsl(40 60% 30% / 0.2)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Wifi className="w-5 h-5 text-throne-gold" />
              <span className="font-mono text-xs tracking-wider text-throne-gold/80">
                SIGNAL STRENGTH
              </span>
            </div>
            <p className="font-display text-4xl text-foreground">
              98.7%
            </p>
          </div>
        </motion.div>

        {/* Plant Your Frequency Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handlePlantFrequency}
            disabled={isPlanting}
            className="group relative px-8 py-4 font-mono text-sm tracking-wider uppercase"
            style={{
              background: isPlanting 
                ? 'linear-gradient(135deg, hsl(40 60% 25%), hsl(40 50% 20%))'
                : 'linear-gradient(135deg, hsl(40 70% 40%), hsl(40 60% 30%))',
              border: '1px solid hsl(40 60% 50% / 0.5)',
              borderRadius: '9999px',
              boxShadow: isPlanting
                ? '0 0 40px hsl(40 70% 40% / 0.4), inset 0 0 20px hsl(40 80% 50% / 0.2)'
                : '0 0 20px hsl(40 70% 40% / 0.3)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-3 text-foreground">
              <Globe className="w-5 h-5" />
              {isPlanting ? 'PLANTING...' : 'PLANT YOUR FREQUENCY'}
            </span>
            
            {/* Button glow animation */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, hsl(40 80% 50% / 0.3), transparent 70%)',
              }}
              animate={isPlanting ? {
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ResonantChamber;
