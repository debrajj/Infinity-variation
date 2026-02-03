
import React, { useState, useEffect } from 'react';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { OptionSet, AppSettings, OptionType, Product, ConditionOperator } from './types';
import AdminPanel from './components/AdminPanel';
import ThemeExtension from './components/ThemeExtension';
import { DEFAULT_SETTINGS } from './constants';

const App: React.FC = () => {
  const [optionSets, setOptionSets] = useState<OptionSet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Fetch real products from Shopify using App Bridge
  const syncProductsFromShopify = async () => {
    setIsSyncing(true);
    
    try {
      // For now, just load mock products since we don't have backend API set up yet
      // In production, this would call your Shopify API
      console.log('Loading products...');
      loadMockProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
      loadMockProducts();
    } finally {
      setIsSyncing(false);
    }
  };

  // Fallback mock data
  const loadMockProducts = () => {
    const mockShopifyData: Product[] = [
      { id: '1', title: 'Luxury Wedding Suite', handle: 'luxury-wedding-suite', price: 24.99, image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=100&h=100&fit=crop', inventory: 450, setsCount: 2, status: 'active' },
      { id: '2', title: 'Artisan Coffee Mug', handle: 'artisan-mug', price: 18.00, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fbed20?w=100&h=100&fit=crop', inventory: 120, setsCount: 1, status: 'active' },
      { id: '3', title: 'Custom Engraved Watch', handle: 'engraved-watch', price: 149.00, image: 'https://images.unsplash.com/photo-1524592093033-0df0a424e83c?w=100&h=100&fit=crop', inventory: 15, setsCount: 3, status: 'active' },
      { id: '4', title: 'Minimalist Leather Wallet', handle: 'leather-wallet', price: 35.00, image: 'https://images.unsplash.com/photo-1627123430984-716597992411?w=100&h=100&fit=crop', inventory: 88, setsCount: 0, status: 'active' },
      { id: '5', title: 'Personalized Scented Candle', handle: 'custom-candle', price: 12.50, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=100&h=100&fit=crop', inventory: 200, setsCount: 1, status: 'active' },
      { id: '6', title: 'Embossed Leather Journal', handle: 'leather-journal', price: 42.00, image: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=100&h=100&fit=crop', inventory: 54, setsCount: 0, status: 'draft' },
    ];
    setProducts(mockShopifyData);
    setIsSyncing(false);
  };

  useEffect(() => {
    // Initial load: Fetch option sets from local storage
    const savedSets = localStorage.getItem('ipo_option_sets');
    if (savedSets) {
      setOptionSets(JSON.parse(savedSets));
    } else {
      const initial: OptionSet[] = [
        {
          id: '1',
          name: 'Wedding Invitation Customization',
          description: 'Complete customization options for wedding invitations',
          status: 'active',
          targetProducts: ['1'],
          createdAt: new Date().toISOString(),
          options: [
            { 
              id: 'opt_printing', 
              type: OptionType.RADIO, 
              label: 'PRINTING', 
              isRequired: true, 
              values: [
                { id: 'v1', label: 'NO', addPrice: 0, isDefault: true }, 
                { id: 'v2', label: 'YES', addPrice: 15.00 }
              ], 
              conditions: [] 
            },
            { id: 'div_1', type: OptionType.DIVIDER, label: 'Divider', isRequired: false, values: [], conditions: [] },
            { id: 'head_inserts', type: OptionType.HEADING, label: 'PERSONALIZATION', isRequired: false, values: [], conditions: [] },
            { 
              id: 'opt_names', 
              type: OptionType.TEXT, 
              label: 'Bride & Groom Names', 
              isRequired: true, 
              values: [], 
              conditions: [], 
              placeholder: "John & Jane",
              validationRules: { minLength: 3, maxLength: 100 }
            },
            {
              id: 'opt_message',
              type: OptionType.TEXTAREA,
              label: 'Personal Message',
              isRequired: false,
              values: [],
              conditions: [
                {
                  id: 'cond_1',
                  sourceOptionId: 'opt_printing',
                  operator: ConditionOperator.EQUALS,
                  value: 'YES'
                }
              ],
              placeholder: "Add a personal message...",
              validationRules: { maxLength: 500 }
            },
            {
              id: 'opt_color',
              type: OptionType.COLOR_SWATCH,
              label: 'Envelope Color',
              isRequired: true,
              values: [
                { id: 'c1', label: 'White', addPrice: 0, color: '#FFFFFF', isDefault: true },
                { id: 'c2', label: 'Ivory', addPrice: 2.00, color: '#FFFFF0' },
                { id: 'c3', label: 'Gold', addPrice: 5.00, color: '#FFD700' }
              ],
              conditions: []
            }
          ]
        },
        {
          id: '2',
          name: 'T-Shirt Customization',
          description: 'Custom text and design options for t-shirts',
          status: 'active',
          targetProducts: ['2'],
          createdAt: new Date().toISOString(),
          options: [
            {
              id: 'opt_size',
              type: OptionType.BUTTON,
              label: 'Size',
              isRequired: true,
              values: [
                { id: 's1', label: 'Small', addPrice: 0 },
                { id: 's2', label: 'Medium', addPrice: 0, isDefault: true },
                { id: 's3', label: 'Large', addPrice: 2.00 },
                { id: 's4', label: 'XL', addPrice: 4.00 }
              ],
              conditions: []
            },
            {
              id: 'opt_tshirt_color',
              type: OptionType.COLOR_SWATCH,
              label: 'T-Shirt Color',
              isRequired: true,
              values: [
                { id: 'tc1', label: 'White', addPrice: 0, color: '#FFFFFF', isDefault: true },
                { id: 'tc2', label: 'Black', addPrice: 0, color: '#000000' },
                { id: 'tc3', label: 'Red', addPrice: 2.00, color: '#FF0000' },
                { id: 'tc4', label: 'Blue', addPrice: 2.00, color: '#0000FF' }
              ],
              conditions: []
            },
            {
              id: 'opt_custom_text',
              type: OptionType.TEXT,
              label: 'Custom Text',
              isRequired: false,
              values: [],
              conditions: [],
              placeholder: "Your text here (max 20 chars)",
              validationRules: { maxLength: 20 }
            },
            {
              id: 'opt_gift_wrap',
              type: OptionType.CHECKBOX,
              label: 'Add-ons',
              isRequired: false,
              values: [
                { id: 'gw1', label: 'Gift Wrapping', addPrice: 5.00 },
                { id: 'gw2', label: 'Rush Delivery (2 days)', addPrice: 25.00 }
              ],
              conditions: []
            }
          ]
        }
      ];
      setOptionSets(initial);
      localStorage.setItem('ipo_option_sets', JSON.stringify(initial));
    }

    // "Install" behavior: Automatically fetch products on first load
    syncProductsFromShopify();
  }, []);

  const saveOptionSets = (sets: OptionSet[]) => {
    setOptionSets(sets);
    localStorage.setItem('ipo_option_sets', JSON.stringify(sets));
  };

  return (
    <AppProvider i18n={{}}>
      <div className="min-h-screen bg-[#f6f6f7]">
        <AdminPanel 
          optionSets={optionSets} 
          saveOptionSets={saveOptionSets} 
          products={products}
          isSyncing={isSyncing}
          onSyncProducts={syncProductsFromShopify}
          settings={settings} 
          setSettings={setSettings} 
        />
      </div>
    </AppProvider>
  );
};

export default App;
