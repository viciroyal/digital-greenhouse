import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PharmersPledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const pledgeText = [
  "We do not just grow food. We grow frequency.",
  "",
  "We Pharm because the soil holds the memory.",
  "",
  "The Muscogee who built the mounds.",
  "",
  "The Maroons who hid the seeds of freedom in the hills.",
  "",
  "The Dogon who mapped the stars to the harvest.",
  "",
  "The Kemetic Priests who mastered the alchemy of gold.",
  "",
  "To enter this school is to remember them."
];

/**
 * The Pharmer's Pledge Modal - "The Gatekeeper"
 * 
 * A sacred scroll experience that serves as the initiation
 * into the Pharmer's Portal (The School).
 */
const PharmersPledgeModal = ({ isOpen, onClose }: PharmersPledgeModalProps) => {
  const [scrollComplete, setScrollComplete] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScrollComplete(false);
      setIsUnlocking(false);
    }
  }, [isOpen]);

  // Auto-scroll the text like Star Wars opening crawl
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setScrollComplete(true);
    }, 12000); // 12 seconds for the full scroll

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleRemember = () => {
    setIsUnlocking(true);
    
    // Play stone door sound effect
    const audio = new Audio();
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleR8LT5fUyoZlKytcltjJf1swN2eY0sB3XDQ5bp7PuHRdOT1yosywb1xAQ3Wlx6hrX0VHeanCoWddSkt9rcCcY1tNUIGwvZZgWk9UhbO5kV1YUViItrWMWlZTV4u4sohWU1VbjbqvhFNRV1+RvKuAT09aY5S+p3tMTl1mmcCjdklNYGqcwaB0R0tibaDBnXFFSmVwoMKackRJaHOjw5lvQkhrdqbEnGxAR255qcWYaT5GcHurxpVmPEVzfq7HkmM6RHWBsMiPYDhDeISyyY1dNkJ7h7TKil02QnyJtsuHWjVBfYu3zIRXM0B/jbjNgVQyP4GOuc59UjE+go+6z3xQLz6Dkb3PeU4tPYSTvtB2TC08hpW/0XNKKzuHl8DRcUgqOoiZwdJvRik5iZrC025EKDmLnMPTa0InOIyexNRpQCY3jp/F1WY+JTePocbVZDwkNpCix9ZiOiM1kaTI12A5IjWSpcnYXjchNJOmy9hdNyE0lKfL2Vs2IDSVqMzZWTUfM5apzdlXNB4ylqrO2VUzHTGXq8/ZUzIdMZiszthRMRwwmK3Q2E8wGy+Zrs/YTi8aLpqv0NhMLhktm7DR2EotGCycsdHYSSsYLJ2y0thHKhcrnbPS2EUpFiqetNPYQygWKZ+109hBJxUon7bU2D8mFCegtdTYPSUTJqG21Ng7JBMlorfV2DojEiSjuNbYOCIRJKS51tg2IRAjpbrW2TQgDyKmutfZMh8OIae72NkxHg4hqLzY2S8dDSCpvNjZLRwNIKq92dkrGwwfrb7Z2SkaCx6uv9rZJxoLHq+/2tklGQodr8Db2iQYCh2wwd3aIxgJHLHC3dohFwkbssLd2h8WCBuzw97aHhYIG7TE3toeFQcatMTe2h0VBxq1xd/aHBQGGbbF39oaFAYZtsbg2xkTBRi3x+DbGBIFGLjH4NsXEgQXucjh2xYRBBe6yOHbFREEF7rJ4tsUEAMWu8ni2xMQAxW8yuPbEg8DFb3K49sRDgIVvsvk3BAOAhS/zOTcDw0CFMDMpnsPDQEUwc2hewBvbWs=';
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore if autoplay blocked
    
    // Delay navigation for dramatic effect
    setTimeout(() => {
      onClose();
      navigate('/ancestral-path');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Aged Parchment over Dark Soil Background */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(180deg,
                  hsl(30 30% 10%) 0%,
                  hsl(25 35% 8%) 30%,
                  hsl(20 40% 6%) 60%,
                  hsl(15 45% 5%) 100%
                )
              `,
            }}
          />
          
          {/* Parchment texture overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* Soil texture at bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1/3"
            style={{
              background: `
                linear-gradient(0deg,
                  hsl(20 50% 8%) 0%,
                  transparent 100%
                )
              `,
            }}
          />

          {/* Close button */}
          <motion.button
            className="absolute top-6 right-6 p-3 rounded-full z-10"
            style={{
              background: 'hsl(20 30% 15% / 0.8)',
              border: '1px solid hsl(40 40% 30%)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            <X className="w-6 h-6 text-cream-muted" />
          </motion.button>

          {/* Content Container */}
          <div className="relative w-full max-w-3xl mx-auto px-8 h-full flex flex-col items-center justify-center overflow-hidden">
            
            {/* The Title - Wood-carved style */}
            <motion.h1
              className="text-4xl md:text-6xl text-center mb-12 tracking-[0.2em]"
              style={{
                fontFamily: "'Staatliches', 'Chewy', sans-serif",
                color: 'hsl(40 60% 70%)',
                textShadow: `
                  2px 2px 0 hsl(20 50% 15%),
                  4px 4px 8px rgba(0,0,0,0.6),
                  0 0 40px hsl(40 50% 40% / 0.3)
                `,
              }}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              THE PHARMER'S PLEDGE
            </motion.h1>

            {/* Star Wars style scrolling text container */}
            <div 
              ref={scrollContainerRef}
              className="relative w-full h-[40vh] overflow-hidden"
              style={{
                perspective: '400px',
                perspectiveOrigin: 'center top',
              }}
            >
              {/* Fade gradients */}
              <div 
                className="absolute inset-x-0 top-0 h-20 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, hsl(25 35% 8%) 0%, transparent 100%)',
                }}
              />
              <div 
                className="absolute inset-x-0 bottom-0 h-20 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(0deg, hsl(25 35% 8%) 0%, transparent 100%)',
                }}
              />

              {/* Scrolling text */}
              <motion.div
                className="absolute inset-x-0 text-center"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(25deg)',
                }}
                initial={{ y: '100%' }}
                animate={{ y: '-100%' }}
                transition={{
                  duration: 12,
                  ease: 'linear',
                }}
              >
                {pledgeText.map((line, index) => (
                  <p
                    key={index}
                    className="text-xl md:text-2xl font-body leading-relaxed mb-6"
                    style={{
                      color: line ? 'hsl(40 50% 85%)' : 'transparent',
                      textShadow: line ? '0 0 20px hsl(40 50% 60% / 0.5)' : 'none',
                    }}
                  >
                    {line || '\u00A0'}
                  </p>
                ))}
              </motion.div>
            </div>

            {/* The Lock Mechanism */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.button
                className="relative px-12 py-4 rounded-full font-bubble text-lg tracking-wider overflow-hidden"
                style={{
                  background: scrollComplete 
                    ? 'linear-gradient(135deg, hsl(40 60% 35%), hsl(30 50% 25%))'
                    : 'hsl(0 0% 30%)',
                  border: scrollComplete
                    ? '2px solid hsl(40 70% 50%)'
                    : '2px solid hsl(0 0% 40%)',
                  color: scrollComplete ? 'hsl(40 60% 90%)' : 'hsl(0 0% 60%)',
                  boxShadow: scrollComplete 
                    ? '0 0 30px hsl(40 60% 40% / 0.5), inset 0 2px 10px hsl(40 80% 60% / 0.2)'
                    : 'none',
                  cursor: scrollComplete ? 'pointer' : 'not-allowed',
                }}
                disabled={!scrollComplete}
                whileHover={scrollComplete ? { scale: 1.05 } : {}}
                whileTap={scrollComplete ? { scale: 0.98 } : {}}
                onClick={handleRemember}
              >
                {/* Unlocking animation overlay */}
                {isUnlocking && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent, hsl(40 80% 60%), transparent)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}
                
                <span className="relative z-10">
                  {isUnlocking ? 'UNLOCKING...' : 'I REMEMBER'}
                </span>
              </motion.button>
              
              {!scrollComplete && (
                <motion.p
                  className="text-center mt-4 text-sm font-body"
                  style={{ color: 'hsl(40 30% 50%)' }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Read the sacred text...
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Stone door effect when unlocking */}
          <AnimatePresence>
            {isUnlocking && (
              <>
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1/2"
                  style={{
                    background: 'linear-gradient(90deg, hsl(20 40% 10%), hsl(25 35% 15%))',
                    boxShadow: 'inset -10px 0 30px rgba(0,0,0,0.5)',
                  }}
                  initial={{ x: 0 }}
                  animate={{ x: '-100%' }}
                  transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
                />
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-1/2"
                  style={{
                    background: 'linear-gradient(-90deg, hsl(20 40% 10%), hsl(25 35% 15%))',
                    boxShadow: 'inset 10px 0 30px rgba(0,0,0,0.5)',
                  }}
                  initial={{ x: 0 }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PharmersPledgeModal;
