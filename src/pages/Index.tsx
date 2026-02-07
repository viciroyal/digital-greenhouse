import HeroSection from '@/components/HeroSection';
import MasterMatrix from '@/components/MasterMatrix';
import GrowingRoots from '@/components/GrowingRoots';
import ShopSection from '@/components/ShopSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <GrowingRoots />
      <HeroSection />
      <MasterMatrix />
      <ShopSection />
      <Footer />
    </main>
  );
};

export default Index;
