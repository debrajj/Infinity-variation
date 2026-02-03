# Quick Deploy to Fix "localhost sent an invalid response"

## The Problem
Your app is configured to use localhost, but Shopify needs a public HTTPS URL.

## Solution: Deploy to Vercel (Free & Fast)

### Option 1: Using npx (No Installation Required)

```bash
npx vercel --prod
```

Follow the prompts:
1. Login to Vercel (it will open a browser)
2. Confirm project settings
3. Wait for deployment
4. Copy the production URL (e.g., https://your-app.vercel.app)

### Option 2: Using Vercel Website (Easiest)

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import this repository or drag & drop the `dist` folder
5. Deploy
6. Copy your production URL

### Option 3: Using Netlify Drop

1. Go to https://app.netlify.com/drop
2. Drag and drop your `dist` folder
3. Get your deployment URL instantly

## After Deployment:

### Step 1: Update shopify.app.toml
Replace localhost with your production URL:

```toml
application_url = "https://your-app.vercel.app"

[auth]
redirect_urls = [
  "https://your-app.vercel.app/auth/callback",
  "https://your-app.vercel.app/auth/shopify/callback"
]
```

### Step 2: Update Shopify Partner Dashboard

1. Go to https://partners.shopify.com
2. Select your app "KOC-product-options"
3. Go to "Configuration" → "App setup"
4. Update:
   - **App URL**: https://your-app.vercel.app
   - **Allowed redirection URLs**: 
     - https://your-app.vercel.app/auth/callback
     - https://your-app.vercel.app/auth/shopify/callback

### Step 3: Redeploy to Shopify

```bash
shopify app deploy
```

### Step 4: Reinstall on Your Store

Visit:
```
https://YOUR-STORE.myshopify.com/admin/oauth/authorize?client_id=46ec9c3dd8792f6780c371e936ee0bf2
```

## Troubleshooting

### If npx vercel doesn't work:
Try the Vercel website method or Netlify Drop - both are instant and require no CLI installation.

### If you get CORS errors:
Make sure your production URL is correctly set in both shopify.app.toml and Partner Dashboard.

### If app still shows localhost:
1. Clear browser cache
2. Make sure you ran `shopify app deploy` after updating URLs
3. Reinstall the app on your store

## Your Current Build
- Build folder: `dist/`
- Already built and ready to deploy
- Just needs to be hosted on a public URL
