import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import MasterMatrix from '@/components/MasterMatrix';
import GrowingRoots from '@/components/GrowingRoots';
import CosmicResonanceButton from '@/components/CosmicResonanceButton';
import ShopSection from '@/components/ShopSection';
import Footer from '@/components/Footer';
import StarMappingModal from '@/components/StarMappingModal';

const Index = () => {
  const [isStarMappingOpen, setIsStarMappingOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
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
    </main>
  );
};

export default Index;
