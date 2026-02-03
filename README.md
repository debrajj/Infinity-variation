# 🎨 Infinite Product Options - Shopify App

Break through Shopify's 2048 variant limit with unlimited product customization options.

---

## ✨ Features

- **30+ Option Types**: Text, dropdowns, color swatches, file uploads, and more
- **Conditional Logic**: Show/hide options based on selections
- **Flexible Pricing**: Fixed, percentage, or multiplier-based add-on pricing
- **Grouped Customization**: All options grouped into one service line item
- **CSV Import/Export**: Bulk manage option sets
- **Theme Extension**: Works with any Shopify theme, no code required
- **Mobile Responsive**: Optimized for all devices

---

## 🚀 Quick Launch (30 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Shopify App
```bash
shopify auth login
shopify app create
```

### 3. Build & Deploy
```bash
# Automated
./deploy.sh

# Or manual
npm run build
netlify deploy --prod  # or vercel --prod
```

### 4. Deploy Theme Extension
```bash
shopify app deploy
```

### 5. Install on Store
```bash
shopify app open
```

### 6. Enable in Theme
- Go to Theme Customizer
- Add "Product Customizer" block to product pages
- Save

**Done!** ✅

---

## 📚 Documentation

- **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)** - 30-minute quick start
- **[PRIVATE_APP_DEPLOYMENT.md](./PRIVATE_APP_DEPLOYMENT.md)** - Complete deployment guide

---

## 🏗️ Project Structure

```
infinite-product-options/
├── components/              # React components
│   ├── AdminPanel.tsx      # Main admin interface
│   ├── OptionSetEditor.tsx # Visual option builder
│   ├── StorefrontCustomizer.tsx # Customer UI
│   └── ...
├── services/               # Business logic
│   ├── conditionalLogic.ts
│   ├── validation.ts
│   ├── pricingCalculator.ts
│   └── csvExport.ts
├── extensions/             # Theme extension
│   └── theme-app-extension/
│       ├── blocks/
│       └── assets/
├── server/                 # Backend API
│   └── index.js
├── types.ts               # TypeScript definitions
├── constants.tsx          # App constants
├── App.tsx               # Main app
└── shopify.app.toml      # Shopify config
```

---

## 🎯 Usage

### For Merchants

#### Create Option Set
1. Open app in Shopify Admin
2. Click "Create New Option Set"
3. Add options (text, dropdowns, swatches, etc.)
4. Set pricing for each option
5. Assign to products
6. Publish

#### Example: T-Shirt Customization
```
Options:
- Size (Radio): S, M, L, XL
- Color (Color Swatches): Red, Blue, Green
- Custom Text (Text Input): "Your name"
- Gift Wrap (Checkbox): +$5
```

### For Customers

1. Visit product page
2. See customization options
3. Fill in required fields
4. Select add-ons
5. See live price updates
6. Add to cart
7. Checkout with customizations

---

## 🔧 Development

### Start Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Server
```bash
npm run start
```

### Deploy
```bash
./deploy.sh
```

---

## 📦 Tech Stack

- **Frontend**: React 18, TypeScript, Shopify Polaris
- **Build**: Vite 6
- **Backend**: Node.js, Express
- **Hosting**: Netlify/Vercel
- **Shopify**: App Bridge, Theme Extensions

---

## ✅ Features Checklist

### Option Types (30+)
- ✅ Text Input, Text Area, Number
- ✅ Email, Phone, Date/Time
- ✅ File Upload
- ✅ Radio, Checkbox, Dropdown
- ✅ Color Swatches, Image Swatches
- ✅ Button Group
- ✅ Heading, Divider, Paragraph

### Advanced Features
- ✅ Conditional Logic (8 operators)
- ✅ Pricing Rules (Fixed, %, Multiplier)
- ✅ Validation (Required, Min/Max, Regex)
- ✅ CSV Import/Export
- ✅ Grouped Cart Behavior
- ✅ Theme Extension
- ✅ Mobile Responsive

---

## 🆘 Support

### Quick Fixes

**App won't install?**
```bash
shopify app info  # Check configuration
```

**Theme extension not showing?**
```bash
shopify app deploy  # Redeploy extension
```

**Build fails?**
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Documentation
- Shopify App Docs: https://shopify.dev/docs/apps
- Theme Extensions: https://shopify.dev/docs/apps/online-store/theme-app-extensions

---

## 📊 Stats

- **30+** Option Types
- **8** Conditional Operators
- **3** Pricing Rule Types
- **Unlimited** Option Sets
- **Unlimited** Products
- **100%** Theme Compatible

---

## 📝 License

Proprietary - All rights reserved

---

## 🎉 Ready to Launch?

Follow the **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)** to deploy in 30 minutes!

**Questions?** Check **[PRIVATE_APP_DEPLOYMENT.md](./PRIVATE_APP_DEPLOYMENT.md)** for detailed instructions.

---

**Built with ❤️ for Shopify merchants**
