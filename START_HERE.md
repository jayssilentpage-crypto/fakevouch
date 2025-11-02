# 🚀 How to Run Your Website

## Quick Start

1. **Open Terminal/PowerShell** and navigate to the project:
   ```powershell
   cd C:\Users\ender\Music\fakevouch
   ```

2. **Install Dependencies** (first time only):
   ```powershell
   npm install
   ```

3. **Set up Discord OAuth**:
   - Go to https://discord.com/developers/applications
   - Create a new application
   - Go to OAuth2 → Add Redirect URI: `http://localhost:3000/api/auth/callback/discord`
   - Copy your Client ID and Client Secret

4. **Create `.env.local` file** in the project folder:
   ```
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_CLIENT_SECRET=your_client_secret_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_here
   ```
   Generate NEXTAUTH_SECRET with: `openssl rand -base64 32`

5. **Start the Development Server**:
   ```powershell
   npm run dev
   ```

6. **Open Your Browser**:
   - Go to: http://localhost:3000
   - You should see the FakeVouch.xyz homepage!

## What Happens After Login?

- Users login with Discord OAuth
- They are redirected to the **Dashboard** (`/dashboard`)
- The dashboard includes:
  - Welcome message
  - Vouch generator form
  - Statistics panel
  - Recent vouches history
  - Quick actions

## Project Location

All files are in: `C:\Users\ender\Music\fakevouch`

## Need Help?

- Check `README.md` for more detailed setup instructions
- Add your vouch generation code in `app/dashboard/page.tsx` (handleGenerate function)

