import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

const MycelialCursor = () => {
  const isMobile = useIsMobile();
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const trailIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setMousePos(newPos);
      setIsVisible(true);

      // Add new trail point
      const newPoint: TrailPoint = {
        id: trailIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      };

      setTrail((prev) => [...prev.slice(-25), newPoint]);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Clean up old trail points
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTrail((prev) => prev.filter((point) => now - point.timestamp < 600));
    }, 50);

    return () => clearInterval(cleanup);
  }, []);

  // Disable on mobile/touch devices
  if (!isVisible || isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999]" style={{ isolation: 'isolate' }}>
      {/* Mycelial trail threads */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="mycelialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(45 80% 70%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(45 90% 75%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(40 100% 85%)" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Draw connecting lines between trail points */}
        {trail.length > 1 && (
          <path
            d={trail
              .map((point, i) => (i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
              .join(' ')}
            stroke="url(#mycelialGradient)"
            strokeWidth="1.5"
            fill="none"
            filter="url(#glow)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Trail spore particles */}
        {trail.map((point, index) => {
          const age = (Date.now() - point.timestamp) / 600;
          const opacity = Math.max(0, 1 - age);
          const scale = 0.3 + (1 - age) * 0.7;

          return (
            <circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r={2 * scale}
              fill={`hsl(45 90% 75% / ${opacity * 0.5})`}
              filter="url(#glow)"
            />
          );
        })}
      </svg>

      {/* Main cursor - Glowing Spore */}
      <motion.div
        className="absolute"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Outer glow - Enhanced for visibility */}
        <div
          className="absolute rounded-full"
          style={{
            width: 32,
            height: 32,
            left: -16,
            top: -16,
            background: 'radial-gradient(circle, hsl(45 100% 80% / 0.5) 0%, hsl(45 90% 60% / 0.2) 50%, transparent 70%)',
            filter: 'blur(2px)',
          }}
        />

        {/* Core spore - High contrast */}
        <div
          className="rounded-full"
          style={{
            width: 12,
            height: 12,
            background: 'radial-gradient(circle at 30% 30%, hsl(45 100% 95%), hsl(45 90% 70%))',
            boxShadow: '0 0 15px hsl(45 100% 70%), 0 0 30px hsl(45 90% 50% / 0.6), 0 0 4px 2px hsl(0 0% 100% / 0.8)',
            border: '1px solid hsl(0 0% 100% / 0.5)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default MycelialCursor;
