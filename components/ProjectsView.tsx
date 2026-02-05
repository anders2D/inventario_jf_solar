
import React, { useState, useMemo } from 'react';
import { Project, Transaction } from '../types';
import { Briefcase, Plus, Search, CheckCircle2, Package, ListChecks, History, AlertCircle, Clock, Archive, ArrowLeft, User, Calendar as CalendarIcon, ArrowRight, Eye, ChevronUp, ChevronDown, CheckCircle, FileSpreadsheet, Download, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ProjectsViewProps {
  projects: Project[];
  transactions: Transaction[];
  onAddProject: (name: string) => void;
  onToggleStatus: (id: string) => void;
  onDeleteProject?: (id: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, transactions, onAddProject, onToggleStatus, onDeleteProject }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'finished'>('active');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [expandedTransactionId, setExpandedTransactionId] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' ? true : p.status === filter;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [projects, searchTerm, filter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim());
      setNewProjectName('');
    }
  };

  const projectDetails = useMemo(() => {
    if (!selectedProjectId) return null;
    const project = projects.find(p => p.id === selectedProjectId);
    const projectTransactions = transactions.filter(t => t.projectId === selectedProjectId);
    return { project, transactions: projectTransactions };
  }, [selectedProjectId, projects, transactions]);

  const getTotalUnits = (projectId: string) => {
    return transactions
      .filter(t => t.projectId === projectId)
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const toggleExpandTransaction = (id: string) => {
    setExpandedTransactionId(expandedTransactionId === id ? null : id);
  };

  const handleExportProjectReport = () => {
    if (!projectDetails?.project) return;
    const { project, transactions: history } = projectDetails;

    const exportData = history.flatMap(t => {
      if (t.items && t.items.length > 0) {
        return t.items.map(item => ({
          'Fecha': t.date,
          'Material / Insumo': item.itemName,
          'Marca': item.brand,
          'Cantidad': item.quantity,
          'Responsable': t.responsible || 'No asignado'
        }));
      } else {
        return [{
          'Fecha': t.date,
          'Material / Insumo': t.itemName,
          'Marca': 'S/M',
          'Cantidad': t.quantity,
          'Responsable': t.responsible || 'No asignado'
        }];
      }
    });

    if (exportData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte de Proyecto");

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Reporte_JF_Solar_${project.name.replace(/\s+/g, '_')}_${date}.xlsx`);
  };

  // Vista de Detalle de Proyecto
  if (selectedProjectId && projectDetails?.project) {
    const { project, transactions: projectHistory } = projectDetails;
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedProjectId(null)}
              className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{project.name}</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detalle de Materiales y Auditoría</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportProjectReport}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 font-black text-[11px] uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
            >
              <FileSpreadsheet size={18} />
              Exportar Reporte
            </button>
            
            <button 
              onClick={() => onToggleStatus(project.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                project.status === 'active' 
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-600 hover:text-white dark:bg-amber-900/20 dark:text-amber-400' 
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/20 dark:text-emerald-400'
              }`}
            >
              {project.status === 'active' ? (
                <><Archive size={18} /> Finalizar Proyecto</>
              ) : (
                <><Clock size={18} /> Reactivar Proyecto</>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado actual</p>
             <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
               project.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
             }`}>
               {project.status === 'active' ? '● En Curso' : '○ Finalizado'}
             </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fecha de Inicio</p>
             <p className="text-lg font-black text-slate-900 dark:text-white">{project.createdAt}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Unidades</p>
             <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">{getTotalUnits(project.id)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/40 dark:border-slate-800/40 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <Package className="text-blue-500" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Control de Materiales Despachados</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-4">Fecha</th>
                  <th className="px-8 py-4">Material / Insumo (Clic para detalle)</th>
                  <th className="px-8 py-4 text-center">Cantidad</th>
                  <th className="px-8 py-4">Responsable</th>
                  <th className="px-8 py-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {projectHistory.length > 0 ? (
                  projectHistory.map((t) => (
                    <React.Fragment key={t.id}>
                      <tr className={`transition-all ${expandedTransactionId === t.id ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                            <CalendarIcon size={14} />
                            {t.date}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div 
                            className={`flex flex-col select-none ${t.items ? 'cursor-pointer group/label' : ''}`}
                            onClick={() => t.items && toggleExpandTransaction(t.id)}
                          >
                            <span className={`font-black tracking-tight transition-colors ${t.items ? 'text-slate-900 dark:text-slate-100 group-hover/label:text-blue-600' : 'text-slate-900 dark:text-slate-100'}`}>
                              {t.itemName}
                            </span>
                            {t.items && (
                              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                <ListChecks size={12} />
                                Ver productos despachados ({t.items.length})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="text-base font-black text-blue-600 dark:text-blue-400 tracking-tighter">{t.quantity}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                              <User size={12} />
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.responsible || 'No asignado'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          {t.items ? (
                            <button 
                              onClick={() => toggleExpandTransaction(t.id)}
                              className={`p-2.5 rounded-xl transition-all shadow-sm ${
                                expandedTransactionId === t.id 
                                  ? 'bg-blue-600 text-white shadow-blue-500/30' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-600'
                              }`}
                            >
                              {expandedTransactionId === t.id ? <ChevronUp size={18} strokeWidth={3} /> : <Eye size={18} strokeWidth={3} />}
                            </button>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700 text-xs">—</span>
                          )}
                        </td>
                      </tr>

                      {/* Desglose Detallado Expandible */}
                      {expandedTransactionId === t.id && t.items && (
                        <tr>
                          <td colSpan={5} className="px-10 py-6 bg-blue-50/10 dark:bg-blue-900/5 animate-in slide-in-from-top-2 duration-200">
                            <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 overflow-hidden shadow-sm">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                  <tr className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    <th className="px-6 py-3">Referencia Producto</th>
                                    <th className="px-6 py-3">Marca</th>
                                    <th className="px-6 py-3 text-center">Cantidad Entregada</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                  {t.items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                      <td className="px-6 py-3 font-bold text-slate-700 dark:text-slate-200">{item.itemName}</td>
                                      <td className="px-6 py-3 font-black text-slate-400 uppercase text-[10px]">{item.brand}</td>
                                      <td className="px-6 py-3 text-center font-black text-blue-600 dark:text-blue-400">{item.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Package size={48} />
                        <p className="text-xs font-black uppercase tracking-widest mt-4">Sin materiales registrados</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Vista de Lista de Proyectos
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Cabecera y Formulario de Nuevo Proyecto */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/40 dark:border-slate-800/40 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 mb-6 tracking-tight">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Plus size={20} strokeWidth={3} />
            </div>
            Nuevo Proyecto
          </h3>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nombre de la Obra / Proyecto</label>
              <input 
                type="text"
                placeholder="Ej: Planta Solar Atacama"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
              />
            </div>
            <button 
              type="submit"
              disabled={!newProjectName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 disabled:opacity-30 active:scale-95"
            >
              CREAR PROYECTO
            </button>
          </form>
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-widest">Proyectos Activos</span>
              <span className="font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">{projects.filter(p => p.status === 'active').length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-widest">Finalizados</span>
              <span className="font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{projects.filter(p => p.status === 'finished').length}</span>
            </div>
          </div>
        </div>

        {/* Listado de Proyectos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-xl">
             <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full sm:w-auto">
               {(['active', 'finished', 'all'] as const).map(t => (
                 <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === t 
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                 >
                   {t === 'active' ? 'Activos' : t === 'finished' ? 'Finalizados' : 'Todos'}
                 </button>
               ))}
             </div>
             <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar proyecto..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold outline-none focus:border-blue-500"
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => {
                const units = getTotalUnits(project.id);
                return (
                  <div 
                    key={project.id} 
                    onClick={() => setSelectedProjectId(project.id)}
                    className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200/40 dark:border-slate-800/40 shadow-sm group hover:shadow-xl hover:translate-y-[-2px] transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <ArrowRight size={20} className="text-blue-500" />
                    </div>
                    
                    <div className="flex justify-between items-start mb-4 relative z-20">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl transition-all ${project.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                          <Briefcase size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">{project.name}</h4>
                          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${project.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {project.status === 'active' ? '● En Curso' : '○ Finalizado'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(project.id);
                          }}
                          className={`p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center relative z-30 ${
                            project.status === 'active' 
                              ? 'bg-slate-100 text-slate-400 hover:bg-amber-100 hover:text-amber-600 dark:bg-slate-800 dark:hover:bg-amber-900/30' 
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20'
                          }`}
                          title={project.status === 'active' ? "Dar por terminado" : "Reactivar"}
                        >
                          {project.status === 'active' ? <Archive size={20} strokeWidth={2.5} /> : <Clock size={20} strokeWidth={2.5} />}
                        </button>
                        {onDeleteProject && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Eliminar proyecto "${project.name}"?`)) {
                                onDeleteProject(project.id);
                              }
                            }}
                            className="p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center relative z-30 bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-900/30"
                            title="Eliminar proyecto"
                          >
                            <Trash2 size={20} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Materiales</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                          {transactions.filter(t => t.projectId === project.id).length}
                        </p>
                        <p className="text-[8px] text-slate-400 font-bold">Ver Detalles →</p>
                      </div>
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Unidades</p>
                        <p className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                          {units}
                        </p>
                        <p className="text-[8px] text-blue-400 font-bold">Total despachado</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <span>Iniciado: {project.createdAt}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-24 text-center bg-white/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Briefcase size={64} className="mx-auto mb-4 opacity-10" strokeWidth={1.5} />
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">No hay proyectos para mostrar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
