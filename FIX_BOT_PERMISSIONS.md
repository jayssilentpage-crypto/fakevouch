# Fix "Bot Lacks Permissions" Error

## Problem
You're getting: **"Connection failed: Forbidden - Bot lacks permissions"**

Even though the bot is in the server, it doesn't have the necessary permissions to send messages to the channel.

## Required Bot Permissions

Your bot needs these permissions to send vouches:

### Minimum Required:
- ✅ **View Channels** - Bot must be able to see the channel
- ✅ **Send Messages** - Bot must be able to send messages
- ✅ **Embed Links** - Bot must be able to send embeds (vouches are embedded messages)

### Recommended (for full functionality):
- ✅ **Read Message History** - Often required by Discord
- ✅ **Use External Emojis** - If your vouches use custom emojis

### Optional but helpful:
- ✅ **Attach Files** - If you want to send images later
- ✅ **Manage Messages** - If you want to edit/delete vouches later

## How to Fix Bot Permissions

### Method 1: Re-invite Bot with Correct Permissions (Recommended)

1. **Go to Discord Developer Portal**
   - Visit: https://discord.com/developers/applications
   - Select your application

2. **Generate Invite URL**
   - Click **"OAuth2"** in left sidebar
   - Click **"URL Generator"** 
   - Under **"Scopes"**, check:
     - ✅ `bot`
   - Under **"Bot Permissions"**, check:
     - ✅ **View Channels**
     - ✅ **Send Messages**
     - ✅ **Embed Links**
     - ✅ **Read Message History**
     - (Optional) ✅ **Use External Emojis**

3. **Copy the Generated URL**
   - Scroll down to see the generated URL
   - Copy it (looks like: `https://discord.com/api/oauth2/authorize?...`)

4. **Re-invite the Bot**
   - Open the URL in your browser
   - Select your Discord server
   - Click **"Authorize"**
   - Discord will add the bot with the new permissions

### Method 2: Update Server Role Permissions

1. **Go to Your Discord Server**
   - Right-click your server name → **"Server Settings"**

2. **Navigate to Roles**
   - Click **"Roles"** in left sidebar
   - Find your bot's role (usually named after the bot)

3. **Enable Permissions**
   - Scroll down to **"Text Channel Permissions"**
   - Enable:
     - ✅ **View Channels**
     - ✅ **Send Messages**
     - ✅ **Embed Links**
     - ✅ **Read Message History**

4. **Save Changes**
   - Click **"Save Changes"** at the bottom

5. **Check Channel-Specific Permissions**
   - Go to the specific channel where you want vouches
   - Right-click channel → **"Edit Channel"** → **"Permissions"**
   - Find your bot's role
   - Make sure it has the same permissions enabled

### Method 3: Give Bot Administrator (Quick Fix)

⚠️ **Only if you trust the bot completely!**

1. In Discord Server Settings → Roles
2. Find your bot's role
3. Enable **"Administrator"** permission
4. Save changes

This gives all permissions but is less secure.

## Verify Permissions

After updating permissions:

1. **Test in Discord**
   - Try having the bot send a message manually (if possible)
   - Or use a test command if your bot has commands

2. **Check Bot Role Position**
   - Make sure bot's role is **above** the role of the users/channels you want to interact with
   - Discord processes permissions top-to-bottom

3. **Check Channel Overwrites**
   - Go to channel settings → Permissions
   - Make sure there are no permission overwrites blocking the bot

## Common Issues

### ❌ "Bot is in server but can't see channel"
- **Fix:** Enable "View Channels" permission
- **Also:** Check if channel is visible to @everyone role

### ❌ "Bot can see channel but can't send messages"
- **Fix:** Enable "Send Messages" permission
- **Also:** Check channel-specific permission overwrites

### ❌ "Messages send but embeds don't appear"
- **Fix:** Enable "Embed Links" permission

### ❌ "Works in some channels but not others"
- **Fix:** Check channel-specific permission overwrites
- Each channel can override role permissions

## Quick Permission Checklist

- [ ] Bot role has "View Channels" ✅
- [ ] Bot role has "Send Messages" ✅
- [ ] Bot role has "Embed Links" ✅
- [ ] Bot role has "Read Message History" ✅
- [ ] Bot role position is high enough (above other roles if needed)
- [ ] No channel permission overwrites blocking the bot
- [ ] Bot is actually in the server
- [ ] Channel ID is correct in your app

## Test After Fixing

1. Go back to your website
2. Try sending a single vouch
3. Check the Discord channel
4. If it works, you're all set! 🎉

If you still get errors, check:
- The channel ID is correct
- The bot token is correct in Netlify environment variables
- The bot hasn't been kicked/banned from the server

