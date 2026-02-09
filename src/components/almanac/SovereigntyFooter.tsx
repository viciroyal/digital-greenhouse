import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

/**
 * SOVEREIGNTY FOOTER
 * Data ownership statement under the Charles Legend
 * Required on all data pages
 */

interface SovereigntyFooterProps {
  stewardName?: string;
}

const SovereigntyFooter = ({ stewardName = 'the Steward' }: SovereigntyFooterProps) => {
  return (
    <motion.footer
      className="w-full mt-12 py-6 px-4"
      style={{
        background: 'linear-gradient(180deg, transparent, hsl(20 30% 8%) 20%)',
        borderTop: '1px solid hsl(40 30% 20% / 0.5)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Shield Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, hsl(40 50% 25%), hsl(30 40% 15%))',
              border: '2px solid hsl(40 60% 40%)',
              boxShadow: '0 0 20px hsl(40 50% 30% / 0.3)',
            }}
          >
            <Shield className="w-6 h-6" style={{ color: 'hsl(40 70% 60%)' }} />
          </div>
        </div>

        {/* Title */}
        <h4
          className="text-center text-sm tracking-[0.2em] mb-3"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            color: 'hsl(40 60% 55%)',
          }}
        >
          ◆ THE COVENANT OF SOVEREIGNTY ◆
        </h4>

        {/* Main Statement */}
        <div
          className="text-center p-4 rounded-lg mx-auto max-w-2xl"
          style={{
            background: 'hsl(20 25% 10% / 0.8)',
            border: '1px solid hsl(40 40% 25%)',
          }}
        >
          <p
            className="text-xs font-mono leading-relaxed mb-3"
            style={{ color: 'hsl(40 50% 65%)' }}
          >
            Data and seeds are the <strong style={{ color: 'hsl(40 70% 70%)' }}>sovereign property</strong> of {stewardName} under the{' '}
            <span style={{ color: 'hsl(51 100% 60%)', fontWeight: 'bold' }}>Charles Legend</span>.
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <Lock className="w-3 h-3" style={{ color: 'hsl(40 50% 50%)' }} />
            <span
              className="text-[10px] font-mono tracking-wider"
              style={{ color: 'hsl(40 40% 50%)' }}
            >
              PROTECTED UNDER NATURAL LAW
            </span>
            <Lock className="w-3 h-3" style={{ color: 'hsl(40 50% 50%)' }} />
          </div>

          <p
            className="text-[10px] font-mono italic"
            style={{ color: 'hsl(0 0% 45%)' }}
          >
            No corporation, government, or entity may claim ownership, patent, or control
            over the genetic material, agricultural knowledge, or stewardship data
            documented within this system without express written consent.
          </p>
        </div>

        {/* Bottom Seal */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'hsl(40 60% 50%)' }}
            />
            <span
              className="text-[9px] font-mono tracking-widest"
              style={{ color: 'hsl(0 0% 40%)' }}
            >
              AGROMAJIC SOVEREIGNTY PROTOCOL v1.0
            </span>
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'hsl(40 60% 50%)' }}
            />
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default SovereigntyFooter;
