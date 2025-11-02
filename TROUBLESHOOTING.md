# 🔧 Troubleshooting Discord Vouch Sending

## Common Issues and Fixes

### All Vouches Failing

#### 1. **Check Your Bot Token**
- Make sure the bot token is correct
- Remove any spaces or newlines from the token
- Don't include "Bot " prefix (it's added automatically)
- Token format should be: `ABC123xyz...` (long alphanumeric string)

#### 2. **Check Channel ID**
- Right-click the Discord channel → "Copy ID"
- Make sure you're copying the channel ID, not a message ID
- Enable Developer Mode in Discord if you can't see "Copy ID"

#### 3. **Bot Permissions**
Your bot needs these permissions in the channel/server:
- ✅ **Send Messages** (required)
- ✅ **Embed Links** (required for embeds)
- ✅ **Read Message History** (recommended)

**How to fix permissions:**
1. Go to your Discord server settings
2. Click "Integrations" → "Bots"
3. Find your bot
4. Click "Manage" and enable the permissions above
5. Make sure the bot has permission in the specific channel too

#### 4. **Bot is Not in Server**
- Make sure your bot is added to the Discord server
- The bot needs to be a member of the server where the channel is located

#### 5. **Check Error Messages**
- Look at the error messages in the results section
- Common errors:
  - `401 Unauthorized` → Invalid bot token
  - `403 Forbidden` → Bot lacks permissions
  - `404 Not Found` → Invalid channel ID
  - `Missing Permissions` → Bot can't send messages

#### 6. **Rate Limiting**
- Discord has rate limits (50 messages per second per channel)
- If you're sending too fast, increase the delay
- Recommended delay: 1-2 seconds minimum

#### 7. **Test the Bot Token**
You can test if your bot token works by:
1. Using a Discord bot tester tool
2. Checking if the bot appears online in Discord
3. Trying to send a message manually with the bot

### Debugging Steps

1. **Start Small**
   - Try sending just 1 vouch first
   - Use a delay of 2-3 seconds
   - Check if it works before sending many

2. **Check Console**
   - Open browser DevTools (F12)
   - Check the Console tab for errors
   - Look at Network tab to see API responses

3. **Verify Setup**
   - Bot token is correct ✅
   - Channel ID is correct ✅
   - Bot is in the server ✅
   - Bot has permissions ✅
   - Channel exists ✅

### Still Not Working?

If vouches are still failing:
1. Check the browser console for detailed error messages
2. Try with a different channel ID
3. Verify the bot token in Discord Developer Portal
4. Make sure the bot is online and active

### Getting Help

If you see a specific error message, note it down and check:
- The error code (401, 403, 404, etc.)
- The error message text
- Which vouch number failed

