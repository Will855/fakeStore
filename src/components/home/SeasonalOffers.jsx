'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tag, ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUSD, formatVES } from '@/lib/utils';

export default function SeasonalOffers() {
  const { products, addToCart, bcvRate } = useStore();
  const offerProducts = products.filter(p => p.isOffer);

  return (
    <section className="py-16 bg-rose-50/20 border-b border-rose-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
          <div>
            <div className="flex items-center space-x-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Tag className="w-4 h-4" />
              <span>Descuentos Especiales</span>
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Ofertas de Temporada
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-xs mt-2 sm:mt-0">
            Precios rebajados por tiempo limitado en prendas seleccionadas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerProducts.map((product) => {
            const discountedPriceUSD = product.priceUSD * (1 - product.discountPercentage / 100);

            return (
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
                    <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase shadow-sm">
                      -{product.discountPercentage}% OFF
                    </span>
                  </Link>

                  <span className="text-[10px] text-rose-500 uppercase font-bold tracking-wider">{product.category}</span>
                  <Link href={`/producto/${product.id}`} className="block hover:text-rose-600 transition-colors">
                    <h3 className="text-base font-bold text-slate-800 mb-1">{product.title}</h3>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{product.description}</p>
                </div>

                <div className="pt-4 border-t border-rose-100/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black text-rose-600">{formatUSD(discountedPriceUSD)}</span>
                      <span className="text-xs text-slate-400 line-through">{formatUSD(product.priceUSD)}</span>
                    </div>
                    <p className="text-xs text-slate-400">{formatVES(discountedPriceUSD * bcvRate)}</p>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl font-bold transition-all border border-rose-200"
                    title="Aprovechar Oferta"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
