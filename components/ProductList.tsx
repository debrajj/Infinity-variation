
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  isSyncing: boolean;
  onSync: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, isSyncing, onSync }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
          <p className="text-gray-500">View and manage customization assignments for your store inventory.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
             <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
             <input 
               type="text" 
               placeholder="Filter products..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10 pr-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-100 w-64"
             />
           </div>
           <button 
             onClick={onSync}
             disabled={isSyncing}
             className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
           >
             <i className={`fas fa-sync ${isSyncing ? 'fa-spin' : ''}`}></i>
             {isSyncing ? 'Syncing...' : 'Sync Shopify'}
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden relative min-h-[400px]">
        {isSyncing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
             <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
             <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Fetching Store Inventory...</p>
          </div>
        )}

        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Inventory</th>
              <th className="px-6 py-4">Applied Sets</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={product.image} className="w-12 h-12 rounded-lg object-cover border" alt={product.title} />
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{product.title}</p>
                      <p className="text-xs text-gray-400 font-mono">/{product.handle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full border ${
                     product.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-200'
                   }`}>
                     {product.status}
                   </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-700">
                   ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                   {product.inventory} available
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-1.5">
                     <span className={`w-2 h-2 rounded-full ${product.setsCount > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                     <span className="text-sm font-bold text-gray-600">{product.setsCount} active sets</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-indigo-600 font-bold text-sm hover:underline">Manage Options</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !isSyncing && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic font-medium">
                  {searchTerm ? `No products found matching "${searchTerm}"` : 'No products found in store inventory.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
