# Customization Service Product Setup

To properly handle customization add-on pricing in the cart, you need to create a special "Customization Service" product in Shopify.

## Steps:

1. **Create the Product in Shopify Admin:**
   - Go to Products → Add product
   - Title: "Product Customization Service"
   - Price: $0.01 (we'll update this dynamically)
   - Make it a hidden/draft product (customers shouldn't see it in your store)
   - Add a tag: `customization-service` (so we can identify it)

2. **Get the Variant ID:**
   - After creating the product, click on it
   - In the URL, you'll see something like: `/admin/products/1234567890`
   - The number is your product ID
   - Click on the variant to get the variant ID
   - Or use the API to get it

3. **Add to Environment Variables:**
   - In Render dashboard, add:
     - `CUSTOMIZATION_SERVICE_VARIANT_ID` = your variant ID

4. **How it works:**
   - Customer selects product + customizations
   - App adds main product to cart (with properties showing selections)
   - App adds "Customization Service" product with:
     - Quantity: 1
     - Price: Total add-on cost
     - Properties: All customization details
   - Cart shows:
     - Main Product: $24.99
     - Product Customization Service: $15.00 (grouped add-ons)
     - Total: $39.99

## Alternative: Line Item Properties Only

If you don't want a separate product, the current implementation adds all customization details as line item properties on the main product. However, this means:
- The add-on price won't be reflected in the cart total
- Customers see the base price only
- You'll need to manually adjust orders or use Shopify Scripts/Functions to add the cost

## Recommended: Use Shopify Functions (Shopify Plus)

For the best solution, use Shopify Functions to dynamically add the customization cost:
1. Create a Cart Transform function
2. Read the `_customization_total` property
3. Add that amount to the line item price
4. This way, the price updates automatically in cart/checkout
