import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CircadianProvider } from "@/contexts/CircadianContext";
import { AudioBiomeProvider } from "@/contexts/AudioBiomeContext";
import { FieldModeProvider } from "@/contexts/FieldModeContext";
import Index from "./pages/Index";
import StarMapping from "./pages/StarMapping";
import ResonanceReport from "./pages/ResonanceReport";
import AncestralPath from "./pages/AncestralPath";
import HogonReview from "./pages/HogonReview";
import Auth from "./pages/Auth";
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
                <Route path="/star-mapping" element={<StarMapping />} />
                <Route path="/resonance-report" element={<ResonanceReport />} />
                <Route path="/ancestral-path" element={<AncestralPath />} />
                <Route path="/hogon-review" element={<HogonReview />} />
                <Route path="/auth" element={<Auth />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
