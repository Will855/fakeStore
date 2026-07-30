'use client';

import React, { useState } from 'react';
import { X, Send, ShieldCheck, ChevronDown } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUSD, formatVES, generateWhatsAppLink } from '@/lib/utils';

export default function CheckoutModal() {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartSubtotalUSD,
    cartSubtotalVES,
    bcvRate,
    ownerPhone,
    processOrderAndDeductStock
  } = useStore();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'MRW / Tealca (Envío Nacional)',
    address: '',
    paymentMethod: 'Pago Móvil (Bs.)',
  });

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Por favor completa tu nombre y número de teléfono.');
      return;
    }

    const orderCode = `FK-${Math.floor(1000 + Math.random() * 9000)}`;
    const whatsappUrl = generateWhatsAppLink(
      ownerPhone,
      orderCode,
      customerInfo,
      cart,
      cartSubtotalUSD,
      cartSubtotalVES,
      bcvRate
    );

    // Descontar el stock y registrar el pedido en progreso en el estado global
    processOrderAndDeductStock({
      orderCode,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone
    });

    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank');
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCheckoutOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-slate-900 my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Checkout & Logística de Pago</h3>
              <p className="text-xs text-slate-500">Coordinación directa de entrega en Venezuela</p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Resumen de Montos */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-medium">Monto Total a Pagar</p>
              <p className="text-2xl font-black text-emerald-600">{formatVES(cartSubtotalVES)}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Equivalente USD</span>
              <p className="text-lg font-bold text-slate-900">{formatUSD(cartSubtotalUSD)}</p>
              <p className="text-[10px] text-slate-400">Tasa BCV: {bcvRate.toFixed(2)} Bs./$</p>
            </div>
          </div>

          {/* Sección 1: Datos Personales */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>1. Datos del Comprador</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Juan Pérez"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="ej. 0414-1234567"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Envíos y Logística */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>2. Método de Entrega y Dirección</span>
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Opción de Logística</label>
              <div className="relative flex items-center">
                <select
                  value={customerInfo.deliveryMethod}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryMethod: e.target.value })}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none font-semibold cursor-pointer"
                >
                  <option value="MRW / Tealca (Envío Nacional)">Envío Nacional (MRW / Tealca / Zoom)</option>
                  <option value="Delivery Caracas (Pickup o Moto)">Delivery (Servicio Yummy / Mensajero)</option>
                  <option value="Retiro en Persona en Tienda">Retiro en Persona en Tienda / Local</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección Exacta o Agencia de Envío</label>
              <input
                type="text"
                placeholder="ej. Agencia MRW Chacao / Urb. El Cafetal Calle 3"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Sección 3: Métodos de Pago Venezuela */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>3. Método de Pago Preferido</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Pago Móvil (Bs.)', label: 'Pago Móvil (Bs.)', desc: 'Banco Banesco / Mercantil' },
                { id: 'Zelle (USD)', label: 'Zelle ($)', desc: 'Cuenta directa' },
                { id: 'Binance Pay (USDT)', label: 'Binance Pay', desc: 'Pay ID directo' },
                { id: 'Efectivo en Entrega', label: 'Efectivo ($ / Bs.)', desc: 'Solo entregas personales' },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: method.id })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    customerInfo.paymentMethod === method.id
                      ? 'bg-emerald-50 border-emerald-600 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{method.label}</p>
                  <p className="text-[10px] text-slate-500">{method.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md flex items-center justify-center space-x-3 transition-all text-base"
            >
              <Send className="w-5 h-5" />
              <span>Confirmar Pedido y Enviar a WhatsApp</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
