import { useUser, useAuth, useSignUp, useSignIn } from "@clerk/clerk-react"
import { useEffect, useState } from "react";
import { syncClerkUserToSupabase } from "@/lib/clerkSupabaseSync";
import { useToast } from "./use-toast";

export function useClerkAuth() {
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut, isSignedIn, isLoaded: authLoaded } = useAuth();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  // Auto-sync user to Supabase when Clerk user changes
  useEffect(() => {
    if (user && userLoaded) {
      setIsSyncing(true);
      syncClerkUserToSupabase(user)
        .then(() => setIsSyncing(false))
        .catch((error) => {
          console.error("Sync error:", error);
          setIsSyncing(false);
        });
    }
  }, [user?.id, user?.updatedAt, userLoaded]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "Until next time, Pharmer.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    user,
    isSignedIn,
    isLoaded: userLoaded && authLoaded,
    isSyncing,
    signOut: handleSignOut,
  };
}