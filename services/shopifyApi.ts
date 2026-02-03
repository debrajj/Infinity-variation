// Shopify GraphQL API service
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  status: string;
  variants: {
    edges: Array<{
      node: {
        price: string;
        inventoryQuantity: number;
      };
    }>;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
      };
    }>;
  };
}

export const fetchShopifyProducts = async (shop: string, accessToken: string) => {
  const query = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            status
            variants(first: 1) {
              edges {
                node {
                  price
                  inventoryQuantity
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products from Shopify');
  }

  const data = await response.json();
  return data.data.products.edges.map((edge: any) => edge.node);
};
