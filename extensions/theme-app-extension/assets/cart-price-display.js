/**
 * Cart Price Display - Globo Style
 * Automatically displays addon pricing in cart without backend products
 */

(function() {
  'use strict';
  
  console.log('💰 Cart Price Display: Initializing...');
  
  function displayAddonPricing() {
    // Get cart data
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        console.log('🛒 Cart data:', cart);
        
        // Check if there are addon prices in cart attributes
        const addonTotal = parseFloat(cart.attributes._addon_total || 0);
        const addonCurrency = cart.attributes._addon_currency || 'Rs.';
        
        console.log('💰 Addon total from cart:', addonTotal);
        
        if (addonTotal > 0) {
          // Find the subtotal element
          const subtotalSelectors = [
            '.cart__subtotal',
            '.cart-subtotal',
            '[data-cart-subtotal]',
            '.totals__subtotal'
          ];
          
          let subtotalElement = null;
          for (const selector of subtotalSelectors) {
            subtotalElement = document.querySelector(selector);
            if (subtotalElement) break;
          }
          
          if (subtotalElement) {
            // Get current subtotal
            const currentSubtotal = cart.total_price / 100;
            const newSubtotal = currentSubtotal + addonTotal;
            
            console.log('💰 Current subtotal:', currentSubtotal);
            console.log('💰 New subtotal with addons:', newSubtotal);
            
            // Create addon display element
            const addonDisplay = document.createElement('div');
            addonDisplay.className = 'cart-addon-pricing';
            addonDisplay.style.cssText = `
              padding: 10px 0;
              border-top: 1px solid #e5e5e5;
              margin-top: 10px;
            `;
            addonDisplay.innerHTML = `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Customization Add-ons:</span>
                <span style="font-weight: 600; color: #e64a5d;">${addonCurrency}${addonTotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #e5e5e5;">
                <span style="font-weight: 700; font-size: 1.1rem;">Total:</span>
                <span style="font-weight: 700; font-size: 1.1rem; color: #e64a5d;">${addonCurrency}${newSubtotal.toFixed(2)}</span>
              </div>
            `;
            
            // Insert after subtotal
            subtotalElement.parentNode.insertBefore(addonDisplay, subtotalElement.nextSibling);
            
            console.log('✅ Addon pricing displayed in cart');
          } else {
            console.warn('⚠️ Could not find subtotal element');
          }
        } else {
          console.log('ℹ️ No addons in cart');
        }
      })
      .catch(error => {
        console.error('❌ Error fetching cart:', error);
      });
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayAddonPricing);
  } else {
    displayAddonPricing();
  }
  
  // Run after cart updates
  document.addEventListener('cart:updated', displayAddonPricing);
  
  console.log('✅ Cart Price Display: Ready');
})();
