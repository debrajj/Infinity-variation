# Automatic Pricing Setup - No Manual Work Required!

## The Problem
Your cart shows ₹288 instead of ₹303 because customization add-ons aren't being added to the cart total.

## The Automatic Solution

The system will automatically create a hidden "service fee" product that works for **ALL your variants** - you only need to set it up once!

## Quick Setup (2 Steps)

### Step 1: Add Your Shopify Credentials to Render

1. Go to https://dashboard.render.com
2. Click on your service: `infinity-variation`
3. Go to "Environment" tab
4. Add these environment variables:

```
SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_admin_api_access_token
```

**How to get your Access Token:**
1. Go to Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps"
3. Click "Create an app" (or use existing)
4. Name it: "Infinite Options Backend"
5. Go to "Configuration" tab
6. Under "Admin API access scopes", enable:
   - `read_products`
   - `write_products`
7. Click "Save"
8. Go to "API credentials" tab
9. Click "Install app"
10. Copy the "Admin API access token"

### Step 2: Test It!

1. Go to your store
2. Add any product with customizations
3. The system will automatically:
   - Create the service product (first time only)
   - Add it to cart with the correct pricing
   - Work for ALL future orders automatically!

## How It Works

When the first customer adds customizations:

1. System checks if service product exists
2. If not, creates it automatically (hidden, draft status)
3. Adds main product: ₹288
4. Adds service product (qty 15 × ₹1): ₹15
5. Cart total: ₹303 ✅

**This works for ALL variants automatically!**
- Pencil Box with ₹15 customization → qty 15
- Another product with ₹50 customization → qty 50
- Any variant, any price - fully automatic!

## What Gets Created

The system creates ONE hidden product:
- **Title**: "Product Customization Service"
- **Price**: ₹1.00
- **Status**: DRAFT (invisible to customers)
- **Tags**: `customization-service`, `hidden`, `app-managed`

This single product handles pricing for ALL your variants!

## Verification

After setup, check your Render logs:
1. Go to https://dashboard.render.com
2. Click on your service
3. Go to "Logs" tab
4. Look for: `✅ Created customization service product, variant ID: [number]`

The system will also print:
```
💡 Add this to your environment: CUSTOMIZATION_SERVICE_VARIANT_ID=[number]
```

Copy that number and add it as an environment variable to make it permanent (optional - system will auto-create if missing).

## Troubleshooting

**"Missing shop or access token"**
- Make sure you added both environment variables
- Check the shop domain format: `your-store.myshopify.com`
- Verify the access token is correct

**"Failed to create product"**
- Check that your app has `write_products` permission
- Make sure the app is installed on your store
- Check Render logs for detailed error messages

**Cart still shows wrong total?**
- Clear browser cache
- Check browser console (F12) for errors
- Verify the service product was created in Shopify Admin → Products

## Benefits

✅ **Automatic** - No manual product creation
✅ **Works for ALL variants** - Set up once, works forever
✅ **Scales automatically** - Handles any customization price
✅ **Hidden from customers** - Service product is draft/hidden
✅ **No maintenance** - System manages everything

## Alternative: Manual Setup

If you prefer manual control, see `FIX_CART_PRICING.md` for step-by-step instructions to create the service product manually.
