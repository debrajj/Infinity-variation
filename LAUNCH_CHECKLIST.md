# 🚀 Launch Checklist - Private Shopify App

Quick checklist to launch your app in 30 minutes.

---

## ⚡ Quick Start (30 minutes)

### Phase 1: Preparation (5 min)
- [ ] Shopify Partner account ready
- [ ] Development/Production store ready
- [ ] Shopify CLI installed: `npm install -g @shopify/cli @shopify/app`
- [ ] Choose hosting: Netlify or Vercel

### Phase 2: Create App (5 min)
```bash
# Login to Shopify
shopify auth login

# Create app (if not already created)
shopify app create
```

- [ ] App created in Partners Dashboard
- [ ] `shopify.app.toml` has `client_id`
- [ ] Note your Client ID and Secret

### Phase 3: Build & Deploy (10 min)

**Option A: Automated**
```bash
./deploy.sh
```

**Option B: Manual**
```bash
# Build
npm run build

# Deploy to Netlify
netlify login
netlify deploy --prod

# OR Deploy to Vercel
vercel login
vercel --prod
```

- [ ] App built successfully
- [ ] Deployed to hosting
- [ ] Deployment URL obtained (e.g., `https://your-app.netlify.app`)

### Phase 4: Configure (5 min)

1. **Update shopify.app.toml:**
```toml
application_url = "https://your-app.netlify.app"

[auth]
redirect_urls = [
  "https://your-app.netlify.app/auth/callback",
  "https://your-app.netlify.app/auth/shopify/callback"
]
```

2. **Update Partners Dashboard:**
- [ ] Go to partners.shopify.com → Apps → Your App
- [ ] Update App URL
- [ ] Update Redirect URLs
- [ ] Save changes

### Phase 5: Deploy Extension (3 min)
```bash
shopify app deploy
```

- [ ] Theme extension deployed
- [ ] App version created

### Phase 6: Install (2 min)
```bash
shopify app open
```

- [ ] App installed on store
- [ ] Can access from Shopify Admin → Apps

### Phase 7: Enable Theme Extension (5 min)

1. **Go to Theme Customizer:**
   - Shopify Admin → Online Store → Themes → Customize

2. **Add App Block:**
   - Navigate to Product page
   - Add block → Apps → Product Customizer
   - Position below product description
   - Enable and configure
   - Save

- [ ] Theme extension enabled
- [ ] Visible on product pages

---

## ✅ Verification

### Admin Panel
- [ ] Can access app from Shopify Admin
- [ ] Dashboard loads
- [ ] Can create option sets
- [ ] Can assign to products

### Storefront
- [ ] Options appear on product page
- [ ] Default Add to Cart hidden
- [ ] Custom Add to Cart works
- [ ] Price calculations correct
- [ ] Cart shows customization

### Mobile
- [ ] Admin responsive
- [ ] Storefront responsive

---

## 🎯 Quick Commands

```bash
# Build
npm run build

# Deploy (automated)
./deploy.sh

# Deploy theme extension
shopify app deploy

# Open app
shopify app open

# Check app info
shopify app info

# View versions
shopify app versions list
```

---

## 📋 URLs to Update

After deployment, update these:

1. **shopify.app.toml**
   - `application_url`
   - `redirect_urls`

2. **Partners Dashboard**
   - App URL
   - Redirect URLs

3. **Environment Variables** (in hosting platform)
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `NODE_ENV=production`

---

## 🆘 Quick Troubleshooting

### App won't install
```bash
# Check configuration
shopify app info

# Verify URLs match in:
# - shopify.app.toml
# - Partners Dashboard
```

### Theme extension not showing
```bash
# Verify deployment
shopify app versions list

# Redeploy if needed
shopify app deploy
```

### Build fails
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## 🎉 Success Criteria

You're done when:
- ✅ App accessible from Shopify Admin
- ✅ Can create and manage option sets
- ✅ Options appear on product pages
- ✅ Add to cart works with customizations
- ✅ Cart shows grouped customization
- ✅ Mobile responsive

---

## 📚 Full Documentation

For detailed instructions, see:
- **PRIVATE_APP_DEPLOYMENT.md** - Complete deployment guide
- **README.md** - App overview and features

---

**Estimated Time**: 30 minutes  
**Difficulty**: Easy  
**Cost**: Free (using free tiers)

**Let's launch! 🚀**
