# Globo-Style Addon Pricing Setup

## How It Works (Exactly Like Globo)

Your app now works **exactly like Globo Product Options**:

1. Customer selects product with customization options
2. Addon prices are calculated (e.g., Printing +Rs. 15, Envelope +Rs. 5 = Rs. 20 total)
3. When added to cart, **TWO line items** appear:
   - **Main Product** (e.g., Wedding Card - Rs. 250.00)
   - **Product Customization Service** (e.g., Rs. 20.00) ← This is the addon total
4. Cart subtotal = Rs. 270.00 (base + addons)
5. Checkout total = Rs. 270.00 (correct amount charged)

## One-Time Setup Required

You need to create a "service product" in Shopify that represents the addon pricing.

### Option 1: Automatic Setup (Recommended)

Run this command from your project directory:

```bash
npm run setup-service
```

This will:
- Create "Product Customization Service" product in your Shopify store
- Set price to Rs. 0.01 (used as multiplier)
- Configure it as a service (no shipping, no inventory)
- Display the Variant ID you need

Then:
1. Copy the Variant ID from the output
2. Go to Render.com → Your Service → Environment
3. Add: `CUSTOMIZATION_SERVICE_VARIANT_ID=<the_variant_id>`
4. Save (Render will auto-redeploy)

### Option 2: Manual Setup

If automatic setup doesn't work:

1. **Create Product in Shopify Admin**:
   - Go to Products → Add product
   - Title: `Product Customization Service`
   - Description: `Customization add-ons for your products`
   - Price: `0.01` (Rs. 0.01)
   - Uncheck "Track quantity"
   - Uncheck "This is a physical product"
   - Uncheck "Charge tax on this product"
   - Tags: `customization-service, app-managed`
   - Save product

2. **Get Variant ID**:
   - Open the product you just created
   - Look at the URL: `.../products/<product_id>`
   - Click on the variant
   - Copy the variant ID from the URL: `.../variants/<variant_id>`

3. **Add to Render Environment**:
   - Go to Render.com dashboard
   - Open your service: `infinity-variation`
   - Go to **Environment** tab
   - **Remove** old invalid ID if present: `CUSTOMIZATION_SERVICE_VARIANT_ID=8997742126884`
   - **Add new**: `CUSTOMIZATION_SERVICE_VARIANT_ID=<your_new_variant_id>`
   - Click "Save Changes"
   - Wait for redeploy (2-3 minutes)

## How the Pricing Math Works

The service product uses **quantity as a price multiplier**:

- Service product price: **Rs. 0.01**
- Addon total: **Rs. 20.00**
- Quantity added to cart: **2000** (20.00 × 100)
- Cart shows: **Rs. 20.00** (2000 × 0.01)

This is the exact same method used by Globo and other professional addon pricing apps.

## Testing

1. Clear your cart
2. Go to a product with customization options
3. Select options with addon prices:
   - PRINTING: YES (+Rs. 15.00)
   - Envelope Color: Gold (+Rs. 5.00)
4. Click "Add to Cart"
5. Cart should show:
   ```
   Wedding Card (Blue/White)          Rs. 250.00
   Product Customization Service      Rs. 20.00
   ----------------------------------------
   Subtotal:                          Rs. 270.00
   ```

## Troubleshooting

### Error: "Cart Error" 422
**Cause**: Invalid or missing variant ID

**Fix**: 
- Remove old `CUSTOMIZATION_SERVICE_VARIANT_ID` from Render
- Run `npm run setup-service` to create new product
- Add new variant ID to Render environment

### Service product not appearing in cart
**Cause**: Variant ID not configured or incorrect

**Fix**:
- Check Render environment has `CUSTOMIZATION_SERVICE_VARIANT_ID`
- Verify the variant ID exists in your Shopify store
- Check browser console for error messages

### Addon price calculating wrong
**Cause**: Options don't have `addPrice` values

**Fix**:
- Go to admin panel
- Edit option set
- Ensure each option value has a price (e.g., 15.00)
- Save and test again

### Service product showing in storefront
**Cause**: Product is published to sales channel

**Fix**:
- Go to Shopify admin → Products
- Find "Product Customization Service"
- Under "Sales channels", uncheck "Online Store"
- Save

## Why This Approach?

Shopify's cart API doesn't allow custom line item prices. The only way to add dynamic pricing is to:

1. **Use a service product** (what we do - same as Globo) ✅
2. **Use Shopify Plus Scripts** (requires Shopify Plus subscription) ❌
3. **Use Draft Orders API** (complex, requires custom checkout) ❌

Our approach is the industry standard used by all major product options apps.

## Support

If you're still having issues:

1. Check browser console for errors
2. Check Render logs for server errors
3. Verify all environment variables are set correctly
4. Ensure Shopify access token has correct permissions

The app is now configured to work exactly like Globo!
