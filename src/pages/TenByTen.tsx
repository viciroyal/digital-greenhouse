import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sprout } from 'lucide-react';
import collectivelySustainable from '@/assets/collectively-sustainable.png';

const TenByTen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'hsl(140 15% 5%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full transition-colors"
          style={{ background: 'hsl(0 0% 10%)', color: 'hsl(0 0% 60%)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5" style={{ color: 'hsl(130 50% 55%)' }} />
          <span className="font-mono text-sm tracking-wider" style={{ color: 'hsl(130 50% 55%)' }}>
            10 × 10
          </span>
        </div>
        <div className="w-9" />
      </div>

      {/* Hero */}
      <div className="max-w-lg mx-auto px-4 pb-20">
        <motion.div
          className="flex flex-col items-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={collectivelySustainable}
            alt="Collectively Sustainable"
            className="w-28 mb-8"
            style={{
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 12px hsl(45 60% 50% / 0.4))',
            }}
          />

          <h1
            className="text-3xl md:text-4xl font-bold text-center mb-3"
            style={{ color: 'hsl(0 0% 90%)' }}
          >
            10 × 10
          </h1>

          <p
            className="text-sm text-center font-mono tracking-wide mb-10"
            style={{ color: 'hsl(130 50% 55% / 0.7)' }}
          >
            by Collectively Sustainable
          </p>

          <div
            className="w-full rounded-2xl p-6 md:p-8 text-center"
            style={{
              background: 'hsl(0 0% 7%)',
              border: '1px solid hsl(130 50% 45% / 0.2)',
            }}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'hsl(0 0% 65%)' }}
            >
              Coming soon — a curated framework for building a 10 × 10 regenerative growing space. Stay tuned.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TenByTen;
