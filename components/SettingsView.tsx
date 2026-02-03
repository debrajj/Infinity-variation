
import React from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const handleChange = (key: keyof AppSettings, value: any) => {
    onSave({ ...settings, [key]: value });
  };

  return (
    <div className="animate-fadeIn max-w-[900px] mx-auto space-y-12 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">App Settings</h2>
          <p className="text-gray-500 mt-1 font-medium">Configure global behavior and branding for your customization widget.</p>
        </div>
        <button className="bg-indigo-600 text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
               <i className="fas fa-palette"></i>
             </div>
             <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Storefront Branding</h3>
                <p className="text-xs text-gray-400 font-medium">Match the app's look and feel with your theme.</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Store Name</label>
              <input 
                type="text" 
                value={settings.storeName}
                onChange={e => handleChange('storeName', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="My Store Name"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Primary Brand Color</label>
              <div className="flex gap-3">
                <div className="h-14 w-14 rounded-2xl border-4 border-white shadow-md cursor-pointer overflow-hidden relative">
                   <input 
                      type="color" 
                      value={settings.primaryColor}
                      onChange={e => handleChange('primaryColor', e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer scale-150"
                    />
                </div>
                <input 
                  type="text" 
                  value={settings.primaryColor}
                  onChange={e => handleChange('primaryColor', e.target.value)}
                  className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
             <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl">
               <i className="fas fa-shopping-bag"></i>
             </div>
             <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Ordering & Logic</h3>
                <p className="text-xs text-gray-400 font-medium">Fine-tune the checkout and preview experience.</p>
             </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[32px] border border-gray-50">
              <div className="space-y-1">
                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Real-time Live Preview</p>
                <p className="text-xs text-gray-400 font-medium">Images update instantly on the product page as customers select options.</p>
              </div>
              <button 
                onClick={() => handleChange('enableLivePreview', !settings.enableLivePreview)}
                className={`w-14 h-7 rounded-full transition-all relative p-1 ${settings.enableLivePreview ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-all shadow-md ${settings.enableLivePreview ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Hidden Service Product ID</label>
              <div className="p-6 bg-yellow-50/50 rounded-3xl border border-yellow-100/50 mb-4 flex gap-4 items-start">
                 <i className="fas fa-info-circle text-yellow-600 mt-0.5"></i>
                 <p className="text-[11px] text-yellow-800 leading-relaxed font-medium">
                   This handle identifies your "Customization Service" product. IPO Pro uses this to add the total add-on price as a single line item at checkout, keeping your cart clean.
                 </p>
              </div>
              <input 
                type="text" 
                value={settings.customizationProductId}
                onChange={e => handleChange('customizationProductId', e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
              />
            </div>
          </div>
        </section>

        <div className="p-10 bg-indigo-50/50 rounded-[40px] border border-indigo-100 flex items-center gap-8">
           <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl text-indigo-600 shadow-sm">
              <i className="fas fa-headset"></i>
           </div>
           <div className="flex-1">
              <h4 className="text-base font-black text-gray-900 tracking-tight">Need expert help with styling?</h4>
              <p className="text-xs text-gray-500 font-medium mt-1">Our designers can help you match the IPO widget perfectly with your premium theme.</p>
           </div>
           <button className="px-6 py-3 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
              Contact Support
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
