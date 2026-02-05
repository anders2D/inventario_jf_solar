
import React, { useState, useMemo } from 'react';
import { InventoryItem } from '../types';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Edit3, 
  Package, 
  ImageIcon,
  X,
  Maximize2,
  Trash2,
  Eye
} from 'lucide-react';
import { NewItemModal } from './NewItemModal';
import { ProductDetailsModal } from './ProductDetailsModal';

interface InventoryViewProps {
  inventory: InventoryItem[];
  categories: string[];
  transactions?: any[];
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem?: (id: string) => void;
  onAddItem?: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ 
  inventory, 
  categories,
  transactions = [],
  onUpdateItem,
  onDeleteItem,
  onAddItem
}) => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [editingItem, setEditingItem] = useState<InventoryItem | null | undefined>(undefined);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [detailsItem, setDetailsItem] = useState<InventoryItem | null>(null);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = 
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reference.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchTerm, selectedCategory]);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= 0) return { label: 'Agotado', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800' };
    if (item.currentStock <= item.lowStockThreshold) return { label: 'Bajo Stock', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800' };
    return { label: 'Disponible', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' };
  };

  const handleEditSave = async (updatedData: Omit<InventoryItem, 'id'>) => {
    if (editingItem && editingItem.id) {
      onUpdateItem({ ...updatedData, id: editingItem.id });
    } else if (onAddItem) {
      await onAddItem(updatedData);
    }
    setEditingItem(undefined);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Zoom Lightbox Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in zoom-in duration-200 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <button className="absolute top-6 right-6 p-4 text-white hover:bg-white/10 rounded-full transition-all">
            <X size={32} />
          </button>
          <img 
            src={zoomedImage} 
            className="max-w-full max-h-full rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300" 
            alt="Vista ampliada" 
          />
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
            <Package className="text-blue-600" size={32} />
            Catálogo de Almacén
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Gestión visual de {inventory.length} referencias registradas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditingItem(null)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
          >
            <Package size={18} />
            Nuevo Item
          </button>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50">
            <button 
              onClick={() => setViewType('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewType === 'grid' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={`p-2.5 rounded-xl transition-all ${viewType === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Buscar por nombre, marca, referencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-14 pr-10 py-4 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none shadow-sm cursor-pointer"
          >
            <option value="Todas">Todas las Categorías</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Grid View */}
      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInventory.map(item => {
            const status = getStockStatus(item);
            return (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                {/* Product Content with Integrated Thumbnail */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">{item.category || 'Sin Categoría'}</p>
                      <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2">{item.item}</h3>
                    </div>

                    {/* Miniature Thumbnail */}
                    <div 
                      className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 relative group/img cursor-zoom-in"
                      onClick={() => item.imageUrl && setZoomedImage(item.imageUrl)}
                    >
                      {item.imageUrl ? (
                        <>
                          <img src={item.imageUrl} alt={item.item} className="w-full h-full object-cover transition-transform group-hover/img:scale-110" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 size={16} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-6">{item.brand} • Ref: {item.reference}</p>

                  <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">En Almacén</p>
                      <p className={`text-3xl font-black tracking-tighter ${item.currentStock <= item.lowStockThreshold ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
                        {item.currentStock}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${status.color}`}>
                      {status.label}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button 
                    onClick={() => setDetailsItem(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <Eye size={14} />
                    Detalles
                  </button>
                  <button 
                    onClick={() => setEditingItem(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <Edit3 size={14} />
                    Gestionar
                  </button>
                  {onDeleteItem && (
                    <button 
                      onClick={() => {
                        if (window.confirm(`¿Eliminar "${item.item}"?`)) {
                          onDeleteItem(item.id);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/40 dark:border-slate-800/40 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Producto</th>
                <th className="px-8 py-5">Categoría</th>
                <th className="px-8 py-5 text-center">Stock</th>
                <th className="px-8 py-5 text-center">Estado</th>
                <th className="px-8 py-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInventory.map(item => {
                const status = getStockStatus(item);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center cursor-zoom-in group/listimg"
                          onClick={() => item.imageUrl && setZoomedImage(item.imageUrl)}
                        >
                          {item.imageUrl ? (
                            <img src={item.imageUrl} className="w-full h-full object-cover group-hover/listimg:scale-110 transition-transform" />
                          ) : (
                            <ImageIcon size={20} className="text-slate-300 dark:text-slate-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">{item.item}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.brand} • {item.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                        {item.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-xl font-black tracking-tighter ${item.currentStock <= item.lowStockThreshold ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setDetailsItem(item)}
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-purple-600 rounded-xl transition-all active:scale-90"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => setEditingItem(item)}
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-600 rounded-xl transition-all active:scale-90"
                        >
                          <Edit3 size={18} />
                        </button>
                        {onDeleteItem && (
                          <button 
                            onClick={() => {
                              if (window.confirm(`¿Eliminar "${item.item}"?`)) {
                                onDeleteItem(item.id);
                              }
                            }}
                            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-600 rounded-xl transition-all active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredInventory.length === 0 && (
        <div className="py-32 text-center bg-white/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex flex-col items-center opacity-20">
            <Package size={80} strokeWidth={1} />
            <h4 className="text-xl font-black uppercase tracking-widest mt-6">Sin resultados</h4>
            <p className="text-sm font-bold max-w-xs mt-2">Intenta ajustar tus filtros o términos de búsqueda para encontrar lo que necesitas.</p>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      <NewItemModal 
        isOpen={editingItem !== undefined} 
        onClose={() => setEditingItem(undefined)} 
        onSave={handleEditSave}
        categories={categories}
        initialData={editingItem || undefined}
      />

      {/* Details Modal */}
      <ProductDetailsModal
        isOpen={!!detailsItem}
        product={detailsItem}
        transactions={transactions}
        onClose={() => setDetailsItem(null)}
      />
    </div>
  );
};
