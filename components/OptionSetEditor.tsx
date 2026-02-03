
import React, { useState, useRef, useEffect } from 'react';
import { OptionSet, ProductOption, OptionType, OptionValue } from '../types';
import { OPTION_TYPE_LABELS } from '../constants';

interface EditorProps {
  optionSet: OptionSet;
  onSave: (set: OptionSet) => void;
  onCancel: () => void;
}

const OptionSetEditor: React.FC<EditorProps> = ({ optionSet, onSave, onCancel }) => {
  const [activeSet, setActiveSet] = useState<OptionSet>(JSON.parse(JSON.stringify(optionSet)));
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const typePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (typePickerRef.current && !typePickerRef.current.contains(event.target as Node)) {
        setShowTypePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addOption = (type: OptionType) => {
    const newId = `opt_${Date.now()}`;
    const newOption: ProductOption = {
      id: newId,
      type,
      label: type === OptionType.DIVIDER ? 'Divider' : `New ${OPTION_TYPE_LABELS[type].label}`,
      isRequired: false,
      values: [OptionType.TEXT, OptionType.NUMBER, OptionType.TEXTAREA, OptionType.FILE, OptionType.DIVIDER, OptionType.HEADING, OptionType.PARAGRAPH].includes(type) ? [] : [
        { id: `v_${Date.now()}`, label: 'Option 1', addPrice: 0 }
      ],
      conditions: []
    };
    setActiveSet(prev => ({ ...prev, options: [...prev.options, newOption] }));
    setSelectedOptionId(newId);
    setShowTypePicker(false);
  };

  const updateOption = (id: string, updates: Partial<ProductOption>) => {
    setActiveSet(prev => ({
      ...prev,
      options: prev.options.map(o => o.id === id ? { ...o, ...updates } : o)
    }));
  };

  const removeOption = (id: string) => {
    setActiveSet(prev => ({ ...prev, options: prev.options.filter(o => o.id !== id) }));
    if (selectedOptionId === id) setSelectedOptionId(null);
  };

  const selectedOption = activeSet.options.find(o => o.id === selectedOptionId);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-[#fdfdfd] rounded-2xl border border-gray-200 overflow-hidden shadow-2xl relative">
      {/* Top Bar */}
      <div className="h-16 border-b border-gray-100 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-5">
          <div className="p-2 bg-[#e64a5d] rounded-xl text-white shadow-lg shadow-[#e64a5d]/20">
            <i className="fas fa-magic text-sm"></i>
          </div>
          <div className="flex flex-col">
            <input 
              value={activeSet.name} 
              onChange={e => setActiveSet(prev => ({...prev, name: e.target.value}))}
              className="text-base font-black text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 w-64 hover:bg-gray-50 rounded-md transition-colors px-1"
            />
            <div className="flex items-center gap-1.5 mt-0.5">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Storefront Editor</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex bg-gray-100/50 p-1 rounded-xl gap-1">
             <button className="w-9 h-9 flex items-center justify-center text-indigo-600 bg-white shadow-sm rounded-lg"><i className="fas fa-desktop text-xs"></i></button>
             <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600"><i className="fas fa-mobile-alt text-xs"></i></button>
          </div>
          <div className="h-6 w-[1px] bg-gray-100"></div>
          <button onClick={onCancel} className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">Discard</button>
          <button onClick={() => onSave(activeSet)} className="bg-gray-900 text-white px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-900/10 active:scale-95">
             Publish Changes
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Structure Sidebar */}
        <div className="w-[340px] border-r border-gray-100 bg-[#fafafa] flex flex-col h-full">
          <div className="p-6 pb-2 border-b border-gray-50 bg-white/50">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Structure</h3>
             <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-350px)]">
                {activeSet.options.map((opt) => (
                  <div 
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer rounded-2xl transition-all group ${
                      selectedOptionId === opt.id ? 'bg-white shadow-lg shadow-gray-200/50 ring-1 ring-gray-100' : 'hover:bg-gray-200/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${selectedOptionId === opt.id ? 'bg-[#e64a5d] text-white' : 'bg-gray-100 text-gray-400'}`}>
                       <i className={`fas ${OPTION_TYPE_LABELS[opt.type]?.icon || 'fa-layer-group'} text-[10px]`}></i>
                    </div>
                    <div className="flex-1 truncate">
                       <p className={`text-xs truncate transition-colors ${selectedOptionId === opt.id ? 'font-black text-gray-900' : 'font-bold text-gray-600'}`}>{opt.label}</p>
                       <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter mt-0.5">{OPTION_TYPE_LABELS[opt.type]?.label}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="mt-auto p-8 space-y-4 bg-white border-t border-gray-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
             <button 
               onClick={() => setShowTypePicker(true)}
               className="w-full bg-[#e64a5d] text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-[#d03b4d] hover:shadow-xl hover:shadow-[#e64a5d]/20 transition-all active:scale-95"
             >
                <i className="fas fa-plus-circle"></i> Add Element
             </button>
             <button 
               onClick={() => {
                 const newId = `group_${Date.now()}`;
                 setActiveSet(prev => ({...prev, options: [...prev.options, { id: newId, type: OptionType.HEADING, label: 'New Group', isRequired: false, values: [], conditions: [], isGroup: true }]}));
               }}
               className="w-full bg-white border border-gray-100 py-3.5 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
             >
                <i className="fas fa-object-group"></i> Add Group
             </button>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 bg-[#f1f3f5] overflow-y-auto p-12 flex flex-col items-center relative scrollbar-hide">
           {selectedOption ? (
             <div className="absolute right-0 top-0 bottom-0 w-[380px] bg-white border-l border-gray-100 z-10 p-10 shadow-[-20px_0_50px_rgba(0,0,0,0.05)] overflow-y-auto">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center text-sm shadow-sm">
                         <i className={`fas ${OPTION_TYPE_LABELS[selectedOption.type].icon}`}></i>
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 tracking-tight">{OPTION_TYPE_LABELS[selectedOption.type].label}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Properties</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedOptionId(null)} className="w-8 h-8 rounded-full hover:bg-gray-50 text-gray-300 hover:text-gray-900 transition-colors"><i className="fas fa-times"></i></button>
                </div>
                
                <div className="space-y-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Label Name</label>
                      <input 
                         type="text" 
                         value={selectedOption.label}
                         onChange={e => updateOption(selectedOption.id, { label: e.target.value })}
                         className="w-full border border-gray-100 rounded-xl px-5 py-4 text-sm font-bold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                      />
                   </div>

                   <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                         <p className="text-[11px] font-black text-gray-800 uppercase tracking-tight">Required Field</p>
                         <p className="text-[9px] text-gray-400 font-bold">Mandatory selection</p>
                      </div>
                      <button 
                        onClick={() => updateOption(selectedOption.id, { isRequired: !selectedOption.isRequired })}
                        className={`w-11 h-6 rounded-full transition-all relative p-1 ${selectedOption.isRequired ? 'bg-[#e64a5d]' : 'bg-gray-200'}`}
                      >
                         <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${selectedOption.isRequired ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </button>
                   </div>

                   {['radio', 'image_swatch', 'select', 'dropdown'].includes(selectedOption.type) && (
                      <div className="space-y-4 pt-4">
                         <div className="flex justify-between items-center mb-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Variants & Pricing</label>
                           <button className="text-[10px] font-black text-[#e64a5d] hover:underline uppercase">+ Add</button>
                         </div>
                         <div className="space-y-2">
                            {selectedOption.values.map((v, i) => (
                               <div key={v.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm group">
                                  <input 
                                     type="text" 
                                     value={v.label}
                                     onChange={(e) => {
                                        const nv = selectedOption.values.map((val, idx) => idx === i ? { ...val, label: e.target.value } : val);
                                        updateOption(selectedOption.id, { values: nv });
                                     }}
                                     className="flex-1 bg-transparent border-none text-xs font-bold focus:ring-0 p-0"
                                  />
                                  <div className="flex items-center gap-1 border-l border-gray-100 pl-3">
                                     <span className="text-[9px] font-black text-green-600">$</span>
                                     <input 
                                        type="number" 
                                        value={v.addPrice} 
                                        onChange={(e) => {
                                          const nv = selectedOption.values.map((val, idx) => idx === i ? { ...val, addPrice: parseFloat(e.target.value) || 0 } : val);
                                          updateOption(selectedOption.id, { values: nv });
                                        }}
                                        className="w-10 bg-transparent border-none text-xs font-bold text-gray-900 focus:ring-0 p-0" 
                                     />
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   )}
                   
                   <div className="pt-10 border-t border-gray-50">
                      <button 
                        onClick={() => removeOption(selectedOption.id)}
                        className="w-full py-4 border border-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all active:scale-95"
                      >
                        Delete Element
                      </button>
                   </div>
                </div>
             </div>
           ) : null}

           {/* Central Widget Skeleton */}
           <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden min-h-[600px] flex flex-col relative group">
                <div className="h-2 bg-[#e64a5d] w-full"></div>
                <div className="p-10 flex-1 flex flex-col justify-between">
                   <div className="space-y-10">
                      <div className="flex flex-col items-center gap-1 mb-8">
                         <div className="w-12 h-1 bg-[#e64a5d]/10 rounded-full mb-2"></div>
                         <div className="w-32 h-6 bg-gray-50 rounded-lg"></div>
                      </div>
                      
                      <div className="space-y-10">
                         {activeSet.options.length > 0 ? (
                           activeSet.options.map(opt => (
                             <div key={opt.id} onClick={() => setSelectedOptionId(opt.id)} className={`p-4 border border-dashed rounded-2xl cursor-pointer ${selectedOptionId === opt.id ? 'bg-gray-50 border-gray-200' : 'border-transparent hover:border-gray-100'}`}>
                                {opt.type !== OptionType.DIVIDER && opt.type !== OptionType.HEADING && (
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">
                                    {opt.label}
                                  </label>
                                )}
                                <div className="h-4 bg-gray-50 rounded-full w-full opacity-50"></div>
                             </div>
                           ))
                         ) : (
                           <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                              <i className="fas fa-layer-group text-3xl mb-4 text-gray-200"></i>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Premium Canvas</p>
                           </div>
                         )}
                      </div>
                   </div>

                   <div className="mt-20">
                      <div className="w-full py-4 border border-gray-900 flex items-center justify-center bg-white group-hover:bg-gray-50 transition-colors">
                         <span className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-900">ADD TO CART</span>
                      </div>
                   </div>
                </div>
             </div>
        </div>

        {/* Type Picker Overlay */}
        {showTypePicker && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
             <div ref={typePickerRef} className="bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 w-[840px] max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
                <div className="p-10 pb-4 flex justify-between items-center border-b border-gray-50/50">
                   <h2 className="text-xl font-black text-gray-900 tracking-tight">Element Library</h2>
                   <button onClick={() => setShowTypePicker(false)} className="w-10 h-10 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
                      <i className="fas fa-times"></i>
                   </button>
                </div>
                <div className="p-12 grid grid-cols-3 gap-16 overflow-y-auto">
                   {['Input', 'Selection', 'Static'].map(cat => (
                      <div key={cat} className="space-y-8">
                         <h4 className="text-[11px] font-black uppercase text-[#e64a5d] tracking-[0.3em] border-b border-gray-50 pb-3">{cat}</h4>
                         <div className="space-y-4">
                            {Object.entries(OPTION_TYPE_LABELS).filter(([_, info]) => info.category === cat).map(([type, info]) => (
                               <button 
                                 key={type}
                                 onClick={() => addOption(type as OptionType)}
                                 className="w-full flex items-center gap-5 text-left group hover:-translate-x-1 transition-all"
                               >
                                  <div className="w-10 h-10 bg-gray-50 rounded-xl text-gray-400 flex items-center justify-center group-hover:bg-[#e64a5d] group-hover:text-white transition-all">
                                     <i className={`fas ${info.icon} text-sm`}></i>
                                  </div>
                                  <span className="text-[13px] font-black text-gray-700 group-hover:text-gray-900">{info.label}</span>
                               </button>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionSetEditor;
