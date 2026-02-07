import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative py-16 px-4 border-t border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h4 className="font-bubble text-2xl gradient-root-throne-text mb-4">PHARMBOI</h4>
            <p className="text-muted-foreground font-body text-sm mb-4">
              Music grown, not made. The Digital Greenhouse experience.
            </p>
            <p className="text-muted-foreground/60 font-body text-xs">
              by <strong className="text-foreground font-bold">Vici Royàl</strong> • Produced by <strong className="text-throne-gold font-bold">Vici Royàl</strong> & <span className="text-throne-gold">Èks</span>
            </p>
          </div>

          {/* Credits */}
          <div>
            <h5 className="font-body font-medium text-foreground mb-4">Featured Artists</h5>
            <ul className="space-y-2 text-muted-foreground font-body text-sm">
              <li>Sistah Moon</li>
              <li>Nichollé McKoy</li>
              <li>Sarafina Ethereal</li>
              <li>James Cambridge IV</li>
              <li>Briar Blakley</li>
              <li>Victoria</li>
              <li>Dara Carter</li>
              <li>Shellie Sweets</li>
              <li>Yamau</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h5 className="font-body font-medium text-foreground mb-4">Connect</h5>
            <div className="space-y-3">
              <motion.a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                whileHover={{ x: 4 }}
              >
                → Listen on Streaming
              </motion.a>
              <motion.a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                whileHover={{ x: 4 }}
              >
                → Follow Vici Royàl
              </motion.a>
              <motion.a
                href="#"
                className="block text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                whileHover={{ x: 4 }}
              >
                → Join the Greenhouse
              </motion.a>
            </div>
          </div>
        </div>

        {/* Soil Spirits */}
        <div className="text-center py-8 border-t border-border/20">
          <p className="text-muted-foreground/60 font-body text-xs mb-2">
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
          <p className="text-muted-foreground/40 font-body text-xs">
            © 2025 PHARMBOI. All rights reserved. No black boxes. No secrets.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
