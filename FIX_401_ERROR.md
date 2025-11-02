# =��� Fix 401 Unauthorized Error

## What is 401 Error?
401 Unauthorized means the Discord API rejected your bot token. This happens when:
- Bot token is missing from `.env.local`
- Bot token is incorrect/expired
- Bot token format is wrong

## Quick Fix

### Step 1: Get Your Bot Token
1. Go to https://discord.com/developers/applications
2. Find your bot application (Client ID: 1434190556023488512)
3. Go to **"Bot"** section in the left sidebar
4. Click **"Reset Token"** or **"Copy"** to get your token
5. **G��n+� Save it somewhere safe - you won't see it again!**

### Step 2: Add to `.env.local`
Open `C:\Users\ender\Music\fakevouch\.env.local` and add:

```env
DISCORD_BOT_TOKEN=your_actual_bot_token_here
```

**Important:**
- Replace `your_actual_bot_token_here` with your real token
- Don't include quotes around the token
- Don't include "Bot " prefix (it's added automatically)
- No spaces or newlines

Example:
```env
DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN_HERE_REPLACE_THIS_WITH_REAL_TOKEN
```

### Step 3: Restart Server
**CRITICAL:** After adding the token, you MUST restart your Next.js server:

```powershell
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

Environment variables are only loaded when the server starts!

## Verify It's Working

1. Make sure `.env.local` has `DISCORD_BOT_TOKEN` set
2. Restart the server
3. Try sending 1 test vouch
4. Check browser console (F12) for any errors

## Common Mistakes

G�� **Wrong:** `DISCORD_BOT_TOKEN="your_token"` (with quotes)
G�� **Right:** `DISCORD_BOT_TOKEN=your_token` (no quotes)

G�� **Wrong:** Token has spaces or newlines
G�� **Right:** Token is one continuous string

G�� **Wrong:** Forgot to restart server after adding token
G�� **Right:** Always restart after changing `.env.local`

G�� **Wrong:** Using OAuth client secret instead of bot token
G�� **Right:** Bot token is different - get it from Bot section

## Still Getting 401?

1. **Double-check token:**
   - Copy it again from Discord Developer Portal
   - Make sure you're copying the Bot Token, not Client Secret
   - Token should be ~59 characters long

2. **Check file location:**
   - `.env.local` must be in the root: `C:\Users\ender\Music\fakevouch\.env.local`
   - Not in `app/` or any subfolder

3. **Verify format:**
   ```
   DISCORD_BOT_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OTA.ABC123.XYZ789...
   ```

4. **Restart server:**
   - Stop completely (Ctrl+C)
   - Wait a few seconds
   - Start again: `npm run dev`

## Need Help?

If still not working:
1. Check server logs for error messages
2. Verify token in Discord Developer Portal
3. Make sure bot application exists and is enabled


