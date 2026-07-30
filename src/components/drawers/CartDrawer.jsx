'use client';

import React from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUSD, formatVES } from '@/lib/utils';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalUSD,
    cartSubtotalVES,
    bcvRate,
    setIsCheckoutOpen
  } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-900">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Carrito de Compras</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Lista de Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-semibold text-slate-700">Tu carrito está vacío</p>
                <p className="text-xs text-slate-500 max-w-xs">Explora nuestro catálogo y agrega prendas para comenzar tu compra.</p>
              </div>
            ) : (
              cart.map((item) => {
                const effectivePrice = item.product.isOffer && item.product.discountPercentage > 0
                  ? item.product.priceUSD * (1 - item.product.discountPercentage / 100)
                  : item.product.priceUSD;

                return (
                  <div
                    key={item.product.id}
                    className="flex space-x-4 p-3 rounded-xl bg-white border border-slate-200 shadow-sm"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-emerald-600 font-bold mt-0.5">
                          {formatUSD(effectivePrice)}
                          <span className="text-slate-400 text-[10px] ml-1.5 font-normal">
                            ({formatVES(effectivePrice * bcvRate)})
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="text-slate-600 hover:text-slate-900 p-0.5"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="text-slate-600 hover:text-slate-900 p-0.5"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-slate-900">
                          {formatUSD(effectivePrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer del Drawer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal USD:</span>
                  <span className="font-bold text-slate-900">{formatUSD(cartSubtotalUSD)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold text-base">
                  <span>Total en Bs (Tasa BCV):</span>
                  <span>{formatVES(cartSubtotalVES)}</span>
                </div>
                <p className="text-[10px] text-slate-400 text-right">Tasa oficial: {bcvRate.toFixed(2)} Bs./$</p>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                <span>Procesar Pedido</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
