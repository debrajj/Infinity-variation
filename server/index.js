import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Option Sets API
app.get('/api/option-sets', (req, res) => {
  // In production, fetch from database
  // For now, return empty array
  res.json({ optionSets: [] });
});

app.post('/api/option-sets', (req, res) => {
  // In production, save to database
  const optionSet = req.body;
  res.json({ 
    success: true, 
    id: Date.now().toString(),
    optionSet 
  });
});

app.put('/api/option-sets/:id', (req, res) => {
  // In production, update in database
  const { id } = req.params;
  const optionSet = req.body;
  res.json({ 
    success: true, 
    id,
    optionSet 
  });
});

app.delete('/api/option-sets/:id', (req, res) => {
  // In production, delete from database
  const { id } = req.params;
  res.json({ success: true, id });
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const shop = req.query.shop;
    // In production, fetch from Shopify API
    res.json({ products: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
