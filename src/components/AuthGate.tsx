import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

interface AuthGateProps {
  children?: React.ReactNode;
  message?: string; // Optional custom message if you want text inside
  onSignIn?: () => void; // Optional callback after sign-in navigation
}

const AuthGate = ({ children, message, onSignIn }: AuthGateProps) => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (onSignIn) onSignIn();
    navigate("/auth");
  };

  // If signed in, render children (or nothing if not used).
  if (isSignedIn) return <>{children}</>;

  // If not signed in, show a prompt or trigger sign-in on action.
  return (
    <div onClick={handleSignIn} style={{ cursor: "pointer" }}>
      {message || "Sign in to continue"}
    </div>
  );
};

export default AuthGate;
