import { motion } from 'framer-motion';
import { Building2, Mail, Phone, Globe, ExternalLink } from 'lucide-react';

interface EcoParadigmCardProps {
  variant?: 'inline' | 'compact' | 'full';
}

const EcoParadigmCard = ({ variant = 'inline' }: EcoParadigmCardProps) => {
  if (variant === 'compact') {
    return (
      <a
        href="https://www.ecoparadigm.net"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
        style={{
          background: 'hsl(160 30% 8%)',
          border: '1px solid hsl(160 30% 20%)',
        }}
      >
        <Building2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'hsl(160 50% 55%)' }} />
        <span className="text-[9px] font-mono" style={{ color: 'hsl(160 40% 65%)' }}>
          Need a structure built? → <span className="font-bold">Eco-Paradigm</span>
        </span>
        <ExternalLink className="w-2.5 h-2.5 ml-auto shrink-0" style={{ color: 'hsl(0 0% 35%)' }} />
      </a>
    );
  }

  if (variant === 'full') {
    return (
      <motion.div
        className="p-6 rounded-xl text-center"
        style={{
          background: 'linear-gradient(135deg, hsl(160 25% 8%), hsl(160 15% 5%))',
          border: '1px solid hsl(160 30% 18%)',
        }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Building2 className="w-6 h-6" style={{ color: 'hsl(160 50% 55%)' }} />
          <h4 className="font-bubble text-xl tracking-wider" style={{ color: 'hsl(40 50% 90%)' }}>
            BUILD YOUR STRUCTURE
          </h4>
        </div>
        <p className="font-body text-sm mb-4" style={{ color: 'hsl(0 0% 55%)' }}>
          Need a greenhouse or high tunnel built?
        </p>
        <p className="font-body font-bold text-lg mb-1" style={{ color: 'hsl(160 50% 60%)' }}>
          Eco-Paradigm
        </p>
        <p className="font-body text-xs italic mb-4" style={{ color: 'hsl(0 0% 45%)' }}>
          Sustainable Structure Design & Construction
        </p>
        <div className="space-y-2">
          <a
            href="https://www.ecoparadigm.net"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 transition-colors"
            style={{ color: 'hsl(160 40% 65%)' }}
          >
            <Globe className="w-4 h-4" />
            <span className="font-mono text-sm">ecoparadigm.net</span>
          </a>
          <a
            href="mailto:info@ecoparadigm.net"
            className="flex items-center justify-center gap-2 transition-colors"
            style={{ color: 'hsl(160 40% 65%)' }}
          >
            <Mail className="w-4 h-4" />
            <span className="font-mono text-sm">info@ecoparadigm.net</span>
          </a>
          <a
            href="tel:+14045551234"
            className="flex items-center justify-center gap-2 transition-colors"
            style={{ color: 'hsl(160 40% 65%)' }}
          >
            <Phone className="w-4 h-4" />
            <span className="font-mono text-sm">(404) 555-1234</span>
          </a>
        </div>
      </motion.div>
    );
  }

  // Default: inline variant (for PropagationPanel)
  return (
    <div
      className="p-3 rounded-xl"
      style={{
        background: 'linear-gradient(135deg, hsl(160 25% 8%), hsl(160 15% 5%))',
        border: '1px solid hsl(160 30% 18%)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Building2 className="w-4 h-4" style={{ color: 'hsl(160 50% 55%)' }} />
        <span className="text-[9px] font-mono tracking-widest font-bold" style={{ color: 'hsl(160 50% 55%)' }}>
          NEED A STRUCTURE BUILT?
        </span>
      </div>
      <p className="text-[9px] font-mono mb-2" style={{ color: 'hsl(0 0% 50%)' }}>
        For greenhouse & high tunnel construction, contact:
      </p>
      <p className="text-xs font-mono font-bold mb-2" style={{ color: 'hsl(160 50% 65%)' }}>
        Eco-Paradigm
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="https://www.ecoparadigm.net"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[8px] font-mono transition-colors"
          style={{ color: 'hsl(160 40% 60%)' }}
        >
          <Globe className="w-3 h-3" /> ecoparadigm.net
        </a>
        <a
          href="mailto:info@ecoparadigm.net"
          className="flex items-center gap-1 text-[8px] font-mono transition-colors"
          style={{ color: 'hsl(160 40% 60%)' }}
        >
          <Mail className="w-3 h-3" /> info@ecoparadigm.net
        </a>
        <a
          href="tel:+14045551234"
          className="flex items-center gap-1 text-[8px] font-mono transition-colors"
          style={{ color: 'hsl(160 40% 60%)' }}
        >
          <Phone className="w-3 h-3" /> (404) 555-1234
        </a>
      </div>
    </div>
  );
};

export default EcoParadigmCard;
