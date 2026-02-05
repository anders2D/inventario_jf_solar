
import { InventoryItem } from './types';

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', item: 'Taladro Percutor 18V', brand: 'DeWalt', reference: 'DCD776', currentStock: 15, lowStockThreshold: 5 },
  { id: '2', item: 'Juego de Destornilladores', brand: 'Stanley', reference: 'STHT60', currentStock: 50, lowStockThreshold: 15 },
  { id: '3', item: 'Lija de Agua #400', brand: 'Fandeli', reference: 'A-99', currentStock: 200, lowStockThreshold: 50 },
  { id: '4', item: 'Martillo de Uña', brand: 'Truper', reference: '16oz', currentStock: 12, lowStockThreshold: 4 },
  { id: '5', item: 'Casco de Seguridad', brand: '3M', reference: 'H-700', currentStock: 30, lowStockThreshold: 10 },
];
