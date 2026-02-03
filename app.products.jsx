import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { useState } from "react";
import AdminPanel from "../components/AdminPanel";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  // Fetch real products from Shopify using GraphQL
  const response = await admin.graphql(
    `#graphql
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
    `
  );

  const responseJson = await response.json();
  const products = responseJson.data.products.edges.map(({ node }) => ({
    id: node.id.replace('gid://shopify/Product/', ''),
    title: node.title,
    handle: node.handle,
    price: parseFloat(node.variants.edges[0]?.node.price || '0'),
    image: node.images.edges[0]?.node.url || 'https://via.placeholder.com/100',
    inventory: node.variants.edges[0]?.node.inventoryQuantity || 0,
    setsCount: 0,
    status: node.status.toLowerCase()
  }));

  return json({
    products,
    shop: session.shop
  });
};

export default function ProductsPage() {
  const { products, shop } = useLoaderData();
  const [optionSets, setOptionSets] = useState([]);
  const [settings, setSettings] = useState({
    storeName: shop,
    currency: "USD",
    customizationProductId: "custom-service-001",
    enableLivePreview: true,
    primaryColor: "#e64a5d",
  });

  const handleSaveOptionSets = (sets) => {
    setOptionSets(sets);
    // TODO: Save to database via API
  };

  const handleSyncProducts = () => {
    window.location.reload();
  };

  return (
    <AdminPanel
      optionSets={optionSets}
      saveOptionSets={handleSaveOptionSets}
      products={products}
      isSyncing={false}
      onSyncProducts={handleSyncProducts}
      settings={settings}
      setSettings={setSettings}
    />
  );
}
