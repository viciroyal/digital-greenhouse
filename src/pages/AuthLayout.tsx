import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "@/styles/auth.css";

const AuthLayout = () => {
  const navigate = useNavigate();

  // 🔥 Virtual toggle state (NOT path-based)
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:p-10">

      {/* =========================
          BACKGROUND
      ========================== */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(240 60% 6%) 0%, hsl(230 50% 8%) 50%, hsl(220 45% 6%) 100%)",
        }}
      />

      {/* =========================
          BACK BUTTON
      ========================== */}
      <motion.button
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full"
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

      {/* =========================
          AUTH CARD
      ========================== */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-card rounded-2xl border border-[hsl(48,80%,40%)] bg-[hsl(230,30%,10%/0.98)] backdrop-blur-xl p-8">

          {/* =========================
              HEADER
          ========================== */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-[Staatliches] tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#FFF3B0] via-[#D4AF37] to-[#7A5A16]">
              THE THRESHOLD
            </h1>

            <p className="font-mono text-[hsl(48,70%,75%)] mt-2">
              {isSignUp
                ? "Begin your journey as a Pharmer."
                : "Enter your credentials to continue."}
            </p>
          </div>

          {/* =========================
              TOGGLE
          ========================== */}
          <div className="relative flex justify-center mb-10">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="absolute top-0 bottom-0 w-36 rounded-full 
                bg-gradient-to-r from-[#F7E08A] via-[#D4AF37] to-[#8C6B1F]"
              style={{
                left: isSignUp ? "50%" : "0%",
              }}
            />

            <div className="relative flex w-72 border border-[hsl(48,70%,40%)] rounded-full bg-[hsl(230,30%,12%)]">

              <button
                onClick={() => setIsSignUp(false)}
                className={`relative z-10 w-1/2 py-3 text-lg font-[Staatliches] tracking-widest transition-all duration-300 ${
                  !isSignUp
                    ? "text-[#E6D38A]"
                    : "text-[hsl(225,20%,40%)] hover:text-[#CFA9FF]"
                }`}
              >
                SIGN IN
              </button>

              <button
                onClick={() => setIsSignUp(true)}
                className={`relative z-10 w-1/2 py-3 text-lg font-[Staatliches] tracking-widest transition-all duration-300 ${
                  isSignUp
                    ? "text-[#E6D38A]"
                    : "text-[hsl(225,20%,40%)] hover:text-[#CFA9FF]"
                }`}
              >
                SIGN UP
              </button>

            </div>
          </div>

          {/* =========================
              CLERK FORMS (VIRTUAL)
          ========================== */}
         {/* Clerk Auth Component */}
{isSignUp ? (
  <SignUp
    routing="virtual"
    afterSignUpUrl="/crop-oracle"
  />
) : (
  <SignIn
    routing="virtual"
    afterSignInUrl="/crop-oracle"
  />
)}

        </div>
      </motion.div>
    </main>
  );
};

export default AuthLayout;
