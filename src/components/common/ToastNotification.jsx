'use client';

import React from 'react';
import { ShoppingBag, CheckCircle, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function ToastNotification() {
  const { toast, setIsCartOpen } = useStore();

  if (!toast || !toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center space-x-4 max-w-sm">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-rose-400" />
        </div>

        <div className="flex-1">
          <p className="text-xs font-bold text-rose-300 uppercase tracking-wider">{toast.title}</p>
          <p className="text-sm font-semibold text-white line-clamp-1">{toast.message}</p>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 flex-shrink-0"
        >
          <span>Ver</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
