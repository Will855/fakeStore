'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUSD, formatVES } from '@/lib/utils';

export default function FeaturedProducts() {
  const { products, addToCart, bcvRate } = useStore();
  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <section className="py-16 bg-white border-b border-rose-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
          <div>
            <div className="text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
              <span>Favoritos de nuestras clientes</span>
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Prendas Destacadas
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-xs mt-2 sm:mt-0">
            Los looks más buscados e ideales para armar tu outfit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-rose-100 rounded-2xl p-5 flex flex-col justify-between hover:border-rose-300 hover:shadow-lg hover:shadow-rose-500/5 transition-all group"
            >
              <div>
                <Link href={`/producto/${product.id}`} className="block relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-rose-50/50">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock <= 3 && product.stock > 0 && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-sm">
                      Pocos en tienda ({product.stock})
                    </span>
                  )}
                </Link>

                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] text-rose-500 uppercase font-bold tracking-wider">{product.category}</span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200/80">
                    Destacado
                  </span>
                </div>

                <Link href={`/producto/${product.id}`} className="block hover:text-rose-600 transition-colors">
                  <h3 className="text-base font-bold text-slate-800 mb-1">{product.title}</h3>
                </Link>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{product.description}</p>
              </div>

              <div className="pt-4 border-t border-rose-100/60 flex items-center justify-between">
                <div>
                  <p className="text-lg font-black text-rose-600">{formatUSD(product.priceUSD)}</p>
                  <p className="text-xs text-slate-400">{formatVES(product.priceUSD * bcvRate)}</p>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl flex items-center space-x-2 transition-all text-xs shadow-md shadow-rose-500/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
