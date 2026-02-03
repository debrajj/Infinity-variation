# 🚀 Quick Start - Fix Cart Pricing in 5 Minutes

## Current Issue
Cart shows ₹288 instead of ₹303 (missing ₹15 customization fee)

## Solution
System automatically adds a hidden "service fee" product to cart for customization pricing.

## Setup (Choose One)

### ⚡ Option A: Fully Automatic (Recommended)

**Time: 5 minutes**

1. **Get Shopify Admin API Token:**
   - Shopify Admin → Settings → Apps and sales channels
   - Click "Develop apps" → "Create an app"
   - Name: "Infinite Options Backend"
   - Configuration → Enable: `read_products`, `write_products`
   - Save → Install app → Copy "Admin API access token"

2. **Add to Render:**
   - Go to https://dashboard.render.com
   - Click `infinity-variation` → Environment tab
   - Add:
     ```
     SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
     SHOPIFY_ACCESS_TOKEN=your_token_here
     ```
   - Save (auto-deploys)

3. **Test:**
   - Add product with customizations
   - Check cart - pricing should be correct!

**Done! Works for ALL variants automatically.**

---

### 📝 Option B: Manual Setup

**Time: 10 minutes**

1. **Create Service Product in Shopify:**
   - Products → Add product
   - Title: "Product Customization Service"
   - Price: ₹1.00
   - Status: DRAFT
   - Tags: `customization-service`, `hidden`
   - Save → Copy variant ID from URL

2. **Add to Render:**
   - https://dashboard.render.com
   - Click `infinity-variation` → Environment
   - Add:
     ```
     CUSTOMIZATION_SERVICE_VARIANT_ID=your_variant_id
     ```
   - Save

3. **Test:**
   - Add product with customizations
   - Check cart

---

## Verification

✅ Render logs show: "Created customization service product"
✅ Cart shows two items: main product + service fee
✅ Total is correct (base + customizations)

## Files to Read

- **AUTOMATIC_SETUP.md** - Detailed automatic setup guide
- **FIX_CART_PRICING.md** - Detailed manual setup guide
- **DEPLOY_PRICING_FIX.md** - What was changed and why

## Current Status

✅ Code deployed to GitHub
⏳ Waiting for Render auto-deployment (2-3 min)
⏳ Needs environment variables (choose option above)

## Questions?

Check Render logs at https://dashboard.render.com for detailed error messages.
