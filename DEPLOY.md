# Deployment Guide

## Your app has been built successfully! ✅

The production files are in the `dist/` folder.

## Deployment Options:

### Option 1: Deploy to Vercel (Recommended - Free & Easy)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and copy your deployment URL

4. Update Shopify Partner Dashboard with your Vercel URL


### Option 2: Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod --dir=dist
```

3. Copy your deployment URL

4. Update Shopify Partner Dashboard


### Option 3: Manual Deployment

1. Upload the `dist/` folder to your hosting provider

2. Make sure it's served over HTTPS

3. Update URLs in Shopify Partner Dashboard


## After Deployment:

1. Go to https://partners.shopify.com
2. Select your app
3. Go to "Configuration" → "App setup"
4. Update these URLs:
   - **App URL**: Your production URL (e.g., https://your-app.vercel.app)
   - **Allowed redirection URLs**:
     - https://your-app.vercel.app/auth/callback
     - https://your-app.vercel.app/auth/shopify/callback

5. Save changes

6. Install on your store:
   ```
   https://YOUR-STORE.myshopify.com/admin/oauth/authorize?client_id=46ec9c3dd8792f6780c371e936ee0bf2
   ```

## Current Configuration:
- Client ID: 46ec9c3dd8792f6780c371e936ee0bf2
- Build output: `dist/` folder
- Framework: React 18 + Vite
- Shopify Integration: Polaris UI + App Bridge

## Need Help?
- Vercel docs: https://vercel.com/docs
- Netlify docs: https://docs.netlify.com
- Shopify app docs: https://shopify.dev/docs/apps
