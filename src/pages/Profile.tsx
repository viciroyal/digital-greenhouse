import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Loader2, LogOut, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalName, setOriginalName] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      setEmail(session.user.email || '');
      setCreatedAt(session.user.created_at || '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profile) {
        setDisplayName(profile.display_name || '');
        setOriginalName(profile.display_name || '');
        setAvatarUrl(profile.avatar_url);
      }

      setIsLoading(false);
    };

    loadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate('/auth');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('user_id', session.user.id);

      if (error) throw error;

      setOriginalName(displayName);
      setHasChanges(false);
      toast({ title: 'Profile updated', description: 'Your display name has been saved.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast({ title: 'Signed out', description: 'Until next time, Pharmer.' });
      navigate('/auth');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setIsLoggingOut(false);
    }
  };

  const handleNameChange = (value: string) => {
    setDisplayName(value);
    setHasChanges(value !== originalName);
  };

  const inputStyle = {
    background: 'hsl(0 0% 8%)',
    border: '1px solid hsl(40 30% 25%)',
    color: 'hsl(0 0% 90%)',
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(250 50% 5%)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'hsl(51 100% 50%)' }} />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, hsl(250 50% 5%) 0%, hsl(20 30% 8%) 50%, hsl(15 45% 5%) 100%)',
        }}
      />

      {/* Stars */}
      <div className="fixed top-0 left-0 right-0 h-1/2 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
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
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
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
        <span className="text-sm font-body" style={{ color: 'hsl(40 50% 70%)' }}>Return</span>
      </motion.button>

      {/* Profile Card */}
      <motion.div
        className="relative w-full max-w-md z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="absolute -inset-1 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, hsl(51 100% 50% / 0.3), transparent, hsl(51 100% 50% / 0.2))',
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
            {/* Avatar */}
            <div className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: 'hsl(51 80% 40% / 0.15)',
                border: '2px solid hsl(51 80% 50%)',
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10" style={{ color: 'hsl(51 100% 60%)' }} />
              )}
            </div>

            <h1
              className="text-3xl mb-2 tracking-[0.1em]"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: 'hsl(51 100% 50%)',
                textShadow: '0 0 30px hsl(51 80% 40% / 0.4)',
              }}
            >
              PHARMER PROFILE
            </h1>
            <p className="text-sm font-body" style={{ color: 'hsl(40 50% 60%)' }}>
              Your identity in the garden
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Display Name */}
            <div>
              <Label htmlFor="displayName" className="font-body text-xs tracking-wider" style={{ color: 'hsl(40 50% 60%)' }}>
                PHARMER NAME
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(40 40% 50%)' }} />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your title in the garden"
                  value={displayName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="pl-10 font-body"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <Label className="font-body text-xs tracking-wider" style={{ color: 'hsl(40 50% 60%)' }}>
                EMAIL
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(40 40% 50%)' }} />
                <Input
                  type="email"
                  value={email}
                  readOnly
                  className="pl-10 font-body cursor-not-allowed opacity-70"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Member Since */}
            <div>
              <Label className="font-body text-xs tracking-wider" style={{ color: 'hsl(40 50% 60%)' }}>
                INITIATED
              </Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(40 40% 50%)' }} />
                <Input
                  type="text"
                  value={createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                  readOnly
                  className="pl-10 font-body cursor-not-allowed opacity-70"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              className="w-full py-6 font-body tracking-wider"
              style={{
                background: hasChanges
                  ? 'linear-gradient(135deg, hsl(51 80% 40%), hsl(40 70% 30%))'
                  : 'hsl(0 0% 15%)',
                border: hasChanges ? '1px solid hsl(51 100% 50%)' : '1px solid hsl(0 0% 25%)',
                color: hasChanges ? 'hsl(0 0% 10%)' : 'hsl(0 0% 40%)',
                boxShadow: hasChanges ? '0 0 30px hsl(51 80% 40% / 0.3)' : 'none',
              }}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  SAVE CHANGES
                </span>
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex-1 h-px" style={{ background: 'hsl(0 0% 20%)' }} />
            </div>

            {/* Logout */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full py-5 font-body tracking-wider"
              style={{
                background: 'hsl(0 0% 8%)',
                border: '1px solid hsl(0 50% 30%)',
                color: 'hsl(0 60% 65%)',
              }}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  SIGN OUT
                </span>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default Profile;
