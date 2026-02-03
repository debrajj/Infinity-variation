/**
 * Infinite Product Options - Theme Extension
 * This script loads option sets from localStorage and renders the customizer
 */

(function() {
  'use strict';

  window.InfiniteOptionsApp = {
    init: function(element) {
      const config = {
        productId: element.dataset.productId,
        productTitle: element.dataset.productTitle,
        productPrice: parseFloat(element.dataset.productPrice),
        variantId: element.dataset.variantId,
        shop: element.dataset.shop,
        primaryColor: element.dataset.primaryColor || '#e64a5d',
        showPrices: element.dataset.showPrices === 'true'
      };

      console.log('Infinite Options: Initializing for product', config.productId);
      this.loadApp(element, config);
    },

    loadApp: function(element, config) {
      try {
        // Fetch option sets from API
        const apiUrl = window.location.hostname === 'localhost' 
          ? 'http://localhost:3000/api/storefront/option-sets'
          : 'https://infinity-variation.onrender.com/api/storefront/option-sets';
        
        fetch(`${apiUrl}?productId=${config.productId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch option sets');
            }
            return response.json();
          })
          .then(data => {
            console.log('Infinite Options: API response:', data);
            
            if (data.optionSets && data.optionSets.length > 0) {
              console.log('Infinite Options: Rendering option set:', data.optionSets[0].name);
              this.renderCustomizer(element, data.optionSets[0], config);
            } else {
              console.log('Infinite Options: No matching option set for product', config.productId);
              element.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No customization options available for this product.</p>';
            }
          })
          .catch(error => {
            console.error('Infinite Options: Error loading options:', error);
            element.innerHTML = '<p style="color: #e64a5d; text-align: center; padding: 20px;">Error loading customization options. Please refresh the page.</p>';
          });
      } catch (error) {
        console.error('Infinite Options: Error in loadApp:', error);
        element.innerHTML = '<p style="color: #e64a5d; text-align: center; padding: 20px;">Error loading customization options. Please refresh the page.</p>';
      }
    },

    renderCustomizer: function(element, optionSet, config) {
      let totalAddOnPrice = 0;
      const selections = {};

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
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <span style="font-size: 1.2rem; font-weight: 600;">Total Add-on Price:</span>
              <span id="total-addon-price" style="font-size: 1.5rem; font-weight: 700; color: ${config.primaryColor};">$0.00</span>
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
            const priceText = config.showPrices && value.addPrice > 0 ? ` (+$${value.addPrice.toFixed(2)})` : '';
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
            const priceText = config.showPrices && value.addPrice > 0 ? ` (+$${value.addPrice.toFixed(2)})` : '';
            html += `<option value="${value.id}" data-price="${value.addPrice}">${value.label}${priceText}</option>`;
          });
          html += '</select>';
          break;

        case 'checkbox':
          option.values.forEach(value => {
            const priceText = config.showPrices && value.addPrice > 0 ? ` (+$${value.addPrice.toFixed(2)})` : '';
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
            const priceText = config.showPrices && value.addPrice > 0 ? ` (+$${value.addPrice.toFixed(2)})` : '';
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
      const totalPriceEl = element.querySelector('#total-addon-price');
      const addToCartBtn = element.querySelector('#infinite-add-to-cart');

      // Calculate total price
      const calculateTotal = () => {
        let total = 0;
        
        // Radio buttons and color swatches
        form.querySelectorAll('input[type="radio"]:checked').forEach(input => {
          total += parseFloat(input.dataset.price || 0);
        });

        // Checkboxes
        form.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
          total += parseFloat(input.dataset.price || 0);
        });

        // Selects
        form.querySelectorAll('select.option-input').forEach(select => {
          const selectedOption = select.options[select.selectedIndex];
          if (selectedOption) {
            total += parseFloat(selectedOption.dataset.price || 0);
          }
        });

        totalPriceEl.textContent = '$' + total.toFixed(2);
        return total;
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
      addToCartBtn.addEventListener('click', () => {
        console.log('Infinite Options: Add to cart clicked');
        // Here you would collect all selections and add to Shopify cart
        alert('Add to cart functionality will be implemented. Total add-on: $' + totalPriceEl.textContent);
      });
    }
  };
})();
