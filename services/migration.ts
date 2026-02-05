import { supabase } from '../lib/supabase';
import { InventoryItem, Transaction, Project } from '../types';

export const migrateLocalStorageToSupabase = async () => {
  console.log('🚀 Iniciando migración de LocalStorage a Supabase...');
  
  try {
    const inventory = JSON.parse(localStorage.getItem('sim_inventory') || '[]') as InventoryItem[];
    const transactions = JSON.parse(localStorage.getItem('sim_transactions') || '[]') as Transaction[];
    const projects = JSON.parse(localStorage.getItem('sim_projects') || '[]') as Project[];
    const categories = JSON.parse(localStorage.getItem('sim_categories') || '[]') as string[];

    console.log(`📦 Datos encontrados: ${inventory.length} items, ${transactions.length} transacciones, ${projects.length} proyectos, ${categories.length} categorías`);

    if (categories.length > 0) {
      console.log(`📦 Migrando ${categories.length} categorías...`);
      for (const cat of categories) {
        try {
          await supabase.from('categories').insert({ name: cat, created_at: new Date().toISOString() });
        } catch (err) {
          console.warn(`⚠️ Categoría "${cat}" ya existe`);
        }
      }
      console.log('✅ Categorías migradas');
    }

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
          console.warn(`⚠️ Error migrando transacción ${t.id}`);
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
