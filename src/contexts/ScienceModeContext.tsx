import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * SCIENCE MODE CONTEXT
 * 
 * Global toggle between Beginner (simplified) and Farmer (full) modes.
 * Persists to localStorage.
 */

type ScienceMode = 'beginner' | 'farmer';

interface ScienceModeContextType {
  mode: ScienceMode;
  setMode: (mode: ScienceMode) => void;
  isBeginnerMode: boolean;
}

const ScienceModeContext = createContext<ScienceModeContextType | undefined>(undefined);

const STORAGE_KEY = 'pharmer-science-mode';

export const ScienceModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ScienceMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return (stored === 'beginner' || stored === 'farmer') ? stored : 'farmer';
    } catch {
      return 'farmer';
    }
  });

  const setMode = (newMode: ScienceMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  };

  const isBeginnerMode = mode === 'beginner';

  return (
    <ScienceModeContext.Provider value={{ mode, setMode, isBeginnerMode }}>
      {children}
    </ScienceModeContext.Provider>
  );
};

export const useScienceMode = () => {
  const context = useContext(ScienceModeContext);
  if (!context) {
    throw new Error('useScienceMode must be used within ScienceModeProvider');
  }
  return context;
};
