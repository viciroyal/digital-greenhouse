import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Star Compass Icon - Polynesian Wayfinders
const StarCompassIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    {/* Outer circle */}
    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Inner circle */}
    <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
    {/* Star points - cardinal directions */}
    <path d="M24 4 L26 18 L24 22 L22 18 Z" fill="hsl(200 70% 60%)" stroke="currentColor" strokeWidth="0.5" />
    <path d="M44 24 L30 26 L26 24 L30 22 Z" fill="hsl(200 70% 60%)" stroke="currentColor" strokeWidth="0.5" />
    <path d="M24 44 L22 30 L24 26 L26 30 Z" fill="hsl(200 70% 60%)" stroke="currentColor" strokeWidth="0.5" />
    <path d="M4 24 L18 22 L22 24 L18 26 Z" fill="hsl(200 70% 60%)" stroke="currentColor" strokeWidth="0.5" />
    {/* Diagonal points */}
    <path d="M38 10 L28 20 L26 18 L30 14 Z" fill="hsl(45 80% 60%)" stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
    <path d="M38 38 L28 28 L30 26 L34 30 Z" fill="hsl(45 80% 60%)" stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
    <path d="M10 38 L20 28 L22 30 L18 34 Z" fill="hsl(45 80% 60%)" stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
    <path d="M10 10 L20 20 L18 22 L14 18 Z" fill="hsl(45 80% 60%)" stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
    {/* Center */}
    <circle cx="24" cy="24" r="3" fill="hsl(200 70% 70%)" />
  </svg>
);

// Maasai Shield Icon - Guardians
const MaasaiShieldIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 56" className={className} fill="none">
    {/* Shield body - elongated oval */}
    <ellipse cx="20" cy="28" rx="16" ry="24" fill="hsl(0 70% 40%)" stroke="currentColor" strokeWidth="1.5" />
    {/* Central spine */}
    <line x1="20" y1="6" x2="20" y2="50" stroke="hsl(45 80% 70%)" strokeWidth="2" />
    {/* Traditional markings - geometric patterns */}
    <path d="M12 16 L20 12 L28 16" stroke="hsl(45 80% 70%)" strokeWidth="1.5" fill="none" />
    <path d="M12 24 L20 20 L28 24" stroke="hsl(0 0% 95%)" strokeWidth="1" fill="none" />
    <path d="M12 32 L20 28 L28 32" stroke="hsl(0 0% 95%)" strokeWidth="1" fill="none" />
    <path d="M12 40 L20 36 L28 40" stroke="hsl(45 80% 70%)" strokeWidth="1.5" fill="none" />
    {/* Side stripes */}
    <rect x="6" y="20" width="4" height="16" rx="2" fill="hsl(0 0% 15%)" />
    <rect x="30" y="20" width="4" height="16" rx="2" fill="hsl(0 0% 15%)" />
    {/* Decorative dots */}
    <circle cx="10" cy="28" r="1.5" fill="hsl(45 80% 70%)" />
    <circle cx="30" cy="28" r="1.5" fill="hsl(45 80% 70%)" />
  </svg>
);

// Kora Icon - West African Griot Harp
const KoraIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 56" className={className} fill="none">
    {/* Calabash resonator */}
    <ellipse cx="20" cy="42" rx="14" ry="10" fill="hsl(30 60% 35%)" stroke="currentColor" strokeWidth="1.5" />
    {/* Calabash detail - gourd texture */}
    <path d="M8 42 Q20 48, 32 42" stroke="hsl(30 40% 25%)" strokeWidth="0.75" fill="none" />
    {/* Neck (nyarang) */}
    <rect x="18" y="8" width="4" height="36" rx="1" fill="hsl(25 50% 30%)" stroke="currentColor" strokeWidth="0.75" />
    {/* Bridge (bato) */}
    <rect x="14" y="36" width="12" height="3" rx="1" fill="hsl(30 40% 45%)" stroke="currentColor" strokeWidth="0.5" />
    {/* Handlebars (bulkalamo) */}
    <path d="M8 12 Q8 4, 18 8" stroke="hsl(25 50% 30%)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M32 12 Q32 4, 22 8" stroke="hsl(25 50% 30%)" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Strings (21 strings abstracted to 7) */}
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <line 
        key={i}
        x1={12 + i * 2.5} 
        y1="12" 
        x2={14 + i * 1.7} 
        y2="36" 
        stroke="hsl(45 80% 70%)" 
        strokeWidth="0.5"
        opacity={0.8}
      />
    ))}
    {/* Tuning rings */}
    <circle cx="10" cy="10" r="2" fill="hsl(45 70% 50%)" />
    <circle cx="30" cy="10" r="2" fill="hsl(45 70% 50%)" />
  </svg>
);

// Mortar & Pestle Icon - Cherokee (Tsalagi)
const MortarPestleIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    {/* Mortar bowl */}
    <path 
      d="M8 24 Q8 40, 24 42 Q40 40, 40 24 L40 28 Q40 44, 24 46 Q8 44, 8 28 Z" 
      fill="hsl(25 30% 25%)" 
      stroke="currentColor" 
      strokeWidth="1.5" 
    />
    {/* Mortar opening */}
    <ellipse cx="24" cy="24" rx="16" ry="6" fill="hsl(20 25% 18%)" stroke="currentColor" strokeWidth="1.5" />
    {/* Inner shadow */}
    <ellipse cx="24" cy="26" rx="12" ry="4" fill="hsl(20 20% 12%)" opacity="0.6" />
    {/* Pestle */}
    <rect x="30" y="4" width="6" height="24" rx="3" fill="hsl(30 35% 35%)" stroke="currentColor" strokeWidth="1" transform="rotate(25 33 16)" />
    {/* Pestle tip */}
    <ellipse cx="36" cy="22" rx="4" ry="5" fill="hsl(30 30% 40%)" stroke="currentColor" strokeWidth="0.75" transform="rotate(25 36 22)" />
    {/* Herbs inside */}
    <circle cx="20" cy="25" r="2" fill="hsl(140 50% 35%)" opacity="0.7" />
    <circle cx="26" cy="24" r="1.5" fill="hsl(120 40% 40%)" opacity="0.6" />
    <circle cx="23" cy="27" r="1" fill="hsl(100 45% 45%)" opacity="0.5" />
  </svg>
);

interface UtilityTool {
  id: string;
  name: string;
  culture: string;
  tooltip: string;
  icon: React.ReactNode;
  color: string;
}

const utilityTools: UtilityTool[] = [
  {
    id: 'compass',
    name: 'THE COMPASS',
    culture: 'Polynesia (Wayfinders)',
    tooltip: 'Navigate the Season',
    icon: <StarCompassIcon className="w-8 h-8" />,
    color: 'hsl(200 70% 50%)',
  },
  {
    id: 'shield',
    name: 'THE SHIELD',
    culture: 'Maasai (Guardians)',
    tooltip: 'Protect the Herd',
    icon: <MaasaiShieldIcon className="w-7 h-10" />,
    color: 'hsl(0 70% 45%)',
  },
  {
    id: 'kora',
    name: 'THE KORA',
    culture: 'The Griot (West Africa)',
    tooltip: 'Sing the Story',
    icon: <KoraIcon className="w-7 h-10" />,
    color: 'hsl(30 60% 45%)',
  },
  {
    id: 'mortar',
    name: 'THE MORTAR',
    culture: 'Cherokee (Tsalagi)',
    tooltip: 'The Land is the Medicine',
    icon: <MortarPestleIcon className="w-8 h-8" />,
    color: 'hsl(140 55% 35%)', // Deep Green glow for the Green Pharmacy
  },
];

// Placeholder content for each tool's modal
const toolContent: Record<string, { title: string; description: string; comingSoon: boolean }> = {
  compass: {
    title: 'Farm Calendar & Financial Dashboard',
    description: 'Navigate the seasons with lunar planting cycles, market timing, and financial projections rooted in Polynesian wayfinding principles.',
    comingSoon: true,
  },
  shield: {
    title: 'Pest & Disease Protocol (IPM)',
    description: 'Integrated Pest Management protocols inspired by Maasai guardianship — protect your herd (plants) through observation, prevention, and targeted intervention.',
    comingSoon: true,
  },
  kora: {
    title: 'Social Media & Marketing Assets',
    description: 'Tell your farm\'s story with the art of the Griot. Access templates, content calendars, and visual assets to sing your harvest\'s song.',
    comingSoon: true,
  },
  mortar: {
    title: 'The Herbal Apothecary',
    description: 'Honor the Green Pharmacy of the Cherokee (Tsalagi) tradition. Access herbal protocols, preparation methods, and the medicine wheel of the local Georgia flora.',
    comingSoon: true,
  },
};

const StewardsUtilityBelt = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <>
      {/* Fixed bottom utility bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      >
        <div 
          className="max-w-lg mx-auto pointer-events-auto rounded-2xl overflow-hidden"
          style={{
            // Wood & Leather texture styling
            background: `
              linear-gradient(180deg, 
                hsl(25 40% 22%) 0%, 
                hsl(20 45% 16%) 50%,
                hsl(15 50% 12%) 100%
              )
            `,
            border: '2px solid hsl(30 50% 30%)',
            boxShadow: `
              0 -4px 20px hsl(0 0% 0% / 0.5),
              inset 0 1px 0 hsl(40 40% 35% / 0.3),
              inset 0 -1px 0 hsl(20 50% 8% / 0.5)
            `,
          }}
        >
          {/* Leather stitching effect - top */}
          <div 
            className="h-1 w-full"
            style={{
              background: 'repeating-linear-gradient(90deg, hsl(35 50% 40%) 0px, hsl(35 50% 40%) 4px, transparent 4px, transparent 8px)',
              opacity: 0.4,
            }}
          />
          
          {/* Tool buttons */}
          <div className="flex items-center justify-around py-3 px-4">
            {utilityTools.map((tool, index) => (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    className="relative flex flex-col items-center gap-1 p-2 rounded-xl transition-colors"
                    style={{
                      color: 'hsl(40 50% 75%)',
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      color: tool.color,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTool(tool.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    {/* Icon container with subtle glow on hover */}
                    <motion.div
                      className="relative"
                      whileHover={{
                        filter: `drop-shadow(0 0 8px ${tool.color})`,
                      }}
                    >
                      {tool.icon}
                    </motion.div>
                    
                    {/* Tool name */}
                    <span 
                      className="text-[10px] tracking-wider opacity-70"
                      style={{ fontFamily: 'Staatliches, sans-serif' }}
                    >
                      {tool.name.split(' ')[1]}
                    </span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="font-body text-xs"
                  style={{
                    background: 'hsl(20 30% 15%)',
                    border: '1px solid hsl(30 40% 35%)',
                    color: 'hsl(40 50% 80%)',
                  }}
                >
                  <p className="font-bold">{tool.tooltip}</p>
                  <p className="text-[10px] opacity-60" style={{ fontFamily: 'Staatliches, sans-serif' }}>
                    {tool.culture}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          
          {/* Leather stitching effect - bottom */}
          <div 
            className="h-1 w-full"
            style={{
              background: 'repeating-linear-gradient(90deg, hsl(35 50% 40%) 0px, hsl(35 50% 40%) 4px, transparent 4px, transparent 8px)',
              opacity: 0.4,
            }}
          />
        </div>
      </motion.div>

      {/* Tool Modal */}
      <AnimatePresence>
        {activeTool && (
          <Dialog open={!!activeTool} onOpenChange={() => setActiveTool(null)}>
            <DialogContent
              className="max-w-lg"
              style={{
                background: 'linear-gradient(180deg, hsl(25 35% 18%) 0%, hsl(20 40% 12%) 100%)',
                border: '2px solid hsl(30 50% 30%)',
                color: 'hsl(40 50% 85%)',
              }}
            >
              <DialogHeader>
                <DialogTitle 
                  className="text-xl tracking-wider"
                  style={{ fontFamily: 'Staatliches, sans-serif', color: 'hsl(45 80% 70%)' }}
                >
                  {toolContent[activeTool]?.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <p className="font-body text-sm leading-relaxed opacity-80 mb-6">
                  {toolContent[activeTool]?.description}
                </p>
                
                {toolContent[activeTool]?.comingSoon && (
                  <motion.div
                    className="text-center py-6 rounded-xl"
                    style={{
                      background: 'hsl(30 30% 15% / 0.5)',
                      border: '1px dashed hsl(40 40% 35%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p 
                      className="text-lg tracking-widest mb-2"
                      style={{ fontFamily: 'Staatliches, sans-serif', color: 'hsl(45 60% 60%)' }}
                    >
                      COMING SOON
                    </p>
                    <p className="font-body text-xs opacity-60">
                      This tool is being crafted by the ancestors.
                    </p>
                  </motion.div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default StewardsUtilityBelt;
