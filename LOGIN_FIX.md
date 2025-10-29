# Login Token Issue - Fixed

## Problem
After logging in (both regular and social login), the success message appeared and redirected to the main page, but the token wasn't available. The header button logic showed the user as not logged in.

## Root Cause
1. **Regular Login**: The `LoginForm` component didn't store the token anywhere after successful login - it only showed a notification and redirected
2. **Social Login**: Used popup-based flow without `postMessage` communication between popup and parent window
3. **Header Component**: Was checking Redux for the token using `selectCurrentToken`, but Redux was never updated

## Fixes Applied

### 1. Fixed Regular Login (LoginForm.jsx)
**Before:**
```javascript
onSuccess: (response) => {
    notificationApi?.success({
        message: "Welcome!",
        description: response?.message || "You have successfully logged in.",
        duration: 1,
    });

    setTimeout(() => {
        navigate("/");
    }, 2200);
}
```

**After:**
```javascript
onSuccess: (response) => {
    // Store credentials in Redux and localStorage
    const token = response?.token || response?.accessToken;
    const userName = response?.userName || response?.username || response?.email;

    if (token) {
        // Update Redux store
        dispatch(setCredentials({ userName, accessToken: token }));

        // Store in localStorage using utility
        storeAuthCredentials({
            token,
            userName,
            permissions: response?.permissions,
            userConfig: response?.userConfig
        });
    }

    // Success notification
    notificationApi?.success({
        message: "Welcome!",
        description: response?.message || "You have successfully logged in.",
        duration: 1,
    });

    setTimeout(() => {
        navigate("/");
    }, 2200);
}
```

### 2. Fixed Social Login Flow (socialAuth.js)
Changed from **popup-based** to **redirect-based** social login:

**Before:**
```javascript
export const handleGoogleLogin = () => {
  return `openSocialLoginPopup`(SocialProviders.GOOGLE);
};
```

**After:**
```javascript
export const handleGoogleLogin = () => {
  return redirectToSocialLogin(SocialProviders.GOOGLE, window.location.origin);
};
```

This now works with the existing `/social-login` callback route.

### 3. Updated Social Login Callback
Changed redirect destination from `/admin` to `/` (home page):

**Before:**
```javascript
navigate("/admin", { replace: true });
```

**After:**
```javascript
navigate("/", { replace: true });
```

## How It Works Now

### Regular Login Flow:
1. User enters credentials and clicks "Log in"
2. API call to `/api/v1/auth/login`
3. Response contains token and user info
4. Token is stored in:
   - Redux store (via `setCredentials`)
   - localStorage (via `storeAuthCredentials`)
5. User is redirected to home page
6. Header re-renders and shows "My Account" button

### Social Login Flow (Google/Facebook):
1. User clicks "Sign in with Google" or "Sign in with Facebook"
2. Browser redirects to backend OAuth URL (e.g., `/api/v1/auth/google/redirect`)
3. User authenticates with Google/Facebook
4. Backend redirects back to `/social-login?token=xxx&userName=yyy`
5. `SocialLoginCallback` component:
   - Parses token and user info from URL
   - Stores in Redux and localStorage
   - Redirects to home page
6. Header re-renders and shows "My Account" button

## Files Modified

1. `src/components/LoginForm/LoginForm.jsx` - Added token storage after login
2. `src/utils/socialAuth.js` - Changed to redirect-based social login
3. `src/components/Auth/SocialLoginCallback.jsx` - Changed redirect to home page

## Testing

To verify the fix:

1. **Test Regular Login:**
   - Go to `/login`
   - Enter valid credentials
   - Click "Log in"
   - After redirect, check if header shows "My Account" button
   - Open DevTools Console, type: `localStorage.getItem('token')`
   - Should return a valid token

2. **Test Social Login:**
   - Go to `/login` or `/register`
   - Click "Sign in with Google" or "Sign in with Facebook"
   - Complete OAuth flow
   - After redirect to home page, check if header shows "My Account" button
   - Check localStorage for token

## Backend Requirements

For social login to work properly, the backend must:

1. Support these endpoints:
   - `/api/v1/auth/google/redirect`
   - `/api/v1/auth/facebook/redirect`

2. After OAuth completion, redirect to:
   ```
   {origin}/social-login?token={token}&userName={userName}
   ```

   Optional query parameters:
   - `permissions` (JSON array, URL-encoded)
   - `userConfig` (JSON object, URL-encoded)

## Related Files

- `src/utils/auth.js` - Global auth utilities including `isAuthorized()`
- `src/features/auth/authSlice.js` - Redux store for auth state
- `src/components/header/HeaderContainer.jsx` - Header component that checks token
