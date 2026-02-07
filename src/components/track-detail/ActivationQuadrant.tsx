import { motion } from 'framer-motion';
import type { TrackData } from '@/data/trackData';

interface ActivationQuadrantProps {
  track: TrackData;
}

// Yoga pose SVG components - clean white line art
const YogaPoseSvg = ({ pose, color }: { pose: string; color: string }) => {
  const strokeColor = "hsl(112 64% 96%)";
  const strokeWidth = "1.5";
  
  const getPosePath = () => {
    switch (pose) {
      case 'Malasana': // Yogi Squat
        return (
          <g>
            {/* Head */}
            <circle cx="50" cy="20" r="8" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Torso - bent forward */}
            <path d="M50 28 L50 50" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Arms reaching down */}
            <path d="M50 35 L35 55 L35 65" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M50 35 L65 55 L65 65" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Legs in squat */}
            <path d="M50 50 L35 55 L30 75 L35 90" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M50 50 L65 55 L70 75 L65 90" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Feet flat */}
            <path d="M30 90 L40 90" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M60 90 L70 90" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
          </g>
        );
      
      case 'Marjaryasana-Bitilasana': // Cat-Cow
        return (
          <g>
            {/* Head */}
            <circle cx="25" cy="35" r="6" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Spine curved like a wave */}
            <path d="M30 38 Q45 25 60 40 Q75 55 80 45" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Front arms */}
            <path d="M35 42 L35 70" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M40 45 L40 70" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Back legs */}
            <path d="M70 50 L70 70" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M75 48 L75 70" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Ground line */}
            <path d="M30 70 L80 70" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="2 4" fill="none" opacity="0.3" />
          </g>
        );
      
      case 'Navasana': // Boat Pose
        return (
          <g>
            {/* Head */}
            <circle cx="50" cy="25" r="7" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Torso leaning back */}
            <path d="M50 32 L45 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Arms extended forward */}
            <path d="M48 40 L70 40" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M48 45 L70 45" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Legs extended up */}
            <path d="M45 55 L60 35" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M45 55 L65 40" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Sitting point */}
            <ellipse cx="45" cy="58" rx="5" ry="3" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.5" />
          </g>
        );
      
      case 'Virabhadrasana II': // Warrior II
        return (
          <g>
            {/* Head looking left */}
            <circle cx="30" cy="25" r="7" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Torso upright */}
            <path d="M50 35 L50 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Arms extended */}
            <path d="M50 40 L25 40" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M50 40 L75 40" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Front leg bent */}
            <path d="M50 55 L35 55 L30 80" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Back leg straight */}
            <path d="M50 55 L70 60 L80 80" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Feet */}
            <path d="M25 80 L35 80" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M75 80 L85 80" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
          </g>
        );
      
      case 'Ustrasana': // Camel Pose
        return (
          <g>
            {/* Head tilted back */}
            <circle cx="50" cy="20" r="6" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Neck arched */}
            <path d="M50 26 L52 35" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Torso arched back */}
            <path d="M52 35 Q55 50 50 65" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Arms reaching back to heels */}
            <path d="M52 40 L40 70" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M52 40 L60 70" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Legs kneeling */}
            <path d="M50 65 L40 70 L40 85" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M50 65 L60 70 L60 85" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Feet */}
            <path d="M40 85 L45 85" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M55 85 L60 85" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
          </g>
        );
      
      case 'Vrksasana': // Tree Pose
        return (
          <g>
            {/* Head */}
            <circle cx="50" cy="15" r="7" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Torso */}
            <path d="M50 22 L50 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Arms in prayer above head */}
            <path d="M50 30 L45 18 L50 10" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M50 30 L55 18 L50 10" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Standing leg */}
            <path d="M50 55 L50 90" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Bent leg on thigh */}
            <path d="M50 60 L60 65 L55 75 L50 70" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Foot */}
            <path d="M45 90 L55 90" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
          </g>
        );
      
      case 'Matsyasana': // Fish Pose
        return (
          <g>
            {/* Head tilted back on ground */}
            <circle cx="25" cy="40" r="6" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Crown touching ground */}
            <path d="M25 34 L25 30" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Torso arched */}
            <path d="M30 42 Q50 30 70 50" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Chest lifted */}
            <ellipse cx="45" cy="38" rx="8" ry="4" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.5" />
            {/* Legs extended */}
            <path d="M70 50 L85 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Arms under body */}
            <path d="M35 50 L35 55 L50 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeDasharray="2 2" />
            {/* Ground */}
            <path d="M20 58 L90 58" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="3 5" fill="none" opacity="0.3" />
          </g>
        );
      
      case 'Tadasana': // Mountain Pose
        return (
          <g>
            {/* Head */}
            <circle cx="50" cy="15" r="7" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Neck */}
            <path d="M50 22 L50 28" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Shoulders */}
            <path d="M40 30 L60 30" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Torso */}
            <path d="M50 28 L50 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Arms at sides */}
            <path d="M42 30 L38 50" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M58 30 L62 50" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Hips */}
            <path d="M45 55 L55 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Legs */}
            <path d="M47 55 L47 85" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M53 55 L53 85" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Feet */}
            <path d="M42 85 L52 85" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M48 85 L58 85" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
          </g>
        );
      
      case 'Balasana': // Child's Pose
        return (
          <g>
            {/* Head/forehead down */}
            <circle cx="30" cy="55" r="6" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Forehead point emphasized */}
            <circle cx="28" cy="58" r="2" fill={strokeColor} opacity="0.5" />
            {/* Back curved */}
            <path d="M35 52 Q50 40 65 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Arms extended forward */}
            <path d="M32 50 L20 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M32 54 L20 60" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Hips on heels */}
            <ellipse cx="65" cy="58" rx="8" ry="5" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Legs folded */}
            <path d="M65 63 L70 75 L65 75" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M65 63 L60 75 L65 75" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
          </g>
        );
      
      case 'Garudasana': // Eagle Pose
        return (
          <g>
            {/* Head */}
            <circle cx="50" cy="15" r="6" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Torso slightly bent */}
            <path d="M50 21 L50 50" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Arms wrapped/crossed */}
            <path d="M50 30 L55 35 L50 42 L45 38 L50 35" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M50 42 L48 48" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Standing leg bent */}
            <path d="M50 50 L48 65 L50 80" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Wrapped leg */}
            <path d="M50 55 L55 58 L52 70 L48 68" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Foot */}
            <path d="M45 80 L55 80" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
          </g>
        );
      
      case 'Padmasana': // Lotus
        return (
          <g>
            {/* Head */}
            <circle cx="50" cy="18" r="7" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Torso */}
            <path d="M50 25 L50 50" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Arms on knees */}
            <path d="M50 35 L35 45 L30 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M50 35 L65 45 L70 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Palms open on knees */}
            <circle cx="30" cy="58" r="3" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="70" cy="58" r="3" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Crossed legs */}
            <path d="M50 50 L40 55 L35 60 L40 65 L50 62" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M50 50 L60 55 L65 60 L60 65 L50 62" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Crown energy */}
            <path d="M50 11 L50 5" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.5" />
            <path d="M45 8 L50 5 L55 8" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.5" />
          </g>
        );
      
      case 'Savasana': // Corpse Pose
        return (
          <g>
            {/* Head */}
            <circle cx="20" cy="50" r="6" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Torso lying flat */}
            <path d="M26 50 L70 50" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Arms at sides, palms down */}
            <path d="M35 50 L35 60" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M55 50 L55 60" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Palm indicators */}
            <ellipse cx="35" cy="62" rx="3" ry="2" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.5" />
            <ellipse cx="55" cy="62" rx="3" ry="2" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.5" />
            {/* Legs */}
            <path d="M70 48 L90 45" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M70 52 L90 55" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Feet relaxed outward */}
            <path d="M90 45 L92 42" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            <path d="M90 55 L92 58" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
            {/* Ground line */}
            <path d="M15 65 L95 65" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="4 6" fill="none" opacity="0.2" />
          </g>
        );
      
      default:
        return (
          <g>
            <circle cx="50" cy="50" r="20" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <text x="50" y="55" textAnchor="middle" fill={strokeColor} fontSize="12">🧘</text>
          </g>
        );
    }
  };

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full max-h-40">
      <defs>
        <filter id="poseGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#poseGlow)">
        {getPosePath()}
      </g>
    </svg>
  );
};

const ActivationQuadrant = ({ track }: ActivationQuadrantProps) => {
  return (
    <motion.div
      className="glass-card rounded-2xl p-6 md:col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🧘</span>
        <h3 className="font-display text-xl text-foreground">The Activation</h3>
        <span className="text-muted-foreground/60 font-mono text-xs ml-auto">THE RITUAL</span>
      </div>

      {/* Instruction header */}
      <p className="text-muted-foreground/80 font-mono text-xs italic mb-6 text-center">
        "To maximize absorption of this frequency, assume this posture."
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Yoga Pose SVG */}
        <div className="flex flex-col items-center">
          <div 
            className="w-32 h-32 rounded-2xl p-4 flex items-center justify-center mb-3"
            style={{ 
              background: `linear-gradient(135deg, hsl(${track.colorHsl} / 0.1) 0%, transparent 100%)`,
              border: `1px solid hsl(${track.colorHsl} / 0.2)`
            }}
          >
            <YogaPoseSvg pose={track.yogaPoseSanskrit} color={track.colorHsl} />
          </div>
          <p 
            className="font-display text-lg font-bold text-center"
            style={{ color: `hsl(${track.colorHsl})` }}
          >
            {track.yogaPose}
          </p>
          <p className="font-mono text-xs text-muted-foreground italic text-center">
            ({track.yogaPoseSanskrit})
          </p>
        </div>

        {/* Why and Action */}
        <div className="md:col-span-2 space-y-4">
          {/* Why this pose */}
          <div>
            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-wider mb-2">
              Why This Pose
            </p>
            <p className="font-mono text-sm text-foreground leading-relaxed">
              {track.yogaWhy}
            </p>
          </div>

          {/* The Action */}
          <div 
            className="p-4 rounded-xl border"
            style={{ 
              borderColor: `hsl(${track.colorHsl} / 0.3)`,
              background: `linear-gradient(135deg, hsl(${track.colorHsl} / 0.08) 0%, transparent 100%)`
            }}
          >
            <p className="text-muted-foreground/60 font-mono text-xs uppercase tracking-wider mb-2">
              The Action
            </p>
            <p 
              className="font-mono text-base font-medium leading-relaxed"
              style={{ color: `hsl(${track.colorHsl})` }}
            >
              "{track.ritualAction}"
            </p>
          </div>

          {/* Connection to frequency */}
          <div className="flex items-center gap-2 pt-2">
            <div 
              className="h-px flex-1"
              style={{ background: `linear-gradient(90deg, hsl(${track.colorHsl} / 0.4), transparent)` }}
            />
            <p className="font-mono text-xs text-muted-foreground/60">
              {track.yogaPose} × {track.frequency} × {track.chakra}
            </p>
            <div 
              className="h-px flex-1"
              style={{ background: `linear-gradient(90deg, transparent, hsl(${track.colorHsl} / 0.4))` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivationQuadrant;
