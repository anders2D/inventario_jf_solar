# 📦 Sistema de Inventario JF Solar

## 🌟 Descripción del Proyecto

Sistema de gestión de inventario moderno y completo desarrollado para **JF Solar**, diseñado para controlar el stock de materiales, registrar entradas y salidas, gestionar proyectos y generar reportes. Construido con **React 19**, **TypeScript** y **TailwindCSS** con soporte para modo oscuro.

---

## 🎯 Características Principales

### ✅ Funcionalidades Implementadas

1. **🔐 Sistema de Autenticación**
   - Login seguro con credenciales
   - Detección de Bloq Mayús
   - Modo oscuro/claro desde el login

2. **📊 Dashboard Interactivo**
   - Estadísticas en tiempo real
   - Alertas de stock bajo personalizadas
   - Actividad reciente del almacén
   - Navegación rápida a secciones

3. **📦 Gestión de Inventario**
   - Vista de cuadrícula y lista
   - Búsqueda y filtrado por categorías
   - Edición de productos con imágenes
   - Indicadores de estado de stock
   - Zoom de imágenes de productos

4. **📥 Registro de Entradas**
   - Formulario de ingreso de mercancía
   - Creación rápida de nuevos items
   - Registro de proveedores
   - Actualización automática de stock

5. **📤 Despacho de Salidas**
   - Despacho múltiple de productos
   - Asignación a proyectos activos
   - Validación de stock disponible
   - Registro de responsables

6. **🏗️ Gestión de Proyectos**
   - Creación y seguimiento de proyectos
   - Estados: Activo / Finalizado
   - Detalle de materiales por proyecto
   - Exportación de reportes por proyecto
   - Historial completo de despachos

7. **🏷️ Categorización**
   - Creación de categorías personalizadas
   - Asignación masiva de productos
   - Filtrado por categorías

8. **🔔 Alertas Personalizadas**
   - Configuración de umbrales por producto
   - Alertas visuales en dashboard
   - Actualización individual de límites

9. **📜 Historial de Movimientos**
   - Registro completo de transacciones
   - Filtrado por fechas y búsqueda
   - Desglose de despachos múltiples
   - Vista expandible de detalles

10. **💾 Gestión de Datos**
    - Exportación a Excel (inventario y historial)
    - Importación desde Excel
    - Respaldo y restauración de datos
    - Fusión de historiales

11. **🎨 Interfaz Moderna**
    - Diseño responsive (móvil, tablet, desktop)
    - Modo oscuro completo
    - Animaciones fluidas
    - Iconos de Lucide React

---

## 🏗️ Arquitectura del Proyecto

```
Inventario JF Solar/
│
├── 📄 index.html              # Punto de entrada HTML
├── 📄 index.tsx               # Punto de entrada React
├── 📄 App.tsx                 # Componente principal con lógica de estado
├── 📄 types.ts                # Definiciones TypeScript
├── 📄 constants.ts            # Datos iniciales del inventario
├── 📄 README.md               # Este archivo
│
└── 📁 components/             # Componentes React
    ├── Dashboard.tsx          # Panel principal con estadísticas
    ├── InventoryView.tsx      # Vista del catálogo de productos
    ├── EntryForm.tsx          # Formulario de entradas
    ├── OutputForm.tsx         # Formulario de salidas múltiples
    ├── HistoryView.tsx        # Historial de movimientos
    ├── ProjectsView.tsx       # Gestión de proyectos
    ├── CategoryManagement.tsx # Gestión de categorías
    ├── ThresholdView.tsx      # Configuración de alertas
    ├── DataManagement.tsx     # Importar/Exportar datos
    ├── Login.tsx              # Pantalla de autenticación
    ├── NewItemModal.tsx       # Modal para crear/editar productos
    ├── SuccessModal.tsx       # Modal de confirmación
    └── Toast.tsx              # Notificaciones toast
```

---

## 🔧 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.0.0 | Framework UI |
| **TypeScript** | Latest | Tipado estático |
| **TailwindCSS** | 3.x (CDN) | Estilos y diseño |
| **Lucide React** | 0.463.0 | Iconografía |
| **XLSX** | 0.18.5 | Exportación/Importación Excel |
| **ESM.sh** | - | Módulos ES desde CDN |

---

## 📋 Tipos de Datos (TypeScript)

### `InventoryItem`
```typescript
interface InventoryItem {
  id: string;                    // ID único del producto
  item: string;                  // Nombre del producto
  brand: string;                 // Marca
  reference: string;             // Referencia/Modelo
  currentStock: number;          // Stock actual
  category?: string;             // Categoría (opcional)
  lowStockThreshold: number;     // Umbral de alerta personalizado
  imageUrl?: string;             // URL de imagen (Base64 o URL)
}
```

### `Transaction`
```typescript
interface Transaction {
  id: string;                    // ID único de la transacción
  type: 'entry' | 'output';      // Tipo de movimiento
  date: string;                  // Fecha (YYYY-MM-DD)
  itemId?: string;               // ID del item (para transacciones simples)
  itemName: string;              // Nombre del producto
  quantity: number;              // Cantidad total
  items?: TransactionItem[];     // Desglose (para despachos múltiples)
  detail: string;                // Proveedor o Proyecto
  projectId?: string;            // ID del proyecto (para salidas)
  responsible?: string;          // Persona responsable
}
```

### `Project`
```typescript
interface Project {
  id: string;                    // ID único del proyecto
  name: string;                  // Nombre del proyecto
  status: 'active' | 'finished'; // Estado del proyecto
  createdAt: string;             // Fecha de creación
}
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Opción 1: Servidor Local Simple

```bash
# Navegar a la carpeta del proyecto
cd "Inventario JF Solar"

# Iniciar servidor HTTP simple (Python 3)
python -m http.server 8000

# O con Node.js (si tienes npx)
npx serve .
```

Luego abrir: `http://localhost:8000`

### Opción 2: Live Server (VS Code)

1. Instalar extensión **Live Server** en VS Code
2. Click derecho en `index.html`
3. Seleccionar "Open with Live Server"

### Credenciales de Acceso

```
Usuario: Santiagoavila
Contraseña: Pasantia2026
```

---

## 📚 Guía para Desarrolladores Junior

### 🎓 Cómo Agregar una Nueva Funcionalidad

#### **Ejemplo: Agregar un campo "Ubicación" a los productos**

**Paso 1: Actualizar el tipo en `types.ts`**

```typescript
export interface InventoryItem {
  id: string;
  item: string;
  brand: string;
  reference: string;
  currentStock: number;
  category?: string;
  lowStockThreshold: number;
  imageUrl?: string;
  location?: string;  // ✅ NUEVO CAMPO
}
```

**Paso 2: Actualizar el estado inicial en `constants.ts`**

```typescript
export const INITIAL_INVENTORY: InventoryItem[] = [
  { 
    id: '1', 
    item: 'Taladro Percutor 18V', 
    brand: 'DeWalt', 
    reference: 'DCD776', 
    currentStock: 15, 
    lowStockThreshold: 5,
    location: 'Estante A-1'  // ✅ NUEVO CAMPO
  },
  // ... más items
];
```

**Paso 3: Actualizar el formulario en `NewItemModal.tsx`**

```typescript
// Agregar al estado del formulario
const [formData, setFormData] = useState({
  item: '',
  brand: '',
  reference: '',
  currentStock: 0,
  category: '',
  lowStockThreshold: 10,
  imageUrl: '',
  location: ''  // ✅ NUEVO CAMPO
});

// Agregar input en el JSX
<div>
  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2">
    Ubicación en Almacén
  </label>
  <input
    type="text"
    value={formData.location}
    onChange={(e) => setFormData({...formData, location: e.target.value})}
    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
    placeholder="Ej: Estante A-1"
  />
</div>
```

**Paso 4: Mostrar en la vista de inventario `InventoryView.tsx`**

```typescript
// En la vista de cuadrícula
<p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-6">
  {item.brand} • Ref: {item.reference}
  {item.location && ` • ${item.location}`}  {/* ✅ MOSTRAR UBICACIÓN */}
</p>

// En la vista de lista (tabla)
<td className="px-8 py-6">
  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
    {item.location || 'Sin ubicación'}
  </span>
</td>
```

---

### 🎨 Cómo Personalizar Estilos

#### **Cambiar el color principal del sistema**

Buscar y reemplazar en todos los archivos:

```typescript
// De azul a verde
'bg-blue-600' → 'bg-green-600'
'text-blue-600' → 'text-green-600'
'border-blue-500' → 'border-green-500'
'ring-blue-500' → 'ring-green-500'
```

#### **Agregar una nueva animación**

```typescript
// En cualquier componente
<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
  {/* Tu contenido */}
</div>
```

Animaciones disponibles en Tailwind:
- `fade-in` / `fade-out`
- `slide-in-from-top-4` / `slide-in-from-bottom-4`
- `zoom-in-95` / `zoom-out-95`
- `spin` / `pulse` / `bounce`

---

### 🔄 Cómo Agregar un Nuevo Componente

**Ejemplo: Crear un componente de "Proveedores"**

**Paso 1: Crear el archivo `components/SuppliersView.tsx`**

```typescript
import React, { useState } from 'react';
import { Truck, Plus, Search } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
}

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({ 
  suppliers, 
  onAddSupplier 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Truck className="text-blue-600" size={32} />
          Gestión de Proveedores
        </h2>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold">
          <Plus size={20} />
          Nuevo Proveedor
        </button>
      </div>

      {/* Resto del componente */}
    </div>
  );
};
```

**Paso 2: Agregar el tipo en `types.ts`**

```typescript
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
}

export type TabView = 'dashboard' | 'inventory' | 'categories' | 'entry' | 
                      'output' | 'history' | 'data' | 'projects' | 
                      'thresholds' | 'suppliers';  // ✅ AGREGAR AQUÍ
```

**Paso 3: Importar y usar en `App.tsx`**

```typescript
import { SuppliersView } from './components/SuppliersView';

// En el estado
const [suppliers, setSuppliers] = useState<Supplier[]>([]);

// En la navegación
const navigation = [
  // ... otros tabs
  { id: 'suppliers', label: 'Proveedores', icon: Truck, color: 'blue' },
];

// En el renderizado
{currentTab === 'suppliers' && (
  <SuppliersView 
    suppliers={suppliers} 
    onAddSupplier={handleAddSupplier} 
  />
)}
```

---

### 💾 Cómo Funciona el LocalStorage

El sistema guarda automáticamente los datos en el navegador:

```typescript
// Guardar datos
localStorage.setItem('sim_inventory', JSON.stringify(inventory));
localStorage.setItem('sim_transactions', JSON.stringify(transactions));
localStorage.setItem('sim_projects', JSON.stringify(projects));
localStorage.setItem('sim_categories', JSON.stringify(categories));
localStorage.setItem('sim_theme', darkMode ? 'dark' : 'light');
localStorage.setItem('sim_auth', 'true');

// Cargar datos
const savedInventory = localStorage.getItem('sim_inventory');
if (savedInventory) {
  setInventory(JSON.parse(savedInventory));
}

// Limpiar datos (útil para desarrollo)
localStorage.clear();
```

---

## 🐛 Solución de Problemas Comunes

### Problema: Los datos no se guardan

**Solución:** Verificar que el navegador permita LocalStorage

```typescript
// Agregar validación
if (typeof(Storage) !== "undefined") {
  localStorage.setItem('test', 'data');
} else {
  console.error("LocalStorage no disponible");
}
```

### Problema: Las imágenes no se muestran

**Solución:** Verificar que las imágenes sean Base64 o URLs válidas

```typescript
// Validar URL de imagen
const isValidImageUrl = (url: string) => {
  return url.startsWith('data:image') || url.startsWith('http');
};
```

### Problema: El modo oscuro no funciona

**Solución:** Verificar que la clase 'dark' esté en el HTML

```typescript
// En App.tsx
useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

---

## 📊 Flujo de Datos del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│  (Estado Global: inventory, transactions, projects, etc.)    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────────────────────────┐
                              │                                 │
                    ┌─────────▼─────────┐          ┌───────────▼──────────┐
                    │   Dashboard       │          │   InventoryView      │
                    │   (Solo lectura)  │          │   (Edición)          │
                    └───────────────────┘          └──────────────────────┘
                              │                                 │
                    ┌─────────▼─────────┐          ┌───────────▼──────────┐
                    │   EntryForm       │          │   OutputForm         │
                    │   (Actualiza      │          │   (Actualiza         │
                    │    inventory)     │          │    inventory +       │
                    └───────────────────┘          │    transactions)     │
                              │                    └──────────────────────┘
                    ┌─────────▼─────────┐
                    │   HistoryView     │
                    │   (Solo lectura)  │
                    └───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   LocalStorage    │
                    │   (Persistencia)  │
                    └───────────────────┘
```

---

## 🎯 Plantillas de Código Útiles

### Plantilla: Crear un nuevo formulario

```typescript
import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface MyFormProps {
  onSubmit: (data: any) => void;
}

export const MyForm: React.FC<MyFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Resetear formulario
    setFormData({ field1: '', field2: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Campo 1</label>
        <input
          type="text"
          required
          value={formData.field1}
          onChange={(e) => setFormData({...formData, field1: e.target.value})}
          className="w-full px-4 py-2 rounded-lg border"
        />
      </div>
      
      <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
        <Save size={20} />
        Guardar
      </button>
    </form>
  );
};
```

### Plantilla: Crear una tabla con datos

```typescript
import React from 'react';

interface DataTableProps {
  data: any[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800">
            <th className="px-6 py-4">Columna 1</th>
            <th className="px-6 py-4">Columna 2</th>
            <th className="px-6 py-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b hover:bg-slate-50">
              <td className="px-6 py-4">{item.field1}</td>
              <td className="px-6 py-4">{item.field2}</td>
              <td className="px-6 py-4">
                <button className="text-blue-600">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### Plantilla: Modal reutilizable

```typescript
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
```

---

## 📝 Convenciones de Código

### Nombres de Variables

```typescript
// ✅ CORRECTO
const [inventory, setInventory] = useState<InventoryItem[]>([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const handleSubmit = () => {};

// ❌ INCORRECTO
const [inv, setInv] = useState([]);
const [open, setOpen] = useState(false);
const submit = () => {};
```

### Nombres de Componentes

```typescript
// ✅ CORRECTO - PascalCase
export const InventoryView: React.FC = () => {};
export const NewItemModal: React.FC = () => {};

// ❌ INCORRECTO
export const inventoryView = () => {};
export const new_item_modal = () => {};
```

### Clases de Tailwind

```typescript
// ✅ CORRECTO - Orden lógico
className="flex items-center gap-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"

// ❌ INCORRECTO - Desordenado
className="text-white bg-blue-600 flex rounded-lg px-6 items-center hover:bg-blue-700 gap-4 py-3"
```

---

## 🔒 Seguridad

### Credenciales

```typescript
// ⚠️ IMPORTANTE: En producción, usar autenticación real
// Este es solo un ejemplo educativo

// Cambiar credenciales en Login.tsx
if (username === 'TU_USUARIO' && password === 'TU_CONTRASEÑA') {
  onLogin();
}
```

### Validación de Datos

```typescript
// Siempre validar antes de guardar
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validaciones
  if (!itemId || !quantity || quantity <= 0) {
    alert('Datos inválidos');
    return;
  }
  
  // Procesar...
};
```

---

## 📈 Mejoras Futuras Sugeridas

1. **Backend Real**
   - Conectar a una API REST
   - Base de datos PostgreSQL/MySQL
   - Autenticación JWT

2. **Reportes Avanzados**
   - Gráficos con Chart.js
   - Reportes PDF
   - Análisis de tendencias

3. **Notificaciones**
   - Emails automáticos de alertas
   - Notificaciones push
   - Recordatorios de reorden

4. **Códigos de Barras**
   - Escaneo de productos
   - Generación de códigos QR
   - Impresión de etiquetas

5. **Multi-usuario**
   - Roles y permisos
   - Auditoría de cambios
   - Historial de usuarios

6. **Integración con Proveedores**
   - Pedidos automáticos
   - Tracking de envíos
   - Catálogos sincronizados

---

## 🤝 Contribuir al Proyecto

### Pasos para contribuir:

1. **Fork** el repositorio
2. Crear una **rama** para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. Abrir un **Pull Request**

### Estándares de código:

- Usar TypeScript para todo el código
- Seguir las convenciones de nombres
- Comentar código complejo
- Probar antes de hacer commit

---

## 📞 Soporte y Contacto

Para preguntas o soporte técnico:

- **Desarrollador:** JF Solar Development Team
- **Email:** soporte@jfsolar.com (ejemplo)
- **Documentación:** Este README.md

---

## 📄 Licencia

Este proyecto es propiedad de **JF Solar** y está destinado para uso interno de la empresa.

---

## 🎓 Recursos de Aprendizaje

### Para aprender más sobre las tecnologías usadas:

- **React:** https://react.dev/learn
- **TypeScript:** https://www.typescriptlang.org/docs/
- **TailwindCSS:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev/icons/

### Tutoriales recomendados:

1. React Hooks: https://react.dev/reference/react
2. TypeScript para React: https://react-typescript-cheatsheet.netlify.app/
3. Tailwind UI Patterns: https://tailwindui.com/components

---

## 🎉 Agradecimientos

Gracias por usar el Sistema de Inventario JF Solar. Este README fue diseñado para ayudar a desarrolladores junior a entender, mantener y extender el sistema de manera efectiva.

**¡Feliz codificación! 🚀**

---

**Última actualización:** Diciembre 2024  
**Versión del Sistema:** 2.5  
**Autor del README:** Amazon Q Developer
# inventario_jf_solar
