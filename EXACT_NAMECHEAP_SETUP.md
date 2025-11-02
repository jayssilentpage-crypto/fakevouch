# Exact Namecheap DNS Setup for fakevouch.xyz → fakevouch.netlify.app

## Your Setup:
- **Netlify Site:** `fakevouch.netlify.app`
- **Custom Domain:** `fakevouch.xyz`

## Step-by-Step Namecheap Configuration

### Step 1: Add Domain in Netlify (Verify First)

1. Go to: https://app.netlify.com
2. Select your site
3. Click **"Domain settings"**
4. Make sure `fakevouch.xyz` is listed
5. If not, click **"Add custom domain"** → Enter `fakevouch.xyz`

### Step 2: Exact DNS Records for Namecheap

Go to Namecheap:
1. Log in → **Domain List** → Click **"Manage"** next to `fakevouch.xyz`
2. Click **"Advanced DNS"** tab
3. **Delete ALL existing A records and CNAME records** (if any)
4. Add these EXACT records:

#### Record 1 - Root Domain (CNAME - Recommended)
- **Type:** `CNAME Record`
- **Host:** `@`
- **Value:** `fakevouch.netlify.app`
- **TTL:** `Automatic`

#### Record 2 - WWW Subdomain
- **Type:** `CNAME Record`
- **Host:** `www`
- **Value:** `fakevouch.netlify.app`
- **TTL:** `Automatic`

**OR if Namecheap doesn't support CNAME for root (@), use A Records instead:**

#### Alternative - Root Domain (A Records)
- **Type:** `A Record`
- **Host:** `@`
- **Value:** `185.199.108.153`
- **TTL:** `Automatic`

- **Type:** `A Record`
- **Host:** `@`
- **Value:** `185.199.109.153`
- **TTL:** `Automatic`

- **Type:** `A Record`
- **Host:** `@`
- **Value:** `185.199.110.153`
- **TTL:** `Automatic`

- **Type:** `A Record`
- **Host:** `@`
- **Value:** `185.199.111.153`
- **TTL:** `Automatic`

#### WWW Subdomain (CNAME)
- **Type:** `CNAME Record`
- **Host:** `www`
- **Value:** `fakevouch.netlify.app`
- **TTL:** `Automatic`

### Step 3: Verify in Netlify

1. Go to Netlify → Domain settings → `fakevouch.xyz`
2. Check status:
   - ✅ **Green checkmark** = DNS correct, just waiting for propagation
   - ⚠️ **Yellow warning** = DNS not propagated yet (wait 1-24 hours)
   - ❌ **Red error** = DNS records incorrect

### Step 4: Check DNS Propagation

Visit: https://dnschecker.org

1. Enter: `fakevouch.xyz`
2. Select: **A Record** (or CNAME if using CNAME)
3. Click **"Search"**
4. Should show Netlify IPs (`185.199.108.x`) or `fakevouch.netlify.app` globally

**If showing:**
- ✅ Netlify IPs or CNAME target = DNS configured correctly, just propagating
- ❌ Old IPs or NXDOMAIN = DNS not updated or incorrect
- ⏳ Different results in different locations = Still propagating (normal)

### Step 5: Enable HTTPS in Netlify

1. Netlify → Domain settings → `fakevouch.xyz`
2. Enable **"Force HTTPS"** / **"HTTPS"**
3. Netlify will auto-generate SSL certificate (takes a few minutes)

### Step 6: Common Issues & Fixes

#### Issue: "Connection Timeout" After DNS Added
- **Cause:** DNS not propagated yet
- **Fix:** Wait 1-24 hours, check propagation at dnschecker.org
- **Test:** Try accessing `fakevouch.xyz` from different network/device

#### Issue: Domain Not Found in Netlify
- **Fix:** Add domain in Netlify Domain settings first

#### Issue: Wrong CNAME Value
- **Must be:** `fakevouch.netlify.app` (exactly, no trailing slash)
- **NOT:** `https://fakevouch.netlify.app` or `fakevouch.netlify.app/`

#### Issue: Namecheap Shows "Invalid" for CNAME on Root
- **Fix:** Use A Records instead (see Alternative above)

#### Issue: SSL Certificate Not Working
- **Fix:** Wait for DNS to propagate first, then enable HTTPS in Netlify

### Step 7: Final Verification

After 1-24 hours:

1. **Check DNS:** https://dnschecker.org shows Netlify values globally
2. **Check Netlify:** Domain shows green checkmark
3. **Test Access:** Visit `https://fakevouch.xyz` (should work)
4. **Test HTTPS:** Should redirect to HTTPS automatically

## What You Should See

### In Namecheap Advanced DNS:
- Root domain (`@`) pointing to `fakevouch.netlify.app` (CNAME) OR Netlify IPs (A Records)
- `www` pointing to `fakevouch.netlify.app` (CNAME)

### In Netlify Domain Settings:
- `fakevouch.xyz` listed
- Status: ✅ Green checkmark (after propagation)
- HTTPS: ✅ Enabled

### When Visiting fakevouch.xyz:
- Should show your website (same as fakevouch.netlify.app)
- Should automatically use HTTPS
- Should work within 1-24 hours after DNS setup

## Still Not Working?

If DNS is correct in Namecheap and still not working after 24 hours:

1. **Verify Netlify Site Works:**
   - Test: https://fakevouch.netlify.app (should work)

2. **Check Netlify Domain Status:**
   - Netlify → Domain settings → See what error it shows

3. **Verify DNS Records:**
   - Use: https://mxtoolbox.com/dnslookup.aspx
   - Enter: `fakevouch.xyz`
   - Should show Netlify values

4. **Contact Netlify Support:**
   - If DNS is correct but domain still times out, Netlify support can investigate

## Quick Checklist

- [ ] Domain `fakevouch.xyz` added in Netlify Domain settings
- [ ] CNAME or A records added in Namecheap Advanced DNS
- [ ] Records point to `fakevouch.netlify.app` (CNAME) or Netlify IPs (A Records)
- [ ] Waited at least 1 hour for DNS propagation
- [ ] Checked DNS propagation at dnschecker.org
- [ ] HTTPS enabled in Netlify
- [ ] Netlify shows domain status (green/yellow/red)

