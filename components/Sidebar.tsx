
import React from 'react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'option-sets', label: 'Option Sets', icon: 'fa-layer-group' },
    { id: 'products', label: 'All Products', icon: 'fa-shopping-bag' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog' },
    { id: 'contact', label: 'Contact Us', icon: 'fa-headset' },
  ];

  return (
    <aside className="w-[260px] bg-[#f1f2f4] flex flex-col h-full border-r border-gray-200">
      <div className="px-6 py-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center text-white shadow-sm overflow-hidden border border-gray-700">
             <img src="https://cdn.shopify.com/app-store/listing_images/73f00e266a2e9b89899f8e4e94b0d0c8/icon/CNmZ5vj0lu8CEAE=.png" alt="logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-bold text-[#202223] text-base leading-tight">Globo Options</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Sync</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map(item => {
          const isActive = activeTab === item.id || (activeTab === 'editor' && item.id === 'option-sets');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full relative flex items-center transition-all duration-200 py-2.5 rounded-xl group ${
                isActive 
                  ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-[#202223]' 
                  : 'text-[#6d7175] hover:bg-[#e4e5e7]'
              }`}
            >
              {isActive && (
                <div className="absolute left-[-10px] flex items-center">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                     <path d="M7 10V14C7 15.1046 7.89543 16 9 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                </div>
              )}
              <div className="flex items-center gap-3 px-6 w-full">
                <i className={`fas ${item.icon} text-sm w-5 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}></i>
                <span className={`text-[13.5px] font-semibold tracking-tight transition-transform ${isActive ? 'translate-x-0.5' : ''}`}>
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto bg-gray-50/50">
        <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
           <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">PRO</span>
              <p className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">Storage Quota</p>
           </div>
           <div className="w-full bg-gray-100 h-1 rounded-full mb-1">
              <div className="bg-indigo-500 h-full rounded-full w-[45%]"></div>
           </div>
           <p className="text-[10px] text-gray-500 font-medium">45% of elements used</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
