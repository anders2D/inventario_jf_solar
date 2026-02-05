
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { BellRing, Search, Save, Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ThresholdViewProps {
  inventory: InventoryItem[];
  onUpdateThreshold: (itemId: string, newThreshold: number) => void;
}

export const ThresholdView: React.FC<ThresholdViewProps> = ({ inventory, onUpdateThreshold }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localThresholds, setLocalThresholds] = useState<Record<string, number>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const handleInputChange = (itemId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setLocalThresholds(prev => ({ ...prev, [itemId]: numValue }));
    // Reset saved status when typing
    if (savedStatus[itemId]) {
      setSavedStatus(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleSave = (itemId: string) => {
    const newValue = localThresholds[itemId];
    if (newValue !== undefined) {
      onUpdateThreshold(itemId, newValue);
      setSavedStatus(prev => ({ ...prev, [itemId]: true }));
      
      // Clear success icon after 3 seconds
      setTimeout(() => {
        setSavedStatus(prev => ({ ...prev, [itemId]: false }));
      }, 3000);
    }
  };

  const filteredItems = inventory.filter(item => 
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/40 dark:border-slate-800/40 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tighter">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
                <BellRing size={28} strokeWidth={2.5} />
              </div>
              Configuración de Alertas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-2 opacity-70 ml-[68px]">Personaliza el punto de reorden por producto</p>
          </div>
          
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Buscar producto para ajustar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Producto / Marca</th>
                <th className="px-8 py-5 text-center">Stock Actual</th>
                <th className="px-8 py-5 text-center">Umbral de Alerta</th>
                <th className="px-8 py-5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((item) => {
                const currentThreshold = localThresholds[item.id] ?? item.lowStockThreshold;
                const isDirty = localThresholds[item.id] !== undefined && localThresholds[item.id] !== item.lowStockThreshold;
                const isCritical = item.currentStock <= item.lowStockThreshold;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${isCritical ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-slate-100 tracking-tight">{item.item}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.brand} • Ref: {item.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-xl font-black tracking-tighter ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <div className="relative w-32">
                          <input 
                            type="number"
                            min="1"
                            value={currentThreshold}
                            onChange={(e) => handleInputChange(item.id, e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl border font-black text-center outline-none transition-all ${
                              isDirty 
                                ? 'border-amber-500 ring-4 ring-amber-500/10' 
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleSave(item.id)}
                          disabled={!isDirty}
                          className={`p-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 ${
                            savedStatus[item.id]
                              ? 'bg-emerald-500 text-white'
                              : isDirty
                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                          }`}
                        >
                          {savedStatus[item.id] ? <CheckCircle2 size={20} /> : <Save size={20} />}
                          {isDirty && <span className="text-[10px] font-black uppercase">Actualizar</span>}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredItems.length === 0 && (
            <div className="py-24 text-center">
              <AlertTriangle size={48} className="mx-auto mb-4 text-slate-200" strokeWidth={1.5} />
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">No se encontraron productos para configurar</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 rounded-3xl">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h4 className="text-xl font-black tracking-tight">Consejo de Gestión</h4>
            <p className="text-blue-100 text-sm font-medium opacity-80">Configura umbrales más altos para productos con tiempos de entrega largos (importados) para evitar quiebres de stock.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
