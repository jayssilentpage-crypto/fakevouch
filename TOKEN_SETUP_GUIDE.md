# Correct Token Setup for Netlify

## You Need TWO Different Types of Tokens

### 1. OAuth Tokens (for user login)
- **DISCORD_CLIENT_ID** - From "OAuth2" section → Copy Client ID
- **DISCORD_CLIENT_SECRET** - From "OAuth2" section → Copy Client Secret
- **Used for:** Users logging in with Discord

### 2. Bot Token (for sending vouches)
- **DISCORD_BOT_TOKEN** - From "Bot" section → Copy Token
- **Used for:** Bot sending messages to Discord channels

## Get Your Bot Token

✅ Go to: https://discord.com/developers/applications → Your App → **"Bot"** section → Copy Token

⚠️ **Do NOT use the OAuth Client Secret** - you need the Bot Token from the "Bot" section!

Bot tokens typically:
- Are 59+ characters long
- Contain dots (`.`) in them
- Start with something like `MTIzNDU2...`

## Netlify Environment Variables Setup

Go to **Netlify Dashboard → Your Site → Site settings → Environment variables** and set:

### Required Variables:

1. **DISCORD_CLIENT_ID**
   - Go to: Discord Developer Portal → OAuth2 section → Copy "Client ID"

2. **DISCORD_CLIENT_SECRET**
   - Go to: OAuth2 section → Copy "Client Secret"
   - Used for: User login authentication

3. **DISCORD_BOT_TOKEN** ⚠️ THIS IS THE IMPORTANT ONE
   - Go to: Discord Developer Portal → Click "Bot" (NOT OAuth2!)
   - Copy the token from the "Token" section
   - Format: Starts with something like `MTIzNDU2...` and contains dots (`.`)
   - Used for: Bot sending vouches

4. **NEXTAUTH_SECRET**
   - Random secret (32+ characters)

5. **NEXTAUTH_URL**
   - Your Netlify site URL
   - Example: `https://fakevouch.netlify.app`

## Summary

- **OAuth tokens** (CLIENT_ID, CLIENT_SECRET) = For users to log in
- **Bot token** (DISCORD_BOT_TOKEN) = For bot to send vouches
- **You need BOTH, but they're different!**

Get your bot token from Discord Developer Portal → Your App → Bot section ✅
