import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cross, Phone, Flame, Scissors, Bug, Brain, MapPin, X, Wind } from 'lucide-react';

/**
 * EMERGENCY SOS BUTTON & SAFETY OVERLAY
 * 
 * Always-visible FAB that provides immediate access to field triage protocols.
 * High contrast red/black mode for emergency visibility.
 */

interface TriageCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  symptoms: string[];
  actions: string[];
  naturalAlly?: string;
  warning?: string;
}

const TRIAGE_CARDS: TriageCard[] = [
  {
    id: 'heat',
    title: 'HEAT STROKE',
    subtitle: 'THE FIRE',
    icon: <Flame className="w-8 h-8" />,
    symptoms: ['Dizziness', 'No sweat (dry skin)', 'Rapid pulse', 'Confusion'],
    actions: [
      'STOP immediately. Get to Shade.',
      'Wet the neck & wrists with cool water.',
      'Sip water slowly. Do NOT chug.',
      'Fan the body. Loosen clothing.'
    ]
  },
  {
    id: 'cut',
    title: 'THE CUT',
    subtitle: 'THE IRON',
    icon: <Scissors className="w-8 h-8" />,
    symptoms: ['Deep laceration', 'Heavy bleeding', 'Visible tissue'],
    actions: [
      'Apply DIRECT PRESSURE with clean cloth.',
      'Elevate the limb above the heart.',
      'Do NOT peek at the wound.',
      'Maintain pressure for 10+ minutes.'
    ],
    naturalAlly: 'If minor: Yarrow or Plantain leaf (chewed) stops bleeding.'
  },
  {
    id: 'sting',
    title: 'THE STING',
    subtitle: 'THE SWARM',
    icon: <Bug className="w-8 h-8" />,
    symptoms: ['Fire Ant / Wasp / Bee', 'Snake bite', 'Swelling', 'Allergic reaction'],
    actions: [
      'Move AWAY from the nest/area.',
      'Remove stinger by scraping (not pinching).',
      'Apply cold mud or vinegar compress.'
    ],
    warning: 'SNAKE: Note colors/head shape. Do NOT suck poison. Keep limb LOW. Drive to ER immediately.'
  },
  {
    id: 'panic',
    title: 'PANIC ATTACK',
    subtitle: 'THE MIND',
    icon: <Brain className="w-8 h-8" />,
    symptoms: ['Hyperventilating', 'Chest tightness', 'Racing thoughts', 'Feeling of doom'],
    actions: [
      'Box Breathing: Inhale 4 → Hold 4 → Exhale 4 → Hold 4',
      'Look at the horizon. Ground your feet.',
      'Count 5 GREEN things you can see.',
      'Name 4 things you can touch right now.'
    ]
  }
];

const EmergencySOSButton = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number; address?: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleOpenOverlay = () => {
    setIsOverlayOpen(true);
    fetchLocation();
  };

  const fetchLocation = async () => {
    setLocationLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lon: longitude });
            
            // Reverse geocode for address
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                { headers: { 'User-Agent': 'PharmBoi-Emergency/1.0' } }
              );
              const data = await res.json();
              if (data.display_name) {
                setLocation(prev => prev ? { ...prev, address: data.display_name } : null);
              }
            } catch {
              // Address lookup failed, coordinates still available
            }
            setLocationLoading(false);
          },
          () => {
            setLocationLoading(false);
          }
        );
      }
    } catch {
      setLocationLoading(false);
    }
  };

  const handleCall911 = () => {
    window.location.href = 'tel:911';
  };

  return (
    <>
      {/* Floating SOS Button */}
      <motion.button
        onClick={handleOpenOverlay}
        className="fixed bottom-24 right-4 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, hsl(0 80% 50%), hsl(0 90% 40%))',
          boxShadow: '0 0 20px hsla(0, 80%, 50%, 0.5), 0 4px 15px rgba(0,0,0,0.3)'
        }}
        animate={{
          boxShadow: [
            '0 0 20px hsla(0, 80%, 50%, 0.5), 0 4px 15px rgba(0,0,0,0.3)',
            '0 0 35px hsla(0, 80%, 50%, 0.8), 0 4px 15px rgba(0,0,0,0.3)',
            '0 0 20px hsla(0, 80%, 50%, 0.5), 0 4px 15px rgba(0,0,0,0.3)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Emergency SOS"
      >
        <Cross className="w-8 h-8 text-white" strokeWidth={3} />
      </motion.button>

      {/* Full-Screen Safety Overlay */}
      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div
            className="fixed inset-0 z-[100] overflow-y-auto"
            style={{ background: 'linear-gradient(180deg, hsl(0 0% 5%), hsl(0 50% 10%))' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOverlayOpen(false)}
              className="fixed top-4 right-4 z-[101] w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'hsla(0, 0%, 100%, 0.1)', border: '2px solid hsla(0, 0%, 100%, 0.3)' }}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="min-h-screen p-4 pb-32">
              {/* Header */}
              <motion.div
                className="text-center py-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Wind className="w-8 h-8 text-white" />
                  <h1 
                    className="text-3xl md:text-4xl font-bold tracking-wider"
                    style={{ color: 'hsl(0 0% 100%)' }}
                  >
                    DO NOT PANIC
                  </h1>
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <p className="text-xl font-mono" style={{ color: 'hsl(45 90% 60%)' }}>
                  BREATHE. YOU ARE SAFE.
                </p>
              </motion.div>

              {/* GPS Location Block */}
              <motion.div
                className="rounded-xl p-4 mb-6"
                style={{ 
                  background: 'hsla(0, 0%, 0%, 0.5)',
                  border: '2px solid hsl(0 70% 50%)'
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-6 h-6" style={{ color: 'hsl(0 70% 60%)' }} />
                  <span className="font-bold text-lg text-white">YOUR LOCATION (FOR 911)</span>
                </div>
                
                {locationLoading ? (
                  <p className="text-white/70 font-mono">Acquiring GPS signal...</p>
                ) : location ? (
                  <div className="space-y-2">
                    <p 
                      className="text-2xl font-mono font-bold"
                      style={{ color: 'hsl(120 60% 60%)' }}
                    >
                      {location.lat.toFixed(6)}°N, {location.lon.toFixed(6)}°W
                    </p>
                    {location.address && (
                      <p className="text-sm text-white/80 font-mono leading-relaxed">
                        {location.address}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-white/70 font-mono">
                    Location unavailable. Enable GPS permissions.
                  </p>
                )}
              </motion.div>

              {/* Triage Cards */}
              <div className="space-y-4 mb-8">
                {TRIAGE_CARDS.map((card, index) => (
                  <motion.div
                    key={card.id}
                    className="rounded-xl overflow-hidden"
                    style={{ 
                      background: 'hsla(0, 0%, 0%, 0.6)',
                      border: expandedCard === card.id 
                        ? '2px solid hsl(45 90% 55%)' 
                        : '2px solid hsla(0, 0%, 100%, 0.2)'
                    }}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {/* Card Header */}
                    <button
                      onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                      className="w-full p-4 flex items-center gap-4 text-left"
                    >
                      <div 
                        className="w-14 h-14 rounded-lg flex items-center justify-center"
                        style={{ 
                          background: card.id === 'heat' ? 'hsl(30 80% 50%)' :
                                     card.id === 'cut' ? 'hsl(0 70% 45%)' :
                                     card.id === 'sting' ? 'hsl(45 80% 45%)' :
                                     'hsl(270 50% 50%)',
                          color: 'white'
                        }}
                      >
                        {card.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{card.title}</h3>
                        <p className="text-sm font-mono" style={{ color: 'hsl(45 70% 60%)' }}>
                          {card.subtitle}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedCard === card.id ? 180 : 0 }}
                        className="text-white/50"
                      >
                        ▼
                      </motion.div>
                    </button>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedCard === card.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-4">
                            {/* Symptoms */}
                            <div>
                              <h4 className="text-sm font-bold mb-2" style={{ color: 'hsl(0 60% 60%)' }}>
                                SYMPTOMS:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {card.symptoms.map((symptom, i) => (
                                  <span 
                                    key={i}
                                    className="px-3 py-1 rounded-full text-sm font-mono"
                                    style={{ 
                                      background: 'hsla(0, 50%, 40%, 0.5)',
                                      color: 'hsl(0 0% 100%)'
                                    }}
                                  >
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div>
                              <h4 className="text-sm font-bold mb-2" style={{ color: 'hsl(120 60% 50%)' }}>
                                IMMEDIATE ACTION:
                              </h4>
                              <ol className="space-y-2">
                                {card.actions.map((action, i) => (
                                  <li 
                                    key={i}
                                    className="flex gap-3 text-white/90 font-mono text-sm"
                                  >
                                    <span 
                                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                                      style={{ background: 'hsl(120 50% 30%)', color: 'white' }}
                                    >
                                      {i + 1}
                                    </span>
                                    {action}
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Natural Ally */}
                            {card.naturalAlly && (
                              <div 
                                className="p-3 rounded-lg"
                                style={{ background: 'hsla(120, 40%, 25%, 0.5)' }}
                              >
                                <p className="text-sm" style={{ color: 'hsl(120 60% 70%)' }}>
                                  🌿 {card.naturalAlly}
                                </p>
                              </div>
                            )}

                            {/* Warning */}
                            {card.warning && (
                              <div 
                                className="p-3 rounded-lg"
                                style={{ 
                                  background: 'hsla(0, 60%, 30%, 0.5)',
                                  border: '1px solid hsl(0 60% 50%)'
                                }}
                              >
                                <p className="text-sm font-bold" style={{ color: 'hsl(45 90% 60%)' }}>
                                  ⚠️ {card.warning}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fixed 911 Call Button */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 p-4"
              style={{ background: 'linear-gradient(transparent, hsl(0 50% 10%))' }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleCall911}
                className="w-full py-5 rounded-xl font-bold text-2xl tracking-wider flex items-center justify-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, hsl(0 80% 50%), hsl(0 90% 40%))',
                  color: 'white',
                  boxShadow: '0 0 30px hsla(0, 80%, 50%, 0.6)'
                }}
              >
                <Phone className="w-8 h-8" />
                DIAL 911
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencySOSButton;
