/**
 * Cart Addon Display - Shows addon pricing in cart and updates totals
 * This script modifies the cart display to show addon pricing like Globo
 */

(function() {
  'use strict';
  
  console.log('💰 Cart Addon Display: Initializing...');
  
  function updateCartWithAddons() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        console.log('🛒 Cart loaded:', cart);
        
        // Find items with addon pricing
        let totalAddons = 0;
        const itemsWithAddons = [];
        
        cart.items.forEach(item => {
          if (item.properties && item.properties._addon_total) {
            const addonAmount = parseFloat(item.properties._addon_total);
            if (!isNaN(addonAmount) && addonAmount > 0) {
              totalAddons += addonAmount;
              itemsWithAddons.push({
                key: item.key,
                title: item.title,
                addonAmount: addonAmount,
                currency: item.properties._addon_currency || 'Rs.'
              });
            }
          }
        });
        
        console.log('💎 Total addons:', totalAddons);
        console.log('📦 Items with addons:', itemsWithAddons);
        
        if (totalAddons > 0 && itemsWithAddons.length > 0) {
          displayAddonPricing(cart, itemsWithAddons, totalAddons);
        }
      })
      .catch(error => {
        console.error('❌ Error loading cart:', error);
      });
  }
  
  function displayAddonPricing(cart, itemsWithAddons, totalAddons) {
    // Get currency from first item
    const currency = itemsWithAddons[0].currency;
    
    // Calculate totals
    const baseSubtotal = cart.total_price / 100;
    const finalTotal = baseSubtotal + totalAddons;
    
    console.log('💰 Base subtotal:', baseSubtotal);
    console.log('💰 Addon total:', totalAddons);
    console.log('💰 Final total:', finalTotal);
    
    // Find cart items and add addon display
    itemsWithAddons.forEach(item => {
      // Find the cart item row
      const itemSelectors = [
        `[data-cart-item-key="${item.key}"]`,
        `[data-line-item-key="${item.key}"]`,
        `.cart-item[data-key="${item.key}"]`,
        `.cart__item[data-key="${item.key}"]`
      ];
      
      let itemElement = null;
      for (const selector of itemSelectors) {
        itemElement = document.querySelector(selector);
        if (itemElement) break;
      }
      
      if (itemElement && !itemElement.querySelector('.addon-pricing-note')) {
        // Add addon pricing note below the item
        const addonNote = document.createElement('div');
        addonNote.className = 'addon-pricing-note';
        addonNote.style.cssText = `
          padding: 8px 12px;
          background: #fff3cd;
          border-left: 3px solid #ffc107;
          margin-top: 8px;
          font-size: 0.9rem;
          color: #856404;
        `;
        addonNote.innerHTML = `
          <strong>⚠️ Note:</strong> Customization add-ons (+${currency}${item.addonAmount.toFixed(2)}) 
          will be added at checkout. Total: ${currency}${(baseSubtotal + totalAddons).toFixed(2)}
        `;
        
        // Find the item details container
        const detailsContainer = itemElement.querySelector('.cart-item__details, .cart__item-details, .cart-item-details');
        if (detailsContainer) {
          detailsContainer.appendChild(addonNote);
        } else {
          itemElement.appendChild(addonNote);
        }
      }
    });
    
    // Update subtotal display
    const subtotalSelectors = [
      '.cart__subtotal',
      '.cart-subtotal',
      '[data-cart-subtotal]',
      '.totals__subtotal',
      '.cart__footer'
    ];
    
    let subtotalContainer = null;
    for (const selector of subtotalSelectors) {
      subtotalContainer = document.querySelector(selector);
      if (subtotalContainer) {
        console.log('✅ Found subtotal container:', selector);
        break;
      }
    }
    
    if (subtotalContainer && !document.querySelector('.addon-total-display')) {
      // Create addon total display
      const addonDisplay = document.createElement('div');
      addonDisplay.className = 'addon-total-display';
      addonDisplay.style.cssText = `
        padding: 15px;
        background: #f8f9fa;
        border: 2px solid #e64a5d;
        border-radius: 8px;
        margin: 15px 0;
      `;
      addonDisplay.innerHTML = `
        <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #dee2e6;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666;">Cart Subtotal:</span>
            <span style="font-weight: 600;">${currency}${baseSubtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #e64a5d; font-weight: 600;">Customization Add-ons:</span>
            <span style="color: #e64a5d; font-weight: 700;">+${currency}${totalAddons.toFixed(2)}</span>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 1.2rem; font-weight: 700;">Estimated Total:</span>
          <span style="font-size: 1.3rem; font-weight: 700; color: #e64a5d;">${currency}${finalTotal.toFixed(2)}</span>
        </div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #dee2e6; font-size: 0.85rem; color: #666;">
          <strong>Note:</strong> Addon pricing will be calculated at checkout. Please review your order before completing payment.
        </div>
      `;
      
      // Insert before checkout button
      const checkoutButton = subtotalContainer.querySelector('button[name="checkout"], .cart__checkout-button, [data-cart-checkout], input[name="checkout"]');
      if (checkoutButton) {
        checkoutButton.parentNode.insertBefore(addonDisplay, checkoutButton);
      } else {
        subtotalContainer.appendChild(addonDisplay);
      }
      
      console.log('✅ Addon total display added');
    }
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCartWithAddons);
  } else {
    updateCartWithAddons();
  }
  
  // Run after cart updates
  document.addEventListener('cart:updated', updateCartWithAddons);
  
  // Watch for AJAX cart updates
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(this, args).then(response => {
      if (args[0] && (args[0].includes('/cart/') || args[0].includes('cart.js'))) {
        setTimeout(updateCartWithAddons, 500);
      }
      return response;
    });
  };
  
  console.log('✅ Cart Addon Display: Ready');
})();
