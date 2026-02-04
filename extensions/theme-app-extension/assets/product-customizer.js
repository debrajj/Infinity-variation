/**
 * Infinite Product Options - Theme Extension
 * This script loads option sets from localStorage and renders the customizer
 * UPDATED: Each customization option with a price is added as a separate line item
 */

(function() {
  'use strict';

  window.InfiniteOptionsApp = {
    init: function(element) {
      const config = {
        productId: element.dataset.productId,
        productTitle: element.dataset.productTitle,
        productPrice: parseFloat(element.dataset.productPrice) / 100, // Convert from cents/paise to main currency
        variantId: element.dataset.variantId,
        shop: element.dataset.shop,
        primaryColor: element.dataset.primaryColor || '#e64a5d',
        showPrices: element.dataset.showPrices === 'true',
        currency: element.dataset.currency || 'Rs.'
      };

      console.log('🚀 Infinite Options: Initializing');
      console.log('📦 Product ID:', config.productId);
      console.log('📦 Product Title:', config.productTitle);
      console.log('💰 Product Price (raw):', element.dataset.productPrice);
      console.log('💰 Product Price (converted):', config.productPrice);
      console.log('💱 Currency:', config.currency);
      console.log('🏪 Shop:', config.shop);
      
      this.loadApp(element, config);
    },

    loadApp: function(element, config) {
      try {
        // Fetch option sets from API
        const apiUrl = window.location.hostname === 'localhost' 
          ? 'http://localhost:3000/api/storefront/option-sets'
          : 'https://infinity-variation.onrender.com/api/storefront/option-sets';
        
        const fullUrl = `${apiUrl}?productId=${config.productId}`;
        console.log('🌐 Fetching from:', fullUrl);
        
        fetch(fullUrl)
          .then(response => {
            console.log('📡 Response status:', response.status);
            if (!response.ok) {
              throw new Error('Failed to fetch option sets');
            }
            return response.json();
          })
          .then(data => {
            console.log('✅ API response:', data);
            console.log('📦 Option sets count:', data.optionSets ? data.optionSets.length : 0);
            
            if (data.optionSets && data.optionSets.length > 0) {
              console.log('🎨 Rendering option set:', data.optionSets[0].name);
              console.log('🔧 Options count:', data.optionSets[0].options.length);
              this.renderCustomizer(element, data.optionSets[0], config);
            } else {
              console.warn('⚠️ No matching option set for product', config.productId);
              element.innerHTML = '<div style="padding: 20px; text-align: center; background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; margin: 20px 0;"><p style="color: #856404; margin: 0;"><strong>No customization options available for this product.</strong></p><p style="color: #856404; margin: 10px 0 0 0; font-size: 0.9em;">Product ID: ' + config.productId + '</p></div>';
            }
          })
          .catch(error => {
            console.error('❌ Error loading options:', error);
            element.innerHTML = '<div style="padding: 20px; text-align: center; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; margin: 20px 0;"><p style="color: #721c24; margin: 0;"><strong>Error loading customization options.</strong></p><p style="color: #721c24; margin: 10px 0 0 0; font-size: 0.9em;">' + error.message + '</p></div>';
          });
      } catch (error) {
        console.error('❌ Error in loadApp:', error);
        element.innerHTML = '<div style="padding: 20px; text-align: center; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; margin: 20px 0;"><p style="color: #721c24; margin: 0;"><strong>Error initializing customizer.</strong></p></div>';
      }
    },

    renderCustomizer: function(element, optionSet, config) {
      let totalAddOnPrice = 0;
      const selections = {};

      // Hide default Shopify add to cart buttons
      this.hideDefaultAddToCart();

      // Build the customizer UI
      let html = `
        <div class="infinite-options-container" style="padding: 20px; background: #fff; border-radius: 12px;">
          <h3 style="margin: 0 0 20px 0; font-size: 1.5rem; font-weight: 600; color: #333;">${optionSet.name}</h3>
          <div class="infinite-options-form" id="infinite-options-form">
      `;

      optionSet.options.forEach((option, index) => {
        html += this.renderOption(option, index, config);
      });

      html += `
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 1rem; color: #666;">Base Product Price:</span>
                <span style="font-size: 1.2rem; font-weight: 600; color: #333;">${config.currency}${config.productPrice.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 1rem; color: #666;">Customization Add-ons:</span>
                <span id="total-addon-price" style="font-size: 1.2rem; font-weight: 600; color: ${config.primaryColor};">${config.currency}0.00</span>
              </div>
              <div style="border-top: 2px solid #dee2e6; margin: 15px 0; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 1.3rem; font-weight: 700; color: #000;">Total Price:</span>
                  <span id="total-final-price" style="font-size: 1.8rem; font-weight: 700; color: ${config.primaryColor};">${config.currency}${config.productPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button 
              id="infinite-add-to-cart" 
              style="width: 100%; padding: 18px; background: ${config.primaryColor}; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;"
              onmouseover="this.style.opacity='0.9'" 
              onmouseout="this.style.opacity='1'"
            >
              Add to Cart
            </button>
          </div>
        </div>
      `;

      element.innerHTML = html;

      // Attach event listeners
      this.attachEventListeners(element, optionSet, config);
    },

    hideDefaultAddToCart: function() {
      console.log('🚫 Hiding default Shopify add to cart buttons');
      
      // Common selectors for Shopify add to cart buttons
      const selectors = [
        'form[action*="/cart/add"] button[type="submit"]',
        'form[action*="/cart/add"] input[type="submit"]',
        '.product-form__submit',
        '.product-form button[name="add"]',
        'button[name="add"]',
        '.shopify-payment-button',
        '.dynamic-checkout__content',
        '[data-shopify="payment-button"]',
        '.product-form__buttons',
        '.product__add-to-cart'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = 'none';
          el.setAttribute('data-infinite-options-hidden', 'true');
          console.log('  ✓ Hidden:', selector);
        });
      });

      // Also hide parent containers if they only contain the button
      const containers = document.querySelectorAll('.product-form__buttons, .product-form__submit-wrapper');
      containers.forEach(container => {
        if (container.children.length === 1 || container.querySelector('[data-infinite-options-hidden]')) {
          container.style.display = 'none';
          console.log('  ✓ Hidden container');
        }
      });
    },

    renderOption: function(option, index, config) {
      if (option.type === 'divider') {
        return '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e5e5;" />';
      }

      if (option.type === 'heading') {
        return `<h4 style="margin: 20px 0 10px 0; font-size: 1.1rem; font-weight: 600; color: #333;">${option.label}</h4>`;
      }

      if (option.type === 'paragraph') {
        return `<p style="margin: 10px 0; color: #666; line-height: 1.6;">${option.label}</p>`;
      }

      let html = `
        <div class="infinite-option" style="margin-bottom: 25px;" data-option-id="${option.id}">
          <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #333;">
            ${option.label}
            ${option.isRequired ? '<span style="color: #e64a5d;">*</span>' : ''}
          </label>
      `;

      switch (option.type) {
        case 'text_input':
        case 'text':
          html += `<input type="text" class="option-input" data-option-id="${option.id}" placeholder="${option.placeholder || ''}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;" ${option.isRequired ? 'required' : ''} />`;
          break;

        case 'textarea':
          html += `<textarea class="option-input" data-option-id="${option.id}" placeholder="${option.placeholder || ''}" rows="4" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; resize: vertical;" ${option.isRequired ? 'required' : ''}></textarea>`;
          break;

        case 'number':
          html += `<input type="number" class="option-input" data-option-id="${option.id}" min="0" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;" ${option.isRequired ? 'required' : ''} />`;
          break;

        case 'radio':
        case 'button':
          html += '<div style="display: flex; flex-wrap: wrap; gap: 10px;">';
          option.values.forEach((value, vIndex) => {
            const priceText = config.showPrices && value.addPrice > 0 ? ` (+${config.currency}${value.addPrice.toFixed(2)})` : '';
            html += `
              <label style="flex: 1; min-width: 120px; padding: 12px; border: 2px solid #ddd; border-radius: 6px; cursor: pointer; text-align: center; transition: all 0.2s;" class="radio-option" data-price="${value.addPrice}">
                <input type="radio" name="option_${option.id}" value="${value.id}" data-option-id="${option.id}" data-price="${value.addPrice}" style="display: none;" ${option.isRequired && vIndex === 0 ? 'checked' : ''} />
                <span style="font-weight: 600;">${value.label}${priceText}</span>
              </label>
            `;
          });
          html += '</div>';
          break;

        case 'select':
        case 'dropdown':
          html += `<select class="option-input" data-option-id="${option.id}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;" ${option.isRequired ? 'required' : ''}>`;
          html += '<option value="">Select an option</option>';
          option.values.forEach(value => {
            const priceText = config.showPrices && value.addPrice > 0 ? ` (+${config.currency}${value.addPrice.toFixed(2)})` : '';
            html += `<option value="${value.id}" data-price="${value.addPrice}">${value.label}${priceText}</option>`;
          });
          html += '</select>';
          break;

        case 'checkbox':
          option.values.forEach(value => {
            const priceText = config.showPrices && value.addPrice > 0 ? ` (+${config.currency}${value.addPrice.toFixed(2)})` : '';
            html += `
              <label style="display: flex; align-items: center; gap: 10px; padding: 10px; cursor: pointer;">
                <input type="checkbox" value="${value.id}" data-option-id="${option.id}" data-price="${value.addPrice}" style="width: 20px; height: 20px;" />
                <span>${value.label}${priceText}</span>
              </label>
            `;
          });
          break;

        case 'color_swatch':
          html += '<div style="display: flex; flex-wrap: wrap; gap: 10px;">';
          option.values.forEach((value, vIndex) => {
            const priceText = config.showPrices && value.addPrice > 0 ? ` (+${config.currency}${value.addPrice.toFixed(2)})` : '';
            html += `
              <label style="cursor: pointer; text-align: center;" class="color-swatch" data-price="${value.addPrice}">
                <input type="radio" name="option_${option.id}" value="${value.id}" data-option-id="${option.id}" data-price="${value.addPrice}" style="display: none;" ${option.isRequired && vIndex === 0 ? 'checked' : ''} />
                <div style="width: 50px; height: 50px; background: ${value.color || '#ccc'}; border: 3px solid #ddd; border-radius: 8px; margin-bottom: 5px;"></div>
                <div style="font-size: 0.85rem;">${value.label}${priceText}</div>
              </label>
            `;
          });
          html += '</div>';
          break;

        case 'file_upload':
          html += `<input type="file" class="option-input" data-option-id="${option.id}" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px;" ${option.isRequired ? 'required' : ''} />`;
          break;
      }

      html += '</div>';
      return html;
    },

    attachEventListeners: function(element, optionSet, config) {
      const form = element.querySelector('#infinite-options-form');
      const totalAddonPriceEl = element.querySelector('#total-addon-price');
      const totalFinalPriceEl = element.querySelector('#total-final-price');
      const addToCartBtn = element.querySelector('#infinite-add-to-cart');

      // Calculate total price
      const calculateTotal = () => {
        let addonTotal = 0;
        
        // Radio buttons and color swatches
        form.querySelectorAll('input[type="radio"]:checked').forEach(input => {
          addonTotal += parseFloat(input.dataset.price || 0);
        });

        // Checkboxes
        form.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
          addonTotal += parseFloat(input.dataset.price || 0);
        });

        // Selects
        form.querySelectorAll('select.option-input').forEach(select => {
          const selectedOption = select.options[select.selectedIndex];
          if (selectedOption) {
            addonTotal += parseFloat(selectedOption.dataset.price || 0);
          }
        });

        const finalTotal = config.productPrice + addonTotal;
        
        totalAddonPriceEl.textContent = config.currency + addonTotal.toFixed(2);
        totalFinalPriceEl.textContent = config.currency + finalTotal.toFixed(2);
        
        console.log('💰 Price calculation:', {
          basePrice: config.productPrice,
          addons: addonTotal,
          total: finalTotal
        });
        
        return { addonTotal, finalTotal };
      };

      // Style radio/color swatch labels on selection
      form.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
          const parent = this.closest('.infinite-option');
          parent.querySelectorAll('label').forEach(label => {
            label.style.borderColor = '#ddd';
            label.style.background = '#fff';
          });
          this.closest('label').style.borderColor = config.primaryColor;
          this.closest('label').style.background = config.primaryColor + '10';
          calculateTotal();
        });
      });

      // Update total on any change
      form.addEventListener('change', calculateTotal);
      form.addEventListener('input', calculateTotal);

      // Initial calculation
      calculateTotal();

      // Add to cart handler
      addToCartBtn.addEventListener('click', async () => {
        console.log('🛒 Add to cart button clicked');
        
        const prices = calculateTotal();
        console.log('💰 Prices:', prices);
        
        // Validate required fields
        const requiredOptions = optionSet.options.filter(opt => opt.isRequired);
        let isValid = true;
        let missingFields = [];
        
        console.log('✅ Validating', requiredOptions.length, 'required fields');
        
        for (const opt of requiredOptions) {
          console.log('🔍 Checking field:', opt.label, 'Type:', opt.type, 'ID:', opt.id);
          
          if (opt.type === 'text_input' || opt.type === 'text' || opt.type === 'textarea' || opt.type === 'number') {
            const input = form.querySelector(`input[data-option-id="${opt.id}"], textarea[data-option-id="${opt.id}"]`);
            console.log('  Input element:', input);
            console.log('  Input value:', input ? input.value : 'NOT FOUND');
            
            if (!input) {
              console.log('  ❌ Input element not found!');
              isValid = false;
              missingFields.push(opt.label + ' (field not found)');
            } else if (!input.value || !input.value.trim()) {
              console.log('  ❌ Input value is empty');
              isValid = false;
              missingFields.push(opt.label);
            } else {
              console.log('  ✅ Field is filled:', input.value);
            }
          } else if (opt.type === 'radio' || opt.type === 'button' || opt.type === 'color_swatch') {
            const checked = form.querySelector(`input[name="option_${opt.id}"]:checked`);
            console.log('  Radio/button checked:', checked ? checked.value : 'NONE');
            
            if (!checked) {
              isValid = false;
              missingFields.push(opt.label);
              console.log('  ❌ No option selected');
            } else {
              console.log('  ✅ Option selected');
            }
          } else if (opt.type === 'select' || opt.type === 'dropdown') {
            const select = form.querySelector(`select[data-option-id="${opt.id}"]`);
            console.log('  Select value:', select ? select.value : 'NOT FOUND');
            
            if (!select || !select.value) {
              isValid = false;
              missingFields.push(opt.label);
              console.log('  ❌ No option selected');
            } else {
              console.log('  ✅ Option selected');
            }
          } else if (opt.type === 'file_upload') {
            const fileInput = form.querySelector(`input[type="file"][data-option-id="${opt.id}"]`);
            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
              isValid = false;
              missingFields.push(opt.label);
              console.log('  ❌ No file selected');
            } else {
              console.log('  ✅ File selected');
            }
          }
        }
        
        if (!isValid) {
          alert('Please fill in all required fields:\n\n' + missingFields.join('\n'));
          return;
        }
        
        console.log('✅ All required fields filled');
        
        // Collect all selections
        const properties = {};
        
        optionSet.options.forEach(opt => {
          if (opt.type === 'text_input' || opt.type === 'text' || opt.type === 'textarea' || opt.type === 'number') {
            const input = form.querySelector(`input[data-option-id="${opt.id}"], textarea[data-option-id="${opt.id}"]`);
            if (input && input.value) {
              properties[opt.label] = input.value;
            }
          } else if (opt.type === 'radio' || opt.type === 'button' || opt.type === 'color_swatch') {
            const checked = form.querySelector(`input[name="option_${opt.id}"]:checked`);
            if (checked) {
              const value = opt.values.find(v => v.id === checked.value);
              if (value) {
                properties[opt.label] = value.label + (value.addPrice > 0 ? ` (+${config.currency}${value.addPrice.toFixed(2)})` : '');
              }
            }
          } else if (opt.type === 'select' || opt.type === 'dropdown') {
            const select = form.querySelector(`select[data-option-id="${opt.id}"]`);
            if (select && select.value) {
              const value = opt.values.find(v => v.id === select.value);
              if (value) {
                properties[opt.label] = value.label + (value.addPrice > 0 ? ` (+${config.currency}${value.addPrice.toFixed(2)})` : '');
              }
            }
          } else if (opt.type === 'checkbox') {
            const checked = form.querySelectorAll(`input[data-option-id="${opt.id}"]:checked`);
            if (checked.length > 0) {
              const selectedValues = [];
              checked.forEach(cb => {
                const value = opt.values.find(v => v.id === cb.value);
                if (value) {
                  selectedValues.push(value.label + (value.addPrice > 0 ? ` (+${config.currency}${value.addPrice.toFixed(2)})` : ''));
                }
              });
              properties[opt.label] = selectedValues.join(', ');
            }
          }
        });
        
        console.log('📋 Properties:', properties);
        
        // Disable button during processing
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Adding to Cart...';
        
        try {
          // Ensure variant ID is a number or string without 'gid://'
          let variantId = config.variantId;
          
          // If it's a Shopify GID, extract the numeric ID
          if (typeof variantId === 'string' && variantId.includes('gid://')) {
            variantId = variantId.split('/').pop();
          }
          
          // Convert to number
          variantId = parseInt(variantId);
          
          console.log('🆔 Variant ID:', variantId);
          
          // Prepare items array for cart
          const items = [];
          
          // Add main product to cart with properties
          items.push({
            id: variantId,
            quantity: 1,
            properties: properties
          });
          
          console.log('🛒 Adding main product with properties');
          
          // If there are addons, add the customization service product
          if (prices.addonTotal > 0) {
            console.log('💎 Addon total:', prices.addonTotal, '- fetching service product...');
            
            // Fetch the customization service variant ID from backend
            const serviceApiUrl = window.location.hostname === 'localhost' 
              ? 'http://localhost:3000/api/customization-service'
              : 'https://infinity-variation.onrender.com/api/customization-service';
            
            try {
              const serviceResponse = await fetch(serviceApiUrl);
              const serviceData = await serviceResponse.json();
              
              console.log('📦 Service response:', serviceData);
              
              if (serviceData.variantId) {
                // Service product is Rs. 0.01, so quantity = addon total * 100
                // For example: Rs. 20.00 addon = 2000 quantity of Rs. 0.01 product = Rs. 20.00
                const serviceQuantity = Math.round(prices.addonTotal * 100);
                
                console.log('💰 Adding service product - Variant ID:', serviceData.variantId);
                console.log('💰 Addon total:', prices.addonTotal, '- Service quantity:', serviceQuantity);
                
                // Add service product with quantity representing price
                items.push({
                  id: parseInt(serviceData.variantId),
                  quantity: serviceQuantity,
                  properties: {
                    '_is_addon': 'true',
                    '_addon_for': config.productTitle,
                    '_addon_display': `${config.currency}${prices.addonTotal.toFixed(2)}`,
                    ...properties
                  }
                });
                
                console.log('✅ Service product added to items array');
              } else {
                console.warn('⚠️ Service product not configured:', serviceData.message);
                alert('Customization service not configured. Please contact store admin.\n\n' + (serviceData.message || ''));
                addToCartBtn.textContent = 'Add to Cart';
                addToCartBtn.disabled = false;
                return;
              }
            } catch (serviceError) {
              console.error('❌ Service response error:', serviceError);
              alert('Could not load customization service. Please try again.');
              addToCartBtn.textContent = 'Add to Cart';
              addToCartBtn.disabled = false;
              return;
            }
          }
          
          console.log('🚀 Adding items to cart:', items);
          
          // Add all items to cart at once
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ items: items })
          });
          
          console.log('📡 Response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Response error:', errorText);
            
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch (e) {
              errorData = { message: errorText };
            }
            
            throw new Error('Could not add to cart: ' + (errorData.description || errorData.message || errorText));
          }
          
          const result = await response.json();
          console.log('✅ Items added to cart:', result);
          
          // Success! Redirect to cart
          console.log('✅ Success! Redirecting to cart...');
          window.location.href = '/cart';
          
        } catch (error) {
          console.error('❌ Error adding to cart:', error);
          alert('Failed to add to cart: ' + error.message + '\n\nCheck browser console for details.');
          addToCartBtn.textContent = 'Add to Cart';
          addToCartBtn.disabled = false;
        }
      });
    }
  };
})();
