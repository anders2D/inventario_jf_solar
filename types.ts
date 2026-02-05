
export interface InventoryItem {
  id: string;
  item: string;
  brand: string;
  reference: string;
  currentStock: number;
  category?: string;
  lowStockThreshold: number; // Umbral personalizado para alertas
  imageUrl?: string; // Nueva propiedad para la imagen del producto
}

export interface TransactionItem {
  itemId: string;
  itemName: string;
  brand: string;
  quantity: number;
}

export interface Transaction {
  id: string;
  type: 'entry' | 'output';
  date: string;
  itemId?: string;
  itemName: string;
  quantity: number;
  items?: TransactionItem[];
  detail: string; // Nombre del proyecto o proveedor
  projectId?: string; // ID vinculado si es una salida
  responsible?: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'active' | 'finished';
  createdAt: string;
}

export type TabView = 'dashboard' | 'inventory' | 'categories' | 'entry' | 'output' | 'history' | 'data' | 'projects' | 'thresholds';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error';
  text: string;
}
