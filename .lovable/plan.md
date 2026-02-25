
# Make Crop Oracle the Home Page

## Overview
Swap the routing so the Crop Oracle page loads at `/` (the root URL) and the current landing page moves to `/stage`.

## Changes

### 1. Update `src/App.tsx` routing
- Change the `/` route to render `CropOracle` (lazy-loaded) instead of `Index`
- Add a new `/stage` route for the current `Index` landing page
- Move the `Index` import to a lazy import since it will no longer be eagerly loaded

### 2. Update navigation references
- In `src/pages/CropOracle.tsx`, the Home icon button currently navigates to `/` -- update it to navigate to `/stage` so users can still reach the landing page
- Any other internal links pointing to `/` that expect the landing page will be checked and updated if needed

### 3. Files affected
- `src/App.tsx` -- route swap
- `src/pages/CropOracle.tsx` -- home button target
- `src/pages/Index.tsx` -- no changes needed (just served at a different route)

## Technical Notes
- The `afterSignOutUrl` in ClerkProvider currently points to `"/"` -- this will now land users on the Crop Oracle, which is fine since it's not a protected route
- The `ProtectedRoute` wrapper was already removed from the Crop Oracle route, so no auth changes needed
