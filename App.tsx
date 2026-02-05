
import React, { useState, useEffect, useCallback } from 'react';
import { InventoryItem, TabView, Transaction, TransactionItem, Project } from './types';
import { INITIAL_INVENTORY } from './constants';
import { inventoryService, transactionService, projectService, categoryService } from './services/database';
import { Dashboard } from './components/Dashboard';
import { InventoryView } from './components/InventoryView';
import { EntryForm } from './components/EntryForm';
import { OutputForm } from './components/OutputForm';
import { HistoryView } from './components/HistoryView';
import { DataManagement } from './components/DataManagement';
import { CategoryManagement } from './components/CategoryManagement';
import { ProjectsView } from './components/ProjectsView';
import { ThresholdView } from './components/ThresholdView';
import { Login } from './components/Login';
import { SuccessModal } from './components/SuccessModal';
import { LayoutDashboard, ArrowDownCircle, ArrowUpCircle, LogOut, Calendar, Building2, Database, BarChart3, Sun, Moon, Tags, Briefcase, BellRing } from 'lucide-react';

const COMPANY_LOGO_URL = "https://drive.google.com/thumbnail?id=1Ih42fn-28xs3VSV9LpDZ_oU-zcOfgpCd&sz=w1000";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabView>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(['Sin Categoría', 'Herramientas', 'Paneles Solares', 'Inversores', 'Baterías']);
  const [darkMode, setDarkMode] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const { authService } = await import('./services/auth');
        const session = await authService.getSession();
        if (session) setIsAuthenticated(true);
        
        authService.onAuthStateChange((isAuth) => {
          setIsAuthenticated(isAuth);
        });

        const savedTheme = localStorage.getItem('sim_theme');
        if (savedTheme === 'dark') {
          setDarkMode(true);
          document.documentElement.classList.add('dark');
        }

        const [items, trans, projs, cats] = await Promise.all([
          inventoryService.getAll(),
          transactionService.getAll(),
          projectService.getAll(),
          categoryService.getAll()
        ]);
        
        setInventory(items);
        setTransactions(trans);
        setProjects(projs);
        setCategories(cats);
      } catch (error) {
        console.error('Error initializing app:', error);
        
        const savedCats = localStorage.getItem('sim_categories');
        if (savedCats) setCategories(JSON.parse(savedCats));

        const savedInventory = localStorage.getItem('sim_inventory');
        if (savedInventory) {
          setInventory(JSON.parse(savedInventory));
        } else {
          setInventory(INITIAL_INVENTORY);
          localStorage.setItem('sim_inventory', JSON.stringify(INITIAL_INVENTORY));
        }

        const savedTransactions = localStorage.getItem('sim_transactions');
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        
        const savedProjects = localStorage.getItem('sim_projects');
        if (savedProjects) setProjects(JSON.parse(savedProjects));
      }
    };
    
    initializeApp();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('sim_theme', newMode ? 'dark' : 'light');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const { authService } = await import('./services/auth');
      await authService.signOut();
      setIsAuthenticated(false);
      setCurrentTab('dashboard');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const showSuccessModal = (msg: string) => {
    setModalMessage(msg);
    setShowModal(true);
  };

  const handleUpdateItem = async (updatedItem: InventoryItem) => {
    try {
      await inventoryService.update(updatedItem.id, updatedItem);
      setInventory(prev => prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
      showSuccessModal(`Producto "${updatedItem.item}" actualizado.`);
    } catch (error) {
      console.error('Error updating item:', error);
      showSuccessModal(`Error al actualizar: ${(error as Error).message}`);
    }
  };

  const handleUpdateThreshold = async (itemId: string, newThreshold: number) => {
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) return;
      
      await inventoryService.update(itemId, { ...item, lowStockThreshold: newThreshold });
      setInventory(prev => prev.map(i => 
        i.id === itemId ? { ...i, lowStockThreshold: newThreshold } : i
      ));
    } catch (error) {
      console.error('Error updating threshold:', error);
    }
  };

  const handleAddProject = async (name: string) => {
    try {
      const newProject = await projectService.create(name);
      setProjects(prev => [...prev, newProject]);
      showSuccessModal(`Proyecto "${name}" creado exitosamente.`);
    } catch (error) {
      console.error('Error creating project:', error);
      showSuccessModal(`Error al crear proyecto: ${(error as Error).message}`);
    }
  };

  const handleToggleProjectStatus = async (id: string) => {
    try {
      const project = projects.find(p => p.id === id);
      if (!project) return;
      
      const newStatus = project.status === 'active' ? 'finished' : 'active';
      await projectService.updateStatus(id, newStatus);
      
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, status: newStatus } : p
      ));
      showSuccessModal('Estado del proyecto actualizado.');
    } catch (error) {
      console.error('Error updating project status:', error);
      showSuccessModal(`Error: ${(error as Error).message}`);
    }
  };

  const handleAddCategory = async (name: string) => {
    try {
      if (!categories.includes(name)) {
        await categoryService.create(name);
        setCategories(prev => [...prev, name]);
        showSuccessModal(`Categoría "${name}" creada.`);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      showSuccessModal(`Error: ${(error as Error).message}`);
    }
  };

  const handleAssignCategory = async (itemIds: string[], category: string) => {
    try {
      for (const itemId of itemIds) {
        const item = inventory.find(i => i.id === itemId);
        if (item) {
          await inventoryService.update(itemId, { ...item, category });
        }
      }
      setInventory(prev => prev.map(item => 
        itemIds.includes(item.id) ? { ...item, category } : item
      ));
      showSuccessModal(`Se asignó la categoría "${category}" a ${itemIds.length} productos.`);
    } catch (error) {
      console.error('Error assigning category:', error);
      showSuccessModal(`Error: ${(error as Error).message}`);
    }
  };

  const handleImportInventory = async (newItems: InventoryItem[]) => {
    try {
      for (const item of newItems) {
        const { id, ...itemData } = item;
        await inventoryService.create(itemData);
      }
      
      const updatedItems = await inventoryService.getAll();
      setInventory(updatedItems);
      showSuccessModal(`Inventario actualizado con ${newItems.length} items.`);
    } catch (error) {
      console.error('Error importing inventory:', error);
      showSuccessModal(`Error: ${(error as Error).message}`);
    }
  };

  const handleImportTransactions = async (newTransactions: Transaction[]) => {
    try {
      const currentTransactions = await transactionService.getAll();
      const currentIds = new Set(currentTransactions.map(t => t.id));
      
      for (const trans of newTransactions) {
        if (!currentIds.has(trans.id)) {
          if (trans.items && trans.items.length > 0) {
            await transactionService.createWithItems(trans, trans.items);
          } else {
            await transactionService.create(trans);
          }
        }
      }
      
      const updatedTransactions = await transactionService.getAll();
      setTransactions(updatedTransactions);
      showSuccessModal(`Historial actualizado.`);
    } catch (error) {
      console.error('Error importing transactions:', error);
      showSuccessModal(`Error: ${(error as Error).message}`);
    }
  };

  const handleAddNewItem = useCallback(async (itemData: Omit<InventoryItem, 'id'>): Promise<string> => {
    try {
      const newItem = await inventoryService.create(itemData);
      setInventory(prev => [...prev, newItem]);
      showSuccessModal(`Item "${itemData.item}" añadido.`);
      return newItem.id;
    } catch (error) {
      console.error('Error adding item:', error);
      showSuccessModal(`Error al añadir item: ${(error as Error).message}`);
      throw error;
    }
  }, []);

  const handleEntrySubmit = useCallback(async (itemId: string, quantity: number, supplier: string, date: string) => {
    try {
      const item = inventory.find(i => i.id === itemId);
      if (!item) return;
      
      await inventoryService.updateStock(itemId, item.currentStock + quantity);
      
      await transactionService.create({
        type: 'entry',
        date,
        itemId,
        itemName: item.item,
        quantity,
        detail: supplier
      });
      
      const [updatedItems, updatedTrans] = await Promise.all([
        inventoryService.getAll(),
        transactionService.getAll()
      ]);
      setInventory(updatedItems);
      setTransactions(updatedTrans);
      
      showSuccessModal('Entrada registrada.');
    } catch (error) {
      console.error('Error registering entry:', error);
      showSuccessModal(`Error: ${(error as Error).message}`);
    }
  }, [inventory]);

  const handleBulkOutputSubmit = useCallback(async (outputs: {itemId: string, quantity: number}[], projectId: string, responsible: string, date: string) => {
    try {
      // VALIDACIÓN PREVIA: Verificar que todos los items tienen stock suficiente
      for (const output of outputs) {
        const item = inventory.find(i => i.id === output.itemId);
        if (!item) {
          throw new Error(`Item no encontrado: ${output.itemId}`);
        }
        if (item.currentStock < output.quantity) {
          throw new Error(`Stock insuficiente para ${item.item}. Disponible: ${item.currentStock}, Solicitado: ${output.quantity}`);
        }
      }

      // Si todas las validaciones pasaron, proceder con las actualizaciones
      for (const output of outputs) {
        const item = inventory.find(i => i.id === output.itemId);
        if (item) {
          await inventoryService.updateStock(output.itemId, item.currentStock - output.quantity);
        }
      }
      
      const transactionItems: TransactionItem[] = outputs.map(o => {
        const item = inventory.find(i => i.id === o.itemId);
        return {
          itemId: o.itemId,
          itemName: item?.item || 'Item Desconocido',
          brand: item?.brand || 'S/M',
          quantity: o.quantity
        };
      });

      const totalQuantity = transactionItems.reduce((acc, curr) => acc + curr.quantity, 0);
      const project = projects.find(p => p.id === projectId);

      await transactionService.createWithItems({
        type: 'output',
        date,
        itemName: outputs.length === 1 ? transactionItems[0].itemName : `Despacho de ${outputs.length} productos`,
        quantity: totalQuantity,
        detail: project?.name || 'Proyecto Desconocido',
        projectId: project?.id,
        responsible
      }, transactionItems);

      const [updatedItems, updatedTrans] = await Promise.all([
        inventoryService.getAll(),
        transactionService.getAll()
      ]);
      setInventory(updatedItems);
      setTransactions(updatedTrans);

      showSuccessModal(`Despacho registrado para ${project?.name}.`);
    } catch (error) {
      console.error('Error registering output:', error);
      showSuccessModal(`Error: ${(error as Error).message}`);
    }
  }, [inventory, projects]);

  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      const { migrateLocalStorageToSupabase } = await import('./services/migration');
      const result = await migrateLocalStorageToSupabase();
      showSuccessModal(result.message);
      
      if (result.success) {
        const [items, trans, projs, cats] = await Promise.all([
          inventoryService.getAll(),
          transactionService.getAll(),
          projectService.getAll(),
          categoryService.getAll()
        ]);
        setInventory(items);
        setTransactions(trans);
        setProjects(projs);
        setCategories(cats);
      }
    } catch (error) {
      console.error('Migration error:', error);
      showSuccessModal(`Error en migración: ${(error as Error).message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  if (!isAuthenticated) return (
    <Login 
      onLogin={handleLogin} 
      logoUrl={COMPANY_LOGO_URL} 
      isDarkMode={darkMode} 
      onToggleDarkMode={toggleDarkMode} 
    />
  );

  const navigation = [
    { id: 'dashboard', label: 'Inicio', icon: BarChart3, color: 'blue' },
    { id: 'inventory', label: 'Inventario', icon: LayoutDashboard, color: 'blue' },
    { id: 'thresholds', label: 'Alertas', icon: BellRing, color: 'amber' },
    { id: 'projects', label: 'Proyectos', icon: Briefcase, color: 'blue' },
    { id: 'categories', label: 'Categorías', icon: Tags, color: 'indigo' },
    { id: 'entry', label: 'Entradas', icon: ArrowDownCircle, color: 'emerald' },
    { id: 'output', label: 'Salidas', icon: ArrowUpCircle, color: 'amber' },
    { id: 'history', label: 'Historial', icon: Calendar, color: 'purple' },
    { id: 'data', label: 'Datos', icon: Database, color: 'slate' }
  ];

  return (
    <div className="min-h-screen pb-12 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                {!logoError ? (
                  <img src={COMPANY_LOGO_URL} alt="Logo" className="w-full h-full object-contain p-1.5" onError={() => setLogoError(true)}/>
                ) : ( <Building2 className="text-blue-500" size={20} /> )}
              </div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">JF Solar</h1>
            </div>
            
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar">
              {navigation.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as TabView)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2.5 shrink-0 ${
                    currentTab === tab.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <tab.icon size={16} strokeWidth={currentTab === tab.id ? 2.5 : 2} />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {process.env.NODE_ENV === 'development' && (
                <button 
                  onClick={handleMigration} 
                  disabled={isMigrating}
                  className="p-2.5 text-slate-400 hover:text-green-500 rounded-2xl transition-all disabled:opacity-50"
                  title="Migrar datos a Supabase"
                >
                  {isMigrating ? '⏳' : '📤'}
                </button>
              )}
              <button onClick={toggleDarkMode} className="p-2.5 text-slate-400 hover:text-blue-500 rounded-2xl transition-all">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-500 rounded-2xl transition-all">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:hidden mb-8 grid grid-cols-5 gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg p-2 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 overflow-x-auto no-scrollbar">
           {navigation.map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as TabView)}
                className={`flex flex-col items-center py-3 px-2 rounded-2xl text-[9px] font-black uppercase transition-all shrink-0 ${
                  currentTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-xl' 
                    : 'text-slate-400'
                }`}
              >
                <tab.icon size={18} />
                <span className="mt-1">{tab.label.split(' ')[0]}</span>
              </button>
           ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          {currentTab === 'dashboard' && <Dashboard inventory={inventory} transactions={transactions} onNavigate={setCurrentTab} />}
          {currentTab === 'inventory' && <InventoryView inventory={inventory} categories={categories} transactions={transactions} onUpdateItem={handleUpdateItem} />}
          {currentTab === 'thresholds' && <ThresholdView inventory={inventory} onUpdateThreshold={handleUpdateThreshold} />}
          {currentTab === 'projects' && <ProjectsView projects={projects} transactions={transactions} onAddProject={handleAddProject} onToggleStatus={handleToggleProjectStatus} />}
          {currentTab === 'categories' && <CategoryManagement inventory={inventory} categories={categories} onAddCategory={handleAddCategory} onAssignCategory={handleAssignCategory} />}
          {currentTab === 'entry' && <EntryForm inventory={inventory} transactions={transactions} onSubmit={handleEntrySubmit} onAddNewItem={handleAddNewItem} />}
          {currentTab === 'output' && <OutputForm inventory={inventory} projects={projects} onSubmit={handleBulkOutputSubmit} />}
          {currentTab === 'history' && <HistoryView transactions={transactions} />}
          {currentTab === 'data' && <DataManagement inventory={inventory} transactions={transactions} onImportInventory={handleImportInventory} onImportTransactions={handleImportTransactions} />}
        </div>
      </main>

      <SuccessModal isOpen={showModal} message={modalMessage} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default App;
