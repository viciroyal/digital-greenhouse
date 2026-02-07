import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyholeButton } from '@/components/portal';

interface MenuNode {
  id: string;
  label: string;
  href: string;
}

/**
 * Apothecary Menu Nomenclature ("THE INDEX"):
 * - "Menu" → "THE INDEX"
 * - "Play Music" → "ADMINISTER FREQUENCY"
 * - "Buy/Cart" → "SECURE DOSAGE"
 * - "Contact" → "CONSULT THE GRIOT"
 */
const menuNodes: MenuNode[] = [
  { id: 'garden', label: 'The Living Garden', href: '#matrix' },
  { id: 'source', label: 'Secure Dosage', href: '#shop' },
  { id: 'mapping', label: 'Star Mapping', href: '/star-mapping' },
  { id: 'griot', label: 'Consult the Griot', href: '#oracle' },
  { id: 'top', label: 'Return to Crown', href: '#' },
];

interface MycelialMenuProps {
  onInitiationClick?: () => void;
}

/**
 * Mycelial Navigation - "The Growing Menu"
 * 
 * Navigation that sprouts outward like branching mycelium.
 * Includes cursor-following hyphae connections.
 */
const MycelialMenu = ({ onInitiationClick }: MycelialMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && isOpen) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen]);

  const getNodeCenter = (id: string) => {
    const node = nodeRefs.current.get(id);
    if (node && containerRef.current) {
      const nodeRect = node.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      return {
        x: nodeRect.left - containerRect.left + nodeRect.width / 2,
        y: nodeRect.top - containerRect.top + nodeRect.height / 2,
      };
    }
    return null;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed top-6 right-6 z-50 flex items-center gap-3"
    >
      {/* The Initiation Keyhole */}
      <KeyholeButton onClick={onInitiationClick || (() => {})} />
      {/* Spore/Seed Button */}
      <motion.button
        className="relative w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 30% 30%, hsl(40 60% 50%), hsl(20 50% 25%))',
          boxShadow: isOpen 
            ? '0 0 30px hsl(140 60% 40% / 0.6), 0 0 60px hsl(200 80% 50% / 0.3)'
            : '0 4px 20px rgba(0,0,0,0.4)',
          border: '2px solid hsl(40 50% 40%)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        {/* Spore texture dots */}
        <div className="absolute inset-2 opacity-60">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 3,
                height: 3,
                backgroundColor: 'hsl(20 40% 15%)',
                left: `${20 + (i % 3) * 25}%`,
                top: `${15 + Math.floor(i / 3) * 35}%`,
              }}
            />
          ))}
        </div>
        
        {/* Germination indicator */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid hsl(140 60% 45%)',
          }}
          animate={{
            scale: isOpen ? [1, 1.3, 1.2] : 1,
            opacity: isOpen ? [0.8, 0.4, 0.6] : 0,
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>

      {/* Mycelium Network Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-0 right-0 w-80 h-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ pointerEvents: 'none' }}
          >
            {/* SVG for hyphae connections */}
            <svg 
              className="absolute inset-0 w-full h-full overflow-visible"
              style={{ pointerEvents: 'none' }}
            >
              <defs>
                <linearGradient id="hyphaeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(140 60% 45%)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(200 80% 60%)" stopOpacity="0.4" />
                </linearGradient>
                <filter id="hyphaeGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Branch lines from center to nodes */}
              {menuNodes.map((node, i) => {
                const angle = -45 + (i * 30);
                const length = 100 + i * 20;
                const endX = 40 + Math.cos((angle * Math.PI) / 180) * length;
                const endY = 40 + Math.sin((angle * Math.PI) / 180) * length;
                const controlX = 40 + Math.cos((angle * Math.PI) / 180) * (length * 0.5);
                const controlY = 40 + Math.sin((angle * Math.PI) / 180) * (length * 0.3);
                
                return (
                  <motion.path
                    key={node.id}
                    d={`M 40 40 Q ${controlX} ${controlY}, ${endX} ${endY}`}
                    fill="none"
                    stroke="url(#hyphaeGradient)"
                    strokeWidth="2"
                    filter="url(#hyphaeGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                );
              })}
              
              {/* Cursor-following hyphae */}
              {hoveredNode && (
                <motion.line
                  x1={mousePos.x}
                  y1={mousePos.y}
                  x2={getNodeCenter(hoveredNode)?.x || 0}
                  y2={getNodeCenter(hoveredNode)?.y || 0}
                  stroke="hsl(200 80% 65%)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  filter="url(#hyphaeGlow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </svg>

            {/* Menu Nodes */}
            {menuNodes.map((node, i) => {
              const angle = -45 + (i * 30);
              const length = 100 + i * 20;
              const x = Math.cos((angle * Math.PI) / 180) * length;
              const y = Math.sin((angle * Math.PI) / 180) * length;
              
              return (
                <motion.a
                  key={node.id}
                  ref={(el) => {
                    if (el) nodeRefs.current.set(node.id, el);
                  }}
                  href={node.href}
                  className="absolute flex items-center justify-center px-4 py-2 rounded-full whitespace-nowrap"
                  style={{
                    left: 28 + x,
                    top: 28 + y,
                    background: hoveredNode === node.id
                      ? 'linear-gradient(135deg, hsl(140 50% 25%), hsl(200 60% 30%))'
                      : 'linear-gradient(135deg, hsl(20 40% 18%), hsl(280 40% 15%))',
                    border: hoveredNode === node.id
                      ? '2px solid hsl(200 80% 60%)'
                      : '2px solid hsl(40 50% 30%)',
                    boxShadow: hoveredNode === node.id
                      ? '0 0 20px hsl(200 80% 50% / 0.5)'
                      : '0 4px 12px rgba(0,0,0,0.4)',
                    pointerEvents: 'auto',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: i * 0.08,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ scale: 1.1 }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setIsOpen(false)}
                >
                  <span 
                    className="text-xs font-bubble tracking-wide"
                    style={{ color: 'hsl(40 50% 90%)' }}
                  >
                    {node.label}
                  </span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MycelialMenu;
