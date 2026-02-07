import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuthMode = 'login' | 'signup';

/**
 * Auth Page - "The Threshold"
 * 
 * A sacred gateway styled with the Ancestral Path aesthetic.
 * Users must authenticate to track their progress through the curriculum.
 */
const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/ancestral-path');
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/ancestral-path');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              display_name: displayName,
            },
          },
        });

        if (error) throw error;

        toast({
          title: "Check your email",
          description: "We sent you a confirmation link to complete your registration.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back, Pharmer",
          description: "Your journey continues...",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Sign-In Error",
        description: error.message,
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg,
            hsl(250 50% 5%) 0%,
            hsl(20 30% 8%) 50%,
            hsl(15 45% 5%) 100%
          )`,
        }}
      />

      {/* Stars */}
      <div className="fixed top-0 left-0 right-0 h-1/2 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: 'hsl(0 0% 90%)',
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Mycelial network texture */}
      <div className="fixed inset-0 overflow-hidden opacity-20 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${100 + Math.random() * 200}px`,
              height: '1px',
              background: `linear-gradient(90deg, transparent, hsl(40 30% 30%), transparent)`,
              transformOrigin: 'left center',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Back button */}
      <motion.button
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: 'hsl(20 30% 12% / 0.9)',
          border: '1px solid hsl(40 40% 30%)',
          backdropFilter: 'blur(10px)',
        }}
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ArrowLeft className="w-4 h-4" style={{ color: 'hsl(40 50% 70%)' }} />
        <span 
          className="text-sm font-mono"
          style={{ color: 'hsl(40 50% 70%)' }}
        >
          Return
        </span>
      </motion.button>

      {/* Auth Card */}
      <motion.div
        className="relative w-full max-w-md z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Gold border frame */}
        <div 
          className="absolute -inset-1 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, hsl(51 100% 50% / 0.3), transparent, hsl(51 100% 50% / 0.2))`,
          }}
        />

        <div 
          className="relative rounded-2xl p-8"
          style={{
            background: 'hsl(20 20% 10% / 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid hsl(40 40% 25%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 
              className="text-3xl mb-2 tracking-[0.1em]"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: 'hsl(51 100% 50%)',
                textShadow: '0 0 30px hsl(51 80% 40% / 0.4)',
              }}
            >
              THE THRESHOLD
            </h1>
            <p 
              className="text-sm font-mono"
              style={{ color: 'hsl(40 50% 60%)' }}
            >
              {mode === 'login' 
                ? 'Enter your credentials to continue' 
                : 'Begin your journey as a Pharmer'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            {(['login', 'signup'] as AuthMode[]).map((m) => (
              <button
                key={m}
                className="flex-1 py-2 rounded-lg font-mono text-sm transition-all"
                style={{
                  background: mode === m ? 'hsl(51 80% 40% / 0.2)' : 'hsl(0 0% 12%)',
                  border: mode === m ? '1px solid hsl(51 80% 50%)' : '1px solid hsl(0 0% 25%)',
                  color: mode === m ? 'hsl(51 100% 60%)' : 'hsl(0 0% 50%)',
                }}
                onClick={() => setMode(m)}
              >
                {m === 'login' ? 'SIGN IN' : 'SIGN UP'}
              </button>
            ))}
          </div>

          {/* Google Auth Button */}
          <Button
            type="button"
            className="w-full mb-4 py-6 font-mono"
            variant="outline"
            style={{
              background: 'hsl(0 0% 12%)',
              border: '1px solid hsl(0 0% 30%)',
              color: 'hsl(0 0% 80%)',
            }}
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px" style={{ background: 'hsl(0 0% 25%)' }} />
            <span className="text-xs font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
              or
            </span>
            <div className="flex-1 h-px" style={{ background: 'hsl(0 0% 25%)' }} />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="displayName"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Label 
                    htmlFor="displayName" 
                    className="font-mono text-xs"
                    style={{ color: 'hsl(40 50% 60%)' }}
                  >
                    PHARMER NAME
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(40 40% 50%)' }} />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Your title in the garden"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10 font-mono"
                      style={{
                        background: 'hsl(0 0% 8%)',
                        border: '1px solid hsl(40 30% 25%)',
                        color: 'hsl(0 0% 90%)',
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <Label 
                htmlFor="email" 
                className="font-mono text-xs"
                style={{ color: 'hsl(40 50% 60%)' }}
              >
                EMAIL
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(40 40% 50%)' }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 font-mono"
                  style={{
                    background: 'hsl(0 0% 8%)',
                    border: '1px solid hsl(40 30% 25%)',
                    color: 'hsl(0 0% 90%)',
                  }}
                />
              </div>
            </div>

            <div>
              <Label 
                htmlFor="password" 
                className="font-mono text-xs"
                style={{ color: 'hsl(40 50% 60%)' }}
              >
                PASSWORD
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(40 40% 50%)' }} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 pr-10 font-mono"
                  style={{
                    background: 'hsl(0 0% 8%)',
                    border: '1px solid hsl(40 30% 25%)',
                    color: 'hsl(0 0% 90%)',
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" style={{ color: 'hsl(40 40% 50%)' }} />
                  ) : (
                    <Eye className="w-4 h-4" style={{ color: 'hsl(40 40% 50%)' }} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 font-mono tracking-wider"
              style={{
                background: 'linear-gradient(135deg, hsl(51 80% 40%), hsl(40 70% 30%))',
                border: '1px solid hsl(51 100% 50%)',
                color: 'hsl(0 0% 10%)',
                boxShadow: '0 0 30px hsl(51 80% 40% / 0.3)',
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === 'login' ? (
                'ENTER THE PATH'
              ) : (
                'BEGIN INITIATION'
              )}
            </Button>
          </form>

          {/* Footer */}
          <p 
            className="text-center text-xs font-mono mt-6"
            style={{ color: 'hsl(0 0% 45%)' }}
          >
            {mode === 'login' 
              ? "Don't have an account? Click SIGN UP above" 
              : "Already initiated? Click SIGN IN above"}
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default Auth;
