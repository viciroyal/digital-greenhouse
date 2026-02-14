import { lazy, Suspense } from "react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CircadianProvider } from "@/contexts/CircadianContext";
import { AudioBiomeProvider } from "@/contexts/AudioBiomeContext";
import { FieldModeProvider } from "@/contexts/FieldModeContext";
import sovereignEmblem from "@/assets/sovereign-emblem.png";

import Index from "./pages/Index";

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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />

    <Route
      path="/auth"
      element={
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Auth />
        </Suspense>
      }
    />

    <Route
      path="/user-guide"
      element={
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <UserGuide />
        </Suspense>
      }
    />

    <Route
      path="/dev-guide"
      element={
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <DevGuide />
        </Suspense>
      }
    />

    <Route
      path="/crop-oracle"
      element={
        <ProtectedRoute>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <CropOracle />
          </Suspense>
        </ProtectedRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Profile />
          </Suspense>
        </ProtectedRoute>
      }
    />

    <Route
      path="/testing-docs"
      element={
        <ProtectedRoute>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <TestingSuiteDocs />
          </Suspense>
        </ProtectedRoute>
      }
    />

    <Route
      path="/crop-library"
      element={
        <ProtectedRoute>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <CropLibrary />
          </Suspense>
        </ProtectedRoute>
      }
    />

    <Route
      path="/weekly-tasks"
      element={
        <ProtectedRoute>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <WeeklyTasks />
          </Suspense>
        </ProtectedRoute>
      }
    />

    <Route
      path="/first-garden"
      element={
        <ProtectedRoute>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <FirstGarden />
          </Suspense>
        </ProtectedRoute>
      }
    />

    <Route
      path="*"
      element={
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <NotFound />
        </Suspense>
      }
    />
  </Routes>
);

const App = () => (
<ClerkProvider
  publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
  appearance={{
    variables: {
      colorPrimary: "hsl(48 100% 60%)",
    },
    elements: {
      /* Remove Clerk default layout */
      rootBox: "shadow-none p-0 w-full",
      card: "bg-transparent shadow-none border-none p-0 w-full",

      header: "hidden",
      headerTitle: "hidden",
      headerSubtitle: "hidden",
      identityPreview: "hidden",
      footer: "hidden",
      footerAction: "hidden",
      formResendCodeLink: "hidden",
      formFieldLabel: "hidden",

      /* Prevent side clipping */
      formFieldRow: "w-full px-1",
      formField: "w-full",

      /* Inputs */
      formFieldInput:
        "!bg-[hsl(230,30%,12%)] !border !border-[hsl(48,90%,55%)] !text-[hsl(48,100%,88%)] font-mono rounded-xl px-4 py-4 w-full placeholder:!text-[hsl(220,25%,78%)]",

      formFieldInput__focus:
        "!border-[hsl(48,100%,60%)]",

      /* Submit Button */
      formButtonPrimary:
  "relative text-transparent bg-gradient-to-r from-[hsl(48,100%,60%)] to-[hsl(42,95%,52%)] border border-[hsl(48,100%,60%)] rounded-xl px-6 py-4 shadow-[0_0_35px_hsl(48,100%,60%/0.5)] hover:shadow-[0_0_55px_hsl(48,100%,60%/0.75)] transition-all duration-300 before:absolute before:inset-0 before:flex before:items-center before:justify-center before:font-mono before:tracking-widest before:uppercase before:text-[hsl(230,25%,18%)] before:content-[var(--clerk-button-text)]",


      /* Social Buttons */
      socialButtonsBlockButton:
        "w-full bg-[hsl(230,30%,14%)] border border-[hsl(48,80%,45%)] text-[hsl(48,90%,85%)] font-mono rounded-xl py-4 flex items-center justify-center gap-4 shadow-[0_0_15px_hsl(48,100%,60%/0.15)] transition-all duration-300 hover:bg-[hsl(48,95%,58%)] hover:text-[hsl(230,30%,15%)] hover:shadow-[0_0_35px_hsl(48,100%,60%/0.45)]",

      socialButtonsIcon:
        "w-6 h-6",

      dividerLine:
        "bg-[hsl(220,20%,30%)]",

      dividerText:
        "text-[hsl(220,25%,75%)] font-mono text-xs",
    },
    layout: {
      socialButtonsVariant: "blockButton",
    },
  }}

  localization={{
    signIn: {
      start: {
        actionText: "Enter the Path",
      },
    },
    signUp: {
      start: {
        actionText: "BEGIN INITIATION",
      },
    },
  
    formFieldInputPlaceholder__username:
    "Enter username",
  
  formFieldInputPlaceholder__emailAddress:
    "Enter your email address",
  
    formFieldInputPlaceholder__password:
      "Enter your password",
  }}
  
>

    <QueryClientProvider client={queryClient}>
      <CircadianProvider>
        <AudioBiomeProvider>
          <FieldModeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>

              <img
                src={sovereignEmblem}
                alt="Sovereign Emblem"
                className="fixed bottom-4 left-4 w-16 opacity-75 hover:opacity-100 transition-all duration-500 pointer-events-none z-50"
              />
            </TooltipProvider>
          </FieldModeProvider>
        </AudioBiomeProvider>
      </CircadianProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
