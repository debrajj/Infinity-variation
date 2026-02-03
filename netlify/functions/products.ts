import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  const shop = event.queryStringParameters?.shop;
  
  if (!shop) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Shop parameter is required' }),
    };
  }

  try {
    // Get access token from environment or session
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Fetch products from Shopify Admin API
    const response = await fetch(`https://${shop}/admin/api/2024-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch products' }),
    };
  }
};

export { handler };
