import { checkoutSchema } from '@/lib/schemas';
import { insertOrderToSupabase } from '@/lib/supabaseClient';

/**
 * Servicio de Pedidos con Persistencia en Supabase
 */

export async function createOrderInDB(orderPayload) {
  const validation = checkoutSchema.safeParse({
    name: orderPayload.customerName,
    phone: orderPayload.customerPhone,
    deliveryMethod: orderPayload.deliveryMethod || 'MRW / Tealca (Envío Nacional)',
    address: orderPayload.address || 'Pickup / Tienda',
    paymentMethod: orderPayload.paymentMethod || 'Pago Móvil (Bs.)',
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message || 'Datos de comprador inválidos');
  }

  const newOrder = {
    order_code: orderPayload.orderCode || `FK-${Math.floor(1000 + Math.random() * 9000)}`,
    customer_name: orderPayload.customerName,
    customer_phone: orderPayload.customerPhone,
    items: orderPayload.items || [],
    total_usd: orderPayload.totalUSD || 0,
    total_ves: orderPayload.totalVES || 0,
    status: 'pending_confirmation',
  };

  // Guardar en Supabase si el cliente está configurado
  await insertOrderToSupabase(newOrder);

  return newOrder;
}
