import React from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ImportPreviewModalProps {
  isOpen: boolean;
  title: string;
  data: any[];
  columns: string[];
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({
  isOpen,
  title,
  data,
  columns,
  onConfirm,
  onCancel,
  isProcessing = false
}) => {
  if (!isOpen) return null;

  const previewData = data.slice(0, 10);
  const totalRows = data.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Vista previa de los primeros 10 registros</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Total de Registros</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{totalRows}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1">Columnas Detectadas</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{columns.length}</p>
            </div>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  {columns.map(col => (
                    <th key={col} className="px-4 py-3 font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {previewData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    {columns.map(col => (
                      <td key={`${idx}-${col}`} className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                        {String(row[col] || '-').substring(0, 50)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Info */}
          {totalRows > 10 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-300">Mostrando 10 de {totalRows} registros</p>
                <p className="text-xs text-amber-800 dark:text-amber-400 mt-1">Se importarán todos los {totalRows} registros al confirmar.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            Confirmar Importación
          </button>
        </div>
      </div>
    </div>
  );
};
