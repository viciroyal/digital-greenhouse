import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

// Organic Vine Icon
const VineIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 60" className={className} fill="currentColor">
    <path 
      d="M20 0 Q10 15, 20 30 Q30 45, 20 60" 
      stroke="currentColor" 
      strokeWidth="3" 
      fill="none"
    />
    <ellipse cx="12" cy="15" rx="6" ry="4" transform="rotate(-30 12 15)" />
    <ellipse cx="28" cy="25" rx="6" ry="4" transform="rotate(30 28 25)" />
    <ellipse cx="12" cy="45" rx="5" ry="3" transform="rotate(-20 12 45)" />
  </svg>
);

// Gemstone Icon
const GemstoneIcon = ({ className = "", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill={color}>
    <path d="M16 2 L28 12 L16 30 L4 12 Z" />
    <path d="M4 12 L16 16 L28 12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
  </svg>
);

// Root Cluster Icon
const RootClusterIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} stroke="currentColor" fill="none" strokeWidth="2">
    <path d="M20 5 Q20 15, 15 25 Q10 35, 5 40" strokeLinecap="round" />
    <path d="M20 5 Q20 20, 20 30 Q20 35, 20 40" strokeLinecap="round" />
    <path d="M20 5 Q20 15, 25 25 Q30 35, 35 40" strokeLinecap="round" />
    <circle cx="20" cy="5" r="3" fill="currentColor" />
  </svg>
);

// Cosmic Swirl Icon
const CosmicSwirlIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12 Q10 4, 20 12 Q30 20, 38 12" strokeLinecap="round" />
    <circle cx="8" cy="8" r="2" fill="hsl(350 75% 50%)" />
    <circle cx="32" cy="16" r="2" fill="hsl(220 75% 55%)" />
  </svg>
);

const Footer = () => {
  const cosmicArtists = [
    'Sistah Moon',
    'Nichollé McKoy',
    'Sarafina Ethereal',
    'James Cambridge IV',
    'Briar Blakley',
    'Victoria',
    'Dara Carter',
    'Shellie Sweets',
    'Yamau'
  ];

  return (
    <footer className="relative py-16 px-4 border-t border-border/30">
      {/* Mosaic pattern overlay */}
      <div className="absolute inset-0 mosaic-pattern opacity-30 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* THE FORMULATORS - Main Section */}
        <div className="text-center mb-16">
          {/* Title with organic frames */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <VineIcon className="w-8 h-12 text-gem-emerald opacity-80" />
            <h3 className="text-3xl md:text-4xl root-text font-bubble" data-text="THE FORMULATORS">
              THE FORMULATORS
            </h3>
            <VineIcon className="w-8 h-12 text-gem-emerald opacity-80 scale-x-[-1]" />
          </div>
          <p className="text-cream-muted/60 font-body text-sm italic">
            The Compound Masters • The Root Weavers
          </p>
        </div>

        {/* The Council Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16">
          
          {/* THE HEAD PHARMACIST - Vici Royàl */}
          <motion.div 
            className="root-card p-6 text-center"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <RootClusterIcon className="w-7 h-7 text-gem-topaz" />
              <h4 className="font-bubble text-xl text-cream tracking-wider">
                HEAD PHARMACIST
              </h4>
            </div>
            <p className="text-gem-topaz font-body font-bold text-lg mb-2">
              Vici Royàl
            </p>
            <p className="text-cream-muted/50 font-body text-xs italic">
              Chief Compound Officer
            </p>
            <p className="text-cream-muted/40 font-body text-xs mt-2">
              "The one who formulates the frequencies"
            </p>
          </motion.div>

          {/* THE ALCHEMIST - Èks */}
          <motion.div 
            className="gem-card p-6 text-center"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <GemstoneIcon className="w-7 h-7 text-gem-ruby" />
              <h4 className="font-bubble text-xl text-cream tracking-wider">
                THE ALCHEMIST
              </h4>
            </div>
            <p className="text-gem-ruby font-body font-bold text-lg mb-2">
              Èks
            </p>
            <p className="text-cream-muted/50 font-body text-xs italic">
              Frequency Synthesist
            </p>
            <p className="text-gem-ruby/70 font-body font-bold text-base mt-3 mb-1">
              Kristopher Sampson
            </p>
            <p className="text-cream-muted/50 font-body text-xs italic">
              Master Distiller
            </p>
            <p className="text-cream-muted/40 font-body text-xs mt-2">
              "The forgers of sonic compounds"
            </p>
          </motion.div>

          {/* THE ACTIVE INGREDIENTS - Featured Artists */}
          <motion.div 
            className="forest-card p-6 text-center"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <CosmicSwirlIcon className="w-8 h-5 text-gem-sapphire" />
              <h4 className="font-bubble text-xl text-cream tracking-wider">
                ACTIVE INGREDIENTS
              </h4>
            </div>
            <p className="text-cream-muted/50 font-body text-xs italic mb-3">
              The Wandering Essences • The Voices
            </p>
            <div className="space-y-1">
              {cosmicArtists.map((artist) => (
                <p key={artist} className="text-gem-emerald/80 font-body text-sm">
                  {artist}
                </p>
              ))}
            </div>
            <p className="text-cream-muted/40 font-body text-xs mt-3">
              "Elements woven through the formula"
            </p>
          </motion.div>
        </div>

        {/* Connect Section */}
        <div className="text-center py-8 border-t border-border/20 mb-8">
          <h5 className="font-bubble text-lg text-cream-muted/80 mb-6 tracking-wider">ENTER THE REGIMEN</h5>
          <div className="flex flex-wrap justify-center gap-6">
            <motion.a
              href="#"
              className="text-cream-muted/60 hover:text-gem-ruby transition-colors font-body text-sm"
              whileHover={{ y: -2 }}
            >
              → Administer via Streaming
            </motion.a>
            <motion.a
              href="#"
              className="text-cream-muted/60 hover:text-gem-ruby transition-colors font-body text-sm"
              whileHover={{ y: -2 }}
            >
              → Follow the Pharmacist
            </motion.a>
            <motion.a
              href="#"
              className="text-cream-muted/60 hover:text-gem-ruby transition-colors font-body text-sm"
              whileHover={{ y: -2 }}
            >
              → Enter the Dispensary
            </motion.a>
            <motion.a
              href="https://instagram.com/officialpharmboi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cream-muted/60 hover:text-gem-ruby transition-colors font-body text-sm"
              whileHover={{ y: -2 }}
            >
              <Instagram size={18} />
              @officialpharmboi
            </motion.a>
          </div>
        </div>

        {/* Cosmic Spirits */}
        <div className="text-center py-8 border-t border-border/20">
          <p className="text-cream-muted/40 font-body text-xs mb-2">
            Guided by the Cosmic Spirits
          </p>
          <div className="flex justify-center gap-6">
            {['Spirit', 'Sunny', 'Rocky', 'River'].map((spirit) => (
              <motion.span
                key={spirit}
                className="text-gem-amethyst/60 font-bubble text-sm float-organic"
                style={{ animationDelay: `${Math.random() * 2}s` }}
              >
                {spirit}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border/20">
          <p className="text-cream-muted/30 font-body text-xs">
            © 2025 PHARMBOI. All rights reserved. Roots run deep. Gems shine bright.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
