import BrixMeter from './BrixMeter';
import { motion, AnimatePresence } from 'framer-motion';

interface BrixLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

/**
 * Full-screen Brix Loading Overlay
 * 
 * Use this for page-level or feature-level loading states.
 * Displays the refractometer-style Brix Meter instead of a standard spinner.
 */
const BrixLoadingOverlay = ({ isLoading, message }: BrixLoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(250 50% 10% / 0.95), hsl(250 60% 5% / 0.98))',
            backdropFilter: 'blur(8px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <BrixMeter isLoading={true} />
            {message && (
              <p 
                className="text-center mt-4 text-sm font-body"
                style={{ color: 'hsl(40 50% 70%)' }}
              >
                {message}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrixLoadingOverlay;
