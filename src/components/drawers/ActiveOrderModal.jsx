'use client';

import React from 'react';
import { AlertTriangle, Edit3, PlusCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUSD, formatVES } from '@/lib/utils';

export default function ActiveOrderModal() {
  const {
    activeOrder,
    showActiveOrderModal,
    setShowActiveOrderModal,
    cancelActiveOrder,
    restoreActiveOrderToCart
  } = useStore();

  if (!showActiveOrderModal || !activeOrder) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setShowActiveOrderModal(false)}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-amber-300 p-6 shadow-2xl text-slate-900 space-y-6">
        
        <div className="flex items-center space-x-3 text-amber-600">
          <div className="p-3 bg-amber-50 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tienes un Pedido en Progreso</h3>
            <p className="text-xs text-slate-500">Referencia: #{activeOrder.orderCode}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-2">
          <p className="text-slate-700">
            Ya enviaste un pedido a WhatsApp y está pendiente por confirmación del administrador.
          </p>
          <div className="flex justify-between pt-2 border-t border-amber-200">
            <span className="text-slate-500">Monto total enviado:</span>
            <span className="font-bold text-emerald-600">{formatUSD(activeOrder.totalUSD)} ({formatVES(activeOrder.totalVES)})</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={restoreActiveOrderToCart}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2 text-xs transition-colors shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Pedido Anterior (Devolver al Carrito)</span>
          </button>

          <button
            onClick={cancelActiveOrder}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center space-x-2 text-xs transition-colors border border-slate-200"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Crear un Nuevo Carrito</span>
          </button>
        </div>

      </div>
    </div>
  );
}
