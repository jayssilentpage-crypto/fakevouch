# 🤖 Bot Setup Instructions

## Important: You Need to Add the Bot Token

The website uses a pre-configured bot, but you need to add the bot token to your `.env.local` file.

### Steps:

1. **Get the Bot Token**:
   - This bot is already created (Client ID: 1434190556023488512)
   - You need to get the bot token from your Discord Developer Portal
   - Or contact the bot owner to get the token

2. **Add to `.env.local`**:
   ```
   DISCORD_BOT_TOKEN=your_actual_bot_token_here
   ```

3. **Add Bot to Server**:
   Users can add the bot using this link:
   ```
   https://discord.com/oauth2/authorize?client_id=1434190556023488512&permissions=8&integration_type=0&scope=bot
   ```

4. **Restart Server**:
   After adding the token, restart your Next.js server.

## Bot Permissions

The bot needs:
- **Administrator** permission (permissions=8 in the invite link)
- Or at minimum: Send Messages, Embed Links, Read Message History

## For Users

Users don't need to provide their own bot token anymore. They just need to:
1. Click "Add Bot to Server" button
2. Select their server
3. Authorize the bot
4. Enter the channel ID
5. Start generating vouches!

The website is now **100% FREE** and much simpler to use! 🎉

