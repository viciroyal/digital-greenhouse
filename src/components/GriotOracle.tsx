import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Leaf, Music } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'griot';
  content: string;
  timestamp: Date;
}

const GriotOracle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCropOracle = location.pathname === '/crop-oracle';
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolledToSound, setHasScrolledToSound] = useState(false);

  // Track whether the sound system section is visible
  useEffect(() => {
    if (isCropOracle) return;
    const el = document.querySelector('[data-section="sound-system"]');
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasScrolledToSound(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isCropOracle, location.pathname]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'griot',
      content: 'What can I help with? Ask about soil amendments, crop spacing, Brix targets, companion planting, or any growing question.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get user session for authenticated requests
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        const authErrorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'griot',
          content: 'Sign in to access the Field Advisor. Your questions require an authenticated session.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, authErrorMessage]);
        setIsLoading(false);
        return;
      }

      const conversationHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role === 'griot' ? 'assistant' : 'user',
          content: m.content,
        }));

      conversationHistory.push({ role: 'user', content: userMessage.content });

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/griot-oracle`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ messages: conversationHistory }),
        }
      );

      const data = await response.json();

      const griotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'griot',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, griotMessage]);
    } catch (error) {
      console.error('Oracle error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'griot',
        content: 'Connection error. Please check your network and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Cowrie Shell Trigger */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer group"
        onClick={() => {
          if (isCropOracle) {
            setIsOpen(true);
          } else if (location.pathname === '/') {
            // Scroll to sound system section on home page
            const el = document.querySelector('[data-section="sound-system"]');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            }
          } else {
            navigate('/');
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isCropOracle
            ? [
                '0 0 20px hsl(120 50% 35% / 0.3)',
                '0 0 40px hsl(120 50% 45% / 0.5)',
                '0 0 20px hsl(120 50% 35% / 0.3)',
              ]
            : [
                '0 0 20px hsl(270 50% 35% / 0.3)',
                '0 0 40px hsl(270 50% 45% / 0.5)',
                '0 0 20px hsl(270 50% 35% / 0.3)',
              ],
        }}
        transition={{
          boxShadow: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          background: isCropOracle
            ? 'linear-gradient(135deg, hsl(120 40% 18%), hsl(140 35% 12%))'
            : 'linear-gradient(135deg, hsl(270 40% 18%), hsl(280 35% 12%))',
          border: `2px solid ${isCropOracle ? 'hsl(120 40% 35%)' : 'hsl(270 40% 35%)'}`,
        }}
      >
        {isCropOracle ? (
          <Leaf className="w-7 h-7" style={{ color: 'hsl(120 50% 65%)' }} />
        ) : (
          <motion.div
            animate={hasScrolledToSound ? {} : { y: [0, -4, 0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
          >
            <Music className="w-7 h-7" style={{ color: 'hsl(270 60% 70%)' }} />
          </motion.div>
        )}

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            background: isCropOracle
              ? 'radial-gradient(circle, hsl(120 50% 45% / 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, hsl(270 50% 45% / 0.3) 0%, transparent 70%)',
          }}
        />

        {/* Tooltip */}
        <div
          className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
          style={{
            background: 'hsl(220 40% 10% / 0.9)',
            border: `1px solid ${isCropOracle ? 'hsl(120 50% 40%)' : 'hsl(270 50% 40%)'}`,
            color: isCropOracle ? 'hsl(120 50% 70%)' : 'hsl(270 60% 75%)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            fontFamily: 'Space Mono, monospace',
          }}
        >
          {isCropOracle ? 'Ask The Field Advisor' : 'Automajic Sound System'}
        </div>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && isCropOracle && (
          <motion.div
            className="fixed inset-x-4 bottom-4 md:right-6 md:left-auto md:w-[420px] z-50 rounded-2xl overflow-hidden"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              maxHeight: 'calc(100vh - 120px)',
              background: 'linear-gradient(180deg, hsl(240 50% 12% / 0.95) 0%, hsl(250 45% 8% / 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid hsl(185 50% 30% / 0.4)',
              boxShadow: '0 0 60px hsl(185 60% 30% / 0.2), 0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Mycelial network texture */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q30 20 50 15 T90 30 M20 50 Q40 45 60 55 T95 60 M5 80 Q25 75 45 85 T85 90' stroke='%2300ffff' stroke-width='0.5' fill='none' opacity='0.3'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px',
              }}
            />

            {/* Header */}
            <div
              className="relative flex items-center justify-between px-5 py-4"
              style={{
                borderBottom: '1px solid hsl(185 40% 25% / 0.3)',
                background: 'linear-gradient(90deg, hsl(240 50% 15% / 0.5) 0%, hsl(185 40% 15% / 0.3) 100%)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(120 40% 20%), hsl(140 35% 15%))',
                    border: '2px solid hsl(120 50% 40%)',
                    boxShadow: '0 0 15px hsl(120 50% 40% / 0.4)',
                  }}
                >
                  <Leaf className="w-5 h-5" style={{ color: 'hsl(120 50% 65%)' }} />
                </div>
                <div>
                  <h3
                    className="text-sm font-bold tracking-wide"
                    style={{ color: 'hsl(40 50% 85%)', fontFamily: 'Space Mono, monospace' }}
                  >
                    FIELD ADVISOR
                  </h3>
                  <p
                    className="text-[10px] tracking-widest uppercase"
                    style={{ color: 'hsl(185 60% 50%)' }}
                  >
                    Soil Science · Crop Strategy
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full"
                style={{ color: 'hsl(40 50% 60%)' }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Messages */}
            <div
              className="flex flex-col gap-4 p-4 overflow-y-auto"
              style={{ height: '350px' }}
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Floating Stone / Torn Paper style */}
                  <div
                    className="max-w-[85%] px-4 py-3 relative"
                    style={{
                      background:
                        message.role === 'griot'
                          ? 'linear-gradient(135deg, hsl(30 30% 20% / 0.9), hsl(25 25% 15% / 0.95))'
                          : 'linear-gradient(135deg, hsl(185 40% 20% / 0.8), hsl(200 35% 15% / 0.9))',
                      borderRadius: message.role === 'griot' 
                        ? '4px 20px 20px 20px' 
                        : '20px 4px 20px 20px',
                      border: `1px solid ${
                        message.role === 'griot' 
                          ? 'hsl(35 40% 35% / 0.5)' 
                          : 'hsl(185 50% 35% / 0.5)'
                      }`,
                      boxShadow:
                        message.role === 'griot'
                          ? '0 4px 15px hsl(30 30% 10% / 0.5), inset 0 1px 0 hsl(40 40% 40% / 0.1)'
                          : '0 4px 15px hsl(200 40% 10% / 0.5)',
                    }}
                  >
                    {/* Torn edge effect for griot messages */}
                    {message.role === 'griot' && (
                      <div
                        className="absolute -left-1 top-2 bottom-2 w-1 opacity-30"
                        style={{
                          background: 'linear-gradient(180deg, transparent 0%, hsl(35 50% 50%) 20%, transparent 40%, hsl(35 50% 50%) 60%, transparent 80%, hsl(35 50% 50%) 100%)',
                        }}
                      />
                    )}
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: message.role === 'griot' ? 'hsl(40 50% 85%)' : 'hsl(185 60% 85%)',
                        fontFamily: message.role === 'griot' ? 'Space Mono, monospace' : 'inherit',
                      }}
                    >
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div
                    className="px-4 py-3 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, hsl(30 30% 20% / 0.9), hsl(25 25% 15% / 0.95))',
                      border: '1px solid hsl(35 40% 35% / 0.5)',
                    }}
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ background: 'hsl(185 60% 50%)' }}
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="p-4"
              style={{
                borderTop: '1px solid hsl(185 40% 25% / 0.3)',
                background: 'hsl(240 50% 8% / 0.5)',
              }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: 'hsl(240 45% 12% / 0.8)',
                  border: '1px solid hsl(185 40% 30% / 0.4)',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a growing question..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{
                    color: 'hsl(40 50% 85%)',
                    fontFamily: 'Space Mono, monospace',
                  }}
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full disabled:opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, hsl(185 60% 40%), hsl(200 50% 35%))',
                    color: 'hsl(40 50% 95%)',
                  }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GriotOracle;
