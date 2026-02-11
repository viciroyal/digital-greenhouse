import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CircadianProvider } from "@/contexts/CircadianContext";
import { AudioBiomeProvider } from "@/contexts/AudioBiomeContext";
import { FieldModeProvider } from "@/contexts/FieldModeContext";
import sovereignEmblem from "@/assets/sovereign-emblem.png";

// Eagerly load the landing page for instant first paint
import Index from "./pages/Index";

// Lazy-load all secondary routes
const CropOracle = lazy(() => import("./pages/CropOracle"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const UserGuide = lazy(() => import("./pages/UserGuide"));
const DevGuide = lazy(() => import("./pages/DevGuide"));
const TestingSuiteDocs = lazy(() => import("./pages/TestingSuiteDocs"));
const CropLibrary = lazy(() => import("./pages/CropLibrary"));
const WeeklyTasks = lazy(() => import("./pages/WeeklyTasks"));
const FirstGarden = lazy(() => import("./pages/FirstGarden"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
                <Route path="/crop-oracle" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><CropOracle /></Suspense>} />
                <Route path="/auth" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><Auth /></Suspense>} />
                <Route path="/profile" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><Profile /></Suspense>} />
                <Route path="/user-guide" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><UserGuide /></Suspense>} />
                <Route path="/dev-guide" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><DevGuide /></Suspense>} />
                <Route path="/testing-docs" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><TestingSuiteDocs /></Suspense>} />
                <Route path="/crop-library" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><CropLibrary /></Suspense>} />
                <Route path="/weekly-tasks" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><WeeklyTasks /></Suspense>} />
                <Route path="/first-garden" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><FirstGarden /></Suspense>} />
                <Route path="*" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><NotFound /></Suspense>} />
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
