# Fix Custom Domain (fakevouch.xyz) Setup

## Problem
Your custom domain `fakevouch.xyz` is showing "connection timeout" but the Netlify subdomain works.

## Solution: Configure Domain in Netlify

### Step 1: Add Domain to Netlify

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Select your site

2. **Go to Domain Settings**
   - Click **"Domain settings"** in the top navigation
   - Or: Site settings → **"Domains"**

3. **Add Custom Domain**
   - Click **"Add custom domain"**
   - Enter: `fakevouch.xyz`
   - Click **"Verify"**

### Step 2: Configure DNS Records

Netlify will show you what DNS records to add. You need to add these at your domain registrar (where you bought fakevouch.xyz).

#### Option A: Use Netlify Nameservers (Easiest - Recommended)

1. **Get Netlify Nameservers**
   - In Netlify Domain settings, look for "Netlify DNS" section
   - Copy the nameserver addresses (they look like: `dns1.p01.nsone.net`, `dns2.p01.nsone.net`, etc.)

2. **Update at Your Domain Registrar**
   - Go to where you bought fakevouch.xyz (GoDaddy, Namecheap, Cloudflare, etc.)
   - Find DNS/Nameserver settings
   - Replace existing nameservers with Netlify's nameservers
   - Save changes

3. **Wait for Propagation**
   - DNS changes can take 24-48 hours (usually 1-2 hours)
   - Netlify will automatically detect when DNS is configured

#### Option B: Use DNS Records (Keep Your Current Nameservers)

If you want to keep your current nameservers (e.g., Cloudflare), add these DNS records:

1. **Get DNS Records from Netlify**
   - In Domain settings, Netlify will show you required DNS records
   - Usually something like:
     - **A Record**: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     - **CNAME Record**: `www.fakevouch.xyz` → `your-site.netlify.app`

2. **Add Records at Your DNS Provider**
   - Go to your DNS provider (Cloudflare, etc.)
   - Add the A records for root domain (@)
   - Add CNAME for www subdomain
   - Save changes

### Step 3: Enable HTTPS (SSL Certificate)

Netlify automatically provisions SSL certificates, but you need to enable it:

1. **In Netlify Domain Settings**
   - Find your domain `fakevouch.xyz`
   - Enable **"HTTPS"** / **"Force HTTPS"**
   - Netlify will automatically generate a certificate (may take a few minutes)

### Step 4: Verify DNS Propagation

Check if DNS is configured correctly:

1. **Use DNS Checker**
   - Visit: https://dnschecker.org
   - Enter: `fakevouch.xyz`
   - Select record type: **A** or **CNAME**
   - Check if it shows Netlify's IP addresses

2. **Check in Netlify**
   - Netlify Domain settings will show status:
   - ✅ Green checkmark = Configured correctly
   - ⚠️ Warning = Still propagating or misconfigured

## Common Issues

### ❌ "DNS Not Configured"
- **Fix:** Make sure you added the DNS records correctly at your registrar
- **Check:** Use DNS checker to verify records are propagated

### ❌ "Certificate Provisioning"
- **Fix:** Wait a few minutes, Netlify automatically generates SSL certificates
- **Check:** Make sure domain DNS is correctly configured first

### ❌ "Connection Timeout"
- **Fix:** DNS hasn't propagated yet, wait 1-24 hours
- **Check:** Verify DNS records are correct using DNS checker

### ❌ Domain Points to Wrong Place
- **Fix:** Clear DNS cache, wait for propagation
- **Check:** Use `dig fakevouch.xyz` or `nslookup fakevouch.xyz` to verify

## Quick Checklist

- [ ] Added domain `fakevouch.xyz` in Netlify Domain settings
- [ ] Updated DNS records (nameservers or A/CNAME records)
- [ ] Waited for DNS propagation (can take up to 48 hours, usually 1-2 hours)
- [ ] Enabled HTTPS/SSL in Netlify
- [ ] Verified DNS using DNS checker tool

## After Setup

Once DNS propagates:
- `fakevouch.xyz` should work
- `www.fakevouch.xyz` should redirect to `fakevouch.xyz`
- HTTPS should be enabled automatically

## Need Help?

If still not working after 24 hours:
1. Check DNS propagation status: https://dnschecker.org
2. Verify records in Netlify Domain settings
3. Check Netlify build logs for domain-related errors
4. Contact Netlify support if DNS is correct but domain still doesn't work

