import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import MasterMatrix from '@/components/MasterMatrix';
import GrowingRoots from '@/components/GrowingRoots';
import CosmicResonanceButton from '@/components/CosmicResonanceButton';
import ShopSection from '@/components/ShopSection';
import Footer from '@/components/Footer';
import StarMappingModal from '@/components/StarMappingModal';
import GrandCosmogram from '@/components/cosmogram/GrandCosmogram';
import RespiratorySystem from '@/components/bio-digital/RespiratorySystem';
import BioluminescentVeins from '@/components/bio-digital/BioluminescentVeins';
import CircadianOverlay from '@/components/bio-digital/CircadianOverlay';
import MycelialMenu from '@/components/bio-digital/MycelialMenu';
import { AudioBiomeManager, ConchShellControl } from '@/components/audio';

const Index = () => {
  const [isStarMappingOpen, setIsStarMappingOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Grand Unified Cosmogram - The Living Tapestry */}
      <RespiratorySystem>
        <GrandCosmogram />
      </RespiratorySystem>
      
      {/* Bioluminescent Veins - Pulse on exhale */}
      <BioluminescentVeins />
      
      {/* Circadian Rhythm Overlay */}
      <CircadianOverlay />
      
      {/* Mycelial Navigation */}
      <MycelialMenu />
      
      {/* Audio Biome System */}
      <AudioBiomeManager />
      <ConchShellControl />
      
      {/* Content layers */}
      <div className="relative z-10">
        <GrowingRoots />
        <HeroSection />
        <MasterMatrix />
        <CosmicResonanceButton onClick={() => setIsStarMappingOpen(true)} />
        <ShopSection />
        <Footer />
        <StarMappingModal 
          isOpen={isStarMappingOpen} 
          onClose={() => setIsStarMappingOpen(false)} 
        />
      </div>
    </main>
  );
};

export default Index;
