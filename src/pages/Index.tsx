import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import MasterMatrix from '@/components/MasterMatrix';
import GrowingRoots from '@/components/GrowingRoots';
import CosmicResonanceButton from '@/components/CosmicResonanceButton';
import ShopSection from '@/components/ShopSection';
import Footer from '@/components/Footer';
import StarMappingModal from '@/components/StarMappingModal';
import GrandCosmogram from '@/components/cosmogram/GrandCosmogram';

const Index = () => {
  const [isStarMappingOpen, setIsStarMappingOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Grand Unified Cosmogram - The Living Tapestry */}
      <GrandCosmogram />
      
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
