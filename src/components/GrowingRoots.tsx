import { motion, useScroll, useTransform } from 'framer-motion';

const rootPaths = {
  left: [
    { d: 'M 0,0 C 20,80 35,160 25,300 C 15,440 40,580 30,750 C 20,920 35,1100 25,1350 C 15,1500 30,1700 20,1900 C 10,2100 25,2300 20,2500', width: 4, delay: 0 },
    { d: 'M 0,120 C 30,140 55,180 70,250 C 85,320 60,370 80,420', width: 2.5, delay: 0.05 },
    { d: 'M 10,350 C 40,380 75,400 90,480 C 105,560 80,600 110,680', width: 2, delay: 0.1 },
    { d: 'M 20,600 C 50,640 80,660 95,740 C 110,820 70,880 100,950', width: 2, delay: 0.15 },
    { d: 'M 70,250 C 90,270 100,310 120,340 C 140,370 120,400 135,430', width: 1.2, delay: 0.12 },
    { d: 'M 25,800 C 55,830 85,850 75,920 C 65,990 90,1050 70,1120', width: 1.5, delay: 0.2 },
    { d: 'M 15,1100 C 45,1140 70,1200 60,1300 C 50,1400 80,1480 65,1560', width: 1.2, delay: 0.25 },
    { d: 'M 80,420 C 95,440 105,470 115,500', width: 0.8, delay: 0.14 },
    { d: 'M 110,680 C 125,710 135,750 120,790', width: 0.8, delay: 0.18 },
    { d: 'M 100,950 C 115,980 130,1020 115,1060', width: 0.8, delay: 0.22 },
  ],
  right: [
    { d: 'M 0,0 C -25,90 -30,170 -20,320 C -10,470 -35,600 -25,780 C -15,960 -30,1150 -20,1380 C -10,1550 -28,1750 -18,1950 C -8,2150 -22,2350 -18,2500', width: 3.5, delay: 0.03 },
    { d: 'M -5,180 C -35,200 -65,240 -80,310 C -95,380 -70,430 -90,490', width: 2.5, delay: 0.08 },
    { d: 'M -15,450 C -45,490 -80,510 -100,590 C -120,670 -85,720 -105,800', width: 2, delay: 0.13 },
    { d: 'M -20,700 C -55,740 -85,780 -70,860 C -55,940 -80,1000 -65,1080', width: 1.8, delay: 0.17 },
    { d: 'M -80,310 C -100,340 -115,380 -130,410 C -145,440 -125,480 -140,510', width: 1.2, delay: 0.11 },
    { d: 'M -20,950 C -50,990 -75,1040 -60,1120 C -45,1200 -70,1280 -55,1360', width: 1.5, delay: 0.22 },
    { d: 'M -90,490 C -105,520 -120,560 -110,600', width: 0.8, delay: 0.16 },
    { d: 'M -105,800 C -120,830 -130,870 -115,910', width: 0.8, delay: 0.19 },
    { d: 'M -65,1080 C -80,1110 -95,1150 -80,1190', width: 0.8, delay: 0.24 },
  ],
};

const RootPath = ({
  d,
  width,
  delay,
  scrollProgress,
}: {
  d: string;
  width: number;
  delay: number;
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  side: 'left' | 'right';
}) => {
  const startDraw = delay;
  const endDraw = Math.min(delay + 0.4, 1);
  const pathLength = useTransform(scrollProgress, [startDraw, endDraw], [0, 1]);
  const opacity = useTransform(scrollProgress, [startDraw, startDraw + 0.05], [0, 1]);

  return (
    <motion.path
      d={d}
      fill="none"
      stroke="url(#rootGradient)"
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
      {/* Left roots */}
      <svg
        className="absolute left-0 top-0 h-full"
        width="160"
        viewBox="0 0 160 2500"
        preserveAspectRatio="xMinYMin slice"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="rootGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(10 30% 22%)" stopOpacity="0.9" />
            <stop offset="40%" stopColor="hsl(10 25% 18%)" stopOpacity="0.7" />
            <stop offset="70%" stopColor="hsl(0 40% 15%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(0 60% 12%)" stopOpacity="0.3" />
          </linearGradient>
          <filter id="rootGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#rootGlow)">
          {rootPaths.left.map((root, i) => (
            <RootPath
              key={`left-${i}`}
              d={root.d}
              width={root.width}
              delay={root.delay}
              scrollProgress={scrollYProgress}
              side="left"
            />
          ))}
        </g>
      </svg>

      {/* Right roots */}
      <svg
        className="absolute right-0 top-0 h-full"
        width="160"
        viewBox="-160 0 160 2500"
        preserveAspectRatio="xMaxYMin slice"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="rootGradientRight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(10 30% 22%)" stopOpacity="0.9" />
            <stop offset="40%" stopColor="hsl(10 25% 18%)" stopOpacity="0.7" />
            <stop offset="70%" stopColor="hsl(0 40% 15%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(0 60% 12%)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <g filter="url(#rootGlow)">
          {rootPaths.right.map((root, i) => (
            <RootPath
              key={`right-${i}`}
              d={root.d}
              width={root.width}
              delay={root.delay}
              scrollProgress={scrollYProgress}
              side="right"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default GrowingRoots;