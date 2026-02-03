# How to Add Customization Pricing to Cart

## The Problem
Shopify's cart API doesn't allow adding custom prices. Apps like "Product Options Pro" work around this by creating a hidden "fee" product.

## The Solution (What You Need to Do)

### Step 1: Create a Customization Fee Product

1. Go to Shopify Admin → Products → Add product

2. Fill in details:
   - **Title**: "Customization & Printing Service"
   - **Price**: ₹1.00
   - **Description**: "This is a service fee for product customization. Do not purchase separately."
   - **Status**: DRAFT (so customers can't see it in your store)
   - **Tags**: `customization-service`, `hidden`

3. Save the product

4. Get the Variant ID:
   - After saving, click on the product
   - Look at the URL: `.../products/[PRODUCT_ID]`
   - Or go to the variant and copy its ID

### Step 2: Add to Render Environment

1. Go to https://dashboard.render.com
2. Click on your service: `infinity-variation`
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add:
   - **Key**: `CUSTOMIZATION_SERVICE_VARIANT_ID`
   - **Value**: Your variant ID (the number you copied)
6. Click "Save Changes" (this will redeploy your app)

### Step 3: How It Works

When a customer adds a product with customizations:

1. **Main Product** added to cart: ₹959.00
2. **Customization Service** added with quantity = add-on price
   - If add-on is ₹15, it adds quantity 15 of the ₹1 service = ₹15
3. **Cart Total**: ₹959 + ₹15 = ₹974 ✓

The service product will show in cart as:
```
Product Name                    ₹959.00
Customization & Printing (×15)  ₹15.00
--------------------------------
Total                           ₹974.00
```

### Alternative: Use Quantity Multiplier

If you want cleaner display, set the service product price to ₹0.01 (1 paisa):
- For ₹15 add-on, add quantity 1500 (15.00 / 0.01)
- Shows as: "Customization Service (×1500) ₹15.00"

## Why This Works

- Shopify allows adding products with any quantity
- The quantity × price = your add-on cost
- All customization details are in line item properties
- Works on all Shopify plans (no Shopify Plus needed)
- Same method used by popular apps like Product Options Pro, Globo, etc.

## Testing

1. Complete steps 1-2 above
2. Go to your store
3. Add a product with customizations
4. Check cart - you should see both items with correct total!
