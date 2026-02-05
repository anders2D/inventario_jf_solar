# 🚀 PHASE 6: Data Migration - LocalStorage to Supabase

## 📋 Descripción General

Migrar todos los datos existentes en LocalStorage a Supabase de forma segura y verificable.

**Tiempo estimado:** 15 minutos  
**Archivos a crear:** 1 (migration.ts)  
**Archivos a modificar:** 1 (App.tsx - agregar botón de migración)

---

## 🎯 Pasos de Migración

### PASO 1: Crear archivo de migración

**Ubicación:** `services/migration.ts`

**Contenido:**
```typescript
import { supabase } from '../lib/supabase';
import { InventoryItem, Transaction, Project } from '../types';

export const migrateLocalStorageToSupabase = async () => {
  console.log('🚀 Iniciando migración de LocalStorage a Supabase...');
  
  try {
    // Leer datos de LocalStorage
    const inventory = JSON.parse(localStorage.getItem('sim_inventory') || '[]') as InventoryItem[];
    const transactions = JSON.parse(localStorage.getItem('sim_transactions') || '[]') as Transaction[];
    const projects = JSON.parse(localStorage.getItem('sim_projects') || '[]') as Project[];
    const categories = JSON.parse(localStorage.getItem('sim_categories') || '[]') as string[];

    console.log(`📦 Datos encontrados:
      - Inventario: ${inventory.length} items
      - Transacciones: ${transactions.length}
      - Proyectos: ${projects.length}
      - Categorías: ${categories.length}`);

    // PASO 1: Migrar categorías
    if (categories.length > 0) {
      console.log(`📦 Migrando ${categories.length} categorías...`);
      for (const cat of categories) {
        try {
          await supabase.from('categories').insert({ name: cat, created_at: new Date().toISOString() });
        } catch (err) {
          console.warn(`⚠️ Categoría "${cat}" ya existe o error:`, err);
        }
      }
      console.log('✅ Categorías migradas');
    }

    // PASO 2: Migrar inventario
    if (inventory.length > 0) {
      console.log(`📦 Migrando ${inventory.length} items...`);
      const itemsToInsert = inventory.map((item: InventoryItem) => ({
        id: item.id,
        item: item.item,
        brand: item.brand,
        reference: item.reference,
        current_stock: item.currentStock,
        category: item.category,
        low_stock_threshold: item.lowStockThreshold,
        image_url: item.imageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      const { error: invError } = await supabase.from('inventory_items').insert(itemsToInsert);
      if (invError) throw new Error(`Error migrando inventario: ${invError.message}`);
      console.log('✅ Inventario migrado');
    }

    // PASO 3: Migrar proyectos
    if (projects.length > 0) {
      console.log(`📦 Migrando ${projects.length} proyectos...`);
      const projectsToInsert = projects.map((p: Project) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        created_at: p.createdAt,
        updated_at: new Date().toISOString()
      }));
      
      const { error: projError } = await supabase.from('projects').insert(projectsToInsert);
      if (projError) throw new Error(`Error migrando proyectos: ${projError.message}`);
      console.log('✅ Proyectos migrados');
    }

    // PASO 4: Migrar transacciones
    if (transactions.length > 0) {
      console.log(`📦 Migrando ${transactions.length} transacciones...`);
      for (const t of transactions) {
        try {
          const { data: transData, error: transError } = await supabase
            .from('transactions')
            .insert({
              id: t.id,
              type: t.type,
              date: t.date,
              item_id: t.itemId,
              item_name: t.itemName,
              quantity: t.quantity,
              detail: t.detail,
              project_id: t.projectId,
              responsible: t.responsible,
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (transError) throw transError;

          // Migrar items de transacción si existen
          if (t.items && t.items.length > 0 && transData) {
            const { error: itemsError } = await supabase.from('transaction_items').insert(
              t.items.map((item: any) => ({
                transaction_id: transData.id,
                item_id: item.itemId,
                item_name: item.itemName,
                brand: item.brand,
                quantity: item.quantity
              }))
            );
            if (itemsError) throw itemsError;
          }
        } catch (err) {
          console.warn(`⚠️ Error migrando transacción ${t.id}:`, err);
        }
      }
      console.log('✅ Transacciones migradas');
    }

    console.log('✅ Migración completada exitosamente!');
    return {
      success: true,
      message: `Migración completada: ${inventory.length} items, ${transactions.length} transacciones, ${projects.length} proyectos, ${categories.length} categorías`
    };
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    return {
      success: false,
      message: `Error: ${(error as Error).message}`
    };
  }
};
```

---

### PASO 2: Agregar botón de migración en App.tsx

**Ubicación:** En el componente App, agregar estado y función

**Agregar estado:**
```typescript
const [isMigrating, setIsMigrating] = useState(false);
```

**Agregar función:**
```typescript
const handleMigration = async () => {
  setIsMigrating(true);
  try {
    const { migrateLocalStorageToSupabase } = await import('./services/migration');
    const result = await migrateLocalStorageToSupabase();
    showSuccessModal(result.message);
    
    if (result.success) {
      // Recargar datos desde Supabase
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
```

**Agregar botón en el header (opcional, para testing):**
```typescript
{/* En el header, después del botón de logout */}
{process.env.NODE_ENV === 'development' && (
  <button 
    onClick={handleMigration} 
    disabled={isMigrating}
    className="p-2.5 text-slate-400 hover:text-green-500 rounded-2xl transition-all"
    title="Migrar datos a Supabase"
  >
    {isMigrating ? '⏳' : '📤'}
  </button>
)}
```

---

### PASO 3: Ejecutar migración manualmente

**Opción A: Desde la consola del navegador**

1. Abrir DevTools (F12)
2. Ir a la pestaña "Console"
3. Ejecutar:
```javascript
// Importar la función de migración
const { migrateLocalStorageToSupabase } = await import('./services/migration.js');

// Ejecutar migración
const result = await migrateLocalStorageToSupabase();

// Ver resultado
console.log(result);
```

**Opción B: Desde el botón en la UI (si agregaste el botón)**

1. Abrir la aplicación
2. Hacer clic en el botón de migración (📤)
3. Esperar a que se complete
4. Ver mensaje de confirmación

**Opción C: Desde un script Node.js**

Crear archivo `scripts/migrate.js`:
```javascript
import { migrateLocalStorageToSupabase } from './services/migration.ts';

(async () => {
  const result = await migrateLocalStorageToSupabase();
  console.log(result);
  process.exit(result.success ? 0 : 1);
})();
```

Ejecutar:
```bash
node scripts/migrate.js
```

---

## ✅ Verificación de Migración

### Paso 1: Verificar en Supabase Dashboard

1. Ir a: https://supabase.com/dashboard/project/joqvtehquymknvizcblu
2. Ir a "Table Editor"
3. Verificar cada tabla:

**categories:**
- [ ] Todas las categorías están presentes
- [ ] Sin duplicados

**inventory_items:**
- [ ] Todos los items están presentes
- [ ] Stock correcto
- [ ] Categorías asignadas correctamente

**projects:**
- [ ] Todos los proyectos están presentes
- [ ] Estados correctos (active/finished)

**transactions:**
- [ ] Todas las transacciones están presentes
- [ ] Fechas correctas
- [ ] Items asociados correctamente

**transaction_items:**
- [ ] Desglose de transacciones múltiples presente
- [ ] Cantidades correctas

### Paso 2: Verificar en la aplicación

1. Recargar la página
2. Verificar que los datos se cargan desde Supabase
3. Probar crear un nuevo item
4. Probar editar un item existente
5. Probar registrar una entrada
6. Probar registrar una salida

### Paso 3: Verificar en la consola

```javascript
// Ver datos en Supabase
const { data: items } = await supabase.from('inventory_items').select('*');
console.log('Items en Supabase:', items);

const { data: trans } = await supabase.from('transactions').select('*');
console.log('Transacciones en Supabase:', trans);

const { data: projs } = await supabase.from('projects').select('*');
console.log('Proyectos en Supabase:', projs);

const { data: cats } = await supabase.from('categories').select('*');
console.log('Categorías en Supabase:', cats);
```

---

## 🔄 Rollback (Si algo sale mal)

### Opción 1: Limpiar Supabase y reintentar

```sql
-- Ejecutar en Supabase SQL Editor
DELETE FROM transaction_items;
DELETE FROM transactions;
DELETE FROM inventory_items;
DELETE FROM projects;
DELETE FROM categories;
```

Luego reintentar la migración.

### Opción 2: Restaurar desde LocalStorage

Si la migración falló, los datos siguen en LocalStorage:

```javascript
// Los datos están seguros en:
localStorage.getItem('sim_inventory')
localStorage.getItem('sim_transactions')
localStorage.getItem('sim_projects')
localStorage.getItem('sim_categories')
```

---

## 📊 Checklist de Migración

- [ ] Crear archivo `services/migration.ts`
- [ ] Agregar función `handleMigration` en App.tsx
- [ ] Agregar estado `isMigrating` en App.tsx
- [ ] Ejecutar migración desde consola o botón
- [ ] Verificar datos en Supabase Dashboard
- [ ] Verificar datos en la aplicación
- [ ] Probar crear/editar/eliminar items
- [ ] Probar registrar entradas y salidas
- [ ] Confirmar que todo funciona correctamente
- [ ] Documentar fecha de migración

---

## ⚠️ Notas Importantes

1. **Backup:** Antes de migrar, exportar datos de LocalStorage:
```javascript
const backup = {
  inventory: localStorage.getItem('sim_inventory'),
  transactions: localStorage.getItem('sim_transactions'),
  projects: localStorage.getItem('sim_projects'),
  categories: localStorage.getItem('sim_categories')
};
console.log(JSON.stringify(backup, null, 2));
// Copiar y guardar en archivo
```

2. **Duplicados:** Si ejecutas la migración dos veces, habrá duplicados. Limpiar Supabase primero.

3. **IDs:** Los IDs se preservan de LocalStorage, asegurando continuidad.

4. **Timestamps:** Se agregan automáticamente `created_at` y `updated_at`.

5. **Errores:** Si una transacción falla, se registra pero continúa con las demás.

---

## 🎯 Después de la Migración

### Opción 1: Mantener LocalStorage como fallback (Recomendado)
- Dejar el código de fallback en App.tsx
- Mantener datos en LocalStorage por 1 semana
- Después de 1 semana, eliminar fallback

### Opción 2: Limpiar LocalStorage inmediatamente
```javascript
localStorage.removeItem('sim_inventory');
localStorage.removeItem('sim_transactions');
localStorage.removeItem('sim_projects');
localStorage.removeItem('sim_categories');
```

### Opción 3: Mantener LocalStorage indefinidamente
- Útil como backup
- No afecta el funcionamiento
- Ocupa ~100KB de espacio

---

## 📝 Resumen

**Archivos creados:**
- `services/migration.ts` - Script de migración

**Archivos modificados:**
- `App.tsx` - Agregar estado, función y botón (opcional)

**Tiempo total:** ~15 minutos

**Riesgo:** Bajo (datos preservados en LocalStorage)

**Reversibilidad:** Alta (fácil rollback)

---

**Documento creado:** Diciembre 2024  
**Versión:** 1.0  
**Autor:** Amazon Q Developer  
**Estado:** Listo para implementación
