/**
 * Cart Customizer - Hide Product Customization Service Items
 * This script automatically hides customization service line items in the cart
 * and groups customization details under the main product
 */

(function() {
  'use strict';
  
  console.log('🛒 Cart Customizer: Initializing...');
  
  function hideCustomizationServiceItems() {
    console.log('🔍 Scanning cart for customization service items...');
    
    let hiddenCount = 0;
    
    // Find all cart items using multiple selectors for compatibility
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
      // Find title element with multiple possible selectors
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
        const title = titleElement.textContent || titleElement.getAttribute('title') || '';
        const href = titleElement.getAttribute('href') || '';
        
        // Check if this is a customization service item
        if (title.includes('Product Customization') || 
            title.includes('Customization Service') ||
            href.includes('product-customization')) {
          
          console.log('✅ Found customization service item:', title);
          
          // Look for the "Title" property which contains the actual option name
          const propertySelectors = [
            '.product-option',
            '[data-cart-item-property]',
            '.cart-item__property',
            'dd',
            '.line-item-property'
          ];
          
          let optionTitle = null;
          propertySelectors.forEach(propSel => {
            item.querySelectorAll(propSel).forEach(prop => {
              const text = prop.textContent.trim();
              if (text.startsWith('Title:')) {
                optionTitle = text.replace('Title:', '').trim();
              }
            });
          });
          
          if (optionTitle) {
            console.log(`  📝 Replacing title with: ${optionTitle}`);
            // Replace the product title with the option name
            titleElement.textContent = optionTitle;
            
            // Hide the "Title:" property since we've used it
            propertySelectors.forEach(propSel => {
              item.querySelectorAll(propSel).forEach(prop => {
                if (prop.textContent.trim().startsWith('Title:')) {
                  prop.style.display = 'none';
                }
              });
            });
          }
          
          // Hide other internal properties
          propertySelectors.forEach(propSel => {
            item.querySelectorAll(propSel).forEach(prop => {
              const text = prop.textContent.trim();
              if (text.startsWith('_')) {
                prop.style.display = 'none';
              }
            });
          });
          
          hiddenCount++;
        }
      }
    });
    
    console.log(`✅ Processed ${hiddenCount} customization items`);
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideCustomizationServiceItems);
  } else {
    hideCustomizationServiceItems();
  }
  
  // Run again after AJAX cart updates
  document.addEventListener('cart:updated', hideCustomizationServiceItems);
  document.addEventListener('cart:refresh', hideCustomizationServiceItems);
  
  // Watch for DOM changes (for dynamic carts)
  const observer = new MutationObserver(function(mutations) {
    // Debounce to avoid running too frequently
    clearTimeout(window.cartCustomizerTimeout);
    window.cartCustomizerTimeout = setTimeout(hideCustomizationServiceItems, 100);
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  console.log('🎯 Cart Customizer: Ready');
})();
