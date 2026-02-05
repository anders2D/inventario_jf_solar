import { supabase } from '../lib/supabase';
import { InventoryItem, Transaction, Project } from '../types';

// ============================================
// INVENTORY ITEMS
// ============================================

export const inventoryService = {
  async getAll(): Promise<InventoryItem[]> {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('item', { ascending: true });
    
    if (error) throw error;
    return data.map(item => ({
      id: item.id,
      item: item.item,
      brand: item.brand,
      reference: item.reference,
      currentStock: item.current_stock,
      category: item.category,
      lowStockThreshold: item.low_stock_threshold,
      imageUrl: item.image_url
    }));
  },

  async create(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        item: item.item,
        brand: item.brand,
        reference: item.reference,
        current_stock: item.currentStock,
        category: item.category,
        low_stock_threshold: item.lowStockThreshold,
        image_url: item.imageUrl,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      item: data.item,
      brand: data.brand,
      reference: data.reference,
      currentStock: data.current_stock,
      category: data.category,
      lowStockThreshold: data.low_stock_threshold,
      imageUrl: data.image_url
    };
  },

  async update(id: string, item: Partial<InventoryItem>): Promise<void> {
    const { error } = await supabase
      .from('inventory_items')
      .update({
        item: item.item,
        brand: item.brand,
        reference: item.reference,
        current_stock: item.currentStock,
        category: item.category,
        low_stock_threshold: item.lowStockThreshold,
        image_url: item.imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateStock(id: string, newStock: number): Promise<void> {
    const { error } = await supabase
      .from('inventory_items')
      .update({ 
        current_stock: newStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ============================================
// TRANSACTIONS
// ============================================

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        transaction_items (
          id,
          item_id,
          item_name,
          brand,
          quantity
        )
      `)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data.map(t => ({
      id: t.id,
      type: t.type,
      date: t.date,
      itemId: t.item_id,
      itemName: t.item_name,
      quantity: t.quantity,
      items: t.transaction_items?.map((ti: any) => ({
        itemId: ti.item_id,
        itemName: ti.item_name,
        brand: ti.brand,
        quantity: ti.quantity
      })),
      detail: t.detail,
      projectId: t.project_id,
      responsible: t.responsible
    }));
  },

  async create(transaction: Omit<Transaction, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .insert({
        type: transaction.type,
        date: transaction.date,
        item_id: transaction.itemId,
        item_name: transaction.itemName,
        quantity: transaction.quantity,
        detail: transaction.detail,
        project_id: transaction.projectId,
        responsible: transaction.responsible,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
  },

  async createWithItems(transaction: Omit<Transaction, 'id'>, items: any[]): Promise<void> {
    const { data: transData, error: transError } = await supabase
      .from('transactions')
      .insert({
        type: transaction.type,
        date: transaction.date,
        item_name: transaction.itemName,
        quantity: transaction.quantity,
        detail: transaction.detail,
        project_id: transaction.projectId,
        responsible: transaction.responsible,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (transError) throw transError;

    if (items && items.length > 0) {
      const { error: itemsError } = await supabase
        .from('transaction_items')
        .insert(
          items.map(item => ({
            transaction_id: transData.id,
            item_id: item.itemId,
            item_name: item.itemName,
            brand: item.brand,
            quantity: item.quantity
          }))
        );
      
      if (itemsError) throw itemsError;
    }
  }
};

// ============================================
// PROJECTS
// ============================================

export const projectService = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      createdAt: p.created_at
    }));
  },

  async create(name: string): Promise<Project> {
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        status: 'active',
        created_at: today,
        updated_at: now
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      status: data.status,
      createdAt: data.created_at
    };
  },

  async updateStatus(id: string, status: 'active' | 'finished'): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .update({ 
        status,
        finished_at: status === 'finished' ? new Date().toISOString().split('T')[0] : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ============================================
// CATEGORIES
// ============================================

export const categoryService = {
  async getAll(): Promise<string[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data.map(c => c.name);
  },

  async create(name: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .insert({ 
        name,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
  }
};
