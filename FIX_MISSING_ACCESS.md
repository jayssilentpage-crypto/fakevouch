# Fix "Missing Access" Error - Make Bot Work for All Servers

## Problem
Getting **"Missing Access"** error (Discord error code 50001) means the bot cannot access the channel/server.

## Root Cause
The bot must be **invited to each Discord server** where you want to send vouches. Even with the bot token, Discord requires the bot to be a member of the server.

## Solution: Invite Bot to Every Server

### Step 1: Get Your Bot Invite URL

1. **Go to Discord Developer Portal**
   - Visit: https://discord.com/developers/applications
   - Select your application

2. **Generate Invite Link**
   - Click **"OAuth2"** → **"URL Generator"**
   - Under **"Scopes"**, check:
     - ✅ `bot`
   - Under **"Bot Permissions"**, check:
     - ✅ **Administrator** (recommended - gives all permissions)
     - OR select these individually:
       - ✅ View Channels
       - ✅ Send Messages
       - ✅ Embed Links
       - ✅ Read Message History
   - **Copy the generated URL** (looks like: `https://discord.com/api/oauth2/authorize?...`)

3. **Save this URL** - You'll need to use it for every server!

### Step 2: Invite Bot to Each Server

For **EVERY Discord server** where you want to send vouches:

1. **Open the invite URL** in your browser
2. **Select the Discord server** from the dropdown
3. **Click "Authorize"**
4. **Verify the bot appears** in the server's member list

### Step 3: Verify Bot Token in Netlify

The bot token must be set in Netlify for it to work:

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Select your site

2. **Check Environment Variables**
   - Go to **Site settings** → **Environment variables**
   - Verify `DISCORD_BOT_TOKEN` is set
   - Make sure it's the **correct token** (not expired, not from a different bot)

3. **If Missing, Add It:**
   - Click **"Add variable"**
   - Key: `DISCORD_BOT_TOKEN`
   - Value: Your bot token (from Discord Developer Portal → Bot section)
   - Click **"Save"**

4. **Redeploy**
   - After adding/updating the token, redeploy:
   - Go to **Deploys** → **Trigger deploy** → **Deploy site**

## Quick Checklist for Each Server

Before sending vouches to a server, verify:

- [ ] Bot is invited to the server (appears in member list)
- [ ] Bot has permissions (Administrator or required permissions)
- [ ] Bot role is high enough in hierarchy (not below other roles)
- [ ] Channel is visible to bot (no permission overwrites blocking it)
- [ ] Channel ID is correct (copy it fresh with Developer Mode)

## How to Make It Work for ALL Servers

### Option 1: Single Bot for All Servers (Recommended)

**Use ONE bot and invite it to ALL servers where users want vouches:**

1. **One Bot Token** - Set `DISCORD_BOT_TOKEN` in Netlify (this is shared)
2. **Invite Bot to Each Server** - Users/admin of each server must invite your bot
3. **Universal Access** - Your bot can then send vouches to any server it's in

**Advantages:**
- Single bot token to manage
- Works everywhere bot is invited
- Easy to maintain

**Disadvantages:**
- Each server owner must invite your bot
- You manage one bot across all servers

### Option 2: Multiple Bots (Not Recommended)

You could create separate bots for each server, but this is complex:
- Multiple bot tokens to manage
- Multiple Netlify environment variables needed
- Harder to maintain

## For Server Owners/Admins

If you're a server admin and want to use this service:

1. **Invite the Bot**
   - Get the bot invite URL from the service provider
   - Open it and authorize for your server
   - Give it Administrator permissions (or required permissions)

2. **Get Your Channel ID**
   - Enable Developer Mode (User Settings → Advanced → Developer Mode)
   - Right-click the channel → **"Copy ID"**
   - Use this ID in the vouch generator

3. **Test**
   - Try sending 1 test vouch
   - If it works, you're all set!

## Troubleshooting "Missing Access"

### Issue: Bot is in server but still getting "Missing Access"

**Check:**
1. **Channel Permissions**
   - Right-click channel → Edit Channel → Permissions
   - Ensure bot role can **View Channel**

2. **Category Permissions** (if channel is in a category)
   - Right-click category → Edit Category → Permissions
   - Ensure bot role has permissions

3. **Bot Role Position**
   - Server Settings → Roles
   - Bot role should be near the top

4. **Verify Bot Token**
   - Check Netlify environment variables
   - Make sure token matches the bot that's in the server
   - Bot token from Developer Portal → Bot section

### Issue: Works locally but not on Netlify

**Common Causes:**
1. **Bot token not set in Netlify**
   - Add `DISCORD_BOT_TOKEN` to Netlify environment variables

2. **Wrong bot token**
   - Token in Netlify doesn't match the bot in the server
   - Get fresh token from Discord Developer Portal

3. **Token expired**
   - If token was reset, update it in Netlify

4. **Need to redeploy**
   - After changing environment variables, redeploy site

## Testing

1. **Verify Bot is in Server**
   - Go to Discord server
   - Check Members list
   - Bot should be visible

2. **Test Bot Permissions**
   - Try to manually send a message as the bot (if you have a test command)
   - Or check if bot appears when you mention it

3. **Test Sending Vouches**
   - Go to your website
   - Enter channel ID
   - Send 1 test vouch
   - Check if it appears in Discord

## Important Notes

- **One Bot = All Servers**: You only need ONE bot, but it must be invited to EACH server
- **Bot Token is Global**: The bot token works for all servers the bot is in
- **Invite Required**: Each server owner must invite the bot separately
- **Permissions Matter**: Bot needs permissions in each server

## Summary

To make it work for all servers:
1. ✅ Set `DISCORD_BOT_TOKEN` in Netlify (once)
2. ✅ Get bot invite URL from Developer Portal
3. ✅ Invite bot to each server where vouches are needed
4. ✅ Give bot Administrator or required permissions
5. ✅ Done! Bot can now send vouches to any server it's in

The bot will work for **any server** where it's been invited and has proper permissions!

