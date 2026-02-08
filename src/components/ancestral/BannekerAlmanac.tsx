import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Sun/Cloud Split Icon - Almanac Weather Symbol
const AlmanacIcon = ({ className = "", isActive = false }: { className?: string; isActive?: boolean }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none">
    {/* Sun half (left) */}
    <circle 
      cx="14" 
      cy="20" 
      r="8" 
      fill={isActive ? "hsl(45 90% 55%)" : "hsl(45 40% 45%)"}
      opacity="0.9"
    />
    {/* Sun rays */}
    <g stroke={isActive ? "hsl(45 90% 60%)" : "hsl(45 40% 50%)"} strokeWidth="1.5" strokeLinecap="round">
      <line x1="14" y1="8" x2="14" y2="5" />
      <line x1="6" y1="12" x2="3" y2="10" />
      <line x1="3" y1="20" x2="0" y2="20" />
      <line x1="6" y1="28" x2="3" y2="30" />
    </g>
    
    {/* Cloud half (right) */}
    <path 
      d="M26 15 Q30 10, 35 14 Q40 14, 38 20 Q40 26, 35 26 L24 26 Q20 26, 20 22 Q20 16, 26 15 Z"
      fill={isActive ? "hsl(200 30% 75%)" : "hsl(200 20% 50%)"}
      stroke={isActive ? "hsl(200 40% 80%)" : "hsl(200 20% 45%)"}
      strokeWidth="1"
    />
    
    {/* Rain drops (when active) */}
    {isActive && (
      <>
        <motion.line 
          x1="26" y1="29" x2="25" y2="33"
          stroke="hsl(200 70% 70%)" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          animate={{ opacity: [0.5, 1, 0.5], y: [0, 2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.line 
          x1="32" y1="28" x2="31" y2="32"
          stroke="hsl(200 70% 70%)" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          animate={{ opacity: [0.5, 1, 0.5], y: [0, 2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
      </>
    )}
  </svg>
);

/**
 * THE BANNEKER ALMANAC
 * Honors Benjamin Banneker - The First Astronomer
 * Displays weather data for agricultural planning
 */
const BannekerAlmanac = () => {
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    rainChance: number;
    condition: string;
  }>({
    temp: 72,
    rainChance: 20,
    condition: 'partly-cloudy',
  });
  
  const [isHovered, setIsHovered] = useState(false);

  // Simulate weather data (placeholder)
  // In production, this would call a weather API
  useEffect(() => {
    // Simulated seasonal weather based on current month
    const month = new Date().getMonth();
    const hour = new Date().getHours();
    
    // Base temperatures by season (Georgia climate)
    const seasonalTemp: Record<number, number> = {
      0: 48,  // Jan
      1: 52,  // Feb
      2: 60,  // Mar
      3: 68,  // Apr
      4: 76,  // May
      5: 84,  // Jun
      6: 88,  // Jul
      7: 86,  // Aug
      8: 80,  // Sep
      9: 70,  // Oct
      10: 58, // Nov
      11: 50, // Dec
    };
    
    // Add some variance based on hour
    const hourVariance = hour >= 12 && hour <= 16 ? 5 : -3;
    const temp = seasonalTemp[month] + hourVariance + Math.floor(Math.random() * 6 - 3);
    
    // Rain chance based on season (higher in spring/summer)
    const baseRainChance = [30, 35, 40, 45, 50, 55, 60, 55, 45, 35, 30, 30][month];
    const rainChance = baseRainChance + Math.floor(Math.random() * 20 - 10);
    
    // Condition based on rain chance
    const condition = rainChance > 60 ? 'rainy' : rainChance > 40 ? 'cloudy' : rainChance > 20 ? 'partly-cloudy' : 'sunny';
    
    setWeatherData({
      temp,
      rainChance: Math.max(0, Math.min(100, rainChance)),
      condition,
    });
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer"
          style={{
            background: isHovered 
              ? 'hsl(200 30% 18% / 0.9)' 
              : 'hsl(20 30% 12% / 0.9)',
            border: isHovered 
              ? '1px solid hsl(200 50% 50%)' 
              : '1px solid hsl(40 40% 30%)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Almanac Icon */}
          <AlmanacIcon className="w-6 h-6" isActive={isHovered} />
          
          {/* Temperature Display */}
          <div className="flex items-center gap-1.5">
            <span 
              className="text-sm font-mono tracking-wide"
              style={{ 
                color: isHovered ? 'hsl(45 80% 70%)' : 'hsl(40 50% 65%)',
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {weatherData.temp}°F
            </span>
            
            {/* Divider */}
            <div 
              className="w-px h-4"
              style={{ background: 'hsl(40 30% 40%)' }}
            />
            
            {/* Rain Chance */}
            <div className="flex items-center gap-1">
              <motion.span
                className="text-xs"
                animate={weatherData.rainChance > 50 ? {
                  opacity: [0.7, 1, 0.7],
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💧
              </motion.span>
              <span 
                className="text-xs font-mono"
                style={{ 
                  color: weatherData.rainChance > 50 
                    ? 'hsl(200 70% 70%)' 
                    : 'hsl(40 40% 55%)',
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {weatherData.rainChance}%
              </span>
            </div>
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className="font-body text-xs max-w-xs"
        style={{
          background: 'linear-gradient(180deg, hsl(200 25% 15%), hsl(20 30% 12%))',
          border: '1px solid hsl(200 40% 35%)',
          color: 'hsl(40 50% 80%)',
        }}
      >
        <div className="py-1">
          <p 
            className="font-bold tracking-wider mb-1"
            style={{ fontFamily: 'Staatliches, sans-serif', color: 'hsl(200 60% 70%)' }}
          >
            THE BANNEKER ALMANAC
          </p>
          <p className="text-[10px] opacity-70 mb-2">
            "Consult the sky before you plant." — Benjamin Banneker
          </p>
          <div className="flex items-center gap-3 text-[10px]">
            <span>🌡️ {weatherData.temp}°F</span>
            <span>💧 {weatherData.rainChance}% Rain</span>
          </div>
          <p 
            className="text-[9px] mt-2 opacity-50 tracking-wider"
            style={{ fontFamily: 'Staatliches, sans-serif' }}
          >
            LINEAGE: THE FIRST ASTRONOMER
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default BannekerAlmanac;
