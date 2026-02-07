import { createContext, useContext, useState, ReactNode } from 'react';

interface FieldModeContextType {
  isFieldMode: boolean;
  toggleFieldMode: () => void;
}

const FieldModeContext = createContext<FieldModeContextType | undefined>(undefined);

export const useFieldMode = () => {
  const context = useContext(FieldModeContext);
  if (!context) {
    throw new Error('useFieldMode must be used within a FieldModeProvider');
  }
  return context;
};

interface FieldModeProviderProps {
  children: ReactNode;
}

export const FieldModeProvider = ({ children }: FieldModeProviderProps) => {
  const [isFieldMode, setIsFieldMode] = useState(false);

  const toggleFieldMode = () => {
    setIsFieldMode(prev => !prev);
  };

  return (
    <FieldModeContext.Provider value={{ isFieldMode, toggleFieldMode }}>
      {children}
    </FieldModeContext.Provider>
  );
};
