
import React, { useState, useMemo } from 'react';
import { InventoryItem, Transaction } from '../types';
import { ArrowDownCircle, Save, PlusCircle, History } from 'lucide-react';
import { NewItemModal } from './NewItemModal';

interface EntryFormProps {
  inventory: InventoryItem[];
  transactions?: Transaction[];
  onSubmit: (itemId: string, quantity: number, supplier: string, date: string) => void;
  onAddNewItem: (item: Omit<InventoryItem, 'id'>) => string;
}

export const EntryForm: React.FC<EntryFormProps> = ({ inventory, transactions = [], onSubmit, onAddNewItem }) => {
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !quantity || !supplier || !date) return;
    
    onSubmit(itemId, parseInt(quantity), supplier, date);
    
    // Reset form completely
    setQuantity('');
    setSupplier('');
    setDate(new Date().toISOString().split('T')[0]);
    setItemId('');
  };

  const handleSaveNewItem = async (newItemData: Omit<InventoryItem, 'id'>) => {
    try {
      const newId = await Promise.resolve(onAddNewItem(newItemData));
      if (newId) {
        setItemId(newId);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const selectedItem = inventory.find(i => i.id === itemId);

  const itemEntries = useMemo(() => {
    if (!itemId || !selectedItem) return [];
    return (transactions || [])
      .filter(t => t.type === 'entry' && (t.itemId === itemId || t.itemName === selectedItem.item))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [itemId, transactions, selectedItem]);

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all">
      <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-emerald-900/10 border-l-4 border-l-emerald-500">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-emerald-400 flex items-center gap-2">
              <ArrowDownCircle className="text-emerald-600 dark:text-emerald-500" />
              Registrar Entrada
            </h2>
            <p className="text-gray-500 dark:text-emerald-500/80 text-sm mt-1">Ingreso de nueva mercancía al almacén</p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <PlusCircle size={14} />
            Nuevo Item
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white dark:bg-slate-900">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de Entrada</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seleccionar Item</label>
            <select
              required
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800"
            >
              <option value="" className="text-gray-500">-- Seleccione --</option>
              {inventory.map(item => (
                <option key={item.id} value={item.id} className="text-gray-900 dark:text-white bg-white dark:bg-slate-800">
                  {item.item} ({item.brand})
                </option>
              ))}
            </select>
            {selectedItem && (
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Stock actual: {selectedItem.currentStock} unidades</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cantidad a Ingresar</label>
            <input 
              type="number" 
              min="1"
              required
              placeholder="Ej: 50"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proveedor</label>
            <input 
              type="text" 
              required
              placeholder="Ej: Ferretería Central"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        {/* Historial de Entradas */}
        {itemId && itemEntries.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <History size={16} />
              Últimas Entradas
            </h3>
            <div className="space-y-2">
              {itemEntries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/20">
                  <div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{entry.date}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{entry.detail}</p>
                  </div>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">+{entry.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm active:scale-95"
          >
            <Save size={18} />
            Guardar Entrada
          </button>
        </div>
      </form>

      <NewItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveNewItem}
      />
    </div>
  );
};
