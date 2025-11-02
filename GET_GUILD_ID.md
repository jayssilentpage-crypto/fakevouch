# 🔍 How to Get Discord Guild (Server) ID

To enable auto-joining Discord server on login, you need to add the Guild ID to your `.env.local` file.

## Method 1: Using Developer Mode (Easiest)

1. **Enable Developer Mode:**
   - Open Discord
   - Go to Settings → Advanced
   - Enable "Developer Mode"

2. **Get Server ID:**
   - Right-click on your Discord server name (in the left sidebar)
   - Click "Copy Server ID"
   - That's your Guild ID!

3. **Add to `.env.local`:**
   ```
   DISCORD_GUILD_ID=paste_your_server_id_here
   ```

## Method 2: Using Discord Invite

1. Go to: https://discord.gg/kGQMr9T6RR
2. Accept the invite
3. Enable Developer Mode (Settings → Advanced)
4. Right-click server name → Copy Server ID
5. Add to `.env.local`

## Method 3: Using Discord API

If you have the bot token, you can use:
```
curl -H "Authorization: Bot YOUR_BOT_TOKEN" https://discord.com/api/v10/invites/kGQMr9T6RR
```

Look for `guild.id` in the response.

## After Adding Guild ID

1. Save `.env.local`
2. **Restart your server** (important!)
3. Users will automatically join your Discord server when they log in!

## Troubleshooting

- If users don't auto-join: Check that `DISCORD_GUILD_ID` is set correctly
- Make sure bot has "Create Instant Invite" permission in the server
- The bot token must be valid and the bot must be in the server

