
import React from 'react';

const OrderManagement: React.FC = () => {
  return (
    <div className="animate-fadeIn max-w-[1200px] mx-auto space-y-12 pb-24">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase tracking-[0.1em]">Easy Order Management</h2>
        <p className="text-gray-500 mt-2 font-medium">View custom options in Order invoice, Packing slip, Order confirmation and Staff order notification.</p>
      </div>

      <div className="relative bg-gradient-to-br from-[#e64a5d] to-[#7c3aed] rounded-[48px] p-20 overflow-hidden flex items-center justify-center min-h-[600px] shadow-2xl">
         {/* Abstract background waves */}
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
               <path d="M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500" stroke="white" strokeWidth="2" fill="none" />
               <path d="M0,600 C200,500 300,700 500,600 C700,500 800,700 1000,600" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
            </svg>
         </div>

         <div className="relative z-10 flex flex-col md:flex-row items-start gap-12 w-full max-w-[1000px]">
            {/* New Order Modal Mock */}
            <div className="bg-white rounded-[32px] p-10 shadow-2xl w-full max-w-[440px] animate-slideUp">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center text-[10px] text-white">
                     <i className="fas fa-box"></i>
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900">New Order #157002!</h4>
               </div>

               <p className="text-[11px] text-gray-500 leading-relaxed mb-8 font-medium">
                  Thank you for shopping with [Your Store Name]! We're excited to confirm that your order has been successfully placed and is now being processed. Here are the details of your order:
               </p>

               <button className="bg-black text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest mb-10 hover:bg-gray-800 transition-all">
                  View order
               </button>

               <div className="space-y-8">
                  <div className="flex gap-4">
                     <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                        <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop" className="w-10 h-10 object-cover" />
                     </div>
                     <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                           <h5 className="text-[13px] font-black text-gray-900 leading-none">Vintage Tees x1</h5>
                           <span className="text-[12px] font-black text-gray-900 tracking-tight">$86</span>
                        </div>
                        <div className="space-y-1 pt-2">
                           <div className="flex gap-2">
                              <span className="text-[10px] text-gray-400 font-bold">Custom word:</span>
                              <span className="text-[10px] text-gray-900 font-bold">Unstoppable</span>
                           </div>
                           <div className="flex gap-2">
                              <span className="text-[10px] text-gray-400 font-bold">Color:</span>
                              <span className="text-[10px] text-gray-900 font-bold">Serene Soundwave</span>
                           </div>
                           <div className="flex gap-2">
                              <span className="text-[10px] text-gray-400 font-bold">Custom embroidery:</span>
                              <span className="text-[10px] text-gray-900 font-bold">Premium Embroidery (Intricate Designs)</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 border-t border-gray-50 pt-8">
                     <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                        <img src="https://images.unsplash.com/photo-1578932750294-f50024256231?w=100&h=100&fit=crop" className="w-10 h-10 object-cover" />
                     </div>
                     <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                           <h5 className="text-[13px] font-black text-gray-900 leading-none">Groove-Inspired x2</h5>
                           <span className="text-[12px] font-black text-gray-900 tracking-tight">$241</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Invoice Mock */}
            <div className="flex-1 bg-white rounded-[32px] p-12 shadow-2xl min-h-[500px] flex flex-col animate-fadeIn">
               <div className="flex justify-between items-start mb-16">
                  <div className="w-24 h-6 bg-gray-100 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase">Invoice</h3>
               </div>

               <div className="flex-1 space-y-10">
                  <div className="grid grid-cols-4 gap-4 border-b border-gray-100 pb-4">
                     <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</div>
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Quantity</div>
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Unit Price</div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 items-start">
                     <div className="col-span-2 space-y-2">
                        <h6 className="text-[11px] font-black text-gray-900 uppercase">Luxury Stationery Suite</h6>
                        <div className="text-[9px] text-gray-500 font-medium space-y-1">
                           <p>Size: M</p>
                           <p>Color: Bassline Black</p>
                           <p>Printed on: Back</p>
                           <p className="italic text-gray-400">Phrases: "Vintage dreams, modern reality"</p>
                        </div>
                     </div>
                     <div className="text-[11px] font-black text-gray-900 text-center">1</div>
                     <div className="text-[11px] font-black text-gray-900 text-right">$99.99</div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 items-start border-t border-gray-50 pt-6">
                     <div className="col-span-2 space-y-2">
                        <h6 className="text-[11px] font-black text-gray-900 uppercase">Customization Service</h6>
                        <div className="text-[9px] text-gray-500 font-medium space-y-1">
                           <p>Color: Serene Soundwave</p>
                           <p>Personalization: Advanced</p>
                        </div>
                     </div>
                     <div className="text-[11px] font-black text-gray-900 text-center">1</div>
                     <div className="text-[11px] font-black text-gray-900 text-right">$29.99</div>
                  </div>
               </div>

               <div className="mt-12 border-t border-gray-100 pt-8 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <span>Subtotal:</span>
                     <span className="text-gray-900">$229.96</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <span>Tax (8%):</span>
                     <span className="text-gray-900">$19.52</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-black text-gray-900 pt-3 border-t border-gray-50">
                     <span>Total:</span>
                     <span className="text-xl tracking-tighter italic">$259.47</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl mx-auto">
               <i className="fas fa-file-invoice"></i>
            </div>
            <h5 className="font-black text-gray-900 uppercase tracking-tight text-sm">Automated Invoices</h5>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Line item properties sync perfectly with Shopify's default invoice generation.</p>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl mx-auto">
               <i className="fas fa-envelope-open-text"></i>
            </div>
            <h5 className="font-black text-gray-900 uppercase tracking-tight text-sm">Order Confirmations</h5>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Customers receive a detailed breakdown of their customizations in their email.</p>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center text-xl mx-auto">
               <i className="fas fa-clipboard-list"></i>
            </div>
            <h5 className="font-black text-gray-900 uppercase tracking-tight text-sm">Packing Slips</h5>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Production teams see all details directly on the packing slip for fulfillment.</p>
         </div>
      </div>
    </div>
  );
};

export default OrderManagement;
