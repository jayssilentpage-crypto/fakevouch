# Troubleshooting NextAuth Server Error on Netlify

## Step 1: Check Netlify Build Logs

1. Go to your Netlify dashboard
2. Click on your latest deploy
3. Check the **Build logs** for any error messages
4. Look for warnings about missing environment variables

## Step 2: Verify Environment Variables

Make sure ALL of these are set in **Netlify Dashboard → Site settings → Environment variables**:

### ✅ Required Variables:

1. **DISCORD_CLIENT_ID**
   - Get from: https://discord.com/developers/applications
   - Go to your app → OAuth2 → Copy "Client ID"

2. **DISCORD_CLIENT_SECRET**
   - Get from: https://discord.com/developers/applications
   - Go to your app → OAuth2 → Click "Reset Secret" or "Copy"
   - ⚠️ Make sure you copy the **Client Secret**, not the Bot Token

3. **NEXTAUTH_SECRET**
   - Must be a random string (32+ characters)
   - Generate with: PowerShell command (see NETLIFY_ENV_SETUP.md)
   - Example: `//n9iwZsbNIaKMjLwC4TkaTWeyfmMDGmmKFKRz6I6M8=`

4. **NEXTAUTH_URL**
   - **CRITICAL:** Must match your Netlify site URL exactly
   - Format: `https://your-site-name.netlify.app`
   - **NO trailing slash!**
   - Example: `https://fakevouch.netlify.app` ✅
   - Wrong: `https://fakevouch.netlify.app/` ❌

### 🔍 How to Find Your Netlify URL:

1. Go to Netlify Dashboard
2. Click on your site
3. Look at the top - it shows: `https://your-site-name.netlify.app`
4. Copy that **exact URL** (without trailing slash)

## Step 3: Verify Discord OAuth Redirect URI

1. Go to: https://discord.com/developers/applications
2. Select your application
3. Go to **OAuth2** → **General**
4. In **Redirects**, make sure you have:
   ```
   https://your-site-name.netlify.app/api/auth/callback/discord
   ```
   **Replace `your-site-name` with your actual Netlify site name!**

5. Click **Save Changes**

## Step 4: Common Issues & Solutions

### Issue: "Server error" when clicking login

**Possible causes:**

1. **Missing NEXTAUTH_SECRET**
   - ❌ Most common cause!
   - ✅ Fix: Add `NEXTAUTH_SECRET` to Netlify environment variables

2. **Wrong NEXTAUTH_URL**
   - ❌ URL doesn't match your Netlify site
   - ❌ Has trailing slash
   - ❌ Uses `http://` instead of `https://`
   - ✅ Fix: Set exact URL without trailing slash

3. **Missing Discord credentials**
   - ❌ `DISCORD_CLIENT_ID` or `DISCORD_CLIENT_SECRET` not set
   - ✅ Fix: Add both to Netlify environment variables

4. **Discord redirect URI mismatch**
   - ❌ Discord redirect URI doesn't match Netlify URL
   - ✅ Fix: Update Discord OAuth2 redirect URI

### Issue: "Invalid redirect URI"

- The redirect URI in Discord doesn't match your Netlify URL
- Make sure it's exactly: `https://your-site.netlify.app/api/auth/callback/discord`

### Issue: Build succeeds but login fails

- Environment variables are set but not being read
- **Fix:** After adding variables, you MUST redeploy:
  - Go to **Deploys** → **Trigger deploy** → **Deploy site**

## Step 5: Test Environment Variables

After setting variables, check Netlify build logs for:
- ✅ No warnings about missing variables
- ✅ Check that variables are being used (logs will show if they're missing)

## Step 6: Clear Cache and Redeploy

1. In Netlify dashboard
2. Go to **Deploys**
3. Click **Trigger deploy** → **Clear cache and deploy site**

## Still Not Working?

### Check the actual error:
1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Try to login
4. Look for any error messages

### Check Netlify Function Logs:
1. Go to Netlify Dashboard
2. Click **Functions** (if available)
3. Check for any error logs

### Enable Debug Mode (temporarily):
Add this to Netlify environment variables:
- `NODE_ENV` = `development` (temporarily, for debugging)
- This will show more detailed error messages

## Quick Checklist

- [ ] `DISCORD_CLIENT_ID` is set in Netlify
- [ ] `DISCORD_CLIENT_SECRET` is set in Netlify (NOT the bot token!)
- [ ] `NEXTAUTH_SECRET` is set (32+ character random string)
- [ ] `NEXTAUTH_URL` matches your Netlify site URL exactly (no trailing slash)
- [ ] Discord OAuth2 redirect URI includes your Netlify URL
- [ ] Site has been redeployed after adding variables
- [ ] No build errors in Netlify logs

