import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Inicializar cliente Supabase si existen las credenciales en .env.local
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper de consulta a Supabase con fallback local si aún no se han configurado credenciales
 */
export async function getProductsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Error al consultar Supabase (Verifica la tabla "products"):', err.message);
    return null;
  }
}

export async function insertOrderToSupabase(orderData) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('orders').insert([orderData]).select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Error al guardar orden en Supabase:', err.message);
    return null;
  }
}
