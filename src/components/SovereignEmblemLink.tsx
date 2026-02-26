import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDiscoveries, TOTAL_DISCOVERIES, onDiscovery } from '@/lib/discoveryEvents';
import sovereignEmblem from '@/assets/sovereign-emblem.png';

const RING_SIZE = 76; // px — slightly larger than the w-16 (64px) emblem
const STROKE_WIDTH = 2.5;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Sovereign Emblem with a subtle SVG progress ring
 * that fills as users discover more areas of the app.
 */
const SovereignEmblemLink = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(() => getDiscoveries().length / TOTAL_DISCOVERIES);

  useEffect(() => {
    // Re-read on route change
    setProgress(getDiscoveries().length / TOTAL_DISCOVERIES);
  }, [location.pathname]);

  useEffect(() => {
    // Listen for new discoveries
    return onDiscovery(() => {
      setProgress(getDiscoveries().length / TOTAL_DISCOVERIES);
    });
  }, []);

  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <a href="/stage" className="group fixed bottom-4 left-4 z-50">
      {/* Progress ring */}
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ filter: 'drop-shadow(0 0 6px hsl(45 70% 50% / 0.25))' }}
      >
        {/* Track */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="hsl(45 50% 30% / 0.15)"
          strokeWidth={STROKE_WIDTH}
        />
        {/* Fill */}
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="hsl(45 70% 55%)"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
          style={{
            transition: 'stroke-dashoffset 0.8s ease-out',
            opacity: progress > 0 ? 0.85 : 0,
          }}
        />
      </svg>

      {/* Emblem image */}
      <img
        src={sovereignEmblem}
        alt="Sovereign Emblem — Go to The Stage"
        className="w-16 opacity-75 hover:opacity-100 transition-all duration-500 cursor-pointer relative"
        style={{
          filter: 'drop-shadow(0 0 12px hsl(45 80% 50% / 0.4))',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.filter =
            'drop-shadow(0 0 25px hsl(45 80% 55% / 0.7)) drop-shadow(0 0 50px hsl(45 80% 50% / 0.3))')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.filter = 'drop-shadow(0 0 12px hsl(45 80% 50% / 0.4))')
        }
      />

      {/* Tooltip */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
        style={{
          background: 'hsl(220 40% 10% / 0.9)',
          border: '1px solid hsl(45 70% 45%)',
          color: 'hsl(45 70% 75%)',
          fontSize: '10px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontFamily: 'Space Mono, monospace',
        }}
      >
        The Stage — Home Base
      </div>
    </a>
  );
};

export default SovereignEmblemLink;
