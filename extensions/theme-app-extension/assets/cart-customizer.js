/**
 * Cart Customizer - Hide Service Product and Display Addon Pricing Cleanly
 */

(function() {
  'use strict';
  
  console.log('🛒 Cart Customizer: Initializing...');
  
  function customizeCart() {
    console.log('🔍 Scanning cart items...');
    
    // Get cart data first
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        console.log('🛒 Cart loaded');
        
        // Find service product items by checking properties
        const serviceItems = cart.items.filter(item => 
          item.properties && item.properties._hide_in_cart === 'true'
        );
        
        if (serviceItems.length === 0) {
          console.log('ℹ️ No service products to hide');
          return;
        }
        
        console.log('💎 Found', serviceItems.length, 'service products to hide');
        
        // Hide each service product by its key
        serviceItems.forEach(serviceItem => {
          console.log('🔍 Hiding service item:', serviceItem.key);
          
          // Find the cart item element by key
          const selectors = [
            `[data-cart-item-key="${serviceItem.key}"]`,
            `[data-line-item-key="${serviceItem.key}"]`,
            `[data-key="${serviceItem.key}"]`,
            `.cart-item[data-key="${serviceItem.key}"]`,
            `.cart__row[data-key="${serviceItem.key}"]`,
            `tr[data-key="${serviceItem.key}"]`
          ];
          
          selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
              el.style.display = 'none';
              el.classList.add('hidden-service-product');
              console.log('✅ Hidden element:', selector);
            });
          });
          
          // Also try to find by title
          const allItems = document.querySelectorAll('.cart-item, .cart__row, tr[data-line-item]');
          allItems.forEach(item => {
            const titleEl = item.querySelector('a[href*="product"], .cart-item__name, .product-title');
            if (titleEl && titleEl.textContent.includes('Product Customization Service')) {
              item.style.display = 'none';
              item.classList.add('hidden-service-product');
              console.log('✅ Hidden by title match');
            }
          });
        });
        
        // Add addon summary to main products
        addAddonSummary(cart, serviceItems);
      })
      .catch(error => {
        console.error('❌ Error:', error);
      });
  }
  
  function addAddonSummary(cart, serviceItems) {
    if (!serviceItems || serviceItems.length === 0) return;
    
    // Calculate total addon price
    let addonTotal = 0;
    serviceItems.forEach(item => {
      addonTotal += (item.final_line_price / 100);
    });
    
    console.log('💰 Addon total:', addonTotal);
    
    // Find the main product items (not service products)
    const mainItems = cart.items.filter(item => 
      !item.properties || item.properties._hide_in_cart !== 'true'
    );
    
    // Add addon note to the first main product
    if (mainItems.length > 0) {
      const mainItem = mainItems[0];
      
      // Find the cart item element
      const selectors = [
        `[data-cart-item-key="${mainItem.key}"]`,
        `[data-line-item-key="${mainItem.key}"]`,
        `[data-key="${mainItem.key}"]`
      ];
      
      let mainItemElement = null;
      for (const sel of selectors) {
        mainItemElement = document.querySelector(sel);
        if (mainItemElement) break;
      }
      
      if (mainItemElement && !mainItemElement.querySelector('.addon-pricing-badge')) {
        // Add addon pricing badge
        const badge = document.createElement('div');
        badge.className = 'addon-pricing-badge';
        badge.style.cssText = `
          display: inline-block;
          padding: 6px 12px;
          background: #4CAF50;
          color: white;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 8px;
        `;
        badge.innerHTML = `✓ Customization Add-ons: Rs. ${addonTotal.toFixed(2)}`;
        
        // Find the best place to insert
        const detailsContainer = mainItemElement.querySelector('.cart-item__details, .cart__item-details, [class*="item-details"]');
        if (detailsContainer) {
          detailsContainer.appendChild(badge);
        } else {
          mainItemElement.appendChild(badge);
        }
        
        console.log('✅ Added addon badge');
      }
    }
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', customizeCart);
  } else {
    customizeCart();
  }
  
  // Run after cart updates
  document.addEventListener('cart:updated', customizeCart);
  document.addEventListener('cart:refresh', customizeCart);
  
  // Watch for DOM changes
  const observer = new MutationObserver(() => {
    clearTimeout(window.cartCustomizerTimeout);
    window.cartCustomizerTimeout = setTimeout(customizeCart, 100);
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  console.log('✅ Cart Customizer: Ready');
})();
