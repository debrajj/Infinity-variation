# Fix Cart Pricing - Quick Setup

## The Issue
Your cart shows ₹288.00 instead of ₹303.00 because the customization add-ons (₹15.00) aren't being added to the cart total.

## The Solution
Shopify doesn't allow apps to modify product prices directly. The workaround is to add a separate "service fee" product to the cart.

## Setup Steps

### 1. Create the Customization Service Product in Shopify

1. **Go to Shopify Admin** → Products → Add product

2. **Fill in the details:**
   - **Title**: `Product Customization Service`
   - **Price**: `1.00` (₹1.00)
   - **Description**: 
     ```
     This is an automatic service fee for product customizations. 
     This product is managed by the Infinite Product Options app.
     Do not purchase separately.
     ```
   - **Status**: **DRAFT** (important - keeps it hidden from customers)
   - **Tags**: `customization-service`, `hidden`, `app-managed`
   - **Requires shipping**: NO (uncheck this)
   - **Track quantity**: NO (uncheck this)

3. **Save the product**

4. **Get the Variant ID:**
   - After saving, click on the product
   - Click on the variant (should show "Default Title")
   - Look at the URL: `.../variants/[VARIANT_ID]`
   - Copy that number (e.g., `45678901234567`)

### 2. Add to Your Server Environment

**Option A: If using Render.com**
1. Go to https://dashboard.render.com
2. Click on your service: `infinity-variation`
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   - **Key**: `CUSTOMIZATION_SERVICE_VARIANT_ID`
   - **Value**: Your variant ID (the number you copied)
6. Click "Save Changes" (this will redeploy)

**Option B: If running locally**
1. Open `.env.local` file
2. Add this line:
   ```
   CUSTOMIZATION_SERVICE_VARIANT_ID=your_variant_id_here
   ```
3. Restart your server

### 3. How It Works Now

When a customer adds a product with ₹15 in customizations:

1. **Main Product** → Cart: ₹288.00
2. **Customization Service** (qty 15 × ₹1) → Cart: ₹15.00
3. **Total**: ₹303.00 ✅

The cart will show:
```
Space Theme Pencil Box                    ₹288.00
Product Customization Service (×15)       ₹15.00
---------------------------------------------------
Subtotal                                  ₹303.00
```

### 4. Test It

1. Complete steps 1-2 above
2. Go to your store
3. Add a product with customizations (like the pencil box with printing)
4. Check cart - you should see both items with correct total!

## Advanced: Use Smaller Price Unit

If you want cleaner quantities in cart, set the service product price to `0.01` (1 paisa):

1. Change product price to ₹0.01
2. Add environment variable:
   ```
   CUSTOMIZATION_SERVICE_PRICE=0.01
   ```
3. Now ₹15 add-on = qty 1500 × ₹0.01 = ₹15.00

## Troubleshooting

**Cart still shows wrong total?**
- Check browser console (F12) for errors
- Verify the variant ID is correct
- Make sure the service product is DRAFT status
- Clear your browser cache and try again

**Service product showing in store?**
- Make sure status is DRAFT
- Add tags: `hidden`, `customization-service`
- Some themes may need additional CSS to hide it

**Need help?**
Check the server logs at https://dashboard.render.com for any errors when adding to cart.
