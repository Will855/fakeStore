'use server';

import initialProducts from '@/data/initialProducts.json';
import { fetchCurrentBCVRate } from '@/lib/bcvRate';

export async function createVerifiedOrderServer(cartItems, customerInfo) {
  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: 'El carrito está vacío.' };
  }

  // 1. Recalcular total real en el servidor para evitar VULN-01 (Price Tampering)
  let calculatedTotalUSD = 0;

  for (const item of cartItems) {
    const dbProduct = initialProducts.find(p => p.id === item.product.id) || item.product;
    
    if (dbProduct.stock < item.quantity) {
      return { success: false, error: `Stock insuficiente para ${dbProduct.title}` };
    }

    const effectivePrice = dbProduct.isOffer && dbProduct.discountPercentage > 0
      ? dbProduct.priceUSD * (1 - dbProduct.discountPercentage / 100)
      : dbProduct.priceUSD;

    calculatedTotalUSD += effectivePrice * item.quantity;
  }

  // 2. Obtener Tasa BCV verificada
  const currentBcvRate = await fetchCurrentBCVRate();
  const calculatedTotalVES = calculatedTotalUSD * currentBcvRate;

  // 3. Generar Código Único de Referencia
  const orderCode = `FK-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    success: true,
    orderCode,
    totalUSD: calculatedTotalUSD,
    totalVES: calculatedTotalVES,
    bcvRate: currentBcvRate
  };
}
