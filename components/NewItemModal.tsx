
import React, { useState, useRef, useEffect } from 'react';
import { X, PackagePlus, Save, BellRing, ImageIcon, Upload, Trash2, Edit2 } from 'lucide-react';
import { InventoryItem } from '../types';

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<InventoryItem, 'id'>) => void;
  categories?: string[];
  initialData?: InventoryItem; // Nueva prop para soportar edición
}

export const NewItemModal: React.FC<NewItemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  categories = [],
  initialData
}) => {
  const [formData, setFormData] = useState({
    item: '',
    brand: '',
    reference: '',
    currentStock: 0,
    category: '',
    lowStockThreshold: 10,
    imageUrl: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efecto para cargar datos iniciales si estamos en modo edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        item: initialData.item,
        brand: initialData.brand,
        reference: initialData.reference,
        currentStock: initialData.currentStock,
        category: initialData.category || '',
        lowStockThreshold: initialData.lowStockThreshold,
        imageUrl: initialData.imageUrl || ''
      });
    } else {
      setFormData({ 
        item: '', brand: '', reference: '', currentStock: 0, category: '', lowStockThreshold: 10, imageUrl: '' 
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item || !formData.brand) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-transparent dark:border-slate-800 flex flex-col max-h-[90vh]">
        <div className={`${initialData ? 'bg-indigo-600 dark:bg-indigo-700' : 'bg-blue-600 dark:bg-blue-700'} p-8 flex justify-between items-center text-white shrink-0`}>
          <h3 className="text-2xl font-black flex items-center gap-3 tracking-tight">
            {initialData ? <Edit2 size={28} /> : <PackagePlus size={28} />}
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-2xl transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Sección de Imagen */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Imagen del Producto</label>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden relative group">
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Trash2 size={24} />
                    </button>
                  </>
                ) : (
                  <ImageIcon size={32} className="text-slate-300 dark:text-slate-600" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-xs text-slate-500 font-medium">Sube una foto clara para identificar el producto rápidamente en el catálogo.</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                >
                  <Upload size={16} />
                  {formData.imageUrl ? 'Cambiar Foto' : 'Seleccionar Foto'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2">Nombre del Producto</label>
              <input
                autoFocus required type="text"
                value={formData.item}
                onChange={(e) => setFormData({...formData, item: e.target.value})}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                placeholder="Ej: Cable Solar 4mm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 appearance-none"
                >
                  <option value="">Sin Categoría</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2">Marca</label>
                <input
                  required type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                  placeholder="Marca"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2">Referencia / Modelo</label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                placeholder="Ref: X-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2">Stock Actual</label>
                <input
                  type="number" min="0"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value) || 0})}
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2 flex items-center gap-1.5">
                  <BellRing size={14} className="text-amber-500" />
                  Umbral Alerta
                </label>
                <input
                  type="number" min="1"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value) || 0})}
                  className="w-full px-5 py-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-900/10 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-50 transition-all">
              Cancelar
            </button>
            <button 
              type="submit" 
              className={`flex-2 px-10 py-4 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${
                initialData 
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              <Save size={20} />
              {initialData ? 'Actualizar Cambios' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
