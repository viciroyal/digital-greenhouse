import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CircadianProvider } from "@/contexts/CircadianContext";
import { AudioBiomeProvider } from "@/contexts/AudioBiomeContext";
import { FieldModeProvider } from "@/contexts/FieldModeContext";

// Cursor components
import { MycelialCursor, TouchRipple } from "@/components/cursor";

import Index from "./pages/Index";
import StarMapping from "./pages/StarMapping";
import ResonanceReport from "./pages/ResonanceReport";
import AncestralPath from "./pages/AncestralPath";
import AscensionMapDemo from "./pages/AscensionMapDemo";
import HogonReview from "./pages/HogonReview";
import PharmerProfile from "./pages/PharmerProfile";
import FieldAlmanac from "./pages/FieldAlmanac";
import AgroMajicConductor from "./pages/AgroMajicConductor";
import LinerNotes from "./pages/LinerNotes";
import MasterBuild from "./pages/MasterBuild";
import Auth from "./pages/Auth";
import CropExport from "./pages/CropExport";
import ChordRecipeGallery from "./pages/ChordRecipeGallery";
import CropOracle from "./pages/CropOracle";
import BedStrumVisualizer from "./pages/BedStrumVisualizer";
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
            
            {/* --- FIX: Render them here (Global Scope) --- */}
            <MycelialCursor />
            <TouchRipple />

            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/star-mapping" element={<StarMapping />} />
                <Route path="/resonance-report" element={<ResonanceReport />} />
                <Route path="/ancestral-path" element={<AncestralPath />} />
                <Route path="/ascension-map" element={<AscensionMapDemo />} />
                <Route path="/hogon-review" element={<HogonReview />} />
                <Route path="/pharmer-profile" element={<PharmerProfile />} />
                <Route path="/field-almanac" element={<FieldAlmanac />} />
                <Route path="/conductor" element={<AgroMajicConductor />} />
                <Route path="/liner-notes" element={<LinerNotes />} />
                <Route path="/master-build" element={<MasterBuild />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/crop-export" element={<CropExport />} />
                <Route path="/chord-recipes" element={<ChordRecipeGallery />} />
                <Route path="/crop-oracle" element={<CropOracle />} />
                <Route path="/bed-strum" element={<BedStrumVisualizer />} />
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