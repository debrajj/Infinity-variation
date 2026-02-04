# Cart Customization Guide

## Goal
Hide "Product Customization Service" product details and group all customization options together in a clean display.

## Solution: Add Custom CSS and Liquid to Your Theme

### Step 1: Add CSS to Hide Customization Service Product Details

Add this CSS to your theme's `assets/theme.css` or create a new snippet:

```css
/* Hide Product Customization Service product details */
.cart-item[data-product-title*="Product Customization Service"],
.cart__row[data-product-title*="Product Customization Service"],
tr[data-product-title*="Product Customization Service"] {
  display: none !important;
}

/* Alternative: Hide by checking properties */
.cart-item:has([data-property-name="_for_product"]),
.cart__row:has([data-property-name="_for_product"]),
tr:has([data-property-name="_for_product"]) {
  display: none !important;
}

/* Show customization details in a grouped box */
.customization-summary {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
}

.customization-summary h4 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.customization-summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.customization-summary li {
  padding: 5px 0;
  color: #666;
  font-size: 0.9rem;
}
```

### Step 2: Modify Cart Template

You need to edit your cart template to group customization options. Here's how:

#### Option A: Using Liquid in cart.liquid or main-cart.liquid

Find the section where cart items are displayed and add this logic:

```liquid
{% for item in cart.items %}
  {% unless item.product.title contains "Product Customization Service" %}
    {%- comment -%} Display regular product {%- endcomment -%}
    <div class="cart-item" data-product-title="{{ item.product.title }}">
      <h3>{{ item.product.title }}</h3>
      <p>Price: {{ item.final_price | money }}</p>
      <p>Quantity: {{ item.quantity }}</p>
      
      {%- comment -%} Show customization options for this product {%- endcomment -%}
      {% if item.properties._customization_total and item.properties._customization_total != blank %}
        <div class="customization-summary">
          <h4>Customizations:</h4>
          <ul>
            {% for property in item.properties %}
              {% unless property.first contains "_" %}
                <li><strong>{{ property.first }}:</strong> {{ property.last }}</li>
              {% endunless %}
            {% endfor %}
          </ul>
        </div>
      {% endif %}
    </div>
  {% endunless %}
{% endfor %}
```

#### Option B: Using JavaScript (Easier - No theme file editing)

Add this JavaScript to your theme or as a custom script:

```javascript
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Find all cart items
  const cartItems = document.querySelectorAll('.cart-item, .cart__row, tr[data-line-item]');
  
  cartItems.forEach(item => {
    // Check if this is a customization service product
    const titleElement = item.querySelector('.cart-item__name, .cart__product-title, .product-title');
    if (titleElement && titleElement.textContent.includes('Product Customization Service')) {
      // Hide the entire row
      item.style.display = 'none';
      
      // Get the properties
      const properties = item.querySelectorAll('.cart-item__property, .product-option, [data-cart-item-property]');
      const forProduct = Array.from(properties).find(p => p.textContent.includes('_for_product'));
      
      if (forProduct) {
        const productName = forProduct.textContent.split(':')[1].trim();
        
        // Find the main product row
        const mainProductRow = Array.from(cartItems).find(row => {
          const mainTitle = row.querySelector('.cart-item__name, .cart__product-title, .product-title');
          return mainTitle && mainTitle.textContent.includes(productName);
        });
        
        if (mainProductRow) {
          // Create customization summary box if it doesn't exist
          let summaryBox = mainProductRow.querySelector('.customization-summary');
          if (!summaryBox) {
            summaryBox = document.createElement('div');
            summaryBox.className = 'customization-summary';
            summaryBox.innerHTML = '<h4>Customizations:</h4><ul></ul>';
            mainProductRow.appendChild(summaryBox);
          }
          
          // Add this customization to the list
          const title = Array.from(properties).find(p => p.textContent.includes('Title:'));
          if (title) {
            const li = document.createElement('li');
            li.textContent = title.textContent.replace('Title:', '').trim();
            summaryBox.querySelector('ul').appendChild(li);
          }
        }
      }
    }
  });
});
</script>
```

### Step 3: Apply to Your Theme

**Easiest Method (JavaScript):**

1. Go to Shopify Admin → Online Store → Themes → Actions → Edit code
2. Find `layout/theme.liquid`
3. Before the closing `</body>` tag, add:

```liquid
{% if template == 'cart' %}
<style>
/* Hide Product Customization Service items */
.cart-item:has(.cart-item__name:contains("Product Customization Service")),
.cart__row:has(.cart__product-title:contains("Product Customization Service")) {
  display: none !important;
}

.customization-summary {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
}

.customization-summary h4 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  font-weight: 600;
}

.customization-summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.customization-summary li {
  padding: 5px 0;
  color: #666;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const cartItems = document.querySelectorAll('[data-cart-item], .cart-item, .cart__row');
  const customizationItems = [];
  
  cartItems.forEach(item => {
    const title = item.querySelector('[data-cart-item-title], .cart-item__name, .cart__product-title');
    if (title && title.textContent.includes('Product Customization Service')) {
      item.style.display = 'none';
      
      // Extract customization details
      const properties = {};
      item.querySelectorAll('[data-cart-item-property], .product-option').forEach(prop => {
        const text = prop.textContent.trim();
        if (text.includes(':')) {
          const [key, value] = text.split(':').map(s => s.trim());
          properties[key] = value;
        }
      });
      
      customizationItems.push({
        forProduct: properties['_for_product'],
        title: properties['Title'],
        element: item
      });
    }
  });
  
  // Group customizations by product
  const grouped = {};
  customizationItems.forEach(item => {
    if (!grouped[item.forProduct]) {
      grouped[item.forProduct] = [];
    }
    grouped[item.forProduct].push(item.title);
  });
  
  // Add customization summary to main products
  Object.keys(grouped).forEach(productName => {
    const mainItem = Array.from(cartItems).find(item => {
      const title = item.querySelector('[data-cart-item-title], .cart-item__name, .cart__product-title');
      return title && title.textContent.includes(productName);
    });
    
    if (mainItem) {
      const summary = document.createElement('div');
      summary.className = 'customization-summary';
      summary.innerHTML = `
        <h4>Customizations:</h4>
        <ul>
          ${grouped[productName].map(title => `<li>${title}</li>`).join('')}
        </ul>
      `;
      mainItem.appendChild(summary);
    }
  });
});
</script>
{% endif %}
```

4. Save the file

This will:
- ✅ Hide all "Product Customization Service" line items
- ✅ Hide their quantity and price
- ✅ Group all customizations under the main product in a nice box
- ✅ Show customization details without cluttering the cart

The subtotal will still include the customization prices correctly!
