import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogIn, User } from 'lucide-react';
import { motion } from 'framer-motion';

const GlobalNav = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Hide on auth page itself
  if (pathname.startsWith('/auth')) return null;

  return (
    <motion.nav
      className="fixed top-4 right-4 z-40 flex items-center gap-2 pointer-events-none"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <button
        onClick={() => navigate('/user-guide')}
        className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 hover:scale-105"
        style={{
          background: 'hsl(230 30% 12% / 0.85)',
          border: '1px solid hsl(140 50% 35% / 0.4)',
          color: 'hsl(140 50% 70%)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <BookOpen size={14} />
        <span className="hidden sm:inline">Guide</span>
      </button>

      {/* Login / Profile */}
      {isSignedIn ? (
        <button
          onClick={() => navigate('/profile')}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 hover:scale-105"
          style={{
            background: 'hsl(230 30% 12% / 0.85)',
            border: '1px solid hsl(45 70% 45% / 0.5)',
            color: 'hsl(45 70% 75%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <User size={14} />
          <span className="hidden sm:inline">
            {user?.firstName || 'Profile'}
          </span>
        </button>
      ) : (
        <button
          onClick={() => navigate('/auth')}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, hsl(45 80% 50% / 0.15), hsl(45 70% 40% / 0.1))',
            border: '1px solid hsl(45 70% 45% / 0.5)',
            color: 'hsl(45 70% 75%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <LogIn size={14} />
          <span className="hidden sm:inline">Sign In</span>
        </button>
      )}
    </motion.nav>
  );
};

export default GlobalNav;
