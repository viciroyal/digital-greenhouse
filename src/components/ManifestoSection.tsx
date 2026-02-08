import { motion } from 'framer-motion';

// Wampum Belt Icon - Haudenosaunee
const WampumBeltIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 32" className={className} fill="none">
    <rect x="2" y="8" width="60" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Wampum beads pattern */}
    <circle cx="10" cy="16" r="3" fill="hsl(280 60% 70%)" />
    <circle cx="20" cy="16" r="3" fill="hsl(45 80% 90%)" />
    <circle cx="30" cy="16" r="3" fill="hsl(280 60% 70%)" />
    <circle cx="40" cy="16" r="3" fill="hsl(45 80% 90%)" />
    <circle cx="50" cy="16" r="3" fill="hsl(280 60% 70%)" />
    {/* Connecting threads */}
    <line x1="10" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="0.5" />
    <line x1="20" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="0.5" />
    <line x1="30" y1="16" x2="40" y2="16" stroke="currentColor" strokeWidth="0.5" />
    <line x1="40" y1="16" x2="50" y2="16" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

// Cowrie Shell Icon - Mali/Mandinka
const CowrieShellIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 48" className={className} fill="none">
    {/* Shell body */}
    <ellipse cx="20" cy="24" rx="14" ry="20" fill="hsl(45 70% 85%)" stroke="currentColor" strokeWidth="1.5" />
    {/* Shell opening/teeth */}
    <path 
      d="M20 8 Q20 24, 20 40" 
      stroke="hsl(30 50% 40%)" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    {/* Ridges */}
    <path d="M12 14 Q20 18, 28 14" stroke="currentColor" strokeWidth="0.75" fill="none" />
    <path d="M10 20 Q20 24, 30 20" stroke="currentColor" strokeWidth="0.75" fill="none" />
    <path d="M10 28 Q20 24, 30 28" stroke="currentColor" strokeWidth="0.75" fill="none" />
    <path d="M12 34 Q20 30, 28 34" stroke="currentColor" strokeWidth="0.75" fill="none" />
  </svg>
);

// Interlinked Circle Icon - Bantu/Ubuntu
const UbuntuCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    {/* Three interlinked circles forming unity */}
    <circle cx="24" cy="14" r="10" stroke="hsl(350 70% 50%)" strokeWidth="2" fill="none" />
    <circle cx="16" cy="30" r="10" stroke="hsl(140 50% 45%)" strokeWidth="2" fill="none" />
    <circle cx="32" cy="30" r="10" stroke="hsl(220 70% 55%)" strokeWidth="2" fill="none" />
    {/* Central unity point */}
    <circle cx="24" cy="24" r="3" fill="hsl(45 80% 60%)" />
  </svg>
);

interface PillarProps {
  icon: React.ReactNode;
  tribe: string;
  subtitle: string;
  text: string;
  delay: number;
}

const Pillar = ({ icon, tribe, subtitle, text, delay }: PillarProps) => (
  <motion.div
    className="flex flex-col items-center text-center max-w-xs"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    <motion.div 
      className="w-16 h-16 mb-4 text-cream-muted/80"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {icon}
    </motion.div>
    <h4 
      className="text-xl md:text-2xl tracking-wider mb-1"
      style={{ fontFamily: 'Staatliches, sans-serif', color: 'hsl(45 80% 70%)' }}
    >
      {tribe}
    </h4>
    <p className="text-gem-amethyst/80 font-bubble text-sm mb-3">
      {subtitle}
    </p>
    <p className="text-cream-muted/70 font-body text-xs leading-relaxed">
      "{text}"
    </p>
  </motion.div>
);

const ManifestoSection = () => {
  return (
    <section className="relative py-20 px-4 border-t border-border/30">
      {/* Background texture */}
      <div className="absolute inset-0 mosaic-pattern opacity-20 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 
            className="text-3xl md:text-4xl tracking-widest mb-2"
            style={{ fontFamily: 'Staatliches, sans-serif', color: 'hsl(45 80% 75%)' }}
          >
            THE MANIFESTO
          </h3>
          <p className="text-cream-muted/50 font-body text-sm">
            The Social Operating System of AgroMajic
          </p>
        </motion.div>

        {/* Triangle Layout */}
        <div className="flex flex-col items-center gap-12 md:gap-16">
          {/* TOP - THE LAW */}
          <Pillar
            icon={<WampumBeltIcon className="w-full h-full" />}
            tribe="HAUDENOSAUNEE"
            subtitle="THE LAW"
            text="We decide for the 7th Generation. Every seed we plant is a promise to the future."
            delay={0}
          />
          
          {/* BOTTOM ROW - WEALTH & BOND */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-24 lg:gap-32 w-full">
            {/* BOTTOM LEFT - THE WEALTH */}
            <Pillar
              icon={<CowrieShellIcon className="w-full h-full" />}
              tribe="MALI (MANDINKA)"
              subtitle="THE WEALTH"
              text="We trade in Sacred Value. We use the Cowrie to measure not just price, but prosperity."
              delay={0.15}
            />
            
            {/* BOTTOM RIGHT - THE BOND */}
            <Pillar
              icon={<UbuntuCircleIcon className="w-full h-full" />}
              tribe="BANTU (UBUNTU)"
              subtitle="THE BOND"
              text="We live by Ubuntu: 'I am because we are.' Your harvest is my harvest. We grow together."
              delay={0.3}
            />
          </div>
        </div>

        {/* Connecting lines for triangle effect - visible on larger screens */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          style={{ zIndex: -1 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(45 80% 60% / 0.2)" />
              <stop offset="50%" stopColor="hsl(280 60% 50% / 0.3)" />
              <stop offset="100%" stopColor="hsl(45 80% 60% / 0.2)" />
            </linearGradient>
          </defs>
          {/* Triangle connecting lines */}
          <path 
            d="M 50% 25% L 25% 75% L 75% 75% Z" 
            stroke="url(#lineGradient)" 
            strokeWidth="1" 
            fill="none"
            strokeDasharray="4 4"
            opacity="0.4"
          />
        </svg>
      </div>
    </section>
  );
};

export default ManifestoSection;
