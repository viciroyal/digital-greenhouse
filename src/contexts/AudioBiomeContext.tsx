import React, { createContext, useContext, useState, useCallback } from 'react';

interface AudioBiomeContextType {
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  currentZone: 'ether' | 'labor' | 'roots';
  setCurrentZone: (zone: 'ether' | 'labor' | 'roots') => void;
  zoneVolumes: { ether: number; labor: number; roots: number };
  setZoneVolumes: (volumes: { ether: number; labor: number; roots: number }) => void;
}

const AudioBiomeContext = createContext<AudioBiomeContextType | undefined>(undefined);

export const AudioBiomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [currentZone, setCurrentZone] = useState<'ether' | 'labor' | 'roots'>('ether');
  const [zoneVolumes, setZoneVolumes] = useState({ ether: 1, labor: 0, roots: 0 });

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
  }, []);

  return (
    <AudioBiomeContext.Provider value={{
      isAudioEnabled,
      toggleAudio,
      currentZone,
      setCurrentZone,
      zoneVolumes,
      setZoneVolumes,
    }}>
      {children}
    </AudioBiomeContext.Provider>
  );
};

export const useAudioBiome = () => {
  const context = useContext(AudioBiomeContext);
  if (!context) {
    throw new Error('useAudioBiome must be used within AudioBiomeProvider');
  }
  return context;
};
