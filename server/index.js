import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// File-based storage for option sets
const STORAGE_FILE = path.join(__dirname, 'option-sets.json');

// Load option sets from file
function loadOptionSets() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading option sets:', err);
  }
  return [];
}

// Save option sets to file
function saveOptionSets(sets) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(sets, null, 2), 'utf8');
    console.log('✅ Option sets saved to file:', sets.length, 'sets');
    return true;
  } catch (err) {
    console.error('Error saving option sets:', err);
    return false;
  }
}

// Initialize storage
let optionSets = loadOptionSets();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Helper function to make HTTPS requests
const httpsRequest = (url, options = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ ok: false, status: res.statusCode, data: null });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Shopify Products API - Fetch real products
app.get('/api/products', async (req, res) => {
  try {
    const shop = req.query.shop || req.headers['x-shopify-shop-domain'];
    const accessToken = req.headers['authorization']?.replace('Bearer ', '');

    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter required' });
    }

    // Fetch products from Shopify Admin API
    const shopifyUrl = `https://${shop}/admin/api/2024-01/products.json?limit=250`;
    
    const response = await httpsRequest(shopifyUrl, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken || process.env.SHOPIFY_ACCESS_TOKEN || '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = response.data;
    
    // Transform to our format
    const products = data.products.map(p => ({
      id: p.id.toString(),
      title: p.title,
      handle: p.handle,
      price: parseFloat(p.variants[0]?.price || '0'),
      image: p.images[0]?.src || p.image?.src || '',
      inventory: p.variants[0]?.inventory_quantity || 0,
      setsCount: 0,
      status: p.status
    }));

    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      message: error.message 
    });
  }
});

// Option Sets API
app.get('/api/option-sets', (req, res) => {
  console.log('📦 GET /api/option-sets - Returning', optionSets.length, 'sets');
  res.json({ optionSets });
});

// Get option sets for a specific product (for storefront)
app.get('/api/storefront/option-sets', (req, res) => {
  const productId = req.query.productId;
  
  console.log('🔍 GET /api/storefront/option-sets - Product ID:', productId);
  console.log('📦 Total option sets:', optionSets.length);
  
  if (!productId) {
    return res.status(400).json({ error: 'Product ID required' });
  }

  // Get option sets that are assigned to this product
  // Convert both to strings for comparison
  const matchingSets = optionSets.filter(set => {
    const isActive = set.status === 'active';
    const hasTargets = set.targetProducts && Array.isArray(set.targetProducts);
    const isAssigned = hasTargets && set.targetProducts.some(id => String(id) === String(productId));
    
    console.log(`  Set "${set.name}": active=${isActive}, hasTargets=${hasTargets}, isAssigned=${isAssigned}`);
    if (hasTargets) {
      console.log(`    Target products:`, set.targetProducts);
    }
    
    return isActive && isAssigned;
  });

  console.log('✅ Found', matchingSets.length, 'matching sets for product', productId);
  res.json({ optionSets: matchingSets });
});

app.post('/api/option-sets', (req, res) => {
  const newSets = req.body.optionSets;
  
  if (!newSets) {
    return res.status(400).json({ error: 'Option sets required' });
  }

  // Save to file
  optionSets = newSets;
  const saved = saveOptionSets(optionSets);
  
  if (saved) {
    res.json({ 
      success: true, 
      message: 'Option sets saved',
      count: optionSets.length
    });
  } else {
    res.status(500).json({ error: 'Failed to save option sets' });
  }
});

app.post('/api/option-sets', (req, res) => {
  const optionSet = req.body;
  res.json({ 
    success: true, 
    id: Date.now().toString(),
    optionSet 
  });
});

app.put('/api/option-sets/:id', (req, res) => {
  const { id } = req.params;
  const optionSet = req.body;
  res.json({ 
    success: true, 
    id,
    optionSet 
  });
});

app.delete('/api/option-sets/:id', (req, res) => {
  const { id } = req.params;
  res.json({ success: true, id });
});

// Create draft order with custom line items (Globo approach)
app.post('/api/create-draft-order', async (req, res) => {
  try {
    const { mainProduct, customizations, customer } = req.body;
    
    const shop = req.headers['x-shopify-shop-domain'] || process.env.SHOPIFY_SHOP_DOMAIN;
    const accessToken = req.headers['authorization']?.replace('Bearer ', '') || process.env.SHOPIFY_ACCESS_TOKEN;
    
    if (!shop || !accessToken) {
      return res.status(400).json({ error: 'Missing shop or access token' });
    }
    
    console.log('📝 Creating draft order for shop:', shop);
    console.log('📦 Main product:', mainProduct);
    console.log('🎨 Customizations:', customizations);
    
    // Build line items array
    const lineItems = [
      {
        variant_id: mainProduct.variantId,
        quantity: mainProduct.quantity || 1,
        properties: mainProduct.properties || []
      }
    ];
    
    // Add customization line items
    if (customizations && customizations.length > 0) {
      customizations.forEach(custom => {
        lineItems.push({
          title: custom.title,
          price: custom.price,
          quantity: custom.quantity || 1,
          taxable: false,
          requires_shipping: false,
          properties: custom.properties || []
        });
      });
    }
    
    // Create draft order
    const draftOrderData = {
      draft_order: {
        line_items: lineItems,
        customer: customer || {},
        use_customer_default_address: true,
        note: 'Created by Infinite Product Options app'
      }
    };
    
    console.log('🚀 Creating draft order:', JSON.stringify(draftOrderData, null, 2));
    
    const response = await httpsRequest(`https://${shop}/admin/api/2024-01/draft_orders.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    }, JSON.stringify(draftOrderData));
    
    if (!response.ok) {
      console.error('❌ Failed to create draft order:', response);
      return res.status(500).json({ 
        error: 'Failed to create draft order',
        details: response.data 
      });
    }
    
    const draftOrder = response.data.draft_order;
    console.log('✅ Draft order created:', draftOrder.id);
    console.log('🔗 Invoice URL:', draftOrder.invoice_url);
    
    res.json({
      success: true,
      draftOrderId: draftOrder.id,
      invoiceUrl: draftOrder.invoice_url,
      checkoutUrl: `https://${shop}/checkout/${draftOrder.id}`
    });
    
  } catch (error) {
    console.error('❌ Error creating draft order:', error);
    res.status(500).json({ 
      error: 'Failed to create draft order',
      message: error.message 
    });
  }
});

// Get customization service product variant ID
app.get('/api/customization-service', async (req, res) => {
  console.log('🔍 GET /api/customization-service called');
  let variantId = process.env.CUSTOMIZATION_SERVICE_VARIANT_ID;
  console.log('📦 Variant ID from env:', variantId);
  
  // If not configured, try to create it automatically
  if (!variantId) {
    console.log('⚙️ Customization service not configured, attempting auto-creation...');
    
    try {
      // Get shop and access token
      const shop = req.query.shop || process.env.SHOPIFY_SHOP_DOMAIN;
      const accessToken = process.env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_API_ACCESS_TOKEN;
      
      if (shop && accessToken) {
        console.log('🏪 Creating service product for shop:', shop);
        
        // Create the product via Shopify API
        const productData = {
          product: {
            title: 'Product Customization',
            body_html: '<p>Service fee for product customizations. This product is automatically managed by the app.</p>',
            vendor: 'Infinite Options',
            product_type: 'Service',
            status: 'active',
            published: true,
            tags: 'customization-service,hidden,app-managed',
            variants: [{
              price: '1.00',
              inventory_management: null,
              inventory_policy: 'continue',
              requires_shipping: false,
              taxable: false,
              weight: 0,
              weight_unit: 'kg'
            }],
            options: [{
              name: 'Title',
              values: ['Default']
            }]
          }
        };
        
        const createResponse = await httpsRequest(`https://${shop}/admin/api/2024-01/products.json`, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json'
          }
        }, JSON.stringify(productData));
        
        if (createResponse.ok && createResponse.data.product) {
          variantId = createResponse.data.product.variants[0].id.toString();
          console.log('✅ Created customization service product, variant ID:', variantId);
          console.log('💡 Add this to your environment: CUSTOMIZATION_SERVICE_VARIANT_ID=' + variantId);
          
          // Save to environment (temporary - will persist until restart)
          process.env.CUSTOMIZATION_SERVICE_VARIANT_ID = variantId;
          
          res.json({ 
            variantId,
            price: 1.00,
            autoCreated: true,
            message: 'Customization service product created automatically! Add CUSTOMIZATION_SERVICE_VARIANT_ID=' + variantId + ' to your environment to persist.'
          });
          return;
        } else {
          console.error('❌ Failed to create product:', createResponse);
        }
      } else {
        console.log('⚠️ Missing shop or access token for auto-creation');
        console.log('   Shop:', shop ? 'provided' : 'MISSING');
        console.log('   Access Token:', accessToken ? 'provided' : 'MISSING');
      }
    } catch (error) {
      console.error('❌ Failed to auto-create customization service:', error);
    }
  }
  
  if (variantId) {
    // Return variant ID and price (default ₹1.00)
    const price = parseFloat(process.env.CUSTOMIZATION_SERVICE_PRICE || '1.00');
    res.json({ 
      variantId, 
      price,
      autoCreated: false 
    });
  } else {
    res.json({ 
      variantId: null, 
      price: null,
      message: 'Customization service product not configured. Please set SHOPIFY_SHOP_DOMAIN and SHOPIFY_ACCESS_TOKEN environment variables for auto-creation, or manually create the product and set CUSTOMIZATION_SERVICE_VARIANT_ID.' 
    });
  }
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📱 Admin: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
