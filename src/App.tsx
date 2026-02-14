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
      colorPrimary: "#D4AF37",
    },

    elements: {
      /* Root Layout */
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

      formFieldRow: "w-full px-1",
      formField: "w-full",

      /* =========================
         INPUTS
      ========================== */
      formFieldInput:
        "!bg-[hsl(230,30%,12%)] !border !border-[#B8932E] !text-[#F3E7B3] font-mono rounded-xl px-4 py-4 w-full placeholder:!text-[hsl(220,25%,70%)] transition-all duration-300 focus:shadow-[0_0_25px_rgba(155,85,255,0.65)]",

      formFieldInput__focus:
        "!border-[#D4AF37] !outline-none !ring-0",

      /* =========================
         PRIMARY BUTTON (Metallic Gold + Purple Interaction)
      ========================== */
      formButtonPrimary: `
      relative text-transparent
      bg-gradient-to-r from-[#F7E08A] via-[#D4AF37] to-[#8C6B1F]
      border border-[#C9A227]
      rounded-xl px-6 py-4
      transition-all duration-300
      shadow-[0_0_18px_rgba(212,175,55,0.35)]
    
      hover:shadow-[0_0_30px_rgba(155,85,255,0.75),0_0_60px_rgba(155,85,255,0.45)]
      focus:shadow-[0_0_35px_rgba(155,85,255,0.9),0_0_70px_rgba(155,85,255,0.55)]
    
      before:absolute
      before:inset-0
      before:flex
      before:items-center
      before:justify-center
      before:font-mono
      before:tracking-widest
      before:uppercase
      before:text-[hsl(270,85%,30%)]   /* darker base purple */
      before:content-[var(--clerk-button-text)]
      before:transition-all
      before:duration-300
    
      hover:before:text-[hsl(270,90%,38%)]  /* darker readable purple */
      focus:before:text-[hsl(270,95%,40%)]
    `,
    
      formButtonPrimary__focus: "outline-none ring-0",

      /* =========================
         SOCIAL BUTTONS
      ========================== */
      socialButtonsBlockButton:
        `
        w-full
        bg-[hsl(230,30%,14%)]
        border border-[#B8932E]
        text-[#E6D38A]
        font-mono
        rounded-xl py-4
        flex items-center justify-center gap-4
        transition-all duration-300
        relative
        focus:shadow-[0_0_30px_rgba(155,85,255,0.75),0_0_60px_rgba(155,85,255,0.45)]
        `,

      socialButtonsBlockButton__focus:
        "outline-none ring-0",

      socialButtonsIcon:
        "w-6 h-6 brightness-110 contrast-110 transition-all duration-300",

      dividerLine: "bg-[hsl(220,20%,28%)]",
      dividerText: "text-[hsl(220,25%,70%)] font-mono text-xs",
    },

    layout: {
      socialButtonsVariant: "blockButton",
    },
  }}

  localization={{
    signIn: {
      start: {
        actionText: "ENTER THE PATH",
      },
    },

    signUp: {
      start: {
        actionText: "BEGIN INITIATION",
      },
      continue: {
        actionText: "BEGIN INITIATION",
      },
    },

    formFieldInputPlaceholder__username: "Enter username",
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
