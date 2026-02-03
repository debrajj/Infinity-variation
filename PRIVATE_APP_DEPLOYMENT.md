# 🚀 Private Shopify App Deployment Guide

Complete step-by-step guide to deploy your Infinite Product Options app as a private Shopify app.

---

## 📋 Prerequisites Checklist

- [ ] Shopify Partner Account ([partners.shopify.com](https://partners.shopify.com))
- [ ] Development Store or Production Store
- [ ] Node.js 18+ installed
- [ ] Shopify CLI installed: `npm install -g @shopify/cli @shopify/app`
- [ ] Hosting account (Netlify, Vercel, or custom server)
- [ ] Domain name (optional but recommended)

---

## 🎯 Step 1: Create Shopify App (5 minutes)

### 1.1 Login to Shopify Partners

```bash
shopify auth login
```

### 1.2 Create App Using CLI

```bash
# Navigate to your project directory
cd infinite-product-options

# Create app configuration
shopify app create
```

**Follow the prompts:**
- App name: `Infinite Product Options`
- App type: `Custom app` (for private app)
- Select your partner organization
- Choose development store

### 1.3 Update shopify.app.toml

The CLI will update your `shopify.app.toml` file. Verify it looks like this:

```toml
name = "infinite-product-options"
client_id = "YOUR_CLIENT_ID_HERE"  # Auto-filled by CLI
application_url = "https://your-domain.com"  # Update this
embedded = true

[access_scopes]
scopes = "write_products,read_products,write_themes,read_themes"

[auth]
redirect_urls = [
  "https://your-domain.com/auth/callback",
  "https://your-domain.com/auth/shopify/callback",
  "https://your-domain.com/api/auth/callback"
]

[webhooks]
api_version = "2024-01"

[pos]
embedded = false

[build]
automatically_update_urls_on_dev = true
dev_store_url = "your-store.myshopify.com"
```

---

## 🏗️ Step 2: Set Up Backend Server (15 minutes)

### 2.1 Update server/index.js

Replace the content with a complete Express server:

```javascript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Option Sets API
app.get('/api/option-sets', (req, res) => {
  // In production, fetch from database
  const optionSets = JSON.parse(process.env.OPTION_SETS || '[]');
  res.json({ optionSets });
});

app.post('/api/option-sets', (req, res) => {
  // In production, save to database
  res.json({ success: true, id: Date.now().toString() });
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const shop = req.query.shop;
    // In production, fetch from Shopify API
    res.json({ products: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📱 Admin: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api/health`);
});
```

### 2.2 Update package.json scripts

```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "preview": "vite preview",
    "server": "node server/index.js",
    "start": "npm run build && npm run server"
  }
}
```

### 2.3 Create .env file

```bash
# Create .env file
cat > .env << EOF
SHOPIFY_API_KEY=your_client_id_from_toml
SHOPIFY_API_SECRET=your_client_secret
SHOPIFY_SCOPES=write_products,read_products,write_themes,read_themes
HOST=https://your-domain.com
PORT=3000
NODE_ENV=production
EOF
```

---

## 🌐 Step 3: Deploy to Hosting (20 minutes)

### Option A: Deploy to Netlify (Recommended for Quick Setup)

#### 3.1 Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 3.2 Create netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### 3.3 Create Netlify Functions

```bash
mkdir -p netlify/functions
```

Create `netlify/functions/option-sets.js`:
```javascript
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    // Return option sets from database/storage
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ optionSets: [] })
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
```

#### 3.4 Deploy to Netlify
```bash
# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

**Copy the deployment URL** (e.g., `https://your-app.netlify.app`)

### Option B: Deploy to Vercel

#### 3.1 Install Vercel CLI
```bash
npm install -g vercel
```

#### 3.2 Create vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 3.3 Deploy
```bash
vercel login
vercel --prod
```

---

## 🔧 Step 4: Update App Configuration (5 minutes)

### 4.1 Update shopify.app.toml with your deployment URL

```toml
application_url = "https://your-app.netlify.app"  # Your actual URL

[auth]
redirect_urls = [
  "https://your-app.netlify.app/auth/callback",
  "https://your-app.netlify.app/auth/shopify/callback",
  "https://your-app.netlify.app/api/auth/callback"
]
```

### 4.2 Update in Shopify Partners Dashboard

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Click **Apps** → Select your app
3. Click **Configuration**
4. Update **App URL**: `https://your-app.netlify.app`
5. Update **Allowed redirection URL(s)**:
   ```
   https://your-app.netlify.app/auth/callback
   https://your-app.netlify.app/auth/shopify/callback
   https://your-app.netlify.app/api/auth/callback
   ```
6. Click **Save**

---

## 📦 Step 5: Build and Deploy Theme Extension (10 minutes)

### 5.1 Build the app
```bash
npm run build
```

### 5.2 Deploy theme extension
```bash
shopify app deploy
```

This will:
- Build your app
- Upload theme extension
- Create app version

### 5.3 Verify deployment
```bash
shopify app versions list
```

---

## 🎯 Step 6: Install on Your Store (5 minutes)

### 6.1 Get Installation URL

```bash
shopify app info
```

Copy the **Preview URL** or **Installation URL**

### 6.2 Install the App

**Option 1: Via CLI**
```bash
shopify app open
```

**Option 2: Manual**
1. Copy the installation URL
2. Paste in browser
3. Select your store
4. Click **Install app**
5. Approve permissions

### 6.3 Verify Installation

1. Go to your Shopify Admin
2. Click **Apps**
3. You should see "Infinite Product Options"
4. Click to open the app

---

## 🎨 Step 7: Enable Theme Extension (5 minutes)

### 7.1 Go to Theme Customizer

1. In Shopify Admin → **Online Store** → **Themes**
2. Click **Customize** on your active theme

### 7.2 Add App Block

1. Navigate to a **Product page**
2. Click **Add block** or **Add section**
3. Under **Apps**, find **Product Customizer**
4. Drag it to desired position (usually below product description)
5. Configure settings:
   - Enable: ✅
   - Primary Color: #e64a5d
   - Show Prices: ✅
6. Click **Save**

### 7.3 Test on Storefront

1. Go to any product page
2. You should see the customization options
3. Default Add to Cart should be hidden
4. Custom Add to Cart should appear

---

## ✅ Step 8: Final Testing (10 minutes)

### 8.1 Test Admin Panel

- [ ] Can access app from Shopify Admin
- [ ] Dashboard loads correctly
- [ ] Can create option sets
- [ ] Can edit option sets
- [ ] Can assign to products
- [ ] Settings save correctly

### 8.2 Test Storefront

- [ ] Customization options appear on product page
- [ ] All option types render correctly
- [ ] Conditional logic works
- [ ] Price calculations are accurate
- [ ] Validation works
- [ ] Add to Cart functions
- [ ] Cart shows grouped customization
- [ ] Checkout displays properties

### 8.3 Test Mobile

- [ ] Admin panel responsive
- [ ] Storefront responsive
- [ ] Touch interactions work
- [ ] Forms are usable

---

## 🔒 Step 9: Security & Performance (Optional)

### 9.1 Add Environment Variables

In your hosting platform (Netlify/Vercel):

```
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
NODE_ENV=production
```

### 9.2 Enable HTTPS

- Netlify/Vercel provide free SSL automatically
- Verify your app URL uses `https://`

### 9.3 Set Up Monitoring

- Enable error tracking (Sentry, Bugsnag)
- Set up uptime monitoring
- Configure logging

---

## 📊 Step 10: Post-Deployment (Ongoing)

### 10.1 Monitor Performance

```bash
# Check app status
shopify app info

# View logs
netlify logs  # or vercel logs
```

### 10.2 Update App

When you make changes:

```bash
# 1. Build
npm run build

# 2. Deploy hosting
netlify deploy --prod  # or vercel --prod

# 3. Deploy theme extension
shopify app deploy

# 4. Test thoroughly
```

### 10.3 Backup Data

- Export option sets regularly
- Backup configuration
- Document custom changes

---

## 🆘 Troubleshooting

### Issue: App won't install
**Solution:**
- Verify `application_url` in shopify.app.toml
- Check redirect URLs match exactly
- Ensure app is not in draft mode

### Issue: Theme extension not showing
**Solution:**
- Verify extension is deployed: `shopify app versions list`
- Check it's enabled in Theme Customizer
- Clear browser cache
- Check browser console for errors

### Issue: API calls failing
**Solution:**
- Check CORS settings
- Verify API endpoints are deployed
- Check environment variables
- Review server logs

### Issue: Build fails
**Solution:**
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## 📝 Checklist Summary

### Pre-Deployment
- [ ] Shopify Partner account created
- [ ] App created via CLI
- [ ] shopify.app.toml configured
- [ ] Backend server set up
- [ ] Environment variables configured

### Deployment
- [ ] App built successfully
- [ ] Deployed to hosting (Netlify/Vercel)
- [ ] Deployment URL obtained
- [ ] shopify.app.toml updated with URL
- [ ] Partner Dashboard updated

### Theme Extension
- [ ] Theme extension deployed
- [ ] App version created
- [ ] Extension enabled in Theme Customizer
- [ ] Tested on product page

### Installation
- [ ] App installed on store
- [ ] Admin panel accessible
- [ ] Can create option sets
- [ ] Can assign to products

### Testing
- [ ] All admin features work
- [ ] Storefront displays correctly
- [ ] Cart integration works
- [ ] Mobile responsive
- [ ] No console errors

---

## 🎉 Success!

Your private Shopify app is now live! 

### What You Have:
✅ Embedded admin panel in Shopify Admin  
✅ Theme extension on product pages  
✅ 30+ option types working  
✅ Conditional logic functioning  
✅ Pricing calculations accurate  
✅ Cart integration complete  

### Next Steps:
1. Create your first option set
2. Assign to products
3. Test thoroughly
4. Train your team
5. Monitor performance

---

## 📞 Support

### Documentation
- Shopify App Development: https://shopify.dev/docs/apps
- Theme Extensions: https://shopify.dev/docs/apps/online-store/theme-app-extensions
- Shopify CLI: https://shopify.dev/docs/apps/tools/cli

### Commands Reference
```bash
# App info
shopify app info

# Deploy
shopify app deploy

# Open app
shopify app open

# View versions
shopify app versions list

# Generate extension
shopify app generate extension
```

---

**Deployment Time**: ~60 minutes  
**Difficulty**: Intermediate  
**Cost**: Free (Netlify/Vercel free tier)  

**Good luck with your deployment! 🚀**
