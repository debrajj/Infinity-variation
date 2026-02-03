# Shopify Embedded App Setup Guide

## Prerequisites
- Node.js 18+ installed
- Shopify Partner account
- Shopify CLI installed (`npm install -g @shopify/cli @shopify/app`)

## Setup Steps

### 1. Create Shopify App in Partner Dashboard
1. Go to https://partners.shopify.com
2. Click "Apps" → "Create app"
3. Choose "Create app manually"
4. Fill in app name: "Infinite Product Options"
5. Copy the **API key** and **API secret**

### 2. Configure Environment Variables
Update `.env.local` with your credentials:
```
VITE_SHOPIFY_API_KEY=your_api_key_from_partner_dashboard
SHOPIFY_API_SECRET=your_api_secret_from_partner_dashboard
```

### 3. Update shopify.app.toml
Edit `shopify.app.toml`:
- Add your `client_id` (same as API key)
- Add your `dev_store_url` (e.g., "your-store.myshopify.com")

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Development Server
```bash
npm run dev
```

The app will run on https://localhost:3002 (or another available port)

### 6. Test in Shopify Admin
1. Install the app on your development store
2. The app will open embedded in Shopify admin
3. You can manage product options directly from Shopify

## Deployment

### Option 1: Deploy to Shopify (Recommended)
```bash
shopify app deploy
```

### Option 2: Deploy to Custom Hosting
1. Build the app:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider (Vercel, Netlify, etc.)

3. Update `shopify.app.toml` with your production URL

4. Update app URLs in Shopify Partner Dashboard

## Features
- ✅ Embedded in Shopify Admin
- ✅ App Bridge integration
- ✅ Polaris design system
- ✅ Product customization options
- ✅ Real-time preview
- ✅ Multiple option types (text, radio, checkbox, etc.)

## Troubleshooting

### App won't load in Shopify
- Check that your API key is correct in `.env.local`
- Ensure the app URL matches in `shopify.app.toml`
- Verify redirect URLs are configured in Partner Dashboard

### CORS errors
- Make sure you're running with `--host` flag: `vite --host`
- Check that your domain is whitelisted in Shopify settings

### React version conflicts
- This app uses React 18 (required for Shopify Polaris)
- Don't upgrade to React 19 until Polaris supports it

## Next Steps
1. Set up backend API for product data (currently using mock data)
2. Implement Shopify GraphQL API integration
3. Add webhooks for product updates
4. Set up app billing (if needed)
5. Submit for app review (if publishing to App Store)
