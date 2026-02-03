import React, { useState } from 'react';
import { OptionSet, AppSettings, CartLineItem } from '../types';
import StorefrontCustomizer from './StorefrontCustomizer';

interface ExtensionProps {
  optionSet: OptionSet;
  settings: AppSettings;
}

const ThemeExtension: React.FC<ExtensionProps> = ({ optionSet, settings }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartLineItem[]>([]);

  const handleAddToCart = (mainProduct: any, customizationService: any) => {
    setCart([mainProduct, customizationService]);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900 py-16 px-4">
      <div className="max-w-[500px] mx-auto bg-white rounded-[40px] shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden">
        <div className="h-2 bg-[#e64a5d]"></div>
        
        <div className="p-12">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Luxury Product Suite</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">Infinite Personalization Enabled</p>
          </div>

          <StorefrontCustomizer
            optionSet={optionSet}
            settings={settings}
            productPrice={24.99}
            productTitle="Luxury Product"
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Cart Simulation */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[2000] flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-fadeIn" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-[420px] bg-white h-full shadow-2xl flex flex-col animate-slideLeft">
            <div className="p-8 border-b flex justify-between items-center">
               <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <i className="fas fa-shopping-cart text-[#e64a5d]"></i> Your Cart
               </h3>
               <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-900"><i className="fas fa-times"></i></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
               {cart.map((item) => (
                  <div key={item.id} className={`flex gap-5 p-5 rounded-3xl border ${item.isCustomizationService ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-gray-100 shadow-sm'}`}>
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${item.isCustomizationService ? 'bg-white' : 'bg-gray-100'}`}>
                        <i className={`fas ${item.isCustomizationService ? 'fa-concierge-bell text-indigo-400' : 'fa-box text-gray-300'}`}></i>
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className={`text-xs font-black truncate ${item.isCustomizationService ? 'text-indigo-600' : 'text-gray-900'}`}>{item.title}</h4>
                           <span className="text-xs font-black">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        {item.properties && (
                           <div className="space-y-2 mt-4 pt-4 border-t border-indigo-100/50">
                              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Personalization Group</p>
                              {Object.entries(item.properties).map(([k, v]) => (
                                 <div key={k} className="flex justify-between text-[10px] gap-2">
                                    <span className="text-gray-400 font-bold shrink-0">{k}:</span>
                                    <span className="text-gray-900 font-black truncate">{v}</span>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               ))}
            </div>

            <div className="p-10 border-t bg-gray-50 space-y-6">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Cart Total</span>
                  <span className="text-3xl font-black text-gray-900 tracking-tighter italic">
                    ${cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}
                  </span>
               </div>
               <button className="w-full py-5 bg-gray-900 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl shadow-gray-400">
                  Go to Checkout
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeExtension;
