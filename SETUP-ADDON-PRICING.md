# Addon Pricing Setup Guide

## How It Works (Like Globo)

When a customer adds a product with customization options:
1. **Main Product** is added to cart with selected options as properties
2. **Service Product** ("Product Customization Service") is automatically added with the addon price
3. Cart shows both items, and the total includes the addon pricing
4. At checkout, the full amount (base + addons) is charged

## Automatic Setup

The app will automatically create the service product when first accessed. Just ensure these environment variables are set on Render.com:

```
SHOPIFY_SHOP_DOMAIN=cmstesting.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_a77781be556e061918...
```

The app will:
- Create "Product Customization Service" product
- Set price to Rs. 0.01 (used as multiplier)
- Configure it as a service (no shipping, no inventory tracking)
- Return the variant ID automatically

## Manual Setup (If Automatic Fails)

1. **Create Product in Shopify Admin**:
   - Go to Products → Add product
   - Title: `Product Customization Service`
   - Price: `0.01` (Rs. 0.01)
   - Uncheck "Track quantity"
   - Uncheck "This is a physical product"
   - Uncheck "Charge tax on this product"
   - Save product

2. **Get Variant ID**:
   - Open the product
   - Click on the variant
   - Copy the ID from the URL (e.g., `/variants/1234567890`)

3. **Add to Render Environment**:
   - Go to Render.com dashboard
   - Open your service
   - Go to Environment
   - Add: `CUSTOMIZATION_SERVICE_VARIANT_ID=1234567890`
   - Save changes

## How Pricing Works

The service product uses **quantity as a price multiplier**:
- Service product price: Rs. 0.01
- Addon total: Rs. 20.00
- Quantity added: 2000 (20.00 × 100)
- Cart shows: Rs. 20.00 (2000 × 0.01)

This is the same approach used by Globo and other addon pricing apps.

## Troubleshooting

### Error: "Cart Error" 422
- The variant ID is invalid or product doesn't exist
- Follow manual setup steps above

### Service product not appearing in cart
- Check browser console for errors
- Verify SHOPIFY_ACCESS_TOKEN has correct permissions
- Ensure product is published to "Online Store" sales channel

### Addon price not calculating
- Check that options have `addPrice` values set
- Verify service product variant ID is correct
- Check browser console for API errors

## Testing

1. Go to a product with customization options
2. Select options with addon prices (e.g., "YES +Rs. 15.00")
3. Click "Add to Cart"
4. Cart should show:
   - Main product (e.g., Rs. 250.00)
   - Product Customization Service (e.g., Rs. 20.00)
   - Total: Rs. 270.00

## Next Steps

After setup is complete:
1. Test with different addon combinations
2. Verify checkout totals are correct
3. Place a test order to confirm payment processing
4. Customize the service product title/description if needed
