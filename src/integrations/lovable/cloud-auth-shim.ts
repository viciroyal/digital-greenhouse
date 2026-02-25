/**
 * Shim for @lovable.dev/cloud-auth-js
 * Provides a no-op implementation when the package is not available.
 */

interface OAuthResult {
  redirected?: boolean;
  error?: Error;
  tokens?: { access_token: string; refresh_token: string };
}

export function createLovableAuth(_opts: Record<string, unknown> = {}) {
  return {
    signInWithOAuth: async (
      _provider: string,
      _options?: Record<string, unknown>
    ): Promise<OAuthResult> => {
      console.warn("Lovable Cloud Auth is not configured. Using Clerk auth instead.");
      return { error: new Error("Lovable Cloud Auth not available") };
    },
  };
}
