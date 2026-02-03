import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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
const httpsRequest = (url, options = {}) => {
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
  // In production, this would fetch from database
  // For now, return empty array - data comes from localStorage
  res.json({ optionSets: [] });
});

// Get option sets for a specific product (for storefront)
app.get('/api/storefront/option-sets', (req, res) => {
  const productId = req.query.productId;
  
  if (!productId) {
    return res.status(400).json({ error: 'Product ID required' });
  }

  // In production, fetch from database where targetProducts includes productId
  // For now, return empty - storefront uses localStorage
  res.json({ optionSets: [] });
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
