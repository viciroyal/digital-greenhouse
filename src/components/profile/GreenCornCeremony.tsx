import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GreenCornCeremonyProps {
  userId: string;
  hasMasterStewardBadge: boolean;
  onReset: () => void;
}

/**
 * THE GREEN CORN CEREMONY (Posketv)
 * Muscogee tradition of Renewal
 * "When the cycle ends, we extinguish the old fire and light the new."
 */
const GreenCornCeremony = ({ userId, hasMasterStewardBadge, onReset }: GreenCornCeremonyProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRenewal, setShowRenewal] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  // Play crackling fire sound using Web Audio API
  const playFireSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioRef.current = audioContext;

      // Create noise for crackling effect
      const bufferSize = audioContext.sampleRate * 2;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate crackling noise pattern
      for (let i = 0; i < bufferSize; i++) {
        // Random crackles
        if (Math.random() < 0.002) {
          data[i] = (Math.random() * 2 - 1) * 0.8;
        } else {
          data[i] = (Math.random() * 2 - 1) * 0.05;
        }
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      // Low-pass filter for warmth
      const lowpass = audioContext.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 800;

      // High-pass to remove rumble
      const highpass = audioContext.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 100;

      // Gain envelope
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.5);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 3);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 5);

      source.connect(lowpass);
      lowpass.connect(highpass);
      highpass.connect(gainNode);
      gainNode.connect(audioContext.destination);

      source.start();
      source.stop(audioContext.currentTime + 5);

      // Cleanup
      setTimeout(() => {
        audioContext.close();
      }, 6000);
    } catch (error) {
      console.log('Audio not available:', error);
    }
  }, []);

  const performCeremony = async () => {
    setIsProcessing(true);

    try {
      // 1. Archive field journal entries (update status to 'archived')
      const { error: archiveError } = await supabase
        .from('field_journal')
        .update({ status: 'archived' })
        .eq('user_id', userId)
        .in('status', ['pending', 'certified', 'approved']);

      if (archiveError) {
        console.error('Archive error:', archiveError);
        // Continue even if archive fails (might be no entries)
      }

      // 2. Reset lesson progress (delete all lesson progress)
      const { error: lessonError } = await supabase
        .from('user_lesson_progress')
        .delete()
        .eq('user_id', userId);

      if (lessonError) {
        throw lessonError;
      }

      // 3. Reset module progress (keep first module unlocked, clear completions)
      // First, get all module progress
      const { data: moduleProgress } = await supabase
        .from('user_module_progress')
        .select('id, module_id')
        .eq('user_id', userId);

      if (moduleProgress && moduleProgress.length > 0) {
        // Get first module to keep it unlocked
        const { data: firstModule } = await supabase
          .from('modules')
          .select('id')
          .eq('order_index', 1)
          .single();

        // Delete all module progress except first module
        const { error: moduleDeleteError } = await supabase
          .from('user_module_progress')
          .delete()
          .eq('user_id', userId)
          .neq('module_id', firstModule?.id || '');

        if (moduleDeleteError) {
          console.error('Module delete error:', moduleDeleteError);
        }

        // Clear completion on first module
        if (firstModule) {
          await supabase
            .from('user_module_progress')
            .update({ completed_at: null })
            .eq('user_id', userId)
            .eq('module_id', firstModule.id);
        }
      }

      // Play fire sound
      playFireSound();

      // Show renewal message
      setIsConfirmOpen(false);
      setShowRenewal(true);

      // Notify parent to refresh data
      setTimeout(() => {
        onReset();
      }, 1000);

      // Hide renewal message after delay
      setTimeout(() => {
        setShowRenewal(false);
      }, 5000);

      toast.success('The New Cycle Begins', {
        description: 'Your field journal has been archived and progress reset.',
      });
    } catch (error) {
      console.error('Ceremony error:', error);
      toast.error('The fire would not light', {
        description: 'Unable to complete the ceremony. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Green Corn Ceremony Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8 p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, hsl(20 30% 12%) 0%, hsl(15 35% 8%) 100%)',
          border: '2px solid hsl(25 40% 25%)',
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(145deg, hsl(25 50% 20%), hsl(15 45% 12%))',
              border: '1px solid hsl(25 50% 35%)',
            }}
            animate={{
              boxShadow: [
                '0 0 10px hsl(25 70% 40% / 0.2)',
                '0 0 20px hsl(25 70% 50% / 0.4)',
                '0 0 10px hsl(25 70% 40% / 0.2)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Flame 
              className="w-6 h-6" 
              style={{ color: 'hsl(25 80% 55%)' }}
            />
          </motion.div>
          <div>
            <h3
              className="text-lg tracking-wider mb-1"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: 'hsl(25 70% 60%)',
              }}
            >
              THE GREEN CORN CEREMONY
            </h3>
            <p
              className="text-sm tracking-widest"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: 'hsl(25 50% 45%)',
              }}
            >
              (Posketv)
            </p>
          </div>
        </div>

        {/* Context */}
        <p
          className="text-sm leading-relaxed mb-6 italic"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: 'hsl(40 40% 65%)',
          }}
        >
          "When the corn is ripe, we extinguish the old fire and light the new. 
          All debts are forgiven."
        </p>

        {/* Master Steward Badge Notice */}
        {hasMasterStewardBadge && (
          <motion.div
            className="mb-4 p-3 rounded-lg flex items-center gap-3"
            style={{
              background: 'hsl(45 40% 15% / 0.5)',
              border: '1px solid hsl(45 50% 40%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-lg">👑</span>
            <p
              className="text-xs"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: 'hsl(45 60% 65%)',
              }}
            >
              Your "Master Steward" badge will be preserved through the renewal.
            </p>
          </motion.div>
        )}

        {/* Reset Button */}
        <motion.button
          className="w-full py-4 rounded-xl flex items-center justify-center gap-3 text-sm tracking-widest"
          style={{
            fontFamily: "'Staatliches', sans-serif",
            background: 'hsl(0 0% 18%)',
            border: '2px solid hsl(0 0% 30%)',
            color: 'hsl(0 0% 60%)',
          }}
          whileHover={{
            background: 'linear-gradient(145deg, hsl(25 60% 25%), hsl(15 50% 18%))',
            borderColor: 'hsl(25 70% 50%)',
            color: 'hsl(25 80% 70%)',
            boxShadow: '0 0 30px hsl(25 70% 40% / 0.4)',
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsConfirmOpen(true)}
        >
          <Flame className="w-5 h-5" />
          IGNITE THE NEW FIRE (RESET SEASON)
        </motion.button>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent
          className="max-w-md"
          style={{
            background: 'linear-gradient(180deg, hsl(0 30% 15%) 0%, hsl(15 35% 10%) 100%)',
            border: '2px solid hsl(25 50% 40%)',
            color: 'hsl(40 50% 85%)',
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="text-xl tracking-wider flex items-center gap-3"
              style={{ fontFamily: "'Staatliches', sans-serif", color: 'hsl(25 70% 60%)' }}
            >
              <AlertTriangle className="w-6 h-6" style={{ color: 'hsl(45 80% 55%)' }} />
              CONFIRM THE CEREMONY
            </DialogTitle>
            <DialogDescription
              className="text-sm pt-2"
              style={{ fontFamily: "'Space Mono', monospace", color: 'hsl(40 40% 65%)' }}
            >
              This sacred act cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{
                background: 'hsl(25 30% 12% / 0.8)',
                border: '1px solid hsl(25 40% 30%)',
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'hsl(40 50% 75%)' }}
              >
                The following will occur:
              </p>
              <ul className="mt-3 space-y-2 text-xs" style={{ fontFamily: "'Space Mono', monospace" }}>
                <li className="flex items-center gap-2">
                  <span style={{ color: 'hsl(140 50% 50%)' }}>✓</span>
                  <span style={{ color: 'hsl(40 40% 65%)' }}>Field Journal photos moved to "The Vault"</span>
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: 'hsl(140 50% 50%)' }}>✓</span>
                  <span style={{ color: 'hsl(40 40% 65%)' }}>All 4 Level checklists reset to empty</span>
                </li>
                <li className="flex items-center gap-2">
                  <span style={{ color: 'hsl(45 80% 55%)' }}>👑</span>
                  <span style={{ color: 'hsl(45 60% 65%)' }}>Master Steward badge preserved (if earned)</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isProcessing}
                style={{
                  background: 'hsl(0 0% 15%)',
                  borderColor: 'hsl(0 0% 30%)',
                  color: 'hsl(0 0% 60%)',
                }}
              >
                Cancel
              </Button>
              <motion.button
                className="flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  background: 'linear-gradient(145deg, hsl(25 60% 35%), hsl(15 50% 25%))',
                  border: '2px solid hsl(25 70% 50%)',
                  color: 'hsl(40 90% 85%)',
                }}
                whileHover={{
                  boxShadow: '0 0 25px hsl(25 70% 50% / 0.5)',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={performCeremony}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Flame className="w-4 h-4" />
                    LIGHT THE FIRE
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Renewal Celebration Overlay */}
      <AnimatePresence>
        {showRenewal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'hsl(15 50% 5% / 0.95)',
            }}
          >
            {/* Fire particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${30 + Math.random() * 40}%`,
                    bottom: '30%',
                    width: `${4 + Math.random() * 8}px`,
                    height: `${4 + Math.random() * 8}px`,
                    background: `hsl(${20 + Math.random() * 25} ${70 + Math.random() * 30}% ${50 + Math.random() * 30}%)`,
                  }}
                  initial={{ y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    y: -(100 + Math.random() * 200),
                    opacity: [1, 1, 0],
                    scale: [1, 0.5, 0],
                    x: (Math.random() - 0.5) * 100,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>

            {/* Central fire glow */}
            <motion.div
              className="absolute"
              style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, hsl(25 80% 50% / 0.4) 0%, transparent 70%)',
                bottom: '20%',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Message */}
            <motion.div
              className="text-center z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                animate={{
                  textShadow: [
                    '0 0 20px hsl(25 80% 50% / 0.5)',
                    '0 0 40px hsl(25 80% 60% / 0.8)',
                    '0 0 20px hsl(25 80% 50% / 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <h2
                  className="text-3xl sm:text-4xl mb-4 tracking-widest"
                  style={{
                    fontFamily: "'Staatliches', sans-serif",
                    color: 'hsl(25 80% 70%)',
                  }}
                >
                  THE OLD DEBTS ARE FORGIVEN
                </h2>
                <p
                  className="text-xl sm:text-2xl tracking-wide"
                  style={{
                    fontFamily: "'Staatliches', sans-serif",
                    color: 'hsl(45 70% 65%)',
                  }}
                >
                  THE NEW CYCLE BEGINS
                </p>
              </motion.div>

              <motion.p
                className="mt-6 text-sm"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: 'hsl(40 40% 55%)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                — Posketv (Muscogee Green Corn Ceremony)
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GreenCornCeremony;
