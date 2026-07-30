export function formatUSD(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatVES(amount) {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
  }).format(amount).replace('VES', 'Bs.');
}

export function generateWhatsAppLink(ownerPhone, orderCode, customerInfo, cartItems, totalUSD, totalVES, bcvRate) {
  const cleanPhone = ownerPhone.replace(/[^0-9]/g, '');
  const safeName = customerInfo.name.trim();
  const safeCode = orderCode;
  const safePhone = customerInfo.phone.trim();
  const safeAddress = customerInfo.address ? customerInfo.address.trim() : 'No especificada';

  let itemsList = cartItems
    .map(item => `▪️ *${item.quantity}x* ${item.product.title} ($${(item.product.priceUSD * (1 - (item.product.discountPercentage || 0)/100)).toFixed(2)} c/u)`)
    .join('\n');

  const messageLines = [
    `🛍️ *NUEVO PEDIDO [Ref: ${safeCode}]*`,
    ``,
    `👤 *Cliente:* ${safeName}`,
    `📞 *Teléfono:* ${safePhone}`,
    `🚚 *Entrega:* ${customerInfo.deliveryMethod}`,
    `📍 *Dirección:* ${safeAddress}`,
    `💳 *Pago:* ${customerInfo.paymentMethod}`,
    ``,
    `🛒 *Productos:*`,
    itemsList,
    ``,
    `------------------------------`,
    `💵 *Total USD:* $${totalUSD.toFixed(2)} USD`,
    `🇻🇪 *Total Bs:* ${totalVES.toFixed(2)} Bs.`,
    `📊 *Tasa BCV Aplicada:* ${bcvRate.toFixed(2)} Bs./$`,
    ``,
    `📌 *Por favor confirma los datos para proceder con el pago y envío.*`
  ];

  const fullText = messageLines.join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullText)}`;
}
