# Netlify Environment Variables Setup

## ⚠️ Required Environment Variables

You **must** configure these environment variables in your Netlify dashboard for Discord OAuth to work:

### 1. Go to Netlify Dashboard
- Visit: https://app.netlify.com
- Select your site: `fakevouch`
- Go to **Site settings** → **Environment variables**

### 2. Add These Variables:

#### Discord OAuth Credentials
```
DISCORD_CLIENT_ID=your_actual_discord_client_id
DISCORD_CLIENT_SECRET=your_actual_discord_client_secret
```

#### NextAuth Configuration
```
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=https://your-site-name.netlify.app
```
**Important:** Replace `your-site-name` with your actual Netlify site name!

#### Discord Bot Configuration (Optional but recommended)
```
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_GUILD_ID=your_discord_server_guild_id
```

### 3. Generate NEXTAUTH_SECRET

You can generate a secure random secret using:
- **Windows PowerShell:**
  ```powershell
  -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
  ```
- **Online:** https://generate-secret.vercel.app/32
- **Command line (if you have OpenSSL):**
  ```bash
  openssl rand -base64 32
  ```

### 4. Update Discord Application Settings

Go to https://discord.com/developers/applications:

1. Select your application
2. Go to **OAuth2** → **General**
3. Add this to **Redirects**:
   ```
   https://your-site-name.netlify.app/api/auth/callback/discord
   ```
   **Replace `your-site-name` with your actual Netlify site name!**

4. **Save Changes**

### 5. Redeploy

After setting all environment variables:
- Go to **Deploys** tab
- Click **Trigger deploy** → **Deploy site**
- Or push a new commit to trigger automatic deploy

## Common Issues

### ❌ "Server error" when clicking login
- **Cause:** Missing `NEXTAUTH_SECRET` or `trustHost` not set
- **Fix:** Add `NEXTAUTH_SECRET` to Netlify environment variables and redeploy

### ❌ "Invalid redirect URI"
- **Cause:** Discord redirect URI doesn't match Netlify URL
- **Fix:** Update Discord OAuth2 redirect URI to match your Netlify URL exactly

### ❌ "Configuration error"
- **Cause:** Missing `DISCORD_CLIENT_ID` or `DISCORD_CLIENT_SECRET`
- **Fix:** Add both variables to Netlify environment variables

## ✅ Quick Checklist

- [ ] `DISCORD_CLIENT_ID` set in Netlify
- [ ] `DISCORD_CLIENT_SECRET` set in Netlify
- [ ] `NEXTAUTH_SECRET` set in Netlify (random 32+ character string)
- [ ] `NEXTAUTH_URL` set to your Netlify URL (e.g., `https://fakevouch.netlify.app`)
- [ ] Discord OAuth2 redirect URI updated with your Netlify URL
- [ ] Site redeployed after adding variables

