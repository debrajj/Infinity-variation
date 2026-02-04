# Quick Cart Fix - Hide Customization Service Items

## The Problem
The "Product Customization Service" items are showing as separate line items in the cart with their quantity and price visible.

## Quick Solution (Copy & Paste)

Add this code to your theme's `layout/theme.liquid` file, right before the closing `</body>` tag:

```liquid
{% if template == 'cart' %}
<style>
/* Hide Product Customization Service line items completely */
.cart-item:has([href*="product-customization-service"]),
.cart__row:has([href*="product-customization-service"]),
tr:has([href*="product-customization-service"]),
[data-cart-item]:has([href*="product-customization-service"]) {
  display: none !important;
}

/* Alternative selector - by product title */
.cart-item__name:contains("Product Customization Service"),
.cart__product-title:contains("Product Customization Service") {
  display: none !important;
}

/* Hide parent row if title contains the text */
.cart-item:has(.cart-item__name),
.cart__row:has(.cart__product-title) {
  &:has([title*="Product Customization Service"]) {
    display: none !important;
  }
}
</style>

<script>
(function() {
  'use strict';
  
  function hideCustomizationServiceItems() {
    // Find all cart items
    const selectors = [
      '.cart-item',
      '.cart__row', 
      'tr[data-line-item]',
      '[data-cart-item]',
      '.cart-item-row'
    ];
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(item => {
        // Check if this item is a customization service
        const titleElement = item.querySelector('a[href*="product"], .cart-item__name, .cart__product-title, .product-title, [data-cart-item-title]');
        
        if (titleElement) {
          const title = titleElement.textContent || titleElement.getAttribute('title') || '';
          const href = titleElement.getAttribute('href') || '';
          
          if (title.includes('Product Customization Service') || 
              title.includes('Customization Service') ||
              href.includes('product-customization-service')) {
            console.log('Hiding customization service item:', title);
            item.style.display = 'none';
            item.setAttribute('data-hidden-customization', 'true');
          }
        }
      });
    });
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideCustomizationServiceItems);
  } else {
    hideCustomizationServiceItems();
  }
  
  // Run again after AJAX cart updates
  document.addEventListener('cart:updated', hideCustomizationServiceItems);
  
  // Watch for DOM changes (for dynamic carts)
  const observer = new MutationObserver(hideCustomizationServiceItems);
  observer.observe(document.body, { childList: true, subtree: true });
})();
</script>
{% endif %}
```

## How to Apply

1. **Go to Shopify Admin**
2. **Online Store → Themes**
3. **Click "Actions" → "Edit code"**
4. **Find `layout/theme.liquid`** in the left sidebar
5. **Scroll to the bottom** and find `</body>`
6. **Paste the code above** right before `</body>`
7. **Click "Save"**

## Result

✅ "Product Customization Service" items will be completely hidden from cart
✅ Quantity and price columns won't show for these items
✅ Subtotal will still include the customization prices correctly
✅ Only the main product will be visible with its customization details in properties

## Alternative: If You Want to Show Customization Details

If you want to show what customizations were selected (but still hide the service product), replace the script with this:

```javascript
<script>
(function() {
  'use strict';
  
  function processCart() {
    const customizations = new Map();
    
    // Find and hide customization service items, but collect their data
    document.querySelectorAll('.cart-item, .cart__row, [data-cart-item]').forEach(item => {
      const titleElement = item.querySelector('a[href*="product"], .cart-item__name, .cart__product-title');
      
      if (titleElement && titleElement.textContent.includes('Product Customization Service')) {
        // Hide this item
        item.style.display = 'none';
        
        // Extract customization details from properties
        const properties = item.querySelectorAll('.product-option, [data-cart-item-property]');
        let forProduct = '';
        let customTitle = '';
        
        properties.forEach(prop => {
          const text = prop.textContent.trim();
          if (text.includes('_for_product:')) {
            forProduct = text.split(':')[1].trim();
          } else if (text.includes('Title:')) {
            customTitle = text.split(':')[1].trim();
          }
        });
        
        if (forProduct && customTitle) {
          if (!customizations.has(forProduct)) {
            customizations.set(forProduct, []);
          }
          customizations.get(forProduct).push(customTitle);
        }
      }
    });
    
    // Add customization details to main products
    customizations.forEach((titles, productName) => {
      document.querySelectorAll('.cart-item, .cart__row, [data-cart-item]').forEach(item => {
        const titleElement = item.querySelector('a[href*="product"], .cart-item__name, .cart__product-title');
        
        if (titleElement && titleElement.textContent.includes(productName)) {
          // Check if summary already exists
          if (!item.querySelector('.customization-summary')) {
            const summary = document.createElement('div');
            summary.className = 'customization-summary';
            summary.style.cssText = 'background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 12px; margin-top: 10px;';
            summary.innerHTML = `
              <strong style="display: block; margin-bottom: 8px; font-size: 0.9rem;">Customizations:</strong>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85rem; color: #666;">
                ${titles.map(t => `<li style="padding: 3px 0;">• ${t}</li>`).join('')}
              </ul>
            `;
            item.appendChild(summary);
          }
        }
      });
    });
  }
  
  // Run on load and after updates
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processCart);
  } else {
    processCart();
  }
  
  document.addEventListener('cart:updated', processCart);
  
  const observer = new MutationObserver(processCart);
  observer.observe(document.body, { childList: true, subtree: true });
})();
</script>
```

This will show the customization options in a nice box under the main product!
