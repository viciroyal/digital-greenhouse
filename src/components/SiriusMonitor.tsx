import { motion } from 'framer-motion';
import { Star, Thermometer, Droplets } from 'lucide-react';
import { useState } from 'react';

const SiriusMonitor = () => {
  const [isHovered, setIsHovered] = useState(false);

  const metrics = [
    {
      id: 'cosmic',
      icon: Star,
      value: 'WAXING GIBBOUS',
      label: 'TIDAL FORCE',
      color: 'from-cyan-400 to-blue-500',
      glow: 'shadow-cyan-500/50',
      iconColor: 'text-cyan-400',
    },
    {
      id: 'root',
      icon: Thermometer,
      value: '68°F / ACTIVE',
      label: 'SOIL TEMP',
      color: 'from-emerald-400 to-green-500',
      glow: 'shadow-emerald-500/50',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'nutrient',
      icon: Droplets,
      value: 'TARGET: 14+',
      label: 'BRIX SCORE',
      color: 'from-rose-400 to-ruby-500',
      glow: 'shadow-rose-500/50',
      iconColor: 'text-rose-400',
    },
  ];

  return (
    <motion.div
      className="absolute bottom-8 right-4 md:top-8 md:bottom-auto md:right-8 z-20"
      initial={{ opacity: 0, x: 50 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.8, delay: 1 },
        x: { duration: 0.8, delay: 1 },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl"
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(49, 46, 129, 0.3) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          boxShadow: '0 0 30px rgba(234, 179, 8, 0.15), inset 0 0 20px rgba(234, 179, 8, 0.05)',
        }}
      >
        {/* Animated border glow */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(234, 179, 8, 0.2) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        />

        <div className="relative p-4 md:p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-yellow-500/20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            </motion.div>
            <span 
              className="text-[10px] tracking-[0.2em] uppercase font-body"
              style={{ color: 'hsl(40 50% 75%)' }}
            >
              Sirius Monitor
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[8px] text-emerald-400 font-mono uppercase">Live</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-3">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex items-center gap-3">
                <div 
                  className={`p-2 rounded-lg ${metric.iconColor}`}
                  style={{
                    background: `linear-gradient(135deg, ${metric.id === 'cosmic' ? 'rgba(34, 211, 238, 0.15)' : metric.id === 'root' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 113, 133, 0.15)'} 0%, transparent 100%)`,
                    boxShadow: `0 0 15px ${metric.id === 'cosmic' ? 'rgba(34, 211, 238, 0.3)' : metric.id === 'root' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(251, 113, 133, 0.3)'}`,
                  }}
                >
                  <metric.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-xs md:text-sm font-mono font-bold truncate"
                    style={{ 
                      color: metric.id === 'cosmic' ? 'hsl(185 80% 70%)' : metric.id === 'root' ? 'hsl(155 70% 60%)' : 'hsl(350 80% 70%)',
                      textShadow: `0 0 10px ${metric.id === 'cosmic' ? 'hsl(185 80% 50% / 0.5)' : metric.id === 'root' ? 'hsl(155 70% 40% / 0.5)' : 'hsl(350 80% 50% / 0.5)'}`,
                    }}
                  >
                    {metric.value}
                  </p>
                  <p className="text-[9px] tracking-[0.15em] uppercase text-yellow-500/60 font-body">
                    {metric.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Expandable Status Message */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isHovered ? 'auto' : 0, 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div 
              className="mt-4 pt-3 border-t border-yellow-500/20 text-center"
            >
              <p 
                className="text-[10px] tracking-[0.1em] font-mono uppercase"
                style={{ 
                  color: 'hsl(140 60% 50%)',
                  textShadow: '0 0 8px hsl(140 60% 40% / 0.5)',
                }}
              >
                ◆ SYSTEM NOMINAL ◆
              </p>
              <p 
                className="text-[8px] tracking-[0.2em] uppercase mt-1 font-body"
                style={{ color: 'hsl(40 50% 65%)' }}
              >
                AGRO-MAJIC ONLINE
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SiriusMonitor;
