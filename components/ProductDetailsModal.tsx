import React, { useMemo } from 'react';
import { InventoryItem, Transaction } from '../types';
import { X, ArrowDownCircle, ArrowUpCircle, Calendar } from 'lucide-react';

interface ProductDetailsModalProps {
  isOpen: boolean;
  product: InventoryItem | null;
  transactions: Transaction[];
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  product,
  transactions,
  onClose
}) => {
  if (!isOpen || !product) return null;

  const productTransactions = useMemo(() => {
    return transactions
      .filter(t => t.itemId === product.id || t.items?.some(item => item.itemName === product.item))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [product, transactions]);

  const totalEntries = productTransactions
    .filter(t => t.type === 'entry')
    .reduce((acc, t) => acc + t.quantity, 0);

  const totalOutputs = productTransactions
    .filter(t => t.type === 'output')
    .reduce((acc, t) => acc + t.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{product.item}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{product.brand} • Ref: {product.reference}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Actual</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{product.currentStock}</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Total Entradas</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalEntries}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Total Salidas</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{totalOutputs}</p>
            </div>
          </div>

          {/* Threshold Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Alerta de Stock Bajo</p>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">Umbral: {product.lowStockThreshold} unidades</p>
          </div>

          {/* Transactions History */}
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar size={18} />
              Últimas Transacciones (10)
            </h4>
            
            {productTransactions.length > 0 ? (
              <div className="space-y-2">
                {productTransactions.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center gap-3 flex-1">
                      {t.type === 'entry' ? (
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                          <ArrowDownCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                      ) : (
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                          <ArrowUpCircle size={16} className="text-amber-600 dark:text-amber-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{t.date}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.detail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${t.type === 'entry' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {t.type === 'entry' ? '+' : '-'}{t.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">Sin transacciones registradas</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
