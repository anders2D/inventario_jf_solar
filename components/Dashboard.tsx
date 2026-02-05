
import React from 'react';
import { InventoryItem, Transaction, TabView } from '../types';
import { LayoutDashboard, AlertCircle, TrendingUp, TrendingDown, PackageCheck, ChevronRight, Activity, Zap, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface DashboardProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
  onNavigate: (tab: TabView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ inventory, transactions, onNavigate }) => {
  // Ahora filtramos por el umbral específico de cada item
  const lowStockItems = inventory.filter(i => i.currentStock <= (i.lowStockThreshold || 10));
  
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = transactions.filter(t => t.date === today && t.type === 'entry');
  const todayOutputs = transactions.filter(t => t.date === today && t.type === 'output');

  const stats = [
    { 
      label: 'Catálogo de Productos', 
      value: inventory.length, 
      icon: PackageCheck, 
      color: 'blue',
      accent: 'border-l-blue-500',
      desc: 'Items en base de datos',
      bg: 'bg-blue-500/5',
      tab: 'inventory' as TabView
    },
    { 
      label: 'Nivel Crítico', 
      value: lowStockItems.length, 
      icon: AlertCircle, 
      color: 'red',
      accent: 'border-l-red-500',
      desc: `Productos bajo su umbral`,
      bg: 'bg-red-500/5',
      tab: 'inventory' as TabView
    },
    { 
      label: 'Entradas Hoy', 
      value: todayEntries.length, 
      icon: ArrowDownCircle, 
      color: 'emerald',
      accent: 'border-l-emerald-500',
      desc: 'Ingresos registrados hoy',
      bg: 'bg-emerald-500/5',
      tab: 'history' as TabView
    },
    { 
      label: 'Salidas Hoy', 
      value: todayOutputs.length, 
      icon: ArrowUpCircle, 
      color: 'amber',
      accent: 'border-l-amber-500',
      desc: 'Despachos realizados hoy',
      bg: 'bg-amber-500/5',
      tab: 'history' as TabView
    },
  ];

  return (
    <div className="space-y-8">
      {/* Tarjetas de Estadísticas Refinadas e Interactivas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <button 
            key={idx} 
            onClick={() => onNavigate(stat.tab)}
            className={`text-left relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-3xl border-l-[6px] ${stat.accent} shadow-sm border border-slate-200/40 dark:border-slate-800/40 hover:shadow-xl hover:translate-y-[-4px] active:scale-[0.98] transition-all duration-300 group cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110`} />
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                </div>
              </div>
              <div className={`p-3 rounded-2xl transition-all duration-300 ${
                stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' :
                stat.color === 'red' ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' :
                stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' :
                'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
              } group-hover:scale-110 group-hover:rotate-6`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4 font-bold uppercase flex items-center gap-1.5 tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              {stat.desc}
            </p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alertas de Stock Bajo Premium */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/40 dark:border-slate-800/40 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <AlertCircle size={120} strokeWidth={1} />
          </div>
          <div className="flex justify-between items-center mb-10 relative">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-3 text-xl tracking-tight">
                <AlertCircle className="text-red-500" size={24} strokeWidth={3} />
                Alertas de Reabastecimiento
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-70">Atención inmediata requerida</p>
            </div>
            <button 
              onClick={() => onNavigate('inventory')}
              className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Ver Inventario
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-4 relative">
            {lowStockItems.length > 0 ? (
              lowStockItems.slice(0, 5).map(item => (
                <div key={item.id} className="group flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-transparent hover:border-red-200 dark:hover:border-red-900/30 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner group-hover:scale-110 transition-transform">
                       <PackageCheck size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 dark:text-slate-100 leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.item}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black mt-0.5">
                        {item.brand} • Umbral: <span className="text-amber-600 dark:text-amber-500">{item.lowStockThreshold || 10}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-red-600 dark:text-red-400 tracking-tighter">{item.currentStock}</p>
                    <p className="text-[9px] text-red-400 dark:text-red-500/60 font-black uppercase tracking-widest">Unidades</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-slate-400 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <PackageCheck size={64} className="mx-auto mb-4 opacity-10" strokeWidth={1.5} />
                <p className="text-sm font-black uppercase tracking-widest opacity-60">Stock en niveles óptimos</p>
              </div>
            )}
          </div>
        </div>

        {/* Actividad Reciente Refinada */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/40 dark:border-slate-800/40 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Activity size={120} strokeWidth={1} />
          </div>
          <div className="flex justify-between items-center mb-10 relative">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-3 text-xl tracking-tight">
                <TrendingUp className="text-blue-500" size={24} strokeWidth={3} />
                Bitácora de Actividad
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-70">Últimos movimientos del almacén</p>
            </div>
            <button 
              onClick={() => onNavigate('history')}
              className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Bitácora Completa
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-6 relative">
            {transactions.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center gap-4 group cursor-default">
                <div className={`p-3.5 rounded-2xl transition-all duration-500 ${
                  t.type === 'entry' 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 group-hover:scale-110' 
                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:-rotate-12 group-hover:scale-110'
                }`}>
                  {t.type === 'entry' ? <TrendingUp size={20} strokeWidth={3} /> : <TrendingDown size={20} strokeWidth={3} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-black text-slate-900 dark:text-slate-100 truncate leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t.itemName}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-black uppercase tracking-widest mt-0.5 opacity-80">
                    {t.detail} {t.responsible ? `• Resp: ${t.responsible}` : ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-lg font-black tracking-tighter ${t.type === 'entry' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {t.type === 'entry' ? '+' : '-'}{t.quantity}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter opacity-70">{t.date}</p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="py-16 text-center text-slate-400 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Activity size={64} className="mx-auto mb-4 opacity-10" strokeWidth={1.5} />
                <p className="text-sm font-black uppercase tracking-widest opacity-60">Sin movimientos recientes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
