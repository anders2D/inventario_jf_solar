
import React, { useRef, useState } from 'react';
import { InventoryItem, Transaction } from '../types';
import { Download, Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, History, Package } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DataManagementProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
  onImportInventory: (items: InventoryItem[]) => void;
  onImportTransactions: (transactions: Transaction[]) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ 
  inventory, 
  transactions, 
  onImportInventory,
  onImportTransactions
}) => {
  const fileInputInventoryRef = useRef<HTMLInputElement>(null);
  const fileInputHistoryRef = useRef<HTMLInputElement>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Tabs for Data Management: 'inventory' or 'history'
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');

  // --- INVENTORY FUNCTIONS ---

  const handleExportInventory = (type: 'xlsx') => {
    try {
      const data = inventory.map(item => ({
        ID: item.id,
        Item: item.item,
        Marca: item.brand,
        Referencia: item.reference,
        'Stock Actual': item.currentStock,
        Categoría: item.category || 'Sin Categoría',
        'Umbral Alerta': item.lowStockThreshold || 10
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventario JF Solar");

      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Inventario_JF_Solar_${date}.${type}`);
    } catch (err) {
      setError("Error al exportar inventario.");
    }
  };

  const handleImportInventoryFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    resetStatus();
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

      if (jsonData.length === 0) throw new Error("Archivo vacío.");

      // Confirmation dialog if inventory exists
      if (inventory.length > 0) {
        const confirmed = window.confirm(
          `Esto reemplazará ${inventory.length} items existentes. ¿Continuar?`
        );
        if (!confirmed) {
          setIsProcessing(false);
          return;
        }
      }

      const newInventory: InventoryItem[] = [];
      const existingIds = new Set(inventory.map(i => i.id));
      let duplicatesSkipped = 0;

      jsonData.forEach((row: any, index: number) => {
        const item = row['Item'] || row['item'] || row['Nombre'] || row['Producto'];
        if (!item) return;

        const itemId = (row['ID'] || row['id'] || `import_${Date.now()}_${index}`).toString();
        
        // Check for duplicates
        if (existingIds.has(itemId)) {
          duplicatesSkipped++;
          return;
        }

        newInventory.push({
          id: itemId,
          item: item.toString().trim(),
          brand: (row['Marca'] || row['marca'] || '').toString().trim(),
          reference: (row['Referencia'] || row['referencia'] || '').toString().trim(),
          currentStock: parseInt(row['Stock Actual'] || row['Stock'] || '0') || 0,
          category: (row['Categoría'] || row['categoria'] || '').toString().trim(),
          lowStockThreshold: parseInt(row['Umbral Alerta'] || row['umbral'] || row['Alerta'] || '10') || 10
        });
      });

      if (newInventory.length === 0) throw new Error("No se encontraron datos válidos.");

      onImportInventory(newInventory);
      const msg = duplicatesSkipped > 0 
        ? `Inventario cargado: ${newInventory.length} items. (${duplicatesSkipped} duplicados omitidos)`
        : `Inventario cargado: ${newInventory.length} items.`;
      setSuccessMsg(msg);
      if (fileInputInventoryRef.current) fileInputInventoryRef.current.value = '';

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- HISTORY FUNCTIONS ---

  const handleExportHistory = (type: 'xlsx') => {
    try {
      const data = transactions.map(t => ({
        ID: t.id,
        Fecha: t.date,
        Tipo: t.type === 'entry' ? 'Entrada' : 'Salida',
        Item: t.itemName,
        ItemId: t.itemId,
        Cantidad: t.quantity,
        Detalle: t.detail,
        Responsable: t.responsible || ''
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Historial Movimientos");

      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Historial_JFSolar_${date}.${type}`);
    } catch (err) {
      setError("Error al exportar historial.");
    }
  };

  const handleImportHistoryFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    resetStatus();
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

      if (jsonData.length === 0) throw new Error("Archivo vacío.");

      const newTransactions: Transaction[] = [];
      jsonData.forEach((row: any) => {
        const tipoRaw = row['Tipo'] || row['tipo'];
        const item = row['Item'] || row['item'];
        if (!tipoRaw || !item) return;

        // Map Spanish 'Entrada'/'Salida' back to 'entry'/'output'
        let type: 'entry' | 'output' = 'entry';
        if (tipoRaw.toString().toLowerCase().includes('salida')) type = 'output';

        newTransactions.push({
          id: (row['ID'] || row['id'] || Date.now() + Math.random()).toString(),
          date: row['Fecha'] || row['fecha'] || new Date().toISOString().split('T')[0],
          type: type,
          itemName: item.toString(),
          itemId: (row['ItemId'] || row['itemId'] || 'unknown').toString(),
          quantity: parseInt(row['Cantidad'] || row['cantidad'] || '0'),
          detail: (row['Detalle'] || row['detalle'] || '').toString(),
          responsible: (row['Responsable'] || row['responsable'] || '').toString()
        });
      });

      if (newTransactions.length === 0) throw new Error("No se encontraron registros válidos.");

      onImportTransactions(newTransactions);
      setSuccessMsg(`Historial procesado. ${newTransactions.length} registros analizados.`);
      if (fileInputHistoryRef.current) fileInputHistoryRef.current.value = '';

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetStatus = () => {
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[500px] transition-all">
      
      {/* Internal Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-800">
        <button
          onClick={() => { setActiveTab('inventory'); resetStatus(); }}
          className={`flex-1 py-4 text-center text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'inventory' 
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
              : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Package size={18} />
          Gestión de Inventario (Items)
        </button>
        <button
          onClick={() => { setActiveTab('history'); resetStatus(); }}
          className={`flex-1 py-4 text-center text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'history' 
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' 
              : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <History size={18} />
          Gestión de Historial (Movimientos)
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6">
           <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
             {activeTab === 'inventory' ? 'Datos del Inventario' : 'Historial Acumulativo'}
           </h2>
           <p className="text-sm text-gray-500 dark:text-gray-400">
             {activeTab === 'inventory' 
               ? 'Descarga el listado actual o sube un archivo para reemplazar todo el stock.' 
               : 'Descarga reportes diarios o sube archivos antiguos para reconstruir el historial mensual.'}
           </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/30 flex items-center gap-3 animate-in fade-in">
            <AlertTriangle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        
        {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-emerald-900/30 flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* EXPORT CARD */}
          <div className={`rounded-xl p-6 border flex flex-col justify-between ${
            activeTab === 'inventory' 
              ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30' 
              : 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30'
          }`}>
            <div>
              <h3 className={`font-bold text-lg mb-2 flex items-center gap-2 ${
                activeTab === 'inventory' ? 'text-blue-900 dark:text-blue-300' : 'text-purple-900 dark:text-purple-300'
              }`}>
                <Download size={20} />
                Exportar / Descargar
              </h3>
              <p className={`text-sm mb-6 ${
                activeTab === 'inventory' ? 'text-blue-800/70 dark:text-blue-400/70' : 'text-purple-800/70 dark:text-purple-400/70'
              }`}>
                {activeTab === 'inventory' 
                  ? 'Genera un Excel (.xlsx) con el estado actual de todos los items y su stock.' 
                  : 'Genera un reporte Excel con todos los movimientos registrados hasta hoy.'}
              </p>
            </div>
            
            <button
              onClick={() => activeTab === 'inventory' ? handleExportInventory('xlsx') : handleExportHistory('xlsx')}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all shadow-sm active:scale-95 ${
                activeTab === 'inventory' 
                  ? 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600' 
                  : 'bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-600'
              }`}
            >
              <FileSpreadsheet size={18} />
              Descargar Excel
            </button>
          </div>

          {/* IMPORT CARD */}
          <div className={`rounded-xl p-6 border flex flex-col justify-between ${
            activeTab === 'inventory' 
              ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' 
              : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30'
          }`}>
            <div>
              <h3 className={`font-bold text-lg mb-2 flex items-center gap-2 ${
                 activeTab === 'inventory' ? 'text-emerald-900 dark:text-emerald-300' : 'text-amber-900 dark:text-amber-300'
              }`}>
                <Upload size={20} />
                {activeTab === 'inventory' ? 'Cargar Inventario' : 'Cargar Histórico'}
              </h3>
              <p className={`text-sm mb-6 ${
                activeTab === 'inventory' ? 'text-emerald-800/70 dark:text-emerald-400/70' : 'text-amber-800/70 dark:text-amber-400/70'
              }`}>
                {activeTab === 'inventory' 
                  ? 'Sube un archivo Excel para reemplazar los items actuales.' 
                  : 'Sube reportes Excel de días anteriores para fusionarlos y armar el mes.'}
              </p>
            </div>

            <div className="relative">
              <input
                type="file"
                accept=".xlsx, .xls"
                ref={activeTab === 'inventory' ? fileInputInventoryRef : fileInputHistoryRef}
                onChange={activeTab === 'inventory' ? handleImportInventoryFile : handleImportHistoryFile}
                className="hidden"
              />
              <button
                onClick={() => (activeTab === 'inventory' ? fileInputInventoryRef : fileInputHistoryRef).current?.click()}
                disabled={isProcessing}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all shadow-sm active:scale-95 ${
                   isProcessing ? 'opacity-70 cursor-wait' : ''
                } ${
                  activeTab === 'inventory' 
                    ? 'bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-600' 
                    : 'bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-600'
                }`}
              >
                {isProcessing ? (
                  <span className="animate-pulse">Procesando...</span>
                ) : (
                  <>
                    <Upload size={18} />
                    {activeTab === 'inventory' ? 'Subir Excel Inventario' : 'Fusionar Excel Historial'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-400 dark:text-gray-500">
           {activeTab === 'inventory' 
             ? 'Nota: La carga de inventario REEMPLAZA los items actuales.' 
             : 'Nota: La carga de historial AGREGA registros nuevos (evita duplicados por ID).'}
        </div>
      </div>
    </div>
  );
};
