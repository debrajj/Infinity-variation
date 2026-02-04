/**
 * Automatic Service Product Setup Script
 * Run this once to create the service product in Shopify
 * 
 * Usage: node setup-service-product.js
 */

import https from 'https';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN || 'cmstesting.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ Error: SHOPIFY_ACCESS_TOKEN not found in .env.local');
  console.error('Please add your Shopify Admin API access token to .env.local');
  process.exit(1);
}

console.log('🚀 Creating Product Customization Service Product...');
console.log('🏪 Shop:', SHOP_DOMAIN);

const productData = {
  product: {
    title: 'Product Customization Service',
    body_html: '<p>Customization add-ons for your products. This product is automatically managed by the Infinite Options app.</p>',
    vendor: 'Infinite Options',
    product_type: 'Service',
    status: 'active',
    published_at: new Date().toISOString(),
    published_scope: 'global',
    tags: 'customization-service,app-managed,infinite-options',
    variants: [{
      price: '0.01',
      sku: 'CUSTOMIZATION-ADDON',
      inventory_management: null,
      inventory_policy: 'continue',
      fulfillment_service: 'manual',
      requires_shipping: false,
      taxable: false,
      weight: 0,
      weight_unit: 'kg'
    }]
  }
};

const postData = JSON.stringify(productData);

const options = {
  hostname: SHOP_DOMAIN,
  port: 443,
  path: '/admin/api/2024-01/products.json',
  method: 'POST',
  headers: {
    'X-Shopify-Access-Token': ACCESS_TOKEN,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📡 Response status:', res.statusCode);
    
    if (res.statusCode === 201) {
      const response = JSON.parse(data);
      const product = response.product;
      const variantId = product.variants[0].id;
      
      console.log('✅ SUCCESS! Product created:');
      console.log('   Product ID:', product.id);
      console.log('   Product Title:', product.title);
      console.log('   Variant ID:', variantId);
      console.log('   Price: Rs. 0.01');
      console.log('');
      console.log('🔧 NEXT STEPS:');
      console.log('');
      console.log('1. Go to Render.com dashboard');
      console.log('2. Open your service: infinity-variation');
      console.log('3. Go to Environment tab');
      console.log('4. Add or update this variable:');
      console.log('');
      console.log(`   CUSTOMIZATION_SERVICE_VARIANT_ID=${variantId}`);
      console.log('');
      console.log('5. Save changes (Render will auto-redeploy)');
      console.log('6. Test your app - addon pricing will now work!');
      console.log('');
      console.log('✨ Your app will now work exactly like Globo!');
    } else {
      console.error('❌ Error creating product:');
      console.error('Status:', res.statusCode);
      console.error('Response:', data);
      
      try {
        const errorData = JSON.parse(data);
        if (errorData.errors) {
          console.error('Errors:', JSON.stringify(errorData.errors, null, 2));
        }
      } catch (e) {
        // Not JSON
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.write(postData);
req.end();
