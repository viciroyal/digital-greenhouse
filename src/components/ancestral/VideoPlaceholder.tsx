import { motion } from 'framer-motion';
import { Play, Radio } from 'lucide-react';

interface VideoPlaceholderProps {
  color: string;
  title?: string;
}

/**
 * Video Placeholder - 9:16 Vertical TikTok-style
 * Displays a glowing placeholder for video content
 */
const VideoPlaceholder = ({ color, title }: VideoPlaceholderProps) => {
  return (
    <motion.div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        aspectRatio: '9/16',
        maxHeight: '400px',
        background: 'hsl(0 0% 5%)',
        border: `2px solid ${color}40`,
        boxShadow: `0 0 30px ${color}20, inset 0 0 40px ${color}10`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated glow border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: `2px solid ${color}`,
          opacity: 0.5,
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          boxShadow: [
            `0 0 10px ${color}40`,
            `0 0 30px ${color}60`,
            `0 0 10px ${color}40`,
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Film grain texture */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 100% / 0.03) 2px, hsl(0 0% 100% / 0.03) 4px)',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        {/* Radio wave animation */}
        <motion.div className="relative mb-6">
          {/* Expanding rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid ${color}`,
              }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{
                scale: [1, 2 + ring * 0.5],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: ring * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}
          
          {/* Play button */}
          <motion.div
            className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: `${color}30`,
              border: `2px solid ${color}`,
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: `0 0 40px ${color}60`,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-8 h-8 ml-1" style={{ color }} />
          </motion.div>
        </motion.div>

        {/* Title */}
        {title && (
          <motion.p
            className="text-sm font-mono text-center mb-2 tracking-wide"
            style={{ color }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.p>
        )}

        {/* Status text */}
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Radio className="w-4 h-4" style={{ color: 'hsl(40 50% 50%)' }} />
          <p 
            className="text-xs font-mono tracking-[0.2em]"
            style={{ color: 'hsl(40 50% 50%)' }}
          >
            INITIATE TRANSMISSION
          </p>
        </motion.div>
        
        <p 
          className="text-xs font-mono mt-1 opacity-50"
          style={{ color: 'hsl(40 40% 50%)' }}
        >
          (Waiting for Signal...)
        </p>
      </div>

      {/* Corner decorations */}
      <div
        className="absolute top-3 left-3 w-6 h-6"
        style={{
          borderTop: `2px solid ${color}40`,
          borderLeft: `2px solid ${color}40`,
        }}
      />
      <div
        className="absolute top-3 right-3 w-6 h-6"
        style={{
          borderTop: `2px solid ${color}40`,
          borderRight: `2px solid ${color}40`,
        }}
      />
      <div
        className="absolute bottom-3 left-3 w-6 h-6"
        style={{
          borderBottom: `2px solid ${color}40`,
          borderLeft: `2px solid ${color}40`,
        }}
      />
      <div
        className="absolute bottom-3 right-3 w-6 h-6"
        style={{
          borderBottom: `2px solid ${color}40`,
          borderRight: `2px solid ${color}40`,
        }}
      />
    </motion.div>
  );
};

export default VideoPlaceholder;
