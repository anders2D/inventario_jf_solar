import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Tags, Plus, Search, CheckCircle2, Package, ListChecks, Edit3, X } from 'lucide-react';

interface CategoryManagementProps {
  inventory: InventoryItem[];
  categories: string[];
  onAddCategory: (name: string) => void;
  onAssignCategory: (itemIds: string[], category: string) => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({ 
  inventory, 
  categories, 
  onAddCategory, 
  onAssignCategory 
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetCategory, setTargetCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const filteredItems = inventory.filter(item => 
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newCategoryName.trim();
    
    if (!trimmedName) return;
    
    if (categories.includes(trimmedName)) {
      alert('Esta categoría ya existe');
      return;
    }
    
    onAddCategory(trimmedName);
    setNewCategoryName('');
  };

  const handleEditCategory = (oldName: string) => {
    const newName = editingCategoryName.trim();
    if (!newName || newName === oldName) {
      setEditingCategory(null);
      return;
    }
    if (categories.includes(newName)) {
      alert('Esta categoría ya existe');
      return;
    }
    onAddCategory(newName);
    setEditingCategory(null);
    setEditingCategoryName('');
  };

  const handleBulkAssign = () => {
    if (selectedItemIds.length > 0 && targetCategory) {
      onAssignCategory(selectedItemIds, targetCategory);
      setSelectedItemIds([]);
      setTargetCategory('');
    }
  };

  const selectAll = () => {
    if (selectedItemIds.length === filteredItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredItems.map(i => i.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel Izquierdo: Crear Categorías */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
            <Plus size={20} className="text-indigo-600" />
            Nueva Categoría
          </h3>
          <form onSubmit={handleAddCategorySubmit} className="space-y-4">
            <input 
              type="text"
              placeholder="Ej: Accesorios"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            />
            <button 
              type="submit"
              disabled={!newCategoryName.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              Crear Categoría
            </button>
          </form>

          <div className="mt-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categorías Existentes</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <div key={cat} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800 group">
                  {editingCategory === cat ? (
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      onBlur={() => handleEditCategory(cat)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEditCategory(cat)}
                      autoFocus
                      className="bg-transparent outline-none w-20 text-indigo-700 dark:text-indigo-400 font-bold"
                    />
                  ) : (
                    <>
                      <span>{cat}</span>
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setEditingCategoryName(cat);
                        }}
                        className="ml-1 p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Edit3 size={12} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Central/Derecho: Asignación Masiva */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <ListChecks size={20} className="text-indigo-600" />
              Asignación Masiva de Productos
            </h3>
            <div className="relative w-48 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto max-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-slate-800/50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedItemIds.length === filteredItems.length && filteredItems.length > 0}
                      onChange={selectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Producto</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Categoría Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredItems.map(item => (
                  <tr 
                    key={item.id} 
                    onClick={() => toggleItemSelection(item.id)}
                    className={`cursor-pointer transition-colors ${selectedItemIds.includes(item.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'}`}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedItemIds.includes(item.id)}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.item}</p>
                      <p className="text-[10px] text-gray-400">{item.brand} | {item.reference}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 italic">
                        {item.category || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-bold text-indigo-600">{selectedItemIds.length}</span> items seleccionados
              </div>
              
              <div className="flex-1 flex gap-2 w-full">
                <select 
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">-- Seleccionar Categoría --</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button 
                  onClick={handleBulkAssign}
                  disabled={selectedItemIds.length === 0 || !targetCategory}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Asignar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
