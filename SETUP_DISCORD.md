# 🔐 Discord OAuth Setup Guide

## Step 1: Create Discord Application

1. Go to **[Discord Developer Portal](https://discord.com/developers/applications)**
2. Click **"New Application"** button
3. Give it a name (e.g., "FakeVouch")
4. Click **"Create"**

## Step 2: Get Your Client ID and Secret

1. In your application, go to **"OAuth2"** in the left sidebar
2. You'll see your **Client ID** - copy it
3. Under **"Client Secret"**, click **"Reset Secret"** if needed, then copy it
4. **⚠️ Save these somewhere safe!**

## Step 3: Set Up Redirect URI

1. Still in **OAuth2** section
2. Scroll down to **"Redirects"**
3. Click **"Add Redirect"**
4. Add this URL: `http://localhost:3000/api/auth/callback/discord`
5. Click **"Save Changes"**

## Step 4: Update Your .env.local File

1. Open the file: `C:\Users\ender\Music\fakevouch\.env.local`
2. Replace the placeholder values:

```env
DISCORD_CLIENT_ID=your_actual_client_id_here
DISCORD_CLIENT_SECRET=your_actual_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret
```

## Step 5: Generate NEXTAUTH_SECRET

**Option 1 - Using OpenSSL (if installed):**
```powershell
openssl rand -base64 32
```

**Option 2 - Using Node.js:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3 - Online generator:**
- Go to: https://generate-secret.vercel.app/32
- Copy the generated secret

## Step 6: Restart Your Server

After updating `.env.local`, restart your development server:

1. Stop the server (Ctrl+C)
2. Run `npm run dev` again

## ✅ Test

1. Go to http://localhost:3000
2. Click "Login with Discord"
3. You should be redirected to Discord login page
4. After logging in, you'll be redirected back to your dashboard

## Troubleshooting

**Error: "client_id is required"**
- Make sure `.env.local` exists in the project root
- Check that `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` are set correctly
- Restart the dev server after updating `.env.local`

**Error: "NO_SECRET"**
- Make sure `NEXTAUTH_SECRET` is set in `.env.local`
- It should be a random string (use one of the methods above)

**OAuth Error**
- Double-check the redirect URI in Discord Developer Portal matches exactly: `http://localhost:3000/api/auth/callback/discord`
- Make sure there are no extra spaces in your `.env.local` file

