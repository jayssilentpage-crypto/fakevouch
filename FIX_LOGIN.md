# 🔧 Fix Discord Login Error

## Current Error
You're getting `invalid_client` error because the **Discord Client Secret** is missing.

## Quick Fix

1. **Open your `.env.local` file**:
   ```
   C:\Users\ender\Music\fakevouch\.env.local
   ```

2. **Get your Discord Client Secret**:
   - Go to https://discord.com/developers/applications
   - Select your application (Client ID: 1434329685910618203)
   - Go to **OAuth2** section
   - Under **Client Secret**, click **"Reset Secret"** if needed
   - **Copy the secret** (it's a long string)

3. **Update `.env.local`**:
   Replace this line:
   ```
   DISCORD_CLIENT_SECRET=your_discord_client_secret_here
   ```
   
   With:
   ```
   DISCORD_CLIENT_SECRET=your_actual_secret_from_discord
   ```

4. **Make sure the redirect URI is set**:
   - In Discord Developer Portal → OAuth2 → Redirects
   - Add: `http://localhost:3000/api/auth/callback/discord`
   - Click **Save Changes**

5. **Restart your server**:
   ```powershell
   # Stop the server (Ctrl+C)
   npm run dev
   ```

## After Fixing

Once you add the Client Secret and restart, the login will work and you'll be automatically redirected to the dashboard! 🎉

