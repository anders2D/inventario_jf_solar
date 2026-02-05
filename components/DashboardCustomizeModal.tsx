import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface DashboardCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleWidgets: {
    stats: boolean;
    alerts: boolean;
    activity: boolean;
  };
  onSave: (widgets: { stats: boolean; alerts: boolean; activity: boolean }) => void;
}

export const DashboardCustomizeModal: React.FC<DashboardCustomizeModalProps> = ({
  isOpen,
  onClose,
  visibleWidgets,
  onSave
}) => {
  const [tempWidgets, setTempWidgets] = useState(visibleWidgets);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(tempWidgets);
    onClose();
  };

  const widgets = [
    {
      id: 'stats',
      name: 'Tarjetas de Estadísticas',
      description: 'Muestra el catálogo, nivel crítico, entradas y salidas de hoy',
      icon: '📊'
    },
    {
      id: 'alerts',
      name: 'Alertas de Reabastecimiento',
      description: 'Productos con stock bajo que requieren atención inmediata',
      icon: '⚠️'
    },
    {
      id: 'activity',
      name: 'Bitácora de Actividad',
      description: 'Últimos movimientos registrados en el almacén',
      icon: '📈'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Personalizar Dashboard</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Selecciona qué widgets deseas ver</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {widgets.map(widget => (
            <button
              key={widget.id}
              onClick={() => setTempWidgets(prev => ({
                ...prev,
                [widget.id]: !prev[widget.id as keyof typeof prev]
              }))}
              className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                tempWidgets[widget.id as keyof typeof tempWidgets]
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{widget.icon}</span>
                    <p className="font-black text-slate-900 dark:text-white">{widget.name}</p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{widget.description}</p>
                </div>
                <div className={`p-2 rounded-lg transition-all ${
                  tempWidgets[widget.id as keyof typeof tempWidgets]
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {tempWidgets[widget.id as keyof typeof tempWidgets] ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
