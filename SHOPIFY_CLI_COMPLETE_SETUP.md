# Complete Shopify CLI Setup - Everything in One Place

## Your App Details
- **Store**: cmstestingg.myshopify.com
- **App**: infinite-product-options
- **Client ID**: 46ec9c3dd8792f6780c371e936ee0bf2
- **Location**: `../shopify-app-new/infinite-product-options/`

## Step-by-Step CLI Workflow

### Step 1: Navigate to Your App
```bash
cd ../shopify-app-new/infinite-product-options
```

### Step 2: Copy Real Products Integration
```bash
cp ../../infinity/app.products.jsx app/routes/app._index.jsx
```

### Step 3: Start Development with CLI
```bash
npm run dev
```

**What happens:**
- ✅ Starts local backend server
- ✅ Creates secure tunnel (like ngrok)
- ✅ Fetches REAL products from cmstestingg.myshopify.com
- ✅ Opens app in Shopify admin automatically
- ✅ Hot reload on code changes

### Step 4: Test Your App
The CLI will open: `https://admin.shopify.com/store/cmstestingg/apps/infinite-product-options`

You'll see:
- Real products from your store
- All your admin panel features
- Live updates as you make changes

## All CLI Commands You Need

### Development
```bash
# Start development server
npm run dev

# Start with specific store
npm run dev -- --store=cmstestingg.myshopify.com
```

### Deployment
```bash
# Deploy to Shopify hosting
npm run deploy

# Deploy with version
npm run deploy -- --version=1.0.0
```

### App Management
```bash
# View app info
npm run shopify app info

# Open app in browser
npm run shopify app open

# View app configuration
npm run shopify app config link

# Generate extension
npm run shopify app generate extension
```

### Database
```bash
# Create database migration
npm run prisma:migrate

# View database
npm run prisma:studio

# Reset database
npm run prisma:reset
```

### Build & Test
```bash
# Build for production
npm run build

# Type check
npm run typecheck

# Lint code
npm run lint
```

## Complete Workflow

### For Development (Daily Use)
```bash
cd ../shopify-app-new/infinite-product-options
npm run dev
```

### For Production Deployment
```bash
cd ../shopify-app-new/infinite-product-options
npm run build
npm run deploy
```

### For Testing on Different Store
```bash
npm run dev -- --store=another-store.myshopify.com
```

## Environment Variables (Already Configured)

The CLI automatically manages:
- ✅ SHOPIFY_API_KEY
- ✅ SHOPIFY_API_SECRET  
- ✅ SCOPES
- ✅ HOST

No manual .env setup needed!

## Troubleshooting with CLI

### If app won't start:
```bash
npm run shopify app config link
```

### If authentication fails:
```bash
shopify auth logout
npm run dev
```

### If products don't load:
```bash
# Check app permissions
npm run shopify app info

# Verify store connection
npm run dev -- --reset
```

### If deployment fails:
```bash
# Check deployment status
npm run shopify app versions list

# Redeploy
npm run deploy -- --force
```

## File Structure for CLI Development

```
infinite-product-options/
├── app/
│   ├── routes/
│   │   ├── app._index.jsx          # Main route (your AdminPanel)
│   │   ├── app.products.jsx        # Products page
│   │   └── webhooks.*.jsx          # Webhook handlers
│   ├── components/                  # Your React components
│   ├── shopify.server.ts           # Shopify API (auto-configured)
│   └── db.server.ts                # Database (auto-configured)
├── prisma/
│   └── schema.prisma               # Database schema
├── shopify.app.toml                # App config (CLI uses this)
└── package.json                    # Scripts for CLI commands
```

## Quick Reference

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Deploy | `npm run deploy` |
| View logs | Check terminal output |
| Open app | Auto-opens or `npm run shopify app open` |
| Stop server | `Ctrl+C` |
| Restart | `npm run dev` again |

## Benefits of CLI Workflow

1. **No manual OAuth** - CLI handles it
2. **Real products automatically** - Fetches from your store
3. **Hot reload** - Changes appear instantly
4. **Secure tunneling** - No need for ngrok
5. **Easy deployment** - One command to production
6. **Database included** - Prisma auto-configured
7. **Webhooks ready** - Pre-configured handlers

## Your Next Command

Just run this:
```bash
cd ../shopify-app-new/infinite-product-options && npm run dev
```

Everything else is automatic! 🚀

## Production Deployment

When ready for production:
```bash
cd ../shopify-app-new/infinite-product-options
npm run build
npm run deploy
```

The CLI will:
1. Build your app
2. Deploy to Shopify's infrastructure
3. Update app URLs automatically
4. Make it live for all users

## Monitoring & Logs

```bash
# View deployment logs
npm run shopify app logs

# Check app status
npm run shopify app info

# View versions
npm run shopify app versions list
```

That's it! Everything you need is through the CLI. No manual configuration, no external hosting needed.
