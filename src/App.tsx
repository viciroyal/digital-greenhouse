import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CircadianProvider } from "@/contexts/CircadianContext";
import { AudioBiomeProvider } from "@/contexts/AudioBiomeContext";
import { FieldModeProvider } from "@/contexts/FieldModeContext";
import sovereignEmblem from "@/assets/sovereign-emblem.png";

import Index from "./pages/Index";
import CropOracle from "./pages/CropOracle";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import UserGuide from "./pages/UserGuide";
import DevGuide from "./pages/DevGuide";
import TestingSuiteDocs from "./pages/TestingSuiteDocs";
import CropLibrary from "./pages/CropLibrary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CircadianProvider>
      <AudioBiomeProvider>
        <FieldModeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/crop-oracle" element={<CropOracle />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/user-guide" element={<UserGuide />} />
                <Route path="/dev-guide" element={<DevGuide />} />
                <Route path="/testing-docs" element={<TestingSuiteDocs />} />
                <Route path="/crop-library" element={<CropLibrary />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <img
              src={sovereignEmblem}
              alt="Sovereign Emblem"
              className="fixed bottom-4 left-4 w-16 h-auto opacity-75 hover:opacity-100 transition-all duration-500 pointer-events-none z-50"
              style={{
                filter: 'drop-shadow(0 0 6px hsl(120 45% 40% / 0.5)) drop-shadow(0 0 14px hsl(35 60% 45% / 0.3)) drop-shadow(0 0 24px hsl(0 55% 50% / 0.15))',
              }}
            />
          </TooltipProvider>
        </FieldModeProvider>
      </AudioBiomeProvider>
    </CircadianProvider>
  </QueryClientProvider>
);

export default App;
