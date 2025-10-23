# Authentication System Migration Guide

## Overview
The authentication system has been refactored to use **server-side httpOnly cookies** instead of client-side cookie management. This improves security and fixes the token synchronization issues.

## What Changed

### Before (Problems)
1. **Inconsistent cookie names**: Client used `"token"`, server used `"auth-token-ecommerce"`
2. **Security vulnerabilities**: Cookies were accessible via JavaScript (XSS risk)
3. **No CSRF protection**: Missing `sameSite` attribute
4. **Mixed storage**: Cookies + localStorage with no sync
5. **Client-side token exposure**: Token visible in browser DevTools

### After (Solutions)
1. **Consistent naming**: All use `"auth-token-ecommerce"`
2. **httpOnly cookies**: Token not accessible via JavaScript
3. **CSRF protection**: `sameSite: 'lax'` attribute
4. **Server Actions**: All auth operations go through secure server actions
5. **Secure by default**: `secure` flag in production

## New Architecture

### Server Actions (`src/actions/authActions.ts`)
All authentication operations now use Next.js Server Actions:
- `loginAction(credentials)` - Login with email/password
- `signupAction(credentials)` - Create new account
- `googleLoginAction(credential)` - Google OAuth login
- `facebookLoginAction(accessToken, userID)` - Facebook login
- `logoutAction()` - Logout and clear session
- `getAuthToken()` - Get current auth token (server-side only)

### Cookie Configuration
```typescript
{
  name: 'auth-token-ecommerce',
  httpOnly: true,                          // Not accessible via JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax',                         // CSRF protection
  maxAge: 7 * 24 * 60 * 60,               // 7 days
  path: '/',
}
```

## Migration Steps

### 1. Auth Component (✅ Completed)
- Removed `Cookies.set()` calls
- Now uses server actions: `loginAction`, `signupAction`, etc.
- Added `router.refresh()` to update server components after auth

### 2. Header Component (✅ Completed)
- Removed `Cookies.remove()`
- Now uses `logoutAction()`
- Added `router.refresh()` after logout

### 3. Zustand Store (✅ Completed)
- Removed `Cookies.get()` dependency
- Token state is now for UI purposes only (not source of truth)
- Server-side cookies are the source of truth

### 4. Server Components (✅ Completed)
All server components now properly check for token:
```typescript
const token = (await cookies()).get("auth-token-ecommerce")?.value;

if (!token) {
  // Handle unauthenticated state
  return <EmptyState />;
}

// Proceed with authenticated request
const data = await fetchData(token);
```

### 5. Client Components (⚠️ Needs Update)
Client components that need the token should receive it as a prop from their parent server component:

**Before:**
```typescript
const token = Cookies.get("auth-token-ecommerce");
```

**After:**
```typescript
// In server component (parent)
const token = (await cookies()).get("auth-token-ecommerce")?.value;
<ClientComponent token={token} />

// In client component
function ClientComponent({ token }: { token?: string }) {
  // Use token
}
```

## Files That Still Need Updates

### High Priority
1. **`src/components/BagItem.tsx`** (line 69)
   - Currently: `const token = Cookies.get("auth-token-ecommerce");`
   - Fix: Accept token as prop from parent

2. **`src/components/Products/ProductsBagList.tsx`**
   - Should pass token to BagItem components

### Medium Priority
3. Any other client components using `Cookies.get("auth-token-ecommerce")`

## Testing Checklist

- [ ] Login with email/password
- [ ] Signup with email/password
- [ ] Google OAuth login
- [ ] Facebook login
- [ ] Logout
- [ ] Access protected pages (bag, wishlist) when logged in
- [ ] Access protected pages when NOT logged in (should show empty state)
- [ ] Token persists across page refreshes
- [ ] Token expires after 7 days
- [ ] Token is httpOnly (check in DevTools - should not be accessible)

## Security Benefits

1. **XSS Protection**: httpOnly cookies cannot be accessed by JavaScript
2. **CSRF Protection**: sameSite attribute prevents cross-site attacks
3. **HTTPS Only**: Secure flag ensures cookies only sent over HTTPS in production
4. **No Token Exposure**: Token never visible in client-side code or localStorage

## Next Steps

1. Update remaining client components to accept token as prop
2. Consider implementing token refresh mechanism
3. Add session management (track active sessions)
4. Implement "Remember Me" functionality with longer expiry
5. Add rate limiting for auth endpoints

## Breaking Changes

⚠️ **Important**: After this migration, users will need to log in again as the cookie name and storage mechanism have changed.

## Rollback Plan

If issues occur, you can temporarily revert by:
1. Restore old `Auth.tsx` from git history
2. Restore old `Header.tsx` from git history
3. Restore old `useAppStore.ts` from git history
4. Delete `src/actions/authActions.ts`
5. Delete `src/lib/auth.ts`
