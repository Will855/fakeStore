'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUSD, formatVES } from '@/lib/utils';

export default function NewCollection() {
  const { products, addToCart, bcvRate } = useStore();
  const newProducts = products.filter(p => p.isNew).slice(0, 4);

  return (
    <section className="py-16 bg-white border-b border-rose-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
          <div>
            <div className="text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
              <span>Recién Llegados</span>
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Nueva Colección
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-xs mt-2 sm:mt-0">
            Las últimas tendencias en moda femenina con disponibilidad inmediata en tienda.
          </p>
        </div>

        {/* Grid de Productos Nuevos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-rose-100 rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-rose-500/5 hover:border-rose-300 group"
            >
              <div>
                <Link href={`/producto/${product.id}`} className="block relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-rose-50/50">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-sm">
                    Nuevo
                  </span>
                </Link>

                <span className="text-[10px] text-rose-500 uppercase font-bold tracking-wider">{product.category}</span>
                <Link href={`/producto/${product.id}`} className="block hover:text-rose-600 transition-colors">
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mb-1">{product.title}</h3>
                </Link>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{product.description}</p>
              </div>

              <div className="pt-3 border-t border-rose-100/60 flex items-center justify-between">
                <div>
                  <p className="text-base font-black text-rose-600">{formatUSD(product.priceUSD)}</p>
                  <p className="text-[10px] text-slate-400">{formatVES(product.priceUSD * bcvRate)}</p>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl font-bold transition-all border border-rose-200"
                  title="Agregar al Carrito"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
