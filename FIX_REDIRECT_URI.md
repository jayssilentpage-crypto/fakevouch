# Fix "Invalid OAuth2 redirect_uri" Error

## Problem
Discord is showing: **"Invalid OAuth2 redirect_uri"**

This means the redirect URI in your authorization request doesn't match any authorized redirect URIs in your Discord application settings.

## Solution: Add Redirect URI to Discord

### Step-by-Step:

1. **Go to Discord Developer Portal**
   - Visit: https://discord.com/developers/applications
   - Sign in with your Discord account

2. **Select Your Application**
   - Find your application in the list
   - Click on it to open

3. **Navigate to OAuth2**
   - In the left sidebar, click **"OAuth2"**
   - Then click **"General"** (or just "OAuth2" if it's already selected)

4. **Add Redirect URI**
   - Scroll down to the **"Redirects"** section
   - Click **"+ Add Redirect"** button
   - Enter this **exact URL**:
     ```
     https://fakevouch.netlify.app/api/auth/callback/discord
     ```
   - ⚠️ **Important:** 
     - Use `https://` (not `http://`)
     - No trailing slash
     - Must match exactly

5. **Save Changes**
   - Click **"Save Changes"** button at the bottom
   - Wait for the confirmation message

6. **Verify Netlify Environment Variable**
   - Go to Netlify Dashboard → Your Site → Site settings → Environment variables
   - Make sure `NEXTAUTH_URL` is set to:
     ```
     https://fakevouch.netlify.app
     ```
   - ⚠️ **No trailing slash!**

## Common Mistakes:

❌ **Wrong:** `https://fakevouch.netlify.app/` (with trailing slash)  
✅ **Right:** `https://fakevouch.netlify.app` (no trailing slash)

❌ **Wrong:** `http://fakevouch.netlify.app` (using http instead of https)  
✅ **Right:** `https://fakevouch.netlify.app` (must use https)

❌ **Wrong:** Missing `/api/auth/callback/discord` part  
✅ **Right:** Full path: `https://fakevouch.netlify.app/api/auth/callback/discord`

## After Fixing:

1. **Wait 1-2 minutes** for Discord to update (usually instant, but sometimes takes a moment)
2. **Try logging in again** - the error should be gone
3. If it still doesn't work, **clear your browser cache** and try again

## If You Have Multiple Environments:

If you also test locally, you can add multiple redirect URIs:
- `https://fakevouch.netlify.app/api/auth/callback/discord` (production)
- `http://localhost:3000/api/auth/callback/discord` (local development)

Both can be added in the Discord Developer Portal.

