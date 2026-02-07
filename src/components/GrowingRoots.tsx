import { motion, useScroll, useTransform } from 'framer-motion';

// Organic, curving vine-like paths
const vinePaths = {
  left: [
    { d: 'M 0,0 Q 30,100 20,200 Q 10,300 25,400 Q 40,500 20,600 Q 0,700 30,800 Q 60,900 25,1000 Q -10,1100 20,1200 Q 50,1300 15,1400 Q -20,1500 25,1600 Q 70,1700 20,1800 Q -30,1900 30,2000 Q 90,2100 20,2200 Q -50,2300 25,2500', width: 5, delay: 0, color: 'vine' },
    { d: 'M 15,150 Q 50,180 70,250 Q 90,320 60,380', width: 3, delay: 0.05, color: 'vine' },
    { d: 'M 25,350 Q 65,390 85,470 Q 105,550 70,620', width: 2.5, delay: 0.1, color: 'vine' },
    { d: 'M 20,580 Q 55,620 80,700 Q 105,780 65,850', width: 2.5, delay: 0.15, color: 'vine' },
    { d: 'M 30,780 Q 70,820 90,900 Q 110,980 70,1050', width: 2, delay: 0.18, color: 'vine' },
    { d: 'M 25,1000 Q 60,1050 80,1130 Q 100,1210 60,1280', width: 2, delay: 0.22, color: 'vine' },
    // Small leaves/tendrils
    { d: 'M 70,250 Q 95,270 110,300', width: 1.5, delay: 0.12, color: 'leaf' },
    { d: 'M 85,470 Q 110,490 125,520', width: 1.5, delay: 0.16, color: 'leaf' },
    { d: 'M 90,900 Q 120,920 140,960', width: 1.2, delay: 0.25, color: 'leaf' },
  ],
  right: [
    { d: 'M 0,50 Q -35,150 -20,250 Q -5,350 -30,450 Q -55,550 -25,650 Q 5,750 -35,850 Q -65,950 -25,1050 Q 15,1150 -30,1250 Q -75,1350 -20,1450 Q 35,1550 -30,1650 Q -95,1750 -25,1850 Q 45,1950 -35,2050 Q -115,2150 -20,2250 Q 75,2350 -25,2500', width: 4.5, delay: 0.03, color: 'vine' },
    { d: 'M -10,200 Q -50,230 -75,300 Q -100,370 -65,430', width: 3, delay: 0.08, color: 'vine' },
    { d: 'M -25,400 Q -70,440 -95,520 Q -120,600 -80,670', width: 2.5, delay: 0.13, color: 'vine' },
    { d: 'M -30,630 Q -75,680 -100,760 Q -125,840 -85,910', width: 2.5, delay: 0.17, color: 'vine' },
    { d: 'M -25,880 Q -70,930 -95,1010 Q -120,1090 -80,1160', width: 2, delay: 0.21, color: 'vine' },
    // Small leaves/tendrils
    { d: 'M -75,300 Q -100,320 -120,350', width: 1.5, delay: 0.11, color: 'leaf' },
    { d: 'M -95,520 Q -125,540 -145,580', width: 1.5, delay: 0.16, color: 'leaf' },
    { d: 'M -100,760 Q -130,780 -150,820', width: 1.2, delay: 0.23, color: 'leaf' },
  ],
};

const VinePath = ({
  d,
  width,
  delay,
  scrollProgress,
  color,
}: {
  d: string;
  width: number;
  delay: number;
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  side: 'left' | 'right';
  color: 'vine' | 'leaf';
}) => {
  const startDraw = delay;
  const endDraw = Math.min(delay + 0.4, 1);
  const pathLength = useTransform(scrollProgress, [startDraw, endDraw], [0, 1]);
  const opacity = useTransform(scrollProgress, [startDraw, startDraw + 0.05], [0, 1]);

  const gradientId = color === 'leaf' ? 'leafGradient' : 'vineGradient';

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={`url(#${gradientId})`}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        pathLength,
        opacity,
      }}
    />
  );
};

const GrowingRoots = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed inset-0 pointer-events-none z-[5]" aria-hidden="true">
      {/* Left vines */}
      <svg
        className="absolute left-0 top-0 h-full"
        width="180"
        viewBox="0 0 180 2500"
        preserveAspectRatio="xMinYMin slice"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Organic vine gradient - browns and greens */}
          <linearGradient id="vineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(140 40% 25%)" stopOpacity="0.9" />
            <stop offset="30%" stopColor="hsl(20 40% 22%)" stopOpacity="0.8" />
            <stop offset="60%" stopColor="hsl(20 35% 18%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(20 30% 15%)" stopOpacity="0.4" />
          </linearGradient>
          {/* Leaf gradient - greener */}
          <linearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(140 50% 30%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(140 40% 40%)" stopOpacity="0.7" />
          </linearGradient>
          <filter id="vineGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#vineGlow)">
          {vinePaths.left.map((vine, i) => (
            <VinePath
              key={`left-${i}`}
              d={vine.d}
              width={vine.width}
              delay={vine.delay}
              scrollProgress={scrollYProgress}
              side="left"
              color={vine.color as 'vine' | 'leaf'}
            />
          ))}
        </g>
      </svg>

      {/* Right vines */}
      <svg
        className="absolute right-0 top-0 h-full"
        width="180"
        viewBox="-180 0 180 2500"
        preserveAspectRatio="xMaxYMin slice"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="vineGradientRight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(140 40% 25%)" stopOpacity="0.9" />
            <stop offset="30%" stopColor="hsl(20 40% 22%)" stopOpacity="0.8" />
            <stop offset="60%" stopColor="hsl(20 35% 18%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(20 30% 15%)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <g filter="url(#vineGlow)">
          {vinePaths.right.map((vine, i) => (
            <VinePath
              key={`right-${i}`}
              d={vine.d}
              width={vine.width}
              delay={vine.delay}
              scrollProgress={scrollYProgress}
              side="right"
              color={vine.color as 'vine' | 'leaf'}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default GrowingRoots;
