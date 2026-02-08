

# Security Remediation: user_roles Table RLS Policies

## Overview
The security scan identified 2 warning-level issues related to the `user_roles` table that need to be addressed with explicit RLS policies.

## Current State
The `user_roles` table currently has:
- **SELECT policies**: Users can view their own roles; admins can view all roles
- **Missing policies**: No explicit INSERT, UPDATE, or DELETE policies

While RLS defaults to "deny all" when no policy exists, explicit policies provide:
1. Clear documentation of access rules
2. Protection against accidental policy misconfigurations
3. Explicit control over who can manage user roles

## Security Issues to Fix

### Issue 1: Missing INSERT/UPDATE/DELETE Policies
**Finding**: "User Roles Could Be Modified Without Proper Authorization"
**Risk**: Without explicit policies, role management intent is unclear
**Solution**: Add admin-only policies for INSERT, UPDATE, and DELETE operations

### Issue 2: Potential Exposure to Unauthenticated Users
**Finding**: "User Role Information Could Be Exposed to Unauthorized Users"
**Risk**: Current SELECT policies don't explicitly restrict anonymous access
**Solution**: Add `TO authenticated` clause to existing SELECT policies to ensure only logged-in users can access role data

## Implementation Plan

### Step 1: Create Database Migration
Add a new migration file with the following RLS policies:

```text
+----------------------------------+
|     user_roles RLS Policies      |
+----------------------------------+
| SELECT (existing, to be updated) |
| - Users: own roles only          |
| - Admins: all roles              |
| - Require authenticated role     |
+----------------------------------+
| INSERT (new)                     |
| - Admins only                    |
+----------------------------------+
| UPDATE (new)                     |
| - Admins only                    |
+----------------------------------+
| DELETE (new)                     |
| - Admins only                    |
+----------------------------------+
```

### Step 2: SQL Migration Details
The migration will:
1. Drop existing SELECT policies
2. Recreate SELECT policies with explicit `TO authenticated` restriction
3. Add admin-only INSERT policy using `has_role()` function
4. Add admin-only UPDATE policy using `has_role()` function
5. Add admin-only DELETE policy using `has_role()` function

---

## Technical Details

### SQL Migration Code
```sql
-- Drop existing SELECT policies to recreate with explicit auth requirement
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Recreate SELECT policies with explicit TO authenticated
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add admin-only INSERT policy
CREATE POLICY "Only admins can insert user roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add admin-only UPDATE policy
CREATE POLICY "Only admins can update user roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add admin-only DELETE policy
CREATE POLICY "Only admins can delete user roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
```

### Files to Create/Modify
| File | Action |
|------|--------|
| `supabase/migrations/[timestamp]_user_roles_rls.sql` | Create new migration |

### No Code Changes Required
The existing `useAdminRole` hook and pages using it (HogonReview, AncestralPath) will continue to work as expected since they only read from the `user_roles` table.

