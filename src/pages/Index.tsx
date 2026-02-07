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
import GriotOracle from '@/components/GriotOracle';
import { SedimentRuler, GhostArtifacts } from '@/components/scrollytelling';
import { MycelialCursor } from '@/components/cursor';
import { ChakraSpine } from '@/components/navigation';
import { ResonantChamber } from '@/components/community';
import { PharmersPledgeModal } from '@/components/portal';
import FieldModeToggle from '@/components/ui/FieldModeToggle';
import FieldModeOverlay from '@/components/ui/FieldModeOverlay';
import MasterSoilMixModal from '@/components/MasterSoilMixModal';

const Index = () => {
  const [isStarMappingOpen, setIsStarMappingOpen] = useState(false);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  const [isSoilMixOpen, setIsSoilMixOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 5) {
      setIsSoilMixOpen(true);
      setLogoClickCount(0);
    }
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Dark Mode Womb Overlay - Color Harmonization */}
      <div className="darkroom-overlay" />
      
      {/* Mycelial Cursor - The Wood Wide Web Thread */}
      <MycelialCursor />
      
      {/* Grand Unified Cosmogram - The Living Tapestry */}
      <RespiratorySystem>
        <GrandCosmogram />
      </RespiratorySystem>
      
      {/* Bioluminescent Veins - Pulse on exhale */}
      <BioluminescentVeins />
      
      {/* Circadian Rhythm Overlay */}
      <CircadianOverlay />
      
      {/* Mycelial Navigation with Initiation Gateway */}
      <MycelialMenu onInitiationClick={() => setIsPledgeModalOpen(true)} />
      
      {/* The Pharmer's Pledge Modal */}
      <PharmersPledgeModal 
        isOpen={isPledgeModalOpen} 
        onClose={() => setIsPledgeModalOpen(false)} 
      />
      
      {/* Chakra Spine Navigator */}
      <ChakraSpine />
      
      {/* Audio Biome System */}
      <AudioBiomeManager />
      <ConchShellControl />
      
      {/* Ancestral Oracle */}
      <GriotOracle />
      
      {/* Scrollytelling Elements */}
      <SedimentRuler />
      <GhostArtifacts />
      
      {/* Field Mode System */}
      <FieldModeToggle />
      <FieldModeOverlay />
      
      {/* Master Soil Mix Easter Egg Modal */}
      <MasterSoilMixModal 
        isOpen={isSoilMixOpen} 
        onClose={() => setIsSoilMixOpen(false)} 
      />
      
      {/* Content layers */}
      <div className="relative z-10">
        <GrowingRoots />
        <HeroSection onLogoClick={handleLogoClick} />
        <MasterMatrix />
        <CosmicResonanceButton onClick={() => setIsStarMappingOpen(true)} />
        <ShopSection />
        
        {/* The Resonant Chamber - Mycelial Network (Community Map) */}
        <ResonantChamber />
        
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
