# How Globo Product Options Works (Without Backend Products)

## The Problem
You're seeing "Printing" and "Pasting and Assembly" as separate line items in your cart, but Globo doesn't create any backend products for Rs. 1.00. How do they do it?

## Globo's Approach

### Method 1: Line Item Properties + Theme Modification
1. **Add main product** with all customization details in properties
2. **Store addon price** in a special property like `_addon_price`
3. **Theme liquid code** reads the `_addon_price` property
4. **Display it** as a separate visual line in the cart (but it's not a real product)
5. **JavaScript** adds the addon price to the displayed total

**Limitations:**
- ❌ Shopify's actual subtotal doesn't include addon price
- ❌ Checkout total is wrong
- ❌ Payment gateway sees wrong amount
- ❌ Not a real solution

### Method 2: Draft Orders API (Globo's Real Method)
1. Customer adds product with customizations
2. **Instead of using cart**, Globo creates a **Draft Order** via API
3. Draft Order includes:
   - Main product line
   - Custom line items for addons (created programmatically)
4. Customer is redirected to checkout with the draft order
5. Shopify processes it as a normal order

**Advantages:**
- ✅ Real line items in checkout
- ✅ Correct pricing everywhere
- ✅ No hidden products needed
- ✅ Professional solution

**Requirements:**
- Requires backend server
- More complex implementation
- Need to handle cart → draft order conversion

### Method 3: Shopify Functions (Shopify Plus Only)
If you have Shopify Plus, you can use **Cart Transform Functions** to:
- Dynamically add line items to cart
- Modify prices
- Add custom products

## Why You Need a Backend Product (For Now)

Since you don't have Shopify Plus and Draft Orders are complex, the **hidden product approach** is the standard workaround used by:
- Bold Product Options
- Infinite Options
- Product Personalizer
- Most Shopify apps

## The Best Approach for Your App

I recommend implementing **Draft Orders** properly. Here's why:

1. **No hidden products needed**
2. **Clean cart experience**
3. **Correct pricing everywhere**
4. **Professional solution**
5. **Works like Globo**

Would you like me to implement the Draft Orders approach? It requires:
- Backend API endpoint to create draft orders
- Shopify Admin API access
- Redirect customer to draft order checkout

This is the RIGHT way to do it, and it's what Globo actually uses.
