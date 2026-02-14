import { useEffect } from "react";
import type { UserResource } from "@clerk/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Syncs a Clerk user to the Supabase profiles table
 * This ensures your existing database structure is maintained while using Clerk for auth
 */
export async function syncClerkUserToSupabase(clerkUser: UserResource): Promise<void> {
  try {
    if (!clerkUser.id) {
      console.warn("Clerk user has no ID, skipping sync");
      return;
    }

    const profileData = {
      user_id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || "",
      display_name: clerkUser.fullName || clerkUser.firstName || "Pharmer",
      avatar_url: clerkUser.imageUrl || null,
      clerk_id: clerkUser.id,
      updated_at: new Date().toISOString(),
    };

    // Upsert the profile (insert if new, update if exists)
    const { error } = await supabase
      .from("profiles")
      .upsert(profileData, {
        onConflict: "user_id",
      });

    if (error) {
      console.error("Error syncing Clerk user to Supabase:", error);
      throw new Error(`Sync failed: ${error.message}`);
    }

    console.log("✓ Clerk user synced to Supabase successfully");
  } catch (error) {
    console.error("Clerk-Supabase sync error:", error);
    // Don't throw - allow app to continue even if sync fails
  }
}

/**
 * Hook to automatically sync Clerk user on login/update
 */
export function useClerkSupabaseSync(clerkUser: UserResource | null | undefined) {
  useEffect(() => {
    if (clerkUser?.id) {
      syncClerkUserToSupabase(clerkUser);
    }
  }, [clerkUser?.id, clerkUser?.updatedAt]);
}