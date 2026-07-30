'use client';

import React from 'react';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Categories() {
  const { categories, products } = useStore();

  return (
    <section className="py-16 bg-rose-50/20 border-b border-rose-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Colección Femenina</span>
          </div>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Categorías de Moda
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Encuentra prendas de vestir y accesorios diseñados para resaltar tu belleza y estilo.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.id).length;

            return (
              <Link
                key={cat.id}
                href={`/tienda?cat=${cat.id}`}
                className="group bg-white p-6 rounded-2xl border border-rose-100/80 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-500/5 transition-all text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">{count} ítems</p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
