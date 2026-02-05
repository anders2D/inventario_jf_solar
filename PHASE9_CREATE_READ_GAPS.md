# 📋 PHASE 9 - Análisis de Gaps en CREATE y READ

## 🎯 Resumen Ejecutivo

Análisis enfocado **SOLO** en operaciones CREATE y READ que faltan en el sistema.

---

## 📊 Matriz de Cobertura CREATE/READ por Vista

| Vista | CREATE | READ | Gaps |
|-------|--------|------|------|
| **InventoryView** | ✅ (Modal) | ✅ (Grid/List) | ❌ Ver detalles completos del producto |
| **EntryForm** | ✅ (Item + Entry) | ✅ (Dropdown) | ❌ Historial de entradas por item |
| **OutputForm** | ✅ (Output) | ✅ (Dropdown) | ❌ Validación visual de stock antes de despacho |
| **ProjectsView** | ✅ (Proyecto) | ✅ (Cards) | ❌ Detalle de proyecto sin hacer clic |
| **CategoryManagement** | ✅ (Categoría) | ✅ (Tabla) | ❌ Editar categoría existente |
| **ThresholdView** | ❌ | ✅ (Lista) | ❌ Crear alertas personalizadas |
| **HistoryView** | ❌ | ✅ (Tabla) | ❌ Filtros avanzados de búsqueda |
| **Dashboard** | ❌ | ✅ (Stats) | ❌ Gráficos de tendencias |
| **DataManagement** | ✅ (Import) | ✅ (Export) | ❌ Vista previa antes de importar |

---

## 🔴 GAPS CRÍTICOS - CREATE

### 1. **ThresholdView - Crear Alertas Personalizadas**
**Ubicación**: `components/ThresholdView.tsx`  
**Problema**: Solo permite EDITAR umbrales existentes, no CREAR nuevos  
**Impacto**: No se pueden agregar alertas para nuevos productos  
**Solución**: Agregar botón "Nueva Alerta" con formulario

```typescript
// FALTA: Botón para crear alerta
// FALTA: Modal para seleccionar item + umbral
// FALTA: Validación de umbral duplicado
```

### 2. **HistoryView - Crear Filtros Guardados**
**Ubicación**: `components/HistoryView.tsx`  
**Problema**: No hay forma de guardar búsquedas/filtros frecuentes  
**Impacto**: Usuarios repiten filtros manualmente  
**Solución**: Agregar botón "Guardar Filtro" con nombre

```typescript
// FALTA: Botón "Guardar Filtro"
// FALTA: LocalStorage para filtros guardados
// FALTA: Dropdown para cargar filtros
```

### 3. **Dashboard - Crear Widgets Personalizados**
**Ubicación**: `components/Dashboard.tsx`  
**Problema**: Dashboard es estático, no se puede personalizar  
**Impacto**: Usuarios ven datos que no les interesan  
**Solución**: Agregar botón "Personalizar Dashboard"

```typescript
// FALTA: Modal para seleccionar widgets
// FALTA: Guardar preferencias en LocalStorage
// FALTA: Reordenar widgets
```

---

## 🟡 GAPS IMPORTANTES - READ

### 1. **InventoryView - Modal de Detalles Completos**
**Ubicación**: `components/InventoryView.tsx`  
**Problema**: No hay vista detallada del producto (solo edición)  
**Impacto**: No se ve historial de movimientos del item  
**Solución**: Agregar botón "Ver Detalles" que muestre:
- Historial de entradas/salidas
- Últimas transacciones
- Tendencia de stock

```typescript
// FALTA: Botón "Ver Detalles" en grid/list
// FALTA: Modal con historial del producto
// FALTA: Gráfico de movimientos
```

### 2. **EntryForm - Historial de Entradas por Item**
**Ubicación**: `components/EntryForm.tsx`  
**Problema**: No se ve el historial de entradas del item seleccionado  
**Impacto**: No se sabe cuándo fue la última entrada  
**Solución**: Mostrar últimas 5 entradas del item

```typescript
// FALTA: Tabla con últimas entradas
// FALTA: Fecha y cantidad de cada entrada
// FALTA: Proveedor de cada entrada
```

### 3. **OutputForm - Validación Visual de Stock**
**Ubicación**: `components/OutputForm.tsx`  
**Problema**: No hay preview visual del stock después del despacho  
**Impacto**: Usuario no ve impacto antes de confirmar  
**Solución**: Mostrar stock actual vs stock después

```typescript
// FALTA: Tabla con preview de stock
// FALTA: Indicador visual de stock bajo
// FALTA: Advertencia si queda bajo umbral
```

### 4. **ProjectsView - Detalle sin Hacer Clic**
**Ubicación**: `components/ProjectsView.tsx`  
**Problema**: Debe hacer clic para ver detalles del proyecto  
**Impacto**: Experiencia lenta, muchos clics  
**Solución**: Agregar panel expandible en card

```typescript
// FALTA: Botón "Expandir" en card
// FALTA: Mostrar últimas transacciones en card
// FALTA: Mostrar total de unidades en card
```

### 5. **CategoryManagement - Editar Categoría**
**Ubicación**: `components/CategoryManagement.tsx`  
**Problema**: No se puede editar nombre de categoría existente  
**Impacto**: Si hay error, hay que eliminar y recrear  
**Solución**: Agregar botón "Editar" en lista de categorías

```typescript
// FALTA: Botón "Editar" en cada categoría
// FALTA: Modal para cambiar nombre
// FALTA: Validación de duplicados
```

### 6. **HistoryView - Filtros Avanzados**
**Ubicación**: `components/HistoryView.tsx`  
**Problema**: Solo filtro por fecha y búsqueda básica  
**Impacto**: Difícil encontrar transacciones específicas  
**Solución**: Agregar filtros por tipo, proyecto, responsable

```typescript
// FALTA: Filtro por tipo (entry/output)
// FALTA: Filtro por proyecto
// FALTA: Filtro por responsable
// FALTA: Filtro por rango de cantidad
```

### 7. **DataManagement - Vista Previa de Importación**
**Ubicación**: `components/DataManagement.tsx`  
**Problema**: No hay preview antes de importar  
**Impacto**: Riesgo de importar datos incorrectos  
**Solución**: Mostrar tabla con datos a importar

```typescript
// FALTA: Modal con preview de datos
// FALTA: Mostrar primeras 10 filas
// FALTA: Validación visual de campos
```

---

## 📋 Tabla de Prioridades

| Gap | Tipo | Prioridad | Complejidad | Impacto |
|-----|------|-----------|-------------|---------|
| Detalles de Producto | READ | 🔴 Alta | Baja | Alto |
| Historial de Entradas | READ | 🔴 Alta | Baja | Alto |
| Validación Visual Stock | READ | 🔴 Alta | Media | Alto |
| Crear Alertas | CREATE | 🟡 Media | Baja | Medio |
| Editar Categoría | READ | 🟡 Media | Baja | Medio |
| Filtros Avanzados | READ | 🟡 Media | Media | Medio |
| Vista Previa Import | READ | 🟡 Media | Media | Medio |
| Personalizar Dashboard | CREATE | 🟠 Baja | Alta | Bajo |
| Guardar Filtros | CREATE | 🟠 Baja | Media | Bajo |

---

## 🚀 Plan de Implementación Recomendado

### Fase 1 (Crítica - Esta semana)
1. ✅ Detalles de Producto (InventoryView)
2. ✅ Historial de Entradas (EntryForm)
3. ✅ Validación Visual Stock (OutputForm)

### Fase 2 (Importante - Próxima semana)
4. Crear Alertas (ThresholdView)
5. Editar Categoría (CategoryManagement)
6. Filtros Avanzados (HistoryView)

### Fase 3 (Mejora - Después)
7. Vista Previa Import (DataManagement)
8. Personalizar Dashboard (Dashboard)
9. Guardar Filtros (HistoryView)

---

## 📝 Notas Técnicas

- **LocalStorage**: Usar para guardar preferencias de usuario
- **Supabase**: Usar para datos persistentes
- **Componentes**: Reutilizar modales existentes
- **Validación**: Aplicar en todos los CREATE
- **UX**: Agregar confirmaciones antes de acciones destructivas

