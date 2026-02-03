
import React from 'react';
import { OptionSet } from '../types';

interface OptionSetListProps {
  optionSets: OptionSet[];
  onEdit: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  showToast: (m: string) => void;
}

const OptionSetList: React.FC<OptionSetListProps> = ({ optionSets, onEdit, onCreate, onDelete, showToast }) => {
  const handleExportCSV = () => {
    showToast("Exporting configurations to CSV...");
    setTimeout(() => {
       const content = "Name,Status,ElementsCount,CreatedAt\n" + 
          optionSets.map(s => `${s.name},${s.status},${s.options.length},${s.createdAt}`).join("\n");
       const blob = new Blob([content], { type: 'text/csv' });
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.setAttribute('hidden', '');
       a.setAttribute('href', url);
       a.setAttribute('download', 'ipo_configurations_export.csv');
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       showToast("CSV Export Complete");
    }, 1000);
  };

  return (
    <div className="animate-fadeIn max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Option Sets</h2>
          <p className="text-gray-500 mt-1 font-medium">Link infinite customization variants to your Shopify products.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="bg-white border border-gray-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <i className="fas fa-file-export"></i> Export CSV
          </button>
          <button onClick={onCreate} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
            <i className="fas fa-plus"></i> Create New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-50">
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <th className="px-8 py-5">Config Name</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Elements</th>
              <th className="px-8 py-5">Created</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {optionSets.map(set => (
              <tr key={set.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fas fa-layer-group"></i>
                    </div>
                    <span className="font-bold text-gray-900 text-base">{set.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${
                    set.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${set.status === 'active' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                    {set.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-gray-700">{set.options.length}</span>
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fields</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-gray-500">{new Date(set.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(set.id)} className="w-10 h-10 rounded-xl bg-gray-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center">
                       <i className="fas fa-pen text-xs"></i>
                    </button>
                    <button onClick={() => { if(confirm('Are you sure you want to delete this set?')) onDelete(set.id); }} className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                       <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                   </div>
                </td>
              </tr>
            ))}
            {optionSets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-32 text-center">
                   <div className="max-w-xs mx-auto">
                      <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center text-gray-200 text-3xl mx-auto mb-6">
                         <i className="fas fa-magic"></i>
                      </div>
                      <h4 className="text-xl font-black text-gray-900 tracking-tight mb-2">Build your first set</h4>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8">
                         Personalize your products with custom text, images, and swatches in minutes.
                      </p>
                      <button onClick={onCreate} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100">
                         Get Started
                      </button>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OptionSetList;
