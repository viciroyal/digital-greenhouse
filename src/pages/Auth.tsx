import { SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import "@/styles/auth.css";


const Auth = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = searchParams.get("mode") || "signin";

  const setMode = (newMode: "signin" | "signup") => {
    setSearchParams({ mode: newMode });
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) navigate("/crop-oracle");
  }, [isSignedIn, isLoaded, navigate]);
  const [lastStrategy, setLastStrategy] = useState<string | null>(null);

  useEffect(() => {
  const strategy = localStorage.getItem("__clerk_last_active_strategy");
  setLastStrategy(strategy);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative">

      {/* Deep Space Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(240 60% 6%) 0%, hsl(230 50% 8%) 50%, hsl(220 45% 6%) 100%)",
        }}
      />

      {/* Back Button */}
      <motion.button
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: "hsl(230 30% 12% / 0.9)",
          border: "1px solid hsl(48 80% 40%)",
        }}
        whileHover={{ scale: 1.05, x: -5 }}
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-4 h-4 text-[hsl(48,90%,70%)]" />
        <span className="text-sm font-mono text-[hsl(48,90%,70%)]">
          Return
        </span>
      </motion.button>

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className=" auth-card rounded-2xl border border-[hsl(48,80%,40%)] bg-[hsl(230,30%,10%/0.98)] backdrop-blur-xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
          <h1 className="text-4xl font-[Staatliches] tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#FFF3B0] via-[#D4AF37] to-[#7A5A16]">
  THE THRESHOLD
</h1>

            <p className="font-mono text-[hsl(48,70%,75%)] mt-2">
              {mode === "signin"
                ? "Enter your credentials to continue."
                : "Begin your journey as a Pharmer."}
            </p>
          </div>

          {/* Toggle */}
          <div className="relative flex justify-center mb-10">

            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="absolute top-0 bottom-0 w-36 rounded-full 
              bg-gradient-to-r from-[#F7E08A] via-[#D4AF37] to-[#8C6B1F] 
              "
              
              style={{
                left: mode === "signin" ? "0%" : "50%",
              }}
            />

            <div className="relative flex w-72 border border-[hsl(48,70%,40%)] rounded-full bg-[hsl(230,30%,12%)]">
            <button
  onClick={() => setMode("signin")}
  className={`relative z-10 w-1/2 py-3 text-lg font-[Staatliches] tracking-widest transition-all duration-300 ${
    mode === "signin"
      ? "text-[#E6D38A]" // active gold, no hover
      : "text-[hsl(225,20%,40%)] hover:text-[#CFA9FF] hover:drop-shadow-[0_0_8px_rgba(155,85,255,0.9)]"
  }`}
>
  SIGN IN
</button>


<button
  onClick={() => setMode("signup")}
  className={[
    "relative z-10 w-1/2 py-3 text-lg font-[Staatliches] tracking-widest transition-all duration-300",
    mode === "signup"
      ? "text-[#E6D38A]" // active (no hover styles)
      : "text-[hsl(225,20%,40%)] hover:text-[#CFA9FF] hover:drop-shadow-[0_0_8px_rgba(155,85,255,0.9)]"
  ].join(" ")}
>
  SIGN UP
</button>


            </div>
          </div>

          {mode === "signin" ? (
            <>
              <div className={lastStrategy === "oauth_google" ? "oauth-glow rounded-xl" : ""} style={{ ["--clerk-button-text" as any]: "'ENTER THE PATH'" }}>
  <SignIn redirectUrl="/crop-oracle" />
</div>

              <p className="text-center text-xs font-mono mt-6 text-[hsl(48,60%,70%)]">
                New to the Path?{" "}
                <span
                  className="text-[hsl(48,100%,65%)] cursor-pointer"
                  onClick={() => setMode("signup")}
                >
                  SIGN UP
                </span>
              </p>
            </>
          ) : (
            <>
              <div className={lastStrategy === "oauth_google" ? "oauth-glow rounded-xl" : ""} style={{ ["--clerk-button-text" as any]: "'BEGIN INITIATION'" }}>
  <SignUp redirectUrl="/crop-oracle" />
</div>

              <p className="text-center text-xs font-mono mt-6 text-[hsl(48,60%,70%)]">
                Already initiated?{" "}
                <span
                  className="text-[hsl(48,100%,65%)] cursor-pointer"
                  onClick={() => setMode("signin")}
                >
                  SIGN IN
                </span>
              </p>
            </>
          )}

        </div>
      </motion.div>
    </main>
  );
};

export default Auth;
