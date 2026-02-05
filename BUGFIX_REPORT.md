# 🐛 Bug Fix Report - UUID Error en Nuevo Item

## Problema Identificado

**Error:** `invalid input syntax for type uuid: "undefined"`

**Ubicación:** Al intentar crear un nuevo item desde "Catálogo de Almacén"

**Causa Raíz:** 
El componente `InventoryView.tsx` estaba inicializando `editingItem` con un objeto vacío `{}` cuando se hacía clic en "Nuevo Item". Esto causaba que el modal intentara actualizar un item con `id: undefined` en lugar de crear uno nuevo.

---

## ✅ Soluciones Implementadas

### 1. **InventoryView.tsx** - Manejo correcto de estados
- Cambió el estado de `editingItem` de `null` a `undefined` para distinguir entre:
  - `undefined` = modal cerrado
  - `null` = crear nuevo item
  - `InventoryItem` = editar item existente
  
- Botón "Nuevo Item" ahora establece `editingItem` a `null` en lugar de `{}`

- Agregada prop `onAddItem` para manejar la creación de items

### 2. **App.tsx** - Nueva función handleAddItem
```typescript
const handleAddItem = async (itemData: Omit<InventoryItem, 'id'>) => {
  try {
    const newItem = await inventoryService.create(itemData);
    setInventory(prev => [...prev, newItem]);
    showSuccessModal(`Producto "${itemData.item}" creado exitosamente.`);
  } catch (error) {
    console.error('Error adding item:', error);
    showSuccessModal(`Error al crear producto: ${(error as Error).message}`);
    throw error;
  }
};
```

### 3. **database.ts** - Validación de UUID
- Agregada validación en `inventoryService.update()` para prevenir actualizaciones con IDs inválidos
- Actualización parcial de campos (solo actualiza los campos proporcionados)

---

## 🔍 Otros Errores Potenciales Similares

### ⚠️ Áreas de Riesgo Identificadas:

#### 1. **TransactionService - IDs de Items**
**Archivo:** `services/database.ts`
**Riesgo:** Las transacciones pueden tener `item_id` como `null` o `undefined`

**Recomendación:**
```typescript
// En transactionService.create()
item_id: transaction.itemId || null, // Asegurar null en lugar de undefined
```

#### 2. **ProjectService - IDs de Proyectos**
**Archivo:** `services/database.ts`
**Riesgo:** Similar al anterior con `project_id`

**Recomendación:**
```typescript
project_id: transaction.projectId || null,
```

#### 3. **EntryForm - Creación de Items**
**Archivo:** `components/EntryForm.tsx`
**Estado:** ✅ Ya maneja correctamente con `onAddNewItem`

#### 4. **OutputForm - Validación de Items**
**Archivo:** `components/OutputForm.tsx`
**Riesgo:** Podría intentar despachar items con IDs inválidos

**Recomendación:** Validar que todos los `itemId` sean UUIDs válidos antes de procesar

---

## 🧪 Pruebas Recomendadas

### Test Case 1: Crear Nuevo Item
1. Ir a "Catálogo de Almacén"
2. Click en "Nuevo Item"
3. Llenar formulario
4. Guardar
5. ✅ Verificar que el item se crea correctamente

### Test Case 2: Editar Item Existente
1. Ir a "Catálogo de Almacén"
2. Click en "Gestionar" en un item
3. Modificar datos
4. Guardar
5. ✅ Verificar que el item se actualiza correctamente

### Test Case 3: Entrada con Nuevo Item
1. Ir a "Entradas"
2. Click en "Nuevo Item"
3. Crear item desde el modal
4. ✅ Verificar que el item se selecciona automáticamente

### Test Case 4: Salida con Items Múltiples
1. Ir a "Salidas"
2. Agregar múltiples items
3. Despachar
4. ✅ Verificar que todos los IDs son válidos

---

## 📋 Checklist de Validación

- [x] InventoryView - Crear nuevo item
- [x] InventoryView - Editar item existente
- [x] Database service - Validación de UUID en update
- [ ] TransactionService - Validar item_id null vs undefined
- [ ] ProjectService - Validar project_id null vs undefined
- [ ] OutputForm - Validar itemIds antes de despacho
- [ ] Agregar validación UUID en validators.ts (ya existe)

---

## 🛡️ Prevención Futura

### Usar el Validador Centralizado
El archivo `utils/validators.ts` ya tiene un validador UUID:

```typescript
import { validators } from './utils/validators';

// Validar UUID antes de operaciones
const validId = validators.uuid(itemId, 'Item ID');
if (!validId) {
  throw new Error('ID inválido');
}
```

### Patrón Recomendado para Modales de Creación/Edición
```typescript
// Estado
const [editingItem, setEditingItem] = useState<Item | null | undefined>(undefined);

// Abrir para crear
setEditingItem(null);

// Abrir para editar
setEditingItem(existingItem);

// Cerrar
setEditingItem(undefined);

// En el modal
<Modal 
  isOpen={editingItem !== undefined}
  initialData={editingItem || undefined}
/>
```

---

## 📝 Notas Adicionales

- El error ocurría porque Supabase espera UUIDs válidos o `null`, no strings "undefined"
- PostgreSQL es estricto con los tipos de datos UUID
- Siempre usar `null` en lugar de `undefined` para campos opcionales en la base de datos

---

**Fecha:** 2026-02-05  
**Autor:** Amazon Q Developer  
**Estado:** ✅ Resuelto
