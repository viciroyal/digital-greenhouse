import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CircadianProvider } from "@/contexts/CircadianContext";
import { AudioBiomeProvider } from "@/contexts/AudioBiomeContext";
import { FieldModeProvider } from "@/contexts/FieldModeContext";

import Index from "./pages/Index";
import CropOracle from "./pages/CropOracle";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import UserGuide from "./pages/UserGuide";
import DevGuide from "./pages/DevGuide";
import TestingSuiteDocs from "./pages/TestingSuiteDocs";
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FieldModeProvider>
      </AudioBiomeProvider>
    </CircadianProvider>
  </QueryClientProvider>
);

export default App;
