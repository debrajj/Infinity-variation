
import React, { useState, useEffect } from 'react';
import { OptionSet, AppSettings, OptionType, Product } from '../types';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import OptionSetList from './OptionSetList';
import OptionSetEditor from './OptionSetEditor';
import SettingsView from './SettingsView';
import ProductList from './ProductList';

interface AdminPanelProps {
  optionSets: OptionSet[];
  saveOptionSets: (sets: OptionSet[]) => void;
  products: Product[];
  isSyncing: boolean;
  onSyncProducts: () => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  optionSets, 
  saveOptionSets, 
  products, 
  isSyncing, 
  onSyncProducts, 
  settings, 
  setSettings 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'option-sets' | 'editor' | 'settings' | 'products'>('dashboard');
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleEdit = (id: string) => {
    setSelectedSetId(id);
    setActiveTab('editor');
  };

  const handleCreate = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newSet: OptionSet = {
      id: newId,
      name: 'New Option Set',
      status: 'draft',
      targetProducts: [],
      createdAt: new Date().toISOString(),
      options: [
        {
          id: `group_${Date.now()}`,
          type: OptionType.HEADING,
          label: 'Customization Group',
          isRequired: false,
          values: [],
          conditions: [],
          isGroup: true
        }
      ],
    };
    saveOptionSets([...optionSets, newSet]);
    setSelectedSetId(newId);
    setActiveTab('editor');
    showToast("New option set created");
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard optionSets={optionSets} onNavigate={setActiveTab} onCreate={handleCreate} />;
      case 'option-sets':
        return <OptionSetList optionSets={optionSets} onEdit={handleEdit} onCreate={handleCreate} onDelete={(id) => {
          saveOptionSets(optionSets.filter(s => s.id !== id));
          showToast("Option set deleted");
        }} showToast={showToast} />;
      case 'products':
        return <ProductList products={products} isSyncing={isSyncing} onSync={onSyncProducts} />;
      case 'editor':
        const set = optionSets.find(s => s.id === selectedSetId);
        return set ? (
          <OptionSetEditor 
            optionSet={set} 
            products={products}
            onSave={(updated) => {
              saveOptionSets(optionSets.map(s => s.id === updated.id ? updated : s));
              setActiveTab('option-sets');
              showToast("Changes published successfully");
            }}
            onCancel={() => setActiveTab('option-sets')}
          />
        ) : null;
      case 'settings':
        return <SettingsView settings={settings} onSave={(s) => { setSettings(s); showToast("Settings saved"); }} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f6f7] font-sans">
      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto relative">
        <header className="bg-white border-b border-gray-200 px-8 h-14 flex items-center justify-between sticky top-0 z-[100]">
          <div className="flex items-center gap-3">
             <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Store:</span>
             <span className="text-gray-900 text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-all">
                {settings.storeName} <i className="fas fa-chevron-down text-[10px]"></i>
             </span>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="relative">
                <i className="fas fa-search text-gray-400 text-sm"></i>
             </div>
             <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm cursor-pointer">
                JD
             </div>
          </div>
        </header>

        <div className="p-8 max-w-[1200px] mx-auto min-h-[calc(100vh-56px)]">
          {activeTab !== 'dashboard' && (
            <nav className="mb-6 flex items-center gap-2 text-xs text-gray-500 font-medium">
               <button onClick={() => setActiveTab('dashboard')} className="hover:text-gray-900 transition-colors">Dashboard</button>
               <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
               <span className="text-gray-900 capitalize">{activeTab.replace('-', ' ')}</span>
            </nav>
          )}
          
          {renderContent()}
        </div>

        {toast && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[3000] animate-slideUp">
             <div className="bg-[#303030] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
                <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm font-bold tracking-tight">{toast.message}</span>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
