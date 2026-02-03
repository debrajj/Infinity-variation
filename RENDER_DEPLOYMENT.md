# 🚀 Deploy to Render - Complete Guide

Deploy your Infinite Product Options Shopify app to Render in 15 minutes.

---

## 🎯 Why Render?

- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Built-in SSL certificates
- ✅ Easy environment variables
- ✅ Auto-scaling
- ✅ Great for Node.js apps

---

## 📋 Prerequisites

- [x] Code pushed to GitHub: https://github.com/debrajj/Infinity-variation
- [ ] Render account (free): https://render.com
- [ ] Shopify Partner account

---

## 🚀 Step 1: Create Render Account (2 minutes)

1. Go to https://render.com
2. Click **Get Started**
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

---

## 🏗️ Step 2: Create Web Service (5 minutes)

### 2.1 Create New Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository:
   - Repository: `debrajj/Infinity-variation`
   - Click **Connect**

### 2.2 Configure Service

**Basic Settings:**
```
Name: infinite-product-options
Region: Choose closest to your users (e.g., Oregon, Frankfurt)
Branch: main
Runtime: Node
```

**Build & Deploy:**
```
Build Command: npm install && npm run build
Start Command: npm run start
```

**Instance Type:**
```
Free (or Starter $7/month for better performance)
```

### 2.3 Advanced Settings

Click **Advanced** and add:

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
SHOPIFY_API_KEY=your_client_id_from_shopify
SHOPIFY_API_SECRET=your_client_secret_from_shopify
```

**Auto-Deploy:**
```
✅ Enable (deploys automatically on git push)
```

### 2.4 Create Web Service

Click **Create Web Service**

Render will now:
- Clone your repository
- Install dependencies
- Build your app
- Start the server

**Wait 3-5 minutes for deployment to complete.**

---

## 🔗 Step 3: Get Your Render URL (1 minute)

Once deployed, you'll see:
```
Your service is live at https://infinite-product-options.onrender.com
```

**Copy this URL** - you'll need it for Shopify configuration.

---

## ⚙️ Step 4: Update Shopify Configuration (3 minutes)

### 4.1 Update shopify.app.toml

Open `shopify.app.toml` and update:

```toml
name = "infinite-product-options"
client_id = "YOUR_CLIENT_ID"
application_url = "https://infinite-product-options.onrender.com"
embedded = true

[access_scopes]
scopes = "write_products,read_products,write_themes,read_themes"

[auth]
redirect_urls = [
  "https://infinite-product-options.onrender.com/auth/callback",
  "https://infinite-product-options.onrender.com/auth/shopify/callback",
  "https://infinite-product-options.onrender.com/api/auth/callback"
]

[webhooks]
api_version = "2024-01"
```

### 4.2 Push Changes to GitHub

```bash
git add shopify.app.toml
git commit -m "Update Render deployment URL"
git push origin main
```

Render will automatically redeploy with the new configuration.

### 4.3 Update Shopify Partners Dashboard

1. Go to https://partners.shopify.com
2. Click **Apps** → Your App
3. Click **Configuration**
4. Update:
   - **App URL**: `https://infinite-product-options.onrender.com`
   - **Allowed redirection URL(s)**:
     ```
     https://infinite-product-options.onrender.com/auth/callback
     https://infinite-product-options.onrender.com/auth/shopify/callback
     https://infinite-product-options.onrender.com/api/auth/callback
     ```
5. Click **Save**

---

## 🎨 Step 5: Deploy Theme Extension (2 minutes)

```bash
shopify app deploy
```

This will:
- Build your app
- Upload theme extension
- Create app version

---

## 📱 Step 6: Install on Store (2 minutes)

### Option 1: Via CLI
```bash
shopify app open
```

### Option 2: Manual
1. Get installation URL from Shopify CLI
2. Open in browser
3. Select your store
4. Click **Install app**
5. Approve permissions

---

## ✅ Step 7: Verify Deployment

### 7.1 Check Render Dashboard

1. Go to Render Dashboard
2. Click your service
3. Check **Logs** tab - should see:
   ```
   ✅ Server running on port 10000
   📱 Admin: https://infinite-product-options.onrender.com
   ```

### 7.2 Test Admin Panel

1. Go to Shopify Admin → Apps
2. Click "Infinite Product Options"
3. Should load admin panel

### 7.3 Test Storefront

1. Go to Theme Customizer
2. Add "Product Customizer" block
3. Visit product page
4. Options should appear

---

## 🔧 Render Configuration Files

### Create render.yaml (Optional but Recommended)

Create `render.yaml` in your project root:

```yaml
services:
  - type: web
    name: infinite-product-options
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: SHOPIFY_API_KEY
        sync: false
      - key: SHOPIFY_API_SECRET
        sync: false
    autoDeploy: true
```

Push to GitHub:
```bash
git add render.yaml
git commit -m "Add Render configuration"
git push origin main
```

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain to Render

1. In Render Dashboard → Your Service
2. Click **Settings** → **Custom Domain**
3. Add your domain (e.g., `app.yourdomain.com`)
4. Follow DNS instructions
5. Update Shopify configuration with new domain

---

## 📊 Monitoring & Logs

### View Logs
1. Render Dashboard → Your Service
2. Click **Logs** tab
3. Real-time logs appear here

### View Metrics
1. Click **Metrics** tab
2. See CPU, Memory, Response times

### Set Up Alerts
1. Click **Settings** → **Notifications**
2. Add email for deployment notifications

---

## 🔒 Environment Variables Management

### Add/Update Variables

1. Render Dashboard → Your Service
2. Click **Environment** tab
3. Add variables:
   ```
   SHOPIFY_API_KEY=your_key
   SHOPIFY_API_SECRET=your_secret
   NODE_ENV=production
   ```
4. Click **Save Changes**
5. Service will automatically redeploy

---

## 🚀 Deployment Workflow

### Automatic Deployments

Every time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render automatically:
1. Detects the push
2. Pulls latest code
3. Runs build command
4. Deploys new version
5. Zero downtime deployment

### Manual Deploy

If needed:
1. Render Dashboard → Your Service
2. Click **Manual Deploy** → **Deploy latest commit**

---

## 🐛 Troubleshooting

### Build Fails

**Check Build Logs:**
1. Render Dashboard → Logs
2. Look for errors in build phase

**Common Issues:**
```bash
# Missing dependencies
npm install

# Build errors
npm run build

# Check locally first
```

### Service Won't Start

**Check Start Command:**
```
Start Command: npm run start
```

**Verify package.json:**
```json
{
  "scripts": {
    "start": "npm run build && npm run server"
  }
}
```

### Environment Variables Not Working

1. Check spelling in Render dashboard
2. Restart service after adding variables
3. Check logs for undefined variables

### App Not Loading in Shopify

1. Verify URLs match exactly:
   - shopify.app.toml
   - Partners Dashboard
   - Render deployment URL
2. Check HTTPS is enabled
3. Clear browser cache

---

## 💰 Pricing

### Free Tier
- ✅ 750 hours/month
- ✅ Automatic SSL
- ✅ Automatic deploys
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold start delay (~30 seconds)

### Starter ($7/month)
- ✅ Always on (no spin down)
- ✅ Faster performance
- ✅ More resources
- ✅ Better for production

**Recommendation:** Start with Free, upgrade to Starter for production.

---

## 🔄 Update Deployment

### Update Code
```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
# Render auto-deploys
```

### Update Environment Variables
1. Render Dashboard → Environment
2. Update variables
3. Save (auto-redeploys)

### Rollback
1. Render Dashboard → Events
2. Find previous deployment
3. Click **Rollback**

---

## 📋 Deployment Checklist

### Pre-Deployment
- [x] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service created
- [ ] Environment variables set

### Deployment
- [ ] Build successful
- [ ] Service running
- [ ] URL obtained
- [ ] shopify.app.toml updated
- [ ] Partners Dashboard updated

### Post-Deployment
- [ ] Theme extension deployed
- [ ] App installed on store
- [ ] Admin panel accessible
- [ ] Storefront working
- [ ] Mobile tested

---

## 🎯 Quick Commands

```bash
# Update and deploy
git add .
git commit -m "Update"
git push origin main

# Deploy theme extension
shopify app deploy

# Open app
shopify app open

# Check app info
shopify app info
```

---

## 🌟 Render vs Other Platforms

| Feature | Render | Netlify | Vercel |
|---------|--------|---------|--------|
| Free Tier | ✅ 750h | ✅ 100GB | ✅ 100GB |
| Node.js | ✅ Native | ⚠️ Functions | ⚠️ Functions |
| Auto Deploy | ✅ Yes | ✅ Yes | ✅ Yes |
| Custom Domain | ✅ Free | ✅ Free | ✅ Free |
| Always On | 💰 $7/mo | ❌ No | ❌ No |
| Best For | Full apps | Static sites | Next.js |

**Verdict:** Render is best for full-stack Node.js Shopify apps.

---

## 📞 Support

### Render Support
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### Shopify Support
- Docs: https://shopify.dev/docs/apps
- Community: https://community.shopify.com

---

## 🎉 Success!

Your app is now deployed on Render!

### What You Have:
✅ Live URL: https://infinite-product-options.onrender.com  
✅ Automatic deployments from GitHub  
✅ Free SSL certificate  
✅ Environment variables configured  
✅ Logs and monitoring  

### Next Steps:
1. Test thoroughly
2. Enable theme extension
3. Create option sets
4. Monitor performance
5. Upgrade to Starter if needed

---

**Deployment Time**: 15 minutes  
**Cost**: Free (or $7/month for Starter)  
**Difficulty**: Easy  

**Your app is live on Render! 🚀**
