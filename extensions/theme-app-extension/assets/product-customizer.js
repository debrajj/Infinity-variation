/**
 * Infinite Product Options - Theme Extension
 * This script loads the React app into the theme
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
        primaryColor: element.dataset.primaryColor,
        showPrices: element.dataset.showPrices === 'true'
      };

      // Load the React app bundle
      this.loadApp(element, config);
    },

    loadApp: function(element, config) {
      // In production, this would load your built React app
      // For now, we'll create a placeholder
      
      fetch(`https://your-app-domain.com/api/option-sets?productId=${config.productId}`)
        .then(response => response.json())
        .then(data => {
          if (data.optionSets && data.optionSets.length > 0) {
            this.renderCustomizer(element, data.optionSets[0], config);
          } else {
            element.innerHTML = '<p>No customization options available for this product.</p>';
          }
        })
        .catch(error => {
          console.error('Failed to load customization options:', error);
          element.innerHTML = '<p>Failed to load customization options. Please refresh the page.</p>';
        });
    },

    renderCustomizer: function(element, optionSet, config) {
      // This is where your React StorefrontCustomizer component would be rendered
      // In production, you'd use ReactDOM.render() here
      
      element.innerHTML = `
        <div class="infinite-options-container">
          <h3>Customize Your Product</h3>
          <div id="options-root"></div>
        </div>
      `;

      // Load React bundle and render
      // ReactDOM.render(<StorefrontCustomizer />, document.getElementById('options-root'));
    }
  };
})();
