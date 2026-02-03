
import React from 'react';
import { OptionSet } from '../types';

interface DashboardProps {
  optionSets: OptionSet[];
  onNavigate: (tab: any) => void;
  onCreate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ optionSets, onNavigate, onCreate }) => {
  const activeCount = optionSets.filter(s => s.status === 'active').length;
  
  return (
    <div className="space-y-10 animate-fadeIn max-w-[1200px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, Merchant</h2>
          <p className="text-gray-500 mt-1 font-medium">Here's what's happening with your product personalizations today.</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> New Option Set
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm transition-hover hover:shadow-md">
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1">Total Configurations</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-gray-900">{optionSets.length}</p>
            <span className="text-xs font-bold text-gray-400">Sets</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-indigo-600">
             <i className="fas fa-arrow-up"></i> 12% increase this month
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm transition-hover hover:shadow-md">
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1">Active Storefronts</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-green-600">{activeCount}</p>
            <span className="text-xs font-bold text-gray-400">Live</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-green-600">
             <i className="fas fa-check-circle"></i> All systems operational
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm transition-hover hover:shadow-md">
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1">Add-on Revenue</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-gray-900">$1.2k</p>
            <span className="text-xs font-bold text-gray-400">USD</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-indigo-600">
             <i className="fas fa-shopping-cart"></i> 48 personalized orders
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Recent Activity</h4>
            <button onClick={() => onNavigate('option-sets')} className="text-indigo-600 text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-50">
            {optionSets.slice(0, 4).map(set => (
              <div key={set.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 cursor-pointer transition-colors" onClick={() => onNavigate('option-sets')}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <i className="fas fa-layer-group"></i>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{set.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Updated: {new Date(set.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${set.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                  {set.status}
                </span>
              </div>
            ))}
            {optionSets.length === 0 && (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4">
                   <i className="fas fa-folder-open text-2xl"></i>
                </div>
                <p className="text-gray-400 text-sm font-medium">No activity yet. Create your first option set.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[32px] p-10 text-white relative overflow-hidden flex flex-col justify-center">
           <div className="relative z-10">
              <h4 className="text-3xl font-black tracking-tight mb-4">Ready for more variants?</h4>
              <p className="text-indigo-100 text-sm mb-8 max-w-xs leading-relaxed">
                Upgrade to IPO Pro to unlock conditional logic, file uploads, and infinite swatches for your store.
              </p>
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/20 hover:scale-105 transition-all">
                 Explore Pro Plans
              </button>
           </div>
           {/* Abstract shapes */}
           <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-[-10%] left-[10%] w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
