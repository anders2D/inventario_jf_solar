
import React, { useState, useMemo } from 'react';
import { InventoryItem, Project } from '../types';
import { ArrowUpCircle, Send, Search, Trash2, PackagePlus, ListChecks, CheckCircle2, AlertCircle, Briefcase } from 'lucide-react';

interface OutputFormProps {
  inventory: InventoryItem[];
  projects: Project[];
  onSubmit: (outputs: {itemId: string, quantity: number}[], projectId: string, responsible: string, date: string) => void;
}

interface SelectedOutputItem {
  id: string;
  item: string;
  brand: string;
  availableStock: number;
  requestedQty: number;
}

export const OutputForm: React.FC<OutputFormProps> = ({ inventory, projects, onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [responsible, setResponsible] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedItems, setSelectedItems] = useState<SelectedOutputItem[]>([]);
  const [isFocused, setIsFocused] = useState<string | null>(null);

  // Solo proyectos activos para despachar
  const activeProjects = useMemo(() => projects.filter(p => p.status === 'active'), [projects]);

  // Filtrar inventario disponible para el buscador
  const availableItemsForSearch = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return inventory.filter(i => 
      i.currentStock > 0 && 
      (i.item.toLowerCase().includes(searchTerm.toLowerCase()) || 
       i.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
       i.reference.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !selectedItems.some(s => s.id === i.id)
    ).slice(0, 5);
  }, [inventory, searchTerm, selectedItems]);

  const handleAddItem = (item: InventoryItem) => {
    setSelectedItems(prev => [...prev, {
      id: item.id,
      item: item.item,
      brand: item.brand,
      availableStock: item.currentStock,
      requestedQty: 1
    }]);
    setSearchTerm('');
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateQty = (id: string, qty: string) => {
    const value = parseInt(qty) || 0;
    setSelectedItems(prev => prev.map(i => 
      i.id === id ? { ...i, requestedQty: value } : i
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0 || !selectedProjectId || !responsible || !date) return;

    // Validación de seguridad: verificar cantidades individuales
    const hasInvalidQty = selectedItems.some(i => i.requestedQty > i.availableStock || i.requestedQty <= 0);
    if (hasInvalidQty) return;

    // Validación adicional: verificar que hay al menos 1 unidad total
    const totalRequested = selectedItems.reduce((sum, i) => sum + i.requestedQty, 0);
    if (totalRequested <= 0) return;

    const outputs = selectedItems.map(i => ({ itemId: i.id, quantity: i.requestedQty }));
    onSubmit(outputs, selectedProjectId, responsible, date);
    
    // Resetear formulario tras éxito
    setSelectedItems([]);
    setSelectedProjectId('');
    setResponsible('');
  };

  const totalUnits = selectedItems.reduce((acc, curr) => acc + curr.requestedQty, 0);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200/40 dark:border-slate-800/40 overflow-hidden transition-all duration-300">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-amber-500/5 border-l-[6px] border-l-amber-500">
        <h2 className="text-2xl font-black text-slate-900 dark:text-amber-400 flex items-center gap-3 tracking-tight">
          <ArrowUpCircle className="text-amber-600 dark:text-amber-500" size={28} />
          Despacho Múltiple de Materiales
        </h2>
        <p className="text-[10px] text-slate-500 dark:text-amber-500/80 uppercase font-black tracking-widest mt-1 opacity-70">Asignación de materiales a proyectos</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-10">
        
        {/* Bloque 1: Datos Generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${isFocused === 'date' ? 'text-amber-600' : 'text-slate-400'}`}>Fecha del Despacho</label>
            <input 
              type="date" required value={date}
              onFocus={() => setIsFocused('date')} onBlur={() => setIsFocused(null)}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${isFocused === 'proj' ? 'text-amber-600' : 'text-slate-400'}`}>Proyecto Destino</label>
            <select 
              required value={selectedProjectId}
              onFocus={() => setIsFocused('proj')} onBlur={() => setIsFocused(null)}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all appearance-none"
            >
              <option value="">Seleccione Proyecto</option>
              {activeProjects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              {activeProjects.length === 0 && <option disabled>No hay proyectos activos</option>}
            </select>
          </div>
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${isFocused === 'resp' ? 'text-amber-600' : 'text-slate-400'}`}>Responsable / Receptor</label>
            <input 
              type="text" required placeholder="Persona que recibe" value={responsible}
              onFocus={() => setIsFocused('resp')} onBlur={() => setIsFocused(null)}
              onChange={(e) => setResponsible(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all"
            />
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Bloque 2: Buscador e Selección */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">1. Añadir ítems al despacho</label>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Buscar por nombre, marca o referencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none text-slate-900 dark:text-white font-bold transition-all shadow-inner"
            />
            
            {availableItemsForSearch.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {availableItemsForSearch.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAddItem(item)}
                    className="w-full px-6 py-4 text-left hover:bg-amber-50 dark:hover:bg-amber-900/20 flex justify-between items-center transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0 group/item"
                  >
                    <div>
                      <p className="font-black text-slate-900 dark:text-white group-hover/item:text-amber-600 transition-colors">{item.item}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.brand} • Ref: {item.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-blue-600 dark:text-blue-400">{item.currentStock} Disp.</p>
                      <p className="text-[9px] font-black uppercase text-slate-400">Clic para añadir</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bloque 3: Lista de Despacho (Carrito) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ListChecks size={18} className="text-amber-500" />
              2. Asignar Cantidades Individuales
            </h3>
          </div>

          <div className="space-y-3 min-h-[100px]">
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-slate-50/50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 animate-in slide-in-from-left-4 duration-300">
                  <div className="flex-1">
                    <p className="font-black text-slate-900 dark:text-white leading-tight">{item.item}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{item.brand} • Stock Disponible: <span className="text-blue-600 dark:text-blue-400">{item.availableStock}</span></p>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <input 
                          type="number"
                          min="1"
                          max={item.availableStock}
                          value={item.requestedQty}
                          onChange={(e) => handleUpdateQty(item.id, e.target.value)}
                          className={`w-24 px-4 py-2 rounded-xl border font-black text-center outline-none transition-all ${
                            item.requestedQty > item.availableStock || item.requestedQty <= 0
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600' 
                              : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500'
                          }`}
                        />
                      </div>
                      {item.requestedQty > item.availableStock && (
                        <p className="text-[9px] text-red-500 font-black uppercase mt-1 flex items-center gap-1">
                          <AlertCircle size={10} />
                          Stock Insuficiente
                        </p>
                      )}
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center bg-slate-50/30 dark:bg-slate-800/20 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                <PackagePlus size={48} className="mx-auto mb-3 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Utiliza el buscador de arriba para añadir ítems</p>
              </div>
            )}
          </div>
        </div>

        {/* Bloque 4: Resumen y Envío */}
        <div className="pt-10 flex flex-col sm:flex-row justify-between items-center gap-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-10">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Únicos</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{selectedItems.length}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidades en Total</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{totalUnits}</p>
            </div>
          </div>
          <button 
            type="submit"
            disabled={selectedItems.length === 0 || !selectedProjectId || selectedItems.some(i => i.requestedQty > i.availableStock || i.requestedQty <= 0)}
            className="w-full sm:w-auto flex items-center justify-center gap-4 bg-amber-600 hover:bg-amber-700 text-white font-black py-5 px-12 rounded-3xl transition-all shadow-2xl shadow-amber-500/30 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
          >
            <CheckCircle2 size={24} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
            CONFIRMAR DESPACHO
          </button>
        </div>
      </form>
    </div>
  );
};
