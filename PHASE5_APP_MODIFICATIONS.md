# 🚀 PHASE 5: Modificar App.tsx para Usar Supabase

## 📋 Descripción General

Reemplazar todas las operaciones de LocalStorage con llamadas a Supabase usando los servicios creados en Phase 4.

**Tiempo estimado:** 45 minutos  
**Archivos a modificar:** 1 (App.tsx)  
**Cambios principales:** 8 secciones

---

## 🎯 Cambios Requeridos

### CAMBIO 1: Agregar Imports de Servicios

**Ubicación:** Línea 1-16 (imports)

**Antes:**
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { InventoryItem, TabView, Transaction, TransactionItem, Project } from './types';
import { INITIAL_INVENTORY } from './constants';
// ... resto de imports
```

**Después:**
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { InventoryItem, TabView, Transaction, TransactionItem, Project } from './types';
import { INITIAL_INVENTORY } from './constants';
import { inventoryService, transactionService, projectService, categoryService } from './services/database';
// ... resto de imports
```

**Cambio:** Agregar línea de import de servicios

---

### CAMBIO 2: Reemplazar useEffect de Carga Inicial

**Ubicación:** Línea ~30-60 (primer useEffect)

**Antes:**
```typescript
useEffect(() => {
  const session = localStorage.getItem('sim_auth');
  if (session === 'true') setIsAuthenticated(true);
  
  const savedTheme = localStorage.getItem('sim_theme');
  if (savedTheme === 'dark') {
    setDarkMode(true);
    document.documentElement.classList.add('dark');
  }

  const savedCats = localStorage.getItem('sim_categories');
  if (savedCats) setCategories(JSON.parse(savedCats));

  const savedInventory = localStorage.getItem('sim_inventory');
  const savedTransactions = localStorage.getItem('sim_transactions');
  const savedProjects = localStorage.getItem('sim_projects');
  
  if (savedInventory) {
    setInventory(JSON.parse(savedInventory));
  } else {
    setInventory(INITIAL_INVENTORY);
    localStorage.setItem('sim_inventory', JSON.stringify(INITIAL_INVENTORY));
  }

  if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  if (savedProjects) setProjects(JSON.parse(savedProjects));
}, []);
```

**Después:**
```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      const session = localStorage.getItem('sim_auth');
      if (session === 'true') setIsAuthenticated(true);
      
      const savedTheme = localStorage.getItem('sim_theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }

      // Cargar desde Supabase
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
      console.error('Error loading data from Supabase:', error);
      // Fallback a LocalStorage si falla
      const savedInventory = localStorage.getItem('sim_inventory');
      if (savedInventory) setInventory(JSON.parse(savedInventory));
      const savedTransactions = localStorage.getItem('sim_transactions');
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      const savedProjects = localStorage.getItem('sim_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      const savedCats = localStorage.getItem('sim_categories');
      if (savedCats) setCategories(JSON.parse(savedCats));
    }
  };
  
  loadData();
}, []);
```

**Cambios:**
- Envolver en función async
- Usar Promise.all para cargar datos en paralelo
- Agregar try/catch con fallback a LocalStorage
- Eliminar lógica de INITIAL_INVENTORY

---

### CAMBIO 3: Eliminar useEffect de Persistencia de Inventario

**Ubicación:** Línea ~62-64

**Antes:**
```typescript
useEffect(() => {
  if (inventory.length > 0) localStorage.setItem('sim_inventory', JSON.stringify(inventory));
}, [inventory]);
```

**Después:**
```typescript
// ELIMINADO - Supabase guarda automáticamente
```

**Cambio:** Eliminar completamente este useEffect

---

### CAMBIO 4: Eliminar useEffect de Persistencia de Transacciones

**Ubicación:** Línea ~66-68

**Antes:**
```typescript
useEffect(() => {
  localStorage.setItem('sim_transactions', JSON.stringify(transactions));
}, [transactions]);
```

**Después:**
```typescript
// ELIMINADO - Supabase guarda automáticamente
```

**Cambio:** Eliminar completamente este useEffect

---

### CAMBIO 5: Eliminar useEffect de Persistencia de Categorías

**Ubicación:** Línea ~70-72

**Antes:**
```typescript
useEffect(() => {
  localStorage.setItem('sim_categories', JSON.stringify(categories));
}, [categories]);
```

**Después:**
```typescript
// ELIMINADO - Supabase guarda automáticamente
```

**Cambio:** Eliminar completamente este useEffect

---

### CAMBIO 6: Eliminar useEffect de Persistencia de Proyectos

**Ubicación:** Línea ~74-76

**Antes:**
```typescript
useEffect(() => {
  localStorage.setItem('sim_projects', JSON.stringify(projects));
}, [projects]);
```

**Después:**
```typescript
// ELIMINADO - Supabase guarda automáticamente
```

**Cambio:** Eliminar completamente este useEffect

---

### CAMBIO 7: Reemplazar handleAddNewItem

**Ubicación:** Línea ~120-125

**Antes:**
```typescript
const handleAddNewItem = useCallback((itemData: Omit<InventoryItem, 'id'>): string => {
  const newId = Date.now().toString();
  setInventory(prev => [...prev, { ...itemData, id: newId }]);
  showSuccessModal(`Item \"${itemData.item}\" añadido.`);
  return newId;
}, []);
```

**Después:**
```typescript
const handleAddNewItem = useCallback(async (itemData: Omit<InventoryItem, 'id'>): Promise<string> => {
  try {
    const newItem = await inventoryService.create(itemData);
    setInventory(prev => [...prev, newItem]);
    showSuccessModal(`Item \"${itemData.item}\" añadido.`);
    return newItem.id;
  } catch (error) {
    console.error('Error adding item:', error);
    showSuccessModal(`Error al añadir item: ${error.message}`);
    throw error;
  }
}, []);
```

**Cambios:**
- Hacer función async
- Usar inventoryService.create()
- Agregar try/catch
- Retornar Promise<string>

---

### CAMBIO 8: Reemplazar handleUpdateItem

**Ubicación:** Línea ~127-133

**Antes:**
```typescript
const handleUpdateItem = (updatedItem: InventoryItem) => {
  setInventory(prev => prev.map(item => 
    item.id === updatedItem.id ? updatedItem : item
  ));
  showSuccessModal(`Producto \"${updatedItem.item}\" actualizado.`);
};
```

**Después:**
```typescript
const handleUpdateItem = async (updatedItem: InventoryItem) => {
  try {
    await inventoryService.update(updatedItem.id, updatedItem);
    setInventory(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    showSuccessModal(`Producto \"${updatedItem.item}\" actualizado.`);
  } catch (error) {
    console.error('Error updating item:', error);
    showSuccessModal(`Error al actualizar: ${error.message}`);
  }
};
```

**Cambios:**
- Hacer función async
- Usar inventoryService.update()
- Agregar try/catch

---

### CAMBIO 9: Reemplazar handleUpdateThreshold

**Ubicación:** Línea ~135-140

**Antes:**
```typescript
const handleUpdateThreshold = (itemId: string, newThreshold: number) => {
  setInventory(prev => prev.map(item => 
    item.id === itemId ? { ...item, lowStockThreshold: newThreshold } : item
  ));
};
```

**Después:**
```typescript
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
```

**Cambios:**
- Hacer función async
- Usar inventoryService.update()
- Agregar try/catch

---

### CAMBIO 10: Reemplazar handleAddProject

**Ubicación:** Línea ~142-150

**Antes:**
```typescript
const handleAddProject = (name: string) => {
  const newProject: Project = {
    id: Date.now().toString(),
    name,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0]
  };
  setProjects(prev => [...prev, newProject]);
  showSuccessModal(`Proyecto \"${name}\" creado exitosamente.`);
};
```

**Después:**
```typescript
const handleAddProject = async (name: string) => {
  try {
    const newProject = await projectService.create(name);
    setProjects(prev => [...prev, newProject]);
    showSuccessModal(`Proyecto \"${name}\" creado exitosamente.`);
  } catch (error) {
    console.error('Error creating project:', error);
    showSuccessModal(`Error al crear proyecto: ${error.message}`);
  }
};
```

**Cambios:**
- Hacer función async
- Usar projectService.create()
- Eliminar creación manual de ID
- Agregar try/catch

---

### CAMBIO 11: Reemplazar handleToggleProjectStatus

**Ubicación:** Línea ~152-158

**Antes:**
```typescript
const handleToggleProjectStatus = (id: string) => {
  setProjects(prev => prev.map(p => 
    p.id === id ? { ...p, status: p.status === 'active' ? 'finished' : 'active' } : p
  ));
  showSuccessModal('Estado del proyecto actualizado.');
};
```

**Después:**
```typescript
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
    showSuccessModal(`Error: ${error.message}`);
  }
};
```

**Cambios:**
- Hacer función async
- Usar projectService.updateStatus()
- Agregar try/catch

---

### CAMBIO 12: Reemplazar handleAddCategory

**Ubicación:** Línea ~160-165

**Antes:**
```typescript
const handleAddCategory = (name: string) => {
  if (!categories.includes(name)) {
    setCategories(prev => [...prev, name]);
    showSuccessModal(`Categoría \"${name}\" creada.`);
  }
};
```

**Después:**
```typescript
const handleAddCategory = async (name: string) => {
  try {
    if (!categories.includes(name)) {
      await categoryService.create(name);
      setCategories(prev => [...prev, name]);
      showSuccessModal(`Categoría \"${name}\" creada.`);
    }
  } catch (error) {
    console.error('Error creating category:', error);
    showSuccessModal(`Error: ${error.message}`);
  }
};
```

**Cambios:**
- Hacer función async
- Usar categoryService.create()
- Agregar try/catch

---

### CAMBIO 13: Reemplazar handleAssignCategory

**Ubicación:** Línea ~167-172

**Antes:**
```typescript
const handleAssignCategory = (itemIds: string[], category: string) => {
  setInventory(prev => prev.map(item => 
    itemIds.includes(item.id) ? { ...item, category } : item
  ));
  showSuccessModal(`Se asignó la categoría \"${category}\" a ${itemIds.length} productos.`);
};
```

**Después:**
```typescript
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
    showSuccessModal(`Se asignó la categoría \"${category}\" a ${itemIds.length} productos.`);
  } catch (error) {
    console.error('Error assigning category:', error);
    showSuccessModal(`Error: ${error.message}`);
  }
};
```

**Cambios:**
- Hacer función async
- Usar inventoryService.update() en loop
- Agregar try/catch

---

### CAMBIO 14: Reemplazar handleImportInventory

**Ubicación:** Línea ~174-177

**Antes:**
```typescript
const handleImportInventory = (newItems: InventoryItem[]) => {
  setInventory(newItems);
  showSuccessModal(`Inventario actualizado con ${newItems.length} items.`);
};
```

**Después:**
```typescript
const handleImportInventory = async (newItems: InventoryItem[]) => {
  try {
    // Limpiar inventario actual
    const currentItems = await inventoryService.getAll();
    
    // Insertar nuevos items
    for (const item of newItems) {
      const { id, ...itemData } = item;
      await inventoryService.create(itemData);
    }
    
    // Recargar desde Supabase
    const updatedItems = await inventoryService.getAll();
    setInventory(updatedItems);
    showSuccessModal(`Inventario actualizado con ${newItems.length} items.`);
  } catch (error) {
    console.error('Error importing inventory:', error);
    showSuccessModal(`Error: ${error.message}`);
  }
};
```

**Cambios:**
- Hacer función async
- Usar inventoryService.create() en loop
- Recargar datos desde Supabase
- Agregar try/catch

---

### CAMBIO 15: Reemplazar handleImportTransactions

**Ubicación:** Línea ~179-186

**Antes:**
```typescript
const handleImportTransactions = (newTransactions: Transaction[]) => {
  setTransactions(prev => {
    const currentIds = new Set(prev.map(t => t.id));
    const uniqueNewTransactions = newTransactions.filter(t => !currentIds.has(t.id));
    return [...uniqueNewTransactions, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
  showSuccessModal(`Historial actualizado.`);
};
```

**Después:**
```typescript
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
    showSuccessModal(`Error: ${error.message}`);
  }
};
```

**Cambios:**
- Hacer función async
- Usar transactionService.create() o createWithItems()
- Recargar datos desde Supabase
- Agregar try/catch

---

### CAMBIO 16: Reemplazar handleEntrySubmit

**Ubicación:** Línea ~188-205

**Antes:**
```typescript
const handleEntrySubmit = useCallback((itemId: string, quantity: number, supplier: string, date: string) => {
  setInventory(prev => prev.map(item => {
    if (item.id === itemId) {
      return { ...item, currentStock: item.currentStock + quantity };
    }
    return item;
  }));
  const itemName = inventory.find(i => i.id === itemId)?.item || 'Item';
  setTransactions(prev => [{ 
    id: Date.now().toString(), 
    type: 'entry', 
    date, 
    itemId, 
    itemName, 
    quantity, 
    detail: supplier 
  }, ...prev]);
  showSuccessModal('Entrada registrada.');
}, [inventory]);
```

**Después:**
```typescript
const handleEntrySubmit = useCallback(async (itemId: string, quantity: number, supplier: string, date: string) => {
  try {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    
    // Actualizar stock
    await inventoryService.updateStock(itemId, item.currentStock + quantity);
    
    // Crear transacción
    await transactionService.create({
      type: 'entry',
      date,
      itemId,
      itemName: item.item,
      quantity,
      detail: supplier
    });
    
    // Recargar datos
    const [updatedItems, updatedTrans] = await Promise.all([
      inventoryService.getAll(),
      transactionService.getAll()
    ]);
    setInventory(updatedItems);
    setTransactions(updatedTrans);
    
    showSuccessModal('Entrada registrada.');
  } catch (error) {
    console.error('Error registering entry:', error);
    showSuccessModal(`Error: ${error.message}`);
  }
}, [inventory]);
```

**Cambios:**
- Hacer función async
- Usar inventoryService.updateStock()
- Usar transactionService.create()
- Recargar datos desde Supabase
- Agregar try/catch

---

### CAMBIO 17: Reemplazar handleBulkOutputSubmit

**Ubicación:** Línea ~207-240

**Antes:**
```typescript
const handleBulkOutputSubmit = useCallback((outputs: {itemId: string, quantity: number}[], projectId: string, responsible: string, date: string) => {
  setInventory(prev => prev.map(item => {
    const output = outputs.find(o => o.itemId === item.id);
    if (output) {
      return { ...item, currentStock: item.currentStock - output.quantity };
    }
    return item;
  }));

  const project = projects.find(p => p.id === projectId);

  const transactionItems: TransactionItem[] = outputs.map(o => {
    const originalItem = inventory.find(i => i.id === o.itemId);
    return {
      itemId: o.itemId,
      itemName: originalItem?.item || 'Item Desconocido',
      brand: originalItem?.brand || 'S/M',
      quantity: o.quantity
    };
  });

  const totalQuantity = transactionItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const newTransaction: Transaction = {
    id: Date.now().toString(),
    type: 'output',
    date,
    itemName: outputs.length === 1 ? transactionItems[0].itemName : `Despacho de ${outputs.length} productos`,
    quantity: totalQuantity,
    items: transactionItems,
    detail: project?.name || 'Proyecto Desconocido',
    projectId: project?.id,
    responsible
  };

  setTransactions(prev => [newTransaction, ...prev]);
  showSuccessModal(`Despacho registrado para ${project?.name}.`);
}, [inventory, projects]);
```

**Después:**
```typescript
const handleBulkOutputSubmit = useCallback(async (outputs: {itemId: string, quantity: number}[], projectId: string, responsible: string, date: string) => {
  try {
    // Actualizar stocks
    for (const output of outputs) {
      const item = inventory.find(i => i.id === output.itemId);
      if (item) {
        await inventoryService.updateStock(output.itemId, item.currentStock - output.quantity);
      }
    }
    
    // Preparar items de transacción
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

    // Crear transacción con items
    await transactionService.createWithItems({
      type: 'output',
      date,
      itemName: outputs.length === 1 ? transactionItems[0].itemName : `Despacho de ${outputs.length} productos`,
      quantity: totalQuantity,
      detail: project?.name || 'Proyecto Desconocido',
      projectId: project?.id,
      responsible
    }, transactionItems);

    // Recargar datos
    const [updatedItems, updatedTrans] = await Promise.all([
      inventoryService.getAll(),
      transactionService.getAll()
    ]);
    setInventory(updatedItems);
    setTransactions(updatedTrans);

    showSuccessModal(`Despacho registrado para ${project?.name}.`);
  } catch (error) {
    console.error('Error registering output:', error);
    showSuccessModal(`Error: ${error.message}`);
  }
}, [inventory, projects]);
```

**Cambios:**
- Hacer función async
- Usar inventoryService.updateStock() en loop
- Usar transactionService.createWithItems()
- Recargar datos desde Supabase
- Agregar try/catch

---

## 📊 Resumen de Cambios

| # | Función | Tipo | Cambio Principal |
|---|---------|------|------------------|
| 1 | Imports | Agregar | Importar servicios |
| 2 | useEffect inicial | Reemplazar | Cargar desde Supabase |
| 3 | useEffect inventory | Eliminar | Ya no necesario |
| 4 | useEffect transactions | Eliminar | Ya no necesario |
| 5 | useEffect categories | Eliminar | Ya no necesario |
| 6 | useEffect projects | Eliminar | Ya no necesario |
| 7 | handleAddNewItem | Reemplazar | Usar inventoryService |
| 8 | handleUpdateItem | Reemplazar | Usar inventoryService |
| 9 | handleUpdateThreshold | Reemplazar | Usar inventoryService |
| 10 | handleAddProject | Reemplazar | Usar projectService |
| 11 | handleToggleProjectStatus | Reemplazar | Usar projectService |
| 12 | handleAddCategory | Reemplazar | Usar categoryService |
| 13 | handleAssignCategory | Reemplazar | Usar inventoryService |
| 14 | handleImportInventory | Reemplazar | Usar inventoryService |
| 15 | handleImportTransactions | Reemplazar | Usar transactionService |
| 16 | handleEntrySubmit | Reemplazar | Usar servicios |
| 17 | handleBulkOutputSubmit | Reemplazar | Usar servicios |

**Total de cambios:** 17  
**Líneas a eliminar:** ~20  
**Líneas a agregar:** ~150  
**Complejidad:** Media

---

## ⚠️ Consideraciones Importantes

### 1. Manejo de Errores
- Todos los handlers ahora tienen try/catch
- Los errores se muestran al usuario via showSuccessModal
- Los errores se loguean en consola para debugging

### 2. Fallback a LocalStorage
- El useEffect inicial tiene fallback a LocalStorage
- Útil si Supabase no está disponible
- Permite transición gradual

### 3. Recargas de Datos
- Después de cada operación, se recargan datos desde Supabase
- Asegura que el estado local esté sincronizado
- Puede optimizarse con actualizaciones locales + sync en background

### 4. Funciones Async
- Todos los handlers que modifican datos son ahora async
- Los componentes que los llaman deben esperar con await
- Revisar componentes que usan estos handlers

### 5. Dependencias de useCallback
- handleEntrySubmit y handleBulkOutputSubmit dependen de [inventory, projects]
- Esto puede causar re-renders frecuentes
- Considerar optimizar con useRef o memoización

---

## 🔄 Orden de Implementación Recomendado

1. **Paso 1:** Agregar imports (CAMBIO 1)
2. **Paso 2:** Reemplazar useEffect inicial (CAMBIO 2)
3. **Paso 3:** Eliminar useEffects de persistencia (CAMBIOS 3-6)
4. **Paso 4:** Reemplazar handlers simples (CAMBIOS 7-13)
5. **Paso 5:** Reemplazar handlers complejos (CAMBIOS 14-17)
6. **Paso 6:** Probar cada funcionalidad

---

## 🧪 Testing Checklist

Después de implementar cada cambio, probar:

- [ ] Cargar página → datos se cargan desde Supabase
- [ ] Crear nuevo producto → se guarda en Supabase
- [ ] Editar producto → se actualiza en Supabase
- [ ] Registrar entrada → stock se actualiza
- [ ] Registrar salida → stock se decrementa
- [ ] Crear proyecto → se guarda en Supabase
- [ ] Cambiar estado proyecto → se actualiza en Supabase
- [ ] Crear categoría → se guarda en Supabase
- [ ] Asignar categoría → se actualiza en Supabase
- [ ] Importar inventario → se carga en Supabase
- [ ] Importar transacciones → se cargan en Supabase
- [ ] Modo oscuro → se mantiene en LocalStorage
- [ ] Autenticación → se mantiene en LocalStorage
- [ ] Errores de Supabase → fallback a LocalStorage

---

## 🚨 Problemas Comunes y Soluciones

### Problema 1: "Cannot read property 'map' of undefined"
**Causa:** Datos no cargados aún  
**Solución:** Agregar validación `if (!data) return;`

### Problema 2: "Async function in useCallback"
**Causa:** useCallback no soporta async directamente  
**Solución:** Envolver en función async dentro del callback

### Problema 3: "Infinite loop en useEffect"
**Causa:** Dependencias incorrectas  
**Solución:** Revisar array de dependencias

### Problema 4: "Datos no se sincronizan"
**Causa:** No se recargan datos después de operación  
**Solución:** Usar Promise.all para recargar datos

### Problema 5: "Supabase connection error"
**Causa:** Variables de entorno no configuradas  
**Solución:** Verificar .env y reiniciar servidor

---

## 📝 Notas Finales

- Este documento cubre TODOS los cambios necesarios
- Seguir el orden recomendado para evitar errores
- Probar después de cada cambio
- Mantener LocalStorage como fallback durante 1 semana
- Después de 1 semana, eliminar fallback a LocalStorage

---

**Documento creado:** Diciembre 2024  
**Versión:** 1.0  
**Autor:** Amazon Q Developer  
**Estado:** Listo para implementación
