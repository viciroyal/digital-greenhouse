import React, { createContext, useContext, ReactNode } from 'react';

type CircadianMode = 'solar' | 'lunar';

interface CircadianContextType {
  mode: CircadianMode;
  hour: number;
  isSolar: boolean;
  isLunar: boolean;
}

const CircadianContext = createContext<CircadianContextType | undefined>(undefined);

export const useCircadian = () => {
  const context = useContext(CircadianContext);
  if (!context) {
    throw new Error('useCircadian must be used within a CircadianProvider');
  }
  return context;
};

interface CircadianProviderProps {
  children: ReactNode;
}

export const CircadianProvider = ({ children }: CircadianProviderProps) => {
  const [hour, setHour] = useState(() => new Date().getHours());
  
  useEffect(() => {
    // Update hour every minute
    const interval = setInterval(() => {
      setHour(new Date().getHours());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Solar: 6AM - 6PM, Lunar: 6PM - 6AM
  const isSolar = hour >= 6 && hour < 18;
  const mode: CircadianMode = isSolar ? 'solar' : 'lunar';
  
  return (
    <CircadianContext.Provider value={{ mode, hour, isSolar, isLunar: !isSolar }}>
      {children}
    </CircadianContext.Provider>
  );
};
