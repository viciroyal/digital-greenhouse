import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

// Kanaga Mask Icon - Dogon ceremonial mask
const KanagaMaskIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 60" className={className} fill="currentColor">
    {/* Vertical staff */}
    <rect x="18" y="20" width="4" height="40" />
    {/* Top horizontal bar */}
    <rect x="5" y="5" width="30" height="4" />
    {/* Upper angled arms */}
    <rect x="5" y="5" width="4" height="15" />
    <rect x="31" y="5" width="4" height="15" />
    {/* Lower angled extensions */}
    <rect x="0" y="0" width="4" height="10" />
    <rect x="36" y="0" width="4" height="10" />
  </svg>
);

// Tortoise Icon - Sacred animal of the Hogon
const TortoiseIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 32 24" className={className} fill="currentColor">
    {/* Shell - geometric hexagonal */}
    <polygon points="16,2 26,7 26,17 16,22 6,17 6,7" />
    {/* Shell pattern - angular lines */}
    <line x1="16" y1="2" x2="16" y2="22" stroke="hsl(230 60% 10%)" strokeWidth="1" />
    <line x1="6" y1="12" x2="26" y2="12" stroke="hsl(230 60% 10%)" strokeWidth="1" />
    {/* Head */}
    <circle cx="16" cy="0" r="2" />
    {/* Legs - angular */}
    <rect x="3" y="8" width="4" height="3" />
    <rect x="25" y="8" width="4" height="3" />
    <rect x="3" y="14" width="4" height="3" />
    <rect x="25" y="14" width="4" height="3" />
    {/* Tail */}
    <rect x="15" y="22" width="2" height="2" />
  </svg>
);

// Anvil/Hammer Icon - Blacksmith symbol
const AnvilIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 32 28" className={className} fill="currentColor">
    {/* Anvil base */}
    <polygon points="4,20 28,20 30,28 2,28" />
    {/* Anvil body */}
    <rect x="6" y="14" width="20" height="6" />
    {/* Anvil horn */}
    <polygon points="26,14 32,17 26,20" />
    {/* Hammer */}
    <rect x="12" y="2" width="8" height="5" />
    <rect x="15" y="7" width="2" height="7" />
  </svg>
);

// Nommo Zigzag Icon - Water/Serpent spirit
const NommoWaveIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 24" className={className} fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="2,18 8,6 14,18 20,6 26,18 32,6 38,18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Footer = () => {
  const nommoArtists = [
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
      {/* Bogolanfini (Mud Cloth) texture overlay */}
      <div className="absolute inset-0 mudcloth-pattern opacity-30 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* THE TOGU NA - Main Council Section */}
        <div className="text-center mb-16">
          {/* Title with Kanaga Masks */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <KanagaMaskIcon className="w-8 h-12 text-throne-gold/80" />
            <h3 className="font-display text-3xl md:text-4xl carved-text tracking-widest">
              THE TOGU NA
            </h3>
            <KanagaMaskIcon className="w-8 h-12 text-throne-gold/80 scale-x-[-1]" />
          </div>
          <p className="text-[#eaddca]/60 font-body text-sm italic">
            The House of Words • The Great Shelter
          </p>
        </div>

        {/* The Council Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16">
          
          {/* THE HOGON - Vici Royàl */}
          <motion.div 
            className="glass-card p-6 text-center"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <TortoiseIcon className="w-7 h-5 text-throne-gold" />
              <h4 className="font-display text-xl text-[#eaddca] tracking-wider">
                THE HOGON
              </h4>
            </div>
            <p className="text-throne-gold font-body font-bold text-lg mb-2">
              Vici Royàl
            </p>
            <p className="text-[#eaddca]/50 font-body text-xs italic">
              Spiritual Earth Priest
            </p>
            <p className="text-[#eaddca]/40 font-body text-xs mt-2">
              "The Guardian of the Soil and the Seed"
            </p>
          </motion.div>

          {/* THE BLACKSMITH - Èks */}
          <motion.div 
            className="glass-card p-6 text-center"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <AnvilIcon className="w-7 h-6 text-throne-gold" />
              <h4 className="font-display text-xl text-[#eaddca] tracking-wider">
                THE BLACKSMITH
              </h4>
            </div>
            <p className="text-throne-gold font-body font-bold text-lg mb-2">
              Èks
            </p>
            <p className="text-[#eaddca]/50 font-body text-xs italic">
              Shaper of Reality
            </p>
            <p className="text-[#eaddca]/40 font-body text-xs mt-2">
              "The Forger of Frequencies and Iron"
            </p>
          </motion.div>

          {/* THE NOMMO - Featured Artists */}
          <motion.div 
            className="glass-card p-6 text-center"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <NommoWaveIcon className="w-8 h-5 text-throne-gold" />
              <h4 className="font-display text-xl text-[#eaddca] tracking-wider">
                THE NOMMO
              </h4>
            </div>
            <p className="text-[#eaddca]/50 font-body text-xs italic mb-3">
              The Water Spirits • The Teachers
            </p>
            <div className="space-y-1">
              {nommoArtists.map((artist) => (
                <p key={artist} className="text-throne-gold/80 font-body text-sm">
                  {artist}
                </p>
              ))}
            </div>
            <p className="text-[#eaddca]/40 font-body text-xs mt-3">
              "The Voices from the Deep"
            </p>
          </motion.div>
        </div>

        {/* Connect Section */}
        <div className="text-center py-8 border-t border-border/20 mb-8">
          <h5 className="font-display text-lg text-[#eaddca]/80 mb-6 tracking-wider">CONNECT</h5>
          <div className="flex flex-wrap justify-center gap-6">
            <motion.a
              href="#"
              className="text-[#eaddca]/60 hover:text-throne-gold transition-colors font-body text-sm"
              whileHover={{ y: -2 }}
            >
              → Listen on Streaming
            </motion.a>
            <motion.a
              href="#"
              className="text-[#eaddca]/60 hover:text-throne-gold transition-colors font-body text-sm"
              whileHover={{ y: -2 }}
            >
              → Follow Vici Royàl
            </motion.a>
            <motion.a
              href="#"
              className="text-[#eaddca]/60 hover:text-throne-gold transition-colors font-body text-sm"
              whileHover={{ y: -2 }}
            >
              → Join the Greenhouse
            </motion.a>
            <motion.a
              href="https://instagram.com/officialpharmboi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#eaddca]/60 hover:text-throne-gold transition-colors font-body text-sm"
              whileHover={{ y: -2 }}
            >
              <Instagram size={18} />
              @officialpharmboi
            </motion.a>
          </div>
        </div>

        {/* Soil Spirits */}
        <div className="text-center py-8 border-t border-border/20">
          <p className="text-[#eaddca]/40 font-body text-xs mb-2">
            Guided by the Soil Spirits
          </p>
          <div className="flex justify-center gap-6">
            {['Spirit', 'Sunny', 'Rocky', 'River'].map((spirit) => (
              <motion.span
                key={spirit}
                className="text-throne-gold/60 font-display text-sm spirit-float"
                style={{ animationDelay: `${Math.random() * 2}s` }}
              >
                {spirit}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border/20">
          <p className="text-[#eaddca]/30 font-body text-xs">
            © 2025 PHARMBOI. All rights reserved. No black boxes. No secrets.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
