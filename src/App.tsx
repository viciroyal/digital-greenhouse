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
import { PlaybackProvider } from "@/contexts/PlaybackContext";
import sovereignEmblem from "@/assets/sovereign-emblem.png";
import MiniMusicPlayer from "@/components/audio/MiniMusicPlayer";
import { useLocation } from "react-router-dom";

const MiniMusicPlayerGuard = () => {
  const { pathname } = useLocation();
  if (pathname === "/stage") return null;
  return <MiniMusicPlayer />;
};

import AuthLayout from "./pages/AuthLayout";
const Index = lazy(() => import("./pages/Index"));

const CropOracle = lazy(() => import("./pages/CropOracle"));
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

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <FirstGarden />
      </Suspense>
    } />

    <Route path="/stage" element={
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Index />
      </Suspense>
    } />

    <Route path="/crop-oracle" element={
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <CropOracle />
      </Suspense>
    } />

    {/* AUTH */}
    <Route
      path="/auth/*"
      element={
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <AuthLayout />
        </Suspense>
      }
    />

    {/* PUBLIC */}
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

    {/* PROTECTED */}
    <Route path="/crop-oracle" element={
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <CropOracle />
      </Suspense>
    } />

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
        
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <CropLibrary />
          </Suspense>
        
      }
    />

    <Route
      path="/weekly-tasks"
      element={
       
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <WeeklyTasks />
          </Suspense>
        
      }
    />

    <Route path="/first-garden" element={<Navigate to="/" replace />} />

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
    afterSignOutUrl="/"
    appearance={{
      variables: {
        colorPrimary: "#D4AF37",
      },

      elements: {
        rootBox: "shadow-none p-0 w-full",
        card: "bg-transparent shadow-none border-none p-0 w-full",
        socialButtonsBlockButtonContainer: `
  flex
  flex-col
  gap-4
  sm:flex-row
`,
        header: "",
        headerTitle: "hidden",
        headerSubtitle: "hidden",
        footer: "hidden",
        footerAction: "hidden",
        formFieldLabel: "hidden",

        formFieldRow: "w-full px-1",
        formField: "w-full",

        formFieldInput:
          "!bg-[hsl(230,30%,12%)] !border !border-[#B8932E] !text-[#F3E7B3] font-mono rounded-xl px-4 py-4 w-full placeholder:!text-[hsl(220,25%,70%)] transition-all duration-300 focus:shadow-[0_0_25px_rgba(155,85,255,0.65)]",

        formFieldInput__focus:
          "!border-[#D4AF37] !outline-none !ring-0",

          formButtonPrimary: `
  bg-gradient-to-r from-[#F7E08A] via-[#D4AF37] to-[#8C6B1F]
  border border-[#C9A227]
  rounded-xl px-6 py-4
  font-mono uppercase tracking-widest
  text-[hsl(270,85%,30%)]
  text-sm sm:text-base
  transition-all duration-300
  shadow-[0_0_18px_rgba(212,175,55,0.35)]

  hover:text-[hsl(270,95%,38%)]
  hover:shadow-[0_0_30px_rgba(155,85,255,0.75),0_0_60px_rgba(155,85,255,0.45)]

  focus:outline-none focus:ring-0
`,

        
        formButtonPrimary__focus: "outline-none ring-0",

        socialButtonsBlockButton:
         `
         sm:w-auto
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

        socialButtonsBlockButton__focus: "outline-none ring-0",
        socialButtonsIcon:
          "w-6 h-6 brightness-110 contrast-110 transition-all duration-300",

        dividerLine: "bg-[hsl(220,20%,28%)]",
        dividerText: "text-[hsl(220,25%,70%)] font-mono text-xs",
        formFieldInput__oneTimeCode:
  "!bg-[hsl(230,30%,12%)] !border !border-[#B8932E] !text-[#F3E7B3] font-mono rounded-xl px-4 py-4 text-center text-xl tracking-widest",

formResendCodeLink:
  "text-[hsl(48,90%,70%)] font-mono hover:text-[#D4AF37]",
  formFieldSuccessText:
  "text-white font-mono text-sm",

formFieldErrorText:
  "text-red-400 font-mono text-sm",
  formFieldHintText:
  "text-white font-mono text-sm opacity-80",


identityPreview:
  "text-[hsl(48,70%,75%)] font-mono text-sm",

      },

      layout: {
        socialButtonsVariant: "blockButton",
      },
    }}

    localization={{
      signIn: {
        start: {
          title: "THE THRESHOLD",
          subtitle: "Enter your credentials to continue.",
          actionText: "ENTER THE PATH",
        },
    
        password: {
          title: "Unlock the garden gate",
          subtitle: "Enter your password to proceed.",
      
        },
    
        emailCode: {
          title: "Verification required",
          subtitle: "Enter the code sent to your email.",
          formTitle: "Enter verification code",
          resendButton: "Resend code",
        },
      },
    
      signUp: {
        start: {
          title: "THE THRESHOLD",
          subtitle: "Begin your journey as a Pharmer.",
          actionText: "BEGIN INITIATION",
        },
    
        emailCode: {
          title: "Verify your identity",
          subtitle: "Enter the code sent to your email.",
          formTitle: "Enter verification code",
          resendButton: "Resend code",
        },
      },
    
      formFieldLabel__emailAddress: "Email",
      formFieldLabel__password: "Password",
    
      formFieldInputPlaceholder__emailAddress: "Enter your email",
      formFieldInputPlaceholder__password: "Enter your password",
    }}
    
  >
  
  <QueryClientProvider client={queryClient}>
    <CircadianProvider>
        <AudioBiomeProvider>
          <FieldModeProvider>
            <PlaybackProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />

              <BrowserRouter>
                <AppRoutes />
                <MiniMusicPlayerGuard />
              </BrowserRouter>

              <a href="/stage" className="group fixed bottom-4 left-4 z-50">
                <img
                  src={sovereignEmblem}
                  alt="Sovereign Emblem — Go to The Stage"
                  className="w-16 opacity-75 hover:opacity-100 transition-all duration-500 cursor-pointer"
                  style={{
                    filter: 'drop-shadow(0 0 12px hsl(45 80% 50% / 0.4))',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = 'drop-shadow(0 0 25px hsl(45 80% 55% / 0.7)) drop-shadow(0 0 50px hsl(45 80% 50% / 0.3))')}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = 'drop-shadow(0 0 12px hsl(45 80% 50% / 0.4))')}
                />
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                  style={{
                    background: 'hsl(220 40% 10% / 0.9)',
                    border: '1px solid hsl(45 70% 45%)',
                    color: 'hsl(45 70% 75%)',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    fontFamily: 'Space Mono, monospace',
                  }}
                >
                  The Stage — Home Base
                </div>
              </a>
            </TooltipProvider>
            </PlaybackProvider>
          </FieldModeProvider>
        </AudioBiomeProvider>
      </CircadianProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;

