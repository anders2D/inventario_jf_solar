
import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { Calendar, ArrowUpCircle, ArrowDownCircle, Search, Filter, X, ChevronDown, ChevronUp, Eye, Package } from 'lucide-react';

interface HistoryViewProps {
  transactions: Transaction[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = 
          t.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.responsible && t.responsible.toLowerCase().includes(searchTerm.toLowerCase()));

        const transactionDate = new Date(t.date).getTime();
        const start = startDate ? new Date(startDate).getTime() : -Infinity;
        const end = endDate ? new Date(endDate).getTime() : Infinity;
        const adjustedEnd = endDate ? end + (24 * 60 * 60 * 1000) - 1 : Infinity;

        return matchesSearch && transactionDate >= start && transactionDate <= adjustedEnd;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, startDate, endDate]);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchTerm !== '' || startDate !== '' || endDate !== '';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200/40 dark:border-slate-800/40 overflow-hidden transition-all duration-300">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <Calendar className="text-purple-600 dark:text-purple-400" size={28} />
            Movimientos y Auditoría
          </h2>
          
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Buscar por proyecto, responsable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-bold"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 p-5 bg-purple-500/5 dark:bg-purple-900/10 rounded-3xl border border-purple-100 dark:border-purple-900/20">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-black text-[10px] uppercase tracking-widest">
            <Filter size={14} strokeWidth={3} />
            Periodo:
          </div>
          
          <div className="flex items-center gap-3">
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-purple-200 dark:border-slate-700 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-white outline-none"
            />
            <span className="text-purple-300">→</span>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-purple-200 dark:border-slate-700 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-white outline-none"
            />
          </div>

          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all ml-auto"
            >
              <X size={14} strokeWidth={3} />
              Resetear
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
              <th className="px-8 py-5">Fecha</th>
              <th className="px-8 py-5">Tipo</th>
              <th className="px-8 py-5">Producto / Descripción</th>
              <th className="px-8 py-5 text-center">Unidades</th>
              <th className="px-8 py-5">Destino / Proyecto</th>
              <th className="px-8 py-5 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <React.Fragment key={t.id}>
                  <tr className={`group transition-all ${expandedRow === t.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                    <td className="px-8 py-6 text-slate-500 dark:text-slate-400 text-xs font-bold">{t.date}</td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        t.type === 'entry' 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>
                        {t.type === 'entry' ? <ArrowDownCircle size={14} strokeWidth={3} /> : <ArrowUpCircle size={14} strokeWidth={3} />}
                        {t.type === 'entry' ? 'Entrada' : 'Salida'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                         <span className="font-black text-slate-900 dark:text-slate-100 tracking-tight">{t.itemName}</span>
                         {t.items && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Despacho Multi-Ítem</span>}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-center font-black text-slate-900 dark:text-white text-lg tracking-tighter">{t.quantity}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.detail}</span>
                        {t.responsible && <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Resp: {t.responsible}</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {t.items ? (
                        <button 
                          onClick={() => toggleRow(t.id)}
                          className={`p-3 rounded-2xl transition-all ${
                            expandedRow === t.id 
                              ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/30' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'
                          }`}
                        >
                          {expandedRow === t.id ? <ChevronUp size={20} /> : <Eye size={20} />}
                        </button>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">—</span>
                      )}
                    </td>
                  </tr>
                  
                  {/* Fila Detalle Expandible */}
                  {expandedRow === t.id && t.items && (
                    <tr>
                      <td colSpan={6} className="px-10 py-8 bg-blue-50/20 dark:bg-blue-900/5 animate-in slide-in-from-top-4 duration-300">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-blue-100 dark:border-blue-900/30 overflow-hidden shadow-sm">
                          <div className="px-8 py-5 border-b border-blue-50 dark:border-blue-900/20 flex items-center gap-3">
                            <Package className="text-blue-500" size={18} />
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Desglose de productos en este envío</h4>
                          </div>
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 font-black uppercase tracking-widest">
                                <th className="px-8 py-4">Producto</th>
                                <th className="px-8 py-4">Marca</th>
                                <th className="px-8 py-4 text-center">Cantidad</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                              {t.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                  <td className="px-8 py-4 font-bold text-slate-800 dark:text-slate-200">{item.itemName}</td>
                                  <td className="px-8 py-4 text-slate-500 dark:text-slate-400 font-black uppercase">{item.brand}</td>
                                  <td className="px-8 py-4 text-center font-black text-blue-600 dark:text-blue-400 text-base">{item.quantity}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-800/40 text-right">
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Despacho: </span>
                             <span className="text-sm font-black text-slate-900 dark:text-white ml-2">{t.quantity} Unidades</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-32 text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <Calendar size={64} className="opacity-10 mb-4" />
                    <span className="font-black uppercase tracking-widest text-sm opacity-60">Sin registros encontrados</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between items-center">
        <span>Mostrando {filteredTransactions.length} registros auditados</span>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-emerald-500" />
           Sistema Sincronizado
        </div>
      </div>
    </div>
  );
};
