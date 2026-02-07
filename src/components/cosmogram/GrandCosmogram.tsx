import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import CosmicVisionLayer from './CosmicVisionLayer';
import AlchemicalSpineLayer from './AlchemicalSpineLayer';
import RootsResistanceLayer from './RootsResistanceLayer';

/**
 * Grand Unified Cosmogram Background
 * 
 * A parallax "Living Tapestry" that tells the story of Ascension:
 * From the Roots of Resistance (Earth) → To the Structure of Civilization (Body) → To the Cosmic Source (Spirit)
 * 
 * Three layers that blend seamlessly as One Single Organism:
 * - Layer C (Top): Cosmic Vision - Aboriginal Songlines + Hermetic Sacred Geometry
 * - Layer B (Middle): Alchemical Spine - Kemetic Djed + Dogon Togu Na + Toltec Step Fret
 * - Layer A (Bottom): Roots of Resistance - Maroon + Muscogee Creek + Sirius/Nommo
 */
const GrandCosmogram = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Base cosmic gradient - the unifying fabric */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              hsl(250 60% 8%) 0%,
              hsl(280 50% 10%) 20%,
              hsl(20 40% 10%) 50%,
              hsl(20 45% 8%) 70%,
              hsl(15 50% 6%) 100%
            )
          `,
        }}
      />
      
      {/* Transition zones - blend layers organically */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 15%, hsl(280 50% 20% / 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 50%, hsl(40 60% 20% / 0.3) 0%, transparent 40%),
            radial-gradient(ellipse at 70% 45%, hsl(40 50% 15% / 0.25) 0%, transparent 35%),
            radial-gradient(ellipse at 50% 85%, hsl(15 50% 15% / 0.5) 0%, transparent 40%)
          `,
        }}
      />
      
      {/* Layer C: Cosmic Vision (Top/Hero) - Aboriginal + Hermetic */}
      <CosmicVisionLayer scrollYProgress={scrollYProgress} />
      
      {/* Layer B: Alchemical Spine (Middle) - Kemetic + Dogon + Toltec */}
      <AlchemicalSpineLayer scrollYProgress={scrollYProgress} />
      
      {/* Layer A: Roots of Resistance (Bottom/Footer) - Maroon + Muscogee + Sirius */}
      <RootsResistanceLayer scrollYProgress={scrollYProgress} />
      
      {/* Organic vein network connecting all layers */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="veinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(280 60% 50%)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(40 70% 50%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(140 50% 35%)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Left vein - connects cosmic to roots */}
        <path 
          d="M50 0 Q30 200, 60 400 Q40 600, 70 800 Q50 1000, 80 1200"
          fill="none"
          stroke="url(#veinGradient)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Right vein */}
        <path 
          d="M350 0 Q370 200, 340 400 Q360 600, 330 800 Q350 1000, 320 1200"
          fill="none"
          stroke="url(#veinGradient)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Center spine vein */}
        <path 
          d="M200 0 Q190 150, 210 300 Q195 450, 205 600 Q215 750, 195 900 Q210 1050, 200 1200"
          fill="none"
          stroke="url(#veinGradient)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      
      {/* Subtle noise texture for organic feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default GrandCosmogram;
