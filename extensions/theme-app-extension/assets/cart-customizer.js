/**
 * Cart Customizer - Hide Service Product and Display Addon Pricing Cleanly
 */

(function() {
  'use strict';
  
  console.log('🛒 Cart Customizer: Initializing...');
  
  function customizeCart() {
    console.log('🔍 Scanning cart items...');
    
    // Find all cart items
    const selectors = [
      '.cart-item',
      '.cart__row', 
      'tr[data-line-item]',
      '[data-cart-item]',
      '.cart-item-row',
      'tbody tr'
    ];
    
    const allItems = [];
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(item => {
        if (!allItems.includes(item)) {
          allItems.push(item);
        }
      });
    });
    
    console.log(`📦 Found ${allItems.length} cart items`);
    
    allItems.forEach(item => {
      // Find title element
      const titleSelectors = [
        'a[href*="product"]',
        '.cart-item__name',
        '.cart__product-title',
        '.product-title',
        '[data-cart-item-title]',
        'td.cart__meta a',
        '.cart-item__details a'
      ];
      
      let titleElement = null;
      for (const sel of titleSelectors) {
        titleElement = item.querySelector(sel);
        if (titleElement) break;
      }
      
      if (titleElement) {
        const title = titleElement.textContent || '';
        
        // Check if this is the service product
        if (title.includes('Product Customization Service') || 
            title.includes('Customization Service')) {
          
          console.log('✅ Found service product - hiding it');
          
          // Hide the entire line item
          item.style.display = 'none';
          item.classList.add('hidden-service-product');
        }
      }
    });
    
    // Add addon pricing display to cart summary
    addAddonSummary();
  }
  
  function addAddonSummary() {
    // Get cart data
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        console.log('🛒 Cart loaded');
        
        // Find service product items
        const serviceItems = cart.items.filter(item => 
          item.title.includes('Product Customization Service') || 
          item.title.includes('Customization Service')
        );
        
        if (serviceItems.length === 0) {
          console.log('ℹ️ No addon pricing');
          return;
        }
        
        // Calculate total addon price
        let addonTotal = 0;
        serviceItems.forEach(item => {
          addonTotal += (item.final_line_price / 100);
        });
        
        console.log('💰 Addon total:', addonTotal);
        
        // Find cart subtotal area
        const subtotalSelectors = [
          '.cart__footer',
          '.cart-footer',
          '.totals',
          '[data-cart-subtotal]',
          '.cart__subtotal'
        ];
        
        let subtotalContainer = null;
        for (const sel of subtotalSelectors) {
          subtotalContainer = document.querySelector(sel);
          if (subtotalContainer) {
            console.log('✅ Found subtotal container:', sel);
            break;
          }
        }
        
        if (subtotalContainer && !document.querySelector('.addon-pricing-summary')) {
          // Create addon pricing summary
          const addonSummary = document.createElement('div');
          addonSummary.className = 'addon-pricing-summary';
          addonSummary.style.cssText = `
            padding: 15px;
            background: #f0f8ff;
            border: 2px solid #4CAF50;
            border-radius: 8px;
            margin-bottom: 15px;
          `;
          addonSummary.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; color: #2e7d32;">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle; margin-right: 5px;">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Customization Add-ons Included
              </span>
              <span style="font-weight: 700; color: #2e7d32; font-size: 1.1rem;">
                Rs. ${addonTotal.toFixed(2)}
              </span>
            </div>
          `;
          
          // Insert at the beginning of subtotal container
          subtotalContainer.insertBefore(addonSummary, subtotalContainer.firstChild);
          
          console.log('✅ Added addon pricing summary');
        }
      })
      .catch(error => {
        console.error('❌ Error:', error);
      });
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
