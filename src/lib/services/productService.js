import initialProductsData from '@/data/initialProducts.json';
import { productSchema } from '@/lib/schemas';
import { getProductsFromSupabase } from '@/lib/supabaseClient';

/**
 * Servicio de Productos con Conexión Supabase + Fallback Local
 */

export async function fetchProductsFromDB() {
  try {
    // Intentar consultar Supabase si están configuradas las variables de entorno
    const supabaseData = await getProductsFromSupabase();
    if (supabaseData && supabaseData.length > 0) {
      return supabaseData;
    }
  } catch (error) {
    console.warn('DB Supabase no disponible. Utilizando fallback local/JSON:', error.message);
  }

  // Fallback a productos locales
  return initialProductsData;
}

export async function saveProductToDB(productData) {
  const validation = productSchema.safeParse(productData);
  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message || 'Datos de producto inválidos');
  }

  const validProduct = validation.data;

  return {
    ...validProduct,
    id: `prod-${Date.now()}`,
    stock: Object.values(validProduct.sizeStock || {}).reduce((a, b) => a + b, 0),
  };
}
