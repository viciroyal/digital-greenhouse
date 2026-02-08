import { useState } from 'react';
import { motion } from 'framer-motion';
import { Feather, ScrollText } from 'lucide-react';
import GlassModal from '@/components/ui/GlassModal';

interface AncientContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: string;
}

/**
 * THE ANCIENT CONTRACT - Sacred Checkout Ledger
 * 
 * A checkout modal styled as an aged parchment contract,
 * invoking the tradition of sacred trade agreements.
 * 
 * Refactored to use unified GlassModal system.
 */
const AncientContractModal = ({ isOpen, onClose, productName, price }: AncientContractModalProps) => {
  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSigned(true);
    }, 1500);
  };

  const handleClose = () => {
    setIsSigned(false);
    onClose();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={handleClose}
      variant="parchment"
      size="lg"
      closeVariant="wax-seal"
      className="relative"
    >
      {/* Aged paper texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 rounded-lg"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Burnt/torn edges effect */}
      <div 
        className="absolute -top-2 -left-2 -right-2 h-6 rounded-t-lg"
        style={{
          background: 'linear-gradient(180deg, hsl(25 50% 30% / 0.4), transparent)',
          filter: 'blur(3px)',
        }}
      />
      <div 
        className="absolute -bottom-2 -left-2 -right-2 h-6 rounded-b-lg"
        style={{
          background: 'linear-gradient(0deg, hsl(25 50% 30% / 0.4), transparent)',
          filter: 'blur(3px)',
        }}
      />

      {/* Contract Content */}
      <div className="relative p-4 md:p-6">
        {/* Header with scroll icon */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <ScrollText 
            className="w-6 h-6" 
            style={{ color: 'hsl(25 50% 35%)' }} 
          />
          <h2 
            className="text-2xl md:text-3xl text-center tracking-wider"
            style={{
              fontFamily: "'Staatliches', serif",
              color: 'hsl(25 60% 25%)',
              textShadow: '1px 1px 0 hsl(35 40% 90%)',
            }}
          >
            SACRED LEDGER
          </h2>
        </div>

        {/* Decorative line */}
        <div 
          className="h-px mb-6"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(25 50% 40%), transparent)',
          }}
        />

        {/* Contract text */}
        <div 
          className="mb-8 text-center"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: 'hsl(25 40% 25%)',
          }}
        >
          <p className="text-sm mb-4 leading-relaxed">
            By the sacred covenant of root and star,<br />
            I, the undersigned, do hereby agree to receive:
          </p>
          
          <div 
            className="py-4 px-6 rounded-lg my-6 mx-auto max-w-xs"
            style={{
              background: 'hsl(35 30% 90% / 0.5)',
              border: '1px dashed hsl(25 40% 50%)',
            }}
          >
            <p 
              className="text-lg font-bold"
              style={{ color: 'hsl(25 60% 30%)' }}
            >
              {productName}
            </p>
            <p 
              className="text-2xl mt-2"
              style={{ 
                fontFamily: "'Staatliches', serif",
                color: 'hsl(45 80% 35%)',
              }}
            >
              {price}
            </p>
          </div>

          <p className="text-xs opacity-70 italic">
            "In exchange for frequency, we trade only in truth."
          </p>
        </div>

        {/* Signature area */}
        <div className="mb-6">
          <div 
            className="h-px mb-2"
            style={{
              background: 'hsl(25 40% 40%)',
            }}
          />
          <p 
            className="text-xs text-center"
            style={{ 
              fontFamily: "'Space Mono', monospace",
              color: 'hsl(25 30% 50%)',
            }}
          >
            STEWARD'S MARK
          </p>
          
          {/* Signature visualization */}
          <div 
            className="h-16 mt-2 rounded flex items-center justify-center"
            style={{
              background: 'hsl(35 25% 88% / 0.5)',
            }}
          >
            {isSigned ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p 
                  className="text-2xl italic"
                  style={{ 
                    fontFamily: "cursive",
                    color: 'hsl(220 60% 30%)',
                  }}
                >
                  ✦ Sealed ✦
                </p>
              </motion.div>
            ) : (
              <p 
                className="text-sm opacity-50 italic"
                style={{ color: 'hsl(25 30% 40%)' }}
              >
                {isSigning ? 'Inscribing...' : 'Your mark will appear here'}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <motion.button
            className="flex-1 py-4 rounded-lg flex items-center justify-center gap-2"
            style={{
              background: isSigned 
                ? 'linear-gradient(135deg, hsl(140 50% 35%), hsl(140 40% 25%))'
                : 'linear-gradient(135deg, hsl(25 50% 40%), hsl(25 40% 30%))',
              border: '2px solid hsl(25 40% 50%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={isSigned ? handleClose : handleSign}
            disabled={isSigning}
          >
            <Feather 
              className="w-5 h-5" 
              style={{ color: 'hsl(35 50% 90%)' }} 
            />
            <span 
              className="font-mono text-sm tracking-wider uppercase"
              style={{ color: 'hsl(35 50% 90%)' }}
            >
              {isSigned ? 'CONTRACT SEALED' : isSigning ? 'SIGNING...' : 'SIGN & SEAL'}
            </span>
          </motion.button>
        </div>

        {/* Footer note */}
        <p 
          className="text-center text-[10px] mt-6 opacity-50"
          style={{ 
            fontFamily: "'Space Mono', monospace",
            color: 'hsl(25 30% 40%)',
          }}
        >
          This contract is bound by the laws of the Cosmic Garden
        </p>
      </div>

      {/* Wax seal decoration */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full z-10"
        style={{
          background: 'radial-gradient(circle at 40% 35%, hsl(0 60% 45%), hsl(0 50% 28%))',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <div 
          className="absolute inset-3 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 30% 30%, hsl(0 55% 50%), hsl(0 50% 35%))',
          }}
        >
          <span 
            className="text-2xl"
            style={{ 
              fontFamily: "'Staatliches', serif",
              color: 'hsl(0 30% 85%)',
            }}
          >
            ◈
          </span>
        </div>
      </motion.div>
    </GlassModal>
  );
};

export default AncientContractModal;
