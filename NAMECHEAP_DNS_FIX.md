# Fix Namecheap DNS for fakevouch.xyz

## Verify DNS Records in Namecheap

### Step 1: Check What Netlify Expects

1. **Go to Netlify Dashboard**
   - https://app.netlify.com → Your Site → Domain settings
   - Find `fakevouch.xyz` in the domain list
   - Click on it to see DNS configuration details

### Step 2: Required DNS Records for Namecheap

You need these records at Namecheap:

#### For Root Domain (fakevouch.xyz):

**A Record:**
- **Host:** `@` or leave blank (for root domain)
- **Type:** `A`
- **Value:** One of Netlify's IP addresses:
  - `185.199.108.153`
  - `185.199.109.153`  
  - `185.199.110.153`
  - `185.199.111.153`
- **TTL:** `Automatic` or `3600`

**OR Use CNAME (Alternative):**
- **Host:** `@`
- **Type:** `CNAME`
- **Value:** `your-site-name.netlify.app` (replace with your actual Netlify site name)

#### For WWW Subdomain:

**CNAME Record:**
- **Host:** `www`
- **Type:** `CNAME`
- **Value:** `your-site-name.netlify.app` (your actual Netlify site)

### Step 3: Check Your Current Namecheap DNS

1. **Log into Namecheap**
   - Go to: https://www.namecheap.com
   - Sign in → **Domain List** → Click **Manage** next to fakevouch.xyz

2. **Go to Advanced DNS**
   - Click **"Advanced DNS"** tab
   - Check your current records

### Step 4: Common Issues

#### ❌ Issue: Using Wrong IP Addresses
- **Fix:** Use Netlify's IP addresses shown above, or use CNAME to your Netlify site

#### ❌ Issue: Wrong Host Value
- **Root domain:** Use `@` or leave blank
- **www:** Use exactly `www`

#### ❌ Issue: DNS Not Propagated
- **Check:** Visit https://dnschecker.org
- Enter `fakevouch.xyz`, check A record
- Should show Netlify IPs (185.199.108.x)
- If showing different IPs or NXDOMAIN, DNS not propagated yet

#### ❌ Issue: Nameservers Still at Namecheap
- If you're using A records, keep Namecheap nameservers (default)
- If you switched to Netlify nameservers, DNS records at Namecheap won't work

#### ❌ Issue: Domain Not Added in Netlify
- Make sure `fakevouch.xyz` is added in Netlify Domain settings
- Netlify needs to know about the domain

### Step 5: Recommended Setup for Namecheap

**Best Option - Use CNAME for Root (if Namecheap supports it):**

1. In Namecheap Advanced DNS:
   - **Delete** any existing A records for `@`
   - **Add CNAME Record:**
     - Host: `@`
     - Value: `your-site-name.netlify.app`
   - **Add CNAME Record:**
     - Host: `www`
     - Value: `your-site-name.netlify.app`

**Alternative - Use A Records:**

1. In Namecheap Advanced DNS:
   - **Delete** any CNAME for `@` (can't have both)
   - **Add A Record:**
     - Host: `@`
     - Value: `185.199.108.153`
   - **Add A Record:**
     - Host: `@`
     - Value: `185.199.109.153`
   - **Add A Record:**
     - Host: `@`
     - Value: `185.199.110.153`
   - **Add A Record:**
     - Host: `@`
     - Value: `185.199.111.153`
   - **Add CNAME Record:**
     - Host: `www`
     - Value: `your-site-name.netlify.app`

### Step 6: Verify in Netlify

1. Go to Netlify → Domain settings → fakevouch.xyz
2. Check status:
   - ✅ Green checkmark = DNS configured correctly
   - ⚠️ Yellow warning = DNS not propagated or misconfigured
   - ❌ Red error = DNS incorrect

### Step 7: Wait for Propagation

- DNS changes can take **1-48 hours** to propagate globally
- Usually works within **1-2 hours**
- Use https://dnschecker.org to monitor propagation

### Step 8: Force SSL Certificate

1. In Netlify Domain settings
2. Find `fakevouch.xyz`
3. Enable **"Force HTTPS"** / **"HTTPS"**
4. Netlify will auto-generate SSL certificate (may take a few minutes)

## Troubleshooting Steps

1. **Verify Domain is Added in Netlify**
   - Netlify Dashboard → Domain settings
   - Should see `fakevouch.xyz` listed

2. **Check DNS Records Match**
   - Namecheap Advanced DNS should match what Netlify expects
   - Use CNAME to Netlify site OR A records to Netlify IPs

3. **Wait for Propagation**
   - Check with: https://dnschecker.org
   - Should show Netlify IPs globally

4. **Clear Browser Cache**
   - DNS might be cached in your browser/computer
   - Try incognito/private window

5. **Check Netlify Status**
   - Netlify Domain settings should show domain status
   - SSL certificate status

## Still Not Working?

If DNS is correct but still timing out after 24 hours:

1. **Check Netlify Build Logs** - Make sure site is deployed
2. **Verify Netlify Site URL** - Make sure your Netlify site itself works
3. **Contact Netlify Support** - They can check domain configuration on their end

## Quick Checklist

- [ ] Domain `fakevouch.xyz` added in Netlify Domain settings
- [ ] DNS records added in Namecheap Advanced DNS
- [ ] DNS records match Netlify requirements
- [ ] Waited at least 1 hour for DNS propagation
- [ ] Checked DNS propagation at dnschecker.org
- [ ] HTTPS/SSL enabled in Netlify
- [ ] Netlify shows green checkmark for domain

