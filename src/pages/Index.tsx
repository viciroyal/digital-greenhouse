import HeroSection from '@/components/HeroSection';
import MasterMatrix from '@/components/MasterMatrix';
import RootThroneScroll from '@/components/RootThroneScroll';
import ShopSection from '@/components/ShopSection';
import Footer from '@/components/Footer';
import GrowingRoots from '@/components/GrowingRoots';

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <GrowingRoots />
      <HeroSection />
      <MasterMatrix />
      <RootThroneScroll />
      <ShopSection />
      <Footer />
    </main>
  );
};

export default Index;
