# Bot Has Admin But Still Getting 403 Error

## Common Causes (Even with Admin Permissions)

Even when your bot has Administrator permissions, you can still get 403 errors. Here's why:

### 1. **Channel Permission Overwrites** (Most Common!)

Channel-specific permission overwrites can block the bot even with Admin:

1. **Check the Channel:**
   - Right-click the channel → **"Edit Channel"**
   - Go to **"Permissions"** tab
   - Look for your bot's role or the bot itself in the permissions list

2. **Fix:**
   - If the bot/role is listed, check that it has **"Send Messages"** enabled
   - If there are **red X marks** blocking permissions, click them to enable
   - **Delete any permission overwrites** that explicitly deny the bot
   - Or add an overwrite that **explicitly allows** the bot

### 2. **Category Permissions**

If your channel is in a category, category permissions override server permissions:

1. **Check the Category:**
   - Right-click the **category** (the folder containing channels)
   - Select **"Edit Category"**
   - Go to **"Permissions"** tab
   - Check if bot's role has permissions here

2. **Fix:**
   - Ensure bot's role has all permissions enabled at category level
   - Or move the channel out of the category

### 3. **Bot Role Position**

The bot's role must be **higher** than the channel or category:

1. **Check Role Hierarchy:**
   - Server Settings → **Roles**
   - Your bot's role should be **near the top** (drag it up if needed)
   - It must be **above** any roles/channels it needs to interact with

2. **Fix:**
   - Drag bot's role to the top (below only @everyone)
   - Save changes

### 4. **Channel Visibility**

The bot might not be able to "see" the channel:

1. **Check Channel Settings:**
   - Channel Settings → **Permissions**
   - Make sure bot's role has **"View Channel"** enabled
   - Check category permissions too

### 5. **Wrong Channel ID**

Double-check you're using the correct channel ID:

1. **Verify Channel ID:**
   - Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
   - Right-click the channel → **"Copy ID"**
   - Compare with the ID you're using in the app

2. **Make Sure:**
   - The channel ID is the **channel where you want vouches**
   - Not a category ID or server ID
   - Not a different channel

### 6. **Bot Not Actually in Server**

The bot might have been removed:

1. **Verify Bot is in Server:**
   - Go to your server
   - Check Members list for your bot
   - If missing, re-invite it

## Step-by-Step Fix (Try This Order)

### Step 1: Check Channel Permissions
```
1. Right-click channel → Edit Channel → Permissions
2. Find your bot's role
3. Enable ALL permissions (or ensure nothing is denied)
4. Save changes
```

### Step 2: Check Category (if channel is in one)
```
1. Right-click category → Edit Category → Permissions  
2. Ensure bot role has all permissions
3. Save changes
```

### Step 3: Move Bot Role Higher
```
1. Server Settings → Roles
2. Drag bot role near the top
3. Save changes
```

### Step 4: Verify Channel ID
```
1. Enable Developer Mode
2. Right-click channel → Copy ID
3. Use that exact ID in your app
```

### Step 5: Test with Simple Message
Try sending a test message manually (if your bot has a command) to verify it can access the channel.

## Debug: Check Discord Error Code

The improved error handling will now show you the specific Discord error code. Common codes:

- **50013** - Missing Permissions (check channel overwrites)
- **50001** - Missing Access (channel/category visibility issue)
- **10003** - Unknown Channel (wrong channel ID)

## Quick Test

1. **Create a new test channel**
2. **Don't modify any permissions** (use default)
3. **Copy that channel's ID**
4. **Try sending vouches to that channel**
5. If it works → the issue is with your original channel's permissions

## Still Not Working?

### Check These:
- [ ] Bot role is high enough in hierarchy
- [ ] No channel permission overwrites blocking bot
- [ ] No category permission overwrites blocking bot  
- [ ] Channel ID is correct
- [ ] Bot is actually in the server
- [ ] Channel is visible (not hidden from bot)
- [ ] Try a different channel to test

### If All Else Fails:
1. **Remove all permission overwrites** for that channel
2. **Move channel out of category** (if it's in one)
3. **Re-invite bot** (fresh invite with Admin)
4. **Test in a brand new channel** with default permissions

